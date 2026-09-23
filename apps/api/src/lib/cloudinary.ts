/**
 * Cloudinary — génération d'URLs signées pour assets AUTHENTICATED.
 *
 * Algorithme verrouillé par les sondes V6-V8 (voir docs/STOCKAGE-CLOUDINARY.md) :
 *   signature = base64url( SHA1( to_sign + API_SECRET ) )[0:8]
 *   to_sign   = transformation ? "{transformation}/{public_id}" : "{public_id}"
 *   URL       = https://res.cloudinary.com/{cloud}/{resource_type}/authenticated/s--{sig}--/v{ver}/{public_id}
 *
 * ⚠️ Le segment est `/authenticated/` (PAS `/upload/`), le to_sign NE contient PAS
 * le préfixe de type, et la version n'est PAS signée (cache-buster).
 */

const encoder = new TextEncoder();

/** SHA-1 hexadécimal (Web Crypto, supporté par Workers). */
async function sha1(input: string): Promise<ArrayBuffer> {
  return crypto.subtle.digest('SHA-1', encoder.encode(input));
}

/** base64 standard converti en base64url (Cloudinary attend le remplacement +/ → -_). */
function toBase64url(buf: ArrayBuffer): string {
  let bin = '';
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]!);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_');
}

/** Signature courte d'URL (8 caractères). */
export async function shortSignature(toSign: string, apiSecret: string): Promise<string> {
  const digest = await sha1(toSign + apiSecret);
  return toBase64url(digest).slice(0, 8);
}

export interface SignedUrlOptions {
  resourceType?: 'image' | 'video';
  /** Transformation Cloudinary (ex: vignette/flou « c_limit,w_400/f_auto,q_auto »). */
  transformation?: string;
  /** Version de l'asset (celle renvoyée à l'upload) ; défaut 1. */
  version?: number;
  /** Extension explicite (défaut : déduite du public_id, ex .jpg/.webm). */
  ext?: string;
}

/**
 * Construit une URL signée d'un asset authentifié.
 * Le Worker ne l'appelle JAMAIS sans avoir vérifié l'autorisation en D1 :
 * c'est la garantie de la révélation consentie (cf. STOCKAGE-CLOUDINARY.md §3).
 */
export async function signedMediaUrl(
  cloudName: string,
  apiSecret: string,
  publicId: string,
  opts: SignedUrlOptions = {},
): Promise<string> {
  const { resourceType = 'image', transformation = '', version = 1, ext } = opts;
  const fullId = ext ? `${publicId}.${ext}` : publicId;
  const toSign = transformation ? `${transformation}/${fullId}` : fullId;
  const sig = await shortSignature(toSign, apiSecret);
  // Structure validée par la sonde V5 : la transformation figure DANS le chemin
  // de l'URL, juste après le segment de signature (sinon Cloudinary répond 401 —
  // il recalculerait une signature sur un to_sign différent).
  const tail = transformation
    ? `s--${sig}--/${transformation}/v${version}/${fullId}`
    : `s--${sig}--/v${version}/${fullId}`;
  return `https://res.cloudinary.com/${cloudName}/${resourceType}/authenticated/${tail}`;
}

/**
 * Signature API (upload/destroy côté serveur) : sha1 de « k1=v1&k2=v2 » trié + secret.
 * Utilisée par le Worker pour pousser des assets sans exposer le secret au client.
 */
export async function apiSignature(
  params: Record<string, string>,
  apiSecret: string,
): Promise<string> {
  const toSign =
    Object.keys(params)
      .filter((k) => params[k] !== '')
      .sort()
      .map((k) => `${k}=${params[k]}`)
      .join('&') + apiSecret;
  const digest = await sha1(toSign);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Dossier de stockage d'un média utilisateur. */
export function mediaFolder(root: string, userId: string, kind: 'photos' | 'voicenotes'): string {
  return `${root}/${kind}/${userId}`;
}

// ---------------------------------------------------------------------------
// Upload / destruction côté Worker (le secret ne quitte JAMAIS le serveur —
// décision STOCKAGE-CLOUDINARY.md §4 : l'upload direct client→Cloudinary avec
// signature éphémère a été évalué puis rejeté).
// ---------------------------------------------------------------------------

export interface UploadedImage {
  publicId: string;
  version: number;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

/** Response minimale de l'API Cloudinary (upload/destroy). */
interface CloudinaryApiResult {
  public_id?: string;
  version?: number;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  result?: string;
  error?: { message?: string };
}

/**
 * Upload d'une image en type AUTHENTICATED (privée — 404 sans signature).
 * Signature API = sha1('public_id=…&timestamp=…&type=authenticated' + secret).
 */
export async function uploadAuthenticatedImage(
  env: { CLOUDINARY_CLOUD_NAME: string; CLOUDINARY_API_KEY: string; CLOUDINARY_API_SECRET: string },
  file: Blob,
  publicId: string,
): Promise<UploadedImage> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const params = { public_id: publicId, timestamp, type: 'authenticated' };
  const signature = await apiSignature(params, env.CLOUDINARY_API_SECRET);

  const form = new FormData();
  form.append('file', file);
  form.append('api_key', env.CLOUDINARY_API_KEY);
  form.append('timestamp', timestamp);
  form.append('type', 'authenticated');
  form.append('public_id', publicId);
  form.append('signature', signature);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: form },
  );
  const data = (await res.json().catch(() => null)) as CloudinaryApiResult | null;
  if (!res.ok || !data?.public_id) {
    const detail = data?.error?.message ?? `HTTP ${res.status}`;
    throw new Error(`cloudinary_upload_failed: ${detail}`);
  }
  return {
    publicId: data.public_id,
    version: data.version ?? 1,
    width: data.width ?? 0,
    height: data.height ?? 0,
    format: data.format ?? 'webp',
    bytes: data.bytes ?? 0,
  };
}

/**
 * Destruction d'un asset AUTHENTICATED — le paramètre type=authenticated est
 * OBLIGATOIRE (sinon « not found », cf. sondes V7). Best-effort chez l'appelant.
 */
export async function destroyAuthenticatedAsset(
  env: { CLOUDINARY_CLOUD_NAME: string; CLOUDINARY_API_KEY: string; CLOUDINARY_API_SECRET: string },
  publicId: string,
): Promise<'ok' | 'not found' | 'error'> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const params = { public_id: publicId, timestamp, type: 'authenticated' };
  const signature = await apiSignature(params, env.CLOUDINARY_API_SECRET);

  const form = new FormData();
  form.append('api_key', env.CLOUDINARY_API_KEY);
  form.append('timestamp', timestamp);
  form.append('type', 'authenticated');
  form.append('public_id', publicId);
  form.append('signature', signature);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/destroy`,
    { method: 'POST', body: form },
  );
  const data = (await res.json().catch(() => null)) as CloudinaryApiResult | null;
  if (data?.result === 'ok') return 'ok';
  if (data?.result === 'not found') return 'not found';
  return 'error';
}

/**
 * Upload d'une VOICE NOTE en type AUTHENTICATED — resource_type « video »
 * (Cloudinary range l'audio sous video). Le format renvoyé (webm/m4a/ogg…)
 * sert d'extension pour les URLs signées de lecture.
 */
export async function uploadAuthenticatedAudio(
  env: { CLOUDINARY_CLOUD_NAME: string; CLOUDINARY_API_KEY: string; CLOUDINARY_API_SECRET: string },
  file: Blob,
  publicId: string,
): Promise<{ publicId: string; version: number; format: string; bytes: number }> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const params = { public_id: publicId, timestamp, type: 'authenticated' };
  const signature = await apiSignature(params, env.CLOUDINARY_API_SECRET);

  const form = new FormData();
  form.append('file', file, 'note.webm');
  form.append('api_key', env.CLOUDINARY_API_KEY);
  form.append('timestamp', timestamp);
  form.append('type', 'authenticated');
  form.append('public_id', publicId);
  form.append('signature', signature);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/video/upload`,
    { method: 'POST', body: form },
  );
  const data = (await res.json().catch(() => null)) as CloudinaryApiResult | null;
  if (!res.ok || !data?.public_id) {
    const detail = data?.error?.message ?? `HTTP ${res.status}`;
    throw new Error(`cloudinary_voice_upload_failed: ${detail}`);
  }
  return {
    publicId: data.public_id,
    version: data.version ?? 1,
    format: data.format ?? 'webm',
    bytes: data.bytes ?? 0,
  };
}

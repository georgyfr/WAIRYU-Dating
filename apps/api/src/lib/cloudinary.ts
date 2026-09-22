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
  return (
    `https://res.cloudinary.com/${cloudName}/${resourceType}/authenticated/` +
    `s--${sig}--/v${version}/${fullId}`
  );
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

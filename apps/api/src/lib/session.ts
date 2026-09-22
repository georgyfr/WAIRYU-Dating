/**
 * Cookies de session signés (HMAC-SHA256).
 * Format : {sid}.{exp}.{sig} — sid aléatoire 32 hex, exp en secondes,
 * sig = base64url(HMAC_SHA256(sid + "." + exp, clé)). Vérification + revocation D1 (Étape 2).
 */

const encoder = new TextEncoder();

function toBase64url(buf: ArrayBuffer): string {
  let bin = '';
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]!);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_');
}

async function hmac(input: string, key: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return toBase64url(await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(input)));
}

/** Temps constant — évite les fuites de timing sur la comparaison de signatures. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export interface SignedCookie {
  sid: string;
  exp: number;
}

/** Signe une session en cookie. */
export async function signSessionCookie(sid: string, exp: number, key: string): Promise<string> {
  const payload = `${sid}.${exp}`;
  return `${payload}.${await hmac(payload, key)}`;
}

/** Vérifie un cookie signé ; retourne null si invalide ou expiré. */
export async function verifySessionCookie(
  value: string | undefined,
  key: string,
): Promise<SignedCookie | null> {
  if (!value) return null;
  const parts = value.split('.');
  if (parts.length !== 3) return null;
  const [sid, expStr, sig] = parts as [string, string, string];
  const exp = Number(expStr);
  if (!sid || !Number.isFinite(exp) || exp * 1000 < Date.now()) return null;
  const expected = await hmac(`${sid}.${expStr}`, key);
  if (!timingSafeEqual(sig, expected)) return null;
  return { sid, exp };
}

export const SESSION_COOKIE_NAME = 'wairyu_s';

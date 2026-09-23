/**
 * TOTP RFC 6238 (Étape 7 — backoffice 2FA « simple ») — 100 % Workers,
 * zéro dépendance : HMAC-SHA-1 via crypto.subtle (WebCrypto supporte SHA-1
 * pour HMAC), base32 décodé à la main (RFC 4648, alphabet A-Z 2-7).
 *
 * Usage backoffice :
 *   1. POST /admin/2fa/setup    → { secret, otpauthUri } (KV CONFIG, non actif) ;
 *   2. l'admin enregistre le secret dans son app authenticator ;
 *   3. POST /admin/2fa/activate { token } → vérifie puis active ;
 *   4. ensuite TOUT /admin/* exige l'en-tête X-Admin-TOTP (±1 pas de 30 s).
 */

const B32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

/** Décode un secret base32 (tolère espaces/majuscules/padding). */
export function base32Decode(input: string): Uint8Array {
  const clean = input.toUpperCase().replace(/[\s=-]/g, '');
  let bits = 0;
  let value = 0;
  const out: number[] = [];
  for (const ch of clean) {
    const idx = B32_ALPHABET.indexOf(ch);
    if (idx === -1) throw new Error('base32 invalide');
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return new Uint8Array(out);
}

/** Génère un secret TOTP de 20 octets (160 bits) en base32. */
export function generateTotpSecret(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  let bits = 0;
  let value = 0;
  let out = '';
  for (const b of bytes) {
    value = (value << 8) | b;
    bits += 8;
    while (bits >= 5) {
      out += B32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += B32_ALPHABET[(value << (5 - bits)) & 31];
  return out;
}

async function hmacSha1(keyBytes: Uint8Array, counter: bigint): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    'raw',
    keyBytes as unknown as ArrayBuffer,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign'],
  );
  // Compteur = 8 octets big-endian
  const msg = new Uint8Array(8);
  let c = counter;
  for (let i = 7; i >= 0; i--) {
    msg[i] = Number(c & 0xffn);
    c >>= 8n;
  }
  const sig = await crypto.subtle.sign('HMAC', key, msg as unknown as ArrayBuffer);
  return new Uint8Array(sig);
}

/** Code TOTP à 6 chiffres pour un pas de temps donné (défaut : maintenant). */
export async function totpAt(secretB32: string, timeStep?: number): Promise<string> {
  const step = timeStep ?? Math.floor(Date.now() / 1000 / 30);
  const key = base32Decode(secretB32);
  const mac = await hmacSha1(key, BigInt(step));
  const offset = mac[19]! & 0x0f;
  const bin =
    ((mac[offset]! & 0x7f) << 24) |
    ((mac[offset + 1]! & 0xff) << 16) |
    ((mac[offset + 2]! & 0xff) << 8) |
    (mac[offset + 3]! & 0xff);
  return String(bin % 1_000_000).padStart(6, '0');
}

/**
 * Vérifie un code fourni avec tolérance ±1 pas (30 s) — absorbe la latence
 * réseau et l'horloge de l'authenticator. Comparaison à temps constant.
 */
export async function verifyTotp(secretB32: string, token: string, window = 1): Promise<boolean> {
  const clean = (token ?? '').replace(/\D/g, '');
  if (clean.length !== 6) return false;
  const nowStep = Math.floor(Date.now() / 1000 / 30);
  for (let drift = -window; drift <= window; drift++) {
    const expected = await totpAt(secretB32, nowStep + drift);
    if (timingSafeEqual(clean, expected)) return true;
  }
  return false;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** URI otpauth:// prête à être encodée en QR (l'admin l'importe manuellement). */
export function otpauthUri(secretB32: string): string {
  return `otpauth://totp/Wairyu%20admin?secret=${secretB32}&issuer=Wairyu&algorithm=SHA1&digits=6&period=30`;
}

import { errors } from './errors';

/**
 * Task 58 (fondateur) — inscription/connexion classique pseudo + mot de passe.
 *
 * Pourquoi PBKDF2 via WebCrypto et pas bcrypt/argon2 : Workers n'a PAS de
 * lib natives — crypto.subtle.deriveBits est la primitive conforme disponible,
 * PBKDF2-SHA256 100k itérations + sel 16 o par compte. Le stockage est une
 * chaîne auto-descriptive « pbkdf2$<iterations>$<salt hex>$<hash hex> » : les
 * itérations peuvent monter plus tard sans casser les hash existants
 * (verifyPassword lit les itérations DEPUIS la chaîne).
 *
 * Le pseudo : Task 61 (fondateur) — le pseudo saisi accepte espaces, accents,
 * tirets, apostrophes (normalizeUsernameDisplay = forme AFFICHÉE) ; la forme
 * CANONIQUE de recherche (normalizeUsername) minuscule/accents-repliés/
 * non-[a-z0-9_] retirés permet « Marie Claire » ≡ « marie claire » ≡
 * « marieclaire » — même identifiant, zéro casse-tête au clavier.
 *
 * Le code de récupération (12 caractères « XXXX-XXXX-XXXX », alphabet sans
 * ambiguïté O/0/I/1) reprend un compte SANS email — c'est la clé de secours
 * affichée UNE fois à l'inscription.
 */

export const PBKDF2_ITERATIONS = 100_000;
export const SALT_BYTES = 16;
export const KEY_BITS = 256;

/**
 * Forme canonique de recherche : minuscule, accents repliés, tout ce qui
 * n'est pas [a-z0-9_] retiré. Vide = pseudo invalide après repli (ex. « --- »).
 */
export function normalizeUsername(raw: string): string {
  const folded = raw
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9_]/g, '');
  return /^[a-z0-9_]{3,20}$/.test(folded) ? folded : '';
}

/** Message d'erreur centralisé pour un pseudo invalide (Task 61 : espaces OK). */
export function usernameError(): never {
  throw errors.badRequest(
    'Le pseudo doit contenir entre 3 et 20 caractères : lettres (accents acceptés), chiffres, espaces, tirets ou apostrophes.',
  );
}

/** Politique mot de passe : 8..128 caractères. Retourne le message ou null. */
export function passwordPolicyError(pw: string): string | null {
  if (typeof pw !== 'string' || pw.length < 8) {
    return 'Le mot de passe doit contenir au moins 8 caractères.';
  }
  if (pw.length > 128) return 'Le mot de passe ne doit pas dépasser 128 caractères.';
  return null;
}

async function pbkdf2(password: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, [
    'deriveBits',
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: salt as BufferSource, iterations },
    key,
    KEY_BITS,
  );
  return new Uint8Array(bits);
}

function toHex(bytes: Uint8Array): string {
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Hash stockable « pbkdf2$iter$salt$hash » (sel aléatoire par compte). */
export async function hashPassword(password: string): Promise<string> {
  const salt = new Uint8Array(SALT_BYTES);
  crypto.getRandomValues(salt);
  const hash = await pbkdf2(password, salt, PBKDF2_ITERATIONS);
  return `pbkdf2$${PBKDF2_ITERATIONS}$${toHex(salt)}$${toHex(hash)}`;
}

/** Vérifie contre la chaîne stockée (lit les itérations depuis celle-ci). */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$');
  const [scheme, iterRaw, saltHex, expected] = parts;
  if (!scheme || !iterRaw || !saltHex || !expected || scheme !== 'pbkdf2') return false;
  const iterations = Number.parseInt(iterRaw, 10);
  if (!Number.isFinite(iterations) || saltHex.length !== SALT_BYTES * 2 || expected.length !== 64) {
    return false;
  }
  const salt = new Uint8Array((saltHex.match(/.{2}/g) ?? []).map((h) => Number.parseInt(h, 16)));
  if (salt.length !== SALT_BYTES) return false;
  const hash = await pbkdf2(password, salt, iterations);
  // Comparaison à temps constant (XOR accumulé) — pas de early-return sur le hex.
  let diff = 0;
  const hex = toHex(hash);
  for (let i = 0; i < 64; i++) diff |= hex.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

// ---------------------------------------------------------------------------
// Code de récupération (12 caractères, alphabet sans ambiguïté)
// ---------------------------------------------------------------------------

const RECOVERY_ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

/** « XXXX-XXXX-XXXX » — 30 bits d'entropie réels suffisent (verrou IP + user). */
export function generateRecoveryCode(): string {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  const chars = [...bytes].map((b) => RECOVERY_ALPHABET[b % RECOVERY_ALPHABET.length]);
  return `${chars.slice(0, 4).join('')}-${chars.slice(4, 8).join('')}-${chars.slice(8, 12).join('')}`;
}

/**
 * Normalise une SAISIE de code : majuscule, O→0 non appliqué (alphabet déjà
 * sans O/0/I/1) mais 0→O et 1→I tolérés (clavier téléphone), ponctuation
 * retirée — « abcd-efgh-jklm », « ABCD EFGH JKLM » et « ABCDEFGHJKLM »
 * convergent.
 */
export function normalizeRecoveryCode(raw: string): string {
  return raw
    .trim()
    .toUpperCase()
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z0-9]/g, '')
    .replace(/^0/g, 'O')
    .replace(/1/g, 'I');
}

/** SHA-256 hex (double emploi du nom en bundle = collision de noms évitée). */
export async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return toHex(new Uint8Array(digest));
}

// ---------------------------------------------------------------------------
// Pseudo affiché (Task 61)
// ---------------------------------------------------------------------------

/** Lettres (Unicode, accents inclus), chiffres, espaces, point, virgule, apostrophes, tirets, underscore. */
export const USERNAME_DISPLAY_RE = /^[\p{L}\p{N} .,'’_-]+$/u;

/**
 * Forme AFFICHÉE : trim + espaces compactés, 3..20 caractères, ET la forme
 * canonique doit rester connectable. Vide = invalide (la route renvoie
 * le message détaillé).
 */
export function normalizeUsernameDisplay(raw: string): string {
  const display = raw.trim().replace(/\s+/g, ' ');
  if (!USERNAME_DISPLAY_RE.test(display) || display.length < 3 || display.length > 20) return '';
  if (!/^[a-z0-9_]{3,20}$/.test(normalizeUsername(display))) return '';
  return display;
}

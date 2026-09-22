/**
 * OTP email — génération, hachage, vérification (Étape 2).
 * Code à 6 chiffres, TTL 10 min, 3 tentatives max, cooldown de renvoi 60 s.
 * Le code est stocké uniquement hashé (SHA-256) — un dump D1 ne permet pas
 * de récupérer les codes. La table auth_codes garde UN code actif par email.
 */

import { LIMITS } from '@wairyu/shared';
import { errors, AppError } from './errors';

export const OTP = {
  /** Durée de vie d'un code, en secondes (10 min, conformément au plan). */
  ttlSeconds: LIMITS.otpTtlMinutes * 60,
  /** Tentatives de vérification maximaues par code. */
  maxAttempts: 3,
  /** Délai minimal entre deux envois au même email (secondes). */
  resendCooldownSeconds: 60,
  /** Longueur du code. */
  length: 6,
} as const;

const encoder = new TextEncoder();

/** Hash SHA-256 hexadécimal. */
export async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(input));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Hash SHA-1 tronqué (12 hex) pour identifiants techniques (IP, UA) — anti-abus. */
export async function shortSha1Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-1', encoder.encode(input));
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 12);
}

/** Normalise un email : trim, minuscules. Retourne null si invalide. */
export function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const email = raw.trim().toLowerCase();
  // Regex pragmatique : local@domaine.tld — pas de RFC exhaustive (attaques d'exotisme bloquées).
  const re = /^[a-z0-9._%+-]{1,64}@[a-z0-9.-]{1,190}\.[a-z]{2,20}$/;
  if (!re.test(email) || email.includes('..') || email.startsWith('.') || email.endsWith('.')) {
    return null;
  }
  return email;
}

/** Génère un code OTP 6 chiffres cryptographiquement aléatoire (zéros initiaux possibles). */
export function generateOtpCode(length: number = OTP.length): string {
  const max = 10 ** length;
  const rand = new Uint32Array(1);
  crypto.getRandomValues(rand);
  return String(rand[0]! % max).padStart(length, '0');
}

export interface OtpRow {
  code_hash: string;
  attempts: number;
  created_at: number;
  expires_at: number;
  consumed_at: number | null;
}

/**
 * Vérifie un code soumis contre la ligne active.
 * Jette : otp_invalid (code faux, tentatives restantes), otp_locked (3 fausses),
 * otp_expired (TTL dépassé). Comparaison en temps constant sur les hash.
 */
export async function verifyOtpRow(
  row: OtpRow,
  submitted: string,
): Promise<void> {
  const now = Math.floor(Date.now() / 1000);
  if (row.consumed_at !== null) throw errors.badRequest('Code déjà utilisé. Demandez-en un nouveau.');
  if (row.expires_at < now) throw new AppErrorOtpExpired();
  if (row.attempts >= OTP.maxAttempts) throw new AppErrorOtpLocked();

  const ok = timingSafeEqualStr(await sha256Hex(submitted), row.code_hash);
  if (!ok) {
    const remaining = OTP.maxAttempts - (row.attempts + 1);
    if (remaining <= 0) throw new AppErrorOtpLocked();
    throw new AppErrorOtpInvalid(remaining);
  }
}

// --- Erreurs OTP typées (statut + code métier) ---

export class AppErrorOtpInvalid extends AppError {
  constructor(remaining: number) {
    super(400, 'otp_invalid', `Code incorrect. ${remaining} tentative${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''}.`);
  }
}
export class AppErrorOtpExpired extends AppError {
  constructor() {
    super(400, 'otp_expired', 'Code expiré. Demandez un nouveau code.');
  }
}
export class AppErrorOtpLocked extends AppError {
  constructor() {
    super(400, 'otp_locked', 'Trop de tentatives. Demandez un nouveau code.');
  }
}

/** Comparaison en temps constant. */
function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

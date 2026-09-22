/**
 * Rate limiting par compteur en D1 (Étape 2) — fenêtre fixe.
 * La table rate_limits utilise (key, window_start) comme clé primaire :
 * un INCREMENT atomique par UPSERT, compteur par fenêtre, ancienne fenêtre
 * ignorée naturellement (purge cron). Fenêtre fixe ≈ fenêtre glissante pour
 * des fenêtres courtes (10-60 min) — choix documenté (limite D1 : pas d'INCR redis-like).
 */

import type { AppError } from './errors';
import { errors } from './errors';

export interface RateRule {
  /** Préfixe de clé, ex. 'otp:ip'. */
  scope: string;
  /** Durée de la fenêtre en secondes. */
  windowSeconds: number;
  /** Nombre maximal d'occurrences autorisées par fenêtre. */
  max: number;
}

/** Règles anti-abus OTP (Étape 2). */
export const RATE_RULES = {
  /** Demandes de code par IP : 10 / heure. */
  otpRequestIp: { scope: 'otp:req:ip', windowSeconds: 3600, max: 10 },
  /** Demandes de code par email : 5 / heure. */
  otpRequestEmail: { scope: 'otp:req:email', windowSeconds: 3600, max: 5 },
  /** Vérifications par IP : 30 / heure (couvre les fautes de frappe). */
  otpVerifyIp: { scope: 'otp:ver:ip', windowSeconds: 3600, max: 30 },
  /** Vérifications par email : 10 / heure (brute-force killer). */
  otpVerifyEmail: { scope: 'otp:ver:email', windowSeconds: 3600, max: 10 },
  /** Échecs Turnstile par IP : 20 / heure (rebond doux). */
  turnstileFail: { scope: 'cf:ts:fail', windowSeconds: 3600, max: 20 },
} as const satisfies Record<string, RateRule>;

export interface RateResult {
  allowed: boolean;
  remaining: number;
  /** Secondes avant réinitialisation de la fenêtre. */
  retryAfterSeconds: number;
}

/**
 * Incrémente le compteur et indique si la requête passe.
 * Un seul UPSERT atomique — safe en concurrence D1.
 */
export async function hitRateLimit(
  db: D1Database,
  rule: RateRule,
  identifier: string,
): Promise<RateResult> {
  const now = Math.floor(Date.now() / 1000);
  const windowStart = Math.floor(now / rule.windowSeconds) * rule.windowSeconds;
  const key = `${rule.scope}:${identifier}`;

  const res = await db
    .prepare(
      `INSERT INTO rate_limits (key, window_start, count) VALUES (?, ?, 1)
       ON CONFLICT (key, window_start) DO UPDATE SET count = count + 1
       RETURNING count`,
    )
    .bind(key, windowStart)
    .first<{ count: number }>();

  const count = res?.count ?? 1;
  const retryAfter = windowStart + rule.windowSeconds - now;
  return {
    allowed: count <= rule.max,
    remaining: Math.max(0, rule.max - count),
    retryAfterSeconds: retryAfter,
  };
}

/** Construit l'erreur 429 correspondante avec Retry-After. */
export function rateLimitedError(retryAfterSeconds: number, scope: string): AppError {
  const minutes = Math.ceil(retryAfterSeconds / 60);
  const msg =
    scope.startsWith('otp:req')
      ? `Trop de codes demandés. Réessayez dans ${minutes} min.`
      : 'Trop de tentatives. Réessayez plus tard.';
  const e = errors.rateLimited(msg);
  return e;
}

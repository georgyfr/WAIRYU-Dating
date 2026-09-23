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
  /** Uploads de photos par utilisateur : 20 / heure (Étape 3, anti-abus stockage). */
  photoUploadUser: { scope: 'photo:up:user', windowSeconds: 3600, max: 20 },
  /** Géocodages inverses par utilisateur : 30 / heure (politique Nominatim + anti-abus). */
  geoReverseUser: { scope: 'geo:rev:user', windowSeconds: 3600, max: 30 },
  /** Réponses au questionnaire par utilisateur : 240 / heure (30 questions + révisions, large). */
  qAnswerUser: { scope: 'q:ans:user', windowSeconds: 3600, max: 240 },
  /** Appels feed par utilisateur : 60 / heure (pagination incluse — budget global 70/jour). */
  feedUser: { scope: 'feed:user', windowSeconds: 3600, max: 60 },
  /** Consultations/choix de personnalité : 60 / heure (lecture + validations, large). */
  personalityUser: { scope: 'pers:user', windowSeconds: 3600, max: 60 },

  // --- Étape 5 : découverte dual-mode ---
  /** Actions de swipe (toutes) : 400 / heure — anti-abus mécanique large. */
  discoverActionUser: { scope: 'disc:act:user', windowSeconds: 3600, max: 400 },
  /** QUOTA gratuit : 50 likes/jour (like et super consomment ce compteur). */
  discoverLikeUser: { scope: 'disc:like:user', windowSeconds: 86400, max: 50 },
  /** QUOTA gratuit : 1 Super Like/jour. */
  discoverSuperUser: { scope: 'disc:super:user', windowSeconds: 86400, max: 1 },
  /** QUOTA gratuit : 10 demandes « Discuter » (Invisible)/jour. */
  discoverInvisibleUser: { scope: 'disc:inv:user', windowSeconds: 86400, max: 10 },
  /** QUOTA gratuit : 1 Rewind/jour. */
  discoverRewindUser: { scope: 'disc:rew:user', windowSeconds: 86400, max: 1 },
  /** Réponses aux demandes/handshakes : 60 / heure. */
  discoverRespondUser: { scope: 'disc:resp:user', windowSeconds: 3600, max: 60 },
  /** Passerelle (proposition + réponse) : 30 / heure. */
  discoverGatewayUser: { scope: 'disc:gate:user', windowSeconds: 3600, max: 30 },
  /** Top Compatibilité : 30 / heure (hors quota feed — matérialisé en D1). */
  discoverTopUser: { scope: 'disc:top:user', windowSeconds: 3600, max: 30 },

  // --- Étape 6 : chat & révélation ---
  /** Envoi de messages en FALLBACK HTTP (le WS a son anti-spam DO). 240 / h. */
  chatSendUser: { scope: 'chat:send:user', windowSeconds: 3600, max: 240 },
  /** Uploads de voice notes : 30 / heure. */
  chatVoiceUser: { scope: 'chat:voice:user', windowSeconds: 3600, max: 30 },
  /** Demandes de révélation : 10 / heure (le seuil ≥15 msg / 7 j borne déjà). */
  chatRevealUser: { scope: 'chat:rev:user', windowSeconds: 3600, max: 10 },
  /** Réponses (révélation) + feedbacks + passerelles de chat : 60 / heure. */
  chatRespondUser: { scope: 'chat:resp:user', windowSeconds: 3600, max: 60 },
  /** Unmatch / blocage : 20 / heure. */
  chatUnmatchUser: { scope: 'chat:unm:user', windowSeconds: 3600, max: 20 },
  /** Abonnements push (subscribe/unsubscribe) : 30 / heure. */
  pushUser: { scope: 'push:sub:user', windowSeconds: 3600, max: 30 },
  /** Tickets WebSocket : 60 / heure (reconnexions tolérées largement). */
  chatTicketUser: { scope: 'chat:tk:user', windowSeconds: 3600, max: 60 },

  // --- Étape 7 : sécurité & modération ---
  /** Démarrages de vérification selfie : 5 / jour (anti-abus de la file). */
  safetyVerifyUser: { scope: 'safe:ver:user', windowSeconds: 86400, max: 5 },
  /** Soumissions de selfies : 10 / jour (3 poses par demande + réessais). */
  safetyVerifySubmit: { scope: 'safe:ver:sub', windowSeconds: 86400, max: 10 },
  /** Signalements : 10 / jour (le bouton ne doit jamais servir de spam). */
  safetyReportUser: { scope: 'safe:rep:user', windowSeconds: 86400, max: 10 },
  /** Check-ins (créations + clôtures) : 20 / jour. */
  safetyCheckinUser: { scope: 'safe:chk:user', windowSeconds: 86400, max: 20 },
  /** Toggles de confidentialité : 30 / heure. */
  safetyPrivacyUser: { scope: 'safe:priv:user', windowSeconds: 3600, max: 30 },
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

/**
 * Lit le compteur courant SANS incrémenter (affichage des quotas Étape 5).
 * Même fenêtre fixe que hitRateLimit — lecture seule, zéro écriture.
 */
export async function readWindowCount(
  db: D1Database,
  rule: RateRule,
  identifier: string,
): Promise<number> {
  const now = Math.floor(Date.now() / 1000);
  const windowStart = Math.floor(now / rule.windowSeconds) * rule.windowSeconds;
  const row = await db
    .prepare(`SELECT count FROM rate_limits WHERE key = ? AND window_start = ?`)
    .bind(`${rule.scope}:${identifier}`, windowStart)
    .first<{ count: number }>();
  return row?.count ?? 0;
}

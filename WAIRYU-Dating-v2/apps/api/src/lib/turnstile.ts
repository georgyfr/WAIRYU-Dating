/**
 * Cloudflare Turnstile — vérification côté serveur (Étape 2).
 * Le front instancie le widget avec la clé de site publique et transmet le
 * jeton ; le Worker le valide via siteverify (jamais de confiance au client).
 *
 * Politique par environnement :
 *   - production : stricte (fail-closed), TURNSTILE_SECRET obligatoire.
 *   - staging    : vérification SAUTÉE (environnement de test — smoke tests
 *     curl et parcours Gate 2 sans friction). Le widget reste rendu côté front.
 */

import type { Env } from '../env';
import { errors } from './errors';

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export interface TurnstileOutcome {
  /** true si la requête est acceptée (vérifiée OU vérification sautée en staging-dev). */
  ok: boolean;
  /** true si la vérification a été sautée (staging sans secret). */
  skipped: boolean;
}

export async function verifyTurnstile(
  c: { env: Env },
  token: unknown,
  ip: string | null,
): Promise<TurnstileOutcome> {
  const secret = c.env.TURNSTILE_SECRET;

  // Staging : vérification sautée (environnement de test documenté).
  if (c.env.ENVIRONMENT === 'staging') return { ok: true, skipped: true };

  if (!secret) {
    throw errors.internal('Turnstile non configuré (TURNSTILE_SECRET manquant en production).');
  }

  if (typeof token !== 'string' || token.length < 10 || token.length > 2048) {
    throw errors.forbidden('Validation anti-robot requise (Turnstile).');
  }

  const body = new FormData();
  body.set('secret', secret);
  body.set('response', token);
  if (ip) body.set('remoteip', ip);

  const res = await fetch(SITEVERIFY_URL, { method: 'POST', body });
  if (!res.ok) {
    // siteverify indisponible : fail-closed (production uniquement atteinte ici).
    throw errors.internal('Service anti-robot momentanément indisponible.');
  }
  const data = (await res.json()) as { success: boolean; 'error-codes'?: string[] };
  if (!data.success) throw errors.forbidden('Validation anti-robot échouée. Rechargez la page.');
  return { ok: true, skipped: false };
}

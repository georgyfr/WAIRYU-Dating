/**
 * Feed scoré (Étape 4) — route mince depuis le refactor Étape 5.
 * Toute la génération des candidats (requête pool, filtres durs, scoring,
 * photos signées, prompts, extraits, exclusions de découverte) vit dans
 * `lib/discovery.ts` : la même fonction sert le cron « Top Compatibilité »
 * et GET /api/discover/top — mêmes règles partout, zéro duplication.
 *
 * Ici : session, rate limit, headers de diagnostic (X-Wairyu-*), enveloppe.
 */
import { Hono } from 'hono';
import type { Context } from 'hono';
import type { AppEnv } from '../env';
import { errors } from '../lib/errors';
import { RATE_RULES, hitRateLimit, rateLimitedError } from '../lib/ratelimit';
import { generateFeedPage } from '../lib/discovery';

export const feedRoutes = new Hono<AppEnv>();

async function requireUser(c: Context<AppEnv>) {
  const session = c.get('session');
  if (!session) throw errors.unauthorized();
  const user = await c.env.DB.prepare(`SELECT id, status FROM users WHERE id = ? LIMIT 1`)
    .bind(session.userId)
    .first<{ id: string; status: string }>();
  if (!user || user.status === 'deleted') throw errors.unauthorized();
  if (user.status === 'banned') throw errors.forbidden('Compte suspendu.');
  return user;
}

feedRoutes.get('/feed', async (c) => {
  const user = await requireUser(c);
  const page = Math.max(1, Math.floor(Number(c.req.query('page') ?? '1')) || 1);

  const rl = await hitRateLimit(c.env.DB, RATE_RULES.feedUser, user.id);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.feedUser.scope);

  const { body, debug } = await generateFeedPage(c.env, user.id, page);

  c.header('X-Wairyu-Feed-Ms', String(debug.feedMs));
  c.header('X-Wairyu-Score-Ms', String(debug.scoreMs));
  c.header('X-Wairyu-Pool', String(debug.pool));
  c.header('X-Wairyu-Excluded-Db', String(debug.excludedDb));
  c.header('X-Wairyu-Excluded-Dist', String(debug.excludedDist));
  return c.json(body);
});

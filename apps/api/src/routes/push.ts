/**
 * Web Push (VAPID) — Étape 6.8.
 * Les secrets VAPID_* sont OPTIONNELS : sans eux, l'API répond
 * { enabled:false } et rien ne se passe (dégradation gracieuse, aucune erreur
 * côté front). L'envoi lui-même vit dans lib/push.ts (appels DO + Worker).
 */
import { Hono } from 'hono';
import type { Context } from 'hono';
import type { AppEnv } from '../env';
import { errors } from '../lib/errors';
import { pushEnabled } from '../lib/push';
import { RATE_RULES, hitRateLimit, rateLimitedError } from '../lib/ratelimit';
import type { PushConfigResponse, PushSubscribeResponse } from '@wairyu/shared';

export const pushRoutes = new Hono<AppEnv>();

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

/** GET /api/push/key — clé publique VAPID à passer au pushManager.subscribe. */
pushRoutes.get('/push/key', async (c) => {
  const enabled = await pushEnabled(c.env);
  const body: PushConfigResponse = { enabled, publicKey: enabled ? (c.env.VAPID_PUBLIC_KEY ?? null) : null };
  return c.json(body);
});

/** POST /api/push/subscribe {endpoint, keys:{p256dh, auth}} — 1 ligne/appareil. */
pushRoutes.post('/push/subscribe', async (c) => {
  const user = await requireUser(c);
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.pushUser, user.id);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.pushUser.scope);

  const enabled = await pushEnabled(c.env);
  if (!enabled) {
    const body: PushSubscribeResponse = { ok: true, enabled: false };
    return c.json(body);
  }

  const payload = (await c.req.json().catch(() => null)) as {
    endpoint?: unknown;
    keys?: { p256dh?: unknown; auth?: unknown };
  } | null;
  const endpoint = typeof payload?.endpoint === 'string' ? payload.endpoint : '';
  const p256dh = typeof payload?.keys?.p256dh === 'string' ? payload.keys.p256dh : '';
  const auth = typeof payload?.keys?.auth === 'string' ? payload.keys.auth : '';
  if (!endpoint.startsWith('https://') || !p256dh || !auth) {
    throw errors.badRequest('Abonnement push invalide.');
  }
  if (endpoint.length > 1024) throw errors.badRequest('Endpoint trop long.');

  const now = Math.floor(Date.now() / 1000);
  const ua = (c.req.header('user-agent') ?? '').slice(0, 200);
  await c.env.DB.prepare(
    `INSERT INTO push_subscriptions (endpoint, user_id, p256dh, auth, user_agent, created_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT (endpoint) DO UPDATE SET
       user_id = excluded.user_id, p256dh = excluded.p256dh, auth = excluded.auth,
       user_agent = excluded.user_agent`,
  )
    .bind(endpoint, user.id, p256dh, auth, ua, now)
    .run();

  const body: PushSubscribeResponse = { ok: true, enabled: true };
  return c.json(body);
});

/** POST /api/push/unsubscribe {endpoint} — désabonnement (réglages). */
pushRoutes.post('/push/unsubscribe', async (c) => {
  const user = await requireUser(c);
  const payload = (await c.req.json().catch(() => null)) as { endpoint?: unknown } | null;
  const endpoint = typeof payload?.endpoint === 'string' ? payload.endpoint : '';
  if (!endpoint) throw errors.badRequest('Endpoint manquant.');
  await c.env.DB.prepare(`DELETE FROM push_subscriptions WHERE endpoint = ? AND user_id = ?`)
    .bind(endpoint, user.id)
    .run();
  return c.json({ ok: true as const });
});

/**
 * /admin/usage — visibilité de la consommation (Gate 1).
 * Public en lecture à l'Étape 1 (aucune donnée personnelle exposée) ;
 * sera protégé par un jeton admin dès l'Étape 2.
 */
import { Hono } from 'hono';
import type { AppEnv } from '../env';
import { isolateUptimeSeconds, snapshotCounters, currentStartedAt } from '../middleware/usage';
import { createSession } from '../lib/auth';
import type { UsageResponse } from '@wairyu/shared';

export const adminRoutes = new Hono<AppEnv>();

adminRoutes.get('/usage', async (c) => {
  const day = new Date().toISOString().slice(0, 10);
  const rows = await c.env.DB.prepare(
    `SELECT metric, value FROM metrics_daily WHERE day = ? ORDER BY metric`,
  )
    .bind(day)
    .all<{ metric: string; value: number }>();

  // État des ressources (petit, à la volée — pas de cache nécessaire à ce stade)
  const [sessions] = await Promise.all([
    c.env.DB.prepare(`SELECT COUNT(*) AS n FROM sessions WHERE revoked_at IS NULL`).first<{ n: number }>(),
  ]);

  const body: UsageResponse = {
    day,
    isolate: {
      startedAt: new Date(currentStartedAt()).toISOString(),
      uptimeSeconds: isolateUptimeSeconds(),
      counters: snapshotCounters(),
    },
    daily: rows.results ?? [],
  };
  return c.json(body, 200, { 'x-sessions-active': String(sessions?.n ?? 0) });
});

/** Stupe DO de contrôle : prouve le binding DO dès l'Étape 1 (utilisé réellement en Étape 6). */
adminRoutes.get('/do-check', async (c) => {
  const stub = c.env.CHAT_ROOM.idFromName('__healthcheck__');
  const doStub = c.env.CHAT_ROOM.get(stub);
  const res = await doStub.fetch(new URL('https://do/health').toString());
  const payload = (await res.json()) as { ok: boolean; storage: string };
  return c.json({ ok: payload.ok, durable_object: payload.storage });
});

/**
 * STAGING UNIQUEMENT — session de test pour les smoke tests automatisés.
 * Depuis l'activation de Brevo sur staging, les codes OTP partent par email
 * (aucun devCode retourné) : cette porte admin (jeton requis, garde
 * ENVIRONMENT === 'staging' + refus des domaines réels) permet de créer un
 * compte de test authentifié sans lire de boîte mail. Inopérante en production.
 */
adminRoutes.post('/test-session', async (c) => {
  if (c.env.ENVIRONMENT !== 'staging') {
    return c.json({ error: { code: 'not_found', message: 'Réservé au staging.', req_id: c.get('reqId') } }, 404);
  }
  const payload = (await c.req.json().catch(() => null)) as { email?: unknown } | null;
  const email = typeof payload?.email === 'string' ? payload.email.trim().toLowerCase() : '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return c.json({ error: { code: 'bad_request', message: 'Email invalide.', req_id: c.get('reqId') } }, 400);
  }
  if (/\@(gmail|googlemail|hotmail|outlook|live|yahoo|icloud|proton)\./.test(email)) {
    return c.json(
      { error: { code: 'bad_request', message: 'Domaine réel interdit pour les tests.', req_id: c.get('reqId') } },
      400,
    );
  }

  const now = Math.floor(Date.now() / 1000);
  const existing = await c.env.DB.prepare(`SELECT id, status FROM users WHERE email = ? LIMIT 1`)
    .bind(email)
    .first<{ id: string; status: string }>();

  let userId: string;
  if (existing && existing.status !== 'deleted') {
    userId = existing.id;
  } else {
    userId = crypto.randomUUID();
    await c.env.DB.prepare(
      `INSERT INTO users (id, email, email_verified_at, status, plan, created_at, updated_at)
       VALUES (?, ?, ?, 'active', 'free', ?, ?)`,
    )
      .bind(userId, email, now, now, now)
      .run();
  }

  await createSession(c, userId);
  return c.json({ userId, email, stagingOnly: true });
});

/**
 * Étape 5 — déclencheur manuel du Top Compatibilité (même fonction que le
 * cron quotidien). Protégé par ADMIN_TOKEN comme tout /admin/* — permet de
 * valider la chaîne complète (calcul → matérialisation) sans attendre 03:xx.
 */
adminRoutes.post('/run-top', async (c) => {
  const { computeDailyTop } = await import('../lib/discovery');
  const result = await computeDailyTop(c.env, { maxUsers: 200 });
  return c.json({ ok: true, ...result });
});

/**
 * Étape 6 — STAGING UNIQUEMENT : recule la date de création d'une conversation
 * (smoke tests : franchir le seuil « 7 jours » de la révélation §4.5 sans
 * attendre). La manipulation d'age est bornée à 30 jours et reste sans effet
 * en production (garde ENVIRONMENT === 'staging').
 */
adminRoutes.post('/backdate-conversation', async (c) => {
  if (c.env.ENVIRONMENT !== 'staging') {
    return c.json({ error: { code: 'not_found', message: 'Réservé au staging.', req_id: c.get('reqId') } }, 404);
  }
  const payload = (await c.req.json().catch(() => null)) as {
    conversationId?: unknown;
    days?: unknown;
  } | null;
  const conversationId = typeof payload?.conversationId === 'string' ? payload.conversationId : '';
  const days = Math.max(0, Math.min(30, Number(payload?.days) || 0));
  if (!conversationId || days <= 0) {
    return c.json(
      { error: { code: 'bad_request', message: 'conversationId + days (>0, ≤30) requis.', req_id: c.get('reqId') } },
      400,
    );
  }
  const res = await c.env.DB.prepare(
    `UPDATE conversations SET created_at = created_at - ? WHERE id = ?`,
  )
    .bind(days * 86400, conversationId)
    .run();
  return c.json({ ok: res.meta.changes === 1, daysBack: days });
});

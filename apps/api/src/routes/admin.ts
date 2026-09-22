/**
 * /admin/usage — visibilité de la consommation (Gate 1).
 * Public en lecture à l'Étape 1 (aucune donnée personnelle exposée) ;
 * sera protégé par un jeton admin dès l'Étape 2.
 */
import { Hono } from 'hono';
import type { AppEnv } from '../env';
import { isolateUptimeSeconds, snapshotCounters, currentStartedAt } from '../middleware/usage';
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

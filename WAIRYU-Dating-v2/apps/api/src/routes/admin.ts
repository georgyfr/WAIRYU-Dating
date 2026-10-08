/**
 * Admin Étape 1 — UNIQUEMENT GET /admin/usage.
 * Garde Bearer ADMIN_TOKEN en temps constant, FAIL-CLOSED : si le secret est
 * absent, 503 (durcissement vs v1 qui laissait la route ouverte à l'Étape 1).
 */
import { Hono } from 'hono';
import type { AppEnv } from '../env';
import { errorBody, errors, reqId } from '../lib/errors';
import { timingSafeEqual } from '../lib/session';
import { currentStartedAt, isolateUptimeSeconds, snapshotCounters } from '../middleware/usage';
import type { UsageResponse } from '@wairyu/shared';

export const adminRoutes = new Hono<AppEnv>();

adminRoutes.get('/usage', async (c) => {
  const id = c.get('reqId') ?? reqId();
  const expected = c.env.ADMIN_TOKEN;
  if (!expected) {
    return c.json(errorBody('unauthorized', 'Admin non configuré (ADMIN_TOKEN absent).', id), 503);
  }
  const auth = c.req.header('authorization') ?? '';
  const provided = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!timingSafeEqual(provided, expected)) {
    return c.json(errorBody('unauthorized', 'Jeton admin requis.', id), 401);
  }

  const now = Math.floor(Date.now() / 1000);
  const active = await c.env.DB.prepare(
    `SELECT COUNT(*) AS n FROM sessions WHERE revoked_at IS NULL AND expires_at > ?`,
  )
    .bind(now)
    .first<{ n: number }>();

  const body: UsageResponse = {
    uptimeSeconds: isolateUptimeSeconds(),
    requestsTotal: snapshotCounters()['requests_total'] ?? 0,
    buckets: snapshotCounters(),
    sessionsActive: active?.n ?? 0,
    startedAt: new Date(currentStartedAt()).toISOString(),
  };
  return c.json(body);
});

// Référence à errors pour l'usage futur des autres routes admin (Étape 7+).
void errors;

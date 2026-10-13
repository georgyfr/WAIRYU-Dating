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

// GET /admin/satisfaction — les notes de la barre « Ton avis compte »
// (Task 66). Lecture seule, mêmes garde Bearer + fail-closed que /usage :
// le fondateur lit ce qui doit être amélioré, quête par quête.
adminRoutes.get('/satisfaction', async (c) => {
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

  const limite = Math.min(Math.max(Number(c.req.query('limite') ?? 200) || 200, 1), 500);
  const { results } = await c.env.DB.prepare(
    `SELECT quete, note, commentaire, created_at
       FROM satisfaction
      ORDER BY created_at DESC
      LIMIT ?1`,
  )
    .bind(limite)
    .all<{ quete: string; note: number; commentaire: string; created_at: string }>();

  return c.json({ ok: true, notes: results ?? [] });
});

// Référence à errors pour l'usage futur des autres routes admin (Étape 7+).
void errors;

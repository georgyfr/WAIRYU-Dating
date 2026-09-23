/**
 * /admin/usage — visibilité de la consommation (Gate 1).
 * Public en lecture à l'Étape 1 (aucune donnée personnelle exposée) ;
 * sera protégé par un jeton admin dès l'Étape 2.
 *
 * Étape 7 — backoffice de modération (plan 7.4) :
 *   files (vérifications selfie, signalements, flags automatiques, check-ins
 *   « flagged »), actions avertir / suspendre / bannir, contexte de
 *   conversation, journal audit_admin complet, 2FA TOTP, sonde anti-fraude
 *   multi-comptes (empreinte = ip_hash + user_agent_hash des sessions).
 */
import { Hono } from 'hono';
import type { Context } from 'hono';
import type { AppEnv } from '../env';
import { isolateUptimeSeconds, snapshotCounters, currentStartedAt } from '../middleware/usage';
import { createSession } from '../lib/auth';
import { signedMediaUrl } from '../lib/cloudinary';
import { verifyTotp, generateTotpSecret, otpauthUri } from '../lib/totp';
import type {
  UsageResponse,
  AdminVerificationItem,
  AdminReportItem,
  AdminReportDetail,
  AdminFlagItem,
  AdminActionResponse,
} from '@wairyu/shared';

export const adminRoutes = new Hono<AppEnv>();

// ---------------------------------------------------------------------------
// Helpers Étape 7
// ---------------------------------------------------------------------------

type AdminCtx = Context<AppEnv>;

/** Écrit une ligne d'audit immuable (plan 7.4 — audit_admin complet). */
async function audit(
  c: AdminCtx,
  action: string,
  targetUser: string | null,
  targetId: string | null,
  details: string | null,
): Promise<void> {
  await c.env.DB.prepare(
    `INSERT INTO audit_admin (admin, action, target_user, target_id, details, created_at)
     VALUES ('token', ?, ?, ?, ?, ?)`,
  )
    .bind(action, targetUser, targetId, details, Math.floor(Date.now() / 1000))
    .run();
}

type SanctionAction = 'dismiss' | 'warn' | 'suspend' | 'ban' | 'unban';

/**
 * Applique une sanction à un utilisateur et journalise.
 * warn = avertissement daté · suspend = N jours (sessions conservées mais
 * /api/* refusées hors /api/me et logout) · ban = statut 'banned' + sessions
 * révoquées immédiatement (même comportement que la suppression RGPD côté accès).
 */
async function applySanction(
  c: AdminCtx,
  userId: string,
  action: SanctionAction,
  note: string | null,
  days = 7,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  let outcome: string = action;

  if (action === 'warn') {
    await c.env.DB.prepare(`UPDATE users SET warned_at = ?, updated_at = ? WHERE id = ?`)
      .bind(now, now, userId)
      .run();
  } else if (action === 'suspend') {
    const until = now + Math.max(1, Math.min(30, days)) * 86400;
    await c.env.DB.prepare(`UPDATE users SET suspended_until = ?, updated_at = ? WHERE id = ?`)
      .bind(until, now, userId)
      .run();
    outcome = `suspend_${days}d`;
  } else if (action === 'ban') {
    await c.env.DB.batch([
      c.env.DB.prepare(`UPDATE users SET status = 'banned', updated_at = ? WHERE id = ?`).bind(now, userId),
      c.env.DB.prepare(`UPDATE sessions SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL`).bind(now, userId),
    ]);
  } else if (action === 'unban') {
    await c.env.DB.prepare(
      `UPDATE users SET status = 'active', suspended_until = NULL, updated_at = ? WHERE id = ?`,
    )
      .bind(now, userId)
      .run();
  }

  await audit(c, `sanction_${outcome}`, userId, null, note);
  return outcome;
}

/** Clé KV de la config 2FA. */
const TOTP_KV_KEY = 'admin:2fa';
interface TotpConfig {
  secret: string;
  enabled: boolean;
  createdAt: number;
}

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

// ===========================================================================
// Étape 7 — Sécurité & modération (backoffice)
// ===========================================================================

// ---------------------------------------------------------------------------
// Files de vérification selfie (plan 7.1)
// ---------------------------------------------------------------------------

adminRoutes.get('/verification-queue', async (c) => {
  const status = c.req.query('status') ?? 'pending';
  const { results } = await c.env.DB.prepare(
    `SELECT vr.id, vr.user_id, vr.pose_order, vr.poses_json, vr.status, vr.created_at,
            u.display_name, u.email
     FROM verification_requests vr JOIN users u ON u.id = vr.user_id
     WHERE vr.status = ?
     ORDER BY vr.created_at ASC LIMIT 50`,
  )
    .bind(status)
    .all<{
      id: string;
      user_id: string;
      pose_order: string;
      poses_json: string | null;
      status: string;
      created_at: number;
      display_name: string | null;
      email: string;
    }>();

  const items: AdminVerificationItem[] = [];
  for (const r of results ?? []) {
    const order = JSON.parse(r.pose_order) as string[];
    const ids = r.poses_json ? (JSON.parse(r.poses_json) as string[]) : [];
    const poses: { pose: string; url: string }[] = [];
    for (let i = 0; i < ids.length; i++) {
      poses.push({
        pose: order[i] ?? `pose${i}`,
        url: await signedMediaUrl(c.env.CLOUDINARY_CLOUD_NAME, c.env.CLOUDINARY_API_SECRET, ids[i]!, {
          transformation: 'c_limit,w_400',
        }),
      });
    }
    items.push({
      id: r.id,
      userId: r.user_id,
      displayName: r.display_name,
      email: r.email,
      createdAt: r.created_at,
      status: r.status,
      poses,
    });
  }
  return c.json({ items });
});

adminRoutes.post('/verification/:id/approve', async (c) => {
  const id = c.req.param('id');
  const now = Math.floor(Date.now() / 1000);
  const row = await c.env.DB.prepare(
    `SELECT id, user_id FROM verification_requests WHERE id = ? AND status = 'pending'`,
  )
    .bind(id)
    .first<{ id: string; user_id: string }>();
  if (!row) return c.json({ error: { code: 'not_found', message: 'Demande introuvable ou déjà traitée.' } }, 404);

  await c.env.DB.batch([
    c.env.DB.prepare(
      `UPDATE verification_requests SET status = 'approved', reviewed_at = ?, reviewed_by = 'token' WHERE id = ?`,
    ).bind(now, id),
    c.env.DB.prepare(`UPDATE users SET verified_at = ?, updated_at = ? WHERE id = ?`).bind(now, now, row.user_id),
  ]);
  await audit(c, 'verification_approve', row.user_id, id, null);
  const body: AdminActionResponse = { ok: true, action: 'approve', note: 'Badge « Identité vérifiée » accordé.' };
  return c.json(body);
});

adminRoutes.post('/verification/:id/reject', async (c) => {
  const id = c.req.param('id');
  const payload = (await c.req.json().catch(() => null)) as { reason?: unknown } | null;
  const reason = typeof payload?.reason === 'string' ? payload.reason.slice(0, 300) : 'Photos non conformes.';
  const row = await c.env.DB.prepare(
    `SELECT id, user_id FROM verification_requests WHERE id = ? AND status IN ('pending','awaiting')`,
  )
    .bind(id)
    .first<{ id: string; user_id: string }>();
  if (!row) return c.json({ error: { code: 'not_found', message: 'Demande introuvable ou déjà traitée.' } }, 404);

  await c.env.DB.prepare(
    `UPDATE verification_requests SET status = 'rejected', rejection_reason = ?, reviewed_at = ?, reviewed_by = 'token' WHERE id = ?`,
  )
    .bind(reason, Math.floor(Date.now() / 1000), id)
    .run();
  await audit(c, 'verification_reject', row.user_id, id, reason);
  const body: AdminActionResponse = { ok: true, action: 'reject', note: `Refusée : ${reason}` };
  return c.json(body);
});

// ---------------------------------------------------------------------------
// Files de signalements (plan 7.3/7.4)
// ---------------------------------------------------------------------------

adminRoutes.get('/reports', async (c) => {
  const status = c.req.query('status');
  const where = status ? `WHERE r.status = ?` : '';
  const bind: string[] = status ? [status] : [];
  const { results } = await c.env.DB.prepare(
    `SELECT r.id, r.reporter_id, r.reported_id, r.category, r.details, r.conversation_id,
            r.status, r.resolution, r.created_at,
            ru.display_name AS reported_name, ru.warned_at, ru.suspended_until, ru.status AS reported_status
     FROM reports r JOIN users ru ON ru.id = r.reported_id
     ${where}
     ORDER BY r.created_at ASC LIMIT 100`,
  )
    .bind(...bind)
    .all<{
      id: string;
      reporter_id: string;
      reported_id: string;
      category: string;
      details: string | null;
      conversation_id: string | null;
      status: string;
      resolution: string | null;
      created_at: number;
      reported_name: string | null;
      warned_at: number | null;
      suspended_until: number | null;
      reported_status: string;
    }>();

  const items: AdminReportItem[] = (results ?? []).map((r) => ({
    id: r.id,
    reporterId: r.reporter_id,
    reportedId: r.reported_id,
    category: r.category,
    details: r.details,
    conversationId: r.conversation_id,
    createdAt: r.created_at,
    status: r.status,
    resolution: r.resolution,
    reported: {
      displayName: r.reported_name,
      warnedAt: r.warned_at,
      suspendedUntil: r.suspended_until,
      status: r.reported_status,
    },
  }));
  return c.json({ items });
});

/** GET /admin/reports/:id — détail + contexte de conversation (DO, ≤ 200 msg). */
adminRoutes.get('/reports/:id', async (c) => {
  const id = c.req.param('id');
  const r = await c.env.DB.prepare(
    `SELECT r.id, r.reporter_id, r.reported_id, r.category, r.details, r.conversation_id,
            r.status, r.resolution, r.created_at,
            ru.display_name AS reported_name, ru.warned_at, ru.suspended_until, ru.status AS reported_status
     FROM reports r JOIN users ru ON ru.id = r.reported_id
     WHERE r.id = ?`,
  )
    .bind(id)
    .first<{
      id: string;
      reporter_id: string;
      reported_id: string;
      category: string;
      details: string | null;
      conversation_id: string | null;
      status: string;
      resolution: string | null;
      created_at: number;
      reported_name: string | null;
      warned_at: number | null;
      suspended_until: number | null;
      reported_status: string;
    }>();
  if (!r) return c.json({ error: { code: 'not_found', message: 'Signalement introuvable.' } }, 404);

  let messages: AdminReportDetail['messages'] = [];
  if (r.conversation_id) {
    const stub = c.env.CHAT_ROOM.get(c.env.CHAT_ROOM.idFromName(r.conversation_id));
    const res = await stub
      .fetch(new Request(`https://do/history?userId=${r.reported_id}&limit=200`))
      .catch(() => null);
    if (res?.ok) {
      const data = (await res.json()) as { messages?: { seq: number; senderId: string; body: string; kind: string; createdAt: number }[] };
      messages = (data.messages ?? [])
        .filter((m) => m.kind === 'text')
        .map((m) => ({ seq: m.seq, sender: m.senderId, body: m.body, createdAt: m.createdAt }));
    }
  }

  const body: AdminReportDetail = {
    id: r.id,
    reporterId: r.reporter_id,
    reportedId: r.reported_id,
    category: r.category,
    details: r.details,
    conversationId: r.conversation_id,
    createdAt: r.created_at,
    status: r.status,
    resolution: r.resolution,
    reported: {
      displayName: r.reported_name,
      warnedAt: r.warned_at,
      suspendedUntil: r.suspended_until,
      status: r.reported_status,
    },
    messages,
  };
  return c.json(body);
});

/** POST /admin/reports/:id/resolve { action: dismiss|warn|suspend|ban, note?, days? } */
adminRoutes.post('/reports/:id/resolve', async (c) => {
  const id = c.req.param('id');
  const payload = (await c.req.json().catch(() => null)) as {
    action?: unknown;
    note?: unknown;
    days?: unknown;
  } | null;
  const action = typeof payload?.action === 'string' ? payload.action : '';
  const note = typeof payload?.note === 'string' ? payload.note.slice(0, 500) : null;
  const days = Math.max(1, Math.min(30, Number(payload?.days) || 7));
  if (!['dismiss', 'warn', 'suspend', 'ban', 'unban'].includes(action)) {
    return c.json({ error: { code: 'bad_request', message: 'action invalide (dismiss|warn|suspend|ban|unban).' } }, 400);
  }

  const row = await c.env.DB.prepare(
    `SELECT id, reported_id FROM reports WHERE id = ? AND status = 'pending'`,
  )
    .bind(id)
    .first<{ id: string; reported_id: string }>();
  if (!row) return c.json({ error: { code: 'not_found', message: 'Signalement introuvable ou déjà résolu.' } }, 404);

  const outcome = await applySanction(c, row.reported_id, action as SanctionAction, note, days);
  await c.env.DB.prepare(
    `UPDATE reports SET status = 'reviewed', resolution = ?, resolved_at = ?, resolved_by = 'token' WHERE id = ?`,
  )
    .bind(`${outcome}${note ? ` — ${note}` : ''}`, Math.floor(Date.now() / 1000), id)
    .run();
  await audit(c, `report_${outcome}`, row.reported_id, id, note);
  const body: AdminActionResponse = { ok: true, action: outcome, note: `Signalement résolu (${outcome}).` };
  return c.json(body);
});

// ---------------------------------------------------------------------------
// File de modération automatique (plan 7.2 — flags du DO)
// ---------------------------------------------------------------------------

adminRoutes.get('/flags', async (c) => {
  const status = c.req.query('status') ?? 'open';
  const { results } = await c.env.DB.prepare(
    `SELECT id, conversation_id, sender, seq, risk, categories_json, excerpt, action, status, resolution, created_at
     FROM moderation_flags WHERE status = ? ORDER BY created_at ASC LIMIT 100`,
  )
    .bind(status)
    .all<{
      id: string;
      conversation_id: string;
      sender: string;
      seq: number | null;
      risk: number;
      categories_json: string;
      excerpt: string;
      action: string;
      status: string;
      resolution: string | null;
      created_at: number;
    }>();

  const items: AdminFlagItem[] = (results ?? []).map((r) => ({
    id: r.id,
    conversationId: r.conversation_id,
    sender: r.sender,
    seq: r.seq,
    risk: r.risk,
    categories: JSON.parse(r.categories_json) as string[],
    excerpt: r.excerpt,
    action: r.action === 'block' ? 'block' : 'flag',
    status: r.status,
    resolution: r.resolution,
    createdAt: r.created_at,
  }));
  return c.json({ items });
});

adminRoutes.post('/flags/:id/resolve', async (c) => {
  const id = c.req.param('id');
  const payload = (await c.req.json().catch(() => null)) as {
    action?: unknown;
    note?: unknown;
    days?: unknown;
  } | null;
  const action = typeof payload?.action === 'string' ? payload.action : '';
  const note = typeof payload?.note === 'string' ? payload.note.slice(0, 500) : null;
  const days = Math.max(1, Math.min(30, Number(payload?.days) || 7));
  if (!['dismiss', 'warn', 'suspend', 'ban', 'unban'].includes(action)) {
    return c.json({ error: { code: 'bad_request', message: 'action invalide (dismiss|warn|suspend|ban|unban).' } }, 400);
  }

  const row = await c.env.DB.prepare(
    `SELECT id, sender FROM moderation_flags WHERE id = ? AND status = 'open'`,
  )
    .bind(id)
    .first<{ id: string; sender: string }>();
  if (!row) return c.json({ error: { code: 'not_found', message: 'Flag introuvable ou déjà résolu.' } }, 404);

  const outcome = await applySanction(c, row.sender, action as SanctionAction, note, days);
  await c.env.DB.prepare(
    `UPDATE moderation_flags SET status = 'resolved', resolution = ?, resolved_at = ?, resolved_by = 'token' WHERE id = ?`,
  )
    .bind(outcome, Math.floor(Date.now() / 1000), id)
    .run();
  await audit(c, `flag_${outcome}`, row.sender, id, note);
  const body: AdminActionResponse = { ok: true, action: outcome, note: `Flag résolu (${outcome}).` };
  return c.json(body);
});

// ---------------------------------------------------------------------------
// Check-ins « flagged » (plan 7.5)
// ---------------------------------------------------------------------------

adminRoutes.get('/checkins', async (c) => {
  const status = c.req.query('status') ?? 'flagged';
  const { results } = await c.env.DB.prepare(
    `SELECT sc.id, sc.user_id, sc.conversation_id, sc.when_ts, sc.status, sc.created_at, sc.updated_at,
            u.display_name, u.email
     FROM safety_checkins sc JOIN users u ON u.id = sc.user_id
     WHERE sc.status = ? ORDER BY sc.updated_at ASC LIMIT 50`,
  )
    .bind(status)
    .all<{
      id: string;
      user_id: string;
      conversation_id: string;
      when_ts: number;
      status: string;
      created_at: number;
      updated_at: number | null;
      display_name: string | null;
      email: string;
    }>();
  return c.json({ items: results ?? [] });
});

adminRoutes.post('/checkins/:id/resolve', async (c) => {
  const id = c.req.param('id');
  const payload = (await c.req.json().catch(() => null)) as { action?: unknown; note?: unknown } | null;
  const action = typeof payload?.action === 'string' ? payload.action : '';
  const note = typeof payload?.note === 'string' ? payload.note.slice(0, 500) : null;
  if (!['dismiss', 'warn', 'suspend', 'ban', 'contact'].includes(action)) {
    return c.json({ error: { code: 'bad_request', message: 'action invalide.' } }, 400);
  }
  const row = await c.env.DB.prepare(
    `SELECT id, user_id FROM safety_checkins WHERE id = ? AND status = 'flagged'`,
  )
    .bind(id)
    .first<{ id: string; user_id: string }>();
  if (!row) return c.json({ error: { code: 'not_found', message: 'Check-in introuvable.' } }, 404);

  let outcome = 'contact';
  if (action !== 'contact') {
    outcome = await applySanction(c, row.user_id, action as SanctionAction, note, 7);
  }
  await c.env.DB.prepare(`UPDATE safety_checkins SET status = 'ok', updated_at = ? WHERE id = ?`)
    .bind(Math.floor(Date.now() / 1000), id)
    .run();
  await audit(c, `checkin_${outcome}`, row.user_id, id, note);
  const body: AdminActionResponse = { ok: true, action: outcome, note: 'Check-in traité.' };
  return c.json(body);
});

// ---------------------------------------------------------------------------
// Anti-fraude : multi-comptes par empreinte légère (plan 7.6)
// Empreinte = (ip_hash, user_agent_hash) déjà posés sur chaque session (Étape 2)
// — zéro écriture supplémentaire, zéro donnée nouvelle.
// ---------------------------------------------------------------------------

adminRoutes.get('/multi-accounts', async (c) => {
  const userId = c.req.query('userId') ?? '';
  if (!userId) return c.json({ error: { code: 'bad_request', message: 'userId requis.' } }, 400);
  const { results } = await c.env.DB.prepare(
    `SELECT DISTINCT s2.user_id, u.email, u.display_name, u.status, u.created_at
     FROM sessions s1
     JOIN sessions s2
       ON s2.ip_hash IS s1.ip_hash AND s2.user_agent_hash IS s1.user_agent_hash
     JOIN users u ON u.id = s2.user_id
     WHERE s1.user_id = ? AND s2.user_id != ? AND s2.revoked_at IS NULL
       AND s1.last_seen_at > ? AND s2.last_seen_at > ?
     LIMIT 20`,
  )
    .bind(
      userId,
      userId,
      Math.floor(Date.now() / 1000) - 30 * 86400,
      Math.floor(Date.now() / 1000) - 30 * 86400,
    )
    .all<{ user_id: string; email: string; display_name: string | null; status: string; created_at: number }>();
  return c.json({ items: results ?? [] });
});

// ---------------------------------------------------------------------------
// 2FA TOTP du backoffice (plan 7.4)
// ---------------------------------------------------------------------------

adminRoutes.get('/2fa/status', async (c) => {
  const cfg = (await c.env.CONFIG.get(TOTP_KV_KEY, 'json')) as TotpConfig | null;
  return c.json({ enabled: cfg?.enabled === true });
});

adminRoutes.post('/2fa/setup', async (c) => {
  const existing = (await c.env.CONFIG.get(TOTP_KV_KEY, 'json')) as TotpConfig | null;
  if (existing?.enabled) {
    return c.json(
      { error: { code: 'conflict', message: '2FA déjà active — désactive-la d’abord (token TOTP requis).' } },
      409,
    );
  }
  const secret = generateTotpSecret();
  const cfg: TotpConfig = { secret, enabled: false, createdAt: Math.floor(Date.now() / 1000) };
  await c.env.CONFIG.put(TOTP_KV_KEY, JSON.stringify(cfg));
  await audit(c, 'totp_setup', null, null, null);
  return c.json({ ok: true, secret, otpauthUri: otpauthUri(secret), note: 'Importe ce secret dans ton app authenticator puis active avec un code.' });
});

adminRoutes.post('/2fa/activate', async (c) => {
  const payload = (await c.req.json().catch(() => null)) as { token?: unknown } | null;
  const token = typeof payload?.token === 'string' ? payload.token : '';
  const cfg = (await c.env.CONFIG.get(TOTP_KV_KEY, 'json')) as TotpConfig | null;
  if (!cfg?.secret) return c.json({ error: { code: 'not_found', message: 'Aucun secret — lance /admin/2fa/setup.' } }, 404);
  if (!(await verifyTotp(cfg.secret, token))) {
    return c.json({ error: { code: 'bad_request', message: 'Code TOTP invalide.' } }, 400);
  }
  await c.env.CONFIG.put(TOTP_KV_KEY, JSON.stringify({ ...cfg, enabled: true }));
  await audit(c, 'totp_activate', null, null, null);
  const body: AdminActionResponse = { ok: true, action: 'totp_activate', note: '2FA active — ajoute l’en-tête X-Admin-TOTP à chaque appel admin.' };
  return c.json(body);
});

adminRoutes.post('/2fa/disable', async (c) => {
  const payload = (await c.req.json().catch(() => null)) as { token?: unknown } | null;
  // Token accepté dans le body OU l'en-tête (le middleware utilise déjà l'en-tête).
  const token =
    typeof payload?.token === 'string' ? payload.token : (c.req.header('x-admin-totp') ?? '');
  const cfg = (await c.env.CONFIG.get(TOTP_KV_KEY, 'json')) as TotpConfig | null;
  if (cfg?.enabled) {
    if (!(await verifyTotp(cfg.secret, token))) {
      return c.json({ error: { code: 'bad_request', message: 'Code TOTP invalide.' } }, 400);
    }
  }
  await c.env.CONFIG.delete(TOTP_KV_KEY);
  await audit(c, 'totp_disable', null, null, null);
  const body: AdminActionResponse = { ok: true, action: 'totp_disable', note: '2FA désactivée.' };
  return c.json(body);
});

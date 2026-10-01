/**
 * Sécurité & modération — API utilisateur (Étape 7).
 *
 *  - Vérification selfie semi-manuelle (plan 7.1) : démarrage avec 3 poses
 *    aléatoires IMPOSÉES (anti photo-papier), envoi multipart des 3 selfies
 *    dans cet ordre, file de review backoffice, badge « Identité vérifiée ».
 *  - Signalement (plan 7.3) : motifs validés, blocage mutuel immédiat +
 *    unmatch automatique (protection instantanée, review a posteriori).
 *  - Check-in sécurité (plan 7.5, §6) : « Je vois X le [date] » + statut
 *    post-date (rappel push par le cron ; contact de confiance : Phase 2).
 *  - Confidentialité v1 (plan 7.7) : pause du profil, incognito, visibilité
 *    du mode — les filtres d'exclusion vivent dans lib/discovery.ts.
 */
import { Hono } from 'hono';
import type { Context } from 'hono';
import type { AppEnv } from '../env';
import { errors } from '../lib/errors';
import { RATE_RULES, hitRateLimit, rateLimitedError } from '../lib/ratelimit';
import { uploadAuthenticatedImage, signedMediaUrl } from '../lib/cloudinary';
import {
  REPORT_CATEGORIES,
  SELFIE_POSES,
  VERIFICATION,
  SAFETY,
  type SelfiePose,
  type VerificationStatusResponse,
  type VerificationStartResponse,
  type VerificationSubmitResponse,
  type ReportResponse,
  type PrivacyResponse,
  type CheckinListResponse,
  type CheckinCreateResponse,
  type CheckinDto,
} from '@wairyu/shared';

export const safetyRoutes = new Hono<AppEnv>();

// ---------------------------------------------------------------------------
// Contexte utilisateur
// ---------------------------------------------------------------------------

async function requireUser(c: Context<AppEnv>) {
  const session = c.get('session');
  if (!session) throw errors.unauthorized();
  const user = await c.env.DB.prepare(
    `SELECT id, status, paused, incognito, mode_visible, verified_at, suspended_until
     FROM users WHERE id = ? LIMIT 1`,
  )
    .bind(session.userId)
    .first<{
      id: string;
      status: string;
      paused: number | null;
      incognito: number | null;
      mode_visible: number | null;
      verified_at: number | null;
      suspended_until: number | null;
    }>();
  if (!user || user.status === 'deleted') throw errors.unauthorized();
  if (user.status === 'banned') throw errors.forbidden('Compte suspendu.');
  if (user.suspended_until && user.suspended_until > Math.floor(Date.now() / 1000)) {
    throw errors.forbidden('Compte suspendu — contacte le support si tu penses que c’est une erreur.');
  }
  return user;
}

/** Vérifie que l'utilisateur appartient au match ACTIF porté par la conversation. */
async function conversationPeer(
  c: Context<AppEnv>,
  conversationId: string,
  me: string,
): Promise<{ conversationId: string; matchId: string; other: string; otherName: string }> {
  if (!/^[0-9a-f-]{16,64}$/i.test(conversationId)) throw errors.badRequest('Conversation invalide.');
  const row = await c.env.DB.prepare(
    `SELECT c.id, c.match_id, m.id AS mid, m.user_a_id, m.user_b_id, m.unmatched_at
     FROM conversations c JOIN matches m ON m.id = c.match_id WHERE c.id = ?`,
  )
    .bind(conversationId)
    .first<{
      id: string;
      match_id: string;
      mid: string;
      user_a_id: string;
      user_b_id: string;
      unmatched_at: number | null;
    }>();
  if (!row || row.unmatched_at) throw errors.notFound('Conversation introuvable ou fermée.');
  if (me !== row.user_a_id && me !== row.user_b_id) throw errors.forbidden();
  const other = me === row.user_a_id ? row.user_b_id : row.user_a_id;
  const otherRow = await c.env.DB.prepare(`SELECT display_name FROM users WHERE id = ?`)
    .bind(other)
    .first<{ display_name: string | null }>();
  return {
    conversationId: row.id,
    matchId: row.match_id,
    other,
    otherName: otherRow?.display_name ?? 'Quelqu’un',
  };
}

// ---------------------------------------------------------------------------
// 1. Vérification selfie (plan 7.1)
// ---------------------------------------------------------------------------

function shuffledPoses(): SelfiePose[] {
  const arr = [...SELFIE_POSES];
  // Mélange Fisher-Yates (crypto) — l'ordre IMPOSÉ change à chaque demande.
  for (let i = arr.length - 1; i > 0; i--) {
    const j = crypto.getRandomValues(new Uint32Array(1))[0]! % (i + 1);
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
}

/** GET /api/safety/verification — état (statut, poses restantes, badge). */
safetyRoutes.get('/safety/verification', async (c) => {
  const user = await requireUser(c);

  const req = await c.env.DB.prepare(
    `SELECT id, pose_order, status, rejection_reason, expires_at FROM verification_requests
     WHERE user_id = ? ORDER BY created_at DESC LIMIT 1`,
  )
    .bind(user.id)
    .first<{
      id: string;
      pose_order: string;
      status: string;
      rejection_reason: string | null;
      expires_at: number;
    }>();

  let status: VerificationStatusResponse['status'] = 'none';
  let poses: SelfiePose[] = [];
  let expiresAt: number | null = null;
  let rejectionReason: string | null = null;

  if (req) {
    const order = JSON.parse(req.pose_order) as SelfiePose[];
    if (req.status === 'approved') status = 'approved';
    else if (req.status === 'rejected') {
      status = 'rejected';
      rejectionReason = req.rejection_reason;
    } else if (req.status === 'pending') {
      status = 'pending';
      expiresAt = req.expires_at;
    } else if (Date.now() / 1000 < req.expires_at) {
      status = 'awaiting';
      poses = order;
      expiresAt = req.expires_at;
    }
  }

  const body: VerificationStatusResponse = {
    status,
    poses,
    expiresAt,
    rejectionReason,
    verified: user.verified_at != null,
  };
  return c.json(body);
});

/** POST /api/safety/verification/start — nouvelle demande (3 poses mélangées). */
safetyRoutes.post('/safety/verification/start', async (c) => {
  const user = await requireUser(c);
  if (user.verified_at != null) throw errors.badRequest('Tu es déjà vérifié·e.');
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.safetyVerifyUser, user.id);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.safetyVerifyUser.scope);

  const now = Math.floor(Date.now() / 1000);
  const active = await c.env.DB.prepare(
    `SELECT id FROM verification_requests
     WHERE user_id = ? AND status IN ('awaiting','pending') AND expires_at > ? LIMIT 1`,
  )
    .bind(user.id, now)
    .first<{ id: string }>();

  const poses = shuffledPoses();
  const expiresAt = now + VERIFICATION.validHours * 3600;
  let requestId: string;

  if (active) {
    // Reprise : l'ordre est RE-GÉNÉRÉ (impossible de préparer les photos à l'avance).
    requestId = active.id;
    await c.env.DB.prepare(
      `UPDATE verification_requests SET pose_order = ?, expires_at = ? WHERE id = ?`,
    )
      .bind(JSON.stringify(poses), expiresAt, active.id)
      .run();
  } else {
    requestId = crypto.randomUUID();
    await c.env.DB.prepare(
      `INSERT INTO verification_requests (id, user_id, pose_order, status, created_at, expires_at)
       VALUES (?, ?, ?, 'awaiting', ?, ?)`,
    )
      .bind(requestId, user.id, JSON.stringify(poses), now, expiresAt)
      .run();
  }

  const body: VerificationStartResponse = { ok: true, requestId, poses, expiresAt };
  return c.json(body);
});

/** POST /api/safety/verification/submit (multipart pose0..2) — passe en review. */
safetyRoutes.post('/safety/verification/submit', async (c) => {
  const user = await requireUser(c);
  if (user.verified_at != null) throw errors.badRequest('Tu es déjà vérifié·e.');
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.safetyVerifySubmit, user.id);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.safetyVerifySubmit.scope);

  const now = Math.floor(Date.now() / 1000);
  const req = await c.env.DB.prepare(
    `SELECT id, pose_order, expires_at FROM verification_requests
     WHERE user_id = ? AND status = 'awaiting' AND expires_at > ? ORDER BY created_at DESC LIMIT 1`,
  )
    .bind(user.id, now)
    .first<{ id: string; pose_order: string; expires_at: number }>();
  if (!req) throw errors.badRequest('Aucune demande active — démarre une nouvelle vérification.');

  const order = JSON.parse(req.pose_order) as SelfiePose[];
  const form = await c.req.formData().catch(() => null);
  if (!form) throw errors.badRequest('Formulaire multipart attendu.');

  const publicIds: string[] = [];
  for (let i = 0; i < VERIFICATION.poses; i++) {
    const file: unknown = form.get(`pose${i}`);
    if (!(file instanceof Blob)) throw errors.badRequest(`Selfie « pose${i + 1} » manquant.`);
    const mime = (file as Blob).type || '';
    if (!mime.startsWith('image/')) throw errors.badRequest('Format image attendu.');
    if (file.size <= 0 || file.size > VERIFICATION.photoMaxBytes) {
      throw errors.badRequest(`Selfie ${i + 1} trop volumineux (max 2 Mo).`);
    }
    const publicId = `${c.env.CLOUDINARY_ROOT_FOLDER}/verifications/${user.id}/${req.id}/${order[i]}`;
    const up = await uploadAuthenticatedImage(c.env, file as Blob, publicId);
    publicIds.push(up.publicId);
  }

  await c.env.DB.prepare(
    `UPDATE verification_requests SET poses_json = ?, status = 'pending' WHERE id = ?`,
  )
    .bind(JSON.stringify(publicIds), req.id)
    .run();

  const body: VerificationSubmitResponse = {
    ok: true,
    status: 'pending',
    note: 'Selfies reçus — review sous 24 h. Tu gardes ton badge « Vérifié·e » dès l’approbation.',
  };
  return c.json(body);
});

// ---------------------------------------------------------------------------
// 2. Signalements (plan 7.3) — blocage mutuel immédiat + unmatch
// ---------------------------------------------------------------------------

// --- P0 — Agrégat + blocage automatique (re-audit : « 0 report_aggregate ») ---

/** Catégories à blocage IMMÉDIAT (1 seul signalement pris en compte suffit). */
const AUTO_BAN_CATEGORIES = ['harassment', 'scam', 'minor'];
/** Fenêtre glissante de l'agrégat (jours). */
const AGGREGATE_WINDOW_DAYS = 30;
/** Anti-abus : ≥ 5 cibles DISTINCTES en 7 j → signaleur EXCLU des agrégats. */
const SERIAL_REPORTER_MAX_TARGETS = 5;
const SERIAL_REPORTER_WINDOW_DAYS = 7;

/** Ligne d'audit « système » (blocage auto, exclusion anti-abus) — 0014. */
async function auditSystem(
  db: D1Database,
  action: string,
  targetUser: string | null,
  targetId: string | null,
  details: string | null,
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO audit_admin (admin, action, target_user, target_id, details, created_at)
       VALUES ('system', ?, ?, ?, ?, ?)`,
    )
    .bind(action, targetUser, targetId, details, Math.floor(Date.now() / 1000))
    .run();
}

/**
 * Recalcule l'agrégat (reporté, catégorie) sur la fenêtre 30 j — recalcul
 * COMPLET depuis `reports` à chaque signalement : idempotent par construction.
 * Les signalements des « signaleurs en série » (≥ 5 cibles distinctes / 7 j,
 * sous-requête NOT IN) sont EXCLUS des compteurs. Règles de blocage :
 *   - harassment / scam / minor → immédiat (dès 1 signalement pris en compte) ;
 *   - autres catégories → ≥ 2 signaleurs DISTINCTS.
 * Blocage = users.status='banned' + révocation des sessions + ligne
 * `sanctions` (created_by='system') + audit_admin 'auto_ban_aggregate'.
 */
async function recomputeReportAggregate(
  db: D1Database,
  reportedUserId: string,
  category: string,
): Promise<{ reportCount: number; distinctReporters: number; autoBanned: boolean }> {
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - AGGREGATE_WINDOW_DAYS * 86400;

  // Compteurs avec EXCLUSION des signaleurs en série (anti-abus) — une seule
  // requête statique : la sous-requête re-calcule la liste à chaque passage.
  const agg = await db
    .prepare(
      `SELECT COUNT(*) AS n, COUNT(DISTINCT reporter_id) AS d, MAX(created_at) AS last_at
       FROM reports
       WHERE reported_id = ? AND category = ? AND created_at > ?
         AND reporter_id NOT IN (
           SELECT reporter_id FROM reports
           WHERE created_at > ?
           GROUP BY reporter_id
           HAVING COUNT(DISTINCT reported_id) >= ?
         )`,
    )
    .bind(
      reportedUserId,
      category,
      windowStart,
      now - SERIAL_REPORTER_WINDOW_DAYS * 86400,
      SERIAL_REPORTER_MAX_TARGETS,
    )
    .first<{ n: number; d: number; last_at: number | null }>();
  const reportCount = agg?.n ?? 0;
  const distinctReporters = agg?.d ?? 0;

  // Règle de blocage automatique (jamais re-déclenchée sur un compte déjà banni
  // — idempotence de la SANCTION, pas seulement des compteurs).
  let autoBanned = false;
  let autoBlockedAt: number | null = null;
  const mustBlock =
    reportCount >= 1 &&
    (AUTO_BAN_CATEGORIES.includes(category) || distinctReporters >= 2);
  if (mustBlock) {
    const target = await db
      .prepare(`SELECT status FROM users WHERE id = ?`)
      .bind(reportedUserId)
      .first<{ status: string }>();
    if (target && target.status !== 'banned' && target.status !== 'deleted') {
      await db.batch([
        db
          .prepare(`UPDATE users SET status = 'banned', updated_at = ? WHERE id = ?`)
          .bind(now, reportedUserId),
        db
          .prepare(`UPDATE sessions SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL`)
          .bind(now, reportedUserId),
        db
          .prepare(
            `INSERT INTO sanctions (id, user_id, type, reason, status, created_by, created_at, expires_at)
             VALUES (?, ?, 'ban', ?, 'active', 'system', ?, NULL)`,
          )
          .bind(
            crypto.randomUUID(),
            reportedUserId,
            `auto: agrégat signalements (${category}) — report_count=${reportCount}, distinct_reporters=${distinctReporters}`,
            now,
          ),
      ]);
      autoBanned = true;
      autoBlockedAt = now;
      await auditSystem(
        db,
        'auto_ban_aggregate',
        reportedUserId,
        null,
        JSON.stringify({ category, reportCount, distinctReporters }),
      );
    }
  }

  // UPSERT idempotent — auto_blocked_at n'est JAMAIS écrasé par un recalcul.
  await db
    .prepare(
      `INSERT INTO report_aggregate
         (reported_user_id, category, window_days, report_count, distinct_reporters, last_report_at, auto_blocked_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT (reported_user_id, category) DO UPDATE SET
         report_count = excluded.report_count,
         distinct_reporters = excluded.distinct_reporters,
         last_report_at = excluded.last_report_at,
         auto_blocked_at = COALESCE(report_aggregate.auto_blocked_at, excluded.auto_blocked_at)`,
    )
    .bind(
      reportedUserId,
      category,
      AGGREGATE_WINDOW_DAYS,
      reportCount,
      distinctReporters,
      agg?.last_at ?? now,
      autoBlockedAt,
    )
    .run();

  return { reportCount, distinctReporters, autoBanned };
}

safetyRoutes.post('/reports', async (c) => {
  const user = await requireUser(c);
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.safetyReportUser, user.id);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.safetyReportUser.scope);

  const payload = (await c.req.json().catch(() => null)) as {
    targetUserId?: unknown;
    category?: unknown;
    details?: unknown;
    conversationId?: unknown;
  } | null;

  const targetUserId = typeof payload?.targetUserId === 'string' ? payload.targetUserId : '';
  const category = typeof payload?.category === 'string' ? payload.category : '';
  const details =
    typeof payload?.details === 'string' ? payload.details.trim().slice(0, 500) : null;
  const conversationId =
    typeof payload?.conversationId === 'string' ? payload.conversationId : null;

  if (!targetUserId) throw errors.badRequest('Cible du signalement manquante.');
  if (targetUserId === user.id) throw errors.badRequest('On ne se signale pas soi-même.');
  if (!(REPORT_CATEGORIES as readonly string[]).includes(category)) {
    throw errors.badRequest('Motif invalide.');
  }

  const target = await c.env.DB.prepare(`SELECT id, status FROM users WHERE id = ?`)
    .bind(targetUserId)
    .first<{ id: string; status: string }>();
  if (!target || target.status === 'deleted') throw errors.notFound('Ce profil n’existe plus.');

  const now = Math.floor(Date.now() / 1000);
  const reportId = crypto.randomUUID();

  // Contexte conversation facultatif (pré-remplir la review + fermer le chat).
  let peer: { conversationId: string; matchId: string; other: string } | null = null;
  if (conversationId) {
    try {
      peer = await conversationPeer(c, conversationId, user.id);
    } catch {
      peer = null; // conversation déjà fermée — le signalement reste valable
    }
  } else {
    // Sans conversation explicite : cherche un match ACTIF entre les deux.
    const m = await c.env.DB.prepare(
      `SELECT ma.id, co.id AS cid FROM matches ma
       JOIN conversations co ON co.match_id = ma.id
       WHERE ma.unmatched_at IS NULL
         AND ((ma.user_a_id = ? AND ma.user_b_id = ?) OR (ma.user_a_id = ? AND ma.user_b_id = ?))
       LIMIT 1`,
    )
      .bind(user.id, targetUserId, targetUserId, user.id)
      .first<{ id: string; cid: string }>();
    if (m) peer = { conversationId: m.cid, matchId: m.id, other: targetUserId };
  }

  await c.env.DB.prepare(
    `INSERT INTO reports (id, reporter_id, reported_id, category, details, conversation_id, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(reportId, user.id, targetUserId, category, details, peer?.conversationId ?? null, now)
    .run();

  // ---- Protection immédiate : blocage DANS LES DEUX SENS + unmatch ----
  await c.env.DB.batch([
    c.env.DB.prepare(
      `INSERT INTO blocks (user_id, blocked_id, created_at) VALUES (?, ?, ?)
       ON CONFLICT (user_id, blocked_id) DO NOTHING`,
    ).bind(user.id, targetUserId, now),
    c.env.DB.prepare(
      `INSERT INTO blocks (user_id, blocked_id, created_at) VALUES (?, ?, ?)
       ON CONFLICT (user_id, blocked_id) DO NOTHING`,
    ).bind(targetUserId, user.id, now),
  ]);

  let conversationClosed = false;
  if (peer) {
    await c.env.DB.batch([
      c.env.DB.prepare(
        `UPDATE matches SET unmatched_at = ?, unmatched_by = ? WHERE id = ? AND unmatched_at IS NULL`,
      ).bind(now, user.id, peer.matchId),
      c.env.DB.prepare(
        `DELETE FROM swipes WHERE (user_id = ? AND target_id = ?) OR (user_id = ? AND target_id = ?)`,
      ).bind(user.id, targetUserId, targetUserId, user.id),
      c.env.DB.prepare(
        `DELETE FROM invisible_requests
         WHERE (from_user = ? AND to_user = ?) OR (from_user = ? AND to_user = ?)`,
      ).bind(user.id, targetUserId, targetUserId, user.id),
    ]);
    await c.env.CHAT_ROOM.get(c.env.CHAT_ROOM.idFromName(peer.conversationId))
      .fetch(new Request('https://do/shutdown', { method: 'POST' }))
      .catch(() => undefined);
    conversationClosed = true;
  }

  // --- P0 : agrégat + blocage automatique éventuel (recalcul complet) ---
  // Anti-abus « signaleur en série » : ses signalements restent PROTECTEURS
  // (blocage mutuel ci-dessus) mais sont exclus des compteurs d'agrégat.
  const serialSelf = await c.env.DB.prepare(
    `SELECT COUNT(DISTINCT reported_id) AS n FROM reports
     WHERE reporter_id = ? AND created_at > ?`,
  )
    .bind(user.id, now - SERIAL_REPORTER_WINDOW_DAYS * 86400)
    .first<{ n: number }>();
  const reporterExcluded = (serialSelf?.n ?? 0) >= SERIAL_REPORTER_MAX_TARGETS;
  await recomputeReportAggregate(c.env.DB, targetUserId, category);
  if (reporterExcluded) {
    // Consigne durable de l'exclusion (traçabilité anti-abus, review humaine).
    await auditSystem(
      c.env.DB,
      'report_aggregate_reporter_excluded',
      targetUserId,
      reportId,
      JSON.stringify({ category, reporterTargets7d: serialSelf?.n ?? 0 }),
    );
  }

  const body: ReportResponse = {
    ok: true,
    reportId,
    conversationClosed,
    note: conversationClosed
      ? 'Signalement envoyé — la conversation est fermée et le profil bloqué. Notre équipe review sous 24 h.'
      : 'Signalement envoyé — le profil est bloqué pour toi. Notre équipe review sous 24 h.',
  };
  return c.json(body);
});

// ---------------------------------------------------------------------------
// 2-bis. Recours sur sanction (P0 — re-audit : « 0 appeal »)
// Le titulaire d'une sanction ACTIVE peut déposer UN recours en attente ;
// la décision revient à un admin NOMMÉ (POST /admin/appeals/:id/review).
// ---------------------------------------------------------------------------

/** POST /api/sanctions/:id/appeal { message } — titulaire de la sanction uniquement. */
safetyRoutes.post('/sanctions/:id/appeal', async (c) => {
  // P0 recours — porte OUVERTE au titulaire sanctionné : contrairement à
  // requireUser (403 banni/suspendu), on exige seulement une session valide
  // d'un compte existant non supprimé. NB (limitation écosystème, hors
  // périmètre whitelist) : un BANNI n'a plus de session (révoquées au ban) et
  // le login lui est refusé ; le middleware /api/* (index.ts) bloque aussi les
  // suspendus hors 4 routes — l'ouverture du canal de recours aux bannis
  // (email support / dérogation middleware) reste à poser côté infra.
  const session = c.get('session');
  if (!session) throw errors.unauthorized();
  const user = await c.env.DB.prepare(`SELECT id, status FROM users WHERE id = ? LIMIT 1`)
    .bind(session.userId)
    .first<{ id: string; status: string }>();
  if (!user || user.status === 'deleted') throw errors.unauthorized();
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.safetyReportUser, user.id);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.safetyReportUser.scope);

  const sanctionId = c.req.param('id');
  const payload = (await c.req.json().catch(() => null)) as { message?: unknown } | null;
  const message = typeof payload?.message === 'string' ? payload.message.trim().slice(0, 1000) : '';
  if (message.length < 10) {
    throw errors.badRequest('Explique ton recours (10 à 1000 caractères).');
  }

  const sanction = await c.env.DB.prepare(
    `SELECT id, user_id, status FROM sanctions WHERE id = ? LIMIT 1`,
  )
    .bind(sanctionId)
    .first<{ id: string; user_id: string; status: string }>();
  // 404 générique : n'expose ni l'existence ni le titulaire d'une sanction.
  if (!sanction || sanction.user_id !== user.id) {
    throw errors.notFound('Sanction introuvable.');
  }
  if (sanction.status !== 'active') {
    throw errors.badRequest('Cette sanction n\u2019est plus active — aucun recours nécessaire.');
  }

  const pending = await c.env.DB.prepare(
    `SELECT id FROM sanctions_appeals WHERE sanction_id = ? AND status = 'pending' LIMIT 1`,
  )
    .bind(sanctionId)
    .first<{ id: string }>();
  if (pending) throw errors.conflict('Un recours est déjà en cours d\u2019examen.');

  const now = Math.floor(Date.now() / 1000);
  const appealId = crypto.randomUUID();
  await c.env.DB.prepare(
    `INSERT INTO sanctions_appeals (id, sanction_id, user_id, message, status, created_at)
     VALUES (?, ?, ?, ?, 'pending', ?)`,
  )
    .bind(appealId, sanctionId, user.id, message, now)
    .run();
  await auditSystem(c.env.DB, 'appeal_created', user.id, appealId, JSON.stringify({ sanctionId }));

  const body = {
    ok: true as const,
    appealId,
    note: 'Recours enregistré — un membre de l\u2019équipe l\u2019examinera et tu auras une réponse.',
  };
  return c.json(body);
});

// ---------------------------------------------------------------------------
// 3. Check-in sécurité (plan 7.5)
// ---------------------------------------------------------------------------

safetyRoutes.get('/safety/checkins', async (c) => {
  const user = await requireUser(c);
  const { results } = await c.env.DB.prepare(
    `SELECT sc.id, sc.conversation_id, sc.when_ts, sc.status, sc.created_at,
            u.display_name AS other_name
     FROM safety_checkins sc
     JOIN matches m ON m.id = (SELECT match_id FROM conversations WHERE id = sc.conversation_id)
     JOIN users u ON u.id = CASE WHEN m.user_a_id = sc.user_id THEN m.user_b_id ELSE m.user_a_id END
     WHERE sc.user_id = ? AND sc.status = 'active'
     ORDER BY sc.when_ts ASC LIMIT 10`,
  )
    .bind(user.id)
    .all<{
      id: string;
      conversation_id: string;
      when_ts: number;
      status: string;
      created_at: number;
      other_name: string | null;
    }>();

  const checkins: CheckinDto[] = (results ?? []).map((r) => ({
    id: r.id,
    conversationId: r.conversation_id,
    otherName: r.other_name ?? 'Quelqu’un',
    whenTs: r.when_ts,
    status: 'active',
    createdAt: r.created_at,
  }));
  const body: CheckinListResponse = {
    checkins,
    note: 'Après la date, wairyu te demandera « Ça s’est bien passé ? » — tu peux clôturer ou alerter.',
  };
  return c.json(body);
});

safetyRoutes.post('/safety/checkins', async (c) => {
  const user = await requireUser(c);
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.safetyCheckinUser, user.id);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.safetyCheckinUser.scope);

  const payload = (await c.req.json().catch(() => null)) as {
    conversationId?: unknown;
    whenTs?: unknown;
  } | null;
  const conversationId = typeof payload?.conversationId === 'string' ? payload.conversationId : '';
  const whenTs = Math.round(Number(payload?.whenTs) || 0);
  if (!conversationId) throw errors.badRequest('Conversation requise.');
  if (whenTs <= Date.now() / 1000 || whenTs > Date.now() / 1000 + 30 * 86400) {
    throw errors.badRequest('La date du rendez-vous doit être dans le futur (≤ 30 jours).');
  }

  const peer = await conversationPeer(c, conversationId, user.id);

  const activeCount = await c.env.DB.prepare(
    `SELECT COUNT(*) AS n FROM safety_checkins WHERE user_id = ? AND status = 'active'`,
  )
    .bind(user.id)
    .first<{ n: number }>();
  if ((activeCount?.n ?? 0) >= SAFETY.checkinsActiveMax) {
    throw errors.badRequest('Tu as déjà 5 check-ins actifs — clôture-en un d’abord.');
  }

  const now = Math.floor(Date.now() / 1000);
  const id = crypto.randomUUID();
  await c.env.DB.prepare(
    `INSERT INTO safety_checkins (id, user_id, conversation_id, when_ts, status, created_at)
     VALUES (?, ?, ?, ?, 'active', ?)`,
  )
    .bind(id, user.id, peer.conversationId, whenTs, now)
    .run();

  const checkin: CheckinDto = {
    id,
    conversationId: peer.conversationId,
    otherName: peer.otherName,
    whenTs,
    status: 'active',
    createdAt: now,
  };
  const body: CheckinCreateResponse = {
    ok: true,
    checkin,
    note: `Check-in enregistré — wairyu te contactera après le ${new Date(whenTs * 1000).toLocaleDateString('fr-FR')}.`,
  };
  return c.json(body);
});

/** POST /api/safety/checkins/:id/done { outcome: 'ok'|'flagged' } — clôture. */
safetyRoutes.post('/safety/checkins/:id/done', async (c) => {
  const user = await requireUser(c);
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.safetyCheckinUser, user.id);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.safetyCheckinUser.scope);

  const id = c.req.param('id');
  const payload = (await c.req.json().catch(() => null)) as { outcome?: unknown } | null;
  const outcome = payload?.outcome === 'flagged' ? 'flagged' : 'ok';

  const row = await c.env.DB.prepare(
    `SELECT id, status FROM safety_checkins WHERE id = ? AND user_id = ?`,
  )
    .bind(id, user.id)
    .first<{ id: string; status: string }>();
  if (!row) throw errors.notFound('Check-in introuvable.');
  if (row.status !== 'active') throw errors.badRequest('Check-in déjà clôturé.');

  const now = Math.floor(Date.now() / 1000);
  await c.env.DB.prepare(
    `UPDATE safety_checkins SET status = ?, updated_at = ? WHERE id = ?`,
  )
    .bind(outcome, now, id)
    .run();

  return c.json({
    ok: true as const,
    status: outcome,
    note:
      outcome === 'ok'
        ? 'Content de l’entendre — bonne continuation !'
        : 'Nous en prenons note. Si tu es en danger, contacte les secours locaux (police : ton pays).',
  });
});

// ---------------------------------------------------------------------------
// 4. Confidentialité v1 (plan 7.7)
// ---------------------------------------------------------------------------

safetyRoutes.get('/settings/privacy', async (c) => {
  const user = await requireUser(c);
  const body: PrivacyResponse = {
    paused: user.paused === 1,
    incognito: user.incognito === 1,
    modeVisible: user.mode_visible !== 0,
    note: 'Le flou des photos Invisible reste TOUJOURS actif — ces réglages ne touchent que la visibilité.',
  };
  return c.json(body);
});

safetyRoutes.put('/settings/privacy', async (c) => {
  const user = await requireUser(c);
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.safetyPrivacyUser, user.id);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.safetyPrivacyUser.scope);

  const payload = (await c.req.json().catch(() => null)) as {
    paused?: unknown;
    incognito?: unknown;
    modeVisible?: unknown;
  } | null;

  const sets: string[] = [];
  const vals: (number | null)[] = [];
  if (typeof payload?.paused === 'boolean') {
    sets.push('paused = ?');
    vals.push(payload.paused ? 1 : 0);
  }
  if (typeof payload?.incognito === 'boolean') {
    sets.push('incognito = ?');
    vals.push(payload.incognito ? 1 : 0);
  }
  if (typeof payload?.modeVisible === 'boolean') {
    sets.push('mode_visible = ?');
    vals.push(payload.modeVisible ? 1 : 0);
  }
  if (sets.length === 0) throw errors.badRequest('Aucun réglage fourni.');

  await c.env.DB.prepare(`UPDATE users SET ${sets.join(', ')}, updated_at = ? WHERE id = ?`)
    .bind(...vals, Math.floor(Date.now() / 1000), user.id)
    .run();

  const body: PrivacyResponse = {
    paused: payload?.paused === true,
    incognito: payload?.incognito === true,
    modeVisible: payload?.modeVisible !== false,
    note:
      payload?.paused === true
        ? 'Profil en pause — tu n’apparais plus dans aucun feed. Tes matchs et conversations restent intacts.'
        : 'Réglages enregistrés.',
  };
  return c.json(body);
});

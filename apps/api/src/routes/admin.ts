/**
 * Admin — /admin/usage, /admin/satisfaction (Task 66), /admin/moderation/*
 * (Task 109 : espace de modération RENCONTRE-E2).
 *
 * Garde commune : Bearer ADMIN_TOKEN en temps constant, FAIL-CLOSED — si le
 * secret est absent, 503. Toute MUTATION de modération écrit dans audit_admin
 * (piste d'audit 0013) : action, cible, détails JSON, horodatage epoch.
 *
 * Lecture seule des signalements/blocages : pseudos exposés UNIQUEMENT à un
 * appelant déjà porteur du jeton admin (outil interne du fondateur).
 */
import { Hono } from 'hono';
import type { Context } from 'hono';
import type { AppEnv } from '../env';
import { errorBody, errors, reqId } from '../lib/errors';
import { timingSafeEqual } from '../lib/session';
import { currentStartedAt, isolateUptimeSeconds, snapshotCounters } from '../middleware/usage';
import type { UsageResponse } from '@wairyu/shared';

export const adminRoutes = new Hono<AppEnv>();

/** Garde Bearer ADMIN_TOKEN — temps constant, fail-closed. Réponse de refus ou null. */
function gardeAdmin(c: Context<AppEnv>): Response | null {
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
  return null;
}

/** Pseudo affiché : display_name (trim) sinon username. (Même règle que messages.ts.) */
function pseudoDe(dn: string | null, un: string | null): string | null {
  const t = (dn ?? '').trim();
  return t.length > 0 ? t : un ?? null;
}

/** Bornes génériques des paginations admin. */
function borne(v: string | undefined, def: number, min: number, max: number): number {
  const n = Number(v ?? def) || def;
  return Math.min(Math.max(Math.trunc(n), min), max);
}

adminRoutes.get('/usage', async (c) => {
  const refuse = gardeAdmin(c);
  if (refuse) return refuse;

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
// (Task 66). Lecture seule, même garde Bearer + fail-closed que /usage.
adminRoutes.get('/satisfaction', async (c) => {
  const refuse = gardeAdmin(c);
  if (refuse) return refuse;

  const limite = borne(c.req.query('limite'), 200, 1, 500);
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

// =====================================================================
// MODÉRATION (Task 109) — signalements (0015) + blocages, audit trail.
// =====================================================================

const STATUTS_FILTRE = new Set(['ouvert', 'traite', 'rejete', 'tous']);

// GET /admin/moderation/apercu — compteurs du tableau de bord.
adminRoutes.get('/moderation/apercu', async (c) => {
  const refuse = gardeAdmin(c);
  if (refuse) return refuse;

  const iso7j = new Date(Date.now() - 7 * 86400_000).toISOString();
  const iso24h = new Date(Date.now() - 86400_000).toISOString();

  const rs = await c.env.DB.batch<{ n: number }>([
    c.env.DB.prepare(`SELECT COUNT(*) AS n FROM rencontre_signalements WHERE statut = 'ouvert'`),
    c.env.DB.prepare(`SELECT COUNT(*) AS n FROM rencontre_signalements WHERE statut = 'traite'`),
    c.env.DB.prepare(`SELECT COUNT(*) AS n FROM rencontre_signalements WHERE statut = 'rejete'`),
    c.env.DB.prepare(`SELECT COUNT(*) AS n FROM rencontre_signalements WHERE cree_a >= ?1`).bind(iso7j),
    c.env.DB.prepare(`SELECT COUNT(*) AS n FROM rencontre_blocages`),
    c.env.DB.prepare(`SELECT COUNT(*) AS n FROM rencontre_blocages WHERE cree_a >= ?1`).bind(iso7j),
    c.env.DB.prepare(`SELECT COUNT(*) AS n FROM rencontre_messages WHERE cree_a >= ?1`).bind(iso24h),
    c.env.DB.prepare(`SELECT COUNT(*) AS n FROM rencontre_matchs`),
  ]);

  const n = (i: number): number => rs[i]?.results?.[0]?.n ?? 0;
  return c.json({
    ok: true,
    apercu: {
      signalementsOuverts: n(0),
      signalementsTraités: n(1),
      signalementsRejetés: n(2),
      signalements7j: n(3),
      blocagesTotal: n(4),
      blocages7j: n(5),
      messages24h: n(6),
      matchsTotal: n(7),
    },
  });
});

// GET /admin/moderation/signalements?statut=ouvert|traite|rejete|tous&limite=&decalage=
adminRoutes.get('/moderation/signalements', async (c) => {
  const refuse = gardeAdmin(c);
  if (refuse) return refuse;

  const statut = c.req.query('statut') ?? 'ouvert';
  if (!STATUTS_FILTRE.has(statut)) {
    const id = c.get('reqId') ?? reqId();
    return c.json(errorBody('bad_request', 'Statut inconnu (ouvert|traite|rejete|tous).', id), 400);
  }
  const limite = borne(c.req.query('limite'), 50, 1, 200);
  const decalage = borne(c.req.query('decalage'), 0, 0, 10_000);

  const where = statut === 'tous' ? '' : `WHERE s.statut = ?1`;
  const { results } = await c.env.DB.prepare(
    `SELECT s.id, s.de, s.contre, s.motif, s.detail, s.match_id, s.statut, s.cree_a,
            ud.display_name AS dn_de,  apd.username   AS un_de,
            uc.display_name AS dn_ctr, apc.username   AS un_ctr
       FROM rencontre_signalements s
       LEFT JOIN users ud ON ud.id = s.de
       LEFT JOIN auth_password apd ON apd.user_id = s.de
       LEFT JOIN users uc ON uc.id = s.contre
       LEFT JOIN auth_password apc ON apc.user_id = s.contre
       ${where}
       ORDER BY s.cree_a DESC, s.id DESC
       LIMIT ${limite} OFFSET ${decalage}`,
  )
    .bind(...(statut === 'tous' ? [] : [statut]))
    .all<{
      id: string; de: string; contre: string; motif: string; detail: string | null;
      match_id: string | null; statut: string; cree_a: string;
      dn_de: string | null; un_de: string | null; dn_ctr: string | null; un_ctr: string | null;
    }>();

  const signalements = (results ?? []).map((r) => ({
    id: r.id,
    de: r.de,
    contre: r.contre,
    motif: r.motif,
    detail: r.detail,
    matchId: r.match_id,
    statut: r.statut,
    creeA: r.cree_a,
    pseudoDe: pseudoDe(r.dn_de, r.un_de),
    pseudoContre: pseudoDe(r.dn_ctr, r.un_ctr),
  }));
  return c.json({ ok: true, signalements });
});

// POST /admin/moderation/signalements/:id — body { statut: 'traite' | 'rejete' }.
// Mutation tracée dans audit_admin (action moderation_signalement_*).
adminRoutes.post('/moderation/signalements/:id', async (c) => {
  const refuse = gardeAdmin(c);
  if (refuse) return refuse;

  const id = c.get('reqId') ?? reqId();
  const sigId = c.req.param('id');
  let statut = '';
  try {
    const corps = (await c.req.json()) as { statut?: string };
    statut = typeof corps.statut === 'string' ? corps.statut : '';
  } catch {
    throw errors.badRequest('Corps JSON attendu.');
  }
  if (statut !== 'traite' && statut !== 'rejete') {
    return c.json(errorBody('bad_request', 'Statut attendu : traite ou rejete.', id), 400);
  }

  const existant = await c.env.DB.prepare(
    `SELECT id, contre, motif, statut FROM rencontre_signalements WHERE id = ?1`,
  )
    .bind(sigId)
    .first<{ id: string; contre: string; motif: string; statut: string }>();
  if (!existant) {
    return c.json(errorBody('not_found', 'Signalement introuvable.', id), 404);
  }

  await c.env.DB.batch([
    c.env.DB.prepare(`UPDATE rencontre_signalements SET statut = ?1 WHERE id = ?2`).bind(statut, sigId),
    c.env.DB.prepare(
      `INSERT INTO audit_admin (admin, action, target_user, target_id, details, created_at)
       VALUES (?1, ?2, ?3, NULL, ?4, ?5)`,
    ).bind(
      'fondateur',
      `moderation_signalement_${statut}`,
      existant.contre,
      JSON.stringify({ signalement: sigId, motif: existant.motif, statut_precedent: existant.statut }),
      Math.floor(Date.now() / 1000),
    ),
  ]);

  return c.json({ ok: true, signalement: { id: sigId, statut } });
});

// GET /admin/moderation/blocages?limite=&decalage= — registre des blocages.
adminRoutes.get('/moderation/blocages', async (c) => {
  const refuse = gardeAdmin(c);
  if (refuse) return refuse;

  const limite = borne(c.req.query('limite'), 50, 1, 200);
  const decalage = borne(c.req.query('decalage'), 0, 0, 10_000);

  const { results } = await c.env.DB.prepare(
    `SELECT b.id, b.par, b.contre, b.cree_a,
            up.display_name AS dn_par,  app.username  AS un_par,
            uc.display_name AS dn_ctr,  apc.username  AS un_ctr
       FROM rencontre_blocages b
       LEFT JOIN users up ON up.id = b.par
       LEFT JOIN auth_password app ON app.user_id = b.par
       LEFT JOIN users uc ON uc.id = b.contre
       LEFT JOIN auth_password apc ON apc.user_id = b.contre
       ORDER BY b.cree_a DESC, b.id DESC
       LIMIT ${limite} OFFSET ${decalage}`,
  )
    .all<{ id: string; par: string; contre: string; cree_a: string; dn_par: string | null; un_par: string | null; dn_ctr: string | null; un_ctr: string | null }>();

  const blocages = (results ?? []).map((r) => ({
    id: r.id,
    par: r.par,
    contre: r.contre,
    creeA: r.cree_a,
    pseudoPar: pseudoDe(r.dn_par, r.un_par),
    pseudoContre: pseudoDe(r.dn_ctr, r.un_ctr),
  }));
  return c.json({ ok: true, blocages });
});

// Référence à errors pour l'usage futur des autres routes admin (Étape 7+).
void errors;

/* ==================================================================== */
/* MODÉRATION & APPEL (Task 115) — SPEC v1.1, M-1..7 + G-MA-1..6        */
/*  - Pose/levée de sanctions (N1/N2) — TOUTE action tracée audit_admin ; */
/*  - File d'appels in-app (accepter = lever, sans trace pour les autres)*/ 
/*  - Accès au média signalé (G-E3-P9) : unique cas d'accès humain,      */
/*    tracé, jamais pour la gestion courante.                            */
/* ==================================================================== */

import { MESSAGE_SANCTION } from '../middleware/sanction';
import { RATE_RULES, hitRateLimit, rateLimitedError } from '../lib/ratelimit';

/** Trace une action de modération (M-2 : aucune action hors audit).
 *  target_user = le compte concerné s'il existe ; les identifiants techniques
 *  (appel/media) vivent dans details. */
async function tracer(c: Context<AppEnv>, action: string, targetUser: string | null, details: unknown) {
  await c.env.DB.prepare(
    `INSERT INTO audit_admin (admin, action, target_user, target_id, details, created_at)
     VALUES ('fondateur', ?, ?, NULL, ?, strftime('%s','now'))`,
  )
    .bind(action, targetUser, JSON.stringify(details ?? {}))
    .run();
}

// GET /admin/moderation/appels?statut=ouvert — la file des relectures.
adminRoutes.get('/moderation/appels', async (c) => {
  const refuse = gardeAdmin(c);
  if (refuse) return refuse;
  const statut = c.req.query('statut');
  const where = statut === 'ouvert' || statut === 'accepte' || statut === 'rejete'
    ? `WHERE a.statut = '${statut}'`
    : '';
  const { results } = await c.env.DB.prepare(
    `SELECT a.id, a.user_id, a.sanction_id, a.message, a.statut, a.cree_a,
            s.niveau AS sanction_niveau, s.cree_a AS sanction_cree_a,
            u.display_name AS dn, ap.username AS un
     FROM moderation_appels a
     LEFT JOIN moderation_sanctions s ON s.id = a.sanction_id
     LEFT JOIN users u ON u.id = a.user_id
     LEFT JOIN auth_password ap ON ap.user_id = a.user_id
     ${where}
     ORDER BY a.cree_a DESC LIMIT 200`,
  ).all<Record<string, string | number | null>>();
  return c.json({
    ok: true,
    appels: (results ?? []).map((r) => ({
      id: r.id,
      userId: r.user_id,
      pseudo: pseudoDe(r.dn as string | null, r.un as string | null),
      sanctionId: r.sanction_id,
      sanctionNiveau: r.sanction_niveau,
      message: r.message,
      statut: r.statut,
      creeA: r.cree_a,
      sanctionCreeA: r.sanction_cree_a,
    })),
  });
});

// POST /admin/moderation/appels/:id {decision: 'accepte'|'rejete'}
// accepte ⇒ sanction LEVÉE (levee_par 'appel_accepte', M-5/G-MA-6).
adminRoutes.post('/moderation/appels/:id', async (c) => {
  const refuse = gardeAdmin(c);
  if (refuse) return refuse;
  const appelId = c.req.param('id');
  if (!/^[0-9a-f-]{16,64}$/i.test(appelId)) throw errors.badRequest('Identifiant invalide.');
  const body = (await c.req.json().catch(() => null)) as { decision?: unknown } | null;
  const decision = body?.decision;
  if (decision !== 'accepte' && decision !== 'rejete') {
    throw errors.badRequest("Décision invalide (accepte | rejete).");
  }
  const appel = await c.env.DB.prepare(
    `SELECT id, sanction_id, statut FROM moderation_appels WHERE id = ? LIMIT 1`,
  ).bind(appelId).first<{ id: string; sanction_id: string; statut: string }>();
  if (!appel) throw errors.notFound();
  if (appel.statut !== 'ouvert') throw errors.badRequest('Appel déjà tranché.');

  await c.env.DB.prepare(
    `UPDATE moderation_appels SET statut = ?, traite_a = ? WHERE id = ?`,
  ).bind(decision, new Date().toISOString(), appelId).run();

  if (decision === 'accepte') {
    const levee = new Date().toISOString();
    await c.env.DB.prepare(
      `UPDATE moderation_sanctions SET levee_a = ?, levee_par = 'appel_accepte'
       WHERE id = ? AND levee_a IS NULL`,
    ).bind(levee, appel.sanction_id).run();
  }
  await tracer(c, `appel_${decision}`, appelId, { sanctionId: appel.sanction_id });
  return c.json({ ok: true, sanctionLevee: decision === 'accepte' });
});

// POST /admin/moderation/sanctions {userId, niveau, signalementId?, details?}
adminRoutes.post('/moderation/sanctions', async (c) => {
  const refuse = gardeAdmin(c);
  if (refuse) return refuse;
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.modAdminAction, 'console');
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.modAdminAction.scope);

  const body = (await c.req.json().catch(() => null)) as {
    userId?: unknown; niveau?: unknown; signalementId?: unknown; details?: unknown;
  } | null;
  const userId = typeof body?.userId === 'string' ? body.userId : '';
  const niveau = body?.niveau;
  const signalementId = typeof body?.signalementId === 'string' ? body.signalementId : null;
  const details = typeof body?.details === 'string' ? body.details.slice(0, 500) : null;
  if (!/^[0-9a-f-]{16,64}$/i.test(userId) || (niveau !== 1 && niveau !== 2)) {
    throw errors.badRequest('userId + niveau (1|2) requis.');
  }
  const active = await c.env.DB.prepare(
    `SELECT id, niveau FROM moderation_sanctions WHERE user_id = ? AND levee_a IS NULL LIMIT 1`,
  ).bind(userId).first<{ id: string; niveau: number }>();
  if (active) throw errors.conflict(`Une sanction N${active.niveau} est déjà active pour ce compte.`);

  const id = crypto.randomUUID();
  await c.env.DB.prepare(
    `INSERT INTO moderation_sanctions (id, user_id, niveau, signalement_id, details, cree_a)
     VALUES (?, ?, ?, ?, ?, ?)`,
  )
    .bind(id, userId, niveau, signalementId, details, new Date().toISOString())
    .run();
  await tracer(c, `sanction_n${niveau}`, userId, { sanctionId: id, signalementId, details });
  return c.json({ ok: true, sanctionId: id, message: MESSAGE_SANCTION });
});

// POST /admin/moderation/sanctions/:id/lever — levée manuelle (appel traité
// hors système, erreur constatée…) — toujours tracée.
adminRoutes.post('/moderation/sanctions/:id/lever', async (c) => {
  const refuse = gardeAdmin(c);
  if (refuse) return refuse;
  const sanctionId = c.req.param('id');
  if (!/^[0-9a-f-]{16,64}$/i.test(sanctionId)) throw errors.badRequest('Identifiant invalide.');
  const res = await c.env.DB.prepare(
    `UPDATE moderation_sanctions SET levee_a = ?, levee_par = 'admin'
     WHERE id = ? AND levee_a IS NULL`,
  ).bind(new Date().toISOString(), sanctionId).run();
  if (!res.meta.changes) throw errors.notFound();
  await tracer(c, 'sanction_levee', sanctionId, {});
  return c.json({ ok: true });
});

// GET /admin/moderation/medias?matchId= — les MÉTADONNÉES d'un match signalé.
adminRoutes.get('/moderation/medias', async (c) => {
  const refuse = gardeAdmin(c);
  if (refuse) return refuse;
  const matchId = c.req.query('matchId') ?? '';
  if (!/^[0-9a-f-]{16,64}$/i.test(matchId)) throw errors.badRequest('matchId requis.');
  const { results } = await c.env.DB.prepare(
    `SELECT m.id, m.user_id, m.type, m.duree_s, m.octets, m.mime, m.cree_a,
            u.display_name AS dn, ap.username AS un
     FROM rencontre_medias m
     LEFT JOIN users u ON u.id = m.user_id
     LEFT JOIN auth_password ap ON ap.user_id = m.user_id
     WHERE m.match_id = ?1 ORDER BY m.cree_a DESC LIMIT 100`,
  ).bind(matchId).all<Record<string, string | number | null>>();
  return c.json({
    ok: true,
    medias: (results ?? []).map((r) => ({
      id: r.id,
      userId: r.user_id,
      type: r.type,
      dureeS: r.duree_s,
      octets: r.octets,
      mime: r.mime,
      creeA: r.cree_a,
      auteur: pseudoDe(r.dn as string | null, r.un as string | null),
    })),
  });
});

// GET /admin/moderation/medias/:id — LE flux du média (G-E3-P9). Unique cas
// d'accès humain aux médias, TRACÉ AVANT l'envoi (audit inconditionnel).
adminRoutes.get('/moderation/medias/:id', async (c) => {
  const refuse = gardeAdmin(c);
  if (refuse) return refuse;
  if (!c.env.MEDIA) throw errors.notFound();
  const mediaId = c.req.param('id');
  if (!/^[0-9a-f-]{16,64}$/i.test(mediaId)) throw errors.badRequest('Identifiant invalide.');
  const meta = await c.env.DB.prepare(
    `SELECT r2_key, mime, match_id, user_id FROM rencontre_medias WHERE id = ? LIMIT 1`,
  ).bind(mediaId).first<{ r2_key: string; mime: string; match_id: string; user_id: string }>();
  if (!meta) throw errors.notFound();
  await tracer(c, 'media_consulte', meta.user_id, { matchId: meta.match_id, mediaId });
  const objet = await c.env.MEDIA.get(meta.r2_key);
  if (!objet) throw errors.notFound();
  const entetes = new Headers();
  entetes.set('content-type', meta.mime || objet.httpMetadata?.contentType || 'application/octet-stream');
  entetes.set('cache-control', 'private, no-store');
  return new Response(objet.body, { headers: entetes });
});

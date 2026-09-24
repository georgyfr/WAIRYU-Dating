/**
 * Découverte dual-mode (Étape 5) — swipe Classique, handshake Invisible,
 * quotas gratuits, matchs/conversations et passerelle.
 *
 * Règles déterministes (spécification §4.6, documentées — aucune IA) :
 *  1. Mode par défaut différent : chacun voit l'autre selon le mode du
 *     PROPRIÉTAIRE (le feed floute la photo si le propriétaire est Invisible) ;
 *     le mode de MON découverte ne change jamais ce que l'autre voit de moi.
 *  2. Passerelle refusée : la conversation reste en Classique (rien ne change).
 *  3. Consentement mutuel : la passerelle (§4.4) et la révélation (Étape 6)
 *     exigent l'accord des deux.
 *  4. Le mode d'une CONVERSATION naît de l'action fondatrice : likes mutuels
 *     en contexte Classique/Interracial ⇒ conversation 'classic' ; demande
 *     « Discuter » acceptée (ou like mutuel en contexte Invisible) ⇒ 'invisible'.
 *     Le dernier clic décide du contexte de création — la passerelle peut
 *     ensuite le faire évoluer AVEC consentement (§4.8 : jamais de perte).
 *  5. Bascule du mode par défaut (§4.8 scénario D) : ne touche JAMAIS aux
 *     matchs/conversations existants — elle régit les futures découvertes.
 *
 * Quotas gratuits (spec §6, plan 5.3) : compteurs en D1 (table rate_limits,
 * fenêtre fixe 24 h alignée UTC, purge par le cron existant) — 50 likes/jour,
 * 10 demandes Invisible/jour, 1 Super Like/jour, 1 Rewind/jour.
 */
import { Hono } from 'hono';
import type { Context } from 'hono';
import type { AppEnv } from '../env';
import { errors } from '../lib/errors';
import { RATE_RULES, hitRateLimit, readWindowCount, rateLimitedError } from '../lib/ratelimit';
import { signedMediaUrl } from '../lib/cloudinary';
import { generateFeedPage } from '../lib/discovery';
import { sendPushToUser } from '../lib/push';
import { validateEnum } from '../lib/profile';
import { PHOTO_THUMB_WIDTH, PHOTO_BLUR_WIDTH, DISCOVERY } from '@wairyu/shared';
import type {
  QuotaState,
  SwipeAction,
  SwipeResponse,
  RewindResponse,
  InvisibleRequestDto,
  InvisibleRequestResponse,
  InvisibleRespondResponse,
  InboxResponse,
  MatchDto,
  MatchListResponse,
  GatewayResponse,
  TopResponse,
  DiscoveryMode,
  LikesMeDto,
  LikesMeResponse,
} from '@wairyu/shared';

export const discoverRoutes = new Hono<AppEnv>();

async function requireUser(c: Context<AppEnv>) {
  const session = c.get('session');
  if (!session) throw errors.unauthorized();
  const user = await c.env.DB.prepare(`SELECT id, status, paused FROM users WHERE id = ? LIMIT 1`)
    .bind(session.userId)
    .first<{ id: string; status: string; paused: number | null }>();
  if (!user || user.status === 'deleted') throw errors.unauthorized();
  if (user.status === 'banned') throw errors.forbidden('Compte suspendu.');
  return user;
}

/** Étape 7 (plan 7.7) : un profil EN PAUSE ne peut pas agir sur la découverte. */
function requireNotPaused(user: { paused: number | null }): void {
  if (user.paused === 1) {
    throw errors.forbidden('Ta pause est active — désactive-la dans Confidentialité pour découvrir à nouveau.');
  }
}

const MODES: readonly string[] = ['classic', 'invisible', 'interracial'];

/** Lit les 4 compteurs du jour (lecture seule) → état des quotas. */
async function buildQuota(db: D1Database, userId: string): Promise<QuotaState> {
  const [likes, supers, inv, rew] = await Promise.all([
    readWindowCount(db, RATE_RULES.discoverLikeUser, userId),
    readWindowCount(db, RATE_RULES.discoverSuperUser, userId),
    readWindowCount(db, RATE_RULES.discoverInvisibleUser, userId),
    readWindowCount(db, RATE_RULES.discoverRewindUser, userId),
  ]);
  return {
    likesUsed: likes,
    likesLeft: Math.max(0, DISCOVERY.likesPerDay - likes),
    supersUsed: supers,
    supersLeft: Math.max(0, DISCOVERY.superLikesPerDay - supers),
    invisibleUsed: inv,
    invisibleLeft: Math.max(0, DISCOVERY.invisibleRequestsPerDay - inv),
    rewindsUsed: rew,
    rewindsLeft: Math.max(0, DISCOVERY.rewindsPerDay - rew),
  };
}

/**
 * Quota PRODUIT (likes, super, demandes, rewind) : pré-lecture SANS écriture,
 * refus immédiat si la fenêtre est pleine — une tentative refusée ne consomme
 * RIEN (contrairement aux limites anti-abus). Fenêtre fixe 24 h alignée UTC.
 */
async function consumeQuota(db: D1Database, rule: { scope: string; windowSeconds: number; max: number }, userId: string, label: string): Promise<void> {
  const used = await readWindowCount(db, rule, userId);
  if (used >= rule.max) {
    throw errors.rateLimited(`Quota du jour atteint (${label} — ${rule.max}/jour). Ça repart à minuit UTC.`);
  }
  const rl = await hitRateLimit(db, rule, userId);
  if (!rl.allowed) {
    throw errors.rateLimited(`Quota du jour atteint (${label} — ${rule.max}/jour). Ça repart à minuit UTC.`);
  }
}

interface PhotoMeta {
  id: string;
  user_id: string;
  cloudinary_version: number;
}

/** Photo principale signée (floue si le PROPRIÉTAIRE est Invisible — §4.6.1). */
async function bestPhoto(
  c: Context<AppEnv>,
  userId: string,
  blurred: boolean,
): Promise<{ url: string | null; blurred: boolean }> {
  const photo = await c.env.DB.prepare(
    `SELECT id, user_id, cloudinary_version FROM photos
     WHERE user_id = ? AND status = 'active' AND deleted_at IS NULL
     ORDER BY position ASC, created_at ASC LIMIT 1`,
  )
    .bind(userId)
    .first<PhotoMeta>();
  if (!photo) return { url: null, blurred };
  const publicId = `${c.env.CLOUDINARY_ROOT_FOLDER}/photos/${userId}/${photo.id}`;
  const url = await signedMediaUrl(
    c.env.CLOUDINARY_CLOUD_NAME,
    c.env.CLOUDINARY_API_SECRET,
    publicId,
    {
      version: photo.cloudinary_version,
      transformation: `c_limit,w_${blurred ? PHOTO_BLUR_WIDTH : PHOTO_THUMB_WIDTH}`,
    },
  );
  return { url, blurred };
}

/** Vérifie que la cible existe, est active, n'est pas moi et non bloquée — renvoie prénom. */
async function validTarget(
  c: Context<AppEnv>,
  me: string,
  targetId: unknown,
): Promise<{ id: string; display_name: string | null }> {
  if (typeof targetId !== 'string' || targetId.length < 6 || targetId === me) {
    throw errors.badRequest('Cible invalide.');
  }
  const target = await c.env.DB.prepare(
    `SELECT id, display_name, status FROM users WHERE id = ?`,
  )
    .bind(targetId)
    .first<{ id: string; display_name: string | null; status: string }>();
  if (!target || target.status === 'deleted' || target.status === 'banned') {
    throw errors.notFound('Ce profil n’est plus disponible.');
  }
  // Étape 7 : un blocage DANS UN SENS OU DANS L'AUTRE (signalement, unmatch
  // « + bloquer ») rend tout re-liké impossible — le blocage est définitif
  // tant qu'un admin ne l'a pas levé.
  const block = await c.env.DB.prepare(
    `SELECT 1 AS x FROM blocks
     WHERE (user_id = ? AND blocked_id = ?) OR (user_id = ? AND blocked_id = ?) LIMIT 1`,
  )
    .bind(me, targetId, targetId, me)
    .first<{ x: number }>();
  if (block) throw errors.forbidden('Cette personne n’est plus disponible pour toi.');
  return target;
}

/** Crée le match (paire ordonnée) + sa conversation fondatrice. Idempotent. */
async function createMatchWithConversation(
  c: Context<AppEnv>,
  aId: string,
  bId: string,
  origin: 'like' | 'super' | 'invisible_request',
  conversationMode: 'classic' | 'invisible',
): Promise<{ matchId: string; conversationId: string; conversationMode: 'classic' | 'invisible' }> {
  const [userA, userB] = [aId, bId].sort((x, y) => x.localeCompare(y));
  const matchId = crypto.randomUUID();
  await c.env.DB.prepare(
    `INSERT INTO matches (id, user_a_id, user_b_id, origin, created_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT (user_a_id, user_b_id) DO UPDATE SET
       unmatched_at = NULL, unmatched_by = NULL,
       origin = excluded.origin, created_at = excluded.created_at`,
  )
    .bind(matchId, userA, userB, origin, Math.floor(Date.now() / 1000))
    .run();
  // Étape 6 — re-match après unmatch : le CONFLIT de paire réactive le match
  // (l'historique de la conversation est conservé, §4.8 « jamais de perte ») ;
  // le DO redevient accessible (le helper chatContext repasse reset:true).
  const match = await c.env.DB.prepare(
    `SELECT id FROM matches WHERE user_a_id = ? AND user_b_id = ? AND unmatched_at IS NULL`,
  )
    .bind(userA, userB)
    .first<{ id: string }>();
  if (!match) throw errors.internal('Création du match impossible.');
  const conversationId = crypto.randomUUID();
  await c.env.DB.prepare(
    `INSERT INTO conversations (id, match_id, mode, created_at)
     VALUES (?, ?, ?, ?) ON CONFLICT (match_id) DO NOTHING`,
  )
    .bind(conversationId, match.id, conversationMode, Math.floor(Date.now() / 1000))
    .run();
  // Re-match : la conversation d'origine est CONSERVÉE (historique §4.8) —
  // on la relit pour toujours renvoyer la conversation réelle.
  const conv = await c.env.DB.prepare(`SELECT id FROM conversations WHERE match_id = ?`)
    .bind(match.id)
    .first<{ id: string }>();
  return { matchId: match.id, conversationId: conv?.id ?? conversationId, conversationMode };
}

// ---------------------------------------------------------------------------
// GET /api/discover/quota — compteurs du jour (affichage front)
// ---------------------------------------------------------------------------
discoverRoutes.get('/discover/quota', async (c) => {
  const user = await requireUser(c);
  return c.json(await buildQuota(c.env.DB, user.id));
});

// ---------------------------------------------------------------------------
// POST /api/discover/swipe — like / passe / super (Classique, Interracial,
// et likes « en contexte Invisible » — spec §6.2.4 : like mutuel = match)
// ---------------------------------------------------------------------------
discoverRoutes.post('/discover/swipe', async (c) => {
  const user = await requireUser(c);
  requireNotPaused(user);
  const payload = await c.req.json<Record<string, unknown>>().catch(() => null);

  const action = validateEnum<SwipeAction>(
    payload?.action,
    ['like', 'pass', 'super'] as const,
    'Action',
  );
  // Contexte de découverte DECLARÉ par le front (défaut classic) — détermine
  // le mode de la conversation fondatrice (règle déterministe §4.6, cf. en-tête).
  const contextMode = validateEnum<DiscoveryMode>(
    payload?.mode ?? 'classic',
    MODES as unknown as readonly DiscoveryMode[],
    'Mode',
  );

  // Anti-abus mécanique (large) — indépendant des quotas produit.
  const rlAbuse = await hitRateLimit(c.env.DB, RATE_RULES.discoverActionUser, user.id);
  if (!rlAbuse.allowed) {
    throw rateLimitedError(rlAbuse.retryAfterSeconds, RATE_RULES.discoverActionUser.scope);
  }

  const target = await validTarget(c, user.id, payload?.targetId);

  // Un swipe par paire et par sens — jamais reproposé (le feed exclut déjà).
  const existing = await c.env.DB.prepare(
    `SELECT 1 AS x FROM swipes WHERE user_id = ? AND target_id = ?`,
  )
    .bind(user.id, target.id)
    .first();
  if (existing) throw errors.badRequest('Ce profil a déjà été traité.');

  // Déjà en conversation (handshake accepté sans swipe — Invisible) ?
  const otherId = user.id.localeCompare(target.id) < 0 ? target.id : user.id;
  const myId = user.id.localeCompare(target.id) < 0 ? user.id : target.id;
  const matchedRow = await c.env.DB.prepare(
    `SELECT id FROM matches WHERE user_a_id = ? AND user_b_id = ? AND unmatched_at IS NULL`,
  )
    .bind(myId, otherId)
    .first<{ id: string }>();
  if (matchedRow) throw errors.badRequest('Vous êtes déjà en conversation.');

  const quota = await buildQuota(c.env.DB, user.id);

  if (action !== 'pass') {
    // Le super est pré-vérifié AVANT le quota de likes : un super refusé ne
    // consomme AUCUN like. Le like et le super consomment ensuite les likes.
    if (action === 'super') {
      await consumeQuota(c.env.DB, RATE_RULES.discoverSuperUser, user.id, 'Super Likes');
    }
    await consumeQuota(c.env.DB, RATE_RULES.discoverLikeUser, user.id, 'likes');
  }

  await c.env.DB.prepare(
    `INSERT INTO swipes (user_id, target_id, action, created_at) VALUES (?, ?, ?, ?)`,
  )
    .bind(user.id, target.id, action, Math.floor(Date.now() / 1000))
    .run();

  // Réciprocité : la cible m'a déjà liké (like ou super) → match.
  let matched = false;
  let matchId: string | null = null;
  let conversationMode: 'classic' | 'invisible' | null = null;
  if (action !== 'pass') {
    const reciprocal = await c.env.DB.prepare(
      `SELECT 1 AS x FROM swipes
       WHERE user_id = ? AND target_id = ? AND action IN ('like','super')`,
    )
      .bind(target.id, user.id)
      .first();
    if (reciprocal) {
      const conversationModeFinal = contextMode === 'invisible' ? 'invisible' : 'classic';
      const res = await createMatchWithConversation(
        c,
        user.id,
        target.id,
        action === 'super' ? 'super' : 'like',
        conversationModeFinal,
      );
      matched = true;
      matchId = res.matchId;
      conversationMode = res.conversationMode;
      // Étape 6.8 — push « nouveau match » à l'AUTRE (le swipeur voit la
      // modale in-app ; best-effort, jamais bloquant).
      void sendPushToUser(c.env, target.id, {
        title: 'C’est un match !',
        body: `${target.display_name ?? 'Quelqu’un'} a liké aussi — ouvrez la conversation.`,
        tag: `match-${res.matchId}`,
        url: `#/chat/${res.conversationId ?? ''}`,
      });
    }
  }

  const body: SwipeResponse = {
    ok: true,
    matched,
    matchId,
    conversationMode,
    matchedName: matched ? (target.display_name ?? 'Quelqu’un') : null,
    quota,
  };
  return c.json(body);
});

// ---------------------------------------------------------------------------
// POST /api/discover/rewind — annule MA dernière action (1/jour, gratuit)
// Si elle avait créé un match : match + conversation retirés (aucun message
// échangé à ce stade — le chat arrive en Étape 6). Rien à annuler ⇒ le quota
// n'est PAS consommé.
// ---------------------------------------------------------------------------
discoverRoutes.post('/discover/rewind', async (c) => {
  const user = await requireUser(c);
  requireNotPaused(user);
  const rlAbuse = await hitRateLimit(c.env.DB, RATE_RULES.discoverActionUser, user.id);
  if (!rlAbuse.allowed) {
    throw rateLimitedError(rlAbuse.retryAfterSeconds, RATE_RULES.discoverActionUser.scope);
  }

  const last = await c.env.DB.prepare(
    `SELECT id, target_id, action, created_at FROM swipes WHERE user_id = ? ORDER BY created_at DESC, id DESC LIMIT 1`,
  )
    .bind(user.id)
    .first<{ id: number; target_id: string; action: string; created_at: number }>();

  if (!last) {
    const body: RewindResponse = {
      ok: true,
      undone: false,
      targetId: null,
      quota: await buildQuota(c.env.DB, user.id),
    };
    return c.json(body);
  }

  await consumeQuota(c.env.DB, RATE_RULES.discoverRewindUser, user.id, 'Rewind');

  // Le swipe qui m'a fait matcher avec cette personne (si match il y a).
  await c.env.DB.prepare(`DELETE FROM swipes WHERE id = ?`).bind(last.id).run();

  if (last.action !== 'pass') {
    const otherId = user.id.localeCompare(last.target_id) < 0 ? last.target_id : user.id;
    const myId = user.id.localeCompare(last.target_id) < 0 ? user.id : last.target_id;
    const match = await c.env.DB.prepare(
      `SELECT id, created_at FROM matches WHERE user_a_id = ? AND user_b_id = ? AND unmatched_at IS NULL`,
    )
      .bind(myId, otherId)
      .first<{ id: string; created_at: number }>();
    // Le match ne doit sa vie qu'à CE like (créé à ou après CE swipe) —
    // sinon (match plus ancien, ex. handshake) on n'y touche pas.
    if (match && match.created_at >= last.created_at) {
      await c.env.DB.prepare(`DELETE FROM conversations WHERE match_id = ?`).bind(match.id).run();
      await c.env.DB.prepare(`DELETE FROM matches WHERE id = ?`).bind(match.id).run();
    }
  }

  const body: RewindResponse = {
    ok: true,
    undone: true,
    targetId: last.target_id,
    quota: await buildQuota(c.env.DB, user.id),
  };
  return c.json(body);
});

// ---------------------------------------------------------------------------
// POST /api/discover/invisible-request — « Discuter » (handshake §4.2/§6.2.4)
// La personne reçoit la demande, accepte ou passe. Si ELLE m'avait déjà
// demandé : double « Discuter » = match immédiat (conversation Invisible).
// ---------------------------------------------------------------------------
discoverRoutes.post('/discover/invisible-request', async (c) => {
  const user = await requireUser(c);
  requireNotPaused(user);
  const payload = await c.req.json<Record<string, unknown>>().catch(() => null);

  const rlAbuse = await hitRateLimit(c.env.DB, RATE_RULES.discoverActionUser, user.id);
  if (!rlAbuse.allowed) {
    throw rateLimitedError(rlAbuse.retryAfterSeconds, RATE_RULES.discoverActionUser.scope);
  }

  const target = await validTarget(c, user.id, payload?.targetId);

  // Déjà en conversation ?
  const otherId = user.id.localeCompare(target.id) < 0 ? target.id : user.id;
  const myId = user.id.localeCompare(target.id) < 0 ? user.id : target.id;
  const matchedRow = await c.env.DB.prepare(
    `SELECT id FROM matches WHERE user_a_id = ? AND user_b_id = ? AND unmatched_at IS NULL`,
  )
    .bind(myId, otherId)
    .first<{ id: string }>();
  if (matchedRow) throw errors.badRequest('Vous êtes déjà en conversation.');

  // Une demande par paire et par sens (index unique) — états précédents.
  const existing = await c.env.DB.prepare(
    `SELECT id, status, from_user FROM invisible_requests
     WHERE (from_user = ? AND to_user = ?) OR (from_user = ? AND to_user = ?)`,
  )
    .bind(user.id, target.id, target.id, user.id)
    .first<{ id: string; status: string; from_user: string }>();

  if (existing) {
    if (existing.from_user === user.id) {
      throw errors.badRequest(
        existing.status === 'pending'
          ? 'Tu as déjà envoyé une demande à cette personne — elle peut accepter ou passer.'
          : 'Une précédente demande a été déclinée — laisse-lui le temps.',
      );
    }
    if (existing.status === 'pending') {
      // Double « Discuter » : match immédiat (les deux ont cliqué).
      const res = await createMatchWithConversation(c, user.id, target.id, 'invisible_request', 'invisible');
      await c.env.DB.prepare(
        `UPDATE invisible_requests SET status = 'accepted', match_id = ?, responded_at = ? WHERE id = ?`,
      )
        .bind(res.matchId, Math.floor(Date.now() / 1000), existing.id)
        .run();
      // Push « nouveau match » au premier demandeur (existing.from_user).
      void sendPushToUser(c.env, existing.from_user, {
        title: 'C’est un match !',
        body: 'Vous avez demandé à discuter mutuellement — la conversation est ouverte.',
        tag: `match-${res.matchId}`,
        url: `#/chat/${res.conversationId}`,
      });
      const body: InvisibleRequestResponse = {
        ok: true,
        status: 'accepted',
        matched: true,
        matchId: res.matchId,
        quota: await buildQuota(c.env.DB, user.id),
      };
      return c.json(body);
    }
    // from_user = target, status accepted → match existant (déjà traité) ;
    // declined par moi → je peux changer d'avis en invitant à mon tour.
  }

  await consumeQuota(c.env.DB, RATE_RULES.discoverInvisibleUser, user.id, 'demandes « Discuter »');

  await c.env.DB.prepare(
    `INSERT INTO invisible_requests (id, from_user, to_user, status, created_at) VALUES (?, ?, ?, 'pending', ?)`,
  )
    .bind(crypto.randomUUID(), user.id, target.id, Math.floor(Date.now() / 1000))
    .run();

  const body: InvisibleRequestResponse = {
    ok: true,
    status: 'pending',
    matched: false,
    matchId: null,
    quota: await buildQuota(c.env.DB, user.id),
  };
  return c.json(body);
});

// ---------------------------------------------------------------------------
// POST /api/discover/invisible-request/:id/respond — accepter ou passer
// ---------------------------------------------------------------------------
discoverRoutes.post('/discover/invisible-request/:id/respond', async (c) => {
  const user = await requireUser(c);
  const requestId = c.req.param('id');
  const payload = await c.req.json<{ accept?: unknown }>().catch(() => null);
  if (typeof payload?.accept !== 'boolean') throw errors.badRequest('Réponse attendue (accept).');

  const rl = await hitRateLimit(c.env.DB, RATE_RULES.discoverRespondUser, user.id);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.discoverRespondUser.scope);

  const req = await c.env.DB.prepare(
    `SELECT id, from_user, to_user, status FROM invisible_requests WHERE id = ?`,
  )
    .bind(requestId)
    .first<{ id: string; from_user: string; to_user: string; status: string }>();
  if (!req || req.to_user !== user.id) throw errors.notFound('Demande introuvable.');
  if (req.status !== 'pending') throw errors.badRequest('Cette demande a déjà été traitée.');

  if (!payload.accept) {
    await c.env.DB.prepare(
      `UPDATE invisible_requests SET status = 'declined', responded_at = ? WHERE id = ?`,
    )
      .bind(Math.floor(Date.now() / 1000), req.id)
      .run();
    const body: InvisibleRespondResponse = {
      ok: true,
      status: 'declined',
      matched: false,
      matchId: null,
    };
    return c.json(body);
  }

  // Acceptation → match + conversation INVISIBLE (photos floutées jusqu'à la
  // révélation consentie — Étape 6).
  const res = await createMatchWithConversation(c, user.id, req.from_user, 'invisible_request', 'invisible');
  await c.env.DB.prepare(
    `UPDATE invisible_requests SET status = 'accepted', match_id = ?, responded_at = ? WHERE id = ?`,
  )
    .bind(res.matchId, Math.floor(Date.now() / 1000), req.id)
    .run();

  // Push « nouveau match » au DEMANDEUR (l'accepteur voit la réponse in-app).
  void sendPushToUser(c.env, req.from_user, {
    title: 'C’est un match !',
    body: 'Ta demande « Discuter » a été acceptée — la conversation est ouverte.',
    tag: `match-${res.matchId}`,
    url: `#/chat/${res.conversationId}`,
  });

  const body: InvisibleRespondResponse = {
    ok: true,
    status: 'accepted',
    matched: true,
    matchId: res.matchId,
  };
  return c.json(body);
});

// ---------------------------------------------------------------------------
// GET /api/discover/inbox — demandes « Discuter » reçues + envoyées
// ---------------------------------------------------------------------------
discoverRoutes.get('/discover/inbox', async (c) => {
  const user = await requireUser(c);
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.discoverRespondUser, user.id);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.discoverRespondUser.scope);

  const { results: rows } = await c.env.DB.prepare(
    `SELECT ir.id, ir.from_user, ir.to_user, ir.status, ir.created_at,
            u.display_name, up.mode_default AS owner_mode, pp.type AS personality_type,
            pp.validated AS personality_validated
     FROM invisible_requests ir
     JOIN users u ON u.id = CASE WHEN ir.from_user = ?1 THEN ir.to_user ELSE ir.from_user END
     LEFT JOIN user_preferences up ON up.user_id = u.id
     LEFT JOIN personality_profiles pp ON pp.user_id = u.id
     WHERE (ir.to_user = ?1 AND ir.status = 'pending')
        OR (ir.from_user = ?1 AND ir.status IN ('pending','accepted','declined'))
     ORDER BY ir.created_at DESC
     LIMIT 40`,
  )
    .bind(user.id)
    .all<{
      id: string;
      from_user: string;
      to_user: string;
      status: string;
      created_at: number;
      display_name: string | null;
      owner_mode: string | null;
      personality_type: string | null;
      personality_validated: number | null;
    }>();

  const received: InvisibleRequestDto[] = [];
  const sent: InvisibleRequestDto[] = [];
  // Performance (Task 28) : photos calculées en PARALLÈLE (boucle séquentielle
  // N×D1 supprimée — même correctif que /discover/matches).
  await Promise.all(
    (rows ?? []).map(async (r) => {
      const mine = r.from_user === user.id;
      const base = {
        id: r.id,
        fromUser: r.from_user,
        fromName: '',
        toUser: r.to_user,
        toName: r.display_name ?? 'Quelqu’un',
        status: r.status as InvisibleRequestDto['status'],
        createdAt: r.created_at,
        photoUrl: null as string | null,
        photoBlurred: r.owner_mode === 'invisible',
        personalityType: (r.personality_type as InvisibleRequestDto['personalityType']) ?? null,
        personalityValidated: r.personality_validated === 1,
      };
      if (mine) {
        // Ma demande : je vois le profil de la personne sollicitée.
        const photo = await bestPhoto(c, r.to_user, base.photoBlurred);
        base.toName = r.display_name ?? 'Quelqu’un';
        base.photoUrl = photo.url;
        base.photoBlurred = photo.blurred;
        sent.push(base);
      } else {
        // Demande reçue : le demandeur se présente.
        base.fromName = r.display_name ?? 'Quelqu’un';
        const photo = await bestPhoto(c, r.from_user, base.photoBlurred);
        base.photoUrl = photo.url;
        base.photoBlurred = photo.blurred;
        received.push(base);
      }
    }),
  );

  const body: InboxResponse = {
    received,
    sent,
    quota: await buildQuota(c.env.DB, user.id),
  };
  return c.json(body);
});

// ---------------------------------------------------------------------------
// GET /api/discover/matches — matchs + conversations (le chat = Étape 6)
// ---------------------------------------------------------------------------
discoverRoutes.get('/discover/matches', async (c) => {
  const user = await requireUser(c);
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.discoverRespondUser, user.id);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.discoverRespondUser.scope);

  const { results: rows } = await c.env.DB.prepare(
    `SELECT m.id AS match_id, m.origin, m.created_at,
            c.id AS conv_id, c.mode AS conv_mode,
            other.id AS other_id, other.display_name, other.city, other.country,
            other.verified_at AS other_verified,
            pp.type AS personality_type, pp.validated AS personality_validated,
            mr.id AS mr_id, mr.from_user AS mr_from, mr.created_at AS mr_created
     FROM matches m
     JOIN conversations c ON c.match_id = m.id
     JOIN users other
       ON other.id = CASE WHEN m.user_a_id = ?1 THEN m.user_b_id ELSE m.user_a_id END
     LEFT JOIN personality_profiles pp ON pp.user_id = other.id
     LEFT JOIN mode_requests mr ON mr.conversation_id = c.id AND mr.status = 'pending'
     WHERE (m.user_a_id = ?1 OR m.user_b_id = ?1) AND m.unmatched_at IS NULL
     ORDER BY m.created_at DESC
     LIMIT 50`,
  )
    .bind(user.id)
    .all<{
      match_id: string;
      origin: string;
      created_at: number;
      conv_id: string;
      conv_mode: string;
      other_id: string;
      display_name: string | null;
      city: string | null;
      country: string | null;
      other_verified: number | null;
      personality_type: string | null;
      personality_validated: number | null;
      mr_id: string | null;
      mr_from: string | null;
      mr_created: number | null;
    }>();

  const matchRows = rows ?? [];

  // Performance (Task 28) : UNE seule requête pour les photos de TOUS les
  // matchs (au lieu d'une requête D1 par match dans une boucle séquentielle),
  // puis signatures en parallèle.
  const photoMap = new Map<string, PhotoMeta>();
  if (matchRows.length > 0) {
    const mPlaceholders = matchRows.map(() => '?').join(',');
    const { results: photoRows } = await c.env.DB.prepare(
      `SELECT user_id, id, cloudinary_version FROM photos
       WHERE status = 'active' AND deleted_at IS NULL AND user_id IN (${mPlaceholders})
       ORDER BY position ASC, created_at ASC`,
    )
      .bind(...matchRows.map((r) => r.other_id))
      .all<PhotoMeta>();
    for (const p of photoRows ?? []) if (!photoMap.has(p.user_id)) photoMap.set(p.user_id, p);
  }

  const matches: MatchDto[] = await Promise.all(
    matchRows.map(async (r) => {
      const convMode = r.conv_mode === 'invisible' ? 'invisible' : 'classic';
      // Flou de conversation (§4.8) : piloté par le MODE DE LA CONVERSATION,
      // pas par le mode de découverte des membres.
      const blurred = convMode === 'invisible';
      const photoMeta = photoMap.get(r.other_id);
      let photo: { url: string | null; blurred: boolean } = { url: null, blurred };
      if (photoMeta) {
        const publicId = `${c.env.CLOUDINARY_ROOT_FOLDER}/photos/${r.other_id}/${photoMeta.id}`;
        photo = {
          url: await signedMediaUrl(
            c.env.CLOUDINARY_CLOUD_NAME,
            c.env.CLOUDINARY_API_SECRET,
            publicId,
            {
              version: photoMeta.cloudinary_version,
              transformation: `c_limit,w_${blurred ? PHOTO_BLUR_WIDTH : PHOTO_THUMB_WIDTH}`,
            },
          ),
          blurred,
        };
      }
      return {
        matchId: r.match_id,
        conversationId: r.conv_id,
        conversationMode: convMode,
        origin: (r.origin as MatchDto['origin']) ?? 'like',
        createdAt: r.created_at,
        other: {
          userId: r.other_id,
          displayName: r.display_name ?? 'Quelqu’un',
          city: r.city,
          country: r.country,
          photoUrl: photo.url,
          photoBlurred: photo.blurred,
          personalityType: (r.personality_type as MatchDto['other']['personalityType']) ?? null,
          personalityValidated: r.personality_validated === 1,
          verified: r.other_verified != null,
        },
        pendingGateway:
          r.mr_id != null
            ? { id: r.mr_id, fromMe: r.mr_from === user.id, createdAt: r.mr_created ?? 0 }
            : null,
      } satisfies MatchDto;
    }),
  );

  const body: MatchListResponse = {
    matches,
    note: 'Changer de mode ne détruit jamais un match ni une conversation — le mode régit seulement tes futures découvertes (§4.8).',
  };
  return c.json(body);
});

// ---------------------------------------------------------------------------
// POST /api/discover/matches/:id/gateway — proposer « Passer en Invisible »
// (consentement de l'autre requis — §4.4 ; refus ⇒ rien ne change, §4.6)
// ---------------------------------------------------------------------------
discoverRoutes.post('/discover/matches/:id/gateway', async (c) => {
  const user = await requireUser(c);
  const matchId = c.req.param('id');

  const rl = await hitRateLimit(c.env.DB, RATE_RULES.discoverGatewayUser, user.id);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.discoverGatewayUser.scope);

  const row = await c.env.DB.prepare(
    `SELECT m.id, m.user_a_id, m.user_b_id, c.id AS conv_id, c.mode AS conv_mode
     FROM matches m JOIN conversations c ON c.match_id = m.id
     WHERE m.id = ? AND m.unmatched_at IS NULL
       AND (m.user_a_id = ? OR m.user_b_id = ?)`,
  )
    .bind(matchId, user.id, user.id)
    .first<{ id: string; user_a_id: string; user_b_id: string; conv_id: string; conv_mode: string }>();
  if (!row) throw errors.notFound('Match introuvable.');
  if (row.conv_mode === 'invisible') throw errors.badRequest('Cette conversation est déjà en Mode Invisible.');

  const pending = await c.env.DB.prepare(
    `SELECT id, from_user FROM mode_requests WHERE conversation_id = ? AND status = 'pending'`,
  )
    .bind(row.conv_id)
    .first<{ id: string; from_user: string }>();
  if (pending) {
    const body: GatewayResponse = {
      ok: true,
      status: 'pending',
      conversationMode: 'classic',
    };
    return c.json(body);
  }

  const other = row.user_a_id === user.id ? row.user_b_id : row.user_a_id;
  await c.env.DB.prepare(
    `INSERT INTO mode_requests (id, conversation_id, from_user, to_user, status, created_at)
     VALUES (?, ?, ?, ?, 'pending', ?)`,
  )
    .bind(crypto.randomUUID(), row.conv_id, user.id, other, Math.floor(Date.now() / 1000))
    .run();

  const body: GatewayResponse = { ok: true, status: 'pending', conversationMode: 'classic' };
  return c.json(body);
});

// ---------------------------------------------------------------------------
// POST /api/discover/matches/:id/gateway/respond — accepter / refuser
// Accepté ⇒ conversations.mode = 'invisible' (photos re-floutées pour les
// deux, historique conservé) ; refusé ⇒ la conversation reste en Classique.
// ---------------------------------------------------------------------------
discoverRoutes.post('/discover/matches/:id/gateway/respond', async (c) => {
  const user = await requireUser(c);
  const matchId = c.req.param('id');
  const payload = await c.req.json<{ accept?: unknown }>().catch(() => null);
  if (typeof payload?.accept !== 'boolean') throw errors.badRequest('Réponse attendue (accept).');

  const rl = await hitRateLimit(c.env.DB, RATE_RULES.discoverGatewayUser, user.id);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.discoverGatewayUser.scope);

  const row = await c.env.DB.prepare(
    `SELECT m.id AS match_id, c.id AS conv_id, c.mode AS conv_mode
     FROM matches m JOIN conversations c ON c.match_id = m.id
     WHERE m.id = ? AND m.unmatched_at IS NULL AND (m.user_a_id = ? OR m.user_b_id = ?)`,
  )
    .bind(matchId, user.id, user.id)
    .first<{ match_id: string; conv_id: string; conv_mode: string }>();
  if (!row) throw errors.notFound('Match introuvable.');

  const pending = await c.env.DB.prepare(
    `SELECT id FROM mode_requests WHERE conversation_id = ? AND to_user = ? AND status = 'pending'`,
  )
    .bind(row.conv_id, user.id)
    .first<{ id: string }>();
  if (!pending) throw errors.notFound('Aucune demande de passerelle à traiter.');

  const now = Math.floor(Date.now() / 1000);
  if (payload.accept) {
    await c.env.DB.prepare(
      `UPDATE conversations SET mode = 'invisible', mode_changed_at = ? WHERE id = ?`,
    )
      .bind(now, row.conv_id)
      .run();
    await c.env.DB.prepare(
      `UPDATE mode_requests SET status = 'accepted', responded_at = ? WHERE id = ?`,
    )
      .bind(now, pending.id)
      .run();
    const body: GatewayResponse = { ok: true, status: 'accepted', conversationMode: 'invisible' };
    return c.json(body);
  }

  await c.env.DB.prepare(
    `UPDATE mode_requests SET status = 'declined', responded_at = ? WHERE id = ?`,
  )
    .bind(now, pending.id)
    .run();
  // §4.6 : passerelle refusée ⇒ la conversation continue en Classique.
  const body: GatewayResponse = { ok: true, status: 'declined', conversationMode: 'classic' };
  return c.json(body);
});

// ---------------------------------------------------------------------------
// GET /api/discover/top — Top Compatibilité du jour (cron ; hors quota feed)
// Fallback : si le cron n'a pas encore calculé, calcul à la demande
// (même fonction, même résultat) puis matérialisation en D1.
// ---------------------------------------------------------------------------
discoverRoutes.get('/discover/top', async (c) => {
  const user = await requireUser(c);
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.discoverTopUser, user.id);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.discoverTopUser.scope);

  const day = new Date().toISOString().slice(0, 10);
  const stored = await c.env.DB.prepare(
    `SELECT rank, target_id, score FROM top_matches WHERE day = ? AND user_id = ? ORDER BY rank ASC`,
  )
    .bind(day, user.id)
    .all<{ rank: number; target_id: string; score: number }>();

  let ids = (stored.results ?? []).map((r) => r.target_id);

  if (ids.length === 0) {
    // Fallback à la demande (beta / premier visiteur du jour).
    const { body } = await generateFeedPage(c.env, user.id, 1);
    const top = body.items.filter((i) => i.score !== null).slice(0, DISCOVERY.topPerDay);
    if (top.length > 0) {
      await c.env.DB.batch(
        top.map((it, idx) =>
          c.env.DB.prepare(
            `INSERT INTO top_matches (day, user_id, rank, target_id, score) VALUES (?, ?, ?, ?, ?)
             ON CONFLICT (day, user_id, rank) DO UPDATE SET target_id = excluded.target_id, score = excluded.score`,
          ).bind(day, user.id, idx + 1, it.userId, it.score),
        ),
      );
    }
    ids = top.map((t) => t.userId);
  }

  if (ids.length === 0) {
    const body: TopResponse = {
      day,
      items: [],
      note: 'Les suggestions du jour arrivent avec davantage de membres actifs autour de toi.',
    };
    return c.json(body);
  }

  // Re-rendu par la MÊME fonction (onlyIds) : mêmes filtres, même score
  // (tolérance ±2 stable par paire/jour), photos signées, extraits.
  const { body: rendered } = await generateFeedPage(c.env, user.id, 1, { onlyIds: ids });
  const body: TopResponse = {
    day,
    items: rendered.items,
    note: 'Suggestions du jour, calculées chaque nuit à partir de ton questionnaire — hors de tes quotas.',
  };
  return c.json(body);
});

// ---------------------------------------------------------------------------
// GET /api/discover/likes — « Tu plais ! » (likes reçus en attente de MA
// réponse). Fonctionnalité dating classique rendue GRATUITE (100 % gratuit,
// spec §6) : les personnes qui m'ont liké/super-liké et que je n'ai pas encore
// traitées. Liker en retour = match immédiat (réciprocité déjà en D1).
// Privacy : mêmes règles que le feed — le flou suit le mode du PROPRIÉTAIRE
// (§4.6), incognito inclus (exception « likes reçus » déjà en place), blocages
// et comptes traités exclus.
// ---------------------------------------------------------------------------
discoverRoutes.get('/discover/likes', async (c) => {
  const user = await requireUser(c);
  requireNotPaused(user);
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.discoverLikesMeUser, user.id);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.discoverLikesMeUser.scope);

  const now = Math.floor(Date.now() / 1000);
  const LIMIT = 12;

  // Les likes en attente : cible = moi, action like/super, et je n'ai PAS
  // encore swipé la personne (sinon la réciprocité a déjà été tranchée —
  // match ou passe définitive). Blocages des deux sens exclus.
  const where = `
    FROM swipes sw
    JOIN users u ON u.id = sw.user_id
      AND u.status = 'active' AND COALESCE(u.paused, 0) = 0
    LEFT JOIN user_preferences up ON up.user_id = u.id
    LEFT JOIN personality_profiles pp ON pp.user_id = u.id
    WHERE sw.target_id = ?1 AND sw.action IN ('like','super')
      AND NOT EXISTS (
        SELECT 1 FROM swipes s2 WHERE s2.user_id = ?1 AND s2.target_id = sw.user_id
      )
      AND NOT EXISTS (
        SELECT 1 FROM blocks b
        WHERE (b.user_id = ?1 AND b.blocked_id = sw.user_id)
           OR (b.user_id = sw.user_id AND b.blocked_id = ?1)
      )`;

  interface LikesRow {
    user_id: string;
    display_name: string | null;
    birth_date: string | null;
    birth_year: number | null;
    city: string | null;
    country: string | null;
    action: string;
    created_at: number;
    owner_mode: string | null;
    personality_type: string | null;
    personality_validated: number | null;
  }

  const [rowsRes, countRes] = await Promise.all([
    c.env.DB.prepare(`SELECT sw.user_id, u.display_name, u.birth_date, u.birth_year,
                             u.city, u.country, sw.action, sw.created_at,
                             up.mode_default AS owner_mode,
                             pp.type AS personality_type, pp.validated AS personality_validated
                      ${where} ORDER BY sw.created_at DESC LIMIT ${LIMIT}`)
      .bind(user.id)
      .all<LikesRow>(),
    c.env.DB.prepare(`SELECT COUNT(*) AS n ${where}`).bind(user.id).first<{ n: number }>(),
  ]);

  const rows = rowsRes.results ?? [];
  let items: LikesMeDto[] = [];

  if (rows.length > 0) {
    // Photos principales de TOUS les likers en 1 requête (fix N+1 — Task 28).
    const ids = rows.map((r) => r.user_id);
    const photoRes = await c.env.DB.prepare(
      `SELECT id, user_id, cloudinary_version FROM photos
       WHERE status = 'active' AND deleted_at IS NULL AND user_id IN (${ids.map(() => '?').join(',')})
       ORDER BY position ASC, created_at ASC`,
    )
      .bind(...ids)
      .all<{ id: string; user_id: string; cloudinary_version: number }>();
    const bestPhoto = new Map<string, { id: string; version: number }>();
    for (const p of photoRes.results ?? []) {
      if (!bestPhoto.has(p.user_id)) {
        bestPhoto.set(p.user_id, { id: p.id, version: p.cloudinary_version });
      }
    }

    items = await Promise.all(
      rows.map(async (r) => {
        const blurred = r.owner_mode === 'invisible';
        let photoUrl: string | null = null;
        const photo = bestPhoto.get(r.user_id);
        if (photo) {
          photoUrl = await signedMediaUrl(
            c.env.CLOUDINARY_CLOUD_NAME,
            c.env.CLOUDINARY_API_SECRET,
            `${c.env.CLOUDINARY_ROOT_FOLDER}/photos/${r.user_id}/${photo.id}`,
            {
              version: photo.version,
              transformation: `c_limit,w_${blurred ? PHOTO_BLUR_WIDTH : PHOTO_THUMB_WIDTH}`,
            },
          );
        }
        const age = r.birth_date
          ? Math.max(18, Math.floor((now - Date.parse(`${r.birth_date}T00:00:00Z`) / 1000) / (365.2425 * 86400)))
          : r.birth_year
            ? Math.max(18, new Date().getUTCFullYear() - r.birth_year)
            : 18;
        return {
          userId: r.user_id,
          displayName: r.display_name ?? 'Quelqu’un',
          age,
          city: r.city,
          country: r.country,
          photoUrl,
          photoBlurred: blurred,
          personalityType: (r.personality_type as LikesMeDto['personalityType']) ?? null,
          personalityValidated: r.personality_validated === 1,
          action: (r.action === 'super' ? 'super' : 'like') as 'like' | 'super',
          likedAt: r.created_at,
        };
      }),
    );
  }

  const body: LikesMeResponse = {
    count: countRes?.n ?? items.length,
    items,
    note: 'Liker en retour = match immédiat. Elles ne savent pas que tu vois cette liste tant que tu ne réponds pas.',
  };
  return c.json(body);
});

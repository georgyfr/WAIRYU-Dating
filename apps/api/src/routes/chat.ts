/**
 * Chat temps réel & révélation (Étape 6).
 *
 * Le TEMPS RÉEL vit dans le Durable Object ChatRoom (WebSocket hibernation) —
 * ce fichier : l'autorisation (session ou ticket HMAC), l'appartenance au
 * match, le pont Worker ↔ DO, l'historique paginé, l'envoi de fallback HTTP,
 * les voice notes (upload Cloudinary signé côté Worker), le FLUX DE RÉVÉLATION
 * (§4.5 : ≥ 15 messages ET ≥ 7 jours, consentement explicite des deux,
 * double confirmation côté front, révocable avant acceptation) et l'UNMATCH
 * propre (plan 6.7 : sortie des deux côtés, photos re-floutées, blocage 1 clic).
 *
 * Confidentialité : les photos sont servies floues tant que
 * (mode conversation = invisible) ET (révélation non accordée) — après unmatch,
 * TOUTE route de chat refuse (410/404) : re-floutage automatique, aucune URL
 * signée de chat ne reste exploitable.
 */
import { Hono } from 'hono';
import type { Context } from 'hono';
import type { AppEnv } from '../env';
import { errors } from '../lib/errors';
import { RATE_RULES, hitRateLimit, rateLimitedError } from '../lib/ratelimit';
import { signedMediaUrl, uploadAuthenticatedAudio } from '../lib/cloudinary';
import { CHAT, REVEAL_FEEDBACKS } from '@wairyu/shared';
import type {
  ChatHistoryResponse,
  ChatStateResponse,
  ConversationDto,
  ConversationLastMessage,
  ConversationListResponse,
  RevealFeedbackResponse,
  RevealResponse,
  UnmatchResponse,
  WsTicketResponse,
} from '@wairyu/shared';

export const chatRoutes = new Hono<AppEnv>();

// ---------------------------------------------------------------------------
// Autorisation & contexte
// ---------------------------------------------------------------------------

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

interface ChatCtx {
  conversationId: string;
  matchId: string;
  mode: 'classic' | 'invisible';
  createdAt: number;
  revealedAt: number | null;
  me: string;
  other: string;
  otherName: string;
  /** Badge « Identité vérifiée » de l'autre (Étape 7). */
  otherVerified: boolean;
}

/** Vérifie session + appartenance au match ACTIF porté par la conversation. */
async function chatContext(c: Context<AppEnv>, conversationId: string): Promise<ChatCtx> {
  const user = await requireUser(c);
  if (!/^[0-9a-f-]{16,64}$/i.test(conversationId)) throw errors.badRequest('Conversation invalide.');

  const row = await c.env.DB.prepare(
    `SELECT c.id, c.mode, c.revealed_at, c.created_at,
            m.id AS match_id, m.user_a_id, m.user_b_id
     FROM conversations c
     JOIN matches m ON m.id = c.match_id
     WHERE c.id = ? AND m.unmatched_at IS NULL`,
  )
    .bind(conversationId)
    .first<{
      id: string;
      mode: string;
      revealed_at: number | null;
      created_at: number;
      match_id: string;
      user_a_id: string;
      user_b_id: string;
    }>();
  // Post-unmatch : la conversation disparaît du point de vue utilisateur
  // (le re-floutage est implicite — plus aucune route ne sert ses URLs).
  if (!row) throw errors.notFound('Conversation introuvable ou fermée.');

  const me = user.id;
  const other = row.user_a_id === me ? row.user_b_id : row.user_a_id;
  if (me !== row.user_a_id && me !== row.user_b_id) throw errors.forbidden();

  const otherRow = await c.env.DB.prepare(
    `SELECT display_name, status, verified_at FROM users WHERE id = ?`,
  )
    .bind(other)
    .first<{ display_name: string | null; status: string; verified_at: number | null }>();
  if (!otherRow || otherRow.status === 'deleted' || otherRow.status === 'banned') {
    throw errors.notFound('Ce profil n’est plus disponible.');
  }

  return {
    conversationId: row.id,
    matchId: row.match_id,
    mode: row.mode === 'invisible' ? 'invisible' : 'classic',
    createdAt: row.created_at,
    revealedAt: row.revealed_at,
    me,
    other,
    otherName: otherRow.display_name ?? 'Quelqu’un',
    otherVerified: otherRow.verified_at != null,
  };
}

/** Stub DO + init (méta cid/members/mode) ; reset:true rouvre après un re-match. */
function chatDo(c: Context<AppEnv>, ctx: ChatCtx) {
  const stub = c.env.CHAT_ROOM.get(c.env.CHAT_ROOM.idFromName(ctx.conversationId));
  void stub.fetch(
    new Request('https://do/init', {
      method: 'POST',
      body: JSON.stringify({
        conversationId: ctx.conversationId,
        members: [ctx.me, ctx.other],
        mode: ctx.mode,
        createdAt: ctx.createdAt,
        reset: true,
      }),
      headers: { 'content-type': 'application/json' },
    }),
  ).catch(() => undefined); // best-effort — le DO se (re)construit à l'usage
  return stub;
}

/** Photo « la meilleure » de l'autre, floutée selon mode conversation + révélation. */
async function otherPhoto(
  c: Context<AppEnv>,
  userId: string,
  blurred: boolean,
): Promise<{ url: string | null; blurred: boolean }> {
  const photo = await c.env.DB.prepare(
    `SELECT id, cloudinary_version FROM photos
     WHERE user_id = ? AND status = 'active' AND deleted_at IS NULL
     ORDER BY position ASC, created_at ASC LIMIT 1`,
  )
    .bind(userId)
    .first<{ id: string; cloudinary_version: number }>();
  if (!photo) return { url: null, blurred };
  const publicId = `${c.env.CLOUDINARY_ROOT_FOLDER}/photos/${userId}/${photo.id}`;
  const url = await signedMediaUrl(c.env.CLOUDINARY_CLOUD_NAME, c.env.CLOUDINARY_API_SECRET, publicId, {
    version: photo.cloudinary_version,
    transformation: `c_limit,w_${blurred ? 400 : 200}`,
  });
  return { url, blurred };
}

interface DoStats {
  ok: boolean;
  count: number;
  lastSeq: number;
  closed: boolean;
}

async function doStats(c: Context<AppEnv>, ctx: ChatCtx): Promise<DoStats> {
  const res = await chatDo(c, ctx).fetch(new Request('https://do/stats'));
  if (!res.ok) throw errors.internal('État du chat indisponible.');
  return (await res.json()) as DoStats;
}

// ---------------------------------------------------------------------------
// GET /api/chat/conversations — boîte de réception (page Messages + badge
// de l'onglet « Messages »). Une entrée par match actif : dernier message
// en aperçu (DO /summary), non-lus, photo floutée selon le MODE DE LA
// CONVERSATION (§4.8) — jamais selon le mode de découverte des membres.
// ---------------------------------------------------------------------------

interface DoSummary {
  ok: boolean;
  count: number;
  unread: number;
  closed: boolean;
  last: { seq: number; senderId: string; kind: string; excerpt: string; createdAt: number } | null;
}

chatRoutes.get('/chat/conversations', async (c) => {
  const user = await requireUser(c);
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.chatListUser, user.id);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.chatListUser.scope);

  const rowsResult = await c.env.DB.prepare(
    `SELECT c.id AS conv_id, c.mode AS conv_mode, c.created_at, c.revealed_at,
            m.id AS match_id,
            other.id AS other_id, other.display_name,
            other.verified_at AS other_verified,
            pp.type AS personality_type
     FROM conversations c
     JOIN matches m ON m.id = c.match_id
     JOIN users other
       ON other.id = CASE WHEN m.user_a_id = ?1 THEN m.user_b_id ELSE m.user_a_id END
     LEFT JOIN personality_profiles pp ON pp.user_id = other.id
     WHERE (m.user_a_id = ?1 OR m.user_b_id = ?1) AND m.unmatched_at IS NULL
       AND other.status != 'deleted' AND other.status != 'banned'
     ORDER BY m.created_at DESC
     LIMIT 50`,
  )
    .bind(user.id)
    .all<{
      conv_id: string;
      conv_mode: string;
      created_at: number;
      revealed_at: number | null;
      match_id: string;
      other_id: string;
      display_name: string | null;
      other_verified: number | null;
      personality_type: string | null;
    }>();

  const rows = rowsResult.results ?? [];

  // Performance (Task 28) : UNE seule requête pour les photos de TOUS les
  // correspondants (au lieu d'une requête par conversation), puis résumés DO
  // en PARALLÈLE (Promise.all) — la boucle séquentielle N×(DO+D1) était le
  // principal goulot de la boîte de réception et du badge d'onglet.
  const placeholders = rows.map(() => '?').join(',');
  const photoMap = new Map<string, { id: string; cloudinary_version: number }>();
  if (rows.length > 0) {
    const { results: photoRows } = await c.env.DB.prepare(
      `SELECT user_id, id, cloudinary_version FROM photos
       WHERE status = 'active' AND deleted_at IS NULL AND user_id IN (${placeholders})
       ORDER BY position ASC, created_at ASC`,
    )
      .bind(...rows.map((r) => r.other_id))
      .all<{ user_id: string; id: string; cloudinary_version: number }>();
    for (const p of photoRows ?? []) if (!photoMap.has(p.user_id)) photoMap.set(p.user_id, p);
  }

  const conversations: ConversationDto[] = await Promise.all(
    rows.map(async (r) => {
      const convMode = r.conv_mode === 'invisible' ? 'invisible' : 'classic';
      const blurred = convMode === 'invisible' && r.revealed_at == null;

      // Résumé DO : dernier message + non-lus (le DO se (re)construit à
      // l'usage — même contrat que le chat ; échec = entrée sans aperçu).
      let s: DoSummary | null = null;
      try {
        const stub = c.env.CHAT_ROOM.get(c.env.CHAT_ROOM.idFromName(r.conv_id));
        void stub
          .fetch(
            new Request('https://do/init', {
              method: 'POST',
              body: JSON.stringify({
                conversationId: r.conv_id,
                members: [user.id, r.other_id],
                mode: convMode,
                createdAt: r.created_at,
                reset: true,
              }),
              headers: { 'content-type': 'application/json' },
            }),
          )
          .catch(() => undefined);
        const res = await stub.fetch(
          new Request(`https://do/summary?userId=${encodeURIComponent(user.id)}`),
        );
        if (res.ok) s = (await res.json()) as DoSummary;
      } catch {
        s = null; // jamais une conversation indisponible ne casse la liste
      }

      const photoRow = photoMap.get(r.other_id);
      let photo: { url: string | null; blurred: boolean } = { url: null, blurred };
      if (photoRow) {
        const publicId = `${c.env.CLOUDINARY_ROOT_FOLDER}/photos/${r.other_id}/${photoRow.id}`;
        photo = {
          url: await signedMediaUrl(
            c.env.CLOUDINARY_CLOUD_NAME,
            c.env.CLOUDINARY_API_SECRET,
            publicId,
            { version: photoRow.cloudinary_version, transformation: `c_limit,w_${blurred ? 400 : 200}` },
          ),
          blurred,
        };
      }
      const lastActivityAt = s?.last?.createdAt ?? r.created_at;

      const lastMessage: ConversationLastMessage | null = s?.last
        ? {
            seq: s.last.seq,
            fromMe: s.last.senderId === user.id,
            kind: s.last.kind === 'voice' ? 'voice' : s.last.kind === 'system' ? 'system' : 'text',
            excerpt: s.last.excerpt,
            createdAt: s.last.createdAt,
          }
        : null;

      return {
        conversationId: r.conv_id,
        matchId: r.match_id,
        conversationMode: convMode,
        createdAt: r.created_at,
        lastActivityAt,
        unread: Math.max(0, s?.unread ?? 0),
        other: {
          userId: r.other_id,
          displayName: r.display_name ?? 'Quelqu’un',
          photoUrl: photo.url,
          photoBlurred: photo.blurred,
          verified: r.other_verified != null,
          personalityType: r.personality_type,
        },
        lastMessage,
      } satisfies ConversationDto;
    }),
  );

  // Activité récente d'abord — la boîte de réception se lit de haut en bas.
  conversations.sort((a, b) => b.lastActivityAt - a.lastActivityAt);

  const body: ConversationListResponse = {
    conversations,
    note: 'Les conversations naissent d’un match — continue la découverte pour agrandir ta boîte de réception.',
  };
  return c.json(body);
});

// ---------------------------------------------------------------------------
// WS — ticket sans cookie (client mobile, tests) + upgrade
// ---------------------------------------------------------------------------

async function hmacSign(input: string, key: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(input));
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function strToB64url(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]!);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlToStr(s: string): string {
  const pad = '='.repeat((4 - (s.length % 4)) % 4);
  const bin = atob((s + pad).replace(/-/g, '+').replace(/_/g, '/'));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

/** GET /api/chat/:id/ws-ticket — ticket HMAC (userId, conv, exp) TTL 2 min. */
chatRoutes.get('/chat/:id/ws-ticket', async (c) => {
  const ctx = await chatContext(c, c.req.param('id'));
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.chatTicketUser, ctx.me);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.chatTicketUser.scope);

  const exp = Math.floor(Date.now() / 1000) + CHAT.wsTicketTtlSeconds;
  const payload = `${ctx.me}.${ctx.conversationId}.${exp}`;
  const sig = await hmacSign(payload, c.env.SESSION_HMAC_KEY);
  const ticket = `${strToB64url(payload)}.${sig}`;

  const origin = new URL(c.req.url).origin.replace(/^http/, 'ws');
  const body: WsTicketResponse = {
    ticket,
    url: `${origin}/api/chat/${ctx.conversationId}/ws?ticket=${ticket}`,
    expiresInSeconds: CHAT.wsTicketTtlSeconds,
  };
  return c.json(body);
});

/** Vérifie un ticket HMAC → userId ou null. */
async function verifyTicket(c: Context<AppEnv>, conversationId: string, ticket: string): Promise<string | null> {
  const dot = ticket.lastIndexOf('.');
  if (dot <= 0) return null;
  const b64payload = ticket.slice(0, dot);
  const sig = ticket.slice(dot + 1);
  try {
    const payload = b64urlToStr(b64payload);
    const expected = await hmacSign(payload, c.env.SESSION_HMAC_KEY);
    if (sig !== expected) return null;
    const [userId, conv, expRaw] = payload.split('.');
    if (conv !== conversationId || !userId) return null;
    if (Number(expRaw) < Math.floor(Date.now() / 1000)) return null;
    return userId;
  } catch {
    return null;
  }
}

/**
 * GET /api/chat/:id/ws?ticket=… — upgrade WebSocket.
 * Auth : ticket HMAC (sans cookie) OU session (navigateur same-origin).
 * Le Worker valide l'appartenance puis TRANSFERT la requête Upgrade au DO.
 */
chatRoutes.get('/chat/:id/ws', async (c) => {
  const conversationId = c.req.param('id');
  const ticket = new URL(c.req.url).searchParams.get('ticket') ?? '';

  let userId: string | null = null;
  if (ticket) {
    userId = await verifyTicket(c, conversationId, ticket);
    if (!userId) throw errors.unauthorized('Ticket WebSocket invalide ou expiré.');
    // Le titulaire du ticket doit toujours être membre actif du match —
    // et on profite de la lecture D1 pour seed la méta du DO (mode, dates).
    const row = await c.env.DB.prepare(
      `SELECT c.id, c.mode, c.created_at,
              m.id AS match_id,
              CASE WHEN m.user_a_id = ?2 THEN m.user_b_id ELSE m.user_a_id END AS other
       FROM conversations c
       JOIN matches m ON m.id = c.match_id
       WHERE c.id = ?1 AND m.unmatched_at IS NULL
         AND (?2 IN (m.user_a_id, m.user_b_id))`,
    )
      .bind(conversationId, userId)
      .first<{ id: string; mode: string; created_at: number; match_id: string; other: string }>();
    if (!row) throw errors.notFound('Conversation introuvable ou fermée.');
    const ctx: ChatCtx = {
      conversationId: row.id,
      matchId: row.match_id,
      mode: row.mode === 'invisible' ? 'invisible' : 'classic',
      createdAt: row.created_at,
      revealedAt: null,
      me: userId,
      other: row.other,
      otherName: '',
      otherVerified: false, // rechargé par le client via /state
    };
    chatDo(c, ctx);
  } else {
    const ctx = await chatContext(c, conversationId);
    userId = ctx.me;
  }

  const stub = c.env.CHAT_ROOM.get(c.env.CHAT_ROOM.idFromName(conversationId));
  const url = new URL(c.req.url);
  url.pathname = '/connect';
  url.searchParams.set('userId', userId);
  // Transfert de la requête Upgrade (headers conservés — pair 101 au DO).
  return stub.fetch(new Request(url.toString(), c.req.raw));
});

// ---------------------------------------------------------------------------
// Historique + envoi fallback HTTP + voice notes
// ---------------------------------------------------------------------------

/** GET /api/chat/:id/history?before=seq&limit=n — pagination (plan 6.3). */
chatRoutes.get('/chat/:id/history', async (c) => {
  const ctx = await chatContext(c, c.req.param('id'));
  const url = new URL(c.req.url);
  const before = Math.max(0, Number(url.searchParams.get('before') ?? '0'));
  const limit = Math.max(1, Math.min(CHAT.historyPageSize, Number(url.searchParams.get('limit') ?? CHAT.historyPageSize)));

  const res = await chatDo(c, ctx).fetch(
    new Request(`https://do/history?userId=${encodeURIComponent(ctx.me)}&before=${before}&limit=${limit}`),
  );
  if (!res.ok) throw errors.internal('Historique indisponible.');
  const page = (await res.json()) as Omit<ChatHistoryResponse, 'conversationMode'>;
  const body: ChatHistoryResponse = { ...page, conversationMode: ctx.mode };
  return c.json(body);
});

/** POST /api/chat/:id/messages {text} — envoi fallback HTTP (texte). */
chatRoutes.post('/chat/:id/messages', async (c) => {
  const ctx = await chatContext(c, c.req.param('id'));
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.chatSendUser, ctx.me);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.chatSendUser.scope);

  const payload = (await c.req.json().catch(() => null)) as { text?: unknown; clientRef?: unknown } | null;
  const text = typeof payload?.text === 'string' ? payload.text.trim() : '';
  if (!text) throw errors.badRequest('Message vide.');
  if (text.length > CHAT.maxTextLength) throw errors.badRequest('Message trop long (2000 max).');

  const res = await chatDo(c, ctx).fetch(
    new Request('https://do/send', {
      method: 'POST',
      body: JSON.stringify({
        userId: ctx.me,
        kind: 'text',
        text,
        clientRef: typeof payload?.clientRef === 'string' ? payload.clientRef.slice(0, 64) : undefined,
      }),
      headers: { 'content-type': 'application/json' },
    }),
  );
  if (res.status === 410) throw errors.notFound('Conversation fermée (unmatch).');
  if (res.status === 422) {
    throw errors.badRequest('Message bloqué — il contient des propos ou demandes interdits (arnaque, haine…).');
  }
  if (res.status === 429) throw errors.rateLimited('Trop de messages — ralentis un peu.');
  if (!res.ok) throw errors.internal('Envoi impossible.');
  const data = (await res.json()) as { ok: true; message: unknown };
  return c.json({ ok: true as const, message: data.message });
});

/** POST /api/chat/:id/voice (multipart file) — voice note (plan 6.2). */
chatRoutes.post('/chat/:id/voice', async (c) => {
  const ctx = await chatContext(c, c.req.param('id'));
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.chatVoiceUser, ctx.me);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.chatVoiceUser.scope);

  const form = await c.req.formData().catch(() => null);
  const file: unknown = form ? form.get('file') : null;
  if (!(file instanceof Blob)) throw errors.badRequest('Fichier audio manquant.');
  // Garde MIME : MediaRecorder produit audio/webm (Chrome/Android) ou
  // audio/mp4 (Safari/iOS) — tout ce qui n'est pas audio/ est refusé.
  const mime = (file as Blob).type || '';
  if (!mime.startsWith('audio/')) throw errors.badRequest('Format audio attendu (webm/mp4).');
  if (file.size <= 0 || file.size > CHAT.voiceMaxBytes) {
    throw errors.badRequest(`Voice note invalide (max ${Math.round(CHAT.voiceMaxBytes / 1024)} Ko).`);
  }
  const durationMs = Math.max(0, Math.min(CHAT.voiceMaxSeconds * 1000 + 5000, Number(form?.get('durationMs') ?? 0)));

  const publicId = `${c.env.CLOUDINARY_ROOT_FOLDER}/voicenotes/${ctx.me}/${crypto.randomUUID()}`;
  const up = await uploadAuthenticatedAudio(c.env, file, publicId);

  const res = await chatDo(c, ctx).fetch(
    new Request('https://do/send', {
      method: 'POST',
      body: JSON.stringify({
        userId: ctx.me,
        kind: 'voice',
        publicId,
        durationMs,
        version: up.version,
        ext: up.format,
      }),
      headers: { 'content-type': 'application/json' },
    }),
  );
  if (res.status === 410) throw errors.notFound('Conversation fermée (unmatch).');
  if (res.status === 429) throw errors.rateLimited('Trop de messages — ralentis un peu.');
  if (!res.ok) throw errors.internal('Envoi de la voice note impossible.');
  const data = (await res.json()) as { ok: true; message: unknown };
  return c.json({ ok: true as const, message: data.message });
});

// ---------------------------------------------------------------------------
// État + flux de révélation (§4.5)
// ---------------------------------------------------------------------------

/** GET /api/chat/:id/state — compteurs de révélation + carte disponible. */
chatRoutes.get('/chat/:id/state', async (c) => {
  const ctx = await chatContext(c, c.req.param('id'));
  const stats = await doStats(c, ctx);
  const now = Math.floor(Date.now() / 1000);
  const days = Math.floor((now - ctx.createdAt) / 86400);
  const revealEligible =
    ctx.mode === 'invisible' && ctx.revealedAt == null && !stats.closed &&
    stats.count >= REVEAL_THRESHOLD_MSGS && days >= REVEAL_THRESHOLD_DAYS;

  const pending = await c.env.DB.prepare(
    `SELECT id, requested_by FROM revelations
     WHERE conversation_id = ? AND status = 'pending' LIMIT 1`,
  )
    .bind(ctx.conversationId)
    .first<{ id: string; requested_by: string }>();

  const fb = await c.env.DB.prepare(
    `SELECT feedback FROM reveal_feedback WHERE conversation_id = ? AND user_id = ?`,
  )
    .bind(ctx.conversationId, ctx.me)
    .first<{ feedback: string }>();

  const photo = await otherPhoto(c, ctx.other, ctx.mode === 'invisible' && ctx.revealedAt == null);
  const otherMeta = await c.env.DB.prepare(
    `SELECT pp.type FROM personality_profiles pp WHERE pp.user_id = ?`,
  )
    .bind(ctx.other)
    .first<{ type: string | null }>();

  const body: ChatStateResponse = {
    conversationId: ctx.conversationId,
    conversationMode: ctx.mode,
    createdAt: ctx.createdAt,
    messagesCount: stats.count,
    days,
    revealEligible,
    revealed: ctx.revealedAt != null,
    revealedAt: ctx.revealedAt,
    pendingReveal: pending ? { id: pending.id, fromMe: pending.requested_by === ctx.me } : null,
    other: {
      userId: ctx.other,
      displayName: ctx.otherName,
      photoUrl: photo.url,
      photoBlurred: photo.blurred,
      personalityType: otherMeta?.type ?? null,
      verified: ctx.otherVerified,
    },
    myFeedback: (fb?.feedback as ChatStateResponse['myFeedback']) ?? null,
  };
  return c.json(body);
});

const REVEAL_THRESHOLD_MSGS = 15;
const REVEAL_THRESHOLD_DAYS = 7;

/** Vérifie l'éligibilité D1+DO d'une demande de révélation (§4.5.2). */
async function assertRevealEligible(c: Context<AppEnv>, ctx: ChatCtx): Promise<void> {
  if (ctx.mode !== 'invisible') {
    throw errors.badRequest('La révélation concerne les conversations en Mode Invisible.');
  }
  if (ctx.revealedAt != null) throw errors.badRequest('Vos photos sont déjà révélées.');

  const stats = await doStats(c, ctx);
  const now = Math.floor(Date.now() / 1000);
  const days = Math.floor((now - ctx.createdAt) / 86400);
  if (stats.count < REVEAL_THRESHOLD_MSGS || days < REVEAL_THRESHOLD_DAYS) {
    throw errors.forbidden(
      `Pas encore : ${stats.count}/${REVEAL_THRESHOLD_MSGS} messages et ${days}/${REVEAL_THRESHOLD_DAYS} jours.`,
    );
  }
}

/** POST /api/chat/:id/reveal — « Je suis prêt·e à me révéler » (demande). */
chatRoutes.post('/chat/:id/reveal', async (c) => {
  const ctx = await chatContext(c, c.req.param('id'));
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.chatRevealUser, ctx.me);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.chatRevealUser.scope);

  await assertRevealEligible(c, ctx);

  const pending = await c.env.DB.prepare(
    `SELECT id FROM revelations WHERE conversation_id = ? AND status = 'pending' LIMIT 1`,
  )
    .bind(ctx.conversationId)
    .first<{ id: string }>();
  if (pending) throw errors.badRequest('Une demande de révélation est déjà en attente.');

  const id = crypto.randomUUID();
  const now = Math.floor(Date.now() / 1000);
  await c.env.DB.prepare(
    `INSERT INTO revelations (id, conversation_id, requested_by, status, created_at)
     VALUES (?, ?, ?, 'pending', ?)`,
  )
    .bind(id, ctx.conversationId, ctx.me, now)
    .run();

  await chatDo(c, ctx).fetch(
    new Request('https://do/system', {
      method: 'POST',
      body: JSON.stringify({ event: 'reveal_requested', by: ctx.me, payload: {} }),
      headers: { 'content-type': 'application/json' },
    }),
  );

  const body: RevealResponse = {
    ok: true,
    status: 'pending',
    revealed: false,
    note: `Demande envoyée à ${ctx.otherName} — la révélation n’aura lieu qu’avec son accord explicite (§4.5).`,
  };
  return c.json(body);
});

/** POST /api/chat/:id/reveal/respond {accept} — consentement de l'AUTRE. */
chatRoutes.post('/chat/:id/reveal/respond', async (c) => {
  const ctx = await chatContext(c, c.req.param('id'));
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.chatRespondUser, ctx.me);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.chatRespondUser.scope);

  const payload = (await c.req.json().catch(() => null)) as { accept?: unknown } | null;
  const accept = payload?.accept === true;

  const pending = await c.env.DB.prepare(
    `SELECT id, requested_by FROM revelations
     WHERE conversation_id = ? AND status = 'pending' LIMIT 1`,
  )
    .bind(ctx.conversationId)
    .first<{ id: string; requested_by: string }>();
  if (!pending) throw errors.notFound('Aucune demande de révélation en attente.');
  if (pending.requested_by === ctx.me) throw errors.forbidden('Seul l’autre membre peut répondre à ta demande.');

  const now = Math.floor(Date.now() / 1000);
  if (accept) {
    // Consentement mutuel explicite : les photos se débloquent pour LES DEUX.
    await c.env.DB.batch([
      c.env.DB.prepare(`UPDATE revelations SET status = 'accepted', responded_at = ? WHERE id = ?`).bind(now, pending.id),
      c.env.DB.prepare(`UPDATE conversations SET revealed_at = ? WHERE id = ?`).bind(now, ctx.conversationId),
    ]);
  } else {
    // Refus = rien ne change : la conversation continue en Mode Invisible (§4.5.6).
    await c.env.DB.prepare(`UPDATE revelations SET status = 'declined', responded_at = ? WHERE id = ?`)
      .bind(now, pending.id)
      .run();
  }

  await chatDo(c, ctx).fetch(
    new Request('https://do/system', {
      method: 'POST',
      body: JSON.stringify({ event: accept ? 'reveal_accepted' : 'reveal_declined', by: ctx.me, payload: {} }),
      headers: { 'content-type': 'application/json' },
    }),
  );

  const body: RevealResponse = accept
    ? {
        ok: true,
        status: 'accepted',
        revealed: true,
        note: 'Révélation accordée — vos photos sont débloquées pour vous deux. Les captures d’écran restent possibles : ne partage que ce que tu veux voir circuler.',
      }
    : {
        ok: true,
        status: 'declined',
        revealed: false,
        note: 'Refus enregistré — la conversation continue en Mode Invisible, rien n’a changé.',
      };
  return c.json(body);
});

/** POST /api/chat/:id/reveal/feedback {feedback} — écran post-révélation. */
chatRoutes.post('/chat/:id/reveal/feedback', async (c) => {
  const ctx = await chatContext(c, c.req.param('id'));
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.chatRespondUser, ctx.me);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.chatRespondUser.scope);

  const payload = (await c.req.json().catch(() => null)) as { feedback?: unknown } | null;
  const feedback = typeof payload?.feedback === 'string' ? payload.feedback : '';
  if (!REVEAL_FEEDBACKS.includes(feedback as (typeof REVEAL_FEEDBACKS)[number])) {
    throw errors.badRequest('Feedback invalide.');
  }
  if (ctx.revealedAt == null) throw errors.badRequest('Le feedback arrive après la révélation.');

  const now = Math.floor(Date.now() / 1000);
  await c.env.DB.prepare(
    `INSERT INTO reveal_feedback (conversation_id, user_id, feedback, created_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT (conversation_id, user_id) DO UPDATE SET feedback = excluded.feedback, created_at = excluded.created_at`,
  )
    .bind(ctx.conversationId, ctx.me, feedback, now)
    .run();

  const both = await c.env.DB.prepare(
    `SELECT COUNT(*) AS n FROM reveal_feedback WHERE conversation_id = ?`,
  )
    .bind(ctx.conversationId)
    .first<{ n: number }>();

  const body: RevealFeedbackResponse = {
    ok: true,
    feedback: feedback as RevealFeedbackResponse['feedback'],
    bothDone: (both?.n ?? 0) >= 2,
    note: 'Merci — ton ressenti nourrit le matching Wairyu, sans jamais être montré à l’autre.',
  };
  return c.json(body);
});

// ---------------------------------------------------------------------------
// Unmatch propre (plan 6.7) — sortie des DEUX côtés + blocage optionnel
// ---------------------------------------------------------------------------

chatRoutes.post('/chat/:id/unmatch', async (c) => {
  const ctx = await chatContext(c, c.req.param('id'));
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.chatUnmatchUser, ctx.me);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.chatUnmatchUser.scope);

  const payload = (await c.req.json().catch(() => null)) as { block?: unknown } | null;
  const block = payload?.block === true;
  const now = Math.floor(Date.now() / 1000);

  // 1. Le match est clos des DEUX côtés (une seule écriture — ligne partagée).
  await c.env.DB.prepare(`UPDATE matches SET unmatched_at = ?, unmatched_by = ? WHERE id = ?`).bind(
    now,
    ctx.me,
    ctx.matchId,
  ).run();

  // 2. La paire redevient découvrable (re-like possible), SAUF si blocage.
  //    Les demandes « Discuter » de la paire sont retirées (le verrou
  //    anti-harcèlement reprend à zéro en cas de re-connexion).
  await c.env.DB.batch([
    c.env.DB.prepare(
      `DELETE FROM swipes WHERE (user_id = ? AND target_id = ?) OR (user_id = ? AND target_id = ?)`,
    ).bind(ctx.me, ctx.other, ctx.other, ctx.me),
    c.env.DB.prepare(
      `DELETE FROM invisible_requests
       WHERE (from_user = ? AND to_user = ?) OR (from_user = ? AND to_user = ?)`,
    ).bind(ctx.me, ctx.other, ctx.other, ctx.me),
  ]);

  // 3. Blocage optionnel en 1 clic (sens unique, protège dans les deux sens
  //    via l'exclusion du pool de découverte).
  if (block) {
    await c.env.DB.prepare(
      `INSERT INTO blocks (user_id, blocked_id, created_at) VALUES (?, ?, ?)
       ON CONFLICT (user_id, blocked_id) DO NOTHING`,
    )
      .bind(ctx.me, ctx.other, now)
      .run();
  }

  // 4. Le DO se verrouille : broadcast « unmatched » + fermeture des WS.
  await chatDo(c, ctx).fetch(new Request('https://do/shutdown', { method: 'POST' }));

  const body: UnmatchResponse = {
    ok: true,
    blocked: block,
    note: block
      ? 'Conversation supprimée des deux côtés, photos re-floutées, profil bloqué.'
      : 'Conversation supprimée des deux côtés et photos re-floutées.',
  };
  return c.json(body);
});

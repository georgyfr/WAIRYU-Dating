/**
 * ChatRoom — Durable Object SQLite (Étape 6).
 * UNE instance par conversation (id = idFromName(conversationId)).
 *
 * Architecture (plan Étape 6.1-6.4, spécification §4.9) :
 *  - WebSocket par participant via l'API d'HIBERNATION (acceptWebSocket) :
 *    zéro facturation runtime à l'arrêt, réveil instantané à l'arrivée d'un
 *    message — le bon choix free tier ;
 *  - Persistance des messages dans le SQLite du DO (messages, séquence
 *    monotone) + accusés de lecture (reads) + meta (mode, created_at, closed) ;
 *  - Présence + « est en train d'écrire… » = événements éphémères broadcast ;
 *  - Historique paginé (par seq décroissante, page 200) ;
 *  - Compteurs de révélation : COUNT(*) des messages + created_at (≥ 15
 *    messages ET ≥ 7 jours — REVEAL, §4.5) ;
 *  - Anti-spam en mémoire : 30 messages/minute/utilisateur (CHAT).
 *  - Push Web (VAPID) au recipient HORS ligne (aucun WS actif ici).
 *
 * D1 reste la source de vérité pour : matchs actifs, mode de conversation,
 * révélation, feedback — le DO relaie les événements système vers les WS.
 */
import { DurableObject } from 'cloudflare:workers';
import { signedMediaUrl } from '../lib/cloudinary';
import { sendPushToUser } from '../lib/push';
import { CHAT } from '@wairyu/shared';
import type { ChatMessageDto, ChatMessageKind } from '@wairyu/shared';
import type { Env } from '../env';

/** Schéma interne du DO (SQLite embarqué, par conversation). */
function ensureSchema(sql: SqlStorage): void {
  sql.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      seq         INTEGER PRIMARY KEY AUTOINCREMENT,
      sender      TEXT NOT NULL,
      kind        TEXT NOT NULL,
      body        TEXT NOT NULL,
      duration_ms INTEGER,
      meta        TEXT,                       -- JSON : {version, ext} pour voice
      created_at  INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS meta (k TEXT PRIMARY KEY, v TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS reads (user TEXT PRIMARY KEY, last_read INTEGER NOT NULL);
  `);
}

interface MetaRow { k: string; v: string }
interface MsgRow {
  seq: number;
  sender: string;
  kind: string;
  body: string;
  duration_ms: number | null;
  meta: string | null;
  created_at: number;
}

export class ChatRoom extends DurableObject {
  /** Anti-spam en mémoire (perdue au redémarrage — acceptable, fenêtre 1 min). */
  private sent: Map<string, number[]> = new Map();

  private get sql(): SqlStorage {
    return this.ctx.storage.sql;
  }

  private db(): SqlStorage {
    ensureSchema(this.sql);
    return this.sql;
  }

  // ------------------------------------------------------------------
  // Helpers méta / lectures
  // ------------------------------------------------------------------

  private getMeta(k: string): string | null {
    const row = this.db()
      .exec('SELECT v FROM meta WHERE k = ?', k)
      .toArray()[0] as { v: string } | undefined;
    return row?.v ?? null;
  }

  private setMeta(k: string, v: string): void {
    this.db().exec(
      `INSERT INTO meta (k, v) VALUES (?, ?)
       ON CONFLICT (k) DO UPDATE SET v = excluded.v`,
      k,
      v,
    );
  }

  private lastReadOf(user: string): number {
    const row = this.db()
      .exec('SELECT last_read FROM reads WHERE user = ?', user)
      .toArray()[0] as { last_read: number } | undefined;
    return row?.last_read ?? 0;
  }

  /** Message D1 → DTO avec URL signée pour les voice notes. */
  private async toDto(env: Env, r: MsgRow): Promise<ChatMessageDto> {
    let url: string | null = null;
    if (r.kind === 'voice') {
      let version = 1;
      let ext: string | undefined;
      if (r.meta) {
        try {
          const m = JSON.parse(r.meta) as { version?: number; ext?: string };
          if (typeof m.version === 'number') version = m.version;
          if (typeof m.ext === 'string') ext = m.ext;
        } catch {
          /* méta absente — version 1 */
        }
      }
      url = await signedMediaUrl(env.CLOUDINARY_CLOUD_NAME, env.CLOUDINARY_API_SECRET, r.body, {
        resourceType: 'video',
        version,
        ext,
      });
    }
    return {
      seq: r.seq,
      senderId: r.sender,
      kind: r.kind as ChatMessageKind,
      body: r.kind === 'voice' ? '' : r.body,
      durationMs: r.duration_ms,
      url,
      createdAt: r.created_at,
    };
  }

  /** Antispam : fenêtre glissante 60 s en mémoire. */
  private allowSend(user: string): boolean {
    const now = Date.now();
    const arr = (this.sent.get(user) ?? []).filter((t) => now - t < 60_000);
    if (arr.length >= CHAT.messagesPerMinute) {
      this.sent.set(user, arr);
      return false;
    }
    arr.push(now);
    this.sent.set(user, arr);
    return true;
  }

  // ------------------------------------------------------------------
  // Routes HTTP appelées par le Worker (auth déjà faite côté Worker)
  // ------------------------------------------------------------------

  override async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const env = this.env as Env;
    try {
      switch (url.pathname) {
        case '/health':
          return Response.json({ ok: true, storage: this.ctx.storage.sql ? 'sqlite' : 'kv' });

        case '/init':
          return this.init(await request.json());

        case '/connect':
          return this.wsConnect(url, env);

        case '/send':
          return await this.httpSend(env, await request.json());

        case '/history':
          return await this.history(env, url);

        case '/read':
          return this.read(env, await request.json());

        case '/typing':
          return this.typing(await request.json());

        case '/stats':
          return this.stats();

        case '/system':
          return await this.systemEvent(env, await request.json());

        case '/shutdown':
          return this.shutdown();

        default:
          return Response.json({ error: { code: 'not_found' } }, { status: 404 });
      }
    } catch (err) {
      console.error(JSON.stringify({ do: 'ChatRoom', path: url.pathname, err: String(err) }));
      return Response.json({ error: { code: 'internal' } }, { status: 500 });
    }
  }

  /**
   * Seed / mise à jour des meta (cid, members, mode, created_at) — appelé à
   * chaque connexion et après chaque changement de mode (passerelle).
   */
  private init(body: { conversationId?: string; mode?: string; createdAt?: number; members?: string[]; reset?: boolean }): Response {
    if (body.reset === true) {
      // Re-match après unmatch : la conversation rouvre (§4.8, historique conservé).
      this.db().exec('DELETE FROM meta WHERE k = ?', 'closed');
    }
    if (typeof body.conversationId === 'string') this.setMeta('cid', body.conversationId);
    if (Array.isArray(body.members) && body.members.length === 2) {
      this.setMeta('members', JSON.stringify(body.members));
    }
    if (typeof body.mode === 'string') this.setMeta('mode', body.mode);
    if (typeof body.createdAt === 'number') this.setMeta('created_at', String(body.createdAt));
    return Response.json({ ok: true, closed: this.getMeta('closed') === '1' });
  }

  /**
   * Upgrade WebSocket — le Worker a déjà validé session + appartenance au match.
   * Tag = userId (hibernation : reconnexion gratuite, livraison pendant le sommeil).
   */
  private wsConnect(url: URL, env: Env): Response {
    const userId = url.searchParams.get('userId') ?? '';
    if (!userId) return Response.json({ error: { code: 'bad_request' } }, { status: 400 });
    if (this.getMeta('closed') === '1') {
      return Response.json({ error: { code: 'gone', message: 'Conversation fermée (unmatch).' } }, { status: 410 });
    }

    const pair = new WebSocketPair();
    this.ctx.acceptWebSocket(pair[1], [userId]);

    // NB : aucun envoi ici — pendant le fetch d'upgrade, le socket CLIENT
    // n'est pas encore établi et le message serait perdu (sonde WS l'a prouvé).
    // Le client envoie {type:'hello'} à l'open → le DO répond ready (hello).
    void env;
    return new Response(null, { status: 101, webSocket: pair[0] });
  }

  /** Répond « ready » après l'open client + prévient l'autre (présence). */
  private hello(env: Env, ws: WebSocket, userId: string): void {
    const users = this.members();
    const other = users.find((u) => u !== userId) ?? '';
    const otherOnline = other ? this.ctx.getWebSockets(other).length > 0 : false;

    ws.send(
      JSON.stringify({
        type: 'ready',
        you: userId,
        other,
        otherOnline,
        otherReadSeq: this.lastReadOf(other),
        myReadSeq: this.lastReadOf(userId),
        mode: this.getMeta('mode') ?? 'classic',
        revealed: this.getMeta('revealed') === '1',
      }),
    );
    if (other) this.broadcastTo(other, { type: 'presence', userId, online: true });
  }

  /** Fallback HTTP (tests automatisés, clients sans WS, voice notes). */
  private async httpSend(
    env: Env,
    body: {
      userId?: string;
      kind?: string;
      text?: string;
      publicId?: string;
      durationMs?: number;
      version?: number;
      ext?: string;
      clientRef?: string;
    },
  ): Promise<Response> {
    const userId = body.userId ?? '';
    const kind = body.kind === 'voice' ? 'voice' : 'text';
    const text = typeof body.text === 'string' ? body.text.trim() : '';
    const publicId = typeof body.publicId === 'string' ? body.publicId : '';

    if (this.getMeta('closed') === '1') {
      return Response.json({ error: { code: 'gone', message: 'Conversation fermée (unmatch).' } }, { status: 410 });
    }
    if (!userId || (kind === 'text' && !text) || (kind === 'voice' && !publicId)) {
      return Response.json({ error: { code: 'bad_request' } }, { status: 400 });
    }
    if (kind === 'text' && text.length > CHAT.maxTextLength) {
      return Response.json({ error: { code: 'too_large' } }, { status: 413 });
    }
    if (!this.allowSend(userId)) {
      return Response.json({ error: { code: 'rate_limited' } }, { status: 429 });
    }

    const message = await this.persistAndBroadcast(env, {
      senderId: userId,
      kind,
      body: kind === 'voice' ? publicId : text,
      durationMs: kind === 'voice' ? Math.max(0, Math.min(90_000, Math.round(body.durationMs ?? 0))) : null,
      meta:
        kind === 'voice'
          ? JSON.stringify({ version: Number(body.version) || 1, ext: body.ext })
          : null,
      clientRef: body.clientRef,
    });
    return Response.json({ ok: true, message });
  }

  /** GET /history?before=&limit=&userId= — pagination par seq décroissante. */
  private async history(env: Env, url: URL): Promise<Response> {
    const userId = url.searchParams.get('userId') ?? '';
    const before = Number(url.searchParams.get('before') ?? '0');
    const limit = Math.max(1, Math.min(CHAT.historyPageSize, Number(url.searchParams.get('limit') ?? CHAT.historyPageSize)));

    const rows = (before > 0
      ? this.db().exec('SELECT * FROM messages WHERE seq < ? ORDER BY seq DESC LIMIT ?', before, limit)
      : this.db().exec('SELECT * FROM messages ORDER BY seq DESC LIMIT ?', limit)
    ).toArray() as unknown as MsgRow[];

    const hasMore = rows.length === limit && (this.db().exec(
      'SELECT 1 FROM messages WHERE seq < ? LIMIT 1',
      rows[rows.length - 1]!.seq,
    ).toArray().length > 0);

    const messages: ChatMessageDto[] = [];
    for (const r of [...rows].reverse()) messages.push(await this.toDto(env, r));

    const users = this.members();
    const other = users.find((u) => u !== userId) ?? '';

    return Response.json({
      conversationId: this.getMeta('cid') ?? '',
      messages,
      hasMore,
      otherReadSeq: this.lastReadOf(other),
      myReadSeq: this.lastReadOf(userId),
    });
  }

  /** POST /read — marque « vu » jusqu'à seq et notifie l'autre. */
  private read(env: Env, body: { userId?: string; upto?: number }): Response {
    const userId = body.userId ?? '';
    const upto = Math.max(0, Math.round(body.upto ?? 0));
    if (!userId || upto <= 0) return Response.json({ error: { code: 'bad_request' } }, { status: 400 });

    const prev = this.lastReadOf(userId);
    if (upto > prev) {
      this.db().exec(
        `INSERT INTO reads (user, last_read) VALUES (?, ?)
         ON CONFLICT (user) DO UPDATE SET last_read = excluded.last_read`,
        userId,
        upto,
      );
      const users = this.members();
      for (const u of users) {
        if (u !== userId) this.broadcastTo(u, { type: 'read', by: userId, upto });
      }
    }
    void env;
    return Response.json({ ok: true, lastRead: Math.max(prev, upto) });
  }

  /** POST /typing — éphémère, jamais persisté. */
  private typing(body: { userId?: string; on?: boolean }): Response {
    const userId = body.userId ?? '';
    if (!userId) return Response.json({ error: { code: 'bad_request' } }, { status: 400 });
    const users = this.members();
    for (const u of users) {
      if (u !== userId) this.broadcastTo(u, { type: 'typing', from: userId, on: body.on === true });
    }
    return Response.json({ ok: true });
  }

  /** GET /stats — compteurs de révélation (plan Étape 6.4 : maintenus dans le DO). */
  private stats(): Response {
    const count = (this.db().exec('SELECT COUNT(*) AS n FROM messages').toArray()[0] as { n: number }).n;
    const last = (this.db().exec('SELECT MAX(seq) AS m FROM messages').toArray()[0] as { m: number | null }).m ?? 0;
    return Response.json({
      ok: true,
      count,
      lastSeq: last,
      closed: this.getMeta('closed') === '1',
      online: this.members().map((u) => ({ userId: u, sockets: this.ctx.getWebSockets(u).length })),
    });
  }

  /**
   * POST /system — relaie un événement D1 (révélation demandée/acceptée/
   * refusée, passerelle) vers les WS actifs + push si le recipient est hors ligne.
   */
  private async systemEvent(
    env: Env,
    body: { event?: string; by?: string; payload?: Record<string, unknown> },
  ): Promise<Response> {
    const event = body.event ?? '';
    if (!event) return Response.json({ error: { code: 'bad_request' } }, { status: 400 });

    if (event === 'reveal_accepted') this.setMeta('revealed', '1');
    if (event === 'gateway_accepted' && typeof body.payload?.mode === 'string') {
      this.setMeta('mode', body.payload.mode);
    }

    const msg = { type: 'system', event, by: body.by ?? null, payload: body.payload ?? {} };
    const users = this.members();
    for (const u of users) {
      const online = this.ctx.getWebSockets(u).length > 0;
      this.broadcastTo(u, msg);
      // Push seulement pour l'utilisateur CONCERNÉ (non émetteur) hors ligne.
      if (!online && body.by && u !== body.by) {
        void sendPushToUser(env, u, pushPayloadFor(event, u));
      }
    }
    return Response.json({ ok: true });
  }

  /** POST /shutdown — unmatch : tout le monde sort, la conversation se verrouille. */
  private shutdown(): Response {
    this.setMeta('closed', '1');
    const notice = JSON.stringify({ type: 'system', event: 'unmatched', payload: {} });
    for (const ws of this.ctx.getWebSockets()) {
      try {
        ws.send(notice);
        ws.close(1000, 'unmatched');
      } catch {
        /* déjà fermée */
      }
    }
    return Response.json({ ok: true });
  }

  // ------------------------------------------------------------------
  // Hibernation — réception des messages WebSocket
  // ------------------------------------------------------------------

  override async webSocketMessage(ws: WebSocket, raw: string | ArrayBuffer): Promise<void> {
    if (typeof raw !== 'string') return;
    let data: { type?: string; [k: string]: unknown };
    try {
      data = JSON.parse(raw);
    } catch {
      return;
    }

    const userId = this.tagOf(ws);
    const env = this.env as Env;

    switch (data.type) {
      case 'hello':
        this.hello(env, ws, userId);
        return;

      case 'ping':
        ws.send(JSON.stringify({ type: 'pong' }));
        return;

      case 'typing':
        await this.forward('/typing', { userId, on: data.on === true });
        return;

      case 'read': {
        const upto = Math.max(0, Math.round(Number(data.upto) || 0));
        await this.forward('/read', { userId, upto });
        return;
      }

      case 'msg': {
        if (this.getMeta('closed') === '1') {
          ws.send(JSON.stringify({ type: 'error', message: 'Conversation fermée (unmatch).' }));
          return;
        }
        if (!this.allowSend(userId)) {
          ws.send(JSON.stringify({ type: 'error', message: 'Trop de messages — ralentis un peu.' }));
          return;
        }
        const text = typeof data.body === 'string' ? data.body.trim() : '';
        if (!text || text.length > CHAT.maxTextLength) {
          ws.send(JSON.stringify({ type: 'error', message: 'Message invalide (vide ou trop long).' }));
          return;
        }
        await this.persistAndBroadcast(env, {
          senderId: userId,
          kind: 'text',
          body: text,
          durationMs: null,
          clientRef: typeof data.clientRef === 'string' ? data.clientRef : undefined,
        });
        return;
      }

      default:
        ws.send(JSON.stringify({ type: 'error', message: 'Type de message inconnu.' }));
    }
  }

  override async webSocketClose(ws: WebSocket): Promise<void> {
    try {
      const userId = this.tagOf(ws);
      if (!userId) return;
      // Diffusion inconditionnelle : pendant le close, le socket sortant peut
      // être encore compté — le client interprète offline avec prudence.
      const users = this.members();
      for (const u of users) {
        if (u !== userId) this.broadcastTo(u, { type: 'presence', userId, online: false });
      }
    } catch {
      /* ne jamais lever dans un handler de fermeture */
    }
  }

  // ------------------------------------------------------------------
  // Internes
  // ------------------------------------------------------------------

  /** Les deux membres (tags des WS connectés + meta d'init). */
  private members(): string[] {
    const saved = this.getMeta('members');
    if (saved) {
      try {
        const arr = JSON.parse(saved) as string[];
        if (Array.isArray(arr) && arr.length === 2) return arr;
      } catch {
        /* ignore */
      }
    }
    // Fallback : tags des WS actifs (au moins 1 connecté).
    return Array.from(new Set(this.ctx.getWebSockets().map((w) => this.tagOf(w)))).filter(Boolean) as string[];
  }

  private tagOf(ws: WebSocket): string {
    const tags = this.ctx.getTags(ws);
    return tags[0] ?? '';
  }

  /** Insert D1-independent (SQLite DO) puis broadcast à TOUT LE MONDE. */
  private async persistAndBroadcast(
    env: Env,
    input: { senderId: string; kind: ChatMessageKind; body: string; durationMs: number | null; meta?: string | null; clientRef?: string },
  ): Promise<ChatMessageDto> {
    const now = Math.floor(Date.now() / 1000);
    const res = this.db().exec(
      'INSERT INTO messages (sender, kind, body, duration_ms, meta, created_at) VALUES (?, ?, ?, ?, ?, ?) RETURNING *',
      input.senderId,
      input.kind,
      input.body,
      input.durationMs,
      input.meta ?? null,
      now,
    );
    const row = res.toArray()[0] as unknown as MsgRow;
    const dto = await this.toDto(env, row);

    const payload = JSON.stringify({ type: 'msg', message: dto, clientRef: input.clientRef ?? null });
    for (const ws of this.ctx.getWebSockets()) {
      try {
        ws.send(payload);
      } catch {
        /* socket morte — hibernation la nettoie */
      }
    }

    // Push au recipient hors ligne (« hors conversation active » — plan 6.8).
    const cid = this.getMeta('cid') ?? '';
    const users = this.members();
    for (const u of users) {
      if (u !== input.senderId && this.ctx.getWebSockets(u).length === 0) {
        void sendPushToUser(env, u, {
          title: 'Nouveau message',
          body: input.kind === 'voice' ? '🎤 Note vocale' : input.body.slice(0, 120),
          tag: `msg-${cid}`,
          url: `#/chat/${cid}`,
        });
      }
    }
    return dto;
  }

  private broadcastTo(userTag: string, payload: unknown): void {
    const data = JSON.stringify(payload);
    for (const ws of this.ctx.getWebSockets(userTag)) {
      try {
        ws.send(data);
      } catch {
        /* ignore */
      }
    }
  }

  /** Petit forward interne (typing/read depuis webSocketMessage). */
  private async forward(path: string, body: unknown): Promise<void> {
    await this.fetch(
      new Request(`https://do${path}`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'content-type': 'application/json' },
      }),
    );
  }
}

/** Payload de push associé à un événement système. */
function pushPayloadFor(
  event: string,
  _recipient: string,
): { title: string; body: string; tag: string; url: string } {
  switch (event) {
    case 'reveal_requested':
      return {
        title: 'Révélation demandée',
        body: 'Quelqu’un est prêt·e à se révéler — à toi de voir.',
        tag: 'reveal',
        url: '#/matches',
      };
    case 'reveal_accepted':
      return {
        title: 'Photos révélées ✨',
        body: 'Vous vous êtes révélés mutuellement — jette un œil.',
        tag: 'reveal',
        url: '#/matches',
      };
    case 'gateway_accepted':
      return {
        title: 'Passerelle acceptée',
        body: 'Votre conversation continue en Mode Invisible.',
        tag: 'gateway',
        url: '#/matches',
      };
    default:
      return { title: 'Wairyu', body: 'Nouvelle activité dans une conversation.', tag: 'chat', url: '#/matches' };
  }
}

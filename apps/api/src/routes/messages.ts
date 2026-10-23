/**
 * RENCONTRE-E2 « Les conversations » (Task 107, reconstitution) —
 * messages, non-lus, révélation consentie, traduction, sécurité à un geste.
 *
 * SPEC : docs/SPEC-RENONCONTRE-E2.v1.md (D-E2-1..11) :
 *  - D-E2-1  la conversation n'existe QUE derrière un match (E1) — aucune
 *            découverte de gens nouveaux ici ;
 *  - D-E2-2  message 1..2000 caractères, texte seul (aucun média en E2) ;
 *  - D-E2-3  historique borné (100 derniers par page, curseur cree_a) ;
 *  - D-E2-4  les non-lus sont DÉRIVÉS (rencontre_lus = dernier vu) — badge
 *            par conversation, l'ouverture du fil marque lu ;
 *  - D-E2-5  traduction Workers AI au BOUTON MANUEL (jamais automatique),
 *            fail-graceful 503 sans binding ;
 *  - D-E2-6  révélation consentie : les DEUX seuils du shared (REVEAL —
 *            15 messages ET 7 jours) puis les DEUX consentements — jamais
 *            unilatérale ;
 *  - D-E2-7  blocage SILENCIEUX deux sens : le bloqué n'est jamais prévenu
 *            (pool caché, pas neutre, envoi neutre), messages conservés,
 *            survit à l'unmatch ;
 *  - D-E2-8  unmatch : casse le match, purge messages/lus/reveals (+ les
 *            états à deux et objets médias R2 — D-E3-7), remet
 *            les pas à « retire » (re-pas possible), blocage conservé ;
 *  - D-E2-9  signalements à motifs fermés, confidentiels (l'autre n'est
 *            jamais informé) ;
 *  - D-E2-10 temps réel = DO ChatRoom (hibernation) + fallback REST — la
 *            source de vérité des messages reste D1 ;
 *  - D-E2-11 RGPD : export étendu (messages) + purge physique de TOUTES
 *            les tables E2 au hard delete (routes/auth.ts).
 *
 * Style d'erreurs : { ok:false, error } aligné routes/rencontres.ts ;
 * session OBLIGATOIRE (sessionMiddleware, montée avant ce routeur).
 */
import { Hono } from 'hono';
import type { Context } from 'hono';
import type { AppEnv } from '../env';
import { RATE_RULES, hitRateLimit, rateLimitedError } from '../lib/ratelimit';
import { REVEAL } from '@wairyu/shared';

export const messagesRoutes = new Hono<AppEnv>();

const CORPS_MAX = 2000;
const DETAILS_MAX = 1000;
const PAGE = 100;
const MOTIFS = ['escroquerie_ou_argent', 'harcelement', 'faux_profil', 'contenu_inapproprie', 'fetichisant', 'autre'] as const;
type Motif = (typeof MOTIFS)[number];

/** Exige une session valide ; retourne {sessionId, userId}. */
function requireAuth(c: Context<AppEnv>): { sessionId: string; userId: string } {
  const session = c.get('session');
  if (!session) throw new Error('unauthorized');
  return session;
}

function nonAutorise(c: Context<AppEnv>) {
  return c.json({ ok: false, error: 'unauthorized' }, 401);
}

/** Le pseudo affichable d'un membre (display_name trims, sinon @username). */
function pseudoDe(dn: string | null, un: string | null): string | null {
  const t = (dn ?? '').trim();
  return t.length > 0 ? t : un ?? null;
}

/** Contexte d'un match pour un membre : le match, l'autre, l'état blocage. */
async function contexteMatch(
  db: D1Database,
  matchId: string,
  userId: string,
): Promise<{ matchId: string; a: string; b: string; autreId: string; bloque: boolean } | null> {
  if (!/^[0-9a-f-]{16,64}$/i.test(matchId)) return null;
  const match = await db
    .prepare(`SELECT id, a, b FROM rencontre_matchs WHERE id = ?1 LIMIT 1`)
    .bind(matchId)
    .first<{ id: string; a: string; b: string }>();
  if (!match) return null;
  if (match.a !== userId && match.b !== userId) return null;
  const autreId = match.a === userId ? match.b : match.a;
  const bloq = await db
    .prepare(
      `SELECT 1 AS ok FROM rencontre_blocages
       WHERE (par = ?1 AND contre = ?2) OR (par = ?2 AND contre = ?1) LIMIT 1`,
    )
    .bind(userId, autreId)
    .first<{ ok: number }>();
  return { matchId: match.id, a: match.a, b: match.b, autreId, bloque: !!bloq };
}

/** État de révélation d'un match (seuil REVEAL + consentements). */
async function etatReveal(
  db: D1Database,
  matchId: string,
  userId: string,
  autreId: string,
  matchCreeA: string,
  totalMessages: number,
): Promise<{ seuilAtteint: boolean; messages: number; messagesRequis: number; jours: number; joursRequis: number; demandeMoi: boolean; demandeAutre: boolean; revele: boolean }> {
  const jours = Math.floor((Date.now() - new Date(matchCreeA).getTime()) / 86_400_000);
  const { results } = await db
    .prepare(`SELECT user_id FROM rencontre_reveals WHERE match_id = ?1`)
    .bind(matchId)
    .all<{ user_id: string }>();
  const demandes = new Set((results ?? []).map((r) => r.user_id));
  const seuilAtteint = totalMessages >= REVEAL.minMessages && jours >= REVEAL.minDays;
  return {
    seuilAtteint,
    messages: totalMessages,
    messagesRequis: REVEAL.minMessages,
    jours,
    joursRequis: REVEAL.minDays,
    demandeMoi: demandes.has(userId),
    demandeAutre: demandes.has(autreId),
    revele: demandes.has(userId) && demandes.has(autreId),
  };
}

/* ------------------------------------------------------------------ */
/* D-E2-4 — La boîte de réception : mes matchs, dernier message, non-lus */
/* ------------------------------------------------------------------ */
messagesRoutes.get('/rencontres/conversations', async (c) => {
  let session: { sessionId: string; userId: string };
  try {
    session = requireAuth(c);
  } catch {
    return nonAutorise(c);
  }
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.chatListUser, session.userId);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.chatListUser.scope);

  try {
    const { results } = await c.env.DB.prepare(
      `SELECT m.id AS match_id, m.a, m.b, m.cree_a,
              u.display_name AS dn, ap.username AS un,
              (SELECT COUNT(*) FROM rencontre_messages msg WHERE msg.match_id = m.id) AS total,
              (SELECT corps FROM rencontre_messages msg WHERE msg.match_id = m.id ORDER BY msg.cree_a DESC, msg.id DESC LIMIT 1) AS dernier_corps,
              (SELECT de FROM rencontre_messages msg WHERE msg.match_id = m.id ORDER BY msg.cree_a DESC, msg.id DESC LIMIT 1) AS dernier_de,
              (SELECT cree_a FROM rencontre_messages msg WHERE msg.match_id = m.id ORDER BY msg.cree_a DESC, msg.id DESC LIMIT 1) AS dernier_a,
              (SELECT COUNT(*) FROM rencontre_messages msg
                WHERE msg.match_id = m.id AND msg.de != ?1
                  AND msg.cree_a > COALESCE((SELECT l.lu_a FROM rencontre_lus l WHERE l.match_id = m.id AND l.user_id = ?1), '')) AS non_lus,
              (SELECT COUNT(*) FROM rencontre_reveals rv WHERE rv.match_id = m.id) AS nb_reveals
       FROM rencontre_matchs m
       LEFT JOIN users u ON u.id = (CASE WHEN m.a = ?1 THEN m.b ELSE m.a END) AND u.status = 'active'
       LEFT JOIN auth_password ap ON ap.user_id = u.id
       WHERE m.a = ?1 OR m.b = ?1
       ORDER BY m.cree_a DESC
       LIMIT 200`,
    )
      .bind(session.userId)
      .all<{
        match_id: string; a: string; b: string; cree_a: string;
        dn: string | null; un: string | null;
        total: number; dernier_corps: string | null; dernier_de: string | null;
        dernier_a: string | null; non_lus: number; nb_reveals: number;
      }>();

    const conversations = (results ?? [])
      .map((r) => ({
        matchId: r.match_id,
        creeA: r.cree_a,
        autre: { id: r.a === session.userId ? r.b : r.a, pseudo: pseudoDe(r.dn, r.un) },
        total: r.total,
        nonLus: r.non_lus,
        dernier: r.dernier_corps
          ? { corps: r.dernier_corps, deMoi: r.dernier_de === session.userId, creeA: r.dernier_a }
          : null,
        revele: r.nb_reveals >= 2,
      }))
      .sort((x, y) => {
        // Les plus récemment actives d'abord (dernier message, sinon le match).
        const ax = x.dernier?.creeA ?? x.creeA;
        const ay = y.dernier?.creeA ?? y.creeA;
        return ay.localeCompare(ax);
      });

    const totalNonLus = conversations.reduce((s, x) => s + x.nonLus, 0);
    return c.json({ ok: true, conversations, totalNonLus });
  } catch (e) {
    console.error('[messages] conversations failed', e);
    return c.json({ ok: false, error: 'store_unavailable' }, 500);
  }
});

/* ------------------------------------------------------------------ */
/* D-E2-10 — WebSocket temps réel (ticket → DO ChatRoom)               */
/* ------------------------------------------------------------------ */
messagesRoutes.get('/rencontres/:matchId/ws', async (c) => {
  let session: { sessionId: string; userId: string };
  try {
    session = requireAuth(c);
  } catch {
    return nonAutorise(c);
  }
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.chatTicketUser, session.userId);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.chatTicketUser.scope);

  const ctx = await contexteMatch(c.env.DB, c.req.param('matchId'), session.userId);
  if (!ctx) return c.json({ ok: false, error: 'not_found' }, 404);
  // Bloqué : pas de temps réel (le DO refuserait chaque envoi) — le front
  // retombe sur le REST qui répond neutre (D-E2-7, jamais d'explication).
  if (ctx.bloque) return c.json({ ok: false, error: 'not_found' }, 404);

  const stub = c.env.CHAT_ROOM.get(c.env.CHAT_ROOM.idFromName(ctx.matchId));
  return stub.fetch(
    new Request(`https://do.chat-room/rencontres?match=${encodeURIComponent(ctx.matchId)}`, {
      headers: {
        Upgrade: 'websocket',
        'x-wairyu-user': session.userId,
      },
    }),
  );
});

/* ------------------------------------------------------------------ */
/* D-E2-3 — L'historique d'une conversation (100 derniers, curseur)    */
/* ------------------------------------------------------------------ */
messagesRoutes.get('/rencontres/:matchId/messages', async (c) => {
  let session: { sessionId: string; userId: string };
  try {
    session = requireAuth(c);
  } catch {
    return nonAutorise(c);
  }
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.chatListUser, session.userId);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.chatListUser.scope);

  const ctx = await contexteMatch(c.env.DB, c.req.param('matchId'), session.userId);
  if (!ctx) return c.json({ ok: false, error: 'not_found' }, 404);

  try {
    const match = await c.env.DB.prepare(`SELECT cree_a FROM rencontre_matchs WHERE id = ?1`)
      .bind(ctx.matchId)
      .first<{ cree_a: string }>();
    const before = c.req.query('before');
    const bind: string[] = [ctx.matchId];
    let where = '';
    if (typeof before === 'string' && /^\d{4}-\d{2}-\d{2}T[\d:.]+Z?$/.test(before)) {
      where = 'AND msg.cree_a < ?2';
      bind.push(before);
    }
    const total = await c.env.DB.prepare(`SELECT COUNT(*) AS n FROM rencontre_messages WHERE match_id = ?1`)
      .bind(ctx.matchId)
      .first<{ n: number }>();
    const { results } = await c.env.DB.prepare(
      `SELECT msg.id, msg.de, msg.corps, msg.langue, msg.cree_a
       FROM rencontre_messages msg
       WHERE msg.match_id = ?1 ${where}
       ORDER BY msg.cree_a DESC, msg.id DESC
       LIMIT ${PAGE}`,
    )
      .bind(...bind)
      .all<{ id: string; de: string; corps: string; langue: string; cree_a: string }>();
    const messages = (results ?? []).reverse().map((m) => ({
      id: m.id,
      deMoi: m.de === session.userId,
      corps: m.corps,
      lang: m.langue,
      creeA: m.cree_a,
    }));

    const meta = await c.env.DB.prepare(`SELECT display_name AS dn FROM users WHERE id = ?1`)
      .bind(ctx.autreId)
      .first<{ dn: string | null }>();
    const un = await c.env.DB.prepare(`SELECT username AS un FROM auth_password WHERE user_id = ?1`)
      .bind(ctx.autreId)
      .first<{ un: string | null }>();

    return c.json({
      ok: true,
      matchId: ctx.matchId,
      autre: { id: ctx.autreId, pseudo: pseudoDe(meta?.dn ?? null, un?.un ?? null) },
      bloquerPossible: !ctx.bloque,
      bloque: ctx.bloque,
      messages,
      plusAncien: messages.length >= PAGE ? (messages[0]?.creeA ?? null) : null,
      reveal: await etatReveal(c.env.DB, ctx.matchId, session.userId, ctx.autreId, match?.cree_a ?? new Date().toISOString(), total?.n ?? 0),
    });
  } catch (e) {
    console.error('[messages] historique failed', e);
    return c.json({ ok: false, error: 'store_unavailable' }, 500);
  }
});

/* ------------------------------------------------------------------ */
/* D-E2-2 — Envoi REST (fallback du WS — même règle d'anti-spam)       */
/* ------------------------------------------------------------------ */
messagesRoutes.post('/rencontres/:matchId/messages', async (c) => {
  let session: { sessionId: string; userId: string };
  try {
    session = requireAuth(c);
  } catch {
    return nonAutorise(c);
  }
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.chatSendUser, session.userId);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.chatSendUser.scope);

  let corps: unknown;
  try {
    corps = await c.req.json();
  } catch {
    return c.json({ ok: false, error: 'invalid_body' }, 400);
  }
  const texte = typeof (corps as { corps?: unknown })?.corps === 'string' ? ((corps as { corps: string }).corps.trim()) : '';
  if (texte.length === 0 || texte.length > CORPS_MAX) return c.json({ ok: false, error: 'invalid_body' }, 400);
  const lang = (corps as { lang?: unknown })?.lang === 'en' ? 'en' : 'fr';

  const ctx = await contexteMatch(c.env.DB, c.req.param('matchId'), session.userId);
  if (!ctx) return c.json({ ok: false, error: 'not_found' }, 404);

  try {
    // D-E2-7 : envoi NEUTRE sous blocage (ok:true, aucun insert) — le bloqué
    // ne doit jamais pouvoir déduire le blocage d'une erreur explicite.
    if (ctx.bloque) return c.json({ ok: true, silencieux: true });

    const id = crypto.randomUUID();
    const creeA = new Date().toISOString();
    await c.env.DB.prepare(
      `INSERT INTO rencontre_messages (id, match_id, de, corps, langue, cree_a) VALUES (?1, ?2, ?3, ?4, ?5, ?6)`,
    )
      .bind(id, ctx.matchId, session.userId, texte, lang, creeA)
      .run();
    // Le message REST est en D1 (source de vérité) — on le DIFFUSE au DO pour
    // le temps réel (fire-and-forget : une indisponibilité du DO ne casse
    // jamais l'envoi, le destinataire le verra au polling/à l'ouverture).
    try {
      const stub = c.env.CHAT_ROOM.get(c.env.CHAT_ROOM.idFromName(ctx.matchId));
      await stub.fetch(
        new Request('https://do.chat-room/notify', {
          method: 'POST',
          body: JSON.stringify({
            message: { id, matchId: ctx.matchId, de: session.userId, corps: texte, lang, creeA },
          }),
        }),
      );
    } catch {
      /* temps réel non critique — l'historique REST reste la vérité */
    }
    return c.json({ ok: true, message: { id, deMoi: true, corps: texte, lang, creeA } });
  } catch (e) {
    console.error('[messages] envoi failed', e);
    return c.json({ ok: false, error: 'store_unavailable' }, 500);
  }
});

/* ------------------------------------------------------------------ */
/* D-E2-4 — Marque lu (ouverture du fil / réception en vue)            */
/* ------------------------------------------------------------------ */
messagesRoutes.post('/rencontres/:matchId/lu', async (c) => {
  let session: { sessionId: string; userId: string };
  try {
    session = requireAuth(c);
  } catch {
    return nonAutorise(c);
  }
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.chatListUser, session.userId);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.chatListUser.scope);

  const ctx = await contexteMatch(c.env.DB, c.req.param('matchId'), session.userId);
  if (!ctx) return c.json({ ok: false, error: 'not_found' }, 404);
  try {
    await c.env.DB.prepare(
      `INSERT INTO rencontre_lus (match_id, user_id, lu_a) VALUES (?1, ?2, ?3)
       ON CONFLICT (match_id, user_id) DO UPDATE SET lu_a = excluded.lu_a`,
    )
      .bind(ctx.matchId, session.userId, new Date().toISOString())
      .run();
    return c.json({ ok: true });
  } catch (e) {
    console.error('[messages] marqueLu failed', e);
    return c.json({ ok: false, error: 'store_unavailable' }, 500);
  }
});

/* ------------------------------------------------------------------ */
/* D-E2-6 — La révélation consentie (seuil REVEAL puis double oui)     */
/* ------------------------------------------------------------------ */
messagesRoutes.post('/rencontres/:matchId/reveal', async (c) => {
  let session: { sessionId: string; userId: string };
  try {
    session = requireAuth(c);
  } catch {
    return nonAutorise(c);
  }
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.chatRevealUser, session.userId);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.chatRevealUser.scope);

  const ctx = await contexteMatch(c.env.DB, c.req.param('matchId'), session.userId);
  if (!ctx) return c.json({ ok: false, error: 'not_found' }, 404);

  try {
    const match = await c.env.DB.prepare(`SELECT cree_a FROM rencontre_matchs WHERE id = ?1`)
      .bind(ctx.matchId)
      .first<{ cree_a: string }>();
    const total = await c.env.DB.prepare(`SELECT COUNT(*) AS n FROM rencontre_messages WHERE match_id = ?1`)
      .bind(ctx.matchId)
      .first<{ n: number }>();
    const totalMessages = total?.n ?? 0;
    const etat = await etatReveal(c.env.DB, ctx.matchId, session.userId, ctx.autreId, match?.cree_a ?? new Date().toISOString(), totalMessages);

    if (etat.revele) return c.json({ ok: true, etat });
    if (!etat.seuilAtteint) {
      // Les DEUX seuils (15 messages ET 7 jours) doivent être réunis — on
      // expose la progression sans pression : c'est une porte, pas une quête.
      return c.json({ ok: false, error: 'reveal_seuil', etat }, 403);
    }
    await c.env.DB.prepare(
      `INSERT INTO rencontre_reveals (match_id, user_id, cree_a) VALUES (?1, ?2, ?3)
       ON CONFLICT (match_id, user_id) DO NOTHING`,
    )
      .bind(ctx.matchId, session.userId, new Date().toISOString())
      .run();
    const apres = await etatReveal(c.env.DB, ctx.matchId, session.userId, ctx.autreId, match?.cree_a ?? new Date().toISOString(), totalMessages);
    return c.json({ ok: true, etat: apres });
  } catch (e) {
    console.error('[messages] reveal failed', e);
    return c.json({ ok: false, error: 'store_unavailable' }, 500);
  }
});

/* ------------------------------------------------------------------ */
/* D-E2-5 — Traduction Workers AI, au BOUTON MANUEL, fail-graceful     */
/* ------------------------------------------------------------------ */
messagesRoutes.post('/rencontres/:matchId/traduire', async (c) => {
  let session: { sessionId: string; userId: string };
  try {
    session = requireAuth(c);
  } catch {
    return nonAutorise(c);
  }
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.messagesTranslateUser, session.userId);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.messagesTranslateUser.scope);

  let corps: unknown;
  try {
    corps = await c.req.json();
  } catch {
    return c.json({ ok: false, error: 'invalid_body' }, 400);
  }
  const messageId = typeof (corps as { messageId?: unknown })?.messageId === 'string' ? (corps as { messageId: string }).messageId : '';
  const vers = (corps as { vers?: unknown })?.vers;
  if (!/^[0-9a-f-]{16,64}$/i.test(messageId) || (vers !== 'fr' && vers !== 'en')) {
    return c.json({ ok: false, error: 'invalid_body' }, 400);
  }

  const ctx = await contexteMatch(c.env.DB, c.req.param('matchId'), session.userId);
  if (!ctx) return c.json({ ok: false, error: 'not_found' }, 404);

  try {
    const message = await c.env.DB.prepare(`SELECT id, de, corps, langue FROM rencontre_messages WHERE id = ?1 AND match_id = ?2 LIMIT 1`)
      .bind(messageId, ctx.matchId)
      .first<{ id: string; de: string; corps: string; langue: string }>();
    if (!message) return c.json({ ok: false, error: 'not_found' }, 404);
    if (message.langue === vers) {
      // Déjà dans la langue demandée : pas d'appel IA, pas de coût.
      return c.json({ ok: true, traduction: message.corps, deja: true });
    }
    if (!c.env.AI) return c.json({ ok: false, error: 'traduction_indisponible' }, 503);

    const reponse = (await c.env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
      messages: [
        { role: 'system', content: 'You are a translation engine. Output ONLY the translation, with no preamble, no quotes, no explanation.' },
        { role: 'user', content: `Translate to ${vers === 'fr' ? 'French' : 'English'}:\n\n${message.corps}` },
      ],
      max_tokens: 512,
    })) as { response?: string };
    const traduction = (reponse?.response ?? '').trim();
    if (traduction.length === 0) return c.json({ ok: false, error: 'traduction_indisponible' }, 503);
    return c.json({ ok: true, traduction });
  } catch (e) {
    console.error('[messages] traduire failed', e);
    return c.json({ ok: false, error: 'traduction_indisponible' }, 503);
  }
});

/* ------------------------------------------------------------------ */
/* D-E2-7 — Blocage silencieux (survit à l'unmatch)                    */
/* ------------------------------------------------------------------ */
messagesRoutes.post('/rencontres/:matchId/blocage', async (c) => {
  let session: { sessionId: string; userId: string };
  try {
    session = requireAuth(c);
  } catch {
    return nonAutorise(c);
  }
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.chatUnmatchUser, session.userId);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.chatUnmatchUser.scope);

  const ctx = await contexteMatch(c.env.DB, c.req.param('matchId'), session.userId);
  if (!ctx) return c.json({ ok: false, error: 'not_found' }, 404);
  try {
    await c.env.DB.prepare(
      `INSERT INTO rencontre_blocages (id, par, contre, cree_a) VALUES (?1, ?2, ?3, ?4)
       ON CONFLICT (par, contre) DO NOTHING`,
    )
      .bind(crypto.randomUUID(), session.userId, ctx.autreId, new Date().toISOString())
      .run();
    // D-E2-7 : messages CONSERVÉS, match conservé, l'autre JAMAIS informé.
    return c.json({ ok: true });
  } catch (e) {
    console.error('[messages] blocage failed', e);
    return c.json({ ok: false, error: 'store_unavailable' }, 500);
  }
});

/* ------------------------------------------------------------------ */
/* D-E2-8 — Unmatch : tout s'efface, les pas reviennent à « retire »    */
/* ------------------------------------------------------------------ */
messagesRoutes.post('/rencontres/:matchId/unmatch', async (c) => {
  let session: { sessionId: string; userId: string };
  try {
    session = requireAuth(c);
  } catch {
    return nonAutorise(c);
  }
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.chatUnmatchUser, session.userId);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.chatUnmatchUser.scope);

  const ctx = await contexteMatch(c.env.DB, c.req.param('matchId'), session.userId);
  if (!ctx) return c.json({ ok: false, error: 'not_found' }, 404);
  try {
    // D-E3-7 — les OBJETS médias partent D'ABORD (R2), puis les tables E3
    // dans le batch : même ordre que la purge RGPD (routes/auth.ts,
    // hardDeleteAccount — « objets R2 d'abord »). MEDIA absent (binding
    // désactivé) : aucun octet n'existe, les lignes D1 partent quand même.
    if (c.env.MEDIA) {
      const cles = await c.env.DB.prepare(
        `SELECT r2_key FROM rencontre_medias WHERE match_id = ?1`,
      )
        .bind(ctx.matchId)
        .all<{ r2_key: string }>();
      for (const k of cles.results ?? []) {
        if (k.r2_key) await c.env.MEDIA.delete(k.r2_key);
      }
    }
    await c.env.DB.batch([
      c.env.DB.prepare(`DELETE FROM rencontre_messages WHERE match_id = ?1`).bind(ctx.matchId),
      c.env.DB.prepare(`DELETE FROM rencontre_lus WHERE match_id = ?1`).bind(ctx.matchId),
      c.env.DB.prepare(`DELETE FROM rencontre_reveals WHERE match_id = ?1`).bind(ctx.matchId),
      // D-E3-7 — les états à deux (voiles, duo, activités croisées, médias)
      // sont purgés avec le reste : unmatch = tout s'efface, des deux côtés.
      // a2_reponses AVANT a2 : la sous-requête lit encore rencontre_a2.
      c.env.DB.prepare(`DELETE FROM rencontre_voiles WHERE match_id = ?1`).bind(ctx.matchId),
      c.env.DB.prepare(`DELETE FROM rencontre_duo WHERE match_id = ?1`).bind(ctx.matchId),
      c.env.DB.prepare(
        `DELETE FROM rencontre_a2_reponses WHERE activite_id IN (SELECT id FROM rencontre_a2 WHERE match_id = ?1)`,
      ).bind(ctx.matchId),
      c.env.DB.prepare(`DELETE FROM rencontre_a2 WHERE match_id = ?1`).bind(ctx.matchId),
      c.env.DB.prepare(`DELETE FROM rencontre_medias WHERE match_id = ?1`).bind(ctx.matchId),
      c.env.DB.prepare(`DELETE FROM rencontre_matchs WHERE id = ?1`).bind(ctx.matchId),
      c.env.DB.prepare(
        `UPDATE rencontre_pas SET statut = 'retire'
         WHERE (de = ?1 AND vers = ?2) OR (de = ?2 AND vers = ?1) AND statut = 'match'`,
      ).bind(session.userId, ctx.autreId),
    ]);
    // Le blocage N'EST PAS touché : il survit à l'unmatch (D-E2-7).
    return c.json({ ok: true });
  } catch (e) {
    console.error('[messages] unmatch failed', e);
    return c.json({ ok: false, error: 'store_unavailable' }, 500);
  }
});

/* ------------------------------------------------------------------ */
/* D-E2-9 — Signalement (motifs fermés, confidentiel)                  */
/* ------------------------------------------------------------------ */
messagesRoutes.post('/rencontres/signalements', async (c) => {
  let session: { sessionId: string; userId: string };
  try {
    session = requireAuth(c);
  } catch {
    return nonAutorise(c);
  }
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.safetyReportUser, session.userId);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.safetyReportUser.scope);

  let corps: unknown;
  try {
    corps = await c.req.json();
  } catch {
    return c.json({ ok: false, error: 'invalid_body' }, 400);
  }
  const signe = typeof (corps as { signe?: unknown })?.signe === 'string' ? (corps as { signe: string }).signe : '';
  const motif = (corps as { motif?: unknown })?.motif;
  const details = typeof (corps as { details?: unknown })?.details === 'string' ? (corps as { details: string }).details.trim().slice(0, DETAILS_MAX) : null;
  const matchId = typeof (corps as { matchId?: unknown })?.matchId === 'string' ? (corps as { matchId: string }).matchId : null;
  if (!/^[0-9a-f-]{16,64}$/i.test(signe) || (matchId !== null && !/^[0-9a-f-]{16,64}$/i.test(matchId))) {
    return c.json({ ok: false, error: 'invalid_body' }, 400);
  }
  if (signe === session.userId || typeof motif !== 'string' || !MOTIFS.includes(motif as Motif)) {
    return c.json({ ok: false, error: 'invalid_body' }, 400);
  }
  try {
    // Aucune vérification d'existence de `signe` : pas d'oracle d'énumération.
    await c.env.DB.prepare(
      `INSERT INTO rencontre_signalements (id, de, contre, motif, detail, match_id, statut, cree_a)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, 'ouvert', ?7)`,
    )
      .bind(crypto.randomUUID(), session.userId, signe, motif, details && details.length > 0 ? details : null, matchId, new Date().toISOString())
      .run();
    return c.json({ ok: true });
  } catch (e) {
    console.error('[messages] signalement failed', e);
    return c.json({ ok: false, error: 'store_unavailable' }, 500);
  }
});

/* ==================================================================== */
/* RENCONTRE-E3 « Le Voyage à Deux » (Task 115) — SPEC v1.1             */
/* Décisions gravées D-E3-1..9 + G-E3-P1..P10 :                          */
/*  - D-E3-1  tout E3 exige un match existant (contexteMatch) ;          */
/*  - D-E3-2  ordre texte → voix → photo : chaque niveau SA porte ;      */
/*  - D-E3-3  la demande se voit, le refus JAMAIS (aucun statut refusé); */
/*  - D-E3-4  jamais une note de la relation ;                           */
/*  - D-E3-5  la récompense, c'est la réponse de l'autre — tout gratuit; */
/*  - D-E3-6  médias privés-paire PAR le Worker (R2, zéro URL publique); */
/*  - D-E3-7  blocage gèle tout E3 ; unmatch purge états + objets R2 ;   */
/*  - D-E3-8  mécanique + pilote de contenu (A2_PILOTE) ;                */
/*  - D-E3-9  RGPD total (purge étendue dans routes/auth.ts).            */
/*  - G-E3-P8 le compteur « fragments » est DÉRIVÉ (COUNT), jamais stocké*/
/* ==================================================================== */

import { A2_MEDIAS, A2_PILOTE } from '@wairyu/shared';
import type { A2Carte } from '@wairyu/shared';

/** Format une carte de quête (D-E3-5 : les réponses FORMATÉES, jamais l'état
 *  brut). Les TEXTES libres du membre deviennent les lignes de la carte (les
 *  mots réels, ordre stable par code) ; les réponses chiffrées partent dans
 *  `valeurs` — le client les met en regard item par item (rendu Likert
 *  local, aucune interprétation ici : ni échelle ni orientation ne sont
 *  connues du Worker). Les clés internes de l'état (terminee, carteId,
 *  termineeA, majA, lectures, schema_version) ne sortent JAMAIS. Max 8
 *  lignes de 300 caractères — c'est une carte, pas une archive. */
function carteDe(etatBrut: string | null): A2Carte | null {
  if (!etatBrut) return null;
  try {
    const etat = JSON.parse(etatBrut) as unknown;
    if (!etat || typeof etat !== 'object' || Array.isArray(etat)) return null;
    const o = etat as Record<string, unknown>;
    const lignes: string[] = [];
    if (o.textes && typeof o.textes === 'object' && !Array.isArray(o.textes)) {
      const entrees = Object.entries(o.textes as Record<string, unknown>)
        .filter(
          ([k, v]) =>
            typeof k === 'string' && k.length > 0 && k.length <= 32 && typeof v === 'string',
        )
        .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
      for (const [, v] of entrees) {
        const t = (v as string).trim();
        if (t.length > 0) lignes.push(t.slice(0, 300));
        if (lignes.length >= 8) break;
      }
    }
    const valeurs: Record<string, number> = {};
    if (o.reponses && typeof o.reponses === 'object' && !Array.isArray(o.reponses)) {
      for (const [k, v] of Object.entries(o.reponses as Record<string, unknown>)) {
        if (
          typeof k === 'string' && k.length > 0 && k.length <= 32 &&
          typeof v === 'number' && Number.isFinite(v)
        ) {
          valeurs[k] = v;
        }
      }
    }
    if (lignes.length === 0 && Object.keys(valeurs).length === 0) return null;
    return { quete: '', lignes, valeurs };
  } catch {
    return null;
  }
}

/** Les statuts « Prêt·e » (quête 1.11 franchie) des deux membres — dérivés
 *  de `reponses` (même dérivation que le jalon A : AUCUN nouveau stockage). */
async function etatPretes(db: D1Database, userId: string, autreId: string) {
  const { results } = await db
    .prepare(
      `SELECT user_id FROM reponses
       WHERE quete = '1.11' AND json_extract(etat, '$.terminee') = 1
         AND user_id IN (?1, ?2)`,
    )
    .bind(userId, autreId)
    .all<{ user_id: string }>();
  const set = new Set((results ?? []).map((r) => r.user_id));
  return { moi: set.has(userId), autre: set.has(autreId) };
}

/** L'état complet des voiles d'une paire (portes + consentements + ouverture). */
async function etatVoiles(
  db: D1Database,
  matchId: string,
  userId: string,
  autreId: string,
  matchCreeA: string,
  totalMessages: number,
) {
  const { results } = await db
    .prepare(`SELECT niveau, user_id FROM rencontre_voiles WHERE match_id = ?1`)
    .bind(matchId)
    .all<{ niveau: number; user_id: string }>();
  const oui = new Set((results ?? []).map((r) => `${r.niveau}:${r.user_id}`));
  type VoileEtat = {
    moi: boolean;
    autre: boolean;
    ouvert: boolean;
    porte: boolean | null;
    seuils?: { messages: number; messagesRequis: number; jours: number; joursRequis: number };
  };
  const construire = (n: number): VoileEtat => ({
    moi: oui.has(`${n}:${userId}`),
    autre: oui.has(`${n}:${autreId}`),
    ouvert: false,
    porte: null,
  });
  const v2 = construire(2);
  v2.ouvert = v2.moi && v2.autre;
  v2.porte = true; // le match suffit (D-E3-1)

  const jours = Math.floor((Date.now() - new Date(matchCreeA).getTime()) / 86_400_000);
  const seuilAtteint = totalMessages >= REVEAL.minMessages && jours >= REVEAL.minDays;
  const v3 = construire(3);
  v3.ouvert = v3.moi && v3.autre;
  // G-E3-P3 : la porte de la voix = niveau 2 ouvert DES DEUX + seuils E2 gravés.
  v3.porte = v2.ouvert && seuilAtteint;
  v3.seuils = {
    messages: totalMessages,
    messagesRequis: REVEAL.minMessages,
    jours,
    joursRequis: REVEAL.minDays,
  };

  const pretes = await etatPretes(db, userId, autreId);
  const v4 = construire(4);
  v4.ouvert = v4.moi && v4.autre;
  // D-E3-5 (D-R2) : la photo exige le Statut Prêt·e DES DEUX — jamais d'argent.
  v4.porte = v3.ouvert && pretes.moi && pretes.autre;
  return { voiles: { cartes: v2, voix: v3, photo: v4 }, pretes };
}

/** Les quêtes complétées par LES DEUX (intersection terminee) — base du Duo. */
async function quetesCroisees(db: D1Database, userId: string, autreId: string): Promise<string[]> {
  const { results } = await db
    .prepare(
      `SELECT r1.quete AS quete FROM reponses r1
       JOIN reponses r2 ON r2.quete = r1.quete AND r2.user_id = ?2
       WHERE r1.user_id = ?1
         AND json_extract(r1.etat, '$.terminee') = 1
         AND json_extract(r2.etat, '$.terminee') = 1
       ORDER BY r1.quete`,
    )
    .bind(userId, autreId)
    .all<{ quete: string }>();
  return (results ?? []).map((r) => r.quete);
}

/** La réponse d'un membre à une quête donnée (lignes formatées, carte). */
async function carteMembre(db: D1Database, userId: string, quete: string): Promise<A2Carte | null> {
  const row = await db
    .prepare(`SELECT etat FROM reponses WHERE user_id = ?1 AND quete = ?2 LIMIT 1`)
    .bind(userId, quete)
    .first<{ etat: string }>();
  const carte = carteDe(row?.etat ?? null);
  return carte ? { quete, lignes: carte.lignes, valeurs: carte.valeurs } : null;
}

/** La question de dialogue du Duo pour une quête (pilote, tournée stable). */
function questionDuoPour(quete: string, lang: 'fr' | 'en'): string {
  const idx = Math.abs(
    [...quete].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) | 0, 7),
  ) % A2_PILOTE.questionsDuo.length;
  const q = A2_PILOTE.questionsDuo[idx] ?? A2_PILOTE.questionsDuo[0];
  return q[lang];
}

/** L'état de l'activité croisée d'une paire (null si jamais commencée). */
async function etatActivite(
  db: D1Database,
  matchId: string,
  userId: string,
  autreId: string,
  lang: 'fr' | 'en',
) {
  const act = await db
    .prepare(`SELECT id, statut FROM rencontre_a2 WHERE match_id = ?1 LIMIT 1`)
    .bind(matchId)
    .first<{ id: string; statut: 'en_cours' | 'devoilee' }>();
  if (!act) return null;
  const { results } = await db
    .prepare(`SELECT user_id, question_id, corps FROM rencontre_a2_reponses WHERE activite_id = ?1`)
    .bind(act.id)
    .all<{ user_id: string; question_id: string; corps: string }>();
  const par = new Map<string, Map<string, string>>();
  for (const r of results ?? []) {
    if (!par.has(r.user_id)) par.set(r.user_id, new Map());
    par.get(r.user_id)!.set(r.question_id, r.corps);
  }
  const mes = par.get(userId) ?? new Map();
  const siens = par.get(autreId) ?? new Map();
  const completeMoi = A2_PILOTE.questionsCroisees.every((q) => mes.has(q.id));
  const completeAutre = A2_PILOTE.questionsCroisees.every((q) => siens.has(q.id));
  const devoilee = act.statut === 'devoilee' || (completeMoi && completeAutre);
  return {
    id: act.id,
    statut: devoilee ? ('devoilee' as const) : ('en_cours' as const),
    questions: A2_PILOTE.questionsCroisees.map((q) => ({
      id: q.id,
      texte: q[lang],
      maReponse: devoilee || mes.has(q.id) ? (mes.get(q.id) ?? null) : null,
      reponseAutre: devoilee ? (siens.get(q.id) ?? null) : null,
    })),
    completeMoi,
    completeAutre,
  };
}

/** Le Rendez-vous préparé (G-E3-P6 : règles locales TRANSPARENTES, pas d'IA).
 *  Dérivé des réponses croisées q3 (le temps libre imaginé par chacun).
 *  Localisé FR/EN — le pilote porte ses deux langues (A2_PILOTE). */
function deriverRdv(
  activite: NonNullable<Awaited<ReturnType<typeof etatActivite>>> | null,
  lang: 'fr' | 'en',
): { idees: { titre: string; pourquoi: string }[]; question: string } | null {
  if (!activite || activite.statut !== 'devoilee') return null;
  const q3Moi = activite.questions.find((q) => q.id === 'q3')?.maReponse ?? null;
  const q3Autre = activite.questions.find((q) => q.id === 'q3')?.reponseAutre ?? null;
  const extrait = (s: string | null) => (s && s.length > 0 ? `« ${s.slice(0, 80)} »` : '…');
  return {
    idees: A2_PILOTE.ideesRdv.map((i) => ({
      titre: lang === 'en' ? i.en : i.fr,
      pourquoi:
        (lang === 'en' ? i.pourquoiEn : i.pourquoiFr) +
        (lang === 'en'
          ? ` — your idea: ${extrait(q3Moi)} · their idea: ${extrait(q3Autre)}`
          : ` — ton idée : ${extrait(q3Moi)} · la sienne : ${extrait(q3Autre)}`),
    })),
    question:
      lang === 'en'
        ? 'One picks the place, the other picks the time.'
        : 'Qui choisit le lieu ? L’autre choisit l’heure.',
  };
}

const VOIX_MIMES = ['audio/webm', 'audio/mp4', 'audio/aac', 'audio/ogg', 'audio/mpeg'] as const;
const PHOTO_MIMES = ['image/jpeg', 'image/png', 'image/webp'] as const;

/* ------------------------------------------------------------------ */
/* E3 — L'état complet du Voyage à Deux (une requête, tout dérivé)     */
/* ------------------------------------------------------------------ */
messagesRoutes.get('/rencontres/:matchId/a2/etat', async (c) => {
  let session: { sessionId: string; userId: string };
  try {
    session = requireAuth(c);
  } catch {
    return nonAutorise(c);
  }
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.a2VoileUser, session.userId);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.a2VoileUser.scope);

  const ctx = await contexteMatch(c.env.DB, c.req.param('matchId'), session.userId);
  if (!ctx) return c.json({ ok: false, error: 'not_found' }, 404);
  if (ctx.bloque) return c.json({ ok: false, error: 'not_found' }, 404); // D-E3-7 : le blocage gèle tout E3

  const lang = c.req.query('lang') === 'en' ? 'en' : ('fr' as 'fr' | 'en');
  try {
    const match = await c.env.DB.prepare(`SELECT cree_a FROM rencontre_matchs WHERE id = ?1`)
      .bind(ctx.matchId)
      .first<{ cree_a: string }>();
    const total = await c.env.DB.prepare(`SELECT COUNT(*) AS n FROM rencontre_messages WHERE match_id = ?1`)
      .bind(ctx.matchId)
      .first<{ n: number }>();
    const { voiles, pretes } = await etatVoiles(
      c.env.DB, ctx.matchId, session.userId, ctx.autreId,
      match?.cree_a ?? new Date().toISOString(), total?.n ?? 0,
    );

    // ---- Le Duo (volet A) : intersection + consentements + cartes ----
    const croisees = await quetesCroisees(c.env.DB, session.userId, ctx.autreId);
    const { results: consents } = await c.env.DB.prepare(
      `SELECT quete, user_id FROM rencontre_duo WHERE match_id = ?1`,
    )
      .bind(ctx.matchId)
      .all<{ quete: string; user_id: string }>();
    const duoOui = new Set((consents ?? []).map((r) => `${r.quete}:${r.user_id}`));
    const duo: {
      quete: string; consentMoi: boolean; consentAutre: boolean; ouvert: boolean;
      carteMoi: A2Carte | null; carteAutre: A2Carte | null; question: string | null;
    }[] = [];
    for (const quete of croisees) {
      const consentMoi = duoOui.has(`${quete}:${session.userId}`);
      const consentAutre = duoOui.has(`${quete}:${ctx.autreId}`);
      const ouvert = consentMoi && consentAutre;
      duo.push({
        quete,
        consentMoi,
        consentAutre,
        ouvert,
        carteMoi: ouvert ? await carteMembre(c.env.DB, session.userId, quete) : null,
        carteAutre: ouvert ? await carteMembre(c.env.DB, ctx.autreId, quete) : null,
        question: ouvert ? questionDuoPour(quete, lang) : null,
      });
    }

    // ---- Les récoltes à deux (volet C) ----
    const activite = await etatActivite(c.env.DB, ctx.matchId, session.userId, ctx.autreId, lang);
    const rdv = deriverRdv(activite, lang);
    const duoOuverts = duo.filter((d) => d.ouvert).length;
    const fragments = duoOuverts + (activite?.statut === 'devoilee' ? 1 : 0);

    // ---- Les médias (volet B) ----
    const { results: medias } = await c.env.DB.prepare(
      `SELECT id, user_id, type, duree_s, octets, cree_a FROM rencontre_medias
       WHERE match_id = ?1 ORDER BY cree_a DESC LIMIT 100`,
    )
      .bind(ctx.matchId)
      .all<{ id: string; user_id: string; type: 'voix' | 'photo'; duree_s: number | null; octets: number; cree_a: string }>();
    const tous = (medias ?? []).map((m) => ({
      id: m.id, type: m.type, dureeS: m.duree_s, octets: m.octets, creeA: m.cree_a,
      deMoi: m.user_id === session.userId,
    }));
    const photoMoi = tous.find((m) => m.type === 'photo' && m.deMoi) ?? null;
    const photoAutre = tous.find((m) => m.type === 'photo' && !m.deMoi) ?? null;

    return c.json({
      ok: true,
      voiles,
      pretes,
      duo,
      activite,
      rdv,
      fragments,
      mediaPhoto: { moi: photoMoi, autre: photoAutre },
      voix: tous.filter((m) => m.type === 'voix').slice(0, 50),
    });
  } catch (e) {
    console.error('[a2] etat failed', e);
    return c.json({ ok: false, error: 'store_unavailable' }, 500);
  }
});

/* ------------------------------------------------------------------ */
/* E3 — Lever un voile (niveaux 2/3/4) : la demande se voit, le refus   */
/*      jamais (D-E3-3) — deux lignes = ouvert.                         */
/* ------------------------------------------------------------------ */
messagesRoutes.post('/rencontres/:matchId/voile', async (c) => {
  let session: { sessionId: string; userId: string };
  try {
    session = requireAuth(c);
  } catch {
    return nonAutorise(c);
  }
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.a2VoileUser, session.userId);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.a2VoileUser.scope);

  let corps: unknown;
  try {
    corps = await c.req.json();
  } catch {
    return c.json({ ok: false, error: 'invalid_body' }, 400);
  }
  const niveau = (corps as { niveau?: unknown })?.niveau;
  if (niveau !== 2 && niveau !== 3 && niveau !== 4) {
    return c.json({ ok: false, error: 'invalid_body' }, 400);
  }

  const ctx = await contexteMatch(c.env.DB, c.req.param('matchId'), session.userId);
  if (!ctx) return c.json({ ok: false, error: 'not_found' }, 404);
  if (ctx.bloque) return c.json({ ok: false, error: 'not_found' }, 404); // D-E3-7

  try {
    const match = await c.env.DB.prepare(`SELECT cree_a FROM rencontre_matchs WHERE id = ?1`)
      .bind(ctx.matchId)
      .first<{ cree_a: string }>();
    const total = await c.env.DB.prepare(`SELECT COUNT(*) AS n FROM rencontre_messages WHERE match_id = ?1`)
      .bind(ctx.matchId)
      .first<{ n: number }>();
    const { voiles } = await etatVoiles(
      c.env.DB, ctx.matchId, session.userId, ctx.autreId,
      match?.cree_a ?? new Date().toISOString(), total?.n ?? 0,
    );
    const etatNiveau = niveau === 2 ? voiles.cartes : niveau === 3 ? voiles.voix : voiles.photo;
    if (etatNiveau.ouvert) return c.json({ ok: true, deja: true });
    if (etatNiveau.porte === false) {
      return c.json({ ok: false, error: 'voile_porte', voiles }, 403);
    }
    await c.env.DB.prepare(
      `INSERT INTO rencontre_voiles (id, match_id, niveau, user_id, cree_a)
       VALUES (?1, ?2, ?3, ?4, ?5) ON CONFLICT (match_id, niveau, user_id) DO NOTHING`,
    )
      .bind(crypto.randomUUID(), ctx.matchId, niveau, session.userId, new Date().toISOString())
      .run();
    return c.json({ ok: true });
  } catch (e) {
    console.error('[a2] voile failed', e);
    return c.json({ ok: false, error: 'store_unavailable' }, 500);
  }
});

/* ------------------------------------------------------------------ */
/* E3 — Le Duo : consentir « mettre en regard » (par quête)             */
/* ------------------------------------------------------------------ */
messagesRoutes.post('/rencontres/:matchId/duo/:quete', async (c) => {
  let session: { sessionId: string; userId: string };
  try {
    session = requireAuth(c);
  } catch {
    return nonAutorise(c);
  }
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.a2DuoUser, session.userId);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.a2DuoUser.scope);

  const quete = c.req.param('quete');
  if (!/^[1-5]\.\d{1,2}$/.test(quete)) return c.json({ ok: false, error: 'invalid_body' }, 400);
  const ctx = await contexteMatch(c.env.DB, c.req.param('matchId'), session.userId);
  if (!ctx) return c.json({ ok: false, error: 'not_found' }, 404);
  if (ctx.bloque) return c.json({ ok: false, error: 'not_found' }, 404);

  try {
    // La quête doit être complétée par LES DEUX (l'intersection est la porte).
    const croisees = await quetesCroisees(c.env.DB, session.userId, ctx.autreId);
    if (!croisees.includes(quete)) return c.json({ ok: false, error: 'duo_indisponible' }, 403);

    await c.env.DB.prepare(
      `INSERT INTO rencontre_duo (id, match_id, quete, user_id, cree_a)
       VALUES (?1, ?2, ?3, ?4, ?5) ON CONFLICT (match_id, quete, user_id) DO NOTHING`,
    )
      .bind(crypto.randomUUID(), ctx.matchId, quete, session.userId, new Date().toISOString())
      .run();
    const { results } = await c.env.DB.prepare(
      `SELECT user_id FROM rencontre_duo WHERE match_id = ?1 AND quete = ?2`,
    )
      .bind(ctx.matchId, quete)
      .all<{ user_id: string }>();
    const oui = new Set((results ?? []).map((r) => r.user_id));
    const estOuvert = oui.has(session.userId) && oui.has(ctx.autreId);
    return c.json({
      ok: true,
      ouvert: estOuvert,
      carteMoi: estOuvert ? await carteMembre(c.env.DB, session.userId, quete) : null,
      carteAutre: estOuvert ? await carteMembre(c.env.DB, ctx.autreId, quete) : null,
      question: estOuvert ? questionDuoPour(quete, 'fr') : null,
    });
  } catch (e) {
    console.error('[a2] duo failed', e);
    return c.json({ ok: false, error: 'store_unavailable' }, 500);
  }
});

/* ------------------------------------------------------------------ */
/* E3 — L'activité « Trois questions croisées » : créer + répondre      */
/*      (répondre = consentir ; le dévoilement est STRUCTUREL).          */
/* ------------------------------------------------------------------ */
messagesRoutes.post('/rencontres/:matchId/a2/activites', async (c) => {
  let session: { sessionId: string; userId: string };
  try {
    session = requireAuth(c);
  } catch {
    return nonAutorise(c);
  }
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.a2ActiviteUser, session.userId);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.a2ActiviteUser.scope);

  const ctx = await contexteMatch(c.env.DB, c.req.param('matchId'), session.userId);
  if (!ctx) return c.json({ ok: false, error: 'not_found' }, 404);
  if (ctx.bloque) return c.json({ ok: false, error: 'not_found' }, 404);
  try {
    const existante = await c.env.DB.prepare(`SELECT id FROM rencontre_a2 WHERE match_id = ?1 LIMIT 1`)
      .bind(ctx.matchId)
      .first<{ id: string }>();
    if (existante) return c.json({ ok: true, id: existante.id, deja: true });
    const id = crypto.randomUUID();
    await c.env.DB.prepare(
      `INSERT INTO rencontre_a2 (id, match_id, titre, statut, cree_a)
       VALUES (?1, ?2, 'trois_questions', 'en_cours', ?3)`,
    )
      .bind(id, ctx.matchId, new Date().toISOString())
      .run();
    return c.json({ ok: true, id });
  } catch (e) {
    console.error('[a2] activite create failed', e);
    return c.json({ ok: false, error: 'store_unavailable' }, 500);
  }
});

messagesRoutes.post('/rencontres/:matchId/a2/activites/:id/repondre', async (c) => {
  let session: { sessionId: string; userId: string };
  try {
    session = requireAuth(c);
  } catch {
    return nonAutorise(c);
  }
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.a2ActiviteUser, session.userId);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.a2ActiviteUser.scope);

  const activiteId = c.req.param('id');
  if (!/^[0-9a-f-]{16,64}$/i.test(activiteId)) return c.json({ ok: false, error: 'invalid_body' }, 400);
  const ctx = await contexteMatch(c.env.DB, c.req.param('matchId'), session.userId);
  if (!ctx) return c.json({ ok: false, error: 'not_found' }, 404);
  if (ctx.bloque) return c.json({ ok: false, error: 'not_found' }, 404);

  let corps: unknown;
  try {
    corps = await c.req.json();
  } catch {
    return c.json({ ok: false, error: 'invalid_body' }, 400);
  }
  const reps = (corps as { reponses?: Record<string, unknown> })?.reponses;
  if (!reps || typeof reps !== 'object') return c.json({ ok: false, error: 'invalid_body' }, 400);
  const propes: { id: string; corps: string }[] = [];
  for (const q of A2_PILOTE.questionsCroisees) {
    const v = reps[q.id];
    if (typeof v !== 'string' || v.trim().length === 0 || v.length > 1000) {
      return c.json({ ok: false, error: 'invalid_body' }, 400); // les TROIS, complètes
    }
    propes.push({ id: q.id, corps: v.trim() });
  }

  try {
    const act = await c.env.DB.prepare(
      `SELECT id FROM rencontre_a2 WHERE id = ?1 AND match_id = ?2 LIMIT 1`,
    )
      .bind(activiteId, ctx.matchId)
      .first<{ id: string }>();
    if (!act) return c.json({ ok: false, error: 'not_found' }, 404);
    const now = new Date().toISOString();
    for (const r of propes) {
      await c.env.DB.prepare(
        `INSERT INTO rencontre_a2_reponses (id, activite_id, user_id, question_id, corps, cree_a)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6)
         ON CONFLICT (activite_id, user_id, question_id)
         DO UPDATE SET corps = excluded.corps`,
      )
        .bind(crypto.randomUUID(), activiteId, session.userId, r.id, r.corps, now)
        .run();
    }
    // Le dévoilement STRUCTUREL : les deux × trois réponses présentes.
    const compte = await c.env.DB.prepare(
      `SELECT COUNT(DISTINCT user_id) AS u, COUNT(*) AS n
       FROM rencontre_a2_reponses WHERE activite_id = ?1`,
    )
      .bind(activiteId)
      .first<{ u: number; n: number }>();
    if (compte && compte.u >= 2 && compte.n >= 6) {
      await c.env.DB.prepare(
        `UPDATE rencontre_a2 SET statut = 'devoilee', devoilee_a = ?2
         WHERE id = ?1 AND statut = 'en_cours'`,
      )
        .bind(activiteId, now)
        .run();
    }
    return c.json({ ok: true });
  } catch (e) {
    console.error('[a2] repondre failed', e);
    return c.json({ ok: false, error: 'store_unavailable' }, 500);
  }
});

/* ------------------------------------------------------------------ */
/* E3 — Les médias privés-paire (G-E3-P2 : PAR le Worker, R2 natif)     */
/* ------------------------------------------------------------------ */
messagesRoutes.post('/rencontres/:matchId/media', async (c) => {
  let session: { sessionId: string; userId: string };
  try {
    session = requireAuth(c);
  } catch {
    return nonAutorise(c);
  }
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.a2MediaPutUser, session.userId);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.a2MediaPutUser.scope);
  if (!c.env.MEDIA) return c.json({ ok: false, error: 'media_indisponible' }, 503);

  const ctx = await contexteMatch(c.env.DB, c.req.param('matchId'), session.userId);
  if (!ctx) return c.json({ ok: false, error: 'not_found' }, 404);
  if (ctx.bloque) return c.json({ ok: false, error: 'not_found' }, 404);

  let forme: FormData;
  try {
    forme = await c.req.formData();
  } catch {
    return c.json({ ok: false, error: 'invalid_body' }, 400);
  }
  const type = String(forme.get('type') ?? '');
  const fichier: unknown = forme.get('file');
  const dureeSBrut = Number(forme.get('dureeS') ?? 0);
  if ((type !== 'voix' && type !== 'photo') || !(fichier instanceof File)) {
    return c.json({ ok: false, error: 'invalid_body' }, 400);
  }
  const mime = (fichier.type || '').toLowerCase();
  if (type === 'voix') {
    if (!VOIX_MIMES.some((m) => mime.startsWith(m))) return c.json({ ok: false, error: 'type_refuse' }, 415);
    if (fichier.size > A2_MEDIAS.voixMaxOctets) return c.json({ ok: false, error: 'trop_lourd' }, 413);
    if (!Number.isFinite(dureeSBrut) || dureeSBrut < 1 || dureeSBrut > A2_MEDIAS.voixMaxSecondes) {
      return c.json({ ok: false, error: 'trop_long' }, 413);
    }
  } else {
    if (!PHOTO_MIMES.some((m) => mime.startsWith(m))) return c.json({ ok: false, error: 'type_refuse' }, 415);
    if (fichier.size > A2_MEDIAS.photoMaxOctets) return c.json({ ok: false, error: 'trop_lourd' }, 413);
  }

  try {
    // La PORTE du niveau (D-E3-2) : voix exige le voile 3 ouvert, photo le 4.
    const match = await c.env.DB.prepare(`SELECT cree_a FROM rencontre_matchs WHERE id = ?1`)
      .bind(ctx.matchId)
      .first<{ cree_a: string }>();
    const total = await c.env.DB.prepare(`SELECT COUNT(*) AS n FROM rencontre_messages WHERE match_id = ?1`)
      .bind(ctx.matchId)
      .first<{ n: number }>();
    const { voiles } = await etatVoiles(
      c.env.DB, ctx.matchId, session.userId, ctx.autreId,
      match?.cree_a ?? new Date().toISOString(), total?.n ?? 0,
    );
    const requis = type === 'voix' ? voiles.voix.ouvert : voiles.photo.ouvert;
    if (!requis) return c.json({ ok: false, error: 'voile_ferme' }, 403);

    // La photo : UNE active par membre — l'ancienne est purgée (R2 + ligne).
    if (type === 'photo') {
      const anciennes = await c.env.DB.prepare(
        `SELECT id, r2_key FROM rencontre_medias WHERE match_id = ?1 AND user_id = ?2 AND type = 'photo'`,
      )
        .bind(ctx.matchId, session.userId)
        .all<{ id: string; r2_key: string }>();
      for (const a of anciennes.results ?? []) {
        await c.env.MEDIA!.delete(a.r2_key);
        await c.env.DB.prepare(`DELETE FROM rencontre_medias WHERE id = ?1`).bind(a.id).run();
      }
    }

    const id = crypto.randomUUID();
    const cle = `media/a2/${ctx.matchId}/${id}`;
    const octets = await c.env.MEDIA.put(cle, fichier, { httpMetadata: { contentType: mime } });
    if (!octets) return c.json({ ok: false, error: 'media_indisponible' }, 503);
    await c.env.DB.prepare(
      `INSERT INTO rencontre_medias (id, match_id, user_id, type, r2_key, duree_s, octets, mime, cree_a)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)`,
    )
      .bind(id, ctx.matchId, session.userId, type, cle,
        type === 'voix' ? Math.trunc(dureeSBrut) : null, fichier.size, mime, new Date().toISOString())
      .run();
    return c.json({
      ok: true,
      media: { id, type, dureeS: type === 'voix' ? Math.trunc(dureeSBrut) : null, octets: fichier.size, creeA: new Date().toISOString(), deMoi: true },
    });
  } catch (e) {
    console.error('[a2] media put failed', e);
    return c.json({ ok: false, error: 'store_unavailable' }, 500);
  }
});

messagesRoutes.get('/rencontres/:matchId/media/:id', async (c) => {
  let session: { sessionId: string; userId: string };
  try {
    session = requireAuth(c);
  } catch {
    return nonAutorise(c);
  }
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.a2MediaGetUser, session.userId);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.a2MediaGetUser.scope);
  if (!c.env.MEDIA) return c.json({ ok: false, error: 'media_indisponible' }, 503);

  const ctx = await contexteMatch(c.env.DB, c.req.param('matchId'), session.userId);
  if (!ctx) return c.json({ ok: false, error: 'not_found' }, 404);
  if (ctx.bloque) return c.json({ ok: false, error: 'not_found' }, 404); // D-E3-7
  const mediaId = c.req.param('id');
  if (!/^[0-9a-f-]{16,64}$/i.test(mediaId)) return c.json({ ok: false, error: 'invalid_body' }, 400);

  try {
    const meta = await c.env.DB.prepare(
      `SELECT type, r2_key, mime FROM rencontre_medias WHERE id = ?1 AND match_id = ?2 LIMIT 1`,
    )
      .bind(mediaId, ctx.matchId)
      .first<{ type: 'voix' | 'photo'; r2_key: string; mime: string }>();
    if (!meta) return c.json({ ok: false, error: 'not_found' }, 404);
    // Le voile du niveau doit être OUVERT DES DEUX pour TOUTE lecture (D-E3-6).
    const match = await c.env.DB.prepare(`SELECT cree_a FROM rencontre_matchs WHERE id = ?1`)
      .bind(ctx.matchId)
      .first<{ cree_a: string }>();
    const total = await c.env.DB.prepare(`SELECT COUNT(*) AS n FROM rencontre_messages WHERE match_id = ?1`)
      .bind(ctx.matchId)
      .first<{ n: number }>();
    const { voiles } = await etatVoiles(
      c.env.DB, ctx.matchId, session.userId, ctx.autreId,
      match?.cree_a ?? new Date().toISOString(), total?.n ?? 0,
    );
    const ouvert = meta.type === 'voix' ? voiles.voix.ouvert : voiles.photo.ouvert;
    if (!ouvert) return c.json({ ok: false, error: 'voile_ferme' }, 403);

    const objet = await c.env.MEDIA.get(meta.r2_key);
    if (!objet) return c.json({ ok: false, error: 'not_found' }, 404);
    const entetes = new Headers();
    entetes.set('content-type', meta.mime || objet.httpMetadata?.contentType || 'application/octet-stream');
    entetes.set('cache-control', 'private, no-store');
    entetes.set('content-length', String(objet.size));
    return new Response(objet.body, { headers: entetes });
  } catch (e) {
    console.error('[a2] media get failed', e);
    return c.json({ ok: false, error: 'store_unavailable' }, 500);
  }
});

messagesRoutes.delete('/rencontres/:matchId/media/:id', async (c) => {
  let session: { sessionId: string; userId: string };
  try {
    session = requireAuth(c);
  } catch {
    return nonAutorise(c);
  }
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.a2MediaPutUser, session.userId);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.a2MediaPutUser.scope);
  if (!c.env.MEDIA) return c.json({ ok: false, error: 'media_indisponible' }, 503);

  const ctx = await contexteMatch(c.env.DB, c.req.param('matchId'), session.userId);
  if (!ctx) return c.json({ ok: false, error: 'not_found' }, 404);
  const mediaId = c.req.param('id');
  if (!/^[0-9a-f-]{16,64}$/i.test(mediaId)) return c.json({ ok: false, error: 'invalid_body' }, 400);

  try {
    // L'auteur seul supprime SON média — purge R2 IMMÉDIATE (P4).
    const meta = await c.env.DB.prepare(
      `SELECT id, user_id, r2_key FROM rencontre_medias WHERE id = ?1 AND match_id = ?2 LIMIT 1`,
    )
      .bind(mediaId, ctx.matchId)
      .first<{ id: string; user_id: string; r2_key: string }>();
    if (!meta || meta.user_id !== session.userId) return c.json({ ok: false, error: 'not_found' }, 404);
    await c.env.MEDIA.delete(meta.r2_key);
    await c.env.DB.prepare(`DELETE FROM rencontre_medias WHERE id = ?1`).bind(meta.id).run();
    return c.json({ ok: true });
  } catch (e) {
    console.error('[a2] media delete failed', e);
    return c.json({ ok: false, error: 'store_unavailable' }, 500);
  }
});

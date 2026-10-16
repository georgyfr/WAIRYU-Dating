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
 *  - D-E2-8  unmatch : casse le match, purge messages/lus/reveals, remet
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
    const message = await c.env.DB.prepare(`SELECT id, de, corps, lang FROM rencontre_messages WHERE id = ?1 AND match_id = ?2 LIMIT 1`)
      .bind(messageId, ctx.matchId)
      .first<{ id: string; de: string; corps: string; lang: string }>();
    if (!message) return c.json({ ok: false, error: 'not_found' }, 404);
    if (message.lang === vers) {
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
    await c.env.DB.batch([
      c.env.DB.prepare(`DELETE FROM rencontre_messages WHERE match_id = ?1`).bind(ctx.matchId),
      c.env.DB.prepare(`DELETE FROM rencontre_lus WHERE match_id = ?1`).bind(ctx.matchId),
      c.env.DB.prepare(`DELETE FROM rencontre_reveals WHERE match_id = ?1`).bind(ctx.matchId),
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

/**
 * Durable Object ChatRoom — RENCONTRE-E2 (Task 107, reconstitution E2).
 *
 * UNE conversation = UNE instance (idFromName(matchId)). Rôle UNIQUEMENT
 * temps réel : le DO ne stocke RIEN durablement — la source de vérité des
 * messages est D1 (rencontre_messages). Le DO :
 *  1. accepte les WebSocket (hibernation API — coût nul à l'arrêt) ;
 *  2. re-vérifie CHAQUE envoi contre D1 (le membre est-il toujours du
 *     match ? un blocage existe-t-il ?) — le DO ne fait JAMAIS confiance
 *     aux seuls en-têtes posés par le worker ;
 *  3. applique l'anti-spam (chatSendUser, compteur D1 partagé avec le
 *     fallback REST) ;
 *  4. insère le message en D1 puis le diffuse aux DEUX connectés (l'écho
 *     sert de confirmation serveur à l'expéditeur).
 *
 * Le worker (/rencontres/:matchId/ws) authentifie la session, vérifie le
 * membership et le blocage AVANT de transmettre l'upgrade au DO — le DO
 * re-checke à chaque send (fail-safe : un DO n'est jamais la seule barrière).
 */
import type { Env } from '../env';
import { errorBody } from '../lib/errors';
import { RATE_RULES, hitRateLimit } from '../lib/ratelimit';

const CORPS_MAX = 2000;

export class ChatRoom implements DurableObject {
  constructor(
    private readonly state: DurableObjectState,
    private readonly env: Env,
  ) {}

  /** L'upgrade WebSocket arrive ICI, déjà authentifié par le worker. */
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // POST /notify : le fallback REST a déjà inséré en D1 — le DO ne fait que
    // DIFFUSER aux WebSocket connectés (jamais d'insert ici, jamais de double).
    if (request.method === 'POST' && url.pathname === '/notify') {
      try {
        const body = (await request.json()) as { message?: { id: string; matchId: string; de: string; corps: string; lang: string; creeA: string } };
        if (body.message) {
          const diffusion = JSON.stringify({ type: 'message', ...body.message });
          for (const client of this.state.getWebSockets()) {
            try {
              client.send(diffusion);
            } catch {
              /* socket mourante */
            }
          }
        }
      } catch {
        /* corps invalide : rien à diffuser */
      }
      return new Response('{"ok":true}', { headers: { 'content-type': 'application/json' } });
    }

    if (request.headers.get('Upgrade') === 'websocket') {
      const userId = request.headers.get('x-wairyu-user');
      const matchId = url.searchParams.get('match');
      if (!userId || !matchId) {
        return new Response(JSON.stringify(errorBody('unauthorized', 'Connexion non authentifiée.', 'do-ws')), {
          status: 401,
          headers: { 'content-type': 'application/json; charset=utf-8' },
        });
      }
      const pair = new WebSocketPair();
      // Tag = userId : permet ciblage/suppression ciblée sans table mémoire.
      this.state.acceptWebSocket(pair[1], [userId]);
      pair[1].send(JSON.stringify({ type: 'ouvert', matchId }));
      return new Response(null, { status: 101, webSocket: pair[0] });
    }

    return new Response(
      JSON.stringify(errorBody('not_found', 'ChatRoom : WebSocket attendu.', 'do-fetch')),
      { status: 404, headers: { 'content-type': 'application/json; charset=utf-8' } },
    );
  }

  /** Message client → vérifications D1 → INSERT → diffusion aux deux. */
  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer): Promise<void> {
    if (typeof message !== 'string') {
      ws.send(JSON.stringify({ type: 'erreur', code: 'invalid_body' }));
      return;
    }
    const [userId] = this.state.getTags(ws);
    if (!userId) {
      ws.send(JSON.stringify({ type: 'erreur', code: 'unauthorized' }));
      return;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(message);
    } catch {
      ws.send(JSON.stringify({ type: 'erreur', code: 'invalid_body' }));
      return;
    }
    const corps = (parsed as { corps?: unknown } | null)?.corps;
    const langBrut = (parsed as { lang?: unknown } | null)?.lang;
    if (typeof corps !== 'string') {
      ws.send(JSON.stringify({ type: 'erreur', code: 'invalid_body' }));
      return;
    }
    const texte = corps.trim();
    if (texte.length === 0 || texte.length > CORPS_MAX) {
      ws.send(JSON.stringify({ type: 'erreur', code: 'invalid_body' }));
      return;
    }
    const lang = langBrut === 'en' ? 'en' : 'fr';

    // Anti-spam : la MÊME règle que le fallback REST (compteur D1 partagé).
    const rl = await hitRateLimit(this.env.DB, RATE_RULES.chatSendUser, userId);
    if (!rl.allowed) {
      ws.send(JSON.stringify({ type: 'erreur', code: 'rate_limited', retry: rl.retryAfterSeconds }));
      return;
    }

    // Le DO est nommé par matchId — re-validation D1 complète (fail-safe).
    const matchId = this.state.id.name;
    try {
      const match = await this.env.DB.prepare(`SELECT id, a, b FROM rencontre_matchs WHERE id = ?1 LIMIT 1`)
        .bind(matchId)
        .first<{ id: string; a: string; b: string }>();
      if (!match || (match.a !== userId && match.b !== userId)) {
        ws.send(JSON.stringify({ type: 'erreur', code: 'not_found' }));
        return;
      }
      // Blocage (un des deux sens) → envoi refusé, silencieux pour l'autre.
      const bloq = await this.env.DB.prepare(
        `SELECT 1 AS ok FROM rencontre_blocages WHERE (par = ?1 AND contre = ?2) OR (par = ?2 AND contre = ?1) LIMIT 1`,
      )
        .bind(match.a, match.b)
        .first<{ ok: number }>();
      if (bloq) {
        // D-E2-7 — WS NEUTRE (correctif audit) : comme le fallback REST
        // ({ok:true, silencieux:true}), le DO répond RIEN — ni erreur ni
        // écho. Un code « blocage » explicite permettrait au bloqué de
        // déduire le blocage d'une erreur, ce que la spécification interdit.
        return;
      }

      const id = crypto.randomUUID();
      const creeA = new Date().toISOString();
      await this.env.DB.prepare(
        `INSERT INTO rencontre_messages (id, match_id, de, corps, langue, cree_a) VALUES (?1, ?2, ?3, ?4, ?5, ?6)`,
      ).bind(id, matchId, userId, texte, lang, creeA).run();

      const diffusion = JSON.stringify({
        type: 'message',
        id,
        matchId,
        de: userId,
        corps: texte,
        lang,
        creeA,
      });
      for (const client of this.state.getWebSockets()) {
        try {
          client.send(diffusion);
        } catch {
          /* socket mourante — hibernation la purge seule */
        }
      }
    } catch (e) {
      console.error('[ChatRoom] send failed', e);
      ws.send(JSON.stringify({ type: 'erreur', code: 'internal' }));
    }
  }

  /** Fermeture : rien à faire — l'hibernation purge seule. */
  async webSocketClose(ws: WebSocket): Promise<void> {
    try {
      ws.close(1000, 'au revoir');
    } catch {
      /* déjà fermée */
    }
  }

  async alarm(): Promise<void> {
    /* réservé : purge/relances futures */
  }
}

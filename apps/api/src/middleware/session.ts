/**
 * Middleware de session (Étape 1 — vérification seule ; la CRÉATION arrive
 * avec lib/auth.ts à l'Étape 2). Lit le cookie signé, vérifie en D1
 * (révocation, expiry, statut du compte), prolonge glissant (30 j plafonné
 * 29 j, au plus 1 écriture/heure), expose c.get('session').
 */
import type { Context, Next } from 'hono';
import type { AppEnv } from '../env';
import { SESSION_COOKIE_NAME, verifySessionCookie } from '../lib/session';
import { getCookie } from 'hono/cookie';

export async function sessionMiddleware(c: Context<AppEnv>, next: Next) {
  c.set('session', null);
  c.set('sessionRenewed', false);

  const raw = getCookie(c, SESSION_COOKIE_NAME);
  const signed = await verifySessionCookie(raw, c.env.SESSION_HMAC_KEY);
  if (signed) {
    const row = await c.env.DB.prepare(
      `SELECT s.user_id, s.revoked_at, s.expires_at, u.status AS user_status
       FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.id = ? LIMIT 1`,
    )
      .bind(signed.sid)
      .first<{
        user_id: string;
        revoked_at: number | null;
        expires_at: number;
        user_status: string;
      }>();

    if (row && !row.revoked_at && row.expires_at > Date.now() / 1000) {
      // Compte supprimé/banni → session morte immédiatement.
      if (row.user_status !== 'banned' && row.user_status !== 'deleted') {
        c.set('session', { sessionId: signed.sid, userId: row.user_id });

        // TTL glissant : si moins de 7 jours restants, prolonge à now+29 j,
        // au plus 1 écriture/heure par session (last_seen_at comme garde).
        const now = Math.floor(Date.now() / 1000);
        if (row.expires_at - now < 7 * 86400) {
          try {
            await c.env.DB.prepare(
              `UPDATE sessions SET expires_at = ?, last_seen_at = ?
               WHERE id = ? AND last_seen_at < ?`,
            )
              .bind(now + 29 * 86400, now, signed.sid, now - 3600)
              .run();
            c.set('sessionRenewed', true);
          } catch {
            // La prolongation ne doit jamais bloquer une requête valide.
          }
        }
      }
    }
  }
  await next();
}

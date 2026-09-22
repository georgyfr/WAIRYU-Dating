/**
 * Middleware de session (Étape 2) : lit le cookie signé, vérifie en D1
 * (révocation, expiry, statut du compte), prolonge glissant (30 j),
 * expose c.get('session').
 */
import type { Context, Next } from 'hono';
import type { AppEnv } from '../env';
import { SESSION_COOKIE_NAME, verifySessionCookie } from '../lib/session';
import { getCookie } from 'hono/cookie';
import { renewSessionSliding } from '../lib/auth';

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
      .first<{ user_id: string; revoked_at: number | null; expires_at: number; user_status: string }>();

    if (row && !row.revoked_at && row.expires_at > Date.now() / 1000) {
      // Compte supprimé/banni → session morte immédiatement.
      if (row.user_status === 'banned' || row.user_status === 'deleted') {
        c.set('session', null);
      } else {
        c.set('session', { sessionId: signed.sid, userId: row.user_id });
        // TTL glissant : prolongation d'1 jour plafonnée à 1 écriture/h (best effort).
        try {
          const renewed = await renewSessionSliding(c, signed.sid, row.expires_at);
          if (renewed) c.set('sessionRenewed', true);
        } catch {
          // La prolongation ne doit jamais bloquer une requête valide.
        }
      }
    }
  }
  await next();
}

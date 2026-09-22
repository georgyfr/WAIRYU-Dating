/**
 * Middleware de session : lit le cookie signé, vérifie en D1 (révocation/expiry),
 * expose c.get('session'). Anonyme si absent — l'auth complète arrive en Étape 2.
 */
import type { Context, Next } from 'hono';
import type { AppEnv } from '../env';
import { SESSION_COOKIE_NAME, verifySessionCookie } from '../lib/session';
import { getCookie } from 'hono/cookie';

export async function sessionMiddleware(c: Context<AppEnv>, next: Next) {
  c.set('session', null);
  c.set('reqId', c.get('reqId') ?? '');

  const raw = getCookie(c, SESSION_COOKIE_NAME);
  const signed = await verifySessionCookie(raw, c.env.SESSION_HMAC_KEY);
  if (signed) {
    const row = await c.env.DB.prepare(
      `SELECT user_id, revoked_at, expires_at FROM sessions WHERE id = ? LIMIT 1`,
    )
      .bind(signed.sid)
      .first<{ user_id: string; revoked_at: number | null; expires_at: number }>();
    if (row && !row.revoked_at && row.expires_at > Date.now() / 1000) {
      c.set('session', { sessionId: signed.sid, userId: row.user_id });
    }
  }
  await next();
}

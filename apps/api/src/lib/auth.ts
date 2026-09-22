/**
 * Sessions authentifiées (Étape 2) — création, cookie signé, révocation.
 * TTL 30 jours GLISSANTS : à chaque requête authentifiée, la session est
 * prolongée d'un jour glissant (écriture D1 plafonnée à 1/h — économie free tier).
 */

import type { Context } from 'hono';
import type { AppEnv } from '../env';
import { SESSION_COOKIE_NAME, signSessionCookie } from './session';
import { shortSha1Hex } from './otp';
import { LIMITS } from '@wairyu/shared';

const SESSION_TTL_SECONDS = LIMITS.sessionDays * 86400; // 30 j
/** Prolongation plafonnée : on ne réécrit la ligne que si moins de 29 j restent. */
const RENEW_THRESHOLD_SECONDS = (LIMITS.sessionDays - 1) * 86400;

export interface ClientMeta {
  ip: string | null;
  userAgent: string | null;
}

export function clientMeta(c: Context<AppEnv>): ClientMeta {
  const ip =
    c.req.header('cf-connecting-ip') ??
    c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ??
    null;
  return { ip, userAgent: c.req.header('user-agent') ?? null };
}

/** Crée une session D1 + pose le cookie signé. Retourne l'exp pour l'appelant. */
export async function createSession(
  c: Context<AppEnv>,
  userId: string,
): Promise<{ sessionId: string; expiresAt: number }> {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const sid = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');

  const now = Math.floor(Date.now() / 1000);
  const expiresAt = now + SESSION_TTL_SECONDS;
  const meta = clientMeta(c);

  await c.env.DB.prepare(
    `INSERT INTO sessions (id, user_id, created_at, expires_at, last_seen_at, user_agent_hash, ip_hash)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      sid,
      userId,
      now,
      expiresAt,
      now,
      meta.userAgent ? await shortSha1Hex(meta.userAgent) : null,
      meta.ip ? await shortSha1Hex(meta.ip) : null,
    )
    .run();

  await setSessionCookie(c, sid, expiresAt);
  return { sessionId: sid, expiresAt };
}

/** Signe et pose le cookie de session (httpOnly, SameSite=Lax, Secure). */
export async function setSessionCookie(
  c: Context<AppEnv>,
  sid: string,
  expiresAt: number,
): Promise<void> {
  const signed = await signSessionCookie(sid, expiresAt, c.env.SESSION_HMAC_KEY);
  c.header(
    'Set-Cookie',
    `${SESSION_COOKIE_NAME}=${signed}; Path=/; Max-Age=${SESSION_TTL_SECONDS}; HttpOnly; Secure; SameSite=Lax`,
    { append: true },
  );
}

/** Efface le cookie côté client (après logout/suppression). */
export function clearSessionCookie(c: Context<AppEnv>): void {
  c.header('Set-Cookie', `${SESSION_COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`, {
    append: true,
  });
}

/** Révoque la session courante (logout). */
export async function revokeCurrentSession(c: Context<AppEnv>, sessionId: string): Promise<void> {
  const now = Math.floor(Date.now() / 1000);
  await c.env.DB.prepare(`UPDATE sessions SET revoked_at = ? WHERE id = ? AND revoked_at IS NULL`)
    .bind(now, sessionId)
    .run();
  clearSessionCookie(c);
}

/** Révoque toutes les sessions de l'utilisateur (logout-all / sécurité). */
export async function revokeAllSessions(c: Context<AppEnv>, userId: string): Promise<number> {
  const now = Math.floor(Date.now() / 1000);
  const res = await c.env.DB.prepare(
    `UPDATE sessions SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL`,
  )
    .bind(now, userId)
    .run();
  return res.meta.changes ?? 0;
}

/** Prolongation glissante (TTL 30 j) — plafonnée à une écriture par heure/session. */
export async function renewSessionSliding(
  c: Context<AppEnv>,
  sessionId: string,
  currentExpiresAt: number,
): Promise<boolean> {
  const now = Math.floor(Date.now() / 1000);
  if (currentExpiresAt - now > RENEW_THRESHOLD_SECONDS) return false;

  const newExp = now + SESSION_TTL_SECONDS;
  await c.env.DB.prepare(
    `UPDATE sessions SET expires_at = ?, last_seen_at = ? WHERE id = ? AND revoked_at IS NULL`,
  )
    .bind(newExp, now, sessionId)
    .run();
  await setSessionCookie(c, sessionId, newExp);
  return true;
}

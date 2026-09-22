/**
 * Routes d'authentification & comptes (Étape 2).
 *
 * Parcours : email + OTP 6 chiffres (Turnstile sur la demande) → session cookie
 * signé → /api/me. Google OAuth préparé (actif dès la pose des secrets).
 * RGPD dès maintenant : export JSON (droit d'accès) + suppression immédiate
 * (droit à l'effacement) avec trace anonyme purgée à J+30.
 *
 * Anti-énumération : la demande de code ne révèle jamais si l'email existe —
 * l'utilisateur reçoit un email adapté (connexion ou inscription) dans les deux cas.
 */
import { Hono } from 'hono';
import type { Context } from 'hono';
import type { AppEnv } from '../env';
import { errors } from '../lib/errors';
import {
  OTP,
  AppErrorOtpExpired,
  AppErrorOtpInvalid,
  AppErrorOtpLocked,
  generateOtpCode,
  normalizeEmail,
  sha256Hex,
  shortSha1Hex,
  verifyOtpRow,
} from '../lib/otp';
import { RATE_RULES, hitRateLimit, rateLimitedError } from '../lib/ratelimit';
import { verifyTurnstile } from '../lib/turnstile';
import { emailProviderConfigured, sendOtpEmail } from '../lib/email';
import { googleConfigured, buildAuthorizeUrl, exchangeCodeForProfile, generatePkce } from '../lib/google';
import {
  createSession,
  clearSessionCookie,
  revokeAllSessions,
  revokeCurrentSession,
} from '../lib/auth';
import { signValue, verifySignature } from '../lib/session';
import type {
  AccountExport,
  AuthConfigResponse,
  MeResponse,
  OtpRequestResponse,
  OtpVerifyResponse,
} from '@wairyu/shared';

export const authRoutes = new Hono<AppEnv>();

/** Exige une session valide ; retourne {sessionId, userId}. */
async function requireAuth(c: Context<AppEnv>) {
  const session = c.get('session');
  if (!session) throw errors.unauthorized();
  return session;
}

async function bumpMetric(db: D1Database, metric: string): Promise<void> {
  const day = new Date().toISOString().slice(0, 10);
  await db
    .prepare(
      `INSERT INTO metrics_daily (day, metric, value) VALUES (?, ?, 1)
       ON CONFLICT (day, metric) DO UPDATE SET value = value + 1`,
    )
    .bind(day, metric)
    .run();
}

function ipHash(c: Context<AppEnv>): Promise<string> {
  const ip =
    c.req.header('cf-connecting-ip') ??
    c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown';
  return shortSha1Hex(ip);
}

// ---------------------------------------------------------------------------
// GET /api/auth/config — configuration publique (front instancie Turnstile)
// ---------------------------------------------------------------------------
authRoutes.get('/auth/config', (c) => {
  const body: AuthConfigResponse = {
    turnstileSiteKey: c.env.TURNSTILE_SITE_KEY ?? null,
    googleEnabled: googleConfigured(c.env),
    emailProvider: emailProviderConfigured(c.env) ? 'brevo' : 'dev',
  };
  return c.json(body);
});

// ---------------------------------------------------------------------------
// POST /api/auth/otp/request — demande d'un code (inscription OU connexion)
// ---------------------------------------------------------------------------
authRoutes.post('/auth/otp/request', async (c) => {
  const payload = await c.req.json().catch(() => null);
  const email = normalizeEmail((payload as { email?: unknown } | null)?.email);
  if (!email) throw errors.badRequest('Adresse email invalide.');

  // 1) Anti-abus : fenêtres D1 par IP et par email.
  const ip = await ipHash(c);
  const emailHash = await sha256Hex(email);
  const perIp = await hitRateLimit(c.env.DB, RATE_RULES.otpRequestIp, ip);
  if (!perIp.allowed) throw rateLimitedError(perIp.retryAfterSeconds, RATE_RULES.otpRequestIp.scope);
  const perEmail = await hitRateLimit(c.env.DB, RATE_RULES.otpRequestEmail, emailHash);
  if (!perEmail.allowed) throw rateLimitedError(perEmail.retryAfterSeconds, RATE_RULES.otpRequestEmail.scope);

  // 2) Turnstile (fail-closed en prod ; sauté en staging-dev sans secret).
  await verifyTurnstile(c, (payload as { turnstile_token?: unknown } | null)?.turnstile_token, ip);

  // 3) Le compte existe-t-il ? (décision du contenu de l'email, pas de la réponse)
  const user = await c.env.DB.prepare(`SELECT id, status FROM users WHERE email = ? LIMIT 1`)
    .bind(email)
    .first<{ id: string; status: string }>();
  if (user?.status === 'banned') {
    throw errors.forbidden("Ce compte ne peut pas se connecter. Contactez le support.");
  }
  const created = !user;

  // 4) Cooldown de renvoi (60 s) — évite le spam de boîte email.
  const now = Math.floor(Date.now() / 1000);
  const existing = await c.env.DB.prepare(
    `SELECT purpose, created_at, expires_at, consumed_at FROM auth_codes WHERE email_hash = ? ORDER BY created_at DESC LIMIT 1`,
  )
    .bind(emailHash)
    .first<{ purpose: string; created_at: number; expires_at: number; consumed_at: number | null }>();

  if (existing && existing.consumed_at === null && existing.expires_at > now) {
    const elapsed = now - existing.created_at;
    if (elapsed < OTP.resendCooldownSeconds) {
      throw errors.rateLimited(
        `Un code vient d'être envoyé. Demandez-en un nouveau dans ${OTP.resendCooldownSeconds - elapsed} s.`,
      );
    }
  }

  // 5) Génération + stockage hashé (écrase le code actif de ce purpose).
  const code = generateOtpCode();
  const purpose = created ? 'signup' : 'login';
  await c.env.DB.prepare(
    `INSERT INTO auth_codes (email_hash, purpose, code_hash, attempts, request_ip_hash, created_at, expires_at)
     VALUES (?, ?, ?, 0, ?, ?, ?)
     ON CONFLICT (email_hash, purpose) DO UPDATE SET
       code_hash = excluded.code_hash, attempts = 0,
       request_ip_hash = excluded.request_ip_hash,
       created_at = excluded.created_at, expires_at = excluded.expires_at,
       consumed_at = NULL`,
  )
    .bind(emailHash, purpose, await sha256Hex(code), ip, now, now + OTP.ttlSeconds)
    .run();

  // 6) Envoi (Brevo ou mode dev staging).
  const sent = await sendOtpEmail(c.env, email, code, created);
  await bumpMetric(c.env.DB, 'otp_sent');

  const body: OtpRequestResponse = { sent: true, channel: sent.channel };
  if (sent.devCode) body.devCode = sent.devCode; // staging-dev uniquement
  return c.json(body);
});

// ---------------------------------------------------------------------------
// POST /api/auth/otp/verify — vérification → session (création si nouveau)
// ---------------------------------------------------------------------------
authRoutes.post('/auth/otp/verify', async (c) => {
  const payload = await c.req.json().catch(() => null);
  const email = normalizeEmail((payload as { email?: unknown } | null)?.email);
  const code = (payload as { code?: unknown } | null)?.code;
  if (!email) throw errors.badRequest('Adresse email invalide.');
  if (typeof code !== 'string' || !/^\d{6}$/.test(code)) {
    throw errors.badRequest('Le code doit contenir 6 chiffres.');
  }

  // 1) Anti brute-force : par IP et par email.
  const ip = await ipHash(c);
  const emailHash = await sha256Hex(email);
  const perIp = await hitRateLimit(c.env.DB, RATE_RULES.otpVerifyIp, ip);
  if (!perIp.allowed) throw rateLimitedError(perIp.retryAfterSeconds, RATE_RULES.otpVerifyIp.scope);
  const perEmail = await hitRateLimit(c.env.DB, RATE_RULES.otpVerifyEmail, emailHash);
  if (!perEmail.allowed) throw rateLimitedError(perEmail.retryAfterSeconds, RATE_RULES.otpVerifyEmail.scope);

  // 2) Code actif le plus récent (peu importe le purpose — flux unifié).
  const row = await c.env.DB.prepare(
    `SELECT purpose, code_hash, attempts, created_at, expires_at, consumed_at
     FROM auth_codes WHERE email_hash = ? AND consumed_at IS NULL
     ORDER BY created_at DESC LIMIT 1`,
  )
    .bind(emailHash)
    .first<{
      purpose: string;
      code_hash: string;
      attempts: number;
      created_at: number;
      expires_at: number;
      consumed_at: number | null;
    }>();
  if (!row) throw new AppErrorOtpExpired();

  // 3) Vérification (temps constant, tentatives comptées).
  try {
    await verifyOtpRow(row, code);
  } catch (err) {
    if (err instanceof AppErrorOtpInvalid || err instanceof AppErrorOtpLocked) {
      await c.env.DB.prepare(
        `UPDATE auth_codes SET attempts = attempts + 1 WHERE email_hash = ? AND purpose = ?`,
      )
        .bind(emailHash, row.purpose)
        .run();
    }
    throw err;
  }

  // 4) Consommation du code (+ hygiène : purge des autres lignes de cet email).
  const now = Math.floor(Date.now() / 1000);
  await c.env.DB.prepare(`UPDATE auth_codes SET consumed_at = ? WHERE email_hash = ?`)
    .bind(now, emailHash)
    .run();

  // 5) Utilisateur : connexion OU création (fusion OTP/Google par email).
  const existing = await c.env.DB.prepare(
    `SELECT id, email, display_name, status, plan, created_at, email_verified_at FROM users WHERE email = ? LIMIT 1`,
  )
    .bind(email)
    .first<{
      id: string;
      email: string;
      display_name: string | null;
      status: string;
      plan: string;
      created_at: number;
      email_verified_at: number | null;
    }>();

  let userId: string;
  let wasCreated = false;

  if (existing) {
    if (existing.status === 'banned') throw errors.forbidden("Ce compte ne peut pas se connecter.");
    userId = existing.id;
    if (!existing.email_verified_at) {
      await c.env.DB.prepare(`UPDATE users SET email_verified_at = ?, updated_at = ? WHERE id = ?`)
        .bind(now, now, userId)
        .run();
    }
  } else {
    userId = crypto.randomUUID();
    await c.env.DB.prepare(
      `INSERT INTO users (id, email, email_verified_at, status, plan, created_at, updated_at)
       VALUES (?, ?, ?, 'active', 'free', ?, ?)`,
    )
      .bind(userId, email, now, now, now)
      .run();
    wasCreated = true;
  }

  // 6) Session + cookie signé.
  await createSession(c, userId);
  await bumpMetric(c.env.DB, 'otp_verified');
  if (wasCreated) await bumpMetric(c.env.DB, 'signup_completed');

  const body: OtpVerifyResponse = { userId, email, created: wasCreated };
  return c.json(body);
});

// ---------------------------------------------------------------------------
// Google OAuth — préparé, actif dès la pose des secrets (fonctionnement gratuit)
// ---------------------------------------------------------------------------
const OAUTH_COOKIE = 'wairyu_oauth';

interface OAuthStatePayload {
  state: string;
  verifier: string;
  exp: number;
}

function signPayload(value: string, key: string): Promise<string> {
  return signValue(value, key);
}

authRoutes.get('/auth/google/start', async (c) => {
  const env = c.env;
  if (!googleConfigured(env)) {
    throw errors.badRequest('Connexion Google pas encore activée. Utilisez le code email.');
  }
  const { verifier, challenge } = await generatePkce();
  const state = crypto.randomUUID();
  const redirectUri = new URL(c.req.url).origin + '/api/auth/google/callback';

  // Cookie de état signé : {state.verifier} sous forme JSON base64url + HMAC.
  const payload: OAuthStatePayload = {
    state,
    verifier,
    exp: Math.floor(Date.now() / 1000) + 600,
  };
  const raw = btoa(JSON.stringify(payload)).replace(/\+/g, '-').replace(/\//g, '_');
  const sig = await signPayload(raw, c.env.SESSION_HMAC_KEY);
  c.header(
    'Set-Cookie',
    `${OAUTH_COOKIE}=${raw}.${sig}; Path=/api/auth/google; Max-Age=600; HttpOnly; Secure; SameSite=Lax`,
  );
  return c.redirect(buildAuthorizeUrl(env, redirectUri, state, challenge), 302);
});

authRoutes.get('/auth/google/callback', async (c) => {
  const env = c.env;
  if (!googleConfigured(env)) throw errors.notFound();

  const url = new URL(c.req.url);
  const errParam = url.searchParams.get('error');
  if (errParam) return c.redirect('/#/?google=cancelled', 302);

  const cookie = c.req.header('cookie') ?? '';
  const match = cookie
    .split(';')
    .map((s) => s.trim())
    .find((s) => s.startsWith(`${OAUTH_COOKIE}=`));
  if (!match) throw errors.badRequest('Session Google expirée. Recommencez.');
  const [raw, sig] = match.slice(OAUTH_COOKIE.length + 1).split('.');
  const payload: OAuthStatePayload | null =
    raw && sig && (await verifySignature(raw, sig, c.env.SESSION_HMAC_KEY))
      ? (JSON.parse(atob(raw.replace(/-/g, '+').replace(/_/g, '/'))) as OAuthStatePayload)
      : null;
  if (!payload || payload.exp < Date.now() / 1000 || url.searchParams.get('state') !== payload.state) {
    throw errors.badRequest('Session Google invalide. Recommencez.');
  }

  const redirectUri = url.origin + '/api/auth/google/callback';
  const profile = await exchangeCodeForProfile(
    env,
    url.searchParams.get('code') ?? '',
    redirectUri,
    payload.verifier,
  );
  if (!profile.email_verified) {
    return c.redirect('/#/?google=unverified', 302);
  }
  const email = normalizeEmail(profile.email);
  if (!email) throw errors.badRequest('Email Google invalide.');

  const now = Math.floor(Date.now() / 1000);
  const existing = await c.env.DB.prepare(`SELECT id FROM users WHERE email = ? LIMIT 1`)
    .bind(email)
    .first<{ id: string }>();
  let userId: string;
  if (existing) {
    userId = existing.id; // fusion par email (ex. compte créé par OTP)
  } else {
    userId = crypto.randomUUID();
    await c.env.DB.prepare(
      `INSERT INTO users (id, email, email_verified_at, display_name, status, plan, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'active', 'free', ?, ?)`,
    )
      .bind(userId, email, now, profile.name?.slice(0, 40) ?? null, now, now)
      .run();
    await bumpMetric(c.env.DB, 'signup_completed');
  }
  await createSession(c, userId);
  await bumpMetric(c.env.DB, 'login_google');
  // Efface le cookie OAuth (Max-Age=0) et retombe sur la SPA.
  c.header('Set-Cookie', `${OAUTH_COOKIE}=; Path=/api/auth/google; Max-Age=0; HttpOnly; Secure; SameSite=Lax`, {
    append: true,
  });
  return c.redirect('/#/?google=ok', 302);
});

// ---------------------------------------------------------------------------
// Sessions : logout / logout-all
// ---------------------------------------------------------------------------
authRoutes.post('/auth/logout', async (c) => {
  const session = c.get('session');
  if (session) {
    await revokeCurrentSession(c, session.sessionId);
    await bumpMetric(c.env.DB, 'logout');
  } else {
    clearSessionCookie(c);
  }
  return c.json({ ok: true });
});

authRoutes.post('/auth/logout-all', async (c) => {
  const session = await requireAuth(c);
  const revoked = await revokeAllSessions(c, session.userId);
  clearSessionCookie(c);
  return c.json({ ok: true, revoked });
});

// ---------------------------------------------------------------------------
// GET /api/me — profil de l'utilisateur authentifié
// ---------------------------------------------------------------------------
authRoutes.get('/me', async (c) => {
  const session = await requireAuth(c);
  const user = await c.env.DB.prepare(
    `SELECT id, email, display_name, email_verified_at, status, plan, created_at FROM users WHERE id = ? LIMIT 1`,
  )
    .bind(session.userId)
    .first<{
      id: string;
      email: string;
      display_name: string | null;
      email_verified_at: number | null;
      status: string;
      plan: string;
      created_at: number;
    }>();
  if (!user) throw errors.unauthorized();

  const body: MeResponse = {
    userId: user.id,
    email: user.email,
    displayName: user.display_name,
    emailVerified: user.email_verified_at !== null,
    status: user.status as MeResponse['status'],
    plan: user.plan as MeResponse['plan'],
    createdAt: user.created_at,
    sessionRenewed: c.get('sessionRenewed') ?? false,
  };
  return c.json(body);
});

// ---------------------------------------------------------------------------
// RGPD — droit d'accès : GET /api/account/export (JSON téléchargeable)
// ---------------------------------------------------------------------------
authRoutes.get('/account/export', async (c) => {
  const session = await requireAuth(c);
  const user = await c.env.DB.prepare(`SELECT * FROM users WHERE id = ? LIMIT 1`)
    .bind(session.userId)
    .first<Record<string, unknown>>();
  if (!user) throw errors.unauthorized();

  const [sessions] = await Promise.all([
    c.env.DB.prepare(
      `SELECT
         COUNT(*) FILTER (WHERE revoked_at IS NULL AND expires_at > ?) AS active,
         COUNT(*) AS total
       FROM sessions WHERE user_id = ?`,
    )
      .bind(Math.floor(Date.now() / 1000), session.userId)
      .first<{ active: number; total: number }>(),
  ]);

  const body: AccountExport = {
    exportedAt: new Date().toISOString(),
    format: 'wairyu-export-v1',
    user: user ?? {},
    sessions: { active: sessions?.active ?? 0, revoked_total: sessions?.total ?? 0 },
    audit: {
      note: "Export RGPD (art. 15/20). Les tables profil/questionnaire/messages s'ajouteront ici aux étapes 3-6.",
    },
  };
  await bumpMetric(c.env.DB, 'gdpr_export');
  const filename = `wairyu-export-${new Date().toISOString().slice(0, 10)}.json`;
  return c.json(body, 200, { 'content-disposition': `attachment; filename="${filename}"` });
});

// ---------------------------------------------------------------------------
// RGPD — droit à l'effacement : DELETE /api/account (immédiat + trace J+30)
// ---------------------------------------------------------------------------
authRoutes.delete('/account', async (c) => {
  const session = await requireAuth(c);
  const payload = (await c.req.json().catch(() => null)) as { confirm?: unknown } | null;
  const confirmQuery = c.req.query('confirm');
  if (payload?.confirm !== true && confirmQuery !== 'true') {
    throw errors.badRequest('Confirmation explicite requise (confirm: true).');
  }

  const now = Math.floor(Date.now() / 1000);

  // 1) Traçabilité anonyme (purge automatique à J+30 par le cron).
  await c.env.DB.prepare(
    `INSERT INTO account_deletions (user_id_orig, reason, deleted_at, purge_at) VALUES (?, 'user_request', ?, ?)`,
  )
    .bind(session.userId, now, now + 30 * 86400)
    .run();

  // 2) Sessions révoquées puis supprimées ; compte supprimé (hard delete).
  await revokeAllSessions(c, session.userId);
  await c.env.DB.prepare(`DELETE FROM sessions WHERE user_id = ?`).bind(session.userId).run();
  // NOTE Étape 3 : purge Cloudinary des médias du compte avant le DELETE users
  // (hook StorageService.purgeUser) — aucune donnée média à l'Étape 2.
  await c.env.DB.prepare(`DELETE FROM users WHERE id = ?`).bind(session.userId).run();

  clearSessionCookie(c);
  await bumpMetric(c.env.DB, 'account_deleted');
  return c.json({ deleted: true });
});

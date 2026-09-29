/**
 * Routes d'authentification & comptes (Étape 2).
 *
 * Parcours : email + OTP 6 chiffres (Turnstile sur la demande) → session cookie
 * signé → /api/me. Connexions sociales Google + Facebook préparées (actives dès
 * la pose des secrets, fusion de comptes par email).
 * RGPD dès maintenant : export JSON (droit d'accès) + suppression immédiate
 * (droit à l'effacement) avec trace anonyme purgée à J+30.
 *
 * Anti-énumération : la demande de code ne révèle jamais si l'email existe —
 * l'utilisateur reçoit un email adapté (connexion ou inscription) dans les deux cas.
 */
import { Hono } from 'hono';
import type { Context } from 'hono';
import type { AppEnv } from '../env';
import { errors, AppError } from '../lib/errors';
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
import { emailProviderConfigured, sendOtpEmail, sendPasswordResetEmail } from '../lib/email';
import {
  googleConfigured,
  buildAuthorizeUrl,
  exchangeCodeForProfile,
  generatePkce,
  verifyGoogleIdToken,
} from '../lib/google';
import {
  normalizeUsername,
  normalizeUsernameDisplay,
  usernameError,
  passwordPolicyError,
  generateRecoveryCode,
  normalizeRecoveryCode,
  hashPassword,
  verifyPassword,
  // alias : auth.ts importe déjà sha256Hex depuis lib/otp (les deux coexistent).
  sha256Hex as sha256HexPw,
} from '../lib/password';
import {
  facebookConfigured,
  buildFacebookAuthorizeUrl,
  exchangeFacebookCodeForProfile,
  parseFacebookSignedRequest,
} from '../lib/facebook';
import {
  createSession,
  clearSessionCookie,
  revokeAllSessions,
  revokeCurrentSession,
} from '../lib/auth';
import { signValue, verifySignature } from '../lib/session';
import { isProfileComplete } from '../lib/profile';
import { destroyAuthenticatedAsset } from '../lib/cloudinary';
import type {
  AccountExport,
  AuthConfigResponse,
  FacebookLinkResponse,
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
    // Task 57 : client_id public requis par le bouton GSI (popup FedCM) —
    // sans navigation hors de l'app Android (TWA), voir POST /auth/google/idtoken.
    googleClientId: googleConfigured(c.env) ? c.env.GOOGLE_CLIENT_ID : null,
    facebookEnabled: facebookConfigured(c.env),
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
// Connexions sociales (Google + Facebook) — actives dès la pose des secrets.
// Fusion de comptes par email vérifié ; identité (provider, id) conservée dans
// oauth_identities — indispensable au callback de suppression Meta, et base du
// futur déliage multi-fournisseurs.
// ---------------------------------------------------------------------------
interface OAuthStatePayload {
  state: string;
  /** PKCE verifier — Google uniquement (Meta ne supporte pas PKCE pour le web). */
  verifier?: string;
  exp: number;
}

const OAUTH_STATE_TTL_SECONDS = 600;

function oauthCookieName(provider: string): string {
  return `wairyu_oauth_${provider}`;
}

function oauthCookiePath(provider: string): string {
  return `/api/auth/${provider}`;
}

/** Cookie d'état signé (HMAC) : anti-CSRF + porteur du verifier PKCE (Google). */
async function setOAuthStateCookie(
  c: Context<AppEnv>,
  provider: string,
  payload: OAuthStatePayload,
): Promise<void> {
  const raw = btoa(JSON.stringify(payload)).replace(/\+/g, '-').replace(/\//g, '_');
  const sig = await signValue(raw, c.env.SESSION_HMAC_KEY);
  c.header(
    'Set-Cookie',
    `${oauthCookieName(provider)}=${raw}.${sig}; Path=${oauthCookiePath(provider)}; Max-Age=${OAUTH_STATE_TTL_SECONDS}; HttpOnly; Secure; SameSite=Lax`,
  );
}

async function readOAuthStateCookie(
  c: Context<AppEnv>,
  provider: string,
): Promise<OAuthStatePayload | null> {
  const cookie = c.req.header('cookie') ?? '';
  const name = oauthCookieName(provider);
  const match = cookie
    .split(';')
    .map((s) => s.trim())
    .find((s) => s.startsWith(`${name}=`));
  if (!match) return null;
  const [raw, sig] = match.slice(name.length + 1).split('.');
  if (!raw || !sig) return null;
  if (!(await verifySignature(raw, sig, c.env.SESSION_HMAC_KEY))) return null;
  try {
    const payload = JSON.parse(atob(raw.replace(/-/g, '+').replace(/_/g, '/'))) as OAuthStatePayload;
    if (payload.exp < Date.now() / 1000) return null;
    return payload;
  } catch {
    return null;
  }
}

function clearOAuthStateCookie(c: Context<AppEnv>, provider: string): void {
  c.header(
    'Set-Cookie',
    `${oauthCookieName(provider)}=; Path=${oauthCookiePath(provider)}; Max-Age=0; HttpOnly; Secure; SameSite=Lax`,
    { append: true },
  );
}

// ---- Facebook : rattachement après complétion email ----
// Meta refuse le scope « email » sur les apps récentes (et certains comptes
// Facebook n'ont pas d'email confirmé). Quand le profil /me n'expose pas
// d'email, le callback pose un cookie signé court-lived (15 min) porteur de
// l'identité Facebook en attente ; l'utilisateur complète son email via l'OTP
// habituel, puis POST /api/auth/facebook/link relie l'identité à son compte.

const FB_LINK_COOKIE = 'wairyu_fblink';
const FB_LINK_TTL_SECONDS = 900;

interface FacebookLinkPayload {
  id: string;
  exp: number;
}

async function setFacebookLinkCookie(c: Context<AppEnv>, payload: FacebookLinkPayload): Promise<void> {
  const raw = btoa(JSON.stringify(payload)).replace(/\+/g, '-').replace(/\//g, '_');
  const sig = await signValue(raw, c.env.SESSION_HMAC_KEY);
  c.header(
    'Set-Cookie',
    `${FB_LINK_COOKIE}=${raw}.${sig}; Path=/api/auth/facebook; Max-Age=${FB_LINK_TTL_SECONDS}; HttpOnly; Secure; SameSite=Lax`,
    { append: true },
  );
}

async function readFacebookLinkCookie(c: Context<AppEnv>): Promise<FacebookLinkPayload | null> {
  const cookie = c.req.header('cookie') ?? '';
  const match = cookie
    .split(';')
    .map((s) => s.trim())
    .find((s) => s.startsWith(`${FB_LINK_COOKIE}=`));
  if (!match) return null;
  const [raw, sig] = match.slice(FB_LINK_COOKIE.length + 1).split('.');
  if (!raw || !sig) return null;
  if (!(await verifySignature(raw, sig, c.env.SESSION_HMAC_KEY))) return null;
  try {
    const payload = JSON.parse(atob(raw.replace(/-/g, '+').replace(/_/g, '/'))) as FacebookLinkPayload;
    if (!payload.id || payload.exp < Date.now() / 1000) return null;
    return payload;
  } catch {
    return null;
  }
}

function clearFacebookLinkCookie(c: Context<AppEnv>): void {
  c.header(
    'Set-Cookie',
    `${FB_LINK_COOKIE}=; Path=/api/auth/facebook; Max-Age=0; HttpOnly; Secure; SameSite=Lax`,
    { append: true },
  );
}

/**
 * Résout l'utilisateur pour un profil social : connexion si l'email existe déjà
 * (fusion OTP/social — aucune duplication), sinon création ; puis lie
 * l'identité (provider, provider_user_id) à ce compte.
 */
async function resolveOrCreateOAuthUser(
  db: D1Database,
  provider: 'google' | 'facebook',
  profile: { id: string; email: string; name?: string },
): Promise<{ userId: string; created: boolean }> {
  const now = Math.floor(Date.now() / 1000);
  const existing = await db
    .prepare(`SELECT id, status FROM users WHERE email = ? LIMIT 1`)
    .bind(profile.email)
    .first<{ id: string; status: string }>();
  if (existing?.status === 'banned') {
    throw errors.forbidden('Ce compte ne peut pas se connecter.');
  }

  let userId: string;
  let created = false;
  if (existing) {
    userId = existing.id;
  } else {
    userId = crypto.randomUUID();
    await db
      .prepare(
        `INSERT INTO users (id, email, email_verified_at, display_name, status, plan, created_at, updated_at)
         VALUES (?, ?, ?, ?, 'active', 'free', ?, ?)`,
      )
      .bind(userId, profile.email, now, profile.name?.slice(0, 40) ?? null, now, now)
      .run();
    created = true;
  }

  await db
    .prepare(
      `INSERT INTO oauth_identities (provider, provider_user_id, user_id, email_at_link, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT (provider, provider_user_id) DO UPDATE SET
         user_id = excluded.user_id, email_at_link = excluded.email_at_link, updated_at = excluded.updated_at`,
    )
    .bind(provider, profile.id, userId, profile.email, now, now)
    .run();

  return { userId, created };
}

// ---- Google (PKCE S256 + state) ----

authRoutes.get('/auth/google/start', async (c) => {
  const env = c.env;
  if (!googleConfigured(env)) {
    throw errors.badRequest('Connexion Google pas encore activée. Utilisez le code email.');
  }
  const { verifier, challenge } = await generatePkce();
  const state = crypto.randomUUID();
  const redirectUri = new URL(c.req.url).origin + '/api/auth/google/callback';
  await setOAuthStateCookie(c, 'google', {
    state,
    verifier,
    exp: Math.floor(Date.now() / 1000) + OAUTH_STATE_TTL_SECONDS,
  });
  return c.redirect(buildAuthorizeUrl(env, redirectUri, state, challenge), 302);
});

authRoutes.get('/auth/google/callback', async (c) => {
  const env = c.env;
  if (!googleConfigured(env)) throw errors.notFound();

  const url = new URL(c.req.url);
  if (url.searchParams.get('error')) return c.redirect('/#/?google=cancelled', 302);

  const state = await readOAuthStateCookie(c, 'google');
  if (!state || url.searchParams.get('state') !== state.state) {
    throw errors.badRequest('Session Google invalide ou expirée. Recommencez.');
  }

  // Task 56-b : l'échange du code (réseau Google) et la résolution du compte
  // ne doivent JAMAIS tuer le parcours d'un 500 JSON brut. Sur téléphone
  // (réseau mobile capricieux, double appui qui re-émis le callback, code à
  // usage unique consommé), l'échec est RÉCUPÉRABLE → message doux + relance
  // via #/?google=retry. Les AppError intentionnelles (compte banni, email
  // invalide) gardent leur message propre en étant relancées telles quelles.
  try {
    const redirectUri = url.origin + '/api/auth/google/callback';
    const profile = await exchangeCodeForProfile(
      env,
      url.searchParams.get('code') ?? '',
      redirectUri,
      state.verifier ?? '',
    );
    if (!profile.email_verified) return c.redirect('/#/?google=unverified', 302);
    const email = normalizeEmail(profile.email);
    if (!email) throw errors.badRequest('Email Google invalide.');

    const { userId, created } = await resolveOrCreateOAuthUser(c.env.DB, 'google', {
      id: profile.sub,
      email,
      name: profile.name,
    });
    await createSession(c, userId);
    if (created) await bumpMetric(c.env.DB, 'signup_completed');
    await bumpMetric(c.env.DB, 'login_google');
    clearOAuthStateCookie(c, 'google');
    return c.redirect('/#/?google=ok', 302);
  } catch (e) {
    if (e instanceof AppError) throw e;
    console.error(
      `[oauth:google] échange/résolution échoués (récupérable) : ${e instanceof Error ? e.message : String(e)}`,
    );
    return c.redirect('/#/?google=retry', 302);
  }
});

// ---- Facebook (state signé ; pas de PKCE côté Meta pour le web) ----

authRoutes.get('/auth/facebook/start', async (c) => {
  const env = c.env;
  if (!facebookConfigured(env)) {
    throw errors.badRequest('Connexion Facebook pas encore activée. Utilisez le code email.');
  }
  const state = crypto.randomUUID();
  const redirectUri = new URL(c.req.url).origin + '/api/auth/facebook/callback';
  await setOAuthStateCookie(c, 'facebook', {
    state,
    exp: Math.floor(Date.now() / 1000) + OAUTH_STATE_TTL_SECONDS,
  });
  return c.redirect(buildFacebookAuthorizeUrl(env, redirectUri, state), 302);
});

authRoutes.get('/auth/facebook/callback', async (c) => {
  const env = c.env;
  if (!facebookConfigured(env)) throw errors.notFound();

  const url = new URL(c.req.url);
  if (url.searchParams.get('error')) return c.redirect('/#/?facebook=cancelled', 302);

  const state = await readOAuthStateCookie(c, 'facebook');
  if (!state || url.searchParams.get('state') !== state.state) {
    throw errors.badRequest('Session Facebook invalide ou expirée. Recommencez.');
  }

  // Task 56-b : même blindage que Google — les échecs récupérables (code
  // consommé par un callback rejoué, coupure réseau) renvoient vers
  // #/?facebook=retry au lieu d'un 500 JSON ; AppError relancée telle quelle.
  try {
    const redirectUri = url.origin + '/api/auth/facebook/callback';
    const profile = await exchangeFacebookCodeForProfile(
      env,
      url.searchParams.get('code') ?? '',
      redirectUri,
    );
    // Facebook n'expose un email que si la permission est accordée ET confirmée
    // sur le compte ; sinon rattrapage : profil mis en attente (cookie signé)
    // puis écran #/fb-complete (email + code OTP) et rattachement via
    // POST /api/auth/facebook/link — jamais de compte sans email vérifié.
    const email = normalizeEmail(profile.email ?? '');
    if (!email) {
      await setFacebookLinkCookie(c, {
        id: profile.id,
        exp: Math.floor(Date.now() / 1000) + FB_LINK_TTL_SECONDS,
      });
      await bumpMetric(c.env.DB, 'facebook_link_started');
      return c.redirect('/#/fb-complete', 302);
    }

    const { userId, created } = await resolveOrCreateOAuthUser(c.env.DB, 'facebook', {
      id: profile.id,
      email,
      name: profile.name,
    });
    await createSession(c, userId);
    if (created) await bumpMetric(c.env.DB, 'signup_completed');
    await bumpMetric(c.env.DB, 'login_facebook');
    clearOAuthStateCookie(c, 'facebook');
    return c.redirect('/#/?facebook=ok', 302);
  } catch (e) {
    if (e instanceof AppError) throw e;
    console.error(
      `[oauth:facebook] échange/résolution échoués (récupérable) : ${e instanceof Error ? e.message : String(e)}`,
    );
    return c.redirect('/#/?facebook=retry', 302);
  }
});

// ---- Rattachement d'une identité Facebook en attente (complétion email) ----
// Session requise : la vérification OTP (écran #/fb-complete) a créé/ouvert le
// compte ; cet endpoint relie l'identité Facebook du cookie signé à ce compte.
// Garde-fou : refus 409 si l'identité est déjà reliée à un autre compte (pas de
// détournement d'identité). Le contrat Data Deletion Meta reste satisfait :
// l'identité finit toujours dans oauth_identities.
authRoutes.post('/auth/facebook/link', async (c) => {
  const session = await requireAuth(c);
  const pending = await readFacebookLinkCookie(c);
  if (!pending) {
    throw errors.badRequest(
      'Aucune connexion Facebook en attente. Recommence depuis le bouton Facebook.',
    );
  }

  const existing = await c.env.DB
    .prepare(
      `SELECT user_id FROM oauth_identities WHERE provider = 'facebook' AND provider_user_id = ? LIMIT 1`,
    )
    .bind(pending.id)
    .first<{ user_id: string }>();
  if (existing && existing.user_id !== session.userId) {
    clearFacebookLinkCookie(c);
    throw new AppError(409, 'conflict', 'Ce compte Facebook est déjà relié à un autre compte wairyu.');
  }

  const me = await c.env.DB
    .prepare(`SELECT email FROM users WHERE id = ? LIMIT 1`)
    .bind(session.userId)
    .first<{ email: string }>();
  if (!me) throw errors.unauthorized();

  const now = Math.floor(Date.now() / 1000);
  await c.env.DB.prepare(
    `INSERT INTO oauth_identities (provider, provider_user_id, user_id, email_at_link, created_at, updated_at)
     VALUES ('facebook', ?, ?, ?, ?, ?)
     ON CONFLICT (provider, provider_user_id) DO UPDATE SET
       user_id = excluded.user_id, email_at_link = excluded.email_at_link, updated_at = excluded.updated_at`,
  )
    .bind(pending.id, session.userId, me.email, now, now)
    .run();

  clearFacebookLinkCookie(c);
  await bumpMetric(c.env.DB, 'facebook_linked');
  const body: FacebookLinkResponse = { linked: true };
  return c.json(body);
});

// ---- Callback « Data Deletion Request » (obligatoire pour l'app Meta) ----
// Meta appelle ce POST (form-urlencoded, signed_request HMAC-SHA256 au secret
// d'app) quand l'utilisateur demande la suppression de ses données depuis
// Facebook. Contrat de réponse : 200 + { url, confirmation_code }.

authRoutes.post('/auth/facebook/data-deletion', async (c) => {
  const env = c.env;
  if (!facebookConfigured(env)) throw errors.notFound();

  const form = (await c.req.parseBody().catch(() => ({}))) as Record<string, unknown>;
  const signed = form['signed_request'];
  if (typeof signed !== 'string') throw errors.badRequest('signed_request manquant.');

  const parsed = await parseFacebookSignedRequest(signed, env.FACEBOOK_APP_SECRET);
  if (!parsed) throw errors.badRequest('signed_request invalide.');

  const identity = await c.env.DB
    .prepare(
      `SELECT user_id FROM oauth_identities WHERE provider = 'facebook' AND provider_user_id = ? LIMIT 1`,
    )
    .bind(parsed.user_id)
    .first<{ user_id: string }>();

  let status = 'no_matching_user';
  if (identity) {
    await hardDeleteAccount(c, identity.user_id, 'gdpr_request');
    await bumpMetric(c.env.DB, 'account_deleted');
    status = 'user_data_deleted';
  }

  const confirmationCode = crypto.randomUUID().replace(/-/g, '').slice(0, 16).toUpperCase();
  // NB : Workers Assets normalise les .html (307) — on sert directement l'URL sans extension.
  const url = `${new URL(c.req.url).origin}/data-deletion?code=${confirmationCode}`;
  return c.json({ url, confirmation_code: confirmationCode, status });
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
    `SELECT u.id, u.email, u.display_name, u.email_verified_at, u.status, u.plan, u.created_at,
            u.birth_year, u.birth_date, u.gender, u.orientation, u.intent, u.city, u.bio, u.profile_consent_at,
            u.verified_at, u.suspended_until,
            ap.username AS username,
            (SELECT COUNT(*) FROM photos p
              WHERE p.user_id = u.id AND p.status = 'active' AND p.deleted_at IS NULL) AS photo_count,
            (SELECT COUNT(*) FROM profile_prompts pp WHERE pp.user_id = u.id) AS prompt_count,
            (up.user_id IS NOT NULL) AS has_prefs
     FROM users u
     LEFT JOIN auth_password ap ON ap.user_id = u.id
     LEFT JOIN user_preferences up ON up.user_id = u.id
     WHERE u.id = ? LIMIT 1`,
  )
    .bind(session.userId)
    .first<{
      id: string;
      email: string;
      display_name: string | null;
      username: string | null;
      email_verified_at: number | null;
      status: string;
      plan: string;
      created_at: number;
      birth_year: number | null;
      birth_date: string | null;
      gender: string | null;
      orientation: string | null;
      intent: string | null;
      city: string | null;
      bio: string | null;
      profile_consent_at: number | null;
      verified_at: number | null;
      suspended_until: number | null;
      photo_count: number;
      prompt_count: number;
      has_prefs: number;
    }>();
  if (!user) throw errors.unauthorized();

  const body: MeResponse = {
    userId: user.id,
    email: user.email,
    displayName: user.display_name,
    // Task 60 (fondateur) — @pseudo de connexion : s'affiche TOUJOURS à la
    // place du préfixe email (les comptes classiques ont un email placeholder).
    username: user.username ?? null,
    emailVerified: user.email_verified_at !== null,
    status: user.status as MeResponse['status'],
    plan: user.plan as MeResponse['plan'],
    createdAt: user.created_at,
    sessionRenewed: c.get('sessionRenewed') ?? false,
    profileComplete: isProfileComplete(
      {
        display_name: user.display_name,
        birth_year: user.birth_year,
        birth_date: user.birth_date,
        gender: user.gender,
        orientation: user.orientation,
        intent: user.intent,
        city: user.city,
        bio: user.bio,
        profile_consent_at: user.profile_consent_at,
      },
      {
        photoCount: user.photo_count,
        promptCount: user.prompt_count,
        hasPreferences: user.has_prefs === 1,
      },
    ),
    verified: user.verified_at != null,
    suspendedUntil:
      user.suspended_until && user.suspended_until > Math.floor(Date.now() / 1000)
        ? user.suspended_until
        : null,
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

  const [sessions, prompts, photos, prefs] = await Promise.all([
    c.env.DB.prepare(
      `SELECT
         COUNT(*) FILTER (WHERE revoked_at IS NULL AND expires_at > ?) AS active,
         COUNT(*) AS total
       FROM sessions WHERE user_id = ?`,
    )
      .bind(Math.floor(Date.now() / 1000), session.userId)
      .first<{ active: number; total: number }>(),
    c.env.DB.prepare(
      `SELECT position, prompt_key, answer, updated_at FROM profile_prompts WHERE user_id = ? ORDER BY position`,
    )
      .bind(session.userId)
      .all(),
    c.env.DB.prepare(
      `SELECT id, format, width, height, bytes, position, status, created_at, deleted_at
       FROM photos WHERE user_id = ? ORDER BY created_at`,
    )
      .bind(session.userId)
      .all(),
    c.env.DB.prepare(
      `SELECT mode_default, pref_gender, min_age, max_age, distance_km, pref_intent, updated_at
       FROM user_preferences WHERE user_id = ? LIMIT 1`,
    )
      .bind(session.userId)
      .first(),
  ]);

  const body: AccountExport = {
    exportedAt: new Date().toISOString(),
    format: 'wairyu-export-v1',
    user: user ?? {},
    sessions: { active: sessions?.active ?? 0, revoked_total: sessions?.total ?? 0 },
    profile: {
      prompts: prompts?.results ?? [],
      photos: photos?.results ?? [],
      preferences: prefs ?? null,
      note: 'Les photos elles-mêmes sont hébergées chez Cloudinary (assets privés) ; leurs métadonnées sont ci-dessus.',
    },
    audit: {
      note: 'Export RGPD (art. 15/20). Les réponses questionnaire/messages s\u2019ajouteront ici aux étapes 4-6.',
    },
  };
  await bumpMetric(c.env.DB, 'gdpr_export');
  const filename = `wairyu-export-${new Date().toISOString().slice(0, 10)}.json`;
  return c.json(body, 200, { 'content-disposition': `attachment; filename="${filename}"` });
});

// ---------------------------------------------------------------------------
// RGPD — droit à l'effacement : DELETE /api/account (immédiat + trace J+30)
// ---------------------------------------------------------------------------

/** Suppression immédiate d'un compte : trace anonyme J+30, puis hard delete. */
async function hardDeleteAccount(
  c: Context<AppEnv>,
  userId: string,
  reason: 'user_request' | 'gdpr_request',
): Promise<void> {
  const now = Math.floor(Date.now() / 1000);

  // 1) Traçabilité anonyme (purge automatique à J+30 par le cron).
  await c.env.DB.prepare(
    `INSERT INTO account_deletions (user_id_orig, reason, deleted_at, purge_at) VALUES (?, ?, ?, ?)`,
  )
    .bind(userId, reason, now, now + 30 * 86400)
    .run();

  // 2) Purge Cloudinary des médias du compte (hook StorageService.purgeUser —
  //    noté en Étape 2, implémenté ici en Étape 3) : destroy best-effort.
  const photoRows = await c.env.DB.prepare(
    `SELECT id FROM photos WHERE user_id = ? AND deleted_at IS NULL`,
  )
    .bind(userId)
    .all<{ id: string }>();
  await Promise.allSettled(
    (photoRows.results ?? []).map((p) =>
      destroyAuthenticatedAsset(c.env, `${c.env.CLOUDINARY_ROOT_FOLDER}/photos/${userId}/${p.id}`),
    ),
  );

  // 3) Sessions révoquées puis supprimées ; identités OAuth déliées ; données
  //    profil supprimées ; compte supprimé.
  await revokeAllSessions(c, userId);
  await c.env.DB.prepare(`DELETE FROM sessions WHERE user_id = ?`).bind(userId).run();
  await c.env.DB.prepare(`DELETE FROM oauth_identities WHERE user_id = ?`).bind(userId).run();
  await c.env.DB.prepare(`DELETE FROM photos WHERE user_id = ?`).bind(userId).run();
  await c.env.DB.prepare(`DELETE FROM profile_prompts WHERE user_id = ?`).bind(userId).run();
  await c.env.DB.prepare(`DELETE FROM user_preferences WHERE user_id = ?`).bind(userId).run();
  await c.env.DB.prepare(`DELETE FROM users WHERE id = ?`).bind(userId).run();
}

authRoutes.delete('/account', async (c) => {
  const session = await requireAuth(c);
  const payload = (await c.req.json().catch(() => null)) as { confirm?: unknown } | null;
  const confirmQuery = c.req.query('confirm');
  if (payload?.confirm !== true && confirmQuery !== 'true') {
    throw errors.badRequest('Confirmation explicite requise (confirm: true).');
  }

  await hardDeleteAccount(c, session.userId, 'user_request');
  clearSessionCookie(c);
  await bumpMetric(c.env.DB, 'account_deleted');
  return c.json({ deleted: true });
});

// ---------------------------------------------------------------------------
// Task 57 — POST /api/auth/google/idtoken : bouton GSI (popup FedCM).
// Le front reçoit le jeton ID dans la page (AUCUNE navigation hors de la TWA
// Android, où le flux authorize casse) et le poste ici. Vérification
// cryptographique complète côté serveur (lib/google.verifyGoogleIdToken).
// ---------------------------------------------------------------------------
authRoutes.post('/auth/google/idtoken', async (c) => {
  const env = c.env;
  if (!googleConfigured(env)) throw errors.notFound();
  const body = (await c.req.json().catch(() => null)) as { credential?: unknown } | null;
  const credential = body?.credential;
  if (typeof credential !== 'string' || credential.length < 100) {
    throw errors.badRequest('Jeton Google manquant ou invalide. Réessaie.');
  }
  try {
    const profile = await verifyGoogleIdToken(env, credential);
    const email = normalizeEmail(profile.email);
    if (!email) throw errors.badRequest('Email Google invalide.');
    const { userId, created } = await resolveOrCreateOAuthUser(c.env.DB, 'google', {
      id: profile.sub,
      email,
      name: profile.name,
    });
    await createSession(c, userId);
    if (created) await bumpMetric(c.env.DB, 'signup_completed');
    await bumpMetric(c.env.DB, 'login_google');
    return c.json({ ok: true, google: 'ok', created });
  } catch (e) {
    if (e instanceof AppError) throw e;
    console.error(`[oauth:google-gsi] jeton refusé/échec : ${e instanceof Error ? e.message : String(e)}`);
    throw errors.badRequest('Connexion Google refusée. Réessaie, ou utilise le code email.');
  }
});

// ---------------------------------------------------------------------------
// Task 58 (fondateur) — comptes « classiques » pseudo + mot de passe.
//  - inscription : pseudo (Task 61 : espaces/accents) + mot de passe → code
//    de récupération affiché UNE fois + email placeholder (pas d'email requis) ;
//  - connexion : @pseudo + mot de passe (verrou 15 min après 5 échecs) ;
//  - récupération par code (avec/sans nouveau mot de passe) ;
//  - « mot de passe oublié » par email (lien 1 h, Brevo) ;
//  - changement de mot de passe + email de récupération (connecté).
// ---------------------------------------------------------------------------
const PW_LOCKOUT_ATTEMPTS = 5;
const PW_LOCKOUT_SECONDS = 900; // 15 minutes
const RECOVERY_CODE_PLACEHOLDER_EMAIL_DOMAIN = 'inbox.wairyu.local';

function placeholderEmail(): string {
  return `pw-${crypto.randomUUID().replace(/-/g, '')}@${RECOVERY_CODE_PLACEHOLDER_EMAIL_DOMAIN}`;
}

function isPlaceholderEmail(email: string): boolean {
  return email.endsWith(`@${RECOVERY_CODE_PLACEHOLDER_EMAIL_DOMAIN}`);
}

async function findPasswordByUsername(db: D1Database, usernameCanonical: string) {
  return db
    .prepare(
      `SELECT user_id, username, password_hash, recovery_code_hash, failed_attempts, locked_until
       FROM auth_password WHERE username_canonical = ? LIMIT 1`,
    )
    .bind(usernameCanonical)
    .first<{
      user_id: string;
      username: string;
      password_hash: string;
      recovery_code_hash: string | null;
      failed_attempts: number;
      locked_until: number | null;
    }>();
}

/** 423 implicite — verrou actif ? → 429 avec le délai restant en minutes. */
function lockedError(lockedUntil: number | null): void {
  if (lockedUntil && lockedUntil > Math.floor(Date.now() / 1000)) {
    const minutes = Math.ceil((lockedUntil - Math.floor(Date.now() / 1000)) / 60);
    throw errors.rateLimited(`Trop de tentatives. Réessayez dans ${minutes} min.`);
  }
}

async function registerLockFailure(db: D1Database, row: { user_id: string; failed_attempts: number }) {
  const attempts = row.failed_attempts + 1;
  const lock =
    attempts >= PW_LOCKOUT_ATTEMPTS ? Math.floor(Date.now() / 1000) + PW_LOCKOUT_SECONDS : null;
  await db
    .prepare(
      `UPDATE auth_password SET failed_attempts = ?, locked_until = ?, updated_at = ? WHERE user_id = ?`,
    )
    .bind(attempts, lock, Math.floor(Date.now() / 1000), row.user_id)
    .run();
}

authRoutes.post('/auth/password/register', async (c) => {
  const payload = (await c.req.json().catch(() => null)) as Record<string, unknown> | null;
  const rawUsername = String(payload?.username ?? '');
  const usernameDisplay = normalizeUsernameDisplay(rawUsername);
  const username = normalizeUsername(rawUsername);
  const password = typeof payload?.password === 'string' ? payload.password : '';
  if (!usernameDisplay || !username) usernameError();
  const policy = passwordPolicyError(password);
  if (policy) throw errors.badRequest(policy);

  const ip = await ipHash(c);
  const authHeader = c.req.header('authorization') ?? '';
  const smokeBypass =
    c.env.ENVIRONMENT === 'staging' && !!c.env.ADMIN_TOKEN && authHeader === `Bearer ${c.env.ADMIN_TOKEN}`;
  const perIp = smokeBypass
    ? { allowed: true, remaining: 0, retryAfterSeconds: 0 }
    : await hitRateLimit(c.env.DB, RATE_RULES.pwRegisterIp, ip);
  if (!perIp.allowed) throw rateLimitedError(perIp.retryAfterSeconds, RATE_RULES.pwRegisterIp.scope);
  await verifyTurnstile(c, payload?.turnstile_token, ip);

  const taken = await findPasswordByUsername(c.env.DB, username);
  if (taken) throw errors.conflict('Ce pseudo est déjà pris. Choisis-en un autre.');

  const now = Math.floor(Date.now() / 1000);
  const userId = crypto.randomUUID();
  const recoveryCode = generateRecoveryCode();
  const recoveryCodeHash = await sha256HexPw(normalizeRecoveryCode(recoveryCode));
  // users d'abord (email placeholder UNIQUE) — si auth_password échoue
  // (pseudo pris entre-temps), on nettoie : AUCUN compte orphelin.
  await c.env.DB.prepare(
    `INSERT INTO users (id, email, email_verified_at, status, plan, created_at, updated_at)
     VALUES (?, ?, NULL, 'active', 'free', ?, ?)`,
  )
    .bind(userId, placeholderEmail(), now, now)
    .run();
  try {
    await c.env.DB.prepare(
      `INSERT INTO auth_password (user_id, username, username_canonical, password_hash, recovery_code_hash,
                                  recovery_code_generated_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(userId, usernameDisplay, username, await hashPassword(password), recoveryCodeHash, now, now, now)
      .run();
  } catch (err) {
    await c.env.DB.prepare(`DELETE FROM users WHERE id = ? AND status = 'active'`).bind(userId).run();
    if (String(err).includes('UNIQUE')) throw errors.conflict('Ce pseudo est déjà pris. Choisis-en un autre.');
    throw err;
  }
  await createSession(c, userId);
  await bumpMetric(c.env.DB, 'password_signup');
  const res = { userId, username: usernameDisplay, recoveryCode, created: true };
  return c.json(res);
});

authRoutes.post('/auth/password/login', async (c) => {
  const payload = (await c.req.json().catch(() => null)) as Record<string, unknown> | null;
  const username = normalizeUsername(String(payload?.username ?? ''));
  const password = typeof payload?.password === 'string' ? payload.password : '';
  if (!username || !password) {
    throw errors.badRequest('Indique ton pseudo et ton mot de passe.');
  }
  const ip = await ipHash(c);
  const authHeader = c.req.header('authorization') ?? '';
  const smokeBypass =
    c.env.ENVIRONMENT === 'staging' && !!c.env.ADMIN_TOKEN && authHeader === `Bearer ${c.env.ADMIN_TOKEN}`;
  const perIp = smokeBypass
    ? { allowed: true, remaining: 0, retryAfterSeconds: 0 }
    : await hitRateLimit(c.env.DB, RATE_RULES.pwLoginIp, ip);
  if (!perIp.allowed) throw rateLimitedError(perIp.retryAfterSeconds, RATE_RULES.pwLoginIp.scope);
  const perUser = await hitRateLimit(c.env.DB, RATE_RULES.pwLoginUser, username);
  if (!perUser.allowed) throw rateLimitedError(perUser.retryAfterSeconds, RATE_RULES.pwLoginUser.scope);

  const row = await findPasswordByUsername(c.env.DB, username);
  if (!row) throw errors.unauthorized('Pseudo ou mot de passe incorrect.');
  lockedError(row.locked_until);
  const ok = await verifyPassword(password, row.password_hash);
  if (!ok) {
    await registerLockFailure(c.env.DB, row);
    throw errors.unauthorized('Pseudo ou mot de passe incorrect.');
  }
  const user = await c.env.DB.prepare(`SELECT status FROM users WHERE id = ? LIMIT 1`)
    .bind(row.user_id)
    .first<{ status: string }>();
  if (user?.status === 'banned') {
    throw errors.forbidden('Ce compte ne peut pas se connecter. Contactez le support.');
  }
  await c.env.DB.prepare(
    `UPDATE auth_password SET failed_attempts = 0, locked_until = NULL, updated_at = ? WHERE user_id = ?`,
  )
    .bind(Math.floor(Date.now() / 1000), row.user_id)
    .run();
  await createSession(c, row.user_id);
  await bumpMetric(c.env.DB, 'password_login');
  const res = { userId: row.user_id, username: row.username };
  return c.json(res);
});

// Récupération par code : soit « vérifier » (new_password absent → session
// nouvelle pour ré-armer l'affichage du code), soit « réinitialiser »
// (new_password présent → mot de passe remplacé + sessions révoquées).
authRoutes.post('/auth/password/recovery', async (c) => {
  const payload = (await c.req.json().catch(() => null)) as Record<string, unknown> | null;
  const username = normalizeUsername(String(payload?.username ?? ''));
  const code = normalizeRecoveryCode(String(payload?.recovery_code ?? ''));
  const newPassword = typeof payload?.new_password === 'string' ? payload.new_password : null;
  if (!username || code.length < 12) {
    throw errors.badRequest('Indique ton pseudo et ton code de récupération (12 caractères).');
  }
  if (newPassword !== null) {
    const policy = passwordPolicyError(newPassword);
    if (policy) throw errors.badRequest(policy);
  }
  const ip = await ipHash(c);
  const perIp = await hitRateLimit(c.env.DB, RATE_RULES.pwRecoveryIp, ip);
  if (!perIp.allowed) throw rateLimitedError(perIp.retryAfterSeconds, RATE_RULES.pwRecoveryIp.scope);
  const perUser = await hitRateLimit(c.env.DB, RATE_RULES.pwRecoveryUser, username);
  if (!perUser.allowed) throw rateLimitedError(perUser.retryAfterSeconds, RATE_RULES.pwRecoveryUser.scope);

  const row = await findPasswordByUsername(c.env.DB, username);
  if (!row?.recovery_code_hash) throw errors.unauthorized('Pseudo ou code de récupération incorrect.');
  lockedError(row.locked_until);
  const suppliedHash = await sha256HexPw(code);
  if (suppliedHash !== row.recovery_code_hash) {
    await registerLockFailure(c.env.DB, row);
    throw errors.unauthorized('Pseudo ou code de récupération incorrect.');
  }
  const now = Math.floor(Date.now() / 1000);
  if (newPassword !== null) {
    await c.env.DB.prepare(
      `UPDATE auth_password SET password_hash = ?, failed_attempts = 0, locked_until = NULL, updated_at = ? WHERE user_id = ?`,
    )
      .bind(await hashPassword(newPassword), now, row.user_id)
      .run();
    await revokeAllSessions(c, row.user_id);
  } else {
    await c.env.DB.prepare(
      `UPDATE auth_password SET failed_attempts = 0, locked_until = NULL, updated_at = ? WHERE user_id = ?`,
    )
      .bind(now, row.user_id)
      .run();
  }
  const user = await c.env.DB.prepare(`SELECT status FROM users WHERE id = ? LIMIT 1`)
    .bind(row.user_id)
    .first<{ status: string }>();
  if (user?.status === 'banned') {
    throw errors.forbidden('Ce compte ne peut pas se connecter. Contactez le support.');
  }
  await createSession(c, row.user_id);
  await bumpMetric(c.env.DB, 'password_recovery');
  const res = { ok: true, reset: newPassword !== null, username: row.username };
  return c.json(res);
});

// « Mot de passe oublié » : réponse TOUJOURS positive (sent:true) — on ne
// révèle jamais si l'email existe. Le lien (1 h, hashé en base, usage unique)
// part par Brevo ; en staging sans Brevo, l'URL revient dans la réponse (dev).
authRoutes.post('/auth/password/forgot', async (c) => {
  const payload = (await c.req.json().catch(() => null)) as Record<string, unknown> | null;
  const email = normalizeEmail(payload?.email as string | undefined);
  if (!email) throw errors.badRequest('Adresse email invalide.');
  const ip = await ipHash(c);
  const perIp = await hitRateLimit(c.env.DB, RATE_RULES.pwForgotIp, ip);
  if (!perIp.allowed) throw rateLimitedError(perIp.retryAfterSeconds, RATE_RULES.pwForgotIp.scope);
  const emailHash = await sha256Hex(email);
  const perEmail = await hitRateLimit(c.env.DB, RATE_RULES.pwForgotEmail, emailHash);
  if (!perEmail.allowed) throw rateLimitedError(perEmail.retryAfterSeconds, RATE_RULES.pwForgotEmail.scope);
  await verifyTurnstile(c, payload?.turnstile_token, ip);

  const match = await c.env.DB.prepare(
    `SELECT u.id AS user_id, ap.username AS username
     FROM users u JOIN auth_password ap ON ap.user_id = u.id
     WHERE u.email = ? AND u.status != 'banned' LIMIT 1`,
  )
    .bind(email)
    .first<{ user_id: string; username: string }>();
  const res: { sent: true; channel: 'email'; devResetUrl?: string } = { sent: true, channel: 'email' };
  if (match) {
    const tokenBytes = new Uint8Array(32);
    crypto.getRandomValues(tokenBytes);
    const token = [...tokenBytes].map((b) => b.toString(16).padStart(2, '0')).join('');
    const now = Math.floor(Date.now() / 1000);
    await c.env.DB.prepare(
      `INSERT INTO password_resets (id, user_id, token_hash, created_at, expires_at, request_ip_hash)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
      .bind(crypto.randomUUID(), match.user_id, await sha256Hex(token), now, now + 3600, ip)
      .run();
    const sent = await sendPasswordResetEmail(c.env, email, match.username, token);
    if (sent.devResetUrl) res.devResetUrl = sent.devResetUrl;
  }
  return c.json(res);
});

authRoutes.post('/auth/password/reset', async (c) => {
  const payload = (await c.req.json().catch(() => null)) as Record<string, unknown> | null;
  const token = typeof payload?.token === 'string' ? payload.token.trim() : '';
  const newPassword = typeof payload?.new_password === 'string' ? payload.new_password : '';
  if (!/^[0-9a-f]{64}$/.test(token)) throw errors.badRequest('Lien de réinitialisation invalide.');
  const policy = passwordPolicyError(newPassword);
  if (policy) throw errors.badRequest(policy);
  const ip = await ipHash(c);
  const perIp = await hitRateLimit(c.env.DB, RATE_RULES.pwResetIp, ip);
  if (!perIp.allowed) throw rateLimitedError(perIp.retryAfterSeconds, RATE_RULES.pwResetIp.scope);

  const now = Math.floor(Date.now() / 1000);
  const row = await c.env.DB.prepare(
    `SELECT id, user_id, expires_at, consumed_at FROM password_resets
     WHERE token_hash = ? ORDER BY created_at DESC LIMIT 1`,
  )
    .bind(await sha256HexPw(token))
    .first<{ id: string; user_id: string; expires_at: number; consumed_at: number | null }>();
  if (!row || row.consumed_at !== null || row.expires_at < now) {
    throw new AppError(410, 'reset_expired', 'Ce lien a expiré. Demande-en un nouveau.');
  }
  await c.env.DB.prepare(
    `UPDATE auth_password SET password_hash = ?, failed_attempts = 0, locked_until = NULL, updated_at = ? WHERE user_id = ?`,
  )
    .bind(await hashPassword(newPassword), now, row.user_id)
    .run();
  await c.env.DB.prepare(`UPDATE password_resets SET consumed_at = ? WHERE id = ?`).bind(now, row.id).run();
  await revokeAllSessions(c, row.user_id);
  await createSession(c, row.user_id);
  await bumpMetric(c.env.DB, 'password_reset');
  return c.json({ ok: true });
});

authRoutes.post('/auth/password/change', async (c) => {
  const session = await requireAuth(c);
  const payload = (await c.req.json().catch(() => null)) as Record<string, unknown> | null;
  const currentPassword = typeof payload?.current_password === 'string' ? payload.current_password : '';
  const newPassword = typeof payload?.new_password === 'string' ? payload.new_password : '';
  if (!currentPassword) throw errors.badRequest('Indique ton mot de passe actuel.');
  const policy = passwordPolicyError(newPassword);
  if (policy) throw errors.badRequest(policy);
  const row = await c.env.DB.prepare(`SELECT password_hash FROM auth_password WHERE user_id = ? LIMIT 1`)
    .bind(session.userId)
    .first<{ password_hash: string }>();
  if (!row) throw errors.badRequest("Ce compte n'utilise pas encore de mot de passe.");
  const ok = await verifyPassword(currentPassword, row.password_hash);
  if (!ok) throw errors.unauthorized('Mot de passe actuel incorrect.');
  const now = Math.floor(Date.now() / 1000);
  await c.env.DB.prepare(`UPDATE auth_password SET password_hash = ?, updated_at = ? WHERE user_id = ?`)
    .bind(await hashPassword(newPassword), now, session.userId)
    .run();
  const revoked = await revokeAllSessions(c, session.userId);
  await createSession(c, session.userId);
  await bumpMetric(c.env.DB, 'password_change');
  return c.json({ ok: true, revokedOthers: revoked });
});

// Email de récupération (connecté) : remplace le placeholder par un vrai
// email — sert UNIQUEMENT à retrouver le mot de passe (jamais affiché).
authRoutes.post('/account/recovery-email', async (c) => {
  const session = await requireAuth(c);
  const payload = (await c.req.json().catch(() => null)) as Record<string, unknown> | null;
  const email = normalizeEmail(payload?.email as string | undefined);
  if (!email) throw errors.badRequest('Adresse email invalide.');
  if (isPlaceholderEmail(email)) throw errors.badRequest('Adresse email invalide.');
  const now = Math.floor(Date.now() / 1000);
  try {
    await c.env.DB.prepare(`UPDATE users SET email = ?, email_verified_at = NULL, updated_at = ? WHERE id = ?`)
      .bind(email, now, session.userId)
      .run();
  } catch (err) {
    if (String(err).includes('UNIQUE')) {
      throw errors.conflict('Cet email est déjà utilisé sur un autre compte wairyu.');
    }
    throw err;
  }
  return c.json({ ok: true, email });
});

// État « identifiants » (connecté) : le front de Réglages affiche ce qui est
// en place (mot de passe ? email ? code de récupération ?) sans rien révéler.
authRoutes.get('/auth/password/status', async (c) => {
  const session = await requireAuth(c);
  const [user, pw] = await Promise.all([
    c.env.DB.prepare(`SELECT email FROM users WHERE id = ? LIMIT 1`)
      .bind(session.userId)
      .first<{ email: string }>(),
    c.env.DB.prepare(`SELECT username, recovery_code_hash FROM auth_password WHERE user_id = ? LIMIT 1`)
      .bind(session.userId)
      .first<{ username: string; recovery_code_hash: string | null }>(),
  ]);
  if (!user) throw errors.unauthorized();
  const realEmail = !isPlaceholderEmail(user.email);
  const masked = realEmail ? `${user.email.slice(0, 1)}***@${user.email.split('@')[1] ?? ''}` : null;
  const res = {
    hasPassword: pw !== null,
    hasRecoveryEmail: realEmail,
    recoveryEmailMasked: masked,
    username: pw?.username ?? null,
    hasRecoveryCode: pw?.recovery_code_hash !== null && pw?.recovery_code_hash !== undefined,
  };
  return c.json(res);
});

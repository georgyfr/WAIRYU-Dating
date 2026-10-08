/**
 * Routes d'authentification & comptes (Étape 2 — port v1 routes/auth.ts).
 *
 * Parcours : email + OTP 6 chiffres (Turnstile sur la demande) → session cookie
 * signé → /api/me. Connexions sociales Google + Facebook préparées (actives dès
 * la pose des secrets, fusion de comptes par email). Comptes classiques
 * pseudo + mot de passe (PBKDF2-SHA256 100k, verrou 15 min, code de récupération).
 * RGPD dès maintenant : export JSON (droit d'accès) + suppression immédiate
 * (droit à l'effacement) avec trace anonyme purgée à J+30.
 *
 * Anti-énumération : la demande de code ne révèle jamais si l'email existe —
 * l'utilisateur reçoit un email adapté (connexion ou inscription) dans les deux cas.
 *
 * Adaptations v2 vs v1 : /me et /account/export couvrent les tables EXISTANTES
 * (les étapes 3+ étendront) ; le relais OTP par push et la purge Cloudinary
 * suivront avec leurs étapes ; le smoke bypass ADMIN_TOKEN (staging) est conservé.
 */
import { Hono } from 'hono';
import type { Context } from 'hono';
import type { AppEnv } from '../env';
import { errors, AppError } from '../lib/errors';
// P0 âge — validateur strict unique (inscriptions), chemin mineur 403.
import { MinorAgeError, validateBirthDateISO } from '../lib/age';
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
import { sendPushToDevice } from '../lib/push';
import { LIMITS } from '@wairyu/shared';
import type {
  AccountExport,
  AuthConfigResponse,
  FacebookCompleteResponse,
  FacebookLinkResponse,
  MeResponse,
  OAuthCompleteResponse,
  OtpRequestResponse,
  OtpVerifyResponse,
  PasswordForgotResponse,
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

/**
 * P0 âge — consigne un refus d'inscription SANS donnée personnelle en clair :
 * l'identifiant (email ou pseudo) n'apparaît que HACHÉ dans target_id, le
 * flux dans details_json. action = 'signup_minor_refused'.
 */
async function auditMinorRefused(
  db: D1Database,
  flow: 'otp' | 'oauth_google' | 'oauth_facebook' | 'password',
  identifierHash: string | null,
  stage: 'signup' | 'oauth_start',
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO audit_admin (admin, action, target_user, target_id, details, created_at)
       VALUES ('system', 'signup_minor_refused', NULL, ?, ?, ?)`,
    )
    .bind(identifierHash, JSON.stringify({ flow, stage }), Math.floor(Date.now() / 1000))
    .run()
    .catch(() => {
      // Table audit_admin posée à l'Étape 7 : l'audit ne doit jamais casser
      // le refus d'inscription (le 403 est la protection réelle).
    });
}

/**
 * P0 âge — TOUTE INSCRIPTION exige une date de naissance majeure, validée
 * AVANT tout INSERT users.  - absent/vide → 400 (avant TOUTE écriture) ;
 *  - format/date impossible → 400 (lib/age.ts) ;
 *  - âge < 18 ans → AUCUN compte créé : audit 'signup_minor_refused'
 *    (hash de l'identifiant) puis MinorAgeError = 403 générique.
 */
async function requireAdultBirthDate(
  db: D1Database,
  raw: unknown,
  flow: 'otp' | 'oauth_google' | 'oauth_facebook' | 'password',
  identifierHash: string | null,
): Promise<{ birthYear: number; birthDate: string }> {
  if (typeof raw !== 'string' || !raw.trim()) {
    throw errors.badRequest('Date de naissance requise pour créer un compte wairyu.');
  }
  try {
    return validateBirthDateISO(raw);
  } catch (err) {
    if (err instanceof MinorAgeError) {
      await auditMinorRefused(db, flow, identifierHash, 'signup');
    }
    throw err;
  }
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
    // client_id public requis par le bouton GSI (popup FedCM) — sans
    // navigation hors de l'app Android (TWA), voir POST /auth/google/idtoken.
    googleClientId: googleConfigured(c.env) ? c.env.GOOGLE_CLIENT_ID! : null,
    facebookEnabled: facebookConfigured(c.env),
    emailProvider: emailProviderConfigured(c.env) ? 'brevo' : 'dev',
  };
  return c.json(body);
});

// ---------------------------------------------------------------------------
// POST /api/auth/otp/request — demande d'un code (inscription OU connexion)
// Relais fondateur : le code est AUSSI poussé en notification sur les appareils
// DÉJÀ liés au compte (devices liés par session) — l'utilisateur n'a plus à
// fouiller sa boîte mail. L'email reste TOUJOURS envoyé (filet systématique).
// Anti-abus : un appareil NON lié ne reçoit JAMAIS le code d'un autre compte
// (l'appareil demandeur n'est pas considéré tant qu'il n'a pas de session liée).
// ---------------------------------------------------------------------------
authRoutes.post('/auth/otp/request', async (c) => {
  const payload = await c.req.json().catch(() => null);
  const email = normalizeEmail((payload as { email?: unknown } | null)?.email);
  if (!email) throw errors.badRequest('Adresse email invalide.');
  // Adresses placeholder (comptes pseudo / Facebook sans email) : jamais de
  // code — oriente vers le bon canal au lieu d'un email vers nulle part.
  if (isPlaceholderEmail(email)) {
    throw errors.badRequest('Ce compte n\u2019utilise pas d\u2019email. Connectez-vous avec votre pseudo ou le bouton Facebook.');
  }

  // 1) Anti-abus : fenêtres D1 par IP et par email.
  const ip = await ipHash(c);
  const emailHash = await sha256Hex(email);
  // Bypass staging : avec Bearer ADMIN_TOKEN en staging, la réponse renvoie
  // le code (les smokes testent le parcours email OTP même quand Brevo est
  // configuré). En production : impossible (ENVIRONMENT !== 'staging').
  const authHeader0 = c.req.header('authorization') ?? '';
  const smokeBypassOtp =
    c.env.ENVIRONMENT === 'staging' && !!c.env.ADMIN_TOKEN && authHeader0 === `Bearer ${c.env.ADMIN_TOKEN}`;
  const perIp = await hitRateLimit(c.env.DB, RATE_RULES.otpRequestIp, ip);
  if (!perIp.allowed) throw rateLimitedError(perIp.retryAfterSeconds, RATE_RULES.otpRequestIp.scope);
  const perEmail = await hitRateLimit(c.env.DB, RATE_RULES.otpRequestEmail, emailHash);
  if (!perEmail.allowed) throw rateLimitedError(perEmail.retryAfterSeconds, RATE_RULES.otpRequestEmail.scope);

  // 2) Turnstile (fail-closed en prod ; sauté en staging sans secret).
  await verifyTurnstile(c, (payload as { turnstile_token?: unknown } | null)?.turnstile_token, ip);

  // 3) Le compte existe-t-il ? (décision du contenu de l'email, pas de la réponse)
  const user = await c.env.DB.prepare(`SELECT id, status FROM users WHERE email = ? LIMIT 1`)
    .bind(email)
    .first<{ id: string; status: string }>();
  if (user?.status === 'banned') {
    throw errors.forbidden('Ce compte ne peut pas se connecter. Contactez le support.');
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

  // 7) Relais du code en notification (fondateur) — UNIQUEMENT pour une
  //    CONNEXION (compte existant) et uniquement vers les appareils déjà
  //    liés à ce compte via une session (jamais l'appareil anonyme demandeur).
  let pushRelayed = false;
  if (user) {
    const linked = await c.env.DB.prepare(
      `SELECT device_id FROM device_push_subscriptions WHERE user_id = ?`,
    )
      .bind(user.id)
      .all<{ device_id: string }>();
    for (const row of linked.results ?? []) {
      const r = await sendPushToDevice(c.env, row.device_id, {
        title: 'WAIRYU — ton code de connexion',
        body: `Code : ${code} (valable ${LIMITS.otpTtlMinutes} minutes). Personne ne te demandera ce code.`,
        tag: 'wairyu-otp',
        url: '/',
        force: false,
        kind: 'auth',
      });
      const pushOk = r.sent > 0;
      pushRelayed = pushRelayed || pushOk;
      await c.env.DB
        .prepare(
          `INSERT INTO notification_events (id, device_id, user_id, kind, title, body, channel, delivered, error, created_at)
           VALUES (?, ?, ?, 'otp', ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          crypto.randomUUID(),
          row.device_id,
          user.id,
          pushOk ? 'WAIRYU — ton code de connexion' : 'Code de connexion disponible',
          `Code : ${code} (valable ${LIMITS.otpTtlMinutes} minutes).`,
          pushOk ? 'push' : 'inapp',
          1,
          r.error ?? null,
          Math.floor(Date.now() / 1000),
        )
        .run();
      if (r.gone) {
        await c.env.DB.prepare(`DELETE FROM device_push_subscriptions WHERE device_id = ?`)
          .bind(row.device_id)
          .run();
      }
    }
  }

  const body: OtpRequestResponse = {
    sent: true,
    channel: sent.channel === 'dev' ? 'dev' : pushRelayed ? 'email+push' : 'email',
  };
  if (smokeBypassOtp) body.devCode = code; // staging + ADMIN_TOKEN uniquement
  else if (sent.devCode) body.devCode = sent.devCode; // staging-dev sans clé Brevo
  return c.json(body);
});

// ---------------------------------------------------------------------------
// POST /api/auth/otp/verify — vérification → session (création si nouveau)
// ---------------------------------------------------------------------------
authRoutes.post('/auth/otp/verify', async (c) => {
  const payload = await c.req.json().catch(() => null);
  const email = normalizeEmail((payload as { email?: unknown } | null)?.email);
  const code = (payload as { code?: unknown } | null)?.code;
  // P0 âge : exigé UNIQUEMENT à l'INSCRIPTION (compte inexistant) — voir plus bas.
  const rawBirthDate = (payload as { birthDate?: unknown } | null)?.birthDate;
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

  // 4) P0 âge — la validation de la date de naissance PRÉCÈDE la consommation
  //    du code : un refus (absente ou mineur) laisse le code VALABLE, l'écran
  //    affiche le champ et la MÊME saisie est revalidée (aucun renvoi requis).
  //    Améliore aussi le rattrapage Facebook (#/fb-complete), qui repose sur
  //    ce endpoint pour créer le compte.
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
  if (existing?.status === 'banned') throw errors.forbidden('Ce compte ne peut pas se connecter.');
  const birth = existing ? null : await requireAdultBirthDate(c.env.DB, rawBirthDate, 'otp', emailHash);

  // 5) Consommation du code (+ hygiène : purge des autres lignes de cet email).
  const now = Math.floor(Date.now() / 1000);
  await c.env.DB.prepare(`UPDATE auth_codes SET consumed_at = ? WHERE email_hash = ?`)
    .bind(now, emailHash)
    .run();

  // 6) Utilisateur : connexion OU création (fusion OTP/Google par email).
  let userId: string;
  let wasCreated = false;

  if (existing) {
    userId = existing.id;
    if (!existing.email_verified_at) {
      await c.env.DB.prepare(`UPDATE users SET email_verified_at = ?, updated_at = ? WHERE id = ?`)
        .bind(now, now, userId)
        .run();
    }
  } else {
    userId = crypto.randomUUID();
    await c.env.DB.prepare(
      `INSERT INTO users (id, email, email_verified_at, birth_year, birth_date, status, plan, congrats_pending, congrats_via, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'active', 'free', 1, 'email', ?, ?)`,
    )
      .bind(userId, email, now, birth!.birthYear, birth!.birthDate, now, now)
      .run();
    wasCreated = true;
  }

  // 7) Session + cookie signé.
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
  /** P0 âge — date de naissance déclarée au /start (inscriptions OAuth uniquement). */
  birth?: string;
}

const OAUTH_STATE_TTL_SECONDS = 600;

function oauthCookieName(provider: string): string {
  return `wairyu_oauth_${provider}`;
}

function oauthCookiePath(provider: string): string {
  return `/api/auth/${provider}`;
}

/**
 * P0 âge — /auth/{google,facebook}/start : la date de naissance (si le front
 * en fournit une) est validée TÔT et voyage dans le cookie d'état signé.
 * Un compte EXISTANT se connecte sans (l'exigence ne frappe que l'INSERT).
 * Mineur à ce stade → audit (stage 'oauth_start', aucun email connu) + 403.
 */
async function oauthStartBirthDate(
  db: D1Database,
  raw: string | undefined,
  flow: 'oauth_google' | 'oauth_facebook',
): Promise<string | undefined> {
  if (!raw) return undefined;
  try {
    validateBirthDateISO(raw);
    return raw;
  } catch (err) {
    if (err instanceof MinorAgeError) {
      await auditMinorRefused(db, flow, null, 'oauth_start');
    }
    throw err;
  }
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
  /** Nom public Facebook (affichage du compte créé sans email). */
  name?: string;
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

// ---- Complétion différée des inscriptions sociales (Google/Facebook AVEC email) ----
// P0 âge : une INSCRIPTION sociale exige une date de naissance, mais le
// fondateur ne veut NI JSON brut NI friction pour les connexions. Quand le
// callback découvre un email sans compte existant et sans date déclarée au
// /start, il pose ce cookie signé court-lived (10 min) et renvoie vers
// l'écran #/oauth-complete : l'utilisateur saisit sa date, puis
// POST /auth/oauth/complete valide (18+), crée le compte, lie l'identité et
// ouvre la session. Les comptes EXISTANTS ne passent jamais par là.

const PENDING_OAUTH_COOKIE = 'wairyu_oauth_pending';
const PENDING_OAUTH_TTL_SECONDS = 600;

interface PendingOAuthPayload {
  provider: 'google' | 'facebook';
  /** ID utilisateur chez le fournisseur (sub Google / id Facebook). */
  pid: string;
  email: string;
  name?: string;
  exp: number;
}

function encodeSignedPayload(payload: unknown): string {
  return btoa(JSON.stringify(payload)).replace(/\+/g, '-').replace(/\//g, '_');
}

function decodeSignedPayload<T>(raw: string): T | null {
  try {
    return JSON.parse(atob(raw.replace(/-/g, '+').replace(/_/g, '/'))) as T;
  } catch {
    return null;
  }
}

async function setPendingOAuthCookie(c: Context<AppEnv>, payload: PendingOAuthPayload): Promise<void> {
  const raw = encodeSignedPayload(payload);
  const sig = await signValue(raw, c.env.SESSION_HMAC_KEY);
  c.header(
    'Set-Cookie',
    `${PENDING_OAUTH_COOKIE}=${raw}.${sig}; Path=/api/auth; Max-Age=${PENDING_OAUTH_TTL_SECONDS}; HttpOnly; Secure; SameSite=Lax`,
    { append: true },
  );
}

async function readPendingOAuthCookie(c: Context<AppEnv>): Promise<PendingOAuthPayload | null> {
  const cookie = c.req.header('cookie') ?? '';
  const match = cookie
    .split(';')
    .map((s) => s.trim())
    .find((s) => s.startsWith(`${PENDING_OAUTH_COOKIE}=`));
  if (!match) return null;
  const [raw, sig] = match.slice(PENDING_OAUTH_COOKIE.length + 1).split('.');
  if (!raw || !sig) return null;
  if (!(await verifySignature(raw, sig, c.env.SESSION_HMAC_KEY))) return null;
  const payload = decodeSignedPayload<PendingOAuthPayload>(raw);
  if (!payload?.pid || !payload.email || payload.exp < Date.now() / 1000) return null;
  if (payload.provider !== 'google' && payload.provider !== 'facebook') return null;
  return payload;
}

function clearPendingOAuthCookie(c: Context<AppEnv>): void {
  c.header(
    'Set-Cookie',
    `${PENDING_OAUTH_COOKIE}=; Path=/api/auth; Max-Age=0; HttpOnly; Secure; SameSite=Lax`,
    { append: true },
  );
}

/**
 * Retour OAuth convivial : l'utilisateur ne doit JAMAIS voir de JSON brut sur
 * un callback (bug fondateur « Date de naissance requise » en clair). Chaque
 * erreur connue revient dans l'app avec un message lisible (#/?provider=…).
 */
function oauthBack(provider: 'google' | 'facebook', kind: string, message?: string): string {
  const p = new URLSearchParams({ [provider]: kind });
  if (message) p.set('msg', message.slice(0, 200));
  return `/#/?${p.toString()}`;
}

/**
 * Le compte existe-t-il déjà pour cet email vérifié par le fournisseur ?
 * Pré-contrôle des callbacks : il décide entre connexion directe (aucune
 * friction) et inscription différée (complétion de la date de naissance).
 */
async function oauthEmailExists(db: D1Database, email: string): Promise<boolean> {
  const row = await db
    .prepare(`SELECT id FROM users WHERE email = ? LIMIT 1`)
    .bind(email)
    .first<{ id: string }>();
  return !!row;
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
  birthRaw: unknown,
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
    // P0 âge : inscription → date de naissance EXIGÉE (cookie d'état OAuth ou
    // body GSI) et validée AVANT l'INSERT ; mineur → AUCUN compte (audit+403).
    const birth = await requireAdultBirthDate(
      db,
      birthRaw,
      provider === 'google' ? 'oauth_google' : 'oauth_facebook',
      await sha256Hex(profile.email),
    );
    userId = crypto.randomUUID();
    await db
      .prepare(
        `INSERT INTO users (id, email, email_verified_at, display_name, birth_year, birth_date, status, plan, congrats_pending, congrats_via, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, 'active', 'free', 1, ?, ?, ?)`,
      )
      .bind(
        userId,
        profile.email,
        now,
        profile.name?.slice(0, 40) ?? null,
        birth.birthYear,
        birth.birthDate,
        provider,
        now,
        now,
      )
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
  // P0 âge : date de naissance (si fournie) validée tôt et embarquée dans l'état.
  // Un refus (mineur) ne doit pas non plus finir en JSON brut → retour app.
  try {
    const birth = await oauthStartBirthDate(c.env.DB, c.req.query('birthDate') ?? undefined, 'oauth_google');
    await setOAuthStateCookie(c, 'google', {
      state,
      verifier,
      exp: Math.floor(Date.now() / 1000) + OAUTH_STATE_TTL_SECONDS,
      ...(birth ? { birth } : {}),
    });
    return c.redirect(buildAuthorizeUrl(env, redirectUri, state, challenge), 302);
  } catch (e) {
    if (e instanceof AppError) return c.redirect(oauthBack('google', 'error', e.message), 302);
    throw e;
  }
});

authRoutes.get('/auth/google/callback', async (c) => {
  const env = c.env;
  if (!googleConfigured(env)) throw errors.notFound();

  const url = new URL(c.req.url);
  if (url.searchParams.get('error')) return c.redirect('/#/?google=cancelled', 302);

  const state = await readOAuthStateCookie(c, 'google');
  if (!state || url.searchParams.get('state') !== state.state) {
    // Récupérable (cookie expiré, double callback) → retour app, jamais de JSON brut.
    return c.redirect('/#/?google=retry', 302);
  }

  // L'échange du code (réseau Google) et la résolution du compte ne doivent
  // JAMAIS tuer le parcours d'un 500 JSON brut. Sur téléphone (réseau mobile
  // capricieux, double appui qui ré-émis le callback, code à usage unique
  // consommé), l'échec est RÉCUPÉRABLE → message doux + relance via
  // #/?google=retry. Les AppError intentionnelles (compte banni, mineur,
  // email invalide) reviennent dans l'app avec LEUR message lisible.
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

    // Inscription différée : nouvel email SANS date déclarée au /start →
    // écran #/oauth-complete (l'identité attend dans un cookie signé) au lieu
    // d'un 400 « Date de naissance requise » en JSON brut (bug fondateur).
    // Un compte EXISTANT se connecte toujours sans friction.
    if (!state.birth && !(await oauthEmailExists(c.env.DB, email))) {
      await setPendingOAuthCookie(c, {
        provider: 'google',
        pid: profile.sub,
        email,
        ...(profile.name ? { name: profile.name } : {}),
        exp: Math.floor(Date.now() / 1000) + PENDING_OAUTH_TTL_SECONDS,
      });
      clearOAuthStateCookie(c, 'google');
      await bumpMetric(c.env.DB, 'oauth_signup_deferred');
      return c.redirect('/#/oauth-complete?via=google', 302);
    }

    const { userId, created } = await resolveOrCreateOAuthUser(
      c.env.DB,
      'google',
      { id: profile.sub, email, name: profile.name },
      // P0 âge : la date vient du cookie d'état (présente ici ou l'email
      // existait déjà — sinon la branche ci-dessus a déjà détourné le flux).
      state.birth,
    );
    await createSession(c, userId);
    if (created) await bumpMetric(c.env.DB, 'signup_completed');
    await bumpMetric(c.env.DB, 'login_google');
    clearOAuthStateCookie(c, 'google');
    return c.redirect('/#/?google=ok', 302);
  } catch (e) {
    if (e instanceof AppError) return c.redirect(oauthBack('google', 'error', e.message), 302);
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
  // P0 âge : date de naissance (si fournie) validée tôt et embarquée dans l'état.
  // Un refus (mineur) ne doit pas non plus finir en JSON brut → retour app.
  try {
    const birth = await oauthStartBirthDate(c.env.DB, c.req.query('birthDate') ?? undefined, 'oauth_facebook');
    await setOAuthStateCookie(c, 'facebook', {
      state,
      exp: Math.floor(Date.now() / 1000) + OAUTH_STATE_TTL_SECONDS,
      ...(birth ? { birth } : {}),
    });
    return c.redirect(buildFacebookAuthorizeUrl(env, redirectUri, state), 302);
  } catch (e) {
    if (e instanceof AppError) return c.redirect(oauthBack('facebook', 'error', e.message), 302);
    throw e;
  }
});

authRoutes.get('/auth/facebook/callback', async (c) => {
  const env = c.env;
  if (!facebookConfigured(env)) throw errors.notFound();

  const url = new URL(c.req.url);
  if (url.searchParams.get('error')) return c.redirect('/#/?facebook=cancelled', 302);

  const state = await readOAuthStateCookie(c, 'facebook');
  if (!state || url.searchParams.get('state') !== state.state) {
    // Récupérable (cookie expiré, double callback) → retour app, jamais de JSON brut.
    return c.redirect('/#/?facebook=retry', 302);
  }

  // Même blindage que Google — les échecs récupérables (code consommé par un
  // callback rejoué, coupure réseau) renvoient vers #/?facebook=retry ; les
  // AppError intentionnelles reviennent dans l'app avec LEUR message lisible.
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
        ...(profile.name ? { name: profile.name } : {}),
        exp: Math.floor(Date.now() / 1000) + FB_LINK_TTL_SECONDS,
      });
      await bumpMetric(c.env.DB, 'facebook_link_started');
      return c.redirect('/#/fb-complete', 302);
    }

    // Inscription différée — MÊME CORRECTIF que Google (aucun JSON brut) :
    // nouvel email SANS date déclarée → écran #/oauth-complete.
    if (!state.birth && !(await oauthEmailExists(c.env.DB, email))) {
      await setPendingOAuthCookie(c, {
        provider: 'facebook',
        pid: profile.id,
        email,
        ...(profile.name ? { name: profile.name } : {}),
        exp: Math.floor(Date.now() / 1000) + PENDING_OAUTH_TTL_SECONDS,
      });
      clearOAuthStateCookie(c, 'facebook');
      await bumpMetric(c.env.DB, 'oauth_signup_deferred');
      return c.redirect('/#/oauth-complete?via=facebook', 302);
    }

    const { userId, created } = await resolveOrCreateOAuthUser(
      c.env.DB,
      'facebook',
      { id: profile.id, email, name: profile.name },
      // P0 âge : la date vient du cookie d'état (présente ici ou l'email
      // existait déjà — sinon la branche ci-dessus a déjà détourné le flux).
      state.birth,
    );
    await createSession(c, userId);
    if (created) await bumpMetric(c.env.DB, 'signup_completed');
    await bumpMetric(c.env.DB, 'login_facebook');
    clearOAuthStateCookie(c, 'facebook');
    return c.redirect('/#/?facebook=ok', 302);
  } catch (e) {
    if (e instanceof AppError) return c.redirect(oauthBack('facebook', 'error', e.message), 302);
    console.error(
      `[oauth:facebook] échange/résolution échoués (récupérable) : ${e instanceof Error ? e.message : String(e)}`,
    );
    return c.redirect('/#/?facebook=retry', 302);
  }
});

// ---- Complétion différée de l'inscription sociale (#/oauth-complete) ----
// Suite du correctif « Date de naissance requise » en JSON brut : le callback
// Google/Facebook a détourné les NOUVELLES inscriptions sans date vers cet
// écran. L'identité attend dans le cookie signé wairyu_oauth_pending ; la
// validation 18+ (requireAdultBirthDate) reste LE garde-fou avant INSERT.
// Fusion inchangée : si l'email existe déjà (compte créé entre-temps), le
// endpoint se comporte en connexion + liaison d'identité, sans exiger la date.

authRoutes.post('/auth/oauth/complete', async (c) => {
  const pending = await readPendingOAuthCookie(c);
  if (!pending) {
    throw errors.badRequest(
      'Aucune connexion Google/Facebook en attente (lien expiré). Recommencez depuis le bouton Google ou Facebook.',
    );
  }

  // Anti-abus : le cookie signé prouve le passage OAuth, l'IP reste le seul
  // vecteur libre → fenêtre D1 dédiée.
  const ip = await ipHash(c);
  const perIp = await hitRateLimit(c.env.DB, RATE_RULES.oauthCompleteIp, ip);
  if (!perIp.allowed) throw rateLimitedError(perIp.retryAfterSeconds, RATE_RULES.oauthCompleteIp.scope);

  const payload = await c.req.json().catch(() => null);
  const birthRaw = (payload as { birthDate?: unknown } | null)?.birthDate;

  // resolveOrCreateOAuthUser valide la date UNIQUEMENT sur la branche
  // création (mineur → audit + 403 générique) ; branche connexion = fusion.
  const { userId, created } = await resolveOrCreateOAuthUser(
    c.env.DB,
    pending.provider,
    { id: pending.pid, email: pending.email, name: pending.name },
    birthRaw,
  );

  await createSession(c, userId);
  if (created) await bumpMetric(c.env.DB, 'signup_completed');
  await bumpMetric(c.env.DB, pending.provider === 'google' ? 'login_google' : 'login_facebook');
  clearPendingOAuthCookie(c);

  const body: OAuthCompleteResponse = { ok: true, provider: pending.provider, created };
  return c.json(body);
});

// ---- Seed smoke (STAGING UNIQUEMENT) : pose un cookie pending factice ----
// Même politique que le bypass ADMIN_TOKEN de l'OTP : permet de tester
// /auth/oauth/complete de bout en bout (création, 403 mineur, 400 sans date)
// sans compte Google/Facebook réel. En production : 404 (endpoint absent).
authRoutes.post('/auth/oauth/seed', async (c) => {
  const authHeader = c.req.header('authorization') ?? '';
  if (c.env.ENVIRONMENT !== 'staging' || !c.env.ADMIN_TOKEN || authHeader !== `Bearer ${c.env.ADMIN_TOKEN}`) {
    throw errors.notFound();
  }
  const payload = (await c.req.json().catch(() => ({}))) as { provider?: string; email?: string; pid?: string };
  const provider = payload.provider === 'facebook' ? 'facebook' : 'google';
  const email = normalizeEmail(payload.email ?? '');
  if (!email) throw errors.badRequest('email requis pour le seed smoke.');
  await setPendingOAuthCookie(c, {
    provider,
    pid: payload.pid ?? `smoke-${provider}-${Date.now()}`,
    email,
    exp: Math.floor(Date.now() / 1000) + PENDING_OAUTH_TTL_SECONDS,
  });
  return c.json({ seeded: true, provider, email });
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

// ---- Inscription/connexion Facebook SANS email (alternative OTP) ----
// Alternative demandée par le fondateur : sur #/fb-complete, l'utilisateur
// dont la boîte mail est INACCESSIBLE (mot de passe perdu…) ne doit pas être
// bloqué. L'identité Facebook du cookie signé (posé par le callback, preuve
// du passage OAuth réel) SUFFIT :
//  - identité déjà reliée → CONNEXION (zéro friction, même sans date) ;
//  - identité inconnue → CRÉATION : date de naissance 18+ EXIGÉE
//    (requireAdultBirthDate avant tout INSERT, mineur → audit + 403),
//    email placeholder fb-…@inbox.wairyu.local (jamais affiché, même
//    masquage que les comptes pseudo, remplaçable par un email de
//    récupération dans Réglages), congrats_pending armé.
// Anti-abus : cookie signé HMAC (impossible à forger côté client) + fenêtre
// IP oauthCompleteIp + aucun email devinable (pas d'énumération).
authRoutes.post('/auth/facebook/complete', async (c) => {
  const pending = await readFacebookLinkCookie(c);
  if (!pending) {
    throw errors.badRequest(
      'Aucune connexion Facebook en attente (lien expiré). Recommencez depuis le bouton Facebook.',
    );
  }

  const ip = await ipHash(c);
  const perIp = await hitRateLimit(c.env.DB, RATE_RULES.oauthCompleteIp, ip);
  if (!perIp.allowed) throw rateLimitedError(perIp.retryAfterSeconds, RATE_RULES.oauthCompleteIp.scope);

  const now = Math.floor(Date.now() / 1000);
  const existing = await c.env.DB.prepare(
    `SELECT oi.user_id, u.status
     FROM oauth_identities oi JOIN users u ON u.id = oi.user_id
     WHERE oi.provider = 'facebook' AND oi.provider_user_id = ? LIMIT 1`,
  )
    .bind(pending.id)
    .first<{ user_id: string; status: string }>();
  if (existing?.status === 'banned') {
    clearFacebookLinkCookie(c);
    throw errors.forbidden('Ce compte ne peut pas se connecter.');
  }

  let userId: string;
  let created = false;
  if (existing) {
    // Ce Facebook a déjà un compte wairyu : CONNEXION directe.
    userId = existing.user_id;
  } else {
    const payload = (await c.req.json().catch(() => null)) as { birthDate?: unknown } | null;
    const birth = await requireAdultBirthDate(
      c.env.DB,
      payload?.birthDate,
      'oauth_facebook',
      await sha256Hex(`fb:${pending.id}`),
    );
    userId = crypto.randomUUID();
    try {
      await c.env.DB.prepare(
        `INSERT INTO users (id, email, email_verified_at, display_name, birth_year, birth_date, status, plan, congrats_pending, congrats_via, created_at, updated_at)
         VALUES (?, ?, NULL, ?, ?, ?, 'active', 'free', 1, 'facebook', ?, ?)`,
      )
        .bind(
          userId,
          facebookPlaceholderEmail(),
          pending.name?.slice(0, 40) ?? null,
          birth.birthYear,
          birth.birthDate,
          now,
          now,
        )
        .run();
      await c.env.DB.prepare(
        `INSERT INTO oauth_identities (provider, provider_user_id, user_id, email_at_link, created_at, updated_at)
         VALUES ('facebook', ?, ?, NULL, ?, ?)`,
      )
        .bind(pending.id, userId, now, now)
        .run();
    } catch (err) {
      // Course perdue (identité reliée entre-temps) : AUCUN compte orphelin.
      await c.env.DB.prepare(`DELETE FROM users WHERE id = ?`).bind(userId).run().catch(() => {});
      if (String(err).includes('UNIQUE')) {
        throw errors.conflict('Ce compte Facebook est déjà relié à un autre compte wairyu. Utilisez le bouton Facebook pour vous connecter.');
      }
      throw err;
    }
    created = true;
  }

  await createSession(c, userId);
  if (created) await bumpMetric(c.env.DB, 'signup_completed');
  await bumpMetric(c.env.DB, 'login_facebook');
  if (created) await bumpMetric(c.env.DB, 'facebook_noemail_created');
  clearFacebookLinkCookie(c);

  const body: FacebookCompleteResponse = { ok: true, created };
  return c.json(body);
});

// ---- Seed smoke « Facebook sans email » (STAGING UNIQUEMENT) ----
// Pose le cookie wairyu_fblink factice pour tester /auth/facebook/complete
// de bout en bout (création, connexion, 403 mineur, 400 sans date) sans
// compte Facebook réel. En production : 404 (endpoint absent).
authRoutes.post('/auth/facebook/seed', async (c) => {
  const authHeader = c.req.header('authorization') ?? '';
  if (c.env.ENVIRONMENT !== 'staging' || !c.env.ADMIN_TOKEN || authHeader !== `Bearer ${c.env.ADMIN_TOKEN}`) {
    throw errors.notFound();
  }
  const payload = (await c.req.json().catch(() => ({}))) as { id?: string; name?: string };
  const id = (payload.id ?? '').trim() || `smoke-fb-${Date.now()}`;
  await setFacebookLinkCookie(c, {
    id,
    ...(payload.name ? { name: payload.name } : {}),
    exp: Math.floor(Date.now() / 1000) + FB_LINK_TTL_SECONDS,
  });
  return c.json({ seeded: true, id });
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

  const parsed = await parseFacebookSignedRequest(signed, env.FACEBOOK_APP_SECRET!);
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
  const url = `${new URL(c.req.url).origin}/#/data-deletion?code=${confirmationCode}`;
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
// GET /api/me — profil de l'utilisateur authentifié (schéma v2 — l'Étape 3
// ajoutera les champs profil : birth_date ISO, gender, orientation, intent…)
// ---------------------------------------------------------------------------
authRoutes.get('/me', async (c) => {
  const session = await requireAuth(c);
  const user = await c.env.DB.prepare(
    `SELECT u.id, u.email, u.display_name, u.email_verified_at, u.status, u.plan, u.created_at,
            u.birth_year, u.birth_date,
            ap.username AS username
     FROM users u
     LEFT JOIN auth_password ap ON ap.user_id = u.id
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
    }>();
  if (!user) throw errors.unauthorized();

  const body: MeResponse = {
    userId: user.id,
    email: user.email,
    displayName: user.display_name,
    // @pseudo de connexion : s'affiche TOUJOURS à la place du préfixe email
    // (les comptes classiques ont un email placeholder).
    username: user.username ?? null,
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
// Schéma v2 : couvre TOUTES les tables existantes à ce stade (user, sessions,
// identités OAuth, notifications/appareils, identifiants). Les étapes 3+
// étendront la structure (les champs s'ajoutent, jamais cassés).
// ---------------------------------------------------------------------------
authRoutes.get('/account/export', async (c) => {
  const session = await requireAuth(c);
  const user = await c.env.DB.prepare(`SELECT * FROM users WHERE id = ? LIMIT 1`)
    .bind(session.userId)
    .first<Record<string, unknown>>();
  if (!user) throw errors.unauthorized();

  const [sessions, sessionsRecent, identities, devices, pushSubs, events, pw] = await Promise.all([
    c.env.DB.prepare(
      `SELECT
         COUNT(*) FILTER (WHERE revoked_at IS NULL AND expires_at > ?) AS active,
         COUNT(*) AS total
       FROM sessions WHERE user_id = ?`,
    )
      .bind(Math.floor(Date.now() / 1000), session.userId)
      .first<{ active: number; total: number }>(),
    c.env.DB.prepare(
      `SELECT created_at, last_seen_at, expires_at, revoked_at
       FROM sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT 20`,
    )
      .bind(session.userId)
      .all<Record<string, unknown>>()
      .then((r) => r.results ?? []),
    c.env.DB.prepare(
      `SELECT provider, provider_user_id, email_at_link, created_at, updated_at
       FROM oauth_identities WHERE user_id = ?`,
    )
      .bind(session.userId)
      .all<Record<string, unknown>>()
      .then((r) => r.results ?? [])
      .catch(() => [] as Record<string, unknown>[]),
    c.env.DB.prepare(
      `SELECT id, platform, user_agent, first_open_at, last_open_at, open_count, created_at
       FROM devices WHERE user_id = ?`,
    )
      .bind(session.userId)
      .all<Record<string, unknown>>()
      .then((r) => r.results ?? [])
      .catch(() => [] as Record<string, unknown>[]),
    c.env.DB.prepare(
      `SELECT id, endpoint, platform, created_at FROM device_push_subscriptions WHERE user_id = ?`,
    )
      .bind(session.userId)
      .all<Record<string, unknown>>()
      .then((r) => r.results ?? [])
      .catch(() => [] as Record<string, unknown>[]),
    c.env.DB.prepare(
      `SELECT kind, title, body, channel, delivered, created_at
       FROM notification_events WHERE user_id = ? ORDER BY created_at DESC LIMIT 200`,
    )
      .bind(session.userId)
      .all<Record<string, unknown>>()
      .then((r) => r.results ?? [])
      .catch(() => [] as Record<string, unknown>[]),
    c.env.DB.prepare(`SELECT username, recovery_code_hash, created_at FROM auth_password WHERE user_id = ? LIMIT 1`)
      .bind(session.userId)
      .first<{ username: string; recovery_code_hash: string | null; created_at: number }>()
      .catch(() => null),
  ]);

  const body: AccountExport = {
    exportedAt: new Date().toISOString(),
    format: 'wairyu-export-v1',
    user: user ?? {},
    sessions: { active: sessions?.active ?? 0, revoked_total: sessions?.total ?? 0 },
    sessionsRecent,
    oauthIdentities: identities,
    notifications: {
      devices,
      pushSubscriptions: pushSubs,
      events,
      note: 'Les endpoints push (URLs FCM/Mozilla) sont des identifiants techniques liés aux appareils, pas des données de contact.',
    },
    credentials: {
      hasPassword: pw !== null,
      username: pw?.username ?? null,
      note: 'Aucun secret d\u2019authentification (hash de mot de passe, code de récupération) n\u2019est exporté — ils sont inutilisables hors du système et leur divulgation créerait un risque.',
    },
    consents: {
      email_verified_at: user['email_verified_at'] ?? null,
      birth_date_declared: user['birth_date'] ?? null,
      note: 'Consentements et déclarations horodatées (confidentialité v2 — Étape 0).',
    },
    audit: {
      note: 'Export RGPD — droit d\u2019accès (art. 15) et portabilité (art. 20) : l\u2019intégralité des données personnelles traitées par wairyu à ce stade est couverte ci-dessus. Les étapes suivantes (profil, questionnaire, découverte, conversations, sécurité) étendront cette export au fur et à mesure.',
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

  // 2) Sessions révoquées puis supprimées ; identités OAuth déliées ;
  //    liaisons de notifications détachées ; compte supprimé.
  //    (La purge des médias Cloudinary suivra avec l'Étape 3.)
  await revokeAllSessions(c, userId);
  await c.env.DB.prepare(`DELETE FROM sessions WHERE user_id = ?`).bind(userId).run();
  await c.env.DB.prepare(`DELETE FROM oauth_identities WHERE user_id = ?`).bind(userId).run();
  await c.env.DB.prepare(`DELETE FROM device_push_subscriptions WHERE user_id = ?`).bind(userId).run();
  await c.env.DB.prepare(`DELETE FROM devices WHERE user_id = ?`).bind(userId).run();
  await c.env.DB.prepare(`DELETE FROM auth_password WHERE user_id = ?`).bind(userId).run();
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
// POST /api/auth/google/idtoken : bouton GSI (popup FedCM).
// Le front reçoit le jeton ID dans la page (AUCUNE navigation hors de la TWA
// Android, où le flux authorize casse) et le poste ici. Vérification
// cryptographique complète côté serveur (lib/google.verifyGoogleIdToken).
// ---------------------------------------------------------------------------
authRoutes.post('/auth/google/idtoken', async (c) => {
  const env = c.env;
  if (!googleConfigured(env)) throw errors.notFound();
  const body = (await c.req.json().catch(() => null)) as { credential?: unknown; birthDate?: unknown } | null;
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
      // P0 âge : le front GSI poste birthDate avec le credential (inscriptions).
    }, body?.birthDate);
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
// Comptes « classiques » pseudo + mot de passe.
//  - inscription : pseudo (espaces/accents) + mot de passe → code de
//    récupération affiché UNE fois + email placeholder (pas d'email requis) ;
//  - connexion : @pseudo OU email + mot de passe (verrou 15 min après 5 échecs) ;
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

/**
 * Email placeholder des comptes Facebook SANS email partagé — MÊME DOMAINE
 * masqué que les comptes pseudo (@inbox.wairyu.local) : les gardes existants
 * (récovery-email, masquage profil front) s'appliquent automatiquement.
 * Aléatoire (comme pw-) : zéro collision, l'identité se retrouve par
 * oauth_identities (provider_user_id), pas par l'email.
 */
function facebookPlaceholderEmail(): string {
  return `fb-${crypto.randomUUID().replace(/-/g, '')}@${RECOVERY_CODE_PLACEHOLDER_EMAIL_DOMAIN}`;
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

/** Verrou actif ? → 429 avec le délai restant en minutes. */
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

  // P0 âge : date de naissance EXIGÉE et validée AVANT l'INSERT users
  // (mineur → AUCUN compte, audit 'signup_minor_refused', 403 générique).
  // Pas d'email réel dans ce flux : l'empreinte d'audit hache le pseudo canonique.
  const birth = await requireAdultBirthDate(
    c.env.DB,
    payload?.birthDate,
    'password',
    await sha256Hex(`pw:${username}`),
  );

  const now = Math.floor(Date.now() / 1000);
  const userId = crypto.randomUUID();
  const recoveryCode = generateRecoveryCode();
  const recoveryCodeHash = await sha256HexPw(normalizeRecoveryCode(recoveryCode));
  // users d'abord (email placeholder UNIQUE) — si auth_password échoue
  // (pseudo pris entre-temps), on nettoie : AUCUN compte orphelin.
  await c.env.DB.prepare(
    `INSERT INTO users (id, email, email_verified_at, birth_year, birth_date, status, plan, congrats_pending, congrats_via, created_at, updated_at)
     VALUES (?, ?, NULL, ?, ?, 'active', 'free', 1, 'password', ?, ?)`,
  )
    .bind(userId, placeholderEmail(), birth.birthYear, birth.birthDate, now, now)
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
  const identifierRaw = String(payload?.username ?? '').trim();
  // L'identifiant peut être un PSEUDO OU UN EMAIL — les comptes email/Google/
  // Facebook peuvent créer un mot de passe, ils se connectent alors avec leur
  // adresse. Un email ne peut jamais entrer en collision avec un pseudo :
  // normalizeUsername retire tout caractère hors [a-z0-9_], donc un pseudo
  // canonique ne contient jamais « @ » ni « . ».
  const identifier = identifierRaw.includes('@') ? identifierRaw.toLowerCase() : normalizeUsername(identifierRaw);
  const password = typeof payload?.password === 'string' ? payload.password : '';
  if (!identifier || !password) {
    throw errors.badRequest('Indique ton pseudo ou ton email et ton mot de passe.');
  }
  const ip = await ipHash(c);
  const authHeader = c.req.header('authorization') ?? '';
  const smokeBypass =
    c.env.ENVIRONMENT === 'staging' && !!c.env.ADMIN_TOKEN && authHeader === `Bearer ${c.env.ADMIN_TOKEN}`;
  const perIp = smokeBypass
    ? { allowed: true, remaining: 0, retryAfterSeconds: 0 }
    : await hitRateLimit(c.env.DB, RATE_RULES.pwLoginIp, ip);
  if (!perIp.allowed) throw rateLimitedError(perIp.retryAfterSeconds, RATE_RULES.pwLoginIp.scope);
  const perUser = await hitRateLimit(c.env.DB, RATE_RULES.pwLoginUser, identifier);
  if (!perUser.allowed) throw rateLimitedError(perUser.retryAfterSeconds, RATE_RULES.pwLoginUser.scope);

  const row = await findPasswordByUsername(c.env.DB, identifier);
  if (!row) throw errors.unauthorized('Pseudo, email ou mot de passe incorrect.');
  lockedError(row.locked_until);
  const ok = await verifyPassword(password, row.password_hash);
  if (!ok) {
    await registerLockFailure(c.env.DB, row);
    throw errors.unauthorized('Pseudo, email ou mot de passe incorrect.');
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
  // Placeholder (pseudo / Facebook sans email) : pas d'email de récupération
  // possible — message qui oriente au lieu d'un envoi vers nulle part.
  if (isPlaceholderEmail(email)) {
    throw errors.badRequest('Ce compte n\u2019a pas d\u2019email de récupération. Connectez-vous avec votre pseudo ou le bouton Facebook.');
  }
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
  const res: PasswordForgotResponse = { sent: true, channel: 'email' };
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

// Mot de passe OPTIONNEL pour les comptes qui n'en ont pas encore (inscription
// email, Google, Facebook). La session connectée fait office de preuve
// d'identité — pas besoin de code par email. Le mot de passe devient une 2e
// voie de connexion. L'identifiant de connexion est l'email du compte
// (username = email, username_canonical = email minuscule — zéro collision
// possible avec un pseudo, voir /auth/password/login).
authRoutes.post('/auth/password/set', async (c) => {
  const session = await requireAuth(c);
  const payload = (await c.req.json().catch(() => null)) as Record<string, unknown> | null;
  const password = typeof payload?.password === 'string' ? payload.password : '';
  const policy = passwordPolicyError(password);
  if (policy) throw errors.badRequest(policy);
  const ip = await ipHash(c);
  const perIp = await hitRateLimit(c.env.DB, RATE_RULES.pwSetIp, ip);
  if (!perIp.allowed) throw rateLimitedError(perIp.retryAfterSeconds, RATE_RULES.pwSetIp.scope);

  const existing = await c.env.DB.prepare(`SELECT user_id FROM auth_password WHERE user_id = ? LIMIT 1`)
    .bind(session.userId)
    .first<{ user_id: string }>();
  if (existing) {
    throw errors.badRequest('Ton compte a déjà un mot de passe — utilise « changer mon mot de passe ».');
  }
  const user = await c.env.DB.prepare(`SELECT email FROM users WHERE id = ? LIMIT 1`)
    .bind(session.userId)
    .first<{ email: string }>();
  if (!user) throw errors.unauthorized();
  if (isPlaceholderEmail(user.email)) {
    throw errors.badRequest('Ce compte n\u2019a pas d\u2019adresse email réelle pour ancrer un mot de passe.');
  }
  const email = user.email.toLowerCase();
  const now = Math.floor(Date.now() / 1000);
  try {
    await c.env.DB.prepare(
      `INSERT INTO auth_password (user_id, username, username_canonical, password_hash, recovery_code_hash, failed_attempts, created_at, updated_at)
       VALUES (?, ?, ?, ?, NULL, 0, ?, ?)`,
    )
      .bind(session.userId, email, email, await hashPassword(password), now, now)
      .run();
  } catch (err) {
    if (String(err).includes('UNIQUE')) {
      throw errors.conflict('Cet email est déjà rattaché à un autre identifiant de connexion wairyu.');
    }
    throw err;
  }
  await bumpMetric(c.env.DB, 'password_set');
  return c.json({ ok: true, username: email });
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

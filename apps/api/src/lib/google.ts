/**
 * Google OAuth 2.0 — web application flow (Étape 2, gratuit).
 * Préparé et fonctionnel dès que GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
 * sont posés en secrets (fonctionnalité signalée au front via /api/auth/config).
 * Fusion de comptes : si l'email Google correspond à un compte existant
 * (créé par OTP), la session s'ouvre sur CE compte — aucune duplication.
 * PKCE (S256) + state en cookie httpOnly : anti-CSRF et anti-interception.
 */

import type { Env } from '../env';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://openidconnect.googleapis.com/v1/userinfo';

export interface GoogleProfile {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
}

export type GoogleEnv = Env & { GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string };

export function googleConfigured(env: Env): env is GoogleEnv {
  return Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
}

/** URL d'autorisation Google (redirect_uri = callback officiel du worker). */
export function buildAuthorizeUrl(
  env: GoogleEnv,
  redirectUri: string,
  state: string,
  codeChallenge: string,
): string {
  const url = new URL(GOOGLE_AUTH_URL);
  url.searchParams.set('client_id', env.GOOGLE_CLIENT_ID);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'openid email profile');
  url.searchParams.set('state', state);
  url.searchParams.set('code_challenge', codeChallenge);
  url.searchParams.set('code_challenge_method', 'S256');
  url.searchParams.set('prompt', 'select_account');
  return url.toString();
}

/** Échange le code d'autorisation contre un access token puis le profil. */
export async function exchangeCodeForProfile(
  env: GoogleEnv,
  code: string,
  redirectUri: string,
  codeVerifier: string,
): Promise<GoogleProfile> {
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  });
  if (!res.ok) {
    throw new Error(`google_token_exchange_failed:${res.status}`);
  }
  const tokens = (await res.json()) as { access_token?: string };
  if (!tokens.access_token) throw new Error('google_no_access_token');

  const info = await fetch(GOOGLE_USERINFO_URL, {
    headers: { authorization: `Bearer ${tokens.access_token}` },
  });
  if (!info.ok) throw new Error(`google_userinfo_failed:${info.status}`);
  return (await info.json()) as GoogleProfile;
}

/** PKCE : générateur verifier/challenge S256. */
export async function generatePkce(): Promise<{ verifier: string; challenge: string }> {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const verifier = base64url(bytes);
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  return { verifier, challenge: base64url(new Uint8Array(digest)) };
}

function base64url(buf: Uint8Array): string {
  let bin = '';
  for (const b of buf) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// ---------------------------------------------------------------------------
// Task 57 — Sign in with Google (GSI) en popup FedCM : vérification du jeton
// d'identification côté serveur. Pourquoi : dans l'app Android (TWA), la
// redirection plein écran vers accounts.google.com fait sortir wairyu du
// contexte de l'app — sur certains téléphones (tueurs de tâches agressifs,
// crash Custom Tabs documentés) l'Activity est fermée pendant la connexion et
// l'utilisateur revient au launcher. La popup GSI/FedCM s'ouvre DANS la page :
// plus aucune navigation hors de l'app. Le front reçoit un jeton d'identification
// (JWT) que l'on vérifie ici avec les clés publiques Google (JWKS) — même
// résultat final que le callback : compte résolu + session posée.
// ---------------------------------------------------------------------------

const GOOGLE_JWKS_URL = 'https://www.googleapis.com/oauth2/v3/certs';
/** Clés JWKS mises en cache (Google tourne les clés ; 12 h est l'usage courant). */
let jwksCache: { keys: GoogleJwk[]; fetchedAt: number } | null = null;
const JWKS_TTL_MS = 12 * 60 * 60 * 1000;

interface GoogleIdTokenClaims {
  iss: string;
  aud: string;
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  exp: number;
}

/** JWK Google : le type DOM JsonWebKey n'expose pas kid — on l'étend. */
interface GoogleJwk extends JsonWebKey {
  kid: string;
  n: string;
  e: string;
}

function base64UrlDecode(input: string): Uint8Array {
  const bin = atob(input.replace(/-/g, '+').replace(/_/g, '/'));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function fetchGoogleJwks(): Promise<GoogleJwk[]> {
  if (jwksCache && Date.now() - jwksCache.fetchedAt < JWKS_TTL_MS) return jwksCache.keys;
  const res = await fetch(GOOGLE_JWKS_URL, {
    cf: { cacheEverything: true, cacheTtl: 3600 },
  } as RequestInit);
  if (!res.ok) throw new Error(`google_jwks_failed:${res.status}`);
  const body = (await res.json()) as { keys?: GoogleJwk[] };
  const keys = body.keys ?? [];
  if (keys.length === 0) throw new Error('google_jwks_empty');
  jwksCache = { keys, fetchedAt: Date.now() };
  return keys;
}

/**
 * Vérifie un jeton d'identification Google (format JWT) : signature RS256
 * contre le JWKS officiel, émetteur, audience (= notre client_id) et
 * expiration. Renvoie le profil si le jeton est authentique ; lève une erreur
 * descriptive (jamais de 500 brut — le front présente le message doux).
 */
export async function verifyGoogleIdToken(
  env: GoogleEnv,
  credential: string,
): Promise<GoogleProfile> {
  const parts = credential.split('.');
  if (parts.length !== 3) throw new Error('google_idtoken_malformed');
  const signedPart = parts[0];
  const payloadPart = parts[1];
  const signaturePart = parts[2];
  if (!signedPart || !payloadPart || !signaturePart) throw new Error('google_idtoken_malformed');
  let header: { kid?: string; alg?: string };
  let claims: GoogleIdTokenClaims;
  try {
    header = JSON.parse(new TextDecoder().decode(base64UrlDecode(signedPart)));
    claims = JSON.parse(new TextDecoder().decode(base64UrlDecode(payloadPart)));
  } catch {
    throw new Error('google_idtoken_malformed');
  }
  if (header.alg !== 'RS256' || !header.kid) throw new Error('google_idtoken_alg_unsupported');

  const keys = await fetchGoogleJwks();
  const jwk = keys.find((k) => k.kid === header.kid);
  if (!jwk) throw new Error('google_idtoken_unknown_key');

  const key = await crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify'],
  );
  const data = new TextEncoder().encode(`${signedPart}.${payloadPart}`);
  const signature = base64UrlDecode(signaturePart);
  const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, signature, data);
  if (!ok) throw new Error('google_idtoken_bad_signature');

  const now = Math.floor(Date.now() / 1000);
  if (claims.exp + 60 < now) throw new Error('google_idtoken_expired');
  const issuers = ['https://accounts.google.com', 'accounts.google.com'];
  if (!issuers.includes(claims.iss)) throw new Error('google_idtoken_bad_issuer');
  if (claims.aud !== env.GOOGLE_CLIENT_ID) throw new Error('google_idtoken_bad_audience');
  if (claims.email_verified !== true) throw new Error('google_idtoken_email_unverified');
  if (!claims.email) throw new Error('google_idtoken_email_missing');

  return {
    sub: claims.sub,
    email: claims.email,
    email_verified: true,
    name: claims.name,
  };
}

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

/**
 * Facebook Login (OAuth 2.0, Graph API v21.0) — Étape 2-bis.
 * Même modèle que Google : inactif tant que FACEBOOK_APP_ID / FACEBOOK_APP_SECRET
 * ne sont pas posés en secrets, actif ensuite sans redéploiement (signalé au front
 * via /api/auth/config). L'identité (provider, id) est conservée dans
 * oauth_identities — indispensable au callback de suppression de données Meta.
 *
 * Email : Meta refuse le scope « email » sur les apps récentes (Invalid Scopes,
 * constaté en production 2026-09). Le dialogue ne demande donc que
 * public_profile (secret FACEBOOK_SCOPES pour surcharger) ; si le profil /me
 * n'expose pas d'email, le callback bascule sur le rattrapage OTP
 * (cookie signé + POST /api/auth/facebook/link — voir routes/auth.ts).
 * Particularités Meta :
 *  - pas de PKCE pour le web → protection CSRF par `state` en cookie httpOnly signé ;
 *  - `appsecret_proof` (HMAC du token avec le secret d'app) sur les appels Graph ;
 *  - callback « Data Deletion Request » obligatoire (signed_request HMAC-SHA256).
 */

import type { Env } from '../env';

const FB_GRAPH_VERSION = 'v21.0';
const FB_DIALOG_URL = `https://www.facebook.com/${FB_GRAPH_VERSION}/dialog/oauth`;
const FB_TOKEN_URL = `https://graph.facebook.com/${FB_GRAPH_VERSION}/oauth/access_token`;
const FB_ME_URL = `https://graph.facebook.com/${FB_GRAPH_VERSION}/me`;

export interface FacebookProfile {
  id: string;
  name?: string;
  /** Absent si le compte Facebook n'a pas d'email confirmé (inscription par téléphone). */
  email?: string;
}

export type FacebookEnv = Env & { FACEBOOK_APP_ID: string; FACEBOOK_APP_SECRET: string };

export function facebookConfigured(env: Env): env is FacebookEnv {
  return Boolean(env.FACEBOOK_APP_ID && env.FACEBOOK_APP_SECRET);
}

/** URL d'autorisation Facebook (redirect_uri = callback officiel du worker). */
export function buildFacebookAuthorizeUrl(
  env: FacebookEnv,
  redirectUri: string,
  state: string,
): string {
  const url = new URL(FB_DIALOG_URL);
  url.searchParams.set('client_id', env.FACEBOOK_APP_ID);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('state', state);
  url.searchParams.set('response_type', 'code');
  // Défaut public_profile : le scope « email » est refusé par Meta sur les apps
  // récentes et bloquait le dialogue (« Invalid Scopes »). Surchargable via le
  // secret FACEBOOK_SCOPES (ex. « public_profile email ») si Meta accorde la
  // permission à l'app — sans redéploiement.
  const scopes = (env.FACEBOOK_SCOPES ?? 'public_profile').trim() || 'public_profile';
  url.searchParams.set('scope', scopes);
  return url.toString();
}

/** Échange le code d'autorisation contre un access token puis le profil /me. */
export async function exchangeFacebookCodeForProfile(
  env: FacebookEnv,
  code: string,
  redirectUri: string,
): Promise<FacebookProfile> {
  const tokenUrl = new URL(FB_TOKEN_URL);
  tokenUrl.searchParams.set('client_id', env.FACEBOOK_APP_ID);
  tokenUrl.searchParams.set('client_secret', env.FACEBOOK_APP_SECRET);
  tokenUrl.searchParams.set('redirect_uri', redirectUri);
  tokenUrl.searchParams.set('code', code);

  const res = await fetch(tokenUrl, { method: 'GET' });
  if (!res.ok) throw new Error(`facebook_token_exchange_failed:${res.status}`);
  const tokens = (await res.json()) as { access_token?: string };
  if (!tokens.access_token) throw new Error('facebook_no_access_token');

  const meUrl = new URL(FB_ME_URL);
  meUrl.searchParams.set('fields', 'id,name,email');
  meUrl.searchParams.set('access_token', tokens.access_token);
  // Preuve que l'appel émane du serveur de l'app (si « Require App Secret » est actif chez Meta).
  meUrl.searchParams.set('appsecret_proof', await appSecretProof(tokens.access_token, env.FACEBOOK_APP_SECRET));
  const me = await fetch(meUrl);
  if (!me.ok) throw new Error(`facebook_me_failed:${me.status}`);
  return (await me.json()) as FacebookProfile;
}

/** Vérifie le signed_request du callback « Data Deletion Request » Meta. */
export async function parseFacebookSignedRequest(
  signedRequest: string,
  appSecret: string,
): Promise<{ user_id: string } | null> {
  const dot = signedRequest.indexOf('.');
  if (dot <= 0) return null;
  const encodedSig = signedRequest.slice(0, dot);
  const payload = signedRequest.slice(dot + 1);
  let data: { user_id?: string; algorithm?: string };
  try {
    data = JSON.parse(base64urlDecode(payload)) as { user_id?: string; algorithm?: string };
  } catch {
    return null;
  }
  if (data.algorithm !== 'HMAC-SHA256' || !data.user_id) return null;

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(appSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  const expected = base64urlEncode(new Uint8Array(sig));
  if (!timingSafeEqual(encodedSig, expected)) return null;
  return { user_id: data.user_id };
}

async function appSecretProof(accessToken: string, appSecret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(appSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(accessToken));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function base64urlDecode(value: string): string {
  return atob(value.replace(/-/g, '+').replace(/_/g, '/'));
}

function base64urlEncode(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

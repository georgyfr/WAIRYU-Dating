/**
 * Web Push (VAPID) — Étape 6.8.
 * Les secrets VAPID_* sont OPTIONNELS : sans eux, l'API répond
 * { enabled:false } et rien ne se passe (dégradation gracieuse, aucune erreur
 * côté front). L'envoi lui-même vit dans lib/push.ts (appels DO + Worker).
 */
import { Hono } from 'hono';
import type { Context } from 'hono';
import type { AppEnv } from '../env';
import { errors } from '../lib/errors';
import { pushEnabled, sendPushToUser } from '../lib/push';
import { RATE_RULES, hitRateLimit, rateLimitedError } from '../lib/ratelimit';
import type { PushConfigResponse, PushSubscribeResponse, PushTestResponse } from '@wairyu/shared';

export const pushRoutes = new Hono<AppEnv>();

async function requireUser(c: Context<AppEnv>) {
  const session = c.get('session');
  if (!session) throw errors.unauthorized();
  const user = await c.env.DB.prepare(`SELECT id, status FROM users WHERE id = ? LIMIT 1`)
    .bind(session.userId)
    .first<{ id: string; status: string }>();
  if (!user || user.status === 'deleted') throw errors.unauthorized();
  if (user.status === 'banned') throw errors.forbidden('Compte suspendu.');
  return user;
}

/** GET /api/push/key — clé publique VAPID à passer au pushManager.subscribe. */
pushRoutes.get('/push/key', async (c) => {
  const enabled = await pushEnabled(c.env);
  const body: PushConfigResponse = { enabled, publicKey: enabled ? (c.env.VAPID_PUBLIC_KEY ?? null) : null };
  return c.json(body);
});

/** POST /api/push/subscribe {endpoint, keys:{p256dh, auth}} — 1 ligne/appareil. */
pushRoutes.post('/push/subscribe', async (c) => {
  const user = await requireUser(c);
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.pushUser, user.id);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.pushTest.scope);

  const enabled = await pushEnabled(c.env);
  if (!enabled) {
    const body: PushSubscribeResponse = { ok: true, enabled: false };
    return c.json(body);
  }

  const payload = (await c.req.json().catch(() => null)) as {
    endpoint?: unknown;
    keys?: { p256dh?: unknown; auth?: unknown };
  } | null;
  const endpoint = typeof payload?.endpoint === 'string' ? payload.endpoint : '';
  const p256dh = typeof payload?.keys?.p256dh === 'string' ? payload.keys.p256dh : '';
  const auth = typeof payload?.keys?.auth === 'string' ? payload.keys.auth : '';
  if (!endpoint.startsWith('https://') || !p256dh || !auth) {
    throw errors.badRequest('Abonnement push invalide.');
  }
  if (endpoint.length > 1024) throw errors.badRequest('Endpoint trop long.');

  const now = Math.floor(Date.now() / 1000);
  const ua = (c.req.header('user-agent') ?? '').slice(0, 200);
  await c.env.DB.prepare(
    `INSERT INTO push_subscriptions (endpoint, user_id, p256dh, auth, user_agent, created_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT (endpoint) DO UPDATE SET
       user_id = excluded.user_id, p256dh = excluded.p256dh, auth = excluded.auth,
       user_agent = excluded.user_agent`,
  )
    .bind(endpoint, user.id, p256dh, auth, ua, now)
    .run();

  const body: PushSubscribeResponse = { ok: true, enabled: true };
  return c.json(body);
});

/** POST /api/push/unsubscribe {endpoint} — désabonnement (réglages). */
pushRoutes.post('/push/unsubscribe', async (c) => {
  const user = await requireUser(c);
  const payload = (await c.req.json().catch(() => null)) as { endpoint?: unknown } | null;
  const endpoint = typeof payload?.endpoint === 'string' ? payload.endpoint : '';
  if (!endpoint) throw errors.badRequest('Endpoint manquant.');
  await c.env.DB.prepare(`DELETE FROM push_subscriptions WHERE endpoint = ? AND user_id = ?`)
    .bind(endpoint, user.id)
    .run();
  return c.json({ ok: true as const });
});

// ---------------------------------------------------------------------------
// Task 54 — SIMULATION : « fais-moi apparaître une notification sur mon PC
// avec le nom de l'application dessus ». POST /api/push/test — l'utilisateur
// connecté s'envoie à LUI-MÊME un VRAI push (Worker → VAPID → FCM/Apple →
// Service Worker → bulle du système) pour VÉRIFIER que le pipeline complet
// fonctionne sur ses appareils — ce n'est PAS une notification locale.
// Titre = nom de l'app, corps horodaté (chaque simulation est unique et
// renotify garantit l'affichage même si une ancienne bulle traîne).
// force:true → la bulle OS apparaît même page visible (c'est le but de la
// démonstration) ; les pushes métier gardent l'anti-doublon Task 53.
// ---------------------------------------------------------------------------

pushRoutes.post('/push/test', async (c) => {
  const user = await requireUser(c);
  // Task 53 (fusion) : règle DÉDIÉE pushTest (5 / 10 min) — plus stricte que
  // pushUser (30/h) car un bouton de démonstration est un vecteur de spam.
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.pushTest, user.id);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.pushTest.scope);

  const enabled = await pushEnabled(c.env);
  if (!enabled) {
    const body: PushTestResponse = { ok: false, sent: 0, enabled: false };
    return c.json(body);
  }

  const now = new Date();
  let when: string;
  try {
    when = new Intl.DateTimeFormat('fr-FR', {
      timeZone: 'Africa/Douala',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    }).format(now);
  } catch {
    when = now.toISOString().slice(0, 16).replace('T', ' ');
  }
  const sent = await sendPushToUser(c.env, user.id, {
    title: 'WAIRYU 🔥',
    body: `Simulation réussie — le push web fonctionne (${when}, heure de Douala). Tes messages et matchs apparaîtront comme ceci.`,
    tag: `wairyu-test-${now.getTime()}`,
    url: '#/matches',
    force: true,
    bypassPrefs: true,
    // Task 62 : réponse à l'action explicite de l'utilisateur
  });
  const body: PushTestResponse = { ok: sent > 0, sent, enabled: true };
  return c.json(body);
});

// ---------------------------------------------------------------------------
// Task 59 (fondateur) — « À l'inscription, félicite-moi avec une notification »
// POST /api/push/welcome — envoyée par le front DÈS l'abonnement push réussi
// (juste après l'inscription classique Task 58, ou à la réactivation). Elle
// récompense l'acceptation de la permission : premier vrai push = preuve vivante
// que « messages et matchs t'annonceront comme ça, même app fermée ».
// bypassPrefs : réponse à une action explicite — jamais filtrée (Task 62).
// ---------------------------------------------------------------------------
pushRoutes.post('/push/welcome', async (c) => {
  const user = await requireUser(c);
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.pushTest, user.id);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.pushTest.scope);
  const enabled = await pushEnabled(c.env);
  if (!enabled) {
    const body = { ok: false, sent: 0, enabled: false };
    return c.json(body);
  }
  const row = await c.env.DB.prepare(`SELECT username FROM auth_password WHERE user_id = ? LIMIT 1`)
    .bind(user.id)
    .first<{ username: string | null }>();
  const who = row?.username ? ` @${row.username}` : '';
  const now = Date.now();
  const sent = await sendPushToUser(c.env, user.id, {
    title: 'WAIRYU 🎉',
    body: `Félicitations${who} ! Ton compte est créé. Ta personne idéale est peut-être en ligne en ce moment — avance et trouve celle ou celui qui te convient 💛`,
    tag: `wairyu-welcome-${now}`,
    url: '#/discover',
    force: true,
    bypassPrefs: true,
    // Task 62 : réponse à l'action explicite de l'utilisateur
  });
  const body = { ok: sent > 0, sent, enabled: true };
  return c.json(body);
});

// ---------------------------------------------------------------------------
// Task 62 (fondateur) — « notifications automatiques, choix des types dans
// Réglages ». GET : état courant (défaut tout activé). PUT : écriture partielle
// (enabled seul, types seul, ou les deux) — upsert D1 (0010_push_preferences
// → migration 0020). Types filtrés côté Worker à CHAQUE push métier.
// ---------------------------------------------------------------------------
const PUSH_TYPES = ['message', 'match', 'checkin', 'news'] as const;
type PushType = (typeof PUSH_TYPES)[number];

function normalizeTypes(raw: unknown): Record<PushType, boolean> | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const r = raw as Record<string, unknown>;
  const out = {} as Record<PushType, boolean>;
  for (const k of PUSH_TYPES) {
    const v = r[k];
    if (typeof v !== 'boolean') return null;
    out[k] = v;
  }
  return out;
}

/** Les anciens payloads stockaient 0/1 — tout ce qui n'est pas 0/false est ACTIF. */
function parseStoredTypes(s: string): Record<PushType, boolean> {
  try {
    const j = JSON.parse(s || '{}') as Record<string, unknown>;
    const out = {} as Record<PushType, boolean>;
    for (const k of PUSH_TYPES) {
      const v = j[k];
      out[k] = !(v === 0 || v === false);
    }
    return out;
  } catch {
    return { message: true, match: true, checkin: true, news: true };
  }
}

pushRoutes.get('/push/preferences', async (c) => {
  const user = await requireUser(c);
  const row = await c.env.DB.prepare(`SELECT enabled, types FROM push_preferences WHERE user_id = ?`)
    .bind(user.id)
    .first<{ enabled: number; types: string }>();
  const body = row
    ? { enabled: !!row.enabled, types: parseStoredTypes(row.types) }
    : { enabled: true, types: { message: true, match: true, checkin: true, news: true } as Record<PushType, boolean> };
  return c.json(body);
});

pushRoutes.put('/push/preferences', async (c) => {
  const user = await requireUser(c);
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.pushUser, user.id);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.pushUser.scope);
  const payload = (await c.req.json().catch(() => null)) as Record<string, unknown> | null;
  const hasEnabled = typeof payload?.enabled === 'boolean';
  const types = normalizeTypes(payload?.types);
  if (!hasEnabled && !types) {
    throw errors.badRequest(
      'Préférences invalides : enabled (boolean) et/ou types {message,match,checkin,news} booleans requis.',
    );
  }
  const existing = await c.env.DB.prepare(`SELECT enabled, types FROM push_preferences WHERE user_id = ?`)
    .bind(user.id)
    .first<{ enabled: number; types: string }>();
  const cur = existing
    ? { enabled: !!existing.enabled, types: parseStoredTypes(existing.types) }
    : { enabled: true, types: { message: true, match: true, checkin: true, news: true } as Record<PushType, boolean> };
  const next = {
    enabled: hasEnabled ? (payload!.enabled as boolean) : cur.enabled,
    types: types ?? cur.types,
  };
  const now = Math.floor(Date.now() / 1000);
  await c.env.DB.prepare(
    `INSERT INTO push_preferences (user_id, enabled, types, updated_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT (user_id) DO UPDATE SET enabled = excluded.enabled,
       types = excluded.types, updated_at = excluded.updated_at`,
  )
    .bind(user.id, next.enabled ? 1 : 0, JSON.stringify(next.types), now)
    .run();
  const body = next;
  return c.json(body);
});

// ---------------------------------------------------------------------------
// Task 53 — POT DE TEST STAGING UNIQUEMENT : « endpoint » de push auto-répondant.
//
// Le smoke T53 s'abonne avec un endpoint qui pointe vers CETTE route :
//   /api/push/test-echo?k=<clé stockage>&p=<priv b64url>&a=<auth b64url>
// Quand sendPushToUser() délivre un vrai push chiffré « aes128gcm » (RFC 8291),
// cette route DÉCHIFFRE le corps (même math que lib/push.ts côté réception) et
// stocke le payload clair en KV (CONFIG, TTL 600 s) — le smoke le relit ensuite
// via GET ?peek=<k> et compare au payload attendu. Preuve de bout en bout :
// VAPID signé + chiffrement + livraison + déchiffrement = contenu exact.
//
// Garde : 404 hors staging (même design que /admin/test-session) — la route
// déchiffre avec les clés fourniès par l'appelant lui-même, aucune donnée
// utilisateur n'y transite, mais on la désactive quand même en production.
// ---------------------------------------------------------------------------

function b64urlToBytesT(s: string): Uint8Array {
  const pad = '='.repeat((4 - (s.length % 4)) % 4);
  const b64 = (s + pad).replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hkdfT(ikm: Uint8Array, salt: Uint8Array, info: Uint8Array, length: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey('raw', ikm as BufferSource, 'HKDF', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'HKDF', hash: 'SHA-256', salt: salt as BufferSource, info: info as BufferSource },
    key,
    length * 8,
  );
  return new Uint8Array(bits);
}

pushRoutes.get('/push/test-echo', async (c) => {
  if (c.env.ENVIRONMENT !== 'staging') {
    return c.json({ error: { code: 'not_found', message: 'Réservé au staging.' } }, 404);
  }
  const k = c.req.query('k') ?? '';
  const peek = await c.env.CONFIG.get(`pushecho:${k}`);
  return c.json({ k, payload: peek ? JSON.parse(peek) : null });
});

pushRoutes.post('/push/test-echo', async (c) => {
  if (c.env.ENVIRONMENT !== 'staging') {
    return c.json({ error: { code: 'not_found', message: 'Réservé au staging.' } }, 404);
  }
  const k = (c.req.query('k') ?? '').slice(0, 64);
  const p = c.req.query('p') ?? '';
  const a = c.req.query('a') ?? '';
  if (!k || !p || !a) return c.json({ error: { code: 'bad_request', message: 'Params manquants.' } }, 400);

  const body = new Uint8Array(await c.req.arrayBuffer());
  if (body.length < 86 + 16) return c.json({ error: { code: 'bad_request', message: 'Corps trop court.' } }, 400);

  try {
    // 1. En-tête aes128gcm : salt(16) || rs(4) || idlen(1) || ephPub(idlen).
    const salt = body.slice(0, 16);
    const idlen = body[20]!;
    const ephPub = body.slice(21, 21 + idlen);
    const ciphertext = body.slice(21 + idlen);
    if (ephPub.length !== 65 || ephPub[0] !== 4) throw new Error('ephPub invalide');

    // 2. ECDH(privé du destinataire de test, ephPub) → PRK → CEK/nonce.
    const privJwk: JsonWebKey = {
      kty: 'EC',
      crv: 'P-256',
      d: p,
      // WebCrypto exige une clé privée EC COMPLÈTE (d + x + y) pour importKey :
      // le smoke fournit donc p (d), x, y et a (auth) dans la query.
      x: c.req.query('x') ?? '',
      y: c.req.query('y') ?? '',
      ext: true,
    };
    if (!privJwk.x || !privJwk.y) throw new Error('x/y requis');
    const privKey = await crypto.subtle.importKey('jwk', privJwk, { name: 'ECDH', namedCurve: 'P-256' }, false, [
      'deriveBits',
    ]);
    const ephKey = await crypto.subtle.importKey('raw', ephPub as BufferSource, { name: 'ECDH', namedCurve: 'P-256' }, true, []);
    const ecdhAlg = { name: 'ECDH', public: ephKey } as unknown as SubtleCryptoDeriveKeyAlgorithm;
    const ecdhBits = (await crypto.subtle.deriveBits(ecdhAlg, privKey, 256)) as ArrayBuffer;

    // userPub : la clé p256dh de l'abonnement (x||y préfixé 0x04) — reconstruite
    // depuis x/y de la MÊME paire (le smoke s'abonne avec sa propre clé pub).
    const x = b64urlToBytesT(privJwk.x);
    const y = b64urlToBytesT(privJwk.y);
    const userPub = new Uint8Array(65);
    userPub[0] = 4;
    userPub.set(x, 1);
    userPub.set(y, 33);
    const authSecret = b64urlToBytesT(a);

    const enc = new TextEncoder();
    const info = new Uint8Array(13 + 1 + 65 + 65);
    info.set(enc.encode('WebPush: info'), 0);
    info.set(userPub, 14);
    info.set(ephPub, 79);
    const prkKey = await hkdfT(new Uint8Array(ecdhBits), authSecret, info, 32);

    const cek = await hkdfT(prkKey, salt, enc.encode('Content-Encoding: aes128gcm\0'), 16);
    const nonce = await hkdfT(prkKey, salt, enc.encode('Content-Encoding: nonce\0'), 12);

    // 3. Déchiffrement + retrait du marqueur de dernier enregistrement 0x02.
    const aesKey = await crypto.subtle.importKey('raw', cek as BufferSource, 'AES-GCM', false, ['decrypt']);
    const padded = new Uint8Array(
      await crypto.subtle.decrypt({ name: 'AES-GCM', iv: nonce as BufferSource, tagLength: 128 }, aesKey, ciphertext as BufferSource),
    );
    if (padded[padded.length - 1] !== 0x02) throw new Error('marqueur final absent');
    const plaintext = new TextDecoder().decode(padded.slice(0, padded.length - 1));
    const payload = JSON.parse(plaintext) as Record<string, unknown>;

    await c.env.CONFIG.put(`pushecho:${k}`, JSON.stringify(payload), { expirationTtl: 600 });
    return c.json({ ok: true, payload }, 201);
  } catch (err) {
    return c.json(
      { error: { code: 'bad_request', message: `Échec déchiffrement : ${String(err)}` } },
      400,
    );
  }
});

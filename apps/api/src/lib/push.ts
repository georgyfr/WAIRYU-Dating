/**
 * Web Push minimal (Étape 6) — 100 % Workers, zéro dépendance.
 *
 *  - VAPID (RFC 8292) : JWT ES256 signé avec la clé P-256 (secrets VAPID_*) ;
 *  - Chiffrement du payload « aes128gcm » (RFC 8188 + RFC 8291) via
 *    crypto.subtle (ECDH P-256 + HKDF-SHA256 + AES-128-GCM) ;
 *  - Abonnements stockés en D1 (push_subscriptions), nettoyés sur 404/410.
 *
 * Politique d'échec : le push ne doit JAMAIS casser le flux métier —
 * toute erreur est avalée (log) ; si les secrets VAPID sont absents,
 * pushEnabled() = false et rien n'est envoyé (dégradation gracieuse).
 */

const enc = new TextEncoder();

export interface PushPayload {
  title: string;
  body: string;
  /** Tag de dédoublonnage des notifications. */
  tag: string;
  /** Hash de navigation (SPA) à ouvrir au clic. */
  url: string;
}

export interface PushSubscriptionKeys {
  endpoint: string;
  p256dh: string;
  auth: string;
}

// ---------------------------------------------------------------------------
// base64url
// ---------------------------------------------------------------------------

function b64urlToBytes(s: string): Uint8Array {
  const pad = '='.repeat((4 - (s.length % 4)) % 4);
  const b64 = (s + pad).replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function bytesToB64url(b: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < b.length; i++) bin += String.fromCharCode(b[i]!);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function concat(...parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((n, p) => n + p.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const p of parts) {
    out.set(p, off);
    off += p.length;
  }
  return out;
}

// ---------------------------------------------------------------------------
// VAPID — JWT ES256 (RFC 8292)
// ---------------------------------------------------------------------------

interface VapidConfig {
  publicKey: string; // base64url (65 octets, point non compressé)
  privateKey: CryptoKey; // ECDSA P-256 (sign)
  subject: string;
}

let vapidCache: VapidConfig | null | undefined;

/** Importe (et met en cache) les clés VAPID ; null si non configurées/mal formées. */
async function vapid(env: {
  VAPID_PUBLIC_KEY?: string;
  VAPID_PRIVATE_KEY?: string;
  VAPID_SUBJECT?: string;
}): Promise<VapidConfig | null> {
  if (vapidCache !== undefined) return vapidCache;
  const pubB64 = env.VAPID_PUBLIC_KEY;
  const privB64 = env.VAPID_PRIVATE_KEY;
  if (!pubB64 || !privB64) {
    vapidCache = null;
    return null;
  }
  try {
    // Clé privée brute (32 octets = d) → JWK avec la partie publique dérivée
    // du point non compressé (65 octets = 0x04 || X || Y).
    const priv = b64urlToBytes(privB64);
    const pub = b64urlToBytes(pubB64);
    if (priv.length !== 32 || pub.length !== 65 || pub[0] !== 4) throw new Error('bad key length');
    const x = pub.slice(1, 33);
    const y = pub.slice(33, 65);
    const jwk: JsonWebKey = {
      kty: 'EC',
      crv: 'P-256',
      x: bytesToB64url(x),
      y: bytesToB64url(y),
      d: bytesToB64url(priv),
      ext: true,
    };
    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
    vapidCache = { publicKey: pubB64, privateKey: key, subject: env.VAPID_SUBJECT ?? 'mailto:admin@wairyu.app' };
  } catch (err) {
    console.error(JSON.stringify({ push: 'vapid_import_failed', err: String(err) }));
    vapidCache = null;
  }
  return vapidCache;
}

/** true si les secrets VAPID sont présents et valides. */
export async function pushEnabled(env: {
  VAPID_PUBLIC_KEY?: string;
  VAPID_PRIVATE_KEY?: string;
  VAPID_SUBJECT?: string;
}): Promise<boolean> {
  return (await vapid(env)) !== null;
}

/** Signe le JWT VAPID : header.payload.signature (ES256 = r||s bruts). */
async function signJwt(cfg: VapidConfig, audience: string): Promise<string> {
  const header = { typ: 'JWT', alg: 'ES256' };
  const payload = { aud: audience, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: cfg.subject };
  const head = bytesToB64url(enc.encode(JSON.stringify(header)));
  const body = bytesToB64url(enc.encode(JSON.stringify(payload)));
  const data = enc.encode(`${head}.${body}`);
  const sig = new Uint8Array(
    await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, cfg.privateKey, data),
  );
  return `${head}.${body}.${bytesToB64url(sig)}`;
}

// ---------------------------------------------------------------------------
// Chiffrement du payload (RFC 8291, « aes128gcm »)
// ---------------------------------------------------------------------------

async function hkdf(ikm: Uint8Array, salt: Uint8Array, info: Uint8Array, length: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey('raw', ikm as BufferSource, 'HKDF', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'HKDF', hash: 'SHA-256', salt: salt as BufferSource, info: info as BufferSource },
    key,
    length * 8,
  );
  return new Uint8Array(bits);
}

/** Chiffre le payload JSON pour un abonnement — corps binaire prêt à POSTer. */
async function encryptPayload(sub: PushSubscriptionKeys, payload: PushPayload): Promise<Uint8Array> {
  const userPub = b64urlToBytes(sub.p256dh);
  const authSecret = b64urlToBytes(sub.auth);
  if (userPub.length !== 65 || userPub[0] !== 4) throw new Error('bad p256dh key');

  // 1. Paire éphémère ECDH P-256.
  const eph = (await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, [
    'deriveBits',
  ])) as CryptoKeyPair;
  const ephPubRaw = await crypto.subtle.exportKey('raw', eph.publicKey);
  const ephPub = new Uint8Array(ephPubRaw as ArrayBuffer);

  // 2. PRK_key = HKDF(auth, ECDH, "WebPush: info" || 0x00 || userPub || ephPub).
  const userKey = await crypto.subtle.importKey(
    'raw',
    userPub as BufferSource,
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    [],
  );
  // NB : les workers-types exposent « $public » (marqueur CF), mais le runtime
  // WebCrypto standard attend « public » — d'où le cast typographique.
  const ecdhAlg = { name: 'ECDH', public: userKey } as unknown as SubtleCryptoDeriveKeyAlgorithm;
  const ecdhBits = (await crypto.subtle.deriveBits(ecdhAlg, eph.privateKey, 256)) as ArrayBuffer;
  const ecdhSecret = new Uint8Array(ecdhBits);
  const info = concat(enc.encode('WebPush: info'), new Uint8Array(1), userPub, ephPub);
  const prkKey = await hkdf(ecdhSecret, authSecret, info, 32);

  // 3. CEK (16) + NONCE (12) dérivés du sel aléatoire.
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const cek = await hkdf(prkKey, salt, enc.encode('Content-Encoding: aes128gcm\0'), 16);
  const nonce = await hkdf(prkKey, salt, enc.encode('Content-Encoding: nonce\0'), 12);

  // 4. Enregistrement unique : plaintext || 0x02 (marque du dernier enregistrement).
  const plaintext = enc.encode(JSON.stringify(payload));
  const padded = concat(plaintext, new Uint8Array([0x02]));

  const aesKey = await crypto.subtle.importKey('raw', cek as BufferSource, 'AES-GCM', false, ['encrypt']);
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce as BufferSource, tagLength: 128 }, aesKey, padded as BufferSource),
  );

  // 5. En-tête aes128gcm : salt(16) || rs(4) || idlen(1) || ephPub(65).
  const rs = 4096;
  const header = concat(
    salt,
    new Uint8Array([(rs >>> 24) & 0xff, (rs >>> 16) & 0xff, (rs >>> 8) & 0xff, rs & 0xff]),
    new Uint8Array([ephPub.length]),
    ephPub,
  );
  return concat(header, ciphertext);
}

// ---------------------------------------------------------------------------
// Envoi
// ---------------------------------------------------------------------------

/**
 * Envoie un push à TOUS les appareils d'un utilisateur (best-effort).
 * Retourne le nombre de notifications délivrées ; ne lève JAMAIS.
 */
export async function sendPushToUser(
  env: {
    DB: D1Database;
    VAPID_PUBLIC_KEY?: string;
    VAPID_PRIVATE_KEY?: string;
    VAPID_SUBJECT?: string;
  },
  userId: string,
  payload: PushPayload,
): Promise<number> {
  try {
    const cfg = await vapid(env);
    if (!cfg) return 0;

    const { results: subs } = await env.DB.prepare(
      `SELECT endpoint, p256dh, auth FROM push_subscriptions WHERE user_id = ?`,
    )
      .bind(userId)
      .all<{ endpoint: string; p256dh: string; auth: string }>();
    if (!subs || subs.length === 0) return 0;

    let sent = 0;
    for (const sub of subs) {
      try {
        const audience = new URL(sub.endpoint).origin;
        const jwt = await signJwt(cfg, audience);
        const body = await encryptPayload(sub, payload);
        const res = await fetch(sub.endpoint, {
          method: 'POST',
          headers: {
            TTL: '2419200',
            Urgency: 'high',
            Authorization: `vapid t=${jwt}, k=${cfg.publicKey}`,
            'Content-Encoding': 'aes128gcm',
            'Content-Type': 'application/octet-stream',
          },
          body: body as BufferSource,
        });
        if (res.ok || res.status === 201) sent++;
        // 404/410 : abonnement mort → nettoyage.
        if (res.status === 404 || res.status === 410) {
          await env.DB.prepare(`DELETE FROM push_subscriptions WHERE endpoint = ?`)
            .bind(sub.endpoint)
            .run();
        }
      } catch (err) {
        console.error(JSON.stringify({ push: 'send_failed', err: String(err) }));
      }
    }
    return sent;
  } catch (err) {
    console.error(JSON.stringify({ push: 'dispatch_failed', err: String(err) }));
    return 0;
  }
}

/**
 * wairyu-pushecho — pot de test Web Push (Task 54).
 *
 * POURQUOI CE WORKER EXISTE : Cloudflare interdit à un Worker de fetcher son
 * PROPRE host *.workers.dev (protection anti-boucle, 404 edge). La route
 * /api/push/test de wairyu-staging ne peut donc pas être prouvée de bout en
 * bout avec un endpoint pointant vers wairyu-staging lui-même (le smoke T53
 * passait car l'envoi partait du Durable Object, hors de cette restriction).
 * Ce worker est un AUTRE script : le fetch inter-workers est autorisé — le
 * smoke T54 s'abonne avec un endpoint pointant ICI et reçoit le VRAI push
 * chiffré envoyé par la route de simulation.
 *
 * Comportement (même math que /api/push/test-echo de l'API) :
 *   POST /echo?k=<clé>&p=<priv b64url>&x=<pub x>&y=<pub y>&a=<auth b64url>
 *     → déchiffre le corps « aes128gcm » (RFC 8291) avec les clés du smoke,
 *     stocke le payload clair en KV (TTL 600 s) → 201 {ok:true,payload} ;
 *     tout corps qui ne déchiffre pas → 400 (aucune donnée stockée).
 *   GET /peek?k=<clé> → {k, payload} (le smoke relit et compare).
 *
 * Sécurité : aucune donnée utilisateur ne transite ici — le smoke ne s'abonne
 * qu'avec SES propres clés P-256 générées à la volée ; le worker ne stocke
 * qu'un payload de test ≤ 4 Ko sous une clé aléatoire, TTL 10 minutes.
 */

const enc = new TextEncoder();

function b64urlToBytes(s) {
  const pad = '='.repeat((4 - (s.length % 4)) % 4);
  const b64 = (s + pad).replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hkdf(ikm, salt, info, length) {
  const key = await crypto.subtle.importKey('raw', ikm, 'HKDF', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'HKDF', hash: 'SHA-256', salt, info },
    key,
    length * 8,
  );
  return new Uint8Array(bits);
}

async function decrypt(body, p, x, y, a) {
  // 1. En-tête aes128gcm : salt(16) || rs(4) || idlen(1) || ephPub(idlen).
  const salt = body.slice(0, 16);
  const idlen = body[20];
  const ephPub = body.slice(21, 21 + idlen);
  const ciphertext = body.slice(21 + idlen);
  if (ephPub.length !== 65 || ephPub[0] !== 4) throw new Error('ephPub invalide');

  // 2. ECDH(privé du destinataire de test, ephPub) → PRK → CEK/nonce.
  const privJwk = { kty: 'EC', crv: 'P-256', d: p, x, y, ext: true };
  const privKey = await crypto.subtle.importKey('jwk', privJwk, { name: 'ECDH', namedCurve: 'P-256' }, false, [
    'deriveBits',
  ]);
  const ephKey = await crypto.subtle.importKey('raw', ephPub, { name: 'ECDH', namedCurve: 'P-256' }, true, []);
  const ecdhBits = await crypto.subtle.deriveBits({ name: 'ECDH', public: ephKey }, privKey, 256);

  const userPub = new Uint8Array(65);
  userPub[0] = 4;
  userPub.set(b64urlToBytes(x), 1);
  userPub.set(b64urlToBytes(y), 33);
  const authSecret = b64urlToBytes(a);

  const info = new Uint8Array(13 + 1 + 65 + 65);
  info.set(enc.encode('WebPush: info'), 0);
  info.set(userPub, 14);
  info.set(ephPub, 79);
  const prkKey = await hkdf(new Uint8Array(ecdhBits), authSecret, info, 32);

  const cek = await hkdf(prkKey, salt, enc.encode('Content-Encoding: aes128gcm\0'), 16);
  const nonce = await hkdf(prkKey, salt, enc.encode('Content-Encoding: nonce\0'), 12);

  // 3. Déchiffrement + retrait du marqueur de dernier enregistrement 0x02.
  const aesKey = await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, ['decrypt']);
  const padded = new Uint8Array(
    await crypto.subtle.decrypt({ name: 'AES-GCM', iv: nonce, tagLength: 128 }, aesKey, ciphertext),
  );
  if (padded[padded.length - 1] !== 0x02) throw new Error('marqueur final absent');
  return JSON.parse(new TextDecoder().decode(padded.slice(0, padded.length - 1)));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'POST' && url.pathname === '/echo') {
      const k = (url.searchParams.get('k') ?? '').slice(0, 64);
      const p = url.searchParams.get('p') ?? '';
      const x = url.searchParams.get('x') ?? '';
      const y = url.searchParams.get('y') ?? '';
      const a = url.searchParams.get('a') ?? '';
      if (!k || !p || !x || !y || !a) {
        return Response.json({ error: 'params manquants (k,p,x,y,a)' }, { status: 400 });
      }
      const body = new Uint8Array(await request.arrayBuffer());
      if (body.length < 86 + 16 || body.length > 4096) {
        return Response.json({ error: 'taille de corps invalide' }, { status: 400 });
      }
      try {
        const payload = await decrypt(body, p, x, y, a);
        if (typeof payload !== 'object' || payload === null || typeof payload.tag !== 'string') {
          return Response.json({ error: 'payload non wairyu' }, { status: 400 });
        }
        await env.PUSHECHO_KV.put(`pushecho:${k}`, JSON.stringify(payload), { expirationTtl: 600 });
        return Response.json({ ok: true, payload }, { status: 201 });
      } catch (err) {
        return Response.json({ error: `échec déchiffrement : ${String(err)}` }, { status: 400 });
      }
    }

    if (request.method === 'GET' && url.pathname === '/peek') {
      const k = (url.searchParams.get('k') ?? '').slice(0, 64);
      const payload = await env.PUSHECHO_KV.get(`pushecho:${k}`);
      return Response.json({ k, payload: payload === null ? null : JSON.parse(payload) });
    }

    return Response.json({ ok: true, service: 'wairyu-pushecho', hint: 'POST /echo · GET /peek' });
  },
};

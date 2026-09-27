/**
 * wairyu-pushecho — pot de test Web Push (Task 54), hébergé sur PAGES.
 *
 * POURQUOI PAGES ET PAS UN WORKER : Cloudflare interdit à un Worker de
 * fetcher n'importe quel host *.workers.dev (protection anti-boucle AU
 * NIVEAU DE LA ZONE — vérifié Task 54 : même un AUTRE worker reçoit 404).
 * La zone pages.dev est DIFFÉRENTE : le fetch wairyu-staging → pages.dev
 * passe. Le smoke T54 s'abonne donc avec un endpoint pointant ICI.
 *
 * Fonctionnement volontairement SANS crypto : le corps chiffré (RFC 8291)
 * est stocké BRUT en KV — le smoke le relit et le DÉCHIFFRE LOCALEMENT
 * (node WebCrypto) avec SA clé privée : preuve indépendante de bout en bout.
 *
 *   POST /echo?k=<clé>  → stocke le corps brut (≤ 4 Ko, TTL 600 s) → 201
 *   GET  /peek?k=<clé>  → {k, body_b64} (b64 du corps chiffré reçu)
 *
 * Aucune donnée utilisateur ne transite ici : le pot ne voit que des pushes
 * de test produits par le smoke vers des clés générées à la volée.
 */

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const k = (url.searchParams.get('k') ?? '').slice(0, 64);

  if (request.method === 'POST' && url.pathname === '/echo') {
    if (!k) return Response.json({ error: 'k requis' }, { status: 400 });
    const buf = await request.arrayBuffer();
    if (buf.byteLength < 1 || buf.byteLength > 4096) {
      return Response.json({ error: 'taille de corps invalide' }, { status: 400 });
    }
    const bytes = new Uint8Array(buf);
    let bin = '';
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    await env.PUSHECHO_KV.put(`pushecho:${k}`, btoa(bin), { expirationTtl: 600 });
    return Response.json({ ok: true, size: buf.byteLength }, { status: 201 });
  }

  if (request.method === 'GET' && url.pathname === '/peek') {
    const bodyB64 = await env.PUSHECHO_KV.get(`pushecho:${k}`);
    return Response.json({ k, body_b64: bodyB64 });
  }

  return Response.json({ ok: true, service: 'wairyu-pushecho', hint: 'POST /echo?k= · GET /peek?k=' });
}

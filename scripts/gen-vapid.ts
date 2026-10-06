/**
 * Génération d'une paire de clés VAPID P-256 (RFC 8292) avec auto-vérification.
 * Sortie : VAPID_PUBLIC_KEY (65 octets 0x04||X||Y, base64url) + VAPID_PRIVATE_KEY (32 octets d, base64url).
 * La paire est vérifiée par un aller-retour signature/vérification AVANT affichage.
 */
import { webcrypto as crypto } from 'node:crypto';

function b64url(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString('base64url');
}

const pair = crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, [
  'sign',
  'verify',
]) as Promise<CryptoKeyPair>;

const { privateKey, publicKey } = await pair;

const privJwk = (await crypto.subtle.exportKey('jwk', privateKey)) as JsonWebKey;
const pubRaw = new Uint8Array(await crypto.subtle.exportKey('raw', publicKey));

const VAPID_PRIVATE_KEY = b64url(Buffer.from(privJwk.d!, 'base64url'));
const VAPID_PUBLIC_KEY = b64url(pubRaw);

// --- Auto-vérification de la paire (même logique que lib/push.ts côté Worker)
const probe = new TextEncoder().encode('wairyu-vapid-selftest');
const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, privateKey, probe);
const ok = await crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, publicKey, sig, probe);
if (!ok) {
  console.error('ERREUR : paire incohérente');
  process.exit(1);
}
if (pubRaw.length !== 65 || pubRaw[0] !== 4) {
  console.error('ERREUR : clé publique mal formée');
  process.exit(1);
}

console.log(VAPID_PUBLIC_KEY);
console.log(VAPID_PRIVATE_KEY);

/**
 * CORS :
 *  - devCors : le front est servi par le même Worker (same-origin) — CORS
 *    ouvert uniquement pour le développement local Vite (localhost).
 *  - openCors : endpoints PUBLICS device-based (/api/push/*, /api/health,
 *    /api/version) — sert la console de test sandbox (prévisualisation) et
 *    n'importe quel client sans cookie. Aucune credential, aucun cookie :
    serré à l'Étape 2 quand les endpoints seront liés aux sessions.
 */
import { cors } from 'hono/cors';
import type { AppEnv } from '../env';

/**
 * BE-004 (audit sécurité Task 104) : correspondance EXACTE du hostname.
 * L'ancien test par sous-chaîne (`origin.includes('localhost')`) laissait
 * passer n'importe quelle origine contenant « localhost » ou « 127.0.0.1 »
 * en sous-domaine/path (ex. https://evil-localhost.attacker.com), ce qui
 * reflétait l'origine avec credentials:true — vol de cookies de session
 * possible sur tous les GET /api/*. Désormais : seul localhost/127.0.0.1
 * EXACT (tout port, dev Vite) est reflété ; toute autre origine → null.
 */
export function originDevAutorisee(origin: string): boolean {
  try {
    const { hostname, protocol } = new URL(origin);
    if (protocol !== 'http:' && protocol !== 'https:') return false;
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]';
  } catch {
    return false;
  }
}

export const devCors = () =>
  cors({
    origin: (origin) => (origin && originDevAutorisee(origin) ? origin : null),
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400,
  });

export const openCors = () =>
  cors({
    origin: (origin) => origin ?? '*',
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
    credentials: false,
    maxAge: 86400,
  });

export type { AppEnv };

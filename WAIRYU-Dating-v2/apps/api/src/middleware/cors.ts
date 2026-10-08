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

export const devCors = () =>
  cors({
    origin: (origin) => (origin?.includes('localhost') || origin?.includes('127.0.0.1') ? origin : null),
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

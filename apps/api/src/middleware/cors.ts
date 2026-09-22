/**
 * CORS : le front est servi par le même Worker (same-origin) — CORS ouvert
 * uniquement pour le développement local Vite (localhost:5173).
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

export type { AppEnv };

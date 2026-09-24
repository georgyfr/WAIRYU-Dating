/**
 * Usage : compte les requêtes par isolate (mémoire) et échantillonne les écritures
 * dans D1 metrics_daily. Garde-fou du budget free tier (≤ 70 requêtes API/utilisateur/jour).
 *
 * Coût D1 : 1 requête métrique échantillonnée par request × USAGE_SAMPLE_RATE.
 * À 3 500 utilisateurs × 70 req/j = 245 K req/j, un taux de 1 % ≈ 2 450 écritures/j.
 */
import type { Context, Next } from 'hono';
import type { AppEnv } from '../env';

/** Compteurs process-isolate (réinitialisés à chaque redéploiement/hibernation). */
const counters = new Map<string, number>();
// Date.now() vaut 0 pendant l'init du module global du Worker → initialisation paresseuse.
let startedAt: number | null = null;

export function incrCounter(name: string, by = 1): void {
  counters.set(name, (counters.get(name) ?? 0) + by);
}

export function snapshotCounters(): Record<string, number> {
  return Object.fromEntries(counters);
}

export function isolateUptimeSeconds(): number {
  if (startedAt === null) return 0;
  return Math.floor((Date.now() - startedAt) / 1000);
}

/** Début de vie de l'isolate (epoch ms), ou maintenant si pas encore démarré. */
export function currentStartedAt(): number {
  return startedAt ?? Date.now();
}

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Écrit (échantillonnée) une unité de métrique dans D1. */
async function recordMetric(db: D1Database, metric: string, sampleRate: number): Promise<void> {
  const hit = sampleRate >= 1 || Math.random() < sampleRate;
  if (!hit) return;
  const weight = Math.round(1 / sampleRate);
  const day = todayUtc();
  await db
    .prepare(
      `INSERT INTO metrics_daily (day, metric, value) VALUES (?, ?, ?)
       ON CONFLICT (day, metric) DO UPDATE SET value = value + excluded.value`,
    )
    .bind(day, metric, weight)
    .run();
}

export function usageMiddleware(sampleRateRaw: string) {
  const sampleRate = Math.min(1, Math.max(0.01, Number(sampleRateRaw) || 1));

  return async (c: Context<AppEnv>, next: Next) => {
    const path = c.req.path;
    // Bucket générique : /api/xxx/... → api_xxx (évite la cardinalité infinie)
    const bucket = path.startsWith('/api/')
      ? `api_${path.slice(5).split('/')[0] || 'root'}`
      : path.startsWith('/admin/')
        ? `admin_${path.slice(7).split('/')[0] || 'root'}`
        : `asset_${path.split('/')[1] || 'index'}`;

    if (startedAt === null) startedAt = Date.now();
    incrCounter('requests_total');
    incrCounter(bucket);

    // Performance (Task 28) : la métrique n'est PLUS awaitée avant le handler —
    // elle part en waitUntil (après la réponse) : chaque requête API économise
    // un aller-retour D1 en série. Les métriques ne doivent jamais coûter de
    // latence à une requête utile.
    try {
      c.executionCtx.waitUntil(
        recordMetric(c.env.DB, 'api_requests', sampleRate).catch(() => undefined),
      );
    } catch {
      // Pas de contexte d'exécution (tests) → best effort silencieux.
    }

    await next();

    if (c.res.status >= 500) {
      incrCounter('errors_5xx');
      try {
        c.executionCtx.waitUntil(
          recordMetric(c.env.DB, 'api_errors', sampleRate).catch(() => undefined),
        );
      } catch {
        /* silencieux */
      }
    }
  };
}

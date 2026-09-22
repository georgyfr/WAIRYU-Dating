/**
 * wairyu API — point d'entrée du Worker.
 * Un seul Worker sert : le front (assets Vite) + l'API Hono sous /api/* + /admin/*.
 */
import { Hono } from 'hono';
import type { AppEnv, Env } from './env';
import { errorBody, errors, reqId, AppError } from './lib/errors';
import { sessionMiddleware } from './middleware/session';
import { devCors } from './middleware/cors';
import { usageMiddleware } from './middleware/usage';
import { healthRoutes } from './routes/health';
import { adminRoutes } from './routes/admin';
import { ChatRoom } from './do/chat-room';
import { APP } from '@wairyu/shared';

export { ChatRoom };

const app = new Hono<AppEnv>();

// ---- Identifiant de requête (avant tout le monde) ----
app.use('*', async (c, next) => {
  c.set('reqId', reqId());
  await next();
});

// ---- CORS dev (localhost Vite) ----
app.use('/api/*', devCors());
app.use('/admin/*', devCors());

// ---- Métriques d'usage ----
app.use('/api/*', usageMiddleware('1'));
app.use('/admin/*', usageMiddleware('1'));

// ---- Session (cookie signé → D1) ----
app.use('/api/*', sessionMiddleware);

// ---- Routes ----
app.route('/api', healthRoutes);
app.route('/admin', adminRoutes);

// Démonstration du contrat d'erreur authentifié (remplacé en Étape 2)
app.get('/api/me', (c) => {
  const session = c.get('session');
  if (!session) throw errors.unauthorized();
  return c.json({ user_id: session.userId });
});

// ---- Gestion d'erreurs unifiée ----
app.onError((err, c) => {
  const id = c.get('reqId') ?? reqId();
  if (err instanceof AppError) {
    if (err.status >= 500) console.error(JSON.stringify({ req_id: id, level: 'error', err: err.message }));
    return c.json(errorBody(err.code, err.message, id), err.status as 400);
  }
  console.error(JSON.stringify({ req_id: id, level: 'error', err: String(err) }));
  return c.json(errorBody('internal', errors.internal().message, id), 500);
});

app.notFound((c) => {
  const id = c.get('reqId') ?? reqId();
  return c.json(errorBody('not_found', 'Route inconnue.', id), 404);
});

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext): Response | Promise<Response> {
    const url = new URL(request.url);
    // L'API passe toujours par Hono (run_worker_first couvre /api/* et /admin/*)
    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/admin')) {
      return app.fetch(request, env, ctx);
    }
    // Tout le reste : assets du front (SPA). Fallback index.html si fichier absent.
    return env.ASSETS.fetch(request);
  },

  /** Cron quotidien : purge des sessions expirées (et plus tard, agrégations). */
  async scheduled(_event: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(
      (async () => {
        const now = Math.floor(Date.now() / 1000);
        const res = await env.DB.prepare(
          `DELETE FROM sessions WHERE expires_at < ? OR revoked_at IS NOT NULL AND revoked_at < ?`,
        )
          .bind(now - 86400 * 7, now - 86400 * 30)
          .run();
        console.log(JSON.stringify({ cron: 'purge-sessions', deleted: res.meta.changes }));
        // Marque la métrique du jour (prouve le cron)
        await env.DB.prepare(
          `INSERT INTO metrics_daily (day, metric, value) VALUES (?, 'cron_purge_sessions', 1)
           ON CONFLICT (day, metric) DO UPDATE SET value = value + 1`,
        )
          .bind(new Date().toISOString().slice(0, 10))
          .run();
      })(),
    );
  },
};

// Export pour tests/typage
export type { AppEnv, Env };
export const _internal = { app, APP };

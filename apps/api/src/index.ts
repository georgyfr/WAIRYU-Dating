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
import { authRoutes } from './routes/auth';
import { profileRoutes } from './routes/profiles';
import { geoRoutes } from './routes/geo';
import { questionnaireRoutes } from './routes/questionnaire';
import { feedRoutes } from './routes/feed';
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

// ---- Admin : jeton porteur si ADMIN_TOKEN posé (Étape 2) ----
app.use('/admin/*', async (c, next) => {
  const expected = c.env.ADMIN_TOKEN;
  if (expected) {
    const auth = c.req.header('authorization') ?? '';
    const provided = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (provided !== expected) {
      const id = c.get('reqId');
      return c.json(errorBody('unauthorized', 'Jeton admin requis.', id), 401);
    }
  }
  await next();
});

// ---- Routes ----
app.route('/api', healthRoutes);
app.route('/api', authRoutes);
app.route('/api', profileRoutes);
app.route('/api', geoRoutes);
app.route('/api', questionnaireRoutes);
app.route('/api', feedRoutes);
app.route('/admin', adminRoutes);

// (L'ancien /api/me de démonstration a été remplacé par routes/auth.ts — Étape 2)

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

  /** Cron quotidien : purges (sessions, codes OTP, fenêtres rate-limit, traces RGPD). */
  async scheduled(_event: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(
      (async () => {
        const now = Math.floor(Date.now() / 1000);
        const day = new Date().toISOString().slice(0, 10);

        const [sessions, codes, windows, tombstones] = await Promise.all([
          env.DB.prepare(
            `DELETE FROM sessions WHERE expires_at < ? OR revoked_at IS NOT NULL AND revoked_at < ?`,
          )
            .bind(now - 86400 * 7, now - 86400 * 30)
            .run(),
          // Codes OTP : consommés/expirés depuis > 24 h
          env.DB.prepare(`DELETE FROM auth_codes WHERE expires_at < ?`).bind(now - 86400).run(),
          // Fenêtres rate-limit clôturées depuis > 2 h
          env.DB.prepare(`DELETE FROM rate_limits WHERE window_start < ?`).bind(now - 7200).run(),
          // Traces de suppression > 30 j (RGPD — fin de conservation)
          env.DB.prepare(`DELETE FROM account_deletions WHERE purge_at < ?`).bind(now).run(),
        ]);
        console.log(
          JSON.stringify({
            cron: 'purge-daily',
            deleted: {
              sessions: sessions.meta.changes,
              auth_codes: codes.meta.changes,
              rate_windows: windows.meta.changes,
              tombstones: tombstones.meta.changes,
            },
          }),
        );
        // Marque la métrique du jour (prouve le cron)
        await env.DB.prepare(
          `INSERT INTO metrics_daily (day, metric, value) VALUES (?, 'cron_purge_daily', 1)
           ON CONFLICT (day, metric) DO UPDATE SET value = value + 1`,
        )
          .bind(day)
          .run();
      })(),
    );
  },
};

// Export pour tests/typage
export type { AppEnv, Env };
export const _internal = { app, APP };

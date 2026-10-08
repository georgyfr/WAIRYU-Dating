/**
 * wairyu API — point d'entrée du Worker.
 * Un seul Worker sert : le front (assets Vite) + l'API Hono sous /api/* + /admin/*
 * + /.well-known/assetlinks.json (TWA Android).
 */
import { Hono } from 'hono';
import type { AppEnv, Env } from './env';
import { errorBody, errors, reqId, AppError } from './lib/errors';
import { sessionMiddleware } from './middleware/session';
import { devCors, openCors } from './middleware/cors';
import { usageMiddleware } from './middleware/usage';
import { healthRoutes } from './routes/health';
import { adminRoutes } from './routes/admin';
import { pushRoutes } from './routes/push';
import { authRoutes } from './routes/auth';
import { ChatRoom } from './do/chat-room';
import { APP } from '@wairyu/shared';

export { ChatRoom };

const app = new Hono<AppEnv>();

// ---- Identifiant de requête (avant tout le monde) ----
app.use('*', async (c, next) => {
  c.set('reqId', reqId());
  await next();
});

// ---- CORS ouvert : endpoints publics device-based (console sandbox, TWA) ----
// Enregistré AVANT devCors : hono/cors répond LUI-MÊME au preflight OPTIONS
// et court-circuite les middlewares suivants — l'ordre décide donc des
// en-têtes de préflight réellement servis.
app.use('/api/push/*', openCors());
app.use('/api/health', openCors());
app.use('/api/version', openCors());

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
app.route('/api', pushRoutes);
app.route('/api', authRoutes);
app.route('/admin', adminRoutes);

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

/** Réponse /.well-known/assetlinks.json — vérification de propriété de la TWA. */
function assetlinksResponse(env: Env): Response {
  const fingerprints = (env.ANDROID_CERT_FINGERPRINTS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const statements = fingerprints.length
    ? [
        {
          relation: ['delegate_permission/common.handle_all_urls'],
          target: {
            namespace: 'android_app',
            package_name: 'com.wairyu.app',
            sha256_cert_fingerprints: fingerprints,
          },
        },
      ]
    : [];
  return new Response(JSON.stringify(statements, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
}

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext): Response | Promise<Response> {
    const url = new URL(request.url);
    // L'API passe toujours par Hono (run_worker_first couvre /api/*, /admin/*
    // et /.well-known/assetlinks.json)
    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/admin')) {
      return app.fetch(request, env, ctx);
    }
    if (url.pathname === '/.well-known/assetlinks.json') {
      return assetlinksResponse(env);
    }
    // Tout le reste : assets du front (SPA). Fallback index.html si fichier absent.
    return env.ASSETS.fetch(request);
  },

  /** Cron quotidien : purges (sessions, fenêtres rate-limit, journal notifs, traces RGPD). */
  async scheduled(_event: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(
      (async () => {
        const now = Math.floor(Date.now() / 1000);
        const day = new Date().toISOString().slice(0, 10);

        const [sessions, windows, events, tombstones, codes, resets] = await Promise.all([
          env.DB.prepare(`DELETE FROM sessions WHERE expires_at < ?`).bind(now - 86400 * 7).run(),
          // Fenêtres rate-limit clôturées depuis > 2 h
          env.DB.prepare(`DELETE FROM rate_limits WHERE window_start < ?`).bind(now - 7200).run(),
          // Journal de notifications : 7 jours de rétention suffisants
          env.DB.prepare(`DELETE FROM notification_events WHERE created_at < ?`).bind(now - 7 * 86400).run(),
          // Traces de suppression > 30 j (RGPD — fin de conservation)
          env.DB.prepare(`DELETE FROM account_deletions WHERE purge_at < ?`).bind(now).run(),
          // Codes OTP consommés/expirés depuis > 1 j + liens de reset consommés/expirés
          env.DB.prepare(`DELETE FROM auth_codes WHERE expires_at < ?`).bind(now - 86400).run(),
          env.DB.prepare(`DELETE FROM password_resets WHERE expires_at < ?`).bind(now - 86400).run(),
        ]);
        console.log(
          JSON.stringify({
            cron: 'purge-daily',
            deleted: {
              sessions: sessions.meta.changes,
              rate_windows: windows.meta.changes,
              notification_events: events.meta.changes,
              tombstones: tombstones.meta.changes,
              auth_codes: codes.meta.changes,
              password_resets: resets.meta.changes,
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

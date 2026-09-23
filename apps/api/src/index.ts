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
import { personalityRoutes } from './routes/personality';
import { feedRoutes } from './routes/feed';
import { discoverRoutes } from './routes/discover';
import { chatRoutes } from './routes/chat';
import { pushRoutes } from './routes/push';
import { safetyRoutes } from './routes/safety';
import { computeDailyTop } from './lib/discovery';
import { sendPushToUser } from './lib/push';
import { verifyTotp } from './lib/totp';
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

// ---- Suspension active (Étape 7) : lecture de son état + logout seulement ----
app.use('/api/*', async (c, next) => {
  const until = c.get('suspendedUntil');
  const now = Math.floor(Date.now() / 1000);
  if (c.get('session') && until && until > now) {
    const path = c.req.path;
    const allowed =
      path === '/api/me' ||
      path === '/api/auth/logout' ||
      path === '/api/auth/logout-all' ||
      path === '/api/account/export';
    if (!allowed) {
      const id = c.get('reqId');
      return c.json(
        errorBody('forbidden', `Compte suspendu jusqu’au ${new Date(until * 1000).toLocaleDateString('fr-FR')}.`, id),
        403,
      );
    }
  }
  await next();
});

// ---- Admin : jeton porteur si ADMIN_TOKEN posé (Étape 2) + 2FA TOTP (Étape 7) ----
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
  // 2FA TOTP (Étape 7) : activée uniquement après /admin/2fa/activate —
  // alors TOUT /admin/* exige l'en-tête X-Admin-TOTP (tolérance ±1 pas).
  const cfg = (await c.env.CONFIG.get('admin:2fa', 'json')) as { secret: string; enabled: boolean } | null;
  if (cfg?.enabled) {
    const token = c.req.header('x-admin-totp') ?? '';
    const ok = await verifyTotp(cfg.secret, token);
    if (!ok) {
      const id = c.get('reqId');
      return c.json(errorBody('unauthorized', 'Code TOTP admin requis (X-Admin-TOTP).', id), 401);
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
app.route('/api', personalityRoutes);
app.route('/api', feedRoutes);
app.route('/api', discoverRoutes);
app.route('/api', chatRoutes);
app.route('/api', pushRoutes);
app.route('/api', safetyRoutes);
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

        // ---- Top Compatibilité quotidien (Étape 5.6) ----
        // 5 suggestions scorées par utilisateur actif, matérialisées dans
        // top_matches — HORS quota utilisateur (lues via /api/discover/top).
        try {
          const top = await computeDailyTop(env, { maxUsers: 200 });
          await env.DB.prepare(
            `INSERT INTO metrics_daily (day, metric, value) VALUES (?, 'cron_top_daily', ?)
             ON CONFLICT (day, metric) DO UPDATE SET value = excluded.value`,
          )
            .bind(day, top.stored)
            .run();
          console.log(JSON.stringify({ cron: 'top-daily', ...top }));
        } catch (err) {
          console.error(JSON.stringify({ cron: 'top-daily', level: 'error', err: String(err) }));
        }

        // ---- Check-ins sécurité échus (Étape 7, plan 7.5) ----
        // Rappel push « Ça s’est bien passé ? » après la date du rendez-vous.
        try {
          const due = await env.DB.prepare(
            `SELECT id, user_id FROM safety_checkins
             WHERE status = 'active' AND when_ts < ? AND reminded_at IS NULL LIMIT 50`,
          )
            .bind(now)
            .all<{ id: string; user_id: string }>();
          for (const ck of due.results ?? []) {
            await sendPushToUser(env, ck.user_id, {
              title: 'Ça s’est bien passé ?',
              body: 'Ton check-in sécurité arrive à échéance — confirme que tout va bien.',
              tag: 'checkin',
              url: '#/app',
            });
            await env.DB.prepare(`UPDATE safety_checkins SET reminded_at = ? WHERE id = ?`)
              .bind(now, ck.id)
              .run();
          }
          if ((due.results ?? []).length > 0) {
            console.log(JSON.stringify({ cron: 'checkin-reminders', sent: (due.results ?? []).length }));
          }
        } catch (err) {
          console.error(JSON.stringify({ cron: 'checkin-reminders', level: 'error', err: String(err) }));
        }
      })(),
    );
  },
};

// Export pour tests/typage
export type { AppEnv, Env };
export const _internal = { app, APP };

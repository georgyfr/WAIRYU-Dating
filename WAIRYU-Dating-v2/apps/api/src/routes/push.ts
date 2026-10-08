/**
 * Web Push device-based — socle notifications (mission anticipée avant Étape 2).
 *
 * Endpoints PUBLICS (CORS ouvert, sans cookie) tant que l'authentification
 * n'existe pas ; à l'Étape 2, subscribe/test seront liés à la session
 * (device_push_subscriptions.user_id) et openCors sera serré.
 *
 * Flux :
 *  1. POST /api/push/open      — chaque ouverture d'appareil (première ouverture
 *                                ⇒ événement in-app « first_open » ; si
 *                                l'abonnement existe déjà et welcome_pending,
 *                                envoi immédiat du push de bienvenue).
 *  2. GET  /api/push/key       — clé publique VAPID (enabled:false si absente).
 *  3. POST /api/push/subscribe — abonnement navigateur (endpoint + keys) ;
 *                                envoie la bienvenue (welcome_pending) ou une
 *                                confirmation au premier abonnement.
 *  4. POST /api/push/test      — VRAI push de bout en bout (force:true).
 *  5. GET/POST /api/push/events — journal in-app (canal universel 2016/2017).
 *  6. POST /api/push/unsubscribe.
 */
import { Hono } from 'hono';
import type { AppEnv } from '../env';
import { errors, errorBody, reqId } from '../lib/errors';
import { pushEnabled, sendPushToDevice } from '../lib/push';
import { kvRateLimit } from '../lib/kvrate';
import type {
  LinkDeviceResponse,
  PushConfigResponse,
  PushEventRow,
  PushEventsResponse,
  PushOpenResponse,
  PushSubscribeResponse,
  PushTestResponse,
} from '@wairyu/shared';

export const pushRoutes = new Hono<AppEnv>();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DEVICE_RE = /^[A-Za-z0-9_-]{8,64}$/;

function parseDeviceId(raw: unknown): string {
  if (typeof raw !== 'string' || !DEVICE_RE.test(raw)) {
    throw errors.badRequest('deviceId invalide (8-64 caractères alphanumériques).');
  }
  return raw;
}

function parseSubscription(payload: {
  endpoint?: unknown;
  keys?: { p256dh?: unknown; auth?: unknown };
}): { endpoint: string; p256dh: string; auth: string } {
  const endpoint = typeof payload?.endpoint === 'string' ? payload.endpoint : '';
  const p256dh = typeof payload?.keys?.p256dh === 'string' ? payload.keys.p256dh : '';
  const auth = typeof payload?.keys?.auth === 'string' ? payload.keys.auth : '';
  if (!endpoint.startsWith('https://') || !p256dh || !auth) {
    throw errors.badRequest('Abonnement push invalide.');
  }
  if (endpoint.length > 1024 || p256dh.length > 256 || auth.length > 256) {
    throw errors.badRequest('Abonnement push trop long.');
  }
  return { endpoint, p256dh, auth };
}

function parsePlatform(raw: unknown): 'web' | 'android' | 'ios' {
  return raw === 'android' || raw === 'ios' ? raw : 'web';
}

async function bumpMetric(db: D1Database, metric: string): Promise<void> {
  const day = new Date().toISOString().slice(0, 10);
  await db
    .prepare(
      `INSERT INTO metrics_daily (day, metric, value) VALUES (?, ?, 1)
       ON CONFLICT (day, metric) DO UPDATE SET value = value + 1`,
    )
    .bind(day, metric)
    .run();
}

async function logEvent(
  db: D1Database,
  deviceId: string | null,
  kind: string,
  title: string,
  body: string,
  channel: 'push' | 'inapp' | 'local',
  delivered: boolean,
  error: string | null,
  userId: string | null = null,
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO notification_events (id, device_id, user_id, kind, title, body, channel, delivered, error, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      crypto.randomUUID(),
      deviceId,
      userId,
      kind.slice(0, 40),
      title.slice(0, 120),
      body.slice(0, 500),
      channel,
      delivered ? 1 : 0,
      error,
      Math.floor(Date.now() / 1000),
    )
    .run();
}

interface DeviceRow {
  first_open_at: number;
  open_count: number;
  welcome_pending: number;
}

function doualaTime(): string {
  try {
    return new Intl.DateTimeFormat('fr-FR', {
      timeZone: 'Africa/Douala',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());
  } catch {
    return new Date().toISOString();
  }
}

// ---------------------------------------------------------------------------
// GET /push/key — clé publique VAPID
// ---------------------------------------------------------------------------

pushRoutes.get('/push/key', async (c) => {
  const enabled = await pushEnabled(c.env);
  const body: PushConfigResponse = {
    enabled,
    publicKey: enabled ? (c.env.VAPID_PUBLIC_KEY ?? null) : null,
  };
  return c.json(body);
});

// ---------------------------------------------------------------------------
// POST /push/open — enregistrement d'ouverture (première ouverture = événement)
// ---------------------------------------------------------------------------

pushRoutes.post('/push/open', async (c) => {
  const payload = (await c.req.json().catch(() => null)) as {
    deviceId?: unknown;
    platform?: unknown;
  } | null;
  const deviceId = parseDeviceId(payload?.deviceId);
  const platform = parsePlatform(payload?.platform);

  // Garde anti-abus soft : 60 ouvertures/min/appareil.
  const rl = await kvRateLimit(c.env.CONFIG, 'push_open', deviceId, 60, 60);
  if (!rl.allowed) throw errors.rateLimited('Trop d\u2019ouvertures, réessayez dans un instant.');

  const now = Math.floor(Date.now() / 1000);
  const ua = (c.req.header('user-agent') ?? '').slice(0, 200);

  const existing = await c.env.DB.prepare(
    `SELECT first_open_at, open_count, welcome_pending FROM devices WHERE id = ? LIMIT 1`,
  )
    .bind(deviceId)
    .first<DeviceRow>();

  let firstOpen = false;
  if (!existing) {
    firstOpen = true;
    await c.env.DB.prepare(
      `INSERT INTO devices (id, platform, user_agent, first_open_at, last_open_at, open_count, welcome_pending, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 1, 1, ?, ?)`,
    )
      .bind(deviceId, platform, ua, now, now, now, now)
      .run();
    await logEvent(
      c.env.DB,
      deviceId,
      'first_open',
      'Première ouverture de WAIRYU',
      'Bienvenue ! Cet appareil est enregistré. Cette notification in-app fonctionne sur tous les appareils, même les plus anciens.',
      'inapp',
      true,
      null,
    );
  } else {
    await c.env.DB.prepare(
      `UPDATE devices SET last_open_at = ?, open_count = open_count + 1,
        user_agent = COALESCE(NULLIF(?, ''), user_agent), updated_at = ? WHERE id = ?`,
    )
      .bind(now, ua, now, deviceId)
      .run();
  }

  // Bienvenue push immédiate si l'appareil est DÉJÀ abonné et en attente
  // (cas : permission accordée avant cette ouverture, réinstallation, etc.).
  const sub = await c.env.DB.prepare(
    `SELECT endpoint FROM device_push_subscriptions WHERE device_id = ? LIMIT 1`,
  )
    .bind(deviceId)
    .first<{ endpoint: string }>();
  const pending = firstOpen ? true : (existing?.welcome_pending ?? 0) === 1;
  let welcomeSent = false;
  if (sub && pending) {
    const r = await sendPushToDevice(c.env, deviceId, {
      title: 'Bienvenue sur WAIRYU',
      body: 'Première ouverture enregistrée : les notifications push fonctionnent sur cet appareil.',
      tag: 'wairyu-welcome',
      url: '/',
      force: true,
      kind: 'news',
    });
    welcomeSent = r.sent > 0;
    await logEvent(
      c.env.DB,
      deviceId,
      'first_open',
      'Bienvenue sur WAIRYU',
      'Notification de première ouverture envoyée en push.',
      'push',
      welcomeSent,
      r.error,
    );
    if (r.sent > 0 || r.gone) {
      await c.env.DB.prepare(`UPDATE devices SET welcome_pending = 0 WHERE id = ?`).bind(deviceId).run();
    }
  }

  const state = await c.env.DB.prepare(
    `SELECT open_count, welcome_pending FROM devices WHERE id = ? LIMIT 1`,
  )
    .bind(deviceId)
    .first<DeviceRow>();
  const body: PushOpenResponse = {
    firstOpen,
    openCount: state?.open_count ?? 1,
    welcomePending: (state?.welcome_pending ?? 1) === 1,
    subscribed: Boolean(sub),
  };
  return c.json(body);
});

// ---------------------------------------------------------------------------
// POST /push/subscribe — abonnement navigateur du device
// ---------------------------------------------------------------------------

pushRoutes.post('/push/subscribe', async (c) => {
  const payload = (await c.req.json().catch(() => null)) as {
    deviceId?: unknown;
    platform?: unknown;
    endpoint?: unknown;
    keys?: { p256dh?: unknown; auth?: unknown };
  } | null;
  const deviceId = parseDeviceId(payload?.deviceId);
  const platform = parsePlatform(payload?.platform);
  const sub = parseSubscription({
    endpoint: payload?.endpoint,
    keys: payload?.keys,
  });

  const rl = await kvRateLimit(c.env.CONFIG, 'push_subscribe', deviceId, 10, 60);
  if (!rl.allowed) throw errors.rateLimited('Trop d\u2019abonnements, réessayez dans un instant.');

  const enabled = await pushEnabled(c.env);
  if (!enabled) {
    const body: PushSubscribeResponse = { ok: true, welcomeSent: false, confirmSent: false };
    return c.json(body);
  }

  const now = Math.floor(Date.now() / 1000);
  const ua = (c.req.header('user-agent') ?? '').slice(0, 200);

  const dev = await c.env.DB.prepare(
    `SELECT welcome_pending FROM devices WHERE id = ? LIMIT 1`,
  )
    .bind(deviceId)
    .first<DeviceRow>();
  if (!dev) {
    // Appareil inconnu qui s'abonne directement (première ouverture + consentement
    // dans le même geste) : on crée la ligne + l'événement first_open in-app.
    await c.env.DB.prepare(
      `INSERT INTO devices (id, platform, user_agent, first_open_at, last_open_at, open_count, welcome_pending, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 1, 1, ?, ?)`,
    )
      .bind(deviceId, platform, ua, now, now, now, now)
      .run();
    await logEvent(
      c.env.DB,
      deviceId,
      'first_open',
      'Première ouverture de WAIRYU',
      'Bienvenue ! Cet appareil est enregistré lors de son premier abonnement push.',
      'inapp',
      true,
      null,
    );
  }

  // Un endpoint n'appartient qu'à UN appareil : réaffectation propre.
  await c.env.DB.prepare(
    `DELETE FROM device_push_subscriptions WHERE endpoint = ? AND device_id != ?`,
  )
    .bind(sub.endpoint, deviceId)
    .run();

  const hadSub = await c.env.DB.prepare(
    `SELECT id FROM device_push_subscriptions WHERE device_id = ? LIMIT 1`,
  )
    .bind(deviceId)
    .first<{ id: string }>();

  await c.env.DB.prepare(
    `INSERT INTO device_push_subscriptions
       (id, device_id, endpoint, p256dh, auth, platform, user_agent, first_open_at, last_open_at, open_count, welcome_pending, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)
     ON CONFLICT (device_id) DO UPDATE SET
       endpoint = excluded.endpoint, p256dh = excluded.p256dh, auth = excluded.auth,
       platform = excluded.platform, user_agent = excluded.user_agent, updated_at = excluded.updated_at`,
  )
    .bind(
      crypto.randomUUID(),
      deviceId,
      sub.endpoint,
      sub.p256dh,
      sub.auth,
      platform,
      ua,
      now,
      now,
      dev ? (dev.welcome_pending ?? 1) : 1,
      now,
      now,
    )
    .run();

  let welcomeSent = false;
  let confirmSent = false;

  if (!dev || (dev.welcome_pending ?? 1) === 1) {
    // Première notification de l'appareil : la bienvenue (première ouverture).
    const r = await sendPushToDevice(c.env, deviceId, {
      title: 'Bienvenue sur WAIRYU',
      body: 'Notifications activées : tu seras averti des nouveaux matchs et messages.',
      tag: 'wairyu-welcome',
      url: '/',
      force: true,
      kind: 'news',
    });
    welcomeSent = r.sent > 0;
    await logEvent(
      c.env.DB,
      deviceId,
      'first_open',
      'Bienvenue sur WAIRYU',
      'Notification de bienvenue envoyée en push après activation.',
      'push',
      welcomeSent,
      r.error,
    );
    if (r.sent > 0 || r.gone) {
      await c.env.DB.prepare(`UPDATE devices SET welcome_pending = 0 WHERE id = ?`).bind(deviceId).run();
    }
  } else if (!hadSub) {
    // Réabonnement d'un appareil déjà accueilli : confirmation immédiate.
    const r = await sendPushToDevice(c.env, deviceId, {
      title: 'Notifications activées',
      body: 'Le canal push WAIRYU est actif sur cet appareil.',
      tag: 'wairyu-subscribed',
      url: '/',
      force: true,
      kind: 'news',
    });
    confirmSent = r.sent > 0;
    await logEvent(
      c.env.DB,
      deviceId,
      'subscribe_confirmed',
      'Notifications activées',
      'Abonnement push confirmé par le serveur.',
      'push',
      confirmSent,
      r.error,
    );
    if (r.gone) {
      await c.env.DB.prepare(`DELETE FROM device_push_subscriptions WHERE device_id = ?`)
        .bind(deviceId)
        .run();
    }
  }

  const body: PushSubscribeResponse = { ok: true, welcomeSent, confirmSent };
  return c.json(body);
});

// ---------------------------------------------------------------------------
// POST /push/link-device — liaison appareil ↔ compte (session requise)
// Appelé par le front après chaque authentification réussie (OTP, mot de
// passe, OAuth, retour de callback) et à l'ouverture d'une session existante.
// Effets :
//  1. devices.user_id + device_push_subscriptions.user_id = compte courant
//     (base du ciblage utilisateur des notifications, Étape 2+) ;
//  2. si le compte porte congrats_pending (création TOUT CANAL : email /
//     Google / Facebook / pseudo) → notification de FÉLICITATIONS délivrée
//     sur cet appareil : bulle OS (force) + entrée journal in-app ;
//  3. l'appareil suit la session authentifiée COURANTE (« dernier connecté
//     gagne », standard FCM) : si l'appareil était lié à un AUTRE compte, il
//     est rebasculé — l'ancienne garde 403 créait un deadlock réel (prod
//     2026-10-06) : la création d'un 2ᵉ compte sur le même appareil écrase
//     le cookie de session précédent, « déconnecte-toi d'abord » devenait
//     impossible et la félicitations restait orpheline à jamais. Le
//     deviceId est un UUID 128 bits en localStorage, non devinable : le
//     rebinding authentifié n'ouvre pas de vecteur exploitable, et chaque
//     rebasculement est tracé dans metrics_daily (device_rebound).
// ---------------------------------------------------------------------------

pushRoutes.post('/push/link-device', async (c) => {
  const session = c.get('session');
  if (!session) throw errors.unauthorized();
  const payload = (await c.req.json().catch(() => null)) as { deviceId?: unknown } | null;
  const deviceId = parseDeviceId(payload?.deviceId);

  // Anti-abus : 12 liaisons/min/appareil.
  const rl = await kvRateLimit(c.env.CONFIG, 'push_link', deviceId, 12, 60);
  if (!rl.allowed) throw errors.rateLimited('Trop de demandes, réessayez dans un instant.');

  const now = Math.floor(Date.now() / 1000);
  const userId = session.userId;

  // Liaison : l'appareil suit la session authentifiée courante (voir en-tête).
  // Rebasculement tracé quand l'appareil était lié à un autre compte —
  // c'est le cas légitime « 2ᵉ compte créé sur le même appareil » dont le
  // blocage total privait la félicitations (deadlock prod 2026-10-06).
  const owner = await c.env.DB.prepare(`SELECT user_id FROM devices WHERE id = ? LIMIT 1`)
    .bind(deviceId)
    .first<{ user_id: string | null }>();
  if (owner?.user_id && owner.user_id !== userId) {
    await bumpMetric(c.env.DB, 'device_rebound');
  }

  // 1) Liaison (idempotente).
  await c.env.DB.prepare(`UPDATE devices SET user_id = ?, updated_at = ? WHERE id = ?`)
    .bind(userId, now, deviceId)
    .run();
  await c.env.DB.prepare(
    `UPDATE device_push_subscriptions SET user_id = ?, updated_at = ? WHERE device_id = ?`,
  )
    .bind(userId, now, deviceId)
    .run();

  // 2) Félicitations en attente (création de compte, quel que soit le canal).
  let congrats: 'push' | 'inapp' | null = null;
  let congratsVia: string | null = null;
  const user = await c.env.DB.prepare(
    `SELECT congrats_pending, congrats_via FROM users WHERE id = ? LIMIT 1`,
  )
    .bind(userId)
    .first<{ congrats_pending: number; congrats_via: string | null }>();
  if (user?.congrats_pending === 1) {
    congratsVia = user.congrats_via;
    const via = congratsVia ?? 'email';
    const title = 'Bienvenue sur WAIRYU 🎉';
    const bodyText =
      via === 'google'
        ? 'Ton compte a été créé via Google. Inscription enregistrée — ta session reste active, plus besoin de te réinscrire.'
        : via === 'facebook'
          ? 'Ton compte a été créé via Facebook. Inscription enregistrée — ta session reste active, plus besoin de te réinscrire.'
          : via === 'password'
            ? 'Ton compte a été créé avec ton pseudo. Inscription enregistrée — ta session reste active, plus besoin de te réinscrire.'
            : 'Ton compte a été créé avec ton adresse email. Inscription enregistrée — ta session reste active, plus besoin de te réinscrire.';

    // Push OS (force : le fondateur VOIT la bulle même page ouverte). Échec
    // gracieux — le journal in-app reste écrit (canal universel 2016/2017).
    const r = await sendPushToDevice(c.env, deviceId, {
      title,
      body: bodyText,
      tag: 'wairyu-congrats',
      url: '/',
      force: true,
      kind: 'news',
    });
    const pushOk = r.sent > 0;
    await logEvent(
      c.env.DB,
      deviceId,
      'account_created',
      title,
      bodyText,
      pushOk ? 'push' : 'inapp',
      true,
      r.error ?? null,
      userId,
    );
    if (r.gone) {
      await c.env.DB.prepare(`DELETE FROM device_push_subscriptions WHERE device_id = ?`)
        .bind(deviceId)
        .run();
    }
    congrats = pushOk ? 'push' : 'inapp';
    await c.env.DB.prepare(
      `UPDATE users SET congrats_pending = 0, updated_at = ? WHERE id = ? AND congrats_pending = 1`,
    )
      .bind(now, userId)
      .run();
  }

  const body: LinkDeviceResponse = { linked: true, congrats, congratsVia };
  return c.json(body);
});

// ---------------------------------------------------------------------------
// POST /push/test — VRAI push de bout en bout (le fondateur VOIT la bulle OS)
// ---------------------------------------------------------------------------

pushRoutes.post('/push/test', async (c) => {
  const payload = (await c.req.json().catch(() => null)) as { deviceId?: unknown } | null;
  const deviceId = parseDeviceId(payload?.deviceId);

  // Bouton de démonstration = vecteur de spam potentiel : 6/min/appareil.
  const rl = await kvRateLimit(c.env.CONFIG, 'push_test', deviceId, 6, 60);
  if (!rl.allowed) {
    const body: PushTestResponse = { ok: false, sent: 0, reason: 'rate_limited' };
    return c.json(body, 429);
  }

  const enabled = await pushEnabled(c.env);
  if (!enabled) {
    const body: PushTestResponse = { ok: false, sent: 0, reason: 'send_failed', error: 'vapid_disabled' };
    return c.json(body);
  }

  const when = doualaTime();
  const r = await sendPushToDevice(c.env, deviceId, {
    title: 'WAIRYU',
    body: `Notification de test — ${when}. Si vous la lisez, le pipeline push complet fonctionne sur cet appareil.`,
    tag: 'wairyu-test',
    url: '/',
    force: true,
    kind: 'news',
  });

  await logEvent(
    c.env.DB,
    deviceId,
    'test',
    'WAIRYU — notification de test',
    r.sent > 0
      ? `Pipeline push vérifié le ${when}.`
      : r.error === 'no_subscription'
        ? `Tentative du ${when} — pas encore d\u2019abonnement push sur cet appareil.`
        : `Tentative du ${when} — le service push a refusé l\u2019envoi (${r.error ?? 'erreur inconnue'}).`,
    'push',
    r.sent > 0,
    r.error,
  );

  const body: PushTestResponse = {
    ok: r.sent > 0,
    sent: r.sent,
    reason: r.sent === 0 ? (r.error === 'no_subscription' ? 'no_subscription' : 'send_failed') : undefined,
    error: r.error,
  };
  return c.json(body);
});

// ---------------------------------------------------------------------------
// POST /push/unsubscribe
// ---------------------------------------------------------------------------

pushRoutes.post('/push/unsubscribe', async (c) => {
  const payload = (await c.req.json().catch(() => null)) as { deviceId?: unknown } | null;
  const deviceId = parseDeviceId(payload?.deviceId);
  await c.env.DB.prepare(`DELETE FROM device_push_subscriptions WHERE device_id = ?`)
    .bind(deviceId)
    .run();
  await logEvent(
    c.env.DB,
    deviceId,
    'unsubscribed',
    'Notifications désactivées',
    'L\u2019appareil ne reçoit plus de push.',
    'inapp',
    true,
    null,
  );
  return c.json({ ok: true as const });
});

// ---------------------------------------------------------------------------
// GET/POST /push/events — journal in-app (canal universel 2016/2017)
// ---------------------------------------------------------------------------

pushRoutes.get('/push/events', async (c) => {
  const deviceId = c.req.query('deviceId') ?? '';
  if (!DEVICE_RE.test(deviceId)) throw errors.badRequest('deviceId invalide.');
  const { results } = await c.env.DB.prepare(
    `SELECT id, kind, title, body, channel, delivered, error, created_at
     FROM notification_events WHERE device_id = ? ORDER BY created_at DESC LIMIT 50`,
  )
    .bind(deviceId)
    .all<{
      id: string;
      kind: string;
      title: string;
      body: string;
      channel: string;
      delivered: number;
      error: string | null;
      created_at: number;
    }>();

  const events: PushEventRow[] = (results ?? []).map((e) => ({
    id: e.id,
    kind: e.kind,
    title: e.title,
    body: e.body,
    channel: (e.channel === 'push' || e.channel === 'local' ? e.channel : 'inapp') as PushEventRow['channel'],
    delivered: e.delivered === 1,
    error: e.error,
    createdAt: new Date(e.created_at * 1000).toISOString(),
  }));
  const body: PushEventsResponse = { events };
  return c.json(body);
});

pushRoutes.post('/push/events', async (c) => {
  // Journal côté client (ex. notification LOCALE affichée par le SW en repli).
  const payload = (await c.req.json().catch(() => null)) as {
    deviceId?: unknown;
    kind?: unknown;
    title?: unknown;
    body?: unknown;
    channel?: unknown;
  } | null;
  const deviceId = parseDeviceId(payload?.deviceId);
  const kind = typeof payload?.kind === 'string' ? payload.kind.slice(0, 40) : '';
  const title = typeof payload?.title === 'string' ? payload.title.slice(0, 120) : '';
  if (!kind || !title) throw errors.badRequest('kind et title requis.');
  const bodyText = typeof payload?.body === 'string' ? payload.body.slice(0, 500) : '';
  const channel =
    payload?.channel === 'push' || payload?.channel === 'inapp' || payload?.channel === 'local'
      ? payload.channel
      : 'local';
  await logEvent(c.env.DB, deviceId, kind, title, bodyText, channel, true, null);
  return c.json({ ok: true as const });
});

// Références pour éviter les imports inutilisés lors des prochaines évolutions.
void errorBody;
void reqId;

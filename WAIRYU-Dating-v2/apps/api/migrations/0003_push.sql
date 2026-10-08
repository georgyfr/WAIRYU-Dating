-- 0003_push.sql — socle notifications (mission anticipée, pré-Étape 2)
-- Appareils + abonnements push device-based + journal in-app.
-- Règle D1 (leçon 0008 v1) : AUCUN CHECK sur les enums évolutifs — la
-- validation se fait côté API. Les FK ne sont pas déclarées (D1 ignore
-- PRAGMA foreign_keys) : intégrité gérée par le code.

-- ---------- Appareils (identité device-based, liée à user_id à l'Étape 2) ----------
CREATE TABLE IF NOT EXISTS devices (
  id              TEXT PRIMARY KEY,               -- deviceId client (UUID, localStorage)
  platform        TEXT NOT NULL DEFAULT 'web',    -- 'web' | 'android' | 'ios'
  user_agent      TEXT,
  user_id         TEXT,                           -- liaison session (Étape 2+)
  first_open_at   INTEGER NOT NULL,               -- epoch s
  last_open_at    INTEGER NOT NULL,
  open_count      INTEGER NOT NULL DEFAULT 1,
  welcome_pending INTEGER NOT NULL DEFAULT 1,     -- 1 = push de bienvenue à envoyer
  created_at      INTEGER NOT NULL,
  updated_at      INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_devices_user ON devices(user_id);
CREATE INDEX IF NOT EXISTS idx_devices_last_open ON devices(last_open_at);

-- ---------- Abonnements push (1 ligne/appareil ; endpoint unique) ----------
CREATE TABLE IF NOT EXISTS device_push_subscriptions (
  id            TEXT PRIMARY KEY,
  device_id     TEXT NOT NULL UNIQUE,
  endpoint      TEXT NOT NULL UNIQUE,             -- URL du service push (FCM/Mozilla/WNPush)
  p256dh        TEXT NOT NULL,                    -- clé publique ECDH du navigateur
  auth          TEXT NOT NULL,                    -- secret d'authentification
  platform      TEXT NOT NULL DEFAULT 'web',
  user_agent    TEXT,
  user_id       TEXT,                             -- liaison session (Étape 2+)
  first_open_at INTEGER NOT NULL,
  last_open_at  INTEGER NOT NULL,
  open_count    INTEGER NOT NULL DEFAULT 1,
  welcome_pending INTEGER NOT NULL DEFAULT 1,
  created_at    INTEGER NOT NULL,
  updated_at    INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_dps_user ON device_push_subscriptions(user_id);

-- ---------- Journal de notifications (centre in-app universel) ----------
-- Canal 'inapp' : fonctionne sur TOUS les navigateurs (2016/2017 inclus).
-- Canal 'push' : Web Push VAPID. Canal 'local' : notification SW de repli.
CREATE TABLE IF NOT EXISTS notification_events (
  id         TEXT PRIMARY KEY,
  device_id  TEXT,
  user_id    TEXT,                                -- liaison (Étape 2+)
  kind       TEXT NOT NULL,                       -- first_open | test | subscribe_confirmed | unsubscribed | …
  title      TEXT NOT NULL,
  body       TEXT NOT NULL DEFAULT '',
  channel    TEXT NOT NULL DEFAULT 'inapp',
  delivered  INTEGER NOT NULL DEFAULT 0,
  error      TEXT,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_nev_device ON notification_events(device_id, created_at);
CREATE INDEX IF NOT EXISTS idx_nev_user ON notification_events(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_nev_created ON notification_events(created_at);

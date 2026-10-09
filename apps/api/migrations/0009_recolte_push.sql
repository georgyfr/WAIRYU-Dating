-- 0009_recolte_push.sql — wairyu : push OS des notifications de récolte
-- (demande fondateur Task 47 : « les notifications de récolte » = de VRAIES
-- notifications push web + mobile, pas seulement le journal in-app de la cloche).
--
-- Flux : le front (qui détient l'état réel des quêtes en localStorage) poste
-- les récoltes NOUVELLES à POST /api/push/notify-recolte (session requise) ;
-- le serveur dédoublonne ICI puis envoie le push VAPID à TOUS les appareils
-- liés au compte (device_push_subscriptions.user_id, colonne 0003_push).
-- Sans cette table, chaque appareil du compte re-posterait la même récolte
-- à sa synchronisation (boot, complétion) → bulles en double sur le téléphone.
--
-- Règle D1 : pas de FK déclarée (D1 ignore PRAGMA foreign_keys) — intégrité
-- par le code. Pas de CHECK (enums évolutifs validés côté API).
-- Rétention : purgé au cron quotidien à 90 j (voir index.ts scheduled) —
-- une récolte n'a pas de sens re-poussée plus tard.

CREATE TABLE IF NOT EXISTS push_recolte_dedup (
  user_id    TEXT NOT NULL,                 -- compte destinataire (sessions.user_id)
  notif_id   TEXT NOT NULL,                 -- id déterministe du journal récolte ('carte:1.1', 'sceau:M2'…)
  sent       INTEGER NOT NULL DEFAULT 0,    -- 1 = push effectivement parti (télémétrie légère)
  created_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, notif_id)
);

CREATE INDEX IF NOT EXISTS idx_prd_created ON push_recolte_dedup(created_at);

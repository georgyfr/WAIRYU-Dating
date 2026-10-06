-- 0008_notifs_auth.sql — wairyu : notifications d'authentification (fondateur, 2026)
-- 1) Congratulation à la CRÉATION de compte, quel que soit le canal
--    (email OTP / Google / Facebook / pseudo+mot de passe) : le compte porte
--    un drapeau « congrats_pending » ; l'appareil qui se lie à la session
--    (POST /api/push/link-device) déclenche la notification de félicitations
--    (push OS + journal in-app universel 2016/2017).
-- 2) Relais du code OTP par notification : les appareils déjà liés à un
--    utilisateur (devices.user_id / device_push_subscriptions.user_id, colonnes
--    posées par 0003_push) reçoivent le code à 6 chiffres en push — l'utilisateur
--    n'a plus à fouiller sa boîte mail. L'email reste TOUJOURS envoyé (filet).
--
-- Règle D1 : pas de CHECK sur les valeurs évolutives (congrats_via est validé
-- côté API) ; colonnes ajoutées par ALTER simple, migration append-only.

ALTER TABLE users ADD COLUMN congrats_pending INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN congrats_via TEXT;

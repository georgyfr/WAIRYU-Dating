-- 0020_push_preferences — Task 62 (fondateur) : « notifications automatiques,
-- choix des types dans Réglages ».
--
--  - enabled : interrupteur maître (0 = plus AUCUN push métier, sauf
--    bypassPrefs pour les réponses à une action explicite).
--  - types   : JSON {message,match,checkin,news} — 1/0 par catégorie.
--    Par défaut TOUT à 1 (comportement d'avant Task 62 inchangé).
--
-- Le filtrage se fait côté Worker (sendPushToUser lit cette table) : le
-- Service Worker reste simple, et une préférence mise à jour s'applique au
-- push SUIVANT sans re-synchroniser les appareils.

CREATE TABLE push_preferences (
  user_id    TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  enabled    INTEGER NOT NULL DEFAULT 1,
  types      TEXT    NOT NULL DEFAULT '{"message":1,"match":1,"checkin":1,"news":1}',
  updated_at INTEGER NOT NULL
);

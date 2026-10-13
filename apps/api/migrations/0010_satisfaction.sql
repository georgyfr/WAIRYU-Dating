-- 0010_satisfaction.sql — wairyu : la barre de satisfaction des quêtes
-- (Task 66, demande fondateur : « une barre de section lorsque une quête est
-- terminée pour que la personne évalue… son degré de satisfaction des
-- réponses, tout simplement »).
--
-- Le front poste chaque note à POST /api/satisfaction (fire-and-forget :
-- la note ne doit jamais bloquer le parcours). La session est OPTIONNELLE —
-- un membre peut noter avant toute connexion — d'où session_id nullable.
--
-- Usage : améliorer les quêtes, une par une (lecture founder via
-- GET /admin/satisfaction). Les notes n'entrent dans AUCUN score, AUCUN
-- sélecteur, AUCUNE carte — jamais.
--
-- Règle D1 : pas de FK déclarée (D1 ignore PRAGMA foreign_keys) — intégrité
-- par le code. Pas de CHECK (enums évolutifs validés côté API).

CREATE TABLE IF NOT EXISTS satisfaction (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  quete       TEXT NOT NULL,                -- identifiant de quête ('1.3', '2.6'…)
  note        INTEGER NOT NULL,             -- 1..5 (validé côté API, jamais un seuil)
  commentaire TEXT NOT NULL DEFAULT '',     -- facultatif, ≤ 500 caractères
  session_id  TEXT,                         -- session si connecté, sinon NULL
  created_at  TEXT NOT NULL                 -- ISO 8601
);

CREATE INDEX IF NOT EXISTS idx_satisfaction_quete ON satisfaction(quete, created_at);

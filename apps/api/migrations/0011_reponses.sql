-- 0011_reponses.sql — wairyu : LA SAUVEGARDE QUI TE SUIT PARTOUT (Task 69-c,
-- GO fondateur : « migration des réponses vers la base »).
--
-- Les réponses des quêtes vivent aujourd'hui en localStorage (intermédiaire
-- assumé, documenté dans apps/web/src/lib/quete-state.ts). Cette table les
-- rattache au COMPTE : le membre qui se reconnecte sur un autre appareil
-- retrouve ses quêtes, ses cartes et ses lectures — rien ne se perd.
--
-- FORME DES DONNÉES : `etat` = le même JSON que la clé locale
-- `wairyu.quete.{id}` ({ reponses, terminee, carteId, termineeA, lectures,
-- textes? }) — audit de forme côté API, jamais interprété ici : le scoring et
-- les sélecteurs restent CÔTÉ NAVIGATEUR, la base ne stocke que l'état brut
-- des réponses. AUCUN score, AUCUN sélecteur, AUCUNE carte ne se calcule ici.
--
-- ARBITRAGE DE CONFLIT : last-write-wins (updated_at = ISO du dernier PUT).
-- La restauration côté client compare le `majA` local au `updated_at` distant,
-- quête par quête — le plus récent gagne, l'autre appareil rattrape.
--
-- Règle D1 : pas de FK déclarée (D1 ignore PRAGMA foreign_keys) — intégrité
-- par le code (user_id validé par la session, jamais par le client).

CREATE TABLE IF NOT EXISTS reponses (
  user_id    TEXT NOT NULL,                -- users.id (UUIDv4, via session)
  quete      TEXT NOT NULL,                -- identifiant de quête ('1.1', '5.7'…)
  etat       TEXT NOT NULL,                -- JSON de l'état (même forme que le local)
  updated_at TEXT NOT NULL,                -- ISO 8601 — arbitre du conflit
  created_at TEXT NOT NULL,                -- ISO 8601 — première sauvegarde
  PRIMARY KEY (user_id, quete)
);

CREATE INDEX IF NOT EXISTS idx_reponses_user ON reponses(user_id, updated_at DESC);

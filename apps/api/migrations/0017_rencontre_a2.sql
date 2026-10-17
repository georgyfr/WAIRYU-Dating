-- RENCONTRE-E3 « Le Voyage à Deux » (Task 115) — SPEC v1.1, décisions gravées
-- D-E3-1..9 + G-E3-P1..P10. Migration ADDITIVE : aucune table existante touchée
-- (conventions 0012/0015 : UUIDv4 en TEXT PK, horodatage ISO 8601 TEXT).

-- Les PORTES du voile (D-E3-2 : texte → voix → photo, chaque niveau SA porte)
-- Deux lignes (match_id, niveau) = le double oui — l'ouverture est DÉRIVÉE,
-- jamais stockée (D-E3-3 : la demande se voit, le refus jamais).
CREATE TABLE IF NOT EXISTS rencontre_voiles (
  id        TEXT PRIMARY KEY,                        -- UUIDv4
  match_id  TEXT NOT NULL,                           -- rencontre_matchs.id
  niveau    INTEGER NOT NULL CHECK (niveau IN (2, 3, 4)),
  user_id   TEXT NOT NULL,                           -- users.id (celui qui lève le voile)
  cree_a    TEXT NOT NULL,                           -- ISO 8601
  UNIQUE (match_id, niveau, user_id)                 -- un oui unique par niveau
);

CREATE INDEX IF NOT EXISTS idx_rv_match ON rencontre_voiles(match_id, niveau);

-- Le DUO de cartes (économie §2.2 : après un match, quête complétée par les
-- DEUX → mise en regard consentie). Deux lignes (match_id, quete) = ouvert.
CREATE TABLE IF NOT EXISTS rencontre_duo (
  id        TEXT PRIMARY KEY,                        -- UUIDv4
  match_id  TEXT NOT NULL,                           -- rencontre_matchs.id
  quete     TEXT NOT NULL,                           -- '1.1'..'5.11' (reponses.quete)
  user_id   TEXT NOT NULL,                           -- users.id (celui qui propose)
  cree_a    TEXT NOT NULL,                           -- ISO 8601
  UNIQUE (match_id, quete, user_id)
);

CREATE INDEX IF NOT EXISTS idx_rduo_match ON rencontre_duo(match_id, quete);

-- L'activité pilote « Trois questions croisées » (volet C) — UNE active par
-- paire à la fois ; à la révélation (deux répondants × 3 questions) elle
-- passe « devoilee » et reste l'unique (le v1 ne crée pas de série).
CREATE TABLE IF NOT EXISTS rencontre_a2 (
  id         TEXT PRIMARY KEY,                       -- UUIDv4
  match_id   TEXT NOT NULL,                          -- rencontre_matchs.id
  titre      TEXT NOT NULL DEFAULT 'trois_questions',
  statut     TEXT NOT NULL DEFAULT 'en_cours' CHECK (statut IN ('en_cours', 'devoilee')),
  cree_a     TEXT NOT NULL,                          -- ISO 8601
  devoilee_a TEXT,
  UNIQUE (match_id, titre)
);

CREATE INDEX IF NOT EXISTS idx_ra2_match ON rencontre_a2(match_id);

-- Les réponses croisées : répondre = consentir à l'échange (le dévoilement
-- est STRUCTUREL — rien ne se voit tant que les deux n'ont pas répondu aux 3).
CREATE TABLE IF NOT EXISTS rencontre_a2_reponses (
  id          TEXT PRIMARY KEY,                      -- UUIDv4
  activite_id TEXT NOT NULL,                         -- rencontre_a2.id
  user_id     TEXT NOT NULL,                         -- users.id
  question_id TEXT NOT NULL,                         -- 'q1' | 'q2' | 'q3'
  corps       TEXT NOT NULL CHECK (length(corps) <= 1000),
  cree_a      TEXT NOT NULL,                         -- ISO 8601
  UNIQUE (activite_id, user_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_ra2r_activite ON rencontre_a2_reponses(activite_id);

-- Les médias privés-paire (D-E3-6 : PAR le Worker, jamais de bucket public).
-- La voix = notes multiples dans le fil ; la photo = UNE active par membre
-- (remplacer = purge R2 de l'ancienne + INSERT, logique applicative).
CREATE TABLE IF NOT EXISTS rencontre_medias (
  id       TEXT PRIMARY KEY,                         -- UUIDv4 (= mediaId)
  match_id TEXT NOT NULL,                            -- rencontre_matchs.id
  user_id  TEXT NOT NULL,                            -- users.id (l'auteur)
  type     TEXT NOT NULL CHECK (type IN ('voix', 'photo')),
  r2_key   TEXT NOT NULL,                            -- media/a2/{matchId}/{id}
  duree_s  INTEGER,                                  -- voix seulement
  octets   INTEGER NOT NULL,
  mime     TEXT NOT NULL DEFAULT '',
  cree_a   TEXT NOT NULL                             -- ISO 8601
);

CREATE INDEX IF NOT EXISTS idx_rmed_match ON rencontre_medias(match_id, type);
CREATE INDEX IF NOT EXISTS idx_rmed_user ON rencontre_medias(user_id);

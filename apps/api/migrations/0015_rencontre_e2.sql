-- 0015 — RENCONTRE-E2 « Les conversations » (Task 107, reconstitution).
--
-- SPEC : docs/SPEC-RENONCONTRE-E2.v1.md (D-E2-1..11).
--
-- CONTEXTE : une migration antérieure (0013_rencontres_messages, session
-- parallèle) a déjà créé en STAGING rencontre_messages / rencontre_blocages /
-- rencontre_signalements avec un schéma FRANÇAIS (de/contre, par/contre,
-- 6 motifs, statut de modération). CE fichier reprend ce schéma À L'IDENTIQUE
-- (IF NOT EXISTS → no-op en staging) pour la PROD, et ajoute les deux tables
-- manquantes : les non-lus dérivés (rencontre_lus) et la révélation consentie
-- (rencontre_reveals).
--
-- Conventions : UUIDv4 en TEXT ; cree_a ISO 8601 ; RGPD : hardDeleteAccount
-- (auth.ts) purge TOUTES ces tables physiquement. Structure des
-- tests/outils/questionnaires intouchable — ADDITIF pur.

-- (Déjà en staging — créé ici pour la prod, schéma identique à 0013_rencontres_messages.)
CREATE TABLE IF NOT EXISTS rencontre_messages (
  id        TEXT PRIMARY KEY,                        -- UUIDv4
  match_id  TEXT NOT NULL,                           -- rencontre_matchs.id
  de        TEXT NOT NULL,                           -- users.id (expéditeur)
  corps     TEXT NOT NULL CHECK (length(corps) BETWEEN 1 AND 2000),
  langue    TEXT NOT NULL DEFAULT 'fr' CHECK (langue IN ('fr', 'en')),
  cree_a    TEXT NOT NULL,                           -- ISO 8601
  FOREIGN KEY (match_id) REFERENCES rencontre_matchs(id)
);

CREATE INDEX IF NOT EXISTS idx_rmsg_match ON rencontre_messages(match_id, cree_a);
CREATE INDEX IF NOT EXISTS idx_rmsg_de ON rencontre_messages(de, cree_a DESC);

-- (Déjà en staging — créé ici pour la prod.)
CREATE TABLE IF NOT EXISTS rencontre_blocages (
  id        TEXT PRIMARY KEY,                        -- UUIDv4
  par       TEXT NOT NULL,                           -- users.id (celui qui bloque)
  contre    TEXT NOT NULL,                           -- users.id (le bloqué)
  cree_a    TEXT NOT NULL,                           -- ISO 8601
  UNIQUE (par, contre)                               -- un blocage par paire
);

CREATE INDEX IF NOT EXISTS idx_rblk_par ON rencontre_blocages(contre);
CREATE INDEX IF NOT EXISTS idx_rblk_contre ON rencontre_blocages(contre);

-- (Déjà en staging — créé ici pour la prod.)
CREATE TABLE IF NOT EXISTS rencontre_signalements (
  id        TEXT PRIMARY KEY,                        -- UUIDv4
  de        TEXT NOT NULL,                           -- users.id (le signalant)
  contre    TEXT NOT NULL,                           -- users.id (le signalé)
  motif     TEXT NOT NULL CHECK (motif IN (
              'escroquerie_ou_argent', 'harcelement', 'faux_profil',
              'contenu_inapproprie', 'fetichisant', 'autre')),
  detail    TEXT CHECK (detail IS NULL OR length(detail) <= 1000),
  match_id  TEXT,                                    -- contexte optionnel
  statut    TEXT NOT NULL DEFAULT 'ouvert' CHECK (statut IN ('ouvert', 'traite', 'rejete')),
  cree_a    TEXT NOT NULL                            -- ISO 8601
);

CREATE INDEX IF NOT EXISTS idx_rsig_de ON rencontre_signalements(contre);
CREATE INDEX IF NOT EXISTS idx_rsig_contre ON rencontre_signalements(contre);

-- Les non-lus par membre : un upsert « dernier message vu » — le badge est
-- DÉRIVÉ (COUNT des messages postérieurs à lu_a), jamais stocké en clair.
CREATE TABLE IF NOT EXISTS rencontre_lus (
  match_id TEXT NOT NULL,                             -- rencontre_matchs.id
  user_id  TEXT NOT NULL,                             -- users.id
  lu_a     TEXT NOT NULL,                             -- ISO 8601
  PRIMARY KEY (match_id, user_id)
);

-- Révélation consentie (D-E2-6) : une ligne par membre qui demande ; révélé
-- quand LES DEUX lignes existent. Le seuil (REVEAL.minMessages ET minDays du
-- shared, héritage v1) est vérifié AVANT d'accepter la demande.
CREATE TABLE IF NOT EXISTS rencontre_reveals (
  match_id TEXT NOT NULL,                             -- rencontre_matchs.id
  user_id  TEXT NOT NULL,                             -- users.id (demandeur)
  cree_a   TEXT NOT NULL,                             -- ISO 8601
  PRIMARY KEY (match_id, user_id)
);

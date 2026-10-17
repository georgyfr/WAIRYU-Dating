-- MODÉRATION & APPEL (Task 115) — SPEC-MODERATION-APPEL v1.1, décisions
-- gravées M-1..7 + G-MA-1..6. Migration ADDITIVE (conventions 0012/0015).

-- Les sanctions (P1 : deux mesures graduées, rien de plus). L'ACTIVE d'un
-- compte = levee_a IS NULL (une seule à la fois, la plus haute appliquée).
-- Toute pose/levée écrit AUSSI dans audit_admin (M-2, tracée).
CREATE TABLE IF NOT EXISTS moderation_sanctions (
  id             TEXT PRIMARY KEY,                   -- UUIDv4
  user_id        TEXT NOT NULL,                      -- users.id (le sanctionné)
  niveau         INTEGER NOT NULL CHECK (niveau IN (1, 2)),
  signalement_id TEXT,                               -- rencontre_signalements.id (nullable)
  details        TEXT CHECK (details IS NULL OR length(details) <= 500),
  cree_a         TEXT NOT NULL,                      -- ISO 8601
  levee_a        TEXT,                               -- NULL = active
  levee_par      TEXT                                -- 'appel_accepte' | admin
);

CREATE INDEX IF NOT EXISTS idx_msan_user ON moderation_sanctions(user_id, levee_a);

-- Le chemin d'appel in-app (G-MA-3) : « Demander une relecture ». Un appel
-- UNIQUE par sanction (G-MA-5 : 1 actif à la fois), jamais le nom du
-- signalant (M-6) — la réponse se voit, pas son auteur.
CREATE TABLE IF NOT EXISTS moderation_appels (
  id          TEXT PRIMARY KEY,                      -- UUIDv4
  user_id     TEXT NOT NULL,                         -- users.id (l'appelant)
  sanction_id TEXT NOT NULL,                         -- moderation_sanctions.id
  message     TEXT NOT NULL CHECK (length(message) <= 1000),
  statut      TEXT NOT NULL DEFAULT 'ouvert' CHECK (statut IN ('ouvert', 'accepte', 'rejete')),
  cree_a      TEXT NOT NULL,                         -- ISO 8601
  traite_a    TEXT
);

CREATE INDEX IF NOT EXISTS idx_mapp_statut ON moderation_appels(statut, cree_a DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_mapp_sanction ON moderation_appels(sanction_id);

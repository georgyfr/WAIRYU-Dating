-- 0012 — Rencontre-E1 (Task 94) : le premier pas et les matchs.
--
-- SPEC : docs/SPEC-RENONCONTRE-E1.v1.md (D-R1..D-R4, P2/P4/P5).
-- Le jalon A (Miroir 1.1→1.3 terminé) est DÉRIVÉ de la table `reponses`
-- (json_extract sur etat.terminee) — aucun stockage de progression nouveau.
-- Deux tables seulement : le pas (l'intérêt envoyé) et le match (la
-- réciprocité). `rencontre_profils` n'existe PAS en E1 : le profil de
-- rencontre est dérivé (pseudo + profondeur du voyage), les cartes exposées
-- arrivent plus tard (P3 — défaut = aucune carte).
--
-- Doctrine RGPD inchangée : hardDeleteAccount purge ces deux tables
-- physiquement et immédiatement (auth.ts).

CREATE TABLE IF NOT EXISTS rencontre_pas (
  id      TEXT PRIMARY KEY,                          -- UUIDv4
  de      TEXT NOT NULL,                             -- users.id (expéditeur)
  vers    TEXT NOT NULL,                             -- users.id (destinataire)
  statut  TEXT NOT NULL DEFAULT 'actif' CHECK (statut IN ('actif', 'retire', 'match')),
  cree_a  TEXT NOT NULL,                             -- ISO 8601
  UNIQUE (de, vers)                                  -- UN pas par personne et par destinataire (P5)
);

CREATE INDEX IF NOT EXISTS idx_rpas_vers ON rencontre_pas(vers, statut, cree_a DESC);
CREATE INDEX IF NOT EXISTS idx_rpas_de ON rencontre_pas(de, statut, cree_a DESC);

CREATE TABLE IF NOT EXISTS rencontre_matchs (
  id      TEXT PRIMARY KEY,                          -- UUIDv4
  a       TEXT NOT NULL,                             -- users.id (ordre canonique : min des deux)
  b       TEXT NOT NULL,                             -- users.id (max des deux)
  cree_a  TEXT NOT NULL,                             -- ISO 8601
  UNIQUE (a, b)                                      -- un match par paire, jamais deux
);

CREATE INDEX IF NOT EXISTS idx_rmatchs_a ON rencontre_matchs(a, cree_a DESC);
CREATE INDEX IF NOT EXISTS idx_rmatchs_b ON rencontre_matchs(b, cree_a DESC);

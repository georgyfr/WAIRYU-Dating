-- 0013_audit_admin.sql — wairyu : piste d'audit des actions d'administration
-- (Task 104, audit sécurité BE-006).
--
-- Le code écrivait dans audit_admin (routes/auth.ts — auditMinorRefused,
-- P0 âge : refus d'inscription mineur, obligation légale de traçabilité)
-- mais AUCUNE migration ne créait la table : l'INSERT échouait à chaque
-- fois et l'erreur était avalée par un catch — audit jamais persisté.
-- Cette migration pose la table ; le catch avalant l'erreur est supprimé
-- dans le même vol (l'échec d'audit remonte désormais).
--
-- Doctrine P0 âge : AUCUNE donnée personnelle en clair — l'identifiant
-- (email ou pseudo) ne vit que HACHÉ dans target_id ; details est un JSON
-- sans donnée personnelle ({flow, stage}).
--
-- Règle D1 : pas de FK déclarée (D1 ignore PRAGMA foreign_keys) — intégrité
-- par le code.

CREATE TABLE IF NOT EXISTS audit_admin (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  admin       TEXT NOT NULL,             -- 'system' ou identifiant admin
  action      TEXT NOT NULL,             -- ex. 'signup_minor_refused'
  target_user TEXT,                      -- user cible si applicable (NULL pour system)
  target_id   TEXT,                      -- identifiant HACHÉ (P0 âge : jamais en clair)
  details     TEXT NOT NULL DEFAULT '',  -- JSON libre (flow, stage…)
  created_at  INTEGER NOT NULL           -- epoch secondes
);

CREATE INDEX IF NOT EXISTS idx_audit_admin_action ON audit_admin(action, created_at);
CREATE INDEX IF NOT EXISTS idx_audit_admin_target ON audit_admin(target_user, created_at);

-- 0016_email_change.sql — BE-009 : changement d'email SÉCURISÉ (Task 110).
--
-- AVANT : POST /account/recovery-email écrasait users.email immédiatement —
-- sans vérification de la nouvelle adresse, sans rate-limit, sans preuve
-- d'identité au-delà du cookie. Une session détournée suffisait à rediriger
-- le compte (et le reset mot de passe) vers l'attaquant.
--
-- APRÈS : demande (session + mot de passe actuel si le compte en a un +
-- rate-limit user/IP) → code 6 chiffres envoyé à la NOUVELLE adresse →
-- confirmation. users.email n'est touché QU'À la confirmation, avec
-- email_verified_at renseigné (plus jamais d'email non vérifié en base).
--
-- La table porte UN changement en cours par compte (PK user_id) — une
-- nouvelle demande écrase la précédente (même doctrine que auth_codes).
--
-- Règle D1 : pas de FK déclarée (D1 ignore PRAGMA foreign_keys) — intégrité
-- par le code. RGPD : purge dans hardDeleteAccount (routes/auth.ts).

CREATE TABLE IF NOT EXISTS email_changes (
  user_id     TEXT PRIMARY KEY,          -- UN changement en cours par compte
  email_new   TEXT NOT NULL,             -- email cible normalisé (trim/minuscule)
  code_hash   TEXT NOT NULL,             -- sha256 hex du code 6 chiffres
  attempts    INTEGER NOT NULL DEFAULT 0,-- tentatives consommées (max 3)
  created_at  INTEGER NOT NULL,          -- epoch s
  expires_at  INTEGER NOT NULL,          -- created_at + 600 (TTL 10 min)
  consumed_at INTEGER                    -- confirmation réussie
);

CREATE INDEX IF NOT EXISTS idx_email_changes_expires ON email_changes(expires_at);

-- 0003_auth.sql — wairyu : authentification OTP (Étape 2)
-- Codes OTP hashés + traces de suppression de compte (RGPD).
-- Aucune donnée sensible en clair : le code est stocké hashé (SHA-256),
-- l'email n'est stocké que sous forme de hash dans cette table (minoration RGPD).

-- ---------- Codes OTP (demande → vérification) ----------
-- Une seule ligne active par (email, canal) : un renvoi écrase le code précédent.
CREATE TABLE IF NOT EXISTS auth_codes (
  email_hash    TEXT NOT NULL,                  -- sha256(email normalisé) hex
  purpose       TEXT NOT NULL DEFAULT 'login'
                CHECK (purpose IN ('login','signup')),
  code_hash     TEXT NOT NULL,                  -- sha256(code 6 chiffres) hex
  attempts      INTEGER NOT NULL DEFAULT 0,     -- tentatives consommées (max 3)
  request_ip_hash TEXT,                         -- sha1 tronqué du préfixe IP (diagnostic)
  created_at    INTEGER NOT NULL,               -- epoch s
  expires_at    INTEGER NOT NULL,               -- created_at + 600 s (TTL 10 min)
  consumed_at   INTEGER,                        -- vérification réussie
  PRIMARY KEY (email_hash, purpose)
);

CREATE INDEX IF NOT EXISTS idx_auth_codes_expires ON auth_codes(expires_at);

-- ---------- Suppression de compte (RGPD, Étape 2) ----------
-- Traçabilité anonyme : l'utilisateur et ses données personnelles sont supprimés
-- immédiatement (users + sessions en CASCADE, médias à l'Étape 3) ; cette ligne
-- conserve uniquement un identifiant opaque pour l'audit/modération, purgé à J+30.
CREATE TABLE IF NOT EXISTS account_deletions (
  user_id_orig  TEXT NOT NULL,                  -- UUID d'origine (opaque après purge)
  reason        TEXT NOT NULL DEFAULT 'user_request'
                CHECK (reason IN ('user_request','moderation','gdpr_request')),
  deleted_at    INTEGER NOT NULL,               -- epoch s (effacement réel)
  purge_at      INTEGER NOT NULL                -- deleted_at + 30 j (purge de la trace)
);

CREATE INDEX IF NOT EXISTS idx_account_deletions_purge ON account_deletions(purge_at);

-- 0004_auth.sql — wairyu : authentification OTP email (Étape 2, port v1 0003_auth)
-- Codes OTP hashés. Aucune donnée sensible en clair : le code est stocké hashé
-- (SHA-256), l'email n'est stocké que sous forme de hash dans cette table
-- (minoration RGPD). account_deletions est DÉJÀ posée par 0001_core (v2).

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

-- ---------- Date de naissance ISO (P0 âge — port v1 0007, sous-ensemble Étape 2) ----------
-- birth_year existe déjà (0001_core, CHECK statique 1930-2010). La date ISO
-- complète est exigée à l'inscription ; le validateur applicatif (lib/age.ts)
-- garantit la borne DYNAMIQUE 18+ et les triggers 0007_age_triggers complètent.
ALTER TABLE users ADD COLUMN birth_date TEXT;

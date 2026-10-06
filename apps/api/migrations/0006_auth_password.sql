-- 0006_auth_password.sql — wairyu : comptes « classiques » pseudo + mot de passe
-- (Étape 2, fusion port v1 0017_auth_password + 0019_username_canonical —
-- sur une base fraîche, la colonne canonique naît AVEC la table).
--
--  - auth_password : 1 ligne par compte « classique ». username (forme affichée,
--    espaces/accents OK) UNIQUE COLLATE NOCASE ; username_canonical = forme de
--    recherche (minuscule, accents repliés, non-[a-z0-9_] retirés) UNIQUE ;
--    password_hash au format « pbkdf2$iterations$salt$hash » (PBKDF2-SHA256,
--    100k itérations, sel 16 o — voir apps/api/src/lib/password.ts).
--    recovery_code_hash = SHA-256 du code « XXXX-XXXX-XXXX » (alphabet sans
--    ambiguïté) : reprendre son compte SANS email. Verrouillage progressif
--    (failed_attempts/locked_until) contre le brute-force.
--  - password_resets : jetons « mot de passe oublié » par email (liens 1 h,
--    hashés en base, consommation unique, hash IP pour l'audit sans stocker l'IP).
--
-- Les comptes classiques n'ont pas d'email réel : users.email reçoit un
-- placeholder « pw-<uuid>@inbox.wairyu.local » (UNIQUE requis par 0001_core).

CREATE TABLE IF NOT EXISTS auth_password (
  user_id         TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  -- Pseudo AFFICHÉ/SAISI (espaces, accents, tirets, apostrophes autorisés —
  -- la normalisation canonique est à part).
  username        TEXT NOT NULL UNIQUE COLLATE NOCASE,
  -- Forme CANONIQUE de recherche (lib/password.normalizeUsername).
  username_canonical TEXT NOT NULL UNIQUE,
  -- pbkdf2$100000$<salt hex>$<hash hex>
  password_hash   TEXT NOT NULL,
  -- SHA-256 hex du code de récupération normalisé (NULL = pas encore généré).
  recovery_code_hash TEXT,
  recovery_code_generated_at INTEGER,
  -- Anti brute-force : 5 échecs → verrou 15 min (registre côté route).
  failed_attempts INTEGER NOT NULL DEFAULT 0,
  locked_until    INTEGER,
  created_at      INTEGER NOT NULL,
  updated_at      INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS password_resets (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,                       -- SHA-256 hex du jeton (le jeton brut n'est JAMAIS stocké)
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,                    -- 1 h
  consumed_at INTEGER,                            -- consommation unique
  request_ip_hash TEXT                           -- hash IP (audit, pas d'IP brute)
);

CREATE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets(token_hash);
CREATE INDEX IF NOT EXISTS idx_password_resets_user ON password_resets(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_password_user ON auth_password(user_id);

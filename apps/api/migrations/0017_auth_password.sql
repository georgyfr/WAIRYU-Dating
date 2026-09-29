-- 0017_auth_password — Task 58 (fondateur) : inscription/connexion classique
-- pseudo + mot de passe, indépendante de Google/Facebook.
--
--  - auth_password : 1 ligne par compte « classique ». username UNIQUE et
--    insensible à la casse (COLLATE NOCASE) ; password_hash au format
--    « pbkdf2$iterations$salt$hash » (PBKDF2-SHA256, 100k itérations, sel 16 o)
--    — voir apps/api/src/lib/password.ts. recovery_code_hash = SHA-256 du code
--    « XXXX-XXXX-XXXX » (alphabet sans ambiguïté) : reprendre son compte SANS
--    email. Verrouillage progressif (failed_attempts/locked_until) contre le
--    brute-force.
--  - password_resets : jetons « mot de passe oublié » par email (liens 1 h,
--    hashés en base, consommation unique, hash IP pour l'audit sans stocker
--    l'IP).
--
-- Les comptes classiques n'ont pas d'email réel : users.email reçoit un
-- placeholder « pw-<uuid>@inbox.wairyu.local » (UNIQUE requis par 0001).

CREATE TABLE auth_password (
  user_id         TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  -- Pseudo AFFICHÉ/SAISI (Task 61 : espaces, accents, tirets, apostrophes
  -- autorisés — la normalisation canonique est à part).
  username        TEXT NOT NULL UNIQUE COLLATE NOCASE,
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

CREATE TABLE password_resets (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,                       -- SHA-256 hex du jeton (le jeton brut n'est JAMAIS stocké)
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,                    -- 1 h
  consumed_at INTEGER,                            -- consommation unique
  request_ip_hash TEXT                           -- hash IP (audit, pas d'IP brute)
);

CREATE INDEX idx_password_resets_token ON password_resets(token_hash);
CREATE INDEX idx_password_resets_user ON password_resets(user_id);
CREATE INDEX idx_auth_password_user ON auth_password(user_id);

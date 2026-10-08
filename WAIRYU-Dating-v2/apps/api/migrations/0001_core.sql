-- 0001_core.sql — wairyu : tables cœur (Étape 1)
-- Utilisateurs + sessions. Les tables profil/photos/questionnaire arrivent
-- avec leurs étapes (3 et 4) — migrations incrémentales, jamais d'ALTER destructif.

-- ---------- Utilisateurs ----------
CREATE TABLE IF NOT EXISTS users (
  id                TEXT PRIMARY KEY,              -- UUIDv4
  email             TEXT NOT NULL UNIQUE,          -- minuscule, trim
  email_verified_at INTEGER,                       -- epoch s (OTP, Étape 2)
  display_name      TEXT,
  birth_year        INTEGER CHECK (birth_year IS NULL OR (birth_year BETWEEN 1930 AND 2010)),
  gender            TEXT CHECK (gender IS NULL OR gender IN ('woman','man','non_binary')),
  intent            TEXT CHECK (intent IS NULL OR intent IN ('serious','open','friends_first')),
  city              TEXT,
  geo_region        TEXT,                          -- région grossière (jamais de GPS précis)
  bio               TEXT,
  status            TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','banned','deleted')),
  -- Monétisation câblée mais éteinte (Étape 8) :
  plan              TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free','plus','gold')),
  created_at        INTEGER NOT NULL,              -- epoch s
  updated_at        INTEGER NOT NULL,
  deleted_at        INTEGER
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status) WHERE status = 'active';

-- ---------- Sessions (cookie signé ↔ enregistrement révocable) ----------
CREATE TABLE IF NOT EXISTS sessions (
  id             TEXT PRIMARY KEY,                 -- 32 hex aléatoires
  user_id        TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at     INTEGER NOT NULL,
  expires_at     INTEGER NOT NULL,                 -- epoch s
  last_seen_at   INTEGER NOT NULL,
  revoked_at     INTEGER,
  user_agent_hash TEXT,                            -- sha1 tronqué (diagnostic, pas d'UA brut)
  ip_hash        TEXT                              -- sha1 tronqué du préfixe IP (anti-abus)
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- ---------- Anti-abus : rate limiting (fenêtre glissante, Étape 2) ----------
CREATE TABLE IF NOT EXISTS rate_limits (
  key        TEXT NOT NULL,                        -- ex: 'otp:ip:<hash>' / 'otp:email:<hash>'
  window_start INTEGER NOT NULL,                   -- début de fenêtre (epoch s)
  count      INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (key, window_start)
);

-- ---------- Suppressions de compte (RGPD — trace de 30 j puis purge) ----------
CREATE TABLE IF NOT EXISTS account_deletions (
  user_id_orig  TEXT NOT NULL,                  -- UUID d'origine (opaque après purge)
  reason        TEXT NOT NULL DEFAULT 'user_request'
                CHECK (reason IN ('user_request','moderation','gdpr_request')),
  deleted_at    INTEGER NOT NULL,               -- epoch s (effacement réel)
  purge_at      INTEGER NOT NULL                -- deleted_at + 30 j (purge de la trace)
);

CREATE INDEX IF NOT EXISTS idx_account_deletions_purge ON account_deletions(purge_at);

-- 0005_profiles.sql — wairyu : profils & photos protégées (Étape 3)
-- Incrémental, jamais destructif : ALTER TABLE ADD COLUMN + nouvelles tables.
--
-- Contenu :
--   1. users.orientation + users.profile_consent_at (consentement explicite dédié)
--   2. profile_prompts — 3 prompts de personnalité (bibliothèque partagée)
--   3. photos — métadonnées des photos (assets Cloudinary AUTHENTICATED ; les
--      URLs signées ne sont JAMAIS délivrées sans autorisation Worker)
--   4. user_preferences — préférences de découverte + mode par défaut
--
-- NOTE : le CHECK users.birth_year BETWEEN 1930 AND 2010 (0001) restera
-- légèrement trop serré à partir de 2029 (naissance 2011 = 18 ans) ; l'API
-- applique déjà la borne correcte (année courante − 18). Rebuild de table
-- volontairement évité (jamais destructif).

-- ---------- 1. Compléments utilisateurs ----------
ALTER TABLE users ADD COLUMN orientation TEXT
  CHECK (orientation IS NULL OR orientation IN ('straight','gay','bi','other'));

-- Consentement explicite dédié (profil + découverte + matching) — horodaté.
ALTER TABLE users ADD COLUMN profile_consent_at INTEGER;

-- ---------- 2. Prompts de personnalité (3 slots) ----------
-- prompt_key référence la bibliothèque partagée @wairyu/shared PROMPT_LIBRARY ;
-- le libellé est résolu côté front (les deux évoluent ensemble).
CREATE TABLE IF NOT EXISTS profile_prompts (
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  position   INTEGER NOT NULL CHECK (position BETWEEN 1 AND 3),
  prompt_key TEXT NOT NULL,
  answer     TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, position)
);

CREATE INDEX IF NOT EXISTS idx_prompts_user ON profile_prompts(user_id);

-- ---------- 3. Photos (métadonnées ; octets chez Cloudinary) ----------
-- public_id Cloudinary = {CLOUDINARY_ROOT_FOLDER}/photos/{userId}/{id}
-- → non devinable (UUIDv4), asset type=authenticated (404 sans signature).
-- position 0 = photo principale. status 'pending' prévu pour la modération
-- (Étape 7) — toute photo créée est 'active' en Étape 3.
CREATE TABLE IF NOT EXISTS photos (
  id                 TEXT PRIMARY KEY,           -- UUIDv4
  user_id            TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cloudinary_version INTEGER NOT NULL DEFAULT 1, -- cache-buster (non signée)
  format             TEXT NOT NULL DEFAULT 'webp',
  width              INTEGER NOT NULL,
  height             INTEGER NOT NULL,
  bytes              INTEGER NOT NULL,
  position           INTEGER NOT NULL DEFAULT 0,
  status             TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','pending','rejected')),
  created_at         INTEGER NOT NULL,
  deleted_at         INTEGER
);

CREATE INDEX IF NOT EXISTS idx_photos_user ON photos(user_id) WHERE deleted_at IS NULL;

-- ---------- 4. Préférences de découverte + mode par défaut ----------
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id      TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  mode_default TEXT NOT NULL DEFAULT 'classic' CHECK (mode_default IN ('classic','invisible')),
  pref_gender  TEXT NOT NULL DEFAULT 'everyone' CHECK (pref_gender IN ('women','men','everyone')),
  min_age      INTEGER NOT NULL DEFAULT 18 CHECK (min_age BETWEEN 18 AND 99),
  max_age      INTEGER NOT NULL DEFAULT 99 CHECK (max_age BETWEEN 18 AND 99),
  distance_km  INTEGER NOT NULL DEFAULT 100 CHECK (distance_km BETWEEN 1 AND 500),
  pref_intent  TEXT CHECK (pref_intent IS NULL OR pref_intent IN ('serious','open','friends_first')),
  updated_at   INTEGER NOT NULL
);

-- 0006_profile_date_location_intents.sql — wairyu (demande fondateur, 2026-09-23)
-- 1. Date de naissance complète (jour/mois/année) : users.birth_date ISO YYYY-MM-DD
--    → âge EXACT 18+ (l'année seule ne suffisait pas).
-- 2. Localisation enrichie : users.country + users.neighborhood (géocodage
--    inverse Nominatim côté Worker, ou saisie manuelle — jamais de rue/GPS précis).
-- 3. Intentions étendues (couple_life, marriage, interracial) : SQLite ne sait pas
--    modifier un CHECK → les contraintes CHECK sur les LIBELLÉS d'intention
--    (users.intent, user_preferences.pref_intent) sont RETIRÉES. Le garde-fou
--    devient l'API seule (validateEnum sur @wairyu/shared INTENTS) : ajouter une
--    intention future ne demandera plus aucune migration.
--    La borne birth_year est relâchée 1930-2100 (l'ancienne 1930-2010 devenait
--    trop serrée en 2029, cf. note 0005).
--
-- ⚠️⚠️ LEÇON CRITIQUE (version initiale appliquée sur staging) : D1 n'honore
-- PAS « PRAGMA foreign_keys = OFF ». Le DROP TABLE users y a déclenché le
-- DELETE implicite en CASCADE et vidé les tables enfants (sessions, photos,
-- profile_prompts, user_preferences — staging uniquement, données de test ;
-- prod restaurée via Time Travel AVANT toute application, cf. worklog Task 15).
--
-- CETTE VERSION (révisée) est ZÉRO PERTE : les 4 tables enfants référençant
-- users (FK CASCADE) sont sauvegardées, SUPPRIMÉES AVANT users (plus aucun
-- enfant = aucune cascade possible, FKs actives ou non), users est échangé,
-- puis les enfants sont recréés (schémas originaux complets) et re-remplis.
-- Effet final identique à la version initiale (staging, déjà appliquée) :
-- mêmes colonnes, mêmes CHECKs — parité staging/prod garantie.

-- ---------- 1. users_new : schéma cible ----------
CREATE TABLE users_new (
  id                TEXT PRIMARY KEY,
  email             TEXT NOT NULL UNIQUE,
  email_verified_at INTEGER,
  display_name      TEXT,
  birth_year        INTEGER CHECK (birth_year IS NULL OR (birth_year BETWEEN 1930 AND 2100)),
  -- Date de naissance ISO « YYYY-MM-DD » (source de vérité de l'âge exact ;
  -- birth_year reste alimenté en parallèle pour compat/matching).
  birth_date        TEXT,
  gender            TEXT CHECK (gender IS NULL OR gender IN ('woman','man','non_binary')),
  -- Intention : libellé validé par l'API (INTENTS partagés) — CHECK retiré (évolutif).
  intent            TEXT,
  city              TEXT,
  country           TEXT,                          -- libellé ≤ 60 (API)
  neighborhood      TEXT,                          -- libellé ≤ 60 (API)
  geo_region        TEXT,                          -- région grossière (jamais de GPS précis)
  bio               TEXT,
  status            TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','banned','deleted')),
  plan              TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free','plus','gold')),
  created_at        INTEGER NOT NULL,
  updated_at        INTEGER NOT NULL,
  deleted_at        INTEGER,
  orientation       TEXT CHECK (orientation IS NULL OR orientation IN ('straight','gay','bi','other')),
  profile_consent_at INTEGER
);

-- Colonnes communes aux deux états de schéma — les 3 nouvelles colonnes sont
-- NULL partout où cette migration n'a pas encore couru (aucune perte possible).
INSERT INTO users_new
  (id, email, email_verified_at, display_name, birth_year, gender, intent,
   city, geo_region, bio, status, plan, created_at, updated_at, deleted_at,
   orientation, profile_consent_at)
SELECT
  id, email, email_verified_at, display_name, birth_year, gender, intent,
  city, geo_region, bio, status, plan, created_at, updated_at, deleted_at,
  orientation, profile_consent_at
FROM users;

-- ---------- 2. Sauvegarde des tables enfants (FK CASCADE vers users) ----------
CREATE TABLE sessions_bak AS SELECT * FROM sessions;
CREATE TABLE photos_bak AS SELECT * FROM photos;
CREATE TABLE profile_prompts_bak AS SELECT * FROM profile_prompts;
CREATE TABLE user_preferences_bak AS SELECT * FROM user_preferences;

-- ---------- 3. DROP enfants PUIS users (aucune cascade possible) ----------
DROP TABLE sessions;
DROP TABLE photos;
DROP TABLE profile_prompts;
DROP TABLE user_preferences;
DROP TABLE users;

-- ---------- 4. users_new devient users ----------
ALTER TABLE users_new RENAME TO users;
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status) WHERE status = 'active';

-- Comptes connus par leur année seule : date par défaut au 1er janvier
-- (l'assistant propose de préciser jour/mois — l'API accepte les deux).
UPDATE users SET birth_date = birth_year || '-01-01'
WHERE birth_year IS NOT NULL AND birth_date IS NULL;

-- ---------- 5. Recréation des enfants (schémas originaux) + restauration ----------

-- sessions (0001)
CREATE TABLE sessions (
  id             TEXT PRIMARY KEY,
  user_id        TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at     INTEGER NOT NULL,
  expires_at     INTEGER NOT NULL,
  last_seen_at   INTEGER NOT NULL,
  revoked_at     INTEGER,
  user_agent_hash TEXT,
  ip_hash        TEXT
);
INSERT INTO sessions
  (id, user_id, created_at, expires_at, last_seen_at, revoked_at, user_agent_hash, ip_hash)
SELECT id, user_id, created_at, expires_at, last_seen_at, revoked_at, user_agent_hash, ip_hash
FROM sessions_bak;
DROP TABLE sessions_bak;
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- photos (0005)
CREATE TABLE photos (
  id                 TEXT PRIMARY KEY,
  user_id            TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cloudinary_version INTEGER NOT NULL DEFAULT 1,
  format             TEXT NOT NULL DEFAULT 'webp',
  width              INTEGER NOT NULL,
  height             INTEGER NOT NULL,
  bytes              INTEGER NOT NULL,
  position           INTEGER NOT NULL DEFAULT 0,
  status             TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','pending','rejected')),
  created_at         INTEGER NOT NULL,
  deleted_at         INTEGER
);
INSERT INTO photos
  (id, user_id, cloudinary_version, format, width, height, bytes, position, status, created_at, deleted_at)
SELECT id, user_id, cloudinary_version, format, width, height, bytes, position, status, created_at, deleted_at
FROM photos_bak;
DROP TABLE photos_bak;
CREATE INDEX IF NOT EXISTS idx_photos_user ON photos(user_id) WHERE deleted_at IS NULL;

-- profile_prompts (0005)
CREATE TABLE profile_prompts (
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  position   INTEGER NOT NULL CHECK (position BETWEEN 1 AND 3),
  prompt_key TEXT NOT NULL,
  answer     TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, position)
);
INSERT INTO profile_prompts (user_id, position, prompt_key, answer, updated_at)
SELECT user_id, position, prompt_key, answer, updated_at FROM profile_prompts_bak;
DROP TABLE profile_prompts_bak;
CREATE INDEX IF NOT EXISTS idx_prompts_user ON profile_prompts(user_id);

-- user_preferences (pref_intent SANS CHECK — évolutif)
CREATE TABLE user_preferences (
  user_id      TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  mode_default TEXT NOT NULL DEFAULT 'classic' CHECK (mode_default IN ('classic','invisible')),
  pref_gender  TEXT NOT NULL DEFAULT 'everyone' CHECK (pref_gender IN ('women','men','everyone')),
  min_age      INTEGER NOT NULL DEFAULT 18 CHECK (min_age BETWEEN 18 AND 99),
  max_age      INTEGER NOT NULL DEFAULT 99 CHECK (max_age BETWEEN 18 AND 99),
  distance_km  INTEGER NOT NULL DEFAULT 100 CHECK (distance_km BETWEEN 1 AND 500),
  pref_intent  TEXT,
  updated_at   INTEGER NOT NULL
);
INSERT INTO user_preferences
  (user_id, mode_default, pref_gender, min_age, max_age, distance_km, pref_intent, updated_at)
SELECT user_id, mode_default, pref_gender, min_age, max_age, distance_km, pref_intent, updated_at
FROM user_preferences_bak;
DROP TABLE user_preferences_bak;

PRAGMA foreign_key_check;

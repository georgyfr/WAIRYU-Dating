-- 0007_age_triggers.sql — wairyu : borne haute DYNAMIQUE sur users.birth_year
-- (Étape 2, port v1 0023_safety_aggregate — sous-ensemble âge ; le reste des
-- triggers d'agrégats safety suivra avec l'Étape 7).
--
-- Le CHECK SQL de 0001_core reste statique (1930-2010, non-déterministe à la
-- borne haute). SQLite refuse strftime() dans un CHECK (non-déterministe) →
-- TRIGGER INSERT+UPDATE + validation applicative (lib/age.ts, appelée AVANT
-- tout INSERT users — les 3 flux d'inscription de routes/auth.ts).

CREATE TRIGGER IF NOT EXISTS trg_users_birth_year_max BEFORE INSERT ON users
WHEN NEW.birth_year IS NOT NULL AND NEW.birth_year > CAST(strftime('%Y','now') AS INTEGER) - 18
BEGIN SELECT RAISE(ABORT, 'users.birth_year: majeur (18+) requis'); END;

CREATE TRIGGER IF NOT EXISTS trg_users_birth_year_max_upd BEFORE UPDATE ON users
WHEN NEW.birth_year IS NOT NULL AND NEW.birth_year > CAST(strftime('%Y','now') AS INTEGER) - 18
BEGIN SELECT RAISE(ABORT, 'users.birth_year: majeur (18+) requis'); END;

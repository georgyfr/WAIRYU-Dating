-- 0008_interracial_mode.sql — wairyu (demande fondateur, 2026-09-23)
-- Clarification produit : « interracial » n'est pas une INTENTION mais un
-- 3e MODE de découverte (« Mode interracial »), dédié aux rencontres entre
-- personnes de races, de cultures et de CONTINENTS différents.
--
-- Rôle de cette migration : ouvrir la colonne user_preferences.mode_default
-- au 3e libellé 'interracial'. SQLite ne sait pas modifier un CHECK → la
-- contrainte CHECK (mode_default IN ('classic','invisible')) est RETIRÉE,
-- sur le même motif que les intentions en 0006 : le garde-fou devient l'API
-- seule (validateEnum sur @wairyu/shared MODE_DEFAULTS). Ajouter un 4e mode
-- ne demandera plus aucune migration.
--
-- ⚠️ SÉCURITÉ (leçon 0006/0007 archivée) : user_preferences est une TABLE
-- FEUILLE — aucune autre table ne la référence (sa FK pointe vers users,
-- jamais l'inverse). Son DROP ne peut donc déclencher AUCUNE cascade.
-- Motif zéro perte : créer _new → copier → DROP → RENAME, en une transaction.
--
-- Données (vérifié 2026-09-23 avant écriture) : 0 ligne intent='interracial'
-- et 0 ligne pref_intent='interracial' en prod ET staging. Les 2 UPDATE
-- défensifs ci-dessous sont donc des no-op — ils neutralisent tout écart
-- éventuel d'environnement (valeur retirée des INTENTS partagés).

-- ---------- 0. Nettoyage défensif (no-op attendu) ----------
UPDATE users SET intent = NULL WHERE intent = 'interracial';
UPDATE user_preferences SET pref_intent = NULL WHERE pref_intent = 'interracial';

-- ---------- 1. Table cible : schéma 0007 sans le CHECK du mode ----------
CREATE TABLE user_preferences_new (
  user_id      TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  -- Libellé validé par l'API (MODE_DEFAULTS partagés) — CHECK retiré (évolutif).
  mode_default TEXT NOT NULL DEFAULT 'classic',
  pref_gender  TEXT NOT NULL DEFAULT 'everyone' CHECK (pref_gender IN ('women','men','everyone')),
  min_age      INTEGER NOT NULL DEFAULT 18 CHECK (min_age BETWEEN 18 AND 99),
  max_age      INTEGER NOT NULL DEFAULT 99 CHECK (max_age BETWEEN 18 AND 99),
  distance_km  INTEGER NOT NULL DEFAULT 100 CHECK (distance_km BETWEEN 1 AND 500),
  pref_intent  TEXT,
  updated_at   INTEGER NOT NULL
);

-- ---------- 2. Copie exhaustive (aucune transformation) ----------
INSERT INTO user_preferences_new
  (user_id, mode_default, pref_gender, min_age, max_age, distance_km, pref_intent, updated_at)
SELECT user_id, mode_default, pref_gender, min_age, max_age, distance_km, pref_intent, updated_at
FROM user_preferences;

-- ---------- 3. Bascule (DROP feuille : aucune cascade possible) ----------
DROP TABLE user_preferences;
ALTER TABLE user_preferences_new RENAME TO user_preferences;

-- ---------- 4. Vérification d'intégrité ----------
PRAGMA foreign_key_check;

-- 0023_safety_aggregate.sql — wairyu (P0 runtime — agrégats signalements, recours, audit admin, âge)
-- Incrémental, jamais destructif : 3 tables « feuilles » + 2 triggers sur users.
-- Leçon 0008 : AUCUN CHECK sur les énumérations évolutives — l'API valide.
-- Leçon 0006 : jamais de DROP parent — users n'est PAS reconstruit ici.

-- ---------- 1. Agrégat des signalements (P0 — blocage automatique) ----------
-- UNE ligne par (utilisateur signalé, catégorie), recalculée À CHAQUE
-- signalement depuis `reports` (fenêtre glissante 30 j) — recalcul complet
-- donc IDEMPOTENT. Le recalcul EXCLUT les signalements des « signaleurs en
-- série » (≥ 5 cibles distinctes / 7 j) : les compteurs reflètent les
-- signalements dignes de foi (anti-abus, implémenté dans routes/safety.ts).
-- auto_blocked_at = date du blocage automatique déclenché par cette ligne
-- (jamais effacé par un recalcul ultérieur — COALESCE côté API).
CREATE TABLE IF NOT EXISTS report_aggregate (
  reported_user_id TEXT NOT NULL,
  category TEXT NOT NULL,
  window_days INTEGER NOT NULL DEFAULT 30,
  report_count INTEGER NOT NULL DEFAULT 0,
  distinct_reporters INTEGER NOT NULL DEFAULT 0,
  last_report_at INTEGER NOT NULL,
  auto_blocked_at INTEGER,
  PRIMARY KEY (reported_user_id, category)
);

-- ---------- 2. Sanctions (bans auto-agrégat + admin, traçables) ----------
-- created_by = 'system' (blocage automatique par agrégat) OU user_id admin
-- NOMMÉ (action manuelle backoffice) — JAMAIS 'token'.
-- Une levée (overturned) passe status='lifted' SANS effacer la ligne : la
-- trace reste complète (recours + audit_admin font la contre-partie).
CREATE TABLE IF NOT EXISTS sanctions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,                -- 'ban' | 'suspend' | 'block_pair'
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','lifted','expired')),
  created_by TEXT NOT NULL,          -- 'system' (agrégat auto) ou user_id admin nommé
  created_at INTEGER NOT NULL,
  expires_at INTEGER
);
CREATE INDEX IF NOT EXISTS idx_sanctions_user ON sanctions(user_id, status);

-- ---------- 3. Recours sur sanction (P0 — droit de réexamen) ----------
-- Le titulaire de la sanction dépose un recours (POST /api/sanctions/:id/appeal,
-- routes/safety.ts) ; un admin NOMMÉ le tranche (POST /admin/appeals/:id/review,
-- routes/admin.ts). reviewed_by = identité admin NOMMÉE — jamais 'token'.
CREATE TABLE IF NOT EXISTS sanctions_appeals (
  id TEXT PRIMARY KEY,
  sanction_id TEXT NOT NULL REFERENCES sanctions(id),
  user_id TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','upheld','overturned')),
  reviewed_by TEXT,                  -- user_id admin NOMMÉ — jamais 'token'
  reviewed_at INTEGER,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_appeals_user ON sanctions_appeals(user_id);
CREATE INDEX IF NOT EXISTS idx_appeals_pending ON sanctions_appeals(status, created_at);

-- ---------- 4. Journal d'audit admin — colonne identité nommée ----------
-- NB : la table audit_admin EXISTE DÉJÀ (0014_safety.sql — colonnes admin,
-- action, target_user, target_id, details, created_at, id AUTOINCREMENT).
-- Le CREATE ci-dessous (forme cible du P0) est donc un NO-OP volontaire sur
-- toute base réelle : l'API écrit l'identité NOMMÉE de l'admin dans la
-- colonne `admin` existante (user_id — JAMAIS 'token' pour la modération),
-- la cible dans (target_user, target_id) et le contexte en JSON dans
-- `details` (mapping documenté dans routes/admin.ts). Aucune ALTER n'est
-- nécessaire : les colonnes 0014 couvrent exactement ces usages.
CREATE TABLE IF NOT EXISTS audit_admin (
  id TEXT PRIMARY KEY,
  admin_user_id TEXT NOT NULL,       -- identité nommée — jamais 'token'
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  details_json TEXT,
  created_at INTEGER NOT NULL
);

-- ---------- 5. Âge : borne haute DYNAMIQUE sur users.birth_year ----------
-- users (0007) porte DÉJÀ birth_year INTEGER (CHECK statique 1930-2100) et
-- birth_date TEXT : aucune ALTER nécessaire.
-- SQLite refuse strftime() dans un CHECK (non-déterministe, prouvé machine)
-- → TRIGGER INSERT+UPDATE (testés OK) + validation applicative (lib/age.ts,
-- appelée AVANT tout INSERT users — les 3 flux d'inscription de routes/auth.ts).
CREATE TRIGGER IF NOT EXISTS trg_users_birth_year_max BEFORE INSERT ON users
WHEN NEW.birth_year IS NOT NULL AND NEW.birth_year > CAST(strftime('%Y','now') AS INTEGER) - 18
BEGIN SELECT RAISE(ABORT, 'users.birth_year: majeur (18+) requis'); END;

CREATE TRIGGER IF NOT EXISTS trg_users_birth_year_max_upd BEFORE UPDATE ON users
WHEN NEW.birth_year IS NOT NULL AND NEW.birth_year > CAST(strftime('%Y','now') AS INTEGER) - 18
BEGIN SELECT RAISE(ABORT, 'users.birth_year: majeur (18+) requis'); END;

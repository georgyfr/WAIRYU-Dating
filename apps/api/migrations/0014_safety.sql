-- 0014_safety.sql — wairyu (Étape 7 — Sécurité & modération)
-- Incrémental, jamais destructif :
--   * 6 ALTER TABLE ADD COLUMN sur users (colonnes NULLables/défaut — zéro risque,
--     leçon 0006 : jamais de DROP parent) ;
--   * 5 nouvelles tables « feuilles » (users/conversations/matches intacts).
--
-- Leçon 0008 : AUCUN CHECK sur les énumérations évolutives — l'API valide
-- (validateEnum) ; ajouter une valeur ne demandera aucune migration.
-- Anti-fraude multi-comptes : ZÉRO nouvelle table — l'empreinte légère réutilise
-- sessions.ip_hash + user_agent_hash déjà en place depuis l'Étape 2.

-- ---------- 1. Colonnes utilisateurs (confidentialité v1 + sanctions) ----------
-- Pause du profil : masqué de TOUT le feed, swipe bloqué (l'utilisateur garde la lecture).
ALTER TABLE users ADD COLUMN paused INTEGER;
-- Mode incognito (Wairyu §6) : masqué du feed SAUF pour les personnes à qui
-- il a envoyé un like (elles ont « reçu » son intérêt).
ALTER TABLE users ADD COLUMN incognito INTEGER;
-- Visibilité du mode : false = ne pas afficher l'étiquette « Mode Invisible »
-- sur ses cartes (le FLU de la photo reste, lui, toujours appliqué — §4.6).
ALTER TABLE users ADD COLUMN mode_visible INTEGER NOT NULL DEFAULT 1;
-- Sanctions (backoffice) : suspension temporaire + dernier avertissement.
ALTER TABLE users ADD COLUMN suspended_until INTEGER;
ALTER TABLE users ADD COLUMN warned_at INTEGER;
-- Badge « Identité vérifiée » : date d'approbation de la vérification selfie.
ALTER TABLE users ADD COLUMN verified_at INTEGER;

CREATE INDEX IF NOT EXISTS idx_users_suspended ON users(suspended_until) WHERE suspended_until IS NOT NULL;

-- ---------- 2. Vérification selfie semi-manuelle (plan 7.1) ----------
-- 3 poses aléatoires imposées (impossible de présenter une photo papier) :
-- le demandeur reçoit un ORDRE (front/left/right) et doit envoyer 3 selfies
-- dans cet ordre. File de review backoffice → badge après approbation.
CREATE TABLE IF NOT EXISTS verification_requests (
  id             TEXT PRIMARY KEY,          -- UUIDv4
  user_id        TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pose_order     TEXT NOT NULL,             -- JSON ["front","left","right"] (mélangé)
  poses_json     TEXT,                      -- JSON [publicId, publicId, publicId] (rempli à l'envoi)
  status         TEXT NOT NULL DEFAULT 'awaiting',  -- awaiting|pending|approved|rejected
  rejection_reason TEXT,
  created_at     INTEGER NOT NULL,
  expires_at     INTEGER NOT NULL,          -- 48 h pour envoyer les 3 poses
  reviewed_at    INTEGER,
  reviewed_by    TEXT
);
CREATE INDEX IF NOT EXISTS idx_verif_status ON verification_requests(status, created_at);
CREATE INDEX IF NOT EXISTS idx_verif_user ON verification_requests(user_id);

-- ---------- 3. Signalements (plan 7.3) ----------
-- Motifs validés côté API (REPORT_CATEGORIES partagés, sans CHECK DB).
-- Un signalement entraîne le BLOCAGE MUTUEL immédiat + unmatch (inséré aussi
-- dans blocks par l'API) — la ligne ici est la trace reviewable.
CREATE TABLE IF NOT EXISTS reports (
  id              TEXT PRIMARY KEY,         -- UUIDv4
  reporter_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reported_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category        TEXT NOT NULL,
  details         TEXT,
  conversation_id TEXT,                     -- contexte facultatif (chat)
  status          TEXT NOT NULL DEFAULT 'pending',   -- pending|reviewed
  resolution      TEXT,                     -- dismiss|warn|suspend|ban (+ note)
  created_at      INTEGER NOT NULL,
  resolved_at     INTEGER,
  resolved_by     TEXT
);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status, created_at);
CREATE INDEX IF NOT EXISTS idx_reports_reported ON reports(reported_id);

-- ---------- 4. Flags de modération automatique (plan 7.2) ----------
-- Écrits PAR LE DO ChatRoom avant/après livraison d'un message risqué.
-- excerpt = 120 premiers caractères (conservation minimale, RGPD).
CREATE TABLE IF NOT EXISTS moderation_flags (
  id              TEXT PRIMARY KEY,         -- UUIDv4
  conversation_id TEXT NOT NULL,
  sender          TEXT NOT NULL,
  seq             INTEGER,                  -- seq DO si livré (null si bloqué)
  risk            INTEGER NOT NULL,
  categories_json TEXT NOT NULL,            -- JSON ["scam","hate",…]
  excerpt         TEXT NOT NULL,
  action          TEXT NOT NULL,            -- 'flag' (livré) | 'block' (refusé)
  status          TEXT NOT NULL DEFAULT 'open',      -- open|resolved
  resolution      TEXT,
  created_at      INTEGER NOT NULL,
  resolved_at     INTEGER,
  resolved_by     TEXT
);
CREATE INDEX IF NOT EXISTS idx_flags_status ON moderation_flags(status, created_at);
CREATE INDEX IF NOT EXISTS idx_flags_sender ON moderation_flags(sender);

-- ---------- 5. Journal d'audit admin (plan 7.4 — complet et immuable) ----------
CREATE TABLE IF NOT EXISTS audit_admin (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  admin       TEXT NOT NULL,                -- 'token' (v1) ou identifiant futur
  action      TEXT NOT NULL,
  target_user TEXT,
  target_id   TEXT,
  details     TEXT,
  created_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_admin(created_at);

-- ---------- 6. Check-in sécurité (plan 7.5, §6) ----------
-- « Je vois X le [date] » avant un rendez-vous ; le cron envoie un rappel
-- post-date « Ça s'est bien passé ? » ; un check-in « flagged » remonte au
-- backoffice. (Contact de confiance + SOS : Phase 2 — hors périmètre v1.)
CREATE TABLE IF NOT EXISTS safety_checkins (
  id              TEXT PRIMARY KEY,         -- UUIDv4
  user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  when_ts         INTEGER NOT NULL,         -- date du rendez-vous (UTC, seconde)
  status          TEXT NOT NULL DEFAULT 'active',    -- active|ok|flagged
  reminded_at     INTEGER,
  created_at      INTEGER NOT NULL,
  updated_at      INTEGER
);
CREATE INDEX IF NOT EXISTS idx_checkins_active ON safety_checkins(status, when_ts);
CREATE INDEX IF NOT EXISTS idx_checkins_user ON safety_checkins(user_id);

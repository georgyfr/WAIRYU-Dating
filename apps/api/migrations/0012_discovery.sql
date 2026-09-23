-- 0012_discovery.sql — wairyu : découverte dual-mode (Étape 5)
-- Incrémental, jamais destructif : nouvelles tables « feuilles » uniquement.
--
-- Contenu :
--   1. swipes            — like / passe / super (Classique + Interracial + likes en Invisible)
--   2. matches           — réciprocité (Classique) ou handshake accepté (Invisible)
--   3. conversations     — 1:1 avec un match ; le MODE régit le flou des photos
--                          (§4.8 : indépendant du mode de découverte des membres)
--   4. invisible_requests— handshake « Discuter » du Mode Invisible (accepté/décliné)
--   5. mode_requests     — passerelle Classique → Invisible d'une conversation (§4.4)
--   6. top_matches       — Top Compatibilité quotidien (cron, hors quota utilisateur)
--
-- Leçon 0008 : AUCUN CHECK sur les énumérations évolutives — l'API valide
-- (validateEnum) ; ajouter une valeur ne demandera aucune migration.
-- Les quotas quotidiens (50 likes / 10 demandes / 1 super / 1 rewind) vivent
-- dans la table rate_limits EXISTANTE (fenêtre 24 h UTC, purge cron) —
-- aucune table de compteurs supplémentaire.

-- ---------- 1. Swipes ----------
-- Un seul swipe par paire et par sens (index unique) : rejeter un doublon est
-- la responsabilité de l'API (409). Rewind = DELETE de la dernière ligne.
CREATE TABLE IF NOT EXISTS swipes (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_id  TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action     TEXT NOT NULL,                -- 'like' | 'pass' | 'super' (validé API)
  created_at INTEGER NOT NULL              -- epoch s
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_swipes_pair ON swipes(user_id, target_id);
CREATE INDEX IF NOT EXISTS idx_swipes_user_time ON swipes(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_swipes_target ON swipes(target_id, created_at DESC);

-- ---------- 2. Matches ----------
-- user_a_id / user_b_id : ordre lexicographique strict (a < b) — la paire est
-- unique, chaque membre la retrouve par l'un des deux index partiels.
CREATE TABLE IF NOT EXISTS matches (
  id            TEXT PRIMARY KEY,          -- UUIDv4
  user_a_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_b_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  origin        TEXT NOT NULL,             -- 'like' | 'super' | 'invisible_request'
  created_at    INTEGER NOT NULL,
  unmatched_at  INTEGER,                   -- Étape 6 : unmatch propre
  unmatched_by  TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_matches_pair ON matches(user_a_id, user_b_id);
CREATE INDEX IF NOT EXISTS idx_matches_a ON matches(user_a_id) WHERE unmatched_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_matches_b ON matches(user_b_id) WHERE unmatched_at IS NULL;

-- ---------- 3. Conversations ----------
-- Squelette Étape 5 (créé au match, mode conservé, passerelle = UPDATE) ;
-- WebSocket + messages dans le Durable Object = Étape 6. Le mode de la
-- conversation — PAS le mode de découverte des membres — régit le flou des
-- photos dans le chat (spécification §4.8, scénarios A/B/C/D).
CREATE TABLE IF NOT EXISTS conversations (
  id              TEXT PRIMARY KEY,        -- UUIDv4
  match_id        TEXT NOT NULL UNIQUE REFERENCES matches(id) ON DELETE CASCADE,
  mode            TEXT NOT NULL DEFAULT 'classic',  -- 'classic' | 'invisible' (validé API)
  created_at      INTEGER NOT NULL,
  mode_changed_at INTEGER                  -- date du passage par la passerelle
);

CREATE INDEX IF NOT EXISTS idx_conversations_mode ON conversations(mode);

-- ---------- 4. Demandes « Discuter » (handshake Invisible) ----------
-- Index unique (from_user, to_user) : une demande par paire et par sens —
-- une demande DÉCLINÉE ne peut pas être renvoyée par la même personne
-- (anti-harcèlement déterministe) ; l'autre sens reste possible.
CREATE TABLE IF NOT EXISTS invisible_requests (
  id           TEXT PRIMARY KEY,           -- UUIDv4
  from_user    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  to_user      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status       TEXT NOT NULL DEFAULT 'pending',  -- 'pending' | 'accepted' | 'declined'
  match_id     TEXT REFERENCES matches(id) ON DELETE SET NULL,
  created_at   INTEGER NOT NULL,
  responded_at INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_invreq_pair ON invisible_requests(from_user, to_user);
CREATE INDEX IF NOT EXISTS idx_invreq_to ON invisible_requests(to_user, status);

-- ---------- 5. Passerelle Classique → Invisible (§4.4) ----------
-- Consentement mutuel : une demande par conversation, l'autre accepte ou
-- refuse ; acceptée ⇒ conversations.mode = 'invisible' (photos re-floutées),
-- refusée ⇒ la conversation reste en Classique (§4.6).
CREATE TABLE IF NOT EXISTS mode_requests (
  id              TEXT PRIMARY KEY,        -- UUIDv4
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  from_user       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  to_user         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status          TEXT NOT NULL DEFAULT 'pending',  -- 'pending' | 'accepted' | 'declined'
  created_at      INTEGER NOT NULL,
  responded_at    INTEGER
);

CREATE INDEX IF NOT EXISTS idx_modereq_conv ON mode_requests(conversation_id, status);
CREATE INDEX IF NOT EXISTS idx_modereq_to ON mode_requests(to_user, status);

-- ---------- 6. Top Compatibilité quotidien ----------
-- Calculé par le cron (03:xx) — et à la demande (fallback, même fonction) si
-- aucun calcul n'existe encore pour le jour. Hors quota utilisateur : la
-- lecture ne consomme ni likes ni budget feed.
CREATE TABLE IF NOT EXISTS top_matches (
  day       TEXT NOT NULL,                 -- 'YYYY-MM-DD' UTC
  user_id   TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rank      INTEGER NOT NULL,              -- 1..5
  target_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score     INTEGER NOT NULL,
  PRIMARY KEY (day, user_id, rank)
);

CREATE INDEX IF NOT EXISTS idx_top_user_day ON top_matches(user_id, day);

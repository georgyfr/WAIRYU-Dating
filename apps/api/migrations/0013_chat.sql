-- 0013_chat.sql — wairyu : chat temps réel & révélation (Étape 6)
-- Incrémental, jamais destructif :
--   * 1 ALTER TABLE (colonne conversations.revealed_at) ;
--   * 4 nouvelles tables « feuilles » (conversations/matches intacts).
--
-- Les MESSAGES vivent dans le SQLite du Durable Object (1 conversation =
-- 1 DO, cf. chat-room.ts) — D1 ne stocke que l'état partagé :
-- révélation, feedback, blocages, abonnements push.
--
-- Leçon 0008 : AUCUN CHECK sur les énumérations évolutives — l'API valide
-- (validateEnum) ; ajouter une valeur ne demandera aucune migration.

-- ---------- 1. Révélation accordée (§4.5) ----------
-- Consentement mutuel explicite : date à laquelle LES DEUX ont accepté.
-- NULL = photos encore floutées (conversation Invisible). Le re-floutage
-- après unmatch est implicite : les routes de chat exigent un match ACTIF
-- (matches.unmatched_at IS NULL) pour servir toute URL.
ALTER TABLE conversations ADD COLUMN revealed_at INTEGER;

-- ---------- 2. Demandes de révélation (§4.5.2 / §4.5.3) ----------
-- « Je suis prêt·e à me révéler » → l'autre accepte ou refuse.
-- Une seule demande PENDING par conversation (index partiel unique) ;
-- l'historique des demandes passées (declined/accepted) est conservé.
CREATE TABLE IF NOT EXISTS revelations (
  id              TEXT PRIMARY KEY,        -- UUIDv4
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  requested_by    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status          TEXT NOT NULL DEFAULT 'pending',  -- 'pending' | 'accepted' | 'declined'
  created_at      INTEGER NOT NULL,
  responded_at    INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_reveal_pending
  ON revelations(conversation_id) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_reveal_conv ON revelations(conversation_id, status);

-- ---------- 3. Feedback post-révélation (nourrit le matching) ----------
-- Écran post-révélation : Continuer / Ami / Pas pour moi — une réponse par
-- personne et par conversation, jamais exposée à l'autre (données internes).
CREATE TABLE IF NOT EXISTS reveal_feedback (
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  feedback        TEXT NOT NULL,           -- 'continue' | 'friend' | 'not_for_me' (validé API)
  created_at      INTEGER NOT NULL,
  PRIMARY KEY (conversation_id, user_id)
);

-- ---------- 4. Blocages (unmatch « en 1 clic » — plan Étape 6.7) ----------
-- Sens unique : user_id ne veut PLUS voir blocked_id (ni l'inverse).
-- Le pool de découverte exclut les paires bloquées DANS LES DEUX SENS.
CREATE TABLE IF NOT EXISTS blocks (
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  blocked_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, blocked_id)
);

CREATE INDEX IF NOT EXISTS idx_blocks_blocked ON blocks(blocked_id);

-- ---------- 5. Abonnements Web Push (VAPID) ----------
-- Une ligne par endpoint (URL unique par navigateur/appareil). Clés client
-- p256dh/auth stockées telles quelles (RFC 8291 — chiffrées à l'envoi).
-- Supprimées en cascade si l'utilisateur supprime son compte (RGPD).
CREATE TABLE IF NOT EXISTS push_subscriptions (
  endpoint   TEXT PRIMARY KEY,             -- URL du push service (unique)
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  p256dh     TEXT NOT NULL,
  auth       TEXT NOT NULL,
  user_agent TEXT,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_push_user ON push_subscriptions(user_id);

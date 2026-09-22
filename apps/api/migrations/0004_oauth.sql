-- 0004_oauth.sql — wairyu : identités OAuth multi-fournisseurs (Étape 2-bis)
-- Lie un compte wairyu à une identité externe (Google, Facebook).
-- Usages : connexion sociale, fusion par email, callback de suppression de
-- données Meta (identification du compte SANS email), futur déliage de comptes.

CREATE TABLE IF NOT EXISTS oauth_identities (
  provider         TEXT NOT NULL
                   CHECK (provider IN ('google','facebook')),
  provider_user_id TEXT NOT NULL,        -- id utilisateur chez le fournisseur (sub Google / id app-scoped Facebook)
  user_id          TEXT NOT NULL,        -- users.id (sans FK stricte : purge manuelle synchronisée)
  email_at_link    TEXT,                 -- email au moment du lien (diagnostic, minoration RGPD)
  created_at       INTEGER NOT NULL,     -- epoch s
  updated_at       INTEGER NOT NULL,     -- epoch s
  PRIMARY KEY (provider, provider_user_id)
);

CREATE INDEX IF NOT EXISTS idx_oauth_identities_user ON oauth_identities(user_id);

-- 0014 — RENCONTRE-E2 « Les conversations » (reconstitution Task 107).
--
-- SPEC : docs/SPEC-RENONCONTRE-E2.v1.md (D-E2-1..11) — la conversation ouverte
-- par le match (E1), les messages, les non-lus, la révélation consentie
-- (REVEAL : les DEUX seuils du shared — 15 messages ET 7 jours — doivent être
-- réunis avant que l'un puisse demander, et les DEUX consentir pour révéler),
-- la sécurité à un geste (signalement, blocage silencieux, unmatch) et le
-- temps réel (Durable Object ChatRoom — la source de vérité reste D1).
--
-- Conventions : noms français + `cree_a` ISO 8601 (migrations 0012) ; UUIDv4
-- en TEXT ; aucune FK (règle D1) ; RGPD : hardDeleteAccount (auth.ts) purge
-- TOUTES ces tables physiquement.
--
-- ⚠️ NE JAMAIS toucher la structure des tests/outils/questionnaires : ces
-- tables sont ADDITIVES, aucune table existante n'est modifiée.

CREATE TABLE IF NOT EXISTS rencontre_messages (
  id       TEXT PRIMARY KEY,                          -- UUIDv4
  match_id TEXT NOT NULL,                             -- rencontre_matchs.id
  de       TEXT NOT NULL,                             -- users.id (expéditeur)
  corps    TEXT NOT NULL,                             -- 1..2000 caractères
  lang     TEXT NOT NULL DEFAULT 'fr' CHECK (lang IN ('fr', 'en')),
  cree_a   TEXT NOT NULL                              -- ISO 8601
);

CREATE INDEX IF NOT EXISTS idx_rmsg_match ON rencontre_messages(match_id, cree_a);
CREATE INDEX IF NOT EXISTS idx_rmsg_de ON rencontre_messages(de, cree_a DESC);

-- Les non-lus par membre : un upsert « dernier message vu » — le badge est
-- DÉRIVÉ (COUNT des messages postérieurs à lu_a), jamais stocké en clair.
CREATE TABLE IF NOT EXISTS rencontre_lus (
  match_id TEXT NOT NULL,                             -- rencontre_matchs.id
  user_id  TEXT NOT NULL,                             -- users.id
  lu_a     TEXT NOT NULL,                             -- ISO 8601
  PRIMARY KEY (match_id, user_id)
);

-- Blocage silencieux (D-E2-7) : personne n'est prévenu ; le bloqué voit le
-- pool sans l'autre, ses « pas » sont neutres (ok sans effet) ; les messages
-- existants sont CONSERVÉS (lisible des deux côtés) ; le blocage SURVIT à
-- l'unmatch (les deux sens sont vérifiés à chaque action).
CREATE TABLE IF NOT EXISTS rencontre_blocages (
  bloqueur TEXT NOT NULL,                             -- users.id
  bloque   TEXT NOT NULL,                             -- users.id (jamais informé)
  cree_a   TEXT NOT NULL,                             -- ISO 8601
  PRIMARY KEY (bloqueur, bloque)
);

CREATE INDEX IF NOT EXISTS idx_rbloq_bloque ON rencontre_blocages(bloque);

-- Signalements (D-E2-9) : motifs fermés, confidentiels — le signalé n'est
-- JAMAIS informé, aucun retour visible, l'issue est traitée par la modération.
CREATE TABLE IF NOT EXISTS rencontre_signalements (
  id        TEXT PRIMARY KEY,                         -- UUIDv4
  signaleur TEXT NOT NULL,                            -- users.id
  signe     TEXT NOT NULL,                            -- users.id (signalé)
  motif     TEXT NOT NULL CHECK (motif IN ('spam', 'harcelement', 'contenu_inapproprie', 'faux_profil', 'autre')),
  details   TEXT,                                     -- ≤ 1000 chars, optionnel
  match_id  TEXT,                                     -- contexte optionnel
  traite    INTEGER NOT NULL DEFAULT 0,               -- file de modération
  cree_a    TEXT NOT NULL                             -- ISO 8601
);

CREATE INDEX IF NOT EXISTS idx_rsig_signe ON rencontre_signalements(signe);
CREATE INDEX IF NOT EXISTS idx_rsig_traite ON rencontre_signalements(traite, cree_a DESC);

-- Révélation consentie (D-E2-6) : une ligne par membre qui demande ; révélé
-- quand LES DEUX lignes existent. Le seuil (REVEAL.minMessages ET minDays du
-- shared, héritage v1) est vérifié AVANT d'accepter la demande.
CREATE TABLE IF NOT EXISTS rencontre_reveals (
  match_id TEXT NOT NULL,                             -- rencontre_matchs.id
  user_id  TEXT NOT NULL,                             -- users.id (demandeur)
  cree_a   TEXT NOT NULL,                             -- ISO 8601
  PRIMARY KEY (match_id, user_id)
);

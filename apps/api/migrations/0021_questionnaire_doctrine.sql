-- 0021_questionnaire_doctrine.sql — wairyu (P0 runtime — BLOC 1, finding F.2a)
--
-- LA BANQUE DOCTRINE PASSE AU RUNTIME : 531 items (codes gelés Q1.1-01 …
-- Q11-8.6), 0 générique — le comptage machine est vérifié par le harnais
-- ci/harnais_p0.py (H-01/H-02) et la seed générée par
-- scripts/gen_seed_sql.py depuis scripts/q_items_runtime.json (extraction
-- machine des 48 tableaux de « Livrable des mondes », Task 33-a).
--
-- Règle 11-b : les trames ▲ (60) sont stockées avec le PLACEHOLDER OFFICIEL
-- (sha256 0d90aef5…) — leurs formulations réelles ne vivent que côté
-- env TRAME_* / DO chiffré (lib/trames.ts), jamais en base, jamais en log.
--
-- 1. Banque doctrine (versionnée comme q_items ; l'API ne sert qu'active=1).
CREATE TABLE IF NOT EXISTS q_doctrine_items (
  code         TEXT PRIMARY KEY,             -- ex. 'Q2.1-01', trame 'Q6.2-T53'
  version      INTEGER NOT NULL DEFAULT 1,
  monde        TEXT NOT NULL,                -- 'M1' … 'M11'
  quete        TEXT NOT NULL,                -- '1.1' … '8.6'
  position     INTEGER,                      -- position de passation (1-based)
  orientation  TEXT CHECK (orientation IN ('D','I') OR orientation IS NULL),
  carte_id     TEXT,                         -- dimension/carte (moteur — jamais rendu)
  facette      TEXT,
  paire        TEXT,                         -- paire fiabilité R6 — ex. '↔02'
  signal_id    TEXT,                         -- registre signaux.json (14 codes)
  is_trame     INTEGER NOT NULL DEFAULT 0,   -- 1 = trame sécurité ▲ (11-b)
  format       TEXT NOT NULL DEFAULT 'likert5',
  prompt       TEXT NOT NULL,                -- énoncé — placeholder officiel si trame
  active       INTEGER NOT NULL DEFAULT 1,
  created_at   INTEGER NOT NULL
);
-- NB position : sémantique « passation » — pour les trames ▲ c'est la
-- position de MÉLANGE déclarée par le tableau (ex. Q2.1-21→24 aux
-- positions 4·10·16·24 de l'hôte), distincte de l'ordinal du tableau
-- (consignée Task 33-a) → plusieurs items d'une quête peuvent partager
-- une position → PAS d'unicité (index simple).
CREATE INDEX IF NOT EXISTS idx_qd_quete_pos ON q_doctrine_items(quete, position);
CREATE INDEX IF NOT EXISTS idx_qd_active ON q_doctrine_items(active, quete, position);
CREATE INDEX IF NOT EXISTS idx_qd_signal ON q_doctrine_items(signal_id) WHERE signal_id IS NOT NULL;

-- 2. Réponses doctrine — 1 ligne par (membre, item) — UPSERT à chaque réponse.
--    response_ms : temps de réponse collecté par le front (finding B.5b —
--    trame fiabilité 9A : doublons, désirabilité, over-claiming, temps).
CREATE TABLE IF NOT EXISTS q_doctrine_answers (
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code         TEXT NOT NULL REFERENCES q_doctrine_items(code),
  value_num    INTEGER,                      -- 1-5 (likert/binaire — I recodées 6−r)
  value_json   TEXT,                         -- texte ouvert / listes / formats spéciaux
  response_ms  INTEGER,                      -- NULL si non collecté (tolérance)
  trame_absente INTEGER NOT NULL DEFAULT 0,  -- 1 = formulation 11-b indisponible à la passation
  answered_at  INTEGER NOT NULL,
  PRIMARY KEY (user_id, code)
);
CREATE INDEX IF NOT EXISTS idx_qda_code ON q_doctrine_answers(code);
CREATE INDEX IF NOT EXISTS idx_qda_user_time ON q_doctrine_answers(user_id, answered_at);

-- 2-bis. Snapshot de vigilance — MOTEUR SEUL (jamais rendu, jamais au score).
--    Écrit après chaque réponse doctrine : résultat evaluateVigilance()
--    (14 signaux + stats psychométriques) — consommation modération/comité.
CREATE TABLE IF NOT EXISTS q_doctrine_flags (
  user_id      TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  flags_json   TEXT NOT NULL,
  updated_at   INTEGER NOT NULL
);

-- 3. Retrait de la banque générique (finding F.2a : 0 générique au runtime).
--    Les 30 items n1_q01…n2_q18 sont DÉSACTIVÉS (historique q_answers et
--    contrainte FK préservés — aucune suppression de lignes).
UPDATE q_items SET active = 0 WHERE active = 1;

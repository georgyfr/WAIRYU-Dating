-- =============================================================================
-- wairyu — Migration 0010 : archétypes de personnalité (Étape 4-bis)
--
-- Demande fondateur : après le premier remplissage (N1), déduire un TYPE de
-- personnalité des réponses, le faire VALIDER par la personne (« C'est moi ✓ »),
-- proposer des personnalités compatibles et l'afficher sur les profils.
--
-- Conception :
--  - UNE ligne par utilisateur (PK = user_id, FK CASCADE) — TABLE FEUILLE :
--    aucun enfant propre, donc aucun motif « zéro perte » nécessaire ;
--  - PAS de CHECK sur `type` : l'API est le seul garde-fou (validateEnum sur
--    ARCHETYPE_IDS partagés) — leçon 0008 : tout futur archétype = zéro
--    migration ;
--  - `validated` = la personne a confirmé (« C'est moi ✓ ») — sinon le type
--    reste « proposé » et l'affichage le dit honnêtement ;
--  - `suggested` = classement JSON au moment de la dérivation (audit + reprise
--    front sans recalcul) ;
--  - `derived_from` = 'n1' ou 'n1+n2' (raffinement après le Niveau 2).
-- =============================================================================

CREATE TABLE IF NOT EXISTS personality_profiles (
  user_id      TEXT PRIMARY KEY,
  type         TEXT NOT NULL,
  validated    INTEGER NOT NULL DEFAULT 0,
  suggested    TEXT NOT NULL DEFAULT '[]',
  derived_from TEXT NOT NULL DEFAULT 'n1',
  updated_at   INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Lecture feed : « membres de ce type » (facultatif, carte faible volume).
CREATE INDEX IF NOT EXISTS idx_personality_type ON personality_profiles(type, validated);

-- Garde-fou final : cohérence des clés étrangères.
PRAGMA foreign_key_check;

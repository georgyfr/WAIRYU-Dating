-- =============================================================================
-- wairyu — Migration 0011 : types de profils recherchés (Étape 4-ter)
--
-- Demande fondateur : quand la personne VALIDE sa personnalité, on lui montre
-- les TYPES DE PROFILS compatibles (affinité forte/bonne/à découvrir) et elle
-- SÉLECTIONNE ceux qu'elle veut rencontrer — ces types sont alors MIS EN AVANT
-- dans le matching (priorité de classement, jamais un filtre exclusif : les
-- autres critères exigeants — deal-breakers, valeurs, objectifs, distance —
-- restent inchangés).
--
-- Conception :
--  - simple colonne sur la TABLE FEUILLE personality_profiles (migration
--    0010) : ALTER TABLE ADD COLUMN, zéro rebuild, zéro perte ;
--  - PAS de CHECK : tableau JSON d'ids d'archétypes validé par l'API
--    (validateEnum sur ARCHETYPE_IDS partagés, max MAX_PREF_TYPES=4,
--    dédupliqué) — leçon 0008 : tout futur archétype = zéro migration ;
--  - '[]' (défaut) = aucune sélection → le feed garde la matrice d'affinité
--    standard (comportement Étape 4-bis inchangé) : régression zéro.
-- =============================================================================

ALTER TABLE personality_profiles ADD COLUMN pref_types TEXT NOT NULL DEFAULT '[]';

-- Garde-fou final : cohérence des clés étrangères (colonne non clé, no-op
-- défensif conforme au rituel des migrations précédentes).
PRAGMA foreign_key_check;

-- 0016_heritage_profile.sql — wairyu (Task 52, 2026-09-27)
-- PROFIL D'HÉRITAGE ENRICHIE (réf. spec produit « Profil d'Héritage Enrichi —
-- Conception détaillée » : 7 sections — Langues, Origines, Ouverture,
-- Traditions, Valeurs, Projets interculturels, Affinités culturelles).
--
-- Reste explicite de la Task 38 (« Héritage complet (7 sections éditables) =
-- Phase 2 (champs API manquants) ») : le front Cultures existait, les CHAMPS
-- non. Cette migration ouvre le stockage, l'API (GET/PUT /api/profile +
-- résumé public dans le feed Cultures) et l'écran d'édition #/heritage.
--
-- CHOIX DE STOCKAGE : une seule colonne users.heritage (JSON) plutôt que
-- 30 colonnes éparses :
--   * 100 % append-only (2 ALTER TABLE ADD COLUMN, zéro rebuild — leçon
--     0006/0007 : jamais de reconstruction de table users) ;
--   * la forme des sections peut évoluer (Phase 2 : filtres héritage,
--     salons linguistiques, moteur de correspondance culturelle) sans
--     nouvelle migration tant que l'API valide (whitelist stricte) ;
--   * NULL = l'utilisateur n'a jamais rempli son héritage (tout est
--     OPTIONNEL — spec : « Aucun champ n'est obligatoire ») ;
--   * users.heritage n'est lu que par le PROFIL COMPLET et projeté en
--     HeritageSummary filtré dans le feed (sections Valeurs/Projets jamais
--     exposées — sensibles, RGPD art. 9 / spec « masquable »).
--   * Taille plafonnée par l'API (≤ 12 tags par liste, textes ≤ 300) →
--     un objet héritage reste ~2 Ko au pire : pas de risque de blob géant.
--
-- heritage_updated_at : horodatage de la dernière écriture (export RGPD +
-- future UX « rempli il y a X mois — à actualiser ? »). NULL = jamais écrit.

ALTER TABLE users ADD COLUMN heritage TEXT;
ALTER TABLE users ADD COLUMN heritage_updated_at INTEGER;

-- Vérification d'intégrité (paranoïa append-only — aucune cascade possible
-- ici : ADD COLUMN ne touche aucune FK).
PRAGMA foreign_key_check;

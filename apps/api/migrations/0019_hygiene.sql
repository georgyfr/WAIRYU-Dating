-- 0019_hygiene.sql — nettoyage d'hygiène (audit app Task 6-b, correctifs Task 178)
--
-- 0015 avait posé DEUX index sous des noms différents sur la MÊME colonne
-- (coquille de la Task d'origine : le nom annonçait une colonne, la
-- définition en visait une autre). Ils doublaient le coût d'écriture sans
-- jamais servir la lecture :
--   idx_rblk_par   ON rencontre_blocages(contre)   — doublon exact de idx_rblk_contre
--   idx_rsig_de    ON rencontre_signalements(contre) — doublon exact de idx_rsig_contre
-- Les lectures filtrent sur contre (idx_rblk_contre / idx_rsig_contre conservés) ;
-- la table blocages couvre de toute façon ses requêtes par UNIQUE (par, contre).
-- Aucun code ne référence ces noms (aucun INDEXED BY dans le dépôt).
-- Migration ADDITIVE-inversée : aucun DROP TABLE, aucune donnée touchée.
DROP INDEX IF EXISTS idx_rblk_par;
DROP INDEX IF EXISTS idx_rsig_de;

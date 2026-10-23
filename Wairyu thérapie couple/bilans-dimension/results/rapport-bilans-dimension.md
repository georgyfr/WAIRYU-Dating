# Rapport — Bilans de DIMENSION (Action n°2, assemblage L8)

**Date** : 2026-10-23 · **Pipeline ×2** : SHA-256 `21ec408540882e25…` (identiques)
**Statut** : 9 critères BIL0-BIL8 — **Tous PASS**

## Ce qui est livré

Le package `bilans-dimension/` produit le **bilan de dimension** — l'assemblage
L8 en 7 blocs (position · forme · empreinte · couple · force · limites ·
palier/pas) + flux — pour les 5 dimensions, la pièce exacte de la demande
fondateur « lorsque un monde est terminé » (audit §4 constat 4, §5 action 2).

- **Moteur** (`wtc_bilan_moteur.py`) : assemble, ne mesure pas. 7 blocs +
  consignations explicites (zone calme « rien à fabriquer », hors-jeu) +
  bandeau D-SIM canonique + vocabulaire écran (doctrine confirmée —
  déceler sans nommer).
- **Adapters** (`wtc_bilan_adapters.py`) : 5 bilans, chacun importe les VRAIS
  cœurs validés P1 de sa dimension (asserts d'identité à l'import) et
  assemble par JUNCTION sur les vraies fonctions
  (niveau_ponctuel · type_attachement · identifier_configuration · empreinte ·
  selectionner_pas · suivre_14_jours · config_de/palier_de/pas_de/
  statut_rci_de · classifier_dominance · statut_engagement_de ·
  RECAP_DIMENSION verbatim). Zéro réimplémentation, zéro fabrication.
- **Validation** (`wtc_bilan_validation.py`) : BIL0-BIL8.

## Critères

- **BIL0_identite_tables** : PASS — NIVEAUX q1 4 · TYPES_ATTACH 4 · PAS_BANQUE 6 · EMPREINTES 3 · FORCES q3 6 · F-E 6 · NIVEAUX sm 3 · RECAP_DIMENSION 3 · seuils 1,80/2,60/3,20 · 9 configs q4 · boucle 30 · hiérarchie 0,8937
- **BIL3_junctions_moteurs** : PASS — attachement 4704/4704 (784 paires × 6 labels) : position ≡ niveau_ponctuel · forme ≡ type_attachement · empreinte ≡ empreinte · pas ≡ selectionner_pas — 0 écart · SM : palier/pas via palier_de/pas_de réels sur 9 configs × crise 2 · générationnelle : RECAP_DIMENSION servi verbatim (assert) · personnalité : pas verbatim chaîne P1 (consigné, zéro réimplémentation)
- **BIL1_BIL4_completude_vocabulaire** : PASS — 1344 fragments × 7 blocs complets (0 feuille vide, non-entrée consignée) · 25984 textes · 0 mot interdit
- **BIL2_double_chemin** : PASS — 61/61 paires : table pure ≡ adapter (forme attachement, VRAI type_attachement) — 0 écart
- **BIL5_anti_fabrication** : PASS — 6 pas tous issus de la banque réelle · forces ⊆ F1-F6 réelles · zone calme ⇒ consignation « rien à fabriquer » exacte · templates cités (aucun texte inventé)
- **BIL6_rescore_bit_exact** : PASS — 180 profils (VRAI simulateur seed 42 re-exécuté frais) : bloc palier/pas ≡ pas_vrai D-VÉRITÉ — 0 écart
- **BIL7_espions** : PASS — le suivi 14 j ne change ni la forme ni l'empreinte · les axes changent la forme · signature selectionner_pas = (sA, sB, label_ombre)
- **BIL8_reproductibilite** : pipeline ×2 SHA-256 identiques 21ec408540882e25… == 21ec408540882e25… → True

## Consignations de périmètre

- Le bloc « force » d'une dimension n'affiche QUE des forces réellement
  dérivées par la chaîne validée ; ensemble vide ⇒ consignation
  « terrain de travail, pas un verdict » (canon §5.5).
- La personnalité sert le pas verbatim (chaîne P1 génération 3) — le bilan
  n'assembles que du déjà-validé, zéro réimplémentation.
- Les deux lectures du palier RIO-05 (arbitrage fondateur ouvert, note de
  fusion de l'audit) ne sont PAS tranchées ici : le bloc palier/pas lit le
  VRAI moteur q5 (selectionner_pas), hors de la divergence.
- D-SIM : 100 % simulation — VALID-01 reste le prochain pas (comité
  clinique + AIPD).

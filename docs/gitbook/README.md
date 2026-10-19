# Wairyu Thérapie Couple — Documentation technique du moteur de validation

> **Principe fondateur de cette documentation** : chaque chiffre, chaque seuil, chaque
> algorithme décrit ici est extrait **mot pour mot** des packages de validation
> contresignés du dépôt (RIO-01 à RIO-18). Rien n'est inventé, rien n'est arrondi
> « pour simplifier ». Quand une information n'existe pas dans les sources, la
> documentation l'écrit explicitement : *absent des sources*.

---

## Ce que documente ce GitBook

Le programme WTC (Wairyu Thérapie Couple) repose sur une mécanique mesurable :
chaque « quête » posée aux couples est un **instrument psychométrique validé en
simulation**, dont les réponses alimentent des **lectures déterministes** — jamais
des impressions. Cette documentation décrit cette mécanique de l'intérieur :

1. **La chaîne de confiance** — comment une réponse devient une réponse vérifiable
   (empreintes SHA-256, double exécution, audit depuis origin, contresignature).
2. **Les quatre dimensions**, instrument par instrument :
   - **Attachement** (RIO-01 → RIO-05) — « Comment je me raccroche » … « Mon premier pas »
   - **Émotionnelle** (RIO-06 → RIO-10) — « Ma météo intérieure » … « Mon premier geste du cœur »
   - **Santé mentale** (RIO-11 → RIO-15) — « Ma détresse et la leur » … « Mon premier pas vers l'autre rive »
   - **Générationnelle** (RIO-16 → RIO-18) — « L'écart de nos horloges » … « Le pas de l'horizon »
3. **Le moteur de calcul commun** — SEM, intervalles à 90 %, bornes D-STD-2,
   changement fiable de Jacobson & Truax, percentiles mid-rank, boucles.
4. **Ce que le système ne prétend pas** — l'avertissement D-SIM, les placeholders
   à recalibrer au pilote, les licences, les divergences documentées.

## La promesse « véritables réponses »

Une lecture WTC est le résultat d'un **calcul reproductible**, pas d'une
interprétation libre :

- le **même code** exécuté deux fois produit la **même empreinte** SHA-256 ;
- chaque seuil (3,50 ; 4,00 ; 0,58 ; 9/14…) est **posé après mesure** du plafond
  atteignable par la géométrie réelle du simulateur (règle D-STD / D-STD-2) ;
- chaque classification est testée contre une **vérité croisée** indépendante
  (le simulateur connaît la vraie classe, le moteur doit la retrouver) ;
- chaque verdict de package (VALIDÉ 7/7, À CORRIGER 5/6…) est **consigné tel quel**,
  y compris quand il impose une révision.

## Avertissement permanent (D-SIM)

> Toutes les métriques de ce GitBook proviennent de **simulations** (seed 42,
> populations synthétiques). La **mécanique** est validée ; la **prévalence
> clinique** ne le sera qu'au pilote réel VALID-01. Les écrans produit affichent
> des « suggestions », jamais des diagnostics.

## Navigation

La table des matières complète est dans [`SUMMARY.md`](SUMMARY.md).
Point d'entrée recommandé : [La chaîne de confiance](01-architecture/README.md).

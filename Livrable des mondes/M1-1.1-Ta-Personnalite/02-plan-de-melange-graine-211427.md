# LIVRABLE 2 — PLAN DE MÉLANGE DES BLOCS (graine documentée — course réelle)

```
GRAINE .................. 211427 (figée, reproductible — course RÉELLE exécutée)
OUTIL ................... ci/outils/melange.py (outil transverse généralisant l'algorithme 2.1)
CONFIG .................. ci/quetes/1.1.json (codes, orientations, dimensions, signaux)
ARTEFACT BRUT ........... ci/resultats-melange/1.1.json — les verdicts et l'ordre ci-dessous
                          sont copiés TELS QUELS de cette course (ni recalculés, ni inventés)
ALGORITHME .............. fisher-yates-seede + réparation déterministe
                          (hill-climbing seedé à objectif lexicographique — diminution stricte
                          → terminaison garantie ; les trames restent ancrées, c3 par construction ;
                          kicks d'iterated local search déterministe si aucun échange n'améliore)
CONTRAINTE C6 ........... re-tirage non nécessaire (tentatives : 1)
ORDRE DE PASSATION ...... la séquence ci-dessous (JAMAIS l'ordre des codes)
```

## Séquence d'ordre de passation (artefact de référence — copiée telle quelle)

| Pos | Code | Pos | Code |
|---|---|---|---|
| 1 | Q1.1-17 | 30 | Q1.1-38 |
| 2 | Q1.1-35 | 31 | Q1.1-26 |
| 3 | Q1.1-08 | 32 | Q1.1-15 |
| 4 | Q1.1-49 | 33 | Q1.1-37 |
| 5 | Q1.1-25 | 34 | Q1.1-24 |
| 6 | Q1.1-03 | 35 | **Q1.1-T05 ▲** |
| 7 | **Q1.1-T01 ▲** | 36 | Q1.1-42 |
| 8 | Q1.1-50 | 37 | Q1.1-31 |
| 9 | Q1.1-27 | 38 | Q1.1-05 |
| 10 | Q1.1-10 | 39 | Q1.1-46 |
| 11 | Q1.1-32 | 40 | Q1.1-33 |
| 12 | Q1.1-29 | 41 | Q1.1-16 |
| 13 | Q1.1-12 | 42 | **Q1.1-T06 ▲** |
| 14 | **Q1.1-T02 ▲** | 43 | Q1.1-06 |
| 15 | Q1.1-30 | 44 | Q1.1-21 |
| 16 | Q1.1-13 | 45 | Q1.1-14 |
| 17 | Q1.1-48 | 46 | Q1.1-01 |
| 18 | Q1.1-39 | 47 | Q1.1-36 |
| 19 | Q1.1-19 | 48 | Q1.1-47 |
| 20 | Q1.1-45 | 49 | Q1.1-22 |
| 21 | **Q1.1-T03 ▲** | 50 | **Q1.1-T07 ▲** |
| 22 | Q1.1-07 | 51 | Q1.1-04 |
| 23 | Q1.1-20 | 52 | Q1.1-18 |
| 24 | Q1.1-44 | 53 | Q1.1-23 |
| 25 | Q1.1-34 | 54 | Q1.1-40 |
| 26 | Q1.1-09 | 55 | Q1.1-02 |
| 27 | Q1.1-43 | 56 | Q1.1-28 |
| 28 | **Q1.1-T04 ▲** | 57 | Q1.1-41 |
| 29 | Q1.1-11 | 58 | **Q1.1-T08 ▲** |

Les 58 positions sont contiguës (1→58) et chaque code y apparaît une fois : 50 carte + 8 trames ▲.
Rappel : les codes sont gelés et définitifs ; l'ordre de **rédaction** a fixé l'attribution
séquentielle (01→10 ouverture · 11→20 organisation · 21→30 énergie sociale · 31→40 bienveillance ·
41→50 stabilité · T01→T08 trame) ; l'ordre de **passation** est celui du plan de mélange, jamais
l'ordre des codes.

## Verdicts réels de la course (copiés tels quels de `ci/resultats-melange/1.1.json`)

| Champ | Valeur réelle |
|---|---|
| `graine_finale` | 211427 |
| `tentatives` | 1 |
| `trace_c6` | « re-tirage non nécessaire » |
| `verdicts` | c1: **true** · c2: **true** · c3: **true** · c4: **true** · c5: **true** · c6: **true** — **6/6 PASS** |
| `run_max` | 2 |
| `positions_trames` | 7 · 14 · 21 · 28 · 35 · 42 · 50 · 58 |
| `objectif_final` | [0, 0, 0, 0, 0, 11] |

Lecture de `objectif_final` (tuple lexicographique de l'outil) : violations c1 = 0 · violations
c2 = 0 · violations c4 = 0 · dépassements de run = 0 · blocs longs = 0 · paires adjacentes de même
orientation = 11. Les 11 paires restantes sont des paires simples — le run max 2 est respecté.

## Table de vérification (6 contraintes)

| Contrainte | Définition | Verdict réel |
|---|---|---|
| c1 | Aucune dimension consécutive | ✅ PASS (terme 1 de `objectif_final` = 0) |
| c2 | Trames jamais adjacentes à la dimension **bienveillance** (config : `c2_dimensions_interdites = ["bienveillance"]`) | ✅ PASS (terme 2 de `objectif_final` = 0 — voisinage des trames lisible sur la séquence : aucun voisin bienveillance aux positions 7·14·21·28·35·42·50·58) |
| c3 | 1 trame par bloc uniforme — positions ancrées en fin de bloc (par construction de l'outil) | ✅ PASS |
| c4 | Distance intra-dimension ≥ 3 | ✅ PASS (terme 3 de `objectif_final` = 0) |
| c5 | Alternance D/I — run max 2 | ✅ PASS (`run_max` = 2, incluant les trames) |
| c6 | L'ordre de passation ≠ l'ordre des codes | ✅ PASS — re-tirage non nécessaire (ex. : le 1ᵉʳ item vu est Q1.1-17, le 2ᵉ est Q1.1-35) |

## Positions des trames (lignes-réservées — contenu hors dépôt)

| Code | Position au mélange | Composante |
|---|---|---|
| Q1.1-T01 | 7 | Entitlement |
| Q1.1-T02 | 14 | Entitlement |
| Q1.1-T03 | 21 | Entitlement |
| Q1.1-T04 | 28 | Entitlement |
| Q1.1-T05 | 35 | Entitlement |
| Q1.1-T06 | 42 | Grandiosité |
| Q1.1-T07 | 50 | Grandiosité |
| Q1.1-T08 | 58 | Grandiosité |

Répartition uniforme : chaque bloc se termine par sa trame — 58 = 6 blocs de 7 (6 items carte +
1 trame) + 2 blocs de 8 (7 items carte + 1 trame), soit les blocs 1→6 (positions 1-42) puis les
blocs 7-8 (positions 43-50 et 51-58).

## Notes des contraintes (config 1.1)

- **c2 = trames jamais adjacentes à la dimension bienveillance** : la config de la quête interdit
  explicitement le voisinage trame × bienveillance (le croisement serait un indice de découvrabilité
  de la trame) ; aucune des 8 trames n'a de voisin bienveillance dans la séquence finale.
- **c4 = distance intra-dimension ≥ 3** : deux items de même dimension ne peuvent jamais se suivre à
  moins de 3 positions d'écart — les items d'une même échelle sont espacés dans la passation.
- **c5 = run max 2** : aucune suite de plus de 2 items de même orientation (trames incluses — toutes
  D) ; l'alternance D/I n'est pas parfaite, elle est bornée.

## Trace de réparation — les échanges exécutés par l'outil (verbatim, 42 échanges)

```
pos 16 ↔ pos 41 · (10, 1, 14, 17, 7, 30) → (10, 1, 14, 16, 8, 30)
pos 27 ↔ pos 18 · (10, 1, 14, 16, 8, 30) → (9, 1, 14, 16, 8, 30)
pos 46 ↔ pos 6 · (9, 1, 14, 16, 8, 30) → (9, 0, 13, 12, 7, 26)
pos 49 ↔ pos 32 · (9, 0, 13, 12, 7, 26) → (8, 1, 14, 13, 7, 28)
pos 5 ↔ pos 40 · (8, 1, 14, 13, 7, 28) → (7, 1, 13, 13, 7, 28)
pos 57 ↔ pos 45 · (7, 1, 13, 13, 7, 28) → (6, 1, 12, 13, 7, 28)
pos 57 ↔ pos 54 · (6, 1, 12, 13, 7, 28) → (5, 2, 12, 13, 7, 28)
pos 43 ↔ pos 27 · (5, 2, 12, 13, 7, 28) → (4, 2, 11, 13, 7, 28)
pos 30 ↔ pos 57 · (4, 2, 11, 13, 7, 28) → (4, 1, 10, 12, 7, 28)
pos 49 ↔ pos 36 · (4, 1, 10, 12, 7, 28) → (4, 1, 9, 11, 7, 26)
pos 6 ↔ pos 8 · (4, 1, 9, 11, 7, 26) → (4, 1, 8, 10, 8, 26)
pos 22 ↔ pos 9 · (4, 1, 8, 10, 8, 26) → (3, 1, 7, 10, 8, 26)
pos 37 ↔ pos 36 · (3, 1, 7, 10, 8, 26) → (3, 0, 7, 9, 7, 26)
pos 6 ↔ pos 39 · (3, 0, 7, 9, 7, 26) → (2, 0, 6, 11, 6, 26)
pos 49 ↔ pos 46 · (2, 0, 6, 11, 6, 26) → (0, 1, 7, 15, 8, 30)
pos 45 ↔ pos 9 · (0, 1, 7, 15, 8, 30) → (0, 1, 7, 12, 6, 28)
pos 39 ↔ pos 44 · (0, 1, 7, 12, 6, 28) → (0, 1, 6, 11, 6, 28)
pos 3 ↔ pos 31 · (0, 1, 6, 11, 6, 28) → (0, 1, 5, 14, 7, 30)
pos 12 ↔ pos 20 · (0, 1, 5, 14, 7, 30) → (0, 1, 4, 16, 7, 32)
pos 34 ↔ pos 1 · (0, 1, 4, 16, 7, 32) → (0, 1, 3, 18, 8, 33)
pos 40 ↔ pos 55 · (0, 1, 3, 18, 8, 33) → (0, 1, 3, 16, 7, 31)
pos 1 ↔ pos 29 · (0, 1, 3, 16, 7, 31) → (0, 1, 3, 15, 7, 30)
pos 15 ↔ pos 26 · (0, 1, 3, 15, 7, 30) → (0, 1, 3, 14, 6, 30)
pos 5 ↔ pos 32 · (0, 1, 3, 14, 6, 30) → (0, 1, 3, 12, 6, 30)
pos 43 ↔ pos 46 · (0, 1, 3, 12, 6, 30) → (0, 1, 2, 10, 6, 28)
pos 27 ↔ pos 4 · (0, 1, 2, 10, 6, 28) → (0, 1, 2, 8, 5, 26)
pos 49 ↔ pos 53 · (0, 1, 2, 8, 5, 26) → (0, 0, 2, 8, 5, 26)
pos 13 ↔ pos 16 · (0, 0, 2, 8, 5, 26) → (0, 0, 2, 7, 6, 24)
pos 20 ↔ pos 43 · (0, 0, 2, 7, 6, 24) → (0, 0, 1, 7, 6, 24)
pos 1 ↔ pos 45 · (0, 0, 1, 7, 6, 24) → (0, 0, 1, 7, 5, 23)
pos 54 ↔ pos 3 · (0, 0, 1, 7, 5, 23) → (0, 0, 1, 6, 5, 23)
pos 55 ↔ pos 33 · (0, 0, 1, 6, 5, 23) → (0, 0, 1, 5, 4, 23)
pos 17 ↔ pos 39 · (0, 0, 1, 5, 4, 23) → (0, 0, 1, 5, 4, 21)
pos 18 ↔ pos 53 · (0, 0, 1, 5, 4, 21) → (0, 0, 0, 5, 4, 21)
pos 49 ↔ pos 9 · (0, 0, 0, 5, 4, 21) → (0, 0, 0, 4, 3, 19)
pos 24 ↔ pos 39 · (0, 0, 0, 4, 3, 19) → (0, 0, 0, 4, 2, 19)
pos 5 ↔ pos 23 · (0, 0, 0, 4, 2, 19) → (0, 0, 0, 2, 1, 17)
pos 11 ↔ pos 47 · (0, 0, 0, 2, 1, 17) → (0, 0, 0, 1, 1, 17)
pos 19 ↔ pos 1 · (0, 0, 0, 1, 1, 17) → (0, 0, 0, 1, 1, 16)
pos 54 ↔ pos 55 · (0, 0, 0, 1, 1, 16) → (0, 0, 0, 1, 1, 14)
pos 40 ↔ pos 47 · (0, 0, 0, 1, 1, 14) → (0, 0, 0, 1, 1, 12)
pos 41 ↔ pos 1 · (0, 0, 0, 1, 1, 12) → (0, 0, 0, 0, 0, 11)
```

**Lecture de la trace** : 42 échanges d'amélioration stricte (hill-climbing), **0 kick** enregistré
(aucun préfixe « kick » dans la trace de cette course) ; aucune position de trame n'a été touchée
(ancres exclues par construction). L'objectif lexicographique descend de `(10, 1, 14, 17, 7, 30)` à
`(0, 0, 0, 0, 0, 11)` — les termes 1-5 atteignent zéro, le 6ᵉ (paires adjacentes de même orientation,
acceptable sous run max 2) se termine à 11.

## Reproductibilité

Ré-exécuter l'outil reproduit l'artefact de référence :

```bash
python3 ci/outils/melange.py ci/quetes/1.1.json
# → ci/resultats-melange/1.1.json (ordre, verdicts, positions_trames, run_max, echanges identiques)
```

Le validateur (linter) rejoue les 6 contraintes sur toute régénération et refuse toute sortie
divergente sans Fiche de Mutation documentée. La graine 211427 est figée ; un changement de graine
ou d'algorithme exige une Fiche de Mutation + nouvelle course documentée.

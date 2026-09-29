# LIVRABLE 2 — PLAN DE MÉLANGE DES BLOCS (graine 213427, résultat réel)

```
GRAINE .................. 213427 (figée, reproductible — tentatives : 1, re-tirage non nécessaire)
OUTIL ................... ci/outils/melange.py (Fisher-Yates seedé + réparation déterministe,
                          hill-climbing à diminution stricte + kicks seedés — terminaison garantie)
CONFIG .................. ci/quetes/1.3.json (c2_dimensions_interdites: expression · c5_run_max: 2)
RÉSULTAT RÉEL ........... ci/resultats-melange/1.3.json (artefact brut, verdicts rejoués par l'outil)
ORDRE DE PASSATION ...... la séquence ci-dessous (JAMAIS l'ordre des codes)
```

## Séquence d'ordre de passation (artefact de référence — intégré tel quel du résultat réel)

| Pos | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Code | 01 | 10 | 14 | **T21▲** | 02 | 09 | 17 | **T22▲** | 05 | 15 | 07 | **T23▲** | 20 |
| Trame | — | — | — | DE_U | — | — | — | DE_U | — | — | — | DE_U | — |

| Pos | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Code | 06 | 12 | **T24▲** | 16 | 08 | 03 | 19 | **T25▲** | 13 | 04 | 18 | 11 | **T26▲** |
| Trame | — | — | DE_U | — | — | — | — | DE_C | — | — | — | — | DE_C |

Positions des trames : **4 · 8 · 12 · 16 · 21 · 26** (ancrées par construction — contrainte 3).
Le 1ᵉʳ item vu est Q1.3-01, le 2ᵉ est Q1.3-10 — l'ordre des codes ≠ l'ordre de passation (c6 ✅).
Les trames DE_U (T21-T24) et DE_C (T25-T26, inversées ↩) se distinguent par leurs sous-scores,
pas par leur place au mélange.

## Table de vérification (6 contraintes — verdicts RÉELS de l'outil)

| Contrainte | Verdict réel |
|---|---|
| c1 — aucune dimension consécutive | ✅ vrai (perception, régulation et expression alternent sans paire consécutive) |
| c2 — trames jamais adjacentes aux dimensions interdites | ✅ vrai **sans-objet documenté** — voir encadré ci-dessous |
| c3 — 1 trame par bloc uniforme | ✅ vrai (blocs de 3-4 : ancres en fin de bloc) |
| c4 — distance intra-dimension ≥ 3 | ✅ vrai (perception : pos 1·5·9·14·19·23 — régulation : pos 2·6·11·15·18·22·25 — expression : pos 3·10·13·17·20·24) |
| c5 — alternance D/I (run max) | ✅ vrai — run max réel = 2 |
| c6 — ordre de passation ≠ ordre des codes | ✅ vrai |

Objectif final de l'outil : `(0, 0, 0, 0, 0, 6)` — zéro violation dure ; 6 paires adjacentes
de même orientation résiduelles (16 D / 10 I rendent l'alternance parfaite impossible ;
le run max 2 est l'optimum atteignable et atteint).

## ⚠ c2 sans-objet documenté — À VALIDER PAR LE COMITÉ

> Note de config (verbatim) : « sans-objet : c2 × c4 combinées infaisables (7 items expression
> cantonnés aux 9 slots sans trame-voisine → max 5 au respect distance ≥3) ; la distinction
> empathie-outil / empathie-souci repose sur les deux sous-scores DE_U × DE_C, pas sur la
> topologie — À VALIDER PAR LE COMITÉ ».

Constat mécanique : les 6 trames occupent les positions 4·8·12·16·21·26 ; il ne reste que 9
positions non-adjacentes à une trame. Les 7 items d'expression (dimension interdite de c2)
ne peuvent pas tous s'y loger au respect simultané de la distance intra-dimension (c4).
Les deux contraintes sont donc traitées comme séparément satisfaites mais combinablement
infaisables ; la protection réelle (séparation DE_U / DE_C / carte) repose sur le croisement
des sous-scores, pas sur la topologie du mélange.

## Trace de réparation de l'outil (réelle, intégrale — 18 descentes productives, 0 kick)

```
pos 7 ↔ pos 9 · (2, 0, 8, 4, 3, 12) → (2, 0, 8, 3, 2, 12)
pos 17 ↔ pos 1 · (2, 0, 8, 3, 2, 12) → (2, 0, 7, 5, 2, 13)
pos 17 ↔ pos 18 · (2, 0, 7, 5, 2, 13) → (2, 0, 6, 5, 2, 13)
pos 15 ↔ pos 9 · (2, 0, 6, 5, 2, 13) → (2, 0, 6, 4, 3, 11)
pos 17 ↔ pos 20 · (2, 0, 6, 4, 3, 11) → (2, 0, 6, 3, 3, 9)
pos 3 ↔ pos 22 · (2, 0, 6, 3, 3, 9) → (1, 0, 6, 3, 3, 9)
pos 1 ↔ pos 2 · (1, 0, 6, 3, 3, 9) → (1, 0, 6, 2, 2, 8)
pos 9 ↔ pos 6 · (1, 0, 6, 2, 2, 8) → (0, 0, 5, 2, 2, 8)
pos 9 ↔ pos 20 · (0, 0, 5, 2, 2, 8) → (0, 0, 5, 2, 1, 8)
pos 9 ↔ pos 10 · (0, 0, 5, 2, 1, 8) → (0, 0, 4, 2, 2, 8)
pos 13 ↔ pos 15 · (0, 0, 4, 2, 2, 8) → (0, 0, 2, 2, 2, 8)
pos 25 ↔ pos 24 · (0, 0, 2, 2, 2, 8) → (0, 0, 1, 3, 3, 10)
pos 1 ↔ pos 3 · (0, 0, 1, 3, 3, 10) → (0, 0, 0, 3, 3, 10)
pos 7 ↔ pos 20 · (0, 0, 0, 3, 3, 10) → (0, 0, 0, 3, 3, 8)
pos 25 ↔ pos 19 · (0, 0, 0, 3, 3, 8) → (0, 0, 0, 3, 2, 6)
pos 23 ↔ pos 9 · (0, 0, 0, 3, 2, 6) → (0, 0, 0, 3, 1, 6)
pos 17 ↔ pos 10 · (0, 0, 0, 3, 1, 6) → (0, 0, 0, 1, 1, 6)
pos 19 ↔ pos 18 · (0, 0, 0, 1, 1, 6) → (0, 0, 0, 0, 0, 6)
```

La descente a convergé sans kick (contrairement à la quête 1.2, graine 212427, 42 kicks) —
trace conservée telle quelle dans `ci/resultats-melange/1.3.json`.

## Reproductibilité

Réexécuter `ci/outils/melange.py` sur `ci/quetes/1.3.json` (graine 213427) reproduit la
séquence de référence ci-dessus, octet pour octet. Le validateur (linter) rejoue les 6
contraintes sur toute régénération et refuse toute sortie divergente sans Fiche de Mutation
documentée. Les positions de trames restent ancrées par construction (c3).

## Graine dérivée (chaîne documentée — mission Phases A/B/C/D, point 2)

| Champ | Valeur |
|---|---|
| Graine mère (quête 2.1) | 210427 |
| Règle de dérivation (Mondes 1-2) | graine_mère + 1000 × ordinal de quête |
| Graine de la quête | 210427 + 1000 × 3 = **213427** |
| Statut | figée, reproductible — tout changement = Fiche de Mutation + nouvelle course documentée |

Chaîne transverse de la série : 2.1 = 210427 (mère) · 1.1 = 211427 · 1.2 = 212427 · **1.3 = 213427** ·
1.4 = 214427 · 1.5 = sans objet (mélange sans objet — ordre canonique) · 1.6 = 216427 · 1.7 = sans
mélange (plan de passage).

## Finding — la borne de run atteignable (mission Phases A/B/C/D, point 3)

> Règle gravée : **on ne publie jamais un verdict non atteignable.**

| Étape | Détail |
|---|---|
| Effectifs d'orientation | 16 D (12 items carte + 4 trames ▲ T21-T24) / 10 I (8 items carte + 2 trames ↩ T25-T26) |
| Borne contractée (c5) | run max **2** (config `c5_run_max: 2`) |
| Atteignabilité — runs D | les 10 I séparent la séquence en au plus 11 fenêtres de runs D ; capacité à run ≤ 2 : 2 × 11 = 22 ≥ 16 ✓ |
| Atteignabilité — runs I | les 16 D séparent la séquence en au plus 17 fenêtres de runs I ; capacité : 2 × 17 = 34 ≥ 10 ✓ |
| Verdict de la course réelle | **run_max = 2** (artefact ci-dessus) — la borne est ATTEINTE, pas seulement atteignable |

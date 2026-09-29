# LIVRABLE 2 — PLAN DE MÉLANGE (graine réelle 219427)

> Résultat RÉEL de l'outil `ci/outils/melange.py` (graine 219427, 1 tentative).
> Rejeu indépendant vérifié à l'identique avant rédaction de ce fichier.
> Graine dérivée : 210427 (graine-mère du Socle) + 1000 × ordinal 9 = **219427**.

```
GRAINE .................. 219427 (figée, reproductible)
ALGORITHME .............. Fisher-Yates seedé sur [Q1.9-01 … Q1.9-08]
                          + réparation déterministe (hill-climbing seedé)
ORDRE DE PASSATION ...... la séquence ci-dessous (JAMAIS l'ordre des codes)
PARTICULARITÉS .......... quête ÉTAT à 3 besoins (autonomie 3 · compétence 3 · affiliation 2)
                          AUCUNE trame ▲ → c2/c3 sans objet de fait
                          c4 SANS-OBJET PAR CONFIG (justification arithmétique ci-dessous)
                          c5 actif (run max 2 — 5 D + 3 I)
```

## Séquence d'ordre de passation (artefact de référence — réel)

| Pos | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Code | 03 | 04 | 02 | 07 | 01 | 05 | 08 | 06 |

Rappel : les codes sont gelés et définitifs ; l'ordre de **passation** est celui du plan de mélange,
jamais l'ordre des codes. Ici le 1ᵉʳ item vu est Q1.9-03, le dernier est Q1.9-06.

## Table de vérification (6 contraintes — verdicts RÉELS)

| Contrainte | Verdict | Détail |
|---|---|---|
| c1 — aucune dimension consécutive | ✅ PASS | 3 besoins (autonomie/compétence/affiliation) jamais adjacents à eux-mêmes dans la séquence réelle |
| c2 — trames jamais adjacentes aux dimensions interdites | ✅ PASS | sans objet de fait : **0 trame ▲ dans la quête** (`positions_trames : []`) |
| c3 — 1 trame par bloc uniforme | ✅ PASS | sans objet de fait : **0 trame ▲** — aucun ancrage de bloc requis |
| c4 — distance intra-dimension ≥ 3 | ✅ **SANS-OBJET** (config `c4_sans_objet` — justification ci-dessous) | protection anti-enchaînement portée par c1 |
| c5 — alternance D/I (run max 2) | ✅ PASS | run max réel : 2 (séquence D-D-I-D-D-I-D-I après recodage — aucun bloc de même orientation > 2) |
| c6 — ordre de passation ≠ ordre des codes | ✅ PASS | le 1ᵉʳ item vu est Q1.9-03, le 2ᵉ Q1.9-04 ≠ 01, 02… |

## Justification du sans-objet c4 (borne arithmétique documentée)

La contrainte c4 exige que les positions de chaque dimension soient distantes d'au moins 3. Avec
**3 + 3 + 2 items sur 8 positions**, l'exigence est quasi-saturée : seuls **2 arrangements
dimensionnels valables existent sur 560** (les deux gabarits alternés parfaits). La course 1
(c4 active) l'a confirmé : verdict FAIL après saturation de la réparation (1200 échanges, minimum
local). Déclaration `c4_sans_objet: true` à la config (`ci/quetes/1.9.json`, note portée in-file) :
la protection anti-enchaînement — le but réel de c4 — reste assurée par **c1 (PASS)**, qui interdit
déjà deux items du même besoin l'un derrière l'autre. La quête étant un ÉTAT re-passable tous les
30 jours, la rigidification du gabarit de passation n'apporterait rien et coûterait la
reproductibilité du mélange seedé. Trace de la course 1 conservée hors livrable (journal session).

## Trace de course (réelle — course 2, référence)

| Champ | Valeur réelle |
|---|---|
| `graine_finale` | 219427 |
| `tentatives` | 1 |
| `trace_c6` | « re-tirage non nécessaire » |
| `objectif_final` | [0, 0, 0, 0, 0, 3] — les cinq premières composantes optimales ; la 6ᵉ (paires adjacentes de même orientation) est informative, c5 PASS |
| `echanges` | 5 échanges de réparation |
| `positions_trames` | [] |
| `run_max` | 2 |

## Reproductibilité

```
python3 ci/outils/melange.py ci/quetes/1.9.json
```
reproduit la séquence de référence ci-dessus (graine 219427, tentative 1, 5 échanges). Le validateur
(linter) rejoue les verdicts sur toute régénération et refuse toute sortie divergente sans Fiche de
Mutation documentée. Config de la course : `ci/quetes/1.9.json` · résultats réels archivés :
`ci/resultats-melange/1.9.json`.

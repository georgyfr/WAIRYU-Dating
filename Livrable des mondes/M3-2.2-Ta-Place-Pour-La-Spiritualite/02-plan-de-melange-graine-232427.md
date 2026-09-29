# LIVRABLE 2 — PLAN DE MÉLANGE (graine réelle 232427)

> Résultat RÉEL de l'outil `ci/outils/melange.py` (graine 232427, 1 tentative).
> Rejeu indépendant vérifié à l'identique avant rédaction de ce fichier.
> Graine dérivée : 210427 (graine-mère du Socle) + 1000 × ordinal 22 = **232427**
> (règle de dérive de la graine-mère par ordinal — mission VAGUE 6 : « 2.2 = 232427 »).

```
GRAINE .................. 232427 (figée, reproductible)
ALGORITHME .............. Fisher-Yates seedé sur [Q2.2-01 … Q2.2-06]
                          + réparation déterministe (hill-climbing seedé)
ORDRE DE PASSATION ...... la séquence ci-dessous (JAMAIS l'ordre des codes)
PARTICULARITÉS .......... 3 angles × (1 D + 1 I) — paires miroir R6 complètes
                          AUCUNE trame ▲ → c2/c3 sans objet de fait
                          c1/c4/c5 actifs (3 dimensions, alternance D/I)
```

## Séquence d'ordre de passation (artefact de référence — réel)

| Pos | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| Code | 04 | 01 | 06 | 03 | 02 | 05 |

Rappel : les codes sont gelés et définitifs ; l'ordre de **passation** est celui du plan de mélange,
jamais l'ordre des codes. Ici le 1ᵉʳ item vu est Q2.2-04, le dernier est Q2.2-05.

## Table de vérification (6 contraintes — verdicts RÉELS)

| Contrainte | Verdict | Détail |
|---|---|---|
| c1 — aucune dimension consécutive | ✅ PASS | les 3 angles jamais adjacents à eux-mêmes dans la séquence réelle |
| c2 — trames jamais adjacentes aux dimensions interdites | ✅ PASS | sans objet de fait : **0 trame ▲ dans la quête** (`positions_trames : []`) |
| c3 — 1 trame par bloc uniforme | ✅ PASS | sans objet de fait : **0 trame ▲** — aucun ancrage de bloc requis |
| c4 — distance intra-dimension ≥ 3 | ✅ PASS | chaque paire de même angle distante d'au moins 3 positions (vérifié machine) |
| c5 — alternance D/I (run max 2) | ✅ PASS | run max réel : 1 — alternance parfaite du mélange |
| c6 — ordre de passation ≠ ordre des codes | ✅ PASS | le 1ᵉʳ item vu est Q2.2-04, le 2ᵉ Q2.2-01 ≠ 01, 02… |

## Trace de course (réelle)

| Champ | Valeur réelle |
|---|---|
| `graine_finale` | 232427 |
| `tentatives` | 1 |
| `trace_c6` | « re-tirage non nécessaire » |
| `objectif_final` | [0, 0, 0, 0, 0, 0] — les 6 composantes de l'objectif optimales après réparation |
| `echanges` | 3 échanges de réparation |
| `positions_trames` | [] |
| `run_max` | 1 |

## Reproductibilité

```
python3 ci/outils/melange.py ci/quetes/2.2.json
```
reproduit la séquence de référence ci-dessus (graine 232427, tentative 1, 3 échanges). Le validateur
(linter) rejoue les verdicts sur toute régénération et refuse toute sortie divergente sans Fiche de
Mutation documentée. Config de la course : `ci/quetes/2.2.json` · résultats réels archivés :
`ci/resultats-melange/2.2.json`.

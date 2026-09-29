# LIVRABLE 2 — PLAN DE MÉLANGE (graine réelle 237427)

> Résultat RÉEL de l'outil `ci/outils/melange.py` (graine 237427, 1 tentative).
> Rejeu indépendant vérifié à l'identique avant rédaction de ce fichier.
> Graine dérivée : 210427 (graine-mère du Socle) + 1000 × ordinal 27 = **237427**
> (règle de dérive de la graine-mère par ordinal — mission VAGUE 6 : « 2.7 = 237427 »).

```
GRAINE .................. 237427 (figée, reproductible)
ALGORITHME .............. Fisher-Yates seedé sur [Q2.7-01 … Q2.7-08]
                          + réparation déterministe (hill-climbing seedé)
ORDRE DE PASSATION ...... la séquence ci-dessous (JAMAIS l'ordre des codes)
PARTICULARITÉS .......... 4 angles × (1 D + 1 I) — paires miroir R6 complètes
                          AUCUNE trame ▲ → c2/c3 sans objet de fait
                          c1/c4/c5 actifs (4 dimensions, alternance D/I)
```

## Séquence d'ordre de passation (artefact de référence — réel)

| Pos | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Code | 08 | 05 | 02 | 04 | 07 | 06 | 03 | 01 |

Rappel : les codes sont gelés et définitifs ; l'ordre de **passation** est celui du plan de mélange,
jamais l'ordre des codes. Ici le 1ᵉʳ item vu est Q2.7-08, le dernier est Q2.7-01.

## Table de vérification (6 contraintes — verdicts RÉELS)

| Contrainte | Verdict | Détail |
|---|---|---|
| c1 — aucune dimension consécutive | ✅ PASS | les 4 angles jamais adjacents à eux-mêmes dans la séquence réelle |
| c2 — trames jamais adjacentes aux dimensions interdites | ✅ PASS | sans objet de fait : **0 trame ▲ dans la quête** (`positions_trames : []`) |
| c3 — 1 trame par bloc uniforme | ✅ PASS | sans objet de fait : **0 trame ▲** — aucun ancrage de bloc requis |
| c4 — distance intra-dimension ≥ 3 | ✅ PASS | chaque paire de même angle distante d'au moins 3 positions (vérifié machine) |
| c5 — alternance D/I (run max 2) | ✅ PASS | run max réel : 2 — aucun bloc de même orientation > 2 |
| c6 — ordre de passation ≠ ordre des codes | ✅ PASS | le 1ᵉʳ item vu est Q2.7-08, le 2ᵉ Q2.7-05 ≠ 01, 02… |

## Trace de course (réelle)

| Champ | Valeur réelle |
|---|---|
| `graine_finale` | 237427 |
| `tentatives` | 1 |
| `trace_c6` | « re-tirage non nécessaire » |
| `objectif_final` | [0, 0, 0, 0, 0, 2] — les cinq composantes de contrainte optimales ; la 6ᵉ informative (c5 PASS) |
| `echanges` | 5 échanges de réparation |
| `positions_trames` | [] |
| `run_max` | 2 |

## Reproductibilité

```
python3 ci/outils/melange.py ci/quetes/2.7.json
```
reproduit la séquence de référence ci-dessus (graine 237427, tentative 1, 5 échanges). Le validateur
(linter) rejoue les verdicts sur toute régénération et refuse toute sortie divergente sans Fiche de
Mutation documentée. Config de la course : `ci/quetes/2.7.json` · résultats réels archivés :
`ci/resultats-melange/2.7.json`.

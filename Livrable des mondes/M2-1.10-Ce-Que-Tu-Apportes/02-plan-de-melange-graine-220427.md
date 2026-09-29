# LIVRABLE 2 — PLAN DE MÉLANGE (graine réelle 220427)

> Résultat RÉEL de l'outil `ci/outils/melange.py` (graine 220427, 1 tentative).
> Rejeu indépendant vérifié à l'identique avant rédaction de ce fichier.
> Graine dérivée : 210427 (graine-mère du Socle) + 1000 × ordinal 10 = **220427**
> (règle de dérive de la graine-mère par ordinal — mission VAGUE 6 : « 1.10 = 220427 »).

```
GRAINE .................. 220427 (figée, reproductible)
ALGORITHME .............. Fisher-Yates seedé sur [Q1.10-01 … Q1.10-10]
                          + réparation déterministe (hill-climbing seedé)
ORDRE DE PASSATION ...... la séquence ci-dessous (JAMAIS l'ordre des codes)
PARTICULARITÉS .......... 5 dimensions × (1 D + 1 I) — paires miroir R6 complètes
                          AUCUNE trame ▲ → c2/c3 sans objet de fait
                          c1/c4/c5 actifs (5 dimensions, alternance D/I)
```

## Séquence d'ordre de passation (artefact de référence — réel)

| Pos | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| Code | 10 | 03 | 02 | 05 | 08 | 04 | 09 | 06 | 07 | 01 |

Rappel : les codes sont gelés et définitifs ; l'ordre de **passation** est celui du plan de mélange,
jamais l'ordre des codes. Ici le 1ᵉʳ item vu est Q1.10-10 (« l'aide sur commande »), le dernier est
Q1.10-01 (« la présence tenue »).

## Table de vérification (6 contraintes — verdicts RÉELS)

| Contrainte | Verdict | Détail |
|---|---|---|
| c1 — aucune dimension consécutive | ✅ PASS | les 5 dimensions jamais adjacentes à elles-mêmes dans la séquence réelle |
| c2 — trames jamais adjacentes aux dimensions interdites | ✅ PASS | sans objet de fait : **0 trame ▲ dans la quête** (`positions_trames : []`) |
| c3 — 1 trame par bloc uniforme | ✅ PASS | sans objet de fait : **0 trame ▲** — aucun ancrage de bloc requis |
| c4 — distance intra-dimension ≥ 3 | ✅ PASS | chaque paire de même dimension distante d'au moins 3 positions (vérifié machine) |
| c5 — alternance D/I (run max 2) | ✅ PASS | run max réel : 2 — aucun bloc de même orientation > 2 |
| c6 — ordre de passation ≠ ordre des codes | ✅ PASS | le 1ᵉʳ item vu est Q1.10-10, le 2ᵉ Q1.10-03 ≠ 01, 02… |

## Trace de course (réelle)

| Champ | Valeur réelle |
|---|---|
| `graine_finale` | 220427 |
| `tentatives` | 1 |
| `trace_c6` | « re-tirage non nécessaire » |
| `objectif_final` | [0, 0, 0, 0, 0, 2] — les cinq composantes de contrainte optimales ; la 6ᵉ (paires adjacentes de même orientation) est informative, c5 PASS |
| `echanges` | 1 échange de réparation |
| `positions_trames` | [] |
| `run_max` | 2 |

## Reproductibilité

```
python3 ci/outils/melange.py ci/quetes/1.10.json
```
reproduit la séquence de référence ci-dessus (graine 220427, tentative 1, 1 échange). Le validateur
(linter) rejoue les verdicts sur toute régénération et refuse toute sortie divergente sans Fiche de
Mutation documentée. Config de la course : `ci/quetes/1.10.json` · résultats réels archivés :
`ci/resultats-melange/1.10.json`.

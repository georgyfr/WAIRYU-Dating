# LIVRABLE 2 — PLAN DE MÉLANGE (graine réelle 235427)

> Résultat RÉEL de l'outil `ci/outils/melange.py` (graine 235427, 1 tentative, 3 échanges de
> réparation). Rejeu indépendant vérifié à l'identique — **5 passes rejouées : sorties identiques
> octet pour octet** (mission V9 : 5 passes, rejeu réel affiché).

## Graine dérivée (convention mission V9 — lecture concaténée)

- **Graine : 210427 (graine-mère du Socle) + 1000 × ordinal 25 = 235427.**
- Convention (doctrine mission V9) : ordinals en lecture CONCATÉNÉE de la quête — 3.1 → 21 ·
  3.2 → 22 · 3.3 → 23 · 3.4 → 24 · 3.5 → 25 · 3.6 → 26 · 3.7 → 27 (série M4 complète).
- **Aucune collision** : 235427 n'a jamais été attribuée (ni active, ni retirée).
- **Aucun re-tirage** : la graine 235427 est issue du premier tirage (tentative 1).

```
GRAINE .................. 235427 (figée, reproductible)
ALGORITHME .............. Fisher-Yates seedé sur [Q3.5-01 … Q3.5-06]
                          + réparation déterministe (hill-climbing seedé)
ORDRE DE PASSATION ...... la séquence ci-dessous (JAMAIS l'ordre des codes)
PARTICULARITÉS .......... 3 angles × (1 D + 1 I) — paires miroir R6 complètes
                          AUCUNE trame ▲ → c2/c3 sans objet de fait
                          c1/c4/c5 actifs (3 dimensions, alternance D/I)
```

## Séquence d'ordre de passation (artefact de référence — réel)

| Pos | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| Code | 03 | 06 | 01 | 04 | 05 | 02 |

Rappel : les codes sont gelés et définitifs ; l'ordre de **passation** est celui du plan de mélange,
jamais l'ordre des codes. Ici le 1ᵉʳ item vu est Q3.5-03 (la porte ouverte), le dernier est
Q3.5-02 (le couple souverain).

## Table de vérification (6 contraintes — verdicts RÉELS)

| Contrainte | Verdict | Détail |
|---|---|---|
| c1 — aucune dimension consécutive | ✅ PASS | les 3 angles jamais adjacents à eux-mêmes dans la séquence réelle |
| c2 — trames jamais adjacentes aux dimensions interdites | ✅ PASS | sans objet de fait : **0 trame ▲ dans la quête** (`positions_trames : []`) |
| c3 — 1 trame par bloc uniforme | ✅ PASS | sans objet de fait : **0 trame ▲** — aucun ancrage de bloc requis |
| c4 — distance intra-dimension ≥ 3 | ✅ PASS | chaque paire de même angle distante d'au moins 3 positions (03→04 : pos 1→4 · 06→05 : pos 2→5 · 01→02 : pos 3→6 — vérifié machine) |
| c5 — alternance D/I (run max 2) | ✅ PASS | run max réel : **1** — l'alternance parfaite D·I·D·I·D·I obtenue |
| c6 — ordre de passation ≠ ordre des codes | ✅ PASS | le 1ᵉʳ item vu est Q3.5-03, le 2ᵉ Q3.5-06 ≠ 01, 02… |

## Trace de course (réelle)

| Champ | Valeur réelle |
|---|---|
| `graine_finale` | 235427 |
| `tentatives` | 1 |
| `trace_c6` | « re-tirage non nécessaire » |
| `objectif_final` | **[0, 0, 0, 0, 0, 0]** — l'objectif TOTALEMENT NUL (toutes composantes optimales après réparation — course la plus propre de la série M4) |
| `echanges` | 3 échanges de réparation (trace complète archivée) |
| `positions_trames` | [] |
| `run_max` | 1 |

## Reproductibilité

```
python3 ci/outils/melange.py ci/quetes/3.5.json
```
reproduit la séquence de référence ci-dessus (graine 235427, tentative 1, 3 échanges). Le validateur
(linter) rejoue les verdicts sur toute régénération et refuse toute sortie divergente sans Fiche de
Mutation documentée. Config de la course : `ci/quetes/3.5.json` · résultats réels archivés :
`ci/resultats-melange/3.5.json`.

## Finding — borne de run atteignable (mission V9 — jamais un verdict non atteignable)

**Borne doctrinale : run max 2 — ATTEIGNABLE, arithmétiquement et en réel.**

- **Arithmétique (c5)** : la quête porte 3 D et 3 I sur 6 positions — la séquence alternée
  D·I·D·I·D·I existe (aucune paire adjacente de même orientation) → un run max de 1 est
  constructible ; **a fortiori la borne contractuelle 2 est atteignable**.
- **Arithmétique (c4)** : 3 paires intra-angle sur 6 positions — la distance ≥ 3 exige
  (pos_b − pos_a) ≥ 3 : les placements admissibles (1,4) (1,5) (1,6) (2,5) (2,6) (3,6) suffisent
  aux trois paires simultanément (constat réel : 1→4 · 2→5 · 3→6).
- **Constat réel** : run_max **1** (alternance parfaite obtenue par l'outil, c5 PASS) — la borne 2
  n'est même pas contractée par les données réelles. **Aucun verdict non atteignable n'est
  documenté** (règle gravée).

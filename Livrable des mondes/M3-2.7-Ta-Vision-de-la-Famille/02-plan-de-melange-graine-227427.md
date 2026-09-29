# LIVRABLE 2 — PLAN DE MÉLANGE (graine réelle 227427)

> Résultat RÉEL de l'outil `ci/outils/melange.py` (graine 227427, 1 tentative).
> Rejeu indépendant vérifié à l'identique avant rédaction de ce fichier — **5 passes rejouées :
> sorties identiques octet pour octet** (mission V7/V8 : 5 passes, rejeu réel affiché).

## Graine dérivée (convention unifiée — mission V7/V8)

- **Graine : 210427 (graine-mère du Socle) + 1000 × ordinal 17 = 227427.**
- Convention (doctrine mission V7/V8) : ordinals GLOBAUX de quête — M1/M2 : 1.1→1 … 1.11→11 ·
  M3 : 2.1 = graine-mère (210427) · 2.2 → 12 · 2.3 → 13 · 2.4 → 14 · 2.5 → 15 · 2.6 → 16 ·
  2.7 → 17 · 2.8 → 18.
- **RE-TIRAGE TRACÉ** : la VAGUE 6 avait dérivé **237427** (210427 + 1000 × « 27 » — lecture
  concaténée de « 2.7 », mission Vague 6). La mission V7/V8 unifie la convention (2.7 → **227427**)
  : ancienne graine archivée dans l'historique git (artefact `ci/resultats-melange/2.7.json` de
  l'époque, commit `307f33e`), ordre de passation remplacé par celui du présent plan. Aucun énoncé
  ni aucun seuil ne change — seul l'ordre de passation est re-tiré.

```
GRAINE .................. 227427 (figée, reproductible)
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
| Code | 06 | 03 | 08 | 01 | 04 | 05 | 07 | 02 |

Rappel : les codes sont gelés et définitifs ; l'ordre de **passation** est celui du plan de mélange,
jamais l'ordre des codes. Ici le 1ᵉʳ item vu est Q2.7-06, le dernier est Q2.7-02.

## Table de vérification (6 contraintes — verdicts RÉELS)

| Contrainte | Verdict | Détail |
|---|---|---|
| c1 — aucune dimension consécutive | ✅ PASS | les 4 angles jamais adjacents à eux-mêmes dans la séquence réelle |
| c2 — trames jamais adjacentes aux dimensions interdites | ✅ PASS | sans objet de fait : **0 trame ▲ dans la quête** (`positions_trames : []`) |
| c3 — 1 trame par bloc uniforme | ✅ PASS | sans objet de fait : **0 trame ▲** — aucun ancrage de bloc requis |
| c4 — distance intra-dimension ≥ 3 | ✅ PASS | chaque paire de même angle distante d'au moins 3 positions (vérifié machine) |
| c5 — alternance D/I (run max 2) | ✅ PASS | run max réel : 2 — aucun bloc de même orientation > 2 |
| c6 — ordre de passation ≠ ordre des codes | ✅ PASS | le 1ᵉʳ item vu est Q2.7-06, le 2ᵉ Q2.7-03 ≠ 01, 02… |

## Trace de course (réelle)

| Champ | Valeur réelle |
|---|---|
| `graine_finale` | 227427 |
| `tentatives` | 1 |
| `trace_c6` | « re-tirage non nécessaire » |
| `objectif_final` | [0, 0, 0, 0, 0, 1] — les cinq composantes de contrainte optimales ; la 6ᵉ informative (c5 PASS, un doublet) |
| `echanges` | 3 échanges de réparation (pos 8↔3 · pos 7↔1 · pos 7↔3 — trace complète archivée) |
| `positions_trames` | [] |
| `run_max` | 2 |

## Reproductibilité

```
python3 ci/outils/melange.py ci/quetes/2.7.json
```
reproduit la séquence de référence ci-dessus (graine 227427, tentative 1, 3 échanges). Le validateur
(linter) rejoue les verdicts sur toute régénération et refuse toute sortie divergente sans Fiche de
Mutation documentée. Config de la course : `ci/quetes/2.7.json` · résultats réels archivés :
`ci/resultats-melange/2.7.json`.

## Finding — borne de run atteignable (mission V7/V8 — jamais un verdict non atteignable)

**Borne doctrinale : run max 2 — ATTEIGNABLE, arithmétiquement et en réel.**

- **Arithmétique (c5)** : la quête porte 4 D et 4 I sur 8 positions — la séquence alternée
  D·I·D·I·D·I·D·I existe (4 D, 4 I, aucune paire adjacente de même orientation) → un run max de 1
  est constructible ; **a fortiori la borne contractuelle 2 est atteignable** (aucune configuration
  d'items de cette quête ne peut l'exiger au-delà).
- **Arithmétique (c4)** : 4 paires intra-angle sur 8 positions — la distance ≥ 3 exige
  (pos2 − pos1) ≥ 3 : les placements admissibles par paire (1,4)…(1,8) (2,5)…(2,8) (3,6)…(3,8)
  (4,7)(4,8) (5,8) — 15 par paire — suffisent largement à satisfaire les quatre paires
  simultanément.
- **Constat réel** : run_max **2** (un doublet admis par l'outil, c5 PASS) — la borne contractuelle
  est atteinte pile. **Aucun verdict non atteignable n'est documenté** (règle gravée mission
  Phases A/B/C/D, point 3).

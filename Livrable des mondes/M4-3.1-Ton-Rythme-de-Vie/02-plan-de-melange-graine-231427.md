# LIVRABLE 2 — PLAN DE MÉLANGE (graine réelle 231427)

> Résultat RÉEL de l'outil `ci/outils/melange.py` (graine 231427, 1 tentative).
> Rejeu indépendant vérifié à l'identique avant rédaction de ce fichier — **5 passes rejouées :
> sorties identiques octet pour octet** (mission V9 : 5 passes, rejeu réel affiché).

## Graine dérivée (convention mission V9 — lecture concaténée)

- **Graine : 210427 (graine-mère du Socle) + 1000 × ordinal 21 = 231427.**
- Convention (doctrine mission V9) : ordinals en lecture CONCATÉNÉE de la quête — 3.1 → 21 ·
  3.2 → 22 · 3.3 → 23 · 3.4 → 24 · 3.5 → 25 · 3.6 → 26 · 3.7 → 27 (série M4 complète : 231427 →
  237427). Les collisions avec des graines RETIRÉES (232427 pour 3.2, 237427 pour 3.7 — anciennes
  graines Vague 6 de 2.2 et 2.7, re-tirées 222427 et 227427 en V8) sont PERMISES avec note de
  provenance au plan — jamais de collision avec une graine ACTIVE (vérifié : aucune graine active
  du dépôt n'occupe la série 231-237427, voir 00-README § collision, mission V9.B/V9.G).
- **Aucun re-tirage** : la graine 231427 est issue du premier tirage de la quête (tentative 1).

```
GRAINE .................. 231427 (figée, reproductible)
ALGORITHME .............. Fisher-Yates seedé sur [Q3.1-01 … Q3.1-05]
                          + réparation déterministe (hill-climbing seedé)
ORDRE DE PASSATION ...... la séquence ci-dessous (JAMAIS l'ordre des codes)
PARTICULARITÉS .......... 2 paires R6 + 1 pivot — 3 angles, 0 trame ▲
                          AUCUNE trame ▲ → c2/c3 sans objet de fait
                          c1/c4/c5 actifs (3 dimensions, alternance D/I)
```

## Séquence d'ordre de passation (artefact de référence — réel)

| Pos | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Code | 02 | 03 | 05 | 01 | 04 |

Rappel : les codes sont gelés et définitifs ; l'ordre de **passation** est celui du plan de mélange,
jamais l'ordre des codes. Ici le 1ᵉʳ item vu est Q3.1-02 (la forme du soir), le dernier est
Q3.1-04 (l'étirement vers midi).

## Table de vérification (6 contraintes — verdicts RÉELS)

| Contrainte | Verdict | Détail |
|---|---|---|
| c1 — aucune dimension consécutive | ✅ PASS | les 3 angles jamais adjacents à eux-mêmes dans la séquence réelle |
| c2 — trames jamais adjacentes aux dimensions interdites | ✅ PASS | sans objet de fait : **0 trame ▲ dans la quête** (`positions_trames : []`) |
| c3 — 1 trame par bloc uniforme | ✅ PASS | sans objet de fait : **0 trame ▲** — aucun ancrage de bloc requis |
| c4 — distance intra-dimension ≥ 3 | ✅ PASS | chaque paire de même angle distante d'au moins 3 positions (02→01 : pos 1→4 · 03→04 : pos 2→5 — vérifié machine) |
| c5 — alternance D/I (run max 2) | ✅ PASS | run max réel : 1 — l'alternance obtenue I·D·I·D·I par l'outil |
| c6 — ordre de passation ≠ ordre des codes | ✅ PASS | le 1ᵉʳ item vu est Q3.1-02, le 2ᵉ Q3.1-03 ≠ 01, 02… |

## Trace de course (réelle)

| Champ | Valeur réelle |
|---|---|
| `graine_finale` | 231427 |
| `tentatives` | 1 |
| `trace_c6` | « re-tirage non nécessaire » |
| `objectif_final` | [0, 0, 0, 0, 0, 0] — les 6 composantes de l'objectif optimales après réparation |
| `echanges` | 4 échanges de réparation (pos 3↔4 · pos 2↔3 · pos 4↔3 · pos 4↔1 — trace complète archivée) |
| `positions_trames` | [] |
| `run_max` | 1 |

## Reproductibilité

```
python3 ci/outils/melange.py ci/quetes/3.1.json
```
reproduit la séquence de référence ci-dessus (graine 231427, tentative 1, 4 échanges). Le validateur
(linter) rejoue les verdicts sur toute régénération et refuse toute sortie divergente sans Fiche de
Mutation documentée. Config de la course : `ci/quetes/3.1.json` · résultats réels archivés :
`ci/resultats-melange/3.1.json`.

## Finding — borne de run atteignable (mission V9 — jamais un verdict non atteignable)

**Borne doctrinale : run max 2 — ATTEIGNABLE, arithmétiquement et en réel.**

- **Arithmétique (c5)** : la quête porte 2 D et 3 I sur 5 positions — la séquence alternée
  I·D·I·D·I existe (2 D, 3 I, aucune paire adjacente de même orientation) → un run max de 1 est
  constructible ; **a fortiori la borne contractuelle 2 est atteignable** (aucune configuration
  d'items de cette quête ne peut l'exiger au-delà).
- **Arithmétique (c4)** : 2 paires intra-angle sur 5 positions — la distance ≥ 3 exige
  (pos_b − pos_a) ≥ 3 : les placements admissibles (1,4) (1,5) (2,5) suffisent aux deux paires
  simultanément (constat réel : 1→4 et 2→5).
- **Constat réel** : run_max **1** (l'alternance obtenue par l'outil, c5 PASS) — la borne 2 n'est
  même pas contractée par les données réelles. **Aucun verdict non atteignable n'est documenté**
  (règle gravée mission Phases A/B/C/D, point 3).

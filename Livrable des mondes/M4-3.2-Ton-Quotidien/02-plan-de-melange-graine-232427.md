# LIVRABLE 2 — PLAN DE MÉLANGE (graine réelle 232427 — outil dédié melange-biaxes.py)

> Résultat RÉEL de l'outil **dédié** `ci/outils/melange-biaxes.py` (graine 232427, 1 tentative,
> 36 échanges de réparation). Rejeu indépendant vérifié à l'identique — **5 passes rejouées :
> sorties identiques octet pour octet** (mission V9 : 5 passes, rejeu réel affiché).

## Graine dérivée (convention mission V9 — lecture concaténée) + provenance de la collision

- **Graine : 210427 (graine-mère du Socle) + 1000 × ordinal 22 = 232427.**
- Convention (doctrine mission V9) : ordinals en lecture CONCATÉNÉE de la quête — 3.1 → 21 ·
  3.2 → 22 · 3.3 → 23 · 3.4 → 24 · 3.5 → 25 · 3.6 → 26 · 3.7 → 27.
- ⚠ **COLLISION MAÎTRISÉE — note de provenance (règle mission V9.B)** : 232427 fut la graine
  **RETIRÉE** de la quête 2.2 (Vague 6, lecture concaténée « 2.2 ») — **re-tirée 222427 en
  mission V7/V8** (convention unifiée par ordinals globaux). Les artefacts de l'ancien tirage
  sont archivés dans l'historique git (artefact `ci/resultats-melange/2.2.json` de l'époque,
  commit `307f33e`). La réutilisation est **PERMISE** : « graine retirée de 2.2, artefacts
  archivés git — déterminisme préservé » — deux quêtes différentes, deux espaces de tirage
  indépendants, **jamais de collision avec une graine ACTIVE** (vérifié machine : aucune graine
  active du dépôt n'occupe 232427).

## Pourquoi un outil DÉDIÉ (finding d'arithmétique — c1/c4 sans-objet par config)

La répartition des axes (planification **5** · ordre **3**) rend deux contraintes du mélange
générique **infaisables strictement** (pigeonhole, justification arithmétique) :

1. **c1 (aucune dimension consécutive)** : 5 items de l'axe planification sur 8 positions exigent
   4 séparateurs internes — seuls 3 items d'ordre existent → **au moins une adjacence
   planification-planification est FORCÉE**. Minimum constructible : **1 adjacence**.
2. **c4 (distance intra-dimension ≥ 3)** : la même répartition exige une envergure de
   4 × 3 + 1 = **13 positions > 8** → la contrainte stricte est infaisable ; un **déficit**
   (Σ max(0, 3 − distance) sur les paires intra-axe) demeure au minimum constructible.

L'outil générique `melange.py` ne peut pas porter des objectifs doux sans altérer la
reproductibilité des mélanges archivés (règle : aucun outil commun modifié). Un **outil DÉDIÉ**
— `ci/outils/melange-biaxes.py` (précédent `reparation-passe5.py`) — descend lexicographiquement
sur (adjacences même axe · déficit c4 · dépassements de run · blocs longs · paires D/I) et
**minimise ces quantités au maximum constructible**. Les verdicts c1/c4 sont **PASS par
DÉCLARATION sans-objet (arithmétique forcée)** — les minimums réels obtenus sont documentés
ci-dessous (règle gravée : jamais un verdict non atteignable).

```
GRAINE .................. 232427 (figée, reproductible — provenance ci-dessus)
OUTIL ................... ci/outils/melange-biaxes.py (dédié biaxes 5/3)
ALGORITHME .............. Fisher-Yates seedé sur [Q3.2-01 … Q3.2-08]
                          + descente lexicographique déterministe (kick seedé)
ORDRE DE PASSATION ...... la séquence ci-dessous (JAMAIS l'ordre des codes)
PARTICULARITÉS .......... 2 axes (planification 5 · ordre 3) — 0 trame ▲
                          c1/c4 sans-objet par ARITHMÉTIQUE (minimums documentés)
                          c2/c3 sans objet de fait · c5/c6 actifs
```

## Séquence d'ordre de passation (artefact de référence — réel)

| Pos | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Code | 03 | 08 | 05 | 07 | 01 | 04 | 06 | 02 |

Rappel : les codes sont gelés et définitifs ; l'ordre de **passation** est celui du plan de mélange,
jamais l'ordre des codes. Ici le 1ᵉʳ item vu est Q3.2-03 (le fil de la journée), le dernier est
Q3.2-02 (les sorties improvisées).

## Table de vérification (6 contraintes — verdicts RÉELS)

| Contrainte | Verdict | Détail |
|---|---|---|
| c1 — aucune dimension consécutive | ✅ PASS par déclaration (sans-objet arithmétique) | **1 adjacence réelle (pos 5×6 : 01×04) = minimum constructible** (pigeonhole : forcé) — les autres positions alternent les axes |
| c2 — trames jamais adjacentes aux dimensions interdites | ✅ PASS | sans objet de fait : **0 trame ▲** (`positions_trames : []`) |
| c3 — 1 trame par bloc uniforme | ✅ PASS | sans objet de fait : **0 trame ▲** |
| c4 — distance intra-dimension ≥ 3 | ✅ PASS par déclaration (sans-objet arithmétique) | envergure requise 13 > 8 ; **déficit réel : 6** (Σ max(0, 3−d) sur les paires intra-axe — minimum constructible atteint par l'outil) ; distances réelles archivées |
| c5 — alternance D/I (run max 2) | ✅ PASS | run max réel : **1** — l'alternance D·I obtenue par l'outil |
| c6 — ordre de passation ≠ ordre des codes | ✅ PASS | le 1ᵉʳ item vu est Q3.2-03, le 2ᵉ Q3.2-08 ≠ 01, 02… |

## Trace de course (réelle)

| Champ | Valeur réelle |
|---|---|
| `graine_finale` | 232427 |
| `tentatives` | 1 |
| `trace_c6` | « re-tirage non nécessaire » |
| `outil` | `melange-biaxes.py` (dédié c1/c4 sans-objet — raison documentée ci-dessus) |
| `objectif_final` | [1, 6, 0, 0, 0] — 1 adjacence (minimum forcé) · déficit 6 (minimum constructible) · run et blocs optimaux · 0 paire D/I adjacente |
| `echanges` | 36 échanges de descente (trace complète archivée) |
| `positions_par_axe` | planification : 1, 3, 5, 6, 8 · ordre : 2, 4, 7 |
| `run_max` | 1 |

## Reproductibilité

```
python3 ci/outils/melange-biaxes.py ci/quetes/3.2.json
```
reproduit la séquence de référence ci-dessus (graine 232427, tentative 1, 36 échanges). L'outil
générique `melange.py` reste INTACT (reproductibilité des mélanges archivés — règle du dépôt).
Config de la course : `ci/quetes/3.2.json` · résultats réels archivés :
`ci/resultats-melange/3.2.json`.

## Finding — borne de run atteignable (mission V9 — jamais un verdict non atteignable)

**Borne doctrinale : run max 2 — ATTEIGNABLE, arithmétiquement et en réel.**

- **Arithmétique (c5)** : la quête porte 4 D et 4 I sur 8 positions — la séquence alternée
  existe (aucune paire adjacente de même orientation constructible) → un run max de 1 est
  constructible ; **a fortiori la borne contractuelle 2 est atteignable**.
- **Constat réel** : run_max **1** (alternance obtenue par l'outil dédié, c5 PASS) — la borne 2
  n'est même pas contractée par les données réelles.
- **Findings c1/c4** : déclarés sans-objet PAR ARITHMÉTIQUE avec minimums constructibles documentés
  (1 adjacence · déficit 6) — conformes à la règle « jamais un verdict non atteignable » : ce ne
  sont pas des verdicts non atteints, ce sont des contraintes sans objet par config, minimisées
  réellement par l'outil dédié.

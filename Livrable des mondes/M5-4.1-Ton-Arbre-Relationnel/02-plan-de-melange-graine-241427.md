# LIVRABLE 2 — PLAN DE MÉLANGE (graine réelle 241427 — outil dédié melange-heritage.py v3)

> Résultat RÉEL de l'outil **dédié v3** `ci/outils/melange-heritage.py` (graine 241427,
> 1 tentative). **5 passes rejouées : sorties identiques octet pour octet** (empreinte unique
> `f792afe2770a13eb` — mission V10 : rejeu réel affiché).

## Graine dérivée (convention concaténée — étendue à M5)

- **Graine : 210427 (graine-mère du Socle) + 1000 × ordinal 31 = 241427.**
- Convention (doctrine mission V9, étendue V10) : ordinals en lecture CONCATÉNÉE —
  4.1 → 31 · 4.2 → 32 · 4.3 → 33 (réservé, non consommé — mélange sans-objet) ·
  4.4 → 34 (sans-objet — quête invisible, pas de passation propre).
- **Aucune collision** : 241427 n'a jamais été attribuée (ni active, ni retirée — vérifié dépôt).
- **Aucun re-tirage** : la graine 241427 est issue du premier tirage (tentative 1).

## Pourquoi l'outil DÉDIÉ v3 (finding d'outillage — consigné)

La course sous l'outil v2 (`melange-biaxes.py`) est restée **coincée en minimum local** :
objectif final [2, 6, 2, 1, 4] — c1 = 2 adjacences, run 4, cap 1200 atteint (constat réel,
archivé à l'entrée de la vague). Les paysages M5 (8+ items libres, contraintes articulées
c1 ∧ c4 ∧ c5) exigent un échappatoire plus fort. **v3** (`melange-heritage.py`) reprend la
construction v2 à l'identique (blocs uniformes, ancres c3) et ajoute : descente **plus raide
déterministe** (scan complet fixe, meilleur échange strict par itération) + **redémarrages
seedés** (perturbation shuffle par la graine, meilleur global retenu, arrêt doctrinal au
minimum constructible). La graine pilote construction, kicks et perturbations — rejeu octet
pour octet. **Les outils antérieurs restent INTACTS** (courses archivées 3.2/3.4 reproductibles).

```
GRAINE .................. 241427 (figée, reproductible)
OUTIL ................... ci/outils/melange-heritage.py v3 (dédié série M5)
ALGORITHME .............. Fisher-Yates seedé + ancres c3 + descente raide
                          déterministe + redémarrages seedés (12 max, arrêt doctrinal)
ORDRE DE PASSATION ...... la séquence ci-dessous (JAMAIS l'ordre des codes)
PARTICULARITÉS .......... 8 carte (2 axes 4/4) + 2 trames ▲ FIS hébergées (bloc 4.4) ancrées 5·10
                          c1 stricte PASS · c4 sans-objet PAR ARITHMÉTIQUE (minimum 4, ATTEINT)
                          c5 run max 2 PASS · c6 PASS
```

## Séquence d'ordre de passation (artefact de référence — réel)

| Pos | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| Code | **05** | 02 | **07** | 04 | **T13** | 06 | 03 | 08 | 01 | **T14** |
| Axe | loyautés | climat | loyautés | climat | ▲ FIS | loyautés | climat | loyautés | climat | ▲ FIS |
| Or. | D | I | D | I | D | I | D | I | D | D |

Rappel : les codes sont gelés et définitifs ; l'ordre de **passation** est celui du plan de
mélange, jamais l'ordre des codes. Ici le 1ᵉʳ item vu est Q4.1-05 (le rôle tenu), le dernier
est Q4.4-T14 (trame hébergée). **Les trames occupent les positions 5 · 10** — ancrées par
construction (c3), jamais déplacées sans Fiche de Mutation. **Positions par axe (réel)** :
climat {2, 4, 7, 9} · loyautés {1, 3, 6, 8}.

## Table de vérification (6 contraintes — verdicts RÉELS)

| Contrainte | Verdict | Détail |
|---|---|---|
| c1 — aucune dimension consécutive | ✅ PASS | **0 adjacence réelle** — climat et loyautés alternent strictement sur les deux chaînes libres |
| c2 — trames jamais adjacentes aux dimensions interdites | ✅ PASS | **aucune dimension interdite déclarée pour FIS** (note au 01 : le camouflage vient du thème — l'origine et l'intimité tôt liées — pas du placement) |
| c3 — 1 trame par bloc uniforme | ✅ PASS | **trames ancrées : 5 · 10** — blocs de 5 = 4 items + 1 trame (par construction) |
| c4 — distance intra-dimension ≥ 3 | ✅ PASS par déclaration (sans-objet arithmétique) | **démonstration** : c1 stricte impose l'alternance sur les chaînes libres {1-2-3-4} et {6-7-8-9} → paires intra-axe forcées (1,3)·(2,4)·(6,8)·(7,9) toutes à distance 2 → **déficit minimal 4, ATTEINT** (le pattern sans violation {1,4,7,10} tombe sur l'ancre 10) |
| c5 — alternance D/I (run max 2) | ✅ PASS | run max réel : **2** — les 6 D (4 carte + 2 trames) restent séparés par les 4 I |
| c6 — ordre de passation ≠ ordre des codes | ✅ PASS | le 1ᵉʳ item vu est Q4.1-05 ≠ 01, 02… |

## Trace de course (réelle)

| Champ | Valeur réelle |
|---|---|
| `graine_finale` | 241427 |
| `tentatives` | 1 |
| `trace_c6` | « re-tirage non nécessaire » |
| `outil` | `melange-heritage.py` v3 (dédié série M5 — raison documentée ci-dessus) |
| `redemarrages_utilises` | 12 (arrêt doctrinal — minimums constructibles atteints) |
| `objectif_final` | [0, 4, 0, 0, 1] — 0 adjacence (c1 stricte) · déficit c4 = 4 (minimum constructible, ATTEINT) · run et blocs optimaux · 1 paire D/I adjacente (composante douce — minimum arithmétique : 6 D / 4 I sur 10 positions avec ancres D en 5·10 imposent ≥ 1 paire) |
| `echanges` | trace complète archivée (`ci/resultats-melange/4.1.json`) |
| `positions_par_axe` | climat : 2, 4, 7, 9 · loyautés : 1, 3, 6, 8 |
| `positions_trames` | [5, 10] |
| `run_max` | 2 |

## Reproductibilité

```
python3 ci/outils/melange-heritage.py ci/quetes/4.1.json
```

reproduit la séquence de référence ci-dessus (graine 241427, tentative 1, 12 redémarrages).
**5 passes rejouées : sorties identiques octet pour octet** (empreinte unique). Les outils
générique (`melange.py`) et biaxes (`melange-biaxes.py`) restent INTACTS. Config de la course :
`ci/quetes/4.1.json` · résultats réels archivés : `ci/resultats-melange/4.1.json`.

## Finding — minimum constructible c4 (mission V10 — jamais un verdict non atteignable)

- **Arithmétique** : 8 positions libres {1,2,3,4,6,7,8,9} (ancres 5·10) pour 4 + 4 items
  d'axes. Le pattern c4-sans-violation exigerait {1,4,7,10} par axe (span 10) — la position 10
  est une ancre → **infaisable strict**. Sous c1 stricte (alternance des chaînes), les paires
  (1,3)·(2,4)·(6,8)·(7,9) sont forcées à distance 2 → **déficit minimal 4**.
- **Constat réel** : déficit **4 = minimum constructible, ATTEINT** — conforme à la règle
  « jamais un verdict non atteignable » : la contrainte est sans objet par config, minimisée
  réellement et démontrée par placement (climat {2,4,7,9} · loyautés {1,3,6,8}).

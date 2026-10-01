# LIVRABLE 2 — PLAN DE MÉLANGE (graine réelle 271427 — outil générique melange.py)

> Résultat RÉEL de l'outil générique `ci/outils/melange.py` (graine 271427, 1 tentative).
> **3 passes rejouées : sorties identiques octet pour octet** (empreinte unique
> `ca3e890c40ad9fc7e9b15b16e61ebf14`).

## Graine dérivée (convention concaténée)

- **Graine : 210427 (graine-mère du Socle) + 1000 × ordinal 61 = 271427.**
- Convention (doctrine mission V9, étendue V10 → V15) : ordinals en lecture CONCATÉNÉE —
  quête 7.1 → (7−1)×10+1 = **61** (calcul documenté comme à l'exemplaire 5.2 : (5−1)×10+2 = 42).
- **Aucun re-tirage** : la graine 271427 est issue du premier tirage (tentative 1,
  `trace_c6` : « re-tirage non nécessaire »).

## Statut de la config — CRÉÉE (note de passation)

> ✅ **La config canonique `ci/quetes/7.1.json` a été créée avec le dossier par la session V15.A**
> (8 items Q7.1-01 → Q7.1-08, orientations et dimensions du tableau 01, graine 271427,
> `c4_note` adaptée). La course documentée ci-dessous a été exécutée RÉELLEMENT contre cette
> config (**3 passes**), et le résultat est archivé à `ci/resultats-melange/7.1.json`
> (forme identique à l'archive du précédent 5.2).

```
GRAINE .................. 271427 (dérivée par convention concaténée — reproductible)
OUTIL ................... ci/outils/melange.py (générique — aucune trame, pas d'outil dédié requis)
ALGORITHME .............. Fisher-Yates seedé + réparation déterministe (hill-climbing seedé)
ORDRE DE PASSATION ...... la séquence ci-dessous (aucun rapport avec l'ordre des codes)
PARTICULARITÉS .......... 8 items (4 axes × 2, 1 paire R6 par axe) — AUCUNE trame hébergée
                          c1 PASS (0 adjacence) · c2/c3 sans-objet (0 trame) · c4 PASS (0 déficit)
                          c5 PASS (run max 2) · c6 PASS
```

## Séquence d'ordre de passation (artefact de référence — réel)

| Pos | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Code | **03** | **06** | **07** | **02** | **05** | **08** | **04** | **01** |
| Axe | transmission | famille | traditions | quotidien | famille | traditions | transmission | quotidien |
| Or. | D | I | D | I | D | I | I | D |

Rappel : les codes sont gelés et définitifs ; l'ordre de **passation** est celui du plan de
mélange, autre que l'ordre des codes. Ici le 1ᵉʳ item vu est Q7.1-03 (le goût de transmettre),
le dernier est Q7.1-01 (l'omniprésence). **Positions par axe (réel)** :
quotidien {4, 8} · transmission {1, 7} · famille {2, 5} · traditions {3, 6}.

## Table de vérification (6 contraintes — verdicts RÉELS des 3 passes)

| Contrainte | Verdict | Détail |
|---|---|---|
| c1 — aucune dimension consécutive | ✅ PASS | **0 adjacence réelle** — les 4 axes alternent sans paire consécutive sur les 8 positions |
| c2 — trames hors des dimensions interdites (aucune adjacence) | ✅ PASS sans-objet | **0 trame hébergée** — 7.1 est une quête 100 % carte (M10 n'héberge aucune trame) |
| c3 — 1 trame par bloc uniforme | ✅ PASS sans-objet | 0 trame — aucune position ancrée |
| c4 — distance intra-dimension ≥ 3 | ✅ PASS | **0 déficit** — paires intra-axe toutes à distance ≥ 3 : quotidien 4↔8 (4) · transmission 1↔7 (6) · famille 2↔5 (3) · traditions 3↔6 (3) |
| c5 — alternance D/I (run max 2) | ✅ PASS | run max réel : **2** (positions 6-7) — 4 D / 4 I équilibrés |
| c6 — ordre de passation ≠ ordre des codes | ✅ PASS | le 1ᵉʳ item vu est Q7.1-03 ≠ 01, 02… |

## Trace de course (réelle)

| Champ | Valeur réelle |
|---|---|
| `graine_finale` | 271427 |
| `tentatives` | 1 |
| `trace_c6` | « re-tirage non nécessaire » |
| `outil` | `melange.py` (générique — 8 items carte, aucune trame, aucune ancre) |
| `objectif_final` | [0, 0, 0, 0, 0, 1] — 0 adjacence (c1) · 0 c2 · 0 déficit (c4) · 0 dépassement de run · 0 bloc long · **1 paire de même orientation adjacente = composante douce** (positions 6-7 : 08×04 — minimum arithmétique courant) |
| `echanges` | 2 échanges — trace complète : `pos 4 ↔ pos 6 · (0, 0, 3, 1, 1, 3) → (0, 0, 1, 0, 0, 1)` · `pos 5 ↔ pos 6 · (0, 0, 1, 0, 0, 1) → (0, 0, 0, 0, 0, 1)` (archivé : `ci/resultats-melange/7.1.json`) |
| `positions_par_axe` | quotidien : 4, 8 · transmission : 1, 7 · famille : 2, 5 · traditions : 3, 6 |
| `positions_trames` | [] (aucune trame) |
| `run_max` | 2 |
| `empreinte` | `ca3e890c40ad9fc7e9b15b16e61ebf14` — **3 passes : sorties identiques octet pour octet** |

## Reproductibilité

```
python3 ci/outils/melange.py ci/quetes/7.1.json
```

reproduit la séquence de référence ci-dessus (graine 271427, tentative 1) — **3 passes
rejouées : sorties identiques octet pour octet** (empreinte unique ci-dessus).

## Finding — composante douce identique au précédent 5.2 (constat mesuré, consigné)

- L'objectif final `[0, 0, 0, 0, 0, 1]` reproduit **exactement** celui du précédent 5.2 :
  **1 paire de même orientation adjacente** (positions 6-7 : Q7.1-08 × Q7.1-04, deux I) —
  « composante douce » acceptable, documentée comme minimum arithmétique courant au 02 de 5.2.
- Les verdicts c1-c6 sont tous PASS dès le premier tirage (tentative 1, 2 échanges de
  réparation, run max 2) — aucune contrainte infaisable, aucune dérogation.
- Lecture : la structure 4 axes × 2 (1 D + 1 I par paire) admet un calendrier à 0 adjacence
  et 0 déficit avec une seule paire douce — continuité de gabarit entre quêtes Likert 4×2,
  à consigner au comité.

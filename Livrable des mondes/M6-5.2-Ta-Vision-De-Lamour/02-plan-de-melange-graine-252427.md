# LIVRABLE 2 — PLAN DE MÉLANGE (graine réelle 252427 — outil générique melange.py)

> Résultat RÉEL de l'outil générique `ci/outils/melange.py` (graine 252427, 1 tentative).
> **5 passes rejouées : sorties identiques octet pour octet** (empreinte unique
> `1071cc9a573c6c85d53fba2190fb8040` — **identique à l'enregistrement V11 du worklog, Task 21** :
> le plan de mélange dépend des codes, orientations et dimensions — pas des énoncés perdus —
> la structure reconstruite est donc fidèle à la 1ʳᵉ génération, constat mesuré et consigné).

## Graine dérivée (convention concaténée)

- **Graine : 210427 (graine-mère du Socle) + 1000 × ordinal 42 = 252427.**
- Convention (doctrine mission V9, étendue V10/V11) : ordinals en lecture CONCATÉNÉE —
  quête 5.2 → (5−1)×10+2 = **42**.
- **Graine gelée V11 re-prise à l'identique** (spécification Task 21) : la 2ᵉ génération
  hérite de la graine de la 1ʳᵉ — aucun re-tirage, aucun déplacement.
- **Aucun re-tirage** : la graine 252427 est issue du premier tirage (tentative 1,
  `trace_c6` : « re-tirage non nécessaire »).

## Statut de la config — CRÉÉE (note de passation)

> ✅ **La config canonique `ci/quetes/5.2.json` a été créée par la session principale**
> (8 items Q5.2-01 → Q5.2-08, orientations et dimensions du tableau 01, graine 252427).
> La course documentée ci-dessous a été exécutée RÉELLEMENT contre cette config, et le
> résultat est archivé à `ci/resultats-melange/5.2.json`.

```
GRAINE .................. 252427 (gelée V11, re-prise à l'identique — reproductible)
OUTIL ................... ci/outils/melange.py (générique — aucune trame, pas d'outil dédié requis)
ALGORITHME .............. Fisher-Yates seedé + réparation déterministe (hill-climbing seedé)
ORDRE DE PASSATION ...... la séquence ci-dessous (JAMAIS l'ordre des codes)
PARTICULARITÉS .......... 8 carte (4 axes × 2, 1 paire R6 par axe) — AUCUNE trame hébergée
                          c1 PASS (0 adjacence) · c2/c3 sans-objet (0 trame) · c4 PASS (0 déficit)
                          c5 PASS (run max 2) · c6 PASS
```

## Séquence d'ordre de passation (artefact de référence — réel)

| Pos | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Code | **02** | **05** | **04** | **07** | **06** | **03** | **01** | **08** |
| Axe | destin | unique | foudre | idéalisation | unique | foudre | destin | idéalisation |
| Or. | I | D | I | D | I | D | D | I |

Rappel : les codes sont gelés et définitifs ; l'ordre de **passation** est celui du plan de
mélange, jamais l'ordre des codes. Ici le 1ᵉʳ item vu est Q5.2-02 (la construction), le
dernier est Q5.2-08 (le réel qui suffit). **Positions par axe (réel)** :
destin {1, 7} · unique {2, 5} · foudre {3, 6} · idéalisation {4, 8}.

## Table de vérification (6 contraintes — verdicts RÉELS)

| Contrainte | Verdict | Détail |
|---|---|---|
| c1 — aucune dimension consécutive | ✅ PASS | **0 adjacence réelle** — les 4 axes alternent sans paire consécutive sur les 8 positions |
| c2 — trames jamais adjacentes aux dimensions interdites | ✅ PASS sans-objet | **0 trame hébergée** — 5.2 est une quête 100 % carte (concepts publics, aucun contenu signal ▲) |
| c3 — 1 trame par bloc uniforme | ✅ PASS sans-objet | 0 trame — aucune position ancrée |
| c4 — distance intra-dimension ≥ 3 | ✅ PASS | **0 déficit** — paires intra-axe toutes à distance ≥ 3 : destin 1↔7 (6) · unique 2↔5 (3) · foudre 3↔6 (3) · idéalisation 4↔8 (4) |
| c5 — alternance D/I (run max 2) | ✅ PASS | run max réel : **2** (positions 6-7) — 4 D / 4 I équilibrés |
| c6 — ordre de passation ≠ ordre des codes | ✅ PASS | le 1ᵉʳ item vu est Q5.2-02 ≠ 01, 02… |

## Trace de course (réelle)

| Champ | Valeur réelle |
|---|---|
| `graine_finale` | 252427 |
| `tentatives` | 1 |
| `trace_c6` | « re-tirage non nécessaire » |
| `outil` | `melange.py` (générique — 8 items carte, aucune trame, aucune ancre) |
| `objectif_final` | [0, 0, 0, 0, 0, 1] — 0 adjacence (c1) · 0 c2 · 0 déficit (c4) · 0 dépassement de run · 0 bloc long · **1 paire de même orientation adjacente = composante douce** (positions 6-7 : 03×01 — minimum arithmétique courant) |
| `echanges` | 5 échanges — trace complète : `pos 3 ↔ pos 4 · pos 5 ↔ pos 1 · pos 8 ↔ pos 3 · pos 1 ↔ pos 8 · pos 4 ↔ pos 1` (archivé : `ci/resultats-melange/5.2.json`) |
| `positions_par_axe` | destin : 1, 7 · unique : 2, 5 · foudre : 3, 6 · idéalisation : 4, 8 |
| `positions_trames` | [] (aucune trame) |
| `run_max` | 2 |
| `empreinte` | `1071cc9a573c6c85d53fba2190fb8040` — **identique à l'enregistrement V11 (worklog Task 21 : « md5 a6be5bf0… / 1071cc9a… / 59527dae… / d5039ff8… », 2ᵉ position)** |

## Reproductibilité

```
python3 ci/outils/melange.py ci/quetes/5.2.json
```

reproduit la séquence de référence ci-dessus (graine 252427, tentative 1) — **5 passes
rejouées : sorties identiques octet pour octet** (empreinte unique ci-dessus).

## Finding — fidélité structurelle de la 2ᵉ génération (constat mesuré, consigné)

- L'empreinte de sortie `1071cc9a…` reproduit **exactement** celle consignée pour 5.2 à la
  vague V11 (worklog Task 21 : « md5 a6be5bf0… / **1071cc9a…** / 59527dae… / d5039ff8… »).
- Lecture : le mélange ne dépend que des codes, orientations, dimensions et de la graine —
  tous reconstruits conformément à la spécification gelée. **La structure de passation 2ᵉ
  génération est donc identique octet pour octet à celle de la 1ʳᵉ**, alors même que les
  énoncés (perdus) ont été réécrits. La reconstruction est validée par la machine, pas
  devinée — à consigner au comité comme preuve de fidélité du cadre.

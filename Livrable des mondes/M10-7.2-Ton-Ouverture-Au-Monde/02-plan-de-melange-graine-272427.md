# LIVRABLE 2 — PLAN DE MÉLANGE (graine réelle 272427 — outil générique melange.py)

> Résultat RÉEL de l'outil générique `ci/outils/melange.py` (graine 272427, 1 tentative).
> **3 passes rejouées : sorties identiques octet pour octet** (empreinte unique
> `d0118d6496bc128c3b34d5bef977b69c` — vérifiée par `md5sum` sur les 3 sorties brutes).

## Graine dérivée (convention concaténée)

- **Graine : 210427 (graine-mère du Socle) + 1000 × ordinal 62 = 272427.**
- Convention (doctrine mission V9, étendue V10/V11/V13) : ordinals en lecture CONCATÉNÉE —
  quête 7.2 → (7−1)×10+2 = **62**.
- **Aucun re-tirage** : la graine 272427 est issue du premier tirage (tentative 1,
  `trace_c6` : « re-tirage non nécessaire »).

## Note de coordination M11 (la place 272427 — réservation consommée)

> La note de réservation du plan sans-objet **8.2 (M11, Task 27-b)** citait **272427** comme
> place de décade **hypothétique** (une éventuelle déclinaison mixée de 8.2, restée sans
> objet). La vague **V15 consomme canoniquement cette place pour 7.2** (ordinal 62 —
> convention concaténée) : **zéro collision réelle** — côté 8.2, aucun tirage n'avait été
> opéré (ordre fixe scénarique, graine sans-objet, aucune config `ci/quetes/8.2.json`,
> aucune archive `ci/resultats-melange/8.2.json`). La place appartient désormais à 7.2 :
> graine gelée, empreinte archivée, conventions coexistantes sans ambiguïté.

## Statut de la config — CRÉÉE (note de passation)

> ✅ **La config canonique `ci/quetes/7.2.json` a été créée par le sous-agent V15.B (Task 28-b)**
> (8 items Q7.2-01 → Q7.2-08, orientations et dimensions du tableau 01, graine 272427).
> La course documentée ci-dessous a été exécutée RÉELLEMENT contre cette config, et le
> résultat est archivé à `ci/resultats-melange/7.2.json`.

```
GRAINE .................. 272427 (gelée V15 — reproductible)
OUTIL ................... ci/outils/melange.py (générique — aucune trame, 4 axes × 2)
ALGORITHME .............. Fisher-Yates seedé + réparation déterministe (hill-climbing seedé)
ORDRE DE PASSATION ...... la séquence ci-dessous (hors ordre des codes)
PARTICULARITÉS .......... 8 items (4 axes × 2, 1 paire R6 par axe) — AUCUNE trame hébergée
                          c1 PASS (0 adjacence) · c2/c3 sans-objet (0 trame) · c4 PASS (0 déficit)
                          c5 PASS (run max 2) · c6 PASS
```

## Séquence d'ordre de passation (artefact de référence — réel)

| Pos | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Code | **01** | **04** | **05** | **08** | **02** | **03** | **07** | **06** |
| Axe | énergie | apprentissage | malentendu | accueil | énergie | apprentissage | accueil | malentendu |
| Or. | D | I | D | I | I | D | D | I |

Rappel : les codes sont gelés et définitifs ; l'ordre de **passation** est celui du plan de
mélange, hors ordre des codes. Ici le 1ᵉʳ item vu est Q7.2-01 (la découverte qui nourrit), le
dernier est Q7.2-06 (le temps qui passe). **Positions par axe (réel)** :
énergie {1, 5} · apprentissage {2, 6} · malentendu {3, 8} · accueil {4, 7}.

## Table de vérification (6 contraintes — verdicts RÉELS)

| Contrainte | Verdict | Détail |
|---|---|---|
| c1 — aucune dimension consécutive | ✅ PASS | **0 adjacence réelle** — les 4 axes alternent sans paire consécutive sur les 8 positions |
| c2 — aucune trame adjacente aux dimensions interdites | ✅ PASS sans-objet | **0 trame hébergée** — 7.2 est une quête 100 % carte (aucun contenu signal ▲) |
| c3 — 1 trame par bloc uniforme | ✅ PASS sans-objet | 0 trame — aucune position ancrée |
| c4 — distance intra-dimension ≥ 3 | ✅ PASS | **0 déficit** — paires intra-axe toutes à distance ≥ 3 : énergie 1↔5 (4) · apprentissage 2↔6 (4) · malentendu 3↔8 (5) · accueil 4↔7 (3) |
| c5 — alternance D/I (run max 2) | ✅ PASS | run max réel : **2** (positions 4-5 · positions 6-7) — 4 D / 4 I équilibrés |
| c6 — ordre de passation ≠ ordre des codes | ✅ PASS | la séquence 01·04·05·08·02·03·07·06 ≠ 01, 02, …, 08 |

## Trace de course (réelle)

| Champ | Valeur réelle |
|---|---|
| `graine_finale` | 272427 |
| `tentatives` | 1 |
| `trace_c6` | « re-tirage non nécessaire » |
| `outil` | `melange.py` (générique — 8 items carte, aucune trame, aucune ancre) |
| `objectif_final` | [0, 0, 0, 0, 0, 2] — 0 adjacence (c1) · 0 c2 · 0 déficit (c4) · 0 dépassement de run · 0 bloc long · **2 paires de même orientation adjacentes = composante douce** (positions 4-5 : 08×02 · positions 6-7 : 03×07 — minimum arithmétique courant, précédent 5.2) |
| `echanges` | 2 échanges — trace complète : `pos 8 ↔ pos 6 · (1, 0, 1, 0, 0, 4) → (1, 0, 1, 0, 0, 3)` puis `pos 1 ↔ pos 4 · (1, 0, 1, 0, 0, 3) → (0, 0, 0, 0, 0, 2)` (archivé : `ci/resultats-melange/7.2.json`) |
| `positions_par_axe` | énergie : 1, 5 · apprentissage : 2, 6 · malentendu : 3, 8 · accueil : 4, 7 |
| `positions_trames` | [] (aucune trame) |
| `run_max` | 2 |
| `empreinte` | `d0118d6496bc128c3b34d5bef977b69c` — **identique sur les 3 passes** |

## Reproductibilité

```
python3 ci/outils/melange.py ci/quetes/7.2.json
```

reproduit la séquence de référence ci-dessus (graine 272427, tentative 1) — **3 passes
rejouées : sorties identiques octet pour octet** (empreinte unique ci-dessus, archive
`ci/resultats-melange/7.2.json` incluse dans la vérification).

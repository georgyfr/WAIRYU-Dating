# LIVRABLE 2 — PLAN DE MÉLANGE (graine réelle 233427)

> Résultat RÉEL de l'outil `ci/outils/melange.py` (graine 233427, 1 tentative, 2 échanges de
> réparation). Rejeu indépendant vérifié à l'identique — **5 passes rejouées : sorties identiques
> octet pour octet** (mission V9 : 5 passes, rejeu réel affiché).

## Graine dérivée (convention mission V9 — lecture concaténée)

- **Graine : 210427 (graine-mère du Socle) + 1000 × ordinal 23 = 233427.**
- Convention (doctrine mission V9) : ordinals en lecture CONCATÉNÉE de la quête — 3.1 → 21 ·
  3.2 → 22 · 3.3 → 23 · 3.4 → 24 · 3.5 → 25 · 3.6 → 26 · 3.7 → 27 (série M4 complète).
- **Aucune collision** : 233427 n'a jamais été attribuée (les retraites concernent 232427 et
  237427 — respectivement pour 3.2 et 3.7, avec notes de provenance aux plans concernés).
- **Aucun re-tirage** : la graine 233427 est issue du premier tirage (tentative 1).

```
GRAINE .................. 233427 (figée, reproductible)
ALGORITHME .............. Fisher-Yates seedé sur [Q3.3-01 … Q3.3-T12]
                          + réparation déterministe (hill-climbing seedé)
ORDRE DE PASSATION ...... la séquence ci-dessous (JAMAIS l'ordre des codes)
PARTICULARITÉS .......... 12 items : 8 carte (2 volets) + 4 trames ▲ CSR (dimension null)
                          c1/c4 actifs (2 dimensions carte) · c2 actif (aucune
                          dimension interdite déclarée — note au 01) · c3 actif
                          (trames ancrées en fin de bloc uniforme) · c5/c6 actifs
```

## Séquence d'ordre de passation (artefact de référence — réel)

| Pos | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Code | 05 | 04 | **T09** | 07 | 02 | **T10** | 08 | 01 | **T11** | 06 | 03 | **T12** |

Rappel : les codes sont gelés et définitifs ; l'ordre de **passation** est celui du plan de mélange,
jamais l'ordre des codes. Ici le 1ᵉʳ item vu est Q3.3-05 (l'activité de fond), le dernier est
Q3.3-T12 (trame travail-refuge). **Les trames occupent les positions 3 · 6 · 9 · 12** — ancrées
par construction (1 trame en fin de chaque bloc uniforme de 3, contrainte c3), jamais déplacées
sans Fiche de Mutation.

## Table de vérification (6 contraintes — verdicts RÉELS)

| Contrainte | Verdict | Détail |
|---|---|---|
| c1 — aucune dimension consécutive | ✅ PASS | les volets mode/fond jamais adjacents à eux-mêmes dans la séquence réelle (les trames sont hors dimensions) |
| c2 — trames jamais adjacentes aux dimensions interdites | ✅ PASS | **aucune dimension interdite déclarée pour le signal CSR** (note au 01 : le déguisement vient du thème, pas du placement) — la contrainte est satisfaite par construction |
| c3 — 1 trame par bloc uniforme | ✅ PASS | **trames ancrées : 3 · 6 · 9 · 12** — un bloc de 3 = 2 items carte + 1 trame (par construction de l'outil) |
| c4 — distance intra-dimension ≥ 3 | ✅ PASS | mode : distances réelles ≥ 3 (vérifié machine) · fond : idem — chaque paire de même angle distante d'au moins 3 positions |
| c5 — alternance D/I (run max 2) | ✅ PASS | run max réel : **2** — la borne contractuelle est atteinte au maximum autorisé (les 4 trames D participent à l'alternance) |
| c6 — ordre de passation ≠ ordre des codes | ✅ PASS | le 1ᵉʳ item vu est Q3.3-05, le 2ᵉ Q3.3-04 ≠ 01, 02… |

## Trace de course (réelle)

| Champ | Valeur réelle |
|---|---|
| `graine_finale` | 233427 |
| `tentatives` | 1 |
| `trace_c6` | « re-tirage non nécessaire » |
| `objectif_final` | [0, 0, 0, 0, 0, 3] — les 5 composantes dures optimales · 3 paires adjacentes D/I (composante douce) |
| `echanges` | 2 échanges de réparation (trace complète archivée) |
| `positions_trames` | [3, 6, 9, 12] |
| `run_max` | 2 |

## Reproductibilité

```
python3 ci/outils/melange.py ci/quetes/3.3.json
```
reproduit la séquence de référence ci-dessus (graine 233427, tentative 1, 2 échanges). Le validateur
(linter) rejoue les verdicts sur toute régénération et refuse toute sortie divergente sans Fiche de
Mutation documentée. Config de la course : `ci/quetes/3.3.json` · résultats réels archivés :
`ci/resultats-melange/3.3.json`.

## Finding — borne de run atteignable (mission V9 — jamais un verdict non atteignable)

**Borne doctrinale : run max 2 — ATTEIGNABLE, arithmétiquement et en réel.**

- **Arithmétique (c5)** : 8 D (4 carte D + 4 trames D) et 4 I sur 12 positions — une alternance
  sous run ≤ 2 est constructible (par ex. D·I·D·I·D·I·D·I·D·D·D·D restructurée : les 4 I
  séparent les 8 D en blocs ≤ 2 — démonstration par placement : I en 2, 4, 6, 8 avec D ailleurs
  donne des runs D de 1 au plus... a fortiori la borne 2) ; **la borne contractuelle 2 est
  atteignable**.
- **Constat réel** : run_max **2** (c5 PASS) — la borne est ATTEINTE au maximum autorisé, jamais
  dépassée. **Aucun verdict non atteignable n'est documenté** (règle gravée).
- **c3 par construction** : avec 12 items et 4 trames, l'outil découpe 4 blocs uniformes de 3
  (2 carte + 1 trame) — l'ancrage des trames en fin de bloc est structurel (pas un hasard du
  tirage) : les positions 3·6·9·12 sont stables pour toute graine de cette config.

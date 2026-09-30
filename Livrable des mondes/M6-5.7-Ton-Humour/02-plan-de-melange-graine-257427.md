# LIVRABLE 2 — PLAN DE MÉLANGE (graine 257427 — outil générique melange.py)

> **Statut de cette course (2ᵉ génération — consigné honnêtement)** : la config V11
> (`ci/quetes/5.7.json`) et son archive (`ci/resultats-melange/5.7.json`) ont été **PERDUES au
> reset du bac à sable** (worklog Task 22). Le contenu de la config est **déterminé par la table
> des items du 01** (codes · orientations · dimensions). **La config a été CRÉÉE par la session
> principale** (contenu exact ci-dessous) et la **course canonique a été exécutée d'après dépôt** :
> verdicts 6/6, tentative 1, 5 passes identiques octet pour octet — et la séquence du dépôt
> reproduit **à l'identique** la pré-validation hors dépôt du sous-agent (même config, même outil,
> même graine). Archive créée : `ci/resultats-melange/5.7.json`.
> ⚠ **Divergence d'empreinte consignée** : l'empreinte 2ᵉ génération
> (`6425e597bbd13fc8e993f80e4342c214`) ne reproduit PAS celle de la 1ʳᵉ génération V11
> (`d5039ff8…`, worklog Task 21) — les orientations attribuées à la table 01 par la 2ᵉ génération
> diffèrent des orientations perdues de la 1ʳᵉ. Contrairement à 5.1/5.2/5.3 (empreintes V11
> reproduites octet pour octet — preuves de fidélité du cadre), la structure de passation 5.7 de
> la 1ʳᵉ génération n'est pas récupérable : **la course réelle 2ᵉ génération fait foi** (6/6 PASS,
> tentative 1, reproductible — aucun verdict déclaré non atteint). Divergence à consigner au
> comité.

## Graine dérivée (convention concaténée — décade M6)

- **Graine : 210427 (graine-mère du Socle) + 1000 × ordinal 47 = 257427.**
- Convention (doctrine mission V9-V11) : ordinal en lecture CONCATÉNÉE `(a−1)×10+b` —
  **5.7 → 47** ; décade M6 = 40 (5.1 → 41 · 5.2 → 42 · 5.3 → 43) ; **ordinals 44/45/46 réservés
  V12** (5.4 · 5.5 · 5.6 — hébergement des trames ▲). Cohérence de chaîne vérifiée :
  3.1 → 21 · 4.1 → 31 (210427 + 41 000 = 251427 pour 5.1 ✓).
- **Aucune collision** : 257427 jamais attribuée (vérifié dépôt — la config V11 étant perdue, la
  graine est ré-attribuée à l'identique depuis la règle, pas depuis la mémoire).
- **Aucun re-tirage** : la graine 257427 est issue du premier tirage (tentative 1).

## Pourquoi l'outil GÉNÉRIQUE (finding V11 re-consigné)

Aucune trame dans cette passation (12/12 items carte — verrou capital 00-README) et une structure
régulière 4 dimensions × 3 items : **l'outil générique `melange.py` suffit**. Les outils dédiés
(`melange-biaxes.py`, `melange-heritage.py`) restent INTACTS — précédent 5.1 (18 items, 6×3, même
finding). C2/C3 sont **sans-objet par nature** (zéro trame → aucune adjacence interdite, aucun bloc
à ancrer).

## Config canonique (déterminée par le 01 — CRÉÉE en `ci/quetes/5.7.json`)

```json
{
  "quete": "5.7",
  "titre": "Ton humour",
  "graine": 257427,
  "c2_note": "sans-objet — zéro trame hébergée par 5.7 (l'humour tranchant du cadre public est mesuré par les items carte ; les trames ▲ du bloc humour agressif vivent à la quête 5.4, phase V12)",
  "c4_note": "faisabilité démontrée — 3 items par style sur 12 positions admettent un placement à distance ≥ 3 (pattern de démonstration V11 : {1,4,9} / {2,7,12} / {3,6,10} / {5,8,11})",
  "items": [
    { "code": "Q5.7-01", "orientation": "D", "dimension": "affil" },
    { "code": "Q5.7-02", "orientation": "I", "dimension": "affil" },
    { "code": "Q5.7-03", "orientation": "D", "dimension": "affil" },
    { "code": "Q5.7-04", "orientation": "D", "dimension": "gaie" },
    { "code": "Q5.7-05", "orientation": "I", "dimension": "gaie" },
    { "code": "Q5.7-06", "orientation": "I", "dimension": "gaie" },
    { "code": "Q5.7-07", "orientation": "D", "dimension": "agres" },
    { "code": "Q5.7-08", "orientation": "I", "dimension": "agres" },
    { "code": "Q5.7-09", "orientation": "D", "dimension": "agres" },
    { "code": "Q5.7-10", "orientation": "D", "dimension": "degrad" },
    { "code": "Q5.7-11", "orientation": "I", "dimension": "degrad" },
    { "code": "Q5.7-12", "orientation": "I", "dimension": "degrad" }
  ],
  "c1_min_constructible": 0,
  "c4_min_constructible": 0
}
```

## Séquence d'ordre de passation (course canonique d'après dépôt — identique à la pré-validation)

| Pos | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Code | **12** | 03 | **08** | 04 | **02** | 09 | **05** | 10 | **01** | 06 | **07** | 11 |
| Style (moteur) | degrad | affil | agres | gaie | affil | agres | gaie | degrad | affil | gaie | agres | degrad |
| Or. | I | D | I | D | I | D | I | D | **D** | I | D | I |

Rappel : les codes sont gelés et définitifs ; l'ordre de **passation** est celui du plan de
mélange, jamais l'ordre des codes. Ici le 1ᵉʳ item vu est Q5.7-12 (la faille dite sérieusement),
le dernier est Q5.7-11 (la faille gardée). **Positions par style (réel)** : affil {2, 5, 9} ·
gaie {4, 7, 10} · agres {3, 6, 11} · degrad {1, 8, 12}. La seule paire D/D adjacente (positions
8-9 : Q5.7-10 · Q5.7-01) est la **composante douce** documentée au c5.

## Table de vérification (6 contraintes — verdicts RÉELS, course canonique)

| Contrainte | Verdict | Détail |
|---|---|---|
| c1 — aucune dimension consécutive | ✅ PASS | **0 adjacence réelle** — les 4 styles alternent sur toute la chaîne (11 paires adjacentes, aucune répétition de style) |
| c2 — trames jamais adjacentes aux dimensions interdites | ✅ PASS sans-objet | **zéro trame hébergée par 5.7** (verrou capital — aucune dimension interdite à déclarer) |
| c3 — 1 trame par bloc uniforme | ✅ PASS sans-objet | aucun bloc trame — 12 items carte |
| c4 — distance intra-dimension ≥ 3 | ✅ PASS | **déficit 0 (minimum constructible atteint)** — distances réelles : affil {2,5,9} = 3·4·7 · gaie {4,7,10} = 3·3·6 · agres {3,6,11} = 3·5·8 · degrad {1,8,12} = 7·4·11 — toutes ≥ 3 |
| c5 — alternance D/I (run max 2) | ✅ PASS | run max réel : **2** — 6 D / 6 I équilibrés ; 1 paire D/D adjacente (composante douce — minimum arithmétique documenté à l'objectif) |
| c6 — ordre de passation ≠ ordre des codes | ✅ PASS | le 1ᵉʳ item vu est Q5.7-12 ≠ 01 · 02… — re-tirage non nécessaire |

## Trace de course (canonique — archivée `ci/resultats-melange/5.7.json`)

| Champ | Valeur |
|---|---|
| `graine_finale` | 257427 |
| `tentatives` | 1 |
| `trace_c6` | « re-tirage non nécessaire » |
| `outil` | `ci/outils/melange.py` (générique — raison : zéro trame, 4 dimensions × 3, finding V11 re-consigné) |
| `objectif_final` | [0, 0, 0, 0, 0, 1] — 0 adjacence (c1) · 0 violation c2 · 0 déficit c4 · 0 dépassement de run · 0 bloc long · **1 paire D/I adjacente (composante douce)** |
| `echanges` | 10 échanges de réparation (trace complète ci-dessous) |
| `positions_par_style` | affil : 2, 5, 9 · gaie : 4, 7, 10 · agres : 3, 6, 11 · degrad : 1, 8, 12 |
| `positions_trames` | [] (sans-objet) |
| `run_max` | 2 |

Trace des échanges (réparation déterministe — lecture : `objectif avant → objectif après`) :

```
pos 1 ↔ pos 10 · (1, 0, 4, 0, 0, 4) → (0, 0, 3, 1, 1, 5)
pos 12 ↔ pos 11 · (0, 0, 3, 1, 1, 5) → (0, 0, 3, 1, 1, 4)
pos 9 ↔ pos 12 · (0, 0, 3, 1, 1, 4) → (0, 0, 2, 3, 2, 7)
pos 2 ↔ pos 5 · (0, 0, 2, 3, 2, 7) → (0, 0, 2, 2, 1, 5)
pos 3 ↔ pos 8 · (0, 0, 2, 2, 1, 5) → (0, 0, 2, 1, 1, 5)
pos 7 ↔ pos 6 · (0, 0, 2, 1, 1, 5) → (0, 0, 1, 1, 1, 5)
pos 6 ↔ pos 8 · (0, 0, 1, 1, 1, 5) → (0, 0, 0, 3, 3, 7)
pos 10 ↔ pos 6 · (0, 0, 0, 3, 3, 7) → (0, 0, 0, 2, 2, 5)
pos 3 ↔ pos 10 · (0, 0, 0, 2, 2, 5) → (0, 0, 0, 1, 1, 3)
pos 10 ↔ pos 11 · (0, 0, 0, 1, 1, 3) → (0, 0, 0, 0, 0, 1)
```

## Reproductibilité

```
python3 ci/outils/melange.py ci/quetes/5.7.json
```

reproduit la séquence de référence ci-dessus (config canonique en place, outil déterministe).
**5 passes rejouées : sorties identiques octet pour octet** (empreinte unique
`6425e597bbd13fc8e993f80e4342c214`). Archive créée : `ci/resultats-melange/5.7.json`. Les
outils `melange-biaxes.py` et `melange-heritage.py` restent INTACTS.

## Finding — faisabilité c4 sans re-tirage

- **Arithmétique** : 3 items par style × 4 styles sur 12 positions — chaque style admet un
  placement à distance ≥ 3 (démonstration V11 : pattern {1,4,9}/{2,7,12}/{3,6,10}/{5,8,11} ;
  atteint ici par un pattern distinct : affil {2,5,9} · gaie {4,7,10} · agres {3,6,11} ·
  degrad {1,8,12}).
- **Constat réel** : déficit **0 = minimum constructible, ATTEINT** dès la tentative 1 — conforme
  à la règle « jamais un verdict non atteignable ». Aucun minimum local constaté (10 échanges,
  convergence propre).

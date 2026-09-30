# LIVRABLE 2 — PLAN DE MÉLANGE (graine réelle 251427 — outil générique melange.py)

> Résultat RÉEL de l'outil générique `ci/outils/melange.py` (graine 251427, 1 tentative).
> **5 passes rejouées : sorties identiques octet pour octet** (empreinte unique
> `a6be5bf02eb292a766d907be1d8ffe7c` — **identique à l'enregistrement V11 du worklog, Task 21** :
> le plan de mélange dépend des codes, orientations et dimensions — pas des énoncés perdus —
> la structure reconstruite est donc fidèle à la 1ʳᵉ génération, constat mesuré et consigné).

## Graine dérivée (règle de décade — décade M6 = 40)

- **Graine : 210427 (graine-mère du Socle) + 1000 × ordinal 41 = 251427.**
- Ordinal = lecture décimale ((a−1)×10+b) : 5.1 → (4×10)+1 = **41**.
- Table de la vague M6 : 5.1 → 41 → **251427** · 5.2 → 42 → 252427 · 5.3 → 43 → 253427 ·
  5.4 → 44 (réservé V12) · 5.5 → 45 (réservé V12) · 5.6 → 46 (réservé V12) · 5.7 → 47 → 257427.
- Cohérence de la chaîne vérifiée sur les précédents : 3.1 → 21 · 4.1 → 31.
- **Aucune collision** : 251427 jamais attribuée au dépôt (les configs actives de `ci/quetes/`
  couvrent 23427-25427 et 211427-242427 ; 251427 absent).
- **Aucun re-tirage** : la graine 251427 est issue du premier tirage (tentative 1,
  `trace_c6` : « re-tirage non nécessaire »).

## Outillage — l'outil GÉNÉRIQUE suffit (finding d'outillage consigné V11, repris tel quel)

Aucune trame dans 5.1 (zéro signal ▲ hébergé) et structure 6 dimensions × 3 items sans ancre :
le générique `ci/outils/melange.py` suffit (finding 21-a V11 — les outils dédiés `melange-heritage.py`
v3 et `melange-biaxes.py` restent INTACTS et non consommés).

```
GRAINE .................. 251427 (gelée V11, re-prise à l'identique — reproductible)
OUTIL ................... ci/outils/melange.py (générique — aucune trame, pas d'outil dédié requis)
ALGORITHME .............. Fisher-Yates seedé + réparation déterministe (6 contraintes)
ORDRE DE PASSATION ...... la séquence ci-dessous (JAMAIS l'ordre des codes)
PARTICULARITÉS .......... 18 carte (6 façons × 3 items) — AUCUNE trame hébergée
                          c1 PASS (0 adjacence) · c2/c3 sans-objet (0 trame) · c4 PASS (0 déficit)
                          c5 PASS (run max 2) · c6 PASS
CONFIG .................. ci/quetes/5.1.json — CRÉÉE (session principale, 8ᵉ phase R V12)
ARCHIVE ................. ci/resultats-melange/5.1.json
```

## Analyse de faisabilité des 6 contraintes (pré-course)

| Contrainte | Statut | Détail |
|---|---|---|
| c1 — aucune dimension consécutive | faisable → **PASS confirmé** | 6 façons × 3 items sur 18 positions — **0 adjacence réelle** |
| c2 — trames jamais adjacentes aux dimensions interdites | **sans-objet** | aucune trame dans 5.1 — la quête n'héberge AUCUN signal ▲ (décision comité : ne JAMAIS réinventer les trames perdues T01-T42) |
| c3 — 1 trame par bloc uniforme | **sans-objet** | aucune trame → aucun bloc uniforme, aucune ancre |
| c4 — distance intra-dimension ≥ 3 | faisable → **PASS confirmé** | **0 déficit** — toutes les paires intra-façon à distance ≥ 3 (table réelle ci-dessous) |
| c5 — alternance D/I (run max 2) | faisable → **PASS confirmé** | 9 D / 9 I strictement équilibrés — **run max réel 2** |
| c6 — ordre de passation ≠ ordre des codes | **PASS confirmé** | le 1ᵉʳ item vu est Q5.1-05 ≠ 01-04 — re-tirage non nécessaire |

## Séquence d'ordre de passation (artefact de référence — réel)

| Pos | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Code | **05** | **15** | **12** | **09** | **02** | **04** | **18** | **03** | **06** | **16** | **13** | **11** | **01** | **08** | **10** | **17** | **07** | **14** |
| Façon | jeu | intensité | pragmatisme | amitié | passion | jeu | don | passion | jeu | don | intensité | pragmatisme | passion | amitié | pragmatisme | don | amitié | intensité |
| Or. | I | D | I | D | I | D | I | D | I | D | D | I | D | I | D | I | D | I |

Rappel : les codes sont gelés et définitifs ; l'ordre de **passation** est celui du plan de
mélange, jamais l'ordre des codes. Ici le 1ᵉʳ item vu est Q5.1-05 (le flirt qui cache ses
cartes), le dernier est Q5.1-14 (le calme des silences). **Positions par façon (réel)** :
jeu {1, 6, 9} · intensité {2, 11, 18} · pragmatisme {3, 12, 15} · amitié devenue amour
{4, 14, 17} · passion {5, 8, 13} · don de soi {7, 10, 16}.

## Table de vérification (6 contraintes — verdicts RÉELS)

| Contrainte | Verdict | Détail |
|---|---|---|
| c1 — aucune dimension consécutive | ✅ PASS | **0 adjacence réelle** — les 6 façons alternent sans paire consécutive sur les 18 positions |
| c2 — trames jamais adjacentes aux dimensions interdites | ✅ PASS sans-objet | **0 trame hébergée** — 5.1 est une quête 100 % carte (concepts publics, aucun contenu signal ▲) |
| c3 — 1 trame par bloc uniforme | ✅ PASS sans-objet | 0 trame — aucune position ancrée |
| c4 — distance intra-dimension ≥ 3 | ✅ PASS | **0 déficit** — distances intra-façon : jeu 5·3 · intensité 9·7 · pragmatisme 9·3 · amitié 10·3 · passion 3·5 · don 3·6 — toutes ≥ 3 |
| c5 — alternance D/I (run max 2) | ✅ PASS | run max réel : **2** (positions 10-11 : 16×13) — 9 D / 9 I équilibrés |
| c6 — ordre de passation ≠ ordre des codes | ✅ PASS | le 1ᵉʳ item vu est Q5.1-05 ≠ 01, 02… |

## Trace de course (réelle — reproduction de la 1ʳᵉ génération)

| Champ | Valeur réelle |
|---|---|
| `graine_finale` | 251427 |
| `tentatives` | 1 |
| `trace_c6` | « re-tirage non nécessaire » |
| `outil` | `melange.py` (générique — 18 items carte, aucune trame, aucune ancre) |
| `objectif_final` | [0, 0, 0, 0, 0, 1] — 0 adjacence (c1) · 0 c2 · 0 déficit (c4) · 0 dépassement de run · 0 bloc long · **1 paire de même orientation adjacente = composante douce** (positions 10-11 : 16×13 — identique à V11) |
| `echanges` | 5 échanges — trace complète : `pos 8 ↔ pos 12 · pos 16 ↔ pos 17 · pos 16 ↔ pos 18 · pos 8 ↔ pos 18 · pos 7 ↔ pos 12` (archivés : `ci/resultats-melange/5.1.json`) |
| `positions_par_façon` | jeu : 1, 6, 9 · intensité : 2, 11, 18 · pragmatisme : 3, 12, 15 · amitié : 4, 14, 17 · passion : 5, 8, 13 · don : 7, 10, 16 |
| `positions_trames` | [] (aucune trame) |
| `run_max` | 2 |
| `empreinte` | `a6be5bf02eb292a766d907be1d8ffe7c` — **identique à l'enregistrement V11 (worklog Task 21 : « md5 a6be5bf0… », 1ʳᵉ position de la table)** |

## Reproductibilité

```
python3 ci/outils/melange.py ci/quetes/5.1.json
```

reproduit la séquence de référence ci-dessus (graine 251427, tentative 1) — **5 passes
rejouées : sorties identiques octet pour octet** (empreinte unique ci-dessus).

## Finding — fidélité structurelle de la 2ᵉ génération (constat mesuré, consigné)

- L'empreinte de sortie `a6be5bf0…` reproduit **exactement** celle consignée pour 5.1 à la
  vague V11 (worklog Task 21 : « **md5 a6be5bf0…** / 1071cc9a… / 59527dae… / d5039ff8… »).
- Lecture : le mélange ne dépend que des codes, orientations, dimensions et de la graine —
  tous reconstruits conformément à la spécification gelée. **La structure de passation 2ᵉ
  génération est donc identique octet pour octet à celle de la 1ʳᵉ**, alors même que les
  énoncés (perdus) ont été réécrits. La reconstruction est validée par la machine, pas
  devinée — à consigner au comité comme preuve de fidélité du cadre.
- **État de la table M6 (constat consolidé)** : 5.1 `a6be5bf0…` ✅ reproduit · 5.2 `1071cc9a…` ✅
  reproduit · 5.3 `59527dae…` ✅ reproduit · 5.7 `d5039ff8…` ❌ non reproduit (divergence
  consignée au plan 02 de 5.7 — les orientations de la 1ʳᵉ génération 5.7 ne sont pas
  récupérables ; la course réelle 2ᵉ génération fait foi).

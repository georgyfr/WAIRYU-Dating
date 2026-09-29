# LIVRABLE 2 — PLAN DE MÉLANGE (graine documentée — résultats RÉELS)

> Les ordres et verdicts ci-dessous sont TELS QUELS du fichier de résultats réel
> `ci/resultats-melange/1.4.json` (course du 2026-09-28, outil `ci/outils/melange.py`).
> Rejeu indépendant vérifié à l'identique (byte à byte) avant rédaction de ce fichier.

```
GRAINE .................. 214427 (figée, reproductible — 1 seule tentative, aucun re-tirage)
ALGORITHME .............. Fisher-Yates seedé sur [Q1.4-01 … Q1.4-08]
                          + passe de réparation déterministe (outil générique ci/outils/melange.py)
PARTICULARITÉS .......... quête MONO-DIMENSION (autocontrole, 8/8) → c1/c4 sans-objet par config
                          AUCUNE trame ▲ → c2/c3 sans objet de fait
                          c5 sans-objet par config (mono-dimension : alternance non contrainte)
ORDRE DE PASSATION ...... la séquence ci-dessous (JAMAIS l'ordre des codes)
```

## Séquence d'ordre de passation (artefact de référence — réel)

| Pos | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Code | 03 | 08 | 07 | 06 | 05 | 04 | 02 | 01 |

Rappel : les codes sont gelés et définitifs ; l'ordre de **passation** est celui du plan de mélange,
jamais l'ordre des codes. Ici le 1ᵉʳ item vu est Q1.4-03, le dernier est Q1.4-01.

## Verdicts RÉELS (6 contraintes — 6/6 PASS)

| Contrainte | Verdict réel | Détail |
|---|---|---|
| c1 — aucune dimension consécutive | ✅ **sans-objet** (config `c1_sans_objet`) | mono-dimension : les 8 items partagent `autocontrole`, la contrainte n'a pas de sens ici |
| c2 — trames jamais adjacentes aux dimensions interdites | ✅ PASS | sans objet de fait : **0 trame ▲ dans la quête** |
| c3 — 1 trame par bloc uniforme | ✅ PASS | sans objet de fait : **0 trame ▲** — `positions_trames : []` |
| c4 — distance intra-dimension ≥ 3 | ✅ **sans-objet** (config `c4_sans_objet`) | mono-dimension — même raison que c1 |
| c5 — alternance D/I (run max) | ✅ **sans-objet** (config `c5_sans_objet` — mono-dimension, alternance non contrainte) | constat informatif (hors verdict) : la séquence réelle D-I-D-I-D-I-I-D montre un run max de 2, l'alternance naturelle du mélange |
| c6 — ordre de passation ≠ ordre des codes | ✅ PASS | le 1ᵉʳ item vu est Q1.4-03, le 2ᵉ Q1.4-08 — jamais l'ordre séquentiel |

## Trace de course (réelle)

| Champ | Valeur réelle |
|---|---|
| `graine_finale` | 214427 |
| `tentatives` | 1 |
| `trace_c6` | « re-tirage non nécessaire » |
| `objectif_final` | [0, 0, 0, 0, 0, 0] — les 6 composantes de l'objectif déjà optimales à la graine brute |
| `echanges` | **aucun** — la réparation déterministe n'a rien échangé (graine brute satisfaisante) |
| `positions_trames` | [] |
| `run_max` | 0 (non évalué — c5 sans-objet) |

## Reproductibilité

```
python3 ci/outils/melange.py ci/quetes/1.4.json
```
reproduit la séquence de référence ci-dessus. Le validateur (linter) rejoue les verdicts sur toute
régénération et refuse toute sortie divergente sans Fiche de Mutation documentée.
Config de la course : `ci/quetes/1.4.json` · résultats réels archivés : `ci/resultats-melange/1.4.json`.

## Graine dérivée (chaîne documentée — mission Phases A/B/C/D, point 2)

| Champ | Valeur |
|---|---|
| Graine mère (quête 2.1) | 210427 |
| Règle de dérivation (Mondes 1-2) | graine_mère + 1000 × ordinal de quête |
| Graine de la quête | 210427 + 1000 × 4 = **214427** |
| Statut | figée, reproductible — tout changement = Fiche de Mutation + nouvelle course documentée |

Chaîne transverse de la série : 2.1 = 210427 (mère) · 1.1 = 211427 · 1.2 = 212427 · 1.3 = 213427 ·
**1.4 = 214427** · 1.5 = sans objet (mélange sans objet — ordre canonique) · 1.6 = 216427 · 1.7 = sans
mélange (plan de passage).

## Finding — la borne de run atteignable (mission Phases A/B/C/D, point 3)

> Règle gravée : **on ne publie jamais un verdict non atteignable** — ici, aucune borne n'est
> contractée, donc aucun verdict d'atteignabilité n'est requis (pas un verdict manqué : un
> sans-objet décisionnel documenté).

| Étape | Détail |
|---|---|
| Effectifs d'orientation | 4 D / 4 I — mais quête MONO-DIMENSION (`autocontrole`, 8/8) |
| c5 (alternance D/I) | **sans-objet par config** (`c5_sans_objet: true`) : l'alternance D/I protège contre les regroupements ENTRE dimensions — sur une échelle unique, elle ne porte aucun bénéfice de mesure |
| Borne contractée | **aucune** — pas de run max exigé |
| Statut de `run_max: 0` dans l'artefact | « non mesuré » (c5 sans-objet), pas « run de longueur zéro » — même note d'honnêteté que 2.3 |
| Verdict de la course réelle | c1-c6 : 6/6 PASS (les contraintes actives toutes vérifiées — artefact ci-dessus) |

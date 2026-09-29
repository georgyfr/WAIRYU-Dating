# LIVRABLE 2 — PLAN DE MÉLANGE (graine documentée — résultats RÉELS)

> Les ordres et verdicts ci-dessous sont TELS QUELS du fichier de résultats réel
> `ci/resultats-melange/1.6.json` (course du 2026-09-28, outil `ci/outils/melange.py`).
> Rejeu indépendant vérifié à l'identique (byte à byte) avant rédaction de ce fichier.

```
GRAINE .................. 216427 (figée, reproductible — 1 seule tentative, aucun re-tirage)
ALGORITHME .............. Fisher-Yates seedé sur [Q1.6-01 … Q1.6-07]
                          + passe de réparation déterministe (outil générique ci/outils/melange.py)
PARTICULARITÉS .......... 7 items déclaratifs MONO-DIMENSION (traitement) → c1/c4 sans-objet par config
                          AUCUNE trame ▲ → c2/c3 sans objet de fait
                          LES 3 ÉNIGMES SONT HORS CONTRAT DE MÉLANGE (voir encadré)
ORDRE DE PASSATION ...... la séquence ci-dessous (JAMAIS l'ordre des codes)
```

> ⚡ **Encadré — les 3 énigmes sont HORS contrat de mélange** (items de performance, ordre source
> É1 → É2 → É3) — **FM future** : le contrat de mélange actuel porte sur des blocs d'items
> interchangeables (Likert) ; les énigmes ont une difficulté croissante assumée et un temps de
> réponse capté — leur séquencement est un choix de design, pas un aléa. Toute évolution passe par
> une Fiche de Mutation documentée.

## Séquence d'ordre de passation (artefact de référence — réel, 7 items déclaratifs)

| Pos | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|
| Code | 06 | 02 | 03 | 07 | 04 | 01 | 05 |

Rappel : les codes sont gelés et définitifs ; l'ordre de **passation** est celui du plan de mélange,
jamais l'ordre des codes. Ici le 1ᵉʳ item vu est Q1.6-06, le dernier est Q1.6-05.
Passation complète de la quête : les 7 items (mélange ci-dessus), puis les 3 énigmes en ordre
source É1 → É2 → É3.

## Verdicts RÉELS (6 contraintes — 6/6 PASS)

| Contrainte | Verdict réel | Détail |
|---|---|---|
| c1 — aucune dimension consécutive | ✅ **sans-objet** (config `c1_sans_objet`) | mono-dimension : les 7 items partagent `traitement` |
| c2 — trames jamais adjacentes aux dimensions interdites | ✅ PASS | sans objet de fait : **0 trame ▲ dans la quête** |
| c3 — 1 trame par bloc uniforme | ✅ PASS | sans objet de fait : **0 trame ▲** — `positions_trames : []` |
| c4 — distance intra-dimension ≥ 3 | ✅ **sans-objet** (config `c4_sans_objet`) | mono-dimension — même raison que c1 |
| c5 — alternance D/I (run max) | ✅ PASS | **run max = 2** (séquence réelle I-I-D-I-I-D-D) — conforme à la limite par défaut, aucun dépassement |
| c6 — ordre de passation ≠ ordre des codes | ✅ PASS | le 1ᵉʳ item vu est Q1.6-06, le 2ᵉ Q1.6-02 — jamais l'ordre séquentiel |

## Trace de course (réelle)

| Champ | Valeur réelle |
|---|---|
| `graine_finale` | 216427 |
| `tentatives` | 1 |
| `trace_c6` | « re-tirage non nécessaire » |
| `objectif_final` | [0, 0, 0, 0, 0, 3] — les 5 composantes dures à zéro ; la 6ᵉ (paires adjacentes de même orientation, composante souple de l'objectif de descente) vaut 3 — sans effet sur le verdict, run max 2 respecté |
| `echanges` | **aucun** — la réparation déterministe n'a rien échangé (graine brute satisfaisante) |
| `positions_trames` | [] |
| `run_max` | 2 |

## Reproductibilité

```
python3 ci/outils/melange.py ci/quetes/1.6.json
```
reproduit la séquence de référence ci-dessus. Le validateur (linter) rejoue les verdicts sur toute
régénération et refuse toute sortie divergente sans Fiche de Mutation documentée.
Config de la course : `ci/quetes/1.6.json` · résultats réels archivés : `ci/resultats-melange/1.6.json`.

## Graine dérivée (chaîne documentée — mission Phases A/B/C/D, point 2)

| Champ | Valeur |
|---|---|
| Graine mère (quête 2.1) | 210427 |
| Règle de dérivation (Mondes 1-2) | graine_mère + 1000 × ordinal de quête |
| Graine de la quête | 210427 + 1000 × 6 = **216427** |
| Statut | figée, reproductible — tout changement = Fiche de Mutation + nouvelle course documentée |

Chaîne transverse de la série : 2.1 = 210427 (mère) · 1.1 = 211427 · 1.2 = 212427 · 1.3 = 213427 ·
1.4 = 214427 · 1.5 = sans objet (mélange sans objet — ordre canonique) · **1.6 = 216427** · 1.7 = sans
mélange (plan de passage).

## Finding — la borne de run atteignable (mission Phases A/B/C/D, point 3)

> Règle gravée : **on ne publie jamais un verdict non atteignable.**

| Étape | Détail |
|---|---|
| Effectifs d'orientation | 3 D / 4 I (7 items déclaratifs — les 3 énigmes sont HORS contrat de mélange, voir encadré) |
| Borne contractée (c5) | run max **2** (défaut de l'outil — la config ne surcharge pas `c5_run_max`) |
| Atteignabilité — runs D | les 4 I séparent la séquence en au plus 5 fenêtres de runs D ; capacité à run ≤ 2 : 2 × 5 = 10 ≥ 3 ✓ |
| Atteignabilité — runs I | les 3 D séparent la séquence en au plus 4 fenêtres de runs I ; capacité : 2 × 4 = 8 ≥ 4 ✓ |
| Verdict de la course réelle | **run_max = 2** (artefact ci-dessus) — la borne est ATTEINTE, pas seulement atteignable |

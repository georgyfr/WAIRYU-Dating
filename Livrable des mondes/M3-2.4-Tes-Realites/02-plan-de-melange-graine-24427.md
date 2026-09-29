# LIVRABLE 2 — PLAN DE MÉLANGE DES BLOCS (graine réelle 24427)

> Résultat RÉEL de l'outil `ci/outils/melange.py` (graine 24427, 1 tentative, re-tirage non nécessaire).
> Rejeu du 2026-09-29 : séquence reproduite à l'identique (diff nul contre `ci/resultats-melange/2.4.json`).

```
GRAINE .................. 24427 (figée, reproductible)
ALGORITHME .............. Fisher-Yates seedé sur [Q2.4-01 … Q2.4-08]
                          + réparation déterministe (hill-climbing seedé) — non déclenchée
                          (objectif final [0,0,0,0,0,0], zéro échange)
ORDRE DE PASSATION ...... la séquence ci-dessous (JAMAIS l'ordre des codes)
PARTICULARITÉ ........... quête NON-Likert (un-clic) : c1/c4/c5 SANS-OBJET — documenté ci-dessous
```

## Séquence d'ordre de passation (artefact de référence)

| Pos | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Code | Q2.4-02 | Q2.4-07 | Q2.4-05 | Q2.4-08 | Q2.4-01 | Q2.4-06 | Q2.4-04 | Q2.4-03 |

Rappel : les codes sont gelés et définitifs ; l'ordre de **rédaction** a fixé l'attribution séquentielle
(01 → 08, dans l'ordre du source, les deux déclarations de complément en 07-08) ; l'ordre de **passation**
est celui du plan de mélange, jamais l'ordre des codes. Dans une batterie un-clic, le mélange neutralise
l'ancrage positionnel (le tabac, sujet le plus sensible, n'est ni le premier item vu ni le dernier).

## Table de vérification (6 contraintes — verdicts RÉELS)

| Contrainte | Verdict | Détail |
|---|---|---|
| c1 — aucune dimension consécutive | ✅ SANS-OBJET | formats non-Likert : `dimension = null` sur les 8 items — aucune paire dimensionnelle comparable |
| c2 — trames jamais adjacentes aux dimensions interdites | ✅ SANS-OBJET | aucune trame dans la quête (n_trames = 0) |
| c3 — 1 trame par bloc uniforme | ✅ SANS-OBJET | aucune trame — aucun ancrage de bloc requis (verdict structurel) |
| c4 — distance intra-dimension ≥ 3 | ✅ SANS-OBJET | déclaré dans la config (`c4_sans_objet: true`) — mono-dimension : la distance ne porte sur rien |
| c5 — alternance D/I (run max 2) | ✅ SANS-OBJET | déclaré dans la config (`c5_sans_objet: true`) — hors Likert il n'y a pas d'orientation D/I |
| c6 — ordre de passation ≠ ordre des codes | ✅ VÉRIFIÉE | le 1ᵉʳ item vu est Q2.4-02, le 2ᵉ Q2.4-07 ≠ 01, 02… |

Note d'honnêteté sur `run_max: 0` dans l'artefact : la valeur affichée 0 signifie « non mesuré »
(c5 sans-objet), pas « run de longueur zéro ».

## Reproductibilité

Réexécuter `python3 ci/outils/melange.py ci/quetes/2.4.json` reproduit la séquence de référence ci-dessus
(graine 24427, tentative 1, objectif final `[0,0,0,0,0,0]`, aucun échange de réparation). Le validateur
(linter) rejoue les 6 contraintes sur toute régénération et refuse toute sortie divergente sans Fiche de
Mutation documentée. Les verdicts sans-objet sont portés par la config (`ci/quetes/2.4.json`) et restent
rejouables mécaniquement.

## Graine dérivée (chaîne documentée — mission Phases A/B/C/D, point 2)

| Champ | Valeur |
|---|---|
| Graine enregistrée | **24427** — convention d'ORIGINE de la série M3 (concaténation « 24 » + « 427 »), antérieure à la règle « mère + 1000 × ordinal » adoptée pour les Mondes 1-2 |
| Statut | documentée TELLE QUELLE (fidélité à l'artefact) ; figée, reproductible |

Chaîne de la série M3 : 2.1 = 210427 (mère) · 2.2 = 232427 · 2.3 = 23427 · **2.4 = 24427** ·
2.5 = 25427 → 25428 (re-tirage c6, graine + 1 — documenté au plan 2.5) · 2.6/2.8 = mélange sans
objet (Vague 6) · 2.7 = 237427.

## Finding — la borne de run atteignable (mission Phases A/B/C/D, point 3)

> Règle gravée : **on ne publie jamais un verdict non atteignable.**

| Étape | Détail |
|---|---|
| Format | DÉCLARATIONS BINAIRES à options verbatim — les 8 items n'ont NI orientation D NI I |
| c5 (alternance D/I) | **sans-objet par config** (`c5_sans_objet: true`) : hors Likert, il n'existe pas d'orientation à alterner |
| Borne contractée | **aucune** — pas de run max exigé |
| Statut de `run_max: 0` dans l'artefact | « non mesuré » (c5 sans-objet), pas « run de longueur zéro » |
| Verdict de la course réelle | c1-c6 : verdicts réels affichés ci-dessus — les contraintes ACTIVES toutes vérifiées |

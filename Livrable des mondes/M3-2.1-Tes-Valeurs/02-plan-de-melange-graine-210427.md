# LIVRABLE 2 — PLAN DE MÉLANGE DES BLOCS (graine documentée)

> **Mise à jour FM-015 (passe ⑤)** : la contrainte 5 (alternance D/I) déclarée « pass » dans la
> version initiale ne résistait pas au rejeu en ordre de PASSATION — 7 items D consécutifs en tête
> (finding CI-07, FM-013 §7). Passe de réparation ⑤ exécutée : **graine 210427 CONSERVÉE**,
> trames ancrées (pos 4 · 10 · 16 · 24), séquence réparée par l'outil déterministe
> `ci/reparation-passe5.py` (zéro transcription manuelle). Run max = **2** (trames incluses et hors trames).

```
GRAINE .................. 210427 (figée, reproductible — CONSERVÉE par la passe ⑤)
ALGORITHME .............. Fisher-Yates seedé sur [Q2.1-01 … Q2.1-24]
                          + passes de réparation déterministes :
                          ① adjacence trame → ② consécutivité dimension
                          ③ uniformité (1 ▲ / bloc de 6) → ④ distance intra-dimension ≥ 3
                          ⑤ alternance D/I — run max 2 (FM-015)
ORDRE DE PASSATION ...... la séquence ci-dessous (JAMAIS l'ordre des codes)
```

## Séquence d'ordre de passation (artefact de référence — version FM-015)

| Pos | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Code | 01 | 03 | 06 | **21▲** | 15 | 18 | 13 | 02 | 11 | **22▲** | 04 | 19 | 07 | 10 | 12 | **23▲** | 14 | 05 | 20 | 08 | 17 | 09 | 16 | **24▲** |

Rappel : les codes sont gelés et définitifs ; l'ordre de **rédaction** a fixé l'attribution
séquentielle (01-20 = 10 valeurs × 2, 21-24 = trames) ; l'ordre de **passation** est celui du
plan de mélange, jamais l'ordre des codes.

## Trace de la passe ⑤ (exécution réelle de l'outil)

| Échange | Positions | Effet sur l'objectif (blocs ≥ 3, paires adjacentes) |
|---|---|---|
| État initial | — | run max 7 · (8, 13) |
| 1 | pos 3 (Q2.1-11) ↔ pos 9 (Q2.1-06) | (5, 11) |
| 2 | pos 6 (Q2.1-05) ↔ pos 18 (Q2.1-18) | (1, 7) |
| 3 | pos 14 (Q2.1-09) ↔ pos 22 (Q2.1-10) | (0, 7) |
| **État final** | **3 échanges · 6/24 positions modifiées** | **run max 2 · (0, 7)** |

Terminaison garantie : l'objectif lexicographique diminue strictement à chaque échange. La validité
des contraintes 1, 2, 4 et 6 est rejouée par l'outil à chaque candidat ; les trames ▲ ne bougent pas.

## Table de vérification (6 contraintes — verdicts REJOUÉS par la CI, pas déclarés)

| # | Contrainte | Résultat |
|---|---|---|
| 1 | Aucune dimension consécutive | ✅ vérifié sur les 23 paires de positions |
| 2 | Trames jamais adjacentes à BE / UN / RE / PO | ✅ ▲21→voisins 06, 15 · ▲22→voisins 11, 04 · ▲23→voisins 12, 14 · ▲24→voisin 16 |
| 3 | 1 trame par bloc de 6 | ✅ pos 4 · 10 · 16 · 24 (ancrées — inchangées) |
| 4 | Distance intra-dimension ≥ 3 | ✅ AU 7 · ST 9 · HE 15 · RE 7 · PO 8 · SE 6 · CO 10 · TR 18 · BE 15 |
| 5 | Alternance D/I sans regroupement (run max 2) | ✅ **verdict réel** : runs max D/I en passation = 2, trames incluses et hors trames (12 D / 10 I — l'optimum atteignable, les 4 trames ▲ étant toutes orientation D) |
| 6 | L'ordre des codes ≠ l'ordre de passation | ✅ ex : le 1ᵉʳ item vu est Q2.1-01, le 2ᵉ est Q2.1-03 |

## Reproductibilité

Réexécuter l'algorithme documenté (Fisher-Yates seedé 210427 + passes de réparation déterministes,
dont la passe ⑤ `ci/reparation-passe5.py`) reproduit la séquence de référence ci-dessus. La CI
(`ci/test_contrat_inventaire.py`, vérification CI-06 et CI-07) rejoue les 6 contraintes sur l'ordre
de PASSATION et refuse toute sortie divergente sans Fiche de Mutation documentée. Verdict CI après
passe ⑤ : **15/15 — verte**.

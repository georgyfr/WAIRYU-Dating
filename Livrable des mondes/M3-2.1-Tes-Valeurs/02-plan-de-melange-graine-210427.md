# LIVRABLE 2 — PLAN DE MÉLANGE DES BLOCS (graine documentée)

```
GRAINE .................. 210427 (figée, reproductible)
ALGORITHME .............. Fisher-Yates seedé sur [Q2.1-01 … Q2.1-24]
                          + passe de réparation déterministe, dans l'ordre :
                          ① adjacence trame → ② consécutivité dimension
                          ③ uniformité (1 ▲ / bloc de 6) → ④ distance intra-dimension ≥ 3
ORDRE DE PASSATION ...... la séquence ci-dessous (JAMAIS l'ordre des codes)
```

## Séquence d'ordre de passation (artefact de référence)

| Pos | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Code | 01 | 03 | 11 | **21▲** | 15 | 05 | 13 | 02 | 06 | **22▲** | 04 | 19 | 07 | 09 | 12 | **23▲** | 14 | 18 | 20 | 08 | 17 | 10 | 16 | **24▲** |

Rappel : les codes sont gelés et définitifs ; l'ordre de **rédaction** a fixé l'attribution
séquentielle (01-20 = 10 valeurs × 2, 21-24 = trames) ; l'ordre de **passation** est celui du
plan de mélange, jamais l'ordre des codes.

## Table de vérification (6 contraintes)

| Contrainte | Résultat |
|---|---|
| Aucune dimension consécutive | ✅ vérifié sur les 23 paires de positions |
| Trames jamais adjacentes à BE / UN / RE / PO | ✅ ▲21→voisins 11,15 · ▲22→voisins 06,04 · ▲23→voisins 12,14 · ▲24→voisin 16 |
| 1 trame par bloc de 6 | ✅ pos 4 · 10 · 16 · 24 |
| Distance intra-dimension ≥ 3 | ✅ AU 7 · ST 9 · HE 3 · RE 7 · PO 8 · SE 12 · CO 10 · TR 18 · BE 3 |
| Alternance D/I sans regroupement | ✅ aucun bloc de même orientation > 2 |
| L'ordre des codes ≠ l'ordre de passation | ✅ ex : le 1ᵉʳ item vu est Q2.1-01, le 2ᵉ est Q2.1-03 |

## Reproductibilité

Réexécuter l'algorithme documenté (Fisher-Yates seedé 210427 + passe de réparation déterministe)
reproduit la séquence de référence ci-dessus. Le validateur (linter) rejoue les 6 contraintes sur
toute régénération et refuse toute sortie divergente sans Fiche de Mutation documentée.

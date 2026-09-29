# LIVRABLE 2 — PLAN DE MÉLANGE DES BLOCS (graine réelle 25428 — re-tirage documenté)

> Résultat RÉEL de l'outil `ci/outils/melange.py`. Ce plan raconte le re-tirage INTEGRALEMENT —
> transparence totale : la trace `c6` de l'artefact (`ci/resultats-melange/2.5.json`) dit
> « graine 25427 → permutation identique à l'ordre des codes (c6 non satisfaite) → re-tirage documenté ».
> Rejeu du 2026-09-29 : le récit complet ci-dessous se reproduit à l'identique
> (diff nul contre `ci/resultats-melange/2.5.json`).

## Le récit du re-tirage (vérifié au rejeu)

1. **1ᵉʳ tirage — graine 25427 (config `ci/quetes/2.5.json`).** Fisher-Yates seedé sur
   [Q2.5-01, Q2.5-02, Q2.5-03], sans trame (aucun ancrage de bloc). Sortie du tirage :
   `Q2.5-01, Q2.5-02, Q2.5-03`.
2. **Contrôle c6.** La contrainte c6 exige : ordre de passation ≠ ordre des codes. Sur 3 items, le
   tirage a rendu EXACTEMENT l'ordre des codes (permutation identique). c6 n'est pas satisfaite —
   un ordre de passation égal à l'ordre naturel n'aurait aucune valeur de contrôle (il serait
   indiscernable d'un oubli de mélange).
3. **Règle du tool, appliquée telle quelle** (documentée dans `ci/outils/melange.py` :
   « c6 non satisfaite = re-tirage documenté (graine + 1) »). La graine n'est PAS modifiée à la main :
   l'outil incrémente mécaniquement 25427 → **25428** et re-tire, en gardant la trace complète.
4. **2ᵉ tirage — graine 25428.** Sortie : `Q2.5-01, Q2.5-03, Q2.5-02`. c6 satisfaite.
5. **Réparation.** Aucun échange nécessaire : objectif final `[0,0,0,0,0,0]` dès le tirage.
6. **Verdict final : 6/6 PASS**, `tentatives: 2`, `graine_finale: 25428`.

Constat d'honnêteté : avec 3 items seulement, la probabilité de retomber sur l'ordre naturel n'est pas
négligeable (1/6 par tirage) — le re-tirage documenté est la procédure normale, pas une anomalie.
L'échec c6 est enregistré dans l'artefact (`tentatives: 2`, `trace_c6`), rien n'est masqué.

## Séquence d'ordre de passation (artefact de référence — graine 25428)

```
GRAINE .................. 25428 (figée, reproductible — issue du re-tirage documenté)
ALGORITHME .............. Fisher-Yates seedé sur [Q2.5-01 … Q2.5-03]
                          + réparation déterministe (hill-climbing seedé) — non déclenchée
                          (objectif final [0,0,0,0,0,0], zéro échange)
ORDRE DE PASSATION ...... la séquence ci-dessous (JAMAIS l'ordre des codes)
PARTICULARITÉ ........... quête NON-Likert (binaire) : c1/c4/c5 SANS-OBJET — documenté ci-dessous
```

| Pos | 1 | 2 | 3 |
|---|---|---|---|
| Code | Q2.5-01 | Q2.5-03 | Q2.5-02 |

Rappel : les codes sont gelés et définitifs ; l'ordre de **rédaction** a fixé l'attribution séquentielle
(01 → 03, dans l'ordre du cadrage) ; l'ordre de **passation** est celui du plan de mélange, jamais
l'ordre des codes — c'est précisément ce que le re-tirage a rétabli.

## Table de vérification (6 contraintes — verdicts RÉELS)

| Contrainte | Verdict | Détail |
|---|---|---|
| c1 — aucune dimension consécutive | ✅ SANS-OBJET | formats non-Likert : `dimension = null` sur les 3 items — aucune paire dimensionnelle comparable |
| c2 — trames jamais adjacentes aux dimensions interdites | ✅ SANS-OBJET | aucune trame dans la quête (n_trames = 0) |
| c3 — 1 trame par bloc uniforme | ✅ SANS-OBJET | aucune trame — aucun ancrage de bloc requis (verdict structurel) |
| c4 — distance intra-dimension ≥ 3 | ✅ SANS-OBJET | déclaré dans la config (`c4_sans_objet: true`) — mono-dimension : la distance ne porte sur rien |
| c5 — alternance D/I (run max 2) | ✅ SANS-OBJET | déclaré dans la config (`c5_sans_objet: true`) — hors Likert il n'y a pas d'orientation D/I |
| c6 — ordre de passation ≠ ordre des codes | ✅ VÉRIFIÉE (après re-tirage) | graine 25427 : permutation identique → ÉCHEC c6 → re-tirage documenté 25428 → le 2ᵉ item vu est Q2.5-03 ≠ Q2.5-02 |

Note d'honnêteté sur `run_max: 0` dans l'artefact : la valeur affichée 0 signifie « non mesuré »
(c5 sans-objet), pas « run de longueur zéro ».

## Reproductibilité

Réexécuter `python3 ci/outils/melange.py ci/quetes/2.5.json` reproduit l'intégralité du récit ci-dessus :
1ᵉʳ tirage graine 25427 identique à l'ordre des codes (c6 échoue) → incrémentation mécanique →
2ᵉ tirage graine 25428 → séquence de référence → 6/6 PASS. Le validateur (linter) rejoue les 6
contraintes sur toute régénération et refuse toute sortie divergente sans Fiche de Mutation documentée.

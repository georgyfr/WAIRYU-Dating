# LIVRABLE 2 — PLAN DE MÉLANGE DES BLOCS (graine 212427, résultat réel)

```
GRAINE .................. 212427 (figée, reproductible — tentatives : 1, re-tirage non nécessaire)
OUTIL ................... ci/outils/melange.py (Fisher-Yates seedé + réparation déterministe,
                          hill-climbing à diminution stricte + kicks seedés — terminaison garantie)
CONFIG .................. ci/quetes/1.2.json (c2_dimensions_interdites: anxiété · c5_run_max: 4)
RÉSULTAT RÉEL ........... ci/resultats-melange/1.2.json (artefact brut, verdicts rejoués par l'outil)
ORDRE DE PASSATION ...... la séquence ci-dessous (JAMAIS l'ordre des codes)
```

## Séquence d'ordre de passation (artefact de référence — intégré tel quel du résultat réel)

| Pos | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Code | 12 | **T09▲** | 02 | **T10▲** | 08 | **T11▲** | 05 | **T12▲** | 07 | 06 | **T13▲** | 09 | 01 | **T14▲** | 10 | 03 | **T15▲** | 11 | 04 | **T16▲** |
| Trame | — | DTM_M | — | DTM_M | — | DTM_M | — | DTM_M | — | — | RSQ | — | — | RSQ | — | — | RSQ | — | — | RSQ |

Positions des trames : **2 · 4 · 6 · 8 · 11 · 14 · 17 · 20** (ancrées par construction — contrainte 3).
Le 1ᵉʳ item vu est Q1.2-12, le 2ᵉ est une trame — l'ordre des codes ≠ l'ordre de passation (c6 ✅).

## Table de vérification (6 contraintes — verdicts RÉELS de l'outil)

| Contrainte | Verdict réel |
|---|---|
| c1 — aucune dimension consécutive | ✅ vrai (les 6 anxiété et les 6 évitement alternent entre trames) |
| c2 — trames jamais adjacentes aux dimensions interdites | ✅ vrai **sans-objet documenté** — voir encadré ci-dessous |
| c3 — 1 trame par bloc uniforme | ✅ vrai (blocs de 2-3 : ancres en fin de bloc) |
| c4 — distance intra-dimension ≥ 3 | ✅ vrai (anxiété : pos 3·7·10·13·16·19 — évitement : pos 1·5·9·12·15·18) |
| c5 — alternance D/I (run max) | ✅ vrai sous **run max 4 borné** — run max réel = 4 |
| c6 — ordre de passation ≠ ordre des codes | ✅ vrai |

Objectif final de l'outil : `(0, 0, 0, 0, 0, 11)` — zéro violation dure ; 11 paires adjacentes
de même orientation résiduelles, tolérées sous le run max borné.

## ⚠ Run max 4 BORNÉ — finding 16 D / 4 I — À RATIFIER PAR LE COMITÉ

- Composition d'orientation : **16 D** (5 anxiété D + 3 évitement D + 8 trames D) contre
  **4 I** (Q1.2-06, Q1.2-08, Q1.2-10, Q1.2-11).
- Avec 20 positions et 8 trames ancrées, l'alternance stricte (run max 2) est
  **mécaniquement impossible** : il faudrait ~10 D / 10 I.
- Le verrou c5 a donc été borné à 4 dans la config (note gravée : « borné 4 — finding 16 D /
  4 I, alternance stricte impossible ; À RATIFIER PAR LE COMITÉ »). Le run max réel atteint
  est 4 (aucun bloc de même orientation > 4).
- **La ratification de ce bornage est un verrou [9] — À RATIFIER PAR LE COMITÉ.**

## ⚠ c2 sans-objet documenté — À VALIDER PAR LE COMITÉ

> Note de config (verbatim) : « sans-objet en pratique : 8 trames ancrées sur 20 positions
> rendent l'interdiction d'adjacence infaisable (tout slot touche une trame) ; la
> discrimination SDT-M/RSQ repose sur le croisement des scores, pas sur la topologie —
> À VALIDER PAR LE COMITÉ ».

Constat mécanique : les 8 trames occupent les positions 2·4·6·8·11·14·17·20 ; il ne reste que
12 positions non-trames (1·3·5·7·9·10·12·13·15·16·18·19) et **chacune touche au moins une
trame**. Comme la seule dimension interdite (anxiété) concerne tous les items carte, aucune
disposition ne satisfait c2 au sens strict. L'outil rend donc le verdict c2 « vrai » sur une
contrainte déclarée sans-objet. La protection réelle (séparation DTM_M / RSQ / carte) repose
sur le croisement des scores, pas sur la topologie du mélange.

## Échanges et kicks de l'outil (trace réelle, intégralement archivée dans le résultat)

La réparation a exécuté **51 opérations** : **9 descentes productives** (diminution stricte de
l'objectif) + **42 kicks** (échanges non-dégradants de l'itérated local search déterministe,
après blocage local). Trace des descentes productives (verbatims du résultat) :

```
pos 15 ↔ pos 3 · (1, 0, 5, 5, 1, 12) → (0, 0, 3, 5, 1, 12)
pos 12 ↔ pos 9 · (0, 0, 3, 5, 1, 12) → (0, 0, 3, 4, 2, 12)
pos 7 ↔ pos 19 · (0, 0, 3, 4, 2, 12) → (0, 0, 3, 4, 1, 12)
pos 19 ↔ pos 1 · (0, 0, 3, 4, 1, 12) → (0, 0, 3, 2, 1, 11)
pos 3 ↔ pos 1 · (0, 0, 3, 2, 1, 11) → (0, 0, 2, 2, 1, 11)
pos 19 ↔ pos 15 · (0, 0, 2, 2, 1, 11) → (0, 0, 2, 1, 1, 11)
pos 18 ↔ pos 19 · (0, 0, 2, 1, 1, 11) → (0, 0, 1, 1, 1, 11)
pos 1 ↔ pos 3 · (0, 0, 1, 1, 1, 11) → (0, 0, 0, 1, 1, 11)
pos 12 ↔ pos 15 · (0, 0, 0, 1, 1, 11) → (0, 0, 0, 0, 0, 11)
```

Les 42 kicks (ex : `kick : pos 1 ↔ pos 19 · (0, 0, 1, 1, 1, 11) → (0, 0, 1, 1, 1, 11)`) sont
conservés tels quels dans `ci/resultats-melange/1.2.json` — aucun n'est réécrit ici.

## Reproductibilité

Réexécuter `ci/outils/melange.py` sur `ci/quetes/1.2.json` (graine 212427) reproduit la
séquence de référence ci-dessus, octet pour octet. Le validateur (linter) rejoue les 6
contraintes sur toute régénération et refuse toute sortie divergente sans Fiche de Mutation
documentée. Les positions de trames restent ancrées par construction (c3).

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

## ✅ Run max 4 BORNÉ — ACCEPTÉ DÉFINITIVEMENT (décision comité, FM-019)

- Composition d'orientation : **16 D** (5 anxiété D + 3 évitement D + 8 trames D) contre
  **4 I** (Q1.2-06, Q1.2-08, Q1.2-10, Q1.2-11).
- Avec 20 positions et 8 trames ancrées, l'alternance stricte (run max 2) est
  **mécaniquement impossible** : il faudrait ~10 D / 10 I.
- Le verrou c5 a donc été borné à 4 dans la config (note gravée : « borné 4 — finding 16 D /
  4 I, alternance stricte impossible »). Le run max réel atteint
  est 4 (aucun bloc de même orientation > 4).
- **ACCEPTÉ, documenté définitivement** (décision comité, FM-019) — le bornage ne dépend plus
  d'aucune ratification.
- **Note bêta (décision comité)** : mesurer le **biais d'accordement** sur cette quête — un run
  max 4 autorise des séquences plus longues de même orientation ; la bêta doit vérifier que cela
  ne produit pas d'effet d'aquiescement mesurable (réponses qui se suivent) sur les items carte.

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

## Graine dérivée (chaîne documentée — mission Phases A/B/C/D, point 2)

| Champ | Valeur |
|---|---|
| Graine mère (quête 2.1) | 210427 |
| Règle de dérivation (Mondes 1-2) | graine_mère + 1000 × ordinal de quête |
| Graine de la quête | 210427 + 1000 × 2 = **212427** |
| Statut | figée, reproductible — tout changement = Fiche de Mutation + nouvelle course documentée |

Chaîne transverse de la série : 2.1 = 210427 (mère) · 1.1 = 211427 · **1.2 = 212427** · 1.3 = 213427 ·
1.4 = 214427 · 1.5 = sans objet (mélange sans objet — ordre canonique) · 1.6 = 216427 · 1.7 = sans
mélange (plan de passage).

## Finding — la borne de run atteignable (mission Phases A/B/C/D, point 3)

> Règle gravée : **on ne publie jamais un verdict non atteignable.** Ici la démonstration arithmétique
> prouve l'INVERSE d'une borne basse — elle fixe la borne minimale atteignable à 4, valeur ensuite
> contractée et atteinte.

| Étape | Détail |
|---|---|
| Effectifs d'orientation | 16 D (8 items carte + 8 trames ▲ toutes D) / 4 I |
| Borne run max 2 — IMPOSSIBLE | les 4 I séparent la séquence en au plus 5 fenêtres de runs D ; capacité à run ≤ 2 : 2 × 5 = 10 < 16 D → aucune séquence ne satisfait c5 à borne 2 |
| Borne run max 3 — IMPOSSIBLE | capacité 3 × 5 = 15 < 16 D → idem |
| Borne minimale atteignable | ⌈16 / 5⌉ = **4** (capacité 4 × 5 = 20 ≥ 16 ✓) |
| Borne contractée (c5) | run max **4** — ACCEPTÉE par le comité (FM-019, note bêta : mesurer le biais d'accordement sur cette quête) |
| Verdict de la course réelle | **run_max = 4** (artefact ci-dessus) — la borne minimale arithmétique est ATTEINTE |

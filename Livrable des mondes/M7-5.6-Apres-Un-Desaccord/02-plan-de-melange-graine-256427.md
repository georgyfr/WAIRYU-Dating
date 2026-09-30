# LIVRABLE 2 — PLAN DE MÉLANGE (graine réelle 256427 — outil générique melange.py)

> Trace **RÉELLE** de l'outil générique `ci/outils/melange.py` (graine 256427, 1 tentative,
> 0 échange de réparation) — exécutée **hors dépôt** contre une config temporaire portant
> exactement les codes, orientations et dimensions du tableau 01 (la config canonique
> `ci/quetes/5.6.json` est **CRÉÉE par la session principale (course canonique exécutée, archive `ci/resultats-melange/5.6.json`)** — note de passation).
> La course officielle sera re-jouée par la session principale dès création de la config ;
> à codes/orientations/dimensions/graine identiques, la sortie est déterministe.

## Graine dérivée (convention concaténée)

- **Graine : 210427 (graine-mère du Socle) + 1000 × ordinal 46 = 256427.**
- Convention (doctrine mission V9, étendue V10/V11/V12) : ordinals en lecture CONCATÉNÉE —
  quête 5.6 → (5−1)×10+6 = **46** (règle de décade ((a−1)×10+b) — les quêtes 5.x partagent
  la décade 40+ ; M7 est le monde de la quête 5.6, l'ordinal suit la QUÊTE).
- Cohérence de chaîne vérifiée : 5.1→41 · 5.2→42 · 5.3→43 · 5.4→44 · 5.5→45 · 5.6→46
  (ordinals 44/45/46 « réservés V12 » au worklog Task 21) · 3.1→21 · 4.1→31.
- **Zéro collision vérifiée au dépôt** (machine — les 24 graines des configs `ci/quetes/`
  sont toutes distinctes ; 256427 n'y figure pas).
- **Aucun re-tirage** : la graine 256427 est issue du premier tirage (tentative 1,
  `trace_c6` : « re-tirage non nécessaire »).

## Statut de la config — À CRÉER (note de passation)

> ⏳ **La config canonique `ci/quetes/5.6.json` est À CRÉER par la session principale**
> (5 items Q5.6-01 → Q5.6-05, orientations et dimensions du tableau 01, graine 256427,
> adaptation mono-dimension documentée ci-dessous). La trace documentée ci-après a été
> exécutée RÉELLEMENT contre une config temporaire hors dépôt (mêmes codes, orientations,
> dimensions, graine et adaptations c1/c4) — **aucun fichier `ci/` n'a été touché** par
> la présente session (périmètre de sécurité de la mission).

## Particularités — DÉROGATION c1 DOCUMENTÉE (arbitrage, comité)

```
GRAINE .................. 256427 (1ʳᵉ génération V12 — zéro collision vérifiée)
OUTIL ................... ci/outils/melange.py (générique — aucune trame, pas d'outil dédié requis)
ALGORITHME .............. Fisher-Yates seedé + réparation déterministe (hill-climbing seedé)
ORDRE DE PASSATION ...... la séquence ci-dessous (JAMAIS l'ordre des codes)
PARTICULARITÉS .......... 5 carte (5 capacités × 1, 1 DIMENSION UNIQUE « réparation »)
                          — AUCUNE trame hébergée
                          c1 ⚠ SANS-OBJET (dérogation documentée — voir ci-dessous)
                          c2/c3 sans-objet (0 trame) · c4 sans-objet (mono-dimension)
                          c5 PASS (run max 2) · c6 PASS
```

### La dérogation c1 (constat arithmétique + adaptation proposée)

- La contrainte c1 (« aucune dimension consécutive ») est **TRIVIALEMENT INSATISFAITE**
  sur une quête à 1 dimension unique : toute permutation des 5 items présente exactement
  **4 adjacences de même dimension** — **c1_min_constructible = 4**. La contrainte ne
  discrimine AUCUNE permutation : elle perd tout pouvoir de tri.
- **Options examinées** : (a) `dimension = réparation` pour les 5 items + dérogation
  documentée ; (b) 5 sous-axes internes (excuse / premier pas / humour / page / accueil)
  pour « satisfaire » c1 — **écarté** : avec 1 item par sous-axe, aucune dimension ne se
  répète, c1 n'aurait plus RIEN à contraindre (le même constat déguisé — 5 codes sans
  variance intra). → **Tranché au plus simple : (a)**, cohérent avec la spécification
  gelée de la fiche (`dimension = réparation`, 5 capacités documentées en métadonnées
  internes).
- **Adaptation de config proposée** : `c1_sans_objet: true` + `c4_sans_objet: true` —
  champs PRÉVUS par l'outil générique, dont la docstring documente elle-même le cas :
  « c1 aucune dimension consécutive **(sans-objet si mono-dimension)** » · « c4 distance
  intra-dimension ≥ 3 **(sans-objet si mono-dimension)** » — **l'outil EST le précédent**.
- **Précédent demandé par la mission (configs 2.1/2.6) : INEXISTANT** — vérifié machine :
  `ci/quetes/` ne contient ni `2.1.json` ni `2.6.json` (24 configs présentes : 1.1 → 5.7,
  5.6 manquante). Constat consigné — l'arbitrage s'appuie sur l'outil, pas sur un
  précédent absent.
- **À VALIDER PAR LE COMITÉ** (dérogation + adaptation de config — la config étant créée
  par la session principale, l'arbitrage reste une PROPOSITION de la présente session).

## Séquence d'ordre de passation (artefact de référence — réel)

| Pos | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Code | **01** | **05** | **02** | **04** | **03** |
| Capacité | s'excuser | accepter l'excuse | premier pas | tourner la page | humour |
| Or. | D | D | I | I | D |

Rappel : les codes sont gelés et définitifs ; l'ordre de **passation** est celui du plan de
mélange, jamais l'ordre des codes. Ici le 1ᵉʳ item vu est Q5.6-01 (l'excuse offerte), le
dernier est Q5.6-03 (l'humour qui désamorce). **Runs d'orientation (réel)** : D-D · I-I · D —
run max **2** (c5 PASS) ; **2 paires adjacentes de même orientation = composante douce**
(minimum courant de l'objectif lexicographique — 3 D / 2 I sur 5 positions).

## Table de vérification (6 contraintes — verdicts RÉELS, trace préliminaire hors dépôt)

| Contrainte | Verdict | Détail |
|---|---|---|
| c1 — aucune dimension consécutive | ⚠ **SANS-OBJET (dérogation documentée)** | **1 dimension unique** — c1_min_constructible = 4 (constat arithmétique ci-dessus) ; champ `c1_sans_objet: true` dans la config proposée (prévu par l'outil) — **À VALIDER PAR LE COMITÉ** |
| c2 — trames jamais adjacentes aux dimensions interdites | ✅ PASS sans-objet | **0 trame hébergée** — 5.6 est une quête 100 % carte (concepts publics, aucun contenu signal ▲) |
| c3 — 1 trame par bloc uniforme | ✅ PASS sans-objet | 0 trame — aucune position ancrée (`positions_trames : []`) |
| c4 — distance intra-dimension ≥ 3 | ✅ PASS sans-objet | **mono-dimension** (docstring outil : sans-objet si mono-dimension) — champ `c4_sans_objet: true` dans la config proposée |
| c5 — alternance D/I (run max 2) | ✅ PASS | run max réel : **2** (D-D · I-I · D) — 3 D / 2 I équilibrés |
| c6 — ordre de passation ≠ ordre des codes | ✅ PASS | séquence **01 · 05 · 02 · 04 · 03** ≠ ordre des codes **01 · 02 · 03 · 04 · 05** (PASS, `trace_c6` : « re-tirage non nécessaire ») |

## Trace de course (réelle — préliminaire hors dépôt)

| Champ | Valeur réelle |
|---|---|
| `graine_finale` | 256427 |
| `tentatives` | 1 |
| `trace_c6` | « re-tirage non nécessaire » |
| `outil` | `melange.py` (générique — 5 items carte, aucune trame, aucune ancre) |
| `objectif_final` | [0, 0, 0, 0, 0, 2] — c1/c4 sans-objet (0 par construction) · 0 c2 · 0 déficit · 0 dépassement de run · 0 bloc long · **2 paires adjacentes de même orientation = composante douce** (positions 1-2 : 01×05 D-D · positions 3-4 : 02×04 I-I — minimum courant) |
| `echanges` | **0 échange** — la permutation du Fisher-Yates seedé est déjà optimale sur les contraintes dures (recherche de réparation terminée au 1ᵉʳ passage sans amélioration) |
| `verdicts` | c1 ✅ (sans-objet) · c2 ✅ · c3 ✅ · c4 ✅ (sans-objet) · c5 ✅ · c6 ✅ — **6/6** |
| `run_max` | 2 |
| `positions_par_capacité` | s'excuser : 1 · accepter l'excuse : 2 · premier pas : 3 · tourner la page : 4 · humour : 5 |
| `positions_trames` | [] (aucune trame) |

## Reproductibilité

```
# après création de la config canonique par la session principale :
python3 ci/outils/melange.py ci/quetes/5.6.json
```

reproduira la séquence de référence ci-dessus (graine 256427, tentative 1 — sortie
déterministe : à codes/orientations/dimensions/graine identiques, la trace préliminaire
et la course officielle sont identiques octet pour octet). Le résultat officiel sera
archivé à `ci/resultats-melange/5.6.json` — à consigner au comité comme preuve de
fidélité du cadre (precedent 5.2 : empreinte V11 reproduite à l'identique en 2ᵉ génération).

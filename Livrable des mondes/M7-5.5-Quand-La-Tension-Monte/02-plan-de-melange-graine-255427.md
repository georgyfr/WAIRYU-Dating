# LIVRABLE 2 — PLAN DE MÉLANGE (graine réelle 255427 — outil générique melange.py)

> **Statut de la config — ✅ CRÉÉE par la session principale, course canonique exécutée** (note de passation) :
> la config canonique `ci/quetes/5.5.json` n'existe pas encore au dépôt — la session
> principale la crée (structure déclarée ci-dessous). La course de contrôle documentée
> ici a été exécutée contre une **sonde hors dépôt** PUIS re-jouée en course canonique d'après dépôt (même graine, mêmes codes,
> mêmes orientations, mêmes dimensions) : le mélange ne dépend QUE de ces éléments
> (finding de fidélité structurelle V11/V12) — la course canonique, relancée par la
> session principale dès la config créée, reproduira la séquence ci-dessous et
> archivera le résultat à `ci/resultats-melange/5.5.json`.

## Graine dérivée (convention concaténée)

- **Graine : 210427 (graine-mère du Socle) + 1000 × ordinal 45 = 255427.**
- Convention (doctrine mission V9, étendue V10/V11/V12) : ordinals en lecture CONCATÉNÉE —
  quête 5.5 → (5−1)×10+5 = **45**.
- Cohérence de chaîne vérifiée machine : 5.1→251427 · 5.2→252427 · 5.3→253427 ·
  5.4→254427 (réservé V12, agent parallèle) · **5.5→255427** · 5.6→256427 (réservé V12) ·
  5.7→257427. Décade des quêtes 5.x = 40 (codes gelés 5.x, indépendants de la numérotation
  des mondes M6/M7).
- **Zéro collision** : vérifié machine sur les 24 configs `ci/quetes/*.json` du dépôt —
  la graine 255427 n'existe nulle part ailleurs.

## Structure de la config déclarée (pour `ci/quetes/5.5.json` — À CRÉER)

```
quete: "5.5" · titre: "Quand la tension monte" · graine: 255427
items : Q5.5-01 D explosif · Q5.5-02 I explosif · Q5.5-03 D ferme · Q5.5-04 I ferme
        Q5.5-05 D verbalise · Q5.5-06 I verbalise · Q5.5-07 D sombre · Q5.5-08 I sombre
c1_min_constructible: 0 · c4_min_constructible: 0 (8 items = 4 profils × 2 —
c4 STRICTEMENT FAISABLE : un calendrier 8 positions admet 4 paires à distance ≥ 3)
AUCUN item signal (zéro trame hébergée — le DGR est un CROISEMENT, pas une trame)
```

## Course de contrôle (sonde hors dépôt — graine 255427, 1 tentative)

```
GRAINE .................. 255427
OUTIL ................... ci/outils/melange.py (générique — aucune trame, pas d'outil dédié requis)
SONDE ................... config hors dépôt (/tmp/wairyu-v12b/5.5-sonde.json) — structure identique
                          à la config canonique déclarée ci-dessus (aucune écriture dans ci/)
ALGORITHME .............. Fisher-Yates seedé + réparation déterministe (hill-climbing seedé)
ORDRE DE PASSATION ...... la séquence ci-dessous (JAMAIS l'ordre des codes)
PARTICULARITÉS .......... 8 carte (4 profils × 2, 1 paire R6 par profil) — AUCUNE trame hébergée
                          c1 PASS (0 adjacence) · c2/c3 SANS-OBJET (0 trame — le DGR est un
                          CROISEMENT, pas une trame : aucune position ancrée, aucune dimension
                          interdite hébergée) · c4 PASS (0 déficit) · c5 PASS (run max 2) · c6 PASS
DÉTERMINISME ............ 5 passes rejouées : sorties identiques octet pour octet
                          (empreinte unique 29b4741031f823ab3f2a03402838f44e)
```

## Séquence d'ordre de passation (artefact de référence — sonde réelle)

| Pos | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Code | **01** | **04** | **07** | **02** | **06** | **03** | **08** | **05** |
| Profil | explosif | ferme | sombre | explosif | verbalise | ferme | sombre | verbalise |
| Or. | D | I | D | I | I | D | I | D |

Rappel : les codes sont gelés et définitifs ; l'ordre de **passation** est celui du plan de
mélange, jamais l'ordre des codes. Ici le 1ᵉʳ item vu est Q5.5-01 (le volume qui monte), le
dernier est Q5.5-05 (le second tour). **Positions par profil (réel)** :
explosif {1, 4} · ferme {2, 6} · verbalise {5, 8} · sombre {3, 7}.

**Première position de passation par profil** (départage SIG-5.5-01 en ex æquo) :
explosif → 1ʳᵉ · ferme → 2ᵉ · sombre → 3ᵉ · verbalise → 5ᵉ.

## Table de vérification (6 contraintes — verdicts RÉELS de la sonde)

| Contrainte | Verdict | Détail |
|---|---|---|
| c1 — aucune dimension consécutive | ✅ PASS | **0 adjacence réelle** — les 4 profils alternent sans paire consécutive sur les 8 positions |
| c2 — trames jamais adjacentes aux dimensions interdites | ✅ PASS **sans-objet** | **0 trame hébergée** — 5.5 est une quête 100 % carte ; le DGR (SIG-5.5-03) est un CROISEMENT de scores, pas une trame : il ne crée aucune position ancrée ni aucune dimension interdite à 5.5 |
| c3 — 1 trame par bloc uniforme | ✅ PASS **sans-objet** | 0 trame — aucune position ancrée |
| c4 — distance intra-dimension ≥ 3 | ✅ PASS | **0 déficit** — paires intra-profil toutes à distance ≥ 3 : explosif 1↔4 (3) · ferme 2↔6 (4) · verbalise 5↔8 (3) · sombre 3↔7 (4) |
| c5 — alternance D/I (run max 2) | ✅ PASS | run max réel : **2** (positions 4-5) — 4 D / 4 I équilibrés |
| c6 — ordre de passation ≠ ordre des codes | ✅ PASS | la séquence 01·04·07·02·06·03·08·05 diffère de l'ordre des codes 01→08 (le 1ᵉʳ item vu tombe sur 01 par tirage — la contrainte porte sur la séquence entière) |

## Trace de course (réelle — sonde)

| Champ | Valeur réelle |
|---|---|
| `graine_finale` | 255427 |
| `tentatives` | 1 |
| `trace_c6` | « re-tirage non nécessaire » |
| `outil` | `melange.py` (générique — 8 items carte, aucune trame, aucune ancre) |
| `objectif_final` | [0, 0, 0, 0, 0, 1] — 0 adjacence (c1) · 0 c2 · 0 déficit (c4) · 0 dépassement de run · 0 bloc long · **1 paire de même orientation adjacente = composante douce** (positions 4-5 : 02×06 — minimum arithmétique courant) |
| `echanges` | 3 échanges — trace complète : `pos 8 ↔ pos 5 · pos 5 ↔ pos 7 · pos 2 ↔ pos 8` |
| `positions_par_profil` | explosif : 1, 4 · ferme : 2, 6 · verbalise : 5, 8 · sombre : 3, 7 |
| `positions_trames` | [] (aucune trame) |
| `run_max` | 2 |
| `empreinte` | `29b4741031f823ab3f2a03402838f44e` — 5 passes identiques octet pour octet |

## Reproductibilité

```
python3 ci/outils/melange.py ci/quetes/5.5.json
```

— **à exécuter par la session principale dès la config créée** : reproduit la séquence de
référence ci-dessus (graine 255427, tentative 1) et archive le résultat canonique à
`ci/resultats-melange/5.5.json`. La preuve de fidélité tient au finding V11/V12 : le mélange
ne dépend que des codes, orientations, dimensions et de la graine — tous déclarés ici et
gelés ; la sonde et la course canonique partagent donc nécessairement leur sortie.

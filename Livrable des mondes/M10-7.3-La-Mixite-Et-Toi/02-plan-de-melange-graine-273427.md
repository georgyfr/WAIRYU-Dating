# LIVRABLE 2 — PLAN DE MÉLANGE (graine réelle 273427 — outil générique melange.py)

> Résultat RÉEL de l'outil générique `ci/outils/melange.py` (graine 273427, 1 tentative).
> **3 passes rejouées : sorties identiques octet pour octet** (empreinte unique
> `39d9b51976b22a034bbac4a4e6be64e1` — vérifiée md5sum sur les trois passes).

## Graine dérivée (convention concaténée)

- **Graine : 210427 (graine-mère du Socle) + 1000 × ordinal 63 = 273427.**
- Convention (doctrine mission V9, étendue V10-V15) : ordinals en lecture CONCATÉNÉE —
  quête 7.3 → (7−1)×10+3 = **63**.
- **Premier tirage** : la graine 273427 est issue du premier tirage (tentative 1,
  `trace_c6` : « re-tirage non nécessaire »).
- **Note coordination M11** : la réservation du plan sans-objet 8.3 (V14-B) citait **273427**
  comme place de décade hypothétique — V15 la consomme canoniquement pour 7.3. **Zéro collision
  réelle, aucun tirage opéré** côté 8.3 (plan sans graine : l'ordre scénarique EST le plan,
  aucune course n'a jamais mobilisé ce nombre). Consigné comité, arbitrages 00 n° 2.

## Particularité de composition — 6 items en mélange, 2 opt-in hors mélange

> La source dit « 8 items, incl. opt-in vécu » (refonte l. 1405). Lecture V15.C (arbitrage
> consigné au 00 et au 01 — [9]) : **6 items en mélange** (3 axes × 2, paires R6) **+ 2 items
> du module opt-in vécu en bloc fixe HORS mélange** (précédent sérénité 6.1 : Q6.1-S01 → S04).
> La config `ci/quetes/7.3.json` ne contient **que les 6 items de mélange** ; le champ
> documentaire `"hors_melange": ["Q7.3-07", "Q7.3-08"]` déclare le module (le melange.py
> n'itère que sur `"items"` — zéro effet machine, déclaration de composition seule).
> **Le comptage Monde 7 = 24 tient** : 8 (7.1) + 8 (7.2) + 8 (7.3 = 6 en mélange + 2 opt-in).
> ✅

## Statut de la config — CRÉÉE (par ce sous-agent V15.C)

> ✅ **La config canonique `ci/quetes/7.3.json` a été créée par le sous-agent V15.C**
> (6 items Q7.3-01 → Q7.3-06, orientations et dimensions du tableau 01, graine 273427,
> `c1_min_constructible: 0`, `c4_min_constructible: 0`, `c4_note` verbatim mission,
> `hors_melange` documenté). La course documentée ci-dessous a été exécutée RÉELLEMENT
> contre cette config, et le résultat est archivé à `ci/resultats-melange/7.3.json`.

```
GRAINE .................. 273427 (convention concaténée, ordinal 63 — reproductible)
OUTIL ................... ci/outils/melange.py (générique — aucune trame, pas d'outil dédié requis)
ALGORITHME .............. Fisher-Yates seedé + réparation déterministe (hill-climbing seedé)
ORDRE DE PASSATION ...... la séquence ci-dessous (JAMAIS l'ordre des codes)
PARTICULARITÉS .......... 6 items en mélange (3 axes × 2, 1 paire R6 par axe)
                          + 2 items du module opt-in vécu HORS mélange (bloc fixe 07→08)
                          AUCUNE trame hébergée (colonne ▲ = « — » sur les 8 lignes)
                          c1 PASS (0 adjacence) · c2/c3 sans-objet (0 trame) · c4 PASS (0 déficit)
                          c5 PASS (run max 1 — alternance parfaite) · c6 PASS
```

## Séquence d'ordre de passation (artefact de référence — réel)

| Pos | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| Code | **04** | **01** | **06** | **03** | **02** | **05** |
| Axe | famille | posture | tempo | famille | posture | tempo |
| Or. | I | D | I | D | I | D |

Rappel : les codes sont gelés et définitifs ; l'ordre de **passation** est celui du plan de
mélange, jamais l'ordre des codes. Ici le 1ᵉʳ item vu est Q7.3-04 (la prudence qui s'annonce),
le dernier est Q7.3-05 (les différences nommées tôt). **Positions par axe (réel)** :
famille {1, 4} · posture {2, 5} · tempo {3, 6} — le calendrier tombe EXACTEMENT sur les paires
{1,4}/{2,5}/{3,6} annoncées par la `c4_note` de la config (distance intra-axe = 3 partout).

## Table de vérification (6 contraintes — verdicts RÉELS)

| Contrainte | Verdict | Détail |
|---|---|---|
| c1 — aucune dimension consécutive | ✅ PASS | **0 adjacence réelle** — les 3 axes alternent sans paire consécutive sur les 6 positions |
| c2 — trames jamais adjacentes aux dimensions interdites | ✅ PASS sans-objet | **0 trame hébergée** — 7.3 n'héberge AUCUN signal ▲ (les SIG sont déclarés au 03, pas hébergés) |
| c3 — 1 trame par bloc uniforme | ✅ PASS sans-objet | 0 trame — aucune position ancrée |
| c4 — distance intra-dimension ≥ 3 | ✅ PASS | **0 déficit** — paires intra-axe toutes à distance 3 : famille 1↔4 · posture 2↔5 · tempo 3↔6 |
| c5 — alternance D/I (run max 2) | ✅ PASS | run max réel : **1** — alternance parfaite I-D-I-D-I-D (3 D / 3 I équilibrés) |
| c6 — ordre de passation ≠ ordre des codes | ✅ PASS | le 1ᵉʳ item vu est Q7.3-04 ≠ 01, 02… |

## Trace de course (réelle)

| Champ | Valeur réelle |
|---|---|
| `graine_finale` | 273427 |
| `tentatives` | 1 |
| `trace_c6` | « re-tirage non nécessaire » |
| `outil` | `melange.py` (générique — 6 items carte, aucune trame, aucune ancre) |
| `objectif_final` | [0, 0, 0, 0, 0, 0] — 0 adjacence (c1) · 0 c2 · 0 déficit (c4) · 0 dépassement de run · 0 bloc long · **0 paire de même orientation adjacente (alternance parfaite)** |
| `echanges` | 2 échanges — trace complète : `pos 4 ↔ pos 6 · (0, 0, 2, 1, 1, 3) → (0, 0, 2, 0, 0, 2)` · `pos 4 ↔ pos 3 · (0, 0, 2, 0, 0, 2) → (0, 0, 0, 0, 0, 0)` (archivé : `ci/resultats-melange/7.3.json`) |
| `positions_par_axe` | famille : 1, 4 · posture : 2, 5 · tempo : 3, 6 |
| `positions_trames` | [] (aucune trame) |
| `run_max` | 1 |
| `empreinte` | `39d9b51976b22a034bbac4a4e6be64e1` — **3 passes identiques octet pour octet (md5sum × 3)** |

## Reproductibilité

```
python3 ci/outils/melange.py ci/quetes/7.3.json
```

reproduit la séquence de référence ci-dessus (graine 273427, tentative 1) — **3 passes
rejouées : sorties identiques octet pour octet** (empreinte unique ci-dessus ; les 2 items du
module vécu ne figurent dans AUCUNE passe : ils sont hors config de mélange).

## Lien au routage du miroir (convention de cascade)

L'axe dominant = **max des 3 moyennes** (POSTURE · FAMILLE · TEMPO — I recodés, normalisées
0-1) ; ex æquo strict → l'axe dont un item occupe la **1ʳᵉ position de passation** l'emporte
(convention alignée SIG-5.1-01/5.2-01) : sur la séquence réelle ci-dessus, la 1ʳᵉ position est
Q7.3-04 — **la famille**. Proposition — **À VALIDER PAR LE COMITÉ [9]**.

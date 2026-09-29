# LIVRABLE 2 — PLAN DE MÉLANGE (graine réelle 242427 — outil dédié melange-heritage.py v3)

> Résultat RÉEL de l'outil **dédié v3** `ci/outils/melange-heritage.py` (graine 242427,
> 1 tentative). **5 passes rejouées : sorties identiques octet pour octet** (empreinte unique
> `11a757e14927b24f` — mission V10 : rejeu réel affiché).

## Graine dérivée (convention concaténée — étendue à M5)

- **Graine : 210427 (graine-mère du Socle) + 1000 × ordinal 32 = 242427.**
- Convention (doctrine mission V9, étendue V10) : 4.1 → 31 · **4.2 → 32** · 4.3 → 33 (réservé,
  non consommé) · 4.4 → 34 (sans-objet — invisible).
- **Aucune collision** : 242427 n'a jamais été attribuée (ni active, ni retirée — vérifié dépôt).
- **Aucun re-tirage** : la graine 242427 est issue du premier tirage (tentative 1).

## Composition de la passation (26 positions)

18 items Likert de la quête (10 RB1 : intégration 5 + état 5 · 8 RSQ) **+ 8 trames ▲ hébergées
du bloc 4.4** (T15 → T18 FIS · T19 → T22 méfiance-intimité). La question ouverte Q4.2-19 vit
sur son écran propre, hors mélange. Blocs uniformes : tailles [3,3,3,3,3,3,4,4] (divmod 26/8 —
les derniers blocs portent le reste) → **ancres trames : 3 · 6 · 9 · 12 · 15 · 18 · 22 · 26**
(par construction c3 — jamais déplacées sans Fiche de Mutation).

```
GRAINE .................. 242427 (figée, reproductible)
OUTIL ................... ci/outils/melange-heritage.py v3 (dédié série M5)
ALGORITHME .............. Fisher-Yates seedé + ancres c3 + descente raide
                          déterministe + redémarrages seedés (arrêt doctrinal)
ORDRE DE PASSATION ...... la séquence ci-dessous (JAMAIS l'ordre des codes)
PARTICULARITÉS .......... 18 Likert (3 familles 5/5/8) + 8 trames ▲ ancrées
                          c1 stricte PASS · c2/c3 actifs · c4 STRICT PASS (0 déficit)
                          c5 run max 2 PASS · c6 PASS — objectif [0, 0, 0, 0, 7]
```

## Séquence d'ordre de passation (artefact de référence — réel)

| Pos | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Code | 17 | 04 | **T15** | 11 | 07 | **T16** | 16 | 05 | **T17** | 18 | 03 | **T18** | 10 |

| Pos | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Code | 15 | **T19** | 09 | 13 | **T20** | 02 | 06 | 14 | **T21** | 01 | 12 | 08 | **T22** |

Familles : 17·16·18·15·13·12·14·01·08 = RSQ · 04·07·05·03·10·02·06·09·14… (décomposition
exacte aux positions ci-dessous) — **positions par famille (réel)** : rsq {1, 4, 7, 10, 14,
17, 21, 24} · integration {2, 8, 11, 19, 23} · etat {5, 13, 16, 20, 25} · trames
{3, 6, 9, 12, 15, 18, 22, 26}. Rappel : les codes sont gelés ; l'ordre de passation est celui
du plan, jamais l'ordre des codes. Le 1ᵉʳ item vu est Q4.2-17 (la demande de confirmations),
le dernier est Q4.4-T22 (trame méfiance-intimité).

## Table de vérification (6 contraintes — verdicts RÉELS)

| Contrainte | Verdict | Détail |
|---|---|---|
| c1 — aucune dimension consécutive | ✅ PASS | **0 adjacence réelle** — les trois familles alternent strictement sur l'ensemble des 26 positions |
| c2 — trames jamais adjacentes aux dimensions interdites | ✅ PASS | **aucune dimension interdite déclarée pour FIS/MEFI** (note au 01 : le camouflage vient du thème — l'état après ruptures et l'intimité/méfiance naissante se répondent — pas du placement) |
| c3 — 1 trame par bloc uniforme | ✅ PASS | **trames ancrées : 3·6·9·12·15·18·22·26** — un bloc = 2-3 items + 1 trame (par construction) |
| c4 — distance intra-dimension ≥ 3 | ✅ **PASS STRICT (0 déficit)** | **finding V10** : les ancres réelles {3,6,9,12,15,18,22,26} laissent 18 positions libres admettant un placement sans violation — rsq {1,4,7,10,14,17,21,24} · integration {2,8,11,19,23} · etat {5,13,16,20,25} : toutes les paires intra-famille à distance ≥ 3 (l'estimation initiale « minimum 9 » était fondée sur des ancres supposées — corrigée au constat, le cadrage s'ajuste au constat) |
| c5 — alternance D/I (run max 2) | ✅ PASS | run max réel : **2** — les 17 D (9 carte + 8 trames) restent séparés par les 9 I |
| c6 — ordre de passation ≠ ordre des codes | ✅ PASS | le 1ᵉʳ item vu est Q4.2-17 ≠ 01, 02… |

## Trace de course (réelle)

| Champ | Valeur réelle |
|---|---|
| `graine_finale` | 242427 |
| `tentatives` | 1 |
| `trace_c6` | « re-tirage non nécessaire » |
| `outil` | `melange-heritage.py` v3 (dédié série M5) |
| `redemarrages_utilises` | 12 (arrêt doctrinal) |
| `objectif_final` | [0, 0, 0, 0, 7] — **toutes les contraintes dures à zéro** · 7 paires D/I adjacentes (composante douce — minimum arithmétique : 17 D / 9 I sur 26 positions avec ancres D imposent ≥ 7 paires) |
| `echanges` | trace complète archivée (`ci/resultats-melange/4.2.json`) |
| `positions_par_axe` | rsq {1,4,7,10,14,17,21,24} · integration {2,8,11,19,23} · etat {5,13,16,20,25} |
| `positions_trames` | [3, 6, 9, 12, 15, 18, 22, 26] |
| `run_max` | 2 |

## Reproductibilité

```
python3 ci/outils/melange-heritage.py ci/quetes/4.2.json
```

reproduit la séquence de référence ci-dessus (graine 242427, tentative 1). **5 passes rejouées :
sorties identiques octet pour octet** (empreinte unique). Outils antérieurs INTACTS. Config de
la course : `ci/quetes/4.2.json` · résultats réels archivés : `ci/resultats-melange/4.2.json`.

## Finding — c4 strict au constat (mission V10 — le cadrage s'ajuste au constat)

- **Estimation initiale** (recon) : « c4 infaisable strict, minimum constructible 9 » — fondée
  sur des ancres supposées {4,8,12,16,19,22,25,26}.
- **Constat réel** : `divmod(26, 8) = (3, 2)` porte le reste sur les DERNIERS blocs → ancres
  {3,6,9,12,15,18,22,26} → les 18 positions libres admettent un placement **sans déficit**
  (démonstration par placement réel : rsq {1,4,7,10,14,17,21,24} etc.).
- **Ajustement** : c4_min_constructible = 0 — **PASS STRICT**, obtenu 0. La règle « jamais un
  verdict non atteignable » est respectée des deux côtés : ni verdict déclaré infaisable qui
  ne l'était pas, ni minimum non atteint.

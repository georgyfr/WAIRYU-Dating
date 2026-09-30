# LIVRABLE 2 — PLAN DE MÉLANGE (graine réelle 253427 — outil générique melange.py)

> Résultat RÉEL de l'outil générique `ci/outils/melange.py` (graine 253427, 1 tentative).
> **5 passes rejouées : sorties identiques octet pour octet** (empreinte unique
> `59527dae50a2be1b1a8827de6fd2fdda` — identique à l'enregistrement V11 du worklog, Task 21 :
> le plan de mélange dépend des codes, orientations et dimensions — pas des énoncés perdus —
> la structure reconstruite est donc fidèle à la 1ʳᵉ génération, constat mesuré et consigné).

## Graine dérivée (convention concaténée)

- **Graine : 210427 (graine-mère du Socle) + 1000 × ordinal 43 = 253427.**
- Convention (doctrine mission V9, étendue V10/V11) : ordinals en lecture CONCATÉNÉE —
  quête 5.3 → (5−1)×10+3 = **43**.
- **Graine gelée V11 re-prise à l'identique** (spécification Task 21) : la 2ᵉ génération
  hérite de la graine de la 1ʳᵉ — aucun re-tirage, aucun déplacement.
- **Aucun re-tirage** : la graine 253427 est issue du premier tirage (tentative 1,
  `trace_c6` : « re-tirage non nécessaire »).

## Statut de la config — « À CRÉER » (note de passation)

> ✅ **La config canonique `ci/quetes/5.3.json` a été CRÉÉE par la session principale**
> (10 items Q5.3-01 → Q5.3-10, orientations et dimensions du tableau 01, graine 253427) et la
> **course canonique d'après dépôt a été exécutée** : elle reproduit la séquence ci-dessous
> **octet pour octet** (empreinte `59527dae…` — identique à la pré-validation du sous-agent ET à
> l'enregistrement V11 du worklog Task 21). **Archive créée** : `ci/resultats-melange/5.3.json`.

```
GRAINE .................. 253427 (gelée V11, re-prise à l'identique — reproductible)
OUTIL ................... ci/outils/melange.py (générique — aucune trame, pas d'outil dédié requis)
ALGORITHME .............. Fisher-Yates seedé + réparation déterministe (hill-climbing seedé)
ORDRE DE PASSATION ...... la séquence ci-dessous (JAMAIS l'ordre des codes)
PARTICULARITÉS .......... 10 carte (5 canaux × 2, 1 paire R6 par canal) — AUCUNE trame hébergée
                          c1 PASS (0 adjacence) · c2/c3 sans-objet (0 trame) · c4 PASS (0 déficit)
                          c5 PASS (run max 2) · c6 PASS
```

## Séquence d'ordre de passation (artefact de référence — réel)

| Pos | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| Code | **07** | **10** | **01** | **06** | **08** | **09** | **04** | **05** | **02** | **03** |
| Canal | attentions | contact | mots | gestes | attentions | contact | temps | gestes | mots | temps |
| Or. | D | I | D | I | I | D | I | D | I | D |

Rappel : les codes sont gelés et définitifs ; l'ordre de **passation** est celui du plan de
mélange, jamais l'ordre des codes. Ici le 1ᵉʳ item vu est Q5.3-07 (l'objet qui pense à toi),
le dernier est Q5.3-03 (le temps sans écran). **Positions par canal (réel)** :
attentions {1, 5} · contact {2, 6} · mots {3, 9} · gestes {4, 8} · temps {7, 10}.

## Table de vérification (6 contraintes — verdicts RÉELS)

| Contrainte | Verdict | Détail |
|---|---|---|
| c1 — aucune dimension consécutive | ✅ PASS | **0 adjacence réelle** — les 5 canaux alternent sans paire consécutive sur les 10 positions |
| c2 — trames jamais adjacentes aux dimensions interdites | ✅ PASS sans-objet | **0 trame hébergée** — 5.3 est une quête 100 % carte (concepts publics, aucun contenu signal ▲) |
| c3 — 1 trame par bloc uniforme | ✅ PASS sans-objet | 0 trame — aucune position ancrée |
| c4 — distance intra-dimension ≥ 3 | ✅ PASS | **0 déficit** — paires intra-canal toutes à distance ≥ 3 : attentions 1↔5 (4) · contact 2↔6 (4) · mots 3↔9 (6) · gestes 4↔8 (4) · temps 7↔10 (3) |
| c5 — alternance D/I (run max 2) | ✅ PASS | run max réel : **2** (positions 4-5) — 5 D / 5 I équilibrés |
| c6 — ordre de passation ≠ ordre des codes | ✅ PASS | le 1ᵉʳ item vu est Q5.3-07 ≠ 01, 02… |

## Trace de course (réelle)

| Champ | Valeur réelle |
|---|---|
| `graine_finale` | 253427 |
| `tentatives` | 1 |
| `trace_c6` | « re-tirage non nécessaire » |
| `outil` | `melange.py` (générique — 10 items carte, aucune trame, aucune ancre) |
| `objectif_final` | [0, 0, 0, 0, 0, 1] — 0 adjacence (c1) · 0 c2 · 0 déficit (c4) · 0 dépassement de run · 0 bloc long · **1 paire de même orientation adjacente = composante douce** (positions 4-5 : 06×08 — minimum arithmétique courant, même configuration que V11) |
| `echanges` | 4 échanges — trace complète : `pos 4 ↔ 7 · pos 3 ↔ 7 · pos 7 ↔ 2 · pos 3 ↔ 2` (archivés : `ci/resultats-melange/5.3.json`) |
| `positions_par_canal` | attentions : 1, 5 · contact : 2, 6 · mots : 3, 9 · gestes : 4, 8 · temps : 7, 10 |
| `positions_trames` | [] (aucune trame) |
| `run_max` | 2 |
| `empreinte` | `59527dae50a2be1b1a8827de6fd2fdda` — **identique à l'enregistrement V11 (worklog Task 21)** |

## Reproductibilité

```
python3 ci/outils/melange.py ci/quetes/5.3.json
```

reproduira la séquence de référence ci-dessus (graine 253427, tentative 1) — **dès la création
de la config canonique par la session principale** ; le contenu de la config est intégralement
déterminé par le tableau 01 (codes, orientations, dimensions). **5 passes rejouées : sorties
identiques octet pour octet** (empreinte unique ci-dessus).

## Finding — fidélité structurelle de la 2ᵉ génération (constat mesuré, consigné)

- L'empreinte de sortie `59527dae…` reproduit **exactement** celle consignée pour 5.3 à la
  vague V11 (worklog Task 21 : « md5 a6be5bf0… / 1071cc9a… / 59527dae… / d5039ff8… »).
- Lecture : le mélange ne dépend que des codes, orientations, dimensions et de la graine —
  tous reconstruits conformément à la spécification gelée. **La structure de passation 2ᵉ
  génération est donc identique octet pour octet à celle de la 1ʳᵉ**, alors même que les
  énoncés (perdus) ont été réécrits. La reconstruction est validée par la machine, pas
  devinée — à consigner au comité comme preuve de fidélité du cadre.

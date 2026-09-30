# LIVRABLE 2 — PLAN DE MÉLANGE (graine dérivée 261427 — course réelle à la charge de la session principale)

> **Passation principale = 12 items (10 carte + 2▲ CMP)** · le sous-bloc sérénité (4 items) est **HORS mélange**
> (bloc fixe — opt-in renforcé, documenté ci-dessous).
> **AUCUNE course exécutée par ce sous-agent** (interdit processus mission) : la config `ci/quetes/6.1.json` est
> **À CRÉER par la session principale**, qui exécutera la course canonique et archivera
> `ci/resultats-melange/6.1.json`. Le présent plan documente la dérivation de la graine, les **ancres attendues
> {6, 12}**, la faisabilité des 6 contraintes (analyse + **démonstration de faisabilité manuelle** — PAS une
> course) et le contenu exact de la config de référence.

## Graine dérivée (règle de décade — décades vérifiées)

- **Graine : 210427 (graine-mère du Socle) + 1000 × ordinal 51 = 261427.**
- Ordinal = lecture décimale ((a−1)×10+b) : 6.1 → (5×10)+1 = **51** (décade 50 — le premier monde de la décade).
- Table de la décade M8/M9 : **6.1 → 51 → 261427 (cette quête)** · 6.2 → 52 → 262427 (réservé) ·
  6.3 → 53 → 263427 (réservé) · 6.4 → 54 → 264427 (réservé) · 6.5 → 55 → 265427 (réservé).
- Cohérence de la chaîne vérifiée sur les précédents : 3.1 → 21 · 4.1 → 31 · 5.1 → 41 · 5.4 → 44.
- **Aucune collision (vérification machine, 2026-09-30)** : les 27 configs actives de `ci/quetes/` portent les
  graines 23427-25427, 211427-214427, 216427, 219427, 220427, 222427, 227427, 231427-236427, 241427, 242427,
  251427-257427 — **261427 absente** (262427-265427 libres également).
- **Aucun re-tirage** : la graine 261427 est issue du premier tirage dérivable (tentative attendue 1 — à
  confirmer à la course, `trace_c6` : « re-tirage non nécessaire »).

## Outillage — l'outil GÉNÉRIQUE suffit

12 items (10 carte + 2 trames) : l'outil générique `ci/outils/melange.py` porte la gestion des trames
(**c3 par construction** — ancres divmod en fin de blocs) et la réparation déterministe (les ancres restent
fixes). Aucun outil dédié requis — les outils `melange-heritage.py` v3 et `melange-biaxes.py` restent INTACTS
et non consommés.

```
GRAINE .................. 261427 (gelée mission V13.A — reproductible)
OUTIL ................... ci/outils/melange.py (générique — c3 divmod actif, 2 trames)
ALGORITHME .............. Fisher-Yates seedé + réparation déterministe (6 contraintes)
ORDRE DE PASSATION ...... la séquence produite par la course canonique (JAMAIS l'ordre des codes)
PARTICULARITÉS .......... 10 carte (3 dimensions : 3+3+4) + 2▲ CMP hébergées (T51-T52, D uniforme)
                          SOUS-BLOC SÉRÉNITÉ (S01→S04) HORS MÉLANGE — absent de la config (bloc fixe)
                          c1 faisable · c2 PASS sans interdit déclaré · c3 ancres attendues {6, 12}
                          c4 faisable · c5 faisable (5 D / 5 I carte — runs max 2 autour des 2 ancres D)
                          c6 attendu PASS (re-tirage non nécessaire — à confirmer à la course)
CONFIG .................. ci/quetes/6.1.json — À CRÉER (session principale) · ARCHIVE : ci/resultats-melange/6.1.json
ARCHIVE ................. ci/resultats-melange/6.1.json — À ARCHIVER (session principale)
```

## Configuration de référence (contenu exact de `ci/quetes/6.1.json` à créer — session principale)

> Champs racine : `quete: "6.1"` · `titre: "Ta vie intime — l'essentiel"` · `graine: 261427` · `c5_run_max: 2`
> · **aucune `c2_dimensions_interdites`** (le camouflage des trames vient du THÈME de la quête — règle
> d'indiscernabilité Partie 0 : aucune dimension carte ne « brûle » ses voisines, la c2 tombe à 0 violation
> par construction) · items dans l'ordre ci-dessous (carte 01→10 puis trames T51→T52).
> **Les 4 items sérénité (S01→S04) ne figurent PAS dans la config** : bloc fixe hors mélange (voir section dédiée).

| Code | Or. | Dimension | Signal |
|---|---|---|---|
| Q6.1-01 | D | desir | — |
| Q6.1-02 | I | desir | — |
| Q6.1-03 | I | desir | — |
| Q6.1-04 | D | intention | — |
| Q6.1-05 | I | intention | — |
| Q6.1-06 | D | intention | — |
| Q6.1-07 | D | communication | — |
| Q6.1-08 | I | communication | — |
| Q6.1-09 | D | communication | — |
| Q6.1-10 | I | communication | — |
| Q6.1-T51 | D | null | CMP |
| Q6.1-T52 | D | null | CMP |

(format des items trames conforme au précédent 5.4 : `dimension: null`, champ `signal`.)

## Ancres attendues — divmod (gelé mission, vérifié sur l'outil)

- **divmod(12, 2) = (6, 0)** — reste nul : deux blocs uniformes de 6 items, chaque bloc se terminant par sa
  trame → **ancres attendues {6, 12}** (T51 en position 6, T52 en position 12 — l'ordre des codes est gelé :
  T51 ouvre, T52 ferme).
- Distances inter-ancres : **6** (une seule distance — la chaîne est régulière par construction).
- Les ancres sont **gelées par l'outil** (c3 par construction — la réparation ne les touche jamais).
- Conséquence structurelle consignée : **T51 en tête de deuxième demi-chaîne (position 6) et T52 en fin de
  chaîne (position 12)** — artefact de l'ordre gelé des codes, aucune manipulation permise. Les positions ne
  sortent jamais de la production (métadonnée moteur).

## Analyse de faisabilité des 6 contraintes (analyse pré-course — verdicts réels à la course)

| Contrainte | Statut | Détail |
|---|---|---|
| c1 — aucune dimension consécutive | faisable → **PASS attendu** | 3 dimensions (3+3+4) sur 10 slots carte — interlacement trivial (démonstration ci-dessous, 0 adjacence) |
| c2 — trames jamais adjacentes aux dimensions interdites | **PASS sans interdit** | **aucune dimension interdite déclarée** (config de référence) — le camouflage vient du THÈME (règle d'indiscernabilité Partie 0) → 0 violation par construction |
| c3 — 1 trame par bloc uniforme | **PASS par construction** | ancres divmod — **attendues {6, 12}** (divmod(12,2)=(6,0), reste nul — aucun artefact de répartition, contrairement au précédent 5.4) |
| c4 — distance intra-dimension ≥ 3 | faisable → **PASS attendu** | démonstration ci-dessous : desir {2,5,9} · intention {3,7,10} · communication {1,4,8,11} — toutes les distances intra-dimension ≥ 3 |
| c5 — alternance D/I (run max 2) | faisable → **PASS attendu** | 7 D / 5 I (5 D / 5 I carte + 2 D trames) — **runs max 2 constructibles autour des 2 ancres D** (démonstration ci-dessous) |
| c6 — ordre de passation ≠ ordre des codes | **PASS attendu** | le 1ᵉʳ item vu ≠ Q6.1-01 avec probabilité écrasante (re-tirage non nécessaire attendu) |

## Démonstration de faisabilité manuelle (PAS une course — les verdicts réels sortent de `melange.py`)

> Construction à la main, prouvant que les six contraintes admettent une solution avec marge. La course
> canonique de la session principale produira **sa propre** séquence (l'outil est déterministe sur la config ;
> cette démonstration n'est pas celle-ci).

| Pos | 1 | 2 | 3 | 4 | 5 | **6** | 7 | 8 | 9 | 10 | 11 | **12** |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Code (démo) | 08 | 01 | 04 | 10 | 02 | **T51** | 05 | 07 | 03 | 06 | 09 | **T52** |
| Dimension | communication | desir | intention | communication | desir | ▲CMP | intention | communication | desir | intention | communication | ▲CMP |
| Or. | I | D | D | I | I | **D** | I | D | D | I | D | **D** |

- **c1** : aucune dimension consécutive (communication → desir → intention → … sans répétition adjacente). ✅
- **c4** : desir {2, 5, 9} — distances 3·4 ; intention {3, 7, 10} — distances 4·3 ; communication {1, 4, 8, 11}
  — distances 3·4·3. Toutes ≥ 3 — **0 déficit**. ✅
- **c5** : runs d'orientations I · DD · II · D · I · DD · I · DD — **run max 2**, 4 paires adjacentes de même
  orientation (composante douce, marge large — l'objectif final attendu est de l'ordre de [0,0,0,0,0,4±],
  à constater à la course). ✅
- **c6** : le 1ᵉʳ item vu (08) ≠ l'ordre des codes. ✅
- **Contrainte critique des ancres D (gelée mission — « runs max 2 autour des 2 ancres D »)** : les positions
  5 et 7 **ne peuvent pas être D toutes les deux** (sinon run D sur 5-6-7) ; la position 11 en D forme un run
  de 2 avec l'ancre 12 (acceptable). Avec 5 D carte sur 10 slots, la marge de réparation est large. ✅

## Le sous-bloc sérénité — HORS mélange (documenté, gelé mission)

- Les 4 items **Q6.1-S01 → S04** forment un **bloc fixe** : ordre de passation **S01 → S04** (jamais mélangés),
  absent de la config `ci/quetes/6.1.json` — **c1/c4 sans-objet pour ce bloc** (pas de mélange, donc pas de
  contrainte de placement) · **c2/c3 sans-objet** (zéro trame) · c5 sans-objet (ordre fixe — l'alternance
  D/I n'est pas un enjeu de placement).
- **Opt-in renforcé DISTINCT du module principal** : le sous-module s'ouvre séparément, à la demande, après
  la passation principale — jamais imposé, jamais depuis une notification qui presserait.
- **Zéro trame** dans le sous-module ; **REN compatible** (ressources bienveillantes uniquement).
- Orientation **3 D / 1 I** (S03 en I contre l'aquiescement — décision de composition n° 3 au 01).

## Notes de sécurité (règle 11-b) et points de reprise

- La présente trace porte les **codes, orientations, dimensions et positions attendues** — jamais un énoncé
  de trame. Les 2 formulations T51-T52 vivront exclusivement à la **Partie 10** du document trames confidentiel,
  hors dépôt (à graver par le comité — aucune réinvention). La config `ci/quetes/6.1.json` à créer porte codes
  + orientation + `signal` — **jamais d'énoncé** (précédent 5.4).
- **À la charge de la session principale** : création de la config (contenu exact ci-dessus) · course canonique
  `python3 ci/outils/melange.py ci/quetes/6.1.json` · vérification des ancres réelles = {6, 12} · archivage
  `ci/resultats-melange/6.1.json` (5 passes rejouées, empreinte md5) · report des verdicts réels c1-c6 au
  présent plan (la table « verdicts attendus » devient « verdicts réels »).
- Le plan de mélange ne dépend **pas des énoncés** (codes, orientations, dimensions, graine seuls) — les
  énoncés de ce dossier (B.3 première émission) ne peuvent pas influencer la course.

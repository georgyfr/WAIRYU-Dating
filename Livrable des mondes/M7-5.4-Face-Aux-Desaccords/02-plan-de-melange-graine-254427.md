# LIVRABLE 2 — PLAN DE MÉLANGE (graine réelle 254427 — outil générique melange.py)

> Résultat RÉEL de l'outil générique `ci/outils/melange.py` (graine 254427, 1 tentative).
> **5 passes rejouées : sorties identiques octet pour octet** (empreinte unique
> `6bfde6195b275f719d4f6e720c4c46cb`).
> **Course canonique exécutée d'après dépôt** sur la configuration canonique documentée
> ci-dessous (la config `ci/quetes/5.4.json` a été **CRÉÉE par la session principale**, qui a archivé
> `ci/resultats-melange/5.4.json`) — l'outil est déterministe : la course de la session principale,
> sur cette configuration, reproduit cette sortie octet pour octet.

## Graine dérivée (règle de décade — décade M6/M7 = 40)

- **Graine : 210427 (graine-mère du Socle) + 1000 × ordinal 44 = 254427.**
- Ordinal = lecture décimale ((a−1)×10+b) : 5.4 → (4×10)+4 = **44**.
- Table de la vague : 5.1 → 41 → 251427 · 5.2 → 42 → 252427 · 5.3 → 43 → 253427 · **5.4 → 44 →
  254427 (cette quête)** · 5.5 → 45 (réservé V12) · 5.6 → 46 (réservé V12) · 5.7 → 47 → 257427.
- Cohérence de la chaîne vérifiée sur les précédents : 3.1 → 21 · 4.1 → 31.
- **Aucune collision** : 254427 jamais attribuée au dépôt (les configs actives de `ci/quetes/`
  couvrent 23427-25427, 211427-242427, 251427, 252427, 253427, 257427 — vérification machine sur
  les 24 configs ; 254427 absente).
- **Aucun re-tirage** : la graine 254427 est issue du premier tirage (tentative 1,
  `trace_c6` : « re-tirage non nécessaire »).

## Outillage — l'outil GÉNÉRIQUE suffit

23 items (15 carte + 8 trames) : l'outil générique `melange.py` porte la gestion des trames
(**c3 par construction** — ancres divmod en fin de blocs) et la réparation déterministe
(les ancres restent fixes). Aucun outil dédié requis — les outils `melange-heritage.py` v3
restent INTACTS et non consommés.

```
GRAINE .................. 254427 (gelée mission V12 — reproductible)
OUTIL ................... ci/outils/melange.py (générique — c3 divmod actif, 8 trames)
ALGORITHME .............. Fisher-Yates seedé + réparation déterministe (6 contraintes)
ORDRE DE PASSATION ...... la séquence ci-dessous (JAMAIS l'ordre des codes)
PARTICULARITÉS .......... 15 carte (5 postures × 3 items) + 8▲ hébergées (T43-T50, D uniforme)
                          c1 PASS (0 adjacence) · c2 PASS (0 interdit déclaré — 0 violation)
                          c3 PASS (par construction — ancres réelles {2,5,8,11,14,17,20,23})
                          c4 PASS (0 déficit) · c5 PASS (run max 2) · c6 PASS
CONFIG .................. ci/quetes/5.4.json — CRÉÉE (session principale) · ARCHIVE : ci/resultats-melange/5.4.json
ARCHIVE ................. ci/resultats-melange/5.4.json — À ARCHIVER (session principale)
```

## Configuration de référence (contenu exact de `ci/quetes/5.4.json` à créer — session principale)

> Champs racine : `quete: "5.4"` · `titre: "Face aux désaccords"` · `graine: 254427` · `c5_run_max: 2`
> · **aucune `c2_dimensions_interdites`** (le camouflage des trames vient du THÈME de la quête —
> règle d'indiscernabilité Partie 0 : aucune dimension carte ne « brûle » ses voisines, la c2 tombe
> à 0 violation par construction) · items dans l'ordre ci-dessous (carte 01→15 puis trames T43→T50).

| Code | Or. | Dimension | Signal |
|---|---|---|---|
| Q5.4-01 | D | affirmation | — |
| Q5.4-02 | I | affirmation | — |
| Q5.4-03 | I | affirmation | — |
| Q5.4-04 | D | cooperation | — |
| Q5.4-05 | I | cooperation | — |
| Q5.4-06 | I | cooperation | — |
| Q5.4-07 | D | compromis | — |
| Q5.4-08 | I | compromis | — |
| Q5.4-09 | D | compromis | — |
| Q5.4-10 | D | evitement | — |
| Q5.4-11 | I | evitement | — |
| Q5.4-12 | D | evitement | — |
| Q5.4-13 | D | cession | — |
| Q5.4-14 | I | cession | — |
| Q5.4-15 | I | cession | — |
| Q5.4-T43 | D | null | JR1 |
| Q5.4-T44 | D | null | JR1 |
| Q5.4-T45 | D | null | JR1 |
| Q5.4-T46 | D | null | JR1 |
| Q5.4-T47 | D | null | SD |
| Q5.4-T48 | D | null | SD |
| Q5.4-T49 | D | null | SD |
| Q5.4-T50 | D | null | SD |

(format des items trames conforme au précédent 1.1 : `dimension: null`, champ `signal`.)

## Analyse de faisabilité des 6 contraintes (analyse pré-course + verdicts réels)

| Contrainte | Statut | Détail |
|---|---|---|
| c1 — aucune dimension consécutive | faisable → **PASS confirmé** | 5 postures × 3 items sur 15 slots carte (23 positions avec 8 ancres) — **0 adjacence réelle** |
| c2 — trames jamais adjacentes aux dimensions interdites | **PASS sans interdit** | **aucune dimension interdite déclarée** (config de référence) — le camouflage vient du THÈME (règle d'indiscernabilité Partie 0) → 0 violation par construction |
| c3 — 1 trame par bloc uniforme | **PASS par construction** | ancres divmod — **réel {2, 5, 8, 11, 14, 17, 20, 23}** (voir finding ci-dessous) |
| c4 — distance intra-dimension ≥ 3 | faisable → **PASS confirmé** | **0 déficit** — toutes les distances intra-posture ≥ 3 (table réelle ci-dessous) |
| c5 — alternance D/I (run max 2) | faisable → **PASS confirmé** | 15 D / 8 I — **run max réel 2** ; arithmétique tendue documentée (finding n° 2) |
| c6 — ordre de passation ≠ ordre des codes | **PASS confirmé** | le 1ᵉʳ item vu est Q5.4-12 ≠ 01-15 — re-tirage non nécessaire |

## FINDING ARITHMÉTIQUE n° 1 — les ancres divmod réelles (consigné, comité)

- La mission V12 attendait les ancres **{3, 6, 9, 12, 15, 18, 21, 23}** — arrangement où les blocs
  longs (3 items) ouvrent la chaîne (tailles [3,3,3,3,3,3,3,2], fin de chaîne resserrée : deux
  trames à distance 2 — le « défaut » anticipé par la mission, « documenter le minimum constructible »).
- **L'outil réel fait l'inverse** : `divmod(23, 8) = (2, 7)` — le reste (+1) s'ajoute aux blocs
  **fin de table** (`i >= n_trames − reste`) → tailles **[2, 3, 3, 3, 3, 3, 3, 3]** → ancres
  **{2, 5, 8, 11, 14, 17, 20, 23}** — distances inter-ancres **uniformes 3·3·3·3·3·3·3**.
- **Le « défaut » anticipé ne se produit PAS** : le minimum constructible documenté par la mission
  n'a pas eu à être activé — la chaîne réelle est plus régulière que l'attendu (bloc court en tête,
  pas en queue). Constat mesuré sur la course réelle, consigné — À VALIDER PAR LE COMITÉ
  (l'attendu mission était une prévision arithmétique, pas une valeur gelée).
- Conséquence structurelle consignée : les codes trames étant ancrés dans l'ordre du fichier
  (T43→T50), la famille **JR1 occupe {2, 5, 8, 11}** et la famille **SD {14, 17, 20, 23}** —
  regroupement par moitié de chaîne, artefact de l'ordre gelé des codes. Aucune manipulation
  permise (les ancres sont gelées par l'outil ; réordonner la config pour « mélanger » les familles
  reviendrait à manipuler l'ancrage — interdit). Les positions ne sortent jamais de la production
  (métadonnée moteur).

## FINDING ARITHMÉTIQUE n° 2 — l'arithmétique tendue du c5 (documentée, comité)

- 8 trames **D uniformes** + 15 carte (7 D / 8 I) = **15 D / 8 I** sur 23 positions, ancres D fixes
  distantes de 3 : chaque inter-ancre porte exactement deux slots carte, et un inter-ancre ne peut
  pas être vide d'au moins une paire de même orientation (D-x-x-D contient une paire D-D, I-I ou
  mixte-D-D selon la composition — démonstration exhaustive : les 7 inter-ancres + la tête portent
  la contrainte).
- **Borne analytique : 7 paires adjacentes de même orientation** (une D-D par inter-ancre, la tête
  en I, zéro paire I-I). **Réalisé : 8** (7 D-D + 1 I-I — positions 12-13 : la réparation
  déterministe, gloutonne à diminution stricte, ne franchit pas les plateaux : ramener le I-I à 0
  exigerait un échange neutre en nombre de paires). Écart +1 au minimum constructible —
  **composante douce structurelle assumée, consignée** (`objectif_final [0,0,0,0,0,8]`).
- **Le run max 2 tient partout** (7 runs D de longueur 2, aucun run 3) — le verdict c5 est PASS :
  c'est la densité de paires adjacentes (composante douce), pas l'alternance, qui porte la tension.
- Choix d'orientations lié : 8 I (pivots 2 D / 3 I) = couverture des huit inter-ancres **avec une
  marge** ; 7 I (pivots 3 D / 2 I) = couverture exacte **sans marge** — rejeté (la variante rendrait
  la réparation impossible à la moindre contrainte supplémentaire). Démonstration au 01 (décision n° 2).

## Séquence d'ordre de passation (artefact de référence — réel)

| Pos | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Code | **12** | **T43** | **15** | **09** | **T44** | **14** | **10** | **T45** | **08** | **01** | **T46** | **05** | **02** | **T47** | **04** | **03** | **T48** | **07** | **11** | **T49** | **06** | **13** | **T50** |
| Posture | éviter | ▲JR1 | céder | compromettre | ▲JR1 | céder | éviter | ▲JR1 | compromettre | affirmer | ▲JR1 | coopérer | affirmer | ▲SD | coopérer | affirmer | ▲SD | compromettre | éviter | ▲SD | coopérer | céder | ▲SD |
| Or. | D | **D** | I | D | **D** | I | D | **D** | I | D | **D** | I | I | **D** | D | I | **D** | D | I | **D** | I | D | **D** |

Rappel : les codes sont gelés et définitifs ; l'ordre de **passation** est celui du plan de
mélange, jamais l'ordre des codes. Ici le 1ᵉʳ item vu est Q5.4-12 (laisse refroidir avant de
revenir), le dernier est la trame Q5.4-T50. **Positions par posture (réel)** : affirmer {10, 13,
16} · coopérer {12, 15, 21} · compromettre {4, 9, 18} · éviter {1, 7, 19} · céder {3, 6, 22}.
**Positions trames (réel)** : {2, 5, 8, 11, 14, 17, 20, 23} — JR1 {2, 5, 8, 11} · SD {14, 17, 20, 23}.

## Table de vérification (6 contraintes — verdicts RÉELS)

| Contrainte | Verdict | Détail |
|---|---|---|
| c1 — aucune dimension consécutive | ✅ PASS | **0 adjacence réelle** — les 5 postures alternent sans paire consécutive sur les 23 positions |
| c2 — trames jamais adjacentes aux dimensions interdites | ✅ PASS (0 interdit déclaré) | aucune `c2_dimensions_interdites` dans la config — camouflage par le THÈME (Partie 0) |
| c3 — 1 trame par bloc uniforme | ✅ PASS (par construction) | ancres réelles {2, 5, 8, 11, 14, 17, 20, 23} — T43→T50 dans l'ordre gelé des codes |
| c4 — distance intra-dimension ≥ 3 | ✅ PASS | **0 déficit** — distances intra-posture : affirmer 3·3 · coopérer 3·6 · compromettre 5·9 · éviter 6·12 · céder 3·16 — toutes ≥ 3 |
| c5 — alternance D/I (run max 2) | ✅ PASS | run max réel : **2** — 15 D / 8 I ; 8 paires adjacentes de même orientation (borne analytique 7 — composante douce documentée, finding n° 2) |
| c6 — ordre de passation ≠ ordre des codes | ✅ PASS | le 1ᵉʳ item vu est Q5.4-12 ≠ 01, 02… |

## Trace de course (réelle — config de référence, hors dépôt)

| Champ | Valeur réelle |
|---|---|
| `graine_finale` | 254427 |
| `tentatives` | 1 |
| `trace_c6` | « re-tirage non nécessaire » |
| `outil` | `melange.py` (générique — c3 divmod actif, ancres fixes) |
| `objectif_final` | [0, 0, 0, 0, 0, 8] — 0 adjacence (c1) · 0 c2 · 0 déficit (c4) · 0 dépassement de run · 0 bloc long · **8 paires de même orientation adjacente = composante douce structurelle** (borne analytique 7 — finding n° 2) |
| `echanges` | 2 échanges — trace complète : `pos 15 ↔ pos 19 · (0,0,1,5,2,12) → (0,0,0,3,1,10)` puis `pos 9 ↔ pos 4 · (0,0,0,3,1,10) → (0,0,0,0,0,8)` (archivés : `ci/resultats-melange/5.4.json`) |
| `positions_par_posture` | affirmer : 10, 13, 16 · coopérer : 12, 15, 21 · compromettre : 4, 9, 18 · éviter : 1, 7, 19 · céder : 3, 6, 22 |
| `positions_trames` | 2, 5, 8, 11, 14, 17, 20, 23 (JR1 : 2, 5, 8, 11 · SD : 14, 17, 20, 23) |
| `run_max` | 2 |
| `empreinte` | `6bfde6195b275f719d4f6e720c4c46cb` — **5 passes rejouées identiques octet pour octet** |

## Reproductibilité

```
python3 ci/outils/melange.py ci/quetes/5.4.json
```

reproduit la séquence de référence ci-dessus (graine 254427, tentative 1) — **course canonique
d'après dépôt EXÉCUTÉE par la session principale : séquence identique octet pour octet à la
trace ci-dessus** (empreinte `6bfde619…` retrouvée, 5 passes identiques). **Archive créée** :
`ci/resultats-melange/5.4.json`.

## Note de sécurité (règle 11-b)

Cette trace porte les **codes, positions et signaux** — jamais un énoncé de trame. Les 8 formulations
T43-T50 vivent exclusivement au document trames confidentiel, hors dépôt. La config `ci/quetes/5.4.json`
à créer porte codes + orientation + `signal` — **jamais d'énoncé** (précédent 1.1).

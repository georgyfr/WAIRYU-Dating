🗒️ quete: 6.2 · dossier: M8-6.2-Ta-Relation-Au-Desir · fiche: première émission V13.B (FM à graver à la consolidation) · session: 2026-09-30

# LIVRABLE 2 — PLAN DE MÉLANGE (graine réelle 262427 — outil générique melange.py · ANALYSE SEULE)

> **AUCUNE course exécutée par ce sous-agent** (interdit processus : NE lance PAS le mélange) — le présent
> plan porte l'analyse de faisabilité des 6 contraintes, la configuration de référence et une démonstration
> de constructibilité vérifiée à la main. La course réelle (outil `melange.py`, graine 262427) est à exécuter
> par la **session principale** après création de `ci/quetes/6.2.json` — l'outil étant déterministe, elle
> produira sa propre séquence dans la borne démontrée ici (précédent V13.A 6.1 : même voie analytique).

## Graine dérivée (règle de décade — quête 6.2 → ordinal 62)

- **Graine : 210427 (graine-mère du Socle) + 1000 × ordinal 52 = 262427.**
- Ordinal = lecture décimale ((a−1)×10+b) : 6.2 → (6−1)×10+2 = **52**. Décade du domaine de l'Intime : 60.
- Table de la vague V13 : 6.1 → 51 → 261427 (V13.A) · **6.2 → 52 → 262427 (cette quête)** · 6.3 → 53 →
  263427 (V13.C) · 6.4 → 54 · 6.5 → 55.
- **Aucune collision** : 262427 jamais attribuée au dépôt (vérification machine sur les 27 configs actives
  de `ci/quetes/` — liste relevée : 23427-25427, 211427-220427, 222427, 227427, 231427-242427, 251427-257427 ;
  262427 absente ; 261427 documentée par la quête 6.1 de la même vague).
- **Aucun re-tirage anticipé** : la graine est issue du premier tirage de la règle — la trace `trace_c6`
  (re-tirage ou non) sera consignée par la course de la session principale.

## Outillage — l'outil GÉNÉRIQUE suffit

20 items (15 carte + 5 trames) : l'outil générique `melange.py` porte la gestion des trames (**c3 par
construction** — ancres divmod en fin de blocs) et la réparation déterministe (les ancres restent fixes).
Aucun outil dédié requis — les outils `melange-heritage.py` v3 restent INTACTS et non consommés.

```
GRAINE .................. 262427 (gelée mission V13.B — reproductible)
OUTIL ................... ci/outils/melange.py (générique — c3 divmod actif, 5 trames)
ALGORITHME .............. Fisher-Yates seedé + réparation déterministe (6 contraintes)
ORDRE DE PASSATION ...... la séquence produite par la course (JAMAIS l'ordre des codes)
PARTICULARITÉS .......... 15 carte (6 température + 3 initiation + 6 fusion) + 5▲ COC (T53-T57, D uniforme)
                          c1 PASS attendu · c2 PASS (0 interdit déclaré — 0 violation)
                          c3 PASS (par construction — ancres attendues {4, 8, 12, 16, 20})
                          c4 PASS attendu (7 sous-dimensions — finding n° 1) · c5 PASS attendu (run max 2)
                          c6 PASS attendu
CONFIG .................. ci/quetes/6.2.json — À CRÉER (session principale)
ARCHIVE ................. ci/resultats-melange/6.2.json — À ARCHIVER (session principale)
```

## Configuration de référence (contenu exact de `ci/quetes/6.2.json` à créer — session principale)

> Champs racine : `quete: "6.2"` · `titre: "Ta relation au désir"` · `graine: 262427` · `c5_run_max: 2`
> · **aucune `c2_dimensions_interdites`** (le camouflage des trames vient du THÈME de la quête — la dynamique
> d'initiation et le refus sont le sujet déclaré du bloc B — règle d'indiscernabilité Partie 0) · items dans
> l'ordre ci-dessous (carte 01→15 puis trames T53→T57).

| Code | Or. | Dimension | Signal |
|---|---|---|---|
| Q6.2-01 | D | temp_elevee | — |
| Q6.2-02 | I | temp_elevee | — |
| Q6.2-03 | D | temp_neutre | — |
| Q6.2-04 | I | temp_neutre | — |
| Q6.2-05 | D | temp_basse | — |
| Q6.2-06 | I | temp_basse | — |
| Q6.2-07 | D | initiation | — |
| Q6.2-08 | I | initiation | — |
| Q6.2-09 | D | initiation | — |
| Q6.2-10 | D | fusion_coeur | — |
| Q6.2-11 | I | fusion_coeur | — |
| Q6.2-12 | D | fusion_besoin | — |
| Q6.2-13 | I | fusion_besoin | — |
| Q6.2-14 | D | fusion_contexte | — |
| Q6.2-15 | I | fusion_contexte | — |
| Q6.2-T53 | D | null | COC |
| Q6.2-T54 | D | null | COC |
| Q6.2-T55 | D | null | COC |
| Q6.2-T56 | D | null | COC |
| Q6.2-T57 | D | null | COC |

(format des items trames conforme aux précédents 1.1/5.4/6.1 : `dimension: null`, champ `signal`.)

## FINDING ARITHMÉTIQUE n° 1 — la dimension unique est infaisable : 7 sous-dimensions (consigné, comité)

- La mission V13.B écrit « dimension `temperature` » (bloc A) et « dimension `fusion` » (bloc C) — lecture
  documentaire : ce sont des **familles** de dimension (le rendu et les docs les nomment ainsi). À la
  config, une dimension unique portée par **6 items** est **mathématiquement infaisable** sous c4 :
- **Démonstration** : avec 5 trames ancrées à {4, 8, 12, 16, 20}, les 15 slots carte forment 5 intervalles
  (1-3 · 5-7 · 9-11 · 13-15 · 17-19). Dans un intervalle de 3 slots consécutifs, la distance maximale entre
  deux slots vaut 2 < 3 : **un intervalle porte au plus 1 item d'une dimension donnée** (c4 : distance
  intra-dimension ≥ 3). 5 intervalles → **maximum 5 items par dimension** — le bloc A (6 items) et le bloc
  C (6 items) seraient en violation structurelle irréparable (la réparation ne peut pas franchir la borne).
- **Résolution (précédent 5.5 — 4 températures de tension × 2, une dimension par paire)** : la config porte
  **7 sous-dimensions** — `temp_elevee` (01×02) · `temp_neutre` (03×04) · `temp_basse` (05×06) ·
  `initiation` (07-09, 3 items — faisable : distances 4·4·8 dans la démonstration) · `fusion_coeur`
  (10×11) · `fusion_besoin` (12×13) · `fusion_contexte` (14×15). Les familles `temperature` et `fusion`
  survivent comme préfixes documentaires (00/01/03) — la mission gelée fait foi, consigné.
- **Couverture dimensions (analyse demandée par la mission)** : 7 sous-dimensions × 2-3 items · 3 familles
  rendues (TEMPÉRATURE · INITIATION · FUSION) · 1 signal trame (COC — hors dimensions).

## FINDING ARITHMÉTIQUE n° 2 — ancres strictement uniformes {4, 8, 12, 16, 20} (attendu mission = arrangement réel)

- `divmod(20, 5) = (4, 0)` — **reste nul** : `tailles = [4, 4, 4, 4, 4]` (l'outil n'ajoute le reste aux blocs
  fin de table que si `i >= n_trames − reste` ; reste 0 → aucun bloc allongé) → **ancres attendues
  {4, 8, 12, 16, 20}, distances inter-ancres uniformes 4·4·4·4**, chaque intervalle porte **exactement 3
  items carte** (« orientations carte à équilibrer entre ancres — 3 carte par intervalle », mission).
- Contrairement au précédent 5.4 (divmod(23, 8) = (2, 7) — reste non nul, bloc court en tête, divergence
  consignée), **l'attendu mission coincide ici avec l'arrangement réel de l'outil** : aucun finding de
  divergence divmod à consigner pour cette quête.
- Conséquence structurelle : les codes trames étant ancrés dans l'ordre du fichier (T53→T57), l'angle
  officiel T53 (blessure) occupe la position 4, T54 (humiliation) la 8, T55 (rejet global) la 12, T56
  (réinsistance) la 16, T57 (pression) la 20 — **ordre gelé des codes, aucune manipulation permise**. Les
  positions ne sortent jamais de la production (métadonnée moteur).

## Analyse de faisabilité des 6 contraintes (analyse pré-course — verdicts attendus)

| Contrainte | Statut | Détail |
|---|---|---|
| c1 — aucune dimension consécutive | faisable → **PASS attendu** | 7 sous-dimensions sur 15 slots carte (20 positions avec 5 ancres) — constructible (démonstration ci-dessous : 0 adjacence) |
| c2 — trames jamais adjacentes aux dimensions interdites | **PASS sans interdit** | **aucune dimension interdite déclarée** (config de référence) — le camouflage vient du THÈME (règle d'indiscernabilité Partie 0) → 0 violation par construction |
| c3 — 1 trame par bloc uniforme | **PASS par construction** | ancres divmod — **attendues {4, 8, 12, 16, 20}** (finding n° 2 — reste nul) |
| c4 — distance intra-dimension ≥ 3 | faisable → **PASS attendu** | 7 sous-dimensions × 2-3 items — constructible (démonstration : toutes les distances 4 à 9) |
| c5 — alternance D/I (run max 2) | faisable → **PASS attendu** | 13 D / 7 I (5 trames D uniformes + 8 D / 7 I carte) — run max 2 constructible (démonstration) |
| c6 — ordre de passation ≠ ordre des codes | faisable → **PASS attendu** | 20 items — une permutation identique à l'ordre des codes est quasi-impossible ; le re-tirage éventuel serait documenté par l'outil |

## Démonstration de constructibilité (vérifiée à la main — PAS une course de l'outil)

> Arrangement de référence pour PROUVER que c1 + c4 + c5 + c6 sont simultanément satisfaisables sous les
> ancres {4, 8, 12, 16, 20} et l'équilibre 8 D / 7 I. L'outil n'a pas été lancé ; la course réelle de la
> session principale produira SA séquence (probablement différente, également faisable — la borne est
> démontrée).

| Pos | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Code | 07 | 14 | 02 | **T53** | 09 | 04 | 01 | **T54** | 08 | 03 | 15 | **T55** | 05 | 11 | 12 | **T56** | 06 | 10 | 13 | **T57** |
| Famille | init. | fusion | temp. | ▲COC | init. | temp. | temp. | ▲COC | init. | temp. | fusion | ▲COC | temp. | fusion | fusion | ▲COC | temp. | fusion | fusion | ▲COC |
| Or. | D | D | I | **D** | D | I | D | **D** | I | D | I | **D** | D | I | D | **D** | I | D | I | **D** |

- **c1 — 0 adjacence** : les 10 paires adjacentes de slots carte portent toujours deux sous-dimensions
  différentes (init./fusion · fusion/temp. · init./temp. · temp./temp. NEUTRE×ÉLEVÉE · init./temp. ·
  temp./fusion · temp./fusion · fusion FUS_COEUR×FUS_BESOIN · temp./fusion · fusion FUS_COEUR×FUS_BESOIN).
- **c4 — 0 déficit** : temp_elevee {3, 7} · temp_neutre {6, 10} · temp_basse {13, 17} · initiation
  {1, 5, 9} (distances 4·4·8) · fusion_contexte {2, 11} · fusion_coeur {14, 18} · fusion_besoin
  {15, 19} — **toutes les distances intra-dimension valent 4 à 9 ≥ 3**.
- **c5 — run max 2** : séquence D D I · D · D I D · D · I D I · D · D I D · D · I D I · D — aucun run
  de 3 ; **3 carte par intervalle** (1-3 · 5-7 · 9-11 · 13-15 · 17-19), orientations équilibrées entre
  ancres ([D,D,I] · [D,I,D] · [I,D,I] · [D,I,D] · [I,D,I]) ; **8 D / 7 I carte** (paires 6 D/6 I ·
  initiation 2 D/1 I) + 5 trames D = 13 D / 7 I. Paires adjacentes de même orientation dans cette
  démonstration : 5 (objectif de démonstration — non revendiqué comme borne).
- **c6 — PASS** : le 1ᵉʳ item vu est Q6.2-07 ≠ Q6.2-01.

**Positions par sous-dimension (démonstration)** : temp_elevee {3, 7} · temp_neutre {6, 10} · temp_basse
{13, 17} · initiation {1, 5, 9} · fusion_contexte {2, 11} · fusion_coeur {14, 18} · fusion_besoin
{15, 19}. **Positions trames (attendues)** : {4, 8, 12, 16, 20} — T53→4 · T54→8 · T55→12 · T56→16 ·
T57→20 (ordre gelé des codes).

## Table de vérification (6 contraintes — attendus de la course)

| Contrainte | Verdict attendu | Détail |
|---|---|---|
| c1 — aucune dimension consécutive | ✅ PASS attendu | 0 adjacence constructible — démonstration ci-dessus |
| c2 — trames jamais adjacentes aux dimensions interdites | ✅ PASS (0 interdit déclaré) | aucune `c2_dimensions_interdites` dans la config — camouflage par le THÈME (Partie 0) |
| c3 — 1 trame par bloc uniforme | ✅ PASS (par construction) | ancres attendues {4, 8, 12, 16, 20} — T53→T57 dans l'ordre gelé des codes |
| c4 — distance intra-dimension ≥ 3 | ✅ PASS attendu | 7 sous-dimensions — démonstration : distances 4 à 9, 0 déficit |
| c5 — alternance D/I (run max 2) | ✅ PASS attendu | 13 D / 7 I — run max 2 constructible (démonstration) |
| c6 — ordre de passation ≠ ordre des codes | ✅ PASS attendu | re-tirage éventuel documenté par l'outil |

## Note de sécurité (règle 11-b)

Cette trace porte les **codes, positions et signaux** — jamais un énoncé de trame. Les 5 formulations
T53-T57 vivront exclusivement au document trames confidentiel, **Partie 10** (hors dépôt, à graver par le
comité — canal privé). La config `ci/quetes/6.2.json` à créer porte codes + orientation + `signal` —
**jamais d'énoncé** (précédents 1.1/5.4/6.1). Le sous-agent n'a lancé AUCUN mélange et n'a créé AUCUNE
config (interdits processus respectés).

## Reproductibilité (à exécuter par la session principale)

```
# 1) créer ci/quetes/6.2.json selon la configuration de référence ci-dessus
# 2) lancer la course canonique :
python3 ci/outils/melange.py ci/quetes/6.2.json
# 3) archiver la trace : ci/resultats-melange/6.2.json
```

La course produira la séquence officielle d'ordre de passation (graine 262427, tentative documentée) —
les verdicts c1-c6 réels remplaceront les « attendus » de la table ci-dessus.

# PACKAGE WTC-Q1-R1 — Révision post-validation (Quête 1 « Comment je me raccroche »)

Réponse de l'exécuteur (Data Insight, rôle strict) au rapport WTC-Q1 du run initial
(commit `3eb7399`, dossier `../validation-q1/`). Le **code du run initial est conservé
tel quel** ; les corrections portent exclusivement sur les paramètres et critères
imposés par l'orchestrateur (modifications D1-D5).

## Modifications appliquées

| Mod. | Objet | Contenu |
|---|---|---|
| D1 | SEM structurel | `SEM_axe = 0,195` (remplace sd_pop 0,65 / α 0,85 → SEM 0,2517) · CI90 = score ± 1,64 × 0,195 = ± 0,3198 · SE_face inchangé |
| D2 | C1 en 3 sous-critères | C1a couverture ∈ [87 % ; 95 %] · C1b exactitude ponctuelle ≥ 78 % (plafond théorique ≈ 80,5 %) · C1c règle conservatrice (i) 100 %, (ii) 100 %, (iii) ≥ 85 % |
| D3 | C2 redéfini | erreur moyenne \|score − latent\| ∈ [0,14 ; 0,18] |
| D4 | Simulateur | génération sur l'échelle CORRIGÉE puis stockage en brut (brut inversé = 5 − corrigé) — lecture psychométrique confirmée (signal S1 du run initial : résolu) |
| D5 | C3 / C4 inchangés | re-vérifiés (non-régression) |

## Verdict R1 : À CORRIGER — 5/6 critères PASS — note 6,5/10

| Critère | Seuil | Observé | Verdict |
|---|---|---|---|
| C1a — Couverture CI90 | ∈ [87 % ; 95 %] | **89,9 %** | **PASS** |
| C1b — Exactitude ponctuelle | ≥ 78 % (plafond ≈ 80,5 %) | **79,7 %** | **PASS** |
| C1c — Règle conservatrice | (i) 100 % · (ii) 100 % · (iii) ≥ 85 % | (i) 100 % · (ii) 99,8 % (2 violations) · (iii) 100 % (n = 63) | **FAIL** |
| C2 — Erreur moyenne | ∈ [0,14 ; 0,18] | **0,1567** (SEM implicite ≈ 0,196) | **PASS** |
| C3 — Piégés détectés | ≥ 17/20 | **20/20** (7/7 · 6/6 · 4/4 · 3/3) | **PASS** |
| C4 — Reproductibilité (×2, seed 42) | identique | **OUI** (SHA-256) | **PASS** |

Non-régression : α de Cronbach poolés **A = 0,9155 / B = 0,9082** — identiques au run
initial (référence « 0,916 ») → **préservée**. Frontières L3 : 82,3 % (vs 93,2/94,2 % au
run initial ; l'attente orchestrateur de 25-35 % n'est pas atteinte — analyse structurelle
en Section E et signal S-R1-2 du rapport).

Les 2 violations C1c-(ii) (H291 axe A, H405 axe B) sont des latents Forte dont le score
tombe un cran (Vive) pendant que le CI90 redescend encore un cran (Tranquille) —
mécanique documentée en Section F (S-R1-1) avec 3 options d'arbitrage, **aucune
correction appliquée de mon propre initiative**.

## Arborescence

```
validation-q1-r1/
├── README.md                    ← ce fichier
├── src/
│   ├── wtc_q1_core.py           ← instrument + L1-L4/L7 (D1 appliquée)
│   ├── wtc_q1_simulator.py      ← seed 42, 500 honnêtes + 20 piégés (D4 confirmée)
│   └── wtc_q1_validation.py     ← critères R1 (D2/D3), figures, rapport (D5)
├── results/
│   ├── rapport.md               ← RAPPORT FINAL 7 sections (A-G)
│   ├── criteres_r1.json         ← tous les critères + métadonnées R1
│   ├── lectures_detaillees.csv  ← 1 000 lectures (champs R1 : C1a/C1b/C1c/C2)
│   ├── reponses_honnetes_calculees.csv (500) · reponses_pieges_calculees.csv (20)
│   ├── rqs_detail.csv (520) · matrices_confusion.csv · stats_groupes.csv
│   └── violations_c1c.csv       ← détail individuel des violations C1c
└── figures/
    ├── Heatmap_MatriceConfusionPonctuelle_AxeA_R1_2026-10-14.png
    ├── Heatmap_MatriceConfusionPonctuelle_AxeB_R1_2026-10-14.png
    ├── BarChart_CriteresR1_2026-10-14.png        ← tableau de bord des 6 critères
    └── BarChart_Frontieres_R1_2026-10-14.png     ← frontières vs attendu 25-35 % / run initial 93 %
```

## Reproduction

```bash
python3 src/wtc_q1_validation.py   # seed 42 — le pipeline s'exécute 2 fois (C4)
# Dépendances : numpy, pandas, matplotlib
```

Déterminisme : seed 42 (numpy PCG64), ordre de tirage figé, aucun horodatage à la
seconde près (date seule) — deux exécutions le même jour sont identiques octet par octet.

Rôle : EXÉCUTEUR STRICT — la vérité du système prime sur son succès apparent.
Références citées : Bowlby ; Brennan, Clark & Shaver. Instrument original WAIRYU.

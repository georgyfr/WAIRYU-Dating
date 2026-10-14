# WTC-Q1 — Validation de la Quête 1 « Comment je me raccroche »

**WAIRYU Thérapie Couple — Package WTC-Q1.** Validation de la première échelle
du produit : échelle d'attachement adulte **originale WAIRYU** (fiche RIO-01),
18 items + 1 item de vigilance, deux axes indépendants — « peur de perdre »
(anxiété d'abandon, items 1-9) et « peur de dépendre » (évitement de
l'intimité, items 10-18).

Références scientifiques publiques citées : Bowlby ; Brennan, Clark & Shaver.
L'instrument lui-même est original WAIRYU.

## Rôle de ce dépôt / dossier

Package produit par l'**exécuteur strict (Data Insight)** : implémentation
mot pour mot de la spécification (aucun seuil, poids ou paramètre modifié),
simulation reproductible (seed 42), évaluation des 4 critères éliminatoires
C1-C4, rapport final exhaustif en 7 sections (A-G), signalements sans
correction libre.

## Verdict (détail complet : `results/rapport.md`)

| Critère | Seuil | Observé | Verdict |
|---|---|---|---|
| C1 — Exactitude des lectures (décision conservatrice vs latent) | ≥ 90 % | **46,10 %** (461/1 000) | **FAIL** |
| C2 — Erreur moyenne \|score − latent\| | < 0,15 | **0,1567** | **FAIL** |
| C3 — Piégés détectés (RQS ≠ OK) | ≥ 17/20 | **20/20** (7/7 · 6/6 · 4/4 · 3/3) | **PASS** |
| C4 — Reproductibilité (pipeline ×2, seed 42) | identique | **OUI** (SHA-256) | **PASS** |

**VERDICT PACKAGE : À CORRIGER.** La vérité du système prime sur son succès
apparent. Les causes structurelles sont diagnostiquées dans le rapport
(Section F) : CI90 surdimensionné par les placeholders (largeur 0,826 > écart
des seuils 0,80/0,60 → 93 % de lectures en frontière), décalage des frontières
effectives de +0,41 par la décision conservatrice, et C2 au fil exact du bruit
d'item de la Spécification 3.

> Note : la création d'un dépôt GitHub dédié (`wtc-validation-q1`) a été
> refusée par le token disponible (droit de création manquant — signal S15) ;
> le package est publié ici et est migrable tel quel vers un dépôt dédié.

## Arborescence

```
validation-q1/
├── src/
│   ├── wtc_q1_core.py         # Instrument + couches L1-L4, L7 (constantes figées)
│   ├── wtc_q1_simulator.py    # Seed 42 : 500 honnêtes (4 groupes) + 20 piégés (4 types)
│   └── wtc_q1_validation.py   # C1-C4, sorties brutes, figures, rapport 7 sections
├── results/
│   ├── rapport.md                          # RAPPORT FINAL DÉTAILLÉ (sections A-G)
│   ├── criteres_c1_c4.json                 # Tous les chiffres + empreintes SHA-256
│   ├── lectures_detaillees.csv             # 1 000 lectures (2 axes × 500 honnêtes)
│   ├── reponses_honnetes_calculees.csv     # 500 répondants, pipeline complet
│   ├── reponses_pieges_calculees.csv       # 20 piégés, pipeline complet
│   ├── rqs_detail.csv                      # 520 évaluations RQS (4 contrôles)
│   ├── matrices_confusion.csv              # Matrices 4×4 (conservateur + ponctuel)
│   └── stats_groupes.csv                   # Statistiques G1-G4 + α de Cronbach
└── figures/
    ├── Heatmap_MatriceConfusion_AxeA_2026-10-14.png
    ├── Heatmap_MatriceConfusion_AxeB_2026-10-14.png
    ├── Histogram_DistributionErreursC2_2026-10-14.png
    └── BarChart_StatutsRQS_2026-10-14.png
```

## Reproduction

```bash
python3 src/wtc_q1_validation.py
```

Dépendances : `numpy`, `pandas`, `matplotlib`. Le pipeline exécute deux fois
la chaîne complète (simulation → évaluation → métriques), compare les
empreintes SHA-256 (C4), produit toutes les sorties dans `results/` et
`figures/`, puis génère `results/rapport.md`. Deux exécutions consécutives
produisent des sorties strictement identiques octet par octet (vérifié).

## Points de gouvernance (Section F du rapport)

15 signaux documentés (S1-S15), dont :
- **S1** — items inversés du simulateur : lecture psychométrique retenue,
  sensibilité exécutée en lecture littérale (C1 45,20 % · C2 0,1956) —
  arbitrage superviseur requis ;
- **S2/S3/S4** — CI90 vs seuils : dégénérescence des frontières (93 %),
  décalage conservateur +0,41, SEM placeholder vs bruit réel (facteur ≈ 2,2) ;
- **S5** — C2 au fil exact de faisabilité (bruit d'item 0,5 → erreur attendue
  ≈ 0,15) ;
- **S15** — blocage de création du dépôt dédié (token GitHub).

# 📊 Visualisations — Wairyu Thérapie Couple

> Dossier généré le **14-15/10/2026** · 10 visuels PNG (1920×1080, 150 DPI, palette colorblind-friendly Okabe-Ito, libellés en français)
> Sources des données : `../OUTILS DE TERAPIE DU COUPLE.txt` (recherche clinique) et `../programme wairyu couple.txt` (document de référence du programme WTC)

---

## Index des graphiques

| # | Fichier | Lecture rapide |
|---|---------|----------------|
| 1 | [`BarChart_TauxSucces_Modalites_2026-10-14.png`](BarChart_TauxSucces_Modalites_2026-10-14.png) | **Efficacité comparée des modalités d'aide au couple.** Thérapie avec professionnel : 70–80 % (d ≈ 0,8) · app + coach : 55–65 % · app seule : ~40 % (Hedges' g = 0,42) · repère : ≈ 50 % d'abandon précoce en pratique réelle. |
| 2 | [`BarChart_InventaireOutils_Domaines_2026-10-14.png`](BarChart_InventaireOutils_Domaines_2026-10-14.png) | **67 instruments validés répartis en 13 domaines** (enfants & parentalité 10, violence & dangerosité 8, perception du partenaire 7…), avec les sigles des tests après chaque barre. |
| 3 | [`BarChart_TestsValides_NbItems_2026-10-14.png`](BarChart_TestsValides_NbItems_2026-10-14.png) | **Longueur des questionnaires** (échelle logarithmique) : de KMSS (3 items) au Gottman Relationship Checkup (337 items), colorés par domaine. Stratégie en 3 temps : dépistage court → profil multidimensionnel → évaluation approfondie. |
| 4 | [`BarChart_Parcours17Modules_2026-10-14.png`](BarChart_Parcours17Modules_2026-10-14.png) | **Parcours de reconstruction en 17 modules** : durées (valeurs médianes, 12–18 mois au total) et niveaux de priorité (Fondamentale M01–M05 · Essentielle M06–M10 · Critique M11–M14 · Importante M15–M17). |
| 5 | [`BarChart_Tarification_Marche_2026-10-14.png`](BarChart_Tarification_Marche_2026-10-14.png) | **Positionnement tarifaire** (équivalent mensuel €, conversion indicative 1 $ ≈ 0,92 €) : Zenlove ≈ 3,3 € · Pragma ≈ 18 € · offre Hybride du projet 150–300 € · OurRitual ≈ 220–285 € · Regain ≈ 287–410 €. |
| 6 | [`DonutChart_26Dimensions_ParBloc_2026-10-14.png`](DonutChart_26Dimensions_ParBloc_2026-10-14.png) | **Les 26 dimensions d'analyse du programme WTC** réparties en 6 blocs (Héritage 6 · Psychologique 4 · Relationnel 4 · Social-matériel 4 · Cycle de vie 4 · Sociétal 4), avec le détail des dimensions par bloc. Source : document de référence. |
| 7 | [`BarChart_Quetes_Architecture_2026-10-14.png`](BarChart_Quetes_Architecture_2026-10-14.png) | **Architecture des ≈ 110 quêtes** : 16 dimensions majeures × 5 quêtes (80) · 6 standard × 4 (24) · 4 extensions × 3 (12) — gabarit universel, zone d'ombre + zone de force, 3 paliers vert/ambre/rouge. |
| 8 | [`Dashboard_EtatValidation_QuatreCycles_2026-10-15.png`](Dashboard_EtatValidation_QuatreCycles_2026-10-15.png) | **L'état de la validation (v2 consolidée, Partie 13)** — 4 panneaux : (A) critères satisfaits par cycle (2/4 · 5/6 · 5/7 · 5/7 · **7/7 arbitré**) ; (B) trajectoire du nommage correct 46,1 → 72,7 → 81,0 % vs plafond ≈ 82,4 % et seuils 82 %/79 % ; (C) métriques finales RIO-01 (α 0,9155/0,9082 · couverture 89,9 % · RQS 20/20…) ; (D) critères RIO-02 après arbitrage (nommage 81,0 % · calme 85 %/0 % · 0 FP · O7 6/6 · 35/35…). |
| 9 | [`Table_EtatActuelProjet_2026-10-15.png`](Table_EtatActuelProjet_2026-10-15.png) | **État actuel du projet — synthèse de position** (tableau structuré du document de référence v2) : architecture et infrastructure conçues · RIO-01 VALIDÉE (3 cycles) · RIO-02 VALIDÉE (2 cycles) · RIO-03 = prochain package (WTC-Q3, bornes D-STD) · 4 commits archivés · verdicts cumulés : zéro correction libre, zéro masquage. |
| 10 | [`BarChart_RapportConsolidation_2026-10-15.png`](BarChart_RapportConsolidation_2026-10-15.png) | **Figure du rapport de consolidation v2** — (A) critères satisfaits du verdict initial à l'arbitrage final (2/4 · 5/6 · **6/6 RIO-01 validée** · 5/7 · 5/7 · **7/7 RIO-02 validée**) ; (B) fautes de spécification d'orchestrateur révélées par cycle (3 · 3 · 4 · 2 = 12 listées en Partie 13.2, aucune dans l'implémentation). Intégrée au [`rapport de consolidation`](../rapports/rapport-consolidation-v2-2026-10-15.md). |

---

## Conventions

- **Nom de fichier** : `[TypeDeGraphique]_[Sujet]_[AAAA-MM-JJ].png`
- **Palette** : Okabe-Ito (accessible daltoniens) — bleu `#0072B2` (professionnel), vert `#009E73` (hybride), orange `#E69F00` (application seule / projet), vermillon `#D55E00` (critique)
- **Sources annotées** en bas à gauche de chaque image

## Reproduction

Le script de génération est disponible dans [`../scripts/generate_charts.py`](../scripts/generate_charts.py) (graphiques 1–5), [`../scripts/generate_charts_wtc.py`](../scripts/generate_charts_wtc.py) (graphiques 6–7), [`../scripts/generate_charts_etat_validation.py`](../scripts/generate_charts_etat_validation.py) (graphique 8 — données lues exclusivement dans la Partie 13 du document de référence v2) et [`../scripts/generate_charts_rapport_consolidation.py`](../scripts/generate_charts_rapport_consolidation.py) (graphique 10 — figure du rapport de consolidation, Partie 13.2) ; le visuel 9 est un tableau structuré rendu via Playwright+CSS — source HTML : [`../scripts/etat_table_source.html`](../scripts/etat_table_source.html) + [`../scripts/render_etat_table.js`](../scripts/render_etat_table.js).

```bash
pip install matplotlib numpy
python generate_charts.py      # régénère les graphiques 1–5
python generate_charts_wtc.py  # régénère les graphiques 6–7
python generate_charts_etat_validation.py  # régénère le graphique 8 (dashboard validation)
```

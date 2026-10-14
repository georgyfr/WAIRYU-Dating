# 📊 Visualisations — Wairyu Thérapie Couple

> Dossier généré le **14/10/2026** · 5 graphiques PNG (≈1920×1080, 150 DPI, palette colorblind-friendly Okabe-Ito, libellés en français)
> Source des données : `../OUTILS DE TERAPIE DU COUPLE.txt` (analyse documentaire d'extraits de recherche clinique)

---

## Index des graphiques

| # | Fichier | Lecture rapide |
|---|---------|----------------|
| 1 | [`BarChart_TauxSucces_Modalites_2026-10-14.png`](BarChart_TauxSucces_Modalites_2026-10-14.png) | **Efficacité comparée des modalités d'aide au couple.** Thérapie avec professionnel : 70–80 % (d ≈ 0,8) · app + coach : 55–65 % · app seule : ~40 % (Hedges' g = 0,42) · repère : ≈ 50 % d'abandon précoce en pratique réelle. |
| 2 | [`BarChart_InventaireOutils_Domaines_2026-10-14.png`](BarChart_InventaireOutils_Domaines_2026-10-14.png) | **67 instruments validés répartis en 13 domaines** (enfants & parentalité 10, violence & dangerosité 8, perception du partenaire 7…), avec les sigles des tests après chaque barre. |
| 3 | [`BarChart_TestsValides_NbItems_2026-10-14.png`](BarChart_TestsValides_NbItems_2026-10-14.png) | **Longueur des questionnaires** (échelle logarithmique) : de KMSS (3 items) au Gottman Relationship Checkup (337 items), colorés par domaine. Stratégie en 3 temps : dépistage court → profil multidimensionnel → évaluation approfondie. |
| 4 | [`BarChart_Parcours17Modules_2026-10-14.png`](BarChart_Parcours17Modules_2026-10-14.png) | **Parcours de reconstruction en 17 modules** : durées (valeurs médianes, 12–18 mois au total) et niveaux de priorité (Fondamentale M01–M05 · Essentielle M06–M10 · Critique M11–M14 · Importante M15–M17). |
| 5 | [`BarChart_Tarification_Marche_2026-10-14.png`](BarChart_Tarification_Marche_2026-10-14.png) | **Positionnement tarifaire** (équivalent mensuel €, conversion indicative 1 $ ≈ 0,92 €) : Zenlove ≈ 3,3 € · Pragma ≈ 18 € · offre Hybride du projet 150–300 € · OurRitual ≈ 220–285 € · Regain ≈ 287–410 €. |

---

## Conventions

- **Nom de fichier** : `[TypeDeGraphique]_[Sujet]_[AAAA-MM-JJ].png`
- **Palette** : Okabe-Ito (accessible daltoniens) — bleu `#0072B2` (professionnel), vert `#009E73` (hybride), orange `#E69F00` (application seule / projet), vermillon `#D55E00` (critique)
- **Sources annotées** en bas à gauche de chaque image

## Reproduction

Le script de génération est disponible dans [`../scripts/generate_charts.py`](../scripts/generate_charts.py).

```bash
pip install matplotlib numpy
python generate_charts.py   # régénère les 5 PNG dans ./download/
```

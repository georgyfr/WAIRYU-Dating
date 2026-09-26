# Analyses Wairyu — Visuels du 2026-09-27

Ensemble des visuels de synthèse produits à partir des documents du projet Wairyu
(application de rencontre basée sur un matching en 4 piliers : émotionnel, rationnel,
systémique, sexologique). Chaque graphique est un PNG 1920×1080 @ 150 DPI, prêt à
l'emploi, avec palette compatible daltonisme et libellés en français.

## Organisation

```
analyses-2026-09-27/
├── charts/    → 17 graphiques PNG
└── scripts/   → 5 scripts Python de génération (matplotlib + seaborn)
```

## Contenu des graphiques

### Marché & positionnement
| Fichier | Description |
|---|---|
| `BarChart_MarcheRencontre_2026-09-27.png` | Vue d'ensemble du marché des applications de rencontre |
| `RadarChart_Differentiation_2026-09-27.png` | Axes de différenciation de Wairyu face aux acteurs établis |
| `Positionnement_Apps_Rencontre_2026-09-27.png` | Carte de positionnement (intention de relation × mode de découverte) + revenus 2023 des principaux acteurs |
| `RadarHeatmap_Wairyu_vs_Apps_Rencontre_2026-09-27.png` | Comparaison Wairyu (profil hypothétique) vs 9 applications établies sur 6 critères |

### Matching & outils (cœur du concept)
| Fichier | Description |
|---|---|
| `Dashboard_Piliers_Matching_WAIRYU_2026-09-27.png` | Synthèse : 4 piliers, pipeline de matching (vecteur 17D → règles SIMILAIRE/COMPLÉMENTAIRE → distance pondérée), pondérations, sécurité |
| `BarChart_Batteries_Tests_WAIRYU_2026-09-27.png` | 19 batteries de tests (~279 items, 47–55 min) réparties par pilier |
| `BarChart_Outils_ParBloc_WAIRYU_2026-09-27.png` | 53 outils répartis en 9 blocs (règle 3-7-15) |
| `GroupedBar_TempsPassation_Blocs_WAIRYU_2026-09-27.png` | Temps de passation par bloc : MVP (≈36 min) vs Complet (≈133 min) |
| `BarChart_Indexation_Matching_WAIRYU_2026-09-27.png` | Performances d'indexation : K-D Tree (<2 ms) vs SQL B-Tree (10–30 ms) |
| `FunnelChart_ParcoursModeInvisible_2026-09-27.png` | Parcours utilisateur du mode invisible |

### Sécurité & profils à risque
| Fichier | Description |
|---|---|
| `Donut_ProfilesRisque_Zones_2026-09-27.png` | Répartition des 24 profils à risque en 3 zones (Rouge 5 / Orange 9 / Jaune 10) |
| `BarChart_DistributionCible_Niveaux_2026-09-27.png` | Distribution cible de la population par niveau N0–N5 |
| `GroupedBar_SimulateurDerive_36Mois_2026-09-27.png` | Simulateur Monte-Carlo (100 000 agents) : dérive S0→S4 sur 36 mois |

### Modèle économique
| Fichier | Description |
|---|---|
| `BarChart_TarificationAbonnements_2026-09-27.png` | Grille tarifaire des abonnements |
| `DonutChart_SourcesRevenus_2026-09-27.png` | Répartition des sources de revenus |
| `BarChart_CoutsAnnee1_2026-09-27.png` | Décomposition des coûts de l'année 1 |
| `BarChart_Projections3Ans_2026-09-27.png` | Projections financières sur 3 ans |

## Scripts de génération

| Script | Rôle |
|---|---|
| `wairyu_charts.py` | Dashboard piliers, batteries de tests, indexation (Task 1) |
| `wairyu_charts_v2.py` | Outils/blocs, temps de passation, profils à risque (Task 2) |
| `generate_charts_wairyu.py` | Marché, tarification, coûts, projections, différenciation |
| `gen_chart_rencontre.py` | Carte de positionnement du marché |
| `gen_chart_wairyu.py` | Radar + heatmap Wairyu vs concurrents |

Tous les scripts utilisent `matplotlib` + `seaborn` (sortie statique PNG, palette
colorblind-safe, police DejaVu Sans) et sont rejouables :
`python3 scripts/<nom>.py`.

## Avertissement données

Les chiffres proviennent des documents projet fournis par le porteur du projet
(aucune donnée fabriquée) ; les figures « marché » s'appuient sur des estimations
publiques 2023–2024 annotées en pied de graphique. Le profil « Wairyu hypothétique »
dans la comparaison concurrentielle est explicitement signalé comme tel.

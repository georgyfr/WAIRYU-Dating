# RAPPORT FINAL DÉTAILLÉ — PACKAGE WTC-Q1
## Validation de la Quête 1 « Comment je me raccroche » (échelle d'attachement adulte originale WAIRYU, fiche RIO-01)

- **Projet** : WAIRYU Thérapie Couple — 26 dimensions cliniques, 110 quêtes, doctrine d'instruments originaux
- **Exécuteur** : Data Insight — rôle strict d'implémentation (aucun paramètre modifié)
- **Date d'exécution** : 2026-10-14 · **Seed** : 42 (numpy PCG64) · **Reproductibilité** : pipeline exécuté 2 fois
- **Population** : 500 honnêtes (G1 n=200 · G2 n=150 · G3 n=100 · G4 n=50) + 20 piégés (7 linéaires · 6 speeders · 4 acquiesceurs · 3 vigilance ratée)
- **Construit mesuré** : attachement adulte — Axe A « peur de perdre » (items 1-9), Axe B « peur de dépendre » (items 10-18) ; 18 items, échelle de fréquence 4 points ; items inversés 5 et 15 ; item de vigilance (19e, attendu = 3)
- **Références citées** : Bowlby ; Brennan, Clark & Shaver. Instrument original WAIRYU.
- **Sorties** : `results/` (CSV + JSON) · `figures/` (4 PNG) · ce rapport

> **Cadre du rapport** : toutes les sections sont exhaustives (aucun résumé abrégé). La vérité du système prime sur son succès apparent : chaque critère est déclaré tel quel.

---

## SECTION A — LES 4 CRITÈRES DE VALIDATION

### A.1 Tableau synoptique (critères éliminatoires)

| Critère | Définition | Seuil | Résultat observé | Verdict |
|---|---|---|---|---|
| C1 | Exactitude des lectures (niveau calculé [L3, décision conservatrice] vs niveau attendu du latent) | ≥ 90 % (≥ 900/1 000) | 461/1 000 = 46.10% | **FAIL** |
| C2 | Erreur moyenne |score calculé − latent| (1 000 lectures) | < 0,15 | 0.1567 | **FAIL** |
| C3 | Piégés détectés (statut RQS ≠ OK) | ≥ 17/20 | 20/20 | **PASS** |
| C4 | Reproductibilité (pipeline ×2, seed 42) | Sorties strictement identiques | OUI | **PASS** |

### A.2 C1 — détail par axe

| Axe | Correspondances | Total | Exactitude | Verdict (≥ 90 %) |
|---|---|---|---|---|
| A « PEUR DE PERDRE » | 233 | 500 | 46.60% | FAIL |
| B « PEUR DE DÉPENDRE » | 228 | 500 | 45.60% | FAIL |

### A.3 C1 — détail par groupe

| Groupe | Profil | Axe | n lectures | Correspondances | Exactitude |
|---|---|---|---|---|---|
| G1 | tranquille | A | 200 | 112 | 56.00% |
| G1 | tranquille | B | 200 | 109 | 54.50% |
| G2 | peur de perdre | A | 150 | 44 | 29.33% |
| G2 | peur de perdre | B | 150 | 73 | 48.67% |
| G3 | peur de dépendre | A | 100 | 65 | 65.00% |
| G3 | peur de dépendre | B | 100 | 31 | 31.00% |
| G4 | ambivalent | A | 50 | 12 | 24.00% |
| G4 | ambivalent | B | 50 | 15 | 30.00% |

### A.4 C1 — métriques auxiliaires (pour l'arbitrage du superviseur — ne remplacent PAS C1)

- **Exactitude du niveau PONCTUEL** (niveau du score sans décision conservatrice, vs niveau attendu) : Axe A = 80.00% · Axe B = 79.40%
- **Taux de couverture CI90** (latent ∈ [CI bas ; CI haut]) : Axe A = 96.20% · Axe B = 97.60%

### A.5 C2 — détail

| Axe | Erreur moyenne | RMSE | Biais moyen (signé) | Erreur max |
|---|---|---|---|---|
| A « PEUR DE PERDRE » | 0.1524 | 0.1913 | -0.0098 | 0.6118 |
| B « PEUR DE DÉPENDRE » | 0.1611 | 0.1974 | -0.0089 | 0.7043 |
| GLOBAL | 0.1567 | 0.1944 | -0.0094 | 0.7043 |

Erreur moyenne par groupe (axe A / axe B) :

| Groupe | Erreur moy. A | Erreur moy. B |
|---|---|---|
| G1 | 0.1524 | 0.1463 |
| G2 | 0.1579 | 0.1791 |
| G3 | 0.1470 | 0.1616 |
| G4 | 0.1461 | 0.1657 |

### A.6 C3 — détail par type de triche

| Type de triche | n | Détectés | RQS observés | Statuts | Mécanisme de détection | Verdict |
|---|---|---|---|---|---|---|
| lineaire | 7 | 7/7 | 80 | PRUDENCE | Tous items = 2 → écart-type des corrigés ≈ 0,32 < 0,45 → pénalité anti-linéarité (−20) → RQS 80 | PASS |
| speeder | 6 | 6/6 | 75 | PRUDENCE | Temps < 2,0 s sur tous les items (et session < 60 s) → pénalité rythme (−25) → RQS 75 | PASS |
| acquiesceur | 4 | 4/4 | 80 | PRUDENCE | Tous items = 4 → corrigés(5,15) = 1 vs moyenne des autres items de face = 4 (écart 3 ≥ 2,5) → anti-contradiction (−20, une fois) → RQS 80 | PASS |
| vigilance_ratee | 3 | 3/3 | 80 | PRUDENCE | Vigilance = 4 ≠ 3 → pénalité vigilance (−20) → RQS 80 | PASS |
| TOTAL | 20 | 20/20 | — | — | Seuil ≥ 17/20 | PASS |

Détail individuel des 20 piégés :

| ID | Type | RQS | Statut | Détecté | Pénalités actives |
|---|---|---|---|---|---|
| P01 | lineaire | 80 | PRUDENCE | OUI | linearite |
| P02 | lineaire | 80 | PRUDENCE | OUI | linearite |
| P03 | lineaire | 80 | PRUDENCE | OUI | linearite |
| P04 | lineaire | 80 | PRUDENCE | OUI | linearite |
| P05 | lineaire | 80 | PRUDENCE | OUI | linearite |
| P06 | lineaire | 80 | PRUDENCE | OUI | linearite |
| P07 | lineaire | 80 | PRUDENCE | OUI | linearite |
| P08 | speeder | 75 | PRUDENCE | OUI | rythme |
| P09 | speeder | 75 | PRUDENCE | OUI | rythme |
| P10 | speeder | 75 | PRUDENCE | OUI | rythme |
| P11 | speeder | 75 | PRUDENCE | OUI | rythme |
| P12 | speeder | 75 | PRUDENCE | OUI | rythme |
| P13 | speeder | 75 | PRUDENCE | OUI | rythme |
| P14 | acquiesceur | 80 | PRUDENCE | OUI | contradiction |
| P15 | acquiesceur | 80 | PRUDENCE | OUI | contradiction |
| P16 | acquiesceur | 80 | PRUDENCE | OUI | contradiction |
| P17 | acquiesceur | 80 | PRUDENCE | OUI | contradiction |
| P18 | vigilance_ratee | 80 | PRUDENCE | OUI | vigilance |
| P19 | vigilance_ratee | 80 | PRUDENCE | OUI | vigilance |
| P20 | vigilance_ratee | 80 | PRUDENCE | OUI | vigilance |

### A.7 C4 — reproductibilité

- Deux exécutions complètes du pipeline (simulation → évaluation → métriques) avec seed = 42.
- Empreinte SHA-256 des métriques — exécution 1 : `9fa4a4b12fd75b8b…`
- Empreinte SHA-256 des métriques — exécution 2 : `9fa4a4b12fd75b8b…`
- Empreinte SHA-256 des 520 évaluations individuelles (CSV sérialisés) — exécution 1 : `c99b97cd405a0e53…` · exécution 2 : `c99b97cd405a0e53…`
- **Sorties strictement identiques : OUI**

---

## SECTION B — MATRICES DE CONFUSION DES NIVEAUX

### Axe A « PEUR DE PERDRE » — lecture CONSERVATRICE (référence C1)

| Attendu ↓ · Calculé → | Discrète | Tranquille | Vive | Forte | Total |
|---|---|---|---|---|---|
| Discrète | 78 | 0 | 0 | 0 | 78 |
| Tranquille | 114 | 112 | 0 | 0 | 226 |
| Vive | 0 | 79 | 29 | 0 | 108 |
| Forte | 0 | 5 | 69 | 14 | 88 |

- Frontières L3 : **466** lectures sur 500 (93.2%) — **bien tranchées : 199** · **mal tranchées : 267** (bien tranchée ⇔ niveau conservateur = niveau attendu du latent).
- Lectures touchant DEUX seuils (3 niveaux touchés) : 43.

Variante auxiliaire — niveau PONCTUEL (sans décision conservatrice) :

| Attendu ↓ · Calculé → | Discrète | Tranquille | Vive | Forte | Total |
|---|---|---|---|---|---|
| Discrète | 63 | 15 | 0 | 0 | 78 |
| Tranquille | 27 | 185 | 14 | 0 | 226 |
| Vive | 0 | 11 | 77 | 20 | 108 |
| Forte | 0 | 0 | 13 | 75 | 88 |

### Axe B « PEUR DE DÉPENDRE » — lecture CONSERVATRICE (référence C1)

| Attendu ↓ · Calculé → | Discrète | Tranquille | Vive | Forte | Total |
|---|---|---|---|---|---|
| Discrète | 77 | 0 | 0 | 0 | 77 |
| Tranquille | 142 | 105 | 0 | 0 | 247 |
| Vive | 0 | 80 | 31 | 0 | 111 |
| Forte | 0 | 4 | 46 | 15 | 65 |

- Frontières L3 : **471** lectures sur 500 (94.2%) — **bien tranchées : 200** · **mal tranchées : 271** (bien tranchée ⇔ niveau conservateur = niveau attendu du latent).
- Lectures touchant DEUX seuils (3 niveaux touchés) : 41.

Variante auxiliaire — niveau PONCTUEL (sans décision conservatrice) :

| Attendu ↓ · Calculé → | Discrète | Tranquille | Vive | Forte | Total |
|---|---|---|---|---|---|
| Discrète | 63 | 14 | 0 | 0 | 77 |
| Tranquille | 34 | 203 | 10 | 0 | 247 |
| Vive | 0 | 15 | 77 | 19 | 111 |
| Forte | 0 | 0 | 11 | 54 | 65 |

Lecture des matrices : lignes = niveau attendu (seuils appliqués au latent) ; colonnes = niveau calculé (décision conservatrice pour la référence C1). La diagonale regroupe les correspondances ; toute cellule hors diagonale est une lecture erronée. Les figures `figures/Heatmap_MatriceConfusion_AxeA_*.png` et `AxeB_*.png` visualisent les matrices conservatrices.

---

## SECTION C — STATISTIQUES PAR GROUPE (G1-G4)

Pour chaque groupe : moyennes et écart-types des scores calculés (axes A et B), écart entre mu simulé (paramètre de la Spécification 3) et moyenne calculée, et α de Cronbach OBSERVÉ par axe. **Les α observés sont des indicateurs de diagnostic : les paramètres placeholders de la spécification (SD 0,65 ; fiabilité 0,85 ; SEM 0,252) ne sont JAMAIS remplacés.**

| Groupe | n | μ_A | Latente A (moy.) | Score A (moy.) | SD A | Écart μ_A | α Cronbach A | μ_B | Latente B (moy.) | Score B (moy.) | SD B | Écart μ_B | α Cronbach B |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| G1 « tranquille » | 200 | 2.0 | 1.984 | 1.978 | 0.372 | -0.022 | 0.753 | 2.1 | 2.042 | 2.025 | 0.386 | -0.075 | 0.750 |
| G2 « peur de perdre » | 150 | 3.1 | 3.085 | 3.052 | 0.379 | -0.048 | 0.752 | 2.1 | 2.116 | 2.110 | 0.420 | +0.009 | 0.798 |
| G3 « peur de dépendre » | 100 | 2.1 | 2.109 | 2.126 | 0.375 | +0.026 | 0.739 | 3.2 | 3.192 | 3.179 | 0.297 | -0.021 | 0.584 |
| G4 « ambivalent » | 50 | 3.1 | 3.227 | 3.218 | 0.355 | +0.118 | 0.718 | 3.1 | 3.062 | 3.089 | 0.399 | -0.011 | 0.782 |

**α de Cronbach observés, population honnête complète (500 répondants)** : Axe A = 0.915 · Axe B = 0.908.

**Lecture** : les α de groupe (≈ 0,75-0,80) reflètent la variance de latente WITHIN-groupe (σ² = 0,35² = 0,1225) rapportée au bruit d'item (σ ≈ 0,56 après troncature/arrondi) ; les α poolés (≈ 0,9) sont gonflés par la variance BETWEEN-groupes (moyennes 2,0-3,1). L'écart-type OBSERVÉ des scores d'axe (≈ 0,19) est nettement inférieur au SD placeholder (0,65) qui sert au calcul du SEM (0,252) : cette incohérence structurelle est analysée en Section F (signal n° 9).

---

## SECTION D — TROIS EXEMPLES TRACÉS DE BOUT EN BOUT

Traçabilité ligne par ligne : les 18 réponses → scores corrigés → scores des faces → scores d'axes + intervalles → lecture (niveau ou frontière) → verdict RQS. Sélection : le premier répondant de G1, le premier répondant de G3, et le premier piégé (linéaire).

### Exemple 1 — répondant HONNÊTE de G1

**H001** — groupe G1 « tranquille » · latent_A = 2.1067 · latent_B = 1.7360 · vigilance = 3 (OK)

Réponses brutes → scores corrigés (items inversés 5 et 15 : corrigé = 5 − brut) :

| Item | Face | Brut | Corrigé |
|---|---|---|---|
| 1 | A1 | 2 | 2 |
| 2 | A1 | 3 | 3 |
| 3 | A2 | 1 | 1 |
| 4 | A2 | 1 | 1 |
| 5 | A1 (inversé) | 3 | 2 |
| 6 | A2 | 2 | 2 |
| 7 | A3 | 2 | 2 |
| 8 | A3 | 2 | 2 |
| 9 | A3 | 3 | 3 |
| 10 | B1 | 2 | 2 |
| 11 | B1 | 2 | 2 |
| 12 | B2 | 2 | 2 |
| 13 | B2 | 2 | 2 |
| 14 | B2 | 1 | 1 |
| 15 | B1 (inversé) | 3 | 2 |
| 16 | B3 | 1 | 1 |
| 17 | B3 | 2 | 2 |
| 18 | B3 | 2 | 2 |

Scores des faces — moyenne des 3 items corrigés :

| Face | Nom | Axe | Calcul | Score |
|---|---|---|---|---|
| A1 | « Vigie » | Axe A | (2 + 3 + 2) / 3 | 2.33 |
| A2 | « Besoin de mots » | Axe A | (1 + 1 + 2) / 3 | 1.33 |
| A3 | « Rumeur » | Axe A | (2 + 2 + 3) / 3 | 2.33 |
| B1 | « Inconfort du près » | Axe B | (2 + 2 + 2) / 3 | 2.00 |
| B2 | « Debout-seul » | Axe B | (2 + 2 + 1) / 3 | 1.67 |
| B3 | « Porte fermée » | Axe B | (1 + 2 + 2) / 3 | 1.67 |

Scores d'axes, CI90 et lectures L3 :

| Axe | Score | CI90 | Lecture | Conservateur | Attendu (latent) | Correspondance |
|---|---|---|---|---|---|---|
| A « PEUR DE PERDRE » | 2.00 | [1.59 ; 2.41] | FRONTIERE — entre Discrète et Tranquille | Discrète | 2.1067 → **Tranquille** | non |
| B « PEUR DE DÉPENDRE » | 1.78 | [1.37 ; 2.19] | FRONTIERE — entre Discrète et Tranquille | Discrète | 1.7360 → **Discrète** | OUI |

Faces dominantes (L4, indicatif — hors critères C1-C4) :

| Axe | Ordre des faces | Écart 1-2 | Seuil L4 | Lecture |
|---|---|---|---|---|
| A | A1 > A3 > A2 | 0.00 | 0.8836 (seuil appliqué ≈ 0.8836) | nuage |
| B | B1 > B2 > B3 | 0.33 | 0.8836 (seuil appliqué ≈ 0.8836) | nuage |

Qualité de réponse (L1 — RQS) :

```text
  (a) anti-linéarité : écart-type des 18 corrigés = 0.583 >= 0.45 → pas de pénalité
  (b) anti-contradiction : aucun écart >= 2,5 → pas de pénalité
  (c) rythme : 0 item(s) < 2.0 s ; session 117.1 s → pas de pénalité
  (d) vigilance : réponse 3 = 3 → pas de pénalité
```

**Verdict RQS : 100/100 → statut OK**

### Exemple 2 — répondant HONNÊTE de G3

**H351** — groupe G3 « peur de dépendre » · latent_A = 2.5830 · latent_B = 3.1359 · vigilance = 3 (OK)

Réponses brutes → scores corrigés (items inversés 5 et 15 : corrigé = 5 − brut) :

| Item | Face | Brut | Corrigé |
|---|---|---|---|
| 1 | A1 | 2 | 2 |
| 2 | A1 | 3 | 3 |
| 3 | A2 | 2 | 2 |
| 4 | A2 | 3 | 3 |
| 5 | A1 (inversé) | 3 | 2 |
| 6 | A2 | 2 | 2 |
| 7 | A3 | 3 | 3 |
| 8 | A3 | 2 | 2 |
| 9 | A3 | 3 | 3 |
| 10 | B1 | 4 | 4 |
| 11 | B1 | 4 | 4 |
| 12 | B2 | 3 | 3 |
| 13 | B2 | 4 | 4 |
| 14 | B2 | 3 | 3 |
| 15 | B1 (inversé) | 2 | 3 |
| 16 | B3 | 2 | 2 |
| 17 | B3 | 4 | 4 |
| 18 | B3 | 3 | 3 |

Scores des faces — moyenne des 3 items corrigés :

| Face | Nom | Axe | Calcul | Score |
|---|---|---|---|---|
| A1 | « Vigie » | Axe A | (2 + 3 + 2) / 3 | 2.33 |
| A2 | « Besoin de mots » | Axe A | (2 + 3 + 2) / 3 | 2.33 |
| A3 | « Rumeur » | Axe A | (3 + 2 + 3) / 3 | 2.67 |
| B1 | « Inconfort du près » | Axe B | (4 + 4 + 3) / 3 | 3.67 |
| B2 | « Debout-seul » | Axe B | (3 + 4 + 3) / 3 | 3.33 |
| B3 | « Porte fermée » | Axe B | (2 + 4 + 3) / 3 | 3.00 |

Scores d'axes, CI90 et lectures L3 :

| Axe | Score | CI90 | Lecture | Conservateur | Attendu (latent) | Correspondance |
|---|---|---|---|---|---|---|
| A « PEUR DE PERDRE » | 2.44 | [2.03 ; 2.85] | FRONTIERE — entre Tranquille et Vive | Tranquille | 2.5830 → **Tranquille** | OUI |
| B « PEUR DE DÉPENDRE » | 3.33 | [2.92 ; 3.74] | FRONTIERE — entre Vive et Forte | Vive | 3.1359 → **Vive** | OUI |

Faces dominantes (L4, indicatif — hors critères C1-C4) :

| Axe | Ordre des faces | Écart 1-2 | Seuil L4 | Lecture |
|---|---|---|---|---|
| A | A3 > A1 > A2 | 0.34 | 0.8836 (seuil appliqué ≈ 0.8836) | nuage |
| B | B1 > B2 > B3 | 0.34 | 0.8836 (seuil appliqué ≈ 0.8836) | nuage |

Qualité de réponse (L1 — RQS) :

```text
  (a) anti-linéarité : écart-type des 18 corrigés = 0.758 >= 0.45 → pas de pénalité
  (b) anti-contradiction : aucun écart >= 2,5 → pas de pénalité
  (c) rythme : 0 item(s) < 2.0 s ; session 127.2 s → pas de pénalité
  (d) vigilance : réponse 3 = 3 → pas de pénalité
```

**Verdict RQS : 100/100 → statut OK**

### Exemple 3 — répondant PIÉGÉ

**P01** — piégé type « lineaire » · vigilance = 3 (attendu 3) · durée de session = 95.0 s

Réponses brutes → scores corrigés (items inversés 5 et 15 : corrigé = 5 − brut) :

| Item | Face | Brut | Corrigé |
|---|---|---|---|
| 1 | A1 | 2 | 2 |
| 2 | A1 | 2 | 2 |
| 3 | A2 | 2 | 2 |
| 4 | A2 | 2 | 2 |
| 5 | A1 (inversé) | 2 | 3 |
| 6 | A2 | 2 | 2 |
| 7 | A3 | 2 | 2 |
| 8 | A3 | 2 | 2 |
| 9 | A3 | 2 | 2 |
| 10 | B1 | 2 | 2 |
| 11 | B1 | 2 | 2 |
| 12 | B2 | 2 | 2 |
| 13 | B2 | 2 | 2 |
| 14 | B2 | 2 | 2 |
| 15 | B1 (inversé) | 2 | 3 |
| 16 | B3 | 2 | 2 |
| 17 | B3 | 2 | 2 |
| 18 | B3 | 2 | 2 |

Scores des faces — moyenne des 3 items corrigés :

| Face | Nom | Axe | Calcul | Score |
|---|---|---|---|---|
| A1 | « Vigie » | Axe A | (2 + 2 + 3) / 3 | 2.33 |
| A2 | « Besoin de mots » | Axe A | (2 + 2 + 2) / 3 | 2.00 |
| A3 | « Rumeur » | Axe A | (2 + 2 + 2) / 3 | 2.00 |
| B1 | « Inconfort du près » | Axe B | (2 + 2 + 3) / 3 | 2.33 |
| B2 | « Debout-seul » | Axe B | (2 + 2 + 2) / 3 | 2.00 |
| B3 | « Porte fermée » | Axe B | (2 + 2 + 2) / 3 | 2.00 |

Scores d'axes, CI90 et lectures L3 :

| Axe | Score | CI90 | Lecture | Conservateur | Attendu (latent) | Correspondance |
|---|---|---|---|---|---|---|
| A « PEUR DE PERDRE » | 2.11 | [1.70 ; 2.52] | FRONTIERE — entre Discrète et Tranquille | Discrète | — | n/a (piégé) |
| B « PEUR DE DÉPENDRE » | 2.11 | [1.70 ; 2.52] | FRONTIERE — entre Discrète et Tranquille | Discrète | — | n/a (piégé) |

Faces dominantes (L4, indicatif — hors critères C1-C4) :

| Axe | Ordre des faces | Écart 1-2 | Seuil L4 | Lecture |
|---|---|---|---|---|
| A | A1 > A2 > A3 | 0.33 | 0.8836 (seuil appliqué ≈ 0.8836) | nuage |
| B | B1 > B2 > B3 | 0.33 | 0.8836 (seuil appliqué ≈ 0.8836) | nuage |

Qualité de réponse (L1 — RQS) :

```text
  (a) anti-linéarité : écart-type des 18 corrigés = 0.323 < 0.45 → -20
  (b) anti-contradiction : aucun écart >= 2,5 → pas de pénalité
  (c) rythme : 0 item(s) < 2.0 s ; session 95.0 s → pas de pénalité
  (d) vigilance : réponse 3 = 3 → pas de pénalité
```

**Verdict RQS : 80/100 → statut PRUDENCE** — piégé DÉTECTÉ (détecté ⇔ statut ≠ OK)

---

## SECTION E — LES CAS FRONTIÈRES

**Combien d'honnêtes en lecture FRONTIÈRE ?** 937 lectures sur 1 000 (93.7 %) : Axe A = 466/500 (93.2%) · Axe B = 471/500 (94.2%).

**La décision conservatrice a-t-elle été correctement appliquée ?** OUI — contrôle programmatique : pour les 1 000 lectures, le niveau retenu est EXACTEMENT le niveau le plus bas touché par l'intervalle CI90 (1 000/1 000 vérifications réussies ; le code `lecture_L3` ne retourne que le minimum des niveaux touchés, et un garde-fou lève une exception si un intervalle ne touche aucun niveau).

Décompte des tranchages : **bien tranchées** (conservateur = attendu) : Axe A 199, Axe B 200 ; **mal tranchées** : Axe A 267, Axe B 271. Lectures touchant deux seuils à la fois : Axe A 43, Axe B 41 (ambiguïté « entre X et Y » sous-déterminée — signal n° 10 en Section F).

**Structure mécanique des frontières** : le CI90 (demi-largeur 1,64 × SEM = 0,4129, soit une largeur de 0,8258) est PLUS LARGE que l'écart entre seuils adjacents (0,80 entre 1,80-2,60 ; 0,60 entre 2,60-3,20). Conséquence : tout score compris entre ≈ 1,39 et ≈ 3,61 produit mécaniquement une lecture FRONTIÈRE — seuls Discrète (score ≤ 1,39) et Forte (score ≥ 3,61) peuvent être lus en niveau pur. La notion de frontière dégénère donc sur toute la plage utile de l'échelle (cf. Section F, signal n° 9).

**Effet de la décision conservatrice sur les niveaux** : la décision conservatrice décale les frontières effectives d'un cran vers le haut : Discrète si score < 2,21 ; Tranquille si 2,21 ≤ score < 3,01 ; Vive si 3,01 ≤ score < 3,61 ; Forte si score ≥ 3,61 (au lieu de 1,80 / 2,60 / 3,20). C'est la cause directe des non-correspondances C1 pour les latents situés dans les bandes [seuil ; seuil + 0,41].

**Drapeaux RQS chez les honnêtes (faux positifs — indicateur, hors critères)** : 476/500 sans aucune pénalité ; pénalités levées : anti-linéarité 23, anti-contradiction 1, rythme 0, vigilance 0 ; statuts : {'OK': 476, 'PRUDENCE': 24} ; RQS moyenne = 99.04. Aucun honnête ne passe sous INVALIDE (70) : les honnêtes signalés restent en PRUDENCE.

---

## SECTION F — BUGS ET INCOHÉRENCES SIGNALÉS (signalement seul — aucune correction de mon propre initiative)

Conformément à la règle de rôle : chaque point ci-dessous est un SIGNAL à l'attention de l'orchestrateur humain + GLM superviseur. Aucun seuil, poids ou paramètre de la spécification n'a été modifié. Lorsqu'un choix d'implémentation était indispensable pour exécuter, il est explicitement documenté et son impact est quantifié.

**S1 — AMBIGUÏTÉ MAJEURE (items inversés dans le simulateur)**

La Spécification 3 dit « chaque item ~ Normal(latent de son axe, 0,5), borné [1;4], arrondi entier ». Lue LITTÉRALEMENT pour les items inversés (5, 15), la réponse BRUTE suivrait la latente positivement, et après correction (5 − brut) ces items mesureraient l'INVERSE de la latente (espérance 5 − latent) : la face A1 mesurerait alors un mélange incohérent et C2 serait structurellement ruiné. Implémentation retenue : chaque item est tiré sur l'ÉCHELLE CORRIGÉE ~ N(latent, 0,5), puis brut = 5 − corrigé pour les items 5 et 15 (l'item inversé manifeste la latente négativement en codage brut — psychométrie standard). SENSIBILITÉ EXÉCUTÉE en lecture littérale : C1 = 45.20%, C2 = 0.1956, C3 = 20/20 (vs pipeline principal : C1 = 46.10%, C2 = 0.1567, C3 = 20/20). C'est le superviseur qui arbitre.

**S2 — TENSION STRUCTURELLE MAJEURE (CI90 vs écart des seuils — dégénérescence des frontières)**

Le CI90 (score ± 1,64 × SEM = ± 0.4129, largeur 0.8257) dérivé des placeholders (SD 0,65 ; fiabilité 0,85) est PLUS LARGE que l'écart entre seuils adjacents (0,80 et 0,60). Toute lecture dont le score est compris entre ≈ 1,39 et ≈ 3,61 chevauche mécaniquement un seuil → lecture FRONTIÈRE. Observé : 937/1 000 lectures honnêtes en frontière (93.7 %). La lecture « entre X et Y » devient le cas GÉNÉRAL et non l'exception — à arbitrer (SEM placeholder trop grand pour ces seuils, ou seuils trop proches pour ce SEM).

**S3 — TENSION STRUCTURELLE MAJEURE (C1 : décision conservatrice vs niveau attendu du latent)**

C1 compare le niveau CONSERVATEUR au niveau attendu du latent. La décision conservatrice décale les frontières effectives de +1,64 × SEM (≈ +0,41) : Discrète si score < 2,21 ; Tranquille si score < 3,01 ; Vive si score < 3,61. Tout latent situé dans la bande [seuil ; seuil + 0,41] au-dessus d'un seuil est donc structurellement déclassé dès que le score y reste, MÊME SI le score ponctuel donne le bon niveau. Métriques d'arbitrage fournies (Section A.4) : exactitude PONCTUELLE et couverture CI90. Aucun de ces chiffres ne remplace le verdict C1 littéral, déclaré tel quel en Section A/G.

**S4 — INCOHÉRENCE DE COHÉRENCE INTERNE (SEM placeholder vs bruit réel du simulateur)**

Le SEM placeholder (0,65 × √0,15 = 0,2517) suppose un SD de score d'axe de 0,65. Or le simulateur (bruit d'item 0,5 + troncature + arrondi) produit un écart-type OBSERVÉ de score d'axe ≈ 0,19 (cf. Section C, colonnes SD A / SD B). Le CI90 est donc surdimensionné d'un facteur ≈ 2,2 par rapport au bruit réel. Les placeholders ne sont PAS remplacés (règle stricte) — le désaccord est signalé pour arbitrage (recaler la fiabilité/SD, ou le bruit d'item de la Spécification 3).

**S5 — C2 SUR LE FIL (seuil 0,15 vs bruit d'item 0,5)**

Avec un bruit d'item σ = 0,5, l'écart-type théorique de l'erreur d'un score d'axe (moyenne de 9 items indépendants) est ≈ 0,56/3 ≈ 0,19, soit une erreur absolue moyenne attendue ≈ 0,8 × 0,19 ≈ 0,15 — exactement au niveau du seuil C2. Résultat observé : 0.1567 (FAIL). Le critère C2 est donc à la limite de faisabilité de sa propre spécification de simulation : un très léger changement de seed peut inverser le verdict.

**S6 — AMBIGUÏTÉ (L1-a : convention d'écart-type)**

« Écart-type des 18 scores corrigés » : ddof non précisé. Choix : ddof=1 (écart-type d'échantillon). Vérifié sans impact sur C1-C4 : les linéaires donnent 0,3234 (ddof=1) vs 0,3143 (ddof=0), tous deux < 0,45 ; aucune autre catégorie de répondants ne change de statut selon la convention.

**S7 — AMBIGUÏTÉ (L1-b : items de référence pour la contradiction)**

« Moyenne des 2 autres items de sa face » : ces items n'étant pas inversés, brut = corrigé — aucune ambiguïté réelle. La pénalité est appliquée UNE FOIS au total quand les 2 items inversés déclenchent simultanément (spécification explicite « une fois au total, pas 2 ») — observé chez les acquiesceurs.

**S8 — AMBIGUÏTÉ (temps des piégés « uniformes 5,0 s / 6,0 s »)**

Intervalles non précisés. Choix : temps CONSTANTS (5,0 s / 6,0 s), seule lecture entièrement déterminée. Sans impact : dans les deux lectures, aucun item < 2,0 s et session ≥ 60 s → pas de pénalité de rythme pour linéaires et acquiesceurs.

**S9b — AMBIGUÏTÉ (durée de session)**

La session inclut-elle la question de vigilance ? Choix : session = somme des 19 questions. Sans impact : les speeders font ≈ 22,8 s (19 questions) ou ≈ 21,6 s (18 items) — session < 60 s dans les deux lectures.

**S10 — AMBIGUÏTÉ (frontière touchant DEUX seuils)**

La spec ne définit la frontière que « entre X et Y ». Quand l'CI90 chevauche deux seuils (3 niveaux touchés — fenêtres score ≈ 2,19-2,21 et ≈ 2,79-3,01), choix : frontière entre le niveau le plus bas et le plus haut touchés, conservateur = le plus bas. Observé : 43 (axe A) + 41 (axe B) lectures concernées.

**S11 — INCOHÉRENCE MINEURE (constante SE_face)**

La spec affiche SE_face = 0,72 × √(1 − 0,72) ≈ 0,379, mais la formule donne 0,38105. La FORMULE fait foi (aucun paramètre inventé) : seuil L4 = 1,64 × √(2 × SE²) = 0,8837 (au lieu de 0,8792 avec 0,379). Impact : L4 seulement — hors périmètre des critères C1-C4.

**S12 — INCOHÉRENCE MINEURE (constantes L7)**

Borne FIABLE : « 1,64 × SE_diff (≈ 0,58) » — la formule donne 0,58381 ; implémentation par la formule. Borne SUGGESTION : 0,41 est donné en littéral (= 1,64 × SEM = 0,4129 exactement) ; implémentation par le littéral. L7 est hors périmètre des critères (pas de données longitudinales) — implémenté et testé unitairement.

**S13 — CHOIX (arrondis)**

Arrondi entier des items : np.round (arrondi bancaire ; événement de mesure nulle sur tirages continus). Scores arrondis à 2 décimales AVANT les seuils L3 (spec : « Scores (2 décimales) »), bornes CI arrondies à 2 décimales pour l'affichage ET le test de chevauchement (cohérence rapport/calcul). « Borné » = clip (et non re-tirage).

**S14 — CHOIX (α de Cronbach sur items corrigés)**

α calculé sur les items CORRIGÉS (clés inversées appliquées). Sur items bruts non retournés, les items 5/15 corréleraient négativement avec les autres et l'α serait artéfactuel (négatif). Les α observés sont rapportés Section C à titre de diagnostic uniquement — les placeholders ne sont jamais remplacés.

**S15 — BLOCAGE ENVIRONNEMENT (dépôt GitHub dédié)**

La création du dépôt dédié `wtc-validation-q1` via l'API GitHub a été REFUSÉE par le token utilisé (« Resource not accessible by personal access token » — le PAT fine-grained ne dispose pas du droit de création de dépôts). Le package a été poussé tel quel (arborescence /src, /results, /figures) dans le dépôt existant du projet : WAIRYU-Dating, dossier « Wairyu thérapie couple/validation-q1/ ». Pour migrer vers un dépôt dédié : créer le dépôt (ou étendre le token avec la permission « Administration ») puis pousser ce dossier tel quel.

---

## SECTION G — VERDICT FINAL

### Fiche de verdict (à contresigner par le superviseur)

| Critère | Seuil | Observé | Verdict |
|---|---|---|---|
| C1 — Exactitude des lectures (conservateur vs latent) | ≥ 90 % | 461/1 000 = 46.10% | **FAIL** |
| C2 — Erreur moyenne |score − latent| | < 0,15 | 0.1567 | **FAIL** |
| C3 — Piégés détectés (RQS ≠ OK) | ≥ 17/20 | 20/20 (7/7 linéaires · 6/6 speeders · 4/4 acquiesceurs · 3/3 vigilance) | **PASS** |
| C4 — Reproductibilité (×2, seed 42) | identique | OUI — SHA-256 identiques | **PASS** |

### **VERDICT PACKAGE : À CORRIGER**

Motifs (déclarés tels quels, cf. Sections A et F) : C1 = 46.10% < 90 %; C2 = 0.1567 ≥ 0,15. Les tensions structurelles S2/S3/S4 (CI90 surdimensionné par les placeholders + décision conservatrice décalant les frontières effectives de +0,41) expliquent l'essentiel de l'échec C1 ; S5 explique la fragilité de C2. Corrections à arbitrer par l'orchestrateur humain + GLM superviseur (aucune correction apportée de mon propre initiative).

**Note de confiance dans l'implémentation : 9/10** — le pipeline implémente mot pour mot la spécification (constantes figées, ordre de tirage documenté, reproductibilité démontrée par SHA-256) ; le point retenu : les choix d'interprétation documentés S1/S6/S8/S9b/S10/S13, dont S1 (items inversés du simulateur) modifie mécaniquement les résultats et requiert l'arbitrage du superviseur.

**URL du dépôt GitHub : https://github.com/georgyfr/WAIRYU-Dating/tree/main/Wairyu%20th%C3%A9rapie%20couple/validation-q1** (dépôt dédié `wtc-validation-q1` impossible à créer avec le token actuel — signal S15 ; le dossier est migrable tel quel).

---

*Fin du rapport — sections A à G exhaustives. Sorties brutes associées : `results/lectures_detaillees.csv` (1 000 lectures), `results/reponses_honnetes_calculees.csv` (500), `results/reponses_pieges_calculees.csv` (20), `results/rqs_detail.csv` (520), `results/matrices_confusion.csv`, `results/stats_groupes.csv`, `results/criteres_c1_c4.json`.*
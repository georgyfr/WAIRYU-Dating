# RAPPORT FINAL DÉTAILLÉ — PACKAGE WTC-Q1-R1 (RÉVISION POST-VALIDATION)
## Validation révisée de la Quête 1 « Comment je me raccroche » (échelle d'attachement adulte originale WAIRYU, fiche RIO-01)

- **Projet** : WAIRYU Thérapie Couple — 26 dimensions cliniques, 110 quêtes, doctrine d'instruments originaux
- **Réponse à** : rapport WTC-Q1 du run initial (commit 3eb7399, dossier `validation-q1/`) — code CONSERVÉ, paramètres et critères révisés (D1-D5)
- **Exécuteur** : Data Insight — rôle strict d'implémentation (aucune correction libre ; toute anomalie → Section F)
- **Date d'exécution** : 2026-10-14 · **Seed** : 42 (numpy PCG64) · **Reproductibilité** : pipeline exécuté 2 fois (C4)
- **Modifications appliquées** : D1 SEM structurel 0,195 (CI90 ± 0,3198) · D2 critères C1a/C1b/C1c · D3 C2 ∈ [0,14 ; 0,18] · D4 items inversés confirmés · D5 C3/C4 re-vérifiés
- **Population** : 500 honnêtes (G1 n=200 · G2 n=150 · G3 n=100 · G4 n=50) + 20 piégés (7 linéaires · 6 speeders · 4 acquiesceurs · 3 vigilance ratée) — simulation IDENTIQUE au run initial (même seed, même ordre de tirage)
- **Références citées** : Bowlby ; Brennan, Clark & Shaver. Instrument original WAIRYU.
- **Sorties** : `results/` (CSV + JSON) · `figures/` (4 PNG) · ce rapport

> **Cadre du rapport** : sections exhaustives. La vérité du système prime sur son succès apparent : chaque critère est déclaré tel quel, PASS ou FAIL, et les attentes de l'orchestrateur sont comparées aux observations (Sections E et F).

---

## SECTION A — LES 6 SOUS-CRITÈRES R1

### A.1 Tableau synoptique (critères éliminatoires R1)

| Critère | Définition (D2/D3/D5) | Seuil | Résultat observé | Verdict |
|---|---|---|---|---|
| C1a — Couverture | latent ∈ CI90 (score ± 1,64 × 0,195) | ∈ [87 % ; 95 %] | 89,9 % | **PASS** |
| C1b — Exactitude ponctuelle | niveau(score) == niveau(latent), sans règle conservatrice | ≥ 78 % (plafond théorique ≈ 80,5 %) | 79,7 % | **PASS** |
| C1c — Règle conservatrice | validée sur ses termes (i)(ii)(iii) | (i) 100 % · (ii) 100 % · (iii) ≥ 85 % | (i) 100,0 % · (ii) 99,8 % · (iii) 100,0 % (n = 63) | **FAIL** |
| C2 — Erreur moyenne | \|score − latent\| moyen (1 000 lectures) | ∈ [0,14 ; 0,18] | 0,1567 | **PASS** |
| C3 — Piégés détectés | statut RQS ≠ OK (inchangé, D5) | ≥ 17/20 | 20/20 | **PASS** |
| C4 — Reproductibilité | pipeline ×2, seed 42 (inchangé, D5) | sorties strictement identiques | OUI (SHA-256) | **PASS** |

### A.2 C1a — couverture CI90, détail

| Portée | Couverture | Zone PASS |
|---|---|---|
| Globale (1 000 lectures) | 89,9 % | [87 % ; 95 %] → PASS |
| Axe A « PEUR DE PERDRE » (500 lectures) | 90,0 % | PASS |
| Axe B « PEUR DE DÉPENDRE » (500 lectures) | 89,8 % | PASS |
| Groupe G1 — axe A (n = 200) | 89,0 % | — |
| Groupe G1 — axe B (n = 200) | 91,5 % | — |
| Groupe G2 — axe A (n = 150) | 90,0 % | — |
| Groupe G2 — axe B (n = 150) | 86,7 % | — |
| Groupe G3 — axe A (n = 100) | 92,0 % | — |
| Groupe G3 — axe B (n = 100) | 92,0 % | — |
| Groupe G4 — axe A (n = 50) | 90,0 % | — |
| Groupe G4 — axe B (n = 50) | 88,0 % | — |

Contrôle de cohérence : SEM structurel 0,195 → demi-largeur CI90 = 1,64 × 0,195 = 0,3198. Pour une erreur d'axe ~ N(0 ; σ) avec σ ≈ 0,19 (bruit d'item 0,5/√9 + arrondi), la couverture théorique attendue est 2Φ(1,64 × 0,195/0,19) − 1 ≈ 90 %. Observé : **89,9 %** — conforme à la théorie et dans la zone PASS. (Run initial : 96,2 % / 97,6 % avec le CI surdimensionné ± 0,4129 — la baisse est la signature attendue de la correction D1, et non une dégradation du modèle.)

### A.3 C1b — exactitude ponctuelle, détail

| Portée | Exactitude ponctuelle | Verdict (≥ 78 %) |
|---|---|---|
| Globale (1 000 lectures) | 79,7 % | PASS |
| Axe A « PEUR DE PERDRE » | 80,0 % | PASS |
| Axe B « PEUR DE DÉPENDRE » | 79,4 % | PASS |
| Groupe G1 — axe A | 83,0 % | — |
| Groupe G1 — axe B | 83,0 % | — |
| Groupe G2 — axe A | 76,7 % | — |
| Groupe G2 — axe B | 77,3 % | — |
| Groupe G3 — axe A | 78,0 % | — |
| Groupe G3 — axe B | 75,0 % | — |
| Groupe G4 — axe A | 82,0 % | — |
| Groupe G4 — axe B | 80,0 % | — |

**NOTE À DOCUMENTER (exigée par D2)** : le plafond d'exactitude ≈ 80,5 % provient des groupes G2/G4 placés à 0,10 du seuil 3,20 — c'est **VOLONTAIRE** (les vrais utilisateurs existent aux seuils). Pour un latent à 0,10 sous le seuil, P(score ≥ 3,20) ≈ 30 % : ces lectures sont mécaniquement « erronées » en lecture ponctuelle alors même que le score reste à distance SEM de son latent. Le traitement clinique des cas de seuil = frontière nommée + décision conservatrice + re-test, **jamais le score seul**. L'exactitude observée ici (79,7 %) se situe sous et proche de ce plafond documenté — c'est le comportement attendu de la configuration, pas un défaut du code.

### A.4 C1c — la règle conservatrice validée sur ses propres termes

| Terme | Définition | Exigence | Observé | Verdict |
|---|---|---|---|---|
| (i) | niveau_conservateur ≤ niveau_ponctuel (en rang) | 100 % | 1000/1 000 = 100,0 % | PASS |
| (ii) | rang(latent) − rang(conservateur) ≤ 1 (jamais > 1 cran sous niveau(latent)) | 100 % | 998/1 000 = 99,8 % (2 violation(s)) | FAIL |
| (iii) | score à ≥ 0,45 de tout seuil → conservateur == ponctuel | ≥ 85 % | 63/63 = 100,0 % | PASS |

**Détail des violations (ii)** — lectures où le niveau conservateur descend de 2 crans ou plus sous le niveau du latent :

| ID | Groupe | Axe | Latent | Niveau latent | Score | Ponctuel | CI90 | Niveaux touchés | Conservateur | Crans sous latent |
|---|---|---|---|---|---|---|---|---|---|---|
| H291 | G2 | A | 3,2597 | Forte | 2,78 | Vive | [2.46 ; 3.10] | Tranquille, Vive | Tranquille | 2 |
| H405 | G3 | B | 3,5943 | Forte | 2,89 | Vive | [2.57 ; 3.21] | Tranquille, Vive, Forte | Tranquille | 2 |

Analyse du terme (iii) : un score à ≥ 0,45 de tout seuil ne peut voir son CI90 (± 0,3198) chevaucher un seuil — la lecture est alors nécessairement un niveau pur et conservateur == ponctuel. Le sous-échantillon éligible (n = 63 lectures, scores ≤ 1,35 ou ≥ 3,65) donne 100,0 % d'accord : conforme (la propriété est structurelle, l'exigence de 85 % laisse une marge).

### A.5 C2 — erreur moyenne, détail

| Axe | Erreur moyenne | RMSE | Biais moyen (signé) | Erreur max |
|---|---|---|---|---|
| A « PEUR DE PERDRE » | 0,1524 | 0,1913 | -0,0098 | 0,6118 |
| B « PEUR DE DÉPENDRE » | 0,1611 | 0,1974 | -0,0089 | 0,7043 |
| GLOBAL | 0,1567 | 0,1944 | -0,0094 | 0,7043 |

Erreur moyenne par groupe (axe A / axe B) : G1 0,1524 / 0,1463 · G2 0,1579 / 0,1791 · G3 0,1470 / 0,1616 · G4 0,1461 / 0,1657.

Cohérence structurelle (D3) : SEM 0,195 → erreur moyenne théorique E|N(0 ; σ)| = 0,798 × 0,195 ≈ 0,1556 (l'orchestrateur cite ≈ 0,156). Observé : **0,1567** → SEM implicite ≈ 0,1964 — l'erreur moyenne observée VALIDE rétroactivement le SEM structurel (run initial : 0,1567 avec la même simulation — identique, puisque la simulation est inchangée ; seul le cadre d'acceptation change). Verdict : **PASS**.

### A.6 C3 — détection des piégés (inchangé — contrôle de non-régression D5)

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

### A.7 C4 — reproductibilité (inchangée — contrôle de non-régression D5)

- Deux exécutions complètes du pipeline (simulation → évaluation → métriques) avec seed = 42.
- Empreinte SHA-256 des métriques — exécution 1 : `393887f2149e9331…` · exécution 2 : `393887f2149e9331…`
- Empreinte SHA-256 des 520 évaluations individuelles (CSV sérialisés) — exécution 1 : `fc126659992c2f0f…` · exécution 2 : `fc126659992c2f0f…`
- **Sorties strictement identiques : OUI** → **PASS**

---

## SECTION B — MATRICES DE CONFUSION PONCTUELLES + RÈGLE CONSERVATRICE

### Axe A « PEUR DE PERDRE » — matrice PONCTUELLE (score vs latent — référence C1b)

| Attendu ↓ · Score → | Discrète | Tranquille | Vive | Forte | Total |
|---|---|---|---|---|---|
| Discrète | 63 | 15 | 0 | 0 | 78 |
| Tranquille | 27 | 185 | 14 | 0 | 226 |
| Vive | 0 | 11 | 77 | 20 | 108 |
| Forte | 0 | 0 | 13 | 75 | 88 |

- Frontières L3 (CI90 chevauchant un seuil) : **408/500 (81,6 %)** ; démotions conservatrices (conservateur < ponctuel) : **227/500 (45,4 %)** ; lectures touchant deux seuils à la fois : 14.

Variante auxiliaire — niveau CONSERVATEUR (après décision conservatrice) :

| Attendu ↓ · Conservateur → | Discrète | Tranquille | Vive | Forte | Total |
|---|---|---|---|---|---|
| Discrète | 78 | 0 | 0 | 0 | 78 |
| Tranquille | 114 | 112 | 0 | 0 | 226 |
| Vive | 0 | 54 | 54 | 0 | 108 |
| Forte | 0 | 1 | 59 | 28 | 88 |

### Axe B « PEUR DE DÉPENDRE » — matrice PONCTUELLE (score vs latent — référence C1b)

| Attendu ↓ · Score → | Discrète | Tranquille | Vive | Forte | Total |
|---|---|---|---|---|---|
| Discrète | 63 | 14 | 0 | 0 | 77 |
| Tranquille | 34 | 203 | 10 | 0 | 247 |
| Vive | 0 | 15 | 77 | 19 | 111 |
| Forte | 0 | 0 | 11 | 54 | 65 |

- Frontières L3 (CI90 chevauchant un seuil) : **415/500 (83,0 %)** ; démotions conservatrices (conservateur < ponctuel) : **232/500 (46,4 %)** ; lectures touchant deux seuils à la fois : 21.

Variante auxiliaire — niveau CONSERVATEUR (après décision conservatrice) :

| Attendu ↓ · Conservateur → | Discrète | Tranquille | Vive | Forte | Total |
|---|---|---|---|---|---|
| Discrète | 77 | 0 | 0 | 0 | 77 |
| Tranquille | 142 | 105 | 0 | 0 | 247 |
| Vive | 0 | 63 | 47 | 1 | 111 |
| Forte | 0 | 1 | 43 | 21 | 65 |

### Tableau séparé — la règle conservatrice sur ses termes (C1c)

| Terme | Définition opérationnelle | Exigence | Respectées / Total | Taux | Verdict |
|---|---|---|---|---|---|
| (i) | rang(conservateur) ≤ rang(ponctuel) — la décision conservatrice ne peut qu'abaisser la lecture | 100 % | 1000/1 000 | 100,0 % | PASS |
| (ii) | rang(latent) − rang(conservateur) ≤ 1 — jamais plus d'un cran sous le niveau du latent | 100 % | 998/1 000 | 99,8 % | FAIL |
| (iii) | si le score est à ≥ 0,45 de tout seuil (1,80 / 2,60 / 3,20) alors conservateur == ponctuel | ≥ 85 % | 63/63 | 100,0 % | PASS |

Lecture des matrices : lignes = niveau attendu (seuils appliqués au latent) ; colonnes = niveau du score en lecture ponctuelle (matrices principales, référence C1b) ou après décision conservatrice (variantes auxiliaires). La diagonale regroupe les correspondances. Figures : `figures/Heatmap_MatriceConfusionPonctuelle_AxeA_R1_*.png` et `AxeB_R1_*.png`.

---

## SECTION C — STATISTIQUES PAR GROUPE (G1-G4) ET ALPHA DE CRONBACH OBSERVÉ

Pour chaque groupe : moyennes et écart-types des scores calculés (axes A et B), écart entre mu simulé (paramètre de la Spécification 3) et moyenne calculée, et α de Cronbach OBSERVÉ par axe. **Les α observés sont des indicateurs de diagnostic ; la comparaison au run initial (α A = 0,9155 — la référence « 0,916 » — et α B = 0,9082) est un contrôle de NON-RÉGRESSION exigé par le package R1.**

| Groupe | n | μ_A | Latente A (moy.) | Score A (moy.) | SD A | Écart μ_A | α Cronbach A | μ_B | Latente B (moy.) | Score B (moy.) | SD B | Écart μ_B | α Cronbach B |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| G1 « tranquille » | 200 | 2,0 | 1,984 | 1,978 | 0,372 | -0,022 | 0,753 | 2,1 | 2,042 | 2,025 | 0,386 | -0,075 | 0,750 |
| G2 « peur de perdre » | 150 | 3,1 | 3,085 | 3,052 | 0,379 | -0,048 | 0,752 | 2,1 | 2,116 | 2,110 | 0,420 | 0,009 | 0,798 |
| G3 « peur de dépendre » | 100 | 2,1 | 2,109 | 2,126 | 0,375 | 0,026 | 0,739 | 3,2 | 3,192 | 3,179 | 0,297 | -0,021 | 0,584 |
| G4 « ambivalent » | 50 | 3,1 | 3,227 | 3,218 | 0,355 | 0,118 | 0,718 | 3,1 | 3,062 | 3,089 | 0,399 | -0,011 | 0,782 |

**α de Cronbach observés, population honnête complète (500 répondants)** : Axe A = **0,9155** (run initial : 0,9155 ; Δ = 0,0000) · Axe B = **0,9082** (run initial : 0,9082 ; Δ = 0,0000).

**NON-RÉGRESSION α : PRÉSERVÉE** (écarts ≤ ± 0,02 — tolérance documentée ; attendu puisque la simulation est identique au run initial et que D1 ne touche ni les items ni les scores, seulement le CI90 et les lectures).

**Lecture** : les α de groupe (≈ 0,75-0,80) reflètent la variance de latente WITHIN-groupe (σ² = 0,35²) rapportée au bruit d'item (σ ≈ 0,56 après troncature/arrondi) ; les α poolés (≈ 0,91) sont gonflés par la variance BETWEEN-groupes (moyennes 2,0-3,1). Les α poolés restent la métrique de référence demandée (0,916 au run initial). L'écart-type OBSERVÉ des scores d'axe (≈ 0,39, mélange inter-groupes) englobe le SEM structurel 0,195 qui, lui, modélise le bruit de mesure INTRA-sujet — la cohérence D1 est confirmée par C2 (erreur moyenne ≈ 0,798 × 0,195, cf. A.5).

---

## SECTION D — TROIS EXEMPLES TRACÉS DE BOUT EN BOUT (DONT 1 CAS DE FRONTIÈRE)

Traçabilité ligne par ligne : les 18 réponses → scores corrigés → scores des faces → scores d'axes + CI90 (SEM structurel) → lecture L3 (niveau ou frontière) → décision conservatrice → conformité C1c → verdict RQS. Sélection : 1) le premier répondant dont les DEUX lectures sont des niveaux purs (cas général, sans frontière) ; 2) le premier répondant dont une lecture est FRONTIÈRE avec démission conservatrice (cas de frontière exigé) ; 3) le premier piégé (linéaire).

### Exemple 1 — répondant HONNÊTE H063 (G1) — cas général, deux niveaux purs

**H063** — groupe G1 « tranquille » · latent_A = 2,2157 · latent_B = 1,2855 · vigilance = 3 (OK)

Réponses brutes → scores corrigés (items inversés 5 et 15 : corrigé = 5 − brut) :

| Item | Face | Brut | Corrigé |
|---|---|---|---|
| 1 | A1 | 1 | 1 |
| 2 | A1 | 2 | 2 |
| 3 | A2 | 3 | 3 |
| 4 | A2 | 2 | 2 |
| 5 | A1 (inversé) | 3 | 2 |
| 6 | A2 | 3 | 3 |
| 7 | A3 | 3 | 3 |
| 8 | A3 | 2 | 2 |
| 9 | A3 | 2 | 2 |
| 10 | B1 | 2 | 2 |
| 11 | B1 | 1 | 1 |
| 12 | B2 | 2 | 2 |
| 13 | B2 | 1 | 1 |
| 14 | B2 | 1 | 1 |
| 15 | B1 (inversé) | 4 | 1 |
| 16 | B3 | 1 | 1 |
| 17 | B3 | 1 | 1 |
| 18 | B3 | 1 | 1 |

Scores des faces — moyenne des 3 items corrigés :

| Face | Nom | Axe | Calcul | Score |
|---|---|---|---|---|
| A1 | « Vigie » | Axe A | (1 + 2 + 2) / 3 | 1,67 |
| A2 | « Besoin de mots » | Axe A | (3 + 2 + 3) / 3 | 2,67 |
| A3 | « Rumeur » | Axe A | (3 + 2 + 2) / 3 | 2,33 |
| B1 | « Inconfort du près » | Axe B | (2 + 1 + 1) / 3 | 1,33 |
| B2 | « Debout-seul » | Axe B | (2 + 1 + 1) / 3 | 1,33 |
| B3 | « Porte fermée » | Axe B | (1 + 1 + 1) / 3 | 1,00 |

Scores d'axes, CI90 (SEM structurel 0,195 → ± 0,3198), lectures L3 et critères R1 :

| Axe | Score | CI90 | Lecture L3 | Niveau ponctuel | Conservateur | Attendu (latent) | C1b | C1c (i)/(ii)/(iii) |
|---|---|---|---|---|---|---|---|---|
| A « PEUR DE PERDRE » | 2,22 | [1,90 ; 2,54] | NIVEAU — Tranquille | Tranquille | Tranquille | 2,2157 → **Tranquille** | OUI | (i) OK · (ii) 0 cran(s) sous latent OK · (iii) non éligible (score à moins de 0,45 d un seuil) |
| B « PEUR DE DÉPENDRE » | 1,22 | [0,90 ; 1,54] | NIVEAU — Discrète | Discrète | Discrète | 1,2855 → **Discrète** | OUI | (i) OK · (ii) 0 cran(s) sous latent OK · (iii) éligible |

Faces dominantes (L4, indicatif — hors critères R1) :

| Axe | Ordre des faces | Écart 1-2 | Seuil L4 | Lecture |
|---|---|---|---|---|
| A | A2 > A3 > A1 | 0,34 | 0,8836 | nuage |
| B | B1 > B2 > B3 | 0,00 | 0,8836 | nuage |

Qualité de réponse (L1 — RQS) :

```text
  (a) anti-linéarité : écart-type des 18 corrigés = 0.752 >= 0.45 → pas de pénalité
  (b) anti-contradiction : aucun écart >= 2,5 → pas de pénalité
  (c) rythme : 0 item(s) < 2.0 s ; session 123.8 s → pas de pénalité
  (d) vigilance : réponse 3 = 3 → pas de pénalité
```

**Verdict RQS : 100/100 → statut OK**

### Exemple 2 — répondant HONNÊTE H001 (G1) — CAS DE FRONTIÈRE (axe A)

**H001** — groupe G1 « tranquille » · latent_A = 2,1067 · latent_B = 1,7360 · vigilance = 3 (OK)

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
| A1 | « Vigie » | Axe A | (2 + 3 + 2) / 3 | 2,33 |
| A2 | « Besoin de mots » | Axe A | (1 + 1 + 2) / 3 | 1,33 |
| A3 | « Rumeur » | Axe A | (2 + 2 + 3) / 3 | 2,33 |
| B1 | « Inconfort du près » | Axe B | (2 + 2 + 2) / 3 | 2,00 |
| B2 | « Debout-seul » | Axe B | (2 + 2 + 1) / 3 | 1,67 |
| B3 | « Porte fermée » | Axe B | (1 + 2 + 2) / 3 | 1,67 |

Scores d'axes, CI90 (SEM structurel 0,195 → ± 0,3198), lectures L3 et critères R1 :

| Axe | Score | CI90 | Lecture L3 | Niveau ponctuel | Conservateur | Attendu (latent) | C1b | C1c (i)/(ii)/(iii) |
|---|---|---|---|---|---|---|---|---|
| A « PEUR DE PERDRE » | 2,00 | [1,68 ; 2,32] | FRONTIERE — entre Discrète et Tranquille | Tranquille | Discrète | 2,1067 → **Tranquille** | OUI | (i) OK · (ii) 1 cran(s) sous latent OK · (iii) non éligible (score à moins de 0,45 d un seuil) |
| B « PEUR DE DÉPENDRE » | 1,78 | [1,46 ; 2,10] | FRONTIERE — entre Discrète et Tranquille | Discrète | Discrète | 1,7360 → **Discrète** | OUI | (i) OK · (ii) 0 cran(s) sous latent OK · (iii) non éligible (score à moins de 0,45 d un seuil) |

**Cas de frontière (axe A)** : le score de 2,00 produit un CI90 [1,68 ; 2,32] qui chevauche le(s) seuil(s) délimitant les niveaux touchés (Discrète · Tranquille). Lecture L3 = FRONTIÈRE « entre Discrète et Tranquille » ; décision conservatrice = niveau le plus bas touché = **Discrète** (niveau ponctuel : Tranquille). Conformité C1c : (i) conservateur ≤ ponctuel → respecté ; (ii) écart au niveau du latent = 1 cran(s) (≤ 1 → respecté) ; (iii) sans objet ici (le score est à 0,20 d'un seuil, < 0,45).

Faces dominantes (L4, indicatif — hors critères R1) :

| Axe | Ordre des faces | Écart 1-2 | Seuil L4 | Lecture |
|---|---|---|---|---|
| A | A1 > A3 > A2 | 0,00 | 0,8836 | nuage |
| B | B1 > B2 > B3 | 0,33 | 0,8836 | nuage |

Qualité de réponse (L1 — RQS) :

```text
  (a) anti-linéarité : écart-type des 18 corrigés = 0.583 >= 0.45 → pas de pénalité
  (b) anti-contradiction : aucun écart >= 2,5 → pas de pénalité
  (c) rythme : 0 item(s) < 2.0 s ; session 117.1 s → pas de pénalité
  (d) vigilance : réponse 3 = 3 → pas de pénalité
```

**Verdict RQS : 100/100 → statut OK**

### Exemple 3 — répondant PIÉGÉ (linéaire)

**P01** — piégé type « lineaire » · vigilance = 3 (attendu 3) · durée de session = 95,0 s

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
| A1 | « Vigie » | Axe A | (2 + 2 + 3) / 3 | 2,33 |
| A2 | « Besoin de mots » | Axe A | (2 + 2 + 2) / 3 | 2,00 |
| A3 | « Rumeur » | Axe A | (2 + 2 + 2) / 3 | 2,00 |
| B1 | « Inconfort du près » | Axe B | (2 + 2 + 3) / 3 | 2,33 |
| B2 | « Debout-seul » | Axe B | (2 + 2 + 2) / 3 | 2,00 |
| B3 | « Porte fermée » | Axe B | (2 + 2 + 2) / 3 | 2,00 |

Scores d'axes, CI90 (SEM structurel 0,195 → ± 0,3198), lectures L3 et critères R1 :

| Axe | Score | CI90 | Lecture L3 | Niveau ponctuel | Conservateur | Attendu (latent) | C1b | C1c (i)/(ii)/(iii) |
|---|---|---|---|---|---|---|---|---|
| A « PEUR DE PERDRE » | 2,11 | [1,79 ; 2,43] | FRONTIERE — entre Discrète et Tranquille | Tranquille | Discrète | — | non | n/a (piégé) |
| B « PEUR DE DÉPENDRE » | 2,11 | [1,79 ; 2,43] | FRONTIERE — entre Discrète et Tranquille | Tranquille | Discrète | — | non | n/a (piégé) |

Faces dominantes (L4, indicatif — hors critères R1) :

| Axe | Ordre des faces | Écart 1-2 | Seuil L4 | Lecture |
|---|---|---|---|---|
| A | A1 > A2 > A3 | 0,33 | 0,8836 | nuage |
| B | B1 > B2 > B3 | 0,33 | 0,8836 | nuage |

Qualité de réponse (L1 — RQS) :

```text
  (a) anti-linéarité : écart-type des 18 corrigés = 0.323 < 0.45 → -20
  (b) anti-contradiction : aucun écart >= 2,5 → pas de pénalité
  (c) rythme : 0 item(s) < 2.0 s ; session 95.0 s → pas de pénalité
  (d) vigilance : réponse 3 = 3 → pas de pénalité
```

**Verdict RQS : 80/100 → statut PRUDENCE** — piégé DÉTECTÉ (détecté ⇔ statut ≠ OK)

---

## SECTION E — ANALYSE DES FRONTIÈRES APRÈS CORRECTION D1

**Fréquences observées** : 823/1 000 lectures honnêtes en lecture FRONTIÈRE (82,3 %) — Axe A : 408/500 (81,6 %) · Axe B : 415/500 (83,0 %). Démotions conservatrices effectives (conservateur strictement sous le niveau ponctuel) : 459/1 000 (45,9 %) — Axe A : 227/500 (45,4 %) · Axe B : 232/500 (46,4 %).

**Comparaison aux références** : attendu orchestrateur ≈ 25-35 % ; run initial : 93,2 % / 94,2 % (la valeur « 93 % » cité par le package). La correction D1 divise la demi-largeur du CI90 par ≈ 1,29 (± 0,4129 → ± 0,3198) et fait chuter les frontières de ~93 % à **82,3 %** — la dégénérescence du run initial est corrigée. **L'objectif annoncé de 25-35 % n'est ATTEINT NI en taux de frontières ni en taux de démotions** — l'écart est STRUCTUREL et s'explique par le placement des groupes, pas par le SEM : les points suivants le démontrent (cf. aussi S-R1-2 en Section F).

1. **Groupes placés volontairement sur les seuils** : G2/G4 à 0,10 du seuil 3,20 (documenté « VOLONTAIRE » par D2), G3-B exactement SUR 3,20, G1-A/G3-A à 0,20-0,30 du seuil 1,80. Or une lecture est frontière dès que le score tombe à moins de 0,3198 d'un seuil ; avec des latents aussi proches des seuils, une forte proportion de lectures tombe mécaniquement dans ces fenêtres. La fréquence de frontières est donc une propriété de la POPULATION de test, pas un paramètre libre du modèle.

2. **La bande Vive (0,60 de large) reste plus étroite que la largeur du CI90 (0,6396)** : aucun score de la zone [2,60 ; 3,20[ ne peut être lu en niveau PUR — tout score Vive chevauche 2,60 ou 3,20. Les niveaux purs possibles sont : Discrète (score ≤ 1,4802), Tranquille (fenêtre étroite [2,1198 ; 2,2802], largeur 0,1604) et Forte (score ≥ 3,5198). Cette structure est signalée (S-R1-6) : elle borne STRUCTURELLEMENT la fréquence minimale de frontières à la fraction de lectures dont le score tombe en zone Vive.

3. **Décomposition mesurée par groupe** (figure `figures/BarChart_Frontieres_R1_*.png`) :

| Groupe | n | Frontières A | Démotions A | n | Frontières B | Démotions B |
|---|---|---|---|---|---|---|
| G1 | 200 | 80,0 % | 40,5 % | 200 | 80,0 % | 39,0 % |
| G2 | 150 | 87,3 % | 55,3 % | 150 | 84,7 % | 44,0 % |
| G3 | 100 | 79,0 % | 36,0 % | 100 | 88,0 % | 62,0 % |
| G4 | 50 | 76,0 % | 54,0 % | 50 | 80,0 % | 52,0 % |

**La décision conservatrice a-t-elle été correctement appliquée ?** OUI — contrôle programmatique : pour les 1 000 lectures, le niveau retenu est EXACTEMENT le niveau le plus bas touché par l'intervalle CI90 (1 000/1 000 vérifications réussies ; garde-fou : exception si un intervalle ne touche aucun niveau).

**Lectures touchant DEUX seuils à la fois (3 niveaux touchés)** : Axe A 14 · Axe B 21 (fenêtre score ≈ [2,2802 ; 2,9198] ∩ chevauchement 3,20 — le couple 1,80/2,60 ne peut plus être doublement chevauché, l'écart 0,80 excédant la largeur CI90 0,6396 ; cf. S-R1-7).

**Drapeaux RQS chez les honnêtes (faux positifs — indicateur, hors critères)** : 476/500 sans aucune pénalité ; pénalités levées : anti-linéarité 23, anti-contradiction 1, rythme 0, vigilance 0 ; statuts : {'OK': 476, 'PRUDENCE': 24} ; RQS moyenne = 99,04. Aucun honnête ne passe sous INVALIDE (70) : les honnêtes signalés restent en PRUDENCE.

---

## SECTION F — SIGNALEMENTS (signalement seul — aucune correction de ma propre initiative)

Conformément aux règles persistantes : chaque point ci-dessous est un SIGNAL à l'attention de l'orchestrateur. Aucun paramètre de la spécification révisée n'a été modifié au-delà des modifications D1-D5 imposées. Les choix d'implémentation hérités du run initial sont conservés et rappelés en fin de section.

**S-R1-1 — CRITÈRE C1c-(ii) : résultat et mécanique**

Le terme (ii) — « jamais > 1 cran sous niveau(latent) », exigé à 100 % — est VIOLÉ sur 2 lecture(s) sur 1 000 (détail complet en Section A.4 et `results/violations_c1c.csv`). Mécanique de la violation : elle exige CUMULATIVEMENT (a) que le score tombe un cran sous le niveau du latent (erreur de score ≈ un cran, événement normal à ± 1,6-2 σ pour des latents proches d'un seuil) ET (b) que le CI90 du score redescende encore d'un cran (score dans le tiers bas de son niveau, à moins de 0,3198 du seuil inférieur). Les cas se concentrent donc sur les latents Forte proches de 3,20 (G3-B est placé EXACTEMENT sur 3,20 ; G2-A/G4 à 0,10) — configuration volontaire du simulateur. Trois options d'arbitrage (au choix de l'orchestrateur, AUCUNE appliquée de mon propre chef) : (1) admettre 2 crans pour les lectures dont le score ponctuel est lui-même déjà ≥ 1 cran sous le latent ; (2) n'évaluer (ii) que sur les lectures RQS-OK sans frontière ; (3) décaler G3-B (3,2 → 3,3) si l'objectif est de tester la règle loin des seuils. Le terme (i), lui, est structurellement sûr (la règle L3 ne peut qu'abaisser : 1000/1 000).

**S-R1-2 — ÉCART À L'ATTENTE « 25-35 % » DE FRÉQUENCE DES FRONTIÈRES**

L'orchestrateur annonçait une fréquence attendue de ~25-35 % après correction (vs 93 % au run initial). Observé : 82,3 % de lectures frontières et 45,9 % de démissions conservatrices effectives. L'écart à l'attente ne provient NI du code NI du SEM (dont la valeur structurelle est validée par C1a ≈ 90 % et C2 ≈ 0,156) mais de la GÉOMÉTRIE COMBINÉE seuils × population : (a) la bande Vive mesure 0,60 < largeur CI90 0,6396 → TOUT score Vive est frontière (aucun niveau pur possible, cf. S-R1-6) ; (b) les groupes G2/G4 (à 0,10 de 3,20), G3-B (sur 3,20) et G1-A/G3-A (à 0,20-0,30 de 1,80) placent ~65 % des lectures dans des zones où le score tombe fréquemment à moins de 0,3198 d'un seuil. Pour atteindre 25-35 %, il faudrait soit des seuils plus espacés (≥ 0,64), soit un CI90 plus étroit (≤ ± 0,30 rendrait Vive à peine pure — ≤ ± 0,27 le garantit), soit une population de test éloignée des seuils — trois leviers qui appartiennent à l'orchestrateur. Le signalement S-R1-2 du run initial (dégénérescence) est en revanche RÉSOLU : la lecture par niveau pur redevient possible sur Discrète, Tranquille et Forte, et le couple de seuils 1,80/2,60 ne peut plus être chevauché simultanément.

**S-R1-3 — CONSTANTES L7 ENTRAÎNÉES PAR LE SEM STRUCTUREL (hors périmètre des critères)**

L7 (Jacobson & Truax) n'est pas couvert par les modifications D1-D5. Par fidélité à la formule structurelle SE_diff = √2 × SEM, les constantes dérivées deviennent : SE_diff = 0,27577 (documenté run initial : ≈ 0,356) et seuil FIABLE = 1,64 × SE_diff = 0,45227 (documenté : ≈ 0,58) ; la borne SUGGESTION littérale 0,41 est conservée telle quelle mais ne vaut plus 1,64 × SEM (= 0,3198). L7 étant hors périmètre des critères R1 (pas de données longitudinales), AUCUN recalibrage n'a été appliqué — l'orchestrateur arbitrera (recalibrer les littéraux 0,356/0,58/0,41 sur la base du SEM 0,195, ou geler L7 en l'état documenté).

**S-R1-4 — CHOIX (demi-largeur CI90 : formule vs affichage)**

La modification D1 affiche « ± 0,32 » mais la formule prescrite donne 1,64 × 0,195 = 0,3198. La FORMULE fait foi (aucun paramètre inventé) ; l'écart (0,0002) est sans effet pratique sur des scores à 2 décimales (les fenêtres de frontière se décalent de 0,0002, aucun cas limite réel). Signalé pour traçabilité.

**S-R1-5 — HÉRITÉ (SE_face inchangé conformément à D1)**

D1 prescrit « SE_face inchangé (0,379 — cohérent, non recalibré cette passe) ». La formule du run initial donne 0,72 × √(1 − 0,72) = 0,38099 (affiché « ≈ 0,379 » — écart 0,002, hérité du signal S11 du run initial). La FORMULE continue de faire foi : seuil L4 = 1,64 × √(2 × SE²) = 0,8836. Impact : L4 seulement — hors périmètre des critères R1.

**S-R1-6 — TENSION STRUCTURELLE RÉSIDUELLE (bande Vive plus étroite que le CI90)**

La bande Vive couvre [2,60 ; 3,20[ soit 0,60 de large, tandis que la largeur du CI90 est 0,6396 (± 1,64 × 0,195). Conséquence géométrique : AUCUN score de la zone Vive ne peut être lu en niveau pur — toute lecture dont le score tombe en zone Vive est FRONTIÈRE (vers Tranquille, Forte, ou les deux). Les niveaux purs possibles sont Discrète (score ≤ 1,4802), Tranquille (fenêtre [2,1198 ; 2,2802], largeur 0,1604) et Forte (score ≥ 3,5198). C'est la borne structurelle qui empêche d'atteindre 25-35 % de frontières avec la population actuelle (cf. S-R1-2). À arbitrer : élargir les bandes de niveaux, réduire le z90 ou assumer la lecture frontière systématique en zone Vive (le traitement clinique par frontière + re-test resterait cohérent).

**S-R1-7 — CHOIX (frontière touchant DEUX seuils — hérité du signal S10, recalibré R1)**

Quand l'CI90 chevauche deux seuils (3 niveaux touchés), la spec ne définit la frontière que « entre X et Y ». Choix conservé du run initial : frontière entre le niveau le plus bas et le plus haut touchés, décision conservatrice = le plus bas. Recalibrage R1 : le couple 1,80/2,60 ne peut PLUS être doublement chevauché (écart 0,80 > largeur CI90 0,6396) ; seul le couple 2,60/3,20 reste concerné (fenêtre score ≈ [2,9198 ; 2,8802] inversée — scores ≈ 2,88-2,92). Observé : 14 (axe A) + 21 (axe B) lectures concernées.

**S-R1-8 — NON-RÉGRESSION (α de Cronbach, C3, C4)**

α poolés : axe A 0,9155 (run initial 0,9155, Δ 0,0000) · axe B 0,9082 (run initial 0,9082, Δ 0,0000) → non-régression PRÉSERVÉE (tolérance ± 0,02). C3 : 20/20 (run initial : 20/20) → non-régression OK. C4 : sorties strictement identiques (OUI). La simulation étant inchangée (même seed, même ordre de tirage), les scores, α et erreurs sont IDENTIQUES au run initial — seuls les CI90, les lectures L3 et les critères changent, conformément aux modifications D1-D3.

**S-R1-9 — CHOIX D'IMPLÉMENTATION HÉRITÉS (rappel consolidé, sans impact sur les critères)**

Conservés du run initial (vérifiés à nouveau sans effet) : ddof=1 pour l'écart-type L1-a (les linéaires restent < 0,45 dans les deux conventions) ; temps des piégés CONSTANTS (5,0 s / 6,0 s) ; session = somme des 19 questions (speeders < 60 s dans les deux lectures) ; « borné » = clip ; arrondi entier = np.round ; scores et bornes CI arrondis à 2 décimales AVANT les tests L3 ; α calculé sur items CORRIGÉS ; pénalité anti-contradiction une fois au total. D4 (items inversés : génération sur l'échelle corrigée puis brut = 5 − corrigé) était déjà l'implémentation du run initial — le signal S1 est RÉSOLU par la confirmation de l'orchestrateur et l'exécution de sensibilité « littérale » n'est plus lancée.

---

## SECTION G — VERDICT FINAL

### Fiche de verdict (à contresigner par le superviseur)

| Critère | Seuil | Observé | Verdict |
|---|---|---|---|
| C1a — Couverture CI90 (latent ∈ CI90) | ∈ [87 % ; 95 %] | 89,9 % | **PASS** |
| C1b — Exactitude ponctuelle (sans règle conservatrice) | ≥ 78 % (plafond ≈ 80,5 %) | 79,7 % | **PASS** |
| C1c — Règle conservatrice (i)(ii)(iii) | (i) 100 % · (ii) 100 % · (iii) ≥ 85 % | (i) 100,0 % · (ii) 99,8 % (2 viol.) · (iii) 100,0 % | **FAIL** |
| C2 — Erreur moyenne \|score − latent\| | ∈ [0,14 ; 0,18] | 0,1567 | **PASS** |
| C3 — Piégés détectés (RQS ≠ OK) | ≥ 17/20 | 20/20 (7/7 linéaires · 6/6 speeders · 4/4 acquiesceurs · 3/3 vigilance) | **PASS** |
| C4 — Reproductibilité (×2, seed 42) | identique | OUI — SHA-256 identiques | **PASS** |

### **VERDICT PACKAGE : À CORRIGER** (5/6 critères PASS)

Motifs (déclarés tels quels, cf. Sections A/B/F) : C1c (ii) — 2 violation(s) en échec. Les arbitrages possibles sont listés en Section F (S-R1-1/S-R1-2/S-R1-6) — AUCUNE correction appliquée de mon propre initiative, conformément aux règles persistantes.

**Note de confiance : 6,5/10** — barème déclaré : 6/6 critères PASS + non-régression α préservée → 9/10 ; 5/6 → 6,5/10 ; 4/6 → 5/10 ; moins → 3/10. **Justification : 5/6 critères PASS ; l'échec du critère restant est analytique (détail en Sections A/B/F). Le pipeline implémente fidèlement la spécification révisée et la non-régression est préservée.**

**URL du dépôt GitHub : https://github.com/georgyfr/WAIRYU-Dating/tree/main/Wairyu%20th%C3%A9rapie%20couple/validation-q1-r1** (même dépôt, dossier `validation-q1-r1/` — le run initial reste consultable dans `validation-q1/`, commit 3eb7399).

---

*Fin du rapport — sections A à G exhaustives. Sorties brutes associées : `results/lectures_detaillees.csv` (1 000 lectures, champs R1), `results/reponses_honnetes_calculees.csv` (500), `results/reponses_pieges_calculees.csv` (20), `results/rqs_detail.csv` (520), `results/matrices_confusion.csv`, `results/stats_groupes.csv`, `results/violations_c1c.csv`, `results/criteres_r1.json`.*
# 03 — Critères psychométriques

> **STATUT : À VALIDER PAR LE CONSEIL CLINIQUE**
>
> Ce document détaille les critères psychométriques du pilote WTC-VALID-01.
> Les seuils sont posés a priori (D-STD) avant la collecte. Aucune
> modification post-hoc sans signalement public.

---

## 1. Cohérence interne

### 1.1 α de Cronbach

**Mesure** : cohérence interne des items d'une même échelle.

**Calcul** : α = (k / (k-1)) × (1 - Σσᵢ² / σₜ²)
- k = nombre d'items
- σᵢ² = variance de l'item i
- σₜ² = variance du score total

**Seuils (D-STD posés a priori — Arbitrage superviseur sortant)** :
- **α ≥ 0,80 : satisfaisant (H1 validée)** — seuil de validation
- α ≥ 0,85 : objectif signalé (documenté comme atteint ou non, sans effet sur le verdict)
- 0,70 ≤ α < 0,80 : acceptable mais amélioration possible
- α < 0,70 : insuffisant (échelle à réviser)

**Justification (superviseur sortant)** : la simulation a montré 0,91 sur données fictives ; le réel baisse toujours. 0,80 est le standard de validation ; 0,85 sera documenté comme « atteint ou non » sans faire basculer le verdict.

**Application par instrument** :
| RIO | Échelle | Items | α attendu |
|-----|---------|-------|-----------|
| RIO-01 | Axe A (anxiété) | 9 | ≥ 0,80 |
| RIO-01 | Axe B (évitement) | 9 | ≥ 0,80 |
| RIO-02 | I_alarm (intensité alarme) | 10 | ≥ 0,75 |
| RIO-03 | Banque forces (par force) | — | (par force, n=par force) |

> **Note de traçabilité (S4 — 21/10/2026)** : le seuil α ≥ 0,75 de RIO-02 (I_alarm, 10 items) est posé au présent document sans arbitrage antérieur tracé. Justification consignée : α croît avec la longueur de l'échelle (prédiction de Spearman-Brown) — viser ≥ 0,80 sur 10 items exigerait des inter-corrélations d'items très élevées ; 0,75 est le standard usuel pour les échelles courtes. Ce seuil est hors périmètre des 5 recommandations (qui portent RIO-01) — **à ratifier par le conseil clinique**.

### 1.2 ω de McDonald

**Mesure** : cohérence interne robuste aux items non-tau-équivalents.

**Calcul** : ω = (Σλᵢ)² / [(Σλᵢ)² + ΣVar(εᵢ)]
- λᵢ = saturation de l'item i sur le facteur général
- Var(εᵢ) = variance d'erreur de l'item i

**Seuil** : ω ≥ 0,80 (consistance avec α).

### 1.3 Analyse par sous-groupe (D-STD-2)

Pour chaque sous-groupe (genre, âge, configuration relationnelle) :
- Calculer α séparément
- Signaler tout écart > 0,05 entre sous-groupes
- Si écart > 0,10 : invariance de mesure à investigate (analyse factorielle multi-groupe)

## 2. Structure factorielle

### 2.1 Analyse Factorielle Exploratoire (AFE)

**Objectif** : vérifier que les 2 axes théoriques (A anxiété, B évitement) émergent des données réelles (H2).

**Méthode** :
- Extraction : axe principal (Principal Axis Factoring)
- Rotation : oblimin direct (axes corrélés autorisés)
- Retention : critère de Kaiser (eigenvalue > 1) + scree test de Cattell + parallel analysis (Hayton)
- Seuil de saturation : ≥ 0,40 sur l'axe principal, < 0,30 sur l'axe croisé

**Logiciel** : Python `factor_analyzer` ou R `psych::fa`

**Critère de succès** : 2 facteurs émergent, les items de l'axe A saturent sur le facteur 1, les items de l'axe B saturent sur le facteur 2.

### 2.2 Analyse Factorielle Confirmatoire (AFC)

**Objectif** : confirmer la structure 2 axes sur un échantillon indépendant (si n suffisant ≥ 200). **Régime si n < 200** (cas attendu — cible 150-200 analysables, Amendement A1) : l'AFE reste l'analyse principale de validation (§2.1) ; l'AFC est conduite sur 150-200 avec réserves explicites (RMSEA 0,08 — arbitrage ci-dessous) ou reportée à un échantillon étendu — convention à ratifier par le conseil clinique (S5 — 21/10/2026).

**Méthode** :
- Estimation : maximum de vraisemblance (ML)
- Indices d'ajustement :
  - χ²/ddl < 3 (acceptable) ou < 2 (bon)
  - CFI ≥ 0,95
  - TLI ≥ 0,95
  - **RMSEA < 0,08 (acceptable) — Arbitrage superviseur sortant**
  - SRMR < 0,08

**Justification (superviseur sortant)** : n = 150-200 est modeste pour une AFC ; RMSEA < 0,06 serait exigeant à cette taille. Le seuil de validation est fixé à **0,08**.

**Logiciel** : R `lavaan::cfa` ou Python `semopy`

**Critère de succès** : au moins 4 indices sur 5 dans les seuils acceptables.

### 2.3 Invariance de mesure (D-STD-2)

Si AFC réussie, test d'invariance par sous-groupe :
- Invariance configurale : même structure par sous-groupe
- Invariance métrique : saturations égales
- Invariance scalaire : intercepts égaux

**Critère** : ΔCFI < 0,01 entre niveaux d'invariance.

## 3. Stabilité test-retest

### 3.1 T0 → T2 (2 semaines)

**Objectif** : mesurer la stabilité de RIO-01 à court terme (H3).

**Mesures** :
- **ICC (Intraclass Correlation Coefficient)** — consistance absolue, modèle 2,1 (ICC(2,1))
  - ICC ≥ 0,80 : excellent
  - 0,70 ≤ ICC < 0,80 : bon
  - ICC < 0,70 : insuffisant
- **r de Pearson** entre T0 et T2
- **Bland-Altman** : limites d'agrément (biais ± 1,96 SD)

**Seuil de succès** : ICC ≥ 0,80 (H3 validée).

### 3.2 T0 → T8 (8 semaines)

**Objectif** : mesurer la stabilité à moyen terme (et détecter un éventuel changement d'état).

**Durée confirmée (Arbitrage superviseur sortant)** : **8 semaines** — aligné sur le RCI, le re-test programmé de l'app, et la littérature. 12 semaines introduirait l'effet des événements de vie parasites comme variable de confusion.

**Mesures** : idem T0→T2.

**Interprétation** :
- ICC ≥ 0,70 : trait stable (bon pour un trait d'attachement)
- ICC < 0,70 : soit instabilité, soit effet de l'application (à investiguer — était-ce l'objectif ?)

### 3.3 Sensibilité au changement

Si l'application WAIRYU produit un changement (Q5 "premier pas"), on s'attend à :
- RIO-01 stable (trait)
- RIO-02, RIO-03 éventuellement modifiés (état)

Calcul du **Standardized Response Mean (SRM)** : moyenne des changements / SD des changements.

## 4. Corrélation item-total

### 4.1 Item-total corrigé

**Calcul** : corrélation de Pearson entre l'item i et le score total SANS l'item i.

**Seuil (D-STD — Arbitrage superviseur sortant)** :
- **≥ 0,30 : acceptable (H4 validée)** — seuil de validation
- ≥ 0,50 : bon
- < 0,30 : item à investigater (révision ou suppression)

**Règle (superviseur sortant)** : un item retiré au pilote déclenche le **package R2 de révision**, jamais un retrait silencieux. La révision est documentée publiquement (Section F du rapport final).

### 4.2 Alpha si item supprimé

Pour chaque item : calculer α si l'item est supprimé.
- Si α augmente de > 0,02 : item à investigater
- Si α diminue : item contribue à la cohérence

## 5. Erreur standard de mesure (SEM)

**Calcul** : SEM = σ × √(1 - α)
- σ = écart-type du score
- α = coefficient de cohérence interne

**Objectif** : remplacer le SEM simulé (0,195) par le SEM mesuré.

**Interprétation** : le SEM donne l'intervalle de confiance du score individuel (score ± 1,96 × SEM).

## 6. Validité convergente

### 6.1 Instruments de référence (construits publics)

| Instrument | Référence | Items | Mesure |
|------------|-----------|-------|--------|
| **RQ** (Relationship Questionnaire) | Bartholomew & Horowitz (1991) | 4 paragraphes + 4 échelles | 4 styles d'attachement — instrument principal |
| **CSI** (Couples Satisfaction Index) | Funk & Rogge (2007) | 4 versions (32/16/8/4 items) | Satisfaction relationnelle — second instrument (usage exact à ratifier par le conseil clinique) |

> **Arbitrage B1 (fondateur, 21/10/2026 — trace 1a15d6b474a4969d)** : l'ECR-R (Fraley, Waller & Brennan, 2000 — 36 items), initialement listé ici, **n'est pas administré** dans VALID-01 — restriction d'usage commerciale explicite (FAQ de l'auteur, vérification datée consignée dans `legal/licences-validite-convergente.md`). Le CSI est distribué publiquement sans lettre par le co-auteur (couples-research.com) ; un usage commercial direct passerait par le canal des auteurs.

### 6.2 Hypothèses de corrélation

**H5** (formulation issue de l'arbitrage B1 — 21/10/2026) :
- r(RIO-01 axe A, RQ-anxiété) ≥ 0,40
- r(RIO-01 axe B, RQ-évitement) ≥ 0,40

> Les seuils ECR-R (r ≥ 0,50), initialement écrits, sont retirés avec l'instrument (arbitrage B1 — ECR-R non administré, restriction d'usage commerciale consignée dans `legal/`). Les seuils RQ ≥ 0,40, déjà présents à la contresignature niveau 1, deviennent les critères de succès H5.

### 6.3 Validité divergente

[À VALIDER] : faut-il ajouter un instrument de validité divergente (ex : DASS-21 pour détresse générale) ? Si oui, on s'attend à corrélation plus faible (r < 0,30).

### 6.4 Sous-groupe n=50

La validité convergente est mesurée sur un sous-groupe de 50 participants.

**Puissance statistique** : pour mesurer une corrélation r ≥ 0,50 avec puissance 0,80 et α 0,05 (bilatéral), n = 29 minimum. n=50 donne une marge confortable.

Après arbitrage B1 (seuil H5 porté sur le RQ à ≥ 0,40) : n = 47 minimum par la même méthode (Fisher) — n=50 couvre le seuil, avec une marge étroite ; le point est porté au conseil clinique (§17-7 du document principal).

## 7. Filets de sécurité — validation écologique

### 7.1 Déclenchement de H5

**Objectif (H6)** : vérifier que le filet H5 (comportement de sécurité) se déclenche sur ≥ 90 % des réponses **réelles** à risque signalées au pilote — la simulation (test d'incendie A4) tient lieu de répétition générale, pas de critère (S11 — 21/10/2026).

**Méthode** :
- Sur les réponses réelles au pilote, identifier les profils "à risque" (H5 activé)
- Vérifier que le filet s'est déclenché (log technique)
- Calculer le taux de déclenchement réel
- Si < 90 % : investigation (item H5 à réviser, ou algorithme de déclenchement)

### 7.2 Allusions violence / suicide

Idem pour les allusions (mentions de violence, suicide, automutilation).
- Taux de déclenchement attendu : 100 % (aucun faux négatif toléré)
- Faux positifs acceptés (signal de prudence)

### 7.3 Suivi des incidents

→ Voir `04-filets-securite-incident.md`

Chaque déclenchement de filet est consigné dans un journal d'incident (anonymisé). Le conseil clinique revient mensuellement sur les incidents.

## 8. Acceptabilité des messages (D-TEST)

### 8.1 Sous-groupe pilote n=10

**Objectif (H7)** : vérifier qu'aucun message de RIO-03, RIO-04, RIO-05 ne contredit la règle anti-culpabilisation.

**Méthode** :
- 10 participants en entretien qualitatif (30 min) à T8
- Présentation des messages reçus (RIO-03 SILENCIEUSE, RIO-04 config, RIO-05 catégorie)
- Questions semi-structurées :
  - "Comment avez-vous reçu ce message ?"
  - "Vous a-t-il paru accusateur ?"
  - "Avez-vous ressenti de la culpabilité ?"
  - "Qu'auriez-vous aimé lire à la place ?"

**Analyse** : analyse thématique (Braun & Clarke). Codage double (2 codeurs, calcul de kappa).

**Critère de succès** : ≥ 8/10 participants ne rapportent pas de culpabilité dans les messages.

### 8.2 Révision des gabarits

Si ≥ 3/10 rapportent de la culpabilité dans un message, le gabarit est révisé (package R2).

## 9. Recalibration des paramètres simulés

### 9.1 À la fin du pilote

Si H1-H7 validées, les paramètres suivants sont remplacés :

| Paramètre | Simulé (Q1-Q5) | Mesuré (pilote) |
|-----------|----------------|-----------------|
| α RIO-01 axe A | 0,9155 | α mesuré |
| α RIO-01 axe B | 0,9082 | α mesuré |
| SEM RIO-01 | 0,195 | SEM mesuré |
| Taux SILENCIEUSES RIO-03 | 16 % | taux mesuré |
| Bornes percentiles RIO-04 | 25/70/20/85 | bornes mesurées |
| Chevauchement RIO-04 | 77,62 % | mesuré |
| Taux tenue RIO-05 | simulés | mesurés |

### 9.2 Règle D-SIM inversée

Une fois les paramètres mesurés intégrés aux moteurs :
- Les écrans passent de "suggestion" à "normes mesurées"
- L'avertissement D-SIM est retiré des écrans utilisateur (mais reste dans la documentation scientifique)
- Les bornes D-STD sont recalculées sur les données réelles

## 10. Logiciels et reproductibilité

### 10.1 Stack technique

- **Python** : numpy, pandas, scipy, statsmodels, factor_analyzer, semopy
- **R** (alternative) : psych, lavaan, semTools
- **Git** : versionnage des scripts d'analyse
- **Notebooks Jupyter** : trace des analyses (reproductibilité)

### 10.2 Reproductibilité

- Tous les scripts d'analyse sont versionnés sur GitHub (dépôt privé pendant l'analyse, public à la publication)
- **Open data (Arbitrage superviseur sortant)** :
  - **Oui** pour les **agrégats** et les **instruments une fois validés** (publication des scores agrégés, des propriétés psychométriques, des normes mesurées)
  - **Non** pour les **réponses libres** (risque de ré-identification, cross-ref D-SIM et RGPD maximal — les réponses libres à Q2 et Q5 peuvent contenir des éléments identifiants)
- Le rapport final contient le code SHA-256 du bundle de données (D-CHECK)
- **Pré-enregistrement OSF.io** (Amendement A3) : hypothèses, critères, plan d'analyse publiés avant collecte.

## 11. Points [À VALIDER] par le conseil clinique — état après arbitrage superviseur sortant

Les points suivants ont été **tranchés par le superviseur sortant** (contresignature niveau 1) :

1. **Seuils α** : ✅ **0,80 pour valider**, 0,85 comme objectif signalé (sans effet sur le verdict)
2. **RMSEA** : ✅ **0,08 pour valider** (n = 150-200 modeste pour AFC)
3. **T8 à 8 semaines** : ✅ **Confirmé** (aligné sur RCI et littérature ; 12 semaines = variable de confusion)
4. **Item-total ≥ 0,30** : ✅ **Confirmé** — avec règle : retrait d'item → package R2, jamais silencieux
5. **Open data** : ✅ **Non pour réponses libres** (risque ré-identification) · **Oui pour agrégats et instruments validés**

Les points suivants restent **à valider par le conseil clinique** :

6. **Indices AFC** : CFI 0,95 (confirmé) ou 0,90 ?
7. **Test-retest 2 semaines** : durée optimale ? (1, 2, ou 4 semaines — recommandation 2 semaines)
8. **Sous-groupe validité convergente** : n=50 suffisant pour mesurer r ≥ 0,50 (puissance 0,80) ?
9. **Validité divergente** : faut-il ajouter un instrument (DASS-21) ?
10. **Invariance de mesure** : jusqu'à quel niveau (configurale, métrique, scalaire) ?
11. **D-TEST sous-groupe n=10** : suffisant pour validation qualitative ?
12. **Kappa inter-codage** : seuil ≥ 0,70 ou ≥ 0,80 ?

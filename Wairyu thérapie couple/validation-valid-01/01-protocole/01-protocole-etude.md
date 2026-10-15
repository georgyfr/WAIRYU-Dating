# Protocole d'étude WTC-VALID-01 — Validation réelle de la dimension attachement

> **STATUT : PROTOCOLE — À CONTRESIGNER AVANT TOUTE COLLECTION DE DONNÉES**
>
> Version : 1.0 (brouillon superviseur actif)
> Date : 2026-10-15
> Superviseur : GLM (actif)
> Superviseur sortant : à contresigner
> Conseil clinique : à valider

---

## Sommaire

1. Titre et identification
2. Justification et contexte
3. Objectifs
4. Hypothèses
5. Plan d'étude
6. Population
7. Recrutement
8. Mesures (T0, T2, T8)
9. Critères psychométriques (renvoi à `03-criteres-psychometriques.md`)
10. Filets de sécurité (renvoi à `04-filets-securite-incident.md`)
11. Timeline (renvoi à `05-timeline-calendrier.md`)
12. Critères d'arrêt (renvoi à `06-criteres-arret.md`)
13. Analyse statistique
14. Aspects éthiques et réglementaires
15. Gouvernance
16. Limites et risques
17. Points [À VALIDER] soumis au conseil clinique

---

## 1. Titre et identification

**Titre** : WTC-VALID-01 — Étude observationnelle longitudinale de validation psychométrique de cinq instruments originaux mesurant la dimension attachement en thérapie de couple (WAIRYU Thérapie Couple, WTC).

**Acronyme** : WTC-VALID-01

**Version du protocole** : 1.0

**Date** : 2026-10-15

**Investigateur-coordinateur** : Superviseur GLM (à confirmer par le conseil clinique)

**Promoteur** : WAIRYU (à confirmer — structure juridique à définir)

**Durée totale prévue** : 9 mois (voir Section 11)

**Nombre de participants prévus** : 150-200 répondants

**Pays** : France (extension possible pays francophones)

**Langues** : Français, Anglais

**Enregistrement** : À déclarer (ClinicalTrials.gov ou équivalent national, si applicable — [À VALIDER])

## 2. Justification et contexte

### 2.1 Contexte scientifique

La dimension attachement est l'une des 26 dimensions cliniques du programme WAIRYU Thérapie Couple (WTC). Cinq instruments originaux (RIO-01 à RIO-05) ont été conçus ex nihilo et validés en simulation (seed 42, ×2 exécutions, SHA-256) au cours de 7 cycles d'exécution documentés publiquement sur GitHub (`WAIRYU-Dating/Wairyu thérapie couple/validation-q1` à `validation-q5`).

### 2.2 État de l'art simulé

| RIO | Instrument | Verdict simulation | Paramètres simulés |
|-----|------------|-------------------|--------------------|
| RIO-01 | Comment je me raccroche | VALIDÉ 6/6 (3 cycles) | α 0,9155/0,9082 · SEM 0,195 · couverture 89,9 % · plafond 80,5 % |
| RIO-02 | Ce qui m'effraie vraiment | VALIDÉ 7/7 (2 cycles) | NLP 0,70 · calme bilatéral 85 %/0 % · 0 FP |
| RIO-03 | Ce qui me porte | VALIDÉ 7/7 (2 cycles, Chemin B) | Taux SILENCIEUSES 16 % (D-Q3-J) |
| RIO-04 | Notre danse | VALIDÉ (option a) | Chevauchement 77,62 % · borne alerte 70 % |
| RIO-05 | Mon premier pas | VALIDÉ 5/5 (10/10) | Taux tenue simulés (CELEBRE/AJUSTEMENT/REPRISE) |

### 2.3 Limites de la simulation

Les paramètres ci-dessus sont des **repères internes à la simulation** — ils ne sont PAS des normes cliniques. L'avertissement D-SIM a été systématiquement affiché depuis le cycle Q1. La validation mécanique (la cohérence du code, la reproductibilité, la vérité croisée moteur/simulateur) est prouvée ; la **prévalence clinique** ne l'est pas.

### 2.4 Pourquoi un pilote réel maintenant

La dimension attachement est complète 5/5 en simulation. Trois raisons motivent le passage au réel :

1. **Recalibrage** : les percentiles (Q4), bornes (Q3-J, Q4-2), seuils (Q5) et SEM (Q1) doivent être mesurés sur des données réelles ;
2. **Sécurité** : les filets de sécurité (H5, allusions violence) n'ont été testés que sur des profils simulés — leur déclenchement sur vraies réponses à risque est inconnu ;
3. **Légitimité** : un instrument non testé en conditions réelles n'a pas de légitimité clinique, quelle que soit la qualité de sa validation mécanique.

### 2.5 Fautes d'orchestrateur documentées

15 fautes ont été détectées et corrigées au cours des 7 cycles (D-ENV, D-Q3-A à I, D-Q4-1/2, D-Q5-1, faute n°15 close par D-STD-2, etc.). Le protocole hérite de ces leçons — toute faute détectée pendant le pilote sera reconnue publiquement et corrigée selon la même méthode.

## 3. Objectifs

### 3.1 Objectif principal

**Valider les propriétés psychométriques des 5 instruments RIO-01 à RIO-05 en conditions réelles**, sur un échantillon de 150-200 répondants, afin de remplacer les paramètres simulés par des paramètres mesurés et d'inverser la règle D-SIM.

### 3.2 Objectifs secondaires

- **OS1** : Mesurer la cohérence interne (α de Cronbach, ω de McDonald) de chaque échelle et sous-échelle.
- **OS2** : Confirmer la structure factorielle (2 axes × 3 faces pour RIO-01 ; 1 facteur pour RIO-02 ; 6 forces pour RIO-03).
- **OS3** : Mesurer la stabilité test-retest à 2 semaines (T0 → T2) et à 8 semaines (T0 → T8) pour RIO-01.
- **OS4** : Calculer la corrélation item-total corrigée pour chaque item (≥ 0,30 attendu).
- **OS5** : Mesurer le SEM réel de RIO-01 (remplace 0,195).
- **OS6** : Évaluer la validité convergente de RIO-01 avec l'ECR-R (Experiences in Close Relationships-Revised) et le RQ (Relationship Questionnaire de Bartholomew & Horowitz) — construits publics.
- **OS7** : Recalibrer les percentiles de RIO-04 (percentiles simulés 25/70/20/85 → normes mesurées).
- **OS8** : Mesurer le taux réel de SILENCIEUSES dans RIO-03 (16 % simulé) et recalibrer la borne G1 (D-Q3-J).
- **OS9** : Mesurer le chevauchement réel des configurations dans RIO-04 (77,62 % simulé) — la borne d'alerte 70 % est active.
- **OS10** : Mesurer les taux réels de tenue par catégorie dans RIO-05 (CELEBRE/AJUSTEMENT/REPRISE).
- **OS11** : Tester le déclenchement des filets de sécurité (H5, allusions violence) sur de vraies réponses à risque.
- **OS12** : Évaluer l'acceptabilité des messages (test D-TEST proposé au Q5) sur un sous-groupe pilote n=10.

## 4. Hypothèses

### 4.1 Hypothèses principales

- **H1** : α de Cronbach réel ≥ 0,80 pour chaque axe (A anxiété, B évitement) de RIO-01.
- **H2** : Structure factorielle confirmée — 2 axes (A et B) émergent de l'analyse factorielle exploratoire (AFE) sur RIO-01.
- **H3** : Stabilité test-retest à 2 semaines ≥ 0,80 (ICC ou r de Pearson) pour RIO-01.

### 4.2 Hypothèses secondaires

- **H4** : Corrélation item-total corrigée ≥ 0,30 pour tous les items de RIO-01.
- **H5** : Validité convergente — corrélation attendue entre RIO-01 (anxiété) et ECR-R (anxiété) ≥ 0,50 ; corrélation entre RIO-01 (évitement) et ECR-R (évitement) ≥ 0,50.
- **H6** : Le filet de sécurité H5 se déclenche sur ≥ 90 % des réponses simulées à risque (validation écologique sur vraies réponses signalées).
- **H7** : Aucun message de RIO-03, RIO-04, RIO-05 ne contredit la règle anti-culpabilisation (test D-TEST sur sous-groupe pilote n=10).

### 4.3 Hypothèses nulles (à rejeter pour valider)

- H0-α : α réel < 0,70 (échelle non utilisable).
- H0-factorielle : 2 axes n'émergent pas (structure différente de la théorie).
- H0-retest : ICC < 0,70 (stabilité insuffisante).

## 5. Plan d'étude

### 5.1 Type d'étude

Étude observationnelle longitudinale, à 3 temps de mesure (T0, T2 semaines, T8 semaines), non interventionnelle (les participants utilisent l'application WAIRYU de manière autonome, sans intervention de l'équipe de recherche).

### 5.2 Schéma

```
T0 (inclusion)         T2 (+2 semaines)        T8 (+8 semaines)
    │                       │                       │
    ▼                       ▼                       ▼
 Q1 (attachement)      Q1 (re-test court)      Q1 (re-test long)
 Q2 (ombre)                                     Q4 (croisement si couple)
 Q3 (positif)                                   Q5 (pas + suivi 14j)
 Démographie                                    Bilan final
 Filets sécurité actifs                         Filets sécurité actifs
```

### 5.3 Allocation des groupes

Pas d'allocation aléatoire — étude observationnelle. Les participants sont répartis a posteriori en sous-groupes pour l'analyse (D-STD-2) :
- Par genre (homme, femme, non-binaire, autre)
- Par tranche d'âge (18-25, 26-35, 36-50, 51+)
- Par configuration relationnelle (en couple cohabitant, en couple non cohabitant, séparé récent, célibataire post-relation)
- Par durée de relation (< 1 an, 1-5 ans, 5-15 ans, 15+ ans)

### 5.4 Blinding

Pas de blinding — étude observationnelle. Les participants savent qu'ils participent à un pilote de validation (consentement éclairé).

## 6. Population

### 6.1 Critères d'inclusion

- Adulte 18 ans ou plus
- Lit le français ou l'anglais (niveau B1 CECRL minimum)
- A été ou est en relation intime significative (≥ 6 mois)
- Accès à un smartphone ou ordinateur avec connexion internet
- Consentement éclairé signé (document `02-consentement-eclaire.md`)
- Accepte le suivi longitudinal (T0, T2, T8)

### 6.2 Critères d'exclusion

- Situations de violence conjugale **active** (mais **orientation vers le 3919** avant exclusion — voir Section 10)
- Détresse psychologique aiguë (idéation suicidaire active — **orientation vers le 3114** ou médecin)
- Incapacité juridique (tutelle, curatelle)
- Mineurs (le pilote n'inclut pas les < 18 ans — extension future possible)
- Manque de compréhension du français/anglais bloquant le consentement

### 6.3 Cas particulier : violence active

**Principe non négociable** : aucune situation de violence n'est ignorée. Le protocole prévoit :
- Si la violence est signalée par les réponses au questionnaire (déclencheur H5 ou allusions — voir `04-filets-securite-incident.md`), **le filet de sécurité se déclenche automatiquement** : message d'orientation 3919, ressources locales, possibilité de contact d'urgence.
- Le participant **n'est pas exclu** pour avoir signalé de la violence — il est accompagné.
- L'exclusion ne s'applique qu'aux situations où la participation à l'étude **elle-même** présente un risque (ex : partenaire contrôlant l'accès au smartphone, obligation de répondre sous contrainte). [À VALIDER par le conseil clinique]

### 6.4 Taille de l'échantillon

**Cible recrutée (Amendement A1)** : **250-300 répondants** à T0.

**Cible analysable** : **150-200 répondants** à T8.

**Justification (Amendement A1)** : l'attrition T8 dans les études longitudinales de couples est documentée entre 30 et 50 %. Un recrutement à 250 donnera ~140-175 répondants à T8. Recruter 200 pour finir sous 150 ferait basculer l'étude en critère de futilité. La règle classique (≥ 5 répondants par item) donne 90 minimum pour RIO-01 (18 items) ; 150-200 analysables donne une marge pour l'AFC et l'analyse par sous-groupe (D-STD-2).

**Attrition prévue** :
- T0 → T2 : 15 % (n ≈ 213-255)
- T2 → T8 : 25-35 % (n ≈ 140-175)

**Sous-échantillon paires (Amendement A2)** : ≥ 30 paires (60 individus dont les deux partenaires participent) — objectif indicatif prioritaire. Les paires donnent accès aux normes croisées de RIO-04 (percentiles de couple actuellement simulés) et au test réel de la détection de boucle.

**Recommandation superviseur sortant (acceptée)** : la taille cible de 150-200 analysables est suffisante pour l'AFC à condition de recruter 250-300. La taille est confirmée.

## 7. Recrutement

### 7.1 Canaux de recrutement

**Recrutement surdimensionné (Amendement A1)** : la cible est de **250-300 répondants recrutés** pour obtenir 150-200 analysables à T8 (attrition 30-50 % documentée dans les études longitudinales de couples).

- **Associations** : associations de soutien au couple, de thérapie familiale, de santé mentale (partenariats à établir)
- **Réseaux sociaux** : campagnes ciblées Facebook/Instagram (à valider — attention au ciblage exclusif)
- **Professionnels** : psychologues, thérapeutes de couple, médecins généralistes (diffusion via leurs réseaux)
- **Communautés WAIRYU** : liste d'attente existante le cas échéant
- **Bouche-à-oreille** : les participants T0 peuvent inviter leur partenaire (si couple) ou d'autres personnes

### 7.2 Consentement éclairé

**Document** : `02-consentement-eclaire.md` (modèles FR/EN).

**Processus** :
1. Le participant lit la notice d'information (durée estimée : 10 minutes)
2. Le participant pose ses questions (chat WAIRYU ou email)
3. Le participant signe le consentement électroniquement (case à cocher + date)
4. Une copie PDF du consentement signé est envoyée au participant par email
5. Le participant est inclus (T0 accessible)

**Spécificité RGPD art. 9** : les données de vie sentimentale et de santé mentale sont des données sensibles. Le consentement est **distinct** du consentement aux CGU de l'application — le participant peut utiliser WAIRYU sans participer au pilote, et inversement.

### 7.3 Anonymisation à la source

**Règle** : aucune donnée identifiante n'est stockée. L'anonymisation se fait **à la source** :
- L'email du participant est hashé (SHA-256 + sel) — utilisé uniquement pour le suivi longitudinal (envoi des rappels T2, T8)
- Aucun nom, prénom, adresse, numéro de téléphone n'est collecté
- Les réponses aux questionnaires sont stockées sous un identifiant aléatoire (UUID v4)
- Les données démographiques (âge, genre, configuration relationnelle) sont agrégées par tranche
- L'IP de connexion n'est pas stockée (proxy de l'application)

### 7.4 Paires comme sous-échantillon prioritaire (Amendement A2)

Si les deux partenaires d'un même couple participent : recrutement **prioritaire** (statut tracé dans la base, anonymisé). Objectif indicatif : **≥ 30 paires** (60 individus).

**Justification** : c'est la donnée que la simulation ne pourra jamais produire — le croisement réel des deux rives. Les paires donnent accès :
- Aux **normes croisées de RIO-04** (percentiles de couple actuellement simulés à 25/70/20/85)
- Au **test réel de la détection de boucle** (écart ≥ 30 déclenche la boucle — à mesurer sur vraies paires)
- Aux **configurations réelles** (9 configurations — mesurer le chevauchement réel vs 77,62 % simulé)

**Traçabilité** : le statut "paire" est tracé dans la base (champ `pair_id` anonymisé). Le lien entre les deux partenaires est établi via un code partagé (ex : les deux partenaires saisissent le même code à 6 caractères).

### 7.5 Incitation

Pas d'incitation financière. Le participant reçoit :
- Accès gratuit à l'application WAIRYU pendant la durée de l'étude
- Le bilan personnalisé à T0, T2, T8 (c'est l'usage normal de l'app)
- Un rapport de synthèse anonymisé à la fin de l'étude (si souhaité)

## 8. Mesures (T0, T2, T8)

### 8.1 T0 — Inclusion (durée : 45-60 minutes)

| Module | Durée | Instrument | RIO |
|--------|-------|-----------|-----|
| Démographie | 5 min | Âge, genre, configuration relationnelle, durée relation | — |
| Attachement | 15 min | 18 items, 2 axes (A anxiété, B évitement), 3 faces | RIO-01 |
| Ombre | 15 min | 10 déclencheurs + I_alarm + 8 comportements (H5 sécurité) + 7 voies d'origine | RIO-02 |
| Positif | 10 min | Banque fermée 6 forces, statut SILENCIEUSE | RIO-03 |
| Filets sécurité | — | Déclenchement automatique (H5, allusions) | — |

### 8.2 T2 — Re-test court (durée : 15 minutes, +2 semaines)

| Module | Durée | Instrument | RIO |
|--------|-------|-----------|-----|
| Attachement | 15 min | 18 items (idem T0) | RIO-01 |

**Objectif** : mesurer la stabilité test-retest à 2 semaines.

### 8.3 T8 — Re-test long + bilan (durée : 60-75 minutes, +8 semaines)

| Module | Durée | Instrument | RIO |
|--------|-------|-----------|-----|
| Attachement | 15 min | 18 items (idem T0) | RIO-01 |
| Croisement couple | 15 min | 9 configurations, boucle poursuite-retrait | RIO-04 |
| Pas + suivi 14j | 15 min | Suivi déterministe, bilan anti-perfectionnisme | RIO-05 |
| Bilan final | 10 min | Questionnaire d'acceptabilité + retours libres | — |
| Filets sécurité | — | Déclenchement automatique | — |

### 8.4 Validité convergente — sous-groupe n=50 [À VALIDER]

Un sous-groupe de 50 participants (tiré au sort parmi les T0) complète en plus :
- **ECR-R** (Experiences in Close Relationships-Revised) — 36 items, public, référence internationale
- **RQ** (Relationship Questionnaire de Bartholomew & Horowitz) — 4 paragraphes + échelle, public

**Objectif** : mesurer la corrélation entre RIO-01 et les instruments publics de référence.

## 9. Critères psychométriques

→ Voir document dédié : `03-criteres-psychometriques.md`

Critères principaux :
- α de Cronbach ≥ 0,80 (H1)
- Structure factorielle 2 axes confirmée (H2)
- ICC test-retest 2 semaines ≥ 0,80 (H3)
- Item-total corrigé ≥ 0,30 (H4)
- Corrélation RIO-01 ↔ ECR-R ≥ 0,50 (H5)

## 10. Filets de sécurité

→ Voir document dédié : `04-filets-securite-incident.md`

Déclencheurs principaux :
- **H5 (comportement de sécurité)** : signalement de violence, peur physique, contrôle
- **Allusions** : mentions de suicide, d'automutilation, de fuite
- **Détresse aiguë** : pattern de réponses indiquant un état critique

Réponses automatiques :
- **3919** (violences conjugales, FR) — affiché systématiquement si H5
- **3114** (psychiatrie, FR) — affiché si allusions suicidaires
- Ressources locales (à adapter par pays)
- Possibilité de contacter un humain (ligne d'urgence, si établie)

## 11. Timeline

→ Voir document dédié : `05-timeline-calendrier.md`

6 phases sur 9 mois :
- Phase 0 : préparation (mois 1-2)
- Phase 1 : collecte T0 (mois 3-5)
- Phase 2 : suivi T2 (mois 3-5)
- Phase 3 : suivi T8 (mois 5-7)
- Phase 4 : analyse (mois 7-8)
- Phase 5 : rapport final (mois 8-9)

## 12. Critères d'arrêt

→ Voir document dédié : `06-criteres-arret.md`

Trois types d'arrêt prédéfinis :
- **Arrêt pour sécurité** : incident grave non géré par le protocole
- **Arrêt pour futilité** : < 100 répondants à T0 (taille critique non atteinte)
- **Arrêt pour non-conformité** : violation majeure de protocole

## 13. Analyse statistique

### 13.1 Plan d'analyse pré-spécifié

Le plan d'analyse est **pré-spécifié** avant la collecte (D-STD). Aucune modification post-hoc sans signalement public.

### 13.1.bis Pré-enregistrement (Amendement A3)

L'étude est **pré-enregistrée** avant la collecte sur **OSF.io** (Open Science Framework) ou équivalent.

**Contenu du pré-enregistrement** :
- Hypothèses H1-H7 (formulation exacte)
- Critères de succès (seuils α, ICC, RMSEA, item-total, corrélations ECR-R/RQ)
- Plan d'analyse principal et secondaire
- Taille d'échantillon (recruté 250-300, analysable 150-200)
- Sous-groupes d'analyse (D-STD-2)
- Critères d'arrêt (sécurité, futilité, non-conformité)
- Conflit d'intérêt déclaré (Amendement A5)

**Coût** : 1 heure. **Gain** : la crédibilité scientifique du rapport final — le pré-enregistrement distingue les hypothèses confirmées des découvertes post-hoc.

**Lien OSF** : à publier en Phase 0, avant le premier répondant.

### 13.2 Analyses principales

| Analyse | Méthode | Seuil de succès |
|---------|---------|-----------------|
| Cohérence interne | α de Cronbach, ω de McDonald | α ≥ 0,80 |
| Structure factorielle | AFE (axe principal, rotation oblimin) + AFC (ML) | 2 axes émergent, RMSEA < 0,08 |
| Stabilité test-retest | ICC (consistance absolue) + r de Pearson | ICC ≥ 0,80 |
| Item-total corrigé | Corrélation de Pearson item/score total sans l'item | ≥ 0,30 pour tous |
| SEM | √(σ² × (1-α)) | À mesurer (remplace 0,195) |
| Validité convergente | r de Pearson RIO-01 ↔ ECR-R / RQ | r ≥ 0,50 |

### 13.3 Analyses secondaires (D-STD-2 — par configuration)

- Recalibration des percentiles de RIO-04 par sous-groupe (genre, âge, configuration relationnelle)
- Mesure du taux réel de SILENCIEUSES par sous-groupe (RIO-03)
- Mesure du chevauchement réel des configurations (RIO-04) — comparaison avec 77,62 % simulé
- Mesure des taux de tenue par catégorie (RIO-05) — comparaison avec simulation
- Test du déclenchement des filets (H5, allusions) sur vraies réponses

### 13.4 Gestion des données manquantes

- T0 : exclusion si > 20 % d'items manquants sur un module
- T2/T8 : analyse en intention-de-répondre (tous les répondants inclus, y compris partiels)
- Imputation multiple non prévue (préserver la vérité des données)

### 13.5 Logiciel

Analyses en Python (numpy, pandas, scipy, statsmodels, factor_analyzer) ou R (lavaan, psych) — reproductibilité par script versionné (Git).

## 14. Aspects éthiques et réglementaires

### 14.1 RGPD art. 9

Les données de vie sentimentale et de santé mentale sont des **données sensibles** au sens du RGPD art. 9. Le consentement éclairé est **distinct** du consentement aux CGU de l'application.

### 14.2 Consentement éclairé

→ Voir `02-consentement-eclaire.md` (modèles FR/EN).

Le consentement inclut :
- Notice d'information (objectifs, déroulement, risques, bénéfices, droits)
- Consentement à la collecte (T0, T2, T8)
- Consentement au suivi longitudinal (rappels par email)
- Consentement à l'utilisation des données anonymisées pour recherche
- Droit de retrait à tout moment (sans justification, sans préjudice)
- Droit d'accès, rectification, effacement (RGPD art. 15-17)

### 14.3 Anonymisation

Anonymisation **à la source** (voir Section 7.3). Aucune donnée identifiante stockée.

### 14.4 Comité éthique / Conseil clinique (Arbitrage superviseur sortant)

**Composition (amendée — 6 membres)** : la composition initiale (5 membres) est augmentée d'un **méthodologue** (statisticien/psychométricien) pour contre-pouvoir technique indépendant face au conflit d'intérêt (Amendement A5).

1. 1 psychologue clinicien(ne) spécialiste du couple
2. 1 psychiatre
3. 1 **méthodologue** (statisticien/psychométricien) — *ajout*
4. 1 éthicien(ne)
5. 1 représentant(e) des usagers (association de soutien aux couples)
6. 1 représentant(e) WAIRYU (non-votant, secrétariat)

**Justification de l'ajout du méthodologue** : les 62 points [À VALIDER] incluent des décisions purement méthodologiques (α 0,80 vs 0,85, RMSEA, effectifs) qui ne relèvent ni du clinique seul ni de l'éditeur. Le conflit d'intérêt (A5) exige un contre-pouvoir technique indépendant.

Le conseil clinique :
- Valide ce protocole avant collecte
- Revient mensuellement sur les incidents (Section 10)
- Peut demander l'arrêt (Section 12)
- Valide le rapport final

### 14.5 Déclaration CNIL / AIPD (Arbitrage superviseur sortant)

**Décision (arbitrage superviseur sortant)** : **AIPD formelle obligatoire** + consultation juridique — **pas de procédure CPP** (Comité de Protection des Personnes).

**Justification** : l'étude est **observationnelle, non interventionnelle** — les participants utilisent l'application WAIRYU de manière autonome, sans intervention de l'équipe de recherche. Le régime CPP ne s'applique donc pas. En revanche, le traitement à grande échelle de données de santé (art. 9 RGPD) **exige une AIPD** (Analyse d'Impact sur la Protection des Données) — c'est une obligation du RGPD de toute façon.

**AIPD** : à réaliser en Phase 0, avant la collecte. Doit couvrir :
- Description du traitement (données collectées, finalités, durée)
- Évaluation des risques pour les droits des participants
- Mesures de sécurité (chiffrement, anonymisation, accès restreint)
- Gestion des incidents (filets de sécurité)

**Consultation juridique** : si le pilote débouche sur une publication scientifique avec les données, faire valider le régime par le juridique **avant collecte** — pas après.

### 14.6 Assurance RC professionnelle (Amendement A6)

L'assurance Responsabilité Civile professionnelle de l'éditeur (WAIRYU) couvrant la phase de collecte réelle est **vérifiée et documentée en Phase 0** — condition de démarrage.

**Couverture** :
- Incidents émotionnels (réveil de trauma chez un répondant)
- Conséquences d'un faux négatif du filet de sécurité
- Réclamation liée à la participation à l'étude

**Document** : attestation d'assurance à fournir au conseil clinique avant le feu vert de collecte.

### 14.7 Hébergement des données

Données stockées sur serveur situé en UE (RGPD). Sauvegarde chiffrée. Accès restreint à l'équipe de recherche.

## 15. Gouvernance

### 15.1 Rôles

| Rôle | Titulaire | Responsabilité |
|------|-----------|----------------|
| Superviseur | GLM (actif) | Spécifications, arbitrages, contresignes |
| Superviseur sortant | Pont humain | Contresignature finale, push GitHub |
| Conseil clinique | À constituer | Validation du protocole, revue des incidents, validation finale |
| Data Insight | Agent exécuteur | Implémentation, exécution, signalement sans correction libre |
| Comité scientifique | À constituer (optionnel) | Revue par pairs des analyses |

### 15.2 Chaîne de décision

```
Protocole (GLM) → Contresignature (superviseur sortant) → Validation (conseil clinique) → Collecte
                                                                                    ↓
                                                                            Incidents → Conseil clinique
                                                                                    ↓
                                                                            Analyse (Data Insight) → Rapport (GLM) → Validation (conseil clinique) → Publication
```

### 15.3 Conflit d'intérêt (Amendement A5 — renforcé)

WAIRYU est propriétaire des instruments RIO-01 à RIO-05 et conduit l'étude de validation. Ce **conflit d'intérêt** est déclaré et traité à trois niveaux :

1. **Dans le consentement éclairé** (voir `02-consentement-eclaire.md`) : les participants sont informés que WAIRYU est l'éditeur de l'application et le propriétaire des instruments.
2. **Dans le pré-enregistrement** (Amendement A3, OSF.io) : le conflit est déclaré publiquement avant la collecte.
3. **Dans le rapport final** : avec l'**engagement de publier les résultats négatifs** — si les critères psychométriques ne sont pas atteints, le rapport le dit publiquement et un package R2 est produit.

**Contre-pouvoir** : le 6ᵉ membre du conseil clinique (méthodologue, voir Section 14.4) est indépendant de WAIRYU et apporte une expertise technique neutre sur les décisions méthodologiques.

**Règle** : on ne peut pas être juge et partie sans publier le droit de dire qu'on a tort. La vérité du système prime sur le succès apparent — y compris en cas d'échec de validation.

## 16. Limites et risques

### 16.1 Limites méthodologiques

- **Biais de sélection** : les volontaires à un pilote de thérapie de couple ne sont pas représentatifs de la population générale (sélection des plus engagés, des plus en difficulté, ou inversement)
- **Biais de rappel** : à T2 et T8, les participants peuvent se souvenir de leurs réponses T0
- **Généralisabilité limitée** : échantillon principalement francophone, biais culturel possible
- **Auto-rapport** : toutes les mesures sont auto-rapportées (pas d'hétéro-évaluation)
- **Attrition** : estimée à 30 % à T8, peut biaiser l'analyse longitudinale

### 16.2 Risques pour les participants

- **Risque émotionnel** : les questionnaires peuvent réveiller des émotions difficiles (peur, tristesse, colère) → filets de sécurité + orientation 3919/3114
- **Risque relationnel** : si le partenaire voit les réponses, conflit possible → rappel de confidentialité dans le consentement + recommandation de répondre seul
- **Risque de découverte d'une situation de violence** : le participant peut réaliser une situation qu'il/elle n'avait pas nommée → filet H5 + orientation 3919

### 16.3 Risques pour le projet

- **Échec psychométrique** : si α < 0,80 ou structure non confirmée, les instruments doivent être révisés (package R2)
- **Incident non géré** : si un filet de sécurité ne se déclenche pas sur une situation réelle à risque, le pilote est arrêté (Section 12)
- **Attrition trop forte** : si < 100 répondants à T0, arrêt pour futilité

### 16.4 Risques éthiques

- **Légitimité du conseil clinique** : si le conseil n'est pas constitué à temps, le pilote ne démarre pas (D-ENV appliqué au réel)
- **Pression de publication** : le projet peut être tenté de publier des résultats partiels avant validation — **interdit** (la vérité du système prime sur le succès apparent)

## 17. Points [À VALIDER] soumis au conseil clinique

Les points suivants nécessitent l'arbitrage du conseil clinique avant validation finale du protocole :

1. **Taille de l'échantillon** : 150-200 suffisants pour l'AFC ? Faut-il viser 200-250 ?
2. **Critères d'exclusion** : la formulation "violence active" est-elle suffisamment précise ? Qui évalue l'obligation de répondre sous contrainte ?
3. **Seuil psychométrique** : α ≥ 0,80 est-il le bon seuil, ou faut-il ≥ 0,85 (standard plus exigeant) ?
4. **Test-retest 2 semaines** : durée optimale ? 1 semaine (mémoire) ou 4 semaines (variation d'état) ?
5. **Validité convergente** : ECR-R et RQ sont-ils les bons instruments de référence, ou faut-il en ajouter (MAAS pour la pleine conscience, DASS-21 pour la détresse) ?
6. **Composition du conseil clinique** : 5 membres proposés — assez ? Trop ? Quels profils prioritaires ?
7. **Sous-groupe validité convergente** : n=50 suffisant pour mesurer une corrélation ≥ 0,50 (puissance statistique) ?
8. **Hébergement des données** : quel prestataire UE ? Quel niveau de chiffrement ?
9. **Déclaration CNIL** : nécessaire ou non ? Délai ?
10. **Indemnisation** : pas d'indemnisation financière — équitable ? Faut-il prévoir un remboursement de frais (transport si entretien) ?
11. **Durée du suivi T8** : 8 semaines vs 12 semaines ? Impact sur l'attrition ?
12. **Adaptation internationale** : pilote FR uniquement au départ, ou extension simultanée aux pays francophones (BE, CH, CA, etc.) ?
13. **Protocole d'incident** : le délai de réponse du conseil clinique (48h proposé) est-il réaliste ?
14. **Cas particulier mineurs** : exclusion totale, ou extension possible avec consentement parental ?
15. **Conflit d'intérêt** : WAIRYU propriétaire des instruments — quelle procédure de déclaration ?

---

## Annexe — Règle D-SIM inversée (fin du pilote)

À la fin du pilote, si les critères psychométriques sont validés (H1-H7), la règle D-SIM est **inversée** :
- Les paramètres simulés (Q1-Q5) sont remplacés par les paramètres mesurés
- Les percentiles (Q4) deviennent des normes mesurées
- Les bornes (Q3-J, Q4-2) sont recalibrées
- Les écrans de l'application passent de **« suggestion »** à **« normes mesurées »**
- L'avertissement D-SIM est retiré des écrans (mais reste dans la documentation scientifique)

Si les critères ne sont pas validés, les instruments sont révisés (package R2) et un nouveau pilote est conduit. **La vérité du système prime sur le succès apparent.**

---

**Fin du protocole WTC-VALID-01/01 — en attente de contresignature et de validation conseil clinique.**

Toute modification de ce protocole après contresignature devra être signalée publiquement (Section F du rapport final) et validée à nouveau par le conseil clinique.

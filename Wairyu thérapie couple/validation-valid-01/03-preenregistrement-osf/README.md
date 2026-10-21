# 03 — Package de pré-enregistrement OSF.io (Amendement A3)

> **STATUT : PACKAGE PRÊT À DÉPOSER — DÉPÔT EFFECTIF = ACTE DU FONDATEUR (compte OSF.io à créer)**
>
> Ce document contient **tout le contenu** à déposer sur la plateforme **OSF.io** (Open Science Framework — plateforme publique internationale où un chercheur scelle son plan d'étude avant de collecter la moindre donnée). Le dépôt réel se fait en Phase 0, **avant le premier répondant** (une heure de manipulation — voir checklist finale).
>
> **Moment exact du dépôt** : après validation du protocole par le conseil clinique, avant le lancement du recrutement (timeline `01-protocole/05-timeline-calendrier.md` — Phase 0, tâche « Pré-enregistrement OSF.io », durée estimée : 1 heure).
>
> **Ce qui est scellé ici** : hypothèses H1-H7 (formulation exacte, version 1.1 du protocole — arbitrage B1 intégré), critères de succès, plan d'analyse principal et secondaire, taille d'échantillon, sous-groupes, critères d'arrêt (arbitrage B2 intégré), conflit d'intérêt (Amendement A5). Ce contenu est conforme à la Section 13.1.bis du document principal.

---

## 1. Ce qu'est ce document — en langage clair

Un **pré-enregistrement** est une déclaration publique faite **avant** l'étude : on y écrit noir sur blanc ce qu'on cherche, comment on va le mesurer, et quels résultats compteront comme un succès ou un échec. La plateforme OSF.io horodate le document et lui attribue un identifiant permanent (un « DOI »). Ainsi, personne — ni le promoteur, ni un lecteur sceptique — ne peut soupçonner que les critères ont été changés après coup pour embellir les résultats.

Pourquoi c'est important pour WTC-VALID-01 : WAIRYU est à la fois l'éditeur de l'application et le propriétaire des instruments testés. Le pré-enregistrement est la manière la plus forte de montrer que l'étude ne cherche pas à se faire plaisir : si les instruments sont mauvais, les critères scellés ici le diront publiquement (engagement de publier les résultats négatifs — Amendement A5). C'est la confiance que WAIRYU offre aux participants, au conseil clinique et à la communauté scientifique.

Le contenu ci-dessous est **copiable tel quel** dans le formulaire OSF.io (rubriques nommées comme dans le formulaire standard d'enregistrement d'une étude quantitative).

---

## 2. Fiche d'identité de l'étude

| Rubrique OSF | Contenu |
|---|---|
| **Titre** | WTC-VALID-01 — Étude observationnelle longitudinale de validation psychométrique de cinq instruments originaux mesurant la dimension attachement en thérapie de couple (WAIRYU Thérapie Couple, WTC) |
| **Acronyme** | WTC-VALID-01 |
| **Version du protocole scellé** | 1.1 (révision du 21/10/2026 — arbitrages B1/B2 intégrés, consistances S1-S14 corrigées ; contresigné niveau 1 + niveau 2 le 21/10/2026) |
| **Promoteur** | WAIRYU (structure juridique à confirmer — §17-2 du document principal) |
| **Investigateur-coordinateur** | Superviseur GLM (à confirmer par le conseil clinique — §17-1) |
| **Type d'étude** | Observationnelle, longitudinale, monocentrique (pas d'intervention thérapeutique expérimentale) |
| **Durée totale prévue** | 9 mois canoniques (tableau récapitulatif ~10 mois calendaires — convention notée S8 ; Phase 4 étalée sur 2 mois, dates font foi) |
| **Participants prévus** | Recrutés 250-300 — analysables 150-200 (Amendement A1) |
| **Pays** | France (extension possible pays francophones) |
| **Langues** | Français, Anglais |
| **Documents sources** | Protocole v1.1 (`01-protocole/01-protocole-etude.md`), critères psychométriques (`03-criteres-psychometriques.md`), critères d'arrêt (`06-criteres-arret.md`) |

---

## 3. Résumé de l'étude

La simulation (seed 42) a permis de construire et de régler la mécanique de cinq instruments originaux — RIO-01 à RIO-05 — mais elle ne peut pas produire de prévalence clinique réelle. L'avertissement affiché aux utilisateurs pendant tout le pilote est honnête : la mécanique est validée, pas les normes. Ce pilote a pour objet de **mesurer les paramètres réels** (fiabilité, stabilité, structure factorielle, validité convergente, comportement des filets de sécurité) afin de pouvoir, à terme, inverser la règle D-SIM : les écrans passeront de « suggestion » à « normes mesurées ».

L'étude suit 250-300 personnes recrutées (objectif 150-200 analysables à 8 semaines) sur trois temps de mesure : T0 (inclusion, 45-60 minutes), T2 (re-test court à 2 semaines, 15 minutes), T8 (re-test long et bilan à 8 semaines, 60-75 minutes). Un sous-groupe tiré au sort de 50 participants complète deux instruments publics de référence (RQ, CSI) pour mesurer la validité convergente. Un sous-échantillon prioritaire d'au moins 30 paires (les deux partenaires) donne accès aux normes croisées réelles de RIO-04 — la donnée que la simulation ne pourra jamais produire.

---

## 4. Déclaration de conflit d'intérêt (Amendement A5 — renforcé)

WAIRYU est propriétaire des instruments RIO-01 à RIO-05 et conduit l'étude de validation. Ce conflit d'intérêt est déclaré et traité à **trois niveaux** :

1. **Dans le consentement éclairé** : les participants sont informés que WAIRYU est l'éditeur de l'application et le propriétaire des instruments (consentement distinct des CGU — RGPD art. 9).
2. **Dans le présent pré-enregistrement** : le conflit est déclaré publiquement avant la collecte.
3. **Dans le rapport final** : avec l'**engagement de publier les résultats négatifs** — si les critères psychométriques ne sont pas atteints, le rapport le dit publiquement et un package R2 (correction) est produit.

**Contre-pouvoir** : le 6ᵉ membre du conseil clinique (méthodologue, indépendant de WAIRYU) apporte une expertise technique neutre sur les décisions méthodologiques. **Règle** : on ne peut pas être juge et partie sans publier le droit de dire qu'on a tort — la vérité du système prime sur le succès apparent, y compris en cas d'échec de validation.

---

## 5. Hypothèses (formulation exacte — version 1.1)

### 5.1 Hypothèses principales

- **H1** : α de Cronbach réel ≥ 0,80 pour chaque axe (A anxiété, B évitement) de RIO-01.
- **H2** : Structure factorielle confirmée — 2 axes (A et B) émergent de l'analyse factorielle exploratoire (AFE) sur RIO-01.
- **H3** : Stabilité test-retest à 2 semaines ≥ 0,80 (ICC ou r de Pearson) pour RIO-01.

### 5.2 Hypothèses secondaires

- **H4** : Corrélation item-total corrigée ≥ 0,30 pour tous les items de RIO-01.
- **H5** : Validité convergente — corrélation attendue entre RIO-01 (anxiété) et RQ (anxiété) ≥ 0,40 ; corrélation entre RIO-01 (évitement) et RQ (évitement) ≥ 0,40. *(Formulation issue de l'arbitrage B1 du 21/10/2026 — l'ECR-R initialement prévu, avec ses seuils ≥ 0,50, n'est pas administré : restriction d'usage commerciale consignée dans `legal/licences-validite-convergente.md` ; les seuils RQ ≥ 0,40 étaient déjà écrits au document 03 §6.2.)*
- **H6** : Le filet de sécurité H5 se déclenche sur ≥ 90 % des réponses **réelles** à risque signalées au pilote (critère de validation écologique portant sur les vraies réponses signalées — la simulation tient lieu de répétition générale, cf. test d'incendie A4 ; S11 — 21/10/2026).
- **H7** : Aucun message de RIO-03, RIO-04, RIO-05 ne contredit la règle anti-culpabilisation (test D-TEST sur sous-groupe pilote n=10).

### 5.3 Hypothèses nulles (à rejeter pour valider)

- H0-α : α réel < 0,70 (échelle non utilisable).
- H0-factorielle : 2 axes n'émergent pas (structure différente de la théorie).
- H0-retest : ICC < 0,70 (stabilité insuffisante).

---

## 6. Variables mesurées

### 6.1 Instruments du pilote (T0, T2, T8)

| Temps | Module | Contenu | Instrument |
|---|---|---|---|
| **T0** (45-60 min) | Démographie | Âge (tranches), genre, configuration relationnelle, durée de relation | — |
| **T0** | Attachement | 18 items, 2 axes (A anxiété, B évitement), 3 faces | RIO-01 |
| **T0** | Ombre | 10 déclencheurs + I_alarm + 8 comportements (filet H5) + 7 voies d'origine | RIO-02 |
| **T0** | Positif | Banque fermée 6 forces, statut SILENCIEUSE | RIO-03 |
| **T2** (+2 sem, 15 min) | Attachement | 18 items (identiques T0) — mesure de la stabilité test-retest | RIO-01 |
| **T8** (+8 sem, 60-75 min) | Attachement | 18 items (identiques T0) | RIO-01 |
| **T8** | Croisement couple | 9 configurations, boucle poursuite-retrait | RIO-04 |
| **T8** | Pas + suivi 14 j | Suivi déterministe, bilan anti-perfectionnisme | RIO-05 |
| **T8** | Bilan final | Questionnaire d'acceptabilité + retours libres | — |

Les filets de sécurité (H5, allusions, détresse aiguë) s'appliquent à chaque temps de mesure (voir §12).

### 6.2 Instruments publics de référence (validité convergente — sous-groupe n=50)

| Instrument | Référence | Contenu | Rôle |
|---|---|---|---|
| **RQ** (Relationship Questionnaire) | Bartholomew & Horowitz (1991) | 4 paragraphes + 4 échelles | **Instrument principal** de validité convergente |
| **CSI** (Couples Satisfaction Index) | Funk & Rogge (2007) | 4 versions (32/16/8/4 items) | Second instrument (usage exact à ratifier par le conseil clinique) — distribué sans lettre par le co-auteur (couples-research.com) |

> **Arbitrage B1 (fondateur, 21/10/2026 — trace 1a15d6b474a4969d)** : l'ECR-R (Fraley, Waller & Brennan, 2000 — 36 items), initialement prévu, **n'est pas administré** — restriction d'usage commerciale explicite (FAQ de l'auteur, vérification datée consignée dans `legal/`). Cet arbitrage est intégré à la formulation scellée de H5.

**Puissance statistique du sous-groupe** : pour mesurer une corrélation r ≥ 0,50 avec puissance 0,80 et α 0,05 (bilatéral), n = 29 minimum ; après arbitrage B1 (seuil H5 porté sur le RQ à ≥ 0,40), n = 47 minimum (méthode de Fisher) — n=50 couvre le seuil avec une marge étroite, le point est porté au conseil clinique (§17-7).

---

## 7. Population et échantillon

### 7.1 Critères d'inclusion et d'exclusion

Les critères détaillés sont fixés au document principal (§6.1-§6.3). Rappel des points structurants : participation volontaire avec consentement électronique distinct des CGU ; aucune collecte sans consentement signé ; **en cas de violence active signalée (§6.3)**, le filet de sécurité prime et l'orientation vers les ressources d'urgence (3919/3114) est systématique — la participation à l'étude n'est pas la priorité dans ce cas.

### 7.2 Taille d'échantillon (Amendement A1)

| Paramètre | Valeur scellée |
|---|---|
| Cible recrutée à T0 | **250-300 répondants** |
| Cible analysable à T8 | **150-200 répondants** |
| Attrition prévue T0 → T2 | 15 % (n ≈ 213-255) |
| Attrition prévue T2 → T8 | 25-35 % (n ≈ 140-175) |
| Règle minimum par item | ≥ 5 répondants par item → 90 minimum pour RIO-01 (18 items) |
| Marge pour AFC et sous-groupes | 150-200 analysables |

**Justification** : l'attrition T8 dans les études longitudinales de couples est documentée entre 30 et 50 %. Un recrutement à 250 donnera ~140-175 répondants à T8. Recruter 200 pour finir sous 150 ferait basculer l'étude en critère de futilité.

### 7.3 Sous-échantillon paires (Amendement A2)

Objectif indicatif prioritaire : **≥ 30 paires** (60 individus dont les deux partenaires participent). Les paires donnent accès aux normes croisées réelles de RIO-04 (percentiles de couple actuellement simulés à 25/70/20/85), au test réel de la détection de boucle (écart ≥ 30 déclenche la boucle — à mesurer sur vraies paires) et aux configurations réelles (9 configurations — mesurer le chevauchement réel vs 77,62 % simulé). Le lien entre partenaires est établi via un code partagé anonymisé à 6 caractères (champ `pair_id`).

### 7.4 Anonymisation à la source

Aucune donnée identifiante n'est stockée : email hashé (SHA-256 + sel, uniquement pour les rappels T2/T8), aucun nom ni adresse ni téléphone, réponses stockées sous UUID v4, données démographiques agrégées par tranche, IP non stockée.

---

## 8. Plan d'analyse principal (pré-spécifié — D-STD)

| Analyse | Méthode | Seuil de succès |
|---------|---------|-----------------|
| Cohérence interne | α de Cronbach, ω de McDonald | α ≥ 0,80 |
| Structure factorielle | AFE (axe principal, rotation oblimin) + AFC (ML) | 2 axes émergent, RMSEA < 0,08 |
| Stabilité test-retest | ICC (consistance absolue) + r de Pearson | ICC ≥ 0,80 |
| Item-total corrigé | Corrélation de Pearson item/score total sans l'item | ≥ 0,30 pour tous |
| SEM | √(σ² × (1-α)) | À mesurer (remplace 0,195) |
| Validité convergente | r de Pearson RIO-01 ↔ RQ (CSI en option) | r ≥ 0,40 (arbitrage B1) |

*En langage clair* : la cohérence interne vérifie que les items d'un même axe racontent bien la même chose (α et ω, de 0 à 1 — plus proche de 1, plus l'échelle est fiable) ; la structure factorielle vérifie que les données réelles font bien émerger les 2 axes théoriques (anxiété, évitement) ; la stabilité test-retest vérifie que la mesure donne le même résultat 2 semaines plus tard pour une personne stable ; l'item-total vérifie que chaque item tire dans le sens de son échelle ; le SEM donne l'intervalle de confiance du score individuel ; la validité convergente vérifie que RIO-01 mesure la même chose que l'instrument public de référence (RQ).

---

## 9. Analyses secondaires (D-STD-2 — par configuration)

- Recalibration des percentiles de RIO-04 par sous-groupe (genre, âge, configuration relationnelle)
- Mesure du taux réel de SILENCIEUSES par sous-groupe (RIO-03)
- Mesure du chevauchement réel des configurations (RIO-04) — comparaison avec 77,62 % simulé
- Mesure des taux de tenue par catégorie (RIO-05) — comparaison avec simulation
- Test du déclenchement des filets (H5, allusions) sur vraies réponses

## 10. Données manquantes et logiciel

**Données manquantes** : T0 — exclusion si > 20 % d'items manquants sur un module ; T2/T8 — analyse en intention-de-répondre (tous les répondants inclus, y compris partiels) ; imputation multiple non prévue (préserver la vérité des données).

**Logiciel** : analyses en Python (numpy, pandas, scipy, statsmodels, factor_analyzer) ou R (lavaan, psych) — reproductibilité par script versionné (Git).

**Règle anti post-hoc (D-STD)** : le plan d'analyse est pré-spécifié avant la collecte. **Toute analyse non pré-enregistrée ici sera déclarée exploratoire** dans le rapport final, sans jamais être présentée comme confirmatoire. Aucune modification post-hoc sans signalement public.

---

## 11. Critères d'arrêt prédéfinis (arbitrage B2 intégré)

Trois types d'arrêt sont pré-spécifiés (détail complet : `01-protocole/06-criteres-arret.md`). Tout arrêt déclenche une procédure de clôture (notification, sécurisation des données, rapport d'arrêt public anonymisé).

### Type 1 — Arrêt pour sécurité

| Critère déclencheur | Délai | Décision |
|---|---|---|
| Incident grave Type E (menace de suicide active, violence en cours) | Immédiat (< 24 h) | Conseil clinique |
| **≥ 3 incidents Type C (faux négatifs)** sur l'ensemble du pilote — arbitrage B2 (21/10/2026) ; le 3ᵉ déclenche l'arrêt | < 48 h | Conseil clinique |
| Bug technique exposant des données identifiantes | Immédiat (notification < 2 h) | Superviseur + conseil |
| Ligne d'urgence indisponible > 7 jours consécutifs | < 24 h | Superviseur |
| Décès d'un participant (même non lié à l'étude) | Immédiat | Superviseur + conseil |

### Type 2 — Arrêt pour futilité

| Critère déclencheur | Délai | Décision |
|---|---|---|
| < 100 répondants à T0 après 3 mois de recrutement (fenêtre Phase 1 — S12) | < 1 semaine | Conseil clinique |
| Attrition T8 > 60 % (estimation à mi-parcours) | < 1 semaine | Conseil clinique |
| Taux de réponse T2 < 40 % | < 1 semaine | Conseil clinique |
| Données inanalysables (> 30 % de données manquantes par module) | < 1 semaine | Conseil + superviseur |

### Type 3 — Arrêt pour non-conformité

| Critère déclencheur | Délai | Décision |
|---|---|---|
| Violation majeure du protocole (ex : données collectées sans consentement) | Immédiat | Superviseur + conseil |
| Modification des instruments sans validation (D-TABLE) | < 48 h | Conseil clinique |
| Perte de données > 20 % (bug technique non récupérable) | < 1 semaine | Superviseur + conseil |
| Conflit d'intérêt non déclaré découvert | < 1 semaine | Conseil clinique |

---

## 12. Sécurité des répondants (filets — synthèse)

Les filets de sécurité (détail : `01-protocole/04-filets-securite-incident.md`) opèrent à chaque temps de mesure. Déclencheurs principaux : **H5** (comportement de sécurité — signalement de violence, peur physique, contrôle), **allusions** (mentions de suicide, d'automutilation, de fuite), **détresse aiguë** (pattern de réponses indiquant un état critique). Réponses automatiques : affichage systématique du **3919** (violences conjugales, FR) si H5, du **3114** (psychiatrie, FR) si allusions suicidaires, ressources locales adaptées par pays, possibilité de contacter un humain. Le **test d'incendie des filets (Amendement A4 — 5 scénarios documentés) est exécuté AVANT T0** : aucun premier répondant tant que les filets n'ont pas survécu à l'incendie. La ligne d'urgence est en Option B au lancement (orientation 3919/3114), migration A+B si Type C/D > 5 % à mi-collecte.

---

## 13. Points restant à ratifier par le conseil clinique avant le dépôt

Honnêteté totale : ces points figurent comme [À VALIDER] dans le protocole v1.1 et **ne font pas partie du scellé** tant qu'ils ne sont pas tranchés. Si un point est tranché différemment de ce qui est écrit ici, **le package est mis à jour AVANT le dépôt OSF** (le dépôt doit refléter les décisions finales) :

1. **Usage exact du CSI** (second instrument / covariable) — §8.4 du document principal ;
2. **Ajout éventuel d'un instrument de validité divergente** (ex : DASS-21, corrélation attendue plus faible r < 0,30) — §6.3 du document critères ;
3. **Identité de l'investigateur-coordinateur** (Superviseur GLM à confirmer — §17-1) ;
4. **Structure juridique du promoteur** (WAIRYU — §17-2) ;
5. **Marge de puissance du sous-groupe n=50** sur le seuil RQ ≥ 0,40 (n=47 requis, marge étroite — §17-7).

Le moment du dépôt reste invariable : **après validation conseil clinique, avant le premier répondant**.

---

## 14. Checklist de dépôt OSF.io (acte du fondateur — ~1 heure)

1. Créer un compte sur `osf.io` (au nom du promoteur ou du fondateur) ;
2. Créer un nouveau projet intitulé « WTC-VALID-01 — Étude observationnelle longitudinale de validation psychométrique de cinq instruments originaux mesurant la dimension attachement en thérapie de couple » ;
3. Téléverser : ce package (pré-enregistrement), le protocole v1.1 complet (`01-protocole/` — 7 documents), le dossier conseil (`02-dossier-conseil-clinique/`), les justificatifs de licences (`legal/`) ;
4. Copier-coller les sections 2 à 13 de ce document dans le wiki du projet (rubrique « Preregistration ») ;
5. Vérifier les 5 points de ratification (§13) : ils doivent être tranchés ou explicitement marqués en cours ;
6. Rendre le projet public (bouton « Make Public ») — l'horodatage et le DOI sont générés ;
7. **Noter le DOI dans le dépôt** : hub VALID-01 (tableau des verrous) + document principal §13.1.bis (« Lien OSF ») — le DOI relie les données collectées à leur promesse publique ;
8. Annoncer le DOI au conseil clinique lors de sa première revue.

**Aucune donnée ne sera collectée avant que ce DOI ne soit publié et noté dans le dépôt.**

---

## 15. Traçabilité

| Champ | Valeur |
|---|---|
| Produit le | 21/10/2026 |
| Sources | Protocole v1.1 (§4, §6.4, §7, §8, §9, §12, §13.1-13.5, §14.4-14.6, §15.3, §17) ; doc 03 (§6) ; doc 04 (filets) ; doc 05 (Phase 0) ; doc 06 (Types 1-2-3) ; arbitrage B1 (option b) et B2 (≥ 3) — trace fondateur 1a15d6b474a4969d ; rapport 07 (relecture niveau 2, sections H) |
| Verbatim | Les formulations des hypothèses, seuils, tailles et critères sont **recopiées sans modification** des documents sources v1.1 (aucun chiffre inventé, aucune reformulation de seuil) |
| Amendement porteur | A3 (pré-enregistrement OSF.io avant collecte) — intégré au protocole §13.1.bis |
| Prochaine étape après dépôt | Test d'incendie des filets (A4) + tests D-ENV, puis feu vert Phase 1 (conseil clinique) |


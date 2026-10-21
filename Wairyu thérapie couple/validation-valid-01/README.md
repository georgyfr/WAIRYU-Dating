# WTC-VALID-01/01 — Protocole d'étude du pilote réel

> **STATUT : CONTRESIGNÉ NIVEAU 1 (ARCHITECTURE) + NIVEAU 2 (FOND INTÉGRAL, 21/10/2026) + 6 AMENDEMENTS INTÉGRÉS**
>
> **Contresignature niveau 2 (fond intégral)** : POSÉE le 21/10/2026 — relecture du fond intégral exécutée (rapport `01-protocole/07-rapport-relecture-niveau2.md`, sections A-G), arbitrages fondateur rendus (trace 1a15d6b474a4969d) : **B1 → option (b)** (validité convergente basculée sur le RQ + CSI, ECR-R non administré) et **B2 → seuil unique ≥ 3** (faux négatifs) ; 14 consistances S1-S14 corrigées — exécution consignée en section H du rapport 07.
>
> Ce package est un document de conception, pas un package de validation
> mécanique. Il doit être :
> 1. ✅ **contresigné** par le superviseur sortant (niveau 1 fait ; niveau 2 — fond intégral — fait le 21/10/2026 : arbitrages B1 (b) / B2 (≥ 3) rendus, S1-S14 corrigées) ;
> 2. ⏳ **validé** par le conseil clinique (6 membres dont méthodologue — à constituer) ;
> 3. ⏳ **AIPD formelle** (Arbitrage superviseur sortant — pas de CPP) + consultation juridique ;
> 4. ⏳ **tests d'infrastructure** (D-ENV) + **test d'incendie des filets** (Amendement A4) + **pré-enregistrement OSF.io** (Amendement A3) + **assurance RC** (Amendement A6) ;
> 5. puis **recrutement** des premiers répondants.
>
> Aucune donnée ne sera collectée avant ces étapes.

## Avertissement D-SIM (à inverser à la fin du pilote)

> AVERTISSEMENT D-SIM : les instruments RIO-01 à RIO-05 ont été validés
> en simulation (seed 42). La mécanique est validée, pas la prévalence
> clinique. Ce protocole a pour objet de **mesurer les paramètres réels**
> et, à la fin du pilote, d'**inverser la règle D-SIM** : les écrans
> passeront de « suggestion » à « normes mesurées ».

## Verdict : **CONTRESIGNÉ NIVEAU 1 + NIVEAU 2 — AMENDEMENTS INTÉGRÉS**

| Étape | Statut |
|------|--------|
| Production du protocole | ✅ Terminé (package révisé v1.1) |
| Contresignature superviseur sortant (niveau 1) | ✅ **Fait** (6 amendements + 3 arbitrages + 5 recommandations) |
| Intégration des amendements | ✅ **Fait** (ce package révisé) |
| Contresignature superviseur sortant (niveau 2 — fond intégral) | ✅ **Fait** (21/10/2026 — rapport 07, arbitrages B1 (b) / B2 (≥ 3) rendus, S1-S14 corrigées) |
| Validation conseil clinique (6 membres) | ⏳ En attente constitution |
| AIPD formelle + consultation juridique | ⏳ En attente |
| Pré-enregistrement OSF.io (Amendement A3) | ⏳ En attente |
| Test d'incendie des filets (Amendement A4) | ⏳ En attente |
| Assurance RC professionnelle (Amendement A6) | ⏳ En attente vérification |
| Recrutement des premiers répondants | ⏳ Bloqué jusqu'aux étapes ci-dessus |

## Les 6 amendements du superviseur sortant (tous intégrés)

| # | Amendement | Intégration |
|---|-----------|-------------|
| **A1** | Recrutement surdimensionné : **250-300 recrutés** pour 150-200 analysables (attrition 30-50 % documentée) | ✅ Section 6.4 + 7.1 du protocole |
| **A2** | Paires comme sous-échantillon prioritaire (≥ 30 paires) — accès aux normes croisées RIO-04 + test réel boucle | ✅ Section 6.4 + 7.4 du protocole |
| **A3** | Pré-enregistrement OSF.io avant collecte (hypothèses H1-H7, critères, plan d'analyse) | ✅ Section 13.1.bis du protocole + Phase 0/5 timeline |
| **A4** | Test d'incendie des filets AVANT T0 (5 scénarios documentés — affichage, joignabilité, latence, journal) | ✅ Section 8.2 du document filets + Phase 0 timeline |
| **A5** | Conflit d'intérêt renforcé (consentement + pré-enregistrement + rapport final + engagement résultats négatifs) | ✅ Section 15.3 protocole + consentement FR/EN |
| **A6** | Assurance RC professionnelle vérifiée en Phase 0 (couverture incidents émotionnels, faux négatifs) | ✅ Section 14.6 protocole + Phase 0 timeline |

## Les 3 arbitrages du superviseur sortant (tous intégrés)

| Sujet | Arbitrage | Intégration |
|-------|-----------|-------------|
| **Ligne d'urgence** | Option B au lancement (orientation 3919/3114), migration A+B si Type C/D > 5 % à mi-collecte | ✅ Section 5 document filets + Phase 1 timeline |
| **CNIL / éthique** | AIPD formelle obligatoire + consultation juridique, **pas de CPP** (étude observationnelle) | ✅ Section 14.5 protocole |
| **Conseil clinique** | 6 membres (méthodologue ajouté comme contre-pouvoir technique) | ✅ Section 14.4 protocole |

## Les 2 arbitrages fondateur de la relecture niveau 2 (rendus le 21/10/2026 — trace 1a15d6b474a4969d)

| # | Sujet | Arbitrage rendu | Intégration |
|---|-------|-----------------|-------------|
| **B1** | Usage ECR-R (restriction commerciale consignée R3) | **Option (b)** — validité convergente basculée sur le **RQ** (seuils ≥ 0,40), **CSI** en second instrument (usage exact à ratifier par le conseil) ; **ECR-R non administré** | ✅ Doc 01 (OS6, H5, §8.4, §9, §13.1.bis, §13.2, §17-5/§17-7) · doc 03 §6.1-6.4 · consentement FR/EN · note datée dans `legal/licences-validite-convergente.md` |
| **B2** | Seuil d'arrêt faux négatifs (> 3 vs 3) | **Seuil unique ≥ 3** (le 3ᵉ déclenche — le plus protecteur) | ✅ Doc 04 §4.2 + doc 06 §1.2 alignés |

Les 14 consistances S1-S14 (rapport 07, section D) ont été **corrigées mécaniquement** dans le même commit documenté — détail en section H du rapport 07.

## Les 5 recommandations sur points [À VALIDER] (toutes intégrées)

| Point | Recommandation | Intégration |
|-------|----------------|-------------|
| α ≥ 0,80 vs 0,85 | **0,80 pour valider**, 0,85 comme objectif signalé | ✅ Section 1.1 critères psychométriques |
| RMSEA < 0,08 vs 0,06 | **0,08 pour valider** (n modeste pour AFC) | ✅ Section 2.2 critères psychométriques |
| T8 à 8 ou 12 semaines | **8 semaines** (aligné RCI, 12 = variable de confusion) | ✅ Section 3.2 critères psychométriques |
| Item-total ≥ 0,30 | **Confirmé** — retrait d'item → package R2, jamais silencieux | ✅ Section 4.1 critères psychométriques |
| Open data réponses libres | **Non** (risque ré-identification) · **Oui** pour agrégats/instruments | ✅ Section 10.2 critères psychométriques |

## Objectif du pilote

Valider en conditions réelles les **5 instruments originaux** de la
dimension attachement (RIO-01 à RIO-05), et **remplacer les paramètres
simulés** par des données mesurées sur 150-200 répondants analysables
(recrutement cible 250-300 — Amendement A1).

## Les 5 instruments à valider

| RIO | Instrument | Quête | Paramètres simulés à remplacer |
|-----|------------|-------|--------------------------------|
| RIO-01 | Comment je me raccroche (attachement, 18 items, 2 axes × 3 faces) | Q1 | α simulés (0,9155/0,9082) → α réels · SEM (0,195) → SEM mesuré · bornes (2,61) → bornes recalibrées |
| RIO-02 | Ce qui m'effraie vraiment (l'ombre, 10 déclencheurs + I_alarm) | Q2 | Taux de déclenchement par voie → taux réels · NLP (0,70) → validé sur vraies réponses |
| RIO-03 | Ce qui me porte (banque fermée 6 forces) | Q3 | Taux SILENCIEUSES (16 % simulé) → taux réel · borne G1 (D-Q3-J) → recalibrée |
| RIO-04 | Notre danse (croisement couple, 9 configurations) | Q4 | Percentiles simulés (25/70/20/85) → normes mesurées · chevauchement (77,62 %) → mesuré · borne alerte 70 % active |
| RIO-05 | Mon premier pas (suivi 14 jours, anti-perfectionnisme) | Q5 | Taux de tenue réels par catégorie (CELEBRE/AJUSTEMENT/REPRISE) → mesurés |

## Arborescence du package

```
validation-valid-01/
├── README.md                                  (ce fichier — statut PROTOCOLE)
└── 01-protocole/
    ├── README.md                              (sommaire du protocole)
    ├── 01-protocole-etude.md                  (document principal — 17 sections)
    ├── 02-consentement-eclaire.md             (modèles de consentement RGPD art. 9)
    ├── 03-criteres-psychometriques.md         (α, ω, AFE/AFC, ICC, item-total, SEM, validité convergente)
    ├── 04-filets-securite-incident.md         (déclencheurs H5, 3919/3114, escalade, journal)
    ├── 05-timeline-calendrier.md              (6 phases, 9 mois)
    ├── 06-criteres-arret.md                   (sécurité, futilité, non-conformité)
    └── 07-rapport-relecture-niveau2.md        (relecture fond intégral 21/10 — signalements B1/B2 + S1-S14, verdict 8,5/10)
```

## Principes non négociables (rappel — applicables au pilote réel)

1. **Honnêteté sans condamnation** : aucun item, aucun retour, aucun message ne blâme.
2. **Ombre ET lumière** : chaque résultat montre les deux, jamais l'un sans l'autre.
3. **Jamais le mot « pathologie » à l'écran**.
4. **Langage simple** : niveau de lecture maximal B1 (CECRL).
5. **Jamais l'évaluation du partenaire ou des tiers** : le sujet répond sur soi.
6. **Filet de sécurité prioritaire** : 3919 (violences conjugales, FR) / 3114 (psychiatrie, FR) — déclenchement automatique sur signaux.
7. **Instruments 100 % originaux** : aucun questionnaire standard copié. Constructs scientifiques publics cités (Mikulincer & Shaver, Gable & Reis, etc.), items ex nihilo.
8. **Calcul 100 % local** : aucune donnée envoyée à un tiers pour scoring. Anonymisation à la source.
9. **Inclusivité par conception** : genres, orientations, configurations relationnelles.
10. **L'app se retire quand le couple se rencontre** : pas de médiation à distance.

## Règles permanentes (issues des 7 cycles Q1-Q5)

| Règle | Application au pilote |
|-------|----------------------|
| **D-STD** | Bornes calculées AVANT les seuils, sur CODE réel. Au pilote : les seuils psychométriques (α ≥ 0,80, ICC ≥ 0,80, item-total ≥ 0,30) sont posés a priori, AVANT la collecte. |
| **D-STD-2** | Plafond PAR CONFIGURATION. Au pilote : analyse par sous-groupe (genre, âge, configuration relationnelle) — pas seulement global. |
| **D-CHECK** | Cohérence interne vérifiée à chaque rapport. Au pilote : chiffres de prose vs tableaux, double codage. |
| **D-TABLE** | Voies d'activation identiques dans la table déclarée et le code. Au pilote : instruments non modifiés après collecte (sauf correction mineure signalée). |
| **D-SIM** | Avertissement affiché. Au pilote : jusqu'à l'inversion (fin de l'étude). |
| **D-ENV** | Environnement vérifié avant mission. Au pilote : infrastructure de collecte testée AVANT le premier répondant. |
| **D-TEST** (proposée au Q5, à confirmer) | Le bon objet du test : un critère d'affichage se teste sur les gabarits, pas sur les données. Au pilote : tests d'acceptabilité des messages sur sous-groupe pilote (n=10). |
| **Exécuteur strict** | Signalement sans correction libre. Au pilote : toute déviation de protocole signalée en Section F du rapport, pas corrigée sans arbitrage. |
| **Réparation mécanique** | Strict minimum pour erreurs bloquantes. Au pilote : bug technique corrigeable, déviation de protocole NON. |

## Fautes d'orchestrateur cumulées : 15

Les 15 fautes détectées et corrigées lors des cycles Q1-Q5 sont
documentées et closes. Le pilote ne doit pas en ajouter de nouvelles —
mais si une faute est détectée pendant le pilote, elle sera
**reconnue publiquement** et **corrigée** selon la même méthode.

## [À VALIDER] — points soumis au conseil clinique

Les points marqués **[À VALIDER]** dans les documents du protocole
nécessitent l'arbitrage du conseil clinique avant validation finale.
Ils portent sur :
- les seuils psychométriques exacts (α, ICC, item-total) ;
- les critères d'inclusion/exclusion (notamment situations de violence active) ;
- le protocole d'escalade des incidents ;
- la durée du suivi T8 (8 semaines vs 12) ;
- la composition du conseil clinique lui-même.

## Publication

Package **local** jusqu'à contresignature. Le push GitHub dans
`WAIRYU-Dating → Wairyu thérapie couple/validation-valid-01/` se fera
**après** contresignature superviseur + validation conseil clinique.

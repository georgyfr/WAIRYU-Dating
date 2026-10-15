# 05 — Timeline et calendrier de l'étude

> **STATUT : À VALIDER PAR LE CONSEIL CLINIQUE**
>
> Ce document présente le calendrier prévisionnel du pilote WTC-VALID-01.
> 6 phases sur 9 mois (estimation). Les dates sont indicatives — le
> démarrage réel dépend de la contresignature, de la validation conseil
> clinique, et de la déclaration CNIL (si applicable).

---

## Vue d'ensemble

```
Phase 0     Phase 1           Phase 2     Phase 3           Phase 4     Phase 5
Préparation Collecte T0       Suivi T2    Suivi T8          Analyse     Rapport
│           │                 │           │                 │           │
├─ 2 mois ──┼──── 3 mois ─────┼── intégré ┼──── 3 mois ─────┼── 1 mois ─┼─ 1 mois ─┤
│           │                 │           │                 │           │
Mois 1-2    Mois 3-5                      Mois 5-7          Mois 7-8    Mois 8-9
```

**Durée totale** : 9 mois à partir du feu vert.

---

## Phase 0 — Préparation (mois 1-2)

### Objectif
Mettre en place toutes les conditions préalables au recrutement du premier répondant.

### Tâches

| Tâche | Responsable | Durée | Statut |
|------|-------------|-------|--------|
| Contresignature du protocole par le superviseur sortant | Superviseur sortant | 1 semaine | ✅ Niveau 1 fait (6 amendements + 3 arbitrages + 5 recommandations) |
| Intégration des amendements + relecture intégrale (niveau 2) | Superviseur actif | 1 semaine | ✅ Fait (ce package révisé) |
| Constitution du conseil clinique (**6 membres — méthodologue ajouté**) | Superviseur (humain) | 3-4 semaines | ⏳ Chemin critique |
| Validation du protocole par le conseil clinique | Conseil clinique | 2 semaines | ⏳ |
| **AIPD formelle (Arbitrage superviseur sortant — pas de CPP)** | Superviseur + juridique | 4-6 semaines | ⏳ |
| **Pré-enregistrement OSF.io (Amendement A3)** | Superviseur | 1 heure | ⏳ |
| **Test d'incendie des filets (Amendement A4 — 5 scénarios documentés)** | Data Insight + conseil | 1 semaine | ⏳ |
| Tests techniques des filets de sécurité (D-ENV) | Data Insight | 2 semaines | ⏳ |
| Test d'acceptabilité sur 5-10 testeurs internes | Data Insight + conseil | 1 semaine | ⏳ |
| **Vérification assurance RC professionnelle (Amendement A6)** | Superviseur | 1 semaine | ⏳ |
| Ligne d'urgence — **Option B au lancement** (orientation 3919/3114) | Superviseur | 1 semaine | ⏳ |
| Hébergement des données (serveur UE, chiffrement) | Data Insight | 2 semaines | ⏳ |
| Implémentation du consentement électronique | Data Insight | 1 semaine | ⏳ |
| Préparation des supports de recrutement | Superviseur | 2 semaines | ⏳ |
| Partenariats associations | Superviseur | 4 semaines | ⏳ |
| Campagne réseaux sociaux (préparation) | Superviseur | 2 semaines | ⏳ |
| **Feu vert Phase 1** | Conseil clinique | — | ⏳ |

### Critère de sortie Phase 0

Tous les éléments ci-dessus doivent être en place. **Aucune collecte ne démarre avant.**

Les 4 cases à cocher avant collecte :
1. [x] Contresignature superviseur sortant (niveau 1 + amendements intégrés)
2. [ ] Validation conseil clinique (les 62 points [À VALIDER] restants)
3. [ ] AIPD formelle (Arbitrage superviseur sortant — pas de CPP)
4. [ ] Tests d'infrastructure (D-ENV) + test d'incendie des filets (Amendement A4)

---

## Phase 1 — Collecte T0 (mois 3-5)

### Objectif
Recruter **250-300 répondants** (Amendement A1) et collecter les données T0.

### Tâches

| Tâche | Responsable | Durée |
|------|-------------|-------|
| Lancement de la campagne de recrutement | Superviseur | Semaine 1 |
| Inclusion des premiers répondants (consentement + T0) | Participants | Continue |
| **Recrutement prioritaire des paires (≥ 30 paires — Amendement A2)** | Superviseur | Continue |
| Monitoring quotidien des inclusions | Data Insight | Continue |
| Monitoring quotidien des incidents | Data Insight | Continue |
| Revue mensuelle par le conseil clinique | Conseil | Mensuelle |
| Ajustement recrutement si sous-représentation | Superviseur | Continue |
| **Re-décision ligne d'urgence à mi-collecte (~75 T0)** : si Type C/D > 5 % → migration A+B | Superviseur + conseil | Mi-Phase 1 |

### Critère de sortie Phase 1

- **≥ 250 répondants inclus** (T0 complété) — cible recrutée (Amendement A1)
- **≥ 30 paires** incluses (Amendement A2)
- OU arrêt pour futilité (< 100 répondants à T0 — voir `06-criteres-arret.md`)

### Sous-groupes cibles

Pour respecter D-STD-2 (analyse par configuration), viser une distribution équilibrée :
- Genre : ~50 % femmes, ~40 % hommes, ~10 % non-binaires/autre
- Âge : ~25 % 18-25, ~35 % 26-35, ~25 % 36-50, ~15 % 51+
- Configuration : ~40 % en couple cohabitant, ~25 % en couple non-cohabitant, ~20 % séparé récent, ~15 % célibataire post-relation
- Durée relation : ~20 % < 1 an, ~30 % 1-5 ans, ~30 % 5-15 ans, ~20 % 15+ ans

**Si déséquilibre majeur** : ajustement du recrutement (ciblage spécifique).

---

## Phase 2 — Suivi T2 (intégré à la Phase 1)

### Objectif
Collecter les données de re-test court à 2 semaines après T0.

### Tâches

| Tâche | Responsable | Périodicité |
|------|-------------|-------------|
| Envoi des rappels T2 (email haché) | Application automatique | J+14 de chaque T0 |
| Monitoring taux de réponse T2 | Data Insight | Hebdomadaire |
| Relances (1 relance à J+17 si non-réponse) | Application automatique | J+17 |
| Revue des incidents T2 | Data Insight + conseil | Continue |

### Critère de sortie Phase 2

- Taux de réponse T2 ≥ 75 % (objectif)
- Si < 60 % : investigation (problème technique ? rappels non reçus ?)

---

## Phase 3 — Suivi T8 (mois 5-7)

### Objectif
Collecter les données de re-test long à 8 semaines après T0, + croisement couple + pas + suivi 14j.

### Tâches

| Tâche | Responsable | Périodicité |
|------|-------------|-------------|
| Envoi des rappels T8 | Application automatique | J+56 de chaque T0 |
| Monitoring taux de réponse T8 | Data Insight | Hebdomadaire |
| Relances (1 relance à J+63) | Application automatique | J+63 |
| Suivi du pas 14 jours (RIO-05) | Application automatique | J+56 à J+70 |
| Revue des incidents T8 | Data Insight + conseil | Continue |
| Entretiens qualitatifs (sous-groupe n=10) | Conseil clinique | Semaines 6-7 |

### Critère de sortie Phase 3

- Taux de réponse T8 ≥ 60 % (objectif)
- Si < 50 % : investigation

---

## Phase 4 — Analyse (mois 7-8)

### Objectif
Analyser les données collectées et produire les résultats psychométriques.

### Tâches

| Tâche | Responsable | Durée |
|------|-------------|-------|
| Nettoyage et vérification des données | Data Insight | 1 semaine |
| Analyse psychométrique principale (α, AFE, ICC, item-total) | Data Insight | 2 semaines |
| Analyse par sous-groupe (D-STD-2) | Data Insight | 1 semaine |
| Validité convergente (sous-groupe n=50) | Data Insight | 1 semaine |
| Test des filets (H6) | Data Insight | 1 semaine |
| Analyse qualitative (D-TEST, n=10) | Conseil clinique | 2 semaines |
| Recalibration des paramètres (si H1-H7 valides) | Data Insight | 1 semaine |
| Rédaction du rapport 7 sections | Superviseur | 1 semaine |
| Revue par le conseil clinique | Conseil | 1 semaine |

### Livrables Phase 4

- Rapport WTC-VALID-01 (7 sections — voir modèle Q1-Q5 adapté)
- Données anonymisées (open data, licence CC-BY)
- Scripts d'analyse versionnés (Git)
- Recommandations (inversion D-SIM ou package R2)

---

## Phase 5 — Rapport final et publication (mois 8-9)

### Objectif
Finaliser le rapport, le faire valider, et publier.

### Tâches

| Tâche | Responsable | Durée |
|------|-------------|-------|
| Finalisation du rapport (avec **conflit d'intérêt déclaré + engagement résultats négatifs — Amendement A5**) | Superviseur | 1 semaine |
| Validation par le conseil clinique | Conseil | 2 semaines |
| Contresignature par le superviseur sortant | Superviseur sortant | 1 semaine |
| Push GitHub (dépôt WAIRYU-Dating → validation-valid-01/) | Pont humain | 1 jour |
| **Publication open data (Arbitrage superviseur sortant)** : agrégats et instruments validés (PAS les réponses libres) | Data Insight | 1 semaine |
| Communication aux participants (synthèse anonymisée) | Superviseur | 1 semaine |
| Article scientifique (préparation) | Superviseur + conseil | Continue (post-pilote) |
| **Mise à jour du pré-enregistrement OSF.io** avec résultats (hypothèses confirmées vs découvertes post-hoc) | Superviseur | 1 jour |

### Livrables Phase 5

- Rapport final publié sur GitHub
- Fiche RIO-VALID-01 (registre des instruments originaux)
- Communication aux participants
- Décision : inversion D-SIM OU package R2

---

## Calendrier récapitulatif (dates indicatives)

En supposant un feu vert au **1er novembre 2026** (à adapter) :

| Phase | Début | Fin | Durée |
|-------|-------|-----|-------|
| Phase 0 — Préparation | 01/11/2026 | 31/12/2026 | 2 mois |
| Phase 1 — Collecte T0 | 01/01/2027 | 31/03/2027 | 3 mois |
| Phase 2 — Suivi T2 | (intégré) | 31/03/2027 | (intégré) |
| Phase 3 — Suivi T8 | 01/02/2027 | 31/05/2027 | 3 mois |
| Phase 4 — Analyse | 01/06/2027 | 31/07/2027 | 1 mois |
| Phase 5 — Rapport | 01/08/2027 | 31/08/2027 | 1 mois |
| **Total** | **01/11/2026** | **31/08/2027** | **9 mois** |

**Fin prévisionnelle du pilote** : 31 août 2027 (sous réserve du feu vert et de l'absence d'arrêt).

---

## Risques temporels

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Retard constitution conseil clinique | +1-2 mois | Démarrage en parallèle de la déclaration CNIL |
| Retard déclaration CNIL | +1-2 mois | Démarrage en parallèle de la constitution du conseil |
| Recrutement plus lent que prévu | +1-2 mois | Extension des canaux, campagnes ciblées |
| Attrition T8 > 30 % | Données insuffisantes | Relances, compensation si autorisée |
| Incident grave (Type E) | Arrêt possible | Protocole d'arrêt (voir `06-criteres-arret.md`) |
| Bug technique majeur | Pause temporaire | Tests pré-pilote (D-ENV), hotfix |

---

## Points [À VALIDER] par le conseil clinique — état après arbitrage superviseur sortant

Les points suivants ont été **tranchés par le superviseur sortant** (contresignature niveau 1) :

1. ✅ **Composition du conseil clinique** : 6 membres (méthodologue ajouté comme contre-pouvoir technique)
2. ✅ **Durée totale** : 9 mois confirmée
3. ✅ **Phase 0** : 2 mois confirmés, avec tâches amendées (AIPD, OSF, test d'incendie, assurance)
4. ✅ **Phase 1** : 3 mois pour **250-300 répondants** (Amendement A1) + ≥ 30 paires (Amendement A2)
5. ✅ **Ligne d'urgence** : Option B au lancement, migration A+B si Type C/D > 5 %
6. ✅ **Open data** : Oui pour agrégats/instruments, Non pour réponses libres

Les points suivants restent **à valider par le conseil clinique** :

7. **Phase 3** : le suivi T8 à 8 semaines (vs 12) — confirmé par superviseur sortant
8. **Phase 4** : 1 mois pour l'analyse — suffisant pour une analyse rigoureuse ?
9. **Phase 5** : communication aux participants — sous quelle forme (email, page dédiée) ?
10. **Article scientifique** : faut-il prévoir une soumission à une revue (ex : Journal of Marital and Family Therapy) ? Délai additionnel ?
11. **Date de démarrage** : le 1er novembre 2026 est-il réaliste ?

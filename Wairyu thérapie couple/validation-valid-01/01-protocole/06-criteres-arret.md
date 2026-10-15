# 06 — Critères d'arrêt

> **STATUT : À VALIDER PAR LE CONSEIL CLINIQUE**
>
> Ce document définit les critères d'arrêt prédéfinis du pilote
> WTC-VALID-01. Trois types d'arrêt sont prévus. Tout arrêt déclenche
> une procédure de clôture (notification, sécurisation des données,
> rapport d'arrêt).

---

## Principes

1. **Pré-spécification** : les critères d'arrêt sont définis AVANT le démarrage (D-STD) — aucun ajout post-hoc sans signalement public.
2. **Sécurité d'abord** : tout arrêt pour sécurité prévaut sur l'avancement de l'étude.
3. **Transparence** : tout arrêt est documenté dans un rapport d'arrêt public (anonymisé).
4. **Conservation des données** : les données déjà collectées sont conservées (anonymisées) pour analyse, sauf demande contraire des participants.
5. **Information des participants** : en cas d'arrêt, les participants sont informés par email.

---

## Type 1 — Arrêt pour sécurité

### 1.1 Définition

**Arrêt pour sécurité** : arrêt immédiat de l'étude en raison d'un risque pour les participants.

### 1.2 Critères déclencheurs

| Critère | Délai d'arrêt | Décision |
|---------|---------------|----------|
| **Incident grave Type E** (menace de suicide active, violence en cours) | Immédiat (sous 24h) | Conseil clinique |
| **3 incidents Type C (faux négatifs)** sur l'ensemble du pilote | Sous 48h | Conseil clinique |
| **Bug technique exposant des données identifiantes** | Immédiat | Superviseur + conseil (notification sous 2h) |
| **Ligne d'urgence indisponible** > 7 jours consécutifs | Sous 24h | Superviseur |
| **Décès d'un participant** (même non lié à l'étude) | Immédiat | Superviseur + conseil |

### 1.3 Procédure

1. **Détection** : par le monitoring automatique, signalement participant, ou alerte conseil clinique.
2. **Notification immédiate** : superviseur + conseil clinique (sous 2h pour incident grave, sous 24h pour autres).
3. **Décision** : conseil clinique (vote à la majorité simple, président a voix prépondérante).
4. **Exécution** :
   - Suspension immédiate de l'application de collecte
   - Notification aux participants (email) sous 48h
   - Sécurisation des données déjà collectées
   - Rapport d'arrêt préliminaire sous 7 jours
5. **Conséquences** :
   - Si résolution possible (bug corrigé, ligne rétablie) : reprise après validation conseil
   - Si non résolvable : arrêt définitif, clôture de l'étude

### 1.4 Information des participants

Message type :
> "L'étude WTC-VALID-01 est temporairement suspendue pour des raisons de sécurité. Vos données déjà collectées sont sécurisées. Si vous avez des questions, vous pouvez contacter [email]. Si vous êtes en difficulté, n'hésitez pas à contacter le 3114 (détresse psychiatrique) ou le 3919 (violences conjugales). Nous vous informerons de la reprise éventuelle de l'étude."

---

## Type 2 — Arrêt pour futilité

### 2.1 Définition

**Arrêt pour futilité** : arrêt car l'étude ne pourra pas atteindre ses objectifs, même en continuant.

### 2.2 Critères déclencheurs

| Critère | Délai d'arrêt | Décision |
|---------|---------------|----------|
| **< 100 répondants à T0** après 4 mois de recrutement | Sous 1 semaine | Conseil clinique |
| **Attrition T8 > 60 %** (estimation à mi-parcours) | Sous 1 semaine | Conseil clinique |
| **Taux de réponse T2 < 40 %** | Sous 1 semaine | Conseil clinique |
| **Données inanalysables** (> 30 % de données manquantes par module) | Sous 1 semaine | Conseil clinique + superviseur |

### 2.3 Procédure

1. **Détection** : par le monitoring hebdomadaire (Data Insight).
2. **Notification** : conseil clinique (sous 1 semaine).
3. **Décision** : conseil clinique (vote).
4. **Exécution** :
   - Arrêt du recrutement
   - Clôture du suivi (les répondants déjà inclus terminent T8 si possible)
   - Analyse des données partielles
   - Rapport d'arrêt sous 1 mois

### 2.5 Information des participants

Message type :
> "L'étude WTC-VALID-01 s'achève prématurément car le nombre de participants nécessaire n'a pas pu être atteint. Vos données déjà collectées seront utilisées pour une analyse partielle. Vous pouvez continuer à utiliser l'application WAIRYU normalement. Merci pour votre participation."

---

## Type 3 — Arrêt pour non-conformité

### 3.1 Définition

**Arrêt pour non-conformité** : arrêt car le protocole n'est pas respecté (violation majeure).

### 3.2 Critères déclencheurs

| Critère | Délai d'arrêt | Décision |
|---------|---------------|----------|
| **Violation majeure du protocole** (ex : données collectées sans consentement) | Immédiat | Superviseur + conseil |
| **Modification des instruments sans validation** (D-TABLE) | Sous 48h | Conseil clinique |
| **Perte de données > 20 %** (bug technique non récupérable) | Sous 1 semaine | Superviseur + conseil |
| **Conflit d'intérêt non déclaré** découvert | Sous 1 semaine | Conseil clinique |

### 3.3 Procédure

1. **Détection** : audit interne, signalement participant, audit externe.
2. **Notification** : conseil clinique (sous 48h pour violation majeure).
3. **Décision** : conseil clinique.
4. **Exécution** :
   - Suspension immédiate
   - Investigation (audit complet)
   - Décision : reprise avec correction OU arrêt définitif
   - Rapport de non-conformité public

### 3.4 Information des participants

En cas de violation affectant les participants (ex : données collectées sans consentement) :
- Notification individuelle sous 48h
- Droit d'effacement exercé automatiquement
- Rapport public de la violation

---

## Rapport d'arrêt (structure)

Quel que soit le type d'arrêt, un rapport d'arrêt est produit sous 1 mois. Structure :

1. **Date et type d'arrêt**
2. **Critère déclencheur** (référence à ce document)
3. **Description de l'événement** (anonymisée)
4. **Données collectées au moment de l'arrêt** (effectifs par temps)
5. **Décision du conseil clinique** (vote, date)
6. **Mesures prises** (information participants, sécurisation données)
7. **Analyse des données partielles** (si possible)
8. **Leçons apprises** (fautes d'orchestrateur éventuelles, règles à créer)
9. **Recommandations** (reprise, abandon, package R2)
10. **Statut** : arrêt définitif OU suspension temporaire

---

## Repose après arrêt

### Conditions de reprise

Un arrêt temporaire peut donner lieu à reprise si :
- Cause résolue (bug corrigé, ligne rétablie, protocole amendé)
- Validation par le conseil clinique
- Notification aux participants
- Nouveau feu vert

### Amendement de protocole

Si l'arrêt révèle un défaut de protocole :
- Amendement rédigé par le superviseur
- Validation par le conseil clinique
- Nouvelle version du protocole (v1.1, v2.0)
- Notification aux participants (si déjà inclus)

---

## Points [À VALIDER] par le conseil clinique

1. **Seuil "3 incidents Type C"** : seuil approprié ? Faut-il le requalifier (ex : 2 sur même type de signal) ?
2. **Délai de notification participants** (48h pour sécurité) : suffisant ?
3. **Vote du conseil clinique** : majorité simple, qualifiée (2/3), ou unanimité ?
4. **Président à voix prépondérante** : en cas d'égalité, qui décide ?
5. **Audit externe** : faut-il prévoir un audit indépendant en cas d'arrêt pour non-conformité ?
6. **Reprise après arrêt** : combien d'arrêts maximum avant abandon définitif (ex : 2 arrêts pour sécurité = abandon) ?
7. **Conservation des données post-arrêt** : 10 ans (standard) ou réduction si arrêt pour non-conformité ?
8. **Publication du rapport d'arrêt** : systématique (même si reprise) ou seulement si arrêt définitif ?
9. **Responsabilité juridique** : en cas d'incident grave, qui est responsable (promoteur, investigateur, conseil) ? [À valider avec juridique]

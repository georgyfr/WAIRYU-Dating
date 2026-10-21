# 04 — Filets de sécurité et protocole d'incident

> **STATUT : À VALIDER PAR LE CONSEIL CLINIQUE**
>
> Ce document décrit les filets de sécurité du pilote WTC-VALID-01 et le
> protocole d'incident. **C'est la section la plus importante du
> protocole** — les filets de sécurité sont le dernier maillon entre
> l'application et les personnes en situation de risque. Ils doivent
> être impeccables.

---

## 1. Principes non négociables

1. **Filet de sécurité prioritaire** : tout signal de risque déclenche une réponse immédiate, avant tout autre traitement.
2. **3919 / 3114** : numéros d'orientation systématiques selon le type de risque (violences conjugales / détresse psychiatrique).
3. **Aucun signal n'est ignoré** : un faux positif (filet déclenché à tort) est toujours préférable à un faux négatif (signal manqué).
4. **Journal d'incident** : tout déclenchement est consigné (anonymisé) pour revue par le conseil clinique.
5. **Escalade** : un incident grave déclenche une procédure d'escalade (contact humain, arrêt éventuel de l'étude).

---

## 2. Types de signaux détectés

### 2.1 H5 — Comportement de sécurité (RIO-02)

**Déclencheur** : item H5 activé (comportement de mise en sécurité face à un partenaire).

**Signaux typiques** :
- "Je me sens en danger physique avec mon/ma partenaire"
- "J'ai déjà dû me cacher ou fuir"
- "Mon/ma partenaire contrôle mes déplacements, mes contacts"
- "J'ai peur des réactions de mon/ma partenaire"

**Réponse automatique** :
- Affichage immédiat d'un message d'alerte
- Numéro **3919** (Arrêtons les violences — appellation officielle depuis 2024, ex-Violences Femmes Info, FR) ou équivalent local
- Message : "Ce que tu décris peut être une situation de violence. Tu n'es pas seul(e). Le 3919 est un numéro gratuit, anonyme, disponible 24h/24. Tu peux aussi appeler le 17 en cas d'urgence."
- Possibilité de contacter un humain (si ligne d'urgence établie)
- Proposer de pause / d'arrêter le questionnaire (sans obligation)

### 2.2 Allusions à la violence

**Déclencheur** : NLP local détectant des allusions à la violence dans les champs libres (Q2 causes, Q5 retours).

**Patterns NLP** (liste non exhaustive, à étendre) :
- "il/elle me frappe", "violence", "coups", "blessure"
- "il/elle me menace", "menace", "peur de lui"
- "il/elle me contrôle", "surveille", "vérifie mon téléphone"
- "je n'ose pas", "j'ai peur de"

**Réponse automatique** : idem H5.

### 2.3 Allusions au suicide / automutilation

**Déclencheur** : NLP local détectant des allusions.

**Patterns NLP** :
- "suicide", "suicidaire", "envie de mourir", "en finir"
- "automutilation", "me couper", "me faire mal"
- "sans valeur", "meilleur sans moi"

**Réponse automatique** :
- Affichage immédiat d'un message d'alerte
- Numéro **3114** (Détresse psychiatrique, FR) ou équivalent local
- Message : "Ce que tu décris est difficile. Tu n'es pas seul(e). Le 3114 est un numéro gratuit, anonyme, disponible 24h/24. Si tu es en danger immédiat, appelle le 15 (SAMU) ou le 112."
- Proposer de pause / d'arrêter le questionnaire.

### 2.4 Détresse aiguë (pattern de réponses)

**Déclencheur** : pattern de réponses indiquant un état critique (ex : tous les items d'alarme à maximum, score de détresse extrême).

**Calcul** : si score RIO-02 I_alarm ≥ seuil critique [À VALIDER — seuil à définir sur données simulées].

**Réponse automatique** :
- Message de soutien immédiat
- Orientation 3114
- Proposition de pause
- Contact humain proposé

### 2.5 Baisse brutale entre T0 et T8

**Déclencheur** : si entre deux temps de mesure, le score RIO-01 chute de plus de 2 SEM (changement cliniquement significatif dans le sens de la dégradation).

**Réponse automatique** :
- Message de soutien
- Vérification : "Comment vas-tu depuis la dernière fois ?"
- Orientation 3114 si détresse confirmée

---

## 3. Architecture technique des filets

### 3.1 Détection

- **Calcul 100 % local** : la détection se fait sur l'appareil du participant, pas sur un serveur. Aucune réponse n'est envoyée à un tiers pour scoring.
- **Seuils prédéfinis** : les seuils sont codés en dur dans l'application (D-TABLE — voies identiques dans la table déclarée et le code).
- **NLP local** : modèle léger (type regex + lexique) embarqué sur l'appareil.

### 3.2 Déclenchement

- **Immédiat** : dès qu'un signal est détecté, le filet s'affiche à l'écran.
- **Modal** : le filet bloque la progression du questionnaire jusqu'à acknowledgement par le participant (case à cocher "J'ai lu le message d'aide").
- **Non-culpabilisant** : le message ne dit jamais "tu devrais", "tu dois". Il dit "tu peux", "voici des ressources".

### 3.3 Journalisation

- **Journal local** : chaque déclenchement est enregistré localement (timestamp, type de signal, action du participant).
- **Synchronisation anonymisée** : le journal est synchronisé avec le serveur de recherche (sans contenu identifiable — uniquement type, timestamp, UUID).
- **Conservation** : 10 ans (durée de conservation des données de recherche).

---

## 4. Protocole d'incident

### 4.1 Définition d'un incident

**Incident** : tout déclenchement d'un filet de sécurité pendant le pilote.

**Types d'incidents** :
- **Type A — Détecté et géré** : filet déclenché, participant a acknowledged le message, a continué ou s'est arrêté.
- **Type B — Détecté et escaladé** : filet déclenché, participant a demandé un contact humain.
- **Type C — Non détecté (faux négatif)** : un participant en situation de risque n'a pas déclenché le filet (identifié a posteriori — par exemple, retour libre mentionnant une violence).
- **Type D — Faux positif** : filet déclenché à tort (signal NLP mal interprété).
- **Type E — Incident grave** : situation de danger immédiat identifiée (ex : menace de suicide active dans un champ libre).

### 4.2 Procédure par type

#### Type A — Détecté et géré
- Journalisation automatique
- Revue mensuelle par le conseil clinique
- Aucune action immédiate

#### Type B — Détecté et escaladé
- Journalisation automatique
- Contact humain sous 24h (ligne d'urgence si établie)
- Orientation vers ressources locales
- Revue par le conseil clinique sous 7 jours

#### Type C — Non détecté (faux négatif)
- **Alerte critique** : tout faux négatif est un échec du système
- Investigation immédiate (sous 48h) : pourquoi le filet ne s'est-il pas déclenché ?
- Si bug : correction et re-test (D-ENV)
- Si limite du NLP : ajout de patterns, re-déploiement
- Revue par le conseil clinique sous 7 jours
- Si **≥ 3** faux négatifs sur le pilote (le 3ᵉ déclenche l'arrêt — aligné sur `06-criteres-arret.md` §1.2, arbitrage B2 du 21/10/2026) : **arrêt de l'étude**

#### Type D — Faux positif
- Journalisation automatique
- Revue mensuelle
- Si taux de faux positifs > 20 % : investigation (NLP trop sensible)

#### Type E — Incident grave
- **Procédure d'urgence** :
  - Contact immédiat du participant (si possible — dépend du mode de contact)
  - Orientation vers urgences (15/112 en France)
  - Notification immédiate au conseil clinique (sous 2h)
  - Décision d'arrêt de l'étude à prendre sous 24h
- **Journalisation complète** (même anonymisée, l'incident est tracé)

---

## 5. Composition de la ligne d'urgence (Arbitrage superviseur sortant)

**Décision (arbitrage superviseur sortant)** : **Option B au lancement, avec migration A en Phase 1 si le volume le justifie**.

### 5.1 Option B — Orientation vers existant (au lancement)

- Pas de ligne dédiée WAIRYU au démarrage
- **Orientation 3919/3114 systématique** (lignes nationales existantes — gratuites, formées, 24/7)
- **Avantage** : pas de coût, pas de logistique, équivalence clinique pour le pilote
- **Inconvénient** : pas de continuité, pas de suivi des participants

### 5.2 Migration vers Option A+B (en Phase 1, si volume justifie)

**Re-décision à mi-collecte** : si le **taux de signaux de type C/D dépasse ~5 %** (faux négatifs + faux positifs), passer à l'Option A+B :
- **Option A — Ligne dédiée** activée :
  - Numéro de téléphone WAIRYU (psychologue clinicien(ne) d'astreinte)
  - Disponibilité 7j/7, 12h/24 (ex : 8h-20h)
  - Coût : 1 ETP clinicien
  - Avantage : prise en charge directe, continuité
  - Inconvénient : coût, logistique
- **Option B maintenue** en parallèle (orientation 3919/3114 pour les heures non couvertes)

### 5.3 Justification de l'arbitrage

Une ligne dédiée (A) est l'idéal clinique mais exige un opérateur formé disponible — lourdeur et coût pour un pilote de 150-300 personnes. L'orientation vers les lignes nationales existantes (3919, 3114) est cliniquement équivalente pour le pilote. La re-décision à mi-collecte permet d'adapter la réponse au volume réel d'incidents — sans surdimensionner au départ.

**Indicateur de déclenchement de la migration** : taux de signaux Type C + D > 5 % à mi-collecte (estimé après ~75 répondants T0).

---

## 6. Journal d'incident (format)

### 6.1 Structure

```json
{
  "incident_id": "UUID",
  "timestamp": "ISO-8601",
  "participant_uuid": "UUID (anonymisé)",
  "temps_mesure": "T0 | T2 | T8",
  "type": "A | B | C | D | E",
  "signal": "H5 | allusion_violence | allusion_suicide | detresse_aigue | baisse_T0T8",
  "pattern_nlp": "(si applicable) pattern détecté",
  "action_participant": "acknowledged | pause | arret | contact_humain",
  "orientation_donnee": "3919 | 3114 | 15 | 112 | autre",
  "contact_humain": "true | false",
  "resolution": "géré | escaladé | en_cours",
  "notes": "(anonymisées, pas de contenu identifiable)"
}
```

### 6.2 Revue par le conseil clinique

**Mensuelle** (ou ad hoc si incident grave) :
- Nombre total d'incidents par type
- Taux de faux négatifs (Type C) — critique
- Taux de faux positifs (Type D) — acceptable mais à surveiller
- Patterns émergents (un item H5 déclenche-t-il plus que les autres ?)
- Décisions : correction, ajout de patterns, arrêt éventuel

---

## 7. Ressources par pays

### 7.1 France

| Signal | Numéro | Disponibilité |
|--------|--------|---------------|
| Violences conjugales | **3919** | 24h/24, 7j/7, gratuit, anonyme |
| Détresse psychiatrique | **3114** | 24h/24, 7j/7, gratuit, anonyme |
| Urgence médicale | **15** (SAMU) ou **112** | 24h/24 |
| Urgence police | **17** | 24h/24 |
| SOS Amitié | **09 72 39 40 50** | 24h/24 |
| Suicide Écoute | **01 45 39 40 00** | 24h/24 |

### 7.2 Belgique

| Signal | Numéro |
|--------|--------|
| Violences conjugales | **1712** (violences entre partenaires) |
| Télé-Accueil | **107** |
| Centre de Prévention du Suicide | **0800 32 123** |

### 7.3 Suisse

| Signal | Numéro |
|--------|--------|
| Violences conjugales | **147** (Pro Juventute, jeunes) · 144 (urgences) |
| Main Tendue | **143** |
| Détresse psychologique | La Main Tendue |

### 7.4 Canada (Québec)

| Signal | Numéro |
|--------|--------|
| SOS Violence Conjugale | **1-800-363-9010** |
| Suicide Action Montréal | **514-723-4000** |
| Centre de prévention du suicide | **1-866-APPELLE** |

### 7.5 Adaptation automatique

L'application détecte le pays (via locale OS ou choix explicite du participant) et affiche les ressources correspondantes. [À VALIDER — comment gérer les voyageurs / expatriés ?]

---

## 8. Test des filets avant le pilote (D-ENV appliqué au réel)

### 8.1 Tests techniques pré-pilote

Avant le premier répondant :
- Tester chaque signal (H5, allusions, détresse) avec des profils simulés
- Vérifier le déclenchement (100 % des signaux simulés doivent déclencher)
- Vérifier l'affichage (message correct, ressources correctes)
- Vérifier la journalisation (entrée correcte dans le journal)

### 8.2 Test d'incendie des filets (Amendement A4 — obligatoire avant T0)

**Principe** : un filet testé en simulation ne protège personne. Le critère d'arrêt « ≥ 3 faux négatifs » (arbitrage B2) arriverait trop tard s'il n'a jamais été testé en conditions réelles.

**Protocole de test d'incendie** : des répondants-test (membres de l'équipe, volontaires formés) déclenchent **sciemment les 5 types de signaux** et l'on vérifie :

1. **L'affichage réel des ressources** (3919, 3114, 15, 112) — le bon numéro s'affiche-t-il pour le bon signal ?
2. **La joignabilité des numéros** — les numéros 3919 et 3114 répondent-ils effectivement ? (test d'appel non-intrusif, vérification du préfixe de réponse)
3. **La latence** — le filet s'affiche-t-il en moins de 1 seconde après le signal ?
4. **Le journal d'incident** — chaque déclenchement est-il consigné avec le bon type, le bon timestamp, la bonne action ?
5. **L'action du participant** — le questionnaire se met-il en pause jusqu'à acknowledgement ?
6. **Le message non-culpabilisant** — le wording est-il correct (pas de « tu dois », « tu devrais ») ?

**Scénarios de test** (5 signaux × 1 répondant-test = 5 déclenchements minimum) :
- Scénario 1 : répondre H5 = oui → vérifier affichage 3919
- Scénario 2 : écrire « il me frappe » dans un champ libre → vérifier NLP + affichage 3919
- Scénario 3 : écrire « envie de mourir » → vérifier NLP + affichage 3114
- Scénario 4 : pattern de réponses maximal alarme → vérifier détresse aiguë
- Scénario 5 : chute de score T0→T8 > 2 SEM → vérifier message de soutien

**Document de test** : chaque scénario est documenté (capture d'écran, timestamp, résultat attendu, résultat obtenu). Le document est fourni au conseil clinique avant le feu vert de collecte.

**Critère de succès** : 5/5 scénarios déclenchent correctement. Si 1 échoue → correction + re-test avant T0.

### 8.3 Test d'acceptabilité

Sur un sous-groupe de 5-10 testeurs internes :
- Présentation de scénarios à risque simulés
- Vérification de l'affichage
- Recueil des retours (le message est-il clair ? culpabilisant ? utile ?)

### 8.4 Validation finale

Le pilote ne démarre que si :
- 100 % des signaux simulés déclenchent correctement (Section 8.1)
- **Le test d'incendie des filets est documenté et validé (Section 8.2 — Amendement A4)**
- Le test d'acceptabilité est concluant (Section 8.3)
- Le journal d'incident fonctionne
- La ligne d'urgence (si établie) est opérationnelle
- Le conseil clinique a validé les messages et les ressources
- **L'assurance RC professionnelle (Amendement A6) est documentée**
- **Le pré-enregistrement OSF.io (Amendement A3) est publié**

---

## 9. Points [À VALIDER] par le conseil clinique — état après arbitrage superviseur sortant

Les points suivants ont été **tranchés par le superviseur sortant** (contresignature niveau 1) :

1. ✅ **Ligne d'urgence** : Option B au lancement, migration A+B si taux Type C/D > 5 % à mi-collecte
2. ✅ **Test d'incendie des filets (Amendement A4)** : obligatoire avant T0, 5 scénarios documentés
3. ✅ **Assurance RC professionnelle (Amendement A6)** : condition de démarrage, attestation à fournir

Les points suivants restent **à valider par le conseil clinique** :

4. **Seuil de détresse aiguë** : quel score I_alarm déclenche le filet Type 4 ?
5. **NLP patterns** : la liste des patterns est-elle exhaustive ? Faut-il un modèle plus sophistiqué (transformer léger) ?
6. **Délai de réponse aux incidents Type B** : 24h est-il réaliste ?
7. **Délai de réponse aux incidents Type E** : 2h est-il réaliste ?
8. **Seuil d'arrêt (≥ 3 faux négatifs — arbitrage B2 du 21/10/2026)** : seuil approprié ?
9. **Ressources par pays** : la liste est-elle exhaustive ? Maintenance ?
10. **Message H5** : formulation exacte — à tester sur 5-10 testeurs avant pilote.
11. **Contact humain** : si le participant demande un contact (Option A activée), qui répond ? Formation requise ?
12. **Confidentialité du journal** : qui a accès au journal d'incident ? Anonymisation ?
13. **Suivi post-incident** : un participant ayant déclenché un filet doit-il être contacté à T8 pour vérifier qu'il va bien ?

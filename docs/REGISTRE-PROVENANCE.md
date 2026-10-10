# REGISTRE DE PROVENANCE — CONTENUS PSYCHOMÉTRIQUES WAIRYU

> **Document vivant** — compagnon opérationnel de [`docs/AUDIT-PROVENANCE-TESTS.md`](./AUDIT-PROVENANCE-TESTS.md).
> Créé le 10 octobre 2026 · Périmètre : toute quête mesurée (passation, items, cartes) livrée ou prévue dans l'app.
> **Rôle** : c'est la preuve de diligence continue. Une ligne par quête, complétée **à la conception**, vérifiée **avant chaque mise en production** (§0).

---

## 0. Règles de tenue du registre

Trois règles héritées de l'audit de licences du fondateur (`refonte des tests et outils wairyu.md`, archive `v1-2026-10-05`) :

- **R1 — Le concept est libre, l'item et la marque ne le sont pas.** Tout framework scientifique publié (Big Five, attachement, valeurs, …) est utilisable gratuitement ; seuls les libellés exacts d'items protégés et les noms déposés sont interdits.
- **R2 — Nom interne WAIRYU obligatoire.** Aucun nom commercial ni aucun nom d'instrument n'apparaît dans l'app (`apps/web`, `apps/api`, stores, marketing). La source scientifique réelle est créditée **dans la documentation interne uniquement** (livrables gelés, branche d'archive).
- **R3 — Substitution ou item original.** Tout instrument payant est soit remplacé par un équivalent libre, soit reconstruit avec des **items originaux** mesurant le même construit — devenant propriété intellectuelle WAIRYU.

**Procédure à chaque nouvelle quête :**
1. À la conception : compléter une ligne dans §1 ou §2 (construit, concept de référence, statut juridique, décision items originaux/autre).
2. Règle d'entrée d'audit : ne jamais fournir les items d'origine d'un instrument protégé à une session de conception — concepts, dimensions et statuts de licence uniquement.
3. Avant mise en production : contrôle anti-plagiat des items livrés vs banques publiques correspondantes (ECR-R, IPIP, PVQ, Aron 1997, …), puis dater la ligne (« Vérifié »).
4. Toute dérogation (licenciement d'un instrument, ex. YSQ Option A) doit être consignée ici avec sa décision et son budget.

---

## 1. Quêtes à instrument de référence

| Quête | Titre | Construit mesuré | Concept / instrument de référence | Statut juridique du concept | Items livrés | Origine des items | Verrou de rendu (R2) | Risque | Vérifié |
|---|---|---|---|---|---|---|---|---|---|
| **1.1** | Ta personnalité | Personnalité Big Five (5 dimensions) | **IPIP-50 / IPIP-NEO** (pool de Goldberg) | **Domaine public explicite** (usage commercial libre sans permission — mission déclarée de l'IPIP) | 50 items carte au dépôt (`quete-1-1.ts`) + 8 trames sécurité **hors dépôt** (règle 11-b) | 100 % originaux WAIRYU — aucun calque IPIP-50 (comparaison item par item) | Aucun nom IPIP/NEO/Big Five en UI | 🟢 Faible | 2026-10-10 |
| **1.2** | Ta façon de t'attacher | Attachement adulte : anxiété / évitement | **ECR-R** (36 items) | Construit public ; items d'origine protégés | 12 items carte au dépôt (`quete-1-2.ts`) + 8 trames sécurité hors dépôt | 100 % originaux — **aucun des 36 items ECR-R calqué** (vérifié item par item) | Aucun sigle ECR-R en UI | 🟢 Faible | 2026-10-10 |
| **1.3** | Tes émotions | Intelligence émotionnelle : perception / clarté / régulation | **SSEIT (Schutte)** | Usage commercial soumis à permission | 20 items au dépôt (`quete-1-3.ts`) | 100 % originaux — aucun item SSEIT/Schutte ; instrument jamais intégré | Aucun nom Schutte/SSEIT en UI | 🟢 Faible | 2026-10-10 |
| **2.1** | Tes valeurs | 10 valeurs du modèle de Schwartz | **PVQ-RR (Schwartz)** | Concept public ; questionnaire commercial soumis à permission | 20 items à paires D/I au dépôt (`quete-2-1.ts`) + 4 trames sécurité hors dépôt (24 en passation) | 100 % originaux — aucun « portrait » PVQ, pas de calque de traduction | Aucun nom Schwartz/PVQ en UI | 🟢 Faible | 2026-10-10 |
| **2.2** | Ta place pour la spiritualité | Spiritualité au quotidien | Échelle de spiritualité (Spann-Fischer & Tilbury) | Usage commercial soumis à permission | 6 items au dépôt (`quete-2-2.ts`) | 100 % originaux — instrument jamais intégré | Aucun nom d'auteure en UI | 🟢 Faible | 2026-10-10 |
| **1.8** | *(bien-être — prévue Phase 3, **non livrée**)* | Bien-être / humeur (opt-in) | **PHQ-9** | **Domaine public explicite** (libéré par Pfizer, « aucune permission requise ») | — | Seule exception déclarée de domaine public dans le livrable | À évaluer à la conception | 🟢 Faible | — |
| **4.3** *(M5)* | Les questions qui rapprochent → voir 8.1 ; **4.3 = page d'écoute** | **4.3 — « Ce que tes relations t'ont appris »** : capacité d'évolution (récit libre) | Aucun instrument tiers — question ouverte originale (analyse moteur P2, jamais rendue) | Concept public (aucun instrument) | 1 item ouvert | 100 % originaux — champ libre, retrait « Je préfère ne pas dire », réponse jamais rendue (interdit V10) | Aucun nom d'instrument en UI | 🟢 Faible | 2026-10-10 |
| **4.4** *(M5, **invisible**)* | Blessures et aisance | Schémas précoces + aisance dans l'intimité (FIS) + méfiance-intimité | **YSQ (Schémas de Young)** | Concept public ; nom + items protégés | 0 écran (quête invisible par design) | **Décision : Option B — items originaux** « trames sécurité » dont les formulations vivent HORS DÉPÔT (règle 11-b — document trames confidentiel) : 10 codes Q4.4-T13→T22 hébergés dans les passations de 4.1 (2) et 4.2 (8), sautés par le deck, jamais affichés, jamais scorés dans l'app. Plan B documenté : licence YSQ ~2-5 k€/an si la bêta l'exige | Aucun nom Young/YSQ en UI | 🟢 Faible | 2026-10-10 |
| **5.6** *(M7)* | Réparation après conflit | Comportements de réparation | Concepts Gottman (réparation, 4 comportements destructifs) | Concepts publiés et libres | 5 items originaux | 100 % originaux | Nommage interne « signaux de communication à surveiller » — jamais « 4 Cavaliers » ni « Gottman » | 🟢 Faible | 2026-10-10 |
| **8.1** *(M11)* | Les questions qui rapprochent | Closeness générée par échange | Aron et al. 1997 (36 questions) | Article scientifique public ; questions d'origine protégées | 36 questions WAIRYU | 100 % originaux — **distinctes d'Aron 1997** (aucun des thèmes célèbres : invité de dîner, célébrité, journée parfaite, île déserte…) | Aucun nom Aron en UI | 🟢 Faible | 2026-10-10 |
| **4.1** *(M5)* | Ton arbre relationnel | Climat émotionnel de l'origine + loyautés invisibles | **Théorie des systèmes familiaux (Bowen)** · **thérapie contextuelle, loyautés invisibles (Boszormenyi-Nagy)** + génogramme (outil de lecture) | Concepts publiés et libres | 8 items Likert (2 axes, 4 paires R6) + 2 trames hébergées du bloc 4.4 (Q4.4-T13/T14, hors dépôt) + génogramme NON scoré | 100 % originaux — production neuve déclarée (B.3) : aucun texte d'item chez Bowen/Boszormenyi-Nagy, concepts publiés seulement | Noms d'auteurs interdits au rendu (« cadrage moteur + verrou rendu ») ; zéro blâme parental, zéro vocabulaire clinique | 🟢 Faible | 2026-10-10 |
| **4.2** *(M5)* | Où tu en es aujourd'hui | Disponibilité après ruptures (intégration · état · réassurance RSQ) | **Trajectoires de résilience après perte (Bonanno)** · **ajustement post-rupture (Field)** | Concepts publiés et libres | 18 items Likert (3 familles, 8 paires R6 + 2 pivots) + 1 ouverte (Q4.2-19, jamais rendue) + 8 trames hébergées du bloc 4.4 (T15→T22, hors dépôt) | 100 % originaux — production neuve déclarée (B.3) ; RB1/RSQ restent moteur seul, jamais un verdict de guérison | Noms d'auteurs interdits au rendu ; une météo, jamais des stades | 🟢 Faible | 2026-10-10 |
| **5.1** *(M6)* | Ton style amoureux | Six façons d'aimer (passion · jeu · amitié devenue amour · pragmatisme · intensité · don de soi) | **Typologie des styles amoureux (Lee)** | Concept public et libre ; les six noms d'atelier + le nom de l'auteur INTERDITS au rendu | 18 items Likert au dépôt (`quete-5-1.ts`) — 6 façons × 3, 6 paires R6 + 6 pivots, graine 251427 | 100 % originaux — production neuve déclarée (B.3, dossier V11 perdu) ; nommage UI obligatoire (« la passion », « le jeu »…) | Noms d'atelier + auteur interdits au rendu (vérifiés machine, mots entiers) ; zéro hiérarchie des façons ; ombre = EXCÈS en couple | 🟢 Faible | 2026-10-10 |
| **5.2** *(M6)* | Ta vision de l'amour | Croyances romantiques : destin · coup de foudre · grand amour unique · idéalisation | **Croyances de relation (Sprecher & Metts)** | Concept public ; échelle d'origine protégée | 8 items Likert au dépôt (`quete-5-2.ts`) — 4 axes × 2, 4 paires R6, graine 252427 | 100 % originaux — production neuve déclarée (B.3) ; noms des auteures + nom d'échelle jamais au rendu (fichiers moteur seulement) | Zéro verdict/prédiction/correction de croyance (slot probabiliste) ; SIG-5.2-02 destin×évitant [MOTEUR SEUL] | 🟢 Faible | 2026-10-10 |
| **5.3** *(M6)* | Comment tu exprimes ton affection | 5 canaux d'expression affective (mots · temps · gestes · attentions · contact) | Concept public des canaux d'expression affective ; **marque déposée du domaine INTERDITE en toutes lettres dans TOUT le dossier** | Concept public ; marque déposée (jamais citée) | 10 items Likert au dépôt (`quete-5-3.ts`) — 5 canaux × 2, 5 paires R6, graine 253427 | 100 % originaux — libellés UI génériques neutres Wairyu ; zéro occurrence de la marque (vérifié machine) | **RÈGLE CAPITALE : JAMAIS DANS LE SCORE** — quête conversationnelle uniquement, aucun croisement moteur, aucun entrant matching | 🟢 Faible | 2026-10-10 |
| **5.7** *(M6)* | Ton humour | 4 styles d'humour (qui rapproche · qui dédramatise · qui blesse · qui s'auto-rabaisse) | **Styles d'humour (Martin et al., 2003)** | Typologie publique, **libre avec citation** (citation tenue en documentation interne) | 12 items Likert au dépôt (`quete-5-7.ts`) — 4 styles × 3, 4 paires R6 + 4 pivots, graine 257427 (course 2ᵉ génération fait foi — divergence d'empreinte V11 consignée) | 100 % originaux — concepts publics, formulations Wairyu ; noms scientifiques + auteur + sigle côté moteur uniquement | JAMAIS au rendu ; SIG-5.7-02 « qui blesse »×RSQ [MOTEUR SEUL, non calculé] ; ombre = COÛT, jamais le style | 🟢 Faible | 2026-10-10 |

---

## 2. Quêtes sans instrument tiers (contenu original WAIRYU)

Ces quêtes mesurent des préférences, réalités et modes de vie sur des **thèmes publics génériques**, sans passer par un instrument psychométrique existant : aucun risque de droit d'auteur sur les items n'est identifiable par nature (pas d'instrument de référence dont la similarité substantielle pourrait être alléguée). Vérification d'usage avant prod : originalité du texte + absence de marque au rendu (§3).

| Quête | Titre | Construit / thème |
|---|---|---|
| 1.4 | Ton contrôle sur toi-même | Contrôle perçu et lâcher-prise |
| 1.5 | L'épreuve du temps | Stabilité et constance du lien dans le temps |
| 1.6 | Ta façon de penser | Cognition : réflexion vs intuition |
| 1.7 | Ton fonctionnement (optionnel) | Fonctionnement quotidien (sans carte) |
| 1.9 | Ton élan du moment | Photographie datée de l'élan actuel (métaphore « météo ») |
| 1.10 | Ce que tu apportes | Contribution au lien |
| 1.11 | Es-tu prêt·e à rencontrer ? | Disponibilité réelle à la rencontre |
| 2.3 | Tes non-négociables | Limites personnelles |
| 2.4 | Tes réalités | Contraintes de vie assumées |
| 2.5 | Ce que tu cherches | Intention de relation |
| 2.6 | Tes priorités pour les 5 prochaines années | Horizon de projet |
| 2.7 | Ta vision de la famille | Projet familial |
| 2.8 | Ton signe (juste pour le jeu) | Astrologie — déclaré ludique, aucune prétention de mesure |
| 3.1 | Ton rythme de vie | Chronotype et désynchronie sociale |
| 3.2 | Ton quotidien | Organisation de la journée |
| 3.3 | Ton temps libre | Loisirs et énergie |
| 3.4 | Ton rapport à l'argent | Rapport à l'argent dans le lien |
| 3.5 | Ton entourage | Place des proches |
| 3.6 | Le choix visuel | Préférences visuelles |
| 3.7 | Tes attirances | Attirances déclarées |

**Écrans, cartes et archétypes** (cartes de découverte, écrans de passage, fragments, sceaux, archétypes narratifs) : textes narratifs originaux WAIRYU — aucune source tierce ; les en-têtes `quete-*-arche.ts` portent la déclaration de fidélité aux livrables internes.

---

## 3. Registre des marques interdites (13, règle R2)

Repris de l'audit de licences du fondateur (source : `refonte des tests et outils wairyu.md`, archive `v1-2026-10-05`). **Interdits en UI, marketing, stores — toute circonstance.**

| # | Marque protégée | Propriétaire | Pourquoi interdite |
|---|---|---|---|
| 1 | **MBTI / Myers-Briggs / 16 types** | The Myers-Briggs Company | Marque + licence coûteuse + faible validité scientifique |
| 2 | **Thomas-Kilmann / TKI** | The Myers-Briggs Company | Instrument facturé par passation |
| 3 | **5 Love Languages / Langages de l'amour** | Gary Chapman / Northfield Publishing | Marque déposée + empire de formations — concept utilisable sous naming WAIRYU (« langages d'expression affective ») |
| 4 | **Erotic Blueprints™** | Jaiya | Marque commerciale + méthode payante — carte WAIRYU à naming propre |
| 5 | **RHETI / Riso-Hudson / Enneagram Institute** | The Enneagram Institute | ~12 €/test + licence B2B — éliminé du score |
| 6 | **Gottman / « 4 Cavaliers » (en tant que produit)** | The Gottman Institute | Plateforme commerciale — les concepts publiés restent utilisables, le nom non |
| 7 | **NEO-PI-R / NEO** | PAR Inc. | Test commercial concurrent de l'IPIP |
| 8 | **MSCEIT / Mayer-Salovey** | Multi-Health Systems | Facturation par passation + certification — remplacé par le SSEIT puis par des items originaux |
| 9 | **DAS / Dyadic Adjustment Scale** | Multi-Health Systems | Facturation par usage — grille WAIRYU |
| 10 | **SAST / Carnes** | IITAP / Gentle Path | Licence clinique — éliminé (Brief COPE + auto-déclaration) |
| 11 | **Young Schema Questionnaire / YSQ (nom)** | Schema Therapy Institute | Licence requise pour le nom et les items — décision Option B (voir §1, quête 4.4) |
| 12 | **DISC / Everything DiSC** | Wiley | Marque + licence (précaution) |
| 13 | **Hogan, SHL, Saville, Predictive Index, StrengthsFinder / CliftonStrengths** | Divers | À bannir par précaution de tout vocabulaire produit |

---

## 4. Statuts juridiques par instrument de référence

| Instrument | Statut | Usage dans WAIRYU |
|---|---|---|
| **IPIP** (Goldberg) | Domaine public déclaré — usage commercial libre, sans permission | Concept de référence de 1.1 ; items 100 % originaux |
| **PHQ-9** | Domaine public (libéré par Pfizer) | Prévu Phase 3 opt-in (1.8) — non construit au 10/10/2026 |
| **ECR-R** | Construit public ; items protégés dans les usages licenciés | Concept de référence de 1.2 ; aucun item ni formulation repris |
| **SSEIT (Schutte)** | Usage commercial soumis à permission | Concept seulement — jamais intégré |
| **PVQ-RR (Schwartz)** | Concept public ; questionnaire commercial soumis à permission | Concept seulement — jamais intégré |
| **Spann-Fischer** | Usage commercial soumis à permission | Concept seulement — jamais intégré |
| **YSQ (Young)** | Nom + items protégés ; licence ~2-5 k€/an | Option B : items originaux (plan B licence documenté) |
| **Concepts Gottman** | Concepts publiés libres ; nom/marque protégés | Items originaux ; nommage interne obligatoire |
| **Aron 1997** | Article public ; questions d'origine protégées | 36 questions 100 % originales |
| **BFI-2** (exemple cité par l'analyse externe) | Licence recherche non commerciale ; commercial = autorisation | **Jamais utilisé** — ni concept intégrateur ni items |
| **Instruments payants éliminés** (TKI, RHETI, MSCEIT, DAS, SAST, Love Languages, Blueprints™, Mehrabian) | Payants / marques | Éliminés ou remplacés par des items originaux (R3) — zéro licence au MVP |

---

## 5. Journal de mise à jour

| Date | Quête(s) | Événement | Vérification |
|---|---|---|---|
| 2026-10-10 | 1.1, 1.2, 1.3, 2.1, 2.2, 5.6, 8.1 | Création du registre — audit complet de provenance formalisé (`docs/AUDIT-PROVENANCE-TESTS.md`) ; comparaison indépendante items vs instruments : aucun verbatim, aucun calque | Sweep code (noms d'auteurs, marques, sigles, phrasées distinctifs) : zéro occurrence réelle |
| 2026-10-10 | 4.4 (M5), 1.8 (Phase 3) | Décisions consignées : 4.4 = Option B items originaux (YSQ en plan B) ; 1.8 = PHQ-9 domaine public, non construite | — |
| 2026-10-10 | **4.1, 4.2, 4.3, 4.4 (Monde 5 « Ton Héritage »)** | CONCEPTION → LIVRAISON : monde construit depuis les livrables gelés M5 (graines 241427/242427 verbatim, 6/6 contraintes PASS) ; 4.1 (Bowen/Boszormenyi-Nagy — items originaux + génogramme non scoré) · 4.2 (Bonanno/Field — items originaux + ouverte jamais rendue) · 4.3 (page d'écoute, aucune carte) · 4.4 INVISIBLE (Option B — 10 trames hors dépôt hébergées chez 4.1/4.2, règle 11-b) ; verrou rendu vérifié (zéro nom d'auteur, zéro sigle) | Sweep rg borné sur apps/web/src : zéro occurrence réelle (faux positifs connus : spontaneous/agendas/prison) |
| 2026-10-10 | **5.1, 5.2, 5.3, 5.7 (Monde 6 « Mon Cœur »)** | CONCEPTION → LIVRAISON : monde construit depuis les livrables gelés M6 (graines 251427/252427/253427/257427 verbatim, 6/6 contraintes PASS) ; 5.1 (typologie des styles — noms d'atelier/auteur interdits au rendu) · 5.2 (croyances romantiques — auteures/échelle hors rendu, slot probabiliste sans verdict) · 5.3 (canaux d'expression — marque déposée ZÉRO occurrence, JAMAIS DANS LE SCORE) · 5.7 (styles d'humour — libre avec citation, citation tenue interne, SIG-5.7-02 moteur seul non calculé) ; verrou rendu vérifié par rg (mots entiers) | Sweep rg borné sur apps/web/src + scripts de parité FR/EN des agents ; zéro nom d'auteur/typologie/marque rendu |

> **Prochaine mise à jour obligatoire** : à chaque conception de nouvelle quête (§0) — en particulier M5-4.4 et 1.8 avant leur construction.

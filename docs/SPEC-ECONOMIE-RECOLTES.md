# SPEC — L'économie des récoltes WAIRYU au service de la rencontre

**Version :** v1 (brouillon fusionné — **à valider par le fondateur avant tout chantier**)
**Sources :** proposition « L'économie des récoltes WAIRYU » + « Suggestions Malife+ » (fusionnées, collisions résolues) + avis Task 82 (corrections).
**Portée :** DESIGN UNIQUEMENT. Aucune implémentation lancée, aucune modification de code, prod inchangée (40e8f425).
**Garde-fou constitutionnel, valable pour TOUT ce document :** jamais un score, jamais un achat de compatibilité, la Rencontre n'est jamais payante, rien ne se montre sans consentement, le voyage reste à ton rythme.

---

## §0. Décisions gravées (issu de la revue Task 82)

| # | Décision | Règle retenue |
|---|---|---|
| D1 | **Filtres forts** | Actifs **dès la complétion de la quête** qui les porte (2.3, 2.4, 2.5, 2.7, 4.2) — PAS au Jalon 4. Verrouiller un non-négociable déclaré derrière un jalon ferait ignorer la parole du membre. Le Jalon 4 débloque les *explications profondes*, pas les filtres. |
| D2 | **Portrait jamais payant** | Le Portrait Intégral (et son PDF) est gratuit — c'est l'histoire du membre sur ses propres réponses. Monétisation uniquement sur les *actions de rencontre* (Éclat, Clairière, événements…). |
| D3 | **Info-bulles par RÔLE** | 5 copies (une par rôle), nom de carte interpolé. Jamais 129 rédactions. |
| D4 | **Météo (1.9) gratuite** | Rafraîchissement gratuit avec délai anti-abus. Faire payer une re-réponse psychologique est contraire à l'éthique du voyage. |
| D5 | **Pas de streak quotidien** | Récompense de retour hebdomadaire douce. Le voyage est « à ton rythme ». |
| D6 | **Crédits « gagnés seulement »** au lancement | Aucun achat tant que les paiements ne sont pas ouverts ; l'économie se calibre sans risque. |
| D7 | **Vocabulaire canonique unique** | Ce glossaire fait foi. Les collisions entre les deux propositions sont résolues (§2, table des refus/fusions). |
| D8 | **Moteur sur les dimensions, cartes en explication** | Le matching calcule sur les dims structurées produites par les scorers (déjà là pour les 35 quêtes). Les cartes sont la couche Vitrine/Clés/explication — jamais le calcul. |
| D9 | **Sceau ≠ anti-catfish** | Le sceau prouve un parcours, pas une fiabilité. Jamais de classement psychologique. |
| D10 | **Badge culturel lié à M10** | « Passeur·se culturel·le » sera l'affaire de M10 « Mon Monde » (racines, ancrage) — pas de M5 (histoire relationnelle). |

---

## §1. Les trois familles (présentation de #/recolte)

| Famille | Contenu | Ce qu'elle fait pour le membre |
|---|---|---|
| 🪞 **Connaissance** | Cartes-découverte, Miroirs, Fragments de portrait, Portraits (Monde/Domaine/Intégral), Carnet de rencontre, Clés | Mieux se connaître, partager qui on est, démarrer des conversations |
| 🎟️ **Action** | Pass, Crédits | Utiliser des fonctionnalités concrètes de la plateforme de rencontre |
| ⛰️ **Progression** | Sceaux, Badges (signe, événement), Niveaux du voyage (jalons), Statut « Prêt·e », Récolte du mois | Célébrer le chemin, débloquer des possibilités — jamais une note de personnalité |

---

## §2. Glossaire canonique

### 2.1 Les 8 types d'inventaire (existant, inchangé)

| Terme | Famille | Définition | Garde |
|---|---|---|---|
| **Carte-découverte** 🃏 | Connaissance | La réponse du voyage à une question sur toi — nom, lumière, ombre, tension + volet ombre relationnel. 30 quêtes en produisent une (129 variantes). | Ni score ni diagnostic : une tendance mesurée sur tes réponses. |
| **Écran de passage** 🚪 | Progression | Une étape sans carte (1.7, 1.11, 2.8, 3.7, 4.3) — elle produit de la confiance, du statut ou du privé. | Ne juge rien : il fait avancer. |
| **Fragment de portrait** 🧩 | Connaissance | La pièce de portrait gagnée à la clôture d'un monde (1 par monde, 7 aujourd'hui). | Le portrait se lit comme une histoire, jamais une fiche à cocher. |
| **Sceau du monde** 🏅 | Progression | La marque permanente du monde traversé (1 par monde). | Ne s'achète pas, ne se perd pas, ne certifie rien d'une personne. |
| **Pass** 🎟️ | Action | Un droit d'accès à une action précise (5 passes définis en §2.4). | N'achète jamais une meilleure compatibilité ; ne neutralise jamais un refus ou un blocage. |
| **Crédits** 🪙 | Action | Unités gagnées en voyageant, dépensées en actions (§2.5). Nom d'ambiance proposé : **les Lucioles** [À VALIDER]. | Jamais échangeables contre compatibilité, réponses privées ou contournement de consentement. |
| **Récolte du mois** 🌕 | Progression | Collection mensuelle à thème saisonnier — carte à thème + crédits bonus. Completable à tout moment du mois, **sans connexion quotidienne**. | Pas d'exclusivité stressante : rater un mois ne coûte rien d'essentiel. |
| **Niveau du voyage (jalon)** ⛰️ | Progression | Les 6 étages de l'échelle (Carte → Miroir → Portrait de Monde → Domaines → Intégral → Rencontre). Débloquent des possibilités, jamais des notes. | Se franchit en voyageant — ne s'achète pas. |

### 2.2 Les usages/features (de nouveaux objets ? Non : des usages des 8 types)

| Terme | S'appuie sur | Définition | Garde |
|---|---|---|---|
| **La Vitrine** | Cartes | Les 3 cartes que le membre choisit d'exposer sur son profil de rencontre. Rotation possible avec la Météo. Contrôle granulaire : qui voit quoi, et quand. | 3 cartes maximum — un profil n'est pas un dossier médical. |
| **Les Clés** | Cartes (rôle Accroche) | 2-3 premières phrases de conversation dérivées des cartes de l'autre, proposées à l'ouverture du profil. **Gratuites.** | Ne garantissent jamais une réponse. L'autre voit l'ouverture, pas les réponses. |
| **Le Duo de cartes** | Cartes (rôle Après-match) | Après un match, si les deux ont complété la même quête : vue côte à côte des deux cartes + une question de dialogue. | Consentement des deux ; outil de dialogue, pas un verdict comparatif. |
| **L'Éclat** | Crédits (10) + Carte | Le « super-like » WAIRYU : signaler son intérêt **avec une carte de l'autre jointe** (« j'ai aimé ta façon de t'attacher »). | Il dit ce que tu as aimé — il n'achète pas l'intérêt de l'autre. |
| **La Clairière** | Crédits (40) | Boost de visibilité 30 minutes. | La visibilité ne garantit jamais un match ; jamais liée à la personnalité. |
| **Les Lanternes** | Crédits (60) ou Pass Lanternes | Voir qui a aimé + filtres avancés de découverte. | ⚠️ Résout la collision « Lanternes de visibilité » de la 2ᵉ proposition → la visibilité temporaire s'appelle **La Clairière**. |
| **Le Coffret** | Crédits (8) | Offrir une carte en chat (1/semaine gratuit). | L'autre choisit de l'accepter ; jamais un contournement de refus. |
| **Lever un voile** | Fragment offert | En mode Invisible : offrir un fragment de son portrait à la personne avec qui on échange — ouvrir une pièce de soi, consentement d'abord. | Le fragment offert ne révèle jamais une réponse brute. |
| **Statut « Prêt·e »** | Écran 1.11 | Badge visible obtenu en franchissant « Es-tu prêt·e à rencontrer ? ». Ouverture de la révélation photo en mode Invisible, accès aux événements. | Toujours révocable ; « pas prêt·e » n'est jamais pénalisé. |
| **Le Carnet de rencontre** | — | Espace personnel : questions repérées, thèmes à aborder, activités à essayer. Le membre choisit ce qu'il en partage. | Privé par défaut. |
| **La Météo** | Carte 1.9 | L'unique carte-état (« La Météo du moment ») : l'élan d'aujourd'hui. Rafraîchissement **gratuit** avec délai. | Zéro poids dans le moteur. |
| **Badge du signe** | Quête 2.8 (jeu) | Badge zodiaque opt-in, hors score, affichable. | 12 signes + « aucun badge » — zéro poids dans le moteur. |
| **Fragments de connexion / Récoltes à deux** | Activités à deux consenties | Récompenses qui n'apparaissent qu'après une activité consentie par les deux (répondre à trois questions, préparer un rendez-vous…). Terre-plein de M11. | Jamais conditionnées à la révélation d'infos sensibles ; jamais une note de la relation. |

### 2.3 Les restitutions (rappel)

| Terme | Définition |
|---|---|
| **Le Miroir** | Le retour « en toutes lettres » des résultats d'une quête (l'écran détaillé derrière chaque carte). |
| **Portrait de Monde / de Domaine / Intégral** | Les jalons 3, 4 et 5 : synthèse d'un monde ; croisements de domaines (dont le Cœur, M6+M7) ; portrait complet 12-18 pages, téléchargeable **gratuitement** (D2). |

### 2.4 Les 5 Pass (droits d'accès — chaque pass affiche ce qu'il permet et combien il en reste)

| Pass | Ouvre quoi | Obtention |
|---|---|---|
| **Pass Lanternes** | Voir qui a aimé + filtres avancés (durée) | Crédits ou abonnement [À VALIDER] |
| **Pass Événement** | Accès à un événement précis | Crédits, sceaux requis ou jalon ≥ 2 |
| **Pass Culturel** | Session thématique interculturelle (mode Culturel) | Crédits ou gratuit selon l'événement |
| **Pass de révélation** | Proposer la révélation mutuelle (mode Invisible) — ⚠️ absorbe « Clé de révélation » de la 2ᵉ proposition | Consentement RÉCIPROQUE requis ; la proposition de révélation est gratuite, le pass ouvre le cadre |
| **Pass Portrait** | Formats enrichis du Portrait Intégral (le PDF standard reste gratuit — D2) | Gratuit au Jalon 5 |

### 2.5 L'économie des crédits (les Lucioles) [MONTANTS = POINT DE DÉPART, À CALIBRER]

**Gagner :** quête terminée +10 · écran de passage franchi +5 · monde clôturé +50 · jalon atteint +100 · récolte du mois +40 · retour hebdomadaire au voyage +15 (remplace le streak — D5) · Duo créé après match +10 · participation à un événement +25.

**Dépenser :**

| Usage | Nom d'ambiance | Coût |
|---|---|---|
| Éclat avec carte jointe | **L'Éclat** | 10 |
| Boost visibilité 30 min | **La Clairière** | 40 |
| Voir qui a aimé (à l'unité) | **Les Lanternes** | 60 |
| Offrir une carte en chat | **Le Coffret** | 8 |
| Activité guidée à deux (absorbe « Jetons de proximité ») | — | [À VALIDER] |
| Météo — rafraîchissement anticipé | — | **GRATUIT** avec délai (D4) |

**Refusé :** « Le Chemin inverse » (annuler un passe) — mécanique à risque de consentement, reportée sine die ; tout achat de compatibilité.

---

## §3. Les 5 rôles de carte (le champ `role_matching`)

Un champ par carte (30 cartes). Le moteur calcule sur les **dimensions des scorers** (D8) ; le rôle décide **comment** le signal est utilisé et **où** la carte apparaît. Un rôle secondaire est possible.

| Rôle | Ce qu'il fait dans le moteur | Règle d'affichage | Garde |
|---|---|---|---|
| **Filtre fort** | Exclut les profils qui violent ce que le membre a déclaré — en silence. | Toggle visible « vos non-négociables filtrent vos rencontres » ; jamais de score, jamais de liste des exclus. | Il applique la parole du membre, rien de plus ; les filtrés ne sont ni notés ni jugés. |
| **Filtre souple** | Ordonne/déclasse le tri (les grands accords montent, les grands écarts descendent). | Indicateur explicable : « 4 valeurs communes », « attentes concordantes », « sujet important à discuter ». | Jamais un pourcentage ni une probabilité de réussite. |
| **Chimie du quotidien** | Alimente un tri qualitatif : « vos jours risquent de bien s'imbriquer ». | Phrase claire dans les résultats de découverte. | Une tendance, pas une promesse, pas une note. |
| **Accroche** | Génère les Clés (premières phrases) et la matière de l'Éclat. | Visible en Vitrine si le membre la choisit. | Ne garantit jamais une réponse. |
| **Après-match** | S'ouvre au match : Duo de cartes, question de dialogue, compréhension mutuelle. | Invisible avant le match (sauf choix explicite en Vitrine). | Rien ne se montre à l'autre sans toi. |
| **État / jeu** | Zéro poids dans le moteur. | Signal du moment (Météo), badge fun (signe). | Éphémère, jamais comparatif. |

---

## §4. Tableau carte-par-carte des rôles

### Monde 1 — Le Miroir 🪞

| Quête | Carte (variantes) | Rôle | Secondaire | Note |
|---|---|---|---|---|
| 1.1 Ta personnalité | 7 (L'Élan chaleureux, Le·La Bâtisseur·se, L'Étoile sociale, L'Ancre, L'Intense, L'Indépendant·e profond·e, L'Équilibriste) | **Chimie du quotidien** | Accroche | Les dims OCEAN sont le socle du moteur. |
| 1.2 Ta façon de t'attacher | 5 (L'Ancrage, La Vigie, L'Autonome, Le Va-et-vient, L'Équilibre en mouvement) | **Après-match** | — | Intime par nature : jamais en Vitrine par défaut. |
| 1.3 Tes émotions | 6 (La Clarté intérieure, Le Volcan tendre, Le Réservoir, Le Radiateur, La Réserve, L'Apprenti·e) | **Après-match** | Chimie | |

### Monde 2 — Le Volant 🛞

| Quête | Carte (variantes) | Rôle | Secondaire | Note |
|---|---|---|---|---|
| 1.4 Ton contrôle sur toi-même | 5 (L'Artisan·e, Le Juste-Milieu assumé, Le·La Vivant·e, Le·La Cédant·e de bonne foi, L'Immédiat) | **Chimie du quotidien** | Après-match | |
| 1.5 L'épreuve du temps | 5 (Le·La Main qui cueille, Le·La Vague qui frappe, Le·La Funambule du temps, Le·La Jardinier·se des saisons, Le·La Vin qui se garde) | **Chimie du quotidien** | — | Impulsion/patience au quotidien. |
| 1.6 Ta façon de penser | 5 (L'Horloger·ère, Le Flair, Le Flair qui vérifie, Le·La Prudent·e, Les Deux Mains) | **Chimie du quotidien** | Accroche | |
| 1.9 Ton élan du moment | 1 (La Météo du moment) | **État / jeu** | — | La Météo — rafraîchissement gratuit avec délai (D4). |
| 1.10 Ce que tu apportes | 3 (La Balise, L'Échelle, La Rocade) | **Accroche** | Chimie | |
*Écrans : 1.7 « Ton fonctionnement (optionnel) » = confiance, jamais public ; 1.11 « Es-tu prêt·e à rencontrer ? » = **Statut « Prêt·e »**.*

### Monde 3 — La Boussole 🧭

| Quête | Carte (variantes) | Rôle | Secondaire | Note |
|---|---|---|---|---|
| 2.1 Tes valeurs | 8 (Le·La Passeur·se d'horizons, Le·La Collectionneur·se de commencements, Le·La Bâtisseur·se de ponts, Le·La Ventouse à projets, L'Ancre qui regarde ailleurs, L'Enraciné·e vigilant·e, L'Aiguilleur·se du cœur, Le·La Phare qui s'oublie) | **Filtre souple** | Accroche | Les grands accords de valeurs ordonnent le tri. |
| 2.2 Ta place pour la spiritualité | 3 (Le·La Cloche qui marque les jours, Le·La Fête des saisons, Le·La Clairière ouverte) | **Filtre souple** | — | Filtre actif seulement si le membre le coche. |
| 2.3 Tes non-négociables | 3 (Le·La Confiant·e dans le flou, Le·La Bâtisseur·se de frontières, Le·La Forteresse) | **Filtre FORT** | — | Le cœur des dealbreakers — actif dès complétion (D1). |
| 2.4 Tes réalités | 2 (Le·La Franc·e-jeu, L'Énigmatique) | **Filtre FORT** | — | Faits de vie déclarés. |
| 2.5 Ce que tu cherches | 4 (Le·La Cœur qui choisit, Le·La Curieux·se sans carte, Le·La Libre honnête, Le·La Brouillon·ne de soi) | **Filtre FORT (croisé)** | Accroche | Matche des *intentions compatibles*, pas identiques. |
| 2.6 Tes priorités 5 ans | 4 (Le·La Grue qui monte, Le·La Nid en chantier, Le·La Maison aux cinq pièces, Le·La Compas qui pointe l'horizon) | **Filtre souple** | Accroche | |
| 2.7 Ta vision de la famille | 3 (Le·La Berceau qui attend, Le·La Porte entrouverte, Le·La Route à deux) | **Filtre FORT** | — | Désir d'enfants = filtre dur classique — actif dès complétion (D1). |
*Écran : 2.8 « Ton signe » = **Badge du signe** (jeu opt-in, hors score, pas de carte).*

### Monde 4 — Ton Terrain 🏕️

| Quête | Carte (variantes) | Rôle | Secondaire | Note |
|---|---|---|---|---|
| 3.1 Ton rythme de vie | 3 (Le·La Premier train, Le·La Marée entre deux heures, Le·La Lampe de minuit) | **Chimie du quotidien** | — | Aurore/hibou. |
| 3.2 Ton quotidien | 5 (Le·La Cadran bien réglé, Le·La Calépin et le flot, Le·La Porte qui suit le vent, Le·La Voile au vent, Le·La Marée des jours) | **Chimie du quotidien** | — | |
| 3.3 Ton temps libre | 3 (Le·La Grand air, Le·La Rive du milieu, Le·La Cheminée allumée) | **Chimie du quotidien** | Accroche | Activités communes. |
| 3.4 Ton rapport à l'argent | 5 (Le·La Cœur qui paie, Le·La Collectionneur raisonné, Le·La Flair du futé, Le·La Maison bien tenue, Le·La Marée des mois) | **Chimie du quotidien** | — | |
| 3.5 Ton entourage | 3 (Le·La Table élargie, Le·La Rive des deux camps, Le·La Territoire gardé) | **Chimie du quotidien** | Après-match | |
| 3.6 Le choix visuel | 3 (Le·La Portefeuille d'images posées, Le·La Trousse d'images variées, Le·La Portefeuille d'images ouvertes) | **Accroche** | Chimie | Les images donnent matière à parler. |
*Écran : 3.7 « Tes attirances » = privé pour toujours ; le moteur peut l'utiliser en silence (compatibilité d'attirance), jamais aucun affichage.*

### Monde 5 — Ton Héritage 🌳

| Quête | Carte (variantes) | Rôle | Secondaire | Note |
|---|---|---|---|---|
| 4.1 Ton arbre relationnel | 5 (Le·La Table où ça se dit, Le·La Rôle dans la lumière, Le·La Lecteur de silences, Le·La Place héritée, Le·La Selon la table) | **Après-match** | Accroche (mode Culturel) | Matière au Pont culturel de la 2ᵉ proposition. |
| 4.2 Où tu en es aujourd'hui | 3 (Le·La Chapitre refermé, Le·La Page qui tourne, Le·La Maison en travaux) | **Filtre FORT (disponibilité)** | — | Ce que la personne déclare être son maintenant. |
*Écrans : 4.3 « Ce que tes relations t'ont appris » = Carnet de rencontre (privé) ; 4.4 « Blessures et aisance » = invisible, tissée dans 4.1/4.2, aucune récolte propre.*

### Monde 6 — Mon Cœur 💗

| Quête | Carte (variantes) | Rôle | Secondaire | Note |
|---|---|---|---|---|
| 5.1 Ton style amoureux | 7 (Le·La Flamme, Le·La Partie, Le·La Route longue, Le·La Boussole, Le·La Vigie, Le·La Port, Le·La Palette) | **Accroche** | Après-match | Parlant en Vitrine. |
| 5.2 Ta vision de l'amour | 4 (L'amour écrit d'avance, L'amour qui frappe, L'amour unique, L'amour en potentiel) | **Filtre souple** | Accroche | Attentes relationnelles. |
| 5.3 Comment tu exprimes ton affection | 6 (Le·La Mot qui porte, Le·La Temps posé, Le·La Geste qui dit, Le·La Détail juste, Le·La Peau qui parle, Le·La Écoute large) | **Chimie du quotidien** | Accroche | Les langages du quotidien à deux. |
| 5.7 Ton humour | 4 (Le·La Rire qui rapproche, Le·La Rire qui dédramatise, Le·La Rire qui blesse, Le·La Rire qui s'auto-rabaisse) | **Accroche** | — | La carte partageable — matière Éclat/Coffret. |

### Monde 7 — Face aux Tempêtes 🌊

| Quête | Carte (variantes) | Rôle | Secondaire | Note |
|---|---|---|---|---|
| 5.4 Face aux désaccords | 7 (Le·La Gouvernail, Le·La Atelier, Le·La Passerelle, Le·La Pause, Le·La Passage, Le·La Duo, Le·La Équilibre) | **Après-match** | — | |
| 5.5 Quand la tension monte | 4 (La tension qui parle fort, qui se mure, qui attend son heure, qui descend) | **Après-match** | — | Le Duo de cartes vedette. |
| 5.6 Après un désaccord | 3 (La réparation qui tient, La réparation qui se travaille, La réparation silencieuse) | **Après-match** | — | |

### Comptage des rôles (30 cartes)

**Filtre fort : 5** (2.3, 2.4, 2.5, 2.7, 4.2) · **Filtre souple : 4** (2.1, 2.2, 2.6, 5.2) · **Chimie du quotidien : 10** (1.1, 1.4, 1.5, 1.6, 3.1, 3.2, 3.3, 3.4, 3.5, 5.3) · **Accroche : 4** (1.10, 3.6, 5.1, 5.7) · **Après-match : 6** (1.2, 1.3, 4.1, 5.4, 5.5, 5.6) · **État/jeu : 1** (1.9).

### Échelle des jalons (ladder v1 — [À VALIDER])

| Jalon | Débloque dans la rencontre |
|---|---|
| 1. La Carte | Découverte de base, profil standard, **filtres forts déjà actifs pour les quêtes complétées** (D1) |
| 2. Le Miroir | Vitrine (3 cartes) + Clés + filtres de base |
| 3. Portrait de Monde | Indicateurs de chimie visibles + M6/M7 gratuits (fossé compétitif) |
| 4. Portraits de Domaine | Explications profondes post-match + Duo de cartes |
| 5. Portrait Intégral | Badge « Voyage accompli » + Pass Portrait + priorité événements |
| 6. La Rencontre | Mode Événement complet — la Rencontre n'est jamais payante (M11 débloqué au premier match) |

---

## §5. Les 5 info-bulles (copies officielles — interpolation `{{carte}}` = nom de la carte)

> Ces 5 copies REMPLACENT le texte générique « carte » de InfoRecolte pour les cartes-découverte. Les autres types (écran, fragment, sceau, pass, crédit) gardent leurs copies existantes. Structure identique au registre InfoRecolte : intro · points · garde.

### 1. Filtre fort / Filtre souple — « Carte-frontière »
**FR**
- *Intro :* « Cette carte porte ce qui ne se négocie pas chez toi. »
- *Points :* « Dès que tu l'as obtenue, elle travaille tes filtres selon ce que tu as déclaré — en silence, sans note et sans classement. » · « Tu vois à tout moment qu'elle est active, et tu peux relâcher ou resserrer quand tu veux. »
- *Garde :* « Elle applique TA parole, rien de plus : les personnes filtrées ne sont ni notées ni jugées. »

**EN — Boundary card**
- *Intro :* « This card carries what is non-negotiable for you. »
- *Points :* « Once earned, it quietly works your filters based on what you declared — no scores, no rankings. » · « You can see whenever it is active, and loosen or tighten it anytime. »
- *Garde :* « It applies YOUR word, nothing more: filtered people are neither rated nor judged. »

### 2. Chimie du quotidien — « Carte-quotidien »
**FR**
- *Intro :* « Cette carte parle de tes jours avec quelqu'un. »
- *Points :* « Elle aide à repérer les personnes avec qui le quotidien risque de bien s'imbriquer : rythmes, habitudes, façons de donner et de recevoir. » · « Dans tes résultats, elle devient une phrase claire — jamais un pourcentage. »
- *Garde :* « Une tendance tirée de tes réponses — pas une promesse, pas une note. »

**EN — Everyday card**
- *Intro :* « This card is about your days with someone. »
- *Points :* « It helps spot the people your daily life may click with: rhythms, habits, ways of giving and receiving. » · « In your results it becomes a plain sentence — never a percentage. »
- *Garde :* « A tendency drawn from your answers — not a promise, not a grade. »

### 3. Accroche — « Carte-ouverture »
**FR**
- *Intro :* « Cette carte donne de quoi commencer. »
- *Points :* « Elle propose des premières phrases vraies, tirées de ce que tu es — pour ouvrir la conversation autrement que par "salut, ça va ?". » · « L'autre voit l'ouverture, pas tes réponses complètes. »
- *Garde :* « Elle ne garantit jamais une réponse : elle donne une belle façon de commencer, rien de plus. »

**EN — Opening card**
- *Intro :* « This card gives you somewhere to start. »
- *Points :* « It offers true opening lines drawn from who you are — a better start than "hey, how are you?". » · « The other person sees the opening, not your full answers. »
- *Garde :* « It never guarantees a reply: it offers a good way to begin, nothing more. »

### 4. Après-match — « Carte-deux »
**FR**
- *Intro :* « Cette carte s'ouvre à deux. »
- *Points :* « Après un match, elle met vos réponses en regard — la tension, la réparation, la façon d'aimer — pour comprendre au lieu de deviner. » · « Une question de dialogue l'accompagne, prête à poser. »
- *Garde :* « Rien ne se montre à l'autre sans toi. C'est un outil de dialogue, pas un verdict sur l'un ou l'autre. »

**EN — Together card**
- *Intro :* « This card opens for two. »
- *Points :* « After a match, it puts your answers side by side — tension, repair, ways of loving — to understand instead of guessing. » · « A dialogue question comes with it, ready to ask. »
- *Garde :* « Nothing is shown to the other without you. It is a dialogue tool, not a verdict on either of you. »

### 5. État / jeu — « Carte-météo »
**FR**
- *Intro :* « Cette carte vit au présent. »
- *Points :* « Elle dit où tu en es en ce moment — ton élan, ta météo intérieure. Elle change avec toi, quand tu décides de la rafraîchir. » · « Elle peut rejoindre ta Vitrine comme signal du moment. »
- *Garde :* « Elle ne pèse jamais dans tes rencontres : zéro poids dans le moteur. »

**EN — Weather card**
- *Intro :* « This card lives in the present. »
- *Points :* « It says where you are right now — your momentum, your inner weather. It changes with you, whenever you choose to refresh it. » · « It can join your Showcase as a signal of the moment. »
- *Garde :* « It never weighs into your encounters: zero weight in the engine. »

---

## §6. Ce que cette spec NE change PAS

- **Les tests/outils/questionnaires** (items, verbatim, écrans de passation) — règle permanente : intouchables. Le champ `role_matching` est une couche lecture, jamais une retouche de passation ni de scoring.
- **Les réponses privées** : 3.7 (attirances), M8, M9 restent hors de tout affichage public, par conception.
- **La prod** : inchangée (40e8f425). Monétisation toujours éteinte ; les crédits naîtront « gagnés seulement » (D6).
- **M8-M11** : les récoltes promises restent telles que documentées (synthèses chiffrées M8, signal de divergences M9, ancrage M10, cartes de dialogue M11).

## §7. Prochaines étapes (après GO fondateur)

1. **Chantier 1 — le socle (des jours) :** champ `role_matching` (§4) + 3 familles dans #/recolte + 5 info-bulles par rôle (§5).
2. **Chantier 2 — la rencontre :** indicateurs explicables (filtre souple, chimie) sur les dims existantes + Vitrine + Clés + Éclat.
3. **Chantier 3 — l'économie :** crédits gagnés (sans achat), Coffret, Clairière, Lanternes.
4. **Chantier 4 :** M10 « Mon Monde » (brique du mode Culturel, badge culturel — D10).
5. **Chantier 5 :** mode Invisible complet (Lever un voile, Pass de révélation) puis Événements.

**[À VALIDER] par le fondateur :** nom « Lucioles » pour les crédits · montants de l'économie (§2.5) · coût de l'activité guidée à deux · contenu exact du Jalon 3 (M6/M7 gratuits) · le ladder §4 · les 5 copies FR/EN (§5) · les rôles carte-par-carte (§4).

# QUÊTE 5.5 « QUAND LA TENSION MONTE » — FICHE DE CADRAGE PUIS LECTURE DU LIVRABLE

> Monde M7 « Face aux Tempêtes » · 💎 **PREMIUM** (statut_freemium : premium) · Phase **P1.5** ·
> Accès **Libre** (pas d'opt-in) au sein du territoire premium
> 8 items Likert · Codes gelés Q5.5-01 → Q5.5-08 · **4 profils d'expression de la tension × 2 items —
> 4 paires R6** (01×02 · 03×04 · 05×06 · 07×08)
> **AUCUNE trame dans cette quête** : zéro signal ▲, zéro position réservée, zéro contenu signal au
> dossier — le **DGR est un CROISEMENT, pas une trame** (5.5 n'héberge rien ; il alimente le croisement
> moteur). Décision comité : ne JAMAIS réinventer les trames perdues T01-T42 — document trames hors dépôt.
> Source : Constitution v2.1 [2] [3] [6] [7] · refonte gelée l. 680-717 (LE cadre complet : les 4 profils
> + les croisements documentés) · l. 1991 (table MONDE 5 : « 5.5 — 8 items — Ton profil : j'explose /
> me ferme / parle à froid / sombre — Croisement volatil × impulsivité → DGR — P1.5 ») · l. 2059 (trame
> DGR tissée en 1.4, 1.5, 3.4, 5.5) · mission V12-b (enregistrements du worklog Task 21/22)
> B.3 : **production neuve déclarée** — angles cadrés par la refonte gelée, énoncés/textes 100 % Wairyu,
> aucun texte hérité (aucune production antérieure de M7 au dépôt).

## 🧭 FICHE DE CADRAGE (lire avant tout le reste)

| Champ | Cadrage |
|---|---|
| **Ce que ça mesure** | Le **profil d'expression de la tension** (concept public et libre — refonte l. 698-704) : la façon dont la tension **sort de toi** envers l'autre. Quatre profils gelés : **tu exploses** (colère verbalisée, élevée) · **tu te fermes** (froideur, silence, mur) · **tu verbalises à froid** (tu reviens en parler calmement) · **tu sombres** (repli, tristesse, somatisation rendue « le corps qui suit »). Les typologies d'expression de la colère et le pattern de poursuite-retrait restent **hors rendu** : noms de sources et nom anglais du pattern INTERDITS partout — ils ne vivent que dans les fichiers moteur (01, 03, 06) comme référence scientifique. |
| **LA DOCTRINE DES TEMPÉRATURES (gelée)** | **AUCUNE hiérarchie entre profils** — l'explosif n'est pas « pire » que le fermé : ce sont des **températures** différentes. Gravée au présent 00 et au 04 (verrous), et **faite vivre au miroir** : chaque profil a sa lumière pleine et son ombre en couple ; le miroir ne classe pas, ne corrige pas, ne félicite pas la moindre température. La tension commune (gelée) est portée dans les 4 variantes : **« la tension monte chez tout le monde — la question n'est pas si, c'est comment et à quel prix »** — reformulée par profil, au registre probabiliste, sans absolu. |
| **Format de réponse** | Likert 5 niveaux · D/I recodés `6 − r` · **4 paires R6 complètes** (01×02 · 03×04 · 05×06 · 07×08 — une par profil) · équilibre d'orientations **4 D / 4 I** — documenté au 01. |
| **SIG-5.5-01 « Ta température »** | **Lecture affichée** : profil dominant = max des 4 moyennes (EXPLOSIF · FERME · VERBALISE · SOMBRE — I recodés 6−r, normalisés 0-1) ; ex æquo strict → départage à la **1ʳᵉ position de passation** (conventions SIG-5.2-01, proposition — comité). **4 sorties** : un miroir + une carte par température dominante. Rendu conversationnel — jamais un verdict, jamais une correction de réaction. |
| **SIG-5.5-02 « Le cycle poursuite-retrait »** | **[MOTEUR SEUL]** — croisement **explosif × fermé CÔTÉ MATCHING** (le plus destructeur documenté — refonte l. 704) : l'un cherche la réparation par la parole dans la montée, l'autre protège par le retrait, et la boucle s'alimente elle-même. **JAMAIS au rendu** : aucun texte, aucun badge, aucun score affiché, aucune exclusion de match. Seuils et poids : **« À VALIDER PAR LE COMITÉ »** (provisoire concepteur). Le nom du pattern n'existe **jamais en anglais** ; le nom français ne franchit pas le rendu. |
| **SIG-5.5-03 « La dangerosité réactive (DGR composée) »** | **[MOTEUR SEUL]** — composante **explosive (5.5) × impulsivité (Monde 1, quêtes 1.4 / 3.4)** = **DGR** (dictionnaire [4] : impulsivité × instabilité ; trame tissée en 1.4, 1.5, 3.4, 5.5 — refonte l. 2059). **Aucune restitution, aucun badge, aucun score exposé** — le contenu de ce croisement ne franchit JAMAIS le rendu, l'UI ou le match affiché. Condition et poids : **« À VALIDER PAR LE COMITÉ »**. |
| **Mélange** | Graine **255427** (210427 + 1000 × ordinal 45 — règle de décade : (5−1)×10+5, zéro collision vérifiée machine sur les 24 configs du dépôt) · outil **générique** `melange.py` · **config canonique `ci/quetes/5.5.json` : À CRÉER par la session principale** (structure déclarée au 02) · course de contrôle documentée au 02 (sonde hors dépôt, structure gelée) · **c2/c3 sans-objet** (zéro trame hébergée). |
| **Slots prévus** | Miroir **MOYEN** (150-250 mots/variante — conforme [7] : 8 items → MOYEN ; calibre mission identique, zéro divergence de gabarit) · **4 profils** : un par température dominante · 4 cartes (étage 1). |
| **Points de doctrine** | ① Aucune température ne se corrige : le rendu donne des mots, jamais une thérapie de la réaction. ② Le secondaire (2ᵉ température) nuance en conversation, il ne produit jamais un deuxième portrait. ③ Premium [6] : zéro présupposition des mondes gratuits, zéro teaser — les rappels s'ancrent aux réponses de CETTE quête, aux énoncés D uniquement (règle d'ancrage : citer un énoncé I au score haut serait une fausse citation). ④ Aucune trame : 5.5 n'héberge AUCUN signal ▲ ; les croisements 02/03 sont des LECTURES du score, pas des items. |

## ⚖️ ARBITRAGES CONSIGNÉS (propositions — À VALIDER PAR LE COMITÉ)

1. **Gabarit du miroir** : [7] lit MOYEN (8-14 items → 150-250 mots) et la mission V12-b
   calibre 5.5 en **MOYEN (150-250)** — convergence, zéro divergence (fenêtre de garde 150-250).
2. **Statut** : le refonte (l. 1991) marque « Libre » — lecture V12 : l'**accès** est libre
   (pas d'opt-in) et le monde M7 reste 💎 PREMIUM (Constitution [6]). Consigné au 00 et au README.
3. **Départage en ex æquo strict** : la température dont un item occupe la 1ʳᵉ position de
   passation l'emporte (convention SIG-5.2-01) — proposition, comité.
4. **Deux croisements, zéro rendu** : SIG-5.5-02 et SIG-5.5-03 sont documentés **codes seuls**
   (aucun seuil inventé au-delà de la marque « À VALIDER PAR LE COMITÉ ») — le rendu les ignore
   structurellement (le miroir ne connaît pas l'autre personne).
5. **La tension commune** (« la question n'est pas si, c'est comment et à quel prix ») est
   traitée en **matière gelée** : elle ouvre chaque tension de profil, reformulée au registre
   probabiliste — zéro absolu (« chez tout le monde » reste une posture d'accueil, pas un diagnostic
   de population).

## 🚫 INTERDITS SPÉCIFIQUES (liste fermée, vérifiable machine)

- **Zéro hiérarchie des températures** au rendu : « pire », « mieux », « plus sain », « mature »,
  « problème », « défaut », « faute » appliqués à un profil — interdits (05, 07, cartes, écrans).
- **Zéro pathologisation de l'explosif** : « agressif », « violent », « violence », « toxique »,
  « pathologique », tout suffixe clinique — interdits au rendu.
- **Zéro traitement du silence en défaut absolu** : le fermé n'est ni « passif », ni « évitant »
  comme reproche, ni « fuyant » — le silence est décrit comme une garde, jamais une faute.
- **Zéro nom du pattern en anglais** (« pursue », « withdraw », « demand-withdraw », « stonewalling »,
  « four horsemen ») — à aucun étage, y compris les fichiers moteur ; le nom français du cycle ne
  franchit jamais le rendu.
- **« Somatisation » au rendu UI : interdit** — dire « le corps qui suit » (le terme clinique ne
  vit que dans les fichiers moteur 00/01/03/06 comme référence).
- « toujours » / « jamais » au rendu (07 + cartes) · tout diagnostic ou suffixe clinique · toute
  correction de réaction (« en réalité », « la vérité c'est que ») · tout verdict sur la vie
  amoureuse de l'utilisateur · tout teaser ou présupposition des mondes gratuits · toute
  métadonnée visible (scores, codes, identifiants de signaux) au rendu.

## 🔒 VERROUS

- Ombre ≥ lumière sur les 4 profils du miroir et les 4 cartes.
- Doctrine des températures : zéro hiérarchie au rendu — le miroir décrit des chemins, jamais
  un classement.
- SIG-5.5-02 et SIG-5.5-03 : **[MOTEUR SEUL]** — marque obligatoire partout où elles sont
  documentées (00, 01, 03, 04, 06, 07, cartes) ; INVISIBLES au rendu.
- Rappels ancrés aux énoncés **D** de CETTE quête uniquement (Q5.5-01 · 03 · 05 · 07).
- Aucune trame : zéro contenu signal ▲ dans tout le dossier — T01-T42 et T43-T50 ne vivent
  pas ici (5.5 n'est pas l'hôte des trames 5.4).
- Registre probabiliste obligatoire au rendu ; zéro « toujours/jamais » au texte rendu ;
  zéro futur certain.

## 📖 Lecture des fichiers (ordre conseillé)

1. `01-tableau-des-items.md` — les 8 énoncés (D/I, 4 profils) + usage moteur + décisions de composition.
2. `02-plan-de-melange-graine-255427.md` — graine dérivée, faisabilité c1-c6, course de contrôle.
3. `03-signatures-registre.md` — SIG-5.5-01/02/03.
4. `04-slots-de-miroir.md` — le miroir MOYEN « Ta température » (4 profils) et ses verrous.
5. `05-ecran-d-intro.md` — l'écran d'entrée (ton premium, zéro teaser).
6. `06-fiche-computation-EXEMPLE.yaml` — l'item Q5.5-01 aux 5 canaux.
7. `07-miroir.md` — 4 profils respectés (gabarit MOYEN 150-250 mots).
8. `cartes.yaml` — 4 variantes de carte (étage 1, charte C1-C11).

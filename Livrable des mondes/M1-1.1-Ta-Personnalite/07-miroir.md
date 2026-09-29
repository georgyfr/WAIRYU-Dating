# LIVRABLE 7 — MIROIR DE QUÊTE (ÉTAGE 2) — QUÊTE 1.1 « TA PERSONNALITÉ »

> **Format : briques paramétrées standard v2 · LOURD (58 items ≥ 15) → 300-450 mots/variante (Constitution [7])**
> Livrable de production du MIROIR DE QUÊTE (étage 2) de la quête 1.1. Les textes des briques (§1) sont destinés au rendu utilisateur ; les sections §0, §2, §3, §4, §5 sont côté moteur. Aucun fichier existant (00→06) n'est modifié.

---

## 0 — Champ de saillance

**Règle de saillance (moteur — jamais affichée).** Par profil, le moteur classe les 5 dimensions de la quête — ouverture, organisation, énergie sociale, bienveillance, stabilité émotionnelle — et sélectionne les 4-6 dimensions LES PLUS SAILLANTES (saillance forte > 0.70 côté moteur, jamais rendue). Chaque dimension retenue reçoit sa brique du §1 selon son niveau (élevé / faible) et sa texture (A ou B). Les autres dimensions restent au rendu synthétique (GAB-MR-11-SYNT ci-dessous). Les 20 briques du §1 couvrent la grille complète (5 dimensions × 2 niveaux × 2 variantes) ; le moteur n'en rend qu'un sous-ensemble — jamais la grille entière à un seul profil.

**GAB-MR-11-SYNT — gabarit synthétique (dimensions non saillantes).** 2-3 phrases paramétrées. Slots : {dim} (nom de dimension en toutes lettres) · {pct} (descriptif, calculé sur le pool vivant, jamais normatif — formulation d'affichage type « la plupart des membres hésitent ici »).

Rendu (texte du gabarit) :

> Sur {dim}, rien dans tes réponses ne demande la parole aujourd'hui. La plupart des membres hésitent ici ({pct}) — cette dimension bouge selon les semaines, et elle n'a rien de pressant à cette lecture. Elle reste lisible sur ta carte, et elle reprendra la parole si tes réponses la réveillent.

Contraintes du gabarit : descriptif seulement · aucune comparaison normative · aucun seuil affiché · aucune promesse · le {pct} reste une position dans le pool vivant, jamais un rang.

---
## 1 — Les 20 briques (5 dimensions × 2 niveaux × 2 variantes)

> Dimensions : **Ouverture** · **Organisation** · **Énergie sociale** · **Bienveillance** · **Stabilité émotionnelle**. Niveaux : élevé / faible. Variantes : **A « par l'exemple »** (ouvre sur une scène concrète de vie à deux) · **B « par le mécanisme »** (ouvre sur le mécanisme psychologique d'abord). Les deux variantes d'un même couple ne sont pas synonymes : deux angles d'entrée, deux exemples, deux citations — pas deux habits pour le même corps. Structure de chaque variante (standard v2, dans cet ordre) : **TA LUMIÈRE** · **→ TON OMBRE (en couple)** · **→ TA TENSION** · **→ LE MINI-RES**. Volume : 300-450 mots/variante · ombre ≥ lumière (Constitution [2] · [7]). Rien n'est « bon » ou « mauvais » : chaque niveau a sa lumière ET son ombre.

### Ouverture — niveau élevé (MR-11-O-ELV-A · MR-11-O-ELV-B)

#### MR-11-O-ELV-A — variante A « par l'exemple »

**TA LUMIÈRE**
Tu as répondu que « Une nouvelle cuisine, un nouveau pays, une nouvelle méthode : je dis oui avant de me poser de questions. » Chez toi, la curiosité ne se décrète pas : elle se voit. Un sujet t'attrape, tu le suis. Une porte s'entrouvre, tu la pousses. Dans un couple, ça garantit une chose simple : la vie à deux ne se referme pas sur le déjà-vu. Tu proposes, tu déplaces, tu fais entrer l'air. La routine peine à s'installer : tu la perces avant qu'elle durcisse. Dans les périodes plates — il y en a, dans toute vie partagée — c'est toi qui trouves la porte de sortie. La personne qui t'aime vit à côté de quelqu'un qui réveille les journées.

**→ TON OMBRE (en couple)**
Le même mécanisme déplace ton attention avant de la rendre. Tu commences beaucoup : le nouveau t'ouvre grand, puis un nouveau nouveau arrive, et l'ancien reste ouvert derrière toi. Un dimanche, tu annonces la bibliothèque à monter. Deux semaines plus tard, les planches attendent dans le couloir — et tu as déjà lu trois pages sur la fabrication d'un instrument. L'autre vit entouré de débuts. Et sur les routines conjugales, ton ennui se lit à l'œil nu. Tu as répondu que « Je m'ennuie vite dans les routines trop calées. » Le même restaurant, le même dimanche, les mêmes conversations — ton regard s'éteint un peu, et la personne en face le voit. À force, ça conduit fréquemment à un partage inégal. Celui qui commence finit rarement, et l'autre hérite des fins — des projets, des cartons, des promesses en attente. La recherche sur les couples documente que ce déséquilibre pèse par sa durée plus que par son ampleur. Le coût pour toi : une liste d'inachevés qui te décrivent à moitié, et le sentiment diffus de courir après ton propre élan. Le coût pour l'autre : vivre dans des chantiers ouverts, et cesser d'attendre de toi autre chose que des débuts.

**→ TA TENSION**
Tu veux du neuf pour nourrir la vie à deux — et le même neuf t'attire hors d'elle. Tes rêves s'écrivent à deux ; tes projets, eux, s'écrivent seul(e).

**→ LE MINI-RES**
- Lumière : ton oui aux idées neuves garde la vie à deux vivante.
- Ombre : tes débuts s'empilent, et l'autre ramasse les fins.
- Mode d'emploi : avant de lancer un projet, nomme à voix haute celui que tu poses. Un entre, un sort — la règle tient toute seule.

#### MR-11-O-ELV-B — variante B « par le mécanisme »

**TA LUMIÈRE**
Le mécanisme d'abord : ton esprit fabrique du neuf à haute vitesse. Tu as répondu que « J'aime les conversations qui partent dans des idées inattendues. » et que « Une idée un peu folle vaut la peine qu'on s'y arrête. » Ce moteur a un effet direct à deux : tu es un lieu de possibles. Là où un problème semblait figé, tu trouves un angle, puis trois. Tu relances les sujets, tu maintiens la pensée commune en mouvement, tu empêches les décisions de pourrir dans leur évidence. Un couple qui réfléchit avec toi ne reste pas seul devant un mur. Tu ouvres des options avant que le mur soit fini.

**→ TON OMBRE (en couple)**
La même fabrique ne s'arrête pas aux projets : elle tourne aussi sur ta propre vie. Tu as répondu que « J'aime imaginer des versions alternatives de ma vie. » En soi, rien à redire. Mais à deux, cette fabrique tourne parfois la nuit. Elle rejoue la vie que tu aurais eue ailleurs : le métier non pris, la ville où tu ne vis pas. Une dispute banale un mardi soir, et la version alternative s'affiche — claire, tentante, sans ton/ta partenaire dedans. Tu n'y crois pas vraiment. Mais l'autre, sans la lire, en subit la fraîcheur : une partie de ton regard cherche déjà la sortie de secours. Ça conduit fréquemment à une distance sourde : rien ne casse, mais l'investissement baisse d'un cran. La recherche documente que l'écart entre la vie rêvée et la vie tenue nourrit l'insatisfaction du lien. Le coût pour toi : comparer deux vies dont une seule existe — l'existante sort souvent perdante du match contre l'imaginaire. Le coût pour l'autre : habiter une maison dont une fenêtre reste braquée ailleurs, sans savoir ce qu'elle regarde.

**→ TA TENSION**
Tu demandes au présent d'être à la hauteur de tes scénarios — le présent ne vote pas. Aimer, pour toi, c'est choisir une version contre tes propres catalogues.

**→ LE MINI-RES**
- Lumière : tu vois des portes là où le couple voyait un mur.
- Ombre : ta fabrique de scénarios fabrique aussi des sorties.
- Mode d'emploi : quand la version alternative s'affiche, écris-la entière — puis une ligne de la version réelle. Compare à froid, pas à chaud.

### Ouverture — niveau faible (MR-11-O-FAI-A · MR-11-O-FAI-B)

#### MR-11-O-FAI-A — variante A « par l'exemple »

**TA LUMIÈRE**
Samedi matin, le café est prêt, la journée ressemble à la semaine passée — et ça te va. Tu as répondu que « Les idées abstraites m'agacent : je préfère ce qui est concret et utile. » Ce n'est pas un manque d'imagination : c'est un ancrage. Tu vis dans le réel, tu répares ce qui se répare, tu utilises ce qui sert. À deux, ça garantit un sol : les décisions prennent appui sur des faits, les promesses portent sur des choses vérifiables. La personne qui partage ta vie n'a pas à deviner où tu en es — tu le montres, en objets et en actes. Tu rends la vie commune praticable, jour après jour.

**→ TON OMBRE (en couple)**
Le connu rassure, alors tu le défends — même quand il a fini de servir. La routine qui protégeait devient un périmètre. Ton/ta partenaire propose de changer : déménager, reprendre des études, partir autrement en vacances. Tu réponds avant d'avoir écouté — « on est bien ici », « ça ne marchera pas ». Tu as répondu que « Revoir un film que j'ai aimé me plaît plus que découvrir quelque chose de nouveau. » — et ce réflexe, parfait pour un vendredi soir, se retourne en verrou pour les grandes décisions. À force, ça conduit fréquemment à un déséquilibre documenté : une seule voix propose, l'autre trie. Le partenaire cesse de soumettre ses envies — non parce qu'il y renonce, mais parce qu'il connaît déjà l'accueil. La recherche documente que le monopole du « non » finit en départ silencieux des projets : ils se réalisent ailleurs, sans toi. Le coût pour toi : tu apprends les changements quand ils sont déjà décidés — ou déjà partis. Le coût pour l'autre : porter seul(e) l'évolution du couple, et se demander si ses envies de demain ont une place.

**→ TA TENSION**
Ce que tu appelles ton goût du réel est parfois ta peur du changement, habillée en sagesse. Tu commences à le savoir — et c'est déjà la moitié du chemin.

**→ LE MINI-RES**
- Lumière : tu tiens le sol du couple — décisions factuelles, promesses vérifiables.
- Ombre : ton premier réflexe défend l'existant, même quand l'autre propose d'évoluer.
- Mode d'emploi : devant une idée neuve, ta seule réponse pendant une journée : « décris-moi ça ». Le tri vient après l'écoute — pas avant.

#### MR-11-O-FAI-B — variante B « par le mécanisme »

**TA LUMIÈRE**
Ton esprit aime le connu : il l'a déjà traité, classé, approuvé. Tu as répondu que « Revoir un film que j'ai aimé me plaît plus que découvrir quelque chose de nouveau. » Ce mécanisme a une vraie valeur conjugale : la fidélité aux choses qui marchent. Tu ne changes pas les règles du jeu chaque semaine, tu ne réinventes pas le couple à chaque désaccord. Tu donnes à la personne qui partage ta vie quelque chose d'increvable : des habitudes tenues, des routes connues, une parole stable. Quand tout vacille ailleurs, la maison garde un rythme qui tient — et ce rythme, c'est toi qui le tiens.

**→ TON OMBRE (en couple)**
Le connu rassure, et le différent alerte — même quand le différent vient de la personne que tu aimes. Tu as répondu que « Je préfère les gens qui pensent comme moi — ça évite les débats. » À deux, cet évitement des débats a un prix précis : les sujets qui fâchent sortent plus tard, et plus mûrs. Il/elle pense depuis des semaines à reprendre des études. Tu le sens. Mais le sujet ouvre un débat, alors vous parlez d'autre chose — des courses, du programme du week-end. Six mois passent ainsi. Ça conduit fréquemment à ce que la recherche documente chez les couples : les sujets différés reviennent en crise, rarement en conversation. Le coût pour toi : des décisions prises sans toi — parce que la discussion t'aurait coûté trop d'énergie. Le coût pour l'autre : vivre des choix importants dans la clandestinité douce de l'évitement, et douter de sa place.

**→ TA TENSION**
Tu veux un couple sans frottements — et les sujets qui comptent frottent d'abord. Ta paix a un prix que l'autre avance souvent à ta place.

**→ LE MINI-RES**
- Lumière : tes habitudes tenues font de la maison un endroit où l'on se repose du réel.
- Ombre : l'évitement des débats reporte les sujets — ils reviennent mûrs et lourds.
- Mode d'emploi : dis le sujet petit. Trois phrases, le jour où il naît — avant qu'il ne prenne de l'âge.

---
### Organisation — niveau élevé (MR-11-C-ELV-A · MR-11-C-ELV-B)

#### MR-11-C-ELV-A — variante A « par l'exemple »

**TA LUMIÈRE**
Lundi soir, tu rentres avec une promesse anodine : réserver le contrôle technique, rappeler la tante. Elle est faite. Tu as répondu que « Ce que je promets, je le tiens — même les petites promesses. » Ce n'est pas de la discipline pour la galerie : c'est ton mode de fabrication. Tu vérifies avant d'accepter, tu prépares tes journées, tu finis ce que tu commences. À deux, ça garantit une architecture : l'autre peut bâtir sur ta parole sans contre-expertise. Les charges courantes — papiers, plombier, rendez-vous — ne s'effondrent sur personne, parce que tu les portes à date. Une maison tenue, c'est une maison où l'on respire.

**→ TON OMBRE (en couple)**
Ta barre haute ne s'applique pas qu'à toi — elle éclaire aussi la personne en face, sans son accord. Tu as répondu que « Mes affaires ont leur place, et j'aime ça. » — et la place des affaires de l'autre a fini par avoir un avis. Un exemple : ses clés reposent ailleurs que sur le bol prévu. Rien de grave. Mais chez toi, un compteur tourne, et il finit par se lire sur ton visage. Et quand la tension monte, tu te réfugies dans l'occupation : tu as répondu que « Je prépare mes journées, au moins vaguement. » — tu prépares, tu ranges, tu planifies, pendant que le sujet qui fâche attend, debout. Ça conduit fréquemment à un dialogue décalé. L'autre vient parler du couple, tu réponds par des tâches ; il/elle parle de vous, tu réponds par toi. Ton auto-accusation ferme le dossier avant l'ouverture — « j'aurais dû », « c'est moi le problème ». La recherche documente que ce verrou coupe l'accès au vrai sujet. Le coût pour toi : tu gères tout, et tu restes seul(e) dans la gestion. Le coût pour l'autre : se sentir noté(e) sans examen annoncé, et dialoguer avec un agenda qui répond à sa place.

**→ TA TENSION**
Tu veux être dans le couple, pas à son service — mais ta façon d'aimer produit des listes. L'amour que tu donnes ressemble souvent à de la maintenance.

**→ LE MINI-RES**
- Lumière : ta parole tenue fait de toi un sol sur lequel l'autre bâtit sans vérifier.
- Ombre : ta barre s'applique à l'autre sans contrat, et tes tâches servent de refuge aux sujets.
- Mode d'emploi : nomme tes standards à voix haute — et laisse l'autre les refuser. Un standard non dit n'est pas un standard : c'est un piège.

#### MR-11-C-ELV-B — variante B « par le mécanisme »

**TA LUMIÈRE**
Le mécanisme est simple : chez toi, l'intention n'existe qu'exécutée. Tu as répondu que « Je termine ce que je commence, même quand l'envie est passée. » et que « Avant de m'engager, je vérifie que j'ai le temps de le faire bien. » Ce double filtre — vérifier avant d'accepter, terminer après avoir accepté — fabrique une parole au poids constant. La personne qui partage ta vie peut planifier avec toi, promettre pour toi, compter sur toi. Les projets communs avancent à une vitesse qui ne dépend pas de ton humeur — c'est la définition même d'un socle.

**→ TON OMBRE (en couple)**
Un filtre qui vérifie avant d'accepter finit par vérifier tout — y compris l'autre. Tu as répondu que « Ce que je promets, je le tiens — même les petites promesses. » — et tu attends la même monnaie, sans l'avoir dite. Un exemple : il/elle accepte de gérer l'assurance, oublie un mois, puis deux. Tu ne dis rien ; tu reprends le dossier en silence, en gardant la trace. Le dossier est réglé — le compte, lui, reste ouvert. Ça conduit fréquemment à ce que la recherche documente : une comptabilité silencieuse pèse plus lourd que les manquements eux-mêmes. L'autre découvre un jour le montant — et ne se souvient pas avoir signé. Et quand c'est toi qui trébuches, le même tribunal siège en interne. L'auto-accusation ferme la séance avant que l'autre ait parlé. Il/elle vient discuter d'un détail, tu plaides coupable pour l'affaire entière. Le coût pour toi : la solitude du parfait — on n'aide pas volontiers quelqu'un qui n'avoue rien et n'oublie rien. Le coût pour l'autre : vivre sous une note permanente, avec un juge qui s'appelle toi et sans défense possible.

**→ TA TENSION**
Tu réclames pour toi le droit à l'échec que tu refuses aux autres — et tu le sais quand la nuit tombe. L'excellence est ta façon d'être aimé(e) ; c'est aussi ta façon de rester seul(e) dedans.

**→ LE MINI-RES**
- Lumière : ta parole pèse le même poids un mardi et un dimanche — l'autre bâtit dessus.
- Ombre : la comptabilité silencieuse de tes attentes finit par peser plus que vos litiges.
- Mode d'emploi : dis la barre avant de la mesurer. Ce qui se mesure sans contrat se paie en ressentiment.

### Organisation — niveau faible (MR-11-C-FAI-A · MR-11-C-FAI-B)

#### MR-11-C-FAI-A — variante A « par l'exemple »

**TA LUMIÈRE**
Le plan de samedi ? Il n'existe pas encore, et ça te va très bien. Tu as répondu que « Je fonctionne mieux dans le désordre assumé. » Ce n'est pas du renoncement : c'est une façon d'habiter le temps. Tu suis la journée là où elle penche, tu t'adaptes à l'imprévu sans drame, tu laisses de la place au hasard. À deux, ça garantit de l'air : la personne à côté de toi peut improviser, changer d'avis, décaler — rien ne casse. Tu ne corriges pas ses élans avec un agenda, et les semaines du couple respirent. L'imprévu, chez toi, n'est pas une menace : c'est un invité.

**→ TON OMBRE (en couple)**
Ce qui flotte chez toi ne flotte pas pour l'autre — tes oublis atterrissent dans sa mémoire. Tu as répondu que « J'oublie régulièrement des choses que j'avais prévues. » Un exemple : la promesse d'appeler l'assurance, faite mardi, refaite jeudi, refaite la semaine suivante. Chaque fois sincère. Et chaque fois, c'est le/la même partenaire qui finit par le faire, en ajoutant à la liste mentale qu'il/elle n'avait pas demandée. Ça conduit fréquemment à une redistribution que la recherche documente. L'un devient la mémoire de l'autre — et la mémoire d'un couple finit en parent. Les promesses qui glissent une par une ne font pas de bruit ; leur somme, si. Le coût pour toi : ta sincérité n'est plus créditée — tes « oups » pèsent le poids d'une habitude. Le coût pour l'autre : porter les rappels, répéter, relancer — et se demander si c'est de l'amour ou du management.

**→ TA TENSION**
Tu vis les rappels comme un contrôle — ils sont souvent une main tendue. Derrière « tu as pensé à… », il y a « j'ai besoin de pouvoir compter ».

**→ LE MINI-RES**
- Lumière : tu laisses de l'air — l'imprévu ne casse rien chez toi.
- Ombre : tes promesses glissent une à une, et l'autre devient la mémoire du couple.
- Mode d'emploi : choisis une promesse par semaine, note-la, tiens-la. Le reste peut rester aérien.

#### MR-11-C-FAI-B — variante B « par le mécanisme »

**TA LUMIÈRE**
Ton attention fonctionne en éponge : elle se presse vers ce qui brille maintenant. Tu as répondu que « Mon espace — sac, chambre, bureau — dit le contraire de mon organisation. » — avec honnêteté, et sans drame. Ce mécanisme a une valeur conjugale réelle : tu es présent(e) au présent. Ce qui se passe ici maintenant a ta priorité entière, et la personne qui partage ta vie en profite. Elle a droit à ton énergie du moment, pas à ton planning d'hier. Un dimanche sans liste n'est pas un dimanche perdu : c'est un dimanche habité. Tu apportes au couple un rapport décontracté au temps qui dégrise.

**→ TON OMBRE (en couple)**
L'attention qui suit l'urgent laisse derrière elle l'important non pressant — et dans un couple, l'important est rarement pressant. Tu as répondu que « Les détails administratifs m'échappent systématiquement. » et que « Il m'arrive souvent de laisser traîner jusqu'à la dernière minute. » Un exemple : la déclaration, le rendez-vous médical, le courrier de la banque — chaque fois rattrapés in extremis. Chaque fois au prix d'une course que l'autre regarde en retenant son souffle. Et quand la dernière minute explose, c'est l'ambiance commune qui paye. Ça conduit fréquemment à un stress à deux vitesses : ton calme de l'instant, l'angoisse de l'autre pour l'après. La recherche documente que ce décalage de calendriers use la confiance opérationnelle d'un couple — celle de l'argent, la santé, les dates. Le coût pour toi : ton mot perd sa valeur faciale — on se met à te relancer, et tu l'entends comme un reproche. Le coût pour l'autre : porter une valise de dates mentales que tu ne portes pas — et subir chaque finale qui tourne mal.

**→ TA TENSION**
Tu veux être aimé(e) pour ta spontanéité, pas noté(e) sur tes dossiers — mais la vie à deux garde des dossiers. L'insouciance est un luxe qui se paye souvent par l'autre.

**→ LE MINI-RES**
- Lumière : tu es là, entier(ère), pour ce qui se passe maintenant.
- Ombre : ce qui compte sans presser t'échappe — et l'autre porte tes dates.
- Mode d'emploi : trois dates par semaine sur un papier partagé. Pas une liste de vie : un tampon d'accord.

---
### Énergie sociale — niveau élevé (MR-11-E-ELV-A · MR-11-E-ELV-B)

#### MR-11-E-ELV-A — variante A « par l'exemple »

**TA LUMIÈRE**
Samedi soir, douze personnes autour de la table — et toi au milieu, rechargé(e) au lieu d'être vidé(e). Tu as répondu que « Après une journée entouré(e) de gens, je me sens rechargé(e). » Ce mécanisme — le monde comme batterie — a un effet direct dans un couple : vous n'êtes pas une île. Tu construis le cercle : tu invites, tu relances, tu raccroches les gens les uns aux autres. La vie à deux que tu fabriques est large, bruyante, peuplée — et la personne que tu aimes en hérite. Un réseau se tisse tout seul derrière toi. Les mauvaises semaines trouvent du secours dans ce cercle avant même d'être racontées.

**→ TON OMBRE (en couple)**
Ton besoin de monde remplit l'espace — y compris celui dont l'autre a besoin pour respirer. Un exemple : le/la partenaire rentre une semaine épuisée. Tu as déjà prévu le brunch, les amis de passage, la soirée. Pas par égoïsme : par carburation. Et le silence de la maison te pèse avant qu'il ne pèse à l'autre. Tu as répondu que « L'ennui me vient quand il ne se passe rien autour de moi. » — alors tu remplis, encore. Ça conduit fréquemment à un étouffement documenté. Le partenaire moins social négocie son air comme une permission, arrive à vos soirées comme à un poste. La recherche sur les couples documente que le désalignement de budget social fabrique des disputes qui ne disent pas leur nom. Le coût pour toi : tu lis son besoin de silence comme un refus de ton monde — un refus de ta fête. Le coût pour l'autre : défendre son droit au calme face à quelqu'un qui l'aime bruyamment, et se sentir coupable.

**→ TA TENSION**
Tu remplis la maison pour la rendre vivante — et parfois pour ne pas entendre le calme réclamer sa place. Ton énergie est un cadeau dont l'autre ne choisit pas la dose.

**→ LE MINI-RES**
- Lumière : ton élan social peuple la vie du couple sans effort.
- Ombre : un partenaire plus silencieux achète son air à crédit.
- Mode d'emploi : une plage vide par semaine — sans la remplir, sans la commenter. Le calme n'est pas un vide à réparer.

#### MR-11-E-ELV-B — variante B « par le mécanisme »

**TA LUMIÈRE**
Ton système social s'allume au contact : la présence des autres t'augmente. Tu as répondu que « Je lance facilement la conversation avec des inconnus. » et que « Je dis spontanément ce que je pense devant un groupe. » Ce double moteur — ouvrir, exprimer — fait de toi un nœud : les gens se raccrochent à toi, les groupes s'organisent autour de toi. Les portes s'ouvrent avant que vous ayez frappé. À deux, ça garantit un environnement riche : la personne à tes côtés vit dans un monde qui connaît son prénom. Les occasions arrivent à toi — pas l'inverse.

**→ TON OMBRE (en couple)**
La parole spontanée ne se rallume pas à volonté — elle déborde d'abord. Tu as répondu que « Dans un groupe, je prends la parole sans forcer. » — et chez vous, le groupe est souvent toi. Un exemple : le rendez-vous du dimanche se transforme en récit de ta semaine — vivant, bienveillant, mais qui n'a qu'un locuteur. Il/elle ne se bat pas pour la place ; il/elle la cède. Et le bruit de fond permanent — les podcasts, les plans, les histoires — recouvre les sujets qui demandent du silence pour sortir. Ça conduit fréquemment à ce que la recherche documente dans les couples asymétriques : le moins bavard devient un auditoire. Et un auditoire, on ne le connaît pas vraiment. La vie commune continue, mais une seule histoire s'y raconte. Le coût pour toi : une partie de ta vie se raconte sans être connue. Tu parles beaucoup, tu es peu questionné(e), et tu te sens seul(e) au milieu du bruit. Le coût pour l'autre : vivre à côté d'une source sonore qui coule sans interruption, et perdre le goût de raconter.

**→ TA TENSION**
Tu veux que l'autre s'exprime — et ta facilité à parler lui retire le micro. Ta sociabilité a un angle mort : l'espace qu'elle prend sur les timides.

**→ LE MINI-RES**
- Lumière : tu ouvres des portes sociales que le couple n'ouvrirait pas seul.
- Ombre : ta parole occupe la place ; l'autre apprend à s'asseoir dedans.
- Mode d'emploi : une règle de table — après ton histoire, la question revient : « et toi ? ». Puis tu te tais. Vraiment.

### Énergie sociale — niveau faible (MR-11-E-FAI-A · MR-11-E-FAI-B)

#### MR-11-E-FAI-A — variante A « par l'exemple »

**TA LUMIÈRE**
Vendredi soir. La maison est calme, il n'y a personne, et c'est précisément là que tu te retrouves. Tu as répondu que « J'ai besoin de longues plages de silence pour me retrouver. » Ce n'est pas de l'asocialité : c'est ton atelier intérieur. Le bruit t'éloigne de toi-même ; le silence t'y ramène. À deux, ça garantit une présence rare : quand tu es là, tu es entièrement là. Le tête-à-tête est ton terrain de prédilection — une soirée à deux, tu l'habites entière. L'autre reçoit une attention non divisée : celle qui ne se fabrique pas à force de volonté, mais qui sort d'un réservoir plein.

**→ TON OMBRE (en couple)**
La forteresse protège l'intérieur — et l'obscurcit. Tu as répondu que « Une soirée en tête-à-tête vaut mieux qu'une grande table. » — le tête-à-tête, oui ; mais ton tête-à-tête a un sas, et le sas filtre. Un exemple : une phrase de l'autre t'a blessé(e) mardi. Tu ne dis rien — pas pour punir, pour trier. Vendredi, « ça va ? » reçoit « oui ». Trois semaines plus tard, la même phrase revient, déguisée en reproche à propos des courses — et l'autre ne reconnaît pas l'origine. Ça conduit fréquemment à ce que la recherche sur les couples documente sans surprise : les non-dits s'accumulent comme un prêt à intérêts. Chaque semaine de silence augmente la dette. L'autre vit avec une version de toi qu'il/elle ne peut ni vérifier ni rejoindre. Le coût pour toi : tu portes seul(e) des poids que trois phrases auraient allégés. Ta forteresse se remplit de ce qu'elle devait protéger. Le coût pour l'autre : aimer quelqu'un dont les portes se ferment sans bruit — et se demander, à chaque « ça va ? », si le « oui » est un état ou un mur.

**→ TA TENSION**
Tu veux être rejoint(e) sans avoir à ouvrir — mais ce qui ne sort pas de la forteresse ne peut pas être aimé. Tu demandes à l'autre de deviner ce que tu refuses de dire.

**→ LE MINI-RES**
- Lumière : ta présence au calme baisse le bruit autour de l'autre.
- Ombre : tes non-dits s'accumulent hors de vue, et prennent des intérêts.
- Mode d'emploi : dis le petit sujet le jour où il est petit — trois phrases, voix basse, pas de dossier.

#### MR-11-E-FAI-B — variante B « par le mécanisme »

**TA LUMIÈRE**
Ton énergie fonctionne comme un réservoir, pas comme une éolienne : elle se remplit dans le calme, loin des foules. Tu as répondu que « Trois jours sans voir personne : mon paradis. » Ce réglage a une valeur conjugale précise : tu ne consommes pas la relation en spectacle. Tu offres une présence dense, sans agitation — et le couple gagne un endroit où le monde baisse le volume. Ta façon d'observer — tu as répondu que « Je préfère observer que participer quand l'énergie du groupe monte. » — fait de toi un lecteur de scènes. Tu vois les dessous que les participants ratent, et tu les racontes bien, tard, à la bonne personne.

**→ TON OMBRE (en couple)**
Le retrait choisi se distingue mal, vu de l'extérieur, d'une absence. Un exemple : une soirée entre amis s'anime. Tu glisses au bord — observer, comme tu aimes. Ton/ta partenaire, au centre, te cherche des yeux : tu es parti(e) sans être parti(e). Sur le chemin du retour, tu dis « c'était bien », — et il/elle a vécu la soirée avec la moitié de toi. Multiplié par les semaines, ça conduit fréquemment à ce que la recherche documente sur les couples à budget social inégal. L'autre cesse de t'inviter dans ses mondes — pas par rancune : par économie d'efforts. Tu apprends les choses en retard : les fêtes sans toi, les histoires déjà finies. Les décisions se prennent entre gens qui « savent que tu n'aimes pas ça ». Le coût pour toi : ta moitié-présence te prive de scènes auxquelles tu tenais — pour des retraits devenus habitude plus que choix. Le coût pour l'autre : se présenter aux siens avec un(e) partenaire absent(e), et répondre de ton silence comme d'un verdict.

**→ TA TENSION**
Tu réclames le droit au bord du groupe — et tu voudrais être recherché(e) quand tu y es. La présence invisible finit par ne plus être comptée.

**→ LE MINI-RES**
- Lumière : ton calme densifie les tête-à-tête — tu écoutes du premier mot au dernier.
- Ombre : ton retrait se lit comme une absence — et l'autre cesse de tendre la main.
- Mode d'emploi : avant de glisser au bord, dis-le : « je vais observer, c'est mon mode ». Une présence annoncée compte double.

---
### Bienveillance — niveau élevé (MR-11-A-ELV-A · MR-11-A-ELV-B)

#### MR-11-A-ELV-A — variante A « par l'exemple »

**TA LUMIÈRE**
Il est dix heures du soir, tu es fatigué(e), et le/la collègue raconte sa semaine difficile. Tu écoutes jusqu'au bout, comme si ton sommeil attendait son tour. Tu as répondu que « Je fais volontiers des choses pour les autres sans rien attendre. » Ce mécanisme — donner sans facture — irrigue tout ce que tu construis à deux : tu remarques, tu prépares, tu répares avant qu'on demande. La personne qui partage ta vie reçoit une attention qui ne se déclare pas en crise : elle coule, quotidienne, indépendante de l'humeur. C'est le genre de présence qui tient une maison debout pendant les semaines dures.

**→ TON OMBRE (en couple)**
La gentillesse qui évite le conflit n'est pas une paix : c'est un report. Tu as répondu que « Il m'arrive d'attendre avant de dire à quelqu'un qu'il m'a contrarié — pour lui éviter du mal. » — la raison annoncée protège l'autre ; la raison vraie protège la paix. Un exemple : le week-end chez sa famille, encore. Tu n'en avais pas envie. Tu as dit oui avec un sourire — et le refus est rentré chez toi avec toi. Un mois plus tard, il ressort : pique assourdissante sur le choix d'un restaurant. L'autre ne comprend pas la puissance du tir. Ça conduit fréquemment à ce que la recherche documente comme une dette morale invisible. Chaque concession non dite s'inscrit dans un compte que personne ne voit — jusqu'au jour où le total s'affiche. L'autre découvre une ardoise qu'il n'a pas signée. Le coût pour toi : l'amertume d'un compte que toi seul(e) tiens — tu donnes beaucoup, et tu finis par croire qu'on te vole. Le coût pour l'autre : vivre avec quelqu'un qui accepte tout et n'avoue rien — et découvrir que la gentillesse avait un prix.

**→ TA TENSION**
Tu veux être aimé(e) pour ce que tu donnes — et ta peur du conflit choisit à ta place. Ton oui se fabrique parfois dans la peur, pas dans l'envie.

**→ LE MINI-RES**
- Lumière : ta générosité tient la maison debout sans se faire annoncer.
- Ombre : tes refus refoulés s'inscrivent dans une dette que l'autre n'a pas signée.
- Mode d'emploi : un « non » par semaine, petit, nu, sans excuse. La dette ne se fabrique que dans le silence.

#### MR-11-A-ELV-B — variante B « par le mécanisme »

**TA LUMIÈRE**
Ton système d'attention est réglé sur les autres : leur humeur, leur fatigue, leur non-dit. Tu as répondu que « Je m'inquiète sincèrement de comment vont les gens autour de moi. » et que « Les gens me décrivent comme quelqu'un de facile à vivre. » Ce double réglage fait de toi un point d'ancrage : autour de toi, les gens se posent, se racontent, s'apaisent. À deux, ça garantit une météo supportable : la personne qui partage ta vie sait qu'elle sera reçue, même chargée. Ton foyer a une porte qui s'ouvre sans gronder — et ça se sent dès le seuil.

**→ TON OMBRE (en couple)**
L'antenne qui capte tout finit par absorber tout — y compris ce qui ne t'appartient pas. L'humeur de l'autre devient ta météo : il/elle rentre contrarié(e), toi tu baisses d'un ton ; il/elle doute, toi tu serres. Un exemple : une période de doute professionnel chez lui/elle — toi tu dors mal, tu gères, tu amortis, sans rien dire. Et sous l'absorption, la facture : l'harmonie que tu fabriques repose sur des concessions que tu ne nommes pas. Ça conduit fréquemment à ce que la recherche documente chez les profils absorbants : l'épuisement silencieux du donneur, et l'explosion en retard. Pas à cause de la dernière goutte — à cause de l'addition entière. L'autre, de son côté, vit dans une douceur qui ne dit pas son coût — il/elle ignore qu'elle se paie ailleurs, en toi. Le coût pour toi : te confondre avec le service de la maison — tu ne sais plus où finit l'autre, où tu commences. Le coût pour l'autre : être aimé(e) par quelqu'un qui s'efface — apprendre un jour que la douceur était une dette.

**→ TA TENSION**
Tu confonds aimer et absorber — tu prends en charge ce qu'on ne t'a pas confié. Ce que tu appelles harmonie est parfois ta peur de déplaire, en service commandé.

**→ LE MINI-RES**
- Lumière : ton antenne fait du foyer un endroit où l'on arrive comme on respire.
- Ombre : tu absorbes sans frontière, et la douceur cache une facture.
- Mode d'emploi : avant de dire oui, vérifie qui parle — l'envie ou la peur. Une seconde suffit.

### Bienveillance — niveau faible (MR-11-A-FAI-A · MR-11-A-FAI-B)

#### MR-11-A-FAI-A — variante A « par l'exemple »

**TA LUMIÈRE**
Ton/ta partenaire rate un créneau bancaire qui coûte des frais. Tu ne regardes pas le plafond : tu dis la chose, nette, sans habillage. Tu as répondu que « Quand quelqu'un a tort, le dire clairement compte plus que le ménager. » Ce mécanisme — la clarté d'abord — donne au couple un luxe discret : pas de double fond. Ce qui est dit est dit, ce qui est pensé se sait. La personne qui partage ta vie n'a pas à décoder tes silences. Les vrais sujets sortent vite, en entier, et se traitent à la lumière. Avec toi, on sait où on en est — et ça change des années d'ambiguïté.

**→ TON OMBRE (en couple)**
La dureté utile arrive plus vite que la tendresse — et elle ne demande pas la permission. Tu as répondu que « Je peux être dur(e) quand il faut l'être — et c'est souvent utile. » — le problème n'est pas la dureté, c'est l'heure. Un exemple : il/elle te montre un projet où il/elle a travaillé trois semaines. Tu vois la faille en dix secondes, et tu la dis en quinze — juste, nette, sans préambule. La faille était vraie ; la blessure aussi. Ça conduit fréquemment à ce que la recherche documente : ce n'est pas le contenu qui use un lien, c'est le contenant répété. Les vérités sans préparation s'accumulent, et finissent par apprendre à l'autre à se protéger de toi. L'autre cesse de partager ses essais : il/elle revient te voir quand c'est fini, plus quand c'est fragile. Le coût pour toi : tu apprends les vies qui te sont chères en version finale — trop tard pour compter. Le coût pour l'autre : présenter chaque fragilité à un jury — et finir par ne plus se présenter du tout.

**→ TA TENSION**
Tu crois préparer l'autre au réel — parfois tu prépares surtout l'autre à te fuir. Ta franchise sert la vérité et déplace la personne qu'elle devrait servir.

**→ LE MINI-RES**
- Lumière : avec toi, aucun sujet n'a besoin de détour — la clarté tient la maison.
- Ombre : ta dureté arrive avant ta tendresse, et l'autre retient surtout elle.
- Mode d'emploi : une règle d'ordre — d'abord une phrase pour la personne, ensuite ta remarque. La vérité se sert à température.

#### MR-11-A-FAI-B — variante B « par le mécanisme »

**TA LUMIÈRE**
Ton mécanisme de base : vérifier avant d'ouvrir. Tu as répondu que « La politesse excessive me paraît souvent hypocrite. » — tu ne donnes pas à la façade, tu donnes au réel. Ce filtre a une valeur conjugale nette : ton affection, quand elle arrive, est créditée. La personne qui partage ta vie sait que tes compliments ne se distribuent pas en promotion. Un mot de toi pèse un mot. Dans un monde de politesses gonflées, la maison parle bas et vrai. Ça se sent dès qu'on y entre : rien n'y est décor, tout y est vrai au moins une fois.

**→ TON OMBRE (en couple)**
La vérification avant confiance n'a pas de fin programmée — elle peut tourner des années. Tu as répondu que « Je garde mes distances : ça évite les déceptions. » Un exemple : trois ans ensemble, et il/elle découvre au détour d'une amie que tu savais à peine quelle était son enfance. Tu n'avais pas posé les questions qui ne servent pas le quotidien. Pas par froideur : par protocole. La confiance se donne chez toi au terme d'un examen que l'autre ne sait pas passer. Ça conduit fréquemment à ce que la recherche documente sur la confiance tardive. Le partenaire prouve sa fiabilité pendant que tu tiens le greffe. Et la preuve, elle, n'a pas de date de fin. La confiance donnée trop tard se confond, vue de dehors, avec de la méfiance tenue. Le coût pour toi : la déception évitée se change en solitude — tu rates des années de profondeur pour éviter une blessure possible. Le coût pour l'autre : être loyal(e) à vie dans un examen sans résultat — et douter, un jour, que la note existe.

**→ TA TENSION**
Tu veux être cru(e) sans t'ouvrir — mais on ne croit que ce qui se montre. La confiance que tu gardes en réserve protège le coffre et affame la maison.

**→ LE MINI-RES**
- Lumière : tes mots se créditent — rien de gonflé, rien de faux dans la maison.
- Ombre : la confiance en attente se lit comme de la méfiance — et l'autre passe des examens sans fin.
- Mode d'emploi : donne un morceau d'histoire inutile, une fois par semaine. Pas pour l'autre : pour sortir du protocole.

---
### Stabilité émotionnelle — niveau élevé (MR-11-S-ELV-A · MR-11-S-ELV-B)

#### MR-11-S-ELV-A — variante A « par l'exemple »

**TA LUMIÈRE**
La voiture tombe en panne un jeudi, il pleut, le rendez-vous est perdu. Toi, tu sors le gilet, tu appelles l'assistance, tu souris à l'autre. Tu as répondu que « Un imprévu de dernière minute ne me déstabilise pas longtemps. » Ce mécanisme — la vague passe, toi tu restes — a un effet massif dans un couple : tu es le point fixe. Les semaines dures — déménagement, deuil, mois serrés — trouvent chez toi une voix qui ne monte pas. La personne qui partage ta vie bâtit sur ce calme : la maison ne chavire pas parce qu'il y a du vent dehors.

**→ TON OMBRE (en couple)**
Ton calme traite l'urgence émotionnelle comme un incident météo — passager, surestimé, bientôt beau. Tu as répondu que « Je me considère globalement serein(e). » — et ta sérénité a une faiblesse : elle distingue mal l'orage de l'alarme. Un exemple : il/elle revient le soir bouleversé(e) — une peur vraie, qui demande d'être traitée en urgence par quelqu'un. Toi, tu accueilles, tu dédramatises, tu poses le bon mot — et le sujet redescend avec la fièvre. Trois semaines plus tard, il remonte, plus gros, et cette fois il/elle ne demande plus d'aide : il/elle exige une décision. Ça conduit fréquemment à ce que la recherche documente avec insistance : ce qui use un lien, ce n'est pas le conflit. Et un calme qui refuse l'urgence se lit, de l'autre côté, comme de l'indifférence polie. Le coût pour toi : tu apprends les crises au stade décision — quand les options ont fondu. Le coût pour l'autre : devoir crier pour exister dans une conversation tenue par ta voix de basse. Sa panique doute de son droit de cité.

**→ TA TENSION**
Ton calme est le refuge du couple et l'abri des sujets qui devraient sortir. Tu appelles ça de la sérénité ; l'autre l'appelle parfois un mur avec des rideaux.

**→ LE MINI-RES**
- Lumière : ton calme tient la maison quand le dehors tremble.
- Ombre : ton refus de l'urgence émotionnelle laisse les sujets grossir dans le noir.
- Mode d'emploi : quand l'autre dit « c'est important », pose ce que tu fais. Sa gravité n'a pas à attendre la tienne.

#### MR-11-S-ELV-B — variante B « par le mécanisme »

**TA LUMIÈRE**
Ton système ne sur-réagit pas : la vague arrive, grossit, repart — et toi, tu restes au fond, à regarder. Tu as répondu que « Face à une dispute, je retrouve mon calme assez vite. » Ce mécanisme a une valeur conjugale réelle : les disputes à deux ne cassent pas sur le coup — elles cassent dans la répétition. Ta capacité à redescendre vite évite les escalades : un des deux doit rester debout pendant la tempête. Chez vous, c'est souvent toi. Le couple gagne un garant de température : les mots durs dits à chaud ne sortent pas de ta bouche.

**→ TON OMBRE (en couple)**
La patience est ta solution par défaut — et la patience, poussée assez loin, devient du déni. Tu as répondu que « Je dors assez bien même quand tout ne va pas. » — un vrai privilège, et un révélateur : le « tout ne va pas » dort aussi bien que le reste, chez toi. Un exemple : une zone grise s'installe dans le couple — une distance, un sujet esquissé. Toi, tu laisses le temps faire : pas de drame, pas de discussion lourde — tu attends que la météo tourne seule. Elle ne tourne pas. Neuf mois passent. Ça conduit fréquemment à ce que la recherche documente chez les profils stables et patients : les ruptures dites « sans prévenir ». L'autre a décidé seul(e), dans le silence que toi tu prenais pour de la patience. Le sujet n'était pas en patience : il était en déni. Le coût pour toi : ton outil central — attendre — se retourne en aveuglement sur les sujets qui demandaient une main, pas du temps. Le coût pour l'autre : vivre neuf mois avec une question grave devant un partenaire qui dort bien. Et se sentir seule au monde.

**→ TA TENSION**
Tu appelles « laisser le temps au temps » ce qui est parfois refuser de regarder. Ton calme protège le couple des tempêtes — et toi des conversations qui t'attendraient dedans.

**→ LE MINI-RES**
- Lumière : tu redescends vite, et la maison ne vit pas tes orages.
- Ombre : ta patience laisse mûrir les sujets graves — et mûrir, pour un sujet, veut dire grossir.
- Mode d'emploi : une fois par mois, pose la question qu'on repousse : « qu'est-ce qu'on évite, tous les deux ? ». Puis écoute sans dédramatiser.

### Stabilité émotionnelle — niveau faible (MR-11-S-FAI-A · MR-11-S-FAI-B)

#### MR-11-S-FAI-A — variante A « par l'exemple »

**TA LUMIÈRE**
Une phrase à la radio te fait pleurer en conduisant ; une heure plus tard, tu ris aux éclats au téléphone. Tu as répondu que « Mon humeur varie fortement dans une même journée. » Ce n'est pas une panne de contrôle : c'est une météo riche. Et cette météo a une valeur conjugale nette : avec toi, rien n'est deviné. Ton enthousiasme se voit, ta contrariété se lit, ton amour s'entend. La personne qui partage ta vie vit avec quelqu'un de lisible — pas un intérieur où l'on palpe les murs. Ta sincérité émotionnelle désamorce plus de malentendus qu'elle n'en crée.

**→ TON OMBRE (en couple)**
La météo intérieure change vite — et l'autre vit dehors, sans bulletin. Tu as répondu que « Je repasse souvent dans ma tête des choses dites ou faites. » — la vague est passée pour toi ; la phrase, elle, est restée. Un exemple : un dîner qui tourne court parce qu'une remarque t'a touché(e) en plein vol. Tu montes une première vague — des mots plus grands que la cause (« tu te fiches de moi depuis le début »). L'autre se défend de quelque chose qu'il n'a pas dit. Une heure plus tard, la vague redescend ; chez lui/elle, elle reste : il/elle relit la table, les mots, ton visage. Ça conduit fréquemment à ce que la recherche documente comme le coût des escalades répétées. L'autre met une balance avant chaque phrase, et pèse chaque sujet. Il/elle finit par taire les siens pour éviter les tiens. Les mots de crise, eux, ne se retirent pas : ils se relisent. Le coût pour toi : la honte d'après — tu repasses tes propres phrases la nuit, et la liste des excuses s'allonge. Le coût pour l'autre : vivre avec un radar à orage — et payer les beaux jours en marche sur œufs.

**→ TA TENSION**
Tu veux être rassuré(e) sur le lien — et tes mots de crise testent le lien exactement là où il est neuf. Tu demandes à l'autre d'aimer une météo qui le mouille.

**→ LE MINI-RES**
- Lumière : ta météo se lit — avec toi, l'autre n'a pas à deviner.
- Ombre : les mots de crise partent vite et se relisent longtemps.
- Mode d'emploi : nomme la vague avant de lancer : « je monte, ce n'est pas toi ». Le sujet reprend à froid — les mots de crise restent dans l'emballage.

#### MR-11-S-FAI-B — variante B « par le mécanisme »

**TA LUMIÈRE**
Ton corps capte avant ta tête : le cœur qui accélère, le ventre qui serre, la fièvre des doutes. Tu as répondu que « Je sens souvent mon cœur s'accélérer sans raison claire. » — ton système est branché au direct, sans filtre. Ce réglage a une valeur conjugale : tu ressens les inflexions avant qu'elles se disent — un ton, un silence de trop. Ton engagement n'est pas tiède : quand tu aimes, on le voit, on l'entend, on le traverse avec toi. Ta sensibilité est une vraie antenne — elle capte tôt, elle dit vrai souvent, elle garde le couple branché sur le vivant.

**→ TON OMBRE (en couple)**
L'antenne capte tôt — et l'interprétation part avant les faits. Tu as répondu que « Je me fais des scénarios qui tournent mal plus souvent que nécessaire. » Un exemple : le/la partenaire répond « vu, on en reparle » à midi, d'un ton plat. Ton cœur a déjà accéléré. L'après-midi entière se fabrique : le ton, la phrase, la fin possible. À dix-neuf heures, il/elle rentre fatigué(e) d'une réunion — et trouve chez toi l'ambiance d'un procès en différé. Les périodes d'attente sont ton épreuve calibrée — tu as répondu que « Les périodes d'attente — résultats, réponses — me rongent. » — et un couple est plein d'attentes : une réponse, une décision, une humeur à décoder. Ça conduit fréquemment à ce que la recherche documente comme les prophéties qui s'installent. Les scénarios, nourris plusieurs jours, créent l'ambiance qu'ils craignaient. L'autre se met sur la défensive — et la défense ressemble exactement au scénario de départ. Le coût pour toi : des journées entières dans des fins du monde qui n'ont pas eu lieu. Le coût pour l'autre : vivre sous une attente permanente de verdict — son ton de midi devient un dossier à désamorcer le soir.

**→ TA TENSION**
Tu veux des certitudes pour calmer la vague — et la vie à deux n'en fabrique pas en stock. Ton antenne te fait vivre trois fois ce qui n'arrivera qu'une fois — ou pas.

**→ LE MINI-RES**
- Lumière : ton antenne capte tôt les inflexions — rien ne t'arrive en surprise totale.
- Ombre : les scénarios nourris fabriquent l'orage qu'ils craignent.
- Mode d'emploi : un scénario qui tourne mal se met par écrit, du début à la fin. Sur papier, il perd la moitié de sa hauteur.

---
## 2 — Gabarits paramétrés (assemblage moteur)

**GAB-MR-11-BLOC — gabarit d'assemblage d'une brique.** Slots visibles :

| Slot | Contenu | Contrainte de rendu |
|---|---|---|
| {dim} | Nom de la dimension, en toutes lettres (ouverture, organisation, énergie sociale, bienveillance, stabilité émotionnelle) | jamais le sigle de colonne ; jamais une lettre seule |
| {niveau} | élevé / faible | jamais affiché comme un verdict (« tu es… ») ; porté par la brique elle-même |
| {pct} | Position descriptive dans le pool vivant | descriptif, jamais normatif — formulation d'affichage type « la plupart des membres hésitent ici » |
| {citation_items} | Rappel EN TOUTES LETTRES de l'énoncé intégral, entre guillemets | jamais un code ; l'`ancre_item` reste un champ moteur (Constitution [3] · FM-017) |
| {texture_seed} | Choix A/B (variante « par l'exemple » / « par le mécanisme ») | sélectionne la variante du couple correspondant à {dim} × {niveau} |

Règles d'assemblage : 1 profil → 1 dimension saillante → 1 niveau → 1 variante (une seule texture par dimension rendue). La structure des intitulés est verrouillée : **TA LUMIÈRE** → **→ TON OMBRE (en couple)** → **→ TA TENSION** → **→ LE MINI-RES**. Volume : 300-450 mots par variante rendue ; ombre ≥ lumière, par variante. {citation_items} tire 1 à 3 énoncés RÉELS de la dimension/niveau concerné dans le tableau 01 — verbatim, jamais reformulé, jamais abrégé.

Extrait yaml (champs moteur — jamais rendus) :

```yaml
gabarits:
  - id: GAB-MR-11-BLOC
    slots_visibles: [dim, niveau, pct, citation_items, texture_seed]
    structure: ["TA LUMIÈRE", "→ TON OMBRE (en couple)", "→ TA TENSION", "→ LE MINI-RES"]
    volume: "300-450 mots/variante (Constitution [7])"
    ombre: "≥ lumière, par variante (Constitution [2])"
    ancre_item: "champ moteur — ne franchit jamais le rendu (FM-017)"
  - id: GAB-MR-11-SYNT
    slots: [dim, pct]
    volume: "2-3 phrases"
    usage: "dimensions non saillantes — rendu synthétique (§0)"
```

---

## 3 — Table d'ancrage (affirmation → items → vérification)

> Une ligne par brique. La colonne « Affirmation du texte » reproduit la citation rendue (mots d'utilisateur) ; la colonne « Items » porte les codes (champ moteur, jamais rendus) ; la colonne « Vérification » constate que la citation résout verbatim l'énoncé du `01-tableau-des-items.md` — et qu'aucun code n'apparaît dans le rendu. Les orientations I (inversés) sont citées telles quelles : c'est la réponse qui porte le sens, l'énoncé reste verbatim.

| Brique (ID moteur) | Affirmation du texte (en mots d'utilisateur) | Items (codes, champ moteur) | Vérification |
|---|---|---|---|
| MR-11-O-ELV-A | « Une nouvelle cuisine, un nouveau pays, une nouvelle méthode : je dis oui avant de me poser de questions. » · « Je m'ennuie vite dans les routines trop calées. » | Q1.1-02 · Q1.1-05 | ✅ citations verbatim du 01 · aucun code au rendu · rappel en toutes lettres |
| MR-11-O-ELV-B | « J'aime les conversations qui partent dans des idées inattendues. » · « Une idée un peu folle vaut la peine qu'on s'y arrête. » · « J'aime imaginer des versions alternatives de ma vie. » | Q1.1-01 · Q1.1-10 · Q1.1-07 | ✅ citations verbatim du 01 · aucun code au rendu · rappel en toutes lettres |
| MR-11-O-FAI-A | « Les idées abstraites m'agacent : je préfère ce qui est concret et utile. » · « Revoir un film que j'ai aimé me plaît plus que découvrir quelque chose de nouveau. » | Q1.1-06 · Q1.1-08 | ✅ citations verbatim du 01 · aucun code au rendu · rappel en toutes lettres |
| MR-11-O-FAI-B | « Revoir un film que j'ai aimé me plaît plus que découvrir quelque chose de nouveau. » · « Je préfère les gens qui pensent comme moi — ça évite les débats. » | Q1.1-08 · Q1.1-03 | ✅ citations verbatim du 01 · aucun code au rendu · rappel en toutes lettres |
| MR-11-C-ELV-A | « Ce que je promets, je le tiens — même les petites promesses. » · « Mes affaires ont leur place, et j'aime ça. » · « Je prépare mes journées, au moins vaguement. » | Q1.1-11 · Q1.1-13 · Q1.1-19 | ✅ citations verbatim du 01 · aucun code au rendu · rappel en toutes lettres |
| MR-11-C-ELV-B | « Je termine ce que je commence, même quand l'envie est passée. » · « Avant de m'engager, je vérifie que j'ai le temps de le faire bien. » · « Ce que je promets, je le tiens — même les petites promesses. » | Q1.1-17 · Q1.1-15 · Q1.1-11 | ✅ citations verbatim du 01 · aucun code au rendu · rappel en toutes lettres |
| MR-11-C-FAI-A | « Je fonctionne mieux dans le désordre assumé. » · « J'oublie régulièrement des choses que j'avais prévues. » | Q1.1-20 · Q1.1-14 | ✅ citations verbatim du 01 · aucun code au rendu · rappel en toutes lettres |
| MR-11-C-FAI-B | « Mon espace — sac, chambre, bureau — dit le contraire de mon organisation. » · « Les détails administratifs m'échappent systématiquement. » · « Il m'arrive souvent de laisser traîner jusqu'à la dernière minute. » | Q1.1-16 · Q1.1-18 · Q1.1-12 | ✅ citations verbatim du 01 · aucun code au rendu · rappel en toutes lettres |
| MR-11-E-ELV-A | « Après une journée entouré(e) de gens, je me sens rechargé(e). » · « L'ennui me vient quand il ne se passe rien autour de moi. » | Q1.1-21 · Q1.1-27 | ✅ citations verbatim du 01 · aucun code au rendu · rappel en toutes lettres |
| MR-11-E-ELV-B | « Je lance facilement la conversation avec des inconnus. » · « Je dis spontanément ce que je pense devant un groupe. » · « Dans un groupe, je prends la parole sans forcer. » | Q1.1-23 · Q1.1-29 · Q1.1-25 | ✅ citations verbatim du 01 · aucun code au rendu · rappel en toutes lettres |
| MR-11-E-FAI-A | « J'ai besoin de longues plages de silence pour me retrouver. » · « Une soirée en tête-à-tête vaut mieux qu'une grande table. » | Q1.1-26 · Q1.1-22 | ✅ citations verbatim du 01 · aucun code au rendu · rappel en toutes lettres |
| MR-11-E-FAI-B | « Trois jours sans voir personne : mon paradis. » · « Je préfère observer que participer quand l'énergie du groupe monte. » | Q1.1-30 · Q1.1-28 | ✅ citations verbatim du 01 · aucun code au rendu · rappel en toutes lettres |
| MR-11-A-ELV-A | « Je fais volontiers des choses pour les autres sans rien attendre. » · « Il m'arrive d'attendre avant de dire à quelqu'un qu'il m'a contrarié — pour lui éviter du mal. » | Q1.1-35 · Q1.1-31 | ✅ citations verbatim du 01 · aucun code au rendu · rappel en toutes lettres (Q1.1-31 = ancre déclarée du registre, cite(Q1.1-31)) |
| MR-11-A-ELV-B | « Je m'inquiète sincèrement de comment vont les gens autour de moi. » · « Les gens me décrivent comme quelqu'un de facile à vivre. » | Q1.1-33 · Q1.1-39 | ✅ citations verbatim du 01 · aucun code au rendu · rappel en toutes lettres |
| MR-11-A-FAI-A | « Quand quelqu'un a tort, le dire clairement compte plus que le ménager. » · « Je peux être dur(e) quand il faut l'être — et c'est souvent utile. » | Q1.1-34 · Q1.1-40 | ✅ citations verbatim du 01 · aucun code au rendu · rappel en toutes lettres |
| MR-11-A-FAI-B | « La politesse excessive me paraît souvent hypocrite. » · « Je garde mes distances : ça évite les déceptions. » | Q1.1-36 · Q1.1-38 | ✅ citations verbatim du 01 · aucun code au rendu · rappel en toutes lettres |
| MR-11-S-ELV-A | « Un imprévu de dernière minute ne me déstabilise pas longtemps. » · « Je me considère globalement serein(e). » | Q1.1-41 · Q1.1-49 | ✅ citations verbatim du 01 · aucun code au rendu · rappel en toutes lettres |
| MR-11-S-ELV-B | « Face à une dispute, je retrouve mon calme assez vite. » · « Je dors assez bien même quand tout ne va pas. » | Q1.1-47 · Q1.1-44 | ✅ citations verbatim du 01 · aucun code au rendu · rappel en toutes lettres |
| MR-11-S-FAI-A | « Mon humeur varie fortement dans une même journée. » · « Je repasse souvent dans ma tête des choses dites ou faites. » | Q1.1-45 · Q1.1-42 | ✅ citations verbatim du 01 · aucun code au rendu · rappel en toutes lettres |
| MR-11-S-FAI-B | « Je sens souvent mon cœur s'accélérer sans raison claire. » · « Je me fais des scénarios qui tournent mal plus souvent que nécessaire. » · « Les périodes d'attente — résultats, réponses — me rongent. » | Q1.1-50 · Q1.1-46 · Q1.1-43 | ✅ citations verbatim du 01 · aucun code au rendu · rappel en toutes lettres |

> ⚠ **Q1.1-48 (note d'audit du registre)** — rappel SUSPENDU jusqu'à l'arbitrage comité (voir 01 · 03) : aucune brique de ce miroir ne le cite. L'angle « l'auto-accusation comme verrou » (C élevé) est développé sans citation d'ancrage — conforme à la suspension déclarée. Couverture : 44 items carte distincts cités sur 50 (les 20 briques n'ont pas à couvrir la grille ; le rappel porte sur les affirmations réellement utilisées).

---
## 4 — Signatures intégrées

> Périmètre verrouillé : SEULEMENT les signatures DÉCLARÉES du `03-signatures-registre.md` qui consomment la quête 1.1 — SIG_COH_HAUTE, SIG_COH_DIV, la famille QFI (SIG_QFI_CRISTALLIN · SIG_QFI_CONSTRUCTION · SIG_QFI_STRATEGIQUE · SIG_QFI_AVEUGLE), et la garde universelle QFI ≥ 0.60. Rien n'est inventé : conditions verbatim du registre gelé (ADOPTÉES FM-019 — provisoire concepteur), conséquences décrites à leur place déclarée. Les seuils et conditions restent côté moteur — aucune valeur numérique ne franchit un texte utilisateur.

| Signature (ID moteur) | Condition déclarée (verbatim 03) | Modulation de CE miroir |
|---|---|---|
| **Garde universelle QFI ≥ 0.60** | « aucune signature narrative ne se déclenche sous QFI < 0.60 » · reprise sur chaque dimension du 01 (« garde QFI ≥ 0.60 pour le narratif ») | Tant que la garde ne passe pas, aucune modulation ci-dessous ne s'applique et le narratif développé (briques du §1) ne se déclenche pas : le miroir retombe au rendu synthétique GAB-MR-11-SYNT (§0) pour les cinq dimensions. Aucune sanction affichée. |
| **SIG_COH_HAUTE** | « EC ≤ 0.15 ET garde QFI ≥ 0.60 » | Insertion UNE fois dans le miroir de la ligne déclarée GAB-LIGNE_COHERENCE verbatim : « Et ça colle : tes mots et tes choix racontent la même histoire. » — sans réécriture des briques. La brique « la donnée rare » reste à sa place déclarée (Portrait, étage 3). |
| **SIG_COH_DIV** | « EC ≥ 0.30 ET garde QFI ≥ 0.60 » | Insertion de la brique spéciale DIV-M1-AC (paragraphe de divergence) en PLACEMENT PRIORITAIRE du miroir — avant les briques de dimension. Slot ecart_coh : rappel des deux réponses divergentes en toutes lettres, mot pour mot (jamais de code). Jamais dans la version Engagement (§5 porte sa traduction : « bâtis sur les accords définis à froid »). Le texte de DIV-M1-AC vit au registre des Portraits — non reproduit ici. |
| **SIG_QFI_CRISTALLIN** | « concordance doublons ≥ 0.90 ET temps de réponse normaux » | Les affirmations couvertes par la concordance des doublons (02.r×02 · 11.r×11) portent dans le miroir la mention déclarée « confirmées sur tes réponses » ; les intervalles descriptifs ({pct}) sont resserrés au rendu. |
| **SIG_QFI_CONSTRUCTION** | « concordance doublons 0.60-0.90 » | Insertion du paragraphe prudent déclaré : « tes réponses sur ce point sont partagées — c'est une information en soi ». Aucun renforcement ni adoucissement supplémentaire des briques : la prudence vient du paragraphe, pas d'une réécriture. |
| **SIG_QFI_STRATEGIQUE** | « désirabilité sociale élevée (items SDA trame) ET over-claiming ≥ 1 » | Déflation déclarée des échelles (facteur 1 − 0.3×SDA) appliquée AVANT le classement de saillance du §0 : peut retirer une dimension du champ saillant (la brique correspondante n'est alors pas rendue). La note de lecture du rendu passe en version renforcée (déclarée). |
| **SIG_QFI_AVEUGLE** | « > 20% des items répondu < 1,2 s » | Conséquence déclarée à sa place : profil suspendu au matching + proposition de re-test — jamais de sanction affichée. Aucune modulation de texte déclarée pour le miroir : il ne porte ni avertissement ni remarque sur le rythme de réponse. |

**Frontière de périmètre (pour éviter toute confusion en aval).** Les signatures narratives du registre dont l'Ancrage 1.1 mentionne les variables de cette quête (Bloc Bâtisseur : SIG_STANDARD_PROJETE, SIG_REFUGE_OCCUPATION, SIG_CALME_VERROU, SIG_VERROU_AUTOACCUSATION — Bloc Vigie : SIG_ABSORPTION — Bloc Autonome : SIG_DEFET_SOUDAIN — Bloc Intense : SIG_METEO_FORTE, SIG_REN_REQUIS) produisent leurs briques à L'ÉTAGE 3 (Portraits de Domaine), conformément au registre : « leurs textes vivent au registre des Portraits ». Elles ne modulent pas ce miroir et ne sont pas reproduites ici — leurs angles d'ombre (projection de standard, occupation comme refuge, auto-accusation, absorption, météo intérieure…) sont traités dans les briques de §1 quand le concepteur les y a imposés.

---

## 5 — Contrôles avant livraison (affichés)

| Contrôle | Statut | Méthode |
|---|---|---|
| Ombre ≥ lumière, par variante | ✅ | comptage de mots par bloc (script, 20/20 variantes) — l'ombre porte mécanisme + exemple + conséquence + coût double ; la lumière reste sur le mécanisme et la garantie |
| Conséquence probabiliste présente | ✅ | chaque ombre porte « conduit fréquemment à » et/ou « la recherche documente que » (20/20) — scan du futur certain : 0 occurrence dans §1 |
| Coût double nommé | ✅ | chaque ombre contient « Le coût pour toi : » ET « Le coût pour l'autre : » (20/20, les deux nommés explicitement) |
| Rappels en toutes lettres (jamais un code) | ✅ | 48 citations entre guillemets, verbatim du 01-tableau-des-items.md — scan anti-code : 0 occurrence de « Q1.1- » dans §1 ; l'ancre_item reste un champ moteur (FM-017) |
| Zéro interdit lexical | ✅ | scan §1 : « tu es unique » 0 · « tu mérites » 0 · « l'univers » 0 · « toujours » 0 · « jamais » 0 · superlatif sans preuve 0 · comparaison normative (« plus que la plupart », « mieux que ») 0 · fin d'ombre refermant la plaie 0 |
| Ouvertures non identiques entre variantes A/B | ✅ | les 10 couples A/B ouvrent différemment : A ouvre sur une scène de vie à deux, B ouvre sur le mécanisme — aucune 1re phrase partagée |
| Ombre en couple exclusivement | ✅ | chaque ombre contient UN exemple de vie à deux daté et situé (verrou d'ombre n°1, FM-017) — 20/20 |
| Zéro métadonnée visible dans §1 | ✅ | aucun code (Q1.1-…), aucun sigle (O/C/E/A/S, QFI, SIG, DTM, EC), aucun score, aucun seuil dans les textes des briques |
| Q1.1-48 non cité | ✅ | rappel suspendu (note d'audit 03, arbitrage comité en cours) — aucune brique ne l'utilise (§3) |

---

## TABLE DE FICHIERS (format P1)

═══ FICHIER : Livrable des mondes/M1-1.1-Ta-Personnalite/07-miroir.md ═══
(écrit directement sur disque — accès FS ; la présente table consigne la livraison)
═══ FIN FICHIER ═══

> Livraison : 07-miroir.md — livrable 7 du dossier M1-1.1-Ta-Personnalite · miroir de quête (étage 2), 20 briques paramétrées (5 dimensions × 2 niveaux × 2 variantes) · aucun fichier 00→06 modifié · aucune opération git.

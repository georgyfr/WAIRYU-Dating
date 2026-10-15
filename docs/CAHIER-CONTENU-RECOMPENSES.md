# CAHIER DE CONTENU — Les récompenses qui se présentent elles-mêmes

**Version :** v1.0 (2026-10-15) — **à valider par le fondateur avant intégration**
**Déclencheur :** consigne fondateur du 2026-10-15 — *« ces cartes ont toutes le même texte, j'en déduis qu'elles ne sont pas sérieuses. Chaque carte, sceau, gain et histoire doit dire clairement ce qu'il fait, dans quel contexte l'utiliser et comment l'utiliser. »*
**Portée :** DESIGN + CONTENU. Aucun code touché (dépôt absent depuis le 10e reset — jetons perdus). Le correctif s'appliquera au prochain re-clone, staging d'abord, prod sur feu vert. Prod actuelle : 40e8f425.
**Ligne rouge conservée :** les verbatim des quêtes (items, passation, textes des cartes lumière/ombre/tension) ne sont JAMAIS modifiés — on les **affiche**, on ne les réécrit pas. Les moules de la modal « À quoi ça sert » sont de la couche app : ce sont eux qu'on corrige.

---

## §0. Le diagnostic — preuve extraite du bundle prod (40e8f425)

La modal « À quoi ça sert » de l'écran Récolte est un **moule par TYPE**, pas par élément. Le bundle contient 9 moules génériques partagés par tous les exemplaires du même type :

| Type | Moule actuel (texte identique pour tous) | Exemplaires | Donnée propre disponible ? |
|---|---|---|---|
| **Carte-découverte** | « La réponse de ton voyage à une question sur toi — ta lumière, ton ombre, ta tension. » + 3 puces fixes | 1 par quête complétée (les archétypes V) | **OUI — déjà dans le bundle** : chaque variante porte son verbatim `lumiere / ombre / tension` (ex. « L'Apprenti·e » : *« Tu es en train d'apprendre à connaître ce qui bouge en toi… »*). La modal ne l'affiche pas. |
| **Écran de passage** | « Une étape du parcours qui ne produit pas de carte — elle produit de la confiance. » | tous les écrans | Non — à rédiger par écran (§3.2). |
| **Fragment du portrait** | « La pièce du portrait que ce mois du voyage t'a donnée. » | 1 par mois/monde | Partiellement — le jalon cible existe (§3.3). |
| **Sceau du monde** | « La marque du mois que tu as traversé. » | 1 par monde (Le Miroir, Le Volant, La Boussole…) | Les noms de mondes existent ; les textes propres à rédiger (§3.4). |
| **Pass** | « Un pass facilite une action précise de la plateforme. » + exemple fixe | par pass | À rédiger par pass (§3.5). |
| **Crédits (Lucioles)** | « Une réserve d'actions pour la plateforme. » | unique | Moule acceptable mais à préciser avec le solde et les usages réels (§3.6). |
| **Récolte du mois** | « Un mois du voyage — ses découvertes, son fragment, son sceau. » | 11 | À enrichir de ce que CE mois a contenu (§3.7). |
| **Niveau du voyage** | « Un niveau de ta récolte — ce qu'il débloque pour toi. » | par niveau | À brancher sur la liste réelle des déblocages (§3.7). |
| **6 jalons** (La Carte → La Rencontre) | **Déjà différenciés** — chaque jalon a sa description propre | 6 | Conformes à l'exigence (audit §3.8). |

**Conclusion :** le fondateur a raison sur le fond — et la bonne nouvelle est que la moitié du contenu propre **existe déjà dans les données** (verbatim des cartes, noms des mondes, descriptions des jalons). Le problème est un problème d'affichage : la modal montre le type, pas l'élément. Seconde anomalie relevée à l'occasion (§5) : une chaîne paywall sur l'ouverture des mois, en tension avec la spec gravée.

---

## §1. La grille des 3 réponses (l'exigence fondateur, formalisée)

Toute récompense — carte, sceau, gain, pass, fragment, histoire — doit répondre **sur son propre écran** aux 3 questions, dans cet ordre :

1. **Ce que c'est.** Une phrase concrète, propre à CET élément. Interdits : la catégorie vide (« un gain du voyage »), le jargon (« ressource de plateforme »), la promesse de résultat.
2. **Où ça agit.** Le contexte de rencontre réel : ton Portrait ? le matching ? ton profil ? la conversation ? un événement ? Si l'élément n'agit nulle part encore, on le dit et on dit quand ça viendra.
3. **Comment s'en servir.** Le geste concret du membre : quoi toucher, quoi relire, quoi montrer — et **qui voit quoi** (la visibilité toujours explicite : rien n'apparaît sans décision).

**Règles d'écriture (héritées du canon D7 et des gardes §8 de la spec) :**
- Le nom de l'élément apparaît dans la fiche ; jamais « cet élément ».
- Chaque fiche est **différenciante** : elle dit ce que CET exemplaire a de particulier. Si deux exemplaires d'un type peuvent porter la même fiche, la fiche est ratée.
- Jamais un score, jamais un chiffre de compatibilité, jamais « débloque ton vrai amour » (D8, D9).
- La visibilité est énoncée mot pour mot : « tu décides » / « visible sur ton profil » / « personne ne voit ».
- Le footer anti-score du moule actuel — « Ce n'est ni un score, ni un diagnostic : une tendance mesurée sur tes réponses. » — est conservé tel quel sur les fiches qui mesurent quelque chose.
- Les 3 réponses tiennent sur un écran mobile ; le verbatim long (lumière/ombre/tension) se replie derrière « Ta carte en entier ».

---

## §2. Cartographie des récipients (où les fiches se montrent)

1. **Modal « À quoi ça sert »** (l'écran de la capture) : la fiche complète — les 3 réponses.
2. **Tuile de la liste Récolte** : titre + une ligne propre (« Touche pour voir à quoi ça sert » reste le comportement).
3. **Historique / « Mon histoire de voyage »** : chaque entrée date, situe (monde, mois, jalon) et dit ce que l'événement a donné — pas seulement « Fragment de portrait ajouté » mais « Fragment ajouté : la pièce Le Miroir (11 quêtes du monde 1) ».
4. **Notifications** : « Nouvelle découverte : {nom} » — déjà propre, conservé.

---

## §3. Le correctif, type par type

### 3.1 Carte-découverte — brancher le verbatim existant (priorité 1)

**Gabarit de la modal (variables entre {accolades}, toutes déjà présentes dans les données du bundle) :**

> **CARTE-DÉCOUVERTE — {nom de la carte}** · {nom de la quête}
> {Mois n sur 11 · Obtenu le date} *(inchangé)*
>
> **Ce que c'est.** {lumière condensée : les 1-2 premières phrases du verbatim de la carte}.
>
> **Ta carte en entier** *(repliable — verbatim intégral, non modifié)* :
> — Ta lumière : {lumiere}
> — Ta zone d'ombre : {ombre}
> — Ta tension intérieure : {tension}
>
> **À quoi ça sert dans les rencontres.**
> • Elle nourrit ton Portrait sur le terrain de {territoire de la quête} : c'est lui qui travaille tes compatibilités — expliqué, jamais noté.
> • Elle donne à l'autre un vrai point de départ : une tendance à te ressembler, pas une étiquette.
> • Sa tension — « {tension} » — peut devenir une Clé : un sujet de conversation prêt, si tu le veux.
>
> **Comment l'utiliser.** Relis-la quand {situation propre au territoire}. Elle ne part nulle part sans toi : tu choisis si elle se voit et quand.
>
> *Ce n'est ni un score, ni un diagnostic : une tendance mesurée sur tes réponses.* *(footer conservé)*

**Exemple rédigé et prêt à intégrer — « L'Apprenti·e » (quête « Tes émotions »), avec le verbatim réel branché :**

> **Ce que c'est.** Ta réponse à « Tes émotions » : tu es en train d'apprendre à connaître ce qui bouge en toi — un chantier qui rapporte à chaque étape. Parfois clair, parfois embrouillé : c'est le rythme normal.
>
> **Ta carte en entier.** Ta lumière : tout ce qui s'apprend t'attend. Ta zone d'ombre : ne confonds pas « je ne sais pas ce que je ressens » et « je ne ressens rien » — la deuxième phrase est presque toujours fausse. Ta tension : avancer sans exiger d'arriver.
>
> **À quoi ça sert dans les rencontres.** • Elle nourrit ton Portrait sur le terrain des émotions — repérer tôt, distinguer les états proches, réguler, exprimer. • Elle donne à l'autre un vrai point de départ : une tendance à te ressembler, pas une étiquette. • Sa tension — « avancer sans exiger d'arriver » — peut devenir une Clé : un sujet de conversation prêt, si tu le veux.
>
> **Comment l'utiliser.** Relis-la quand une émotion te surprend ou te dépasse. Elle ne part nulle part sans toi : tu choisis si elle se voit et quand.

*(Aucun verbatim réécrit : lumière/ombre/tension citées intégralement — seules les puces et les lignes « Comment l'utiliser » sont de la couche app.)*

### 3.2 Écran de passage — une fiche par écran (priorité 2)

Gabarit : **Ce que c'est.** Une étape sans carte : {ce que tu y as fait — une phrase propre à l'écran}. **Où ça agit.** {ce que ça prépare concrètement — ex. « ton seuil de fragments pour ouvrir un jour la voix »}. **Comment.** {le geste — ex. « tu y reviens quand tu veux ; ce que tu y as posé reste modifiable »}.
Le moule actuel (« produit de la confiance ») peut rester en intro commune, suivi des 3 réponses propres. **Le texte propre de chaque écran est à rédiger avec la liste réelle des écrans de passage au moment de l'intégration** — il n'est pas devinable depuis le bundle seul.

### 3.3 Fragment du portrait — nommer le territoire (priorité 1)

Gabarit : **Ce que c'est.** La pièce {territoire} de ton Portrait — celle que {monde/jalon} vient d'ajouter. **Où ça agit.** Assemblé, ton Portrait est ce que voient d'abord les personnes compatibles avec toi. **Comment.** Rien à faire : il s'assemble seul. Relis ta page Portrait pour voir ce que ça change.
Le nom du fragment affiché dans la liste devient « Fragment — {territoire} », jamais « Fragment » seul.

### 3.4 Sceau du monde — un texte par monde (priorité 1)

Un sceau n'est pas « la marque d'un mois » : c'est la marque d'un **territoire traversé**. Trois textes rédigés d'après les contenus réels :

- **Sceau — Monde 1, Le Miroir.** *Ce que c'est.* La marque du monde où tu as répondu à « qui es-tu, comment fonctionne-tu » : ta carte de base, tes émotions, ton rapport au temps, tes forces et tes fragilités — lumière et ombre. *Où ça agit.* Sur ton profil (si tu le laisses visible), il témoigne que ton Portrait est nourri par un voyage complet — un profil qui voyage inspire confiance. *Comment.* Rien à faire : posé pour toujours, il ne s'achète pas et ne se perd pas — il se traverse.
- **Sceau — Monde 2, Le Volant.** *Ce que c'est.* La marque du monde où tu as regardé comment tu prends les commandes : tes élans, ton rapport au temps, ce que tu cueilles tout de suite et ce que tu laisses mûrir. *Où ça agit et Comment.* — identiques au Monde 1 (la partie « profil/confiance/se traverse » est commune à tous les sceaux ; seule la description du territoire change).
- **Sceau — Monde 3, La Boussole.** Gabarit identique, territoire à rédiger quand le monde sera finalisé. **Règle : un sceau ne se montre jamais sans sa description de territoire.**

### 3.5 Pass — la fiche utilitaire (priorité 3)

Gabarit : **Ce que c'est.** {Nom du pass} : il {action précise en une phrase}. **Où ça agit.** {l'écran exact où il s'emploie}. **Comment.** Tu en as {n} ; chaque usage {effet + durée} ; il {ce qu'il ne fait jamais — pas de compatibilité, pas de contournement}. La liste des passes actifs s'affiche avec leurs compteurs.

### 3.6 Crédits (Lucioles) — préciser avec les usages réels (priorité 3)

**Ce que c'est.** Tes {solde} Lucioles : gagnées en voyageant, dépensées en rituels. **Où ça agit.** La liste réelle et à jour des actions qu'elles goûtent (avec leurs coûts affichés) — et la phrase garde : « elles ne s'échangent jamais contre une meilleure compatibilité ». **Comment.** Tu dépenses librement ; ton solde et tes usages vivent dans ta récolte.

### 3.7 Récolte du mois & Niveau du voyage — dire ce que ça contient/débloque (priorité 2)

- **Récolte du mois n** : « Ce mois t'a donné : {x} cartes (noms), 1 fragment (territoire), 1 sceau (monde) — avec les liens vers chaque fiche. » La chaîne « Ce que ce mois te réserve » (mois à venir) liste honnêtement ce qui y sera gagné.
- **Niveau du voyage n** : « Ce niveau débloque : {liste réelle des déblocages} » — jamais « ce qu'il débloque pour toi » sans la liste.

### 3.8 Les 6 jalons & l'histoire de voyage (priorité 2)

- **Jalons** : déjà conformes (chaque jalon a sa description propre). Audit léger à l'intégration : vérifier que chaque desc répond aux 3 réponses (La Carte et La Rencontre le font ; compléter si besoin).
- **Mon histoire de voyage** : chaque entrée devient « {Type} — {nom propre} · {monde/mois} · {ce que ça a donné en une ligne} ». Ex. : « Fragment ajouté — pièce Le Miroir (11 quêtes du monde 1) » au lieu de « Fragment de portrait ajouté ».

---

## §4. Plan d'intégration (au prochain re-clone)

1. Re-cloner le dépôt + re-synchroniser les docs de `my-project/docs/` (plan en `PLAN-RECONSTRUCTION-WAIRYU.md`).
2. Remplacer les 9 moules i18n par les fiches de ce cahier (FR puis EN — l'EN suit la validation FR, comme les info-bulles §5 de la spec).
3. Brancher les données propres : `{lumiere/ombre/tension}` par variante (déjà dans le bundle), `{nom du monde}` par sceau, `{territoire}` par fragment, listes réelles pour crédits/niveaux/mois.
4. Rédiger avec le fondateur les textes manquants : écrans de passage (§3.2), sceau Monde 3 (§3.4), listes de déblocages (§3.7).
5. Tests : relire chaque fiche depuis un compte réel ; vérifier qu'aucune fiche de même type se répète mot pour mot ; FR/EN ; mobile.
6. **Staging d'abord (123ca8cb), prod (40e8f425) sur feu vert explicite seulement.**

---

## §5. Signal d'alerte — une chaîne paywall en tension avec la spec (à trancher)

Le bundle prod contient : **« Ce mois s'ouvrira avec l'abonnement mensuel — {{prix}}/mois. »** (affichée pour un mois non encore ouvert) et « L'ouverture des paiements arrive bientôt… ».

- Si les mois du voyage ne s'ouvrent qu'avec l'abonnement, alors **le voyage n'est pas gratuit** — en contradiction directe avec **D18 gravée** (« le gratuit couvre tout le parcours »), avec l'anti-pitch du Fanal (« il n'est pas nécessaire pour aimer : le voyage entier reste gratuit »), et **contradictoire avec le même bundle** qui affiche « La Rencontre n'est jamais payante — elle se franchit en voyageant » (si chaque franchissement est payant, la Rencontre l'est de fait).
- **Deux issues possibles** : (a) placeholder à retirer — le voyage s'ouvre gratuitement, l'abonnement épargne l'attente (spéc v1.4, D18-D20) ; (b) le fondateur a choisi un modèle d'accès mensuel au voyage — alors la spec doit être révisée honnêtement (D18 réécrite, l'anti-pitch du Fanal reformulé, et la promesse affichée en prod corrigée), décision fondateur expresse avant tout déploiement.

**Rien n'est changé en prod.** Le point est porté à la décision du fondateur.

---

## §6. [À VALIDER] par le fondateur

1. La grille des 3 réponses (§1) et son ordre d'affichage.
2. Le gabarit carte-découverte + l'exemple « L'Apprenti·e » (§3.1).
3. La règle « fiche différenciante » : deux fiches d'un même type ne se répètent jamais mot pour mot.
4. Les textes sceaux Monde 1 et Monde 2 (§3.4) ; Monde 3 à rédiger plus tard.
5. La tension paywall (§5) : (a) retirer le verrou des mois, ou (b) réviser la spec — décision expresse.
6. La visibilité des sceaux sur profil : visible par défaut ou sur choix ? *[recommandation : sur choix, cohérente avec « rien n'apparaît sans toi »]*

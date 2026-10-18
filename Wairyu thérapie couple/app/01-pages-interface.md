# Wairyu — Pages d'interface de l'application : « Le Voyage vers l'autre rive »

> **Document de conception UI/UX v1.0** · 18/10/2026 · Mission WTC-APP-01
> Fondé sur le programme WTC (RIO-01 à RIO-16) et le logo Wairyu.
> Ce document décrit chaque page de l'application : son rôle, son contenu, ses interactions et son lien au voyage.

---

## 🎨 Identité visuelle (issue du logo)

Le logo représente **deux visages face à face formant un cœur**, séparés et reliés par **trois points** — un bleu, un bleu clair, un rouge. C'est la métaphore même du programme : deux personnes, un lien, et l'eau qu'il faut traverser pour se rejoindre (« Wairyu » : l'eau, le courant, l'autre rive — RIO-15 « Mon premier pas vers l'autre rive »).

| Élément | Couleur (hex) | Usage dans l'application |
|---|---|---|
| **Nuit-fond (Profond)** | `#1A2332` | Fonds d'écran, en-têtes, texte principal. La couleur de la tête gauche : ce que l'on porte en soi, l'intériorité. |
| **Turquoise (Courant)** | `#6DD5C0` | Boutons primaires, progression, liens, validations. La couleur de la tête droite : le mouvement, l'énergie du courant. |
| **Brume (Clair)** | `#E6F7FF` | Arrière-plans de cartes, zones de respiration, surface de l'eau. |
| **Corail (Blessure)** | `#FF6B6B` | Points d'attention, tensions, zones de vigilance — JAMAIS un verdict. Utilisé avec parcimonie. |

**Principes** :
- Le **voyage** structure tout : l'utilisateur ne « suit pas des modules », il **navigue d'une rive à l'autre**. La carte principale est un fleuve.
- Chaque dimension validée du programme (Attachement, Émotionnelle, Santé mentale, Générationnelle) est un **bassin du fleuve**, chaque quête RIO un **gué** à franchir.
- Jamais de score brut, jamais de jugement du partenaire, jamais de rouge culpabilisant : le corail signale « de l'attention, pas un échec ».
- Typographie douce, formes organiques (ondes, courbes), transitions lentes et aquatiques — l'application doit apaiser, pas stimuler.

---

## 🗺️ Vue d'ensemble du parcours

```
ACCUEIL → RIVE DE DÉPART → CARTES DU VOYAGE (3 DIMENSIONS) → RIVE DE RENCONTRE → PONT (ESPACE COUPLE)
   │                                                      │
   └── Filet de sécurité (accessible PARTOUT)             └── Météo quotidienne, rituels
```

---

## 📱 Les 18 pages de l'application

### PHASE 0 — Arrivée

#### P01 · Écran de lancement
**Rôle** : Première rencontre. Le logo s'anime : les deux visages se rapprochent, le cœur se forme, l'eau ondule.
**Contenu** : logo animé, nom « Wairyu », phrase d'accroche : *« Deux rives. Un courant. Un cœur à reconstruire. »*
**Interaction** : bouton « Commencer mon voyage » (turquoise sur fond nuit) + « J'ai déjà un compte ».
**Ton** : calme, sans urgence commerciale. Une app de paix, pas de conversion.

#### P02 · Création du duo
**Rôle** : Instaurer la règle fondatrice : **chacun répond seul, dans son espace privé**.
**Contenu** : deux options — « Inviter mon/ma partenaire » (code/lien) ou « Commencer seul(e) d'abord ». Explication en une phrase : *« À Wairyu, vous traversez chacun votre rive. Ce que vous partagez, vous le choisissez. »*
**Points clés** : invite sans obligation de duo (l'auto-réparation précède la réparation du couple, conformément à la thèse du programme) ; mention « vos réponses sont privées par défaut ».

#### P03 · Consentement éclairé
**Rôle** : Le contrat de confiance (fichier 02-consentement-eclaire du pilote).
**Contenu** : ce que Wairyu fait / ne fait pas (pas un dispositif médical, pas un diagnostic, pas un substitut de thérapie), données 100 % locales, droit d'effacement, filet de crise expliqué.
**Interaction** : consentement explicite RGPD art. 9, déroulant par sections, refus possible sans blocage du téléchargement.

#### P04 · Le point de départ (RIO d'entrée)
**Rôle** : Première mesure douce : où en êtes-vous ?
**Contenu** : 4-6 questions d'accueil (météo relationnelle, motif de venue) — version courte du RIO d'entrée. Résultat : votre « rive de départ » en langage naturel.
**Interaction** : écran de résultat en prose chaleureuse + proposition du premier itinéraire.

---

### PHASE 1 — La Carte du Voyage (cœur de l'application)

#### P05 · La Carte du fleuve (page principale)
**Rôle** : LA page centrale. Le voyage visible.
**Contenu** : un fleuve stylisé qui traverse l'écran de gauche (rive de départ, vous) à droite (rive de rencontre, le couple). Le courant est turquoise, les rives sont brume. Les **3 bassins** apparaissent successivement : **Attachement → Émotionnelle → Santé mentale** (+ Générationnelle en extension). Chaque **gué** (quête RIO) est une pierre de gué sur le courant — franchie (turquoise pleine), en cours (ondoyante), à venir (en pointillés). Les **3 points du logo** (bleu, turquoise, corail) indiquent votre position, celle du partenaire (si partagé) et les points d'attention.
**Interaction** : tap sur un gué → ouvre la quête. Le gué suivant est toujours mis en avant doucement (« Le courant vous porte vers… »).
**Règle anti-gamification** : pas de streaks, pas de badges, pas de classement. Franchir un gué se célèbre par une **onde** qui traverse le fleuve, silencieuse.

#### P06 · Page d'un gué (intro de quête)
**Rôle** : Poser le cadre de la quête avant les questions.
**Contenu** : nom de la quête (ex. RIO-01 « Comment je me raccroche »), durée annoncée honnêtement (ex. 8-12 min), ce que la quête éclaire, promesse du résultat (frontières nommées, pas de verdict), possibilité de sauvegarder et reprendre.
**Interaction** : « Entrer dans le courant » ou revenir à la carte. Sauvegarde automatique de la progression.

#### P07 · Le questionnaire (page de réponse)
**Rôle** : Le lieu de mesure. Le plus épuré de l'app.
**Contenu** : un item à la fois, grande typographie, échelle de réponse visuelle (marchepieds de gué, pas de cases à cocher cliniques), jauge de progression discrète (une fine ligne turquoise), bouton « pause » permanent.
**Interaction** : retour-arrière possible sans pénalité avant validation de la page (règle anti-piège du programme), aucune question sur le partenaire si la quête est individuelle.
**Détail signature** : à chaque réponse, une très légère ondulation part du doigt — l'eau enregistre.

#### P08 · Lapause (sauvegarde et reprise)
**Rôle** : Respecter le rythme. Une quête peut prendre plusieurs jours.
**Contenu** : reprise au dernier item, rappel doux sans notification agressive (« Le courant attend, il ne presse jamais »).

---

### PHASE 2 — Les rives (résultats)

#### P09 · Le résultat en langage naturel (page clé)
**Rôle** : Le cœur du concept WTC : **aucun score brut, jamais**.
**Contenu** : votre « profil de gué » en 3 parties : (1) *Ce que l'eau montre* — 2-3 phrases en prose sur votre mécanisme (ex. « Quand la peur de perdre te touche, tu cherches des signes de rappel — et quand ils tardent, ton corps le vit comme un danger. ») ; (2) *Tes frontières* — les niveaux nommés du RIO, avec la frontière estimée et sa marge (D-STD : jamais de fausse précision) ; (3) *Un pas concret* — l'action micro-quotidienne de la quête (ex. RIO-05 « Mon premier pas »).
**Interaction** : bouton « Voir ce que ça change pour nous » → partage SÉLECTIF vers l'espace couple ; « Enregistrer dans mon carnet » ; jamais de partage automatique.
**Design** : fond brume, texte nuit, le pas concret encadré turquoise. Le corail n'apparaît que comme filigrane d'attention, jamais comme étiquette.

#### P10 · Le carnet de bord (historique personnel)
**Rôle** : La mémoire du voyage individuel — mes bagages, mes franchissements.
**Contenu** : chronologie des quêtes, re-test 8 semaines (règle du programme : le changement prouvé, RCI), notes personnelles privées, visualisation de l'évolution (courbes turquoise sur fond nuit — reprendre l'esthétique des graphiques de validation du dépôt).
**Interaction** : comparaison avant/après en langage naturel (« Il y a 8 semaines, ton profil était … »).

#### P11 · Le re-test (changement prouvé)
**Rôle** : Mettre la métrique RCI au service de l'utilisateur.
**Contenu** : proposition automatique à 8 semaines, explication douce (« les eaux bougent ; mesurons si le courant a changé »), résultat = « changement fiable / en mouvement / à revoir » — jamais un score.
**Interaction** : si détresse détectée au passage → filet de sécurité propose son aide AVANT l'arbre (règle D-CRISE).

---

### PHASE 3 — Le Pont (espace couple)

#### P12 · Le Pont (page de couple)
**Rôle** : La rive de rencontre. Ce que le couple choisit de se montrer.
**Contenu** : **carte à double entrée des deux profils** si les deux partenaires ont partagé leurs résultats d'une même quête : les deux langages naturels côte à côte (ex. « Toi, tu te raccroches quand la peur monte. Lui/Elle, il/elle se referme quand ça fait trop. ») + la **danse** du couple (RIO-04 « Notre danse ») — poursuite/retrait, sans jamais désigner un coupable.
**Interaction** : chaque partenaire choisit individuellement ce qu'il partage (case par case, révocable). Le pont n'existe que si les deux ont partagé — sinon, la page invite à la patience, jamais à la pression.
**Design** : les deux couleurs de têtes du logo (nuit + turquoise) se rejoignent au centre — le cœur se forme quand les deux profils sont posés.

#### P13 · Les rituels du pont
**Rôle** : Les pratiques concrètes du couple.
**Contenu** : les exercices prescrits par les quêtes (micro-gestes, moments à deux, formulation de besoins D-EXP), agenda doux des moments de lien, météo de couple hebdomadaire (2 questions, 20 secondes).
**Interaction** : rappels configurables MAIS jamais insistant ; suggestion de « moment sans écran » (fidèle aux items E-B2).

#### P14 · La météo quotidienne
**Rôle** : Le petit geste quotidien (fonds de commerce des apps de couple, mais version Wairyu : intime, pas gamifiée).
**Contenu** : une question par jour à chaque partenaire (météo intérieure — RIO-06), réponse en 3 secondes (icônes de temps : soleil/nuage/pluie/orage sur l'eau).
**Interaction** : les deux météos se révèlent mutuellement le soir SI les deux ont répondu — sinon rien. Jamais de comparaison publique, jamais de streak.

---

### PHASE 4 — Sécurité et réglages

#### P15 · Le filet (page de sécurité)
**Rôle** : Le court-circuit de crise (règle D-CRISE). **Accessible depuis TOUTES les pages** — icône point corail discret, toujours au même endroit.
**Contenu** : ouverture immédiate (une question de 2 items) ; si détresse : numéros d'urgence (3919/3114 en France, équivalents locaux par pays), message apaisant, **arrêt du parcours de couple** (« En tempête, on ne franchit pas de gué : on s'abrite. »), renvoi vers professionnels.
**Règle absolue** : JAMAIS de pas de couple en crise. Le filet se déclenche AVANT l'arbre de décision, avant tout calcul, avant tout affichage de profil.
**Design** : fond nuit, texte brume, un seul bouton corail « Trouver de l'aide maintenant ».

#### P16 · Mode discret
**Rôle** : Protection des utilisateurs en situation de violence ou de surveillance.
**Contenu** : mode camouflage (l'app ressemble à une app banale), effacement rapide des données, PIN de sécurité, pas d'icônes reconnaissables dans les notifications.
**Interaction** : activable depuis le filet et depuis les réglages.

#### P17 · Réglages et données
**Rôle** : La maîtrise totale par l'utilisateur.
**Contenu** : export (portable), effacement (immédiat et vérifié), langues, partage/suspension du duo, préférences de notifications, information RGPD (registre des traitements — chantier C).
**Règle** : tout est local par défaut ; chaque fonctionnalité réseau est opt-in explicite.

#### P18 · Le profil du voyageur
**Rôle** : Qui je suis dans le voyage.
**Contenu** : prénom (ou pseudonyme), avatar (silhouette de la tête du logo, teintée nuit ou turquoise), dimensions franchies, **réserve de croissance** (pas de score global — une phrase : « Tu as traversé 2 bassins sur 3. Le courant continue. »), réglages individuels de confidentialité.
**Interaction** : gestion des invitations (P02), possibilité de marquer une pause (« Le fleuve ne s'impatiente pas »).

---

## 🧭 Table de correspondance programme → pages

| RIO / composant du programme | Page(s) |
|---|---|
| RIO-01 à RIO-05 (Attachement) | Gués du bassin 1 sur la carte (P05) |
| RIO-06 à RIO-10 (Émotionnelle) | Gués du bassin 2 + météo (P14) |
| RIO-11 à RIO-15 (Santé mentale) | Gués du bassin 3 |
| RIO-16 (Générationnelle) | Bassin 4 (extension à venir) |
| Frontières nommées + décision conservatrice | P09 (résultat en langage naturel) |
| Re-test 8 semaines + RCI | P10, P11 |
| Danse du couple (RIO-04) | P12 (le pont) |
| D-CRISE (filet 3919/3114) | P15 |
| Mode discret / violence | P16 |
| D-EXP (formuler un besoin) | P13 |
| RIO d'entrée (VALID-01) | P04 |

---

## 🚧 Ce que ce document ne fait pas (encore)

- Ce document **décrit et structure**, il ne maquette pas : la prochaine étape est de produire les maquettes visuelles page par page (wireframes puis écrans haute-fidélité à l'identité turquoise/nuit).
- Les textes exacts (microcopies, phrases de résultats) seront produits avec la rigueur du programme (règle : toute phrase d'affichage est validée comme un item, car une phrase blessante affichée à un moment vulnérable est une faute d'orchestrateur).
- L'architecture technique (local-first, chiffrement) fera l'objet d'un document séparé (chantier C du WTC-LEGAL-01).

---

*Document à mettre à jour à chaque nouvelle dimension validée. Le logo reste la boussole : deux visages, un cœur, un courant.*

# LIVRABLE 1 — SPÉCIFICATION FONCTIONNELLE : LES QUATRE SERVICES DU RENDEZ-VOUS

> element : 8.6 « Les services du rendez-vous » · fiche : 01 — les quatre services
> 🆓 GRATUIT · P2 · match · **0 item** (fonctionnalités) · les formulations de sécurité sont
> des PROPOSITIONS — verrou humain [9], À VALIDER PAR LE COMITÉ.
> Les placeholders d'écrans sont descriptifs — texte non définitif, à habiller par le design.

---

## a) LE CHECK-IN SÉCURITÉ AVANT DATE

> **GRATUIT ET PERMANENT** — engagement manifeste (03) : un service de sécurité ne se vend pas,
> ne se conditionne pas, ne se gamifie pas.

### L'objet

Avant un rendez-vous pris à la suite d'un match : la personne décrit **qui part où, quand,
avec qui** ; elle prévoit son retour ; elle désigne qui prévenir si elle ne donne pas de
nouvelles. L'app la rappelle au moment du retour ; si le silence dure, l'alerte part au
contact choisi — et à personne d'autre.

### Les données du check-in (déclarées par la personne, au choix)

| Donnée | Déclaration |
|---|---|
| Qui part | toi (le compte actif) |
| Où | le lieu du rendez-vous (libre, aussi vague que voulu) |
| Quand | heure de départ + **heure de retour estimée** (une valeur par défaut est proposée, modifiable) |
| Avec qui | le prénom (ou un surnom) du rendez-vous — laissable en blanc |

Les informations restent dans l'espace de la personne ; elles ne partent qu'aux canaux
qu'elle a choisis à l'activation (ci-dessous).

### Le flux (six temps — PROPOSITION, comité)

1. **Activation** (avant le départ) : la personne décrit le rendez-vous (table ci-dessus) et
   règle son retour. Trente secondes, un écran.
2. **Le canal d'alerte, choisi À L'ACTIVATION** : un **contact de confiance** (nom + moyen de
   contact, désigné par la personne — consentement EXPLICITE recueilli à l'activation,
   révocable à tout instant) ET/OU le **signal à l'app** (le canal interne du service). Si
   aucun contact n'est désigné, le signal à l'app est le canal par défaut. Le contenu exact
   du signal et le suivi humain derrière : **À VALIDER PAR LE COMITÉ** (verrou sécurité).
   Réglage fin proposé : prévenir le contact d'avance (il reçoit le plan du rendez-vous) ou
   au déclenchement (il ne reçoit le plan qu'avec l'alerte) — défaut : au déclenchement.
3. **Rappel avant le départ** : une notification douce (« ton check-in est prêt »), une
   seule, désactivable dans les réglages.
4. **À l'heure de retour estimée** : l'app demande « tu es bien ? ». **Une réponse referme le
   check-in — rien ne part, personne n'est prévenu, aucune trace.**
5. **Sans réponse** : une relance interne (une seule, à l'écran et en notification, décalée
   d'un délai défini à l'activation) ; puis, au terme du délai défini à l'activation,
   **l'alerte part au moment défini si aucun « je suis bien »** : au contact de confiance
   désigné, et/ou en signal à l'app — selon le réglage de l'activation.
6. **Clôture** : réponse, levée d'alerte (le faux positif se corrige d'un tap — le contact
   reçoit la levée), ou épuisement du flux ; les données du rendez-vous se purgent
   (rétention courte — 02/03).

### Les garde-fous (gravés)

- **Aucune alerte automatique vers des tiers sans consentement explicite à l'activation** :
  l'entourage, un service d'urgence, un tiers quelconque — rien ne part sans un choix fait
  par la personne à l'activation, en connaissance de cause (qui sera prévenu, de quoi, quand).
- **Le contact de confiance ne reçoit rien d'avance** sans ce même consentement : le flux
  d'alerte appartient à la personne, du début à la fin.
- **Le check-in ne produit aucun score** : un service, pas une mesure — personne n'est
  évalué pour avoir activé, répondu tard ou oublié ; la trame de sécurité du moteur reste
  invisible (Constitution [2]).
- **L'alerte n'est pas une punition du silence** : une soirée qui s'éternise se corrige
  d'un tap (« je suis bien » ou « je repousse mon retour »).

### Placeholders d'écrans (descriptifs — texte non définitif)

| Écran | Placeholder |
|---|---|
| Activation | « [Où, quand, avec qui — trente secondes. Qui prévenir si tu ne donnes pas de nouvelles ?] » |
| Rappel avant départ | « [Tu pars bientôt — ton check-in est prêt.] » |
| Demande de retour | « [Tu avais prévu minuit — tu es bien ?] » |
| Alerte partie | « [Ton contact a été prévenu. Voici ce qu'il a reçu.] » |

---

## b) LE COACH DE CONVERSATION

### L'objet

Des **propositions douces pour démarrer ou relancer** une conversation — pour les moments
où les mots manquent. Le Coach s'appuie sur **8.1 « Les questions qui rapprochent »**
(36 questions, 3 niveaux, missions progressives à deux) : il propose une question du niveau
atteint par la conversation, reformulée en amorce.

### La règle d'or : des amorces, pas des scripts

- **Aucun message « prêt à copier » massifié.** Une amorce ouvre la parole à la personne
  (« une question que certains posent : est-ce que ton travail te ressemble ? ») ; un script
  la remplace (un texte prêt à envoyer qui parle à la place de la personne). Le Coach ne
  produit que des amorces — courtes, sans destinataire pré-écrit, sans suite suggérée.
- Les amorces sont tirées des niveaux de 8.1 ; le niveau intime (niveau 3) ne se propose que
  si la conversation l'a atteint (les étages de révélation se respectent, ici comme partout).
- **Le Coach ne mesure personne** : ouvrir le Coach ne dit rien de la personne ; les
  propositions ne notent ni la conversation ni les personnes (zéro « niveau de dialogue »).

### Le mécanisme

- **À la demande** : la personne ouvre le Coach — aucun popup spontané, aucune notification
  de relance de propositions.
- **En petit nombre** : 2-3 amorces à la fois, renouvelées sobrement ; le Coach ne charge
  pas la conversation d'obligations.
- **Désactivable** : un interrupteur clair (réglages de la conversation) ; désactivé, le
  Coach n'existe plus nulle part — aucun fantôme, aucun conseil non demandé.

### Ce que ce n'est pas (liste fermée)

Pas un ghostwriter (il n'écrit pas à ta place) · pas un calcul de « meilleure réplique »
(zéro optimisation d'engagement) · pas une relance (une conversation lente est une
conversation normale — aucune notification pour « relancer ») · pas un score de conversation.

---

## c) LES CARTES DE DIALOGUE

### L'objet

Des **amorces de conversation tirées du voyage de chacun** : quand deux matchs ont parcouru
des quêtes et en ont exposé des extraits, une carte peut suggérer un sujet qu'ils partagent.

### La règle de consentement (gravée)

- **Rien ne révèle un contenu sans le consentement de son auteur.** Une carte n'existe que
  si le thème a été **exposé par LES DEUX** (les extraits opt-in de l'étage de restitution
  [7] : chacun décide de ce qui s'expose) ; ce qui n'est pas exposé ne devient pas une carte.
- **La carte nomme le thème, elle ne cite aucune réponse** : « Vous avez tous les deux
  répondu à “Ton humour” — un sujet vous attend. » Le contenu des réponses, la nuance de
  chaque côté, les divergences : rien de tout cela n'apparaît sur une carte.
- **Le respect des étages de révélation** : une carte ne franchit pas un étage — rien du
  bloc intime (M8/M9), rien d'un étage non atteint, rien d'un opt-in non posé. Les cartes
  vivent aux étages déjà exposés, point.

### Le mécanisme

- Un petit nombre de cartes à la fois (2-3), dans la conversation ; une carte se passe d'un
  tap — et elle ne se repose pas.
- **Désactivables** : un interrupteur global (réglages de la conversation) ; les cartes
  disparaissent d'un seul geste, sans conséquence.
- **Les cartes ne notent personne** : une conversation qui n'emprunte pas ses cartes est une
  conversation normale — zéro suivi, zéro statistique d'usage rendue à qui que ce soit.

### Homonymie désamorcée

Les **cartes de dialogue** (service) ne sont pas les **cartes de variante** du gabarit de
production (restitution de quête) : aucune variante, aucune restitution analytique — des
amorces de conversation, gouvernées par le consentement des étages (00, divergence table).

---

## d) LE FEEDBACK POST-DATE

### L'objet

Un **court retour volontaire après un rendez-vous** — s'est-il bien passé ? revoir ? — qui
apprend au moteur (02 : North Star + calibration) sans juger les personnes.

### Le formulaire (30 secondes — opt-in à chaque date)

| Question | Réponses (échelle douce verbale) |
|---|---|
| « Ça s'est bien passé ? » | oui, beaucoup · oui · mitigé · non |
| « Vous revoir ? » | oui · à voir · non |
| (optionnel) « Quelque chose à nous dire ? » | une case libre courte — optionnelle, sans relance |

- **Opt-in à chaque date** : l'app propose une fois après une date déclarée dans le check-in
  (si elle a eu lieu) ; sans réponse, aucune relance — le silence ferme le sujet.
- **Désactivable** : on peut refuser de voir la proposition de feedback après chaque date
  (réglage), et répondre à certaines dates sans répondre à d'autres.
- **La case libre est humaine** : si elle est remplie, elle peut être lue par l'équipe pour
  la modération et la sécurité (règles de conduite) — elle n'entre dans aucun calcul de
  calibration textuelle automatisée (aucune analyse de texte au moteur à ce stade — cadrage
  produit, comité).

### Ce que ça alimente (et ce que ça n'alimente pas)

- **Côté moteur** : la North Star (la boucle match → conversation → rendez-vous) et la
  calibration des poids (02) — en **agrégats**, après dissociation d'identité : le retour
  est pseudonymisé à l'entrée du pipeline d'apprentissage, puis agrégé (la donnée nominative
  vit le temps d'un comptage) — **À VALIDER PAR LE COMITÉ/juridique**.
- **Anonymisé côté moteur** : aucun membre n'est identifiable dans une calibration ; les
  poids se recalibrent, les personnes non.
- **Aucune restitution à l'autre comme un jugement** : ton retour ne parvient pas à ton
  rendez-vous — il ne reçoit ni note, ni avis, ni indice, ni « réputation » ; les deux
  membres n'ont aucune vue de l'un sur le retour de l'autre.
- **Aucune conséquence visible** : aucun compteur de réussite sur un profil, aucun badge,
  aucun conseil non demandé, aucune modulation de visibilité déduite d'un retour (02 :
  zéro pression de performance).

### Ce que ce n'est pas (liste fermée)

Pas une note de personne (ni note donnée, ni note reçue) · pas une « réputation de date » ·
pas un canal de plainte (la sécurité et la modération ont leurs propres entrées, hors
calibration) · pas un engagement (le retour se donne ou se tait, sans rappel) · pas une
métrique de personne (02 : les agrégats apprennent au produit, ils ne notent pas les gens).

---

## Récapitulatif des interrupteurs (design)

| Service | À la demande | Interrupteur | Relance |
|---|---|---|---|
| Check-in sécurité | oui (activation manuelle) | réglages (rappel avant départ désactivable) | une relance interne au flux d'alerte (délai défini à l'activation) |
| Coach de conversation | oui (ouverture manuelle) | oui (réglages de conversation) | aucune |
| Cartes de dialogue | oui (présence dans la conversation) | oui (réglages de conversation) | aucune (une carte passée ne se repose pas) |
| Feedback post-date | oui (proposition une fois par date) | oui (réglages) | aucune |

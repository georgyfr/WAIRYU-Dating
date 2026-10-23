# P05 · La Carte du fleuve — Phase 1 (Cœur de l'application)

**Fichiers** : `P05-carte-du-fleuve.html` (maquette interactive), `P05-carte-du-fleuve.png` (vue complète avec panneau de justifications), `P05-carte-du-fleuve-phone.png` (rendu format téléphone).

> **Cette page est proposée comme nouvelle page d'accueil de l'app réelle**, en remplacement de l'accueil actuel du staging (`wairyu-staging.wairyu.workers.dev`) qui présente des promesses de matching (dating) incompatibles avec un processus thérapeutique. Ici, on ne parcourt pas des profils : on reprend son voyage là où l'eau attend.

## Rôle
LA page centrale : rendre **le voyage visible**. L'utilisateur ouvre l'app et voit immédiatement où il en est, sans pression de performance.

## Contenu (fidèle à `01-pages-interface.md`)
- Fleuve stylisé traversant l'écran de gauche (**rive de départ**, vous) à droite (**rive de rencontre**, le couple). Courant turquoise, rives brume.
- **3 bassins successifs** : Attachement → Émotionnelle → Santé mentale (+ Générationnelle en extension).
- Chaque quête RIO est un **gué** (pierre sur le courant) à trois états : franchi (turquoise pleine), en cours (halo pulsé/ondoyant), à venir (pointillés).
- Les **3 points du logo** indiquent : votre position, celle du partenaire (si partagé), les points d'attention.
- Salutation en prose calme : *« Où le courant vous porte aujourd'hui »*.
- Carte unique mise en avant : **« Le courant vous porte vers… RIO-04 · Notre danse »**.
- Icône **Filet de sécurité** (P15) toujours visible — jamais enfouie dans un menu.

## Interaction
- Tap sur un gué → ouvre la quête (P06 intro, puis P07 questionnaire).
- Le gué suivant est mis en avant **doucement** — une seule proposition, jamais une liste de tâches.

## Règle anti-gamification (non négociable)
Pas de streaks, pas de badges, pas de classement, pas de pourcentage de complétion. Franchir un gué se célèbre par une **onde silencieuse** qui traverse le fleuve.

## Justifications UX / thérapeutiques
- **Carte plutôt que dashboard** : la métaphore spatiale (bassins, gués) donne une mémoire de progression corporelle et narrative, plus juste en thérapie qu'une barre de progression chiffrée.
- **Un seul CTA contextuel** (« le courant vous porte vers… ») : réduit la charge décisionnelle, respecte le rythme du patient (principe D-CRISE/rythme du programme).
- **États des pierres = rétroaction sans chiffre** : on sait où on en est sans jamais voir de score brut (règle fondatrice WTC, cf. P09).
- **La rive de rencontre à droite** encode l'objectif du programme sans l'imposer : le dating (module « Masque ») n'apparaît qu'en bout de parcours — thèse « l'auto-réparation précède la rencontre ».
- **Navigation basse proposée pour l'app réelle** : Fleuve · Carnet (P10) · Pont (P12) · Moi (réglages/P16).

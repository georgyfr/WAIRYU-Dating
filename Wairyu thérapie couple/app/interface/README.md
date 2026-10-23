# Interface — Maquettes thérapeutiques Wairyu

Dossier d'interfaces de l'application **Wairyu thérapie couple**, reproduites et repensées à partir du document de conception [`../01-pages-interface.md`](../01-pages-interface.md) et de l'identité visuelle du logo (palette : nuit `#1A2332`, turquoise `#6DD5C0`, brume `#E6F7FF`, corail `#FF6B6B`).

## Philosophie

Une app de processus thérapeutique, pas une app de conversion ni de matching :
- **Le fleuve comme métaphore centrale** : le voyage est visible, chaque quête RIO est un gué à franchir.
- **Langage naturel, jamais de score brut** (règle fondatrice du programme WTC).
- **Anti-gamification** : pas de streaks, pas de badges, pas de classement. Franchir un gué se célèbre par une onde silencieuse.
- **Intimité d'abord** : chacun répond seul dans son espace privé ; tout partage est choisi, case par case, révocable.
- **Ton calme** : transitions lentes et aquatiques, « le courant attend, il ne presse jamais ».

## Les interfaces

| Dossier | Page | Rôle |
|---|---|---|
| [`P01-ecran-de-lancement/`](P01-ecran-de-lancement/README.md) | P01 · Phase 0 — Arrivée | Première rencontre : logo animé, accroche, entrée sans urgence commerciale |
| [`P05-carte-du-fleuve/`](P05-carte-du-fleuve/README.md) | P05 · Phase 1 — Cœur de l'app | LA page principale : le voyage visible (proposée comme nouvelle page d'accueil en remplacement de l'accueil dating du staging) |
| [`P12-le-pont/`](P12-le-pont/README.md) | P12 · Phase 3 — Espace couple | La rive de rencontre : double carte des profils partagés, la « danse » sans coupable |
| [`P14-meteo-quotidienne/`](P14-meteo-quotidienne/README.md) | P14 · Phase 3 — Rituel quotidien | Le petit geste du jour : météo intérieure, révélation croisée conditionnelle |

Chaque dossier contient :
- `README.md` — explications complètes (rôle, contenu, interaction, ton, design, justifications UX/thérapeutiques)
- `*.html` — maquette interactive (ouvrir dans un navigateur ; animations incluses)
- `*.png` / `*@2x.png` — rendus image (version téléphone incluse pour P05)

## Réorganisation proposée pour l'app réelle (staging)

L'accueil actuel de `wairyu-staging.wairyu.workers.dev` présente des promesses de matching (dating). Dans le parcours thérapeutique WTC, l'accueil doit être **P05 · La Carte du fleuve** : on n'y parcourt pas des profils, on reprend son voyage là où l'eau attend.

Navigation basse proposée : **Fleuve · Carnet · Pont · Moi**. Le module dating (« Masque / Rencontre ») ne devient accessible qu'en fin de parcours, après la rive de départ — fidèle à la thèse « l'auto-réparation précède la rencontre ».

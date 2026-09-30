# LIVRABLE 2 — NORTH STAR + CALIBRATION : COMMENT LE FEEDBACK APPREND AU MOTEUR

> element : 8.6 « Les services du rendez-vous » · fiche : 02 — north star et calibration
> Lecture signal de 8.6 (refonte : « Feedback post-date → North Star + calibration ») ·
> MOTEUR SEUL : ce fichier décrit des mécanismes qui ne franchissent aucune interface.

## La North Star : la boucle de la rencontre

> **La santé du produit se mesure à la rencontre réelle, pas au temps retenu.**

Le moteur North Star retrouve sa maison au monde 8 (refonte : 8.1 « RESTAURÉ — le moteur
North Star retrouve sa maison »). Sa métrique porte la **boucle de conversion** :

```
match → conversation → rendez-vous → retour de la réalité (feedback)
```

- La North Star n'est pas l'engagement retenu (le temps passé, les notifications ouvertes) :
  c'est la rencontre rendue possible — des matchs qui parlent, des conversations qui mènent
  à un rendez-vous, des rendez-vous dont on sort bien.
- Le feedback post-date est le **seul capteur de réalité** de la boucle : c'est le moment où
  le vécu des personnes corrige les prévisions du moteur.

## Ce que le feedback nourrit (côté moteur — MOTEUR SEUL)

| Flux | Contenu | Rendu |
|---|---|---|
| **Agrégats de santé** | taux de dates déclarées · taux de « ça s'est bien passé » (positif / mitigé) · taux de « vous revoir » · volume de rendez-vous par cohorte | indicateur interne du produit (ni profil, ni classement — cf. interdits) |
| **Calibration des poids** | la confrontation prévision ↔ vécu : si des matchs prédits compatibles débouchent sur des retours mitigés, les poids des dimensions concernées s'ajustent doucement ; si des dimensions sous-pondérées prédisent bien le vécu, elles montent | ledger moteur — les poids bougent, les personnes non |
| **Lecture par dimension** | les quêtes qui prédisent le vécu réel se renforcent (mêmes familles que le matching de base) | moteur seul |

- **La calibration agrège, elle ne juge pas** : un retour mitigé ne pèse sur personne — il
  pèse sur la confiance accordée à une dimension du moteur.
- **Zéro analyse de texte automatisée** à ce stade : la case libre du feedback est lue par
  l'équipe (modération/sécurité), elle n'entre dans aucun calcul (01 §d).

## Calibration : des agrégats, zéro cas individuel rendu

- **Agrégats seulement** : toute lecture de calibration se fait sur des ensembles ; aucun
  membre, aucun couple, aucune conversation n'est identifiable dans une lecture.
- **Seuil d'agrégation minimale** : proposition de production — un effectif minimal avant
  toute lecture d'un agrégat (petits échantillons non lus) — **À VALIDER PAR LE COMITÉ**.
- **La donnée nominative vit le temps d'un comptage** : pseudonymisation à l'entrée du
  pipeline d'apprentissage, agrégation rapide — **À VALIDER PAR LE COMITÉ/juridique**.
- **Les poids se recalibrent, les personnes non** : la sortie de la calibration est un
  moteur plus juste, pas un profil modifié, pas une visibilité ajustée, pas une note.

## Zéro pression de performance

> **Le rendez-vous raté n'est pas une « perte » affichée.**

- Aucun compteur de rendez-vous « réussis / ratés » n'existe côté profil ; aucun bilan
  périodique, aucune comparaison, aucune jauge de « performance relationnelle ».
- Un retour mitigé ne produit **aucune conséquence visible pour qui que ce soit** : ni
  pénalité, ni badge, ni conseil non demandé, ni modulation de visibilité — pour l'un, pour
  l'autre, pour le match.
- Le feedback existe **pour apprendre au produit, pas pour noter les personnes** : la
  graduation verbale (« oui, beaucoup / oui / mitigé / non ») décrit une soirée, elle ne
  note pas une personne.
- L'app ne compte pas les rendez-vous comme des points : une personne qui ne donne aucune
  date est une personne normale ; une personne qui en donne beaucoup ne monte aucun rang.

## RGPD du flux de feedback

| Temps | Règle |
|---|---|
| Rétention | **courte** — la donnée nominative du feedback vit le temps du comptage, puis ne survit qu'en agrégat ; délai exact : **À VALIDER PAR LE COMITÉ/juridique** |
| Export | **aucun export ne contient le feedback lié à une autre personne** — ton propre retour n'est pas restitué dans l'export (il est déjà dissocié et agrégé) ; consigné : lecture restrictive assumée, comité/juridique |
| Tiers | **aucun tiers** — pas de sous-traitant d'analyse, pas d'analytique tierce, pas d'outil de scoring externe |
| Accès | les agrégats de calibration sont internes au moteur ; aucune restitution à l'un ou à l'autre des membres d'un match (01 §d) |

## Verrou de dérive (liste fermée des interdits)

Toute dérive du feedback vers un instrument de personnes est une **violation du design** :

- une « réputation de date » (note, rang, avis rendu à l'autre ou aux tiers) ;
- une modulation de visibilité ou de matching déduite d'un retour individuel ;
- un bilan de performance affiché (profil, résumé, portrait) ;
- une relance du feedback (une proposition par date, silence ensuite) ;
- une utilisation du feedback en dehors de l'agrégat et de la calibration.

Toute évolution dans ces directions = Fiche de Mutation + verdict comité — rien de moins.

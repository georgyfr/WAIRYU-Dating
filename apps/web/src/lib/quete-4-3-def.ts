/**
 * Couche accompagnement de la quête 4.3 « Ce que tes relations t'ont
 * appris » (Monde 5 « Ton Héritage »).
 *
 * Rédigée (jamais verbatim du Livrable), ton Task 35. Particularité : AUCUN
 * score, AUCUNE barre, AUCUNE carte, AUCUN archétype, AUCUN miroir — dims,
 * accompagnement et ombreRelationnel sont VIDES PAR DESIGN (exemptions
 * gravées du Livrable — précédents DEF_17 « écran de confiance », DEF_28
 * « badge déclaratif pur », DEF_37 « attirances privées ») : la quête est
 * une TÂCHE D'ÉCRITURE, pas une mesure. Règle gravée : la réponse n'est
 * JAMAIS rendue — rien à lire, rien à interpréter.
 *
 * DERNIÈRE quête ouverte du Monde 5 « Ton Héritage » : suivante = null
 * (précédent 3.7 ; le Monde 6 « Mon Cœur » n'est pas construit — la
 * transition passera par prochaineQuete()/l'atlas). La fin émotionnelle
 * ouvre le monde suivant sans le nommer au-delà de son thème (zéro teaser
 * premium — le monde à venir ne présuppose rien).
 *
 * Typo : apostrophe ASCII ', phrases ≤ 22 mots, aucun code/score/sigle rendu.
 */

import type { EntreeRegistre } from './quetes';

export const DEF_43: EntreeRegistre = {
  sousTitre: 'La page d\'écoute : ce que tes relations t\'ont appris, à ta façon.',

  // VIDE — exemption par design (1 item ouvert, aucun profil computable) :
  // la tâche n'est pas notée.
  dims: [],

  // VIDE — rien à lire par palier : une page d'écoute n'a ni degré ni
  // niveau.
  accompagnement: {},

  conseils: [
    'Écris comme tu parles : la page accueille, elle ne note pas.',
    'Pas de longueur minimale : trois mots ou trois lignes, les deux se valent.',
    'Tu peux ne rien écrire : « Je préfère ne pas dire » est une réponse complète.',
    'Ta page reste chez toi — jamais citée, jamais montrée.',
  ],

  commentLire:
    'Il n\'y a rien à lire ici : pas de barre, pas de carte, pas de score. ' +
    'Ta page reste chez toi — le moteur la garde, l\'interface ne la montre jamais.',

  // VIDE — aucune carte, aucun miroir, aucune signature (exemptions par
  // design documentées au Livrable — NE PAS créer de fichier arche).
  ombreRelationnel: {},

  // Dernière quête ouverte du Monde 5 « Ton Héritage » — la chaîne se referme
  // ici ; le monde suivant n'est pas construit (précédent 3.7 : suivante
  // null jusqu'à l'ouverture du monde suivant).
  suivante: null,

  suite: {
    titre: 'La suite de ton voyage',
    intro:
      'Ta page est à toi — écrite ou non, elle reste chez toi. Ton héritage est posé : ' +
      'l\'arbre, le présent, ce que tes relations t\'ont appris. La suite du voyage regarde ton cœur : ' +
      'ton style amoureux, ta façon d\'exprimer l\'affection.',
    questions: [
      'Qu\'est-ce que tes relations t\'ont appris que tu veux emporter ?',
      'Quelle place tu donnes à ce que ça t\'a appris — la tienne, pas celle des autres ?',
    ],
  },
};

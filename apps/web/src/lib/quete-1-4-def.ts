/**
 * Couche accompagnement de la quête 1.4 « Ton contrôle sur toi-même »
 * (Monde 2 « Le Volant »).
 *
 * Rédigée par les agents quête (jamais verbatim du Livrable), ton Task 35 :
 * tutoiement, simple et littéral, phrases courtes, jamais un diagnostic,
 * jamais culpabilisant. Alimente l'entrée « 1.4 » du registre (quetes.ts).
 *
 * SENS DE LA BARRE (à ne pas inverser) : la dimension `autocontrole` agrège
 * les items directs et les inversés recodés — barre PLEINE = tes promesses
 * envers toi-même tiennent dans la durée, barre LÉGÈRE = elles se renégocient
 * au fil des envies. Doctrine du Livrable : neutralité normative — aucune
 * « bonne réponse », les cinq cartes se valent, aucun palier flatté ni blâmé.
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots, aucun code/score
 * ni métadonnée moteur dans un texte rendu.
 */
import type { EntreeRegistre } from './quetes';

export const DEF_14: EntreeRegistre = {
  sousTitre: 'La quête du volant : tes promesses envers toi-même.',

  dims: [
    {
      key: 'autocontrole',
      nom: 'Ton auto-contrôle',
      sousLigne: 'les limites que tu tiens',
      genre: 'm',
      lecture:
        'Cette barre dit comment tes promesses envers toi-même se portent : tenues (pleine) ou renégociées au fil des envies (légère). Elle regarde tes limites du quotidien — budget, écran, nourriture, repos — et ce qu\'il en reste quand la motivation passe. La barre décrit une mécanique, elle ne note rien.',
    },
  ],

  accompagnement: {
    // SENS : fort = promesses tenues dans la durée · doux = le présent renégocie —
    // aucun palier n'est flatté ni blâmé (neutralité normative du Livrable).
    autocontrole: {
      fort:
        'Ce que tu décides pour toi, ça tient : tes limites et tes promesses se vérifient dans le temps. Ta vigilance : quand ça glisse un jour, ne te juge pas — un écart ne démolit pas une mécanique.',
      equilibre:
        'Tu tiens l\'essentiel et tu laisses le reste vivre : ton contrôle choisit ses batailles. C\'est un réglage sain — garde juste l\'œil sur les promesses remises trop souvent au lendemain.',
      doux:
        'Tes bonnes résolutions partent vite, et les plaisirs proches gagnent souvent. Ce n\'est pas un manque de volonté : ton présent est fort, c\'est tout. Une seule promesse, petite, tenue — puis la suivante : c\'est comme ça que le muscle se construit.',
    },
  },

  conseils: [
    'Relis ta carte à tête reposée : tes promesses se vérifient dans les jours ordinaires, pas les parfaits.',
    'Choisis UNE promesse envers toi-même, petite et datée : tenue, elle vaut mieux que dix résolutions floues.',
    'Quand tu cédes, regarde ce qui a déclenché la reprise — fatigue, ennui, ambiance : le déclencheur se gère.',
    'Aucune barre ne te définit : elle décrit ta réponse d\'aujourd\'hui, pas une case pour toujours.',
  ],

  commentLire:
    'Une seule barre, et elle vient de TES réponses : plus elle est pleine, plus tes promesses envers toi-même tiennent. Elle va de 0 à 100 — ni une note, ni un verdict, juste l\'instantané du jour. Ce qu\'elle regarde et ce qu\'elle dit de toi sont écrits dessous — relis-la comme un portrait, pas un bulletin.',

  ombreRelationnel: {
    V1:
      'En relation, ta zone d\'ombre peut donner : une main invisible sur la vie commune, où l\'autre cherchait à être accueilli. Ce qui aide : demander ce dont l\'autre a besoin avant de proposer une solution.',
    V2:
      'En relation, ta zone d\'ombre peut donner : des promesses lâchées sans annonce — le côté flexible qui cache le côté fatigué. Ce qui aide : dire la renégociation à voix haute avant la reprise — l\'autre suit mieux qu\'il ne devine.',
    V3:
      'En relation, ta zone d\'ombre peut donner : des recommencements qui se répètent — et un proche qui cesse de compter. Ce qui aide : nommer à voix haute ce qui recommence, au lieu de promettre un jamais plus.',
    V4:
      'En relation, ta zone d\'ombre peut donner : des départs prévus qui glissent — et l\'autre qui attend en gardant le compte. Ce qui aide : une seule promesse en cours à la fois — petite, datée, terminée.',
    V5:
      'En relation, ta zone d\'ombre peut donner : une présence vive au présent, et des projets communs remis au fil des envies. Ce qui aide : un seul engagement commun, court et daté, terminé avant le suivant.',
  },

  suivante: '1.5',

  suite: {
    titre: 'La suite de ton voyage',
    intro:
      'Tu sais maintenant comment tu tiens tes promesses envers toi-même. La prochaine étape ne demande rien de dire : elle regarde ce que tu choisis. Et ce que tu choisis révèle plus que ce que tu dis.',
    questions: [
      'Quand tu cèdes, qu\'est-ce qui l\'emporte : l\'envie, la fatigue, l\'ambiance ?',
      'Quelle est la dernière promesse envers toi-même que tu as tenue — sans témoin, sans public ?',
    ],
    cta: 'Passer l\'épreuve du temps',
  },
};

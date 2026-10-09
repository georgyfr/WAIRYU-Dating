/**
 * Couche accompagnement de la quête 2.4 « Tes réalités » (Monde 3 « La Boussole »).
 *
 * Rédigée par les agents quête (jamais verbatim du Livrable), ton Task 35 :
 * tutoiement, simple et littéral, phrases courtes, jamais un diagnostic,
 * jamais culpabilisant. Alimente l'entrée « 2.4 » du registre (quetes.ts).
 *
 * SENS DE LA BARRE (à ne pas inverser) : la dimension `repondues` compte les
 * DÉCLARATIONS POSÉES (0 à 8) — barre PLEINE = les huit réalités sont posées,
 * barre LÉGÈRE = quelques réalités déclarées, le reste ouvert. L'app n'affiche
 * QUE le compte des réponses posées — jamais le contenu, jamais un jugement :
 * les réalités sont des FAITS, elles se croisent, elles ne se notent pas
 * (écran de conformité du Livrable). Doctrine : neutralité normative — aucune
 * hiérarchie des vies, aucun palier flatté ni blâmé, aucune option « idéale » ;
 * la barre dit la complétude du profil, pas la valeur de la personne.
 *
 * NOTE suivante : la chaîne du Monde 3 vaut '2.5' — hors `IdQuete` tant que le
 * registre M3 n'est pas intégré (quetes.ts couvre M1/M2) ; le pont est posé par
 * assertion documentée, absorbée quand IdQuete s'élargira à M3.
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots, aucun code/score
 * ni métadonnée moteur dans un texte rendu.
 */
import type { EntreeRegistre, IdQuete } from './quetes';

export const DEF_24: EntreeRegistre = {
  sousTitre: 'La quête de la boussole : ta vie se déclare, sans être notée.',

  dims: [
    {
      key: 'repondues',
      nom: 'Ton profil de vie',
      sousLigne: 'les réalités que tu poses',
      genre: 'm',
      lecture:
        'Cette barre dit combien de réalités tu poses : chaque déclaration remplie l\'allonge d\'un cran. L\'app n\'affiche que le compte des réponses posées — pas le contenu, pas de jugement. Tes réalités sont des faits : elles se croisent, elles ne se notent pas.',
    },
  ],

  accompagnement: {
    // SENS : barre pleine = profil complet · barre légère = quelques réalités posées —
    // aucun palier n'est flatté ni blâmé (neutralité normative du Livrable) : la barre
    // dit une complétude, jamais la valeur d'une vie.
    repondues: {
      fort:
        'Tes huit réalités sont posées : ton profil se lit sans deviner, et le croisement travaille sur du complet. Ce n\'est pas une note, c\'est une complétude — la vigilance ici : ta vie bouge, tes réponses doivent suivre. Une déclaration vieille finit par ne plus te décrire.',
      equilibre:
        'Tu poses l\'essentiel et tu laisses quelques cases ouvertes : c\'est un rythme, pas un manque. Chaque réalité ajoutée rend ta lecture plus claire — à ton tempo, sans devoir tout dire d\'un coup. Les cases ouvertes restent les tiennes : personne ne te presse.',
      doux:
        'Quelques réalités posées, et ton profil travaille déjà : le croisement s\'appuie sur ce que tu déclares, même partiellement. C\'est un début honnête, pas un profil inachevé — chaque clic de plus est un choix, jamais un devoir.',
    },
  },

  conseils: [
    'Une réalité a changé ? Change ta réponse le jour même : le croisement travaille sur ce qui est vrai maintenant.',
    'Tes réponses restent modifiables à tout moment : le profil suit ta vie, pas l\'inverse.',
    'Aucune option n\'est la bonne : fumeur, parent, nomade, zéro sport — des faits, pas des défauts.',
    'Une réalité peut rester privée : elle quitte l\'affichage, pas la protection — ton croisement continue de l\'appliquer.',
  ],

  commentLire:
    'Une seule barre, et elle vient de TES réponses : plus elle est pleine, plus tu as posé de réalités. Elle ne mesure pas la valeur de ta vie : elle compte ce que tu as déclaré, rien d\'autre — l\'instantané du jour. Ce qu\'elle regarde et ce qu\'elle dit de toi sont écrits dessous — relis-la comme un portrait, pas un bulletin.',

  ombreRelationnel: {
    'CARTE-2.4-A':
      'En relation, ta zone d\'ombre peut donner : des éclipses sans explication. Des personnes s\'écartent sur un fait, avant le premier mot — et tu n\'en sauras jamais la raison. Ce qui aide : garder, dans ta façon de raconter ta vie, une place pour le « ça dépend ».',
    'CARTE-2.4-B':
      'En relation, ta zone d\'ombre peut donner : des lectures inventées. L\'autre remplit tes cases vides avec ses propres peurs — rarement en ta faveur. Ce qui aide : dire l\'essentiel tôt, garder les détails pour quand la confiance est là.',
  },

  // La quête suivante du Monde 3 : 2.5 « Ce que tu cherches » — hors IdQuete
  // (registre M1/M2) tant que le pont M3 n'est pas intégré (voir entête).
  suivante: '2.5' as IdQuete,

  suite: {
    titre: 'La suite de ton voyage',
    intro:
      'Tes réalités sont posées : elles travaillent en silence, croisées avec les lignes rouges de tout le monde. La prochaine étape regarde ce que tu cherches — et ce que tu cherches pèse autant que ce que tu es.',
    questions: [
      'Quelle réalité as-tu hésité à déclarer — et qu\'est-ce qui a fait pencher la balance ?',
      'Si une réalité devait filtrer quelqu\'un pour toi, laquelle choisirais-tu — et est-elle déjà dans tes lignes rouges ?',
    ],
    cta: 'Découvrir ce que tu cherches',
  },
};

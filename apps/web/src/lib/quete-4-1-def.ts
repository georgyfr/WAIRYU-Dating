/**
 * Couche accompagnement de la quête 4.1 « Ton arbre relationnel »
 * (Monde 5 « Ton Héritage »).
 *
 * Rédigée (jamais verbatim du Livrable), ton Task 35 : tutoiement, simple et
 * littéral, phrases courtes, jamais un diagnostic, jamais culpabilisant.
 * Alimente l'entrée « 4.1 » du registre (quetes.ts).
 *
 * NEUTRALITÉ DES ORIGINES (doctrine capitale du Livrable — à ne pas
 * inverser) : les cinq façons d'avoir grandi se valent — le climat nommé
 * n'est pas « sain », le climat deviné n'est pas « blessé », l'héritage
 * pesant n'est pas une immaturité, la voix tenue n'est pas une réparation.
 * ZÉRO BLÂME PARENTAL : aucun texte n'accuse un parent — un climat se
 * raconte, il ne se juge pas. Aucun vocabulaire clinique (« différenciation »,
 * « loyauté familiale », « schéma ») — le rendu parle d'images (la table, la
 * voix, la place tenue).
 *
 * Les clés des dims = les axes du scorer (quete-4-1.ts).
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots, aucun code/score
 * ni métadonnée moteur dans un texte rendu.
 */
import type { EntreeRegistre } from './quetes';

export const DEF_41: EntreeRegistre = {
  sousTitre:
    'La première quête de ton héritage : ce que ta famille t\'a appris sans le savoir.',

  dims: [
    {
      key: 'climat',
      nom: 'Le climat de ton origine',
      sousLigne: 'ce qui se nommait, ce qui se devinait',
      genre: 'm',
      lecture:
        'Cette barre dit comment l\'ambiance circulait chez toi. Pleine : les émotions se nommaient, les désaccords se réparaient. Légère : l\'essentiel se devinait plus qu\'il ne se disait. Les deux manières se valent — la barre décrit une ambiance, elle ne note rien.',
    },
    {
      key: 'loyautes',
      nom: 'Le poids des héritages',
      sousLigne: 'les rôles tenus très tôt, la voix propre',
      genre: 'm',
      lecture:
        'Cette barre dit le poids des places héritées. Pleine : les rôles tenus très tôt pèsent encore, la paix du groupe passe avant ton avis. Légère : tes rôles d\'aujourd\'hui ressemblent à des choix. Les deux façons se valent — une fidélité et une voix, jamais une note.',
    },
  ],

  accompagnement: {
    // SENS : fort = climat nommé · doux = climat deviné — les deux se valent,
    // aucun palier n'est flatté ni blâmé (neutralité des origines).
    climat: {
      fort:
        'Chez toi, l\'essentiel se disait : les émotions se nommaient, les désaccords se réparaient. Ce qui aide : laisser à l\'autre le temps de trouver ses mots — tous les tableaux ne parlent pas aussi vite.',
      equilibre:
        'Ton origine mêle le dit et le deviné : selon les sujets et les années. C\'est un entre-deux fréquent — ni table bavarde ni maison muette. Ce qui aide : dire ta règle du moment à ceux qui vivent avec toi.',
      doux:
        'Chez toi, l\'essentiel se devinait plus qu\'il ne se disait. Tu as appris à lire une maison — une attention rare. Ce qui aide : poser ta lecture en question de temps en temps — ce qui se devine se vérifie.',
    },
    // SENS : fort = héritages pesants · doux = voix propre — la fidélité et
    // la voix se valent, jamais une maturité attribuée (interdit V10).
    loyautes: {
      fort:
        'Les rôles tenus très tôt pèsent encore : la paix du groupe passe souvent avant ton avis. Ce n\'est pas une immaturité — c\'est une fidélité. Ce qui aide : nommer une chose que tu ne portes plus — la table tient sans ça.',
      equilibre:
        'Tes rôles d\'aujourd\'hui tiennent de l\'héritage et du choix : tu revisites certaines places, tu gardes d\'autres. Ce qui aide : distinguer ce que tu gardes de ce qui te garde.',
      doux:
        'Tes rôles ressemblent à des choix : ton avis compte autant que la paix du groupe. C\'est une voix qui s\'est construite. Ce qui aide : la garder généreuse — la table, aussi, se porte à plusieurs.',
    },
  },

  conseils: [
    'Ton arbre se construit sans tribunal : un climat se raconte, il ne se juge pas.',
    'Les cinq façons d\'avoir grandi se valent — la tienne se respecte comme elle est.',
    'Le génogramme reste une conversation avec toi-même : aucune case imposée, retrait quand tu veux.',
    'En couple, dis ce que ton arbre t\'a appris : les héritages se portent mieux à voix haute.',
  ],

  commentLire:
    'Deux barres, et elles viennent de TES réponses : le climat de ton origine et le poids des héritages — deux lectures de la même maison. Elles vont de 0 à 100 — ni une note, ni un verdict. Plus pleine ne veut pas dire mieux : un climat bavard et une maison devinée se valent, un héritage pesant et une voix tenue se valent. Ce qu\'elles regardent et ce qu\'elles disent de toi sont écrits dessous — relis-les comme un portrait, jamais un tribunal.',

  ombreRelationnel: {
    'CARTE-4.1-TABLE-QUI-DIT':
      'En relation, ta zone d\'ombre peut donner : la table qui chauffe quand l\'un veut parler et que l\'autre pèse ses mots. Ce qui aide : laisser le silence se déposer — un silence n\'est pas un refus.',
    'CARTE-4.1-ROLE-LUMIERE':
      'En relation, ta zone d\'ombre peut donner : le fiable qui assume tout et ne demande rien. Ce qui aide : confier une chose par semaine — la fatigue du fiable se cache bien.',
    'CARTE-4.1-LECTEUR-SILENCES':
      'En relation, ta zone d\'ombre peut donner : l\'autre compris avant d\'avoir parlé — et se sentant court-circuité. Ce qui aide : remplacer une lecture par une question ouverte.',
    'CARTE-4.1-PLACE-HERITEE':
      'En relation, ta zone d\'ombre peut donner : l\'harmonie qui cache une négociation en attente. Ce qui aide : mettre ton avis sur la table tôt — la paix y gagne d\'être vraie.',
    'CARTE-4.1-SELON-LA-TABLE':
      'En relation, ta zone d\'ombre peut donner : une maison aux saisons que l\'autre ne prévoit pas. Ce qui aide : un mot de règle par saison — la souplesse se raconte.',
  },

  suivante: '4.2',

  suite: {
    titre: 'La suite de ton voyage',
    intro:
      'Ton arbre est posé — l\'ambiance, les places, les rôles : tout se respecte, rien ne se juge. ' +
      'La prochaine étape descend dans ton présent : où tu en es aujourd\'hui, après tes histoires ' +
      'passées — une météo, jamais un bulletin.',
    questions: [
      'Qu\'est-ce que ta famille t\'a appris sans le savoir — et que veux-tu garder ?',
      'Chez toi, que se disait-il — et que se devinait-il ?',
    ],
    cta: 'Descendre dans ton présent',
  },
};

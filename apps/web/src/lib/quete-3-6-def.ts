/**
 * Couche accompagnement de la quête 3.6 « Le choix visuel »
 * (Monde 4 « Ton Terrain »).
 *
 * Rédigée par l'agent quête (jamais verbatim du Livrable), ton Task 35 :
 * tutoiement, simple et littéral, phrases courtes, jamais un diagnostic,
 * jamais culpabilisant. Alimente l'entrée « 3.6 » du registre (quetes.ts —
 * câblage par la tâche d'intégration).
 *
 * NEUTRALITÉ NORMATIVE (doctrine du Livrable) : l'ancre et l'horizon sont
 * deux façons égales d'habiter des images — aucun lecteur n'est « mieux
 * équilibré » qu'un autre. Ici « fort » désigne le SENS DE LA BARRE (les
 * images penchent au repos) et « doux » son opposé (elles penchent dehors) :
 * aucun palier n'est flatté ni blâmé, aucun pôle n'est l'idéal. Registre
 * probabiliste — suggère, oriente souvent vers — jamais « révèle que tu es ».
 * Mesure FAIBLE : jamais seule, jamais clinique, jamais au matching seul.
 * AUCUNE trace de la lecture complémentaire P6 (Arbitrage 4 — signal_id
 * null) dans ces textes.
 *
 * SENS DE LA BARRE (à ne pas inverser) : la barre porte le compte des
 * images « ancre » choisies (scoreBruts.VISO_ANC, normalisé 0-1) — pleine =
 * tes images penchent vers ce qui te ramène, légère = elles penchent vers
 * ce qui t'appelle. Les deux se valent.
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots, aucun code/score
 * ni métadonnée moteur dans un texte rendu.
 */
import type { EntreeRegistre } from './quetes';

/** « 3.7 » est la quête suivante du Monde 4 — l'union IdQuete s'élargira au
 *  câblage du registre (quetes.ts, tâche d'intégration). Pont de typage en
 *  attendant l'extension du type (même convention que quete-2-1-def.ts). */
type IdSuivante36 = EntreeRegistre['suivante'];

export const DEF_36: EntreeRegistre = {
  sousTitre: 'La tâche des images : ce que ton œil choisit quand personne ne demande.',

  dims: [
    {
      key: 'VISO_ANC',
      nom: 'Ton terrain en images',
      sousLigne: "ce qui te ramène ou ce qui t'appelle",
      genre: 'm',
      lecture:
        'Cette barre dit de quel côté penchent tes images choisies. Pleine : l\'ancre — la maison, le rituel, ce qui te ramène. Légère : l\'horizon — le dehors, l\'imprévu, ce qui t\'appelle. Les deux se valent — la barre décrit une teinte d\'images, elle ne note rien.',
    },
  ],

  accompagnement: {
    // SENS : fort = images qui penchent au repos · doux = images qui penchent
    // dehors — l'ancre et l'horizon sont égaux en dignité (aucun pôle n'est
    // l'idéal, aucun palier n'est flatté ni blâmé).
    VISO_ANC: {
      fort:
        'Tes images penchent au repos : la maison, le rituel, le café lent te parlent d\'abord. Ce qui aide : garder une image dehors — l\'aventure a aussi sa place dans tes murs.',
      equilibre:
        'Tes images se partagent : tantôt dedans, tantôt dehors — ta teinte bouge avec les semaines. Ce qui aide : dire l\'image du moment, pour que l\'autre n\'ait plus à deviner.',
      doux:
        'Tes images penchent dehors : la terrasse, le marché, la ville qui bouge t\'appellent d\'abord. Ce qui aide : garder une image dedans — un endroit qui te ramène vaut de l\'or.',
    },
  },

  conseils: [
    'Relis ta carte à tête reposée : tes images disent une teinte du moment, pas une case.',
    'Aucun choix n\'était le bon : chaque image des huit paires se valait — rien à rattraper.',
    'Tes images choisies ouvrent des conversations toutes prêtes — raconte-les telles quelles, sans les traduire.',
    'La barre bouge avec toi : si tes images changent un jour, la lecture suivra.',
  ],

  commentLire:
    'Une seule barre, et elle vient de TES choix — huit paires, huit images retenues. Pleine : tes images penchent vers ce qui te ramène. Légère : elles penchent vers ce qui t\'appelle. Ni l\'un ni l\'autre n\'est mieux : ce sont deux façons égales d\'habiter des images. Relis-la comme une teinte, pas un verdict.',

  ombreRelationnel: {
    'CARTE-3.6-ANCRE':
      'En relation, ta zone d\'ombre peut donner : des journées qui se ressemblent. Et quelqu\'un, à côté, peut s\'ennuyer de ta belle stabilité. Ce qui aide : proposer une sortie à l\'improviste, de temps en temps — sans en faire un programme.',
    'CARTE-3.6-EQUILIBRE':
      'En relation, ta zone d\'ombre peut donner : un profil difficile à lire — l\'autre ne sait plus si tu veux rester ou sortir. Ce qui aide : dire l\'image de ta semaine — rester ou bouger, les deux se disent.',
    'CARTE-3.6-HORIZON':
      'En relation, ta zone d\'ombre peut donner : une maison traversée à vitesse constante — on passe, on repart, on rentre tard. Ce qui aide : garder une soirée dedans, posée à la semaine — le retour se choisit aussi.',
  },

  // Pont de typage : voir note au-dessus — l'intégration M4 étendra IdQuete.
  suivante: '3.7' as unknown as IdSuivante36,

  suite: {
    titre: 'La suite de ton voyage',
    intro:
      'Ton terrain a trouvé ses images — le monde touche à sa fin. La dernière quête reste pour toi seul : elle n\'apparaît nulle part, et c\'est justement ce qui la rend vraie. Elle prépare la suite du voyage.',
    questions: [
      'Qu\'est-ce qui t\'attire chez quelqu\'un, sans que tu saches pourquoi ?',
      'Ce que tu gardes pour toi : le partages-tu un jour — et à qui ?',
    ],
    cta: 'Finir ton terrain — pour toi seul',
  },
};

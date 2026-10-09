/**
 * Couche accompagnement de la quête 3.2 « Ton quotidien »
 * (Monde 4 « Ton Terrain »).
 *
 * Rédigée par les agents quête (jamais verbatim du Livrable), ton Task 35 :
 * tutoiement, simple et littéral, phrases courtes, jamais un diagnostic,
 * jamais culpabilisant. Alimente l'entrée « 3.2 » du registre (quetes.ts).
 *
 * SENS DES BARRES (à ne pas inverser) : les 2 axes du scorer (quete-3-2.ts) —
 * PLAN_D pleine = tu poses ton programme d'avance · PLAN_D légère = tes
 * journées suivent le fil de ce qui arrive · ORDRE_D pleine = chaque chose
 * finit par retrouver sa place · ORDRE_D légère = les choses vivent là où
 * elles tombent.
 *
 * NEUTRALITÉ DES STYLES (doctrine du Livrable, absolue) : planifier et
 * improviser = deux façons égales d'habiter un agenda ; l'ordre et le
 * désordre domestique = deux seuils de tolérance, ni l'un ni l'autre vertu
 * ou défaut. Le désordre chronique est un fonctionnement, pas de la paresse
 * (leçon refonte gravée). Cinq jugements interdits au rendu : le
 * planificateur pas « rigide », l'improvisateur pas « léger », l'ordonné
 * pas « maniaque », le désordonné pas « bordélique-paresseux », le central
 * pas « mou ». Le mot « bordel » (item Q3.2-08) reste dans la réponse de la
 * personne — jamais rendu sur les couches app. Les clés PLAN_D / ORDRE_D
 * sont des clés moteur : jamais rendues (le rendu parle du programme et de
 * la place).
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots, aucun code/score
 * ni métadonnée moteur dans un texte rendu.
 */
import type { EntreeRegistre } from './quetes';

/** « 3.3 » est la quête suivante du Monde 4 — l'union IdQuete s'élargira au
 *  câblage du registre (quetes.ts, tâche d'intégration M4). Pont de typage
 *  en attendant l'extension du type (même convention que quete-2-1-def.ts). */
type IdSuivante32 = EntreeRegistre['suivante'];

export const DEF_32: EntreeRegistre = {
  sousTitre: 'La quête du terrain : comment ton quotidien tourne, tous les jours.',

  dims: [
    {
      key: 'PLAN_D',
      nom: 'Ta planification',
      sousLigne: 'le programme de tes jours',
      genre: 'f',
      lecture:
        'Cette barre dit comment ton agenda se tient. Pleine : tu poses ton programme d\'avance et tu peux le nommer. Légère : tes journées suivent le fil de ce qui arrive. Les deux manières se valent — la barre décrit un style, elle ne note rien.',
    },
    {
      key: 'ORDRE_D',
      nom: 'Ton ordre domestique',
      sousLigne: 'la place des choses',
      genre: 'm',
      lecture:
        'Cette barre dit comment les choses se rangent chez toi. Pleine : chaque chose finit par retrouver sa place. Légère : les choses vivent là où elles tombent, et ça te va. Les deux manières se valent — la barre décrit un seuil de tolérance, ni une vertu ni un défaut.',
    },
  ],

  accompagnement: {
    // SENS : fort = barre pleine · doux = barre légère — les deux bouts de
    // chaque barre se valent (neutralité des styles du Livrable, aucun
    // palier flatté ni blâmé).
    PLAN_D: {
      fort:
        'Tu aimes un programme que tu peux nommer : les sorties se décident tôt, la semaine se lit d\'avance. Ce qui aide : garder une place pour l\'imprévu — il passe même chez les gens organisés.',
      equilibre:
        'Selon les semaines, tu poses un plan ou tu suis le fil : ta planification bouge avec la vie. C\'est un réglage à toi — il n\'a pas à ressembler à celui de personne.',
      doux:
        'Tu improvises volontiers : les journées se dessinent en marchant, et le programme attend. Ce n\'est pas un manque d\'organisation — planifier et improviser sont deux façons égales d\'habiter un agenda.',
    },
    ORDRE_D: {
      fort:
        'Chez toi, chaque chose finit par retrouver sa place : la maison se lit d\'un coup d\'œil. Ce qui aide : garder le rangement souple — un chez-soi n\'a pas à devenir une vitrine.',
      equilibre:
        'Selon les saisons, tu ranges ou tu laisses vivre : ton seuil de tolérance bouge sans casser. C\'est un réglage à toi — ni un standard à tenir, ni un défaut à corriger.',
      doux:
        'Les choses vivent là où elles tombent, et ça ne te pèse pas : ton seuil de tolérance est large. Ce n\'est pas de la paresse — un seuil large est un fonctionnement comme un autre.',
    },
  },

  conseils: [
    'Relis ta carte à tête reposée : un quotidien se vérifie dans les semaines ordinaires, pas les parfaites.',
    'Aucun style n\'en vaut un autre : planifier et improviser se valent, l\'ordre et le libre aussi.',
    'Les frictions du quotidien se nomment tôt — les sorties, les rendez-vous, la place des choses. Dites à voix haute, elles se traversent mieux.',
    'Aucune barre ne te définit : elle décrit ta réponse d\'aujourd\'hui, pas une case pour toujours.',
  ],

  commentLire:
    'Deux barres, et elles viennent de TES réponses — le programme de tes jours, la place des choses chez toi. Elles vont de 0 à 100 — ni une note, ni un verdict. Plus pleine ne veut pas dire mieux : les deux bouts de chaque barre se valent. Ce qu\'elles regardent et ce qu\'elles disent de toi sont écrits dessous — relis-les comme un portrait, pas un bulletin.',

  ombreRelationnel: {
    'CARTE-3.2-HORLOGE':
      'En relation, ta zone d\'ombre peut donner : un programme qui tourne sans l\'autre dedans — la case vide se nomme à deux. Ce qui aide : laisser une ligne du plan s\'écrire ensemble, même petite.',
    'CARTE-3.2-CALEPIN':
      'En relation, ta zone d\'ombre peut donner : deux systèmes qui se lisent mal — ton seuil n\'est pas celui de tout le monde. Ce qui aide : nommer à deux ce qui se tolère et ce qui se range, avant que l\'autre n\'interprète seul.',
    'CARTE-3.2-SANS-BUSSOLE':
      'En relation, ta zone d\'ombre peut donner : un oui qui se découvre en marchant — qui compte sur toi prépare parfois deux fois. Ce qui aide : poser un mot d\'avance sur les grandes lignes, et garder le reste libre.',
    'CARTE-3.2-VENT':
      'En relation, ta zone d\'ombre peut donner : des charges invisibles qui s\'accumulent — le frigo, le rendez-vous, le linge. Ce qui aide : tenir un plancher à deux, petit et assumé, pour que rien d\'essentiel ne s\'oublie.',
    'CARTE-3.2-MAREE':
      'En relation, ta zone d\'ombre peut donner : un mode du jour que l\'autre cherche sans le lire. Ce qui aide : annoncer ton mode en trois mots — la flexibilité y gagne un langage.',
  },

  // Pont de typage : voir note au-dessus — l'intégration M4 étendra IdQuete.
  suivante: '3.3' as unknown as IdSuivante32,

  suite: {
    titre: 'La suite de ton voyage',
    intro:
      'Tu as montré comment ton quotidien tourne — le programme de tes jours, la place des choses. La prochaine quête regarde ce qui se passe quand rien ne t\'oblige : ton temps libre. Là aussi, ta façon de faire vaut la peine.',
    questions: [
      'Quand rien ne t\'oblige, qu\'est-ce qui te recharge vraiment — le dehors, le chez-toi, les gens ?',
      'Y a-t-il une activité de fond qui te porte depuis longtemps — ou est-ce que tout change au gré des envies ?',
    ],
    cta: 'Découvrir ton temps libre',
  },
};

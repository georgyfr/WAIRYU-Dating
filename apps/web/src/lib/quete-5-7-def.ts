/**
 * Couche accompagnement de la quête 5.7 « Ton humour »
 * (Monde 6 « Mon Cœur » · 💎 PREMIUM).
 *
 * Rédigée (jamais verbatim du Livrable), ton Task 35 : tutoiement, simple et
 * littéral, phrases courtes, jamais un diagnostic, jamais culpabilisant.
 * Alimente l'entrée « 5.7 » du registre (quetes.ts).
 *
 * NEUTRALITÉ TYPOLOGIQUE (doctrine capitale du Livrable — à ne pas
 * inverser) : les quatre façons de faire rire se valent — le rire qui
 * rapproche n'est pas « le bon humour », le rire qui blesse n'est pas une
 * faute morale, le rire qui s'auto-rabaisse n'est pas une faiblesse. DOCTRINE
 * DE L'OMBRE : l'ombre = le COÛT, pas la nature du style — le coût est nommé
 * pour soi ET pour l'autre, en situation de couple, au registre probabiliste ;
 * « qui blesse » et « qui s'auto-rabaisse » restent assumés avec leur coût
 * nommé, pas condamnés. Le rendu parle d'images (la table qui rit, la pique,
 * le bouclier, la conversation qui attend), jamais d'étiquette.
 *
 * Les clés des dims = les styles du scorer (quete-5-7.ts).
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots, aucun code/score
 * ni métadonnée moteur dans un texte rendu.
 */
import type { EntreeRegistre } from './quetes';

export const DEF_57: EntreeRegistre = {
  sousTitre:
    'La quête de ton rire : quatre façons de faire rire, racontées sans classement.',

  dims: [
    {
      key: 'rapproche',
      nom: 'Le rire qui rapproche',
      sousLigne: 'le rire qui lie le groupe, la table qui se rallume',
      genre: 'm',
      lecture:
        'Cette barre dit la place du rire qui rassemble. Pleine : tes blagues délient les langues, la gêne sort et les gens se parlent. Légère : ton humour reste discret chez les gens nouveaux. Les deux façons se valent — la barre décrit un style, elle ne note rien.',
    },
    {
      key: 'dedramatise',
      nom: 'Le rire qui dédramatise',
      sousLigne: 'le rire qui traverse les coups durs',
      genre: 'm',
      lecture:
        'Cette barre dit le rire posé sur ce qui pèse. Pleine : tu ris de tes galères pour mieux les traverser. Légère : la journée lourde garde tout son sérieux. Les deux places se valent — la barre décrit un style, elle ne note rien.',
    },
    {
      key: 'blesse',
      nom: 'Le rire qui blesse',
      sousLigne: 'le rire qui pince sa cible',
      genre: 'm',
      lecture:
        'Cette barre dit le rire qui pince sa cible. Pleine : tes moqueries disent tout haut ce que d\'autres gardent pour eux. Légère : tes moqueries épargnent les gens autour de toi. Les deux places se valent — un tranchant et une retenue, ni l\'un ni l\'autre n\'est une faute.',
    },
    {
      key: 'autobaisse',
      nom: 'Le rire qui s\'auto-rabaisse',
      sousLigne: 'le rire qui se prend pour cible',
      genre: 'm',
      lecture:
        'Cette barre dit le rire tourné vers toi. Pleine : tu te moques de toi en premier pour faire rire. Légère : tes failles se racontent sans blague. Les deux places se valent — la barre décrit un style, elle ne note rien.',
    },
  ],

  accompagnement: {
    // SENS : fort = style très présent · doux = style discret — les quatre
    // se valent, aucun palier flatté ni blâmé (neutralité typologique).
    // L'ombre y est un COÛT nommé (pour toi / pour l'autre), pas une faute.
    rapproche: {
      fort:
        'Ton rire délie les langues : la gêne sort et les gens se parlent. C\'est un cadeau pour les tables. Ce qui aide : garder un moment sans rire pour parler vrai — le sérieux s\'y sent invité.',
      equilibre:
        'Le rire qui rassemble vient par touches, selon les soirs et les personnes. C\'est un entre-deux fréquent. Ce qui aide : repérer les moments où ton rire ouvre la conversation — et ceux où il l\'occupe.',
      doux:
        'Ton humour reste discret chez les gens nouveaux : tu observes avant de lancer. C\'est un rythme, pas une absence. Ce qui aide : poser une blague à ton rythme — le lien se fabrique aussi en douceur.',
    },
    dedramatise: {
      fort:
        'Tu ris de tes galères pour mieux les traverser : les coups durs deviennent racontables. C\'est un recul qui porte. Ce qui aide : poser le rire après le mot sérieux — l\'essentiel garde son tour.',
      equilibre:
        'Le recul drôle alterne : des jours tu traverses en riant, d\'autres le poids reste lourd. Les deux jours se valent. Ce qui aide : dire à l\'autre lequel des deux est là — la météo du rire s\'annonce.',
      doux:
        'Quand la journée devient lourde, le rire s\'efface : tu prends les choses de front. Ce n\'est pas un manque — c\'est une autre traversée. Ce qui aide : nommer ce qui pèse, même sans sourire — un mot clair porte loin.',
    },
    // SENS : fort = le tranchant assumé · doux = la retenue choisie — les
    // deux se valent, aucun des deux n'est condamné ni prescrit.
    blesse: {
      fort:
        'Ton rire voit vite le faux, et tu dis tout haut ce que d\'autres gardent. C\'est un franc-parler qui s\'assume. Ce qui aide : garder le tranchant pour les idées, la douceur pour les failles des proches.',
      equilibre:
        'La pique vient par touches, selon les personnes et les moments. Les deux lectures se valent. Ce qui aide : vérifier qui rit vraiment — la cible se compte après la blague, pas pendant.',
      doux:
        'Tes moqueries épargnent les gens autour de toi : ton rire pique rarement sa cible. C\'est une retenue choisie. Ce qui aide : oser le mot qui débloque quand tout le monde attend — il sera bien reçu.',
    },
    // SENS : fort = la cible volontaire · doux = la faille dite
    // sérieusement — les deux se valent, aucun des deux n'est une faiblesse.
    autobaisse: {
      fort:
        'Tu te moques de toi en premier : la gêne n\'a pas le temps de s\'installer. C\'est une générosité assumée. Ce qui aide : présenter une force sans rire — une seule fois, et la porte s\'ouvre.',
      equilibre:
        'La blague sur soi vient et repart : tu partages tes failles sans en faire un costume. Ce qui aide : remarquer les soirs où tu ris de toi — et ceux où tu te racontes.',
      doux:
        'Tu racontes tes failles sans en faire des blagues : le sérieux d\'abord. C\'est une autre entrée en matière. Ce qui aide : laisser le rire entrer par petites touches — il désamorce aussi.',
    },
  },

  conseils: [
    'Les quatre façons de faire rire se valent : ton style se raconte, il ne se classe pas.',
    'L\'ombre d\'un style est un coût, pas une faute — elle se nomme pour toi comme pour l\'autre.',
    'En couple, dis quel rire est arrivé : la même plaisanterie ne porte pas le même mot selon les jours.',
    'Ta carte se partage si tu veux : ton rire est une façon d\'être trouvé, pas une note.',
  ],

  commentLire:
    'Quatre barres, et elles viennent de TES réponses : une par façon de faire rire. ' +
    'Le rire qui rapproche, celui qui dédramatise, celui qui blesse, celui qui s\'auto-rabaisse. ' +
    'Elles vont de 0 à 100 — ni une note, ni un verdict. ' +
    'Plus pleine ne veut pas dire mieux : les quatre façons de faire rire se valent. ' +
    'Chacune a sa grâce et son coût — les deux sont écrits dessous. ' +
    'Relis-les comme un portrait, pas un tribunal.',

  ombreRelationnel: {
    'CARTE-5.7-RAPPROCHE':
      'En relation, ta zone d\'ombre peut donner : le sujet grave parti en blague avant d\'avoir eu lieu. Pour toi : être drôle au lieu d\'être entendu. Pour l\'autre : un essentiel qu\'il cesse d\'amener, faute de le voir atterrir. Ce qui aide : un moment sans rire pour parler vrai — le sérieux s\'y sent invité.',
    'CARTE-5.7-LEGER':
      'En relation, ta zone d\'ombre peut donner : la conversation nécessaire fermée trop tôt par un rire bien placé. Pour toi : une inquiétude vraie restée anecdote. Pour l\'autre : croire que ça va, parce que ça se raconte bien. Ce qui aide : nommer le poids une fois sans le rendre drôle — puis reprendre le rire.',
    'CARTE-5.7-TRANCHANT':
      'En relation, ta zone d\'ombre peut donner : la pique qui n\'a pas prévenu sa cible. Pour toi : des proches qui éditent ce qu\'ils te confient. Pour l\'autre : une faille confiée devenue risquée devant témoins. Ce qui aide : le tranchant pour les idées, la douceur pour les failles.',
    'CARTE-5.7-DESAMORCE':
      'En relation, ta zone d\'ombre peut donner : la blague sur soi devenue la seule présentation. Pour toi : des faiblesses connues par cœur, des forces qui attendent. Pour l\'autre : rassurer à l\'infini, une tendresse qui s\'use. Ce qui aide : raconter une force sans rire — une fois suffit à changer l\'adresse.',
  },

  // DERNIÈRE quête ouverte du Monde 6 « Mon Cœur » — la chaîne du monde se
  // referme ici (précédent 4.3 en fin de M5) : le Monde suivant n'est pas
  // construit, la transition passera par prochaineQuete()/l'atlas. AUCUN id
  // de suite n'est inventé : la quête 5.4 (trames hébergées, phase V12)
  // n'est ni construite ni nommable, et le Monde 7 n'a pas d'entrée au
  // registre — d'où suivante = null.
  suivante: null,

  suite: {
    titre: 'La suite de ton voyage',
    intro:
      'Ton rire est posé — quatre façons de faire rire à égalité, chacune avec sa grâce et son coût. ' +
      'La suite du voyage regarde les tempêtes : les désaccords, la tension, la réparation. ' +
      'Ce qui frotte se dit, ce qui casse se répare — à deux.',
    questions: [
      'Quand le désaccord arrive, qu\'est-ce qui te revient de ton histoire — et que veux-tu garder ?',
      'Qu\'est-ce qui, chez toi, répare une tension — un mot, un temps, un geste ?',
    ],
    // CTA générique : le monde suivant n'est pas construit — le texte ne
    // présuppose rien de son contenu (zéro teaser).
    cta: 'Continuer le voyage',
  },
};

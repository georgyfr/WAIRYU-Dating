/**
 * Couche accompagnement de la quête 5.5 « Quand la tension monte »
 * (Monde 7 « Face aux Tempêtes » · 💎 PREMIUM).
 *
 * Rédigée (jamais verbatim du Livrable), ton Task 35 : tutoiement, simple et
 * littéral, phrases courtes, jamais un diagnostic, jamais culpabilisant.
 * Alimente l'entrée « 5.5 » du registre (quetes.ts).
 *
 * LA DOCTRINE DES TEMPÉRATURES (doctrine capitale du Livrable — à ne pas
 * inverser) : les quatre façons dont la tension sort se valent — l'explosif
 * n'est pas « pire » que le fermé : ce sont des températures différentes.
 * La montée de tension n'est JAMAIS un défaut : une barre pleine ne se
 * corrige pas, une barre légère n'est pas une vertu (zéro idéalisation de
 * la retenue — la tension sort par d'autres chemins). L'ombre nomme un
 * PRIX (pour soi ET pour l'autre), jamais une nature défaillante. Zéro
 * pathologisation de l'explosif ; le silence est une garde, jamais un
 * défaut absolu (« passif », « évitant », « fuyant » : interdits) ; le
 * profil sombre se dit « le corps qui suit » — le jargon clinique reste
 * hors de cette app. Le rendu parle en images, jamais en étiquette.
 *
 * ANCRAGE : les lectures pleines citent ce que tu as répondu des énoncés D
 * de cette quête (01 · 03 · 05 · 07) ; les branches légères paraphrasent
 * les énoncés I sans les citer comme réponse haute (règle d'ancrage —
 * citer un énoncé I au score haut serait une fausse citation).
 *
 * Les clés des dims = les températures du scorer (quete-5-5.ts).
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots, aucun code/score
 * ni métadonnée moteur dans un texte rendu.
 */
import type { EntreeRegistre } from './quetes';

export const DEF_55: EntreeRegistre = {
  sousTitre:
    'La quête de ta température : comment la tension sort de toi, racontée sans classement et sans juge.',

  dims: [
    {
      key: 'explosif',
      nom: 'Les mots qui montent',
      sousLigne: 'les mots qui sortent plus fort, ou le volume tenu',
      genre: 'm',
      lecture:
        'Cette barre dit la part des mots qui montent. Pleine : quand la tension monte, les mots sortent plus fort que toi — ce qui se traverse se voit. Légère : ta montée reste à bas volume, le volume de ta voix se tient. Les deux places se valent — la barre décrit un chemin, elle ne note rien.',
    },
    {
      key: 'ferme',
      nom: 'Le mur',
      sousLigne: 'le mur qui se pose, ou la porte tenue ouverte',
      genre: 'm',
      lecture:
        'Cette barre dit la place du mur sous tension. Pleine : tu lèves un mur et tu te tais — une garde posée face à l\'autre. Légère : tu gardes la porte de la discussion ouverte. Les deux places se valent — la barre décrit une garde, elle ne note rien.',
    },
    {
      key: 'verbalise',
      nom: 'Le retour au calme',
      sousLigne: 'le second tour, ou le sujet qui reste clos',
      genre: 'm',
      lecture:
        'Cette barre dit le poids du second tour. Pleine : le calme revenu, tu reviens sur ce qui a blessé. Légère : un sujet qui fait mal reste clos pour toi. Les deux places se valent — la barre décrit un rythme, elle ne note rien.',
    },
    {
      key: 'sombre',
      nom: 'Le corps qui suit',
      sousLigne: 'le repli où la peine se porte, ou le passage sans dépôt',
      genre: 'm',
      lecture:
        'Cette barre dit ce qui descend. Pleine : tu te replie et le corps suit — la peine occupe la place des mots. Légère : la tension traverse et repart sans s\'installer. Les deux places se valent — la barre décrit un portage, elle ne note rien.',
    },
  ],

  accompagnement: {
    // SENS : fort = température marquée (la tension sort beaucoup par ce
    // chemin) · doux = chemin discret (elle sort ailleurs) — les quatre se
    // valent, aucun palier flatté ni blâmé. Une barre légère n'est pas une
    // vertu : zéro idéalisation de la retenue. L'ombre y est un PRIX nommé
    // (pour toi / pour l'autre), jamais une nature défaillante.
    explosif: {
      fort:
        'La tension sort par les mots, et ça se voit : on sait où tu en es. En couple, les mots vifs coûtent deux fois — au départ, puis en réparations. L\'autre retient le volume plus longtemps que le fond. Ce qui se joue ici : un prix, pas une condamnation. Ce qui aide : nommer la montée avant le fond — le volume baisse quand il est dit.',
      equilibre:
        'Les mots qui montent viennent par touches : selon les soirs, ça parle fort ou ça reste contenu. C\'est un entre-deux fréquent. Ce qui aide : repérer les moments où le volume part — et le dire à l\'autre avant, pas après.',
      doux:
        'Ton volume reste tenu quand ça chauffe : ta montée parle bas. Ce n\'est pas une retenue à louer, ni un silence à corriger — un autre chemin. Ce qui aide : laisser les mots sortir à ton rythme, même petit — un mot dit pèse moins qu\'un volume gardé.',
    },
    // SENS : fort = la garde assumée · doux = la porte tenue ouverte — les
    // deux se valent ; le silence est une garde, jamais un défaut absolu.
    ferme: {
      fort:
        'Sous tension, tu poses un mur : tu ne parles pas avant d\'avoir retrouvé ta main. Ton silence protège la discussion de l\'incendie — une garde, pas une fuite. Le prix : l\'autre parle à un mur sans savoir s\'il écoute, et tu portes seul·e ce qui demandait deux voix. Ce qui aide : donner au silence une date — « j\'y reviens » transforme le mur en délai.',
      equilibre:
        'Le mur se lève par moments : tu te tais quand ça chauffe, puis tu reviens. Les deux temps se valent. Ce qui aide : dire à l\'autre lequel des deux est là — un silence annoncé se traverse à deux.',
      doux:
        'La discussion reste ouverte sous tension : tu gardes une porte où d\'autres posent un mur. C\'est une disponibilité, pas une performance de calme. Ce qui aide : vérifier que la porte sert aux deux — parler vite n\'est pas parler juste.',
    },
    // SENS : fort = le second tour choisi · doux = le sujet laissé clos —
    // les deux rythmes se valent, aucun des deux n'est un retard à punir.
    verbalise: {
      fort:
        'Le calme revenu, tu reviens sur ce qui a blessé : les mots arrivent entiers, sans le volume de la montée. Le prix : entre la montée et le retour, la blessure s\'installe — l\'autre traverse la scène sans toi. Ce n\'est pas un retard à reprocher : un rythme. Ce qui aide : dire quand tu reviendras — un retour posé garde sa promesse.',
      equilibre:
        'Le retour au calme alterne : des fois tu reviens vite, des fois le sujet reste clos. Les deux rythmes se valent. Ce qui aide : nommer le délai d\'avance — l\'attente annoncée se traverse à deux.',
      doux:
        'Un sujet qui fait mal reste clos : tu préfères passer à autre chose. Ce n\'est pas de l\'indifférence — un autre rapport au prix. Ce qui aide : rouvrir un sujet clos de temps en temps — une phrase remet la porte entrebâillée.',
    },
    // SENS : fort = le portage du corps · doux = le passage sans dépôt —
    // les deux se valent ; « le corps qui suit » se dit en images, jamais
    // en jargon clinique, et le portage n'est pas une faiblesse.
    sombre: {
      fort:
        'Quand la tension monte, tu te replie et le corps suit : la peine occupe la place des mots. Ton corps raconte ce que les mots n\'ont pas encore dit — et ce portage use. Le prix : la tension se paie deux fois — dedans, puis dans le corps. Ce que ça dit : un portage, pas une faiblesse. Ce qui aide : mettre une phrase courte sur la peine — nommée, elle se porte moins lourd.',
      equilibre:
        'Le repli vient par vagues : parfois ça descend et se porte, parfois ça traverse et repart. Les deux passages se valent. Ce qui aide : dire après coup ce qui s\'est passé dedans — le corps a déjà parlé, les mots complètent.',
      doux:
        'La tension traverse et repart sans s\'installer : tu rebondis sans dépôt. Ce n\'est pas de l\'insensibilité — un passage léger. Ce qui aide : accueillir aussi les fois où ça reste — une peine reçue pèse moins partagée.',
    },
  },

  conseils: [
    'Les quatre températures se valent. Chez tout le monde, la tension monte : la question n\'est pas si — c\'est comment, et à quel prix.',
    'Ta température se raconte en images, pas en étiquette : c\'est un chemin, pas un diagnostic.',
    'Une température n\'est pas un défaut : elle a sa lumière et son prix — les deux se disent.',
    'En couple, dis comment ta tension sort : un chemin annoncé se traverse à deux.',
  ],

  commentLire:
    'Quatre barres, et elles viennent de TES réponses : une par façon dont la tension sort. ' +
    'Tu exploses, tu te fermes, tu verbalises à froid, tu sombres. ' +
    'Elles vont de 0 à 100 — ni une note, ni un verdict. ' +
    'Une barre plus pleine ne place personne au-dessus : les quatre températures se valent. ' +
    'Chacune a sa lumière et son prix — les deux sont écrits dessous. ' +
    'Relis-les comme un portrait, pas un tribunal.',

  ombreRelationnel: {
    'CARTE-5.5-MOTS-VIFS':
      'En relation, ta zone d\'ombre peut donner : des mots vifs qui dépassent le différend, payés en réparations. Pour toi : réparer au-delà de ce que tu as voulu dire. Pour l\'autre : garder le volume en mémoire plus longtemps que le fond. Ce qui aide : nommer la montée avant le fond — dire « là, ça monte » fait baisser le volume.',
    'CARTE-5.5-MUR':
      'En relation, ta zone d\'ombre peut donner : un mur vite posé, longtemps démonté — une pause lue comme une fin. Pour toi : porter seul·e ce qui demandait deux voix. Pour l\'autre : parler à un mur sans savoir s\'il écoute. Ce qui aide : une chose dite avant le silence — « j\'y reviens » donne au mur une date.',
    'CARTE-5.5-LE-RETOUR':
      'En relation, ta zone d\'ombre peut donner : une blessure qui s\'installe le temps du refroidissement. Pour toi : des mots justes, mais tardifs. Pour l\'autre : vivre la montée sans savoir ce qui en reviendra en mots. Ce qui aide : poser le retour avant de partir — un horaire dit vaut trois devinettes évitées.',
    'CARTE-5.5-LE-CORPS':
      'En relation, ta zone d\'ombre peut donner : une peine portée dedans, lisible sur le corps avant d\'être dite. Pour toi : la tension se paie deux fois — dedans, puis dans le corps. Pour l\'autre : vivre près d\'une peine qu\'on ne sait pas consoler, faute de la voir dite. Ce qui aide : nommer la peine en une phrase à toi — un nom posé allège le portage.',
  },

  // Le chaînage M7 pointe vers 5.6 « Après un désaccord » (quête suivante
  // du monde). L'IdQuete du registre couvre encore les mondes 1-6 : cast
  // documenté jusqu'à l'extension du type par l'orchestrateur (intégration
  // M7 — même pattern que les quêtes 2.x/3.x/5.x).
  suivante: '5.6' as unknown as EntreeRegistre['suivante'],

  suite: {
    titre: 'La suite de ton voyage',
    intro:
      'Ta température est posée — quatre chemins pour la montée, aucun au-dessus des autres. ' +
      'La suite du voyage regarde l\'après : ce qui se joue une fois le désaccord passé. ' +
      'Un différend reste banal quand la réparation arrive — la prochaine étape regarde la tienne.',
    questions: [
      'Quand la montée est retombée, qu\'est-ce qui t\'aide à revenir — et qu\'est-ce qui t\'en retient ?',
      'Quelle réparation te ressemble : un mot, un temps, un geste — et laquelle attend encore ton essai ?',
    ],
    cta: 'Aller vers la réparation',
  },
};

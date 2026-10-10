/**
 * Couche accompagnement de la quête 4.2 « Où tu en es aujourd'hui »
 * (Monde 5 « Ton Héritage »).
 *
 * Rédigée (jamais verbatim du Livrable), ton Task 35 : tutoiement, simple et
 * littéral, phrases courtes, jamais un diagnostic, jamais culpabilisant.
 * Alimente l'entrée « 4.2 » du registre (quetes.ts).
 *
 * NEUTRALITÉ DES ÉTATS (doctrine capitale du Livrable — à ne pas inverser) :
 * apaisé, en chemin, en travail — trois météos, JAMAIS des stades d'une
 * guérison (interdit V10). Personne n'est « en retard » : l'état qui
 * travaille n'est pas un échec, la place calme n'est pas un détachement.
 * Aucun vocabulaire clinique (« RB1 », « récupération », « guérison ») — le
 * rendu parle d'images (les cartons, la braise, la porte au présent).
 *
 * Les clés des dims = les familles du scorer (quete-4-2.ts).
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots, aucun code/score
 * ni métadonnée moteur dans un texte rendu.
 */
import type { EntreeRegistre } from './quetes';

export const DEF_42: EntreeRegistre = {
  sousTitre: 'La météo du présent : où tu en es après tes histoires passées.',

  dims: [
    {
      key: 'intégration',
      nom: 'Ce que le passé te sert',
      sousLigne: 'ce que les chapitres passés t\'ont appris',
      genre: 'm',
      lecture:
        'Cette barre dit ce que tes histoires passées te servent. Pleine : elles t\'ont appris quelque chose, et le calme tient. Légère : les mêmes pages tournent encore. Les deux se valent — un rangement et un travail, jamais une note.',
    },
    {
      key: 'état',
      nom: 'La place que l\'histoire occupe',
      sousLigne: 'le réveil, la comparaison, le présent',
      genre: 'f',
      lecture:
        'Cette barre dit la place que ton ancienne histoire occupe encore. Pleine : le passé remonte, la comparaison travaille — une maison en travaux, pas une faille. Légère : le passé reste où il est, la plupart du temps. Les deux places se valent — une météo, jamais un stade.',
    },
    {
      key: 'réassurance',
      nom: 'Ton besoin de clarté',
      sousLigne: 'les confirmations, la relecture, le silence',
      genre: 'm',
      lecture:
        'Cette barre dit ton besoin de confirmations. Pleine : entendre que c\'est solide t\'aide à tenir — un besoin légitime. Légère : une parole claire te porte longtemps. Les deux rythmes se valent — un besoin de clarté, jamais un verdict.',
    },
  ],

  accompagnement: {
    // SENS : fort = chapitres qui servent · doux = chapitres qui travaillent
    // encore — les deux se valent, aucun stade de guérison (interdit V10).
    intégration: {
      fort:
        'Tes chapitres passés te servent : tu sais ce qu\'ils t\'ont appris, et le calme tient. Ce qui aide : raconter comment tu as rangé — l\'autre y trouvera son propre tempo.',
      equilibre:
        'Des pages tournent, d\'autres se relisent : ton passé te sert parfois, te pèse parfois. C\'est un entre-deux honnête. Ce qui aide : laisser les deux cohabiter — rien n\'est en retard.',
      doux:
        'Les mêmes pages tournent encore : ce que ces histoires t\'ont appris attend d\'être nommé. Ce n\'est pas un échec — c\'est un travail. Ce qui aide : une question à la fois — « qu\'est-ce que ça m\'a appris » plutôt que « pourquoi encore ».',
    },
    // SENS : fort = place occupée · doux = porte au présent — une météo qui
    // se décrit, jamais une note de progrès.
    état: {
      fort:
        'Ton histoire est rangée : le passé reste où il est, la plupart du temps. Ce qui aide : garder une place pour la météo de l\'autre — elle n\'a pas ton calendrier.',
      equilibre:
        'Le passé remonte par touches : un prénom, une chanson. La porte au présent s\'ouvre encore. Ce qui aide : annoncer les jours de bascule — la météo y gagne un bulletin.',
      doux:
        'L\'histoire occupe de la place : le réveil, la comparaison, le présent à défendre. Ce n\'est pas une faille — une maison en travaux. Ce qui aide : une peur précise à la fois, dite à voix basse — la clarté commence par elle.',
    },
    // SENS : fort = besoin de confirmations · doux = réserve tranquille —
    // deux rythmes de clarté, les deux se valent.
    réassurance: {
      fort:
        'Tu demandes des confirmations, et le silence de l\'autre t\'écrit des scénarios : la clarté t\'aide à tenir. Ce besoin est légitime. Ce qui aide : nommer la peur précise — la répétition use, la demande précise apaise.',
      equilibre:
        'Une parole claire te porte longtemps, avec des rechutes de relecture : ton besoin de clarté respire. Ce qui aide : dire quand la vérification tourne — l\'autre peut t\'aider à poser la boucle.',
      doux:
        'Tu fais confiance à ce qui est construit, sans répétition : la réserve tranquille. Ce qui aide : entendre que l\'autre, parfois, a besoin du contraire — deux rythmes de clarté, les deux se valent.',
    },
  },

  conseils: [
    'Ta météo se décrit, elle ne se note pas : apaisé, en chemin, en travail — trois places égales.',
    'Personne n\'est en retard : le chemin n\'a pas d\'horaire imposé.',
    'Ton besoin de clarté est légitime : le dire précisément vaut mieux que le répéter.',
    'La page d\'écoute, si tu l\'écris, reste chez toi — jamais citée, jamais montrée.',
  ],

  commentLire:
    'Trois barres, et elles viennent de TES réponses : ce que le passé te sert, la place qu\'il occupe, ton besoin de clarté — trois angles d\'où tu en es. Elles vont de 0 à 100 — ni une note, ni un verdict. Apaisé, en chemin, en travail : trois météos, aucun stade — personne n\'est en retard. Ce qu\'elles regardent et ce qu\'elles disent de toi sont écrits dessous — relis-les comme une météo, pas un bulletin.',

  ombreRelationnel: {
    'CARTE-4.2-CHAPITRE-REFERME':
      'En relation, ta zone d\'ombre peut donner : une sérénité prise pour du détachement. Ce qui aide : raconter ton rangement — il donne à l\'autre son propre tempo.',
    'CARTE-4.2-PAGE-QUI-TOURNE':
      'En relation, ta zone d\'ombre peut donner : une météo qui change sans bulletin. Ce qui aide : annoncer les bascules — elles ne se choisissent pas, elles s\'annoncent.',
    'CARTE-4.2-MAISON-EN-TRAVAUX':
      'En relation, ta zone d\'ombre peut donner : des preuves répétées qui usent les deux. Ce qui aide : nommer la peur précise — la clarté commence par elle, et elle apaise plus que la répétition.',
  },

  suivante: '4.3',

  suite: {
    titre: 'La suite de ton voyage',
    intro:
      'Ta météo du présent est posée — apaisé, en chemin ou en travail : trois places égales, aucune note. ' +
      'La dernière étape du monde t\'écoute : une page ouverte pour ce que tes relations t\'ont appris — ' +
      'si tu veux, et à ta façon.',
    questions: [
      'Que t\'ont servi tes chapitres passés — et que voudrais-tu en faire encore ?',
      'Qu\'est-ce qui, dans ton présent, attend d\'être rangé ?',
    ],
    cta: 'Ouvrir la page d\'écoute',
  },
};

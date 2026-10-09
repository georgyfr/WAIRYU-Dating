/**
 * Couche accompagnement de la quête 3.1 « Ton rythme de vie »
 * (Monde 4 « Ton terrain »).
 *
 * Rédigée par les agents quête (jamais verbatim du Livrable), ton Task 35 :
 * tutoiement, simple et littéral, phrases courtes, jamais un diagnostic,
 * jamais culpabilisant. Alimente l'entrée « 3.1 » du registre (quetes.ts).
 *
 * UNE SEULE BARRE (la dim unique du scorer — quete-3-1.ts, clé « chrono ») :
 * CHRONO_D normalisée 0-1 — haute = ton énergie vit le matin, basse = tes
 * heures fortes se lèvent avec le soir. Le nom moteur et tout seuil restent
 * moteur seul — jamais rendus (C2/C3 : ni « chronotype », ni « matinalité »,
 * ni chiffre).
 *
 * NEUTRALITÉ NORMATIVE ABSOLUE (doctrine capitale du Livrable, gravée au
 * 00-README et à cartes.yaml) : le lève-tôt ne vaut pas mieux que le
 * couche-tard — trois façons égales d'habiter la journée. AUCUN palier n'est
 * flatté ni blâmé : une barre pleine n'est pas de la discipline, une barre
 * légère n'est pas de la paresse, l'entre-deux n'est pas de l'indécision.
 * Le badge 🌅/🦉 des extrêmes est un pont de conversation, jamais un grade —
 * cette couche ne le présente jamais autrement.
 *
 * Registre probabiliste : l'ombre relationnelle nomme une conséquence du
 * mouvement du rythme (le soir qui ferme tôt, l'heure qui se défend mal) —
 * jamais un défaut, jamais « vos rythmes sont incompatibles », jamais une
 * asymétrie (personne n'est « le lève-tard » de l'équation).
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots, aucun code/score
 * ni métadonnée moteur dans un texte rendu.
 */
import type { EntreeRegistre } from './quetes';

/** « 3.2 » est la quête suivante du Monde 4 — l'union IdQuete s'élargira au
 *  câblage du registre (quetes.ts, tâche d'intégration M4). Pont de typage en
 *  attendant l'extension du type (même convention que quete-2-1-def.ts). */
type IdSuivante31 = EntreeRegistre['suivante'];

export const DEF_31: EntreeRegistre = {
  sousTitre: "La quête du terrain : l'heure où tu es pleinement toi.",

  dims: [
    {
      key: 'chrono',
      nom: 'Ton heure à toi',
      sousLigne: 'le moment où ton énergie est à soi',
      genre: 'f',
      lecture:
        'Cette barre dit à quel moment de la journée tu es le plus à toi. Pleine : tes heures fortes vivent le matin. Légère : elles se lèvent avec le soir. Les deux manières se valent — l\'entre-deux aussi. La barre décrit une horloge, elle ne note rien.',
    },
  ],

  accompagnement: {
    // SENS : fort = ton énergie vit le matin · doux = tes heures fortes se
    // lèvent le soir · equilibre = l'entre-deux — les trois rythmes se valent,
    // aucun palier n'est flatté ni blâmé (neutralité absolue du Livrable).
    chrono: {
      fort:
        'Ta journée démarre avant le bruit du monde : les premières heures sont tes heures fortes. Ce qui aide : nommer ton créneau fort — il devient un rendez-vous possible, pour toi comme à deux.',
      equilibre:
        'Ni matin affirmé, ni soir assumé : ton énergie suit les jours et les saisons. Cette souplesse dénoue les agendas bloqués — elle aussi mérite un créneau qui n\'appartient qu\'à toi.',
      doux:
        'Ton énergie se lève quand le monde se couche : le soir te rend à toi. Ce n\'est pas un défaut — c\'est ton horloge, à égalité avec les autres. Nomme tes heures calmes : elles deviennent des rendez-vous possibles.',
    },
  },

  conseils: [
    'Relis ta carte à tête reposée : ton rythme se vérifie dans les semaines ordinaires, pas les parfaites.',
    'Aucune heure ne vaut mieux qu\'une autre : le matin, l\'entre-deux et le soir sont trois façons égales d\'habiter la journée.',
    'Ton rythme décrit ton horloge libre — jamais une discipline, jamais un manque.',
    'Ton profil d\'aujourd\'hui peut glisser : la barre dit une heure, pas une case pour toujours.',
  ],

  commentLire:
    'Une seule barre, et elle vient de TES réponses : l\'heure où tu es le plus à toi. ' +
    'Elle va de 0 à 100 — ni une note, ni un verdict. ' +
    'Pleine : ton énergie vit le matin. Légère : elle se lève avec le soir. ' +
    'L\'entre-deux glisse entre les deux — au même titre. ' +
    'Plus pleine ne veut pas dire mieux : les trois rythmes se valent.',

  ombreRelationnel: {
    'CARTE-3.1-PREMIER-TRAIN':
      'En relation, ta zone d\'ombre peut donner : une fin de journée où l\'un dort déjà, l\'autre arrive. ' +
      'Ton soir se ferme plus tôt que celui de beaucoup de gens — c\'est ton horloge, pas un choix contre l\'autre. ' +
      'Ce qui aide : nommer l\'heure où ta journée s\'achève, et garder un moment commun plus tardif quand il compte.',
    'CARTE-3.1-MAREE':
      'En relation, ta zone d\'ombre peut donner : une horloge qui suit volontiers celle des autres. ' +
      'À force de composer, ta propre heure ne se défend plus seule — et l\'autre ne sait plus quand te trouver. ' +
      'Ce qui aide : protéger un créneau fixe qui n\'appartient qu\'à toi, et le dire autour de toi.',
    'CARTE-3.1-LAMPE-MINUITEME':
      'En relation, ta zone d\'ombre peut donner : un matin où le monde démarre avant ton horloge. ' +
      'À deux, ce décalage se nomme tôt ou se subit — et l\'autre peut le vivre sans le comprendre. ' +
      'Ce qui aide : dire à quelle heure ta journée commence vraiment, et créer vos meilleurs moments communs.',
  },

  // Pont de typage : voir note au-dessus — l'intégration M4 étendra IdQuete.
  suivante: '3.2' as unknown as IdSuivante31,

  suite: {
    titre: 'La suite de ton voyage',
    intro:
      'Tu sais maintenant à quelle heure tu es pleinement toi. ' +
      'La prochaine quête regarde le fil de tes journées. ' +
      'Ce que tu planifies, ce que tu improvises, la place des choses chez toi.',
    questions: [
      'Une sortie se décide chez toi des jours à l\'avance — ou au moment de partir ?',
      'Quand les choses s\'accumulent chez toi, ça se vit comment — et ça se répare ?',
    ],
    cta: 'Découvrir ton quotidien',
  },
};

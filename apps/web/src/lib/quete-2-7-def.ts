/**
 * Couche accompagnement de la quête 2.7 « Ta vision de la famille »
 * (Monde 3 « La Boussole »).
 *
 * Rédigée par les agents quête (jamais verbatim du Livrable), ton Task 35 :
 * tutoiement, simple et littéral, phrases courtes, jamais un diagnostic,
 * jamais culpabilisant. Alimente l'entrée « 2.7 » du registre (quetes.ts).
 *
 * LES QUATRE BARRES (sens, à ne pas inverser — chaque paire R6 porte l'axe) :
 *  - `desir`   : pleine = des enfants font partie du projet · légère = se
 *    construire sans enfants dans le plan ;
 *  - `horizon` : pleine = le projet attend que le reste soit posé · légère =
 *    le projet appelle à être lancé tôt ;
 *  - `roles`   : pleine = carrière et maison se règlent à deux, sans rôle
 *    assigné · légère = chacun garde son domaine attitré ;
 *  - `famille` : pleine = la famille élargie accueillie · légère = le noyau
 *    choisi (« d'abord entre nous deux »).
 *
 * DOCTRINE (Livrable 00-README + 04-slots) : neutralité ABSOLUE sur la
 * parentalité — désirer un enfant, hésiter, ne pas en vouloir : trois visions
 * égales en dignité, aucun palier flatté ni blâmé ; « domaine attitré » est
 * une organisation décrite, jamais un archaïsme ; élargie ↔ noyau est une
 * géographie, jamais une doctrine. Le dealbreaker parentalité, SIG-2.7-02
 * (écart d'horizon) et SIG-2.7-03 (friction des rôles) sont des mécanismes
 * MOTEUR : jamais rendus, jamais un seuil, jamais un chiffre d'années.
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots, aucun code/score
 * ni métadonnée moteur dans un texte rendu.
 */
import type { EntreeRegistre, IdQuete } from './quetes';

/** La quête suivante de la chaîne M3 — « Ton signe — le ton », la dernière
 *  quête du monde, juste pour le jeu. L'union `IdQuete` du registre
 *  (quetes.ts) ne porte encore que les ids M1/M2 : elle s'élargira à
 *  l'intégration du Monde 3 — la valeur de chaîne reste exacte d'ici là. */
const SUIVANTE: IdQuete = '2.8' as unknown as IdQuete;

export const DEF_27: EntreeRegistre = {
  sousTitre: 'La quête boussole : ta vision de la famille, posée en toutes lettres.',

  dims: [
    {
      key: 'desir',
      nom: 'Ton désir d\'enfants',
      sousLigne: 'le projet que tu te fais',
      genre: 'm',
      lecture:
        'Cette barre dit la place des enfants dans le projet que tu te fais. Pleine : le projet s\'annonce. Au milieu : le désir reste ouvert. Légère : tu te construis sans enfants dans le plan. Elle regarde ton intention d\'aujourd\'hui, pas une date ni une promesse. Les trois postures se valent : la barre mesure un projet, elle ne note pas une personne.',
    },
    {
      key: 'horizon',
      nom: 'Ton horizon temporel',
      sousLigne: 'quand le projet se pose',
      genre: 'm',
      lecture:
        'Cette barre dit où se situe le projet enfants dans ton horizon. Pleine : tu attends que le reste soit posé. Légère : tu l\'appelles à se lancer tôt. Aucun des deux moments n\'est le bon ou le mauvais : la barre décrit ta géographie, elle ne conseille rien.',
    },
    {
      key: 'roles',
      nom: 'Ta répartition des rôles',
      sousLigne: 'à deux, sans rôle assigné',
      genre: 'f',
      lecture:
        'Cette barre dit comment se répartissent carrière, maison et décisions dans ta vie à deux. Pleine : tout se négocie à deux, sans rôle assigné. Légère : chacun garde un domaine attitré. Les deux organisations se valent — la barre décrit la tienne, elle ne la modernise ni ne la corrige.',
    },
    {
      key: 'famille',
      nom: 'La place de la famille élargie',
      sousLigne: 'accueillie ou noyau choisi',
      genre: 'f',
      lecture:
        'Cette barre dit la place que les familles élargies tiennent dans ta vie de famille. Pleine : elles ont leur place, bienvenues dans le quotidien. Légère : la vie se construit d\'abord entre vous deux. Ni une doctrine ni une vertu : deux géographies, et une maison peut se bâtir sur chacune.',
    },
  ],

  accompagnement: {
    // SENS : fort = le projet s'annonce · doux = le plan se construit sans
    // enfants (ou l'indécision penche de ce côté) — égaux en dignité :
    // le désir d'enfant, l'indécision honnête et le choix sans enfant sont
    // trois vies dignes (doctrine du Livrable, aucun palier flatté ni blâmé).
    desir: {
      fort:
        'Des enfants font partie du projet que tu te fais, et ça se voit : c\'est un projet parental affirmé. Ce n\'est ni un devoir ni un mérite — c\'est ta vision, dite clairement. Ta vigilance : la clarté presse parfois — laisse à l\'autre le temps de répondre aussi.',
      equilibre:
        'Ton désir est en équilibre ouvert : ni lancé d\'un coup, ni fermé — un peut-être honnête. Il n\'appartient qu\'à toi, et il ne trompe personne. Ta vigilance : sans date posée, le peut-être peut finir par décider à ta place.',
      doux:
        'Ton plan se construit sans enfants, ou ton indécision penche de ce côté : ni l\'un ni l\'autre n\'est un manque. Ta vigilance : dit tard, ce plan coûte des années — dis-le tôt, en toutes lettres.',
    },
    // SENS : fort = projet posé après · doux = projet lancé tôt — deux moments
    // valables, la barre ne conseille rien (verrou : jamais de chiffres d'années).
    horizon: {
      fort:
        'Ton projet enfants attend que le reste soit posé : tu veux un socle avant d\'ouvrir le chapitre. C\'est une façon de faire, pas un report à tout prix. Ta vigilance : les socles ne se finissent jamais tout à fait — garde une place, dans ton horizon, pour une décision posée.',
      equilibre:
        'Ton horizon est en deux tons : le projet attend parfois, il s\'impatiente parfois. Tu ajustes selon la vie — c\'est une position souple, pas une hésitation. Ta vigilance : dis où tu en es, plutôt que de laisser l\'autre deviner ta fenêtre.',
      doux:
        'Ton projet appelle à se lancer tôt : tu préfères le vivre tôt plutôt que l\'attendre. C\'est un tempo, pas une précipitation. Ta vigilance : tôt ne veut dire sans socle — un tempo choisi reste un tempo à construire.',
    },
    // SENS : fort = tout se négocie, sans rôle assigné · doux = domaines
    // attitrés — une organisation décrite, jamais jugée (décision de
    // composition n° 3 du tableau 01 : la barre mesure, elle ne modernise pas).
    roles: {
      fort:
        'Carrière et maison se règlent à deux chez toi, sans rôle assigné. C\'est une organisation souple, qui s\'apprend au fil des semaines. Ta vigilance : le partage sans rôles demande des conversations — sans elles, il se refait tout seul.',
      equilibre:
        'Ta répartition est en deux tons : des zones négociées, des zones attitrées. Tu règles selon les personnes et les saisons — c\'est courant, et ça se parle. Ta vigilance : de temps en temps, nomme les zones qui se sont fixées toutes seules.',
      doux:
        'Chez toi, chacun garde son domaine attitré : une organisation claire, choisie par certaines familles. Ni mieux ni moins bien : la barre décrit ton organisation, elle ne la note pas. Ta vigilance : un domaine attitré se choisit, il ne s\'hérite pas — relis les tiens de temps en temps.',
    },
    // SENS : fort = famille élargie accueillie · doux = noyau choisi — une
    // géographie, pas une doctrine (angle mission V8.C, verrou 04 n° 7).
    famille: {
      fort:
        'La famille élargie a sa place dans ta vie de famille : les siens, les tiens, le quotidien partagé. C\'est une géographie ouverte, et elle nourrit beaucoup de maisons. Ta vigilance : la porte ouverte a besoin de fenêtres — garde des espaces rien qu\'à vous deux.',
      equilibre:
        'Ta géographie est nuancée : la famille élargie est bienvenue, le noyau garde son cœur. C\'est un équilibre vivant, qui bouge avec les saisons. Ta vigilance : dis tes nuances à voix haute — elles se vivent mieux nommées.',
      doux:
        'Ta vie de famille se construit d\'abord entre vous deux : un noyau choisi est une géographie complète, pas une fermeture. Ta vigilance : un noyau choisi gagne à dire ses contours, tôt et gentiment, aux familles élargies.',
    },
  },

  conseils: [
    'Relis ta carte à tête reposée : une vision de famille se précise avec le temps, elle ne se vote pas un soir.',
    'Ce qui est clair chez toi, dis-le tôt et en toutes lettres — les grands sujets se parlent mieux tôt que tard.',
    'Désir, horizon, rôles, place des familles : quatre sujets séparés — il n\'y a pas d\'accord complet, il y a des accords par sujet.',
    'Aucune barre ne te définit : elle décrit ta réponse d\'aujourd\'hui, pas une case pour toujours.',
  ],

  commentLire:
    'Quatre barres, et elles viennent de TES réponses : le désir d\'enfants, l\'horizon, la répartition des rôles, la place des familles élargies. Elles vont de 0 à 100 — ni des notes, ni des verdicts : quatre angles dessinés aujourd\'hui. Ce qu\'elles regardent et ce qu\'elles disent de toi sont écrits dessous — relis-les comme un portrait, pas un bulletin.',

  ombreRelationnel: {
    'CARTE-2.7-BERCEAU':
      'En relation, ta zone d\'ombre peut donner : un désir qui presse, et des décisions arrachées que l\'autre vit comme subies. Ce qui aide : poser ton désir en toutes lettres, puis laisser la question respirer — le flou de l\'autre n\'est pas un refus.',
    'CARTE-2.7-PORTE':
      'En relation, ta zone d\'ombre peut donner : un peut-être durable qui laisse porter la décision — et quelqu\'un qui choisit pour deux. Ce qui aide : te donner une échéance intérieure, pour que le flou gagne un cadre.',
    'CARTE-2.7-ROUTE':
      'En relation, ta zone d\'ombre peut donner : une route choisie qui se dit tard — et des années déjà tissées d\'attente. Ce qui aide : dire ton choix dès que ça compte, en toutes lettres et tôt.',
  },

  suivante: SUIVANTE,

  suite: {
    titre: 'Ta vision est posée.',
    intro:
      'Tu as posé ta vision de la famille : le désir, le moment, les rôles, la place des familles. Il reste une dernière quête au monde — et celle-là est juste pour le jeu : un signe à choisir, un ton à donner.',
    questions: [
      'Qu\'est-ce que ta famille d\'origine t\'a légué — et que choisis-tu d\'en garder ?',
      'S\'il n\'y avait personne pour juger, quelle vision de la famille choisirais-tu ?',
    ],
    cta: 'Découvrir « Ton signe — le ton »',
  },
};

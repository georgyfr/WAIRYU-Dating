/**
 * Couche accompagnement de la quête 5.2 « Ta vision de l'amour »
 * (Monde 6 « Mon Cœur »).
 *
 * Rédigée (jamais verbatim du Livrable), ton Task 35 : tutoiement, simple et
 * littéral, phrases courtes, jamais un diagnostic, jamais culpabilisant.
 * Alimente l'entrée « 5.2 » du registre (quetes.ts).
 *
 * NEUTRALITÉ AXIOLOGIQUE STRICTE (doctrine capitale du Livrable — à ne pas
 * inverser) : une croyance n'est ni saine ni fragile — le destin n'est pas
 * une passivité, le coup de foudre n'est pas une légèreté, l'unique n'est
 * pas un refus du réel, l'idéalisation n'est pas une illusion à corriger.
 * Chaque axe a sa lumière et son ombre EN EXCÈS : l'ombre se joue EXCLUSIVEMENT
 * en couple (mécanisme + coût pour soi ET coût pour l'autre, les deux nommés).
 * Zéro diagnostic, zéro étiquette, zéro hiérarchie des croyances, zéro
 * correction de vision (« en réalité », « la vérité c'est que ») — le slot
 * probabiliste raconte un rapport au temps (« la suite te dira si tu attends
 * ou si tu construis »), il ne prédit rien et ne soigne rien.
 *
 * Les clés des dims = les axes du scorer (quete-5-2.ts), SANS accent
 * ('destin', 'foudre', 'unique', 'idealisation') — cohérence def/accents.
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots, aucun code/score
 * ni métadonnée moteur dans un texte rendu.
 */
import type { EntreeRegistre } from './quetes';

export const DEF_52: EntreeRegistre = {
  sousTitre:
    'Une quête de ton cœur : le destin, le coup de foudre, le grand amour unique, l\'idéalisation — quatre films, aucun juge.',

  dims: [
    {
      key: 'destin',
      nom: 'Le destin',
      sousLigne: 'l\'écrit d\'avance, ou la construction',
      genre: 'm',
      lecture:
        'Cette barre dit le poids de l\'écrit d\'avance dans ta façon d\'aimer. Pleine : ce qui doit arriver finit par arriver — une attente d\'évidence. Légère : une belle histoire se construit, elle ne se trouve pas. Les deux manières se valent — la barre décrit un film, elle ne note rien.',
    },
    {
      key: 'foudre',
      nom: 'Le coup de foudre',
      sousLigne: 'l\'éclair, ou le temps qui reconnaît',
      genre: 'm',
      lecture:
        'Cette barre dit le crédit que tu donnes aux premiers instants. Pleine : on peut savoir dès les premières minutes que ça compte. Légère : les sentiments solides demandent du temps pour se reconnaître. Les deux façons se valent — la barre décrit un élan, elle ne note rien.',
    },
    {
      key: 'unique',
      nom: 'Le grand amour unique',
      sousLigne: 'l\'unique, ou les amours qui se valent',
      genre: 'm',
      lecture:
        'Cette barre dit le poids de l\'unique dans ton imaginaire. Pleine : au fond, il n\'y a qu\'un grand amour pour chacun. Légère : plusieurs amours différentes peuvent chacune être grandes. Les deux visions se valent — la barre décrit une promesse, elle ne note rien.',
    },
    {
      key: 'idealisation',
      nom: 'L\'idéalisation',
      sousLigne: 'le potentiel, ou le réel qui suffit',
      genre: 'f',
      lecture:
        'Cette barre dit la place du potentiel dans ton attention. Pleine : quand quelque chose te plaît, tu imagines surtout ce qu\'il pourrait devenir. Légère : tu aimes les gens pour ce qu\'ils montrent, pas pour leur potentiel. Les deux regards se valent — la barre décrit un angle, elle ne note rien.',
    },
  ],

  accompagnement: {
    // SENS : fort = l'écrit d'avance · doux = la construction — les deux se
    // valent, aucun palier n'est flatté ni blâmé (neutralité des croyances).
    destin: {
      fort:
        'Tu lis l\'amour comme un texte déjà écrit : une rencontre marquante a un goût d\'évidence, et l\'imprévu t\'intéresse. Quand la croyance déborde, le quotidien se lit comme des signes — et un désaccord prend valeur d\'oracle. Le coût pour toi : attendre le signe au lieu de construire. Le coût pour l\'autre : porter l\'initiative de la suite. Ce qui aide : dire ce que tu choisis, en plus de ce que tu lis.',
      equilibre:
        'Ton regard mêle l\'écrit et la main qui construit : selon les moments, tu attends ou tu agis. C\'est un entre-deux fréquent — ni texte tout écrit ni maison toute à bâtir. Ce qui aide : nommer, à deux, ce qui se choisit et ce qui se vit.',
      doux:
        'Pour toi, une belle histoire se construit, elle ne se trouve pas : tu bâtis pas à pas. Quand ce pôle déborde, tout devient chantier — et la surprise perd sa place. Le coût pour toi : vouloir tout planifier, jusqu\'au vertige. Le coût pour l\'autre : se sentir corrigé plutôt que rencontré. Ce qui aide : laisser une place à l\'évidence — elle frappe aussi.',
    },
    // SENS : fort = l'éclair · doux = le temps qui reconnaît — les deux se
    // valent, jamais une hiérarchie entre vitesse et patience.
    foudre: {
      fort:
        'Les débuts te vivent grand : être saisi t\'arrive, et tu accordes du crédit à ce premier contact. Quand l\'élan déborde, les histoires commencées vite réclament un rattrapage d\'étapes. Le coût pour toi : t\'engager sur une première impression. Le coût pour l\'autre : jouer un rôle de premier soir qu\'il n\'a pas choisi. Ce qui aide : donner au deuxième rendez-vous le droit d\'être différent du premier.',
      equilibre:
        'Chez toi, l\'éclair et le temps se partagent la scène : tu te laisses toucher, puis tu vérifies. C\'est un rythme souple — le feu du début, la main qui bâtit ensuite. Ce qui aide : nommer ton rythme à l\'autre, pour qu\'aucun des deux ne devine.',
      doux:
        'Les sentiments solides demandent du temps pour se reconnaître : tu laisses les histoires mûrir. Quand la prudence déborde, chaque élan passe au filtre — et le feu met du temps à se déclarer. Le coût pour toi : des débuts éteints avant d\'avoir vécu. Le coût pour l\'autre : se sentir observé plutôt qu\'accueilli. Ce qui aide : offrir un premier contact sans examen — le temps fera son œuvre.',
    },
    // SENS : fort = l'unique · doux = les amours qui se valent — le mythe et
    // la pluralité se valent, aucun des deux n'est l'idéal.
    unique: {
      fort:
        'Au fond, il n\'y a qu\'un grand amour pour chacun : ce que tu construis prend un poids rare. Quand le mythe déborde, chaque histoire se mesure contre une légende — et le quotidien perd souvent. Le coût pour toi : des relations finies avant d\'avoir eu leur chance. Le coût pour l\'autre : rivaliser avec un fantôme. Ce qui aide : traiter le grand amour comme une décision que tu renouvelles.',
      equilibre:
        'Ton imaginaire accueille l\'unique sans enfermer les autres histoires : le mythe inspire, la vie tranche. C\'est une posture rare — rêver grand en regardant qui est là. Ce qui aide : nommer ce que la légende te donne, sans la coller à personne.',
      doux:
        'Plusieurs amours différentes peuvent chacune être grandes : tu donnes à chaque histoire sa chance propre. Quand ce pôle déborde, tout se vaut un peu vite — et l\'engagement perd son relief. Le coût pour toi : une fidélité sans destination. Le coût pour l\'autre : douter d\'avoir compté, vraiment. Ce qui aide : choisir pleinement une histoire — les autres restent possibles.',
    },
    // SENS : fort = le potentiel · doux = le réel qui suffit — l'image et la
    // présence se valent, le rêveur n'est pas un naïf à recadrer.
    idealisation: {
      fort:
        'Quand quelque chose te plaît, tu imagines surtout ce qu\'il pourrait devenir : tu vois le meilleur des gens. Quand l\'image déborde, la relation se joue avec une version imaginée — et l\'écart se paie des deux côtés. Le coût pour toi : vivre avec un potentiel qui arrive après. Le coût pour l\'autre : se sentir invisible, en retard sur ce qu\'on attend de lui. Ce qui aide : nommer ce que tu vois déjà, avant ce que tu rêves.',
      equilibre:
        'Ton attention équilibre le réel et le possible : tu aimes ce qui est là, tu devines ce qui pousse. C\'est un regard fécond — accueillir, et laisser grandir. Ce qui aide : distinguer à voix haute ce que tu vois de ce que tu espères.',
      doux:
        'Tu aimes les gens pour ce qu\'ils montrent, pas pour leur potentiel : ta présence se pose sur le réel. Quand ce pôle déborde, le rêve s\'efface — et demain perd ses défenseurs. Le coût pour toi : des possibles laissés au bord du chemin. Le coût pour l\'autre : se sentir réduit à son présent. Ce qui aide : nommer de temps en temps ce que tu espères — le réel y gagne un avenir.',
    },
  },

  conseils: [
    'Ta vision de l\'amour se regarde sans classement : un film se raconte, il ne se corrige pas.',
    'Les quatre visions de l\'amour se valent : aucune n\'est plus mature, aucune n\'est l\'idéal.',
    'Ta tension est une ouverture, pas un verdict — la suite s\'écrit à quatre mains.',
    'En couple, dis ton film sur l\'amour : les croyances se portent mieux à voix haute.',
  ],

  commentLire:
    'Quatre barres, et elles viennent de TES réponses : le destin, le coup de foudre, le grand amour unique, l\'idéalisation. Elles vont de 0 à 100 — ni une note, ni un verdict. Plus pleine ne veut pas dire mieux : une croyance et son contre-pied se valent. Chacune a sa lumière et son ombre en excès — le débordement se joue en couple. Ce qu\'elles regardent et ce qu\'elles disent de toi sont écrits dessous — relis-les comme un portrait, pas un tribunal.',

  ombreRelationnel: {
    'CARTE-5.2-ECRIT-DAVANCE':
      'En relation, ta zone d\'ombre peut donner : le quotidien lu comme un texte à interpréter, le désaccord pris pour un signal. Toi, tu attends le signe ; l\'autre porte l\'initiative de la suite. Ce qui aide : dire ce que tu choisis, en plus de ce que tu lis — les deux s\'écrivent à quatre mains.',
    'CARTE-5.2-ECLAIR':
      'En relation, ta zone d\'ombre peut donner : une histoire commencée vite, qui réclame un rattrapage d\'étapes. Toi, tu t\'es engagé·e sur une première impression ; l\'autre hérite du rôle du premier soir. Ce qui aide : laisser la deuxième rencontre être autre chose que la première.',
    'CARTE-5.2-UNIQUE':
      'En relation, ta zone d\'ombre peut donner : chaque histoire mesurée contre un mythe, et un quotidien qui perd contre une légende. Toi, tu compares à l\'unique ; l\'autre rivalise avec un fantôme. Ce qui aide : traiter le grand amour comme une décision que tu renouvelles.',
    'CARTE-5.2-VERSION-QUI-POURRAIT':
      'En relation, ta zone d\'ombre peut donner : une affection adressée à la version imaginée, quand la personne réelle diverge. Toi, tu vis avec un potentiel qui arrive après ; l\'autre se sent invisible, en retard. Ce qui aide : nommer ce que tu vois déjà, avant ce que tu rêves.',
  },

  // Le chaînage M6 pointe vers 5.3 « Comment tu exprimes ton affection »
  // (quête suivante du monde). L'IdQuete du registre couvre encore les mondes
  // 1-5 : cast documenté jusqu'à l'extension du type par l'orchestrateur
  // (intégration M6 — chaîne de déblocage, même pattern que les quêtes 2.x/3.x).
  suivante: '5.3' as unknown as EntreeRegistre['suivante'],

  suite: {
    titre: 'La suite de ton voyage',
    intro:
      'Ta vision de l\'amour est posée — quatre films, aucun juge, et un rapport au temps qui t\'appartient. ' +
      'La prochaine étape descend dans le geste : comment tu exprimes ton affection, au quotidien et à deux.',
    questions: [
      'Le destin, l\'éclair, l\'unique, le potentiel : quel film te ressemble le plus, aujourd\'hui ?',
      'Qu\'est-ce que ta vision de l\'amour a changé dans ta façon d\'aimer — et qu\'en gardes-tu ?',
    ],
    cta: 'Descendre dans tes gestes',
  },
};

/**
 * Les profils de démonstration de l'espace Rencontre — STAGING UNIQUEMENT.
 *
 * Prompt fondateur « RESTAURER L'ESPACE RENCONTRES (PREMIÈRE INTERFACE) » §4.2 :
 * les textes de présentation sont FOURNIS (rédigés et validés par nous) —
 * JAMAIS générés à la volée. Les profils sont étiquetés « PROFIL DE
 * DÉMONSTRATION », jamais mélangés aux membres réels en production (D-R3).
 *
 * Les cartes vues par les autres sont écrites à la TROISIÈME personne avec
 * le prénom (jamais le texte « Tes… » reçu par le propriétaire). Aucun
 * score, note, classement ni pourcentage (D-R4) — les échos sont un COMPTE
 * de cartes qui se répondent, jamais une note d'affinité.
 *
 * Apostrophes typographiques U+2019 en échappements (convention du dépôt,
 * audit Task 25).
 */

/** Une carte de personnalité telle que les AUTRES la voient. */
export interface CarteRencontre {
  /** Le code du monde d'origine ('M1'…). */
  monde: string;
  /** Le titre de la carte (serif à l'écran). */
  titre: string;
  /** Le petit sous-titre thématique (ex. « Ses émotions »). */
  sousTitre: string;
  /** Le résumé court (≤ 2 phrases, ~180 caractères, jamais coupé). */
  resume: string;
  /** Les phrases touchables. */
  phrases: string[];
}

/** Une carte encore cachée — elle se révèle en discutant (verrouillée). */
export interface CarteCachee {
  monde: string;
  titre: string;
  /** Le sceau qui l'a verrouillée (« Miroir franchi »…). */
  sceau: string;
}

/** Les trois intentions de la feuille « Demander à [prénom] ». */
export type Intention = 'comprendre' | 'sourire' | 'avancer';

export interface ProfilDemo {
  id: string;
  prenom: string;
  age: number;
  ville: string;
  distanceKm: number;
  /** L'intention en or (« Cherche : relation sérieuse »). */
  intention: string;
  verifie: boolean;
  bio: string | null;
  /** Le chemin de la photo (sous /img/rencontres/) — null = avatar neutre. */
  photo: string | null;
  /** Le nombre de cartes en écho avec toi (1, 2+) — jamais un pourcentage. */
  echo: number;
  /** Le titre de la carte qui se répond — pour les phrases du match. */
  echoTitre: string | null;
  cartes: CarteRencontre[];
  cartesCachees: CarteCachee[];
  /** « Pourquoi vous voit-on ? » — la raison en mots, jamais en note. */
  raison: string;
  /** La phrase-portrait du profil complet. */
  phrasePortrait: string;
  /** Cette personne t'a déjà liké (aimer en retour = match immédiat). */
  likeRecu: boolean;
  /** La raison du match, en mots (si likeRecu). */
  raisonMatch: string | null;
  /** Les 3 phrases suggérées au match (issues des cartes en écho). */
  phrasesMatch: string[];
  metier: string;
  interets: string[];
}

/** Les mondes cités par les cartes de démonstration — bandes colorées
 *  (prompt §6 : corail Miroir, or Volant, vert Ton terrain, teal Boussole). */
export const BANDES_MONDES: Record<string, string> = {
  M1: '#F26B5B', // Le Miroir — corail
  M2: '#F2B544', // Le Volant — or
  M3: '#2BA9A9', // La Boussole — teal
  M4: '#3FB37F', // Ton terrain — vert
  M5: '#C98A5E', // Ton Héritage — terracotta
  M6: '#9B7FB6', // Mon Cœur — prune doux
  M7: '#6FA08E', // Face aux Tempêtes — gris-vert
};

/** Les questions pré-rédigées, PAR THÈME de carte × 3 intentions —
 *  validées d'avance, jamais fabriquées à l'écran. */
export const QUESTIONS_PAR_THEME: Record<string, Record<Intention, string[]>> = {
  'Le Réservoir': {
    comprendre: [
      'Qu\u2019est-ce qui t\u2019aide à te sentir en confiance pour dire ce que tu ressens ?',
      'Quand quelque chose te touche fort, comment ça se passe chez toi ?',
    ],
    sourire: [
      'Tu gardes beaucoup pour toi — tu as bien un secret léger à partager ?',
      'Qu\u2019est-ce qui te fait sortir de ta réserve sans t\u2019en rendre compte ?',
    ],
    avancer: [
      'On peut prendre le temps qu\u2019il faut — tu commencerais par quoi ?',
      'Si on discutait sans horloge, tu me raconterais quoi en premier ?',
    ],
  },
  'La Vague qui frappe': {
    comprendre: [
      'Qu\u2019est-ce qui te fait dire « c\u2019est oui » du premier coup, comme ça ?',
      'Quand tu choisis vite, qu\u2019est-ce que tu écoutes en toi ?',
    ],
    sourire: [
      'C\u2019était quoi, ta décision la plus rapide — et la meilleure ?',
      'Un coup de foudre, pour toi, ça ressemble à quoi ?',
    ],
    avancer: [
      'Si on se rencontrait ce week-end, tu m\u2019emmènerais où d\u2019abord ?',
      'On commencerait comme toi : vite et fort — tu réponds quoi ?',
    ],
  },
  'Le Portefeuille d\u2019images posées': {
    comprendre: [
      'C\u2019est quoi, pour toi, un dimanche réussi ?',
      'Qu\u2019est-ce qui te rend vraiment posé, apaisé ?',
    ],
    sourire: [
      'Café lent ou thé qui infuse — tu es plutôt lequel ?',
      'Ta maison idéale, elle sent quoi, un dimanche matin ?',
    ],
    avancer: [
      'On pourrait commencer par un endroit calme — tu choisirais lequel ?',
      'Si on construisait des dimanches ensemble, tu y mettrais quoi ?',
    ],
  },
  'Le Premier train': {
    comprendre: [
      'C\u2019est quoi, ta plus belle façon de commencer une journée ?',
      'Tu as besoin de calme le matin, ou tu aimes le mouvement ?',
    ],
    sourire: [
      'Tu es plutôt réveil silencieux ou radio qui chante ?',
      'Un mardi sans précipitation, tu en ferais quoi ?',
    ],
    avancer: [
      'Un premier rendez-vous sans précipitation, ça te va ?',
      'On prend le temps que tu veux — tu commencerais par quoi ?',
    ],
  },
  'Le Berceau qui attend': {
    comprendre: [
      'Dans la famille dont tu rêves, il y a quoi, au réveil ?',
      'Qu\u2019est-ce que tu gardes de ta propre famille, et quoi changes-tu ?',
    ],
    sourire: [
      'Une table de famille, ça crie ou ça chante, chez toi ?',
      'Combien de couverts tu vois à ta table, dans dix ans ?',
    ],
    avancer: [
      'On en parle simplement — tu vois quoi, dans les prochaines années ?',
      'Si on construisait sans se presser, on commencerait par quoi ?',
    ],
  },
  'Le Calépin et le flot': {
    comprendre: [
      'Tu planifies ta semaine ou tu la laisses venir ?',
      'C\u2019est quoi, l\u2019imprévu qui te fait le plus plaisir ?',
    ],
    sourire: [
      'Ton agenda a des cases blanches — tu y dessines quoi ?',
      'Un week-end sans plan : panique ou bonheur ?',
    ],
    avancer: [
      'On garde un week-end à l\u2019imprévu, tous les deux ?',
      'Je te propose un plan A et un imprévu B — tu réponds quoi ?',
    ],
  },
};

/** Les lignes or « Avec elle / Avec lui », PAR THÈME — écrites d'avance. */
export const AVEC_ELLLE_LUI: Record<string, string> = {
  'Le Réservoir': 'Avec elle : un échange calme, sans interrogatoire.',
  'La Vague qui frappe': 'Avec elle : des débuts assumés, dits à voix haute.',
  'Le Portefeuille d\u2019images posées': 'Avec elle : des dimanches qui durent, des projets posés.',
  'Le Premier train': 'Avec elle : des matins respectés, rien qui force.',
  'Le Berceau qui attend': 'Avec elle : une famille pensée à deux, sans presser le temps.',
  'Le Calépin et le flot': 'Avec elle : des semaines organisées, des week-ends ouverts.',
};

/** Les trois profils masculins adaptent la ligne (remplace « elle »). */
function avecLui(theme: string): string {
  return (AVEC_ELLLE_LUI[theme] ?? '').replace('Avec elle', 'Avec lui');
}

const FLORENCE: ProfilDemo = {
  id: 'demo-florence',
  prenom: 'Florence',
  age: 34,
  ville: 'Yaoundé',
  distanceKm: 7,
  intention: 'relation sérieuse',
  verifie: true,
  bio: null,
  photo: '/img/rencontres/p-florence.png',
  echo: 1,
  echoTitre: 'Le Portefeuille d\u2019images posées',
  metier: 'Cadre de santé',
  interets: ['Lecture', 'Marches du week-end', 'Cuisine du dimanche'],
  cartes: [
    {
      monde: 'M1',
      titre: 'Le Réservoir',
      sousTitre: 'Ses émotions',
      resume:
        'Florence ressent beaucoup mais ne l\u2019affiche pas. Ses émotions travaillent en profondeur, loin de la surface. Elle a besoin de temps pour les dire.',
      phrases: [
        'Florence ressent beaucoup mais ne l\u2019affiche pas.',
        'Ses émotions travaillent en profondeur, loin de la surface.',
        'Elle a besoin de temps pour les dire.',
      ],
    },
    {
      monde: 'M2',
      titre: 'La Vague qui frappe',
      sousTitre: 'L\u2019épreuve du temps',
      resume:
        'Florence choisit vite et fort : la belle rencontre ce week-end, l\u2019appartement signé sans tarder. Ses histoires commencent tôt, et intensément.',
      phrases: [
        'Florence choisit vite et fort : la belle rencontre ce week-end, l\u2019appartement signé sans tarder.',
        'Ses histoires commencent tôt, et intensément.',
      ],
    },
    {
      monde: 'M4',
      titre: 'Le Portefeuille d\u2019images posées',
      sousTitre: 'Son choix visuel',
      resume:
        'Florence penche vers le repos : la maison, la stabilité, le café lent, le dimanche cadencé.',
      phrases: [
        'Florence penche vers le repos : la maison, la stabilité, le café lent, le dimanche cadencé.',
      ],
    },
  ],
  cartesCachees: [
    { monde: 'M3', titre: 'La Boussole du foyer', sceau: 'Boussole explorée' },
    { monde: 'M6', titre: 'Ce qui compte quand ça compte', sceau: 'Miroir franchi' },
  ],
  raison:
    'On vous montre ensemble parce que vos manières d\u2019aimer se répondent : elle prend son temps, tu sais attendre — et vos deux cartes sur la stabilité racontent la même maison.',
  phrasePortrait: 'Florence : intense dans l\u2019élan, apaisée dans la stabilité.',
  likeRecu: false,
  raisonMatch: null,
  phrasesMatch: [],
};

const AMINATA: ProfilDemo = {
  id: 'demo-aminata',
  prenom: 'Aminata',
  age: 27,
  ville: 'Douala',
  distanceKm: 12,
  intention: 'relation sérieuse',
  verifie: true,
  bio: 'Passionnée de botanique et de marchés du dimanche. Je crois aux conversations lentes.',
  photo: '/img/rencontres/p-aminata.png',
  echo: 2,
  echoTitre: 'Le Premier train',
  metier: 'Horticole',
  interets: ['Botanique', 'Marchés du dimanche', 'Conversations lentes'],
  cartes: [
    {
      monde: 'M1',
      titre: 'Le Réservoir',
      sousTitre: 'Ses émotions',
      resume: 'Aminata garde ses émotions pour elle, puis les confie à ceux qui prennent le temps.',
      phrases: ['Aminata garde ses émotions pour elle, puis les confie à ceux qui prennent le temps.'],
    },
    {
      monde: 'M4',
      titre: 'Le Premier train',
      sousTitre: 'Son rythme de vie',
      resume: 'Aminata aime les matinées calmes et les journées sans précipitation.',
      phrases: ['Aminata aime les matinées calmes et les journées sans précipitation.'],
    },
    {
      monde: 'M3',
      titre: 'Le Berceau qui attend',
      sousTitre: 'Sa vision de la famille',
      resume: 'Aminata rêve d\u2019une famille chaleureuse, construite sans se presser.',
      phrases: ['Aminata rêve d\u2019une famille chaleureuse, construite sans se presser.'],
    },
  ],
  cartesCachees: [{ monde: 'M2', titre: 'La vague d\u2019Aminata', sceau: 'Volant franchi' }],
  raison:
    'On vous montre ensemble parce que vos rythmes se rejoignent : les matinées calmes d\u2019un côté, les journées sans précipitation de l\u2019autre — la même respiration.',
  phrasePortrait: 'Aminata : la lenteur choisie, la tendresse posée.',
  likeRecu: true,
  raisonMatch:
    'Vous vous rejoignez sur le rythme : des jours qui ne se pressent pas. Vous différez sur la famille : elle la voit posée, toi vibrant — bon sujet de conversation.',
  phrasesMatch: [
    'Ton dimanche cadencé et ses marchés du dimanche pourraient se croiser.',
    'Vous prenez tous les deux le temps — commencez par le vôtre.',
    'Sa famille chaleureuse et ta vision se répondent : demandez-lui le réveil.',
  ],
};

const JOEL: ProfilDemo = {
  id: 'demo-joel',
  prenom: 'Joël',
  age: 33,
  ville: 'Douala',
  distanceKm: 9,
  intention: 'mariage',
  verifie: false,
  bio: null,
  photo: '/img/rencontres/p-joel.png',
  echo: 0,
  echoTitre: null,
  metier: 'Technicien réseau',
  interets: ['Foot du dimanche', 'Bricolage', 'Randonnée'],
  cartes: [
    {
      monde: 'M3',
      titre: 'Le Berceau qui attend',
      sousTitre: 'Sa vision de la famille',
      resume: 'Joël veut fonder une famille dans les prochaines années.',
      phrases: ['Joël veut fonder une famille dans les prochaines années.'],
    },
    {
      monde: 'M4',
      titre: 'Le Calépin et le flot',
      sousTitre: 'Son quotidien',
      resume: 'Joël planifie ses semaines mais laisse ses week-ends à l\u2019imprévu.',
      phrases: ['Joël planifie ses semaines mais laisse ses week-ends à l\u2019imprévu.'],
    },
    {
      monde: 'M1',
      titre: 'Le Réservoir',
      sousTitre: 'Ses émotions',
      resume: 'Joël dit les choses franchement, parfois trop vite.',
      phrases: ['Joël dit les choses franchement, parfois trop vite.'],
    },
  ],
  cartesCachees: [{ monde: 'M4', titre: 'La maison de Joël', sceau: 'Miroir franchi' }],
  raison:
    'On vous montre ensemble parce que vos horizons se répondent : une famille posée d\u2019un côté, un quotidien organisé de l\u2019autre — la même envie de construire.',
  phrasePortrait: 'Joël : franc dans les mots, posé dans les projets.',
  likeRecu: false,
  raisonMatch: null,
  phrasesMatch: [],
};

const SANDRINE: ProfilDemo = {
  id: 'demo-sandrine',
  prenom: 'Sandrine',
  age: 27,
  ville: 'Douala',
  distanceKm: 15,
  intention: 'rencontre',
  verifie: false,
  bio: null,
  photo: '/img/rencontres/p-sandrine.png',
  echo: 1,
  echoTitre: 'Le Calépin et le flot',
  metier: 'Commerçante',
  interets: ['Indépendance', 'Journées libres', 'Sorties entre amis'],
  cartes: [
    {
      monde: 'M4',
      titre: 'Le Premier train',
      sousTitre: 'Son rythme de vie',
      resume: 'Sandrine vit à son rythme, avec des horaires qui changent souvent.',
      phrases: ['Sandrine vit à son rythme, avec des horaires qui changent souvent.'],
    },
    {
      monde: 'M2',
      titre: 'La Vague qui frappe',
      sousTitre: 'L\u2019épreuve du temps',
      resume: 'Sandrine teste avant de s\u2019engager, puis s\u2019attache pour longtemps.',
      phrases: ['Sandrine teste avant de s\u2019engager, puis s\u2019attache pour longtemps.'],
    },
    {
      monde: 'M4',
      titre: 'Le Calépin et le flot',
      sousTitre: 'Son quotidien',
      resume: 'Sandrine tient à son indépendance et à ses journées libres.',
      phrases: ['Sandrine tient à son indépendance et à ses journées libres.'],
    },
  ],
  cartesCachees: [{ monde: 'M1', titre: 'Ce que Sandrine ne dit pas', sceau: 'Miroir franchi' }],
  raison:
    'On vous montre ensemble parce que vos libertés se respectent : des horaires qui bougent d\u2019un côté, des journées libres de l\u2019autre — le même air à prendre.',
  phrasePortrait: 'Sandrine : libre dans le rythme, loyale dans l\u2019attachement.',
  likeRecu: true,
  raisonMatch:
    'Vous vous rejoignez sur l\u2019indépendance : chacun garde son air. Vous différez sur le rythme : elle teste, tu avances — bon sujet de conversation.',
  phrasesMatch: [
    'Ses journées libres et tes semaines organisées peuvent se prêter le temps.',
    'Elle s\u2019attache pour longtemps — commencez par un premier pas simple.',
    'Vos deux manières de garder votre air sont la même carte : dites-le-lui.',
  ],
};

/** Les 4 profils de démonstration du prompt — JAMAIS servis en production
 *  (le composant filtre par environnement staging). */
export const PROFILS_DEMO: readonly ProfilDemo[] = [FLORENCE, AMINATA, JOEL, SANDRINE];

/** La ligne or « Avec elle / Avec lui » d'une carte (selon le prénom). */
export function ligneAvec(prenom: string, theme: string): string {
  return prenom === 'Joël' ? avecLui(theme) : (AVEC_ELLLE_LUI[theme] ?? `Avec ${prenom} : un premier pas simple.`);
}

/** Les questions suggérées d'une carte — pré-rédigées, jamais fabriquées. */
export function questionsDe(theme: string): Record<Intention, string[]> {
  const q = QUESTIONS_PAR_THEME[theme];
  if (q) return q;
  return {
    comprendre: ['Qu\u2019est-ce que cette carte change dans tes journées ?'],
    sourire: ['Tu as un exemple tout frais de cette carte ?'],
    avancer: ['On commence par ça — tu es d\u2019accord ?'],
  };
}

/** Les étiquettes des trois intentions (les chaînes FR servent de clés i18n). */
export const ETIQUETTES_INTENTION: Record<Intention, string> = {
  comprendre: 'Pour mieux comprendre',
  sourire: 'Pour faire sourire',
  avancer: 'Pour avancer ensemble',
};

/** Les réponses rapides du destinataire (accord correct selon le prénom). */
export function reponsesRapides(prenom: string): string[] {
  const elle = prenom !== 'Joël';
  return elle
    ? ['Pas encore prête à en parler', 'J\u2019en parlerai de vive voix']
    : ['Pas encore prêt à en parler', 'J\u2019en parlerai de vive voix'];
}

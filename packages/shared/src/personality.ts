/**
 * Archétypes de personnalité wairyu (Étape 4-bis — demande fondateur).
 *
 * Principe (aligné sur l'éthique spec §5) :
 *  - le type est DÉDUIT DES RÉPONSES réelles du questionnaire (règles simples,
 *    zéro IA, zéro pseudo-science type MBTI) — toujours explicable ;
 *  - il est TOUJOURS VALIDÉ PAR LA PERSONNE (« C'est moi ✓ ») avant d'être
 *    affiché comme acquis — sinon il reste « proposé » ;
 *  - modifiable à tout moment depuis le compte ;
 *  - l'affinité entre archétypes est une matrice explicite et bienveillante :
 *    forte / bonne / à découvrir — JAMAIS « incompatible ».
 */

import type { QAnswers, QItem } from './matching';

// ---------------------------------------------------------------------------
// Types & catalogue
// ---------------------------------------------------------------------------

export type ArchetypeId =
  | 'builder'
  | 'family_heart'
  | 'explorer'
  | 'romantic'
  | 'free_spirit'
  | 'pillar'
  | 'solar'
  | 'epicurean';

export const ARCHETYPE_IDS = [
  'builder',
  'family_heart',
  'explorer',
  'romantic',
  'free_spirit',
  'pillar',
  'solar',
  'epicurean',
] as const;

export interface Archetype {
  id: ArchetypeId;
  /** Nom affiché (inclusif, comme le reste de l'app). */
  name: string;
  /** Phrase courte sous le nom. */
  tagline: string;
  /** Description complète (carte profil). */
  description: string;
}

export const ARCHETYPES: Record<ArchetypeId, Archetype> = {
  builder: {
    id: 'builder',
    name: 'Bâtisseur·euse',
    tagline: 'Tu construis ta vie comme un projet : ambition, liberté, des racines solides.',
    description:
      'Tu as des plans et tu les mènes. Ta force : tenir le cap entre ambition et liberté, sans jamais rien lâcher de ce qui compte vraiment.',
  },
  family_heart: {
    id: 'family_heart',
    name: 'Cœur de Famille',
    tagline: 'Pour toi, la réussite, c\u2019est d\u2019abord les siens : un foyer plein de vie.',
    description:
      'La famille est ta boussole. Tu investis dans les liens qui durent, tu accueilles, tu prends soin — et tu cherches quelqu\u2019un qui partage cette chaleur.',
  },
  explorer: {
    id: 'explorer',
    name: 'Explorateur·rice',
    tagline: 'Le monde est ta maison : tu avances, tu découvres, tu vis dehors.',
    description:
      'La nouveauté te nourrit : des lieux, des cultures, des idées. Tu cherches quelqu\u2019un à qui raconter — et avec qui partir.',
  },
  romantic: {
    id: 'romantic',
    name: 'Romantique Sincère',
    tagline: 'Tu crois aux belles histoires : de la complicité, du vrai, du durable.',
    description:
      'Pour toi, l\u2019amour se soigne au quotidien : les attentions, les mots, la présence. Tu préfères une belle histoire construite à mille éclats.',
  },
  free_spirit: {
    id: 'free_spirit',
    name: 'Esprit Libre',
    tagline: 'Ta liberté n\u2019a pas de prix : tu aimes, tu vis, sans cadres rigides.',
    description:
      'Tu avances à ton rythme, au gré des envies. L\u2019idéal pour toi : quelqu\u2019un d\u2019autonome qui partage le chemin sans l\u2019enfermer dans un couloir.',
  },
  pillar: {
    id: 'pillar',
    name: 'Pilier',
    tagline: 'Foi, fidélité, engagement : tu bâtis sur du roc, pour toujours.',
    description:
      'Tu sais ce que tu crois et tu tiens tes promesses. Le cadre n\u2019est pas une contrainte : c\u2019est ta force et ta sérénité.',
  },
  solar: {
    id: 'solar',
    name: 'Solaire',
    tagline: 'Ta joie est contagieuse : tu rayonnes dans l\u2019ambiance et les liens qui comptent.',
    description:
      'Tu es l\u2019énergie du groupe : on te cherche pour la bonne humeur et les vraies conversations. En amour, tu offres du soleil — tu veux qu\u2019on t\u2019en rende.',
  },
  epicurean: {
    id: 'epicurean',
    name: 'Épicurien·ne',
    tagline: 'Savourer chaque instant : plaisirs simples, équilibre, beaux moments.',
    description:
      'Tu trouves le juste tempo : profiter aujourd\u2019hui sans rien sacrifier de demain. Tu cherches une complicité légère et gourmande, qui dure.',
  },
};

export const ARCHETYPE_LIST: Archetype[] = ARCHETYPE_IDS.map((id) => ARCHETYPES[id]);

// ---------------------------------------------------------------------------
// Affinité entre archétypes (matrice explicite, symétrique, bienveillante)
// ---------------------------------------------------------------------------

export type PersonalityAffinity = 'strong' | 'good' | 'discover';

export const AFFINITY_SCORE: Record<PersonalityAffinity, number> = {
  strong: 100,
  good: 70,
  discover: 40,
};

export const AFFINITY_LABELS: Record<PersonalityAffinity, string> = {
  strong: 'Affinité forte',
  good: 'Bonne affinité',
  discover: 'À découvrir',
};

/** Paires d'affinité FORTE (symétriques — ex. « l'ambition qui construit, la famille qui ancre »). */
const STRONG_PAIRS: readonly string[] = [
  'builder|builder', // deux ambitions qui se comprennent
  'builder|family_heart', // l'ambition qui construit, la famille qui ancre
  'builder|pillar', // projets + engagement : même roc
  'family_heart|family_heart',
  'family_heart|pillar', // foyer + cadre : la même sérénité
  'family_heart|romantic', // le foyer et la tendresse
  'explorer|explorer',
  'explorer|free_spirit', // mouvement + liberté : cap ensemble
  'explorer|epicurean', // découvertes + plaisirs : le monde à déguster
  'romantic|romantic',
  'romantic|pillar', // tendresse + engagement : la belle histoire solide
  'free_spirit|free_spirit',
  'pillar|pillar',
  'solar|solar',
  'solar|epicurean', // ambiance + savourer : la fête qui dure
  'epicurean|epicurean',
];

/** Paires « à découvrir » (différence stimulante — jamais un rejet). */
const DISCOVER_PAIRS: readonly string[] = [
  'builder|free_spirit', // construction vs liberté : à cadrer ensemble
  'family_heart|free_spirit', // racines vs vent : à apprivoiser
  'explorer|pillar', // mouvement vs ancrage : un pas chacun
  'romantic|free_spirit', // engagement doux vs autonomie : à négocier
  'pillar|epicurean', // cadre vs présent : l'équilibre s'apprend
];

const pairKey = (a: ArchetypeId, b: ArchetypeId): string => [a, b].sort().join('|');

/** Affinité entre deux archétypes — jamais « incompatible ». */
export function affinityBetween(a: ArchetypeId, b: ArchetypeId): PersonalityAffinity {
  const k = pairKey(a, b);
  if (STRONG_PAIRS.includes(k)) return 'strong';
  if (DISCOVER_PAIRS.includes(k)) return 'discover';
  return 'good';
}

// ---------------------------------------------------------------------------
// Dérivation par règles (chaque réponse alimente 0..n archétypes)
// ---------------------------------------------------------------------------

interface Rule {
  item: string;
  key: string;
  pts: Partial<Record<ArchetypeId, number>>;
  /** Signal court affiché dans « pourquoi ce type » (uniquement les pivots). */
  signal?: string;
}

const RULES: Rule[] = [
  // --- Niveau 1 : le moteur principal (demande fondateur : « selon le premier
  //     remplissage ») ---
  // n1_q01 — intention
  { item: 'n1_q01', key: 'serious', pts: { builder: 2, romantic: 2, family_heart: 1, pillar: 1 }, signal: 'une relation sérieuse' },
  { item: 'n1_q01', key: 'marriage', pts: { pillar: 3, family_heart: 2, builder: 1 }, signal: 'le mariage' },
  { item: 'n1_q01', key: 'couple_life', pts: { romantic: 4 }, signal: 'vivre une belle histoire de couple' },
  { item: 'n1_q01', key: 'open', pts: { free_spirit: 3 }, signal: 'découvrir sans cadres' },
  { item: 'n1_q01', key: 'friends_first', pts: { free_spirit: 2, solar: 2 }, signal: 'd\u2019abord des amis' },
  // n1_q03 — enfants
  { item: 'n1_q03', key: 'want', pts: { family_heart: 3 }, signal: 'des enfants' },
  { item: 'n1_q03', key: 'have_more', pts: { family_heart: 4, solar: 1 }, signal: 'une tribu qui s\u2019agrandit' },
  { item: 'n1_q03', key: 'have_done', pts: { family_heart: 3, solar: 1 }, signal: 'une tribu complète' },
  { item: 'n1_q03', key: 'later', pts: { explorer: 1, free_spirit: 1 } },
  { item: 'n1_q03', key: 'no', pts: { free_spirit: 2, explorer: 1, builder: 1 } },
  // n1_q08 — cap 5 ans
  { item: 'n1_q08', key: 'family', pts: { family_heart: 5 }, signal: 'installé·e en famille' },
  { item: 'n1_q08', key: 'career', pts: { builder: 4 }, signal: 'concentré·e sur ta carrière' },
  { item: 'n1_q08', key: 'travel', pts: { explorer: 5 }, signal: 'des voyages à travers le monde' },
  { item: 'n1_q08', key: 'business', pts: { builder: 5 }, signal: 'en train de bâtir ton projet' },
  { item: 'n1_q08', key: 'free', pts: { free_spirit: 4, explorer: 1 }, signal: 'là où la vie t\u2019emmène' },
  // n1_q12 — vivre ensemble
  { item: 'n1_q12', key: 'important', pts: { romantic: 3 }, signal: 'se connaître avant' },
  { item: 'n1_q12', key: 'no', pts: { pillar: 2, family_heart: 1 } },
  { item: 'n1_q12', key: 'depends', pts: { free_spirit: 1 } },
  // n1_q02 — valeurs (multi)
  { item: 'n1_q02', key: 'honesty', pts: { pillar: 1, romantic: 1 } },
  { item: 'n1_q02', key: 'respect', pts: { pillar: 1, family_heart: 1 } },
  { item: 'n1_q02', key: 'loyalty', pts: { pillar: 2, family_heart: 2, romantic: 1 } },
  { item: 'n1_q02', key: 'family', pts: { family_heart: 4 }, signal: 'la famille' },
  { item: 'n1_q02', key: 'ambition', pts: { builder: 4 }, signal: 'l\u2019ambition' },
  { item: 'n1_q02', key: 'kindness', pts: { romantic: 2, solar: 1 } },
  { item: 'n1_q02', key: 'freedom', pts: { free_spirit: 4, explorer: 2 }, signal: 'la liberté' },
  { item: 'n1_q02', key: 'faith', pts: { pillar: 4 }, signal: 'la foi' },
  // n1_q09 — religion
  { item: 'n1_q09', key: 'central', pts: { pillar: 5 }, signal: 'la foi au centre' },
  { item: 'n1_q09', key: 'important', pts: { pillar: 3 } },
  { item: 'n1_q09', key: 'private', pts: {} },
  { item: 'n1_q09', key: 'not', pts: { free_spirit: 1, explorer: 1 } },
  // n1_q11 — partenaire d'une autre religion
  { item: 'n1_q11', key: 'no_problem', pts: { explorer: 1, free_spirit: 1 } },
  { item: 'n1_q11', key: 'depends', pts: {} },
  { item: 'n1_q11', key: 'same_only', pts: { pillar: 2 } },
  // n1_q06 — journée idéale
  { item: 'n1_q06', key: 'outdoor', pts: { explorer: 4 }, signal: 'l\u2019aventure en plein air' },
  { item: 'n1_q06', key: 'culture', pts: { explorer: 2, epicurean: 2 }, signal: 'les découvertes culturelles' },
  { item: 'n1_q06', key: 'home', pts: { romantic: 2, family_heart: 1 } },
  { item: 'n1_q06', key: 'social', pts: { solar: 4, family_heart: 1 }, signal: 'les repas entre amis ou en famille' },
  { item: 'n1_q06', key: 'work', pts: { builder: 4, free_spirit: 1 }, signal: 'tes passions au travail' },
  // n1_q07 — recharge
  { item: 'n1_q07', key: 'alone', pts: { free_spirit: 2, builder: 1 }, signal: 'des moments seul·e' },
  { item: 'n1_q07', key: 'people', pts: { solar: 5 }, signal: 'l\u2019entourage et l\u2019ambiance' },
  { item: 'n1_q07', key: 'mix', pts: { epicurean: 2, solar: 1 } },
  // n1_q10 — argent
  { item: 'n1_q10', key: 'saver', pts: { builder: 2, pillar: 2 }, signal: 'la sécurité d\u2019abord' },
  { item: 'n1_q10', key: 'enjoy', pts: { epicurean: 4 }, signal: 'profiter du présent' },
  { item: 'n1_q10', key: 'balanced', pts: { epicurean: 2, builder: 1 } },
  // --- Niveau 2 : signaux PLUS FAIBLES (raffinement, jamais un renversement brutal) ---
  { item: 'n2_q01', key: 'talk', pts: { romantic: 1, solar: 1 } },
  { item: 'n2_q01', key: 'space', pts: { builder: 1 } },
  { item: 'n2_q01', key: 'avoid', pts: { free_spirit: 1 } },
  { item: 'n2_q01', key: 'compromise', pts: { family_heart: 1 } },
  { item: 'n2_q02', key: 'direct', pts: { builder: 2, solar: 1 } },
  { item: 'n2_q02', key: 'hints', pts: { romantic: 1 } },
  { item: 'n2_q02', key: 'writing', pts: { romantic: 1 } },
  { item: 'n2_q02', key: 'time', pts: { pillar: 1 } },
  { item: 'n2_q03', key: 'passionate', pts: { solar: 2, builder: 1 } },
  { item: 'n2_q03', key: 'calm', pts: { pillar: 1, family_heart: 1 } },
  { item: 'n2_q03', key: 'none', pts: { free_spirit: 1 } },
  { item: 'n2_q04', key: 'long', pts: { romantic: 1 } },
  { item: 'n2_q04', key: 'short', pts: { solar: 2 } },
  { item: 'n2_q04', key: 'voice', pts: { solar: 1 } },
  { item: 'n2_q04', key: 'depends', pts: { epicurean: 1 } },
  { item: 'n2_q05', key: 'say', pts: { solar: 1, builder: 1 } },
  { item: 'n2_q05', key: 'first_time', pts: { romantic: 1 } },
  { item: 'n2_q05', key: 'humour', pts: { solar: 2 } },
  { item: 'n2_q05', key: 'withdraw', pts: { free_spirit: 1 } },
  { item: 'n2_q06', key: 'comfortable', pts: { builder: 1, free_spirit: 1 } },
  { item: 'n2_q06', key: 'uncomfortable', pts: { solar: 2, romantic: 1 } },
  { item: 'n2_q06', key: 'depends', pts: { epicurean: 1 } },
  { item: 'n2_q07', key: 'center', pts: { solar: 4 }, signal: 'au centre de l\u2019attention' },
  { item: 'n2_q07', key: 'observer', pts: { free_spirit: 2, builder: 1 } },
  { item: 'n2_q07', key: 'organizer', pts: { builder: 3, family_heart: 1 }, signal: 'celui/celle qui organise' },
  { item: 'n2_q07', key: 'listener', pts: { family_heart: 2, romantic: 1 } },
  { item: 'n2_q08', key: 'logic', pts: { builder: 2 } },
  { item: 'n2_q08', key: 'intuition', pts: { explorer: 2, romantic: 1 } },
  { item: 'n2_q08', key: 'advice', pts: { family_heart: 2, pillar: 1 } },
  { item: 'n2_q09', key: 'love', pts: { explorer: 3, solar: 1 }, signal: 'les imprévus te ravissent' },
  { item: 'n2_q09', key: 'minor', pts: { epicurean: 1 } },
  { item: 'n2_q09', key: 'stress', pts: { pillar: 2, builder: 1 } },
  { item: 'n2_q10', key: 'plan', pts: { builder: 3 }, signal: 'des projets planifiés' },
  { item: 'n2_q10', key: 'improvise', pts: { explorer: 2, free_spirit: 2 }, signal: 'l\u2019improvisation au jour le jour' },
  { item: 'n2_q10', key: 'mix', pts: { epicurean: 1 } },
  { item: 'n2_q11', key: 'high', pts: { solar: 3, explorer: 1 } },
  { item: 'n2_q11', key: 'steady', pts: { pillar: 2, family_heart: 1 } },
  { item: 'n2_q11', key: 'waves', pts: { epicurean: 1, free_spirit: 1 } },
  { item: 'n2_q12', key: 'always', pts: { explorer: 3, epicurean: 1 }, signal: 'la nouveauté presque tout le temps' },
  { item: 'n2_q12', key: 'sometimes', pts: { epicurean: 1 } },
  { item: 'n2_q12', key: 'known', pts: { pillar: 2, family_heart: 1 } },
  { item: 'n2_q13', key: 'daily', pts: { romantic: 2, solar: 1 } },
  { item: 'n2_q13', key: 'few', pts: { free_spirit: 2, builder: 1 } },
  { item: 'n2_q13', key: 'quality', pts: { epicurean: 1 } },
  { item: 'n2_q14', key: 'easy', pts: { free_spirit: 3 } },
  { item: 'n2_q14', key: 'slight', pts: { family_heart: 1, epicurean: 1 } },
  { item: 'n2_q14', key: 'hard', pts: { pillar: 1, romantic: 1 } },
  { item: 'n2_q15', key: 'words', pts: { romantic: 2 } },
  { item: 'n2_q15', key: 'touch', pts: { solar: 1 } },
  { item: 'n2_q15', key: 'acts', pts: { family_heart: 2, builder: 1 } },
  { item: 'n2_q15', key: 'gifts', pts: { epicurean: 1 } },
  { item: 'n2_q15', key: 'time', pts: { family_heart: 1, romantic: 1 } },
  { item: 'n2_q16', key: 'now', pts: { solar: 2, romantic: 1 } },
  { item: 'n2_q16', key: 'cool', pts: { builder: 1, epicurean: 1 } },
  { item: 'n2_q16', key: 'space', pts: { free_spirit: 2 } },
  { item: 'n2_q17', key: 'love', pts: { solar: 3 } },
  { item: 'n2_q17', key: 'shy', pts: { romantic: 1 } },
  { item: 'n2_q17', key: 'private', pts: { pillar: 1, free_spirit: 1 } },
  { item: 'n2_q18', key: 'always', pts: { romantic: 2, explorer: 1 } },
  { item: 'n2_q18', key: 'needed', pts: { builder: 1, pillar: 1 } },
  { item: 'n2_q18', key: 'rarely', pts: { solar: 1, epicurean: 1 } },
];

/** Seuil de fiabilité : au moins 10 des 12 réponses N1. */
const N1_MIN_ANSWERS = 10;

export interface PersonalityScore {
  id: ArchetypeId;
  score: number;
  /** 2-3 courtes raisons tirées des réponses qui ont pesé le plus. */
  signals: string[];
}

export interface PersonalityDerivation {
  /** true = assez de réponses pour proposer un type fiable. */
  ready: boolean;
  /** 'n1' = dérivé du seul Niveau 1 ; 'n1+n2' = raffiné avec le Niveau 2. */
  derivedFrom: 'n1' | 'n1+n2';
  primary: PersonalityScore | null;
  /** 2 alternatives suivantes (pour « plutôt ça ? »). */
  alternatives: PersonalityScore[];
}

/**
 * Dérivation pure des archétypes à partir des réponses.
 * Déterministe : mêmes réponses → même classement (aucun aléa).
 */
export function derivePersonality(answers: QAnswers, items: QItem[]): PersonalityDerivation {
  const n1Items = items.filter((i) => i.level === 1);
  const n1Done = n1Items.filter((i) => answers[i.id] !== undefined).length;
  const n2Done = items.filter((i) => i.level === 2 && answers[i.id] !== undefined).length;
  const derivedFrom: 'n1' | 'n1+n2' = n2Done >= 10 ? 'n1+n2' : 'n1';

  if (n1Done < N1_MIN_ANSWERS) {
    return { ready: false, derivedFrom, primary: null, alternatives: [] };
  }

  const totals = new Map<ArchetypeId, [score: number, hits: number]>(
    ARCHETYPE_IDS.map((id) => [id, [0, 0]] as [ArchetypeId, [number, number]]),
  );
  const signalsByType = new Map<ArchetypeId, { label: string; pts: number }[]>();

  for (const rule of RULES) {
    const v = answers[rule.item];
    if (v === undefined) continue;
    const chosen = Array.isArray(v) ? v : [v];
    if (!chosen.includes(rule.key)) continue;
    for (const [id, pts] of Object.entries(rule.pts) as [ArchetypeId, number][]) {
      const cur = totals.get(id)!;
      cur[0] += pts;
      cur[1] += 1;
      if (rule.signal) {
        const list = signalsByType.get(id) ?? [];
        list.push({ label: rule.signal, pts });
        signalsByType.set(id, list);
      }
    }
  }

  const ranked = [...ARCHETYPE_IDS]
    .map((id) => ({ id, score: totals.get(id)![0], hits: totals.get(id)![1] }))
    .sort((x, y) => y.score - x.score || y.hits - x.hits || x.id.localeCompare(y.id));

  const mkSignals = (id: ArchetypeId): string[] =>
    (signalsByType.get(id) ?? [])
      .sort((x, y) => y.pts - x.pts)
      .map((s) => s.label)
      .filter((l, i, arr) => arr.indexOf(l) === i)
      .slice(0, 3);

  // La banque compte toujours ≥ 3 archétypes (8 en semés) → index sûrs.
  const first = ranked[0]!;
  const second = ranked[1]!;
  const third = ranked[2]!;
  const primary: PersonalityScore = { id: first.id, score: first.score, signals: mkSignals(first.id) };
  const alternatives: PersonalityScore[] = [
    { id: second.id, score: second.score, signals: mkSignals(second.id) },
    { id: third.id, score: third.score, signals: mkSignals(third.id) },
  ];

  return { ready: true, derivedFrom, primary, alternatives };
}

// ---------------------------------------------------------------------------
// Types d'API (partagés Worker ↔ front)
// ---------------------------------------------------------------------------

export interface PersonalityCurrent {
  type: ArchetypeId;
  validated: boolean;
  derivedFrom: 'n1' | 'n1+n2';
  /** Classement dérivé au moment de la dernière proposition. */
  suggestions: ArchetypeId[];
}

export interface PersonalitySuggestionView extends PersonalityScore {
  name: string;
  tagline: string;
  description: string;
}

export interface PersonalityState {
  ready: boolean;
  current: PersonalityCurrent | null;
  /** [primaire, alternative 1, alternative 2] — vide si !ready. */
  suggestions: PersonalitySuggestionView[];
  disclaimer: string;
}

export interface PersonalityUpdateResponse {
  saved: true;
  current: PersonalityCurrent;
}

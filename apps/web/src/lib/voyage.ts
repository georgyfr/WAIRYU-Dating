/**
 * Le VOYAGE Wairyu — données de présentation (demande fondateur : l'accueil
 * doit être le voyage, pas Découvrir). Source : doctrine du dépôt d'origine
 * (Constitution v2.1 + Livrable des mondes, branche archive/v1-2026-10-05 —
 * l'équivalent du GitBook) : 11 MONDES · 50 QUÊTES · étages de restitution
 * (Carte → Miroir → Portrait de Monde → Portraits de Domaine → Portrait
 * Intégral) · 6 mondes gratuits / 5 premium · M11 « Le Voyage à Deux »
 * toujours gratuit, débloqué au premier match — LA RENCONTRE N'EST JAMAIS
 * PAYANTE.
 *
 * Présentation visuelle : maquette validée par le fondateur (2026-10-07) —
 * héro « Ton voyage commence ici », 4 objectifs, récolte en cours (anneau),
 * 6 étapes jalons, thèmes en pastilles, bannière « Premier arrêt ».
 *
 * Tone (Constitution [3]) : tutoiement, 2ᵉ personne, présent, phrases
 * courtes, pas de promesse émotionnelle, pas de superlatif sans preuve,
 * aucune métadonnée visible (score/sigle), zéro teaser premium — les mondes
 * 💎 sont marqués mais JAMAIS vendus ici (l'écran de conversion est unique :
 * fin de M5).
 *
 * Le fondateur développe les mondes un à un : cette page évolue monde par
 * monde — chaque monde porte `status: 'soon' | 'open'` (open = quêtes
 * jouables, plus tard).
 */

export interface VoyageWorld {
  /** Numéro d'ordre du monde (1-11). */
  num: number;
  /** Code interne (M1…M11) — usage interne, jamais affiché. */
  code: string;
  name: string;
  /** Nom court pour les pastilles thèmes. */
  shortName: string;
  emoji: string;
  /** Icône SVG dédiée (redesign 2026-10-08 : plus mémorable qu'un emoji,
   *  rendu identique sur tous les appareils). */
  icon: string;
  /** Une phrase d'accroche (≤ 22 mots, tutoiement, présent). */
  tagline: string;
  /** Nombre de quêtes du monde (descriptif, sans jargon de score). */
  quests: number;
  free: boolean;
  /** Note particulière (M11 : débloqué au premier match). */
  note?: string;
  /** Couleurs de la pastille (fond tendre + icône saturée). */
  tile: { bg: string; fg: string };
  status: 'soon' | 'open';
}

export const WORLDS: VoyageWorld[] = [
  {
    num: 1,
    code: 'M1',
    name: 'Le Miroir',
    shortName: 'Le Miroir',
    emoji: '🪞',
    icon: 'mirror',
    tile: { bg: '#fde9e6', fg: '#f56b53' },
    tagline: 'Tu regardes qui tu es : personnalité, attachement, émotions. Pas de bonne réponse — seulement ta réponse.',
    quests: 3,
    free: true,
    status: 'soon',
  },
  {
    num: 2,
    code: 'M2',
    name: 'Le Volant',
    shortName: 'Le Volant',
    emoji: '🛞',
    icon: 'wheel',
    tile: { bg: '#fff3d6', fg: '#e8a312' },
    tagline: 'Tu reprends la main : ton contrôle, ta façon de penser, ce que tu apportes, ton élan du moment.',
    quests: 7,
    free: true,
    status: 'soon',
  },
  {
    num: 3,
    code: 'M3',
    name: 'La Boussole',
    shortName: 'La Boussole',
    emoji: '🧭',
    icon: 'compass',
    tile: { bg: '#dff3f4', fg: '#2a9aa0' },
    tagline: 'Tes valeurs, tes non-négociables, ta vision de la famille : le cap qui oriente tes rencontres.',
    quests: 8,
    free: true,
    status: 'soon',
  },
  {
    num: 4,
    code: 'M4',
    name: 'Ton terrain',
    shortName: 'Le Terrain',
    emoji: '🏕️',
    icon: 'tent',
    tile: { bg: '#e4f4e4', fg: '#3e9d5b' },
    tagline: 'Ton quotidien réel : rythme de vie, temps libre, rapport à l\u2019argent, entourage, attirances.',
    quests: 7,
    free: true,
    status: 'soon',
  },
  {
    num: 5,
    code: 'M5',
    name: 'Ton Héritage',
    shortName: 'Ton Héritage',
    emoji: '🌳',
    icon: 'tree',
    tile: { bg: '#e7f0e2', fg: '#4c8c4a' },
    tagline: 'Ton histoire relationnelle : ton arbre, où tu en es aujourd\u2019hui, ce que tes relations t\u2019ont appris.',
    quests: 4,
    free: true,
    status: 'soon',
  },
  {
    num: 6,
    code: 'M6',
    name: 'Mon Cœur',
    shortName: 'Mon Cœur',
    emoji: '💗',
    icon: 'heart',
    tile: { bg: '#f3e8f8', fg: '#9c4dd3' },
    tagline: 'Ton style amoureux, ta vision de l\u2019amour, ton expression de l\u2019affection, ton humour.',
    quests: 4,
    free: false,
    status: 'soon',
  },
  {
    num: 7,
    code: 'M7',
    name: 'Face aux Tempêtes',
    shortName: 'Face aux Tempêtes',
    emoji: '🌊',
    icon: 'umbrella',
    tile: { bg: '#e1f0f5', fg: '#33809e' },
    tagline: 'Les désaccords font partie du voyage : comment tu traverses les tensions et répare après.',
    quests: 3,
    free: false,
    status: 'soon',
  },
  {
    num: 8,
    code: 'M8',
    name: 'L\u2019Intime — L\u2019Essentiel',
    shortName: 'L\u2019Intime',
    emoji: '🌙',
    icon: 'moon',
    tile: { bg: '#ffebcf', fg: '#d9932b' },
    tagline: 'Ta vie intime, à ton rythme : rien n\u2019est jamais imposé, tout se révèle par étages.',
    quests: 2,
    free: false,
    note: 'Sur ta décision seulement (opt-in)',
    status: 'soon',
  },
  {
    num: 9,
    code: 'M9',
    name: 'L\u2019Intime — Les Profondeurs',
    shortName: 'Les Profondeurs',
    emoji: '🌑',
    icon: 'lock',
    tile: { bg: '#e8eaed', fg: '#5c6670' },
    tagline: 'Tes préférences et tes frontières, chiffrées renforcé, jamais visibles des autres.',
    quests: 3,
    free: false,
    note: 'Sur ta décision seulement (opt-in)',
    status: 'soon',
  },
  {
    num: 10,
    code: 'M10',
    name: 'Mon Monde',
    shortName: 'Mon Monde',
    emoji: '🌍',
    icon: 'globe',
    tile: { bg: '#dff3e8', fg: '#2f9d6b' },
    tagline: 'Tes racines, ton ouverture au monde, la mixité : un module traité avec la dignité qu\u2019il exige.',
    quests: 3,
    free: false,
    status: 'soon',
  },
  {
    num: 11,
    code: 'M11',
    name: 'Le Voyage à Deux',
    shortName: 'Le Voyage à Deux',
    emoji: '💞',
    icon: 'rings',
    tile: { bg: '#fde4ec', fg: '#e2557b' },
    tagline: 'Les quêtes se vivent à deux : questions croisées, réponses partagées, rendez-vous préparé.',
    quests: 6,
    free: true,
    note: 'Se débloque à ton premier match — la rencontre n\u2019est jamais payante',
    status: 'soon',
  },
];

/** Les 6 étapes jalons du voyage — l'échelle de restitution (Constitution [7]).
 * Chaque jalon EST un gain : ce que le voyageur récolte en avançant. */
export interface VoyageMilestone {
  num: number;
  name: string;
  emoji: string;
  /** Icône SVG dédiée (redesign 2026-10-08). */
  icon: string;
  /** Ce que cette étape apporte (le gain, en une phrase). */
  desc: string;
  tile: { bg: string; fg: string };
  status: 'now' | 'soon';
}

export const MILESTONES: VoyageMilestone[] = [
  {
    num: 1,
    name: 'La Carte',
    emoji: '\ud83d\uddfa\ufe0f',
    icon: 'map',
    desc: 'Découvre qui tu es et ce que tu veux vraiment — un portrait vivant après chaque étape.',
    tile: { bg: '#dff3f4', fg: '#2a9aa0' },
    status: 'now',
  },
  {
    num: 2,
    name: 'Le Miroir',
    emoji: '\ud83e\ude9e',
    icon: 'mirror',
    desc: 'Explore tes émotions, tes forces et tes fragilités — lumière et ombre, sans note ni jugement.',
    tile: { bg: '#f0e4fa', fg: '#8b4dd3' },
    status: 'soon',
  },
  {
    num: 3,
    name: 'Le Portrait du Monde',
    emoji: '\u26f0\ufe0f',
    icon: 'mountain',
    desc: 'À chaque monde terminé, une synthèse de plusieurs pages sur ce territoire de toi.',
    tile: { bg: '#e4f4e4', fg: '#3e9d5b' },
    status: 'soon',
  },
  {
    num: 4,
    name: 'Les Portraits de Domaine',
    emoji: '\ud83c\udd10',
    icon: 'layers',
    desc: 'Le Soi, le Cœur, l\u2019Intime : les croisements entre tes mondes liés — tes vraies signatures.',
    tile: { bg: '#fff3d6', fg: '#e8a312' },
    status: 'soon',
  },
  {
    num: 5,
    name: 'Le Portrait Intégral',
    emoji: '\ud83d\udcdc',
    icon: 'scroll',
    desc: 'Ta synthèse complète : personnalité, valeurs, style de vie. 12 à 18 pages, téléchargeables.',
    tile: { bg: '#fde9e6', fg: '#f56b53' },
    status: 'soon',
  },
  {
    num: 6,
    name: 'La Rencontre',
    emoji: '\ud83d\udc9e',
    icon: 'rings',
    desc: 'Ton moment : faire le premier pas vers la bonne personne — puis le Voyage à Deux.',
    tile: { bg: '#fde4ec', fg: '#e2557b' },
    status: 'soon',
  },
];

/** Les objectifs du voyage (maquette fondateur : 4 cartes « 5 min »).
 * Redesign 2026-10-08 : chaque carte porte un VRAI bouton (fini la flèche
 * décorative) qui conduit à la section concernée. */
export interface VoyageObjective {
  icon: 'compass' | 'heart' | 'target' | 'star';
  title: string;
  text: string;
  time: string;
  tile: { bg: string; fg: string };
  /** Le bouton explicite de la carte. */
  action: { label: string; target: 'etapes' | 'themes' | 'recolte' | 'discover' };
}

export const OBJECTIVES: VoyageObjective[] = [
  {
    icon: 'compass',
    title: 'Te connaître vraiment',
    text: 'Comprends tes valeurs, ton style, tes envies\u2026',
    time: '5 min',
    tile: { bg: '#e4f4e4', fg: '#2f8a4c' },
    action: { label: 'Voir les \u00e9tapes', target: 'etapes' },
  },
  {
    icon: 'heart',
    title: 'Te montrer vrai',
    text: 'Ton profil se construit en marchant, selon tes réponses.',
    time: '5 min',
    tile: { bg: '#fde9e6', fg: '#e04a30' },
    action: { label: 'Voir les th\u00e8mes', target: 'themes' },
  },
  {
    icon: 'target',
    title: 'Rencontrer juste',
    text: 'Des profils compatibles avec tes valeurs, ton rythme, tes objectifs.',
    time: '5 min',
    tile: { bg: '#f0e4fa', fg: '#7d3cc2' },
    action: { label: 'Voir ta r\u00e9colte', target: 'recolte' },
  },
  {
    icon: 'star',
    title: 'Des matchs qui ont du sens',
    text: 'Moins de superficialité, plus de vraies connexions.',
    time: '5 min',
    tile: { bg: '#fff3d6', fg: '#d68f06' },
    action: { label: 'Explorer les profils', target: 'discover' },
  },
];

/** Totaux dérivés — affichés dans le héro et la récolte. */
export const TOTAL_QUESTS = WORLDS.reduce((sum, w) => sum + w.quests, 0);
export const FREE_WORLDS = WORLDS.filter((w) => w.free).length;

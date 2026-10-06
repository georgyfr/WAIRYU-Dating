/**
 * Le VOYAGE Wairyu — données de présentation (demande fondateur : l'accueil
 * doit être le voyage, pas Découvrir). Source : doctrine du dépôt d'origine
 * (Constitution v2.1 + Livrable des mondes, branche archive/v1-2026-10-05 —
 * l'équivalent du GitBook) : 11 MONDES · 51 QUÊTES · étages de restitution
 * (Carte → Miroir → Portrait de Monde → Portraits de Domaine → Portrait
 * Intégral) · 6 mondes gratuits / 5 premium · M11 « Le Voyage à Deux »
 * toujours gratuit, débloqué au premier match — LA RENCONTRE N'EST JAMAIS
 * PAYANTE.
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
  emoji: string;
  /** Une phrase d'accroche (≤ 22 mots, tutoiement, présent). */
  tagline: string;
  /** Nombre de quêtes du monde (descriptif, sans jargon de score). */
  quests: number;
  free: boolean;
  /** Note particulière (M11 : débloqué au premier match). */
  note?: string;
  status: 'soon' | 'open';
}

export const WORLDS: VoyageWorld[] = [
  {
    num: 1,
    code: 'M1',
    name: 'Le Miroir',
    emoji: '🪞',
    tagline: 'Tu regardes qui tu es : personnalité, attachement, émotions. Pas de bonne réponse — seulement ta réponse.',
    quests: 3,
    free: true,
    status: 'soon',
  },
  {
    num: 2,
    code: 'M2',
    name: 'Le Volant',
    emoji: '🛞',
    tagline: 'Tu reprends la main : ton contrôle, ta façon de penser, ce que tu apportes, ton élan du moment.',
    quests: 7,
    free: true,
    status: 'soon',
  },
  {
    num: 3,
    code: 'M3',
    name: 'La Boussole',
    emoji: '🧭',
    tagline: 'Tes valeurs, tes non-négociables, ta vision de la famille : le cap qui oriente tes rencontres.',
    quests: 8,
    free: true,
    status: 'soon',
  },
  {
    num: 4,
    code: 'M4',
    name: 'Ton terrain',
    emoji: '🏕️',
    tagline: 'Ton quotidien réel : rythme de vie, temps libre, rapport à l\u2019argent, entourage, attirances.',
    quests: 7,
    free: true,
    status: 'soon',
  },
  {
    num: 5,
    code: 'M5',
    name: 'Ton Héritage',
    emoji: '🌳',
    tagline: 'Ton histoire relationnelle : ton arbre, où tu en es aujourd\u2019hui, ce que tes relations t\u2019ont appris.',
    quests: 4,
    free: true,
    status: 'soon',
  },
  {
    num: 6,
    code: 'M6',
    name: 'Mon Cœur',
    emoji: '💗',
    tagline: 'Ton style amoureux, ta vision de l\u2019amour, ton expression de l\u2019affection, ton humour.',
    quests: 4,
    free: false,
    status: 'soon',
  },
  {
    num: 7,
    code: 'M7',
    name: 'Face aux Tempêtes',
    emoji: '🌊',
    tagline: 'Les désaccords font partie du voyage : comment tu traverses les tensions et répare après.',
    quests: 3,
    free: false,
    status: 'soon',
  },
  {
    num: 8,
    code: 'M8',
    name: 'L\u2019Intime — L\u2019Essentiel',
    emoji: '🌙',
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
    emoji: '🌑',
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
    emoji: '🌍',
    tagline: 'Tes racines, ton ouverture au monde, la mixité : un module traité avec la dignité qu\u2019il exige.',
    quests: 3,
    free: false,
    status: 'soon',
  },
  {
    num: 11,
    code: 'M11',
    name: 'Le Voyage à Deux',
    emoji: '💞',
    tagline: 'Les quêtes se vivent à deux : questions croisées, réponses partagées, rendez-vous préparé.',
    quests: 6,
    free: true,
    note: 'Se débloque à ton premier match — la rencontre n\u2019est jamais payante',
    status: 'soon',
  },
];

/** Les gains du voyage — l'échelle de restitution (Constitution [7]). */
export interface VoyageGain {
  emoji: string;
  title: string;
  when: string;
  text: string;
}

export const GAINS: VoyageGain[] = [
  {
    emoji: '🃏',
    title: 'La Carte',
    when: 'Après chaque quête',
    text: 'Un portrait vivant de 30 à 60 mots — ta lumière et ton ombre en une phrase. Partageable si tu le veux.',
  },
  {
    emoji: '🪞',
    title: 'Le Miroir',
    when: 'En progressant',
    text: 'Une analyse fine de tes réponses, rédigée pour toi — jamais un score, jamais une étiquette.',
  },
  {
    emoji: '🖼️',
    title: 'Le Portrait du Monde',
    when: 'Quand un monde est terminé',
    text: 'Une synthèse de plusieurs pages sur ce territoire de toi : ce qui te dessine, façons de penser comme façons d\u2019aimer.',
  },
  {
    emoji: '🔗',
    title: 'Les Portraits de Domaine',
    when: 'Quand deux mondes jumeaux sont terminés',
    text: 'Le Soi, Le Cœur, L\u2019Intime : les croisements entre mondes liés — là où les vraies signatures apparaissent.',
  },
  {
    emoji: '📜',
    title: 'Le Portrait Intégral',
    when: 'Au bout du voyage',
    text: '12 à 18 pages, téléchargeables : la synthèse complète de ton voyage de connaissance.',
  },
  {
    emoji: '💞',
    title: 'La Rencontre',
    when: 'La destination',
    text: 'Un match qui repose sur le réel — puis le Voyage à Deux : questions croisées et rendez-vous préparés ensemble.',
  },
];

/** Les objectifs du voyage. */
export interface VoyageObjective {
  emoji: string;
  title: string;
  text: string;
}

export const OBJECTIVES: VoyageObjective[] = [
  {
    emoji: '🔍',
    title: 'Te connaître vraiment',
    text: 'Lumière et ombre, sans note et sans jugement. Le voyage regarde les deux — c\u2019est ce qui le rend utile.',
  },
  {
    emoji: '🪪',
    title: 'Te montrer vrai',
    text: 'Ton profil se construit en marchant. Des réponses qui te ressemblent, pas des cases à cocher.',
  },
  {
    emoji: '🎯',
    title: 'Rencontrer juste',
    text: 'La compatibilité se calcule sur le réel — ce que tu vis, ce que tu cherches, ce que tu apportes.',
  },
];

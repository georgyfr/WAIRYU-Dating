/**
 * Le VOYAGE Wairyu — données de présentation et de progression.
 *
 * Source : doctrine du dépôt d'origine (Constitution v2.1 + Livrable des mondes,
 * branche archive/v1-2026-10-05) : 11 MONDES · 50 QUÊTES · étages de restitution
 * (Carte → Miroir → Portrait de Monde → Portraits de Domaine → Portrait Intégral)
 * · 6 mondes gratuits / 5 premium · M11 « Le Voyage à Deux » toujours gratuit,
 * débloqué au premier match — LA RENCONTRE N'EST JAMAIS PAYANTE.
 *
 * TOTAL_STEPS = 51 (consigne fondateur, répétée deux fois) : la somme réelle des
 * quêtes livrées est 50 — le 51ᵉ pas est la Rencontre. TOTAL_QUESTS est conservé
 * pour la transparence ; à réconcilier sur décision fondateur.
 *
 * PROGRESS — supprimé : la progression RÉELLE (mondes franchis, étapes,
 * récolte) est CALCULÉE depuis l'état des quêtes par lib/progression.ts
 * (useProgression) — posée par les actions de l'utilisateur, jamais inventée.
 *
 * WORLD_DETAILS = la fiche réelle des 11 mondes (présentation, objectif, récolte
 * attendue, format des évaluations, quêtes aux noms verbatim du Livrable).
 * Exceptions honnêtes : M9 zéro miroir par design ; M11 miroir exempté (la
 * récompense, c'est la réponse de l'autre) ; M6 carte humour partageable ;
 * M7 → Portrait de domaine du Cœur ; M10 traité avec dignité, zéro filtre ;
 * quête 4.4 « Blessures et aisance » INVISIBLE (tissée chez 4.1/4.2, aucun
 * écran pour elle, par respect).
 *
 * Tone (Constitution [3]) : tutoiement, 2ᵉ personne, présent, phrases courtes,
 * pas de promesse émotionnelle, pas de superlatif sans preuve, aucune
 * métadonnée visible (score/sigle), zéro teaser premium.
 *
 * Le fondateur développe les mondes un à un : chaque monde porte
 * `status: 'soon' | 'open'` (open = quêtes jouables). Aujourd'hui : M1 ouvert.
 *
 * RECONSTITUTION (5ᵉ reset sandbox) : données extraites programmatiquement du
 * bundle staging index-BvGGhSXl.js (Task 27), apostrophes U+0027 (audit Task 25).
 *
 * i18n : les textes AFFICHABLES passent par le miroir EN
 * (i18n/content/en/voyage.ts — fusion avecEN au chargement, repli FR).
 */

import { avecEN } from '../i18n/apply';
import { VOYAGE_EN } from '../i18n/content/en/voyage';

export interface VoyageWorld {
  /** Numéro d'ordre du monde (1-11). */
  num: number;
  /** Code interne (M1…M11) — usage interne, jamais affiché. */
  code: string;
  name: string;
  /** Nom court pour les pastilles thèmes. */
  shortName: string;
  emoji: string;
  /** Icône SVG dédiée (rendu identique sur tous les appareils). */
  icon: string;
  /** Une phrase d'accroche (≤ 22 mots, tutoiement, présent). */
  tagline: string;
  /** Nombre de quêtes du monde (descriptif, sans jargon de score). */
  quests: number;
  free: boolean;
  /** Note particulière (M8/M9 : opt-in ; M11 : débloqué au premier match). */
  note?: string;
  /** Couleurs de la pastille (fond tendre + icône saturée). */
  tile: { bg: string; fg: string };
  status: 'soon' | 'open';
}

export const WORLDS: VoyageWorld[] = avecEN([
  {
    num: 1,
    code: "M1",
    name: "Le Miroir",
    shortName: "Le Miroir",
    emoji: "🪞",
    icon: "mirror",
    tile: {
      bg: "#fde9e6",
      fg: "#f56b53",
    },
    tagline: "Tu regardes qui tu es : personnalité, attachement, émotions. Pas de bonne réponse — seulement ta réponse.",
    quests: 3,
    free: true,
    status: "open",
  },
  {
    num: 2,
    code: "M2",
    name: "Le Volant",
    shortName: "Le Volant",
    emoji: "🛞",
    icon: "wheel",
    tile: {
      bg: "#fff3d6",
      fg: "#e8a312",
    },
    tagline: "Tu reprends la main : ton contrôle, ta façon de penser, ce que tu apportes, ton élan du moment.",
    quests: 7,
    free: true,
    // Monde 2 OUVERT (quêtes 1.4 → 1.11 livrées) — l'accès reste séquentiel :
    // l'écran Mondes ne le déverrouille qu'une fois le Monde 1 terminé.
    status: "open",
  },
  {
    num: 3,
    code: "M3",
    name: "La Boussole",
    shortName: "La Boussole",
    emoji: "🧭",
    icon: "compass",
    tile: {
      bg: "#dff3f4",
      fg: "#2a9aa0",
    },
    tagline: "Tes valeurs, tes non-négociables, ta vision de la famille : le cap qui oriente tes rencontres.",
    quests: 8,
    free: true,
    // Monde 3 OUVERT (quêtes 2.1 → 2.8 livrées) — l'accès reste séquentiel :
    // l'écran Mondes ne le déverrouille qu'une fois le Monde 2 terminé.
    status: "open",
  },
  {
    num: 4,
    code: "M4",
    name: "Ton terrain",
    shortName: "Le Terrain",
    emoji: "🏕️",
    icon: "tent",
    tile: {
      bg: "#e4f4e4",
      fg: "#3e9d5b",
    },
    tagline: "Ton quotidien réel : rythme de vie, temps libre, rapport à l'argent, entourage, attirances.",
    quests: 7,
    free: true,
    status: "soon",
  },
  {
    num: 5,
    code: "M5",
    name: "Ton Héritage",
    shortName: "Ton Héritage",
    emoji: "🌳",
    icon: "tree",
    tile: {
      bg: "#e7f0e2",
      fg: "#4c8c4a",
    },
    tagline: "Ton histoire relationnelle : ton arbre, où tu en es aujourd'hui, ce que tes relations t'ont appris.",
    quests: 4,
    free: true,
    status: "soon",
  },
  {
    num: 6,
    code: "M6",
    name: "Mon Cœur",
    shortName: "Mon Cœur",
    emoji: "💗",
    icon: "heart",
    tile: {
      bg: "#f3e8f8",
      fg: "#9c4dd3",
    },
    tagline: "Ton style amoureux, ta vision de l'amour, ton expression de l'affection, ton humour.",
    quests: 4,
    free: false,
    status: "soon",
  },
  {
    num: 7,
    code: "M7",
    name: "Face aux Tempêtes",
    shortName: "Face aux Tempêtes",
    emoji: "🌊",
    icon: "umbrella",
    tile: {
      bg: "#e1f0f5",
      fg: "#33809e",
    },
    tagline: "Les désaccords font partie du voyage : comment tu traverses les tensions et répare après.",
    quests: 3,
    free: false,
    status: "soon",
  },
  {
    num: 8,
    code: "M8",
    name: "L'Intime — L'Essentiel",
    shortName: "L'Intime",
    emoji: "🌙",
    icon: "moon",
    tile: {
      bg: "#ffebcf",
      fg: "#d9932b",
    },
    tagline: "Ta vie intime, à ton rythme : rien n'est jamais imposé, tout se révèle par étages.",
    quests: 2,
    free: false,
    note: "Sur ta décision seulement (opt-in)",
    status: "soon",
  },
  {
    num: 9,
    code: "M9",
    name: "L'Intime — Les Profondeurs",
    shortName: "Les Profondeurs",
    emoji: "🌑",
    icon: "lock",
    tile: {
      bg: "#e8eaed",
      fg: "#5c6670",
    },
    tagline: "Tes préférences et tes frontières, chiffrées renforcé, jamais visibles des autres.",
    quests: 3,
    free: false,
    note: "Sur ta décision seulement (opt-in)",
    status: "soon",
  },
  {
    num: 10,
    code: "M10",
    name: "Mon Monde",
    shortName: "Mon Monde",
    emoji: "🌍",
    icon: "globe",
    tile: {
      bg: "#dff3e8",
      fg: "#2f9d6b",
    },
    tagline: "Tes racines, ton ouverture au monde, la mixité : un module traité avec la dignité qu'il exige.",
    quests: 3,
    free: false,
    status: "soon",
  },
  {
    num: 11,
    code: "M11",
    name: "Le Voyage à Deux",
    shortName: "Le Voyage à Deux",
    emoji: "💞",
    icon: "rings",
    tile: {
      bg: "#fde4ec",
      fg: "#e2557b",
    },
    tagline: "Les quêtes se vivent à deux : questions croisées, réponses partagées, rendez-vous préparé.",
    quests: 6,
    free: true,
    note: "Se débloque à ton premier match — la rencontre n'est jamais payante",
    status: "soon",
  },
], VOYAGE_EN.WORLDS);

/** Les 6 étapes jalons du voyage — l'échelle de restitution (Constitution [7]).
 * Chaque jalon EST un gain : ce que le voyageur récolte en avançant. */
export interface VoyageMilestone {
  num: number;
  name: string;
  emoji: string;
  /** Icône SVG dédiée. */
  icon: string;
  /** Ce que cette étape apporte (le gain, en une phrase). */
  desc: string;
  tile: { bg: string; fg: string };
  status: 'now' | 'soon';
}

export const MILESTONES: VoyageMilestone[] = avecEN([
  {
    num: 1,
    name: "La Carte",
    emoji: "🗺️",
    icon: "map",
    desc: "Découvre qui tu es et ce que tu veux vraiment — un portrait vivant après chaque étape.",
    tile: {
      bg: "#dff3f4",
      fg: "#2a9aa0",
    },
    status: "now",
  },
  {
    num: 2,
    name: "Le Miroir",
    emoji: "🪞",
    icon: "mirror",
    desc: "Explore tes émotions, tes forces et tes fragilités — lumière et ombre, sans note ni jugement.",
    tile: {
      bg: "#f0e4fa",
      fg: "#8b4dd3",
    },
    status: "soon",
  },
  {
    num: 3,
    name: "Le Portrait du Monde",
    emoji: "⛰️",
    icon: "mountain",
    desc: "À chaque monde terminé, une synthèse de plusieurs pages sur ce territoire de toi.",
    tile: {
      bg: "#e4f4e4",
      fg: "#3e9d5b",
    },
    status: "soon",
  },
  {
    num: 4,
    name: "Les Portraits de Domaine",
    emoji: "🄐",
    icon: "layers",
    desc: "Le Soi, le Cœur, l'Intime : les croisements entre tes mondes liés — tes vraies signatures.",
    tile: {
      bg: "#fff3d6",
      fg: "#e8a312",
    },
    status: "soon",
  },
  {
    num: 5,
    name: "Le Portrait Intégral",
    emoji: "📜",
    icon: "scroll",
    desc: "Ta synthèse complète : personnalité, valeurs, style de vie. 12 à 18 pages, téléchargeables.",
    tile: {
      bg: "#fde9e6",
      fg: "#f56b53",
    },
    status: "soon",
  },
  {
    num: 6,
    name: "La Rencontre",
    emoji: "💞",
    icon: "rings",
    desc: "Ton moment : faire le premier pas vers la bonne personne — puis le Voyage à Deux.",
    tile: {
      bg: "#fde4ec",
      fg: "#e2557b",
    },
    status: "soon",
  },
], VOYAGE_EN.MILESTONES);

/** Ce que ton voyage construit — les 4 portes vers les vraies destinations
 * (URLs fondateur exactes, états RÉELS, vocabulaire Voyage → Portrait →
 * Affinités → Rencontre). */
export interface VoyageBuild {
  num: string;
  icon: string;
  title: string;
  /** Le mantra à la première personne (demande fondateur). */
  mantra: string;
  text: string;
  href: string;
  cta: string;
  /** Couleurs de la pastille icône. */
  tile: { bg: string; fg: string };
}

export const BUILDS: VoyageBuild[] = avecEN([
  {
    num: "01",
    icon: "mirror",
    title: "Ton Portrait",
    mantra: "Je découvre qui je suis",
    text: "Ce que tes réponses révèlent progressivement de ta personnalité, de tes émotions, de tes besoins et de ta façon de fonctionner.",
    href: "#/portrait",
    cta: "Voir mon portrait",
    tile: {
      bg: "#fde9e6",
      fg: "#f56b53",
    },
  },
  {
    num: "02",
    icon: "globe",
    title: "Les Mondes",
    mantra: "Je découvre les territoires de moi",
    text: "11 mondes jalonnent ton chemin : personnalité, valeurs, quotidien, cœur, histoire. Découvre ce que chacun révèle.",
    href: "#/mondes",
    cta: "Découvrir les Mondes",
    tile: {
      bg: "#dff3f4",
      fg: "#2a9aa0",
    },
  },
  {
    num: "03",
    icon: "signpost",
    title: "Mondes parcourus",
    mantra: "J'avance à mon rythme",
    text: "Retrouve les mondes que tu as traversés et ce qu'ils t'ont révélé. Chaque monde franchi éclaire le suivant.",
    href: "#/parcourus",
    cta: "Ouvrir mon journal",
    tile: {
      bg: "#e4f4e4",
      fg: "#3e9d5b",
    },
  },
  {
    num: "04",
    icon: "heart",
    title: "Tes rencontres",
    mantra: "Je me rapproche des bonnes personnes",
    text: "Retrouve les personnes avec lesquelles quelque chose commence à se construire.",
    href: "#/matchs",
    cta: "Voir",
    tile: {
      bg: "#fde4ec",
      fg: "#e2557b",
    },
  },
], VOYAGE_EN.BUILDS);

/** La progression RÉELLE du voyageur — CALCULÉE depuis l'état des quêtes par
 *  lib/progression.ts (useProgression) : les compteurs figés à zéro de
 *  l'ancien constant PROGRESS laissaient le journal de bord (#/parcourus)
 *  immuable malgré les quêtes terminées. */
export interface Progression {
  /** Les mondes FRANCHIS (toutes les quêtes livrées du monde terminées). */
  worldsDone: number;
  /** Les quêtes TERMINÉES parmi les quêtes ouvertes (QUETE_IDS). */
  stepsDone: number;
  /** Les cartes OBTENUES (les écrans sans carte ne produisent pas de carte). */
  recolte: number;
}

/** Une quête telle qu'affichée dans la fiche d'un monde. */
export interface WorldQuest {
  title: string;
  /** Le descriptif court (verbatim Livrable) — ou la note honnête d'invisibilité. */
  hint?: string;
}

/** La fiche réelle d'un monde (popup « Découvrir un monde »). */
export interface WorldDetail {
  presentation: string;
  objectif: string;
  /** Ce que tu récoltes à la fin du monde. */
  resultats: readonly string[];
  /** Comment se passe l'évaluation. */
  comment: readonly string[];
  quetes: readonly WorldQuest[];
  /** Note d'exception honnête (M9, M11…). */
  note?: string;
}

export const WORLD_DETAILS: Record<string, WorldDetail> = avecEN(
  {
  M1: {
    presentation: "Le premier monde du voyage. Tu regardes qui tu es : ta personnalité, ta façon d'aimer et d'être proche, tes émotions. Pas de bonne réponse — seulement ta réponse.",
    objectif: "Dessiner la première image de toi : comment tu fonctionnes, comment tu t'attaches, comment tu vis tes émotions. Tout le voyage s'appuie sur cette base.",
    resultats: [
      "Ta carte — après chaque quête, une synthèse courte : ta lumière et ton ombre.",
      "Ton miroir — ton fonctionnement renvoyé en toutes lettres : ta lumière, ton ombre, tes tensions.",
      "Les premières pierres de ton portrait — ce que tu découvres ici alimente toute la suite du voyage.",
    ],
    comment: [
      "Des affirmations s'affichent une à une. Tu réponds sur 5 niveaux, de « Pas du tout moi » à « Tout à fait moi ».",
      "Pas de bonne réponse, pas de note, pas de chronomètre — tu avances à ton rythme.",
      "Celle que tu crois être celle qu'on attend, c'est rarement la tienne.",
    ],
    quetes: [
      {
        title: "Ta personnalité",
        hint: "58 affirmations — ouverture, organisation, énergie sociale, bienveillance, stabilité émotionnelle",
      },
      {
        title: "Ta façon de t'attacher",
        hint: "ton besoin de réassurance, ton besoin d'espace",
      },
      {
        title: "Tes émotions",
        hint: "ce que tu ressens, ce que tu en fais, ce qui se voit de toi",
      },
    ],
  },
  M2: {
    presentation: "Le deuxième monde regarde ce que tu fais de ce que tu es : ta maîtrise, ta tête, ton élan du moment. Tu reprends la main.",
    objectif: "Voir comment tu tiens le volant : ce que tu contrôles, comment tu penses, ce que tu apportes à une relation — et si tu es prêt·e à rencontrer.",
    resultats: [
      "Ta carte après chaque quête — ta lumière et ton ombre en une phrase.",
      "Ton miroir — ton fonctionnement renvoyé en toutes lettres.",
      "À la fin du monde : ton Portrait de ce monde, la synthèse de ce territoire de toi.",
    ],
    comment: [
      "Chaque quête a son format : affirmations, choix, quelques énigmes, une petite tâche du quotidien.",
      "Pas de bonne réponse, pas de note — tu réponds selon ce qui est vrai pour toi.",
    ],
    quetes: [
      {
        title: "Ton contrôle sur toi-même",
      },
      {
        title: "L'épreuve du temps",
      },
      {
        title: "Ta façon de penser",
      },
      {
        title: "Ton fonctionnement",
      },
      {
        title: "Ton élan du moment",
      },
      {
        title: "Ce que tu apportes",
      },
      {
        title: "Es-tu prêt·e à rencontrer ?",
      },
    ],
  },
  M3: {
    presentation: "Le troisième monde pose ton cap — le cap qui oriente toutes tes rencontres.",
    objectif: "Poser ton cap : ce qui compte pour toi, ce qui ne se négocie pas, ce que tu cherches — et où tu veux aller dans les cinq prochaines années.",
    resultats: [
      "Ta carte après chaque quête — ta lumière et ton ombre en une phrase.",
      "Ton miroir — ton fonctionnement renvoyé en toutes lettres.",
      "À la fin du monde : ton Portrait de ce monde, la synthèse de ce territoire de toi.",
    ],
    comment: [
      "Des choix francs : des cases à cocher, des clics, des binaires, un jeu de 100 points à répartir.",
      "Ton signe, c'est juste pour le jeu — il ne compte pas dans ton voyage.",
    ],
    quetes: [
      {
        title: "Tes valeurs",
      },
      {
        title: "Ta place pour la spiritualité",
      },
      {
        title: "Tes non-négociables",
      },
      {
        title: "Tes réalités",
      },
      {
        title: "Ce que tu cherches",
      },
      {
        title: "Tes priorités pour les 5 prochaines années",
      },
      {
        title: "Ta vision de la famille",
      },
      {
        title: "Ton signe (juste pour le jeu)",
      },
    ],
  },
  M4: {
    presentation: "Le quatrième monde descend sur ton terrain réel — là où une vie à deux se vit vraiment.",
    objectif: "Montrer ton quotidien tel qu'il est : ton rythme de vie, ton temps libre, ton rapport à l'argent, ton entourage, tes attirances.",
    resultats: [
      "Ta carte après chaque quête — ta lumière et ton ombre en une phrase.",
      "Ton miroir — ton fonctionnement renvoyé en toutes lettres.",
      "À la fin du monde : ton Portrait de ce monde, la synthèse de ce territoire de toi.",
    ],
    comment: [
      "Des questions concrètes sur ta vraie vie, des paires d'images à choisir, un badge aurore ou hibou.",
      "Tes attirances restent privés — ils ne se voient jamais.",
    ],
    quetes: [
      {
        title: "Ton rythme de vie",
      },
      {
        title: "Ton quotidien",
      },
      {
        title: "Ton temps libre",
      },
      {
        title: "Ton rapport à l'argent",
      },
      {
        title: "Ton entourage",
      },
      {
        title: "Le choix visuel",
      },
      {
        title: "Tes attirances",
      },
    ],
  },
  M5: {
    presentation: "Le cinquième monde regarde ton histoire — d'où tu pars, pour t'aider à choisir où tu vas.",
    objectif: "Regarder ton histoire relationnelle : ton arbre, où tu en es aujourd'hui, ce que tes relations t'ont appris.",
    resultats: [
      "Ta carte après chaque quête — ta lumière et ton ombre en une phrase.",
      "Ton miroir — ton fonctionnement renvoyé en toutes lettres.",
      "À la fin du monde : ton Portrait de ce monde, la synthèse de ce territoire de toi.",
    ],
    comment: [
      "Tu dessines ton arbre relationnel, tu réponds à des questions sur ton présent, une question ouverte pour ce que ça t'a appris.",
      "Une partie du monde se tisse discrètement, sans te poser de questions.",
    ],
    quetes: [
      {
        title: "Ton arbre relationnel",
      },
      {
        title: "Où tu en es aujourd'hui",
      },
      {
        title: "Ce que tes relations t'ont appris",
      },
      {
        title: "Blessures et aisance",
        hint: "tissée discrètement dans tes deux premières quêtes — aucun écran pour elle, par respect",
      },
    ],
  },
  M6: {
    presentation: "Le sixième monde donne un langage à ton cœur — ce que tu aimes et comment tu le montres.",
    objectif: "Mettre des mots sur ton cœur : ton style amoureux, ta vision de l'amour, comment tu exprimes ton affection — et ton humour.",
    resultats: [
      "Ta carte après chaque quête — ta lumière et ton ombre en une phrase.",
      "Ton miroir — ton fonctionnement renvoyé en toutes lettres.",
      "Une carte de ton humour, faite pour être partagée.",
      "À la fin du monde : ton Portrait de ce monde.",
    ],
    comment: [
      "Des affirmations sur ta façon d'aimer et de le montrer — réponds avec ton cœur, pas avec le dictionnaire.",
      "Pas de bonne réponse, pas de note.",
    ],
    quetes: [
      {
        title: "Ton style amoureux",
      },
      {
        title: "Ta vision de l'amour",
      },
      {
        title: "Comment tu exprimes ton affection",
      },
      {
        title: "Ton humour",
      },
    ],
  },
  M7: {
    presentation: "Le septième monde regarde les jours de vent : les désaccords font partie du voyage.",
    objectif: "Comprendre comment tu traverses les tensions : face aux désaccords, quand la tension monte, et comment tu répares après.",
    resultats: [
      "Ta carte après chaque quête — ta lumière et ton ombre en une phrase.",
      "Ton miroir — ton fonctionnement renvoyé en toutes lettres.",
      "Ce monde et Mon Cœur se rejoignent dans un Portrait de domaine : le Cœur.",
    ],
    comment: [
      "Des situations vraies de désaccord — tu réponds selon ce que tu fais, pas selon ce qu'il faudrait dire.",
      "Rien n'est jugé ici : chaque tempête a sa façon d'être traversée.",
    ],
    quetes: [
      {
        title: "Face aux désaccords",
      },
      {
        title: "Quand la tension monte",
      },
      {
        title: "Après un désaccord",
      },
    ],
  },
  M8: {
    presentation: "Le huitième monde ouvre le domaine de l'intime — sur ta décision seulement.",
    objectif: "Parler de ta vie intime et de ta relation au désir, à ton rythme : rien n'est jamais imposé, tout se révèle par étages.",
    resultats: [
      "Une synthèse discrète à chaque étage franchi — seulement si tu as choisi d'y entrer.",
      "Ce que tu récoltes ici reste chiffré et privé pour toujours.",
    ],
    comment: [
      "Le monde commence par ta décision : tu choisis d'y entrer, étage par étage.",
      "Le consentement est au centre — chaque étage se franchit seulement si tu le veux.",
    ],
    quetes: [
      {
        title: "Ta vie intime — l'essentiel",
      },
      {
        title: "Ta relation au désir",
      },
    ],
  },
  M9: {
    presentation: "Le neuvième monde descend aux profondeurs de l'intime — chiffré renforcé, jamais visible des autres.",
    objectif: "Dessiner tes préférences et tes frontières : ta carte intime, tes limites, ton désir à ta définition.",
    resultats: [
      "Ta carte des préférences — privée pour toujours, chiffrée renforcé.",
      "Certaines divergences de frontières se signalent aux deux personnes, sans jamais révéler qui a répondu quoi.",
    ],
    comment: [
      "Tu choisis d'y entrer — et certaines quêtes ne produisent volontairement aucun miroir, par respect.",
      "Tes réponses sont chiffrées renforcé : elles ne sortent jamais de ton coffre.",
    ],
    quetes: [
      {
        title: "Ta carte des préférences",
      },
      {
        title: "Tes frontières modernes",
      },
      {
        title: "Ton désir, ta définition",
      },
    ],
  },
  M10: {
    presentation: "Le dixième monde parle de tes racines et de ton ouverture — traité avec la dignité qu'il exige.",
    objectif: "Dire d'où tu viens et comment tu ouvres au monde : tes racines, ta façon d'accueillir les autres, la mixité dans ta vie.",
    resultats: [
      "Ta carte après chaque quête — ta lumière et ton ombre en une phrase.",
      "Un miroir qui décrit ton ancrage — un rythme, jamais un verdict.",
      "À la fin du monde : ton Portrait de ce monde.",
    ],
    comment: [
      "Tu t'identifies librement — ton vécu n'est jamais supposé.",
      "Zéro filtre par origine : ici, ce sont des traits, jamais des étiquettes.",
    ],
    quetes: [
      {
        title: "Tes racines",
      },
      {
        title: "Ton ouverture au monde",
      },
      {
        title: "La mixité et toi",
      },
    ],
  },
  M11: {
    presentation: "La destination : le monde qui se vit à deux, après la rencontre.",
    objectif: "Faire se croiser deux voyages : questions croisées, réponses partagées, rendez-vous préparé — une rencontre qui commence bien.",
    resultats: [
      "La récompense, c'est la réponse de l'autre.",
      "Des cartes de dialogue, un rendez-vous préparé, un check-in sécurité gratuit et permanent.",
    ],
    comment: [
      "Tu réponds, l'autre répond — certaines réponses se partagent, d'autres restent entre toi et ton voyage.",
      "La voix passe avant le visage : texte, puis voix, puis photo — toujours avec le consentement des deux.",
    ],
    quetes: [
      {
        title: "Les questions qui rapprochent",
      },
      {
        title: "Et toi, tu ferais quoi ?",
      },
      {
        title: "Le refus",
      },
      {
        title: "Le bonus",
      },
      {
        title: "Vibe Check / Voice Check",
      },
      {
        title: "Les services du rendez-vous",
      },
    ],
  },
},
VOYAGE_EN.WORLD_DETAILS);

/** Totaux dérivés — affichés dans le héro et la récolte. */
export const TOTAL_QUESTS = WORLDS.reduce((sum, w) => sum + w.quests, 0);
/** Consigne fondateur : 51 étapes (la somme réelle des quêtes = 50 ;
 * le 51ᵉ pas = la Rencontre — documenté en tête de fichier). */
export const TOTAL_STEPS = 51;
export const FREE_WORLDS = WORLDS.filter((w) => w.free).length;

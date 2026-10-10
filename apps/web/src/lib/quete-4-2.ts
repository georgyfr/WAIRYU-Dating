/**
 * Quête 4.2 « Où tu en es aujourd'hui » — Monde 5 « Ton Héritage ».
 *
 * Contenu FIDÈLE au Livrable M5-4.2-Ou-Tu-En-Es-Aujourdhui (branche
 * archive/v1) :
 *  - ITEMS : les 18 items Likert (verbatim 01-tableau-des-items, ordre du
 *    tableau) — 3 familles (intégration 5 · état 5 · réassurance RSQ 8),
 *    8 paires R6 complètes + 2 pivots (05 · 10) ;
 *  - PASSATION : l'ordre de passation GELÉ (mélange RÉEL graine 242427,
 *    outil dédié melange-heritage.py v3, 5 passes identiques — c4 STRICT
 *    PASS 0 déficit, run max 2) ; les 8 trames ▲ hébergées du bloc invisible
 *    4.4 (Q4.4-T15→T18 FIS · T19→T22 méfiance-intimité, positions 3 · 6 · 9 ·
 *    12 · 15 · 18 · 22 · 26) sont des codes SANS formulation au dépôt
 *    (règle 11-b : contenu hors dépôt, document trames — le deck les saute,
 *    aucune formulation n'apparaît jamais à l'écran, elles n'entrent dans
 *    AUCUN score) ;
 *  - LA QUESTION OUVERTE (Q4.2-19) : hors mélange — un écran d'écoute
 *    PROPRE, après la passation mixée. Facultative (« Je préfère ne pas
 *    dire » — saut sans pénalité, précédent 2.8). INTERDITS ABSOLUS
 *    (interdits V10) : la réponse n'est JAMAIS rendue — aucun extrait, aucune
 *    citation, aucun rappel, aucune carte, jamais au match, jamais au
 *    premium. Elle reste sur l'appareil (textes — même traitement que la
 *    ligne libre 2.3) ; l'analyse est côté moteur (P2), hors de toute
 *    interface ;
 *  - CARTES : les 3 variantes verbatim (cartes.yaml, charte C1-C11) ;
 *  - choisirVariante : la sélection VERBATIM (DISP = (INT_D + (1 − ETAT_D)) /
 *    2 → apaisé ≥ 0.60 · en travail ≤ 0.40 · en chemin entre les deux —
 *    partition exclusive + exhaustive, C6 ; départage au bord : la bande
 *    INT_D décide). Bornes 0.60/0.40 provisoires concepteur (re-signature
 *    professionnelle avant bêta) — jamais rendues.
 *
 * NEUTRALITÉ DES ÉTATS (doctrine capitale du Livrable) : apaisé, en chemin,
 * en travail — trois météos, JAMAIS des stades d'une guérison (interdit
 * V10) : personne n'est « en retard », l'état qui travaille n'est pas un
 * échec. Zéro reproche sur le rythme de chacun·e.
 *
 * Moteur (côté score, jamais rendu) : INT_D, ETAT_D, RSQ_D (moyennes des
 * familles, I recodés 6 − r, normalisées 0-1) + DISP. RB1 (gatekeeping
 * rebound, SIG-4.2-02) et le pacing RSQ (SIG-4.2-03) restent moteur SEUL —
 * jamais un verdict de guérison ; les variables FIS/MEFI des trames
 * hébergées alimentent les matrices du bloc 4.4 côté moteur — jamais au
 * rendu, jamais au match, jamais au premium (et, le dépôt ne portant AUCUNE
 * formulation, jamais calculées non plus dans cette app).
 *
 * Typo : apostrophe ASCII uniquement, guillemets français. Règles : aucun
 * code, score, sigle ou seuil ne franchit le rendu ; phrases ≤ 22 mots.
 */

import { avecEN } from '../i18n/apply';
import * as EN_Q42 from '../i18n/content/en/quete-4-2';

export interface QueteItem42 {
  code: string;
  text: string;
  /** 'D' = directe, 'I' = inversée (recodée 6 − r). */
  orient: 'D' | 'I';
  /** La famille verbatim du tableau 01 — intégration (5) · état (5) ·
   *  réassurance (8). */
  dim: 'intégration' | 'état' | 'réassurance';
}

/** L'objet de passation affiché — code + énoncé (l'orientation reste côté moteur). */
export interface ItemsQuete42 {
  code: string;
  text: string;
}

/** Code de la question ouverte (hors mélange — écran d'écoute propre). */
export const OUVERTE_CODE = 'Q4.2-19';

/** Les 18 items — verbatim (01-tableau-des-items, ordre du tableau). */
const ITEMS_FR: readonly QueteItem42[] = [
  {
    code: "Q4.2-01",
    text: "Mes chapitres passés me servent, ils ne me pèsent plus.",
    orient: "D",
    dim: "intégration",
  },
  {
    code: "Q4.2-02",
    text: "Ce que je vis ressemble encore à la vie d'avant.",
    orient: "I",
    dim: "intégration",
  },
  {
    code: "Q4.2-03",
    text: "Je sais ce que ces histoires m'ont appris.",
    orient: "D",
    dim: "intégration",
  },
  {
    code: "Q4.2-04",
    text: "Je tourne les mêmes pages sans savoir pourquoi.",
    orient: "I",
    dim: "intégration",
  },
  {
    code: "Q4.2-05",
    text: "Le calme est revenu, il reste.",
    orient: "D",
    dim: "intégration",
  },
  {
    code: "Q4.2-06",
    text: "Son prénom réveille encore quelque chose de vif.",
    orient: "D",
    dim: "état",
  },
  {
    code: "Q4.2-07",
    text: "Cette histoire est rangée, je n'y touche presque plus.",
    orient: "I",
    dim: "état",
  },
  {
    code: "Q4.2-08",
    text: "Je compare encore les nouvelles rencontres à mon ancienne histoire.",
    orient: "D",
    dim: "état",
  },
  {
    code: "Q4.2-09",
    text: "Je regarde les gens nouveaux pour ce qu'ils sont.",
    orient: "I",
    dim: "état",
  },
  {
    code: "Q4.2-10",
    text: "Le passé reste où il est, la plupart du temps.",
    orient: "I",
    dim: "état",
  },
  {
    code: "Q4.2-11",
    text: "J'ai besoin d'entendre souvent que c'est solide.",
    orient: "D",
    dim: "réassurance",
  },
  {
    code: "Q4.2-12",
    text: "Une parole claire me porte longtemps.",
    orient: "I",
    dim: "réassurance",
  },
  {
    code: "Q4.2-13",
    text: "Je rejoue les conversations pour vérifier que je n'ai rien loupé.",
    orient: "D",
    dim: "réassurance",
  },
  {
    code: "Q4.2-14",
    text: "Une fois la discussion faite, elle est faite.",
    orient: "I",
    dim: "réassurance",
  },
  {
    code: "Q4.2-15",
    text: "Le silence de l'autre m'écrit des scénarios inquiets.",
    orient: "D",
    dim: "réassurance",
  },
  {
    code: "Q4.2-16",
    text: "Un silence n'est pas un signe, c'est un silence.",
    orient: "I",
    dim: "réassurance",
  },
  {
    code: "Q4.2-17",
    text: "Je demande des confirmations, même quand ça va.",
    orient: "D",
    dim: "réassurance",
  },
  {
    code: "Q4.2-18",
    text: "Je fais confiance à ce qui est construit, sans répétition.",
    orient: "I",
    dim: "réassurance",
  },
];
export const ITEMS = avecEN(ITEMS_FR, EN_Q42.ITEMS);

/** Ordre de passation GELÉ — mélange RÉEL graine 242427 (02-plan-de-melange ;
 *  le 1ᵉʳ item vu est Q4.2-17, le dernier Q4.4-T22 — JAMAIS l'ordre des codes).
 *  Les 8 trames hébergées du bloc 4.4 occupent les positions 3 · 6 · 9 · 12 ·
 *  15 · 18 · 22 · 26 — ancrées par construction (c3). AUCUNE formulation au
 *  dépôt (règle 11-b) : le deck les saute, elles n'entrent dans AUCUN score.
 *  La question ouverte Q4.2-19 vit HORS mélange (écran d'écoute propre). */
export const PASSATION: readonly string[] = [
  "Q4.2-17",
  "Q4.2-04",
  "Q4.4-T15",
  "Q4.2-11",
  "Q4.2-07",
  "Q4.4-T16",
  "Q4.2-16",
  "Q4.2-05",
  "Q4.4-T17",
  "Q4.2-18",
  "Q4.2-03",
  "Q4.4-T18",
  "Q4.2-10",
  "Q4.2-15",
  "Q4.4-T19",
  "Q4.2-09",
  "Q4.2-13",
  "Q4.4-T20",
  "Q4.2-02",
  "Q4.2-06",
  "Q4.2-14",
  "Q4.4-T21",
  "Q4.2-01",
  "Q4.2-12",
  "Q4.2-08",
  "Q4.4-T22",
];

const PAR_CODE = new Map(ITEMS.map((i) => [i.code, i]));

/** Le deck réel : les 18 items dans l'ordre gelé — les trames hébergées
 *  (Q4.4-T15→T22, sans formulation au dépôt) sautent sans jamais s'afficher. */
export function deckQuete(): ItemsQuete42[] {
  return PASSATION.flatMap((c) => {
    const it = PAR_CODE.get(c);
    return it ? [{ code: it.code, text: it.text }] : [];
  });
}

/** Likert 1-5 → 0-1 (inversées recodées 6 − r — Arbitrage 1). */
function contribution(reponse: number, orient: 'D' | 'I'): number {
  return ((orient === 'D' ? reponse : 6 - reponse) - 1) / 4;
}

export interface Score42 {
  /** Ce que les chapitres passés te servent — moyenne des 5 items
   *  (INT_D côté moteur), normalisée 0-1. */
  intégration: number;
  /** La place que l'histoire occupe — moyenne des 5 items (ETAT_D côté
   *  moteur), normalisée 0-1 (haut = place occupée). */
  état: number;
  /** Le besoin de clarté — moyenne des 8 items RSQ (RSQ_D côté moteur),
   *  normalisée 0-1. */
  réassurance: number;
  /** DISP = (INT_D + (1 − ETAT_D)) / 2 — la lecture de disponibilité qui
   *  choisit la variante (moteur : jamais rendue comme une note). */
  disponibilité: number;
  /** Signature d'index (contrat du registre : Record<string, number>) —
   *  aucun score supplémentaire n'y entre (la ouverte et les trames jamais). */
  [dim: string]: number;
}

/** Scorer du Livrable : trois scores de famille (moyennes des contributions
 *  recodées) + DISP. La question ouverte (Q4.2-19) et les trames hébergées
 *  (Q4.4-T15→T22) n'y entrent JAMAIS. */
export function scorer(reponses: Record<string, number>): Score42 {
  const parFamille = new Map<string, { total: number; n: number }>();
  for (const code of PASSATION) {
    const it = PAR_CODE.get(code);
    const r = it ? reponses[it.code] : undefined;
    if (it && typeof r === 'number' && r >= 1 && r <= 5) {
      const c = contribution(r, it.orient);
      const bloc = parFamille.get(it.dim) ?? { total: 0, n: 0 };
      bloc.total += c;
      bloc.n += 1;
      parFamille.set(it.dim, bloc);
    }
  }
  const famille = (dim: string): number => {
    const bloc = parFamille.get(dim);
    return bloc && bloc.n > 0 ? bloc.total / bloc.n : 0;
  };
  const intégration = famille('intégration');
  const état = famille('état');
  return {
    intégration,
    état,
    réassurance: famille('réassurance'),
    disponibilité: (intégration + (1 - état)) / 2,
  };
}

/** Les 3 variantes — ids VERBATIM (cartes.yaml). */
export type VarianteId42 =
  | 'CARTE-4.2-CHAPITRE-REFERME'
  | 'CARTE-4.2-PAGE-QUI-TOURNE'
  | 'CARTE-4.2-MAISON-EN-TRAVAUX';

/**
 * Sélecteur VERBATIM (cartes.yaml — partition exclusive + exhaustive de
 * [0,1] sur DISP, C6) : apaisé ≥ 0.60 · en travail ≤ 0.40 · en chemin entre
 * les deux. Bornes 0.60/0.40 provisoires concepteur (re-signature avant
 * bêta) : métadonnées moteur, jamais affichées. RB1, RSQ-pacing, la ouverte
 * Q4.2-19 et les variables FIS/MEFI ne participent JAMAIS à la sélection.
 */
export function choisirVariante(score: Score42): VarianteId42 {
  const d = typeof score.disponibilité === 'number' ? score.disponibilité : 0;
  return d >= 0.6 ? 'CARTE-4.2-CHAPITRE-REFERME' : d <= 0.4 ? 'CARTE-4.2-MAISON-EN-TRAVAUX' : 'CARTE-4.2-PAGE-QUI-TOURNE';
}

export interface Carte {
  id: VarianteId42;
  nom: string;
  lumiere: string;
  ombre: string;
  tension: string;
}

/** Les 3 variantes de carte — verbatim (cartes.yaml, ordre du YAML :
 *  portrait → lumiere, tension_interieure → tension). NEUTRALITÉ DES ÉTATS :
 *  trois météos égales — aucune option dressée en idéal (C4), aucun verdict
 *  de guérison. */
export const CARTES: Record<VarianteId42, Carte> = {
  "CARTE-4.2-CHAPITRE-REFERME": {
    id: "CARTE-4.2-CHAPITRE-REFERME",
    nom: "Le·La Chapitre refermé",
    lumiere:
      "Tes chapitres passés te servent — ils ne te pèsent plus. Tu sais ce qu'ils t'ont appris, le calme que tu as ramené reste, et les gens nouveaux tu les regardes pour ce qu'ils sont. Une place calme, et elle s'entend.",
    ombre:
      "Le rangement d'avant n'est pas celui de l'autre : une sérénité posée peut se lire comme une distance — la braise de l'autre ne connaît pas ton tempo.",
    tension: "raconter comment tu as rangé — l'autre y trouvera son propre tempo.",
  },
  "CARTE-4.2-PAGE-QUI-TOURNE": {
    id: "CARTE-4.2-PAGE-QUI-TOURNE",
    nom: "Le·La Page qui tourne",
    lumiere:
      "Des cartons sont faits, d'autres attendent : tu es entre deux météos, et c'est honnête. Des pages tournent, d'autres se relisent — et une parole claire te porte longtemps. Cet entre-deux se vit à ton rythme.",
    ombre:
      "Les jours de bascule existent : tout va, puis un détail rallume la braise. Le partenaire ne sait pas d'avance lequel des deux est là.",
    tension: "dire à l'autre ce qui rallume — la météo y gagne un bulletin.",
  },
  "CARTE-4.2-MAISON-EN-TRAVAUX": {
    id: "CARTE-4.2-MAISON-EN-TRAVAUX",
    nom: "Le·La Maison en travaux",
    lumiere:
      "Ton histoire occupe encore de la place — le passé remonte, la comparaison travaille. Ce n'est pas une faille : c'est une maison en travaux, à ton rythme. Ton besoin de confirmations dit une chose simple : la clarté t'aide à tenir.",
    ombre:
      "Un silence s'écrit en scénario inquiet, une question tombe sur un chantier. La preuve répétée n'apaise pas — elle use les deux.",
    tension: "nommer une peur précise à l'autre — la clarté commence par elle.",
  },
};

/** Textes du briefing — annonce VERBATIM (05-ecran-d-intro, 2 phrases), puces
 *  en couche app (ton Task 35, météo — pas verdict). */
export const BRIEFING = {
  annonce:
    "Après les ruptures, chacun a sa météo — la tienne se décrit, elle ne se note pas. Ici, tu regardes où tu en es, sans stade et sans chronomètre.",
  aQuoiCaSert: [
    "C'est la quête du présent : ce que tes chapitres passés te servent, et la place qu'ils occupent encore.",
    "Dix-huit affirmations, trois lectures : l'intégration, l'état qui travaille, le besoin de clarté.",
    "Apaisé, en chemin, en travail : trois météos — personne n'est en retard, aucune n'est une note.",
    "À la fin, une carte — et une page d'écoute, si tu veux : elle reste chez toi.",
  ],
  resultats: [
    "Ta carte — ta lumière, ta zone d'ombre et ta tension du moment, en quelques mots.",
    "Trois barres — ce que le passé te sert, la place qu'il occupe, ton besoin de clarté.",
    "Une page d'écoute, si tu l'écris : jamais citée, jamais montrée.",
    "Une pierre de plus dans ton portrait — la suite du voyage s'en nourrit.",
  ],
};

/** L'écran d'écoute (Q4.2-19 — hors mélange, propre) : énoncé VERBATIM,
 *  retrait VERBATIM, note de protection en couche app. La réponse n'est
 *  JAMAIS rendue (interdits V10) : stockage appareil seul, jamais de carte,
 *  jamais de rappel, jamais au match. */
const OUVERTE_FR = {
  titre: "Ce que tes relations t'ont appris — en quelques lignes, si tu veux.",
  placeholder: "Tes mots à toi — ils ne sont jamais reformulés.",
  retrait: "Je préfère ne pas dire",
  valider: "Envoyer ma page",
  note: "Ce que tu écris reste chez toi : rien ne sera cité, rien ne sera montré.",
  noteRetrait: "Saute sans pénalité — une réponse complète, elle aussi.",
};
export const OUVERTE = avecEN(OUVERTE_FR, EN_Q42.OUVERTE);

/** Textes de la fenêtre de complétion (carte) — entête, labels, fenêtre F1
 *  verbatim (cartes.yaml), miroirNote en couche app. */
export const COMPLETION = {
  entete: "🌱 QUÊTE ACCOMPLIE — « Où tu en es aujourd'hui »",
  labelOmbre: "Ta zone d'ombre :",
  labelTension: "Ta tension intérieure :",
  fenetre:
    "Quelque part, quelqu'un regarde sa propre météo. Le jour où vos cartes se croiseront, elles auront beaucoup à se dire.",
  miroirNote:
    "Ton miroir — la lecture complète de ta météo — arrive à la prochaine étape du voyage.",
};

/**
 * Quête 5.7 « Ton humour » — Monde 6 « Mon Cœur » · 💎 PREMIUM · P2.
 *
 * Contenu FIDÈLE au Livrable M6-5.7-Ton-Humour (2ᵉ génération, dossier
 * ré-émis phase R) :
 *  - ITEMS : les 12 items Likert (verbatim 01-tableau-des-items, ordre du
 *    tableau) — 4 styles × 3 items, 4 paires R6 complètes (01×02 · 04×05 ·
 *    07×08 · 10×11) + 4 pivots (03 · 06 · 09 · 12), orientations 6 D / 6 I ;
 *    ZÉRO trame hébergée par cette quête (verrou capital du 00-README :
 *    12/12 items carte — le bloc ▲ humour agressif vit à la quête 5.4,
 *    phase V12, jamais fusionné avec cette lecture) ;
 *  - PASSATION : l'ordre de passation GELÉ — mélange RÉEL graine 257427
 *    (graine-mère 210427 + 1000 × ordinal 47), outil GÉNÉRIQUE melange.py
 *    (zéro trame, 4 dimensions × 3 — finding V11 re-consigné), course
 *    canonique 2ᵉ génération FAIT FOI : verdicts 6/6 PASS, tentative 1,
 *    run max 2, 5 passes identiques (md5 6425e597bbd13fc8e993f80e4342c214).
 *    DIVERGENCE D'EMPREINTE consignée au 02 : l'empreinte 2ᵉ génération ne
 *    reproduit PAS celle de la 1ʳᵉ génération V11 (d5039ff8…, perdue au
 *    reset — les orientations attribuées par la 2ᵉ diffèrent des perdues de
 *    la 1ʳᵉ) ; la course réelle 2ᵉ génération fait foi — divergence à
 *    consigner au comité ;
 *  - CARTES : les 4 variantes verbatim (cartes.yaml, charte C1-C11) — une
 *    par style, étage 1, partageables. DUAL FACE (refonte verbatim) : la
 *    carte partageable est le produit central de la quête ; SANS hiérarchie,
 *    les deux styles à coût restent assumés avec leur coût nommé, pas une
 *    condamnation ;
 *  - choisirVariante : la sélection VERBATIM du 07-miroir §0 (cascade
 *    SIG-5.7-01 — voir sous le sélecteur) ;
 *  - BRIEFING : l'annonce est VERBATIM (05-ecran-d-intro, 2 phrases), les
 *    puces sont la couche app rédigée (ton Task 35). PREMIUM [6] : zéro
 *    teaser, zéro présupposition des mondes gratuits ;
 *  - COMPLETION : entête, labels et fenêtre F1 verbatim (cartes.yaml),
 *    miroirNote en couche app.
 *
 * DOCTRINE DE L'OMBRE (gelée V11 — à ne pas inverser) : l'ombre = le COÛT,
 * jamais le style. Le coût se nomme pour soi ET pour l'autre, en situation
 * de couple, au registre probabiliste. NEUTRALITÉ TYPOLOGIQUE : les quatre
 * rires se valent — aucun style supérieur, aucun classement ; « qui blesse »
 * et « qui s'auto-rabaisse » restent assumés avec leur coût nommé, pas
 * condamnés. Le rendu parle en images (la table qui rit, la pique, le
 * bouclier, la conversation qui attend), jamais en étiquette.
 *
 * NOMMAGE (verrou — vérifié machine à chaque livraison) : le rendu n'emploie
 * que le nommage UI verbatim refonte (qui rapproche · qui dédramatise · qui
 * blesse · qui s'auto-rabaisse). Les noms scientifiques des styles
 * (affiliatif, auto-améliorant, agressif, auto-dégradant), les variables
 * moteur (AFFIL_D · GAIE_D · AGRES_D · DEGRAD_D) et la source de la
 * typologie (styles d'humour — Martin et al., 2003 ; concepts publics,
 * usage libre avec citation ; citation tenue en documentation interne)
 * restent MOTEUR SEUL — ils ne franchissent jamais le rendu (ce commentaire
 * d'en-tête moteur est leur seul lieu de consignation dans cette app).
 *
 * Typo : apostrophe ASCII uniquement, guillemets français. Règles : aucun
 * code, score, sigle ou seuil ne franchit le rendu ; phrases ≤ 22 mots.
 */

import { avecEN } from '../i18n/apply';
import * as EN_Q57 from '../i18n/content/en/quete-5-7';

export interface QueteItem57 {
  code: string;
  text: string;
  /** 'D' = directe, 'I' = inversée (recodée 6 − r — Arbitrage 1). */
  orient: 'D' | 'I';
  /** Le style verbatim du tableau 01 — clé SANS accent, cohérente partout :
   *  rapproche (AFFIL_D) · dedramatise (GAIE_D) · blesse (AGRES_D) ·
   *  autobaisse (DEGRAD_D). Les noms moteurs restent dans ce commentaire. */
  dim: 'rapproche' | 'dedramatise' | 'blesse' | 'autobaisse';
}

/** L'objet de passation affiché — code + énoncé (l'orientation reste côté moteur). */
export interface ItemsQuete57 {
  code: string;
  text: string;
}

/** Les 12 items — verbatim (01-tableau-des-items, ordre du tableau). */
const ITEMS_FR: readonly QueteItem57[] = [
  {
    code: "Q5.7-01",
    text: "Je fais des blagues pour rapprocher les gens autour de moi.",
    orient: "D",
    dim: "rapproche",
  },
  {
    code: "Q5.7-02",
    text: "Mon humour reste discret quand je suis avec de nouvelles personnes.",
    orient: "I",
    dim: "rapproche",
  },
  {
    code: "Q5.7-03",
    text: "Dans une soirée, je cherche d'abord les rires à partager.",
    orient: "D",
    dim: "rapproche",
  },
  {
    code: "Q5.7-04",
    text: "Je ris de mes galères pour mieux les traverser.",
    orient: "D",
    dim: "dedramatise",
  },
  {
    code: "Q5.7-05",
    text: "Quand la journée devient lourde, je n'y trouve rien de drôle.",
    orient: "I",
    dim: "dedramatise",
  },
  {
    code: "Q5.7-06",
    text: "L'humour est mon dernier recours quand ça va mal.",
    orient: "I",
    dim: "dedramatise",
  },
  {
    code: "Q5.7-07",
    text: "Je me moque des gens en disant que c'est pour rire.",
    orient: "D",
    dim: "blesse",
  },
  {
    code: "Q5.7-08",
    text: "Mes moqueries épargnent les gens autour de moi.",
    orient: "I",
    dim: "blesse",
  },
  {
    code: "Q5.7-09",
    text: "Je dis tout haut la remarque drôle que d'autres gardent.",
    orient: "D",
    dim: "blesse",
  },
  {
    code: "Q5.7-10",
    text: "Je me moque de moi en premier pour faire rire.",
    orient: "D",
    dim: "autobaisse",
  },
  {
    code: "Q5.7-11",
    text: "Mes blagues ne dévoilent pas mes vraies failles.",
    orient: "I",
    dim: "autobaisse",
  },
  {
    code: "Q5.7-12",
    text: "Je raconte mes failles sans en faire des blagues.",
    orient: "I",
    dim: "autobaisse",
  },
];
export const ITEMS = avecEN(ITEMS_FR, EN_Q57.ITEMS);

/** Ordre de passation GELÉ — mélange RÉEL graine 257427 (02-plan-de-melange,
 *  course 2ᵉ génération FAIT FOI — voir l'en-tête pour la divergence
 *  d'empreinte consignée). Le 1ᵉʳ item vu est Q5.7-12 (la faille dite
 *  sérieusement), le dernier Q5.7-11 (la faille gardée) — JAMAIS l'ordre
 *  des codes. Positions par style (réel) : rapproche {2, 5, 9} ·
 *  dedramatise {4, 7, 10} · blesse {3, 6, 11} · autobaisse {1, 8, 12} —
 *  0 adjacence de dimension (c1), distances intra-dimension ≥ 3 (c4,
 *  déficit 0), run max 2 avec la seule paire D/D adjacente en positions
 *  8-9 (composante douce documentée au c5). Zéro trame hébergée
 *  (12/12 items carte — verrou capital) : aucun code de flux, aucune
 *  position ▲ dans cette passation. */
export const PASSATION: readonly string[] = [
  "Q5.7-12",
  "Q5.7-03",
  "Q5.7-08",
  "Q5.7-04",
  "Q5.7-02",
  "Q5.7-09",
  "Q5.7-05",
  "Q5.7-10",
  "Q5.7-01",
  "Q5.7-06",
  "Q5.7-07",
  "Q5.7-11",
];

const PAR_CODE = new Map(ITEMS.map((i) => [i.code, i]));

/** Le deck réel : les 12 items dans l'ordre gelé — zéro trame, tous les
 *  codes de la passation se résolvent en un item affiché. */
export function deckQuete(): ItemsQuete57[] {
  return PASSATION.flatMap((c) => {
    const it = PAR_CODE.get(c);
    return it ? [{ code: it.code, text: it.text }] : [];
  });
}

/** Likert 1-5 → 0-1 (inversées recodées 6 − r — Arbitrage 1). */
function contribution(reponse: number, orient: 'D' | 'I'): number {
  return ((orient === 'D' ? reponse : 6 - reponse) - 1) / 4;
}

export interface Score57 {
  /** Le rire qui lie le groupe — moyenne des 3 items (AFFIL_D côté
   *  moteur), normalisée 0-1 (haut = le rire qui rapproche). */
  rapproche: number;
  /** Le rire qui traverse les coups durs — moyenne des 3 items (GAIE_D
   *  côté moteur), normalisée 0-1 (haut = le rire qui dédramatise). */
  dedramatise: number;
  /** Le rire qui pince sa cible — moyenne des 3 items (AGRES_D côté
   *  moteur), normalisée 0-1 (haut = le rire qui blesse). */
  blesse: number;
  /** Le rire qui se prend pour cible — moyenne des 3 items (DEGRAD_D
   *  côté moteur), normalisée 0-1 (haut = le rire qui s'auto-rabaisse). */
  autobaisse: number;
  /** Signature d'index (contrat du registre : Record<string, number>) —
   *  aucun score supplémentaire n'y entre. */
  [dim: string]: number;
}

/**
 * Scorer du Livrable : quatre scores de style (moyennes des contributions
 * recodées, 3 items par style), normalisés 0-1. Ils alimentent la cascade
 * SIG-5.7-01 (choisirVariante + cascade57) et la carte (canal carte).
 *
 * DUAL FACE (refonte verbatim) — la face VISIBLE est la carte partageable
 * (produit central) ; la face MOTEUR est le croisement « qui blesse » ×
 * sensibilité au rejet haute (RSQ — blocs 1.2/4.2), drapeau de vigilance
 * SIG-5.7-02 : MOTEUR SEUL, jamais au rendu, jamais au match, jamais au
 * premium. Il n'est PAS calculé ici — la sensibilité au rejet n'est pas
 * consommée par cette quête (seuils propriété des quêtes porteuses) ; sa
 * double lecture (la cible possible · le tranchant lu comme rejet) est
 * documentée au 03. SIG-5.7-03 (croisement IAC) : ATTENDU, pas calculé
 * (Phase 2/3). Seuls les quatre scores ci-dessus sont produits.
 */
export function scorer(reponses: Record<string, number>): Score57 {
  const parStyle = new Map<string, { total: number; n: number }>();
  for (const code of PASSATION) {
    const it = PAR_CODE.get(code);
    const r = it ? reponses[it.code] : undefined;
    if (it && typeof r === 'number' && r >= 1 && r <= 5) {
      const c = contribution(r, it.orient);
      const bloc = parStyle.get(it.dim) ?? { total: 0, n: 0 };
      bloc.total += c;
      bloc.n += 1;
      parStyle.set(it.dim, bloc);
    }
  }
  const style = (dim: string): number => {
    const bloc = parStyle.get(dim);
    return bloc && bloc.n > 0 ? bloc.total / bloc.n : 0;
  };
  return {
    rapproche: style('rapproche'),
    dedramatise: style('dedramatise'),
    blesse: style('blesse'),
    autobaisse: style('autobaisse'),
  };
}

/** Les 4 variantes — ids VERBATIM (cartes.yaml). */
export type VarianteId57 =
  | 'CARTE-5.7-RAPPROCHE'
  | 'CARTE-5.7-LEGER'
  | 'CARTE-5.7-TRANCHANT'
  | 'CARTE-5.7-DESAMORCE';

/** Clé de style — sans accent, cohérente partout (items, score, cascade). */
export type CleStyle57 = 'rapproche' | 'dedramatise' | 'blesse' | 'autobaisse';

/** L'ordre de DÉPARTAGE des égalités exactes : la première position de
 *  passation tranche (07 §0 — précédent SIG-5.3-01). Positions réelles
 *  (graine 257427) : autobaisse pos 1 · rapproche pos 2 · blesse pos 3 ·
 *  dedramatise pos 4. */
const ORDRE_DEPARTAGE: readonly CleStyle57[] = [
  'autobaisse',
  'rapproche',
  'blesse',
  'dedramatise',
];

const valeurStyle = (score: Score57, cle: CleStyle57): number =>
  typeof score[cle] === 'number' ? (score[cle] as number) : 0;

/** Le duel de tête du 07 §0 : dominant = argmax (départage par première
 *  position de passation), second = le suivant (même départage). */
function duelDeTete(score: Score57): { dominant: CleStyle57; second: CleStyle57; ecart: number } {
  let dominant = ORDRE_DEPARTAGE[0];
  let second = ORDRE_DEPARTAGE[1];
  for (const cle of ORDRE_DEPARTAGE.slice(1)) {
    if (valeurStyle(score, cle) > valeurStyle(score, dominant)) {
      second = dominant;
      dominant = cle;
    } else if (valeurStyle(score, cle) > valeurStyle(score, second)) {
      second = cle;
    }
  }
  return { dominant, second, ecart: valeurStyle(score, dominant) - valeurStyle(score, second) };
}

/**
 * Sélecteur VERBATIM (07-miroir §0 + cartes.yaml — cascade SIG-5.7-01) :
 * dominant = argmax des quatre scores → la carte de ce style. En cas
 * d'ÉGALITÉ EXACTE, la première position de passation tranche (précédent
 * SIG-5.3-01 — ordre ORDRE_DEPARTAGE). Le secondaire ne participe pas au
 * choix de la carte : écart(dominant − second) < 0.05 → il est nommé au
 * miroir (une phrase, jamais un second profil) ; écart ∈ [0.05 ; 0.10] →
 * note de prudence au miroir, seule la carte du dominant — voir cascade57.
 * Seuils 0.05 / 0.10 provisoires concepteur (« À VALIDER PAR LE COMITÉ »,
 * re-signature professionnelle avant bêta) : métadonnées moteur, jamais
 * rendues. Le croisement RSQ (SIG-5.7-02) ne participe JAMAIS à la
 * sélection ni au rendu (MOTEUR SEUL — verrou 04 n° 6).
 */
export function choisirVariante(score: Score57): VarianteId57 {
  const { dominant } = duelDeTete(score);
  switch (dominant) {
    case 'rapproche':
      return 'CARTE-5.7-RAPPROCHE';
    case 'dedramatise':
      return 'CARTE-5.7-LEGER';
    case 'blesse':
      return 'CARTE-5.7-TRANCHANT';
    case 'autobaisse':
      return 'CARTE-5.7-DESAMORCE';
  }
}

/** La cascade SIG-5.7-01 rendue CALCULABLE (07 §0) pour la couche miroir —
 *  aucun de ces champs ne franchit la carte : 'nomme' = le secondaire se
 *  nomme au miroir (une phrase) ; 'prudence' = note de prudence au miroir,
 *  carte du dominant seule ; null = style seul. */
export interface Cascade57 {
  dominant: CleStyle57;
  secondaire: CleStyle57;
  mode: 'nomme' | 'prudence' | null;
}

export function cascade57(score: Score57): Cascade57 {
  const { dominant, second, ecart } = duelDeTete(score);
  const mode = ecart < 0.05 ? 'nomme' : ecart <= 0.1 ? 'prudence' : null;
  return { dominant, secondaire: second, mode };
}

export interface Carte {
  id: VarianteId57;
  nom: string;
  lumiere: string;
  ombre: string;
  tension: string;
}

/** Les 4 variantes de carte — verbatim (cartes.yaml, ordre du YAML :
 *  portrait → lumiere, ombre → ombre, tension_interieure → tension).
 *  NEUTRALITÉ TYPOLOGIQUE : les quatre rires se valent — aucune variante
 *  n'est un idéal, aucune n'est un défaut (C4) ; les deux styles à coût
 *  restent assumés, avec le COÛT nommé (pour soi ET pour l'autre), pas une
 *  condamnation. DUAL FACE : la carte est partageable — le partage ne
 *  présuppose rien d'acheté ([6]). */
export const CARTES: Record<VarianteId57, Carte> = {
  "CARTE-5.7-RAPPROCHE": {
    id: "CARTE-5.7-RAPPROCHE",
    nom: "Le·La Rire qui rapproche",
    lumiere:
      "Tu as dit faire des blagues pour rapprocher les gens autour de toi, et chercher les rires à partager. Avec toi, une soirée se débloque vite : la gêne sort, les gens se parlent. Ton humour est ta façon de tendre la main.",
    ombre:
      "Le lien qui se fabrique en riant repousse le grave. En couple, les sujets lourds attendent un ton de blague qui ne vient pas. L'autre peut cesser de t'amener l'essentiel, faute de le voir atterrir. Ton rire est une langue : le sérieux a besoin du sien.",
    tension: "laisser le rire ouvrir la conversation, sans la finir à ta place.",
  },
  "CARTE-5.7-LEGER": {
    id: "CARTE-5.7-LEGER",
    nom: "Le·La Rire qui dédramatise",
    lumiere:
      "Tu as dit ris de tes galères pour mieux les traverser. Chez toi, un lundi noir devient une histoire racontable — le recul arrive avant la panique. Les gens repartent de tes mauvaises nouvelles avec moins de poids sur les épaules.",
    ombre:
      "Le rire posé trop tôt ferme la conversation nécessaire. En couple, ton calme drôle peut être pris pour un « ça va ». L'inquiétude vraie reste en anecdote, et l'autre croit le sujet réglé. La gravité se lit dans ton sourire — elle attendait une phrase claire.",
    tension: "garder le rire traversant, posé après le mot sérieux.",
  },
  "CARTE-5.7-TRANCHANT": {
    id: "CARTE-5.7-TRANCHANT",
    nom: "Le·La Rire qui blesse",
    lumiere:
      "Tu as dit te moquer des gens en disant que c'est pour rire. Tu dis tout haut la remarque que d'autres gardent. Ton humour voit vite le faux et ne joue pas la comédie : chez toi, on sait ce qui se pense.",
    ombre:
      "La pique ne prévient pas sa cible. En couple, la personne visée n'était pas de la partie — elle rit, puis elle édite ce qu'elle te confie. La confiance se décale d'un demi-ton, plus prudente que drôle. Ton tranchant est une langue : ceux qui ne la parlent pas l'entendent quand même.",
    tension: "garder le tranchant pour les idées, la douceur pour les failles des proches.",
  },
  "CARTE-5.7-DESAMORCE": {
    id: "CARTE-5.7-DESAMORCE",
    nom: "Le·La Rire qui s'auto-rabaisse",
    lumiere:
      "Tu as dit te moquer de toi en premier pour faire rire. Ton humour désamorce la gêne avant qu'elle ne s'installe. Avec toi, on a le droit d'être imparfait — tu donnes l'exemple avant tout le monde.",
    ombre:
      "La blague sur soi peut devenir la seule présentation. En couple, l'autre ne peut pas rassurer à l'infini — chaque « mais non, tu vas bien » use un peu de tendresse. Et tes forces, moins moquées, restent à découvrir.",
    tension: "présenter une force sans rire — une seule suffit pour ouvrir la porte.",
  },
};

/** Textes du briefing — annonce VERBATIM (05-ecran-d-intro, 2 phrases),
 *  puces en couche app (ton Task 35, neutralité typologique). PREMIUM [6] :
 *  zéro teaser, zéro présupposition — la carte partageable reste le produit
 *  central, le partage ne présuppose rien d'acheté. */
export const BRIEFING = {
  annonce:
    "Ton humour arrive dans la conversation avant tes qualités — il détend, il tranche, il traverse. Ici, tu regardes ce que ton rire dit de toi, sans classement entre les quatre façons de faire rire.",
  aQuoiCaSert: [
    "C'est la quête de ton rire : quatre façons de faire rire, posées à égalité — aucune n'est « la bonne ».",
    "Douze affirmations, quatre lectures : le rire qui rapproche, celui qui dédramatise, celui qui blesse, celui qui s'auto-rabaisse.",
    "Ici, rien n'est jugé : un style décrit des mécanismes, il n'est ni une qualité ni une faute.",
    "À la fin, une carte à partager si tu veux : ton rire en quelques mots, à montrer ou à garder.",
  ],
  resultats: [
    "Ta carte — ton rire raconté en quelques mots : elle se partage, ou se garde.",
    "Quatre barres — une par façon de faire rire, telles que tu les as décrites.",
    "Ton miroir à l'étape suivante — la lecture complète de ton rire, sans classement.",
    "Une pierre de plus dans ton portrait — la suite du voyage s'en nourrit.",
  ],
};

/** Textes de la fenêtre de complétion (carte) — entête, labels, fenêtre F1
 *  verbatim (cartes.yaml — le préfixe de slot « F1 : » reste au Livrable,
 *  précédents 4.1/4.2), miroirNote en couche app. */
export const COMPLETION = {
  entete: "💗 QUÊTE ACCOMPLIE — « Ton humour »",
  labelOmbre: "Ta zone d'ombre :",
  labelTension: "Ta tension intérieure :",
  fenetre:
    "Quelque part, quelqu'un rit comme toi — même langue, autre accent. Le jour où vos cartes se croiseront, la conversation aura déjà commencé.",
  miroirNote:
    "Ton miroir — la lecture complète de ton rire — arrive à la prochaine étape du voyage.",
};

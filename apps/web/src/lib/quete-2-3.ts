/**
 * Quête 2.3 « Tes non-négociables » — Monde 3 « La Boussole » — FORMAT CHECKLIST (NON-Likert).
 *
 * Contenu FIDÈLE au Livrable M3-2.3-Tes-Non-Negociables (branche archive/v1-2026-10-05) :
 *  - ITEMS : les 10 items verbatim (01-tableau-des-items, ordre des codes gelés Q2.3-01 → Q2.3-10)
 *    — 9 items fermés cochables (« coché / non coché ») + Q2.3-10 champ libre optionnel ;
 *  - PASSATION : l'ordre de passation GELÉ (mélange graine 23427, 02-plan-de-melange —
 *    Fisher-Yates seedé, re-tirage non nécessaire, rejeu diff nul). La séquence du Livrable
 *    compte 10 positions dont Q2.3-10 en position 4 ; le champ libre étant HORS coches
 *    (stocké à part par l'orchestrateur), la PASSATION exposée ici porte les 9 items cochables
 *    dans l'ordre exact du plan de mélange (Q2.3-10 retiré, l'ordre relatif des autres préservé) ;
 *  - passerelle unique : la passation APP est UN SEUL ÉCRAN — l'utilisateur voit la liste,
 *    coche, valide. deckQuete() rend la liste des 9 coches dans l'ordre gelé (l'orchestrateur
 *    gère le rendu de l'écran unique et le champ libre via LIBRE_CODE) ;
 *  - scorer : AUCUNE dimension psychométrique, AUCUN signal (dimension = null, signal = null —
 *    fiche de computation 06, « une coche n'alimente aucune moyenne — elle active un filtre »).
 *    Le score de sélection = l'état des coches : { coches } = nombre d'items Q2.3-01 → Q2.3-09
 *    cochés (valeur 1), de 0 à 9. Les réponses brutes restent exposées sous chaque code
 *    (index signature de Score23 — signature standard Record<string, number>) ;
 *  - choisirVariante : les 3 plages TRANCHÉES par le fondateur (cartes.yaml v2, mission VAGUE 5)
 *    — 0-2 cochées → CARTE-2.3-A · 3-6 → CARTE-2.3-B · 7+ → CARTE-2.3-C — évaluées dans
 *    l'ordre_selecteur 1 → 2 → 3 ; partition totale de 0 à 9 (C6, vérifiée machine au YAML).
 *    L'orchestrateur enchaîne choisirVariante(scorer(reponses)) — contrat assuré par les types ;
 *  - Q2.3-10 (LIBRE_CODE) : champ libre optionnel, format 'libre' — AUCUNE coche, JAMAIS parsé
 *    par le moteur (01-tableau : « aucun — hors computation automatique » ; v1 : jamais par les
 *    filtres). La valeur (les mots de la personne) est stockée par l'orchestrateur à part
 *    (champ textes de l'état de quête — extension M3 du contrat EtatQuete), JAMAIS dans
 *    reponses (Record<string, number>), et n'entre JAMAIS dans scorer ni dans la sélection de
 *    carte (cartes.yaml : « Q2.3-10 n'est JAMAIS compté dans la sélection »). Doctrine :
 *    les mots de la personne ne sont jamais reformulés — rappel verbatim uniquement, avec
 *    consentement (04-slots verrou 7, 03-signatures).
 *
 * Doctrine du Livrable : neutralité absolue — aucune coche n'est « sage » ni « fermée »,
 * la liste vide (0 coche, SIG-2.3-02) n'est jamais un défaut ni une pénalité ; l'ombre nomme
 * le COÛT RELATIONNEL du choix (un filtre dur réduit le bassin de rencontre), jamais un
 * jugement moral. Le mécanisme de filtre (hard constraints, concept public Jonason et al.)
 * vit côté moteur uniquement — jamais nommé dans aucun texte rendu.
 *
 * Typo : apostrophe ASCII uniquement, pas d'insécable, guillemets français.
 * Règles : aucun code, score, sigle ou seuil ne franchit le rendu ; phrases ≤ 22 mots
 * dans les textes rédigés (l'annonce VERBATIM fait foi).
 */

/** Un item de la checklist — 'coche' = énoncé fermé cochable · 'libre' = champ libre optionnel. */
export interface QueteItem23 {
  code: string;
  text: string;
  format: 'coche' | 'libre';
}

/**
 * Les 10 items — VERBATIM (01-tableau-des-items, ordre des codes gelés).
 * Les 9 premiers : cocher = « c'est rédhibitoire pour moi » — 1ʳᵉ personne, l'utilisateur
 * pose SA limite. Q2.3-10 (format 'libre') : N'EST PAS un item du deck des coches — il est
 * rendu à part par l'orchestrateur sur l'écran unique ; sa valeur texte vit hors reponses
 * (voir LIBRE_CODE).
 */
export const ITEMS: readonly QueteItem23[] = [
  {
    code: "Q2.3-01",
    text: "Je ne peux pas construire avec quelqu'un qui fume.",
    format: "coche",
  },
  {
    code: "Q2.3-02",
    text: "Je ne peux pas construire avec quelqu'un qui boit régulièrement.",
    format: "coche",
  },
  {
    code: "Q2.3-03",
    text: "Un désaccord sur le sujet des enfants est rédhibitoire pour moi.",
    format: "coche",
  },
  {
    code: "Q2.3-04",
    text: "Une différence de religion ou de pratique est rédhibitoire pour moi.",
    format: "coche",
  },
  {
    code: "Q2.3-05",
    text: "Une relation à distance est rédhibitoire pour moi.",
    format: "coche",
  },
  {
    code: "Q2.3-06",
    text: "Une différence d'alimentation au quotidien est rédhibitoire pour moi.",
    format: "coche",
  },
  {
    code: "Q2.3-07",
    text: "Vivre avec quelqu'un qui ne fait pas de sport est rédhibitoire.",
    format: "coche",
  },
  {
    code: "Q2.3-08",
    text: "Une relation non exclusive est rédhibitoire pour moi.",
    format: "coche",
  },
  {
    code: "Q2.3-09",
    text: "Un désaccord sur le niveau d'engagement est rédhibitoire.",
    format: "coche",
  },
  {
    // Champ libre optionnel — format 'libre' : AUCUNE coche, jamais parsé par le
    // moteur, jamais compté dans scorer/choisirVariante. La valeur de cet item
    // est stockée à part par l'orchestrateur (EtatQuete.textes — extension M3),
    // JAMAIS dans reponses (Record<string, number>). Les mots de la personne ne
    // sont jamais reformulés : rappel verbatim uniquement, avec consentement
    // (01-tableau « hors computation automatique », 04-slots verrou 7).
    code: "Q2.3-10",
    text: "Une autre ligne rouge, dans tes mots.",
    format: "libre",
  },
];

/**
 * Ordre de passation GELÉ — plan de mélange graine 23427 (02-plan-de-melange).
 * Séquence du Livrable (10 positions) : Q2.3-02 · 07 · 08 · 10 · 06 · 09 · 04 · 03 · 01 · 05.
 * Q2.3-10 (position 4) est le champ libre : hors coches, hors reponses — il n'entre pas
 * dans cette liste ; les 9 items cochables conservent l'ordre exact du plan de mélange.
 */
export const PASSATION: readonly string[] = [
  "Q2.3-02",
  "Q2.3-07",
  "Q2.3-08",
  "Q2.3-06",
  "Q2.3-09",
  "Q2.3-04",
  "Q2.3-03",
  "Q2.3-01",
  "Q2.3-05",
];

const PAR_CODE = new Map(ITEMS.map((i) => [i.code, i]));

/** Les 9 coches de l'écran unique, dans l'ordre gelé — le champ libre (Q2.3-10)
 *  n'y figure JAMAIS : l'orchestrateur le rend à part via LIBRE_CODE / ITEMS. */
export function deckQuete(): { code: string; text: string }[] {
  return PASSATION.flatMap((c) => {
    const it = PAR_CODE.get(c);
    return it ? [{ code: it.code, text: it.text }] : [];
  });
}

/** Le score de la quête : l'état des coches — AUCUNE dimension psychométrique,
 *  AUCUN signal (dimension = null, signal = null au Livrable). L'index signature
 *  expose les réponses brutes (0/1) sous chaque code de la passation. */
export interface Score23 {
  /** Nombre d'items Q2.3-01 → Q2.3-09 cochés (0 à 9) — chaque item coché = 1. */
  coches: number;
  [k: string]: number;
}

/** Scorer de la checklist : coches = nombre de codes Q2.3-01 → Q2.3-09 avec valeur 1.
 *  Toute valeur ≠ 1 compte « non coché ». Les réponses brutes (0/1 par code) restent
 *  exposées dans l'objet retourné — signature standard Record<string, number>.
 *  Q2.3-10 n'y entre JAMAIS (champ libre hors reponses, hors computation). */
export function scorer(reponses: Record<string, number>): Score23 {
  const score: Score23 = { coches: 0 };
  for (const code of PASSATION) {
    const v = reponses[code];
    const brut = typeof v === 'number' && Number.isFinite(v) ? v : 0;
    score[code] = brut;
    if (brut === 1) score.coches += 1;
  }
  return score;
}

export type VarianteId23 = 'CARTE-2.3-A' | 'CARTE-2.3-B' | 'CARTE-2.3-C';

/**
 * Sélection VERBATIM (cartes.yaml v2 — logique tranchée par le fondateur, mission VAGUE 5 ;
 * la v1 « ≥ 1 coche / 0 coche » est remplacée), évaluée dans l'ordre_selecteur 1 → 2 → 3 :
 *  0 à 2 lignes rouges cochées → CARTE-2.3-A (Le·La Confiant·e dans le flou) ·
 *  3 à 6 → CARTE-2.3-B (Le·La Bâtisseur·se de frontières) ·
 *  7 à 9 → CARTE-2.3-C (Le·La Forteresse).
 * Partition totale de 0 à 9 — chaque profil tombe dans exactement une variante (C6, YAML).
 * Conditions et seuils restent côté moteur, jamais rendus. Q2.3-10 n'est jamais compté.
 */
export function choisirVariante(score: Score23): VarianteId23 {
  const n = typeof score.coches === 'number' ? score.coches : 0;
  return n <= 2 ? 'CARTE-2.3-A' : n <= 6 ? 'CARTE-2.3-B' : 'CARTE-2.3-C';
}

export interface Carte {
  id: VarianteId23;
  nom: string;
  lumiere: string;
  ombre: string;
  tension: string;
}

/** Les 3 cartes de clarté — VERBATIM (cartes.yaml v2, ordre du YAML ; portrait → lumiere,
 *  ombre, tension_interieure → tension). L'ombre nomme le coût relationnel du choix,
 *  jamais un jugement. Charte VAGUE 5 : 40-70 mots (exception documentée). */
export const CARTES: Record<VarianteId23, Carte> = {
  'CARTE-2.3-A': {
    id: 'CARTE-2.3-A',
    nom: "Le·La Confiant·e dans le flou",
    lumiere:
      "Tu coches presque rien : tu laisses la place aux surprises, et aux gens l'occasion de te surprendre. Ton cadre s'écrit en marchant.",
    ombre:
      "Sans limites déclarées, on finit par les subir avant de les choisir — pose-les avant qu'une histoire ne les pose pour toi.",
    tension: "faire confiance, sans te faire déborder.",
  },
  'CARTE-2.3-B': {
    id: 'CARTE-2.3-B',
    nom: "Le·La Bâtisseur·se de frontières",
    lumiere:
      "Tu as posé des limites, pas trop : tu sais où tu ne négocies pas, et tu laisses le reste à l'imprévu. Tes cadres disent qui tu es sans tout fermer.",
    ombre:
      "Attention aux frontières qui servent d'excuse : une ligne posée pour éviter la discussion ne protège plus, elle écarte.",
    tension: "tenir tes limites, sans t'en faire un bouclier contre tout.",
  },
  'CARTE-2.3-C': {
    id: 'CARTE-2.3-C',
    nom: "Le·La Forteresse",
    lumiere:
      "Tu sais exactement où tu ne négocies pas : tes lignes rouges se comptent, et elles tiennent. Tes rencontres démarrent nettes, sans zone grise à débrouiller après coup.",
    ombre:
      "Autant de lignes rouges filent plus de gens qu'elles n'en gardent — vérifie que tu gardes une porte, et pas un mur.",
    tension: "protéger ta vie, sans la vider d'avance.",
  },
};

/** Textes du briefing — annonce VERBATIM (05-ecran-d-intro, 2 phrases), puces en couche app. */
export const BRIEFING = {
  annonce:
    "Certaines choses ne se négocient pas. Voici les tiennes — et c'est à toi de les poser.",
  aQuoiCaSert: [
    "C'est la quête de la boussole — les lignes rouges que tu poses pour ce qui se construit à deux.",
    "Neuf énoncés fermés sur un seul écran : tu coches ceux qui sont rédhibitoires pour toi.",
    "Cocher n'est pas mieux que ne pas cocher — la liste vide se défend aussi.",
    "Tu peux ajouter une ligne rouge dans tes mots, en champ libre — optionnel, jamais obligatoire.",
  ],
  resultats: [
    "Ta carte — ta lumière et ta zone d'ombre, en quelques mots.",
    "Tes lignes rouges rappelées en toutes lettres : les énoncés cochés, et tes mots si tu en as écrit.",
    "Les pierres de ton portrait — ce que tu poses ici pèse dans toute la suite du voyage.",
  ],
};

/** Textes de la fenêtre de complétion (carte) — entête, labels et fenêtre VERBATIM
 *  (cartes.yaml : entete_ecran, label_ombre, label_tension, fenêtre rotative F1). */
export const COMPLETION = {
  entete: "🧭 QUÊTE ACCOMPLIE — « Tes non-négociables »",
  labelOmbre: "Ta zone d'ombre :",
  labelTension: "Ta tension intérieure :",
  fenetre:
    "Quelque part, quelqu'un répond à ces mêmes questions. Le jour où vos cartes se croiseront, elles auront beaucoup à se dire.",
  miroirNote:
    "Ton miroir — la lecture complète de tes lignes rouges — arrive à la prochaine étape du voyage.",
};

/**
 * Le code GELÉ du champ libre — 'Q2.3-10' (01-tableau). Constante d'usage orchestrateur :
 *  - l'item correspondant vit dans ITEMS (format 'libre') — son énoncé est rendu tel quel,
 *    sa valeur (le texte de la personne) va dans EtatQuete.textes (extension M3), JAMAIS
 *    dans reponses (Record<string, number>) ;
 *  - hors computation automatique (v1) : jamais parsé, jamais compté dans scorer, jamais
 *    dans choisirVariante, jamais dans le deck des coches ;
 *  - les mots de la personne ne sont jamais reformulés, résumés ni « traduits » :
 *    rappel verbatim uniquement, avec consentement explicite (04-slots verrou 7).
 */
export const LIBRE_CODE = 'Q2.3-10';

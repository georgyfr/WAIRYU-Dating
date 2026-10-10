/**
 * Quête 5.1 « Ton style amoureux » — Monde 6 « Mon Cœur ».
 *
 * Contenu FIDÈLE au Livrable M6-5.1-Ton-Style-Amoureux (branche archive/v1 —
 * ré-émission 2ᵉ génération, mission R-a : le dossier V11, jamais poussé, a
 * été perdu au reset du bac à sable ; les textes sont réécrits Wairyu sur le
 * cadre gelé, aucun texte V11 n'existe à copier) :
 *  - ITEMS : les 18 items Likert (verbatim 01-tableau-des-items, ordre du
 *    tableau) — 6 façons d'aimer × 3 items (la passion · le jeu · l'amitié
 *    devenue amour · le pragmatisme · l'intensité · le don de soi), 6 paires
 *    R6 complètes (01×02 · 04×05 · 07×08 · 10×11 · 13×14 · 16×17) + 6 pivots
 *    mono (03 · 06 · 09 · 12 · 15 · 18), équilibre d'orientations 9 D / 9 I
 *    (paires 6 D/6 I · pivots 3 D/3 I) ;
 *  - PASSATION : l'ordre de passation GELÉ (mélange RÉEL graine 251427,
 *    outil générique melange.py — aucune trame dans 5.1, c2/c3 sans-objet ;
 *    5 passes rejouées identiques octet pour octet — 6/6 contraintes PASS) ;
 *    le 1ᵉʳ item vu est Q5.1-05, le dernier Q5.1-14 ;
 *  - CARTES : les 7 variantes verbatim (cartes.yaml, charte C1-C11) — les
 *    6 façons + le profil égalitaire/mixte (partition totale, C6) ;
 *  - choisirVariante : la cascade VERBATIM du 07-miroir §0 (SIG-5.1-01 —
 *    documentée au-dessus de la fonction). Bornes 0.05 / 0.10 À VALIDER PAR
 *    LE COMITÉ (provisoires concepteur, re-signature professionnelle avant
 *    bêta) — jamais rendues ;
 *  - BRIEFING : l'annonce est verbatim (05-ecran-d-intro, 2 phrases), les
 *    puces sont la couche app rédigée (ton Task 35) ;
 *  - AUCUNE TRAME dans cette quête : 5.1 n'héberge AUCUN signal ▲ — zéro
 *    contenu signal au dossier, aucun écran spécial, aucun saut de deck.
 *
 * NEUTRALITÉ TYPOLOGIQUE STRICTE (doctrine capitale du Livrable) : les six
 * façons d'aimer se valent — aucune n'est supérieure ou inférieure, le
 * moteur classe une façon dominante, il ne mesure pas une « maturité
 * amoureuse ». L'ombre = l'EXCÈS en couple, jamais la nature : coût pour
 * soi ET coût pour l'autre, les deux nommés. Zéro diagnostic, zéro
 * étiquette clinique (l'intensité se décrit en comportements quotidiens).
 *
 * INTERDITS GRAVÉS : les six noms d'atelier de la typologie des styles
 * amoureux et le nom de son auteur ne franchissent pas le rendu (fichiers
 * moteur 01/03/06 seuls) — le nommage UI obligatoire s'applique : « la
 * passion », « le jeu », « l'amitié devenue amour », « le pragmatisme »,
 * « l'intensité », « le don de soi ».
 *
 * Moteur (côté score, jamais rendu) : six scores de style = moyennes des
 * 3 items de chaque façon (I recodés 6 − r), normalisées 0-1. Ils
 * choisissent la variante (cartes.yaml, canal carte). La matrice des
 * façons (SIG-5.1-02) est [MOTEUR SEUL] — jamais au rendu, jamais en UI,
 * jamais au match affiché. Le pré-signal intensité × JR1 (SIG-5.1-03) est
 * ATTENDU V12 (quête 5.4, trames jalousie) — consigné, NON CALCULÉ ici.
 * Les rappels s'ancrent aux énoncés D uniquement (règle d'ancrage) et aux
 * seules réponses de CETTE quête (premium [6] : aucune présupposition des
 * mondes gratuits, zéro teaser).
 *
 * Typo : apostrophe ASCII uniquement, guillemets français. Règles : aucun
 * code, score, sigle ou seuil ne franchit le rendu ; phrases ≤ 22 mots ;
 * « toujours »/« jamais » interdits au rendu.
 */

import { avecEN } from '../i18n/apply';
import * as EN_Q51 from '../i18n/content/en/quete-5-1';

export interface QueteItem51 {
  code: string;
  text: string;
  /** 'D' = directe, 'I' = inversée (recodée 6 − r). */
  orient: 'D' | 'I';
  /** La façon du tableau 01 — clés sans accent (sécurité TS) :
   *  passion (3) · jeu (3) · amitie (3) · pragmatisme (3) ·
   *  intensite (3) · don (3). */
  dim: 'passion' | 'jeu' | 'amitie' | 'pragmatisme' | 'intensite' | 'don';
}

/** L'objet de passation affiché — code + énoncé (l'orientation reste côté moteur). */
export interface ItemsQuete51 {
  code: string;
  text: string;
}

/** Les 18 items — verbatim (01-tableau-des-items, ordre du tableau :
 *  6 façons × 3 items, 6 paires R6 complètes + 6 pivots mono, 9 D / 9 I).
 *  Aucun énoncé ne juge une façon : l'excès — donc l'ombre — se raconte au
 *  rendu (07-miroir), jamais dans les items. */
const ITEMS_FR: readonly QueteItem51[] = [
  {
    code: "Q5.1-01",
    text: "Quand l'attirance frappe fort, tout le reste attend.",
    orient: "D",
    dim: "passion",
  },
  {
    code: "Q5.1-02",
    text: "Une attirance trop forte me met en retrait.",
    orient: "I",
    dim: "passion",
  },
  {
    code: "Q5.1-03",
    text: "Je m'attache vite quand la flamme prend.",
    orient: "D",
    dim: "passion",
  },
  {
    code: "Q5.1-04",
    text: "Garder un peu de jeu rend l'histoire plus vivante.",
    orient: "D",
    dim: "jeu",
  },
  {
    code: "Q5.1-05",
    text: "Le flirt qui cache ses cartes me lasse vite.",
    orient: "I",
    dim: "jeu",
  },
  {
    code: "Q5.1-06",
    text: "Je préfère la clarté au maintien du mystère.",
    orient: "I",
    dim: "jeu",
  },
  {
    code: "Q5.1-07",
    text: "Les meilleures histoires commencent par une amitié.",
    orient: "D",
    dim: "amitie",
  },
  {
    code: "Q5.1-08",
    text: "Confondre amitié et amour me semble risqué.",
    orient: "I",
    dim: "amitie",
  },
  {
    code: "Q5.1-09",
    text: "Ce qui me lie à quelqu'un grandit sans se presser.",
    orient: "D",
    dim: "amitie",
  },
  {
    code: "Q5.1-10",
    text: "L'amour tient quand les projets de vie collent.",
    orient: "D",
    dim: "pragmatisme",
  },
  {
    code: "Q5.1-11",
    text: "Raisonner sa vie amoureuse lui fait perdre son sel.",
    orient: "I",
    dim: "pragmatisme",
  },
  {
    code: "Q5.1-12",
    text: "Le coup de cœur ne passe pas par une liste.",
    orient: "I",
    dim: "pragmatisme",
  },
  {
    code: "Q5.1-13",
    text: "J'ai besoin de signes réguliers pour me sentir en paix.",
    orient: "D",
    dim: "intensite",
  },
  {
    code: "Q5.1-14",
    text: "Le calme des silences me rassure plus que les preuves.",
    orient: "I",
    dim: "intensite",
  },
  {
    code: "Q5.1-15",
    text: "Quand quelqu'un tarde à répondre, mon esprit s'emballe.",
    orient: "D",
    dim: "intensite",
  },
  {
    code: "Q5.1-16",
    text: "Aimer, c'est d'abord prendre soin sans compter.",
    orient: "D",
    dim: "don",
  },
  {
    code: "Q5.1-17",
    text: "Donner sans retour finit par me vider.",
    orient: "I",
    dim: "don",
  },
  {
    code: "Q5.1-18",
    text: "Avant de me donner, j'apprends à recevoir.",
    orient: "I",
    dim: "don",
  },
];
export const ITEMS = avecEN(ITEMS_FR, EN_Q51.ITEMS);

/** Ordre de passation GELÉ — mélange RÉEL graine 251427 (02-plan-de-melange ;
 *  le 1ᵉʳ item vu est Q5.1-05, le dernier Q5.1-14 — JAMAIS l'ordre des codes).
 *  AUCUNE trame dans 5.1 (zéro signal ▲ hébergé — 18 écrans, aucun saut).
 *  Positions par façon (réel) : jeu {1, 6, 9} · intensité {2, 11, 18} ·
 *  pragmatisme {3, 12, 15} · amitié {4, 14, 17} · passion {5, 8, 13} ·
 *  don {7, 10, 16} — c1/c4/c5/c6 PASS (0 adjacence, 0 déficit, run max 2). */
export const PASSATION: readonly string[] = [
  "Q5.1-05",
  "Q5.1-15",
  "Q5.1-12",
  "Q5.1-09",
  "Q5.1-02",
  "Q5.1-04",
  "Q5.1-18",
  "Q5.1-03",
  "Q5.1-06",
  "Q5.1-16",
  "Q5.1-13",
  "Q5.1-11",
  "Q5.1-01",
  "Q5.1-08",
  "Q5.1-10",
  "Q5.1-17",
  "Q5.1-07",
  "Q5.1-14",
];

const PAR_CODE = new Map(ITEMS.map((i) => [i.code, i]));

/** Les 6 pivots mono (03 · 06 · 09 · 12 · 15 · 18 — le 3ᵉ item de chaque
 *  façon). Leur contribution recodée entre dans le score sous « pivot_… »
 *  (départage de la cascade en quasi-égalité — métadonnées moteur, jamais
 *  rendues : les dims du registre ne montrent que les six façons). */
const PIVOTS: ReadonlySet<string> = new Set([
  "Q5.1-03",
  "Q5.1-06",
  "Q5.1-09",
  "Q5.1-12",
  "Q5.1-15",
  "Q5.1-18",
]);

/** Le deck réel : les 18 items dans l'ordre gelé — aucune trame, aucun
 *  saut (5.1 n'héberge AUCUN signal ▲). */
export function deckQuete(): ItemsQuete51[] {
  return PASSATION.flatMap((c) => {
    const it = PAR_CODE.get(c);
    return it ? [{ code: it.code, text: it.text }] : [];
  });
}

/** Likert 1-5 → 0-1 (inversées recodées 6 − r — Arbitrage 1). */
function contribution(reponse: number, orient: 'D' | 'I'): number {
  return ((orient === 'D' ? reponse : 6 - reponse) - 1) / 4;
}

export interface Score51 {
  /** La passion — moyenne des 3 items de la façon (I recodés 6 − r),
   *  normalisée 0-1 (haut = la façon dominante chez toi). */
  passion: number;
  /** Le jeu — idem (haut = la façon dominante chez toi). */
  jeu: number;
  /** L'amitié devenue amour — idem (haut = la façon dominante chez toi). */
  amitie: number;
  /** Le pragmatisme — idem (haut = la façon dominante chez toi). */
  pragmatisme: number;
  /** L'intensité — idem (haut = la façon dominante chez toi). */
  intensite: number;
  /** Le don de soi — idem (haut = la façon dominante chez toi). */
  don: number;
  /** Signature d'index (contrat du registre : Record<string, number>) —
   *  y entrent aussi les contributions recodées des 6 pivots (clés
   *  « pivot_… » — moteur du départage, JAMAIS rendues). */
  [dim: string]: number;
}

/** Scorer du Livrable : six scores de style (moyennes des contributions
 *  recodées PAR FAÇON, normalisées 0-1) + les 6 pivots du départage —
 *  ils choisissent la variante (cartes.yaml). La matrice des façons
 *  (SIG-5.1-02) est moteur seul et n'entre ici en rien ; le pré-signal
 *  SIG-5.1-03 (intensité × JR1) est ATTENDU V12, non calculé. */
export function scorer(reponses: Record<string, number>): Score51 {
  const parFacon = new Map<string, { total: number; n: number }>();
  const pivots: Record<string, number> = {};
  for (const code of PASSATION) {
    const it = PAR_CODE.get(code);
    const r = it ? reponses[it.code] : undefined;
    if (it && typeof r === 'number' && r >= 1 && r <= 5) {
      const c = contribution(r, it.orient);
      const bloc = parFacon.get(it.dim) ?? { total: 0, n: 0 };
      bloc.total += c;
      bloc.n += 1;
      parFacon.set(it.dim, bloc);
      if (PIVOTS.has(it.code)) pivots[`pivot_${it.dim}`] = c;
    }
  }
  const facon = (dim: string): number => {
    const bloc = parFacon.get(dim);
    return bloc && bloc.n > 0 ? bloc.total / bloc.n : 0;
  };
  return {
    passion: facon('passion'),
    jeu: facon('jeu'),
    amitie: facon('amitie'),
    pragmatisme: facon('pragmatisme'),
    intensite: facon('intensite'),
    don: facon('don'),
    ...pivots,
  };
}

/** Les 7 variantes — ids VERBATIM (cartes.yaml) : les 6 façons + le profil
 *  égalitaire/mixte (étendue des six scores ≤ 0.10). */
export type VarianteId51 =
  | 'CARTE-5.1-FLAMME'
  | 'CARTE-5.1-PARTIE'
  | 'CARTE-5.1-ROUTE-LONGUE'
  | 'CARTE-5.1-BOUSSOLE'
  | 'CARTE-5.1-VIGIE'
  | 'CARTE-5.1-PORT'
  | 'CARTE-5.1-PALETTE';

/** La table des façons — carte du dominant et 1ʳᵉ position de passation
 *  (cascade SIG-5.1-01 ; 1ʳᵉs positions réelles du mélange 251427 :
 *  jeu 1 · intensité 2 · pragmatisme 3 · amitié 4 · passion 5 · don 7). */
const FACONS: readonly {
  dim: 'passion' | 'jeu' | 'amitie' | 'pragmatisme' | 'intensite' | 'don';
  carte: VarianteId51;
  pos1: number;
}[] = [
  { dim: 'passion', carte: 'CARTE-5.1-FLAMME', pos1: 5 },
  { dim: 'jeu', carte: 'CARTE-5.1-PARTIE', pos1: 1 },
  { dim: 'amitie', carte: 'CARTE-5.1-ROUTE-LONGUE', pos1: 4 },
  { dim: 'pragmatisme', carte: 'CARTE-5.1-BOUSSOLE', pos1: 3 },
  { dim: 'intensite', carte: 'CARTE-5.1-VIGIE', pos1: 2 },
  { dim: 'don', carte: 'CARTE-5.1-PORT', pos1: 7 },
];

/**
 * Sélecteur VERBATIM (07-miroir §0 + cartes.yaml — cascade SIG-5.1-01,
 * partition exclusive + exhaustive, C6) :
 *  1. étendue des six scores ≤ 0.10 → profil égalitaire/mixte (PALETTE) —
 *     « l'étendue prime sur la bande » ;
 *  2. sinon dominant = max des six → la carte rend le kit du dominant (kit
 *     unique par profil dominant — refonte) ;
 *  3. quasi-égalité (écart 1ᵉʳ-2ᵉ < 0.05) → départage par le pivot le
 *     mieux noté des deux façons, puis, à égalité exacte, par la 1ʳᵉ
 *     position de passation (la façon vue le plus tôt l'emporte —
 *     précédent 5.3/5.7) ;
 *  4. bande 0.10 : un secondaire à ≤ 0.10 du dominant se NOMME au rendu du
 *     miroir (slot S2, une phrase) — la carte reste celle du dominant,
 *     jamais un deuxième portrait.
 * Bornes 0.05 / 0.10 À VALIDER PAR LE COMITÉ (provisoires concepteur) :
 * métadonnées moteur, jamais affichées. La matrice des façons
 * (SIG-5.1-02) ne participe JAMAIS à la sélection ni au rendu ; le
 * pré-signal SIG-5.1-03 n'est pas calculé dans cette quête.
 */
export function choisirVariante(score: Score51): VarianteId51 {
  const six = FACONS.map((f) => ({
    dim: f.dim,
    carte: f.carte,
    pos1: f.pos1,
    v: typeof score[f.dim] === 'number' ? score[f.dim] : 0,
  }));
  const max = Math.max(...six.map((s) => s.v));
  const min = Math.min(...six.map((s) => s.v));
  if (max - min <= 0.1) return 'CARTE-5.1-PALETTE';
  const tries = [...six].sort((a, b) => b.v - a.v);
  let dominant = tries[0];
  const second = tries[1];
  if (dominant.v - second.v < 0.05) {
    const p1 = score[`pivot_${dominant.dim}`];
    const p2 = score[`pivot_${second.dim}`];
    if (typeof p1 === 'number' && typeof p2 === 'number' && p1 !== p2) {
      dominant = p1 > p2 ? dominant : second;
    } else {
      dominant = dominant.pos1 <= second.pos1 ? dominant : second;
    }
  }
  return dominant.carte;
}

export interface Carte {
  id: VarianteId51;
  nom: string;
  lumiere: string;
  ombre: string;
  tension: string;
}

/** Les 7 variantes de carte — verbatim (cartes.yaml, ordre du YAML :
 *  portrait → lumiere, tension_interieure → tension). NEUTRALITÉ
 *  TYPOLOGIQUE STRICTE : les six façons d'aimer se valent — l'ombre est
 *  dans l'EXCÈS en couple, jamais dans la nature (C4 — aucun superlatif,
 *  aucune façon dressée en idéal ou en défaut). Kit unique par profil
 *  dominant ; zéro nom d'atelier, zéro code, zéro degré au rendu. */
export const CARTES: Record<VarianteId51, Carte> = {
  "CARTE-5.1-FLAMME": {
    id: "CARTE-5.1-FLAMME",
    nom: "Le·La Flamme",
    lumiere:
      "Quand l'attirance frappe fort, tout le reste attend — tu l'as dit. La passion, chez toi, est un moteur. Une histoire qui t'embrase change ton tempo : le monde passe au second plan.",
    ombre:
      "Le feu ne brûle pas les mardis ordinaires. Le quotidien déçoit parfois, et l'autre peut se sentir en dessous face à quelqu'un qui vit en sommets. Le coût pour toi : confondre calme et fin du feu. Le coût pour l'autre : croire qu'un jour ordinaire ne suffit plus.",
    tension: "vivre les sommets sans lire les jours ordinaires comme des fins.",
  },
  "CARTE-5.1-PARTIE": {
    id: "CARTE-5.1-PARTIE",
    nom: "Le·La Partie",
    lumiere:
      "Garder un peu de jeu rend l'histoire plus vivante — tu l'as dit. Chez toi, aimer respire : la taquinerie, le pas de côté, la plaisanterie qui détend. Avec toi, les premières heures pèsent moins lourd.",
    ombre:
      "La légèreté se lit mal quand l'autre est sérieux. Une vraie question répondue par une blague reste une question. Le coût pour toi : passer pour absent alors que tu es là. Le coût pour l'autre : ne pas savoir où il en est, et cesser de demander.",
    tension: "garder la légèreté sans laisser les vraies questions sans réponse.",
  },
  "CARTE-5.1-ROUTE-LONGUE": {
    id: "CARTE-5.1-ROUTE-LONGUE",
    nom: "Le·La Route longue",
    lumiere:
      "Les meilleures histoires commencent par une amitié — tu l'as dit. Chez toi, l'amour grandit sans se presser : d'abord la conversation, puis la confiance, puis le reste. La durée est ta façon de dire les choses.",
    ombre:
      "L'amour qui tarde à se nommer se fait attendre. Le coût pour toi : un attachement profond lu comme de l'habitude. Le coût pour l'autre : douter de ce qui est déjà là, faute d'un mot.",
    tension: "laisser grandir sans laisser le mot attendre trop de saisons.",
  },
  "CARTE-5.1-BOUSSOLE": {
    id: "CARTE-5.1-BOUSSOLE",
    nom: "Le·La Boussole",
    lumiere:
      "L'amour tient quand les projets de vie collent — tu l'as dit. Chez toi, aimer, c'est bâtir : les horaires se rangent, l'argent se parle, les décisions se prennent à deux. Ce qui est décidé avec toi tient la route.",
    ombre:
      "La liste rassure et masque parfois la personne. Le coût pour toi : les rencontres sans case passent à côté — parfois les bonnes. Le coût pour l'autre : se sentir examiné plutôt que découvert.",
    tension: "garder tes repères en laissant la personne surprendre la liste.",
  },
  "CARTE-5.1-VIGIE": {
    id: "CARTE-5.1-VIGIE",
    nom: "Le·La Vigie",
    lumiere:
      "Ton attention ne dort pas — tu l'as dit à ta façon : des signes réguliers te mettent en paix. Quand tu aimes, tu remarques tout, et ta présence fait des abris.",
    ombre:
      "Ton équilibre voyage dans la poche de l'autre. Une réponse qui tarde gonfle des scénarios. Le coût pour toi : une paix qui dépend d'un horaire. Le coût pour l'autre : devenir gardien de ton calme, et fatiguer de ce rôle.",
    tension: "aimer fort en gardant ta paix chez toi, pas chez l'autre.",
  },
  "CARTE-5.1-PORT": {
    id: "CARTE-5.1-PORT",
    nom: "Le·La Port",
    lumiere:
      "Aimer, c'est d'abord prendre soin sans compter — tu l'as dit. Tu devines les besoins avant les mots, et tu déplaces tes priorités sans bruit. Prendre soin, chez toi, est un réflexe de première seconde.",
    ombre:
      "Donner sans retour vide le compte en silence. Le coût pour toi : une fatigue qui arrive après coup. Le coût pour l'autre : recevoir plus qu'il ne peut porter, et ne plus oser demander.",
    tension: "prendre soin des autres chaque jour sans oublier de recevoir à ton tour.",
  },
  "CARTE-5.1-PALETTE": {
    id: "CARTE-5.1-PALETTE",
    nom: "Le·La Palette",
    lumiere:
      "Aucune façon d'aimer n'a dominé chez toi — et c'est une réponse complète. La passion, le jeu, la durée, les projets, l'attention, le don : tu passes d'une main à l'autre selon la saison.",
    ombre:
      "Ta souplesse se lit mal de dehors. Une semaine passionnée, une semaine posée : l'autre peut y lire une inconstance qui n'en est pas une. Le coût pour toi : réexpliquer ce que tu vis simplement. Le coût pour l'autre : prévoir mal tes saisons.",
    tension: "dire un mot de ta saison du moment — la règle se devine mal.",
  },
};

/** Textes du briefing — annonce VERBATIM (05-ecran-d-intro, 2 phrases), puces
 *  en couche app (ton Task 35 ; premium [6] : aucune présupposition des
 *  mondes gratuits, zéro teaser, neutralité typologique). */
export const BRIEFING = {
  annonce:
    "Il existe plusieurs façons d'aimer — six, dit la recherche, et toi tu en habites probablement une ou deux. Réponds avec ce qui se passe vraiment en toi, pas avec ce que tu voudrais que ça fasse.",
  aQuoiCaSert: [
    "La première quête de ton cœur : les façons d'aimer que tu habites le plus, racontées sans classement.",
    "Dix-huit affirmations traversent six façons : la passion, le jeu, l'amitié devenue amour, le pragmatisme, l'intensité, le don de soi.",
    "Les six façons se valent : une façon se décrit, elle ne se note pas.",
    "À la fin, une carte en images — avec ta lumière, ton ombre en couple et ta tension.",
  ],
  resultats: [
    "Ta carte — ta lumière, ta zone d'ombre et ta tension du moment, en quelques mots.",
    "Six barres — une par façon d'aimer, telles que tu as répondu aujourd'hui.",
    "Ta nuance : si une seconde façon te ressemble presque autant, elle se raconte aussi.",
    "Une pierre de plus dans ton portrait de cœur — le voyage s'en nourrit.",
  ],
};

/** Textes de la fenêtre de complétion (carte) — entête (5.1), labels
 *  verbatim (cartes.yaml), fenêtre F1 verbatim (préfixe « F1 : » non rendu
 *  — convention 2.x), miroirNote en couche app. */
export const COMPLETION = {
  entete: "💗 QUÊTE ACCOMPLIE — « Ton style amoureux »",
  labelOmbre: "Ta zone d'ombre :",
  labelTension: "Ta tension intérieure :",
  fenetre:
    "Quelque part, quelqu'un aime avec d'autres façons — la rencontre, c'est justement la traduction.",
  miroirNote:
    "Ton miroir — la lecture complète de ta façon d'aimer — arrive à la prochaine étape du voyage.",
};

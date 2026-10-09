/**
 * Quête 3.2 « Ton quotidien » — Monde 4 « Ton Terrain ».
 *
 * Contenu FIDÈLE au Livrable M4-3.2-Ton-Quotidien (mission V9.B) :
 *  - ITEMS : les 8 items Likert verbatim (01-tableau-des-items, ordre du
 *    tableau) — 2 axes : planification (5 items : les sorties 01-02, le fil
 *    de la journée 03-04, le pivot des rendez-vous notés 05) et ordre
 *    domestique (3 items : la place des choses 06-07, le pivot du seuil de
 *    tolérance 08). Échelle Likert 5 (Arbitrage 2) ; les inversées (02 · 04
 *    · 07 · 08) sont recodées 6 − r (Arbitrage 1) — le recodage place les
 *    deux bouts sur le même axe sans hiérarchiser ;
 *  - paires miroir R6 : 3 paires complètes (01×02 · 03×04 · 06×07) + 2
 *    pivots mono (05 · 08) — l'arithmétique 5/3 rend la couverture R6
 *    intégrale impossible sans rompre le cadrage mission ; écart documenté
 *    au 01 du Livrable, À VALIDER PAR LE COMITÉ (précédents 2.2 et 3.1).
 *    Les pivots reposent sur la cohérence d'axe + le temps de réponse QFI
 *    (fiche computation 06) ;
 *  - AUCUNE trame ▲ : quête déclarative directe, déguisement impossible
 *    (n_trames = 0 au registre du mélange — c2/c3 sans objet de fait) ;
 *  - PASSATION : l'ordre de passation GELÉ — mélange graine 232427
 *    (210427 + 1000 × ordinal 22, convention concaténée mission V9), outil
 *    DÉDIÉ melange-biaxes.py. ⚠ COLLISION MAÎTRISÉE : 232427 = ancienne
 *    graine RETIRÉE de 2.2 (re-tirée 222427 en V8) — réutilisation PERMISE
 *    avec note de provenance, jamais de collision avec une graine ACTIVE ;
 *    c1/c4 « PASS par DÉCLARATION sans-objet » (arithmétique 5/3 forcée :
 *    1 adjacence planification-planification pos 5×6 = 01×04, minimum
 *    constructible ; déficit c4 = 6) — la séquence est gelée TELLE QUELLE,
 *    rien à « réparer » ; run max 1 ; 5 passes identiques. Le 1ᵉʳ item vu
 *    est Q3.2-03, le dernier Q3.2-02 — JAMAIS l'ordre des codes ;
 *  - scorer : deux axes déclarés normalisés 0-1 — PLAN_D (planification,
 *    Q3.2-01 → 05, I recodés — haut = planificateur) et ORDRE_D (ordre
 *    domestique, Q3.2-06 → 08, I recodés — haut = ordonné). L'UNITÉ DES
 *    SEUILS du cartes.yaml est déjà 0-1 (déviations 0.15 · bornes 0.65 /
 *    0.35) : contrairement à 2.1, aucune conversion — scoresBruts renvoie
 *    les axes directement dans l'unité des seuils, et le scorer EXPOSÉ
 *    (contrat app, normalisation 0-1) livre les mêmes valeurs. EC_PLAN =
 *    |PLAN_A − PLAN_B| et EC_ORDRE = |ORDRE_A − ORDRE_B| (SIG-3.2-02, la
 *    friction domestique — signal conversationnel « à aborder tôt », seuil
 *    proposé > 0.30) : MOTEUR SEUL, calculés entre deux profils hors de ce
 *    module ; ils ne participent JAMAIS à la sélection (non_participant),
 *    jamais une pénalité dure, jamais une élimination, jamais l'écart
 *    calculé rendu à un membre ;
 *  - choisirVariante : les sélecteurs VERBATIM (cartes.yaml selection,
 *    SIG-3.2-01) — dP = |PLAN_D − 0.5|, dO = |ORDRE_D − 0.5| ; max(dP, dO)
 *    ≤ 0.15 → central (CARTE-3.2-MAREE) ; sinon les 4 quadrants (conditions
 *    verbatim ordre_selecteur 1 → 4), puis l'opérationnalisation de « l'axe
 *    le plus dévié choisit le quadrant » pour la zone intermédiaire
 *    qu'aucune condition stricte ne couvre (au moins un axe dans la bande
 *    centrale 0.35-0.65) : chaque axe penche du côté où il se trouve
 *    relativement à 0.5 (borne 0.5 comprise côté haut — convention
 *    déterministe, À VALIDER PAR LE COMITÉ comme les autres bornes FM-019).
 *    Départage dP = dO : « l'axe ordre tranche » (le domestique se vit plus
 *    souvent que l'agenda) — règle de lecture du profil ; dans cette
 *    implémentation les deux côtés se lisent sur leurs axes respectifs,
 *    l'égalité stricte ne survient que dans la zone déjà tranchée par les
 *    conditions verbatim. Partition exclusive + exhaustive du carré [0,1]²
 *    (C6, 5 sélections) ; bornes FM-019 ADOPTÉES comme valeurs de départ
 *    (provisoires concepteur — re-signature professionnelle avant bêta),
 *    métadonnées moteur jamais affichées ;
 *  - CARTES : les 5 variantes verbatim (cartes.yaml — portrait → lumiere,
 *    tension_interieure → tension). L'id CARTE-3.2-SANS-BUSSOLE (sans
 *    accent, historique) ne correspond pas au nom rendu « Le·La Porte qui
 *    suit le vent » : l'ID est copié VERBATIM (clé de données), jamais
 *    corrigé.
 *
 * Règles de rendu (C2/C3 + doctrine du Livrable) : aucun code, score,
 * sigle, seuil ou graine ne franchit le rendu (PLAN_D, ORDRE_D, EC_PLAN,
 * EC_ORDRE, SIG-3.2-01/02, les quadrants restent moteur — le rendu parle du
 * programme, du fil des choses, de la place) ; ZÉRO vocabulaire clinique ;
 * le mot « bordel » (Q3.2-08) est assumé dans l'ITEM seul (la réponse
 * exacte de la personne) — il ne se rend JAMAIS sur les cartes ni les
 * écrans (jugement interdit, verrou 04 n° 5) ; neutralité des styles : le
 * planificateur n'est pas « rigide », l'improvisateur pas « léger »,
 * l'ordonné pas « maniaque », le désordonné pas « bordélique-paresseux »,
 * le central pas « mou » ; le désordre chronique est un fonctionnement, pas
 * de la paresse (leçon refonte gravée) ; registre probabiliste.
 *
 * Typo : apostrophe ASCII uniquement, pas d'insécable, guillemets français.
 */

import { avecEN } from '../i18n/apply';
import * as EN_Q32 from '../i18n/content/en/quete-3-2';

export interface QueteItem32 {
  code: string;
  text: string;
  /** 'D' = directe, 'I' = inversée (recodée 6 − r). */
  orient: 'D' | 'I';
  /** L'axe verbatim du Livrable (01-tableau-des-items, colonne Axe). */
  dim: string;
}

/** L'objet de passation affiché — code + énoncé (l'orientation reste côté moteur). */
export interface ItemsQuete32 {
  code: string;
  text: string;
}

/** Les 8 items Likert — verbatim (01-tableau-des-items, ordre du tableau).
 *  2 axes : planification (01 → 05) · ordre domestique (06 → 08). */
const ITEMS_FR: readonly QueteItem32[] = [
  {
    code: "Q3.2-01",
    text: "Les sorties se décident chez moi plusieurs jours à l'avance.",
    orient: "D",
    dim: "planification",
  },
  {
    code: "Q3.2-02",
    text: "Les sorties se décident chez moi au moment de partir.",
    orient: "I",
    dim: "planification",
  },
  {
    code: "Q3.2-03",
    text: "Mes journées suivent un plan que je peux nommer.",
    orient: "D",
    dim: "planification",
  },
  {
    code: "Q3.2-04",
    text: "Mes journées suivent le fil de ce qui arrive.",
    orient: "I",
    dim: "planification",
  },
  {
    code: "Q3.2-05",
    text: "Mes rendez-vous importants sont notés, heure par heure.",
    orient: "D",
    dim: "planification",
  },
  {
    code: "Q3.2-06",
    text: "Chez moi, chaque chose finit par retrouver sa place.",
    orient: "D",
    dim: "ordre",
  },
  {
    code: "Q3.2-07",
    text: "Chez moi, les choses vivent là où elles tombent.",
    orient: "I",
    dim: "ordre",
  },
  {
    code: "Q3.2-08",
    text: "Un bordel visible chez moi ne me dérange pas.",
    orient: "I",
    dim: "ordre",
  },
];
export const ITEMS = avecEN(ITEMS_FR, EN_Q32.ITEMS);

/** Ordre de passation GELÉ — mélange graine 232427, outil DÉDIÉ
 *  melange-biaxes.py (8 positions, aucune trame ▲ ; 1 adjacence forcée
 *  pos 5×6 : 01×04 — minimum constructible, déficit c4 = 6 ; run max 1 ;
 *  5 passes identiques ; le 1ᵉʳ item vu est Q3.2-03, le dernier Q3.2-02). */
export const PASSATION: readonly string[] = [
  "Q3.2-03",
  "Q3.2-08",
  "Q3.2-05",
  "Q3.2-07",
  "Q3.2-01",
  "Q3.2-04",
  "Q3.2-06",
  "Q3.2-02",
];

const PAR_CODE = new Map(ITEMS.map((i) => [i.code, i]));

/** Le deck réel : les 8 items dans l'ordre gelé — aucune trame n'existe ici. */
export function deckQuete(): ItemsQuete32[] {
  return PASSATION.flatMap((c) => {
    const it = PAR_CODE.get(c);
    return it ? [{ code: it.code, text: it.text }] : [];
  });
}

/** Recodage Likert d'un item — les inversées comptent 6 − r (Arbitrage 1). */
function recode(reponse: number, orient: 'D' | 'I'): number {
  return orient === 'D' ? reponse : 6 - reponse;
}

/** Les deux axes du scorer (ID moteur — jamais rendus, C3). */
type AxeId32 = 'PLAN_D' | 'ORDRE_D';

/** Axe verbatim (tableau 01) → clé du score d'axe. */
const AXE_PAR_DIM: Record<string, AxeId32> = {
  planification: 'PLAN_D',
  ordre: 'ORDRE_D',
};

/** Moyenne recodée normalisée 0-1 par axe (contribution (r − 1) / 4 —
 *  une moyenne Likert recodée donne la même valeur que la moyenne des
 *  contributions ; les seuils du cartes.yaml portent sur cette échelle 0-1).
 *  Un axe sans aucune réponse valide → 0 (hors passe — la passation fournit
 *  les 8 réponses). */
function calculeAxes(reponses: Record<string, number>): {
  brut: Record<AxeId32, number>;
  valide: Record<AxeId32, boolean>;
} {
  const totals: Record<AxeId32, number> = { PLAN_D: 0, ORDRE_D: 0 };
  const ns: Record<AxeId32, number> = { PLAN_D: 0, ORDRE_D: 0 };
  for (const code of PASSATION) {
    const it = PAR_CODE.get(code);
    const r = it ? reponses[it.code] : undefined;
    if (!it || typeof r !== 'number' || r < 1 || r > 5) continue;
    const axe = AXE_PAR_DIM[it.dim];
    if (!axe) continue;
    totals[axe] += (recode(r, it.orient) - 1) / 4;
    ns[axe] += 1;
  }
  const brut = { PLAN_D: 0, ORDRE_D: 0 } as Record<AxeId32, number>;
  const valide = { PLAN_D: false, ORDRE_D: false } as Record<AxeId32, boolean>;
  for (const axe of ['PLAN_D', 'ORDRE_D'] as AxeId32[]) {
    if (ns[axe] > 0) {
      brut[axe] = totals[axe] / ns[axe];
      valide[axe] = true;
    }
  }
  return { brut, valide };
}

/** Les 2 axes en unité des SEUILS du cartes.yaml — l'échelle est déjà
 *  normalisée 0-1 (déviations 0.15 · bornes 0.65 / 0.35), donc les valeurs
 *  brutes SONT l'unité des seuils (contrairement à 2.1, aucune conversion). */
export interface Bruts32 {
  PLAN_D: number;
  ORDRE_D: number;
}

/** scoresBruts : PLAN_D (planification déclarée — haut = planificateur) et
 *  ORDRE_D (ordre domestique déclaré — haut = ordonné), normalisés 0-1.
 *  Les trames n'existent pas ; les écarts à l'autre (EC_PLAN, EC_ORDRE) se
 *  calculent entre deux profils, hors de ce module — moteur seul. */
export function scoresBruts(reponses: Record<string, number>): Bruts32 {
  return calculeAxes(reponses).brut;
}

export interface Score32 {
  PLAN_D: number;
  ORDRE_D: number;
  [k: string]: number;
}

/** Scorer EXPOSÉ (contrat app) : les 2 axes NORMALISÉS 0-1 — la
 *  normalisation demandée au contrat est déjà celle du calcul (voir
 *  calculeAxes). Axe sans aucune réponse valide → 0. */
export function scorer(reponses: Record<string, number>): Score32 {
  const { brut } = calculeAxes(reponses);
  return {
    PLAN_D: brut.PLAN_D,
    ORDRE_D: brut.ORDRE_D,
  };
}

/** Les 5 ids de carte — verbatim (cartes.yaml, ordre du YAML). ⚠
 *  CARTE-3.2-SANS-BUSSOLE sans accent : id historique copié TEL QUEL. */
export type VarianteId32 =
  | 'CARTE-3.2-HORLOGE'
  | 'CARTE-3.2-CALEPIN'
  | 'CARTE-3.2-SANS-BUSSOLE'
  | 'CARTE-3.2-VENT'
  | 'CARTE-3.2-MAREE';

/**
 * Sélecteurs VERBATIM (cartes.yaml selection + SIG-3.2-01), évalués dans
 * l'ordre du YAML (ordre_selecteur) :
 *  1. central : max(dP, dO) ≤ 0.15 → l'entre-deux « selon les jours »
 *     (condition verbatim ordre_selecteur 5) ;
 *  2. les 4 quadrants — conditions verbatim 1 → 4 (planificateur×ordonné ·
 *     planificateur×désordonné · improvisateur×ordonné · improvisateur×
 *     désordonné, bornes strictes 0.65 / 0.35) ;
 *  3. zone intermédiaire (au moins un axe dans la bande centrale 0.35-0.65,
 *     qu'aucune condition stricte ne couvre) : opérationnalisation de «
 *     l'axe le plus dévié choisit le quadrant » — chaque axe penche du côté
 *     où il se trouve relativement à 0.5 (borne 0.5 comprise côté haut,
 *     convention déterministe — À VALIDER PAR LE COMITÉ, bornes FM-019).
 *     Les conditions strictes de l'étape 2 sont la restriction de cette
 *     lecture aux deux axes hors bande — l'extension rend la partition du
 *     carré [0,1]² totale (C6, exhaustivite du YAML).
 * Borne inclusive du central : les valeurs d'axe sont des multiples de 1/20
 * (PLAN_D) et 1/12 (ORDRE_D) — 0.65 = 13/20 est ATTEIGNABLE et doit rester
 * dans le carré central (dP ≤ 0.15 en arithmétique exacte) ; une tolérance
 * machine de 1e-9 honore l'inclusivité du YAML sans rapprocher deux valeurs
 * distinctes (écart minimal réel ≥ 1/60 ≈ 0.017).
 * Départage dP = dO : « l'axe ordre tranche (le domestique se vit plus
 * souvent que l'agenda) » — règle de lecture du Livrable ; les deux côtés
 * se lisant ici sur leurs axes respectifs, l'égalité stricte ne survient
 * que dans la zone déjà tranchée par les conditions verbatim (conservée
 * comme lecture du profil, jamais rendue). Conditions et seuils restent
 * côté moteur, jamais affichés ; EC_PLAN / EC_ORDRE ne participent JAMAIS
 * à la sélection (non_participant — friction conversationnelle moteur seul).
 */
export function choisirVariante(score: Score32): VarianteId32 {
  const plan = typeof score.PLAN_D === 'number' ? score.PLAN_D : 0;
  const ordre = typeof score.ORDRE_D === 'number' ? score.ORDRE_D : 0;
  const dP = Math.abs(plan - 0.5);
  const dO = Math.abs(ordre - 0.5);
  // 1. central — condition verbatim (ordre_selecteur 5). Tolérance machine
  //    pour la borne INCLUSIVE ≤ 0.15 (0.65 − 0.5 = 13/20 − 1/2 tombe à
  //    0.15000000000000002 en IEEE754 — voir docstring ci-dessus).
  if (Math.max(dP, dO) <= 0.15 + 1e-9) return 'CARTE-3.2-MAREE';
  // 2. les 4 quadrants — conditions verbatim (ordre_selecteur 1 → 4).
  if (plan > 0.65 && ordre > 0.65) return 'CARTE-3.2-HORLOGE';
  if (plan > 0.65 && ordre < 0.35) return 'CARTE-3.2-CALEPIN';
  if (plan < 0.35 && ordre > 0.65) return 'CARTE-3.2-SANS-BUSSOLE';
  if (plan < 0.35 && ordre < 0.35) return 'CARTE-3.2-VENT';
  // 3. zone intermédiaire — « l'axe le plus dévié choisit le quadrant » :
  //    côtés relativement à 0.5 (borne 0.5 comprise côté haut).
  const planHaut = plan >= 0.5;
  const ordreHaut = ordre >= 0.5;
  if (planHaut && ordreHaut) return 'CARTE-3.2-HORLOGE';
  if (planHaut && !ordreHaut) return 'CARTE-3.2-CALEPIN';
  if (!planHaut && ordreHaut) return 'CARTE-3.2-SANS-BUSSOLE';
  return 'CARTE-3.2-VENT';
}

export interface Carte {
  id: VarianteId32;
  nom: string;
  lumiere: string;
  ombre: string;
  tension: string;
}

/** Les 5 variantes de carte — verbatim (cartes.yaml, ordre du YAML ;
 *  portrait → lumiere · ombre · tension_interieure → tension). Sélection :
 *  4 quadrants + central (partition totale du carré — C6). Les 5 quotidiens
 *  se valent : le désordre est un fonctionnement, l'ordre jamais une
 *  rigidité au rendu ; le mot « bordel » (item 08) ne se rend PAS sur les
 *  cartes (jugement interdit) ; aucun code ni sigle au rendu. */
export const CARTES: Record<VarianteId32, Carte> = {
  'CARTE-3.2-HORLOGE': {
    id: 'CARTE-3.2-HORLOGE',
    nom: 'Le·La Cadran bien réglé',
    lumiere:
      "Ton quotidien tourne à l'heure : des journées qui se nomment d'avance, une maison où chaque chose a sa place. Tu rends la vie lisible — et cette fiabilité-là, les gens la sentent en entrant chez toi.",
    ombre:
      "Ta mécanique ne partage pas toute seule. Qui vit avec toi entre dans un programme qu'il n'a pas écrit — la case vide se nomme à deux.",
    tension:
      "garder ton cadran, en laissant à quelqu'un la ligne qui le décale un peu.",
  },
  'CARTE-3.2-CALEPIN': {
    id: 'CARTE-3.2-CALEPIN',
    nom: 'Le·La Calépin et le flot',
    lumiere:
      "Ton dehors est cadré, ton dedans vit à son rythme : les rendez-vous notés, les choses où elles tombent. Deux systèmes distincts qui fonctionnent — tu planifies le monde sans te tenir le frigo à l'œil.",
    ombre:
      "Le mélange déroute : ton seuil de tolérance n'est pas celui de tout le monde. Ce qui chez toi n'est pas un problème se lit ailleurs comme un signal.",
    tension:
      "assumer ton flot intérieur, en nommant à deux ce qui se tolère et ce qui se range.",
  },
  'CARTE-3.2-SANS-BUSSOLE': {
    id: 'CARTE-3.2-SANS-BUSSOLE',
    nom: 'Le·La Porte qui suit le vent',
    lumiere:
      "Ta journée suit le fil de ce qui arrive, et ta maison tient ses places : un calme sans programme. Tu accueilles l'imprévu sans rien laisser déborder — une souplesse qui a de la tenue.",
    ombre:
      "Ton oui d'un jour se découvre en marchant. Qui compte sur toi prépare deux fois ce que tu décides une fois — les grandes lignes réclament un mot d'avance.",
    tension:
      "suivre le fil, en posant deux ou trois jalons que les autres peuvent lire.",
  },
  'CARTE-3.2-VENT': {
    id: 'CARTE-3.2-VENT',
    nom: 'Le·La Voile au vent',
    lumiere:
      "Tu vis au fil : les jours se dessinent en marchant, les choses restent où la vie les pose. Ton présent a de la place — c'est une façon entière d'habiter le quotidien, et elle désamorce bien des tempêtes.",
    ombre:
      "Sans minimum tenu, les charges invisibles s'accumulent : le frigo, le rendez-vous, le linge. Un plancher à deux évite que le fil les oublie.",
    tension:
      "garder ta liberté du fil, en tenant un plancher qui tient à deux.",
  },
  'CARTE-3.2-MAREE': {
    id: 'CARTE-3.2-MAREE',
    nom: 'Le·La Marée des jours',
    lumiere:
      "Ton quotidien ne vote ni programme ni fil : selon les saisons, tu planifies ou tu improvises, tu ranges ou tu laisses vivre. Cette aisance à changer de mode sans le payer est plus rare qu'elle n'y paraît.",
    ombre:
      "Ta flexibilité se lit dehors, pas dedans. Qui vit avec toi cherche ta règle du jour — ton mode s'annonce, il ne se devine pas.",
    tension:
      "rester souple, en donnant un mot d'avance sur ton mode du jour.",
  },
};

/** Textes du briefing — annonce VERBATIM (05-ecran-d-intro, 2 phrases), puces
 *  en couche app (ton Task 35, neutralité des styles : les 5 quotidiens se
 *  valent — « il n'y a pas de bonne façon »). */
export const BRIEFING = {
  annonce:
    "Les grandes choses se décident à deux. Le quotidien, lui, se vit tous les jours. Dis-nous comment le tien tourne — il n'y a pas de bonne façon.",
  aQuoiCaSert: [
    "C'est la quête du terrain : la façon dont tes journées et ta maison tournent, hors des grands événements.",
    'Huit affirmations regardent deux choses : le programme de tes jours, la place des choses chez toi.',
    'Pas de bonne façon de tenir un quotidien — planifier ou improviser, ranger ou laisser vivre : des façons égales.',
    'Il en sort une carte, et une pierre de plus dans ton portrait.',
  ],
  resultats: [
    "Ta carte — ta lumière, ta zone d'ombre et ta tension du moment, en quelques mots.",
    'Ton quotidien — deux barres : le programme de tes jours et la place des choses.',
    "Une pierre de plus dans ton portrait — la suite du voyage s'en nourrit.",
  ],
};

/** Textes de la fenêtre de complétion (carte) — entête, labels et fenêtre F1
 *  verbatim (cartes.yaml), miroirNote en couche app. */
export const COMPLETION = {
  entete: '🏡 QUÊTE ACCOMPLIE — « Ton quotidien »',
  labelOmbre: "Ta zone d'ombre :",
  labelTension: 'Ta tension intérieure :',
  fenetre:
    "Quelque part, quelqu'un répond à ces mêmes questions. Le jour où vos cartes se croiseront, elles auront beaucoup à se dire.",
  miroirNote:
    'Ton miroir — la lecture complète de ton quotidien — arrive à la prochaine étape du voyage.',
};

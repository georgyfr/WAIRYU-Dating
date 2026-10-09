/**
 * Quête 3.5 « Ton entourage » — Monde 4 « Ton Terrain ».
 *
 * Contenu FIDÈLE au Livrable M4-3.5-Ton-Entourage (mission V9.E) :
 *  - ITEMS : les 6 items Likert verbatim (01-tableau-des-items, ordre du
 *    tableau) — 3 angles × (1 direct + 1 inversé), paires miroir R6 : les
 *    décisions de couple (01-02) · la famille et le/la partenaire (03-04) ·
 *    les amis et les week-ends (05-06). Couverture R6 INTÉGRALE — la seule
 *    quête M4 avec les 3 paires complètes (aucun écart d'arithmétique, quête
 *    gabarit de la série) ;
 *  - échelle Likert 5 (Arbitrage 2) ; les inversées sont recodées 6 − r
 *    (Arbitrage 1) — le recodage place les deux bouts sur le même axe sans
 *    hiérarchiser : fusionnel et indépendant = deux façons ÉGALES d'habiter
 *    un entourage (la différenciation n'est pas l'indépendance — c'est la
 *    liberté de la distance choisie, dans les deux sens) ;
 *  - AUCUNE trame ▲ : quête déclarative directe, déguisement impossible
 *    (n_trames = 0 au registre du mélange — c2/c3 sans objet de fait) ;
 *  - PASSATION : l'ordre de passation GELÉ — mélange graine 235427 (210427 +
 *    1000 × ordinal 25, convention concaténée mission V9) : 03 · 06 · 01 ·
 *    04 · 05 · 02 (objectif totalement nul, run max 1, 5 passes identiques).
 *    Le 1ᵉʳ item vu est Q3.5-03 (la porte ouverte), le dernier Q3.5-02 (le
 *    couple souverain) — JAMAIS l'ordre des codes ;
 *  - scorer : ENTOUR_D = poids de l'entourage déclaré — moyenne des 6 items
 *    (I recodés 6 − r), normalisée 0-1 (haut = fusionnel, bas = indépendant).
 *    EC_ENTOUR = |ENTOUR_A − ENTOUR_B| (la friction des entourages, seuil
 *    proposé > 0.30 — À VALIDER PAR LE COMITÉ) est un mécanisme MOTEUR SEUL,
 *    calculé entre deux profils en dehors de cette quête : il ne participe
 *    JAMAIS à la sélection de carte (cartes.yaml non_participant), jamais une
 *    pénalité, jamais une élimination, jamais rendu à un membre ;
 *  - choisirVariante : les sélecteurs VERBATIM (cartes.yaml selection) —
 *    ENTOUR_D > 0.65 → fusionnel (la table élargie) · 0.35-0.65 → équilibre
 *    (le milieu du gué) · < 0.35 → indépendant (le tête-à-tête gardé),
 *    évalués dans l'ordre_selecteur 1 → 3, déterministes. Partition
 *    exclusive + exhaustive de [0,1] (C6). Bornes FM-019 ADOPTÉES comme
 *    valeurs de départ (provisoires concepteur — re-signature professionnelle
 *    avant bêta), métadonnées moteur jamais affichées ;
 *  - CARTES : les 3 variantes verbatim (cartes.yaml — portrait → lumiere,
 *    tension_interieure → tension).
 *
 * Règles de rendu (C2/C3 + doctrine du Livrable) : aucun code, score, sigle,
 * seuil ou graine ne franchit le rendu (ENTOUR_D, EC_ENTOUR, SIG-3.5-01/02
 * restent moteur) ; les concepts publics (différenciation, homogamie sociale)
 * et leur usage moteur « en douceur » restent moteur — le rendu parle de
 * places, jamais de degrés de maturité. ZÉRO PERSONNE NOMMÉE : la famille se
 * parle en situations (la fête, le dimanche, l'appel, la chaise), jamais en
 * personnages (pas de belle-mère, pas de famille idéale) — aucune personne
 * réelle identifiable nulle part. Neutralité absolue : le fusionnel n'est pas
 * « collé », l'indépendant pas « distant », l'équilibre pas « tiède » (trois
 * jugements interdits au rendu). Registre probabiliste : jamais un futur
 * certain sur les familles.
 *
 * Typo : apostrophe ASCII uniquement, pas d'insécable, guillemets français.
 */

import { avecEN } from '../i18n/apply';
import * as EN_Q35 from '../i18n/content/en/quete-3-5';

export interface QueteItem35 {
  code: string;
  text: string;
  /** 'D' = directe, 'I' = inversée (recodée 6 − r). */
  orient: 'D' | 'I';
  /** L'angle verbatim du Livrable (01-tableau-des-items, colonne Angle). */
  dim: string;
}

/** L'objet de passation affiché — code + énoncé (l'orientation reste côté moteur). */
export interface ItemsQuete35 {
  code: string;
  text: string;
}

/** Les 6 items Likert — verbatim (01-tableau-des-items, ordre du tableau).
 *  Orientation conforme à la config CI (D impairs · I pairs). */
const ITEMS_FR: readonly QueteItem35[] = [
  {
    code: "Q3.5-01",
    text: "Mes parents comptent dans mes grandes décisions de couple.",
    orient: "D",
    dim: "les décisions de couple",
  },
  {
    code: "Q3.5-02",
    text: "Mes grandes décisions de couple se prennent entre nous deux.",
    orient: "I",
    dim: "les décisions de couple",
  },
  {
    code: "Q3.5-03",
    text: "Ma vie de couple se vit aussi dans ma famille.",
    orient: "D",
    dim: "la famille et le/la partenaire",
  },
  {
    code: "Q3.5-04",
    text: "Ma famille et ma vie de couple, chacun son territoire.",
    orient: "I",
    dim: "la famille et le/la partenaire",
  },
  {
    code: "Q3.5-05",
    text: "Mes week-ends accueillent volontiers le cercle des amis.",
    orient: "D",
    dim: "les amis et les week-ends",
  },
  {
    code: "Q3.5-06",
    text: "Mes week-ends, je les garde pour nous deux.",
    orient: "I",
    dim: "les amis et les week-ends",
  },
];
export const ITEMS = avecEN(ITEMS_FR, EN_Q35.ITEMS);

/** Ordre de passation GELÉ — mélange graine 235427 (6 positions, aucune
 *  trame ▲ ; le 1ᵉʳ item vu est Q3.5-03, le dernier Q3.5-02). */
export const PASSATION: readonly string[] = [
  "Q3.5-03",
  "Q3.5-06",
  "Q3.5-01",
  "Q3.5-04",
  "Q3.5-05",
  "Q3.5-02",
];

const PAR_CODE = new Map(ITEMS.map((i) => [i.code, i]));

/** Le deck réel : les 6 items dans l'ordre gelé — aucune trame n'existe ici. */
export function deckQuete(): ItemsQuete35[] {
  return PASSATION.flatMap((c) => {
    const it = PAR_CODE.get(c);
    return it ? [{ code: it.code, text: it.text }] : [];
  });
}

/** Likert 1-5 → 0-1 (inversées recodées 6 − r). */
function contribution(reponse: number, orient: 'D' | 'I'): number {
  return ((orient === 'D' ? reponse : 6 - reponse) - 1) / 4;
}

export interface Bruts35 {
  /** ENTOUR_D — poids de l'entourage déclaré, en unité des seuils (0-1). */
  entour: number;
}

export interface Score35 {
  entour: number;
  [k: string]: number;
}

/** Moyenne recodée des items renseignés, NORMALISÉE 0-1 — l'unité des seuils
 *  du cartes.yaml (bornes 0.35 / 0.65). Une moyenne Likert 1-5 recodée donne
 *  la même valeur que la moyenne des contributions ((r − 1) / 4). Quête sans
 *  aucune réponse renseignée → 0 (hors passe — la passation fournit les 6). */
export function scoresBruts(reponses: Record<string, number>): Bruts35 {
  let total = 0;
  let n = 0;
  for (const code of PASSATION) {
    const it = PAR_CODE.get(code);
    const r = it ? reponses[it.code] : undefined;
    if (!it || typeof r !== 'number' || r < 1 || r > 5) continue;
    total += contribution(r, it.orient);
    n += 1;
  }
  return { entour: n > 0 ? total / n : 0 };
}

/** Scorer EXPOSÉ (contrat app) : ENTOUR_D normalisé 0-1 — haut = fusionnel,
 *  bas = indépendant. EC_ENTOUR (écart entre deux profils, friction
 *  conversationnelle « à aborder tôt ») se calcule AILLEURS, moteur seul :
 *  il n'entre ni ici, ni dans la sélection. */
export function scorer(reponses: Record<string, number>): Score35 {
  return { entour: scoresBruts(reponses).entour };
}

/** Les 3 ids de carte — verbatim (cartes.yaml, ordre du YAML). */
export type VarianteId35 =
  | 'CARTE-3.5-TABLE-ELARGIE'
  | 'CARTE-3.5-DEUX-RIVES'
  | 'CARTE-3.5-TERRITOIRE';

/**
 * Sélecteurs VERBATIM (cartes.yaml `selection`, ordre_selecteur 1 → 3) :
 * ENTOUR_D > 0.65 → la table élargie (fusionnel) · 0.35-0.65 → le milieu du
 * gué (équilibre) · < 0.35 → le tête-à-tête gardé (indépendant). Partition
 * exclusive + exhaustive de [0,1] (C6) — bornes FM-019, provisoires
 * concepteur, côté moteur et jamais affichées. L'écart à l'autre
 * (EC_ENTOUR, friction conversationnelle) ne participe JAMAIS à la
 * sélection (cartes.yaml `non_participant`).
 */
export function choisirVariante(score: Score35): VarianteId35 {
  const s = typeof score.entour === 'number' ? score.entour : 0;
  return s > 0.65
    ? 'CARTE-3.5-TABLE-ELARGIE'
    : s >= 0.35
      ? 'CARTE-3.5-DEUX-RIVES'
      : 'CARTE-3.5-TERRITOIRE';
}

export interface Carte {
  id: VarianteId35;
  nom: string;
  lumiere: string;
  ombre: string;
  tension: string;
}

/** Les 3 variantes de carte — verbatim (cartes.yaml, ordre du YAML ;
 *  portrait → lumiere · ombre · tension_interieure → tension). NEUTRALITÉ
 *  ABSOLUE : les trois places se valent — le fusionnel jamais « collé »,
 *  l'indépendant jamais « distant », l'équilibre jamais « tiède » ; zéro
 *  personne nommée (la chaise, les fêtes, les dimanches — jamais un
 *  personnage). */
export const CARTES: Record<VarianteId35, Carte> = {
  'CARTE-3.5-TABLE-ELARGIE': {
    id: 'CARTE-3.5-TABLE-ELARGIE',
    nom: 'Le·La Table élargie',
    lumiere:
      "Ta famille et tes amis tiennent une vraie place : les décisions se prennent avec eux, les week-ends accueillent le cercle. Ta table s'élargit et tu y es bien — ton entourage est un filet, personne ne tombe.",
    ombre:
      "La table qui déborde impose ses chaises : qui t'aime doit gagner sa place. Les fêtes, les dimanches et les devoirs se négocient tôt, à deux.",
    tension: "élargir ta table, en préparant la chaise de la personne qui arrive.",
  },
  'CARTE-3.5-DEUX-RIVES': {
    id: 'CARTE-3.5-DEUX-RIVES',
    nom: 'Le·La Rive des deux camps',
    lumiere:
      "Ton entourage tient sa place, ni plus ni moins : il compte et il n'envahit pas. Tu connais la valeur des deux rives : la famille d'un côté, le couple de l'autre. Les amis au milieu — et toi qui fais le pont.",
    ombre:
      "Le pont reçoit les vagues des deux rives : qui partage ta vie te confie les négociations. Ta règle des fêtes se dit — elle ne se devine pas.",
    tension: "faire le pont, en disant ta règle des fêtes avant que la vague arrive.",
  },
  'CARTE-3.5-TERRITOIRE': {
    id: 'CARTE-3.5-TERRITOIRE',
    nom: 'Le·La Territoire gardé',
    lumiere:
      "Tes décisions se prennent entre vous, tes week-ends se réservent, la famille et le couple gardent chacun leur territoire. C'est une géographie choisie, pas une coupure — ta clarté est un don.",
    ombre:
      "Le territoire protège et questionne : la famille de l'autre cherche sa place — elle se nomme, ou elle se devine mal.",
    tension: "garder ton territoire, en nommant la place que les autres peuvent habiter.",
  },
};

/** Textes du briefing — annonce VERBATIM (05-ecran-d-intro, 2 phrases),
 *  puces en couche app (ton Task 35, neutralité absolue : pas de bonne
 *  place, les trois façons d'habiter un entourage se valent). */
export const BRIEFING = {
  annonce:
    "Aimer quelqu'un, c'est aussi décider quelle place la famille et les amis garderont. Dis-nous la tienne — il n'y a pas de bonne place.",
  aQuoiCaSert: [
    "C'est la quête du terrain : la place que ta famille et tes amis gardent dans ta vie à deux.",
    "Six affirmations balayent trois angles : les décisions, la famille, les amis et les week-ends.",
    "Pas de bonne place — table élargie ou tête-à-tête gardé : deux façons égales d'habiter les siens.",
    "Il en sort une carte, et une pierre de plus dans ton portrait.",
  ],
  resultats: [
    "Ta carte — ta lumière, ta zone d'ombre et ta tension du moment, en quelques mots.",
    "Ta place — une barre qui dit le poids de ton entourage, d'après tes réponses.",
    "Une pierre de plus dans ton portrait — la suite du voyage s'en nourrit.",
  ],
};

/** Textes de la fenêtre de complétion (carte) — entête, labels et fenêtre F1
 *  verbatim (cartes.yaml), miroirNote en couche app. */
export const COMPLETION = {
  entete: '🏡 QUÊTE ACCOMPLIE — « Ton entourage »',
  labelOmbre: "Ta zone d'ombre :",
  labelTension: 'Ta tension intérieure :',
  fenetre:
    "Quelque part, quelqu'un répond à ces mêmes questions. Le jour où vos cartes se croiseront, elles auront beaucoup à se dire.",
  miroirNote:
    "Ton miroir — la lecture complète de ta place d'entourage — arrive à la prochaine étape du voyage.",
};

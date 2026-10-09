/**
 * Quête 2.7 « Ta vision de la famille » — Monde 3 « La Boussole ».
 *
 * Contenu FIDÈLE au Livrable M3-2.7-Ta-Vision-de-la-Famille (branche
 * archive/v1-2026-10-05) :
 *  - ITEMS : les 8 items Likert verbatim (01-tableau-des-items, ordre du
 *    tableau) — 4 paires miroir R6 (1 D + 1 I) : désir d'enfants (01-02) ·
 *    horizon temporel (03-04) · répartition des rôles (05-06) · la famille
 *    élargie (07-08). Mission V8.C : les items 07/08 (famille élargie) sont
 *    les versions RÉÉCRITES du tableau — ce sont elles qui font foi (l'ancien
 *    angle « modèle d'éducation » de la Vague 6 est archivé dans l'historique
 *    git du Livrable) ;
 *  - AUCUNE trame ▲ : quête déclarative directe (02-plan-de-melange :
 *    positions_trames = [], c2/c3 sans objet de fait) ;
 *  - PASSATION : l'ordre de passation GELÉ — mélange graine 227427
 *    (210427 + 1000 × ordinal 17, convention unifiée mission V7/V8 ;
 *    re-tirage tracé de l'ancienne graine 237427), 02-plan-de-melange :
 *    06 · 03 · 08 · 01 · 04 · 05 · 07 · 02 ;
 *  - scorer : les 4 scores d'ANGLE = moyennes recodées normalisées 0-1
 *    (directes telles quelles, inversées recodées 6 − r) — desir (01+02) ·
 *    horizon (03+04) · roles (05+06) · famille (07+08), 03-signatures :
 *    DESIR/HORIZON/ROLES/FAM_EL. Le DEALBREAKER parentalité du Contrat
 *    d'Inventaire — |désir_A − désir_B| ≥ 2 (échelle 1-5) → score de
 *    compatibilité 0, en SQL pré-filtrage AVANT tout calcul (SIG-2.7-01,
 *    precedent 2.3-01 : personne ne voit « pourquoi ») — est un MÉCANISME
 *    MOTEUR SEUL, verrou [3] : il n'apparaît dans AUCUN énoncé, AUCUN rendu ;
 *    la présente note de commentaire est son unique trace côté app.
 *  - CARTES : les 3 variantes verbatim (cartes.yaml, charte C1-C11) ;
 *  - choisirVariante : les sélecteurs verbatim (cartes.yaml `selection` +
 *    07-miroir §0) — partition exclusive + exhaustive du désir d'enfants
 *    normalisé : > 0.65 → BERCEAU · 0.35-0.65 → PORTE · < 0.35 → ROUTE
 *    (bornes FM-019, provisoires concepteur — re-signature avant bêta),
 *    évalués dans l'ordre du YAML (ordre_selecteur 1 → 3) ; conditions et
 *    seuils restent côté moteur, jamais rendus. Le dealbreaker ne participe
 *    JAMAIS à la sélection (cartes.yaml `non_participant`).
 *  - BRIEFING : l'annonce est verbatim (05-ecran-d-intro, ajusté mission
 *    V8.C — « la famille » remplace « l'éducation »), les puces sont la
 *    couche app rédigée (ton Task 35).
 *
 * Doctrine : neutralité absolue sur la parentalité — désir d'enfant,
 * indécision honnête et choix sans enfant sont trois vies dignes (aucun
 * palier flatté ni blâmé). SIG-2.7-02 (écart d'horizon > 4 ans) et
 * SIG-2.7-03 (friction des rôles) sont des signaux conversationnels MOTEUR
 * (« à aborder tôt ») — jamais rendus, jamais un seuil, jamais un chiffre
 * d'années (verrou 04 n° 6 : l'horizon se dit en proximité relative).
 *
 * Typo : apostrophe ASCII uniquement, pas d'insécable, guillemets français.
 * Règles : aucun code, score, sigle ou seuil ne franchit le rendu ; aucune
 * métadonnée moteur dans un texte rendu ; phrases ≤ 22 mots dans les textes
 * rédigés.
 */

export interface QueteItem27 {
  code: string;
  text: string;
  /** 'D' = directe, 'I' = inversée (recodée 6 − r). */
  orient: 'D' | 'I';
  /** L'angle verbatim du Livrable (01-tableau-des-items, colonne Angle). */
  dim: string;
}

/** L'objet de passation affiché — code + énoncé (l'orientation reste côté moteur). */
export interface ItemsQuete27 {
  code: string;
  text: string;
}

/** Les 8 items Likert — verbatim (01-tableau-des-items, ordre du tableau). */
export const ITEMS: readonly QueteItem27[] = [
  {
    code: "Q2.7-01",
    text: "Des enfants font partie du projet que je me fais.",
    orient: "D",
    dim: "désir d'enfants",
  },
  {
    code: "Q2.7-02",
    text: "Je me construis sans enfants dans le plan.",
    orient: "I",
    dim: "désir d'enfants",
  },
  {
    code: "Q2.7-03",
    text: "Le projet enfants, chez moi, attend que le reste soit posé.",
    orient: "D",
    dim: "horizon temporel",
  },
  {
    code: "Q2.7-04",
    text: "Le projet enfants, chez moi, appelle à être lancé tôt.",
    orient: "I",
    dim: "horizon temporel",
  },
  {
    code: "Q2.7-05",
    text: "Carrière et maison se règlent à deux, sans rôle assigné.",
    orient: "D",
    dim: "répartition des rôles",
  },
  {
    code: "Q2.7-06",
    text: "Chez moi, chacun garde son domaine attitré.",
    orient: "I",
    dim: "répartition des rôles",
  },
  {
    // Mission V8.C — versions réécrites des items 07/08 (la famille élargie
    // remplace l'ancien angle « modèle d'éducation ») : ce sont les versions
    // actuelles du tableau 01 qui font foi.
    code: "Q2.7-07",
    text: "La famille élargie a sa place dans ma vie de famille.",
    orient: "D",
    dim: "la famille élargie",
  },
  {
    code: "Q2.7-08",
    text: "Ma vie de famille se construit d'abord entre nous deux.",
    orient: "I",
    dim: "la famille élargie",
  },
];

/** Ordre de passation GELÉ — mélange graine 227427 (8 positions, aucune
 *  trame ▲ ; le 1ᵉʳ item vu est Q2.7-06, le dernier Q2.7-02). */
export const PASSATION: readonly string[] = [
  "Q2.7-06",
  "Q2.7-03",
  "Q2.7-08",
  "Q2.7-01",
  "Q2.7-04",
  "Q2.7-05",
  "Q2.7-07",
  "Q2.7-02",
];

const PAR_CODE = new Map(ITEMS.map((i) => [i.code, i]));

/** Le deck réel : les items dans l'ordre gelé — aucune trame n'existe ici. */
export function deckQuete(): ItemsQuete27[] {
  return PASSATION.flatMap((c) => {
    const it = PAR_CODE.get(c);
    return it ? [{ code: it.code, text: it.text }] : [];
  });
}

/** Likert 1-5 → 0-1 (inversées recodées 6 − r). */
function contribution(reponse: number, orient: 'D' | 'I'): number {
  return ((orient === 'D' ? reponse : 6 - reponse) - 1) / 4;
}

type CleAngle27 = 'desir' | 'horizon' | 'roles' | 'famille';

/** Angle verbatim (tableau 01) → clé du score d'angle. */
const CLE_PAR_ANGLE: Record<string, CleAngle27> = {
  "désir d'enfants": 'desir',
  'horizon temporel': 'horizon',
  'répartition des rôles': 'roles',
  'la famille élargie': 'famille',
};

export interface Score27 {
  desir: number;
  horizon: number;
  roles: number;
  famille: number;
  [k: string]: number;
}

/**
 * Scorer du Livrable (03-signatures + usage moteur du tableau 01) : chaque
 * score d'ANGLE = moyenne recodée normalisée 0-1 des 2 items de sa paire R6
 * (désir = 01 + 02 recodé — l'axe unique du désir, 03-signatures).
 * Normalisé : une moyenne 1-5 recodée donne la même valeur que la moyenne des
 * contributions ((r − 1) / 4) — les seuils des cartes (0.65 / 0.35) portent
 * sur cette échelle 0-1.
 *
 * HORS score, côté moteur (SQL pré-filtrage — jamais ici) : le dealbreaker
 * parentalité |désir_A − désir_B| ≥ 2 (échelle 1-5) coupe la paire AVANT tout
 * calcul, en silence — verrou [3].
 */
export function scorer(reponses: Record<string, number>): Score27 {
  const total: Record<CleAngle27, number> = { desir: 0, horizon: 0, roles: 0, famille: 0 };
  const n: Record<CleAngle27, number> = { desir: 0, horizon: 0, roles: 0, famille: 0 };
  for (const code of PASSATION) {
    const it = PAR_CODE.get(code);
    const r = it ? reponses[it.code] : undefined;
    if (!it || typeof r !== 'number' || r < 1 || r > 5) continue;
    const cle = CLE_PAR_ANGLE[it.dim];
    if (!cle) continue;
    total[cle] += contribution(r, it.orient);
    n[cle] += 1;
  }
  const moyenne = (c: CleAngle27): number => (n[c] > 0 ? total[c] / n[c] : 0);
  return {
    desir: moyenne('desir'),
    horizon: moyenne('horizon'),
    roles: moyenne('roles'),
    famille: moyenne('famille'),
  };
}

/** Les 3 ids de carte — verbatim (cartes.yaml, ordre du YAML). */
export type VarianteId27 =
  | 'CARTE-2.7-BERCEAU'
  | 'CARTE-2.7-PORTE'
  | 'CARTE-2.7-ROUTE';

/**
 * Sélecteurs VERBATIM (cartes.yaml `selection`, ordre_selecteur 1 → 3) :
 * désir d'enfants normalisé > 0.65 → Berceau · 0.35-0.65 → Porte · < 0.35 →
 * Route. Partition exclusive + exhaustive de [0,1] (C6) — bornes FM-019,
 * provisoires concepteur, côté moteur et jamais affichées.
 */
export function choisirVariante(score: Score27): VarianteId27 {
  const s = typeof score.desir === 'number' ? score.desir : 0;
  return s > 0.65
    ? 'CARTE-2.7-BERCEAU'
    : s >= 0.35
      ? 'CARTE-2.7-PORTE'
      : 'CARTE-2.7-ROUTE';
}

export interface Carte {
  id: VarianteId27;
  nom: string;
  lumiere: string;
  ombre: string;
  tension: string;
}

/** Les 3 variantes de carte — verbatim (cartes.yaml, ordre du YAML ;
 *  portrait → lumiere · ombre · tension_interieure → tension). */
export const CARTES: Record<VarianteId27, Carte> = {
  'CARTE-2.7-BERCEAU': {
    id: 'CARTE-2.7-BERCEAU',
    nom: 'Le·La Berceau qui attend',
    lumiere:
      "Ton projet d'enfants se voit de loin : il s'annonce, il avance, il compte dans la vie que tu prépares. Tu poses les questions difficiles maintenant — parce que tu veux les vraies réponses, pas les réponses de politesse.",
    ombre:
      "Un désir qui avance presse parfois l'autre — et les décisions arrachées tiennent rarement debout longtemps.",
    tension: "porter ton désir, sans compter les heures de l'autre.",
  },
  'CARTE-2.7-PORTE': {
    id: 'CARTE-2.7-PORTE',
    nom: 'Le·La Porte entrouverte',
    lumiere:
      "Ton désir est une porte entrouverte : ni lancé ni fermé, honnêtement en suspens. Tu réponds peut-être parce que c'est vrai — et ça vaut mieux qu'un oui de politesse ou un non de peur.",
    ombre:
      "Le peut-être durable laisse porter la décision — le temps tranche rarement seul, et quelqu'un finit par choisir pour deux.",
    tension: "garder ton ouverture, en lui donnant une date.",
  },
  'CARTE-2.7-ROUTE': {
    id: 'CARTE-2.7-ROUTE',
    nom: 'Le·La Route à deux',
    lumiere:
      "Ton projet ne passe pas par les enfants — un choix, pas un manque. Tu construis une vie entière autrement, et tu la veux à deux, pleine, sans parenthèse imposée.",
    ombre:
      "La route choisie se dit tard parfois — l'incompatibilité découverte à la longue coûte les années déjà tissées.",
    tension: "tenir ta route, en la disant tôt et en toutes lettres.",
  },
};

/** Textes du briefing — annonce VERBATIM (05-ecran-d-intro), puces en couche app. */
export const BRIEFING = {
  annonce:
    "Les enfants, les rôles, la famille — les sujets qu'on évite au début et qui finissent par décider de tout. Ici, tu les poses maintenant.",
  aQuoiCaSert: [
    "C'est la quête boussole — ce que tu veux pour ta famille, et l'endroit où tu en es.",
    "Huit affirmations regardent quatre angles : le désir d'enfants, l'horizon du projet, la répartition des rôles, la place des familles élargies.",
    "Pas de bonne réponse — désirer un enfant, hésiter, ne pas en vouloir : trois visions égales en dignité.",
    "Il en sort une carte, et une pierre de plus dans ton portrait.",
  ],
  resultats: [
    "Ta carte — ta lumière et ta zone d'ombre, en quelques mots.",
    "Ta vision — quatre angles dessinés d'après tes réponses, en quatre barres.",
    "Les pierres de ton portrait — ce que tu découvres ici alimente toute la suite du voyage.",
  ],
};

/** Textes de la fenêtre de complétion (carte) — même gabarit que la quête 1.1.
 *  entête / labels / fenêtre F1 : verbatim (cartes.yaml). */
export const COMPLETION = {
  entete: '🧭 QUÊTE ACCOMPLIE — « Ta vision de la famille »',
  labelOmbre: "Ta zone d'ombre :",
  labelTension: 'Ta tension intérieure :',
  fenetre:
    "Quelque part, quelqu'un répond à ces mêmes questions. Le jour où vos cartes se croiseront, elles auront beaucoup à se dire.",
  miroirNote:
    "Ton miroir — la lecture complète de ta vision de la famille — arrive à la prochaine étape du voyage.",
};

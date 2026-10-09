/**
 * Quête 2.2 « Ta place pour la spiritualité » — Monde 3 « La Boussole ».
 *
 * Contenu FIDÈLE au Livrable M3-2.2-Ta-Place-Pour-La-Spiritualite (branche
 * archive/v1-2026-10-05) :
 *  - ITEMS : les 6 items Likert (verbatim 01-tableau-des-items, ordre du
 *    tableau) — 3 angles × 2 (1 D + 1 I, paires miroir R6) ;
 *  - PASSATION : l'ordre de passation GELÉ (mélange RÉEL graine 222427,
 *    02-plan-de-melange — 6/6 contraintes PASS, run max 1, 4 échanges,
 *    5 passes rejouées identiques) ;
 *  - CARTES : les 3 variantes verbatim (cartes.yaml, charte C1-C11) ;
 *  - choisirVariante : les seuils blocs VERBATIM (cartes.yaml + 03-signatures
 *    SIG-2.2-02 — bornes FM-019 ADOPTÉES comme valeurs de départ, provisoires
 *    concepteur), évalués dans l'ordre : > 0.65 → centrale · 0.35-0.65 →
 *    culturelle · < 0.35 → absente ; conditions et seuils restent côté
 *    moteur, jamais rendus ;
 *  - BRIEFING : l'annonce est verbatim (05-ecran-d-intro), les puces sont la
 *    couche app rédigée (ton Task 35).
 *
 * Quête DÉCLARATIVE DIRECTE : AUCUNE trame ▲ (n_trames = 0 — déguisement
 * impossible, la sincérité est demandée, pas pêchée).
 *
 * NEUTRALITÉ ABSOLUE (doctrine capitale du Livrable) : pratiquer et ne pas
 * pratiquer = deux façons égales d'habiter la spiritualité — aucune option
 * n'est « vivante » contre l'autre, l'absence de place n'est pas un vide,
 * la place forte n'est pas un cap. AUCUNE croyance nommée : jamais dieu,
 * confession, texte ni culte — la quête parle de PLACE, de SEMAINE, de
 * DÉCISIONS, de COUPLE. La LIGNE ROUGE religieuse (dealbreaker DÉCLARÉ) vit
 * en 2.3-04 — PAS ici.
 *
 * Moteur (côté score, jamais rendu) : SPIRIT_D = moyenne des 6 items (I
 * recodés 6 − r) normalisée 0-1 — choisit la variante (fiche computation 06,
 * canal carte) ; un score par ANGLE (moyenne des 2 items de la paire R6,
 * canal fiabilité) alimente la lecture des tendances. SIG-2.2-01
 * « L'homophilie graduée » : l'écart de centralité entre deux profils
 * (EC_SPIRIT) MODULE la compatibilité dans les deux sens — JAMAIS une
 * élimination, aucun seuil ne coupe ; filtre enrichi MOTEUR SEUL, aucune
 * trace au rendu, ne participe pas à la sélection de la carte.
 *
 * Typo : apostrophe ASCII uniquement, guillemets français. Règles : aucun
 * code, score, sigle ou seuil ne franchit le rendu ; aucune métadonnée
 * moteur dans un texte rendu ; phrases ≤ 22 mots dans les textes rédigés.
 */

export interface QueteItem22 {
  code: string;
  text: string;
  /** 'D' = directe, 'I' = inversée (recodée 6 − r). */
  orient: 'D' | 'I';
  /** L'angle verbatim du tableau 01 — 3 angles × paires miroir R6. */
  dim: string;
}

/** L'objet de passation affiché — code + énoncé (l'orientation reste côté moteur). */
export interface ItemsQuete22 {
  code: string;
  text: string;
}

/** Les 6 items — verbatim (01-tableau-des-items, ordre du tableau).
 *  Angles : pratique réelle vs culturelle · place dans les choix de vie ·
 *  transmission dans un couple (1 D + 1 I par angle, règle R6). */
export const ITEMS: readonly QueteItem22[] = [
  {
    code: "Q2.2-01",
    text: "La spiritualité occupe une place réelle dans ma semaine.",
    orient: "D",
    dim: "pratique réelle vs culturelle",
  },
  {
    code: "Q2.2-02",
    text: "La spiritualité, pour moi, relève surtout de la culture et des fêtes.",
    orient: "I",
    dim: "pratique réelle vs culturelle",
  },
  {
    code: "Q2.2-03",
    text: "Mes grandes décisions tiennent compte de ma spiritualité.",
    orient: "D",
    dim: "place dans les choix de vie",
  },
  {
    code: "Q2.2-04",
    text: "Mes grandes décisions passent sans la spiritualité.",
    orient: "I",
    dim: "place dans les choix de vie",
  },
  {
    code: "Q2.2-05",
    text: "Partager ma spiritualité avec un·e partenaire compte pour moi.",
    orient: "D",
    dim: "transmission dans un couple",
  },
  {
    code: "Q2.2-06",
    text: "Transmettre une spiritualité n'est pas mon affaire.",
    orient: "I",
    dim: "transmission dans un couple",
  },
];

/** Ordre de passation GELÉ — mélange RÉEL graine 222427 (02-plan-de-melange ;
 *  le 1ᵉʳ item vu est Q2.2-04, le dernier Q2.2-01 — JAMAIS l'ordre des codes).
 *  AUCUNE trame ▲ dans la quête (déclarative directe — positions_trames : []). */
export const PASSATION: readonly string[] = [
  "Q2.2-04",
  "Q2.2-05",
  "Q2.2-02",
  "Q2.2-03",
  "Q2.2-06",
  "Q2.2-01",
];

const PAR_CODE = new Map(ITEMS.map((i) => [i.code, i]));

/** Le deck réel : les 6 items dans l'ordre gelé — il n'existe aucun item
 *  hors passation (aucune trame, aucun doublon). */
export function deckQuete(): ItemsQuete22[] {
  return PASSATION.flatMap((c) => {
    const it = PAR_CODE.get(c);
    return it ? [{ code: it.code, text: it.text }] : [];
  });
}

/** Likert 1-5 → 0-1 (inversées recodées 6 − r — Arbitrage 1). */
function contribution(reponse: number, orient: 'D' | 'I'): number {
  return ((orient === 'D' ? reponse : 6 - reponse) - 1) / 4;
}

export interface Score22 {
  /** La centralité globale — moyenne des 6 items (I recodés), normalisée 0-1
   *  (SPIRIT_D côté moteur : le nom et le sigle restent hors rendu). */
  centralite: number;
  /** Un score par angle — moyenne des 2 items de la paire R6 (fiche
   *  computation 06, canal fiabilité : « score d'angle = moyenne des items
   *  valides »). Clés = les angles verbatim du tableau 01. */
  [dim: string]: number;
}

/** Scorer du Livrable : SPIRIT_D = moyenne des contributions recodées sur les
 *  6 items de la passation → { centralite } normalisé 0-1, plus un score par
 *  angle (moyenne des 2 items de la paire). Rien d'autre n'entre en jeu :
 *  l'écart à l'autre (EC_SPIRIT, SIG-2.2-01) se calcule côté moteur de
 *  matching, jamais ici, jamais rendu. */
export function scorer(reponses: Record<string, number>): Score22 {
  let total = 0;
  let n = 0;
  const parAngle = new Map<string, { total: number; n: number }>();
  for (const code of PASSATION) {
    const it = PAR_CODE.get(code);
    const r = it ? reponses[it.code] : undefined;
    if (it && typeof r === 'number' && r >= 1 && r <= 5) {
      const c = contribution(r, it.orient);
      total += c;
      n += 1;
      const bloc = parAngle.get(it.dim) ?? { total: 0, n: 0 };
      bloc.total += c;
      bloc.n += 1;
      parAngle.set(it.dim, bloc);
    }
  }
  const score: Score22 = { centralite: n > 0 ? total / n : 0 };
  for (const [dim, bloc] of parAngle) {
    score[dim] = bloc.n > 0 ? bloc.total / bloc.n : 0;
  }
  return score;
}

/** Les 3 variantes — ids VERBATIM (cartes.yaml). */
export type VarianteId22 = 'CARTE-2.2-CLOCHES' | 'CARTE-2.2-FETES' | 'CARTE-2.2-CLAIRIERE';

/**
 * Sélecteurs VERBATIM (cartes.yaml — conditions de sélection sur la centralité,
 * formalisées SIG-2.2-02), évalués dans l'ordre : > 0.65 → CLOCHES (place
 * centrale) · 0.35-0.65 → FETES (place culturelle) · < 0.35 → CLAIRIERE
 * (place libre — absente) — partition exclusive + exhaustive de [0,1] (C6).
 * Aux bornes exactes 0.35 et 0.65, la condition « entre 0.35 et 0.65 »
 * s'applique (le > 0.65 est strict). Bornes FM-019 ADOPTÉES comme valeurs de
 * départ (provisoires concepteur — re-signature professionnelle avant bêta) :
 * métadonnées moteur, jamais affichées. SIG-2.2-01 (écart à l'autre) ne
 * participe JAMAIS à la sélection — filtre enrichi moteur seul.
 */
export function choisirVariante(score: Score22): VarianteId22 {
  const s = typeof score.centralite === 'number' ? score.centralite : 0;
  return s > 0.65
    ? 'CARTE-2.2-CLOCHES'
    : s >= 0.35
      ? 'CARTE-2.2-FETES'
      : 'CARTE-2.2-CLAIRIERE';
}

export interface Carte {
  id: VarianteId22;
  nom: string;
  lumiere: string;
  ombre: string;
  tension: string;
}

/** Les 3 variantes de carte — verbatim (cartes.yaml, ordre du YAML :
 *  portrait → lumiere, tension_interieure → tension). NEUTRALITÉ ABSOLUE :
 *  les trois places se valent — aucune option dressée en idéal (C4). */
export const CARTES: Record<VarianteId22, Carte> = {
  "CARTE-2.2-CLOCHES": {
    id: "CARTE-2.2-CLOCHES",
    nom: "Le·La Cloche qui marque les jours",
    lumiere:
      "Ta spiritualité se vit plus qu'elle ne se déclare : une place dans la semaine, un poids dans les décisions, une part du couple que tu veux vraie. Tu habites une architecture du sens, et elle se voit.",
    ombre:
      "La foi partagée rassure mais l'interprétation divise — entrer dans le même lieu n'empêche pas d'y voir deux paysages.",
    tension: "partager ta place, sans la réclamer comme entrée obligatoire.",
  },
  "CARTE-2.2-FETES": {
    id: "CARTE-2.2-FETES",
    nom: "Le·La Fête des saisons",
    lumiere:
      "Ta spiritualité vit dans les grandes heures : les fêtes qui rassemblent, les saisons qui rythment, les gestes hérités que tu gardes sans tout suivre. Elle fait du lien, pas de la discipline.",
    ombre:
      "Les célébrations rassemblent et le quotidien reste sans rite commun — la fête dit l'appartenance, elle ne dit pas tout.",
    tension: "garder les grandes heures, sans laisser le reste des jours se taire.",
  },
  "CARTE-2.2-CLAIRIERE": {
    id: "CARTE-2.2-CLAIRIERE",
    nom: "Le·La Clairière ouverte",
    lumiere:
      "La spiritualité n'occupe pas de place chez toi, et ce n'est pas un vide : c'est une clairière ouverte. Tu cherches le sens sans autel et le lien sans rituel — ta façon d'habiter la vie en vaut une autre.",
    ombre:
      "La liberté totale donne moins de rituels communs — les jalons que d'autres héritent, tu les inventeras avec quelqu'un, à la main.",
    tension: "rester libre, en acceptant de bâtir des jalons à deux.",
  },
};

/** Textes du briefing — annonce VERBATIM (05-ecran-d-intro, 2 phrases), puces
 *  en couche app (ton Task 35, neutralité absolue). */
export const BRIEFING = {
  annonce:
    "Il y a autant de façons d'habiter la spiritualité que de vies. Ici, tu décris la tienne — elle se respecte comme elle est.",
  aQuoiCaSert: [
    "C'est la quête de la boussole : la place que la spiritualité occupe chez toi, telle que tu la vis.",
    "Six affirmations décrivent ta place : dans la semaine, dans tes décisions, dans un couple.",
    "Pas de bonne réponse — pratiquer ou non : deux façons égales d'habiter la spiritualité.",
    "À la fin, une carte — le reflet de ta place, respectée comme elle est.",
  ],
  resultats: [
    "Ta carte — ta lumière, ta zone d'ombre et ta tension du moment, en quelques mots.",
    "Tes tendances — ta place dans la semaine, les décisions et le couple, en trois barres.",
    "Une pierre de plus dans ton portrait — la suite du voyage s'en nourrit.",
  ],
};

/** Textes de la fenêtre de complétion (carte) — entête, labels et fenêtre F1
 *  verbatim (cartes.yaml), miroirNote en couche app. */
export const COMPLETION = {
  entete: "🧭 QUÊTE ACCOMPLIE — « Ta place pour la spiritualité »",
  labelOmbre: "Ta zone d'ombre :",
  labelTension: "Ta tension intérieure :",
  fenetre:
    "Quelque part, quelqu'un répond à ces mêmes questions. Le jour où vos cartes se croiseront, elles auront beaucoup à se dire.",
  miroirNote:
    "Ton miroir — la lecture complète de ta place — arrive à la prochaine étape du voyage.",
};

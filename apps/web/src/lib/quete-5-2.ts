/**
 * Quête 5.2 « Ta vision de l'amour » — Monde 6 « Mon Cœur » (💎 PREMIUM,
 * P1.5, accès libre au sein du territoire premium).
 *
 * Contenu FIDÈLE au Livrable M6-5.2-Ta-Vision-De-Lamour (2ᵉ génération —
 * dossier V11 perdu au reset, texte réécrit sur le cadre gelé, B.3 :
 * production neuve déclarée) :
 *  - ITEMS : les 8 items Likert (verbatim 01-tableau-des-items, ordre du
 *    tableau) — 4 axes de croyances romantiques × 2 items : le destin ·
 *    le coup de foudre · le grand amour unique · l'idéalisation — 4 paires
 *    R6 complètes (01×02 · 03×04 · 05×06 · 07×08), équilibre 4 D / 4 I ;
 *    AUCUNE trame dans cette quête (zéro signal ▲, c2/c3 sans-objet) ;
 *  - PASSATION : l'ordre de passation GELÉ (mélange RÉEL graine 252427 —
 *    210427 + 1000 × ordinal 42, règle de décade M6 = décade 40 — outil
 *    générique melange.py, 1 tentative, 5 passes rejouées identiques
 *    octet pour octet, empreinte 1071cc9a573c6c85d53fba2190fb8040 ;
 *    6/6 contraintes PASS) ;
 *  - CARTES : les 4 variantes verbatim (cartes.yaml, charte C1-C11,
 *    portrait → lumiere · tension_interieure → tension) ;
 *  - choisirVariante : la sélection VERBATIM du 07-miroir §0 (SIG-5.2-01)
 *    et de cartes.yaml — l'axe le plus haut nomme la variante (4 sorties,
 *    partition exclusive + exhaustive, C6) ; départage en ex æquo strict :
 *    l'axe dont un item occupe la 1ʳᵉ position de passation l'emporte
 *    (convention du 00-README, arbitrage 3 — proposition À VALIDER PAR LE
 *    COMITÉ) ;
 *  - BRIEFING : l'annonce est verbatim (05-ecran-d-intro, 2 phrases), les
 *    puces sont la couche app rédigée (ton Task 35) — PREMIUM [6] : zéro
 *    teaser, zéro présupposition des mondes gratuits ;
 *  - COMPLETION : entête, labels (moule 4.1), fenêtre F1 verbatim
 *    (cartes.yaml), miroirNote en couche app.
 *
 * LE SLOT PROBABILISTE (doctrine capitale du Livrable — à ne pas inverser) :
 * la restitution ne JUGE JAMAIS une vision de l'amour — la carte et le
 * miroir racontent un RAPPORT AU TEMPS : « la suite te dira si tu attends
 * ou si tu construis » (matière gelée du refonte, l. 1813). Zéro verdict,
 * zéro prédiction, zéro correction de croyance : le rendu donne des mots,
 * il ne soigne pas la croyance.
 *
 * NEUTRALITÉ AXIOLOGIQUE STRICTE : une croyance n'est ni saine ni fragile —
 * chaque axe a sa lumière et son ombre EN EXCÈS, jouée en couple, avec un
 * coût pour soi ET un coût pour l'autre (les deux nommés). Aucun axe n'est
 * un idéal, aucune croyance ne se corrige au rendu, zéro hiérarchie.
 *
 * Moteur (côté score, jamais rendu) : quatre moyennes d'axe (2 items
 * chacune, I recodés 6 − r, normalisées 0-1) qui routent l'AFFICHAGE —
 * carte (4 variantes), miroir (4 profils) et slot probabiliste. La pénalité
 * SIG-5.2-02 « Le scénario du premier conflit » (destin extrême × attachement
 * évitant du Monde 1) est [MOTEUR SEUL] : elle n'est PAS implémentée dans
 * cette app — aucun texte, aucun badge, aucun score, aucune exclusion de
 * match ; condition et poids provisoires, À VALIDER PAR LE COMITÉ.
 * La typologie académique de référence des croyances de relation (concept
 * public) et les noms de ses auteures restent INTERDITS au rendu — référence
 * consignée aux fichiers moteur du Livrable seulement.
 *
 * Typo : apostrophe ASCII uniquement, guillemets français. Règles : aucun
 * code, score, sigle ou seuil ne franchit le rendu ; « toujours »/« jamais »
 * interdits au rendu ; phrases ≤ 22 mots.
 */

import { avecEN } from '../i18n/apply';
import * as EN_Q52 from '../i18n/content/en/quete-5-2';

export interface QueteItem52 {
  code: string;
  text: string;
  /** 'D' = directe, 'I' = inversée (recodée 6 − r). */
  orient: 'D' | 'I';
  /** L'axe verbatim du tableau 01 — destin (2) · foudre (2) · unique (2) ·
   *  idéalisation (2). Clé SANS accent (cohérence def/accents). */
  dim: 'destin' | 'foudre' | 'unique' | 'idealisation';
}

export type Axe52 = QueteItem52['dim'];

/** L'objet de passation affiché — code + énoncé (l'orientation reste côté moteur). */
export interface ItemsQuete52 {
  code: string;
  text: string;
}

/** Les 8 items — verbatim (01-tableau-des-items, ordre du tableau).
 *  4 paires R6 complètes : 01×02 (destin) · 03×04 (foudre) · 05×06 (unique)
 *  · 07×08 (idéalisation) — 4 D / 4 I, recodage 6 − r concordant. */
const ITEMS_FR: readonly QueteItem52[] = [
  {
    code: "Q5.2-01",
    text: "Ce qui doit arriver pour moi finit par arriver.",
    orient: "D",
    dim: "destin",
  },
  {
    code: "Q5.2-02",
    text: "Une belle histoire se construit, elle ne se trouve pas.",
    orient: "I",
    dim: "destin",
  },
  {
    code: "Q5.2-03",
    text: "On peut savoir dès les premières minutes que ça compte.",
    orient: "D",
    dim: "foudre",
  },
  {
    code: "Q5.2-04",
    text: "Les sentiments solides demandent du temps pour se reconnaître.",
    orient: "I",
    dim: "foudre",
  },
  {
    code: "Q5.2-05",
    text: "Au fond, il n'y a qu'un grand amour pour chacun.",
    orient: "D",
    dim: "unique",
  },
  {
    code: "Q5.2-06",
    text: "Plusieurs amours différentes peuvent chacune être grandes.",
    orient: "I",
    dim: "unique",
  },
  {
    code: "Q5.2-07",
    text: "Quand quelque chose me plaît, j'imagine surtout ce qu'il pourrait devenir.",
    orient: "D",
    dim: "idealisation",
  },
  {
    code: "Q5.2-08",
    text: "J'aime les gens pour ce qu'ils montrent, pas pour leur potentiel.",
    orient: "I",
    dim: "idealisation",
  },
];
export const ITEMS = avecEN(ITEMS_FR, EN_Q52.ITEMS);

/** Ordre de passation GELÉ — mélange RÉEL graine 252427 (02-plan-de-melange ;
 *  le 1ᵉʳ item vu est Q5.2-02, le dernier Q5.2-08 — JAMAIS l'ordre des codes).
 *  Positions par axe (réel) : destin {1, 7} · unique {2, 5} · foudre {3, 6}
 *  · idéalisation {4, 8}. c1 PASS (0 adjacence) · c2/c3 sans-objet (0 trame)
 *  · c4 PASS (0 déficit) · c5 PASS (run max 2, positions 6-7) · c6 PASS. */
export const PASSATION: readonly string[] = [
  "Q5.2-02",
  "Q5.2-05",
  "Q5.2-04",
  "Q5.2-07",
  "Q5.2-06",
  "Q5.2-03",
  "Q5.2-01",
  "Q5.2-08",
];

const PAR_CODE = new Map(ITEMS.map((i) => [i.code, i]));

/** Le deck réel : les 8 items dans l'ordre gelé — aucune trame n'hébergée
 *  (5.2 est une quête 100 % carte : rien à sauter, rien à masquer). */
export function deckQuete(): ItemsQuete52[] {
  return PASSATION.flatMap((c) => {
    const it = PAR_CODE.get(c);
    return it ? [{ code: it.code, text: it.text }] : [];
  });
}

/** Likert 1-5 → 0-1 (inversées recodées 6 − r — Arbitrage 1). */
function contribution(reponse: number, orient: 'D' | 'I'): number {
  return ((orient === 'D' ? reponse : 6 - reponse) - 1) / 4;
}

export interface Score52 {
  /** Le destin — moyenne des 2 items de l'axe (I recodés), normalisée 0-1
   *  (haut = l'écrit d'avance). */
  destin: number;
  /** Le coup de foudre — moyenne des 2 items de l'axe (I recodés),
   *  normalisée 0-1 (haut = l'éclair). */
  foudre: number;
  /** Le grand amour unique — moyenne des 2 items de l'axe (I recodés),
   *  normalisée 0-1 (haut = l'unique). */
  unique: number;
  /** L'idéalisation — moyenne des 2 items de l'axe (I recodés), normalisée
   *  0-1 (haut = le potentiel). Clé SANS accent (cohérence def/accents). */
  idealisation: number;
  /** Signature d'index (contrat du registre : Record<string, number>) —
   *  aucun score par angle supplémentaire n'y entre. */
  [axe: string]: number;
}

/** Scorer du Livrable : quatre moyennes d'axe (moyennes des contributions
 *  recodées) — elles routent l'affichage (carte · miroir · slot probabiliste).
 *  Aucune agrégation au score de compatibilité depuis cette quête ; le
 *  croisement SIG-5.2-02 reste moteur seul, hors de cette app. */
export function scorer(reponses: Record<string, number>): Score52 {
  const parAxe = new Map<string, { total: number; n: number }>();
  for (const code of PASSATION) {
    const it = PAR_CODE.get(code);
    const r = it ? reponses[it.code] : undefined;
    if (it && typeof r === 'number' && r >= 1 && r <= 5) {
      const c = contribution(r, it.orient);
      const bloc = parAxe.get(it.dim) ?? { total: 0, n: 0 };
      bloc.total += c;
      bloc.n += 1;
      parAxe.set(it.dim, bloc);
    }
  }
  const axe = (dim: string): number => {
    const bloc = parAxe.get(dim);
    return bloc && bloc.n > 0 ? bloc.total / bloc.n : 0;
  };
  return {
    destin: axe('destin'),
    foudre: axe('foudre'),
    unique: axe('unique'),
    idealisation: axe('idealisation'),
  };
}

/** Les 4 variantes — ids VERBATIM (cartes.yaml). */
export type VarianteId52 =
  | 'CARTE-5.2-ECRIT-DAVANCE'
  | 'CARTE-5.2-ECLAIR'
  | 'CARTE-5.2-UNIQUE'
  | 'CARTE-5.2-VERSION-QUI-POURRAIT';

/** Le routage axe → variante (cartes.yaml : un profil par axe dominant). */
const VARIANTE_PAR_AXE: Record<Axe52, VarianteId52> = {
  destin: 'CARTE-5.2-ECRIT-DAVANCE',
  foudre: 'CARTE-5.2-ECLAIR',
  unique: 'CARTE-5.2-UNIQUE',
  idealisation: 'CARTE-5.2-VERSION-QUI-POURRAIT',
};

/** La 1ʳᵉ position de passation de chaque axe — dérivée du PASSATION gelé
 *  (destin {1, 7} → 1 · unique {2, 5} → 2 · foudre {3, 6} → 3 ·
 *  idéalisation {4, 8} → 4) : c'est le critère de départage verbatim. */
const PREMIERE_POSITION: Record<Axe52, number> = (() => {
  const pos: Record<Axe52, number> = {
    destin: Number.POSITIVE_INFINITY,
    foudre: Number.POSITIVE_INFINITY,
    unique: Number.POSITIVE_INFINITY,
    idealisation: Number.POSITIVE_INFINITY,
  };
  PASSATION.forEach((code, index) => {
    const it = PAR_CODE.get(code);
    if (it && index + 1 < pos[it.dim]) pos[it.dim] = index + 1;
  });
  return pos;
})();

/**
 * Sélecteur VERBATIM (07-miroir §0 + cartes.yaml — SIG-5.2-01, partition
 * exclusive + exhaustive, C6) : l'axe le plus haut nomme la variante —
 * 4 sorties ; départage en ex æquo strict : l'axe dont un item occupe la
 * 1ʳᵉ position de passation l'emporte (convention du 00-README, arbitrage 3
 * — proposition À VALIDER PAR LE COMITÉ). Le secondaire (2ᵉ axe) nuance en
 * conversation, il ne produit jamais un deuxième portrait. Métadonnées
 * moteur, jamais affichées.
 */
export function choisirVariante(score: Score52): VarianteId52 {
  const valeur = (axe: Axe52): number =>
    typeof score[axe] === 'number' ? (score[axe] as number) : 0;
  const axes = (Object.keys(VARIANTE_PAR_AXE) as Axe52[]).filter(
    (a) => PREMIERE_POSITION[a] !== Number.POSITIVE_INFINITY,
  );
  let gagnant = axes[0];
  for (const axe of axes) {
    const mieux =
      valeur(axe) > valeur(gagnant) ||
      (valeur(axe) === valeur(gagnant) &&
        PREMIERE_POSITION[axe] < PREMIERE_POSITION[gagnant]);
    if (mieux) gagnant = axe;
  }
  return VARIANTE_PAR_AXE[gagnant];
}

export interface Carte {
  id: VarianteId52;
  nom: string;
  lumiere: string;
  ombre: string;
  tension: string;
}

/** Les 4 variantes de carte — verbatim (cartes.yaml, ordre du YAML :
 *  portrait → lumiere, tension_interieure → tension). NEUTRALITÉ
 *  AXIOLOGIQUE STRICTE : aucun axe n'est un idéal — la carte décrit un film,
 *  elle ne le corrige pas (zéro verdict, zéro prédiction, zéro hiérarchie).
 *  La carte destin porte la phrase-tension gelée « la suite te dira si tu
 *  attends ou si tu construis » ; les autres restent au registre
 *  probabiliste (zéro futur certain). */
export const CARTES: Record<VarianteId52, Carte> = {
  "CARTE-5.2-ECRIT-DAVANCE": {
    id: "CARTE-5.2-ECRIT-DAVANCE",
    nom: "L'amour écrit d'avance",
    lumiere:
      "Tu crois à l'amour qui frappe une fois — tu l'as répondu : ce qui doit arriver finit par arriver. Les rencontres marquantes gardent pour toi un goût d'évidence, et tu laisses l'imprévu te surprendre.",
    ombre:
      "Le quotidien devient un texte à interpréter — ce qui coince se lit comme un signal. Tu attends le signe, l'autre porte l'initiative.",
    tension: "la suite te dira si tu attends ou si tu construis.",
  },
  "CARTE-5.2-ECLAIR": {
    id: "CARTE-5.2-ECLAIR",
    nom: "L'amour qui frappe",
    lumiere:
      "On peut savoir dès les premières minutes que ça compte — tu l'as répondu. Être saisi t'arrive, et tu accordes du crédit à ce premier contact : les débuts te vivent grand.",
    ombre:
      "Les histoires commencées vite demandent un rattrapage d'étapes. T'engager sur une première impression — et l'autre hérite du rôle du premier soir.",
    tension: "l'éclair ouvre l'histoire — c'est la suite qui la tient.",
  },
  "CARTE-5.2-UNIQUE": {
    id: "CARTE-5.2-UNIQUE",
    nom: "L'amour unique",
    lumiere:
      "Au fond, il n'y a qu'un grand amour pour chacun — tu l'as répondu. Ce poids-là, tu lui donnes sans compter : tu n'es pas là pour collectionner, tu es là pour tenir.",
    ombre:
      "Chaque histoire se mesure alors contre un mythe — le quotidien ne gagne pas souvent contre une légende. L'autre rivalise avec un fantôme.",
    tension: "le mythe inspire — il peut aussi empêcher de voir qui est là.",
  },
  "CARTE-5.2-VERSION-QUI-POURRAIT": {
    id: "CARTE-5.2-VERSION-QUI-POURRAIT",
    nom: "L'amour en potentiel",
    lumiere:
      "Quand quelque chose te plaît, tu imagines surtout ce qu'il pourrait devenir — tu l'as répondu. Tu vois le meilleur des gens, et cette élévation se sent : les gens grandissent près de toi.",
    ombre:
      "La personne réelle et la version imaginée divergent — et l'écart se paie des deux côtés. Être aimé·e pour un potentiel épuise.",
    tension: "aimer le meilleur de quelqu'un commence par voir qui il est déjà.",
  },
};

/** Textes du briefing — annonce VERBATIM (05-ecran-d-intro, 2 phrases), puces
 *  en couche app (ton Task 35). PREMIUM [6] : zéro teaser, zéro présupposition
 *  des mondes gratuits — les rappels s'ancrent aux réponses de CETTE quête,
 *  aux énoncés D uniquement. */
export const BRIEFING = {
  annonce:
    "Tu as des croyances sur l'amour — elles filment la suite avant qu'elle arrive. Ici, tu les regardes en face, sans classement et sans juge.",
  aQuoiCaSert: [
    "Une quête de ton cœur : les croyances que tu portes sur l'amour, avant même la rencontre.",
    "Huit affirmations, quatre lectures : le destin, le coup de foudre, le grand amour unique, l'idéalisation.",
    "Aucune croyance n'est jugée ici : un film se regarde, il ne se corrige pas.",
    "À la fin, une carte — un rapport au temps de l'amour, pas un verdict.",
  ],
  resultats: [
    "Ta carte — ta lumière, ta zone d'ombre et ta tension du moment, en quelques mots.",
    "Quatre barres — le destin, le coup de foudre, le grand amour unique et l'idéalisation, comme tu les vis.",
    "Une ouverture, pas une prédiction : la suite te dira si tu attends ou si tu construis.",
    "Une pierre de plus dans ton portrait — la suite du voyage s'en nourrit.",
  ],
};

/** Textes de la fenêtre de complétion (carte) — entête, labels verbatim
 *  (cartes.yaml), fenêtre F1 verbatim (sans le marqueur de liste), miroirNote
 *  en couche app. */
export const COMPLETION = {
  entete: "💗 QUÊTE ACCOMPLIE — « Ta vision de l'amour »",
  labelOmbre: "Ta zone d'ombre :",
  labelTension: "Ta tension intérieure :",
  fenetre:
    "Ta vision de l'amour dit ton rapport au temps — la suite te dira si tu attends ou si tu construis.",
  miroirNote:
    "Ton miroir — la lecture complète de ta vision de l'amour — arrive à la prochaine étape du voyage.",
};

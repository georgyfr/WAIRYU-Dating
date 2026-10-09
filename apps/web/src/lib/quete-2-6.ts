/**
 * Quête 2.6 « Tes priorités pour les 5 prochaines années » — Monde 3 « La Boussole ».
 *
 * Contenu FIDÈLE au Livrable M3-2.6-Tes-Priorites-5-Ans (/tmp/livrables — VAGUE 6/V8.B) :
 *  - AXES : les 5 axes Q2.6-01 → Q2.6-05 (verbatim 01-tableau-des-axes, ordre du
 *    tableau — nom = libellé court de la colonne « Axe », description = la colonne
 *    « Description exacte » à 2 phrases, affichée à l'écran) ;
 *  - PASSATION : l'ordre canonique 01 → 05 (02-ordre-canonique). Le MÉLANGE est
 *    SANS OBJET — documenté au 02 : un seul écran, les 5 curseurs ensemble, aucune
 *    séquence d'items, aucune trame ▲ (n_trames = 0), dimension = null. La graine
 *    226427 est documentée pour l'uniformité de la convention, AUCUN algorithme
 *    ne la consomme ;
 *  - MÉCANIQUE (format JEU D'ARBITRAGE — NON-Likert, rendu par l'orchestrateur) :
 *    5 curseurs 0 → 100 (pas de 1), somme VERROUILLÉE À 100 (validation inactive
 *    tant que Σ ≠ 100), AUCUNE valeur par défaut (profil vierge — le choix est
 *    obligatoire), relecture modifiable jusqu'à validation. Ce module expose les
 *    DONNÉES et le MOTEUR ; l'orchestrateur gère le rendu ;
 *  - CARTES : les 4 variantes verbatim (cartes.yaml, charte C1-C11 — portrait →
 *    lumière, ombre, tension_interieure → tension) ;
 *  - choisirVariante : la partition EXCLUSIVE + EXHAUSTIVE de cartes.yaml
 *    (selection.logique) et 07-miroir §2 — dominance MARQUÉE (max ≥ 40 ET écart
 *    avec le 2ᵉ axe ≥ 10 ; seuils verrou [9] — provisoires, À VALIDER PAR LE
 *    COMITÉ), évaluée dans l'ordre_selecteur du YAML (1 → 4). Les dominances
 *    d'ANCRAGE (stabilité, projets personnels) tombent dans l'équilibré — une
 *    posture de socle, JAMAIS un non-choix (mapping 07 §2, À VALIDER PAR LE
 *    COMITÉ) ;
 *  - axesMajeurs26 : la coexistence documentée au 07 §2 — la signature SIG-2.6-02
 *    « Le profil dominant » (axes majeurs ≥ 30 + départage mission ① score le
 *    plus haut ② écart le plus faible à l'uniforme 20 ③ ordre canonique) nomme
 *    les axes majeurs CÔTÉ MOTEUR ; la partition choisit la carte. Les deux
 *    coexistent sans se doublonner (07 §2) ;
 *  - BRIEFING : l'annonce est VERBATIM (05-ecran-d-intro : « pas comme tu
 *    voudrais paraître » — elle cadre l'honnêteté), les puces sont la couche
 *    app rédigée (ton Task 35). Nuance verrou 04 n° 1 : « cent points » et
 *    « cinq horizons » décrivent la MÉCANIQUE, jamais la répartition personnelle.
 *
 * MOTEUR SEUL — JAMAIS rendus (commentaires seulement) :
 *  - SIG-2.6-01 « L'écart qui parle » : écart brut > 40 points sur UN axe entre
 *    deux profils → signal conversationnel « à aborder tôt » (jamais un
 *    dealbreaker, jamais un score, jamais une élimination) — la distance
 *    pondérée D_PRI (formule proposée, À VALIDER PAR LE COMITÉ) reste moteur ;
 *  - SIG-2.6-03 « La friction d'arbitrage » : 2 axes à ≤ 10 (axes sacrifiés)
 *    croisés avec 2.7 « Ta vision de la famille » → signal « à aborder tôt »
 *    (ex. typique : famille sacrifiée × désir d'enfants affirmé).
 *
 * Doctrine (00-README) : aucun horizon n'est « mûr » ou « égoïste » — 100 points
 * sur la famille valent 100 points sur la carrière ; la contrainte fabrique
 * l'information, elle ne note pas les choix. Le couple n'est plus un axe nommé
 * (mission V8.B) : il traverse les 5 et vit dans l'ombre (l'axe sacrifié porté
 * par le couple). Aucune trame ▲ dans la passation.
 *
 * Typo : apostrophe ASCII uniquement, guillemets français. Règles : aucun code,
 * score, sigle ou seuil ne franchit le rendu (PRI_*, EC_PRI_x, D_PRI, SIG-2.6-*,
 * 40/30/20/10 restent moteur) ; phrases ≤ 22 mots dans les textes rédigés.
 */

/** Un axe du jeu d'arbitrage — code gelé + libellé court + description écran. */
export interface Axe26 {
  code: string;
  nom: string;
  description: string;
}

/** Les 5 axes — verbatim (01-tableau-des-axes, ordre canonique 01 → 05). */
export const AXES: readonly Axe26[] = [
  {
    code: "Q2.6-01",
    nom: "Carrière / ambition",
    description:
      "Faire grandir ce que tu construis professionnellement. Formations, responsabilités, lancement : les années où ton travail avance fort.",
  },
  {
    code: "Q2.6-02",
    nom: "Famille / projet parental",
    description:
      "Faire de la place pour un enfant — ou pour ceux qui sont là. Le temps, l'énergie et les arbitrages du quotidien tournés vers la famille.",
  },
  {
    code: "Q2.6-03",
    nom: "Liberté / aventures",
    description:
      "Partir, bouger, découvrir sans tout planifier. Les années où la légèreté du sac pèse plus que le socle.",
  },
  {
    code: "Q2.6-04",
    nom: "Stabilité / sécurité",
    description:
      "Bâtir un socle qui tient : épargne, logement, santé, rythmes durables. Les années où tu sécurises avant d'étendre.",
  },
  {
    code: "Q2.6-05",
    nom: "Projets personnels",
    description:
      "Faire vivre ce qui est à toi : créer, courir, t'engager. Les années où tes projets personnels — créatifs, sportifs, associatifs — trouvent leur fenêtre.",
  },
];

/**
 * Ordre de passation — le CANONIQUE 01 → 05 (02-ordre-canonique).
 * Le mélange est SANS OBJET (documenté au 02) : un seul écran — les 5 curseurs
 * vivent ensemble, aucun n'est « répondu avant les autres ». L'ordre canonique
 * est un ordre de LECTURE (du plus porté vers le plus personnel — mission V8.B),
 * figé comme partie du protocole ; tout ré-ordonnancement exigerait une Fiche
 * de Mutation. AUCUNE trame dans la passation (n_trames = 0).
 */
export const PASSATION: readonly string[] = [
  "Q2.6-01",
  "Q2.6-02",
  "Q2.6-03",
  "Q2.6-04",
  "Q2.6-05",
];

/** L'écran unique du jeu d'arbitrage : les 5 axes, ordre canonique. */
export function deckQuete(): Axe26[] {
  const parCode = new Map(AXES.map((a) => [a.code, a]));
  return PASSATION.flatMap((c) => {
    const axe = parCode.get(c);
    return axe ? [{ code: axe.code, nom: axe.nom, description: axe.description }] : [];
  });
}

/** Clé de dimension d'un axe (sans accent — accent au rendu uniquement). */
export type CleAxe26 = 'carriere' | 'famille' | 'liberte' | 'stabilite' | 'projets';

const CLE_PAR_CODE: Record<string, CleAxe26> = {
  "Q2.6-01": "carriere",
  "Q2.6-02": "famille",
  "Q2.6-03": "liberte",
  "Q2.6-04": "stabilite",
  "Q2.6-05": "projets",
};

/** Clés des 5 axes, dans l'ordre canonique 01 → 05. */
const CLES_CANONIQUES: readonly CleAxe26[] = [
  'carriere',
  'famille',
  'liberte',
  'stabilite',
  'projets',
];

/**
 * Le score de la quête — la RÉPARTITION normalisée 0-1 par axe.
 * Les réponses Q2.6-01 → 05 sont des POINTS (0-100, Σ = 100 — la mécanique
 * verrouille la somme) ; le scorer rend chaque axe en valeur/100.
 */
export interface Score26 {
  carriere: number;
  famille: number;
  liberte: number;
  stabilite: number;
  projets: number;
  [k: string]: number;
}

/** Bornes un point moteur (0-100) — tolérant aux entrées hors plage. */
function pointsMoteur(valeur: unknown): number {
  if (typeof valeur !== 'number' || !Number.isFinite(valeur)) return 0;
  return Math.max(0, Math.min(100, Math.round(valeur)));
}

/**
 * Scorer du Livrable : chaque réponse EST l'arbitrage — les points déclarés sur
 * l'axe, normalisés 0-1 (valeur / 100). Profil vierge (réponse absente) → 0 :
 * la mécanique n'autorise aucune sortie partielle (Σ = 100 verrouillée), le 0
 * de repli reste hors passation valide.
 */
export function scorer(reponses: Record<string, number>): Score26 {
  const parCle = new Map<CleAxe26, number>();
  for (const code of PASSATION) {
    const cle = CLE_PAR_CODE[code];
    if (cle) parCle.set(cle, pointsMoteur(reponses[code]));
  }
  return {
    carriere: (parCle.get('carriere') ?? 0) / 100,
    famille: (parCle.get('famille') ?? 0) / 100,
    liberte: (parCle.get('liberte') ?? 0) / 100,
    stabilite: (parCle.get('stabilite') ?? 0) / 100,
    projets: (parCle.get('projets') ?? 0) / 100,
  };
}

/** Score 0-1 → points 0-100 (arrondis — la mécanique travaille au pas de 1). */
function pointsParCle(score: Score26): Record<CleAxe26, number> {
  const pt = (v: unknown): number =>
    typeof v === 'number' && Number.isFinite(v)
      ? Math.max(0, Math.min(100, Math.round(v * 100)))
      : 0;
  return {
    carriere: pt(score.carriere),
    famille: pt(score.famille),
    liberte: pt(score.liberte),
    stabilite: pt(score.stabilite),
    projets: pt(score.projets),
  };
}

/** Les 4 variantes de carte — identifiants verbatim (cartes.yaml). */
export type VarianteId26 =
  | 'CARTE-2.6-GRUE'
  | 'CARTE-2.6-NID'
  | 'CARTE-2.6-MAISON'
  | 'CARTE-2.6-COMPAS';

/** Dominance MARQUÉE de l'axe (07 §2) : max ≥ 40 ET écart avec le 2ᵉ axe ≥ 10.
 *  Seuils 40/10 — verrou [9], provisoires concepteur, À VALIDER PAR LE COMITÉ. */
function dominanceMarquee(
  points: Record<CleAxe26, number>,
  cle: CleAxe26,
): boolean {
  const triees = CLES_CANONIQUES.map((k) => points[k]).sort((a, b) => b - a);
  const max = triees[0] ?? 0;
  const second = triees[1] ?? 0;
  return points[cle] >= 40 && points[cle] === max && max - second >= 10;
}

/**
 * Sélecteur VERBATIM — la partition exclusive + exhaustive des 4 profils
 * (cartes.yaml selection.logique + 07-miroir §2), évaluée dans l'ordre_selecteur
 * du YAML (1 → 4) :
 *  1. GRUE — dominance marquée de l'axe Carrière / ambition ;
 *  2. NID — dominance marquée de l'axe Famille / projet parental ;
 *  3. MAISON — SINON : stabilité ou projets personnels en tête (ANCRAGE — une
 *     posture de socle, JAMAIS un non-choix ; mapping 07 §2, À VALIDER PAR LE
 *     COMITÉ) ou aucune dominance marquée (répartition large, égalité multi-axes) ;
 *  4. COMPAS — dominance marquée de l'axe Liberté / aventures.
 * Les conditions du YAML sont mutuellement exclusives : « SINON » se lit
 * « aucune dominance marquée des axes cartographiés » (une dominance liberté
 * atteint toujours la branche 4). Les dominances d'ancrage ne sont JAMAIS
 * traitées comme des non-choix : elles tombent dans l'équilibré, accueillies.
 *
 * Ne participe JAMAIS à la sélection : l'écart à l'autre (SIG-2.6-01 — moteur
 * seul, cartes.yaml selection.non_participant). Métadonnées moteur, jamais
 * affichées telles quelles (seuils 40/10 verrou [9]).
 */
export function choisirVariante(score: Score26): VarianteId26 {
  const points = pointsParCle(score);
  if (dominanceMarquee(points, 'carriere')) return 'CARTE-2.6-GRUE'; // ordre 1
  if (dominanceMarquee(points, 'famille')) return 'CARTE-2.6-NID'; // ordre 2
  if (!dominanceMarquee(points, 'liberte')) return 'CARTE-2.6-MAISON'; // ordre 3 — SINON
  return 'CARTE-2.6-COMPAS'; // ordre 4
}

/**
 * SIG-2.6-02 « Le profil dominant » — le naming CÔTÉ MOTEUR (07 §2 : « la
 * partition choisit la brique, la signature nomme les axes majeurs côté moteur
 * — les deux coexistent sans se doublonner »). Axes majeurs = points ≥ 30
 * (borne verrou [9], À VALIDER PAR LE COMITÉ) ; départage mission : ① le score
 * le plus haut ② puis l'écart le plus faible à la distribution uniforme (20)
 * ③ en dernier recours, l'ordre canonique 01 → 05. Rend la liste ordonnée des
 * axes majeurs (le premier nomme le profil). MOTEUR SEUL — JAMAIS rendu.
 */
export function axesMajeurs26(score: Score26): readonly CleAxe26[] {
  const points = pointsParCle(score);
  return CLES_CANONIQUES.filter((k) => points[k] >= 30).sort(
    (a, b) =>
      points[b] - points[a] ||
      Math.abs(points[a] - 20) - Math.abs(points[b] - 20) ||
      CLES_CANONIQUES.indexOf(a) - CLES_CANONIQUES.indexOf(b),
  );
}

export interface Carte {
  id: VarianteId26;
  nom: string;
  lumiere: string;
  ombre: string;
  tension: string;
}

/** Les 4 variantes de carte — verbatim (cartes.yaml, ordre_selecteur 1 → 4) :
 *  portrait → lumiere, ombre, tension_interieure → tension. */
export const CARTES: Record<VarianteId26, Carte> = {
  'CARTE-2.6-GRUE': {
    id: 'CARTE-2.6-GRUE',
    nom: 'Le·La Grue qui monte',
    lumiere:
      "Tes cinq années ont un chantier : tu as mis ton énergie là où elle se double. Le travail avance, et tu le sais — ta répartition se lit comme une grue qui monte, charge après charge.",
    ombre:
      "Le chantier qui monte laisse parfois la maison sans lumière — et l'autre cherche sa place entre deux lancements.",
    tension: "faire monter la grue, sans vider la maison de ses habitants.",
  },
  'CARTE-2.6-NID': {
    id: 'CARTE-2.6-NID',
    nom: 'Le·La Nid en chantier',
    lumiere:
      "Tes points vont au foyer : faire de la place pour un enfant — ou pour ceux qui sont là. Ces cinq années sont celles où tu construis le nid — un choix assumé, pas un repli.",
    ombre:
      "Le nid absorbe la vie de ceux qui le bâtissent — y compris ta part propre, et parfois la part de couple qui ne relève pas de la gestion.",
    tension: "bâtir le nid, sans t'y perdre comme ouvrier·ière.",
  },
  'CARTE-2.6-MAISON': {
    id: 'CARTE-2.6-MAISON',
    nom: 'Le·La Maison aux cinq pièces',
    lumiere:
      "Tes points ne font pas de course : tu répartis largement, ou tu as posé l'ancrage comme socle plutôt que comme bannière. Ta décennie se règle sur la tenue — une maison aux cinq pièces, chacune chauffée.",
    ombre:
      "La maison bien chauffée fait peu de courants d'air et peu d'horizons — rien n'explose, rien ne décolle.",
    tension: "tenir la maison, en gardant un chantier qui dépasse les murs.",
  },
  'CARTE-2.6-COMPAS': {
    id: 'CARTE-2.6-COMPAS',
    nom: 'Le·La Compas qui pointe l\'horizon',
    lumiere:
      "Tes points vont aux routes : partir, bouger, découvrir sans tout verrouiller. Ces cinq années sont celles du sac léger — tu préfères les histoires aux habitudes, et ta répartition le dit sans détour.",
    ombre:
      "La route qui appelle laisse parfois quelqu'un au campement — des beaux souvenirs, mais sans témoin attitré.",
    tension: "suivre l'horizon, en laissant l'autre poser une étape.",
  },
};

/** Textes du briefing — annonce VERBATIM (05-ecran-d-intro), puces en couche app.
 *  L'annonce (« pas comme tu voudrais paraître ») cadre l'honnêteté : l'arbitrage
 *  subi est moins social que l'auto-description — la force anti-désirabilité du
 *  format. « Cent points » et « cinq horizons » décrivent la MÉCANIQUE (verrou
 *  04 n° 1), jamais la répartition personnelle. */
export const BRIEFING = {
  annonce:
    "Cent points. Cinq horizons. Répartis-les comme tu voudrais vivre tes cinq prochaines années — pas comme tu voudrais paraître.",
  aQuoiCaSert: [
    "C'est la quête de la boussole : comment tu répartis ton énergie pour tes cinq prochaines années.",
    "Un seul écran, cinq horizons : le travail, la famille, la liberté, le socle, tes projets à toi.",
    "Cent points à placer, pas un de plus : donner à un horizon, c'est le retirer à un autre.",
    "Tu pars d'une page vierge, sans exemple ni suggestion. Aucune répartition n'est la bonne : seule compte la tienne.",
  ],
  resultats: [
    "Ta carte — ta lumière et ta zone d'ombre, en quelques mots.",
    "Tes cinq horizons — la part que tu donnes à chacun, en cinq barres.",
    "Les pierres de ton portrait — ce que tu découvres ici alimente toute la suite du voyage.",
  ],
};

/** Textes de la fenêtre de complétion (carte) — entête/labels/fenêtre verbatim
 *  (cartes.yaml : entete_ecran, label_ombre, label_tension, fenêtre F1),
 *  miroirNote du gabarit standard. */
export const COMPLETION = {
  entete: "🧭 QUÊTE ACCOMPLIE — « Tes priorités pour les 5 prochaines années »",
  labelOmbre: "Ta zone d'ombre :",
  labelTension: "Ta tension intérieure :",
  fenetre:
    "Quelque part, quelqu'un répond à ces mêmes questions. Le jour où vos cartes se croiseront, elles auront beaucoup à se dire.",
  miroirNote:
    "Ton miroir — la lecture complète de ton fonctionnement — arrive à la prochaine étape du voyage.",
};

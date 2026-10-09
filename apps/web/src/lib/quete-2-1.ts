/**
 * Quête 2.1 « Tes valeurs » — Monde 3 « La Boussole ».
 *
 * Contenu FIDÈLE au Livrable M3-2.1-Tes-Valeurs (branche archive/v1-2026-10-05) :
 *  - ITEMS : les 20 items carte (verbatim 01-tableau-des-24-items, ordre du
 *    tableau) — 10 valeurs × 2 (1 direct + 1 inversé, paires miroir R6) ;
 *  - PASSATION : l'ordre de passation GELÉ (mélange graine 210427 CONSERVÉE,
 *    passe ⑤ FM-015 — run max 2, 02-plan-de-melange) SANS les 4 trames sécurité
 *    Q2.1-21→24 : le deck saute les trames, comme la quête 1.1 saute ses trames
 *    Q1.1-T ;
 *  - les 4 trames ▲ (signal DTM_N) existent au mélange aux positions 4 · 10 ·
 *    16 · 24 mais leur formulation vit HORS DÉPÔT (document trames confidentiel,
 *    règle 11-b / FM-018) : aucune formulation n'existe dans ce dépôt et aucune
 *    n'est reconstituée ici. Elles ne sont JAMAIS affichées, n'entrent dans
 *    AUCUN score, ne participent JAMAIS à la sélection de carte et ne produisent
 *    AUCUN texte (rappel interdit — 01-tableau, fiche computation ▲) ;
 *  - scorer : score de bloc = moyenne Likert (échelle 1-5) des facettes du
 *    bloc, inversés recodés 6 − r (cartes.yaml selection.calcul) — 4 blocs :
 *    ouverture (Autonomie 01-02 · Stimulation 03-04 · Hédonisme 05-06) ·
 *    affirmation (Réussite 07-08 · Pouvoir 09-10) · conservation (Sécurité
 *    11-12 · Conformité 13-14 · Tradition 15-16) · depassement (Bienveillance
 *    17-18 · Universalisme 19-20). Le scorer EXPOSÉ (contrat app) renvoie les
 *    4 blocs NORMALISÉS 0-1 : (moyenne Likert − 1) / 4. scoresBruts renvoie
 *    les moyennes Likert 1-5 — l'unité des seuils (tension |Aff − Dép| ≥ 1,0) ;
 *  - choisirVariante : sélecteurs VERBATIM (cartes.yaml selection), évalués
 *    dans l'ordre du YAML — bloc dominant = maximum des 4, égalité stricte
 *    départagée par l'ordre fixe Ouverture → Affirmation → Conservation →
 *    Dépassement (déterministe C6) ; tension = |Affirmation − Dépassement| ≥
 *    1,0 en échelle Likert 1-5 → tendue · sinon apaisée. Conditions et seuils
 *    restent côté moteur, jamais rendus (FM-019 : ADOPTÉS comme valeurs de
 *    départ, provisoires concepteur) ;
 *  - CARTES : les 8 variantes verbatim (cartes.yaml — portrait → lumiere,
 *    tension_interieure → tension) ;
 *  - BRIEFING : l'annonce est verbatim (05-ecran-d-intro, 2 phrases), les
 *    puces sont la couche app rédigée (ton Task 35).
 *
 * Typo : apostrophe ASCII uniquement, pas d'insécable, guillemets français.
 * Règles : aucun code, score, sigle ou seuil ne franchit le rendu ; aucune
 * métadonnée moteur dans un texte rendu ; phrases ≤ 22 mots dans les textes
 * rédigés ; le nom du framework public des valeurs reste moteur seul (jamais
 * rendu — 00-README, verrou de citation).
 */

export interface QueteItem21 {
  code: string;
  text: string;
  /** 'D' = directe, 'I' = inversée (recodée 6 − r). */
  orient: 'D' | 'I';
  /** La valeur verbatim du tableau 01 — regroupée en 4 blocs portrait. */
  dim: string;
}

/** L'objet de passation affiché — code + énoncé (l'orientation reste côté moteur). */
export interface ItemsQuete21 {
  code: string;
  text: string;
}

/** Les 20 items carte — verbatim (01-tableau-des-24-items, ordre du tableau).
 *  AUCUNE trame Q2.1-21→24 ici : formulation hors dépôt (règle 11-b), jamais
 *  reconstituée, jamais affichée, jamais scorée. */
export const ITEMS: readonly QueteItem21[] = [
  {
    code: "Q2.1-01",
    text: "Pour les grandes décisions, je préfère trancher moi-même.",
    orient: "D",
    dim: "Autonomie",
  },
  {
    code: "Q2.1-02",
    text: "Pour les grandes décisions, je préfère suivre ce que d'autres conseillent.",
    orient: "I",
    dim: "Autonomie",
  },
  {
    code: "Q2.1-03",
    text: "Pour mes sorties, ce qui est inconnu m'attire le plus.",
    orient: "D",
    dim: "Stimulation",
  },
  {
    code: "Q2.1-04",
    text: "Pour mes sorties, je choisis ce que je connais déjà.",
    orient: "I",
    dim: "Stimulation",
  },
  {
    code: "Q2.1-05",
    text: "Quand une occasion de plaisir se présente, je la saisis.",
    orient: "D",
    dim: "Hédonisme",
  },
  {
    code: "Q2.1-06",
    text: "Quand une occasion de plaisir se présente, je la laisse passer.",
    orient: "I",
    dim: "Hédonisme",
  },
  {
    code: "Q2.1-07",
    text: "Dans un nouveau projet, je vise d'abord des résultats visibles.",
    orient: "D",
    dim: "Réussite",
  },
  {
    code: "Q2.1-08",
    text: "Dans un nouveau projet, les résultats ne me motivent pas vraiment.",
    orient: "I",
    dim: "Réussite",
  },
  {
    code: "Q2.1-09",
    text: "Dans un groupe, je préfère que ce soit moi qui décide.",
    orient: "D",
    dim: "Pouvoir",
  },
  {
    code: "Q2.1-10",
    text: "Dans un groupe, je laisse volontiers la direction à quelqu'un d'autre.",
    orient: "I",
    dim: "Pouvoir",
  },
  {
    code: "Q2.1-11",
    text: "Une vie réglée me rassure plus qu'elle ne m'ennuie.",
    orient: "D",
    dim: "Sécurité",
  },
  {
    code: "Q2.1-12",
    text: "Une vie réglée m'ennuie plus qu'elle ne me rassure.",
    orient: "I",
    dim: "Sécurité",
  },
  {
    code: "Q2.1-13",
    text: "Déçu par une décision du groupe, je le garde pour moi.",
    orient: "D",
    dim: "Conformité",
  },
  {
    code: "Q2.1-14",
    text: "Déçu par une décision du groupe, je le dis tout de suite.",
    orient: "I",
    dim: "Conformité",
  },
  {
    code: "Q2.1-15",
    text: "Je maintiens les traditions que ma famille m'a transmises.",
    orient: "D",
    dim: "Tradition",
  },
  {
    code: "Q2.1-16",
    text: "Je m'éloigne des traditions que ma famille m'a transmises.",
    orient: "I",
    dim: "Tradition",
  },
  {
    code: "Q2.1-17",
    text: "La demande d'aide d'un proche passe avant mon programme du jour.",
    orient: "D",
    dim: "Bienveillance",
  },
  {
    code: "Q2.1-18",
    text: "Mon programme du jour passe avant la demande d'aide d'un proche.",
    orient: "I",
    dim: "Bienveillance",
  },
  {
    code: "Q2.1-19",
    text: "Devant une façon de vivre très différente, je cherche d'abord à comprendre.",
    orient: "D",
    dim: "Universalisme",
  },
  {
    code: "Q2.1-20",
    text: "Devant une façon de vivre très différente, je me méfie d'abord.",
    orient: "I",
    dim: "Universalisme",
  },
];

/** Ordre de passation GELÉ — mélange graine 210427, passe ⑤ FM-015 (20
 *  positions carte ; les trames Q2.1-21→24 aux positions 4 · 10 · 16 · 24 du
 *  mélange sont hors passation : pas de formulation au dépôt, deck jamais
 *  affiché, score jamais touché). */
export const PASSATION: readonly string[] = [
  "Q2.1-01",
  "Q2.1-03",
  "Q2.1-06",
  "Q2.1-15",
  "Q2.1-18",
  "Q2.1-13",
  "Q2.1-02",
  "Q2.1-11",
  "Q2.1-04",
  "Q2.1-19",
  "Q2.1-07",
  "Q2.1-10",
  "Q2.1-12",
  "Q2.1-14",
  "Q2.1-05",
  "Q2.1-20",
  "Q2.1-08",
  "Q2.1-17",
  "Q2.1-09",
  "Q2.1-16",
];

const PAR_CODE = new Map(ITEMS.map((i) => [i.code, i]));

/** Le deck réel : les 20 items carte dans l'ordre gelé — les trames n'y
 *  figurent jamais (aucune formulation n'existe au dépôt). */
export function deckQuete(): ItemsQuete21[] {
  return PASSATION.flatMap((c) => {
    const it = PAR_CODE.get(c);
    return it ? [{ code: it.code, text: it.text }] : [];
  });
}

/** Les 4 blocs portrait (01-tableau — regroupement pour les slots) et leurs
 *  facettes : les 10 valeurs du concept public (moteur seul — jamais rendues,
 *  C3). Une facette = 2 items (1 D + 1 I, paire miroir R6). */
export type BlocId21 = 'ouverture' | 'affirmation' | 'conservation' | 'depassement';

const FACETTES_PAR_BLOC: Record<BlocId21, readonly string[]> = {
  ouverture: ['Autonomie', 'Stimulation', 'Hédonisme'],
  affirmation: ['Réussite', 'Pouvoir'],
  conservation: ['Sécurité', 'Conformité', 'Tradition'],
  depassement: ['Bienveillance', 'Universalisme'],
};

/** Recodage Likert d'un item — les inversées comptent 6 − r (Arbitrage 1). */
function recode(reponse: number, orient: 'D' | 'I'): number {
  return orient === 'D' ? reponse : 6 - reponse;
}

/** Moyenne par facette (min 1 item valide — fiche computation 06), puis
 *  moyenne des facettes du bloc, en unité LIKERT 1-5. Un bloc sans aucune
 *  réponse valide → 0 (hors passe — la passation fournit les 20 réponses). */
function calculeBlocs(reponses: Record<string, number>): {
  brut: Record<BlocId21, number>;
  valide: Record<BlocId21, boolean>;
} {
  const facettes = new Map<string, { total: number; n: number }>();
  for (const code of PASSATION) {
    const it = PAR_CODE.get(code);
    const r = it ? reponses[it.code] : undefined;
    if (it && typeof r === 'number' && r >= 1 && r <= 5) {
      const f = facettes.get(it.dim) ?? { total: 0, n: 0 };
      f.total += recode(r, it.orient);
      f.n += 1;
      facettes.set(it.dim, f);
    }
  }
  const brut = { ouverture: 0, affirmation: 0, conservation: 0, depassement: 0 } as Record<BlocId21, number>;
  const valide = { ouverture: false, affirmation: false, conservation: false, depassement: false } as Record<BlocId21, boolean>;
  for (const bloc of Object.keys(FACETTES_PAR_BLOC) as BlocId21[]) {
    let total = 0;
    let n = 0;
    for (const facette of FACETTES_PAR_BLOC[bloc]) {
      const f = facettes.get(facette);
      if (f && f.n > 0) {
        total += f.total / f.n;
        n += 1;
      }
    }
    if (n > 0) {
      brut[bloc] = total / n;
      valide[bloc] = true;
    }
  }
  return { brut, valide };
}

/** Les moyennes de bloc en unité LIKERT 1-5 — l'unité des seuils du cartes.yaml
 *  (tension : |Affirmation − Dépassement| ≥ 1,0 ; signatures SIG-2.1-01/03/04). */
export interface Bruts21 {
  ouverture: number;
  affirmation: number;
  conservation: number;
  depassement: number;
}

/** scoresBruts : les 4 blocs en échelle Likert 1-5 (moyenne des facettes,
 *  inversés recodés 6 − r). Les trames n'y entrent jamais. */
export function scoresBruts(reponses: Record<string, number>): Bruts21 {
  return calculeBlocs(reponses).brut;
}

export interface Score21 {
  ouverture: number;
  affirmation: number;
  conservation: number;
  depassement: number;
  [k: string]: number;
}

/** Scorer EXPOSÉ (contrat app) : les 4 blocs NORMALISÉS 0-1 —
 *  (moyenne Likert − 1) / 4. Bloc sans aucune réponse valide → 0. */
export function scorer(reponses: Record<string, number>): Score21 {
  const { brut, valide } = calculeBlocs(reponses);
  const norm = (b: BlocId21): number => (valide[b] ? (brut[b] - 1) / 4 : 0);
  return {
    ouverture: norm('ouverture'),
    affirmation: norm('affirmation'),
    conservation: norm('conservation'),
    depassement: norm('depassement'),
  };
}

/** Les 8 variantes — ids VERBATIM (cartes.yaml, ordre du YAML). */
export type VarianteId21 =
  | 'CARTE-2.1-OUV-APA'
  | 'CARTE-2.1-OUV-TEN'
  | 'CARTE-2.1-AFF-APA'
  | 'CARTE-2.1-AFF-TEN'
  | 'CARTE-2.1-CON-APA'
  | 'CARTE-2.1-CON-TEN'
  | 'CARTE-2.1-DEP-APA'
  | 'CARTE-2.1-DEP-TEN';

/**
 * Sélecteurs VERBATIM (cartes.yaml — selection), évalués dans l'ordre du YAML :
 *  1. bloc dominant = maximum des 4 blocs — égalité stricte départagée par
 *     l'ordre fixe Ouverture → Affirmation → Conservation → Dépassement
 *     (déterministe, C6 — le premier maximum dans cet ordre gagne) ;
 *  2. tension = |Affirmation − Dépassement| ≥ 1,0 → tendue · sinon apaisée.
 * UNITÉ DES SEUILS : le cartes.yaml pose la tension sur l'échelle LIKERT 1-5
 * (« même unité que SIG-2.1-04 »), tandis que le scorer exposé (contrat app)
 * livre des blocs normalisés 0-1 via (m − 1) / 4. La conversion inverse
 * likert = s * 4 + 1 est une transformation linéaire EXACTE — on reconstruit
 * donc ici les moyennes Likert sans perte avant d'appliquer les conditions
 * (voie la plus fidèle au YAML, signature inchangée pour le contrat app).
 * Seuils FM-019 ADOPTÉS comme valeurs de départ (provisoires concepteur) —
 * métadonnées moteur, jamais affichées telles quelles.
 */
export function choisirVariante(score: Score21): VarianteId21 {
  const s = (k: string): number => (typeof score[k] === 'number' ? score[k] : 0);
  const likert = (n: number): number => n * 4 + 1;
  const blocs = {
    ouverture: likert(s('ouverture')),
    affirmation: likert(s('affirmation')),
    conservation: likert(s('conservation')),
    depassement: likert(s('depassement')),
  };
  const ordreFixe: readonly BlocId21[] = ['ouverture', 'affirmation', 'conservation', 'depassement'];
  let dominant: BlocId21 = 'ouverture';
  for (const b of ordreFixe) {
    if (blocs[b] > blocs[dominant]) dominant = b;
  }
  const tendue = Math.abs(blocs.affirmation - blocs.depassement) >= 1;
  if (dominant === 'ouverture') return tendue ? 'CARTE-2.1-OUV-TEN' : 'CARTE-2.1-OUV-APA';
  if (dominant === 'affirmation') return tendue ? 'CARTE-2.1-AFF-TEN' : 'CARTE-2.1-AFF-APA';
  if (dominant === 'conservation') return tendue ? 'CARTE-2.1-CON-TEN' : 'CARTE-2.1-CON-APA';
  return tendue ? 'CARTE-2.1-DEP-TEN' : 'CARTE-2.1-DEP-APA';
}

export interface Carte {
  id: VarianteId21;
  nom: string;
  lumiere: string;
  ombre: string;
  tension: string;
}

/** Les 8 variantes de carte — verbatim (cartes.yaml, ordre du YAML :
 *  portrait → lumiere, tension_interieure → tension). Sélection : 4 blocs
 *  (partition totale après départage) × 2 tensions — chaque profil tombe dans
 *  exactement une variante (C6). Les noms de valeurs ne sont JAMAIS rendus
 *  (C3) ; les 4 trames DTM_N ne participent ni à la sélection ni au texte (C2). */
export const CARTES: Record<VarianteId21, Carte> = {
  "CARTE-2.1-OUV-APA": {
    id: "CARTE-2.1-OUV-APA",
    nom: "Le·La Passeur·se d'horizons",
    lumiere:
      "Tu avances vers ce que tu ne connais pas encore — et tu sais y emmener les autres. L'inconnu t'attire plus qu'il ne t'inquiète, les occasions se saisissent, les habitudes te laissent libre. Ton autonomie n'est pas une fuite : c'est ta boussole.",
    ombre: "Quand le neuf fait la loi, ce qui dure finit par attendre — et parfois, ce qui attend, c'est ce qui comptait.",
    tension: "aller loin, sans lâcher ce qui compte.",
  },
  "CARTE-2.1-OUV-TEN": {
    id: "CARTE-2.1-OUV-TEN",
    nom: "Le·La Collectionneur·se de commencements",
    lumiere:
      "Le nouveau t'appelle et tu réponds : sorties inconnues, occasions saisies à la volée, décisions que tu tranches toi-même. Ta vie avance par commencements — et tu aimes ce mouvement. Rester immobile, pour toi, ressemble à reculer.",
    ombre: "Collectionner les commencements, c'est finir rarement : ce qui compte finit parfois par patienter derrière le prochain début.",
    tension: "commencer beaucoup, sans rien laisser à moitié.",
  },
  "CARTE-2.1-AFF-APA": {
    id: "CARTE-2.1-AFF-APA",
    nom: "Le·La Bâtisseur·se de ponts",
    lumiere:
      "Tu vises des résultats visibles et tu sais décider — mais ta réussite ne tourne pas au solo. Tu connectes les gens, tu construis avec eux, tu laisses des ponts derrière toi. Diriger, chez toi, ressemble à organiser.",
    ombre: "Le cap est ton terrain — vérifie que les autres marchent à côté de toi, et pas seulement derrière toi.",
    tension: "mener le jeu, sans l'accaparer.",
  },
  "CARTE-2.1-AFF-TEN": {
    id: "CARTE-2.1-AFF-TEN",
    nom: "Le·La Ventouse à projets",
    lumiere:
      "Les projets t'habitent et te portent : tu vises, tu décides, tu avances. Ton énergie va là où ça se mesure. Et le prochain objectif t'attend déjà. Tu ne connais pas le temps mort.",
    ombre: "Les projets priment parfois sur les gens : ceux qui t'aiment peuvent vivre tes objectifs comme une salle d'attente sans fauteuil.",
    tension: "réussir, sans que ça coûte les gens.",
  },
  "CARTE-2.1-CON-APA": {
    id: "CARTE-2.1-CON-APA",
    nom: "L'Ancre qui regarde ailleurs",
    lumiere:
      "Ta stabilité est choisie, pas subie. Tu aimes ce qui règle la vie — les rythmes, les repères, les habitudes qui tiennent. Et quand de l'inconnu passe, tu le regardes sans paniquer : ton socle tient debout tout seul.",
    ombre: "Le socle peut devenir siège : à force de tenir, tu peux durer là où il faudrait partir.",
    tension: "rester posé(e), sans rester planté(e).",
  },
  "CARTE-2.1-CON-TEN": {
    id: "CARTE-2.1-CON-TEN",
    nom: "L'Enraciné·e vigilant·e",
    lumiere:
      "Ce qui dure te rassure plus que ça ne t'ennuie : une vie réglée, des repères tenus, les héritages que tu ne renies pas. Tu entretiens ce que tu as reçu, et ce que tu construis ressemble à du solide.",
    ombre: "Le cadre protège — et il peut fermer : ce que tu tiens trop fort finit par te tenir.",
    tension: "garder ce qui compte, sans garder tout.",
  },
  "CARTE-2.1-DEP-APA": {
    id: "CARTE-2.1-DEP-APA",
    nom: "L'Aiguilleur·se du cœur",
    lumiere:
      "Prendre soin, chez toi, n'est pas un détour : c'est la ligne droite. L'aide d'un proche compte plus que ton programme, et une façon de vivre différente te fait chercher à comprendre avant de juger. Ton cercle s'élargit sans se vider.",
    ombre: "Donner, c'est aussi choisir : vérifie que tu donnes par envie, et pas par devoir devenu habitude.",
    tension: "prendre soin des autres, sans t'y loger.",
  },
  "CARTE-2.1-DEP-TEN": {
    id: "CARTE-2.1-DEP-TEN",
    nom: "Le·La Phare qui s'oublie",
    lumiere:
      "Tu éclaires large : les gens comptent avant les programmes, la différence ne te fait pas reculer, ton cercle est étendu et ta loyauté va loin. Il y a, chez toi, quelqu'un à aider à chaque horizon.",
    ombre: "Le phare qui éclaire tout peut s'oublier : à force de passer après, ton propre cap se brouille.",
    tension: "donner beaucoup, sans t'effacer du rivage.",
  },
};

/** Textes du briefing — annonce VERBATIM (05-ecran-d-intro, 2 phrases), puces
 *  en couche app (ton Task 35, neutralité normative : les 4 blocs se valent). */
export const BRIEFING = {
  annonce:
    "Avant d'aller plus loin, regarde ce que tu défends vraiment. Réponds du premier mouvement : ici, aucun choix n'est le bon ou le mauvais.",
  aQuoiCaSert: [
    "C'est la quête de la boussole : ce qui guide tes choix, et ce qui te fait tenir dans la durée.",
    "Vingt affirmations balayent ta vie quotidienne : tes décisions, tes sorties, tes projets, tes repères, ta place dans un groupe, tes proches.",
    "Pas de bonne réponse — seulement ta réponse, celle qui ressemble à tes semaines ordinaires.",
    "Il en sort une carte, et une pierre de plus dans ton portrait.",
  ],
  resultats: [
    "Ta carte — ta lumière, ta zone d'ombre et ta tension du moment, en quelques mots.",
    "Tes tendances — tes quatre familles de valeurs, en quatre barres.",
    "Une pierre de plus dans ton portrait — la suite du voyage s'en nourrit.",
  ],
};

/** Textes de la fenêtre de complétion (carte) — entête, labels et fenêtre F1
 *  verbatim (cartes.yaml), miroirNote en couche app. */
export const COMPLETION = {
  entete: "🧭 QUÊTE ACCOMPLIE — « Tes valeurs »",
  labelOmbre: "Ta zone d'ombre :",
  labelTension: "Ta tension intérieure :",
  fenetre:
    "Quelque part, quelqu'un répond à ces mêmes questions. Le jour où vos cartes se croiseront, elles auront beaucoup à se dire.",
  miroirNote:
    "Ton miroir — la lecture complète de ta boussole — arrive à la prochaine étape du voyage.",
};

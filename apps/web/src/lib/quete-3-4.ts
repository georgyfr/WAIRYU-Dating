/**
 * Quête 3.4 « Ton rapport à l'argent » — Monde 4 « Ton terrain ».
 *
 * Contenu FIDÈLE au Livrable M4-3.4-Ton-Rapport-a-lArgent (branche
 * archive/v1-2026-10-05) — vérification directe du dossier livrable :
 * LE LIVRABLE GAGNE sur tout écart de lecture.
 *  - ITEMS : les 6 items carte (verbatim 01-tableau-des-items, ordre du
 *    tableau) — 2 axes × 3 : dépense (01-03) · calcul (04-06), 2 paires
 *    miroir R6 (le coup de cœur 01×02 · la comparaison 04×05) + 2 pivots
 *    (l'épargne qui dort 03 · la visibilité des comptes 06). Écart
 *    arithmétique R6 3/3 documenté au 01 — À VALIDER PAR LE COMITÉ ;
 *  - RECODAGE : les inversées comptent 6 − r (Arbitrage 1), Likert 5
 *    (Arbitrage 2) ;
 *  - TRAMES ▲ Q3.4-T07/T08 (signal DGR — règle 11-b / FM-018) : elles
 *    n'existent NI dans ITEMS ni dans PASSATION. Le livrable les fait
 *    « passer parmi les autres » (indiscernabilité, 00-README doctrine ②)
 *    mais leur formulation vit HORS DÉPÔT (document trames, Partie 7) :
 *    aucune n'est reconstituée ici, aucune n'est affichée, scorée ou rendue.
 *    DIVERGENCE app assumée : le deck saute les trames (comme la quête 2.1
 *    saute les siennes) et conserve l'ORDRE RELATIF des 6 items carte du
 *    mélange gelé — le livrable gagne (aucune formulation inventée).
 *    FINDING V9 (garde CI-10 v3) : l'exemple de formulation donné par la
 *    mission pour T07 (« Je rembourse "plus tard"… ») est le verbatim de
 *    Q1.4-06, item EXISTANT de la quête 1.4 — T07 a reçu une formulation
 *    NEUVE (angle : le découvert habituel, hors dépôt) : NE JAMAIS utiliser
 *    l'exemple de la mission ;
 *  - PASSATION GELÉE (02 — graine 234427, outil dédié melange-biaxes.py v2,
 *    5 passes identiques) : Q3.4-01 · Q3.4-04 · Q3.4-02 · [T07 pos 4] ·
 *    Q3.4-06 · Q3.4-03 · Q3.4-05 · [T08 pos 8]. Les positions 4 et 8 du
 *    mélange sont les ancres trames (c3 — jamais déplacées sans Fiche de
 *    Mutation) ; c4 « sans-objet par arithmétique » : minimum constructible
 *    2 violations (dépense {1, 3, 6} · calcul {2, 5, 7}) — séquence GELÉE
 *    telle quelle, rien à « réparer » ; c1 stricte (0 adjacence), run max 2 ;
 *  - scorer : DEP_D = dépense déclarée (01→03, I recodés, normalisée 0-1 —
 *    haut = dépensier) · CALC_D = calcul déclaré (04→06, I recodés,
 *    normalisée 0-1 — haut = calculé). L'UNITÉ DES SEUILS du cartes.yaml est
 *    ici le 0-1 normalisé (déviations 0.15 · bornes 0.35/0.65) : scoresBruts
 *    et scorer livrent donc la même valeur — les deux sont exposés par
 *    symétrie avec le contrat des autres quêtes ;
 *  - DGR_IF (impulsivité financière, T07→T08, D, normalisé) : MOTEUR SEUL —
 *    alimente DGR (dangerosité réactive) en croisement moteur 1.4
 *    (auto-contrôle) × 1.5 (épreuve du temps) ; le pré-signal
 *    SIG_DGR_PRECURSEUR (n° 32, quête 1.4) passe en lecture complète ici.
 *    JAMAIS au rendu, jamais au score de compatibilité, jamais au matching,
 *    jamais au premium (SIG-3.4-03). Les formulations étant hors dépôt,
 *    DGR_IF n'est PAS calculé côté app — il vivra au moteur, avec le
 *    document trames. EC_DEP (friction financière, SIG-3.4-02) : écart
 *    entre deux profils, moteur seul — jamais l'écart calculé rendu à un
 *    membre, jamais une pénalité, jamais une élimination ;
 *  - choisirVariante : sélecteurs VERBATIM (cartes.yaml selection) —
 *    dD = |DEP_D − 0.5| · dC = |CALC_D − 0.5| · max(dD, dC) ≤ 0.15 → central
 *    · sinon l'axe le plus dévié choisit le quadrant · départage dD = dC :
 *    l'axe dépense tranche (la 1re cause de dispute documentée). Les
 *    conditions 0.65/0.35 des variantes sont les côtés des axes déviés
 *    (0,5 ± 0,15) ; un axe dans la bande centrale suit son signe autour de
 *    0,5 — les 5 sélections forment une partition totale du carré [0,1]²
 *    (C6) et le choix reste déterministe. Bornes FM-019 ADOPTÉES comme
 *    valeurs de départ (provisoires concepteur — re-signature
 *    professionnelle avant bêta) ;
 *  - CARTES : les 5 variantes verbatim (cartes.yaml — portrait → lumiere,
 *    tension_interieure → tension). ⚠ l'id CARTE-3.4-CŒUR-QUI-PAIE porte la
 *    ligature Œ (U+0152) : copié à l'octet exact, ne JAMAIS le « corriger »
 *    (les ids de variantes sont des clés de données, jamais rendus).
 *
 * Neutralité des profils (doctrine du livrable) : dépenser et économiser =
 * deux façons égales d'habiter un budget ; le spontané et le calculé = deux
 * tempos. Cinq jugements interdits au rendu : le dépensier n'est pas
 * « irresponsable », l'économe n'est pas « radin », le spontané n'est pas
 * « léger », le calculé n'est pas « froid », le central n'est pas
 * « indécis ». ZÉRO montant chiffré au rendu — l'argent se parle en
 * situations, jamais en chiffres. C2/C3 : zéro vocabulaire clinique ;
 * « impulsivité financière », « dangerosité », DGR, DEP_D/CALC_D, EC_DEP et
 * les noms d'auteurs du cadrage (Dew, Britt) restent moteur seul.
 *
 * Typo : apostrophe ASCII uniquement, pas d'insécable, guillemets français.
 * Règles : aucun code, score, sigle ou seuil ne franchit le rendu ;
 * phrases ≤ 22 mots dans les textes rédigés.
 */

import { avecEN } from '../i18n/apply';
import * as EN_Q34 from '../i18n/content/en/quete-3-4';

export interface QueteItem34 {
  code: string;
  text: string;
  /** 'D' = directe, 'I' = inversée (recodée 6 − r). */
  orient: 'D' | 'I';
  /** L'axe verbatim du tableau 01 — dépense ou calcul (moteur : regroupement
   *  du scorer ; les facettes — le coup de cœur, l'épargne, la comparaison,
   *  la visibilité des comptes — restent côté fiabilité moteur). */
  dim: string;
}

/** L'objet de passation affiché — code + énoncé (l'orientation reste côté moteur). */
export interface ItemsQuete34 {
  code: string;
  text: string;
}

/** Les 6 items carte — verbatim (01-tableau-des-items, ordre du tableau).
 *  AUCUNE trame Q3.4-T07/T08 ici : formulation hors dépôt (règle 11-b),
 *  jamais reconstituée, jamais affichée, jamais scorée. */
const ITEMS_FR: readonly QueteItem34[] = [
  {
    code: "Q3.4-01",
    text: "Quand un coup de cœur me plaît, je craque vite.",
    orient: "D",
    dim: "dépense",
  },
  {
    code: "Q3.4-02",
    text: "Devant un coup de cœur, je laisse passer la nuit.",
    orient: "I",
    dim: "dépense",
  },
  {
    code: "Q3.4-03",
    text: "Un euro non dépensé est un euro qui dort tranquille.",
    orient: "I",
    dim: "dépense",
  },
  {
    code: "Q3.4-04",
    text: "Mes achats se comparent, se chiffrent, se décident à froid.",
    orient: "D",
    dim: "calcul",
  },
  {
    code: "Q3.4-05",
    text: "Mes achats se décident sur place, sans feuille de route.",
    orient: "I",
    dim: "calcul",
  },
  {
    code: "Q3.4-06",
    text: "Je connais l'état de mes comptes au jour le jour.",
    orient: "D",
    dim: "calcul",
  },
];
export const ITEMS = avecEN(ITEMS_FR, EN_Q34.ITEMS);

/** Ordre de passation GELÉ — mélange graine 234427 (outil dédié v2, 5 passes
 *  identiques). Séquence livrable 8 positions : 01 · 04 · 02 · [T07] · 06 ·
 *  03 · 05 · [T08] — les trames ancrées en positions 4 · 8 (c3) sont
 *  SAUTÉES ici (formulations hors dépôt, règle 11-b) : la passation exposée
 *  porte les 6 items carte dans l'ordre relatif exact du mélange. Rien à
 *  « réparer » : c4 est sans-objet par arithmétique (2 violations minimales
 *  documentées — dépense {1, 3, 6} · calcul {2, 5, 7}). */
export const PASSATION: readonly string[] = [
  "Q3.4-01",
  "Q3.4-04",
  "Q3.4-02",
  "Q3.4-06",
  "Q3.4-03",
  "Q3.4-05",
];

const PAR_CODE = new Map(ITEMS.map((i) => [i.code, i]));

/** Le deck réel : les 6 items carte dans l'ordre gelé — les trames T07/T08
 *  n'y figurent jamais (aucune formulation n'existe au dépôt). */
export function deckQuete(): ItemsQuete34[] {
  return PASSATION.flatMap((c) => {
    const it = PAR_CODE.get(c);
    return it ? [{ code: it.code, text: it.text }] : [];
  });
}

/** Les deux axes du livrable (01-tableau — regroupement moteur du scorer).
 *  Paires R6 : 01×02 (le coup de cœur) · 04×05 (la comparaison) ; pivots
 *  mono : 03 (l'épargne qui dort) · 06 (la visibilité des comptes) — écart
 *  arithmétique 3/3 documenté, À VALIDER PAR LE COMITÉ. */
export type AxeId34 = 'dépense' | 'calcul';

/** Recodage Likert d'un item — les inversées comptent 6 − r (Arbitrage 1). */
function recode(reponse: number, orient: 'D' | 'I'): number {
  return orient === 'D' ? reponse : 6 - reponse;
}

/** Moyenne recodée par axe (min 1 item valide — fiche computation 06 : le
 *  score d'axe est la moyenne des items valides + prudence ; les drapeaux R6
 *  et la prudence restent côté moteur QFI, non implémentés ici). Un axe sans
 *  aucune réponse valide → 0 (hors passe — la passation fournit les 6). */
function calculeAxes(reponses: Record<string, number>): {
  dep: number;
  calc: number;
  valideDep: boolean;
  valideCalc: boolean;
} {
  const axes = new Map<string, { total: number; n: number }>();
  for (const code of PASSATION) {
    const it = PAR_CODE.get(code);
    const r = it ? reponses[it.code] : undefined;
    if (it && typeof r === 'number' && r >= 1 && r <= 5) {
      const a = axes.get(it.dim) ?? { total: 0, n: 0 };
      a.total += recode(r, it.orient);
      a.n += 1;
      axes.set(it.dim, a);
    }
  }
  const d = axes.get('dépense');
  const c = axes.get('calcul');
  return {
    dep: d && d.n > 0 ? d.total / d.n : 0,
    calc: c && c.n > 0 ? c.total / c.n : 0,
    valideDep: !!d && d.n > 0,
    valideCalc: !!c && c.n > 0,
  };
}

/** Normalisation 0-1 d'une moyenne Likert — (m − 1) / 4. */
function normalise(moyenne: number, valide: boolean): number {
  return valide ? (moyenne - 1) / 4 : 0;
}

export interface Bruts34 {
  /** Dépense déclarée, normalisée 0-1 — haut = dépensier (unité des seuils :
   *  déviations 0.15, bornes 0.35/0.65). */
  DEP_D: number;
  /** Calcul déclaré, normalisée 0-1 — haut = calculé. */
  CALC_D: number;
}

/** scoresBruts : les 2 axes en 0-1 normalisé — l'UNITÉ DES SEUILS du
 *  cartes.yaml (le livrable définit DEP_D/CALC_D directement normalisés :
 *  « I recodés, normalisée » 0-1). Les trames n'y entrent jamais. */
export function scoresBruts(reponses: Record<string, number>): Bruts34 {
  const { dep, calc, valideDep, valideCalc } = calculeAxes(reponses);
  return { DEP_D: normalise(dep, valideDep), CALC_D: normalise(calc, valideCalc) };
}

export interface Score34 {
  DEP_D: number;
  CALC_D: number;
  [k: string]: number;
}

/** Scorer EXPOSÉ (contrat app) : les 2 axes NORMALISÉS 0-1. Ici l'unité des
 *  seuils ÉTANT le 0-1, scoresBruts et scorer coïncident — les deux sont
 *  exposés par symétrie avec le contrat des autres quêtes. */
export function scorer(reponses: Record<string, number>): Score34 {
  const bruts = scoresBruts(reponses);
  return { DEP_D: bruts.DEP_D, CALC_D: bruts.CALC_D };
}

/** Les 5 variantes — ids VERBATIM (cartes.yaml, ordre du YAML).
 *  ⚠ CARTE-3.4-CŒUR-QUI-PAIE : la ligature Œ (U+0152) fait partie de la clé
 *  de données — copiée à l'octet exact, jamais normalisée. */
export type VarianteId34 =
  | 'CARTE-3.4-CŒUR-QUI-PAIE'
  | 'CARTE-3.4-RAISONNE'
  | 'CARTE-3.4-FLAIR'
  | 'CARTE-3.4-BIEN-TENUE'
  | 'CARTE-3.4-SAISONS';

/**
 * Sélecteurs VERBATIM (cartes.yaml — selection + SIG-3.4-01), évalués dans
 * l'ordre du YAML (ordre_selecteur) :
 *  1. central : max(dD, dC) ≤ 0.15 → l'entre-deux « selon les mois »
 *     (condition verbatim ordre_selecteur 5 ; dD = |DEP_D − 0.5|,
 *     dC = |CALC_D − 0.5|) ;
 *  2. les 4 quadrants — conditions verbatim 1 → 4 (dépensier×spontané ·
 *     dépensier×calculé · économe×spontané · économe×calculé, bornes
 *     strictes 0.65 / 0.35) ;
 *  3. zone intermédiaire (au moins un axe dans la bande centrale 0.35-0.65,
 *     qu'aucune condition stricte ne couvre) : opérationnalisation de «
 *     l'axe le plus dévié choisit le quadrant » — chaque axe penche du côté
 *     où il se trouve relativement à 0.5 (borne 0.5 comprise côté haut,
 *     convention déterministe — À VALIDER PAR LE COMITÉ, bornes FM-019).
 *     Les conditions strictes de l'étape 2 sont la restriction de cette
 *     lecture aux deux axes hors bande — l'extension rend la partition du
 *     carré [0,1]² totale (C6, exhaustivite du YAML).
 * Borne inclusive du central : les valeurs d'axe sont des multiples de 1/12
 * (3 items par axe) — 0.15, 0.35 et 0.65 sont inatteignables en arithmétique
 * exacte (0.15 × 12 = 1,8) ; la tolérance machine de 1e-9 honore
 * l'inclusivité du YAML sans rapprocher deux valeurs distinctes (écart
 * minimal réel = 1/12 ≈ 0,083).
 * Départage dD = dC : « l'axe dépense tranche (la 1re cause de dispute
 * documentée) » — règle de lecture du Livrable ; les deux côtés se lisant
 * ici sur leurs axes respectifs, l'égalité stricte ne survient que dans la
 * zone déjà tranchée par les conditions verbatim (conservée comme lecture
 * du profil, jamais rendue). Conditions et seuils restent côté moteur,
 * jamais affichés ; le signal DGR (2 trames — croisements 1.4 × 1.5) ne
 * participe JAMAIS à la sélection ni au rendu (SIG-3.4-03) ; l'écart à
 * l'autre (EC_DEP, SIG-3.4-02) non plus.
 */
export function choisirVariante(score: Score34): VarianteId34 {
  const s = (k: string): number => (typeof score[k] === 'number' ? score[k] : 0);
  const dep = s('DEP_D');
  const calc = s('CALC_D');
  const dD = Math.abs(dep - 0.5);
  const dC = Math.abs(calc - 0.5);
  // 1. central — condition verbatim (ordre_selecteur 5). Tolérance machine
  //    pour la borne INCLUSIVE ≤ 0.15 (voir docstring ci-dessus).
  if (Math.max(dD, dC) <= 0.15 + 1e-9) return 'CARTE-3.4-SAISONS';
  // 2. les 4 quadrants — conditions verbatim (ordre_selecteur 1 → 4).
  if (dep > 0.65 && calc < 0.35) return 'CARTE-3.4-CŒUR-QUI-PAIE';
  if (dep > 0.65 && calc > 0.65) return 'CARTE-3.4-RAISONNE';
  if (dep < 0.35 && calc < 0.35) return 'CARTE-3.4-FLAIR';
  if (dep < 0.35 && calc > 0.65) return 'CARTE-3.4-BIEN-TENUE';
  // 3. zone intermédiaire — « l'axe le plus dévié choisit le quadrant » :
  //    côtés relativement à 0.5 (borne 0.5 comprise côté haut).
  const depHaut = dep >= 0.5;
  const calcHaut = calc >= 0.5;
  if (depHaut && calcHaut) return 'CARTE-3.4-RAISONNE';
  if (depHaut && !calcHaut) return 'CARTE-3.4-CŒUR-QUI-PAIE';
  if (!depHaut && calcHaut) return 'CARTE-3.4-BIEN-TENUE';
  return 'CARTE-3.4-FLAIR';
}

export interface Carte {
  id: VarianteId34;
  nom: string;
  lumiere: string;
  ombre: string;
  tension: string;
}

/** Les 5 variantes de carte — verbatim (cartes.yaml, ordre du YAML :
 *  portrait → lumiere, tension_interieure → tension). Sélection : 2 axes
 *  (4 quadrants + central — partition totale C6). Neutralité : les cinq
 *  tempos se valent — le dépensier n'est pas irresponsable, l'économe n'est
 *  pas radin, le calculé n'est pas froid. Les 2 trames DGR ne participent ni
 *  à la sélection ni au texte (C2) ; zéro montant chiffré. */
export const CARTES: Record<VarianteId34, Carte> = {
  "CARTE-3.4-CŒUR-QUI-PAIE": {
    id: "CARTE-3.4-CŒUR-QUI-PAIE",
    nom: "Le·La Cœur qui paie",
    lumiere:
      "Ton argent suit ton cœur : les coups de cœur se vivent vite, les décisions se prennent sur place. L'argent circule et porte des moments — chez toi, une dépense est d'abord une émotion vraie.",
    ombre: "Le cœur paie sans lire : les fins de mois serrées guettent. La dispute d'argent arrive quand le compte se découvre après coup.",
    tension: "garder ton élan, en nommant une règle de compte que l'autre peut lire.",
  },
  "CARTE-3.4-RAISONNE": {
    id: "CARTE-3.4-RAISONNE",
    nom: "Le·La Collectionneur raisonné",
    lumiere:
      "Tu dépenses avec intention : les envies te prennent, mais tes achats se comparent et se décident à froid. Tes comptes se lisent au jour le jour — chez toi, dépenser est un choix, pas une glissade.",
    ombre: "L'intention convainc et enferme : tes bonnes raisons s'accumulent comme des factures, et l'autre entre dans une rationale déjà écrite.",
    tension: "assumer tes envies choisies, en laissant l'autre écrire une ligne de la règle.",
  },
  "CARTE-3.4-FLAIR": {
    id: "CARTE-3.4-FLAIR",
    nom: "Le·La Flair du futé",
    lumiere:
      "Ton argent dort tranquille et tes décisions se prennent vite : tu sais dire non sur le moment, et oui au bon instant. Pas de feuille de route — un flair qui garde la maison légère.",
    ombre: "Ton non rapide se lit comme une porte fermée : l'élan de l'autre s'arrête devant un verdict qu'il n'a pas vu venir.",
    tension: "garder ton flair, en disant ce que ton non protège.",
  },
  "CARTE-3.4-BIEN-TENUE": {
    id: "CARTE-3.4-BIEN-TENUE",
    nom: "Le·La Maison bien tenue",
    lumiere:
      "Ton argent se garde et se lit : l'euro non dépensé dort tranquille, les achats se comparent à froid. Tes comptes se suivent au jour le jour. Ta maison tient — la sécurité se respire chez toi.",
    ombre: "Le cadre protège et peut enfermer : une dépense d'envie de l'autre devient une demande de permission — une enveloppe d'envies ouvre une porte.",
    tension: "tenir ta maison, en ouvrant une enveloppe où le désir ne passe pas pour une faute.",
  },
  "CARTE-3.4-SAISONS": {
    id: "CARTE-3.4-SAISONS",
    nom: "Le·La Marée des mois",
    lumiere:
      "Ton argent ne vote ni cœur ni calcul. Selon les mois, tu craques ou tu laisses dormir, tu compares ou tu décides sur place. Ton tempo suit la saison — une aisance plus rare qu'elle n'y paraît.",
    ombre: "Ton tempo se lit mal : qui partage tes comptes cherche ta règle du mois. Elle se dit en trois mots — elle ne se devine pas.",
    tension: "suivre tes saisons, en donnant un mot d'avance sur ta règle du mois.",
  },
};

/** Textes du briefing — annonce VERBATIM (05-ecran-d-intro, 2 phrases), puces
 *  en couche app (ton Task 35, neutralité des profils : les 5 tempos se
 *  valent, l'argent n'est jamais jugé). */
export const BRIEFING = {
  annonce:
    "L'argent, c'est la première chose dont on se dispute en couple — et la dernière dont on parle. Ici, tu parles de ton tempo, sans leçon.",
  aQuoiCaSert: [
    "C'est la quête de ton terrain : le quotidien de l'argent, sujet dont on parle en dernier.",
    "Six affirmations balayent tes réflexes : le coup de cœur, la nuit qui passe, les comptes qui se lisent.",
    "Aucun montant, aucune bonne réponse — ton tempo se déclare en réflexes, pas en chiffres.",
    "Il en sort une carte, et une pierre de plus dans ton portrait.",
  ],
  resultats: [
    "Ta carte — ta lumière, ta zone d'ombre et ta tension du moment, en quelques mots.",
    "Tes tendances — ta dépense et ta façon de décider, en deux barres.",
    "Une pierre de plus dans ton portrait — la suite du voyage s'en nourrit.",
  ],
};

/** Textes de la fenêtre de complétion (carte) — entête, labels et fenêtre F1
 *  verbatim (cartes.yaml), miroirNote en couche app. */
export const COMPLETION = {
  entete: "🏡 QUÊTE ACCOMPLIE — « Ton rapport à l'argent »",
  labelOmbre: "Ta zone d'ombre :",
  labelTension: "Ta tension intérieure :",
  fenetre:
    "Quelque part, quelqu'un répond à ces mêmes questions. Le jour où vos cartes se croiseront, elles auront beaucoup à se dire.",
  miroirNote:
    "Ton miroir — la lecture complète de ton tempo d'argent — arrive à la prochaine étape du voyage.",
};

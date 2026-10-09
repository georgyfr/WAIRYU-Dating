/**
 * Quête 3.3 « Ton temps libre » — Monde 4 « Ton Terrain ».
 *
 * Contenu FIDÈLE au Livrable M4-3.3-Ton-Temps-Libre (branche
 * archive/v1-2026-10-05) :
 *  - ITEMS : les 8 items carte (verbatim 01-tableau-des-items, ordre du
 *    tableau, codes gelés Q3.3-01 → 08) — 2 volets carte × 2 paires miroir
 *    R6 : le MODE (la recharge 01×02 · le week-end 03×04) et le FOND des
 *    loisirs (l'activité de fond 05×06 · le partage 07×08) ; Likert 5
 *    (Arbitrage 2), recodage des inversées 6 − r (Arbitrage 1) ;
 *  - TRAMES ▲ Q3.3-T09 → T12 (signal CSR — 4 angles : écrans du soir ·
 *    tenter la chance · achats non prévus · travail-refuge) : AUCUNE
 *    formulation n'existe au dépôt (règle 11-b — document trames confidentiel
 *    hors dépôt, FM-018, codes gelés à jamais). La doctrine du livrable
 *    « les 4▲ passent PARMI LES AUTRES (même rendu, même échelle, même
 *    progression) » est INAPPLICABLE en l'état : sans formulation au dépôt,
 *    aucune phrase ne peut être affichée — et aucune n'est reconstituée.
 *    Traitement retenu (fiche audit M4, precedent quête 2.1) : le deck SAUTE
 *    les trames — jamais affichées, jamais scorées, jamais sélectionnées,
 *    jamais rendues. DIVERGENCE notée livrable ⇄ implémentation : LE
 *    LIVRABLE GAGNE sur tout le verbatim (items, cartes, briefing,
 *    complétion) ; sur les trames, le livrable lui-même consigne « aucun
 *    énoncé de trame dans ce dépôt » — la livraison « trames dans le deck »
 *    (doctrine ①) attend le document confidentiel (canal privé FM-018) ou un
 *    arbitrage fondateur documenté ;
 *  - statut double « MVP (trame) / P1.5 (quête) » (00-README) : ambiguïté de
 *    phase consignée aux ambiguïtés de l'audit (la trame MVP, la quête
 *    P1.5) — la fiche audit tranche le traitement pratique (trames sautées) ;
 *    c'est ce traitement qui est appliqué ici ;
 *  - PASSATION : l'ordre relatif des 8 items CARTE du mélange RÉEL graine
 *    233427 (02-plan-de-melange — 6/6 contraintes PASS, 2 échanges, run max 2
 *    ATTEINT sans le dépasser, 5 passes rejouées identiques ; trames ancrées
 *    par construction aux positions 3 · 6 · 9 · 12) ;
 *  - scorer : MODE_D = moyenne des 4 items mode (I recodés 6 − r) NORMALISÉE
 *    0-1 — haut = le dehors, bas = le chez-soi ; FOND_D = moyenne des 4 items
 *    fond, normalisée — haut = ancré et partagé. UNITÉ DES SEUILS : le
 *    cartes.yaml pose les bornes directement sur la centrifugie NORMALISÉE
 *    (« normalisée 0-1 ») — contrairement à la 2.1 (tension en échelle
 *    Likert), l'unité des seuils EST ici la normalisation 0-1 : scoresBruts
 *    (unité des seuils) et scorer (contrat app) livrent les mêmes valeurs.
 *    FOND_D n'entre JAMAIS dans la sélection (il enrichit le croisement
 *    conversationnel côté moteur — homogamie des loisirs en INFORMATION,
 *    jamais une norme : « il faut partager » est interdit au rendu) ;
 *  - CSR MOTEUR SEUL : le score des trames n'existe pas dans ce module
 *    (aucune réponse de trame n'y parvient) ; côté moteur de vigilance futur,
 *    SIG-3.3-03 (croisement 2.4 — fiabilité du profil ajustée, jamais une
 *    accusation ; seuil de vigilance T1 consigné hors dépôt ; demi-vie du
 *    signal) : jamais un affichage, jamais une exclusion, jamais une
 *    stigmatisation, jamais au score de compatibilité, jamais au premium.
 *    Le mot « consommations » et le sigle CSR ne franchissent JAMAIS le
 *    rendu (C2) — au rendu : le dehors, le chez-soi, le fond, les amis ;
 *  - EC_MODE (SIG-3.3-02, écart de mode entre deux profils) : calculé côté
 *    moteur de matching — jamais ici, jamais rendu (friction générique,
 *    les deux vécus symétriques : aucun des deux n'est « le problème ») ;
 *  - NEUTRALITÉ DU MODE (doctrine capitale du livrable) : sortir et rester =
 *    deux façons égales de se nourrir — le centrifuge n'est pas « instable »,
 *    le centripète n'est pas « casanier-rétréci », le mixte n'est pas
 *    « indécis » (trois jugements interdits au rendu) ;
 *  - choisirVariante : sélecteurs VERBATIM (cartes.yaml selection), évalués
 *    dans l'ordre du YAML : MODE_D > 0.65 → le grand air · 0.35-0.65 →
 *    l'entre-deux · < 0.35 → le cocon — partition exclusive + exhaustive de
 *    [0,1] (C6 ; aux bornes exactes 0.35 et 0.65, la plage « entre »
 *    s'applique, le > 0.65 étant strict). Bornes FM-019 ADOPTÉES comme
 *    valeurs de départ (provisoires concepteur — À VALIDER PAR LE COMITÉ,
 *    re-signature professionnelle avant bêta) : métadonnées moteur, jamais
 *    affichées ;
 *  - CARTES : les 3 variantes verbatim (cartes.yaml — portrait → lumiere,
 *    tension_interieure → tension ; ancre_item = Q3.3-01 → 08, les huit
 *    carte, PAS les trames) ;
 *  - BRIEFING : l'annonce est verbatim (05-ecran-d-intro, 2 phrases), les
 *    puces sont la couche app rédigée (ton Task 35).
 *
 * Typo : apostrophe ASCII uniquement, pas d'insécable, guillemets français.
 * Règles : aucun code, score, sigle ou seuil ne franchit le rendu ; aucune
 * métadonnée moteur dans un texte rendu ; phrases ≤ 22 mots dans les textes
 * rédigés ; facettes (« le ensemble assumé » sic — le rendu dit « avec
 * d'autres », décision 6 du 01) et concepts moteur jamais rendus (C3).
 */

import { avecEN } from '../i18n/apply';
import * as EN_Q33 from '../i18n/content/en/quete-3-3';

export interface QueteItem33 {
  code: string;
  text: string;
  /** 'D' = directe, 'I' = inversée (recodée 6 − r). */
  orient: 'D' | 'I';
  /** Le volet/angle verbatim du tableau 01 — regroupés en 2 axes (mode, fond). */
  dim: string;
}

/** L'objet de passation affiché — code + énoncé (l'orientation reste côté moteur). */
export interface ItemsQuete33 {
  code: string;
  text: string;
}

/** Les 8 items carte — verbatim (01-tableau-des-items, ordre du tableau).
 *  Facettes (moteur seul) : 01 la sortie qui porte · 02 le cocon qui porte ·
 *  03 le dehors choisi · 04 le dedans choisi · 05 l'ancrage · 06 le gré des
 *  envies · 07 « le ensemble assumé » (sic, verbatim — le rendu dit « avec
 *  d'autres ») · 08 le solo assumé.
 *  AUCUNE trame Q3.3-T09→T12 ici : formulation hors dépôt (règle 11-b),
 *  jamais reconstituée, jamais affichée, jamais scorée. */
const ITEMS_FR: readonly QueteItem33[] = [
  {
    code: "Q3.3-01",
    text: "Après une semaine chargée, je ressors pour recharger.",
    orient: "D",
    dim: "mode / la recharge",
  },
  {
    code: "Q3.3-02",
    text: "Après une semaine chargée, je recharge chez moi.",
    orient: "I",
    dim: "mode / la recharge",
  },
  {
    code: "Q3.3-03",
    text: "Un bon week-end, pour moi, se vit dehors.",
    orient: "D",
    dim: "mode / le week-end",
  },
  {
    code: "Q3.3-04",
    text: "Un bon week-end, pour moi, se passe à la maison.",
    orient: "I",
    dim: "mode / le week-end",
  },
  {
    code: "Q3.3-05",
    text: "J'ai au moins une activité de fond qui me porte.",
    orient: "D",
    dim: "fond / l'activité de fond",
  },
  {
    code: "Q3.3-06",
    text: "Mes loisirs changent au gré des envies, sans fond fixe.",
    orient: "I",
    dim: "fond / l'activité de fond",
  },
  {
    code: "Q3.3-07",
    text: "Mes loisirs de fond, je les vis avec d'autres.",
    orient: "D",
    dim: "fond / le partage",
  },
  {
    code: "Q3.3-08",
    text: "Mes loisirs de fond, je les vis en solo.",
    orient: "I",
    dim: "fond / le partage",
  },
];
export const ITEMS = avecEN(ITEMS_FR, EN_Q33.ITEMS);

/** Ordre de passation GELÉ — mélange RÉEL graine 233427 (02-plan-de-melange ;
 *  tentative 1, 2 échanges de réparation, run max 2 ATTEINT sans dépassé,
 *  5 passes rejouées identiques, aucune collision, aucun re-tirage).
 *  Séquence COMPLÈTE du livrable (12 positions) :
 *    Q3.3-05 · Q3.3-04 · Q3.3-T09 · Q3.3-07 · Q3.3-02 · Q3.3-T10 ·
 *    Q3.3-08 · Q3.3-01 · Q3.3-T11 · Q3.3-06 · Q3.3-03 · Q3.3-T12
 *  (trames ancrées par construction aux positions 3 · 6 · 9 · 12 — un bloc
 *  de 3 = 2 items carte + 1 trame, contrainte c3 ; les 4 trames D participent
 *  à l'alternance c5).
 *  Ici, PASSATION = l'ORDRE RELATIF DES ITEMS CARTE SEUL (les positions
 *  Q3.3-T09 · T10 · T11 · T12 sont sautées : aucune formulation n'existe au
 *  dépôt — règle 11-b ; les trames ne sont JAMAIS affichées, JAMAIS scorées,
 *  JAMAIS sélectionnées — precedent quête 2.1). */
export const PASSATION: readonly string[] = [
  "Q3.3-05", // pos 1 — T09 sautée en pos 3
  "Q3.3-04", // pos 2
  "Q3.3-07", // pos 4
  "Q3.3-02", // pos 5 — T10 sautée en pos 6
  "Q3.3-08", // pos 7
  "Q3.3-01", // pos 8 — T11 sautée en pos 9
  "Q3.3-06", // pos 10
  "Q3.3-03", // pos 11 — T12 sautée en pos 12
];

const PAR_CODE = new Map(ITEMS.map((i) => [i.code, i]));

/** Le deck réel : les 8 items carte dans l'ordre gelé — les trames n'y
 *  figurent jamais (aucune formulation n'existe au dépôt). */
export function deckQuete(): ItemsQuete33[] {
  return PASSATION.flatMap((c) => {
    const it = PAR_CODE.get(c);
    return it ? [{ code: it.code, text: it.text }] : [];
  });
}

/** Les 2 axes du livrable (moteur seul) et leurs items :
 *  MODE_D — centrifugie déclarée, Q3.3-01 → 04 ;
 *  FOND_D — ancrage-partage des loisirs de fond, Q3.3-05 → 08. */
export type AxeId33 = 'mode' | 'fond';

const CODES_PAR_AXE: Record<AxeId33, readonly string[]> = {
  mode: ['Q3.3-01', 'Q3.3-02', 'Q3.3-03', 'Q3.3-04'],
  fond: ['Q3.3-05', 'Q3.3-06', 'Q3.3-07', 'Q3.3-08'],
};

/** Recodage Likert d'un item — les inversées comptent 6 − r (Arbitrage 1). */
function recode(reponse: number, orient: 'D' | 'I'): number {
  return orient === 'D' ? reponse : 6 - reponse;
}

/** Moyenne LIKERT 1-5 par axe (inversés recodés) + validité (min 1 réponse
 *  valide par axe — la passation fournit les 8). Interne : les seuils du
 *  cartes.yaml sont posés sur la normalisation 0-1, pas sur cette échelle. */
function calculeAxes(reponses: Record<string, number>): {
  likert: Record<AxeId33, number>;
  norm: Record<AxeId33, number>;
  valide: Record<AxeId33, boolean>;
} {
  const likert = { mode: 0, fond: 0 } as Record<AxeId33, number>;
  const norm = { mode: 0, fond: 0 } as Record<AxeId33, number>;
  const valide = { mode: false, fond: false } as Record<AxeId33, boolean>;
  for (const axe of Object.keys(CODES_PAR_AXE) as AxeId33[]) {
    let total = 0;
    let n = 0;
    for (const code of CODES_PAR_AXE[axe]) {
      const it = PAR_CODE.get(code);
      const r = it ? reponses[it.code] : undefined;
      if (it && typeof r === 'number' && r >= 1 && r <= 5) {
        total += recode(r, it.orient);
        n += 1;
      }
    }
    if (n > 0) {
      likert[axe] = total / n;
      norm[axe] = (total / n - 1) / 4;
      valide[axe] = true;
    }
  }
  return { likert, norm, valide };
}

/** Les 2 axes NORMALISÉS 0-1 — l'UNITÉ DES SEUILS du cartes.yaml
 *  (« centrifugie MODE_D … normalisée 0-1 » ; bornes 0.65 / 0.35). Un axe
 *  sans réponse valide → 0 (hors passe). Les trames n'y entrent jamais. */
export interface Bruts33 {
  mode: number;
  fond: number;
}

/** scoresBruts : MODE_D et FOND_D en unité des seuils (0-1 normalisé —
 *  I recodés 6 − r). Contrairement à la 2.1, aucune conversion n'est
 *  nécessaire : le livrable pose les bornes sur la valeur normalisée. */
export function scoresBruts(reponses: Record<string, number>): Bruts33 {
  return calculeAxes(reponses).norm;
}

export interface Score33 {
  /** La centrifugie déclarée — moyenne des 4 items mode (I recodés),
   *  normalisée 0-1 (MODE_D côté moteur : le nom et le sigle restent hors
   *  rendu — au rendu : le dehors, le chez-soi). */
  mode: number;
  /** L'ancrage-partage des loisirs de fond — moyenne des 4 items fond,
   *  normalisée 0-1 (FOND_D côté moteur). N'entre JAMAIS dans la sélection :
   *  il enrichit le croisement conversationnel côté moteur (homogamie en
   *  information, jamais une norme). */
  fond: number;
  [k: string]: number;
}

/** Scorer EXPOSÉ (contrat app) : les 2 axes NORMALISÉS 0-1 — (moyenne
 *  Likert − 1) / 4. Ici, l'unité des seuils coïncide avec la normalisation :
 *  les valeurs sont celles de scoresBruts (voir l'en-tête). Axe sans aucune
 *  réponse valide → 0. Le CSR ne passe PAS par ce module (aucune réponse de
 *  trame ne parvient ici — moteur de vigilance futur, SIG-3.3-03). */
export function scorer(reponses: Record<string, number>): Score33 {
  const { norm } = calculeAxes(reponses);
  return { mode: norm.mode, fond: norm.fond };
}

/** Les 3 variantes — ids VERBATIM (cartes.yaml, ordre du YAML). */
export type VarianteId33 =
  | 'CARTE-3.3-GRAND-AIR'
  | 'CARTE-3.3-ENTRE-DEUX-RIVES'
  | 'CARTE-3.3-CHEMINEE';

/**
 * Sélecteurs VERBATIM (cartes.yaml — selection.logique), évalués dans
 * l'ordre du YAML (ordre_selecteur 1 → 3) :
 *  1. MODE_D > 0.65 → le grand air (le dehors) ;
 *  2. MODE_D 0.35-0.65 → l'entre-deux (les deux rives) ;
 *  3. MODE_D < 0.35 → le cocon (le chez-soi).
 * Partition exclusive + exhaustive de [0,1] (C6, vérifiée machine au
 * livrable) : aux bornes exactes 0.35 et 0.65, la plage « entre » s'applique
 * (le > 0.65 est strict). Le score FOND_D n'entre JAMAIS dans la sélection
 * (croisement conversationnel côté moteur — jamais la sélection) ; le score
 * CSR des trames n'y entre JAMAIS non plus (non_participant verbatim :
 * vigilance moteur seul, SIG-3.3-03) ; l'écart à l'autre (EC_MODE,
 * SIG-3.3-02) non plus. Bornes FM-019 ADOPTÉES comme valeurs de départ
 * (provisoires concepteur) — métadonnées moteur, jamais affichées.
 */
export function choisirVariante(score: Score33): VarianteId33 {
  const s = typeof score.mode === 'number' ? score.mode : 0;
  return s > 0.65
    ? 'CARTE-3.3-GRAND-AIR'
    : s >= 0.35
      ? 'CARTE-3.3-ENTRE-DEUX-RIVES'
      : 'CARTE-3.3-CHEMINEE';
}

export interface Carte {
  id: VarianteId33;
  nom: string;
  lumiere: string;
  ombre: string;
  tension: string;
}

/** Les 3 variantes de carte — verbatim (cartes.yaml, ordre du YAML :
 *  portrait → lumiere, tension_interieure → tension). NEUTRALITÉ DU MODE :
 *  les trois façons de se nourrir se valent — aucun mode dressé en idéal
 *  (C4), le centripète n'est pas « rétréci » (« pas un rétrécissement »
 *  assumé au portrait verbatim). L'homogamie ne se rend qu'en information
 *  conversationnelle (ombre) — jamais un critère, jamais une norme. */
export const CARTES: Record<VarianteId33, Carte> = {
  "CARTE-3.3-GRAND-AIR": {
    id: "CARTE-3.3-GRAND-AIR",
    nom: "Le·La Grand air",
    lumiere:
      "Ton énergie vient du dehors : après une semaine chargée, tu ressors et le monde te remplit. Les rues, les terrasses, les gens — tu reviens plus disponible que tu es partie.",
    ombre:
      "Le grand air emmène parfois : qui t'aime attend derrière la porte du monde. Une activité de fond à deux ramène ta ressource à la maison.",
    tension: "aller te nourrir dehors, en rapportant une part de ton temps libre à deux.",
  },
  "CARTE-3.3-ENTRE-DEUX-RIVES": {
    id: "CARTE-3.3-ENTRE-DEUX-RIVES",
    nom: "Le·La Rive du milieu",
    lumiere:
      "Ton énergie vient des deux rives : tantôt le dehors te recharge, tantôt le chez-toi. Tu glisses entre les modes selon les semaines — une souplesse qui épouse tes vraies envies.",
    ombre:
      "Ton mode se lit mal de l'extérieur : qui partage tes week-ends prépare deux scénarios. Ton mode de la semaine se dit en trois mots.",
    tension: "garder tes deux rives, en nommant celle où tu es cette semaine.",
  },
  "CARTE-3.3-CHEMINEE": {
    id: "CARTE-3.3-CHEMINEE",
    nom: "Le·La Cheminée allumée",
    lumiere:
      "Ton énergie se recharge derrière ta porte : la maison te rend à toi, le calme est ta vraie ressource. Ce n'est pas un rétrécissement — c'est une façon entière de se nourrir, et elle tient la distance.",
    ombre:
      "Le cocon ferme parfois : qui t'aime veut sortir avec toi. Une fenêtre de dehors à deux ouvre le dedans sans le vider.",
    tension: "te nourrir chez toi, en ouvrant une fenêtre de dehors à deux.",
  },
};

/** Textes du briefing — annonce VERBATIM (05-ecran-d-intro, 2 phrases), puces
 *  en couche app (ton Task 35, neutralité du mode : sortir et rester = deux
 *  façons égales de se nourrir). */
export const BRIEFING = {
  annonce:
    "Il y a ceux qui rechargent au grand air et ceux qui rechargent derrière la porte. Parle-nous de ton temps libre — il n'y a rien à corriger.",
  aQuoiCaSert: [
    "C'est la quête du terrain : d'où vient ton énergie quand la semaine s'arrête.",
    "Huit affirmations regardent ton temps libre : la recharge, le week-end, tes loisirs de fond, leur partage.",
    "Pas de bonne réponse — sortir et rester sont deux façons égales de se nourrir.",
    "À la fin, une carte — le reflet de ta façon de recharger, respectée comme elle est.",
  ],
  resultats: [
    "Ta carte — ta lumière, ta zone d'ombre et ta tension du moment, en quelques mots.",
    "Tes tendances — ton mode de recharge et le fond de tes loisirs, en deux barres.",
    "Une pierre de plus dans ton portrait — la suite du voyage s'en nourrit.",
  ],
};

/** Textes de la fenêtre de complétion (carte) — entête, labels et fenêtre F1
 *  verbatim (cartes.yaml ; F2 = fenêtre standard rotative du gabarit
 *  d'affichage, identique à toutes les quêtes), miroirNote en couche app. */
export const COMPLETION = {
  entete: "🏡 QUÊTE ACCOMPLIE — « Ton temps libre »",
  labelOmbre: "Ta zone d'ombre :",
  labelTension: "Ta tension intérieure :",
  fenetre:
    "Quelque part, quelqu'un répond à ces mêmes questions. Le jour où vos cartes se croiseront, elles auront beaucoup à se dire.",
  miroirNote:
    "Ton miroir — la lecture complète de ton temps libre — arrive à la prochaine étape du voyage.",
};

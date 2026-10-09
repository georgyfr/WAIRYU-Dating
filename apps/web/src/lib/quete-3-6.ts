/**
 * Quête 3.6 « Le choix visuel » — Monde 4 « Ton Terrain ».
 *
 * FORMAT SPÉCIAL DU MONDE : 8 paires d'images A/B — TÂCHE COMPORTEMENTALE
 * (pas de Likert, pas d'orientation D/I, pas d'abstention — précédent 1.5).
 *
 * Contenu FIDÈLE au Livrable M4-3.6-Le-Choix-Visuel :
 *  - PAIRES : les 8 paires (verbatim 01-tableau-des-paires, ordre du tableau
 *    Q3.6-P1 → P8) — chaque paire porte le THÈME (le cadre affiché), les deux
 *    LIBELLÉS A/B verbatim (≤ 12 mots) et le PÔLE D'ANCRAGE côté moteur
 *    (mapping fiche : P1-A · P2-A · P3-B · P4-B · P5-A · P6-B · P7-A · P8-B) ;
 *  - PASSATION : l'ordre GELÉ (mélange graine 236427 — 1 tentative, 0 échange,
 *    objectif totalement nul ; c5 SANS-OBJET par config : run_max 0 = non
 *    mesuré, hors Likert ; 0 trame ▲ ; 8 thèmes distincts, 1 paire chacun) :
 *    P7 · P6 · P1 · P4 · P8 · P3 · P5 · P2. La graine est posée telle quelle :
 *    AUCUN algorithme du dépôt ne la consomme — ne rien mélanger ;
 *  - scorer : VISO_ANC = nombre de choix du pôle d'ancrage (0-8, entiers —
 *    l'unité des seuils) · VISO_HOR = 8 − VISO_ANC. Partition SIG-3.6-01 :
 *    ancré-dominant ≥ 6 · équilibre 3-5 · horizon-dominant ≤ 2 (exclusive +
 *    exhaustive de 0 à 8). Le scorer EXPOSÉ (contrat app) normalise 0-1
 *    (compte / 8) ; scoresBruts expose les entiers 0-8 ;
 *  - CARTES : les 3 « brise-glaces » verbatim (cartes.yaml — portrait →
 *    lumiere, tension_interieure → tension) ;
 *  - AMORCES : les 8 amorces de conversation verbatim (01) — le produit
 *    premier de la quête (brise-glaces du Mode Invisible) ;
 *  - BRIEFING : annonce VERBATIM (05-ecran-d-intro, 2 phrases) ; puces en
 *    couche app rédigée (ton Task 35) — PAS d'abstention : on choisit
 *    TOUJOURS.
 *
 * RÈGLES DU LIVRABLE (gravées ici — toutes actives) :
 *  - TÂCHE PROJECTIVE, MESURE FAIBLE : signal complémentaire « jamais seule,
 *    jamais clinique » — les paires ne participent JAMAIS seules à un score
 *    de compatibilité, jamais à un filtre, jamais au matching ; le miroir ne
 *    se rend qu'EN COMPLÉMENT d'autres restitutions du Monde (verrou 04 n° 4) ;
 *  - RÉPONSE PAR PÔLE, JAMAIS PAR CÔTÉ : la correspondance choix → pôle se
 *    fait sur l'ID du pôle (ancre/horizon) via poleChoisi(), jamais sur le
 *    côté gauche/droite de l'écran — l'ordre A/B est un paramètre de design
 *    (anti-ancrage positionnel, documenté au 01). La réponse brute reste
 *    l'index d'option + 1 (A = 1, B = 2 — précédent 1.5) ; le score décode
 *    par le pôle, donc il ne dépend d'aucune position d'écran ;
 *  - PAS D'ABSTENTION : pas d'échelle, pas de « je ne sais pas », pas de
 *    « les deux » ni de « aucune » — le choix binaire est assumé (le choix
 *    est le message ; l'abstention casserait la tâche) ;
 *  - P6 (les deux portes) : CANAL SIGNAL signal_id NULL — la lecture
 *    complémentaire faible éventuelle (contrôle/isolement) n'est PAS
 *    calculée, PAS sélectionnée, JAMAIS rendue (Arbitrage 4 : « lecture
 *    complémentaire, code à arbitrer par le comité si requis » — toute
 *    activation passera par une Fiche de Mutation). La paire compte dans
 *    VISO_ANC comme les autres (pôle B = ancre) et ne se distingue PAS
 *    visuellement des autres (indiscernabilité du rendu) ;
 *  - ÉQUIVALENCE DE VALEUR : les deux choix de chaque paire sont enviables —
 *    les libellés affichés ne portent JAMAIS de hiérarchie ; zéro image
 *    pathologique, refus Rorschach/TAT (la projection ne se diagnostique
 *    pas) ; aucune asymétrie de jugement entre l'ancre et l'horizon ;
 *  - AMORCES = BRISE-GLACES : chaque paire choisie devient un prompt de
 *    conversation naturel du Mode Invisible — l'amorce cite l'image choisie
 *    (« ton intérieur choisi dit quelque chose »), jamais un lecteur, jamais
 *    un score, jamais une dominante ;
 *  - FM-019 : les bornes ≥ 6 / 3-5 / ≤ 2 sont ADOPTÉES comme valeurs de
 *    départ (provisoires concepteur — À VALIDER PAR LE COMITÉ, re-signature
 *    professionnelle avant bêta) ; métadonnées moteur, jamais affichées ;
 *  - C2/C3 : zéro trame ▲ (n_trames = 0 — AUCUNE formulation au dépôt) ;
 *    aucun code, score, sigle ou seuil ne franchit le rendu (VISO_ANC,
 *    VISO_HOR, SIG-3.6-01/02, « pôle d'ancrage » restent moteur).
 *
 * ASSETS DESIGN PLUS TARD : cette livraison porte les libellés + le scoring.
 * Les scènes de référence (champ noteDesign) sont des NOTES POUR LE DESIGN —
 * MOTEUR SEUL, JAMAIS rendues à l'écran. Aucun visuel n'existe dans ce
 * module : l'écran « images » (format d'écran dédié, à créer par l'agent
 * intégrateur côté QueteDef/Quete.tsx) branchera les assets quand le design
 * livrera. La structure de données est prête : deckQuete() rend des items
 * {code, text = thème, choixA, choixB} — structure compatible ItemPassation,
 * même codage de réponse (index + 1) que la quête 1.5, réutilisable par le
 * futur format 'images' via repondre(item.code, 1 | 2). Les tags UI
 * « Maintenant/Plus tard » de la tâche 1.5 ne s'appliquent PAS ici (aucun
 * axe temps — fiche audit 6.13) : le rendu ne doit JAMAIS passer par la
 * branche 'choix' générique telle quelle.
 *
 * Typo : apostrophe ASCII uniquement, pas d'insécable, guillemets français.
 */

import type { ItemPassation } from './quetes';
import { avecEN } from '../i18n/apply';
import * as EN_Q36 from '../i18n/content/en/quete-3-6';

/** Les deux pôles du moteur — JAMAIS rendus tels quels (zéro jargon). */
export type Pole36 = 'ancre' | 'horizon';

export interface Paire36 {
  /** Le code gelé de la paire (Q3.6-P1 → Q3.6-P8). */
  code: string;
  /** Le thème — le cadre affiché (verbatim 01 : « Les intérieurs »…). */
  theme: string;
  /** Le libellé A affiché — verbatim, ≤ 12 mots, jamais hiérarchisé. */
  labelA: string;
  /** Le libellé B affiché — verbatim, ≤ 12 mots, jamais hiérarchisé. */
  labelB: string;
  /** Le pôle du choix A (moteur) — fiche 01, colonne « Pôle d'ancrage ». */
  poleA: Pole36;
  /** Le pôle du choix B (moteur). */
  poleB: Pole36;
  /** Les scènes de référence A/B — notes pour le DESIGN (ce que l'image
   *  montre, en une ligne) : MOTEUR SEUL, JAMAIS rendues à l'écran. */
  noteDesign?: { a: string; b: string };
}

/** Les 8 paires — verbatim (01-tableau-des-paires, ordre du tableau).
 *  P1-P4 = conversion verbatim du source gelé · P5-P8 = production neuve
 *  déclarée (angles complémentaires). P6 porte signal_id null (Arbitrage 4)
 *  sans aucun traitement spécial au rendu — voir règle en en-tête. */
const PAIRES_FR: readonly Paire36[] = [
  {
    code: "Q3.6-P1",
    theme: "Les intérieurs",
    labelA: "Une vie qui se passe autour de la maison",
    labelB: "Une vie qui se passe dehors, à l'air libre",
    poleA: "ancre",
    poleB: "horizon",
    noteDesign: {
      a: "salon chaleureux, lumière du soir, rideaux mi-clos",
      b: "terrasse de rue, tabourets hauts, passants",
    },
  },
  {
    code: "Q3.6-P2",
    theme: "Les paysages",
    labelA: "La stabilité apaisante",
    labelB: "Les horizons changeants",
    poleA: "ancre",
    poleB: "horizon",
    noteDesign: {
      a: "prairie close, arbre centenaire, l'eau calme",
      b: "crête ouverte, sentier qui part, ciel de vent",
    },
  },
  {
    code: "Q3.6-P3",
    theme: "Les tables",
    labelA: "Le festin partagé",
    labelB: "Le repas sobre à deux",
    poleA: "horizon",
    poleB: "ancre",
    noteDesign: {
      a: "grande table pleine, plats au centre, mains qui se servent",
      b: "table étroite, deux assiettes, une bougie",
    },
  },
  {
    code: "Q3.6-P4",
    theme: "Les scènes",
    labelA: "Le groupe animé",
    labelB: "Le tête-à-tête",
    poleA: "horizon",
    poleB: "ancre",
    noteDesign: {
      a: "cour lumineuse, rires, gestes qui se croisent",
      b: "deux chaises face à face, le monde au loin",
    },
  },
  {
    code: "Q3.6-P5",
    theme: "Les deux matins",
    labelA: "Le café lent, à la maison, sans programme",
    labelB: "Le marché du quartier, à l'improviste",
    poleA: "ancre",
    poleB: "horizon",
    noteDesign: {
      a: "table de cuisine, vapeur du café, chaussettes",
      b: "étals colorés, sac en toile, rue qui s'éveille",
    },
  },
  {
    // P6 — les deux portes : CANAL SIGNAL signal_id null (Arbitrage 4 —
    // lecture complémentaire faible éventuelle contrôle/isolement, code à
    // arbitrer par le comité si requis). AUCUNE lecture n'est calculée ni
    // rendue ; la paire se compte dans VISO_ANC comme les autres (B = ancre)
    // et ne se distingue PAS visuellement (indiscernabilité du rendu).
    code: "Q3.6-P6",
    theme: "Les deux portes",
    labelA: "La porte toujours ouverte — les visites entrent",
    labelB: "La porte fermée sur le cocon",
    poleA: "horizon",
    poleB: "ancre",
    noteDesign: {
      a: "porte entrouverte, chaussures au seuil, bruit de cuisine",
      b: "porte close, lumière douce qui filtre, silence",
    },
  },
  {
    code: "Q3.6-P7",
    theme: "Les deux dimanches",
    labelA: "Le dimanche cadencé — les rituels",
    labelB: "Le dimanche sans programme — le jour qui se dessine en marchant",
    poleA: "ancre",
    poleB: "horizon",
    noteDesign: {
      a: "même café, même boulangerie, même table",
      b: "carrefour, pancake inversé, sans destination",
    },
  },
  {
    code: "Q3.6-P8",
    theme: "Les deux fenêtres",
    labelA: "La fenêtre sur la ville vivante",
    labelB: "La fenêtre sur le calme",
    poleA: "horizon",
    poleB: "ancre",
    noteDesign: {
      a: "façades animées, cafés, bus qui passe",
      b: "feuillage, toits discrets, oiseaux",
    },
  },
];
export const PAIRES = avecEN(PAIRES_FR, EN_Q36.PAIRES);

/** Ordre de passation GELÉ — mélange graine 236427 (Fisher-Yates, 0 échange :
 *  l'objectif est totalement nul dès le tirage ; rejeu 5 passes identiques).
 *  c5 SANS-OBJET par config (paires d'images — hors Likert, run_max 0 = non
 *  mesuré) · c2/c3 sans objet de fait (0 trame ▲) · c4 sans objet par config
 *  (8 thèmes distincts, 1 paire chacun). La 1ʳᵉ paire vue est Q3.6-P7 (les
 *  deux dimanches), la dernière Q3.6-P2 (les deux paysages). */
export const PASSATION: readonly string[] = [
  "Q3.6-P7",
  "Q3.6-P6",
  "Q3.6-P1",
  "Q3.6-P4",
  "Q3.6-P8",
  "Q3.6-P3",
  "Q3.6-P5",
  "Q3.6-P2",
];

const PAR_CODE = new Map(PAIRES.map((p) => [p.code, p]));

/**
 * Le deck de passation : les 8 paires dans l'ordre gelé — une paire par
 * écran. Structure compatible ItemPassation (moule 1.5 : text = le cadre,
 * choixA/choixB = les deux libellés ; réponse = index d'option + 1).
 * L'écran destiné à cette quête est le format « images » (à créer par
 * l'intégrateur) : deux visuels + leurs libellés, cible tactile ≥ 44 px —
 * JAMAIS la branche 'choix' générique (tags « Maintenant/Plus tard » sans
 * objet ici) et JAMAIS d'option d'abstention (pas de « les deux »/« aucune »).
 * Le pôle d'ancrage ne fuite jamais au rendu.
 */
export function deckQuete(): ItemPassation[] {
  return PASSATION.flatMap((c) => {
    const p = PAR_CODE.get(c);
    return p
      ? [{ code: p.code, text: p.theme, format: 'choix' as const, choixA: p.labelA, choixB: p.labelB }]
      : [];
  });
}

/** Décodage RÉPONSE → PÔLE (le contrat anti-côté du Livrable) : 1 = choix A,
 *  2 = choix B (index d'option + 1) ; la valeur renvoyée est l'ID du pôle —
 *  jamais une position d'écran. Réponse absente ou hors bornes → null (non
 *  posée — jamais d'inférence). */
export function poleChoisi(code: string, reponse: number | undefined): Pole36 | null {
  const p = PAR_CODE.get(code);
  if (!p || reponse !== 1 && reponse !== 2) return null;
  return reponse === 1 ? p.poleA : p.poleB;
}

/** Les scores en ENTIERS 0-8 — l'unité des seuils SIG-3.6-01 (partition
 *  ≥ 6 / 3-5 / ≤ 2). VISO_ANC = nombre de choix du pôle d'ancrage ;
 *  VISO_HOR = 8 − VISO_ANC (complémentaire, jamais négatif — la passation
 *  n'a pas d'abstention : les 8 paires sont posées). La lecture
 *  complémentaire P6 n'entre dans AUCUN score (Arbitrage 4). */
export interface Bruts36 {
  VISO_ANC: number;
  VISO_HOR: number;
  [k: string]: number;
}

export function scoresBruts(reponses: Record<string, number>): Bruts36 {
  let anc = 0;
  for (const p of PAIRES) {
    if (poleChoisi(p.code, reponses[p.code]) === 'ancre') anc += 1;
  }
  return { VISO_ANC: anc, VISO_HOR: 8 - anc };
}

export interface Score36 {
  VISO_ANC: number;
  VISO_HOR: number;
  [k: string]: number;
}

/** Scorer EXPOSÉ (contrat app) : normalisation 0-1 = compte / 8.
 *  Un compte manquant reste 0 (hors passe). */
export function scorer(reponses: Record<string, number>): Score36 {
  const brut = scoresBruts(reponses);
  return { VISO_ANC: brut.VISO_ANC / 8, VISO_HOR: brut.VISO_HOR / 8 };
}

/** Les 3 variantes — ids VERBATIM (cartes.yaml, ordre_selecteur 1 → 3). */
export type VarianteId36 = 'CARTE-3.6-ANCRE' | 'CARTE-3.6-EQUILIBRE' | 'CARTE-3.6-HORIZON';

/**
 * Sélecteur VERBATIM (cartes.yaml — selection.logique) :
 *   VISO_ANC ≥ 6 → l'ancre · 3-5 → l'équilibre · ≤ 2 → l'horizon.
 * UNITÉ DES SEUILS : la partition vit sur le COMPTE entier 0-8 (SIG-3.6-01)
 * tandis que le scorer exposé livre la part 0-1 — la reconstruction
 * compte = part × 8, arrondie au plus proche, est EXACTE sans perte
 * (même voie que 1.5/2.1). Partition exclusive + exhaustive de 0 à 8 :
 * chaque profil tombe dans exactement une variante (déterministe).
 * La lecture complémentaire P6 ne participe JAMAIS à la sélection ni au
 * rendu ; le lecteur ne participe JAMAIS seul à un score de compatibilité
 * (mesure faible). Bornes FM-019 ADOPTÉES comme valeurs de départ
 * (provisoires concepteur — À VALIDER PAR LE COMITÉ).
 */
export function choisirVariante(score: Score36): VarianteId36 {
  const part = typeof score.VISO_ANC === 'number' ? score.VISO_ANC : 0;
  const anc = Math.round(part * 8);
  if (anc >= 6) return 'CARTE-3.6-ANCRE';
  if (anc >= 3) return 'CARTE-3.6-EQUILIBRE';
  return 'CARTE-3.6-HORIZON';
}

export interface Carte {
  id: VarianteId36;
  nom: string;
  lumiere: string;
  ombre: string;
  tension: string;
}

/** Les 3 cartes « brise-glaces » — verbatim (cartes.yaml, ordre du YAML :
 *  portrait → lumiere, tension_interieure → tension). Format
 *  etage_1_carte_briseglace : le produit premier est conversationnel — la
 *  carte est un brise-glace, jamais une lecture psychologique, jamais au
 *  matching seule, rendue en complément uniquement (verrou 04 n° 4).
 *  AUCUNE trace de la lecture P6 (Arbitrage 4) dans les textes rendus. */
export const CARTES: Record<VarianteId36, Carte> = {
  "CARTE-3.6-ANCRE": {
    id: "CARTE-3.6-ANCRE",
    nom: "Le·La Portefeuille d'images posées",
    lumiere:
      "Tes images penchent au repos : la maison, la stabilité, le café lent, le dimanche cadencé. Tu choisis des lieux qui te portent — et qui font de bons débuts de conversation.",
    ombre:
      "L'ancre rassure et se ferme : les journées se ressemblent, un autre s'ennuie. La fenêtre ne change pas assez pour qui voudrait partir.",
    tension: "choisir tes lieux qui portent, en gardant une image dehors pour l'aventure.",
  },
  "CARTE-3.6-EQUILIBRE": {
    id: "CARTE-3.6-EQUILIBRE",
    nom: "Le·La Trousse d'images variées",
    lumiere:
      "Tes images se partagent : tantôt la maison, tantôt le dehors — le festin et le repas sobre, la tribu et le tête-à-tête. Tu navigues entre le calme et l'air libre sans y perdre ton fil.",
    ombre:
      "Ta variété se lit mal : qui partage tes week-ends ne sait pas si tu veux rester ou sortir. Ton image de la semaine se dit.",
    tension: "garder tes deux couleurs, en disant l'image de ta semaine.",
  },
  "CARTE-3.6-HORIZON": {
    id: "CARTE-3.6-HORIZON",
    nom: "Le·La Portefeuille d'images ouvertes",
    lumiere:
      "Tes images penchent dehors : la terrasse, le festin, le groupe, la ville qui bouge. Tu choisis des lieux où le monde entre — tes débuts de conversation se racontent tout seuls.",
    ombre:
      "L'horizon emmène et dépense : la maison devient parfois un couloir. Un chez-soi à partager avec le monde — et un autre qui a besoin de rentrer.",
    tension: "choisir tes lieux où le monde entre, en gardant une image dedans pour le retour.",
  },
};

/** Les 8 amorces de conversation — verbatim (01, ordre du tableau P1 → P8).
 *  Brise-glaces du Mode Invisible : l'amorce cite l'image choisie, jamais un
 *  lecteur, jamais une dominante, jamais un score. Export séparé pour
 *  l'écran de complétion (spécificité brise-glace du cartes.yaml). */
export interface Amorce36 {
  /** Le code de la paire (Q3.6-P1 → Q3.6-P8). */
  id: string;
  texte: string;
}

const AMORCES_FR: readonly Amorce36[] = [
  { id: "Q3.6-P1", texte: "Ton intérieur choisi dit quelque chose — raconte." },
  { id: "Q3.6-P2", texte: "Ton paysage choisi parle de ta façon d'avancer — ou de rester." },
  { id: "Q3.6-P3", texte: "Ta table choisie raconte tes fêtes idéales." },
  { id: "Q3.6-P4", texte: "Ta scène choisie dit ce qui te recharge — la tribu ou le duo." },
  { id: "Q3.6-P5", texte: "Ton matin choisi dit comment ton week-end commence vraiment." },
  { id: "Q3.6-P6", texte: "Ta porte choisie dit comment tu accueilles — et comment tu te protèges." },
  { id: "Q3.6-P7", texte: "Ton dimanche choisi dit ce qu'un jour libre veut dire pour toi." },
  { id: "Q3.6-P8", texte: "Ta fenêtre choisie dit la vue dont tu as besoin au réveil." },
];
export const AMORCES = avecEN(AMORCES_FR, EN_Q36.AMORCES);

/** Textes du briefing — annonce VERBATIM (05-ecran-d-intro, 2 phrases) ;
 *  puces en couche app rédigée. PAS d'abstention : on choisit TOUJOURS. */
export const BRIEFING = {
  annonce:
    "Pas de questions cette fois. Juste des images — choisis celle qui te parle. Il n'y a pas de bonne réponse : ton choix dit quelque chose, il ne note rien.",
  aQuoiCaSert: [
    "Huit paires d'images, une à la fois : à chaque écran, tu choisis celle qui te parle le plus.",
    "Les deux images se valent — aucune n'est la bonne, aucune ne piège l'autre.",
    "Pas de « les deux », pas de « aucune » : on choisit à chaque écran — c'est le choix entier qui parle.",
    "Ça ne note rien : tes images choisies deviennent des amorces de conversation, pas un score.",
  ],
  resultats: [
    "Ta carte brise-glace — ta teinte d'images, en quelques mots à partager.",
    "Tes amorces — tes images choisies tournées en débuts de conversation.",
    "Une pierre de plus dans ton portrait — la suite du voyage s'en nourrit.",
  ],
};

/** Textes de la fenêtre de complétion — entête, labels et fenêtre F1 verbatim
 *  (cartes.yaml). Le MIROIR de cette quête ne s'affiche qu'EN COMPLÉMENT
 *  d'autres restitutions du Monde (verrou 04 n° 4 — mécanique d'affichage à
 *  câbler côté rendu) : la note le dit tel quel. Spécificité brise-glace :
 *  les cartes du Mode Invisible citent les images choisies (AMORCES) comme
 *  amorces de conversation — le produit premier (refonte verbatim). */
export const COMPLETION = {
  entete: "🏡 QUÊTE ACCOMPLIE — « Le choix visuel »",
  labelOmbre: "Ta zone d'ombre :",
  labelTension: "Ta tension intérieure :",
  fenetre:
    "Quelque part, quelqu'un répond à ces mêmes questions. Le jour où vos cartes se croiseront, elles auront beaucoup à se dire.",
  miroirNote:
    "Ton miroir d'images — une teinte, pas un diagnostic — s'affiche en complément des autres lectures du voyage.",
};

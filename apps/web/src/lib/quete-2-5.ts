/**
 * Quête 2.5 « Ce que tu cherches » — Monde 3 « La Boussole ».
 *
 * FORMAT BINAIRE (NON-Likert) + 4ᵉ réponse globale « Je découvre » :
 * 3 énoncés assumés (≤ 8 mots, tutoiement, présent), réponse Oui / Non —
 * plus une réponse globale de quête, PAS un item (hors contrat de mélange).
 *
 * Contenu FIDÈLE au Livrable M3-2.5-Ce-Que-Tu-Cherches (branche
 * archive/v1-2026-10-05) :
 *  - ITEMS : les 3 énoncés VERBATIM (01-tableau-des-items, codes gelés
 *    Q2.5-01 → Q2.5-03) ;
 *  - PASSATION : l'ordre gelé du plan de mélange — graine 25428, issue d'un
 *    RE-TIRAGE DOCUMENTÉ (25427 rendait la permutation identique à l'ordre
 *    des codes → c6 échouée → graine + 1). Ordre réel : 01, 03, 02 — JAMAIS
 *    l'ordre des codes (02-plan-de-melange-graine-25428) ;
 *  - MESSAGE_DOUX : libellé VERBATIM du bloc « Incomplétude assumée »
 *    (01-tableau) — décision comité FM-019. Le document cite le libellé entre
 *    guillemets français « » (délimiteurs de citation, comme chaque autre
 *    libellé du livrable) : la constante porte le message propre, AVEC les
 *    guillemets internes “ ” (U+201C/U+201D) autour de « Je découvre »,
 *    copiés caractères par caractères ;
 *  - CARTES : les 4 variantes VERBATIM (cartes.yaml v2, mission VAGUE 5 —
 *    une carte PAR INTENTION, y compris « Je découvre » ; la v1 à 2 variantes
 *    est remplacée par reversal documenté). Portrait → lumière, ombre →
 *    ombre, tension_interieure → tension ;
 *  - BRIEFING.annonce : VERBATIM (05-ecran-d-intro, 2 phrases) ; le reste des
 *    textes est la couche app rédigée.
 *
 * CONTRAT DE RÉPONSES (app) : chaque binaire stocke Oui = 1, Non = 2 (index
 * d'option + 1, comme le format choix 1.5). La 4ᵉ réponse « Je découvre »
 * n'écrase RIEN : l'orchestrateur pose la clé INTENTION_CODE
 * ('Q2.5-intention', valeur libre — 1 par convention) dans le même enregistre-
 * ment ; la PRÉSENCE de la clé suffit à déclarer l'état d'exploration, et les
 * binaires existants restent modifiables (01-tableau, FM-019).
 *
 * AGRÉGAT D'INTENTION (intentionAffichee — table EXACTE du 01-tableau,
 * précédences selon l'ordre du sélecteur cartes.yaml 1 → 6) :
 *   01=Oui & 03=Oui                    → 'contradiction'    (drapeau QFI,
 *     MOTEUR SEUL + miroir dégradé d'un degré — JAMAIS de texte accusateur,
 *     jamais la juxtaposition des deux réponses en reproche, SIG-2.5-02)
 *   01=Oui & 03=Non                    → 'exclusivite'      (02 sans objet)
 *   01=Non & 02=Oui & 03=Non           → 'decouverte'
 *   03=Oui (sans 01=Oui)               → 'non_exclusivite'
 *   01=Non & 02=Non & 03=Non           → 'aucune'           (aucune intention
 *     lisible → message doux + « Je découvre » proposé — état incomplet,
 *     PAS fautif ; incomplétude assumée, aucun texte ne prétend lire « toute »
 *     l'intention)
 *   clé 'Q2.5-intention' présente      → 'exploration'      (l'état déclaré
 *     prime — compatible avec tout : aucun dealbreaker, aucun drapeau)
 *   réponses binaires manquantes       → 'aucune' (aucune combinaison docu-
 *     mentée ne s'applique : « aucune intention lisible » — état neutre ;
 *     le MOMENT d'afficher le message doux reste du ressort de l'orchestrateur,
 *     qui le rend après les 3 binaires comme le documente le livrable).
 *
 * SÉLECTEUR DE CARTE (choisirVariante — conditions EXACTES cartes.yaml,
 * évaluées dans l'ordre du YAML, première correspondance retenue) :
 *   ordre 1 · 'exploration'    → CARTE-2.5-JEDECOUVRE
 *   ordre 2 · 'contradiction'  → CARTE-2.5-JEDECOUVRE (repli neutre — le
 *               drapeau QFI ne s'expose JAMAIS en carte, cas limite routé)
 *   ordre 3 · 'non_exclusivite'→ CARTE-2.5-LIBRE
 *   ordre 4 · 'exclusivite'    → CARTE-2.5-EXPL
 *   ordre 5 · 'decouverte'     → CARTE-2.5-DECOU
 *   ordre 6 · 'aucune'         → CARTE-2.5-JEDECOUVRE (+ message doux à l'écran)
 * L'ENCHAÎNEMENT orchestrateur choisirVariante(scorer(reponses)) fonctionne
 * tel quel : scorer renvoie { intention, ... } et la sélection ne dépend QUE
 * de l'intention (fidèle au YAML — 4 cartes pour 4 intentions, cas limites
 * routés, exhaustivité vérifiée machine sur les 8 combinaisons + la 4ᵉ).
 *
 * DOCTRINE (non négociable) : SIG-2.5-03 (décalage affiché × vécu — tromperie)
 * est MOTEUR SEUL EN ATTENTE D'ACTIVATION : jamais de texte, jamais de statut,
 * jamais d'allusion, ni à l'utilisateur ni au match. Aucun teaser du croisement
 * 6.1 (premium M8, opt-in) nulle part dans les textes rendus. L'intention est
 * DATÉE (« aujourd'hui »), jamais figée en trait permanent. Aucun code, score
 * ni sigle (QFI reste côté moteur) ne franchit le rendu. Apostrophes ASCII.
 */

/** Un item binaire de la quête — l'énoncé verbatim, sans les options (Oui/Non). */
import { avecEN } from '../i18n/apply';
import * as EN_Q25 from '../i18n/content/en/quete-2-5';

export interface QueteItem25 {
  code: string;
  text: string;
}

/** Les 3 binaires — verbatim (01-tableau-des-items), ordre des codes. */
const ITEMS_FR: readonly QueteItem25[] = [
  { code: 'Q2.5-01', text: 'Tu cherches une relation exclusive.' },
  { code: 'Q2.5-02', text: 'Tu cherches une rencontre, sans plan précis.' },
  { code: 'Q2.5-03', text: "L'exclusivité n'est pas ce que tu vises aujourd'hui." },
];
export const ITEMS = avecEN(ITEMS_FR, EN_Q25.ITEMS);

/**
 * L'ordre de passation GELÉ — plan de mélange graine 25428 (re-tirage
 * documenté 25427 → 25428, verdicts c1-c6 : 6/6 PASS). Le deck de passation
 * suit cet ordre, jamais l'ordre des codes.
 */
export const PASSATION = ['Q2.5-01', 'Q2.5-03', 'Q2.5-02'] as const;

/** Le deck de passation : les 3 binaires dans l'ordre gelé (graine 25428). */
export function deckQuete(): QueteItem25[] {
  const parCode = new Map<string, QueteItem25>(ITEMS.map((it) => [it.code, it]));
  const deck: QueteItem25[] = [];
  for (const code of PASSATION) {
    const it = parCode.get(code);
    if (it) deck.push({ code: it.code, text: it.text });
  }
  return deck;
}

/**
 * Le message doux — VERBATIM (01-tableau, bloc « Incomplétude assumée »,
 * décision comité FM-019) : accueilli sans relance ni insinuation de défaut,
 * la 4ᵉ réponse « Je découvre » offrant une issue déclarée. Guillemets internes
 * “ ” reproduits caractères par caractères. L'orchestrateur le rend après les
 * 3 binaires quand l'agrégat vaut 'aucune'.
 */
const MESSAGE_DOUX_FR =
  'C\'est bon de prendre le temps : tu peux revenir quand tu veux, ou choisir “Je découvre”.';
export const MESSAGE_DOUX = avecEN(MESSAGE_DOUX_FR, EN_Q25.MESSAGE_DOUX);

/** La clé de la 4ᵉ réponse globale « Je découvre » (gate orchestrateur). */
export const INTENTION_CODE = 'Q2.5-intention';

/** L'intention affichée — les 6 états de l'agrégat (01-tableau + FM-019). */
export type Intention =
  | 'exclusivite'
  | 'decouverte'
  | 'non_exclusivite'
  | 'contradiction'
  | 'aucune'
  | 'exploration';

/** Les codes gelés des 3 binaires, dans l'ordre des codes. */
const CODES_BINAIRES = ['Q2.5-01', 'Q2.5-02', 'Q2.5-03'] as const;

/**
 * L'agrégat d'intention — table EXACTE du 01-tableau-des-items (précédences
 * du sélecteur cartes.yaml 1 → 6 : la contradiction prime la non-exclusivité ;
 * l'état « Je découvre » prime tout). Voir l'en-tête du module pour la table
 * complète et la conduite des réponses manquantes.
 */
export function intentionAffichee(reponses: Record<string, number>): Intention {
  // Ordre 1 — la 4ᵉ réponse déclarée prime, sans effacer ni juger les binaires.
  if (reponses[INTENTION_CODE] !== undefined) return 'exploration';
  const q1 = reponses['Q2.5-01'];
  const q2 = reponses['Q2.5-02'];
  const q3 = reponses['Q2.5-03'];
  // Ordre 2 — contradiction logique directe (01 Oui × 03 Oui) → drapeau QFI
  // moteur seul + miroir dégradé : le code d'état reste descriptif.
  if (q1 === 1 && q3 === 1) return 'contradiction';
  // Ordre 4 — 01=Oui & 03=Non → exclusivité posée (02 sans objet).
  if (q1 === 1 && q3 === 2) return 'exclusivite';
  // Ordre 5 — 01=Non & 02=Oui & 03=Non → découverte.
  if (q1 === 2 && q2 === 1 && q3 === 2) return 'decouverte';
  // Ordre 3 — 03=Oui sans contradiction → non-exclusivité assumée.
  if (q3 === 1) return 'non_exclusivite';
  // Ordre 6 — les trois « Non » (ou passation incomplète) : aucune intention
  // lisible — incomplet, pas fautif. Message doux + « Je découvre » proposé.
  return 'aucune';
}

export interface Score25 {
  /** L'intention affichée — l'agrégat documenté (SIG-2.5-01, restituable). */
  intention: Intention;
  /** La barre du moteur : binaires posés / 3 ∈ [0,1] — lecture neutre (cf. DEF_25). */
  cap: number;
  /** Le nombre brut de binaires posés (0-3) — les binaires seulement, sans la 4ᵉ. */
  repondues: number;
  [k: string]: unknown;
}

/**
 * Le scorer : agrège l'intention affichée + la barre neutre « Ton cap »
 * (nombre de binaires posés / 3). Aucune « bonne réponse » : le score décrit
 * un état déclaré, il ne note rien. La sélection de carte ne dépend que de
 * `intention` — l'enchaînement choisirVariante(scorer(reponses)) fonctionne
 * tel quel.
 */
export function scorer(reponses: Record<string, number>): Score25 {
  const repondues = CODES_BINAIRES.reduce(
    (acc, code) => (reponses[code] !== undefined ? acc + 1 : acc),
    0,
  );
  return { intention: intentionAffichee(reponses), cap: repondues / 3, repondues };
}

/** Les 4 identifiants de carte — verbatim (cartes.yaml v2, mission VAGUE 5). */
export type VarianteId25 =
  | 'CARTE-2.5-EXPL'
  | 'CARTE-2.5-DECOU'
  | 'CARTE-2.5-LIBRE'
  | 'CARTE-2.5-JEDECOUVRE';

/**
 * Sélection de la carte — conditions EXACTES de cartes.yaml (selection.ordre
 * 1 → 6, première correspondance retenue), mappées sur l'agrégat d'intention.
 * Les trois cas « en exploration » (4ᵉ réponse choisie, contradiction routée,
 * aucune intention lisible) tombent sur la carte la plus neutre : le drapeau
 * QFI ne s'expose JAMAIS en carte.
 */
export function choisirVariante(score: Score25): VarianteId25 {
  switch (score.intention) {
    case 'exploration':
      return 'CARTE-2.5-JEDECOUVRE'; // ordre 1 — l'état déclaré prime
    case 'contradiction':
      return 'CARTE-2.5-JEDECOUVRE'; // ordre 2 — repli neutre, drapeau jamais exposé
    case 'non_exclusivite':
      return 'CARTE-2.5-LIBRE'; // ordre 3
    case 'exclusivite':
      return 'CARTE-2.5-EXPL'; // ordre 4
    case 'decouverte':
      return 'CARTE-2.5-DECOU'; // ordre 5
    case 'aucune':
      return 'CARTE-2.5-JEDECOUVRE'; // ordre 6 — + message doux à l'écran
  }
}

export interface Carte {
  id: VarianteId25;
  nom: string;
  lumiere: string;
  ombre: string;
  tension: string;
}

/** Les 4 variantes de carte — verbatim (cartes.yaml v2, ordre du YAML). */
export const CARTES: Record<VarianteId25, Carte> = {
  'CARTE-2.5-EXPL': {
    id: 'CARTE-2.5-EXPL',
    nom: 'Le·La Cœur qui choisit',
    lumiere:
      "Tu cherches une relation exclusive, et tu l'assumes : ton cap se lit d'entrée. Construire à deux, sans détours — c'est écrit.",
    ombre:
      "Un cap posé tôt presse parfois les étapes : l'autre hérite d'un rythme qui n'est pas le sien.",
    tension: 'viser juste, sans brusquer la rencontre.',
  },
  'CARTE-2.5-DECOU': {
    id: 'CARTE-2.5-DECOU',
    nom: 'Le·La Curieux·se sans carte',
    lumiere:
      "Tu cherches une rencontre, sans plan précis : tu veux voir qui arrive, sans scénario imposé. L'ouverture est ton cadre — elle s'affiche, elle ne se cache pas.",
    ombre:
      "Sans plan, quelqu'un peut s'attacher pendant que tu explores : ce coût se nomme tôt, ou se paie après.",
    tension: 'laisser venir, sans laisser planer.',
  },
  'CARTE-2.5-LIBRE': {
    id: 'CARTE-2.5-LIBRE',
    nom: 'Le·La Libre honnête',
    lumiere:
      "L'exclusivité n'est pas ce que tu vises aujourd'hui — et tu le dis. Tes rencontres démarrent sans malentendu de statut, parce que le tien s'affiche.",
    ombre:
      "L'exclusivité que tu n'affiches pas, quelqu'un l'espère malgré tout : nomme-le tôt, ou quelqu'un paiera le flou.",
    tension: 'vivre ton rythme, sans faire attendre les cœurs.',
  },
  'CARTE-2.5-JEDECOUVRE': {
    id: 'CARTE-2.5-JEDECOUVRE',
    nom: 'Le·La Brouillon·ne de soi',
    lumiere:
      "Tu as répondu « Je découvre » — tu ne sais pas encore ce que tu cherches, et c'est déclaré. Tu explores ton propre cap en même temps que les rencontres.",
    ombre:
      "Découvrir sans choisir est une façon de ne pas choisir : à force d'ouvrir toutes les portes, on n'entre nulle part.",
    tension: 'chercher ta réponse, sans faire patienter ta vie.',
  },
};

/** Textes du briefing — annonce VERBATIM (05-ecran-d-intro), le reste en couche app. */
export const BRIEFING = {
  annonce:
    "Trois questions, un cap : ce que tu cherches se dit droit. Réponds ce qui est vrai aujourd'hui, pas ce qui fait bonne impression.",
  aQuoiCaSert: [
    'Trois énoncés, un à la fois : pour chacun, tu réponds oui ou non, rien d\'autre.',
    'Les énoncés parlent de ton cap : une relation exclusive, une rencontre sans plan précis, ou l\'exclusivité mise de côté.',
    'Il n\'y a pas de bonne réponse : aucune intention ne vaut plus qu\'une autre.',
    'Une quatrième réponse existe : « Je découvre » — tu explores ce que tu cherches, sans le poser aujourd\'hui.',
  ],
  resultats: [
    'Ta carte — ton cap déclaré, sa lumière et sa zone d\'ombre, en quelques mots.',
    'Ce que tes réponses disent — l\'intention que tu affiches aujourd\'hui, restituée en toutes lettres.',
    'Les pierres de ton portrait — ce que tu poses ici nourrit toute la suite du voyage.',
  ],
};

/** Textes de la fenêtre de complétion (carte) — verbatim cartes.yaml + couche app. */
export const COMPLETION = {
  entete: '🧭 QUÊTE ACCOMPLIE — « Ce que tu cherches »',
  labelOmbre: "Ta zone d'ombre :",
  labelTension: 'Ta tension intérieure :',
  fenetre:
    "Quelque part, quelqu'un répond à ces mêmes questions. Le jour où vos cartes se croiseront, elles auront beaucoup à se dire.",
  miroirNote:
    'Ton miroir — la lecture complète de ton fonctionnement — arrive à la prochaine étape du voyage.',
};

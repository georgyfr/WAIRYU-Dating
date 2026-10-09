/**
 * Quête 2.8 « Ton signe (juste pour le jeu) » — Monde 3 « La Boussole ».
 *
 * MICRO-QUÊTE OPT-IN — 1 SÉLECTION (NON-Likert), BADGE CONVERSATIONNEL.
 * Contenu VERBATIM au Livrable M3-2.8-Ton-Signe (branche archive/v1-2026-10-05,
 * 6 fichiers — 00-README, 01-tableau-de-la-selection, 02-ordre-canonique,
 * 05-ecran-d-intro, cartes.yaml, README) :
 *  - QUESTION_28 + SIGNE_OPTIONS : la sélection unique Q2.8-01 (01-tableau-de-la-
 *    selection) — les 12 signes en ordre calendaire canonique ♈ → ♓ (ordre de
 *    lecture culturel, sans effet mécanique, documenté comme partie du protocole,
 *    01 décision n° 2), puis « Je préfère ne pas dire » en fin de liste (position
 *    standard des options de retrait, precedent 1.7-01 — option de PREMIÈRE classe
 *    dans les données, discrète à l'écran) ;
 *  - INTRO_28 : l'écran d'intro VERBATIM (05-ecran-d-intro, 2 lignes) ;
 *  - CARTES : les 13 variantes du badge miniature (cartes.yaml) — nom + phrase
 *    légère VERBATIM ; ombre et tension = chaînes VIDES PAR EXEMPTION DE CHARTE
 *    DOCUMENTÉE : le badge miniature est « 1 phrase légère » (mission LOT 8),
 *    SANS ombre, SANS tension, sans portrait — precedent 1.7 « écran spécial
 *    sans carte », ratification comité (cartes.yaml, regles_documentees) ;
 *  - DISCLAIMER_28 : le disclaimer de marque gravé, inséparable de tout rendu —
 *    la version mission V8.D FAIT FOI (« de tests » inclus ; confirmée au
 *    00-README, au 01, au 05 et à cartes.yaml label_disclaimer + regles) ; les
 *    variantes plus anciennes (Contrat d'Inventaire sans « elle, », Vague 6 sans
 *    « de tests », en-tête cartes.yaml) sont des rotations documentées ;
 *  - ENTETE_ECRAN_28 / PIED_ECRAN_28 / FENETRE_28 : l'écran de complétion
 *    verbatim (cartes.yaml) — les libellés [Changer] · [Retirer le badge] ·
 *    [Quête suivante] du pied sont des contrôles UI, pour l'orchestrateur.
 *
 * ⚠ RÈGLE ABSOLUE (gravée au 00-README, au 01, au 05 et à cartes.yaml) :
 *   le signe n'entre JAMAIS dans le score, JAMAIS dans le matching, JAMAIS dans
 *   aucun calcul — ni filtre, ni pondération, ni tie-break, même déguisé. Zéro
 *   « compatibilité astro » nulle part dans l'app : la sélection est une
 *   étiquette de conversation, pas un attribut de compatibilité. scorerNul28
 *   renvoie {} par principe — ce n'est pas une absence d'implémentation.
 *
 * ⚠ PAS DE FICHIER ARCHE : le badge miniature n'a pas d'archétype (exemption
 *   de charte documentée, precedent 1.7) — ce module est le seul livrable de
 *   contenu de la quête.
 *
 * BRANCHE SILENCE (option de première classe) : « Je préfère ne pas dire » →
 *   AUCUN badge, AUCUNE trace, aucune inférence, retour silencieux (cartes.yaml,
 *   phrase_legere: null — « silence assumé — le voyage continue sans le badge ») ;
 *   traitée comme une absence de donnée, JAMAIS comme une réponse manquante,
 *   jamais réinterprétée, déduite ni suggérée.
 *
 * CODAGE DE LA RÉPONSE (couche app, jamais rendu) : la valeur stockée pour
 *   Q2.8-01 = l'INDEX de l'option choisie dans SIGNE_OPTIONS + 1 (1-based ;
 *   l'ordre de SIGNE_OPTIONS fait foi — voir choisirVariante). Opt-in strict :
 *   aucune valeur pré-sélectionnée ; valeur absente ou hors bornes → SILENCE
 *   (jamais une inférence).
 *
 * Mélange : SANS OBJET (1 clic, rien à ordonner) — graine 228427 assignée par
 *   la mission V7/V8 sans tirage, AUCUN algorithme ne la consomme
 *   (02-ordre-canonique). Rien à mélanger ici, jamais.
 *
 * Le rendu de l'écran final (titre du badge + signe + phrase légère + disclaimer)
 * est géré par l'orchestrateur — ce module expose les DONNÉES verbatim.
 *
 * Typo : apostrophe ASCII ', guillemets français « », phrases ≤ 22 mots, aucun
 * code/score/sigle au rendu, symboles zodiacaux unicode conservés tels quels.
 */

import type { ItemPassation } from './quetes';

/** La question unique — VERBATIM (01-tableau-de-la-selection, Q2.8-01) :
 *  la question annonce l'usage (01, décision n° 1). */
export const QUESTION_28 = 'Ton signe, pour la conversation ?';

/** Code gelé de la sélection unique (01-tableau-de-la-selection). */
export const SIGNE_CODE = 'Q2.8-01';

/**
 * Les 13 options — VERBATIM (01-tableau-de-la-selection, ordre du Livrable) :
 * les 12 signes en ordre calendaire canonique ♈ → ♓, puis « Je préfère ne pas
 * dire » en fin de liste (option de PREMIÈRE classe — 01, décision n° 3).
 * L'ordre de SIGNE_OPTIONS fait foi pour le codage des réponses
 * (valeur = index + 1 — voir choisirVariante).
 */
export const SIGNE_OPTIONS: readonly string[] = [
  '♈ Bélier',
  '♉ Taureau',
  '♊ Gémeaux',
  '♋ Cancer',
  '♌ Lion',
  '♍ Vierge',
  '♎ Balance',
  '♏ Scorpion',
  '♐ Sagittaire',
  '♑ Capricorne',
  '♒ Verseau',
  '♓ Poissons',
  'Je préfère ne pas dire',
];

/** Les 13 ids de variantes — VERBATIM (cartes.yaml, champ id). */
export type VarianteId28 =
  | 'CARTE-2.8-BELIER'
  | 'CARTE-2.8-TAUREAU'
  | 'CARTE-2.8-GEMEAUX'
  | 'CARTE-2.8-CANCER'
  | 'CARTE-2.8-LION'
  | 'CARTE-2.8-VIERGE'
  | 'CARTE-2.8-BALANCE'
  | 'CARTE-2.8-SCORPION'
  | 'CARTE-2.8-SAGITTAIRE'
  | 'CARTE-2.8-CAPRICORNE'
  | 'CARTE-2.8-VERSEAU'
  | 'CARTE-2.8-POISSONS'
  | 'CARTE-2.8-SILENCE';

/**
 * Une entrée du badge miniature — même forme que la Carte du registre
 * (quetes.ts). EXEMPTION DE CHARTE DOCUMENTÉE (cartes.yaml, mission LOT 8) :
 * le badge miniature est « 1 phrase légère » — il n'a NI ombre NI tension :
 * `ombre` et `tension` sont des chaînes VIDES pour les 13 entrées, par design
 * (precedent 1.7 « écran spécial sans carte », ratification comité). C'est du
 * jeu — la charte d'ombre ne s'applique pas.
 */
export interface Carte {
  id: VarianteId28;
  /** « ♈ Bélier » etc., verbatim cartes.yaml — symbole unicode + nom. */
  nom: string;
  /** La phrase légère VERBATIM (champ phrase_legere) — registre du clin d'œil :
   *  le jeu suggère, il ne décrit pas (zéro trait affirmé, zéro diagnostic). */
  lumiere: string;
  /** VIDE — sans objet : le badge miniature n'a pas d'ombre (exemption documentée). */
  ombre: string;
  /** VIDE — sans objet : le badge miniature n'a pas de tension (exemption documentée). */
  tension: string;
}

/** Les 13 variantes du badge — VERBATIM (cartes.yaml). CARTE-2.8-SILENCE :
 *  nom = « (aucun badge) » tel quel du YAML ; lumiere = '' (phrase_legere: null
 *  — silence assumé) : cette entrée ne produit AUCUN rendu, AUCUNE trace. */
export const CARTES: Record<VarianteId28, Carte> = {
  'CARTE-2.8-BELIER': {
    id: 'CARTE-2.8-BELIER',
    nom: '♈ Bélier',
    lumiere: 'On te confie les départs.',
    ombre: '',
    tension: '',
  },
  'CARTE-2.8-TAUREAU': {
    id: 'CARTE-2.8-TAUREAU',
    nom: '♉ Taureau',
    lumiere: 'On t\'embarque pour les bonnes tables.',
    ombre: '',
    tension: '',
  },
  'CARTE-2.8-GEMEAUX': {
    id: 'CARTE-2.8-GEMEAUX',
    nom: '♊ Gémeaux',
    lumiere: 'Deux conversations en une, et ça passe.',
    ombre: '',
    tension: '',
  },
  'CARTE-2.8-CANCER': {
    id: 'CARTE-2.8-CANCER',
    nom: '♋ Cancer',
    lumiere: 'On t\'invite chez toi, chez toi.',
    ombre: '',
    tension: '',
  },
  'CARTE-2.8-LION': {
    id: 'CARTE-2.8-LION',
    nom: '♌ Lion',
    lumiere: 'La scène te connaît déjà.',
    ombre: '',
    tension: '',
  },
  'CARTE-2.8-VIERGE': {
    id: 'CARTE-2.8-VIERGE',
    nom: '♍ Vierge',
    lumiere: 'Ta liste a une sous-liste.',
    ombre: '',
    tension: '',
  },
  'CARTE-2.8-BALANCE': {
    id: 'CARTE-2.8-BALANCE',
    nom: '♎ Balance',
    lumiere: 'Tu mets tout le monde d\'accord, même les pizzas.',
    ombre: '',
    tension: '',
  },
  'CARTE-2.8-SCORPION': {
    id: 'CARTE-2.8-SCORPION',
    nom: '♏ Scorpion',
    lumiere: 'Tes secrets ont des poignées.',
    ombre: '',
    tension: '',
  },
  'CARTE-2.8-SAGITTAIRE': {
    id: 'CARTE-2.8-SAGITTAIRE',
    nom: '♐ Sagittaire',
    lumiere: 'Ton sac fait moins que ton programme.',
    ombre: '',
    tension: '',
  },
  'CARTE-2.8-CAPRICORNE': {
    id: 'CARTE-2.8-CAPRICORNE',
    nom: '♑ Capricorne',
    lumiere: 'Tes plans ont des plans.',
    ombre: '',
    tension: '',
  },
  'CARTE-2.8-VERSEAU': {
    id: 'CARTE-2.8-VERSEAU',
    nom: '♒ Verseau',
    lumiere: 'Tu réponds oui aux idées étranges.',
    ombre: '',
    tension: '',
  },
  'CARTE-2.8-POISSONS': {
    id: 'CARTE-2.8-POISSONS',
    nom: '♓ Poissons',
    lumiere: 'Tes playlists racontent des films.',
    ombre: '',
    tension: '',
  },
  'CARTE-2.8-SILENCE': {
    id: 'CARTE-2.8-SILENCE',
    nom: '(aucun badge)',
    lumiere: '', // phrase_legere: null — silence assumé, aucun rendu, aucune trace.
    ombre: '',
    tension: '',
  },
};

/** ⚠ ALIGNÉ à SIGNE_OPTIONS à l'identique (même ordre, même longueur) —
 *  la correspondance valeur → variante en dépend (contrat 1-based). */
const IDS_28: readonly VarianteId28[] = [
  'CARTE-2.8-BELIER',
  'CARTE-2.8-TAUREAU',
  'CARTE-2.8-GEMEAUX',
  'CARTE-2.8-CANCER',
  'CARTE-2.8-LION',
  'CARTE-2.8-VIERGE',
  'CARTE-2.8-BALANCE',
  'CARTE-2.8-SCORPION',
  'CARTE-2.8-SAGITTAIRE',
  'CARTE-2.8-CAPRICORNE',
  'CARTE-2.8-VERSEAU',
  'CARTE-2.8-POISSONS',
  'CARTE-2.8-SILENCE',
];

/**
 * CONTRAT DE CODAGE (couche app — jamais rendu à l'utilisateur) : la réponse
 * stockée pour Q2.8-01 est l'INDEX de l'option choisie dans SIGNE_OPTIONS + 1
 * (valeur = index + 1 ; l'ordre de SIGNE_OPTIONS fait foi : 1 = ♈ Bélier,
 * 2 = ♉ Taureau, … 12 = ♓ Poissons, 13 = « Je préfère ne pas dire »). La
 * variante EST la sélection du membre — zéro scoring, zéro classement
 * (cartes.yaml, selection.logique) ; aucun autre input ne participe.
 *
 * Valeur absente, non finie ou hors bornes → 'CARTE-2.8-SILENCE' : jamais une
 * inférence — l'absence de donnée reste une absence (opt-in strict, « Je
 * préfère ne pas dire » n'est jamais réinterprétée ni déduite).
 */
export function choisirVariante(reponses: Record<string, number>): VarianteId28 {
  const valeur = reponses[SIGNE_CODE];
  if (!Number.isFinite(valeur)) return 'CARTE-2.8-SILENCE';
  const idx = Math.trunc(valeur) - 1;
  if (idx < 0 || idx >= IDS_28.length) return 'CARTE-2.8-SILENCE';
  return IDS_28[idx] ?? 'CARTE-2.8-SILENCE';
}

/** AUCUN score — RÈGLE ABSOLUE : le signe n'entre dans aucun calcul (ni filtre,
 *  ni pondération, ni tie-break, même déguisé — zéro compatibilité astro nulle
 *  part dans l'app). Exporté uniquement pour la compatibilité du contrat
 *  QueteDef.scorer : renvoie toujours {}. */
export function scorerNul28(_reponses: Record<string, number>): Record<string, number> {
  return {};
}

/** Le disclaimer de marque gravé — INSÉPARABLE de tout rendu du badge (écran,
 *  profil, conversation — sans exception, 01 garde-fous). VERBATIM mission
 *  V8.D, version qui FAIT FOI ; les variantes plus anciennes (Contrat
 *  d'Inventaire, Vague 6) sont des rotations documentées (fiche de cadrage). */
export const DISCLAIMER_28 =
  'Pour la conversation — la science, elle, est dans tes résultats de tests.';

/** L'écran d'intro — VERBATIM (05-ecran-d-intro, 2 lignes) : la frontière
 *  jeu/science posée AVANT la sélection (« ne dit rien de toi »), le droit de
 *  passer posé avant le choix (« si tu veux », « sinon » — opt-in strict). */
export const INTRO_28 = {
  ligne1: 'Le zodiaque ne dit rien de toi — mais ça fait une belle histoire à table.',
  ligne2: 'Choisis ton signe si tu veux le jouer. Sinon, la route continue sans le demander.',
};

/** Le titre du badge — format VERBATIM 05-ecran-d-intro (« Ton signe : ♌ —
 *  juste pour le jeu ») : le symbole seul, extrait du nom de la variante.
 *  SILENCE → '' : aucun badge, aucun rendu (la complétion reste silencieuse). */
export function titreBadge28(id: VarianteId28): string {
  if (id === 'CARTE-2.8-SILENCE') return '';
  const symbole = CARTES[id].nom.split(' ')[0] ?? '';
  return `Ton signe : ${symbole} — juste pour le jeu`;
}

/** L'entête de l'écran de complétion — VERBATIM (cartes.yaml, entete_ecran). */
export const ENTETE_ECRAN_28 = 'TON SIGNE — juste pour le jeu';

/** Le pied de l'écran de complétion — VERBATIM (cartes.yaml, pied_ecran) : les
 *  libellés [Changer] · [Retirer le badge] · [Quête suivante] sont des contrôles
 *  UI, pour l'orchestrateur — le badge est modifiable/effaçable en un clic
 *  (l'étiquette appartient au membre). */
export const PIED_ECRAN_28 =
  'Le badge s\'affiche sur ton profil et dans la conversation — modifiable ou ' +
  'effaçable en un clic. · [Changer] · [Retirer le badge] · [Quête suivante]';

/** La fenêtre rotative F1/F2 — VERBATIM (cartes.yaml, fenetre_sur_l_autre) :
 *  le pied standard reste disponible à l'écran de complétion (fenêtre rotative,
 *  mission Production 4). */
export const FENETRE_28 = {
  F1: 'Quelque part, quelqu\'un répond à ces mêmes questions. Le jour où vos cartes se croiseront, elles auront beaucoup à se dire.',
  F2: 'Ce portrait n\'est pas une fin — c\'est ta façon d\'être trouvé·e : par quelqu\'un qui lira ta carte avant ton visage.',
};

/** Le deck réel : UNE question, sélection unique (opt-in strict, aucune valeur
 *  pré-sélectionnée, pas de multi). Pas de mélange : 1 clic — rien à ordonner
 *  (02-ordre-canonique). */
export function deck28(): ItemPassation[] {
  return [
    {
      code: SIGNE_CODE,
      text: QUESTION_28,
      format: 'question',
      options: SIGNE_OPTIONS,
    },
  ];
}

/** Textes du briefing — annonce = l'intro VERBATIM (05-ecran-d-intro, les deux
 *  lignes jointes par un saut de ligne) ; les puces aQuoiCaSert / resultats
 *  sont la couche app (ton Task 35 — simple et littéral, jamais de métadonnée
 *  moteur, jamais d'incitation à croire, zéro teaser premium). */
export const BRIEFING = {
  annonce: INTRO_28.ligne1 + '\n' + INTRO_28.ligne2,
  aQuoiCaSert: [
    'Un clic, un badge : ton signe s\'affiche sur ton profil et dans la conversation.',
    'C\'est du jeu — le zodiaque ne dit rien de toi, et rien ici ne mesure quoi que ce soit.',
    '« Je préfère ne pas dire » est une réponse complète : aucun badge, aucune trace.',
    'Le badge se change ou se retire en un clic, quand tu veux.',
  ],
  resultats: [
    'Ton badge miniature : ton signe et une phrase légère — pour la conversation, rien d\'autre.',
    'Tu peux le retirer quand tu veux : l\'étiquette reste à toi.',
  ],
};

/** Textes de la fenêtre de complétion — l'entête reprend le titre de la quête
 *  (Constitution [5] : « 2.8 Ton signe (juste pour le jeu) »). Le corps est
 *  rendu par l'orchestrateur : le badge miniature verbatim (titreBadge28 +
 *  CARTES[id].lumiere) SURMONTÉ du disclaimer gravé (DISCLAIMER_28) —
 *  inséparable. Ombre/tension/miroir : chaînes vides — sans objet (badge
 *  miniature exempté de charte d'ombre, miroir exempté — Constitution [7],
 *  precedent 1.7). */
export const COMPLETION = {
  entete: '🧭 QUÊTE ACCOMPLIE — « Ton signe (juste pour le jeu) »',
  labelOmbre: '',
  labelTension: '',
  fenetre: '',
  miroirNote: '',
};

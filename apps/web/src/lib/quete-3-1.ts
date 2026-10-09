/**
 * Quête 3.1 « Ton rythme de vie » — Monde 4 « Ton terrain ».
 *
 * Contenu FIDÈLE au Livrable M4-3.1-Ton-Rythme-de-Vie (mission V9.A) :
 *  - ITEMS : les 5 items Likert (verbatim 01-tableau-des-items, ordre du
 *    tableau) — 2 paires miroir R6 (le pic d'énergie 01×02 · l'horloge libre
 *    03×04) + 1 item PIVOT (Q3.1-05, les heures calmes, mono). ⚠ ÉCART
 *    D'ARITHMÉTIQUE R6 : la couverture R6 intégrale exigerait un nombre pair
 *    d'énoncés, la quête en porte 5 (impair) — l'écart est documenté au 01 du
 *    Livrable « À VALIDER PAR LE COMITÉ » (précédent 2.2) : il est IMPLEMENTÉ
 *    TEL QUEL ici (5 items, pivot 05), jamais tranché côté app ;
 *  - PASSATION : l'ordre de passation GELÉ (mélange RÉEL graine 231427 =
 *    210427 + 1000 × 21, Fisher-Yates seedé + réparation déterministe,
 *    tentative 1, 4 échanges, run max 1 — alternance I·D·I·D·I, 5 passes
 *    rejouées identiques octet pour octet, 02-plan-de-melange). AUCUNE trame ▲
 *    dans la quête (n_trames = 0 — quête déclarative directe, déguisement
 *    impossible) : rien à sauter, aucun code hors passation, aucune
 *    formulation de trame au dépôt (règle 11-b — sans objet de fait) ;
 *  - scorer : CHRONO_D = moyenne des 5 items (I recodés 6 − r — Arbitrage 1),
 *    NORMALISÉE 0-1. C'est l'UNITÉ DES SEUILS du cartes.yaml (0.35 / 0.65 —
 *    pas de seuil en unité Likert ici, contrairement à 2.1) : scoresBruts
 *    renvoie cette valeur 0-1, le scorer EXPOSÉ (contrat app) renvoie la même
 *    normalisation plus la moyenne par ANGLE (canal fiabilité R6 — moyenne
 *    des items valides de l'angle). EC_CHRONO (l'écart à l'autre,
 *    SIG-3.1-02) NE PARTICIPE JAMAIS à la sélection — information
 *    conversationnelle, calculée côté moteur de matching, jamais ici ;
 *  - choisirVariante : sélecteurs VERBATIM (cartes.yaml — selection), CHRONO_D
 *    > 0.65 → le premier train (🌅) · 0.35-0.65 → la marée (sans badge) ·
 *    < 0.35 → la lampe de minuit (🦉) — partition totale de [0,1] (C6,
 *    vérifiée machine). Bornes FM-019 ADOPTÉES comme valeurs de départ
 *    (provisoires concepteur — re-signature professionnelle avant bêta) :
 *    métadonnées moteur, jamais rendues ;
 *  - BADGE 🌅 / 🦉 : marqueur de conversation des EXTRÊMES seulement —
 *    l'entre-deux n'en porte pas (décision de production, documentée au 04 :
 *    « les deux extrêmes sont des marqueurs de conversation, pas des grades »).
 *    Jamais un filtre, jamais un grade, jamais un critère de matching ;
 *  - CARTES : les 3 variantes verbatim (cartes.yaml — portrait → lumiere,
 *    tension_interieure → tension) ;
 *  - BRIEFING : l'annonce est verbatim (05-ecran-d-intro, 2 phrases), les
 *    puces sont la couche app rédigée (ton Task 35).
 *
 * Anti-normativité (doctrine capitale du Livrable) : AUCUN item qui valorise
 * un profil — l'oiseau de nuit n'est pas un défaut, le lève-tôt n'est pas une
 * vertu, l'entre-deux n'est pas mou ; le recodage 6 − r place les deux bouts
 * sur le même axe sans hiérarchiser. Le concept public (chronotype, rMEQ) et
 * toute matinalité chiffrée restent MOTEUR SEUL — au rendu : le pic, l'horloge
 * libre, les heures fortes, jamais « chronotype » ni « matinalité » (C2/C3).
 *
 * Typo : apostrophe ASCII uniquement, pas d'insécable, guillemets français.
 * Règles : aucun code, score, sigle ou seuil ne franchit le rendu ; aucune
 * métadonnée moteur dans un texte rendu ; phrases ≤ 22 mots dans les textes
 * rédigés.
 */

import { avecEN } from '../i18n/apply';
import * as EN_Q31 from '../i18n/content/en/quete-3-1';

export interface QueteItem31 {
  code: string;
  text: string;
  /** 'D' = directe, 'I' = inversée (recodée 6 − r — Arbitrage 1). */
  orient: 'D' | 'I';
  /** L'angle verbatim du tableau 01 — 2 paires R6 + 1 pivot. */
  dim: string;
}

/** L'objet de passation affiché — code + énoncé (l'orientation reste côté moteur). */
export interface ItemsQuete31 {
  code: string;
  text: string;
}

/** Les 5 items — verbatim (01-tableau-des-items, ordre du tableau).
 *  Angles : le pic d'énergie (paire R6 01×02) · l'horloge libre (paire R6
 *  03×04) · les heures calmes (Q3.1-05, PIVOT mono — écart d'arithmétique
 *  R6 documenté au 01, « À VALIDER PAR LE COMITÉ », implémenté tel quel).
 *  AUCUNE trame ▲ n'existe dans la quête (n_trames = 0) : rien hors dépôt,
 *  rien à sauter, rien à reconstituer (règle 11-b). */
const ITEMS_FR: readonly QueteItem31[] = [
  {
    code: "Q3.1-01",
    text: "Je fonctionne au mieux quand le jour se lève.",
    orient: "D",
    dim: "le pic d'énergie",
  },
  {
    code: "Q3.1-02",
    text: "Je fonctionne au mieux quand le jour s'achève.",
    orient: "I",
    dim: "le pic d'énergie",
  },
  {
    code: "Q3.1-03",
    text: "Sans réveil imposé, je me lève avec le soleil.",
    orient: "D",
    dim: "l'horloge libre",
  },
  {
    code: "Q3.1-04",
    text: "Sans réveil imposé, mes matinées s'étirent vers midi.",
    orient: "I",
    dim: "l'horloge libre",
  },
  {
    code: "Q3.1-05",
    text: "Les heures où le monde se calme sont mes heures fortes.",
    orient: "I",
    dim: "les heures calmes",
  },
];
export const ITEMS = avecEN(ITEMS_FR, EN_Q31.ITEMS);

/** Ordre de passation GELÉ — mélange RÉEL graine 231427 (02-plan-de-melange,
 *  la séquence du plan fait foi, JAMAIS l'ordre des codes) : le 1ᵉʳ item vu
 *  est Q3.1-02 (la forme du soir), le dernier Q3.1-04 (l'étirement vers midi).
 *  AUCUNE trame ▲ dans la quête (positions_trames : []) — le deck couvre
 *  exactement les 5 codes, sans trou, sans saut. */
export const PASSATION: readonly string[] = [
  "Q3.1-02",
  "Q3.1-03",
  "Q3.1-05",
  "Q3.1-01",
  "Q3.1-04",
];

const PAR_CODE = new Map(ITEMS.map((i) => [i.code, i]));

/** Le deck réel : les 5 items dans l'ordre gelé — quête déclarative directe,
 *  il n'existe aucun item hors passation (n_trames = 0, aucun doublon). */
export function deckQuete(): ItemsQuete31[] {
  return PASSATION.flatMap((c) => {
    const it = PAR_CODE.get(c);
    return it ? [{ code: it.code, text: it.text }] : [];
  });
}

/** Recodage Likert d'un item — les inversées comptent 6 − r (Arbitrage 1) :
 *  les deux bouts de chaque paire se placent sur le même axe, sans hiérarchie. */
function recode(reponse: number, orient: 'D' | 'I'): number {
  return orient === 'D' ? reponse : 6 - reponse;
}

/** Likert 1-5 → 0-1 (contrat app, precedent 2.2). */
function contribution(reponse: number, orient: 'D' | 'I'): number {
  return (recode(reponse, orient) - 1) / 4;
}

export interface Bruts31 {
  /** CHRONO_D — la matinalité déclarée : moyenne des 5 items (I recodés
   *  6 − r), NORMALISÉE 0-1. Haut = matin, bas = soir. C'est l'UNITÉ DES
   *  SEUILS du cartes.yaml (0.35 / 0.65) — pas de seuil Likert ici. Le nom et
   *  le sigle restent moteur : jamais rendus (C3). */
  chrono: number;
}

/** scoresBruts : CHRONO_D en 0-1 — la moyenne des 5 contributions recodées,
 *  l'unité même des seuils du sélecteur (0.35 / 0.65). Aucune réponse valide
 *  → 0 (hors passe — la passation fournit les 5 réponses). */
export function scoresBruts(reponses: Record<string, number>): Bruts31 {
  let total = 0;
  let n = 0;
  for (const code of PASSATION) {
    const it = PAR_CODE.get(code);
    const r = it ? reponses[it.code] : undefined;
    if (it && typeof r === 'number' && r >= 1 && r <= 5) {
      total += contribution(r, it.orient);
      n += 1;
    }
  }
  return { chrono: n > 0 ? total / n : 0 };
}

export interface Score31 {
  /** CHRONO_D normalisée 0-1 — la clé de la dim unique (quetes.ts, barre). */
  chrono: number;
  /** La moyenne par ANGLE (0-1, canal fiabilité R6 — « score d'angle =
   *  moyenne des items valides »). Clés = les angles verbatim du tableau 01.
   *  Le drapeau fiabilité R6 (|D_k − (6 − I_k)| ≥ 3) vit au rendu miroir —
   *  jamais ici, jamais rendu comme un chiffre. */
  [dim: string]: number;
}

/** Scorer EXPOSÉ (contrat app) : CHRONO_D normalisée 0-1, plus la moyenne par
 *  angle (moyenne des items valides de l'angle — le pivot Q3.1-05 porte son
 *  angle seul, sa fiabilité repose sur la cohérence d'axe + QFI, fiche 06).
 *  Rien d'autre n'entre en jeu : EC_CHRONO (SIG-3.1-02, l'écart à l'autre)
 *  se calcule côté moteur de matching — jamais ici, jamais rendu. */
export function scorer(reponses: Record<string, number>): Score31 {
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
  const score: Score31 = { chrono: n > 0 ? total / n : 0 };
  for (const [dim, bloc] of parAngle) {
    score[dim] = bloc.n > 0 ? bloc.total / bloc.n : 0;
  }
  return score;
}

/** Les 3 variantes — ids VERBATIM (cartes.yaml, ordre du YAML). */
export type VarianteId31 =
  | 'CARTE-3.1-PREMIER-TRAIN'
  | 'CARTE-3.1-MAREE'
  | 'CARTE-3.1-LAMPE-MINUITEME';

/**
 * Sélecteurs VERBATIM (cartes.yaml — selection), évalués dans l'ordre du YAML
 * (ordre_selecteur 1 → 3) : CHRONO_D > 0.65 → le lever tôt (le premier train)
 * · 0.35-0.65 → l'entre-deux (la marée) · < 0.35 → les heures calmes (la
 * lampe de minuit). Semantique aux bornes : le > 0.65 est STRICT (0.65 exact
 * tombe dans « entre 0.35 et 0.65 », inclusif des deux bouts) — les 3 plages
 * forment une partition totale de [0,1], chaque profil tombe dans exactement
 * une variante (C6, vérifiée machine). AUCUN départage supplémentaire : l'axe
 * est unique, la partition suffit. Bornes FM-019 ADOPTÉES comme valeurs de
 * départ (provisoires concepteur — re-signature professionnelle avant bêta) :
 * métadonnées moteur, jamais affichées. L'écart à l'autre (EC_CHRONO,
 * SIG-3.1-02) ne participe JAMAIS à la sélection — information
 * conversationnelle moteur seul (non_participant du YAML).
 */
export function choisirVariante(score: Score31): VarianteId31 {
  const s = typeof score.chrono === 'number' ? score.chrono : 0;
  return s > 0.65
    ? 'CARTE-3.1-PREMIER-TRAIN'
    : s >= 0.35
      ? 'CARTE-3.1-MAREE'
      : 'CARTE-3.1-LAMPE-MINUITEME';
}

export interface Carte {
  id: VarianteId31;
  nom: string;
  lumiere: string;
  ombre: string;
  tension: string;
}

/** Les 3 variantes de carte — verbatim (cartes.yaml, ordre du YAML :
 *  portrait → lumiere, tension_interieure → tension). ANTI-NORMATIVITÉ
 *  (regles_documentees du YAML) : les 3 variantes se valent — l'ombre du
 *  nocturne n'est pas une paresse, celle du matinal pas une vertu, celle de
 *  l'entre-deux pas une indécision (C4 : aucun superlatif, aucun rythme
 *  dressé en idéal). */
export const CARTES: Record<VarianteId31, Carte> = {
  "CARTE-3.1-PREMIER-TRAIN": {
    id: "CARTE-3.1-PREMIER-TRAIN",
    nom: "Le·La Premier train",
    lumiere:
      "Ta journée démarre avant le bruit du monde : la tête claire, les heures fortes dès le lever. Tu prends le premier train — et tu y es toi. Ce temps du matin, tu ne le prêtes pas : il t'appartient.",
    ombre:
      "Ta soirée se ferme plus tôt que celle de beaucoup de gens. Le risque à deux : une fin de journée où l'un dort déjà, l'autre arrive.",
    tension: "garder tes heures fortes, sans fermer la porte de la soirée à quelqu'un.",
  },
  "CARTE-3.1-MAREE": {
    id: "CARTE-3.1-MAREE",
    nom: "Le·La Marée entre deux heures",
    lumiere:
      "Ton rythme ne vote ni matin ni soir : il glisse avec les jours, les saisons, les gens. Cette souplesse est une vraie ressource — tu es disponible là où les horloges rigides se cassent.",
    ombre:
      "Qui s'adapte à tout finit parfois sans heure à soi. Ton horloge suit volontiers celle des autres — et ta propre heure ne se défend pas seule.",
    tension: "rester souple, en protégeant quand même un créneau qui n'appartient qu'à toi.",
  },
  "CARTE-3.1-LAMPE-MINUITEME": {
    id: "CARTE-3.1-LAMPE-MINUITEME",
    nom: "Le·La Lampe de minuit",
    lumiere:
      "Ton énergie se lève quand le monde se couche : les heures calmes sont tes heures fortes. La nuit te rend à toi — ce n'est pas un défaut, c'est une horloge, la tienne. Le soir, tu penses mieux, tu aimes mieux, tu vis mieux.",
    ombre:
      "Le matin du monde arrive tôt, avec ses agendas et ses réveils — et ton horloge, elle, débute encore. À deux, ce décalage se nomme tôt ou se subit.",
    tension: "habiter ta nuit, sans laisser le matin du couple se jouer sans toi.",
  },
};

/**
 * Le badge de conversation 🌅 / 🦉 — VERBATIM (cartes.yaml, champ badge).
 * REGLE DU LIVRABLE (03/04/cartes.yaml, décision de production) : le badge
 * accompagne la carte des EXTRÊMES seulement ; l'entre-deux n'en porte pas —
 * « les deux extrêmes sont des marqueurs de conversation, pas des grades »,
 * l'entre-deux « a son rythme et c'est tout ». Le badge est un pont de
 * conversation (🌅 aurore / 🦉 hibou), JAMAIS un filtre, jamais un grade,
 * jamais un critère de matching (aucun calcul ne le consomme). Mécanique
 * inspirée du badge miniature 2.8 (quete-2-8.ts) SANS la toucher : ici le
 * badge fait partie de la carte standard (pas d'écran dédié) — l'entrée vide
 * ('') de la marée est une ABSENCE de badge, jamais rendue comme une chaîne.
 */
export type Badge31 = '🌅' | '🦉' | '';

export const BADGES_31: Record<VarianteId31, Badge31> = {
  'CARTE-3.1-PREMIER-TRAIN': '🌅',
  'CARTE-3.1-MAREE': '',
  'CARTE-3.1-LAMPE-MINUITEME': '🦉',
};

/** Textes du briefing — annonce VERBATIM (05-ecran-d-intro, les 2 phrases
 *  jointes par un espace), puces en couche app (ton Task 35, neutralité
 *  normative : les gens du matin et les gens du soir se valent). */
export const BRIEFING = {
  annonce:
    "Il y a des gens du matin et des gens du soir — et personne pour dire que c'est mieux. Dis-nous à quelle heure tu es pleinement toi.",
  aQuoiCaSert: [
    "C'est la quête du terrain : l'heure où ton corps et ta tête sont le plus à toi.",
    "Cinq affirmations sur ton énergie : le matin, le soir, le réveil libre, les heures calmes.",
    "Pas de bonne réponse — les gens du matin et les gens du soir se valent, ici et partout.",
    "Il en sort une carte, et une pierre de plus dans ton portrait.",
  ],
  resultats: [
    "Ta carte — ta lumière, ta zone d'ombre et ta tension du moment, en quelques mots.",
    "Un badge d'aurore ou de hibou si ton heure se loge aux extrêmes — un pont de conversation, jamais un grade.",
    "Une pierre de plus dans ton portrait — la suite du voyage s'en nourrit.",
  ],
};

/** Textes de la fenêtre de complétion (carte) — entête, labels et fenêtre F1
 *  verbatim (cartes.yaml), miroirNote en couche app. Le badge 🌅/🦉 des
 *  extrêmes s'affiche à l'écran de complétion entre l'entête et le titre de
 *  variante (gabarit standard M4) — BADGES_31 ci-dessus, rien à traduire. */
export const COMPLETION = {
  entete: "🏡 QUÊTE ACCOMPLIE — « Ton rythme de vie »",
  labelOmbre: "Ta zone d'ombre :",
  labelTension: "Ta tension intérieure :",
  fenetre:
    "Quelque part, quelqu'un répond à ces mêmes questions. Le jour où vos cartes se croiseront, elles auront beaucoup à se dire.",
  miroirNote:
    "Ton miroir — la lecture complète de ton heure à toi — arrive à la prochaine étape du voyage.",
};

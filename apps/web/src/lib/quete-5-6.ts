/**
 * Quête 5.6 « Après un désaccord » — Monde 7 « Face aux Tempêtes » · 💎
 * PREMIUM · P1.5 (accès libre au sein du territoire premium).
 *
 * Contenu FIDÈLE au Livrable M7-5.6-Apres-Un-Desaccord (1ʳᵉ génération V12,
 * B.3 — production neuve déclarée) :
 *  - ITEMS : les 5 items Likert (verbatim 01-tableau-des-items, ordre du
 *    tableau) — 5 capacités de réparation × 1 item, AUCUNE paire R6
 *    (arithmétique documentée au 01/06 : 5 capacités distinctes × 1 item —
 *    le drapeau D−I est sans-objet, la cohérence repose sur la moyenne unique
 *    et la trame fiabilité tissée ailleurs dans le voyage) ; orientations
 *    3 D / 2 I — les capacités 1-3-5 se disent en pleine capacité (D), les
 *    capacités 2-4 se disent par leur mécanisme d'ombre (I recodé 6 − r :
 *    l'accord y mesure le déficit — « l'attente du mur » et « la rumination »
 *    deviennent mesurables) ; AUCUNE trame hébergée (zéro signal ▲) ;
 *  - PASSATION : l'ordre de passation GELÉ — mélange RÉEL graine 256427
 *    (graine-mère 210427 + 1000 × ordinal 46, convention concaténée), outil
 *    GÉNÉRIQUE melange.py (aucune trame), tentative 1, 0 échange, verdicts
 *    6/6 PASS (c1/c4 SANS-OBJET — dérogation mono-dimension documentée au 02,
 *    comité ; c5 run max 2 — 2 paires adjacentes de même orientation,
 *    composante douce du minimum courant ; c6 PASS) ;
 *  - scorer : UNE moyenne unique REPARATION (5 items, I recodés 6 − r,
 *    normalisée 0-1) — elle route l'AFFICHAGE (carte 3 variantes · miroir
 *    3 profils · porte ouverte) ; SIG-5.6-02 (le modulateur réparation ×
 *    posture de conflit, 5.4) : [MOTEUR SEUL] — jamais au rendu, jamais en
 *    UI, jamais au match affiché ; il n'est PAS calculé ici (la 5.4 n'est pas
 *    consommée par cette quête — seuils et poids : À VALIDER PAR LE COMITÉ) ;
 *  - choisirVariante : les conditions EXACTES du 07-miroir §0 / cartes.yaml
 *    (niveau → carte, ordre du sélecteur 1 → 3 ; ex æquo de seuil → niveau
 *    médian retenu — la porte plutôt que le silence, proposition) — voir sous
 *    le sélecteur. Seuils provisoires : JAMAIS rendus ;
 *  - CARTES : les 3 variantes verbatim (cartes.yaml, charte C1-C11) — une
 *    par niveau, étage 1, partageables. GABARIT OUVERT (doctrine capitale) :
 *    aucune variante ne scelle le niveau — « à travailler » se formule comme
 *    une porte (un muscle, ça se travaille), « silencieuse » décrit un
 *    silence, il ne prédit rien ; le silence n'est pas un échec ;
 *  - BRIEFING : l'annonce est VERBATIM (05-ecran-d-intro, 2 phrases), les
 *    puces sont la couche app rédigée (ton Task 35). PREMIUM [6] : zéro
 *    teaser, zéro présupposition — sans promesse (REN compatible) ;
 *  - COMPLETION : entête gabarit mission, labels et fenêtre F1 verbatim
 *    (cartes.yaml — le préfixe de slot « F1 : » reste au Livrable, précédents
 *    4.1/4.2), miroirNote en couche app.
 *
 * Citations conditionnées (arbitrage 6 du 00-README, appliqué à la lettre) :
 * les cartes QUI-TIENT (cité Q5.6-01, ancrage D) et SILENCIEUSE (cité
 * Q5.6-02, ancrage I — le portrait cite le mécanisme d'ombre mesuré) portent
 * chacune une citation « tu l'as répondu » qui n'est CERTIFIÉE que par la
 * réponse brute de l'énoncé cité — voir citationCertifiee(). Une citation
 * non certifiée se substitue par la lecture neutre du 04 (zéro citation
 * fausse, verrou 6 du 04).
 *
 * DOCTRINE (gelée — à ne pas inverser) : la réparation se mesure à ce qui se
 * passe APRÈS le désaccord — JAMAIS à la fréquence des disputes. Aucun niveau
 * n'est un verdict : le rendu parle en images (le muscle, la porte, le
 * silence), jamais en étiquette ; l'ombre = le COÛT (pour soi ET pour
 * l'autre), jamais un blâme — réparer tôt, réparer tard ou se taire se
 * valent comme descriptions.
 *
 * NOMMAGE (verrou capital — vérifié machine à chaque livraison) : le concept
 * de réparation est public (recherche conjugale) ; le nommage interne des
 * signaux est « signaux de communication à surveiller » — AUCUN nom d'auteur
 * ni nom d'instrument du domaine ne franchit le rendu, et les commentaires de
 * ce dépôt s'en abstiennent aussi. Les libellés des niveaux au rendu sont les
 * images du Livrable (qui tient · qui se travaille · silencieuse).
 *
 * Typo : apostrophe ASCII uniquement, guillemets français. Règles : aucun
 * code, score, sigle ou seuil ne franchit le rendu ; phrases ≤ 22 mots.
 */

import { avecEN } from '../i18n/apply';
import * as EN_Q56 from '../i18n/content/en/quete-5-6';
import type { ItemPassation } from './quetes';

export interface QueteItem56 {
  code: string;
  text: string;
  /** 'D' = directe · 'I' = inversée (recodée 6 − r — l'accord mesure le
   *  déficit, 01 : capacités 2 et 4). */
  orient: 'D' | 'I';
  /** La capacité verbatim du tableau 01 — clé interne SANS accent, cohérente
   *  partout (06 : codes des 5 capacités, 1 dimension unique « réparation »
   *  côté moteur) : excuse · premier_pas · humour · page_tournee ·
   *  accueil_excuse. Les libellés UI génériques restent au Livrable. */
  dim: 'excuse' | 'premier_pas' | 'humour' | 'page_tournee' | 'accueil_excuse';
}

/** Les 5 items — verbatim (01-tableau-des-items, ordre du tableau). */
const ITEMS_FR: readonly QueteItem56[] = [
  {
    code: "Q5.6-01",
    text: "Quand je me trompe, je m'excuse sans attendre qu'on me le demande.",
    orient: "D",
    dim: "excuse",
  },
  {
    code: "Q5.6-02",
    text: "Après une dispute, j'attends que l'autre fasse le premier pas.",
    orient: "I",
    dim: "premier_pas",
  },
  {
    code: "Q5.6-03",
    text: "L'humour me sert à désamorcer les tensions après une dispute.",
    orient: "D",
    dim: "humour",
  },
  {
    code: "Q5.6-04",
    text: "Une dispute réglée repasse dans ma tête pendant des jours.",
    orient: "I",
    dim: "page_tournee",
  },
  {
    code: "Q5.6-05",
    text: "Quand on m'excuse sincèrement, l'excuse me touche et c'est réglé.",
    orient: "D",
    dim: "accueil_excuse",
  },
];
export const ITEMS = avecEN(ITEMS_FR, EN_Q56.ITEMS);

/** Ordre de passation GELÉ — mélange RÉEL graine 256427 (02-plan-de-melange,
 *  outil générique melange.py, tentative 1, 0 échange — JAMAIS l'ordre des
 *  codes). Le 1ᵉʳ item vu est Q5.6-01 (l'excuse offerte), le dernier Q5.6-03
 *  (l'humour qui désamorce). Positions par capacité (réel) : excuse 1 ·
 *  accueil_excuse 2 · premier_pas 3 · page_tournee 4 · humour 5. Runs
 *  d'orientation D-D · I-I · D — run max 2 (c5 PASS) ; c1/c4 SANS-OBJET
 *  (1 dimension unique — dérogation documentée au 02, comité) ; c2/c3
 *  sans-objet (0 trame) ; verdicts 6/6 PASS. */
export const PASSATION: readonly string[] = [
  "Q5.6-01",
  "Q5.6-05",
  "Q5.6-02",
  "Q5.6-04",
  "Q5.6-03",
];

const PAR_CODE = new Map(ITEMS.map((i) => [i.code, i]));

/** Le deck réel : les 5 items dans l'ordre gelé, au format de passation
 *  unifié Likert (échelle 5) — zéro trame : tous les codes de la passation se
 *  résolvent en un item affiché. */
export function deckQuete(): ItemPassation[] {
  return PASSATION.flatMap((c) => {
    const it = PAR_CODE.get(c);
    return it ? [{ code: it.code, text: it.text, format: 'likert' as const }] : [];
  });
}

/** Likert 1-5 → 0-1 (inversées recodées 6 − r — l'accord y mesure le déficit). */
function contribution(reponse: number, orient: 'D' | 'I'): number {
  return ((orient === 'D' ? reponse : 6 - reponse) - 1) / 4;
}

export interface Score56 {
  /** Ta capacité de réparation — UNE moyenne unique (5 items, 1 item par
   *  capacité — AUCUNE paire R6, arithmétique documentée au 01/06), I
   *  recodés 6 − r, normalisée 0-1 (haut = tu sais revenir après un
   *  désaccord). Elle route l'affichage : carte (3 variantes), miroir
   *  (3 profils — un par niveau) et la porte ouverte (le niveau se
   *  travaille). */
  reparation: number;
  /** Signature d'index (contrat du registre : Record<string, number>) —
   *  aucun score supplémentaire n'y entre. */
  [dim: string]: number;
}

/**
 * Scorer du Livrable : la moyenne unique REPARATION, normalisée 0-1.
 *
 * SIG-5.6-01 (le niveau, 3 sorties) se lit contre les seuils provisoires du
 * sélecteur ci-dessous — rendu conversationnel, GABARIT OUVERT : le niveau
 * raconte un muscle entraînable, JAMAIS un verdict.
 * SIG-5.6-02 (le modulateur réparation × posture de conflit, 5.4) :
 * [MOTEUR SEUL] — jamais au rendu, jamais en UI, jamais au match affiché ;
 * il n'est PAS calculé ici (la posture de conflit 5.4 n'est pas consommée
 * par cette quête — seuils et poids : À VALIDER PAR LE COMITÉ). Sa double
 * lecture est documentée au 03 ; ce commentaire moteur est son seul lieu de
 * consignation dans cette app.
 */
export function scorer(reponses: Record<string, number>): Score56 {
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
  return { reparation: n > 0 ? total / n : 0 };
}

/** Les 3 variantes — ids VERBATIM (cartes.yaml, ordre du sélecteur 1 → 3). */
export type VarianteId56 =
  | 'CARTE-5.6-QUI-TIENT'
  | 'CARTE-5.6-SE-TRAVAILLE'
  | 'CARTE-5.6-SILENCIEUSE';

/** Les seuils des niveaux (SIG-5.6-01 — arbitrage 5 du 00-README) :
 *  T_bas = 0.40 · T_haut = 0.70 (moyenne normalisée 0-1, I recodés 6 − r) —
 *  PROVISOIRES, À VALIDER PAR LE COMITÉ (re-signature FM-019) :
 *  métadonnées moteur, JAMAIS rendues. */
const T_BAS = 0.4;
const T_HAUT = 0.7;

/**
 * Sélecteur VERBATIM (07-miroir §0 + cartes.yaml — SIG-5.6-01) : le niveau
 * (position de la moyenne unique vs les deux seuils) choisit la carte, dans
 * l'ordre du sélecteur 1 → 3 :
 *  1. REPARATION ≥ T_haut → CARTE-5.6-QUI-TIENT (niveau élevée) ;
 *  2. T_bas ≤ REPARATION < T_haut → CARTE-5.6-SE-TRAVAILLE (à travailler) ;
 *  3. REPARATION < T_bas → CARTE-5.6-SILENCIEUSE (silencieuse).
 * Ex æquo de seuil → niveau MÉDIAN retenu (07 §0 : « la porte plutôt que le
 * silence » — proposition, comité) : une moyenne exactement égale à un seuil
 * tombe dans le niveau médian (« à travailler »). Les trois règles se
 * réduisent alors à : > T_haut → 1, < T_bas → 3, sinon (y compris les deux
 * ex æquo exacts) → 2 — partition exclusive + exhaustive (C6, vérifiée au
 * yaml). Seuils provisoires : JAMAIS rendus.
 * Le modulateur SIG-5.6-02 ne participe JAMAIS à la sélection ni au rendu
 * (MOTEUR SEUL — verrou capital).
 */
export function choisirVariante(score: Score56): VarianteId56 {
  const v = typeof score.reparation === 'number' ? score.reparation : 0;
  if (v > T_HAUT) return 'CARTE-5.6-QUI-TIENT';
  if (v < T_BAS) return 'CARTE-5.6-SILENCIEUSE';
  return 'CARTE-5.6-SE-TRAVAILLE';
}

/** Certification d'une citation (arbitrage 6 du 00-README — appliqué à la
 *  lettre) : le moteur ne cite un énoncé QUE dans le sens de sa réponse
 *  brute. 'pleine' = répondu 4-5 — l'énoncé se cite tel quel (D ou I : pour
 *  un énoncé I répondu 4-5, la citation pleine décrit le mécanisme d'ombre
 *  mesuré) ; 'negation' = répondu 1-2 — la négation est confirmée, l'énoncé
 *  ne se cite pas (substituer la lecture neutre du 04 : « tu as répondu que
 *  la dispute ne te suit pas ») ; 'non-certifiee' = répondu 3 (neutre) ou
 *  réponse absente — le rappel tombe. Zéro citation fausse (verrou 6 du 04).
 *  Cartes porteuses : QUI-TIENT cite Q5.6-01 (ancrage D) · SILENCIEUSE cite
 *  Q5.6-02 (ancrage I — réponse brute haute certifiée) · SE-TRAVAILLE ne
 *  cite rien (« tu l'as répondu » absent de son portrait). */
export type CertificationCitation = 'pleine' | 'negation' | 'non-certifiee';

export function citationCertifiee(
  code: string,
  reponses: Record<string, number>,
): CertificationCitation {
  const it = PAR_CODE.get(code);
  const r = it ? reponses[code] : undefined;
  if (!it || typeof r !== 'number' || r < 1 || r > 5) return 'non-certifiee';
  if (r >= 4) return 'pleine';
  if (r <= 2) return 'negation';
  return 'non-certifiee';
}

export interface Carte {
  id: VarianteId56;
  nom: string;
  lumiere: string;
  ombre: string;
  tension: string;
}

/** Les 3 variantes de carte — verbatim (cartes.yaml, ordre du sélecteur :
 *  portrait → lumiere, ombre → ombre, tension_interieure → tension).
 *  GABARIT OUVERT : aucune variante ne scelle le niveau — « à travailler »
 *  est une porte (un muscle, ça se travaille), « silencieuse » décrit un
 *  silence, il ne prédit rien. NEUTRALITÉ : les trois niveaux se valent
 *  comme descriptions — réparer tôt, réparer tard ou se taire ne forment
 *  aucune hiérarchie de personnes ; l'ombre est le COÛT nommé pour soi ET
 *  pour l'autre, jamais un blâme. DUAL FACE : la carte est partageable — le
 *  partage ne présuppose rien d'acheté ([6]). */
export const CARTES: Record<VarianteId56, Carte> = {
  "CARTE-5.6-QUI-TIENT": {
    id: "CARTE-5.6-QUI-TIENT",
    nom: "La réparation qui tient",
    lumiere:
      "Tu l'as répondu : tu t'excuses sans attendre qu'on te le demande. Après un désaccord, tu sais revenir — un geste, un trait d'humour, une excuse reçue à son compte.",
    ombre:
      "Quand tu fais le premier pas à chaque fois, le premier pas de l'autre reste un muscle dormant. Le coût pour toi : la fatigue d'être le seul à revenir. Le coût pour l'autre : s'appuyer sur tes excuses.",
    tension: "ce n'est pas la fréquence des disputes qui pèse — c'est ce qui se passe après. Laisse parfois à l'autre le pas de la porte.",
  },
  "CARTE-5.6-SE-TRAVAILLE": {
    id: "CARTE-5.6-SE-TRAVAILLE",
    nom: "La réparation qui se travaille",
    lumiere:
      "Tes réparations existent — elles arrivent en retard, ou à contrecœur. L'humour te sert parfois à désamorcer, et une excuse sincèrement reçue te fait redescendre.",
    ombre:
      "La rumination transforme fréquemment un désaccord banal en blessure persistante : la dispute est réglée, elle repasse dans ta tête pendant des jours. Le coût pour toi : des lendemains qui paient pour la veille. Le coût pour l'autre : une excuse acceptée à moitié.",
    tension: "ton niveau de réparation n'est pas une taille : c'est un muscle — et un muscle, ça se travaille.",
  },
  "CARTE-5.6-SILENCIEUSE": {
    id: "CARTE-5.6-SILENCIEUSE",
    nom: "La réparation silencieuse",
    lumiere:
      "Tu l'as répondu : après une dispute, tu attends que l'autre fasse le premier pas. Ton silence évite d'enflammer ce qui est déjà vif — il a sa fonction.",
    ombre:
      "Quand personne ne revient, le mur de silence s'installe — le désaccord banal devient fréquemment une blessure persistante. Le coût pour toi : des disputes qui s'entassent. Le coût pour l'autre : frapper à une porte qui ne s'ouvre pas.",
    tension: "le silence est aussi une réponse — et la tienne peut changer de ton dès le premier pas.",
  },
};

/** Textes du briefing — annonce VERBATIM (05-ecran-d-intro, 2 phrases),
 *  puces en couche app (ton Task 35, gabarit ouvert — sans promesse). PREMIUM
 *  [6] : zéro teaser, zéro présupposition — la carte partageable reste le
 *  produit central, le partage ne présuppose rien d'acheté. */
export const BRIEFING = {
  annonce:
    "Les désaccords arrivent — ce qui se joue après, c'est ta façon de réparer. Ici, tu regardes comment tu répares, sans note et sans juge.",
  aQuoiCaSert: [
    "C'est la quête de ce qui se passe après : cinq gestes qui décident si un désaccord reste banal.",
    "Cinq affirmations, une seule lecture : la façon dont tu reviens après un désaccord — rien d'autre.",
    "Ici, rien n'est jugé : réparer tôt, réparer tard, ou garder le silence — chaque façon a sa place.",
    "À la fin, une carte à partager si tu veux : ta façon de revenir, en quelques mots.",
  ],
  resultats: [
    "Ta carte — ta façon de revenir après un désaccord : elle se partage, ou se garde.",
    "Une barre — ta capacité de réparation, telle que tu l'as décrite.",
    "Ton miroir à l'étape suivante — la lecture complète de ce qui se passe après, sans classement.",
    "Une pierre de plus dans ton portrait — la suite du voyage s'en nourrit.",
  ],
};

/** Textes de la fenêtre de complétion (carte) — entête gabarit mission,
 *  labels et fenêtre F1 verbatim (cartes.yaml — le préfixe de slot « F1 : »
 *  reste au Livrable, précédents 4.1/4.2), miroirNote en couche app. */
export const COMPLETION = {
  entete: "🧭 QUÊTE ACCOMPLIE — « Après un désaccord »",
  labelOmbre: "Ta zone d'ombre :",
  labelTension: "Ta tension intérieure :",
  fenetre:
    "Ta réparation dit ce qui se passe après un désaccord — ce qui se passe après pèse lourd.",
  miroirNote:
    "Ton miroir — la lecture complète de ce qui se passe après — arrive à la prochaine étape du voyage.",
};

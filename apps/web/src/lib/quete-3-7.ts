/**
 * Quête 3.7 « Tes attirances » — Monde 4 « Ton Terrain » — FORMAT SPÉCIAL PRIVÉ.
 *
 * Contenu FIDÈLE au Livrable M4-3.7-Tes-Attirances (5 fichiers : 00-README,
 * 01-tableau-des-declarations, 02-plan-sans-objet, 05-ecran-d-intro, README ;
 * 03-signatures-registre · 04-slots-de-miroir · 06-fiche-computation ·
 * 07-miroir · cartes.yaml sont NON PRODUITS PAR DESIGN — exemptions
 * documentées au 00-README et au README, precedents 1.7 / 1.11 / 2.8) :
 *  - DECLARATIONS : les 5 déclarations à choix VERBATIM (01-tableau, ordre du
 *    tableau = ordre canonique) — codes gelés Q3.7-01 → Q3.7-05, 25 options
 *    co-égales, aucune n'est « mieux » (l'étincelle ne vaut pas l'ancrage) ;
 *    Q3.7-05 porte sur le DÉBUT (aucune projection sur la durée) ;
 *  - PASSATION : ordre canonique FIGÉ Q3.7-01 → 02 → 03 → 04 → 05 — graine
 *    237427 ASSIGNÉE SANS TIRAGE (precedent 2.6/2.8 : l'ordre canonique EST le
 *    plan ; c6 — la séquence raconte une rencontre dans son ordre naturel :
 *    ce qui attire d'abord → ce qui retient → le style → la conversation → la
 *    dynamique ; « altérer l'ordre altérerait le récit » — precedent 1.11).
 *    Collision de graine MAÎTRISÉE : 237427 = graine RETIRÉE de 2.7 (re-tirée
 *    227427 en V8, artefacts archivés git) — réutilisation permise, jamais de
 *    collision avec une graine ACTIVE. Aucun artefact de mélange n'existe
 *    (sans-objet documenté, 02-plan-sans-objet).
 *
 * ⚠ LES 4 RÈGLES GRAVÉES (cadre éthique strict, mission V9.G — gravé à 4
 *   endroits du livrable : 00-README · 01 · 05 · README) :
 *   ① DÉCLARATIF — la personne choisit des options, rien ne se déduit.
 *   ② PRIVÉ — JAMAIS affiché sur le profil : aucune carte, aucun miroir,
 *      aucune signature, AUCUNE restitution — les déclarations ne se voient
 *      que du moteur (et de la personne, modifiables à tout moment). Ici :
 *      aucune trace des sélections dans CARTES/def/arche, aucun chip profil,
 *      aucun écran qui relit 3.7 en dehors de la quête elle-même.
 *   ③ JAMAIS dans le score de compatibilité — uniquement dans le POOL DE
 *      DÉCOUVERTE : les attirances organisent des RENCONTRES possibles, elles
 *      ne classent personne. Ce n'est pas du portrait — c'est du matching
 *      (mission verbatim). scorer() renvoie {} PAR PRINCIPE (ce n'est pas une
 *      absence d'implémentation) ; choisirVariante() renvoie '' ; CARTES est
 *      un objet VIDE — AUCUNE carte par design, PAS de fichier arche.
 *   ④ L'ÉCRAN D'INTRO ASSUME LA FONCTION — BRIEFING.annonce verbatim (05).
 *
 * ⚠ DIVERGENCE LIVRABLE/MISSION — LE LIVRABLE GAGNE (l'écran de production
 *   fait foi à l'affichage) : l'écran 05 écrit « organise tes découvertes —
 *   SANS ALIMENTER TON CLASSEMENT » tandis que la ligne de contrôle du même
 *   fichier cite la mission « organise tes découvertes — JAMAIS ton
 *   classement » (mot pour mot). Les deux formulations coexistent : le texte
 *   de l'écran est copié à l'écran, la citation mission vit dans cette
 *   documentation (fiche 46-a, ambiguïté n° 2 ; « vérifié machine avec
 *   exemption des citations verbatim » — 05).
 *
 * FORMAT DE RÉPONSE (01, verbatim) : sélection multiple AUTORISÉE — 1 À 3
 *   OPTIONS PAR DÉCLARATION (garde anti-sélection-totale : « un pool qui
 *   accepte tout ne protège personne ») ; bornes « À VALIDER PAR LE COMITÉ »
 *   (ne pas trancher côté app — 46-a §8.3). GARDE_MIN_37/GARDE_MAX_37 posent
 *   les bornes actuelles du garde : 0 option cochée = déclaration NON POSÉE
 *   (convention du contrat 1.7 : une réponse n'existe que si ≥ 1 option est
 *   cochée — jamais une inférence) ; > 3 = bloqué au clic côté écran
 *   (contrainte moteur, jamais une validation punitive — contrat
 *   d'intégration §4.2). La garde est une VALIDATION DE BORNE ajoutée au
 *   contrat multi 1.7 (le bitmask lui-même accepte toute combinaison).
 *
 * MODIFIABLE À TOUT MOMENT (01, verbatim) : « les attirances évoluent — la
 *   re-déclaration suit, sans question de relance » ; le menu de modification
 *   vit dans les RÉGLAGES, jamais en notification (01, décision n° 6) — à
 *   câbler côté réglages par l'intégration (moteur : rien à faire, la donnée
 *   est révocable par design, l'état reste wairyu.quete.3.7 local).
 *
 * ÉCRAN FINAL PRIVÉ (couche app — le livrable ne fournit AUCUNE entête de
 *   complétion : pas de cartes.yaml, gabarit 1.7/1.11/2.8 ; fiche 46-a §7.7)
 *   — ECRAN_FINAL_37 + COMPLETION. CE QUE L'ÉCRAN AFFICHE : la promesse de
 *   discrétion, le rôle des déclarations (organiser les découvertes), la
 *   réversibilité. CE QU'IL NE DIT PAS : le contenu des déclarations (AUCUNE
 *   restitution — rien n'est jamais affiché ; privacy structurelle : le
 *   contenu rendu ne dépend PAS de l'ordre, l'ordre ne peut rien révéler),
 *   aucun classement, aucun score, aucune visibilité par d'autres, aucune
 *   relance. AUCUN écran d'écho des réponses (l'écran de rappel 1.7 qui
 *   relit les choix n'a PAS d'équivalent ici : la restitution est exemptée).
 *
 * POOL DE DÉCOUVERTE (usage moteur — 01, lecture du refonte) : les sélections
 *   alimentent le pool — le moteur ne propose en Mode Invisible que des
 *   profils à attirance présumée RÉCIPROQUE (les styles déclarés de l'un
 *   croisent les présences déclarées de l'autre — la réciprocité se presume
 *   côté moteur, elle ne se calcule JAMAIS en score rendu). Utilisation hors
 *   du pool : AUCUNE — ni au matching public, ni au classement, ni au premium
 *   (README). extrairePool37() expose la STRUCTURE BRUTE (déclaration →
 *   indices d'options cochées) pour le futur pool : MOTEUR SEUL, jamais
 *   rendue, jamais au score. La quête est un PRÉREQUIS d'activation du Mode
 *   Invisible (le voyageur qui n'a pas déclaré ses attirances ne reçoit pas
 *   de découvertes du mode — douceur du lancement, pas un blocage : le Socle
 *   et les mondes gratuits restent intégralement accessibles — README). Le
 *   seuil de réciprocité présumée : À VALIDER PAR LE COMITÉ (hors dépôt).
 *
 * CODAGE DES RÉPONSES (couche app, jamais rendu — voir CODAGE_37) : BITMASK
 *   comme 1.7 — bit 0 = option 1 cochée, bit 1 = option 2 cochée, … ; 0 =
 *   déclaration non posée. Opt-in strict : aucune case pré-cochée, aucune
 *   valeur par défaut orientante.
 *
 * Éthique des options (01, décisions de composition) : des STYLES et des
 *   PRÉSENCES — jamais une taxonomie de corps, jamais un gabarit idéal, zéro
 *   option genrée ou normée (inclusion stricte) ; les métaphores d'objet de
 *   Q3.7-03 (le soleil, l'énigme, le refuge, l'étincelle, l'ancrage) sont des
 *   types de PRÉSENCE en langage courant (C2/C3), exemptées du point médian
 *   (precedent VAGUE 5) ; le Mode Invisible est nommé comme un OUTIL, jamais
 *   promis comme un prix (05).
 *
 * Typo : apostrophe ASCII ' uniquement, pas d'insécable, guillemets français
 * « » ; aucun code/score/sigle/seuil rendu ; textes rédigés (puces, écran
 * final) : tutoiement, présent, ≤ 22 mots, sans « jamais »/« toujours » hors
 * citations verbatim (exception documentée au 05).
 */

import type { ItemPassation } from './quetes';
import { avecEN } from '../i18n/apply';
import * as EN_Q37 from '../i18n/content/en/quete-3-7';

/** Une déclaration à choix — l'écran multi du gabarit 1.7, plus la garde. */
export interface Declaration37 {
  /** Code gelé (01-tableau) — Q3.7-01 → Q3.7-05, ordre canonique. */
  code: 'Q3.7-01' | 'Q3.7-02' | 'Q3.7-03' | 'Q3.7-04' | 'Q3.7-05';
  /** La déclaration VERBATIM (01-tableau). */
  question: string;
  /** Les 5 options VERBATIM, dans l'ordre du livrable (25 options co-égales). */
  options: readonly string[];
  /** Garde multi — nombre MINIMAL d'options cochées (1). */
  min: number;
  /** Garde multi — nombre MAXIMAL d'options cochées (3). */
  max: number;
}

/** Les bornes du garde multi-sélection — « 1 à 3 options par déclaration »
 *  (01, verbatim). ⚠ BORNES « À VALIDER PAR LE COMITÉ » (00-README · 01 ·
 *  README · 46-a §8.3) — ne pas modifier sans Fiche de Mutation. */
export const GARDE_MIN_37 = 1;
export const GARDE_MAX_37 = 3;

/** Les 5 déclarations — VERBATIM (01-tableau-des-declarations, ordre du
 *  tableau = ordre canonique de passation, graine 237427 SANS TIRAGE).
 *  Les options co-égales se répondent en moins d'une minute (02) ; aucune
 *  case pré-cochée (opt-in strict). */
const DECLARATIONS_FR: readonly Declaration37[] = [
  {
    code: 'Q3.7-01',
    question: "La première chose qui t'attire chez quelqu'un",
    options: ['l\'allure', 'la voix', 'le regard', 'le sourire', 'la façon de bouger'],
    min: GARDE_MIN_37,
    max: GARDE_MAX_37,
  },
  {
    code: 'Q3.7-02',
    question: 'Ce qui te retient, passé le premier regard',
    options: ['l\'humour', 'la douceur', 'l\'ambition', 'la stabilité', 'l\'audace'],
    min: GARDE_MIN_37,
    max: GARDE_MAX_37,
  },
  {
    code: 'Q3.7-03',
    question: 'Le style de personne qui te fait tourner la tête',
    // Métaphores d'objet — types de PRÉSENCE, exemptées du point médian
    // (precedent VAGUE 5, décision n° 2 du 01).
    options: ['le soleil', 'l\'énigme', 'le refuge', 'l\'étincelle', 'l\'ancrage'],
    min: GARDE_MIN_37,
    max: GARDE_MAX_37,
  },
  {
    code: 'Q3.7-04',
    question: "Ce que tu remarques d'abord dans une conversation",
    options: ['l\'esprit vif', 'l\'écoute', 'les histoires', 'les idées', 'le silence à l\'aise'],
    min: GARDE_MIN_37,
    max: GARDE_MAX_37,
  },
  {
    code: 'Q3.7-05',
    question: 'La dynamique qui te plaît au début',
    // « au début » : la dynamique déclarée porte sur le DÉBUT — aucune
    // projection sur la durée, pas de futur certain (01, décision n° 3).
    options: [
      'qui s\'allume vite',
      'qui monte doucement',
      'qui surprend',
      'qui rassure',
      'qui construit d\'abord l\'amitié',
    ],
    min: GARDE_MIN_37,
    max: GARDE_MAX_37,
  },
];
export const DECLARATIONS = avecEN(DECLARATIONS_FR, EN_Q37.DECLARATIONS);

/** Documentation du codage des réponses (couche app — jamais rendu [3]). */
export const CODAGE_37 =
  'multi: la réponse est un BITMASK (bit 0 = option 1 cochée, bit 1 = option 2 cochée, …) · ' +
  'garde: 1 à 3 options cochées par déclaration (0 = déclaration non posée, > 3 bloqué au clic)';

/** Le deck réel : 5 items 'question' multi:true (gabarit 1.7) — ordre
 *  canonique FIGÉ 01 → 05 (le scénario d'approche EST le plan, 02). */
export function deckQuete(): ItemPassation[] {
  return DECLARATIONS.map(
    (d): ItemPassation => ({
      code: d.code,
      text: d.question,
      format: 'question',
      options: d.options,
      multi: true,
    }),
  );
}

/** Nombre d'options cochées dans un bitmask (popcount — codage 1.7). */
export function compteSelections37(bitmask: number): number {
  if (!Number.isFinite(bitmask)) return 0;
  let m = Math.trunc(bitmask);
  let n = 0;
  while (m > 0) {
    m &= m - 1;
    n += 1;
  }
  return n;
}

/** La garde 1-3 (couche moteur — l'écran désactive le 4ᵉ toggle, jamais une
 *  validation punitive) : true si le nombre d'options cochées est dans
 *  [min, max]. 0 coche → false : la déclaration est NON POSÉE (réponse
 *  absente — jamais une inférence, convention contrat 1.7). Bornes « À
 *  VALIDER PAR LE COMITÉ ». */
export function selectionValide37(bitmask: number): boolean {
  const n = compteSelections37(bitmask);
  return n >= GARDE_MIN_37 && n <= GARDE_MAX_37;
}

/**
 * AUCUN SCORE PAR DESIGN — pool d'attirance, jamais au calcul de
 * compatibilité : les attirances n'entrent dans AUCUN score, AUCUN
 * classement, AUCUN premium (README, doctrine gravée ③). Renvoie toujours {}
 * pour la compatibilité du contrat QueteDef.scorer — ce n'est pas une
 * absence d'implémentation (precedent scorerNul 1.7/2.8).
 */
export function scorer(_reponses: Record<string, number>): Record<string, number> {
  return {};
}

/** AUCUNE carte par design (exemption documentée — « c'est du matching, pas
 *  du portrait », mission V9.G) : la complétion rend l'écran final PRIVÉ,
 *  jamais une variante. Ne jamais appeler (quête sansCarte — moule 2.8). */
export function choisirVariante(): string {
  return '';
}

/** La forme d'une carte du registre — aucun exemplaire n'existe ici. */
export interface Carte37 {
  id: string;
  nom: string;
  lumiere: string;
  ombre: string;
  tension: string;
}

/** ⚠ OBJET VIDE PAR DESIGN — aucune carte, aucun miroir, aucune signature
 *  (exemptions documentées au 00-README et au README, precedents 1.7/1.11/2.8).
 *  Ne PAS « recréer » des cartes (46-a §7.13 n° 4) : ce module n'expose cet
 *  objet vide que pour le contrat du registre (QueteDef.cartes). */
export const CARTES: Record<string, Carte37> = {};

/** L'écran d'intro — VERBATIM (05-ecran-d-intro, texte de production, les
 *  2 lignes) : la fonction assumée AVANT la première déclaration (« sans
 *  alimenter ton classement » — livrable gagne, voir en-tête) et la promesse
 *  de discrétion posée AVANT le premier choix (« personne ne le voit »). */
const INTRO_37_FR = {
  ligne1: 'Ce que tu déclares ici organise tes découvertes — sans alimenter ton classement.',
  ligne2: 'Personne ne le voit : c\'est ta boussole privée pour le Mode Invisible.',
};
export const INTRO_37 = avecEN(INTRO_37_FR, EN_Q37.INTRO_37);

/** Les puces du briefing — couche app (ton Task 35 : simple et littéral) ;
 *  elles ASSUMENT la fonction de la quête : déclaratif, privé, modifiable,
 *  jamais au profil, jamais un classement — sans reprendre le mot « jamais »
 *  hors citation (exception verbatim documentée au 05). */
const A_QUOI_CA_SERT_37_FR: readonly string[] = [
  'Cinq déclarations à choix : tu coches ce qui t\'attire — de une à trois options par déclaration.',
  'Rien ne se déduit, rien ne se note : tu coches des mots, c\'est tout.',
  'Personne ne voit tes déclarations — ni sur ton profil, ni ailleurs.',
  'Les attirances évoluent : modifiable à tout moment, sans question de relance.',
];

/** Ce que produit la quête — un écran privé, rien d'autre (sans carte). */
const RESULTATS_37_FR: readonly string[] = [
  'Un écran privé — sans carte, sans note, sans partage.',
  'Tes déclarations organisent tes découvertes à venir — c\'est leur seul usage.',
];

/** Textes du briefing — annonce VERBATIM (05, les deux lignes jointes par un
 *  saut de ligne — precedent 2.8), puces couche app. */
export const BRIEFING = {
  annonce: INTRO_37.ligne1 + '\n' + INTRO_37.ligne2,
  aQuoiCaSert: avecEN(A_QUOI_CA_SERT_37_FR, EN_Q37.BRIEFING.aQuoiCaSert),
  resultats: avecEN(RESULTATS_37_FR, EN_Q37.BRIEFING.resultats),
};

/** L'écran final PRIVÉ — COUCHE APP (le livrable ne fournit aucun écran de
 *  complétion : gabarit 1.7/1.11/2.8, fiche 46-a §7.7). Il AFFICHE : la
 *  discrétion (rien n'est affiché, rien n'est noté), le rôle (organiser les
 *  découvertes — sans classer), la réversibilité (modifiable à tout moment).
 *  Il ne dit PAS : le contenu des déclarations (AUCUNE restitution — aucun
 *  rappel des choix, contrairement à l'écran de confiance 1.7), aucun
 *  classement, aucun score, aucune visibilité par d'autres, aucune relance,
 *  aucune promesse de rencontre (le Mode Invisible est un outil, jamais un
 *  prix — 05). */
const ECRAN_FINAL_37_FR = {
  titre: 'Tes attirances restent à toi.',
  texte:
    'Ce que tu as déclaré reste privé — rien ne s\'affiche, rien ne se note. ' +
    'Tes déclarations organisent tes découvertes : elles orientent les rencontres possibles, ' +
    'sans te classer ni te comparer. Les attirances évoluent — tu peux les modifier à tout moment, quand tu veux.',
};
export const ECRAN_FINAL_37 = avecEN(ECRAN_FINAL_37_FR, EN_Q37.ECRAN_FINAL_37);

/** Fenêtre de complétion — entête = gabarit app (precedent 1.7/2.8, le
 *  Livrable n'en fournit aucune) ; fenetre = le corps de l'écran final PRIVÉ
 *  ; ombre/tension/miroir : chaînes vides — sans objet (sans carte, miroir
 *  EXEMPTÉ par design). */
const COMPLETION_37_FR = {
  entete: '🧭 QUÊTE ACCOMPLIE — « Tes attirances »',
  labelOmbre: '',
  labelTension: '',
  fenetre: ECRAN_FINAL_37.texte,
  miroirNote: '',
};
export const COMPLETION = avecEN(COMPLETION_37_FR, EN_Q37.COMPLETION);

/**
 * POOL DE DÉCOUVERTE — structure brute pour le futur pool (MOTEUR SEUL,
 * JAMAIS rendue, jamais au score, jamais au profil : doctrine gravée ②/③).
 * Une entrée = une déclaration et les INDICES (0-based, ordre du livrable)
 * des options cochées. Le futur Mode Invisible croisera les styles déclarés
 * de l'un avec les présences déclarées de l'autre (réciprocité PRÉSUMÉE,
 * calculée côté moteur — jamais en score rendu) ; seuil de réciprocité : À
 * VALIDER PAR LE COMITÉ. Une déclaration sans réponse (bitmask absent ou 0)
 * ne produit PAS d'entrée — jamais d'inférence (douceur du lancement).
 */
export interface EntreePool37 {
  /** Code gelé de la déclaration (Q3.7-01 → Q3.7-05). */
  code: string;
  /** Indices 0-based des options cochées, dans l'ordre du livrable. */
  indices: readonly number[];
}

/** Extrait les sélections brutes pour le pool de découverte — données
 *  moteur, consommées par le futur pool : rien de ceci n'atteint jamais le
 *  rendu, le profil ou un score (garde anti-fuite : aucun écran ne lit 3.7
 *  en dehors de la quête). */
export function extrairePool37(reponses: Record<string, number>): readonly EntreePool37[] {
  const entrees: EntreePool37[] = [];
  for (const d of DECLARATIONS) {
    const masque = reponses[d.code];
    if (typeof masque !== 'number' || !Number.isFinite(masque) || masque <= 0) continue;
    const indices: number[] = [];
    for (let bit = 0; bit < d.options.length; bit += 1) {
      if ((masque & (1 << bit)) !== 0) indices.push(bit);
    }
    if (indices.length > 0) entrees.push({ code: d.code, indices });
  }
  return entrees;
}

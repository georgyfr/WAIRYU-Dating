/**
 * Quête 1.11 « Es-tu prêt·e à rencontrer ? » — Monde 2 « Le Volant ».
 *
 * QUÊTE-ÉCRAN DE PASSAGE (Livrable M2-1.11-Es-Tu-Pret-A-Rencontrer, branche
 * archive/v1-2026-10-05) — contenu FIDÈLE au Livrable :
 *  - QUESTIONS : 3 questions fermées à options multiples, VERBATIM
 *    (01-tableau-des-questions, ordre du tableau) ;
 *  - PASSATION : ordre FIXE 01 → 02 → 03, SANS mélange (02-plan-de-passage :
 *    la séquence est un scénario — d'où je viens → quelle place j'ai → ce que
 *    je cherche — altérer l'ordre altérerait la scène) ;
 *  - SORTIES : les 3 écrans de sortie VERBATIM (05-ecran-d-intro), textes
 *    doux, courts, sans futur certain — aucun chemin n'est « le bon » ;
 *  - PAS de carte, PAS de miroir, PAS de score (fiche de cadrage : « jamais
 *    de score, jamais public, jamais dans le matching ») — les réponses
 *    pilotent un routage, elles ne calculent rien ;
 *  - ZÉRO jugement, zéro stigmate : le chemin ③ est un manifeste assumé,
 *    jamais un reproche (doctrine du Livrable).
 *
 * Routage et vocabulaire moteur (RB1, gatekeeping, recommandations 4.2 / 1.8) :
 * ils vivent côté moteur et ne sont JAMAIS rendus à l'utilisateur. Dans cette
 * version, les quêtes recommandées du Livrable n'existent pas — l'écran de
 * sortie ② reste verbatim et générique, et le routage moteur tombera sur
 * ③ / ① selon la disponibilité des quêtes (voir chemin111).
 *
 * Les guillemets « » qui citent les verbatims dans le Livrable ne font pas
 * partie des textes. Apostrophes ASCII uniquement. Phrases ≤ 22 mots.
 */

import type { ItemPassation } from './quetes';
import { avecEN } from '../i18n/apply';
import * as EN_Q111 from '../i18n/content/en/quete-1-11';

/** Une question fermée de l'écran de passage — options dans l'ordre du Livrable. */
export interface Question111 {
  code: 'Q1.11-01' | 'Q1.11-02' | 'Q1.11-03';
  question: string;
  options: readonly string[];
}

/** Les 3 questions — VERBATIM (01-tableau-des-questions, ordre du tableau = ordre FIXE). */
const QUESTIONS_111_FR: readonly Question111[] = [
  {
    code: 'Q1.11-01',
    question: 'Ta dernière relation : finie, en cours d\'oubli, ou encore en toi ?',
    options: ['Finie', 'En cours d\'oubli', 'Encore en toi'],
  },
  {
    code: 'Q1.11-02',
    question: 'Si la bonne personne arrivait demain : aurais-tu le temps et l\'espace pour elle ?',
    options: ['Oui', 'Pas encore', 'Je ne sais pas'],
  },
  {
    code: 'Q1.11-03',
    question: 'Tu cherches à être comblé·e, ou à construire à deux ?',
    options: ['Être comblé·e', 'Construire à deux'],
  },
];
export const QUESTIONS_111 = avecEN(QUESTIONS_111_FR, EN_Q111.QUESTIONS_111);

/** Le deck de passation — ordre FIXE 01 → 02 → 03 (aucun mélange, 02-plan-de-passage :
 *  la séquence fait jouer la mémoire récente avant l'ouverture, et l'ouverture
 *  avant l'intention). Chaque item est une question à choix unique. */
export function deck111(): ItemPassation[] {
  return QUESTIONS_111.map((q) => ({
    code: q.code,
    text: q.question,
    format: 'question' as const,
    options: q.options,
  }));
}

/** Les trois chemins de sortie — tous dignes, aucun n'est renforcé (contrôle
 *  « neutralité normative » du Livrable). */
export type Chemin111 = 'pret' | 'recommandation' | 'quandMeme';

/**
 * RÈGLE DE ROUTAGE — documentée (le Livrable ne fige pas de lecture mécanique
 * des réponses : 02-plan-de-passage, « le chemin se choisit APRÈS les 3
 * questions (écran de sortie unique) »).
 *
 * Les réponses sont l'INDEX de l'option choisie + 1 (1-based, ordre du
 * tableau des questions). Priorité appliquée :
 *
 *  1. Choix explicite du membre — clé 'Q1.11-chemin', valeur 1-based dans
 *     l'ordre des chemins du Livrable (1 = ① « Je suis prêt·e »,
 *     2 = ② « D'abord une quête recommandée », 3 = ③ « Je commence quand
 *     même »). La personne choisit, l'app suit (fiche de cadrage). Le ③
 *     l'emporte TOUJOURS : manifeste assumé, jamais bloquant, jamais repris
 *     comme reproche, jamais re-posé en condition.
 *  2. Sans choix explicite — repli documenté en cas d'ambiguïté : ② si un
 *     signal de disponibilité apparaît — Q1.11-01 « en cours d'oubli »
 *     (réponse 2) ou « encore en toi » (réponse 3) = relation récente ;
 *     sinon ① (le départ par défaut de l'écran).
 *
 * Hors routage (lecture moteur silencieuse, non implémentée ici) :
 *  - Q1.11-02 « Pas encore » module le RYTHME d'activation côté moteur
 *    (« jamais une élimination, jamais un score ») : il ne change pas le
 *    chemin ;
 *  - Q1.11-03 est une lecture d'intention du moment : aucune option n'est
 *    « meilleure », aucune ne route ;
 *  - le « signal bien-être » du routage (1.8) est une condition À VALIDER PAR
 *    LE COMITÉ — non implémentée ici ;
 *  - les quêtes recommandées du Livrable (4.2 / 1.8) ne concernent PAS cette
 *    version : elles ne sont jamais rendues — l'écran de sortie ② reste
 *    verbatim et générique, et le routage moteur tombera sur ③ / ① selon la
 *    disponibilité des quêtes.
 */
export function chemin111(reponses: Record<string, number>): Chemin111 {
  const choix = reponses['Q1.11-chemin'];
  if (choix === 3) return 'quandMeme';
  if (choix === 1) return 'pret';
  if (choix === 2) return 'recommandation';
  const derniereRelation = reponses['Q1.11-01'];
  if (derniereRelation === 2 || derniereRelation === 3) return 'recommandation';
  return 'pret';
}

/** Les trois écrans de sortie — VERBATIM (05-ecran-d-intro ; les deux lignes
 *  de chaque écran sont jointes par un saut de ligne). Textes doux, courts,
 *  sans futur certain, zéro métadonnée : aucun chemin n'est « le bon ». */
const SORTIES_111_FR: Record<Chemin111, { titre: string; texte: string }> = {
  pret: {
    titre: 'Je suis prêt·e',
    texte: 'Alors, on avance.\nTon voyage continue — la suite arrive à son rythme, comme toi.',
  },
  recommandation: {
    titre: 'D\'abord une quête recommandée',
    texte:
      'Il y a une étape qui peut t\'aider d\'abord — pas une obligation, juste un pont.\n' +
      'Tu y vas quand tu veux, et ton cap reste là où tu l\'as posé.',
  },
  quandMeme: {
    titre: 'Je commence quand même',
    texte:
      'Tu avances maintenant, comme tu l\'as décidé.\n' +
      'C\'est ton voyage — tout reste modifiable, et personne ne te redemandera tes raisons.',
  },
};
export const SORTIES_111 = avecEN(SORTIES_111_FR, EN_Q111.SORTIES_111);

/** AUCUN score — quête-écran de passage : les réponses ne calculent rien, elles
 *  routent (fiche de cadrage, « Restitutions — aucune »). Exporté uniquement
 *  pour la compatibilité du contrat QueteDef.scorer. */
export function scorerNul111(_reponses: Record<string, number>): Record<string, number> {
  return {};
}

/** AUCUNE carte — écran de passage (exemption documentée, precedent 1.7) :
 *  la complétion rend l'écran de sortie verbatim, jamais une carte. Exporté
 *  uniquement pour la compatibilité du contrat QueteDef.choisirVariante. */
export function choisirVariante(_score: Record<string, number>): string {
  return '';
}

/** Textes du briefing — annonce VERBATIM (05-ecran-d-intro, les deux lignes
 *  jointes par un saut de ligne) ; les puces aQuoiCaSert / resultats sont la
 *  couche app (ton Task 35 — simple et littéral, jamais de métadonnée moteur,
 *  jamais de test ni de diagnostic). */
export const BRIEFING = {
  annonce:
    'Avant d\'ouvrir la suite, une pause : trois questions, juste pour toi.\n' +
    'Pas de bonnes réponses — ta réponse dessine ton départ.',
  aQuoiCaSert: [
    'Trois questions pour te poser la question — la réponse reste à toi.',
    'Aucun test, aucun diagnostic : trois questions fermées, et un écran de sortie.',
    'Tu peux recommencer quand tu veux, et changer ta réponse plus tard.',
    'La disponibilité se relit — elle ne se fige pas.',
  ],
  resultats: [
    'Ton écran de sortie — un texte court, celui du chemin que tu as choisi.',
    'Rien n\'est figé : tu pourras relire et changer ta disponibilité quand tu veux.',
  ],
};

/** Textes de la fenêtre de complétion — l'entête reprend le titre de la quête
 *  (Constitution : « 1.11 Es-tu prêt·e à rencontrer ? »). Les autres champs
 *  sont SANS OBJET : pas de carte, pas de miroir, pas de fenêtre — écran de
 *  passage, la complétion rend l'écran de sortie verbatim. */
export const COMPLETION = {
  entete: '🧭 QUÊTE ACCOMPLIE — « Es-tu prêt·e à rencontrer ? »',
  labelOmbre: '',
  labelTension: '',
  fenetre: '',
  miroirNote: '',
};

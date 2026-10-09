/**
 * Monde 4 · quête 3.7 « Tes attirances » (écran privé) — DECLARATIONS
 * (5 déclarations + options), INTRO_37 (2 lignes), BRIEFING (aQuoiCaSert +
 * resultats ; l'annonce est dérivée des lignes INTRO_37 côté FR),
 * ECRAN_FINAL_37 (titre + texte), COMPLETION (entête).
 *
 * MIROIR EN — structure parallèle au FR (fusion par INDEX/tableaux, par
 * CLÉ/objets). Une chaîne absente = repli FR silencieux (avecEN).
 * NE PAS recopier : les codes (Q…), les bornes min/max (nombres — côté FR).
 * Les 5 déclarations et leurs 5 options suivent l'ordre du livrable —
 * longueurs égales exigées (fusion par INDEX).
 * RÈGLE PRIVÉE (inchangée) : les déclarations ne se voient que du moteur et
 * de la personne — jamais au profil, jamais au score : uniquement le pool de
 * découverte. L'écran final ne restitue JAMAIS les choix.
 */
import type { L10n } from '../../apply';
import type { Declaration37 } from '../../../lib/quete-3-7';

export const DECLARATIONS: L10n<readonly Declaration37[]> = [
  {
    question: 'The first thing that draws you to someone',
    options: [
      'The way they carry themselves',
      'The voice',
      'The look in their eyes',
      'The smile',
      'The way they move',
    ],
  },
  {
    question: 'What keeps you there, past the first look',
    options: ['Humor', 'Gentleness', 'Ambition', 'Stability', 'Boldness'],
  },
  {
    question: 'The kind of person who makes you turn your head',
    options: ['The sunshine', 'The enigma', 'The shelter', 'The spark', 'The anchor'],
  },
  {
    question: 'What you notice first in a conversation',
    options: [
      'A quick wit',
      'The way they listen',
      'The stories',
      'The ideas',
      'A comfortable silence',
    ],
  },
  {
    question: 'The dynamic you like at the start',
    options: [
      'The one who lights up fast',
      'The one that builds slowly',
      'The one who surprises',
      'The one who reassures',
      'The one that builds friendship first',
    ],
  },
];

export const INTRO_37: L10n<{ ligne1: string; ligne2: string }> = {
  ligne1: 'What you declare here organizes your discoveries — without feeding any ranking.',
  ligne2: 'Nobody sees it: it is your private compass for Invisible Mode.',
};

export const BRIEFING: L10n<{ annonce: string; aQuoiCaSert: readonly string[]; resultats: readonly string[] }> = {
  annonce:
    'What you declare here organizes your discoveries — without feeding any ranking.\n' +
    'Nobody sees it: it is your private compass for Invisible Mode.',
  aQuoiCaSert: [
    'Five statements to choose from: you tick what attracts you — one to three options per statement.',
    'Nothing is inferred, nothing is scored: you tick words, that is all.',
    'Nobody sees your declarations — not on your profile, not anywhere.',
    'Tastes move: change your declarations whenever you want, with no follow-up questions.',
  ],
  resultats: [
    'A private screen — no card, no score, no sharing.',
    'Your declarations organize the discoveries to come — that is their only use.',
  ],
};

export const ECRAN_FINAL_37: L10n<{ titre: string; texte: string }> = {
  titre: 'Your attractions stay yours.',
  texte:
    'What you declared stays private — nothing shows, nothing is scored. ' +
    'Your declarations organize your discoveries: they point to possible meetings, ' +
    'without ranking you or comparing you. Tastes move — you can change them whenever you want.',
};

export const COMPLETION: L10n<{ entete: string }> = {
  entete: '🧭 QUEST COMPLETE — “Your attractions”',
};

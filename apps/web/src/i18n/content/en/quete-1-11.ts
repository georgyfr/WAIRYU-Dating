/**
 * Monde 2 · quête 1.11 « Es-tu prêt·e à rencontrer ? » — QUESTIONS_111 (3 questions + options) + SORTIES_111 (3 sorties).
 *
 * MIROIR EN — structure parallèle au FR (fusion par INDEX/tableaux, par
 * CLÉ/objets). Une chaîne absente = repli FR silencieux (avecEN).
 * NE PAS recopier : les codes (Q…), ids de variantes, clés de dims,
 * orientations, booléens — ils restent côté FR.
 * Les 3 chemins de sortie restent tous dignes, aucun n'est renforcé ; les
 * sauts de ligne (\n) du FR sont conservés à l'identique.
 */
import type { L10n } from '../../apply';
import type { Question111 } from '../../../lib/quete-1-11';

export const QUESTIONS_111: L10n<readonly Question111[]> = [
  {
    question: 'Your last relationship: over, fading out, or still in you?',
    options: ['Over', 'Fading out', 'Still in you'],
  },
  {
    question: 'If the right person arrived tomorrow: would you have the time and the space for them?',
    options: ['Yes', 'Not yet', "I don't know"],
  },
  {
    question: 'Are you looking to feel fulfilled, or to build as two?',
    options: ['To feel fulfilled', 'To build as two'],
  },
];

type Sortie111 = L10n<{ titre: string; texte: string }>;

export const SORTIES_111: {
  pret?: Sortie111;
  recommandation?: Sortie111;
  quandMeme?: Sortie111;
} = {
  pret: {
    titre: "I'm ready",
    texte:
      "Then we move forward.\nYour journey continues — what comes next arrives at its own pace, like you.",
  },
  recommandation: {
    titre: 'First, a suggested quest',
    texte:
      "There's one step that can help you first — not an obligation, just a bridge.\n" +
      'You go there whenever you want, and your course stays where you set it.',
  },
  quandMeme: {
    titre: "I'm starting anyway",
    texte:
      "You're moving forward now, like you decided.\n" +
      "It's your journey — everything stays editable, and no one will ask for your reasons again.",
  },
};

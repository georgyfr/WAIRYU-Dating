/**
 * Monde 2 · quête 1.7 « Ton fonctionnement » (écran de confiance) — QUESTIONS_17 (2 questions + options) + ECRAN_17 (titre + texte).
 *
 * MIROIR EN — structure parallèle au FR (fusion par INDEX/tableaux, par
 * CLÉ/objets). Une chaîne absente = repli FR silencieux (avecEN).
 * NE PAS recopier : les codes (Q…), ids de variantes, clés de dims,
 * orientations, booléens — ils restent côté FR.
 * « Je ne souhaite pas le dire » reste une option de première classe, à sa
 * position exacte (6ᵉ et dernière).
 */
import type { L10n } from '../../apply';
import type { Question17 } from '../../../lib/quete-1-7';

export const QUESTIONS_17: L10n<readonly Question17[]> = [
  {
    question: 'Check whatever describes you, if you want to share it:',
    options: [
      'Neuro-atypical (ASD)',
      'ADHD',
      'Dys (dyslexia, dyspraxia…)',
      'Anxiety I manage',
      'Other (free text)',
      "I'd rather not say",
    ],
  },
  {
    question: "Can someone you match with see that you're comfortable with neurodiversity?",
    options: ['Yes, show it on my profile', 'No, keep it private'],
  },
];

export const ECRAN_17: L10n<{ titre: string; texte: string }> = {
  titre: 'Thank you for your trust.',
  texte:
    "What you shared stays between you and the app — unless you chose to show it on your profile. It will help the people you meet feel at ease, and it will help you cross paths with people who understand you.\n\nYou can change or erase it at any time, from your profile. None of this enters any score.",
};

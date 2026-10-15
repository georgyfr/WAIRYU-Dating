/**
 * Monde 2 · quête 1.7 « Ton fonctionnement » (écran de confiance) — QUESTIONS_17 (2 questions + options) + EXPLIQUES_17 (mots en clair) + INFO_17 (pop-up) + ECRAN_17 (titre + texte).
 *
 * MIROIR EN — structure parallèle au FR (fusion par INDEX/tableaux, par
 * CLÉ/objets). Une chaîne absente = repli FR silencieux (avecEN).
 * NE PAS recopier : les codes (Q…), ids de variantes, clés de dims,
 * orientations, booléens — ils restent côté FR.
 * « Je ne souhaite pas le dire » reste une option de première classe, à sa
 * position exacte (6ᵉ et dernière) ; EXPLIQUES_17 garde les mêmes index,
 * nulls compris (options sans pop-up).
 */
import type { L10n } from '../../apply';
import type { Explic17, Question17 } from '../../../lib/quete-1-7';

export const QUESTIONS_17: L10n<readonly Question17[]> = [
  {
    question: 'Check whatever describes you, if you want to share it:',
    options: [
      'I experience the world differently from most people',
      'I get distracted fast and my energy overflows',
      'Reading, writing, or getting organized takes me real effort',
      'I worry a lot, and I\x27m learning to calm it',
      'Something else describes me — I write my own words',
      "I'd rather not say",
    ],
  },
  {
    question: "Can someone you match with see that you're comfortable with neurodiversity?",
    options: ['Yes, show it on my profile', 'No, keep it private'],
  },
];

export const EXPLIQUES_17: readonly (L10n<Explic17> | null)[] = [
  {
    terme: 'Neuro-atypical (ASD)',
    expli:
      'ASD stands for "Autism Spectrum Disorder". In plain words: your brain processes sounds, lights, emotions and connections its own way — often with an intensity others never see. Many autistic people love clear routines and the topics that light them up. It is a way of working, not a flaw.',
  },
  {
    terme: 'ADHD',
    expli:
      'ADHD stands for "Attention Deficit Hyperactivity Disorder". In plain words: staying focused on something that doesn\x27t grab you costs a lot, and holding still takes constant effort. In return, many ADHD minds think fast, feel strong and improvise well. Nobody here asks you to fix yourself.',
  },
  {
    terme: 'Dys (dyslexia, dyspraxia…)',
    expli:
      'The "Dys" family gathers dyslexia (words), dyspraxia (movement and organization), dyscalculia (numbers)… It is neither laziness nor a lack of intelligence: the brain takes another path. Many people built their own tricks over the years — here they count for what they are: strength.',
  },
  {
    terme: 'Anxiety I manage',
    expli:
      'It is when your mind expects the worst even when everything is fine — and you have learned, your own way, to soothe it. The key words are "that I manage": you don\x27t need to be "cured" to check this. And if you\x27d rather not say, that\x27s a right too.',
  },
  null,
  null,
];

export const INFO_17: L10n<{
  titre: string;
  chapeau: string;
  pourquoi: readonly string[];
  garde: string;
}> = {
  titre: 'These words, in plain words',
  chapeau:
    'Nobody is testing you here. You check words to describe yourself, only if you want to. Here is what they mean, simply.',
  pourquoi: [
    'It helps the app suggest people who are comfortable with how you work — so you don\x27t have to explain everything alone, at the start.',
    'It prevents misunderstandings: the person you meet knows, if you chose to show it on your profile.',
    'Nothing is scored, nothing is shared without your choice — and you can change or erase it anytime from your profile.',
  ],
  garde:
    'None of this is a diagnosis, none of it enters a score — and you can change or erase it anytime from your profile.',
};

export const ECRAN_17: L10n<{ titre: string; texte: string }> = {
  titre: 'Thank you for your trust.',
  texte:
    "What you shared stays between you and the app — unless you chose to show it on your profile. It will help the people you meet feel at ease, and it will help you cross paths with people who understand you.\n\nYou can change or erase it at any time, from your profile. None of this enters any score.",
};

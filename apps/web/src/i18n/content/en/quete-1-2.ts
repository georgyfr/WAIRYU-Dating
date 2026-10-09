/**
 * Monde 1 · quête 1.2 « Ta façon de t'attacher » — ITEMS (12 entrées, ordre figé).
 *
 * MIROIR EN — structure parallèle au FR (fusion par INDEX/tableaux, par
 * CLÉ/objets). Une chaîne absente = repli FR silencieux (avecEN).
 * NE PAS recopier : les codes (Q…), ids de variantes, clés de dims,
 * orientations, booléens — ils restent côté FR.
 */
import type { L10n } from '../../apply';
import type { QueteItem12 } from '../../../lib/quete-1-2';

export const ITEMS: L10n<readonly QueteItem12[]> = [
  { text: "When someone matters to me, their silence weighs on me very fast." },
  { text: "I often need to be reassured that everything is fine between us." },
  { text: "A slightly cold remark can occupy my whole evening." },
  { text: "I sometimes anticipate being left before anything even happens." },
  { text: "I feel better when I know clearly where I stand with someone." },
  { text: "Relationships where each person keeps their independence suit me perfectly." },
  { text: "When a relationship becomes deep, I feel an instinctive urge to slow down." },
  { text: "Depending on someone doesn't scare me." },
  { text: "I prefer to handle my worries alone, even with a partner." },
  { text: "Telling my weaknesses to someone who matters relieves me." },
  { text: "Constant closeness does me more good than it tires me." },
  { text: "Too much closeness too fast makes me want to get some air." },
];

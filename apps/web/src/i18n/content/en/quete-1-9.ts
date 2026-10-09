/**
 * Monde 2 · quête 1.9 « Ton élan du moment » — ITEMS (ordre figé).
 *
 * MIROIR EN — structure parallèle au FR (fusion par INDEX/tableaux, par
 * CLÉ/objets). Une chaîne absente = repli FR silencieux (avecEN).
 * NE PAS recopier : les codes (Q…), ids de variantes, clés de dims,
 * orientations, booléens — ils restent côté FR.
 * Tonalité ÉTAT conservée : « en ce moment » → “right now”, « ces derniers
 * jours » → “these last few days” — une météo, jamais un portrait.
 */
import type { L10n } from '../../apply';
import type { QueteItem19 } from '../../../lib/quete-1-9';

export const ITEMS: L10n<readonly QueteItem19[]> = [
  { text: 'Right now, my days look like my choices.' },
  { text: "Right now, it's the circumstances that decide for me." },
  { text: "These last few days, I do what I chose to do." },
  { text: 'Right now, what I take on holds up.' },
  { text: 'Lately, I feel powerless in front of the unexpected.' },
  { text: 'Right now, I finish what I start.' },
  { text: 'These last few days, I feel close to the people who count.' },
  { text: 'Right now, I go through days without a real conversation.' },
];

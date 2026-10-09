/**
 * Monde 2 · quête 1.10 « Ce que tu apportes » — ITEMS (ordre figé).
 *
 * MIROIR EN — structure parallèle au FR (fusion par INDEX/tableaux, par
 * CLÉ/objets). Une chaîne absente = repli FR silencieux (avecEN).
 * NE PAS recopier : les codes (Q…), ids de variantes, clés de dims,
 * orientations, booléens — ils restent côté FR.
 */
import type { L10n } from '../../apply';
import type { QueteItem110 } from '../../../lib/quete-1-10';

export const ITEMS: L10n<readonly QueteItem110[]> = [
  { text: "When I say I'll be there, I'm there." },
  { text: 'Sometimes I disappear for a few days without giving any news.' },
  { text: "After an argument, I'm the first to reach out." },
  { text: 'After an argument, I wait for the other one to come back.' },
  { text: 'When our wants diverge, I look for what works for both of us.' },
  { text: "When our wants diverge, I'm often the one who holds the line." },
  { text: "When I'm wrong, I say it straight out, the same day." },
  { text: 'I admit my faults mostly when they get proven to me.' },
  { text: 'I notice when people are tired before they say it.' },
  { text: 'I help when I\'m asked, rarely before.' },
];

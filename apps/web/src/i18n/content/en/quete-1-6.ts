/**
 * Monde 2 · quête 1.6 « Ta façon de penser » — ITEMS + ENIGMES (ordre figé).
 *
 * MIROIR EN — structure parallèle au FR (fusion par INDEX/tableaux, par
 * CLÉ/objets). Une chaîne absente = repli FR silencieux (avecEN).
 * NE PAS recopier : les codes (Q…), ids de variantes, clés de dims,
 * orientations, booléens — ils restent côté FR.
 * ÉNIGMES : seuls les champs AFFICHABLES sont traduits (énoncé + options) ;
 * `correcte` et les codes restent côté FR — jamais recopiés.
 */
import type { L10n } from '../../apply';
import type { Enigme16, QueteItem16 } from '../../../lib/quete-1-6';

export const ITEMS: L10n<readonly QueteItem16[]> = [
  { text: 'When a decision comes up, I trust my gut more than my calculations.' },
  { text: 'I weigh the pros and cons on paper before the big decisions.' },
  { text: 'I rarely know why I feel something — but I feel it strongly.' },
  { text: 'I take arguments apart step by step before I form an opinion.' },
  { text: 'My first impression is often the right one.' },
  { text: 'I check three times before I decide.' },
  { text: 'Numbers reassure me more than promises.' },
];

export const ENIGMES: L10n<readonly Enigme16[]> = [
  {
    enonce:
      'Léa climbs a hill at an average of 6 km/h. How fast must she come back down the same path for her round-trip average to reach 12 km/h?',
    options: [
      '18 km/h',
      '6 km/h',
      "It's impossible — the trip out already uses up the whole budget for the average",
    ],
  },
  {
    enonce:
      'A 40 cm candle burns at 3 cm/h, another one of 25 cm at 2 cm/h. After how many hours is the first one twice as tall as the second?',
    options: ['10 hours', '5 hours', '12.5 hours'],
  },
  {
    enonce:
      'A boat at the dock: 6 rungs of its ladder stick out of the water. The tide rises 30 cm/h, and the rungs are 30 cm apart. After 3 hours, how many rungs are under water?',
    options: ['3 more', 'No change — the boat floats with the water', '6 more'],
  },
];

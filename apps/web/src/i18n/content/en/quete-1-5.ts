/**
 * Monde 2 · quête 1.5 « L'épreuve du temps » — CHOIX (6 binômes, ordre figé ; jetons {m:N} à conserver tels quels).
 *
 * MIROIR EN — structure parallèle au FR (fusion par INDEX/tableaux, par
 * CLÉ/objets). Une chaîne absente = repli FR silencieux (avecEN).
 * NE PAS recopier : les codes (Q…), ids de variantes, clés de dims,
 * orientations, booléens — ils restent côté FR.
 * Jetons de devise {m:120} / {m:200} : CONSERVÉS tels quels (base EUR du
 * Livrable, interpolés au rendu dans la devise de l'utilisateur).
 */
import type { L10n } from '../../apply';
import type { ChoixBinaire15 } from '../../../lib/quete-1-5';

export const CHOIX: L10n<readonly ChoixBinaire15[]> = [
  {
    cadre: 'Money you are owed arrives.',
    choixA: 'You receive it tonight: {m:120} in your account.',
    choixB: 'You receive it in six weeks: {m:200} in your account.',
  },
  {
    cadre: "You've finally found the armchair.",
    choixA: 'You order it today, full price, delivered tomorrow.',
    choixB: 'You wait three weeks, at a reduced price, delivery included.',
  },
  {
    cadre: "You're looking for a place to live.",
    choixA: 'The first decent apartment: you sign this month.',
    choixB: 'The one you truly prefer: you wait two months.',
  },
  {
    cadre: 'Your free time opens up.',
    choixA: 'A very beautiful meeting, this weekend, without knowing more.',
    choixB: 'The same person, seen in ten days, after a real conversation.',
  },
  {
    cadre: 'Your heart receives two invitations.',
    choixA: "The dinner that warms you tonight, at someone's place you know.",
    choixB: 'The slower start with someone new, something to build.',
  },
  {
    cadre: 'A story begins.',
    choixA: 'The love at first sight that sweeps you away, right away.',
    choixB: 'The meeting that settles in gently, in a few weeks.',
  },
];

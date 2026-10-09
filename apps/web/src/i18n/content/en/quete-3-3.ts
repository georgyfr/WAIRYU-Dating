/**
 * Monde 4 · quête 3.3 « Ton temps libre » — ITEMS (8 items carte affichés,
 * ordre figé ; les 4 trames Q3.3-T09→T12 sont hors dépôt et hors ITEMS —
 * règle 11-b, deck saute les trames).
 *
 * MIROIR EN — structure parallèle au FR (fusion par INDEX/tableaux, par
 * CLÉ/objets). Une chaîne absente = repli FR silencieux (avecEN).
 * NE PAS recopier : les codes (Q…), ids de variantes, clés de dims,
 * orientations, booléens — ils restent côté FR.
 * Neutralité du mode : going out and staying in are two equal ways to
 * recharge — neither one is better.
 */
export const ITEMS: readonly { text: string }[] = [
  { text: 'After a busy week, I go out to recharge.' },
  { text: 'After a busy week, I recharge at home.' },
  { text: 'For me, a good weekend is spent outdoors.' },
  { text: 'For me, a good weekend happens at home.' },
  { text: 'I have at least one core activity that carries me.' },
  { text: 'My hobbies change with my moods, with no fixed core.' },
  { text: 'I live my core hobbies with other people.' },
  { text: 'I live my core hobbies solo.' },
];

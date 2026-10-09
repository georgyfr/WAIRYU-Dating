/**
 * Monde 3 · quête 2.7 « Ta vision de la famille » — ITEMS (8 items Likert,
 * ordre figé du tableau FR — versions V8.C des items 07/08).
 *
 * MIROIR EN — structure parallèle au FR (fusion par INDEX/tableaux, par
 * CLÉ/objets). Une chaîne absente = repli FR silencieux (avecEN).
 * NE PAS recopier : les codes (Q…), orientations, clés d'angles — côté FR.
 * NEUTRALITÉ : désirer un enfant, hésiter, ne pas en vouloir — trois visions
 * égales en dignité.
 */
export const ITEMS: readonly { text: string }[] = [
  { text: 'Children are part of the plan I have for my life.' },
  { text: 'I am building my life with no children in the plan.' },
  { text: 'In my life, the children project waits for the rest to be settled.' },
  { text: 'In my life, the children project is asking to start early.' },
  { text: 'Career and home are worked out as a pair, with no assigned role.' },
  { text: 'In my home, each person keeps their own assigned domain.' },
  { text: 'The extended family has its place in my family life.' },
  { text: 'My family life is built first between the two of us.' },
];

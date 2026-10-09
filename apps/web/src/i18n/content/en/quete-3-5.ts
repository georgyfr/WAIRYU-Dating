/**
 * Monde 4 · quête 3.5 « Ton entourage » — ITEMS (6 items Likert, ordre figé
 * du tableau FR — quête déclarative directe, aucune trame).
 *
 * MIROIR EN — structure parallèle au FR (fusion par INDEX/tableaux, par
 * CLÉ/objets). Une chaîne absente = repli FR silencieux (avecEN).
 * NE PAS recopier : les codes (Q…), ids de variantes, clés de dims,
 * orientations — ils restent côté FR.
 * NEUTRALITÉ : entourage dense et cercle étroit se valent — la barre décrit
 * une place, elle ne note jamais une personne.
 */
export const ITEMS: readonly { text: string }[] = [
  { text: 'My parents count in my big decisions as a couple.' },
  { text: 'My big decisions as a couple are made between the two of us.' },
  { text: 'My life as a couple is also lived inside my family.' },
  { text: 'My family and my life as a couple each keep their own territory.' },
  { text: 'My weekends gladly welcome the circle of friends.' },
  { text: 'My weekends, I keep them for the two of us.' },
];

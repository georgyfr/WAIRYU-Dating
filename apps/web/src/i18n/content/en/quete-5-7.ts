/**
 * Monde 6 · quête 5.7 « Ton humour » — ITEMS (12 items Likert, ordre figé).
 *
 * MIROIR EN — structure parallèle au FR (fusion par INDEX/tableaux, par
 * CLÉ/objets). Une chaîne absente = repli FR silencieux (avecEN).
 * NE PAS recopier : les codes (Q…), ids de variantes, clés de dims,
 * orientations, booléens — ils restent côté FR.
 * PARITÉ GELÉE : l'index i de ce tableau = le code Q5.7-(i+1) du tableau FR
 * (12 énoncés EN, mêmes codes côté FR, 4 styles × 3 items).
 * NEUTRALITÉ TYPOLOGIQUE : the four ways of making people laugh are equal —
 * no style is framed as better, healthier or more mature than another; the
 * shadow is a cost, not a verdict.
 */
export const ITEMS: readonly { text: string }[] = [
  { text: 'I make jokes to bring the people around me closer together.' },
  { text: 'My humour stays quiet when I am with new people.' },
  { text: 'At a party, I look for laughs to share first of all.' },
  { text: 'I laugh at my own mishaps so I can get through them better.' },
  { text: 'When the day turns heavy, I find nothing funny in it.' },
  { text: 'Humour is my last resort when things go wrong.' },
  { text: 'I tease people by saying it is all for a laugh.' },
  { text: 'My teasing spares the people around me.' },
  { text: 'I say out loud the funny remark others keep to themselves.' },
  { text: 'I make fun of myself first to get the laughs going.' },
  { text: 'My jokes do not reveal my real flaws.' },
  { text: 'I tell my flaws as they are, without turning them into jokes.' },
];

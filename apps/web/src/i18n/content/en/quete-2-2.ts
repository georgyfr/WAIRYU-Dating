/**
 * Monde 3 · quête 2.2 « Ta place pour la spiritualité » — ITEMS (6 items Likert, ordre figé).
 *
 * MIROIR EN — structure parallèle au FR (fusion par INDEX/tableaux, par
 * CLÉ/objets). Une chaîne absente = repli FR silencieux (avecEN).
 * NE PAS recopier : les codes (Q…), ids de variantes, clés de dims,
 * orientations, booléens — ils restent côté FR.
 * NEUTRALITÉ ABSOLUE : pratiquer et ne pas pratiquer = deux façons égales —
 * aucune option « vivante » contre l'autre ; aucune croyance nommée.
 */
export const ITEMS: readonly { text: string }[] = [
  { text: 'Spirituality holds a real place in my week.' },
  { text: 'For me, spirituality belongs mostly to culture and celebrations.' },
  { text: 'My big decisions take my spirituality into account.' },
  { text: 'My big decisions go on without spirituality.' },
  { text: 'Sharing my spirituality with a partner matters to me.' },
  { text: 'Passing on a spirituality is not my thing.' },
];

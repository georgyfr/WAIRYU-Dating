/**
 * Monde 4 · quête 3.1 « Ton rythme de vie » — ITEMS (5 items Likert affichés,
 * ordre figé du tableau FR ; aucune trame dans la quête — n_trames = 0).
 *
 * MIROIR EN — structure parallèle au FR (fusion par INDEX/tableaux, par
 * CLÉ/objets). Une chaîne absente = repli FR silencieux (avecEN).
 * NE PAS recopier : les codes (Q…), ids de variantes, clés de dims,
 * orientations, booléens — ils restent côté FR.
 * Les autres chaînes affichables (annonce, briefing, cartes, complétion,
 * accompagnement) se traduisent au niveau du registre (en/registre-m4.ts,
 * câblage intégration M4 — même répartition que le Monde 3).
 * NEUTRALITÉ : morning people and evening people are equal — no rhythm is
 * ever framed as better, lazier or more disciplined than another.
 */
export const ITEMS: readonly { text: string }[] = [
  { text: 'I am at my best when the day begins.' },
  { text: 'I am at my best when the day winds down.' },
  { text: 'With no alarm deciding for me, I get up with the sun.' },
  { text: 'With no alarm deciding for me, my mornings stretch toward noon.' },
  { text: 'The hours when the world grows quiet are my strongest hours.' },
];

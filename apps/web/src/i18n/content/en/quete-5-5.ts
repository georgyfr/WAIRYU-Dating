/**
 * Monde 7 · quête 5.5 « Quand la tension monte » — ITEMS (8 items Likert,
 * ordre figé du tableau FR ; aucune trame dans la quête — n_trames = 0).
 *
 * MIROIR EN — structure parallèle au FR (fusion par INDEX/tableaux, par
 * CLÉ/objets). Une chaîne absente = repli FR silencieux (avecEN).
 * NE PAS recopier : les codes (Q…), ids de variantes, clés de dims,
 * orientations, booléens — ils restent côté FR.
 * Les autres chaînes affichables (annonce, briefing, cartes, complétion,
 * accompagnement) se traduisent au niveau du registre (en/registre-m7,
 * câblage intégration M7 — même répartition que les mondes 4, 5 et 6).
 * PARITÉ GELÉE : l'index i de ce tableau = le code Q5.5-(i+1) du tableau FR
 * (8 énoncés EN, mêmes codes côté FR, 4 profils × 2 items, 4 paires R6).
 * NEUTRALITÉ TYPOLOGIQUE : the four ways tension leaves you are equal in
 * dignity — no temperature is framed as better, healthier or more in
 * control than another; the shadow is a cost, not a verdict. The quiet one
 * is a guard, never a fault; no clinical label anywhere.
 */
export const ITEMS: readonly { text: string }[] = [
  { text: 'When the tension rises, the words come out louder than me.' },
  { text: 'When the tension rises, I keep the volume of my voice.' },
  { text: 'When the tension rises, I raise a wall and keep quiet.' },
  { text: 'When the tension rises, I keep the door of the discussion open.' },
  { text: 'Once the calm is back, I come back to what hurt.' },
  { text: 'When a topic hurts, I prefer it to stay closed.' },
  { text: 'When the tension rises, I pull inward and my body follows.' },
  { text: 'When the tension rises, it goes through and leaves without settling.' },
];

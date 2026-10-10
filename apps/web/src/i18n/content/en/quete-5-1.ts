/**
 * Monde 6 · quête 5.1 « Ton style amoureux » — ITEMS (18 items Likert,
 * ordre figé du tableau FR).
 *
 * MIROIR EN — structure parallèle au FR (fusion par INDEX/tableaux, par
 * CLÉ/objets). Une chaîne absente = repli FR silencieux (avecEN).
 * NE PAS recopier : les codes (Q…), ids de variantes, clés de dims,
 * orientations, booléens — ils restent côté FR.
 * Les autres chaînes affichables (annonce, briefing, cartes, complétion,
 * accompagnement) se traduisent au niveau du registre (câblage intégration
 * M6 — même répartition que les mondes précédents).
 * NEUTRALITÉ TYPOLOGIQUE : the six ways of loving are equal — no way is
 * framed as better, more mature or healthier than another. The shadow is
 * about the excess in a couple, never about the nature of a way.
 */
export const ITEMS: readonly { text: string }[] = [
  { text: 'When attraction hits hard, everything else waits.' },
  { text: 'An attraction too strong makes me step back.' },
  { text: 'I get attached fast when the flame catches.' },
  { text: 'Keeping a bit of play makes the story feel more alive.' },
  { text: 'The flirt that hides its cards tires me quickly.' },
  { text: 'I prefer clarity over keeping up the mystery.' },
  { text: 'The best stories begin with a friendship.' },
  { text: 'Mixing up friendship and love feels risky to me.' },
  { text: 'What binds me to someone grows without rushing.' },
  { text: 'Love holds when life plans fit together.' },
  { text: 'Reasoning your love life makes it lose its flavor.' },
  { text: 'Falling for someone does not go through a list.' },
  { text: 'I need regular signs to feel at peace.' },
  { text: 'The calm of silences reassures me more than proofs do.' },
  { text: 'When someone is slow to reply, my mind starts racing.' },
  { text: 'To love is, first of all, to care without counting.' },
  { text: 'Giving with nothing back ends up draining me.' },
  { text: 'Before giving myself, I learn to receive.' },
];

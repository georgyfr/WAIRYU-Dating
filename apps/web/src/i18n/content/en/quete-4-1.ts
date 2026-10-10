/**
 * Monde 5 · quête 4.1 « Ton arbre relationnel » — ITEMS (8 items Likert, ordre figé).
 *
 * MIROIR EN — structure parallèle au FR (fusion par INDEX/tableaux, par
 * CLÉ/objets). Une chaîne absente = repli FR silencieux (avecEN).
 * NE PAS recopier : les codes (Q…), ids de variantes, clés de dims,
 * orientations, booléens — ils restent côté FR.
 * NEUTRALITÉ DES ORIGINES : the five ways of growing up are equal — a named
 * climate is not « healthier », a heavy inheritance is not immaturity, a
 * held voice is not a repair. Zero parental blame.
 */
export const ITEMS: readonly { text: string }[] = [
  { text: 'Where I grew up, emotions were spoken out loud.' },
  { text: 'Where I grew up, emotions were guessed more than spoken.' },
  { text: 'A disagreement at home got named and got repaired.' },
  { text: 'Tensions lasted, with no word to close them.' },
  { text: 'I still hold the role I was given very early.' },
  { text: 'My roles today look like choices, not inheritances.' },
  { text: 'The peace of the family comes before what I think.' },
  { text: 'My opinion counts as much as the peace of the group.' },
];

/** L'écran génogramme (modalité NON COMPTEE) — miroir EN des libellés. */
export const ARBRE: {
  titre?: string;
  note?: string;
  champLabel?: string;
  qualifications?: readonly string[];
  ajouter?: string;
  retirer?: string;
  continuer?: string;
  passer?: string;
  noteFin?: string;
} = {
  titre: 'Your tree, in a few figures — if you want.',
  note: 'Nobody has to be named: figures, your own words. This screen is not graded — it stays with you.',
  champLabel: 'A figure — a person, a house, a silence…',
  qualifications: ['Close', 'Fused', 'Distance'],
  ajouter: 'Add this figure',
  retirer: 'Remove',
  continuer: 'Continue',
  passer: 'Skip this screen',
  noteFin: "You can come back to it: nothing is fixed, nothing is graded.",
};

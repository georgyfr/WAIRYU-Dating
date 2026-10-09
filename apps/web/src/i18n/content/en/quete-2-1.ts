/**
 * Monde 3 · quête 2.1 « Tes valeurs » — ITEMS (20 items carte affichés, ordre figé ;
 * les 4 trames Q2.1-21→24 sont hors dépôt et hors ITEMS — règle 11-b).
 *
 * MIROIR EN — structure parallèle au FR (fusion par INDEX/tableaux, par
 * CLÉ/objets). Une chaîne absente = repli FR silencieux (avecEN).
 * NE PAS recopier : les codes (Q…), ids de variantes, clés de dims,
 * orientations, booléens — ils restent côté FR.
 */
export const ITEMS: readonly { text: string }[] = [
  { text: 'For big decisions, I prefer to make the call myself.' },
  { text: 'For big decisions, I prefer to follow what others advise.' },
  { text: 'For my outings, the unknown is what draws me most.' },
  { text: 'For my outings, I choose what I already know.' },
  { text: 'When a chance to enjoy myself comes up, I take it.' },
  { text: 'When a chance to enjoy myself comes up, I let it pass.' },
  { text: 'In a new project, I aim first for visible results.' },
  { text: 'In a new project, results do not really motivate me.' },
  { text: 'In a group, I prefer to be the one who decides.' },
  { text: 'In a group, I am happy to leave the lead to someone else.' },
  { text: 'A well-ordered life reassures me more than it bores me.' },
  { text: 'A well-ordered life bores me more than it reassures me.' },
  { text: 'Disappointed by a group decision, I keep it to myself.' },
  { text: 'Disappointed by a group decision, I say so right away.' },
  { text: 'I keep up the traditions my family passed down to me.' },
  { text: 'I drift away from the traditions my family passed down to me.' },
  { text: "A loved one's request for help comes before my plans for the day." },
  { text: 'My plans for the day come before a loved one\'s request for help.' },
  { text: 'Faced with a very different way of living, I first try to understand.' },
  { text: 'Faced with a very different way of living, I am wary at first.' },
];

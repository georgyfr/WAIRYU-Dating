/**
 * Monde 7 · quête 5.6 « Après un désaccord » — ITEMS (5 items Likert, ordre figé).
 *
 * MIROIR EN — structure parallèle au FR (fusion par INDEX/tableaux, par
 * CLÉ/objets). Une chaîne absente = repli FR silencieux (avecEN).
 * NE PAS recopier : les codes (Q…), ids de variantes, clés de dims,
 * orientations, booléens — ils restent côté FR.
 * PARITÉ GELÉE : l'index i de ce tableau = le code Q5.6-(i+1) du tableau FR
 * (5 énoncés EN, mêmes codes côté FR, 5 capacités × 1 item).
 * GABARIT OUVERT : the level is a door, never a verdict — repairing early,
 * late, or staying quiet are equal as descriptions; the shadow is a cost,
 * not a blame. The silence is not a failure: it protects what matters.
 */
export const ITEMS: readonly { text: string }[] = [
  { text: 'When I am wrong, I apologize without waiting to be asked.' },
  { text: 'After an argument, I wait for the other person to make the first move.' },
  { text: 'Humour helps me defuse the tension after an argument.' },
  { text: 'A settled argument replays in my head for days.' },
  { text: 'When someone sincerely apologizes, the apology touches me and it is settled.' },
];

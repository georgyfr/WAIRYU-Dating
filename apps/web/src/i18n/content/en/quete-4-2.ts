/**
 * Monde 5 · quête 4.2 « Où tu en es aujourd'hui » — ITEMS (18 items Likert, ordre figé).
 *
 * MIROIR EN — structure parallèle au FR (fusion par INDEX/tableaux, par
 * CLÉ/objets). Une chaîne absente = repli FR silencieux (avecEN).
 * NE PAS recopier : les codes (Q…), ids de variantes, clés de dims,
 * orientations, booléens — ils restent côté FR.
 * NEUTRALITÉ DES ÉTATS : calmed, in motion, at work — three weathers, never
 * stages of healing. Nobody is late. No clinical vocabulary.
 */
export const ITEMS: readonly { text: string }[] = [
  { text: 'My past chapters serve me — they no longer weigh on me.' },
  { text: 'What I live still looks like the life I had before.' },
  { text: 'I know what those stories taught me.' },
  { text: 'I turn the same pages without knowing why.' },
  { text: 'The calm came back — it stayed.' },
  { text: 'Their first name still wakes something alive in me.' },
  { text: 'That story is boxed up — I barely touch it anymore.' },
  { text: 'I still compare new people to my old story.' },
  { text: 'I look at new people for who they are.' },
  { text: 'The past stays where it is, most of the time.' },
  { text: 'I need to hear often that we are solid.' },
  { text: 'One clear word carries me for a long time.' },
  { text: 'I replay conversations to check I missed nothing.' },
  { text: 'Once a conversation is done, it is done.' },
  { text: 'The other person\'s silence writes worried scripts for me.' },
  { text: 'A silence is not a sign — it is a silence.' },
  { text: 'I ask for reassurance even when things are fine.' },
  { text: 'I trust what is built, without repetition.' },
];

/** L'écran d'écoute (Q4.2-19, hors mélange) — miroir EN des libellés.
 *  La réponse n'est jamais rendered anywhere: device storage only. */
export const OUVERTE: {
  titre?: string;
  placeholder?: string;
  retrait?: string;
  valider?: string;
  note?: string;
  noteRetrait?: string;
} = {
  titre: 'What your relationships taught you — a few lines, if you want.',
  placeholder: 'Your own words — they are never reworded.',
  retrait: "I'd rather not say",
  valider: 'Send my page',
  note: 'What you write stays with you: nothing will be quoted, nothing will be shown.',
  noteRetrait: 'Skips with no penalty — a complete answer too.',
};

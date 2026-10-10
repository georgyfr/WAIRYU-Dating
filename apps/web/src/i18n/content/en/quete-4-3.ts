/**
 * Monde 5 · quête 4.3 « Ce que tes relations t'ont appris » — l'énoncé ouvert.
 *
 * MIROIR EN — structure parallèle au FR (fusion par INDEX/tableaux).
 * Une chaîne absente = repli FR silencieux (avecEN).
 * NE PAS recopier : les codes (Q…), booléens — ils restent côté FR.
 * L'écoute n'est pas une évaluation : no blame is suggested by the prompt,
 * no length minimum, the answer is never rendered anywhere.
 */
export const ITEMS: readonly { text: string }[] = [
  { text: 'What your relationships taught you — a few lines, if you want.' },
];

/** Le retrait verbatim (facultatif — saut sans pénalité). */
export const RETRAIT = "I'd rather not say";

/** L'écran d'écoute — miroir EN des libellés. La réponse n'est jamais
 *  rendered anywhere: device storage only, no on-screen analysis. */
export const ECRAN_ECRITE: {
  placeholder?: string;
  valider?: string;
  note?: string;
  noteRetrait?: string;
} = {
  placeholder: 'Your own words — they are never reworded.',
  valider: 'Send my page',
  note: 'What you write stays with you: nothing will be quoted, nothing will be shown.',
  noteRetrait: 'Skips with no penalty — a complete answer too.',
};

/** L'écran final (exemption carte) — miroir EN. */
export const ECRAN_FINAL_43: { titre?: string; texte?: string } = {
  titre: 'Your page is yours',
  texte:
    'What you wrote stays with you — nothing will be quoted, nothing will be shown. If you preferred not to say, that is a complete answer too.',
};

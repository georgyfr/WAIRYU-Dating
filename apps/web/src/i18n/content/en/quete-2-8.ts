/**
 * Monde 3 · quête 2.8 « Ton signe (juste pour le jeu) » — QUESTION_28,
 * SIGNE_OPTIONS (13 options, ORDRE CALANDAIRE FIGÉ : symboles ♈→♓ en tête,
 * puis l'option de silence), DISCLAIMER_28, INTRO_28, ENTETE_ECRAN_28,
 * PIED_ECRAN_28, FENETRE_28.
 *
 * MIROIR EN — structure parallèle au FR (fusion par INDEX/tableaux, par
 * CLÉ/objets). Une chaîne absente = repli FR silencieux (avecEN).
 * NE PAS recopier : les codes (Q…), ids de variantes — côté FR.
 * RÈGLE ABSOLUE (inchangée) : le signe n'entre JAMAIS dans un calcul — le
 * badge est une étiquette de conversation, pas un attribut de compatibilité.
 * Le titre de badge « Ton signe : ♌ — juste pour le jeu » est géré ailleurs.
 */
export const QUESTION_28: string = 'Your sign, for the conversation?';

export const SIGNE_OPTIONS: readonly string[] = [
  '♈ Aries',
  '♉ Taurus',
  '♊ Gemini',
  '♋ Cancer',
  '♌ Leo',
  '♍ Virgo',
  '♎ Libra',
  '♏ Scorpio',
  '♐ Sagittarius',
  '♑ Capricorn',
  '♒ Aquarius',
  '♓ Pisces',
  "I'd rather not say",
];

export const DISCLAIMER_28: string =
  'Just for conversation — the science lives in your test results.';

export const INTRO_28: { ligne1: string; ligne2: string } = {
  ligne1: 'The zodiac says nothing about you — but it makes a great story at the table.',
  ligne2: 'Pick your sign if you want to play. If not, the road goes on without asking.',
};

export const ENTETE_ECRAN_28: string = 'YOUR SIGN — just for fun';

export const PIED_ECRAN_28: string =
  'The badge shows on your profile and in the conversation — change it or erase it in one click. · ' +
  '[Change] · [Remove the badge] · [Next quest]';

export const FENETRE_28: { F1: string; F2: string } = {
  F1: 'Somewhere, someone is answering these same questions. The day your cards cross, they will have a lot to say to each other.',
  F2: 'This portrait is not an end — it is your way of being found: by someone who will read your card before your face.',
};

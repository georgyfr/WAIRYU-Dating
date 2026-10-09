/**
 * Monde 3 · quête 2.5 « Ce que tu cherches » — ITEMS (3 énoncés binaires,
 * ordre figé) + MESSAGE_DOUX (le message doux du bloc « Incomplétude assumée »).
 *
 * MIROIR EN — structure parallèle au FR (fusion par INDEX/tableaux, par
 * CLÉ/objets). Une chaîne absente = repli FR silencieux (avecEN).
 * NE PAS recopier : les codes (Q…), ids de variantes — côté FR.
 * Le MESSAGE_DOUX reprend le libellé EN de la 4ᵉ réponse (« I am finding out »,
 * miroir tr/core) entre guillemets “ ” — comme les guillemets internes du FR.
 */
export const ITEMS: readonly { text: string }[] = [
  { text: 'You are looking for an exclusive relationship.' },
  { text: 'You are looking to meet someone, without a precise plan.' },
  { text: 'Exclusivity is not what you are aiming for today.' },
];

export const MESSAGE_DOUX: string =
  'It\'s okay to take your time: you can come back whenever you want, or choose “I am finding out”.';

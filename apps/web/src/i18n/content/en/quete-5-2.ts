/**
 * Monde 6 · quête 5.2 « Ta vision de l'amour » — ITEMS (8 items Likert,
 * ordre figé du tableau FR ; aucune trame dans la quête — n_trames = 0).
 *
 * MIROIR EN — structure parallèle au FR (fusion par INDEX/tableaux, par
 * CLÉ/objets). Une chaîne absente = repli FR silencieux (avecEN).
 * NE PAS recopier : les codes (Q…), ids de variantes, clés de dims,
 * orientations, booléens — ils restent côté FR.
 * Les autres chaînes affichables (annonce, briefing, cartes, complétion,
 * accompagnement) se traduisent au niveau du registre (en/registre-m6,
 * câblage intégration M6 — même répartition que les mondes 4 et 5).
 * NEUTRALITÉ AXIOLOGIQUE STRICTE : the four romantic beliefs are equal in
 * dignity — destiny is not passivity, the spark is not shallowness, the one
 * great love is not a denial of the real, potential is not an illusion to
 * fix. The reading never judges, predicts or corrects a belief.
 */
export const ITEMS: readonly { text: string }[] = [
  { text: 'What is meant to happen to me ends up happening.' },
  { text: 'A beautiful story is built, it is not found.' },
  { text: 'You can know within the first minutes that it matters.' },
  { text: 'Solid feelings need time to be recognized.' },
  { text: 'Deep down, there is only one great love for each of us.' },
  { text: 'Several different loves can each be great.' },
  { text: 'When something pleases me, I mostly picture what it could become.' },
  { text: 'I like people for what they show, not for their potential.' },
];

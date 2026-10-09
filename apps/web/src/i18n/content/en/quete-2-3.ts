/**
 * Monde 3 · quête 2.3 « Tes non-négociables » — ITEMS (9 lignes rouges + le
 * champ libre Q2.3-10, ordre figé du tableau FR).
 *
 * MIROIR EN — structure parallèle au FR (fusion par INDEX/tableaux, par
 * CLÉ/objets). Une chaîne absente = repli FR silencieux (avecEN).
 * NE PAS recopier : les codes (Q…), formats, ids de variantes — côté FR.
 * NEUTRALITÉ : cocher n'est jamais « mieux » que ne pas cocher.
 */
export const ITEMS: readonly { text: string }[] = [
  { text: "I cannot build with someone who smokes." },
  { text: 'I cannot build with someone who drinks regularly.' },
  { text: 'A disagreement about children is a deal-breaker for me.' },
  { text: 'A difference of religion or practice is a deal-breaker for me.' },
  { text: 'A long-distance relationship is a deal-breaker for me.' },
  { text: 'A difference in everyday food habits is a deal-breaker for me.' },
  { text: 'Living with someone who does no sport is a deal-breaker.' },
  { text: 'A non-exclusive relationship is a deal-breaker for me.' },
  { text: 'A disagreement about the level of commitment is a deal-breaker.' },
  { text: 'Another red line, in your own words.' },
];

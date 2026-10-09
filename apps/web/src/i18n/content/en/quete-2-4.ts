/**
 * Monde 3 · quête 2.4 « Tes réalités » — ITEMS (8 déclarations un-clic :
 * énoncé + options affichées, ordre figé du tableau FR).
 *
 * MIROIR EN — structure parallèle au FR (fusion par INDEX/tableaux, par
 * CLÉ/objets). Une chaîne absente = repli FR silencieux (avecEN).
 * NE PAS recopier : les codes (Q…), ids de variantes — côté FR.
 * DOCTRINE : les réalités sont FACTUELLES et JAMAIS jugées — aucune option
 * « idéale », aucun vocabulaire du défaut.
 */
export const ITEMS: readonly { text: string; options: readonly string[] }[] = [
  { text: 'My reality: tobacco.', options: ['I smoke', 'I quit', 'No'] },
  { text: 'My reality: alcohol.', options: ['Never', 'Occasionally', 'Regularly'] },
  { text: 'My reality: children.', options: ['I have some', 'I want some', 'Not now', 'Never'] },
  { text: 'My reality: spirituality.', options: ['Practicing', 'Cultural', 'None'] },
  { text: 'My reality: my plate.', options: ['Vegetarian or vegan', 'Meat eater', 'Flexitarian'] },
  { text: 'My reality: sport.', options: ['Intense', 'Regular', 'Zero'] },
  { text: 'My reality: where I live.', options: ['I live here', 'I am moving soon', 'I am a nomad'] },
  { text: 'My reality: my pace.', options: ['I am looking to meet quickly', 'I prefer to take my time'] },
];

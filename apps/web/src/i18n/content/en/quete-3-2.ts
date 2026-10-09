/**
 * Monde 4 · quête 3.2 « Ton quotidien » — ITEMS (8 items Likert, ordre figé
 * du tableau FR — 2 axes : planification 01→05, ordre domestique 06→08).
 *
 * MIROIR EN — structure parallèle au FR (fusion par INDEX/tableaux, par
 * CLÉ/objets). Une chaîne absente = repli FR silencieux (avecEN).
 * NE PAS recopier : les codes (Q…), ids de variantes, clés d'axes,
 * orientations, booléens — ils restent côté FR.
 * NEUTRALITÉ : planifier et improviser, l'ordre et le libre — des façons
 * égales d'habiter un quotidien.
 */
export const ITEMS: readonly { text: string }[] = [
  { text: 'At my place, outings are decided several days ahead.' },
  { text: 'At my place, outings are decided right when it is time to go.' },
  { text: 'My days follow a plan I can name.' },
  { text: 'My days follow the flow of whatever comes.' },
  { text: 'My important appointments are written down, hour by hour.' },
  { text: 'In my home, everything ends up finding its place.' },
  { text: 'In my home, things live right where they land.' },
  { text: 'Visible mess at my place does not bother me.' },
];

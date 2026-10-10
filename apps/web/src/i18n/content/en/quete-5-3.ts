/**
 * Monde 6 · quête 5.3 « Comment tu exprimes ton affection » — ITEMS (10
 * items Likert, ordre figé du tableau FR ; aucune trame dans la quête —
 * n_trames = 0).
 *
 * MIROIR EN — structure parallèle au FR (fusion par INDEX/tableaux, par
 * CLÉ/objets). Une chaîne absente = repli FR silencieux (avecEN).
 * NE PAS recopier : les codes (Q…), ids de variantes, clés de dims,
 * orientations, booléens — ils restent côté FR.
 * Les autres chaînes affichables (annonce, briefing, cartes, complétion,
 * accompagnement) se traduisent au niveau du registre (en/registre-m6,
 * câblage intégration M6 — même répartition que les Mondes 4 et 5).
 * NEUTRALITÉ DES CANAUX : the five channels are equal — a quiet channel is
 * not a flaw, it holds the requests you have not voiced yet. No channel is
 * ever framed as better, warmer or more romantic than another.
 */
export const ITEMS: readonly { text: string }[] = [
  { text: 'A word that values me carries me through the whole day.' },
  { text: 'Compliments slide off me without sinking in.' },
  { text: 'Time together, screens away, fills me up.' },
  { text: 'A distracted presence is quite enough for me.' },
  { text: 'Being helped out touches me as much as a word does.' },
  { text: 'A favor done stays a task, not a declaration.' },
  { text: 'A small gesture chosen for me stays with me.' },
  { text: 'A gift, however carefully chosen, says little to me.' },
  { text: 'A hug makes words fade into the background.' },
  { text: 'I feel loved without needing to touch.' },
];

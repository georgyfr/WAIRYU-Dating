/**
 * Monde 7 · quête 5.4 « Face aux désaccords » — ITEMS (15 items Likert carte,
 * ordre figé).
 *
 * MIROIR EN — structure parallèle au FR (fusion par INDEX/tableaux, par
 * CLÉ/objets). Une chaîne absente = repli FR silencieux (avecEN).
 * NE PAS recopier : les codes (Q…), ids de variantes, clés de dims,
 * orientations, booléens — ils restent côté FR.
 * PARITÉ GELÉE : l'index i de ce tableau = le code Q5.4-(i+1) du tableau FR
 * (15 énoncés EN, mêmes codes côté FR, 5 postures × 3 items).
 * Les 8 trames hébergées (Q5.4-T43 → T50) n'ont AUCUNE entrée ici — énoncés
 * hors dépôt (règle 11-b), aucune restitution.
 * NEUTRALITÉ STRICTE : the five ways of holding a disagreement are equal —
 * no posture is framed as better, healthier or more mature than another; the
 * shadow is the cost within the couple, not the nature of the posture.
 */
export const ITEMS: readonly { text: string }[] = [
  { text: 'In a disagreement, I hold my position all the way through.' },
  { text: 'Letting the other person have the last word weighs on me afterwards.' },
  { text: 'As soon as an exchange gets tense, I drop my position.' },
  { text: 'I dig into what truly matters to each of us before I suggest anything.' },
  { text: 'Understanding the other side\'s point of view feels like a waste of time.' },
  { text: 'I take care of my own needs first, the rest can wait.' },
  { text: 'I gladly suggest a middle ground where each of us gives a little.' },
  { text: 'Giving up half of what I expected leaves me unsatisfied.' },
  { text: 'A halfway deal unlocks more than it spoils.' },
  { text: 'When a topic gets touchy, I put it off until later.' },
  { text: 'A touchy topic is better sorted out right away.' },
  { text: 'I let things cool down before I come back to a disagreement.' },
  { text: 'For the sake of peace, I accept decisions I do not like.' },
  { text: 'My opinion counts just as much, I say it even when it is unwelcome.' },
  { text: 'I say no when something does not sit right with me.' },
];

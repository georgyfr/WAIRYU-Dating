/**
 * Monde 3 · quête 2.6 « Tes priorités pour les 5 prochaines années » — AXES
 * (5 axes : nom + description écran, ordre canonique figé).
 *
 * MIROIR EN — structure parallèle au FR (fusion par INDEX/tableaux, par
 * CLÉ/objets). Une chaîne absente = repli FR silencieux (avecEN).
 * NE PAS recopier : les codes (Q…), clés de scorer, ids de variantes — côté FR.
 */
export const AXES: readonly { nom: string; description: string }[] = [
  {
    nom: 'Career / ambition',
    description:
      'Grow what you are building professionally. Training, responsibilities, launches: the years when your work moves fast.',
  },
  {
    nom: 'Family / parenthood project',
    description:
      'Make room for a child — or for the ones already here. Time, energy and everyday trade-offs turned toward family.',
  },
  {
    nom: 'Freedom / adventures',
    description:
      'Leave, move, discover without planning everything. The years when a light bag weighs more than a base.',
  },
  {
    nom: 'Stability / security',
    description:
      'Build a base that holds: savings, housing, health, lasting routines. The years when you secure before you expand.',
  },
  {
    nom: 'Personal projects',
    description:
      'Keep alive what is yours: creating, running, getting involved. The years when your personal projects — creative, sporty, community-minded — find their window.',
  },
];

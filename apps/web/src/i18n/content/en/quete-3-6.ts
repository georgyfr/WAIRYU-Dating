/**
 * Monde 4 · quête 3.6 « Le choix visuel » — PAIRES (8 paires A/B affichées,
 * ordre figé du tableau 01 ; les scènes de référence noteDesign sont moteur
 * seul et ne se traduisent pas — jamais rendues).
 *
 * MIROIR EN — structure parallèle au FR (fusion par INDEX/tableaux, par
 * CLÉ/objets). Une chaîne absente = repli FR silencieux (avecEN).
 * NE PAS recopier : les codes (Q3.6-P…), ids de variantes, pôles,
 * orientations — ils restent côté FR.
 *
 * AMORCES : les 8 brise-glaces verbatim, même ordre que le FR (P1 → P8).
 * CARTES : les 3 cartes brise-glace (nom/lumiere/ombre/tension).
 * BRIEFING + COMPLETION : mêmes clés que le FR. Ton : you, simple et
 * littéral, phrases courtes. Apostrophe ASCII U+0027 uniquement.
 */
import type { L10n } from '../../apply';
import type { Amorce36, Paire36 } from '../../../lib/quete-3-6';

export const PAIRES: L10n<readonly Paire36[]> = [
  {
    theme: 'Interiors',
    labelA: 'A life lived around the house',
    labelB: 'A life lived outdoors, in the open air',
  },
  {
    theme: 'Landscapes',
    labelA: 'The soothing stability',
    labelB: 'The changing horizons',
  },
  {
    theme: 'Tables',
    labelA: 'The shared feast',
    labelB: 'The simple dinner for two',
  },
  {
    theme: 'Scenes',
    labelA: 'The lively group',
    labelB: 'The one-to-one',
  },
  {
    theme: 'Two mornings',
    labelA: 'The slow coffee, at home, with no plan',
    labelB: 'The neighborhood market, off the cuff',
  },
  {
    theme: 'Two doors',
    labelA: 'The door always open — visitors walk in',
    labelB: 'The door closed on the cocoon',
  },
  {
    theme: 'Two Sundays',
    labelA: 'The scheduled Sunday — the rituals',
    labelB: 'The Sunday with no plan — a day drawn by walking',
  },
  {
    theme: 'Two windows',
    labelA: 'The window on the lively city',
    labelB: 'The window on the calm',
  },
];

export const AMORCES: L10n<readonly Amorce36[]> = [
  { texte: 'The home you chose says something — tell me about it.' },
  { texte: 'The landscape you chose speaks of how you move — or stay.' },
  { texte: 'The table you chose tells your ideal celebrations.' },
  { texte: 'The scene you chose says what recharges you — the tribe or the duo.' },
  { texte: 'The morning you chose says how your weekend really starts.' },
  { texte: 'The door you chose says how you welcome — and how you protect yourself.' },
  { texte: 'The Sunday you chose says what a free day means to you.' },
  { texte: 'The window you chose says the view you need when you wake up.' },
];

export const CARTES: {
  'CARTE-3.6-ANCRE'?: { nom?: string; lumiere?: string; ombre?: string; tension?: string };
  'CARTE-3.6-EQUILIBRE'?: { nom?: string; lumiere?: string; ombre?: string; tension?: string };
  'CARTE-3.6-HORIZON'?: { nom?: string; lumiere?: string; ombre?: string; tension?: string };
} = {
  'CARTE-3.6-ANCRE': {
    nom: 'The folder of settled images',
    lumiere:
      'Your images lean toward rest: the house, the stability, the slow coffee, the scheduled Sunday. You choose places that carry you — and that make good conversation starters.',
    ombre:
      'The anchor reassures and closes in: days look alike, and someone else gets bored. The window does not change enough for someone who wants to leave.',
    tension: 'choosing the places that carry you, while keeping one image outside for adventure.',
  },
  'CARTE-3.6-EQUILIBRE': {
    nom: 'The pouch of mixed images',
    lumiere:
      'Your images share the space: the home sometimes, the outside sometimes — the feast and the simple dinner, the tribe and the one-to-one. You move between calm and open air without losing your thread.',
    ombre:
      'Your variety reads poorly: whoever shares your weekends does not know whether you want to stay or go out. The image of your week wants to be said.',
    tension: 'keeping your two colors, while naming the image of your week.',
  },
  'CARTE-3.6-HORIZON': {
    nom: 'The folder of open images',
    lumiere:
      'Your images lean outside: the street terrace, the feast, the group, the city that moves. You choose places where the world comes in — your conversation starters tell themselves.',
    ombre:
      'The horizon carries away and spends: the home sometimes becomes a hallway. A home shared with the world — and someone else who needs to come back in.',
    tension: 'choosing the places where the world comes in, while keeping one image inside for the return.',
  },
};

export const BRIEFING: {
  annonce?: string;
  aQuoiCaSert?: readonly string[];
  resultats?: readonly string[];
} = {
  annonce:
    'No questions this time. Just images — pick the one that speaks to you. There is no right answer: your choice says something, it grades nothing.',
  aQuoiCaSert: [
    'Eight pairs of images, one at a time: on each screen, you pick the one that speaks to you most.',
    'The two images are equal — neither is right, neither traps the other.',
    'No "both", no "neither": you pick one on each screen — the whole choice is what speaks.',
    'It grades nothing: your chosen images become conversation starters, not a score.',
  ],
  resultats: [
    'Your ice-breaker card — your shade of images, in a few words to share.',
    'Your starters — your chosen images turned into conversation openers.',
    'One more stone in your portrait — the rest of the journey feeds on it.',
  ],
};

export const COMPLETION: {
  entete?: string;
  labelOmbre?: string;
  labelTension?: string;
  fenetre?: string;
  miroirNote?: string;
} = {
  entete: '🏡 QUEST COMPLETE — “The visual choice”',
  labelOmbre: 'Your shadow side:',
  labelTension: 'Your inner tension:',
  fenetre:
    'Somewhere, someone is answering these same questions. The day your cards cross, they will have a lot to say to each other.',
  miroirNote:
    'Your image mirror — a shade, not a diagnosis — shows up alongside the other readings of the journey.',
};

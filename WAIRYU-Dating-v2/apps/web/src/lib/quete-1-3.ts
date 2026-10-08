/**
 * Quête 1.3 « Tes émotions » — Monde 1 « Le Miroir ».
 *
 * Contenu FIDÈLE au Livrable M1-1.3-Tes-Emotions (branche archive/v1-2026-10-05) :
 *  - ITEMS : les 20 items carte (verbatim, ordre du tableau) ;
 *  - PASSATION : l'ordre de passation GELÉ (mélange graine 213427, 26 positions) ;
 *  - les 6 codes Q1.3-T… (T21→T26) sont des trames de fiabilité (règle 11-b : AUCUN
 *    contenu au dépôt, le deck les saute) ;
 *  - CARTES : les 6 variantes verbatim ;
 *  - choisirVariante : sélecteurs verbatim, évalués dans l'ordre 1 → 6.
 *
 * RECONSTITUTION (5ᵉ reset sandbox) : données extraites programmatiquement du bundle
 * staging index-BvGGhSXl.js (Task 27) — bundle audit octet par octet contre le Livrable.
 */

export interface QueteItem13 {
  code: string;
  text: string;
  orient: 'D' | 'I';
  dim: 'P' | 'R' | 'X';
}

/** Les 20 items carte — verbatim. */
export const ITEMS: readonly QueteItem13[] = [
  {
    code: "Q1.3-01",
    text: "Je sais nommer ce que je ressens, même quand c'est mêlé.",
    orient: "D",
    dim: "P",
  },
  {
    code: "Q1.3-02",
    text: "Mes émotions me prennent souvent par surprise.",
    orient: "I",
    dim: "P",
  },
  {
    code: "Q1.3-03",
    text: "Je remarque vite quand mon humeur change.",
    orient: "D",
    dim: "P",
  },
  {
    code: "Q1.3-04",
    text: "Je réalise parfois que j'étais en colère — ou triste — bien après coup.",
    orient: "I",
    dim: "P",
  },
  {
    code: "Q1.3-05",
    text: "Les sensations de mon corps me renseignent sur mon état intérieur.",
    orient: "D",
    dim: "P",
  },
  {
    code: "Q1.3-06",
    text: "Je distingue la fatigue de la tristesse, la nervosité de l'excitation.",
    orient: "D",
    dim: "P",
  },
  {
    code: "Q1.3-07",
    text: "Je sais me calmer sans que quelqu'un m'aide.",
    orient: "D",
    dim: "R",
  },
  {
    code: "Q1.3-08",
    text: "Quand une émotion forte arrive, elle me traverse plus que je ne la traverse.",
    orient: "I",
    dim: "R",
  },
  {
    code: "Q1.3-09",
    text: "Je sais mettre des mots assez tôt pour éviter que ça déborde.",
    orient: "D",
    dim: "R",
  },
  {
    code: "Q1.3-10",
    text: "Je fais des choses que je regrette quand je suis très en colère ou très blessé(e).",
    orient: "I",
    dim: "R",
  },
  {
    code: "Q1.3-11",
    text: "Une marche, un souffle, un temps : je connais mes gestes qui apaisent.",
    orient: "D",
    dim: "R",
  },
  {
    code: "Q1.3-12",
    text: "Je rumine des heures avant de retrouver mon calme.",
    orient: "I",
    dim: "R",
  },
  {
    code: "Q1.3-13",
    text: "Je peux accueillir une émotion pénible sans la fuir tout de suite.",
    orient: "D",
    dim: "R",
  },
  {
    code: "Q1.3-14",
    text: "Je dis aux gens ce qu'ils représentent pour moi.",
    orient: "D",
    dim: "X",
  },
  {
    code: "Q1.3-15",
    text: "Je ressens beaucoup, mais ça ne se voit presque jamais.",
    orient: "I",
    dim: "X",
  },
  {
    code: "Q1.3-16",
    text: "Les gens se tournent naturellement vers moi pour se réconforter.",
    orient: "D",
    dim: "X",
  },
  {
    code: "Q1.3-17",
    text: "Dire « tu comptes pour moi » me met mal à l'aise, même quand c'est sincère.",
    orient: "I",
    dim: "X",
  },
  {
    code: "Q1.3-18",
    text: "Je m'intéresse vraiment à ce que les autres vivent en dedans.",
    orient: "D",
    dim: "X",
  },
  {
    code: "Q1.3-19",
    text: "Je célèbre les bonnes nouvelles des autres comme si c'étaient les miennes.",
    orient: "D",
    dim: "X",
  },
  {
    code: "Q1.3-20",
    text: "Les larmes des autres me mettent surtout mal à l'aise.",
    orient: "I",
    dim: "X",
  },
];

/** Ordre de passation GELÉ — mélange graine 213427 (26 positions : 20 items + 6 trames). */
export const PASSATION: readonly string[] = [
  "Q1.3-01",
  "Q1.3-10",
  "Q1.3-14",
  "Q1.3-T21",
  "Q1.3-02",
  "Q1.3-09",
  "Q1.3-17",
  "Q1.3-T22",
  "Q1.3-05",
  "Q1.3-15",
  "Q1.3-07",
  "Q1.3-T23",
  "Q1.3-20",
  "Q1.3-06",
  "Q1.3-12",
  "Q1.3-T24",
  "Q1.3-16",
  "Q1.3-08",
  "Q1.3-03",
  "Q1.3-19",
  "Q1.3-T25",
  "Q1.3-13",
  "Q1.3-04",
  "Q1.3-18",
  "Q1.3-11",
  "Q1.3-T26",
];

/** Le deck réel : les items dans l'ordre gelé, les trames sautées (jamais affichées). */
export function deckQuete(): QueteItem13[] {
  const parCode = new Map(ITEMS.map((i) => [i.code, i]));
  return PASSATION.flatMap((c) => {
    const it = parCode.get(c);
    return it ? [it] : [];
  });
}

function contribution(reponse: number, orient: 'D' | 'I'): number {
  return ((orient === 'D' ? reponse : 6 - reponse) - 1) / 4;
}

export interface Score13 { P: number; R: number; X: number; [k: string]: number }

/** Scorer du Livrable : moyenne 0-1 par dimension (P/R/X). */
export function scorer(reponses: Record<string, number>): Score13 {
  const acc = {
    P: { total: 0, n: 0 },
    R: { total: 0, n: 0 },
    X: { total: 0, n: 0 },
  };
  for (const item of ITEMS) {
    const r = reponses[item.code];
    if (typeof r === 'number' && r >= 1 && r <= 5) {
      acc[item.dim].total += contribution(r, item.orient);
      acc[item.dim].n += 1;
    }
  }
  const moy = (k: keyof typeof acc): number => (acc[k].n > 0 ? acc[k].total / acc[k].n : 0);
  return { P: moy('P'), R: moy('R'), X: moy('X') };
}

export type VarianteId13 = 'V1' | 'V2' | 'V3' | 'V4' | 'V5' | 'V6';

/** Sélecteurs VERBATIM (cartes.yaml), évalués dans l'ordre 1 → 6. */
export function choisirVariante(s: Score13): VarianteId13 {
  return s.P >= 0.65 && s.R >= 0.65
    ? 'V1'
    : s.P >= 0.6 && s.R < 0.4
      ? 'V2'
      : s.P < 0.4 && s.X < 0.4
        ? 'V3'
        : s.X >= 0.65
          ? 'V4'
          : s.P >= 0.55 && s.X < 0.45
            ? 'V5'
            : 'V6';
}

export interface Carte13 {
  id: VarianteId13;
  nom: string;
  lumiere: string;
  ombre: string;
  tension: string;
}

/** Les 6 variantes de carte — verbatim. */
export const CARTES: Record<VarianteId13, Carte13> = {
  V1: {
    id: "V1",
    nom: "La Clarté intérieure",
    lumiere: "Tu sais ce que tu ressens, tu sais ce que ça fait, tu sais comment ça passe. Tu as appris à nommer avant d'exploser, à accueillir avant de fuir. Cette clarté est rare — et elle se voit, même quand tu ne dis rien.",
    ombre: "Tu peux te prendre pour un point final : certaines émotions se traversent avec de l'aide, pas seulement avec de la méthode.",
    tension: "maîtriser sans contrôler.",
  },
  V2: {
    id: "V2",
    nom: "Le Volcan tendre",
    lumiere: "Tu ressens tout, fort et tôt — mais ce qui arrive ne demande pas toujours la permission. Tes émotions te traversent comme des saisons rapides. Ce que tu vis de débordant, d'autres l'appelleraient de la passion pure.",
    ombre: "Les regrets après les coups de chaud, tu les connais. Le travail n'est pas de ressentir moins — c'est de prévenir.",
    tension: "laisser la vague passer sans qu'elle emporte ce qui compte.",
  },
  V3: {
    id: "V3",
    nom: "Le Réservoir",
    lumiere: "Tes émotions existent — elles travaillent simplement en profondeur, sous la surface. Tu ne les dissèque pas, tu ne les affiches pas : tu les traverses. Ceux qui te connaissent bien savent lire les petits signes qui, chez toi, valent des déclarations.",
    ombre: "Ce que tu ne dis pas, l'autre ne peut pas le deviner — et l'attente devient de la distance.",
    tension: "exister pour toi sans disparaître pour l'autre.",
  },
  V4: {
    id: "V4",
    nom: "Le Radiateur",
    lumiere: "Chez toi, ça se voit et ça se dit. Tu félicites, tu consoles, tu célèbres les autres mieux que toi-même. Les gens se tournent naturellement vers toi — tu es un endroit où ça va mieux.",
    ombre: "Tu donnes tellement d'espace aux émotions des autres que les tiennes finissent à la file d'attente.",
    tension: "prendre soin des autres sans en faire ton adresse.",
  },
  V5: {
    id: "V5",
    nom: "La Réserve",
    lumiere: "Tu ressens beaucoup — et tu montres peu. Tes émotions sont riches, tenues, intimes. Ce n'est pas de la froideur : c'est de la pudeur. Quand tu ouvres, c'est choisi, et ça vaut de l'or.",
    ombre: "Ta pudeur peut être lue comme une distance — toi seul(e) sais que derrière, tout est vivant.",
    tension: "laisser entrer sans tout ouvrir.",
  },
  V6: {
    id: "V6",
    nom: "L'Apprenti·e",
    lumiere: "Tu es en train d'apprendre à connaître ce qui bouge en toi — et c'est un chantier qui rapporte à chaque étape. Parfois clair, parfois embrouillé : c'est le rythme normal. La bonne nouvelle : tout ce qui s'apprend t'attend.",
    ombre: "Ne confonds pas \"je ne sais pas ce que je ressens\" et \"je ne ressens rien\" — la deuxième phrase est presque toujours fausse.",
    tension: "avancer sans exiger d'arriver.",
  },
};

/** Textes du briefing — verbatim. */
export const BRIEFING = {
  annonce: "Les émotions ne se choisissent pas — mais on apprend à les connaître, à les nommer, à les traverser. Voici ta façon.",
  aQuoiCaSert: [
    "Les émotions ne se choisissent pas. La façon de les connaître, si — c'est ce que cette quête regarde.",
    "Ta perception — savoir ce que tu ressens, même quand c'est mêlé : repérer tôt, distinguer les états proches.",
    "Ta régulation — ce que tu fais quand ça monte : tes gestes qui apaisent, ta façon de revenir au calme.",
    "Ton expression — ce qui se voit et se dit de toi, et ce que ça crée entre les autres et toi.",
    "Il en sort ta carte — et, à la prochaine étape du voyage, ton miroir : la lecture complète de ta vie émotionnelle.",
  ],
};

/** Textes de la fenêtre de complétion (carte) — verbatim. */
export const COMPLETION = {
  entete: "🧭 QUÊTE ACCOMPLIE — « Tes émotions »",
  labelOmbre: "Ta zone d'ombre :",
  labelTension: "Ta tension intérieure :",
  fenetre: "Quelque part, quelqu'un répond à ces mêmes questions. Le jour où vos cartes se croiseront, elles auront beaucoup à se dire.",
  miroirNote: "Ton miroir — la lecture complète de ta vie émotionnelle — arrive à la prochaine étape du voyage.",
};

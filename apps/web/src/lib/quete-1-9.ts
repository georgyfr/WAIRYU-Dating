/**
 * Quête 1.9 « Ton élan du moment » — Monde 2 « Le Volant » (gratuit · Socle).
 *
 * Contenu FIDÈLE au Livrable M2-1.9-Ton-Elan-du-Moment (/tmp/m2-livrables) :
 *  - ITEMS : les 8 items d'ÉTAT (verbatim 01-tableau-des-items, ordre du tableau) —
 *    tonalité état (« en ce moment », « ces derniers jours », « ces derniers temps ») :
 *    on mesure une météo, JAMAIS un portrait de personnalité ;
 *  - PASSATION : l'ordre de passation GELÉ (mélange graine 219427, 02-plan-de-melange ;
 *    le 1ᵉʳ item vu est Q1.9-03, le dernier Q1.9-06) ;
 *  - CARTES : la carte UNIQUE « La Météo du moment » (cartes.yaml — exception documentée :
 *    carte de clarté 40-70 mots, NON sélective par décision de mission) ;
 *  - choisirVariante : condition « toujours » (verbatim cartes.yaml) — la carte est
 *    identique pour les trois degrés d'élan (haut / mixte / bas) : état du moment,
 *    jamais un portrait ; le score d'élan ne choisit RIEN sur cette carte ;
 *  - BRIEFING / COMPLETION : annonce verbatim (05-ecran-d-intro), gabarit 1.1.
 *
 * BESOINS (cadrage moteur : théorie de l'autodétermination — noms d'auteurs et sigles
 * interdits au rendu, verrou 00-README) — les clés de code sont SANS accent :
 *   'autonomie'   ↔ « autonomie »   (items 01-03)
 *   'competence'  ↔ « compétence »  (items 04-06 — accent au rendu uniquement)
 *   'affiliation' ↔ « affiliation » (items 07-08).
 *
 * RÈGLE ABSOLUE (00-README / 01-tableau-des-items) : les 8 items n'entrent JAMAIS
 * dans un score de matching, jamais dans une compatibilité, jamais dans un classement —
 * ils nourrissent l'auto-connaissance (miroir LÉGER + carte unique) et le moteur de
 * rythme interne (SIG_ÉLAN_FAIBLE, sans trace texte). Ré-administration au plus tôt à
 * 30 jours. Zéro trame ▲ dans cette quête (aucun énoncé réservé).
 *
 * Typo : apostrophes ASCII uniquement.
 */

export interface QueteItem19 {
  code: string;
  text: string;
  /** 'D' = directe, 'I' = inversée (recodée 6 − r). */
  orient: 'D' | 'I';
  /** Besoin (clé sans accent) : 'autonomie' | 'affiliation' | 'competence'. */
  dim: 'autonomie' | 'affiliation' | 'competence';
}

/** Les 8 items d'état — verbatim (01-tableau-des-items, ordre du tableau). */
export const ITEMS: readonly QueteItem19[] = [
  {
    code: "Q1.9-01",
    text: "En ce moment, mes journées ressemblent à mes choix.",
    orient: "D",
    dim: "autonomie",
  },
  {
    code: "Q1.9-02",
    text: "En ce moment, ce sont les circonstances qui décident pour moi.",
    orient: "I",
    dim: "autonomie",
  },
  {
    code: "Q1.9-03",
    text: "Ces derniers jours, je fais ce que j'ai choisi de faire.",
    orient: "D",
    dim: "autonomie",
  },
  {
    code: "Q1.9-04",
    text: "En ce moment, ce que j'entreprends tient debout.",
    orient: "D",
    dim: "competence",
  },
  {
    code: "Q1.9-05",
    text: "Ces derniers temps, je me sens démuni·e face aux imprévus.",
    orient: "I",
    dim: "competence",
  },
  {
    code: "Q1.9-06",
    text: "En ce moment, je termine ce que je commence.",
    orient: "D",
    dim: "competence",
  },
  {
    code: "Q1.9-07",
    text: "Ces derniers jours, je me sens proche des gens qui comptent.",
    orient: "D",
    dim: "affiliation",
  },
  {
    code: "Q1.9-08",
    text: "En ce moment, je traverse les journées sans vraie conversation.",
    orient: "I",
    dim: "affiliation",
  },
];

/** Ordre de passation GELÉ — mélange graine 219427 (8 items, aucune trame). */
export const PASSATION: readonly string[] = [
  "Q1.9-03",
  "Q1.9-04",
  "Q1.9-02",
  "Q1.9-07",
  "Q1.9-01",
  "Q1.9-05",
  "Q1.9-08",
  "Q1.9-06",
];

/** Le deck réel : les items dans l'ordre gelé de la passation. */
export function deckQuete(): QueteItem19[] {
  const parCode = new Map(ITEMS.map((i) => [i.code, i]));
  return PASSATION.flatMap((c) => {
    const it = parCode.get(c);
    return it ? [it] : [];
  });
}

/** Likert 1-5 → 0-1 (inversées recodées 6 − r). */
function contribution(reponse: number, orient: 'D' | 'I'): number {
  return ((orient === 'D' ? reponse : 6 - reponse) - 1) / 4;
}

export interface Score19 {
  autonomie: number;
  affiliation: number;
  competence: number;
  /** Dérivé : la moyenne des trois besoins — l'élan du moment. */
  elan: number;
  [k: string]: number;
}

/** Scorer du Livrable : moyenne 0-1 par besoin (items recodés 6−r pour les inversés),
 *  puis l'élan = moyenne des trois besoins (06-fiche-computation / usage moteur 01). */
export function scorer(reponses: Record<string, number>): Score19 {
  const acc: Record<'autonomie' | 'affiliation' | 'competence', { total: number; n: number }> = {
    autonomie: { total: 0, n: 0 },
    affiliation: { total: 0, n: 0 },
    competence: { total: 0, n: 0 },
  };
  for (const item of ITEMS) {
    const r = reponses[item.code];
    if (typeof r === 'number' && r >= 1 && r <= 5) {
      acc[item.dim].total += contribution(r, item.orient);
      acc[item.dim].n += 1;
    }
  }
  const moy = (k: keyof typeof acc): number => (acc[k].n > 0 ? acc[k].total / acc[k].n : 0);
  const autonomie = moy('autonomie');
  const affiliation = moy('affiliation');
  const competence = moy('competence');
  const elan = (autonomie + affiliation + competence) / 3;
  return { autonomie, affiliation, competence, elan };
}

export type VarianteId19 = 'V1';

/**
 * Sélecteur — condition VERBATIM (cartes.yaml) : « toujours — variante unique (état du
 * moment, jamais un portrait de personnalité) ». La carte est identique pour les trois
 * degrés d'élan (haut / mixte / bas) : elle est NON sélective par décision de mission —
 * c'est sa doctrine, pas un manque de logique de sélection. Le score d'élan ne choisit
 * RIEN ici : il ne vit qu'au miroir (3 profils) et au moteur (SIG_ÉLAN_FAIBLE, sans trace).
 */
export function choisirVariante(_score: Score19): VarianteId19 {
  return 'V1';
}

export interface Carte {
  id: VarianteId19;
  nom: string;
  lumiere: string;
  ombre: string;
  tension: string;
}

/** La carte UNIQUE — verbatim (cartes.yaml : portrait → lumiere, ombre → ombre,
 *  tension_interieure → tension). Exception documentée : carte de clarté 40-70 mots. */
export const CARTES: Record<VarianteId19, Carte> = {
  V1: {
    id: "V1",
    nom: "La Météo du moment",
    lumiere: "Ce que tu lis ici n'est pas un portrait : c'est ta météo intérieure du jour. Ton élan monte, s'essouffle, revient — et ton énergie a le droit de bouger sans te trahir.",
    ombre: "Une météo datée trompe si on la relit plus tard : ce que tu offres aujourd'hui change — et l'autre lit l'aujourd'hui, pas ta semaine passée.",
    tension: "accepter que ton élan bouge, sans le forcer à mentir.",
  },
};

/** Textes du briefing — annonce verbatim (05-ecran-d-intro) ; les puces sont la
 *  couche app (rédigées, ton Task 35) : elles posent la lecture ÉTAT de la quête. */
export const BRIEFING = {
  annonce: "Dernière étape, moins de cartes : trois questions sur ton élan du moment.",
  aQuoiCaSert: [
    "Huit affirmations sur ton élan de ces derniers jours — une météo, pas un portrait.",
    "Elles déclinent trois besoins : ton autonomie, ta compétence, ton affiliation.",
    "Pas de bonne réponse : réponds comme tu te sens ces derniers jours, sans viser un élan idéal.",
    "Une météo se reprend : dans 30 jours, tu pourras refaire la photo de ton élan.",
  ],
  resultats: [
    "Ta carte — « La Météo du moment » : ta lumière, ta zone d'ombre, ta tension.",
    "Ton miroir — ta saison d'élan du moment, en toutes lettres, avec un mode d'emploi.",
    "Une lecture datée — elle vaut pour aujourd'hui, et se re-passe au plus tôt dans 30 jours.",
  ],
};

/** Textes de la fenêtre de complétion (carte) — entête/labels verbatim (cartes.yaml),
 *  fenêtre F1 verbatim, gabarit 1.1. */
export const COMPLETION = {
  entete: "🧭 QUÊTE ACCOMPLIE — « Ton élan du moment »",
  labelOmbre: "Ta zone d'ombre :",
  labelTension: "Ta tension intérieure :",
  fenetre: "Quelque part, quelqu'un répond à ces mêmes questions. Le jour où vos cartes se croiseront, elles auront beaucoup à se dire.",
  miroirNote: "Ton miroir — ton élan du moment, en toutes lettres — arrive à la prochaine étape du voyage.",
};

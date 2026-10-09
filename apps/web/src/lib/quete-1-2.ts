/**
 * Quête 1.2 « Ta façon de t'attacher » — Monde 1 « Le Miroir ».
 *
 * Contenu FIDÈLE au Livrable M1-1.2-Facon-Tattacher (branche archive/v1-2026-10-05) :
 *  - ITEMS : les 12 items carte (verbatim, ordre du tableau) ;
 *  - PASSATION : l'ordre de passation GELÉ (mélange graine 212427, 20 positions) ;
 *  - les 8 codes Q1.2-T… (T09→T16) sont des trames SÉCURITÉ (DTM_M + RSQ — règle 11-b : AUCUN
 *    contenu au dépôt, le deck les saute) — dont les doublons de fiabilité hors passation ;
 *  - CARTES : les 5 variantes verbatim (corrections VAGUE 5 intégrées) ;
 *  - choisirVariante : sélecteurs verbatim, évalués dans l'ordre 1 → 5.
 *
 * RECONSTITUTION (5ᵉ reset sandbox) : données extraites programmatiquement du bundle
 * staging index-BvGGhSXl.js (Task 27) — bundle audit octet par octet contre le Livrable.
 */

export interface QueteItem12 {
  code: string;
  text: string;
  orient: 'D' | 'I';
  dim: 'A' | 'E';
}

/** Les 12 items carte — verbatim. */
export const ITEMS: readonly QueteItem12[] = [
  {
    code: "Q1.2-01",
    text: "Quand quelqu'un compte pour moi, son silence me pèse très vite.",
    orient: "D",
    dim: "A",
  },
  {
    code: "Q1.2-02",
    text: "J'ai souvent besoin qu'on me confirme que tout va bien entre nous.",
    orient: "D",
    dim: "A",
  },
  {
    code: "Q1.2-03",
    text: "Une remarque un peu froide peut m'occuper toute la soirée.",
    orient: "D",
    dim: "A",
  },
  {
    code: "Q1.2-04",
    text: "J'anticipe parfois qu'on me quitte avant même que quelque chose arrive.",
    orient: "D",
    dim: "A",
  },
  {
    code: "Q1.2-05",
    text: "Je me sens mieux quand je sais clairement où j'en suis avec quelqu'un.",
    orient: "D",
    dim: "A",
  },
  {
    code: "Q1.2-06",
    text: "Les relations où chacun garde son indépendance me conviennent parfaitement.",
    orient: "I",
    dim: "A",
  },
  {
    code: "Q1.2-07",
    text: "Quand une relation devient profonde, j'ai une envie instinctive de ralentir.",
    orient: "D",
    dim: "E",
  },
  {
    code: "Q1.2-08",
    text: "Dépendre de quelqu'un ne me fait pas peur.",
    orient: "I",
    dim: "E",
  },
  {
    code: "Q1.2-09",
    text: "Je préfère gérer mes soucis seul(e), même avec un partenaire.",
    orient: "D",
    dim: "E",
  },
  {
    code: "Q1.2-10",
    text: "Raconter mes faiblesses à quelqu'un qui compte me soulage.",
    orient: "I",
    dim: "E",
  },
  {
    code: "Q1.2-11",
    text: "La proximité constante me fait du bien plus qu'elle ne me fatigue.",
    orient: "I",
    dim: "E",
  },
  {
    code: "Q1.2-12",
    text: "Trop de proximité trop vite me donne envie de prendre de l'air.",
    orient: "D",
    dim: "E",
  },
];

/** Ordre de passation GELÉ — mélange graine 212427 (20 positions : 12 items + 8 trames). */
export const PASSATION: readonly string[] = [
  "Q1.2-12",
  "Q1.2-T09",
  "Q1.2-02",
  "Q1.2-T10",
  "Q1.2-08",
  "Q1.2-T11",
  "Q1.2-05",
  "Q1.2-T12",
  "Q1.2-07",
  "Q1.2-06",
  "Q1.2-T13",
  "Q1.2-09",
  "Q1.2-01",
  "Q1.2-T14",
  "Q1.2-10",
  "Q1.2-03",
  "Q1.2-T15",
  "Q1.2-11",
  "Q1.2-04",
  "Q1.2-T16",
];

/** Le deck réel : les items dans l'ordre gelé, les trames sautées (jamais affichées). */
export function deckQuete(): QueteItem12[] {
  const parCode = new Map(ITEMS.map((i) => [i.code, i]));
  return PASSATION.flatMap((c) => {
    const it = parCode.get(c);
    return it ? [it] : [];
  });
}

function contribution(reponse: number, orient: 'D' | 'I'): number {
  return ((orient === 'D' ? reponse : 6 - reponse) - 1) / 4;
}

export interface Score12 { A: number; E: number; [k: string]: number }

/** Scorer du Livrable : moyenne 0-1 par dimension (A/E). */
export function scorer(reponses: Record<string, number>): Score12 {
  const acc = {
    A: { total: 0, n: 0 },
    E: { total: 0, n: 0 },
  };
  for (const item of ITEMS) {
    const r = reponses[item.code];
    if (typeof r === 'number' && r >= 1 && r <= 5) {
      acc[item.dim].total += contribution(r, item.orient);
      acc[item.dim].n += 1;
    }
  }
  const moy = (k: keyof typeof acc): number => (acc[k].n > 0 ? acc[k].total / acc[k].n : 0);
  return { A: moy('A'), E: moy('E') };
}

export type VarianteId12 = 'V1' | 'V2' | 'V3' | 'V4' | 'V5';

/** Sélecteurs VERBATIM (cartes.yaml), évalués dans l'ordre 1 → 5. */
export function choisirVariante(s: Score12): VarianteId12 {
  return s.A < 0.4 && s.E < 0.4
    ? 'V1'
    : s.A >= 0.6 && s.E < 0.5
      ? 'V2'
      : s.A < 0.5 && s.E >= 0.6
        ? 'V3'
        : s.A >= 0.55 && s.E >= 0.55
          ? 'V4'
          : 'V5';
}

export interface Carte12 {
  id: VarianteId12;
  nom: string;
  lumiere: string;
  ombre: string;
  tension: string;
}

/** Les 5 variantes de carte — verbatim. */
export const CARTES: Record<VarianteId12, Carte12> = {
  V1: {
    id: "V1",
    nom: "L'Ancrage",
    lumiere: "Tu aimes sans paniquer. La proximité te nourrit, la distance ne t'effraie pas : tu sais rester, tu sais lâcher. Tu le nommes simplement toi : tu restes, tu le dis, tu répare vite ce qui grince dans une vie à deux.",
    ombre: "Ton équilibre peut te faire sous-estimer à quel point l'autre, lui, a besoin de preuves.",
    tension: "aimer sans surveiller, rester sans retenir.",
  },
  V2: {
    id: "V2",
    nom: "La Vigie",
    lumiere: "Tu aimes fort, et tu veilles. Quand quelqu'un compte, tu y penses souvent, tu sens les variations d'humeur avant tout le monde, tu es prêt(e) à tout pour que ça tienne. Et quand tu donnes, tu donnes sans tenir la comptabilité.",
    ombre: "Le silence de l'autre te parle trop fort — et il dit presque toujours autre chose que ce que tu entends.",
    tension: "être rassuré(e) sans avoir à demander.",
  },
  V3: {
    id: "V3",
    nom: "L'Autonome",
    lumiere: "Tu t'appartiens, et tu ne veux pas le perdre en aimant. Tu gères tes tempêtes seul(e), tu prends l'air quand ça devient dense, tu reviens quand tu as respiré. Ton amour est calme, stable, sans drame.",
    ombre: "Ton besoin d'air peut ressembler à une fuite pour qui ne connaît pas ton langage — dis-le avant que l'autre l'invente.",
    tension: "garder ton espace sans que l'autre s'y sente exclu(e).",
  },
  V4: {
    id: "V4",
    nom: "Le Va-et-vient",
    lumiere: "Ton cœur a deux vitesses — et c'est vrai, c'est parfois épuisant. Quand ça compte, tu veux tout ; et dès que tu l'as, une partie de toi veut reprendre de l'air. Ce n'est ni de la légèreté ni de la bizarrerie : c'est ta façon d'avoir appris à aimer. Elle se comprend, elle s'apaise, elle se raconte.",
    ombre: "L'autre peut vivre ton rythme comme des signaux contradictoires — nomme-le, et la moitié du chemin est faite.",
    tension: "rester quand tu as envie de partir, partir sans avoir l'air de fuir.",
  },
  V5: {
    id: "V5",
    nom: "L'Équilibre en mouvement",
    lumiere: "Tu n'es ni dans la veille constante ni dans l'envol systématique : ta façon d'aimer s'ajuste à la personne en face. C'est une souplesse rare — elle demande juste que l'autre te suive dans ses propres mouvements.",
    ombre: "La souplesse a un prix : on peut croire que tu choisis peu à voix haute. Choisis, de temps en temps, à voix haute.",
    tension: "t'adapter sans t'effacer.",
  },
};

/** Textes du briefing — verbatim. */
export const BRIEFING = {
  annonce: "Chacun a sa façon d'aimer et d'être proche. Il n'y a pas de mauvaise façon — seulement ta façon. La connaître, c'est déjà se donner plus de chances.",
  aQuoiCaSert: [
    "Il n'y a pas une bonne façon de s'attacher — il y a la tienne. Cette quête mesure les deux mouvements qui décrivent ta façon d'aimer et d'être proche.",
    "Ton besoin de réassurance — ce que fait ton cœur quand quelqu'un compte pour toi : ce que tu attends, ce qui t'inquiète, ce qui t'apaise.",
    "Ton besoin d'espace — ce dont tu as besoin pour rester toi dans la proximité : ton air, ton rythme, ton monde intérieur.",
    "Il en sort ta carte — et, à la prochaine étape du voyage, ton miroir : la lecture complète de ta façon d'aimer.",
  ],
};

/** Textes de la fenêtre de complétion (carte) — verbatim. */
export const COMPLETION = {
  entete: "🧭 QUÊTE ACCOMPLIE — « Ta façon de t'attacher »",
  labelOmbre: "Ta zone d'ombre :",
  labelTension: "Ta tension intérieure :",
  fenetre: "Quelque part, quelqu'un répond à ces mêmes questions. Le jour où vos cartes se croiseront, elles auront beaucoup à se dire.",
  miroirNote: "Ton miroir — la lecture complète de ta façon d'aimer — arrive à la prochaine étape du voyage.",
};

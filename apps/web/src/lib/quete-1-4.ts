/**
 * Quête 1.4 « Ton contrôle sur toi-même » — Monde 2 « Le Volant ».
 *
 * Contenu FIDÈLE au Livrable M2-1.4-Ton-Controle (branche archive/v1-2026-10-05) :
 *  - ITEMS : les 8 items carte (verbatim 01-tableau-des-items, ordre du tableau) ;
 *  - PASSATION : l'ordre de passation GELÉ (mélange graine 214427, 02-plan-de-melange) ;
 *  - le doublon Q1.4-01.r est une trame fiabilité longitudinale (règle 11-b) :
 *    HORS passation, JAMAIS affichée — le deck la saute, comme les trames
 *    Q1.1-T de la quête 1.1 (aucune formulation ne se voit jamais à l'écran) ;
 *  - CARTES : les 5 variantes verbatim (cartes.yaml, charte PARTIE 4) ;
 *  - choisirVariante : les sélecteurs verbatim (seuils sur le score de quête —
 *    propositions ADOPTÉES comme valeurs de départ, FM-019), évalués dans
 *    l'ordre 1 → 5 ; conditions et seuils restent côté moteur, jamais rendus ;
 *  - BRIEFING : l'annonce est verbatim (05-ecran-d-intro), les puces sont la
 *    couche app rédigée (ton Task 35).
 *
 * Quête MONO-DIMENSION : les 8 items de la passation alimentent la dimension
 * `autocontrole` (scorer = moyenne des contributions recodées, normalisée 0-1 —
 * inversées recodées 6 − r). AUCUNE trame ▲ dans la passation (02-plan-de-melange :
 * c2/c3 sans objet de fait, 0 trame).
 *
 * Typo : apostrophe ASCII uniquement, pas d'insécable, guillemets français.
 * Règles : aucun code, score, sigle ou seuil ne franchit le rendu ; aucune
 * métadonnée moteur dans un texte rendu ; phrases ≤ 22 mots dans les textes rédigés.
 */

export interface QueteItem14 {
  code: string;
  text: string;
  /** 'D' = directe, 'I' = inversée (recodée 6 − r). */
  orient: 'D' | 'I';
  dim: 'autocontrole';
}

/** L'objet de passation affiché — code + énoncé (l'orientation reste côté moteur). */
export interface ItemsQuete14 {
  code: string;
  text: string;
}

/** Les 8 items carte — verbatim (01-tableau-des-items, ordre du tableau). */
export const ITEMS: readonly QueteItem14[] = [
  {
    code: "Q1.4-01",
    text: "Quand je décide d'une limite — budget, écran, nourriture — je la tiens.",
    orient: "D",
    dim: "autocontrole",
  },
  {
    code: "Q1.4-02",
    text: "Il m'arrive de reprendre des choses que j'avais décidé d'arrêter.",
    orient: "I",
    dim: "autocontrole",
  },
  {
    code: "Q1.4-03",
    text: "Je préfère attendre le bon moment plutôt que céder sur le coup.",
    orient: "D",
    dim: "autocontrole",
  },
  {
    code: "Q1.4-04",
    text: "Les petites tentations du quotidien l'emportent souvent sur mes bonnes résolutions.",
    orient: "I",
    dim: "autocontrole",
  },
  {
    code: "Q1.4-05",
    text: "Ce que je dis de faire dans une semaine, je le fais vraiment.",
    orient: "D",
    dim: "autocontrole",
  },
  {
    code: "Q1.4-06",
    text: "Je rembourse « plus tard » ce que je m'autorise « maintenant » — souvent.",
    orient: "I",
    dim: "autocontrole",
  },
  {
    code: "Q1.4-07",
    text: "Même fatigué(e) ou contrarié(e), je garde mes habitudes de soin de moi.",
    orient: "D",
    dim: "autocontrole",
  },
  {
    code: "Q1.4-08",
    text: "Je suis du genre à tout plaquer pour un coup d'envie.",
    orient: "I",
    dim: "autocontrole",
  },
  {
    // Trame fiabilité — doublon longitudinal Q1.4-01.r (règle 11-b) : JAMAIS
    // affichée, HORS passation. Le deck la saute comme les trames Q1.1-T de la
    // quête 1.1, et elle n'entre jamais dans le score : le scorer ne parcourt
    // que les codes de PASSATION.
    code: "Q1.4-01.r",
    text: "Mes décisions de limites tiennent dans le temps.",
    orient: "D",
    dim: "autocontrole",
  },
];

/** Ordre de passation GELÉ — mélange graine 214427 (8 positions, aucune trame ;
 *  le doublon Q1.4-01.r est HORS passation). */
export const PASSATION: readonly string[] = [
  "Q1.4-03",
  "Q1.4-08",
  "Q1.4-07",
  "Q1.4-06",
  "Q1.4-05",
  "Q1.4-04",
  "Q1.4-02",
  "Q1.4-01",
];

const PAR_CODE = new Map(ITEMS.map((i) => [i.code, i]));

/** Le deck réel : les items dans l'ordre gelé — le doublon 01.r n'y figure jamais. */
export function deckQuete(): ItemsQuete14[] {
  return PASSATION.flatMap((c) => {
    const it = PAR_CODE.get(c);
    return it ? [{ code: it.code, text: it.text }] : [];
  });
}

/** Likert 1-5 → 0-1 (inversées recodées 6 − r). */
function contribution(reponse: number, orient: 'D' | 'I'): number {
  return ((orient === 'D' ? reponse : 6 - reponse) - 1) / 4;
}

export interface Score14 {
  autocontrole: number;
  [k: string]: number;
}

/** Scorer du Livrable : moyenne des contributions recodées sur les 8 items de
 *  la passation → { autocontrole } normalisé 0-1. Le doublon 01.r n'y entre jamais. */
export function scorer(reponses: Record<string, number>): Score14 {
  let total = 0;
  let n = 0;
  for (const code of PASSATION) {
    const it = PAR_CODE.get(code);
    const r = it ? reponses[it.code] : undefined;
    if (it && typeof r === 'number' && r >= 1 && r <= 5) {
      total += contribution(r, it.orient);
      n += 1;
    }
  }
  return { autocontrole: n > 0 ? total / n : 0 };
}

export type VarianteId14 = 'V1' | 'V2' | 'V3' | 'V4' | 'V5';

/**
 * Sélecteurs VERBATIM (cartes.yaml — seuils sur le score de quête), évalués
 * dans l'ordre 1 → 5 : score ≥ 0.75 → V1 · ≥ 0.60 → V2 · ≥ 0.45 → V3 ·
 * ≥ 0.30 → V4 · sinon V5. Propositions ADOPTÉES comme valeurs de départ
 * (FM-019) — métadonnées moteur, jamais affichées telles quelles.
 */
export function choisirVariante(score: Score14): VarianteId14 {
  const s = typeof score.autocontrole === 'number' ? score.autocontrole : 0;
  return s >= 0.75
    ? 'V1'
    : s >= 0.6
      ? 'V2'
      : s >= 0.45
        ? 'V3'
        : s >= 0.3
          ? 'V4'
          : 'V5';
}

export interface Carte {
  id: VarianteId14;
  nom: string;
  lumiere: string;
  ombre: string;
  tension: string;
}

/** Les 5 variantes de carte — verbatim (cartes.yaml, ordre du YAML). */
export const CARTES: Record<VarianteId14, Carte> = {
  V1: {
    id: "V1",
    nom: "L'Artisan·e",
    lumiere:
      "Quand tu décides quelque chose pour toi, ça arrive. Tes limites tiennent, tes promesses envers toi-même aussi. Ce n'est pas de la discipline militaire : c'est une confiance que tu t'accordes, jour après jour. Les autres la sentent — elle rend ton oui fiable et ton non solide.",
    ombre: "Le risque du solide : te juger sans pitié le jour où tu glisses.",
    tension: "tenir sans te serrer.",
  },
  V2: {
    id: "V2",
    nom: "Le Juste-Milieu assumé",
    lumiere:
      "Tu tiens ce qui compte et tu lâches ce qui n'a pas d'importance. Ton auto-contrôle n'est pas une armure : c'est une hiérarchie. Tu sais où mettre ton énergie — et c'est exactement comme ça qu'on dure.",
    ombre:
      "La frontière entre \"flexible\" et \"fatigué\" se brouille parfois — vérifie de temps en temps de quel côté tu es.",
    tension: "rester souple sans te laisser porter.",
  },
  V3: {
    id: "V3",
    nom: "Le·La Vivant·e",
    lumiere:
      "Tes résolutions sont sincères, tes rechutes aussi. Tu recommences, tu ajustes, tu recommences encore. Ce n'est pas du manque de volonté : c'est une vie qui préfère l'essai à la culpabilité. Beaucoup de choses se construisent comme ça.",
    ombre:
      "Le \"c'est la dernière fois\" finit par perdre son sens — choisis un rituel plutôt qu'une promesse.",
    tension: "changer sans te détester.",
  },
  V4: {
    id: "V4",
    nom: "Le·La Cédant·e de bonne foi",
    lumiere:
      "Tes intentions sont là, l'élan aussi — c'est le fil entre les deux qui casse. Les tentations du quotidien sont plus proches que tes objectifs. Tu le sais, tu le vis avec humour, parfois avec lassitude.",
    ombre:
      "L'habitude de céder peut devenir une histoire que tu te racontes — \"je suis comme ça\". Tu es surtout comme ça, pour l'instant.",
    tension: "croire en toi plus longtemps qu'un lundi.",
  },
  V5: {
    id: "V5",
    nom: "L'Immédiat",
    lumiere:
      "Tu vis au présent tendu. L'envie arrive, tu réponds. Les plans lointains t'ennuient, les plaisirs proches te parlent. C'est une manière entière d'exister — sincère, sans calcul, sans hypocrisie.",
    ombre:
      "Certaines choses que tu veux vraiment — vraiment — demandent un délai. Elles ne l'auront que si tu le leur donnes.",
    tension: "profiter de maintenant sans le voler à plus tard.",
  },
};

/** Textes du briefing — annonce VERBATIM (05-ecran-d-intro), puces en couche app. */
export const BRIEFING = {
  annonce:
    "L'auto-contrôle, c'est ce muscle invisible qui te fait tenir tes promesses envers toi-même. Le tien, comment il travaille ?",
  aQuoiCaSert: [
    "C'est la quête du volant — ce que tu choisis pour toi, et ce que tu en fais dans la durée.",
    "Huit affirmations décrivent tes promesses envers toi-même : les limites que tu décides, et celles que tu tiens.",
    "Pas de bonne réponse — seulement ta réponse, celle qui ressemble à tes semaines ordinaires.",
    "Il en sort une carte, et une pierre de plus dans ton portrait.",
  ],
  resultats: [
    "Ta carte — ta lumière et ta zone d'ombre, en quelques mots.",
    "Ta tendance — comment ton auto-contrôle travaille aujourd'hui, en une seule barre.",
    "Les pierres de ton portrait — ce que tu découvres ici alimente toute la suite du voyage.",
  ],
};

/** Textes de la fenêtre de complétion (carte) — même gabarit que la quête 1.1. */
export const COMPLETION = {
  entete: "🧭 QUÊTE ACCOMPLIE — « Ton contrôle sur toi-même »",
  labelOmbre: "Ta zone d'ombre :",
  labelTension: "Ta tension intérieure :",
  fenetre:
    "Quelque part, quelqu'un répond à ces mêmes questions. Le jour où vos cartes se croiseront, elles auront beaucoup à se dire.",
  miroirNote:
    "Ton miroir — la lecture complète de ton fonctionnement — arrive à la prochaine étape du voyage.",
};

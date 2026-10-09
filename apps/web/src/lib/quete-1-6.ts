/**
 * Quête 1.6 « Ta façon de penser » — Monde 2 « Le Volant » (Task 37-c).
 *
 * Contenu FIDÈLE au Livrable M2-1.6-Ta-Facon-de-Penser
 * (source : /tmp/m2-livrables/Livrable des mondes/M2-1.6-Ta-Facon-de-Penser,
 * branche archive/v1-2026-10-05) :
 *  - ITEMS : les 7 items déclaratifs VERBATIM (01-tableau-des-items, ordre du
 *    tableau) — mono-dimension `traitement`, D = direct · I = inversé (6 − r) ;
 *  - PASSATION : l'ordre de passation GELÉ (mélange graine 216427,
 *    02-plan-de-melange-graine-216427 — Fisher-Yates + réparation déterministe,
 *    run max 2, « le 1ᵉʳ item vu est Q1.6-06, le dernier est Q1.6-05 ») ;
 *  - ÉNIGMES : les 3 énigmes de performance (01-tableau-des-items — énoncés
 *    ENTIERS verbatim, réponse intuitive + réponse correcte du Livrable).
 *    Elles sont HORS contrat de mélange : ordre de passation = ordre source
 *    É1 → É2 → É3 (montée progressive assumée, FM future au 02). Le doublon de
 *    fiabilité Q1.6-05.r (« Mon ressenti initial me sert de boussole, et
 *    rarement me trompe. ») est un re-passage longitudinal : il ne fait PAS
 *    partie du deck (aucune trame ▲ dans cette quête).
 *  - CARTES : les 5 variantes VERBATIM (cartes.yaml — corps → lumière,
 *    zone_ombre → ombre, tension_interieure → tension) ;
 *  - choisirVariante : les conditions EXACTES du sélecteur D×E (cartes.yaml) ;
 *  - BRIEFING : annonce VERBATIM (05-ecran-d-intro) — le reste est couche app.
 *
 * RÈGLES DU LIVRABLE : les énigmes ne notent personne (le rendu décrit la
 * MANIÈRE — vérifier, hésiter, répondre du premier mouvement — jamais un
 * décompte ni une note scolaire) · aucun code/score/sigle rendu (la variable
 * moteur et la signature de matching restent côté moteur) · le temps de réponse
 * aux énigmes est capté par le moteur mais JAMAIS affiché · neutralité des deux
 * pôles (le flair n'est pas superficiel, l'analytique n'est pas lent) ·
 * apostrophes ASCII uniquement.
 */
import type { ItemPassation } from './quetes';
import { avecEN } from '../i18n/apply';
import * as EN_Q16 from '../i18n/content/en/quete-1-6';

export interface QueteItem16 {
  code: string;
  text: string;
  /** 'D' = directe, 'I' = inversée (recodée 6 − r). */
  orient: 'D' | 'I';
  /** Mono-dimension : les 7 items partagent `traitement`. */
  dim: 'traitement';
}

/** Les 7 items déclaratifs — verbatim (01-tableau-des-items, ordre du tableau). */
const ITEMS_FR: readonly QueteItem16[] = [
  {
    code: "Q1.6-01",
    text: "Face à une décision, je fais confiance à mon flair plus qu'à mes calculs.",
    orient: "D",
    dim: "traitement",
  },
  {
    code: "Q1.6-02",
    text: "Je pèse le pour et le contre par écrit avant les grandes décisions.",
    orient: "I",
    dim: "traitement",
  },
  {
    code: "Q1.6-03",
    text: "Je sais rarement pourquoi je ressens quelque chose — mais je le ressens fort.",
    orient: "D",
    dim: "traitement",
  },
  {
    code: "Q1.6-04",
    text: "Je démonte les arguments étape par étape avant de me faire une opinion.",
    orient: "I",
    dim: "traitement",
  },
  {
    code: "Q1.6-05",
    text: "Ma première impression est souvent la bonne.",
    orient: "D",
    dim: "traitement",
  },
  {
    code: "Q1.6-06",
    text: "Je vérifie trois fois avant de trancher.",
    orient: "I",
    dim: "traitement",
  },
  {
    code: "Q1.6-07",
    text: "Les chiffres me rassurent plus que les promesses.",
    orient: "I",
    dim: "traitement",
  },
];
export const ITEMS = avecEN(ITEMS_FR, EN_Q16.ITEMS);

/**
 * Ordre de passation GELÉ — mélange graine 216427 (02-plan-de-melange,
 * « Séquence d'ordre de passation » : 06 · 02 · 03 · 07 · 04 · 01 · 05).
 * Passation complète de la quête : ces 7 items, PUIS les 3 énigmes en ordre
 * source É1 → É2 → É3 (hors contrat de mélange — voir ENIGMES).
 */
export const PASSATION: readonly string[] = [
  "Q1.6-06",
  "Q1.6-02",
  "Q1.6-03",
  "Q1.6-07",
  "Q1.6-04",
  "Q1.6-01",
  "Q1.6-05",
];

/** Le deck Likert réel : les 7 items dans l'ordre gelé (les énigmes ont leur deck). */
export function deckQuete(): QueteItem16[] {
  const parCode = new Map(ITEMS.map((i) => [i.code, i]));
  return PASSATION.flatMap((c) => {
    const it = parCode.get(c);
    return it ? [it] : [];
  });
}

export interface Enigme16 {
  code: 'Q1.6-E1' | 'Q1.6-E2' | 'Q1.6-E3';
  /** Énoncé intégral — verbatim (01-tableau-des-items). */
  enonce: string;
  /** 3 options : réponse intuitive du Livrable · réponse correcte · 3ᵉ option plausible. */
  options: readonly string[];
  /** Index (0-based) de la bonne réponse — jamais rendu tel quel à l'écran. */
  correcte: number;
}

/**
 * Les 3 énigmes — verbatim (01-tableau-des-items : énoncé intégral, réponse
 * intuitive, réponse correcte ; ordre de passation = ordre source É1 → É2 → É3,
 * HORS contrat de mélange — difficulté croissante assumée, FM future).
 *
 * Format à choix multiple : l'option « réponse intuitive » du tableau, la
 * « réponse correcte », et une 3ᵉ option plausible construite avec les nombres
 * de l'énigme (É1 : le même rythme qu'à la montée · É2 : 5 h et 12,5 h ·
 * É3 : un décompte d'échelons oubliant que le bateau flotte).
 *
 * ORDRE DES OPTIONS — FIXE, documenté, SANS randomisation (le plan de mélange
 * ne porte pas sur les énigmes) : l'ordre ci-dessous est figé à la main et la
 * position de la bonne réponse varie d'une énigme à l'autre (É1 : index 2,
 * É2 : index 0, É3 : index 1) pour éviter un patron repérable. Toute évolution
 * passe par une Fiche de Mutation.
 */
const ENIGMES_FR: readonly Enigme16[] = [
  {
    code: "Q1.6-E1",
    enonce:
      "Léa gravit une colline à 6 km/h de moyenne. À quelle vitesse doit-elle redescendre le même chemin pour que sa moyenne aller-retour atteigne 12 km/h ?",
    options: [
      "18 km/h",
      "6 km/h",
      "C'est impossible — le temps de l'aller consomme déjà tout le budget de la moyenne",
    ],
    correcte: 2,
  },
  {
    code: "Q1.6-E2",
    enonce:
      "Une bougie de 40 cm brûle à 3 cm/h, une autre de 25 cm à 2 cm/h. Après combien d'heures la première est-elle deux fois plus haute que la seconde ?",
    options: ["10 heures", "5 heures", "12,5 heures"],
    correcte: 0,
  },
  {
    code: "Q1.6-E3",
    enonce:
      "Un bateau à quai : 6 échelons de son échelle dépassent de l'eau. La marée monte de 30 cm/h, les échelons sont espacés de 30 cm. Après 3 heures, combien d'échelons sont sous l'eau ?",
    options: [
      "3 de plus",
      "Aucun changement — le bateau flotte avec l'eau",
      "6 de plus",
    ],
    correcte: 1,
  },
];
export const ENIGMES = avecEN(ENIGMES_FR, EN_Q16.ENIGMES);

/** Le deck des énigmes : format 'question' + options, ordre source É1 → É2 → É3. */
export function deckEnigmes(): ItemPassation[] {
  return ENIGMES.map((e): ItemPassation => ({
    code: e.code,
    text: e.enonce,
    format: 'question',
    options: e.options,
  }));
}

export interface Score16 { traitement: number; enigmes: number; [k: string]: number }

/**
 * Scorer du Livrable (01-tableau-des-items) :
 *  - `traitement` : les 7 items Likert recodés (direct : (r − 1) / 4 · inversée :
 *    (6 − r − 1) / 4), moyenne 0-1 sur les items répondus ;
 *  - `enigmes` : les 3 énigmes répondues par INDEX d'option (1-based : valeur =
 *    index + 1) — nombre de bonnes réponses / 3 ∈ {0, 1/3, 2/3, 1}.
 * Le temps de réponse aux énigmes est capté côté moteur (fiabilité, pôle) :
 * il n'entre pas ici et n'est JAMAIS rendu. Les deux scores restent côté
 * moteur — jamais affichés comme une note.
 */
export function scorer(reponses: Record<string, number>): Score16 {
  let total = 0;
  let n = 0;
  for (const item of ITEMS) {
    const r = reponses[item.code];
    if (typeof r === 'number' && r >= 1 && r <= 5) {
      total += ((item.orient === 'D' ? r : 6 - r) - 1) / 4;
      n += 1;
    }
  }
  const traitement = n > 0 ? total / n : 0;
  let bonnes = 0;
  for (const e of ENIGMES) {
    const r = reponses[e.code];
    if (typeof r === 'number' && r >= 1 && r <= e.options.length && r - 1 === e.correcte) {
      bonnes += 1;
    }
  }
  return { traitement, enigmes: bonnes / ENIGMES.length };
}

export type VarianteId16 = 'V1' | 'V2' | 'V3' | 'V4' | 'V5';

/**
 * Sélection de la carte — conditions EXACTES du sélecteur D×E (cartes.yaml),
 * évaluées dans l'ordre 1 → 5 :
 *   V1 « L'Horloger·ère »        ← D ≥ 0.60 ET E ≥ 2/3
 *   V2 « Le Flair »              ← D < 0.40 ET E < 1/3
 *   V3 « Le Flair qui vérifie »  ← D < 0.40 ET E ≥ 2/3
 *   V4 « Le·La Prudent·e »       ← D ≥ 0.60 ET E ≤ 1/3
 *   V5 « Les Deux Mains »        ← tout le reste
 * D = pôle déclaratif analytique → score `traitement` (les 7 items) ;
 * E = énigmes résolues → score `enigmes` (bonnes / 3). Conversion des seuils :
 * E ≥ 2/3 ⇔ 2 ou 3 énigmes · E < 1/3 ⇔ 0 · E ≤ 1/3 ⇔ 0 ou 1.
 * NOTE MISSION : les conditions du YAML sont bidimensionnelles (sélecteur D×E,
 * confirmé au 00-README « Carte : 5 variantes, sélecteur D×E ») — les réduire
 * au seul `traitement` rendrait V1/V4 et V2/V3 indiscernables (conditions
 * identiques sans E). Les seuils EXACTS du YAML sont donc appliqués : D sur
 * `traitement`, E sur `enigmes`. Valeurs ADOPTÉES comme point de départ
 * (FM-019 — provisoire concepteur, re-signature avant bêta) ; seuils côté
 * moteur, jamais rendus à l'écran.
 */
export function choisirVariante(score: Score16): VarianteId16 {
  const d = score.traitement;
  const e = Math.round(score.enigmes * 3); // nombre d'énigmes résolues (0-3)
  return d >= 0.6 && e >= 2
    ? 'V1'
    : d < 0.4 && e === 0
      ? 'V2'
      : d < 0.4 && e >= 2
        ? 'V3'
        : d >= 0.6 && e <= 1
          ? 'V4'
          : 'V5';
}

export interface Carte {
  id: VarianteId16;
  nom: string;
  lumiere: string;
  ombre: string;
  tension: string;
}

/** Les 5 variantes de carte — verbatim (cartes.yaml, ordre du YAML = V1 → V5). */
export const CARTES: Record<VarianteId16, Carte> = {
  V1: {
    id: "V1",
    nom: "L'Horloger·ère",
    lumiere:
      "Tu démontes les problèmes pièce par pièce, et ça se voit : tes réponses comme tes affirmations tiennent debout. Chez toi, réfléchir n'est pas douter — c'est construire.",
    ombre:
      "Tout ne se démonte pas. Certaines choses — les gens, les envies, l'amour — se ressentent d'abord, se comprennent ensuite.",
    tension: "comprendre sans retirer la magie.",
  },
  V2: {
    id: "V2",
    nom: "Le Flair",
    lumiere:
      "Ta première impression est ta boussole, et souvent elle a raison. Tu décides avec le ventre, tu réussis avec le style. La lenteur de l'analyse t'endort — le vivant t'appelle.",
    ombre:
      "Les pièges qui demandent une seconde lecture te prennent parfois — parce que tu as déjà répondu.",
    tension: "faire confiance à ton flair sans le laisser seul.",
  },
  V3: {
    id: "V3",
    nom: "Le Flair qui vérifie",
    lumiere:
      "Tu dis suivre ton instinct — et pourtant, face aux pièges, tu as vérifié. Ton secret ? Un flair qui ne se croit pas infaillible. C'est la meilleure des combinaisons : tu ressens vite, tu confirmes sans te l'avouer.",
    ombre:
      "Le jour où tu te seras entièrement avoué(e) méthodique, tu seras redoutable.",
    tension: "rester rapide sans te mentir.",
  },
  V4: {
    id: "V4",
    nom: "Le·La Prudent·e",
    lumiere:
      "Tu pèses, tu vérifies, tu refuses de répondre trop vite — même aux questions qui en veulent. Ta prudence t'a évité plus d'erreurs qu'elle t'en a coûté de chances.",
    ombre:
      "Il y a des réponses simples déguisées en pièges — tu les regardes passer en cherchant la complication.",
    tension: "vérifier sans douter de tout.",
  },
  V5: {
    id: "V5",
    nom: "Les Deux Mains",
    lumiere:
      "Une main qui sent, une main qui mesure. Selon le terrain, tu changes d'outil — et c'est plus efficace que n'importe quelle doctrine. Tu es du genre à comprendre les deux camps : l'intuitif et l'analyste.",
    ombre:
      "Le risque des gens complets : ne pas devenir exceptionnel dans un seul geste.",
    tension: "choisir l'outil — et parfois s'y tenir.",
  },
};

/** Textes du briefing — annonce VERBATIM (05-ecran-d-intro), le reste en couche app. */
export const BRIEFING = {
  annonce:
    "Certains pensent avec leur flair, d'autres avec leur calcul. Les deux marchent — mais ils ne se comprennent pas toujours. De quel côté es-tu ?",
  aQuoiCaSert: [
    "Le Volant, c'est la conduite : cette quête regarde ta tête — comment l'information entre, comment la décision sort.",
    "Sept affirmations décrivent ta façon de traiter l'information : le flair, le ressenti, la vérification, les chiffres.",
    "Trois petites énigmes complètent le tableau : sans note, on regarde comment tu y vas, pas si tu trouves.",
    "Il en sort ta carte — ta façon de penser nourrit ensuite tout le reste du voyage.",
  ],
  resultats: [
    "Ta carte — ta lumière et ta zone d'ombre, en quelques mots.",
    "Ta tension intérieure — ce que tu cherches à tenir ensemble.",
    "Ton miroir — la lecture complète de ta façon de penser, à la prochaine étape du voyage.",
  ],
};

/** Textes de la fenêtre de complétion (carte) — même gabarit que la quête 1.1. */
export const COMPLETION = {
  entete: "🧭 QUÊTE ACCOMPLIE — « Ta façon de penser »",
  labelOmbre: "Ta zone d'ombre :",
  labelTension: "Ta tension intérieure :",
  fenetre:
    "Quelque part, quelqu'un répond à ces mêmes questions. Le jour où vos cartes se croiseront, elles auront beaucoup à se dire.",
  miroirNote:
    "Ton miroir — la lecture complète de ta façon de penser — arrive à la prochaine étape du voyage.",
};

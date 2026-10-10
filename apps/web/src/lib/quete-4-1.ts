/**
 * Quête 4.1 « Ton arbre relationnel » — Monde 5 « Ton Héritage ».
 *
 * Contenu FIDÈLE au Livrable M5-4.1-Ton-Arbre-Relationnel (branche
 * archive/v1) :
 *  - ITEMS : les 8 items Likert (verbatim 01-tableau-des-items, ordre du
 *    tableau) — 2 axes (climat 4 + loyautés 4), 4 paires R6 complètes ;
 *  - PASSATION : l'ordre de passation GELÉ (mélange RÉEL graine 241427,
 *    outil dédié melange-heritage.py v3, 5 passes identiques — 6/6
 *    contraintes PASS) ; les 2 trames ▲ hébergées du bloc invisible 4.4
 *    (Q4.4-T13 pos 5 · T14 pos 10 — FIS) sont des codes SANS formulation au
 *    dépôt (règle 11-b : contenu hors dépôt, document trames — le deck les
 *    saute, aucune formulation n'apparaît jamais à l'écran, elles n'entrent
 *    dans AUCUN score) ;
 *  - CARTES : les 5 variantes verbatim (cartes.yaml, charte C1-C11) ;
 *  - choisirVariante : la sélection VERBATIM du 07-miroir §0 (axe le plus
 *    dévié → 4 quadrants · max(dC, dL) ≤ 0.15 → central · départage dC = dL :
 *    l'axe climat tranche — partition exclusive + exhaustive, C6). Bornes
 *    0.15 FM-019 ADOPTÉES comme valeurs de départ (provisoires concepteur,
 *    re-signature professionnelle avant bêta) — jamais rendues ;
 *  - BRIEFING : l'annonce est verbatim (05-ecran-d-intro), les puces sont la
 *    couche app rédigée (ton Task 35) ;
 *  - LE GÉNOGRAMME INTERACTIF : modalité visuelle NON COMPTEE (Livrable) —
 *    structure libre (nœuds + qualifications libres), non scorée, retrait
 *    possible, jamais un arbre « bien fait ». Écran dédié APRÈS les 8 items
 *    (code de flux Q4.1-arbre — jamais dans les scores). Les figures
 *    sérialisées restent sur l'appareil (textes — même traitement que la
 *    ligne libre 2.3) : elles ne se rendent JAMAIS (aucune carte, aucun
 *    miroir, aucun match).
 *
 * NEUTRALITÉ ABSOLUE DES ORIGINES (doctrine capitale du Livrable) : les cinq
 * façons d'avoir grandi se valent — le climat deviné n'est pas un climat
 * raté, l'héritage pesant n'est pas une immaturité, la voix tenue n'est pas
 * une réparation. ZÉRO BLÂME PARENTAL (interdit V10) : aucun énoncé ne blâme
 * un parent — un climat raconté, pas un procès. La différenciation n'est
 * jamais une « maturité » : le rendu parle d'images (la table, la voix, la
 * place tenue), jamais de vocabulaire clinique.
 *
 * Moteur (côté score, jamais rendu) : CLIMAT_D = moyenne des 4 items climat
 * (I recodés 6 − r) normalisée 0-1 (haut = climat nommé) · LOYAUTE_D = idem
 * (haut = loyautés pesantes). Ils choisissent la variante (cartes.yaml,
 * canal carte). Les 2 trames FIS hébergées alimentent la variable FIS du
 * bloc 4.4 côté moteur (matrices de pièges — croisement FIS × attachement) :
 * JAMAIS au rendu, jamais au match, jamais au premium — et, le dépôt ne
 * portant AUCUNE formulation, jamais calculées non plus dans cette app.
 *
 * Typo : apostrophe ASCII uniquement, guillemets français. Règles : aucun
 * code, score, sigle ou seuil ne franchit le rendu ; phrases ≤ 22 mots.
 */

import { avecEN } from '../i18n/apply';
import * as EN_Q41 from '../i18n/content/en/quete-4-1';

export interface QueteItem41 {
  code: string;
  text: string;
  /** 'D' = directe, 'I' = inversée (recodée 6 − r). */
  orient: 'D' | 'I';
  /** L'axe verbatim du tableau 01 — climat (4) · loyautés (4). */
  dim: 'climat' | 'loyautés';
}

/** L'objet de passation affiché — code + énoncé (l'orientation reste côté moteur). */
export interface ItemsQuete41 {
  code: string;
  text: string;
}

/** Code de flux de l'écran génogramme (non scoré — hors PASSATION). */
export const ARBRE_CODE = 'Q4.1-arbre';

/** Les 8 items — verbatim (01-tableau-des-items, ordre du tableau). */
const ITEMS_FR: readonly QueteItem41[] = [
  {
    code: "Q4.1-01",
    text: "Chez moi, les émotions se disaient à voix haute.",
    orient: "D",
    dim: "climat",
  },
  {
    code: "Q4.1-02",
    text: "Chez moi, les émotions se devinaient plus qu'elles ne se disaient.",
    orient: "I",
    dim: "climat",
  },
  {
    code: "Q4.1-03",
    text: "Un désaccord chez nous se nommait et se réparait.",
    orient: "D",
    dim: "climat",
  },
  {
    code: "Q4.1-04",
    text: "Les tensions duraient, sans mot pour les clore.",
    orient: "I",
    dim: "climat",
  },
  {
    code: "Q4.1-05",
    text: "Je tiens encore le rôle qu'on m'a confié très tôt.",
    orient: "D",
    dim: "loyautés",
  },
  {
    code: "Q4.1-06",
    text: "Mes rôles d'aujourd'hui ressemblent à des choix, pas des héritages.",
    orient: "I",
    dim: "loyautés",
  },
  {
    code: "Q4.1-07",
    text: "La paix de la famille passe avant ce que je pense.",
    orient: "D",
    dim: "loyautés",
  },
  {
    code: "Q4.1-08",
    text: "Mon avis compte autant que la paix du groupe.",
    orient: "I",
    dim: "loyautés",
  },
];
export const ITEMS = avecEN(ITEMS_FR, EN_Q41.ITEMS);

/** Ordre de passation GELÉ — mélange RÉEL graine 241427 (02-plan-de-melange ;
 *  le 1ᵉʳ item vu est Q4.1-05, le dernier Q4.4-T14 — JAMAIS l'ordre des codes).
 *  Les 2 trames hébergées du bloc 4.4 (Q4.4-T13/T14) occupent les positions
 *  5 · 10 — ancrées par construction (c3). AUCUNE formulation au dépôt
 *  (règle 11-b) : le deck les saute, elles n'entrent dans AUCUN score. */
export const PASSATION: readonly string[] = [
  "Q4.1-05",
  "Q4.1-02",
  "Q4.1-07",
  "Q4.1-04",
  "Q4.4-T13",
  "Q4.1-06",
  "Q4.1-03",
  "Q4.1-08",
  "Q4.1-01",
  "Q4.4-T14",
];

const PAR_CODE = new Map(ITEMS.map((i) => [i.code, i]));

/** Le deck réel : les 8 items dans l'ordre gelé — les trames hébergées
 *  (Q4.4-T13/T14, sans formulation au dépôt) sautent sans jamais s'afficher. */
export function deckQuete(): ItemsQuete41[] {
  return PASSATION.flatMap((c) => {
    const it = PAR_CODE.get(c);
    return it ? [{ code: it.code, text: it.text }] : [];
  });
}

/** Likert 1-5 → 0-1 (inversées recodées 6 − r — Arbitrage 1). */
function contribution(reponse: number, orient: 'D' | 'I'): number {
  return ((orient === 'D' ? reponse : 6 - reponse) - 1) / 4;
}

export interface Score41 {
  /** Le climat de l'origine — moyenne des 4 items climat (I recodés),
   *  normalisée 0-1 (CLIMAT_D côté moteur : haut = climat nommé). */
  climat: number;
  /** Le poids des héritages — moyenne des 4 items loyautés (I recodés),
   *  normalisée 0-1 (LOYAUTE_D côté moteur : haut = loyautés pesantes). */
  loyautes: number;
  /** Signature d'index (contracte du registre : Record<string, number>) —
   *  aucun score par angle supplémentaire n'y entre. */
  [dim: string]: number;
}

/** Scorer du Livrable : deux scores d'axe (moyennes des contributions
 *  recodées) — ils choisissent la variante (cartes.yaml). Les trames
 *  hébergées (Q4.4-T13/T14) n'y entrent JAMAIS ; la part FIS du bloc 4.4
 *  reste moteur seul (matrices), jamais rendue. */
export function scorer(reponses: Record<string, number>): Score41 {
  const parAxe = new Map<string, { total: number; n: number }>();
  for (const code of PASSATION) {
    const it = PAR_CODE.get(code);
    const r = it ? reponses[it.code] : undefined;
    if (it && typeof r === 'number' && r >= 1 && r <= 5) {
      const c = contribution(r, it.orient);
      const bloc = parAxe.get(it.dim) ?? { total: 0, n: 0 };
      bloc.total += c;
      bloc.n += 1;
      parAxe.set(it.dim, bloc);
    }
  }
  const axe = (dim: string): number => {
    const bloc = parAxe.get(dim);
    return bloc && bloc.n > 0 ? bloc.total / bloc.n : 0;
  };
  return { climat: axe('climat'), loyautes: axe('loyautés') };
}

/** Les 5 variantes — ids VERBATIM (cartes.yaml). */
export type VarianteId41 =
  | 'CARTE-4.1-TABLE-QUI-DIT'
  | 'CARTE-4.1-ROLE-LUMIERE'
  | 'CARTE-4.1-LECTEUR-SILENCES'
  | 'CARTE-4.1-PLACE-HERITEE'
  | 'CARTE-4.1-SELON-LA-TABLE';

/**
 * Sélecteur VERBATIM (07-miroir §0 + cartes.yaml — partition exclusive +
 * exhaustive de [0,1]², C6) : dC = |climat − 0.5| · dL = |loyautés − 0.5| ;
 * max(dC, dL) ≤ 0.15 → central (SELON-LA-TABLE) ; sinon l'axe le plus dévié
 * choisit le quadrant (départage dC = dL : l'axe climat tranche). Bornes
 * 0.15 FM-019 ADOPTÉES (provisoires concepteur — re-signature avant bêta) :
 * métadonnées moteur, jamais affichées. La part FIS ne participe JAMAIS à la
 * sélection ni au rendu.
 */
export function choisirVariante(score: Score41): VarianteId41 {
  const climat = typeof score.climat === 'number' ? score.climat : 0;
  const loyautes = typeof score.loyautes === 'number' ? score.loyautes : 0;
  const dC = Math.abs(climat - 0.5);
  const dL = Math.abs(loyautes - 0.5);
  if (Math.max(dC, dL) <= 0.15) return 'CARTE-4.1-SELON-LA-TABLE';
  if (dC >= dL) return climat > 0.5 ? 'CARTE-4.1-TABLE-QUI-DIT' : 'CARTE-4.1-LECTEUR-SILENCES';
  return loyautes > 0.5 ? 'CARTE-4.1-ROLE-LUMIERE' : 'CARTE-4.1-PLACE-HERITEE';
}

export interface Carte {
  id: VarianteId41;
  nom: string;
  lumiere: string;
  ombre: string;
  tension: string;
}

/** Les 5 variantes de carte — verbatim (cartes.yaml, ordre du YAML :
 *  portrait → lumiere, tension_interieure → tension). NEUTRALITÉ DES
 *  ORIGINES : les cinq façons d'avoir grandi se valent (C4 — aucun
 *  superlatif, aucune origine dressée en idéal). ZÉRO blâme parental. */
export const CARTES: Record<VarianteId41, Carte> = {
  "CARTE-4.1-TABLE-QUI-DIT": {
    id: "CARTE-4.1-TABLE-QUI-DIT",
    nom: "Le·La Table où ça se dit",
    lumiere:
      "Chez toi, les mots circulaient — les émotions se disaient, les désaccords se réparaient. Et ta voix à toi tient : elle compte autant que la paix du groupe. Tu viens d'une table où parler était normal, et tu y as gardé ta place.",
    ombre:
      "Là où tout se dit, tout s'attend à une réponse vite. Un partenaire qui digère en silence peut te sembler un mur — et ton attente lui peser.",
    tension: "garder ta table chaleureuse, en laissant à l'autre le temps de ses mots.",
  },
  "CARTE-4.1-ROLE-LUMIERE": {
    id: "CARTE-4.1-ROLE-LUMIERE",
    nom: "Le·La Rôle dans la lumière",
    lumiere:
      "Tout se disait chez toi — et tu as tôt tenu le rôle qu'on t'a confié. Tu sais porter une place, une attention, une fiabilité que les tiens reconnaissent. La table parlait, et toi tu tenais la maison.",
    ombre:
      "Le rôle tenu tôt devient un habit qui ne s'enlève plus. En couple, tu risques d'assumer tout et de ne rien demander — la fatigue du fiable se cache bien.",
    tension: "nommer une chose que tu ne portes plus — la table tient sans ça.",
  },
  "CARTE-4.1-LECTEUR-SILENCES": {
    id: "CARTE-4.1-LECTEUR-SILENCES",
    nom: "Le·La Lecteur de silences",
    lumiere:
      "Chez toi, l'essentiel se devinait plus qu'il ne se disait — tu as appris à lire une maison. Et ton avis compte autant que la paix du groupe : tu sais où tu vas sans avoir besoin qu'on le nomme.",
    ombre:
      "Celui qui a appris à deviner devine encore. Un regard devient un reproche, une pause devient une décision — et l'autre se sent compris avant d'avoir parlé.",
    tension: "poser ta lecture en question — pas en verdict — la réponse appartient à l'autre.",
  },
  "CARTE-4.1-PLACE-HERITEE": {
    id: "CARTE-4.1-PLACE-HERITEE",
    nom: "Le·La Place héritée",
    lumiere:
      "Tu as appris tôt à lire une maison et à la porter à la fois — la place qu'il fallait tenir, tu l'as tenue. La paix du groupe passe souvent avant ton avis : une fidélité profonde qui garde debout ce qui compte.",
    ombre:
      "La place tenue tôt pèse en silence. En couple, l'attente se déplace : l'autre devient la table qu'on ne veut pas troubler — et ton avis s'accumule.",
    tension: "dire une chose que tu penses et que tu n'as pas dite — la paix y gagne d'être vraie.",
  },
  "CARTE-4.1-SELON-LA-TABLE": {
    id: "CARTE-4.1-SELON-LA-TABLE",
    nom: "Le·La Selon la table",
    lumiere:
      "Ton origine ne vote ni silence ni parole, ni rôle ni voix : selon les maisons et les années, tu t'adaptes. Tu dis quand c'est juste, tu devines quand c'est utile, tu tiens quand il faut.",
    ombre:
      "La souplesse se lit mal de dehors : le partenaire cherche ta règle du moment. Elle existe — elle se devine mal, et l'attente peut peser.",
    tension: "donner un mot de ta règle du moment — l'autre y trouve la porte.",
  },
};

/** Textes du briefing — annonce VERBATIM (05-ecran-d-intro, 2 phrases), puces
 *  en couche app (ton Task 35, zéro blâme, neutralité des origines). */
export const BRIEFING = {
  annonce:
    "Ta famille t'a appris des choses sans le savoir — des ambiances, des places, des réflexes. Ici, tu les regardes avec bienveillance, sans tribunal.",
  aQuoiCaSert: [
    "C'est la première quête de ton héritage : l'ambiance et les places de ta petite enfance, racontées sans tribunal.",
    "Huit affirmations, deux lectures : ce qui se disait chez toi, et les rôles tenus très tôt.",
    "Aucun énoncé ne blâme personne : un climat se raconte, il ne se juge pas.",
    "À la fin, une carte — et un arbre à poser si tu veux : une conversation avec toi-même, jamais un arbre « bien fait ».",
  ],
  resultats: [
    "Ta carte — ta lumière, ta zone d'ombre et ta tension du moment, en quelques mots.",
    "Deux barres — le climat de ton origine et le poids des héritages, tels que tu les as vécus.",
    "Ton arbre relationnel, si tu le poses : une conversation avec toi-même, jamais notée.",
    "Une pierre de plus dans ton portrait — la suite du voyage s'en nourrit.",
  ],
};

/** L'écran génogramme (modalité NON COMPTEE du Livrable) — structure libre :
 *  des figures avec un mot à toi et une qualification libre, ajoutées et
 *  retirées à volonté. Non scoré, jamais rendu hors de cet écran, jamais un
 *  arbre « bien fait ». Retrait possible à tout instant. */
const ARBRE_FR = {
  titre: "Ton arbre, en quelques figures — si tu veux.",
  note: "Aucune personne à nommer obligatoirement : des figures, des mots à toi. Cet écran n'est pas noté — il reste chez toi.",
  champLabel: "Une figure — une personne, une maison, un silence…",
  qualifications: ["Proche", "Fusionnel", "Distance"],
  ajouter: "Poser cette figure",
  retirer: "Retirer",
  continuer: "Continuer",
  passer: "Passer cet écran",
  noteFin: "Tu pourras y revenir : rien n'est fixé, rien n'est noté.",
};
export const ARBRE = avecEN(ARBRE_FR, EN_Q41.ARBRE);

/** Sérialisation locale des figures (textes — même traitement que la ligne
 *  libre 2.3 : sur l'appareil, jamais rendue hors de l'écran arbre). */
export function serialiserArbre(figures: ReadonlyArray<{ label: string; qualif: string }>): string {
  return figures
    .filter((f) => f.label.trim().length > 0 || f.qualif.trim().length > 0)
    .map((f) => `${f.label.trim()}::${f.qualif.trim()}`)
    .join("|")
    .slice(0, 500);
}

/** Désérialisation locale (reprise d'écran) — l'inverse sûr : toute entrée
 *  malformée est ignorée, aucun contenu n'est réinterprété. */
export function deserialiserArbre(brut: string): { label: string; qualif: string }[] {
  if (!brut || typeof brut !== 'string') return [];
  return brut
    .split("|")
    .slice(0, 20)
    .map((morceau) => {
      const i = morceau.indexOf('::');
      if (i < 0) return { label: morceau.slice(0, 120), qualif: '' };
      return { label: morceau.slice(0, i).slice(0, 120), qualif: morceau.slice(i + 2).slice(0, 60) };
    })
    .filter((f) => f.label.length > 0 || f.qualif.length > 0);
}

/** Textes de la fenêtre de complétion (carte) — entête, labels verbatim
 *  (cartes.yaml), fenêtre F1 verbatim, miroirNote en couche app. */
export const COMPLETION = {
  entete: "🌳 QUÊTE ACCOMPLIE — « Ton arbre relationnel »",
  labelOmbre: "Ta zone d'ombre :",
  labelTension: "Ta tension intérieure :",
  fenetre:
    "Quelque part, quelqu'un construit son arbre aussi. Le jour où vos cartes se croiseront, elles auront beaucoup à se dire.",
  miroirNote:
    "Ton miroir — la lecture complète de ton arbre — arrive à la prochaine étape du voyage.",
};

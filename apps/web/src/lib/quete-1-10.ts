/**
 * Quête 1.10 « Ce que tu apportes » — Monde 2 « Le Volant ».
 *
 * Contenu FIDÈLE au Livrable M2-1.10-Ce-Que-Tu-Apportes (branche archive/v1-2026-10-05) :
 *  - ITEMS : les 10 énoncés comportementaux (verbatim 01-tableau-des-items, ordre du
 *    tableau) — 5 dimensions × 2, paires miroir (1 directe + 1 inversée par dimension) ;
 *    AUCUNE trame dans cette quête (verifié au registre) ;
 *  - PASSATION : l'ordre de passation GELÉ (mélange graine 220427, 02-plan-de-melange) ;
 *  - CARTES : les 3 variantes verbatim (cartes.yaml) — La Balise / L'Échelle / La Rocade,
 *    ordre sélecteur 1 → 3 ;
 *  - choisirVariante : la partition verbatim de la contribution (cartes.yaml), évaluée
 *    dans l'ordre du YAML : > 0.65 → V1 · 0.35-0.65 → V2 · < 0.35 → V3 (bornes FM-019,
 *    provisoires concepteur) ;
 *  - BRIEFING.annonce : verbatim (05-ecran-d-intro) — le reste du briefing est la
 *    couche app rédigée (ton Task 35).
 *
 * Mapping clés (SANS accent) ↔ noms de dimensions du Livrable :
 *  - 'presence'   ↔ « fiabilité de présence »      (items 01-02, 1 D + 1 I) ;
 *  - 'reparation' ↔ « capacité de réparation »     (items 03-04) ;
 *  - 'compromis'  ↔ « ouverture au compromis »     (items 05-06) ;
 *  - 'torts'      ↔ « reconnaissance des torts »   (items 07-08) ;
 *  - 'soutien'    ↔ « soutien actif sans demande » (items 09-10).
 *
 * RÈGLES (rendu écran) : l'anti auto-flatterie du Livrable vaut aussi au rendu —
 * des comportements, jamais des qualités ; JAMAIS de code ni de sigle à l'écran
 * (codes Q1.10-…, paires miroir, R6, CONTRIB_D, SIG_CONTRIB, BIDR — ils ne vivent
 * que dans ces commentaires et dans le moteur) ; apostrophes ASCII.
 *
 * RECONSTITUTION (7ᵉ reset sandbox) : contenu extrait des fichiers du Livrable
 * (/tmp/m2-livrables/Livrable des mondes/M2-1.10-Ce-Que-Tu-Apportes).
 */

/** Un item de la quête 1.10 — 'D' = direct, 'I' = inversé (recodé 6 − r). */
import { avecEN } from '../i18n/apply';
import * as EN_Q110 from '../i18n/content/en/quete-1-10';

export interface QueteItem110 {
  code: string;
  text: string;
  orient: 'D' | 'I';
  dim: 'presence' | 'reparation' | 'compromis' | 'torts' | 'soutien';
}

/** Les 10 items — verbatim (01-tableau-des-items, ordre du tableau). */
const ITEMS_FR: readonly QueteItem110[] = [
  {
    code: "Q1.10-01",
    text: "Quand je dis que je serai là, j'y suis.",
    orient: "D",
    dim: "presence",
  },
  {
    code: "Q1.10-02",
    text: "Il m'arrive de disparaître quelques jours sans donner de nouvelles.",
    orient: "I",
    dim: "presence",
  },
  {
    code: "Q1.10-03",
    text: "Après une dispute, je reprends contact le premier.",
    orient: "D",
    dim: "reparation",
  },
  {
    code: "Q1.10-04",
    text: "Après une dispute, j'attends que l'autre revienne.",
    orient: "I",
    dim: "reparation",
  },
  {
    code: "Q1.10-05",
    text: "Quand nos envies divergent, je cherche ce qui nous arrange.",
    orient: "D",
    dim: "compromis",
  },
  {
    code: "Q1.10-06",
    text: "Quand nos envies divergent, c'est souvent moi qui tiens la ligne.",
    orient: "I",
    dim: "compromis",
  },
  {
    code: "Q1.10-07",
    text: "Quand je me trompe, je le dis sans détour le jour même.",
    orient: "D",
    dim: "torts",
  },
  {
    code: "Q1.10-08",
    text: "Mes torts, je les avoue surtout quand on me les prouve.",
    orient: "I",
    dim: "torts",
  },
  {
    code: "Q1.10-09",
    text: "Je remarque la fatigue des gens avant qu'ils la disent.",
    orient: "D",
    dim: "soutien",
  },
  {
    code: "Q1.10-10",
    text: "J'aide quand on me demande, rarement avant.",
    orient: "I",
    dim: "soutien",
  },
];
export const ITEMS = avecEN(ITEMS_FR, EN_Q110.ITEMS);

/** Ordre de passation GELÉ — mélange graine 220427 (10 positions, aucune trame). */
export const PASSATION: readonly string[] = [
  "Q1.10-10",
  "Q1.10-03",
  "Q1.10-02",
  "Q1.10-05",
  "Q1.10-08",
  "Q1.10-04",
  "Q1.10-09",
  "Q1.10-06",
  "Q1.10-07",
  "Q1.10-01",
];

/** Le deck réel : les items dans l'ordre gelé de la passation. */
export function deckQuete(): QueteItem110[] {
  const parCode = new Map(ITEMS.map((i) => [i.code, i]));
  return PASSATION.flatMap((c) => {
    const it = parCode.get(c);
    return it ? [it] : [];
  });
}

const DIMS = ['presence', 'reparation', 'compromis', 'torts', 'soutien'] as const;

export type Dim110 = (typeof DIMS)[number];

/** Likert 1-5 → 0-1 (inversées recodées 6 − r), puis moyenne par dimension. */
function contribution(reponse: number, orient: 'D' | 'I'): number {
  return ((orient === 'D' ? reponse : 6 - reponse) - 1) / 4;
}

export interface Score110 {
  presence: number;
  reparation: number;
  compromis: number;
  torts: number;
  soutien: number;
  /** Moyenne des 5 dimensions — « C: contribution → score de quête » (01-tableau). */
  contribution: number;
  [k: string]: number;
}

/** Scorer du Livrable : moyenne 0-1 par dimension + la contribution (score de quête). */
export function scorer(reponses: Record<string, number>): Score110 {
  const acc: Record<Dim110, { total: number; n: number }> = {
    presence: { total: 0, n: 0 },
    reparation: { total: 0, n: 0 },
    compromis: { total: 0, n: 0 },
    torts: { total: 0, n: 0 },
    soutien: { total: 0, n: 0 },
  };
  for (const item of ITEMS) {
    const r = reponses[item.code];
    if (typeof r === 'number' && r >= 1 && r <= 5) {
      acc[item.dim].total += contribution(r, item.orient);
      acc[item.dim].n += 1;
    }
  }
  const moy = (d: Dim110): number => (acc[d].n > 0 ? acc[d].total / acc[d].n : 0);
  return {
    presence: moy('presence'),
    reparation: moy('reparation'),
    compromis: moy('compromis'),
    torts: moy('torts'),
    soutien: moy('soutien'),
    contribution:
      (moy('presence') + moy('reparation') + moy('compromis') + moy('torts') + moy('soutien')) / 5,
  };
}

export type VarianteId110 = 'V1' | 'V2' | 'V3';

/** Sélecteur VERBATIM (cartes.yaml), évalué dans l'ordre du YAML (V1 en premier) :
 *  contribution > 0.65 → La Balise · 0.35-0.65 → L'Échelle · < 0.35 → La Rocade. */
export function choisirVariante(s: Score110): VarianteId110 {
  return s.contribution > 0.65
    ? 'V1'
    : s.contribution >= 0.35
      ? 'V2'
      : 'V3';
}

export interface Carte {
  id: VarianteId110;
  nom: string;
  lumiere: string;
  ombre: string;
  tension: string;
}

/** Les 3 variantes de carte — verbatim (cartes.yaml) : portrait → lumiere,
 *  zone d'ombre → ombre, tension intérieure → tension. */
export const CARTES: Record<VarianteId110, Carte> = {
  V1: {
    id: "V1",
    nom: "La Balise",
    lumiere: "Tu es la personne qui revient : le premier contact après la dispute, la réponse arrivée avant la demande, le tort reconnu le jour même. Ce que tu offres se voit, se vérifie, et tient une table à deux.",
    ombre: "Une balise qui brille pour les autres éclaire parfois peu son propre chemin — et donner peut devenir la seule façon que tu tolères d'être aimé·e.",
    tension: "donner fort, sans y perdre ta place de personne qui reçoit aussi.",
  },
  V2: {
    id: "V2",
    nom: "L'Échelle",
    lumiere: "Tu donnes et tu reçois : tu cherches ce qui arrange les deux, tu admets tes torts, tu aides selon le jour. Rien de spectaculaire — un équilibre qui se vérifie en marchant, pas en annonçant.",
    ombre: "L'équilibre peut glisser vers le compte exact : rendre chaque effort, mesurer chaque geste — et le lien devient un livre où l'on note plus qu'on ne s'offre.",
    tension: "garder le cap du donnant-donnant, sans transformer l'autre en débiteur.",
  },
  V3: {
    id: "V3",
    nom: "La Rocade",
    lumiere: "Tu sais ce que tu attends des gens et tu le demandes sans détour. Ton côté du chemin est bien entretenu — tu sais où tu veux aller, et ça a de la clarté.",
    ombre: "La rocade évite le centre : à force de recevoir plus que tu n'offres, les gens finissent par emprunter un autre chemin — et le silence qui suit coûte ce que tu croyais gagner.",
    tension: "demander ce dont tu as besoin, en commençant par poser la première pierre.",
  },
};

/** Annonce : verbatim (05-ecran-d-intro). aQuoiCaSert / resultats : couche app. */
export const BRIEFING = {
  annonce:
    "La suite n'est pas ce que tu cherches — c'est ce que tu apportes. Réponds avec honnêteté : les faiblesses déclarées ici valent de l'or pour ta recherche.",
  aQuoiCaSert: [
    "Cette quête regarde ce que tu offres dans un lien : être là, revenir après une dispute, chercher l'accord, avouer, aider.",
    "Chaque phrase décrit un comportement, jamais une qualité : tu réponds sur ce que tu fais — pas sur ce que tu es.",
    "L'honnêteté sert ta recherche : ce que tu déclares ici aide l'app à te croiser avec justesse.",
    "Il en sort ta carte — ta façon d'apporter, avec sa lumière et sa zone d'ombre.",
  ],
  resultats: [
    "Ta carte — ce que tu apportes, avec ta lumière et ta zone d'ombre.",
    "Ta tension intérieure — ce que tu cherches à tenir ensemble.",
    "Ton miroir — ta contribution renvoyée en toutes lettres, avec un mode d'emploi concret.",
  ],
};

/** Textes de la fenêtre de complétion (carte) — gabarit 1.1, entête verbatim cartes.yaml. */
export const COMPLETION = {
  entete: "🧭 QUÊTE ACCOMPLIE — « Ce que tu apportes »",
  labelOmbre: "Ta zone d'ombre :",
  labelTension: "Ta tension intérieure :",
  fenetre: "Quelque part, quelqu'un répond à ces mêmes questions. Le jour où vos cartes se croiseront, elles auront beaucoup à se dire.",
  miroirNote: "Ton miroir — la lecture complète de ta contribution — arrive à la prochaine étape du voyage.",
};

/**
 * Quête 1.5 « L'épreuve du temps » — Monde 2 « Le Volant ».
 *
 * TÂCHE COMPORTEMENTALE (NON-Likert) : 6 choix binaires A (immédiat) / B (différé).
 *
 * Contenu FIDÈLE au Livrable M2-1.5-Lepreuve-du-Temps (branche archive/v1-2026-10-05) :
 *  - CHOIX : les 6 binômes VERBATIM (01-tableau-des-choix, codes gelés Q1.5-C1 → C6),
 *    ordre canonique C1 → C6 (02-ordre-canonique — mélange SANS OBJET, documenté :
 *    une seule métrique, aucune trame, aucune orientation D/I) ;
 *  - SCORING : chaque A = +1 impulsivité comportementale — IMP_B = n_A / 6 ∈ [0,1],
 *    AC_B = 1 − IMP_B (00-README, fiche de cadrage) ;
 *  - CARTES : les 5 variantes VERBATIM (cartes.yaml, étage 1, charte C1-C11) ;
 *  - BRIEFING : annonce VERBATIM (05-ecran-d-intro — « hypothétiques assumés »
 *    posés sans détour) ; le reste des textes est la couche app rédigée.
 *
 * MAPPING DES VARIANTES (cartes.yaml — ordre_selecteur 1 → 5 = V1 → V5 ; chaque
 * condition y est nommée sur la variable c = nombre de choix B différés = 6 − n_A) :
 *   V1 « Le·La Main qui cueille »         ← c = 0  (les six en A — le pôle le plus immédiat)
 *   V2 « Le·La Vague qui frappe »         ← c ∈ {1, 2}
 *   V3 « Le·La Funambule du temps »       ← c ∈ {3, 4}
 *   V4 « Le·La Jardinier·se des saisons » ← c = 5  (une seule main immédiate)
 *   V5 « Le·La Vin qui se garde »         ← c = 6  (les six en B — le pôle le plus différé)
 * La partition {0} · {1,2} · {3,4} · {5} · {6} est exclusive + exhaustive (C6 vérifié).
 *
 * RÈGLES DU LIVRABLE : neutralité absolue (chaque binôme équivalent en valeur
 * perçue — ni le piège dérisoire ni la vertu embellie), zéro jugement du résultat
 * (céder n'est pas faible, attendre n'est pas mûr), temps de réponse mesuré mais
 * JAMAIS affiché, aucun code/sigle rendu (IMP_B/AC_B restent côté moteur),
 * apostrophes ASCII uniquement.
 */
import type { ItemPassation } from './quetes';
import { avecEN } from '../i18n/apply';
import * as EN_Q15 from '../i18n/content/en/quete-1-5';

export interface ChoixBinaire15 {
  code: string;
  /** La question-cadre — verbatim (01-tableau-des-choix). */
  cadre: string;
  /** Le choix A (immédiat) — verbatim. */
  choixA: string;
  /** Le choix B (différé) — verbatim. */
  choixB: string;
}

/** Les 6 binômes — verbatim, ordre canonique C1 → C6 (02-ordre-canonique, figé). */
const CHOIX_FR: readonly ChoixBinaire15[] = [
  {
    code: "Q1.5-C1",
    cadre: "Un argent qui t'est dû arrive.",
    // Montants du Livrable en base EUR — jetons {m:N} interpolés au rendu
    // dans la devise de l'utilisateur (i18n/currency.ts — 120 → 78 500 FCFA,
    // $130, £105…) ; FR+EUR affiche exactement « 120 € » / « 200 € ».
    choixA: "Tu le reçois ce soir : {m:120} sur ton compte.",
    choixB: "Tu le reçois dans six semaines : {m:200} sur ton compte.",
  },
  {
    code: "Q1.5-C2",
    cadre: "Tu as enfin repéré le fauteuil.",
    choixA: "Tu le commandes aujourd'hui, plein tarif, livré demain.",
    choixB: "Tu l'attends trois semaines, à prix réduit, livraison comprise.",
  },
  {
    code: "Q1.5-C3",
    cadre: "Tu cherches où vivre.",
    choixA: "Le premier appartement correct : tu signes ce mois-ci.",
    choixB: "Celui que tu préfères vraiment : tu patientes deux mois.",
  },
  {
    code: "Q1.5-C4",
    cadre: "Ton temps libre se libère.",
    choixA: "Une rencontre très belle, ce week-end, sans en savoir plus.",
    choixB: "La même personne, vue dans dix jours, après un vrai échange.",
  },
  {
    code: "Q1.5-C5",
    cadre: "Ton cœur reçoit deux invitations.",
    choixA: "Le dîner qui te réchauffe ce soir, chez quelqu'un que tu connais.",
    choixB: "Le démarrage plus lent avec quelqu'un de neuf, à construire.",
  },
  {
    code: "Q1.5-C6",
    cadre: "Une histoire commence.",
    choixA: "Le coup de foudre qui t'emporte, tout de suite.",
    choixB: "La rencontre qui s'installe doucement, dans quelques semaines.",
  },
];
export const CHOIX = avecEN(CHOIX_FR, EN_Q15.CHOIX);

/** Le deck de passation : un choix par écran, dans l'ordre canonique (pas de mélange). */
export function deckChoix(): ItemPassation[] {
  return CHOIX.map((c): ItemPassation => ({
    code: c.code,
    text: c.cadre,
    format: 'choix',
    choixA: c.choixA,
    choixB: c.choixB,
  }));
}

export interface Score15 { IMP_B: number; AC_B: number; [k: string]: number }

/**
 * Scorer du Livrable (00-README) : les réponses valent 1 (A, immédiat) ou 2
 * (B, différé). n_A = nombre de réponses === 1 · IMP_B = n_A / 6 · AC_B = 1 − IMP_B.
 * Aucune « bonne réponse » : le score décrit un rapport au temps, il ne note rien.
 */
export function scorer(reponses: Record<string, number>): Score15 {
  const n_A = CHOIX.reduce((acc, c) => (reponses[c.code] === 1 ? acc + 1 : acc), 0);
  const IMP_B = n_A / 6;
  return { IMP_B, AC_B: 1 - IMP_B };
}

export type VarianteId15 = 'V1' | 'V2' | 'V3' | 'V4' | 'V5';

/**
 * Sélection de la carte (cartes.yaml) — par le nombre de choix différés
 * c = nombre de B = 6 − n_A (n_A = IMP_B × 6, arrondi au plus proche) :
 *   c = 0 → 'V1' · c ∈ {1,2} → 'V2' · c ∈ {3,4} → 'V3' · c = 5 → 'V4' · c = 6 → 'V5'.
 * V1 est la variante la plus impulsive (les six choix en A), V5 la plus différée.
 * Le temps de réponse ne participe JAMAIS à la sélection (signal moteur seul).
 */
export function choisirVariante(score: Score15): VarianteId15 {
  const n_A = Math.round(score.IMP_B * 6);
  const c = 6 - n_A;
  if (c <= 0) return 'V1';
  if (c <= 2) return 'V2';
  if (c <= 4) return 'V3';
  if (c <= 5) return 'V4';
  return 'V5';
}

export interface Carte {
  id: VarianteId15;
  nom: string;
  lumiere: string;
  ombre: string;
  tension: string;
}

/** Les 5 variantes de carte — verbatim (cartes.yaml, ordre du YAML). */
export const CARTES: Record<VarianteId15, Carte> = {
  V1: {
    id: "V1",
    nom: "Le·La Main qui cueille",
    lumiere:
      "Tu prends la vie au moment où elle tend la main : l'argent de ce soir, le dîner chaud, la rencontre sans délai. Ton présent est un endroit où on se sent accueilli, et ça se lit dès la première conversation.",
    ombre:
      "Cueillir tout de suite laisse parfois des projets sans taille ni garde — et quelqu'un, à deux, attend encore le plan promis.",
    tension: "cueillir l'instant, sans en faire une dette pour plus tard.",
  },
  V2: {
    id: "V2",
    nom: "Le·La Vague qui frappe",
    lumiere:
      "Ton élan choisit vite et fort : la belle rencontre ce week-end, l'appartement signé sans tarder. Les histoires avec toi commencent tôt — et ça lance les choses que d'autres laissent attendre.",
    ombre:
      "La vague qui frappe entraîne aussi les décisions à chaud — et l'autre suit parfois un cap qui change en une semaine.",
    tension: "garder l'élan, en lui ajoutant une nuit quand quelqu'un d'autre embarque.",
  },
  V3: {
    id: "V3",
    nom: "Le·La Funambule du temps",
    lumiere:
      "Tu marches sur le fil entre cueillir et attendre : un choix pour ce soir, un choix pour la semaine six. Ton tempo se règle pièce par pièce, pas par principe — et c'est ta signature.",
    ombre:
      "Le fil bouge avec l'humeur du jour — et l'autre ne devine pas ton tempo, il doit te le demander.",
    tension: "tenir ton fil, en disant à voix haute où tu en es.",
  },
  V4: {
    id: "V4",
    nom: "Le·La Jardinier·se des saisons",
    lumiere:
      "Tu attends que la saison soit bonne : la somme qui double, la personne mieux lue, l'histoire qui s'installe. Ta patience n'attend pas par peur — elle vise, et ça se sent à l'arrivée.",
    ombre:
      "Le jardinier qui attend trop la saison voit parfois la fenêtre se fermer — et l'autre se demander s'il vaut le risque.",
    tension: "viser juste, sans laisser filer les portes qui ne sonnent qu'une fois.",
  },
  V5: {
    id: "V5",
    nom: "Le·La Vin qui se garde",
    lumiere:
      "Six choix, six attentes : tu sais ce que tu veux et tu acceptes le délai qui l'accompagne. Avec toi, le temps se lit — il ne surprend pas, et ça construit du solide.",
    ombre:
      "Le vin se garde, pas la vie entière : certaines envies expirent en cave — et l'autre attend sa part de maintenant.",
    tension: "garder le cap, sans transformer l'attente en règle totale.",
  },
};

/** Textes du briefing — annonce VERBATIM (05-ecran-d-intro), le reste en couche app. */
export const BRIEFING = {
  annonce:
    "Pas de questions cette fois. Juste des choix. Ce que tu choisis en 10 secondes en dit souvent plus que ce que tu réponds en 10 minutes.",
  aQuoiCaSert: [
    "Six situations, une à la fois : à chaque écran, tu choisis entre une option immédiate et une option différée.",
    "Les deux options se valent à chaque choix — seul le temps qui les sépare change. Il n'y a pas de bonne réponse.",
    "Ce sont des hypothèses assumées : rien n'engage rien de réel — tu choisis librement, et c'est justement ce qui parle.",
    "Ça décrit un rapport au temps : ce que tu cueillis tout de suite, ce que tu laisses mûrir.",
  ],
  resultats: [
    "Ta carte — ta lumière et ta zone d'ombre, en quelques mots.",
    "Ce que tes choix révèlent — ton rapport au temps, renvoyé en toutes lettres.",
    "Les pierres de ton portrait — ce que tu découvres ici alimente toute la suite du voyage.",
  ],
};

/** Textes de la fenêtre de complétion (carte) — même gabarit que la quête 1.1. */
export const COMPLETION = {
  entete: "🧭 QUÊTE ACCOMPLIE — « L'épreuve du temps »",
  labelOmbre: "Ta zone d'ombre :",
  labelTension: "Ta tension intérieure :",
  fenetre:
    "Quelque part, quelqu'un répond à ces mêmes questions. Le jour où vos cartes se croiseront, elles auront beaucoup à se dire.",
  miroirNote:
    "Ton miroir — la lecture complète de ton fonctionnement — arrive à la prochaine étape du voyage.",
};

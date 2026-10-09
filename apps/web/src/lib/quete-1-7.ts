/**
 * Quête 1.7 « Ton fonctionnement » — Monde 2 « Le Volant » — ÉCRAN SPÉCIAL SANS CARTE.
 *
 * Contenu FIDÈLE au Livrable M2-1.7-Ton-Fonctionnement (source gelé PARTIE 7, l. 2498-2510 ;
 * charte PARTIE 7 « LES DEUX ÉCRANS SPÉCIAUX (sans carte) », l. 3298-3333) :
 *  - QUESTIONS_17 : les 2 questions déclaratives opt-in VERBATIM (01-tableau-des-items,
 *    transcription machine : 06-fiche-computation-EXEMPLE) — « Je ne souhaite pas le dire »
 *    est une option de PREMIÈRE CLASSE, à sa position exacte du Livrable (6ᵉ et dernière
 *    des options de Q1.7-01) ;
 *  - deck17 : ordre de passation FIXE 01 → 02 — séquence de CONSENTEMENT (02-plan-de-passage :
 *    sans mélange, sans graine, sans verdict ; la visibilité 02 ne se décide que sur ce qui a
 *    déjà été déclaré en 01) ;
 *  - ECRAN_17 : l'écran de confiance de fin de quête, VERBATIM (cartes.yaml, charte PARTIE 7 —
 *    PAS de carte, PAS de partage) ;
 *  - BRIEFING.annonce : l'ouverture VERBATIM (05-ecran-d-intro — la 3ᵉ phrase compte 25 mots,
 *    dérive documentée : la fidélité VERBATIM au source gelé prime sur la règle des 22 mots).
 *
 * RÈGLES DE LA QUÊTE (00-README) :
 *  - SANS score, SANS dimension, SANS carte, SANS miroir (EXEMPTÉ, Constitution [7]) —
 *    scorerNul / choisirVariante → '' ne servent qu'au contrat du registre ;
 *  - opt-in STRICT : aucune case pré-cochée, aucune valeur par défaut orientante ;
 *  - la donnée est RÉVOCABLE par design : modifiable/effaçable à tout moment, depuis le profil ;
 *  - AUCUN signal de sécurité (verbatim usage moteur) — les seuils des détecteurs réinitialisés
 *    restent au document trames (hors dépôt, FM-018 / [11-b]) : aucun seuil n'apparaît ici ;
 *  - pas de diagnostic [2] : la personne coche des mots pour se décrire elle-même.
 *
 * CODAGE DES RÉPONSES (couche app, pour l'écran de rappel — voir CODAGE_17 et decode17) :
 *  - Q1.7-01 (multi) : la réponse est un BITMASK — bit 0 = option 1 cochée, bit 1 = option 2
 *    cochée, … ; « Je ne souhaite pas le dire » se décode comme un libellé ordinaire ;
 *  - Q1.7-02 (binaire) : la valeur = index de l'option + 1 (1 = « Oui, affiche-le sur mon
 *    profil », 2 = « Non, garde-le privé ») ; 0 = pas de réponse (défaut d'usage : « Non »).
 */

import type { ItemPassation } from './quetes';
import { avecEN } from '../i18n/apply';
import * as EN_Q17 from '../i18n/content/en/quete-1-7';

export interface Question17 {
  code: 'Q1.7-01' | 'Q1.7-02';
  question: string;
  options: readonly string[];
  multi: boolean;
}

/** Les 2 questions opt-in — VERBATIM (01-tableau-des-items, ordre du Livrable). */
const QUESTIONS_17_FR: readonly Question17[] = [
  {
    code: "Q1.7-01",
    question: "Coche ce qui te décrit, si tu veux le partager :",
    // 6 options, ordre du Livrable — « Je ne souhaite pas le dire » : option de première classe.
    options: [
      "Neuro-atypique (TSA)",
      "TDAH",
      "Dys (dyslexie, dyspraxie…)",
      "Anxiété que je gère",
      "Autre (champ libre)",
      "Je ne souhaite pas le dire",
    ],
    multi: true,
  },
  {
    code: "Q1.7-02",
    question:
      "Une personne qui te matche peut-elle voir que tu es à l'aise avec la neurodiversité ?",
    options: ["Oui, affiche-le sur mon profil", "Non, garde-le privé"],
    multi: false,
  },
];
export const QUESTIONS_17 = avecEN(QUESTIONS_17_FR, EN_Q17.QUESTIONS_17);

/** Le deck réel : 2 items, ordre FIXE 01 → 02 (séquence de consentement — sans mélange). */
export function deck17(): ItemPassation[] {
  return QUESTIONS_17.map(
    (q): ItemPassation => ({
      code: q.code,
      text: q.question,
      format: 'question',
      options: q.options,
      multi: q.multi,
    }),
  );
}

/** Documentation du codage des réponses (couche app — jamais rendu à l'utilisateur [3]). */
export const CODAGE_17 =
  "multi: la réponse est un BITMASK (bit 0 = option 1 cochée, bit 1 = option 2 cochée, …) · binaire: la valeur = index de l'option + 1";

/** Décode une réponse en libellés choisis — sert à l'écran de rappel. */
export function decode17(code: Question17['code'], valeur: number): string[] {
  const q = QUESTIONS_17.find((x) => x.code === code);
  if (!q || !Number.isFinite(valeur)) return [];
  if (q.multi) {
    const masque = Math.max(0, Math.trunc(valeur));
    const choisis: string[] = [];
    for (let bit = 0; bit < q.options.length; bit += 1) {
      if ((masque & (1 << bit)) !== 0) choisis.push(q.options[bit]);
    }
    return choisis;
  }
  const idx = Math.trunc(valeur) - 1;
  return idx >= 0 && idx < q.options.length ? [q.options[idx]] : [];
}

/** Les quêtes écran n'ont AUCUN score — compatibilité du contrat du registre. */
export function scorerNul(_reponses: Record<string, number>): Record<string, number> {
  return {};
}

/** Aucune carte : l'écran de confiance REMPLACE la variante (charte PARTIE 7). */
export function choisirVariante(): string {
  return '';
}

/** Textes du briefing — annonce VERBATIM (05-ecran-d-intro) ; puces = couche app. */
export const BRIEFING = {
  annonce:
    "Personne ne te teste ici. Tu te décris toi-même, en un clic, si tu le souhaites. C'est modifiable à tout moment, jamais dans aucun score — seulement pour t'aider à être compris(e) et à rencontrer des gens à l'aise avec ton fonctionnement.",
  aQuoiCaSert: [
    "Deux réglages opt-in : ce que tu montres, et qui peut le voir. Tu coches seulement si tu le souhaites.",
    "Modifiables et effaçables à tout moment, depuis ton profil.",
    "Jamais dans aucun score : rien ici ne mesure ni ne note quoi que ce soit.",
  ],
  resultats: [
    "Ton écran de confiance — la fin de quête sans carte, sans note, sans partage.",
    "Tes réglages restent les tiens — affichés seulement si tu l'as décidé, révocables quand tu veux.",
  ],
};

/** Écran de confiance de fin de quête — VERBATIM (cartes.yaml, charte PARTIE 7) :
 *  PAS de carte, PAS de partage — le titre et le corps de l'écran, tels quels. */
const ECRAN_17_FR = {
  titre: "Merci pour ta confiance.",
  texte:
    "Ce que tu as partagé reste entre toi et l'app — sauf si tu as choisi de l'afficher sur ton profil. Il aidera les personnes que tu rencontreras à être à l'aise, et t'aidera à croiser des gens qui te comprennent.\n\nTu peux le modifier ou l'effacer à tout moment, depuis ton profil. Rien de tout cela n'entre dans aucun score.",
};
export const ECRAN_17 = avecEN(ECRAN_17_FR, EN_Q17.ECRAN_17);

/** Fenêtre de complétion — entête = gabarit app (le Livrable n'en donne aucun) ;
 *  fenetre = le corps de l'écran de confiance VERBATIM (cartes.yaml) ;
 *  ombre/tension/miroir : chaînes vides — sans objet (sans carte, miroir EXEMPTÉ). */
export const COMPLETION = {
  entete: "🧭 QUÊTE ACCOMPLIE — « Ton fonctionnement »",
  labelOmbre: "",
  labelTension: "",
  fenetre: ECRAN_17.texte,
  miroirNote: "",
};

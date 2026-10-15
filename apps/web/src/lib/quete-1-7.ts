/**
 * Quête 1.7 « Ton fonctionnement » — Monde 2 « Le Volant » — ÉCRAN SPÉCIAL SANS CARTE.
 *
 * Contenu issu du Livrable M2-1.7-Ton-Fonctionnement (source gelé PARTIE 7, l. 2498-2510 ;
 * charte PARTIE 7 « LES DEUX ÉCRANS SPÉCIAUX (sans carte) », l. 3298-3333).
 *
 * TASK 95 — RÉVISION D'AFFICHAGE À LA DEMANDE DU FONDATEUR (consignée verbatim au
 * worklog) : « Je ne sais pas pourquoi tu as mis des termes et techniques spécifiques
 * au thème de la psychologie… Pourquoi ne pas mettre des phrases assez simples qui
 * pourront permettre aux gens de se reconnaître ? Et pourquoi même pas avec un bouton
 * pop-up qui essaie d'expliquer ce que c'est afin de mieux faciliter le choix des
 * décisions de la personne. » → CE QUI CHANGE (présentation seule) :
 *  - les libellés des options de Q1.7-01 deviennent des phrases simples, à la première
 *    personne, que tout le monde peut reconnaître ;
 *  - TASK 96 (demande fondateur : « des choses comme neuro atypique, TDAH ou dyslexie
 *    dyspraxie sont des mots que les gens ne connaissent pas — les gens ne vont pas
 *    cocher ce qu'ils ne comprennent pas ») : le mot technique du Livrable (TSA, TDAH,
 *    Dys) N'APPARAÎT PLUS dans la liste — il vit uniquement DANS le pop-up « ? », où
 *    sa première phrase le nomme et le décode aussitôt ; EXPLIQUES_17[i].terme reste
 *    la trace du mot du Livrable ;
 *  - un bouton « ? » par mot ouvre un pop-up explicatif en mots simples
 *    (EXPLIQUES_17[i].expli ; titre = la phrase cochable) — composant
 *    components/InfoFonctionnement.tsx ;
 *  - « Autre (champ libre) » devient HONNÊTE : cocher « Autre chose me décrit » ouvre
 *    un vrai champ libre (TEXTE_LIBRE_17, plomberie textes existante — comme Q2.3-10),
 *    promesse du libellé tenue.
 * CE QUI NE CHANGE PAS (structure gelée) :
 *  - 6 options, MÊME ORDRE, MÊMES POSITIONS — la réponse reste un BITMASK bit à bit
 *    (les réponses déjà enregistrées décodent sans migration) ;
 *  - « Je ne souhaite pas le dire » reste une option de PREMIÈRE CLASSE en 6ᵉ position ;
 *  - l'ordre de passation FIXE 01 → 02 (séquence de consentement, sans mélange) ;
 *  - Q1.7-02 (la visibilité) : libellés inchangés ;
 *  - ECRAN_17 : l'écran de confiance de fin de quête, VERBATIM (cartes.yaml).
 *
 * QUESTIONS_17 / deck17 (règles de la quête, 00-README) :
 *  - SANS score, SANS dimension, SANS carte, SANS miroir (EXEMPTÉ, Constitution [7]) —
 *    scorerNul / choisirVariante → '' ne servent qu'au contrat du registre ;
 *  - opt-in STRICT : aucune case pré-cochée, aucune valeur par défaut orientante ;
 *  - la donnée est RÉVOCABLE par design : modifiable/effaçable à tout moment, depuis le profil ;
 *  - AUCUN signal de sécurité (verbatim usage moteur) ;
 *  - pas de diagnostic [2] : la personne coche des mots pour se décrire elle-même —
 *    les pop-ups le rappellent (garde INFO_17).
 *
 * CODAGE DES RÉPONSES (couche app, pour l'écran de rappel — voir CODAGE_17 et decode17) :
 *  - Q1.7-01 (multi) : la réponse est un BITMASK — bit 0 = option 1 cochée, bit 1 = option 2
 *    cochée, … ; « Je ne souhaite pas le dire » se décode comme un libellé ordinaire ;
 *  - Q1.7-02 (binaire) : la valeur = index de l'option + 1 (1 = « Oui, affiche-le sur mon
 *    profil », 2 = « Non, garde-le privé ») ; 0 = pas de réponse (défaut d'usage : « Non ») ;
 *  - TEXTE_LIBRE_17 : le champ libre de « Autre chose me décrit » vit dans etat.textes
 *    (jamais dans le bitmask, jamais parsé — les mots de la personne, comme Q2.3-10).
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

/** Les 2 questions opt-in — ordre du Livrable ; libellés Q1.7-01 simplifiés (Task 95). */
const QUESTIONS_17_FR: readonly Question17[] = [
  {
    code: "Q1.7-01",
    question: "Coche ce qui te décrit, si tu veux le partager :",
    // 6 options, ordre et positions GELÉS (bitmask) — phrases simples
    // (Task 95) ; AUCUN mot technique dans la liste (Task 96) — le « ? »
    // ouvre le pop-up qui l'explique ; « Je ne souhaite pas le dire » reste 6ᵉ.
    options: [
      "Je perçois le monde différemment des autres",
      "Je suis vite distrait(e) et mon énergie déborde",
      "Lire, écrire ou m'organiser me demande un gros effort",
      "Je m'inquiète souvent, mais j'apprends à l'apaiser",
      "Autre chose me décrit — j'écris mes mots",
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

/** Une explication simple d'un mot technique — corps du pop-up « ? » (Task 96 :
 *  le terme n'est plus rendu dans la liste ; l'expli le nomme et le décode). */
export interface Explic17 {
  /** Le mot technique du Livrable — plus affiché dans la liste (Task 96) ;
   *  le pop-up l'introduit et le décode dans sa première phrase (expli). */
  terme: string;
  /** Ce que le mot veut dire, en mots simples (corps du pop-up « ? »). */
  expli: string;
}

/** Les explications simples de Q1.7-01 — MÊME INDEX que les options ; null =
 *  l'option se comprend seule (pas de sous-titre, pas de bouton « ? »).
 *  Task 95, demande fondateur : « un bouton pop-up qui essaie d'expliquer
 *  ce que c'est afin de mieux faciliter le choix ». Jamais un diagnostic. */
const EXPLIQUES_17_FR: readonly (Explic17 | null)[] = [
  {
    terme: "Neuro-atypique (TSA)",
    expli:
      "TSA veut dire « Trouble du spectre de l'autisme ». En clair : ton cerveau traite les sons, les lumières, les émotions et les liens avec les autres à sa façon — souvent avec une intensité que les autres ne voient pas. Beaucoup de personnes autistes aiment les routines claires et les sujets qui les passionnent. C'est un fonctionnement, pas un défaut.",
  },
  {
    terme: "TDAH",
    expli:
      "TDAH veut dire « Trouble de l'attention, avec ou sans hyperactivité ». En clair : rester concentré(e) sur ce qui ne te passionne pas coûte cher, et tenir en place demande un effort constant. En échange, beaucoup de personnes TDAH pensent vite, sentent fort et improvisent bien. Ici, personne ne te demande de te corriger.",
  },
  {
    terme: "Dys (dyslexie, dyspraxie…)",
    expli:
      "Les « Dys » regroupent la dyslexie (les mots), la dyspraxie (les gestes et l'organisation), la dyscalculie (les nombres)… Ce n'est ni de la paresse, ni un manque d'intelligence : le cerveau passe par un autre chemin. Beaucoup de personnes ont bâti leurs propres astuces — ici, elles comptent pour ce qu'elles sont : de la force.",
  },
  {
    terme: "Anxiété que je gère",
    expli:
      "C'est quand le mental anticipe le pire, même quand tout va bien — et que tu as appris à t'apaiser, à ta manière. Le mot important est « que je gère » : tu n'as pas besoin d'être « guéri(e) » pour cocher. Et si tu préfères ne rien dire, c'est un droit.",
  },
  null, // « Autre chose me décrit » — le libellé suffit (un vrai champ libre s'ouvre)
  null, // « Je ne souhaite pas le dire » — une réponse complète, pas besoin d'explication
];
export const EXPLIQUES_17 = avecEN(EXPLIQUES_17_FR, EN_Q17.EXPLIQUES_17);

/** Le pop-up « tous les mots » (lien sous la liste) — le POURQUOI de la question
 *  (demande fondateur : « je ne sais vraiment pas à quoi cela sert ») + la garde. */
const INFO_17_FR = {
  titre: "Ces mots, en clair",
  chapeau:
    "Personne ne te teste ici. Tu coches des mots pour te décrire, seulement si tu le veux. Voici ce qu'ils veulent dire, simplement.",
  pourquoi: [
    "Ça aide l'app à te proposer des personnes à l'aise avec ton fonctionnement — et t'évite d'avoir à tout expliquer seul(e), au début.",
    "Ça prévient les malentendus : la personne que tu rencontres le sait, si tu l'as affiché sur ton profil.",
    "Rien n'est noté, rien ne part sans ton choix — et tu peux tout modifier ou effacer depuis ton profil.",
  ],
  garde:
    "Rien de tout cela n'est un diagnostic, rien n'entre dans un score — et tu peux tout modifier ou effacer depuis ton profil.",
};
export const INFO_17 = avecEN(INFO_17_FR, EN_Q17.INFO_17);

/** Le code GELÉ du champ libre de « Autre chose me décrit » — vit dans
 *  etat.textes (plomberie Q2.3-10/4.2/4.3 : jamais dans le bitmask, jamais parsé). */
export const TEXTE_LIBRE_17 = 'Q1.7-01-TEXTE';

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
  "multi: la réponse est un BITMASK (bit 0 = option 1 cochée, bit 1 = option 2 cochée, …) · binaire: la valeur = index de l'option + 1 · texte libre « Autre » : etat.textes['Q1.7-01-TEXTE'] (jamais parsé)";

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

/**
 * Quête 4.3 « Ce que tes relations t'ont appris » — Monde 5 « Ton Héritage ».
 *
 * Contenu FIDÈLE au Livrable M5-4.3-Ce-Que-Tes-Relations-Tont-Appris (branche
 * archive/v1) :
 *  - ⚡ TÂCHE D'ÉCRITURE — 1 question ouverte, code gelé Q4.3-01, FACULTATIVE
 *    (retrait « Je préfère ne pas dire » — saut sans pénalité, précédent 2.8).
 *    Aucune longueur minimale, aucune relance : une question se pose UNE fois.
 *  - Mélange SANS-OBJET (1 item — ordinal 33 réservé, non consommé) ; la
 *    quête vit sur SON écran propre, après la passation de 4.2 dans le flux
 *    du monde.
 *  - EXEMPTIONS PAR DESIGN (table d'exemption du Livrable, précédent 1.11) :
 *    AUCUN miroir (1 item — aucun profil computable), AUCUNE carte à P1.5
 *    (la carte rédigée est un produit P2 — écran de complétion simple et
 *    bienveillant), AUCUN score.
 *  - INTERDITS ABSOLUS (interdits V10 — gravés) : ① AUCUN extrait de la
 *    réponse ne se rend jamais — aucun slot, aucune carte, aucun miroir,
 *    aucun rappel, jamais au match, jamais au premium : la réponse appartient
 *    au voyageur, le moteur la lit, l'interface ne la montre pas. ② AUCUN
 *    blâme n'est suggéré par l'énoncé — l'invite ouvre sur « ce que ça t'a
 *    appris », jamais sur « ce qu'ils t'ont fait ». ③ L'analyse (signal
 *    moteur, P2) reste moteur — elle protège, elle ne qualifie jamais à
 *    l'écran.
 *  - Dans cette app : la réponse reste sur l'appareil (textes — même
 *    traitement que la ligne libre 2.3, plafond 500 caractères) et n'est
 *    JAMAIS rendue hors de cet écran. L'analyse linguistique P2 n'est PAS
 *    implémentée ici (aucune trace, aucun signal calculé) — le stockage
 *    local est la seule chose qui arrive à la réponse.
 *
 * Typo : apostrophe ASCII uniquement, guillemets français. Règles : aucun
 * code, score, sigle ou seuil ne franchit le rendu ; phrases ≤ 22 mots.
 */

import { avecEN } from '../i18n/apply';
import * as EN_Q43 from '../i18n/content/en/quete-4-3';

/** Le code gelé de l'item ouvert. */
export const OUVERTE_CODE = 'Q4.3-01';

/** L'énoncé de l'écran d'écoute — verbatim (01-tableau-des-items). */
const ENONCE_FR = "Ce que tes relations t'ont appris — en quelques lignes, si tu veux.";
const ENONCE = avecEN(ENONCE_FR, EN_Q43.ITEMS[0]?.text ?? ENONCE_FR);

/** L'item unique du deck — format 'question' (le rendu dédié vit dans
 *  Quete.tsx, branché sur la quête : champ libre + retrait sans pénalité). */
export interface ItemOuverte43 {
  code: string;
  text: string;
}

export function deckQuete(): { code: string; text: string; format: 'question'; options: readonly string[] }[] {
  return [{ code: OUVERTE_CODE, text: ENONCE, format: 'question', options: [] }];
}

/** AUCUN score de quête — la tâche n'est pas notée (dimension null du
 *  Livrable). Le scorer existe pour la signature du registre : il rend un
 *  objet vide, toujours. */
export function scorer(_reponses: Record<string, number>): Record<string, number> {
  return {};
}

/** Aucune carte à P1.5 (exemption par design) — le sélecteur n'est jamais
 *  appelé (quête sansCarte) : il rend une valeur vide conventionnelle. */
export function choisirVariante(): string {
  return '';
}

/** Aucune carte — registre vide (exemption par design, précédent 3.7). */
export const CARTES: Record<string, never> = {};

/** Textes du briefing — annonce VERBATIM (05-ecran-d-intro, 2 phrases : la
 *  promesse de protection est l'interdit raconté), puces en couche app. */
export const BRIEFING = {
  annonce:
    "Une page, si tu veux — ce que tes relations t'ont appris, à ta façon. Ce que tu écris reste chez toi : rien ne sera cité, rien ne sera montré.",
  aQuoiCaSert: [
    "C'est la dernière quête du monde : une page d'écoute, pas une évaluation.",
    "Une question ouverte, un champ libre — pas de longueur minimale, pas de piège.",
    "Tu peux ne rien écrire : « Je préfère ne pas dire » est une réponse complète.",
    "Ce que tu écris reste chez toi — jamais cité, jamais montré.",
  ],
  resultats: [
    "Un écran de clôture simple — rien à lire, rien à interpréter.",
    "Ta page, si tu l'écris : elle reste sur cet appareil, jamais montrée.",
    "Le monde « Ton Héritage » se referme — ton portrait garde une pierre de plus.",
  ],
};

/** Le retrait VERBATIM (01-tableau-des-items). */
const RETRAIT_FR = "Je préfère ne pas dire";
export const RETRAIT = avecEN(RETRAIT_FR, EN_Q43.RETRAIT);

/** Textes de l'écran d'écoute (couche app — ton du 05 : l'écoute, pas
 *  l'évaluation). */
const ECRAN_ECRITE_FR = {
  placeholder: "Tes mots à toi — ils ne sont jamais reformulés.",
  valider: "Envoyer ma page",
  note: "Ce que tu écris reste chez toi : rien ne sera cité, rien ne sera montré.",
  noteRetrait: "Saute sans pénalité — une réponse complète, elle aussi.",
};
export const ECRAN_ECRITE = avecEN(ECRAN_ECRITE_FR, EN_Q43.ECRAN_ECRITE);

/** Textes de l'écran final (exemption carte — « écran de complétion simple
 *  et bienveillant » du Livrable). AUCUN rappel du contenu écrit. */
const ECRAN_FINAL_43_FR = {
  titre: "Ta page est à toi",
  texte:
    "Ce que tu as écrit reste chez toi — rien ne sera cité, rien ne sera montré. Si tu as préféré ne pas dire, c'est une réponse complète aussi.",
};
export const ECRAN_FINAL_43 = avecEN(ECRAN_FINAL_43_FR, EN_Q43.ECRAN_FINAL_43);

/** Textes de la fenêtre de complétion — entête verbatim (ton du 05). */
export const COMPLETION = {
  entete: "🌳 QUÊTE ACCOMPLIE — « Ce que tes relations t'ont appris »",
  labelOmbre: "Ta zone d'ombre :",
  labelTension: "Ta tension intérieure :",
  fenetre:
    "Quelque part, quelqu'un écrit sa propre page. Le jour où vos chemins se croiseront, vos histoires auront beaucoup à se dire.",
  miroirNote:
    "Aucune analyse, aucune note : l'écoute n'est pas une évaluation.",
};

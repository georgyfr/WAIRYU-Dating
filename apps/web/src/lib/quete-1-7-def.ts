/**
 * Quête 1.7 « Ton fonctionnement » — couche ACCOMPAGNEMENT du registre (lecture d'app).
 *
 * Rédigé (jamais verbatim du Livrable) — ton Task 35 : tutoiement, simple et littéral,
 * phrases courtes (≤ 22 mots), jamais un diagnostic [2], aucun code/score/sigle rendu [3].
 * Particularité de la quête : AUCUN score, AUCUNE barre, AUCUNE carte — dims, accompagnement
 * et ombreRelationnel sont vides par DESIGN (quête opt-in hors score, miroir EXEMPTÉ,
 * Constitution [7]) : elle produit des réglages, pas une mesure. Rien à lire, rien à
 * interpréter — l'écran de confiance verbatim vit dans quete-1-7.ts (ECRAN_17).
 */

import type { EntreeRegistre } from './quetes';

export const DEF_17: EntreeRegistre = {
  sousTitre: "Le réglage du volant : ce que tu montres, à qui tu l'ouvres.",
  dims: [],
  accompagnement: {},
  conseils: [
    "Tu peux changer d'avis quand tu veux : réglages modifiables ou effaçables depuis ton profil, à tout moment.",
    "« Je ne souhaite pas le dire » est une réponse complète — pas une réponse manquante.",
    "Ce que tu montres et qui peut le voir : deux décisions séparées, dans cet ordre.",
  ],
  commentLire:
    "Il n'y a rien à lire ici — pas de barre, pas de note. Juste deux réglages qui restent les tiens.",
  ombreRelationnel: {},
  suivante: '1.9',
  suite: {
    titre: 'Tes réglages sont posés.',
    intro: 'La quête suivante regarde ton élan du moment — la météo de ces derniers jours.',
    questions: [],
    cta: 'Prendre ma météo',
  },
};

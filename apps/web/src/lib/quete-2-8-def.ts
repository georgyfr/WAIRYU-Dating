/**
 * Quête 2.8 « Ton signe (juste pour le jeu) » — couche ACCOMPAGNEMENT du
 * registre (lecture d'app), entrée assemblée dans quetes.ts côté orchestrateur.
 *
 * Particularité de la quête : AUCUN score, AUCUNE barre, AUCUNE carte, AUCUN
 * archétype — dims, accompagnement et ombreRelationnel sont vides PAR DESIGN :
 * RÈGLE ABSOLUE du Livrable M3-2.8 (gravée au 00-README, au 01, au 05 et à
 * cartes.yaml) — le signe n'entre JAMAIS dans le score, JAMAIS dans le
 * matching, JAMAIS dans aucun calcul (ni filtre, ni pondération, ni tie-break,
 * même déguisé). La quête produit un badge de conversation (quete-2-8.ts :
 * CARTES + DISCLAIMER_28), pas une mesure — badge déclaratif pur, aucune
 * donnée calculée.
 *
 * Rédigé (jamais verbatim du Livrable) — ton Task 35 : tutoiement, simple et
 * littéral, phrases courtes (≤ 22 mots), jamais un diagnostic, aucun
 * code/score/sigle rendu, zéro incitation à croire (frontière jeu/science
 * maintenue : le badge est un sujet de table, pas un profil).
 *
 * Dernière quête ouverte du Monde 3 « La Boussole » : suivante = null ; la fin
 * émotionnelle ouvre le Monde 4 « Ton terrain » (couche app rédigée — le
 * prochain monde descend sur le terrain réel : rythme de vie, quotidien,
 * argent, entourage).
 *
 * Typo : apostrophe ASCII ', phrases ≤ 22 mots, aucun code/score/sigle rendu.
 */

import type { EntreeRegistre } from './quetes';

export const DEF_28: EntreeRegistre = {
  sousTitre: 'La quête du jeu — un badge pour la conversation.',

  // VIDE — règle absolue : zéro calcul, zéro barre (badge déclaratif pur).
  dims: [],

  // VIDE — rien à lire par palier : le badge n'a pas de niveau, pas de degré.
  accompagnement: {},

  conseils: [
    'Le badge se change ou se retire quand tu veux — l\'étiquette t\'appartient.',
    'Aucun test ici : ton signe ne dit rien de toi.',
    'Le badge vit sur ton profil et dans la conversation : un sujet de table, pas un verdict.',
  ],

  commentLire:
    'Cette quête ne mesure rien : c\'est un badge de conversation, pas un profil. ' +
    'Aucune barre à lire — ton signe n\'entre dans aucun calcul.',

  // VIDE — badge/écran EXEMPTÉ de miroir et de charte d'ombre (Constitution [7],
  // precedent 1.7, ratification comité — exemptions documentées au Livrable).
  ombreRelationnel: {},

  // Le pont vers le Monde 4 « Ton Terrain » (série 3.x — Task 46) : la chaîne
  // continue au-delà de La Boussole.
  suivante: '3.1',

  suite: {
    titre: 'La suite de ton voyage',
    intro:
      'Ta boussole est posée. Le prochain monde descend sur ton terrain : le quotidien, ' +
      'le rythme, l\'argent, les gens qui t\'entourent.',
    questions: [
      'Dans une semaine ordinaire, qui décide de ton rythme : toi, ton travail, les autres ?',
      'Quand l\'argent ou l\'entourage se mêlent de tes choix, ça se passe comment, chez toi ?',
    ],
    cta: 'Entrer dans ton terrain',
  },
};

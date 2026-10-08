/**
 * Couche accompagnement de la quête 1.11 « Es-tu prêt·e à rencontrer ? » —
 * entrée du registre (assemblée dans quetes.ts).
 *
 * Quête-écran de passage : AUCUNE barre (dims vide), AUCUN accompagnement par
 * palier, AUCUN volet ombre en relation — rien à lire ici : juste un moment
 * de cadrage et un écran de sortie. Dernière quête ouverte du Monde 2
 * « Le Volant » : suivante = null, la fin émotionnelle referme le monde
 * (retour au voyage) ; l'écran sera re-proposé après les mondes 4 et 5.
 *
 * Règles : couche app rédigée (ton Task 35 — tutoiement, simple et littéral,
 * phrases courtes), apostrophes ASCII, phrases ≤ 22 mots, aucun jugement,
 * aucun sigle moteur rendu à l'utilisateur.
 */

import type { EntreeRegistre } from './quetes';

export const DEF_111: EntreeRegistre = {
  sousTitre: 'Le dernier réglage du monde : la rencontre, quand tu veux.',
  dims: [],
  accompagnement: {},
  conseils: [
    'Aucun des trois chemins n\'est le bon — celui que tu choisis dit juste où tu en es.',
    'Ton choix reste modifiable à tout moment, et tu peux refaire l\'écran quand tu veux.',
    'L\'écran te sera re-proposé après les mondes 4 et 5 : tu pourras relire ta disponibilité à tête reposée.',
  ],
  commentLire:
    'Ici, rien à lire : pas de barres, pas de carte — juste un moment de cadrage, et ton écran de sortie.',
  ombreRelationnel: {},
  suivante: null,
  suite: {
    titre: 'Le monde 2 est complet',
    intro:
      'Le Volant t\'a porté·e jusqu\'ici. Ton Portrait de monde arrivera avec la suite du voyage — à ton rythme.',
    questions: [],
    cta: 'Retour à mon voyage',
  },
};

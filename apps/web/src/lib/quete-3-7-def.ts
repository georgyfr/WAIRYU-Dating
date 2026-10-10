/**
 * Quête 3.7 « Tes attirances » — couche ACCOMPAGNEMENT du registre (lecture
 * d'app), entrée assemblée dans quetes.ts côté orchestrateur.
 *
 * Particularité de la quête : AUCUN score, AUCUNE barre, AUCUNE carte, AUCUN
 * archétype, AUCUN miroir — dims, accompagnement et ombreRelationnel sont
 * VIDES PAR DESIGN (precedents DEF_17 « écran de confiance » et DEF_28
 * « badge déclaratif pur ») : la quête produit des DÉCLARATIONS PRIVÉES pour
 * le pool de découverte, pas une mesure. RÈGLE GRAVÉE (cadre éthique strict
 * mission V9.G — 4 endroits du livrable) : les attirances ne s'affichent
 * JAMAIS sur un profil, ne calculent JAMAIS un score de compatibilité, ne
 * classent JAMAIS personne — uniquement le pool de découverte. Rien à lire,
 * rien à interpréter : l'écran final PRIVÉ vit dans quete-3-7.ts
 * (ECRAN_FINAL_37 + COMPLETION).
 *
 * Le conseil porte ici sur la DÉCLARATION : privé, réversible, jamais un
 * classement — les options restent des goûts co-égaux (l'étincelle ne vaut
 * pas l'ancrage), la garde de une à trois options protège la qualité des
 * découvertes, jamais une note.
 *
 * DERNIÈRE quête ouverte du Monde 4 « Ton Terrain » : la chaîne continue —
 * le Monde 5 « Ton Héritage » est CONSTRUIT : suivante = '4.1' (la première
 * quête du M5, livrée avec ses trames hébergées — Livrable M5-4.1). La fin
 * émotionnelle ouvre le Monde 5 « Ton Héritage » : l'histoire relationnelle —
 * l'arbre, le présent, ce que les relations ont appris (WORLD_DETAILS.M5).
 *
 * Rédigé (jamais verbatim du Livrable) — ton Task 35 : tutoiement, simple et
 * littéral, phrases courtes (≤ 22 mots), jamais un diagnostic, aucun
 * code/score/sigle rendu, sans « jamais »/« toujours » hors citations
 * verbatim, zéro promesse de rencontre (le Mode Invisible est un outil).
 *
 * Typo : apostrophe ASCII ', phrases ≤ 22 mots, aucun code/score/sigle rendu.
 */

import type { EntreeRegistre } from './quetes';

export const DEF_37: EntreeRegistre = {
  sousTitre: 'La quête privée : tes attirances, rien que pour toi.',

  // VIDE — règle gravée : zéro calcul, zéro barre, zéro restitution
  // (precedent DEF_17/DEF_28 : la quête produit des déclarations, pas une
  // mesure — dims vide valide pour une quête sansCarte).
  dims: [],

  // VIDE — rien à lire par palier : des goûts déclarés n'ont ni degré ni
  // niveau, aucune option n'est « mieux » qu'une autre.
  accompagnement: {},

  conseils: [
    'Ce que tu déclares ici ne s\'affiche nulle part : c\'est entre toi et l\'app.',
    'Les attirances évoluent : tu peux changer tes déclarations quand tu veux, sans rien justifier.',
    'Coche de une à trois options par déclaration : c\'est un choix de goût, pas un palmarès.',
    'Toutes les options se valent : aimer l\'étincelle ou l\'ancrage, c\'est le même droit — des goûts, pas des notes.',
  ],

  commentLire:
    'Il n\'y a rien à lire ici : pas de barre, pas de carte, pas de score. ' +
    'Tes déclarations restent privées — elles organisent tes découvertes, sans rien afficher.',

  // VIDE — aucune carte, aucun miroir, aucune signature (exemptions par
  // design documentées au Livrable — precedents 1.7/1.11/2.8 ; NE PAS créer
  // de fichier arche).
  ombreRelationnel: {},

  // Dernière quête ouverte du Monde 4 « Ton Terrain » — la chaîne continue
  // dans le Monde 5 « Ton Héritage » (construit : 4.1 → 4.2 → 4.3).
  suivante: '4.1',

  suite: {
    titre: 'La suite de ton voyage',
    intro:
      'Tes attirances sont posées — elles restent à toi. Le prochain monde remonte le fil de ton ' +
      'histoire : ton arbre relationnel, ton présent, ce que tes relations t\'ont appris.',
    questions: [
      'Qui compte comme famille pour toi — ceux du sang, ceux du cœur, ou les deux ?',
      'Que t\'ont appris tes relations passées — et que veux-tu garder pour la suite ?',
    ],
    cta: 'Entrer dans ton héritage',
  },
};

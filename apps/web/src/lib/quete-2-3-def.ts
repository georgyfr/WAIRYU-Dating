/**
 * Couche accompagnement de la quête 2.3 « Tes non-négociables »
 * (Monde 3 « La Boussole »).
 *
 * Rédigée par les agents quête (jamais verbatim du Livrable), ton Task 35 :
 * tutoiement, simple et littéral, phrases courtes (≤ 22 mots), jamais un
 * diagnostic, jamais culpabilisant. Alimente l'entrée « 2.3 » du registre
 * (quetes.ts — assemblage orchestrateur).
 *
 * Particularité de la quête : CHECKLIST NON-Likert — dimension = null au
 * Livrable (aucune psychométrie). La barre unique `coches` est un repère
 * DESCRIPTIF du nombre de lignes rouges posées (0 à 9), pas une mesure :
 * cocher décrit une limite à soi, il n'y a ni bonne ni mauvaise liste.
 *
 * SENS DE LA BARRE (à ne pas inverser) : barre PLEINE = cadre précis (beaucoup
 * de lignes posées), barre LÉGÈRE = cadre ouvert (peu ou pas de lignes).
 * FIDÈLE à la doctrine du Livrable : un cadre précis n'est pas une fermeture,
 * un cadre ouvert n'est pas un défaut — la liste vide (SIG-2.3-02) est un choix
 * assumé, jamais pénalisé. Aucun palier n'est flatté ni blâmé ; l'ombre nomme
 * le COÛT RELATIONNEL du choix (un filtre dur réduit le bassin de rencontre),
 * jamais un jugement moral.
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots, aucun code/score
 * ni métadonnée moteur dans un texte rendu.
 */
import type { EntreeRegistre } from './quetes';

export const DEF_23: EntreeRegistre = {
  sousTitre: 'La quête de la boussole : les lignes rouges que tu poses.',

  dims: [
    {
      key: 'coches',
      nom: 'Tes lignes rouges',
      sousLigne: 'ce que tu ne négocies pas',
      genre: 'f',
      lecture:
        'Cette barre dit combien de lignes rouges tu poses : pleine, un cadre précis ; légère, un cadre ouvert. Elle ne mesure rien — cocher décrit tes limites, il n\'y a ni bonne ni mauvaise liste. Un cadre précis n\'est pas une fermeture, un cadre ouvert n\'est pas un défaut : les deux se valent, et la liste se relit à tout moment.',
    },
  ],

  accompagnement: {
    // SENS : plein = beaucoup de lignes posées (cadre précis) · léger = peu ou
    // pas de lignes (cadre ouvert) — aucun palier n'est flatté ni blâmé
    // (neutralité absolue du Livrable : la liste vide n'est jamais un manque).
    coches: {
      fort:
        'Ta barre est pleine : ton cadre est précis, tes rencontres démarrent nettes, sans zone grise. Ta vigilance : chaque ligne de plus rétrécit le bassin de rencontre — relis ta liste pour garder une porte, et pas un mur.',
      equilibre:
        'Tu as posé des limites, pas trop : l\'essentiel protégé, le reste à l\'imprévu. Ta vigilance : une ligne posée pour éviter la discussion ne protège plus, elle écarte — vérifie qu\'elle sert encore.',
      doux:
        'Tu poses presque rien : ton cadre s\'écrit en marchant, la place est faite aux surprises. Ta vigilance : sans limites dites, on finit par les subir — pose-les à froid, avant qu\'une histoire ne les pose pour toi.',
    },
  },

  conseils: [
    'Une limite née d\'une déception attend une semaine : relis ta liste à froid avant de compter une ligne.',
    'Ta liste n\'est pas gravée : tu la relis, tu la modifies, elle te suit dans le temps.',
    'Une coche n\'est ni sage ni fermée : c\'est une limite à toi, posée sans jugement.',
    'La liste vide se défend aussi : rien n\'est activé, et rien ne te pénalise.',
  ],

  commentLire:
    'Une seule barre, et elle vient de TES coches : plus elle est pleine, plus tu as posé de lignes rouges. Elle va de 0 à 9 : un repère descriptif, pas une note. La liste vide n\'y est jamais un manque — c\'est un cadre ouvert, et il se défend. Ce qu\'elle regarde et ce qu\'elle dit de toi sont écrits dessous — relis-la comme un portrait, pas un bulletin.',

  ombreRelationnel: {
    'CARTE-2.3-A':
      'En relation, ta zone d\'ombre peut donner : des arbitrages remis plus tard, des limites découvertes en situation. Ce qui aide : écrire tes limites à froid, avant que la vie ne les rédige pour toi.',
    'CARTE-2.3-B':
      'En relation, ta zone d\'ombre peut donner : des frontières qui servent d\'excuse au lieu de protéger. Ce qui aide : relire chaque ligne de temps en temps, et dire la règle plutôt que la laisser deviner.',
    'CARTE-2.3-C':
      'En relation, ta zone d\'ombre peut donner : un bassin réduit — des profils ne passent pas l\'écran, et personne ne le dit. Ce qui aide : garder une porte, et pas un mur — et vérifier de quel côté elle ouvre.',
  },

  // Le chaînage M3 pointe vers 2.4 « Tes réalités » (quête suivante du monde).
  // L'IdQuete du registre couvre encore les mondes 1-2 : cast documenté jusqu'à
  // l'extension du type par l'orchestrateur (Task 38 — chaîne de déblocage M3).
  suivante: '2.4' as unknown as EntreeRegistre['suivante'],

  suite: {
    titre: 'Tes lignes rouges sont posées.',
    intro:
      'Tu sais maintenant où tu ne négocies pas. La prochaine quête regarde l\'autre côté du miroir : tes propres réalités, à déclarer une à une. Car une ligne rouge croise tôt ou tard une réalité — la tienne comprise.',
    questions: [
      'Si l\'une de tes réalités croisait l\'une de tes lignes rouges, que choisirais-tu ?',
      'Parmi tes lignes rouges, laquelle a déjà coûté une rencontre — et laquelle vit surtout sur le papier ?',
    ],
    cta: 'Aller vers tes réalités',
  },
};

/**
 * Couche accompagnement de la quête 2.5 « Ce que tu cherches »
 * (Monde 3 « La Boussole »).
 *
 * Rédigée par les agents quête (jamais verbatim du Livrable), ton Task 35 :
 * tutoiement, simple et littéral, phrases courtes, jamais un diagnostic,
 * jamais culpabilisant. Alimente l'entrée « 2.5 » du registre (quetes.ts).
 *
 * SENS DE LA BARRE (à ne pas inverser) — CHOIX DOCUMENTÉ : la quête binaire
 * n'a AUCUNE dimension psychométrique (dimension = null au Livrable) et une
 * barre « qualité d'intention » serait normative (doctrine interdite : aucune
 * intention ne vaut plus qu'une autre, le « Non / Non / Non » est incomplet,
 * PAS fautif). La dimension `cap` porte donc une lecture NEUTRE : la barre
 * reflète le NOMBRE DE RÉPONSES POSÉES (0-3), normalisé par le scorer
 * (score.cap = posées / 3 ∈ [0,1] — la forme attendue par le moteur, cf.
 * construireApercuResultats : pct = valeur × 100, paliers 0.40/0.65).
 * Conséquence structurelle honnête : avec 3 binaires, seuls les paliers doux
 * (0-1 posées) et fort (2-3 posées) sont atteignables — le texte `equilibre`
 * reste écrit pour complétude du gabarit. L'intention elle-même est rendue
 * en toutes lettres à côté (carte + miroir S1), DATÉE (« aujourd'hui »),
 * jamais figée en trait permanent.
 *
 * Volet contradiction (SIG-2.5-02) : les cas routés vers la carte JEDECOUVRE
 * (contradiction directe 01 × 03 · « Non / Non / Non ») reçoivent le même
 * miroir dégradé, sans texte accusateur — aucune ombre ci-dessous ne blâme.
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots, aucun code/score
 * ni métadonnée moteur dans un texte rendu.
 */
import type { EntreeRegistre, IdQuete } from './quetes';

export const DEF_25: EntreeRegistre = {
  sousTitre: 'La quête de la boussole : ton cap, dit droit.',

  dims: [
    {
      key: 'cap',
      nom: 'Ton cap',
      sousLigne: 'ce que tu déclares chercher',
      genre: 'm',
      lecture:
        'Cette barre suit combien de réponses posent ton cap, de zéro à trois. Elle ne mesure pas la valeur de ton intention : aucune ne vaut plus qu\'une autre. Ton cap lui-même est rendu en toutes lettres à côté de ta carte, daté d\'aujourd\'hui, modifiable quand il bouge.',
    },
  ],

  accompagnement: {
    // SENS : fort = cap posé en toutes lettres · doux = cap en cours —
    // aucun palier n'est flatté ni blâmé (incomplétude assumée du Livrable).
    cap: {
      fort:
        'Tu as posé ton cap : ce que tu cherches se lit en toutes lettres, et ça épargne des malentendus. Ta vigilance : un cap d\'aujourd\'hui n\'engage pas une vie — le renommer, c\'est entretenir la boussole, pas se contredire.',
      equilibre:
        'Ton cap est à moitié posé : une partie se dit déjà, le reste se précise. C\'est un état normal — la boussole bouge quand tu bouges.',
      doux:
        'Peu de ton cap est affiché pour l\'instant : c\'est incomplet, pas fautif. La réponse « Je découvre » reste ouverte, comme les autres — prendre le temps est un état normal de la recherche.',
    },
  },

  conseils: [
    'Relis ton cap à tête reposée : il décrit ton aujourd\'hui, pas un trait permanent.',
    'Si ton cap a bougé, mets ta réponse à jour : une intention se renomme le jour même.',
    'Dans tes échanges, dis ton cap tôt et simplement : le flou coûte plus cher que la clarté.',
    'Aucune intention ne vaut plus qu\'une autre : la tienne se vaut, dès l\'instant qu\'elle est honnête.',
  ],

  commentLire:
    'Une seule barre, et elle vient de tes réponses : elle suit combien de réponses posent ton cap, de zéro à trois. Elle ne note ni la valeur ni la qualité de ton intention — aucune ne vaut plus qu\'une autre. Ton cap est rendu en toutes lettres à côté de la barre, daté d\'aujourd\'hui — un instantané, pas un trait permanent.',

  ombreRelationnel: {
    'CARTE-2.5-EXPL':
      'En relation, ta zone d\'ombre peut donner : un rythme posé d\'avance, où l\'autre hérite d\'étapes qu\'il n\'a pas choisies. Ce qui aide : demander son tempo à l\'autre avant de fixer le cap à deux.',
    'CARTE-2.5-DECOU':
      'En relation, ta zone d\'ombre peut donner : un cadre ouvert où quelqu\'un s\'attache pendant que tu explores. Ce qui aide : nommer tôt ce que tu peux offrir aujourd\'hui, sans promesse déguisée.',
    'CARTE-2.5-LIBRE':
      'En relation, ta zone d\'ombre peut donner : un flou de statut, où l\'autre espère plus que ce que tu proposes. Ce qui aide : dire la situation telle qu\'elle est, dès les premiers échanges.',
    'CARTE-2.5-JEDECOUVRE':
      'En relation, ta zone d\'ombre peut donner : un cap en mouvement, difficile à suivre pour qui s\'attache en chemin. Ce qui aide : partager où tu en es, et revenir le mettre à jour quand ça bouge.',
  },

  // '2.6' entre dans IdQuete à l'intégration M3 de quetes.ts (les quêtes du
  // Monde 3 ne sont pas encore au registre) — cast documenté, à retirer alors.
  suivante: '2.6' as IdQuete,

  suite: {
    titre: 'La suite de ton voyage',
    intro:
      'Tu sais maintenant ce que tu cherches — ou que tu l\'es encore en train de chercher. La prochaine étape demande un arbitrage : ton temps, ton énergie, ton attention ne suffisent pas à tout. Ce que tu places en premier dit le reste.',
    questions: [
      'Si tu ne pouvais garder qu\'une priorité à cinq ans, laquelle ?',
      'Qu\'es-tu prêt(e) à lâcher pour la tenir ?',
    ],
    cta: 'Arbitrer mes priorités à cinq ans',
  },
};

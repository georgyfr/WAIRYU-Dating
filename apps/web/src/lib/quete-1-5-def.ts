/**
 * Couche accompagnement de la quête 1.5 « L'épreuve du temps » (Monde 2 « Le Volant »).
 *
 * Rédigée par les agents quête (jamais verbatim du Livrable), ton Task 35 :
 * tutoiement, simple et littéral, phrases courtes, jamais un diagnostic.
 * Alimente l'entrée « 1.5 » du registre (quetes.ts).
 *
 * SENS DE LA BARRE (à ne pas inverser) : la dimension compte les choix A
 * (immédiats) — barre PLEINE = ta main a cueilli sans attendre, barre LÉGÈRE =
 * elle a laissé mûrir. Doctrine du Livrable : neutralité absolue — aucun
 * palier n'est flatté ni blâmé (« céder n'est pas faible, attendre n'est pas
 * mûr »). Les codes de score restent côté moteur : jamais rendus à l'écran.
 * Le temps de réponse n'est jamais mentionné : il ne produit aucun texte.
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots.
 */
import type { EntreeRegistre } from './quetes';

export const DEF_15: EntreeRegistre = {
  sousTitre: 'La petite tâche du volant : ce que tes choix révèlent.',

  dims: [
    {
      key: 'IMP_B',
      nom: 'Ton rapport au temps',
      sousLigne: 'cueillir maintenant ou laisser mûrir',
      genre: 'm',
      lecture:
        'Cette barre dit combien de fois ta main a cueilli sans attendre : pleine, elle a pris l\'option immédiate à presque chaque scène ; légère, elle a laissé mûrir la plupart du temps. Les deux gestes se valent — céder n\'est pas faible, attendre n\'est pas mûr. La barre décrit un rapport au temps, elle ne note rien.',
    },
  ],

  accompagnement: {
    // SENS : fort = beaucoup d'options immédiates (main qui cueille) — aucun palier flatté ni blâmé.
    IMP_B: {
      fort:
        'Ta main a cueilli presque à chaque scène : les occasions se vivent chez toi au moment où elles se présentent. Ce n\'est ni une force ni un défaut — c\'est un tempo. Ton levier : une décision par semaine prise à froid, pour que rien d\'important ne reste en suspens.',
      equilibre:
        'Ta main a cueilli autant qu\'elle a attendu : un choix pour ce soir, un choix pour plus tard. Tu n\'as pas de règle, tu lis chaque situation — c\'est une signature, pas un flou. Vigilance : ton tempo change avec les jours ; le dire à voix haute évite de le laisser deviner.',
      doux:
        'Ta main a attendu presque à chaque scène : elle laisse mûrir, elle vise, elle choisit peu mais précisément. Ce n\'est pas de la crainte — c\'est une façon de viser. Ton levier : une porte par mois où tu entres sans lire l\'étiquette, pour que l\'attente garde du goût.',
    },
  },

  conseils: [
    'Relis ta carte à tête reposée : d\'autres phrases ressortiront.',
    'Repère le choix qui t\'a le plus surpris — c\'est souvent là que quelque chose se dit.',
    'Six cueillettes, six attentes ou un mélange : les cinq profils se valent, aucun n\'est le bon.',
    'Garde tes réponses sur cet appareil : la quête suivante s\'appuie sur ce que tu viens de choisir.',
  ],

  commentLire:
    'Cette barre vient de tes six choix, à l\'instant : elle monte à chaque fois que ta main a pris l\'option immédiate. Elle ne mesure ni une qualité ni un défaut — seulement le tempo que tu as choisi, scène par scène. C\'est un instantané de tes choix, pas une note.',

  ombreRelationnel: {
    V1:
      'À deux, le tout-de-suite répété laisse des chantiers ouverts : la conversation repoussée, l\'épargne reportée, le plan promis qui tarde. Ce qui aide : garder une pièce par semaine que tu décides à froid — et dire ce qui attend, au lieu de le laisser attendre.',
    V2:
      'À deux, l\'élan qui démarre vite décide parfois à chaud — et l\'autre suit un cap qui change en une semaine. Ce qui aide : ajouter une nuit de délai sur les choix qui engagent quelqu\'un d\'autre.',
    V3:
      'À deux, ton tempo se lit au jour le jour : l\'autre pose une question simple et reçoit une réponse qui dépend du jour. Ce qui aide : dire ton tempo à voix haute (« là, j\'attends ») — l\'équilibre se partage.',
    V4:
      'À deux, l\'attente qui calibre peut laisser la fenêtre se fermer avant la décision — et l\'autre se demander s\'il vaut le risque de ta main. Ce qui aide : garder une porte par mois où tu entres sans lire l\'étiquette.',
    V5:
      'À deux, un « plus tard » répété peut se vivre comme un « pas toi » : l\'autre attend sa part de maintenant. Ce qui aide : choisir ensemble un plaisir de maintenant par semaine — l\'attente retrouve son goût quand elle n\'est pas totale.',
  },

  suivante: '1.6',

  suite: {
    titre: 'Ton rapport au temps est posé.',
    intro:
      'Tu as montré comment ta main traverse le temps. Reste à voir comment ton esprit traverse les idées — et il ne pense pas comme tout le monde, lui non plus.',
    questions: [
      'Quand une belle occasion se présente, qu\'est-ce qui décide : ton envie ou le moment ?',
      'Ce que tu remets à plus tard, est-ce que tu y reviens vraiment ?',
    ],
    cta: 'Découvrir ma façon de penser',
  },
};

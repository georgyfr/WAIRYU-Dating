/**
 * Couche accompagnement de la quête 3.4 « Ton rapport à l'argent »
 * (Monde 4 « Ton terrain »).
 *
 * Rédigée par les agents quête (jamais verbatim du Livrable), ton Task 35 :
 * tutoiement, simple et littéral, phrases courtes, jamais un diagnostic,
 * jamais culpabilisant. Alimente l'entrée « 3.4 » du registre (quetes.ts).
 *
 * SENS DES BARRES (à ne pas inverser) : les 2 axes du scorer (quete-3-4.ts) —
 * DEP_D pleine = le coup de cœur passe et l'argent circule · DEP_D légère =
 * l'euro non dépensé dort tranquille · CALC_D pleine = les achats se
 * comparent et les comptes se lisent · CALC_D légère = les décisions se
 * prennent sur place, sans feuille de route.
 *
 * NEUTRALITÉ NORMATIVE ABSOLUE (doctrine du Livrable, l'argent n'est JAMAIS
 * jugé) : dépenser et épargner = deux façons égales d'habiter un budget ;
 * le calculé et le spontané = deux tempos, ni l'un ni l'autre vertu ou
 * défaut. Cinq jugements interdits au rendu : le dépensier n'est pas
 * « irresponsable », l'économe n'est pas « radin », le spontané n'est pas
 * « léger », le calculé n'est pas « froid », le central n'est pas
 * « indécis ». ZÉRO montant chiffré — l'argent se parle en situations (le
 * compte, l'achat, le projet), jamais en chiffres ; aucune leçon, aucun
 * palier moralisateur.
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots, aucun code/score
 * ni métadonnée moteur dans un texte rendu.
 */
import type { EntreeRegistre } from './quetes';

/** « 3.5 » est la quête suivante du Monde 4 — l'union IdQuete s'élargira au
 *  câblage du registre (quetes.ts, tâche d'intégration M4). Pont de typage
 *  en attendant l'extension du type (même convention que quete-2-1-def.ts). */
type IdSuivante34 = EntreeRegistre['suivante'];

export const DEF_34: EntreeRegistre = {
  sousTitre: "La quête de ton terrain : le quotidien de l'argent, sans leçon.",

  dims: [
    {
      key: 'DEP_D',
      nom: 'Ton tempo de dépense',
      sousLigne: "le coup de cœur et l'argent qui dort",
      genre: 'm',
      lecture:
        'Cette barre dit comment ton argent circule. Pleine : le coup de cœur passe, la dépense est une émotion vraie. Légère : l\'euro non dépensé dort tranquille, les envies attendent la nuit. Les deux manières se valent — la barre décrit un tempo, elle ne note rien.',
    },
    {
      key: 'CALC_D',
      nom: 'Ta façon de décider',
      sousLigne: 'à froid ou sur place',
      genre: 'f',
      lecture:
        'Cette barre dit comment tes achats se décident. Pleine : tu compares, tu chiffres, tes comptes se lisent au jour le jour. Légère : tu décides sur place, sans feuille de route. Les deux manières se valent — la barre décrit un tempo, elle ne note rien.',
    },
  ],

  accompagnement: {
    // SENS : fort = barre pleine · doux = barre légère — dépenser et épargner
    // se valent, calculé et spontané se valent (aucun palier moralisateur :
    // l'argent n'est jamais jugé, doctrine du Livrable).
    DEP_D: {
      fort:
        'Les coups de cœur passent chez toi : l\'argent porte des moments vrais. Ce qui aide : donner un mot d\'avance sur tes comptes — l\'élan se vit encore mieux quand il se lit.',
      equilibre:
        'Tu craques selon les mois et tu laisses dormir le reste : ta dépense choisit ses moments. C\'est un réglage à toi — il n\'a pas à ressembler à celui de personne.',
      doux:
        'L\'euro non dépensé dort tranquille : devant un coup de cœur, tu laisses passer la nuit. Ce n\'est pas de la privation — tu laisses venir. Ce qui aide : dire ce que ton non protège, pour qu\'il se lise comme un choix.',
    },
    CALC_D: {
      fort:
        'Tes achats se comparent et se décident à froid : tes comptes se lisent au jour le jour. Ce qui aide : laisser l\'autre écrire une ligne de la règle — une bonne raison convainc mieux quand elle se partage.',
      equilibre:
        'Tu compares quand ça compte et tu tranches sur place le reste du temps : ta décision choisit son tempo. C\'est un réglage à toi — à froid et sur place se valent.',
      doux:
        'Sur place, sans feuille de route : tes décisions suivent l\'élan du moment. Ce n\'est pas de la légèreté — ton flair tranche vite. Ce qui aide : dire en trois mots ce que ton oui ou ton non protège.',
    },
  },

  conseils: [
    'Relis ta carte à tête reposée : ton tempo d\'argent se vérifie dans les semaines ordinaires, pas les parfaites.',
    'Dépenser et épargner se valent : ta barre décrit un tempo, pas une responsabilité en degré.',
    'La dispute d\'argent se traverse mieux annoncée tôt : une règle de compte se dit, elle ne se devine pas.',
    'Aucun tempo ne te définit : il décrit ta réponse d\'aujourd\'hui, pas une case pour la vie.',
  ],

  commentLire:
    'Deux barres, et elles viennent de TES réponses : ta dépense et ta façon de décider. Elles vont de 0 à 100 — ni une note, ni un verdict. Plus pleine ne veut pas dire mieux : dépenser et épargner se valent, calculé et spontané se valent. Ce qu\'elles regardent et ce qu\'elles disent de toi sont écrits dessous — relis-les comme un portrait, pas un bulletin.',

  ombreRelationnel: {
    'CARTE-3.4-CŒUR-QUI-PAIE':
      'En relation, ta zone d\'ombre peut donner : des fins de mois serrées — et l\'autre qui devine où en est l\'argent commun. Ce qui aide : nommer une seule règle de compte, avant que le prochain coup de cœur ne décide seul.',
    'CARTE-3.4-RAISONNE':
      'En relation, ta zone d\'ombre peut donner : des bonnes raisons qui s\'accumulent — et l\'autre qui entre dans une règle déjà écrite. Ce qui aide : laisser l\'autre écrire une ligne de la règle, et la tenir autant que la tienne.',
    'CARTE-3.4-FLAIR':
      'En relation, ta zone d\'ombre peut donner : un non rapide — et l\'élan de l\'autre qui s\'arrête sans le voir venir. Ce qui aide : dire ce que ton non protège, le temps que l\'autre te suive.',
    'CARTE-3.4-BIEN-TENUE':
      'En relation, ta zone d\'ombre peut donner : un cadre qui protège — et une envie de l\'autre qui devient une demande de permission. Ce qui aide : ouvrir une enveloppe d\'envies à deux, où le désir a sa place réservée.',
    'CARTE-3.4-SAISONS':
      'En relation, ta zone d\'ombre peut donner : un tempo qui suit les mois — et l\'autre qui cherche ta règle sans la trouver. Ce qui aide : donner un mot d\'avance sur ta règle du mois, elle se dit en quelques mots.',
  },

  // Pont de typage : voir note au-dessus — l'intégration M4 étendra IdQuete.
  suivante: '3.5' as unknown as IdSuivante34,

  suite: {
    titre: 'La suite de ton voyage',
    intro:
      'Ton tempo d\'argent a parlé — sans leçon, comme promis. La prochaine étape regarde les gens autour de toi : l\'entourage que tu gardes, la place que tu laisses aux autres. Ton terrain s\'ouvre, pièce après pièce.',
    questions: [
      'Qui comptes-tu appeler quand une journée tourne mal — et qui t\'appelle ?',
      'Ton entourage te porte ou te pèse, ces derniers mois ?',
    ],
    cta: 'Regarder ton entourage',
  },
};

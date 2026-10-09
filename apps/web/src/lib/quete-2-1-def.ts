/**
 * Couche accompagnement de la quête 2.1 « Tes valeurs »
 * (Monde 3 « La Boussole »).
 *
 * Rédigée par les agents quête (jamais verbatim du Livrable), ton Task 35 :
 * tutoiement, simple et littéral, phrases courtes, jamais un diagnostic,
 * jamais culpabilisant. Alimente l'entrée « 2.1 » du registre (quetes.ts).
 *
 * SENS DES BARRES (à ne pas inverser) : les 4 blocs du scorer (quete-2-1.ts) —
 * ouverture pleine = le neuf t'appelle et tu y vas · affirmation pleine = tu
 * vises et tu décides · conservation pleine = tes repères te portent ·
 * depassement pleine = les autres passent avant ton programme.
 *
 * NEUTRALITÉ NORMATIVE ABSOLUE (doctrine du Livrable) : les 4 blocs se valent
 * — la structure des valeurs est circulaire, chaque bloc contrebalance son
 * opposé, aucune famille n'est l'idéal d'une autre. Une barre pleine n'est pas
 * un mérite, une barre légère n'est pas un manque. Les noms de valeurs
 * (Autonomie, Hédonisme, Universalisme…) et le framework public restent
 * moteur seul — jamais rendus (C3, verrou de citation).
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots, aucun code/score
 * ni métadonnée moteur dans un texte rendu.
 */
import type { EntreeRegistre } from './quetes';

/** « 2.2 » est la quête suivante du Monde 3 — l'union IdQuete s'élargira au
 *  câblage du registre (quetes.ts, tâche d'intégration). Pont de typage en
 *  attendant l'extension du type (même convention que quete-2-2-def.ts). */
type IdSuivante21 = EntreeRegistre['suivante'];

export const DEF_21: EntreeRegistre = {
  sousTitre: 'La quête de la boussole : ce qui guide vraiment tes choix.',

  dims: [
    {
      key: 'ouverture',
      nom: 'Ton ouverture au changement',
      sousLigne: "l'inconnu qui t'appelle",
      genre: 'f',
      lecture:
        'Cette barre dit comment l\'inconnu te parle. Pleine : le neuf t\'appelle et tu y vas. Légère : tu préfères ce que tu connais déjà. Les deux manières se valent — la barre décrit un appétit, elle ne note rien.',
    },
    {
      key: 'affirmation',
      nom: 'Ton affirmation de soi',
      sousLigne: 'les projets que tu mènes',
      genre: 'f',
      lecture:
        'Cette barre dit comment tes projets te portent. Pleine : tu vises, tu décides, ça se voit. Légère : tu avances pour d\'autres raisons, moins mesurables. Les deux manières se valent — la barre décrit une ambition, elle ne note rien.',
    },
    {
      key: 'conservation',
      nom: 'Ta conservation',
      sousLigne: 'les repères que tu tiens',
      genre: 'f',
      lecture:
        'Cette barre dit comment tes repères te portent. Pleine : les rythmes te rassurent et les traditions tiennent. Légère : le réglé te pèse et le changement passe. Les deux manières se valent — la barre décrit un socle, elle ne note rien.',
    },
    {
      key: 'depassement',
      nom: 'Ton dépassement de soi',
      sousLigne: 'la part que tu donnes',
      genre: 'm',
      lecture:
        'Cette barre dit comment les autres comptent dans ta journée. Pleine : la demande d\'aide passe avant ton programme. Légère : ton programme passe d\'abord. Les deux manières se valent — la barre décrit une place, elle ne note rien.',
    },
  ],

  accompagnement: {
    // SENS : fort = barre pleine · doux = barre légère — les 4 blocs se valent,
    // aucun palier n'est flatté ni blâmé (neutralité normative du Livrable).
    ouverture: {
      fort:
        'L\'inconnu t\'appelle et tu y vas : tes semaines laissent entrer le neuf sans effort. Ce qui aide : nommer ce que tu veux garder — ce qui dure a besoin de toi aussi, et ça se dit.',
      equilibre:
        'Tu appelles le neuf quand il compte et tu gardes tes repères sans y penser : ton ouverture choisit ses moments. C\'est un réglage à toi — il n\'a pas à ressembler à celui de personne.',
      doux:
        'Le connu te va bien : tu choisis ce que tu connais, et l\'inconnu peut attendre. Ce n\'est pas de la peur — ton confort est un choix. Si un jour le neuf t\'appelle, il s\'installe par petites touches.',
    },
    affirmation: {
      fort:
        'Tu vises, tu décides, ça avance : tes projets se voient et ta place se sent. Ce qui aide : vérifier que les autres marchent à côté de toi — et pas seulement derrière.',
      equilibre:
        'Tu vises ce qui compte et tu laisses courir le reste : ton énergie choisit ses chantiers. C\'est un réglage à toi — ni tout en avant, ni en retrait.',
      doux:
        'Les résultats visibles ne te meuvent pas beaucoup : tu avances pour des raisons moins mesurables. Ce n\'est pas un manque d\'ambition — ta jauge est différente. Nomme ce qui te fait vraiment avancer : c\'est lui, ta vraie boussole.',
    },
    conservation: {
      fort:
        'Tes repères tiennent : les rythmes te rassurent, les traditions t\'habitent, le connu te construit. Ce qui aide : laisser entrer l\'imprévu de temps en temps — un socle sert aussi à partir.',
      equilibre:
        'Tu gardes ce qui te tient et tu laisses vivre le reste : ta continuité choisit ses rituels. C\'est un réglage à toi — le cadre protège, il n\'enferme pas.',
      doux:
        'Les repères fixes te pèsent plus qu\'ils ne te portent : tu ajustes, tu changes, tu ne t\'installes pas. Ce n\'est pas de l\'instabilité — ton équilibre bouge. Un seul rituel, choisi par toi : c\'est lui qui tiendra les autres.',
    },
    depassement: {
      fort:
        'Les autres passent avant ton programme : tu vois la demande avant qu\'elle soit dite. Ce qui aide : garder une place pour ton propre cap — ton programme du jour compte aussi.',
      equilibre:
        'Tu donnes aux tiens et tu tiens ton programme : ton attention choisit ses moments. C\'est un réglage à toi — donner sans s\'oublier, tenir sans se fermer.',
      doux:
        'Ton programme d\'abord : les demandes attendent, et le cercle reste proche. Ce n\'est pas de l\'égoïsme — ta journée se défend. Une demande accueillie, petite et maintenant : c\'est comme ça qu\'un cercle s\'ouvre.',
    },
  },

  conseils: [
    'Relis ta carte à tête reposée : tes valeurs se vérifient dans les jours ordinaires, pas les parfaits.',
    'Aucune famille de valeurs n\'en vaut une autre : les quatre se complètent, aucune ne te note.',
    'Quand deux barres se contrarient — viser et servir, garder et bouger — nomme le dosage que tu vis aujourd\'hui.',
    'Aucune barre ne te définit : elle décrit ta réponse d\'aujourd\'hui, pas une case pour toujours.',
  ],

  commentLire:
    'Quatre barres, et elles viennent de TES réponses — quatre familles de valeurs, chacune à sa façon. Elles vont de 0 à 100 — ni une note, ni un verdict. Plus pleine ne veut pas dire mieux : les quatre familles se valent. Ce qu\'elles regardent et ce qu\'elles disent de toi sont écrits dessous — relis-les comme un portrait, pas un bulletin.',

  ombreRelationnel: {
    'CARTE-2.1-OUV-APA':
      'En relation, ta zone d\'ombre peut donner : ce qui dure attend derrière le neuf — et l\'autre porte l\'attente sans la comprendre. Ce qui aide : dire à voix haute ce que tu veux garder, avant que le prochain départ ne décide pour vous deux.',
    'CARTE-2.1-OUV-TEN':
      'En relation, ta zone d\'ombre peut donner : une vie faite de commencements — et l\'autre qui finit rarement avec toi. Ce qui aide : achever un projet commun avant d\'en ouvrir un autre — petit, daté, terminé.',
    'CARTE-2.1-AFF-APA':
      'En relation, ta zone d\'ombre peut donner : un cap clair que l\'autre suit sans l\'avoir choisi. Ce qui aide : poser la question avant la proposition — et tenir la réponse autant que le plan.',
    'CARTE-2.1-AFF-TEN':
      'En relation, ta zone d\'ombre peut donner : des objectifs qui priment sur les gens — ceux qui t\'aiment attendent dans ta salle d\'attente. Ce qui aide : une heure commune, bloquée et protégée, avant que le prochain objectif ne la prenne.',
    'CARTE-2.1-CON-APA':
      'En relation, ta zone d\'ombre peut donner : un socle si confortable qu\'on y reste là où il faudrait partir. Ce qui aide : nommer ce qui attend de bouger — et lui donner une date, même petite.',
    'CARTE-2.1-CON-TEN':
      'En relation, ta zone d\'ombre peut donner : un cadre qui protège — et ce que tu tiens trop fort finit par te tenir. Ce qui aide : distinguer le rituel que tu défends de celui que tu offres au changement.',
    'CARTE-2.1-DEP-APA':
      'En relation, ta zone d\'ombre peut donner : un don devenu habitude — un compte que tu tiens et que l\'autre ignore. Ce qui aide : formuler une demande pour toi, cette semaine, avant que la facture ne sorte seule.',
    'CARTE-2.1-DEP-TEN':
      'En relation, ta zone d\'ombre peut donner : un agenda rempli dehors — et le temps à deux glissé dans les interstices. Ce qui aide : bloquer une heure pour vous deux, avant que les demandes ne décident à ta place.',
  },

  // Pont de typage : voir note au-dessus — l'intégration M3 étendra IdQuete.
  suivante: '2.2' as unknown as IdSuivante21,

  suite: {
    titre: 'La suite de ton voyage',
    intro:
      'Tu sais maintenant ce qui te guide : tes quatre familles de valeurs ont parlé. La prochaine étape regarde la place que tu donnes au sens — spirituel ou non. Et là aussi, l\'absence est une réponse.',
    questions: [
      'Qu\'est-ce qui te fait tenir quand personne ne regarde : une promesse, une habitude, une conviction ?',
      'Y a-t-il quelque chose de plus grand que toi qui compte dans tes jours — ou pas du tout ?',
    ],
    cta: 'Exprimer ta spiritualité — ou son absence',
  },
};

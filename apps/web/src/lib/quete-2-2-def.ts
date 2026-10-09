/**
 * Couche accompagnement de la quête 2.2 « Ta place pour la spiritualité »
 * (Monde 3 « La Boussole »).
 *
 * Rédigée par les agents quête (jamais verbatim du Livrable), ton Task 35 :
 * tutoiement, simple et littéral, phrases courtes, jamais un diagnostic,
 * jamais culpabilisant. Alimente l'entrée « 2.2 » du registre (quetes.ts).
 *
 * NEUTRALITÉ ABSOLUE (doctrine capitale du Livrable — à ne pas inverser) :
 * pratiquer et ne pas pratiquer = deux façons égales d'habiter la
 * spiritualité. Aucun palier n'est flatté ni blâmé : une barre pleine dit une
 * place vécue dans la semaine, une barre légère dit les grandes heures — les
 * deux se valent, l'absence de place n'est pas un vide à combler. AUCUNE
 * croyance nommée : jamais dieu, confession, texte ni culte — la quête parle
 * de PLACE, de SEMAINE, de DÉCISIONS, de COUPLE. La ligne rouge religieuse
 * (dealbreaker DÉCLARÉ) vit en 2.3-04 — cette couche ne l'évoque jamais.
 *
 * Les clés des dims = les angles du scorer (quete-2-2.ts), verbatim du
 * tableau 01 du Livrable.
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots, aucun code/score
 * ni métadonnée moteur dans un texte rendu.
 */
import type { EntreeRegistre } from './quetes';

/** « 2.3 » est la quête suivante du Monde 3 — l'union IdQuete s'élargira au
 *  câblage du registre (quetes.ts, tâche d'intégration). Pont de typage en
 *  attendant l'extension du type. */
type IdSuivante22 = EntreeRegistre['suivante'];

export const DEF_22: EntreeRegistre = {
  sousTitre: 'La quête de la boussole : la place que tu donnes à la spiritualité.',

  dims: [
    {
      key: 'pratique réelle vs culturelle',
      nom: 'Ta place dans la semaine',
      sousLigne: 'le quotidien ou les grandes heures',
      genre: 'f',
      lecture:
        'Cette barre dit où ta spiritualité se vit. Pleine : dans les jours ordinaires, la semaine. Légère : les fêtes et les grandes heures. Les deux manières se valent — la barre décrit un rythme, elle ne note rien.',
    },
    {
      key: 'place dans les choix de vie',
      nom: 'Ta place dans les choix',
      sousLigne: 'ce qui pèse dans tes grandes décisions',
      genre: 'f',
      lecture:
        'Cette barre dit ce qui pèse quand tu décides. Pleine : ta spiritualité compte dans tes grandes décisions. Légère : elles passent sans elle. Les deux manières de décider se valent — la barre décrit une boussole intime, elle ne note rien.',
    },
    {
      key: 'transmission dans un couple',
      nom: 'Ta place en couple',
      sousLigne: 'le partage et la transmission',
      genre: 'f',
      lecture:
        'Cette barre dit ce que le partage représente pour toi. Pleine : transmettre et vivre ta spiritualité à deux compte pour toi. Légère : la transmission reste en retrait — un choix assumé. Les deux intentions se valent — la barre décrit une préférence, elle ne note rien.',
    },
  ],

  accompagnement: {
    // SENS : fort = place vécue dans la semaine · doux = place vécue aux grandes
    // heures — les deux se valent, aucun palier n'est flatté ni blâmé
    // (neutralité absolue du Livrable).
    'pratique réelle vs culturelle': {
      fort:
        'Ta place se vit dans les jours ordinaires : un temps, un geste, une habitude qui tient. Ce qui aide : laisser les grandes heures rester des fêtes — elles n\'ont rien à prouver.',
      equilibre:
        'Ta place se partage entre le quotidien et les grandes heures : ni tout le temps, ni seulement les fêtes. C\'est un rythme à toi — il n\'a pas à ressembler à celui de personne.',
      doux:
        'Ta place vit aux grandes heures : fêtes, saisons, gestes hérités. Ce n\'est pas de la surface — le lien se fait là aussi. Si un jour le quotidien t\'appelle, il s\'installe par petites touches.',
    },
    'place dans les choix de vie': {
      fort:
        'Tes grandes décisions écoutent ta spiritualité : elle pèse dans ce que tu choisis. Ce qui aide : la laisser conseiller sans tout trancher — d\'autres voix comptent aussi, et c\'est normal.',
      equilibre:
        'Ta spiritualité compte parmi les voix que tu consultes : ni muette, ni seule à parler. C\'est un équilibre — chaque décision reste la tienne.',
      doux:
        'Tes grandes décisions passent sans ta spiritualité : tu décides avec d\'autres boussoles — raison, cœur, expérience. Ce choix se respecte comme un autre. Si un jour elle doit peser, elle est là.',
    },
    'transmission dans un couple': {
      fort:
        'Partager ta spiritualité à deux compte pour toi : c\'est une façon de dire l\'essentiel. Ce qui aide : proposer, jamais imposer — un partage voulu ne réclame rien.',
      equilibre:
        'La transmission compte, sans être le cœur de tout : tu verrais bien un partage, tu ne l\'exiges pas. C\'est une porte ouverte — elle se franchira si elle doit.',
      doux:
        'Transmettre n\'est pas ton affaire — et c\'est une position entière, pas un vide. Le lien à deux se bâtit avec d\'autres ciments : projets, humour, présence. Ce qui aide : le dire tôt, simplement — ça évite à l\'autre de deviner.',
    },
  },

  conseils: [
    'Relis tes barres à tête reposée : elles décrivent ta place d\'aujourd\'hui, pas une case pour toujours.',
    'Aucune place n\'est plus vraie qu\'une autre : la tienne se respecte comme elle est.',
    'En couple ou en chemin, dis ta place tôt : ce qui compte pour toi se dit, il ne se devine pas.',
    'Tes barres viennent de tes réponses : relis-les comme un portrait, pas un bulletin.',
  ],

  commentLire:
    'Trois barres, et elles viennent de TES réponses : la semaine, les décisions, le couple — trois angles de ta place. Elles vont de 0 à 100 — ni une note, ni un verdict. Plus pleine ne veut pas dire mieux : chaque place se respecte comme elle est. Ce qu\'elles regardent et ce qu\'elles disent de toi sont écrits dessous — relis-les comme un portrait, pas un bulletin.',

  ombreRelationnel: {
    'CARTE-2.2-CLOCHES':
      'En relation, ta zone d\'ombre peut donner : le même toit, deux regards — et un autre qui se sent attendu·e. Ce qui aide : nommer à voix haute ce qui se partage et ce qui se respecte.',
    'CARTE-2.2-FETES':
      'En relation, ta zone d\'ombre peut donner : des fêtes partagées et des interrogations solitaires. Ce qui aide : dire à l\'autre ce que la fête recouvre — avec tes mots, simplement.',
    'CARTE-2.2-CLAIRIERE':
      'En relation, ta zone d\'ombre peut donner : moins de jalons tout faits — le sens se bâtit à la main. Ce qui aide : choisir un rendez-vous commun par saison, et le tenir.',
  },
  suivante: '2.3' as unknown as IdSuivante22,

  suite: {
    titre: 'La suite de ton voyage',
    intro:
      'Tu sais maintenant quelle place la spiritualité occupe chez toi — et elle se respecte comme elle est. La prochaine étape regarde ce qui ne se négocie pas : tes lignes rouges, celles qu\'on ne traverse pas. Les poser, c\'est déjà dire qui pourra marcher près de toi — et comment.',
    questions: [
      'Qu\'est-ce qui, dans ta vie, ne se négocie pas — même à deux ?',
      'Quelle différence te semble irréconciliable — et laquelle ne l\'est qu\'en apparence ?',
    ],
    cta: 'Poser tes lignes rouges',
  },
};

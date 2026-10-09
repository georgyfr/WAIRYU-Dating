/**
 * Couche accompagnement de la quête 3.3 « Ton temps libre »
 * (Monde 4 « Ton Terrain »).
 *
 * Rédigée par les agents quête (jamais verbatim du Livrable), ton Task 35 :
 * tutoiement, simple et littéral, phrases courtes, jamais un diagnostic,
 * jamais culpabilisant. Alimente l'entrée « 3.3 » du registre (quetes.ts).
 *
 * NEUTRALITÉ DU MODE (doctrine capitale du Livrable — à ne pas inverser) :
 * sortir et rester = deux façons égales de se nourrir. Le centrifuge n'est
 * pas « instable », le centripète n'est pas « casanier-rétréci », le mixte
 * n'est pas « indécis » — les trois jugements sont interdits au rendu. La
 * variété des loisirs est un mode d'exploration à part entière (décision 3
 * du 01), le solo assumé n'est pas un isolement, la friction n'apparaît
 * qu'au croisement, en information conversationnelle.
 *
 * L'HOMOGAMIE EN INFORMATION, JAMAIS UNE NORME : la recherche documente
 * l'intérêt d'au moins une activité de fond partagée — au registre
 * fréquentiel, côté moteur. Cette couche la propose comme une information,
 * jamais comme une obligation (« il faut partager » est interdit au rendu).
 *
 * Les clés des dims = les clés du scorer (quete-3-3.ts) : 'mode' (MODE_D) et
 * 'fond' (FOND_D) — les sigles restent moteur seul, jamais rendus.
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots, aucun code/score
 * ni métadonnée moteur dans un texte rendu.
 */
import type { EntreeRegistre } from './quetes';

/** « 3.4 » est la quête suivante du Monde 4 — l'union IdQuete s'élargira au
 *  câblage du registre (quetes.ts, tâche d'intégration M4). Pont de typage
 *  en attendant l'extension du type (même convention que quete-2-1-def.ts). */
type IdSuivante33 = EntreeRegistre['suivante'];

export const DEF_33: EntreeRegistre = {
  sousTitre: 'La quête du terrain : ce que ton temps libre fait de ton énergie.',

  dims: [
    {
      key: 'mode',
      nom: 'Ton mode de recharge',
      sousLigne: 'le dehors ou le chez-toi',
      genre: 'm',
      lecture:
        'Cette barre dit d\'où vient ton énergie quand la semaine s\'arrête. Pleine : tu ressors et le dehors te remplit. Légère : tu te nourris chez toi, derrière ta porte. Les deux manières se valent — sortir et rester sont deux façons égales de se nourrir. La barre décrit une source, elle ne note rien.',
    },
    {
      key: 'fond',
      nom: 'Le fond de tes loisirs',
      sousLigne: 'l\'ancrage et le partage',
      genre: 'm',
      lecture:
        'Cette barre dit ce qui porte tes loisirs dans la durée. Pleine : une activité de fond t\'ancre et se vit avec d\'autres. Légère : tes loisirs changent au gré des envies — une façon d\'explorer, à part entière. Les deux manières se valent — la barre décrit un ancrage, elle ne note rien.',
    },
  ],

  accompagnement: {
    // SENS : mode — fort = nourri dehors · doux = nourri chez toi ; fond —
    // fort = ancré et partagé · doux = au gré des envies. Les deux côtés de
    // chaque barre se valent : aucun palier n'est flatté ni blâmé (neutralité
    // du mode, doctrine du Livrable).
    mode: {
      fort:
        'Le dehors te recharge : après une semaine chargée, tu ressors et le monde te remplit. Ce qui aide : ramener une part de ce temps à deux — la ressource circule mieux quand elle se raconte.',
      equilibre:
        'Tantôt le dehors, tantôt le chez-toi : ton mode suit tes semaines. C\'est un réglage à toi — il n\'a pas à ressembler à celui de personne. Le dire en trois mots aide l\'autre à te suivre.',
      doux:
        'Ta ressource se recharge derrière ta porte : le calme est une façon entière de se nourrir. Ce n\'est ni un manque ni un repli — c\'est ta maison qui te rend à toi. Si le dehors t\'appelle, une fenêtre ouverte à deux suffit.',
    },
    fond: {
      fort:
        'Une activité de fond te porte : elle tient dans la durée et se vit avec d\'autres. Ce qui aide : la garder vivante — un loisir qui porte se nourrit d\'envies, pas de devoirs.',
      equilibre:
        'Ton ancrage flotte entre le fond et l\'envie du moment : un peu des deux. C\'est un rythme à toi — les loisirs se choisissent, ils ne se justifient pas.',
      doux:
        'Tes loisirs changent au gré des envies : la variété est un mode d\'exploration, à part entière. Ce n\'est pas de la dispersion — tu essaies, tu poses, tu repars. Ce qui t\'ancre se dessine en marchant.',
    },
  },

  conseils: [
    'Relis ta carte à tête reposée : ton mode se vérifie dans les week-ends ordinaires, pas les parfaits.',
    'Sortir et rester se valent : aucun des deux ne vaut mieux, ils ne nourrissent pas la même chose.',
    'Si deux modes se croisent, nommez-les tôt : la friction se traverse mieux annoncée que devinée.',
    'Tes barres viennent de tes réponses : relis-les comme un portrait, pas un bulletin.',
  ],

  commentLire:
    'Deux barres, et elles viennent de TES réponses : d\'où vient ton énergie, et ce qui porte tes loisirs. Elles vont de 0 à 100 — ni une note, ni un verdict. Plus pleine ne veut pas dire mieux : les deux façons de se nourrir se valent. Ce qu\'elles regardent et ce qu\'elles disent de toi sont écrits dessous — relis-les comme un portrait, pas un bulletin.',

  ombreRelationnel: {
    'CARTE-3.3-GRAND-AIR':
      'En relation, ta zone d\'ombre peut donner : le dehors qui emmène — et quelqu\'un qui attend que tu rentres. Ce qui aide : ramener une part de ce temps à deux, ou raconter ce que le dehors t\'a donné.',
    'CARTE-3.3-ENTRE-DEUX-RIVES':
      'En relation, ta zone d\'ombre peut donner : un mode qui se lit mal de l\'extérieur — l\'autre prépare deux scénarios. Ce qui aide : dire ton mode de la semaine en trois mots — la convention se crée en la nommant.',
    'CARTE-3.3-CHEMINEE':
      'En relation, ta zone d\'ombre peut donner : un cocon qui ferme — et quelqu\'un qui propose une sortie. Ce qui aide : accueillir une fenêtre de dehors à deux — le dedans s\'ouvre sans se vider.',
  },

  // Pont de typage : voir note au-dessus — l'intégration M4 étendra IdQuete.
  suivante: '3.4' as unknown as IdSuivante33,

  suite: {
    titre: 'La suite de ton voyage',
    intro:
      'Tu sais maintenant d\'où vient ton énergie quand la semaine s\'arrête. La prochaine étape regarde l\'argent : celui qui rentre, celui qui sort, et ce que tu en décides. Là encore, il n\'y a rien à corriger.',
    questions: [
      'Que fais-tu de ton argent libre : l\'épargner, le dépenser, le partager ?',
      'Quelle dépense te fait dire « oui » sans hésiter — et laquelle te fait reculer ?',
    ],
    cta: 'Parler de ton rapport à l\'argent',
  },
};

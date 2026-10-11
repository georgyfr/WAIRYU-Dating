/**
 * Couche accompagnement de la quête 5.6 « Après un désaccord »
 * (Monde 7 « Face aux Tempêtes » · 💎 PREMIUM · accès libre).
 *
 * Rédigée (jamais verbatim du Livrable), ton Task 35 : tutoiement, simple et
 * littéral, phrases courtes, jamais un diagnostic, jamais culpabilisant.
 * Alimente l'entrée « 5.6 » du registre (quetes.ts).
 *
 * GABARIT OUVERT (doctrine capitale du Livrable — à ne pas inverser) : le
 * niveau se travaille, « à travailler » se formule comme une PORTE (un
 * muscle, ça se travaille), jamais comme un mur ; « silencieuse » décrit un
 * silence, il ne prédit rien — LE SILENCE N'EST PAS UN ÉCHEC (il protège : il
 * évite d'enflammer ce qui est déjà vif). La réparation se mesure à ce qui se
 * passe APRÈS le désaccord — jamais à la fréquence des disputes. Aucune
 * hiérarchie des personnes : réparer tôt, réparer tard ou se taire se valent
 * comme descriptions ; l'ombre = le COÛT (pour soi ET pour l'autre), jamais
 * un blâme. Zéro diagnostic, zéro étiquette, registre probabiliste.
 *
 * La clé des dims = la clé du scorer (quete-5-6.ts, moyenne unique).
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots, aucun code/score
 * ni métadonnée moteur dans un texte rendu.
 */
import type { EntreeRegistre } from './quetes';

export const DEF_56: EntreeRegistre = {
  sousTitre:
    'La quête de ce qui se passe après : ta façon de revenir, racontée sans note et sans juge.',

  dims: [
    {
      // SIG-5.6-01 — UNE moyenne unique (5 items, 1 item/capacité) · le nom
      // rendu est celui du Livrable (« Ta capacité de réparation ») : le mot
      // « réparation » est rendu par les cartes et la fenêtre F1 — le nommage
      // interne des signaux reste hors rendu.
      key: 'reparation',
      nom: 'Ta capacité de réparation',
      sousLigne: 'le muscle qui revient après un désaccord',
      genre: 'f',
      lecture:
        'Cette barre dit ta façon de revenir après un désaccord : t\'excuser, faire le premier pas, désamorcer, tourner la page, recevoir l\'excuse. Pleine : tu sais revenir — un geste, un trait d\'humour, une excuse reçue à son compte. Légère : la réparation arrive peu, en retard, ou reste silencieuse — un silence qui protège. Les deux se valent — la barre décrit un muscle, elle ne note rien : un muscle, ça se travaille.',
    },
  ],

  accompagnement: {
    // SENS : fort = tu sais revenir · doux = la réparation reste silencieuse
    // — les deux se valent, aucun palier flatté ni blâmé (gabarit ouvert).
    // Le palier doux le dit explicitement : le silence n'est pas un échec.
    reparation: {
      fort:
        'Après un désaccord, tu sais revenir : un geste, un trait d\'humour, une excuse reçue à son compte. C\'est un muscle qui se voit. Ce qui aide : regarder qui fait le premier pas — et laisser le camp changer.',
      equilibre:
        'Tes réparations existent, mais elles arrivent en retard, ou à contrecœur. C\'est déjà un muscle — il demande un déclic, pas une conversion. Ce qui aide : dire « c\'est réglé » à voix haute, puis laisser la phrase travailler.',
      doux:
        'Après une dispute, tu attends souvent que l\'autre fasse le premier pas. Ton silence protège : il évite d\'enflammer ce qui est déjà vif — et ce n\'est pas un échec. Ce qui aide : oser un premier pas, même petit — il suffit à ouvrir la porte.',
    },
  },

  conseils: [
    'Ce n\'est pas la fréquence des disputes qui pèse — c\'est ce qui se passe après.',
    'Un niveau de réparation se travaille, comme un muscle — la barre décrit, elle ne note rien.',
    'Le silence d\'après n\'est pas un échec : c\'est une façon de protéger — il peut changer de ton.',
    'Ta carte se partage si tu veux : ta façon de revenir est une façon d\'être trouvé, pas une note.',
  ],

  commentLire:
    'Une seule barre, et elle vient de TES réponses : ta capacité de réparation — ce qui se passe après un désaccord. ' +
    'Elle va de 0 à 100 — ni une note, ni un verdict. ' +
    'Plus pleine ne veut pas dire mieux : chaque façon de réparer a sa grâce et son coût. ' +
    'Si la barre est légère, rien n\'est scellé — un muscle, ça se travaille. ' +
    'Relis-la comme un portrait, pas un tribunal.',

  ombreRelationnel: {
    'CARTE-5.6-QUI-TIENT':
      'En relation, ta zone d\'ombre peut donner : un premier pas qui revient à une seule personne. Pour toi : la fatigue d\'être le seul à revenir. Pour l\'autre : ses propres excuses qui ne s\'exercent plus. Ce qui aide : laisser parfois à l\'autre le pas de la porte.',
    'CARTE-5.6-SE-TRAVAILLE':
      'En relation, ta zone d\'ombre peut donner : une dispute réglée qui repasse encore dans ta tête. Pour toi : des lendemains qui paient pour la veille. Pour l\'autre : une excuse acceptée à moitié, qu\'il sent traîner. Ce qui aide : dire « c\'est réglé » à voix haute — puis laisser la page rester tournée.',
    'CARTE-5.6-SILENCIEUSE':
      'En relation, ta zone d\'ombre peut donner : le mur de silence quand personne ne revient. Pour toi : des disputes qui s\'entassent au lieu de se finir. Pour l\'autre : frapper à une porte qui tarde à s\'ouvrir. Ce qui aide : un premier pas, même malhabile, même petit — il change le ton.',
  },

  // DERNIÈRE quête ouverte du Monde 7 « Face aux Tempêtes » — la chaîne du
  // monde se referme ici (précédent 5.7 en fin de M6) : le Monde suivant est
  // opt-in et sensible, il n'est ni construit ni nommable ici. AUCUN id de
  // suite n'est inventé : suivante = null.
  suivante: null,

  suite: {
    titre: 'Après les tempêtes',
    intro:
      'Les tempêtes sont passées : tu as vu ce qui frotte, ce qui se dit, et ce qui se répare après. ' +
      'Rien n\'est scellé ici — chaque découverte reste un muscle qui se travaille. ' +
      'La suite du voyage poursuit ton portrait, à ton rythme.',
    questions: [
      'Qu\'est-ce que ce monde t\'a appris sur toi — et que veux-tu garder de ce qui se passe après ?',
      'Quand le prochain désaccord arrive, quel premier pas veux-tu essayer — un mot, un temps, un geste ?',
    ],
    // CTA générique : le monde suivant est opt-in et sensible — le texte ne
    // présuppose rien de son contenu (zéro teaser).
    cta: 'Continuer le voyage',
  },
};

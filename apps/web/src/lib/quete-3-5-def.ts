/**
 * Couche accompagnement de la quête 3.5 « Ton entourage »
 * (Monde 4 « Ton Terrain »).
 *
 * Rédigée par les agents quête (jamais verbatim du Livrable), ton Task 35 :
 * tutoiement, présent, simple et littéral, phrases courtes, jamais un
 * diagnostic, jamais culpabilisant. Alimente l'entrée « 3.5 » du registre
 * (quetes.ts, câblage à l'intégration M4).
 *
 * SENS DE LA BARRE (à ne pas inverser) : la clé `entour` du scorer
 * (quete-3-5.ts) — pleine = la table s'élargit (les proches comptent dans
 * les décisions, les week-ends accueillent le cercle) · légère = le
 * tête-à-tête gardé (les décisions entre vous, les week-ends se réservent).
 *
 * NEUTRALITÉ NORMATIVE ABSOLUE (doctrine du Livrable) : entourage dense et
 * cercle étroit se valent — la qualité n'est pas la quantité, aucune
 * hiérarchie. La différenciation n'est pas l'indépendance : des places,
 * jamais des degrés de maturité ; le fusionnel jamais « collé », l'indépendant
 * jamais « distant », l'équilibre jamais « tiède ». ZÉRO personne nommée :
 * la famille se parle en situations (la fête, le dimanche, l'appel), jamais
 * en personnages. La friction des entourages reste MOTEUR SEUL — jamais
 * rendue, jamais un seuil, jamais un chiffre.
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots, aucun code/score
 * ni métadonnée moteur dans un texte rendu.
 */
import type { EntreeRegistre, IdQuete } from './quetes';

/** « 3.6 » est la quête suivante du Monde 4 — « Le choix visuel ». L'union
 *  `IdQuete` du registre (quetes.ts) ne porte encore que les ids livrés
 *  (séries 1.x et 2.x) : elle s'élargira à l'intégration du Monde 4 — la
 *  valeur de chaîne reste exacte d'ici là (même convention de pont que
 *  quete-2-7-def.ts). */
const SUIVANTE: IdQuete = '3.6' as unknown as IdQuete;

export const DEF_35: EntreeRegistre = {
  sousTitre:
    "La quête du terrain : la place que ta famille et tes amis gardent dans ta vie à deux.",

  dims: [
    {
      key: 'entour',
      nom: 'Le poids de ton entourage',
      sousLigne: 'la place que tu lui donnes',
      genre: 'm',
      lecture:
        "Cette barre dit la place que ta famille et tes amis tiennent dans ta vie de couple. Pleine : ta table s'élargit — les décisions se partagent avec eux, les week-ends accueillent le cercle. Au milieu : tu fais le pont entre les deux rives. Légère : ta vie à deux garde son territoire, et tu le nommes. Une table large et un cercle étroit se valent : la barre décrit une place, elle ne note pas une personne. La qualité d'un lien ne se mesure pas à sa quantité.",
    },
  ],

  accompagnement: {
    // SENS : fort = table élargie · doux = territoire gardé — entourage dense
    // et cercle étroit se valent (la qualité n'est pas la quantité, aucune
    // hiérarchie — doctrine du Livrable, aucun palier flatté ni blâmé).
    entour: {
      fort:
        "Ta table s'élargit : tes proches comptent dans tes décisions et tes week-ends les accueillent. Ce n'est pas trop — c'est ta façon d'habiter un entourage. Ta vigilance : la personne qui arrive gagne sa place quand tu la prépares — dis tes rendez-vous tôt, à deux.",
      equilibre:
        "Ton entourage compte sans envahir : tu connais la valeur des deux rives et tu fais le pont. C'est une place complète, pas une demi-mesure. Ta vigilance : ta règle des fêtes se dit — elle ne se devine pas, même quand elle te semble évidente.",
      doux:
        "Ta vie à deux garde son territoire : les décisions se prennent entre vous, les week-ends se réservent. C'est une géographie choisie, pas une coupure. Ta vigilance : nomme la place que les autres peuvent habiter — la clarté est un don, elle se vit mieux dite que devinée.",
    },
  },

  conseils: [
    "Relis ta carte à tête reposée : la place de ton entourage se vérifie dans les dimanches ordinaires, pas les fêtes parfaites.",
    "Une table large et un cercle étroit se valent : la quantité ne dit rien de la qualité des liens.",
    "Ce qui se dit tôt se vit mieux : ta règle des fêtes, des dimanches, des invitations — dis-la avant que la vague arrive.",
    "Aucune barre ne te définit : elle décrit ta réponse d'aujourd'hui, pas une case pour toujours.",
  ],

  commentLire:
    "Une barre, et elle vient de TES réponses : la place que ta famille et tes amis tiennent dans ta vie de couple. Elle va de 0 à 100 — ni une note, ni un verdict. Plus pleine ne veut pas dire mieux : une table élargie et un tête-à-tête gardé sont deux façons égales d'habiter un entourage. Ce qu'elle regarde et ce qu'elle dit de toi sont écrits dessous — relis-la comme un portrait, pas un bulletin.",

  ombreRelationnel: {
    'CARTE-3.5-TABLE-ELARGIE':
      "En relation, ta zone d'ombre peut donner : une table qui déborde — la personne qui partage ta vie doit gagner sa chaise. Ce qui aide : négocier tôt, à deux, les fêtes, les dimanches et les devoirs envers les familles.",
    'CARTE-3.5-DEUX-RIVES':
      "En relation, ta zone d'ombre peut donner : le pont qui reçoit les vagues des deux rives. Qui partage ta vie te confie les négociations. Ce qui aide : dire ta règle des fêtes à voix haute, avant que la vague arrive.",
    'CARTE-3.5-TERRITOIRE':
      "En relation, ta zone d'ombre peut donner : un territoire que la famille de l'autre cherche à habiter sans savoir où. Ce qui aide : nommer la place accueillie — elle se vit mieux dite que devinée.",
  },

  // Pont de typage : voir note au-dessus — l'intégration M4 étendra IdQuete.
  suivante: SUIVANTE,

  suite: {
    titre: 'Ta place est posée.',
    intro:
      "Tu as dit la place que ta famille et tes amis garderont. La prochaine quête ne se répond pas en mots : huit paires d'images à choisir, et ta première impulsion dira le reste.",
    questions: [
      "Devant deux intérieurs, lequel t'appelle sans que tu saches pourquoi ?",
      "Que raconte la maison où tu te vois un dimanche ordinaire ?",
    ],
    cta: 'Découvrir « Le choix visuel »',
  },
};

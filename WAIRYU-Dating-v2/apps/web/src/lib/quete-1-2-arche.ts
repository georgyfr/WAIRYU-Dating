/**
 * Archétypes de la quête 1.2 — Ta façon de t'attacher (Task 33, demande fondateur).
 * Présentation GÉNÉRALE de chaque type : ce que ce type peut généralement apporter,
 * son ombre, en relation, son point d'équilibre.
 *
 * RÉORIENTATION (suite du malaise Task 32) : la révélation ne doit plus affirmer
 * des vérités personnelles que la quête ne mesure pas. Ici on parle du TYPE
 * d'abord — « ce type de personnalité peut généralement… », « certaines
 * personnes… », « elles… » — sans tutoiement, sans révélation intime, sans
 * répéter le nom de la carte. Le profil personnalisé (preuves, besoins,
 * ressenti, langage — quete-1-2-plus.ts) vient ENSUITE, tendance par tendance.
 *
 * SENSIBILITÉ ATTACHEMENT : la quête parle d'une façon d'aimer et de s'attacher
 * (réassurance, espace, rythme du lien), jamais d'un diagnostic. L'ombre décrit
 * des situations de lien qui peuvent apparaître (silences lus comme de la
 * distance, pauses prises en silence, signaux contradictoires), pas des défauts
 * ni des blessures. L'équilibre se pose comme une question, pas une prescription.
 *
 * TYPO : apostrophe ASCII uniquement, espaces normales, zéro emoji,
 * items de listes en minuscule initiale et sans point final.
 */
import type { ArchetypeCarte } from './quetes-plus';

export const ARCHES_1_2: Record<string, ArchetypeCarte> = {
  V1: {
    accroche: 'Une personnalité qui installe le lien dans la durée, sans paniquer',
    devise: 'Je reste, je répare, je fais confiance au lien.',
    presentation:
      "Certaines personnes vivent le lien comme une évidence tranquille : la proximité les nourrit, la distance ne les effraie pas. Elles restent quand ça grince, elles disent les choses simples, elles réparent tôt ce qui frotte. Leur force tient souvent à peu : une présence régulière, un calme qui se vérifie. Généralement, elles offrent au lien un terrain où l'autre peut poser ses doutes sans que tout tremble.",
    lumiere: [
      'un calme qui repose',
      'des accrocs vite réparés',
      'une présence régulière',
      'une confiance qui ne surveille pas',
      'des moments ordinaires qui font lien',
      'un attachement dit et vérifié',
    ],
    lumiereNote:
      "Généralement, ce type apporte au lien un socle : on sait d'où l'on part, on sait qui reste.",
    ombre: [
      "les preuves qu'on oublie de donner",
      "les mots simples qu'on croit inutiles de dire",
      "les doutes de l'autre corrigés trop vite",
      'les petits malentendus laissés en attente',
      "la routine qui s'installe quand tout va bien",
    ],
    ombreNote:
      "L'ombre n'est pas un défaut : c'est ce qui peut apparaître quand le calme est si solide qu'il devient silencieux.",
    relation: [
      'une sincérité dite simplement',
      'un quotidien qui a du goût',
      'des rapports clairs, sans devinettes',
      'un lien qui survit aux accrocs',
      'des projets construits sans bruit',
    ],
    relationNote:
      "Une possibilité à garder en tête : avec un calme aussi stable, l'autre peut parfois douter que son inquiétude trouve une place — et garder ce doute pour lui plutôt que d'en parler.",
    equilibreQuestion:
      "Est-ce que je dis mon attachement assez souvent pour qu'il s'entende dehors ?",
    equilibreNote:
      "Ce qui se vit comme évident ne se lit pas toujours de l'extérieur : nommer son attachement reste un choix, pas une obligation.",
  },
  V2: {
    accroche: 'Une personnalité qui aime fort, qui veille et qui donne sans compter',
    devise: "J'aime fort, je veille, je donne sans compter.",
    presentation:
      "Certaines personnes aiment avec une antenne permanente : quand quelqu'un compte pour elles, elles repèrent les variations d'humeur avant tout le monde. Elles veillent par petits gestes, elles donnent sans compter, elles sont là les jours difficiles. Leur attention traverse aussi les jours ordinaires. L'imagination, elle, peut travailler plus fort que nécessaire quand le silence s'installe.",
    lumiere: [
      'une attention de chaque instant',
      'une loyauté entière',
      'un don sans calcul',
      "des signes d'amour réguliers",
      'une mémoire des petites choses',
      'une présence aux jours difficiles',
    ],
    lumiereNote:
      "Ce type fait généralement du lien un lieu où l'on se sent remarqué, attendu, compté.",
    ombre: [
      'les silences qui durent',
      'les messages qui tardent',
      "les réponses plus courtes qu'à l'habitude",
      'les demandes de preuves répétées',
      'les soirées occupées par un détail',
      'les questions remplacées par des lectures',
    ],
    ombreNote:
      "L'ombre n'est pas un défaut : c'est la vigilance qui déborde quand le silence parle trop fort — la même antenne, à l'envers.",
    relation: [
      "des signes réguliers que le lien tient",
      "de la clarté sur où l'on en est",
      "des mots dits au moment où le doute arrive",
      'une fidélité qui ne se négocie pas',
      'de la profondeur plutôt que de la légèreté',
    ],
    relationNote:
      "Une possibilité à garder en tête : l'antenne peut, à force, lire des intentions là où il n'y a qu'une soirée chargée — et le lien avancer sur des hypothèses plutôt que sur des mots.",
    equilibreQuestion:
      "Est-ce que je demande, au lieu de décoder, ce qui m'inquiète dans le lien ?",
    equilibreNote:
      "Demander n'est pas manquer de confiance : une question dite à voix haute remplace généralement des heures d'interprétation.",
  },
  V3: {
    accroche: 'Une personnalité qui aime sans se perdre et qui garde son air',
    devise: "J'appartiens à ma vie, et j'aime avec de l'air.",
    presentation:
      "Certaines personnes vivent le lien à leur rythme : elles s'appartiennent d'abord, et elles aiment sans vouloir s'y perdre. Elles traversent leurs tempêtes de leur côté, elles prennent l'air quand ça devient dense, elles reviennent quand elles ont respiré. Généralement, leur amour est calme et stable, sans drame. De l'extérieur, cette façon d'être peut se lire comme une distance — elle est surtout une respiration.",
    lumiere: [
      'un amour sans drame',
      'une présence qui choisit',
      'des retours fidèles',
      'un espace respecté pour deux',
      'un calme qui tient les jours denses',
      'une vie à soi qui nourrit le lien',
    ],
    lumiereNote:
      "Ce type apporte généralement un lien où personne n'a à jouer un rôle pour rester.",
    ombre: [
      'les pauses prises en silence',
      'les distances prises sans un mot',
      "les échanges raccourcis quand ça devient dense",
      'les soucis traversés à voix basse',
      "les questions de l'autre restées en attente",
    ],
    ombreNote:
      "L'ombre n'est pas un défaut : c'est le besoin d'air qui peut ressembler à une fuite pour qui ne connaît pas ce langage.",
    relation: [
      'un respect du rythme de chacun',
      'une confiance sans contrôle',
      "une proximité qui garde de l'air",
      'une relation où chacun garde son monde',
      'des retrouvailles choisies',
    ],
    relationNote:
      "Une possibilité à garder en tête : à force de pauses non annoncées, l'autre peut se mettre à inventer les raisons du silence — alors qu'un mot simple aurait suffi à l'apaiser.",
    equilibreQuestion: 'Est-ce que j\'annonce mes pauses avant de les prendre ?',
    equilibreNote:
      "Le besoin d'air n'est pas le problème : la façon de le prendre décide si l'autre reste invité ou se sent exclu.",
  },
  V4: {
    accroche: 'Une personnalité qui aime à deux vitesses, intense puis en retrait',
    devise: "Je m'y donne entier, je respire, je reviens.",
    presentation:
      "Certaines personnes vivent le lien en deux temps : quand ça compte, elles s'investissent vite et fort ; puis, la proximité installée, une partie d'elles cherche à reprendre de l'air. Ce rythme n'est ni de la légèreté ni de la bizarrerie : c'est souvent une façon d'avoir appris à aimer. Généralement, les retrouvailles les rechargent — après une respiration, l'envie revient entière.",
    lumiere: [
      'une intensité qui revient',
      'des retrouvailles vivantes',
      'du profond quand ça compte',
      'une honnêteté en mouvement',
      'un cœur qui se raconte',
      'une présence entière quand elle est là',
    ],
    lumiereNote:
      "Ce type fait généralement exister le lien avec du relief : rien n'y devient un fond habituel.",
    ombre: [
      'les signaux contradictoires',
      "les éloignements agis avant d'être dits",
      'les débuts plus rapides que la suite',
      'les allers-retours à deviner',
      "les doutes dits le soir même de l'évidence",
    ],
    ombreNote:
      "L'ombre n'est pas un défaut : c'est le rythme qui change de vitesse sans prévenir — non dit, il devient un message que l'autre interprète à sa place.",
    relation: [
      'une personne stable et douce',
      'une sécurité qui ne compte pas les allers-retours',
      'du rythme accepté sans chantage',
      'des retours reçus comme des fidélités',
      "des pauses qui n'ont pas l'air de fuir",
    ],
    relationNote:
      'Une possibilité à garder en tête : sans parole sur le rythme, chaque pause peut ressembler à un départ et chaque retour à un don trop grand — le lien vit alors au rythme des malentendus.',
    equilibreQuestion: "Est-ce que je nomme mes deux vitesses avant que l'autre les invente ?",
    equilibreNote:
      "Deux vitesses, une seule façon d'aimer : le dire transforme généralement un malentendu en terrain connu.",
  },
  V5: {
    accroche: "Une personnalité qui s'ajuste au lien sans jamais s'y effacer",
    devise: "Je m'ajuste à l'autre, et je garde ma voix.",
    presentation:
      "Certaines personnes ne sont ni dans la veille permanente, ni dans l'envol systématique : leur façon d'aimer s'ajuste à la personne en face. Proches quand c'est le besoin, discrètes quand c'est l'air, elles traversent les deux mouvements sans drame. Généralement, cette souplesse est rare — elle donne au lien un confort que beaucoup voient. Elle demande seulement que les envies de l'autre n'écrasent pas les siennes.",
    lumiere: [
      'une souplesse rare',
      "une lecture fine de l'autre",
      'une adaptation sans drame',
      'une présence ajustée',
      'du confort dans le lien',
      'des transitions traversées sans secousse',
    ],
    lumiereNote:
      "Ce type apporte généralement un lien qui respire avec les deux personnes, pas seulement avec l'une.",
    ombre: [
      'les choix laissés sans voix',
      'les envies formulées trop tard',
      "les décisions prises au seul goût de l'autre",
      "l'effacement qui passe pour de la facilité",
      'les besoins qui attendent une occasion',
    ],
    ombreNote:
      "L'ombre n'est pas un défaut : c'est la souplesse qui a un prix — l'adaptation peut se confondre avec l'effacement, de l'extérieur comme de l'intérieur.",
    relation: [
      'des initiatives partagées',
      "de l'échange plutôt que de l'adaptation à sens unique",
      'un lien qui accueille ses propres mouvements',
      'des décisions prises à deux voix',
      'une personne qui demande son envie vraiment',
    ],
    relationNote:
      "Une possibilité à garder en tête : avec quelqu'un qui choisit beaucoup, la fluidité peut suivre un seul fil — la relation devient plus douce que réciproque, sans que personne l'ait voulu.",
    equilibreQuestion: "Saurais-je nommer aujourd'hui trois envies que j'ai pour ma relation ?",
    equilibreNote:
      "La souplesse reste une force : il s'agit seulement de garder sa voix dans les choix, même petits, même quand tout va bien.",
  },
};

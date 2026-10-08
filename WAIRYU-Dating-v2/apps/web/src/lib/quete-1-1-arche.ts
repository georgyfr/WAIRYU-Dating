/**
 * Archétypes de la quête 1.1 — Ta personnalité (Task 33, demande fondateur).
 * Présentation GÉNÉRALE de chaque type : ce que ce type peut généralement
 * apporter, son ombre, en relation, son point d'équilibre.
 *
 * POURQUOI : la révélation Task 32 affirmait des vérités personnelles que la
 * première quête ne peut pas mesurer. Correction éditoriale : l'ARCHÉTYPE du
 * type est présenté de façon générale d'abord (« ce type de personnalité peut
 * généralement… »), le profil personnalisé tendance par tendance vient ensuite.
 *
 * ANCRAGE (règle 11-b) : les identités des 7 cartes viennent de quete-1-1.ts
 * (nom + lumiere + ombre + tension verbatim) ; source d'inspiration secondaire
 * : quete-1-1-plus.ts (apportes généralisés). AUCUN texte verbatim repris.
 * Types : ./quetes-plus (ArchetypeCarte) — ton général, jamais « tu es »,
 * jamais de révélation intime ; l'ombre n'est pas un défaut ; la note relation
 * est une possibilité, pas une prédiction.
 */
import type { ArchetypeCarte } from './quetes-plus';

export const ARCHES_1_1: Record<string, ArchetypeCarte> = {
  // V1 — L'Explorateur·rice chaleureux·se : l'élan qui emmène, et ce qui attend derrière.
  V1: {
    accroche: 'Une personnalité ouverte, chaleureuse, qui aime ce qui est nouveau',
    devise: 'Je dis oui au nouveau, et j\'y emmène les autres.',
    presentation:
      'Certaines personnes trouvent leur énergie dans la découverte : une idée inattendue, un lieu inconnu, une conversation qui part de travers. Elles aiment généralement dire oui avant de tout prévoir, et cette curiosité est souvent chaleureuse : elle veut partager. Elles peuvent entraîner les autres, en créant un climat où chacun se sent attendu. Ce goût du neuf peut parfois laisser ce qui compte déjà en attente.',
    lumiere: [
      'une curiosité chaleureuse',
      'de l\'ouverture',
      'du regard neuf',
      'une envie de partager',
      'une capacité à entraîner les autres',
      'de l\'audace devant l\'inconnu',
    ],
    lumiereNote:
      'Ce sont souvent des personnes qui rendent le monde un peu plus grand autour d\'elles, en y invitant celles et ceux qui les suivent.',
    ombre: [
      'la répétition',
      'les routines trop calées',
      'les longues attentes',
      'les projets laissés en route',
      'les moments où le même revient trop souvent',
    ],
    ombreNote:
      'L\'ombre n\'est pas un défaut du type : c\'est ce qui peut apparaître quand le goût du neuf prend trop de place, et que ce qui attend finit par peser.',
    relation: [
      'un partenaire curieux',
      'les projets improvisés',
      'le partage des découvertes',
      'la liberté de proposer et d\'entraîner',
      'une relation où rien ne stagne',
    ],
    relationNote:
      'Une possibilité à garder en tête : les personnes qui aiment beaucoup le nouveau peuvent avancer vite — certains partenaires se sentent entraînés et nourris, d\'autres peuvent parfois avoir l\'impression de courir derrière.',
    equilibreQuestion: 'Est-ce que je prends soin de ce qui compte déjà dans ma vie ?',
    equilibreNote:
      'Pas parce que la nouveauté serait un problème — mais parce qu\'un élan gagne à revenir parfois vers ce qu\'il aime, pour que ce qu\'il commence puisse durer.',
  },

  // V2 — Le·La Bâtisseur·se : la fiabilité qui tient debout, et son coût invisible.
  V2: {
    accroche: 'Une personnalité fiable, posée, qui tient ce qu\'elle promet',
    devise: 'Je promets peu, et je tiens tout ce que je promets.',
    presentation:
      'Certaines personnes sont un point d\'appui : ce qu\'elles annoncent arrive, et les autres le savent. Elles aiment généralement préparer, finir ce qu\'elles commencent, tenir leur parole — pas par rigidité, mais par respect. Elles peuvent apporter une vraie sécurité dans un projet comme dans une relation. En contrepartie, quand quelque chose dérape, elles peuvent s\'accuser en premier.',
    lumiere: [
      'de la fiabilité',
      'de la constance',
      'de la loyauté',
      'du sens du concret',
      'une capacité à finir ce qui est commencé',
      'une parole qui tient',
    ],
    lumiereNote:
      'Ce sont souvent des personnes sur qui on peut compter, et dont la présence régulière finit par devenir un repère pour les autres.',
    ombre: [
      'les imprévus de dernière minute',
      'les façons de faire différentes des autres',
      'les choses laissées en suspens',
      'le désordre assumé',
      'les promesses non tenues, même chez les autres',
    ],
    ombreNote:
      'L\'ombre n\'est pas un défaut du type : c\'est ce qui peut apparaître quand le besoin de solidité devient trop exigeant, envers les autres comme envers soi-même.',
    relation: [
      'la confiance construite',
      'la clarté des engagements',
      'la réciprocité',
      'les projets concrets à deux',
      'une régularité rassurante',
    ],
    relationNote:
      'Une possibilité à garder en tête : les personnes très attentives à la solidité peuvent parfois sembler exiger beaucoup — certains partenaires se sentent en sécurité, d\'autres peuvent se sentir notés.',
    equilibreQuestion: 'Est-ce que je sais accueillir un imprévu sans tout rattraper ?',
    equilibreNote:
      'Pas parce que le contrôle serait mauvais — mais parce que laisser une place au désordre peut détendre ce qui tient déjà debout.',
  },

  // V3 — L'Étoile sociale : la lumière qui anime, et le silence qui attend.
  V3: {
    accroche: 'Une personnalité qui rayonne, explore et crée du mouvement',
    devise: 'Je découvre, je partage, je fais circuler l\'énergie.',
    presentation:
      'Certaines personnes tirent leur énergie des échanges : elles lancent les conversations et relient les gens entre eux. Elles aiment généralement découvrir, puis raconter ce qu\'elles ont trouvé — plus elles voient, plus elles veulent partager. Elles peuvent faire d\'une table silencieuse une soirée vivante. En contrepartie, le calme peut leur sembler un vide à combler.',
    lumiere: [
      'de l\'énergie',
      'de la curiosité',
      'de la spontanéité',
      'de l\'enthousiasme',
      'de l\'humour',
      'une capacité à créer du lien',
    ],
    lumiereNote:
      'Ce sont souvent des personnes qui contribuent à faire vivre une relation, en apportant des idées, des expériences ou une certaine vitalité.',
    ombre: [
      'les situations très calmes',
      'les silences prolongés',
      'la monotonie',
      'l\'attente',
      'les échanges très lents',
    ],
    ombreNote:
      'L\'ombre n\'est pas un défaut du type : c\'est simplement ce qui peut apparaître lorsque sa lumière devient trop intense ou déséquilibrée.',
    relation: [
      'la complicité',
      'les échanges vivants',
      'la découverte à deux',
      'la spontanéité',
      'un partenaire capable d\'accueillir son énergie',
    ],
    relationNote:
      'Une possibilité à garder en tête : les personnes très tournées vers l\'échange peuvent donner beaucoup de rythme à une relation — pour certains partenaires cette énergie est enthousiasmante, pour d\'autres elle peut être fatigante.',
    equilibreQuestion: 'Est-ce que je sais aussi apprécier ce qui ne bouge pas ?',
    equilibreNote:
      'Pas parce que le calme serait meilleur — mais parce que savoir alterner rayonnement et repos peut permettre à cette énergie de durer.',
  },

  // V4 — L'Ancre : le calme qui porte les autres, et soi qui passe en dernier.
  V4: {
    accroche: 'Une personnalité calme, stable, autour de qui on respire',
    devise: 'Je reste posé·e, et je fais du bien sobrement.',
    presentation:
      'Certaines personnes dégagent un calme que les autres sentent et sur lequel elles s\'appuient. Elles aiment généralement la simplicité, la durée, les liens qui n\'ont pas besoin de bruit pour tenir. Elles peuvent devenir un refuge discret, sans chercher à briller. En contrepartie, cette stabilité peut les retenir longtemps dans des situations qui mériteraient de changer.',
    lumiere: [
      'du calme',
      'de la présence',
      'une écoute attentive',
      'de la patience',
      'une forme de refuge',
      'de la stabilité',
    ],
    lumiereNote:
      'Ce sont souvent des personnes autour de qui la tension redescend, et qui font du bien sans faire de bruit.',
    ombre: [
      'les situations qui n\'en méritent plus',
      'les conflits évités trop longtemps',
      'les habitudes devenues pesantes',
      'les besoins personnels laissés de côté',
      'les changements repoussés',
    ],
    ombreNote:
      'L\'ombre n\'est pas un défaut du type : c\'est ce qui peut apparaître quand la patience devient forteresse, et que le tour de soi passe toujours en dernier.',
    relation: [
      'la sincérité',
      'la profondeur tranquille',
      'les liens durables',
      'la sécurité émotionnelle',
      'un partenaire qui pense aussi à elle',
    ],
    relationNote:
      'Une possibilité à garder en tête : les personnes très disponibles pour les autres peuvent finir par passer en dernier — certains partenaires trouvent là un appui précieux, d\'autres peuvent ne pas voir ce qu\'elle porte en silence.',
    equilibreQuestion: 'Est-ce que je me compte dans mes propres priorités ?',
    equilibreNote:
      'Pas parce que le calme ne suffirait pas — mais parce que savoir se ménager des places à soi peut permettre de porter sans s\'user.',
  },

  // V5 — L'Intense : le volume maximum, et la vague qui traverse.
  V5: {
    accroche: 'Une personnalité qui ressent fort et vit tout à pleine mesure',
    devise: 'Je vis les choses à volume maximum, et je ne fais pas à moitié.',
    presentation:
      'Certaines personnes vivent avec le volume au maximum : les joies les portent, les peines les traversent, rien ne les laisse neutres. Elles remarquent généralement ce que d\'autres passent à côté, s\'attachent entièrement et se souviennent de tout. Elles peuvent donner à une relation une profondeur rare. En contrepartie, un monde parfois bruyant peut les déborder, sans mode d\'emploi.',
    lumiere: [
      'de la profondeur',
      'de la passion',
      'de l\'empathie',
      'une fidélité du cœur',
      'un goût du vrai',
      'une grande capacité à ressentir',
    ],
    lumiereNote:
      'Ce sont souvent des personnes qui rendent les moments plus vifs et les liens plus serrés, parce qu\'elles ne font rien à moitié.',
    ombre: [
      'les remarques qui restent des heures',
      'les environnements bruyants',
      'les vagues qui montent sans prévenir',
      'les séparations et les adieux',
      'les émotions qui débordent en public',
    ],
    ombreNote:
      'L\'ombre n\'est pas un défaut du type : c\'est ce qui peut apparaître quand tout se vit à plein volume, et que la tempête traverse sans prévenir.',
    relation: [
      'l\'authenticité',
      'l\'accueil sans jugement',
      'des échanges où tout peut se dire',
      'la vérité des émotions',
      'un partenaire qui tient bon quand ça bouge',
    ],
    relationNote:
      'Une possibilité à garder en tête : les personnes qui ressentent fort peuvent donner un sentiment de profondeur rare — certains partenaires s\'en sentent réveillés, d\'autres peuvent parfois être dépassés par la vague.',
    equilibreQuestion: 'Est-ce que je m\'accorde de vraies descentes après les vagues ?',
    equilibreNote:
      'Pas parce qu\'il faudrait ressentir moins — mais parce que des repos choisis peuvent laisser à cette intensité la place de durer.',
  },

  // V6 — L'Indépendant·e profond·e : le monde intérieur, et la porte qu'on ose à peine frapper.
  V6: {
    accroche: 'Une personnalité riche d\'un monde intérieur, profonde et discrète',
    devise: 'Je vis dans un monde intérieur vaste, et je l\'ouvre à ma façon.',
    presentation:
      'Certaines personnes ont un vaste monde intérieur : longues pensées, projets de fond, des échanges à deux qui durent des heures. Elles préfèrent généralement la profondeur au bruit, et leur calme cache souvent un feu tranquille. Elles peuvent offrir une écoute rare. En contrepartie, elles ouvrent rarement la conversation en premier — et des rencontres qui comptaient passent parfois inaperçues.',
    lumiere: [
      'un monde intérieur riche',
      'des idées de fond',
      'des conversations qui durent',
      'un feu tranquille',
      'une écoute rare',
      'de la fidélité dans le lien',
    ],
    lumiereNote:
      'Ce sont souvent des personnes qui, quand elles partagent leur monde, donnent à l\'autre le sentiment d\'avoir été choisi·e.',
    ombre: [
      'les grands rassemblements',
      'les échanges de surface',
      'les premiers contacts à engager',
      'les silences qui s\'installent trop longtemps',
      'les mondes qu\'on referme trop vite',
    ],
    ombreNote:
      'L\'ombre n\'est pas un défaut du type : c\'est ce qui peut apparaître quand la préservation du monde intérieur devient une porte fermée, et non une porte lente.',
    relation: [
      'l\'intimité',
      'la patience',
      'le respect du besoin d\'espace',
      'des conversations en profondeur',
      'un partenaire qui frappe sans se vexer',
    ],
    relationNote:
      'Une possibilité à garder en tête : les personnes très indépendantes peuvent sembler distantes alors que, dedans, tout est vivant — certains partenaires apprennent à lire ce silence, d\'autres peuvent le prendre pour du désintérêt.',
    equilibreQuestion: 'Est-ce que j\'ose partager mon monde avant d\'avoir fini de réfléchir ?',
    equilibreNote:
      'Pas parce que la solitude serait mauvaise — mais parce qu\'un monde partagé, même maladroitement, peut rapporter bien plus qu\'un monde parfait gardé en silence.',
  },

  // V7 — L'Équilibriste : toutes les facettes, et le centre qu'on cherche encore.
  V7: {
    accroche: 'Une personnalité à facettes, difficile à cerner et facile à aimer',
    devise: 'Je suis plusieurs choses à la fois, et je tiens mon centre.',
    presentation:
      'Certaines personnes ne rentrent dans aucune case : selon les jours, on les décrit aventureuses, solides, animées ou posées — et personne ne ment. Elles possèdent généralement un peu de tout — curiosité, constance, cœur, calme. Elles peuvent s\'adapter à beaucoup de monde sans se sentir déguisées. En contrepartie, leurs désirs propres arrivent parfois en deuxième, derrière l\'adaptation.',
    lumiere: [
      'de la souplesse',
      'de la polyvalence',
      'un lien facile',
      'un cœur large',
      'un sens de l\'équilibre',
      'une vraie gamme d\'adaptation',
    ],
    lumiereNote:
      'Ce sont souvent des personnes avec qui chacun peut trouver une façon de se connecter, sans avoir à se justifier.',
    ombre: [
      'les choix à trancher vite',
      'les moments où il faut choisir un camp',
      'les périodes où rien ne bouge plus',
      'les vies trop remplies',
      'les positions à tenir longtemps',
    ],
    ombreNote:
      'L\'ombre n\'est pas un défaut du type : c\'est ce qui peut apparaître quand la faculté de s\'adapter occupe toute la place, et que le centre propre peine à se faire entendre.',
    relation: [
      'l\'acceptation telle quelle',
      'la simplicité',
      'des repères partagés',
      'un partenaire qui a son propre centre',
      'la place pour toutes ses facettes',
    ],
    relationNote:
      'Une possibilité à garder en tête : les personnes très adaptables peuvent épouser beaucoup de rythmes — certains partenaires se sentent profondément acceptés, d\'autres peuvent avoir du mal à saisir ses envies propres.',
    equilibreQuestion: 'Est-ce que je sais dire ce que moi je veux, avant de m\'adapter ?',
    equilibreNote:
      'Pas parce que s\'adapter serait faux — mais parce qu\'une vraie position, même rare, donne plus de poids à toutes les autres.',
  },
};

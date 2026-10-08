/**
 * Archétypes de la quête 1.3 — Tes émotions (Task 33, demande fondateur).
 * Présentation GÉNÉRALE de chaque type : ce que ce type peut généralement
 * apporter, son ombre, en relation, son point d'équilibre.
 *
 * Règles de ton (quetes-plus.ts) :
 *  - GÉNÉRAL d'abord (« Certaines personnes… », « Ce type de personnalité
 *    peut généralement… ») — jamais « tu », jamais de vérité intime ; le
 *    profil personnalisé tendance par tendance reste dans quete-1-3-plus.ts ;
 *  - l'ombre décrit des SITUATIONS où la tendance peut déborder, jamais des
 *    défauts ni des troubles : ce sont des styles émotionnels, pas des
 *    diagnostics — aucune carte n'est meilleure qu'une autre ;
 *  - la note relation est une possibilité possible, neutre, jamais une
 *    promesse sur ce que l'autre ressentira.
 *
 * Ancrage : les cartes VERBATIM vivent dans quete-1-3.ts (nom, lumiere,
 * ombre, tension), la couche personnalisée dans quete-1-3-plus.ts — on
 * écrit AUTOUR, on ne recopie pas (aucun segment ≥ 60 caractères).
 *
 * Typographie : apostrophe ASCII uniquement (U+0027), zéro espace
 * insécable, zéro emoji, items de listes en minuscule sans point final.
 */
import type { ArchetypeCarte } from './quetes-plus';

export const ARCHES_1_3: Record<string, ArchetypeCarte> = {
  V1: {
    accroche: 'Une personnalité qui met des mots tôt sur ce qui se vit en dedans',
    devise: 'Je nomme ce que je ressens, et ça change déjà la situation.',
    presentation:
      'Certaines personnes savent tôt ce qu\'elles ressentent, même quand plusieurs émotions se mêlent. Elles perçoivent généralement les changements d\'humeur avant qu\'ils s\'installent, et trouvent des mots là où d\'autres restent flous. Ce type de personnalité peut généralement apporter un calme qui rassure : les tensions se nomment tôt, le drame recule. Son chemin d\'équilibre : que la maîtrise reste une aide, pas un mur.',
    lumiere: [
      'des mots justes pour dire ce qui se passe',
      'un calme qui apaise les conversations',
      'des tensions repérées et désamorcées tôt',
      'peu de drame, des choses dites clairement',
      'une présence stable quand ça secoue autour',
      'la capacité de rester avec une émotion pénible sans fuir',
    ],
    lumiereNote:
      'Dans une vie à deux comme entre amis, ce type de personnalité devient souvent le point où les choses redeviennent claires.',
    ombre: [
      'les émotions analysées plus que vécues',
      'le réflexe de tout traverser seul·e',
      'les vagues réglées en silence, sans témoin',
      'le contrôle qui prend la place de la souplesse',
      'les moments où nommer remplace ressentir',
    ],
    ombreNote:
      'Aucun de ces mouvements n\'est un défaut : ce sont les mêmes forces vues du côté où elles débordent, quand la méthode remplace le partage.',
    relation: [
      'une conversation où les mots sont posés, pas lancés',
      'un rythme respecté : nommer d\'abord, parler ensuite',
      'des solutions cherchées ensemble plutôt que des reproches',
      'une personne qui ne lit pas le calme comme de la distance',
      'un espace où être aidé·e n\'est pas une faiblesse',
    ],
    relationNote:
      'Une possibilité à garder en tête : ce type de personnalité peut tellement bien se débrouiller seul·e que l\'entourage cesse de proposer son aide — alors qu\'un coup de main pendant la vague raccourcit souvent le voyage.',
    equilibreQuestion: 'Est-ce que je laisse quelqu\'un passer à mon côté pendant la vague ?',
    equilibreNote:
      'La question vaut comme une ouverture, pas comme un devoir : demander de l\'aide reste un choix, et il peut se faire petit — un mot, un signe, une porte entrouverte.',
  },
  V2: {
    accroche: 'Une personnalité qui ressent tout fort, vite, et sans détour',
    devise: 'Je ressens fort, je retombe vite, et ça reste toujours vrai.',
    presentation:
      'Certaines personnes vivent leurs émotions comme des saisons rapides : tout arrive fort, tôt, et rien ne reste tiède. Une contrariété monte vite, retombe presque aussi vite ; une bonne nouvelle, elle, fait lever les tables. Ce type de personnalité peut généralement apporter une énergie qui entraîne et du vrai qui ne se joue pas. Son chemin d\'équilibre : prévenir quand ça monte, pour protéger ce qui compte.',
    lumiere: [
      'une joie qui se voit et se partage',
      'une passion qui entraîne les autres',
      'du vrai, jamais tiède',
      'des excuses rapides après un éclat',
      'une présence qui réchauffe les journées plates',
      'des émotions assumées à voix haute',
    ],
    lumiereNote:
      'Avec ce type de personnalité, on sait où en est l\'autre : rien n\'est enfoui sous la surface, la joie comme l\'agacement se vivent en direct.',
    ombre: [
      'les coups de chaud',
      'les mots de trop en pleine montée',
      'les regrets qui suivent l\'éclat',
      'les montées qui prennent tout le monde de vitesse',
      'les relances faites avant d\'être redescendu·e',
    ],
    ombreNote:
      'Ces situations ne décrivent pas un caractère : elles montrent une intensité qui déborde parfois de son lit — et qui apprend, vague après vague, à prévenir.',
    relation: [
      'une chaleur sincère, sans calcul',
      'une personne qui entend le fond sous le ton',
      'de la marge le temps que la vague retombe',
      'un retour rapide après les éclats : la réparation compte',
      'des émotions partagées en direct, pas en différé',
    ],
    relationNote:
      'Une possibilité à garder en tête : dans un couple, la montée peut parler plus fort que la raison qui l\'a déclenchée — l\'autre répond alors au ton pendant que le fond, lui, attend encore son tour.',
    equilibreQuestion: 'Qu\'est-ce que je veux protéger quand la vague monte ?',
    equilibreNote:
      'Ce n\'est pas ressentir moins : c\'est repérer son premier signal assez tôt pour choisir le mot, la pause ou la sortie — avant que la vague ne décide seule.',
  },
  V3: {
    accroche: 'Une personnalité qui traverse les vagues en profondeur, sans bruit',
    devise: 'Je vis mes émotions en profondeur, sans les afficher.',
    presentation:
      'Certaines personnes font vivre leurs émotions loin de la surface : elles travaillent en profondeur, sous une allure calme. Elles ne les dissèquent généralement pas, ne les déclarent pas : elles traversent. Ce type de personnalité peut généralement apporter une stabilité précieuse — pas de tempête, une présence qui dure. Son chemin d\'équilibre : que le silence reste un choix, et non la seule langue parlée.',
    lumiere: [
      'du calme sous pression',
      'une profondeur constante',
      'des mots rares mais pesés, qui comptent double',
      'une présence qui dure dans le temps',
      'zéro tempête à gérer pour l\'entourage',
      'une loyauté tranquille aux personnes aimées',
    ],
    lumiereNote:
      'Ce type de personnalité rassure souvent : avec lui, les grandes marées émotionnelles ne deviennent pas des spectacles, et la maison tient debout.',
    ombre: [
      'les émotions traversées en silence, sans témoin',
      'les attentes non dites qui s\'accumulent',
      'les signes si discrets que personne ne les lit',
      'les états compris bien après coup',
      'la distance qui s\'installe faute d\'un mot',
    ],
    ombreNote:
      'Aucune de ces situations n\'est un défaut de caractère : c\'est ce qui peut apparaître quand la profondeur ne trouve pas de langue commune avec la surface.',
    relation: [
      'une personne qui ne lit pas le silence comme de l\'indifférence',
      'un rythme d\'ouverture respecté, sans sondage en direct',
      'un petit code entre deux : un mot, un geste qui dit l\'essentiel',
      'de la patience pour les confidences qui arrivent en retard',
      'une stabilité à deux, loin des montagnes russes',
    ],
    relationNote:
      'Une possibilité à garder en tête : ce type de personnalité peut attendre d\'être lu pendant que l\'autre attend d\'être informé — deux attentes légitimes, qui se croisent rarement sans un mot posé à voix haute.',
    equilibreQuestion: 'Est-ce que je dis assez tôt ce qui se passe, avant que ça passe ?',
    equilibreNote:
      'La question n\'impose rien : certaines vagues se traversent mieux en dedans — d\'autres gagnent simplement à être nommées une fois, même après coup.',
  },
  V4: {
    accroche: 'Une personnalité qui réchauffe, console et célèbre les autres',
    devise: 'Je prends soin des cœurs autour de moi, naturellement.',
    presentation:
      'Certaines personnes sont des endroits où les autres vont mieux : autour d\'elles, on se sent accueilli. Elles félicitent, consolent, célèbrent les bonnes nouvelles des autres comme si c\'étaient les leurs. Ce type de personnalité peut généralement apporter une chaleur qui remet d\'aplomb et une écoute que l\'on n\'oublie pas. Son chemin d\'équilibre : garder une place, dans la file, pour ses propres vagues.',
    lumiere: [
      'une écoute rare et sans jugement',
      'un réconfort qui console vraiment',
      'les joies des autres fêtées comme les siennes',
      'une chaleur qui remet d\'aplomb',
      'le repérage précoce de ceux qui vont mal',
      'une loyauté discrète envers les personnes aimées',
    ],
    lumiereNote:
      'Ce type de personnalité devient souvent une adresse : on s\'y tourne naturellement quand ça ne va pas — et l\'on en repart mieux.',
    ombre: [
      'les propres émotions laissées à la file d\'attente',
      'les « ça va » prononcés trop vite',
      'les vagues personnelles traitées en différé, en douce',
      'le rôle de pilier qui ne se pose jamais',
      'l\'épuisement silencieux de l\'endroit où tout le monde dépose',
    ],
    ombreNote:
      'Ces situations ne révèlent pas une faiblesse : elles montrent une générosité qui a besoin, elle aussi, d\'un endroit où se poser et d\'un tour de vague.',
    relation: [
      'une personne qui pose « et toi ? » et attend la vraie réponse',
      'un espace où se confier sans reprendre aussitôt le rôle du pilier',
      'une relation où le flux peut changer de sens',
      'le droit d\'avoir des vagues à soi, comme tout le monde',
      'des remerciements qui ne restent pas en surface',
    ],
    relationNote:
      'Une possibilité à garder en tête : dans une relation, ce type peut devenir l\'endroit où l\'autre dépose tout — l\'équilibre peut alors se déplacer sans que personne l\'ait décidé, tant la générosité semble le permettre.',
    equilibreQuestion: 'Est-ce que je réponds vrai quand on me demande comment je vais ?',
    equilibreNote:
      'Il n\'y a pas de règle : la question ouvre une porte — celle de prendre son tour de vague, avec une personne choisie, quand le moment s\'y prête.',
  },
  V5: {
    accroche: 'Une personnalité qui ressent beaucoup, et montre avec mesure',
    devise: 'Je ressens beaucoup, je montre peu — tout est vivant en dedans.',
    presentation:
      'Certaines personnes vivent une vie émotionnelle riche, tenue, intime : dehors le calme, en dedans tout est vivant. Ce n\'est généralement pas de la froideur, mais de la pudeur — les ouvertures sont choisies, rares, précises. Ce type de personnalité peut généralement apporter une fidélité profonde aux liens et des confiances qui marquent. Son chemin d\'équilibre : laisser voir un peu plus tôt ce qui vit en dedans.',
    lumiere: [
      'une intensité tenue, jamais jouée',
      'des confiances choisies qui valent de l\'or',
      'une fidélité profonde aux liens',
      'du vrai mesuré, rien de théâtral',
      'des ouvertures qui marquent durablement',
      'un calme extérieur qui met en confiance',
    ],
    lumiereNote:
      'Quand ce type de personnalité ouvre une porte, c\'est choisi — et les personnes qui reçoivent le sentent : chaque confiance est un cadeau, jamais un gadget.',
    ombre: [
      'les émotions invisibles de l\'extérieur',
      'la pudeur lue comme une distance',
      'les attachements crus transmis, qui ne sont pas passés',
      'les canaux détournés : l\'écrit qui dit ce que la voix tait',
      'les ouvertures reportées trop longtemps',
    ],
    ombreNote:
      'Aucun de ces mouvements n\'est un mur : c\'est une pudeur qui tient rarement l\'essentiel sous silence — elle se règle par un signe, pas par un discours.',
    relation: [
      'une personne qui respecte les rythmes d\'ouverture',
      'des liens construits par degrés, pas d\'un coup',
      'l\'acceptation des canaux : l\'écrit d\'abord, la voix ensuite',
      'une attention à ce qui se vit, pas à ce qui se montre',
      'de la constance plutôt que des grandes déclarations',
    ],
    relationNote:
      'Une possibilité à garder en tête : une réserve émotionnelle peut parfois être prise pour de l\'indifférence, alors qu\'en dedans tout vit — un mot qui annonce le style évite bien des malentendus.',
    equilibreQuestion: 'Est-ce que je laisse voir un bout de ce qui vit en dedans ?',
    equilibreNote:
      'Il n\'est pas question de tout ouvrir : une seule ouverture, un peu plus tôt que d\'habitude, suffit souvent pour que l\'autre comprenne le reste.',
  },
  V6: {
    accroche: 'Une personnalité qui apprend à lire ce qui se passe en dedans',
    devise: 'Je ne sais pas toujours — et j\'apprends, étape après étape.',
    presentation:
      'Certaines personnes apprennent à lire ce qui bouge en elles : tantôt clair, tantôt embrouillé — c\'est le rythme normal de l\'apprentissage. Elles répondent généralement « je ne sais pas encore », et cherchent des indices : une boule au ventre, une irritabilité. Ce type de personnalité peut généralement apporter une recherche sincère, sans prétention. Son chemin d\'équilibre : avancer sans exiger d\'arriver.',
    lumiere: [
      'une recherche sincère sur soi',
      'des progrès réels à chaque étape',
      'zéro prétention, zéro pose',
      'une curiosité qui grandit avec le temps',
      'du vrai, même quand c\'est flou',
      'une humilité qui donne le droit d\'apprendre',
    ],
    lumiereNote:
      'Ce type de personnalité avance sur un chantier qui rapporte : chaque émotion nommée une fois se reconnaît mieux la suivante — et le chemin paie en route.',
    ombre: [
      'les conversations émotionnelles esquivées par prudence',
      'les silences pris pour des murs, à tort',
      'les états reconnus bien après coup',
      'les brouillards des jours sans boussole',
      'le découragement quand la progression paraît lente',
    ],
    ombreNote:
      'Ces situations ne sont pas des limites de caractère : ne pas savoir nommer n\'a jamais voulu dire ne pas ressentir — le brouillard fait partie du chemin.',
    relation: [
      'une personne qui prend le flou pour une recherche, pas un mur',
      'des questions simples, pas des interrogatoires',
      'de la patience encourageante : le droit d\'être débutant',
      'des progrès salués sans tout attendre tout de suite',
      'une sincérité valorisée, même quand la réponse n\'est pas prête',
    ],
    relationNote:
      'Une possibilité à garder en tête : un « je ne sais pas encore » honnête peut être entendu comme un refus — alors qu\'il s\'agit souvent d\'une recherche en cours, qui gagne à être dite comme telle.',
    equilibreQuestion: 'Est-ce que je m\'accorde le droit d\'être encore en apprentissage ?',
    equilibreNote:
      'La question ne fixe aucun délai : apprendre à se connaître est un chemin, et chaque pas compte — même ceux qui ressemblent à des pas de côté.',
  },
};

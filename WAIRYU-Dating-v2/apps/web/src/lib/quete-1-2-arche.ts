/**
 * Archétypes de la quête 1.2 — Ta façon de t'attacher (Task 35, gabarit
 * fondateur). Même algorithme que la quête 1.1 : chaque type est écrit à la
 * 2ᵉ personne, simple et littéral, dans les 6 champs du gabarit (intro +
 * point de vigilance, devise, ce que tu apportes, ce qui peut te freiner,
 * en couple, ton équilibre). Le gabarit de référence (V3 de la quête 1.1)
 * vient du fondateur lui-même.
 *
 * SENSIBILITÉ ATTACHEMENT : l'archétype décrit une façon d'aimer et de
 * s'attacher (réassurance, espace, rythme du lien), jamais un diagnostic.
 * « Ce qui peut te freiner » décrit des situations de lien qui peuvent
 * apparaître — pas des défauts ni des blessures. « En couple » reste une
 * dynamique possible (« À garder en tête »), jamais une prédiction sur
 * l'autre.
 *
 * Ancrage : les cartes VERBATIM restent dans quete-1-2.ts, la couche « plus »
 * (langage matching, leviers) dans quete-1-2-plus.ts. Aucun segment ≥ 60
 * caractères n'est recopié d'un module à l'autre.
 *
 * Typo : apostrophe ASCII uniquement, écriture inclusive, pas de mélange
 * tu/vous.
 */
import type { ArchetypeCarte } from './quetes-plus';

export const ARCHES_1_2: Record<string, ArchetypeCarte> = {
  // V1 — L'Ancrage : le lien qui dure, sans paniquer.
  V1: {
    intro:
      'Ton archétype révèle une personne qui installe le lien dans la durée. Tu es de celles et ceux qui restent quand ça grince, disent les choses simples et réparent tôt ce qui frotte. La proximité te nourrit, la distance ne t\'effraie pas — ta force tient à peu : une présence régulière, un calme qui se vérifie. Ton point de vigilance : ce qui est évident pour toi ne se lit pas toujours de l\'extérieur — les preuves qu\'on oublie de donner peuvent créer des doutes qui n\'existent pas.',
    devise: 'Je reste, je répare, je fais confiance au lien.',
    apportes:
      'Un socle : on sait d\'où l\'on part, on sait qui reste. Ton calme repose, tes accrocs se réparent vite, tes moments ordinaires font lien.',
    freines:
      'Les mots simples qu\'on croit inutiles de dire, les doutes de l\'autre corrigés trop vite, la routine qui s\'installe quand tout va bien. Ce ne sont pas des défauts — juste ce qui apparaît quand le calme est si solide qu\'il devient silencieux.',
    couple:
      'Tu construis un lien qui survit aux accrocs : sincérité dite simplement, rapports clairs, projets construits sans bruit. À garder en tête : avec un calme aussi stable, l\'autre peut douter que son inquiétude trouve une place — et garder ce doute pour lui plutôt que d\'en parler.',
    equilibre:
      'Dire ton attachement assez souvent pour qu\'il s\'entende dehors. Non parce que ton calme manquerait de fond, mais parce que ce qui se vit comme évident a besoin d\'être dit pour être vécu pareil par l\'autre.',
  },

  // V2 — La Vigie : l'antenne du lien, qui aime fort et veille.
  V2: {
    intro:
      'Ton archétype révèle une personne qui aime avec une antenne permanente. Tu es de celles et ceux qui repèrent les variations d\'humeur avant tout le monde, qui veillent par petits gestes et sont là les jours difficiles — ton attention traverse aussi les jours ordinaires. Ton point de vigilance : quand le silence s\'installe, ton imagination peut travailler plus fort que nécessaire et lire des intentions là où il n\'y a qu\'une soirée chargée.',
    devise: 'J\'aime fort, je veille, je donne sans compter.',
    apportes:
      'Un lien où l\'on se sent remarqué, attendu, compté : une loyauté entière, des signes d\'amour réguliers, une mémoire des petites choses.',
    freines:
      'Les silences qui durent, les messages qui tardent, les demandes de preuves répétées. Ce ne sont pas des défauts — juste la même antenne, à l\'envers : la vigilance qui déborde quand le silence parle trop fort.',
    couple:
      'Tu donnes de la profondeur plutôt que de la légèreté, une fidélité qui ne se négocie pas, des mots dits au moment où le doute arrive. À garder en tête : ton antenne peut faire avancer le lien sur des hypothèses plutôt que sur des mots — demander vaut mieux que décoder.',
    equilibre:
      'Demander, au lieu de décoder, ce qui t\'inquiète dans le lien. Non parce que ta vigilance serait fausse, mais parce qu\'une question dite à voix haute remplace des heures d\'interprétation.',
  },

  // V3 — L'Autonome : le lien à son rythme, avec de l'air.
  V3: {
    intro:
      'Ton archétype révèle une personne qui vit le lien à son rythme : tu t\'appartiens d\'abord, et tu aimes sans vouloir t\'y perdre. Tu es de celles et ceux qui traversent leurs tempêtes de leur côté, prennent l\'air quand ça devient dense, et reviennent quand elles ont respiré. Ton amour est calme et stable, sans drame. Ton point de vigilance : de l\'extérieur, ce besoin d\'air peut se lire comme une distance — alors qu\'il est surtout une respiration.',
    devise: 'J\'appartiens à ma vie, et j\'aime avec de l\'air.',
    apportes:
      'Un lien où personne n\'a à jouer un rôle pour rester : un amour sans drame, des retours fidèles, une vie à toi qui nourrit la relation.',
    freines:
      'Les pauses prises en silence, les distances prises sans un mot, les soucis traversés à voix basse. Ce ne sont pas des défauts — juste ton besoin d\'air qui peut ressembler à une fuite pour qui ne connaît pas ce langage.',
    couple:
      'Tu apportes un respect du rythme de chacun, une confiance sans contrôle, une relation où chacun garde son monde. À garder en tête : à force de pauses non annoncées, l\'autre peut se mettre à inventer les raisons du silence — alors qu\'un mot simple aurait suffi à l\'apaiser.',
    equilibre:
      'Annoncer tes pauses avant de les prendre. Non parce que ton air serait un problème, mais parce que la façon de le prendre décide si l\'autre reste invité ou se sent exclu.',
  },

  // V4 — Le Va-et-vient : deux vitesses, une seule façon d'aimer.
  V4: {
    intro:
      'Ton archétype révèle une personne qui aime en deux temps : quand ça compte, tu t\'investis vite et fort ; puis, la proximité installée, une partie de toi cherche à reprendre de l\'air. Ce rythme n\'est ni de la légèreté ni de la bizarrerie — c\'est une façon d\'avoir appris à aimer. Ton point de vigilance : non dit, ce rythme devient un message que l\'autre interprète à ta place — chaque pause peut ressembler à un départ.',
    devise: 'Je m\'y donne entier, je respire, je reviens.',
    apportes:
      'Un lien avec du relief : une intensité qui revient, des retrouvailles vivantes, une présence entière quand elle est là — rien n\'y devient un fond habituel.',
    freines:
      'Les signaux contradictoires, les éloignements agis avant d\'être dits, les débuts plus rapides que la suite. Ce ne sont pas des défauts — juste ton rythme qui change de vitesse sans prévenir.',
    couple:
      'Tu fais exister le lien avec du profond quand ça compte et des retours reçus comme des fidélités. À garder en tête : sans parole sur ton rythme, chaque pause peut ressembler à un départ et chaque retour à un don trop grand — le lien vit alors au rythme des malentendus.',
    equilibre:
      'Nommer tes deux vitesses avant que l\'autre ne les invente. Non parce que ton rythme serait à corriger, mais parce que le dire transforme un malentendu en terrain connu.',
  },

  // V5 — L'Équilibre en mouvement : s'ajuste au lien sans s'y effacer.
  V5: {
    intro:
      'Ton archétype révèle une personne dont la façon d\'aimer s\'ajuste à la personne en face : proche quand c\'est le besoin, discret·e quand c\'est l\'air. Tu es de celles et ceux qui traversent les deux mouvements sans drame — et cette souplesse est rare : elle donne au lien un confort que beaucoup voient. Ton point de vigilance : tes envies propres peuvent arriver en deuxième, derrière l\'adaptation.',
    devise: 'Je m\'ajuste à l\'autre, et je garde ma voix.',
    apportes:
      'Un lien qui respire avec les deux personnes : une lecture fine de l\'autre, une adaptation sans drame, des transitions traversées sans secousse.',
    freines:
      'Les choix laissés sans voix, les envies formulées trop tard, les décisions prises au seul goût de l\'autre. Ce ne sont pas des défauts — juste ta souplesse qui a un prix : l\'adaptation peut se confondre avec l\'effacement.',
    couple:
      'Tu apportes des initiatives partagées, des décisions prises à deux voix, un lien qui accueille ses propres mouvements. À garder en tête : avec quelqu\'un qui choisit beaucoup, la fluidité peut suivre un seul fil — la relation devient plus douce que réciproque, sans que personne l\'ait voulu.',
    equilibre:
      'Garder ta voix dans les choix, même petits, même quand tout va bien. Non parce que t\'ajuster serait faux, mais parce que ta souplesse vaut encore plus quand elle part d\'un centre visible.',
  },
};

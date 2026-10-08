/**
 * Archétypes de la quête 1.1 — Ta personnalité (Task 35, gabarit fondateur).
 * Chaque type est écrit à la 2ᵉ personne, SIMPLE ET LITTÉRAL, dans les 6
 * champs du gabarit : intro (« Ton archétype révèle une personne qui… » +
 * point de vigilance), devise, « Ce que tu apportes », « Ce qui peut te
 * freiner », « En couple », « Ton équilibre ».
 *
 * V3 (« L'Étoile sociale ») : les six textes viennent du fondateur LUI-MÊME —
 * il a validé ce format comme le rendu EXACT attendu pour tout archétype
 * (« beaucoup plus simple et littérale. Ce n'est pas mécanique »). Les six
 * autres types suivent le même moule, phrase pour phrase.
 *
 * Ancrage : les cartes VERBATIM (nom, lumière, ombre, tension) restent dans
 * quete-1-1.ts ; la couche « plus » (langage matching, leviers) reste dans
 * quete-1-1-plus.ts. Aucun segment ≥ 60 caractères n'est recopié d'un module
 * à l'autre.
 *
 * Typo : apostrophe ASCII uniquement, écriture inclusive « celles et ceux »,
 * pas de pluriel fautif (« ce qui émerge »), « Tu apprécies » (pas de mélange
 * tu/vous).
 */
import type { ArchetypeCarte } from './quetes-plus';

export const ARCHES_1_1: Record<string, ArchetypeCarte> = {
  // V1 — L'Explorateur·rice chaleureux·se : l'élan qui emmène, et ce qui attend derrière.
  V1: {
    intro:
      'Ton archétype révèle une personne qui vit le nouveau comme un carburant. Tu es de celles et ceux qui disent oui avant d\'avoir tout prévu, qui transforment une idée inattendue en sortie, en conversation, en plan commun. Ta curiosité est chaleureuse : elle veut partager, elle entraîne. Ton point de vigilance : dans l\'enthousiasme de ce qui arrive, ce qui compte déjà peut finir par attendre.',
    devise: 'Je dis oui au nouveau, et j\'y emmène les autres.',
    apportes:
      'De l\'élan, du regard neuf, de l\'audace devant l\'inconnu. Tu rends le monde un peu plus grand autour de toi — et tu y invites les autres au lieu d\'y aller seul·e.',
    freines:
      'La répétition, les routines trop calées, les longues attentes. Ce ne sont pas des défauts — juste ce qui pèse quand ton goût du neuf n\'a plus rien à mordre.',
    couple:
      'Tu apportes des projets, des surprises, une relation où rien ne stagne. À garder en tête : tu avances vite — certains partenaires se sentent entraînés et nourris, d\'autres peuvent avoir l\'impression de courir derrière.',
    equilibre:
      'Prendre soin de ce qui compte déjà. Non parce que la nouveauté serait un problème, mais parce qu\'un élan qui revient vers ce qu\'il aime donne à ce qu\'il commence la chance de durer.',
  },

  // V2 — Le·La Bâtisseur·se : la fiabilité qui tient debout, et son coût invisible.
  V2: {
    intro:
      'Ton archétype révèle une personne sur qui on peut compter — et ça se sait. Tu es de celles et ceux qui préparent, finissent ce qu\'ils commencent et tiennent leur parole, même sur les petites promesses. Ce n\'est pas de la rigidité : c\'est du respect, celui que tu portes aux choses, aux gens, à ta parole. Ton point de vigilance : quand quelque chose dérape, tu as tendance à t\'accuser en premier.',
    devise: 'Je promets peu, et je tiens tout ce que je promets.',
    apportes:
      'De la fiabilité, de la constance, une parole qui tient. Les gens te confient ce qui compte, parce qu\'ils savent que ça arrive — et ta présence régulière finit par devenir un repère.',
    freines:
      'Les imprévus de dernière minute, les façons de faire différentes, les choses laissées en suspens. Ce ne sont pas des défauts — juste ce qui grippe quand ton besoin de solidité devient trop exigeant, envers les autres comme envers toi.',
    couple:
      'Tu construis une confiance qui se vérifie : engagements clairs, réciprocité, régularité rassurante. À garder en tête : ta solidité sécurise certains partenaires — d\'autres peuvent se sentir notés si le cadre devient une grille.',
    equilibre:
      'Accueillir un imprévu sans tout rattraper. Non parce que le contrôle serait mauvais, mais parce que laisser une place au désordre détend ce qui tient déjà debout.',
  },

  // V3 — L'Étoile sociale : la lumière qui anime, et le silence qui attend.
  // Six textes VERBATIM du fondateur (Task 35) — le gabarit de référence.
  V3: {
    intro:
      'Ton archétype révèle une personne qui puise son énergie dans le contact avec les autres. Tu es de celles et ceux qui initient les échanges, créent des ponts entre les gens et transforment une ambiance terne en moment mémorable. Tu as soif de découvertes et l\'envie naturelle de les partager. Ton point de vigilance : le silence et la routine peuvent te peser, comme un espace vide à remplir.',
    devise: 'Je découvre, je connecte, je fais circuler l\'énergie.',
    apportes:
      'Énergie, curiosité, spontanéité, enthousiasme, humour… Tu es un moteur de lien social : tu fais vivre les relations par tes idées et ta vitalité.',
    freines:
      'Les atmosphères trop calmes, les longs silences, la lenteur des échanges, l\'attente. Ce ne sont pas des défauts — juste ce qui émerge quand ton énergie n\'a pas de débouché.',
    couple:
      'Tu apprécies la complicité, le partage de découvertes et un partenaire qui accueille ton dynamisme. À garder en tête : ton rythme enthousiasmera certains, pourra en essouffler d\'autres.',
    equilibre:
      'Savoir savourer aussi ce qui ne bouge pas. Non parce que le calme serait supérieur, mais parce qu\'alterner rayonnement et repos rend ton énergie durable.',
  },

  // V4 — L'Ancre : le calme qui porte les autres, et soi qui passe en dernier.
  V4: {
    intro:
      'Ton archétype révèle une personne autour de qui on respire mieux. Tu es de celles et ceux qui traversent les tensions sans les amplifier, qui aiment la simplicité, la durée, les liens qui n\'ont pas besoin de bruit pour tenir. Tu ne cherches pas à briller : tu cherches à faire du bien, sobrement, durablement. Ton point de vigilance : ta stabilité peut te retenir longtemps dans des situations qui mériteraient de changer.',
    devise: 'Je reste posé·e, et je fais du bien sobrement.',
    apportes:
      'Du calme, de la présence, une écoute attentive. La tension redescend quand tu arrives — les autres s\'appuient sur toi, souvent sans le dire.',
    freines:
      'Les conflits évités trop longtemps, les habitudes devenues pesantes, tes propres besoins passés en dernier. Ce ne sont pas des défauts — juste ce qui apparaît quand la patience devient une forteresse.',
    couple:
      'Tu offres une sécurité émotionnelle rare : sincérité, profondeur tranquille, liens durables. À garder en tête : très disponible pour l\'autre, tu peux finir par passer en dernier — un partenaire attentif le remarquera, d\'autres peuvent ne jamais voir ce que tu portes en silence.',
    equilibre:
      'Te compter dans tes propres priorités. Non parce que le calme ne suffirait pas, mais parce que savoir te ménager des places à toi te permet de porter sans t\'user.',
  },

  // V5 — L'Intense : le volume maximum, et la vague qui traverse.
  V5: {
    intro:
      'Ton archétype révèle une personne qui vit à volume maximum : les joies te portent, les peines te traversent, rien ne te laisse neutre. Tu es de celles et ceux qui remarquent ce que les autres passent à côté, qui s\'attachent entièrement et se souviennent de tout. Ton point de vigilance : un monde parfois bruyant peut te déborder, et tu gères la tempête sans mode d\'emploi.',
    devise: 'Je vis les choses à volume maximum, et je ne fais pas à moitié.',
    apportes:
      'De la profondeur, de la passion, une fidélité du cœur. Tu rends les moments plus vifs et les liens plus serrés, parce que tu ne fais rien à moitié.',
    freines:
      'Les remarques qui restent des heures, les vagues qui montent sans prévenir, les adieux. Ce ne sont pas des défauts — juste ce qui traverse quand tout se vit à plein volume.',
    couple:
      'Tu donnes à une relation une profondeur rare : authenticité, accueil sans jugement, des échanges où tout peut se dire. À garder en tête : ton intensité réveille certains partenaires — d\'autres peuvent parfois être dépassés par la vague.',
    equilibre:
      'T\'accorder de vraies descentes après les vagues. Non parce qu\'il faudrait ressentir moins, mais parce que des repos choisis laissent à cette intensité la place de durer.',
  },

  // V6 — L'Indépendant·e profond·e : le monde intérieur, et la porte qu'on ose à peine frapper.
  V6: {
    intro:
      'Ton archétype révèle une personne riche d\'un vaste monde intérieur : longues pensées, projets de fond, conversations à deux qui durent des heures. Tu es de celles et ceux qui préfèrent la profondeur au bruit — et ton calme cache un feu tranquille. Ton point de vigilance : tu ouvres rarement la conversation en premier, et des rencontres qui comptaient sont parfois passées inaperçues.',
    devise: 'Je vis dans un monde intérieur vaste, et je l\'ouvre à ma façon.',
    apportes:
      'Un monde intérieur riche, des idées de fond, une écoute rare. Quand tu partages ton monde, l\'autre a le sentiment d\'avoir été choisi·e — parce que c\'est vrai.',
    freines:
      'Les grands rassemblements, les échanges de surface, les premiers contacts à engager. Ce ne sont pas des défauts — juste ce qui se durcit quand la préservation de ton monde devient une porte fermée plutôt qu\'une porte lente.',
    couple:
      'Tu construis de l\'intimité réelle : patience, profondeur, respect du besoin d\'espace. À garder en tête : ton indépendance peut sembler une distance alors que, dedans, tout est vivant — certains partenaires apprennent à lire ce silence, d\'autres peuvent le prendre pour du désintérêt.',
    equilibre:
      'Oser partager ton monde avant d\'avoir fini de réfléchir. Non parce que la solitude serait mauvaise, mais parce qu\'un monde partagé, même maladroitement, rapporte bien plus qu\'un monde parfait gardé en silence.',
  },

  // V7 — L'Équilibriste : toutes les facettes, et le centre qu'on cherche encore.
  V7: {
    intro:
      'Ton archétype révèle une personne qui ne rentre dans aucune case — et personne ne ment : selon les jours, on te décrit aventureux·se, solide, animé·e ou posé·e. Tu es de celles et ceux qui possèdent un peu de tout — curiosité, constance, cœur, calme — et qui s\'adaptent à beaucoup de monde sans se sentir déguisés. Ton point de vigilance : tes désirs propres arrivent parfois en deuxième, derrière l\'adaptation.',
    devise: 'Je suis plusieurs choses à la fois, et je tiens mon centre.',
    apportes:
      'De la souplesse, de la polyvalence, un lien facile. Chacun peut trouver une façon de se connecter à toi sans avoir à se justifier — c\'est un vrai don.',
    freines:
      'Les choix à trancher vite, les camps à tenir longtemps, les périodes où rien ne bouge plus. Ce ne sont pas des défauts — juste ce qui apparaît quand la faculté de s\'adapter occupe toute la place et que ton centre peine à se faire entendre.',
    couple:
      'Tu offres une acceptation rare : l\'autre existe tel qu\'il est, sans devoir choisir une version de lui. À garder en tête : tu épouses beaucoup de rythmes — certains partenaires se sentent profondément acceptés, d\'autres peuvent avoir du mal à saisir ce que toi tu veux.',
    equilibre:
      'Dire ce que toi tu veux, avant de t\'adapter. Non parce que s\'adapter serait faux, mais parce qu\'une vraie position, même rare, donne plus de poids à toutes les autres.',
  },
};

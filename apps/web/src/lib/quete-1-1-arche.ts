/**
 * Archétypes de la quête 1.1 — Ta personnalité (gabarit fondateur).
 *
 * Task 74 — NOUVELLE VOIX (demande fondateur : « pourquoi tu ne peux pas
 * générer les textes de cette manière ? » — son texte complet pour V1 devient
 * la référence mot à mot ; les six autres types suivent le MÊME MOULE) :
 *  - intro : on entre direct, par « Toi, … » — la formule « Ton archétype
 *    révèle une personne qui… » et le « point de vigilance » en fin d'intro
 *    disparaissent (le fondateur ne les écrit plus) ;
 *  - « Ce que tu apportes » → « Ta force » — 2-3 phrases, ce que tu rends
 *    possible autour de toi ;
 *  - « Ce qui peut te freiner » → « Là où ça peut se compliquer » — « Quand …,
 *    tu … . Ce n'est pas un défaut : c'est le revers de … . Il arrive aussi
 *    que … . » (la reassurance est DANS le texte, plus en formule de clôture) ;
 *  - « En couple » — ce que tu apportes, la nuance (« certains…, d'autres… »),
 *    et un geste concret (« Prends l'habitude de … ») ;
 *  - « Ton équilibre » → « Ce que ce profil te souffle » — un geste + le
 *    « pas un problème / plus de chances de durer » du fondateur ;
 *  - la devise (« En résumé : « … » ») reste inchangée — le fondateur la
 *    reprend telle quelle dans son texte.
 *
 * Typo : masculin servi de neutre (choix explicite du fondateur — plus
 * d'écriture inclusive « ·rice/·se » dans ces textes), apostrophe ASCII,
 * tutoiement, phrases courtes.
 */
import type { ArchetypeCarte } from './quetes-plus';

export const ARCHES_1_1: Record<string, ArchetypeCarte> = {
  // V1 — L'Élan chaleureux : TEXTE VERBATIM DU FONDATEUR (Task 74) —
  // la référence mot à mot dont les autres types suivent le moule.
  V1: {
    intro:
      'Toi, la nouveauté te donne de l\'énergie. Une idée inattendue, une sortie improvisée, une conversation qui part dans tous les sens : tu dis oui, et tu embarques les autres avec toi. Ta curiosité est chaleureuse : tu ne gardes pas tes découvertes pour toi, tu les partages.',
    devise: 'Je dis oui au nouveau, et j\'y emmène les autres.',
    apportes:
      'Tu rends le monde plus grand autour de toi. Avec toi, on ose, on essaie, on découvre. Et tu invites les autres à venir, plutôt que d\'y aller seul.',
    freines:
      'Quand tout se répète, ou qu\'il faut attendre longtemps, tu t\'ennuies vite. Ce n\'est pas un défaut : c\'est le revers de ton envie de nouveau. Il arrive aussi qu\'un projet lancé avec enthousiasme soit remplacé par le suivant avant d\'être terminé.',
    couple:
      'Tu apportes des projets, des surprises, une relation où rien ne s\'endort. Mais tu avances vite : certains partenaires se sentent portés par ton élan, d\'autres ont l\'impression de courir derrière toi. Prends l\'habitude de demander à quelle vitesse l\'autre a envie d\'avancer.',
    equilibre:
      'Reviens de temps en temps vers ce qui compte déjà pour toi. Le nouveau n\'est pas un problème. Mais ce qui commence a plus de chances de durer quand ton élan sait aussi revenir vers ce que tu aimes déjà.',
  },

  // V2 — Le·La Bâtisseur·se : la parole qui tient, et son coût invisible.
  V2: {
    intro:
      'Toi, ce que tu promets t\'engage. Tu prépares, tu finis ce que tu commences, tu tiens ta parole — même sur les petites promesses. Ce n\'est pas de la rigidité : c\'est du respect, celui que tu portes aux choses, aux gens, à ta parole.',
    devise: 'Je promets peu, et je tiens tout ce que je promets.',
    apportes:
      'Les gens peuvent compter sur toi, et ils le savent. Ce qui compte, ils te le confient — parce que chez toi, c\'est gardé, fini, respecté. Ta présence régulière finit par devenir un repère.',
    freines:
      'Quand un imprévu dérègle le plan, ça te touche fort. Ce n\'est pas un défaut : c\'est le revers de ton besoin de solidité. Il arrive aussi que tu t\'accuses en premier, même quand tout ne dépendait pas de toi.',
    couple:
      'Tu construis une confiance qui se vérifie : des engagements clairs, une régularité qui rassure. Mais ton cadre peut peser : certains partenaires se sentent sécurisés, d\'autres ont l\'impression d\'être notés. Prends l\'habitude de laisser l\'autre faire à sa façon, de temps en temps — sans garder la note.',
    equilibre:
      'Accueille un imprévu sans tout rattraper. Ton besoin de solide n\'est pas un problème. Mais ce que tu construis a plus de chances de durer quand ta solidité sait aussi laisser respirer.',
  },

  // V3 — L'Étoile sociale : l'énergie qui anime, et le silence qui attend.
  V3: {
    intro:
      'Toi, les autres te donnent de l\'énergie. Tu lances les conversations, tu connectes les gens entre eux, tu transformes une ambiance terne en moment mémorable. Ta curiosité et ton énergie se renforcent : plus tu découvres, plus tu as envie de le raconter.',
    devise: 'Je découvre, je connecte, je fais circuler l\'énergie.',
    apportes:
      'Tu fais vivre les relations. Avec toi, une soirée s\'anime, les gens se parlent, les liens se font. Et tu rends ça facile : personne n\'a à forcer pour entrer dans ton énergie.',
    freines:
      'Quand ça se calme trop longtemps, le silence te pèse. Ce n\'est pas un défaut : c\'est le revers de ton besoin de mouvement. Il arrive aussi que tu remplisses un espace qui aurait mérité d\'être écouté.',
    couple:
      'Tu apportes de la complicité, des découvertes, une relation vivante. Mais ton rythme est rapide : certains partenaires se sentent portés, d\'autres ont l\'impression de ne plus suivre. Prends l\'habitude de proposer aussi des moments calmes, à deux, sans fond sonore.',
    equilibre:
      'Apprécie aussi ce qui ne bouge pas. Ton énergie n\'est pas un problème. Mais elle dure plus longtemps quand elle sait aussi se poser, de temps en temps, à côté de quelqu\'un.',
  },

  // V4 — L'Ancre : le calme qui porte les autres, et soi qui passe en dernier.
  V4: {
    intro:
      'Toi, tu es un endroit où ça va mieux. Le calme te traverse sans te casser ; les autres le sentent et s\'y appuient. Tu ne cherches pas à briller : tu cherches à faire du bien, sobrement, durablement.',
    devise: 'Je reste posé, et je fais du bien sobrement.',
    apportes:
      'Tu rends les gens plus calmes autour de toi. Avec toi, on respire, on se raconte, on revient à l\'essentiel. Et tu ne demandes rien en échange — c\'est ce qui rend ta présence si précieuse.',
    freines:
      'Quand une situation dure trop longtemps, tu restes bien plus que nécessaire. Ce n\'est pas un défaut : c\'est le revers de ta patience. Il arrive aussi que tes propres besoins passent en dernier, derrière ceux que tu accueilles.',
    couple:
      'Tu apportes une sécurité émotionnelle rare : tu écoutes, tu dures, tu ne dramatises pas. Mais tu peux t\'oublier : certains partenaires voient tout ce que tu portes, d\'autres ne le verront jamais. Prends l\'habitude de dire ce que toi tu portes, avant que ça pèse.',
    equilibre:
      'Compte-toi dans tes propres priorités. Ton calme n\'est pas un problème. Mais ce que tu donnes a plus de chances de tenir quand toi aussi, tu es compté dedans.',
  },

  // V5 — L'Intense : le volume maximum, et la vague qui traverse.
  V5: {
    intro:
      'Toi, tu vis les choses à volume maximum. Les joies te portent, les peines te traversent, rien ne te laisse neutre. Cette intensité que certains nomment « trop », c\'est aussi ta profondeur : tu remarques ce que les autres passent à côté, tu t\'attaches entièrement, tu te souviens de tout.',
    devise: 'Je vis les choses à volume maximum, et je ne fais pas à moitié.',
    apportes:
      'Tu rends les moments plus vrais. Avec toi, on rit plus fort, on parle de ce qui compte, on ne fait pas semblant. Et les liens se resserrent, parce que tu ne fais rien à moitié.',
    freines:
      'Quand une vague monte, elle te traverse en entier. Ce n\'est pas un défaut : c\'est le revers de ta façon de ressentir. Il arrive aussi qu\'une remarque bête t\'occupe des heures — et que le monde paraisse plus bruyant que pour d\'autres.',
    couple:
      'Tu apportes de la profondeur, de la passion, un lien sans demi-mesure. Mais la vague emporte parfois la conversation : certains partenaires aiment cette intensité, d\'autres ont besoin de savoir qu\'elle passe. Prends l\'habitude de prévenir quand tu la sens monter : « ce n\'est pas toi, c\'est la vague. »',
    equilibre:
      'Accorde-toi de vraies descentes après les vagues. Ressentir fort n\'est pas un problème. Mais cette intensité a plus de chances de durer quand elle sait aussi se reposer.',
  },

  // V6 — L'Indépendant·e profond·e : le monde intérieur, et la porte lente.
  V6: {
    intro:
      'Toi, tu vis vraiment dans ton monde intérieur. Longues pensées, projets de fond, conversations à deux qui durent des heures : tu préfères la profondeur au bruit. Ceux qui te connaissent savent que ton calme cache un feu tranquille.',
    devise: 'Je vis dans un monde intérieur vaste, et je l\'ouvre à ma façon.',
    apportes:
      'Tu écoutes vraiment. Avec toi, une conversation descend là où elle va, et l\'autre se sent choisi — parce que quand tu partages ton monde, c\'est un choix. Ceux qui entrent chez toi ne l\'oublient pas.',
    freines:
      'Quand il faut engager le premier contact, tu attends. Ce n\'est pas un défaut : c\'est le revers de ta façon de préserver ton monde. Il arrive aussi que des personnes que tu aurais aimées passent sans le savoir.',
    couple:
      'Tu apportes une intimité réelle : de la patience, de la profondeur, du respect du besoin d\'espace. Mais ton silence peut se lire comme une distance : certains partenaires apprennent à le lire, d\'autres le prennent pour du désintérêt. Prends l\'habitude de dire que dedans, tout est vivant.',
    equilibre:
      'Ouvre ta porte un peu plus tôt, même maladroitement. Ton monde n\'est pas un problème. Mais il a plus de chances d\'être partagé quand tu en laisses entrer quelqu\'un avant d\'avoir tout fini de penser.',
  },

  // V7 — L'Équilibriste : toutes les facettes, et le centre à faire entendre.
  V7: {
    intro:
      'Toi, tu ne rentres dans aucune case — et personne ne ment : selon les jours, on te décrit aventureux, solide, animé ou posé. Tu possèdes un peu de tout : de la curiosité, de la constance, du cœur, du calme. Et tu t\'adaptes à beaucoup de monde sans te sentir déguisé.',
    devise: 'Je suis plusieurs choses à la fois, et je tiens mon centre.',
    apportes:
      'Tu mets les gens à l\'aise. Chacun trouve une façon de se connecter à toi sans avoir à se justifier — c\'est un vrai don. Et ta souplesse fait de toi un compagnon facile à vivre, même dans les jours difficiles.',
    freines:
      'Quand il faut trancher vite ou tenir un camp longtemps, ça coince. Ce n\'est pas un défaut : c\'est le revers de ta faculté d\'adaptation. Il arrive aussi que tes désirs propres arrivent en deuxième, derrière l\'adaptation.',
    couple:
      'Tu apportes une acceptation rare : l\'autre existe tel qu\'il est, sans devoir choisir une version de lui. Mais tu épouses beaucoup de rythmes : certains partenaires se sentent profondément acceptés, d\'autres ne savent plus ce que toi tu veux. Prends l\'habitude de dire ce que toi tu veux, avant de t\'adapter.',
    equilibre:
      'Prends position à voix haute, une fois par jour — un choix, une envie, un refus. T\'adapter n\'est pas un problème. Mais ta polyvalence devient un don quand elle part d\'un centre visible.',
  },
};

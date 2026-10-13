/**
 * Archétypes de la quête 1.2 — Ta façon de t'attacher (gabarit fondateur,
 * NOUVELLE VOIX — Task 76, extension du moule validé sur la quête 1.1
 * Task 74 : la page V1 de 1.1 écrite par le fondateur fait référence).
 *
 * Le moule (identique à 1.1) :
 *  - intro : « Toi, … » — 3 phrases, pas de préambule, pas de clause
 *    « Ton point de vigilance : » (le contenu de vigilance vit désormais
 *    dans freines/couple/equilibre) ;
 *  - apportes (« Ta force ») : 2-3 phrases directes, « Tu … » ;
 *  - freines (« Là où ça peut se compliquer ») : « Quand …, tu … .
 *    Ce n'est pas un défaut : c'est le revers de … . Il arrive aussi que … » ;
 *  - couple (« En couple ») : « Tu apportes … . Mais … : certains…,
 *    d'autres…. Prends l'habitude de … . » ;
 *  - equilibre (« Ce que ce profil te souffle ») : conseil impératif +
 *    « … n'est pas un problème. Mais … a plus de chances de … quand … ».
 *  - devise : inchangée (déjà dans la voix du fondateur).
 *
 * Le masculin sert de neutre (choix explicite du fondateur — Task 74) :
 * plus d'écriture inclusive à point médian dans ces textes.
 *
 * SENSIBILITÉ ATTACHEMENT (inchangée) : l'archétype décrit une façon
 * d'aimer et de s'attacher (réassurance, espace, rythme du lien), jamais un
 * diagnostic. « Là où ça peut se compliquer » décrit des situations de lien
 * qui peuvent apparaître — pas des défauts ni des blessures. « En couple »
 * reste une dynamique possible, jamais une prédiction sur l'autre.
 *
 * Ancrage : les cartes VERBATIM restent dans quete-1-2.ts (lumiere/ombre/
 * tension intacts — Task 76 ne les touche pas), la couche « plus » (langage
 * matching, leviers) dans quete-1-2-plus.ts. Aucun segment ≥ 60 caractères
 * n'est recopié d'un module à l'autre.
 *
 * Typo : apostrophe ASCII uniquement, pas de mélange tu/vous.
 */
import type { ArchetypeCarte } from './quetes-plus';

export const ARCHES_1_2: Record<string, ArchetypeCarte> = {
  // V1 — L'Ancrage : le lien qui dure, sans paniquer.
  V1: {
    intro:
      'Toi, le lien, tu l\'installes dans la durée. Quand ça grince, tu dis les choses, tu répare tôt — et tu restes. La proximité te nourrit, la distance ne t\'effraie pas : ta force tient à peu, une présence régulière, un calme qui se vérifie.',
    devise: 'Je reste, je répare, je fais confiance au lien.',
    apportes:
      'Tu poses un socle : on sait d\'où l\'on part, on sait qui reste. Ton calme repose, tes accrocs se réparent vite, et tes moments ordinaires font lien.',
    freines:
      'Quand le calme dure, tu peux croire que tout est dit — et les preuves qu\'on oublie de donner laissent des doutes s\'installer chez l\'autre. Ce n\'est pas un défaut : c\'est le revers de ta stabilité. Il arrive aussi que tu corriges l\'inquiétude de l\'autre trop vite, avant qu\'il ait fini de la dire.',
    couple:
      'Tu apportes une présence qui se vérifie : tu restes, tu répares, tu construis sans bruit. Mais ce qui est évident pour toi ne se lit pas toujours de l\'extérieur : certains partenaires se nourrissent de ton calme, d\'autres s\'attendent à plus de preuves. Prends l\'habitude de dire ton attachement à voix haute, même quand il te semble visible.',
    equilibre:
      'Dis ton attachement assez souvent pour qu\'il s\'entende dehors. Ton calme n\'est pas un problème. Mais ce qui est évident pour toi a plus de chances d\'être vécu pareil par l\'autre quand tu le mets en mots.',
  },

  // V2 — La Vigie : l'antenne du lien, qui aime fort et veille.
  V2: {
    intro:
      'Toi, quand quelqu\'un compte, ton cœur s\'éveille. Tu repères les variations d\'humeur avant tout le monde, tu prends soin par petits gestes, et tu es là les jours difficiles comme les jours ordinaires. Ton attention est entière : quand tu donnes, tu donnes sans compter.',
    devise: 'J\'aime fort, je veille, je donne sans compter.',
    apportes:
      'Tu rends les gens visibles : remarqués, attendus, comptés. Ta loyauté est entière, et les gens se sentent en sécurité dans ton attention.',
    freines:
      'Quand le silence s\'installe, ton imagination travaille plus fort que nécessaire : un mot plus court, un message qui tarde, et tu cherches ce que ça veut dire. Ce n\'est pas un défaut : c\'est le revers de ton antenne. Il arrive aussi que tu lises des intentions là où il n\'y a qu\'une soirée chargée.',
    couple:
      'Tu apportes une profondeur rare : des signes d\'amour réguliers, une mémoire des petites choses, des mots dits au moment où le doute arrive. Mais ton antenne peut faire avancer le lien sur des hypothèses : certains partenaires se sentent portés par ton attention, d\'autres surveillés. Prends l\'habitude de demander plutôt que de décoder.',
    equilibre:
      'Demande, au lieu de deviner, ce qui t\'inquiète dans le lien. Ton antenne n\'est pas un problème. Mais une question dite à voix haute a plus de chances d\'apaiser un doute que des heures d\'interprétation.',
  },

  // V3 — L'Autonome : le lien à son rythme, avec de l'air.
  V3: {
    intro:
      'Toi, tu t\'appartiens d\'abord — et tu aimes sans vouloir t\'y perdre. Tu traverses tes tempêtes de ton côté, tu prends l\'air quand ça devient dense, et tu reviens quand tu as respiré. Ton amour est calme et stable, sans drame.',
    devise: 'J\'appartiens à ma vie, et j\'aime avec de l\'air.',
    apportes:
      'Tu apportes une confiance sans contrôle. Avec toi, personne n\'a à jouer un rôle : ta vie à toi nourrit la relation, et tes retours sont fidèles.',
    freines:
      'Quand la proximité devient dense, tu t\'éloignes — parfois sans un mot. Ce n\'est pas un défaut : c\'est le revers de ton besoin d\'air. Il arrive aussi que l\'autre invente les raisons de ton silence, parce que tes pauses partent sans explication.',
    couple:
      'Tu apportes un respect du rythme de chacun, une relation où chacun garde son monde. Mais tes pauses prises en silence peuvent ressembler à un départ : certains partenaires vivent ton air comme une respiration, d\'autres comme une fuite. Prends l\'habitude d\'annoncer le mouvement avant de le faire.',
    equilibre:
      'Annonce tes pauses avant de les prendre. Ton besoin d\'air n\'est pas un problème. Mais la façon de le prendre décide si l\'autre reste invité ou se sent exclu — et un mot simple suffit à tout changer.',
  },

  // V4 — Le Va-et-vient : deux vitesses, une seule façon d'aimer.
  V4: {
    intro:
      'Toi, tu aimes en deux temps : quand ça compte, tu t\'investis vite et fort ; puis, la proximité installée, une partie de toi cherche à reprendre de l\'air. Ce n\'est ni de la légèreté ni de la bizarrerie : c\'est une façon d\'avoir appris à aimer.',
    devise: 'Je m\'y donne entier, je respire, je reviens.',
    apportes:
      'Tu apportes du relief : une intensité qui revient, des retrouvailles vivantes. Quand tu es là, tu es là tout entier — rien ne devient un fond habituel.',
    freines:
      'Quand la proximité s\'installe, une partie de toi veut reprendre de l\'air — et tes éloignements partent parfois avant d\'être dits. Ce n\'est pas un défaut : c\'est le revers de ton rythme à deux vitesses. Il arrive aussi que l\'autre reçoive des signaux contradictoires, sans savoir quelle version de toi va revenir.',
    couple:
      'Tu apportes une intensité qui revient, des débuts qui embrasent, une présence entière quand elle est là. Mais ton rythme change de vitesse sans prévenir : certains partenaires se nourrissent de tes retours, d\'autres finissent par courir derrière toi. Prends l\'habitude de nommer tes deux vitesses avant que l\'autre ne les invente.',
    equilibre:
      'Nomme tes deux vitesses — une fois suffit. Ton va-et-vient n\'est pas un problème. Mais il a plus de chances d\'être vécu comme un rythme — et non comme une fuite — quand l\'autre n\'a plus à l\'interpréter.',
  },

  // V5 — L'Équilibre en mouvement : s'ajuste au lien sans s'y effacer.
  V5: {
    intro:
      'Toi, ta façon d\'aimer s\'ajuste à la personne en face : proche quand c\'est le besoin, discret quand c\'est l\'air. Tu traverses les deux mouvements sans drame — et cette souplesse est rare : elle donne au lien un confort que beaucoup voient.',
    devise: 'Je m\'ajuste à l\'autre, et je garde ma voix.',
    apportes:
      'Tu lis l\'autre finement, et tu t\'adaptes sans drame. Avec toi, le lien respire : les transitions se traversent sans secousse.',
    freines:
      'Quand tout va bien, tes envies propres arrivent en deuxième, derrière l\'adaptation. Ce n\'est pas un défaut : c\'est le revers de ta souplesse. Il arrive aussi que tes choix se prennent au seul goût de l\'autre, sans que tu aies posé ta voix.',
    couple:
      'Tu apportes des décisions prises à deux voix, des initiatives partagées, un lien qui accueille ses propres mouvements. Mais avec quelqu\'un qui choisit beaucoup, ta fluidité peut suivre un seul fil : certains partenaires trouvent ça doux, d\'autres s\'installent dedans sans t\'écouter. Prends l\'habitude de garder ta voix dans les choix, même petits.',
    equilibre:
      'Choisis, de temps en temps, à voix haute. T\'ajuster n\'est pas un problème. Mais ta souplesse vaut encore plus quand elle part d\'un centre visible — et ce centre, c\'est toi qui l\'entretiens.',
  },
};

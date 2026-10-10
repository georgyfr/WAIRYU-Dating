/**
 * Couche accompagnement de la quête 5.3 « Comment tu exprimes ton
 * affection » (Monde 6 « Mon Cœur »).
 *
 * Rédigée (jamais verbatim du Livrable), ton Task 35 : tutoiement, simple
 * et littéral, phrases courtes, jamais un diagnostic, jamais culpabilisant.
 * Alimente l'entrée « 5.3 » du registre (quetes.ts — branchement
 * orchestrateur, hors périmètre de ce fichier).
 *
 * LECTURE DESCRIPTIVE ET SYMÉTRIQUE (doctrine capitale du Livrable — à ne
 * pas inverser) : cinq canaux égaux en dignité — aucun canal supérieur, le
 * canal discret n'est pas un défaut : il est l'adresse des demandes non
 * formulées. La barre pleine ne flatte pas, la barre légère ne blâme pas :
 * cinq façons égales de dire et de recevoir l'affection.
 *
 * CONVERSATIONNELLE UNIQUEMENT (règle JAMAIS DANS LE SCORE, gravée au
 * module quete-5-3.ts) : les cinq barres routent l'affichage — carte,
 * miroir, signature affichée, mode d'emploi croisé à deux — et ne
 * traversent pas la frontière moteur/matching.
 *
 * Les clés des dims = les canaux du scorer (quete-5-3.ts), sans accent.
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots, aucun code/score
 * ni métadonnée moteur dans un texte rendu.
 */
import type { EntreeRegistre, IdQuete } from './quetes';

export const DEF_53: EntreeRegistre = {
  sousTitre:
    'Ce qui te fait te sentir aimé : les mots, le temps, les gestes, les attentions, le contact.',

  dims: [
    {
      key: 'mots',
      nom: 'Les mots valorisants',
      sousLigne: 'la parole qui remplit, la glissade des compliments',
      genre: 'm',
      lecture:
        'Cette barre dit la place des mots dans ton affection. Pleine : un mot juste te porte, la journée change de couleur. Légère : les compliments glissent — ton affection vit ailleurs. Les deux se valent : un canal décrit, aucun jugement.',
    },
    {
      key: 'temps',
      nom: 'Le temps partagé',
      sousLigne: 'la présence pleine, l\'écran qui coupe',
      genre: 'm',
      lecture:
        'Cette barre dit le temps posé à deux. Pleine : une soirée sans écran te remplit, la marche suffit. Légère : une présence distraite te suffit — ton remplissage vit ailleurs. Les deux se valent : la barre raconte, elle ne classe pas.',
    },
    {
      key: 'gestes',
      nom: 'Les gestes et services',
      sousLigne: 'l\'aide qui parle, la tâche muette',
      genre: 'm',
      lecture:
        'Cette barre dit ce que l\'aide te dit. Pleine : un service rendu te touche autant qu\'un mot. Légère : un geste reste un geste — ton affection passe par d\'autres portes. Les deux se valent : des façons égales de dire l\'amour.',
    },
    {
      key: 'attentions',
      nom: 'Les attentions et cadeaux',
      sousLigne: 'l\'objet qui pense à toi, le cadeau discret',
      genre: 'f',
      lecture:
        'Cette barre dit le poids des attentions choisies. Pleine : un objet pensé pour toi te marque, il prouve qu\'on a écouté. Légère : un cadeau, même soigné, te dit peu — la preuve ne te parle pas. Les deux se valent : la barre décrit un canal, elle ne le note pas.',
    },
    {
      key: 'contact',
      nom: 'Le contact physique',
      sousLigne: 'la peau d\'abord, la distance confortable',
      genre: 'm',
      lecture:
        'Cette barre dit la place du toucher. Pleine : un câlin dit ce que les mots n\'atteignent pas. Légère : te sentir aimé sans toucher est une langue à part entière. Les deux se valent — la distance n\'est pas une froideur.',
    },
  ],

  accompagnement: {
    // SENS : fort = canal plein (il te remplit) · doux = canal discret
    // (réserve de demandes non formulées) — les deux se valent, aucun
    // palier flatté ni blâmé (symétrie des canaux).
    mots: {
      fort:
        'Les mots te remplissent : un compliment sincère te porte, une phrase juste te rallume. Ce qui aide : nommer le mot que tu attends — l\'autre l\'apprend vite.',
      equilibre:
        'Les mots comptent, sans dominer : ils te touchent, et d\'autres canaux aussi. Ce qui aide : dire quand une phrase a fait du bien — l\'autre garde la clé.',
      doux:
        'Les compliments glissent : ton affection passe par d\'autres portes, et ça se respecte. Ce n\'est pas un défaut — une réserve. Ce qui aide : à deux, nommer ce qui te remplit vraiment.',
    },
    temps: {
      fort:
        'Le temps posé te remplit : une soirée sans écran, une marche à deux, et tu te sens aimé. Ce qui aide : poser un créneau nommé plutôt qu\'un reproche diffus.',
      equilibre:
        'Le temps partagé compte, entre autres : la présence pleine te touche, les gestes aussi. Ce qui aide : garder un rituel à deux — la présence se planifie un peu.',
      doux:
        'Une présence distraite te suffit : ton remplissage vit dans d\'autres canaux. Ce n\'est pas de l\'indifférence — une autre adresse. Ce qui aide : le dire à l\'autre, pour éviter les malentendus.',
    },
    gestes: {
      fort:
        'L\'aide te parle : la valise montée, le plein fait, et tu te sens aimé. Ce qui aide : dis ce qui t\'aiderait — sans attendre l\'échange exact.',
      equilibre:
        'Un service rendu te touche, sans dominer : les mots et le temps comptent autant. Ce qui aide : remercier à ta façon — la gratitude passe sur ton canal.',
      doux:
        'Un service reste une tâche : ton affection vit ailleurs, et c\'est une place entière. Ce qui aide : à deux, traduire ce que l\'aide voulait dire.',
    },
    attentions: {
      fort:
        'L\'attention choisie te marque : l\'objet pensé dit que quelqu\'un a écouté. Ce qui aide : raconter une attention qui t\'a marqué — la règle sort du tiroir.',
      equilibre:
        'Les attentions te touchent, sans dominer : un détail fait plaisir, le reste aussi. Ce qui aide : fêter les autres à ta façon — ton canal s\'exprime aussi.',
      doux:
        'Un cadeau, même soigné, te dit peu : ton remplissage vit sur d\'autres canaux. Ce n\'est pas de la froideur — une autre adresse. Ce qui aide : nommer ce qui te parle, avant les occasions ratées.',
    },
    contact: {
      fort:
        'Le contact dit vite : une main, une épaule, et les mots passent au second plan. Ce qui aide : demander le contact par son nom — l\'autre répond à une demande.',
      equilibre:
        'Le contact compte, parmi d\'autres : une étreinte fait du bien, un mot aussi. Ce qui aide : accueillir les deux langues — la tienne et celle de l\'autre.',
      doux:
        'Te sentir aimé sans toucher est une langue entière : la distance n\'est pas une froideur. Ce qui aide : à deux, expliquer ta langue — le câlin de l\'autre reste un mot, pas une exigence.',
    },
  },

  conseils: [
    'Ta carte est un mode d\'emploi croisé à deux : chacun raconte son canal, l\'autre apprend.',
    'Les cinq canaux se valent : le discret n\'est pas un défaut, il garde tes demandes non formulées.',
    'Aucune barre ne se compare : ton canal qui parle décrit ce qui te remplit, rien de plus.',
    'Dans la conversation, montre ta carte : des mots pour se parler, pas des chiffres pour se trier.',
  ],

  commentLire:
    'Cinq barres, et elles viennent de TES réponses : les mots, le temps, les gestes, les attentions, le contact. ' +
    'Cinq canaux d\'affection, égaux en dignité — la barre décrit un canal, elle ne le classe pas. ' +
    'Elles vont de 0 à 100 — ni une note, ni un verdict. ' +
    'Une barre pleine dit un canal qui te remplit ; une barre légère dit une réserve de demandes non formulées. ' +
    'Ce qu\'elles regardent et ce qu\'elles disent de toi sont écrits dessous — relis-les comme un portrait à deux, pas une hiérarchie.',

  ombreRelationnel: {
    'CARTE-5.3-MOTS-QUI-DISENT':
      'En relation, ta zone d\'ombre peut donner : le silence lu comme une absence d\'amour. Ce qui aide : demander le mot que tu attends — un blanc se demande, il ne se déchiffre pas.',
    'CARTE-5.3-PRESENCE-PLEINE':
      'En relation, ta zone d\'ombre peut donner : la solitude à deux quand l\'écran reste allumé. Ce qui aide : un créneau nommé, posé ensemble — l\'habitude se renomme, elle ne se juge pas.',
    'CARTE-5.3-GESTE-QUI-DIT':
      'En relation, ta zone d\'ombre peut donner : la facture mentale de celui qui donne et compte. Ce qui aide : dire ce qui t\'aiderait sans attendre l\'échange — le service se donne, il ne se rembourse pas.',
    'CARTE-5.3-DETAIL-JUSTE':
      'En relation, ta zone d\'ombre peut donner : la notation discrète des preuves reçues. Ce qui aide : raconter l\'attention qui t\'a marqué — la règle cachée sort du tiroir.',
    'CARTE-5.3-PEAU-QUI-PARLE':
      'En relation, ta zone d\'ombre peut donner : une pause lue comme un désamour. Ce qui aide : nommer le contact attendu — le repos de l\'autre reste du repos, pas un refus.',
    'CARTE-5.3-ECOUTE-LARGE':
      'En relation, ta zone d\'ombre peut donner : un besoin diffus que l\'autre devine mal. Ce qui aide : classer tes trois dernières joies à deux — la tête de liste dit ton canal.',
  },

  // La chaîne du Monde 6 saute à 5.7 « Ton humour » (cadre gelé) — l'id
  // entre dans l'union IdQuete au branchement orchestrateur ; le cast
  // garde ce fichier compilable avant l'intégration.
  suivante: '5.7' as IdQuete,

  suite: {
    titre: 'La suite de ton voyage',
    intro:
      'Tes canaux sont posés — cinq façons égales de dire et de recevoir l\'affection, et un mode d\'emploi à deux. ' +
      'La prochaine étape regarde ton rire : ton humour, celui qui te traverse — avec une carte à partager si tu veux.',
    questions: [
      'Quel mot, quel geste, quelle attention te dit « je t\'aime » sans le dire ?',
      'À deux, quel canal de l\'autre t\'est le plus difficile à lire ?',
    ],
    cta: 'Découvrir ton humour',
  },
};

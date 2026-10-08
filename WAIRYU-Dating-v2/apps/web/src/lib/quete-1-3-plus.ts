/**
 * Couche « plus » de la quête 1.3 « Tes émotions » — 6 cartes V1-V6,
 * 3 dimensions P/R/X. Task 32 — demande fondateur (critique du PDF :
 * enrichir la révélation personnelle et l'utilité relationnelle).
 *
 * Types : ./quetes-plus. Rédaction app : jamais d'étiquette, jamais de
 * diagnostic, tutoiement, phrases courtes et concrètes. Chaque texte
 * s'ancre sur la carte VERBATIM (quete-1-3.ts : nom, lumiere, ombre,
 * tension) et sur le volet relationnel (quetes.ts : ombreRelationnel) —
 * on écrit AUTOUR, on ne répète pas. Les leviers P/R/X sont écrits pour
 * la tendance mesurée (comme l'accompagnement « fort » décrit le score
 * haut dans quetes.ts) : force, risque = débordement (pas un défaut),
 * levier = action concrète.
 */
import type { CouchePlus } from './quetes-plus';

export const PLUS_1_3: CouchePlus = {
  cartes: {
    V1: {
      preuves: [
        'Tu remarques tôt quand ton humeur change — et tu sais souvent dire si c\'est de la fatigue, de la tristesse ou de la nervosité.',
        'Quand ça monte, tu as déjà tes gestes qui apaisent : une marche, un souffle, un temps — tu ne les improvises pas au dernier moment.',
        'Tu peux rester avec une émotion pénible sans la fuir tout de suite : tu l\'accueilles d\'abord, tu la traverses ensuite.',
        'Les mélanges ne t\'effraient pas : tu peux porter de la joie et du chagrin le même soir, sans avoir à choisir.',
        'Certaines vagues, tu préfères les régler seul·e : tendre la main pendant la vague ne te vient pas spontanément.',
      ],
      besoins: [
        'Qu\'on te laisse le temps de nommer avant d\'en parler : la clarté d\'abord, la conversation ensuite.',
        'Que ton calme ne soit pas confondu avec de l\'absence — en dedans, ça travaille toujours.',
        'Pouvoir montrer une émotion que tu ne maîtrises pas encore, sans qu\'on remette ta méthode en cause.',
      ],
      ressenti: [
        '« Avec toi, on sait où on en est : tu mets des mots là où d\'autres mettent des silences. »',
        '« J\'aimerais parfois que tu m\'ouvres une émotion en cours de route — pas seulement une fois qu\'elle est réglée. »',
      ],
      apportes: [
        'Des mots clairs',
        'Un calme qui rassure',
        'Des tensions désamorcées tôt',
        'Peu de drame',
        'Une clarté qui apaise',
      ],
      apprendre: [
        'Tendre la main pendant la vague, pas après',
        'Accepter un regard extérieur sur une émotion',
        'Laisser une émotion rester un peu floue',
        'Distinguer maîtriser d\'avec contrôler',
      ],
      question:
        'Et si la preuve de ta maîtrise n\'était pas de tout traverser seul·e, mais de laisser quelqu\'un passer à ton côté ?',
      langage: {
        donnes: 'clarté + calme + mots justes',
        recherches: 'sincérité + profondeur + respect du rythme',
        surveilles: 'isolement + sur-analyse + contrôle',
        apprecierais:
          'une personne qui sait que ton calme n\'est pas de l\'indifférence, et qui te propose son aide sans attendre que tu demandes.',
      },
    },
    V2: {
      preuves: [
        'Une bonne nouvelle t\'allume en trois secondes : tu ris avant d\'avoir compris pourquoi.',
        'Une contrariété monte vite — voix qui hausse, gestes qui s\'emportent — et retombe presque aussi vite.',
        'Tes émotions te prennent parfois par surprise : tu te rends compte que tu es fâché(e) en plein milieu de la phrase.',
        'Après un coup de chaud, tu relances parfois la conversation avant d\'être tout à fait redescendu(e) — et un mot de trop s\'invite.',
        'Chez toi, ce qui est ressenti est réel : la joie fait lever les tables, la tristesse se voit, rien ne reste tiède.',
      ],
      besoins: [
        'Qu\'on entende le fond sous le ton : quand tu montes, il y a presque toujours une vraie raison en dessous.',
        'Un peu de marge le temps que la vague retombe — sans être jugé(e) sur ta minute la plus haute.',
        'Un retour rapide après l\'éclat : la réparation vaut plus que la prévention parfaite.',
      ],
      ressenti: [
        '« Avec toi, on ne s\'ennuie jamais : ta passion donne le goût de vivre plus fort. »',
        '« J\'aimerais parfois que tu me préviennes quand ça monte — le ton me parle avant que le fond n\'arrive. »',
      ],
      apportes: [
        'Une passion qui entraîne',
        'Des émotions à vif',
        'Une joie contagieuse',
        'Des excuses rapides',
        'Du vrai, jamais tiède',
      ],
      apprendre: [
        'Prévenir tôt que ça monte',
        'Repérer ton premier signal physique',
        'Prendre une respiration avant la phrase qui blesse',
        'Dire la raison, pas seulement l\'éclat',
      ],
      question:
        'Qu\'est-ce que tu ne voudrais jamais voir emporté par une vague — et que feras-tu, la prochaine fois, pour le protéger ?',
      langage: {
        donnes: 'passion + énergie + spontanéité',
        recherches: 'chaleur + authenticité + ouverture',
        surveilles: 'précipitation + éclat + regret',
        apprecierais:
          'une personne qui ne s\'arrête pas à ton ton, et qui sait demander « qu\'est-ce qui se passe vraiment ? » au bon moment.',
      },
    },
    V3: {
      preuves: [
        'Tu réalises parfois ce que tu ressentais bien après coup — le lendemain, tu comprends que c\'était de la colère, ou de la tristesse.',
        'Ton corps te prévient avant ta tête : une mâchoire serrée, une fatigue soudaine — et toi, tu apprends à y lire ton état.',
        'Les grosses journées émotionnelles ne se voient pas sur toi : tu les traverses en silence, et tu continues d\'avancer.',
        'Il t\'arrive d\'attendre que ça passe tout seul — pendant que l\'autre, de son côté, attendait un mot.',
        'Ceux qui te connaissent bien savent lire tes petits signes : chez toi, un sourire en coin vaut une déclaration.',
      ],
      besoins: [
        'Qu\'on ne lise pas ton silence comme de l\'indifférence — ta profondeur n\'est pas une absence.',
        'Pouvoir ouvrir à ton rythme : un sondage en direct te fait reculer, un peu de temps t\'aide à avancer.',
        'Un petit code entre vous — un mot, un geste — qui dit ce que tes phrases ne disent pas.',
      ],
      ressenti: [
        '« Avec toi, c\'est calme : ta stabilité me repose des jours bruyants. »',
        '« J\'aimerais parfois savoir ce qui vit en toi — sans devoir deviner à tes signes. »',
      ],
      apportes: [
        'Une profondeur constante',
        'Du calme sous pression',
        'Des mots comptés mais vrais',
        'Une présence qui dure',
        'Zéro tempête',
      ],
      apprendre: [
        'Dire un mot avant que ça passe',
        'Nommer après coup, à voix haute',
        'Poser le petit signe convenu',
        'Accepter que le silence ne transmette pas tout',
      ],
      question:
        'Si l\'autre ne peut pas deviner, à quoi reconnaîtra-t-il que tu es là, que tu vas bien, que tu comptes ?',
      langage: {
        donnes: 'profondeur + stabilité + fidélité',
        recherches: 'patience + douceur + authenticité',
        surveilles: 'silence + attente + distance',
        apprecierais:
          'une personne qui lit tes petits signes, et qui n\'a pas besoin que tout crie pour croire que c\'est vrai.',
      },
    },
    V4: {
      preuves: [
        'Une amie t\'appelle quand ça ne va pas — et après la conversation, elle va mieux, sans toujours savoir pourquoi.',
        'Tu célèbres les nouvelles des autres comme si c\'étaient les tiennes : premier au « oui !! » du groupe.',
        'Tu repères vite quand quelqu\'un va mal, même s\'il ne le dit pas — tu t\'approches, tu poses, tu restes.',
        'Quand on te demande « et toi, comment ça va ? », le « ça va » arrive vite — parfois trop vite.',
        'Tes propres grosses émotions, tu les traites souvent en différé : plus tard, en douce, ou jamais.',
      ],
      besoins: [
        'Qu\'on te pose la question « et toi ? » — et qu\'on attende la vraie réponse.',
        'Une personne avec qui renverser le flux : où c\'est toi qui te confies un peu.',
        'Le droit d\'avoir des vagues à toi, sans reprendre aussitôt le rôle du pilier.',
      ],
      ressenti: [
        '« Avec toi, on se sent accueilli(e) : après t\'avoir parlé, ça va mieux. »',
        '« J\'aimerais parfois connaître tes vagues à toi — j\'ai l\'impression de te connaître sans te connaître. »',
      ],
      apportes: [
        'Une écoute rare',
        'Une chaleur qui remet d\'aplomb',
        'Les joies des autres fêtées',
        'Un réconfort qui console',
        'Une loyauté discrète',
      ],
      apprendre: [
        'Répondre vrai à « et toi ? »',
        'Prendre ton tour de vague',
        'Choisir une personne à qui dire tes états',
        'Recevoir sans rendre la monnaie',
      ],
      question:
        'Si demain plus personne n\'avait besoin de toi, que resterait-il — et qui saurait comment tu vas ?',
      langage: {
        donnes: 'chaleur + écoute + encouragement',
        recherches: 'présence + réciprocité + soin',
        surveilles: 'surengagement + différé + épuisement',
        apprecierais:
          'une personne qui pose la question « et toi ? » — et qui attend la vraie réponse jusqu\'au bout.',
      },
    },
    V5: {
      preuves: [
        'Un message long sort de toi plus facilement qu\'une phrase à voix haute : l\'écrit dit ce que la voix bloque encore.',
        'Dire « tu comptes pour moi » à voix haute te met mal à l\'aise — même quand c\'est totalement sincère.',
        'Quand tu ouvres, c\'est choisi : tu confies peu, mais précisément — et ça marque ceux qui reçoivent.',
        'Tu peux traverser une émotion forte en public sans que rien ne se voie : dehors, le calme ; dedans, tout est vivant.',
        'Il t\'arrive de croire que ça se voit — et de découvrir que l\'autre n\'avait rien perçu.',
      ],
      besoins: [
        'Que ton attachement ne se mesure pas en décibels : ta pudeur n\'est pas un manque de lien.',
        'Du temps : ta confiance s\'ouvre par degrés, pas d\'un coup.',
        'Qu\'on accepte tes canaux — l\'écrit d\'abord, la voix ensuite : c\'est le même cœur qui parle.',
      ],
      ressenti: [
        '« Quand tu t\'ouvres, c\'est vrai : chaque confiance que tu donnes, je la garde précieusement. »',
        '« J\'aimerais parfois en voir un peu plus tôt — pour être sûr(e) que ta réserve n\'est pas une distance. »',
      ],
      apportes: [
        'Une intensité tenue',
        'Des confiances choisies',
        'Rien de joué',
        'Une fidélité aux liens',
        'Des ouvertures qui valent de l\'or',
      ],
      apprendre: [
        'Écrire d\'abord, parler ensuite',
        'Annoncer ton style : « je ressens beaucoup, je montre peu »',
        'Offrir une ouverture un peu plus tôt',
        'Accepter que l\'autre ait besoin de signes',
      ],
      question:
        'Qu\'est-ce que quelqu\'un verrait s\'il pouvait regarder en dedans — et qu\'est-ce qui t\'arrête de le laisser jeter un œil ?',
      langage: {
        donnes: 'intensité + discrétion + loyauté',
        recherches: 'confiance + constance + sens',
        surveilles: 'pudeur + non-dit + malentendu',
        apprecierais:
          'une personne qui respecte tes rythmes, et qui traite chaque ouverture comme le cadeau qu\'elle est.',
      },
    },
    V6: {
      preuves: [
        'Quand on te demande ce que tu ressens, il t\'arrive de répondre honnêtement : « je ne sais pas encore » — et c\'est déjà une réponse.',
        'Certaines journées, c\'est clair : tu sais ce qui remue. D\'autres, c\'est le brouillard — et tu apprends que c\'est le rythme normal.',
        'Tu commences à repérer les indices : cette boule au ventre, cette irritabilité qui arrive avant la conscience de la colère.',
        'Il t\'arrive d\'esquiver une conversation émotionnelle par prudence — pas par indifférence : tu ne sais pas encore quoi dire.',
        'Une émotion nommée une fois, tu la reconnais mieux la suivante : le chantier rapporte à chaque étape.',
      ],
      besoins: [
        'Qu\'on prenne ton « je ne sais pas encore » pour une recherche, pas pour un mur.',
        'Des questions simples plutôt que des sondages : « qu\'est-ce que tu ressens, maintenant ? » est déjà assez grande.',
        'De la patience encourageante : on apprend mieux quand on a le droit d\'être débutant.',
      ],
      ressenti: [
        '« Avec toi, je sens que tu cherches vraiment : ta sincérité, ça se sent. »',
        '« J\'aimerais parfois que tu me dises où tu en es dans ta recherche — pour ne pas prendre ton flou pour un mur. »',
      ],
      apportes: [
        'Une recherche sincère',
        'Des progrès à chaque étape',
        'Zéro prétention',
        'Une curiosité sur soi',
        'Du vrai, même flou',
      ],
      apprendre: [
        'Poser la question du jour : « qu\'est-ce que je ressens ? »',
        'Partager la recherche à voix haute',
        'Distinguer fatigue, tristesse, nervosité, excitation',
        'Accueillir le chantier sans exiger l\'arrivée',
      ],
      question:
        'Et si tu ne connaissais jamais complètement ce qui remue en toi — est-ce que ça vaudrait quand même la peine de creuser ?',
      langage: {
        donnes: 'humilité + curiosité + progression',
        recherches: 'douceur + encouragement + bienveillance',
        surveilles: 'esquive + découragement + comparaison',
        apprecierais:
          'une personne qui pose des questions simples, et qui célèbre tes progrès sans tout attendre tout de suite.',
      },
    },
  },
  leviers: {
    P: {
      force: 'Tu repères tôt ce qui monte en toi, même quand plusieurs émotions sont mêlées.',
      risque:
        'À force d\'élucider tôt, tu peux analyser l\'émotion au lieu de la vivre — et te croire un point final là où un regard extérieur aiderait.',
      levier:
        'Quand tu as nommé ce que tu ressens, demande-toi ce que tu en fais : la clarté est la première marche, pas l\'arrivée.',
    },
    R: {
      force: 'Quand ça monte, tu connais ton chemin de retour — gestes, mots, temps : la vague ne décide pas pour toi.',
      risque:
        'Te calmer seul·e peut devenir la seule voie — l\'autonomie glisse en « je gère tout moi-même », même quand de l\'aide raccourcirait la vague.',
      levier:
        'Une fois sur deux, fais redescendre la vague avec quelqu\'un : un simple « ça monte, ce n\'est pas toi » ouvre la porte à l\'aide.',
    },
    X: {
      force: 'Ce que tu ressens se voit et se dit : tu félicites, tu consoles, tu dis aux gens ce qu\'ils représentent pour toi.',
      risque:
        'L\'espace donné aux émotions des autres peut laisser les tiennes à la file d\'attente — et l\'entourage finit par oublier que toi aussi, tu as des vagues.',
      levier:
        'Choisis, chaque semaine, une personne et un instant pour dire ton état du moment : tes vagues aussi ont droit à la sortie.',
    },
  },
};

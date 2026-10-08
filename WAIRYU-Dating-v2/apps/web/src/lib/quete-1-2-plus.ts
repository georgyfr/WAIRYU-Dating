/**
 * Couche « plus » de la quête 1.2 — Ta façon de t'attacher (Task 32, demande fondateur).
 *
 * 5 cartes (V1 L'Ancrage, V2 La Vigie, V3 L'Autonome, V4 Le Va-et-vient,
 * V5 L'Équilibre en mouvement) + 2 dimensions (A réassurance, E espace).
 *
 * Rédaction app : jamais d'étiquette (« tu es »), jamais un diagnostic —
 * « tu peux », « chez toi, cela peut donner ». Les textes VERBATIM (lumiere,
 * ombre, tension) restent dans quete-1-2.ts (règle 11-b) : ce fichier écrit
 * AUTOUR d'eux — preuves, besoins, ressenti de l'autre, apportes, apprendre,
 * question à emporter, langage relationnel (moteur de matching), leviers.
 * Tutoiement, phrases courtes, genre neutre ((e) / ·e), chaud et honnête.
 */
import type { CouchePlus } from './quetes-plus';

export const PLUS_1_2: CouchePlus = {
  cartes: {
    V1: {
      // L'Ancrage — aimer sans paniquer ; ombre : sous-estimer les preuves de l'autre.
      preuves: [
        'Tu peux aimer sans paniquer : un message qui tarde te préoccupe un instant, puis se pose — tu fais confiance au lien.',
        'Après un accroc, tu cherches vite la réparation : tu reviens, tu dis les choses, tu ne laisses pas le silence fabriquer des dossiers.',
        'Tu dis les choses simples qui rassurent : « je suis bien, je reste » — tu le penses, tu le dis, et l\'autre peut s\'y appuyer.',
        'Les jours ordinaires te nourrissent : les courses, la cuisine, le silence à deux — pour toi, c\'est du lien, pas du temps perdu.',
        'Chez toi, l\'évidence intérieure ne se voit pas toujours dehors : tu peux oublier que l\'autre a besoin de l\'entendre, pas seulement de le sentir.',
      ],
      besoins: [
        'de mots simples dits à voix haute : ce que toi tu vis tranquillement, tu sais qu\'il faut aussi l\'entendre.',
        'd\'un partenaire qui dit quand quelque chose ne va pas — tu sais traverser les nouvelles, pas les devinettes.',
        'd\'un rythme qui respecte tes deux mouvements : de la vraie proximité, et des moments à toi qui gardent ton retour un choix.',
      ],
      ressenti: [
        '« Avec toi, c\'est calme : je me repose sans avoir à jouer un rôle. »',
        '« Ton tranquille me fait du bien — mais j\'aimerais parfois l\'entendre, pas seulement le deviner. »',
      ],
      apportes: [
        'une stabilité qui repose',
        'des accrocs vite réparés',
        'un « je reste » qui se vérifie',
        'de l\'air donné librement',
        'une présence sans théâtre',
      ],
      apprendre: [
        'montrer ton attachement avant qu\'on te le demande',
        'dire ta stabilité à voix haute',
        'accueillir le doute de l\'autre sans le corriger trop vite',
        'célébrer ce qui marche, pas seulement l\'entretenir',
      ],
      question:
        'Et si l\'autre avait besoin d\'entendre ce que toi tu vis tranquillement — quelle preuve te coûterait peu et lui donnerait beaucoup ?',
      langage: {
        donnes: 'calme + constance + confiance qui ne surveille pas',
        recherches: 'sincérité + stabilité + liens dits à voix haute',
        surveilles: 'évidence + preuves oubliées + routine',
        apprecierais:
          'une personne qui sait dire les choses simples quand elles comptent — et qui ne confond pas ton calme avec de l\'indifférence.',
      },
    },
    V2: {
      // La Vigie — aimer fort et veiller ; ombre : le silence de l'autre te parle trop fort.
      preuves: [
        'Quand quelqu\'un compte pour toi, tu y penses souvent : tu repères un mot plus court, une réponse plus lente, une humeur qui descend — avant tout le monde.',
        'Tu veilles par petits gestes : prendre des nouvelles, prévoir le prochain rendez-vous, vérifier que tout va bien entre vous.',
        'Tu donnes sans tenir la comptabilité : tu es là quand ça va mal, sans calculer qui a fait quoi la dernière fois.',
        'Un silence peut t\'occuper une soirée entière : tu relis un message, tu cherches ce qu\'il veut dire — tu le tournes et le retournes.',
        'Ton imagination anticipe parfois une fin avant tout signal : tu prépares le coup dur pour ne pas être pris(e) au dépourvu.',
      ],
      besoins: [
        'de preuves régulières que le lien tient : un mot, un message, un geste — les petits signes comptent pour toi autant que les grands.',
        'de clarté sur où tu en es : les zones floues font travailler ton imagination plus fort que nécessaire.',
        'd\'être rassuré(e) par la parole, au moment où le doute arrive : « tout va bien » dit simplement vaut mieux qu\'un signe deviné.',
      ],
      ressenti: [
        '« Avec toi, je me sens unique : tu remarques tout, tu t\'occupes vraiment de moi. »',
        '« Ton attention m\'émeut — mais j\'aimerais parfois que tu me croies sur parole quand je dis que tout va bien. »',
      ],
      apportes: [
        'une attention de chaque instant',
        'une fidélité qui veille',
        'un don sans comptabilité',
        'une loyauté entière',
        'des retrouvailles qui comptent',
      ],
      apprendre: [
        'demander au lieu de décoder',
        'laisser un silence durer sans le traduire',
        'dire ton besoin au moment où il arrive',
        'poser ton antenne de temps en temps',
      ],
      question:
        'Et si ce que ton cœur attendait ne pouvait venir que d\'une phrase dite à voix haute — qu\'est-ce qui te retient de la prononcer ?',
      langage: {
        donnes: 'attention + loyauté + générosité du cœur',
        recherches: 'clarté + réconfort + présence régulière',
        surveilles: 'silence + décodage + attente',
        apprecierais:
          'une personne qui donne des signes clairs sans qu\'on les lui demande — et qui lit dans ton attention de la profondeur, pas de la surveillance.',
      },
    },
    V3: {
      // L'Autonome — tu t'appartiens ; ombre : ton besoin d'air peut ressembler à une fuite.
      preuves: [
        'Tes moments à toi restent à toi, même quand quelqu\'un compte beaucoup pour toi : c\'est ce qui te garde entier(ère).',
        'Tu gères tes tempêtes de ton côté d\'abord : tu préfères avoir fini de trier avant de raconter.',
        'En relation, tu ne produis pas de drame : ta façon d\'aimer est calme et stable — tu cherches où ça coule, pas où ça bouillonne.',
        'Trop de proximité trop vite te donne envie de prendre de l\'air — même quand tout va bien, même quand tu aimes.',
        'Quand une relation devient profonde, une partie de toi ralentit : tu peux raccourcir un échange, espacer un moment — pas par désamour, par réflexe d\'équilibre.',
      ],
      besoins: [
        'd\'un espace qui reste à toi : tes moments, tes projets, ton coin de monde — sans justification.',
        'd\'un partenaire qui lit tes pauses autrement que comme des départs.',
        'de clarté réciproque sur le rythme : de la proximité réelle, entrecoupée de respirations annoncées.',
      ],
      ressenti: [
        '« Avec toi, il y a de l\'air : je respire bien dans ce lien, tu ne m\'étouffes jamais. »',
        '« J\'apprécie ton indépendance — mais quand tu t\'éloignes sans un mot, j\'invente ce qui se passe. »',
      ],
      apportes: [
        'un amour sans drame',
        'une présence qui choisit',
        'des retours fidèles',
        'un espace respecté pour deux',
        'un calme qui tient',
      ],
      apprendre: [
        'annoncer ta pause avant de la prendre',
        'raconter ta tempête pendant qu\'elle a lieu',
        'accepter de l\'aide sur une vague',
        'dire ton attachement aussi simplement que ton besoin d\'air',
      ],
      question:
        'Et si ton besoin d\'air n\'était pas le problème — comment le prendre pour que l\'autre reste invité(e) plutôt qu\'exclu(e) ?',
      langage: {
        donnes: 'indépendance + calme + fidélité au retour',
        recherches: 'respect du rythme + légèreté + confiance sans contrôle',
        surveilles: 'pauses non dites + interprétations + vitesse',
        apprecierais:
          'une personne qui vit sa propre vie entière, qui aime revenir te trouver sans avoir besoin de te garder — et qui entend ta pause comme une respiration, pas comme une fin.',
      },
    },
    V4: {
      // Le Va-et-vient — cœur à deux vitesses ; ombre : des signaux contradictoires.
      preuves: [
        'Quand ça compte, tu veux tout : tu t\'investis vite, fort, avec toute ta présence — les débuts te portent.',
        'Puis, une fois la proximité installée, une partie de toi cherche l\'air : tu raccourcis un échange, tu reports un moment, tu reprends ta marge.',
        'Les retrouvailles te rechargent : après une prise d\'air, l\'envie revient entière — comme si la respiration ravivait le lien.',
        'Tu peux aimer quelqu\'un et douter de lui le même soir : ton cœur change de vitesse sans demander l\'avis de la raison.',
        'Ce va-et-vient peut te lasser toi-même : tu te demandes parfois pourquoi tu n\'arrives pas à te poser, même quand c\'est bien.',
      ],
      besoins: [
        'd\'un partenaire qui tient le rythme avec toi : présent(e) quand tu es là, tranquille quand tu prends l\'air.',
        'de nommer tes deux vitesses à voix haute — non dites, elles deviennent des signaux que l\'autre interprète à ta place.',
        'd\'une sécurité qui ne compte pas tes allers-retours : savoir que ton retour ne sera pas retenu contre toi.',
      ],
      ressenti: [
        '« Quand tu es là, tu es vraiment là : c\'est intense, et ça fait du bien. »',
        '« J\'aime ton intensité — mais les allers-retours m\'épuisent : j\'aimerais savoir lequel m\'attend demain. »',
      ],
      apportes: [
        'une intensité qui revient',
        'des retrouvailles vivantes',
        'du profond quand ça compte',
        'une honnêteté en mouvement',
        'un cœur qui se raconte',
      ],
      apprendre: [
        'prévenir ton éloignement avant de l\'agir',
        'rester un instant de plus quand ça pousse à partir',
        'raconter tes deux vitesses à l\'autre',
        'distinguer l\'envie d\'air de la peur du lien',
      ],
      question:
        'Et si ton envie de partir n\'était pas une sortie, mais une demande d\'air — qu\'est-ce qui changerait si tu la formulais avant de la suivre ?',
      langage: {
        donnes: 'intensité + sincérité + vivacité',
        recherches: 'patience + sécurité + régularité',
        surveilles: 'allers-retours + précipitation + non-dits',
        apprecierais:
          'une personne stable et douce, qui ne panique ni à ton arrivée ni à ta pause — et qui sait que ton retour est fidèle.',
      },
    },
    V5: {
      // L'Équilibre en mouvement — s'ajuster à la personne ; ombre : choisir peu à voix haute.
      preuves: [
        'Ta façon d\'aimer s\'ajuste à la personne en face : tu sais être proche quand c\'est son besoin, discret(e) quand c\'est son air — sans manuel.',
        'La distance ne t\'effraie pas, la proximité ne t\'étouffe pas : tu traverses les deux mouvements sans drame.',
        'Les changements de rythme de l\'autre ne te déstabilisent pas : tu lis le mouvement et tu trouves ta place dedans.',
        'Au fil des semaines, tu peux découvrir que la relation suit les envies de l\'autre plus que les tiennes — tes besoins attendent une occasion qui ne vient pas toujours.',
        'Ta souplesse fait que tu choisis peu à voix haute : le restau, le week-end, le film — jusqu\'au jour où tu ne sais plus ce que tu aurais voulu.',
      ],
      besoins: [
        'd\'un partenaire qui te demande ton envie — vraiment, et qui attend la réponse.',
        'de choisir à voix haute, même des choses petites : garder ta place dans les décisions.',
        'd\'un lien qui accueille tes propres mouvements, pas seulement ceux des autres.',
      ],
      ressenti: [
        '« Avec toi, c\'est facile : tu comprends vite, tu t\'ajustes, on se sent bien ensemble. »',
        '« C\'est si fluide que je ne sais pas toujours ce que toi tu veux — j\'aimerais que tu me le dises plus souvent. »',
      ],
      apportes: [
        'une souplesse rare',
        'une lecture fine de l\'autre',
        'une adaptation sans drame',
        'une présence ajustée',
        'du confort dans le lien',
      ],
      apprendre: [
        'poser ton envie avant de t\'ajuster',
        'choisir à voix haute chaque semaine',
        'dire ce que tu veux même quand tout va bien',
        'repérer tes moments d\'effacement',
      ],
      question:
        'Et si tu t\'adaptais si bien que personne ne devinait ce que tu veux — saurais-tu, aujourd\'hui, nommer trois envies que tu as pour ta relation ?',
      langage: {
        donnes: 'souplesse + écoute + équilibre',
        recherches: 'échange + initiatives partagées + authenticité',
        surveilles: 'effacement + non-dits + habitude',
        apprecierais:
          'une personne qui prend des initiatives et te consulte pour de vrai — qui remarque que tu t\'adaptes et se demande ce que toi tu choisis.',
      },
    },
  },
  leviers: {
    // A — « Ton besoin de réassurance » (score haut = besoin de preuves fréquentes et tôt).
    A: {
      force:
        'Quand quelqu\'un compte pour toi, ton cœur surveille : tu repères tôt ce qui bouge dans le lien — tu n\'es jamais détaché(e) des personnes que tu aimes.',
      risque:
        'Quand ce besoin déborde, le doute travaille seul : tu décodes les silences, tu vérifies les signes — l\'inquiétude prend plus de place que la relation elle-même.',
      levier:
        'Demande clairement, au bon moment, ce qui t\'apaiserait : une question dite à voix haute remplace des heures de décodage.',
    },
    // E — « Ton besoin d'espace » (score haut = beaucoup d'air dans la proximité).
    E: {
      force:
        'Ton air garde ton lien vivant : tu reviens à l\'autre parce que tu as été toi, et ta présence n\'a jamais été une obligation.',
      risque:
        'Quand ce besoin déborde, tu t\'éloignes sans prévenir — l\'autre vit tes pauses comme des départs, et ton besoin comme une fuite.',
      levier:
        'Annonce le mouvement avant de le faire : « je prends l\'air, je reviens » — la porte reste ouverte pendant que tu respires.',
    },
  },
};

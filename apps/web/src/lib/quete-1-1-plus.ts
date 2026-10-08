/**
 * Couche « plus » de la quête 1.1 — Ta personnalité (7 cartes V1-V7,
 * 5 dimensions O/C/E/A/S). Task 32 — demande fondateur (critique du PDF).
 * Types : ./quetes-plus. Rédaction app : jamais d'étiquette, jamais de
 * diagnostic, tutoiement, phrases courtes et concrètes.
 *
 * Ancrage OBLIGATOIRE (cohérence avec l'existant — règle 11-b) :
 *  - nom + lumiere + ombre + tension de chaque carte : quete-1-1.ts (verbatim) ;
 *  - ombreRelationnel (V1-V7) + accompagnement (fort/equilibre/doux par dim) :
 *    quetes.ts — ces textes ne doivent PAS être contredits ici, seulement
 *    prolongés (preuves comportementales, ressenti de l'autre, besoins,
 *    leviers d'action, langage relationnel pour le matching).
 *
 * Les leviers de dimension sont rédigés pour la BARRE ENTIÈRE (pleine ou
 * légère) : la force nomme la tendance saine, le risque nomme le débordement
 * dans les deux directions, le levier donne un geste concret pour chacune.
 */
import type { CouchePlus } from './quetes-plus';

export const PLUS_1_1: CouchePlus = {
  cartes: {
    // V1 — L'Explorateur·rice chaleureux·se : l'élan qui emmène, et ce qui attend derrière.
    V1: {
      preuves: [
        'Une nouvelle cuisine, un lieu inconnu, un plan improvisé : tu dis oui avant de te poser cent questions.',
        'Tu reviens rarement d\'une sortie sans une adresse, une idée ou une histoire à partager.',
        'Tu ouvres la marche sans forcer, et les autres suivent parce qu\'ils s\'y sentent attendus.',
        'Une semaine qui se répète peut te donner envie de changer quelque chose — parfois juste pour sentir que ça bouge.',
        'Il t\'arrive de laisser une chose en route quand la suivante s\'annonce plus excitante.',
      ],
      besoins: [
        'Une personne qui suit ton élan quand elle en a envie — et qui peut te dire non sans craindre de te perdre.',
        'Quelqu\'un qui te fait découvrir à son tour : ton élan a besoin d\'être nourri, pas seulement suivi.',
        'Une relation où ce que tu commences à deux peut continuer à deux — même quand ta curiosité est déjà partie devant.',
      ],
      ressenti: [
        '« Depuis que je te connais, je goûte des choses que je n\'aurais jamais osées sans toi. »',
        '« J\'aimerais savoir si ce qu\'on a commencé compte encore pour toi — ou si tu es déjà ailleurs. »',
      ],
      apportes: [
        'ouverture',
        'audace',
        'envie de partager',
        'capacité à entraîner les autres',
        'regard neuf',
      ],
      apprendre: [
        'distinguer l\'envie de la fuite',
        'revenir vers ce qui compte',
        'finir ce que tu commences à deux',
        'apprivoiser la répétition',
      ],
      question:
        'Et si l\'ennui que tu fuis était une porte plutôt qu\'un vide… qu\'as-tu peur d\'y trouver ?',
      langage: {
        donnes: 'ouverture + élan + partage',
        recherches: 'découverte + mouvement + complicité',
        surveilles: 'promesses + fins + retour',
        apprecierais:
          'une personne qui a ses propres envies d\'ailleurs, et qui sait te demander avec le sourire où on en est',
      },
    },

    // V2 — Le·La Bâtisseur·se : la fiabilité qui tient debout, et son coût invisible.
    V2: {
      preuves: [
        'Ce que tu promets se produit — même les petites promesses, même sans témoin.',
        'Tu prépares tes journées, au moins vaguement — et tu sens la différence les jours où tu ne le fais pas.',
        'Tu finis ce que tu commences, même quand l\'envie est passée depuis longtemps.',
        'Quand quelque chose dérape, ta première réaction est de chercher ce que toi tu aurais pu mieux faire.',
        'Tu as tendance à surveiller comment les autres font — surtout quand ils ne font pas comme toi.',
      ],
      besoins: [
        'Une personne qui nomme ce que tu tiens debout : la fiabilité se voit, mais elle aime être reconnue.',
        'Quelqu\'un qui te rappelle qu\'un imprévu n\'est pas une faute — et que rien de vrai ne s\'écroule en une journée.',
        'Une relation où l\'autre fait les choses à SA façon sans que tu aies à corriger — et où ça ne menace rien.',
      ],
      ressenti: [
        '« Avec toi, ce qui est dit est fait — ça me repose de ne pas avoir à vérifier. »',
        '« J\'aimerais parfois faire à ma façon, sans sentir que je passe un examen. »',
      ],
      apportes: [
        'fiabilité',
        'constance',
        'loyauté',
        'sens du concret',
        'capacité à finir',
      ],
      apprendre: [
        'déléguer sans corriger derrière',
        'accueillir l\'imprévu',
        'laisser la note tomber',
        't\'accuser moins vite',
      ],
      question:
        'Et si, une journée entière, tu ne rattrapais rien, tu ne corrigeais rien… qu\'est-ce que tu craindrais qu\'il arrive ?',
      langage: {
        donnes: 'fiabilité + constance + loyauté',
        recherches: 'sérieux + clarté + réciprocité',
        surveilles: 'contrôle + exigence + culpabilité',
        apprecierais:
          'une personne fiable à SA façon, qui te rappelle que l\'imprévu fait aussi partie de la vie',
      },
    },

    // V3 — L'Étoile sociale : la lumière qui anime, et le silence qui attend.
    V3: {
      preuves: [
        'Tu prends facilement l\'initiative d\'une conversation.',
        'Tu es souvent celui/celle qui met les gens en relation.',
        'Tu peux avoir besoin de stimulation pour te sentir pleinement vivant(e).',
        'Une soirée trop calme peut rapidement perdre de son intérêt.',
        'Tu as tendance à raconter ce que tu viens de découvrir.',
      ],
      besoins: [
        'Une personne qui apprécie ton énergie sans avoir besoin de la subir en permanence.',
        'Quelqu\'un qui sait entrer dans ton univers mais qui peut aussi te rappeler que le calme est une forme de connexion.',
        'Une relation dans laquelle tu peux être spontané(e), curieux(se) et vivant(e), sans devoir constamment être celui/celle qui anime.',
      ],
      ressenti: [
        '« Avec toi, il se passe toujours quelque chose. »',
        '« J\'aimerais parfois avoir le temps de parler sans devoir suivre ton rythme. »',
      ],
      apportes: [
        'spontanéité',
        'curiosité',
        'énergie',
        'humour',
        'capacité à créer du lien',
      ],
      apprendre: [
        'écouter sans remplir',
        'ralentir',
        'accueillir le silence',
        'laisser l\'autre mener parfois',
      ],
      question:
        'Et si tu n\'avais rien à raconter, rien à animer, rien à apporter… te sentirais-tu toujours suffisamment intéressant(e) pour être aimé(e) ?',
      langage: {
        donnes: 'énergie + curiosité + spontanéité',
        recherches: 'échange + stimulation + ouverture',
        surveilles: 'rythme + écoute + silence',
        apprecierais:
          'une personne qui apprécie ton énergie mais possède aussi sa propre stabilité',
      },
    },

    // V4 — L'Ancre : le calme qui porte les autres, et toi qui passes en dernier.
    V4: {
      preuves: [
        'Les gens respirent mieux autour de toi — ils ne savent pas toujours pourquoi.',
        'C\'est toi qu\'on appelle quand ça va mal — et tu réponds disponible, sans drame.',
        'Un imprévu te déstabilise peu : le calme revient vite chez toi.',
        'Tu restes parfois longtemps dans des situations qui n\'en méritent plus — parce que tu sais rester.',
        'Ton tour passe souvent en dernier — et tu appelles ça de la stabilité.',
      ],
      besoins: [
        'Une personne qui te demande comment TU vas — et qui attend vraiment la réponse.',
        'Quelqu\'un qui voit ce que ton calme coûte parfois — et qui te rappelle que tu as le droit de bouger, toi aussi.',
        'Une relation où rester reste un choix renouvelé — pas une habitude devenue demeure.',
      ],
      ressenti: [
        '« Avec toi, le monde ralentit — et ça fait du bien. »',
        '« J\'aimerais prendre soin de toi aussi, mais je ne sais jamais où frapper. »',
      ],
      apportes: [
        'calme',
        'présence',
        'écoute',
        'patience',
        'refuge',
      ],
      apprendre: [
        'te compter dans tes propres priorités',
        'poser des limites doucement mais tôt',
        'sortir de ta forteresse de temps en temps',
        'lâcher ce qui n\'en mérite plus',
      ],
      question:
        'Si tu t\'écoutais comme tu écoutes les autres… que te dirais-tu — et depuis combien de temps ça attend ?',
      langage: {
        donnes: 'calme + présence + sécurité',
        recherches: 'profondeur + sincérité + attention',
        surveilles: 'patience + limites + place pour toi',
        apprecierais:
          'une personne qui voit ce que tu portes, et qui t\'offre un endroit où le poser',
      },
    },

    // V5 — L'Intense : le volume maximum, et la vague qui passe sur l'autre.
    V5: {
      preuves: [
        'Une bonne nouvelle t\'occupe tout entier : la joie te monte au corps.',
        'Tu te souviens de détails que les autres ont oubliés le soir même — parce que ça comptait trop.',
        'Quand tu t\'attaches, tu t\'attaches entièrement : tu ne sais pas faire à moitié.',
        'Une remarque banale peut t\'habiter des heures — tu ne l\'as pas choisie.',
        'Quand ça monte en toi, tu traverses la tempête sans mode d\'emploi — et souvent sans prévenir.',
      ],
      besoins: [
        'Une personne qui ne te demande pas de ressentir moins — mais qui tient bon quand ça bouge.',
        'Quelqu\'un qui sait que ta tempête passe — et qui ne prend pas chaque vague pour une fin du monde.',
        'Une relation où ton intensité est reçue comme une profondeur, pas comme un excès à corriger.',
      ],
      ressenti: [
        '« Avec toi, tout se vit plus fort — et ça me réveille. »',
        '« J\'aimerais savoir quand la vague passe — parce que moi, je ne la vois pas finir. »',
      ],
      apportes: [
        'profondeur',
        'passion',
        'empathie',
        'fidélité du cœur',
        'vrai',
      ],
      apprendre: [
        'prévenir tôt quand ça monte',
        'choisir où mettre ton intensité',
        'te ménager de vraies descentes',
        'faire confiance au calme quand il vient',
      ],
      question:
        'Si tu cessais de te demander si tu es « trop »… pour qui, exactement, serais-tu juste assez ?',
      langage: {
        donnes: 'intensité + empathie + vérité',
        recherches: 'accueil + vérité + stabilité',
        surveilles: 'montées + avertissements + retombées',
        apprecierais:
          'une personne qui ne s\'effraie pas de ta profondeur, et qui sait dire les siennes aussi fort',
      },
    },

    // V6 — L'Indépendant·e profond·e : le monde intérieur, et la porte qu'on ose à peine frapper.
    V6: {
      preuves: [
        'Une conversation à deux qui part en profondeur vaut pour toi cent grandes tables.',
        'Tu as des projets de fond que personne ne connaît encore — ils avancent en silence, et ça te suffit.',
        'Tu peux penser un même sujet pendant des jours : les idées longues te nourrissent.',
        'Il t\'arrive de trouver quelqu\'un d\'intéressant… et de ne rien dire, en te disant que ce n\'est pas le moment.',
        'On peut te croire distant(e) alors que, dedans, tout est vivant.',
      ],
      besoins: [
        'Une personne qui lit juste ton silence : chez toi, peu de mots ne veut pas dire peu d\'intérêt.',
        'Quelqu\'un qui frappe sans se vexer quand tu ouvres lentement — et qui remarque que tu ouvres.',
        'Une relation où tu peux retourner dans ton monde sans culpabiliser — et d\'où tu ressors avec envie de raconter.',
      ],
      ressenti: [
        '« Quand tu partages ton monde, on se sent choisi(e). »',
        '« J\'aimerais parfois savoir si tu penses à moi quand tu es loin — ton silence me laisse deviner. »',
      ],
      apportes: [
        'monde intérieur',
        'idées de fond',
        'conversation qui dure',
        'feu tranquille',
        'écoute rare',
      ],
      apprendre: [
        'oser le premier contact',
        'partager ton monde en premier, même maladroitement',
        'ouvrir par petites portes',
        'agir avant d\'avoir fini de réfléchir',
      ],
      question:
        'Et si tu comptais les fois où tu as attendu le bon moment pour te montrer… qu\'est-ce que ce « bon moment » t\'a coûté jusqu\'ici ?',
      langage: {
        donnes: 'profondeur + écoute + fidélité',
        recherches: 'intimité + patience + confiance',
        surveilles: 'isolement + premiers pas + non-dits',
        apprecierais:
          'une personne qui respecte ton monde et ose quand même frapper — sans prendre ton rythme pour un refus',
      },
    },

    // V7 — L'Équilibriste : toutes les facettes, et le centre qu'on cherche encore.
    V7: {
      preuves: [
        'Selon les jours, on te décrit différemment — aventureux(se), solide, animé(e), posé(e) — et personne ne ment.',
        'Tu t\'adaptes à beaucoup de gens sans te sentir déguisé(e) : c\'est ta vraie gamme.',
        'On te dit difficile à cerner et facile à aimer — souvent dans la même phrase.',
        'Ton profil bouge lentement : il t\'arrive de tenir une position qui n\'est plus tout à fait la tienne.',
        'Quand on te demande ce que toi tu veux, la vraie réponse arrive parfois en deuxième.',
      ],
      besoins: [
        'Une personne qui ne cherche pas à te résumer : ton profil large est une force, pas un flou à corriger.',
        'Quelqu\'un qui te demande ton avis même quand tu sembles d\'accord avec tout — et qui attend la vraie réponse.',
        'Une relation où tes désirs ont autant de place que tes adaptations.',
      ],
      ressenti: [
        '« Avec toi, je peux être moi sans me justifier. »',
        '« J\'aimerais savoir ce que toi tu veux — même si c\'est différent de ce que je veux. »',
      ],
      apportes: [
        'souplesse',
        'polyvalence',
        'lien facile',
        'cœur large',
        'équilibre',
      ],
      apprendre: [
        'prendre position à voix haute',
        'distinguer ton envie de ton adaptation',
        'oser décevoir de temps en temps',
        'revenir à ton centre avant de répondre',
      ],
      question:
        'Et si toutes tes facettes votaient à tour de rôle… laquelle prend la parole le plus souvent à ta place ?',
      langage: {
        donnes: 'adaptabilité + équilibre + ouverture',
        recherches: 'authenticité + repères + simplicité',
        surveilles: 'dispersion + centre + choix',
        apprecierais:
          'une personne qui a son propre centre, assez solide pour ne pas profiter de ta souplesse',
      },
    },
  },

  leviers: {
    // O — le nouveau t'appelle (idées, lieux, gens qui pensent autrement).
    O: {
      force:
        'Ta place face au nouveau est claire : tu sais ce que le changement t\'apporte — et ce qu\'il te coûte.',
      risque:
        'Trop de neuf déplace ce qui compte ; trop peu, et la routine endort ce qui vivait.',
      levier:
        'Donne une vraie place au nouveau ET au repère stable, chacun à ton rythme — choisis les deux au lieu de les subir.',
    },
    // C — ce que tu promets, ce que tu finis.
    C: {
      force:
        'Ton organisation, souple ou serrée, garde tes promesses en vie — et les gens s\'en aperçoivent.',
      risque:
        'Trop de contrôle, et l\'imprévu devient une faute ; trop peu, et tout arrive en même temps sans colonne vertébrale.',
      levier:
        'Laisse une fois l\'imprévu choisir sans rattraper derrière — et garde dix minutes par semaine pour ce qui compte vraiment.',
    },
    // E — d'où vient ton énergie : la foule ou le calme.
    E: {
      force:
        'Tu sais d\'où vient ton énergie — la foule ou le calme — et tu peux la protéger au lieu de la subir.',
      risque:
        'Trop de monde te brûle sans prévenir ; trop de silence, et le lien rouille doucement.',
      levier:
        'Repère ce dont tu as besoin après une longue journée de monde — et de temps en temps, fais le premier pas que tu attendais des autres.',
    },
    // A — comment tu donnes : confiance rapide ou prudence attentive.
    A: {
      force:
        'Ta confiance a un vrai mode d\'emploi : tu sais quand la donner — et tu sais ce qui te la fait attendre.',
      risque:
        'Une confiance trop rapide s\'expose ; une prudence trop longue empêche une vraie proximité.',
      levier:
        'Donne de petites occasions de confiance plutôt que d\'attendre une certitude — et ose un non clair de temps en temps.',
    },
    // S — comment tu traverses les vagues.
    S: {
      force:
        'Tu connais ton retour au calme — ce qui t\'apaise, et combien de temps ça prend.',
      risque:
        'Une armure trop épaisse empêche d\'accueillir ce qui remue ; une vague trop longue emporte ce qui compte.',
      levier:
        'Donne une fois la parole à ce qui remue en toi sans vouloir le régler — et entraîne ton retour au calme avant d\'en avoir besoin.',
    },
  },
};

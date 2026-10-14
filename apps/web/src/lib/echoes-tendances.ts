/**
 * LES ÉCHOS DES RÉPONSES — les cartes de tendances citent ce que la personne
 * a VRAIMENT répondu (Task 78 — le fondateur a préféré la suggestion qui
 * corrige la page : « Les textes des cartes s'appuient maintenant sur les
 * réponses que la personne a vraiment données. Chaque carte garde le même
 * ordre : ce que tu as répondu, ce que ça dit, un petit pas. »).
 *
 * LE PROBLÈME CORRIGÉ : le texte de palier est statique — la carte « Ton
 * organisation » disait « tu structures l'essentiel » à quelqu'un qui venait
 * de répondre qu'il laisse traîner jusqu'à la dernière minute. Désormais la
 * carte ASSEMBLE : 1-2 échos des réponses les plus tranchées (ce que tu as
 * répondu) → le pont ou la lecture (ce que ça dit) → le Petit pas du palier.
 *
 * PRINCIPE : pour chaque item Likert, DEUX clauses à la 2ᵉ personne — une par
 * pôle DE DIMENSION (haut = pousse la barre vers le haut, bas = vers le bas).
 * Le pôle suit la mécanique réelle : un item inversé répondu « pas du tout
 * moi » produit un écho « haut » (c'est sa contribution qui compte). Les
 * clauses sont en minuscule initiale, sans point final : elles se joignent
 * («, et … », «, mais … ») ou se dressent seules (« Tu …. »).
 *
 * LES CAS DE LA CARTE (moule de la maquette validée) :
 *  - MIXTE (une réponse pousse en haut, une autre en bas) : écho haut + «
 *    Mais/Et » + écho bas + le PONT de la dimension + Petit pas. Le pont
 *    nomme les deux facettes ensemble — c'est le cas « réponses
 *    contradictoires » du modèle (« Ta bienveillance : généreux et franc »).
 *  - HAUT SEUL : les 2 échos les plus tranchés joints par «, et » + la
 *    LECTURE de la dimension (optionnelle — l'ouverture n'en a pas, la
 *    maquette du fondateur non plus) + Petit pas.
 *  - BAS SEUL : idemm avec la LECTURE DOUCE + Petit pas.
 *  - NEUTRE (rien au-delà du milieu) : null → la page garde le texte de
 *    palier (inchangé).
 *
 * PÉRIMÈTRE : les quêtes enregistrées (1.1, 1.2 — les quêtes à la nouvelle
 * voix). Les autres renvoient null partout (aucun changement de rendu).
 * AUCUN item/scorer/sélecteur modifié : ce module LIT seulement (même
 * discipline que ancrage-likert.ts / sources-sections.ts).
 */

import { getLang } from '../i18n/current';
import { itemsAncrageDe, type ItemAncrage } from './ancrage-likert';
import { axesDeChamp } from './sources-sections';

/** Une clause d'écho, minuscule initiale, sans point final. */
interface Echo {
  haut: string;
  bas: string;
}

/** Le registre d'échos d'une quête : par code d'item, la clause de chaque
 *  pôle ; par dimension, le pont (cas mixte), le connecteur du revers
 *  (opposé = « Mais », apprécié = « Et » — la bienveillance où les deux
 *  facettes se valent), la lecture (tout en haut) et la lecture douce (tout
 *  en bas). */
interface QueteEcho {
  items: Record<string, Echo>;
  dims: Record<
    string,
    {
      pont: string;
      connecteurRevers?: 'oppose' | 'apprecie';
      lecture?: string;
      lectureDoux?: string;
    }
  >;
}

/** Contribution d'une réponse (recodage D/I, 0-1) — même formule que
 *  ancrage-likert (recopiée minimale pour rester sans cycle). */
function contribution(reponse: number, orient: 'D' | 'I'): number {
  return ((orient === 'D' ? reponse : 6 - reponse) - 1) / 4;
}

function majuscule(clause: string): string {
  return clause.charAt(0).toUpperCase() + clause.slice(1);
}

/** Une écho sélectionné : clause + force de tranchement (pour trier). */
interface EchoChoisi {
  code: string;
  clause: string;
  info: number;
}

/** Les échos polaires d'une dimension, triés du plus tranché au moins tranché. */
function pairesDe(
  items: readonly ItemAncrage[],
  reponses: Record<string, number>,
  dimKey: string,
  registre: Record<string, Echo>,
): { hauts: EchoChoisi[]; bas: EchoChoisi[] } {
  const hauts: EchoChoisi[] = [];
  const bas: EchoChoisi[] = [];
  for (const it of items) {
    if (it.dim !== dimKey) continue;
    const echo = registre[it.code];
    if (!echo) continue;
    const r = reponses[it.code];
    if (typeof r !== 'number' || r < 1 || r > 5) continue;
    const c = contribution(r, it.orient);
    if (c >= 0.75) hauts.push({ code: it.code, clause: echo.haut, info: Math.abs(c - 0.5) });
    else if (c <= 0.25) bas.push({ code: it.code, clause: echo.bas, info: Math.abs(c - 0.5) });
  }
  hauts.sort((a, b) => b.info - a.info);
  bas.sort((a, b) => b.info - a.info);
  return { hauts, bas };
}

/** Les registres, par quête. FR et EN côte à côte — self-contained (aucun
 *  cycle : ce module ne connaît pas quetes.ts). */
const REGISTRES: Record<string, QueteEcho> = {
  // ------------------------------------------------------------- 1.1 — 50 items
  '1.1': {
    items: {
      'Q1.1-01': {
        haut: "tu aimes les conversations qui partent dans des idées inattendues",
        bas: "tu préfères les conversations qui restent sur ce qui est connu",
      },
      'Q1.1-02': {
        haut: "tu dis oui au nouveau avant même de te poser de questions",
        bas: "tu aimes prendre le temps de réfléchir avant de dire oui à quelque chose de nouveau",
      },
      'Q1.1-03': {
        haut: "tu aimes les gens qui pensent autrement que toi",
        bas: "tu préfères les gens qui pensent comme toi",
      },
      'Q1.1-04': {
        haut: "l'art, la musique ou les livres changent ta façon de voir les choses",
        bas: "ta façon de voir les choses ne dépend pas beaucoup des œuvres que tu croises",
      },
      'Q1.1-05': {
        haut: "tu t'ennuies vite dans les routines trop calées",
        bas: "les routines te vont bien : elles tiennent la journée sans te peser",
      },
      'Q1.1-06': {
        haut: "les idées abstraites ne t'agacent pas — tu sais t'y arrêter",
        bas: "tu préfères ce qui est concret et utile aux idées abstraites",
      },
      'Q1.1-07': {
        haut: "tu aimes imaginer des versions alternatives de ta vie",
        bas: "tu ne passes pas beaucoup de temps à imaginer des vies alternatives",
      },
      'Q1.1-08': {
        haut: "découvrir quelque chose de nouveau te plaît plus que revoir ce que tu connais",
        bas: "revoir ce que tu as aimé te plaît plus que découvrir du nouveau",
      },
      'Q1.1-09': {
        haut: "tu t'intéresses à des sujets que personne autour de toi ne connaît",
        bas: "tes centres d'intérêt restent proches de ceux de ton entourage",
      },
      'Q1.1-10': {
        haut: "pour toi, une idée un peu folle vaut la peine qu'on s'y arrête",
        bas: "une idée trop folle ne mérite pas qu'on s'y arrête longtemps",
      },
      'Q1.1-11': {
        haut: "tu tiens tes promesses, même les petites",
        bas: "il t'arrive de ne pas tenir ce que tu promettais",
      },
      'Q1.1-12': {
        haut: "tu ne laisses pas traîner jusqu'à la dernière minute",
        bas: "tu laisses souvent traîner jusqu'à la dernière minute",
      },
      'Q1.1-13': {
        haut: "tes affaires ont leur place, et tu aimes ça",
        bas: "tes affaires n'ont pas vraiment de place attitrée — et ça te va",
      },
      'Q1.1-14': {
        haut: "tu oublies rarement ce que tu avais prévu",
        bas: "tu oublies régulièrement des choses que tu avais prévues",
      },
      'Q1.1-15': {
        haut: "avant de t'engager, tu vérifies que tu as le temps de bien faire",
        bas: "tu t'engages d'abord, et tu vois ensuite pour le temps",
      },
      'Q1.1-16': {
        haut: "ton espace ressemble à ton organisation",
        bas: "ton espace raconte autre chose que ton organisation",
      },
      'Q1.1-17': {
        haut: "tu termines ce que tu commences, même quand l'envie est passée",
        bas: "il t'arrive d'abandonner en route, une fois l'envie passée",
      },
      'Q1.1-18': {
        haut: "les détails administratifs ne te passent pas à travers",
        bas: "les détails administratifs t'échappent",
      },
      'Q1.1-19': {
        haut: "tu prépares tes journées, au moins vaguement",
        bas: "tu prépares rarement tes journées à l'avance",
      },
      'Q1.1-20': {
        haut: "l'ordre te fait mieux fonctionner que le désordre",
        bas: "tu fonctionnes mieux dans le désordre assumé",
      },
      'Q1.1-21': {
        haut: "une journée entouré de gens te recharge",
        bas: "une journée entouré de gens te vide plus qu'elle ne te remplit",
      },
      'Q1.1-22': {
        haut: "une grande table te plaît plus qu'un tête-à-tête",
        bas: "une soirée en tête-à-tête vaut mieux qu'une grande table",
      },
      'Q1.1-23': {
        haut: "tu lances facilement la conversation avec des inconnus",
        bas: "avec des inconnus, tu attends que la conversation vienne à toi",
      },
      'Q1.1-24': {
        haut: "les événements où tu ne connais personne ne te font pas fuir",
        bas: "les événements où tu ne connais personne te donnent envie de partir tôt",
      },
      'Q1.1-25': {
        haut: "dans un groupe, tu prends la parole sans forcer",
        bas: "dans un groupe, tu parles quand tu as vraiment quelque chose à dire",
      },
      'Q1.1-26': {
        haut: "tu n'as pas besoin de longues plages de silence pour te retrouver",
        bas: "tu as besoin de longues plages de silence pour te retrouver",
      },
      'Q1.1-27': {
        haut: "l'ennui te vient quand il ne se passe rien autour de toi",
        bas: "quand il ne se passe rien, tu sais rester bien avec toi",
      },
      'Q1.1-28': {
        haut: "quand l'énergie du groupe monte, tu participes plutôt que d'observer",
        bas: "quand l'énergie monte, tu préfères observer que participer",
      },
      'Q1.1-29': {
        haut: "tu dis spontanément ce que tu penses devant un groupe",
        bas: "devant un groupe, tu gardes tes pensées pour toi",
      },
      'Q1.1-30': {
        haut: "trois jours sans voir personne, ce n'est pas ton paradis",
        bas: "trois jours sans voir personne, c'est ton paradis",
      },
      'Q1.1-31': {
        haut: "tu sais attendre avant de dire qu'on t'a contrarié, pour éviter du mal",
        bas: "quand quelqu'un t'a contrarié, tu le dis sans attendre",
      },
      'Q1.1-32': {
        haut: "tu ne crois pas que les gens soient égoïstes pour la plupart",
        bas: "tu trouves que beaucoup de gens sont assez égoïstes",
      },
      'Q1.1-33': {
        haut: "tu t'inquiètes sincèrement de comment vont les gens autour de toi",
        bas: "le bien-être des gens autour de toi ne t'occupe pas en premier",
      },
      'Q1.1-34': {
        haut: "tu ménages plutôt que de dire clairement quand quelqu'un a tort",
        bas: "quand quelqu'un a tort, tu le dis clairement plutôt que de le ménager",
      },
      'Q1.1-35': {
        haut: "tu fais volontiers des choses pour les autres, sans rien attendre",
        bas: "tu donnes volontiers, quand tu y trouves aussi ton compte",
      },
      'Q1.1-36': {
        haut: "la politesse ne te paraît pas hypocrite",
        bas: "la politesse excessive te paraît souvent hypocrite",
      },
      'Q1.1-37': {
        haut: "tu fais confiance d'abord, tu vérifies ensuite",
        bas: "tu vérifies d'abord, tu fais confiance ensuite",
      },
      'Q1.1-38': {
        haut: "tu ne gardes pas tes distances pour éviter les déceptions",
        bas: "tu gardes tes distances : ça évite les déceptions",
      },
      'Q1.1-39': {
        haut: "les gens te décrivent comme quelqu'un de facile à vivre",
        bas: "on ne te décrit pas exactement comme facile à vivre",
      },
      'Q1.1-40': {
        haut: "tu n'as pas besoin de passer par la dureté, même quand il faudrait",
        bas: "tu peux être dur quand il faut — et tu trouves ça souvent utile",
      },
      'Q1.1-41': {
        haut: "un imprévu de dernière minute ne te déstabilise pas longtemps",
        bas: "un imprévu de dernière minute te déstabilise",
      },
      'Q1.1-42': {
        haut: "tu ne repasses pas les choses dites ou faites en boucle",
        bas: "tu repasses souvent dans ta tête des choses dites ou faites",
      },
      'Q1.1-43': {
        haut: "les périodes d'attente ne te rongent pas",
        bas: "les périodes d'attente te rongent",
      },
      'Q1.1-44': {
        haut: "tu dors assez bien même quand tout ne va pas",
        bas: "quand tout ne va pas, ton sommeil en paie le prix",
      },
      'Q1.1-45': {
        haut: "ton humeur tient assez stable dans une même journée",
        bas: "ton humeur varie fortement dans une même journée",
      },
      'Q1.1-46': {
        haut: "tu ne te fais pas plus de scénarios qui tournent mal qu'il n'en faut",
        bas: "tu te fais des scénarios qui tournent mal plus souvent que nécessaire",
      },
      'Q1.1-47': {
        haut: "face à une dispute, tu retrouves ton calme assez vite",
        bas: "après une dispute, ton calme revient lentement",
      },
      'Q1.1-48': {
        haut: "une remarque bête n'occupe pas ton esprit des heures",
        bas: "une remarque bête peut t'occuper l'esprit des heures",
      },
      'Q1.1-49': {
        haut: "tu te sens globalement bien dans ta tête",
        bas: "globalement, tu ne te sens pas tout à fait bien dans ta tête",
      },
      'Q1.1-50': {
        haut: "ton cœur ne s'accélère pas sans raison",
        bas: "tu sens souvent ton cœur s'accélérer sans raison claire",
      },
    },
    dims: {
      // O — l'ouverture : les échos parlent seuls (la maquette du fondateur
      // n'ajoute aucune lecture sur la carte « Ton ouverture »).
      O: {
        pont:
          "Tu aimes le nouveau, sans courir après lui : tu explores quand ça vaut la peine, et tu restes quand ça compte.",
        lectureDoux: "Tu aimes ce qui dure — ce n'est pas de la fermeture : c'est de la constance.",
      },
      C: {
        pont: "Les deux vont ensemble : tu es fiable, surtout quand l'échéance approche.",
        lecture: 'Les gens peuvent compter sur toi.',
        lectureDoux: "Tu improvises : ça marche, jusqu'au jour où tout arrive en même temps.",
      },
      E: {
        pont: "Tu as deux moteurs : le monde te recharge, et le silence te répare.",
        lecture: "Les autres te donnent de l'énergie.",
        lectureDoux: "Le calme te reconstruit : peu de gens, mais des vrais.",
      },
      // A — la bienveillance : les deux facettes (générosité / franchise) sont
      // rangées ENSEMBLE — le cas « réponses contradictoires » de la maquette.
      A: {
        pont: "C'est une vraie qualité : généreux et franc.",
        connecteurRevers: 'apprecie',
        lecture: "Pour toi, la relation passe avant le fait d'avoir raison.",
        lectureDoux: "La confiance se mérite chez toi — et tu as de bonnes raisons de l'avoir apprise.",
      },
      S: {
        pont: "Tu as des jours calmes et des jours de tempête — c'est humain, et c'est ton rythme.",
        lecture: "Quand les vagues arrivent, tu restes debout, et les autres s'appuient sur toi.",
        lectureDoux: "Tu ressens fort et longtemps — une antenne fine, pas une faiblesse.",
      },
    },
  },

  // ------------------------------------------------------------- 1.2 — 12 items
  '1.2': {
    items: {
      'Q1.2-01': {
        haut: "quand quelqu'un compte pour toi, son silence te pèse vite",
        bas: "le silence de quelqu'un qui compte ne te pèse pas d'entrée",
      },
      'Q1.2-02': {
        haut: "tu as souvent besoin qu'on confirme que tout va bien entre vous",
        bas: "tu n'as pas souvent besoin qu'on confirme que tout va bien",
      },
      'Q1.2-03': {
        haut: "une remarque un peu froide peut t'occuper toute la soirée",
        bas: "une remarque un peu froide te traverse sans rester",
      },
      'Q1.2-04': {
        haut: "tu anticipes parfois qu'on te quitte avant même que quelque chose arrive",
        bas: "tu n'anticipes pas la sortie avant qu'elle arrive",
      },
      'Q1.2-05': {
        haut: "tu te sens mieux quand tu sais clairement où tu en es avec quelqu'un",
        bas: "tu peux avancer sans savoir exactement où vous en êtes",
      },
      'Q1.2-06': {
        haut: "des relations où chacun garde son indépendance, ce n'est pas ce qui te convient",
        bas: "les relations où chacun garde son indépendance te conviennent parfaitement",
      },
      'Q1.2-07': {
        haut: "quand une relation devient profonde, tu as une envie instinctive de ralentir",
        bas: "quand une relation devient profonde, tu continues au même rythme",
      },
      'Q1.2-08': {
        haut: "dépendre de quelqu'un te fait peur",
        bas: "dépendre de quelqu'un ne te fait pas peur",
      },
      'Q1.2-09': {
        haut: "tu préfères gérer tes soucis seul, même avec un partenaire",
        bas: "avec un partenaire, tu partages tes soucis plutôt que de les gérer seul",
      },
      'Q1.2-10': {
        haut: "raconter tes faiblesses ne te soulage pas, même à quelqu'un qui compte",
        bas: "raconter tes faiblesses à quelqu'un qui compte te soulage",
      },
      'Q1.2-11': {
        haut: "la proximité constante te fatigue plus qu'elle ne te fait du bien",
        bas: "la proximité constante te fait du bien plus qu'elle ne te fatigue",
      },
      'Q1.2-12': {
        haut: "trop de proximité trop vite te donne envie de prendre de l'air",
        bas: "la proximité, même vite, ne te donne pas envie de prendre l'air",
      },
    },
    dims: {
      A: {
        pont: "Les preuves te rassurent, l'absence ne t'effondre pas.",
        lecture: "Ton cœur surveille le lien quand quelqu'un compte.",
        lectureDoux: "Ta tranquillité vient de toi : un message qui tarde ne raconte pas une fin de monde.",
      },
      E: {
        pont: "Tu sais être proche et prendre l'air, selon la personne et le moment.",
        lecture: "Ton monde intérieur a besoin de respirer.",
        lectureDoux: "La proximité te nourrit : passer du temps, tout partager, être ensemble sans détour.",
      },
    },
  },
};

/** Les miroirs EN des ponts et lectures (les clauses vivent en dessous). */
const DIMS_EN: Record<
  string,
  Record<string, { pont: string; lecture?: string; lectureDoux?: string }>
> = {
  '1.1': {
    O: {
      pont: "You love the new without chasing it: you explore when it's worth it, and you stay when it counts.",
      lectureDoux: "You love what lasts — it isn't closing off: it's constancy.",
    },
    C: {
      pont: 'The two go together: you are reliable, especially when the deadline nears.',
      lecture: 'People can count on you.',
      lectureDoux: "You improvise: it works, until the day everything arrives at once.",
    },
    E: {
      pont: 'You have two engines: the world recharges you, and silence repairs you.',
      lecture: 'Other people give you energy.',
      lectureDoux: 'Calm rebuilds you: few people, but real ones.',
    },
    A: {
      pont: 'It is a real quality: generous and frank.',
      lecture: 'For you, the relationship comes before being right.',
      lectureDoux: "Trust is earned with you — and you have good reasons to have learned that.",
    },
    S: {
      pont: "You have calm days and storm days — it's human, and it's your rhythm.",
      lecture: 'When the waves arrive, you stay standing, and others lean on you.',
      lectureDoux: 'You feel strongly and for long — a fine antenna, not a weakness.',
    },
  },
  '1.2': {
    A: {
      pont: "Reassurances soothe you, absence doesn't break you.",
      lecture: 'Your heart watches the bond when someone matters.',
      lectureDoux: "Your calm comes from you: a late message doesn't tell the end of the world.",
    },
    E: {
      pont: 'You know how to be close and take air, depending on the person and the moment.',
      lecture: 'Your inner world needs to breathe.',
      lectureDoux: 'Closeness feeds you: spending time, sharing everything, being together without detours.',
    },
  },
};

/** Les clauses EN, par quête — même structure que REGISTRES. */
const REGISTRES_EN: Record<string, Record<string, Echo>> = {
  '1.1': {
    'Q1.1-01': {
      haut: 'you love conversations that drift into unexpected ideas',
      bas: 'you prefer conversations that stay on what is known',
    },
    'Q1.1-02': {
      haut: 'you say yes to the new before even asking questions',
      bas: 'you like to take time to think before saying yes to something new',
    },
    'Q1.1-03': {
      haut: 'you like people who think differently than you',
      bas: 'you prefer people who think like you',
    },
    'Q1.1-04': {
      haut: 'art, music or books change the way you see things',
      bas: "the way you see things doesn't depend much on the works you come across",
    },
    'Q1.1-05': {
      haut: 'you get bored fast in tight routines',
      bas: 'routines suit you: they hold the day without weighing on you',
    },
    'Q1.1-06': {
      haut: "abstract ideas don't irritate you — you know how to stop on them",
      bas: 'you prefer what is concrete and useful over abstract ideas',
    },
    'Q1.1-07': {
      haut: 'you love imagining alternative versions of your life',
      bas: "you don't spend much time imagining alternative lives",
    },
    'Q1.1-08': {
      haut: 'discovering something new pleases you more than rewatching what you know',
      bas: 'rewatching what you loved pleases you more than discovering something new',
    },
    'Q1.1-09': {
      haut: 'you are interested in subjects nobody around you knows',
      bas: 'your interests stay close to the ones around you',
    },
    'Q1.1-10': {
      haut: "for you, a slightly crazy idea is worth stopping on",
      bas: "an idea too crazy isn't worth stopping on for long",
    },
    'Q1.1-11': {
      haut: 'you keep your promises, even the small ones',
      bas: 'it happens to you not to keep what you promised',
    },
    'Q1.1-12': {
      haut: "you don't leave things until the last minute",
      bas: 'you often leave things until the last minute',
    },
    'Q1.1-13': {
      haut: 'your things have their place, and you like it',
      bas: "your things don't really have a place of their own — and it suits you",
    },
    'Q1.1-14': {
      haut: 'you rarely forget what you had planned',
      bas: 'you regularly forget things you had planned',
    },
    'Q1.1-15': {
      haut: 'before committing, you check that you have the time to do it well',
      bas: 'you commit first, and figure out the time afterwards',
    },
    'Q1.1-16': {
      haut: 'your space looks like your organization',
      bas: 'your space tells another story than your organization',
    },
    'Q1.1-17': {
      haut: 'you finish what you start, even when the urge is gone',
      bas: 'it happens to you to drop things along the way, once the urge is gone',
    },
    'Q1.1-18': {
      haut: "administrative details don't slip past you",
      bas: 'administrative details escape you',
    },
    'Q1.1-19': {
      haut: 'you prepare your days, at least loosely',
      bas: 'you rarely plan your days in advance',
    },
    'Q1.1-20': {
      haut: 'order makes you work better than disorder',
      bas: 'you work better in assumed mess',
    },
    'Q1.1-21': {
      haut: 'a day surrounded by people recharges you',
      bas: 'a day surrounded by people empties you more than it fills you',
    },
    'Q1.1-22': {
      haut: 'a big table pleases you more than one-on-one',
      bas: 'an evening one-on-one is worth more than a big table',
    },
    'Q1.1-23': {
      haut: 'you easily start the conversation with strangers',
      bas: 'with strangers, you wait for the conversation to come to you',
    },
    'Q1.1-24': {
      haut: "events where you know nobody don't scare you away",
      bas: 'events where you know nobody make you want to leave early',
    },
    'Q1.1-25': {
      haut: 'in a group, you speak up without forcing',
      bas: 'in a group, you speak when you truly have something to say',
    },
    'Q1.1-26': {
      haut: "you don't need long stretches of silence to find yourself",
      bas: 'you need long stretches of silence to find yourself',
    },
    'Q1.1-27': {
      haut: 'boredom comes when nothing happens around you',
      bas: 'when nothing happens, you know how to stay well with yourself',
    },
    'Q1.1-28': {
      haut: "when the group's energy rises, you join in rather than watch",
      bas: 'when the energy rises, you prefer watching to joining',
    },
    'Q1.1-29': {
      haut: 'you say spontaneously what you think in front of a group',
      bas: 'in front of a group, you keep your thoughts to yourself',
    },
    'Q1.1-30': {
      haut: "three days without seeing anyone is not your paradise",
      bas: 'three days without seeing anyone: your paradise',
    },
    'Q1.1-31': {
      haut: 'you know how to wait before saying someone hurt you, to spare them',
      bas: 'when someone hurts you, you say it without waiting',
    },
    'Q1.1-32': {
      haut: "you don't believe most people are selfish",
      bas: 'you find that many people are quite selfish',
    },
    'Q1.1-33': {
      haut: 'you sincerely worry about how the people around you are doing',
      bas: "the well-being of the people around you isn't what occupies you first",
    },
    'Q1.1-34': {
      haut: 'you soften it rather than say it clearly when someone is wrong',
      bas: 'when someone is wrong, you say it clearly rather than soften it',
    },
    'Q1.1-35': {
      haut: 'you gladly do things for others without expecting anything back',
      bas: 'you give gladly when it also works for you',
    },
    'Q1.1-36': {
      haut: "politeness doesn't strike you as hypocritical",
      bas: 'excessive politeness often strikes you as hypocritical',
    },
    'Q1.1-37': {
      haut: 'you trust first, you check afterwards',
      bas: 'you check first, you trust afterwards',
    },
    'Q1.1-38': {
      haut: "you don't keep your distance to avoid disappointments",
      bas: 'you keep your distance: it avoids disappointments',
    },
    'Q1.1-39': {
      haut: 'people describe you as someone easy to live with',
      bas: "people wouldn't exactly describe you as easy-going",
    },
    'Q1.1-40': {
      haut: "you don't need to go through harshness, even when it would take it",
      bas: 'you can be tough when it takes it — and you find it often useful',
    },
    'Q1.1-41': {
      haut: "a last-minute surprise doesn't destabilize you for long",
      bas: 'a last-minute surprise destabilizes you',
    },
    'Q1.1-42': {
      haut: "you don't replay things said or done on a loop",
      bas: 'you often replay things said or done in your head',
    },
    'Q1.1-43': {
      haut: "waiting periods don't gnaw at you",
      bas: 'waiting periods — results, answers — gnaw at you',
    },
    'Q1.1-44': {
      haut: 'you sleep fairly well even when everything is not going well',
      bas: 'when everything is not going well, your sleep pays the price',
    },
    'Q1.1-45': {
      haut: 'your mood stays fairly stable within the same day',
      bas: 'your mood shifts strongly within the same day',
    },
    'Q1.1-46': {
      haut: "you don't build worst-case scenarios more than necessary",
      bas: 'you build scenarios that turn bad more often than necessary',
    },
    'Q1.1-47': {
      haut: 'facing an argument, you find your calm back fairly fast',
      bas: 'after an argument, your calm comes back slowly',
    },
    'Q1.1-48': {
      haut: "a silly remark doesn't occupy your mind for hours",
      bas: 'a silly remark can occupy your mind for hours',
    },
    'Q1.1-49': {
      haut: 'overall, you feel in a good headspace',
      bas: "overall, you don't quite feel in a good headspace",
    },
    'Q1.1-50': {
      haut: "your heart doesn't race without a reason",
      bas: 'you often feel your heart racing without a clear reason',
    },
  },
  '1.2': {
    'Q1.2-01': {
      haut: 'when someone matters to you, their silence weighs on you fast',
      bas: "the silence of someone who matters doesn't weigh on you at first",
    },
    'Q1.2-02': {
      haut: 'you often need to hear that everything is fine between you',
      bas: 'you rarely need to be told that everything is fine',
    },
    'Q1.2-03': {
      haut: 'a slightly cold remark can occupy your whole evening',
      bas: 'a slightly cold remark passes through you without staying',
    },
    'Q1.2-04': {
      haut: 'you sometimes anticipate being left before anything happens',
      bas: "you don't anticipate an exit before it happens",
    },
    'Q1.2-05': {
      haut: 'you feel better when you know clearly where you stand with someone',
      bas: "you can move forward without knowing exactly where you stand",
    },
    'Q1.2-06': {
      haut: "relationships where each keeps their independence are not what suits you",
      bas: 'relationships where each keeps their independence suit you perfectly',
    },
    'Q1.2-07': {
      haut: 'when a relationship gets deep, you feel an instinctive pull to slow down',
      bas: 'when a relationship gets deep, you keep the same pace',
    },
    'Q1.2-08': {
      haut: 'depending on someone scares you',
      bas: "depending on someone doesn't scare you",
    },
    'Q1.2-09': {
      haut: 'you prefer to handle your troubles alone, even with a partner',
      bas: 'with a partner, you share your troubles rather than handling them alone',
    },
    'Q1.2-10': {
      haut: "telling your weaknesses doesn't relieve you, even to someone who matters",
      bas: 'telling your weaknesses to someone who matters relieves you',
    },
    'Q1.2-11': {
      haut: 'constant closeness tires you more than it does you good',
      bas: 'constant closeness does you good more than it tires you',
    },
    'Q1.2-12': {
      haut: 'too much closeness too fast makes you want to take some air',
      bas: "closeness, even fast, doesn't make you want to take air",
    },
  },
};

/** Les marqueurs du Petit pas, par langue (le pas vit à la fin du texte de
 *  palier — le moteur le récupère, jamais ne le réécrit). */
function marqueurPetitPas(): string {
  return getLang() === 'en' ? 'Small step: ' : 'Petit pas : ';
}

function extrairePetitPas(textePalier: string): string {
  const marqueur = marqueurPetitPas();
  const idx = textePalier.indexOf(marqueur);
  if (idx < 0) return '';
  return textePalier.slice(idx + marqueur.length).trim();
}

/**
 * Le texte d'UNE carte de tendance, assemblé depuis les réponses réelles.
 * `textePalier` = le texte de palier du Livrable (source du Petit pas et
 * repli). Renvoie null quand rien n'est tranché (la page garde alors le
 * texte de palier, inchangé) ou quand la quête n'a pas d'échos.
 */
export function texteTendanceDe(
  queteId: string,
  dimKey: string,
  reponses: Record<string, number>,
  textePalier: string,
): string | null {
  const registreFr = REGISTRES[queteId];
  if (!registreFr || !registreFr.dims[dimKey]) return null;
  const items = itemsAncrageDe(queteId);
  if (!items) return null;
  const en = getLang() === 'en';
  const registre = en ? REGISTRES_EN[queteId] ?? {} : registreFr.items;
  const cfg = en
    ? DIMS_EN[queteId]?.[dimKey]
    : {
        pont: registreFr.dims[dimKey].pont,
        lecture: registreFr.dims[dimKey].lecture,
        lectureDoux: registreFr.dims[dimKey].lectureDoux,
      };
  if (!cfg) return null;
  const pas = extrairePetitPas(textePalier);
  const pasSuffixe = pas ? (en ? ' Small step: ' : ' Petit pas : ') + pas : '';

  const { hauts, bas } = pairesDe(items, reponses, dimKey, registre);

  // Cas mixte — deux facettes nommées ensemble (le pont).
  if (hauts.length > 0 && bas.length > 0) {
    const connecteur = registreFr.dims[dimKey].connecteurRevers === 'apprecie'
      ? en ? 'And' : 'Et'
      : en ? 'But' : 'Mais';
    return (
      majuscule(hauts[0].clause) +
      '. ' +
      connecteur +
      ' ' +
      bas[0].clause +
      '. ' +
      cfg.pont +
      pasSuffixe
    );
  }

  // Tout d'un côté — les deux échos les plus tranchés, joints, puis la lecture.
  const cotes = hauts.length > 0 ? hauts : bas;
  const lecture = hauts.length > 0 ? cfg.lecture : cfg.lectureDoux;
  if (cotes.length === 0) return null; // tout au milieu → texte de palier
  const joint =
    cotes.length >= 2
      ? majuscule(cotes[0].clause) + (en ? ', and ' : ', et ') + cotes[1].clause + '.'
      : majuscule(cotes[0].clause) + '.';
  return joint + (lecture ? ' ' + lecture : '') + pasSuffixe;
}

/**
 * La ligne d'écho sous « Là où ça peut se compliquer » — « Et tes réponses le
 * disent : …, mais … ». La paire privilégie UN axe (les deux sens dans la
 * même dimension — le moule de la maquette), sinon les plus tranchées des
 * axes du champ. Renvoie null sans réponse tranchée (rien de rendu).
 */
export function echoFreinesDe(
  queteId: string,
  carteId: string,
  reponses: Record<string, number>,
): string | null {
  const registreFr = REGISTRES[queteId];
  if (!registreFr) return null;
  const items = itemsAncrageDe(queteId);
  if (!items) return null;
  const axes = axesDeChamp(queteId, carteId, 'freines');
  if (axes.length === 0) return null;
  const en = getLang() === 'en';
  const registre = en ? REGISTRES_EN[queteId] ?? {} : registreFr.items;

  // 1ʳᵉ passe : un axe qui porte les deux sens (la tension d'un seul thème).
  for (const axe of axes) {
    const { hauts, bas } = pairesDe(items, reponses, axe, registre);
    if (hauts.length > 0 && bas.length > 0) {
      return en
        ? `And your answers say it: ${hauts[0].clause}, but ${bas[0].clause}.`
        : `Et tes réponses le disent : ${hauts[0].clause}, mais ${bas[0].clause}.`;
    }
  }
  // 2ᵉ passe : les plus tranchées tous axes confondus.
  let haut: EchoChoisi | null = null;
  let bas: EchoChoisi | null = null;
  for (const axe of axes) {
    const p = pairesDe(items, reponses, axe, registre);
    if (!haut && p.hauts.length > 0) haut = p.hauts[0];
    if (!bas && p.bas.length > 0) bas = p.bas[0];
  }
  if (haut && bas) {
    return en
      ? `And your answers say it: ${haut.clause}, but ${bas.clause}.`
      : `Et tes réponses le disent : ${haut.clause}, mais ${bas.clause}.`;
  }
  const seul = haut ?? bas;
  if (!seul) return null;
  return en
    ? `And your answers say it: ${seul.clause}.`
    : `Et tes réponses le disent : ${seul.clause}.`;
}

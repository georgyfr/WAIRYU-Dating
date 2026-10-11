/**
 * Miroir EN du registre — MONDE 7 « Face aux Tempêtes » (quêtes 5.4, 5.5,
 * 5.6).
 * Structure : L10n<QueteDef> par identifiant — seuls les champs AFFICHABLES
 * sont traduits. Codes (Q5.x-NN, CARTE-5.x-*), clés de dims, ids de
 * variantes, scores, seuils : côté FR, jamais recopiés. « suivante » reste
 * côté FR (identifiant de chaînage — non traduit). Les tableaux respectent
 * l'ORDRE et la LONGUEUR exactes du FR. Apostrophe ASCII U+0027 uniquement
 * (leçon Task 45).
 *
 * Neutralité normative absolue (doctrine M7) : 5.4 — the five ways of
 * holding a disagreement are equal, no hierarchy, the shadow is the COST in
 * a couple (for you AND for the other), never the nature ; 5.5 — tension
 * rises in everyone (lecture probabiliste), the four temperatures are
 * equal, the quiet one is a guard, never a fault, no clinical label, the
 * shadow is a PRICE ; 5.6 — the level is a door, never a verdict, the
 * silence is not a failure, the bar describes a muscle, it grades nothing,
 * nothing gets sealed. PREMIUM [6] : zéro teaser, zéro présupposition des
 * mondes gratuits (5.6 fin de monde — CTA générique). Les « citations »
 * d'énoncés (5.6 : QUI-TIENT, SILENCIEUSE) reprennent les énoncés EN de
 * i18n/content/en/quete-5-6.ts — zéro fausse citation.
 */
import type { L10n } from '../../apply';
import type { QueteDef } from '../../../lib/quetes';

export const REGISTRE_M7: {
  '5.4'?: L10n<QueteDef>;
  '5.5'?: L10n<QueteDef>;
  '5.6'?: L10n<QueteDef>;
} = {
  '5.4': {
    titre: 'Facing disagreements',
    sousTitre:
      "The quest of your disagreements: five ways of holding a disagreement, told with no ranking.",
    annonce:
      "Disagreements do not break stories — they show how stories hold together. Say what really happens in you when you disagree, not the image you would like to leave.",
    briefing: {
      aQuoiCaSert: [
        "This is the quest of your disagreements: five ways of holding a disagreement, set equal — none is 'the right one'.",
        "Fifteen statements, five readings: asserting, cooperating, compromising, putting it off, yielding.",
        "Here, nothing gets judged: a stance describes a mechanism, it is neither a quality nor a fault.",
        "At the end, a card to share if you want: your stance in a few words, to show or to keep.",
      ],
      resultats: [
        "Your card — your stance told in a few words: it gets shared, or gets kept.",
        "Five bars — one per way of holding a disagreement, as you described them.",
        "Your mirror at the next step — the full reading of your stance, with no ranking.",
        "One more stone in your portrait — the journey ahead draws on it.",
      ],
    },
    cartes: {
      'CARTE-5.4-GOUVERNAIL': {
        nom: 'The Helm',
        lumiere:
          "In a disagreement, you hold your position all the way through — you said it. Your first disagreement will say more than ten dates: at your place, it will show someone who decides and sets the house moving again.",
        ombre:
          "The firm hand can become a match. Your cost: surface agreements, accepted outside and contested inside. Their cost: a room that shrinks until no longer suggesting anything.",
        tension: "holding the course without taking the whole helm.",
      },
      'CARTE-5.4-ATELIER': {
        nom: 'The Workshop',
        lumiere:
          "You dig into what truly matters to each of you before suggesting — you said it. At your place, a dispute becomes a two-voice inquiry, and it rarely ends in debt.",
        ombre:
          "The permanent negotiation table wears out. Your cost: carrying the relationship on your own. Their cost: wording a need every time, even without the strength for it.",
        tension: "keeping the table for two without spending every evening at it.",
      },
      'CARTE-5.4-PASSERELLE': {
        nom: 'The Bridge',
        lumiere:
          "A halfway agreement unblocks more than it spoils — you said it. At your place, each of you gives a little, and topics move ahead instead of freezing.",
        ombre:
          "The middle ground gets paid in silence. Your cost: lukewarm arrangements that come back to the table. Their cost: a partner who negotiates everything, even what deserved to be defended all the way.",
        tension: "defusing through the middle without forgetting what cannot be split.",
      },
      'CARTE-5.4-PAUSE': {
        nom: 'The Pause',
        lumiere:
          "You let things cool down before coming back to a disagreement — you said it. At your place, the pause is a tool: cold, the same topic costs less than hot.",
        ombre:
          "The topic put off grows in silence. Your cost: a mental list that gets longer. Their cost: raising the topics alone, and reading your silence as indifference.",
        tension: "letting things cool down without burying the topic deep.",
      },
      'CARTE-5.4-PASSAGE': {
        nom: 'The Passage',
        lumiere:
          "For the sake of peace, you accept decisions you do not like — you said it. At your place, yielding is not losing: it is choosing the climate of the home.",
        ombre:
          "Peace bought gets paid in due time. Your cost: an account of silence that fills up without being cashed. Their cost: living with a half-yes, and losing access to what you truly want.",
        tension: "making room without leaving your place.",
      },
      'CARTE-5.4-DUO': {
        nom: 'The Duo',
        lumiere:
          "Two stances rise together in you — and that is a complete answer. One hand decides, the other blends: your first disagreement will tell which duo leads, and it will say more than ten dates.",
        ombre:
          "Two tempos read through fog. Your cost: re-explaining your method at every friction. Their cost: no longer knowing when the decision gets made, nor with whom.",
        tension: "announcing your hand as you enter — the duo becomes one tune.",
      },
      'CARTE-5.4-EQUILIBRE': {
        nom: 'The Balance',
        lumiere:
          "No stance dominated at your place — the five tools are in your box. You handle a conflict like a problem, not like an identity.",
        ombre:
          "The palette changes hands, and the reading has a hard time following. Your cost: handing over keys the other does not have. Their cost: approaching every disagreement with no user guide, and sometimes giving up on approaching.",
        tension: "saying under which rule the disagreement gets played.",
      },
    },
    completion: {
      entete: "🧭 QUEST COMPLETE — 'Facing disagreements'",
      labelOmbre: 'Your shadow zone:',
      labelTension: 'Your inner tension:',
      fenetre:
        "Somewhere, someone holds disagreements another way — meeting is exactly the translation.",
      miroirNote:
        "Your mirror — the full reading of your stance — arrives at the next step of the journey.",
    },
    dims: [
      {
        nom: 'Asserting',
        sousLigne: 'the position held all the way through',
        lecture:
          "This bar tells the place your position takes in a disagreement. Full: you hold your line all the way through, and the last word left to the other side weighs on you afterwards. Light: as soon as an exchange gets tense, your position fades fast. Both places are equal — the bar describes a stance, it grades nothing.",
      },
      {
        nom: 'Cooperating',
        sousLigne: 'the solution that keeps both',
        lecture:
          "This bar tells the place of the other side's need in your disagreements. Full: you dig first into what truly matters to each of you. Light: your needs come first, the rest can wait. Both places are equal — the bar describes a stance, it grades nothing.",
      },
      {
        nom: 'Compromising',
        sousLigne: 'the middle ground that unblocks',
        lecture:
          "This bar tells the middle ground you look for when things get stuck. Full: you suggest arrangements where each of you gives a little. Light: the half you give up leaves you unsatisfied. Both places are equal — the bar describes a stance, it grades nothing.",
      },
      {
        nom: 'Putting it off',
        sousLigne: 'the topic set aside for later',
        lecture:
          "This bar tells what you do when a topic gets touchy. Full: you put it off until later, you let things cool down before coming back. Light: for you, a touchy topic is better sorted out right away. Both places are equal — the bar describes a stance, it grades nothing.",
      },
      {
        nom: 'Yielding',
        sousLigne: 'the room left to the other',
        lecture:
          "This bar tells the room you leave to the other. Full: for the sake of peace, you accept decisions you do not like. Light: your opinion and your no get said, even when they are unwelcome. Both places are equal — the bar describes a stance, it grades nothing.",
      },
    ],
    accompagnement: {
      affirmation: {
        fort:
          "Your held position unblocks deadlocks: you name the problem and the house gets moving again. It is a useful firmness. Its cost: the other may see their room shrink, and you collect surface agreements. What helps: offer a turn to speak before the decision — the other will have a place in it.",
        equilibre:
          "Your firmness comes in touches: now you hold the bar, now you share it. It is a common in-between. What helps: spotting the disagreements where you decide — and the ones where you listen first.",
        doux:
          "As soon as an exchange gets tense, your position fades: you make room rather than enter the duel. It is another way of being strong. Its cost: your opinion can drop out of the decision. What helps: say your line once, even short — it counts in the house.",
      },
      cooperation: {
        fort:
          "You dig into what matters to each of you before suggesting: your disputes end in fresh understanding. It is a real power to repair. Its cost: carrying the table on your own wears you out, and the other has to word a need every time. What helps: one quick decision, once a week — not everything gets negotiated.",
        equilibre:
          "The two-voice inquiry takes turns: some topics get dug into, others get settled fast. Both days are equal. What helps: telling the other which of the two is here — the tone of the disagreement gets announced.",
        doux:
          "The other side's point of view feels like a waste of time: you settle your needs first. It is another way in. Its cost: the version that keeps both can fall off the table. What helps: ask one question about the other side's need — it opens doors.",
      },
      compromis: {
        fort:
          "You suggest arrangements where each of you gives a little: with you, topics move ahead. It is a real power to defuse. Its cost: lukewarm agreements pile up, and the true need stays under the deal — for you as for the other. What helps: say what cannot be split — the middle ground will keep its place.",
        equilibre:
          "The halfway point comes depending on the topic: now the arrangement, now the held position. Both days are equal. What helps: spotting the disagreements that deserved better than half.",
        doux:
          "Giving up half of what you expected leaves you unsatisfied: you prefer full agreements. It is another rhythm. Its cost: a deadlock can last with no middle ground offered. What helps: suggest a small trial arrangement — it reopens the door.",
      },
      evitement: {
        fort:
          "You let things cool down before coming back: cold, the same topic costs less than hot. It is a real tool. Its cost: the topic put off grows in silence — a mental list for you, topics raised alone for the other. What helps: set a date instead of a silence — the topic will stop growing.",
        equilibre:
          "The pause comes depending on how heavy the topic is: now right away, now later. Both rhythms are equal. What helps: saying when you will come back — the waiting changes nature.",
        doux:
          "A touchy topic is better sorted out right away, at your place: the conversation comes fast. It is another way of keeping the house. Its cost: hot, words can cost more. What helps: a few breaths before answering — the substance keeps its time.",
      },
      cession: {
        fort:
          "For the sake of peace, you accept decisions you do not like: the home finds its calm fast. It is a real generosity. Its cost: an account of silence fills up for you, and the other lives with a half-yes. What helps: say one preference every day, even small — peace reads better without debt.",
        equilibre:
          "The room you leave varies with the topics: now you yield, now you put your opinion down. Both gestures are equal. What helps: noticing the yes given easily — and the ones that weigh.",
        doux:
          "Your opinion and your no get said, even when it displeases: your place is set. It is another shape of peace. Its cost: the climate can heat up faster. What helps: keep a soft tone in your no — it lands better and it lasts.",
      },
    },
    conseils: [
      "The five ways of holding a disagreement are equal: your stance gets told, it does not get ranked.",
      "The shadow of a stance is a cost in a couple, not a fault — it gets named for you as for the other.",
      "At the moment of the disagreement, say the rule of the day: decided, shared, set aside, blended, yielded — one word is enough.",
      "Your card gets shared if you want: your stance is a way of being found, not a grade.",
    ],
    commentLire:
      "Five bars, and they come from YOUR answers: one per way of holding a disagreement. Asserting, cooperating, compromising, putting it off, yielding. They run from 0 to 100 — not a grade, not a verdict. Fuller does not mean better: the five ways are equal. Each has its grace and its cost in a couple — both are written below. Read them like a portrait, not a courtroom.",
    ombreRelationnel: {
      'CARTE-5.4-GOUVERNAIL':
        "In a relationship, your shadow zone can give: the match where keeping the lead costs more than the topic. For you: surface agreements, accepted outside and contested inside. For the other: a room that shrinks, up to no longer suggesting anything. What helps: offer a turn to speak before the decision — the other will have a place in it.",
      'CARTE-5.4-ATELIER':
        "In a relationship, your shadow zone can give: the permanent negotiation table. For you: carrying the relationship on your own, a watchfulness that empties you. For the other: wording a need every time, even with no strength left. What helps: one quick decision, once a week — not everything gets negotiated.",
      'CARTE-5.4-PASSERELLE':
        "In a relationship, your shadow zone can give: the pile of lukewarm arrangements. For you: the art of settling without deciding what counts. For the other: a partner who negotiates everything, even what deserved better. What helps: say what cannot be split — the true need deserves better than a deal.",
      'CARTE-5.4-PAUSE':
        "In a relationship, your shadow zone can give: the buried topic, grown by what went unsaid. For you: a diffuse tension you feel without naming it. For the other: raising the topics alone, reading your silence as indifference. What helps: set a date instead of a silence — the topic will stop growing.",
      'CARTE-5.4-PASSAGE':
        "In a relationship, your shadow zone can give: the account of silence that fills up without ever being cashed. For you: the feeling of not counting at full measure. For the other: a half-yes that sometimes reads as being dodged. What helps: say one preference every day, even small — peace reads better without debt.",
      'CARTE-5.4-DUO':
        "In a relationship, your shadow zone can give: two tempos with no stated rule. For you: re-explaining your method at every friction. For the other: no longer knowing when the decision gets made, nor with whom. What helps: announce your hand from the start — the duo then plays the same tune.",
      'CARTE-5.4-EQUILIBRE':
        "In a relationship, your shadow zone can give: the method that changes shape. For you: handing over keys the other does not have. For the other: entering every disagreement with no user guide, and sometimes giving up on entering. What helps: one word before each disagreement — the rule of the day is enough.",
    },
    suite: {
      titre: 'What comes next on your journey',
      intro:
        "Your stance is set — five ways of holding a disagreement, equal, each with its grace and its cost. The next step of the journey looks at the rise: 'When the tension rises', how tension gets expressed and what it does as two. What rubs gets said, what rises gets crossed — as two.",
      questions: [
        'When the tension rises in you, what happens first — and what do you want to keep from it?',
        'What sign tells you, at your place, that a disagreement needs air — a word, a time, a gesture?',
      ],
      cta: 'Continue the journey',
    },
  },

  '5.5': {
    titre: 'When the tension rises',
    sousTitre:
      "The quest of your temperature: how tension leaves you, told with no ranking and no judge.",
    annonce:
      "Tension rises in everyone — here, you look at how it rises in you. There is no right temperature: there is yours, and what it costs when things heat up.",
    briefing: {
      aQuoiCaSert: [
        "This is the quest of your temperature: four paths for the rise, set equal — none is 'the right one'.",
        "Eight statements, four readings: you erupt, you close up, you come back to it later, you carry it down inside.",
        "Here, nothing gets judged: a temperature describes a path, it is not worth more than another.",
        "At the end, a card to share if you want: your way of crossing the rise, in a few words.",
      ],
      resultats: [
        "Your card — your temperature told in a few words: it gets shared, or gets kept.",
        "Four bars — one per way tension leaves you, as you described them.",
        "Your mirror at the next step — the full reading of your temperature, with no ranking.",
        "One more stone in your portrait — the journey ahead draws on it.",
      ],
    },
    cartes: {
      'CARTE-5.5-MOTS-VIFS': {
        nom: 'The tension that speaks loud',
        lumiere:
          "When the tension rises, the words come out louder than you — you answered it. It comes out, it shows: people know where you stand, and nothing festers underneath.",
        ombre:
          "Sharp words cost twice — at the start, then in repairs. The other keeps the volume in memory longer than the substance.",
        tension: "tension rises in everyone — yours speaks loud; the question is the price of the words.",
      },
      'CARTE-5.5-MUR': {
        nom: 'The tension that walls itself in',
        lumiere:
          "When the tension rises, you raise a wall and keep quiet — you answered it. Your silence protects the discussion from the fire: you do not speak before you have got your bearings back.",
        ombre:
          "The silence leaves the other guessing — and the riddle leads further than the dispute: a pause reads as an ending.",
        tension: "tension rises in everyone — yours walls itself in; the question is what the wall costs to two.",
      },
      'CARTE-5.5-LE-RETOUR': {
        nom: 'The tension that waits for its hour',
        lumiere:
          "Once the calm is back, you come back to what hurt — you answered it. You speak when the calm allows hearing: the words arrive whole, without the volume of the rise.",
        ombre:
          "Between the rise and the return, the hurt settles in — the other crosses the scene without knowing it will come back in words.",
        tension: "tension rises in everyone — yours waits for its hour; the question is the time it sets up until then.",
      },
      'CARTE-5.5-LE-CORPS': {
        nom: 'The tension that goes down',
        lumiere:
          "When the tension rises, you pull inward and the body follows — you answered it. The hurt takes the place of words: you carry it without saying it, and it reads.",
        ombre:
          "What does not get said gets paid twice — inside, then between you: a hurt nobody can soothe.",
        tension: "tension rises in everyone — yours goes down; the question is the language it gets given.",
      },
    },
    completion: {
      entete: "🧭 QUEST COMPLETE — 'When the tension rises'",
      labelOmbre: 'Your shadow zone:',
      labelTension: 'Your inner tension:',
      fenetre:
        "Your temperature tells how tension leaves you — not how well you handle it.",
      miroirNote:
        "Your mirror — the full reading of your temperature — arrives at the next step of the journey.",
    },
    dims: [
      {
        nom: 'The words that rise',
        sousLigne: 'the words that come out louder, or the volume held',
        lecture:
          "This bar tells the share of the words that rise. Full: when the tension rises, the words come out louder than you — what gets crossed gets seen. Light: your rise stays low volume, the volume of your voice holds. Both places are equal — the bar describes a path, it grades nothing.",
      },
      {
        nom: 'The wall',
        sousLigne: 'the wall that goes up, or the door held open',
        lecture:
          "This bar tells the place of the wall under tension. Full: you raise a wall and keep quiet — a guard set facing the other. Light: you keep the door of the discussion open. Both places are equal — the bar describes a guard, it grades nothing.",
      },
      {
        nom: 'The return to calm',
        sousLigne: 'the second round, or the topic that stays closed',
        lecture:
          "This bar tells the weight of the second round. Full: once the calm is back, you come back to what hurt. Light: a topic that hurts stays closed for you. Both places are equal — the bar describes a rhythm, it grades nothing.",
      },
      {
        nom: 'The body that follows',
        sousLigne: 'the withdrawal where the hurt gets carried, or the passing that leaves no deposit',
        lecture:
          "This bar tells what goes down. Full: you pull inward and the body follows — the hurt takes the place of words. Light: the tension goes through and leaves without settling. Both places are equal — the bar describes a carrying, it grades nothing.",
      },
    ],
    accompagnement: {
      explosif: {
        fort:
          "Tension leaves through the words, and it shows: people know where you stand. In a couple, sharp words cost twice — at the start, then in repairs. The other keeps the volume in memory longer than the substance. What plays out here: a price, not a verdict. What helps: name the rise before the substance — the volume drops once it is said.",
        equilibre:
          "The words that rise come in touches: depending on the evening, it speaks loud or it stays contained. It is a common in-between. What helps: spotting the moments when the volume takes off — and telling the other before, not after.",
        doux:
          "Your volume stays held when things heat up: your rise speaks low. It is not a restraint to praise, nor a silence to fix — another path. What helps: letting the words come out at your pace, even small — a word said weighs less than a volume kept.",
      },
      ferme: {
        fort:
          "Under tension, you set a wall: you do not speak before you have got your bearings back. Your silence protects the discussion from the fire — a guard, not a flight. The price: the other speaks to a wall without knowing whether it listens, and you carry alone what asked for two voices. What helps: give the silence a date — 'I will come back to it' turns the wall into a delay.",
        equilibre:
          "The wall goes up at moments: you keep quiet when it heats up, then you come back. Both times are equal. What helps: telling the other which of the two is here — an announced silence gets crossed as two.",
        doux:
          "The discussion stays open under tension: you keep a door where others set a wall. It is an availability, not a performance of calm. What helps: checking that the door works for both — speaking fast is not speaking right.",
      },
      verbalise: {
        fort:
          "Once the calm is back, you come back to what hurt: the words arrive whole, without the volume of the rise. The price: between the rise and the return, the hurt settles in — the other crosses the scene without you. It is not a delay to blame: a rhythm. What helps: saying when you will come back — a settled return keeps its promise.",
        equilibre:
          "The return to calm takes turns: sometimes you come back fast, sometimes the topic stays closed. Both rhythms are equal. What helps: naming the delay ahead — an announced wait gets crossed as two.",
        doux:
          "A topic that hurts stays closed: you prefer to move on to something else. It is not indifference — another way with the price. What helps: reopening a closed topic now and then — one sentence leaves the door ajar again.",
      },
      sombre: {
        fort:
          "When the tension rises, you pull inward and the body follows: the hurt takes the place of words. Your body tells what the words have not said yet — and this carrying wears out. The price: the tension gets paid twice — inside, then in the body. What it says: a carrying, not a weakness. What helps: put a short sentence on the hurt — named, it gets carried lighter.",
        equilibre:
          "The withdrawal comes in waves: sometimes it goes down and gets carried, sometimes it goes through and leaves. Both passages are equal. What helps: saying afterwards what happened inside — the body has already spoken, the words complete it.",
        doux:
          "The tension goes through and leaves without settling: you bounce back with no deposit. It is not insensitivity — a light passage. What helps: welcoming the times it stays too — a hurt received weighs less when shared.",
      },
    },
    conseils: [
      "The four temperatures are equal. In everyone, the tension rises: the question is not whether — it is how, and at what price.",
      "Your temperature gets told in images, not in labels: it is a path, not a diagnosis.",
      "A temperature is not a flaw: it has its light and its price — both get said.",
      "In a couple, say how your tension leaves: a path announced gets crossed as two.",
    ],
    commentLire:
      "Four bars, and they come from YOUR answers: one per way tension leaves you. You erupt, you close up, you come back to it later, you carry it down inside. They run from 0 to 100 — not a grade, not a verdict. A fuller bar puts nobody above: the four temperatures are equal. Each has its light and its price — both are written below. Read them like a portrait, not a courtroom.",
    ombreRelationnel: {
      'CARTE-5.5-MOTS-VIFS':
        "In a relationship, your shadow zone can give: sharp words that go past the dispute, paid for in repairs. For you: repairing beyond what you meant to say. For the other: keeping the volume in memory longer than the substance. What helps: name the rise before the substance — saying 'there, it is rising' brings the volume down.",
      'CARTE-5.5-MUR':
        "In a relationship, your shadow zone can give: a wall set up fast, taken down slow — a pause read as an ending. For you: carrying alone what asked for two voices. For the other: speaking to a wall without knowing whether it listens. What helps: one thing said before the silence — 'I will come back to it' gives the wall a date.",
      'CARTE-5.5-LE-RETOUR':
        "In a relationship, your shadow zone can give: a hurt that settles in for the length of the cooling down. For you: right words, but late ones. For the other: living the rise without knowing what will come back from it in words. What helps: set the return before leaving — one time told is worth three riddles avoided.",
      'CARTE-5.5-LE-CORPS':
        "In a relationship, your shadow zone can give: a hurt carried inside, readable on the body before it gets said. For you: the tension gets paid twice — inside, then in the body. For the other: living near a hurt nobody knows how to soothe, for lack of seeing it said. What helps: name the hurt in one sentence of your own — a name set down lightens the carrying.",
    },
    suite: {
      titre: 'What comes next on your journey',
      intro:
        "Your temperature is set — four paths for the rise, none above the others. The next step of the journey looks at the after: what plays out once the disagreement has passed. A dispute stays ordinary when repair arrives — the next step looks at yours.",
      questions: [
        'Once the rise has come down, what helps you come back — and what holds you back from it?',
        'Which repair looks like you: a word, a time, a gesture — and which one still waits for your try?',
      ],
      cta: 'Move toward repair',
    },
  },

  '5.6': {
    titre: 'After a disagreement',
    sousTitre:
      "The quest of what happens after: your way of coming back, told with no grade and no judge.",
    annonce:
      "Disagreements happen — what plays out after is your way of repairing. Here, you look at how you repair, with no grade and no judge.",
    briefing: {
      aQuoiCaSert: [
        "This is the quest of what happens after: five gestures that decide whether a disagreement stays ordinary.",
        "Five statements, one single reading: your way of coming back after a disagreement — nothing else.",
        "Here, nothing gets judged: repairing early, repairing late, or keeping silent — every way has its place.",
        "At the end, a card to share if you want: your way of coming back, in a few words.",
      ],
      resultats: [
        "Your card — your way of coming back after a disagreement: it gets shared, or gets kept.",
        "One bar — your capacity for repair, as you described it.",
        "Your mirror at the next step — the full reading of what happens after, with no ranking.",
        "One more stone in your portrait — the journey ahead draws on it.",
      ],
    },
    cartes: {
      'CARTE-5.6-QUI-TIENT': {
        nom: 'The repair that holds',
        lumiere:
          "You answered it: you apologize without waiting to be asked. After a disagreement, you know how to come back — a gesture, a touch of humour, an apology you take in fully.",
        ombre:
          "When you make the first move every time, the other's first move stays a sleeping muscle. Your cost: the fatigue of being the only one coming back. Their cost: leaning on your apologies.",
        tension: "it is not how often you argue that weighs — it is what happens after. Sometimes leave the doorstep to the other.",
      },
      'CARTE-5.6-SE-TRAVAILLE': {
        nom: 'The repair you work on',
        lumiere:
          "Your repairs exist — they arrive late, or against the grain. Humour sometimes serves you to defuse, and an apology sincerely received brings you back down.",
        ombre:
          "Replaying it over frequently turns an ordinary disagreement into a lasting hurt: the argument is settled, it passes back through your head for days. Your cost: tomorrows that pay for the day before. Their cost: an apology half-accepted.",
        tension: "your level of repair is not a size: it is a muscle — and a muscle is something you work on.",
      },
      'CARTE-5.6-SILENCIEUSE': {
        nom: 'The silent repair',
        lumiere:
          "You answered it: after an argument, you wait for the other person to make the first move. Your silence keeps what is already raw from catching fire — it has its function.",
        ombre:
          "When nobody comes back, the wall of silence settles in — the ordinary disagreement frequently becomes a lasting hurt. Your cost: arguments piling up. Their cost: knocking at a door that does not open.",
        tension: "silence is also an answer — and yours can change its tone from the first move.",
      },
    },
    completion: {
      entete: "🧭 QUEST COMPLETE — 'After a disagreement'",
      labelOmbre: 'Your shadow zone:',
      labelTension: 'Your inner tension:',
      fenetre:
        "Your repair tells what happens after a disagreement — what happens after weighs heavy.",
      miroirNote:
        "Your mirror — the full reading of what happens after — arrives at the next step of the journey.",
    },
    dims: [
      {
        nom: 'Your capacity for repair',
        sousLigne: 'the muscle that comes back after a disagreement',
        lecture:
          "This bar tells your way of coming back after a disagreement: apologizing, making the first move, defusing, turning the page, receiving the apology. Full: you know how to come back — a gesture, a touch of humour, an apology you take in fully. Light: repair arrives little, late, or stays silent — a silence that protects. Both are equal — the bar describes a muscle, it grades nothing: a muscle is something you work on.",
      },
    ],
    accompagnement: {
      reparation: {
        fort:
          "After a disagreement, you know how to come back: a gesture, a touch of humour, an apology you take in fully. It is a muscle that shows. What helps: look at who makes the first move — and let the camp change.",
        equilibre:
          "Your repairs exist, but they arrive late, or against the grain. It is already a muscle — it asks for a click, not a conversion. What helps: say 'it is settled' out loud, then let the sentence work.",
        doux:
          "After an argument, you often wait for the other person to make the first move. Your silence protects: it keeps what is already raw from catching fire — and it is not a failure. What helps: dare one first move, even small — it is enough to open the door.",
      },
    },
    conseils: [
      "It is not how often you argue that weighs — it is what happens after.",
      "A level of repair is something you work on, like a muscle — the bar describes, it grades nothing.",
      "The silence after is not a failure: it is a way of protecting — it can change its tone.",
      "Your card gets shared if you want: your way of coming back is a way of being found, not a grade.",
    ],
    commentLire:
      "One single bar, and it comes from YOUR answers: your capacity for repair — what happens after a disagreement. It runs from 0 to 100 — not a grade, not a verdict. Fuller does not mean better: every way of repairing has its grace and its cost. If the bar is light, nothing is sealed — a muscle is something you work on. Read it like a portrait, not a courtroom.",
    ombreRelationnel: {
      'CARTE-5.6-QUI-TIENT':
        "In a relationship, your shadow zone can give: a first move that falls to one single person. For you: the fatigue of being the only one coming back. For the other: their own apologies going unexercised. What helps: sometimes leave the doorstep to the other.",
      'CARTE-5.6-SE-TRAVAILLE':
        "In a relationship, your shadow zone can give: a settled argument still replaying in your head. For you: tomorrows that pay for the day before. For the other: an apology half-accepted, felt dragging on. What helps: say 'it is settled' out loud — then let the page stay turned.",
      'CARTE-5.6-SILENCIEUSE':
        "In a relationship, your shadow zone can give: the wall of silence when nobody comes back. For you: arguments piling up instead of ending. For the other: knocking at a door slow to open. What helps: one first move, however clumsy, however small — it changes the tone.",
    },
    suite: {
      titre: 'After the storms',
      intro:
        "The storms have passed: you have seen what rubs, what gets said, and what gets repaired after. Nothing is sealed here — every discovery stays a muscle you work on. The next step of the journey keeps drawing your portrait, at your pace.",
      questions: [
        'What has this world taught you about you — and what do you want to keep from what happens after?',
        'When the next disagreement comes, which first move do you want to try — a word, a time, a gesture?',
      ],
      cta: 'Continue the journey',
    },
  },
};

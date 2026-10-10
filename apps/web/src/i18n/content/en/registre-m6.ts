/**
 * Miroir EN du registre — MONDE 6 « Mon Cœur » (quêtes 5.1, 5.2, 5.3, 5.7).
 * Structure : L10n<QueteDef> par identifiant — seuls les champs AFFICHABLES
 * sont traduits. Codes (Q5.x-NN, CARTE-5.x-*), clés de dims, ids de
 * variantes, scores, seuils : côté FR, jamais recopiés. « suivante » reste
 * côté FR (identifiant de chaînage — non traduit). Les tableaux respectent
 * l'ORDRE et la LONGUEUR exactes du FR. Apostrophe ASCII U+0027 uniquement
 * (leçon Task 45).
 *
 * Neutralité normative absolue (doctrine M6) : 5.1 — the six ways of loving
 * are equal, no hierarchy, the shadow is the EXCESS in a couple, never the
 * nature (UI names only: passion, play, friendship-turned-love, pragmatism,
 * intensity, self-giving) ; 5.2 — a belief is neither healthy nor fragile,
 * no verdict, no prediction, no correction (« la suite te dira… » rendu au
 * registre probabiliste) ; 5.3 — five channels are equal, the quiet channel
 * is a reserve of unspoken asks, le nom de marque déposée du domaine
 * n'apparaît sous AUCUNE forme ; 5.7 — four laughs are equal, the shadow is
 * the COST, never the style. PREMIUM [6] : zéro teaser, zéro présupposition
 * des mondes gratuits.
 */
import type { L10n } from '../../apply';
import type { QueteDef } from '../../../lib/quetes';

export const REGISTRE_M6: {
  '5.1'?: L10n<QueteDef>;
  '5.2'?: L10n<QueteDef>;
  '5.3'?: L10n<QueteDef>;
  '5.7'?: L10n<QueteDef>;
} = {
  '5.1': {
    titre: 'Your loving style',
    sousTitre:
      "The first quest of your heart: the ways of loving you live in, told with no ranking.",
    annonce:
      "There are several ways of loving — research counts six, and you probably live in one or two of them. Answer with what really happens in you, not with what you would like it to look like.",
    briefing: {
      aQuoiCaSert: [
        "The first quest of your heart: the ways of loving you live in the most, told with no ranking.",
        "Eighteen statements cross six ways: passion, play, friendship-turned-love, pragmatism, intensity, self-giving.",
        "The six ways are equal: a way gets described, it does not get graded.",
        "At the end, a picture card — with your light, your shadow in a couple and your tension.",
      ],
      resultats: [
        "Your card — your light, your shadow zone and your current tension, in a few words.",
        "Six bars — one per way of loving, as you answered today.",
        "Your nuance: if a second way fits you almost as well, it gets told too.",
        "One more stone in your heart portrait — the journey draws on it.",
      ],
    },
    cartes: {
      'CARTE-5.1-FLAMME': {
        nom: 'The Flame',
        lumiere:
          "When attraction hits hard, everything else waits — you said so. In you, passion is an engine. A story that sets you alight changes your tempo: the world moves to the background.",
        ombre:
          "The fire does not burn ordinary Tuesdays. Everyday life can disappoint, and the other may feel below the peaks next to someone who lives in summits. Your cost: mistaking calm for the end of the fire. Their cost: believing an ordinary day is no longer enough.",
        tension: "living the peaks without reading ordinary days as endings.",
      },
      'CARTE-5.1-PARTIE': {
        nom: 'The Game',
        lumiere:
          "Keeping a bit of play makes the story feel more alive — you said so. In you, loving breathes: the teasing, the sideways step, the joke that loosens. With you, the first hours weigh less.",
        ombre:
          "Lightness reads poorly when the other is serious. A real question answered with a joke stays a question. Your cost: looking absent while you are here. Their cost: not knowing where they stand, and stopping to ask.",
        tension: "keeping the lightness without leaving real questions unanswered.",
      },
      'CARTE-5.1-ROUTE-LONGUE': {
        nom: 'The Long road',
        lumiere:
          "The best stories begin with a friendship — you said so. In you, love grows without rushing: first the conversation, then the trust, then the rest. Time is your way of saying things.",
        ombre:
          "Love that waits to be named keeps people waiting. Your cost: a deep attachment read as habit. Their cost: doubting what is already there, for lack of a word.",
        tension: "letting love grow without letting the word wait too many seasons.",
      },
      'CARTE-5.1-BOUSSOLE': {
        nom: 'The Compass',
        lumiere:
          "Love holds when life plans fit together — you said so. In you, loving is building: schedules get sorted, money gets talked about, decisions get made together. What gets decided with you holds the road.",
        ombre:
          "The list reassures and sometimes hides the person. Your cost: meetings without a box slip past — sometimes the right ones. Their cost: feeling examined rather than discovered.",
        tension: "keeping your bearings while letting the person surprise the list.",
      },
      'CARTE-5.1-VIGIE': {
        nom: 'The Lookout',
        lumiere:
          "Your attention does not sleep — you said so your way: regular signs put you at peace. When you love, you notice everything, and your presence builds shelters.",
        ombre:
          "Your balance travels in the other's pocket. A late reply inflates scenarios. Your cost: a peace that depends on a schedule. Their cost: becoming the keeper of your calm, and tiring of the role.",
        tension: "loving hard while keeping your peace at home, not in the other's hands.",
      },
      'CARTE-5.1-PORT': {
        nom: 'The Harbor',
        lumiere:
          "To love is, first of all, to care without counting — you said so. You guess needs before words, and you move your priorities without noise. In you, caring is a first-second reflex.",
        ombre:
          "Giving with nothing back empties the account in silence. Your cost: a fatigue that arrives after the fact. Their cost: receiving more than they can carry, and no longer daring to ask.",
        tension: "caring for others every day without forgetting to receive in turn.",
      },
      'CARTE-5.1-PALETTE': {
        nom: 'The Palette',
        lumiere:
          "No way of loving dominated in you — and that is a complete answer. Passion, play, time, plans, attention, care: you pass from one hand to another with the seasons.",
        ombre:
          "Your flexibility reads poorly from outside. One passionate week, one settled week: the other may read an inconstancy that is not one. Your cost: re-explaining what you live simply. Their cost: forecasting your seasons poorly.",
        tension: "saying one word of your current season — the rule is hard to guess.",
      },
    },
    completion: {
      entete: "💗 QUEST COMPLETE — 'Your loving style'",
      labelOmbre: 'Your shadow zone:',
      labelTension: 'Your inner tension:',
      fenetre:
        "Somewhere, someone loves with other ways — meeting is what translates them.",
      miroirNote:
        "Your mirror — the full reading of your way of loving — arrives at the next step of the journey.",
    },
    dims: [
      {
        nom: 'Passion',
        sousLigne: 'the flame that takes hold, the rest that waits',
        lecture:
          "This bar tells the place of passion in your answers. Full: attraction reorganizes everything else, the flame settles in fast. Light: you let it come, without letting it command. Both ways are equal — the bar describes an intensity, it grades nothing.",
      },
      {
        nom: 'Play',
        sousLigne: 'the light stake, the air that loosens',
        lecture:
          "This bar tells the share of play in your way of loving. Full: teasing and the sideways step loosen the story. Light: you prefer ground to air, and clarity decides. Both are equal — a light stake and firm ground answer each other.",
      },
      {
        nom: 'Friendship-turned-love',
        sousLigne: 'the slowness that secures, the growth without hurry',
        lecture:
          "This bar tells how your bonds take. Full: the conversation first, the trust next, the rest after. Light: you can love fast and well, without going through friendship. Both ways are equal — time and flame do not rank.",
      },
      {
        nom: 'Pragmatism',
        sousLigne: 'the plan that holds, the life getting built',
        lecture:
          "This bar tells the weight of the concrete in your love. Full: life plans fit, decisions get made together. Light: the meeting comes before the list, the heart's leap decides. Both are equal — building and surprising are equal.",
      },
      {
        nom: 'Intensity',
        sousLigne: 'the need for signs, the presence that watches',
        lecture:
          "This bar tells your need for everyday signs. Full: regular signs put you at peace, your attention keeps watch. Light: the calm of silences is enough. Both are equal — a watchfulness and a serenity are equal.",
      },
      {
        nom: 'Self-giving',
        sousLigne: 'the hand that gives, the care without counting',
        lecture:
          "This bar tells the place of care in your answers. Full: you care without counting, you guess needs before words. Light: you receive first, you give next. Both are equal — giving and receiving answer each other.",
      },
    ],
    accompagnement: {
      passion: {
        fort:
          "The flame catches fast in you: attraction reorganizes everything else. In a couple, the excess would make calm read as the end of the fire — and the other could feel below the peaks. What helps: name one Tuesday that worked — the fire lives there too.",
        equilibre:
          "In you, the flame rises and settles: the peaks and the ordinary days live together. It is a common in-between, and nothing to fix. What helps: say what still sets you alight — so the other knows where the fire is.",
        doux:
          "Passion stays an invitation in you: attraction grows without taking everything over. Slow stories have a fire of their own — it warms differently. What helps: name what lights you, even softly — a fire told gets shared better.",
      },
      jeu: {
        fort:
          "Play is your breathing as two: teasing loosens, the sideways step makes air. In a couple, the excess would answer a real question with a joke — and the other would end up not asking anymore. What helps: answer straight once — the play restarts freer.",
        equilibre:
          "In you, the joke and the serious take turns depending on the question. What helps: keep a clear answer for real questions — lightness gains by being meant.",
        doux:
          "Play stays in the background in you: sometimes you prefer ground to air. Serious stances have their grace — reliability reads fast. What helps: dare one sideways step with nothing at stake — a share of play feeds long stories.",
      },
      amitie: {
        fort:
          "In you, love grows without rushing: the conversation first, the trust next. In a couple, the excess would keep the naming word waiting — and the other would doubt what is already there. What helps: say the word that waits — what is there deserves to be heard.",
        equilibre:
          "In you, slowness and obviousness share the ground: some bonds settle, others declare themselves. What helps: tell your tempo to the other — time speaks better when it explains itself.",
        doux:
          "Friendship is not your hallway to love: you can love fast and well. Frank beginnings have their strength — the flame names early. What helps: keep the conversation long even when the rest goes fast — it feeds what follows.",
      },
      pragmatisme: {
        fort:
          "In you, love gets built: life plans fit, decisions get made together. In a couple, the excess would put the person behind the list — examined before being discovered. What helps: listen once without ticking boxes — surprise has an address too.",
        equilibre:
          "In you, the concrete and the spontaneous balance: you build, and you leave room for the heart's leap. What helps: keep your list for what counts, and a blank page for the rest.",
        doux:
          "Life plans do not steer your love: you let the meeting surprise you. Stories without a plan get built too — at their own pace. What helps: say your life choices early, even without a list — clarity prevents misunderstandings.",
      },
      intensite: {
        fort:
          "You keep watch: regular signs put you at peace, your attention does not sleep. In a couple, the excess would make the other the keeper of your calm — and the keeper tires. What helps: keep a soothing ritual of your own — your peace gains from having several addresses.",
        equilibre:
          "In you, the need for signs exists and settles: the waiting rises, then rests. What helps: name your need out loud — a need told gets met better than a need guessed.",
        doux:
          "Silences rest you: calm without proofs does not shake you. Serenity is a real strength — it gives air. What helps: now and then, remind them your calm is not an absence — it gets told.",
      },
      don: {
        fort:
          "Caring is a first-second reflex in you: you guess needs before words. In a couple, the excess empties the account in silence — and the other can feel indebted for what they cannot carry. What helps: ask for one thing a week — receiving is half the road.",
        equilibre:
          "In you, giving and receiving take turns: you care, and you let yourself be cared for. What helps: say your things before cancelling them — a gift gets told, it does not get endured.",
        doux:
          "Your balance comes before caring for others: you receive first. It is an honest address — lasting help gets chosen. What helps: offer a quiet attention now and then — care builds up and turns light.",
      },
    },
    conseils: [
      "The six ways of loving are equal: your card tells one, it does not grade it.",
      "Re-read your card with a rested head: a way of loving is a shade of the moment, it moves with the seasons.",
      "The shadow describes an excess in a couple, not a nature: name the cost on both sides, the nuance follows.",
      "Your answers open ready-made conversations: say them as they are, without translating.",
    ],
    commentLire:
      "Six bars, and they come from YOUR answers: one per way of loving. Passion, play, friendship-turned-love, pragmatism, intensity, self-giving — six readings, no grade. They run from 0 to 100 — not a grade, not a verdict. Fuller does not mean better: the six ways are equal, a full bar says a marked way, not a superiority. What they look at and what they say about you are written below — read them like a portrait, not a courtroom.",
    ombreRelationnel: {
      'CARTE-5.1-FLAMME':
        "In a relationship, your shadow zone can give: ordinary days read as endings. The partner may believe they stand below the peaks. What helps: celebrate one Tuesday at a time — the fire lives there too.",
      'CARTE-5.1-PARTIE':
        "In a relationship, your shadow zone can give: a real question sent off with a joke. Someone ends up not asking anymore. What helps: a straight answer now and then — the play gains freedom in it.",
      'CARTE-5.1-ROUTE-LONGUE':
        "In a relationship, your shadow zone can give: a deep attachment read as habit, for lack of a word. What helps: say what is already there — the other waits for that word more than for one more gesture.",
      'CARTE-5.1-BOUSSOLE':
        "In a relationship, your shadow zone can give: a person feeling examined rather than discovered. What helps: a listening without a list, now and then — surprise deserves an empty box.",
      'CARTE-5.1-VIGIE':
        "In a relationship, your shadow zone can give: a calm that depends on a reply schedule, and a keeper who tires. What helps: several addresses for your peace — one of them yours.",
      'CARTE-5.1-PORT':
        "In a relationship, your shadow zone can give: an account emptying in silence, and someone who no longer dares to ask. What helps: one request a week — receiving loosens the giving.",
      'CARTE-5.1-PALETTE':
        "In a relationship, your shadow zone can give: seasons the other cannot foresee, read as inconstancy. What helps: one word of rule per season — flexibility gets told in one sentence.",
    },
    suite: {
      titre: 'What comes next on your journey',
      intro:
        "Your way of loving is set — the six ways respect each other, nothing gets judged. The next quest stays in your heart: your vision of love, the expectations you carry without having chosen them. It opens with your answers in your pocket.",
      questions: [
        'What does loving mean to you, deep down — and since when?',
        'What image of love do you carry without having chosen it?',
      ],
      cta: 'Explore your vision of love',
    },
  },

  '5.2': {
    titre: 'Your vision of love',
    sousTitre:
      "A quest of your heart: destiny, love at first sight, the one great love, idealization — four films, no judge.",
    annonce:
      "You hold beliefs about love — they film what comes next before it arrives. Here, you look at them face on, with no ranking and no judge.",
    briefing: {
      aQuoiCaSert: [
        "A quest of your heart: the beliefs you carry about love, even before the meeting.",
        "Eight statements, four readings: destiny, love at first sight, the one great love, idealization.",
        "No belief gets judged here: a film gets watched, it does not get corrected.",
        "At the end, a card — a way of relating to time in love, not a verdict.",
      ],
      resultats: [
        "Your card — your light, your shadow zone and your current tension, in a few words.",
        "Four bars — destiny, love at first sight, the one great love and idealization, as you live them.",
        "An opening, not a prediction: the next chapters will show whether you wait or whether you build.",
        "One more stone in your portrait — the journey ahead draws on it.",
      ],
    },
    cartes: {
      'CARTE-5.2-ECRIT-DAVANCE': {
        nom: 'The love written ahead',
        lumiere:
          "You believe in love that strikes once — you answered it: what is meant to happen ends up happening. Marked meetings keep a taste of obviousness for you, and you let the unexpected surprise you.",
        ombre:
          "Everyday life becomes a text to interpret — what jams reads as a signal. You wait for the sign, the other carries the initiative.",
        tension: "what comes next will show whether you wait or whether you build.",
      },
      'CARTE-5.2-ECLAIR': {
        nom: 'The love that strikes',
        lumiere:
          "You can know within the first minutes that it matters — you answered it. Being seized happens to you, and you give credit to that first contact: beginnings live large in you.",
        ombre:
          "Stories begun fast ask for steps to be caught up. Committing on a first impression — and the other inherits the role of the first evening.",
        tension: "the bolt opens the story — what comes next is what holds it.",
      },
      'CARTE-5.2-UNIQUE': {
        nom: 'The one great love',
        lumiere:
          "Deep down, there is only one great love for each of us — you answered it. That weight, you give it without counting: you are not here to collect, you are here to hold.",
        ombre:
          "Each story then gets measured against a myth — the everyday rarely wins against a legend. The other competes with a ghost.",
        tension: "the myth inspires — it can also keep you from seeing who is here.",
      },
      'CARTE-5.2-VERSION-QUI-POURRAIT': {
        nom: 'The love in potential',
        lumiere:
          "When something pleases you, you mostly picture what it could become — you answered it. You see the best in people, and that lift can be felt: people grow near you.",
        ombre:
          "The real person and the imagined version drift apart — and the gap gets paid on both sides. Being loved for a potential wears out.",
        tension: "loving the best of someone begins with seeing who they already are.",
      },
    },
    completion: {
      entete: "💗 QUEST COMPLETE — 'Your vision of love'",
      labelOmbre: 'Your shadow zone:',
      labelTension: 'Your inner tension:',
      fenetre:
        "Your vision of love tells how you relate to time — the next chapters will show whether you wait or whether you build.",
      miroirNote:
        "Your mirror — the full reading of your vision of love — arrives at the next step of the journey.",
    },
    dims: [
      {
        nom: 'Destiny',
        sousLigne: 'what is written ahead, or what gets built',
        lecture:
          "This bar tells the weight of what is written ahead in your way of loving. Full: what is meant to happen ends up happening — an expectation of obviousness. Light: a beautiful story gets built, it does not get found. Both ways are equal — the bar describes a film, it grades nothing.",
      },
      {
        nom: 'Love at first sight',
        sousLigne: 'the bolt, or the time that recognizes',
        lecture:
          "This bar tells the credit you give to first moments. Full: you can know within the first minutes that it counts. Light: solid feelings need time to recognize each other. Both ways are equal — the bar describes an impulse, it grades nothing.",
      },
      {
        nom: 'The one great love',
        sousLigne: 'the one, or the loves that are equal',
        lecture:
          "This bar tells the weight of the one in your imagination. Full: deep down, there is only one great love for each of us. Light: several different loves can each be great. Both visions are equal — the bar describes a promise, it grades nothing.",
      },
      {
        nom: 'Idealization',
        sousLigne: 'the potential, or the real that is enough',
        lecture:
          "This bar tells the place of potential in your attention. Full: when something pleases you, you mostly picture what it could become. Light: you like people for what they show, not for their potential. Both gazes are equal — the bar describes an angle, it grades nothing.",
      },
    ],
    accompagnement: {
      destin: {
        fort:
          "You read love like a text already written: a marked meeting has a taste of obviousness, and the unexpected interests you. When the belief overflows, everyday life reads as signs — and a disagreement takes the value of an oracle. Your cost: waiting for the sign instead of building. Their cost: carrying the initiative of what comes next. What helps: say what you choose, on top of what you read.",
        equilibre:
          "Your gaze mixes the written and the hand that builds: depending on the moments, you wait or you act. It is a common in-between — neither a fully written text nor a house left to build. What helps: naming, together, what gets chosen and what gets lived.",
        doux:
          "For you, a beautiful story gets built, it does not get found: you build step by step. When this pole overflows, everything becomes a building site — and surprise loses its place. Your cost: wanting to plan everything, down to the vertigo. Their cost: feeling corrected rather than met. What helps: leave room for the obvious — it knocks too.",
      },
      foudre: {
        fort:
          "Beginnings live large in you: being seized happens to you, and you give credit to that first contact. When the impulse overflows, stories begun fast ask for steps to be caught up. Your cost: committing on a first impression. Their cost: playing a first-evening role they did not choose. What helps: give the second date the right to differ from the first.",
        equilibre:
          "In you, the bolt and time share the stage: you let yourself be touched, then you check. It is a supple rhythm — the fire of the start, the hand that builds next. What helps: naming your rhythm to the other, so that neither of you has to guess.",
        doux:
          "Solid feelings need time to recognize each other: you let stories ripen. When the caution overflows, every impulse goes through the filter — and the fire takes time to declare itself. Your cost: beginnings put out before having lived. Their cost: feeling watched rather than welcomed. What helps: offer a first contact without an exam — time does its work.",
      },
      unique: {
        fort:
          "Deep down, there is only one great love for each of us: what you build takes on a rare weight. When the myth overflows, each story gets measured against a legend — and the everyday often loses. Your cost: relationships finished before having had their chance. Their cost: competing with a ghost. What helps: treating the great love as a decision you renew.",
        equilibre:
          "Your imagination welcomes the one without locking up the other stories: the myth inspires, life decides. It is a rare stance — dreaming big while looking at who is here. What helps: naming what the legend gives you, without pinning it on anyone.",
        doux:
          "Several different loves can each be great: you give each story its own chance. When this pole overflows, everything counts a bit too fast — and commitment loses its relief. Your cost: a faithfulness without destination. Their cost: doubting they truly counted. What helps: choosing one story fully — the others stay possible.",
      },
      idealisation: {
        fort:
          "When something pleases you, you mostly picture what it could become: you see the best in people. When the image overflows, the relationship gets played with an imagined version — and the gap gets paid on both sides. Your cost: living with a potential that arrives later. Their cost: feeling invisible, behind what is expected of them. What helps: naming what you already see, before what you dream.",
        equilibre:
          "Your attention balances the real and the possible: you love what is here, you guess what is growing. It is a fruitful gaze — welcoming, and letting grow. What helps: saying out loud what you see apart from what you hope.",
        doux:
          "You like people for what they show, not for their potential: your presence rests on the real. When this pole overflows, the dream fades — and tomorrow loses its defenders. Your cost: possibles left at the side of the road. Their cost: feeling reduced to their present. What helps: naming what you hope, now and then — the real gains a future in it.",
      },
    },
    conseils: [
      "Your vision of love gets watched with no ranking: a film gets told, it does not get corrected.",
      "The four visions of love are equal: none is more mature, none is the ideal.",
      "Your tension is an opening, not a verdict — what comes next gets written with four hands.",
      "In a couple, tell your film about love: beliefs carry better out loud.",
    ],
    commentLire:
      "Four bars, and they come from YOUR answers: destiny, love at first sight, the one great love, idealization. They run from 0 to 100 — not a grade, not a verdict. Fuller does not mean better: a belief and its opposite are equal. Each has its light and its shadow in excess — the overflow plays out in a couple. What they look at and what they say about you are written below — read them like a portrait, not a courtroom.",
    ombreRelationnel: {
      'CARTE-5.2-ECRIT-DAVANCE':
        "In a relationship, your shadow zone can give: everyday life read as a text to interpret, the disagreement taken for a signal. You wait for the sign; the other carries the initiative of what comes next. What helps: saying what you choose, on top of what you read — the two get written with four hands.",
      'CARTE-5.2-ECLAIR':
        "In a relationship, your shadow zone can give: a story begun fast, asking for steps to be caught up. You committed on a first impression; the other inherits the role of the first evening. What helps: letting the second meeting be something other than the first.",
      'CARTE-5.2-UNIQUE':
        "In a relationship, your shadow zone can give: each story measured against a myth, and an everyday that loses against a legend. You compare to the one; the other competes with a ghost. What helps: treating the great love as a decision you renew.",
      'CARTE-5.2-VERSION-QUI-POURRAIT':
        "In a relationship, your shadow zone can give: an affection addressed to the imagined version, when the real person drifts. You live with a potential that arrives later; the other feels invisible, behind. What helps: naming what you already see, before what you dream.",
    },
    suite: {
      titre: 'What comes next on your journey',
      intro:
        "Your vision of love is set — four films, no judge, and a way of relating to time that belongs to you. The next step goes down into the gesture: how you express affection, day to day and as two.",
      questions: [
        'Destiny, the bolt, the one, the potential: which film looks most like you, today?',
        'What has your vision of love changed in your way of loving — and what do you keep from it?',
      ],
      cta: 'Go down into your gestures',
    },
  },

  '5.3': {
    titre: 'How you express affection',
    sousTitre:
      "What makes you feel loved: words, time, gestures, attentions, touch.",
    annonce:
      "You express affection through precise channels — some out loud, others in silence. Here, you look at them, with no ranking and no judge.",
    briefing: {
      aQuoiCaSert: [
        "This is the quest of your expression: what makes you feel loved, and what you give back.",
        "Ten statements, five channels: words, time, gestures, attentions, touch.",
        "No channel is worth more than another: the bar describes, it does not rank.",
        "At the end, a card — and words for two: a crosswise user guide, not a score.",
      ],
      resultats: [
        "Your card — your light, your shadow zone and your current tension, in a few words.",
        "Five bars — your five channels of affection, as you described them today.",
        "Your loudest channel — and the quiet one, your reserve of asks you have not voiced yet.",
        "Conversations for two, if you want: your card gets told, it does not get compared.",
      ],
    },
    cartes: {
      'CARTE-5.3-MOTS-QUI-DISENT': {
        nom: 'The Word that carries',
        lumiere:
          "Words fill you up — you answered it: a sincere compliment carries you, a right sentence relights you. In a couple, you repair fast through words, and you re-read the messages that do you good.",
        ombre:
          "When words carry everything, a silence reads as an absence. Your partner may be digesting — you, you count the minutes.",
        tension: "asking for the word you wait for, rather than measuring it in the blank.",
      },
      'CARTE-5.3-PRESENCE-PLEINE': {
        nom: 'The Time set aside',
        lumiere:
          "What fills you up is time together without screens — you answered it. A settled evening, a walk, a table left unwashed: full presence tells you love louder than objects.",
        ombre:
          "A distracted presence counts half for you — and a half feeds poorly. Loneliness as two arrives without warning.",
        tension: "setting a named slot, rather than a diffuse reproach.",
      },
      'CARTE-5.3-GESTE-QUI-DIT': {
        nom: 'The Gesture that speaks',
        lumiere:
          "In you, help speaks: you answered it, a favor done touches you as much as a word. The suitcase carried up, the tank filled — you read love in what gets settled, and you give it back the same way.",
        ombre:
          "Giving to be owed installs a quiet bill. Help sometimes replaces presence — you do instead of a moment together.",
        tension: "saying what would help you, without waiting for the exact trade.",
      },
      'CARTE-5.3-DETAIL-JUSTE': {
        nom: 'The Right detail',
        lumiere:
          "An attention chosen for you marks you — you answered it. The object thought out, not bought: the proof someone listened. You hunt the right detail for others, and you keep it for yourself.",
        ombre:
          "The proof wears out when it gets counted. A missed birthday weighs more than a whole week of ordinary tenderness.",
        tension: "naming the attention that marked you — the rule comes out of the drawer.",
      },
      'CARTE-5.3-PEAU-QUI-PARLE': {
        nom: 'The Skin that speaks',
        lumiere:
          "A hug comes before words — you answered it. Touch says fast what would take an evening: a hand, a shoulder, a complete goodbye. Your body sums it up, and you feel loved.",
        ombre:
          "When touch says everything, its absence sounds like an alarm. A pause from the other becomes a whole message.",
        tension: "asking for touch by its name — the other answers a request, not an alarm.",
      },
      'CARTE-5.3-ECOUTE-LARGE': {
        nom: 'The Wide listening',
        lumiere:
          "Your channels sit close: words, time, gestures, attentions, touch — nothing dominates clearly. You receive affection on several frequencies and you send it on just as many. Following the other's channel comes naturally to you.",
        ombre:
          "When everything fills you, nothing shouts. Your need stays diffuse — the other has to guess which door to open, and sometimes aims wide.",
        tension: "ranking your last three joys together — the top of the list tells your channel.",
      },
    },
    completion: {
      entete: "💗 QUEST COMPLETE — 'How you express affection'",
      labelOmbre: 'Your shadow zone:',
      labelTension: 'Your inner tension:',
      fenetre:
        "Your dominant channel tells what fills you up — your quietest channel keeps your unvoiced asks. As two, these two lines feed whole evenings.",
      miroirNote:
        "Your mirror — the full reading of your channels — arrives at the next step of the journey.",
    },
    dims: [
      {
        nom: 'Uplifting words',
        sousLigne: 'the word that fills, the slide of compliments',
        lecture:
          "This bar tells the place of words in your affection. Full: a right word carries you, the day changes color. Light: compliments slide — your affection lives elsewhere. Both are equal: a channel describes, no judgment.",
      },
      {
        nom: 'Shared time',
        sousLigne: 'the full presence, the screen that cuts',
        lecture:
          "This bar tells the time set aside as two. Full: an evening without screens fills you, the walk is enough. Light: a distracted presence is enough — your filling lives elsewhere. Both are equal: the bar tells, it does not rank.",
      },
      {
        nom: 'Gestures and favors',
        sousLigne: 'the help that speaks, the mute task',
        lecture:
          "This bar tells what help says to you. Full: a favor done touches you as much as a word. Light: a gesture stays a gesture — your affection comes through other doors. Both are equal: equal ways of saying love.",
      },
      {
        nom: 'Attentions and gifts',
        sousLigne: 'the object that thinks of you, the quiet gift',
        lecture:
          "This bar tells the weight of chosen attentions. Full: an object thought out for you marks you, it proves someone listened. Light: a gift, however careful, says little — the proof does not speak to you. Both are equal: the bar describes a channel, it does not grade it.",
      },
      {
        nom: 'Physical touch',
        sousLigne: 'skin first, the comfortable distance',
        lecture:
          "This bar tells the place of touch. Full: a hug says what words do not reach. Light: feeling loved without touching is a way of loving in its own right. Both are equal — distance is not coldness.",
      },
    ],
    accompagnement: {
      mots: {
        fort:
          "Words fill you up: a sincere compliment carries you, a right sentence relights you. What helps: naming the word you wait for — the other learns it fast.",
        equilibre:
          "Words count, without dominating: they touch you, and other channels too. What helps: saying when a sentence did good — the other keeps the key.",
        doux:
          "Compliments slide: your affection comes through other doors, and that gets respected. It is not a flaw — a reserve. What helps: as two, naming what truly fills you up.",
      },
      temps: {
        fort:
          "Set time fills you up: an evening without screens, a walk as two, and you feel loved. What helps: setting a named slot rather than a diffuse reproach.",
        equilibre:
          "Shared time counts, among others: full presence touches you, gestures too. What helps: keeping a ritual as two — presence gets planned a little.",
        doux:
          "A distracted presence is enough for you: your filling lives in other channels. It is not indifference — another address. What helps: saying it to the other, to avoid misunderstandings.",
      },
      gestes: {
        fort:
          "Help speaks to you: the suitcase carried up, the tank filled, and you feel loved. What helps: say what would help you — without waiting for the exact trade.",
        equilibre:
          "A favor done touches you, without dominating: words and time count just as much. What helps: thanking your way — gratitude travels on your channel.",
        doux:
          "A favor stays a task: your affection lives elsewhere, and it is a whole place. What helps: as two, translating what the help meant.",
      },
      attentions: {
        fort:
          "The chosen attention marks you: the object thought out says someone listened. What helps: telling an attention that marked you — the rule comes out of the drawer.",
        equilibre:
          "Attentions touch you, without dominating: a detail pleases, the rest too. What helps: celebrating others your way — your channel gets to speak too.",
        doux:
          "A gift, however careful, says little to you: your filling lives on other channels. It is not coldness — another address. What helps: naming what speaks to you, before the missed occasions.",
      },
      contact: {
        fort:
          "Touch says fast: a hand, a shoulder, and words move to the background. What helps: asking for touch by its name — the other answers a request.",
        equilibre:
          "Touch counts, among others: an embrace does good, a word too. What helps: welcoming both ways — yours and the other's.",
        doux:
          "Feeling loved without touch is a whole way of loving: distance is not coldness. What helps: as two, explaining your way — the other's hug stays a word, not a demand.",
      },
    },
    conseils: [
      "Your card is a crosswise user guide for two: each tells their channel, the other learns.",
      "The five channels are equal: the quiet one is not a flaw, it holds your unvoiced asks.",
      "No bar gets compared: your speaking channel describes what fills you up, nothing more.",
      "In conversation, show your card: words to speak to each other, not numbers to sort each other.",
    ],
    commentLire:
      "Five bars, and they come from YOUR answers: words, time, gestures, attentions, touch. Five channels of affection, equal in dignity — the bar describes a channel, it does not rank it. They run from 0 to 100 — not a grade, not a verdict. A full bar says a channel that fills you up; a light bar says a reserve of asks you have not voiced yet. What they look at and what they say about you are written below — read them like a portrait for two, not a ranking.",
    ombreRelationnel: {
      'CARTE-5.3-MOTS-QUI-DISENT':
        "In a relationship, your shadow zone can give: silence read as an absence of love. What helps: asking for the word you wait for — a blank gets asked for, it does not get deciphered.",
      'CARTE-5.3-PRESENCE-PLEINE':
        "In a relationship, your shadow zone can give: loneliness as two while the screen stays on. What helps: a named slot, set together — the habit gets renamed, it does not get judged.",
      'CARTE-5.3-GESTE-QUI-DIT':
        "In a relationship, your shadow zone can give: the mental bill of the one who gives and counts. What helps: saying what would help you without waiting for the trade — the favor gets given, it does not get paid back.",
      'CARTE-5.3-DETAIL-JUSTE':
        "In a relationship, your shadow zone can give: the quiet scoring of proofs received. What helps: telling the attention that marked you — the hidden rule comes out of the drawer.",
      'CARTE-5.3-PEAU-QUI-PARLE':
        "In a relationship, your shadow zone can give: a pause read as a falling out of love. What helps: naming the touch you wait for — the other's rest stays rest, not a refusal.",
      'CARTE-5.3-ECOUTE-LARGE':
        "In a relationship, your shadow zone can give: a diffuse need the other guesses poorly. What helps: ranking your last three joys together — the top of the list tells your channel.",
    },
    suite: {
      titre: 'What comes next on your journey',
      intro:
        "Your channels are set — five equal ways of giving and receiving affection, and a user guide for two. The next step looks at your laugh: your humour, the one that carries you — with a card to share if you want.",
      questions: [
        "Which word, which gesture, which attention says 'I love you' without saying it?",
        'As two, which channel of the other is hardest for you to read?',
      ],
      cta: 'Discover your humour',
    },
  },

  '5.7': {
    titre: 'Your humour',
    sousTitre:
      "The quest of your laugh: four ways of making people laugh, told with no ranking.",
    annonce:
      "Your humour arrives in the conversation before your qualities — it loosens, it cuts, it carries through. Here, you look at what your laugh says about you, with no ranking between the four ways of making people laugh.",
    briefing: {
      aQuoiCaSert: [
        "This is the quest of your laugh: four ways of making people laugh, set equal — none is 'the right one'.",
        "Twelve statements, four readings: the laugh that brings closer, the one that lightens, the one that stings, the one that puts itself down.",
        "Here, nothing gets judged: a style describes mechanisms, it is neither a quality nor a fault.",
        "At the end, a card to share if you want: your laugh in a few words, to show or to keep.",
      ],
      resultats: [
        "Your card — your laugh told in a few words: it gets shared, or gets kept.",
        "Four bars — one per way of making people laugh, as you described them.",
        "Your mirror at the next step — the full reading of your laugh, with no ranking.",
        "One more stone in your portrait — the journey ahead draws on it.",
      ],
    },
    cartes: {
      'CARTE-5.7-RAPPROCHE': {
        nom: 'The Laugh that brings closer',
        lumiere:
          "You said you make jokes to bring the people around you closer, and look for laughs to share. With you, an evening unblocks fast: the awkwardness comes out, people talk to each other. Your humour is your way of reaching out a hand.",
        ombre:
          "The bond made through laughing pushes the serious aside. In a couple, heavy topics wait for a joking tone that does not come. The other may stop bringing you what matters, for lack of seeing it land. Your laugh is a voice of its own: the serious needs its voice too.",
        tension: "letting the laugh open the conversation, without finishing it in your place.",
      },
      'CARTE-5.7-LEGER': {
        nom: 'The Laugh that lightens',
        lumiere:
          "You said you laugh at your mishaps to get through them better. In you, a black Monday becomes a tellable story — the distance arrives before the panic. People leave your bad news with less weight on their shoulders.",
        ombre:
          "The laugh set too early closes the needed conversation. In a couple, your funny calm can be taken for an 'I am fine'. The real worry stays an anecdote, and the other believes the topic is settled. The gravity shows in your smile — it was waiting for one clear sentence.",
        tension: "keeping the laugh that carries through, set after the serious word.",
      },
      'CARTE-5.7-TRANCHANT': {
        nom: 'The Laugh that stings',
        lumiere:
          "You said you tease people while saying it is all for a laugh. You say out loud the remark others keep. Your humour sees the fake fast and plays no comedy: with you, people know what gets thought.",
        ombre:
          "The jab does not warn its target. In a couple, the person aimed at was not part of the game — they laugh, then they edit what they confide in you. Trust shifts half a tone, more careful than funny. Your edge speaks loud: even those who do not share it hear it.",
        tension: "keeping the edge for ideas, the softness for the flaws of loved ones.",
      },
      'CARTE-5.7-DESAMORCE': {
        nom: 'The Laugh that puts itself down',
        lumiere:
          "You said you make fun of yourself first to get the laughs going. Your humour defuses the awkwardness before it settles. With you, people are allowed to be imperfect — you set the example before anyone.",
        ombre:
          "The joke on yourself can become the only introduction. In a couple, the other cannot reassure endlessly — each 'come on, you are fine' wears a little tenderness away. And your strengths, less mocked, stay to be discovered.",
        tension: "presenting one strength without laughing — a single one opens the door.",
      },
    },
    completion: {
      entete: "💗 QUEST COMPLETE — 'Your humour'",
      labelOmbre: 'Your shadow zone:',
      labelTension: 'Your inner tension:',
      fenetre:
        "Somewhere, someone laughs like you — the same laughter, another accent. The day your cards cross, the conversation will have already begun.",
      miroirNote:
        "Your mirror — the full reading of your laugh — arrives at the next step of the journey.",
    },
    dims: [
      {
        nom: 'The laugh that brings closer',
        sousLigne: 'the laugh that binds the group, the table that lights up',
        lecture:
          "This bar tells the place of the laugh that gathers. Full: your jokes loosen tongues, the awkwardness comes out and people talk. Light: your humour stays quiet with new people. Both ways are equal — the bar describes a style, it grades nothing.",
      },
      {
        nom: 'The laugh that lightens',
        sousLigne: 'the laugh that gets through the hard days',
        lecture:
          "This bar tells the laugh set on what weighs. Full: you laugh at your mishaps to get through them better. Light: the heavy day keeps all its seriousness. Both places are equal — the bar describes a style, it grades nothing.",
      },
      {
        nom: 'The laugh that stings',
        sousLigne: 'the laugh that pinches its target',
        lecture:
          "This bar tells the laugh that pinches its target. Full: your teasing says out loud what others keep. Light: your teasing spares the people around you. Both places are equal — an edge and a restraint, neither one is a fault.",
      },
      {
        nom: 'The laugh that puts itself down',
        sousLigne: 'the laugh that takes itself as target',
        lecture:
          "This bar tells the laugh turned toward you. Full: you make fun of yourself first to get the laughs going. Light: your flaws get told without jokes. Both places are equal — the bar describes a style, it grades nothing.",
      },
    ],
    accompagnement: {
      rapproche: {
        fort:
          "Your laugh loosens tongues: the awkwardness comes out and people talk. It is a gift to tables. What helps: keeping one moment without laughing to speak true — the serious feels invited there.",
        equilibre:
          "The laugh that gathers comes in touches, depending on evenings and people. It is a common in-between. What helps: spotting the moments when your laugh opens the conversation — and those when it occupies it.",
        doux:
          "Your humour stays quiet with new people: you watch before you throw. It is a rhythm, not an absence. What helps: setting a joke at your pace — the bond gets made gently too.",
      },
      dedramatise: {
        fort:
          "You laugh at your mishaps to get through them better: hard blows become tellable. It is a distance that carries. What helps: setting the laugh after the serious word — what matters keeps its turn.",
        equilibre:
          "The funny distance alternates: some days you get through laughing, others the weight stays heavy. Both days are equal. What helps: telling the other which of the two is here — the weather of the laugh gets announced.",
        doux:
          "When the day turns heavy, the laugh fades: you take things head on. It is not a lack — it is another crossing. What helps: naming what weighs, even without a smile — a clear word carries far.",
      },
      blesse: {
        fort:
          "Your laugh sees the fake fast, and you say out loud what others keep. It is an owned frankness. What helps: keeping the edge for ideas, the softness for the flaws of loved ones.",
        equilibre:
          "The jab comes in touches, depending on people and moments. Both readings are equal. What helps: checking who truly laughs — the target gets counted after the joke, not during.",
        doux:
          "Your teasing spares the people around you: your laugh rarely pinches its target. It is a chosen restraint. What helps: daring the word that unblocks when everyone waits — spoken at the right moment, it gets received well.",
      },
      autobaisse: {
        fort:
          "You make fun of yourself first: the awkwardness has no time to settle. It is an owned generosity. What helps: presenting one strength without laughing — once, and the door opens.",
        equilibre:
          "The joke on yourself comes and goes: you share your flaws without turning them into a costume. What helps: noticing the evenings when you laugh at yourself — and those when you tell yourself.",
        doux:
          "You tell your flaws without turning them into jokes: the serious first. It is another way in. What helps: letting the laugh in with light touches — it defuses too.",
      },
    },
    conseils: [
      "The four ways of making people laugh are equal: your style gets told, it does not get ranked.",
      "The shadow of a style is a cost, not a fault — it gets named for you as for the other.",
      "In a couple, say which laugh arrived: the same joke does not carry the same word depending on the days.",
      "Your card gets shared if you want: your laugh is a way of being found, not a grade.",
    ],
    commentLire:
      "Four bars, and they come from YOUR answers: one per way of making people laugh. The laugh that brings closer, the one that lightens, the one that stings, the one that puts itself down. They run from 0 to 100 — not a grade, not a verdict. Fuller does not mean better: the four ways of making people laugh are equal. Each has its grace and its cost — both are written below. Read them like a portrait, not a courtroom.",
    ombreRelationnel: {
      'CARTE-5.7-RAPPROCHE':
        "In a relationship, your shadow zone can give: the serious topic turned into a joke before it even happened. For you: being funny instead of being heard. For the other: a matter of importance they stop bringing, for lack of seeing it land. What helps: a moment without laughing to speak true — the serious feels invited there.",
      'CARTE-5.7-LEGER':
        "In a relationship, your shadow zone can give: the needed conversation closed too early by a well-placed laugh. For you: a real worry left as anecdote. For the other: believing all is well, because it tells well. What helps: naming the weight once without making it funny — then picking the laugh back up.",
      'CARTE-5.7-TRANCHANT':
        "In a relationship, your shadow zone can give: the jab that did not warn its target. For you: loved ones who edit what they confide in you. For the other: a confided flaw turned risky in front of witnesses. What helps: the edge for ideas, the softness for flaws.",
      'CARTE-5.7-DESAMORCE':
        "In a relationship, your shadow zone can give: the joke on yourself turned into the only introduction. For you: flaws known by heart, strengths waiting. For the other: reassuring endlessly, a tenderness that wears out. What helps: telling one strength without laughing — once is enough to change the address.",
    },
    suite: {
      titre: 'What comes next on your journey',
      intro:
        "Your laugh is set — four ways of making people laugh, equal, each with its grace and its cost. The journey ahead looks at the storms: disagreements, tension, repair. What rubs gets said, what breaks gets repaired — as two.",
      questions: [
        'When disagreement arrives, what comes back to you from your story — and what do you want to keep?',
        'What repairs a tension in you — a word, a time, a gesture?',
      ],
      cta: 'Continue the journey',
    },
  },
};

/**
 * Miroir EN du registre — MONDE 2 « Le Volant » (quêtes 1.4 · 1.5 · 1.6 ·
 * 1.7 · 1.9 · 1.10 · 1.11 — 1.8 n'existe pas au Livrable).
 * Structure : L10n<QueteDef> par identifiant — seuls les champs AFFICHABLES
 * sont traduits. Codes, variantes, dims, fonctions : côté FR, jamais recopiés.
 * Les tableaux respectent l'ORDRE et la LONGUEUR exactes du FR.
 */
import type { L10n } from '../../apply';
import type { QueteDef } from '../../../lib/quetes';

type Miroir = L10n<QueteDef>;

/** La fenêtre de complétion commune (F1) — même texte pour les 5 quêtes à carte. */
const FENETRE =
  "Somewhere, someone is answering these very questions. The day your cards cross, they'll have a lot to say to each other.";

export const REGISTRE_M2: {
  '1.4'?: Miroir;
  '1.5'?: Miroir;
  '1.6'?: Miroir;
  '1.7'?: Miroir;
  '1.9'?: Miroir;
  '1.10'?: Miroir;
  '1.11'?: Miroir;
} = {
  '1.4': {
    titre: 'Your control over yourself',
    sousTitre: 'The wheel quest: the promises you make to yourself.',
    annonce:
      "Self-control is that invisible muscle that keeps you holding the promises you make to yourself. Yours — how does it work?",
    briefing: {
      aQuoiCaSert: [
        'This is the wheel quest — what you choose for yourself, and what you make of it over time.',
        'Eight statements describe the promises you make to yourself: the limits you set, and the ones you keep.',
        'No right answer — only your answer, the one that looks like your ordinary weeks.',
        'Out of it comes a card, and one more stone in your portrait.',
      ],
      resultats: [
        'Your card — your light and your shadow side, in a few words.',
        'Your tendency — how your self-control works today, in one single bar.',
        'The stones of your portrait — what you discover here feeds the whole rest of the journey.',
      ],
    },
    cartes: {
      V1: {
        nom: 'The Artisan',
        lumiere:
          "When you decide something for yourself, it happens. Your limits hold, and so do the promises you make to yourself. It's not military discipline: it's a trust you grant yourself, day after day. Others feel it — it makes your yes reliable and your no solid.",
        ombre: 'The risk of the solid one: judging yourself without mercy on the day you slip.',
        tension: 'holding on without gripping.',
      },
      V2: {
        nom: 'The Happy Medium',
        lumiere:
          "You hold what counts and you let go of what doesn't matter. Your self-control is not an armor: it's a hierarchy. You know where to put your energy — and that's exactly how you last.",
        ombre:
          'The border between “flexible” and “tired” sometimes blurs — check once in a while which side you\'re on.',
        tension: 'staying flexible without letting yourself drift.',
      },
      V3: {
        nom: 'The Living One',
        lumiere:
          "Your resolutions are sincere, and so are your relapses. You start again, you adjust, you start again. It's not a lack of willpower: it's a life that prefers trying to guilt. A lot of things get built that way.",
        ombre:
          'The “this is the last time” ends up losing its meaning — pick a ritual rather than a promise.',
        tension: 'changing without hating yourself.',
      },
      V4: {
        nom: 'The Good-Faith Yielder',
        lumiere:
          "Your intentions are there, and so is the drive — it's the thread between the two that breaks. The everyday temptations are closer than your goals. You know it, you live it with humor, sometimes with weariness.",
        ombre:
          'The habit of giving in can become a story you tell yourself — “I\'m just like that”. You\'re mostly like that, for now.',
        tension: 'believing in yourself for longer than a Monday.',
      },
      V5: {
        nom: 'The Immediate One',
        lumiere:
          "You live in the present tense. The craving arrives, you answer. Far-off plans bore you, close pleasures speak to you. It's a whole way of existing — sincere, without calculation, without pretense.",
        ombre:
          "Some things you truly want — truly — ask for a delay. They'll only get it if you give it to them.",
        tension: 'enjoying now without stealing it from later.',
      },
    },
    completion: {
      entete: '🧭 QUEST COMPLETE — “Your Control Over Yourself”',
      labelOmbre: 'Your shadow side:',
      labelTension: 'Your inner tension:',
      fenetre: FENETRE,
      miroirNote:
        'Your mirror — the complete reading of how you work — arrives at the next step of the journey.',
    },
    dims: [
      {
        nom: 'Your Self-Control',
        sousLigne: 'the limits you keep',
        lecture:
          "This bar says how the promises you make to yourself are doing: kept (full) or renegotiated along with the moods (light). It looks at your everyday limits — budget, screen, food, rest — and what's left of them when motivation fades. The bar describes a mechanism, it grades nothing.",
      },
    ],
    accompagnement: {
      autocontrole: {
        fort:
          "What you decide for yourself holds: your limits and your promises check out over time. Your watchpoint: when things slip one day, don't judge yourself — one slip doesn't demolish a mechanism.",
        equilibre:
          "You hold what's essential and let the rest live: your control picks its battles. It's a healthy setting — just keep an eye on promises postponed too often.",
        doux:
          "Your good resolutions leave fast, and close pleasures often win. It's not a lack of willpower: your present is strong, that's all. One single promise, small, kept — then the next one: that's how the muscle gets built.",
      },
    },
    conseils: [
      'Reread your card with a rested head: your promises prove themselves on ordinary days, not perfect ones.',
      'Choose ONE promise to yourself, small and dated: kept, it beats ten vague resolutions.',
      'When you give in, look at what triggered the slip — tiredness, boredom, mood: the trigger can be managed.',
      "No bar defines you: it describes your answer of today, not a box forever.",
    ],
    commentLire:
      "One single bar, and it comes from YOUR answers: the fuller it is, the more the promises you make to yourself hold. It runs from 0 to 100 — not a grade, not a verdict, just today's snapshot. What it looks at and what it says about you are written below — read it like a portrait, not a report card.",
    ombreRelationnel: {
      V1:
        'In a relationship, your shadow side can give: an invisible hand on the shared life, where the other was hoping to be welcomed. What helps: ask what the other needs before offering a solution.',
      V2:
        "In a relationship, your shadow side can give: promises dropped without a heads-up — the flexible side hiding the tired side. What helps: say the renegotiation out loud before you renege — the other follows better than they guess.",
      V3:
        'In a relationship, your shadow side can give: fresh starts that repeat — and someone close who stops counting. What helps: name out loud what is starting over, instead of promising one more never again.',
      V4:
        'In a relationship, your shadow side can give: planned departures that slide — and the other one waiting, keeping count. What helps: one single promise in progress at a time — small, dated, finished.',
      V5:
        'In a relationship, your shadow side can give: a vivid presence in the now, and shared plans pushed along with the moods. What helps: one shared commitment, short and dated, finished before the next.',
    },
    suite: {
      titre: 'The next step of your journey',
      intro:
        'You now know how you keep the promises you make to yourself. The next step asks you to say nothing: it looks at what you choose. And what you choose reveals more than what you say.',
      questions: [
        'When you give in, what wins: the craving, the tiredness, the mood?',
        'What is the last promise to yourself you kept — with no witness, no audience?',
      ],
      cta: 'Take the test of time',
    },
  },

  '1.5': {
    titre: 'The Test of Time',
    sousTitre: "The wheel's small task: what your choices reveal.",
    annonce:
      'No questions this time. Just choices. What you choose in 10 seconds often says more than what you answer in 10 minutes.',
    briefing: {
      aQuoiCaSert: [
        'Six situations, one at a time: on each screen, you choose between an immediate option and a delayed one.',
        "Both options are worth the same at every choice — only the time between them changes. There is no right answer.",
        "These are open hypotheses: nothing commits you to anything real — you choose freely, and that is exactly what speaks.",
        'It describes a relationship with time: what you pick right away, what you let ripen.',
      ],
      resultats: [
        'Your card — your light and your shadow side, in a few words.',
        'What your choices reveal — your relationship with time, spelled out in full.',
        'The stones of your portrait — what you discover here feeds the whole rest of the journey.',
      ],
    },
    cartes: {
      V1: {
        nom: 'The Hand that Plucks',
        lumiere:
          "You take life at the moment it reaches out its hand: tonight's money, the warm dinner, the meeting without delay. Your present is a place where people feel welcomed, and it shows from the first conversation.",
        ombre:
          'Picking right away sometimes leaves plans without shape or guardrails — and someone, in a couple, still waits for the promised plan.',
        tension: 'picking the moment, without turning it into a debt for later.',
      },
      V2: {
        nom: 'The Wave that Strikes',
        lumiere:
          "Your momentum chooses fast and strong: the beautiful meeting this weekend, the apartment signed without delay. Stories with you start early — and that launches the things others leave waiting.",
        ombre:
          'The wave that strikes also carries hot-headed decisions — and the other sometimes follows a course that changes within a week.',
        tension: 'keeping the momentum, adding one night to it when someone else comes aboard.',
      },
      V3: {
        nom: 'The Tightrope Walker of Time',
        lumiere:
          "You walk the wire between picking and waiting: one choice for tonight, one choice for week six. Your tempo is set piece by piece, not on principle — and that's your signature.",
        ombre:
          "The wire moves with the mood of the day — and the other can't guess your tempo; they have to ask you for it.",
        tension: 'holding your wire, saying out loud where you stand.',
      },
      V4: {
        nom: 'The Gardener of Seasons',
        lumiere:
          "You wait for the season to be right: the sum that doubles, the person read better, the story that settles in. Your patience doesn't wait out of fear — it aims, and it shows in the end.",
        ombre:
          "The gardener who waits too long for the season sometimes sees the window close — and the other one wondering whether it's worth the risk.",
        tension: 'aiming true, without letting slip the doors that knock only once.',
      },
      V5: {
        nom: 'The Wine that Keeps',
        lumiere:
          "Six choices, six waits: you know what you want and you accept the delay that comes with it. With you, time can be read — it doesn't surprise, and that builds something solid.",
        ombre:
          'The wine keeps, not all of life: some wants expire in the cellar — and the other waits for their share of now.',
        tension: 'holding your course, without turning waiting into a total rule.',
      },
    },
    completion: {
      entete: '🧭 QUEST COMPLETE — “The Test of Time”',
      labelOmbre: 'Your shadow side:',
      labelTension: 'Your inner tension:',
      fenetre: FENETRE,
      miroirNote:
        'Your mirror — the complete reading of how you work — arrives at the next step of the journey.',
    },
    dims: [
      {
        nom: 'Your Relationship with Time',
        sousLigne: 'pluck now or let it ripen',
        lecture:
          "This bar says how many times your hand picked without waiting: full, it took the immediate option at almost every scene; light, it let things ripen most of the time. Both gestures are equal — giving in isn't weakness, waiting isn't maturity. The bar describes a relationship with time, it grades nothing.",
      },
    ],
    accompagnement: {
      IMP_B: {
        fort:
          "Your hand picked at almost every scene: opportunities get lived the moment they show up. It's neither a strength nor a flaw — it's a tempo. Your lever: one decision a week made cold, so nothing important stays hanging.",
        equilibre:
          "Your hand picked as often as it waited: one choice for tonight, one choice for later. You have no rule, you read each situation — it's a signature, not a blur. Watchpoint: your tempo shifts with the days; saying it out loud keeps people from having to guess.",
        doux:
          "Your hand waited at almost every scene: it lets things ripen, it aims, it chooses little but precisely. It's not fear — it's a way of aiming. Your lever: one door a month where you walk in without reading the label, so waiting keeps its taste.",
      },
    },
    conseils: [
      'Reread your card with a rested head: other sentences will stand out.',
      "Spot the choice that surprised you most — that's often where something speaks.",
      "Six pickings, six waits, or a mix: the five profiles are equal, none is the right one.",
      "Keep your answers on this device: the next quest builds on what you just chose.",
    ],
    commentLire:
      "This bar comes from your six choices, right now: it rises each time your hand took the immediate option. It measures neither a quality nor a flaw — only the tempo you chose, scene by scene. It's a snapshot of your choices, not a grade.",
    ombreRelationnel: {
      V1:
        'As a couple, repeated right-now leaves work sites open: the conversation pushed to later, the savings postponed, the promised plan running late. What helps: keep one piece of the week you decide cold — and say what is waiting, instead of letting it wait.',
      V2:
        'As a couple, momentum that starts fast sometimes decides in the heat — and the other follows a course that changes within a week. What helps: add one night of delay on choices that commit someone else.',
      V3:
        'As a couple, your tempo reads day by day: the other asks a simple question and gets an answer that depends on the day. What helps: say your tempo out loud (“I\'m waiting on this one”) — balance is shared.',
      V4:
        "As a couple, waiting that calibrates can let the window close before the decision — and the other wonder whether your hand's risk is worth it. What helps: keep one door a month where you walk in without reading the label.",
      V5:
        'As a couple, a repeated “later” can be lived as a “not you”: the other waits for their share of now. What helps: choose together one pleasure of now each week — waiting gets its taste back when it isn\'t total.',
    },
    suite: {
      titre: 'Your relationship with time is on the table.',
      intro:
        "You've shown how your hand moves through time. Now let's see how your mind moves through ideas — and it doesn't think like everyone else either.",
      questions: [
        'When a beautiful opportunity shows up, what decides: your desire or the moment?',
        'The things you put off — do you really come back to them?',
      ],
      cta: 'Discover my way of thinking',
    },
  },

  '1.6': {
    titre: 'Your Way of Thinking',
    sousTitre: "The wheel's compass: your head, how it makes decisions.",
    annonce:
      "Some people think with their gut, others with their calculation. Both work — but they don't always understand each other. Which side are you on?",
    briefing: {
      aQuoiCaSert: [
        "The Wheel is about driving: this quest looks at your head — how information comes in, how the decision comes out.",
        'Seven statements describe how you process information: the gut, the feeling, the checking, the numbers.',
        'Three small riddles complete the picture: with no grade, we look at how you go about it, not whether you find it.',
        'Out of it comes your card — your way of thinking then feeds the whole rest of the journey.',
      ],
      resultats: [
        'Your card — your light and your shadow side, in a few words.',
        "Your inner tension — what you're trying to hold together.",
        'Your mirror — the complete reading of your way of thinking, at the next step of the journey.',
      ],
    },
    cartes: {
      V1: {
        nom: 'The Watchmaker',
        lumiere:
          "You take problems apart piece by piece, and it shows: your answers and your claims hold up. In your world, thinking is not doubting — it's building.",
        ombre:
          'Not everything comes apart. Some things — people, wants, love — are felt first, understood after.',
        tension: 'understanding without removing the magic.',
      },
      V2: {
        nom: 'The Gut Instinct',
        lumiere:
          "Your first impression is your compass, and often it's right. You decide with your belly, you succeed with style. The slowness of analysis bores you — the living calls you.",
        ombre:
          "The traps that ask for a second reading sometimes catch you — because you've already answered.",
        tension: 'trusting your gut without leaving it alone.',
      },
      V3: {
        nom: 'The Gut Instinct that Checks',
        lumiere:
          "You say you follow your instinct — and yet, facing the traps, you checked. Your secret? A gut that doesn't believe itself infallible. It's the best combination: you feel fast, you confirm without admitting it to yourself.",
        ombre:
          'The day you fully admit to yourself how methodical you are, you\'ll be formidable.',
        tension: 'staying fast without lying to yourself.',
      },
      V4: {
        nom: 'The Prudent One',
        lumiere:
          "You weigh, you check, you refuse to answer too fast — even the questions that beg for it. Your caution has spared you more mistakes than it has cost you chances.",
        ombre:
          'There are simple answers disguised as traps — you watch them go by while looking for the complication.',
        tension: 'checking without doubting everything.',
      },
      V5: {
        nom: 'The Two Hands',
        lumiere:
          "One hand that feels, one hand that measures. Depending on the ground, you change tools — and that beats any doctrine. You're the kind who understands both camps: the intuitive and the analyst.",
        ombre:
          'The risk of complete people: never becoming exceptional at a single gesture.',
        tension: 'choosing the tool — and sometimes sticking with it.',
      },
    },
    completion: {
      entete: '🧭 QUEST COMPLETE — “Your Way of Thinking”',
      labelOmbre: 'Your shadow side:',
      labelTension: 'Your inner tension:',
      fenetre: FENETRE,
      miroirNote:
        'Your mirror — the complete reading of your way of thinking — arrives at the next step of the journey.',
    },
    dims: [
      {
        nom: 'Your Way of Processing',
        sousLigne: 'gut or checking',
        lecture:
          "This bar says how information comes in for you and how the decision comes out: by gut, by feeling, or after checking. Full: you take things apart and verify before you rule. Light: your first impression leads, and it moves fast — both styles think, at different speeds.",
      },
    ],
    accompagnement: {
      traitement: {
        fort:
          "You take problems apart piece by piece: pros and cons, steps, checks. Your opinions hold up, and the big decisions for two gain rare ground. Your watchpoint: feelings don't ask for proof — some things are known before they can be demonstrated.",
        equilibre:
          'Your gut gives the direction, your checking gives the ground: you feel fast and you confirm when it counts. Just remember to state YOUR position before translating other people\'s — your opinion is worth as much as your bridges.',
        doux:
          "Your first impression leads, and often it's right: you decide with your belly, you go fast, the living calls you. Your lead: clever traps look like what you expect — a second reading, now and then, keeps your gut from facing the disguises alone.",
      },
    },
    conseils: [
      'Reread your card with a rested head: other sentences will stand out.',
      'Facing the next decision that matters, notice which hand is working: the one that feels, or the one that measures.',
      'If the gut leads in you, test it on one small choice a day: note the impression, check the verdict afterwards.',
      'No bar defines you: it describes your answer of today, not a box forever.',
    ],
    commentLire:
      "The bar comes from your seven answers, right now: full, they lean toward checking; light, toward the gut. Neither pole is worth more than the other — the gut goes fast, checking goes far, and both think. The three small riddles don't enter this bar: they shed light on your manner, with no grade.",
    ombreRelationnel: {
      V1:
        'As a couple, facing a partner who thinks in feelings, your speeds differ: they ask for room, you ask for reasons, and the exchange runs at two paces. What helps: ask “what do you see?” before “why?”. The other\'s feelings don\'t wait for proof to be true — hearing them as they are brings the tempos together.',
      V2:
        'As a couple, an impression said early and sure arrives like a verdict without a file — and the other closes up instead of correcting. What helps: say your feeling in one sentence, no proof, like an open hypothesis: “this is what I\'m picking up, correct me if I\'m wrong”.',
      V3:
        'As a couple, your partner may take your wins for luck — without seeing the quiet checking that works behind. What helps: show the work, once in a while. An owned method can be shared — and the other learns to trust you for real.',
      V4:
        'As a couple, an obvious point offered by the other can get turned over every which way — the conversation wears out, the other feels examined. What helps: welcome the obvious first, check later if needed. A “you\'re right, we\'ll come back to it” costs less than a teardown — and keeps the door open.',
      V5:
        'As a couple, translating feelings into structure and structure into feelings is tiring — you become the mandatory crossing point of every decision. What helps: before translating, state YOUR position. The other comes for your opinion, not only your bridge.',
    },
    suite: {
      titre: 'Your compass is set — the door remains.',
      intro:
        'You now know how your head decides: the gut, the checking, or both hands. Next step: how your mind works — what you share, who you open your door to.',
      questions: [
        'What do you share first, and with whom?',
        'How do you decide to open your door?',
      ],
      cta: 'Set how my mind works',
    },
  },

  '1.7': {
    titre: 'How Your Mind Works (optional)',
    sousTitre: "The wheel's setting: what you show, who you open it to.",
    annonce:
      "No one is testing you here. You describe yourself, in one click, if you want to. It's editable at any time, never in any score — only to help you be understood, and to meet people who are comfortable with how your mind works.",
    briefing: {
      aQuoiCaSert: [
        'Two opt-in settings: what you show, and who can see it. You check a box only if you want to.',
        'Editable and erasable at any time, from your profile.',
        'Never in any score: nothing here measures or grades anything.',
      ],
      resultats: [
        'Your trust screen — the end of the quest with no card, no grade, no sharing.',
        "Your settings stay yours — shown only if you decided so, revocable whenever you want.",
      ],
    },
    completion: {
      entete: '🧭 QUEST COMPLETE — “How Your Mind Works”',
      fenetre:
        'What you shared stays between you and the app — unless you chose to show it on your profile. It will help the people you meet feel at ease, and it will help you cross paths with people who understand you.\n\nYou can change or erase it at any time, from your profile. None of this enters any score.',
    },
    conseils: [
      "You can change your mind whenever you want: settings can be edited or erased from your profile, at any time.",
      '“I\'d rather not say” is a complete answer — not a missing one.',
      'What you show and who can see it: two separate decisions, in that order.',
    ],
    commentLire:
      'There is nothing to read here — no bar, no grade. Just two settings that stay yours.',
    suite: {
      titre: 'Your settings are in place.',
      intro:
        'The next quest looks at your momentum right now — the weather of these last few days.',
      questions: [],
      cta: 'Take my weather reading',
    },
  },

  '1.9': {
    titre: 'Your Momentum Right Now',
    sousTitre: "The wheel's weather: your momentum of these last few days.",
    annonce:
      'Last step, fewer cards: three questions about your momentum right now.',
    briefing: {
      aQuoiCaSert: [
        'Eight statements about your momentum of these last few days — a weather report, not a portrait.',
        'They cover three needs: your autonomy, your competence, your connection.',
        'No right answer: answer how you feel these days, without aiming for an ideal momentum.',
        'A weather report can be taken again: in 30 days, you can retake the snapshot of your momentum.',
      ],
      resultats: [
        'Your card — “The Weather of the Moment”: your light, your shadow side, your tension.',
        "Your mirror — your momentum season right now, in full words, with a user guide.",
        'A dated reading — it holds for today, and can be retaken at the earliest in 30 days.',
      ],
    },
    cartes: {
      V1: {
        nom: 'The Weather of the Moment',
        lumiere:
          "What you read here is not a portrait: it's your inner weather of the day. Your momentum rises, runs out of breath, comes back — and your energy has the right to move without betraying you.",
        ombre:
          "A dated weather report misleads if you reread it later: what you offer today changes — and the other reads the today, not your past week.",
        tension: 'accepting that your momentum moves, without forcing it to lie.',
      },
    },
    completion: {
      entete: '🧭 QUEST COMPLETE — “Your Momentum Right Now”',
      labelOmbre: 'Your shadow side:',
      labelTension: 'Your inner tension:',
      fenetre: FENETRE,
      miroirNote:
        'Your mirror — your current momentum, in full words — arrives at the next step of the journey.',
    },
    dims: [
      {
        nom: 'Your Autonomy Right Now',
        sousLigne: 'what your days owe to your choices',
        lecture:
          "This bar says who holds the wheel these last few days: your choices, or the circumstances. Full: your days look like you — you decide and you move. Light: the moment often decides in your place. It's a state, not a trait: it moves with your season.",
      },
      {
        nom: 'Your Connection Right Now',
        sousLigne: 'real conversations, the people who count',
        lecture:
          'This bar says the place of connection in your last few days: real exchanges, or days crossed in silence. Full: you feel close to the people who count. Light: the thread waits for a gesture — one single open conversation is enough to pick it up.',
      },
      {
        nom: 'Your Competence Right Now',
        sousLigne: 'what you take on, what you finish',
        lecture:
          "This bar says how what you take on right now holds up: what holds, what you finish, what overflows. Full: you finish what you start, and it shows. Light: the unexpected drives the week — it's a pass, not a verdict.",
      },
    ],
    accompagnement: {
      autonomie: {
        fort:
          "These last few days, your days look like your choices: you decide, you move, you hold the wheel. It's a season where things advance — keep one empty slot a week so it can breathe.",
        equilibre:
          "Your autonomy is in two tones: some days look like you, others decide in your place. It's the most common state — name what holds, the rest waits its turn.",
        doux:
          "Right now, it's often the circumstances that decide for you. It's not the way you are: it's a weather, dated and passing — to be re-measured in 30 days.",
      },
      affiliation: {
        fort:
          'These last few days, you feel close to the people who count: real conversations are flowing. This bond feeds your momentum more than you see — keep one door open each day.',
        equilibre:
          'Your bond of the moment is in two tones: exchanges that carry you, days that pass without a real conversation. The thread is there — one gesture a day is enough to hold it.',
        doux:
          "Right now, you go through days without a real conversation, and it shows. The need for connection is a need for exchange, not for presence: one single open conversation is enough to hold the thread. Here, nothing is late.",
      },
      competence: {
        fort:
          'Right now, what you take on holds up: you finish what you start. This felt effectiveness carries the rest of your momentum — enjoy it without piling on.',
        equilibre:
          "Your competence of the moment is in two tones: what you chose holds, the unexpected takes the rest. You're not fickle — your season is, and it moves.",
        doux:
          "Lately, you feel powerless in front of the unexpected. It's not a breakdown: it's a dated state, one you cross and re-measure. Start small: one thing begun, finished — continuity comes back that way.",
      },
    },
    conseils: [
      'Keep one caring gesture a day — walk, cook, sleep: momentum often restarts through the everyday.',
      'Open one real conversation a day: a single one is enough to hold the thread.',
      'Keep one open slot a week: your momentum breathes there, and a full season doesn\'t run off with your nights.',
      'Read your card like a weather report: it\'s dated today — you can retake it at the earliest in 30 days.',
    ],
    commentLire:
      "These three bars say the state of your three needs these last few days — a weather report, not a portrait. A weather report gets reread, then it changes: your session is dated, and the retake comes at the earliest in 30 days. No level is a merit: a low momentum is a season, not a failure.",
    ombreRelationnel: {
      V1:
        "As a couple, your weather colors what the other meets: a high momentum that piles on, a low momentum whose messages wait. The gesture that helps: name your season out loud — the other reads your today, not a lack of interest.",
    },
    suite: {
      titre: 'Your weather is taken.',
      intro:
        "You now know where your momentum stands these days. But a journey for two isn't measured by your momentum alone: it's measured by what you bring to it.",
      questions: [
        'What do you bring, yourself, when two lives cross?',
        'What stays of you when the momentum falls?',
      ],
      cta: 'See what I bring',
    },
  },

  '1.10': {
    titre: 'What You Bring',
    sousTitre: 'What your presence gives, really.',
    annonce:
      "What comes next isn't what you look for — it's what you bring. Answer with honesty: the weaknesses you declare here are worth gold for your search.",
    briefing: {
      aQuoiCaSert: [
        'This quest looks at what you offer in a bond: being there, coming back after an argument, seeking agreement, admitting, helping.',
        'Each sentence describes a behavior, never a quality: you answer on what you do — not on what you are.',
        'Honesty serves your search: what you declare here helps the app cross your path with precision.',
        "Out of it comes your card — your way of bringing, with its light and its shadow side.",
      ],
      resultats: [
        'Your card — what you bring, with your light and your shadow side.',
        "Your inner tension — what you're trying to hold together.",
        'Your mirror — your contribution spelled out in full, with a concrete user guide.',
      ],
    },
    cartes: {
      V1: {
        nom: 'The Beacon',
        lumiere:
          'You are the person who comes back: the first contact after the argument, the answer that arrived before the request, the fault owned the same day. What you offer can be seen, can be checked, and holds a table for two.',
        ombre:
          'A beacon that shines for others sometimes lights its own path poorly — and giving can become the only way you tolerate being loved.',
        tension: 'giving strong, without losing your place as someone who receives too.',
      },
      V2: {
        nom: 'The Ladder',
        lumiere:
          'You give and you receive: you look for what works for both, you admit your faults, you help depending on the day. Nothing spectacular — a balance that gets verified by walking, not by announcing.',
        ombre:
          "Balance can slide into the exact count: returning every effort, measuring every gesture — and the bond becomes a ledger where people write more than they offer.",
        tension: 'holding the course of give-and-take, without turning the other into a debtor.',
      },
      V3: {
        nom: 'The Bypass',
        lumiere:
          "You know what you expect from people and you ask for it straight out. Your side of the road is well kept — you know where you want to go, and there's clarity in that.",
        ombre:
          "The bypass avoids the center: given enough receiving more than you offer, people end up taking another road — and the silence that follows costs what you thought you'd won.",
        tension: 'asking for what you need, starting by laying the first stone.',
      },
    },
    completion: {
      entete: '🧭 QUEST COMPLETE — “What You Bring”',
      labelOmbre: 'Your shadow side:',
      labelTension: 'Your inner tension:',
      fenetre: FENETRE,
      miroirNote:
        'Your mirror — the complete reading of your contribution — arrives at the next step of the journey.',
    },
    dims: [
      {
        nom: 'Your Reliability',
        sousLigne: 'what you say, and what you do',
        lecture:
          "This bar says whether your presence holds: announcing, showing up, sending news. Full: when you say you'll be there, you're there. Light: silences of a few days sometimes settle in without warning — announced, they weigh less.",
      },
      {
        nom: 'Your Repair',
        sousLigne: 'the first step after the argument',
        lecture:
          "This bar says who reaches out again after an argument: you, the other, or no one. Full: you take the first step, and the cold spell shortens. Light: you wait for the other's return — and the wait can last on both sides.",
      },
      {
        nom: 'Your Compromise',
        sousLigne: 'what works for both',
        lecture:
          "This bar says what you do when wants diverge: look for what works for both, or hold your line. Full: the common ground gets looked for early, and gets found. Light: your line is clear — the agreement sometimes waits for you to raise the other's question.",
      },
      {
        nom: 'Owning Your Mistakes',
        sousLigne: 'saying “I was wrong”, no detour',
        lecture:
          'This bar says how your faults come out: the same day and straight out, or mostly once proven. Full: the admission comes early, and the conflict shortens. Light: the admission waits for proof — it costs more once it has piled up.',
      },
      {
        nom: 'Your Active Support',
        sousLigne: "help before it's asked",
        lecture:
          "This bar says when your help arrives: before anyone asks, or on request. Full: you notice the tiredness before the word is said — and you act. Light: you help when you're asked — useful too; it's just waiting for a doorbell.",
      },
    ],
    accompagnement: {
      presence: {
        fort:
          "When you say you'll be there, you're there — and people know it. Your word checks out, and that changes a relationship. Watchpoint: reliability doesn't demand total availability — a rest that's announced beats a disappearance.",
        equilibre:
          "You hold what's essential: the big dates, the moments that count. The small news waits — and the waiting sometimes reads as distance. Your lever: a two-line message between two silences.",
        doux:
          'Disappearances of a few days happen to you, with no news. They say nothing about your heart — but the other can\'t read it alone. Your lever: announce the silence — “I\'m recharging, back Thursday”: the same distance, without the worry.',
      },
      reparation: {
        fort:
          "After an argument, you're the first to reach out. Cold spells don't last in your world — it's rare, and it saves bonds. Watchpoint: repairing fast doesn't mean swallowing everything, alone.",
        equilibre:
          'Sometimes you take the step, sometimes you wait. Then the cold rises from both sides, each convinced it\'s the other\'s turn. Your lever: a small neutral message — “can we talk about it?” — is enough to reopen the door.',
        doux:
          'After an argument, you wait for the other to come back. It\'s not coldness: it\'s often the fear of replaying the scene. Your lever: the first step in three moves — a word, a coffee, the heart of it. The three count as one step.',
      },
      compromis: {
        fort:
          'When wants diverge, you look for what works for both. Decisions get made for two in your world — it\'s reassuring. Watchpoint: compromise is not self-erasure — a clear “no” beats a resigned yes.',
        equilibre:
          'Depending on the stakes, you seek agreement or you hold your line. It\'s healthy — as long as the rule of the day gets said out loud. Your lever: say why you hold — “this is non-negotiable for me” avoids the useless clash.',
        doux:
          "When things diverge, you're often the one holding the line. Your steadiness has value — and the other can feel invited to follow rather than to choose. Your lever: first ask what works for the other, before announcing your line.",
      },
      torts: {
        fort:
          "When you're wrong, you say it straight out — the same day. An early admission costs ten times less than a proven one. Watchpoint: admitting is not doing penance — the gesture that repairs counts more than the guilt.",
        equilibre:
          'You admit it — when the facts are there, or when the moment is right. The essential arrives, later rather than sooner. Your lever: move the admission up one day — saying “I was wrong” yesterday spares today\'s demonstration.',
        doux:
          'Your faults come out mostly when they get proven. It\'s not denial: it\'s an image of yourself to protect. Your lever: separate the fact from the verdict — “I did that” is easier to say than “I was wrong”.',
      },
      soutien: {
        fort:
          "You notice the tiredness before it's said. Help arrives before the request — people feel seen in your world. Watchpoint: spotting doesn't oblige you to carry everything — the antenna needs rest too.",
        equilibre:
          'You help when you\'re asked — and your own ask arrives, clear. Help before the request stays an exercise. Your lever: offer once a week, unasked — “want me to come give you a hand?”',
        doux:
          'Help arrives when it\'s asked for, rarely before. It\'s not indifference — but the other can feel like they have to claim it. Your lever: one very simple question — “what do you need right now?” — turns waiting into attention.',
      },
    },
    conseils: [
      'Reread your card both ways: what you give, and what you receive. Both readings serve.',
      'Choose ONE dimension and one concrete gesture this week — a message between two silences beats a promise of change.',
      'What you bring shows in scenes, not adjectives — when you tell your week, tell the gestures.',
      "Keep your answers: this quest's mirror will build on them at the next step.",
    ],
    commentLire:
      "Five bars, five ways of bringing: being there, coming back, seeking agreement, admitting, helping. Each runs from 0 to 100, drawn from your answers — the fuller it is, the more frequent the described behavior is in your days. None is a grade: they draw what you put on the table, not what you're worth.",
    ombreRelationnel: {
      V1:
        'In a relationship, your shadow side can give: a partner who receives, and who ends up no longer seeing what you carry. Across the table, you stop saying when it bends. What helps: word ONE request a week, and let it land. The table is for two again when you set your own plate on it.',
      V2:
        'In a relationship, your shadow side can give: a ledger left open at all times — every gesture waits for its return. Across the table, the other feels in debt rather than invited. What helps: one gesture with no return expected, once a week. The balance gains air — and the bond stops being an addition.',
      V3:
        'In a relationship, your shadow side can give: a partner who gives more than they receive. Over time, they may take another road — in silence. What helps: one first step a day — the gesture before the request. Laying the first stone changes the mechanics, and it shows fast.',
    },
    suite: {
      titre: "The world's last setting.",
      intro:
        'Your wheel is set: what you live, what you do, what you bring. One question remains: are you ready to meet? No pressure — three questions, just to ask yourself the question.',
      questions: [
        'Your last relationship: over, fading out, or still in you?',
        'If the right person arrived tomorrow: would you have the time and the space for them?',
      ],
      cta: "See if I'm ready",
    },
  },

  '1.11': {
    titre: 'Ready to Meet?',
    sousTitre: "The world's last setting: meeting, whenever you want.",
    annonce:
      'Before opening what comes next, a pause: three questions, just for you.\nNo right answers — your answer draws your starting point.',
    briefing: {
      aQuoiCaSert: [
        'Three questions to ask yourself the question — the answer stays yours.',
        'No test, no diagnosis: three closed questions, and one exit screen.',
        'You can start over whenever you want, and change your answer later.',
        'Availability can be reread — it never freezes.',
      ],
      resultats: [
        'Your exit screen — a short text, the one for the path you chose.',
        'Nothing is frozen: you can reread and change your availability whenever you want.',
      ],
    },
    completion: {
      entete: '🧭 QUEST COMPLETE — “Ready to Meet?”',
    },
    conseils: [
      'None of the three paths is the right one — the one you pick just says where you are.',
      'Your choice stays editable at any time, and you can redo the screen whenever you like.',
      'The screen will come back after worlds 4 and 5: you can reread your availability with a rested head.',
    ],
    commentLire:
      'Here, nothing to read: no bars, no card — just a moment to set your course, and your exit screen.',
    suite: {
      titre: 'World 2 is complete',
      intro:
        'The Wheel has carried you this far. Your World Portrait will arrive with the next part of the journey — at your own pace.',
      questions: [],
      cta: 'Back to my journey',
    },
  },
};

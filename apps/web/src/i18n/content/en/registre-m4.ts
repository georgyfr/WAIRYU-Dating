/**
 * Miroir EN du registre — MONDE 4 « Ton Terrain » (quêtes 3.1 → 3.7).
 * Structure : L10n<QueteDef> par identifiant — seuls les champs AFFICHABLES
 * sont traduits. Codes, variantes, dims (clés), pôles, fonctions : côté FR,
 * jamais recopiés. Les tableaux respectent l'ORDRE et la LONGUEUR exactes
 * du FR. Apostrophe ASCII U+0027 uniquement (leçon Task 45).
 *
 * Neutralité normative absolue (doctrine M4) : 3.1 — les gens du matin, du
 * soir et l'entre-deux se valent, le badge 🌅/🦉 est un pont de conversation,
 * jamais un grade ; 3.2 — planifier et improviser, l'ordre et le libre se
 * valent ; 3.3 — sortir et rester = deux façons égales de se nourrir ; 3.4 —
 * l'argent n'est JAMAIS jugé (dépenser/épargner, calculé/spontané égaux,
 * zéro montant) ; 3.5 — table élargie et cercle étroit égaux en dignité ;
 * 3.6 — l'ancre et l'horizon égaux, des teintes d'images jamais un verdict ;
 * 3.7 — le déclaratif n'est jamais un classement (privé, réversible).
 */
import type { L10n } from '../../apply';
import type { QueteDef } from '../../../lib/quetes';

export const REGISTRE_M4: {
  '3.1'?: L10n<QueteDef>;
  '3.2'?: L10n<QueteDef>;
  '3.3'?: L10n<QueteDef>;
  '3.4'?: L10n<QueteDef>;
  '3.5'?: L10n<QueteDef>;
  '3.6'?: L10n<QueteDef>;
  '3.7'?: L10n<QueteDef>;
} = {
  '3.1': {
    titre: 'Your life rhythm',
    sousTitre: 'The terrain quest: the hour when you are fully yourself.',
    annonce:
      'There are morning people and evening people — and nobody around to say one is better. Tell us at what hour you are fully yourself.',
    briefing: {
      aQuoiCaSert: [
        'This is the terrain quest: the hour when your body and your head are most your own.',
        'Five statements about your energy: the morning, the evening, the free alarm clock, the quiet hours.',
        'No right answer — morning people and evening people are equal, here and everywhere.',
        'It gives you a card, and one more stone in your portrait.',
      ],
      resultats: [
        'Your card — your light, your shadow side and your tension right now, in a few words.',
        'A dawn or an owl badge if your hour lives at the extremes — a conversation bridge, never a grade.',
        'One more stone in your portrait — the rest of the journey feeds on it.',
      ],
    },
    cartes: {
      'CARTE-3.1-PREMIER-TRAIN': {
        nom: 'The First Train',
        lumiere:
          'Your day starts before the noise of the world: a clear head, strong hours from the moment you wake. You take the first train — and you show up as yourself. That morning time is not on loan: it belongs to you.',
        ombre:
          'Your evening closes earlier than many people\'s. The risk for two: an end of day where one is already asleep when the other arrives.',
        tension: 'to keep your strong hours, without closing the evening\'s door on someone.',
      },
      'CARTE-3.1-MAREE': {
        nom: 'The Tide Between Two Hours',
        lumiere:
          'Your rhythm votes neither morning nor evening: it slides with the days, the seasons, the people. That flexibility is a real resource — you are available where rigid clocks break down.',
        ombre:
          'Who adapts to everything sometimes ends up with no hour of their own. Your clock gladly follows other people\'s — and your own hour does not defend itself.',
        tension: 'to stay flexible, while protecting one slot that belongs to you alone.',
      },
      'CARTE-3.1-LAMPE-MINUITEME': {
        nom: 'The Midnight Lamp',
        lumiere:
          'Your energy rises when the world goes to bed: the quiet hours are your strong hours. The night gives you back to yourself — it is not a flaw, it is a clock, yours. In the evening you think better, love better, live better.',
        ombre:
          'The world\'s morning arrives early, with its schedules and its alarms — and your clock is only beginning. For two, that gap gets named early or gets endured.',
        tension: 'to live your night, without letting the couple\'s morning happen without you.',
      },
    },
    completion: {
      entete: '🏡 QUEST COMPLETE — “Your life rhythm”',
      labelOmbre: 'Your shadow side:',
      labelTension: 'Your inner tension:',
      fenetre:
        'Somewhere, someone is answering these same questions. The day your cards cross, they will have a lot to say to each other.',
      miroirNote:
        'Your mirror — the full reading of your own hour — arrives at the next step of the journey.',
    },
    dims: [
      {
        nom: 'Your own hour',
        sousLigne: 'the moment your energy is yours',
        lecture:
          'This bar says at what moment of the day you are most yourself. Full: your strong hours live in the morning. Light: they rise with the evening. Both ways are equal — the in-between too. The bar describes a clock, it grades nothing.',
      },
    ],
    accompagnement: {
      chrono: {
        fort:
          'Your day starts before the noise of the world: the first hours are your strong hours. What helps: naming your strong slot — it becomes a possible date, for you and for two.',
        equilibre:
          'Neither a firm morning nor an owned evening: your energy follows the days and the seasons. That flexibility unties blocked schedules — it too deserves a slot that belongs to you alone.',
        doux:
          'Your energy rises when the world goes to bed: the evening gives you back to yourself. It is not a flaw — it is your clock, equal to any other. Name your quiet hours: they become possible dates.',
      },
    },
    conseils: [
      'Read your card again with a rested head: your rhythm shows in ordinary weeks, not perfect ones.',
      'No hour is worth more than another: morning, in-between and evening are three equal ways of living the day.',
      'Your rhythm describes your free clock — never a discipline, never a lack.',
      'Today\'s profile can drift: the bar tells an hour, not a box forever.',
    ],
    commentLire:
      'One single bar, and it comes from YOUR answers: the hour when you are most yourself. It runs from 0 to 100 — not a grade, not a verdict. Full: your energy lives in the morning. Light: it rises with the evening. The in-between glides between the two — on the same footing. Fuller does not mean better: the three rhythms are equal.',
    ombreRelationnel: {
      'CARTE-3.1-PREMIER-TRAIN':
        'In a relationship, your shadow side can look like: an end of day where one is already asleep when the other arrives. Your evening closes earlier than many people\'s — it is your clock, not a choice against the other. What helps: naming the hour your day ends, and keeping a later shared moment when it counts.',
      'CARTE-3.1-MAREE':
        'In a relationship, your shadow side can look like: a clock that gladly follows other people\'s. By composing all the time, your own hour stops defending itself — and the other no longer knows when to find you. What helps: protecting one fixed slot that belongs only to you, and saying so around you.',
      'CARTE-3.1-LAMPE-MINUITEME':
        'In a relationship, your shadow side can look like: a morning where the world starts before your clock. For two, that gap gets named early or gets endured — and the other can live it without understanding it. What helps: saying at what hour your day truly starts, and creating your best shared moments.',
    },
    suite: {
      titre: 'The next step of your journey',
      intro:
        'You know now at what hour you are fully yourself. The next quest looks at the thread of your days. What you plan, what you improvise, the place of things at your place.',
      questions: [
        'An outing gets decided days ahead at your place — or right when it is time to go?',
        'When things pile up at your place, how does it live — and how does it get repaired?',
      ],
      cta: 'Discover your daily life',
    },
  },

  '3.2': {
    titre: 'Your daily life',
    sousTitre: 'The terrain quest: how your daily life runs, every day.',
    annonce:
      'The big things get decided together. The everyday, itself, gets lived every day. Tell us how yours runs — there is no right way.',
    briefing: {
      aQuoiCaSert: [
        'This is the terrain quest: how your days and your home run, outside the big events.',
        'Eight statements look at two things: the program of your days, the place of things at home.',
        'No right way to keep a daily life — planning or improvising, tidying or letting live: equal ways.',
        'It gives you a card, and one more stone in your portrait.',
      ],
      resultats: [
        'Your card — your light, your shadow side and your tension right now, in a few words.',
        'Your daily life — two bars: the program of your days and the place of things.',
        'One more stone in your portrait — the rest of the journey feeds on it.',
      ],
    },
    cartes: {
      'CARTE-3.2-HORLOGE': {
        nom: 'The Well-Set Dial',
        lumiere:
          'Your daily life runs on time: days named in advance, a home where each thing has its place. You make life readable — and that reliability, people feel it walking in.',
        ombre:
          'Your machine does not share itself on its own. Whoever lives with you enters a program they did not write — the empty slot gets named by two.',
        tension:
          'to keep your dial, while leaving someone the line that shifts it a little.',
      },
      'CARTE-3.2-CALEPIN': {
        nom: 'The Notebook and the Flow',
        lumiere:
          'Your outside is framed, your inside lives at its own pace: appointments written down, things where they land. Two distinct systems that work — you plan the world without watching the fridge.',
        ombre:
          'The mix puzzles: your tolerance threshold is not everyone\'s. What is not a problem at your place reads elsewhere like a signal.',
        tension:
          'to own your inner flow, while naming together what gets tolerated and what gets tidied.',
      },
      'CARTE-3.2-SANS-BUSSOLE': {
        nom: 'The Door That Follows the Wind',
        lumiere:
          'Your day follows the thread of what comes, and your home keeps its places: a calm with no program. You welcome the unexpected without letting anything overflow — a flexibility with real backbone.',
        ombre:
          'Your yes of one day discovers itself while walking. Whoever counts on you prepares twice what you decide once — the big lines ask for a word ahead.',
        tension:
          'to follow the thread, while laying two or three markers others can read.',
      },
      'CARTE-3.2-VENT': {
        nom: 'The Sail in the Wind',
        lumiere:
          'You live by the flow: days draw themselves while walking, things stay where life puts them. Your present has room — it is a whole way of living the everyday, and it defuses many storms.',
        ombre:
          'With no floor held, invisible loads pile up: the fridge, the appointment, the laundry. A floor held by two keeps the thread from forgetting them.',
        tension:
          'to keep your freedom of the thread, while holding a floor that holds for two.',
      },
      'CARTE-3.2-MAREE': {
        nom: 'The Tide of Days',
        lumiere:
          'Your daily life votes neither program nor flow: by the season, you plan or you improvise, you tidy or you let live. That ease at changing modes without paying for it is rarer than it looks.',
        ombre:
          'Your flexibility reads outside, not inside. Whoever lives with you looks for your rule of the day — your mode gets announced, it does not get guessed.',
        tension:
          'to stay flexible, while giving one word ahead about your mode of the day.',
      },
    },
    completion: {
      entete: '🏡 QUEST COMPLETE — “Your daily life”',
      labelOmbre: 'Your shadow side:',
      labelTension: 'Your inner tension:',
      fenetre:
        'Somewhere, someone is answering these same questions. The day your cards cross, they will have a lot to say to each other.',
      miroirNote:
        'Your mirror — the full reading of your daily life — arrives at the next step of the journey.',
    },
    dims: [
      {
        nom: 'Your planning',
        sousLigne: 'the program of your days',
        lecture:
          'This bar says how your schedule holds. Full: you lay down your program ahead and you can name it. Light: your days follow the thread of what comes. Both ways are equal — the bar describes a style, it grades nothing.',
      },
      {
        nom: 'Your home order',
        sousLigne: 'the place of things',
        lecture:
          'This bar says how things get tidied at your place. Full: each thing ends up finding its place. Light: things live right where they land, and it suits you. Both ways are equal — the bar describes a tolerance threshold, neither a virtue nor a flaw.',
      },
    ],
    accompagnement: {
      PLAN_D: {
        fort:
          'You like a program you can name: outings get decided early, the week reads ahead. What helps: keeping a spot for the unexpected — it visits organized people too.',
        equilibre:
          'Some weeks you lay a plan, some you follow the thread: your planning moves with life. It is your own setting — it does not have to look like anyone else\'s.',
        doux:
          'You improvise gladly: days draw themselves while walking, and the program waits. It is not a lack of organization — planning and improvising are two equal ways of living a schedule.',
      },
      ORDRE_D: {
        fort:
          'At your place, each thing ends up finding its place: the home reads at a glance. What helps: keeping tidying flexible — a home does not have to become a showcase.',
        equilibre:
          'By the season, you tidy or you let live: your tolerance threshold moves without breaking. It is your own setting — neither a standard to hold, nor a flaw to fix.',
        doux:
          'Things live right where they land, and it does not weigh on you: your tolerance threshold is wide. It is not laziness — a wide threshold is a way of working like any other.',
      },
    },
    conseils: [
      'Read your card again with a rested head: a daily life shows in ordinary weeks, not perfect ones.',
      'No style is worth more than another: planning and improvising are equal, so are order and freedom.',
      'The frictions of the everyday get named early — outings, appointments, the place of things. Said out loud, they cross better.',
      'No bar defines you: it describes your answer today, not a box forever.',
    ],
    commentLire:
      'Two bars, and they come from YOUR answers — the program of your days, the place of things at home. They run from 0 to 100 — not a grade, not a verdict. Fuller does not mean better: the two ends of each bar are equal. What they look at and what they say about you are written below — read them like a portrait, not a report card.',
    ombreRelationnel: {
      'CARTE-3.2-HORLOGE':
        'In a relationship, your shadow side can look like: a program that runs without the other in it — the empty slot gets named by two. What helps: letting one line of the plan get written together, however small.',
      'CARTE-3.2-CALEPIN':
        'In a relationship, your shadow side can look like: two systems that read each other badly — your threshold is not everyone\'s. What helps: naming together what gets tolerated and what gets tidied, before the other interprets alone.',
      'CARTE-3.2-SANS-BUSSOLE':
        'In a relationship, your shadow side can look like: a yes that discovers itself while walking — whoever counts on you sometimes prepares twice. What helps: putting a word ahead on the big lines, and keeping the rest free.',
      'CARTE-3.2-VENT':
        'In a relationship, your shadow side can look like: invisible loads piling up — the fridge, the appointment, the laundry. What helps: holding a floor with two, small and owned, so nothing essential gets forgotten.',
      'CARTE-3.2-MAREE':
        'In a relationship, your shadow side can look like: a mode of the day the other looks for without reading it. What helps: announcing your mode in three words — flexibility gains a language.',
    },
    suite: {
      titre: 'The next step of your journey',
      intro:
        'You have shown how your daily life runs — the program of your days, the place of things. The next quest looks at what happens when nothing obliges you: your free time. There too, your way of doing it is worth it.',
      questions: [
        'When nothing obliges you, what truly recharges you — the outside, your home, people?',
        'Is there one core activity that has carried you for a long time — or does everything change with your moods?',
      ],
      cta: 'Discover your free time',
    },
  },

  '3.3': {
    titre: 'Your free time',
    sousTitre: 'The terrain quest: what your free time does to your energy.',
    annonce:
      'There are people who recharge outdoors and people who recharge behind the door. Tell us about your free time — there is nothing to fix.',
    briefing: {
      aQuoiCaSert: [
        'This is the terrain quest: where your energy comes from when the week stops.',
        'Eight statements look at your free time: the recharge, the weekend, your core hobbies, their sharing.',
        'No right answer — going out and staying in are two equal ways to recharge.',
        'At the end, a card — the reflection of your way of recharging, respected as it is.',
      ],
      resultats: [
        'Your card — your light, your shadow side and your tension right now, in a few words.',
        'Your trends — your recharging mode and the core of your hobbies, in two bars.',
        'One more stone in your portrait — the rest of the journey feeds on it.',
      ],
    },
    cartes: {
      'CARTE-3.3-GRAND-AIR': {
        nom: 'The Fresh Air',
        lumiere:
          'Your energy comes from outside: after a busy week, you go out and the world fills you up. Streets, terraces, people — you come back more available than you left.',
        ombre:
          'The fresh air sometimes carries you away: whoever loves you waits behind the door of the world. One core activity as two brings your resource back home.',
        tension: 'to go recharge outside, while bringing a share of your free time back to two.',
      },
      'CARTE-3.3-ENTRE-DEUX-RIVES': {
        nom: 'The Middle Riverbank',
        lumiere:
          'Your energy comes from both banks: now the outside recharges you, now your home. You glide between modes with the weeks — a flexibility that fits your real wants.',
        ombre:
          'Your mode reads poorly from outside: whoever shares your weekends prepares two scenarios. Your mode of the week gets said in three words.',
        tension: 'to keep your two banks, while naming the one you are on this week.',
      },
      'CARTE-3.3-CHEMINEE': {
        nom: 'The Lit Fireplace',
        lumiere:
          'Your energy recharges behind your door: home gives you back to yourself, calm is your real resource. It is not a shrinking — it is a whole way of recharging, and it holds the distance.',
        ombre:
          'The cocoon sometimes closes: whoever loves you wants to go out with you. One window of outside as two opens the inside without emptying it.',
        tension: 'to recharge at home, while opening one window of outside as two.',
      },
    },
    completion: {
      entete: '🏡 QUEST COMPLETE — “Your free time”',
      labelOmbre: 'Your shadow side:',
      labelTension: 'Your inner tension:',
      fenetre:
        'Somewhere, someone is answering these same questions. The day your cards cross, they will have a lot to say to each other.',
      miroirNote:
        'Your mirror — the full reading of your free time — arrives at the next step of the journey.',
    },
    dims: [
      {
        nom: 'Your recharging mode',
        sousLigne: 'the outside or your home',
        lecture:
          'This bar says where your energy comes from when the week stops. Full: you go out and the outside fills you. Light: you recharge at home, behind your door. Both ways are equal — going out and staying in are two equal ways to recharge. The bar describes a source, it grades nothing.',
      },
      {
        nom: 'The core of your hobbies',
        sousLigne: 'the anchor and the sharing',
        lecture:
          'This bar says what carries your hobbies over time. Full: a core activity anchors you and gets lived with others. Light: your hobbies change with your moods — a way of exploring, complete in itself. Both ways are equal — the bar describes an anchor, it grades nothing.',
      },
    ],
    accompagnement: {
      mode: {
        fort:
          'The outside recharges you: after a busy week, you go out and the world fills you up. What helps: bringing a share of that time back to two — the resource circulates better when it gets told.',
        equilibre:
          'Now the outside, now your home: your mode follows your weeks. It is your own setting — it does not have to look like anyone else\'s. Saying it in three words helps the other follow you.',
        doux:
          'Your resource recharges behind your door: calm is a whole way of recharging. It is neither a lack nor a retreat — it is your home giving you back to yourself. If the outside calls you, one window open as two is enough.',
      },
      fond: {
        fort:
          'A core activity carries you: it holds over time and gets lived with others. What helps: keeping it alive — a hobby that carries feeds on wants, not on duties.',
        equilibre:
          'Your anchor floats between the core and the want of the moment: a bit of both. It is a rhythm of your own — hobbies get chosen, they do not get justified.',
        doux:
          'Your hobbies change with your moods: variety is a way of exploring, complete in itself. It is not scattering — you try, you put down, you move on. What anchors you draws itself while walking.',
      },
    },
    conseils: [
      'Read your card again with a rested head: your mode shows in ordinary weekends, not perfect ones.',
      'Going out and staying in are equal: neither is worth more, they do not feed the same thing.',
      'If two modes meet, name them early: the friction crosses better announced than guessed.',
      'Your bars come from your answers: read them like a portrait, not a report card.',
    ],
    commentLire:
      'Two bars, and they come from YOUR answers: where your energy comes from, and what carries your hobbies. They run from 0 to 100 — not a grade, not a verdict. Fuller does not mean better: the two ways of recharging are equal. What they look at and what they say about you are written below — read them like a portrait, not a report card.',
    ombreRelationnel: {
      'CARTE-3.3-GRAND-AIR':
        'In a relationship, your shadow side can look like: the outside carrying you away — and someone waiting for you to come home. What helps: bringing a share of that time back to two, or telling what the outside gave you.',
      'CARTE-3.3-ENTRE-DEUX-RIVES':
        'In a relationship, your shadow side can look like: a mode that reads poorly from outside — the other prepares two scenarios. What helps: saying your mode of the week in three words — the convention gets created by naming it.',
      'CARTE-3.3-CHEMINEE':
        'In a relationship, your shadow side can look like: a cocoon that closes — and someone proposing an outing. What helps: welcoming one window of outside as two — the inside opens without emptying.',
    },
    suite: {
      titre: 'The next step of your journey',
      intro:
        'You know now where your energy comes from when the week stops. The next step looks at money: what comes in, what goes out, and what you decide with it. There again, there is nothing to fix.',
      questions: [
        'What do you do with your free money: save it, spend it, share it?',
        'Which purchase makes you say “yes” without hesitating — and which one makes you step back?',
      ],
      cta: 'Talk about your way with money',
    },
  },

  '3.4': {
    titre: 'Your way with money',
    sousTitre: 'The quest of your terrain: the everyday of money, with no lesson.',
    annonce:
      'Money is the first thing couples argue about — and the last thing they talk about. Here, you talk about your tempo, with no lesson.',
    briefing: {
      aQuoiCaSert: [
        'This is the quest of your terrain: the everyday of money, the topic people mention last.',
        'Six statements sweep through your reflexes: the heart-strike, the night that passes, the accounts that read.',
        'No amounts, no right answer — your tempo gets declared in reflexes, not in numbers.',
        'It gives you a card, and one more stone in your portrait.',
      ],
      resultats: [
        'Your card — your light, your shadow side and your tension right now, in a few words.',
        'Your trends — your spending and your way of deciding, in two bars.',
        'One more stone in your portrait — the rest of the journey feeds on it.',
      ],
    },
    cartes: {
      'CARTE-3.4-CŒUR-QUI-PAIE': {
        nom: 'The Heart That Pays',
        lumiere:
          'Your money follows your heart: heart-strikes get lived fast, decisions happen on the spot. Money circulates and carries moments — for you, a purchase is first of all a real emotion.',
        ombre:
          'The heart pays without reading: tight month-ends wait nearby. The money argument comes when the account gets discovered after the fact.',
        tension:
          'to keep your momentum, while naming one money rule the other can read.',
      },
      'CARTE-3.4-RAISONNE': {
        nom: 'The Reasoned Collector',
        lumiere:
          'You spend with intention: wants catch you, but your purchases get compared and decided with a cool head. Your accounts read day by day — for you, spending is a choice, not a slide.',
        ombre:
          'Intention convinces and locks in: your good reasons pile up like bills, and the other walks into a rationale already written.',
        tension:
          'to own your chosen wants, while letting the other write one line of the rule.',
      },
      'CARTE-3.4-FLAIR': {
        nom: 'The Knack of the Shrewd',
        lumiere:
          'Your money sleeps soundly and your decisions happen fast: you know how to say no on the spot, and yes at the right moment. No roadmap — a knack that keeps the house light.',
        ombre:
          'Your quick no reads like a closed door: the other\'s momentum stops in front of a verdict they did not see coming.',
        tension: 'to keep your knack, while saying what your no protects.',
      },
      'CARTE-3.4-BIEN-TENUE': {
        nom: 'The Well-Kept House',
        lumiere:
          'Your money gets kept and gets read: the unspent euro sleeps soundly, purchases get compared with a cool head. Your accounts get followed day by day. Your house holds — the safety is breathed at your place.',
        ombre:
          'The frame protects and can lock in: a want purchase of the other becomes a permission request — an envelope of wants opens a door.',
        tension:
          'to keep your house, while opening an envelope where desire does not pass for a fault.',
      },
      'CARTE-3.4-SAISONS': {
        nom: 'The Tide of Months',
        lumiere:
          'Your money votes neither heart nor math. Some months you give in or you let it sleep, you compare or you decide on the spot. Your tempo follows the season — an ease rarer than it looks.',
        ombre:
          'Your tempo reads poorly: whoever shares your accounts looks for your rule of the month. It gets said in three words — it does not get guessed.',
        tension:
          'to follow your seasons, while giving one word ahead about your rule of the month.',
      },
    },
    completion: {
      entete: '🏡 QUEST COMPLETE — “Your way with money”',
      labelOmbre: 'Your shadow side:',
      labelTension: 'Your inner tension:',
      fenetre:
        'Somewhere, someone is answering these same questions. The day your cards cross, they will have a lot to say to each other.',
      miroirNote:
        'Your mirror — the full reading of your money tempo — arrives at the next step of the journey.',
    },
    dims: [
      {
        nom: 'Your spending tempo',
        sousLigne: 'the heart-strike and the sleeping money',
        lecture:
          'This bar says how your money circulates. Full: the heart-strike goes, spending is a real emotion. Light: the unspent euro sleeps soundly, wants wait for the night. Both ways are equal — the bar describes a tempo, it grades nothing.',
      },
      {
        nom: 'Your way of deciding',
        sousLigne: 'with a cool head or on the spot',
        lecture:
          'This bar says how your purchases get decided. Full: you compare, you count, your accounts read day by day. Light: you decide on the spot, with no roadmap. Both ways are equal — the bar describes a tempo, it grades nothing.',
      },
    ],
    accompagnement: {
      DEP_D: {
        fort:
          'Heart-strikes happen at your place: money carries real moments. What helps: giving one word ahead about your accounts — the momentum lands even better when it reads.',
        equilibre:
          'Some months you give in and you let the rest sleep: your spending picks its moments. It is your own setting — it does not have to look like anyone else\'s.',
        doux:
          'The unspent euro sleeps soundly: in front of a heart-strike, you let the night pass. It is not deprivation — you let it come. What helps: saying what your no protects, so it reads as a choice.',
      },
      CALC_D: {
        fort:
          'Your purchases get compared and decided with a cool head: your accounts read day by day. What helps: letting the other write one line of the rule — a good reason convinces better when it gets shared.',
        equilibre:
          'You compare when it counts and you cut on the spot the rest of the time: your deciding picks its tempo. It is your own setting — a cool head and on the spot are equal.',
        doux:
          'On the spot, with no roadmap: your decisions follow the momentum of the moment. It is not lightness — your knack cuts fast. What helps: saying in three words what your yes or your no protects.',
      },
    },
    conseils: [
      'Read your card again with a rested head: your money tempo shows in ordinary weeks, not perfect ones.',
      'Spending and saving are equal: your bar describes a tempo, not a responsibility in degrees.',
      'The money argument crosses better announced early: a money rule gets said, it does not get guessed.',
      'No tempo defines you: it describes your answer today, not a box for life.',
    ],
    commentLire:
      'Two bars, and they come from YOUR answers: your spending and your way of deciding. They run from 0 to 100 — not a grade, not a verdict. Fuller does not mean better: spending and saving are equal, so are calculated and spontaneous. What they look at and what they say about you are written below — read them like a portrait, not a report card.',
    ombreRelationnel: {
      'CARTE-3.4-CŒUR-QUI-PAIE':
        'In a relationship, your shadow side can look like: tight month-ends — and the other guessing where the shared money stands. What helps: naming one single money rule, before the next heart-strike decides alone.',
      'CARTE-3.4-RAISONNE':
        'In a relationship, your shadow side can look like: good reasons piling up — and the other walking into a rule already written. What helps: letting the other write one line of the rule, and holding it as much as yours.',
      'CARTE-3.4-FLAIR':
        'In a relationship, your shadow side can look like: a quick no — and the other\'s momentum stopping without seeing it come. What helps: saying what your no protects, while the other catches up.',
      'CARTE-3.4-BIEN-TENUE':
        'In a relationship, your shadow side can look like: a frame that protects — and a want of the other becoming a permission request. What helps: opening a wants envelope for two, where desire has its reserved spot.',
      'CARTE-3.4-SAISONS':
        'In a relationship, your shadow side can look like: a tempo that follows the months — and the other looking for your rule without finding it. What helps: giving one word ahead about your rule of the month — it gets said in a few words.',
    },
    suite: {
      titre: 'The next step of your journey',
      intro:
        'Your money tempo has spoken — with no lesson, as promised. The next step looks at the people around you: the circle you keep, the room you give others. Your terrain opens, room by room.',
      questions: [
        'Who do you call when a day goes wrong — and who calls you?',
        'Does your circle carry you or weigh on you, these last months?',
      ],
      cta: 'Look at your circle',
    },
  },

  '3.5': {
    titre: 'Your circle',
    sousTitre:
      'The terrain quest: the place your family and your friends keep in your life as two.',
    annonce:
      'Loving someone also means deciding what place family and friends will keep. Tell us yours — there is no right place.',
    briefing: {
      aQuoiCaSert: [
        'This is the terrain quest: the place your family and your friends keep in your life as two.',
        'Six statements sweep through three angles: decisions, family, friends and weekends.',
        'No right place — a wide table or a kept one-to-one: two equal ways of living your people.',
        'It gives you a card, and one more stone in your portrait.',
      ],
      resultats: [
        'Your card — your light, your shadow side and your tension right now, in a few words.',
        'Your place — one bar that says the weight of your circle, from your answers.',
        'One more stone in your portrait — the rest of the journey feeds on it.',
      ],
    },
    cartes: {
      'CARTE-3.5-TABLE-ELARGIE': {
        nom: 'The Wide Table',
        lumiere:
          'Your family and your friends hold a real place: decisions get made with them, weekends welcome the circle. Your table grows wide and you feel at home there — your circle is a net, nobody falls.',
        ombre:
          'The overflowing table assigns its chairs: whoever loves you has to earn their spot. Celebrations, Sundays and duties get negotiated early, as two.',
        tension:
          'to widen your table, while setting the chair of the person who arrives.',
      },
      'CARTE-3.5-DEUX-RIVES': {
        nom: 'The Bank of Two Camps',
        lumiere:
          'Your circle holds its place, neither more nor less: it counts and it does not crowd in. You know the value of both banks: family on one side, the couple on the other. Friends in the middle — and you building the bridge.',
        ombre:
          'The bridge takes the waves of both banks: whoever shares your life hands you the negotiations. Your rule for celebrations gets said — it does not get guessed.',
        tension:
          'to build the bridge, while saying your rule for celebrations before the wave arrives.',
      },
      'CARTE-3.5-TERRITOIRE': {
        nom: 'The Kept Ground',
        lumiere:
          'Your decisions get made between you, your weekends get reserved, family and couple each keep their territory. It is a chosen geography, not a break — your clarity is a gift.',
        ombre:
          'The ground protects and questions: the other\'s family looks for its place — it gets named, or it gets guessed badly.',
        tension:
          'to keep your ground, while naming the place others may live in.',
      },
    },
    completion: {
      entete: '🏡 QUEST COMPLETE — “Your circle”',
      labelOmbre: 'Your shadow side:',
      labelTension: 'Your inner tension:',
      fenetre:
        'Somewhere, someone is answering these same questions. The day your cards cross, they will have a lot to say to each other.',
      miroirNote:
        'Your mirror — the full reading of your place in your circle — arrives at the next step of the journey.',
    },
    dims: [
      {
        nom: 'The weight of your circle',
        sousLigne: 'the place you give it',
        lecture:
          'This bar says the place your family and your friends hold in your life as a couple. Full: your table grows wide — decisions get shared with them, weekends welcome the circle. In the middle: you build the bridge between the two banks. Light: your life as two keeps its ground, and you name it. A wide table and a narrow circle are equal: the bar describes a place, it does not grade a person. The quality of a bond is not measured by its quantity.',
      },
    ],
    accompagnement: {
      entour: {
        fort:
          'Your table grows wide: your people count in your decisions and your weekends welcome them. It is not too much — it is your way of living a circle. Your watch-out: the person who arrives earns their spot when you set it — say your dates early, as two.',
        equilibre:
          'Your circle counts without crowding in: you know the value of both banks and you build the bridge. It is a complete place, not a half-measure. Your watch-out: your rule for celebrations gets said — it does not get guessed, even when it feels obvious to you.',
        doux:
          'Your life as two keeps its ground: decisions get made between you, weekends get reserved. It is a chosen geography, not a break. Your watch-out: name the place others may live in — clarity is a gift, and it lives better said than guessed.',
      },
    },
    conseils: [
      'Read your card again with a rested head: the place of your circle shows in ordinary Sundays, not perfect celebrations.',
      'A wide table and a narrow circle are equal: quantity says nothing about the quality of the bonds.',
      'What gets said early gets lived better: your rule for celebrations, Sundays, invitations — say it before the wave arrives.',
      'No bar defines you: it describes your answer today, not a box forever.',
    ],
    commentLire:
      'One bar, and it comes from YOUR answers: the place your family and your friends hold in your life as a couple. It runs from 0 to 100 — not a grade, not a verdict. Fuller does not mean better: a wide table and a kept one-to-one are two equal ways of living a circle. What it looks at and what it says about you are written below — read it like a portrait, not a report card.',
    ombreRelationnel: {
      'CARTE-3.5-TABLE-ELARGIE':
        'In a relationship, your shadow side can look like: a table that overflows — the person sharing your life has to earn their chair. What helps: negotiating early, as two, the celebrations, the Sundays and the duties toward families.',
      'CARTE-3.5-DEUX-RIVES':
        'In a relationship, your shadow side can look like: the bridge taking the waves of both banks. Whoever shares your life hands you the negotiations. What helps: saying your rule for celebrations out loud, before the wave arrives.',
      'CARTE-3.5-TERRITOIRE':
        'In a relationship, your shadow side can look like: a ground the other\'s family tries to live in without knowing where. What helps: naming the welcomed place — it lives better said than guessed.',
    },
    suite: {
      titre: 'Your place is set.',
      intro:
        'You have said what place your family and your friends will keep. The next quest does not answer in words: eight pairs of images to pick from, and your first impulse will say the rest.',
      questions: [
        'In front of two interiors, which one calls you without your knowing why?',
        'What does the home where you see yourself on an ordinary Sunday tell?',
      ],
      cta: 'Discover “The visual choice”',
    },
  },

  '3.6': {
    titre: 'The visual choice',
    sousTitre: 'The images task: what your eye picks when nobody asks.',
    annonce:
      'No questions this time. Just images — pick the one that speaks to you. There is no right answer: your choice says something, it grades nothing.',
    briefing: {
      aQuoiCaSert: [
        'Eight pairs of images, one at a time: on each screen, you pick the one that speaks to you most.',
        'The two images are equal — neither is right, neither traps the other.',
        'No "both", no "neither": you pick one on each screen — the whole choice is what speaks.',
        'It grades nothing: your chosen images become conversation starters, not a score.',
      ],
      resultats: [
        'Your ice-breaker card — your shade of images, in a few words to share.',
        'Your starters — your chosen images turned into conversation openers.',
        'One more stone in your portrait — the rest of the journey feeds on it.',
      ],
    },
    cartes: {
      'CARTE-3.6-ANCRE': {
        nom: 'The folder of settled images',
        lumiere:
          'Your images lean toward rest: the house, the stability, the slow coffee, the scheduled Sunday. You choose places that carry you — and that make good conversation starters.',
        ombre:
          'The anchor reassures and closes in: days look alike, and someone else gets bored. The window does not change enough for someone who wants to leave.',
        tension:
          'choosing the places that carry you, while keeping one image outside for adventure.',
      },
      'CARTE-3.6-EQUILIBRE': {
        nom: 'The pouch of mixed images',
        lumiere:
          'Your images share the space: the home sometimes, the outside sometimes — the feast and the simple dinner, the tribe and the one-to-one. You move between calm and open air without losing your thread.',
        ombre:
          'Your variety reads poorly: whoever shares your weekends does not know whether you want to stay or go out. The image of your week wants to be said.',
        tension:
          'keeping your two colors, while naming the image of your week.',
      },
      'CARTE-3.6-HORIZON': {
        nom: 'The folder of open images',
        lumiere:
          'Your images lean outside: the street terrace, the feast, the group, the city that moves. You choose places where the world comes in — your conversation starters tell themselves.',
        ombre:
          'The horizon carries away and spends: the home sometimes becomes a hallway. A home shared with the world — and someone else who needs to come back in.',
        tension:
          'choosing the places where the world comes in, while keeping one image inside for the return.',
      },
    },
    completion: {
      entete: '🏡 QUEST COMPLETE — “The visual choice”',
      labelOmbre: 'Your shadow side:',
      labelTension: 'Your inner tension:',
      fenetre:
        'Somewhere, someone is answering these same questions. The day your cards cross, they will have a lot to say to each other.',
      miroirNote:
        'Your image mirror — a shade, not a diagnosis — shows up alongside the other readings of the journey.',
    },
    dims: [
      {
        nom: 'Your ground in images',
        sousLigne: 'what brings you back or what calls you',
        lecture:
          'This bar says which way your chosen images lean. Full: the anchor — the home, the ritual, what brings you back. Light: the horizon — the outside, the unplanned, what calls you. Both are equal — the bar describes a shade of images, it grades nothing.',
      },
    ],
    accompagnement: {
      VISO_ANC: {
        fort:
          'Your images lean toward rest: the home, the ritual, the slow coffee speak to you first. What helps: keeping one image outside — adventure has its place inside your walls too.',
        equilibre:
          'Your images share the space: now inside, now outside — your shade moves with the weeks. What helps: saying the image of the moment, so the other no longer has to guess.',
        doux:
          'Your images lean outside: the terrace, the market, the city that moves call you first. What helps: keeping one image inside — a place that brings you back is worth gold.',
      },
    },
    conseils: [
      'Read your card again with a rested head: your images say a shade of the moment, not a box.',
      'No choice was the right one: each image of the eight pairs was equal — nothing to catch up on.',
      'Your chosen images open ready-made conversations — tell them as they are, without translating them.',
      'The bar moves with you: if your images change one day, the reading will follow.',
    ],
    commentLire:
      'One single bar, and it comes from YOUR choices — eight pairs, eight images kept. Full: your images lean toward what brings you back. Light: they lean toward what calls you. Neither is better: they are two equal ways of living images. Read it like a shade, not a verdict.',
    ombreRelationnel: {
      'CARTE-3.6-ANCRE':
        'In a relationship, your shadow side can look like: days that look alike. And someone beside you may get bored of your beautiful stability. What helps: proposing an outing on the spur of the moment, from time to time — without turning it into a program.',
      'CARTE-3.6-EQUILIBRE':
        'In a relationship, your shadow side can look like: a profile hard to read — the other no longer knows whether you want to stay or go out. What helps: saying the image of your week — staying or moving, both get said.',
      'CARTE-3.6-HORIZON':
        'In a relationship, your shadow side can look like: a home crossed at constant speed — people pass by, head out, come home late. What helps: keeping one evening indoors, set during the week — the way back gets chosen too.',
    },
    suite: {
      titre: 'The next step of your journey',
      intro:
        'Your ground has found its images — the world is nearing its end. The last quest stays for you alone: it appears nowhere, and that is exactly what makes it true. It prepares the rest of the journey.',
      questions: [
        'What draws you to someone, without your knowing why?',
        'What you keep for yourself: do you share it one day — and with whom?',
      ],
      cta: 'Finish your terrain — just for you',
    },
  },

  '3.7': {
    titre: 'Your attractions',
    sousTitre: 'The private quest: your attractions, for you alone.',
    annonce:
      'What you declare here organizes your discoveries — without feeding any ranking.\n' +
      'Nobody sees it: it is your private compass for Invisible Mode.',
    briefing: {
      aQuoiCaSert: [
        'Five statements to choose from: you tick what attracts you — one to three options per statement.',
        'Nothing is inferred, nothing is scored: you tick words, that is all.',
        'Nobody sees your declarations — not on your profile, not anywhere.',
        'Tastes move: change your declarations whenever you want, with no follow-up questions.',
      ],
      resultats: [
        'A private screen — no card, no score, no sharing.',
        'Your declarations organize the discoveries to come — that is their only use.',
      ],
    },
    completion: {
      entete: '🧭 QUEST COMPLETE — “Your attractions”',
    },
    conseils: [
      'What you declare here shows nowhere: it is between you and the app.',
      'Attractions move: you can change your declarations whenever you want, with nothing to justify.',
      'Tick one to three options per statement: it is a matter of taste, not a ranking.',
      'All options are equal: loving the spark or the anchor is the same right — tastes, not grades.',
    ],
    commentLire:
      'There is nothing to read here: no bar, no card, no score. Your declarations stay private — they organize your discoveries, without displaying anything.',
    suite: {
      titre: 'The next step of your journey',
      intro:
        'Your attractions are set — they stay yours. The next world follows the thread of your story: your relational tree, your present, what your relationships have taught you.',
      questions: [
        'Who counts as family for you — the ones by blood, the ones by heart, or both?',
        'What have your past relationships taught you — and what do you want to keep going forward?',
      ],
      cta: 'Step into your heritage',
    },
  },
};

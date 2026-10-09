/**
 * Miroir EN du registre — MONDE 3 « La Boussole » (quêtes 2.1 → 2.8).
 * Structure : L10n<QueteDef> par identifiant — seuls les champs AFFICHABLES
 * sont traduits. Codes, variantes, dims, fonctions : côté FR, jamais recopiés.
 * Les tableaux respectent l'ORDRE et la LONGUEUR exactes du FR.
 *
 * Neutralité : 2.2 (spiritualité) — pratiquer et ne pas pratiquer = deux façons
 * égales, aucune croyance nommée ; 2.3 — cocher n'est jamais « mieux » que ne
 * pas cocher ; 2.4 — des faits, jamais des défauts ; 2.7 — trois visions de la
 * parentalité égales en dignité ; 2.8 — zéro calcul, badge de conversation.
 */
import type { L10n } from '../../apply';
import type { QueteDef } from '../../../lib/quetes';

export const REGISTRE_M3: {
  '2.1'?: L10n<QueteDef>;
  '2.2'?: L10n<QueteDef>;
  '2.3'?: L10n<QueteDef>;
  '2.4'?: L10n<QueteDef>;
  '2.5'?: L10n<QueteDef>;
  '2.6'?: L10n<QueteDef>;
  '2.7'?: L10n<QueteDef>;
  '2.8'?: L10n<QueteDef>;
} = {
  '2.1': {
    titre: 'Your values',
    sousTitre: 'The compass quest: what really guides your choices.',
    annonce:
      'Before going further, look at what you truly stand for. Answer with your first instinct: here, no choice is right or wrong.',
    briefing: {
      aQuoiCaSert: [
        'This is the compass quest: what guides your choices, and what keeps you going over time.',
        'Twenty statements sweep through your daily life: your decisions, your outings, your projects, your anchors, your place in a group, the people close to you.',
        'No right answer — only yours, the one that looks like your ordinary weeks.',
        'It gives you a card, and one more stone in your portrait.',
      ],
      resultats: [
        'Your card — your light, your shadow side and your tension right now, in a few words.',
        'Your trends — your four families of values, in four bars.',
        'One more stone in your portrait — the next steps of the journey feed on it.',
      ],
    },
    cartes: {
      'CARTE-2.1-OUV-APA': {
        nom: 'The Horizon Opener',
        lumiere:
          'You move toward what you do not know yet — and you know how to bring others there. The unknown attracts you more than it worries you; chances get seized, routines leave you free. Your independence is not an escape: it is your compass.',
        ombre:
          'When the new makes the rules, what lasts ends up waiting — and sometimes, what waits is what mattered.',
        tension: 'to go far, without letting go of what counts.',
      },
      'CARTE-2.1-OUV-TEN': {
        nom: 'The Collector of Beginnings',
        lumiere:
          'The new calls and you answer: unknown outings, chances seized on the fly, decisions you make yourself. Your life moves through beginnings — and you love that motion. Standing still, for you, looks like stepping back.',
        ombre:
          'Collecting beginnings means rarely finishing: what counts sometimes ends up waiting behind the next start.',
        tension: 'to start a lot, without leaving anything half-done.',
      },
      'CARTE-2.1-AFF-APA': {
        nom: 'The Bridge Builder',
        lumiere:
          'You aim for visible results and you know how to decide — but your success never turns into a solo show. You connect people, you build with them, you leave bridges behind you. Leading, for you, feels like organizing.',
        ombre:
          'The course is your ground — check that others walk beside you, not only behind you.',
        tension: 'to lead the game, without hogging it.',
      },
      'CARTE-2.1-AFF-TEN': {
        nom: 'The Project Magnet',
        lumiere:
          'Projects live in you and carry you: you aim, you decide, you move. Your energy goes where it can be measured. And the next goal is already waiting. You know no dead time.',
        ombre:
          'Projects sometimes outrank people: those who love you can live your goals like a waiting room with no chairs.',
        tension: 'to succeed, without it costing people.',
      },
      'CARTE-2.1-CON-APA': {
        nom: 'The Anchor Looking Elsewhere',
        lumiere:
          'Your stability is chosen, not endured. You love what gives life its rhythm — routines, landmarks, habits that hold. And when the unknown passes by, you watch it calmly: your base stands on its own.',
        ombre:
          'A base can become a seat: by holding on, you can stay put where leaving would be right.',
        tension: 'to stay grounded, without staying stuck.',
      },
      'CARTE-2.1-CON-TEN': {
        nom: 'The Watchful Rooted One',
        lumiere:
          'What lasts reassures you more than it bores you: an ordered life, landmarks kept, the heritage you do not disown. You care for what you received, and what you build feels solid.',
        ombre:
          'The frame protects — and it can close: what you hold too tightly ends up holding you.',
        tension: 'to keep what counts, without keeping it all.',
      },
      'CARTE-2.1-DEP-APA': {
        nom: 'The Heart Dispatcher',
        lumiere:
          'Caring for people, for you, is not a detour: it is the straight line. A loved one\'s request outweighs your schedule, and a very different way of living makes you seek to understand before judging. Your circle widens without emptying.',
        ombre:
          'Giving is also choosing: check that you give by desire, not by duty turned habit.',
        tension: 'to care for others, without moving in there.',
      },
      'CARTE-2.1-DEP-TEN': {
        nom: 'The Lighthouse That Forgets Itself',
        lumiere:
          'You shine wide: people come before schedules, difference does not push you back, your circle is wide and your loyalty goes far. Somewhere in you, there is someone to help at every horizon.',
        ombre:
          'The lighthouse that lights everything can forget itself: by always coming second, your own course blurs.',
        tension: 'to give a lot, without erasing yourself from the shore.',
      },
    },
    completion: {
      entete: '🧭 QUEST COMPLETE — “Your values”',
      labelOmbre: 'Your shadow side:',
      labelTension: 'Your inner tension:',
      fenetre:
        'Somewhere, someone is answering these same questions. The day your cards cross, they will have a lot to say to each other.',
      miroirNote:
        'Your mirror — the full reading of your compass — arrives at the next step of the journey.',
    },
    dims: [
      {
        nom: 'Your openness to change',
        sousLigne: 'the unknown calling you',
        lecture:
          'This bar says how the unknown speaks to you. Full: the new calls and you go. Light: you prefer what you already know. Both ways are equal — the bar describes an appetite, it grades nothing.',
      },
      {
        nom: 'Your self-assertion',
        sousLigne: 'the projects you lead',
        lecture:
          'This bar says how your projects carry you. Full: you aim, you decide, it shows. Light: you move for other reasons, less measurable. Both ways are equal — the bar describes an ambition, it grades nothing.',
      },
      {
        nom: 'Your continuity',
        sousLigne: 'the anchors you keep',
        lecture:
          'This bar says how your anchors carry you. Full: routines reassure you and traditions hold. Light: the set ways weigh on you and change wins. Both ways are equal — the bar describes a base, it grades nothing.',
      },
      {
        nom: 'Your giving beyond yourself',
        sousLigne: 'the share you give',
        lecture:
          'This bar says how much others count in your day. Full: a request for help comes before your plans. Light: your plans come first. Both ways are equal — the bar describes a place you give, it grades nothing.',
      },
    ],
    accompagnement: {
      ouverture: {
        fort:
          'The unknown calls and you go: your weeks let the new in without effort. What helps: naming what you want to keep — what lasts needs you too, and it can be said.',
        equilibre:
          'You welcome the new when it matters and keep your anchors without thinking: your openness picks its moments. It is your own setting — it does not have to look like anyone else\'s.',
        doux:
          'The known suits you: you choose what you know, and the unknown can wait. It is not fear — your comfort is a choice. If one day the new calls you, it settles in small touches.',
      },
      affirmation: {
        fort:
          'You aim, you decide, things move: your projects show and your place is felt. What helps: checking that others walk beside you — not only behind.',
        equilibre:
          'You aim at what counts and let the rest run: your energy picks its building sites. It is your own setting — neither all forward, nor held back.',
        doux:
          'Visible results do not move you much: you advance for less measurable reasons. It is not a lack of ambition — your gauge is different. Name what truly moves you forward: that is your real compass.',
      },
      conservation: {
        fort:
          'Your anchors hold: routines reassure you, traditions feel like home, the known builds you. What helps: letting the unplanned in from time to time — a base is also for leaving.',
        equilibre:
          'You keep what holds you and let the rest live: your continuity picks its rituals. It is your own setting — the frame protects, it does not cage.',
        doux:
          'Fixed anchors weigh on you more than they carry you: you adjust, you change, you do not settle. It is not instability — your balance moves. One single ritual, chosen by you: it is the one that will hold the rest.',
      },
      depassement: {
        fort:
          'Others come before your schedule: you see the request before it is spoken. What helps: keeping a spot for your own course — your day matters too.',
        equilibre:
          'You give to your people and keep your schedule: your attention picks its moments. It is your own setting — giving without forgetting yourself, holding without closing off.',
        doux:
          'Your schedule first: requests wait, and the circle stays close. It is not selfishness — your day has its reasons. One request welcomed, small and now: that is how a circle opens.',
      },
    },
    conseils: [
      'Read your card again with a rested head: your values show in ordinary days, not perfect ones.',
      'No family of values is worth more than another: the four complete each other, none grades you.',
      'When two bars pull against each other — aiming and serving, keeping and moving — name the mix you live today.',
      'No bar defines you: it describes your answer today, not a box forever.',
    ],
    commentLire:
      'Four bars, and they come from YOUR answers — four families of values, each in its own way. They run from 0 to 100 — not a grade, not a verdict. Fuller does not mean better: the four families are equal. What they look at and what they say about you are written below — read them like a portrait, not a report card.',
    ombreRelationnel: {
      'CARTE-2.1-OUV-APA':
        'In a relationship, your shadow side can look like: what lasts waiting behind the new — and the other carrying the wait without understanding it. What helps: saying out loud what you want to keep, before the next departure decides for you both.',
      'CARTE-2.1-OUV-TEN':
        'In a relationship, your shadow side can look like: a life made of beginnings — and the other rarely finishing things with you. What helps: finishing a shared project before opening another one — small, dated, done.',
      'CARTE-2.1-AFF-APA':
        'In a relationship, your shadow side can look like: a clear course the other follows without having chosen it. What helps: asking the question before the proposal — and holding the answer as much as the plan.',
      'CARTE-2.1-AFF-TEN':
        'In a relationship, your shadow side can look like: goals outranking people — those who love you wait in your waiting room. What helps: one shared hour, blocked and protected, before the next goal takes it.',
      'CARTE-2.1-CON-APA':
        'In a relationship, your shadow side can look like: a base so comfortable you stay where leaving would be right. What helps: naming what is waiting to move — and giving it a date, however small.',
      'CARTE-2.1-CON-TEN':
        'In a relationship, your shadow side can look like: a frame that protects — and what you hold too tightly ends up holding you. What helps: telling apart the ritual you defend from the one you offer to change.',
      'CARTE-2.1-DEP-APA':
        'In a relationship, your shadow side can look like: giving turned habit — an account you keep and the other never sees. What helps: making one request for yourself this week, before the bill comes out on its own.',
      'CARTE-2.1-DEP-TEN':
        'In a relationship, your shadow side can look like: a schedule filled from outside — and couple time slipped into the cracks. What helps: blocking one hour for the two of you, before the requests decide in your place.',
    },
    suite: {
      titre: 'The next step of your journey',
      intro:
        'You now know what guides you: your four families of values have spoken. The next step looks at the place you give to meaning — spiritual or not. And there too, the absence is an answer.',
      questions: [
        'What keeps you steady when nobody is watching: a promise, a habit, a conviction?',
        'Is there something bigger than you that counts in your days — or not at all?',
      ],
      cta: 'Share your spirituality — or its absence',
    },
  },

  '2.2': {
    titre: 'Your place for spirituality',
    sousTitre: 'The compass quest: the place you give to spirituality.',
    annonce:
      'There are as many ways to live spirituality as there are lives. Here, you describe yours — it is respected as it is.',
    briefing: {
      aQuoiCaSert: [
        'This is the compass quest: the place spirituality holds in your life, as you live it.',
        'Six statements describe your place: in the week, in your decisions, in a couple.',
        'No right answer — practicing or not: two equal ways of living spirituality.',
        'At the end, a card — the reflection of your place, respected as it is.',
      ],
      resultats: [
        'Your card — your light, your shadow side and your tension right now, in a few words.',
        'Your trends — your place in the week, in decisions and in a couple, in three bars.',
        'One more stone in your portrait — the next steps of the journey feed on it.',
      ],
    },
    cartes: {
      'CARTE-2.2-CLOCHES': {
        nom: 'The Bell That Marks the Days',
        lumiere:
          'Your spirituality is lived more than declared: a place in the week, a weight in decisions, a part of the couple you want to be real. You live inside an architecture of meaning, and it shows.',
        ombre:
          'Shared faith reassures but interpretation divides — entering the same place does not stop two people from seeing two landscapes.',
        tension: 'to share your place, without claiming it as a mandatory entry.',
      },
      'CARTE-2.2-FETES': {
        nom: 'The Feast of the Seasons',
        lumiere:
          'Your spirituality lives in the high moments: the celebrations that gather people, the seasons that set the pace, the inherited gestures you keep without following everything. It builds connection, not discipline.',
        ombre:
          'Celebrations bring people together and the everyday stays without a shared ritual — the feast says belonging, it does not say everything.',
        tension: 'to keep the high moments, without letting the rest of the days fall silent.',
      },
      'CARTE-2.2-CLAIRIERE': {
        nom: 'The Open Clearing',
        lumiere:
          'Spirituality holds no place in your life, and it is not a void: it is an open clearing. You look for meaning without an altar and connection without ritual — your way of living life is worth as much as any other.',
        ombre:
          'Total freedom gives fewer shared rituals — the milestones others inherit, you will invent with someone, by hand.',
        tension: 'to stay free, while accepting to build milestones together.',
      },
    },
    completion: {
      entete: '🧭 QUEST COMPLETE — “Your place for spirituality”',
      labelOmbre: 'Your shadow side:',
      labelTension: 'Your inner tension:',
      fenetre:
        'Somewhere, someone is answering these same questions. The day your cards cross, they will have a lot to say to each other.',
      miroirNote:
        'Your mirror — the full reading of your place — arrives at the next step of the journey.',
    },
    dims: [
      {
        nom: 'Your place in the week',
        sousLigne: 'the everyday or the high moments',
        lecture:
          'This bar says where your spirituality is lived. Full: in ordinary days, the week. Light: in celebrations and high moments. Both ways are equal — the bar describes a rhythm, it grades nothing.',
      },
      {
        nom: 'Your place in your choices',
        sousLigne: 'what weighs in your big decisions',
        lecture:
          'This bar says what weighs when you decide. Full: your spirituality counts in your big decisions. Light: they go ahead without it. Both ways of deciding are equal — the bar describes an inner compass, it grades nothing.',
      },
      {
        nom: 'Your place as a couple',
        sousLigne: 'sharing and passing on',
        lecture:
          'This bar says what sharing represents for you. Full: sharing and living your spirituality as a couple matters to you. Light: passing it on stays in the background — a choice you own. Both intentions are equal — the bar describes a preference, it grades nothing.',
      },
    ],
    accompagnement: {
      'pratique réelle vs culturelle': {
        fort:
          'Your place is lived in ordinary days: a moment, a gesture, a habit that holds. What helps: letting the high moments stay celebrations — they have nothing to prove.',
        equilibre:
          'Your place is shared between the everyday and the high moments: not all the time, not only celebrations. It is a rhythm of your own — it does not have to look like anyone else\'s.',
        doux:
          'Your place lives in the high moments: celebrations, seasons, inherited gestures. It is not surface — connection happens there too. If one day the everyday calls you, it settles in small touches.',
      },
      'place dans les choix de vie': {
        fort:
          'Your big decisions listen to your spirituality: it weighs in what you choose. What helps: letting it advise without deciding everything — other voices count too, and that is normal.',
        equilibre:
          'Your spirituality counts among the voices you consult: neither silent, nor the only one speaking. It is a balance — every decision stays yours.',
        doux:
          'Your big decisions go ahead without your spirituality: you decide with other compasses — reason, heart, experience. This choice is respected like any other. If one day it must weigh in, it is there.',
      },
      'transmission dans un couple': {
        fort:
          'Sharing your spirituality as a couple matters to you: it is a way of saying what is essential. What helps: offering, never imposing — a sharing that is wanted asks for nothing.',
        equilibre:
          'Passing it on counts, without being the heart of everything: you could see yourself sharing, you do not demand it. It is an open door — it will be walked through if it must.',
        doux:
          'Passing on is not your thing — and it is a whole position, not a void. A couple\'s bond builds with other cement: projects, humor, presence. What helps: saying it early, simply — it spares the other from guessing.',
      },
    },
    conseils: [
      'Read your bars again with a rested head: they describe your place today, not a box forever.',
      'No place is truer than another: yours is respected as it is.',
      'As a couple or on the way, say your place early: what counts for you gets said, it does not get guessed.',
      'Your bars come from your answers: read them like a portrait, not a report card.',
    ],
    commentLire:
      'Three bars, and they come from YOUR answers: the week, the decisions, the couple — three angles of your place. They run from 0 to 100 — not a grade, not a verdict. Fuller does not mean better: every place is respected as it is. What they look at and what they say about you are written below — read them like a portrait, not a report card.',
    ombreRelationnel: {
      'CARTE-2.2-CLOCHES':
        'In a relationship, your shadow side can look like: one roof, two outlooks — and the other person feeling expected to join. What helps: saying out loud what is shared and what is respected.',
      'CARTE-2.2-FETES':
        'In a relationship, your shadow side can look like: celebrations shared and questions faced alone. What helps: telling the other what the celebration carries — in your words, simply.',
      'CARTE-2.2-CLAIRIERE':
        'In a relationship, your shadow side can look like: fewer ready-made milestones — meaning is built by hand. What helps: choosing one shared moment per season, and keeping it.',
    },
    suite: {
      titre: 'The next step of your journey',
      intro:
        'You now know the place spirituality holds in your life — and it is respected as it is. The next step looks at what is not negotiable: your red lines, the ones no one crosses. Setting them is already saying who can walk beside you — and how.',
      questions: [
        'What in your life is not negotiable — even as a pair?',
        'Which difference seems impossible to reconcile — and which one only looks that way?',
      ],
      cta: 'Set your red lines',
    },
  },

  '2.3': {
    titre: 'Your non-negotiables',
    sousTitre: 'The compass quest: the red lines you set.',
    annonce:
      'Some things are not negotiable. Here are yours — and it is up to you to set them.',
    briefing: {
      aQuoiCaSert: [
        'This is the compass quest — the red lines you set for what gets built as a pair.',
        'Nine closed statements on one screen: you tick the ones that are deal-breakers for you.',
        'Ticking is not better than not ticking — the empty list stands on its own too.',
        'You can add a red line in your own words, in a free field — optional, never required.',
      ],
      resultats: [
        'Your card — your light and your shadow side, in a few words.',
        'Your red lines repeated word for word: the statements you ticked, and your own words if you wrote some.',
        'The stones of your portrait — what you set here weighs on all the rest of the journey.',
      ],
    },
    cartes: {
      'CARTE-2.3-A': {
        nom: 'The One Who Trusts the Unknown',
        lumiere:
          'You tick almost nothing: you leave room for surprises, and give people the chance to surprise you. Your frame gets written as you walk.',
        ombre:
          'Without stated limits, you end up enduring them before choosing them — set them before a story sets them for you.',
        tension: 'to trust, without being overrun.',
      },
      'CARTE-2.3-B': {
        nom: 'The Boundary Builder',
        lumiere:
          'You have set limits, not too many: you know where you do not negotiate, and you leave the rest to the unplanned. Your frames say who you are without closing everything.',
        ombre:
          'Watch out for boundaries used as an excuse: a line drawn to avoid the talk no longer protects, it pushes away.',
        tension: 'to hold your limits, without turning them into a shield against everything.',
      },
      'CARTE-2.3-C': {
        nom: 'The Fortress',
        lumiere:
          'You know exactly where you do not negotiate: your red lines can be counted, and they hold. Your encounters start clean, with no gray area to untangle afterwards.',
        ombre:
          'That many red lines send away more people than they keep — check that you keep a door, not a wall.',
        tension: 'to protect your life, without emptying it in advance.',
      },
    },
    completion: {
      entete: '🧭 QUEST COMPLETE — “Your non-negotiables”',
      labelOmbre: 'Your shadow side:',
      labelTension: 'Your inner tension:',
      fenetre:
        'Somewhere, someone is answering these same questions. The day your cards cross, they will have a lot to say to each other.',
      miroirNote:
        'Your mirror — the full reading of your red lines — arrives at the next step of the journey.',
    },
    dims: [
      {
        nom: 'Your red lines',
        sousLigne: 'what you do not negotiate',
        lecture:
          'This bar says how many red lines you set: full, a precise frame; light, an open frame. It measures nothing — ticking describes your limits, there is no right or wrong list. A precise frame is not a closing off, an open frame is not a flaw: both are equal, and the list can be read again anytime.',
      },
    ],
    accompagnement: {
      coches: {
        fort:
          'Your bar is full: your frame is precise, your encounters start clean, with no gray area. Your watch-out: every extra line narrows the pool of meeting — reread your list to keep a door, not a wall.',
        equilibre:
          'You have set limits, not too many: the essential protected, the rest left to the unplanned. Your watch-out: a line drawn to avoid the talk no longer protects, it pushes away — check it still serves.',
        doux:
          'You set almost nothing: your frame gets written as you walk, room is made for surprises. Your watch-out: without stated limits, you end up enduring them — set them calmly, before a story sets them for you.',
      },
    },
    conseils: [
      'A limit born of a disappointment waits a week: reread your list calmly before counting a line.',
      'Your list is not carved in stone: you reread it, you edit it, it follows you through time.',
      'A tick is neither wise nor closed off: it is your own limit, set without judgment.',
      'The empty list stands on its own too: nothing is activated, and nothing penalizes you.',
    ],
    commentLire:
      'One single bar, and it comes from YOUR ticks: the fuller it is, the more red lines you have set. It runs from 0 to 9: a descriptive marker, not a grade. The empty list is never a lack here — it is an open frame, and it stands on its own. What it looks at and what it says about you are written below — read it like a portrait, not a report card.',
    ombreRelationnel: {
      'CARTE-2.3-A':
        'In a relationship, your shadow side can look like: trade-offs postponed, limits discovered in the moment. What helps: writing your limits calmly, before life writes them for you.',
      'CARTE-2.3-B':
        'In a relationship, your shadow side can look like: boundaries used as an excuse instead of protection. What helps: rereading each line now and then, and stating the rule rather than letting it be guessed.',
      'CARTE-2.3-C':
        'In a relationship, your shadow side can look like: a smaller pool — some profiles never pass the screen, and nobody says so. What helps: keeping a door, not a wall — and checking which way it opens.',
    },
    suite: {
      titre: 'Your red lines are set.',
      intro:
        'You now know where you do not negotiate. The next quest looks at the other side of the mirror: your own realities, to declare one by one. Because a red line crosses a reality sooner or later — yours included.',
      questions: [
        'If one of your realities crossed one of your red lines, what would you choose?',
        'Among your red lines, which one has already cost you a meeting — and which one lives mostly on paper?',
      ],
      cta: 'Go to your realities',
    },
  },

  '2.4': {
    titre: 'Your realities',
    sousTitre: 'The compass quest: your life gets declared, not graded.',
    annonce:
      'Here, no answer is the right one: your life gets declared, not graded. Smoker, parent, nomad, zero sport: every reality has its place, none is judged.',
    briefing: {
      aQuoiCaSert: [
        'This is the compass quest — what you are, declared as is, crossed with everyone\'s red lines.',
        'Eight factual statements, one tap each: tobacco, alcohol, children, spirituality, food, sport, where you live, your pace.',
        'No right answer — smoker, parent, nomad, zero sport: facts, not flaws.',
        'It gives you a card, and one more stone in your portrait.',
      ],
      resultats: [
        'Your card — your light and your shadow side, in a few words.',
        'Your life profile — how many realities you have set, in a single bar.',
        'The stones of your portrait — what you discover here feeds all the rest of the journey.',
      ],
    },
    cartes: {
      'CARTE-2.4-A': {
        nom: 'The Open Book',
        lumiere:
          'You declare your life as it is: tobacco, alcohol, children, pace — everything is on the table. Those reading you know who they are writing to.',
        ombre:
          'Your facts protect both people\'s time — and they also filter without you: some step away before the first word, without telling you.',
        tension: 'to be readable, without becoming transparent.',
      },
      'CARTE-2.4-B': {
        nom: 'The Enigmatic One',
        lumiere:
          'You fill in what goes without saying and keep the rest for later: your profile says the essential, not everything. The undefined, in your life, is a choice.',
        ombre:
          'What you do not say, the other invents — rarely in your favor: the void gets filled with the reader\'s fears.',
        tension: 'to keep some mystery, without sowing doubt.',
      },
    },
    completion: {
      entete: '🧭 QUEST COMPLETE — “Your realities”',
      labelOmbre: 'Your shadow side:',
      labelTension: 'Your inner tension:',
      fenetre:
        'Somewhere, someone is answering these same questions. The day your cards cross, they will have a lot to say to each other.',
      miroirNote:
        'Your mirror — the full reading of your realities — arrives at the next step of the journey.',
    },
    dims: [
      {
        nom: 'Your life profile',
        sousLigne: 'the realities you set',
        lecture:
          'This bar says how many realities you have set: each statement filled extends it one notch. The app shows only the count of answers given — not the content, no judgment. Your realities are facts: they get crossed, they are not graded.',
      },
    ],
    accompagnement: {
      repondues: {
        fort:
          'Your eight realities are set: your profile reads without guessing, and the crossing works on the full picture. It is not a grade, it is completeness — the watch-out here: your life moves, your answers must follow. An old declaration stops describing you.',
        equilibre:
          'You set the essential and leave a few boxes open: it is a rhythm, not a lack. Each reality added makes your reading clearer — at your own pace, without having to say it all at once. The open boxes stay yours: nobody rushes you.',
        doux:
          'A few realities set, and your profile is already working: the crossing builds on what you declare, even partly. It is an honest start, not a half-done profile — each extra tap is a choice, never a duty.',
      },
    },
    conseils: [
      'A reality has changed? Change your answer the same day: the crossing works on what is true now.',
      'Your answers stay editable anytime: the profile follows your life, not the other way round.',
      'No option is the right one: smoker, parent, nomad, zero sport — facts, not flaws.',
      'A reality can stay private: it leaves the display, not the protection — your crossing keeps applying it.',
    ],
    commentLire:
      'One single bar, and it comes from YOUR answers: the fuller it is, the more realities you have set. It does not measure the value of your life: it counts what you have declared, nothing else — today\'s snapshot. What it looks at and what it says about you are written below — read it like a portrait, not a report card.',
    ombreRelationnel: {
      'CARTE-2.4-A':
        'In a relationship, your shadow side can look like: eclipses with no explanation. People step away over one fact, before the first word — and you will never know why. What helps: keeping, in the way you tell your life, some room for “it depends”.',
      'CARTE-2.4-B':
        'In a relationship, your shadow side can look like: readings invented by others. The other fills your empty boxes with their own fears — rarely in your favor. What helps: saying the essential early, keeping details for when trust is there.',
    },
    suite: {
      titre: 'The next step of your journey',
      intro:
        'Your realities are set: they work in silence, crossed with everyone\'s red lines. The next step looks at what you are looking for — and what you are looking for weighs as much as who you are.',
      questions: [
        'Which reality did you hesitate to declare — and what tipped the scale?',
        'If one reality were to filter someone for you, which would you choose — and is it already in your red lines?',
      ],
      cta: 'Discover what you are looking for',
    },
  },

  '2.5': {
    titre: 'What you are looking for',
    sousTitre: 'The compass quest: your course, said straight.',
    annonce:
      'Three questions, one course: what you are looking for gets said straight. Answer what is true today, not what makes a good impression.',
    briefing: {
      aQuoiCaSert: [
        'Three statements, one at a time: for each, you answer yes or no, nothing else.',
        'The statements talk about your course: an exclusive relationship, a meeting without a precise plan, or exclusivity set aside.',
        'There is no right answer: no intention is worth more than another.',
        'A fourth answer exists: “I am finding out” — you explore what you are looking for, without pinning it down today.',
      ],
      resultats: [
        'Your card — your declared course, its light and its shadow side, in a few words.',
        'What your answers say — the intention you show today, spelled out in full.',
        'The stones of your portrait — what you set here feeds all the rest of the journey.',
      ],
    },
    cartes: {
      'CARTE-2.5-EXPL': {
        nom: 'The Heart That Chooses',
        lumiere:
          'You are looking for an exclusive relationship, and you own it: your course reads from the start. Building as a pair, no detours — it is written.',
        ombre:
          'A course set early sometimes rushes the steps: the other inherits a pace that is not theirs.',
        tension: 'to aim true, without rushing the meeting.',
      },
      'CARTE-2.5-DECOU': {
        nom: 'The Curious One Without a Map',
        lumiere:
          'You are looking to meet someone, without a precise plan: you want to see who arrives, with no script imposed. Openness is your frame — it shows, it does not hide.',
        ombre:
          'Without a plan, someone may get attached while you explore: this cost gets named early, or gets paid later.',
        tension: 'to let things come, without leaving things hanging.',
      },
      'CARTE-2.5-LIBRE': {
        nom: 'The Honest Free Spirit',
        lumiere:
          'Exclusivity is not what you are aiming for today — and you say so. Your encounters start with no status misunderstanding, because yours is on display.',
        ombre:
          'The exclusivity you do not display, someone still hopes for: name it early, or someone pays for the blur.',
        tension: 'to live your pace, without making hearts wait.',
      },
      'CARTE-2.5-JEDECOUVRE': {
        nom: 'The Draft of You',
        lumiere:
          'You answered “I am finding out” — you do not know yet what you are looking for, and it is declared. You explore your own course while meeting people.',
        ombre:
          'Discovering without choosing is a way of not choosing: by opening every door, you end up entering nowhere.',
        tension: 'to look for your answer, without making your life wait.',
      },
    },
    completion: {
      entete: '🧭 QUEST COMPLETE — “What you are looking for”',
      labelOmbre: 'Your shadow side:',
      labelTension: 'Your inner tension:',
      fenetre:
        'Somewhere, someone is answering these same questions. The day your cards cross, they will have a lot to say to each other.',
      miroirNote:
        'Your mirror — the full reading of how you work — arrives at the next step of the journey.',
    },
    dims: [
      {
        nom: 'Your course',
        sousLigne: 'what you declare you are looking for',
        lecture:
          'This bar follows how many answers set your course, from zero to three. It does not measure the value of your intention: none is worth more than another. Your course itself is spelled out in full beside your card, dated today, editable whenever it moves.',
      },
    ],
    accompagnement: {
      cap: {
        fort:
          'You have set your course: what you are looking for reads in full, and that spares misunderstandings. Your watch-out: today\'s course does not bind a whole life — renaming it is tending the compass, not contradicting yourself.',
        equilibre:
          'Your course is half set: part of it is already said, the rest is getting clearer. It is a normal state — the compass moves when you move.',
        doux:
          'Little of your course is on display for now: it is incomplete, not wrong. The “I am finding out” answer stays open, like the others — taking your time is a normal state of searching.',
      },
    },
    conseils: [
      'Read your course again with a rested head: it describes your today, not a permanent trait.',
      'If your course has moved, update your answer: an intention gets renamed the same day.',
      'In your exchanges, say your course early and simply: the blur costs more than the clarity.',
      'No intention is worth more than another: yours counts, as long as it is honest.',
    ],
    commentLire:
      'One single bar, and it comes from your answers: it follows how many answers set your course, from zero to three. It grades neither the value nor the quality of your intention — none is worth more than another. Your course is spelled out in full beside the bar, dated today — a snapshot, not a permanent trait.',
    ombreRelationnel: {
      'CARTE-2.5-EXPL':
        'In a relationship, your shadow side can look like: a pace set in advance, where the other inherits steps they did not choose. What helps: asking for the other\'s tempo before setting the course for two.',
      'CARTE-2.5-DECOU':
        'In a relationship, your shadow side can look like: an open frame where someone gets attached while you explore. What helps: naming early what you can offer today, with no disguised promise.',
      'CARTE-2.5-LIBRE':
        'In a relationship, your shadow side can look like: a status blur, where the other hopes for more than you offer. What helps: saying the situation as it is, from the first exchanges.',
      'CARTE-2.5-JEDECOUVRE':
        'In a relationship, your shadow side can look like: a course in motion, hard to follow for whoever gets attached along the way. What helps: sharing where you are, and coming back to update it when it moves.',
    },
    suite: {
      titre: 'The next step of your journey',
      intro:
        'You now know what you are looking for — or that you are still searching for it. The next step asks for a trade-off: your time, your energy, your attention are not enough for everything. What you place first says the rest.',
      questions: [
        'If you could keep only one priority in five years, which one?',
        'What would you let go of to keep it?',
      ],
      cta: 'Split my five-year priorities',
    },
  },

  '2.6': {
    titre: 'Your priorities for the next 5 years',
    sousTitre: 'The compass quest: the trade-offs of your decade.',
    annonce:
      'One hundred points. Five horizons. Spread them the way you would like to live your next five years — not the way you would like to look.',
    briefing: {
      aQuoiCaSert: [
        'This is the compass quest: how you spread your energy for your next five years.',
        'One screen, five horizons: work, family, freedom, the base, your own projects.',
        'One hundred points to place, not one more: giving to one horizon is taking from another.',
        'You start from a blank page, with no example and no suggestion. No split is the right one: only yours counts.',
      ],
      resultats: [
        'Your card — your light and your shadow side, in a few words.',
        'Your five horizons — the share you give to each, in five bars.',
        'The stones of your portrait — what you discover here feeds all the rest of the journey.',
      ],
    },
    cartes: {
      'CARTE-2.6-GRUE': {
        nom: 'The Rising Crane',
        lumiere:
          'Your five years have a building site: you put your energy where it doubles. Work is moving, and you know it — your split reads like a crane rising, load after load.',
        ombre:
          'The rising site sometimes leaves the house without light — and the other looks for their place between two launches.',
        tension: 'to raise the crane, without emptying the house of its people.',
      },
      'CARTE-2.6-NID': {
        nom: 'The Nest Under Construction',
        lumiere:
          'Your points go to the home: making room for a child — or for the ones already here. These five years are the ones where you build the nest — a choice you own, not a retreat.',
        ombre:
          'The nest absorbs the life of those who build it — including your own share, and sometimes the couple share that is not about managing.',
        tension: 'to build the nest, without getting lost in it as the builder.',
      },
      'CARTE-2.6-MAISON': {
        nom: 'The House with Five Rooms',
        lumiere:
          'Your points do not race: you spread them wide, or you set the anchor as a base rather than a banner. Your decade runs on steadiness — a house with five rooms, each one heated.',
        ombre:
          'The well-heated house makes few drafts and few horizons — nothing explodes, nothing takes off.',
        tension: 'to keep the house, while keeping one project that outgrows the walls.',
      },
      'CARTE-2.6-COMPAS': {
        nom: 'The Compass Pointing at the Horizon',
        lumiere:
          'Your points go to the roads: leaving, moving, discovering without locking everything. These five years are the light-bag years — you prefer stories to habits, and your split says so straight.',
        ombre:
          'The road that calls sometimes leaves someone at camp — beautiful memories, but with no regular witness.',
        tension: 'to follow the horizon, while letting the other set one stage.',
      },
    },
    completion: {
      entete: '🧭 QUEST COMPLETE — “Your priorities for the next 5 years”',
      labelOmbre: 'Your shadow side:',
      labelTension: 'Your inner tension:',
      fenetre:
        'Somewhere, someone is answering these same questions. The day your cards cross, they will have a lot to say to each other.',
      miroirNote:
        'Your mirror — the full reading of how you work — arrives at the next step of the journey.',
    },
    dims: [
      {
        nom: 'Career / ambition',
        sousLigne: 'the work that moves',
        lecture:
          'This bar says the share you give to work: the training, the responsibilities, the years when it moves fast. Full: your decade is first a work site. Light: ambition waits its turn — a trade-off, never a fault.',
      },
      {
        nom: 'Family / parenthood project',
        sousLigne: 'the room made for the bond',
        lecture:
          'This bar says the share you give to family — for a child, or for the ones already here. Full: the home leads the decade, owned. Light: the room will be made later — the decade reads again.',
      },
      {
        nom: 'Freedom / adventures',
        sousLigne: 'leaving, moving, discovering',
        lecture:
          'This bar says the share you give to freedom: leaving, moving, discovering without planning everything. Full: five years with a light bag. Light: the roads wait for their season — the base goes first.',
      },
      {
        nom: 'Stability / security',
        sousLigne: 'the base that holds',
        lecture:
          'This bar says the share you give to the base: savings, housing, health, lasting routines. Full: you secure before you expand. Light: you expand first — an order, not a mistake.',
      },
      {
        nom: 'Personal projects',
        sousLigne: 'what is yours',
        lecture:
          'This bar says the share you keep for your own projects: creating, running, getting involved. Full: your personal window stays open. Light: your projects wait for a lighter year — never a closing.',
      },
    ],
    accompagnement: {
      carriere: {
        fort:
          'You put a lot of points on work: your decade has a building site, and it moves. The helpful watch-out: keep an appointment that never moves — the house needs heat too.',
        equilibre:
          'Work gets its share, without taking everything: a site moving at a human pace. Keep an eye on postponements — a horizon pushed back twice fades quietly.',
        doux:
          'Few points on work: your energy goes elsewhere, it is a trade-off. The constraint makes the information — it does not grade the choices.',
      },
      famille: {
        fort:
          'A lot of points on family: you make room — for a child, or for the ones already here. The helpful watch-out: keep a share for yourself — the home gains two whole people.',
        equilibre:
          'Family gets its share, without absorbing the rest: bond, everyday life, space. A setting that holds — say it out loud so it stays a choice.',
        doux:
          'Few points on family: the room will be made later, or differently. It is neither a delay nor a giving up — the decade reads again, and life redistributes.',
      },
      liberte: {
        fort:
          'A lot of points on freedom: leaving, moving, discovering without planning everything. The helpful watch-out: let the other set one stage of the trip — the road gains a witness.',
        equilibre:
          'Freedom gets its share, without taking everything: openings, detours, windows. Keep one window truly open — a date, a bag, a departure.',
        doux:
          'Few points on freedom: your energy is on the base or the site. The roads wait for their season — it is not a closing, it is a trade-off.',
      },
      stabilite: {
        fort:
          'A lot of points on the base: savings, housing, health, lasting routines. The helpful watch-out: a solid base carries wishes — give it one to move.',
        equilibre:
          'The base gets its share, without locking everything: you secure the essential and leave some play. Just check there is still room for the chosen unplanned.',
        doux:
          'Few points on the base: you expand first, you will secure later. It is an order, not a mistake — set one single lasting support this year.',
      },
      projets: {
        fort:
          'A lot of points for your own projects: creating, running, getting involved. The helpful watch-out: a dated window beats an intention — pick it, then protect it.',
        equilibre:
          'Your projects get their share, without monopolizing: one window open among the other horizons. It is a good decade rhythm — keep the window.',
        doux:
          'Few points for your own projects: they wait for a lighter year. It is not a closing — the smallest open window keeps the fire.',
      },
    },
    conseils: [
      'Your split is a declaration, not a contract: life will redistribute it, and the quest can be read again.',
      'Look at the axis you endowed least: it is informative, never guilty — just give it an appointment.',
      'No horizon is mature or selfish: one hundred points on family are worth one hundred points on career.',
      'Keep a trace of today\'s split: in five years, you will see what life made of it.',
    ],
    commentLire:
      'Your five bars come from your one hundred points: the share you give to one horizon, you take from the others. No bar is a grade: it states a trade-off, not a quality. What they look at and what they say about you are written below — read them like a portrait, not a report card.',
    ombreRelationnel: {
      'CARTE-2.6-GRUE':
        'In a relationship, your shadow side can look like: a calendar ruled by building sites, and the other looking for their place between two launches. What helps: keeping an appointment that never moves for work.',
      'CARTE-2.6-NID':
        'In a relationship, your shadow side can look like: a home absorbing all of life, down to the couple share that is not about managing. What helps: keeping a project of your own — the home gains two whole people.',
      'CARTE-2.6-MAISON':
        'In a relationship, your shadow side can look like: a well-heated house where nothing takes off — no explosion, no horizon. What helps: choosing a course that outgrows the year, together.',
      'CARTE-2.6-COMPAS':
        'In a relationship, your shadow side can look like: roads that call, and someone waiting at camp. What helps: letting the other set one stage of the trip — freedom gains a witness.',
    },
    suite: {
      titre: 'Your decade is declared.',
      intro:
        'You now know where your energy goes for the next five years. The next quest looks at one precise horizon: family — what you want from it, in your own way. It is a subject couples handle better early than late.',
      questions: [
        'What room would you like to make for family — for a child, or for the ones already here?',
        'Which trade-off of your decade deserves to be said out loud, early?',
      ],
      cta: 'See my vision of family',
    },
  },

  '2.7': {
    titre: 'Your vision of family',
    sousTitre: 'The compass quest: your vision of family, spelled out in full.',
    annonce:
      'Children, roles, family — the topics people avoid at the start and that end up deciding everything. Here, you set them now.',
    briefing: {
      aQuoiCaSert: [
        'This is the compass quest — what you want for your family, and where you stand today.',
        'Eight statements look at four angles: the wish for children, the project\'s timing, the split of roles, the place of extended families.',
        'No right answer — wanting a child, hesitating, not wanting one: three visions equal in dignity.',
        'It gives you a card, and one more stone in your portrait.',
      ],
      resultats: [
        'Your card — your light and your shadow side, in a few words.',
        'Your vision — four angles drawn from your answers, in four bars.',
        'The stones of your portrait — what you discover here feeds all the rest of the journey.',
      ],
    },
    cartes: {
      'CARTE-2.7-BERCEAU': {
        nom: 'The Cradle That Waits',
        lumiere:
          'Your plan for children can be seen from afar: it announces itself, it moves, it counts in the life you prepare. You ask the hard questions now — because you want the real answers, not the polite ones.',
        ombre:
          'A desire that moves sometimes pressures the other — and forced decisions rarely stay standing long.',
        tension: 'to carry your desire, without billing the other\'s hours.',
      },
      'CARTE-2.7-PORTE': {
        nom: 'The Half-Open Door',
        lumiere:
          'Your desire is a half-open door: neither launched nor closed, honestly in suspense. You answer maybe because it is true — and that beats a polite yes or a fearful no.',
        ombre:
          'The lasting maybe lets the decision drift — time rarely settles it alone, and someone ends up choosing for two.',
        tension: 'to keep your openness, while giving it a date.',
      },
      'CARTE-2.7-ROUTE': {
        nom: 'The Road for Two',
        lumiere:
          'Your plan does not go through children — a choice, not a lack. You build a whole life another way, and you want it for two, full, with no forced pause.',
        ombre:
          'The chosen road gets said late sometimes — incompatibility discovered over time costs the years already woven.',
        tension: 'to hold your road, saying it early and in full.',
      },
    },
    completion: {
      entete: '🧭 QUEST COMPLETE — “Your vision of family”',
      labelOmbre: 'Your shadow side:',
      labelTension: 'Your inner tension:',
      fenetre:
        'Somewhere, someone is answering these same questions. The day your cards cross, they will have a lot to say to each other.',
      miroirNote:
        'Your mirror — the full reading of your vision of family — arrives at the next step of the journey.',
    },
    dims: [
      {
        nom: 'Your wish for children',
        sousLigne: 'the plan you make for yourself',
        lecture:
          'This bar says the place of children in the plan you make for yourself. Full: the plan announces itself. In the middle: the wish stays open. Light: you build with no children in the plan. It looks at your intention today, not a date nor a promise. The three stances are equal: the bar measures a plan, it does not grade a person.',
      },
      {
        nom: 'Your time horizon',
        sousLigne: 'when the project gets set',
        lecture:
          'This bar says where the children project sits in your horizon. Full: you wait for the rest to be settled. Light: you call for an early start. Neither moment is the right or wrong one: the bar describes your geography, it advises nothing.',
      },
      {
        nom: 'Your split of roles',
        sousLigne: 'as a pair, with no assigned role',
        lecture:
          'This bar says how career, home and decisions are split in your life as a pair. Full: everything is negotiated together, with no assigned role. Light: each keeps their own assigned domain. Both ways of organizing are equal — the bar describes yours, it neither modernizes nor corrects it.',
      },
      {
        nom: 'The place of the extended family',
        sousLigne: 'welcomed or chosen inner circle',
        lecture:
          'This bar says the place extended families hold in your family life. Full: they have their place, welcome in the everyday. Light: life gets built first between the two of you. Neither a doctrine nor a virtue: two geographies, and a house can be built on either.',
      },
    ],
    accompagnement: {
      desir: {
        fort:
          'Children are part of the plan you make for yourself, and it shows: it is a clear parenthood plan. It is neither a duty nor a merit — it is your vision, said clearly. Your watch-out: clarity sometimes rushes — give the other time to answer too.',
        equilibre:
          'Your desire is in an open balance: neither launched at once, nor closed — an honest maybe. It belongs to you alone, and it deceives nobody. Your watch-out: with no date set, the maybe can end up deciding in your place.',
        doux:
          'Your plan builds without children, or your indecision leans that way: neither one is a lack. Your watch-out: said late, this plan costs years — say it early, in full.',
      },
      horizon: {
        fort:
          'Your children project waits for the rest to be settled: you want a base before opening the chapter. It is a way of doing, not a delay at any cost. Your watch-out: bases never quite finish — keep a spot, in your horizon, for a settled decision.',
        equilibre:
          'Your horizon is in two tones: the project sometimes waits, sometimes grows impatient. You adjust with life — it is a flexible stance, not a hesitation. Your watch-out: say where you stand, rather than letting the other guess your window.',
        doux:
          'Your project calls for an early start: you prefer to live it early rather than wait for it. It is a tempo, not a rush. Your watch-out: early does not mean without a base — a chosen tempo is still a tempo to build.',
      },
      roles: {
        fort:
          'Career and home get worked out together at your place, with no assigned role. It is a flexible way of organizing, learned week after week. Your watch-out: sharing without roles takes conversations — without them, it redraws itself.',
        equilibre:
          'Your split is in two tones: negotiated zones, assigned zones. You set it by the people and the seasons — it is common, and it can be talked about. Your watch-out: now and then, name the zones that fixed themselves.',
        doux:
          'At your place, each keeps their own assigned domain: a clear way of organizing, chosen by some families. Neither better nor worse: the bar describes your organization, it does not grade it. Your watch-out: an assigned domain is chosen, not inherited — reread yours now and then.',
      },
      famille: {
        fort:
          'The extended family has its place in your family life: their folks, your folks, the shared everyday. It is an open geography, and it feeds many houses. Your watch-out: the open door needs windows — keep spaces just for the two of you.',
        equilibre:
          'Your geography is nuanced: the extended family is welcome, the inner circle keeps its heart. It is a living balance, moving with the seasons. Your watch-out: say your nuances out loud — they live better named.',
        doux:
          'Your family life gets built first between the two of you: a chosen inner circle is a complete geography, not a closing off. Your watch-out: a chosen inner circle gains from stating its edges, early and kindly, to the extended families.',
      },
    },
    conseils: [
      'Read your card again with a rested head: a vision of family gets sharper with time, it is not voted in one evening.',
      'What is clear in you, say it early and in full — the big topics go better early than late.',
      'Desire, horizon, roles, place of families: four separate topics — there is no complete agreement, there are agreements by topic.',
      'No bar defines you: it describes your answer today, not a box forever.',
    ],
    commentLire:
      'Four bars, and they come from YOUR answers: the wish for children, the timing, the split of roles, the place of extended families. They run from 0 to 100 — not grades, not verdicts: four angles drawn today. What they look at and what they say about you are written below — read them like a portrait, not a report card.',
    ombreRelationnel: {
      'CARTE-2.7-BERCEAU':
        'In a relationship, your shadow side can look like: a desire that rushes, and forced decisions the other lives as imposed. What helps: stating your desire in full, then letting the question breathe — the other\'s blur is not a refusal.',
      'CARTE-2.7-PORTE':
        'In a relationship, your shadow side can look like: a lasting maybe that lets the decision drift — and someone choosing for two. What helps: giving yourself an inner deadline, so the blur gains a frame.',
      'CARTE-2.7-ROUTE':
        'In a relationship, your shadow side can look like: a chosen road said late — and years already woven with waiting. What helps: saying your choice as soon as it matters, in full and early.',
    },
    suite: {
      titre: 'Your vision is set.',
      intro:
        'You have set your vision of family: the desire, the timing, the roles, the place of families. One last quest remains in the world — and that one is just for fun: a sign to pick, a tone to set.',
      questions: [
        'What did your family of origin hand down to you — and what do you choose to keep from it?',
        'If nobody were there to judge, which vision of family would you choose?',
      ],
      cta: 'Discover “Your sign — the tone”',
    },
  },

  '2.8': {
    titre: 'Your sign (just for fun)',
    sousTitre: 'The fun quest — a badge for conversation.',
    annonce:
      'The zodiac says nothing about you — but it makes a great story at the table.\nPick your sign if you want to play. If not, the road goes on without asking.',
    briefing: {
      aQuoiCaSert: [
        'One tap, one badge: your sign shows on your profile and in the conversation.',
        'It is just fun — the zodiac says nothing about you, and nothing here measures anything.',
        '“I\'d rather not say” is a complete answer: no badge, no trace.',
        'The badge can be changed or removed in one tap, whenever you want.',
      ],
      resultats: [
        'Your mini badge: your sign and one light line — for conversation, nothing else.',
        'You can remove it whenever you want: the label stays yours.',
      ],
    },
    cartes: {
      'CARTE-2.8-BELIER': { nom: '♈ Aries', lumiere: 'People trust you to get things started.' },
      'CARTE-2.8-TAUREAU': { nom: '♉ Taurus', lumiere: 'People take you along for the good tables.' },
      'CARTE-2.8-GEMEAUX': { nom: '♊ Gemini', lumiere: 'Two conversations in one, and it flows.' },
      'CARTE-2.8-CANCER': { nom: '♋ Cancer', lumiere: 'People invite themselves over — and it feels like home.' },
      'CARTE-2.8-LION': { nom: '♌ Leo', lumiere: 'The stage already knows you.' },
      'CARTE-2.8-VIERGE': { nom: '♍ Virgo', lumiere: 'Your list has a sub-list.' },
      'CARTE-2.8-BALANCE': { nom: '♎ Libra', lumiere: 'You get everyone to agree — even on pizza.' },
      'CARTE-2.8-SCORPION': { nom: '♏ Scorpio', lumiere: 'Your secrets have handles.' },
      'CARTE-2.8-SAGITTAIRE': { nom: '♐ Sagittarius', lumiere: 'Your bag weighs less than your plans.' },
      'CARTE-2.8-CAPRICORNE': { nom: '♑ Capricorn', lumiere: 'Your plans have plans.' },
      'CARTE-2.8-VERSEAU': { nom: '♒ Aquarius', lumiere: 'You say yes to strange ideas.' },
      'CARTE-2.8-POISSONS': { nom: '♓ Pisces', lumiere: 'Your playlists tell whole movies.' },
      'CARTE-2.8-SILENCE': { nom: '(no badge)' },
    },
    completion: {
      entete: '🧭 QUEST COMPLETE — “Your sign (just for fun)”',
    },
    conseils: [
      'The badge can be changed or removed whenever you want — the label is yours.',
      'No test here: your sign says nothing about you.',
      'The badge lives on your profile and in the conversation: a table topic, not a verdict.',
    ],
    commentLire:
      'This quest measures nothing: it is a conversation badge, not a profile. No bar to read — your sign enters no calculation.',
    suite: {
      titre: 'The next step of your journey',
      intro:
        'Your compass is set. The next world comes down to your ground: the everyday, the pace, money, the people around you.',
      questions: [
        'In an ordinary week, who decides your pace: you, your work, other people?',
        'When money or the people around you get into your choices, how does that go at your place?',
      ],
      cta: 'Step onto your ground',
    },
  },
};

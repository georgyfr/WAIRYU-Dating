/**
 * MIROIR EN des ARCHÉTYPES — MONDE 3 (quêtes 2.1 → 2.7 ; 2.8 n'en a pas —
 * badge miniature exempté). Par variante (clés EXACTES du FR), les 6 champs
 * du gabarit fondateur : intro · devise · apportes · freines · couple ·
 * equilibre. Ton : tutoiement → « you », simple et littéral, chaleureux,
 * phrases courtes. Gabarit conservé : « Your archetype reveals… » + point de
 * vigilance · « They are not flaws — just what shows up when… » ·
 * « Keep in mind: … » · « Not because…, but because… ».
 * Neutralité : 2.2 (trois places égales, aucune croyance nommée) · 2.3
 * (aucune coche meilleure qu'une autre) · 2.4 (des faits, jamais des défauts)
 * · 2.7 (trois visions de la parentalité égales en dignité).
 */
export const ARCHES_M3: {
  [quete: string]: {
    [variante: string]: {
      intro?: string;
      devise?: string;
      apportes?: string;
      freines?: string;
      couple?: string;
      equilibre?: string;
    };
  };
} = {
  '2.1': {
    'CARTE-2.1-OUV-APA': {
      intro:
        'Your archetype reveals a person who moves toward what they do not know yet — and who knows how to bring others there. The unknown calls you without rushing you: you taste the new without burning your life into it. Your watch-out: when the new makes the rules, what lasts ends up waiting.',
      devise: 'I take life somewhere else — and people with it.',
      apportes:
        'The first times: the road never taken, the city never seen, the outing never tried. With you, life as a pair never goes stale — renewal arrives on ordinary Saturdays, not only on birthdays.',
      freines:
        'Habits that last, things to finish, people who like to stay. They are not flaws — just what shows up when the call of the new moves your attention.',
      couple:
        'You enjoy a bond that moves: fresh projects, places to discover, ideas for two. Keep in mind: the ordinary is not a fault — say it when you love it, or it becomes your quiet boredom.',
      equilibre:
        'Keeping one ritual and changing one thing in the same month — and naming both out loud. Not because the new would be better, but because a bond holds by its two engines.',
    },
    'CARTE-2.1-OUV-TEN': {
      intro:
        'Your archetype reveals a person who lives through beginnings. The new calls and you answer: unknown outings, chances seized on the fly, decisions you make yourself. Standing still, for you, looks like stepping back. Your watch-out: many beginnings end up as halves.',
      devise: 'I start a lot — and I want it to count.',
      apportes:
        'A momentum that unsticks: nothing goes stale when you are there. You walk first — others follow more reassured than if they had to decide alone.',
      freines:
        'What asks for duration, the ends of projects, the reports. They are not flaws — just what shows up when starting weighs more than finishing.',
      couple:
        'You enjoy a lively relationship, where nothing freezes and everything can be tried again. Keep in mind: the other needs to see you finish something together — one completed project reassures more than three promised.',
      equilibre:
        'Picking one beginning and giving it a dated end before opening the next. Not because moving would be a problem, but because a half-left thing weighs more than a start.',
    },
    'CARTE-2.1-AFF-APA': {
      intro:
        'Your archetype reveals a person who aims for visible results — without turning it into a solo show. You decide, you build, and you leave bridges behind you: leading, for you, feels like organizing. Your watch-out: check that others walk beside you, not only behind you.',
      devise: 'I lead to do things together — not to do them alone.',
      apportes:
        'At your place, it shows: projects land, decisions get made, weeks move forward. With you, the future gets built in the present — and nobody is left in the role of spectator.',
      freines:
        'Projects that do not land, groups with no course, hours with no output. They are not flaws — just what shows up when the visible asks for its share at every moment.',
      couple:
        'You enjoy a bond where you build: shared plans, proof, milestones. Keep in mind: the other\'s place gets negotiated, it does not get decreed — ask the question before your proposal.',
      equilibre:
        'On the next shared choice, ask your question before your proposal. Not because your course would be wrong, but because a decision that is shared holds better than a decision that is handed over.',
    },
    'CARTE-2.1-AFF-TEN': {
      intro:
        'Your archetype reveals a person who lives by projects. You aim, you decide, you move: your energy goes where it can be measured, and the next goal is already waiting. You know no dead time. Your watch-out: people can become the background of the program.',
      devise: 'I move forward — and I want my people to move with me.',
      apportes:
        'An engine that pulls: where you pass, things get decided and done. Your course protects the home from days without direction — many lives run out of breath without that.',
      freines:
        'Dead time, aimless rest, people who do not move forward. They are not flaws — just what shows up when the program carries all the value of the day.',
      couple:
        'You enjoy a bond that moves with you: shared goals, celebrated milestones. Keep in mind: those who love you are not a waiting room — the hour for two gets defended against the next goal.',
      equilibre:
        'Protecting one shared hour, blocked before the goals book it. Not because your projects count less, but because people never catch up with a program that left without them.',
    },
    'CARTE-2.1-CON-APA': {
      intro:
        'Your archetype reveals a person who chooses their stability. You love what gives life its rhythm — the routines, the landmarks, the habits that hold. And the unknown, when it passes by, finds you standing. Your watch-out: a base can become a seat.',
      devise: 'I stay grounded — by choice, not by default.',
      apportes:
        'A quiet predictability: at your place, the house breathes and appointments have a date. With you, people know where to set their feet — calm is contagious.',
      freines:
        'Departures to improvise, weeks that change shape, owned mess. They are not flaws — just what shows up when rest loves what stays in place.',
      couple:
        'You enjoy a settled bond: habits for two, appointments that hold, a house that feels anchored. Keep in mind: ask yourself now and then whether you stay by choice or by habit.',
      equilibre:
        'Welcoming one unplanned thing without filing it under mess. Not because the frame would be bad, but because a base is also for leaving.',
    },
    'CARTE-2.1-CON-TEN': {
      intro:
        'Your archetype reveals a person who cares for what they received. An ordered life, landmarks kept, a heritage not disowned: what you build feels solid. Your watch-out: what you hold too tightly ends up holding you.',
      devise: 'I keep what counts — and I know why.',
      apportes:
        'A continuity that holds: the house speaks the same language from one season to the next. The bond, at your place, has a story with no holes — you hand down ground to build on.',
      freines:
        'Spices that change the recipe, new ways of doing, dates that move. They are not flaws — just what shows up when guarding the base becomes a close guard.',
      couple:
        'You enjoy a bond where the essential stops being re-negotiated: rituals, landmarks, a story. Keep in mind: change gets negotiated better as a right than as an exception.',
      equilibre:
        'Picking one ritual you defend — and one you offer to change. Not because holding would be a problem, but because keeping everything ends up keeping nothing.',
    },
    'CARTE-2.1-DEP-APA': {
      intro:
        'Your archetype reveals a person who puts others before their schedule. Caring for people, for you, is not a detour: it is the straight line. And faced with a very different way of living, you seek to understand before judging. Your watch-out: check that you give by desire, not by duty turned habit.',
      devise: 'I see the request before it is spoken.',
      apportes:
        'At your place, difference gets welcomed before it gets judged, and your circle widens without emptying. With you, nobody needs to shout to be heard.',
      freines:
        'Schedules kept, rest claimed, requests made too late. They are not flaws — just what shows up when caring takes up all the room.',
      couple:
        'You enjoy a bond where caring for each other is the norm: needs guessed, differences welcomed. Keep in mind: an account one keeps and the other never sees comes out eventually — say your needs out loud.',
      equilibre:
        'Making one request for yourself this week — and welcoming it like the others\'. Not because others count less, but because a gift with no return becomes a debt.',
    },
    'CARTE-2.1-DEP-TEN': {
      intro:
        'Your archetype reveals a person who shines wide. People come before schedules, difference does not push you back. Your loyalty goes far: somewhere in you, there is someone to help at every horizon. Your watch-out: by always coming second, your own course blurs.',
      devise: 'I give a lot — without erasing myself from the shore.',
      apportes:
        'Your home is not a fortress: it is a door, and it opens wide. The other\'s culture, their family, their habits: all of it finds room at your place.',
      freines:
        'Your schedule for the day, your own courses, the hours with nobody to help. They are not flaws — just what shows up when everybody comes before you.',
      couple:
        'You enjoy a generous bond, open to families, friends, causes. Keep in mind: time for two slips into the cracks — one protected hour is worth every favor done.',
      equilibre:
        'Blocking one hour a week for the two of you — and keeping it like a helping appointment. Not because giving would be a problem, but because a lighthouse, too, needs a shore.',
    },
  },

  '2.2': {
    'CARTE-2.2-CLOCHES': {
      intro:
        'Your archetype reveals a person who lives in a central place. Your spirituality organizes your days, carries your decisions and gives meaning a head start. It is not a stance to hold — it is an architecture of yours. Your watch-out: sharing gets offered — it never gets claimed as a mandatory entry.',
      devise: 'My place is a center: it organizes, it carries, it welcomes.',
      apportes:
        'An architecture of meaning: your milestones hold, your center reassures without claiming. With you, a shared depth becomes possible — anchors that get lived instead of negotiated.',
      freines:
        'The conviction of having found can become a door one forgets to leave ajar. Interpretation divides, even under the same roof. They are not flaws — just what shows up when the center outweighs the welcome.',
      couple:
        'You enjoy a bond where meaning gets lived together: shared milestones, a depth that lasts. Keep in mind: living in the same place does not stop two people from seeing two landscapes — let the other name theirs.',
      equilibre:
        'Welcoming a place different from yours without correcting it. Not because your center would be too full, but because a center welcomes better than it claims.',
    },
    'CARTE-2.2-FETES': {
      intro:
        'Your archetype reveals a person who lives spirituality in the high moments. Celebrations, seasons and inherited gestures set your year: it builds connection, not discipline. Your watch-out: the other days stay without a ritual — the feast says belonging, it does not tell everything.',
      devise: 'The high moments gather me — the rest of the days breathe.',
      apportes:
        'Appointments that come ready-made: the year gains markers nobody has to invent. You build the culture of connection — around you, people find each other.',
      freines:
        'The everyday without ritual, the days when the feast has passed and the bond has to be sought. They are not flaws — just what shows up when the place gets given in seasons rather than habits.',
      couple:
        'You enjoy a marked-out year: shared celebrations, shared seasons, gestures handed down without debate. Keep in mind: the feast gathers but does not explain — say what it carries, or the other celebrates blind.',
      equilibre:
        'Giving a word to one of your celebrations: what it truly carries. Not because the feast would lack value, but because a meaning said out loud gets shared better.',
    },
    'CARTE-2.2-CLAIRIERE': {
      intro:
        'Your archetype reveals a person who keeps the place open. Nothing there is pre-mapped: you look for meaning without an altar and connection without ritual. Your way of living life is worth as much as any other. Your watch-out: fewer ready-made milestones — meaning gets built by hand.',
      devise: 'My freedom is whole — I choose my milestones.',
      apportes:
        'An openness with no program: nothing is pre-mapped, everything you live you will have chosen. You leave the other a real place — no custom to follow without understanding it.',
      freines:
        'The milestones others inherit, you will have to invent — sometimes with no example and no calendar. They are not flaws — just what shows up when freedom stays whole right up to being two.',
      couple:
        'You enjoy a bond with no imposed ritual: each milestone gets chosen, nothing gets endured. Keep in mind: the other may love ready-made anchors. One milestone chosen together, then kept, is worth an inherited ritual.',
      equilibre:
        'Choosing one milestone together per season, and keeping it. Not because your freedom would lack anything, but because a shared moment grows a clearing.',
    },
  },

  '2.3': {
    'CARTE-2.3-A': {
      intro:
        'Your archetype reveals a person who leaves room for surprises. You tick almost nothing: your frame gets written as you walk, through real encounters. You give people the chance to surprise you — and many do not dare do that. Your watch-out: limits left blurry end up being endured before being chosen.',
      devise: 'My frame gets written as I walk — I keep room for surprises.',
      apportes:
        'An openness that disarms: with no entry grid, people show up whole, without ticking boxes. You meet people before you filter them — bonds are born where a list would have shut the door.',
      freines:
        'Trade-offs postponed, limits discovered in the moment, the tests of real life. They are not flaws — just what shows up when the frame waits for life to write it in your place.',
      couple:
        'You enjoy a bond with no entry exam: the other shows up whole, without ticking boxes. Keep in mind: without stated limits, you end up enduring them before choosing them. Set them calmly, before a story sets them for you.',
      equilibre:
        'Writing one limit calmly, on paper, just for you. Not because the open frame would be a lack, but because a chosen limit protects better than an endured one.',
    },
    'CARTE-2.3-B': {
      intro:
        'Your archetype reveals a person who builds their boundaries by hand. You have set limits, not too many: the essential protected, the rest left to the unplanned. Your frames say who you are without closing everything. Your watch-out: a line drawn to avoid the talk no longer protects, it pushes away.',
      devise: 'I know where I do not negotiate — and I let the rest live.',
      apportes:
        'A rare clarity: people know where you stand, without guessing or walking on eggshells. Your limits make the rest freer — what is open at your place truly is.',
      freines:
        'Lines drawn in the heat, on the evening of a disappointment, and the boundary turned excuse. They are not flaws — just what shows up when protecting becomes a reflex before being a choice.',
      couple:
        'You enjoy a bond where the no exists on both sides, with no drama. Keep in mind: a boundary can serve as an excuse — check it still protects, instead of pushing away.',
      equilibre:
        'Rereading one red line before letting it work. Not because setting limits would be a flaw, but because a limit set calmly holds better than one set in the heat.',
    },
    'CARTE-2.3-C': {
      intro:
        'Your archetype reveals a person who knows exactly where they do not negotiate. Your red lines can be counted, and they hold: your encounters start clean, with no gray area to untangle afterwards. Your watch-out: that many lines make more people leave than they keep.',
      devise: 'My red lines can be counted, and they hold.',
      apportes:
        'A clean frame, and it shows: with you, no misunderstandings souring the weeks. Those who pass the screen know why they are there — the bond starts on clear ground.',
      freines:
        'Profiles that do not pass the screen, doors closed before seeing the room. They are not flaws — just what shows up when the grid becomes the first filter before the meeting.',
      couple:
        'You enjoy a bond that starts clean: expectations set, gray areas avoided. Keep in mind: a hard line gets lived by the other as a wall with no explanation — saying the rule softens the line.',
      equilibre:
        'Checking that you keep a door, not a wall. Not because your lines would be too many, but because the world you want to live in shrinks with every extra line.',
    },
  },

  '2.4': {
    'CARTE-2.4-A': {
      intro:
        'Your archetype reveals a person who puts everything on the table: your city, your pace, tobacco, children. Your life gets declared as is — those reading you know who they are writing to. Your watch-out: facts set too firmly end up speaking in your place.',
      devise: 'Everything is on the table: my life gets declared, not guessed.',
      apportes:
        'A clear reading: your profile says where you live, how you eat, at what pace you meet. The other arrives informed — fewer guesses, fewer misunderstandings, time protected on both sides.',
      freines:
        'The nuances that fit no box, the “it depends” a profile does not tell. They are not flaws — just what shows up when cut-and-dried facts speak louder than the rest.',
      couple:
        'You enjoy a bond that starts on clear ground: each knows which life they are walking into, nobody finds out late. Keep in mind: your facts filter without you too — some step away before the first word, without saying anything.',
      equilibre:
        'Rereading your answers as soon as your life moves — and keeping one sentence for the “it depends”. Not because your facts would be too hard, but because a living profile tells more than a form.',
    },
    'CARTE-2.4-B': {
      intro:
        'Your archetype reveals a person who chooses what they show: the essential first, the rest to come. The undefined, in your life, is a choice you own, not an oversight. Your watch-out: your empty boxes fill up on their own — the other puts their fears in them.',
      devise: 'I say the essential, and I keep the rest for when it is earned.',
      apportes:
        'A profile that makes people want to ask: your empty boxes open conversations instead of closing them. You leave the other the room to discover — step by step, at their pace as at yours.',
      freines:
        'The assumptions the other fills in for you, the fears projected into your empty boxes. They are not flaws — just what shows up when mystery speaks louder than facts.',
      couple:
        'You enjoy the gradual discovery: each date reveals one more floor, without giving everything the first evening. Keep in mind: waiting feeds curiosity, and sometimes doubt. Say the essential early enough that nobody invents in your place.',
      equilibre:
        'Setting one more reality when it becomes important for the meeting. Not because your mystery would be a problem, but because the void, left too long, fills up without you.',
    },
  },

  '2.5': {
    'CARTE-2.5-EXPL': {
      intro:
        'Your archetype reveals a person who owns their course. You know what you are looking for: building as a pair, exclusively — and you write it from the start. This clarity is not haste: it is a chosen direction. Your watch-out: a course set early sometimes rushes the steps the other would live differently.',
      devise: 'I know what I am looking for, and I say it as is.',
      apportes:
        'A readable direction: the person reading you knows where you stand, with no decoder and no guessing. Your course filters for you — what does not fit steps aside with no drama, and what fits moves faster.',
      freines:
        'The imposed tempo, the skipped step, the meeting rushed toward a course that is not yet its own. They are not flaws — just what shows up when the direction moves faster than the shared path.',
      couple:
        'You enjoy a bond with no detours: intentions said, steps owned, fidelity set as a base. Keep in mind: your course asks for room — let the other say theirs before making it their own.',
      equilibre:
        'Asking for the other\'s tempo before setting yours. Not because your course would be too strong, but because a course for two gets set with two voices.',
    },
    'CARTE-2.5-DECOU': {
      intro:
        'Your archetype reveals a person who explores without a script. You are looking to meet someone, not to follow a plan: you want to see who arrives, with no frame imposed in advance. This openness is owned, and it shows. Your watch-out: without an announced plan, someone may get attached while you are still exploring.',
      devise: 'I let things come, with no imposed script — and it shows.',
      apportes:
        'A frank openness: with you, encounters start with no casting and no checklist. You let the person surprise what no plan would have guessed — and that makes possible the stories a tight frame would rule out.',
      freines:
        'The blurry plan, the “we\'ll see”, the attachment growing on one side while the other keeps doors open. They are not flaws — just what shows up when the openness has not found its words yet.',
      couple:
        'You enjoy a bond that keeps some air: room for the unplanned, the right not to frame everything. Keep in mind: openness gets tended out loud. The frame you do not name, the other ends up guessing — often wrong.',
      equilibre:
        'Naming early what you can offer today, with no disguised promise. Not because your exploring would be a problem, but because a blur named early spares badly-set attachments.',
    },
    'CARTE-2.5-LIBRE': {
      intro:
        'Your archetype reveals a person who displays their pace. Exclusivity is not what you are aiming for today — and you say so, with no detour and no false promise. This honesty changes how stories start. Your watch-out: the freedom you set, someone may keep hoping for anyway.',
      devise: 'My pace gets said before hearts get attached.',
      apportes:
        'A start with no misunderstanding: the person reading you knows the status upfront, and chooses with full knowledge. Your frankness about what you do not offer makes what you offer credible.',
      freines:
        'The hope that lingers, the status read between the lines, the person who believes the frame will change if they wait. They are not flaws — just what shows up when clarity waits to be repeated.',
      couple:
        'You enjoy a relationship where everything gets said: expectations, limits, each person\'s pace. Keep in mind: your freedom has a named cost — someone may get attached while you live your pace. Name it early, and name it again when it changes.',
      equilibre:
        'Repeating the frame at the steps where it counts: first dates, first attachments. Not because the other would be slow to understand, but because an intention gets confirmed by being said again.',
    },
    'CARTE-2.5-JEDECOUVRE': {
      intro:
        'Your archetype reveals a person in the middle of writing themselves. You do not pretend to be done knowing what you are looking for. Your course is a draft — a state you own, not a flaw. Your watch-out: opening every door can end up standing in for an answer.',
      devise: 'I explore my course while I meet people.',
      apportes:
        'An honesty in motion: with you, nobody buys a frozen version of you. You move forward while saying so — and that frees the other to explore theirs without playing a role.',
      freines:
        'The successive versions, the redrawn course, the patience it asks of whoever waits for you. They are not flaws — just what shows up when the draft is slow to find its ink.',
      couple:
        'You enjoy a bond that grants the right to change: what you are looking for can be written by several hands. Keep in mind: even an answer in progress gets shared. Say the page you are on, not just the whole draft.',
      equilibre:
        'Rereading your course at a fixed date — a month, a season — and renaming it as soon as it moves. Not because your draft would need correcting, but because an intention reread stays an intention that tells the truth.',
    },
  },

  '2.6': {
    'CARTE-2.6-GRUE': {
      intro:
        'Your archetype reveals a person with a building site for their decade. You are one of those who put their energy where it doubles: work is moving, and you know it. Your split reads like a crane rising, load after load. Your watch-out: the rising site sometimes leaves the house without light.',
      devise: 'I put my points where they double: my building site moves.',
      apportes:
        'A named horizon: the house moves toward something visible, and the other can read the course. Your decade declaration makes plans readable — people can lean on them or debate them, but nobody guesses in the fog.',
      freines:
        'The detours, the unplanned, the missing seat when the site overflows. They are not flaws — just what shows up when energy runs on launches.',
      couple:
        'You enjoy a bond that moves toward something: named projects, milestones crossed together. Keep in mind: the friction between your site and a home-led decade is documented in the first five years — it goes better said early than late.',
      equilibre:
        'Keeping a weekly appointment that never moves for work. Not because the site would be bad, but because success tells better for two than solo.',
    },
    'CARTE-2.6-NID': {
      intro:
        'Your archetype reveals a person building a nest. You are one of those who make room — for a child, or for the ones already here. A choice you own, not a retreat: the home is your decade site. Your watch-out: the nest absorbs, including your own share.',
      devise: 'I make room: that is where lives grow.',
      apportes:
        'Anchors that change lives: a nest, rituals, people growing inside it. The room you give often comes back multiplied — around you, people know there is room.',
      freines:
        'The evenings of managing, your own share on standby, the exhaustion that arrives late and without warning. They are not flaws — just what shows up when the home absorbs everything else.',
      couple:
        'You enjoy a bond that builds the everyday: shared trade-offs, a life settled together. Keep in mind: the other can become a teammate before being the chosen person — keep a share that is not about managing.',
      equilibre:
        'Keeping a project of your own, alive and dated. Not because the home would lack anything, but because the home gains two whole people.',
    },
    'CARTE-2.6-MAISON': {
      intro:
        'Your archetype reveals a person who keeps the house with five rooms. You are one of those who spread without racing — or who set the base without making it a banner. Your decade runs on steadiness: each room is heated. Your watch-out: nothing explodes, but nothing takes off.',
      devise: 'I build by holding: my decade runs on duration.',
      apportes:
        'A rare steadiness: nothing overflows at your place, and everything breathes. People lean on your split like on a base — it holds the years, even loaded ones.',
      freines:
        'Courses spoken out loud, the boldness that asks for overflow, the sites that rise. They are not flaws — just what shows up when balance also guards against drafts.',
      couple:
        'You enjoy a steady bond, a life that whistles no alarm. Keep in mind: the other can adjust to a plan that keeps its distance from boldness — a horizon that outgrows the year gives the house a course.',
      equilibre:
        'Choosing a horizon that outgrows the year, and giving it a real window. Not because the steadiness would fall short, but because the balance gains a course that lifts it.',
    },
    'CARTE-2.6-COMPAS': {
      intro:
        'Your archetype reveals a person pointing at the horizon. You are one of those who prefer stories to habits: leaving, moving, discovering without locking everything. These five years are the light-bag years. Your watch-out: the road that calls sometimes leaves someone at camp.',
      devise: 'I travel light: stories weigh less than habits.',
      apportes:
        'A life full of stories: with you, nobody gets bored on the road. You make movement desirable — and the years gain views no plan would have offered.',
      freines:
        'The agendas set, the projects postponed, the witnesses missing from the beautiful memories. They are not flaws — just what shows up when the bag rarely gets set down.',
      couple:
        'You enjoy a bond that travels: shared stages, common stories. Keep in mind: parallel agendas settle in often before anyone names them — let the other set one stage of the trip.',
      equilibre:
        'Letting the other choose one stage, and living it at their pace. Not because your freedom would be a problem, but because a witness makes roads bigger.',
    },
  },

  '2.7': {
    'CARTE-2.7-BERCEAU': {
      intro:
        'Your archetype reveals a person with a plan. You are one of those who announce children as a chosen chapter — not as a distant hypothesis. You ask the hard questions now, for the real answers. Your watch-out: a clear desire sometimes rushes the one who has not finished answering.',
      devise: 'I know what I want: my plan announces itself, in full.',
      apportes:
        'A clear direction: with you, the big questions get asked early and said frankly. You make blur impossible — and many breathe in front of a clarity that does not judge. You offer a course, not a constraint.',
      freines:
        'The answers that take time, the maybes of others, the horizons that do not cross. They are not flaws — just what shows up when a clear course meets a still-open question.',
      couple:
        'You enjoy a bond where the shared plan gets said early: children, home, pace — set frankly. Keep in mind: your clarity moves fast — give the other a horizon to breathe; a forced answer does not stay standing.',
      equilibre:
        'Stating your desire in full, then letting the question breathe. Not because your course would be too strong, but because a decision lived together holds better than a rushed one.',
    },
    'CARTE-2.7-PORTE': {
      intro:
        'Your archetype reveals a person at an open balance. You are one of those who answer “maybe” because it is true — neither a yes of circumstance, nor a no of fear. Your watch-out: with no date set, the maybe can end up choosing in your place.',
      devise: 'My maybe is honest — it deceives nobody.',
      apportes:
        'A sincere openness: you let the big questions ripen instead of cutting them under pressure. With you, people can change their mind without justifying themselves — it is rare, and it frees speech.',
      freines:
        'The decisions that wait, the blurry deadlines, time settling it alone. They are not flaws — just what shows up when the openness lasts without ever booking a date.',
      couple:
        'You enjoy a bond that respects your maturing times: there, one can say “I do not know yet” without drama. Keep in mind: someone will end up carrying the decision — give it a frame before it gives itself out of tiredness.',
      equilibre:
        'Giving yourself an inner deadline, however soft. Not because your openness would be a weakness, but because a dated maybe stays a choice — not an abandonment of decision.',
    },
    'CARTE-2.7-ROUTE': {
      intro:
        'Your archetype reveals a person who has chosen their road. You are one of those who build a whole life without going through children — a choice, not a lack. Your watch-out: a chosen road gets said late sometimes, when the years have already woven.',
      devise: 'My road is chosen — it stands on its own.',
      apportes:
        'A life owned: you know where you are going, and you do not wait for life to decide for you. Your frankness on the big questions makes others honest — with you, nobody plays.',
      freines:
        'The attachments that hit the same question, the opposite desires said late. They are not flaws — just what shows up when a clear choice meets a different course.',
      couple:
        'You enjoy a bond that wants the same road: a full life for two, with no forced pause. Keep in mind: say your road early — a question that big, said late, costs the years already woven.',
      equilibre:
        'Saying your road as soon as it matters, in full. Not because your choice should justify itself, but because said early, it leaves room for the real encounters.',
    },
  },
};

/**
 * MIROIR EN des ARCHÉTYPES — MONDE 2 (quêtes 1.4 · 1.5 · 1.6 · 1.9 · 1.10 —
 * 1.7 et 1.11 n'ont AUCUNE carte : registres vides côté FR).
 * Par variante (V1, V2… — clés EXACTES du FR), les 6 champs du gabarit
 * fondateur : intro · devise · apportes · freines · couple · equilibre.
 * Ton : tutoiement → « you », simple et littéral, chaleureux, phrases courtes.
 * Les noms de cartes restent côté FR (registre) : ce fichier ne porte que
 * les 6 champs du gabarit.
 */
export const ARCHES_M2: {
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
  '1.4': {
    V1: {
      intro:
        "Your archetype reveals a person who keeps what they decide. You're one of those who turn a decision into a fact: the limit holds, the promise checks out. It's not military discipline — it's a trust you grant yourself, day after day. Your watchpoint: on the day you slip, you can judge yourself without mercy.",
      devise: 'I decide for real: what I choose, holds.',
      apportes:
        'Simple ground: your word checks out, your yes is reliable, your no is solid. Others can rest their plans on yours — without watching, without guessing. This quiet reliability puts them at ease.',
      freines:
        "The unexpected that overflows the plan, the emotion with no dated reason, the disorder nobody planned. These aren't flaws — just what shows up when the solid meets what fits no plan.",
      couple:
        "You enjoy a bond that lasts: clear agreements, shared habits, an essential that doesn't move. Something to keep in mind: your reliability builds ground — watch that it doesn't become a ceiling.",
      equilibre:
        "Let one unexpected thing in without putting it back in line. Not because the plan would be bad, but because a life is also shared where there's nothing to fix.",
    },
    V2: {
      intro:
        "Your archetype reveals a person who knows how to prioritize. You're one of those who keep the essential standing and let the rest negotiate. Your control is not an armor: it's a hierarchy. Your watchpoint: the border between flexible and tired sometimes blurs.",
      devise: "I hold what counts, and I let go of what doesn't.",
      apportes:
        'Steadiness where it counts: what doesn\'t move in you is reliable for everyone. You offer tuning, not rigidity — the essential protected, the rest breathable.',
      freines:
        'Promises pushed to “next time”, the days when the thread snaps under tension. These aren\'t flaws — just what shows up when the balance gets tuned alone, with no witness.',
      couple:
        "You enjoy a relationship where the essential is no longer debated, and the rest has room. Something to keep in mind: your commitments can split in two — solid in public, flexible in private. Say the rule of the day instead of letting it be guessed.",
      equilibre:
        "Check which side you're on — flexible or tired — before giving up a limit. Not because letting go would be wrong, but because a clear border also protects your flexibility.",
    },
    V3: {
      intro:
        "Your archetype reveals a person who starts over. You're one of those whose resolutions are sincere — and whose relapses are too. You adjust, you try again, you start again: a life that prefers trying to guilt. Your watchpoint: the “this is the last time” loses its meaning from repeating itself.",
      devise: 'I move by sincere attempts — I miss, I adjust, I start again.',
      apportes:
        "A living spirit: you try, you miss, you try again — and you make change less scary for everyone. Your tolerance for failure takes the drama out of theirs.",
      freines:
        "Promises that expire on the first Monday, rituals that never settle in. These aren't flaws — just what shows up when the change matters more than the method that would carry it.",
      couple:
        'You enjoy a bond that lets you try again without grading you: the right to try, the right to err. Something to keep in mind: the other can run out of breath believing the “last times”. A repeated marker reassures more than one big night.',
      equilibre:
        "Pick a ritual rather than a promise. Not because you'd lack willpower, but because a repeated marker holds better than a heroic decision.",
    },
    V4: {
      intro:
        'Your archetype reveals a person of good faith. You\'re one of those whose intentions are there — it\'s the thread between the intention and the drive that breaks. You live it with humor, sometimes with weariness. Your watchpoint: “I\'m just like that” can become a story you tell yourself.',
      devise: 'I believe in myself for longer than a Monday.',
      apportes:
        'A sincere presence, with no calculation: your wants show, your pardons come fast. You make life lighter around you — and failure less taboo.',
      freines:
        "Far-off goals, close pleasures, Mondays with no witness. These aren't flaws — just what shows up when the thread between the intention and the drive breaks again.",
      couple:
        'You enjoy shared spontaneity: living days, a bond with no managing. Something to keep in mind: your restarts show for two — a planned quit that slides, and the other one waiting. One promise at a time: small, kept, then the next.',
      equilibre:
        'One single promise in progress at a time — small, dated, finished. Not because your wants count less, but because each one kept rebuilds the trust you grant yourself.',
    },
    V5: {
      intro:
        "Your archetype reveals a person who lives in the present tense. You're one of those who answer the craving when it arrives — sincerely, without calculation, without pretense. It's a whole way of existing. Your watchpoint: what you truly want — truly — sometimes asks for a delay.",
      devise: 'The craving arrives, I answer — no calculation.',
      apportes:
        "An aliveness that makes days inhabited: you're there, all of you, for what happens. With you, simple moments become lived moments.",
      freines:
        "Delays, accounts to settle, dated promises. These aren't flaws — just what shows up when the present carries the whole weight of the decision.",
      couple:
        "You enjoy spontaneity for two: wants that get said, days that improvise. Something to keep in mind: the other needs kept dates to lean on. The wear on your word shows around you first, not in you.",
      equilibre:
        "Give what you truly want the delay it asks for. Not because the present would be a problem, but because what waits sometimes grows bigger.",
    },
  },

  '1.5': {
    V1: {
      intro:
        "Your archetype reveals a person who takes life at the moment it reaches out its hand. You're one of those who pick right away: the money touched tonight, the warm dinner, the meeting without delay. Your present welcomes, and it shows from the first conversation. Your watchpoint: repeated, the right-now leaves work sites open. Plans without shape or guardrails — and someone still waiting for the promised plan.",
      devise: 'I take life when it shows up, not later.',
      apportes:
        'Spontaneity, a presence that\'s easy to read, days that move. With you, a want gets said and lived straight out — people know where your hand stands.',
      freines:
        'Long delays, files that drag, promises of “later”. These aren\'t flaws — just what weighs when everything gets decided on the spot.',
      couple:
        'You make weeks feel alive: an outing decided, a dinner improvised, direct affection. Something to keep in mind: for two, some things ask for a plan — the conversation pushed to the next evening, the savings postponed. Naming what waits defuses almost everything.',
      equilibre:
        "Keep one decision a week made cold. Not because picking would be a problem, but because a choice made in full knowledge holds up better the next day.",
    },
    V2: {
      intro:
        "Your archetype reveals a person whose momentum chooses fast and strong. You're one of those who start early: the beautiful meeting this weekend, the apartment signed without delay. You waited once or twice — when the stakes spoke loudly to you. Your watchpoint: the wave sometimes carries hot-headed decisions, reread cold the month after.",
      devise: 'I jump in fast, and I see what happens.',
      apportes:
        'Beginnings. You launch the stories, you dare the first step, you commit where others leave things waiting — and launching things counts.',
      freines:
        "Imposed delays, decisions that must weigh everything, courses that change under your feet. These aren't flaws — just what jams when the momentum loses the lead.",
      couple:
        'With you, stories start early — it reassures those who like it when things move. Something to keep in mind: deciding fast sometimes commits the other to a course that changes within a week.',
      equilibre:
        'Add one night when someone else comes aboard. Not because your momentum would be fake, but because a shared decision runs on two tempos.',
    },
    V3: {
      intro:
        "Your archetype reveals a person who walks the wire between picking and waiting. You're one of those who read each piece: one choice for tonight, one choice for week six. Your tempo gets set case by case, not on principle — that's your signature. Your watchpoint: your tempo moves with the mood of the day, and the other can't guess it.",
      devise: 'I read each situation, and I choose its tempo.',
      apportes:
        'A fine reading of situations: you have no doctrine, you adapt the pace to each piece. That flexibility, for two, reassures more than it shows.',
      freines:
        "Rigid frames, frozen schedules, people who want one single rule. These aren't flaws — just what jams when your hand wants to stay free.",
      couple:
        "You know how to wait when it's worth it, and to pick when the opening comes. Something to keep in mind: the other asks a simple question and gets an answer that depends on the day. Say your tempo out loud — balance is shared.",
      equilibre:
        'Say where you stand before being asked. Not because your wire would be shaky, but because a tempo said out loud gets walked by two.',
    },
    V4: {
      intro:
        "Your archetype reveals a person who waits for the season to be right. You're one of those who calibrate: the sum that doubles, the person read better, the story that settles in. Your patience isn't fleeing — it aims, and it shows in the end. Your watchpoint: waited on too long, some windows close before the decision.",
      devise: 'I let things ripen, and I aim true.',
      apportes:
        'Precision: you choose little, but you choose well. Your waiting calibrates — in your world, people feel chosen, not just taken.',
      freines:
        "Imposed urgency, chances to grab without thinking, decisions in a rush. These aren't flaws — just what grates when your hand wants to understand first.",
      couple:
        'You offer a presence that aims true: what starts in your world had good reasons to start. Something to keep in mind: the other may wait for proof that your hand\'s risk is worth taking.',
      equilibre:
        'Keep one door a month where you walk in without reading the label. Not because your patience would be fake, but because the unexpected also holds good surprises.',
    },
    V5: {
      intro:
        'Your archetype reveals a person who knows what they want — and who accepts the delay that comes with it. You\'re one of those who wait when it\'s needed: with you, time can be read, it doesn\'t surprise, and that builds something solid. Your watchpoint: some wants expire in the cellar — waiting pushed to the extreme turns chances into “what ifs”.',
      devise: 'I know how to wait — what I want deserves the delay.',
      apportes:
        "A rare steadiness: a clear time frame, promises that ripen, a presence that doesn't change course overnight.",
      freines:
        "Imposed immediacy, decisions taken in the heat, people who want everything right now. These aren't flaws — just what rubs when your own time stays set.",
      couple:
        'By your side, time can be read: no course that flips, no surprise that wounds. Something to keep in mind: the other waits for their share of now — a repeated “later” can be lived as a “not you”.',
      equilibre:
        'Name one pleasure “for now” each week. Not because waiting would be a rule to break, but because it keeps its taste when it isn\'t total.',
    },
  },

  '1.6': {
    V1: {
      intro:
        "Your archetype reveals a person who takes problems apart piece by piece, and whose answers hold up. You're one of those who build their opinion instead of receiving it — in your world, thinking isn't doubting, it's building. Your watchpoint: some things — people, wants, love — are felt first and understood after, not the other way around.",
      devise: 'I take apart before deciding, and what I say holds up.',
      apportes:
        "Solid decisions, clear arguments, a verified word. When you speak up, others know it's built — and they lean on it without saying so.",
      freines:
        "Improvisation, answers expected on the spot, people who decide by gut. These aren't flaws — just what jams when everything must go through the teardown before it exists.",
      couple:
        'You bring a deep reliability: the big decisions for two hold, because you weighed them. Something to keep in mind: facing a partner who thinks in feelings, your reasons can sound like an exam — the same care can be said as an open question.',
      equilibre:
        'Welcome the feeling without putting it through the exam. Not because checking would be wrong, but because some truths arrive before their proofs — and they count just as much.',
    },
    V2: {
      intro:
        "Your archetype reveals a person who decides with the belly and moves with style. Your first impression is your compass, and often it's right: where others hesitate, you already have your idea. Your watchpoint: situations that ask for a second reading sometimes catch you — because you've already answered.",
      devise: 'I trust my gut, and I go.',
      apportes:
        'Speed, style, a direct reading of people and situations. Your momentum opens the conversations analysis would have kept waiting.',
      freines:
        "Long analyses, pros-and-cons lists, decisions that drag. These aren't flaws — just what falls asleep when your way of moving has no wind left.",
      couple:
        'You bring a rare momentum: deciding fast, living fast, repairing fast too. Something to keep in mind: a partner who checks can seem slow to you — and feel left behind when you rule without weighing the pros and cons.',
      equilibre:
        'Give your first impression a second reading, sometimes. Not because your gut would lie, but because clever traps look like what you expected — and two pairs of eyes beat one.',
    },
    V3: {
      intro:
        "Your archetype reveals a person who follows their instinct — and who, facing the traps, checked. You feel fast and you confirm without admitting it: a gut that doesn't believe itself infallible is the best combination. Your watchpoint: you call yourself purely instinctive — the share of method your results tell deserves to be recognized.",
      devise: 'I feel fast, and I check in silence.',
      apportes:
        'A fast gut AND conclusions that hold. You sense the direction before others and you rarely end up fooled — it\'s rare, and it gets noticed.',
      freines:
        "People who swear only by proofs, decisions to justify in the heat. These aren't flaws — just what irritates when your method stays invisible, even to you.",
      couple:
        'You bring both tempos: the enthusiasm of the gut and the safety of the checked. Something to keep in mind: your partner may believe everything comes to you by luck — show them, now and then, the work behind the intuition.',
      equilibre:
        'Admit it to yourself: yes, you check. Not to weigh down your speed, but because an owned method can be shared — and makes decisions for two more solid.',
    },
    V4: {
      intro:
        "Your archetype reveals a person who weighs, who checks, and who refuses to answer too fast — even the questions that beg for it. Your caution has spared you more mistakes than it has cost you chances, and your decisions show it. Your watchpoint: some simple answers really exist — the habit of looking for the complication can make them go unnoticed.",
      devise: 'I weigh before I rule, without doubting everything.',
      apportes:
        'Seriousness in decisions, an eye on the details that leak, a no said at the right moment. Choices made with you are rarely regretted — they hold.',
      freines:
        "Questions that want an immediate answer, everyday bets, people who decide on the move. These aren't flaws — just what jams when checking becomes the entry ticket to everything.",
      couple:
        'You bring a rare safety: nothing important gets decided in the heat with you. Something to keep in mind: a fast partner can live your delays as a doubt about their ideas — name them care, not suspicion.',
      equilibre:
        'Trust the obvious sometimes, without taking it apart. Not because caution would be a flaw, but because a simple answer welcomed in time saves hours — and leaves energy for what counts.',
    },
    V5: {
      intro:
        "Your archetype reveals a person with two hands: one that feels, one that measures. Depending on the ground, you change tools — and you understand both camps, the intuitive and the analyst. Your watchpoint: when both tools work everywhere, neither becomes a specialty — sometimes pick the same one, to forge it.",
      devise: 'I choose the tool by the ground: I feel, and I measure.',
      apportes:
        'A rare flexibility of thought: you understand the fast AND the methodical, and you bridge the two without mocking either.',
      freines:
        "Grounds that demand committing to ONE mode, choices to hold over time. These aren't flaws — just what jams when your flexibility has no ground left to train on.",
      couple:
        "You're a precious translator: feeling AND structure speak through you. Something to keep in mind: becoming the mandatory crossing point of every decision is tiring — state your own position before translating the others'.",
      equilibre:
        'Pick one tool — and sometimes stick with it. Not to hobble yourself, but because a repeated gesture becomes a strength: two sure hands beat two busy hands.',
    },
  },

  '1.9': {
    V1: {
      intro:
        "This card doesn't judge your momentum: it photographs it. You've just answered eight statements about these last few days. What you read is your inner weather of the day — the same reading for the three degrees: high, mixed, or low momentum. Your watchpoint: a weather report dates fast — what you read today is a season, never a personality portrait.",
      devise: 'My weather gets measured, it doesn\'t get judged.',
      apportes:
        'A dated landmark: where your autonomy, your competence and your connection stand, these last few days. No grade, no comparison — a snapshot you keep for yourself.',
      freines:
        'The reading traps: rereading an old weather report as if it still held, or taking a low weather report for a verdict. No degree is a merit — high, mixed, or low, these are three seasons, not three grades.',
      couple:
        'For two, this card says what your week gives to see: a high momentum that carries people, a mixed momentum that swings. A low momentum pulls back — and the other can read a lack of interest where there is none. Naming it out loud is enough to clear up the misunderstanding.',
      equilibre:
        "Reread your card like a weather report: dated, changeable, retakeable in 30 days. Your momentum has the right to move — that's even its only certainty.",
    },
  },

  '1.10': {
    V1: {
      intro:
        "Your archetype reveals a person who comes back: the first contact after the argument, the answer arrived before the request, the fault owned the same day. What you offer checks out — and it holds a table for two. Your watchpoint: the pillar doesn't say when it bends — and giving can become your only way of receiving.",
      devise: "I say I'll be there, and I am.",
      apportes:
        'A presence that checks out: the first contact after the argument, the tiredness spotted before the word is said, the admission straight out. People know what they\'ll get from you — and it arrives before the request.',
      freines:
        'Asking, receiving, saying what weighs on you. These aren\'t flaws — just the gestures that fade when giving takes up all the room.',
      couple:
        'You build a concrete safety: gestures arrive before the requests, apologies come out the same day. Something to keep in mind: the other can stop seeing what you carry — word one request a week, and let it land.',
      equilibre:
        'Word one request a week, and let it land. Not because giving would be a problem, but because receiving takes practice — and a beacon that receives shines longer.',
    },
    V2: {
      intro:
        'Your archetype reveals a person who holds the balance. You look for what works for both, you admit your faults, you help depending on the day. Nothing spectacular — a balance that gets verified by walking. Your watchpoint: the exact count — returning every effort can turn the bond into a ledger.',
      devise: 'I look for what works for both of us, and I keep the balance.',
      apportes:
        'A balance you can walk: agreements looked for, faults admitted, help that arrives — sometimes before, sometimes on request. Bonds last with you, with no drama and no surprise.',
      freines:
        "Gestures that don't come back, the days when the balance can't find its equilibrium. These aren't flaws — just what itches when the bond looks like a ledger.",
      couple:
        'You bring decisions that work for both, sincere apologies, a steadiness with no drama. Something to keep in mind: weighing everything tires both plates — a gesture with no return expected gives the bond back its air.',
      equilibre:
        'Offer one gesture a week without writing it in the returns column. Not because the balance would be fake, but because a bond is not an addition.',
    },
    V3: {
      intro:
        "Your archetype reveals a person who knows what they expect from people — and who asks for it straight out. Your side of the road is well kept: you know where you want to go, and it shows. Your watchpoint: when the asking takes up all the room, the offering fades — and the other ends up passing somewhere else.",
      devise: 'I ask straight out — and I lay the first stone.',
      apportes:
        'Clarity: your needs can be read, your asks move things forward, no one has to guess for you. A table where people know what they came for — that spares a lot of misunderstandings.',
      freines:
        "The first step, the offer with no ask, the gesture that pays nothing right away. These aren't flaws — just the muscles at rest when the ask is enough.",
      couple:
        'You bring a readable direction: what you want is known, misunderstandings fall away. Something to keep in mind: the other can feel like a service before being a person — one first step a day rebalances, without upending.',
      equilibre:
        'Make one first step a day — the gesture before the request. Not because asking would be wrong, but because a road gets walked by two when both of them pave it.',
    },
  },
};

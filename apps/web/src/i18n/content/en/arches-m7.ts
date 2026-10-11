/**
 * MIROIR EN des ARCHÉTYPES — MONDE 7 « Face aux Tempêtes » (quêtes 5.4,
 * 5.5, 5.6).
 *
 * Par variante, les 6 champs du gabarit fondateur : intro (« Your archetype
 * reveals… » + point de vigilance) · devise à la 1ʳᵉ personne · apportes ·
 * freines (« They are not flaws — just what shows up when… ») · couple
 * (« Keep in mind: … ») · equilibre (« Not because…, but because… »).
 * Ton : you, simple et littéral, chaleureux, phrases courtes.
 * Clés de variantes : ids CARTE-5.x-* VERBATIM, jamais traduits.
 *
 * Neutralité (doctrine M7) : 5.4 — the five ways of holding a disagreement
 * are equal, the shadow is the COST in a couple (for you AND for the other),
 * never the nature ; 5.5 — the four temperatures are equal, tension rises
 * in everyone, the quiet one is a guard, never a fault, no clinical label ;
 * 5.6 — the level is a door, never a verdict, the silence is not a failure,
 * nothing gets sealed. Apostrophe ASCII U+0027 uniquement (leçon Task 45).
 */
export const ARCHES_M7: {
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
  '5.4': {
    'CARTE-5.4-GOUVERNAIL': {
      intro:
        "Your archetype reveals a person who holds their course in a disagreement: at your place, things finally get said. Your watch point: the firm hand can turn into a match, and the other gives up before their sentence.",
      devise: "My course holds the house: I name the problem, and the road reopens.",
      apportes:
        "A clear decision in the deadlock: when everyone goes in circles, you decide. The evenings that wear themselves out stop at your place.",
      freines:
        "The held position can crush the exchange: surface agreements, a room that shrinks. They are not flaws — just what shows up when the duel takes all the space.",
      couple: "Keep in mind: a forced decision holds only by the person who bent to it.",
      equilibre:
        "Ask for a turn to speak before concluding — Not for your line, but because two voices hold better than one.",
    },
    'CARTE-5.4-ATELIER': {
      intro:
        "Your archetype reveals a person who leads the disagreement like a two-voice inquiry: the true need comes out. Your watch point: every friction can become a negotiation table, even the small ones.",
      devise: "I look for the version that keeps both: a dispute ends in understanding, not in debt.",
      apportes:
        "A repair that holds: with you, topics get dug into and settled deep. People feel heard right into the disagreement.",
      freines:
        "The permanent table wears out: a watchfulness that empties you, needs to word with no strength left for the other. They are not flaws — just what shows up when everything gets negotiated.",
      couple: "Keep in mind: one quick decision, no audit — not everything gets negotiated.",
      equilibre:
        "Choose without an inquiry on a small topic — Not for your audit, but because the bond deserves rest.",
    },
    'CARTE-5.4-PASSERELLE': {
      intro:
        "Your archetype reveals a person who unblocks through the middle ground: each of you gives a little, and life moves again. Your watch point: the deal can cover the true need, and the topic come back sooner than planned.",
      devise: "I reopen the door through the middle: each of us gives a little, topics move ahead.",
      apportes:
        "A defusing that moves things: where a position freezes, your arrangement reopens the conversation. A house that moves ahead sleeps better.",
      freines:
        "The middle ground gets paid in silence: lukewarm agreements, a need left under the deal. They are not flaws — just what shows up when everything goes through half.",
      couple: "Keep in mind: name what cannot be split — the true need deserves better than a deal.",
      equilibre:
        "Defend one topic without splitting it — Not because the middle ground is wrong, but because some topics deserve a full agreement.",
    },
    'CARTE-5.4-PAUSE': {
      intro:
        "Your archetype reveals a person who knows how to let things cool: the pause is a tool, and a topic hot costs more. Your watch point: the topic put off grows by what went unsaid around it.",
      devise: "I let the storm pass: cold, the conversation costs less.",
      apportes:
        "A calm that lets the house breathe: with you, shouting is rare. One evening of distance loosens what an hour of tension inflames.",
      freines:
        "The pause can become a closet: a mental list that gets longer, topics raised alone. They are not flaws — just what shows up when the silence lasts.",
      couple: "Keep in mind: set a date instead of a silence — the topic waits without swelling.",
      equilibre:
        "Announce your date of return to the topic — Not because your pause should be fled, but because a date changes the waiting.",
    },
    'CARTE-5.4-PASSAGE': {
      intro:
        "Your archetype reveals a person who chooses the climate: yielding is not losing, it is making room for the bond. Your watch point: the small yes pile up into an account of silence nobody sees.",
      devise: "I choose the peace of the home: the room I leave keeps the bond whole.",
      apportes:
        "A quiet that comes back fast: with you, the home loosens up. The room you leave is a real everyday generosity.",
      freines:
        "Peace bought gets paid in due time: displeasures stacked in a pile, an opinion dropping out of decisions. They are not flaws — just what shows up when the yes leaves too fast.",
      couple:
        "Keep in mind: a half-yes sometimes reads as being dodged — peace reads better without debt.",
      equilibre:
        "Say one preference a day, even small — Not because your yes is false, but because it counts more said plainly.",
    },
    'CARTE-5.4-DUO': {
      intro:
        "Your archetype reveals a person with both hands: one hand decides, the other blends — and the topic decides. Your watch point: two tempos with no stated rule read through fog.",
      devise: "Two hands lead at my place: I know how to hold my spot, and give it up at the right moment.",
      apportes:
        "A rare range: knowing how to hold and knowing how to blend rarely live in the same person. The disagreement has two doors with you.",
      freines:
        "The duo changes hands without warning: the other no longer knows which rule is playing. They are not flaws — just what shows up when the duo goes unnamed.",
      couple: "Keep in mind: announce your hand from the start — the duo then plays the same tune.",
      equilibre:
        "Say the rule of the day before the friction — Not for your duo, but because a stated rule protects both.",
    },
    'CARTE-5.4-EQUILIBRE': {
      intro:
        "Your archetype reveals a person with five tools: no stance dominated, and the topic calls the hand. Your watch point: a method that changes shape is hard to guess from outside.",
      devise: "My hand changes with the topic: the conflict is a problem, not an identity.",
      apportes:
        "A true suppleness: the disagreement receives the hand it asks for, not the other way around. The five stances live in your box.",
      freines:
        "The palette changes hands, and the reading has a hard time following: keys the other does not have. They are not flaws — just what shows up when the rule changes shape.",
      couple:
        "Keep in mind: one opening word per disagreement — decided, shared, set aside, blended, yielded.",
      equilibre:
        "Say under which rule the disagreement gets played — Not because your palette is at fault, but because a stated rule reassures.",
    },
  },
  '5.5': {
    'CARTE-5.5-MOTS-VIFS': {
      intro:
        "Your archetype reveals a person whose rise speaks: the words come out, and people know where you stand. Your watch point: a word that goes past the dispute gets paid in repairs.",
      devise: "My tension speaks loud: it comes out, it gets crossed, nothing simmers underneath.",
      apportes:
        "Nothing festers at your place: what crosses you gets said, and misunderstandings die fast. With you, people know where the other stands — clarity arrives early.",
      freines:
        "The volume sometimes carries off the substance: the one sentence too many leaves, and the regret stays after. They are not flaws — just what shows up when the rise speaks first.",
      couple: "Keep in mind: name the rise before the substance — the volume drops once it is said.",
      equilibre:
        "Name the rise before answering — Not because your words are too many, but because they land truer once cooled down.",
    },
    'CARTE-5.5-MUR': {
      intro:
        "Your archetype reveals a person who protects through silence: under tension, you set a wall. Your watch point: a pause sometimes reads as an ending.",
      devise: "My silence is a guard: I protect the discussion from the fire.",
      apportes:
        "Your calm avoids the words that go too far: nothing gets said in the fire. With you, the flare-ups cool down — the discussion finds its footing again.",
      freines:
        "A wall goes up fast and comes down slow: the other guesses, and the riddle runs further than the dispute. They are not flaws — just what shows up when the guard takes all the space.",
      couple:
        "Keep in mind: give the silence a date — 'I will come back to it' turns the wall into a delay.",
      equilibre:
        "Say one thing before going quiet — Not because your wall is false, but because the delay gets announced.",
    },
    'CARTE-5.5-LE-RETOUR': {
      intro:
        "Your archetype reveals a person who comes back: once the calm is back, you take up what hurt. Your watch point: between the rise and the return, the hurt settles in.",
      devise: "I speak when the calm allows hearing: the words arrive whole.",
      apportes:
        "Your right words arrive without the volume of the rise: what gets settled cold holds long. With you, a dispute gets talked through again without waking the fire.",
      freines:
        "The cooling-down time lets the hurt sit down: the other copes with a scene you already crossed. They are not flaws — just what shows up when the second round runs late.",
      couple:
        "Keep in mind: name the hour of your return — the wait becomes an appointment, no longer a void.",
      equilibre:
        "Give the return a date — Not because your cold is false, but because an announced wait gets carried as two.",
    },
    'CARTE-5.5-LE-CORPS': {
      intro:
        "Your archetype reveals a person who carries: the hurt takes the place of words, and the body tells it before you. Your watch point: what does not get said gets paid twice.",
      devise: "My body speaks before me: the hurt has a language before the words.",
      apportes:
        "Your hurt reads with no detour: with you, nobody pretends, and the true finds a door. Your body tells what the words have not said yet.",
      freines:
        "The withdrawal carries what it does not say: the night, the gut, the shoulders — and this carrying wears out. They are not flaws — just what shows up when the hurt goes down.",
      couple:
        "Keep in mind: put a short sentence on the hurt — named, it gets carried lighter.",
      equilibre:
        "Say the hurt in one sentence before it goes down — Not because your withdrawal is too much, but because a name relieves.",
    },
  },
  '5.6': {
    'CARTE-5.6-QUI-TIENT': {
      intro:
        "Your archetype reveals a person who knows how to come back: after a disagreement, the gesture, the word or the apology arrives without waiting. Your watch point: when only one comes back, the other's first move stays a sleeping muscle.",
      devise: "I know how to come back: the first move is mine, and the door reopens fast.",
      apportes:
        "A strength that reassures: tensions untangle before settling in. With you, a disagreement stays ordinary — it gets settled, and the bond holds.",
      freines:
        "Coming back fast can absorb the other's silence: their own apologies stop getting exercised. They are not flaws — just what shows up when repair flows easily.",
      couple: "Keep in mind: sometimes leave the doorstep to the other — repair gets shared.",
      equilibre:
        "Sometimes wait for the other to come back — Not because your repair is too much, but because two muscles beat one.",
    },
    'CARTE-5.6-SE-TRAVAILLE': {
      intro:
        "Your archetype reveals a person who comes back, but late: the repairs exist, they ask for a click. Your watch point: the settled argument replays in your head for days.",
      devise: "My repair is a muscle: it gets worked on, it does not get judged.",
      apportes:
        "Real repairs, even shy ones: humour loosens things, and an apology sincerely received brings you back down. With you, the come-backs arrive — a little late, but they arrive.",
      freines:
        "Replaying it over reopens a page already turned: the other's apology stays half-accepted. They are not flaws — just what shows up when the click runs late.",
      couple:
        "Keep in mind: say 'it is settled' out loud, and let the sentence work for you.",
      equilibre:
        "Set one word of ending — Not because you repair poorly, but because the page likes to close clean.",
    },
    'CARTE-5.6-SILENCIEUSE': {
      intro:
        "Your archetype reveals a person who stays quiet after the argument: the silence protects what is raw. Your watch point: when nobody comes back, the wall settles in — and it speaks for you.",
      devise: "My silence protects: I keep what matters from catching fire.",
      apportes:
        "A calm that defuses: you keep what is already raw from catching fire. With you, escalations lose their fuel.",
      freines:
        "The silence left unshared piles up: arguments left unfinished, a door slow to open. They are not flaws — just what shows up when the first move waits.",
      couple:
        "Keep in mind: silence is also an answer — yours can change its tone from the first move.",
      equilibre:
        "Make one first move, however clumsy, however small — Not because your silence does not count, but because it can be said another way.",
    },
  },
};

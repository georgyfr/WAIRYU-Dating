/**
 * MIROIR EN des ARCHÉTYPES — MONDE 6 « Mon Cœur » (quêtes 5.1, 5.2, 5.3,
 * 5.7).
 *
 * Par variante, les 6 champs du gabarit fondateur : intro (« Your archetype
 * reveals… » + point de vigilance) · devise à la 1ʳᵉ personne · apportes ·
 * freines (« They are not flaws — just what shows up when… ») · couple
 * (« Keep in mind: … ») · equilibre (« Not because…, but because… »).
 * Ton : you, simple et littéral, chaleureux, phrases courtes.
 * Clés de variantes : ids CARTE-5.x-* VERBATIM, jamais traduits.
 *
 * Neutralité (doctrine M6) : 5.1 — the six ways of loving are equal, the
 * shadow is the EXCESS in a couple, aucun nom d'atelier ni d'auteur ; 5.2 —
 * a belief is neither healthy nor fragile, zéro verdict, zéro prédiction,
 * zéro correction ; 5.3 — five channels are equal, le nom de marque déposée
 * du domaine n'apparaît sous AUCUNE forme ; 5.7 — four laughs are equal,
 * the shadow is the COST, never the style. Apostrophe ASCII U+0027
 * uniquement (leçon Task 45).
 */
export const ARCHES_M6: {
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
  '5.1': {
    'CARTE-5.1-FLAMME': {
      intro:
        "Your archetype reveals a person who sets the tempo of a whole story when the flame catches — and who owns it. Your watch point: a flat Tuesday is not the end of the fire — the fire has days like that too.",
      devise: "My way of loving is a flame: when it catches, the whole story lights up.",
      apportes:
        "An ardor felt from the doorway: you set a whole story alight, and the other knows they are chosen. With you, beginnings taste like real departures — grand and alive.",
      freines:
        "Flat days take an effort: calm can read as the end of the fire. And the other may come to believe an ordinary day is no longer enough. They are not flaws — just what shows up when you live in summits.",
      couple: "Keep in mind: name one Tuesday that worked — the fire lives in ordinary days too.",
      equilibre:
        "Live an ordinary day like a summit — Not because the flame weakens, but because a lasting fire settles down.",
    },
    'CARTE-5.1-PARTIE': {
      intro:
        "Your archetype reveals a person who makes air for two: your teasing lets the story breathe, it does not flee. Your watch point: a real question calls for a real answer — the joke can wait.",
      devise: "My love is a game: I play so the story breathes, not to win.",
      apportes:
        "An ease that relaxes a whole room: with you, the first hours weigh less. Quiet houses recognize your way of bringing a tension down one notch.",
      freines:
        "Lightness reads poorly when the other is serious: they may look for ground where you make air. And a real question sometimes leaves without an answer. They are not flaws — just what shows up when play has relaxed things so well.",
      couple: "Keep in mind: answer straight once — the question received makes the game freer.",
      equilibre:
        "Receive a serious question without joking — Not because your play betrays, but because a clear answer makes the playground safe.",
    },
    'CARTE-5.1-ROUTE-LONGUE': {
      intro:
        "Your archetype reveals a person who builds love like a road: the conversation first, the trust next. Your watch point: a love slow to name itself sometimes gets lived alone.",
      devise: "My love is a long road: what grows without rushing holds up over time.",
      apportes:
        "A trust that settles without effort: you know someone by their ordinary days, not by their show nights. With you, bonds born slowly carry far — time is your signature.",
      freines:
        "The word can wait too many seasons: your deep attachment sometimes reads as habit. And the other doubts what is already there. They are not flaws — just what shows up when time spoke for you.",
      couple: "Keep in mind: say the word that waits — what is already there deserves to be heard.",
      equilibre:
        "Name what exists — Not because your gestures say nothing, but because a word heard beats a doubt.",
    },
    'CARTE-5.1-BOUSSOLE': {
      intro:
        "Your archetype reveals a person who gives an address to what they live: decisions get made together. Your watch point: a person is not a list — let them surprise you.",
      devise: "My love is a compass: I build plans that carry, and I hold the course with the other.",
      apportes:
        "Concrete ground: schedules get sorted, money gets talked about, what gets decided moves ahead. With you, a plan stands — people rest on that.",
      freines:
        "The list reassures and filters: meetings without a box slip past, sometimes the right ones. And the other can feel examined rather than discovered. They are not flaws — just what shows up when building protected you.",
      couple: "Keep in mind: listen once without ticking boxes — surprise has an address too.",
      equilibre:
        "Set your list aside for one evening — Not because your bearings mislead, but because the person deserves a blank page.",
    },
    'CARTE-5.1-VIGIE': {
      intro:
        "Your archetype reveals a person who keeps watch: schedules, moods of the day, silences that change — nothing slips past you. Your watch point: your peace belongs to you — the other does not carry it in your place.",
      devise: "My love is a lookout: when I love, everyone knows it, and nobody is forgotten.",
      apportes:
        "A total presence: your attention builds shelters, people feel watched over. With you, a change of tone gets noticed in the first week — attention shows.",
      freines:
        "When a reply runs late, the mind races: an hour of waiting becomes an hour of scenarios, and the other becomes the keeper of a calm that tires. They are not flaws — just what shows up when peace depended on a schedule.",
      couple: "Keep in mind: keep a soothing ritual of your own — the keeper gets to rest too.",
      equilibre:
        "Give your peace several addresses — Not because the other counts less, but because a single support tires both sides.",
    },
    'CARTE-5.1-PORT': {
      intro:
        "Your archetype reveals a person who cares without counting: needs get guessed before words. Your watch point: receiving is half the road — it gets learned.",
      devise: "My love is a harbor: the things held carry my mark, and storms find shelter.",
      apportes:
        "A generosity seen from far: helping hands, quiet attentions, seats given up. With you, a house stands through storms — and people know where you are.",
      freines:
        "The giving without pause forgets half the road: the account empties in silence, the fatigue arrives after the fact. And the other can feel indebted for what they cannot carry. They are not flaws — just what shows up when giving was the first second.",
      couple: "Keep in mind: ask for one thing a week — the house holds better when receiving happens in it.",
      equilibre:
        "Receive without paying back — Not because your care weakens, but because a giving that receives lasts longer.",
    },
    'CARTE-5.1-PALETTE': {
      intro:
        "Your archetype reveals a person who loves with several hands, depending on the season. Passion, play, time, plans, attention, care — everything takes turns in you. Your watch point: your rule exists — it says itself slower than your tide.",
      devise: "My way of loving is a palette: I pass from one hand to another with the season.",
      apportes:
        "A real suppleness: you adjust to the most different houses. With you, nobody has to pick a camp — you translate between the ways of loving.",
      freines:
        "The outside reading does not follow every time: one passionate week, one settled week, and the other looks for your rule of the moment. They are not flaws — just what shows up when the seasons change on their own.",
      couple: "Keep in mind: give one word of your current season — the other was looking for the door.",
      equilibre:
        "Explain your rule of the moment — Not because you owe a justification, but because an announced tide sails better.",
    },
  },
  '5.2': {
    'CARTE-5.2-ECRIT-DAVANCE': {
      intro:
        "Your archetype reveals a person who lets life surprise them: a marked meeting has a taste of obviousness, and the unexpected interests you. Your watch point: a disagreement gets crossed — it does not get deciphered like a sign.",
      devise: "My faith is an open road: what calls me ends up finding me — and I stay available.",
      apportes:
        "An openness to arrivals: you let things surprise you. With you, a story keeps air — the unexpected is a guest, not a threat.",
      freines:
        "Reading each day like a text to interpret tires — and the awaited sign shifts the initiative onto the other. They are not flaws — just what shows up when obviousness came before the plan.",
      couple: "Keep in mind: say what you choose, on top of what you read.",
      equilibre:
        "Choose one thing to build this week — Not because the obviousness is false, but because building is part of the road too.",
    },
    'CARTE-5.2-ECLAIR': {
      intro:
        "Your archetype reveals a touchable person: beginnings go through you, and you give credit to the first contact. Your watch point: speed skips steps — set them back one by one, time knows how.",
      devise: "My strength is a bolt: I let myself be seized — and I leave time its share.",
      apportes:
        "An intensity that shows: beginnings live large in you. With you, a beginning has fire — nobody stays a spectator.",
      freines:
        "Committing on a first impression can run ahead of trust — and the other inherits a role they did not choose. They are not flaws — just what shows up when the impulse came before time.",
      couple: "Keep in mind: let the second meeting be something other than the first.",
      equilibre:
        "Set back one skipped step — Not because the bolt lies, but because trust gets built after the impulse.",
    },
    'CARTE-5.2-UNIQUE': {
      intro:
        "Your archetype reveals a person loyal to a whole promise: collecting does not interest you — holding does. Your watch point: a story gets measured by what it holds, and the myth lights up as much as it hides.",
      devise: "My promise is whole: what I build receives from me a rare weight.",
      apportes:
        "A long-breathed loyalty: you take a story seriously. With you, nothing is disposable — a relationship gets entered to hold.",
      freines:
        "Measuring each story against a legend wears the everyday down — and the other ends up competing with a ghost. They are not flaws — just what shows up when the great love came before the people.",
      couple:
        "Keep in mind: treat the great love as a decision you renew — it holds better than an obviousness.",
      equilibre:
        "Name one ordinary quality of the other — Not because the myth falls, but because the everyday has its own greatnesses.",
    },
    'CARTE-5.2-VERSION-QUI-POURRAIT': {
      intro:
        "Your archetype reveals a person who sees the best in people — that lift can be felt, and people grow near you. Your watch point: potential signs nothing — the person present does.",
      devise: "My gaze is a spotlight: I name strengths people had not named.",
      apportes:
        "A lift that can be felt: near you, people discover strengths of their own. With you, people dare more — the best shows, and they try it on.",
      freines:
        "Loving a potential tires: the real person and the imagined version drift apart, and the gap gets paid on both sides. They are not flaws — just what shows up when the image ran ahead of the present.",
      couple: "Keep in mind: name what you already see, before what you dream.",
      equilibre:
        "Say one quality you see — Not because the dream is too big, but because the real deserves its words.",
    },
  },
  '5.3': {
    'CARTE-5.3-MOTS-QUI-DISENT': {
      intro:
        "Your archetype reveals a person filled by words: one right word carries you a whole day. You know how to name what the other does well. Your watch point: a silence gets asked for — it does not read by itself.",
      devise: "My voice is the right sentence: it relights my day, and I give it back.",
      apportes:
        "Words that repair: you know how to say the attention, and your sentences leave clear traces. With you, people learn a sincere compliment is worth a whole presence.",
      freines:
        "The blank that stretches can weigh: you count the minutes of a silence the other lives in peacefully. They are not flaws — just what shows up when words carried everything.",
      couple: "Keep in mind: name the word you wait for — the other learns it, instead of guessing.",
      equilibre:
        "Ask for the sentence you wait for — Not because the other stays quiet against you, but because a request gets learned out loud.",
    },
    'CARTE-5.3-PRESENCE-PLEINE': {
      intro:
        "Your archetype reveals a person filled by full presence: one evening without screens, and you feel loved. Your watch point: a distracted presence feeds only halfway — it gets renamed, it does not get judged.",
      devise: "My channel is an appointment: set for two, screens away, table laid.",
      apportes:
        "A whole presence: with you, an evening takes the tone of a home. You give the calm you like to receive.",
      freines:
        "Loneliness as two can settle in: the other is here, the screen too, and the half is missing. They are not flaws — just what shows up when shared time was your filling.",
      couple:
        "Keep in mind: set a named slot rather than a diffuse reproach — the request gets planned.",
      equilibre:
        "Name the evening you want — Not because the other does not think of you, but because a named slot soothes.",
    },
    'CARTE-5.3-GESTE-QUI-DIT': {
      intro:
        "Your archetype reveals a person filled by help: the suitcase carried up speaks as loud as a declaration. Your watch point: giving to be owed installs a bill — the favor gets given, it does not get counted.",
      devise: "My love is hands-on: it lightens the days, one useful hand at a time.",
      apportes:
        "Lightened days: your hands see what weighs, and it shows. With you, loads get shared without speeches.",
      freines:
        "Help can replace presence: you do instead of a moment together. They are not flaws — just what shows up when the gesture was your first voice.",
      couple: "Keep in mind: say what would help you — without waiting for the exact trade.",
      equilibre:
        "Receive without keeping the tally — Not because the gift loses its value, but because a silent bill wears both sides.",
    },
    'CARTE-5.3-DETAIL-JUSTE': {
      intro:
        "Your archetype reveals a person filled by the chosen attention: the object thought out proves someone listened. Your watch point: the proof wears out when it gets counted — occasions get celebrated, they do not get examined.",
      devise: "My channel is a detail: hunted for others, kept in memory.",
      apportes:
        "An eye that catches: you celebrate people with what others miss. With you, ordinary moments become dated memories.",
      freines:
        "Counting proofs tires: a missed birthday weighs more than a week of tenderness. They are not flaws — just what shows up when the rule stayed in the drawer.",
      couple: "Keep in mind: tell the attention that marked you — the rule comes out of the drawer.",
      equilibre:
        "Say the rule before the occasion — Not because the other is distracted, but because a named rule celebrates better.",
    },
    'CARTE-5.3-PEAU-QUI-PARLE': {
      intro:
        "Your archetype reveals a person filled by touch: a hand, a shoulder, and the body sums up an evening. Your watch point: a pause is not a falling out of love — the other's rest stays rest.",
      devise: "My voice is touch: it says fast what would take an evening.",
      apportes:
        "A presence that soothes: your hand closes painful days. With you, reunions get felt before they get said.",
      freines:
        "Distance can sound the alarm: a tired partner becomes a whole message. They are not flaws — just what shows up when touch said everything.",
      couple:
        "Keep in mind: name the touch you wait for — a clear request speaks better than an alarm.",
      equilibre:
        "Translate the gesture before you conclude — Not because your feeling is wrong, but because a pause has reasons of its own.",
    },
    'CARTE-5.3-ECOUTE-LARGE': {
      intro:
        "Your archetype reveals a person with wide listening: your five channels sit within a handkerchief, none shouts louder. Your watch point: a diffuse need waits for a name — without it, it stays folded on itself.",
      devise: "My width is an antenna: several frequencies, no favorite.",
      apportes:
        "A reception without a void: you receive affection on all its frequencies. With you, the other rarely misses — all their channels get through.",
      freines:
        "When everything fills you, nothing shouts: your need stays hard to word. They are not flaws — just what shows up when each channel counted as much.",
      couple:
        "Keep in mind: rank your last three joys together — the top of the list tells your channel.",
      equilibre:
        "Pick one joy and name it — Not because the others count less, but because a precise request guides the other.",
    },
  },
  '5.7': {
    'CARTE-5.7-RAPPROCHE': {
      intro:
        "Your archetype reveals a person whose laugh opens the table: tongues loosen and the awkwardness leaves. Your watch point: the serious moment turns into a joke before it even happened.",
      devise: "My laugh is an open door: the table lights up again when I arrive.",
      apportes:
        "A bond made through laughing: at your place, new people find each other fast. With you, an evening unblocks — people talk, and they come back.",
      freines:
        "The laugh that binds pushes the serious aside: a worry slides into a sketch without an answer. They are not flaws — just what shows up when the table laughs loud.",
      couple: "Keep in mind: leave a space without laughing — the serious needs a tone of its own.",
      equilibre:
        "Ask one serious question without closing it into a joke — Not because the laugh is too much, but because what matters waits.",
    },
    'CARTE-5.7-LEGER': {
      intro:
        "Your archetype reveals a person who gets through hard blows by making them tellable. A breakdown, a black Monday, a disappointment become stories one can hear. Your watch point: the laugh set too early closes the needed conversation.",
      devise: "My distance is a bridge: the bad days get told, and the weight gets shared.",
      apportes:
        "A calm that transmits: people leave your bad news lighter. With you, the long stretches get crossed — distance helps to hold on.",
      freines:
        "The laugh consoles fast: it sometimes says less than what weighs, and the other believes the topic settled. They are not flaws — just what shows up when the smile spoke before the words.",
      couple: "Keep in mind: name the weight once without a joke — the laugh picks up after.",
      equilibre:
        "Let the serious word pass before the smile — Not because your laugh is fake, but because it consoles better after.",
    },
    'CARTE-5.7-TRANCHANT': {
      intro:
        "Your archetype reveals a person with lively frankness: your humour sees the fake fast. At your place, people know where they stand. Your watch point: the word leaves before its target chose to be one.",
      devise: "My word tells true: no comedy, and everyone knows where they stand.",
      apportes:
        "A frankness that reassures: people tired of speeches rest at your place. Your right word arrives early — and it stays.",
      freines:
        "The jab does not warn its target: they laugh with the group, then they keep to themselves. They are not flaws — just what shows up when liveliness spoke first.",
      couple:
        "Keep in mind: a confided flaw deserves a private frame — liveliness improvises in public, softness protects.",
      equilibre:
        "Ask the target what they received — Not because your word was wrong, but because they alone decide to laugh.",
    },
    'CARTE-5.7-DESAMORCE': {
      intro:
        "Your archetype reveals a person who disarms awkwardness: before it settles in, you already occupy it. Your watch point: the joke on yourself can become the only introduction.",
      devise: "My laugh leads the way: I make fun of myself, and the awkwardness leaves.",
      apportes:
        "A generosity that puts at ease: you set the example by starting with yourself. With you, postures drop — beginnings relax.",
      freines:
        "The flaw told through laughing ends up telling only itself: your weaknesses get known by heart, your strengths get guessed. They are not flaws — just what shows up when the costume became the address.",
      couple:
        "Keep in mind: reassuring endlessly wears out — a partner cannot catch every joke you make about yourself.",
      equilibre:
        "Tell one strength without laughing, a single one — Not because your jokes are too many, but because an address completes itself.",
    },
  },
};

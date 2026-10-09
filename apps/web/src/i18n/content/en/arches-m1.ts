/**
 * MIROIR EN des ARCHÉTYPES — MONDE 1 (quêtes 1.1 · 1.2 · 1.3) + quête 1.4
 * (mission 3-c : « si lib/quete-1-4-arche.ts existe, traduis-le aussi » —
 * il existe ; clés posées ici, l'agent arches-m2 peut les recouvrir).
 * Par variante (V1, V2… — clés EXACTES du FR), les 6 champs du gabarit
 * fondateur : intro · devise · apportes · freines · couple · equilibre.
 * Ton : tutoiement → « you », simple et littéral, chaleureux, phrases courtes.
 */
export const ARCHES_M1: {
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
  '1.1': {
    // V1 — L'Explorateur·rice chaleureux·se : The Warm Explorer.
    V1: {
      intro:
        "Your archetype reveals a person who lives the new like fuel. You are one of those who say yes before planning everything, who turn an unexpected idea into an outing, a conversation, a shared plan. Your curiosity is warm: it wants to share, it carries people along. Your watchpoint: in the excitement of what arrives, what already counts can end up waiting.",
      devise: "I say yes to the new, and I bring others into it.",
      apportes:
        "Momentum, a fresh look, boldness facing the unknown. You make the world a little bigger around you — and you invite others into it instead of going alone.",
      freines:
        "Repetition, routines too set, long waits. These are not flaws — just what weighs when your taste for the new has nothing left to bite into.",
      couple:
        "You bring projects, surprises, a relationship where nothing stagnates. To keep in mind: you move fast — some partners feel carried and nourished, others may feel like they are running behind.",
      equilibre:
        "Take care of what already counts. Not because novelty would be a problem, but because a momentum that returns to what it loves gives what it starts the chance to last.",
    },
    // V2 — Le·La Bâtisseur·se : The Builder.
    V2: {
      intro:
        "Your archetype reveals a person people can count on — and it shows. You are one of those who prepare, finish what they start and keep their word, even on small promises. It isn't rigidity: it's respect, the kind you have for things, for people, for your word. Your watchpoint: when something derails, you tend to accuse yourself first.",
      devise: "I promise little, and I keep everything I promise.",
      apportes:
        "Reliability, constancy, a word that holds. People entrust you with what matters, because they know it will happen — and your regular presence ends up becoming a landmark.",
      freines:
        "Last-minute surprises, different ways of doing things, matters left hanging. These are not flaws — just what grinds when your need for solidness becomes too demanding, toward others as toward yourself.",
      couple:
        "You build a trust that gets verified: clear commitments, reciprocity, reassuring regularity. To keep in mind: your solidness reassures some partners — others may feel graded if the frame becomes a grid.",
      equilibre:
        "Welcome an unexpected event without catching everything. Not because control would be bad, but because leaving room for disorder relaxes what already stands.",
    },
    // V3 — L'Étoile sociale : The Social Star.
    V3: {
      intro:
        "Your archetype reveals a person who draws energy from contact with others. You are one of those who start exchanges, build bridges between people and turn a dull mood into a memorable moment. You thirst for discoveries and naturally want to share them. Your watchpoint: silence and routine can weigh on you, like an empty space to fill.",
      devise: "I discover, I connect, I keep the energy circulating.",
      apportes:
        "Energy, curiosity, spontaneity, enthusiasm, humor… You are an engine of social bond: you keep relationships alive with your ideas and your vitality.",
      freines:
        "Atmospheres too quiet, long silences, slow exchanges, waiting. These are not flaws — just what emerges when your energy has no outlet.",
      couple:
        "You enjoy complicity, sharing discoveries, and a partner who welcomes your dynamism. To keep in mind: your rhythm will thrill some, and may wear others out.",
      equilibre:
        "Know how to savor what doesn't move, too. Not because calm would be superior, but because alternating radiance and rest makes your energy durable.",
    },
    // V4 — L'Ancre : The Anchor.
    V4: {
      intro:
        "Your archetype reveals a person around whom breathing is easier. You are one of those who cross tensions without amplifying them, who love simplicity, duration, bonds that don't need noise to hold. You don't try to shine: you try to do good, quietly, lastingly. Your watchpoint: your stability can hold you for a long time in situations that deserve to change.",
      devise: "I stay grounded, and I do good quietly.",
      apportes:
        "Calm, presence, attentive listening. Tension comes down when you arrive — others lean on you, often without saying so.",
      freines:
        "Conflicts avoided too long, habits turned heavy, your own needs put last. These are not flaws — just what appears when patience becomes a fortress.",
      couple:
        "You offer a rare emotional safety: sincerity, quiet depth, lasting bonds. To keep in mind: very available for the other, you can end up coming last — an attentive partner will notice, others may never see what you carry in silence.",
      equilibre:
        "Count yourself in your own priorities. Not because calm wouldn't be enough, but because knowing how to keep places of your own lets you carry without wearing out.",
    },
    // V5 — L'Intense : The Intense One.
    V5: {
      intro:
        "Your archetype reveals a person who lives at full volume: joys carry you, sorrows cross you, nothing leaves you neutral. You are one of those who notice what others walk past, who attach entirely and remember everything. Your watchpoint: a sometimes loud world can overflow you, and you handle the storm without a manual.",
      devise: "I live things at full volume, and I never do them halfway.",
      apportes:
        "Depth, passion, a fidelity of the heart. You make moments livelier and bonds tighter, because you do nothing halfway.",
      freines:
        "Remarks that stay for hours, waves that rise without warning, goodbyes. These are not flaws — just what crosses when everything is lived at full volume.",
      couple:
        "You give a relationship a rare depth: authenticity, welcome without judgment, exchanges where everything can be said. To keep in mind: your intensity awakens some partners — others may sometimes be swept over by the wave.",
      equilibre:
        "Grant yourself real descents after the waves. Not because you should feel less, but because chosen rests let this intensity have room to last.",
    },
    // V6 — L'Indépendant·e profond·e : The Deep Independent.
    V6: {
      intro:
        "Your archetype reveals a person rich with a vast inner world: long thoughts, deep projects, one-on-one conversations that last for hours. You are one of those who prefer depth to noise — and your calm hides a quiet fire. Your watchpoint: you rarely open the conversation first, and encounters that mattered sometimes went unnoticed.",
      devise: "I live in a vast inner world, and I open it my way.",
      apportes:
        "A rich inner world, deep ideas, a rare ear. When you share your world, the other feels chosen — because it's true.",
      freines:
        "Big gatherings, surface exchanges, first contacts to start. These are not flaws — just what hardens when protecting your world becomes a closed door rather than a slow one.",
      couple:
        "You build real intimacy: patience, depth, respect for the need for space. To keep in mind: your independence can look like distance while, inside, everything is alive — some partners learn to read that silence, others may take it for disinterest.",
      equilibre:
        "Dare to share your world before you finish thinking. Not because solitude would be bad, but because a shared world, even awkwardly, gives back far more than a perfect world kept in silence.",
    },
    // V7 — L'Équilibriste : The Tightrope Walker.
    V7: {
      intro:
        "Your archetype reveals a person who fits no box — and nobody is lying: depending on the day, people describe you as adventurous, solid, lively or grounded. You are one of those who hold a bit of everything — curiosity, constancy, heart, calm — and who adapt to many people without feeling disguised. Your watchpoint: your own desires sometimes come second, behind the adapting.",
      devise: "I am several things at once, and I hold my center.",
      apportes:
        "Suppleness, versatility, an easy bond. Everyone can find a way to connect with you without having to justify themselves — that is a real gift.",
      freines:
        "Choices to settle fast, sides to hold long, periods where nothing moves anymore. These are not flaws — just what appears when the ability to adapt takes all the room and your center struggles to be heard.",
      couple:
        "You offer a rare acceptance: the other exists as they are, without having to choose a version of themselves. To keep in mind: you embrace many rhythms — some partners feel deeply accepted, others may struggle to grasp what you yourself want.",
      equilibre:
        "Say what you yourself want, before adapting. Not because adapting would be wrong, but because a true position, even rare, gives more weight to all the others.",
    },
  },

  '1.2': {
    // V1 — L'Ancrage : Anchored.
    V1: {
      intro:
        "Your archetype reveals a person who settles the bond into duration. You are one of those who stay when it creaks, say the simple things and repair early what rubs. Closeness nourishes you, distance doesn't frighten you — your strength rests on little: a regular presence, a calm that gets verified. Your watchpoint: what is obvious to you doesn't always read from outside — the proofs one forgets to give can create doubts that don't exist.",
      devise: "I stay, I repair, I trust the bond.",
      apportes:
        "A base: people know where they start from, they know who stays. Your calm rests them, your snags repair fast, your ordinary moments make bond.",
      freines:
        "The simple words one thinks useless to say, the other's doubts corrected too fast, the routine that settles in when all is well. These are not flaws — just what appears when calm is so solid it becomes silent.",
      couple:
        "You build a bond that survives snags: sincerity said simply, clear dealings, projects built without noise. To keep in mind: with calm this stable, the other may doubt that their worry finds a place — and keep that doubt inside rather than talk about it.",
      equilibre:
        "Say your attachment often enough that it can be heard outside. Not because your calm would lack depth, but because what is lived as obvious needs to be said to be lived the same way by the other.",
    },
    // V2 — La Vigie : The Lookout.
    V2: {
      intro:
        "Your archetype reveals a person who loves with a permanent antenna. You are one of those who spot mood shifts before everyone else, who keep watch through small gestures and are there on the hard days — your attention crosses the ordinary days too. Your watchpoint: when silence settles in, your imagination can work harder than needed and read intentions where there is only a busy evening.",
      devise: "I love strongly, I keep watch, I give without counting.",
      apportes:
        "A bond where one feels noticed, expected, counted: a whole loyalty, regular signs of love, a memory for small things.",
      freines:
        "Silences that last, messages that are late, repeated requests for proof. These are not flaws — just the same antenna, backwards: the watchfulness that overflows when silence speaks too loud.",
      couple:
        "You give depth rather than lightness, a loyalty that isn't negotiable, words said at the moment doubt arrives. To keep in mind: your antenna can move the bond forward on assumptions rather than words — asking is better than decoding.",
      equilibre:
        "Ask, instead of decoding, what worries you in the bond. Not because your watchfulness would be false, but because a question said out loud replaces hours of interpretation.",
    },
    // V3 — L'Autonome : The Independent One.
    V3: {
      intro:
        "Your archetype reveals a person who lives the bond at their own rhythm: you belong to yourself first, and you love without wanting to lose yourself in it. You are one of those who cross their storms on their own side, take air when it gets dense, and come back when they have breathed. Your love is calm and stable, drama-free. Your watchpoint: from outside, this need for air can read as distance — when it is mostly a breathing.",
      devise: "I belong to my life, and I love with air.",
      apportes:
        "A bond where nobody has to play a role to stay: a love without drama, faithful returns, a life of your own that feeds the relationship.",
      freines:
        "Pauses taken in silence, distances taken without a word, worries crossed in a low voice. These are not flaws — just your need for air, which can look like an escape to someone who doesn't know this language.",
      couple:
        "You bring a respect for each person's rhythm, a trust without control, a relationship where each keeps their world. To keep in mind: with enough unannounced pauses, the other may start inventing the reasons for the silence — when one simple word would have been enough to soothe.",
      equilibre:
        "Announce your pauses before taking them. Not because your air would be a problem, but because the way you take it decides whether the other stays invited or feels shut out.",
    },
    // V4 — Le Va-et-vient : The Come-and-Go.
    V4: {
      intro:
        "Your archetype reveals a person who loves in two beats: when it matters, you commit fast and strong; then, closeness settled, a part of you seeks to take air again. This rhythm is neither lightness nor oddity — it is a way of having learned to love. Your watchpoint: unsaid, this rhythm becomes a message the other interprets for you — every pause can look like a departure.",
      devise: "I give myself fully, I breathe, I come back.",
      apportes:
        "A bond with relief: an intensity that returns, lively reunions, a whole presence when it is there — nothing in it becomes background noise.",
      freines:
        "Contradictory signals, distances acted before being said, beginnings faster than the rest. These are not flaws — just your rhythm changing speed without warning.",
      couple:
        "You make the bond exist with depth when it matters and returns received as loyalties. To keep in mind: without words about your rhythm, every pause can look like a departure and every return like a gift too big — the bond then lives to the beat of misunderstandings.",
      equilibre:
        "Name your two speeds before the other invents them. Not because your rhythm would need fixing, but because saying it turns a misunderstanding into known ground.",
    },
    // V5 — L'Équilibre en mouvement : Balance in Motion.
    V5: {
      intro:
        "Your archetype reveals a person whose way of loving adjusts to the person in front: close when it's the need, discreet when it's the air. You are one of those who cross both movements without drama — and this suppleness is rare: it gives the bond a comfort many can see. Your watchpoint: your own desires can come second, behind the adapting.",
      devise: "I adjust to the other, and I keep my voice.",
      apportes:
        "A bond that breathes with both people: a fine reading of the other, an adaptation without drama, transitions crossed without a jolt.",
      freines:
        "Choices left without a voice, desires voiced too late, decisions taken only to the other's taste. These are not flaws — just your suppleness, which has a price: adapting can blur into erasing yourself.",
      couple:
        "You bring shared initiatives, decisions taken with two voices, a bond that welcomes its own movements. To keep in mind: with someone who chooses a lot, the fluidity can follow a single thread — the relationship becomes softer than reciprocal, without anyone wanting it.",
      equilibre:
        "Keep your voice in the choices, even small ones, even when all is well. Not because adjusting would be wrong, but because your suppleness is worth even more when it starts from a visible center.",
    },
  },

  '1.3': {
    // V1 — La Clarté intérieure : The Inner Clarity.
    V1: {
      intro:
        "Your archetype reveals a person who finds words early for what is lived inside. You are one of those who know what they feel, even when several emotions mix — you perceive mood changes before they settle and you find words where others stay blurry. Your watchpoint: your mastery can become a wall — you are so good at managing alone that help has no room left to enter.",
      devise: "I name what I feel, and that already changes the situation.",
      apportes:
        "A calm that reassures: tensions get named early, drama backs off. You often become the point where things become clear again, in a couple as among friends.",
      freines:
        "Emotions analyzed more than lived, waves settled in silence without a witness, moments where naming replaces feeling. These are not flaws — just your strengths seen from the side where they overflow, when method replaces sharing.",
      couple:
        "You bring words placed, not thrown, and solutions sought together rather than blame. To keep in mind: you can be so good at managing alone that the other stops offering help — while a hand during the wave often shortens the trip.",
      equilibre:
        "Let someone stand beside you during the wave. Not because your clarity would lack depth, but because asking for help can be done small — a word, a sign, a door left ajar.",
    },
    // V2 — Le Volcan tendre : The Tender Volcano.
    V2: {
      intro:
        "Your archetype reveals a person who lives their emotions like fast seasons: everything arrives strong, early, and nothing stays lukewarm. You are one of those whose annoyance rises fast and falls almost as fast, whose good news raises the whole table. Your watchpoint: the rise can outrun everyone — and speak louder than the reason that triggered it.",
      devise: "I feel strongly, I come down fast, and it always stays true.",
      apportes:
        "An energy that carries people along and a truth that isn't played: a joy that shows and is shared, quick apologies after an outburst, emotions owned out loud.",
      freines:
        "The blow-ups, the words too many mid-rise, the regrets that follow the outburst. These are not flaws — just an intensity that sometimes overflows its bed, and that learns, wave after wave, to warn.",
      couple:
        "You bring a sincere warmth, without calculation, and emotions shared live, not deferred. To keep in mind: the other may answer the tone while the substance still waits its turn — some margin while the wave falls changes everything.",
      equilibre:
        "Know what you want to protect when the wave rises. Not because you should feel less, but because spotting your first signal early enough lets you choose the word, the pause or the exit — before the wave decides alone.",
    },
    // V3 — Le Réservoir : The Reservoir.
    V3: {
      intro:
        "Your archetype reveals a person who lives their emotions far from the surface: they work in depth, under a calm appearance. You are one of those who neither dissect nor declare them — they cross. You bring a precious stability: no storm, a presence that lasts. Your watchpoint: your silence stays a choice as long as it isn't the only language spoken — what goes unsaid can end up creating distance.",
      devise: "I live my emotions in depth, without displaying them.",
      apportes:
        "Calm under pressure: rare but weighed words, worth double, a quiet loyalty to loved people — the great tides don't become shows.",
      freines:
        "Emotions crossed in silence without a witness, unsaid expectations that pile up, signs so discreet that nobody reads them. These are not flaws — just a depth that hasn't yet found a common language with the surface.",
      couple:
        "You bring a stability for two, far from roller coasters, and patience for confidences that arrive late. To keep in mind: you can wait to be read while the other waits to be told — two legitimate waits that rarely cross without a word placed out loud.",
      equilibre:
        "Say early enough what is happening, before it passes. Not because every wave should be declared, but because some simply gain from being named once — even after the fact.",
    },
    // V4 — Le Radiateur : The Radiator.
    V4: {
      intro:
        "Your archetype reveals a person who is a place where others feel better. You are one of those who praise, comfort, celebrate other people's good news as if it were theirs — a warmth that sets people right and an ear one doesn't forget. Your watchpoint: you can become the pillar that never asks — your own waves wait, quietly, in line.",
      devise: "I take care of the hearts around me, naturally.",
      apportes:
        "An address people naturally turn to when things are wrong: a rare and judgment-free ear, the joys of others celebrated as one's own, the early spotting of those doing poorly.",
      freines:
        "The “I'm fine” said too fast, your own emotions left in the waiting line, the silent exhaustion of the place where everyone lands. These are not flaws — just a generosity that also needs a place to rest.",
      couple:
        "You ask “and you?” and you wait for the real answer — the other opens up without at once taking back the pillar role. To keep in mind: you can become the place where the other drops everything — the balance can shift without anyone deciding it, so much your generosity seems to allow it.",
      equilibre:
        "Answer true when asked how you are. Not because holding up would be a problem, but because your turn of wave deserves to arrive — with a chosen person, when the moment lends itself.",
    },
    // V5 — La Réserve : The Reserve.
    V5: {
      intro:
        "Your archetype reveals a person who lives a rich, held, intimate emotional life: outside the calm, inside everything is alive. You are one of those for whom it isn't coldness but modesty — the openings are chosen, rare, precise. Your watchpoint: your reserve can be taken for indifference, while inside everything lives — one word announcing your style spares many misunderstandings.",
      devise: "I feel a lot, I show little — everything is alive inside.",
      apportes:
        "A deep loyalty to bonds and confidences that mark: when you open a door, it is chosen — and the people who receive it feel it.",
      freines:
        "Emotions invisible from outside, modesty read as distance, openings postponed too long. These are not flaws — just a modesty that is tuned by a sign, not by a speech.",
      couple:
        "You build by degrees, not all at once: bonds that respect the rhythms of opening, constancy rather than grand declarations. To keep in mind: writing first, voice after — what you open first is worth gold, just say it is your style.",
      equilibre:
        "Let show a bit of what lives inside, a little earlier than usual. Not because your reserve would need fixing, but because a single opening is often enough for the other to understand the rest.",
    },
    // V6 — L'Apprenti·e : The Apprentice.
    V6: {
      intro:
        "Your archetype reveals a person who is learning to read what moves inside them: clear at times, tangled at others — that is the normal rhythm of learning. You are one of those who answer “I don't know yet” and look for clues: a knot in the stomach, an irritability. Your search is sincere, without pretense. Your watchpoint: the discouragement of days when progress looks slow — not knowing how to name has never meant not feeling.",
      devise: "I don't always know — and I learn, step after step.",
      apportes:
        "Truth, even when it's blurry: a sincere search about oneself, real progress at each step, a humility that grants the right to learn.",
      freines:
        "Emotional conversations dodged out of caution, states recognized long after the fact, the fogs of days without compass. These are not limits of character — the fog is part of the road.",
      couple:
        "You bring a sincerity valued even when the answer isn't ready: simple questions, not interrogations. To keep in mind: an honest “I don't know yet” can be heard as a refusal — say it as a search in progress, and the other will follow the work site with you.",
      equilibre:
        "Grant yourself the right to still be learning. Not because one should arrive fast, but because each emotion named once is better recognized the next time — the road pays along the way.",
    },
  },

  // ------------------------------------------------ Quête 1.4 (Monde 2)
  // Mission 3-c : lib/quete-1-4-arche.ts existe → traduit ici (clé '1.4').
  '1.4': {
    // V1 — L'Artisan·e : The Artisan.
    V1: {
      intro:
        "Your archetype reveals a person who holds what they decide. You are one of those who turn a decision into a fact: the limit holds, the promise gets verified. It isn't military discipline — it's a trust you grant yourself, day after day. Your watchpoint: the day you slip, you can judge yourself without mercy.",
      devise: "I decide for real: what I choose, holds.",
      apportes:
        "A simple ground: your word gets verified, your yes is reliable, your no is solid. Others can rest their plans on yours — without watching, without guessing. That quiet reliability puts them at ease.",
      freines:
        "The unexpected that overflows the plan, the emotion without a dated reason, the unplanned disorder. These are not flaws — just what emerges when the solid meets what fits no plan.",
      couple:
        "You enjoy a bond that holds over time: clear agreements, shared habits, an essential that doesn't move. To keep in mind: your reliability builds a ground — watch that it doesn't become a ceiling.",
      equilibre:
        "Let an unexpected event enter without putting it back in line. Not because the plan would be bad, but because a life is also shared where there is nothing to fix.",
    },
    // V2 — Le Juste-Milieu assumé : The Owned Middle Ground.
    V2: {
      intro:
        "Your archetype reveals a person who knows how to rank things. You are one of those who keep the essential standing and let the rest negotiate. Your control is not armor: it is a hierarchy. Your watchpoint: the border between flexible and tired sometimes blurs.",
      devise: "I hold what counts, and I let go of what doesn't count.",
      apportes:
        "A constancy where it counts: what doesn't move in you is reliable for everyone. You offer tuning, not rigidity — the essential protected, the rest breathable.",
      freines:
        "The promises postponed to “next time”, the days when the thread lets go under tension. These are not flaws — just what emerges when the balance tunes itself alone, without a witness.",
      couple:
        "You enjoy a relationship where the essential is no longer discussed, and where the rest has room. To keep in mind: your commitments can split in two — solid in front of others, flexible in private. Say the rule of the day rather than let it be guessed.",
      equilibre:
        "Check which side you are on — flexible or tired — before giving up on a limit. Not because letting go would be bad, but because a clear border also protects your suppleness.",
    },
    // V3 — Le·La Vivant·e : The Alive One.
    V3: {
      intro:
        "Your archetype reveals a person who starts again. You are one of those whose resolutions are sincere — and whose relapses are too. You adjust, you retry, you start again: a life that prefers the attempt to guilt. Your watchpoint: “this is the last time” loses its meaning from being repeated.",
      devise: "I move forward by sincere attempts — I miss, I adjust, I start again.",
      apportes:
        "A living spirit: you try, you miss, you retry — and you make change less frightening for everyone. Your tolerance for failure de-dramatizes other people's.",
      freines:
        "Promises that expire on the first Monday, rituals that never settle in. These are not flaws — just what emerges when the change counts more than the method that would carry it.",
      couple:
        "You enjoy a bond that lets you try again without grading you: the right to attempt, the right to err. To keep in mind: the other may grow tired of believing “last times”. A repeated landmark reassures more than one big night.",
      equilibre:
        "Choose a ritual rather than a promise. Not because you would lack will, but because a repeated landmark holds better than a heroic decision.",
    },
    // V4 — Le·La Cédant·e de bonne foi : The Good-Faith Yielder.
    V4: {
      intro:
        "Your archetype reveals a person of good faith. You are one of those whose intentions are there — it's the thread between the intention and the impulse that breaks. You live it with humor, sometimes with weariness. Your watchpoint: “that's just how I am” can become a story you tell yourself.",
      devise: "I believe in myself longer than a Monday.",
      apportes:
        "A sincere presence without calculation: your desires show, your pardons come fast. You make life lighter around you — and failure less taboo.",
      freines:
        "Distant goals, close pleasures, Mondays without a witness. These are not flaws — just what emerges when the thread between the intention and the impulse breaks again.",
      couple:
        "You enjoy shared spontaneity: lively days, a bond without managing. To keep in mind: your restarts show to two — a planned departure that slips, and the other waiting. One promise at a time: small, kept, then the next.",
      equilibre:
        "One single promise in progress at a time — small, dated, finished. Not because your desires count less, but because each one kept rebuilds the trust you grant yourself.",
    },
    // V5 — L'Immédiat : The Immediate One.
    V5: {
      intro:
        "Your archetype reveals a person who lives in the present tense. You are one of those who answer the urge when it arrives — sincerely, without calculation, without hypocrisy. It is a whole way of existing. Your watchpoint: what you really — really — want sometimes asks for a delay.",
      devise: "The urge arrives, I answer — without calculation.",
      apportes:
        "A liveliness that makes days inhabited: you are there, wholly, for what arrives. With you, simple moments become lived moments.",
      freines:
        "Delays, accounts to give, dated promises. These are not flaws — just what emerges when the present carries all the weight of the decision.",
      couple:
        "You enjoy spontaneity for two: desires that get said, days that improvise. To keep in mind: the other needs kept dates to lean on. The wear of your word's credit shows around you first, not in you.",
      equilibre:
        "Give what you really want the delay it asks for. Not because the present would be a problem, but because what waits sometimes grows bigger.",
    },
  },
};

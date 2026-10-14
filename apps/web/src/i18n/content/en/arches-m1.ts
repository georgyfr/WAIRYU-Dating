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
    // Task 74 — miroir EN de la nouvelle voix : V1 reflète le TEXTE VERBATIM
    // du fondateur (« L'Élan chaleureux » → The Warm Spark), V2-V7 suivent le
    // même moule (« You, … » — plus de « Your archetype reveals… »).
    // V1 — L'Élan chaleureux : The Warm Spark.
    V1: {
      intro:
        "You, the new gives you energy. An unexpected idea, an improvised outing, a conversation that drifts in every direction: you say yes, and you bring the others along. Your curiosity is warm: you don't keep your discoveries to yourself, you share them.",
      devise: "I say yes to the new, and I bring others into it.",
      apportes:
        "You make the world bigger around you. With you, people dare, they try, they discover. And you invite the others to come along, rather than going alone.",
      freines:
        "When everything repeats, or when you have to wait for a long time, you get bored fast. It's the other side of your taste for the new.",
      couple:
        "You bring projects, surprises, a relationship where nothing falls asleep.",
      equilibre:
        "Come back now and then to what already counts for you. The new isn't a problem. But what begins has a better chance of lasting when your momentum also knows how to return to what you already love.",
    },
    // V2 — Le·La Bâtisseur·se : The Builder.
    V2: {
      intro:
        "You, what you promise engages you. You prepare, you finish what you start, you keep your word — even on small promises. It isn't rigidity: it's respect, the kind you have for things, for people, for your word.",
      devise: "I promise little, and I keep everything I promise.",
      apportes:
        "People can count on you, and they know it. What matters, they entrust to you — because with you it is kept, finished, respected. Your regular presence ends up becoming a landmark.",
      freines:
        "When an unexpected event upsets the plan, it hits you hard. It's the other side of your need for solidness.",
      couple:
        "You build a trust that gets verified: clear commitments, reassuring regularity.",
      equilibre:
        "Welcome an unexpected event without catching everything. Your need for solid isn't a problem. But what you build has a better chance of lasting when your solidness also knows how to breathe.",
    },
    // V3 — L'Étoile sociale : The Social Star.
    V3: {
      intro:
        "You, other people give you energy. You start the conversations, you connect people to each other, you turn a dull mood into a memorable moment. Your curiosity and your energy feed each other: the more you discover, the more you want to tell it.",
      devise: "I discover, I connect, I keep the energy circulating.",
      apportes:
        "You keep relationships alive. With you, an evening comes alive, people talk to each other, bonds get made. And you make it easy: nobody has to force their way into your energy.",
      freines:
        "When things stay quiet for too long, silence weighs on you. It's the other side of your need for movement.",
      couple:
        "You bring complicity, discoveries, a relationship that is alive.",
      equilibre:
        "Enjoy what doesn't move, too. Your energy isn't a problem. But it lasts longer when it also knows how to sit down, now and then, next to someone.",
    },
    // V4 — L'Ancre : The Anchor.
    V4: {
      intro:
        "You, you are a place where people feel better. Calm passes through you without breaking you; others feel it and lean on it. You don't try to shine: you try to do good, quietly, lastingly.",
      devise: "I stay grounded, and I do good quietly.",
      apportes:
        "You make people calmer around you. With you, people breathe, they tell things, they come back to what matters. And you ask nothing back — that is what makes your presence so precious.",
      freines:
        "When a situation lasts too long, you stay far longer than needed. It's the other side of your patience.",
      couple:
        "You bring a rare emotional safety: you listen, you last, you don't dramatize.",
      equilibre:
        "Count yourself in your own priorities. Your calm isn't a problem. But what you give has a better chance of holding when you are counted in it too.",
    },
    // V5 — L'Intense : The Intense One.
    V5: {
      intro:
        "You, you live things at full volume. Joys carry you, sorrows cross you, nothing leaves you neutral. This intensity that some call “too much” is also your depth: you notice what others walk past, you attach entirely, you remember everything.",
      devise: "I live things at full volume, and I never do them halfway.",
      apportes:
        "You make moments truer. With you, people laugh louder, they talk about what counts, nobody pretends. And bonds tighten, because you never do anything halfway.",
      freines:
        "When a wave rises, it crosses you entirely. It's the other side of your way of feeling. It also happens that a silly remark occupies you for hours — and that the world seems louder than for others.",
      couple:
        "You bring depth, passion, a bond without half-measures.",
      equilibre:
        "Grant yourself real descents after the waves. Feeling strongly isn't a problem. But this intensity has a better chance of lasting when it also knows how to rest.",
    },
    // V6 — L'Indépendant·e profond·e : The Deep Independent.
    V6: {
      intro:
        "You, you truly live in your inner world. Long thoughts, deep projects, one-on-one conversations that last for hours: you prefer depth to noise. Those who know you know that your calm hides a quiet fire.",
      devise: "I live in a vast inner world, and I open it my way.",
      apportes:
        "You truly listen. With you, a conversation goes down to where it goes, and the other feels chosen — because when you share your world, it is a choice. Those who enter your place don't forget it.",
      freines:
        "When the first contact has to be started, you wait. It's the other side of the way you protect your world. It also happens that people you would have loved pass by without knowing it.",
      couple:
        "You bring real intimacy: patience, depth, respect for the need for space.",
      equilibre:
        "Open your door a little earlier, even awkwardly. Your world isn't a problem. But it has a better chance of being shared when you let someone in before you have finished thinking it all.",
    },
    // V7 — L'Équilibriste : The Tightrope Walker.
    V7: {
      intro:
        "You, you fit no box — and nobody is lying: depending on the day, people describe you as adventurous, solid, lively or grounded. You hold a bit of everything: curiosity, constancy, heart, calm. And you adapt to many people without feeling disguised.",
      devise: "I am several things at once, and I hold my center.",
      apportes:
        "You put people at ease. Everyone finds a way to connect with you without having to justify themselves — that is a real gift. And your suppleness makes you easy company, even on hard days.",
      freines:
        "When you have to settle fast or hold a side for long, it jams. It's the other side of your ability to adapt.",
      couple:
        "You bring a rare acceptance: the other exists as they are, without having to choose a version of themselves.",
      equilibre:
        "Take a position out loud, once a day — a choice, a desire, a refusal. Adapting isn't a problem. But your versatility becomes a gift when it starts from a visible center.",
    },
  },

  '1.2': {
    // Task 76 — miroir EN de la nouvelle voix (moule « You, … », cf. 1.1) :
    // plus de « Your archetype reveals… », plus de « Your watchpoint » —
    // la vigilance vit désormais dans freines/couple/equilibre.
    // V1 — L'Ancrage : Anchored.
    V1: {
      intro:
        "You, the bond, you settle it for the long run. When it creaks, you say it, you repair early — and you stay. Closeness feeds you, distance doesn't scare you: your strength needs little — a steady presence, a calm that proves itself.",
      devise: "I stay, I repair, I trust the bond.",
      apportes:
        "You lay a foundation: people know where they stand, people know who stays. Your calm rests them, your snags get repaired fast, and your ordinary moments make the bond.",
      freines:
        "When the calm lasts, you can believe everything has been said. It's the other side of your steadiness. It also happens that you fix the other's worry too fast, before they have finished saying it.",
      couple:
        "You bring a presence that proves itself: you stay, you repair, you build quietly.",
      equilibre:
        "Say your attachment often enough that it can be heard outside. Your calm isn't a problem. But what is obvious to you has a better chance of being lived the same way by the other when you put it into words.",
    },
    // V2 — La Vigie : The Lookout.
    V2: {
      intro:
        "You, when someone matters, your heart wakes up. You spot mood shifts before anyone else, you take care through small gestures, and you are there on the hard days as on the ordinary ones. Your attention is whole: when you give, you give without counting.",
      devise: "I love strongly, I keep watch, I give without counting.",
      apportes:
        "You make people visible: noticed, expected, counted. Your loyalty is whole, and people feel safe inside your attention.",
      freines:
        "When silence settles in, your imagination works harder than necessary: a shorter word, a late message, and you search for what it means. It's the other side of your antenna.",
      couple:
        "You bring a rare depth: regular signs of love, a memory for small things, words said the moment doubt arrives.",
      equilibre:
        "Ask, instead of guessing, what worries you in the bond. Your antenna isn't a problem. But a question said out loud has a better chance of soothing a doubt than hours of interpreting.",
    },
    // V3 — L'Autonome : The Independent One.
    V3: {
      intro:
        "You, you belong to yourself first — and you love without wanting to lose yourself. You cross your storms on your own side, you take air when it gets dense, and you come back when you have breathed. Your love is calm and steady, without drama.",
      devise: "I belong to my life, and I love with air.",
      apportes:
        "You bring trust without control. With you, nobody has to play a role: your own life feeds the relationship, and your returns are faithful.",
      freines:
        "When closeness gets dense, you step away — sometimes without a word. It's the other side of your need for air.",
      couple:
        "You bring respect for each person's rhythm, a relationship where each keeps their world.",
      equilibre:
        "Announce your pauses before taking them. Your need for air isn't a problem. But the way you take it decides whether the other stays invited or feels shut out — and one simple word is enough to change all of it.",
    },
    // V4 — Le Va-et-vient : The Come-and-Go.
    V4: {
      intro:
        "You, you love in two beats: when it counts, you commit fast and strong; then, closeness settled, part of you looks for air again. It is neither lightness nor oddity: it is a way of having learned to love.",
      devise: "I give myself fully, I breathe, I come back.",
      apportes:
        "You bring relief: an intensity that returns, lively reunions. When you are there, you are fully there — nothing becomes a usual background.",
      freines:
        "When closeness settles in, part of you wants air again — and your steps away sometimes leave before being said. It's the other side of your two-speed rhythm.",
      couple:
        "You bring an intensity that returns, beginnings that blaze, a whole presence when it is there.",
      equilibre:
        "Name your two speeds — once is enough. Your come-and-go isn't a problem. But it has a better chance of being lived as a rhythm — and not as fleeing — when the other no longer has to interpret it.",
    },
    // V5 — L'Équilibre en mouvement : Balance in Motion.
    V5: {
      intro:
        "You, your way of loving adjusts to the person in front of you: close when it's the need, quiet when it's the air. You cross both movements without drama — and that suppleness is rare: it gives the bond a comfort many people notice.",
      devise: "I adjust to the other, and I keep my voice.",
      apportes:
        "You read the other finely, and you adjust without drama. With you, the bond breathes: transitions get crossed without a jolt.",
      freines:
        "When everything is fine, your own wants arrive second, behind the adapting. It's the other side of your suppleness.",
      couple:
        "You bring decisions made in two voices, shared initiatives, a bond that welcomes its own movements.",
      equilibre:
        "Choose out loud, from time to time. Adjusting isn't a problem. But your suppleness is worth even more when it starts from a visible center — and that center is yours to keep.",
    },
  },

  '1.3': {
    // V1 — La Clarté intérieure (P haut + R haut) : The Inner Clarity.
    V1: {
      intro:
        "Your archetype reveals a double strength that your answers show on the same side: what happens inside you announces itself early and clearly, and you know your way back to calm. Knowing what you feel AND knowing how to cross it — this combination is rare, and it shows. Your watchpoint: the ease. You manage so well alone that help has no room left to enter — and some waves are better crossed with someone than with method.",
      devise: "I know what I feel, and I know my way back.",
      apportes:
        "A calm that reassures: tensions get named early, drama backs off. In a couple as among friends, you become the point where things become clear again.",
      freines:
        "Your shadow side has a precise address: self-reliance. You settle the waves in silence, without a witness — some would need one. And naming can replace feeling: what you can describe well hasn't always been crossed.",
      couple:
        "You bring words placed, not thrown, and ways back to calm that depend on nobody. To keep in mind: you can be so good at managing alone that the other stops offering help — while a hand during the wave often shortens the trip.",
      equilibre:
        "Let someone stand beside you during the wave. Not because your clarity would lack depth, but because asking for help can be done small — a word, a sign, a door left ajar.",
    },
    // V2 — Le Volcan tendre (P haut + R bas) : The Tender Volcano.
    V2: {
      intro:
        "Your archetype reveals a gap your answers mark clearly: you catch early what rises in you — and the way back to calm is your slow link. You see the wave coming; you don't cross it as fast as you see it arrive. That combination — clear sight, slow descent — is what makes your intensity. Your watchpoint: between the rise and the descent, every strong emotion is lived in full.",
      devise: "I see the wave coming — the way down is what takes me.",
      apportes:
        "You know what you feel, fast and precisely — that is rare. Many discover their states after the fact; you can name them in the moment. It makes for true conversations, early.",
      freines:
        "The cost is measured, not guessed: your feeling arrives fast, the calm arrives late. In between, the words too many slip in — not because you exaggerate, but because the brake arrives after the accelerator. You know the regrets that follow the blow-ups.",
      couple:
        "You see everything right away — the other, not always. Your impatience isn't domination: it is your inner clock. To keep in mind: what rises in you in one minute can take ten in the other — the margin is yours to give.",
      equilibre:
        "Warn rather than hold. Your first physical signal — throat, fists, stomach — arrives before the wave. Spotting it buys you thirty seconds: often enough to choose the word instead of enduring it.",
    },
    // V3 — Le Réservoir (P bas + X bas) : The Reservoir.
    V3: {
      intro:
        "Your archetype reveals a double discretion: what happens inside you announces itself after the fact, and little shows outside. Nothing here says you feel little — what your answers draw is an inner life that doesn't go through display or instant announcing. Your watchpoint: what you don't name, the other can neither guess nor count.",
      devise: "It lives strongly inside — it gets declared late, and little.",
      apportes:
        "A presence that doesn't crowd: no staging, no displayed storm. Those who know you well know how to read your small signs — in you, they are worth declarations.",
      freines:
        "The cost is silence. Unsaid expectations pile up; the other may believe in indifference where everything is alive — and the waiting becomes distance. It isn't a flaw: it is what your discretion produces when nobody gives it a language.",
      couple:
        "You build by degrees, far from roller coasters. To keep in mind: you can wait to be read while the other waits to be told — two legitimate waits that never cross alone. One word placed out loud unlocks them.",
      equilibre:
        "Name it after the fact, once: “yesterday I was angry — I couldn't say it in the moment.” Late clarity is better than complete silence — and it trains the next one.",
    },
    // V4 — Le Radiateur (X haut seul) : The Radiator. P and R NOT guaranteed.
    V4: {
      intro:
        "Your archetype reveals one simple, measured thing: with you, it shows and it gets said. Your answers describe someone who expresses — praising, comforting, saying what people mean. Your watchpoint is mechanical: when the exit is always taken by others, your own turn rarely arrives.",
      devise: "What I live gets said — and it does good around.",
      apportes:
        "An address people naturally turn to: an ear that shows, the joys of others celebrated as one's own, emotions that circulate because you make them circulate.",
      freines:
        "Your own emotions in the waiting line. Nothing here says you don't feel them — what your answers mark is that the exit, itself, is taken. A pillar that never sits down wears out in silence: that is your shadow.",
      couple:
        'You ask "and you?" and you wait for the real answer. To keep in mind: the balance can shift without anyone deciding it — so much your generosity seems to allow it. Saying your states once a week keeps it alive.',
      equilibre:
        "Answer true when asked how you are — with a chosen person, once a week. Your turn of wave deserves to arrive: that is what keeps the radiator durable.",
    },
    // V5 — La Réserve (P correct + X bas) : The Reserve.
    V5: {
      intro:
        "Your archetype reveals a precise gap: you catch what is lived inside you, and you don't show it. Clear feeling, quiet display — it isn't coldness: it is a reserved access. Your watchpoint: what you see clearly, the other doesn't see — and they won't guess alone.",
      devise: "I know what I feel — I choose who knows it.",
      apportes:
        "Openings that count: when you open, it is chosen — and the people who receive it feel it. The trust you grant carries a value no abundance has.",
      freines:
        "The misunderstanding is structural: your inside is clear to you, invisible to the other. The reserve can be read as distance — and some doors wait too long before opening.",
      couple:
        "You build by degrees: bonds that respect your rhythm of opening, constancy rather than grand declarations. To keep in mind: writing first, voice after — and say it is your style: what you open, chosen, is worth gold.",
      equilibre:
        "Let show a bit of what lives inside, a little earlier than usual. One single opening is often enough for the other to understand the rest.",
    },
    // V6 — L'Apprenti·e (fallback) : no marked combination — profile in motion.
    V6: {
      intro:
        "Your archetype reveals a profile with no dominant string: your three strengths — perceiving, soothing, expressing — stay close to one another in your answers. Neither very present, nor very quiet: your emotional way is still taking shape. Your watchpoint: the day it rises strongly, you don't have a signature reflex yet — and one can confuse the absence of a compass with the absence of feeling.",
      devise: "No signature muscle yet — I build it, answer after answer.",
      apportes:
        "Truth, even when it's blurry: your answers say a profile in motion, with no ready-made box — and that is the most honest starting point.",
      freines:
        "Without a dominant string, no obvious reflex: the days without a compass come, and with them the urge to conclude \"I feel nothing\". The second sentence is almost always false — the fog is part of the road.",
      couple:
        "You bring a sincerity valued even when the answer isn't ready: simple questions, not interrogations. To keep in mind: an honest \"I don't know yet\" can be heard as a refusal — say it as a search in progress.",
      equilibre:
        "Grant yourself the right to be learning: each emotion named once is better recognized the next time. The road pays along the way.",
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

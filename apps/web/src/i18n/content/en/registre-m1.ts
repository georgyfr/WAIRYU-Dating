/**
 * Miroir EN du registre — MONDE 1 « Le Miroir » (quêtes 1.1 · 1.2 · 1.3).
 * Structure : L10n<QueteDef> par identifiant — seuls les champs AFFICHABLES
 * sont traduits (annonces, briefings, cartes, complétions, dims,
 * accompagnement, conseils, commentLire, ombreRelationnel, suite).
 * Les codes (Q1.x-…), variantes (V1…), clés de dims (O/C/E/A/S), deck(),
 * scorer() et choisirVariante() restent CÔTÉ FR — jamais recopiés.
 * Les tableaux respectent l'ORDRE et la LONGUEUR exactes du FR (fusion par
 * index) ; une chaîne absente = repli FR silencieux.
 */
import type { L10n } from '../../apply';
import type { QueteDef } from '../../../lib/quetes';

export const REGISTRE_M1: {
  '1.1'?: L10n<QueteDef>;
  '1.2'?: L10n<QueteDef>;
  '1.3'?: L10n<QueteDef>;
} = {
  '1.1': {
    titre: "Your Personality",
    sousTitre: "The first quest of the journey.",
    annonce:
      "58 statements. No right answer — only your answer. The one you think is expected is rarely yours.",
    briefing: {
      aQuoiCaSert: [
        "This is the first quest of your journey — the base of everything that follows.",
        "58 statements describe your way of being: your openness, your organization, your social energy, your kindness, your emotional stability.",
        "Out of it come your first card, your first mirror — and the first stones of your portrait.",
        "A few extra statements help keep encounters sincere. They are never seen — not in your portrait, not in your encounters.",
      ],
      resultats: [
        "Your card — your light and your shadow side, in a few words.",
        "Your inner tension — what you are trying to hold together.",
        "Your mirror — how you work, spelled out, with a concrete user's guide.",
        "The first stones of your portrait — what you discover here feeds the whole rest of the journey.",
      ],
      noteDiscrete:
        "Some answers are re-read by automatic honesty checks — they never change your card.",
    },
    cartes: {
      // Task 74 — V1 : « L'Élan chaleureux » → The Warm Spark (miroir du
      // renommage demandé par le fondateur).
      V1: {
        nom: "The Warm Spark",
        lumiere:
          "You are one of those people who make the world bigger. A fresh idea, an unknown cuisine, a conversation that veers off course: you say yes, and you bring others along. Your curiosity is warm — it wants to share. People feel welcome in your momentum.",
        ombre:
          "Sometimes you choose the new out of fear that the same will become boredom — and what matters ends up waiting.",
        tension: "to live everything, without hurting anyone.",
      },
      V2: {
        nom: "The Builder",
        lumiere:
          "You are someone people can count on — and it shows. You keep your promises, you plan your days, you finish what you start. It isn't rigidity: it's respect. The kind you have for things, for people, for your word.",
        ombre:
          "Control has a cost — when everything derails, you accuse yourself first.",
        tension: "for everything to be solid, without it becoming a prison.",
      },
      V3: {
        nom: "The Social Star",
        lumiere:
          "You walk into a room and the air changes. You start conversations, you connect people to each other, you make evenings alive. Your curiosity and your energy feed each other: the more you discover, the more you want to tell it.",
        ombre:
          "Silence can feel like an empty space to fill — and you sometimes fill what deserved to be heard.",
        tension: "to be loved for your light, not only for your show.",
      },
      V4: {
        nom: "The Anchor",
        lumiere:
          "There are people around whom breathing is easier. You are one of them. Calm passes through you without breaking you; others feel it and lean on it. You don't try to shine: you try to do good, quietly, lastingly.",
        ombre:
          "Your stability can become a fortress — you sometimes give too much patience to situations that no longer deserve it.",
        tension: "to carry others without forgetting yourself.",
      },
      V5: {
        nom: "The Intense One",
        lumiere:
          "You live at full volume. Joys carry you, sorrows pass through you, nothing leaves you neutral. This intensity that some call “too much” is also your depth: you notice what others walk past, you love without counting, you remember everything.",
        ombre:
          "The world is sometimes loud for you — and you handle the storm without a manual.",
        tension: "to be fully in what you live, without it submerging you.",
      },
      V6: {
        nom: "The Deep Independent",
        lumiere:
          "Your inner world is vast — that is where you truly live. Long thoughts, deep projects, one-on-one conversations that last for hours: you prefer depth to noise. Those who know you know that your calm hides a quiet fire.",
        ombre:
          "You rarely make the first contact — and some people you would have loved passed by without ever knowing it.",
        tension: "to protect your world without closing its door.",
      },
      V7: {
        nom: "The Tightrope Walker",
        lumiere:
          "Your profile fits no box — and that is a strength in disguise. You hold a bit of everything: curiosity, constancy, heart, calm. People describe you as hard to pin down and easy to love.",
        ombre:
          "Full profiles change slowly — check that you are still changing, and not only holding.",
        tension: "to be many things, without scattering into none of them.",
      },
    },
    completion: {
      entete: "🧭 QUEST COMPLETE — “Your Personality”",
      labelOmbre: "Your shadow side:",
      labelTension: "Your inner tension:",
      fenetre:
        "Somewhere, someone is answering these same questions. The day your cards cross, they will have a lot to say to each other.",
      miroirNote:
        "Your mirror — the complete reading of how you work — arrives at the next step of the journey.",
    },
    dims: [
      {
        nom: "Your openness",
        sousLigne: "the new, ideas, curiosity",
        lecture:
          "This bar says how much the new calls to you: unexpected ideas, unknown places, people who think differently. Full: you explore and carry others along in your momentum. Quiet: you love what lasts, and your constancy is a strength for those around you.",
      },
      {
        nom: "Your organization",
        sousLigne: "what you promise, what you finish",
        lecture:
          "This bar says what you hold: promises kept, things finished, plans followed. Full: people can count on you, and they know it. Quiet: you improvise, and your flexibility just needs a backbone in the weeks when everything arrives at once.",
      },
      {
        nom: "Your social energy",
        sousLigne: "people, noise, silence",
        lecture:
          "This bar says where your energy comes from: the crowd or the calm. Full: people recharge you and you shine in groups. Quiet: silence rebuilds you, with few people but real ones. Neither is better — they are two different engines.",
      },
      {
        // Task 74 — miroir du renommage FR « Ta franchise bienveillante » :
        // les items parlent de franchise et de générosité, pas de confiance.
        nom: "Your kind candor",
        sousLigne: "the bond, trust, candor",
        lecture:
          "This bar says how you give: quick trust or attentive prudence. Full: the bond comes before winning, you listen and you give without counting. Quiet: trust is earned with you — and your candor, well dosed, protects your relationships.",
      },
      {
        nom: "Your emotional stability",
        sousLigne: "the waves, the calm, the return",
        lecture:
          "This bar says how you cross the waves: settled quickly or carried for long. Full: others lean on your calm, often without saying so. Quiet: you feel strongly and for long — a fine antenna, not a weakness.",
      },
    ],
    accompagnement: {
      // Task 74 — miroir EN de la nouvelle voix (les 5 textes du fondateur
      // + les dix paliers au même moule « Small step: »).
      O: {
        fort: "The new attracts you: fresh ideas, different places, different encounters. You explore, and you easily understand other people's point of view. Small step: keep at least one stable landmark (a habit, a place, a person) so you don't scatter.",
        equilibre:
          "You love the new without chasing it: you explore when it's worth it, and you stay when it counts. Small step: now and then, dare the unknown just to see what it does inside you.",
        doux: "You love what lasts: the same faces, the same landmarks, the things one knows by heart. It isn't closing off: it's constancy. Small step: one small novelty a month, chosen by you, is enough to keep the door ajar.",
      },
      C: {
        fort: "What you promise, you keep. You like it when things are ordered, planned, finished — and people entrust you with what matters. Small step: when the unexpected arrives, leave it a room without living it as a failure.",
        equilibre:
          "You organize the essential and let the rest live. Your days have a structure, without being rigid. Small step: for the big deadlines, a bit of frame will serve you well.",
        doux: "You prefer to improvise: you organize when it's mandatory, not for pleasure. It works — until the day everything arrives at once. Small step: one appointment with yourself a week — ten minutes, one list — changes the tension of the rest.",
      },
      E: {
        fort: "Other people give you energy. You start conversations and set the mood without effort. Small step: keep quiet moments just for yourself too: that is what makes your energy last.",
        equilibre:
          "You are social when it makes sense, and quiet when it's needed. Big groups amuse you, one-on-ones nourish you. Small step: notice what you need after a long day of people.",
        doux: "Calm rebuilds you: few people, but real ones. You prefer listening to filling the silence — and those who know you know the value of what you say. Small step: daring one spontaneous gesture now and then opens doors that waiting would never see.",
      },
      A: {
        fort: "For you, the relationship comes before being right. You listen, you wait before judging, you give without counting. Small step: saying a clear no is also a gift — it makes your yeses truer.",
        equilibre:
          "You give a lot, and you know how to set limits: you don't let people walk over you. Small step: keep an eye on the people with whom you force yourself to be soft.",
        doux: "Trust is earned with you, and you have good reasons to have learned that. Small step: test trust in small touches rather than waiting for total certainty.",
      },
      S: {
        fort: "When the waves arrive, you stay standing. You find your calm quickly, and others lean on you, often without you saying a word. Small step: your stability is not armor: you are allowed to let others see what stirs in you.",
        equilibre:
          "You have calm days and storm days — it's human, and it's your rhythm. You already know what soothes you. Small step: do it early enough, before tiredness decides for you.",
        doux: "You feel strongly and for long — remarks, waits, scenarios. It isn't a weakness: it's a fine antenna. Small step: simple, repeatable gestures — a breath, a walk, a written note — shorten the way back to calm.",
      },
    },
    conseils: [
      "Reread your card with a rested head — tomorrow morning or after a real day: you will see other sentences stand out.",
      "Choose ONE sentence that surprises you and keep it in your pocket for a few days: watch where it proves true.",
      "No bar defines you: they describe your answer of today, not a box forever.",
      "Don't stick a label on yourself — full profiles change slowly: check that you are still changing.",
      "Keep your answers on this device: the next quest will build on what you have just discovered.",
    ],
    commentLire:
      "The five bars come from YOUR answers, right now. Each one goes from 0 to 100: the fuller the bar, the more your answers lean that way — and nothing else. They are neither grades nor boxes: they are a snapshot, the one of the person who answered today. Each bar is followed by what it looks at and what it says about you — read them like a portrait that speaks, not like a report card.",
    ombreRelationnel: {
      // Task 74 — V1 : miroir EN du texte verbatim du fondateur (2 paragraphes,
      // séparés par \n\n).
      V1:
        "Here is the main risk in a relationship: you start a project together with enthusiasm, then a new idea arrives and takes all the room. The other person may then wonder whether it really counted for you, or whether only the project excited you.\n\nWhat helps: say out loud when something still counts for you, even after you have moved on. A word back about what you started together, a small reminder, a promise kept. That way, the other person no longer has to run after your impulses: they know you stay.",
      // Task 77 — V2-V7 passent au cadre 2 ¶ de la V1 (« Here is the main
      // risk in a relationship: … » + « What helps: … »), miroir du FR.
      V2:
        "Here is the main risk in a relationship: everything is in order at your place, and the other ends up feeling graded — every misplaced thing becomes a case file. An unexpected event derails the plan, and you blame yourself first, even when nothing of it depended on you.\n\nWhat helps: announce your standards instead of making people guess them, and let the other do it their way now and then, without keeping score. When the other sees that their way of doing things has a place in your home, your solidity stops weighing: it carries.",
      V3:
        "Here is the main risk in a relationship: silences weigh on you, so you fill them. The other may mistake your speed for unavailability to what is slow — and wonder whether you are truly there when nothing moves.\n\nWhat helps: choose one person and one moment where you stay without filling. Chosen silence is not absence: that is where the bond goes down a floor, and where the other discovers they don't need to entertain you to interest you.",
      V4:
        "Here is the main risk in a relationship: your patience becomes a residence. You stay where others would have left long ago, and the time invested ends up weighing more than reality. Meanwhile, your own needs come last — and the other doesn't even see it.\n\nWhat helps: a regular check-in with yourself: “do I stay because it's good, or because I know how to stay?” And saying out loud what you carry, before it weighs. The honest answer protects your most precious good: your presence.",
      V5:
        "Here is the main risk in a relationship: the wave rises, it goes through you entirely, and carries the conversation away. The other may fear the storm without knowing it passes — and remember the tone longer than the substance.\n\nWhat helps: warn when you feel it rise — “it isn't you, it's the wave”. Four words that change everything, and a return to calm the other learns not to dread, because they now know it comes back.",
      V6:
        "Here is the main risk in a relationship: your inner world is so comfortable that the other knocks for a long time without knowing whether they are invited. Your silence can read as distance — while inside, everything is alive.\n\nWhat helps: open by small doors. Share a piece of your world first, even awkwardly. For someone who loves you, it is an invitation they may have been waiting for a long time — and would never dare to ask for.",
      V7:
        "Here is the main risk in a relationship: your adaptation is so broad that the other sometimes no longer knows what YOU want. Your own wants come second — and the other ends up deciding alone, without knowing it.\n\nWhat helps: take a position out loud, once a day — one choice, one want, one refusal. Your versatility becomes a gift when it starts from a visible center: people love someone hard to pin down, but nobody likes guessing blind.",
    },
    suite: {
      titre: "Your first mirror is set.",
      intro:
        "You have just discovered a part of you. But your personality is not your whole story: your heart has its own questions.",
      questions: [
        "How do you love?",
        "How do you attach?",
        "What happens when your emotions take over?",
      ],
      cta: "Discover how I attach",
    },
  },
  '1.2': {
    titre: "How You Attach",
    sousTitre: "The second quest of the journey.",
    annonce:
      "Everyone has their way of loving and being close. There is no wrong way — only your way. Knowing it already gives you better odds.",
    briefing: {
      aQuoiCaSert: [
        "There is no right way to attach — there is yours. This quest measures the two movements that describe your way of loving and being close.",
        "Your need for reassurance — what your heart does when someone matters to you: what you expect, what worries you, what soothes you.",
        "Your need for space — what you need to stay yourself in closeness: your air, your rhythm, your inner world.",
        "Out of it come your card — and, at the next step of the journey, your mirror: the complete reading of your way of loving.",
      ],
      resultats: [
        "Your card — your light and your shadow side, in a few words.",
        "Your inner tension — what you are trying to hold together.",
        "Your mirror — the complete reading of your way of loving, at the next step of the journey.",
        "The next stones of your portrait — your way of loving feeds everything that comes.",
      ],
    },
    cartes: {
      V1: {
        nom: "Anchored",
        lumiere:
          "You love without panicking. Closeness nourishes you, distance doesn't scare you: you know how to stay, you know how to let go. You simply name it yourself: you stay, you say it, you quickly repair what creaks in a life for two.",
        ombre:
          "Your balance can make you underestimate how much the other person, for their part, needs proof.",
        tension: "to love without watching over, to stay without holding back.",
      },
      V2: {
        nom: "The Lookout",
        lumiere:
          "You love strongly, and you keep watch. When someone matters, you think of them often, you sense mood shifts before everyone else, you are ready to do anything so it holds. And when you give, you give without keeping the books.",
        ombre:
          "The other person's silence speaks too loudly to you — and it almost always says something other than what you hear.",
        tension: "to be reassured without having to ask.",
      },
      V3: {
        nom: "The Independent One",
        lumiere:
          "You belong to yourself, and you don't want to lose that by loving. You handle your storms alone, you get air when it gets dense, you come back when you have breathed. Your love is calm, stable, drama-free.",
        ombre:
          "Your need for air can look like an escape to someone who doesn't know your language — say it before the other invents it.",
        tension: "to keep your space without the other feeling shut out of it.",
      },
      V4: {
        nom: "The Come-and-Go",
        lumiere:
          "Your heart has two speeds — and it's true, it is sometimes exhausting. When it matters, you want everything; and as soon as you have it, a part of you wants to take air again. It is neither lightness nor oddity: it is your way of having learned to love. It can be understood, it can be soothed, it can be told.",
        ombre:
          "The other may live your rhythm as contradictory signals — name it, and half the road is done.",
        tension: "to stay when you want to leave, to leave without looking like you're fleeing.",
      },
      V5: {
        nom: "Balance in Motion",
        lumiere:
          "You are neither in constant watch nor in systematic flight: your way of loving adjusts to the person in front of you. It is a rare suppleness — it only asks that the other follow you in their own movements.",
        ombre:
          "Suppleness has a price: people can believe you rarely choose out loud. Choose out loud, from time to time.",
        tension: "to adapt without erasing yourself.",
      },
    },
    completion: {
      entete: "🧭 QUEST COMPLETE — “How You Attach”",
      labelOmbre: "Your shadow side:",
      labelTension: "Your inner tension:",
      fenetre:
        "Somewhere, someone is answering these same questions. The day your cards cross, they will have a lot to say to each other.",
      miroirNote:
        "Your mirror — the complete reading of your way of loving — arrives at the next step of the journey.",
    },
    dims: [
      {
        nom: "Your need for reassurance",
        sousLigne: "what your heart seeks when someone matters",
        // Task 76 — miroir de la nouvelle voix (Pleine:/Légère: → Full:/Quiet:).
        lecture:
          "This bar says what your heart asks for when someone matters to you. Full: frequent, early proof — your heart keeps watch over the bond. Quiet: a steadiness that comes from you — a late message doesn't tell a story of the end of the world. No point is more solid than the other: what matters is knowing yours so you can say it.",
      },
      {
        nom: "Your need for space",
        sousLigne: "your air, your rhythm, your inner world",
        lecture:
          "This bar says how much air you need in closeness. Full: a lot — your inner world needs to breathe. Quiet: contact that feeds you without weighing on you. Knowing your rhythm spares you living it as a flaw — and making the other guess it.",
      },
    ],
    accompagnement: {
      // Task 76 — miroir EN de la nouvelle voix (2-3 phrases + « Small step: »).
      A: {
        fort: "When someone matters, your heart keeps watch: a silence, a shorter word, and you try to understand. This need for proof is not a flaw — it is your alarm system for the bond. Small step: ask clearly, at the right moment, rather than decode alone.",
        equilibre:
          "You like knowing where you stand, without living in expectation of signs. Proof reassures you, absence doesn't crush you. Small step: say what soothes you before doubt settles in.",
        doux: "You are at ease in the bond: a late message doesn't tell a story of the end of the world. Your serenity is a strength — but the other person may need more signs. Small step: say your steadiness out loud (“I am good, I am staying”) so it doesn't look like indifference.",
      },
      E: {
        fort: "You need your air: handling things alone, breathing between two moments, coming back when your inner cycle is done. It is your way of staying well. Small step: announce your pauses — an explained departure reassures, a silent departure worries.",
        equilibre:
          "You know how to be close and take air, depending on the person and the moment. Closeness doesn't smother you as long as it can pause now and then. Small step: say the movement before the other interprets it.",
        doux: "Closeness feeds you: spending time, sharing everything, being together without detours. It is a strength of availability. Small step: keep a corner just for yourself — that is what makes your presence a choice and not a habit.",
      },
    },
    conseils: [
      "Reread your card with a rested head, preferably after a real moment with someone who matters: you will see where it proves true.",
      "Think back to your last misunderstanding with someone close: reread your shadow side — did it look like that?",
      "Name your way to the other ONCE — “when I go quiet, it isn't you” or “when I ask, it's just to feel reassured”: one sentence is enough to change a lot.",
      "No way of loving is the right one: yours is observed, not judged.",
      "Keep your answers: the mirror of this quest will build on them at the next step.",
    ],
    commentLire:
      "Two bars, two movements of your heart: the need for reassurance and the need for space. Each goes from 0 to 100, drawn from your answers of today — the fuller it is, the more your answers lean that way. They don't oppose each other: they dance together, and it is their balance that draws your way of loving. Each bar is followed by what it looks at and what it says about you.",
    ombreRelationnel: {
      // Task 76 — miroir EN du cadre 2 ¶ du fondateur (« Here is the main
      // risk in a relationship: … » + « What helps: … », cf. 1.1 V1).
      V1:
        "Here is the main risk in a relationship: your calm becomes so silent that the other no longer knows where they stand — the proofs nobody gives end up looking like forgetting.\n\nWhat helps: say out loud what is obvious to you. An “I am good”, an “I am staying”, a look back at what you have built. What you live peacefully, the other needs to hear to live it the same way.",
      V2:
        "Here is the main risk in a relationship: an antenna so stretched toward the other that their silence becomes an event — you question, you check, you wait for a sign that doesn't come.\n\nWhat helps: ask clearly rather than decode. “I need to hear that everything is fine” is a strength: it is the asking that soothes, not the guessed answer.",
      V3:
        "Here is the main risk in a relationship: pauses taken in silence that the other lives as a departure — your need for air is legitimate, their uncertainty too.\n\nWhat helps: announce the movement before making it. “I'm taking some air, I'll be back.” The door stays open while you breathe — and the other stops counting the minutes.",
      V4:
        "Here is the main risk in a relationship: two speeds that the other lives as contradictory signals — everything, then air, then everything — without knowing which version of you will come back.\n\nWhat helps: name your rhythm once and for all. “When I pull away, it isn't the end: it's my rhythm.” One sentence said early turns a misunderstanding into known ground.",
      V5:
        "Here is the main risk in a relationship: an adaptation so fluid that your own wants fall behind the other's — and over time, you no longer know what you yourself want.\n\nWhat helps: choose out loud, from time to time. The restaurant, the weekend, the film. Your suppleness is worth even more when it starts from a visible center — and the other likes to know what YOU want, you.",
    },
    suite: {
      titre: "Your way of loving is set.",
      intro:
        "You now know how your heart attaches — and how much air it needs. What remains is the most alive of all: what you feel, and what you do with it.",
      questions: [
        "What do you do when an emotion rises in you?",
        "How do you name what you feel?",
        "Does what happens inside you show on the outside?",
      ],
      cta: "Discover how I feel",
    },
  },
  '1.3': {
    titre: "Your Emotions",
    sousTitre: "The third quest of the journey.",
    annonce:
      "Emotions are not chosen — but we learn to know them, to name them, to cross them. Here is your way.",
    briefing: {
      aQuoiCaSert: [
        "Emotions are not chosen. The way you get to know them is — that is what this quest looks at.",
        "Your perception — knowing what you feel, even when it's mixed: noticing early, telling close states apart.",
        "Your regulation — what you do when it rises: the gestures that soothe you, your way of returning to calm.",
        "Your expression — what shows and is said of you, and what it creates between others and you.",
        "Out of it come your card — and, at the next step of the journey, your mirror: the complete reading of your emotional life.",
      ],
      resultats: [
        "Your card — your light and your shadow side, in a few words.",
        "Your inner tension — what you are trying to hold together.",
        "Your mirror — the complete reading of your emotional life, at the next step of the journey.",
        "The next stones of your portrait — your emotional life feeds everything that comes.",
      ],
    },
    cartes: {
      V1: {
        nom: "The Inner Clarity",
        lumiere:
          "You know what you feel, you know what it does, you know how it passes. You have learned to name before exploding, to welcome before fleeing. This clarity is rare — and it shows, even when you say nothing.",
        ombre:
          "You can take yourself for a full stop: some emotions are crossed with help, not only with method.",
        tension: "to master without controlling.",
      },
      V2: {
        nom: "The Tender Volcano",
        lumiere:
          "You feel everything, strongly and early — but what arrives doesn't always ask permission. Your emotions sweep through you like fast seasons. What you live as overflowing, others would call pure passion.",
        ombre:
          "You know the regrets that follow the blow-ups. The work is not to feel less — it is to give warning.",
        tension: "to let the wave pass without it carrying away what matters.",
      },
      V3: {
        nom: "The Reservoir",
        lumiere:
          "Your emotions exist — they simply work in depth, under the surface. You don't dissect them, you don't display them: you cross them. Those who know you well know how to read the small signs that, in you, are worth declarations.",
        ombre:
          "What you don't say, the other cannot guess — and the waiting becomes distance.",
        tension: "to exist for yourself without disappearing for the other.",
      },
      V4: {
        nom: "The Radiator",
        lumiere:
          "With you, it shows and it gets said. You praise, you comfort, you celebrate others better than yourself. People naturally turn to you — you are a place where things get better.",
        ombre:
          "You give so much room to other people's emotions that yours end up in the waiting line.",
        tension: "to care for others without making it your address.",
      },
      V5: {
        nom: "The Reserve",
        lumiere:
          "You feel a lot — and you show little. Your emotions are rich, held, intimate. It isn't coldness: it is modesty. When you open up, it is chosen, and it is worth gold.",
        ombre:
          "Your modesty can be read as distance — you alone know that behind it, everything is alive.",
        tension: "to let in without opening everything.",
      },
      V6: {
        nom: "The Apprentice",
        lumiere:
          "You are learning to know what moves inside you — and it is a work site that pays at every step. Sometimes clear, sometimes tangled: that is the normal rhythm. The good news: everything that can be learned is waiting for you.",
        ombre:
          "Don't confuse “I don't know what I feel” with “I feel nothing” — the second sentence is almost always false.",
        tension: "to move forward without demanding to arrive.",
      },
    },
    completion: {
      entete: "🧭 QUEST COMPLETE — “Your Emotions”",
      labelOmbre: "Your shadow side:",
      labelTension: "Your inner tension:",
      fenetre:
        "Somewhere, someone is answering these same questions. The day your cards cross, they will have a lot to say to each other.",
      miroirNote:
        "Your mirror — the complete reading of your emotional life — arrives at the next step of the journey.",
    },
    dims: [
      {
        nom: "Your perception",
        sousLigne: "knowing what you feel, even mixed",
        lecture:
          "This bar says whether what happens inside you announces itself early and clearly (full) or is discovered after the fact, through the body or the reactions (quiet). It is the first step: you can only name what you notice — and everything else builds on it.",
      },
      {
        nom: "Your regulation",
        sousLigne: "what you do when it rises",
        lecture:
          "This bar says how it comes back down when it rises: you know your way back (full), or the wave carries you faster than you carry it (quiet). Good news: it is the most trainable of the three — a gesture repeated in calm becomes available in the storm.",
      },
      {
        nom: "Your expression",
        sousLigne: "what shows and is said of you",
        lecture:
          "This bar says what shows of you: emotions read from outside (full), or everything works inside (quiet). Both are styles — the right one is the one you can explain to the other: “I feel a lot, I show little” is precious information to give.",
      },
    ],
    // Task 65 — miroir EN de l'accompagnement réécrit (anti-barnum : le texte
    // énonce ce que le curseur MESURE, puis le levier — phrases universelles
    // supprimées). Même structure que le FR (fusion par index).
    accompagnement: {
      P: {
        fort: "Your cursor leans clearly toward perception: what happens inside you announces itself early and clearly — that is what your answers show. The point to watch: an understood emotion is not a settled emotion — the two are worked on together.",
        equilibre:
          "Your perception sits in the middle of the cursor: some states arrive clearly, others are discovered after the fact. Neither an ease nor a handicap — ground to be made precise. Your lever: name early — an \"I am annoyed\" said at 3 p.m. spares the explosion at 8 p.m.",
        doux: "Your cursor leans the other way: what happens inside you announces itself rather after the fact — through the body, the reactions, other people's feedback. It isn't an absence of emotion: it is information arriving late. Your lever: one simple question a day (\"what am I feeling, right now?\").",
      },
      R: {
        fort: "Your cursor leans clearly: when it rises, you know how to bring it down — your answers describe known gestures, a way back. Watchpoint: calming yourself alone must not become never asking for help.",
        equilibre:
          "Your regulation sits in the middle of the cursor: some days you hold the wave, others it carries you. That is what your answers draw — a path in progress, not a verdict. Your lever: spot YOUR first physical signal — it is the one that gives you the most time.",
        doux: "Your way back to calm is the slow link: when the wave arrives, it crosses you more than you cross it. It is measured, not judged — and it is the most trainable of the three: a gesture repeated in calm becomes available in the storm.",
      },
      X: {
        fort: "Your cursor leans clearly: with you, it shows and it gets said — your answers describe someone who expresses what they live and what people mean to them. Watchpoint: your own emotions deserve the same exit — they too are entitled to the short line.",
        equilibre:
          "Your expression sits in the middle of the cursor: you show depending on the moment and the person — neither a display window nor a fortress. That is what your answers draw. Your lever: one more sincere sentence a week — out loud, it changes relationships.",
        doux: "Your cursor leans toward kept feeling: little shows outside — that is what your answers show. It isn't coldness: it is a reserved access. Your lever: start with writing — a long message says what the voice still blocks.",
      },
    },
    conseils: [
      "Reread your card with a rested head — emotions read better outside the storm.",
      "Choose ONE emotion of the week and practice naming it early: it's the exercise that pays the most.",
      "Spot your first physical signal when it rises: it's your best early warning.",
      "Your perception, your regulation, your expression: three muscles, not three destinies — each week, one small step on one of them.",
      "Keep your answers: the mirror of this quest will build on them at the next step.",
    ],
    // Task 65 — miroir EN du commentLire (annonce l'ancrage : le membre
    // vérifie lui-même d'où vient chaque barre).
    commentLire:
      "Three bars, drawn from your answers of today: perceiving, soothing, expressing. Each goes from 0 to 100 — the fuller it is, the more your answers lean that way. Under each bar: the answers that weigh the most in the number, quoted as they are — you check for yourself where each tendency comes from.",
    ombreRelationnel: {
      V1:
        "In a relationship, your shadow side can give: the impression that you always handle things alone — your ease can hide that you too need help on some waves. What helps: let someone in on ONE emotion you handle poorly. Clarity grows stronger when it accepts a look.",
      V2:
        "In a relationship, your shadow side can give: outbursts that frighten more than they say — the other remembers the tone and may miss the substance. What helps: warn early (“it's rising, it isn't you”) and come back after: a quick repair is worth a thousand perfect warnings.",
      V3:
        "In a relationship, your shadow side can give: a silent depth the other doesn't know how to read — they may believe in indifference where everything is alive. What helps: agree on a small outward sign (a word, a gesture) that says “all is well inside”. Your depth becomes shareable without you changing.",
      V4:
        "In a relationship, your shadow side can give: people around you leaning so much on you that your own waves no longer have room to show. What helps: choose ONE person to tell your real states to, once a week. Turning the radiator around — that is what makes it durable.",
      V5:
        "In a relationship, your shadow side can give: a modesty read as coldness — the other can hardly imagine all that lives behind. What helps: writing first: a long message, a card — the voice will come. And tell the other it is your style: what you open, chosen, is worth gold.",
      V6:
        "In a relationship, your shadow side can give: moments where you say “I don't know what I feel” and the other lives it as a wall — when it is a work in progress. What helps: share the search out loud: “I don't know yet, but I'm digging.” It is a presence, not an absence.",
    },
    suite: {
      titre: "Your first world is complete.",
      intro:
        "Your personality, your attachment, your emotions — three mirrors, three lights. It is already a rare map: yours.",
      questions: [],
    },
  },
};

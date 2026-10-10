/**
 * Miroir EN du registre — MONDE 5 « Ton Héritage » (quêtes 4.1 → 4.3).
 * Structure : L10n<QueteDef> par identifiant — seuls les champs AFFICHABLES
 * sont traduits. Codes, variantes, dims (clés), pôles, fonctions : côté FR,
 * jamais recopiés. Les tableaux respectent l'ORDRE et la LONGUEUR exactes
 * du FR. Apostrophe ASCII U+0027 uniquement (leçon Task 45).
 *
 * 4.4 « Blessures et aisance » est une quête INVISIBLE (tissée chez 4.1/4.2,
 * aucun écran — Livrable M5-4.4) : aucune entrée registre pour elle.
 *
 * Neutralité normative absolue (doctrine M5) : 4.1 — the five ways of
 * growing up are equal, zero parental blame, no clinical vocabulary (the
 * tree is a conversation, never a "well-made" tree) ; 4.2 — calmed, in
 * motion, at work : three weathers, never stages of healing, nobody is
 * late ; 4.3 — listening is not an assessment, the page stays home, never
 * quoted, never shown.
 */
import type { L10n } from '../../apply';
import type { QueteDef } from '../../../lib/quetes';

export const REGISTRE_M5: {
  '4.1'?: L10n<QueteDef>;
  '4.2'?: L10n<QueteDef>;
  '4.3'?: L10n<QueteDef>;
} = {
  '4.1': {
    titre: 'Your relational tree',
    sousTitre: "The first heritage quest: what your family taught you without knowing it.",
    annonce:
      'Your family taught you things without knowing it — atmospheres, places, reflexes. Here, you look at them with care, in no courtroom.',
    briefing: {
      aQuoiCaSert: [
        "This is the first quest of your heritage: the atmosphere and the places of your early years, told in no courtroom.",
        "Eight statements, two readings: what was spoken at home, and the roles held very early.",
        "No statement blames anyone: a climate is told, not judged.",
        "At the end, a card — and a tree to sketch if you want: a conversation with yourself, never a 'well-made' tree.",
      ],
      resultats: [
        "Your card — your light, your shadow zone and your current tension, in a few words.",
        "Two bars — the climate of your origins and the weight of inheritances, as you lived them.",
        "Your relational tree, if you sketch it: a conversation with yourself, never graded.",
        "One more stone in your portrait — the journey ahead draws on it.",
      ],
    },
    cartes: {
      'CARTE-4.1-TABLE-QUI-DIT': {
        nom: 'The Table where words flow',
        lumiere:
          'Where you grew up, words flowed — emotions were spoken, disagreements got named and repaired. And your own voice holds: it counts as much as the peace of the group. You come from a table where talking was normal, and you kept your place there.',
        ombre:
          "Where everything is said, everything expects a quick answer. A partner who digests in silence can look like a wall — and your waiting weighs on them.",
        tension: "keeping your table warm, while letting the other take the time of their words.",
      },
      'CARTE-4.1-ROLE-LUMIERE': {
        nom: 'The Role in the light',
        lumiere:
          'Everything got said at home — and you held early the role you were given. You know how to carry a place, an attention, a reliability your people recognize. The table talked, and you held the house.',
        ombre:
          "The role held early becomes a coat that never comes off. In a couple, you may carry everything and ask for nothing — the reliable one's fatigue hides well.",
        tension: "naming one thing you no longer carry — the table holds without it.",
      },
      'CARTE-4.1-LECTEUR-SILENCES': {
        nom: 'The Reader of silences',
        lumiere:
          'Where you grew up, the essential was guessed more than spoken — you learned to read a house. And your opinion counts as much as the peace of the group: you know where you are going without needing it named.',
        ombre:
          'One who learned to guess keeps guessing — sometimes too much. A glance becomes a reproach, a pause becomes a decision — and the other feels understood before having spoken.',
        tension: "posing your reading as a question — not a verdict — the answer belongs to the other.",
      },
      'CARTE-4.1-PLACE-HERITEE': {
        nom: 'The Inherited place',
        lumiere:
          'You learned early to read a house and to carry it at once — the place that had to be held, you held it. The peace of the group often comes before your opinion: a deep loyalty that keeps what matters standing.',
        ombre:
          'The place held early weighs in silence. In a couple, the waiting moves: the other becomes the table you do not want to disturb — and your opinion piles up.',
        tension: "saying one thing you think and have not said — the peace gains in being true.",
      },
      'CARTE-4.1-SELON-LA-TABLE': {
        nom: 'The One who reads the table',
        lumiere:
          'Your origins vote neither silence nor speech, neither role nor voice: depending on the houses and the years, you adapt. You speak when it is right, you guess when it is useful, you hold when it matters.',
        ombre:
          'Flexibility reads poorly from outside: the partner looks for your rule of the moment. It exists — it is hard to guess, and the waiting can weigh.',
        tension: "giving one word of your current rule — the other finds the door in it.",
      },
    },
    completion: {
      entete: "🌳 QUEST COMPLETE — 'Your relational tree'",
      labelOmbre: 'Your shadow zone:',
      labelTension: 'Your inner tension:',
      fenetre:
        "Somewhere, someone is building their tree too. The day your cards cross, they will have a lot to say to each other.",
      miroirNote:
        'Your mirror — the full reading of your tree — arrives at the next step of the journey.',
    },
    dims: [
      {
        nom: 'The climate of your origins',
        sousLigne: 'what was named, what was guessed',
        lecture:
          "This bar tells how the atmosphere circulated at home. Full: emotions were named, disagreements got repaired. Light: the essential was guessed more than spoken. Both ways are equal — the bar describes an atmosphere, it grades nothing.",
      },
      {
        nom: 'The weight of inheritances',
        sousLigne: 'the roles held very early, the own voice',
        lecture:
          "This bar tells the weight of the inherited places. Full: the roles held very early still weigh, the peace of the group comes before your opinion. Light: your roles today look like choices. Both ways are equal — a loyalty and a voice, never a grade.",
      },
    ],
    accompagnement: {
      climat: {
        fort:
          "Where you grew up, the essential got said: emotions were named, disagreements got repaired. What helps: giving the other time to find their words — not every table speaks that fast.",
        equilibre:
          "Your origins mix the spoken and the guessed: depending on topics and years. It is a common in-between — neither a chatty table nor a mute house. What helps: telling your current rule to those who live with you.",
        doux:
          "Where you grew up, the essential was guessed more than spoken. You learned to read a house — a rare attention. What helps: posing your reading as a question now and then — what gets guessed gets checked.",
      },
      loyautes: {
        fort:
          "The roles held very early still weigh: the peace of the group often comes before your opinion. It is not immaturity — it is loyalty. What helps: naming one thing you no longer carry — the table holds without it.",
        equilibre:
          "Your roles today are part inheritance, part choice: you revisit some places, you keep others. What helps: telling apart what you keep from what keeps you.",
        doux:
          "Your roles look like choices: your opinion counts as much as the peace of the group. It is a voice that got built. What helps: keeping it generous — the table, too, is carried together.",
      },
    },
    conseils: [
      'Your tree is built in no courtroom: a climate is told, not judged.',
      "The five ways of growing up are equal — yours is respected as it is.",
      'The genogram stays a conversation with yourself: no imposed box, withdraw whenever you want.',
      "In a couple, tell what your tree taught you: inheritances carry better out loud.",
    ],
    commentLire:
      'Two bars, and they come from YOUR answers: the climate of your origins and the weight of inheritances — two readings of the same house. They run from 0 to 100 — not a grade, not a verdict. Fuller does not mean better: a chatty climate and a guessed house are equal, a heavy inheritance and a held voice are equal. What they look at and what they say about you are written below — read them like a portrait, never a courtroom.',
    ombreRelationnel: {
      'CARTE-4.1-TABLE-QUI-DIT':
        "In a relationship, your shadow zone can give: a table heating up when one wants to talk and the other weighs their words. What helps: letting the silence settle — a silence is not a refusal.",
      'CARTE-4.1-ROLE-LUMIERE':
        "In a relationship, your shadow zone can give: the reliable one who carries everything and asks for nothing. What helps: handing over one thing a week — the reliable one's fatigue hides well.",
      'CARTE-4.1-LECTEUR-SILENCES':
        "In a relationship, your shadow zone can give: the other understood before having spoken — and feeling short-circuited. What helps: swapping a reading for an open question.",
      'CARTE-4.1-PLACE-HERITEE':
        "In a relationship, your shadow zone can give: a harmony hiding a negotiation still to come. What helps: putting your opinion on the table early — the peace gains in being true.",
      'CARTE-4.1-SELON-LA-TABLE':
        "In a relationship, your shadow zone can give: a house with seasons the other cannot foresee. What helps: one word of rule per season — flexibility gets told.",
    },
    suite: {
      titre: 'What comes next on your journey',
      intro:
        "Your tree is set — the atmosphere, the places, the roles: everything is respected, nothing is judged. The next step goes down into your present: where you stand today, after your past stories — a weather, never a bulletin.",
      questions: [
        'What did your family teach you without knowing it — and what do you want to keep?',
        'At home, what got said — and what got guessed?',
      ],
      cta: 'Go down into your present',
    },
  },

  '4.2': {
    titre: 'Where you stand today',
    sousTitre: 'The weather of the present: where you are after your past stories.',
    annonce:
      'After the breakups, everyone has their own weather — yours is described, not graded. Here, you look at where you stand, with no stage and no stopwatch.',
    briefing: {
      aQuoiCaSert: [
        "This is the present quest: what your past chapters serve you, and the room they still occupy.",
        "Eighteen statements, three readings: integration, the state that works, the need for clarity.",
        "Calmed, in motion, at work: three weathers — nobody is late, none is a grade.",
        "At the end, a card — and a listening page, if you want: it stays with you.",
      ],
      resultats: [
        "Your card — your light, your shadow zone and your current tension, in a few words.",
        "Three bars — what the past serves you, the room it occupies, your need for clarity.",
        "A listening page, if you write it: never quoted, never shown.",
        "One more stone in your portrait — the journey ahead draws on it.",
      ],
    },
    cartes: {
      'CARTE-4.2-CHAPITRE-REFERME': {
        nom: 'The Closed chapter',
        lumiere:
          'Your past chapters serve you — they no longer weigh on you. You know what they taught you, the calm you brought back stayed, and new people you look at for who they are. A calm place, and it can be heard.',
        ombre:
          "The tidying of before is not the other's: a settled serenity can read as distance — the other's ember does not know your tempo.",
        tension: "telling how you tidied — the other will find their own tempo in it.",
      },
      'CARTE-4.2-PAGE-QUI-TOURNE': {
        nom: 'The Turning page',
        lumiere:
          'Some boxes are done, others wait: you are between two weathers, and it is honest. Some pages turn, others get re-read — and one clear word carries you long. This in-between lives at your pace.',
        ombre:
          'The swinging days exist: all goes well, then a detail rekindles the ember. The partner does not know in advance which of the two is here.',
        tension: "telling the other what rekindles you — the weather gains a bulletin.",
      },
      'CARTE-4.2-MAISON-EN-TRAVAUX': {
        nom: 'The House under renovation',
        lumiere:
          'Your story still occupies room — the past comes back up, the comparison works. It is not a flaw: it is a house under renovation, at your pace. Your need for reassurance says one simple thing: clarity helps you hold.',
        ombre:
          "A silence writes itself into worried scripts, a question lands on a building site. The repeated proof does not soothe — it wears both of you.",
        tension: "naming one precise fear to the other — clarity begins with it.",
      },
    },
    completion: {
      entete: "🌱 QUEST COMPLETE — 'Where you stand today'",
      labelOmbre: 'Your shadow zone:',
      labelTension: 'Your inner tension:',
      fenetre:
        'Somewhere, someone is looking at their own weather. The day your cards cross, they will have a lot to say to each other.',
      miroirNote:
        'Your mirror — the full reading of your weather — arrives at the next step of the journey.',
    },
    dims: [
      {
        nom: 'What the past serves you',
        sousLigne: 'what the past chapters taught you',
        lecture:
          "This bar tells what your past stories serve you. Full: they taught you something, and the calm holds. Light: the same pages still turn. Both are equal — a tidying and a work, never a grade.",
      },
      {
        nom: "The room the story occupies",
        sousLigne: 'the waking, the comparing, the present',
        lecture:
          "This bar tells how much room your old story still occupies. Full: the past comes back up, the comparison works — a house under renovation, not a flaw. Light: the past stays where it is, most of the time. Both places are equal — a weather, never a stage.",
      },
      {
        nom: 'Your need for clarity',
        sousLigne: 'the reassurance, the re-reading, the silence',
        lecture:
          "This bar tells your need for reassurance. Full: hearing that it is solid helps you hold — a legitimate need. Light: one clear word carries you long. Both rhythms are equal — a need for clarity, never a verdict.",
      },
    ],
    accompagnement: {
      intégration: {
        fort:
          "Your past chapters serve you: you know what they taught you, and the calm holds. What helps: telling how you tidied — the other will find their own tempo in it.",
        equilibre:
          "Some pages turn, others get re-read: your past serves you sometimes, weighs on you sometimes. It is an honest in-between. What helps: letting both cohabit — nothing is late.",
        doux:
          "The same pages still turn: what those stories taught you waits to be named. It is not a failure — it is a work. What helps: one question at a time — 'what did it teach me' rather than 'why again'.",
      },
      état: {
        fort:
          "Your story is boxed up: the past stays where it is, most of the time. What helps: keeping room for the other's weather — it does not follow your calendar.",
        equilibre:
          "The past comes back up in touches: a first name, a song. The door to the present still opens. What helps: announcing the swinging days — the weather gains a bulletin.",
        doux:
          "The story occupies room: the waking, the comparing, the present to defend. It is not a flaw — a house under renovation. What helps: one precise fear at a time, said quietly — clarity begins with it.",
      },
      réassurance: {
        fort:
          "You ask for reassurance, and the other's silence writes worried scripts: clarity helps you hold. The need is legitimate. What helps: naming the precise fear — repetition wears, a precise request soothes.",
        equilibre:
          "One clear word carries you long, with relapses of re-reading: your need for clarity breathes. What helps: saying when the checking loops — the other can help you set the loop down.",
        doux:
          "You trust what is built, without repetition: the quiet reserve. What helps: hearing that the other, sometimes, needs the opposite — two rhythms of clarity, both are equal.",
      },
    },
    conseils: [
      'Your weather is described, not graded: calmed, in motion, at work — three equal places.',
      'Nobody is late: the road has no imposed schedule.',
      'Your need for clarity is legitimate: saying it precisely beats repeating it.',
      'The listening page, if you write it, stays with you — never quoted, never shown.',
    ],
    commentLire:
      "Three bars, and they come from YOUR answers: what the past serves you, the room it occupies, your need for clarity — three angles of where you stand. They run from 0 to 100 — not a grade, not a verdict. Calmed, in motion, at work: three weathers, no stage — nobody is late. What they look at and what they say about you are written below — read them like a weather, not a bulletin.",
    ombreRelationnel: {
      'CARTE-4.2-CHAPITRE-REFERME':
        "In a relationship, your shadow zone can give: a serenity taken for detachment. What helps: telling your tidying — it gives the other their own tempo.",
      'CARTE-4.2-PAGE-QUI-TOURNE':
        "In a relationship, your shadow zone can give: a weather that changes without a bulletin. What helps: announcing the swings — they are not chosen, they are announced.",
      'CARTE-4.2-MAISON-EN-TRAVAUX':
        "In a relationship, your shadow zone can give: repeated proofs that wear both of you. What helps: naming the precise fear — clarity begins with it, and it soothes more than repetition.",
    },
    suite: {
      titre: 'What comes next on your journey',
      intro:
        "Your present weather is set — calmed, in motion or at work: three equal places, no grade. The last step of the world listens to you: an open page for what your relationships taught you — if you want, and your way.",
      questions: [
        'What have your past chapters served — and what would you still make of them?',
        'What in your present waits to be tidied?',
      ],
      cta: 'Open the listening page',
    },
  },

  '4.3': {
    titre: 'What your relationships taught you',
    sousTitre: 'The listening page: what your relationships taught you, your way.',
    annonce:
      'One page, if you want — what your relationships taught you, your way. What you write stays with you: nothing will be quoted, nothing will be shown.',
    briefing: {
      aQuoiCaSert: [
        "This is the last quest of the world: a listening page, not an assessment.",
        "One open question, one free field — no minimum length, no trap.",
        "You can write nothing: 'I'd rather not say' is a complete answer.",
        "What you write stays with you — never quoted, never shown.",
      ],
      resultats: [
        "A simple closing screen — nothing to read, nothing to interpret.",
        "Your page, if you write it: it stays on this device, never shown.",
        "The 'Your Heritage' world closes — your portrait keeps one more stone.",
      ],
    },
    completion: {
      entete: "🌳 QUEST COMPLETE — 'What your relationships taught you'",
      labelOmbre: 'Your shadow zone:',
      labelTension: 'Your inner tension:',
      fenetre:
        'Somewhere, someone is writing their own page. The day your paths cross, your stories will have a lot to say to each other.',
      miroirNote: 'No analysis, no grade: listening is not an assessment.',
    },
    conseils: [
      'Write the way you speak: the page welcomes, it does not grade.',
      'No minimum length: three words or three lines, both are equal.',
      "You can write nothing: 'I'd rather not say' is a complete answer.",
      'Your page stays with you — never quoted, never shown.',
    ],
    commentLire:
      "There is nothing to read here: no bar, no card, no score. Your page stays with you — the engine keeps it, the interface never shows it.",
    suite: {
      titre: 'What comes next on your journey',
      intro:
        "Your page is yours — written or not, it stays with you. Your heritage is set: the tree, the present, what your relationships taught you. The journey ahead looks at your heart: your loving style, the way you express affection.",
      questions: [
        'What have your relationships taught you that you want to carry on?',
        'What place do you give to what it taught you — yours, not the others?',
      ],
    },
  },
};

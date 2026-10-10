/**
 * MIROIR EN des ARCHÉTYPES — MONDE 5 « Ton Héritage » (quêtes 4.1 → 4.2 ;
 * 4.3 n'en a pas — tâche d'écriture sans carte, exemptée par design).
 *
 * Par variante, les 6 champs du gabarit fondateur : intro (« Your archetype
 * reveals… » + point de vigilance) · devise à la 1ʳᵉ personne · apportes ·
 * freines (« They are not flaws — just what shows up when… ») · couple
 * (« Keep in mind: … ») · equilibre (« Not because…, but because… »).
 * Ton : you, simple et littéral, chaleureux, phrases courtes.
 * Neutralité (doctrine M5) : 4.1 — the five ways of growing up are equal,
 * zero parental blame, no clinical vocabulary ; 4.2 — three weathers, never
 * stages of healing, nobody is late. Apostrophe ASCII U+0027 uniquement.
 */
export const ARCHES_M5: {
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
  '4.1': {
    'CARTE-4.1-TABLE-QUI-DIT': {
      intro:
        "Your archetype reveals a person who comes from a table where words flowed — and who holds their voice without breaking the table. You say what you think, and you leave room for others. Your watch point: a silence is not a wall — it asks without guessing.",
      devise: 'My place is a table: words flow on it, and everyone holds their voice.',
      apportes:
        "A warmth that speaks: with you, misunderstandings get named fast and repaired faster. With you, people learn that speaking is not hurting — it is inhabiting.",
      freines:
        "The expectation of an instant answer can weigh: the one who weighs their words is not the one who shuts down. They are not flaws — just what shows up when the table always answered fast.",
      couple: 'Keep in mind: give the other the time of their reply — the topic survives the night.',
      equilibre:
        "Pose a question instead of an answer — Not because your reading is wrong, but because the answer belongs to the other.",
    },
    'CARTE-4.1-ROLE-LUMIERE': {
      intro:
        "Your archetype reveals a reliable person who holds a place given very early. The table talked at home, and you learned to carry a house. Your watch point: the given role is not an identity — it also rests.",
      devise: 'My strength is a house: I hold it, and I know who I am when people count on me.',
      apportes:
        "A reliability that shows: you commit, you show up, your people trust you. With you, a project stands — and the table is always set.",
      freines:
        "Being reliable until you erase yourself from the list: carrying everything and asking for nothing tires in silence. They are not flaws — just what shows up when the role came before the choice.",
      couple: 'Keep in mind: name one thing you no longer carry — the table holds without it.',
      equilibre:
        "Ask for help before the fatigue — Not because you cannot hold, but because holding together weighs less.",
    },
    'CARTE-4.1-LECTEUR-SILENCES': {
      intro:
        "Your archetype reveals a person who learned to read a house where the essential was guessed — and who knows where they are going, even without it being named. Your watch point: what gets guessed gets checked — or it lives alone.",
      devise: 'My compass is silent: I read the houses, and I hold my voice.',
      apportes:
        "A rare attention: you perceive what others do not say. With you, the unspoken becomes readable — and nobody has to shout to be heard.",
      freines:
        "The reading that runs ahead: a glance becomes a reproach, a pause becomes a decision. They are not flaws — just what shows up when guessing felt safer than asking.",
      couple:
        'Keep in mind: pose your reading as a question, not a verdict — the answer belongs to the other.',
      equilibre:
        "Check before you conclude — Not because your intuition lies, but because a question opens what certainty closes.",
    },
    'CARTE-4.1-PLACE-HERITEE': {
      intro:
        "Your archetype reveals a loyal person who held very early the place that had to be held. You know how to read a house and carry it at once. Your watch point: an inherited place can also be refused — the fatigue speaks.",
      devise: 'My loyalty is a roof frame: it keeps what matters standing.',
      apportes:
        "A rare loyalty: you keep what matters standing, without noise and without price. With you, the peace of a house can be felt — and the troubles get guessed before they burst.",
      freines:
        "The peace of the group comes before your opinion: the waiting moves, and the other becomes the table you do not want to disturb. They are not flaws — just what shows up when harmonizing was your first place.",
      couple:
        'Keep in mind: say one thing you think and have not said — the peace gains in being true.',
      equilibre:
        "Take the floor for yourself — Not because the peace is false, but because it is truer when everyone figures in it.",
    },
    'CARTE-4.1-SELON-LA-TABLE': {
      intro:
        "Your archetype reveals a flexible person who navigates between tables: you speak when it is right, you guess when it is useful, you hold when it matters. Your watch point: adaptation is not an address — it gets told.",
      devise: 'My rule is a weather: it adjusts to the houses, without losing north.',
      apportes:
        "A real social ease: you adjust to the most diverse tables. With you, different houses cohabit — nobody has to pick a camp.",
      freines:
        "Flexibility reads poorly from outside: the partner looks for your rule, and it is hard to guess. They are not flaws — just what shows up when adapting was your default mode.",
      couple: 'Keep in mind: give one word of your current rule — the other finds the door in it.',
      equilibre:
        "Explain your manual — Not because you owe a justification, but because a spoken rule reassures more than a guessed one.",
    },
  },
  '4.2': {
    'CARTE-4.2-CHAPITRE-REFERME': {
      intro:
        "Your archetype reveals a person whose past chapters are closed: you know what they taught you, and the calm you brought back stayed. Your watch point: the tidying of before is not the other's tidying.",
      devise: 'My boxes are done — I travel light.',
      apportes:
        "A calm place that can be heard: new people, you look at them for who they are. With you, no embers of reminiscence — rest, the real kind.",
      freines:
        "A settled serenity can read as distance: the other's ember does not know your tempo. They are not flaws — just what shows up when the calm arrived before the other.",
      couple: 'Keep in mind: tell how you tidied — the other will find their own tempo in it.',
      equilibre:
        "Translate your serenity into words — Not because it is false, but because it does not show by itself.",
    },
    'CARTE-4.2-PAGE-QUI-TOURNE': {
      intro:
        "Your archetype reveals a person between two weathers: some boxes are done, others wait, and some pages still turn. It is an honest in-between. Your watch point: a swing is badly announced — it is well told.",
      devise: 'My pages turn at my pace — the road has no schedule.',
      apportes:
        "A sincere path: you do not play the calmed one, you do not dramatize — you really move. With you, the other sees a person getting to know themselves along the way.",
      freines:
        "The swinging days: a first name, a song, and the ember lives again. They are not flaws — just what shows up when pages still turn.",
      couple: 'Keep in mind: tell the other what rekindles you — the weather gains a bulletin.',
      equilibre:
        "Warn when the ember comes back — Not because you must hide, but because a bulletin prevents bad readings.",
    },
    'CARTE-4.2-MAISON-EN-TRAVAUX': {
      intro:
        "Your archetype reveals a person whose story still occupies room — a house under renovation, and the works go at your pace. It is not a flaw. Your watch point: the repeated proof does not soothe — it wears both of you.",
      devise: 'My house is under renovation — the works go at my pace.',
      apportes:
        "An honesty without disguise: you know where you stand, and you do not pretend. With you, the other knows what to expect — no fake shop window.",
      freines:
        "Checking instead of receiving: a question lands on a building site, a silence writes worried scripts. They are not flaws — just what shows up when clarity was missing for long.",
      couple: 'Keep in mind: name one precise fear to the other — clarity begins with it.',
      equilibre:
        "Receive the proof once, then keep it — Not because your need is not legitimate, but because it deserves better than repetition.",
    },
  },
};

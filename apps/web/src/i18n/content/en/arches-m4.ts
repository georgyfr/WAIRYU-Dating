/**
 * MIROIR EN des ARCHÉTYPES — MONDE 4 « Ton Terrain » (quêtes 3.1 → 3.6 ;
 * 3.7 n'en a pas — quête privée sans carte, exemptée par design).
 * FUSION des six fichiers temporaires en/arche-3-{1..6}.ts (Task 46-c1…c6) :
 * leurs contenus ARCHE_3_X_EN sont repris à l'identique, clés de variantes
 * EXACTES du FR (quete-3-X-arche.ts — ⚠ CARTE-3.2-SANS-BUSSOLE sans accent,
 * CARTE-3.4-CŒUR-QUI-PAIE avec ligature Œ). Les temporaires sont supprimés.
 *
 * Par variante, les 6 champs du gabarit fondateur : intro (« Your archetype
 * reveals… » + point de vigilance) · devise à la 1ʳᵉ personne · apportes ·
 * freines (« They are not flaws — just what shows up when… ») · couple
 * (« Keep in mind: … ») · equilibre (« Not because…, but because… »).
 * Ton : you, simple et littéral, chaleureux, phrases courtes.
 * Neutralité : 3.1 — three rhythms equal, the badge is a conversation starter,
 * never a grade · 3.2 — the five everyday lives are equal · 3.3 — going out
 * and staying in are two equal ways to recharge · 3.4 — money is never judged
 * · 3.5 — a full table and a quiet circle are equal in dignity · 3.6 — anchor
 * and horizon equal, shades of images never a verdict. Apostrophe ASCII
 * U+0027 uniquement.
 */
export const ARCHES_M4: {
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
  '3.1': {
    'CARTE-3.1-PREMIER-TRAIN': {
      intro:
        'Your archetype reveals a person who lives their best hours before the world wakes up. The morning belongs to you: a clear head, ideas already moving, the day started inside you. Your watch-out: your evening may close before someone steps into it.',
      devise: 'I live my strongest hours at dawn — and I love it.',
      apportes:
        'Full mornings: where others are barely awake, you are already moving. With you, a morning project moves fast — and days start early, calmly.',
      freines:
        'Long dinners, spontaneous nights, mornings after a late evening. They are not flaws — just what shows up when your day starts before everyone else\'s.',
      couple:
        'You enjoy a daily life that starts early: shared wake-ups, mornings for two, quiet before the noise. Keep in mind: the other\'s evening may last longer than yours — leave their door open.',
      equilibre:
        'Protect your morning slot — and give a real place to a moment in the evening, even a short one. Not because your morning would count less, but because a shared day lives on both ends.',
    },
    'CARTE-3.1-MAREE': {
      intro:
        'Your archetype reveals a person who adjusts: your energy rises with the day and settles with the evening. No vote, no side — both moments are yours. Rigid clocks break — yours breathes. Your watch-out: a flexible clock can end up with no hour of its own.',
      devise: 'I flow — and I know where to rest.',
      apportes:
        'Availability: where rigid schedules get stuck, you find the hour that works. With you, surprises stay small — and compromises come faster.',
      freines:
        'Hours to defend, slots to protect, wishes to say out loud. They are not flaws — just what shows up when adjusting has become your first reflex.',
      couple:
        'You enjoy a bond that settles without long debates: your hours blend, they do not impose. Keep in mind: someone has to know your own hour — say it, it does not read itself.',
      equilibre:
        'Pick one fixed slot that belongs only to you — and keep it the way you keep an appointment. Not because adapting would be bad, but because a clock with no anchor ends up following all the others.',
    },
    'CARTE-3.1-LAMPE-MINUITEME': {
      intro:
        'Your archetype reveals a person the night gives back to: when the world grows quiet, your energy stands up. Ideas get clearer, words come free, evenings carry. Your watch-out: morning schedules have a head start on your clock.',
      devise: 'I live at night — and the morning will come.',
      apportes:
        'Evenings that count: conversations, projects, tenderness — what the day had no time to give. With you, the end of the day does not collapse: it opens.',
      freines:
        'Early alarms, imposed morning starts, talks that land before your first coffee. They are not flaws — just what shows up when your clock starts where the world\'s stops.',
      couple:
        'You enjoy a bond that respects your rise in energy: evenings for two, end-of-day talks. Keep in mind: the couple\'s morning may happen without you — ask for your share, even a short one.',
      equilibre:
        'Name the hour your day truly starts — and defend a piece of morning at your own pace, however brief. Not because night would be better, but because a gap lives better when it is said.',
    },
  },

  '3.2': {
    'CARTE-3.2-HORLOGE': {
      intro:
        'Your archetype reveals a person who runs their daily life like a gentle machine. Your days read ahead, your home knows its places. That reliability shows from the doorway. Your watch-out: a program that sometimes runs without the other person in it.',
      devise: 'I make life readable — and it shows from the door.',
      apportes:
        'Readable days: weeks you can plan ahead, places things return to, promises kept. With you, a shared home settles in fast — the safety is in the air.',
      freines:
        'Days without shape, places that move, programs written by other people. They are not flaws — just what shows up when the machine carries the whole house.',
      couple:
        'You enjoy a kept daily rhythm: appointments that happen, a home that reads at a glance. Keep in mind: well-paced homes often meet this exact friction — the empty slot gets named by two, not by one.',
      equilibre:
        'Leaving one empty slot in the program, and naming it together. Not because your clock would be too tight, but because a plan for two holds when the other writes in it.',
    },
    'CARTE-3.2-CALEPIN': {
      intro:
        'Your archetype reveals a person with two systems: the outside framed, the inside living at its own pace. Both work, each in its own lane. Your watch-out: your tolerance threshold is not obvious to everyone.',
      devise: 'I plan the world — and my home breathes at its own pace.',
      apportes:
        'A kept diary, without a locked house: you know where you are going, without holding everything. With two, it soothes — the big lines get prepared, small things get to live.',
      freines:
        'Tidiness standards, surprise visits, lingering looks. They are not flaws — just what shows up when two systems share one roof.',
      couple:
        'You enjoy a bond that respects your two tempos: the diary side for the world, the flow side for home. Keep in mind: what is not a problem at your place can read like a signal. Name your threshold out loud — it becomes a shared agreement.',
      equilibre:
        'Choosing with the other what gets tidied and what gets to live — and writing it down somewhere. Not because your flow would be a problem, but because a threshold gets set, never guessed.',
    },
    'CARTE-3.2-SANS-BUSSOLE': {
      intro:
        'Your archetype reveals a person who lives a calm without a program: the flow carries you, your home keeps its places. The unexpected passes through without tipping anything over. Your watch-out: your yes finds itself while walking.',
      devise: 'I follow the flow — and my house stands on its own.',
      apportes:
        'A flexibility with real structure: the unexpected is welcomed, the frame stays up. With you, a home breathes without dissolving — the flow holds the house, the house holds the flow.',
      freines:
        'Big lines to lay down in advance, plans written far ahead, dates that wait. They are not flaws — just what shows up when the flow decides day by day.',
      couple:
        'You enjoy a bond that does not lock you into a program: the place is kept, the time is free. Keep in mind: people who count on you sometimes prepare twice — one word ahead on the big lines changes everything.',
      equilibre:
        'Laying two or three markers others can read — the rest improvises. Not because your flow would be vague, but because an early marker spares a lot of guessing.',
    },
    'CARTE-3.2-VENT': {
      intro:
        'Your archetype reveals a person who takes the present wide: days draw themselves as you walk, things keep a free place. It is a whole way of living the everyday — it defuses many storms. Your watch-out: invisible loads pile up when nothing holds them.',
      devise: 'I live by the flow — the present has room at my place.',
      apportes:
        'Availability to the real: nothing is frozen, so few dramas when things drift. With you, missed plans turn back into anecdotes — life comes before the program.',
      freines:
        'The laundry that waits, the appointment you guess, the fridge that empties. They are not flaws — just what shows up when the flow of the day carries all the weight.',
      couple:
        'You enjoy a bond without labels: the place of things gets created, never decreed. Keep in mind: loosely structured homes often live invisible loads — a floor held by two keeps the flow from forgetting them.',
      equilibre:
        'Holding a floor with two — one routine, one place — and leaving the rest to the flow. Not because your freedom would be a problem, but because a held floor makes freedom wider.',
    },
    'CARTE-3.2-MAREE': {
      intro:
        'Your archetype reveals a person who changes modes without paying for it: by the season, the program leads or the flow decides. That ease is rarer than it looks. Your watch-out: your mode of the day gets announced — it is not there to be guessed.',
      devise: 'I change modes with the seasons — and I own both.',
      apportes:
        'An ease between the two banks: neither glued to the program, nor lost without a flow. With you, a life for two can change shape without a crisis — seasons pass, you follow.',
      freines:
        'Questions that assume one fixed mode, yearly planners, marks that never move. They are not flaws — just what shows up when your mode moves faster than expectations.',
      couple:
        'You enjoy a bond that accepts your two versions: the planned morning as much as the loose week. Keep in mind: whoever lives with you looks for your rule of the day. Give one word ahead — flexibility gains a language.',
      equilibre:
        'Announcing your mode of the day in three words — at wake-up, or before the evening. Not because your flexibility would fade, but because an announced mode spares a lot of guessing.',
    },
  },

  '3.3': {
    'CARTE-3.3-GRAND-AIR': {
      intro:
        'Your archetype reveals a person who recharges outdoors. After a busy week, you go out: streets, terraces, people — the world fills you up. Your watch-out: the outdoors sometimes carries you away, and someone waits for you to come home.',
      devise: 'I recharge outside — and I come back more available.',
      apportes:
        'An energy that walks back in with you: the outings you suggest, the places you introduce, the wants that move. With you, a busy week ends outside — and home gets someone available again.',
      freines:
        'Evenings that settle in at home, whole weekends of quiet, plans with nowhere to go. They are not flaws — just what shows up when your resource lives outside.',
      couple:
        'You enjoy a bond that goes out: terraces, paths, people to cross. Keep in mind: a core hobby shared as two brings the resource back home — offer it.',
      equilibre:
        'Picking one outing as two and keeping it like a weekly date. Not because staying in would be a problem, but because a resource tells itself better when shared.',
    },
    'CARTE-3.3-ENTRE-DEUX-RIVES': {
      intro:
        'Your archetype reveals a person with two riverbanks. Now the outdoors recharges you, now your home — you glide with the weeks, and the ease follows your wants. Your watch-out: your mode reads poorly from outside — say it before the other has to guess.',
      devise: 'I switch banks when the week asks for it.',
      apportes:
        'A flexibility that follows the other\'s seasons: out when it calls, in when it rests. With you, two rhythms find their place — nobody endures the other\'s program.',
      freines:
        'The questions with no answer: out or at home, this weekend? Plans with two scenarios. They are not flaws — just what shows up when your bank moves with the weeks.',
      couple:
        'You enjoy a bond that breathes: sometimes outings, sometimes quiet, with no doctrine. Keep in mind: name your bank of the week in three words — the other prepares one scenario instead of two.',
      equilibre:
        'Saying your bank of the moment in three words — early in the week, before the plans. Not because your flexibility would be a flaw, but because a mode said early becomes a soft convention.',
    },
    'CARTE-3.3-CHEMINEE': {
      intro:
        'Your archetype reveals a person who recharges at home. Behind your door, the house gives you back to yourself: calm is your real resource, and it holds the distance. Your watch-out: the cocoon sometimes closes — someone wants to go out with you.',
      devise: 'My recharge starts behind my door — and it holds.',
      apportes:
        'A calm that shares: at your place, the house breathes and the weeks find a rhythm again. With you, rest becomes a resource again — it carries you both.',
      freines:
        'Outings offered late, weeks announced as full, the outdoors asking for its share. They are not flaws — just what shows up when your resource lives inside.',
      couple:
        'You enjoy a bond that comes in: simple evenings, a home that settles, time that is not devoured. Keep in mind: opening a window of outdoors as two — the inside opens without emptying.',
      equilibre:
        'Welcoming one outing as two, even a short one — and treating it as a real window. Not because your home would lack anything, but because a window lights up the room.',
    },
  },

  '3.4': {
    'CARTE-3.4-CŒUR-QUI-PAIE': {
      intro:
        'Your archetype reveals a person whose money follows their heart. Heart-strikes happen fast, and decisions happen on the spot. For you, spending is first of all a real emotion. Your watch-out: the account sometimes gets checked after the heart-strike, not before.',
      devise: 'My money carries moments — and it is worth it.',
      apportes:
        'A warmth that spends itself: the outings, the gifts, the unplanned detours that become memories. With you, life as a couple does not look like a chore chart — it still celebrates.',
      freines:
        'Accounts read after the fact, month-ends that tighten, a money rule to write together. They are not flaws — just what shows up when the heart decides faster than the account.',
      couple:
        'You enjoy a lively bond where money flows without being counted at every step. Keep in mind: a money rule is spoken out loud — it is rarely guessed, and waiting weighs on the other person.',
      equilibre:
        'Name one shared money rule, before the next heart-strike. Not because spending would be a problem, but because an impulse lands better when the other person can read it.',
    },
    'CARTE-3.4-RAISONNE': {
      intro:
        'Your archetype reveals a person who spends on purpose. Wants catch you — but your purchases are compared, counted, and decided with a cool head. Your accounts are readable day by day. Your watch-out: the rule sometimes writes itself alone, and the other person has no line in it.',
      devise: 'I spend by choice — not by sliding.',
      apportes:
        'A home where decisions make sense: big purchases are prepared, accounts are followed, surprises shrink. With you, the near future has landmarks — and owned wants.',
      freines:
        'Other people\'s impulse buys, justifications to provide, spending with no named reason. They are not flaws — just what shows up when intention carries the whole decision.',
      couple:
        'You enjoy a bond where money is talked about without drama: reasons, plans, clear lines. Keep in mind: your argument is convincing — and the other person has a reason worth as much as yours.',
      equilibre:
        'Let the other person write one line of the shared rule, at the next purchase. Not because your reasons would be bad, but because a rule written by two holds better than a rule argued.',
    },
    'CARTE-3.4-FLAIR': {
      intro:
        'Your archetype reveals a person with fast decisions and calm money. You know how to say no on the spot, and yes at the right moment — no roadmap, just a knack that keeps the house light. Your watch-out: your no arrives before its reasons, and it reads like a door.',
      devise: 'I say no fast — and yes at the true moment.',
      apportes:
        'Money that sleeps soundly and a house with no heavy math. With you, wants get decided fast — and the good chances do not pass twice.',
      freines:
        'Prepared decisions, long comparisons, purchases that ask for a night of waiting. They are not flaws — just what shows up when the knack cuts before explaining.',
      couple:
        'You enjoy a light bond, where money does not weigh every gesture. Keep in mind: your fast no reads first like a closed door — the reason that follows often comes too late.',
      equilibre:
        'Say what your no protects, while you say it. Not because your knack would need fixing, but because a guessed verdict hurts more than an explained no.',
    },
    'CARTE-3.4-BIEN-TENUE': {
      intro:
        'Your archetype reveals a person who keeps and reads. The unspent euro sleeps soundly, purchases are compared with a cool head, accounts are followed day by day. Your house holds — the safety is felt at the door. Your watch-out: the frame protects, and it can close a door the other person wanted to open.',
      devise: 'What is kept lasts — and it shows.',
      apportes:
        'Real safety: month-ends hold, projects get funded, surprises topple nothing. With you, you build on solid ground — and it shows past the doorstep.',
      freines:
        'Unplanned wants, accounts discovered along the way, plans without landmarks. They are not flaws — just what shows up when keeping the frame comes before everything.',
      couple:
        'You enjoy a bond where tomorrow gets prepared: savings, funded plans, things held. Keep in mind: the other person\'s want is received as an invitation — not as a permission request.',
      equilibre:
        'Open a wants envelope for two, where desire has its own spot. Not because your frame would be too tight, but because a desire treated as a fault ends up silent.',
    },
    'CARTE-3.4-SAISONS': {
      intro:
        'Your archetype reveals a person who changes pace with the seasons. Some months you let money sleep, some you give in; you compare, or you decide on the spot. Your money votes neither heart nor math. Your watch-out: your rule of the month reads from the outside — it is rarely guessed.',
      devise: 'My pace follows the season — and I say so.',
      apportes:
        'A flexibility that fits the months: the season of wants and the season of saving alike. With you, the budget breathes between two rhythms, without tearing.',
      freines:
        'Rules that never move, identical weeks, boxes to fill the same way each month. They are not flaws — just what shows up when your rule changes faster than it gets announced.',
      couple:
        'You enjoy a bond that follows the seasons without suffering them. Keep in mind: your rule of the month takes three words to say — whoever shares your accounts will not guess it for you.',
      equilibre:
        'Give a heads-up about your rule of the month, whenever it changes. Not because your flexibility would be a problem, but because an announced pace gets shared without guessing games.',
    },
  },

  '3.5': {
    'CARTE-3.5-TABLE-ELARGIE': {
      intro:
        'Your archetype reveals a person who lives surrounded. Your people count in your big decisions, your weekends welcome the circle, your table grows wide — and you feel at home there. Your watch-out: a full table assigns its seats, and the one who arrives has to earn the chair.',
      devise: 'My table is large — and everyone has a voice at it.',
      apportes:
        'A human safety net: around you, nobody falls. You offer the other a welcome circle — full celebrations, kept dates, ties that get passed on.',
      freines:
        'Opinions flowing in, weekends split three ways, rules negotiated by many. They are not flaws — just what shows up when the whole circle gets a say.',
      couple:
        'You enjoy a bond that reaches out: friends, families, tables that overflow. Keep in mind: the person who shares your life enters a circle that is already full — set their chair, it does not earn itself.',
      equilibre:
        'Book one weekend a month for just the two of you, and tell the circle it counts. Not because the others matter less, but because the middle of the table needs its quiet corners.',
    },
    'CARTE-3.5-DEUX-RIVES': {
      intro:
        'Your archetype reveals a person who builds the bridge. Your circle counts without crowding in: you know the value of both banks — family on one side, the couple on the other, friends in between. Your watch-out: the bridge takes the waves of both banks, and the bargaining often lands on you.',
      devise: 'I build the bridge — without standing stuck in the middle.',
      apportes:
        'A rare flexibility: you can hear the family and the couple without betraying either. With you, the two worlds talk — and mix-ups often untie before they settle in.',
      freines:
        'Vague expectations, questions passed on to you, rules left unsaid. They are not flaws — just what shows up when your flexibility reads outside more than it speaks inside.',
      couple:
        'You enjoy a bond where each one keeps a bank: you make the footbridge, not the merger. Keep in mind: your rule for holidays gets said — it is not guessed, and the other cannot read your middle ground.',
      equilibre:
        'Say your rule for holidays before the wave arrives — one soft, clear sentence is enough. Not because your balance would be fragile, but because a place that is spoken lives better than a place that is guessed.',
    },
    'CARTE-3.5-TERRITOIRE': {
      intro:
        'Your archetype reveals a person who keeps their ground. Your decisions are made between you two, your weekends get reserved, each one keeps their own map — a chosen choice, not a break. Your watch-out: the place others may live in needs naming — without that word, it gets guessed badly.',
      devise: 'My clarity is a gift — I share it without giving myself away.',
      apportes:
        'A clarity that rests: with you, people know who decides what, and your time together is dense. Your way of choosing attention makes the little room you give feel truer — less surface, more depth.',
      freines:
        'Families looking for their spot, invitations to decode, silences read as distance. They are not flaws — just what shows up when a chosen map meets different maps.',
      couple:
        'You enjoy a bond that respects your ground: kept weekends, decisions that belong to you two. Keep in mind: a named place beats a guessed place — say where others may live.',
      equilibre:
        'Once a season, name the place others may live in — an open door moves no wall. Not because your ground should justify itself, but because a spoken border can be crossed without being forced.',
    },
  },

  '3.6': {
    'CARTE-3.6-ANCRE': {
      intro:
        'Your archetype reveals a person who chooses places that carry you: the house, the stability, the slow coffee, the scheduled Sunday. Your images lean toward rest, and it reads at once. Your watch-out: an anchor that stops moving can grow heavy — keep one image outside.',
      devise: 'I choose what carries me — and I know why.',
      apportes:
        'A base you can see: at your place, rituals hold and the house breathes. With you, people know where home is — leaving gets easier when a way back exists.',
      freines:
        'Plans that change without warning, announced moves, weeks with no fixed point. They are not flaws — just what shows up when rest loves what stays in place.',
      couple:
        'You enjoy a bond with an address: habits for two, rituals kept, a table waiting for you. Keep in mind: leave the window ajar — the other needs some wind, sometimes.',
      equilibre:
        'Keeping your ritual — and opening one outside, once a month, chosen together. Not because the anchor would be a problem, but because a home also exists to leave.',
    },
    'CARTE-3.6-EQUILIBRE': {
      intro:
        'Your archetype reveals a person who moves between calm and open air without losing their thread. Your images share the space — the home sometimes, the outside sometimes — and the shade shifts with the week. Your watch-out: your variety reads poorly — say the image of the moment.',
      devise: 'I change the scenery — without changing course.',
      apportes:
        'Two colors of weekends: the feast and the simple dinner, the tribe and the one-to-one. With you, life as a pair does not settle into one single set — and that keeps routines away.',
      freines:
        'Projects that ask for one single line, people who like to plan ahead, weeks too full to vary. They are not flaws — just what shows up when two wants pull on the same day.',
      couple:
        'You enjoy a bond that accepts your two speeds: staying and going out. Keep in mind: the other does not guess — say whether you want to stay, or the outside is calling you today.',
      equilibre:
        'Naming the image of your week on Sunday — stay or go out, one word is enough. Not because varying would be a problem, but because a named shade is easier to share.',
    },
    'CARTE-3.6-HORIZON': {
      intro:
        'Your archetype reveals a person who chooses places where the world comes in. The street terrace, the feast, the group, the city that moves. Your images lean outside, and they tell themselves. Your watch-out: the horizon spends — keep one image inside for the way back.',
      devise: 'I go out to meet the world — and I bring it back.',
      apportes:
        'Outings you improvise and tables that grow: the world walks into your home. With you, a flat week turns into a story again — you know where the good moments happen.',
      freines:
        'Evenings indoors, Sundays with no plan, people who go home early. They are not flaws — just what shows up when the call of the outside steers your days.',
      couple:
        'You enjoy a bond that moves: places to discover, guests at the table, mornings that leave. Keep in mind: someone needs to come home — let a cocoon for two exist.',
      equilibre:
        'Setting one evening indoors, on a fixed date, and keeping it like an appointment. Not because the outside would be a problem, but because a way back is prepared — not endured.',
    },
  },
};

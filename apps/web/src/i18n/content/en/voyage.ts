/**
 * Miroir EN des données du VOYAGE (lib/voyage.ts) :
 *  - WORLDS : les 11 mondes (name, shortName, tagline, note) — ordre figé ;
 *  - MILESTONES : les 6 jalons de restitution ;
 *  - BUILDS : les 4 portes « ce que ton voyage construit » ;
 *  - WORLD_DETAILS : la fiche réelle de chaque monde (resume, resultats,
 *    format, quetes, note) — clés M1…M11. Restructurée Task 69-b : 2 blocs.
 * Codes, couleurs, icônes, numéros, statuts : côté FR, jamais recopiés.
 * Les tableaux respectent l'ORDRE et la LONGUEUR exactes du FR.
 */
import type { L10n } from '../../apply';
import type { VoyageWorld, VoyageMilestone, VoyageBuild, WorldDetail } from '../../../lib/voyage';

export const VOYAGE_EN: {
  WORLDS?: L10n<VoyageWorld>[];
  MILESTONES?: L10n<VoyageMilestone>[];
  BUILDS?: L10n<VoyageBuild>[];
  WORLD_DETAILS?: { [code: string]: L10n<WorldDetail> };
} = {
  WORLDS: [
    {
      name: "The Mirror",
      shortName: "The Mirror",
      tagline: "You look at who you are: personality, attachment, emotions. No right answer — only your answer.",
    },
    {
      name: "The Wheel",
      shortName: "The Wheel",
      tagline: "You take the wheel back: your control, your way of thinking, what you bring, your momentum of the moment.",
    },
    {
      name: "The Compass",
      shortName: "The Compass",
      tagline: "Your values, your non-negotiables, your vision of family: the heading that steers your encounters.",
    },
    {
      name: "Your Terrain",
      shortName: "The Terrain",
      tagline: "Your real daily life: life rhythm, free time, your way with money, your circle, your attractions.",
    },
    {
      name: "Your Heritage",
      shortName: "Your Heritage",
      tagline: "Your relational history: your tree, where you stand today, what your relationships have taught you.",
    },
    {
      name: "My Heart",
      shortName: "My Heart",
      tagline: "Your love style, your vision of love, how you express affection, your humor.",
    },
    {
      name: "Facing the Storms",
      shortName: "Facing the Storms",
      tagline: "Disagreements are part of the journey: how you cross tensions and repair after.",
    },
    {
      name: "Intimacy — The Essentials",
      shortName: "Intimacy",
      tagline: "Your intimate life, at your pace: nothing is ever imposed, everything unfolds floor by floor.",
      note: "Only on your decision (opt-in)",
    },
    {
      name: "Intimacy — The Depths",
      shortName: "The Depths",
      tagline: "Your preferences and your boundaries, strongly encrypted, never visible to others.",
      note: "Only on your decision (opt-in)",
    },
    {
      name: "My World",
      shortName: "My World",
      tagline: "Your roots, your openness to the world, mixed unions: a module treated with the dignity it requires.",
    },
    {
      name: "The Journey for Two",
      shortName: "The Journey for Two",
      tagline: "The quests are lived for two: crossed questions, shared answers, a prepared date.",
      note: "Unlocks at your first match — the encounter is never paid",
    },
  ],
  MILESTONES: [
    {
      name: "The Card",
      desc: "Discover who you are and what you truly want — a living portrait after each step.",
    },
    {
      name: "The Mirror",
      desc: "Explore your emotions, your strengths and your fragilities — light and shadow, without grades or judgment.",
    },
    {
      name: "The World Portrait",
      desc: "At each world completed, a several-page synthesis of this territory of you.",
    },
    {
      name: "The Domain Portraits",
      desc: "The Self, the Heart, the Intimate: the crossings between your linked worlds — your true signatures.",
    },
    {
      name: "The Full Portrait",
      desc: "Your complete synthesis: personality, values, lifestyle. 12 to 18 pages, downloadable.",
    },
    {
      name: "The Encounter",
      desc: "Your moment: making the first move toward the right person — then the Journey for Two.",
    },
  ],
  BUILDS: [
    {
      title: "Your Portrait",
      mantra: "I am discovering who I am",
      text: "What your answers progressively reveal of your personality, your emotions, your needs and your way of working.",
      cta: "See my portrait",
    },
    {
      title: "The Worlds",
      mantra: "I am discovering the territories of me",
      text: "11 worlds mark your path: personality, values, daily life, heart, history. Discover what each one reveals.",
      cta: "Discover the Worlds",
    },
    {
      title: "Worlds Traveled",
      mantra: "I move at my own pace",
      text: "Find again the worlds you have crossed and what they revealed about you. Each world crossed lights the next.",
      cta: "Open my journal",
    },
    {
      title: "Your encounters",
      mantra: "I am getting closer to the right people",
      text: "Find again the people with whom something is starting to build.",
      cta: "See",
    },
  ],
  WORLD_DETAILS: {
    M1: {
      resume:
        "The first world of the journey: you look at who you are — your personality, your way of loving and being close, your emotions. No right answer, only your answer. The whole journey rests on this base.",
      resultats: [
        "Your card — your light and your shadow, after each quest.",
        "Your mirror — how you work, spelled out.",
        "The first stones of your portrait.",
      ],
      format: "Statements one by one, 5 levels from “Not at all me” to “Exactly me”. No grade, no stopwatch.",
      quetes: [
        {
          title: "Your Personality",
          hint: "58 statements — openness, organization, social energy, kindness, emotional stability",
        },
        {
          title: "How You Attach",
          hint: "your need for reassurance, your need for space",
        },
        {
          title: "Your Emotions",
          hint: "what you feel, what you do with it, what shows of you",
        },
      ],
    },
    M2: {
      resume:
        "The second world looks at what you do with what you are: your mastery, your head, your momentum of the moment. You see how you hold the wheel — and whether you are ready to meet someone.",
      resultats: [
        "Your card after each quest — your light and your shadow in one sentence.",
        "Your mirror — how you work, spelled out.",
        "At the end of the world: your Portrait of this world.",
      ],
      format: "Each quest has its format: statements, choices, a few riddles, a small everyday task. No right answer — what is true for you.",
      quetes: [
        { title: "Your Self-Control" },
        { title: "The Test of Time" },
        { title: "The Way You Think" },
        { title: "Your Inner Workings" },
        { title: "Your Momentum Today" },
        { title: "What You Bring" },
        { title: "Are You Ready to Meet?" },
      ],
    },
    M3: {
      resume:
        "The third world sets your heading — the one that steers all your encounters: what matters to you, what is not negotiable, what you are looking for, where you want to go in the next five years.",
      resultats: [
        "Your card after each quest — your light and your shadow in one sentence.",
        "Your mirror — how you work, spelled out.",
        "At the end of the world: your Portrait of this world.",
      ],
      format: "Frank choices: boxes to check, binaries, a game of 100 points to share out. Your sign is just for fun.",
      quetes: [
        { title: "Your Values" },
        { title: "Your Place for Spirituality" },
        { title: "Your Non-Negotiables" },
        { title: "Your Realities" },
        { title: "What You Are Looking For" },
        { title: "Your Priorities for the Next 5 Years" },
        { title: "Your Vision of Family" },
        { title: "Your Sign (just for fun)" },
      ],
    },
    M4: {
      resume:
        "The fourth world comes down to your real terrain — where a life for two is truly lived: your life rhythm, your free time, your way with money, your circle, your attractions.",
      resultats: [
        "Your card after each quest — your light and your shadow in one sentence.",
        "Your mirror — how you work, spelled out.",
        "At the end of the world: your Portrait of this world.",
      ],
      format: "Concrete questions about your real life, pairs of images to choose from, a dawn or owl badge. Your attractions stay private — they are never seen.",
      quetes: [
        { title: "Your Life Rhythm" },
        { title: "Your Daily Life" },
        { title: "Your Free Time" },
        { title: "Your Way with Money" },
        { title: "Your Circle" },
        { title: "The Visual Choice" },
        { title: "Your Attractions" },
      ],
    },
    M5: {
      resume:
        "The fifth world looks at your relational history — where you start from, to choose where you are going: your tree, where you stand today, what your relationships have taught you.",
      resultats: [
        "Your card after each quest — your light and your shadow in one sentence.",
        "Your mirror — how you work, spelled out.",
        "At the end of the world: your Portrait of this world.",
      ],
      format: "You draw your tree, you answer questions about your present, one open question for what it has taught you. Part of the world is woven quietly.",
      quetes: [
        { title: "Your Relational Tree" },
        { title: "Where You Stand Today" },
        { title: "What Your Relationships Taught You" },
        {
          title: "Wounds and Ease",
          hint: "woven quietly into your first two quests — no screen for it, out of respect",
        },
      ],
    },
    M6: {
      resume:
        "The sixth world gives a language to your heart: your love style, your vision of love, how you express your affection — and your humor.",
      resultats: [
        "Your card after each quest — your light and your shadow in one sentence.",
        "Your mirror — how you work, spelled out.",
        "A card of your humor, made to be shared.",
        "At the end of the world: your Portrait of this world.",
      ],
      format: "Statements about your way of loving and showing it. Answer with your heart, not with the dictionary.",
      quetes: [
        { title: "Your Love Style" },
        { title: "Your Vision of Love" },
        { title: "How You Express Your Affection" },
        { title: "Your Humor" },
      ],
    },
    M7: {
      resume:
        "The seventh world looks at the windy days: how you cross disagreements, when tension rises, and how you repair after. Nothing is judged here — every storm has its way of being crossed.",
      resultats: [
        "Your card after each quest — your light and your shadow in one sentence.",
        "Your mirror — how you work, spelled out.",
        "This world and My Heart meet in a Domain Portrait: the Heart.",
      ],
      format: "True disagreement situations — you answer according to what you do, not according to what one should say.",
      quetes: [
        { title: "Facing Disagreements" },
        { title: "When Tension Rises" },
        { title: "After a Disagreement" },
      ],
    },
    M8: {
      resume:
        "The eighth world opens the domain of intimacy — on your decision only. Your intimate life and your relation to desire, at your pace: nothing is ever imposed, everything unfolds floor by floor.",
      resultats: [
        "A discreet synthesis at each floor crossed — only if you chose to enter.",
        "What you harvest here stays encrypted and private forever.",
      ],
      format: "The world begins with your decision: you enter floor by floor, only if you want it. Consent is at the center.",
      quetes: [
        { title: "Your Intimate Life — The Essentials" },
        { title: "Your Relation to Desire" },
      ],
    },
    M9: {
      resume:
        "The ninth world goes down to the depths of intimacy: your preferences, your boundaries, your desire on your own definition. Strongly encrypted — never visible to others, your answers never leave your vault.",
      resultats: [
        "Your map of preferences — private forever, strongly encrypted.",
        "Some boundary divergences are signaled to both people, without ever revealing who answered what.",
      ],
      format: "You choose to enter — and some quests deliberately produce no mirror, out of respect.",
      quetes: [
        { title: "Your Map of Preferences" },
        { title: "Your Modern Boundaries" },
        { title: "Your Desire, Your Definition" },
      ],
    },
    M10: {
      resume:
        "The tenth world speaks of your roots and your openness: where you come from, how you welcome others, mixed unions in your life. Treated with the dignity it requires.",
      resultats: [
        "Your card after each quest — your light and your shadow in one sentence.",
        "A mirror that describes your grounding — a rhythm, never a verdict.",
        "At the end of the world: your Portrait of this world.",
      ],
      format: "You identify freely — your lived experience is never assumed. Zero filtering by origin: traits, never labels.",
      quetes: [
        { title: "Your Roots" },
        { title: "Your Openness to the World" },
        { title: "Mixed Unions and You" },
      ],
    },
    M11: {
      resume:
        "The destination: the world lived for two, after the encounter. Crossed questions, shared answers, a prepared date — an encounter that starts well.",
      resultats: [
        "The reward is the other person's answer.",
        "Dialogue cards, a prepared date, a free and permanent safety check-in.",
      ],
      format: "You answer, the other answers — some answers are shared, others stay between you and your journey. Voice comes before face: text, then voice, then photo, always with both people's consent.",
      quetes: [
        { title: "The Questions That Bring Closer" },
        { title: "And You, What Would You Do?" },
        { title: "The Refusal" },
        { title: "The Bonus" },
        { title: "Vibe Check / Voice Check" },
        { title: "The Date Services" },
      ],
    },
  },
};

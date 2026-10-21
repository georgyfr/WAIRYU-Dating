/* -------------------------------------------------------------------------- */
/* LES 20 AFFIRMATIONS « Tes valeurs » — contenu VALIDÉ par le fondateur       */
/* (2026-10-21, chat staging : « Valider les 20 affirmations Tes valeurs »).   */
/*                                                                             */
/* HISTOIRE : la maquette du fondateur (« Wairyu — Tes valeurs, refonte »)     */
/* donnait les MÉTADONNÉES verbatim (20 affirmations · 5 niveaux · 0           */
/* chronomètre · « 4 familles de valeurs, en 4 barres ») sans les textes ;     */
/* la proposition 137 (sandbox Task 137) complétait le contenu, jouable en     */
/* démo avec bannière « CONTENU PROPOSÉ ». LE FONDATEUR A VALIDÉ.              */
/*                                                                             */
/* CONFRONTATION (honnêteté, Task 144-i) : la vraie app possède DÉJÀ la quête  */
/* 2.1 « Tes valeurs » (échelle de Schwartz — 10 dimensions, 4 blocs portrait, */
/* 8 variantes de cartes, contresignée RIO). Les 20 affirmations ci-dessous    */
/* sont une GRILLE COMPLÉMENTAIRE (4 familles / 4 barres : ancrage, construire,*/
/* partage, cap) — elles NE REMPLACENT PAS la quête 2.1 et ne doivent PAS être */
/* branchées dans QUIDS_PAR_MONDE[2] : cela modifierait la clôture du Monde 3  */
/* pour les comptes existants (régression de progression réelle).              */
/*                                                                             */
/* BRANCHEMENT PROPOSÉ (quand le fondateur le voudra) : quête BONUS hors       */
/* progression (visible dans l'écran Quête du monde 3, donne une carte, ne     */
/* compte ni dans l'anneau ni dans la clôture) — OU alimentation de la future  */
/* refonte visuelle « 4 barres » de l'écran 2.1. Jusque-là, CE FICHIER EST LA  */
/* SOURCE GRAVÉE du contenu validé — rien ne se perd.                          */
/* -------------------------------------------------------------------------- */

/* La grille de lecture du moteur du fondateur (EngineQuest) : dimensions à
   pôles opposés, items Likert 5 niveaux (reverse = recodé 6 − r), combos de
   lecture, textes de relation. Le moteur RÉEL vit côté fondateur
   (wairyu-engine.mjs) — ces données lui sont adressées telles quelles. */

export interface ItemValeurs {
  id: string;
  text: string;
  /** Inversé (recodé 6 − r) — l'affirmation tourne le dos au pôle droit. */
  reverse?: boolean;
}

export interface DimensionValeurs {
  id: string;
  label: string;
  poles: [string, string];
  items: ItemValeurs[];
}

export interface ComboValeurs {
  id: string;
  weight: number;
  when: { [dim: string]: 'low' | 'high' };
  headline: string;
  reading: string;
  tension: string;
  relation: string;
  steps: string[];
}

export interface EngineQuestValeurs {
  id: string;
  dimensions: DimensionValeurs[];
  combos: ComboValeurs[];
  texts: {
    reading: Record<string, { low: string; mid: string; high: string }>;
    ambivalent: string[];
    solid: string;
    relation: Record<string, string>;
    steps: Record<string, string[]>;
    caution: Record<string, string[]>;
  };
}

export const TES_VALEURS: EngineQuestValeurs = {
  id: 'valeurs',
  dimensions: [
    {
      id: 'ancrage',
      label: 'Ton besoin d’ancrage',
      poles: ['le mouvement', 'l’ancrage'],
      items: [
        { id: 'a1', text: 'Avant de dire oui à un projet, j’aime savoir où j’en serai dans six mois.' },
        { id: 'a2', text: 'Mes habitudes me rassurent : je les choisis, et je m’y tiens.' },
        { id: 'a3', text: 'Je m’engage sur la durée quand quelque chose compte pour moi.' },
        { id: 'a4', text: 'Un imprévu qui bouscule mes plans me pèse plus longtemps qu’il ne m’amuse.' },
        { id: 'a5', text: 'Quand tout est trop calme, je cherche vite un nouveau départ.', reverse: true },
      ],
    },
    {
      id: 'construire',
      label: 'Ta façon d’avancer',
      poles: ['profiter du présent', 'construire la suite'],
      items: [
        { id: 'c1', text: 'Je choisis souvent ce qui me construit sur le long terme, même si c’est plus lent.' },
        { id: 'c2', text: 'J’aime fixer un cap et mesurer le chemin déjà fait.' },
        { id: 'c3', text: 'Mon temps et mon argent partent d’abord aux moments qui comptent aujourd’hui.', reverse: true },
        { id: 'c4', text: 'Quand je veux quelque chose d’ambitieux, j’y travaille sans attendre que ce soit facile.' },
        { id: 'c5', text: 'Préparer demain me fatigue : je préfère laisser la vie venir.', reverse: true },
      ],
    },
    {
      id: 'partage',
      label: 'Toi et les autres',
      poles: ['ton espace', 'le partage'],
      items: [
        { id: 'p1', text: 'Les grandes décisions se prennent avec les personnes qui comptent, pas seul(e) dans mon coin.' },
        { id: 'p2', text: 'Je raconte mes bonnes comme mes mauvaises nouvelles à mes proches, sans filtrer longtemps.' },
        { id: 'p3', text: 'J’ai besoin de moments à moi, même quand tout va bien autour de moi.', reverse: true },
        { id: 'p4', text: 'Être disponible pour les miens passe avant mes propres envies du moment.' },
        { id: 'p5', text: 'Garder mon indépendance, même en couple, n’est pas négociable pour moi.', reverse: true },
      ],
    },
    {
      id: 'cap',
      label: 'Ce qui te décide',
      poles: ['la raison', 'le cœur'],
      items: [
        { id: 'k1', text: 'Mes meilleurs choix sont venus d’une intuition que je ne sais pas toujours expliquer.' },
        { id: 'k2', text: 'Avant de choisir, je liste le pour et le contre — calmement, par écrit si besoin.', reverse: true },
        { id: 'k3', text: 'Une décision juste, ça se sent dans le corps avant de se prouver.' },
        { id: 'k4', text: 'Je suis mes principes même quand mon envie dit autre chose.', reverse: true },
        { id: 'k5', text: 'Sur les grandes questions, je fais confiance à mon premier mouvement.' },
      ],
    },
  ],
  combos: [
    {
      id: 'construire_mouvement',
      weight: 1,
      when: { ancrage: 'low', construire: 'high' },
      headline: 'Tu construis loin, en gardant tes fenêtres ouvertes',
      reading:
        'Tu bâtis sur le long terme sans t’installer : ce qui te construit peut se déplacer avec toi. C’est une combinaison de gens qui avancent vite, avec peu de racines lourdes.',
      tension:
        'Construire demande de rester, le mouvement demande de partir. Tu tiens les deux tant que tes projets restent les tiens — le vrai test, c’est le jour où tu construis à deux.',
      relation:
        'Tu cherches quelqu’un qui respecte tes chantiers sans te fixer sur place. Dites-vous comment vous imaginez un projet commun qui bouge.',
      steps: [
        'Écris ce que ton projet actuel exige : une ville, un rythme, une liberté. Ce sera ta ligne à défendre.',
        'Pose la question du cap à ta prochaine rencontre sérieuse : « Toi, tu construis quoi, ces deux prochaines années ? »',
      ],
    },
    {
      id: 'coeur_partage',
      weight: 0.8,
      when: { cap: 'high', partage: 'high' },
      headline: 'Tu décides avec le cœur, entouré des tiens',
      reading:
        'Ton ressenti décide tôt, et les personnes qui comptent le savent. Tu ne construis pas tes choix contre les autres : tu les façonne avec eux.',
      tension:
        'Le cœur décide vite ; les avis qui comptent prennent du temps. Le jour où les deux disent des choses différentes, il te faudra trancher sans te trahir.',
      relation:
        'Tu cherches quelqu’un qui aime ton entourage et respecte ton ressenti. Parle de vos familles et de vos amitiés tôt : chez toi, c’est là que tout se joue.',
      steps: [
        'Nomme une décision où le cœur a tranché : qu’en dit aujourd’hui la raison ?',
        'Avant de demander un avis, note ce que tu ressens déjà : tu sauras si l’avis confirme ou brouille.',
      ],
    },
  ],
  texts: {
    reading: {
      ancrage: {
        low: 'Le mouvement te porte : tu choisis plus souvent l’inconnu que le confort du connu.',
        mid: 'Selon les jours, tu as besoin d’ancrage ou de mouvement — les deux sont vrais chez toi.',
        high: 'Tu avances mieux quand le terrain est solide : tes repères te portent, ils ne t’enferment pas.',
      },
      construire: {
        low: 'Le présent passe d’abord chez toi : tu récoltes ce que la vie met sur ta route, ici et maintenant.',
        mid: 'Tu navigues entre construire et profiter — ton cap change avec les saisons.',
        high: 'Tu construis avec patience : ce que tu commences, tu veux que ça tienne.',
      },
      partage: {
        low: 'Ton espace tient une grande place : tu t’appuies d’abord sur toi-même, et tu le vis bien.',
        mid: 'Tu partages selon les sujets : certains se racontent, d’autres se gardent.',
        high: 'Les tiens comptent dans tes choix : tu partages tôt, largement, sans calcul.',
      },
      cap: {
        low: 'Tu décides avec la tête : tu examines, tu compares, puis tu t’engages — et ça te réussit.',
        mid: 'Tu alternes : tu écoutes ta raison sur certains sujets, ton ressenti sur d’autres.',
        high: 'Tu suis ton cœur tôt : ton premier mouvement te connaît bien.',
      },
    },
    ambivalent: [
      'Ce n’est pas un défaut : c’est un endroit où tu hésites encore, ou qui change selon les jours de ta vie.',
      'Ton score du milieu cache une réponse tranchée : deux choses vraies cohabitent en toi, et c’est plus courant qu’on ne croit.',
    ],
    solid: 'Ici, tes réponses vont dans le même sens : sur ce point, tu sais où tu en es.',
    relation: {
      ancrage: 'Montre tôt ton rythme à l’autre : ce dont tu as besoin de stable, et ce que tu as envie de bousculer.',
      construire: 'Dis ce que tu construis en ce moment, et à quel rythme : c’est un sujet qui dit beaucoup de toi, sans parler d’avenir à deux.',
      partage: 'Dis à l’autre quelle place tu fais à tes proches, et celle que tu gardes pour toi : les deux se respectent.',
      cap: 'Explique à l’autre comment tu prends tes décisions : ça évite bien des malentendus quand les avis divergent.',
    },
    steps: {
      ancrage: [
        'Note les trois repères que tu veux garder, même en couple — et ceux que tu es prêt à faire bouger.',
        'Rappelle-toi un imprévu qui a fini en bon souvenir : qu’est-ce qui l’a rendu possible ?',
      ],
      construire: [
        'Écris ce que tu construis en ce moment — un projet, une compétence, une tranquillité.',
        'Choisis un moment à vivre pleinement cette semaine, rien que pour le présent.',
      ],
      partage: [
        'Note deux sujets que tu partages facilement, et un que tu gardes : tu verras ton équilibre.',
        'Demande à un proche comment il vit ta façon de partager — écoute juste.',
      ],
      cap: [
        'Rappelle-toi ta dernière grande décision : qu’est-ce qui a penché — la raison ou le cœur ?',
        'Note en une phrase ce que tu ne négocies jamais, même par amour.',
      ],
    },
    caution: {
      toujours_pareil: [
        'Tes réponses se ressemblent presque toutes. Ce résultat est à prendre avec prudence : refais la quête à ton rythme, en cherchant la réponse la plus proche de toi.',
      ],
      tout_oui: [
        'Tu as répondu « plutôt » ou « tout à fait » presque partout. Refaire la quête avec plus de nuances rendra le résultat plus juste.',
      ],
      tout_non: [
        'Tu as répondu « pas du tout » ou « pas vraiment » presque partout. Refaire la quête avec plus de nuances rendra le résultat plus juste.',
      ],
      trop_rapide: [
        'Tu as répondu très vite. Prends ton temps si tu recommences : le premier mouvement compte, la précipitation non.',
      ],
      incomplet: ['Il manque plusieurs réponses : certaines familles de valeurs ne s’affichent pas encore.'],
      defaut: ['Ce résultat est à prendre avec prudence.'],
    },
  },
};

/* La note de provenance (l'honnêteté suit le contenu) : proposé en 137,
   VALIDÉ par le fondateur — le drapeau de démo n'a plus de raison d'être. */
export const NOTE_VALEURS_VALIDEES =
  'Contenu validé par le fondateur (2026-10-21). Grille complémentaire de la quête 2.1 — branchement en quête bonus ou en refonte « 4 barres », au choix du fondateur.';

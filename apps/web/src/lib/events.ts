/**
 * Wairyu Moments — MODE ÉVÉNEMENTIEL (Task 39, demande fondateur : PROMPT
 * « Wairyu Moments » — billetterie, création d'événements, souvenirs,
 * missed connections, chat de groupe).
 *
 * Pourquoi un module de données LOCAL ? Les événements réels (backend D1,
 * validation admin, paiements, QR de check-in scannés sur place) arrivent
 * avec leur propre mise à jour serveur — comme annoncé depuis l'onglet
 * Moments (teaser Task 30). En attendant, ce module fournit :
 *  · des DONNÉES DE DÉMONSTRATION clairement présentées comme un aperçu
 *    (aucun compteur factice présenté comme réel — principe Task 38) ;
 *  · un état local honnête et persisté (localStorage) pour CE QUE
 *    L'UTILISATEUR FAIT LUI-MÊME dans l'aperçu : rejoindre un événement
 *    (billet + code), créer un événement (formulaire complet) — tout est
 *    récupérable dans « Mes événements » et « Mes billets » ;
 *  · des dates GÉNÉRÉES RELATIVEMENT à aujourd'hui (les filtres « ce
 *    week-end / cette semaine / ce mois » restent vrais pour toujours).
 *
 * Zéro appel API, zéro schéma modifié — 100 % additif, réversible.
 */

// ---- Types ----------------------------------------------------------------

export type EvType =
  | 'cocktail'
  | 'diner'
  | 'atelier'
  | 'sport'
  | 'culture'
  | 'speed'
  | 'rando'
  | 'soiree';

export interface EvEvent {
  id: string;
  type: EvType;
  typeLabel: string;
  emoji: string;
  title: string;
  /** ISO YYYY-MM-DD — généré relativement à aujourd'hui (voir iso()). */
  dateISO: string;
  time: string;
  place: string;
  distanceKm: number;
  /** En FCFA — 0 = gratuit. */
  price: number;
  desc: string;
  coverSeed: string;
  /** Classe de dégradé de secours si la photo de couverture ne charge pas. */
  gradient: string;
  attendees: string[];
  count: number;
  max: number;
  organizer: string;
  official?: boolean;
  featured?: boolean;
  rules?: string;
}

export interface EvMineEntry {
  id: string;
  status: 'upcoming' | 'organized' | 'past';
  statusLabel: string;
  dateISO: string;
  title: string;
  meta: string;
}

export interface EvMemory {
  id: string;
  title: string;
  when: string;
  seeds: string[];
  extraPhotos: number;
  people: number;
  coverSeed: string;
}

export interface EvNotif {
  id: string;
  kind: 'event' | 'ticket' | 'reminder' | 'connection';
  title: string;
  text: string;
  when: string;
}

export interface EvMissed {
  id: string;
  name: string;
  event: string;
  hue: number;
}

// ---- Aides dates -----------------------------------------------------------

const DAY = 86_400_000;

/** Date ISO de « dans n jours » (ou « il y a |n| jours » si négatif). */
function iso(n: number): string {
  return new Date(Date.now() + n * DAY).toISOString().slice(0, 10);
}

const WD = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'];
const MO = ['jan', 'fév', 'mar', 'avr', 'mai', 'juin', 'juil', 'août', 'sep', 'oct', 'nov', 'déc'];

/** « Sam 3 oct » — libellé court du prototype, reconstruit depuis l'ISO. */
export function evDateLabel(dateISO: string): string {
  const d = new Date(`${dateISO}T12:00:00`);
  return `${WD[d.getDay()]}. ${d.getDate()} ${MO[d.getMonth()]}`;
}

/** « sam. 3 octobre » — libellé long (modale détail, billets). */
export function evDateLong(dateISO: string): string {
  return new Date(`${dateISO}T12:00:00`).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export function evPriceLabel(price: number): string {
  return price === 0 ? 'Gratuit' : `${price.toLocaleString('fr-FR')} FCFA`;
}

export function evPriceShort(price: number): string {
  return price === 0 ? 'Gratuit' : `${(price / 1000).toLocaleString('fr-FR')}k`;
}

/** Initiales pour les avatars ronds (pas de photos de démo — cercles prénoms). */
export function initials(name: string): string {
  return name
    .split(/[\s-]+/)
    .map((p) => p[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

// ---- Données de démonstration ----------------------------------------------

const NAMES = [
  'Amina', 'Yasmine', 'Inès', 'Fatou', 'Sofia', 'Kévin', 'Serge', 'Awa',
  'Muriel', 'Didi', 'Nadège', 'Boris', 'Clarisse', 'Éric', 'Grâce', 'Ivan',
  'Léa', 'Marc', 'Nadine', 'Olivier', 'Prisca', 'Rodrigue', 'Sandrine', 'Teddy',
];

const slice = (a: number, b: number) => NAMES.slice(a, b);

/**
 * 9 événements d'aperçu — lieux réels de Douala / Yaoundé (l'audience de
 * lancement), dates relatives pour que les filtres restent justes.
 */
export const EV_EVENTS: EvEvent[] = [
  {
    id: 'ev1', type: 'cocktail', typeLabel: 'Afterwork', emoji: '🍸',
    title: 'Afterwork interculturel',
    dateISO: iso(3), time: '18:30',
    place: 'Douala · Bonanjo — Le Comptoir',
    distanceKm: 4, price: 5000,
    desc: 'Viens partager un verre après le boulot avec des célibataires de tous horizons. Brise-glace animé en début de soirée, playlists live, zéro pression : on discute, on rigole, on échange. Premier soft offert par wairyu.',
    coverSeed: 'wairyu-ev1', gradient: 'ev-g1',
    attendees: slice(0, 6), count: 42, max: 50,
    organizer: 'Wairyu Officiel', official: true, featured: true,
    rules: 'Respect et bienveillance obligatoires. Drague lourde = exclusion.',
  },
  {
    id: 'ev2', type: 'diner', typeLabel: 'Dîner', emoji: '🍽️',
    title: 'Dîner célibataires 25-35 ans',
    dateISO: iso(5), time: '20:00',
    place: 'Yaoundé · Bastos — Villa Zébulon',
    distanceKm: 9, price: 8000,
    desc: 'Un dîner à table ronde, 8 places tournantes : tu discutes 20 minutes avec chaque table, puis on libère les échanges. Menu 3 services inclus. Ambiance chaleureuse, dress code élégant décontracté.',
    coverSeed: 'wairyu-ev2', gradient: 'ev-g2',
    attendees: slice(6, 11), count: 18, max: 24,
    organizer: 'Clarisse (certifiée)',
  },
  {
    id: 'ev3', type: 'atelier', typeLabel: 'Atelier', emoji: '🎨',
    title: 'Atelier cuisine en duo',
    dateISO: iso(6), time: '15:00',
    place: 'Douala · Bonapriso — Kitchen Lab',
    distanceKm: 6, price: 0,
    desc: 'Deux par deux, on cuisine le menu du chef puis on le déguste ensemble. Le binôme change à chaque plat : tu rencontres sans même y penser. Tablier et ingredients fournis, aucune compétence requise.',
    coverSeed: 'wairyu-ev3', gradient: 'ev-g3',
    attendees: slice(2, 7), count: 12, max: 16,
    organizer: 'Muriel (certifiée)',
  },
  {
    id: 'ev4', type: 'sport', typeLabel: 'Sport', emoji: '🏃',
    title: 'Run & mingle — 5 km bon enfant',
    dateISO: iso(2), time: '07:00',
    place: 'Douala · Bord de mer — Esplanade',
    distanceKm: 3, price: 0,
    desc: 'Un footing convivial suivi d\'un petit-déjeuner partagé. Allure libre : ici on court pour se rencontrer, pas pour chronométrer. Groupes de niveau mélangés à chaque kilomètre.',
    coverSeed: 'wairyu-ev4', gradient: 'ev-g4',
    attendees: slice(7, 12), count: 30, max: 60,
    organizer: 'Serge (certifié)',
  },
  {
    id: 'ev5', type: 'culture', typeLabel: 'Culture', emoji: '🎭',
    title: 'Soirée contes & rencontres',
    dateISO: iso(8), time: '19:00',
    place: 'Yaoundé · Centre — Institut français',
    distanceKm: 12, price: 3000,
    desc: 'Conteurs traditionnels, puis cercles de discussion autour des histoires du soir. Le format idéal pour parler de soi autrement qu\'en CV. Restauration locale sur place.',
    coverSeed: 'wairyu-ev5', gradient: 'ev-g5',
    attendees: slice(12, 17), count: 25, max: 40,
    organizer: 'Awa (certifiée)',
  },
  {
    id: 'ev6', type: 'speed', typeLabel: 'Speed-dating', emoji: '💫',
    title: 'Speed-dating : 10 dates en une soirée',
    dateISO: iso(4), time: '19:30',
    place: 'Douala · Akwa — Lounge du Centre',
    distanceKm: 5, price: 10000,
    desc: '10 rendez-vous de 6 minutes, fiches de notes, puis matchs annoncés le lendemain sur l\'appli. Le classique efficace — places strictement limitées à 10 femmes / 10 hommes.',
    coverSeed: 'wairyu-ev6', gradient: 'ev-g6',
    attendees: slice(1, 5), count: 20, max: 20,
    organizer: 'Wairyu Officiel', official: true,
    rules: 'Ponctualité exigée — une place manquante, c\'est un·e célibataire de moins.',
  },
  {
    id: 'ev7', type: 'cocktail', typeLabel: 'Afterwork', emoji: '🍸',
    title: 'Cocktails & jeux de société',
    dateISO: iso(10), time: '18:00',
    place: 'Douala · Bonanjo — Le Comptoir',
    distanceKm: 4, price: 4000,
    desc: 'Baby-foot, Uno, Time\'s Up et cocktails signature : le moyen le plus simple de briser la glace. On joue par équipes de deux qui changent chaque manche.',
    coverSeed: 'wairyu-ev7', gradient: 'ev-g7',
    attendees: slice(3, 8), count: 16, max: 28,
    organizer: 'Kévin (certifié)',
  },
  {
    id: 'ev8', type: 'rando', typeLabel: 'Randonnée', emoji: '⛰️',
    title: 'Randonnée Mont Manengouba',
    dateISO: iso(12), time: '06:30',
    place: 'Départ Douala · Bépanda — car partagé',
    distanceKm: 80, price: 2000,
    desc: 'Une journée au grand air : ascension douce (niveau facile), pique-nique au sommet, retour en fin d\'après-midi. Transport et guide inclus. Les plus belles conversations naissent en marchant.',
    coverSeed: 'wairyu-ev8', gradient: 'ev-g8',
    attendees: slice(9, 14), count: 14, max: 20,
    organizer: 'Boris (certifié)',
    rules: 'Chaussures de marche obligatoires, 2 litres d\'eau par personne.',
  },
  {
    id: 'ev9', type: 'soiree', typeLabel: 'Soirée', emoji: '🎉',
    title: 'La grande soirée wairyu',
    dateISO: iso(15), time: '21:00',
    place: 'Douala · Bonanjo — Rooftop La Falaise',
    distanceKm: 4, price: 0,
    desc: 'L\'événement officiel de la communauté : DJ live, badges de mode (Classique · Invisible · Interracial · Moments), coin speed-friending, photobooth souvenirs. Entrée gratuite sur billet — dans la limite des places.',
    coverSeed: 'wairyu-ev9', gradient: 'ev-g1',
    attendees: slice(0, 8), count: 88, max: 200,
    organizer: 'Wairyu Officiel', official: true, featured: false,
    rules: 'Billet + pièce d\'identité exigés à l\'entrée. Interdit aux moins de 18 ans.',
  },
  // Événements PASSÉS — nourrissent uniquement l'onglet « Passés » de
  // Mes événements et les souvenirs (jamais le feed Découvrir).
  {
    id: 'evp1', type: 'cocktail', typeLabel: 'Afterwork', emoji: '🍸',
    title: 'Afterwork de lancement',
    dateISO: iso(-9), time: '18:30',
    place: 'Douala · Bonanjo — Le Comptoir',
    distanceKm: 4, price: 0,
    desc: 'Le tout premier afterwork wairyu : 60 participants, 9 matchs annoncés le lendemain. Un souvenir de la communauté.',
    coverSeed: 'wairyu-evp1', gradient: 'ev-g2',
    attendees: slice(4, 9), count: 60, max: 60,
    organizer: 'Wairyu Officiel', official: true,
  },
  {
    id: 'evp2', type: 'culture', typeLabel: 'Culture', emoji: '🎭',
    title: 'Exposition photos « Visages »',
    dateISO: iso(-16), time: '16:00',
    place: 'Yaoundé · Bastos — Galerie MAM',
    distanceKm: 11, price: 0,
    desc: 'Visite guidée de l\'exposition suivie d\'un débat autour du portrait et du consentement à l\'image — les valeurs wairyu, en vrai.',
    coverSeed: 'wairyu-evp2', gradient: 'ev-g5',
    attendees: slice(13, 17), count: 22, max: 30,
    organizer: 'Awa (certifiée)',
  },
];

/** Événements visibles dans le feed Découvrir = à venir uniquement. */
export function evUpcoming(all: EvEvent[] = EV_EVENTS): EvEvent[] {
  const today = iso(0);
  return all.filter((e) => e.dateISO >= today && e.id.startsWith('ev') === true && !/^evp\d/.test(e.id));
}

/** Onglet « Mes événements » — entrées de démonstration (aperçu). */
export const EV_MINE_SEED: EvMineEntry[] = [
  {
    id: 'm1', status: 'upcoming', statusLabel: 'À venir',
    dateISO: iso(4), title: 'Speed-dating : 10 dates en une soirée',
    meta: 'Sam · 19:30 · Douala · Akwa',
  },
  {
    id: 'm2', status: 'organized', statusLabel: 'Organisé',
    dateISO: iso(9), title: 'Brunch networking celibataires',
    meta: 'Dim · 11:00 · Douala · Bonapriso',
  },
  {
    id: 'm3', status: 'past', statusLabel: 'Passé',
    dateISO: iso(-9), title: 'Afterwork de lancement',
    meta: '60 participants · 9 matchs',
  },
  {
    id: 'm4', status: 'past', statusLabel: 'Passé',
    dateISO: iso(-16), title: 'Exposition photos « Visages »',
    meta: '22 participants · 4 matchs',
  },
];

/** Souvenirs (écran Moments) — galerie de démonstration. */
export const EV_MEMORIES: EvMemory[] = [
  {
    id: 'mem1', title: 'Afterwork de lancement', when: 'Septembre — Douala',
    seeds: ['wairyu-mem1a', 'wairyu-mem1b', 'wairyu-mem1c'],
    extraPhotos: 27, people: 60, coverSeed: 'wairyu-mem1',
  },
  {
    id: 'mem2', title: 'Run & mingle #1', when: 'Août — Bord de mer',
    seeds: ['wairyu-mem2a', 'wairyu-mem2b', 'wairyu-mem2c'],
    extraPhotos: 14, people: 34, coverSeed: 'wairyu-mem2',
  },
  {
    id: 'mem3', title: 'Exposition « Visages »', when: 'Août — Yaoundé',
    seeds: ['wairyu-mem3a', 'wairyu-mem3b', 'wairyu-mem3c'],
    extraPhotos: 9, people: 22, coverSeed: 'wairyu-mem3',
  },
];

/** Notifications (cloche de l'en-tête) — aperçu. */
export const EV_NOTIFS: EvNotif[] = [
  {
    id: 'n1', kind: 'event', title: 'Nouveau près de toi',
    text: 'Speed-dating : 10 dates en une soirée — Douala, samedi. 20 places.',
    when: 'il y a 2 h',
  },
  {
    id: 'n2', kind: 'ticket', title: 'Ton billet est prêt',
    text: 'Afterwork interculturel — présente ton QR code à l\'entrée.',
    when: 'il y a 1 j',
  },
  {
    id: 'n3', kind: 'reminder', title: 'C\'est demain !',
    text: 'Run & mingle — 5 km. Pense à ton eau et tes chaussures de sport.',
    when: 'il y a 2 j',
  },
  {
    id: 'n4', kind: 'connection', title: 'Connexion depuis un événement',
    text: 'Amina t\'a liké·e après l\'Afterwork de lancement — réponds vite !',
    when: 'il y a 3 j',
  },
];

/** Missed Connections — personnes croisées à un événement (aperçu). */
export const EV_MISSED: EvMissed[] = [
  { id: 'mc1', name: 'Amina', event: 'Afterwork de lancement', hue: 172 },
  { id: 'mc2', name: 'Sofia', event: 'Afterwork de lancement', hue: 190 },
  { id: 'mc3', name: 'Inès', event: 'Run & mingle #1', hue: 165 },
  { id: 'mc4', name: 'Yasmine', event: 'Run & mingle #1', hue: 205 },
  { id: 'mc5', name: 'Fatou', event: 'Exposition « Visages »', hue: 150 },
];

// ---- État local persisté (ce que l'utilisateur fait dans l'aperçu) ----------

const K_JOINED = 'wairyu.ev.joined';
const K_TICKETS = 'wairyu.ev.tickets';
const K_CREATED = 'wairyu.ev.created';

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* stockage indisponible — l'état reste en mémoire pour la session */
  }
}

export function getJoined(): string[] {
  return readJSON<string[]>(K_JOINED, []);
}

export function isJoined(id: string): boolean {
  return getJoined().includes(id);
}

/** Code billet stable par événement (créé au premier check-in). */
export function ticketCode(id: string): string {
  const all = readJSON<Record<string, string>>(K_TICKETS, {});
  if (all[id]) return all[id];
  const code = `WRYU-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  all[id] = code;
  writeJSON(K_TICKETS, all);
  return code;
}

/** Rejoindre un événement : persiste l'inscription + retourne le code billet. */
export function joinEvent(id: string): string {
  const joined = getJoined();
  if (!joined.includes(id)) {
    joined.push(id);
    writeJSON(K_JOINED, joined);
  }
  return ticketCode(id);
}

export function getCreated(): EvEvent[] {
  return readJSON<EvEvent[]>(K_CREATED, []);
}

/** Publier un événement depuis le formulaire Créer (aperçu local). */
export function addCreated(ev: EvEvent): void {
  const all = getCreated();
  all.push(ev);
  writeJSON(K_CREATED, all);
}

/** Tous les événements connus (démo + créés localement), passés inclus. */
export function evAll(): EvEvent[] {
  return [...getCreated(), ...EV_EVENTS];
}

/** Événements créés localement, mis en forme pour l'onglet « Organisés ». */
export function createdAsMine(): EvMineEntry[] {
  return getCreated().map((e) => ({
    id: e.id,
    status: 'organized' as const,
    statusLabel: 'Organisé',
    dateISO: e.dateISO,
    title: e.title,
    meta: `${evDateLabel(e.dateISO)} · ${e.time} · ${e.place}`,
  }));
}

/** Événements rejoints à venir, mis en forme pour l'onglet « À venir ». */
export function joinedAsMine(): EvMineEntry[] {
  const today = iso(0);
  return evAll()
    .filter((e) => getJoined().includes(e.id) && e.dateISO >= today)
    .map((e) => ({
      id: e.id,
      status: 'upcoming' as const,
      statusLabel: 'À venir',
      dateISO: e.dateISO,
      title: e.title,
      meta: `${evDateLabel(e.dateISO)} · ${e.time} · ${e.place}`,
    }));
}

// ---- QR code décoratif (déterministe par billet) ---------------------------

/** PRNG mulberry32 — même code ⇒ même grille à chaque ouverture. */
function seeded(seed: number): () => boolean {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return (t ^ (t >>> 14)) >>> 0 > 1_863_316_287;
  };
}

/** Grille 11×11 du QR décoratif — dérivée du code du billet. */
export function qrGrid(code: string): boolean[] {
  let seed = 0;
  for (let i = 0; i < code.length; i++) seed = (seed * 31 + code.charCodeAt(i)) >>> 0;
  const rand = seeded(seed);
  return Array.from({ length: 121 }, (_, i) => {
    const r = Math.floor(i / 11);
    const c = i % 11;
    // Coins : repères 3×3 à centre creux (comme les finder patterns d'un
    // vrai QR) — le reste de la grille est pseudo-aléatoire mais DÉTERMINISTE
    // par billet : le même code affiche toujours la même grille.
    for (const [cr, cc] of [[0, 0], [0, 8], [8, 0]] as const) {
      if (r >= cr && r < cr + 3 && c >= cc && c < cc + 3) {
        return !(r === cr + 1 && c === cc + 1);
      }
    }
    return rand();
  });
}

/**
 * Moteur de matching wairyu (Étape 4) — FONCTION PURE, zéro I/O.
 *
 * Philosophie (spécification §5) :
 *  - le score est INDICATIF, jamais prédictif : tolérance ±2 stable par paire
 *    et par jour (« pas un verdict »), avertissement obligatoire côté front ;
 *  - dimensions pondérées (§5.3.3) — les poids MVP sont renormalisés sur les
 *    dimensions couvertes par N1+N2 (Love Languages = Niveau 3, différé) :
 *      Valeurs .26 · Objectifs .21 · Communication .16 · Personnalité .16
 *      · Attachement .11 · Préférences déclarées .10 ;
 *  - deal-breakers binaires EXCLUSIFS : si la réponse de l'un tombe dans la
 *    liste « rédhibitoire » déclarée par l'autre, la paire est exclue du feed
 *    (filtre dur, pas un malus de score) ;
 *  - explicabilité « Pourquoi ce match ? » : 2 forces + 1 vigilance + 2
 *    sujets de conversation, déduits des écarts de réponses (§5.4).
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type QDimension =
  | 'values'
  | 'goals'
  | 'communication'
  | 'personality'
  | 'attachment';

export interface QItemOption {
  key: string;
  label: string;
  /** Options incompatibles chez l'autre — déclenche une exclusion (deal-breaker). */
  dbRejects?: string[];
}

export interface QItem {
  id: string;
  level: 1 | 2;
  /** Ordre de présentation dans le niveau (1-based). */
  position: number;
  dimension: QDimension;
  kind: 'single' | 'multi';
  prompt: string;
  options: QItemOption[];
  /** Pour kind='multi' : nombre max de choix. */
  maxSelect?: number | null;
  isDealBreaker: boolean;
}

/** Réponse stockée : clé d'option (single) ou liste de clés (multi). */
export type QValue = string | string[];
/** Réponses d'un utilisateur : itemId → valeur. */
export type QAnswers = Record<string, QValue>;

export interface MatchReasons {
  forces: string[];
  vigilance: string;
  conversationStarters: string[];
}

export interface CompatibilityResult {
  /** 0-100, arrondi, tolérance ±2 incluse. */
  score: number;
  /** Score par dimension (uniquement les dimensions avec ≥1 item commun). */
  dims: { dimension: QDimension; score: number; items: number }[];
  /** Conflit de deal-breaker détecté (itemId) — la paire ne doit PAS être proposée. */
  dealBreakerConflict: string | null;
  reasons: MatchReasons;
}

/**
 * Poids MVP (renormalisés, cf. en-tête). Somme = 1.00 avec PREF_WEIGHT +
 * ARCH_WEIGHT (Étape 4-bis : affinité d'archétypes — demande fondateur).
 * Écart max vs poids initiaux : ±0.02 — le score reste proportionnel.
 */
export const DIM_WEIGHTS: Record<QDimension, number> = {
  values: 0.24,
  goals: 0.19,
  communication: 0.15,
  personality: 0.15,
  attachment: 0.10,
};
/** Dimension « Préférences déclarées » (hors banque de questions). */
export const PREF_WEIGHT = 0.09;
/** Dimension « Affinité d'archétypes » (null tant que l'un des deux n'a pas de type). */
export const ARCH_WEIGHT = 0.08;

export const DIM_LABELS: Record<QDimension, string> = {
  values: 'les valeurs fondamentales',
  goals: 'les objectifs de vie et de relation',
  communication: 'le style de communication',
  personality: 'la personnalité au quotidien',
  attachment: 'les besoins émotionnels',
};

// ---------------------------------------------------------------------------
// Utilitaires géo (feed : filtre distance sur les zones ≈11 km)
// ---------------------------------------------------------------------------

/** Parse « geo:lat,lon » (dixième de degré) — le seul format stocké. */
export function parseGeo(geoRegion: string | null | undefined): { lat: number; lon: number } | null {
  if (!geoRegion || !geoRegion.startsWith('geo:')) return null;
  const m = /^geo:(-?\d{1,2}\.\d),(-?\d{1,3}\.\d)$/.exec(geoRegion);
  if (!m) return null;
  return { lat: Number(m[1]), lon: Number(m[2]) };
}

/** Distance grands cercles (km) — suffit à ±11 km de granularité stockée. */
export function haversineKm(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number },
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

// ---------------------------------------------------------------------------
// Similarité par item
// ---------------------------------------------------------------------------

/** Index d'une option dans un item (−1 si inconnue). */
function optIndex(item: QItem, key: string): number {
  return item.options.findIndex((o) => o.key === key);
}

/**
 * Similarité 0-100 d'une réponse « single » : 100 (identique), 70 (adjacent),
 * 40 (2 écarts), 15 (plus) — jamais 0 : le score reste bienveillant/indicatif.
 */
function singleSimilarity(item: QItem, a: string, b: string): number {
  const ia = optIndex(item, a);
  const ib = optIndex(item, b);
  if (ia < 0 || ib < 0) return 50; // réponse inconnue/version mélangée → neutre
  const d = Math.abs(ia - ib);
  if (d === 0) return 100;
  if (d === 1) return 70;
  if (d === 2) return 40;
  return 15;
}

/** Similarité « multi » : Jaccard × 100. */
function multiSimilarity(a: string[], b: string[]): number {
  if (a.length === 0 && b.length === 0) return 100;
  const setA = new Set(a);
  const setB = new Set(b);
  let inter = 0;
  for (const x of setA) if (setB.has(x)) inter++;
  const union = setA.size + setB.size - inter;
  if (union === 0) return 100;
  return Math.round((inter / union) * 100);
}

function asArray(v: QValue): string[] {
  return Array.isArray(v) ? v : [v];
}

// ---------------------------------------------------------------------------
// Deal-breakers (exclusifs)
// ---------------------------------------------------------------------------

/**
 * Premier conflit de deal-breaker trouvé (dans les DEUX sens) — null sinon.
 * Les réponses inconnues/multi sur un item deal-breaker sont ignorées (sûr).
 */
export function dealBreakerConflict(items: QItem[], a: QAnswers, b: QAnswers): string | null {
  for (const item of items) {
    if (!item.isDealBreaker) continue;
    const va = a[item.id];
    const vb = b[item.id];
    if (typeof va !== 'string' || typeof vb !== 'string') continue;
    const optA = item.options.find((o) => o.key === va);
    const optB = item.options.find((o) => o.key === vb);
    if (optA?.dbRejects?.includes(vb)) return item.id;
    if (optB?.dbRejects?.includes(va)) return item.id;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Score de compatibilité
// ---------------------------------------------------------------------------

/** Hash non cryptographique stable (FNV-1a) — tolérance déterministe par paire/jour. */
function fnv1a(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * Tolérance « pas un verdict » : ±2 points, STABLE pour une paire donnée
 * pendant la journée UTC (pas de score qui danse à chaque rechargement).
 */
function tolerance(userIdA: string, userIdB: string): number {
  const day = Math.floor(Date.now() / 86400000);
  return (fnv1a(`${[userIdA, userIdB].sort().join('|')}|${day}`) % 5) - 2;
}

/** Label lisible d'une réponse (pour les phrases d'explication). */
export function valueLabel(item: QItem, v: QValue): string {
  if (Array.isArray(v)) {
    return v
      .map((k) => item.options.find((o) => o.key === k)?.label ?? k)
      .filter(Boolean)
      .join(', ');
  }
  return item.options.find((o) => o.key === v)?.label ?? '';
}

/**
 * Score de compatibilité complet d'une paire.
 * `prefScore` (0-100) matérialise la dimension « Préférences déclarées »
 * (chevauchement des intentions — les filtres durs âge/genre sont déjà
 * appliqués en amont). `userIdA/B` servent à la tolérance stable.
 */
export function compatibility(
  items: QItem[],
  answersA: QAnswers,
  answersB: QAnswers,
  userIdA: string,
  userIdB: string,
  prefScore: number,
  /** Affinité d'archétypes 0-100 — null si l'un des deux n'a pas de type validé/proposé. */
  archetypeScore: number | null = null,
): CompatibilityResult {
  const conflict = dealBreakerConflict(items, answersA, answersB);

  // --- Scores par dimension (items communs uniquement) ---
  const byDim = new Map<QDimension, { sum: number; n: number }>();
  for (const item of items) {
    const va = answersA[item.id];
    const vb = answersB[item.id];
    if (va === undefined || vb === undefined) continue;
    let sim: number;
    if (item.kind === 'multi') sim = multiSimilarity(asArray(va), asArray(vb));
    else if (typeof va === 'string' && typeof vb === 'string')
      sim = singleSimilarity(item, va, vb);
    else sim = multiSimilarity(asArray(va), asArray(vb));
    const bucket = byDim.get(item.dimension) ?? { sum: 0, n: 0 };
    bucket.sum += sim;
    bucket.n += 1;
    byDim.set(item.dimension, bucket);
  }
  const dims = [...byDim.entries()].map(([dimension, { sum, n }]) => ({
    dimension,
    score: Math.round(sum / n),
    items: n,
  }));

  // --- Total : pondération renormalisée sur les dimensions présentes ---
  let wsum = PREF_WEIGHT; // la dimension « préférences » compte toujours
  let total = PREF_WEIGHT * Math.max(0, Math.min(100, prefScore));
  if (archetypeScore !== null) {
    wsum += ARCH_WEIGHT;
    total += ARCH_WEIGHT * Math.max(0, Math.min(100, archetypeScore));
  }
  for (const d of dims) {
    wsum += DIM_WEIGHTS[d.dimension];
    total += DIM_WEIGHTS[d.dimension] * d.score;
  }
  const raw = wsum > 0 ? total / wsum : 0;
  const score = Math.max(0, Math.min(100, Math.round(raw + tolerance(userIdA, userIdB))));

  return { score, dims, dealBreakerConflict: conflict, reasons: buildReasons(items, answersA, answersB, dims, conflict) };
}

// ---------------------------------------------------------------------------
// « Pourquoi ce match ? » (§5.4) — 2 forces + 1 vigilance + 2 sujets
// ---------------------------------------------------------------------------

function buildReasons(
  items: QItem[],
  a: QAnswers,
  b: QAnswers,
  dims: { dimension: QDimension; score: number; items: number }[],
  conflict: string | null,
): MatchReasons {
  const forces: string[] = [];
  const starters: string[] = [];
  let vigilance = '';
  let vigilanceScore = 101;

  // 1) Forces : dimensions bien alignées + réponses identiques marquantes.
  for (const d of [...dims].sort((x, y) => y.score - x.score)) {
    if (d.score >= 72 && forces.length < 2 && d.items >= 2) {
      forces.push(`Vous êtes alignés sur ${DIM_LABELS[d.dimension]} (${d.score} % de similitude).`);
    }
    if (d.score < vigilanceScore) vigilanceScore = d.score;
  }

  // 2) Vigilance : dimension la plus basse, ou deal-breaker « voisin » (non exclu).
  if (conflict) {
    const item = items.find((i) => i.id === conflict);
    vigilance = `Vous divergez sur un point que l'un de vous deux considère rédhibitoire${item ? ` (« ${item.prompt} »)` : ''}.`;
  } else if (vigilanceScore < 55 && dims.length > 0) {
    const sorted = [...dims].sort((x, y) => x.score - y.score);
    const worst = sorted[0];
    if (worst) {
      vigilance = `À discuter : ${DIM_LABELS[worst.dimension]} divergent (${worst.score} %).`;
    }
  } else {
    // Écart maximal sur un item « single » → complémentarité possible.
    let worstItem: QItem | null = null;
    let worstSim = 101;
    for (const item of items) {
      const va = a[item.id];
      const vb = b[item.id];
      if (typeof va !== 'string' || typeof vb !== 'string') continue;
      const sim = singleSimilarity(item, va, vb);
      if (sim < worstSim) {
        worstSim = sim;
        worstItem = item;
      }
    }
    if (worstItem && worstSim < 70) {
      vigilance = `Vos styles diffèrent sur « ${worstItem.prompt} » — une complémentarité à explorer ensemble.`;
    }
  }

  // 3) Sujets de conversation : point commun multi, puis différence voisine.
  for (const item of items) {
    if (starters.length >= 2) break;
    const va = a[item.id];
    const vb = b[item.id];
    if (item.kind === 'multi' && Array.isArray(va) && Array.isArray(vb)) {
      const shared = va.filter((k) => vb.includes(k));
      if (shared.length > 0) {
        const labels = shared
          .map((k) => item.options.find((o) => o.key === k)?.label ?? '')
          .filter(Boolean);
        starters.push(`Vous partagez « ${labels.join(', ')} » — demande ce que cela représente pour l'autre.`);
      }
    } else if (typeof va === 'string' && typeof vb === 'string' && va === vb) {
      const label = valueLabel(item, va);
      if (label) starters.push(`Vous avez tous les deux répondu « ${label} » à « ${item.prompt} » — creuse le sujet.`);
    }
  }
  for (const item of items) {
    if (starters.length >= 2) break;
    const va = a[item.id];
    const vb = b[item.id];
    if (typeof va === 'string' && typeof vb === 'string' && va !== vb) {
      const la = valueLabel(item, va);
      const lb = valueLabel(item, vb);
      if (la && lb) {
        starters.push(`Vos réponses diffèrent sur « ${item.prompt} » (${la} vs ${lb}) — un bon sujet de discussion.`);
      }
    }
  }
  if (forces.length === 0) forces.push('Vos réponses montrent des points de contact à découvrir.');
  if (!vigilance) vigilance = 'Rien de saillant — la conversation tranchera, comme toujours.';
  if (starters.length === 0) starters.push('Demande ce qui compte le plus pour l’autre au quotidien.');

  return { forces: forces.slice(0, 2), vigilance, conversationStarters: starters.slice(0, 2) };
}

// ---------------------------------------------------------------------------
// Insights « Ma personnalité » (fin de niveau — logique de règles, pas d'IA)
// ---------------------------------------------------------------------------

export interface LevelInsights {
  level: 1 | 2;
  title: string;
  lines: string[];
}

/** Aperçu rule-based des réponses d'un niveau (l'utilisateur se reconnaît). */
export function insightsForLevel(
  items: QItem[],
  answers: QAnswers,
  level: 1 | 2,
): LevelInsights {
  const lines: string[] = [];
  const levelItems = items
    .filter((i) => i.level === level)
    .sort((x, y) => x.position - y.position);

  for (const item of levelItems) {
    const v = answers[item.id];
    if (v === undefined) continue;
    const label = valueLabel(item, v);
    if (!label) continue;
    if (item.kind === 'multi') lines.push(`${item.prompt} → ${label}.`);
  }

  // Phrases dédiées (les questions pivots par niveau).
  const pivot = (pos: number): QItem | undefined =>
    levelItems.find((i) => i.position === pos);
  const say = (item: QItem | undefined, prefix: string): void => {
    const v = item ? answers[item.id] : undefined;
    if (!item || v === undefined) return;
    const label = valueLabel(item, v);
    if (label) lines.push(`${prefix} ${label.toLowerCase()}.`);
  };

  if (level === 1) {
    say(pivot(1), 'Ce que tu cherches :');
    say(pivot(2), 'Projets enfants :');
    say(pivot(11), 'Tu recharges tes batteries :');
    say(pivot(3), 'Cap 5 ans :');
  } else {
    say(pivot(1), 'Face au conflit :');
    say(pivot(7), 'En groupe :');
    say(pivot(13), 'Dans le couple, tu as besoin de :');
    say(pivot(15), 'Tu montres ton affection par :');
  }

  const title =
    level === 1 ? 'Ma personnalité — Niveau 1 : l’essentiel' : 'Ma personnalité — Niveau 2 : la personnalité';
  return { level, title, lines };
}

/**
 * Questionnaire progressif (Étape 4 — spec §5.2).
 *
 * Mécaniques :
 *  - GET /api/q            → banque active + mes réponses + progression + insights ;
 *  - PUT /api/q/answers/:id → UNE réponse = UNE écriture (upsert), reprise garantie ;
 *  - GET /api/q/insights    → « Ma personnalité » (logique de règles, pas d'IA).
 *
 * Aucun niveau n'est obligatoire au-delà du N1 pour accéder à la découverte :
 * le serveur ne bloque jamais, il MESURE la complétion (Gate 4).
 */
import { Hono } from 'hono';
import type { Context } from 'hono';
import type { AppEnv } from '../env';
import { errors } from '../lib/errors';
import { RATE_RULES, hitRateLimit, rateLimitedError } from '../lib/ratelimit';
import {
  QUESTIONNAIRE,
  PSYCHOMETRY,
  type QItem,
  type QDimension,
  type QAnswers,
  type QProgress,
  type QuestionnaireState,
  type QAnswerResponse,
  type LevelInsights,
  type DoctrineQItem,
  type DoctrineFormat,
  type DoctrineValue,
  type DoctrineBankState,
  type DoctrineAnswerResponse,
  type PsychometryStats,
  type VigilanceBankItem,
  evaluateVigilance,
  pitMatrix,
  detectStraightLining,
  detectRandomPattern,
  r6Incoherent,
} from '@wairyu/shared';
import { insightsForLevel } from '@wairyu/shared';
import { loadTrame, loadTrames } from '../lib/trames';

export const questionnaireRoutes = new Hono<AppEnv>();

interface QItemRow {
  id: string;
  version: number;
  level: number;
  position: number;
  dimension: string;
  kind: string;
  prompt: string;
  options_json: string;
  max_select: number | null;
  is_deal_breaker: number;
}

interface QAnswerRow {
  item_id: string;
  value_json: string;
}

/** Exige une session valide + compte non supprimé/banni. */
async function requireUser(c: Context<AppEnv>) {
  const session = c.get('session');
  if (!session) throw errors.unauthorized();
  const user = await c.env.DB.prepare(`SELECT id, status FROM users WHERE id = ? LIMIT 1`)
    .bind(session.userId)
    .first<{ id: string; status: string }>();
  if (!user || user.status === 'deleted') throw errors.unauthorized();
  if (user.status === 'banned') throw errors.forbidden('Compte suspendu.');
  return user;
}

/** Charge la banque ACTIVE et la mappe en QItem partagé (options parsées). */
export async function loadActiveItems(db: D1Database): Promise<QItem[]> {
  const { results } = await db
    .prepare(
      `SELECT id, version, level, position, dimension, kind, prompt, options_json, max_select, is_deal_breaker
       FROM q_items WHERE active = 1 ORDER BY level ASC, position ASC`,
    )
    .all<QItemRow>();
  return (results ?? []).map((r) => ({
    id: r.id,
    level: (r.level === 2 ? 2 : 1) as 1 | 2,
    position: r.position,
    dimension: r.dimension as QDimension,
    kind: r.kind === 'multi' ? 'multi' : 'single',
    prompt: r.prompt,
    options: JSON.parse(r.options_json) as QItem['options'],
    maxSelect: r.max_select ?? null,
    isDealBreaker: r.is_deal_breaker === 1,
  }));
}

export async function loadMyAnswers(db: D1Database, userId: string): Promise<QAnswers> {
  const { results } = await db
    .prepare(`SELECT item_id, value_json FROM q_answers WHERE user_id = ?`)
    .bind(userId)
    .all<QAnswerRow>();
  const out: QAnswers = {};
  for (const r of results ?? []) {
    try {
      out[r.item_id] = JSON.parse(r.value_json);
    } catch {
      // Ligne corrompue → ignorée (le client re-répondra).
    }
  }
  return out;
}

function progress(items: QItem[], answers: QAnswers): { n1: QProgress; n2: QProgress } {
  const mk = (level: 1 | 2): QProgress => {
    const total = items.filter((i) => i.level === level).length || (level === 1 ? QUESTIONNAIRE.n1Questions : QUESTIONNAIRE.n2Questions);
    const done = items.filter((i) => i.level === level && answers[i.id] !== undefined).length;
    return { level, done, total };
  };
  return { n1: mk(1), n2: mk(2) };
}

questionnaireRoutes.get('/q', async (c) => {
  const user = await requireUser(c);
  const items = await loadActiveItems(c.env.DB);
  const answers = await loadMyAnswers(c.env.DB, user.id);

  const insights: LevelInsights[] = [];
  const pr = progress(items, answers);
  if (pr.n1.total > 0 && pr.n1.done >= pr.n1.total) insights.push(insightsForLevel(items, answers, 1));
  if (pr.n2.total > 0 && pr.n2.done >= pr.n2.total) insights.push(insightsForLevel(items, answers, 2));

  const body: QuestionnaireState = { items, answers, progress: pr, insights };
  return c.json(body);
});

questionnaireRoutes.put('/q/answers/:itemId', async (c) => {
  const user = await requireUser(c);

  const rl = await hitRateLimit(c.env.DB, RATE_RULES.qAnswerUser, user.id);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.qAnswerUser.scope);

  const itemId = c.req.param('itemId');
  const row = await c.env.DB.prepare(
    `SELECT id, level, kind, options_json, max_select FROM q_items WHERE id = ? AND active = 1`,
  )
    .bind(itemId)
    .first<QItemRow>();
  if (!row) throw errors.notFound('Question inconnue.');

  const payload = (await c.req.json().catch(() => null)) as { value?: unknown } | null;
  const value = payload?.value;
  const options = JSON.parse(row.options_json) as QItem['options'];
  const validKeys = new Set(options.map((o) => o.key));

  // Validation stricte : single = 1 clé connue ; multi = 1..maxSelect clés connues uniques.
  let normalized: string | string[];
  if (row.kind === 'multi') {
    if (!Array.isArray(value) || value.length === 0 || value.some((v) => typeof v !== 'string')) {
      throw errors.badRequest('Réponse invalide (liste de choix attendue).');
    }
    const uniq = [...new Set(value as string[])];
    if (row.max_select && uniq.length > row.max_select) {
      throw errors.badRequest(`Maximum ${row.max_select} choix autorisés.`);
    }
    if (!uniq.every((k) => validKeys.has(k))) throw errors.badRequest('Choix inconnu.');
    normalized = uniq;
  } else {
    if (typeof value !== 'string' || !validKeys.has(value)) {
      throw errors.badRequest('Choix inconnu.');
    }
    normalized = value;
  }

  // UNE écriture atomique — reprise où on s'est arrêté.
  await c.env.DB.prepare(
    `INSERT INTO q_answers (user_id, item_id, value_json, updated_at) VALUES (?, ?, ?, ?)
     ON CONFLICT (user_id, item_id) DO UPDATE SET value_json = excluded.value_json, updated_at = excluded.updated_at`,
  )
    .bind(user.id, itemId, JSON.stringify(normalized), Date.now())
    .run();

  // Progression + détection de fin de niveau (pour la récompense immédiate).
  const items = await loadActiveItems(c.env.DB);
  const answers = await loadMyAnswers(c.env.DB, user.id);
  const pr = progress(items, answers);
  const levelOfItem = row.level === 2 ? 2 : 1;
  const levelProgress = levelOfItem === 1 ? pr.n1 : pr.n2;
  const completed = levelProgress.done >= levelProgress.total;

  const body: QAnswerResponse = {
    saved: true,
    progress: pr,
    levelCompleted: completed ? (levelOfItem as 1 | 2) : null,
    insights: completed ? insightsForLevel(items, answers, levelOfItem as 1 | 2) : null,
  };
  return c.json(body);
});

questionnaireRoutes.get('/q/insights', async (c) => {
  const user = await requireUser(c);
  const items = await loadActiveItems(c.env.DB);
  const answers = await loadMyAnswers(c.env.DB, user.id);
  const pr = progress(items, answers);
  const insights: LevelInsights[] = [];
  if (pr.n1.total > 0 && pr.n1.done >= pr.n1.total) insights.push(insightsForLevel(items, answers, 1));
  if (pr.n2.total > 0 && pr.n2.done >= pr.n2.total) insights.push(insightsForLevel(items, answers, 2));
  return c.json({ levels: insights });
});

// ---------------------------------------------------------------------------
// P0 runtime — BANQUE DOCTRINE (F.2a/BLOC 1 · B.5b/B.5c/BLOC 3 · F.2b/BLOC 2)
//
// GET /api/qd                → la banque active (531 items doctrine, 0 générique)
//                              + mes réponses + progression ;
// PUT /api/qd/answers/:code  → UNE réponse (upsert) + response_ms (B.5b) ;
//                              recalcul du snapshot de vigilance (F.2b —
//                              MOTEUR SEUL, jamais rendu).
//
// Règles servies : items trame ▲ avec la formulation 11-b si disponible
// (env TRAME_*, lib/trames.ts — jamais loggée), sinon le placeholder
// officiel + trame_absente=1 (exclue des moyennes de signaux) ;
// recodage I = 6−r à l'écriture ; R6 (|D − (6−I)| ≥ 3) évalué à la volée ;
// détecteurs droite-ligne / motif aléatoire / réponses réflexes → QFI.
// ---------------------------------------------------------------------------

interface DoctrineRow {
  code: string;
  monde: string;
  quete: string;
  position: number | null;
  orientation: 'D' | 'I' | null;
  is_trame: number;
  format: string;
  prompt: string;
  signal_id: string | null;
}

interface DoctrineAnswerRow {
  code: string;
  value_num: number | null;
  value_json: string | null;
}

/** Échelle Likert 5 niveaux (Arbitrage 2 — banque doctrine). */
const LIKERT5: QItem['options'] = [
  { key: '1', label: 'Pas du tout comme moi' },
  { key: '2', label: 'Plutôt pas comme moi' },
  { key: '3', label: 'Ni l’un ni l’autre' },
  { key: '4', label: 'Plutôt comme moi' },
  { key: '5', label: 'Tout à fait comme moi' },
];

/** Formats servis avec options de choix (les autres = passation guidée P1). */
const FORMATS_A_OPTIONS = new Set(['likert5']);
/** Formats à réponse libre. */
const FORMATS_LIBRES = new Set(['ouverte']);

async function loadDoctrineItems(db: D1Database): Promise<DoctrineRow[]> {
  const { results } = await db
    .prepare(
      `SELECT code, monde, quete, position, orientation, is_trame, format, prompt, signal_id
       FROM q_doctrine_items WHERE active = 1
       ORDER BY CAST(monde AS TEXT) ASC, quete ASC, position ASC, code ASC`,
    )
    .all<DoctrineRow>();
  return results ?? [];
}

async function loadMyDoctrineAnswers(
  db: D1Database,
  userId: string,
): Promise<{ answers: Record<string, DoctrineValue>; byCode: Map<string, DoctrineAnswerRow> }> {
  const { results } = await db
    .prepare(
      `SELECT code, value_num, value_json FROM q_doctrine_answers WHERE user_id = ?`,
    )
    .bind(userId)
    .all<DoctrineAnswerRow>();
  const answers: Record<string, DoctrineValue> = {};
  const byCode = new Map<string, DoctrineAnswerRow>();
  for (const r of results ?? []) {
    byCode.set(r.code, r);
    answers[r.code] = r.value_num ?? (r.value_json ? (JSON.parse(r.value_json) as DoctrineValue) : 0);
  }
  return { answers, byCode };
}

questionnaireRoutes.get('/qd', async (c) => {
  const user = await requireUser(c);
  const rows = await loadDoctrineItems(c.env.DB);

  // Trames 11-b : substitution à la volée si la formulation est disponible.
  const trameCodes = rows.filter((r) => r.is_trame === 1).map((r) => r.code);
  const trames = loadTrames(c.env as unknown as Record<string, unknown>, trameCodes);

  const items: DoctrineQItem[] = rows.map((r) => ({
    code: r.code,
    monde: r.monde,
    quete: r.quete,
    position: r.position,
    format: r.format as DoctrineFormat,
    prompt: r.is_trame === 1 ? (trames.get(r.code) ?? r.prompt) : r.prompt,
    ...(FORMATS_A_OPTIONS.has(r.format) ? { options: LIKERT5 } : {}),
    isTrame: false, // ⚠ 11-b : la nature trame n'est PAS exposée au client
    signalId: null, // ⚠ moteur seul — jamais sérialisé vers le client
  }));

  const { answers } = await loadMyDoctrineAnswers(c.env.DB, user.id);
  const body: DoctrineBankState = {
    bank: 'doctrine_v1',
    items,
    myAnswers: answers,
    progress: { done: Object.keys(answers).length, total: items.length },
  };
  return c.json(body);
});

/** Stats psychométriques (QFI) recalculées depuis les réponses stockées. */
async function computePsychometryStats(
  db: D1Database,
  userId: string,
): Promise<PsychometryStats> {
  const rows = await loadDoctrineItems(db);
  const { byCode } = await loadMyDoctrineAnswers(db, userId);

  // Séquence Likert chronologique (droite-ligne / motif aléatoire / réflexes).
  const { results: seq } = await db
    .prepare(
      `SELECT a.value_num, a.response_ms FROM q_doctrine_answers a
       JOIN q_doctrine_items i ON i.code = a.code
       WHERE a.user_id = ? AND a.value_num IS NOT NULL
       ORDER BY a.answered_at ASC`,
    )
    .bind(userId)
    .all<{ value_num: number; response_ms: number | null }>();
  const likert = (seq ?? []).map((r) => r.value_num);
  const avecMs = (seq ?? []).filter((r) => r.response_ms !== null);
  const fastRatio =
    avecMs.length === 0
      ? 0
      : avecMs.filter((r) => (r.response_ms ?? 0) < PSYCHOMETRY.MIN_RESPONSE_MS).length / avecMs.length;

  // Paires R6 : paire '↔NN' → partenaire Q<quete>-NN ; D brut vs I recodé.
  let incoherences = 0;
  const parCode = new Map(rows.map((r) => [r.code, r]));
  for (const r of rows) {
    if (!r.paire || r.orientation !== 'D') continue;
    const partenaire = `Q${r.quete}-${r.paire.replace('↔', '')}`;
    const p = parCode.get(partenaire);
    if (!p || p.orientation !== 'I') continue;
    const d = byCode.get(r.code)?.value_num;
    const i = byCode.get(partenaire)?.value_num;
    if (d === undefined || d === null || i === undefined || i === null) continue;
    if (r6Incoherent(d, i)) incoherences++;
  }

  return {
    straightLining: detectStraightLining(likert),
    randomPattern: detectRandomPattern(likert),
    fastResponseRatio: Math.round(fastRatio * 100) / 100,
    r6Incoherences: incoherences,
  };
}

/**
 * Snapshot de vigilance — MOTEUR SEUL. Stocké dans q_doctrine_flags pour la
 * modération/comité — jamais renvoyé au client, jamais dans le score.
 */
async function refreshVigilanceSnapshot(
  db: D1Database,
  env: Record<string, unknown>,
  userId: string,
): Promise<void> {
  const rows = await loadDoctrineItems(db);
  const { byCode } = await loadMyDoctrineAnswers(db, userId);
  const trameCodes = rows.filter((r) => r.is_trame === 1).map((r) => r.code);
  const trames = loadTrames(env, trameCodes);

  // Recodage I (6−r) appliqué à la lecture pour le moteur (I stockées recodées
  // à l'écriture → déjà alignées « plus haut = plus de trait D »).
  const answers: Record<string, number> = {};
  for (const r of rows) {
    const v = byCode.get(r.code)?.value_num;
    if (v !== undefined && v !== null) answers[r.code] = v;
  }

  // Modulation Q1.7 (TDAH) — règle de détection À VALIDER PAR LE COMITÉ :
  // le drapeau est posé à false au P0 (aucune règle tranchée) ; la modulation
  // dans evaluateVigilance est implémentée et rejouable dès que le comité
  // tranche la règle de détection.
  const q17TDAH = false;

  const items: VigilanceBankItem[] = rows.map((r) => ({
    code: r.code,
    signalId: r.signal_id,
    isTrame: r.is_trame === 1,
    trameDisponible: r.is_trame !== 1 || trames.has(r.code),
    orientation: r.orientation,
    quete: r.quete,
  }));

  const stats = await computePsychometryStats(db, userId);
  const signaux = evaluateVigilance({ items, answers, stats, q17TDAH });

  // Matrice des pièges SIG-4.4-06 — MOTEUR SEUL. La doctrine M5-4.4 grave :
  // « la variable FIS (bloc 4.4, matrice moteur — SIG-4.4-06) ne participe
  // JAMAIS à la sélection ni au rendu » → la matrice est calculée et
  // stockée au snapshot (revue modération/comité), JAMAIS consommée par le
  // feed ni rendue. Entrées disponibles au P0 : FIS + MEFI_INT (4.4) et
  // RSQ (1.2) ; Abandon/Évitement/Carence/Narcissisme viennent d'étages non
  // câblés au P0 → null (cellules sans objet — pas de faux chiffres).
  const norm0to1 = (v: number | undefined): number | null =>
    v === undefined ? null : Math.round(((v - 1) / 4) * 100) / 100;
  const moyenneSignal = (sig: string): number | undefined => {
    const src = items.filter((i) => i.signalId === sig && answers[i.code] !== undefined);
    if (src.length === 0) return undefined;
    return src.reduce((s, i) => s + (answers[i.code] ?? 0), 0) / src.length;
  };
  const matricePuits = pitMatrix({
    abandon: null,
    evitement: null,
    carence: null,
    narcissisme: null,
    mefiance: norm0to1(moyenneSignal('MEFI_INT')),
    rsq: norm0to1(moyenneSignal('RSQ')),
    fis: norm0to1(moyenneSignal('FIS')),
  });

  await db
    .prepare(
      `INSERT INTO q_doctrine_flags (user_id, flags_json, updated_at) VALUES (?, ?, ?)
       ON CONFLICT (user_id) DO UPDATE SET flags_json = excluded.flags_json, updated_at = excluded.updated_at`,
    )
    .bind(userId, JSON.stringify({ signaux, stats, q17TDAH, matricePuits }), Date.now())
    .run();
}

questionnaireRoutes.put('/qd/answers/:code', async (c) => {
  const user = await requireUser(c);

  const rl = await hitRateLimit(c.env.DB, RATE_RULES.qAnswerUser, user.id);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.qAnswerUser.scope);

  const code = c.req.param('code');
  const row = await c.env.DB.prepare(
    `SELECT code, orientation, is_trame, format, prompt FROM q_doctrine_items WHERE code = ? AND active = 1`,
  )
    .bind(code)
    .first<{ code: string; orientation: 'D' | 'I' | null; is_trame: number; format: string; prompt: string }>();
  if (!row) throw errors.notFound('Item doctrine inconnu.');

  const payload = (await c.req.json().catch(() => null)) as
    | { value?: unknown; responseMs?: unknown }
    | null;

  // Temps de réponse (B.5b) — collecté par le front, tolérant si absent.
  let responseMs: number | null = null;
  if (payload?.responseMs !== undefined && payload?.responseMs !== null) {
    if (typeof payload.responseMs !== 'number' || !Number.isFinite(payload.responseMs)) {
      throw errors.badRequest('responseMs invalide.');
    }
    responseMs = Math.max(0, Math.min(600000, Math.round(payload.responseMs)));
  }

  // Validation par format (formats à passation guidée → refus explicite P0).
  let valueNum: number | null = null;
  let valueJson: string | null = null;
  let trameAbsente = 0;
  if (FORMATS_A_OPTIONS.has(row.format)) {
    const v = payload?.value;
    if (typeof v !== 'number' || !Number.isInteger(v) || v < 1 || v > 5) {
      throw errors.badRequest('Réponse attendue : entier 1-5.');
    }
    // Recodage I = 6 − r (Arbitrage 1) à l'écriture — le moteur lit aligné.
    valueNum = row.orientation === 'I' ? 6 - v : v;
  } else if (FORMATS_LIBRES.has(row.format)) {
    const v = payload?.value;
    if (typeof v !== 'string' || v.trim().length === 0 || v.length > 2000) {
      throw errors.badRequest('Réponse attendue : texte (1-2000 caractères).');
    }
    valueJson = JSON.stringify(v.trim());
  } else {
    throw errors.badRequest('Passation guidée requise pour ce format (hors périmètre P0).');
  }

  // Trame sans formulation 11-b disponible → servie avec le placeholder ;
  // la réponse est stockée mais marquée trame_absente (exclue des signaux).
  if (row.is_trame === 1 && loadTrame(c.env as unknown as Record<string, unknown>, row.code) === null) {
    trameAbsente = 1;
  }

  await c.env.DB.prepare(
    `INSERT INTO q_doctrine_answers (user_id, code, value_num, value_json, response_ms, trame_absente, answered_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT (user_id, code) DO UPDATE SET
       value_num = excluded.value_num, value_json = excluded.value_json,
       response_ms = excluded.response_ms, trame_absente = excluded.trame_absente,
       answered_at = excluded.answered_at`,
  )
    .bind(user.id, row.code, valueNum, valueJson, responseMs, trameAbsente, Date.now())
    .run();

  // Snapshot de vigilance — moteur seul (F.2b), jamais renvoyé au client.
  await refreshVigilanceSnapshot(c.env.DB, c.env as unknown as Record<string, unknown>, user.id);

  const rows = await loadDoctrineItems(c.env.DB);
  const { answers } = await loadMyDoctrineAnswers(c.env.DB, user.id);
  const body: DoctrineAnswerResponse = {
    saved: true,
    progress: { done: Object.keys(answers).length, total: rows.length },
  };
  return c.json(body);
});

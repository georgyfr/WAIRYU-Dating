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
  type QItem,
  type QDimension,
  type QAnswers,
  type QProgress,
  type QuestionnaireState,
  type QAnswerResponse,
  type LevelInsights,
} from '@wairyu/shared';
import { insightsForLevel } from '@wairyu/shared';

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
async function loadActiveItems(db: D1Database): Promise<QItem[]> {
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

async function loadMyAnswers(db: D1Database, userId: string): Promise<QAnswers> {
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

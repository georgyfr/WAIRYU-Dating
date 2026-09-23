/**
 * Archétypes de personnalité (Étape 4-bis — demande fondateur).
 *
 *  - GET /api/personality  → dérivation à partir des réponses réelles du
 *    questionnaire (règles partagées, zéro IA) + état courant (validé ou
 *    « proposé ») + 2 alternatives pour « plutôt ça ? » ;
 *  - PUT /api/personality  → la personne CHOISIT son archétype — le type n'est
 *    jamais imposé : c'est un auto-label confirmé par son auteur.
 *
 * Éthique : le type reste indicatif, explicable (signaux = réponses qui ont
 * pesé), modifiable à tout moment. Aucun « incompatible » n'existe.
 */
import { Hono } from 'hono';
import type { Context } from 'hono';
import type { AppEnv } from '../env';
import { errors } from '../lib/errors';
import { RATE_RULES, hitRateLimit, rateLimitedError } from '../lib/ratelimit';
import { validateEnum } from '../lib/profile';
import {
  derivePersonality,
  ARCHETYPES,
  ARCHETYPE_IDS,
  type PersonalityState,
  type PersonalityUpdateResponse,
  type PersonalityCurrent,
  type QItem,
  type QAnswers,
} from '@wairyu/shared';
import { loadActiveItems, loadMyAnswers } from './questionnaire';

export const personalityRoutes = new Hono<AppEnv>();

interface PersonalityRow {
  type: string;
  validated: number;
  suggested: string;
  derived_from: string;
}

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

/** Charge (banque, réponses) puis dérive les suggestions — partagé GET/PUT. */
async function derive(
  db: D1Database,
  userId: string,
): Promise<{ items: QItem[]; answers: QAnswers; derivation: ReturnType<typeof derivePersonality> }> {
  const items = await loadActiveItems(db);
  const answers = await loadMyAnswers(db, userId);
  return { items, answers, derivation: derivePersonality(answers, items) };
}

async function loadCurrent(db: D1Database, userId: string): Promise<PersonalityRow | null> {
  return db
    .prepare(`SELECT type, validated, suggested, derived_from FROM personality_profiles WHERE user_id = ?`)
    .bind(userId)
    .first<PersonalityRow>();
}

personalityRoutes.get('/personality', async (c) => {
  const user = await requireUser(c);
  const { derivation } = await derive(c.env.DB, user.id);
  const row = await loadCurrent(c.env.DB, user.id);

  const suggestions = derivation.ready && derivation.primary
    ? [derivation.primary, ...derivation.alternatives].map((s) => ({
        id: s.id,
        score: s.score,
        signals: s.signals,
        name: ARCHETYPES[s.id].name,
        tagline: ARCHETYPES[s.id].tagline,
        description: ARCHETYPES[s.id].description,
      }))
    : [];

  const body: PersonalityState = {
    ready: derivation.ready,
    current:
      row && (ARCHETYPE_IDS as readonly string[]).includes(row.type)
        ? {
            type: row.type as PersonalityCurrent['type'],
            validated: row.validated === 1,
            // Dérivation LIVE (pas la valeur stockée) : dès que le Niveau 2
            // avance, l'état reflète immédiatement « n1+n2 » — et le front
            // propose la version affinée sans attendre un nouveau PUT.
            derivedFrom: derivation.derivedFrom,
            suggestions: JSON.parse(row.suggested || '[]'),
          }
        : null,
    suggestions,
    disclaimer:
      'Déduit de tes réponses, jamais imposé : valide-le si tu te reconnais, change-le quand tu veux.',
  };
  return c.json(body);
});

personalityRoutes.put('/personality', async (c) => {
  const user = await requireUser(c);

  const rl = await hitRateLimit(c.env.DB, RATE_RULES.personalityUser, user.id);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.personalityUser.scope);

  const payload = (await c.req.json().catch(() => null)) as { type?: unknown } | null;
  const type = validateEnum(payload?.type, ARCHETYPE_IDS, 'Archétype');

  const { derivation } = await derive(c.env.DB, user.id);
  if (!derivation.ready || !derivation.primary) {
    throw errors.badRequest('Réponds d\u2019abord au questionnaire (au moins 10 questions du niveau 1).');
  }

  const ranking = [derivation.primary.id, ...derivation.alternatives.map((a) => a.id)];
  const current: PersonalityCurrent = {
    type,
    validated: true, // TOUT PUT = un choix confirmé par la personne elle-même.
    derivedFrom: derivation.derivedFrom,
    suggestions: ranking,
  };

  await c.env.DB.prepare(
    `INSERT INTO personality_profiles (user_id, type, validated, suggested, derived_from, updated_at)
     VALUES (?, ?, 1, ?, ?, ?)
     ON CONFLICT (user_id) DO UPDATE SET
       type = excluded.type, validated = 1, suggested = excluded.suggested,
       derived_from = excluded.derived_from, updated_at = excluded.updated_at`,
  )
    .bind(user.id, current.type, JSON.stringify(ranking), current.derivedFrom, Date.now())
    .run();

  const body: PersonalityUpdateResponse = { saved: true, current };
  return c.json(body);
});

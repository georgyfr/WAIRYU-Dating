/**
 * Archétypes de personnalité (Étape 4-bis — demande fondateur).
 *
 *  - GET /api/personality  → dérivation à partir des réponses réelles du
 *    questionnaire (règles partagées, zéro IA) + état courant (validé ou
 *    « proposé ») + 2 alternatives pour « plutôt ça ? » + les types de
 *    profils SÉLECTIONNÉS (mis en avant dans le feed) ;
 *  - PUT /api/personality  → la personne CHOISIT son archétype — le type n'est
 *    jamais imposé : c'est un auto-label confirmé par son auteur ;
 *  - PUT /api/personality/preferences → après validation, la personne
 *    SÉLECTIONNE les types de profils qu'elle veut rencontrer (≤ 4) : le feed
 *    les met en AVANT (boost de classement, jamais un filtre exclusif — les
 *    autres critères exigeants restent inchangés).
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
  MAX_PREF_TYPES,
  type PersonalityState,
  type PersonalityUpdateResponse,
  type PersonalityPrefsResponse,
  type PersonalityCurrent,
  type ArchetypeId,
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
  pref_types: string;
}

/** Parse pref_types en ArchetypeId[] SÛR (ids inconnus filtrés, dédoublonné). */
function parsePrefTypes(raw: string | null | undefined): ArchetypeId[] {
  try {
    const arr = JSON.parse(raw || '[]');
    if (!Array.isArray(arr)) return [];
    const seen = new Set<string>();
    for (const v of arr) if (typeof v === 'string') seen.add(v);
    return [...seen].filter((v): v is ArchetypeId => (ARCHETYPE_IDS as readonly string[]).includes(v));
  } catch {
    return [];
  }
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
    .prepare(`SELECT type, validated, suggested, derived_from, pref_types FROM personality_profiles WHERE user_id = ?`)
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
    prefTypes: row ? parsePrefTypes(row.pref_types) : [],
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

/**
 * Sélection des TYPES DE PROFILS recherchés (demande fondateur : après la
 * validation de sa propre personnalité, la personne choisit les types qu'elle
 * veut rencontrer → le feed les met en avant, avec tous les autres critères).
 * Priorité, PAS un filtre exclusif : les profils hors sélection restent visibles.
 */
personalityRoutes.put('/personality/preferences', async (c) => {
  const user = await requireUser(c);

  const rl = await hitRateLimit(c.env.DB, RATE_RULES.personalityUser, user.id);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.personalityUser.scope);

  const payload = (await c.req.json().catch(() => null)) as { types?: unknown } | null;
  if (!Array.isArray(payload?.types)) {
    throw errors.badRequest('Liste de types attendue.');
  }

  // Validation stricte de CHAQUE id + déduplication (l'ordre de la sélection
  // est conservé pour un affichage stable).
  const seen = new Set<string>();
  const types: ArchetypeId[] = [];
  for (const v of payload!.types) {
    const id = validateEnum(v, ARCHETYPE_IDS, 'Archétype');
    if (!seen.has(id)) {
      seen.add(id);
      types.push(id);
    }
  }
  if (types.length > MAX_PREF_TYPES) {
    throw errors.badRequest(`Jusqu'à ${MAX_PREF_TYPES} types de profils — garde les plus importants.`);
  }

  // La sélection suppose une personnalité VALIDÉE (le parcours produit va du
  // « C'est moi ✓ » vers ce choix) — la ligne existe donc déjà ; défensif :
  // 400 explicite si elle manque.
  const res = await c.env.DB.prepare(
    `UPDATE personality_profiles SET pref_types = ?, updated_at = ? WHERE user_id = ?`,
  )
    .bind(JSON.stringify(types), Date.now(), user.id)
    .run();
  if (!res.meta.changes) {
    throw errors.badRequest('Valide d\u2019abord ta personnalité, puis choisis les types qui te correspondent.');
  }

  const body: PersonalityPrefsResponse = { saved: true, prefTypes: types };
  return c.json(body);
});

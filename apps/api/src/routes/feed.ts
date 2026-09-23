/**
 * Génération des candidats + score de compatibilité (Étape 4 — spec §5.3/§5.4,
 * plan sous-étape 6). Gate 4 : latence < 300 ms → UNE seule requête pool
 * (candidats + leurs réponses via LEFT JOIN, zéro N+1), scoring EN MÉMOIRE
 * sur des fonctions pures, photos signées pour la page courante uniquement.
 *
 * Filtres durs (D1) : actif, non supprimé, ≥1 photo active, fenêtre d'âge
 * (birth_date, sinon birth_year au 1er janvier), genres recherchés,
 * intention recherchée, activité 30 jours (session vue récemment).
 * Filtres mémoire : distance (haversine sur zones ≈11 km) — SAUTÉE en
 * « Mode interracial » (rencontres entre continents, demande fondateur :
 * portée mondiale) — puis deal-breakers exclusifs, scoring, tri, pagination.
 *
 * Confidentialité : seule l'URL de la photo principale est signée, en
 * variante floue si le propriétaire est en Mode Invisible (pas de révélation
 * avant l'Étape 6) ; jamais de quartier ni de rue au niveau du feed.
 */
import { Hono } from 'hono';
import type { Context } from 'hono';
import type { AppEnv } from '../env';
import { errors } from '../lib/errors';
import { RATE_RULES, hitRateLimit, rateLimitedError } from '../lib/ratelimit';
import { signedMediaUrl } from '../lib/cloudinary';
import {
  compatibility,
  parseGeo,
  haversineKm,
  PHOTO_THUMB_WIDTH,
  PHOTO_BLUR_WIDTH,
  affinityBetween,
  AFFINITY_SCORE,
  AFFINITY_LABELS,
  ARCHETYPES,
  ARCHETYPE_IDS,
  type QItem,
  type QAnswers,
  type Intent,
  type FeedProfile,
  type FeedResponse,
  type ArchetypeId,
  type PersonalityAffinity,
} from '@wairyu/shared';

export const feedRoutes = new Hono<AppEnv>();

/** Plafond du pool de candidats scorés (latence Gate 4 ; base gratuite). */
const POOL_MAX = 300;
const PAGE_SIZE = 20;

/** Ligne pool : candidat × (0..n réponses q_answers via LEFT JOIN). */
interface PoolRow {
  id: string;
  display_name: string;
  birth_year: number | null;
  birth_date: string | null;
  city: string;
  neighborhood: string | null;
  country: string | null;
  intent: string | null;
  bio: string;
  geo_region: string | null;
  owner_mode: string | null;
  personality_type: string | null;
  personality_validated: number | null;
  qa_item: string | null;
  qa_value: string | null;
}

interface FeedPhotoRow {
  id: string;
  user_id: string;
  cloudinary_version: number;
  position: number;
  created_at: number;
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

/** Bornes d'âge ISO (date du jour UTC, ±anniversaire exact via birth_date). */
function ageBoundsISO(): { min: string; max: string } {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, '0');
  const d = String(now.getUTCDate()).padStart(2, '0');
  // Le plus VIEUX acceptable = aujourd'hui − 99 ans ; le plus JEUNE = − 18 ans.
  // (minAge/maxAge personnels appliqués en mémoire sur l'âge calculé.)
  return { min: `${y - 99}-${m}-${d}`, max: `${y - 18}-${m}-${d}` };
}

feedRoutes.get('/feed', async (c) => {
  const user = await requireUser(c);
  const t0 = Date.now();

  const rl = await hitRateLimit(c.env.DB, RATE_RULES.feedUser, user.id);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.feedUser.scope);

  const page = Math.max(1, Math.floor(Number(c.req.query('page') ?? '1')) || 1);

  // --- Mon profil + mes préférences ---
  const me = await c.env.DB.prepare(
    `SELECT birth_year, geo_region FROM users WHERE id = ?`,
  )
    .bind(user.id)
    .first<{ birth_year: number | null; geo_region: string | null }>();
  if (!me) throw errors.unauthorized();

  const prefs = await c.env.DB.prepare(
    `SELECT mode_default, pref_gender, min_age, max_age, distance_km, pref_intent FROM user_preferences WHERE user_id = ?`,
  )
    .bind(user.id)
    .first<{ mode_default: string; pref_gender: string; min_age: number; max_age: number; distance_km: number; pref_intent: string | null }>();
  const minAge = prefs?.min_age ?? 18;
  const maxAge = prefs?.max_age ?? 99;
  const prefGender = prefs?.pref_gender ?? 'everyone';
  const prefIntent = prefs?.pref_intent ?? null;
  const distanceKm = prefs?.distance_km ?? 100;
  const myMode = prefs?.mode_default ?? 'classic';
  const myGeo = parseGeo(me.geo_region);
  /** Mode interracial : portée MONDIALE (rencontres entre continents). */
  const worldwide = myMode === 'interracial';

  // --- Mon archétype (pour l'affinité et la 6e dimension du score) ---
  const myPersRow = await c.env.DB.prepare(
    `SELECT type, validated FROM personality_profiles WHERE user_id = ?`,
  )
    .bind(user.id)
    .first<{ type: string; validated: number }>();
  const myArchetype =
    myPersRow && (ARCHETYPE_IDS as readonly string[]).includes(myPersRow.type)
      ? (myPersRow.type as ArchetypeId)
      : null;

  // --- Banque active + mes réponses ---
  const { results: itemRows } = await c.env.DB.prepare(
    `SELECT id, level, position, dimension, kind, prompt, options_json, max_select, is_deal_breaker
     FROM q_items WHERE active = 1 ORDER BY level ASC, position ASC`,
  ).all<{ id: string; level: number; position: number; dimension: string; kind: string; prompt: string; options_json: string; max_select: number | null; is_deal_breaker: number }>();
  const qItems: QItem[] = (itemRows ?? []).map((r) => ({
    id: r.id,
    level: (r.level === 2 ? 2 : 1) as 1 | 2,
    position: r.position,
    dimension: r.dimension as QItem['dimension'],
    kind: r.kind === 'multi' ? 'multi' : 'single',
    prompt: r.prompt,
    options: JSON.parse(r.options_json) as QItem['options'],
    maxSelect: r.max_select ?? null,
    isDealBreaker: r.is_deal_breaker === 1,
  }));

  const { results: myRows } = await c.env.DB.prepare(
    `SELECT item_id, value_json FROM q_answers WHERE user_id = ?`,
  )
    .bind(user.id)
    .all<{ item_id: string; value_json: string }>();
  const myAnswers: QAnswers = {};
  for (const r of myRows ?? []) {
    try {
      myAnswers[r.item_id] = JSON.parse(r.value_json);
    } catch {
      /* ignorée */
    }
  }

  // --- UNE requête pool : candidats + leurs réponses (aucun N+1) ---
  const bounds = ageBoundsISO();
  const now = Math.floor(Date.now() / 1000);
  const genderFilter =
    prefGender === 'women' ? `AND u.gender = 'woman'` : prefGender === 'men' ? `AND u.gender = 'man'` : '';

  const { results: poolRows } = await c.env.DB.prepare(
    `SELECT u.id, u.display_name, u.birth_year, u.birth_date, u.city, u.neighborhood, u.country,
            u.intent, u.bio, u.geo_region, up.mode_default AS owner_mode,
            pp.type AS personality_type, pp.validated AS personality_validated,
            qa.item_id AS qa_item, qa.value_json AS qa_value
     FROM users u
     LEFT JOIN user_preferences up ON up.user_id = u.id
     LEFT JOIN personality_profiles pp ON pp.user_id = u.id
     LEFT JOIN q_answers qa ON qa.user_id = u.id
     WHERE u.id != ?1 AND u.status = 'active'
       AND EXISTS (SELECT 1 FROM photos ph WHERE ph.user_id = u.id AND ph.status = 'active' AND ph.deleted_at IS NULL)
       AND EXISTS (SELECT 1 FROM sessions s WHERE s.user_id = u.id AND s.revoked_at IS NULL AND s.last_seen_at > ?2)
       AND COALESCE(u.birth_date, CAST(u.birth_year AS TEXT) || '-01-01') BETWEEN ?3 AND ?4
       ${genderFilter}
       AND (?6 IS NULL OR u.intent = ?6)
     LIMIT ?5`,
  )
    .bind(user.id, now - 30 * 86400, bounds.min, bounds.max, POOL_MAX, prefIntent)
    .all<PoolRow>();

  // Regroupement candidat → réponses (le JOIN duplique les lignes candidat).
  const candidates = new Map<string, { row: PoolRow; answers: QAnswers }>();
  for (const r of poolRows ?? []) {
    let entry = candidates.get(r.id);
    if (!entry) {
      entry = { row: r, answers: {} };
      candidates.set(r.id, entry);
    }
    if (r.qa_item && r.qa_value) {
      try {
        entry.answers[r.qa_item] = JSON.parse(r.qa_value);
      } catch {
        /* ignorée */
      }
    }
  }

  // --- Scoring en mémoire ---
  const t1 = Date.now();
  const scored: FeedProfile[] = [];
  let excludedDealBreaker = 0;
  let excludedDistance = 0;

  for (const { row, answers: theirAnswers } of candidates.values()) {
    const theirGeo = parseGeo(row.geo_region);
    if (!worldwide && myGeo && theirGeo && haversineKm(myGeo, theirGeo) > distanceKm) {
      excludedDistance++;
      continue;
    }

    let score: number | null = null;
    let reasons: FeedProfile['matchReasons'] = null;
    let personalityAffinity: PersonalityAffinity | null = null;
    const bothAnswered = qItems.some(
      (i) => myAnswers[i.id] !== undefined && theirAnswers[i.id] !== undefined,
    );

    if (bothAnswered) {
      // Dimension « Préférences déclarées » : chevauchement des intentions.
      const theirIntent = row.intent as Intent | null;
      const prefScore = prefIntent == null ? 70 : theirIntent === prefIntent ? 100 : 40;
      // Dimension « Affinité d'archétypes » (Étape 4-bis) : n'existe que si les
      // DEUX membres ont un type — sinon neutre (poids simplement non compté).
      const theirArchetype =
        row.personality_type && (ARCHETYPE_IDS as readonly string[]).includes(row.personality_type)
          ? (row.personality_type as ArchetypeId)
          : null;
      const affinity: PersonalityAffinity | null =
        myArchetype && theirArchetype ? affinityBetween(myArchetype, theirArchetype) : null;
      const result = compatibility(
        qItems,
        myAnswers,
        theirAnswers,
        user.id,
        row.id,
        prefScore,
        affinity === null ? null : AFFINITY_SCORE[affinity],
      );
      if (result.dealBreakerConflict) {
        excludedDealBreaker++;
        continue; // Exclusif : la paire n'est jamais proposée.
      }
      score = result.score;
      reasons = result.reasons;
      if (affinity === 'strong' && myArchetype && theirArchetype) {
        reasons.forces = [
          `Vos personnalités se répondent : ${ARCHETYPES[theirArchetype].name} × ${ARCHETYPES[myArchetype].name} — ${AFFINITY_LABELS.strong}.`,
          ...reasons.forces,
        ].slice(0, 3);
      }
      personalityAffinity = affinity;
    }

    const age = row.birth_year ? Math.max(18, new Date().getUTCFullYear() - row.birth_year) : 18;

    scored.push({
      userId: row.id,
      displayName: row.display_name ?? 'Quelqu’un',
      age,
      city: row.city ?? '',
      neighborhood: null, // Produit : jamais de quartier dans le feed.
      country: row.country ?? null,
      intent: (row.intent ?? 'open') as Intent,
      bio: row.bio ?? '',
      prompts: [], // Les prompts arrivent avec la fiche détaillée (Étape 5).
      photoUrl: null, // Rempli plus bas pour la page courante uniquement.
      photoBlurred: false,
      matchReasons: reasons,
      score,
      personalityType: (row.personality_type as FeedProfile['personalityType']) ?? null,
      personalityValidated: row.personality_validated === 1,
      personalityAffinity,
    });
  }

  // --- Tri (nuls en fin) + pagination ---
  scored.sort((a, b) => (b.score ?? -1) - (a.score ?? -1) || a.userId.localeCompare(b.userId));
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = scored.slice(start, start + PAGE_SIZE);
  const hasMore = scored.length > start + PAGE_SIZE;

  // --- Photos de la page courante uniquement (≤ 20 signatures) ---
  if (pageItems.length > 0) {
    const ids = pageItems.map((p) => p.userId);
    const placeholders = ids.map(() => '?').join(',');
    const { results: photoRows } = await c.env.DB.prepare(
      `SELECT id, user_id, cloudinary_version, position, created_at
       FROM photos
       WHERE status = 'active' AND deleted_at IS NULL AND user_id IN (${placeholders})
       ORDER BY position ASC, created_at ASC`,
    )
      .bind(...ids)
      .all<FeedPhotoRow>();
    const best = new Map<string, FeedPhotoRow>();
    for (const r of photoRows ?? []) if (!best.has(r.user_id)) best.set(r.user_id, r);

    await Promise.all(
      pageItems.map(async (item) => {
        const photo = best.get(item.userId);
        if (!photo) return;
        const blurred = candidates.get(item.userId)?.row.owner_mode === 'invisible';
        const publicId = `${c.env.CLOUDINARY_ROOT_FOLDER}/photos/${item.userId}/${photo.id}`;
        item.photoBlurred = blurred;
        item.photoUrl = await signedMediaUrl(c.env.CLOUDINARY_CLOUD_NAME, c.env.CLOUDINARY_API_SECRET, publicId, {
          version: photo.cloudinary_version,
          transformation: `c_limit,w_${blurred ? PHOTO_BLUR_WIDTH : PHOTO_THUMB_WIDTH}`,
        });
      }),
    );
  }

  const body: FeedResponse = {
    page,
    pageSize: PAGE_SIZE,
    hasMore,
    items: pageItems,
    disclaimer: 'Ce score est un indice basé sur vos réponses déclarées — indicatif, jamais prédictif.',
  };

  c.header('X-Wairyu-Feed-Ms', String(Date.now() - t0));
  c.header('X-Wairyu-Score-Ms', String(Date.now() - t1));
  c.header('X-Wairyu-Pool', String(candidates.size));
  c.header('X-Wairyu-Excluded-Db', String(excludedDealBreaker));
  c.header('X-Wairyu-Excluded-Dist', String(excludedDistance));
  return c.json(body);
});

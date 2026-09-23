/**
 * Découverte — génération des candidats scorés (Étape 4, refactor Étape 5).
 *
 * UNE seule fonction `generateFeedPage` alimente :
 *  - GET /api/feed (pagination classique, Étape 4) ;
 *  - le cron quotidien « Top Compatibilité » (Étape 5.6, top 5 par utilisateur) ;
 *  - GET /api/discover/top (lecture du top du jour, fallback à la demande).
 * Une seule implémentation = mêmes filtres durs, même score, mêmes règles de
 * confidentialité partout (photos signées page courante uniquement, jamais de
 * quartier, flou piloté par le mode du PROPRIÉTAIRE — spec §4.6 : « chacun
 * voit l'autre selon le mode de celui qui est regardé »).
 *
 * Exclusions du pool (Étape 5) : personnes déjà traitées par un swipe
 * (like/passe/super — le deck ne repropose jamais quelqu'un de déjà vu) et
 * paires liées par UNE de MES demandes « Discuter » (en attente, acceptée ou
 * déclinée — anti-harcèlement déterministe) ou déjà en conversation.
 *
 * Filtres durs (D1) : actif, non supprimé, ≥1 photo active, fenêtre d'âge
 * (birth_date, sinon birth_year au 1er janvier), genres recherchés,
 * intention recherchée, activité 30 jours (session vue récemment).
 * Filtres mémoire : distance (haversine sur zones ≈11 km) — SAUTÉE en
 * « Mode interracial » (rencontres entre continents, demande fondateur :
 * portée mondiale) — puis deal-breakers exclusifs, scoring, tri, pagination.
 */
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
  PROMPT_LIBRARY,
  DISCOVERY,
  type QItem,
  type QAnswers,
  type Intent,
  type FeedProfile,
  type FeedResponse,
  type ArchetypeId,
  type PersonalityAffinity,
} from '@wairyu/shared';

/** Sous-ensemble des bindings Worker requis par la génération de candidats. */
export interface DiscoveryEnv {
  DB: D1Database;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_SECRET: string;
  CLOUDINARY_ROOT_FOLDER: string;
}

export interface FeedDebug {
  pool: number;
  excludedDb: number;
  excludedDist: number;
  feedMs: number;
  scoreMs: number;
}

/** Plafond du pool de candidats scorés (latence Gate 4 ; base gratuite). */
const POOL_MAX = 300;
export const PAGE_SIZE = 20;

/** Ligne pool : candidat × (0..n réponses q_answers via LEFT JOIN). */
interface PoolRow {
  id: string;
  display_name: string | null;
  birth_year: number | null;
  birth_date: string | null;
  city: string | null;
  neighborhood: string | null;
  country: string | null;
  intent: string | null;
  bio: string | null;
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

/** Ordre de priorité des dimensions pour les extraits partagés (cartes Invisible). */
const HIGHLIGHT_DIM_ORDER: QItem['dimension'][] = [
  'values',
  'goals',
  'personality',
  'communication',
  'attachment',
];

/**
 * Extrait ≤ 2 réponses IDENTIQUES « single » (valeurs d'abord) — donnée
 * concrète et vérifiable, affichée sur la carte sans dévoiler le questionnaire
 * complet. Réponses multi et adjacentes écartées (trop bruitées).
 */
function sharedHighlights(qItems: QItem[], myAnswers: QAnswers, theirAnswers: QAnswers): string[] {
  const ordered = [...qItems].sort(
    (a, b) =>
      HIGHLIGHT_DIM_ORDER.indexOf(a.dimension) - HIGHLIGHT_DIM_ORDER.indexOf(b.dimension) ||
      a.position - b.position,
  );
  const out: string[] = [];
  for (const item of ordered) {
    if (out.length >= 2) break;
    if (item.kind !== 'single') continue;
    const mine = myAnswers[item.id];
    const theirs = theirAnswers[item.id];
    if (typeof mine !== 'string' || typeof theirs !== 'string' || mine !== theirs) continue;
    const opt = item.options.find((o) => o.key === mine);
    if (!opt) continue;
    out.push(`« ${item.prompt} » — comme toi : ${opt.label}`);
  }
  return out;
}

/**
 * Génère UNE page de candidats scorés pour l'utilisateur donné.
 * `opts.onlyIds` restreint le pool (Top Compatibilité : re-rendre exactement
 * les 5 cibles stockées le même jour — tolérance ±2 stable par paire/jour,
 * le score recalculé est identique à celui materialisé).
 */
export async function generateFeedPage(
  env: DiscoveryEnv,
  userId: string,
  page: number,
  opts?: { onlyIds?: string[] },
): Promise<{ body: FeedResponse; debug: FeedDebug }> {
  const t0 = Date.now();

  // --- Mon profil + mes préférences ---
  const me = await env.DB.prepare(`SELECT birth_year, geo_region FROM users WHERE id = ?`)
    .bind(userId)
    .first<{ birth_year: number | null; geo_region: string | null }>();
  if (!me) throw new Error('user_not_found');

  const prefs = await env.DB.prepare(
    `SELECT mode_default, pref_gender, min_age, max_age, distance_km, pref_intent FROM user_preferences WHERE user_id = ?`,
  )
    .bind(userId)
    .first<{
      mode_default: string;
      pref_gender: string;
      min_age: number;
      max_age: number;
      distance_km: number;
      pref_intent: string | null;
    }>();
  const minAge = prefs?.min_age ?? 18;
  const maxAge = prefs?.max_age ?? 99;
  const prefGender = prefs?.pref_gender ?? 'everyone';
  const prefIntent = prefs?.pref_intent ?? null;
  const distanceKm = prefs?.distance_km ?? 100;
  const myMode = prefs?.mode_default ?? 'classic';
  const myGeo = parseGeo(me.geo_region);
  /** Mode interracial : portée MONDIALE (rencontres entre continents). */
  const worldwide = myMode === 'interracial';

  // --- Mon archétype + mes TYPES DE PROFILS recherchés (affinité, 6e dimension) ---
  const myPersRow = await env.DB.prepare(
    `SELECT type, validated, pref_types FROM personality_profiles WHERE user_id = ?`,
  )
    .bind(userId)
    .first<{ type: string; validated: number; pref_types: string | null }>();
  const myArchetype =
    myPersRow && (ARCHETYPE_IDS as readonly string[]).includes(myPersRow.type)
      ? (myPersRow.type as ArchetypeId)
      : null;
  const myPrefTypes: ArchetypeId[] = (() => {
    try {
      const arr = JSON.parse(myPersRow?.pref_types || '[]');
      if (!Array.isArray(arr)) return [];
      const seen = new Set<string>();
      for (const v of arr) if (typeof v === 'string') seen.add(v);
      return [...seen].filter((v): v is ArchetypeId =>
        (ARCHETYPE_IDS as readonly string[]).includes(v),
      );
    } catch {
      return [];
    }
  })();

  // --- Banque active + mes réponses ---
  const { results: itemRows } = await env.DB.prepare(
    `SELECT id, level, position, dimension, kind, prompt, options_json, max_select, is_deal_breaker
     FROM q_items WHERE active = 1 ORDER BY level ASC, position ASC`,
  ).all<{
    id: string;
    level: number;
    position: number;
    dimension: string;
    kind: string;
    prompt: string;
    options_json: string;
    max_select: number | null;
    is_deal_breaker: number;
  }>();
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

  const { results: myRows } = await env.DB.prepare(
    `SELECT item_id, value_json FROM q_answers WHERE user_id = ?`,
  )
    .bind(userId)
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
    prefGender === 'women'
      ? `AND u.gender = 'woman'`
      : prefGender === 'men'
        ? `AND u.gender = 'man'`
        : '';
  const onlyIds = opts?.onlyIds;
  const onlyFilter = onlyIds && onlyIds.length > 0 ? `AND u.id IN (${onlyIds.map(() => '?').join(',')})` : '';

  const { results: poolRows } = await env.DB.prepare(
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
       -- Étape 5 : jamais reproposer quelqu'un de déjà traité…
       AND NOT EXISTS (SELECT 1 FROM swipes sw WHERE sw.user_id = ?1 AND sw.target_id = u.id)
       -- …ni mes propres demandes « Discuter » (en attente, acceptée, déclinée),
       -- ni les paires déjà en conversation (handshake accepté).
       AND NOT EXISTS (SELECT 1 FROM invisible_requests ir WHERE ir.from_user = ?1 AND ir.to_user = u.id)
       AND NOT EXISTS (
         SELECT 1 FROM invisible_requests ir2
         WHERE ir2.from_user = u.id AND ir2.to_user = ?1 AND ir2.status = 'accepted'
       )
       -- Étape 6 : un blocage (dans un sens OU dans l'autre) sort la paire
       -- du pool pour toujours (unmatch « en 1 clic », plan 6.7).
       AND NOT EXISTS (
         SELECT 1 FROM blocks b
         WHERE (b.user_id = ?1 AND b.blocked_id = u.id) OR (b.user_id = u.id AND b.blocked_id = ?1)
       )
       ${onlyFilter}
     LIMIT ?5`,
  )
    .bind(
      userId,
      now - 30 * 86400,
      bounds.min,
      bounds.max,
      POOL_MAX,
      prefIntent,
      ...(onlyIds && onlyIds.length > 0 ? onlyIds : []),
    )
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
    let personalitySought = false;
    let highlights: string[] = [];
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
      // Types SÉLECTIONNÉS par la personne (Étape 4-ter) : leur type est mis
      // en avant — affinité FORTE garantie, même si la matrice dirait « bonne »
      // ou « à découvrir ». Priorité, jamais un filtre.
      const sought =
        theirArchetype !== null && myPrefTypes.length > 0 && myPrefTypes.includes(theirArchetype);
      const affinity: PersonalityAffinity | null =
        myArchetype && theirArchetype
          ? sought
            ? 'strong'
            : affinityBetween(myArchetype, theirArchetype)
          : null;
      const result = compatibility(
        qItems,
        myAnswers,
        theirAnswers,
        userId,
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
      if (sought && theirArchetype) {
        reasons.forces = [
          `Son type de personnalité (${ARCHETYPES[theirArchetype].name}) fait partie de ceux que tu cherches — mis en avant pour toi.`,
          ...reasons.forces,
        ].slice(0, 3);
      } else if (affinity === 'strong' && myArchetype && theirArchetype) {
        reasons.forces = [
          `Vos personnalités se répondent : ${ARCHETYPES[theirArchetype].name} × ${ARCHETYPES[myArchetype].name} — ${AFFINITY_LABELS.strong}.`,
          ...reasons.forces,
        ].slice(0, 3);
      }
      personalityAffinity = affinity;
      personalitySought = sought;
      // Extraits partagés (Étape 5 — cartes Invisible : « la personne, avant la photo »).
      highlights = sharedHighlights(qItems, myAnswers, theirAnswers);
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
      prompts: [], // Rempli plus bas pour la page courante uniquement.
      photoUrl: null, // Rempli plus bas pour la page courante uniquement.
      photoBlurred: false,
      matchReasons: reasons,
      score,
      personalityType: (row.personality_type as FeedProfile['personalityType']) ?? null,
      personalityValidated: row.personality_validated === 1,
      personalityAffinity,
      personalitySought,
      highlights,
    });
  }

  // --- Tri (nuls en fin) + pagination ---
  scored.sort((a, b) => (b.score ?? -1) - (a.score ?? -1) || a.userId.localeCompare(b.userId));
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = scored.slice(start, start + PAGE_SIZE);
  const hasMore = !onlyIds && scored.length > start + PAGE_SIZE;

  // --- Photos + prompts de la page courante uniquement (≤ 20 signatures) ---
  if (pageItems.length > 0) {
    const ids = pageItems.map((p) => p.userId);
    const placeholders = ids.map(() => '?').join(',');

    const [photoRes, promptRes] = await Promise.all([
      env.DB.prepare(
        `SELECT id, user_id, cloudinary_version, position, created_at
         FROM photos
         WHERE status = 'active' AND deleted_at IS NULL AND user_id IN (${placeholders})
         ORDER BY position ASC, created_at ASC`,
      )
        .bind(...ids)
        .all<FeedPhotoRow>(),
      env.DB.prepare(
        `SELECT user_id, prompt_key, answer FROM profile_prompts WHERE user_id IN (${placeholders})
         ORDER BY position ASC`,
      )
        .bind(...ids)
        .all<{ user_id: string; prompt_key: string; answer: string }>(),
    ]);

    const best = new Map<string, FeedPhotoRow>();
    for (const r of photoRes.results ?? []) if (!best.has(r.user_id)) best.set(r.user_id, r);

    const promptLabel = new Map<string, string>(
      PROMPT_LIBRARY.map((p) => [p.key, p.label] as const),
    );
    const promptsByUser = new Map<string, { question: string; answer: string }[]>();
    for (const r of promptRes.results ?? []) {
      const list = promptsByUser.get(r.user_id) ?? [];
      list.push({ question: promptLabel.get(r.prompt_key) ?? 'Prompt', answer: r.answer });
      promptsByUser.set(r.user_id, list);
    }

    await Promise.all(
      pageItems.map(async (item) => {
        const photo = best.get(item.userId);
        if (photo) {
          const blurred = candidates.get(item.userId)?.row.owner_mode === 'invisible';
          const publicId = `${env.CLOUDINARY_ROOT_FOLDER}/photos/${item.userId}/${photo.id}`;
          item.photoBlurred = blurred;
          item.photoUrl = await signedUrl(
            env,
            publicId,
            photo.cloudinary_version,
            blurred ? PHOTO_BLUR_WIDTH : PHOTO_THUMB_WIDTH,
          );
        }
        item.prompts = promptsByUser.get(item.userId) ?? [];
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

  return {
    body,
    debug: {
      pool: candidates.size,
      excludedDb: excludedDealBreaker,
      excludedDist: excludedDistance,
      feedMs: Date.now() - t0,
      scoreMs: Date.now() - t1,
    },
  };
}

/** URL Cloudinary signée (HMAC local — zéro appel HTTP). */
async function signedUrl(
  env: DiscoveryEnv,
  publicId: string,
  version: number,
  width: number,
): Promise<string> {
  const { signedMediaUrl } = await import('./cloudinary');
  return signedMediaUrl(env.CLOUDINARY_CLOUD_NAME, env.CLOUDINARY_API_SECRET, publicId, {
    version,
    transformation: `c_limit,w_${width}`,
  });
}

/**
 * Top Compatibilité quotidien (Étape 5.6) — pour chaque utilisateur actif :
 * top 5 scoré du jour, matérialisé dans top_matches (hors quota utilisateur).
 * Les inserts sont groupés par batch D1 (économie de requêtes). Idempotent :
 * un utilisateur déjà materialisé aujourd'hui est sauté.
 */
export async function computeDailyTop(
  env: DiscoveryEnv,
  opts?: { maxUsers?: number; day?: string },
): Promise<{ day: string; users: number; stored: number; skipped: number }> {
  const day = opts?.day ?? new Date().toISOString().slice(0, 10);
  const maxUsers = opts?.maxUsers ?? 200;

  const { results: users } = await env.DB.prepare(
    `SELECT u.id FROM users u
     WHERE u.status = 'active'
       AND EXISTS (SELECT 1 FROM photos ph WHERE ph.user_id = u.id AND ph.status = 'active' AND ph.deleted_at IS NULL)
       AND EXISTS (SELECT 1 FROM user_preferences up WHERE up.user_id = u.id)
     LIMIT ?`,
  )
    .bind(maxUsers)
    .all<{ id: string }>();

  let stored = 0;
  let processed = 0;
  let skipped = 0;

  for (const u of users ?? []) {
    try {
      const already = await env.DB.prepare(
        `SELECT COUNT(*) AS n FROM top_matches WHERE day = ? AND user_id = ?`,
      )
        .bind(day, u.id)
        .first<{ n: number }>();
      if ((already?.n ?? 0) > 0) {
        skipped++;
        continue;
      }
      const { body } = await generateFeedPage(env, u.id, 1);
      const top = body.items.filter((i) => i.score !== null).slice(0, DISCOVERY.topPerDay);
      if (top.length === 0) continue;
      const stmts = top.map((it, idx) =>
        env.DB.prepare(
          `INSERT INTO top_matches (day, user_id, rank, target_id, score) VALUES (?, ?, ?, ?, ?)
           ON CONFLICT (day, user_id, rank) DO UPDATE SET target_id = excluded.target_id, score = excluded.score`,
        ).bind(day, u.id, idx + 1, it.userId, it.score),
      );
      await env.DB.batch(stmts);
      stored += top.length;
      processed++;
    } catch (err) {
      // Un utilisateur en échec n'arrête jamais le calcul global.
      console.error(JSON.stringify({ cron: 'top-daily', user: u.id, err: String(err) }));
    }
  }

  return { day, users: processed, stored, skipped };
}

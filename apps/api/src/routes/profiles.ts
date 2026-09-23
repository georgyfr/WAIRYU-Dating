/**
 * Routes profil & photos protégées (Étape 3).
 *
 * Principles:
 *  - The Worker is the ONLY source of signed Cloudinary URLs (the secret never leaves).
 *  - Authorisation matrix per photo (GET /api/photos/:id/url) :
 *      · owner            → sharp + blur (any status except deleted)
 *      · authenticated user, owner in "classic" mode → sharp + blur
 *      · authenticated user, owner in "invisible" mode → blur ONLY ;
 *        sharp = 403 (revealed consent arrives with Step 6 — chat/reveal)
 *      · everyone else (anonymous, banned…) → 401/403/404
 *    Guessing the URL is useless: asset `authenticated` (404 without signature)
 *    + UUIDv4 public_id + signature bound to the transformation.
 *  - Photos: max 6 (LIMITS.maxPhotos), webp/jpeg/png ≤ 2 Mo, client dimensions ≤ 4096 px.
 *  - Blur = small URL (c_limit,w_400) + CSS blur on the front — no blurred image is stored.
 */
import { Hono } from 'hono';
import type { Context } from 'hono';
import type { AppEnv } from '../env';
import { errors } from '../lib/errors';
import {
  signedMediaUrl,
  uploadAuthenticatedImage,
  destroyAuthenticatedAsset,
} from '../lib/cloudinary';
import {
  validateDisplayName,
  validateBirthYear,
  validateBirthDate,
  validateEnum,
  validateCity,
  validateGeoRegion,
  validateCountry,
  validateNeighborhood,
  validateBio,
  validatePrompts,
  validatePreferences,
  isProfileComplete,
  isConfigured,
} from '../lib/profile';
import { RATE_RULES, hitRateLimit, rateLimitedError } from '../lib/ratelimit';
import { GENDERS, INTENTS, LIMITS, ORIENTATIONS, PROFILE_LIMITS, PHOTO_THUMB_WIDTH, PHOTO_BLUR_WIDTH } from '@wairyu/shared';
import type {
  Gender,
  Intent,
  MeResponse,
  Orientation,
  PhotoDto,
  PhotoUrlResponse,
  PreferencesDto,
  ProfileResponse,
} from '@wairyu/shared';

export const profileRoutes = new Hono<AppEnv>();

type PhotoRow = {
  id: string;
  user_id: string;
  cloudinary_version: number;
  format: string;
  width: number;
  height: number;
  bytes: number;
  position: number;
  status: string;
  created_at: number;
};

const GENDER_VALUES = GENDERS;

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

function requireStorageConfigured(c: Context<AppEnv>): void {
  if (!isConfigured(c.env)) {
    throw errors.internal('Stockage média non configuré (CLOUDINARY_*).');
  }
}

function photoPublicId(c: Context<AppEnv>, userId: string, photoId: string): string {
  return `${c.env.CLOUDINARY_ROOT_FOLDER}/photos/${userId}/${photoId}`;
}

function publicIdFor(c: Context<AppEnv>, row: PhotoRow): string {
  return photoPublicId(c, row.user_id, row.id);
}

/** URL signée vignette (200 px) — transformation à la volée, rien n'est stocké. */
function thumbUrl(c: Context<AppEnv>, row: PhotoRow): Promise<string> {
  return signedMediaUrl(c.env.CLOUDINARY_CLOUD_NAME, c.env.CLOUDINARY_API_SECRET, publicIdFor(c, row), {
    version: row.cloudinary_version,
    transformation: `c_limit,w_${PHOTO_THUMB_WIDTH}`,
  });
}

/** URL signée « floue » (400 px) — le flou visuel est appliqué en CSS côté front. */
function blurUrl(c: Context<AppEnv>, row: PhotoRow): Promise<string> {
  return signedMediaUrl(c.env.CLOUDINARY_CLOUD_NAME, c.env.CLOUDINARY_API_SECRET, publicIdFor(c, row), {
    version: row.cloudinary_version,
    transformation: `c_limit,w_${PHOTO_BLUR_WIDTH}`,
  });
}

/** URL signée nette pleine résolution. */
function fullUrl(c: Context<AppEnv>, row: PhotoRow): Promise<string> {
  return signedMediaUrl(c.env.CLOUDINARY_CLOUD_NAME, c.env.CLOUDINARY_API_SECRET, publicIdFor(c, row), {
    version: row.cloudinary_version,
  });
}

async function listActivePhotos(c: Context<AppEnv>, userId: string): Promise<PhotoRow[]> {
  const { results } = await c.env.DB.prepare(
    `SELECT id, user_id, cloudinary_version, format, width, height, bytes, position, status, created_at
     FROM photos WHERE user_id = ? AND status = 'active' AND deleted_at IS NULL
     ORDER BY position ASC, created_at ASC`,
  )
    .bind(userId)
    .all<PhotoRow>();
  return results ?? [];
}

async function photosAsDto(c: Context<AppEnv>, rows: PhotoRow[], ownerView: boolean): Promise<PhotoDto[]> {
  return Promise.all(
    rows.map(async (row) => ({
      id: row.id,
      position: row.position,
      width: row.width,
      height: row.height,
      bytes: row.bytes,
      format: row.format,
      createdAt: row.created_at,
      urlThumb: await thumbUrl(c, row),
      urlFull: ownerView ? await fullUrl(c, row) : null,
    })),
  );
}

async function bumpMetric(db: D1Database, metric: string): Promise<void> {
  const day = new Date().toISOString().slice(0, 10);
  await db
    .prepare(
      `INSERT INTO metrics_daily (day, metric, value) VALUES (?, ?, 1)
       ON CONFLICT (day, metric) DO UPDATE SET value = value + 1`,
    )
    .bind(day, metric)
    .run();
}

// ---------------------------------------------------------------------------
// GET /api/profile — profil complet de l'utilisateur authentifié
// ---------------------------------------------------------------------------
profileRoutes.get('/profile', async (c) => {
  const user = await requireUser(c);

  const [basics, prompts, photos, prefs] = await Promise.all([
    c.env.DB.prepare(
      `SELECT display_name, birth_year, birth_date, gender, orientation, intent, city, country,
              neighborhood, geo_region, bio, profile_consent_at FROM users WHERE id = ? LIMIT 1`,
    )
      .bind(user.id)
      .first<{
        display_name: string | null;
        birth_year: number | null;
        birth_date: string | null;
        gender: string | null;
        orientation: string | null;
        intent: string | null;
        city: string | null;
        country: string | null;
        neighborhood: string | null;
        geo_region: string | null;
        bio: string | null;
        profile_consent_at: number | null;
      }>(),
    c.env.DB.prepare(
      `SELECT prompt_key, answer FROM profile_prompts WHERE user_id = ? ORDER BY position ASC`,
    )
      .bind(user.id)
      .all<{ prompt_key: string; answer: string }>(),
    Promise.resolve(await listActivePhotos(c, user.id)),
    c.env.DB.prepare(
      `SELECT mode_default, pref_gender, min_age, max_age, distance_km, pref_intent
       FROM user_preferences WHERE user_id = ? LIMIT 1`,
    )
      .bind(user.id)
      .first<{
        mode_default: string;
        pref_gender: string;
        min_age: number;
        max_age: number;
        distance_km: number;
        pref_intent: string | null;
      }>(),
  ]);
  if (!basics) throw errors.unauthorized();

  const promptRows = prompts?.results ?? [];
  const preferencesDto: PreferencesDto | null = prefs
    ? {
        modeDefault: prefs.mode_default as PreferencesDto['modeDefault'],
        prefGender: prefs.pref_gender as PreferencesDto['prefGender'],
        minAge: prefs.min_age,
        maxAge: prefs.max_age,
        distanceKm: prefs.distance_km,
        prefIntent: (prefs.pref_intent as Intent | null) ?? null,
      }
    : null;

  const body: ProfileResponse = {
    displayName: basics.display_name,
    birthYear: basics.birth_year,
    birthDate: basics.birth_date,
    gender: (basics.gender as Gender | null) ?? null,
    orientation: (basics.orientation as Orientation | null) ?? null,
    intent: (basics.intent as Intent | null) ?? null,
    city: basics.city,
    country: basics.country,
    neighborhood: basics.neighborhood,
    geoRegion: basics.geo_region,
    bio: basics.bio,
    profileConsentAt: basics.profile_consent_at,
    prompts: promptRows.map((p) => ({ key: p.prompt_key, answer: p.answer })),
    photos: await photosAsDto(c, photos, true),
    preferences: preferencesDto,
    profileComplete: isProfileComplete(
      {
        display_name: basics.display_name,
        birth_year: basics.birth_year,
        birth_date: basics.birth_date,
        gender: basics.gender,
        orientation: basics.orientation,
        intent: basics.intent,
        city: basics.city,
        bio: basics.bio,
        profile_consent_at: basics.profile_consent_at,
      },
      { photoCount: photos.length, promptCount: promptRows.length, hasPreferences: prefs !== null },
    ),
  };
  return c.json(body);
});

// ---------------------------------------------------------------------------
// PUT /api/profile — mise à jour partielle (basics + prompts + consentement)
// ---------------------------------------------------------------------------
profileRoutes.put('/profile', async (c) => {
  const user = await requireUser(c);
  const payload = (await c.req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!payload) throw errors.badRequest();

  const current = await c.env.DB.prepare(
    `SELECT display_name, birth_year, birth_date, gender, orientation, intent, city, country,
            neighborhood, geo_region, bio, profile_consent_at FROM users WHERE id = ? LIMIT 1`,
  )
    .bind(user.id)
    .first<{
      display_name: string | null;
      birth_year: number | null;
      birth_date: string | null;
      gender: string | null;
      orientation: string | null;
      intent: string | null;
      city: string | null;
      country: string | null;
      neighborhood: string | null;
      geo_region: string | null;
      bio: string | null;
      profile_consent_at: number | null;
    }>();
  if (!current) throw errors.unauthorized();

  // --- Consentement explicite dédié : requis pour écrire orientation/intent/localisation.
  const touchesSensitive =
    'orientation' in payload ||
    'intent' in payload ||
    'city' in payload ||
    'country' in payload ||
    'neighborhood' in payload ||
    'geoRegion' in payload;
  const consentGiven = current.profile_consent_at !== null || payload.consentAccepted === true;
  if (touchesSensitive && !consentGiven) {
    throw errors.badRequest('Consentement explicite requis pour ces informations (découverte/matching).');
  }

  const now = Math.floor(Date.now() / 1000);
  const sets: string[] = [];
  const values: (string | number | null)[] = [];

  if ('displayName' in payload) {
    sets.push('display_name = ?');
    values.push(validateDisplayName(payload.displayName));
  }
  if ('birthYear' in payload) {
    const year = validateBirthYear(payload.birthYear);
    sets.push('birth_year = ?');
    values.push(year);
    // Invariant : birth_year et birth_date restent TOUJOURS cohérents —
    // l'écriture « année seule » (compat anciens clients) cale la date au 1er janvier.
    if (!('birthDate' in payload)) {
      sets.push('birth_date = ?');
      values.push(`${year}-01-01`);
    }
  }
  if ('birthDate' in payload) {
    const iso = validateBirthDate(payload.birthDate);
    sets.push('birth_date = ?');
    values.push(iso);
    // birth_year reste synchronisé (compat matching/export/anciens écrans).
    if (!('birthYear' in payload)) {
      sets.push('birth_year = ?');
      values.push(Number(iso.slice(0, 4)));
    }
  }
  if ('gender' in payload) {
    sets.push('gender = ?');
    values.push(validateEnum(payload.gender, GENDER_VALUES, 'Genre'));
  }
  if ('orientation' in payload) {
    sets.push('orientation = ?');
    values.push(validateEnum(payload.orientation, ORIENTATIONS, 'Orientation'));
  }
  if ('intent' in payload) {
    sets.push('intent = ?');
    values.push(validateEnum(payload.intent, INTENTS, 'Intention'));
  }
  if ('city' in payload) {
    sets.push('city = ?');
    values.push(validateCity(payload.city));
  }
  if ('country' in payload) {
    sets.push('country = ?');
    values.push(validateCountry(payload.country));
  }
  if ('neighborhood' in payload) {
    sets.push('neighborhood = ?');
    values.push(validateNeighborhood(payload.neighborhood));
  }
  if ('geoRegion' in payload) {
    sets.push('geo_region = ?');
    values.push(validateGeoRegion(payload.geoRegion));
  }
  if ('bio' in payload) {
    sets.push('bio = ?');
    values.push(validateBio(payload.bio));
  }
  if (payload.consentAccepted === true) {
    sets.push('profile_consent_at = ?');
    values.push(now);
  }
  if (sets.length > 0) {
    sets.push('updated_at = ?');
    values.push(now, user.id);
    await c.env.DB.prepare(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`).bind(...values).run();
  }

  // --- Prompts : remplacement atomique (0 à 3).
  if ('prompts' in payload) {
    const prompts = validatePrompts(payload.prompts);
    const stmts = [
      c.env.DB.prepare(`DELETE FROM profile_prompts WHERE user_id = ?`).bind(user.id),
      ...prompts.map((p) =>
        c.env.DB.prepare(
          `INSERT INTO profile_prompts (user_id, position, prompt_key, answer, updated_at)
           VALUES (?, ?, ?, ?, ?)`,
        ).bind(user.id, p.position, p.promptKey, p.answer, now),
      ),
    ];
    await c.env.DB.batch(stmts);
  }

  await bumpMetric(c.env.DB, 'profile_saved');
  return c.json({ saved: true });
});

// ---------------------------------------------------------------------------
// GET /api/profile/preferences — lecture
// ---------------------------------------------------------------------------
profileRoutes.get('/profile/preferences', async (c) => {
  const user = await requireUser(c);
  const prefs = await c.env.DB.prepare(
    `SELECT mode_default, pref_gender, min_age, max_age, distance_km, pref_intent
     FROM user_preferences WHERE user_id = ? LIMIT 1`,
  )
    .bind(user.id)
    .first<{
      mode_default: string;
      pref_gender: string;
      min_age: number;
      max_age: number;
      distance_km: number;
      pref_intent: string | null;
    }>();
  if (!prefs) throw errors.notFound('Préférences non encore définies.');
  const body: PreferencesDto = {
    modeDefault: prefs.mode_default as PreferencesDto['modeDefault'],
    prefGender: prefs.pref_gender as PreferencesDto['prefGender'],
    minAge: prefs.min_age,
    maxAge: prefs.max_age,
    distanceKm: prefs.distance_km,
    prefIntent: (prefs.pref_intent as Intent | null) ?? null,
  };
  return c.json(body);
});

// ---------------------------------------------------------------------------
// PUT /api/profile/preferences — préférences + choix du mode par défaut
// ---------------------------------------------------------------------------
profileRoutes.put('/profile/preferences', async (c) => {
  const user = await requireUser(c);
  const payload = (await c.req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!payload) throw errors.badRequest();

  const prefs = validatePreferences(payload);
  const now = Math.floor(Date.now() / 1000);
  await c.env.DB.prepare(
    `INSERT INTO user_preferences
       (user_id, mode_default, pref_gender, min_age, max_age, distance_km, pref_intent, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT (user_id) DO UPDATE SET
       mode_default = excluded.mode_default,
       pref_gender = excluded.pref_gender,
       min_age = excluded.min_age,
       max_age = excluded.max_age,
       distance_km = excluded.distance_km,
       pref_intent = excluded.pref_intent,
       updated_at = excluded.updated_at`,
  )
    .bind(
      user.id,
      prefs.modeDefault,
      prefs.prefGender,
      prefs.minAge,
      prefs.maxAge,
      prefs.distanceKm,
      prefs.prefIntent,
      now,
    )
    .run();

  await bumpMetric(c.env.DB, 'preferences_saved');
  return c.json({ saved: true });
});

// ---------------------------------------------------------------------------
// POST /api/profile/photos — upload (multipart) : client → Worker → Cloudinary
// ---------------------------------------------------------------------------
profileRoutes.post('/profile/photos', async (c) => {
  const user = await requireUser(c);
  requireStorageConfigured(c);

  const rl = await hitRateLimit(c.env.DB, RATE_RULES.photoUploadUser, user.id);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.photoUploadUser.scope);

  const existing = await listActivePhotos(c, user.id);
  if (existing.length >= LIMITS.maxPhotos) {
    throw errors.badRequest(`Maximum ${LIMITS.maxPhotos} photos.`);
  }

  const form = await c.req.parseBody().catch(() => null);
  if (!form || typeof form.photo !== 'object' || form.photo === null || !('size' in (form.photo as object))) {
    throw errors.badRequest('Fichier photo manquant (champ « photo »).');
  }
  const file = form.photo as File;
  if (file.size <= 0 || file.size > PROFILE_LIMITS.photoMaxBytes) {
    throw errors.badRequest(`Photo trop lourde (max ${Math.round(PROFILE_LIMITS.photoMaxBytes / 1024 / 1024)} Mo).`);
  }
  const mime = file.type || 'application/octet-stream';
  if (!['image/webp', 'image/jpeg', 'image/png'].includes(mime)) {
    throw errors.badRequest('Format non supporté (WebP, JPEG ou PNG).');
  }

  const width = Number(form.width);
  const height = Number(form.height);
  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width < 64 ||
    height < 64 ||
    width > PROFILE_LIMITS.photoMaxDim ||
    height > PROFILE_LIMITS.photoMaxDim
  ) {
    throw errors.badRequest('Dimensions invalides (64-4096 px).');
  }

  const photoId = crypto.randomUUID();
  const publicId = photoPublicId(c, user.id, photoId);
  let uploaded;
  try {
    uploaded = await uploadAuthenticatedImage(c.env, file, publicId);
  } catch (err) {
    console.error(JSON.stringify({ level: 'error', where: 'photo_upload', err: String(err) }));
    throw errors.internal('Échec de l\u2019enregistrement de la photo.');
  }

  const now = Math.floor(Date.now() / 1000);
  const format = mime === 'image/webp' ? 'webp' : mime === 'image/png' ? 'png' : 'jpg';
  await c.env.DB.prepare(
    `INSERT INTO photos (id, user_id, cloudinary_version, format, width, height, bytes, position, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', ?)`,
  )
    .bind(photoId, user.id, uploaded.version, format, width, height, file.size, existing.length, now)
    .run();

  await bumpMetric(c.env.DB, 'photo_uploaded');

  const row: PhotoRow = {
    id: photoId,
    user_id: user.id,
    cloudinary_version: uploaded.version,
    format,
    width,
    height,
    bytes: file.size,
    position: existing.length,
    status: 'active',
    created_at: now,
  };
  const [dto] = await photosAsDto(c, [row], true);
  return c.json({ photo: dto }, 201);
});

// ---------------------------------------------------------------------------
// POST /api/profile/photos/reorder — réordonne ; la position 0 = principale
// ---------------------------------------------------------------------------
profileRoutes.post('/profile/photos/reorder', async (c) => {
  const user = await requireUser(c);
  const payload = (await c.req.json().catch(() => null)) as { order?: unknown } | null;
  if (!payload || !Array.isArray(payload.order)) throw errors.badRequest('Ordre invalide.');

  const photos = await listActivePhotos(c, user.id);
  const currentIds = photos.map((p) => p.id);
  const order = payload.order.filter((v): v is string => typeof v === 'string');
  if (order.length !== currentIds.length || new Set(order).size !== order.length) {
    throw errors.badRequest('L\u2019ordre doit contenir exactement toutes les photos, une seule fois.');
  }
  const known = new Set(currentIds);
  if (order.some((id) => !known.has(id))) throw errors.badRequest('Photo inconnue dans l\u2019ordre.');

  const now = Math.floor(Date.now() / 1000);
  await c.env.DB.batch(
    order.map((id, index) =>
      c.env.DB.prepare(`UPDATE photos SET position = ? WHERE id = ? AND user_id = ?`).bind(index, id, user.id),
    ),
  );
  return c.json({ saved: true });
});

// ---------------------------------------------------------------------------
// DELETE /api/profile/photos/:photoId — supprime la ligne + détruit l'asset
// ---------------------------------------------------------------------------
profileRoutes.delete('/profile/photos/:photoId', async (c) => {
  const user = await requireUser(c);
  const photoId = c.req.param('photoId');

  const row = await c.env.DB.prepare(
    `SELECT id, user_id, cloudinary_version, format, width, height, bytes, position, status, created_at
     FROM photos WHERE id = ? AND user_id = ? AND deleted_at IS NULL LIMIT 1`,
  )
    .bind(photoId, user.id)
    .first<PhotoRow>();
  if (!row) throw errors.notFound('Photo introuvable.');

  // 1) Marque supprimée puis renumérote (transactionnel côté D1).
  const now = Math.floor(Date.now() / 1000);
  const remaining = (await listActivePhotos(c, user.id)).filter((p) => p.id !== photoId);
  await c.env.DB.batch([
    c.env.DB.prepare(`UPDATE photos SET deleted_at = ?, status = 'rejected' WHERE id = ? AND user_id = ?`)
      .bind(now, photoId, user.id),
    ...remaining.map((p, index) =>
      c.env.DB.prepare(`UPDATE photos SET position = ? WHERE id = ?`).bind(index, p.id),
    ),
  ]);

  // 2) Destruction Cloudinary (best-effort — la ligne est déjà hors service).
  const result = await destroyAuthenticatedAsset(c.env, publicIdFor(c, row)).catch(() => 'error' as const);
  if (result === 'error') {
    console.error(JSON.stringify({ level: 'warn', where: 'photo_destroy', photoId }));
  }

  await bumpMetric(c.env.DB, 'photo_deleted');
  return c.json({ deleted: true });
});

// ---------------------------------------------------------------------------
// GET /api/photos/:photoId/url?variant=sharp|blur — LA porte d'autorisation
// ---------------------------------------------------------------------------
profileRoutes.get('/photos/:photoId/url', async (c) => {
  const session = c.get('session');
  if (!session) throw errors.unauthorized();

  const variantParam = c.req.query('variant') ?? 'sharp';
  if (variantParam !== 'sharp' && variantParam !== 'blur') throw errors.badRequest('Variant invalide.');
  const variant = variantParam;

  const row = await c.env.DB.prepare(
    `SELECT p.id, p.user_id, p.cloudinary_version, p.format, p.width, p.height, p.bytes,
            p.position, p.status, p.created_at, u.status AS owner_status, up.mode_default AS owner_mode
     FROM photos p
     JOIN users u ON u.id = p.user_id
     LEFT JOIN user_preferences up ON up.user_id = p.user_id
     WHERE p.id = ? AND p.deleted_at IS NULL LIMIT 1`,
  )
    .bind(c.req.param('photoId'))
    .first<PhotoRow & { owner_status: string; owner_mode: string | null }>();
  if (!row || row.status !== 'active') throw errors.notFound('Photo introuvable.');

  const isOwner = row.user_id === session.userId;

  if (!isOwner) {
    // Le propriétaire doit être actif pour servir ses photos à autrui.
    if (row.owner_status !== 'active') throw errors.forbidden();
    // Mode Invisible : la version nette est réservée à la révélation consentie
    // (mécanisme livré à l'Étape 6 — jusqu'ici, refus catégorique).
    if (row.owner_mode === 'invisible' && variant === 'sharp') {
      throw errors.forbidden('Photo protégée — révélation non accordée.');
    }
  }

  const url = variant === 'blur' ? await blurUrl(c, row) : await fullUrl(c, row);
  const body: PhotoUrlResponse = {
    photoId: row.id,
    variant,
    url,
    width: row.width,
    height: row.height,
  };
  await bumpMetric(c.env.DB, variant === 'blur' ? 'photo_url_blur' : 'photo_url_sharp');
  return c.json(body);
});

// --- Re-export utilitaire (typage MeResponse utilisé par auth.ts via shared) ---
export type { MeResponse };

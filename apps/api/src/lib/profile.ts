/**
 * Validation du profil (Étape 3 + évolutions fondateur) — un seul endroit,
 * miroir de PROFILE_LIMITS (@wairyu/shared). Toute écriture profil passe par
 * ces garde-fous.
 *
 * Règle 18+ : date de naissance complète (YYYY-MM-DD) → âge EXACT ≥ 18 ans
 * révolus à aujourd'hui (UTC). L'année seule reste acceptée en écriture
 * (compat anciens clients) → birth_date complétée au 1er janvier.
 */
import { ORIENTATIONS, PROFILE_LIMITS, PROMPT_KEYS, INTENTS, MODE_DEFAULTS } from '@wairyu/shared';
import { errors } from './errors';

type ProfileEnv = { CLOUDINARY_CLOUD_NAME: string; CLOUDINARY_API_KEY: string; CLOUDINARY_API_SECRET: string };

export function isConfigured(env: ProfileEnv): boolean {
  return Boolean(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET);
}

function bad(message: string): never {
  throw errors.badRequest(message);
}

function asString(v: unknown): string | null {
  return typeof v === 'string' ? v.trim() : null;
}

// ---------------------------------------------------------------------------
// Champs simples
// ---------------------------------------------------------------------------

export function validateDisplayName(v: unknown): string {
  const s = asString(v);
  if (!s || s.length < PROFILE_LIMITS.displayNameMin || s.length > PROFILE_LIMITS.displayNameMax) {
    bad(`Le prénom doit faire entre ${PROFILE_LIMITS.displayNameMin} et ${PROFILE_LIMITS.displayNameMax} caractères.`);
  }
  return s!;
}

export function validateBirthYear(v: unknown): number {
  const year = typeof v === 'number' ? Math.floor(v) : NaN;
  const min = 1930;
  const max = new Date().getUTCFullYear() - 18;
  if (!Number.isInteger(year) || year < min || year > max) {
    bad(`Année de naissance invalide — tu dois avoir 18 ans révolus (${min}-${max}).`);
  }
  return year;
}

/**
 * Date de naissance ISO « YYYY-MM-DD » — calendrier réel (pas de 31/02, les
 * années bissextiles sont vérifiées) et âge EXACT ≥ 18 ans révolus (UTC).
 * Retourne la chaîne normalisée ; l'année dérivée est extraite par le route.
 */
export function validateBirthDate(v: unknown): string {
  const s = asString(v);
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s ?? '');
  if (!m) bad('Date de naissance invalide (format attendu AAAA-MM-JJ).');
  const year = Number(m![1]);
  const month = Number(m![2]);
  const day = Number(m![3]);
  const minYear = 1930;
  const maxYear = new Date().getUTCFullYear() - 18;
  if (year < minYear || year > maxYear) {
    bad(`Année de naissance invalide (${minYear}-${maxYear}).`);
  }
  if (month < 1 || month > 12) bad('Mois de naissance invalide.');
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  if (day < 1 || day > daysInMonth) bad('Jour de naissance invalide pour ce mois.');
  // Âge exact : 18 ans révolus = anniversaire passé il y a ≥ 18 ans (UTC).
  const birth = Date.UTC(year, month - 1, day);
  const now = new Date();
  const cutoff = Date.UTC(now.getUTCFullYear() - 18, now.getUTCMonth(), now.getUTCDate());
  if (birth > cutoff) bad('Tu dois avoir 18 ans révolus pour créer un compte wairyu.');
  return s!;
}

export function validateEnum<T extends string>(v: unknown, allowed: readonly T[], label: string): T {
  if (typeof v !== 'string' || !allowed.includes(v as T)) {
    bad(`${label} invalide.`);
  }
  return v as T;
}

export function validateCity(v: unknown): string {
  const s = asString(v);
  if (!s || s.length < PROFILE_LIMITS.cityMin || s.length > PROFILE_LIMITS.cityMax) {
    bad(`La ville doit faire entre ${PROFILE_LIMITS.cityMin} et ${PROFILE_LIMITS.cityMax} caractères.`);
  }
  return s!;
}

/**
 * Région grossière : soit « geo:lat,lon » arrondie au dixième (≈11 km — JAMAIS
 * de GPS précis), soit un libellé libre court, soit null (champ optionnel).
 */
export function validateGeoRegion(v: unknown): string | null {
  if (v === null || v === undefined || v === '') return null;
  const s = asString(v)!;
  if (s.length > PROFILE_LIMITS.geoRegionMax) bad('Région trop longue.');
  if (s.startsWith('geo:')) {
    const m = /^geo:(-?\d{1,2}\.\d),(-?\d{1,3}\.\d)$/.exec(s);
    if (!m) bad('Coordonnées approximatives invalides (format geo:lat,lon arrondi au dixième).');
  }
  return s;
}

export function validateBio(v: unknown): string | null {
  if (v === null || v === undefined || v === '') return null;
  const s = asString(v)!;
  if (s.length > PROFILE_LIMITS.bioMax) bad(`La bio est limitée à ${PROFILE_LIMITS.bioMax} caractères.`);
  return s;
}

/** Pays — libellé libre court (géocodage inverse ou saisie manuelle), optionnel. */
export function validateCountry(v: unknown): string | null {
  if (v === null || v === undefined || v === '') return null;
  const s = asString(v)!;
  if (s.length > PROFILE_LIMITS.countryMax) {
    bad(`Le pays est limité à ${PROFILE_LIMITS.countryMax} caractères.`);
  }
  return s;
}

/** Quartier — libellé libre court (optionnel ; JAMAIS de rue ni de GPS précis). */
export function validateNeighborhood(v: unknown): string | null {
  if (v === null || v === undefined || v === '') return null;
  const s = asString(v)!;
  if (s.length > PROFILE_LIMITS.neighborhoodMax) {
    bad(`Le quartier est limité à ${PROFILE_LIMITS.neighborhoodMax} caractères.`);
  }
  return s;
}

// ---------------------------------------------------------------------------
// Prompts (3 slots, bibliothèque partagée)
// ---------------------------------------------------------------------------

export interface ValidatedPrompt {
  position: number;
  promptKey: string;
  answer: string;
}

export function validatePrompts(v: unknown): ValidatedPrompt[] {
  if (!Array.isArray(v) || v.length > 3) bad('Entre 0 et 3 prompts sont autorisés.');
  const seenKeys = new Set<string>();
  const out: ValidatedPrompt[] = [];
  for (let i = 0; i < v.length; i++) {
    const raw = v[i] as { key?: unknown; answer?: unknown } | null;
    const key = asString(raw?.key);
    const answer = asString(raw?.answer);
    if (!key || !PROMPT_KEYS.includes(key)) bad('Prompt inconnu (bibliothèque partagée uniquement).');
    if (seenKeys.has(key!)) bad('Chaque prompt doit être différent.');
    if (!answer || answer.length === 0 || answer.length > PROFILE_LIMITS.promptAnswerMax) {
      bad(`Chaque réponse de prompt doit faire entre 1 et ${PROFILE_LIMITS.promptAnswerMax} caractères.`);
    }
    seenKeys.add(key!);
    out.push({ position: i + 1, promptKey: key!, answer: answer! });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Préférences de découverte
// ---------------------------------------------------------------------------

export interface ValidatedPreferences {
  modeDefault: (typeof MODE_DEFAULTS)[number];
  prefGender: 'women' | 'men' | 'everyone';
  minAge: number;
  maxAge: number;
  distanceKm: number;
  prefIntent: (typeof INTENTS)[number] | null;
}

export function validatePreferences(v: unknown): ValidatedPreferences {
  if (typeof v !== 'object' || v === null) bad('Préférences invalides.');
  const p = v as Record<string, unknown>;
  const minAge = typeof p.minAge === 'number' ? Math.floor(p.minAge) : NaN;
  const maxAge = typeof p.maxAge === 'number' ? Math.floor(p.maxAge) : NaN;
  const distanceKm = typeof p.distanceKm === 'number' ? Math.floor(p.distanceKm) : NaN;
  if (!Number.isInteger(minAge) || minAge < 18 || minAge > 99) bad('Âge minimum invalide (18-99).');
  if (!Number.isInteger(maxAge) || maxAge < 18 || maxAge > 99) bad('Âge maximum invalide (18-99).');
  if (minAge > maxAge) bad('L\u2019âge minimum doit être inférieur ou égal à l\u2019âge maximum.');
  if (!Number.isInteger(distanceKm) || distanceKm < 1 || distanceKm > 500) {
    bad('Distance invalide (1-500 km).');
  }
  const allowedOrientations: readonly string[] = ORIENTATIONS; // garde le type vivant
  void allowedOrientations;
  return {
    modeDefault: validateEnum(p.modeDefault, MODE_DEFAULTS, 'Mode'),
    prefGender: validateEnum(p.prefGender, ['women', 'men', 'everyone'] as const, 'Genres recherchés'),
    minAge,
    maxAge,
    distanceKm,
    prefIntent:
      p.prefIntent === null || p.prefIntent === undefined || p.prefIntent === ''
        ? null
        : validateEnum(p.prefIntent, INTENTS, 'Intention recherchée'),
  };
}

// ---------------------------------------------------------------------------
// Complétion du profil
// ---------------------------------------------------------------------------

export interface ProfileBasics {
  display_name: string | null;
  birth_year: number | null;
  birth_date: string | null;
  gender: string | null;
  orientation: string | null;
  intent: string | null;
  city: string | null;
  bio: string | null;
  profile_consent_at: number | null;
}

export interface ProfileCounters {
  photoCount: number;
  promptCount: number;
  hasPreferences: boolean;
}

/** Profil complet = tous les champs requis + ≥1 prompt + ≥1 photo + préférences. */
export function isProfileComplete(b: ProfileBasics, c: ProfileCounters): boolean {
  return Boolean(
    b.display_name &&
      (b.birth_date || b.birth_year) &&
      b.gender &&
      b.orientation &&
      b.intent &&
      b.city &&
      b.bio &&
      b.profile_consent_at &&
      c.photoCount >= 1 &&
      c.promptCount >= 1 &&
      c.hasPreferences,
  );
}

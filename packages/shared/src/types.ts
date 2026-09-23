/** Types partagés API ↔ Front. */

export type ApiErrorCode =
  | 'bad_request'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'rate_limited'
  | 'internal'
  // --- Étape 2 : authentification ---
  | 'email_invalid'
  | 'otp_invalid'
  | 'otp_expired'
  | 'otp_locked'
  | 'otp_cooldown'
  | 'turnstile_failed'
  | 'conflict'
  | 'not_configured';

/** Enveloppe d'erreur normalisée — toute erreur de l'API respecte ce contrat. */
export interface ApiErrorBody {
  error: {
    code: ApiErrorCode;
    message: string;
    /** Identifiant de requête (corrélation logs). */
    req_id: string;
  };
}

export interface HealthResponse {
  ok: true;
  service: string;
  version: string;
  env: 'production' | 'staging';
  time: string;
}

export interface UsageResponse {
  day: string;
  isolate: {
    startedAt: string;
    uptimeSeconds: number;
    counters: Record<string, number>;
  };
  daily: {
    metric: string;
    value: number;
  }[];
}

export type Gender = 'woman' | 'man' | 'non_binary';

/** Intentions — étendues à la demande fondateur (interraciale, mariage, vie de couple). */
export type Intent = 'serious' | 'open' | 'friends_first' | 'couple_life' | 'marriage' | 'interracial';

export type DiscoveryMode = 'classic' | 'invisible';

// ---------- Étape 3 : profils & photos protégées ----------

export type Orientation = 'straight' | 'gay' | 'bi' | 'other';

export type PrefGender = 'women' | 'men' | 'everyone';

/** Un prompt rempli (clé de la bibliothèque + réponse personnelle). */
export interface PromptInput {
  key: string;
  answer: string;
}

/** Photo telle que vue par son PROPRIÉTAIRE (URLs signées nettes autorisées). */
export interface PhotoDto {
  id: string;
  position: number; // 0 = photo principale
  width: number;
  height: number;
  bytes: number;
  format: string;
  createdAt: number;
  /** URL signée pleine résolution (autorisée uniquement si la règle le permet). */
  urlFull: string | null;
  /** URL signée vignette 200 px. */
  urlThumb: string | null;
}

/** Profil complet de l'utilisateur authentifié (GET /api/profile). */
export interface ProfileResponse {
  displayName: string | null;
  birthYear: number | null;
  /** Date de naissance ISO « YYYY-MM-DD » (jour/mois/année — âge exact). */
  birthDate: string | null;
  gender: Gender | null;
  orientation: Orientation | null;
  intent: Intent | null;
  city: string | null;
  /** Pays détecté (géocodage inverse) ou saisi — libellé libre. */
  country: string | null;
  /** Quartier (géocodage inverse) ou saisi — optionnel, libellé libre. */
  neighborhood: string | null;
  /** Région grossière : « geo:lat,lon » (≈11 km) ou libellé libre. Jamais de GPS précis. */
  geoRegion: string | null;
  bio: string | null;
  /** Horodatage du consentement explicite profil/découverte (null = pas donné). */
  profileConsentAt: number | null;
  prompts: PromptInput[];
  photos: PhotoDto[];
  preferences: PreferencesDto | null;
  /** Tous les champs requis sont-ils remplis (basics + ≥1 prompt + ≥1 photo + préférences) ? */
  profileComplete: boolean;
}

/** Préférences de découverte (GET/PUT /api/profile/preferences). */
export interface PreferencesDto {
  modeDefault: DiscoveryMode;
  prefGender: PrefGender;
  minAge: number;
  maxAge: number;
  distanceKm: number;
  prefIntent: Intent | null;
}

/** Corps de PUT /api/profile — tous les champs optionnels (mise à jour partielle). */
export interface ProfileUpdate {
  displayName?: string;
  birthYear?: number;
  /** Date de naissance ISO « YYYY-MM-DD » — met aussi à jour birthYear (année dérivée). */
  birthDate?: string;
  gender?: Gender;
  orientation?: Orientation;
  intent?: Intent;
  city?: string;
  country?: string | null;
  neighborhood?: string | null;
  geoRegion?: string | null;
  bio?: string;
  /** Consentement explicite dédié — requis (true) au moins une fois. */
  consentAccepted?: boolean;
  /** Remplace la liste des prompts (max 3). */
  prompts?: PromptInput[];
}

/** Corps de PUT /api/profile/preferences. */
export interface PreferencesUpdate {
  modeDefault: DiscoveryMode;
  prefGender: PrefGender;
  minAge: number;
  maxAge: number;
  distanceKm: number;
  prefIntent?: Intent | null;
}

/** Réponse de GET /api/photos/:photoId/url?variant=sharp|blur. */
export interface PhotoUrlResponse {
  photoId: string;
  variant: 'sharp' | 'blur';
  url: string;
  width: number;
  height: number;
}

// ---------- Étape 2 : authentification ----------

/** Configuration publique d'authentification (GET /api/auth/config). */
export interface AuthConfigResponse {
  /** Clé de site Turnstile (public — instanciée par le front). */
  turnstileSiteKey: string | null;
  /** Google OAuth configuré côté serveur ? */
  googleEnabled: boolean;
  /** Facebook Login configuré côté serveur ? */
  facebookEnabled: boolean;
  /** Mode d'envoi des emails OTP : 'brevo' ou 'dev' (staging sans clé Brevo). */
  emailProvider: 'brevo' | 'dev';
}

/** Profil utilisateur renvoyé par /api/me. */
export interface MeResponse {
  userId: string;
  email: string;
  displayName: string | null;
  emailVerified: boolean;
  status: 'pending' | 'active' | 'banned' | 'deleted';
  plan: 'free' | 'plus' | 'gold';
  createdAt: number;
  /** true si la session a été prolongée lors de cette requête (TTL glissant). */
  sessionRenewed: boolean;
  /** Profil complet (Étape 3) : basics + ≥1 prompt + ≥1 photo + préférences. */
  profileComplete: boolean;
}

/** Réponse de POST /api/auth/otp/request (le code n'est exposé qu'en staging-dev). */
export interface OtpRequestResponse {
  sent: true;
  /** Canaux utilisés (traçabilité front). */
  channel: 'email' | 'dev';
  /** Code OTP en clair — UNIQUEMENT en staging sans clé Brevo (tests mobiles). */
  devCode?: string;
}

/** Réponse de POST /api/auth/otp/verify. */
export interface OtpVerifyResponse {
  userId: string;
  email: string;
  /** Compte créé lors de cette vérification (première inscription). */
  created: boolean;
}

/** Réponse de POST /api/auth/facebook/link (rattachement après complétion email). */
export interface FacebookLinkResponse {
  linked: boolean;
}

/** Réponse de GET /api/geo/reverse — géocodage inverse (Nominatim via Worker). */
export interface GeoReverseResponse {
  country: string | null;
  city: string | null;
  /** Quartier / suburb — peut être null (zones peu denses). */
  neighborhood: string | null;
  /** Libellé complet OSM (contexte, debug front). */
  label: string | null;
}

/** Export RGPD — GET /api/account/export (droit d'accès, art. 15/20). */
export interface AccountExport {
  exportedAt: string;
  format: 'wairyu-export-v1';
  user: Record<string, unknown>;
  sessions: { active: number; revoked_total: number };
  /** Étape 3 : prompts, métadonnées photos, préférences de découverte. */
  profile?: Record<string, unknown>;
  audit: Record<string, unknown>;
}

/** Profil vu dans le feed — la photo n'est JAMAIS une URL brute : toujours signée, court-lived. */
export interface FeedProfile {
  userId: string;
  displayName: string;
  age: number;
  city: string;
  /** Quartier — affichage optionnel côté front (produit : jamais de rue). */
  neighborhood: string | null;
  country: string | null;
  intent: Intent;
  bio: string;
  prompts: { question: string; answer: string }[];
  /** URL signée (floue si mode Invisible sans révélation). */
  photoUrl: string | null;
  /** Pourquoi ce match ? — 2 forces + 1 vigilance (Étape 4). */
  matchReasons: {
    forces: string[];
    vigilance: string;
    conversationStarters: string[];
  } | null;
  score: number | null;
}

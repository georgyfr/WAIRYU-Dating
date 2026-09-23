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

export type Intent = 'serious' | 'open' | 'friends_first';

export type DiscoveryMode = 'classic' | 'invisible';

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

/** Export RGPD — GET /api/account/export (droit d'accès, art. 15/20). */
export interface AccountExport {
  exportedAt: string;
  format: 'wairyu-export-v1';
  user: Record<string, unknown>;
  sessions: { active: number; revoked_total: number };
  audit: Record<string, unknown>;
}

/** Profil vu dans le feed — la photo n'est JAMAIS une URL brute : toujours signée, court-lived. */
export interface FeedProfile {
  userId: string;
  displayName: string;
  age: number;
  city: string;
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

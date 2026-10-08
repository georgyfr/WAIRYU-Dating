/**
 * wairyu — contrats API partagés (front ↔ Worker).
 * Les erreurs suivent le corps normalisé { error: { code, message, req_id } }.
 */

// ---------------------------------------------------------------------------
// Erreurs normalisées
// ---------------------------------------------------------------------------

export type ApiErrorCode =
  | 'bad_request'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'conflict'
  | 'rate_limited'
  | 'internal'
  // Étape 2 — authentification
  | 'not_configured'
  | 'otp_invalid'
  | 'otp_expired'
  | 'otp_locked'
  | 'reset_expired';

export interface ApiErrorBody {
  error: {
    code: ApiErrorCode;
    message: string;
    req_id: string;
  };
}

// ---------------------------------------------------------------------------
// Santé & usage
// ---------------------------------------------------------------------------

export interface HealthResponse {
  ok: boolean;
  service: string;
  version: string;
  env: 'production' | 'staging';
  time: string;
}

export interface VersionResponse {
  service: string;
  version: string;
}

export interface UsageResponse {
  uptimeSeconds: number;
  requestsTotal: number;
  buckets: Record<string, number>;
  sessionsActive: number;
  startedAt: string;
}

// ---------------------------------------------------------------------------
// Utilisateurs / sessions (Étape 2 — auth)
// ---------------------------------------------------------------------------

export type UserStatus = 'pending' | 'active' | 'banned' | 'deleted';

export interface SessionUser {
  id: string;
  email: string;
  displayName: string | null;
  status: UserStatus;
}

// ---------------------------------------------------------------------------
// Notifications push (device-based jusqu'à l'Étape 2, puis liées à user_id)
// ---------------------------------------------------------------------------

/** GET /api/push/key — clé publique VAPID (enabled:false ⇒ dégradation gracieuse). */
export interface PushConfigResponse {
  enabled: boolean;
  publicKey: string | null;
}

/** POST /api/push/open — enregistrement d'une ouverture d'appareil. */
export interface PushOpenResponse {
  firstOpen: boolean;
  openCount: number;
  welcomePending: boolean;
  subscribed: boolean;
}

/** POST /api/push/subscribe — abonnement push d'un appareil. */
export interface PushSubscribeResponse {
  ok: boolean;
  welcomeSent?: boolean;
  confirmSent?: boolean;
}

/** POST /api/push/test — push de test réel (pipeline VAPID complet). */
export interface PushTestResponse {
  ok: boolean;
  sent: number;
  reason?: 'no_subscription' | 'send_failed' | 'rate_limited' | 'gone';
  error?: string | null;
}

/** Ligne du journal de notifications (centre in-app). */
export interface PushEventRow {
  id: string;
  kind: string;
  title: string;
  body: string;
  channel: 'push' | 'inapp' | 'local';
  delivered: boolean;
  error: string | null;
  createdAt: string;
}

/** GET /api/push/events — journal in-app (fonctionne sur TOUS les navigateurs). */
export interface PushEventsResponse {
  events: PushEventRow[];
}

// ---------------------------------------------------------------------------
// Authentification (Étape 2 — OTP email, OAuth, pseudo+mot de passe)
// ---------------------------------------------------------------------------

/** GET /api/auth/config — configuration publique d'authentification. */
export interface AuthConfigResponse {
  /** Clé de site Turnstile (null ⇒ widget non rendu). */
  turnstileSiteKey: string | null;
  googleEnabled: boolean;
  /** client_id public requis par le bouton Google Identity Services. */
  googleClientId: string | null;
  facebookEnabled: boolean;
  /** Canal d'envoi des codes : 'brevo' (prod configuré) ou 'dev' (staging sans clé). */
  emailProvider: 'brevo' | 'dev';
}

/** POST /api/auth/otp/request. */
export interface OtpRequestResponse {
  sent: true;
  /**
   * 'email' : code envoyé par email (filet systématique).
   * 'email+push' : le code a AUSSI été relayé en notification sur les appareils
   *   déjà liés à ce compte (plus besoin de fouiller la boîte mail).
   * 'dev' : staging sans clé Brevo — le code revient en clair (devCode).
   */
  channel: 'email' | 'email+push' | 'dev';
  /** Code en clair — UNIQUEMENT staging (mode dev ou bypass ADMIN_TOKEN). */
  devCode?: string;
}

/** POST /api/push/link-device — liaison appareil ↔ compte + félicitations. */
export interface LinkDeviceResponse {
  linked: true;
  /**
   * 'push' : félicitations envoyées en notification OS + journal.
   * 'inapp' : félicitations consignées au journal in-app seulement
   *   (appareil sans abonnement push — canal universel 2016/2017).
   * null : rien à fêter (connexion d'un compte existant, ou déjà fêté).
   */
  congrats: 'push' | 'inapp' | null;
  /** Canal de création du compte fêté (email/google/facebook/password). */
  congratsVia: string | null;
}

/** POST /api/auth/otp/verify. */
export interface OtpVerifyResponse {
  userId: string;
  email: string;
  /** true si le compte vient d'être créé (inscription). */
  created: boolean;
}

/** GET /api/me — profil de l'utilisateur authentifié (schéma v2, Étape 3 l'étendra). */
export interface MeResponse {
  userId: string;
  email: string;
  displayName: string | null;
  /** @pseudo de connexion (comptes classiques) — null pour les comptes email purs. */
  username: string | null;
  emailVerified: boolean;
  status: UserStatus;
  plan: 'free' | 'plus' | 'gold';
  createdAt: number;
  sessionRenewed: boolean;
}

/** POST /api/auth/password/register. */
export interface PasswordRegisterResponse {
  userId: string;
  username: string;
  /** Code de récupération « XXXX-XXXX-XXXX » — affiché UNE seule fois. */
  recoveryCode: string;
  created: true;
}

/** POST /api/auth/password/login. */
export interface PasswordLoginResponse {
  userId: string;
  username: string;
}

/** POST /api/auth/password/recovery. */
export interface PasswordRecoveryResponse {
  ok: true;
  /** true si le mot de passe a été remplacé (new_password fourni). */
  reset: boolean;
  username: string;
}

/** POST /api/auth/password/forgot. */
export interface PasswordForgotResponse {
  sent: true;
  channel: 'email' | 'dev';
  /** Lien de reset en clair — UNIQUEMENT staging (mode dev sans Brevo). */
  devResetUrl?: string;
}

/** GET /api/auth/password/status (connecté). */
export interface PasswordStatusResponse {
  hasPassword: boolean;
  hasRecoveryEmail: boolean;
  recoveryEmailMasked: string | null;
  username: string | null;
  hasRecoveryCode: boolean;
}

/** POST /api/auth/facebook/link. */
export interface FacebookLinkResponse {
  linked: boolean;
}

/**
 * POST /api/auth/facebook/complete — inscription/connexion Facebook SANS email
 * (alternative à l'OTP quand la boîte mail est inaccessible : l'identité
 * Facebook du cookie signé SUFFIT). Le compte est créé avec un email
 * placeholder (jamais affiché, même domaine masqué que les comptes pseudo) ;
 * un email de récupération peut être ajouté plus tard dans Réglages.
 */
export interface FacebookCompleteResponse {
  ok: true;
  /** true = compte créé (inscription), false = connexion au compte déjà relié à ce Facebook. */
  created: boolean;
}

/**
 * POST /api/auth/oauth/complete — complétion d'inscription sociale différée.
 * Le callback Google/Facebook a découvert un email SANS compte existant et
 * SANS date de naissance déclarée : l'identité attend dans un cookie signé,
 * l'utilisateur saisit sa date (18+ validé côté serveur) puis ce endpoint
 * crée le compte, lie l'identité et ouvre la session.
 */
export interface OAuthCompleteResponse {
  ok: true;
  provider: 'google' | 'facebook';
  /** true si le compte vient d'être créé (inscription), false = connexion/fusion. */
  created: boolean;
}

/**
 * GET /api/account/export — export RGPD (droit d'accès art. 15 + portabilité
 * art. 20). Schéma v2 : couvre TOUTES les tables existantes à ce stade ; les
 * étapes 3+ étendront la structure (les champs s'ajoutent, jamais cassés).
 */
export interface AccountExport {
  exportedAt: string;
  format: 'wairyu-export-v1';
  user: Record<string, unknown>;
  sessions: { active: number; revoked_total: number };
  sessionsRecent: Record<string, unknown>[];
  oauthIdentities: Record<string, unknown>[];
  notifications: {
    devices: Record<string, unknown>[];
    pushSubscriptions: Record<string, unknown>[];
    events: Record<string, unknown>[];
    note: string;
  };
  credentials: {
    hasPassword: boolean;
    username: string | null;
    note: string;
  };
  consents: Record<string, unknown>;
  audit: { note: string };
}

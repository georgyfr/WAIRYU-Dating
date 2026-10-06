/** Bindings Cloudflare de l'API wairyu. */
export interface Env {
  /** Base de données D1 (prod ou staging selon l'environnement). */
  DB: D1Database;
  /** KV de configuration + rate limits push (fenêtres courtes). */
  CONFIG: KVNamespace;
  /** Durable Object : une instance par conversation (Étape 6). */
  CHAT_ROOM: DurableObjectNamespace;
  /** Assets statiques du front (React+Vite). */
  ASSETS: Fetcher;

  // ---- Variables ----
  ENVIRONMENT: 'production' | 'staging';
  /** Taux d'échantillonnage des écritures métriques (0-1, défaut 1). */
  USAGE_SAMPLE_RATE: string;

  // ---- Secrets ----
  /** Clé HMAC des cookies de session (64 hex). */
  SESSION_HMAC_KEY: string;
  /** Jeton admin protégeant /admin/* (Étape 1 : fail-closed si absent). */
  ADMIN_TOKEN?: string;
  /**
   * Web Push VAPID — absents ⇒ push désactivé proprement (enabled:false,
   * aucune erreur). Clé publique = point brut 65 octets base64url ;
   * clé privée = scalaire 32 octets base64url.
   */
  VAPID_PUBLIC_KEY?: string;
  VAPID_PRIVATE_KEY?: string;
  /** Sujet VAPID (mailto: ou URL) — défaut mailto:admin@wairyu.app. */
  VAPID_SUBJECT?: string;
  /**
   * Empreintes SHA-256 des certificats de signature APK (séparées par
   * virgules) servant /.well-known/assetlinks.json pour la TWA Android.
   * Vide ⇒ statements vide (la TWA reste fonctionnelle avec barre d'URL).
   */
  ANDROID_CERT_FINGERPRINTS?: string;

  // ---- Étape 2 : authentification (tous optionnels — dégradation gracieuse) ----
  /** Clé de site Turnstile (PUBLIC — widget front). Absent ⇒ widget non rendu. */
  TURNSTILE_SITE_KEY?: string;
  /** Secret Turnstile (siteverify). En staging la vérification est SAUTÉE. */
  TURNSTILE_SECRET?: string;
  /** Clé API Brevo (emails OTP + reset). Absente ⇒ staging: mode dev / prod: 503. */
  BREVO_API_KEY?: string;
  /** Adresse expéditeur Brevo vérifiée (ex. noreply@…). */
  EMAIL_FROM?: string;
  /** Google OAuth — absents ⇒ connexion Google désactivée (signalé au front). */
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  /** Facebook Login — absents ⇒ connexion Facebook désactivée (signalé au front). */
  FACEBOOK_APP_ID?: string;
  FACEBOOK_APP_SECRET?: string;
  /** Surcharge des scopes Meta (défaut public_profile — « email » refusé par Meta). */
  FACEBOOK_SCOPES?: string;
}

/** Contexte de requête enrichi (Hono Variables). */
export interface AppVars {
  reqId: string;
  /** Session authentifiée (Étape 2 : remplie par sessionMiddleware). */
  session: {
    sessionId: string;
    userId: string;
  } | null;
  /** true si la session a été prolongée lors de cette requête (TTL glissant). */
  sessionRenewed: boolean;
}

export type AppEnv = Env & { Bindings: Env; Variables: AppVars };

/** Bindings Cloudflare de l'API wairyu. */
export interface Env {
  /** Base de données D1 (prod ou staging selon l'environnement). */
  DB: D1Database;
  /** KV de configuration — lecture seule en pratique. */
  CONFIG: KVNamespace;
  /** Durable Object : une instance par conversation (Étape 6). */
  CHAT_ROOM: DurableObjectNamespace;
  /** Assets statiques du front (React+Vite). */
  ASSETS: Fetcher;

  // ---- Variables ----
  ENVIRONMENT: 'production' | 'staging';
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_ROOT_FOLDER: string;
  /** Taux d'échantillonnage des écritures métriques (0-1, défaut 1). */
  USAGE_SAMPLE_RATE: string;
  /** Clé de site Turnstile (PUBLIC — embarquée dans le front). */
  TURNSTILE_SITE_KEY?: string;

  // ---- Secrets ----
  /** Clé HMAC des cookies de session (64 hex). */
  SESSION_HMAC_KEY: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  /** Secret Turnstile (vérification serveur). */
  TURNSTILE_SECRET?: string;
  /** Brevo — envoi des emails OTP (plan gratuit). */
  BREVO_API_KEY?: string;
  /** Adresse expéditrice vérifiée chez Brevo. */
  EMAIL_FROM?: string;
  /** Google OAuth (préparé — activation sans redéploiement dès que posé). */
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  /** Jeton admin protégeant /admin/* (Étape 2). */
  ADMIN_TOKEN?: string;
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

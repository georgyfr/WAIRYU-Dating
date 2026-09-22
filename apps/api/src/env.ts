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

  // ---- Secrets ----
  /** Clé HMAC des cookies de session (64 hex). */
  SESSION_HMAC_KEY: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
}

/** Contexte de requête enrichi (Hono Variables). */
export interface AppVars {
  reqId: string;
  /** Session authentifiée si présente (Étape 2 la remplira réellement). */
  session: {
    sessionId: string;
    userId: string;
  } | null;
}

export type AppEnv = Env & { Bindings: Env; Variables: AppVars };

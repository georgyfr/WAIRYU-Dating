/** Types partagés API ↔ Front. */

export type ApiErrorCode =
  | 'bad_request'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'rate_limited'
  | 'internal';

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

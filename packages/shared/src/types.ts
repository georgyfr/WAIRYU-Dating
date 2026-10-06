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
  | 'internal';

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

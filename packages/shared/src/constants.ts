/**
 * wairyu — constantes partagées entre l'API (Workers) et le front (PWA).
 * Chiffres clés issus de la spécification v0.1 et des limites free tier (Étape 0).
 */

export const APP = {
  name: 'wairyu',
  tagline: 'Rencontres sincères — photos consenties, messages réels.',
  apiVersion: '0.1.0',
} as const;

/** Révélation consentie : les 3 conditions DOIVENT être toutes réunies. */
export const REVEAL = {
  /** Nombre minimal de messages échangés dans la conversation. */
  minMessages: 15,
  /** Durée minimale de la conversation, en jours. */
  minDays: 7,
} as const;

/** Budget requêtes API par utilisateur et par jour (garde-fou free tier). */
export const LIMITS = {
  /** Budget quotidien de requêtes API par utilisateur actif. */
  apiCallsPerUserPerDay: 70,
  /** Nombre maximal de photos par profil. */
  maxPhotos: 6,
  /** Taille cible d'une photo compressée côté client (octets). */
  photoTargetBytes: 300 * 1024,
  /** Taille cible d'une voice note (octets, ~60 s opus). */
  voiceNoteTargetBytes: 512 * 1024,
  /** Durée de vie d'une session en jours (glissant). */
  sessionDays: 30,
  /** TTL d'un code OTP, en minutes (Étape 2). */
  otpTtlMinutes: 10,
} as const;

/** Identifiants de métriques quotidiennes (table D1 metrics_daily). */
export const METRICS = {
  apiRequests: 'api_requests',
  apiErrors: 'api_errors',
  sessionsActive: 'sessions_active',
} as const;

/** Niveaux de complétion du questionnaire. */
export const QUESTIONNAIRE = {
  n1Questions: 12,
  n2Questions: 18,
} as const;

/**
 * wairyu — constantes partagées entre l'API (Workers) et le front (PWA).
 * Chiffres clés issus de la spécification v0.1 et des limites free tier (Étape 0).
 */

export const APP = {
  name: 'wairyu',
  tagline: 'Rencontres sincères — photos consenties, messages réels.',
  apiVersion: '0.1.0',
} as const;

/** Les 4 modes de découverte du produit (verrou cadrage 2026-10-05). */
export const DISCOVERY_MODES = ['classic', 'invisible', 'interracial', 'events'] as const;
export type DiscoveryMode = (typeof DISCOVERY_MODES)[number];

/** Révélation consentie : les conditions DOIVENT être toutes réunies (héritage v1). */
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
  /** Durée de vie d'une session en jours (glissant). */
  sessionDays: 30,
  /** Durée de vie d'un code OTP en minutes (Étape 2). */
  otpTtlMinutes: 10,
} as const;

/** Identifiants de métriques quotidiennes (table D1 metrics_daily). */
export const METRICS = {
  apiRequests: 'api_requests',
  apiErrors: 'api_errors',
  sessionsActive: 'sessions_active',
} as const;

// ---------------------------------------------------------------------------
// Étape 5 — Découverte dual-mode (quotas hérités de la v1)
// ---------------------------------------------------------------------------

export const DISCOVERY = {
  likesPerDay: 50,
  invisibleRequestsPerDay: 10,
  superPerDay: 1,
  rewindPerDay: 1,
} as const;

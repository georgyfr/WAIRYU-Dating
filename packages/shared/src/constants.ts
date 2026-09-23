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

// ---------------------------------------------------------------------------
// Étape 3 — Profils & photos protégées
// ---------------------------------------------------------------------------

/** Largeur de la vignette servie (transformation Cloudinary à la volée). */
export const PHOTO_THUMB_WIDTH = 200;
/** Largeur de la variante « floue » (petite + flou CSS côté front). */
export const PHOTO_BLUR_WIDTH = 400;

/** Bibliothèque de prompts de personnalité — l'utilisateur en choisit 3. */
export const PROMPT_LIBRARY: { key: string; label: string }[] = [
  { key: 'ideal_evening', label: 'Mon idée de soirée idéale ?' },
  { key: 'quirky_fact', label: 'Un détail improbable sur moi' },
  { key: 'green_flag', label: 'Mon green flag préféré chez quelqu\u2019un' },
  { key: 'perfect_weekend', label: 'Mon week-end parfait ressemble à' },
  { key: 'melts_me', label: 'Ce qui me fait fondre, c\u2019est' },
  { key: 'dealbreaker', label: 'Mon deal-breaker absolu' },
  { key: 'current_passion', label: 'La passion qui m\u2019anime en ce moment' },
  { key: 'memorable_trip', label: 'Le voyage qui m\u2019a le plus marqué·e' },
  { key: 'always_laugh', label: 'Je rigole toujours quand' },
] as const;

/** Clés de prompts valides (déduit de la bibliothèque). */
export const PROMPT_KEYS = PROMPT_LIBRARY.map((p) => p.key);

/** Limites de validation du profil (miroir exact des validators de l'API). */
export const PROFILE_LIMITS = {
  displayNameMin: 2,
  displayNameMax: 30,
  cityMin: 2,
  cityMax: 80,
  bioMax: 150,
  promptAnswerMax: 150,
  promptsRequired: 3,
  geoRegionMax: 80,
  /** Octets max d'une photo reçue par l'API (le client compresse à ~300 Ko). */
  photoMaxBytes: 2 * 1024 * 1024,
  photoMaxDim: 4096,
  /** Côté client : largeur cible du recadrage 4:5. */
  photoTargetWidth: 1024,
  photoTargetHeight: 1280,
  photoWebpQuality: 0.82,
} as const;

export const GENDERS = ['woman', 'man', 'non_binary'] as const;
export const INTENTS = ['serious', 'open', 'friends_first'] as const;
export const ORIENTATIONS = ['straight', 'gay', 'bi', 'other'] as const;
export const PREF_GENDERS = ['women', 'men', 'everyone'] as const;
export const MODE_DEFAULTS = ['classic', 'invisible'] as const;

/** Libellés d'affichage (front uniquement — jamais envoyés à l'API). */
export const LABELS = {
  gender: { woman: 'Femme', man: 'Homme', non_binary: 'Non binaire' } as Record<string, string>,
  orientation: { straight: 'Hétéro', gay: 'Gay / Lesbienne', bi: 'Bisexuel·le', other: 'Autre' } as Record<string, string>,
  intent: { serious: 'Relation sérieuse', open: 'Ouvert·e à voir', friends_first: 'D\u2019abord amis' } as Record<string, string>,
  prefGender: { women: 'Femmes', men: 'Hommes', everyone: 'Tout le monde' } as Record<string, string>,
  mode: { classic: 'Mode Classique', invisible: 'Mode Invisible' } as Record<string, string>,
} as const;

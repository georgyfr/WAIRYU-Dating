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
  /**
   * Durée de vie d'une session en jours (glissant). Décision fondateur :
   * après inscription, le compte reste connecté (365 j glissants, prolongés
   * à chaque visite) — il ne revient jamais repasser par l'inscription.
   */
  sessionDays: 365,
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

// ---------------------------------------------------------------------------
// RENCONTRE-E3 « Le Voyage à Deux » (Task 115) — SPEC v1.1, décisions gravées
// D-E3-1..9 + G-E3-P1..P10. Les limites médias et le contenu pilote vivent
// ICI (source unique front ↔ Worker) — G-E3-P4 et G-E3-P7.
// ---------------------------------------------------------------------------

/** Les niveaux du voile : 2 = les cartes (Duo) · 3 = la voix · 4 = la photo. */
export const A2_NIVEAUX = [2, 3, 4] as const;
export type A2Niveau = (typeof A2_NIVEAUX)[number];

/** Limites médias (G-E3-P4) — le SERVEUR refuse au-delà (413 honnête). */
export const A2_MEDIAS = {
  /** Voix : webm/opus (MediaRecorder) ou m4a/aac (repli iOS). */
  voixMaxSecondes: 60,
  voixMaxOctets: 512 * 1024,
  /** Photo : JPEG/PNG/WebP, re-encodée canvas côté client (EXIF purgé, G-E3-P5). */
  photoMaxOctets: 4 * 1024 * 1024,
} as const;

/** Le contenu pilote (G-E3-P7) — jamais de diagnostic, jamais une note. */
export const A2_PILOTE = {
  /** L'activité « Trois questions croisées » : réponses dévoilées seulement
   *  quand les DEUX ont répondu aux TROIS (le consentement est structurel). */
  questionsCroisees: [
    {
      id: 'q1',
      fr: 'Raconte un tout petit plaisir que tu t’es offert cette semaine.',
      en: 'Tell us about one small pleasure you treated yourself to this week.',
    },
    {
      id: 'q2',
      fr: 'Quel est l’endroit où tu te sens le plus toi-même ?',
      en: 'Which place makes you feel most like yourself?',
    },
    {
      id: 'q3',
      fr: 'Si vous aviez une journée libre ensemble demain, tu choisirais quoi ?',
      en: 'If you both had a free day together tomorrow, what would you choose?',
    },
  ],
  /** La question de dialogue du Duo (une par quête, tournée dans l'ordre). */
  questionsDuo: [
    {
      fr: 'Retrouvez un point où vos réponses se ressemblent — et racontez-le.',
      en: 'Find one point where your answers sound alike — and tell each other about it.',
    },
    {
      fr: 'Chacun pose une question sur la réponse de l’autre — sans deviner.',
      en: 'Each of you asks one question about the other’s answer — without guessing.',
    },
    {
      fr: 'Quelle réponse t’a le plus surpris·e, et pourquoi ?',
      en: 'Which answer surprised you the most, and why?',
    },
  ],
  /** Le Rendez-vous préparé (G-E3-P6 : règles locales transparentes, PAS d'IA).
   *  Trois formats honnêtes, la matière première = les réponses croisées. */
  ideesRdv: [
    {
      fr: 'La balade à mi-chemin',
      en: 'The halfway stroll',
      pourquoiFr: 'Un lieu entre vos deux vies — vous marchez et vous parlez des réponses croisées.',
      pourquoiEn: 'A place between your two lives — you walk and talk through your shared answers.',
    },
    {
      fr: 'Le café des questions',
      en: 'The question café',
      pourquoiFr: 'Assis·es, à l’abri de la pluie : chacun relit sa réponse q1 et l’autre pose une question.',
      pourquoiEn: 'Seated, sheltered from the rain: each re-reads their q1 answer and the other asks one question.',
    },
    {
      fr: 'La découverte surprise',
      en: 'The surprise discovery',
      pourquoiFr: 'L’un choisit le lieu, l’autre choisit l’heure — à partir de la réponse q3.',
      pourquoiEn: 'One picks the place, the other picks the time — based on the q3 answer.',
    },
  ],
} as const;

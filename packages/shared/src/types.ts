/** Types partagés API ↔ Front. */

import type { QItem, QAnswers, LevelInsights } from './matching';

export type ApiErrorCode =
  | 'bad_request'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'rate_limited'
  | 'internal'
  // --- Étape 2 : authentification ---
  | 'email_invalid'
  | 'otp_invalid'
  | 'otp_expired'
  | 'otp_locked'
  | 'otp_cooldown'
  | 'turnstile_failed'
  | 'conflict'
  | 'not_configured';

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

/**
 * Intentions de recherche — mariage et vie de couple ajoutés à la demande
 * fondateur. NOTE : « interracial » n'est PAS une intention mais un MODE de
 * découverte (clarification fondateur — rencontres entre continents).
 */
export type Intent = 'serious' | 'open' | 'friends_first' | 'couple_life' | 'marriage';

/**
 * Modes de découverte :
 * - classic    : photos visibles, swipe.
 * - invisible  : profil flouté, questionnaire, révélation consentie (15 msgs / 7 jours).
 * - interracial (demande fondateur) : rencontres entre personnes de races,
 *   cultures et CONTINENTS différents — portée mondiale (matching Étape 4).
 *   Comportement photos identique au classic (visibles) tant que le moteur
 *   de matching inter-continents n'existe pas.
 */
export type DiscoveryMode = 'classic' | 'invisible' | 'interracial';

// ---------- Étape 3 : profils & photos protégées ----------

export type Orientation = 'straight' | 'gay' | 'bi' | 'other';

export type PrefGender = 'women' | 'men' | 'everyone';

/** Un prompt rempli (clé de la bibliothèque + réponse personnelle). */
export interface PromptInput {
  key: string;
  answer: string;
}

/** Photo telle que vue par son PROPRIÉTAIRE (URLs signées nettes autorisées). */
export interface PhotoDto {
  id: string;
  position: number; // 0 = photo principale
  width: number;
  height: number;
  bytes: number;
  format: string;
  createdAt: number;
  /** URL signée pleine résolution (autorisée uniquement si la règle le permet). */
  urlFull: string | null;
  /** URL signée vignette 200 px. */
  urlThumb: string | null;
}

/** Profil complet de l'utilisateur authentifié (GET /api/profile). */
export interface ProfileResponse {
  displayName: string | null;
  birthYear: number | null;
  /** Date de naissance ISO « YYYY-MM-DD » (jour/mois/année — âge exact). */
  birthDate: string | null;
  gender: Gender | null;
  orientation: Orientation | null;
  intent: Intent | null;
  city: string | null;
  /** Pays détecté (géocodage inverse) ou saisi — libellé libre. */
  country: string | null;
  /** Quartier (géocodage inverse) ou saisi — optionnel, libellé libre. */
  neighborhood: string | null;
  /** Région grossière : « geo:lat,lon » (≈11 km) ou libellé libre. Jamais de GPS précis. */
  geoRegion: string | null;
  bio: string | null;
  /** Horodatage du consentement explicite profil/découverte (null = pas donné). */
  profileConsentAt: number | null;
  prompts: PromptInput[];
  photos: PhotoDto[];
  preferences: PreferencesDto | null;
  /** Tous les champs requis sont-ils remplis (basics + ≥1 prompt + ≥1 photo + préférences) ? */
  profileComplete: boolean;
}

/** Préférences de découverte (GET/PUT /api/profile/preferences). */
export interface PreferencesDto {
  modeDefault: DiscoveryMode;
  prefGender: PrefGender;
  minAge: number;
  maxAge: number;
  distanceKm: number;
  prefIntent: Intent | null;
}

/** Corps de PUT /api/profile — tous les champs optionnels (mise à jour partielle). */
export interface ProfileUpdate {
  displayName?: string;
  birthYear?: number;
  /** Date de naissance ISO « YYYY-MM-DD » — met aussi à jour birthYear (année dérivée). */
  birthDate?: string;
  gender?: Gender;
  orientation?: Orientation;
  intent?: Intent;
  city?: string;
  country?: string | null;
  neighborhood?: string | null;
  geoRegion?: string | null;
  bio?: string;
  /** Consentement explicite dédié — requis (true) au moins une fois. */
  consentAccepted?: boolean;
  /** Remplace la liste des prompts (max 3). */
  prompts?: PromptInput[];
}

/** Corps de PUT /api/profile/preferences. */
export interface PreferencesUpdate {
  modeDefault: DiscoveryMode;
  prefGender: PrefGender;
  minAge: number;
  maxAge: number;
  distanceKm: number;
  prefIntent?: Intent | null;
}

/** Réponse de GET /api/photos/:photoId/url?variant=sharp|blur. */
export interface PhotoUrlResponse {
  photoId: string;
  variant: 'sharp' | 'blur';
  url: string;
  width: number;
  height: number;
}

// ---------- Étape 4 : questionnaire progressif & matching ----------

/** Progression d'un niveau de questionnaire. */
export interface QProgress {
  level: 1 | 2;
  /** Questions répondues (peu importe la version). */
  done: number;
  total: number;
}

/** GET /api/q — état complet du questionnaire pour l'utilisateur courant. */
export interface QuestionnaireState {
  /** Banque active (N1+N2), triée par niveau puis position. */
  items: QItem[];
  answers: QAnswers;
  progress: { n1: QProgress; n2: QProgress };
  /** « Ma personnalité » — un bloc par niveau complété. */
  insights: LevelInsights[];
}

/** PUT /api/q/answers/:itemId — sauvegarde d'UNE réponse (1 écriture). */
export interface QAnswerResponse {
  saved: true;
  progress: { n1: QProgress; n2: QProgress };
  /** Niveau franchi par CETTE réponse (null sinon). */
  levelCompleted: 1 | 2 | null;
  /** Insights du niveau fraîchement complété (null sinon). */
  insights: LevelInsights | null;
}

export interface FeedResponse {
  page: number;
  pageSize: number;
  hasMore: boolean;
  items: FeedProfile[];
  /** Rappel produit : le score est indicatif (affiché sous le score). */
  disclaimer: string;
}


/** Configuration publique d'authentification (GET /api/auth/config). */
export interface AuthConfigResponse {
  /** Clé de site Turnstile (public — instanciée par le front). */
  turnstileSiteKey: string | null;
  /** Google OAuth configuré côté serveur ? */
  googleEnabled: boolean;
  /** Facebook Login configuré côté serveur ? */
  facebookEnabled: boolean;
  /** Mode d'envoi des emails OTP : 'brevo' ou 'dev' (staging sans clé Brevo). */
  emailProvider: 'brevo' | 'dev';
}

/** Profil utilisateur renvoyé par /api/me. */
export interface MeResponse {
  userId: string;
  email: string;
  displayName: string | null;
  emailVerified: boolean;
  status: 'pending' | 'active' | 'banned' | 'deleted';
  plan: 'free' | 'plus' | 'gold';
  createdAt: number;
  /** true si la session a été prolongée lors de cette requête (TTL glissant). */
  sessionRenewed: boolean;
  /** Profil complet (Étape 3) : basics + ≥1 prompt + ≥1 photo + préférences. */
  profileComplete: boolean;
}

/** Réponse de POST /api/auth/otp/request (le code n'est exposé qu'en staging-dev). */
export interface OtpRequestResponse {
  sent: true;
  /** Canaux utilisés (traçabilité front). */
  channel: 'email' | 'dev';
  /** Code OTP en clair — UNIQUEMENT en staging sans clé Brevo (tests mobiles). */
  devCode?: string;
}

/** Réponse de POST /api/auth/otp/verify. */
export interface OtpVerifyResponse {
  userId: string;
  email: string;
  /** Compte créé lors de cette vérification (première inscription). */
  created: boolean;
}

/** Réponse de POST /api/auth/facebook/link (rattachement après complétion email). */
export interface FacebookLinkResponse {
  linked: boolean;
}

/** Réponse de GET /api/geo/reverse — géocodage inverse (Nominatim via Worker). */
export interface GeoReverseResponse {
  country: string | null;
  city: string | null;
  /** Quartier / suburb — peut être null (zones peu denses). */
  neighborhood: string | null;
  /** Libellé complet OSM (contexte, debug front). */
  label: string | null;
}

/** Export RGPD — GET /api/account/export (droit d'accès, art. 15/20). */
export interface AccountExport {
  exportedAt: string;
  format: 'wairyu-export-v1';
  user: Record<string, unknown>;
  sessions: { active: number; revoked_total: number };
  /** Étape 3 : prompts, métadonnées photos, préférences de découverte. */
  profile?: Record<string, unknown>;
  audit: Record<string, unknown>;
}

/** Profil vu dans le feed — la photo n'est JAMAIS une URL brute : toujours signée, court-lived. */
export interface FeedProfile {
  userId: string;
  displayName: string;
  age: number;
  city: string;
  /** Quartier — affichage optionnel côté front (produit : jamais de rue). */
  neighborhood: string | null;
  country: string | null;
  intent: Intent;
  bio: string;
  prompts: { question: string; answer: string }[];
  /** URL signée (floue si mode Invisible sans révélation). */
  photoUrl: string | null;
  /** true = la photo est servie en variante floue (le front applique le flou CSS). */
  photoBlurred: boolean;
  /** Pourquoi ce match ? — 2 forces + 1 vigilance (Étape 4). */
  matchReasons: {
    forces: string[];
    vigilance: string;
    conversationStarters: string[];
  } | null;
  score: number | null;
  /** Archétype du membre (proposé ou validé) — Étape 4-bis. */
  personalityType: import('./personality').ArchetypeId | null;
  /** true = l'archétype a été confirmé par son auteur (« C'est moi ✓ »). */
  personalityValidated: boolean;
  /** Affinité avec MON archétype (null si l'un des deux n'a pas de type). */
  personalityAffinity: import('./personality').PersonalityAffinity | null;
  /** true = son type fait partie des types de profils que J'AI SÉLECTIONNÉS (mis en avant). */
  personalitySought: boolean;
  /**
   * Extraits de questionnaire partagés (Étape 5 — cartes Invisible) :
   * « « {question} » — comme toi : {réponse} » pour ≤ 2 réponses identiques.
   */
  highlights: string[];
}

// ---------- Étape 5 : découverte dual-mode ----------

/** Action de swipe (Classique / Interracial). */
export type SwipeAction = 'like' | 'pass' | 'super';

/** Compteurs quotidiens de découverte (fenêtre UTC, purge par le cron). */
export interface QuotaState {
  likesUsed: number;
  likesLeft: number;
  supersUsed: number;
  supersLeft: number;
  invisibleUsed: number;
  invisibleLeft: number;
  rewindsUsed: number;
  rewindsLeft: number;
}

/** POST /api/discover/swipe. */
export interface SwipeResponse {
  ok: true;
  /** true = réciprocité détectée : un match vient d'être créé. */
  matched: boolean;
  matchId: string | null;
  /** Mode de la conversation créée ('classic' | 'invisible'). */
  conversationMode: 'classic' | 'invisible' | null;
  /** Prénom de la personne (écran « C'est un match ! »). */
  matchedName: string | null;
  quota: QuotaState;
}

/** POST /api/discover/rewind — annule MA dernière action (1/jour). */
export interface RewindResponse {
  ok: true;
  /** false = rien à annuler (quota non consommé). */
  undone: boolean;
  targetId: string | null;
  quota: QuotaState;
}

/** Demande « Discuter » (handshake du Mode Invisible). */
export interface InvisibleRequestDto {
  id: string;
  fromUser: string;
  fromName: string;
  toUser: string;
  toName: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: number;
  /** Photo principale du DEMANDEUR (floue si le demandeur est Invisible). */
  photoUrl: string | null;
  photoBlurred: boolean;
  personalityType: import('./personality').ArchetypeId | null;
  personalityValidated: boolean;
}

/** GET /api/discover/inbox — demandes reçues + envoyées. */
export interface InboxResponse {
  /** Demandes reçues en attente de MA réponse. */
  received: InvisibleRequestDto[];
  /** Mes demandes envoyées (je vois accepté / décliné). */
  sent: InvisibleRequestDto[];
  quota: QuotaState;
}

/** POST /api/discover/invisible-request/:id/respond. */
export interface InvisibleRespondResponse {
  ok: true;
  status: 'accepted' | 'declined';
  /** true = l'acceptation a créé un match (+ conversation Invisible). */
  matched: boolean;
  matchId: string | null;
}

/** POST /api/discover/invisible-request — envoi d'une demande. */
export interface InvisibleRequestResponse {
  ok: true;
  status: 'pending' | 'accepted';
  /** true = la personne m'avait déjà demandé → match immédiat (double « Discuter »). */
  matched: boolean;
  matchId: string | null;
  quota: QuotaState;
}

/** Un match + sa conversation (GET /api/discover/matches). */
export interface MatchDto {
  matchId: string;
  conversationId: string;
  /** Mode de la CONVERSATION — passerelle acceptée ⇒ 'invisible' (photos re-floutées). */
  conversationMode: 'classic' | 'invisible';
  origin: 'like' | 'super' | 'invisible_request';
  createdAt: number;
  other: {
    userId: string;
    displayName: string;
    city: string | null;
    country: string | null;
    photoUrl: string | null;
    /** true = photo servie floue (conversation Invisible, pas encore révélée). */
    photoBlurred: boolean;
    personalityType: import('./personality').ArchetypeId | null;
    personalityValidated: boolean;
  };
  /** Demande de passerelle en attente sur cette conversation (null sinon). */
  pendingGateway: { id: string; fromMe: boolean; createdAt: number } | null;
}

/** GET /api/discover/matches. */
export interface MatchListResponse {
  matches: MatchDto[];
  /** Rappel produit (§4.8) : changer de mode ne détruit jamais un match. */
  note: string;
}

/** POST /api/discover/matches/:id/gateway (+ /respond). */
export interface GatewayResponse {
  ok: true;
  status: 'pending' | 'accepted' | 'declined';
  conversationMode: 'classic' | 'invisible';
}

/** GET /api/discover/top — Top Compatibilité du jour (cron, hors quota feed). */
export interface TopResponse {
  day: string;
  items: FeedProfile[];
  note: string;
}

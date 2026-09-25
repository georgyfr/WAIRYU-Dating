/**
 * Découverte tri-mode (Étape 5) — le cœur de l'app, enrichi « dating ».
 *
 * - Onglets de mode (Classique / Invisible / Interracial) — bascule libre,
 *   réversible, transparente (spec §4.3.4) : elle ne touche jamais aux matchs
 *   existants (§4.8), seulement aux FUTURES découvertes.
 * - Classique/Interracial : pile de cartes façon Tinder/Badoo — carrousel
 *   photos, overlay présence/distance, swipe tactile + boutons (passe / super
 *   / like / rewind + clavier PC), « Tu plais ! » (likes reçus — gratuit),
 *   match mutuel → écran « C'est un match ! » à deux photos.
 * - Invisible : cartes floutées « personnalité d'abord » (score, extraits en
 *   citations, rituel 15 messages / 7 jours / révélation à deux) + « Demander
 *   à discuter » (handshake) + boîte de réception.
 * - Interracial : drapeaux & continents, badge intercontinental, distance
 *   mondiale formatée, priorité « autres continents ».
 * - Top Compatibilité du jour (cron, hors quota) + filtres de base + quotas.
 * Task 36 (demande fondateur — URLs spécifiques) : chaque onglet de mode a
 * son URL — #/discover/classique · #/discover/interracial · #/discover/
 * invisible — et basculer un mode met l'URL à jour (replaceState, via
 * onModeChange). Un deep link d'un mode ≠ serveur déclenche la VRAIE
 * bascule (même logique qu'un clic — Task 33 : PUT persistant, deck du bon
 * bassin, feedback garanti) ; #/discover sans slug garde son comportement
 * historique (mode des préférences serveur). Rien n'est supprimé.
 * Task 38 (réf. PROMPT « Wairyu Cultures ») : le mode Interracial devient
 * « Wairyu Cultures » — palette ambre/terre (body.mode-interracial, lib/
 * mode.ts), bandeau de DRAPEAUX sur chaque carte (countryMeta — données
 * réelles), SCORE CULTUREL cliquable sur la photo → modale « Pourquoi ce
 * match culturel ? » (forces / vigilance / sujets cliquables), chips
 * VALEURS ambre (highlights réels), bio en italique à guillemets, action
 * LIKER en pilule dégradée chaude, filtres CULTURELS (score min + continents,
 * locaux), sections COACH CULTUREL / DÉFIS DE CONNEXION / SALONS (aperçu
 * honnête « Bientôt »), drapeaux face à face dans la modale Match. Toutes
 * les données affichées sont RÉELLES — rien n'est inventé.
 * Éthique (spec §5.4) : l'avertissement d'indicativité est TOUJOURS visible.
 * Task 43 (demande fondateur — « des fonctionnalités plus intelligentes,
 * plus fluides et ergonomiques, plus interactives » sur #/discover/classique) :
 * enrichissements 100 % données réelles, TOUT ADDITIFS —
 * · ACCROCHE SUGGÉRÉE copiable sur chaque carte (matchReasons — serveur) ;
 * · tri local « ⏱️ En ligne d'abord » (buckets présence réels) ;
 * · barre de PROGRESSION de la pile (vues / à découvrir) ;
 * · mini-jauge sur le quota de likes ;
 * · BURST visuel à l'envol (♥ / ✶) + barres photos CLIQUABLES (saut direct)
 *   + squelettes shimmer au premier chargement.
 * Rien d'inventé, rien de supprimé : le serveur ne change pas.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { api, ApiError } from '../lib/api';
import { useSwr } from '../lib/swr';
import { toast } from '../lib/toast';
import { setSharedMode } from '../lib/mode';
import { countryMeta, formatKm } from '../lib/geo';
import {
  ARCHETYPES,
  AFFINITY_LABELS,
  DISCOVERY,
  LABELS,
  type DiscoveryMode,
  type FeedProfile,
  type FeedResponse,
  type InboxResponse,
  type LikesMeResponse,
  type MatchListResponse,
  type PreferencesDto,
  type ProfileResponse,
  type QuotaState,
  type SwipeAction,
  type SwipeResponse,
  type TopResponse,
} from '@wairyu/shared';

interface Props {
  /** Ouvre l'onglet Matchs (barre d'onglets — plus de bouton retour). */
  onMatches: () => void;
  /** Task 36 : mode demandé par l'URL (#/discover/:mode) — sinon undefined. */
  initialMode?: DiscoveryMode;
  /** Task 36 : notifie App après une bascule réussie — l'URL suit le mode. */
  onModeChange?: (mode: DiscoveryMode) => void;
  /** Task 40 : ouvre l'univers événementiel « Wairyu Moments » (#/events).
   *  Moments n'est PAS un DiscoveryMode (univers parallèle Task 39) — aucune
   *  bascule serveur ici : simple navigation, le mode dating est préservé. */
  onMoments?: () => void;
}

const MODE_TABS: { id: DiscoveryMode; label: string; icon: string; hint: string }[] = [
  { id: 'classic', label: 'Classique', icon: '🔥', hint: 'Photos visibles, swipe libre.' },
  { id: 'invisible', label: 'Invisible', icon: '🕯️', hint: 'Photos floutées — la personnalité d’abord.' },
  { id: 'interracial', label: 'Interracial', icon: '🌍', hint: 'Rencontres entre continents, portée mondiale.' },
];

/** Bannières d'ambiance — une identité forte par mode (enrichissement). */
const MODE_HEROES: Record<DiscoveryMode, { title: string; sub: string; chips: string[] }> = {
  classic: {
    title: '🔥 Swipe, matche, discute',
    sub: 'Les codes des grandes apps de rencontre — photos visibles, décisions libres, 100 % gratuit.',
    chips: ['♥ 50 likes / jour', '✶ Super Like offert', '↺ Rewind offert', '✓ Profils vérifiés'],
  },
  invisible: {
    title: '🕯️ La personnalité d’abord',
    sub: 'Photos floutées par choix : lis les personnalités, discute sans apparence, révèle seulement à deux.',
    chips: ['💬 15 messages', '⏳ 7 jours', '🔓 Révélation consentie'],
  },
  interracial: {
    title: '🌍 Wairyu Cultures',
    sub: 'Découvre la richesse des différences : drapeaux, cultures du monde et score culturel explicable.',
    chips: ['✈️ Portée mondiale', '🗺️ Tous continents', '🧭 Score culturel explicable', '🛡️ Visio avant de voyager'],
  },
};

/** Libellés de présence (buckets vagues — jamais d'heure exacte, privacy). */
const ONLINE_LABELS: Record<NonNullable<FeedProfile['online']>, string> = {
  online: 'En ligne',
  today: 'Actif aujourd’hui',
  recent: 'Actif récemment',
};

type Exit = 'left' | 'right' | 'up' | null;

/** Cible hors deck (strip « Tu plais ! », modale profil) — payload minimal pour l'API. */
interface TargetRef {
  id: string;
  photo?: string | null;
  name?: string;
  /** Task 38 : pays de la cible — drapeaux face à face dans la modale Match (Cultures). */
  country?: string | null;
}

/** Boost — aperçu Wairyu+ offert pendant le lancement (stockage local). */
const BOOST_LS_KEY = 'wairyu.boost.until';
const BOOST_MS = 30 * 60 * 1000;
/** Filtre local « vérifiés uniquement » — appliqué à la pile chargée. */
const VERIFIED_LS_KEY = 'wairyu.filter.verified';
/** Task 32 (réf. Invisible §5.6) : score minimum — filtre LOCAL (pile chargée). */
const MIN_SCORE_LS_KEY = 'wairyu.filter.minscore';
/**
 * Task 38 (réf. Cultures §5.7) : filtre culturel CONTINENTS — local,
 * multi-sélection, interracial uniquement. La liste reprend les valeurs
 * RÉELLES de lib/geo.ts (aucune invention). Un profil sans pays connu
 * reste toujours visible : on ne punit pas l'absence de données.
 */
const CONTINENTS_LS_KEY = 'wairyu.filter.continents';
/** Task 43 : tri local « En ligne d'abord » — classique uniquement (LS). */
const ONLINE_FIRST_LS_KEY = 'wairyu.sort.online';
const INTL_CONTINENTS = ['Afrique', 'Europe', 'Asie', 'Amérique du Nord', 'Amérique du Sud', 'Océanie'] as const;

/**
 * Task 38 (réf. Cultures §4.6) : défis de connexion — activités guidées à
 * faire à deux. Pédagogie produit (comme les cartes Coach) : aucun chiffre
 * ni donnée utilisateur inventée — ce sont des SUGGESTIONS de conversation.
 */
const INTL_DEFIS: { icon: string; title: string; desc: string; level: 'easy' | 'med' | 'hard' }[] = [
  { icon: '🎵', title: 'Chanson d’enfance', desc: 'Partage la chanson que tu chantais à fond quand tu étais petit·e.', level: 'easy' },
  { icon: '🎉', title: 'Fêtes comparées', desc: 'Racontez-vous votre fête préférée — celle qui rassemble toute la famille.', level: 'easy' },
  { icon: '🍳', title: 'Recette de famille', desc: 'Échangez une recette transmise dans vos familles — et cuisinez-la chacun chez soi.', level: 'med' },
  { icon: '🗣️', title: 'Apprends 5 mots', desc: 'Apprends 5 mots dans SA langue maternelle, puis utilise-les dans la conversation.', level: 'med' },
  { icon: '👨‍👩‍👧', title: 'Famille biculturelle', desc: 'Imaginez vos fêtes, plats et langues dans un futur foyer biculturel.', level: 'hard' },
  { icon: '❤️', title: 'Vision de la famille', desc: 'Chacun décrit sa vision d’une famille unie — sans juger celle de l’autre.', level: 'hard' },
];

/**
 * Task 38 (réf. Cultures §4.4) : salons culturels — APERÇU honnête de la
 * prochaine phase. AUCUN faux chiffre (ni membres, ni « en ligne ») : la
 * carte porte un badge « Bientôt » explicite.
 */
const INTL_SALONS: { emoji: string; name: string }[] = [
  { emoji: '🍲', name: 'Cuisine du monde' },
  { emoji: '🎵', name: 'Musique africaine' },
  { emoji: '🌍', name: 'Relations interculturelles' },
  { emoji: '🗣️', name: 'Apprendre les langues' },
  { emoji: '📚', name: 'Littérature du monde' },
  { emoji: '💃', name: 'Danses du monde' },
];

/** Task 38 (réf. Cultures §4.6) : libellés de difficulté des défis. */
const DEFIS_LEVELS: Record<'easy' | 'med' | 'hard', string> = {
  easy: 'Facile',
  med: 'Moyen',
  hard: 'Difficile',
};

/** Task 43 : troncature propre (accroches longues) — aucun texte inventé. */
function truncateTxt(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s;
}

/* ─────────────────────────── Carrousel de photos ─────────────────────────── */

/**
 * Carrousel façon Tinder : glisser-tap gauche/droite, points, compteur.
 * Task 38 (réf. Cultures §4.2) : en mode Cultures (`culture`), la photo
 * porte le BANDEAU DE DRAPEAUX en haut à gauche (pays réel du profil —
 * countryMeta) et le BADGE SCORE CULTUREL en haut à droite, cliquable
 * (onScore → modale « Pourquoi ce match culturel ? »).
 */
function CardCarousel({
  p,
  culture = false,
  onScore,
}: {
  p: FeedProfile;
  /** Task 38 : habillage Cultures (drapeaux + score culturel sur la photo). */
  culture?: boolean;
  /** Task 38 : clic sur le score culturel (mode Cultures uniquement). */
  onScore?: (p: FeedProfile) => void;
}) {
  const [slide, setSlide] = useState(0);
  const photos =
    p.photos.length > 0
      ? p.photos
      : p.photoUrl
        ? [{ url: p.photoUrl, blurred: p.photoBlurred }]
        : [];
  if (photos.length === 0) {
    return (
      <div className="feed-photo empty" aria-hidden="true">
        <span>✨</span>
      </div>
    );
  }
  const cur = Math.min(slide, photos.length - 1);
  const go = (d: number) => setSlide((s) => Math.max(0, Math.min(photos.length - 1, s + d)));
  const geo = countryMeta(p.country);
  return (
    <div className={`carousel ${p.photoBlurred ? 'blurred' : ''}`}>
      <div className="car-track" style={{ transform: `translateX(-${cur * 100}%)` }}>
        {photos.map((ph, i) => (
          <div key={i} className="car-slide">
            <img
              src={ph.url}
              alt={`${p.displayName} — photo ${i + 1}`}
              loading={i === 0 ? 'eager' : 'lazy'}
              draggable={false}
            />
          </div>
        ))}
      </div>

      {photos.length > 1 && (
        <>
          <button type="button" className="car-zone left" aria-label="Photo précédente" onClick={() => go(-1)} />
          <button type="button" className="car-zone right" aria-label="Photo suivante" onClick={() => go(1)} />
          <span className="car-count">{cur + 1}/{photos.length}</span>
          {/* Barres de progression façon Stories (enrichissement Task 30).
              Task 43 : barres CLIQUABLES — saut direct à une photo. */}
          <div className="car-bars">
            {photos.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`car-bar ${i <= cur ? 'on' : ''}`}
                aria-label={`Aller à la photo ${i + 1}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSlide(i);
                }}
              />
            ))}
          </div>
          <button type="button" className="car-arrow left" aria-label="Photo précédente" onClick={() => go(-1)}>
            ‹
          </button>
          <button type="button" className="car-arrow right" aria-label="Photo suivante" onClick={() => go(1)}>
            ›
          </button>
        </>
      )}
      {p.photoCount > photos.length && <span className="car-more">+{p.photoCount - photos.length} photos</span>}

      {p.photoBlurred ? (
        <span className="car-badge">🕯️ Photo floutée par choix</span>
      ) : (
        <>
          {/* Task 38 (réf. Cultures §4.2) : bandeau de drapeaux en haut à
              gauche — pays RÉEL du profil + continent (countryMeta). */}
          {culture && geo && (
            <span className="flag-banner" title={`Origine déclarée : ${[p.city, p.country].filter(Boolean).join(', ') || geo.continent}`}>
              <span className="flag-banner-flag" aria-hidden="true">{geo.flag}</span>
              <span className="flag-banner-txt">
                <strong>{p.country || geo.continent}</strong>
                <em>{geo.continent}</em>
              </span>
            </span>
          )}
          {/* Task 38 (réf. Cultures §4.2) : badge SCORE CULTUREL en haut à
              droite de la photo — cliquable → « Pourquoi ce match culturel ? ».
              Le score reste le score RÉEL du questionnaire (indicatif). */}
          {culture && p.score !== null && onScore && (
            <button
              type="button"
              className="intl-score"
              onClick={(e) => {
                e.stopPropagation();
                onScore(p);
              }}
              title="Pourquoi ce score culturel ? — indicatif, jamais prédictif"
            >
              <strong>{p.score}</strong>
              <small>🌍 Score culturel</small>
            </button>
          )}
          <div className="car-overlay">
          <div className="ov-main">
            <h3>
              {p.displayName}, {p.age}
            </h3>
            {p.verified && (
              <span className="ov-verified" title="Selfie reviewé par l'équipe wairyu">
                ✓
              </span>
            )}
          </div>
          <div className="ov-chips">
            {p.online && (
              <span className={`chip-ov ov-online ${p.online}`}>
                <span className="dot-on" />
                {ONLINE_LABELS[p.online]}
              </span>
            )}
            {p.distanceKm !== null && <span className="chip-ov">📍 à {formatKm(p.distanceKm)} km</span>}
            {geo && <span className="chip-ov">{geo.flag} {[p.city, p.country].filter(Boolean).join(', ')}</span>}
          </div>
        </div>
        </>
      )}
    </div>
  );
}

/* ─────────────────────────── Enrichissements statiques ──────────────────── */

/** Le rituel Invisible, rappelé sur chaque carte (transparence produit). */
function RitualRow() {
  return (
    <div className="ritual-row" title="Le rituel du Mode Invisible — toujours le même, jamais caché">
      <span className="ritual-chip">💬 15 messages</span>
      <span className="ritual-chip">⏳ 7 jours</span>
      <span className="ritual-chip">🔓 Révélation à deux</span>
    </div>
  );
}

/** Task 32 (réf. Invisible §4.2) : un extrait partagé → chip « valeur » court.
 *  Les highlights serveur ont la forme « « question » — comme toi : réponse » ;
 *  on affiche la partie partagée, tronquée proprement. Rien n'est inventé. */
function highlightChip(h: string): string {
  const tail = h.includes('comme toi :') ? (h.split('comme toi :')[1] ?? '') : h;
  const t = tail.trim();
  return t.length > 34 ? `${t.slice(0, 33).trimEnd()}…` : t;
}

/** Task 32 (réf. Invisible §4.3) : « jour N » du rituel 7 jours depuis un
 *  match (epoch secondes) — minimum 1, aucune donnée inventée au-delà. */
function ritualDay(createdAt: number): number {
  return Math.max(1, Math.floor((Date.now() - createdAt * 1000) / 86_400_000) + 1);
}

/** Les 3 étapes du Mode Invisible (encart pédagogique). */
function InvisibleSteps() {
  return (
    <section className="inv-steps">
      <div className="inv-step">
        <em>1</em>
        <p>Explore des profils floutés — lis les personnalités, les valeurs, les extraits partagés.</p>
      </div>
      <div className="inv-step">
        <em>2</em>
        <p>Demande à discuter ; une acceptation ouvre une conversation — photos toujours floutées.</p>
      </div>
      <div className="inv-step">
        <em>3</em>
        <p>Après 15 messages et 7 jours, révélez vos photos — seulement si vous le voulez tous les deux.</p>
      </div>
    </section>
  );
}

export function Discover({ onMatches, initialMode, onModeChange, onMoments }: Props) {
  const [prefs, setPrefs] = useState<PreferencesDto | null>(null);
  // Task 36 : le mode initial vient de l'URL quand elle en porte un
  // (#/discover/:mode) — sinon comportement historique (classic d'abord,
  // puis alignement sur les préférences serveur dans loadAround).
  const [mode, setMode] = useState<DiscoveryMode>(initialMode ?? 'classic');
  const [items, setItems] = useState<FeedProfile[]>([]);
  const [idx, setIdx] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [quota, setQuota] = useState<QuotaState | null>(null);
  const [top, setTop] = useState<TopResponse | null>(null);
  const [inbox, setInbox] = useState<InboxResponse | null>(null);
  const [likes, setLikes] = useState<LikesMeResponse | null>(null);
  const [myPhoto, setMyPhoto] = useState<string | null>(null);
  const [myCountry, setMyCountry] = useState<string | null>(null);
  const [intlFirst, setIntlFirst] = useState(false);
  // Task 38 : le pays accompagne le match — drapeaux face à face en Cultures.
  const [matchModal, setMatchModal] = useState<{ name: string; photo: string | null; country?: string | null } | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [exit, setExit] = useState<Exit>(null);
  const [openWhy, setOpenWhy] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [draftFilters, setDraftFilters] = useState<PreferencesDto | null>(null);
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const dragRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  // Enrichissement Task 30 : cloche notifications, Boost (aperçu), modale
  // détail profil et filtre local « vérifiés uniquement ».
  const [showNotif, setShowNotif] = useState(false);
  const [showBoost, setShowBoost] = useState(false);
  const [boostUntil, setBoostUntil] = useState<number>(() => Number(localStorage.getItem(BOOST_LS_KEY)) || 0);
  const [now, setNow] = useState(() => Date.now());
  const [detail, setDetail] = useState<FeedProfile | null>(null);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(() => localStorage.getItem(VERIFIED_LS_KEY) === '1');
  // Task 32 (réf. Invisible §5.6) : filtre local « score minimum » — 0 = désactivé.
  const [minScore, setMinScore] = useState<number>(() => Number(localStorage.getItem(MIN_SCORE_LS_KEY)) || 0);
  /**
   * Task 38 (réf. Cultures §4.2/§5.4) : modale « Pourquoi ce match culturel ? »
   * — ouverte depuis le badge score culturel SUR LA PHOTO (mode Cultures).
   * Contenu 100 % réel : matchReasons du serveur (forces, vigilance, sujets).
   */
  const [whyCulture, setWhyCulture] = useState<FeedProfile | null>(null);
  /**
   * Task 38 (réf. Cultures §5.7) : filtre culturel CONTINENTS — local,
   * multi-sélection (tableau vide = tous). Persisté en localStorage.
   */
  const [intlContinents, setIntlContinents] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(CONTINENTS_LS_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
    } catch {
      return [];
    }
  });
  /**
   * Task 43 : tri local « En ligne d'abord » — classique uniquement. Les
   * buckets de présence sont RÉELS (online > today > recent > inconnu) ;
   * le tri est stable, local, réversible, persisté en localStorage.
   */
  const [onlineFirst, setOnlineFirst] = useState<boolean>(() => localStorage.getItem(ONLINE_FIRST_LS_KEY) === '1');
  /**
   * Task 43 : compteur de session « profils vus » — la pile fonctionne par
   * RETRAIT (fix Task 30 : idx n'augmente plus), donc la progression se
   * base sur ce compteur RÉEL : incrémenté à chaque carte de la pile
   * consommée, décrémenté au rewind (annulation = carte de retour).
   */
  const [seen, setSeen] = useState(0);
  /**
   * Task 36 — références du deep-linking des onglets de mode :
   * - deepLinkHandled : l'alignement « URL ≠ serveur » au premier chargement
   *   des préférences ne doit déclencher qu'UNE bascule (les PUT rapprochés
   *   sont rate-limités — piège de recette Task 35) ;
   * - ownUrlUpdate : la bascule vient de NOTRE propre onModeChange (l'URL
   *   a changé parce qu'on vient de basculer) — l'effet d'écoute d'URL ne
   *   doit pas re-basculer en boucle ;
   * - prevUrlMode : détecte les changements EXTERNES de l'URL (édition
   *   manuelle de la barre d'adresse pendant que l'écran est monté).
   */
  const deepLinkHandled = useRef(false);
  const ownUrlUpdate = useRef<DiscoveryMode | null>(null);
  const prevUrlMode = useRef<DiscoveryMode | undefined>(initialMode);
  // Matchs récents (cloche) — le cache est PARTAGÉ avec la page Matchs.
  const { data: matchesData, refresh: refreshMatches } = useSwr<MatchListResponse>('matches', true, { ttlMs: 60_000 });

  const isInvisible = mode === 'invisible';
  // Task 38 (réf. Cultures) : raccourci lisible — tout l'habillage Cultures.
  const isIntl = mode === 'interracial';

  // Task 32 (réf. Invisible §3) : identité VIOLETTE du Mode Invisible —
  // `body.mode-invisible` retinte fond radial + --w-gradient (#8B5CF6→#EC4899).
  // Task 35 (demande fondateur — « la barre latérale du Classique doit être
  // différente de l'Invisible ») : la classe est posée par le store partagé
  // lib/mode.ts (un seul écrivain pour tout le SPA) et NE s'efface PLUS au
  // démontage — le mode est une propriété du profil : la barre latérale PC
  // garde l'identité violette sur Likes/Matchs/Messages/Profil, exactement
  // comme le serveur continue de servir le bassin Invisible (Task 34).
  useEffect(() => {
    setSharedMode(mode);
  }, [mode]);

  // Feedback utilisateur : toast en haut de l'écran (Task 31 — toujours
  // visible, même en bas de la pile) ; l'ancien flash-msg reste rendu si
  // `flash` est posé (compatibilité — rien n'est supprimé).
  const showFlash = useCallback((msg: string) => {
    toast(msg, 'success');
  }, []);

  /** Retire une personne de la liste « Tu plais ! » (traitée ou likée). */
  const removeLike = useCallback((userId: string) => {
    setLikes((prev) => {
      if (!prev || !prev.items.some((x) => x.userId === userId)) return prev;
      return {
        ...prev,
        count: Math.max(0, prev.count - 1),
        items: prev.items.filter((x) => x.userId !== userId),
      };
    });
  }, []);

  /** Charge une page du deck (append si p > 1). */
  const loadDeck = useCallback(async (p: number, replace: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api<FeedResponse>(`/api/feed?page=${p}`);
      setItems((prev) => (replace ? res.items : [...prev, ...res.items]));
      setHasMore(res.hasMore);
      setPage(p);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur inattendue.');
    }
    setLoading(false);
  }, []);

  const loadAround = useCallback(async () => {
    setLoading(true);
    try {
      // Task 28 (performance) : le FEED est le contenu critique — il part
      // IMMÉDIATEMENT, en parallèle de profile/quota/top/likes. Le payload du
      // feed ne dépend d'aucun de ces appels (le serveur lit la session).
      const feedP = api<FeedResponse>('/api/feed?page=1');
      const likesP = api<LikesMeResponse>('/api/discover/likes').catch(() => null);
      const [prof, q, t] = await Promise.all([
        api<ProfileResponse>('/api/profile'),
        api<QuotaState>('/api/discover/quota'),
        api<TopResponse>('/api/discover/top').catch(() => null),
      ]);
      setPrefs(prof.preferences);
      setDraftFilters(prof.preferences);
      // Task 36 : sans slug d'URL, comportement historique (le serveur fait
      // foi) ; AVEC un slug, l'URL prime — l'alignement éventuel au serveur
      // est géré par l'effet deep-link (plus bas, après switchMode).
      if (prof.preferences && !initialMode) setMode(prof.preferences.modeDefault);
      setQuota(q);
      setTop(t);
      setMyCountry(prof.country);
      const mainPhoto = prof.photos.find((x) => x.position === 0) ?? prof.photos[0];
      setMyPhoto(mainPhoto?.urlThumb ?? null);
      const inboxP =
        prof.preferences?.modeDefault === 'invisible'
          ? api<InboxResponse>('/api/discover/inbox').catch(() => null)
          : Promise.resolve(null);
      const [feedRes, inboxRes, likesRes] = await Promise.all([feedP, inboxP, likesP]);
      setItems(feedRes.items);
      setHasMore(feedRes.hasMore);
      setPage(1);
      setInbox(inboxRes);
      setLikes(likesRes);
      setIdx(0);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur inattendue.');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadAround();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Charge la suite du deck quand on approche de la fin. */
  useEffect(() => {
    if (!hasMore || loading) return;
    if (idx >= items.length - 3) void loadDeck(page + 1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, items.length]);

  /** Pile affichée — le filtre « vérifiés uniquement » est local (Task 30). */
  const deck = useMemo(() => {
    let d = verifiedOnly ? items.filter((p) => p.verified) : items;
    // Task 32 (réf. Invisible §5.6) : score minimum — filtre LOCAL instantané.
    // Un profil sans score (null) reste visible : on ne punit pas l'absence.
    if (minScore > 0) d = d.filter((p) => p.score === null || p.score >= minScore);
    // Task 38 (réf. Cultures §5.7) : filtre CONTINENTS — local, interracial
    // uniquement. Multi-sélection ; un profil sans pays connu reste visible.
    if (isIntl && intlContinents.length > 0) {
      const set = new Set(intlContinents);
      d = d.filter((p) => {
        const cont = p.country ? (countryMeta(p.country)?.continent ?? null) : null;
        return cont === null || set.has(cont);
      });
    }
    // Task 43 : tri « En ligne d'abord » — LOCAL, classique uniquement. Le
    // sort ES est stable : l'ordre serveur est conservé DANS chaque bucket.
    if (onlineFirst && mode === 'classic') {
      const rank = (p: FeedProfile) => (p.online === 'online' ? 0 : p.online === 'today' ? 1 : p.online === 'recent' ? 2 : 3);
      d = [...d].sort((a, b) => rank(a) - rank(b));
    }
    return d;
  }, [items, verifiedOnly, minScore, isIntl, intlContinents, onlineFirst, mode]);

  /** Retire une personne du deck (actionnée ailleurs — Top du jour, inbox). */
  const removeFromDeck = useCallback((userId: string) => {
    setItems((prev) => {
      const i = prev.findIndex((x) => x.userId === userId);
      if (i < 0) return prev;
      setIdx((cur) => (i < cur ? Math.max(0, cur - 1) : cur));
      return prev.filter((_, j) => j !== i);
    });
  }, []);

  /**
   * Swipe Classique/Interracial (like / pass / super).
   * `target` permet d'agir hors deck (strip « Tu plais ! », modale profil).
   *
   * Correction Task 30 (bug préexistant) : l'ancien flux retirait la carte du
   * tableau (décalage vers la gauche) PUIS incrémentait idx — chaque swipe
   * SAUTAIT donc le profil suivant (action sur la mauvaise carte, profil
   * réapparissant au reload). Désormais : l'ancienne carte reste à idx
   * pendant l'animation de sortie, PUIS removeFromDeck décale le tableau —
   * le profil suivant prend naturellement la même place.
   */
  const doSwipe = useCallback(
    async (action: SwipeAction, target?: TargetRef) => {
      const card = target ? deck.find((x) => x.userId === target.id) : deck[idx];
      const id = card?.userId ?? target?.id;
      if (!id || busy) return;
      setBusy(true);
      setError(null);
      const photo = card?.photos[0]?.url ?? card?.photoUrl ?? target?.photo ?? null;
      const dir: Exit = action === 'pass' ? 'left' : action === 'super' ? 'up' : 'right';
      const flyOut = () => {
        setExit(dir);
        window.setTimeout(() => {
          setExit(null);
          setDrag(null);
          if (id) removeFromDeck(id);
          setSeen((s) => s + 1); // Task 43 : la carte est consommée
          setBusy(false);
        }, 180);
      };
      try {
        const res = await api<SwipeResponse>('/api/discover/swipe', {
          json: { targetId: id, action, mode },
        });
        setQuota(res.quota);
        removeLike(id);
        if (res.matched) {
          refreshMatches(true); // la cloche Notifications voit le match immédiatement
          if (card) {
            removeFromDeck(id);
            if (!target) setSeen((s) => s + 1); // Task 43 : carte de pile consommée
          }
          setMatchModal({
            name: res.matchedName ?? card?.displayName ?? target?.name ?? 'Quelqu’un',
            photo,
            country: card?.country ?? target?.country ?? null, // Task 38
          });
          setBusy(false);
          return;
        }
        if (!target && card) {
          flyOut();
          return;
        }
        if (card) removeFromDeck(id);
        setBusy(false);
      } catch (err) {
        if (err instanceof ApiError && err.status === 429) {
          setError(err.message);
          setBusy(false);
        } else {
          setError(err instanceof ApiError ? err.message : 'Erreur inattendue.');
          if (!target && card) {
            flyOut(); // échec non-429 : on sort quand même la carte (comportement établi)
            return;
          }
          setBusy(false);
        }
      }
    },
    [deck, idx, busy, mode, removeFromDeck, removeLike, refreshMatches],
  );

  /** Rewind : annule ma dernière action et revient sur la carte. */
  const doRewind = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await api<{ ok: true; undone: boolean; targetId: string | null; quota: QuotaState }>(
        '/api/discover/rewind',
        { json: {} },
      );
      setQuota(res.quota);
      if (res.undone) {
        showFlash('Dernière action annulée.');
        setSeen((s) => Math.max(0, s - 1)); // Task 43 : la carte revient dans la pile
        const prevIdx = idx - 1;
        if (prevIdx >= 0 && deck[prevIdx]?.userId === res.targetId) {
          setIdx(prevIdx);
        } else {
          await loadDeck(1, true);
          setIdx(0);
        }
      } else {
        showFlash('Rien à annuler pour l’instant.');
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur inattendue.');
    }
    setBusy(false);
  }, [busy, idx, deck, loadDeck, showFlash]);

  /** Handshake « Discuter » (Invisible) — deck ou strip « Tu plais ! ». */
  const doRequest = useCallback(
    async (target?: TargetRef) => {
      const card = target ? deck.find((x) => x.userId === target.id) : deck[idx];
      const id = card?.userId ?? target?.id;
      if (!id || busy) return;
      setBusy(true);
      setError(null);
      const name = card?.displayName ?? target?.name ?? 'Quelqu’un';
      const photo = card?.photos[0]?.url ?? card?.photoUrl ?? target?.photo ?? null;
      try {
        const res = await api<{ ok: true; status: 'pending' | 'accepted'; matched: boolean; matchId: string | null; quota: QuotaState }>(
          '/api/discover/invisible-request',
          { json: { targetId: id } },
        );
        setQuota(res.quota);
        setInbox((prev) =>
          prev
            ? {
                ...prev,
                sent: [
                  {
                    id: `tmp-${id}`,
                    fromUser: 'me',
                    fromName: '',
                    toUser: id,
                    toName: name,
                    status: res.status === 'accepted' ? 'accepted' : 'pending',
                    createdAt: Math.floor(Date.now() / 1000),
                    photoUrl: photo,
                    photoBlurred: card?.photoBlurred ?? false,
                    personalityType: card?.personalityType ?? null,
                    personalityValidated: card?.personalityValidated ?? false,
                  },
                  ...prev.sent,
                ],
              }
            : prev,
        );
        if (res.matched) {
          setMatchModal({ name, photo, country: card?.country ?? target?.country ?? null }); // Task 38 : drapeaux
        } else {
          showFlash(`Demande envoyée à ${name} — à ${LABELS.intent[card?.intent ?? 'open'] ?? 'faire connaissance'} quand elle accepte.`);
        }
        if (card) removeFromDeck(id);
        else removeLike(id);
      } catch (err) {
        if (err instanceof ApiError && err.status === 409) {
          showFlash(err.message);
        } else {
          setError(err instanceof ApiError ? err.message : 'Erreur inattendue.');
        }
      }
      setBusy(false);
    },
    [deck, idx, busy, removeFromDeck, removeLike, showFlash],
  );

  /**
   * (Re)charge les préférences à la volée — rattrapage si elles manquent en
   * mémoire au moment d'une bascule de mode (échec réseau du chargement
   * initial, compte sans ligne user_preferences, préférences créées depuis
   * un autre appareil…). Retourne les préférences à jour, ou null.
   */
  const loadPrefs = useCallback(async (): Promise<PreferencesDto | null> => {
    try {
      const prof = await api<ProfileResponse>('/api/profile');
      setPrefs(prof.preferences);
      setDraftFilters(prof.preferences);
      if (prof.preferences) setMode(prof.preferences.modeDefault);
      setMyCountry((prev) => prev ?? prof.country);
      return prof.preferences;
    } catch {
      return null;
    }
  }, []);

  /**
   * Bascule de mode (libre, réversible — §4.3.4) : ne touche pas aux matchs.
   * CORRECTIF « le clic sur un mode ne fait rien » : l'ancien garde-fou
   * `if (!prefs) return;` quittait SILENCIEUSEMENT quand les préférences
   * n'étaient pas chargées (échec réseau au montage, compte sans ligne
   * user_preferences, cookie expiré entre-temps) — l'onglet paraissait mort.
   * Désormais : tentative de (re)chargement, création par défaut en dernier
   * recours (le PUT est un upsert), et feedback toast GARANTI en cas d'échec.
   */
  const switchMode = useCallback(
    async (next: DiscoveryMode, force = false) => {
      // Task 36 : force=true (deep-link d'un mode ≠ serveur) outrepasse le
      // garde « déjà sur ce mode » — l'état UI peut déjà y être (il est
      // initialisé depuis l'URL), pas le serveur.
      if (busy || (next === mode && !force)) return;
      setBusy(true);
      setError(null);
      try {
        let current = prefs;
        if (!current) current = await loadPrefs();
        if (current && current.modeDefault === next) {
          // Le serveur est déjà sur ce mode (autre appareil / reload) —
          // on s'aligne sans requête inutile.
          setMode(current.modeDefault);
          ownUrlUpdate.current = next; // le changement d'URL qui suit vient de nous
          onModeChange?.(next); // Task 36 : l'URL reflète le mode courant
          setIdx(0);
          setInbox(
            current.modeDefault === 'invisible'
              ? await api<InboxResponse>('/api/discover/inbox')
              : null,
          );
          setBusy(false);
          return;
        }
        const effective =
          current ?? {
            // Préférences vraiment absentes : valeurs neutres par défaut
            // (le PUT /api/profile/preferences est un upsert — la ligne est
            // créée). L'utilisateur pourra affiner dans Filtres.
            modeDefault: next,
            prefGender: 'everyone' as const,
            minAge: 18,
            maxAge: 99,
            distanceKm: 500,
            prefIntent: null,
          };
        if (!current) {
          setPrefs(effective);
          setDraftFilters(effective);
          toast('Préférences initialisées avec des valeurs neutres — ajuste-les dans Filtres.', 'info');
        }
        await api('/api/profile/preferences', {
          method: 'PUT',
          json: {
            modeDefault: next,
            prefGender: effective.prefGender,
            minAge: effective.minAge,
            maxAge: effective.maxAge,
            distanceKm: effective.distanceKm,
            prefIntent: effective.prefIntent ?? null,
          },
        });
        // Task 36 : l'état local reflète CE qui vient d'être persisté —
        // sans ça, prefs local reste sur l'ancien mode (cas deep-link :
        // l'auto-bascule PUT ne rechargait pas prefs) et un clic suivant
        // sur l'ancien mode passait par la branche « aligné » SANS PUT —
        // désalignement UI/serveur persistant (trouvé en recette E2E).
        setPrefs({ ...effective, modeDefault: next });
        setMode(next);
        ownUrlUpdate.current = next; // le changement d'URL qui suit vient de nous
        onModeChange?.(next); // Task 36 : l'URL reflète le mode courant
        setIdx(0);
        setInbox(next === 'invisible' ? await api<InboxResponse>('/api/discover/inbox') : null);
        await loadDeck(1, true);
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : 'Erreur inattendue.';
        setError(msg);
        toast(msg, 'error'); // feedback garanti (l'erreur historique reste rendue)
      }
      setBusy(false);
    },
    [prefs, mode, busy, loadDeck, loadPrefs, onModeChange],
  );

  // Task 36 (deep link #/discover/:mode) : au premier chargement des
  // préférences, si le serveur est sur un AUTRE mode que celui de l'URL,
  // on bascule réellement (PUT persistant + deck du bon bassin + inbox) —
  // exactement comme un clic sur l'onglet (logique Task 33, feedback
  // garanti). UNE SEULE fois : les PUT rapprochés sont rate-limités
  // (piège de recette Task 35) et ensuite c'est l'utilisateur qui décide.
  useEffect(() => {
    if (!initialMode || !prefs || deepLinkHandled.current) return;
    if (prefs.modeDefault !== initialMode) {
      deepLinkHandled.current = true;
      void switchMode(initialMode, true);
    }
  }, [prefs, initialMode, switchMode]);

  // Task 36 : édition MANUELLE de l'URL pendant que l'écran est monté
  // (ex. #/discover/invisible → #/discover/interracial dans la barre
  // d'adresse) → bascule réelle. Les changements d'URL déclenchés par
  // NOUS (onModeChange → replaceState) sont marqués ownUrlUpdate et
  // ignorés ici — pas de boucle, pas de double PUT.
  useEffect(() => {
    if (initialMode === prevUrlMode.current) return;
    prevUrlMode.current = initialMode;
    if (ownUrlUpdate.current) {
      const own = initialMode === ownUrlUpdate.current;
      ownUrlUpdate.current = null;
      if (own) return;
    }
    if (initialMode) void switchMode(initialMode, true);
  }, [initialMode, switchMode]);

  /** Filtres de base (âge, distance, genres, intention). */
  const applyFilters = useCallback(async () => {
    if (!draftFilters || busy) return;
    setBusy(true);
    setError(null);
    try {
      await api('/api/profile/preferences', {
        method: 'PUT',
        json: {
          modeDefault: mode,
          prefGender: draftFilters.prefGender,
          minAge: draftFilters.minAge,
          maxAge: draftFilters.maxAge,
          distanceKm: draftFilters.distanceKm,
          prefIntent: draftFilters.prefIntent ?? null,
        },
      });
      setPrefs(draftFilters);
      setShowFilters(false);
      setIdx(0);
      await loadDeck(1, true);
      showFlash('Filtres enregistrés.');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur inattendue.');
    }
    setBusy(false);
  }, [draftFilters, busy, mode, loadDeck, showFlash]);

  /** Répondre à une demande « Discuter » reçue. */
  const respondRequest = useCallback(async (reqId: string, accept: boolean) => {
    setBusy(true);
    setError(null);
    try {
      const res = await api<{ ok: true; status: 'accepted' | 'declined'; matched: boolean; matchId: string | null }>(
        `/api/discover/invisible-request/${reqId}/respond`,
        { json: { accept } },
      );
      setInbox((prev) =>
        prev
          ? {
              ...prev,
              received: prev.received.filter((r) => r.id !== reqId),
              sent: prev.sent.some((s) => s.id === reqId)
                ? prev.sent.map((s) => (s.id === reqId ? { ...s, status: res.status } : s))
                : prev.sent,
            }
          : prev,
      );
      if (res.matched) setMatchModal({ name: 'Une personne qui t’avait demandé de discuter', photo: null, country: null });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur inattendue.');
    }
    setBusy(false);
  }, []);

  /** Interracial : réordonne le deck — les autres continents d'abord. */
  const applyIntlFirst = useCallback(() => {
    setIntlFirst((v) => !v);
    setItems((prev) => {
      if (!myCountry) return prev;
      const my = countryMeta(myCountry)?.code ?? null;
      if (!my) return prev;
      const isIntl = (c: string | null) => (c && countryMeta(c)?.code !== my ? 0 : 1);
      return [...prev].sort((a, b) => isIntl(a.country) - isIntl(b.country));
    });
    setIdx(0);
  }, [myCountry]);

  /** Task 43 : tri « En ligne d'abord » — toggle local (LS) + retour en tête. */
  const toggleOnlineFirst = useCallback(() => {
    setOnlineFirst((v) => {
      const nv = !v;
      try {
        localStorage.setItem(ONLINE_FIRST_LS_KEY, nv ? '1' : '0');
      } catch {
        /* stockage indisponible — l'état reste en mémoire */
      }
      return nv;
    });
    setIdx(0);
  }, []);

  /* ── Raccourcis clavier (PC) : ← passe · → like · ↑ super · R rewind · Esc ferme ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) {
        return;
      }
      if (e.key === 'Escape') {
        if (detail) setDetail(null);
        else if (showNotif) setShowNotif(false);
        else if (showBoost) setShowBoost(false);
        else if (matchModal) setMatchModal(null);
        else if (showFilters) setShowFilters(false);
        else if (whyCulture) setWhyCulture(null); // Task 38 : modale Cultures
        return;
      }
      if (detail || showNotif || showBoost || matchModal || showFilters || whyCulture) return;
      if (isInvisible || !deck[idx]) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        void doSwipe('pass');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        void doSwipe('like');
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        void doSwipe('super');
      } else if (e.key === 'r' || e.key === 'R') {
        void doRewind();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isInvisible, deck, idx, matchModal, showFilters, showNotif, showBoost, detail, whyCulture, doSwipe, doRewind]);

  // --- Gestes tactiles (pointer events : touch + souris) — swipe X + Y ---
  const onPointerDown = (e: React.PointerEvent) => {
    if (isInvisible || busy || !deck[idx]) return;
    // Les clics (carrousel, boutons internes) restent des clics — pas de drag.
    if ((e.target as HTMLElement).closest('button, a')) return;
    dragRef.current = { x: e.clientX, y: e.clientY, active: true };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    setDrag({ x: e.clientX - dragRef.current.x, y: e.clientY - dragRef.current.y });
  };
  const onPointerUp = () => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    const d = drag;
    if (!d) return;
    // Seuil dépassé : le drag RESTE appliqué (pas de retour élastique) — la
    // carte s'envole depuis sa position actuelle via flyOut(), qui remettra
    // drag à zéro après l'animation.
    if (d.x > DISCOVERY.swipeThresholdPx) void doSwipe('like');
    else if (d.x < -DISCOVERY.swipeThresholdPx) void doSwipe('pass');
    else if (d.y < -DISCOVERY.swipeThresholdPx * 1.15) void doSwipe('super');
    else setDrag(null); // sous le seuil : retour élastique
  };

  const card = deck[idx] as FeedProfile | undefined;
  const nextCard = deck[idx + 1] as FeedProfile | undefined;
  const nextCard2 = deck[idx + 2] as FeedProfile | undefined;
  const hero = MODE_HEROES[mode];
  const myCode = myCountry ? (countryMeta(myCountry)?.code ?? null) : null;

  /* ── Boost (aperçu Wairyu+, offert) : compte à rebours local ── */
  const boostActive = boostUntil > now;
  const boostLeft = boostActive ? Math.max(1, Math.ceil((boostUntil - now) / 60_000)) : 0;
  const activateBoost = useCallback(() => {
    const until = Date.now() + BOOST_MS;
    try {
      localStorage.setItem(BOOST_LS_KEY, String(until));
    } catch {
      /* stockage indisponible — l'état reste en mémoire pour la session */
    }
    setBoostUntil(until);
    setNow(Date.now());
    setShowBoost(false);
    showFlash('⚡ Boost activé — ton profil est mis en avant pendant 30 minutes.');
  }, [showFlash]);

  useEffect(() => {
    if (boostUntil <= Date.now()) return;
    const id = window.setInterval(() => {
      setNow(Date.now());
      if (Date.now() >= boostUntil) {
        setBoostUntil(0);
        try {
          localStorage.removeItem(BOOST_LS_KEY);
        } catch {
          /* idem */
        }
        showFlash('⚡ Boost terminé — ton profil est de retour à la normale.');
      }
    }, 30_000);
    return () => window.clearInterval(id);
  }, [boostUntil, showFlash]);

  /* ── Cloche Notifications : likes/supers reçus, matchs récents, demandes ── */
  const newMatches = useMemo(
    () => (matchesData?.matches ?? []).filter((m) => m.createdAt * 1000 > Date.now() - 7 * 86_400_000),
    [matchesData],
  );
  const supersReceived = useMemo(() => (likes?.items ?? []).filter((l) => l.action === 'super'), [likes]);
  const notifCount =
    (likes?.count ?? 0) + newMatches.length + (isInvisible ? inbox?.received.length ?? 0 : 0);

  /* ── Task 32 — Révélations & Coach (réf. Invisible §4.3/§4.4) ──
     Conversations Invisible depuis le cache matchs (déjà chargé pour la
     cloche) : photoBlurred=false ⟺ photos révélées (doc MatchDto). */
  const invConversations = useMemo(
    () => (matchesData?.matches ?? []).filter((m) => m.conversationMode === 'invisible'),
    [matchesData],
  );
  const invRevealed = invConversations.filter((m) => !m.other.photoBlurred).length;
  const invPendingRequests = inbox?.sent.filter((s) => s.status === 'pending').length ?? 0;
  /** Icebreaker du Coach — RÉEL : premier sujet de conversation du feed. */
  const coachIcebreaker = useMemo(() => {
    const withStarters = items.find((p) => p.matchReasons?.conversationStarters.length);
    if (withStarters) return withStarters.matchReasons!.conversationStarters[0]!;
    const withHl = items.find((p) => p.highlights.length > 0);
    if (withHl) return withHl.highlights[0]!;
    return 'Repère un détail de son profil et pose une question précise — les questions précises obtiennent deux fois plus de réponses.';
  }, [items]);
  const coachSay = useCallback((msg: string) => toast(msg, 'info'), []);

  /**
   * Task 38 (réf. Cultures §5.4) : ouvre la modale « Pourquoi ce match
   * culturel ? » — le contenu vient de matchReasons (serveur, réel).
   */
  const openWhyCulture = useCallback((p: FeedProfile) => setWhyCulture(p), []);

  /** Task 38 : sujet suggéré cliquable — copié dans le presse-papiers. */
  const copySujet = useCallback((s: string) => {
    try {
      void navigator.clipboard?.writeText(s);
    } catch {
      /* presse-papiers indisponible — le toast reste utile tel quel */
    }
    toast('Sujet copié — lance la conversation avec ça !', 'info');
  }, []);

  /** Chips géo intercontinentales (mode Interracial). */
  const renderGeoChips = (p: FeedProfile) => {
    if (mode !== 'interracial') return null;
    const meta = countryMeta(p.country);
    const chips: JSX.Element[] = [];
    if (meta) {
      chips.push(
        <span key="cont" className="chip chip-continent" title="Continent">
          {meta.flag} {meta.continent}
        </span>,
      );
      if (myCode && meta.code !== myCode) {
        chips.push(
          <span key="intl" className="chip chip-intl" title="Vous êtes sur deux continents différents">
            ✈️ Intercontinentale
          </span>,
        );
      } else if (myCode && meta.code === myCode) {
        chips.push(
          <span key="same" className="chip chip-samecountry">
            🏳️ Même pays
          </span>,
        );
      }
    }
    if (p.distanceKm !== null) {
      chips.push(
        <span key="dist" className="chip chip-dist" title="Distance à vol d'oiseau — indicative">
          📍 {formatKm(p.distanceKm)} km
        </span>,
      );
    }
    return chips.length > 0 ? <div className="geo-chips">{chips}</div> : null;
  };

  // --- Rendu d'une carte (partagé deck classique / liste invisible) ---
  const renderCardBody = (p: FeedProfile, hideHeader = false) => (
    <>
      {!hideHeader && (
        <div className="feed-top">
          <h3>
            {p.displayName}, {p.age}
          </h3>
          {p.verified && (
            <span className="chip chip-verified" title="Selfie reviewé par l'équipe wairyu">
              ✓ Vérifié·e
            </span>
          )}
          {p.score !== null && (
            <span className="score-badge" title="Indicatif — jamais prédictif">
              {p.score}
              <small>/100</small>
            </span>
          )}
        </div>
      )}
      {hideHeader && p.score !== null && (
        <div className="feed-top">
          <span className="score-badge" title="Indicatif — jamais prédictif">
            {p.score}
            <small>/100</small>
          </span>
          {p.online && <span className={`chip-ov body-online ${p.online}`}><span className="dot-on" />{ONLINE_LABELS[p.online]}</span>}
        </div>
      )}
      <p className="feed-loc">
        {[p.city, p.country].filter(Boolean).join(', ') || 'Localisation non renseignée'}
        {p.photoBlurred && p.showMode ? ' · profil Invisible' : ''}
      </p>
      {p.personalityType && (
        <div className="pers-row">
          <span
            className={`chip chip-pers ${p.personalityValidated ? 'ok' : ''}`}
            title={p.personalityValidated ? 'Personnalité validée par son auteur' : 'Personnalité proposée — pas encore validée'}
          >
            ✨ {ARCHETYPES[p.personalityType].name}
            {p.personalityValidated ? ' ✓' : ''}
          </span>
          {p.personalityAffinity && (
            <span className={`chip chip-aff ${p.personalityAffinity}`} title="Affinité de personnalité — indicatif">
              {AFFINITY_LABELS[p.personalityAffinity]}
            </span>
          )}
          {p.personalitySought && (
            <span className="chip chip-sought" title="Type de personnalité que tu as sélectionné">
              Type recherché ✓
            </span>
          )}
        </div>
      )}
      {renderGeoChips(p)}
      {/* Task 38 (réf. Cultures §4.2) : chips VALEURS ambre — tirées des
          extraits partagés RÉELS (highlights du questionnaire commun),
          même mécanique que les chips violettes du mode Invisible. */}
      {isIntl && p.highlights.length > 0 && (
        <div className="intl-values">
          {p.highlights.slice(0, 3).map((h, i) => (
            <span key={i} className="intl-value">
              ✓ {highlightChip(h)}
            </span>
          ))}
        </div>
      )}
      {p.bio && <p className="feed-bio">{p.bio}</p>}
      <span className="chip">{LABELS.intent[p.intent] ?? 'Rencontres'}</span>
      {/* Task 43 : ACCROCHE SUGGÉRÉE — premier sujet de conversation RÉEL du
          serveur (matchReasons.conversationStarters) ; un clic le copie dans
          le presse-papiers. Classique/Interracial (l'Invisible a ses extraits
          violets). stopPropagation : le corps de carte ouvre le détail. */}
      {!isInvisible && p.matchReasons && p.matchReasons.conversationStarters.length > 0 && (
        <button
          type="button"
          className="icebreaker-chip"
          onClick={(e) => {
            e.stopPropagation();
            copySujet(p.matchReasons!.conversationStarters[0]!);
          }}
          title="Copier cette accroche — tirée de vos points communs réels"
        >
          <em aria-hidden="true">💬</em>
          <span>« {truncateTxt(p.matchReasons.conversationStarters[0]!, 74)} »</span>
          <small>copier</small>
        </button>
      )}
      {p.prompts.map((pr, i) => (
        <p key={i} className="feed-prompt">
          <strong>{pr.question}</strong>
          <br />
          {pr.answer}
        </p>
      ))}
      {p.highlights.length > 0 && (
        <div className="hl-quotes">
          {p.highlights.map((h, i) => (
            <p key={i} className="hl-quote">
              {h}
            </p>
          ))}
        </div>
      )}
      {p.matchReasons && (
        <>
          <button
            type="button"
            className="btn ghost why-toggle"
            onClick={(e) => {
              e.stopPropagation(); // le corps de carte ouvre le détail — pas ce bouton
              setOpenWhy((v) => (v === p.userId ? null : p.userId));
            }}
          >
            {openWhy === p.userId ? 'Masquer' : 'Pourquoi ce match ?'}
          </button>
          {openWhy === p.userId && (
            <div className="why-box" onClick={(e) => e.stopPropagation()}>
              <strong>Points forts</strong>
              <ul>
                {p.matchReasons.forces.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
              <strong>À garder en tête</strong>
              <p>{p.matchReasons.vigilance}</p>
              <strong>Sujets de conversation</strong>
              <ul>
                {p.matchReasons.conversationStarters.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </>
  );

  return (
    <div className="app discover">
      <header className="wizard-head plain">
        <div className="head-brand">
          <span className="head-logo" aria-hidden="true">w</span>
          <h1>Découvrir</h1>
        </div>
        <div className="head-actions">
          <button
            type="button"
            className="head-bell head-filter"
            aria-label="Filtres de découverte"
            title="Filtres — âge, distance, intentions"
            onClick={() => setShowFilters(true)}
          >
            <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              <circle cx="9" cy="7" r="2.4" fill="currentColor" />
              <circle cx="15" cy="12" r="2.4" fill="currentColor" />
              <circle cx="7" cy="17" r="2.4" fill="currentColor" />
            </svg>
          </button>
          <button
            type="button"
            className="head-bell"
            aria-label={`Notifications${notifCount > 0 ? ` (${notifCount})` : ''}`}
            title={notifCount > 0 ? `${notifCount} nouveauté${notifCount > 1 ? 's' : ''}` : 'Aucune nouveauté'}
            onClick={() => setShowNotif(true)}
          >
            🔔
            {notifCount > 0 && <span className="tabbar-badge">{notifCount > 9 ? '9+' : notifCount}</span>}
          </button>
          <button type="button" className="btn ghost matches-link" onClick={onMatches}>
            Mes matchs
          </button>
        </div>
      </header>

      {/* Onglets de mode — libre, réversible, transparent (§4.3.4) */}
      <div className={`mode-tabs mode-${mode}`} role="tablist">
        {MODE_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={mode === t.id}
            className={`mode-tab ${mode === t.id ? 'active' : ''}`}
            disabled={busy}
            onClick={() => void switchMode(t.id)}
            title={t.hint}
          >
            <span className="mode-tab-icon" aria-hidden="true">
              {t.icon}
            </span>
            {t.label}
          </button>
        ))}
        {/* Task 40 — 4e pastille : l'univers événementiel « Wairyu Moments ».
            Jamais « active » ici (ce n'est pas un mode de découverte) : le clic
            ouvre #/events — la nav turquoise prend le relais (Task 39). */}
        <button
          type="button"
          role="tab"
          aria-selected={false}
          className="mode-tab moments-entry"
          onClick={onMoments}
          title="Événements réels près de toi — billetterie, souvenirs, Missed Connections."
        >
          <span className="mode-tab-icon" aria-hidden="true">
            📅
          </span>
          Moments
        </button>
      </div>

      {/* Bannière d'ambiance — une identité par mode */}
      <section className={`mode-hero hero-${mode}`}>
        <h2>{hero.title}</h2>
        <p>{hero.sub}</p>
        <div className="hero-chips">
          {hero.chips.map((c) => (
            <span key={c} className="chip-hero">
              {c}
            </span>
          ))}
        </div>
      </section>

      {isInvisible && <InvisibleSteps />}

      {/* Barre de quotas + filtres */}
      <div className="quota-row">
        <span className="quota-chip" title="Likes restants aujourd'hui">
          ♥ {quota?.likesLeft ?? '–'}/{DISCOVERY.likesPerDay}
          {/* Task 43 : mini-jauge de quota — reste/jour, données réelles. */}
          <i className="quota-bar" aria-hidden="true">
            <b style={{ width: `${Math.max(0, Math.min(100, ((quota?.likesLeft ?? 0) / DISCOVERY.likesPerDay) * 100))}%` }} />
          </i>
        </span>
        <span className="quota-chip" title="Super Likes restants">✶ {quota?.supersLeft ?? '–'}/{DISCOVERY.superLikesPerDay}</span>
        <span className="quota-chip" title="Demandes « Discuter » restantes">✉ {quota?.invisibleLeft ?? '–'}/{DISCOVERY.invisibleRequestsPerDay}</span>
        <span className="quota-chip" title="Rewinds restants">↺ {quota?.rewindsLeft ?? '–'}/{DISCOVERY.rewindsPerDay}</span>
        <button type="button" className="btn ghost small" onClick={() => setShowFilters((v) => !v)}>
          Filtres
        </button>
        {/* Task 43 : tri local « En ligne d'abord » — classique uniquement
            (buckets présence réels ; même esprit que le tri Cultures). */}
        {mode === 'classic' && (
          <button
            type="button"
            className={`chip intl-toggle online-toggle ${onlineFirst ? 'on' : ''}`}
            onClick={toggleOnlineFirst}
            title="Tri local : les profils actifs récemment remontent dans ta pile"
          >
            ⏱️ En ligne d’abord {onlineFirst ? '✓' : ''}
          </button>
        )}
        {mode === 'interracial' && (
          <button
            type="button"
            className={`chip intl-toggle ${intlFirst ? 'on' : ''}`}
            onClick={applyIntlFirst}
            title="Réordonne la pile : les profils d'autres continents remontent"
          >
            🌍 D’abord les autres continents {intlFirst ? '✓' : ''}
          </button>
        )}
      </div>

      {showFilters && draftFilters && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowFilters(false);
          }}
        >
          <div className="modal-card" role="dialog" aria-modal="true" aria-label="Filtres de découverte">
            <div className="modal-head">
              <h2>Filtres</h2>
              <button type="button" className="modal-close" aria-label="Fermer" onClick={() => setShowFilters(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="filter-grid">
                <label className="filter-slider">
                  <span>
                    Âge min : <strong>{draftFilters.minAge} ans</strong>
                  </span>
                  <input
                    type="range" min={18} max={98} value={draftFilters.minAge}
                    onChange={(e) =>
                      setDraftFilters({ ...draftFilters, minAge: Math.min(Number(e.target.value) || 18, draftFilters.maxAge - 1) })
                    }
                  />
                </label>
                <label className="filter-slider">
                  <span>
                    Âge max : <strong>{draftFilters.maxAge} ans</strong>
                  </span>
                  <input
                    type="range" min={19} max={99} value={draftFilters.maxAge}
                    onChange={(e) =>
                      setDraftFilters({ ...draftFilters, maxAge: Math.max(Number(e.target.value) || 99, draftFilters.minAge + 1) })
                    }
                  />
                </label>
                <label className="filter-slider">
                  <span>
                    Distance : <strong>{draftFilters.distanceKm} km</strong>
                    {mode === 'interracial' && <em> — non appliquée en Interracial (portée mondiale)</em>}
                  </span>
                  <input
                    type="range" min={1} max={500} value={draftFilters.distanceKm}
                    disabled={mode === 'interracial'}
                    onChange={(e) => setDraftFilters({ ...draftFilters, distanceKm: Number(e.target.value) })}
                  />
                </label>
              </div>

              {/* Task 32 (réf. Invisible §5.6) + Task 38 (réf. Cultures §5.7) :
                  score minimum — filtre LOCAL instantané (comme « vérifiés
                  uniquement »). Invisible ET Cultures (score culturel), le
                  libellé s'adapte au mode. */}
              {(isInvisible || isIntl) && (
                <div className="filter-chips inv-filter-score">
                  <p className="filter-label">{isIntl ? '🌍 Score culturel minimum' : 'Score minimum'}</p>
                  <label className="filter-slider">
                    <span>
                      <strong>{minScore === 0 ? 'Désactivé' : `${minScore}/100`}</strong>
                      {minScore === 0 ? ' — tous les profils' : ' — au-dessus du seuil seulement'}
                    </span>
                    <input
                      type="range" min={0} max={100} step={5} value={minScore}
                      onChange={(e) => {
                        const v = Number(e.target.value) || 0;
                        setMinScore(v);
                        try {
                          localStorage.setItem(MIN_SCORE_LS_KEY, String(v));
                        } catch {
                          /* stockage indisponible — l'état reste en mémoire */
                        }
                      }}
                    />
                  </label>
                  <p className="hint">
                    Filtre local — instantané sur la pile chargée. Les profils sans score restent visibles.
                  </p>
                </div>
              )}

              {/* Task 38 (réf. Cultures §5.7) : filtre CONTINENTS — chips
                  multi-sélection, local et instantané, interracial only. */}
              {isIntl && (
                <div className="filter-chips intl-conts">
                  <p className="filter-label">Continents</p>
                  {INTL_CONTINENTS.map((c) => {
                    const on = intlContinents.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        className={`chip filter-chip ${on ? 'on' : ''}`}
                        onClick={() => {
                          const nv = on ? intlContinents.filter((x) => x !== c) : [...intlContinents, c];
                          setIntlContinents(nv);
                          try {
                            localStorage.setItem(CONTINENTS_LS_KEY, JSON.stringify(nv));
                          } catch {
                            /* stockage indisponible — l'état reste en mémoire */
                          }
                          setIdx(0);
                        }}
                      >
                        {c} {on ? '✓' : ''}
                      </button>
                    );
                  })}
                  <p className="hint">
                    Filtre local — instantané sur la pile chargée. Aucune sélection = tous les continents.
                    Les profils sans pays connu restent visibles.
                  </p>
                </div>
              )}

              <div className="filter-chips">
                <p className="filter-label">Montre-moi</p>
                {([['everyone', 'Tout le monde'], ['women', 'Des femmes'], ['men', 'Des hommes']] as const).map(([v, l]) => (
                  <button
                    key={v}
                    type="button"
                    className={`chip filter-chip ${draftFilters.prefGender === v ? 'on' : ''}`}
                    onClick={() => setDraftFilters({ ...draftFilters, prefGender: v })}
                  >
                    {l}
                  </button>
                ))}
              </div>

              <div className="filter-chips">
                <p className="filter-label">Intention</p>
                <button
                  type="button"
                  className={`chip filter-chip ${!draftFilters.prefIntent ? 'on' : ''}`}
                  onClick={() => setDraftFilters({ ...draftFilters, prefIntent: null })}
                >
                  Toutes
                </button>
                {Object.entries(LABELS.intent).map(([k, v]) => (
                  <button
                    key={k}
                    type="button"
                    className={`chip filter-chip ${draftFilters.prefIntent === k ? 'on' : ''}`}
                    onClick={() => setDraftFilters({ ...draftFilters, prefIntent: k as PreferencesDto['prefIntent'] })}
                  >
                    {v}
                  </button>
                ))}
              </div>

              <div className="filter-switch-row">
                <div>
                  <p className="filter-label">✓ Profils vérifiés uniquement</p>
                  <p className="hint">S'applique instantanément à la pile chargée.</p>
                </div>
                <button
                  type="button"
                  className={`switch ${verifiedOnly ? 'on' : ''}`}
                  role="switch"
                  aria-checked={verifiedOnly}
                  onClick={() => {
                    const nv = !verifiedOnly;
                    setVerifiedOnly(nv);
                    try {
                      localStorage.setItem(VERIFIED_LS_KEY, nv ? '1' : '0');
                    } catch {
                      /* idem */
                    }
                    setIdx(0);
                  }}
                >
                  <span className="knob" />
                </button>
              </div>
            </div>
            <div className="modal-foot">
              <button type="button" className="btn ghost" onClick={() => setShowFilters(false)}>
                Annuler
              </button>
              <button type="button" className="btn primary" disabled={busy} onClick={() => void applyFilters()}>
                Appliquer
              </button>
            </div>
          </div>
        </div>
      )}

      {error && <p className="error">{error}</p>}
      {flash && <p className="flash-msg">{flash}</p>}

      {/* ── PILE CLASSIQUE / INTERRACIAL ── */}
      {!isInvisible && (
        <div className="deck-zone">
          {/* Task 43 : progression de la pile — compteurs RÉELS (vues de
              session / restants), sous la jauge, sans aucune invention. */}
          {!loading && deck.length > 0 && (
            <div className="deck-progress">
              <div className="dp-track">
                <b style={{ width: `${Math.min(100, Math.round((seen / Math.max(1, seen + deck.length)) * 100))}%` }} />
              </div>
              <span className="dp-caption">
                {seen > 0 ? `${seen} vue${seen > 1 ? 's' : ''} · ` : ''}
                {deck.length} profil{deck.length > 1 ? 's' : ''} à découvrir
              </span>
            </div>
          )}
          {loading && items.length === 0 && (
            <>
              <p className="status">
                <span className="dot" /> Recherche de profils compatibles…
              </p>
              {/* Task 43 : squelettes shimmer — le chargement se VOIT. */}
              <div className="deck-skeleton" aria-hidden="true">
                <div className="sk-card sk-back" />
                <div className="sk-card sk-front">
                  <div className="sk-media" />
                  <div className="sk-lines">
                    <span className="sk-line w70" />
                    <span className="sk-line w45" />
                    <span className="sk-line w60" />
                  </div>
                </div>
              </div>
            </>
          )}
          {!loading && !card && (
            <div className="deck-empty">
              <span className="deck-empty-emoji" aria-hidden="true">🌙</span>
              <p className="q-done-note">
                Plus personne dans ta pile pour l’instant. Élargis tes filtres — ou reviens demain :
                de nouvelles personnes rejoignent wairyu chaque jour.
              </p>
              <div className="btn-row">
                <button type="button" className="btn ghost" onClick={() => void loadAround()}>
                  Recharger
                </button>
                <button type="button" className="btn primary" onClick={() => setShowFilters(true)}>
                  Élargir mes filtres
                </button>
              </div>
            </div>
          )}
          {nextCard2 && (
            <div className="deck-card behind behind-2" aria-hidden="true">
              {nextCard2.photoUrl ? (
                <div className={`feed-photo ${nextCard2.photoBlurred ? 'blurred' : ''}`}>
                  <img src={nextCard2.photoUrl} alt="" loading="lazy" draggable={false} />
                </div>
              ) : (
                <div className="feed-photo empty"><span>✨</span></div>
              )}
              <div className="feed-body">
                <h3>{nextCard2.displayName}</h3>
              </div>
            </div>
          )}
          {nextCard && (
            <div className="deck-card behind behind-1" aria-hidden="true">
              {nextCard.photoUrl ? (
                <div className={`feed-photo ${nextCard.photoBlurred ? 'blurred' : ''}`}>
                  <img src={nextCard.photoUrl} alt="" loading="lazy" draggable={false} />
                </div>
              ) : (
                <div className="feed-photo empty"><span>✨</span></div>
              )}
              <div className="feed-body">
                <h3>{nextCard.displayName}</h3>
              </div>
            </div>
          )}
          {card && (
            <article
              className={`deck-card ${exit ? `exit-${exit}` : ''}`}
              style={
                drag && !exit
                  ? {
                      transform: `translate(${drag.x}px, ${drag.y}px) rotate(${drag.x * 0.06}deg)`,
                      transition: 'none',
                    }
                  : undefined
              }
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
            >
              <span className={`stamp stamp-like ${drag && drag.x > 40 ? 'on' : ''}`}>LIKE</span>
              <span className={`stamp stamp-pass ${drag && drag.x < -40 ? 'on' : ''}`}>NOPE</span>
              <span className={`stamp stamp-super ${drag && drag.y < -60 ? 'on' : ''}`}>SUPER</span>
              {/* Task 43 : burst à l'envol — confirmation visuelle du geste
                  (like / super) au moment où la carte quitte la pile. */}
              {exit === 'right' && <span className="swipe-burst like" aria-hidden="true">♥</span>}
              {exit === 'up' && <span className="swipe-burst super" aria-hidden="true">✶</span>}
              {/* Task 38 : en Cultures, la photo porte drapeaux + score culturel cliquable. */}
              <CardCarousel p={card} culture={isIntl} onScore={isIntl ? openWhyCulture : undefined} />
              <div className="feed-body clickable" onClick={() => setDetail(card)} title="Voir le profil complet">
                {renderCardBody(card, !!card.photoUrl && !card.photoBlurred)}
              </div>
            </article>
          )}
          {card && (
            <>
              <div className="deck-actions">
                <button
                  type="button" className="deck-btn rewind" aria-label="Annuler la dernière action"
                  disabled={busy || (quota?.rewindsLeft ?? 0) < 1}
                  onClick={() => void doRewind()}
                  title={(quota?.rewindsLeft ?? 0) < 1 ? 'Rewind déjà utilisé aujourd’hui' : 'Annuler la dernière action'}
                >
                  ↺
                </button>
                <button
                  type="button" className="deck-btn pass" aria-label="Passer"
                  disabled={busy} onClick={() => void doSwipe('pass')}
                >
                  ✕
                </button>
                <button
                  type="button" className="deck-btn super" aria-label="Super Like"
                  disabled={busy || (quota?.supersLeft ?? 0) < 1}
                  onClick={() => void doSwipe('super')}
                  title="Super Like — 1 par jour, il le saura immédiatement"
                >
                  ✶
                </button>
                <button
                  type="button" className="deck-btn like" aria-label="Liker"
                  disabled={busy || (quota?.likesLeft ?? 0) < 1}
                  onClick={() => void doSwipe('like')}
                >
                  ♥
                  {/* Task 38 (réf. Cultures §4.2) : le like mène à la discussion —
                      en Cultures, le bouton central devient la grande pilule
                      dégradée chaude avec son étiquette (comme « Discuter »
                      de la référence). */}
                  {isIntl && <span className="deck-btn-label">Liker</span>}
                </button>
                <button
                  type="button" className={`deck-btn boost ${boostActive ? 'active' : ''}`} aria-label="Boost"
                  onClick={() => setShowBoost(true)}
                  title={boostActive ? `Boost actif — ${boostLeft} min restantes` : 'Boost — mets ton profil en avant (offert)'}
                >
                  ⚡
                </button>
              </div>
              <div className="kbd-hints" aria-hidden="true">
                <span><kbd>←</kbd> passer</span>
                <span><kbd>→</kbd> liker</span>
                <span><kbd>↑</kbd> super</span>
                <span><kbd>R</kbd> annuler</span>
              </div>
            </>
          )}
        </div>
      )}


      {/* « Tu plais ! » — likes reçus en attente (gratuit, éthique : la
          personne ne sait pas que tu vois cette liste tant que tu réponds) */}
      {likes && likes.count > 0 && (
        <section className="likes-section">
          <h2 className="section-title">
            🔥 Tu plais ! <span className="likes-count">{likes.count}</span>
            <a className="see-all" href="#/likes" title="Tous tes likes reçus">
              Voir tout →
            </a>
          </h2>
          <div className="likes-strip">
            {likes.items.map((l) => (
              <article key={l.userId} className="likes-card">
                {l.action === 'super' && <span className="likes-super" title="Super Like reçu">✶</span>}
                {l.photoUrl ? (
                  <img src={l.photoUrl} alt={l.displayName} className={l.photoBlurred ? 'blurred' : ''} loading="lazy" />
                ) : (
                  <span className="top-avatar">✨</span>
                )}
                <strong>
                  {l.displayName}, {l.age}
                </strong>
                <em>
                  {countryMeta(l.country)?.flag ?? '📍'} {[l.city, l.country].filter(Boolean).join(', ') || 'Lieu inconnu'}
                </em>
                {l.personalityType && (
                  <span className="chip chip-pers">
                    ✨ {ARCHETYPES[l.personalityType].name}
                    {l.personalityValidated ? ' ✓' : ''}
                  </span>
                )}
                <div className="btn-row">
                  {isInvisible ? (
                    <button
                      type="button" className="btn primary small" disabled={busy}
                      onClick={() => void doRequest({ id: l.userId, photo: l.photoUrl, name: l.displayName })}
                      title="Envoi une demande « Discuter » — acceptation = conversation"
                    >
                      ✉ Discuter
                    </button>
                  ) : (
                    <button
                      type="button" className="btn primary small" disabled={busy}
                      onClick={() => void doSwipe('like', { id: l.userId, photo: l.photoUrl, name: l.displayName, country: l.country })}
                      title="Elle t'a déjà liké — match immédiat"
                    >
                      ♥ En retour
                    </button>
                  )}
                  <button
                    type="button" className="btn ghost small" disabled={busy}
                    onClick={() => void doSwipe('pass', { id: l.userId, photo: l.photoUrl, name: l.displayName })}
                    title="Passer — discret, elle ne sera jamais notifiée"
                  >
                    ✕
                  </button>
                </div>
              </article>
            ))}
          </div>
          <p className="hint">{likes.note}</p>
        </section>
      )}

      {/* Top Compatibilité du jour (cron, hors quota) */}
      {top && top.items.length > 0 && (
        <section className="top-section">
          <h2 className="section-title">Top compatibilité du jour</h2>
          <div className="top-strip">
            {top.items.map((t) => {
              const tGeo = mode === 'interracial' ? countryMeta(t.country) : null;
              return (
                <article key={t.userId} className="top-card">
                  {t.photoUrl ? (
                    <img src={t.photoUrl} alt={t.displayName} className={t.photoBlurred ? 'blurred' : ''} loading="lazy" />
                  ) : (
                    <span className="top-avatar">✨</span>
                  )}
                  <strong>
                    {tGeo ? `${tGeo.flag} ` : ''}
                    {t.displayName}
                  </strong>
                  {t.score !== null && <em>{t.score}/100</em>}
                  {isInvisible ? (
                    <button type="button" className="btn primary small" disabled={busy} onClick={() => void doRequest({ id: t.userId, photo: t.photoUrl, name: t.displayName })}>
                      Discuter
                    </button>
                  ) : (
                    <button type="button" className="btn primary small" disabled={busy} onClick={() => void doSwipe('like', { id: t.userId, photo: t.photoUrl, name: t.displayName })}>
                      ♥ Liker
                    </button>
                  )}
                </article>
              );
            })}
          </div>
          <p className="hint">{top.note}</p>
        </section>
      )}

      {/* Boîte de réception — demandes « Discuter » reçues (Invisible) */}
      {isInvisible && inbox && inbox.received.length > 0 && (
        <section className="inbox-section">
          <h2 className="section-title">
            Demandes de discussion <span className="likes-count">{inbox.received.length}</span>
          </h2>
          {inbox.received.map((r) => (
            <article key={r.id} className="inbox-card">
              {r.photoUrl && (
                <img src={r.photoUrl} alt={r.fromName} className={`inbox-photo ${r.photoBlurred ? 'blurred' : ''}`} loading="lazy" />
              )}
              <div className="inbox-body">
                <strong>{r.fromName}</strong>
                {r.personalityType && (
                  <span className="chip chip-pers">
                    ✨ {ARCHETYPES[r.personalityType].name}
                    {r.personalityValidated ? ' ✓' : ''}
                  </span>
                )}
                <p>aimerait discuter avec toi.</p>
                <div className="btn-row">
                  <button type="button" className="btn primary" disabled={busy} onClick={() => void respondRequest(r.id, true)}>
                    Accepter
                  </button>
                  <button type="button" className="btn ghost" disabled={busy} onClick={() => void respondRequest(r.id, false)}>
                    Passer
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {/* ── EXPLORER / DISCUTER (INVISIBLE) ── */}
      {isInvisible && (
        <div className="inv-list">
          {loading && items.length === 0 && (
            <p className="status"><span className="dot" /> Exploration des personnalités…</p>
          )}
          {!loading && items.length === 0 && (
            <p className="q-done-note">
              Aucun profil à explorer pour l’instant. Élargis tes filtres, ou reviens plus tard —
              le Mode Invisible se nourrit des nouvelles inscriptions.
            </p>
          )}
          {items.map((p) => (
            <article key={p.userId} className="feed-card inv-card">
              <CardCarousel p={p} />
              {/* Task 32 (réf. Invisible §4.2) : badge Score flottant sur la
                  photo floutée — clic → « Pourquoi ce match ? ». Aucun drag
                  ici (liste), pas de filtre d'exclusion nécessaire. */}
              {p.score !== null && (
                <button
                  type="button" className="inv-score"
                  onClick={() => setOpenWhy((v) => (v === p.userId ? null : p.userId))}
                  title="Pourquoi ce score ? — indicatif, jamais prédictif"
                >
                  <strong>{p.score}</strong>
                  <small>Score</small>
                </button>
              )}
              <div className="feed-body">
                {renderCardBody(p, !!p.photoUrl && !p.photoBlurred)}
                {/* Task 32 (réf. Invisible §4.2/§10) : VALEURS en chips
                    violettes avec coche — tirées des extraits partagés RÉELS
                    (highlights du questionnaire commun). */}
                {p.highlights.length > 0 && (
                  <div className="inv-values">
                    {p.highlights.slice(0, 3).map((h, i) => (
                      <span key={i} className="inv-value">
                        ✓ {highlightChip(h)}
                      </span>
                    ))}
                  </div>
                )}
                <RitualRow />
                {/* Task 32 (réf. Invisible §4.2) : barre d'actions à 3 boutons —
                    Passer (rouge) / Demander à discuter (large, violet) /
                    Liker (vert — like mutuel = match, §6.2.4). Les deux
                    boutons latéraux sont un AJOUT ; le bouton central et sa
                    logique de handshake existants sont inchangés. */}
                <div className="btn-row inv-actions">
                  <button
                    type="button" className="inv-mini pass" aria-label="Passer"
                    disabled={busy}
                    onClick={() => void doSwipe('pass', { id: p.userId, photo: p.photoUrl, name: p.displayName })}
                    title="Passer — discret, elle ne sera jamais notifiée"
                  >
                    ✕
                  </button>
                  <button
                    type="button" className="btn primary discuss"
                    disabled={busy || (quota?.invisibleLeft ?? 0) < 1}
                    onClick={() => void doRequest({ id: p.userId, photo: p.photoUrl, name: p.displayName })}
                    title="La personne recevra ta demande et pourra accepter ou passer"
                  >
                    ✉ Demander à discuter
                  </button>
                  <button
                    type="button" className="inv-mini like" aria-label="Liker"
                    disabled={busy || (quota?.likesLeft ?? 0) < 1}
                    onClick={() => void doSwipe('like', { id: p.userId, photo: p.photoUrl, name: p.displayName })}
                    title="Liker — si elle like aussi, match immédiat"
                  >
                    ♥
                  </button>
                </div>
                <span className="hint">Explorer est libre — aucune décision forcée.</span>
              </div>
            </article>
          ))}
          {inbox && inbox.sent.length > 0 && (
            <section className="sent-section">
              <h2 className="section-title">Mes demandes envoyées</h2>
              {inbox.sent.map((s) => (
                <div key={s.id} className="sent-row">
                  <strong>{s.toName}</strong>
                  <span className={`chip chip-status ${s.status}`}>
                    {s.status === 'pending' ? 'En attente' : s.status === 'accepted' ? 'Acceptée ✓' : 'Déclinée'}
                  </span>
                </div>
              ))}
            </section>
          )}
        </div>
      )}

      {/* ── RÉVÉLATIONS (INVISIBLE — Task 32, réf. §4.3) ──
          Suivi du dévoilement avec les données RÉELLES du cache matchs :
          une conversation Invisible « révélée » = photo servie nette
          (photoBlurred false, doc MatchDto). Le rituel complet (15 messages,
          consentement) se vit dans le chat — ici, la vue d'ensemble. */}
      {isInvisible && invConversations.length > 0 && (
        <section className="reveal-section">
          <h2 className="section-title">🔓 Révélations</h2>
          <p className="hint">Le rituel : 15 messages · 7 jours · accord mutuel — suis tes dévoilements ici.</p>
          <div className="reveal-stats">
            <div className="reveal-stat">
              <strong>{invRevealed}</strong>
              <span>🔓 Révélées</span>
            </div>
            <div className="reveal-stat">
              <strong>{invConversations.length - invRevealed}</strong>
              <span>🕯️ En cours</span>
            </div>
            <div className="reveal-stat">
              <strong>{invPendingRequests}</strong>
              <span>✉ En attente</span>
            </div>
          </div>
          <div className="reveal-list">
            {invConversations.map((m) => {
              const day = ritualDay(m.createdAt);
              const pct = Math.min(100, Math.round((day / 7) * 100));
              return (
                <article key={m.matchId} className={`reveal-item ${m.other.photoBlurred ? '' : 'revealed'}`}>
                  {m.other.photoUrl ? (
                    <img
                      src={m.other.photoUrl}
                      alt={m.other.displayName}
                      className={m.other.photoBlurred ? 'blurred' : ''}
                      loading="lazy"
                    />
                  ) : (
                    <span className="reveal-avatar" aria-hidden="true">✨</span>
                  )}
                  <div className="reveal-body">
                    <strong>
                      {m.other.displayName}
                      {m.other.verified && <span className="rv-check" title="Identité vérifiée"> ✓</span>}
                    </strong>
                    <em>
                      {m.other.photoBlurred
                        ? `Jour ${day} du rituel`
                        : `Révélé · jour ${day}`}
                    </em>
                    <span className="reveal-bar" aria-hidden="true">
                      <i style={{ width: `${pct}%` }} />
                    </span>
                  </div>
                  <span className={`rv-badge ${m.other.photoBlurred ? '' : 'on'}`}>
                    {m.other.photoBlurred ? '🕯️ Flouté' : '🔓 Révélé'}
                  </span>
                  <a className="btn ghost small" href={`#/chat/${m.conversationId}`}>
                    Ouvrir
                  </a>
                </article>
              );
            })}
          </div>
          <p className="hint">La barre suit les 7 jours — les 15 messages et le consentement se suivent dans chaque conversation.</p>
        </section>
      )}

      {/* ── COACH WAIRYU (INVISIBLE — Task 32, réf. §4.4) ──
          Suggestions de conversation : l'icebreaker vient des VRAIS sujets
          calculés par le serveur (matchReasons / highlights) ; les autres
          cartes sont la pédagogie produit (voice notes, défi). */}
      {isInvisible && (
        <section className="coach-section">
          <h2 className="section-title">🧭 Coach Wairyu</h2>
          <p className="hint">Des idées sincères pour des conversations qui vont plus loin.</p>
          <div className="coach-grid">
            <button type="button" className="coach-card icebreaker" onClick={() => coachSay(coachIcebreaker)}>
              <em>💬 Icebreaker suggéré</em>
              <p>{coachIcebreaker}</p>
            </button>
            <button
              type="button" className="coach-card depth"
              onClick={() => coachSay('« Quelle est la dernière fois où tu as défendu quelque chose qui te tenait vraiment à cœur ? »')}
            >
              <em>🫀 Question de profondeur</em>
              <p>« Quelle est la dernière fois où tu as défendu quelque chose qui te tenait vraiment à cœur ? »</p>
            </button>
            <button
              type="button" className="coach-card voice"
              onClick={() => coachSay('Les voice notes créent 3× plus de connexion émotionnelle — envoie un 🎤 de 10 secondes, c\'est souvent là que tout débloque.')}
            >
              <em>🎤 Propose un voice note</em>
              <p>Les voice notes créent 3× plus de connexion émotionnelle — ose un 🎤 de 10 secondes.</p>
            </button>
            <button
              type="button" className="coach-card gold"
              onClick={() => coachSay('Défi du jour : raconte ta chanson d\'enfance — celle que tu chantais à fond.')}
            >
              <em>🏆 Défi du jour</em>
              <p>Raconte ta chanson d'enfance — celle que tu chantais à fond.</p>
            </button>
          </div>
        </section>
      )}

      {items.length > 0 && <p className="hint q-disclaimer">Ce score est un indice basé sur vos réponses déclarées — indicatif, jamais prédictif.</p>}
      {mode === 'interracial' && (
        <p className="hint safe-hint">
          🛡️ Rencontre internationale : garde la conversation sur wairyu, faites une visio avant tout
          voyage, et n’envoie jamais d’argent à quelqu’un que tu n’as pas rencontré.
        </p>
      )}

      {/* ── CULTURES — COACH CULTUREL (Task 38, réf. §4.5) ──
          Cartes pédagogiques interculturelles (aucune donnée inventée :
          ce sont des conseils produit, comme le Coach du mode Invisible). */}
      {isIntl && (
        <section className="coach-section intl-coach">
          <h2 className="section-title">🧭 Coach culturel</h2>
          <p className="hint">Des repères sincères pour que la différence devienne une force — pas un obstacle.</p>
          <div className="coach-grid">
            <button
              type="button" className="coach-card warm featured"
              onClick={() => coachSay('Respect des aînés : dans beaucoup de cultures, saluer d’abord les aînés n’est pas une formalité — c’est une marque de considération. Renseigne-toi sur ses codes avant le premier appel.')}
            >
              <em>🌏 Fiche : les codes qui comptent</em>
              <p>Saluer d’abord les aînés, demander des nouvelles de la famille, goûter ce qui est offert — les petits gestes ouvrent grands les cœurs.</p>
            </button>
            <button
              type="button" className="coach-card warm"
              onClick={() => coachSay('Avant un premier rendez-vous : propose une visio courte d’abord — elle rassure des deux côtés quand la distance est grande.')}
            >
              <em>🛫 Avant un premier rendez-vous</em>
              <p>Visio courte d’abord, puis rencontre — la prudence n’enlève rien à la romance.</p>
            </button>
            <button
              type="button" className="coach-card warm"
              onClick={() => coachSay('« Quelle tradition de ta culture aimerais-tu transmettre ? »')}
            >
              <em>💬 Question interculturelle</em>
              <p>« Quelle tradition de ta culture aimerais-tu transmettre ? »</p>
            </button>
            <button
              type="button" className="coach-card warm ethic"
              onClick={() => coachSay('Ne réduis pas ton match à sa culture — demande-lui ce qui la rend unique AU-DELÀ de ses origines.')}
            >
              <em>🚫 À éviter</em>
              <p>Ne réduis pas ton match à sa culture — demande-lui ce qui la rend unique au-delà de ses origines.</p>
            </button>
          </div>
        </section>
      )}

      {/* ── CULTURES — DÉFIS DE CONNEXION (Task 38, réf. §4.6) ── */}
      {isIntl && (
        <section className="defi-section">
          <h2 className="section-title">🏆 Défis de connexion</h2>
          <p className="hint">Des activités guidées à faire à deux — même à des milliers de kilomètres.</p>
          <div className="defi-grid">
            {INTL_DEFIS.map((d) => (
              <button
                key={d.title}
                type="button"
                className={`defi-card ${d.level}`}
                onClick={() => coachSay(`Défi lancé : ${d.title} — raconte-le dans ta prochaine conversation !`)}
                title="Lance le défi — à raconter ensuite dans la conversation"
              >
                <span className="defi-ico" aria-hidden="true">{d.icon}</span>
                <span className="defi-head">
                  <strong>{d.title}</strong>
                  <span className={`defi-lvl ${d.level}`}>{DEFIS_LEVELS[d.level]}</span>
                </span>
                <span className="defi-desc">{d.desc}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── CULTURES — SALONS CULTURELS (Task 38, réf. §4.4) ──
          Aperçu honnête de la prochaine phase : badge « Bientôt », AUCUN
          faux compteur de membres ni d'en ligne. */}
      {isIntl && (
        <section className="salon-section">
          <h2 className="section-title">
            💬 Salons culturels <span className="salon-soon-title">Bientôt</span>
          </h2>
          <p className="hint">Des communautés thématiques pour parler cuisine, musique et langues — en préparation pour la prochaine phase.</p>
          <div className="salon-grid">
            {INTL_SALONS.map((s) => (
              <button
                key={s.name}
                type="button"
                className="salon-card"
                onClick={() => coachSay('Les salons culturels arrivent bientôt — en attendant, lance un défi ou rejoins une conversation !')}
                title="Bientôt — en préparation"
              >
                <span className="salon-emoji" aria-hidden="true">{s.emoji}</span>
                <strong>{s.name}</strong>
                <span className="salon-soon">Bientôt</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Écran « C'est un match ! » — à deux photos, façon dating */}
      {matchModal && (
        <div className="match-overlay" role="dialog" aria-modal="true">
          <div className="match-card">
            {/* Task 38 (réf. Cultures §5.3) : drapeaux face à face — VRAIS
                pays (le mien via /api/profile, le sien via le swipe). */}
            {mode === 'interracial' &&
              myCountry &&
              matchModal.country &&
              countryMeta(myCountry) &&
              countryMeta(matchModal.country) && (
                <div className="match-flags" aria-hidden="true">
                  {countryMeta(myCountry)!.flag}
                  <span className="match-heart">❤</span>
                  {countryMeta(matchModal.country)!.flag}
                </div>
              )}
            <div className="match-duo">
              <div className="match-photo">
                {myPhoto ? <img src={myPhoto} alt="Moi" /> : <span>✨</span>}
                <em>Toi</em>
              </div>
              <span className="match-x" aria-hidden="true">×</span>
              <div className="match-photo">
                {matchModal.photo ? <img src={matchModal.photo} alt={matchModal.name} /> : <span>✨</span>}
                <em>{matchModal.name}</em>
              </div>
            </div>
            <h2>C’est un match !</h2>
            <p>
              Vous vous êtes aimés — la conversation est déjà prête. Écris le premier message,
              c’est souvent lui qui fait la différence.
            </p>
            <div className="btn-col">
              <button type="button" className="btn primary" onClick={onMatches}>
                💬 Envoyer un message
              </button>
              <button type="button" className="btn ghost" onClick={() => setMatchModal(null)}>
                Continuer à découvrir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale Notifications — likes, supers, matchs, demandes (Task 30) */}
      {showNotif && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowNotif(false);
          }}
        >
          <div className="modal-card" role="dialog" aria-modal="true" aria-label="Notifications">
            <div className="modal-head">
              <h2>🔔 Notifications</h2>
              <button type="button" className="modal-close" aria-label="Fermer" onClick={() => setShowNotif(false)}>
                ×
              </button>
            </div>
            <div className="modal-body notif-list">
              {notifCount === 0 && (
                <p className="q-done-note">
                  Aucune nouveauté pour l’instant — continue à découvrir, ça bouge vite ici !
                </p>
              )}
              {isInvisible &&
                inbox?.received.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    className="notif-row"
                    onClick={() => {
                      setShowNotif(false);
                      showFlash('La demande t’attend dans la section « Demandes de discussion ».');
                    }}
                  >
                    <span className="notif-ico req" aria-hidden="true">✉</span>
                    <span>
                      <strong>{r.fromName}</strong> voudrait discuter avec toi
                    </span>
                  </button>
                ))}
              {supersReceived.map((l) => (
                <button
                  key={`s-${l.userId}`}
                  type="button"
                  className="notif-row"
                  onClick={() => {
                    setShowNotif(false);
                    window.location.hash = '#/likes';
                  }}
                >
                  <span className="notif-ico super" aria-hidden="true">✶</span>
                  <span>
                    <strong>{l.displayName}</strong> t’a envoyé un Super Like
                  </span>
                </button>
              ))}
              {likes && likes.count > 0 && (
                <button
                  type="button"
                  className="notif-row"
                  onClick={() => {
                    setShowNotif(false);
                    window.location.hash = '#/likes';
                  }}
                >
                  <span className="notif-ico like" aria-hidden="true">♥</span>
                  <span>
                    <strong>{likes.count}</strong> personne{likes.count > 1 ? 's' : ''} t’a
                    liké{likes.count > 1 ? 'y' : ''} — appuie pour révéler
                  </span>
                </button>
              )}
              {newMatches.slice(0, 3).map((m) => (
                <button
                  key={m.matchId}
                  type="button"
                  className="notif-row"
                  onClick={() => {
                    setShowNotif(false);
                    onMatches();
                  }}
                >
                  <span className="notif-ico match" aria-hidden="true">⚡</span>
                  <span>
                    Nouveau match avec <strong>{m.other.displayName}</strong>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Task 38 (réf. Cultures §5.4) : modale « Pourquoi ce match culturel ? » —
          3 sections colorées (forces / vigilance / sujets cliquables) tirées
          des matchReasons RÉELS du serveur + rappel éthique ambré. */}
      {whyCulture && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setWhyCulture(null);
          }}
        >
          <div className="modal-card why-cult-modal" role="dialog" aria-modal="true" aria-label="Pourquoi ce match culturel ?">
            <div className="modal-head">
              <h2>🌍 Pourquoi ce match culturel ?</h2>
              <button type="button" className="modal-close" aria-label="Fermer" onClick={() => setWhyCulture(null)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <p className="wc-lead">
                Score culturel de <strong>{whyCulture.displayName}</strong> :{' '}
                <strong>{whyCulture.score ?? '–'}/100</strong> — un indice basé sur vos réponses
                déclarées, indicatif et jamais prédictif.
              </p>
              {whyCulture.matchReasons ? (
                <>
                  <div className="wc-sec forces">
                    <strong>Points forts</strong>
                    <ul>
                      {whyCulture.matchReasons.forces.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="wc-sec vigilance">
                    <strong>Points de vigilance</strong>
                    <p>{whyCulture.matchReasons.vigilance}</p>
                  </div>
                  <div className="wc-sec sujets">
                    <strong>Sujets suggérés — clic pour copier</strong>
                    <div className="wc-sujets">
                      {whyCulture.matchReasons.conversationStarters.map((s, i) => (
                        <button key={i} type="button" className="wc-sujet" onClick={() => copySujet(s)}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <p className="hint">
                  Le détail se débloque quand vous avez tous les deux complété le questionnaire de
                  personnalité — en attendant, les drapeaux et la distance restent de vraies informations.
                </p>
              )}
              <div className="wc-ethic">
                🌍 La culture est une richesse, pas une case : le score t’explique, il ne décide pas à ta place.
              </div>
            </div>
            <div className="modal-foot">
              <button type="button" className="btn ghost" onClick={() => setWhyCulture(null)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale Boost — aperçu Wairyu+ offert pendant le lancement */}
      {showBoost && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowBoost(false);
          }}
        >
          <div className="modal-card boost-modal" role="dialog" aria-modal="true" aria-label="Boost">
            <div className="modal-head">
              <h2>⚡ Boost</h2>
              <button type="button" className="modal-close" aria-label="Fermer" onClick={() => setShowBoost(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              {boostActive ? (
                <p className="boost-status">
                  Ton profil est mis en avant — <strong>{boostLeft} min restantes</strong>.
                </p>
              ) : (
                <>
                  <p>
                    Pendant <strong>30 minutes</strong>, ton profil passe en tête des découvertes
                    de ta zone : plus de vues, plus de likes, zéro effort.
                  </p>
                  <p className="hint">Offert pendant la phase de lancement — aperçu de Wairyu+.</p>
                </>
              )}
            </div>
            <div className="modal-foot">
              {boostActive ? (
                <button type="button" className="btn ghost" onClick={() => setShowBoost(false)}>
                  Fermer
                </button>
              ) : (
                <>
                  <button type="button" className="btn ghost" onClick={() => setShowBoost(false)}>
                    Plus tard
                  </button>
                  <button type="button" className="btn primary" onClick={activateBoost}>
                    ⚡ Activer mon Boost
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modale Détail profil — grand carrousel + toutes les infos + actions */}
      {detail && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDetail(null);
          }}
        >
          <div className="modal-card profile-modal" role="dialog" aria-modal="true" aria-label={`Profil de ${detail.displayName}`}>
            <div className="profile-modal-photo">
              <CardCarousel p={detail} />
              <button
                type="button"
                className="modal-close on-photo"
                aria-label="Fermer"
                onClick={() => setDetail(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="profile-modal-head">
                <h2>
                  {detail.displayName}, {detail.age}
                  {detail.verified && (
                    <span className="ov-verified" title="Selfie reviewé par l'équipe wairyu">
                      ✓
                    </span>
                  )}
                </h2>
                {detail.online && (
                  <span className={`chip-ov ov-online ${detail.online}`}>
                    <span className="dot-on" />
                    {ONLINE_LABELS[detail.online]}
                  </span>
                )}
              </div>
              {renderCardBody(detail, true)}
            </div>
            <div className="modal-foot">
              {isInvisible ? (
                <button
                  type="button"
                  className="btn primary"
                  disabled={busy || (quota?.invisibleLeft ?? 0) < 1}
                  onClick={() => {
                    const d = detail;
                    setDetail(null);
                    void doRequest({ id: d.userId, photo: d.photoUrl, name: d.displayName });
                  }}
                >
                  ✉ Demander à discuter
                </button>
              ) : (
                <div className="deck-actions modal-actions">
                  <button
                    type="button" className="deck-btn pass" aria-label="Passer"
                    disabled={busy}
                    onClick={() => {
                      const d = detail;
                      setDetail(null);
                      void doSwipe('pass', { id: d.userId, photo: d.photoUrl, name: d.displayName });
                    }}
                  >
                    ✕
                  </button>
                  <button
                    type="button" className="deck-btn super" aria-label="Super Like"
                    disabled={busy || (quota?.supersLeft ?? 0) < 1}
                    onClick={() => {
                      const d = detail;
                      setDetail(null);
                      void doSwipe('super', { id: d.userId, photo: d.photoUrl, name: d.displayName });
                    }}
                  >
                    ✶
                  </button>
                  <button
                    type="button" className="deck-btn like" aria-label="Liker"
                    disabled={busy || (quota?.likesLeft ?? 0) < 1}
                    onClick={() => {
                      const d = detail;
                      setDetail(null);
                      void doSwipe('like', { id: d.userId, photo: d.photoUrl, name: d.displayName });
                    }}
                  >
                    ♥
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

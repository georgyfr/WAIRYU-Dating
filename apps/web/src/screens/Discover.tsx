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
 * Éthique (spec §5.4) : l'avertissement d'indicativité est TOUJOURS visible.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { api, ApiError } from '../lib/api';
import { useSwr } from '../lib/swr';
import { toast } from '../lib/toast';
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
    title: '🌍 L’amour sans frontières',
    sub: 'D’un continent à l’autre : la portée est mondiale et la distance n’est plus un filtre.',
    chips: ['✈️ Portée mondiale', '🗺️ Tous continents', '🛡️ Visio avant de voyager'],
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
}

/** Boost — aperçu Wairyu+ offert pendant le lancement (stockage local). */
const BOOST_LS_KEY = 'wairyu.boost.until';
const BOOST_MS = 30 * 60 * 1000;
/** Filtre local « vérifiés uniquement » — appliqué à la pile chargée. */
const VERIFIED_LS_KEY = 'wairyu.filter.verified';
/** Task 32 (réf. Invisible §5.6) : score minimum — filtre LOCAL (pile chargée). */
const MIN_SCORE_LS_KEY = 'wairyu.filter.minscore';

/* ─────────────────────────── Carrousel de photos ─────────────────────────── */

/** Carrousel façon Tinder : glisser-tap gauche/droite, points, compteur. */
function CardCarousel({ p }: { p: FeedProfile }) {
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
          {/* Barres de progression façon Stories (enrichissement Task 30) */}
          <div className="car-bars" aria-hidden="true">
            {photos.map((_, i) => (
              <span key={i} className={`car-bar ${i <= cur ? 'on' : ''}`} />
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

export function Discover({ onMatches }: Props) {
  const [prefs, setPrefs] = useState<PreferencesDto | null>(null);
  const [mode, setMode] = useState<DiscoveryMode>('classic');
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
  const [matchModal, setMatchModal] = useState<{ name: string; photo: string | null } | null>(null);
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
  // Matchs récents (cloche) — le cache est PARTAGÉ avec la page Matchs.
  const { data: matchesData, refresh: refreshMatches } = useSwr<MatchListResponse>('matches', true, { ttlMs: 60_000 });

  const isInvisible = mode === 'invisible';

  // Task 32 (réf. Invisible §3) : identité VIOLETTE du Mode Invisible —
  // `body.mode-invisible` retinte fond radial + --w-gradient (#8B5CF6→#EC4899)
  // pendant que le mode est actif ; nettoyage au démontage / bascule.
  // Couche 100 % additive : App.tsx (theme-dark par route) reste inchangé.
  useEffect(() => {
    document.body.classList.toggle('mode-invisible', isInvisible);
    return () => document.body.classList.remove('mode-invisible');
  }, [isInvisible]);

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
      if (prof.preferences) setMode(prof.preferences.modeDefault);
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
    return d;
  }, [items, verifiedOnly, minScore]);

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
          if (card) removeFromDeck(id);
          setMatchModal({
            name: res.matchedName ?? card?.displayName ?? target?.name ?? 'Quelqu’un',
            photo,
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
          setMatchModal({ name, photo });
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

  /** Bascule de mode (libre, réversible — §4.3.4) : ne touche pas aux matchs. */
  const switchMode = useCallback(
    async (next: DiscoveryMode) => {
      if (!prefs || busy || next === mode) return;
      setBusy(true);
      setError(null);
      try {
        await api('/api/profile/preferences', {
          method: 'PUT',
          json: {
            modeDefault: next,
            prefGender: prefs.prefGender,
            minAge: prefs.minAge,
            maxAge: prefs.maxAge,
            distanceKm: prefs.distanceKm,
            prefIntent: prefs.prefIntent ?? null,
          },
        });
        setMode(next);
        setIdx(0);
        setInbox(next === 'invisible' ? await api<InboxResponse>('/api/discover/inbox') : null);
        await loadDeck(1, true);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Erreur inattendue.');
      }
      setBusy(false);
    },
    [prefs, mode, busy, loadDeck],
  );

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
      if (res.matched) setMatchModal({ name: 'Une personne qui t’avait demandé de discuter', photo: null });
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
        return;
      }
      if (detail || showNotif || showBoost || matchModal || showFilters) return;
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
  }, [isInvisible, deck, idx, matchModal, showFilters, showNotif, showBoost, detail, doSwipe, doRewind]);

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
      {p.bio && <p className="feed-bio">{p.bio}</p>}
      <span className="chip">{LABELS.intent[p.intent] ?? 'Rencontres'}</span>
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
        <span className="quota-chip" title="Likes restants aujourd'hui">♥ {quota?.likesLeft ?? '–'}/{DISCOVERY.likesPerDay}</span>
        <span className="quota-chip" title="Super Likes restants">✶ {quota?.supersLeft ?? '–'}/{DISCOVERY.superLikesPerDay}</span>
        <span className="quota-chip" title="Demandes « Discuter » restantes">✉ {quota?.invisibleLeft ?? '–'}/{DISCOVERY.invisibleRequestsPerDay}</span>
        <span className="quota-chip" title="Rewinds restants">↺ {quota?.rewindsLeft ?? '–'}/{DISCOVERY.rewindsPerDay}</span>
        <button type="button" className="btn ghost small" onClick={() => setShowFilters((v) => !v)}>
          Filtres
        </button>
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

              {/* Task 32 (réf. Invisible §5.6) : score minimum — filtre LOCAL
                  instantané (comme « vérifiés uniquement »), Invisible only. */}
              {isInvisible && (
                <div className="filter-chips inv-filter-score">
                  <p className="filter-label">Score minimum</p>
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
          {loading && items.length === 0 && (
            <p className="status"><span className="dot" /> Recherche de profils compatibles…</p>
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
              <CardCarousel p={card} />
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
                      onClick={() => void doSwipe('like', { id: l.userId, photo: l.photoUrl, name: l.displayName })}
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

      {/* Écran « C'est un match ! » — à deux photos, façon dating */}
      {matchModal && (
        <div className="match-overlay" role="dialog" aria-modal="true">
          <div className="match-card">
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

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
import { useCallback, useEffect, useRef, useState } from 'react';
import { api, ApiError } from '../lib/api';
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
  type LikesMeDto,
  type LikesMeResponse,
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

type Exit = 'left' | 'right' | null;

/** Cible hors deck (strip « Tu plais ! ») — payload minimal pour l'API. */
interface TargetRef {
  id: string;
  photo?: string | null;
  name?: string;
}

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
          <div className="car-dots" aria-hidden="true">
            {photos.map((_, i) => (
              <span key={i} className={`car-dot ${i === cur ? 'on' : ''}`} />
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
  const [drag, setDrag] = useState(0);
  const dragRef = useRef<{ startX: number; active: boolean }>({ startX: 0, active: false });

  const isInvisible = mode === 'invisible';

  const showFlash = useCallback((msg: string) => {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 2600);
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
  }, [idx]);

  /** Retire une personne du deck (actionnée ailleurs — Top du jour, inbox). */
  const removeFromDeck = useCallback((userId: string) => {
    setItems((prev) => {
      const i = prev.findIndex((x) => x.userId === userId);
      if (i < 0) return prev;
      setIdx((cur) => (i < cur ? Math.max(0, cur - 1) : cur));
      return prev.filter((_, j) => j !== i);
    });
  }, []);

  /** Avance d'une carte avec micro-animation de sortie. */
  const advance = useCallback((dir: Exit) => {
    setExit(dir);
    window.setTimeout(() => {
      setExit(null);
      setIdx((i) => i + 1);
      setDrag(0);
    }, 180);
  }, []);

  /**
   * Swipe Classique/Interracial (like / pass / super).
   * `target` permet d'agir hors deck (strip « Tu plais ! ») : la carte n'est
   * pas forcément dans la pile courante — payload minimal vers l'API.
   */
  const doSwipe = useCallback(
    async (action: SwipeAction, target?: TargetRef) => {
      const card = target ? items.find((x) => x.userId === target.id) : items[idx];
      const id = card?.userId ?? target?.id;
      if (!id || busy) return;
      setBusy(true);
      setError(null);
      const photo = card?.photos[0]?.url ?? card?.photoUrl ?? target?.photo ?? null;
      try {
        const res = await api<SwipeResponse>('/api/discover/swipe', {
          json: { targetId: id, action, mode },
        });
        setQuota(res.quota);
        if (card) removeFromDeck(id);
        removeLike(id);
        if (res.matched) {
          setMatchModal({
            name: res.matchedName ?? card?.displayName ?? target?.name ?? 'Quelqu’un',
            photo,
          });
          setBusy(false);
          return;
        }
        if (!target) advance(action === 'pass' ? 'left' : 'right');
      } catch (err) {
        if (err instanceof ApiError && err.status === 429) {
          setError(err.message);
        } else {
          setError(err instanceof ApiError ? err.message : 'Erreur inattendue.');
          if (!target) advance(action === 'pass' ? 'left' : 'right');
        }
      }
      setBusy(false);
    },
    [items, idx, busy, mode, advance, removeFromDeck, removeLike],
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
        if (prevIdx >= 0 && items[prevIdx]?.userId === res.targetId) {
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
  }, [busy, idx, items, loadDeck, showFlash]);

  /** Handshake « Discuter » (Invisible) — deck ou strip « Tu plais ! ». */
  const doRequest = useCallback(
    async (target?: TargetRef) => {
      const card = target ? items.find((x) => x.userId === target.id) : items[idx];
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
        if (!target) advance('right');
      } catch (err) {
        if (err instanceof ApiError && err.status === 409) {
          showFlash(err.message);
          if (!target) advance('right');
        } else {
          setError(err instanceof ApiError ? err.message : 'Erreur inattendue.');
        }
      }
      setBusy(false);
    },
    [items, idx, busy, advance, removeFromDeck, removeLike, showFlash],
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

  /* ── Raccourcis clavier (PC) : ← passe · → like · ↑ super · R rewind ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) {
        return;
      }
      if (matchModal) {
        if (e.key === 'Escape') setMatchModal(null);
        return;
      }
      if (e.key === 'Escape') {
        if (showFilters) setShowFilters(false);
        return;
      }
      if (isInvisible || !items[idx]) return;
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
  }, [isInvisible, items, idx, matchModal, showFilters, doSwipe, doRewind]);

  // --- Gestes tactiles (pointer events : touch + souris) ---
  const onPointerDown = (e: React.PointerEvent) => {
    if (isInvisible || busy || !items[idx]) return;
    dragRef.current = { startX: e.clientX, active: true };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    setDrag(e.clientX - dragRef.current.startX);
  };
  const onPointerUp = () => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    if (drag > DISCOVERY.swipeThresholdPx) void doSwipe('like');
    else if (drag < -DISCOVERY.swipeThresholdPx) void doSwipe('pass');
    else setDrag(0);
  };

  const card = items[idx] as FeedProfile | undefined;
  const nextCard = items[idx + 1] as FeedProfile | undefined;
  const hero = MODE_HEROES[mode];
  const myCode = myCountry ? (countryMeta(myCountry)?.code ?? null) : null;

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
            onClick={() => setOpenWhy((v) => (v === p.userId ? null : p.userId))}
          >
            {openWhy === p.userId ? 'Masquer' : 'Pourquoi ce match ?'}
          </button>
          {openWhy === p.userId && (
            <div className="why-box">
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
        <h1>Découvrir</h1>
        <button type="button" className="btn ghost matches-link" onClick={onMatches}>
          Mes matchs
        </button>
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
        <div className="filter-panel">
          <div className="filter-grid">
            <label>
              Âge min
              <input
                type="number" min={18} max={99} value={draftFilters.minAge}
                onChange={(e) => setDraftFilters({ ...draftFilters, minAge: Number(e.target.value) || 18 })}
              />
            </label>
            <label>
              Âge max
              <input
                type="number" min={18} max={99} value={draftFilters.maxAge}
                onChange={(e) => setDraftFilters({ ...draftFilters, maxAge: Number(e.target.value) || 99 })}
              />
            </label>
            <label>
              Distance : {draftFilters.distanceKm} km
              <input
                type="range" min={1} max={500} value={draftFilters.distanceKm}
                onChange={(e) => setDraftFilters({ ...draftFilters, distanceKm: Number(e.target.value) })}
              />
              {mode === 'interracial' && <small>Non appliqué en Interracial — portée mondiale.</small>}
            </label>
            <label>
              Montre-moi
              <select
                value={draftFilters.prefGender}
                onChange={(e) => setDraftFilters({ ...draftFilters, prefGender: e.target.value as PreferencesDto['prefGender'] })}
              >
                <option value="everyone">Tout le monde</option>
                <option value="women">Des femmes</option>
                <option value="men">Des hommes</option>
              </select>
            </label>
            <label>
              Intention
              <select
                value={draftFilters.prefIntent ?? ''}
                onChange={(e) =>
                  setDraftFilters({ ...draftFilters, prefIntent: (e.target.value || null) as PreferencesDto['prefIntent'] })
                }
              >
                <option value="">Toutes les intentions</option>
                {Object.entries(LABELS.intent).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </label>
          </div>
          <button type="button" className="btn primary" disabled={busy} onClick={() => void applyFilters()}>
            Appliquer
          </button>
        </div>
      )}

      {error && <p className="error">{error}</p>}
      {flash && <p className="flash-msg">{flash}</p>}

      {/* « Tu plais ! » — likes reçus en attente (gratuit, éthique : la
          personne ne sait pas que tu vois cette liste tant que tu réponds) */}
      {likes && likes.count > 0 && (
        <section className="likes-section">
          <h2 className="section-title">
            🔥 Tu plais ! <span className="likes-count">{likes.count}</span>
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
          {nextCard && (
            <div className="deck-card behind" aria-hidden="true">
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
                drag !== 0
                  ? { transform: `translateX(${drag}px) rotate(${drag * 0.04}deg)` }
                  : undefined
              }
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
            >
              <span className={`stamp stamp-like ${drag > 40 ? 'on' : ''}`}>♥</span>
              <span className={`stamp stamp-pass ${drag < -40 ? 'on' : ''}`}>✕</span>
              <CardCarousel p={card} />
              <div className="feed-body">
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
              <div className="feed-body">
                {renderCardBody(p, !!p.photoUrl && !p.photoBlurred)}
                <RitualRow />
                <div className="btn-row">
                  <button
                    type="button" className="btn primary"
                    disabled={busy || (quota?.invisibleLeft ?? 0) < 1}
                    onClick={() => void doRequest({ id: p.userId, photo: p.photoUrl, name: p.displayName })}
                    title="La personne recevra ta demande et pourra accepter ou passer"
                  >
                    ✉ Demander à discuter
                  </button>
                  <span className="hint">Explorer est libre — aucune décision forcée.</span>
                </div>
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
    </div>
  );
}

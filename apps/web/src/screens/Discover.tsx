/**
 * Découverte dual-mode (Étape 5) — le cœur de l'app.
 *
 * - Onglets de mode (Classique / Invisible / Interracial) — bascule libre,
 *   réversible, transparente (spec §4.3.4) : elle ne touche jamais aux matchs
 *   existants (§4.8), seulement aux FUTURES découvertes.
 * - Classique/Interracial : pile de cartes avec swipe tactile + boutons
 *   (passe / super / like / rewind), match mutuel → écran « C'est un match ! ».
 * - Invisible : cartes floutées (score + extraits + prompts + bio, pas de
 *   swipe binaire) + « Demander à discuter » (handshake) + boîte de réception.
 * - Top Compatibilité du jour (cron, hors quota) + filtres de base + quotas.
 * Éthique (spec §5.4) : l'avertissement d'indicativité est TOUJOURS visible.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { api, ApiError } from '../lib/api';
import {
  ARCHETYPES,
  AFFINITY_LABELS,
  DISCOVERY,
  LABELS,
  type DiscoveryMode,
  type FeedProfile,
  type FeedResponse,
  type InboxResponse,
  type PreferencesDto,
  type ProfileResponse,
  type QuotaState,
  type SwipeAction,
  type SwipeResponse,
  type TopResponse,
} from '@wairyu/shared';

interface Props {
  onBack: () => void;
  onMatches: () => void;
}

const MODE_TABS: { id: DiscoveryMode; label: string; hint: string }[] = [
  { id: 'classic', label: 'Classique', hint: 'Photos visibles, swipe libre.' },
  { id: 'invisible', label: 'Invisible', hint: 'Photos floutées — la personnalité d’abord.' },
  { id: 'interracial', label: 'Interracial', hint: 'Rencontres entre continents, portée mondiale.' },
];

type Exit = 'left' | 'right' | null;

export function Discover({ onBack, onMatches }: Props) {
  const [prefs, setPrefs] = useState<PreferencesDto | null>(null);
  const [mode, setMode] = useState<DiscoveryMode>('classic');
  const [items, setItems] = useState<FeedProfile[]>([]);
  const [idx, setIdx] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [quota, setQuota] = useState<QuotaState | null>(null);
  const [top, setTop] = useState<TopResponse | null>(null);
  const [inbox, setInbox] = useState<InboxResponse | null>(null);
  const [matchModal, setMatchModal] = useState<string | null>(null);
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
      if (prof.preferences?.modeDefault === 'invisible') {
        setInbox(await api<InboxResponse>('/api/discover/inbox').catch(() => null));
      }
      await loadDeck(1, true);
      setIdx(0);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur inattendue.');
      setLoading(false);
    }
  }, [loadDeck]);

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
  const advance = useCallback(
    (dir: Exit) => {
      setExit(dir);
      window.setTimeout(() => {
        setExit(null);
        setIdx((i) => i + 1);
        setDrag(0);
      }, 180);
    },
    [],
  );

  /** Swipe Classique/Interracial (like / pass / super). */
  const doSwipe = useCallback(
    async (action: SwipeAction, targetId?: string) => {
      const card = targetId ? items.find((x) => x.userId === targetId) : items[idx];
      if (!card || busy) return;
      setBusy(true);
      setError(null);
      try {
        const res = await api<SwipeResponse>('/api/discover/swipe', {
          json: { targetId: card.userId, action, mode },
        });
        setQuota(res.quota);
        if (targetId) removeFromDeck(card.userId);
        if (res.matched) {
          setMatchModal(res.matchedName ?? 'Quelqu’un');
          if (targetId) return; // pas d'avance de carte (deck rechargé au besoin)
        }
        if (!targetId) advance(action === 'pass' ? 'left' : 'right');
      } catch (err) {
        if (err instanceof ApiError && err.status === 429) {
          setError(err.message);
        } else {
          setError(err instanceof ApiError ? err.message : 'Erreur inattendue.');
          if (!targetId) advance(action === 'pass' ? 'left' : 'right');
        }
      }
      setBusy(false);
    },
    [items, idx, busy, mode, advance, removeFromDeck],
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

  /** Handshake « Discuter » (Invisible). */
  const doRequest = useCallback(
    async (targetId?: string) => {
      const card = targetId ? items.find((x) => x.userId === targetId) : items[idx];
      if (!card || busy) return;
      setBusy(true);
      setError(null);
      try {
        const res = await api<{ ok: true; status: 'pending' | 'accepted'; matched: boolean; matchId: string | null; quota: QuotaState }>(
          '/api/discover/invisible-request',
          { json: { targetId: card.userId } },
        );
        setQuota(res.quota);
        setInbox((prev) =>
          prev
            ? {
                ...prev,
                sent: [
                  {
                    id: `tmp-${card.userId}`,
                    fromUser: 'me',
                    fromName: '',
                    toUser: card.userId,
                    toName: card.displayName,
                    status: res.status === 'accepted' ? 'accepted' : 'pending',
                    createdAt: Math.floor(Date.now() / 1000),
                    photoUrl: card.photoUrl,
                    photoBlurred: card.photoBlurred,
                    personalityType: card.personalityType,
                    personalityValidated: card.personalityValidated,
                  },
                  ...prev.sent,
                ],
              }
            : prev,
        );
        if (res.matched) {
          setMatchModal(card.displayName);
        } else {
          showFlash(`Demande envoyée à ${card.displayName} — à ${LABELS.intent[card.intent] ?? 'faire connaissance'} quand elle accepte.`);
        }
        if (targetId) removeFromDeck(card.userId);
        else advance('right');
      } catch (err) {
        if (err instanceof ApiError && err.status === 409) {
          showFlash(err.message);
          if (!targetId) advance('right');
        } else {
          setError(err instanceof ApiError ? err.message : 'Erreur inattendue.');
        }
      }
      setBusy(false);
    },
    [items, idx, busy, advance, removeFromDeck, showFlash],
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
  const respondRequest = useCallback(
    async (reqId: string, accept: boolean) => {
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
        if (res.matched) setMatchModal('Une personne qui t’avait demandé de discuter');
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Erreur inattendue.');
      }
      setBusy(false);
    },
    [],
  );

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

  // --- Rendu d'une carte (partagé deck classique / liste invisible) ---
  const renderCardBody = (p: FeedProfile) => (
    <>
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
        <div className="feed-highlights">
          {p.highlights.map((h, i) => (
            <span key={i} className="chip chip-highlight">
              ✓ {h}
            </span>
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

  const renderPhoto = (p: FeedProfile) =>
    p.photoUrl ? (
      <div className={`feed-photo ${p.photoBlurred ? 'blurred' : ''}`}>
        <img src={p.photoUrl} alt={p.displayName} loading="lazy" draggable={false} />
      </div>
    ) : (
      <div className="feed-photo empty" aria-hidden="true">
        <span>✨</span>
      </div>
    );

  return (
    <div className="app discover">
      <header className="wizard-head">
        <button type="button" className="back" onClick={onBack} aria-label="Retour">‹</button>
        <h1>Découvrir</h1>
        <button type="button" className="btn ghost matches-link" onClick={onMatches}>
          Mes matchs
        </button>
      </header>

      {/* Onglets de mode — libre, réversible, transparent (§4.3.4) */}
      <div className="mode-tabs" role="tablist">
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
            {t.label}
          </button>
        ))}
      </div>
      <p className="mode-hint">{MODE_TABS.find((t) => t.id === mode)?.hint}</p>

      {/* Barre de quotas + filtres */}
      <div className="quota-row">
        <span className="quota-chip" title="Likes restants aujourd'hui">♥ {quota?.likesLeft ?? '–'}/{DISCOVERY.likesPerDay}</span>
        <span className="quota-chip" title="Super Likes restants">✶ {quota?.supersLeft ?? '–'}/{DISCOVERY.superLikesPerDay}</span>
        <span className="quota-chip" title="Demandes « Discuter » restantes">✉ {quota?.invisibleLeft ?? '–'}/{DISCOVERY.invisibleRequestsPerDay}</span>
        <span className="quota-chip" title="Rewinds restants">↺ {quota?.rewindsLeft ?? '–'}/{DISCOVERY.rewindsPerDay}</span>
        <button type="button" className="btn ghost small" onClick={() => setShowFilters((v) => !v)}>
          Filtres
        </button>
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

      {/* Top Compatibilité du jour (cron, hors quota) */}
      {top && top.items.length > 0 && (
        <section className="top-section">
          <h2 className="section-title">Top compatibilité du jour</h2>
          <div className="top-strip">
            {top.items.map((t) => (
              <article key={t.userId} className="top-card">
                {t.photoUrl ? (
                  <img src={t.photoUrl} alt={t.displayName} className={t.photoBlurred ? 'blurred' : ''} loading="lazy" />
                ) : (
                  <span className="top-avatar">✨</span>
                )}
                <strong>{t.displayName}</strong>
                {t.score !== null && <em>{t.score}/100</em>}
                {isInvisible ? (
                  <button type="button" className="btn primary small" disabled={busy} onClick={() => void doRequest(t.userId)}>
                    Discuter
                  </button>
                ) : (
                  <button type="button" className="btn primary small" disabled={busy} onClick={() => void doSwipe('like', t.userId)}>
                    ♥ Liker
                  </button>
                )}
              </article>
            ))}
          </div>
          <p className="hint">{top.note}</p>
        </section>
      )}

      {/* Boîte de réception — demandes « Discuter » reçues (Invisible) */}
      {isInvisible && inbox && inbox.received.length > 0 && (
        <section className="inbox-section">
          <h2 className="section-title">Demandes de discussion ({inbox.received.length})</h2>
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
              <p className="q-done-note">
                Plus personne dans ta pile pour l’instant. Élargis tes filtres — ou reviens demain :
                de nouvelles personnes rejoignent wairyu chaque jour.
              </p>
              <button type="button" className="btn ghost" onClick={() => void loadAround()}>
                Recharger
              </button>
            </div>
          )}
          {nextCard && (
            <div className="deck-card behind" aria-hidden="true">
              {renderPhoto(nextCard)}
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
              {renderPhoto(card)}
              <div className="feed-body">
                {renderCardBody(card)}
              </div>
            </article>
          )}
          {card && (
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
                title="Super Like — 1 par jour"
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
              {renderPhoto(p)}
              <div className="feed-body">
                {renderCardBody(p)}
                <div className="btn-row">
                  <button
                    type="button" className="btn primary"
                    disabled={busy || (quota?.invisibleLeft ?? 0) < 1}
                    onClick={() => void doRequest(p.userId)}
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

      {/* Écran « C'est un match ! » */}
      {matchModal && (
        <div className="match-overlay" role="dialog" aria-modal="true">
          <div className="match-card">
            <span className="match-emoji">🎉</span>
            <h2>C’est un match !</h2>
            <p>
              Vous avez aimé {matchModal}. Ta conversation est prête — le chat ouvre à l’Étape 6,
              ton match est déjà conservé.
            </p>
            <div className="btn-col">
              <button type="button" className="btn primary" onClick={onMatches}>
                Voir mes matchs
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

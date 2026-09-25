/**
 * Onglet « Likes » (enrichissement Task 30) — la grille « Tu plais ! ».
 *
 * Reprend les codes des apps populaires : grille de vignettes avec photo
 * floutée + verrou, révélation par appui — MAIS 100 % GRATUIT (spéc. §6) :
 * pas d'abonnement, le verrou s'ouvre d'un tap. Liker en retour = match
 * immédiat ; passer est discret (l'autre n'est jamais notifié).
 *
 * En Mode Invisible, les likes reçus se répondent par une demande
 * « Discuter » (handshake) — les photos restent régies par le mode du
 * PROPRIÉTAIRE (§4.6).
 * Task 36 (demande fondateur — URLs spécifiques) : chaque filtre a son
 * URL — #/likes/tous · #/likes/likes · #/likes/supers — et changer de
 * filtre met l'URL à jour (replaceState via onFilterChange). #/likes sans
 * slug garde son comportement historique (filtre « Tout »). Le filtrage
 * reste LOCAL et instantané — aucun appel API ajouté.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { api, ApiError } from '../lib/api';
import { useSwr } from '../lib/swr';
import { toast } from '../lib/toast';
import { countryMeta } from '../lib/geo';
import { ARCHETYPES, type LikesMeDto, type LikesMeResponse, type ProfileResponse, type QuotaState, type SwipeResponse } from '@wairyu/shared';

interface Props {
  /** Réservé : ouvrir directement le chat après un match (page Matchs pour l'instant). */
  onOpenChat?: (conversationId: string) => void;
  /** Task 36 : filtre demandé par l'URL (#/likes/:filtre) — sinon undefined. */
  initialFilter?: 'all' | 'like' | 'super';
  /** Task 36 : notifie App à chaque changement de filtre — l'URL suit. */
  onFilterChange?: (filter: 'all' | 'like' | 'super') => void;
}

export function Likes({ onOpenChat: _onOpenChat, initialFilter, onFilterChange }: Props) {
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [matchModal, setMatchModal] = useState<{ name: string; photo: string | null } | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  // Filtres horizontaux (Task 31 — codes de la référence) : Tout / Likes / Super.
  // Task 36 : l'état initial peut venir de l'URL (#/likes/:filtre) et chaque
  // changement est reflété dans l'URL (replaceState via onFilterChange) —
  // le wrapper setFilter conserve la signature utilisée par les chips.
  const [filter, setFilterState] = useState<'all' | 'like' | 'super'>(initialFilter ?? 'all');
  const setFilter = useCallback(
    (f: 'all' | 'like' | 'super') => {
      setFilterState(f);
      onFilterChange?.(f);
    },
    [onFilterChange],
  );
  // Task 36 : édition manuelle de l'URL pendant que l'écran est monté —
  // le filtre suit (filtrage local, aucun appel API, pas de notification
  // en retour : l'URL est déjà à jour).
  useEffect(() => {
    if (initialFilter) setFilterState(initialFilter);
  }, [initialFilter]);

  // Cache partagé : la même requête sert le badge de l'onglet (App), la
  // page Découvrir (strip) et cette page — Task 28/30.
  const { data, loading, refresh } = useSwr<LikesMeResponse>('likes-me', true, { ttlMs: 30_000 });
  const { data: profile } = useSwr<ProfileResponse>('profile', true, { ttlMs: 60_000 });

  const mode = profile?.preferences?.modeDefault ?? 'classic';
  const isInvisible = mode === 'invisible';
  const myPhoto = profile?.photos.find((x) => x.position === 0)?.urlThumb ?? profile?.photos[0]?.urlThumb ?? null;

  const showFlash = (msg: string) => {
    // Toast global (Task 31) — le flash-msg historique reste rendu si posé.
    toast(msg, 'success');
  };

  const reveal = (userId: string) => {
    setRevealed((prev) => new Set(prev).add(userId));
  };

  /** Like en retour (ou demande « Discuter » en Invisible) → match immédiat. */
  const respond = useCallback(
    async (l: LikesMeDto, action: 'like' | 'pass') => {
      if (busy) return;
      setBusy(true);
      setError(null);
      try {
        if (isInvisible && action === 'like') {
          const res = await api<{ ok: true; status: 'pending' | 'accepted'; matched: boolean; matchId: string | null; quota: QuotaState }>(
            '/api/discover/invisible-request',
            { json: { targetId: l.userId } },
          );
          if (res.matched) setMatchModal({ name: l.displayName, photo: l.photoUrl });
          else showFlash(`Demande envoyée à ${l.displayName} — elle pourra accepter ou passer.`);
        } else {
          const res = await api<SwipeResponse>('/api/discover/swipe', {
            json: { targetId: l.userId, action, mode },
          });
          if (action === 'like' && res.matched) {
            setMatchModal({ name: l.displayName, photo: l.photoUrl });
          } else if (action === 'pass') {
            showFlash('Passé — discret, elle ne sera jamais notifiée.');
          }
        }
        refresh(true); // la liste ET le badge se mettent à jour partout
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Erreur inattendue.');
      }
      setBusy(false);
    },
    [busy, isInvisible, mode, refresh, showFlash],
  );

  const items = data?.items ?? [];
  const superCount = items.filter((l) => l.action === 'super').length;
  const likeCount = Math.max(0, (data?.count ?? 0) - superCount);
  const shown = useMemo(
    () => (filter === 'all' ? items : items.filter((l) => l.action === filter)),
    [items, filter],
  );

  return (
    <div className="app likes-page">
      <header className="wizard-head plain">
        <h1>✨ Tu plais !</h1>
        {data && data.count > 0 && <span className="head-count">{data.count}</span>}
      </header>

      <p className="page-note">
        Ces personnes t'ont déjà liké{data && data.count > items.length ? ` (${data.count} au total — les plus récentes sont affichées)` : ''}.
        Appuie sur une vignette pour révéler qui — <strong>c'est gratuit, toujours</strong>.
        {isInvisible && ' En Mode Invisible, tu réponds par une demande « Discuter ».'}
      </p>

      {error && <p className="error">{error}</p>}
      {flash && <p className="flash-msg">{flash}</p>}
      {loading && <p className="status"><span className="dot" /> Chargement de tes admirateurs…</p>}

      {/* Onglets de filtre (Task 31) : Tout / Likes / Super Likes —
          filtrage local instantané, comme la référence. */}
      {data && data.count > 0 && (
        <div className="likes-tabs" role="tablist" aria-label="Filtrer les likes reçus">
          <button
            type="button" role="tab" aria-selected={filter === 'all'}
            className={`likes-tab ${filter === 'all' ? 'on' : ''}`}
            onClick={() => setFilter('all')}
          >
            Tout<span className="n">{data.count}</span>
          </button>
          <button
            type="button" role="tab" aria-selected={filter === 'like'}
            className={`likes-tab ${filter === 'like' ? 'on' : ''}`}
            onClick={() => setFilter('like')}
          >
            ♥ Likes<span className="n">{likeCount}</span>
          </button>
          <button
            type="button" role="tab" aria-selected={filter === 'super'}
            className={`likes-tab ${filter === 'super' ? 'on' : ''}`}
            onClick={() => setFilter('super')}
          >
            ✶ Super Likes<span className="n">{superCount}</span>
          </button>
        </div>
      )}

      {!loading && shown.length === 0 && !error && (
        <div className="deck-empty">
          <span className="deck-empty-emoji" aria-hidden="true">{filter === 'super' ? '⭐' : '🌷'}</span>
          <p className="q-done-note">
            {filter === 'all'
              ? 'Pas encore de like en attente. Continue à découvrir et sois toi-même — chaque profil que tu visites peut retomber amoureux de ton profil.'
              : filter === 'super'
                ? 'Aucun Super Like en attente — un ✶, c\u2019est la personne qui a voulu se démarquer pour toi.'
                : 'Aucun like simple en attente — regarde l\u2019onglet ✶ pour les Super Likes.'}
          </p>
          <a className="btn primary" href="#/discover">🔥 Aller découvrir</a>
        </div>
      )}

      <div className="likes-grid">
        {shown.map((l) => {
          const isRevealed = revealed.has(l.userId);
          const geo = countryMeta(l.country);
          return (
            <article key={l.userId} className={`likes-tile ${isRevealed ? 'revealed' : ''}`}>
              <button
                type="button"
                className="likes-tile-photo"
                onClick={() => reveal(l.userId)}
                aria-label={isRevealed ? `Voir le profil de ${l.displayName}` : 'Révéler qui t\u2019a liké'}
              >
                {l.photoUrl ? (
                  <img src={l.photoUrl} alt={isRevealed ? l.displayName : 'Profil masqué'} className={isRevealed && !l.photoBlurred ? '' : 'locked'} loading="lazy" />
                ) : (
                  <span className="likes-tile-empty">✨</span>
                )}
                {l.action === 'super' && <span className="tile-super" title="Super Like reçu">✶</span>}
                {!isRevealed && (
                  <span className="tile-lock" aria-hidden="true">
                    <em>🔒</em>
                    <strong>Appuie pour révéler</strong>
                  </span>
                )}
              </button>
              <div className="likes-tile-body">
                <strong>
                  {geo ? `${geo.flag} ` : ''}
                  {l.displayName}, {l.age}
                </strong>
                {l.personalityType && (
                  <span className="chip chip-pers" title="Son archétype de personnalité">
                    ✨ {ARCHETYPES[l.personalityType].name}
                    {l.personalityValidated ? ' ✓' : ''}
                  </span>
                )}
                <div className="btn-row">
                  {isInvisible ? (
                    <button type="button" className="btn primary small" disabled={busy} onClick={() => void respond(l, 'like')} title="Envoi une demande « Discuter » — acceptation = conversation">
                      ✉ Discuter
                    </button>
                  ) : (
                    <button type="button" className="btn primary small" disabled={busy} onClick={() => void respond(l, 'like')} title="Elle t'a déjà liké — match immédiat">
                      ♥ En retour
                    </button>
                  )}
                  <button type="button" className="btn ghost small" disabled={busy} onClick={() => void respond(l, 'pass')} title="Passer — discret, elle ne sera jamais notifiée">
                    ✕
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {data && <p className="hint">{data.note}</p>}

      {/* Écran « C'est un match ! » — identique à la Découverte */}
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
            <h2>C'est un match !</h2>
            <p>Vous vous êtes aimés — la conversation est déjà prête. Écris le premier message, c'est souvent lui qui fait la différence.</p>
            <div className="btn-col">
              <a className="btn primary" href="#/matches">💬 Voir mes matchs</a>
              <button type="button" className="btn ghost" onClick={() => setMatchModal(null)}>
                Continuer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

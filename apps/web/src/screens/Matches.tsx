/**
 * Mes matchs (Étape 5) — conversations nées de la découverte.
 *
 * Le chat temps réel (WebSocket, messages, voice notes) arrive en Étape 6 ;
 * ici : la liste des matchs, le MODE de chaque conversation (§4.8 — le mode
 * de la conversation régit le flou des photos, PAS le mode de découverte des
 * membres) et la PASSERELLE Classique → Invisible (§4.4) :
 *   - proposer depuis une conversation Classique ;
 *   - accepter / refuser une proposition reçue (refus = rien ne change, §4.6).
 */
import { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from '../lib/api';
import { useSwr } from '../lib/swr';
import { ARCHETYPES, type MatchListResponse } from '@wairyu/shared';

interface Props {
  /** Ouvre le chat temps réel (Étape 6) — conversation par id. */
  onOpenChat: (conversationId: string) => void;
}

const ORIGIN_LABELS: Record<string, string> = {
  like: 'Like mutuel',
  super: 'Super Like mutuel',
  invisible_request: 'Demande « Discuter » acceptée',
};

export function Matches({ onOpenChat }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  // Cache SWR : retour sur l'onglet = rendu instantané + revalidation en
  // arrière-plan (Task 28). La clé est propre à cette page — la passerelle
  // modifie l'état des matchs, donc on force un refresh après action.
  const { data, loading, error: swrError, refresh } = useSwr<MatchListResponse>(
    'matches',
    true,
    { ttlMs: 10_000 },
  );
  const load = refresh;

  useEffect(() => {
    if (swrError) setError(swrError);
  }, [swrError]);

  const showFlash = (msg: string) => {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 3000);
  };

  /** Proposer la passerelle sur une conversation Classique. */
  const proposeGateway = useCallback(
    async (matchId: string) => {
      setBusy(true);
      setError(null);
      try {
        const res = await api<{ ok: true; status: string }>(
          `/api/discover/matches/${matchId}/gateway`,
          { json: {} },
        );
        if (res.status === 'pending') {
          showFlash('Proposition envoyée — l’autre personne peut accepter ou refuser.');
          load(true); // l'état des matchs vient de changer — revalidation forcée
        }
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Erreur inattendue.');
      }
      setBusy(false);
    },
    [load],
  );

  /** Répondre à une passerelle reçue. */
  const respondGateway = useCallback(
    async (matchId: string, accept: boolean) => {
      setBusy(true);
      setError(null);
      try {
        const res = await api<{ ok: true; status: string; conversationMode: string }>(
          `/api/discover/matches/${matchId}/gateway/respond`,
          { json: { accept } },
        );
        if (res.status === 'accepted') {
          showFlash('Passerelle acceptée — vos photos sont re-floutées, l’historique est conservé.');
        } else {
          showFlash('Passerelle refusée — la conversation continue en Classique, rien n’a changé.');
        }
        await load(true); // accepté/refusé : l'état du match change forcément
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Erreur inattendue.');
      }
      setBusy(false);
    },
    [load],
  );

  return (
    <div className="app matches">
      <header className="wizard-head plain">
        <h1>Mes matchs</h1>
      </header>

      {data && <p className="hint mode-note">§ {data.note}</p>}
      {error && <p className="error">{error}</p>}
      {flash && <p className="flash-msg">{flash}</p>}

      {data === null && !error && (
        <p className="status"><span className="dot" /> Chargement de tes matchs…</p>
      )}

      {data && data.matches.length === 0 && (
        <p className="q-done-note">
          Aucun match pour l’instant. Continue à découvrir — le like est mutuel, la rencontre
          arrive vite.
        </p>
      )}

      <div className="match-list">
        {data?.matches.map((m) => (
          <article key={m.matchId} className="match-row">
            {m.other.photoUrl ? (
              <img
                src={m.other.photoUrl}
                alt={m.other.displayName}
                className={`match-photo ${m.other.photoBlurred ? 'blurred' : ''}`}
                loading="lazy"
              />
            ) : (
              <span className="match-photo empty">✨</span>
            )}
            <div className="match-body">
              <div className="match-head">
                <strong>
                  {m.other.displayName}
                  {m.other.verified && (
                    <span className="chip chip-verified" title="Selfie reviewé par l'équipe wairyu">
                      {' '}✓
                    </span>
                  )}
                </strong>
                <span className={`chip chip-conv ${m.originMode === 'interracial' && m.conversationMode === 'classic' ? 'interracial' : m.conversationMode}`} title={m.conversationMode === 'invisible' ? 'Conversation Invisible — photos floutées jusqu’à la révélation mutuelle' : m.originMode === 'interracial' ? 'Match né dans l’univers Interracial — photos visibles' : 'Match né dans l’univers Classique — photos visibles'}>
                  {m.conversationMode === 'invisible' ? 'Invisible' : m.originMode === 'interracial' ? 'Interracial' : 'Classique'}
                </span>
              </div>
              <p className="match-sub">
                {ORIGIN_LABELS[m.origin] ?? 'Match'} ·{' '}
                {new Date(m.createdAt * 1000).toLocaleDateString('fr-FR')}
                {m.other.personalityType && (
                  <>
                    {' · '}
                    <span className="chip chip-pers">
                      ✨ {ARCHETYPES[m.other.personalityType].name}
                      {m.other.personalityValidated ? ' ✓' : ''}
                    </span>
                  </>
                )}
              </p>
              {m.other.photoBlurred && m.conversationMode === 'invisible' && (
                <p className="hint">
                  Photos re-floutées jusqu’à la révélation mutuelle (≥ 15 messages et 7 jours).
                </p>
              )}

              {/* Passerelle Classique → Invisible (§4.4) */}
              {m.conversationMode === 'classic' && !m.pendingGateway && (
                <button
                  type="button" className="btn ghost" disabled={busy}
                  onClick={() => void proposeGateway(m.matchId)}
                  title="Les photos seront re-floutées pour vous deux, avec l’accord de l’autre"
                >
                  Proposer de passer en Invisible
                </button>
              )}
              {m.pendingGateway?.fromMe && (
                <span className="chip chip-status pending">Proposition envoyée — en attente</span>
              )}
              {m.pendingGateway && !m.pendingGateway.fromMe && (
                <div className="btn-row">
                  <p className="hint" style={{ width: '100%' }}>
                    {m.other.displayName} souhaite approfondir en Mode Invisible — les photos
                    seront re-floutées pour vous deux.
                  </p>
                  <button
                    type="button" className="btn primary" disabled={busy}
                    onClick={() => void respondGateway(m.matchId, true)}
                  >
                    Accepter
                  </button>
                  <button
                    type="button" className="btn ghost" disabled={busy}
                    onClick={() => void respondGateway(m.matchId, false)}
                  >
                    Refuser
                  </button>
                </div>
              )}

              {/* Chat temps réel (Étape 6) */}
              <button
                type="button" className="btn primary why-toggle"
                onClick={() => onOpenChat(m.conversationId)}
              >
                Ouvrir le chat →
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

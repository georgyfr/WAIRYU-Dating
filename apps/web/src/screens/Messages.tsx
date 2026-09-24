/**
 * Page Messages (expérience dating classique — demande fondateur).
 *
 * La boîte de réception : TOUTES les conversations actives, dernier message
 * en aperçu, compteur de non-lus, photo floutée selon le MODE DE LA
 * CONVERSATION (§4.8). Le chat temps réel (WebSocket, voice notes,
 * révélation) s'ouvre en plein écran (#/chat/:id) via l'onglet.
 *
 * Différence avec « Mes matchs » : là où la page Matchs gère les actions sur
 * le match (passerelle Classique → Invisible, modes), cette page est la
 * messagerie au quotidien — ce qu'on ouvre des dizaines de fois par jour.
 */
import { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from '../lib/api';
import type { ConversationLastMessage, ConversationListResponse } from '@wairyu/shared';

interface Props {
  onOpenChat: (conversationId: string) => void;
  onDiscover: () => void;
}

/** « 14:32 » aujourd'hui, « hier », sinon « 12 sept ». */
function timeLabel(ts: number): string {
  const d = new Date(ts * 1000);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }
  const yesterday = new Date(now.getTime() - 86_400_000);
  if (d.toDateString() === yesterday.toDateString()) return 'hier';
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function previewText(m: ConversationLastMessage): string {
  if (m.kind === 'voice') return '🎤 Message vocal';
  if (m.kind === 'system') return 'Mise à jour de la conversation';
  return m.excerpt;
}

export function Messages({ onOpenChat, onDiscover }: Props) {
  const [data, setData] = useState<ConversationListResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setError(null);
    try {
      setData(await api<ConversationListResponse>('/api/chat/conversations'));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur inattendue.');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  // Au retour du chat (ou du fond), la liste se rafraîchit — les non-lus
  // viennent d'être marqués lus par la conversation ouverte.
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === 'visible') void load();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [load]);

  return (
    <div className="app page-messages">
      <header className="wizard-head plain">
        <h1>Messages</h1>
      </header>

      {error && <p className="error">{error}</p>}
      {loading && (
        <p className="status">
          <span className="dot" /> Chargement de tes conversations…
        </p>
      )}

      {data && data.conversations.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon" aria-hidden="true">💬</span>
          <strong>Aucune conversation pour l'instant</strong>
          <p className="hint">{data.note}</p>
          <button type="button" className="btn primary" onClick={onDiscover}>
            Découvrir maintenant
          </button>
        </div>
      )}

      <div className="conv-list">
        {data?.conversations.map((cv) => (
          <button
            key={cv.conversationId}
            type="button"
            className={`conv-row ${cv.unread > 0 ? 'unread' : ''}`}
            onClick={() => onOpenChat(cv.conversationId)}
          >
            {cv.other.photoUrl ? (
              <img
                src={cv.other.photoUrl}
                alt={cv.other.displayName}
                className={`conv-photo ${cv.other.photoBlurred ? 'blurred' : ''}`}
                loading="lazy"
              />
            ) : (
              <span className="conv-photo empty" aria-hidden="true">✨</span>
            )}
            <span className="conv-body">
              <span className="conv-head">
                <strong className="conv-name">
                  {cv.other.displayName}
                  {cv.other.verified && (
                    <span className="chip chip-verified" title="Selfie reviewé par l'équipe wairyu">
                      {' '}✓
                    </span>
                  )}
                  <span className={`chip chip-conv ${cv.conversationMode}`}>
                    {cv.conversationMode === 'invisible' ? 'Invisible' : 'Classique'}
                  </span>
                </strong>
                <time>{timeLabel(cv.lastMessage?.createdAt ?? cv.lastActivityAt)}</time>
              </span>
              <span className="conv-preview">
                {cv.lastMessage ? (
                  <>
                    {cv.lastMessage.fromMe && <span className="conv-you">Vous : </span>}
                    {previewText(cv.lastMessage) || '…'}
                  </>
                ) : (
                  <em>Nouveau match — dis bonjour !</em>
                )}
              </span>
            </span>
            {cv.unread > 0 && <span className="conv-badge">{cv.unread > 9 ? '9+' : cv.unread}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

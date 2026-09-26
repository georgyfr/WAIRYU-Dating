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
import { useEffect } from 'react';
import { useSwr } from '../lib/swr';
import { convChip } from '../lib/conv-origin';
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
  // Cache SWR partagé avec le badge de l'onglet (App) : au retour sur cette
  // page, la liste s'affiche INSTANTANÉMENT depuis le cache puis se
  // revalide en arrière-plan (Task 28 — plus de spinner à chaque clic).
  const { data, loading, error, refresh } = useSwr<ConversationListResponse>(
    'conversations',
    true,
    { ttlMs: 10_000 },
  );

  // Au retour du chat (ou du fond), la liste se rafraîchit — les non-lus
  // viennent d'être marqués lus par la conversation ouverte (revalidation
  // forcée : l'utilisateur revient JUSTE pour voir ça).
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === 'visible') refresh(true);
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [refresh]);

  return (
    <div className="app page-messages">
      <header className="wizard-head plain">
        <h1>Messages</h1>
      </header>

      {/* Task 47 — pédagogie multi-univers : UNE boîte pour les 3 univers ;
          les conversations te suivent quand tu changes de mode (§4.8). */}
      <p className="messages-hint">
        Une seule boîte pour tes univers Classique, Invisible et Interracial — tes
        conversations te suivent quand tu changes de mode.
      </p>

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
                  {/* Task 47 : le badge priorise le MODE DU CHAT (flou §4.8),
                      sinon il montre l'univers d'origine (Interracial). */}
                  {(() => {
                    const chip = convChip(cv.conversationMode, cv.originMode);
                    return (
                      <span className={`chip chip-conv ${chip.cls}`} title={chip.title}>
                        {chip.label}
                      </span>
                    );
                  })()}
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

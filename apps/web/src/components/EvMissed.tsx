/**
 * Modale « Missed Connections » (Task 39) — les personnes croisées lors
 * d'un événement wairyu : on se like, et si c'est mutuel le chat se
 * débloque (règle produit — comme le Rituel du Mode Invisible, le like
 * doit être réciproque).
 *
 * Aperçu : la liste est de la donnée de démonstration (EV_MISSED), les
 * likes envoyés sont confirmés par toast ; le déblocage réel du chat
 * arrivera avec le backend événementiel. Modale partagée par Events et
 * Moments (bouton de chaque souvenir).
 */
import { useState } from 'react';
import { toast } from '../lib/toast';
import { EV_MISSED, initials } from '../lib/events';

interface Props {
  onClose: () => void;
}

export function EvMissed({ onClose }: Props) {
  // Likes envoyés localement (session) — le cœur se remplit, feedback immédiat.
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  const sendLike = (id: string, name: string) => {
    if (liked[id]) return;
    setLiked((prev) => ({ ...prev, [id]: true }));
    toast(`❤️ Like envoyé à ${name} — s'il est mutuel, le chat se débloque !`, 'success');
  };

  return (
    <div className="modal-overlay ev-overlay" onClick={onClose}>
      <div
        className="modal-card ev-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Missed Connections"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head ev-modal-head">
          <h2>💫 Missed Connections</h2>
          <button type="button" className="modal-close ev-close" onClick={onClose} aria-label="Fermer">
            ×
          </button>
        </div>
        <div className="modal-body ev-modal-body">
          <p className="ev-missed-intro">
            Tu as croisé quelqu'un à un événement sans oser lui parler ? Retrouve
            ici les participants de tes événements passés : un like, et si
            c'est mutuel, le chat s'ouvre.
          </p>
          <div className="ev-missed-list">
            {EV_MISSED.map((m) => (
              <div key={m.id} className="ev-missed-row">
                <span className="ev-avatar" style={{ background: `hsl(${m.hue} 55% 30%)` }}>
                  {initials(m.name)}
                </span>
                <span className="ev-missed-who">
                  <strong>{m.name}</strong>
                  <small>{m.event}</small>
                </span>
                <button
                  type="button"
                  className={`ev-heart ${liked[m.id] ? 'sent' : ''}`}
                  onClick={() => sendLike(m.id, m.name)}
                  aria-label={`Like envoyé à ${m.name}`}
                  aria-pressed={!!liked[m.id]}
                >
                  {liked[m.id] ? '💖' : '❤️'}
                </button>
              </div>
            ))}
          </div>
          <p className="ev-preview-note">
            Aperçu — les participants réels de tes événements apparaîtront ici
            après le premier check-in scanné.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Modale de CHECK-IN « Wairyu Moments » (Task 39) — billetterie avec QR code.
 *
 * Le QR est DÉCORATIF (aperçu — le scan réel sur place arrivera avec le
 * backend événementiel) mais déjà DÉTERMINISTE par billet : le même code
 * affiche toujours la même grille (PRNG seedé, lib/events.ts qrGrid), avec
 * les trois repères de coin d'un vrai QR. Le code alphanumérique WRYU-XXXX
 * est stable par événement (persisté dans localStorage).
 *
 * Modale partagée : ouverte après une réservation (Events) ou depuis
 * « Mes billets » (MyEvents).
 */
import { evDateLong, qrGrid, type EvEvent } from '../lib/events';

interface Props {
  event: EvEvent;
  code: string;
  onClose: () => void;
}

export function EvCheckin({ event, code, onClose }: Props) {
  const grid = qrGrid(code);
  return (
    <div className="modal-overlay ev-overlay" onClick={onClose}>
      <div
        className="modal-card ev-modal ev-checkin-card"
        role="dialog"
        aria-modal="true"
        aria-label={`Billet — ${event.title}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head ev-modal-head">
          <h2>🎟️ Ton billet</h2>
          <button type="button" className="modal-close ev-close" onClick={onClose} aria-label="Fermer">
            ×
          </button>
        </div>
        <div className="modal-body ev-modal-body">
          <p className="ev-checkin-event">
            <span className="ev-checkin-emoji">{event.emoji}</span>
            <span>
              <strong>{event.title}</strong>
              <br />
              <span className="ev-checkin-meta">
                {evDateLong(event.dateISO)} · {event.time} — {event.place}
              </span>
            </span>
          </p>

          <div className="ev-checkin-qr-wrap">
            <div className="checkin-qr" aria-hidden="true">
              {grid.map((filled, i) => (
                <span key={i} className={filled ? 'checkin-qr-cell' : 'checkin-qr-cell empty'} />
              ))}
            </div>
            <p className="checkin-code" id="checkin-code">
              {code}
            </p>
            <p className="ev-checkin-hint">
              Présente ce QR à l'entrée — scan rapide, zéro file d'attente.
            </p>
          </div>

          <div className="ev-checkin-actions">
            <button
              type="button"
              className="ev-btn ev-btn-ghost"
              onClick={() => {
                try {
                  void navigator.clipboard?.writeText(code);
                } catch {
                  /* presse-papiers indisponible — le code reste affiché */
                }
              }}
            >
              📋 Copier le code
            </button>
            <button type="button" className="ev-btn ev-btn-ghost" onClick={onClose}>
              📅 Ajouter au calendrier
            </button>
          </div>
          <p className="ev-preview-note">
            Aperçu Wairyu Moments — le QR scannable sur place activera avec la billetterie réelle.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Avertissement avant partage de la carte (demande fondateur) : au clic sur
 * « Partager ma carte », la personne choisit « Oui, je partage ma carte » ou
 * « Non, je la garde pour moi » — le partage n'a lieu que sur confirmation.
 *
 * Texte honnête : la feuille de partage système OU le presse-papiers ;
 * « Wairyu ne publie rien ».
 *
 * A11Y (pattern WorldModal) : focus initial sur « Non, je la garde pour moi »,
 * piège Tab, Échap, clic fond, focus RESTITUÉ au déclencheur, body.no-scroll.
 *
 * RECONSTITUTION (5ᵉ reset sandbox) — fidèle au bundle staging Task 27.
 */

import { useEffect, useRef } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import type { CartePartageable } from './CarteTypes';

interface Props {
  carte: CartePartageable;
  /** Confirmé : « Oui, je partage ma carte ». */
  onConfirm: () => void;
  /** Refusé / Échap / clic fond : « Non, je la garde pour moi ». */
  onClose: () => void;
}

export default function PartageCarteModal({ carte, onConfirm, onClose }: Props) {
  const { tx } = useI18n();
  const refModal = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const declencheur = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const modal = refModal.current;
    const aGarder = modal?.querySelector<HTMLButtonElement>('.sh-keep');
    aGarder?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'Tab' && modal) {
        const focusables = Array.from(
          modal.querySelectorAll<HTMLElement>('button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'),
        );
        if (focusables.length === 0) return;
        const premier = focusables[0];
        const dernier = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === premier) {
          e.preventDefault();
          dernier.focus();
        } else if (!e.shiftKey && document.activeElement === dernier) {
          e.preventDefault();
          premier.focus();
        }
      }
    };

    document.addEventListener('keydown', onKey);
    document.body.classList.add('no-scroll');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('no-scroll');
      declencheur?.focus();
    };
  }, [onClose]);

  return (
    <div className="sh-overlay" onClick={onClose}>
      <div
        ref={refModal}
        className="sh-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sh-title"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="sh-kicker" aria-hidden="true">
          {tx('Avant de partager')}
        </p>
        <h2 className="sh-title" id="sh-title">
          {tx('Partager ta carte ?')}
        </h2>
        <p className="sh-text">
          {tx('Ta carte complète —')} <strong>{carte.nom}</strong>
          {tx(
            ", ta lumière, ta zone d'ombre et ta tension intérieure — sera préparée en texte. Selon ton appareil, une feuille de partage s'ouvrira pour l'envoyer où tu veux (messagerie, email…), ou elle sera copiée dans le presse-papiers, prête à coller.",
          )}
        </p>
        <p className="sh-text sh-text-strong">
          {tx(
            "Wairyu ne publie rien : ta carte part uniquement si tu l'envoies toi-même. Qui la reçoit pourra la lire et la garder.",
          )}
        </p>
        <div className="sh-actions">
          <button type="button" className="btn btn-accent" onClick={onConfirm}>
            {tx('Oui, je partage ma carte')}
          </button>
          <button type="button" className="btn btn-ghost sh-keep" onClick={onClose}>
            {tx('Non, je la garde pour moi')}
          </button>
        </div>
      </div>
    </div>
  );
}

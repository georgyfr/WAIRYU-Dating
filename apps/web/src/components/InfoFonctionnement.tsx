/**
 * LE POP-UP EXPLICATIF DE LA QUÊTE 1.7 « TON FONCTIONNEMENT » — les mots, en clair.
 *
 * DEMANDE FONDATEUR (Task 95, verbatim au worklog) : « pourquoi même pas avec
 * un bouton pop-up qui essaie d'expliquer ce que c'est afin de mieux faciliter
 * le choix des décisions de la personne » — et : « je ne sais vraiment pas à
 * quoi cela sert au niveau de la quête » → le mode 'tous' porte AUSSI le
 * pourquoi de la question (INFO_17.pourquoi).
 *
 * DEUX MODES :
 *  - index (0-3)  : UNE phrase — la phrase simple cochable en titre (celle du
 *    bouton « ? »), l'explication simple en corps : sa première phrase NOMME le
 *    mot technique du Livrable et le décode aussitôt (Task 96 — aucun jargon
 *    hors du pop-up ; EXPLIQUES_17 — déjà dans la langue courante, ne JAMAIS
 *    repasser par tx()) ;
 *  - 'tous'       : le glossaire — chapeau, pourquoi, les 4 mots un par un
 *    (chacun rappelle la phrase simple cochable), la garde honnête.
 *
 * A11Y : même contrat que InfoRecolteModal / WorldModal (role=dialog, focus
 * initial sur ×, piège Tab, Échap, clic fond, focus restitué, body no-scroll).
 *
 * Apostrophes U+0027 (audit Task 25) — les clés FR de tx() incluses.
 */

import { useEffect, useRef } from 'react';
import { EXPLIQUES_17, INFO_17, QUESTIONS_17 } from '../lib/quete-1-7';
import { useI18n } from '../i18n/I18nProvider';

export default function InfoFonctionnement({
  index,
  onClose,
}: {
  /** L'option expliquée (0-3 — les options avec mot technique) ou 'tous' (glossaire). */
  index: number | 'tous';
  onClose: () => void;
}) {
  const { tx } = useI18n();
  const refModal = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const declencheur = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const modal = refModal.current;
    const fermer = modal?.querySelector<HTMLButtonElement>('.if-fermer');
    fermer?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'Tab' && modal) {
        const focusables = Array.from(
          modal.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          ),
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

  const glossaire = index === 'tous';
  const cible = glossaire ? null : EXPLIQUES_17[index];

  return (
    <div className="w-overlay" onClick={onClose} role="presentation">
      <div
        ref={refModal}
        className="w-modal if-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="if-titre"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-modal-head">
          <div className="w-modal-title">
            <small>{glossaire ? tx('Pour t\x27aider à choisir') : tx('En clair')}</small>
            <h2 id="if-titre">
              {glossaire ? INFO_17.titre : (QUESTIONS_17[0].options[index] ?? '')}
            </h2>
          </div>
          <button
            type="button"
            className="w-modal-close if-fermer"
            onClick={onClose}
            aria-label={tx('Fermer l\x27explication')}
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="w-modal-body if-body">
          {glossaire ? (
            <>
              <p className="if-chapeau">{INFO_17.chapeau}</p>
              <h3 className="if-h3">{tx('Pourquoi on te demande ça')}</h3>
              <ul className="if-points">
                {INFO_17.pourquoi.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <h3 className="if-h3">{tx('Les mots, un par un')}</h3>
              {EXPLIQUES_17.map(
                (e, i) =>
                  e && (
                    <div key={e.terme} className="if-entree">
                      <strong>{QUESTIONS_17[0].options[i]}</strong>
                      <p>{e.expli}</p>
                    </div>
                  ),
              )}
            </>
          ) : (
            <p className="if-expli">{cible?.expli ?? ''}</p>
          )}
          <p className="if-garde">{INFO_17.garde}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Bandeau « Nouvelle version disponible » (Task 44 — changements immédiats).
 *
 * Monté une seule fois dans App, à côté de <ToastHost />. Écoute la veille
 * appVersion.startUpdatePolling : dès qu'un nouveau déploiement est détecté
 * (signature des bundles déployés ≠ bundles chargés), une pilule fixe propose
 * « Recharger » — 1 clic et l'utilisateur est sur la nouvelle version, sans
 * F5, sans cache-buster, sans rouvrir l'app.
 *
 * Le rechargement reste DÉCIDIÉ par l'utilisateur : un rechargement
 * automatique pourrait effacer un message en cours d'écriture, une bio à
 * moitié tapée ou un formulaire d'événement. « Plus tard » met la pilule
 * sous silence 10 minutes (le reste de l'app continue de fonctionner).
 *
 * Position : bas-droite desktop, au-dessus de la barre d'onglets en mobile.
 * z-index 80 : SOUS les modales (90) et les toasts (200) pour ne jamais
 * gêner un formulaire ouvert — la pilule réapparaît dès la fermeture.
 */

import { useEffect, useState } from 'react';
import { startUpdatePolling } from '../lib/appVersion';

const SNOOZE_MS = 10 * 60 * 1000;

export function UpdateToast() {
  const [available, setAvailable] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => startUpdatePolling(() => setAvailable(true)), []);

  // Nouvelle détection → la pilule réapparaît (sauf snooze en cours, géré
  // par le timeout ci-dessous qui remet shown à true).
  useEffect(() => {
    if (available) setShown(true);
  }, [available]);

  if (!available || !shown) return null;

  const snooze = () => {
    setShown(false);
    window.setTimeout(() => setShown(true), SNOOZE_MS);
  };

  return (
    <div className="upd-toast" role="status" aria-live="polite">
      <span className="upd-dot" aria-hidden="true" />
      <span className="upd-txt">Nouvelle version disponible</span>
      <button type="button" className="upd-btn" onClick={() => window.location.reload()}>
        Recharger
      </button>
      <button type="button" className="upd-later" onClick={snooze}>
        Plus tard
      </button>
    </div>
  );
}

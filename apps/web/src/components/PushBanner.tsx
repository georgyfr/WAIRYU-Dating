/**
 * PushBanner (Task 53 — demande fondateur : « une notification qui n'apparaît
 * pas ne sert à rien »). Auparavant, l'activation Web Push ne se trouvait
 * QUE dans Paramètres (Account) — personne ne la trouvait, et les secrets
 * VAPID étaient absents : zéro notification délivrée depuis le début.
 *
 * Bannière discrète en bas de l'écran (comme la demande de WhatsApp Web),
 * proposée UNE fois par appareil tant que la permission est 'default' :
 *   - « Activer » → activateWebPush() (permission + subscribe + serveur)
 *   - ✕ → plus jamais proposée sur cet appareil (localStorage)
 * Permission déjà accordée → silencieuse. Refusée → silencieuse aussi
 * (le navigateur a déjà marqué le site ; on ne re-demande pas en boucle).
 *
 * 100 % additif : la section Paramètres (Account) garde son propre chemin.
 */

import { useEffect, useState } from 'react';
import { activateWebPush, pushSupported } from '../lib/push-client';
import { toast } from '../lib/toast';

const DISMISS_KEY = 'wairyu_push_prompt_dismissed';

export default function PushBanner() {
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!pushSupported()) return;
    if (Notification.permission !== 'default') return;
    try {
      if (localStorage.getItem(DISMISS_KEY) === '1') return;
    } catch {
      /* privacy mode — la bannière restera proposée (bénin) */
    }
    setVisible(true);
  }, []);

  if (!visible) return null;

  async function activate() {
    setBusy(true);
    const res = await activateWebPush();
    setBusy(false);
    if (res === 'granted') {
      setVisible(false);
      try {
        localStorage.setItem(DISMISS_KEY, '1');
      } catch {
        /* bénin */
      }
      toast('Notifications activées — tu ne manqueras plus aucun message ✨', 'success');
    } else if (res === 'denied') {
      toast('Permission refusée — tu peux la réactiver dans Paramètres.', 'error');
      setVisible(false);
    } else if (res === 'server-off') {
      toast('Notifications pas encore disponibles sur ce serveur.', 'info');
    } else {
      toast('Activation impossible sur ce navigateur.', 'error');
    }
  }

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* bénin */
    }
  }

  return (
    <div className="pushbanner" role="region" aria-label="Activer les notifications">
      <span className="pushbanner-bell" aria-hidden="true">🔔</span>
      <div className="pushbanner-txt">
        <strong>Ne manque plus aucun message</strong>
        <small>Reçois une alerte comme un SMS — même app fermée, sur téléphone et ordinateur.</small>
      </div>
      <div className="pushbanner-actions">
        <button type="button" className="btn primary" onClick={() => void activate()} disabled={busy}>
          {busy ? 'Activation…' : 'Activer'}
        </button>
        <button type="button" className="pushbanner-x" aria-label="Ne plus afficher" onClick={dismiss}>
          ✕
        </button>
      </div>
    </div>
  );
}

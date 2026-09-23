/**
 * Widget Cloudflare Turnstile (Étape 2) — chargement explicite + rendu React.
 * Le jeton est transmis au serveur (vérification siteverify côté Worker).
 *
 * Robustesse (retour fondateur : widget « Bloqué » sans issue) : quand le défi
 * échoue, Turnstile retente seul les erreurs transitoires (retry auto). Pour
 * les échecs définitifs (extensions, VPN, réseau filtré), on affiche un message
 * d'aide + un bouton « Réessayer » qui re-rend le widget à l'identique.
 */
import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id: string) => void;
    };
  }
}

let scriptPromise: Promise<void> | null = null;

function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('turnstile_load_failed'));
      document.head.appendChild(s);
    });
  }
  return scriptPromise;
}

interface TurnstileProps {
  siteKey: string;
  onToken: (token: string | null) => void;
}

export function Turnstile({ siteKey, onToken }: TurnstileProps) {
  const holder = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  // Dernier callback conservé (évite les re-rendus du widget).
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;
  // Échec du défi (code Turnstile ou « chargement ») → aide + bouton Réessayer.
  const [failed, setFailed] = useState<string | null>(null);
  // Incrémenté pour forcer le re-rendu complet du widget (cleanup + render).
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setFailed(null);
    loadTurnstile()
      .then(() => {
        if (cancelled || !holder.current || !window.turnstile) return;
        widgetId.current = window.turnstile.render(holder.current, {
          sitekey: siteKey,
          callback: (token: string) => {
            setFailed(null);
            onTokenRef.current(token);
          },
          'expired-callback': () => onTokenRef.current(null),
          'error-callback': (code?: string) => {
            // Pas de retour « true » : on garde l'affichage natif (lien
            // « Résolution de problèmes ») en ajoutant notre aide dessous.
            onTokenRef.current(null);
            setFailed(code ?? 'erreur');
          },
          theme: 'light',
          language: 'fr',
          // Turnstile relance seul les erreurs transitoires (réseau, timeout).
          retry: 'auto',
          'retry-interval': 3000,
        });
      })
      .catch(() => {
        onTokenRef.current(null);
        setFailed('chargement');
      });
    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetId.current);
        } catch {
          /* widget déjà parti */
        }
        widgetId.current = null;
      }
    };
  }, [siteKey, attempt]);

  return (
    <div className="turnstile-wrap">
      <div ref={holder} className="turnstile" />
      {failed !== null && (
        <div className="turnstile-help">
          <p className="turnstile-hint">
            Vérification anti-robot bloquée — souvent un VPN, un bloqueur de publicité ou
            un réseau filtré. Recharge la page ou réessaie ci-dessous.
          </p>
          <button
            type="button"
            className="btn ghost turnstile-retry"
            onClick={() => setAttempt((a) => a + 1)}
          >
            Réessayer la vérification
          </button>
        </div>
      )}
    </div>
  );
}

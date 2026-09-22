/**
 * Widget Cloudflare Turnstile (Étape 2) — chargement explicite + rendu React.
 * Le jeton est transmis au serveur (vérification siteverify côté Worker).
 */
import { useEffect, useRef } from 'react';

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

  useEffect(() => {
    let cancelled = false;
    loadTurnstile()
      .then(() => {
        if (cancelled || !holder.current || !window.turnstile) return;
        widgetId.current = window.turnstile.render(holder.current, {
          sitekey: siteKey,
          callback: (token: string) => onTokenRef.current(token),
          'expired-callback': () => onTokenRef.current(null),
          'error-callback': () => onTokenRef.current(null),
          theme: 'light',
          language: 'fr',
        });
      })
      .catch(() => onTokenRef.current(null));
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
  }, [siteKey]);

  return <div ref={holder} className="turnstile" />;
}

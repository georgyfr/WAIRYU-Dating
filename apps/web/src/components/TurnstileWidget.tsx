/**
 * Widget Cloudflare Turnstile (Étape 2).
 * Rendu UNIQUEMENT si une clé de site est servie par /api/auth/config.
 * Le jeton obtenu accompagne les requêtes sensibles (demande OTP, inscription
 * mot de passe) ; le Worker le valide via siteverify (jamais de confiance au
 * client). En staging sans secret, la vérification serveur est sautée — le
 * widget reste rendu si la clé est posée.
 */
import { useEffect, useRef, useState } from 'react';

interface TurnstileApi {
  render: (
    el: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      'error-callback'?: () => void;
      'expired-callback'?: () => void;
      theme?: 'light' | 'dark' | 'auto';
    },
  ) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_ID = 'cf-turnstile-script';
const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

function loadTurnstileScript(): Promise<TurnstileApi> {
  return new Promise((resolve, reject) => {
    if (window.turnstile) return resolve(window.turnstile);
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    const onReady = () => {
      if (window.turnstile) resolve(window.turnstile);
      else reject(new Error('turnstile_missing'));
    };
    if (existing) {
      existing.addEventListener('load', onReady);
      existing.addEventListener('error', () => reject(new Error('turnstile_load_failed')));
      return;
    }
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = TURNSTILE_SRC;
    script.async = true;
    script.defer = true;
    script.addEventListener('load', onReady);
    script.addEventListener('error', () => reject(new Error('turnstile_load_failed')));
    document.head.appendChild(script);
  });
}

interface Props {
  siteKey: string;
  /** Remonté au parent à chaque jeton valide (null après expiration/erreur). */
  onToken: (token: string | null) => void;
}

export default function TurnstileWidget({ siteKey, onToken }: Props) {
  const holderRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void loadTurnstileScript()
      .then((ts) => {
        if (cancelled || !holderRef.current || widgetIdRef.current !== null) return;
        widgetIdRef.current = ts.render(holderRef.current, {
          sitekey: siteKey,
          theme: 'light',
          callback: (token) => onToken(token),
          'expired-callback': () => onToken(null),
          'error-callback': () => {
            onToken(null);
            setFailed(true);
          },
        });
      })
      .catch(() => setFailed(true));
    return () => {
      cancelled = true;
      if (widgetIdRef.current !== null && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          /* bénin */
        }
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, onToken]);

  if (failed) return null; // Dégradation silencieuse : le serveur décidera.
  return <div ref={holderRef} className="turnstile-holder" aria-label="Vérification anti-robot" />;
}

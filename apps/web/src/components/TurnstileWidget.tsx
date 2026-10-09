/**
 * Widget Cloudflare Turnstile (Étape 2).
 * Rendu UNIQUEMENT si une clé de site est servie par /api/auth/config.
 * Le jeton obtenu accompagne les requêtes sensibles (demande OTP, inscription
 * mot de passe) ; le Worker le valide via siteverify (jamais de confiance au
 * client). En staging sans secret, la vérification serveur est sautée — le
 * widget reste rendu si la clé est posée.
 */
import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';

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

/**
 * Charge le script Turnstile UNE fois par page ; en cas d'échec réseau, le
 * <script> mort est retiré du DOM et le cache est réinitialisé afin qu'une
 * relance (« Réessayer la vérification ») reparte sur un chargement frais
 * — sinon l'écouteur resterait collé à l'élément mort et bloquerait à jamais.
 */
let scriptPromise: Promise<TurnstileApi> | null = null;

function loadTurnstileScript(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<TurnstileApi>((resolve, reject) => {
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = TURNSTILE_SRC;
    script.async = true;
    script.defer = true;
    script.addEventListener('load', () => {
      if (window.turnstile) resolve(window.turnstile);
      else {
        script.remove();
        scriptPromise = null;
        reject(new Error('turnstile_missing'));
      }
    });
    script.addEventListener('error', () => {
      script.remove();
      scriptPromise = null;
      reject(new Error('turnstile_load_failed'));
    });
    document.head.appendChild(script);
  });
  return scriptPromise;
}

interface Props {
  siteKey: string;
  /** Remonté au parent à chaque jeton valide (null après expiration/erreur). */
  onToken: (token: string | null) => void;
}

export default function TurnstileWidget({ siteKey, onToken }: Props) {
  const { tx } = useI18n();
  const holderRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

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
  }, [siteKey, onToken, attempt]);

  if (failed) {
    // Dégradation visible : sans jeton le serveur refusera la demande
    // (fail-closed) — mieux vaut un retry explicite qu'une impasse muette.
    return (
      <div className="turnstile-retry" role="alert">
        <p className="turnstile-retry-text">{tx('Vérification anti-robot indisponible (connexion instable\u00A0?).')}</p>
        <button
          type="button"
          className="btn btn-ghost btn-block"
          onClick={() => {
            setFailed(false);
            setAttempt((a) => a + 1);
          }}
        >
          {tx('Réessayer la vérification')}
        </button>
      </div>
    );
  }
  return <div ref={holderRef} className="turnstile-holder" aria-label={tx('Vérification anti-robot')} />;
}

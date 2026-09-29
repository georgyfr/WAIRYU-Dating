/**
 * Boutons de connexion sociale (Google + Facebook) — Étape 2-bis, Task 57.
 *
 * Google : le bouton GSI (Google Identity Services, popup FedCM) rend le
 * jeton ID DANS la page → POST /api/auth/google/idtoken — ZÉRO navigation
 * hors de l'app. C'est le correctif du crash TWA (Task 56-b) : le flux
 * authorize à redirection cassait dans l'enveloppe Android quand la fenêtre
 * de consentement Google se refermait sans retour. Le bouton natif charge
 * accounts.google.com/gsi/client en lazy ; si le rendu échoue (bloqueur,
 * iframe <40 px de large) on retombe sur le parcours navigateur historique.
 * « La fenêtre Google ne s'ouvre pas ? Continuer via le navigateur » est
 * TOUJOURS affiché en secours sous le bouton GSI.
 *
 * Facebook : parcours OAuth redirect inchangé (aucun crash constaté).
 *
 * Sur l'écran d'inscription, le consentement (18+ et CGU) est exigé avant de
 * lancer le parcours social — le fournisseur ne crée jamais un compte sans
 * le consentement wairyu (Task 57 : Google GSI désactivé tant que les cases
 * ne sont pas cochées, message explicatif sur le bouton).
 */
import { useEffect, useRef, useState } from 'react';
import { api } from './api';
import type { AuthConfigResponse } from '@wairyu/shared';

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0 0 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function FacebookGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#fff"
        d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.49h-2.8V24C19.62 23.1 24 18.1 24 12.07z"
      />
    </svg>
  );
}

interface SocialButtonsProps {
  config: AuthConfigResponse | null;
  /** true = le parcours social est bloqué (consentement manquant à l'inscription). */
  requireConsent?: boolean;
  onConsentBlocked?: () => void;
}

// Task 56-b : verrou anti double-appui (module-level, survit aux re-rendus).
// Deux départs rapprochés écrasent le cookie d'état OAuth (nouveau verifier
// PKCE) et consomment le premier code → « session invalide » ou code usagé.
let socialStartLock = false;

// --- GSI : chargement lazy du SDK accounts.google.com -----------------------
interface GoogleIdApi {
  initialize: (opts: {
    client_id: string;
    use_fedcm_for_prompt?: boolean;
    callback: (response: { credential: string }) => void;
  }) => void;
  renderButton: (
    parent: HTMLElement,
    opts: { theme?: string; size?: string; shape?: string; text?: string; locale?: string },
  ) => void;
}

interface GsiWindow extends Window {
  google?: { accounts?: { id?: GoogleIdApi } };
}

let gsiPromise: Promise<GoogleIdApi | null> | null = null;

function loadGsi(): Promise<GoogleIdApi | null> {
  if (gsiPromise) return gsiPromise;
  gsiPromise = new Promise((resolve) => {
    const w = window as GsiWindow;
    const done = () => resolve(w.google?.accounts?.id ?? null);
    if (w.google?.accounts?.id) {
      done();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = done;
    script.onerror = done; // échec de chargement = resolve(null) → fallback
    setTimeout(done, 8000); // réseau coupé → fallback plutôt que suspendu
    document.head.appendChild(script);
  });
  return gsiPromise;
}

export function SocialButtons({ config, requireConsent, onConsentBlocked }: SocialButtonsProps) {
  const [gsiState, setGsiState] = useState<'loading' | 'ready' | 'failed'>('loading');
  const [error, setError] = useState<string | null>(null);
  const gsiRef = useRef<HTMLDivElement | null>(null);
  const failTimer = useRef<number | null>(null);

  function start(provider: 'google' | 'facebook') {
    if (requireConsent) {
      onConsentBlocked?.();
      return;
    }
    if (socialStartLock) return;
    socialStartLock = true;
    setTimeout(() => {
      socialStartLock = false;
    }, 4000);
    // Parcours OAuth complet : redirection top-level vers le worker.
    window.location.href = `/api/auth/${provider}/start`;
  }

  // Task 57 — bouton GSI natif (popup FedCM, zéro navigation hors de la page).
  async function handleCredential(credential: string) {
    setError(null);
    try {
      await api('/api/auth/google/idtoken', { json: { credential } });
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue.');
    }
  }

  const gsiUsable = Boolean(config?.googleEnabled && config?.googleClientId) && !requireConsent;

  useEffect(() => {
    if (!gsiUsable || gsiState === 'failed') return;
    let cancelled = false;
    void loadGsi().then((idApi) => {
      if (cancelled) return;
      if (!idApi || !gsiRef.current) {
        setGsiState('failed');
        return;
      }
      try {
        idApi.initialize({
          client_id: config?.googleClientId ?? '',
          use_fedcm_for_prompt: true,
          callback: (response) => void handleCredential(response.credential),
        });
        idApi.renderButton(gsiRef.current, {
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          text: 'continue_with',
          locale: 'fr',
        });
        setGsiState('ready');
        // Détection de rendu fantôme : si l'iframe GSI n'a même pas 40 px de
        // large après 2,5 s (bloqueur, CSP, réseau), on retombe sur le bouton
        // navigateur historique — l'utilisateur n'est JAMAIS coincé.
        failTimer.current = window.setTimeout(() => {
          const width =
            gsiRef.current?.querySelector('iframe')?.getBoundingClientRect().width ?? 0;
          if (width < 40) setGsiState('failed');
        }, 2500);
      } catch {
        setGsiState('failed');
      }
    });
    return () => {
      cancelled = true;
      if (failTimer.current !== null) window.clearTimeout(failTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gsiUsable, gsiState]);

  return (
    <>
      <div className="social-divider">
        <span>ou</span>
      </div>
      <div className="social-row">
        {config?.googleEnabled ? (
          requireConsent ? (
            <button
              type="button"
              className="btn google disabled"
              onClick={onConsentBlocked}
              title="Coche d'abord 18+ et CGU pour activer la connexion Google."
            >
              <GoogleGlyph /> Continuer avec Google
            </button>
          ) : (
            <div className="gsi-wrap">
              <div ref={gsiRef} className={gsiState === 'ready' ? 'gsi-slot' : 'gsi-slot gsi-hidden'} />
              {gsiState === 'ready' && (
                <>
                  <button type="button" className="social-alt" onClick={() => start('google')}>
                    La fenêtre Google ne s'ouvre pas ? Continuer via le navigateur
                  </button>
                  {error && <p className="error">{error}</p>}
                </>
              )}
              {gsiState !== 'ready' && (
                <button type="button" className="btn google" onClick={() => start('google')}>
                  <GoogleGlyph /> Continuer avec Google
                </button>
              )}
            </div>
          )
        ) : (
          <button
            type="button"
            className="btn google disabled"
            disabled
            title="Activation en cours côté wairyu — en attendant, utilise le code email."
          >
            <GoogleGlyph /> Continuer avec Google — bientôt
          </button>
        )}

        {config?.facebookEnabled ? (
          <button type="button" className="btn facebook" onClick={() => start('facebook')}>
            <FacebookGlyph /> Continuer avec Facebook
          </button>
        ) : (
          <button
            type="button"
            className="btn facebook disabled"
            disabled
            title="Activation en cours côté wairyu — en attendant, utilise le code email."
          >
            <FacebookGlyph /> Continuer avec Facebook — bientôt
          </button>
        )}
      </div>
    </>
  );
}

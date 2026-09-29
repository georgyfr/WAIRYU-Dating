/**
 * Boutons de connexion sociale (Google + Facebook) — Étape 2-bis.
 * Actifs quand le fournisseur est configuré côté serveur (via /api/auth/config),
 * sinon affichés en état « bientôt » désactivé. Sur l'écran d'inscription, le
 * consentement (18+ et CGU) est exigé avant de lancer le parcours social —
 * le fournisseur ne crée jamais un compte sans le consentement wairyu.
 *
 * Task 57 — connexion Google en popup FedCM (bouton officiel GSI) :
 * dans l'app Android (TWA), l'ancien flux de redirection top-level vers
 * accounts.google.com faisait SORTIR l'utilisateur de l'app — sur certains
 * téléphones (tueurs de tâches agressifs HiOS/XOS/MIUI, crash Custom Tabs
 * documentés) l'Activity wairyu est fermée pendant la connexion et
 * l'utilisateur revient au launcher : « l'application se referme toute seule ».
 * Le bouton officiel « Se connecter avec Google » s'ouvre DANS la page
 * (popup interne au navigateur, zéro navigation top-level) et le jeton
 * d'identification reçu est vérifié par POST /api/auth/google/idtoken.
 * L'ancien flux de redirection est conservé en secours (lien discret
 * « via le navigateur ») : aucune régression si GSI est indisponible.
 */
import { useEffect, useRef, useState } from 'react';
import { api } from '../lib/api';
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
// La navigation top-level décharge la page ; le timeout ne sert que si la
// navigation est empêchée (4 s).
let socialStartLock = false;

// ---------------------------------------------------------------------------
// Task 57 — chargement unique (module-level) du script officiel GSI.
// Le promesse est partagée entre Login et Signup ; timeout de sécurité 8 s
// (réseau mobile filtré / script bloqué) → fallback redirect automatique.
// ---------------------------------------------------------------------------
interface GoogleIdApi {
  initialize(config: {
    client_id: string;
    callback: (response: { credential: string }) => void;
    use_fedcm_for_prompt?: boolean;
  }): void;
  renderButton(parent: HTMLElement, options: Record<string, unknown>): void;
}
declare global {
  interface Window {
    google?: { accounts?: { id?: GoogleIdApi } };
  }
}

let gsiScriptPromise: Promise<GoogleIdApi | null> | null = null;
function loadGoogleGsi(): Promise<GoogleIdApi | null> {
  gsiScriptPromise ??= new Promise((resolve) => {
    const existing = window.google?.accounts?.id;
    if (existing) {
      resolve(existing);
      return;
    }
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve(window.google?.accounts?.id ?? null);
    };
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = finish;
    script.onerror = finish;
    // Réseau filtré / script bloqué : ne pas bloquer la connexion plus de 8 s.
    setTimeout(finish, 8000);
    document.head.appendChild(script);
  });
  return gsiScriptPromise;
}

export function SocialButtons({ config, requireConsent, onConsentBlocked }: SocialButtonsProps) {
  const [gsiState, setGsiState] = useState<'loading' | 'ready' | 'failed'>('loading');
  const [popupError, setPopupError] = useState<string | null>(null);
  const gsiSlotRef = useRef<HTMLDivElement | null>(null);
  const gsiVerifyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Task 57 — reçoit le jeton d'identification de la popup GSI, le fait
  // vérifier + poser la session, puis recharge (l'app ouvre sur la home).
  async function submitGoogleCredential(credential: string) {
    setPopupError(null);
    try {
      await api('/api/auth/google/idtoken', { json: { credential } });
      window.location.reload();
    } catch (err) {
      setPopupError(err instanceof Error ? err.message : 'Erreur inattendue.');
    }
  }

  const googleReady = config?.googleEnabled && config?.googleClientId && !requireConsent;

  useEffect(() => {
    if (!googleReady || gsiState === 'failed') return;
    let cancelled = false;
    void loadGoogleGsi().then((idApi) => {
      if (cancelled) return;
      // PIÈGE corrigé : le slot doit être DÉJÀ monté quand renderButton tourne —
      // il est donc rendu en permanence (caché en CSS tant que GSI n'est pas prêt).
      if (!idApi || !gsiSlotRef.current) {
        setGsiState('failed');
        return;
      }
      try {
        idApi.initialize({
          client_id: config?.googleClientId ?? '',
          use_fedcm_for_prompt: true,
          callback: (response) => {
            void submitGoogleCredential(response.credential);
          },
        });
        idApi.renderButton(gsiSlotRef.current, {
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          text: 'continue_with',
          locale: 'fr',
        });
        setGsiState('ready');
        // Filet de sécurité (Task 57) : si l'origine du site n'est PAS autorisée
        // dans la console Google (« The given origin is not allowed »), Google
        // crée une iframe VIDE (largeur 0) sans lever d'erreur JS. Après 2,5 s,
        // si le bouton ne s'est pas réellement rendu → retour automatique au
        // flux de redirection historique : l'utilisateur a TOUJOURS un bouton
        // Google utilisable, quel que soit l'état de la console Google.
        gsiVerifyTimer.current = setTimeout(() => {
          const iframeW = gsiSlotRef.current?.querySelector('iframe')?.getBoundingClientRect().width ?? 0;
          if (iframeW < 40) setGsiState('failed');
        }, 2500);
      } catch {
        setGsiState('failed');
      }
    });
    return () => {
      cancelled = true;
      if (gsiVerifyTimer.current) clearTimeout(gsiVerifyTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [googleReady]);

  return (
    <>
      <div className="social-divider">
        <span>ou</span>
      </div>
      <div className="social-row">
        {/* Google : bouton officiel GSI en popup (Task 57) quand disponible.
            Le slot GSI est TOUJOURS monté (caché tant que pas prêt) — le ref
            doit exister au moment de renderButton. En attendant / en échec :
            ancien flux de redirection préservé. */}
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
              <div
                ref={gsiSlotRef}
                className={gsiState === 'ready' ? 'gsi-slot' : 'gsi-slot gsi-hidden'}
              />
              {gsiState === 'ready' && (
                <>
                  <button type="button" className="social-alt" onClick={() => start('google')}>
                    La fenêtre Google ne s'ouvre pas ? Continuer via le navigateur
                  </button>
                  {popupError && <p className="error">{popupError}</p>}
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

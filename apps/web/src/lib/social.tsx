/**
 * Boutons de connexion sociale (Google + Facebook) — Étape 2-bis.
 * Actifs quand le fournisseur est configuré côté serveur (via /api/auth/config),
 * sinon affichés en état « bientôt » désactivé. Sur l'écran d'inscription, le
 * consentement (18+ et CGU) est exigé avant de lancer le parcours social —
 * le fournisseur ne crée jamais un compte sans le consentement wairyu.
 */
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

export function SocialButtons({ config, requireConsent, onConsentBlocked }: SocialButtonsProps) {
  function start(provider: 'google' | 'facebook') {
    if (requireConsent) {
      onConsentBlocked?.();
      return;
    }
    // Parcours OAuth complet : redirection top-level vers le worker.
    window.location.href = `/api/auth/${provider}/start`;
  }

  return (
    <>
      <div className="social-divider">
        <span>ou</span>
      </div>
      <div className="social-row">
        {config?.googleEnabled ? (
          <button type="button" className="btn google" onClick={() => start('google')}>
            <GoogleGlyph /> Continuer avec Google
          </button>
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

/**
 * Écran de connexion (Étape 2) — email + Turnstile → code OTP.
 * (Le « mot de passe oublié » n'existe pas : la connexion EST le code email.)
 */
import { useState } from 'react';
import { api, ApiError } from '../lib/api';
import { Turnstile } from '../lib/turnstile';
import type { AuthConfigResponse, OtpRequestResponse } from '@wairyu/shared';

interface Props {
  config: AuthConfigResponse | null;
}

export function Login({ config }: Props) {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError('Indique ton adresse email.');
      return;
    }
    setBusy(true);
    try {
      const res = await api<OtpRequestResponse>('/api/auth/otp/request', {
        json: { email: email.trim(), turnstile_token: token },
      });
      const params = new URLSearchParams({ e: email.trim() });
      if (res.devCode) params.set('d', res.devCode);
      window.location.hash = `#/verify?${params.toString()}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue.');
      setBusy(false);
    }
  }

  return (
    <section className="card">
      <button type="button" className="back" onClick={() => (window.location.hash = '#/')}>
        ← Retour
      </button>
      <h2>Content·e de te revoir</h2>
      <p className="hint">On t'envoie un code de connexion à 6 chiffres par email.</p>

      <form onSubmit={submit} noValidate>
        <label className="field">
          <span>Adresse email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            placeholder="toi@exemple.fr"
            value={email}
            onChange={(e2) => setEmail(e2.target.value)}
            autoFocus
          />
        </label>

        {config?.turnstileSiteKey && (
          <Turnstile siteKey={config.turnstileSiteKey} onToken={setToken} />
        )}

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn primary" disabled={busy}>
          {busy ? 'Envoi du code…' : 'Recevoir mon code'}
        </button>

        {config?.googleEnabled ? (
          <a className="btn google" href="/api/auth/google/start">
            Continuer avec Google
          </a>
        ) : (
          <button type="button" className="btn google disabled" disabled title="Arrive très bientôt">
            Continuer avec Google — bientôt
          </button>
        )}
      </form>

      <p className="switch">
        Pas encore de compte ?{' '}
        <a
          href="#/signup"
          onClick={(e) => {
            e.preventDefault();
            window.location.hash = '#/signup';
          }}
        >
          Créer un compte
        </a>
      </p>
    </section>
  );
}

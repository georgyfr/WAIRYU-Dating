/**
 * Écran d'inscription (Étape 2) — email + 18 ans et + + consentement CGU
 * + Turnstile. Le même flux OTP sert ensuite à la connexion (anti-énumération).
 */
import { useState } from 'react';
import { api, ApiError } from '../lib/api';
import { Turnstile } from '../lib/turnstile';
import { SocialButtons } from '../lib/social';
import type { AuthConfigResponse, OtpRequestResponse } from '@wairyu/shared';

interface Props {
  config: AuthConfigResponse | null;
}

export function Signup({ config }: Props) {
  const [email, setEmail] = useState('');
  const [adult, setAdult] = useState(false);
  const [terms, setTerms] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError('Indique ton adresse email.');
      return;
    }
    if (!adult) {
      setError('Tu dois avoir 18 ans ou plus pour créer un compte wairyu.');
      return;
    }
    if (!terms) {
      setError('Les CGU et la politique de confidentialité doivent être acceptées.');
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
      if (err instanceof ApiError && err.code === 'email_invalid') {
        setEmailError('Cette adresse email semble invalide.');
      } else {
        setError(err instanceof Error ? err.message : 'Erreur inattendue.');
      }
      setBusy(false);
    }
  }

  return (
    <section className="card">
      <button type="button" className="back" onClick={() => (window.location.hash = '#/')}>
        ← Retour
      </button>
      <h2>Crée ton compte</h2>
      <p className="hint">
        Pas de mot de passe à retenir : on t'envoie un code à 6 chiffres par email.
      </p>

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
            onChange={(e2) => {
              setEmail(e2.target.value);
              setEmailError(null);
            }}
            autoFocus
          />
        </label>

        <label className="check">
          <input type="checkbox" checked={adult} onChange={(e2) => setAdult(e2.target.checked)} />
          <span>
            J'ai <strong>18 ans ou plus</strong> — wairyu est réservée aux adultes.
          </span>
        </label>

        <label className="check">
          <input type="checkbox" checked={terms} onChange={(e2) => setTerms(e2.target.checked)} />
          <span>
            J'accepte les{' '}
            <a href="/legal/cgu.md" target="_blank" rel="noreferrer">
              CGU
            </a>{' '}
            et la{' '}
            <a href="/legal/politique.md" target="_blank" rel="noreferrer">
              politique de confidentialité
            </a>
            .
          </span>
        </label>

        {config?.turnstileSiteKey && (
          <Turnstile siteKey={config.turnstileSiteKey} onToken={setToken} />
        )}

        {emailError && <p className="error">{emailError}</p>}
        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn primary" disabled={busy}>
          {busy ? 'Envoi du code…' : 'Recevoir mon code'}
        </button>
      </form>

      <SocialButtons
        config={config}
        requireConsent={!adult || !terms}
        onConsentBlocked={() =>
          setError("Coche d'abord les deux cases ci-dessus : 18 ans ou plus et acceptation des CGU.")
        }
      />

      <p className="switch">
        Déjà un compte ?{' '}
        <a
          href="#/login"
          onClick={(e) => {
            e.preventDefault();
            window.location.hash = '#/login';
          }}
        >
          Se connecter
        </a>
      </p>
    </section>
  );
}

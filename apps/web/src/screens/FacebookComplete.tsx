/**
 * Écran « Dernière étape » après « Continuer avec Facebook » (Étape 2-bis).
 * Meta refuse le scope « email » sur les apps récentes (Invalid Scopes) et
 * certains comptes Facebook n'ont pas d'email confirmé : le callback OAuth
 * pose alors un profil en attente (cookie signé côté serveur, 15 min) et
 * renvoie ici. L'utilisateur renseigne son email, reçoit le code OTP habituel
 * (18+ et CGU inclus), et l'identité Facebook est reliée à son compte via
 * POST /api/auth/facebook/link.
 * Si une session existe déjà (utilisateur connecté avant le clic Facebook),
 * le rattachement se fait directement, sans nouvelle vérification.
 */
import { useEffect, useRef, useState } from 'react';
import { api, ApiError } from '../lib/api';
import { Turnstile } from '../lib/turnstile';
import { Verify } from './Verify';
import type {
  AuthConfigResponse,
  FacebookLinkResponse,
  MeResponse,
  OtpRequestResponse,
} from '@wairyu/shared';

interface Props {
  config: AuthConfigResponse | null;
  /** Appelé une fois l'utilisateur authentifié (et l'identité reliée si possible). */
  onAuthenticated: () => void;
}

type Step =
  | { name: 'checking' }
  | { name: 'email' }
  | { name: 'verify'; email: string; devCode?: string }
  | { name: 'result'; error: string | null };

export function FacebookComplete({ config, onAuthenticated }: Props) {
  const [step, setStep] = useState<Step>({ name: 'checking' });
  const [email, setEmail] = useState('');
  const [adult, setAdult] = useState(false);
  const [terms, setTerms] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  /** Relie l'identité Facebook en attente (cookie signé) au compte de la session. */
  async function linkAccount(): Promise<void> {
    await api<FacebookLinkResponse>('/api/auth/facebook/link', { json: {} });
  }

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    // Session existante ? → rattachement immédiat, sans nouvelle vérification.
    api<MeResponse>('/api/me')
      .then(() => linkAccount())
      .then(() => onAuthenticated())
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          setStep({ name: 'email' }); // pas de session : parcours email + OTP
          return;
        }
        setStep({ name: 'result', error: err instanceof Error ? err.message : 'Erreur inattendue.' });
      });
  }, [onAuthenticated]);

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
      setStep({ name: 'verify', email: email.trim(), devCode: res.devCode });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue.');
    }
    setBusy(false);
  }

  if (step.name === 'checking') {
    return (
      <section className="card">
        <h2>Connexion Facebook…</h2>
        <div className="status">
          <span className="dot" /> Vérification en cours…
        </div>
      </section>
    );
  }

  if (step.name === 'verify') {
    return (
      <Verify
        email={step.email}
        devCode={step.devCode}
        backTo="#/"
        onBeforeAuthenticated={linkAccount}
        onAuthenticated={onAuthenticated}
      />
    );
  }

  if (step.name === 'result') {
    return (
      <section className="card">
        <h2>Connexion Facebook</h2>
        {step.error && <p className="error">{step.error}</p>}
        <button type="button" className="btn primary" onClick={onAuthenticated}>
          Continuer
        </button>
        <button type="button" className="btn ghost" onClick={() => (window.location.hash = '#/')}>
          Retour à l'accueil
        </button>
      </section>
    );
  }

  // step.name === 'email'
  return (
    <section className="card">
      <button type="button" className="back" onClick={() => (window.location.hash = '#/')}>
        ← Retour
      </button>
      <h2>Dernière étape</h2>
      <p className="hint">
        Ton compte Facebook est confirmé — il ne manque que ton email pour sécuriser ta
        connexion (code à 6 chiffres, comme pour l'inscription classique).
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
              setError(null);
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

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn primary" disabled={busy}>
          {busy ? 'Envoi du code…' : 'Recevoir mon code'}
        </button>
      </form>
    </section>
  );
}

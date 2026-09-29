/**
 * Task 58 (fondateur) — connexion classique : @pseudo + mot de passe.
 * Task 61 : le pseudo tolère espaces/majuscules/accents (la forme canonique
 * côté serveur fait converger « Marie Claire », « marie claire » et
 * « MARIECLAIRE » vers le même compte). Préremplissage avec le dernier
 * compte utilisé sur CET appareil (wairyu.last_account).
 * Mot de passe oublié → #/recover (code de récupération ou email).
 */

import { useState } from 'react';
import { api } from '../lib/api';
import { SocialButtons } from '../lib/social';
import type { AuthConfigResponse } from '@wairyu/shared';

const LAST_ACCOUNT_KEY = 'wairyu.last_account';

function lastAccount(): string {
  try {
    return localStorage.getItem(LAST_ACCOUNT_KEY) ?? '';
  } catch {
    return '';
  }
}

interface Props {
  config: AuthConfigResponse | null;
}

export function LoginEmail({ config }: Props) {
  const [username, setUsername] = useState(() => lastAccount());
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!username.trim() || !password) {
      setError('Indique ton pseudo et ton mot de passe.');
      return;
    }
    setBusy(true);
    try {
      await api('/api/auth/password/login', { json: { username: username.trim(), password } });
      // Session posée (cookie) : rechargement complet → /api/me → routing.
      window.location.reload();
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
      <p className="hint">
        Connexion avec ton pseudo et ton mot de passe — inutile de t'inquiéter des espaces, majuscules ou
        accents : « Marie Claire », « marie claire » et « MARIECLAIRE » mènent au même compte.
      </p>

      <form onSubmit={submit} noValidate>
        <label className="field">
          <span>Ton pseudo</span>
          <input
            type="text"
            name="username"
            autoComplete="username"
            inputMode="text"
            placeholder="ex : marie23"
            value={username}
            onChange={(e2) => setUsername(e2.target.value)}
            autoFocus
            maxLength={20}
          />
        </label>
        <label className="field">
          <span>Mot de passe</span>
          <div className="pw-wrap">
            <input
              type={showPw ? 'text' : 'password'}
              name="current-password"
              autoComplete="current-password"
              placeholder="ton mot de passe"
              value={password}
              onChange={(e2) => setPassword(e2.target.value)}
              maxLength={128}
            />
            <button
              type="button"
              className="pw-toggle"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            >
              {showPw ? 'Masquer' : 'Afficher'}
            </button>
          </div>
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn primary" disabled={busy}>
          {busy ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>

      <p className="switch">
        <a
          href="#/recover"
          onClick={(e2) => {
            e2.preventDefault();
            window.location.hash = '#/recover';
          }}
        >
          Mot de passe oublié ?
        </a>
      </p>

      <SocialButtons config={config} />

      <p className="switch">
        Tu te connectais avec un code email ?{' '}
        <a
          href="#/login"
          onClick={(e2) => {
            e2.preventDefault();
            window.location.hash = '#/login';
          }}
        >
          Connexion par email
        </a>
      </p>
      <p className="switch">
        Pas encore de compte ?{' '}
        <a
          href="#/signup"
          onClick={(e2) => {
            e2.preventDefault();
            window.location.hash = '#/signup';
          }}
        >
          Créer un compte
        </a>
      </p>
    </section>
  );
}

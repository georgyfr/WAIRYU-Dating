/**
 * Task 58 (fondateur) — « nouveau mot de passe » après lien email
 * (#/reset?t=<jeton 64 hex>). Le jeton est consommé une seule fois côté
 * serveur ; tous les autres appareils sont déconnectés par sécurité.
 */

import { useState } from 'react';
import { api } from '../lib/api';

interface Props {
  token: string;
}

export function Reset({ token }: Props) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (password !== confirm) {
      setError('Les deux mots de passe ne sont pas identiques.');
      return;
    }
    setBusy(true);
    try {
      await api('/api/auth/password/reset', { json: { token, new_password: password } });
      setDone(true);
      setTimeout(() => window.location.reload(), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue.');
      setBusy(false);
    }
  }

  if (done) {
    return (
      <section className="card">
        <h2>Mot de passe changé</h2>
        <p className="hint">Ton nouveau mot de passe est actif — ouverture de l'app…</p>
      </section>
    );
  }

  return (
    <section className="card">
      <button type="button" className="back" onClick={() => (window.location.hash = '#/login')}>
        ← Retour
      </button>
      <h2>Nouveau mot de passe</h2>
      <p className="hint">
        Choisis un nouveau mot de passe. Par sécurité, tous les autres appareils connectés à ton compte seront déconnectés.
      </p>
      <form onSubmit={submit} noValidate>
        <label className="field">
          <span>Nouveau mot de passe</span>
          <div className="pw-wrap">
            <input
              type={showPw ? 'text' : 'password'}
              name="new-password"
              autoComplete="new-password"
              placeholder="au moins 8 caractères"
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
        <label className="field">
          <span>Confirmer</span>
          <input
            type={showPw ? 'text' : 'password'}
            name="confirm-new-password"
            autoComplete="new-password"
            placeholder="retape le même mot de passe"
            value={confirm}
            onChange={(e2) => setConfirm(e2.target.value)}
            maxLength={128}
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn primary" disabled={busy}>
          {busy ? 'Enregistrement…' : 'Enregistrer le nouveau mot de passe'}
        </button>
      </form>
    </section>
  );
}

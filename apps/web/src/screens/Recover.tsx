/**
 * Task 58 (fondateur) — « Retrouver ton compte » : deux moyens selon ce que
 * l'utilisateur avait noté à l'inscription.
 *  - onglet CODE : @pseudo + code de récupération 12 caractères + nouveau mot
 *    de passe → POST /api/auth/password/recovery (sessions autres révoquées) ;
 *  - onglet EMAIL : adresse enregistrée → POST /api/auth/password/forgot
 *    (lien 1 h par Brevo ; en staging, le lien direct revient en réponse).
 */

import { useState } from 'react';
import { api } from '../lib/api';
import { Turnstile } from '../lib/turnstile';
import type { AuthConfigResponse } from '@wairyu/shared';

interface Props {
  config: AuthConfigResponse | null;
}

// --- Onglet code de récupération -------------------------------------------
function RecoveryByCode() {
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError('Le nouveau mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (password !== confirm) {
      setError('Les deux mots de passe ne sont pas identiques.');
      return;
    }
    setBusy(true);
    try {
      await api('/api/auth/password/recovery', {
        json: { username: username.trim(), recovery_code: code.trim(), new_password: password },
      });
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue.');
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate>
      <label className="field">
        <span>Ton pseudo</span>
        <input
          type="text"
          name="username"
          autoComplete="username"
          placeholder="ex : marie23"
          value={username}
          onChange={(e2) => setUsername(e2.target.value)}
          maxLength={20}
        />
      </label>
      <label className="field">
        <span>Code de récupération (noté à l'inscription)</span>
        <input
          type="text"
          name="recovery-code"
          placeholder="XXXX-XXXX-XXXX"
          value={code}
          onChange={(e2) => setCode(e2.target.value)}
          autoCapitalize="characters"
          maxLength={20}
        />
      </label>
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
        <span>Confirmer le nouveau mot de passe</span>
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
        {busy ? 'Vérification…' : 'Reprendre mon compte'}
      </button>
      <p className="hint tiny">
        Par sécurité, tous les autres appareils connectés à ton compte seront déconnectés.
      </p>
    </form>
  );
}

// --- Onglet email -----------------------------------------------------------
function RecoveryByEmail({ config }: { config: AuthConfigResponse | null }) {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [devUrl, setDevUrl] = useState<string | null>(null);
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
      const res = await api<{ sent: true; channel: 'email'; devResetUrl?: string }>(
        '/api/auth/password/forgot',
        { json: { email: email.trim(), turnstile_token: token } },
      );
      setSent(true);
      setDevUrl(res.devResetUrl ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue.');
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div>
        <p className="hint">
          {'Si cet email est lié à un compte wairyu, un message vient de partir avec un lien valable '}
          <strong>1 heure</strong>. Regarde aussi tes spams.
        </p>
        {devUrl && (
          <p className="hint tiny">
            (Environnement de test — lien direct :{' '}
            <a href={devUrl}>ouvrir le lien de réinitialisation</a>)
          </p>
        )}
        <p className="hint tiny">
          Tu n'as pas ajouté d'email à ton compte ? Utilise ton{' '}
          <strong>code de récupération</strong> (onglet « Mon code de récupération »).
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <label className="field">
        <span>Ton adresse email</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder="toi@exemple.com"
          value={email}
          onChange={(e2) => setEmail(e2.target.value)}
        />
      </label>
      {config?.turnstileSiteKey && <Turnstile siteKey={config.turnstileSiteKey} onToken={setToken} />}
      {error && <p className="error">{error}</p>}
      <button type="submit" className="btn primary" disabled={busy}>
        {busy ? 'Envoi du lien…' : 'Recevoir le lien de récupération'}
      </button>
    </form>
  );
}

// --- Écran ------------------------------------------------------------------
export function Recover({ config }: Props) {
  const [tab, setTab] = useState<'code' | 'email'>('code');

  return (
    <section className="card">
      <button type="button" className="back" onClick={() => (window.location.hash = '#/login')}>
        ← Retour
      </button>
      <h2>Retrouver ton compte</h2>
      <p className="hint">Deux moyens, selon ce que tu avais noté à l'inscription.</p>

      <div className="mode-switch">
        <button
          type="button"
          className={tab === 'code' ? 'chip active' : 'chip'}
          onClick={() => setTab('code')}
        >
          Mon code de récupération
        </button>
        <button
          type="button"
          className={tab === 'email' ? 'chip active' : 'chip'}
          onClick={() => setTab('email')}
        >
          Mon email
        </button>
      </div>

      {tab === 'code' ? <RecoveryByCode /> : <RecoveryByEmail config={config} />}
    </section>
  );
}

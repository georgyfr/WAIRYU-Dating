/**
 * Complétion Facebook (Étape 2-bis) — le profil Facebook n'exposait pas
 * d'email (permission refusée par Meta ou compte sans email confirmé).
 * L'utilisateur complète son email via l'OTP habituel, puis l'identité
 * Facebook en attente (cookie signé posé par le callback) est rattachée
 * à son compte via POST /api/auth/facebook/link.
 */
import { useState } from 'react';
import { ApiError, linkDevice, requestOtp, verifyOtp } from '../lib/auth-client';
import { getDeviceId } from '../lib/push-client';

interface Props {
  onDone: () => void;
}

async function linkFacebook(): Promise<void> {
  const res = await fetch('/api/auth/facebook/link', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'content-type': 'application/json' },
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: { message?: string } } | null;
    throw new ApiError(res.status, 'link_failed', body?.error?.message ?? 'Rattachement Facebook impossible.');
  }
}

export default function FbComplete({ onDone }: Props) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [stage, setStage] = useState<'email' | 'code'>('email');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const requestCode = async () => {
    setError('');
    setBusy(true);
    try {
      await requestOtp(email.trim(), null);
      setStage('code');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Erreur réseau — réessayez.');
    } finally {
      setBusy(false);
    }
  };

  const verifyAndLink = async () => {
    setError('');
    setBusy(true);
    try {
      await verifyOtp(email.trim(), code.trim(), null);
      await linkFacebook();
      void linkDevice(getDeviceId()).catch(() => {});
      onDone();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Erreur réseau — réessayez.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="app-shell">
      <main className="auth">
        <h1 className="auth-title">
          Wai<span className="accent">ryu</span>
        </h1>
        <p className="auth-sub">
          {stage === 'email'
            ? 'Facebook n\u2019a pas partagé votre email. Indiquez-le pour finaliser la connexion.'
            : 'Saisissez le code à 6 chiffres envoyé par email.'}
        </p>
        <div className="auth-form">
          {stage === 'email' ? (
            <>
              <label className="field">
                <span>Email</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
              <button className="btn btn-primary btn-block" onClick={requestCode} disabled={busy || !email.trim()}>
                {busy ? 'Envoi…' : 'Recevoir mon code'}
              </button>
            </>
          ) : (
            <>
              <label className="field">
                <span>Code à 6 chiffres</span>
                <input
                  className="auth-code"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                />
              </label>
              <button className="btn btn-primary btn-block" onClick={verifyAndLink} disabled={busy || code.length !== 6}>
                {busy ? 'Vérification…' : 'Valider et relier mon compte Facebook'}
              </button>
            </>
          )}
          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

/**
 * Complétion Facebook (Étape 2-bis) — le profil Facebook n'exposait pas
 * d'email (permission refusée par Meta ou compte sans email confirmé).
 * L'utilisateur complète son email via l'OTP habituel, puis l'identité
 * Facebook en attente (cookie signé posé par le callback) est rattachée
 * à son compte via POST /api/auth/facebook/link.
 *
 * P0 âge : une CRÉATION de compte exige la date de naissance (18+ révolus)
 * — champ proposé d'emblée (« seulement si vous créez un compte ») et
 * révélé automatiquement si le serveur le réclame ; le code reste valable
 * (la validation serveur précède désormais la consommation) : la même
 * saisie est revalidée sans renvoi d'email.
 */
import { useState } from 'react';
import { ApiError, birthDateError, linkDevice, requestOtp, verifyOtp } from '../lib/auth-client';
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
  const [birthDate, setBirthDate] = useState('');
  const [needsBirth, setNeedsBirth] = useState(false);
  const [stage, setStage] = useState<'email' | 'code'>('email');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const requestCode = async () => {
    setError('');
    const localBirth = birthDate ? birthDateError(birthDate) : null;
    if (localBirth) {
      setError(localBirth);
      return;
    }
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
    if (needsBirth || birthDate) {
      const localBirth = birthDateError(birthDate);
      if (localBirth) {
        setNeedsBirth(true);
        setError(localBirth);
        return;
      }
    }
    setBusy(true);
    try {
      await verifyOtp(email.trim(), code.trim(), birthDate || null);
      await linkFacebook();
      void linkDevice(getDeviceId()).catch(() => {});
      onDone();
    } catch (e) {
      if (e instanceof ApiError && /Date de naissance requise/.test(e.message)) {
        // Le code reste VALABLE (validation serveur avant consommation) :
        // le champ s'affiche, la même saisie est revalidée.
        setNeedsBirth(true);
        setError('Dernière étape : votre date de naissance (jamais publiée, sert à vérifier que vous êtes majeur).');
      } else {
        setError(e instanceof ApiError ? e.message : 'Erreur réseau — réessayez.');
      }
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
              <label className="field">
                <span>Date de naissance — seulement si vous créez un compte</span>
                <input type="date" value={birthDate} min="1930-01-01" onChange={(e) => setBirthDate(e.target.value)} />
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
              {needsBirth && (
                <label className="field">
                  <span>Date de naissance (AAAA-MM-JJ) — pour vérifier que vous êtes majeur</span>
                  <input type="date" value={birthDate} min="1930-01-01" onChange={(e) => setBirthDate(e.target.value)} />
                </label>
              )}
              <button
                className="btn btn-primary btn-block"
                onClick={verifyAndLink}
                disabled={busy || code.length !== 6 || (needsBirth && !birthDate)}
              >
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

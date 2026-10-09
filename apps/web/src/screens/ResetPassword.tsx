/**
 * Réinitialisation de mot de passe (Étape 2) — atteinte depuis le lien email
 * « #/reset?t=<jeton> ». Le jeton brut ne vit que dans l'email (1 h) ; le
 * serveur ne stocke que son SHA-256 et la consommation est unique.
 */
import { useState } from 'react';
import PasswordField from '../components/PasswordField';
import { useI18n } from '../i18n/I18nProvider';
import { ApiError, linkDevice, passwordReset } from '../lib/auth-client';
import { getDeviceId } from '../lib/push-client';

interface Props {
  token: string;
  onDone: () => void;
}

export default function ResetPassword({ token, onDone }: Props) {
  const { tx } = useI18n();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError('');
    if (password.length < 8) {
      setError(tx('Le mot de passe doit contenir au moins 8 caractères.'));
      return;
    }
    setBusy(true);
    try {
      await passwordReset(token, password);
      void linkDevice(getDeviceId()).catch(() => {});
      onDone();
    } catch (e) {
      setError(e instanceof ApiError ? tx(e.message) : tx('Erreur réseau — réessayez.'));
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
        <p className="auth-sub">{tx('Choisissez un nouveau mot de passe.')}</p>
        <div className="auth-form">
          <PasswordField
            label="Nouveau mot de passe (8 caractères minimum)"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
          />
          <button className="btn btn-primary btn-block" onClick={submit} disabled={busy || password.length < 8}>
            {busy ? tx('Enregistrement…') : tx('Enregistrer')}
          </button>
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

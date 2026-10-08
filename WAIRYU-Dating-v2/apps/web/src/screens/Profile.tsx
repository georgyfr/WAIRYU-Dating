/**
 * Écran Profil (Étape 2) — identité de session + compte & RGPD.
 * La personnalisation du profil (photos, prompts, préférences) arrive à
 * l'Étape 3 ; ici : identité, identifiants (mot de passe), export RGPD,
 * suppression de compte (droit à l'effacement immédiat).
 */
import { useEffect, useState } from 'react';
import NotificationsCard from '../components/NotificationsCard';
import PasswordField from '../components/PasswordField';
import {
  ApiError,
  deleteAccount,
  exportAccount,
  fetchMe,
  fetchPasswordStatus,
  logout,
  passwordSet,
} from '../lib/auth-client';
import type { MeResponse, PasswordStatusResponse } from '@wairyu/shared';

export default function Profile() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [pw, setPw] = useState<PasswordStatusResponse | null>(null);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void fetchMe().then(setMe).catch(() => setMe(null));
    void fetchPasswordStatus().then(setPw).catch(() => setPw(null));
  }, []);

  const onLogout = async () => {
    setBusy(true);
    try {
      await logout();
      window.location.hash = '';
      window.location.reload();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Erreur réseau.');
      setBusy(false);
    }
  };

  const onSetPassword = async () => {
    setError('');
    if (newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    setBusy(true);
    try {
      const r = await passwordSet(newPassword);
      setNotice(`Mot de passe activé — votre identifiant de connexion : ${r.username}`);
      setNewPassword('');
      void fetchPasswordStatus().then(setPw).catch(() => undefined);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Erreur réseau.');
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async () => {
    setBusy(true);
    try {
      await deleteAccount();
      window.location.hash = '';
      window.location.reload();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Erreur réseau.');
      setBusy(false);
    }
  };

  const identity = me?.username ?? (me?.email.includes('@inbox.wairyu.local') ? null : me?.email);

  return (
    <main className="screen">
      <h1 className="screen-title">Mon profil</h1>
      <p className="screen-sub">Votre espace — la personnalisation complète arrive à l'Étape 3.</p>

      <article className="card profile-card">
        <div className="photo" role="img" aria-label="Votre photo (à venir)">
          🙂
        </div>
        <div className="body">
          <div className="name-row">
            <span className="name">{identity ? `@${me?.username ?? 'compte email'}` : 'Vous'}</span>
          </div>
          <p className="bio">
            {me?.email.includes('@inbox.wairyu.local')
              ? 'Compte classique — aucun email requis. Pensez à noter votre code de récupération.'
              : me?.email ?? '…'}
          </p>
          <span className="demo-badge">{me?.emailVerified ? 'Email vérifié' : 'Compte actif'}</span>
        </div>
      </article>

      <article className="card account-card">
        <div className="body">
          <h2 className="account-title">Compte & sécurité</h2>
          {pw && !pw.hasPassword && (
            <div className="account-row">
              <p className="account-hint">
                Ajoutez un mot de passe pour vous connecter sans fouiller votre boîte email.
              </p>
              <PasswordField
                label="Nouveau mot de passe (8 caractères min.)"
                value={newPassword}
                onChange={setNewPassword}
                autoComplete="new-password"
              />
              <button className="btn btn-accent" onClick={onSetPassword} disabled={busy || newPassword.length < 8}>
                Activer le mot de passe
              </button>
            </div>
          )}
          {pw?.hasPassword && (
            <p className="account-hint">
              Mot de passe actif — identifiant : <strong>{pw.username}</strong>
              {pw.hasRecoveryCode && ' · code de récupération en place'}
            </p>
          )}

          <div className="account-actions">
            <button className="btn btn-ghost" onClick={() => exportAccount()}>
              Exporter mes données (RGPD)
            </button>
            <button className="btn btn-ghost" onClick={onLogout} disabled={busy}>
              Se déconnecter
            </button>
          </div>

          {confirmingDelete ? (
            <div className="account-danger">
              <p>
                Supprimer votre compte efface immédiatement vos données personnelles (trace anonyme
                purgée sous 30 jours). Cette action est définitive.
              </p>
              <button className="btn btn-coral" onClick={onDelete} disabled={busy}>
                Oui, supprimer définitivement
              </button>
              <button className="btn btn-ghost" onClick={() => setConfirmingDelete(false)} disabled={busy}>
                Annuler
              </button>
            </div>
          ) : (
            <button className="btn btn-ghost danger-text" onClick={() => setConfirmingDelete(true)}>
              Supprimer mon compte (RGPD)
            </button>
          )}
        </div>
      </article>

      {/* Journal des notifications — y compris la félicitations de création
          de compte : le fondateur doit POUVOIR relire l'annonce après coup. */}
      <NotificationsCard />

      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}
      {!error && notice && <p className="auth-message">{notice}</p>}
    </main>
  );
}

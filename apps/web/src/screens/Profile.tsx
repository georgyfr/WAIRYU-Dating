/**
 * Écran Profil (Étape 2) — identité de session + compte & RGPD + LANGUE &
 * DEVISE (i18n). La personnalisation du profil (photos, prompts, préférences)
 * arrive à l'Étape 3 ; ici : identité, identifiants (mot de passe), langue,
 * devise, export RGPD, suppression de compte (droit à l'effacement immédiat).
 *
 * LANGUE : le changement stocke puis recharge la page — les contenus des
 * quêtes (données de modules) se reconstruisent dans la nouvelle langue.
 * DEVISE : réactive à chaud — tout montant des quêtes passe par money() au
 * rendu ; la même devise servira à la facturation premium (i18n/currency.ts).
 */
import { useEffect, useState } from 'react';
import NotificationsCard from '../components/NotificationsCard';
import PasswordField from '../components/PasswordField';
import { useI18n } from '../i18n/I18nProvider';
import { DEVISES, type CurrencyCode } from '../i18n/currency';
import type { Lang } from '../i18n/current';
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
  const { tx, lang, devise, setLangue, setDevise } = useI18n();
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
      setError(e instanceof ApiError ? e.message : tx('Erreur réseau.'));
      setBusy(false);
    }
  };

  const onSetPassword = async () => {
    setError('');
    if (newPassword.length < 8) {
      setError(tx('Le mot de passe doit contenir au moins 8 caractères.'));
      return;
    }
    setBusy(true);
    try {
      const r = await passwordSet(newPassword);
      setNotice(tx('Mot de passe activé — votre identifiant de connexion : {{n}}', { n: r.username }));
      setNewPassword('');
      void fetchPasswordStatus().then(setPw).catch(() => undefined);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : tx('Erreur réseau.'));
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
      setError(e instanceof ApiError ? e.message : tx('Erreur réseau.'));
      setBusy(false);
    }
  };

  const identity = me?.username ?? (me?.email.includes('@inbox.wairyu.local') ? null : me?.email);

  return (
    <main className="screen">
      <h1 className="screen-title">{tx('Mon profil')}</h1>
      <p className="screen-sub">{tx("Votre espace — la personnalisation complète arrive à l'Étape 3.")}</p>

      <article className="card profile-card">
        <div className="photo" role="img" aria-label={tx('Votre photo (à venir)')}>
          🙂
        </div>
        <div className="body">
          <div className="name-row">
            <span className="name">{identity ? `@${me?.username ?? tx('@compte email')}` : tx('Vous')}</span>
          </div>
          <p className="bio">
            {me?.email.includes('@inbox.wairyu.local')
              ? tx('Compte classique — aucun email requis. Pensez à noter votre code de récupération.')
              : me?.email ?? '…'}
          </p>
          <span className="demo-badge">{me?.emailVerified ? tx('Email vérifié') : tx('Compte actif')}</span>
        </div>
      </article>

      <article className="card account-card">
        <div className="body">
          <h2 className="account-title">{tx('Langue et devise')}</h2>
          <p className="account-hint">{tx("La langue de l'interface et la monnaie des montants affichés.")}</p>
          <div className="account-row i18n-row">
            <label className="i18n-field">
              <span className="i18n-label">{tx('Langue')}</span>
              <select
                value={lang}
                onChange={(e) => setLangue(e.target.value as Lang)}
                aria-label={tx('Langue')}
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </label>
            <label className="i18n-field">
              <span className="i18n-label">{tx('Devise')}</span>
              <select
                value={devise}
                onChange={(e) => setDevise(e.target.value as CurrencyCode)}
                aria-label={tx('Devise')}
              >
                {DEVISES.map((d) => (
                  <option key={d.code} value={d.code}>
                    {lang === 'en' ? d.label.en : d.label.fr}
                  </option>
                ))}
              </select>
            </label>
            <p className="i18n-note">{tx("Détectée d'après votre région — changez-la si besoin.")}</p>
          </div>
        </div>
      </article>

      <article className="card account-card">
        <div className="body">
          <h2 className="account-title">{tx('Compte & sécurité')}</h2>
          {pw && !pw.hasPassword && (
            <div className="account-row">
              <p className="account-hint">
                {tx('Ajoutez un mot de passe pour vous connecter sans fouiller votre boîte email.')}
              </p>
              <PasswordField
                label={tx('Nouveau mot de passe (8 caractères min.)')}
                value={newPassword}
                onChange={setNewPassword}
                autoComplete="new-password"
              />
              <button className="btn btn-accent" onClick={onSetPassword} disabled={busy || newPassword.length < 8}>
                {tx('Activer le mot de passe')}
              </button>
            </div>
          )}
          {pw?.hasPassword && (
            <p className="account-hint">
              {tx('Mot de passe actif — identifiant :')} <strong>{pw.username}</strong>
              {pw.hasRecoveryCode && tx(' · code de récupération en place')}
            </p>
          )}

          <div className="account-actions">
            <button className="btn btn-ghost" onClick={() => exportAccount()}>
              {tx('Exporter mes données (RGPD)')}
            </button>
            <button className="btn btn-ghost" onClick={onLogout} disabled={busy}>
              {tx('Se déconnecter')}
            </button>
          </div>

          {confirmingDelete ? (
            <div className="account-danger">
              <p>
                {tx(
                  'Supprimer votre compte efface immédiatement vos données personnelles (trace anonyme purgée sous 30 jours). Cette action est définitive.',
                )}
              </p>
              <button className="btn btn-coral" onClick={onDelete} disabled={busy}>
                {tx('Oui, supprimer définitivement')}
              </button>
              <button className="btn btn-ghost" onClick={() => setConfirmingDelete(false)} disabled={busy}>
                {tx('Annuler')}
              </button>
            </div>
          ) : (
            <button className="btn btn-ghost danger-text" onClick={() => setConfirmingDelete(true)}>
              {tx('Supprimer mon compte (RGPD)')}
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

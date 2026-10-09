/**
 * Écran d'authentification (Étape 2) — porte d'entrée de l'app.
 * Trois voies : email + code OTP (principale), pseudo + mot de passe
 * (classique), Google/Facebook (visibles seulement si configurés côté serveur).
 * RGPD : la date de naissance est exigée à l'INSCRIPTION (18 ans révolus) —
 * validée côté front ET côté serveur (double filet).
 */
import { useCallback, useEffect, useState } from 'react';
import BirthDatePicker from '../components/BirthDatePicker';
import PasswordField from '../components/PasswordField';
import TurnstileWidget from '../components/TurnstileWidget';
import { useI18n } from '../i18n/I18nProvider';
import {
  ApiError,
  birthDateError,
  fetchAuthConfig,
  linkDevice,
  passwordForgot,
  passwordLogin,
  passwordRegister,
  passwordRecovery,
  requestOtp,
  verifyOtp,
} from '../lib/auth-client';
import { getDeviceId } from '../lib/push-client';
import type { AuthConfigResponse } from '@wairyu/shared';

type Mode = 'choice' | 'otp-request' | 'otp-verify' | 'pwd-login' | 'pwd-register' | 'pwd-forgot' | 'pwd-recover';

interface Props {
  /** congratsVia ≠ null ⇔ le compte vient d'être CRÉÉ ⇒ overlay félicitations. */
  onAuthenticated: (congratsVia?: string | null) => void;
}

export default function Auth({ onAuthenticated }: Props) {
  const { tx } = useI18n();
  const [mode, setMode] = useState<Mode>('choice');
  const [config, setConfig] = useState<AuthConfigResponse | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [needsBirth, setNeedsBirth] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  /** Canal de la création (pseudo) retenu jusqu'au clic « C'est noté » — overlay félicitations. */
  const [pwdVia, setPwdVia] = useState<string | null>(null);

  useEffect(() => {
    void fetchAuthConfig()
      .then(setConfig)
      .catch(() => setConfig(null));
  }, []);

  const onToken = useCallback((token: string | null) => setTurnstileToken(token), []);

  const go = (m: Mode) => {
    setMode(m);
    setError('');
    setMessage('');
  };

  // ------------------------------------------------------------------ OTP --
  const submitOtpRequest = async () => {
    setError('');
    setBusy(true);
    try {
      const r = await requestOtp(email.trim(), turnstileToken, getDeviceId());
      setNeedsBirth(false);
      setCode(r.devCode ?? '');
      setMessage(
        r.channel === 'dev'
          ? tx('Mode test : le code est prérempli ci-dessous.')
          : r.channel === 'email+push'
            ? tx('Code envoyé par email ET en notification sur tes appareils wairyu — regarde tes notifications, pas besoin de fouiller ta boîte mail.')
            : tx('Code envoyé par email — il est valable 10 minutes.'),
      );
      go('otp-verify');
    } catch (e) {
      setError(e instanceof ApiError ? tx(e.message) : tx('Erreur réseau — réessayez.'));
    } finally {
      setBusy(false);
    }
  };

  const submitOtpVerify = async () => {
    setError('');
    setBusy(true);
    try {
      const r = await verifyOtp(email.trim(), code.trim(), birthDate || null);
      // Liaison appareil ↔ compte — ATTENDUE : sa réponse (congratsVia) pilote
      // l'overlay de félicitations VISIBLE (exigence fondateur, tous canaux).
      let via: string | null = null;
      try {
        const lr = await linkDevice(getDeviceId());
        if (lr.congrats) via = lr.congratsVia ?? 'email';
      } catch {
        // liaison ratée : l'overlay s'appuie sur le created du verify
      }
      onAuthenticated(via ?? (r.created ? 'email' : null));
    } catch (e) {
      if (e instanceof ApiError && /Date de naissance requise/.test(e.message)) {
        setNeedsBirth(true);
        setError(tx('Dernière étape : votre date de naissance (jamais publiée, sert à vérifier que vous êtes majeur).'));
      } else {
        setError(e instanceof ApiError ? tx(e.message) : tx('Erreur réseau — réessayez.'));
      }
    } finally {
      setBusy(false);
    }
  };

  // -------------------------------------------------------------- Password --
  const submitPwdRegister = async () => {
    setError('');
    const localBirth = birthDateError(birthDate);
    if (localBirth) {
      setError(tx(localBirth));
      return;
    }
    setBusy(true);
    try {
      const r = await passwordRegister(username, password, birthDate, turnstileToken);
      setRecoveryCode(r.recoveryCode);
      // Liaison appareil + félicitations (compte créé via pseudo) — la réponse
      // est retenue pour l'overlay affiché au clic « C'est noté — continuer ».
      try {
        const lr = await linkDevice(getDeviceId());
        setPwdVia(lr.congrats ? (lr.congratsVia ?? 'password') : 'password');
      } catch {
        setPwdVia('password');
      }
      go('pwd-recover'); // réutilisé comme écran « notez votre code »
      setMessage(tx('Compte créé ! Notez précieusement ce code de récupération — il ne sera plus jamais affiché.'));
    } catch (e) {
      setError(e instanceof ApiError ? tx(e.message) : tx('Erreur réseau — réessayez.'));
    } finally {
      setBusy(false);
    }
  };

  const submitPwdLogin = async () => {
    setError('');
    setBusy(true);
    try {
      await passwordLogin(identifier.trim(), password);
      void linkDevice(getDeviceId()).catch(() => {});
      onAuthenticated();
    } catch (e) {
      setError(e instanceof ApiError ? tx(e.message) : tx('Erreur réseau — réessayez.'));
    } finally {
      setBusy(false);
    }
  };

  const submitPwdForgot = async () => {
    setError('');
    setBusy(true);
    try {
      const r = await passwordForgot(email.trim(), turnstileToken);
      setMessage(
        r.devResetUrl
          ? tx('Mode test : lien de réinitialisation disponible dans la réponse du serveur.')
          : tx('Si cette adresse correspond à un compte, un email avec un lien de réinitialisation vient de partir.'),
      );
    } catch (e) {
      setError(e instanceof ApiError ? tx(e.message) : tx('Erreur réseau — réessayez.'));
    } finally {
      setBusy(false);
    }
  };

  const submitPwdRecovery = async (newPassword: string | null) => {
    setError('');
    setBusy(true);
    try {
      await passwordRecovery(identifier.trim(), recoveryCode.trim(), newPassword);
      void linkDevice(getDeviceId()).catch(() => {});
      onAuthenticated();
    } catch (e) {
      setError(e instanceof ApiError ? tx(e.message) : tx('Erreur réseau — réessayez.'));
    } finally {
      setBusy(false);
    }
  };

  // ----------------------------------------------------------------- OAuth --
  // Date déjà déclarée (écrans OTP) → transmise au /start : l'inscription se
  // fait SANS étape intermédiaire. Sinon → lien simple : le serveur détecte
  // les nouvelles inscriptions et propose l'écran #/oauth-complete (jamais
  // de JSON brut, aucune friction pour les connexions). AUCUN effet de bord
  // au rendu (l'ancien oauthBirth() faisait setState pendant le rendu).
  const oauthQuery =
    birthDate && birthDateError(birthDate) === null ? `?birthDate=${encodeURIComponent(birthDate)}` : '';

  // ------------------------------------------------------------------ Vue --
  return (
    <div className="app-shell">
      <main className="auth">
        <img src="/icons/icon-192.png" alt={tx('Logo Wairyu')} className="auth-logo" width={64} height={64} />
        <h1 className="auth-title">
          Wai<span className="accent">ryu</span>
        </h1>
        <p className="auth-sub">
          {mode === 'choice' && tx('Connectez-vous ou créez votre compte — c\u2019est gratuit, sans carte.')}
          {mode === 'otp-request' && tx('Recevez un code à 6 chiffres par email.')}
          {mode === 'otp-verify' && tx('Code envoyé à {{n}}.', { n: email })}
          {mode === 'pwd-login' && tx('Connexion avec votre pseudo ou votre email.')}
          {mode === 'pwd-register' && tx('Créez votre compte classique (pseudo + mot de passe).')}
          {mode === 'pwd-forgot' && tx('Retrouver l\u2019accès à votre compte.')}
          {mode === 'pwd-recover' && tx('Récupération avec votre code wairyu.')}
        </p>

        {/* ---------- Choix de la voie ---------- */}
        {mode === 'choice' && (
          <div className="auth-form">
            <label className="field">
              <span>{tx('Votre email')}</span>
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={tx('vous@exemple.com')}
              />
            </label>
            <button className="btn btn-primary btn-block" onClick={() => go('otp-request')} disabled={!email.trim()}>
              {tx("Continuer avec l'email")}
            </button>

            <div className="auth-sep" role="separator">
              <span>{tx('ou')}</span>
            </div>

            <button className="btn btn-ghost btn-block" onClick={() => go('pwd-login')}>
              {tx("J'ai un pseudo et un mot de passe")}
            </button>
            <button className="btn btn-ghost btn-block" onClick={() => go('pwd-register')}>
              {tx('Créer un compte avec un pseudo')}
            </button>

            {(config?.googleEnabled || config?.facebookEnabled) && (
              <div className="auth-alt">
                {config.googleEnabled && (
                  <a className="btn btn-ghost btn-block" href={`/api/auth/google/start${oauthQuery}`}>
                    {tx('Continuer avec Google')}
                  </a>
                )}
                {config.facebookEnabled && (
                  <a className="btn btn-ghost btn-block" href={`/api/auth/facebook/start${oauthQuery}`}>
                    {tx('Continuer avec Facebook')}
                  </a>
                )}
              </div>
            )}
            {needsBirth && (
              <BirthDatePicker
                label={tx('Date de naissance — 18 ans révolus requis')}
                value={birthDate}
                onChange={setBirthDate}
              />
            )}
          </div>
        )}

        {/* ---------- OTP : demande ---------- */}
        {mode === 'otp-request' && (
          <div className="auth-form">
            <label className="field">
              <span>{tx('Email')}</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <BirthDatePicker
              label={tx('Date de naissance — seulement si vous créez un compte')}
              value={birthDate}
              onChange={setBirthDate}
              onClear={() => setBirthDate('')}
            />
            {config?.turnstileSiteKey && <TurnstileWidget siteKey={config.turnstileSiteKey} onToken={onToken} />}
            <button className="btn btn-primary btn-block" onClick={submitOtpRequest} disabled={busy || !email.trim()}>
              {busy ? tx('Envoi…') : tx('Recevoir mon code')}
            </button>
            <button className="btn btn-ghost btn-block" onClick={() => go('choice')} disabled={busy}>
              {tx('Retour')}
            </button>
          </div>
        )}

        {/* ---------- OTP : vérification ---------- */}
        {mode === 'otp-verify' && (
          <div className="auth-form">
            <label className="field">
              <span>{tx('Code à 6 chiffres')}</span>
              <input
                className="auth-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="••••••"
              />
            </label>
            {needsBirth && (
              <BirthDatePicker
                label={tx('Date de naissance — pour vérifier que vous êtes majeur')}
                value={birthDate}
                onChange={setBirthDate}
              />
            )}
            <button
              className="btn btn-primary btn-block"
              onClick={submitOtpVerify}
              disabled={busy || code.length !== 6 || (needsBirth && !birthDate)}
            >
              {busy ? tx('Vérification…') : tx('Valider')}
            </button>
            <button className="btn btn-ghost btn-block" onClick={() => go('otp-request')} disabled={busy}>
              {tx('Renvoyer un code')}
            </button>
          </div>
        )}

        {/* ---------- Mot de passe : connexion ---------- */}
        {mode === 'pwd-login' && (
          <div className="auth-form">
            <label className="field">
              <span>{tx('Pseudo ou email')}</span>
              <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} autoComplete="username" />
            </label>
            <PasswordField value={password} onChange={setPassword} autoComplete="current-password" />
            <button className="btn btn-primary btn-block" onClick={submitPwdLogin} disabled={busy || !identifier || !password}>
              {busy ? tx('Connexion…') : tx('Se connecter')}
            </button>
            <button className="btn btn-ghost btn-block" onClick={() => go('pwd-forgot')} disabled={busy}>
              {tx('Mot de passe oublié ?')}
            </button>
            <button className="btn btn-ghost btn-block" onClick={() => go('pwd-recover')} disabled={busy}>
              {tx("J'ai un code de récupération")}
            </button>
            <button className="btn btn-ghost btn-block" onClick={() => go('choice')} disabled={busy}>
              {tx('Retour')}
            </button>
          </div>
        )}

        {/* ---------- Mot de passe : inscription ---------- */}
        {mode === 'pwd-register' && (
          <div className="auth-form">
            <label className="field">
              <span>{tx('Pseudo (3-20 caractères, espaces et accents acceptés)')}</span>
              <input value={username} onChange={(e) => setUsername(e.target.value)} maxLength={20} autoComplete="username" />
            </label>
            <PasswordField
              label="Mot de passe (8 caractères minimum)"
              value={password}
              onChange={setPassword}
              autoComplete="new-password"
            />
            <BirthDatePicker
              label={tx('Date de naissance — 18 ans révolus requis')}
              value={birthDate}
              onChange={setBirthDate}
            />
            {config?.turnstileSiteKey && <TurnstileWidget siteKey={config.turnstileSiteKey} onToken={onToken} />}
            <button
              className="btn btn-primary btn-block"
              onClick={submitPwdRegister}
              disabled={busy || !username.trim() || password.length < 8 || !birthDate}
            >
              {busy ? tx('Création…') : tx('Créer mon compte')}
            </button>
            <button className="btn btn-ghost btn-block" onClick={() => go('choice')} disabled={busy}>
              {tx('Retour')}
            </button>
          </div>
        )}

        {/* ---------- Mot de passe : oublié ---------- */}
        {mode === 'pwd-forgot' && (
          <div className="auth-form">
            <label className="field">
              <span>{tx('Email du compte')}</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            {config?.turnstileSiteKey && <TurnstileWidget siteKey={config.turnstileSiteKey} onToken={onToken} />}
            <button className="btn btn-primary btn-block" onClick={submitPwdForgot} disabled={busy || !email.trim()}>
              {busy ? tx('Envoi…') : tx('Recevoir un lien de réinitialisation')}
            </button>
            <button className="btn btn-ghost btn-block" onClick={() => go('choice')} disabled={busy}>
              {tx('Retour')}
            </button>
          </div>
        )}

        {/* ---------- Mot de passe : code de récupération ---------- */}
        {mode === 'pwd-recover' && (
          <div className="auth-form">
            {recoveryCode ? (
              <>
                <div className="auth-recovery" role="alert">
                  <code>{recoveryCode}</code>
                  <p>{tx('Écrivez ce code sur papier ou dans vos notes. Il permet de reprendre votre compte sans email.')}</p>
                </div>
                <button className="btn btn-primary btn-block" onClick={() => onAuthenticated(pwdVia)}>
                  {tx("C'est noté — continuer")}
                </button>
              </>
            ) : (
              <>
                <label className="field">
                  <span>{tx('Pseudo')}</span>
                  <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
                </label>
                <label className="field">
                  <span>{tx('Code de récupération (12 caractères)')}</span>
                  <input value={recoveryCode} onChange={(e) => setRecoveryCode(e.target.value)} maxLength={14} className="auth-code-wide" />
                </label>
                <button
                  className="btn btn-primary btn-block"
                  onClick={() => submitPwdRecovery(null)}
                  disabled={busy || !identifier.trim() || recoveryCode.trim().length < 12}
                >
                  {busy ? tx('Vérification…') : tx('Reprendre mon compte')}
                </button>
              </>
            )}
            <button className="btn btn-ghost btn-block" onClick={() => go('choice')} disabled={busy}>
              {tx('Retour')}
            </button>
          </div>
        )}

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}
        {!error && message && <p className="auth-message">{message}</p>}

        <p className="auth-legal">
          {tx(
            "En continuant, vous acceptez d'avoir 18 ans révolus et nos règles : respect, consentement, zéro contenu non consenti. Vos données restent les vôtres — export et suppression à tout moment.",
          )}
        </p>
      </main>
    </div>
  );
}

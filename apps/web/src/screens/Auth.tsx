/**
 * Écran d'authentification (Étape 2) — porte d'entrée de l'app.
 * Trois voies : email + code OTP (principale), pseudo + mot de passe
 * (classique), Google/Facebook (visibles seulement si configurés côté serveur).
 * RGPD : la date de naissance est exigée à l'INSCRIPTION (18 ans révolus) —
 * validée côté front ET côté serveur (double filet).
 */
import { useCallback, useEffect, useState } from 'react';
import TurnstileWidget from '../components/TurnstileWidget';
import {
  ApiError,
  birthDateError,
  fetchAuthConfig,
  passwordForgot,
  passwordLogin,
  passwordRegister,
  passwordRecovery,
  requestOtp,
  verifyOtp,
} from '../lib/auth-client';
import type { AuthConfigResponse } from '@wairyu/shared';

type Mode = 'choice' | 'otp-request' | 'otp-verify' | 'pwd-login' | 'pwd-register' | 'pwd-forgot' | 'pwd-recover';

interface Props {
  onAuthenticated: () => void;
}

export default function Auth({ onAuthenticated }: Props) {
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
      const r = await requestOtp(email.trim(), turnstileToken);
      setNeedsBirth(false);
      setCode(r.devCode ?? '');
      setMessage(
        r.channel === 'dev'
          ? 'Mode test : le code est prérempli ci-dessous.'
          : 'Code envoyé par email — il est valable 10 minutes.',
      );
      go('otp-verify');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Erreur réseau — réessayez.');
    } finally {
      setBusy(false);
    }
  };

  const submitOtpVerify = async () => {
    setError('');
    setBusy(true);
    try {
      await verifyOtp(email.trim(), code.trim(), needsBirth ? birthDate : null);
      onAuthenticated();
    } catch (e) {
      if (e instanceof ApiError && /Date de naissance requise/.test(e.message)) {
        setNeedsBirth(true);
        setError('Dernière étape : votre date de naissance (jamais publiée, sert à vérifier que vous êtes majeur).');
      } else {
        setError(e instanceof ApiError ? e.message : 'Erreur réseau — réessayez.');
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
      setError(localBirth);
      return;
    }
    setBusy(true);
    try {
      const r = await passwordRegister(username, password, birthDate, turnstileToken);
      setRecoveryCode(r.recoveryCode);
      go('pwd-recover'); // réutilisé comme écran « notez votre code »
      setMessage('Compte créé ! Notez précieusement ce code de récupération — il ne sera plus jamais affiché.');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Erreur réseau — réessayez.');
    } finally {
      setBusy(false);
    }
  };

  const submitPwdLogin = async () => {
    setError('');
    setBusy(true);
    try {
      await passwordLogin(identifier.trim(), password);
      onAuthenticated();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Erreur réseau — réessayez.');
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
          ? 'Mode test : lien de réinitialisation disponible dans la réponse du serveur.'
          : 'Si cette adresse correspond à un compte, un email avec un lien de réinitialisation vient de partir.',
      );
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Erreur réseau — réessayez.');
    } finally {
      setBusy(false);
    }
  };

  const submitPwdRecovery = async (newPassword: string | null) => {
    setError('');
    setBusy(true);
    try {
      await passwordRecovery(identifier.trim(), recoveryCode.trim(), newPassword);
      onAuthenticated();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Erreur réseau — réessayez.');
    } finally {
      setBusy(false);
    }
  };

  // ----------------------------------------------------------------- OAuth --
  const oauthBirth = () => {
    if (birthDateError(birthDate) === null) return `?birthDate=${encodeURIComponent(birthDate)}`;
    setError('Renseignez d\u2019abord votre date de naissance (champ ci-dessous), puis recliquez.');
    setNeedsBirth(true);
    return null;
  };

  // ------------------------------------------------------------------ Vue --
  return (
    <div className="app-shell">
      <main className="auth">
        <img src="/icons/icon-192.png" alt="Logo Wairyu" className="auth-logo" width={64} height={64} />
        <h1 className="auth-title">
          Wai<span className="accent">ryu</span>
        </h1>
        <p className="auth-sub">
          {mode === 'choice' && 'Connectez-vous ou créez votre compte — c\u2019est gratuit, sans carte.'}
          {mode === 'otp-request' && 'Recevez un code à 6 chiffres par email.'}
          {mode === 'otp-verify' && `Code envoyé à ${email}.`}
          {mode === 'pwd-login' && 'Connexion avec votre pseudo ou votre email.'}
          {mode === 'pwd-register' && 'Créez votre compte classique (pseudo + mot de passe).'}
          {mode === 'pwd-forgot' && 'Retrouver l\u2019accès à votre compte.'}
          {mode === 'pwd-recover' && 'Récupération avec votre code wairyu.'}
        </p>

        {/* ---------- Choix de la voie ---------- */}
        {mode === 'choice' && (
          <div className="auth-form">
            <label className="field">
              <span>Votre email</span>
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
              />
            </label>
            <button className="btn btn-primary btn-block" onClick={() => go('otp-request')} disabled={!email.trim()}>
              Continuer avec l'email
            </button>

            <div className="auth-sep" role="separator">
              <span>ou</span>
            </div>

            <button className="btn btn-ghost btn-block" onClick={() => go('pwd-login')}>
              J'ai un pseudo et un mot de passe
            </button>
            <button className="btn btn-ghost btn-block" onClick={() => go('pwd-register')}>
              Créer un compte avec un pseudo
            </button>

            {(config?.googleEnabled || config?.facebookEnabled) && (
              <div className="auth-alt">
                {config.googleEnabled && (
                  <a className="btn btn-ghost btn-block" href={`/api/auth/google/start${birthDate ? oauthBirth() ?? '' : ''}`}>
                    Continuer avec Google
                  </a>
                )}
                {config.facebookEnabled && (
                  <a className="btn btn-ghost btn-block" href={`/api/auth/facebook/start${birthDate ? oauthBirth() ?? '' : ''}`}>
                    Continuer avec Facebook
                  </a>
                )}
              </div>
            )}
            {needsBirth && (
              <label className="field">
                <span>Date de naissance (AAAA-MM-JJ)</span>
                <input type="date" value={birthDate} min="1930-01-01" onChange={(e) => setBirthDate(e.target.value)} />
              </label>
            )}
          </div>
        )}

        {/* ---------- OTP : demande ---------- */}
        {mode === 'otp-request' && (
          <div className="auth-form">
            <label className="field">
              <span>Email</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="field">
              <span>Date de naissance — seulement si vous créez un compte</span>
              <input type="date" value={birthDate} min="1930-01-01" onChange={(e) => setBirthDate(e.target.value)} />
            </label>
            {config?.turnstileSiteKey && <TurnstileWidget siteKey={config.turnstileSiteKey} onToken={onToken} />}
            <button className="btn btn-primary btn-block" onClick={submitOtpRequest} disabled={busy || !email.trim()}>
              {busy ? 'Envoi…' : 'Recevoir mon code'}
            </button>
            <button className="btn btn-ghost btn-block" onClick={() => go('choice')} disabled={busy}>
              Retour
            </button>
          </div>
        )}

        {/* ---------- OTP : vérification ---------- */}
        {mode === 'otp-verify' && (
          <div className="auth-form">
            <label className="field">
              <span>Code à 6 chiffres</span>
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
              <label className="field">
                <span>Date de naissance (AAAA-MM-JJ) — pour vérifier que vous êtes majeur</span>
                <input type="date" value={birthDate} min="1930-01-01" onChange={(e) => setBirthDate(e.target.value)} />
              </label>
            )}
            <button
              className="btn btn-primary btn-block"
              onClick={submitOtpVerify}
              disabled={busy || code.length !== 6 || (needsBirth && !birthDate)}
            >
              {busy ? 'Vérification…' : 'Valider'}
            </button>
            <button className="btn btn-ghost btn-block" onClick={() => go('otp-request')} disabled={busy}>
              Renvoyer un code
            </button>
          </div>
        )}

        {/* ---------- Mot de passe : connexion ---------- */}
        {mode === 'pwd-login' && (
          <div className="auth-form">
            <label className="field">
              <span>Pseudo ou email</span>
              <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} autoComplete="username" />
            </label>
            <label className="field">
              <span>Mot de passe</span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
            </label>
            <button className="btn btn-primary btn-block" onClick={submitPwdLogin} disabled={busy || !identifier || !password}>
              {busy ? 'Connexion…' : 'Se connecter'}
            </button>
            <button className="btn btn-ghost btn-block" onClick={() => go('pwd-forgot')} disabled={busy}>
              Mot de passe oublié ?
            </button>
            <button className="btn btn-ghost btn-block" onClick={() => go('pwd-recover')} disabled={busy}>
              J'ai un code de récupération
            </button>
            <button className="btn btn-ghost btn-block" onClick={() => go('choice')} disabled={busy}>
              Retour
            </button>
          </div>
        )}

        {/* ---------- Mot de passe : inscription ---------- */}
        {mode === 'pwd-register' && (
          <div className="auth-form">
            <label className="field">
              <span>Pseudo (3-20 caractères, espaces et accents acceptés)</span>
              <input value={username} onChange={(e) => setUsername(e.target.value)} maxLength={20} autoComplete="username" />
            </label>
            <label className="field">
              <span>Mot de passe (8 caractères minimum)</span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
            </label>
            <label className="field">
              <span>Date de naissance (AAAA-MM-JJ) — 18 ans révolus requis</span>
              <input type="date" value={birthDate} min="1930-01-01" onChange={(e) => setBirthDate(e.target.value)} />
            </label>
            {config?.turnstileSiteKey && <TurnstileWidget siteKey={config.turnstileSiteKey} onToken={onToken} />}
            <button
              className="btn btn-primary btn-block"
              onClick={submitPwdRegister}
              disabled={busy || !username.trim() || password.length < 8 || !birthDate}
            >
              {busy ? 'Création…' : 'Créer mon compte'}
            </button>
            <button className="btn btn-ghost btn-block" onClick={() => go('choice')} disabled={busy}>
              Retour
            </button>
          </div>
        )}

        {/* ---------- Mot de passe : oublié ---------- */}
        {mode === 'pwd-forgot' && (
          <div className="auth-form">
            <label className="field">
              <span>Email du compte</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            {config?.turnstileSiteKey && <TurnstileWidget siteKey={config.turnstileSiteKey} onToken={onToken} />}
            <button className="btn btn-primary btn-block" onClick={submitPwdForgot} disabled={busy || !email.trim()}>
              {busy ? 'Envoi…' : 'Recevoir un lien de réinitialisation'}
            </button>
            <button className="btn btn-ghost btn-block" onClick={() => go('choice')} disabled={busy}>
              Retour
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
                  <p>Écrivez ce code sur papier ou dans vos notes. Il permet de reprendre votre compte sans email.</p>
                </div>
                <button className="btn btn-primary btn-block" onClick={onAuthenticated}>
                  C'est noté — continuer
                </button>
              </>
            ) : (
              <>
                <label className="field">
                  <span>Pseudo</span>
                  <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
                </label>
                <label className="field">
                  <span>Code de récupération (12 caractères)</span>
                  <input value={recoveryCode} onChange={(e) => setRecoveryCode(e.target.value)} maxLength={14} className="auth-code-wide" />
                </label>
                <button
                  className="btn btn-primary btn-block"
                  onClick={() => submitPwdRecovery(null)}
                  disabled={busy || !identifier.trim() || recoveryCode.trim().length < 12}
                >
                  {busy ? 'Vérification…' : 'Reprendre mon compte'}
                </button>
              </>
            )}
            <button className="btn btn-ghost btn-block" onClick={() => go('choice')} disabled={busy}>
              Retour
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
          En continuant, vous acceptez d'avoir 18 ans révolus et nos règles : respect, consentement,
          zéro contenu non consenti. Vos données restent les vôtres — export et suppression à tout moment.
        </p>
      </main>
    </div>
  );
}

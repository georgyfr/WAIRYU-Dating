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
 *
 * Anti-robot : la demande d'OTP est soumise à Turnstile en production
 * (fail-closed) — même contrat que l'écran Auth : le widget est rendu dès
 * que /api/auth/config sert une clé de site, et le jeton obtenu accompagne
 * la requête (sinon le serveur refuse « Validation anti-robot requise »).
 *
 * Alternative SANS email (demande fondateur) : si la boîte mail est
 * inaccessible (mot de passe perdu…), l'identité Facebook en attente SUFFIT —
 * « Continuer sans email » crée le compte avec la seule date de naissance
 * (18+ validé côté serveur). Un email de récupération pourra être ajouté
 * plus tard dans Réglages.
 */
import { useCallback, useEffect, useState } from 'react';
import BirthDatePicker from '../components/BirthDatePicker';
import TurnstileWidget from '../components/TurnstileWidget';
import { useI18n } from '../i18n/I18nProvider';
import {
  ApiError,
  birthDateError,
  facebookComplete,
  fetchAuthConfig,
  linkDevice,
  requestOtp,
  verifyOtp,
} from '../lib/auth-client';
import { getDeviceId } from '../lib/push-client';
import type { AuthConfigResponse } from '@wairyu/shared';

interface Props {
  /** congratsVia ≠ null ⇔ compte créé pendant ce parcours ⇒ overlay félicitations. */
  onDone: (congratsVia?: string | null) => void;
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
  const { tx } = useI18n();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [needsBirth, setNeedsBirth] = useState(false);
  const [stage, setStage] = useState<'email' | 'code'>('email');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [config, setConfig] = useState<AuthConfigResponse | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  useEffect(() => {
    fetchAuthConfig()
      .then(setConfig)
      .catch(() => setConfig(null));
  }, []);

  const onToken = useCallback((token: string | null) => setTurnstileToken(token), []);

  const requestCode = async () => {
    setError('');
    const localBirth = birthDate ? birthDateError(birthDate) : null;
    if (localBirth) {
      setError(tx(localBirth));
      return;
    }
    setBusy(true);
    try {
      await requestOtp(email.trim(), turnstileToken, getDeviceId());
      setStage('code');
    } catch (e) {
      setError(e instanceof ApiError ? tx(e.message) : tx('Erreur réseau — réessayez.'));
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
        setError(tx(localBirth));
        return;
      }
    }
    setBusy(true);
    try {
      const v = await verifyOtp(email.trim(), code.trim(), birthDate || null);
      await linkFacebook();
      // Liaison attendue : congratsVia pilote l'overlay félicitations (création).
      let congratsVia: string | null = null;
      try {
        const lr = await linkDevice(getDeviceId());
        if (lr.congrats) congratsVia = lr.congratsVia ?? 'facebook';
      } catch {
        // liaison ratée : repli sur le created du verify
      }
      onDone(congratsVia ?? (v.created ? 'facebook' : null));
    } catch (e) {
      if (e instanceof ApiError && /Date de naissance requise/.test(e.message)) {
        // Le code reste VALABLE (validation serveur avant consommation) :
        // le champ s'affiche, la même saisie est revalidée.
        setNeedsBirth(true);
        setError(tx('Dernière étape : votre date de naissance (jamais publiée, sert à vérifier que vous êtes majeur).'));
      } else {
        setError(e instanceof ApiError ? tx(e.message) : tx('Erreur réseau — réessayez.'));
      }
    } finally {
      setBusy(false);
    }
  };

  /**
   * Inscription/connexion SANS email : l'identité Facebook en attente suffit.
   * La date est exigée uniquement si le serveur crée le compte (18+ côté
   * serveur aussi) ; la félicitations suit la même chaîne que l'OTP.
   */
  const continueWithoutEmail = async () => {
    setError('');
    if (!birthDate) {
      setError(tx('Ajoutez votre date de naissance ci-dessus pour créer votre compte sans email.'));
      return;
    }
    const localBirth = birthDateError(birthDate);
    if (localBirth) {
      setError(tx(localBirth));
      return;
    }
    setBusy(true);
    try {
      const r = await facebookComplete(birthDate);
      let congratsVia: string | null = null;
      try {
        const lr = await linkDevice(getDeviceId());
        if (lr.congrats) congratsVia = lr.congratsVia ?? 'facebook';
      } catch {
        // liaison ratée : repli sur le created du complete
      }
      onDone(congratsVia ?? (r.created ? 'facebook' : null));
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
        <p className="auth-sub">
          {stage === 'email'
            ? tx('Facebook n\u2019a pas partagé votre email. Indiquez-le pour finaliser la connexion.')
            : tx('Saisissez le code à 6 chiffres envoyé par email.')}
        </p>
        <div className="auth-form">
          {stage === 'email' ? (
            <>
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
              <button className="btn btn-primary btn-block" onClick={requestCode} disabled={busy || !email.trim()}>
                {busy ? tx('Envoi…') : tx('Recevoir mon code')}
              </button>
              <div className="auth-divider" role="separator">
                <span>{tx('ou')}</span>
              </div>
              <button className="btn btn-ghost btn-block" onClick={continueWithoutEmail} disabled={busy}>
                {tx('Continuer sans email — via Facebook')}
              </button>
              <p className="auth-hint">
                {tx(
                  'Boîte mail inaccessible\u00A0? Votre compte sera créé avec votre profil Facebook seul (la date de naissance ci-dessus est requise). Un email de récupération pourra être ajouté plus tard.',
                )}
              </p>
            </>
          ) : (
            <>
              <label className="field">
                <span>{tx('Code à 6 chiffres')}</span>
                <input
                  className="auth-code"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
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
                onClick={verifyAndLink}
                disabled={busy || code.length !== 6 || (needsBirth && !birthDate)}
              >
                {busy ? tx('Vérification…') : tx('Valider et relier mon compte Facebook')}
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

/**
 * Complétion d'inscription sociale (Étape 2-bis, correctif fondateur) —
 * le callback Google/Facebook a découvert un email SANS compte wairyu et
 * SANS date de naissance déclarée. Au lieu d'une erreur JSON brute, la
 * dernière étape se fait ICI : l'identité attend dans un cookie signé
 * (wairyu_oauth_pending), l'utilisateur saisit sa date (18+ révolus),
 * POST /api/auth/oauth/complete crée le compte, lie l'identité et ouvre
 * la session. La félicitations part ensuite via linkDevice() — même
 * parcours que les inscriptions email / pseudo.
 */
import { useState } from 'react';
import BirthDatePicker from '../components/BirthDatePicker';
import { ApiError, birthDateError, linkDevice, oauthComplete } from '../lib/auth-client';
import { getDeviceId } from '../lib/push-client';

interface Props {
  /** Fournisseur détecté dans le hash (#/oauth-complete?via=…) — purement décoratif. */
  via: 'google' | 'facebook' | null;
  /** congratsVia ≠ null ⇔ compte créé ⇒ overlay félicitations côté App. */
  onDone: (congratsVia?: string | null) => void;
}

export default function OAuthComplete({ via, onDone }: Props) {
  const [birthDate, setBirthDate] = useState('');
  const [error, setError] = useState('');
  const [stale, setStale] = useState(false);
  const [busy, setBusy] = useState(false);

  const providerKey = via === 'facebook' ? 'facebook' : 'google';
  const providerLabel = via === 'facebook' ? 'Facebook' : 'Google';

  const submit = async () => {
    setError('');
    const localErr = birthDateError(birthDate);
    if (localErr) {
      setError(localErr);
      return;
    }
    setBusy(true);
    try {
      const resp = await oauthComplete(birthDate);
      // Liaison appareil ↔ compte — ATTENDUE : sa réponse (congrats) pilote
      // l'overlay de félicitations visible côté App (tous canaux).
      let congratsVia: string | null = null;
      let pushOk = false;
      try {
        const lr = await linkDevice(getDeviceId());
        if (lr.congrats) {
          congratsVia = lr.congratsVia ?? providerKey;
          pushOk = lr.congrats === 'push';
        }
      } catch {
        // liaison ratée : l'overlay s'appuie sur le created de la complétion
      }
      const next = congratsVia ?? (resp.created ? providerKey : null);
      if (pushOk) {
        // Petit délai : laisse la bulle OS partir avant d'entrer dans l'app.
        window.setTimeout(() => onDone(next), 600);
        return;
      }
      onDone(next);
    } catch (e) {
      if (e instanceof ApiError && e.status === 400 && /en attente/i.test(e.message)) {
        // Cookie absent/expiré : le lien a vécu (> 10 min) ou navigation directe.
        setStale(true);
      }
      setError(e instanceof ApiError ? e.message : 'Erreur réseau — réessayez.');
    } finally {
      setBusy(false);
    }
  };

  const backToAuth = () => {
    window.location.hash = '';
  };

  return (
    <div className="app-shell">
      <main className="auth">
        <img src="/icons/icon-192.png" alt="Logo Wairyu" className="auth-logo" width={64} height={64} />
        <h1 className="auth-title">
          Wai<span className="accent">ryu</span>
        </h1>
        {stale ? (
          <>
            <p className="auth-sub">
              Cette étape a expiré (valable 10 minutes). Revenez à l'écran de connexion et
              recliquez sur « Continuer avec {providerLabel} » — vous reverrez directement cette
              dernière étape.
            </p>
            <div className="auth-form">
              <button className="btn btn-primary btn-block" onClick={backToAuth}>
                Retour à la connexion
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="auth-sub">
              Dernière étape pour créer votre compte avec {providerLabel} : votre date de
              naissance. Elle n'est jamais publiée — elle sert uniquement à vérifier que vous
              avez 18 ans révolus.
            </p>
            <div className="auth-form">
              <BirthDatePicker
                label="Date de naissance — 18 ans révolus requis"
                value={birthDate}
                onChange={setBirthDate}
              />
              <button className="btn btn-primary btn-block" onClick={submit} disabled={busy || !birthDate}>
                {busy ? 'Création…' : 'Créer mon compte'}
              </button>
              <button className="btn btn-ghost btn-block" onClick={backToAuth} disabled={busy}>
                Annuler
              </button>
            </div>
          </>
        )}
        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}
        <p className="auth-legal">
          En continuant, vous acceptez d'avoir 18 ans révolus et nos règles : respect,
          consentement, zéro contenu non consenti. Vos données restent les vôtres — export et
          suppression à tout moment.
        </p>
      </main>
    </div>
  );
}

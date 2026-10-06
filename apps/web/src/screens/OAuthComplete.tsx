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
import { ApiError, birthDateError, linkDevice, oauthComplete } from '../lib/auth-client';
import { getDeviceId } from '../lib/push-client';

interface Props {
  /** Fournisseur détecté dans le hash (#/oauth-complete?via=…) — purement décoratif. */
  via: 'google' | 'facebook' | null;
  onDone: () => void;
}

export default function OAuthComplete({ via, onDone }: Props) {
  const [birthDate, setBirthDate] = useState('');
  const [error, setError] = useState('');
  const [stale, setStale] = useState(false);
  const [busy, setBusy] = useState(false);

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
      await oauthComplete(birthDate);
      // Liaison appareil ↔ compte : notification de félicitations (compte
      // créé via Google/Facebook → congrats_pending posé à la création).
      void linkDevice(getDeviceId())
        .then((lr) => {
          if (lr.congrats) {
            // Petit délai : laisse la bulle OS partir avant d'entrer dans l'app.
            window.setTimeout(onDone, 600);
            return;
          }
          onDone();
        })
        .catch(() => onDone());
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
              <label className="field">
                <span>Date de naissance (AAAA-MM-JJ)</span>
                <input type="date" value={birthDate} min="1930-01-01" onChange={(e) => setBirthDate(e.target.value)} />
              </label>
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

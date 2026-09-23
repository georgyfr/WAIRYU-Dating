/**
 * Écran compte (authentifié, Étape 2) — informations, export RGPD,
 * déconnexions et suppression de compte (droit à l'effacement immédiat).
 * Étape 6 : section Notifications (Web Push VAPID — nouveau message, match,
 * demande de révélation) avec désabonnement en 1 clic (respect des réglages).
 */
import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api';
import { PersonalityBadge, PersonalityProposal } from './PersonalityProposal';
import type { MeResponse, PushConfigResponse } from '@wairyu/shared';

interface Props {
  me: MeResponse;
  onLoggedOut: () => void;
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
  return output;
}

export function Account({ me, onLoggedOut }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [showPers, setShowPers] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function logout() {
    setBusy(true);
    try {
      await api('/api/auth/logout', { json: {} });
      onLoggedOut();
    } catch {
      onLoggedOut(); // le cookie est probablement déjà mort
    }
  }

  async function logoutAll() {
    setBusy(true);
    try {
      const res = await api<{ revoked: number }>('/api/auth/logout-all', { json: {} });
      setMessage(`${res.revoked} session${res.revoked > 1 ? 's' : ''} fermée${res.revoked > 1 ? 's' : ''} partout.`);
      onLoggedOut();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue.');
    }
    setBusy(false);
  }

  async function deleteAccount() {
    setBusy(true);
    setError(null);
    try {
      await api('/api/account', { method: 'DELETE', json: { confirm: true } });
      window.alert(
        'Ton compte et tes données ont été supprimés. À bientôt, peut-être — merci d\u2019avoir essayé wairyu.',
      );
      onLoggedOut();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue.');
      setBusy(false);
    }
  }

  function exportData() {
    // Le serveur renvoie Content-Disposition: attachment.
    window.location.href = '/api/account/export';
    setMessage('Ton export JSON est en cours de téléchargement.');
  }

  // ------------------------------------------------------------------
  // Notifications Web Push (Étape 6.8)
  // ------------------------------------------------------------------

  const [pushEnabled, setPushEnabled] = useState<boolean | null>(null);
  const [pushSupported] = useState<boolean>(
    typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window,
  );

  const refreshPush = useCallback(async () => {
    try {
      const cfg = await api<PushConfigResponse>('/api/push/key');
      if (!cfg.enabled || !cfg.publicKey) {
        setPushEnabled(false);
        return;
      }
      const reg = await navigator.serviceWorker.getRegistration();
      const sub = reg ? await reg.pushManager.getSubscription() : null;
      setPushEnabled(sub !== null);
    } catch {
      setPushEnabled(false);
    }
  }, []);

  useEffect(() => {
    void refreshPush();
  }, [refreshPush]);

  async function enablePush() {
    setBusy(true);
    setError(null);
    try {
      const cfg = await api<PushConfigResponse>('/api/push/key');
      if (!cfg.enabled || !cfg.publicKey) {
        setMessage('Les notifications ne sont pas encore activées sur ce serveur.');
        setBusy(false);
        return;
      }
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setMessage('Permission refusée — tu pourras la réactiver dans ton navigateur.');
        setBusy(false);
        return;
      }
      const reg = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;
      const existing = await reg.pushManager.getSubscription();
      const sub =
        existing ??
        (await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(cfg.publicKey) as unknown as BufferSource,
        }));
      const j = sub.toJSON() as { endpoint?: string; keys?: { p256dh?: string; auth?: string } };
      await api('/api/push/subscribe', {
        json: { endpoint: j.endpoint, keys: { p256dh: j.keys?.p256dh, auth: j.keys?.auth } },
      });
      setPushEnabled(true);
      setMessage('Notifications activées — messages, matchs et révélations t’attendront ici.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Activation impossible sur ce navigateur.');
    }
    setBusy(false);
  }

  async function disablePush() {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      const sub = reg ? await reg.pushManager.getSubscription() : null;
      if (sub) {
        const j = sub.toJSON() as { endpoint?: string };
        if (j.endpoint) {
          await api('/api/push/unsubscribe', { json: { endpoint: j.endpoint } }).catch(() => undefined);
        }
        await sub.unsubscribe();
      }
      setPushEnabled(false);
      setMessage('Notifications désactivées.');
    } catch {
      setError('Désactivation impossible — réessaie.');
    }
    setBusy(false);
  }

  const created = new Date(me.createdAt * 1000).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <section className="card wide">
      <div className="me-head">
        <div className="avatar">{(me.displayName ?? me.email)[0]?.toUpperCase()}</div>
        <div>
          <h2>{me.displayName ?? 'Bienvenue !'}</h2>
          <p className="hint">{me.email}</p>
        </div>
      </div>

      <div className="pill-row">
        <span className="pill ok">{me.emailVerified ? 'Email vérifié' : 'Email non vérifié'}</span>
        <span className="pill">{me.plan === 'free' ? 'Gratuit' : me.plan}</span>
        <span className="pill">Membre depuis le {created}</span>
      </div>

      <div className="profile-cta">
        <div>
          <strong>{me.profileComplete ? 'Ton profil est complet' : 'Ton profil est à compléter'}</strong>
          <p className="hint">
            {me.profileComplete
              ? 'Photos protégées, prompts et préférences sont prêts pour la découverte.'
              : 'Photos, prompts, préférences — 5 minutes suffisent pour entrer en découverte.'}
          </p>
        </div>
        <button type="button" className="btn primary" onClick={() => window.location.assign('#/profile')}>
          {me.profileComplete ? 'Modifier mon profil' : 'Compléter mon profil'}
        </button>
      </div>

      <div className="profile-cta">
        <div>
          <strong>Questionnaire &amp; découverte</strong>
          <p className="hint">
            Réponds au questionnaire progressif (2 niveaux, sauvegarde automatique) pour affiner
            ton score de compatibilité — puis découvre les profils « Pourquoi ce match ? ».
          </p>
        </div>
        <div className="btn-col">
          <button type="button" className="btn primary" onClick={() => window.location.assign('#/discover')}>
            Découvrir
          </button>
          <button type="button" className="btn ghost" onClick={() => window.location.assign('#/matches')}>
            Mes matchs
          </button>
          <button type="button" className="btn ghost" onClick={() => window.location.assign('#/questionnaire')}>
            Mon questionnaire
          </button>
        </div>
      </div>

      <PersonalityBadge onOpen={() => setShowPers((v) => !v)} />
      {showPers && <PersonalityProposal refine />}

      {/* ---- Notifications Web Push (Étape 6.8) ---- */}
      {pushSupported && (
        <div className="profile-cta">
          <div>
            <strong>Notifications</strong>
            <p className="hint">
              {pushEnabled
                ? 'Tu reçois une alerte pour les nouveaux messages (hors conversation ouverte), matchs et demandes de révélation.'
                : 'Active-les pour être prévenu·e d’un nouveau message, match ou demande de révélation — même app fermée.'}
            </p>
          </div>
          <div className="btn-col">
            {!pushEnabled ? (
              <button type="button" className="btn primary" onClick={() => void enablePush()} disabled={busy}>
                Activer les notifications
              </button>
            ) : (
              <button type="button" className="btn ghost" onClick={() => void disablePush()} disabled={busy}>
                Désactiver
              </button>
            )}
          </div>
        </div>
      )}

      {message && <p className="notice">{message}</p>}

      <div className="actions">
        <button type="button" className="btn ghost" onClick={exportData} disabled={busy}>
          Exporter mes données (JSON)
        </button>
        <button type="button" className="btn ghost" onClick={logoutAll} disabled={busy}>
          Déconnexion partout
        </button>
        <button type="button" className="btn ghost" onClick={logout} disabled={busy}>
          Se déconnecter
        </button>
      </div>

      <div className="danger-zone">
        <p className="hint">
          Supprimer ton compte efface immédiatement tes données (email, sessions, profil futur).
          C'est définitif.
        </p>
        {!confirming ? (
          <button type="button" className="btn danger-ghost" onClick={() => setConfirming(true)} disabled={busy}>
            Supprimer mon compte
          </button>
        ) : (
          <div className="danger-confirm">
            <button type="button" className="btn danger" onClick={deleteAccount} disabled={busy}>
              {busy ? 'Suppression…' : 'Oui, tout supprimer définitivement'}
            </button>
            <button type="button" className="btn ghost" onClick={() => setConfirming(false)} disabled={busy}>
              Annuler
            </button>
          </div>
        )}
        {error && <p className="error">{error}</p>}
      </div>
    </section>
  );
}

/**
 * Écran compte (authentifié, Étape 2) — informations, export RGPD,
 * déconnexions et suppression de compte (droit à l'effacement immédiat).
 * Le profil complet (photos, questionnaire) arrive aux Étapes 3-4.
 */
import { useState } from 'react';
import { api } from '../lib/api';
import { PersonalityBadge, PersonalityProposal } from './PersonalityProposal';
import type { MeResponse } from '@wairyu/shared';

interface Props {
  me: MeResponse;
  onLoggedOut: () => void;
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
          <button type="button" className="btn primary" onClick={() => window.location.assign('#/questionnaire')}>
            Mon questionnaire
          </button>
          <button type="button" className="btn ghost" onClick={() => window.location.assign('#/discover')}>
            Découvrir
          </button>
        </div>
      </div>

      <PersonalityBadge onOpen={() => setShowPers((v) => !v)} />
      {showPers && <PersonalityProposal refine />}

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

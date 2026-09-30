/**
 * Écran compte (authentifié, Étape 2) — informations, export RGPD,
 * déconnexions et suppression de compte (droit à l'effacement immédiat).
 * Étape 6 : section Notifications (Web Push VAPID — nouveau message, match,
 * demande de révélation) avec désabonnement en 1 clic (respect des réglages).
 * Étape 7 : badge « Identité vérifiée » (selfie semi-manuel), paramètres de
 * confidentialité (pause / incognito / visibilité du mode), bannière de suspension.
 */
import { useCallback, useEffect, useState } from 'react';
import { api, apiForm } from '../lib/api';
import { sendTestPush, getPushPreferences, putPushPreferences, notificationState, onPermissionMayChange, isStandaloneApp, type PushPrefs, type NotificationState } from '../lib/push-client';
import { NotificationRepairSteps } from '../components/NotificationGate'; // Task 65 : mêmes voies de déblocage que la carte globale
import { PersonalityBadge, PersonalityProposal } from './PersonalityProposal';
import {
  SELFIE_POSE_LABELS,
  VERIFICATION,
  type MeResponse,
  type PushConfigResponse,
  type PrivacyResponse,
  type VerificationStartResponse,
  type VerificationStatusResponse,
} from '@wairyu/shared';

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

  // ---- Étape 7 : confidentialité + vérification selfie ----
  const [privacy, setPrivacy] = useState<PrivacyResponse | null>(null);
  const [verif, setVerif] = useState<VerificationStatusResponse | null>(null);
  const [verifFiles, setVerifFiles] = useState<(File | null)[]>([null, null, null]);
  const [verifBusy, setVerifBusy] = useState(false);

  // ---- Task 62 (fondateur) : Réglages → Notifications (types filtrables) ----
  const [pushPrefs, setPushPrefs] = useState<PushPrefs | null>(null);
  const [prefsBusy, setPrefsBusy] = useState(false);
  const [overlayGuide, setOverlayGuide] = useState(false);
  // ---- Task 65 (fondateur) : état LIVE de la permission du téléphone ----
  // « les notifications restent automatiquement bloquées sur Google » : les
  // Réglages doivent montrer la VÉRITÉ système (Activées / Pas encore
  // demandées / Bloquées) et offrir la réparation au même endroit.
  const [sysPerm, setSysPerm] = useState<NotificationState>(() => notificationState());
  const [sysRepairOpen, setSysRepairOpen] = useState(false);
  // ---- Task 58/60 : sécurité du compte (@pseudo, email, mot de passe) ----
  const [pwStatus, setPwStatus] = useState<{
    hasPassword: boolean;
    hasRecoveryEmail: boolean;
    recoveryEmailMasked: string | null;
    username: string | null;
    hasRecoveryCode: boolean;
  } | null>(null);
  const [recEmail, setRecEmail] = useState('');
  const [recSaving, setRecSaving] = useState(false);
  const [recSaved, setRecSaved] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [pwCurrent, setPwCurrent] = useState('');
  const [pwNew, setPwNew] = useState('');
  const [secError, setSecError] = useState<string | null>(null);
  const [secNotice, setSecNotice] = useState<string | null>(null);

  const refreshSafety = useCallback(async () => {
    try {
      const [p, v] = await Promise.all([
        api<PrivacyResponse>('/api/settings/privacy'),
        api<VerificationStatusResponse>('/api/safety/verification'),
      ]);
      setPrivacy(p);
      setVerif(v);
    } catch {
      /* silencieux — sections non critiques */
    }
  }, []);

  useEffect(() => {
    void refreshSafety();
  }, [refreshSafety]);

  // Task 62 — préférences de notifications (défaut tout activé côté serveur).
  useEffect(() => {
    getPushPreferences()
      .then(setPushPrefs)
      .catch(() => null);
    // Task 58 — état identifiants (mot de passe ? email de récupération ?).
    api<{
      hasPassword: boolean;
      hasRecoveryEmail: boolean;
      recoveryEmailMasked: string | null;
      username: string | null;
      hasRecoveryCode: boolean;
    }>('/api/auth/password/status')
      .then(setPwStatus)
      .catch(() => null);
  }, []);

  // Task 65 — le badge suit la permission RÉELLE du téléphone, et se
  // re-vérifie au retour des Réglages Android/Chrome (l’utilisateur vient
  // d’y débloquer wairyu → le badge passe à Activées sans recharger).
  useEffect(() => onPermissionMayChange(setSysPerm), []);

  /** Toggle d'un type de notification (upsert serveur — vaut pour TOUS les appareils). */
  async function togglePushType(type: keyof PushPrefs['types']) {
    if (!pushPrefs) return;
    setPrefsBusy(true);
    setError(null);
    try {
      const next = await putPushPreferences({
        types: { ...pushPrefs.types, [type]: !pushPrefs.types[type] },
      });
      setPushPrefs(next);
    } catch (err) {
      setError('Impossible d’enregistrer ta préférence — réessaie.');
    }
    setPrefsBusy(false);
  }

  /** Interrupteur maître des notifications. */
  async function togglePushMaster() {
    if (!pushPrefs) return;
    setPrefsBusy(true);
    setError(null);
    try {
      const next = await putPushPreferences({ enabled: !pushPrefs.enabled });
      setPushPrefs(next);
      setMessage(
        next.enabled
          ? 'Notifications réactivées — pense à activer la permission sur cet appareil si besoin.'
          : 'Notifications désactivées — tu ne recevras plus aucune alerte.',
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue.');
    }
    setPrefsBusy(false);
  }

  /** Task 58 — enregistre l'email de récupération (sert UNIQUEMENT au mot de passe oublié). */
  async function saveRecoveryEmail(e: React.FormEvent) {
    e.preventDefault();
    setSecError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(recEmail.trim())) {
      setSecError('Cette adresse email semble invalide.');
      return;
    }
    setRecSaving(true);
    try {
      await api('/api/auth/account/recovery-email', { json: { email: recEmail.trim() } });
      setRecSaved(true);
      setSecNotice('Email de récupération enregistré ✓ — il servira uniquement à retrouver ton mot de passe.');
      setPwStatus((prev) => (prev ? { ...prev, hasRecoveryEmail: true } : prev));
    } catch (err) {
      setSecError(err instanceof Error ? err.message : 'Erreur inattendue.');
    }
    setRecSaving(false);
  }

  /** Task 58 — changement de mot de passe (les autres appareils sont déconnectés). */
  async function changePassword(e?: React.FormEvent) {
    e?.preventDefault();
    setSecError(null);
    if (pwNew.length < 8) {
      setSecError('Le nouveau mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    setPrefsBusy(true);
    try {
      await api('/api/auth/password/change', {
        json: { current_password: pwCurrent, new_password: pwNew },
      });
      setSecNotice('Mot de passe changé ✓ — les autres appareils connectés à ton compte ont été déconnectés.');
      setPwOpen(false);
      setPwCurrent('');
      setPwNew('');
    } catch (err) {
      setSecError(err instanceof Error ? err.message : 'Erreur inattendue.');
    }
    setPrefsBusy(false);
  }

  async function putPrivacy(patch: Partial<Pick<PrivacyResponse, 'paused' | 'incognito' | 'modeVisible'>>) {
    setBusy(true);
    setError(null);
    try {
      const r = await api<PrivacyResponse>('/api/settings/privacy', { method: 'PUT', json: patch });
      setPrivacy((prev) => ({ ...(prev ?? { paused: false, incognito: false, modeVisible: true, note: '' }), ...patch, note: r.note }));
      setMessage(r.note);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue.');
    }
    setBusy(false);
  }

  async function startVerification() {
    setVerifBusy(true);
    setError(null);
    try {
      await api<VerificationStartResponse>('/api/safety/verification/start', { json: {} });
      await refreshSafety();
      setMessage('Vérification démarrée — envoie tes 3 selfies dans l’ordre demandé.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue.');
    }
    setVerifBusy(false);
  }

  async function submitVerification() {
    if (verifFiles.some((f) => !f)) {
      setError('Envoie les 3 selfies (une photo par pose).');
      return;
    }
    setVerifBusy(true);
    setError(null);
    try {
      const form = new FormData();
      verifFiles.forEach((f, i) => {
        if (f) form.append(`pose${i}`, f, `pose${i}.jpg`);
      });
      const r = await apiForm<{ ok: true; note: string }>('/api/safety/verification/submit', form);
      setVerifFiles([null, null, null]);
      await refreshSafety();
      setMessage(r.note);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue.');
    }
    setVerifBusy(false);
  }

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

  /**
   * Task 53 — guide d'installation iPhone : iOS n'autorise les notifications
   * web QUE pour la PWA installée sur l'écran d'accueil (iOS 16.4+). Sans ce
   * guide, un iPhone ne voit aucune explication (la section était masquée)
   * — d'où l'impression que « ça marche uniquement sur PC ».
   */
  const [installGuide] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const ua = navigator.userAgent;
    const isIOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === 'MacIntel' && ((navigator as { maxTouchPoints?: number }).maxTouchPoints ?? 0) > 1);
    if (!isIOS) return null;
    const standaloneIOS = (navigator as { standalone?: boolean }).standalone === true;
    const standalone =
      standaloneIOS ||
      (typeof window.matchMedia === 'function' && window.matchMedia('(display-mode: standalone)').matches);
    if (standalone) return null;
    return (
      '📱 Sur iPhone, iOS n’affiche les notifications que pour l’application installée. ' +
      '1) Touche le bouton Partager (le carré avec la flèche) en bas de Safari — ' +
      '2) choisis « Sur l’écran d’accueil » — ' +
      '3) ouvre wairyu depuis la nouvelle icône — ' +
      '4) reviens dans Paramètres : les notifications s’activeront en un tap.'
    );
  });

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
        setMessage(
          'Permission refusée — pour la réactiver : réglages du navigateur → autorisations du site → Notifications.',
        );
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
      // Task 54 — démonstration immédiate : un VRAI push part du serveur
      // (Worker → VAPID → FCM → SW → bulle OS avec le nom de l'app).
      void sendTestPush();
      setMessage(
        'Notifications activées — une notification de simulation WAIRYU arrive dans quelques secondes 👀',
      );
    } catch (err) {
      setError('Activation impossible — vérifie ta connexion et réessaie.');
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

  /** Task 54 — SIMULATION : un VRAI push vers tous ses appareils (pas une
   * notification locale) pour prouver que le pipeline fonctionne. */
  async function testPush() {
    setBusy(true);
    setError(null);
    const sent = await sendTestPush();
    setBusy(false);
    if (sent === null) {
      setError('Impossible d’envoyer la simulation — vérifie ta connexion et réessaie.');
    } else if (sent === 0) {
      setError(
        'Aucun appareil abonné sur ce compte — réactive les notifications puis retente la simulation.',
      );
    } else {
      setMessage(
        `🔔 Simulation envoyée vers ${sent} appareil${sent > 1 ? 's' : ''} — la notification WAIRYU arrive dans quelques secondes (regarde en bas à droite, ou ton centre de notifications).`,
      );
    }
  }

  const created = new Date(me.createdAt * 1000).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="app page-settings">
      <header className="wizard-head">
        <button
          type="button" className="back" aria-label="Retour à mon profil"
          onClick={() => window.location.assign('#/myprofile')}
        >
          ‹
        </button>
        <h1>Paramètres &amp; compte</h1>
      </header>
      <section className="card wide">
      <div className="me-head">
        <div className="avatar">{(me.displayName ?? me.email)[0]?.toUpperCase()}</div>
        <div>
          <h2>
            {me.displayName ?? 'Bienvenue !'}
            {me.verified && (
              <span className="chip chip-verified" title="Selfie reviewé par l'équipe wairyu">
                {' '}✓ Vérifié·e
              </span>
            )}
          </h2>
          <p className="hint">{me.email}</p>
        </div>
      </div>

      {me.suspendedUntil && (
        <div className="suspension-banner">
          ⛔ Ton compte est suspendu jusqu’au{' '}
          {new Date(me.suspendedUntil * 1000).toLocaleDateString('fr-FR')} — contacte le support
          si tu penses que c’est une erreur.
        </div>
      )}

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
          <button type="button" className="btn ghost" onClick={() => window.location.assign('#/messages')}>
            Ma messagerie
          </button>
          <button type="button" className="btn ghost" onClick={() => window.location.assign('#/questionnaire')}>
            Mon questionnaire
          </button>
        </div>
      </div>

      <PersonalityBadge onOpen={() => setShowPers((v) => !v)} />
      {showPers && <PersonalityProposal refine />}

      {/* ---- Vérification d'identité (Étape 7, plan 7.1) ---- */}
      <div className="profile-cta">
        <div>
          <strong>Vérification d’identité</strong>
          <p className="hint">
            3 selfies dans un ordre aléatoire, review humaine — le badge
            « Vérifié·e » rassure les autres membres et booste ta crédibilité.
          </p>
        </div>
        <div className="btn-col">
          {verif?.verified ? (
            <span className="pill ok">✓ Identité vérifiée</span>
          ) : verif?.status === 'awaiting' && verif.poses.length > 0 ? (
            <>
              <ol className="pose-list">
                {verif.poses.map((pose, i) => (
                  <li key={pose}>
                    <label>
                      <strong>Pose {i + 1} :</strong> {SELFIE_POSE_LABELS[pose]}
                      <input
                        type="file"
                        accept="image/*"
                        capture="user"
                        onChange={(e) =>
                          setVerifFiles((prev) => {
                            const next = [...prev];
                            next[i] = e.target.files?.[0] ?? null;
                            return next;
                          })
                        }
                      />
                      {verifFiles[i] && <span className="hint"> ✓ photo prête</span>}
                    </label>
                  </li>
                ))}
              </ol>
              <button type="button" className="btn primary" disabled={verifBusy} onClick={() => void submitVerification()}>
                {verifBusy ? 'Envoi…' : 'Envoyer mes 3 selfies'}
              </button>
              <p className="hint">Max {Math.round(VERIFICATION.photoMaxBytes / (1024 * 1024))} Mo par photo.</p>
            </>
          ) : verif?.status === 'pending' ? (
            <span className="pill">Review en cours — sous 24 h</span>
          ) : verif?.status === 'rejected' ? (
            <>
              <span className="pill err">Refusée : {verif.rejectionReason ?? 'photos non conformes'}</span>
              <button type="button" className="btn ghost" disabled={verifBusy} onClick={() => void startVerification()}>
                Réessayer
              </button>
            </>
          ) : (
            <button type="button" className="btn primary" disabled={verifBusy} onClick={() => void startVerification()}>
              Vérifier mon identité
            </button>
          )}
        </div>
      </div>

      {/* ---- Confidentialité v1 (Étape 7, plan 7.7) ---- */}
      <div className="profile-cta">
        <div>
          <strong>Confidentialité</strong>
          <p className="hint">
            {privacy?.note ??
              'Pause, incognito et visibilité du mode — tes photos restent sous ton contrôle.'}
          </p>
        </div>
        <div className="privacy-toggles">
          <label className="toggle-row">
            <input
              type="checkbox"
              checked={privacy?.paused ?? false}
              disabled={busy}
              onChange={(e) => void putPrivacy({ paused: e.target.checked })}
            />
            <span>
              <strong>Mettre mon profil en pause</strong>
              <br />
              <small>Masqué de tous les feeds — matchs et conversations intacts.</small>
            </span>
          </label>
          <label className="toggle-row">
            <input
              type="checkbox"
              checked={privacy?.incognito ?? false}
              disabled={busy}
              onChange={(e) => void putPrivacy({ incognito: e.target.checked })}
            />
            <span>
              <strong>Mode incognito</strong>
              <br />
              <small>Masqué du feed — seules les personnes que TU likes te voient.</small>
            </span>
          </label>
          <label className="toggle-row">
            <input
              type="checkbox"
              checked={privacy?.modeVisible ?? true}
              disabled={busy}
              onChange={(e) => void putPrivacy({ modeVisible: e.target.checked })}
            />
            <span>
              <strong>Afficher l’étiquette « Mode Invisible »</strong>
              <br />
              <small>Le flou de tes photos reste actif dans tous les cas.</small>
            </span>
          </label>
        </div>
      </div>

      {/* ---- Application mobile (Task 56 : APK Android signé + guide PWA iPhone) ---- */}
      <div className="profile-cta">
        <div>
          <strong>Application mobile</strong>
          <p className="hint">
            Installe wairyu sur ton téléphone : plein écran, icône sur l'accueil, notifications comme un SMS.
            Android reçoit un APK officiel signé, iPhone un guide d'installation en 4 gestes.
          </p>
        </div>
        <div className="btn-col">
          <a className="btn primary" href="/app" target="_blank" rel="noreferrer">
            📱 Installer l'application
          </a>
        </div>
      </div>

      {/* ---- Notifications Web Push (Étape 6.8 · Task 53/54/62) ---- */}
      {(pushSupported || installGuide) && (
        <div className="profile-cta">
          <div>
            <strong>Notifications</strong>
            <p className="hint">
              {pushEnabled
                ? 'Tu reçois une alerte pour les nouveaux messages, matchs et demandes — comme un SMS, même app fermée.'
                : 'Active-les pour être prévenu·e d’un nouveau message, match ou demande de révélation — même app fermée.'}
            </p>
            {overlayGuide && (
              <p className="hint tiny push-overlay-guide">
                📵 <strong>Ton téléphone bloque la demande</strong> : une autre application affiche par-dessus
                l’écran (filtre de lumière bleue, protection des yeux, bulles de messagerie…). Ferme ces
                applications ou <strong>redémarre le téléphone</strong>, puis réessaie — c’est le téléphone,
                pas wairyu, qui refuse. Solution durable : réglages Android → Applications → [cette appli] →
                désactive « Afficher par-dessus les autres applications ».
              </p>
            )}
          </div>
          {installGuide && <div className="push-guide">{installGuide}</div>}
          {/* Task 65 — état RÉEL de la permission du téléphone (vérité système) */}
          {sysPerm !== 'unsupported' && (
            <div className="notif-sys" data-testid="notif-sys">
              <div className="notif-sys-row">
                <span className="notif-sys-label">Notifications du téléphone</span>
                <span className={`notif-sys-badge ${sysPerm}`} data-testid="notif-sys-badge">
                  {sysPerm === 'granted' && '✅ Activées'}
                  {sysPerm === 'default' && '⏳ Pas encore demandées'}
                  {sysPerm === 'denied' && '❌ Bloquées'}
                </span>
              </div>
              {sysPerm === 'granted' && isStandaloneApp() && (
                <p className="hint tiny">
                  Gérées par l’application — comme Badoo, elles ne dépendent plus des réglages de
                  sites de Chrome.
                </p>
              )}
              {sysPerm === 'default' && (
                <p className="hint tiny">
                  Pas encore demandées — appuie sur « Activer les notifications » ci-dessous, ou
                  installe l’application (voie Badoo) pour qu’elles soient gérées par l’appli
                  elle-même.
                </p>
              )}
              {sysPerm === 'denied' && (
                <>
                  <p className="hint tiny">
                    Bloquées par le téléphone ou Chrome — ça se débloque en 2 minutes (le même
                    écran Chrome que celui de ta capture).
                  </p>
                  <button
                    type="button"
                    className="btn ghost"
                    data-testid="notif-sys-repair"
                    onClick={() => setSysRepairOpen((v) => !v)}
                  >
                    {sysRepairOpen ? 'Masquer le guide de déblocage' : '🛠️ Réparer — montrer le guide'}
                  </button>
                  {sysRepairOpen && <NotificationRepairSteps />}
                </>
              )}
            </div>
          )}
          {/* Task 62 — Réglages des types de notifications (serveur = source de vérité) */}
          {pushPrefs && (
            <div className="push-prefs" data-testid="push-prefs">
              <label className="push-pref-row push-pref-master">
                <span>
                  Recevoir des notifications
                  <small> — interrupteur général, tous tes appareils</small>
                </span>
                <input
                  type="checkbox"
                  checked={pushPrefs.enabled}
                  onChange={() => void togglePushMaster()}
                  disabled={prefsBusy}
                />
              </label>
              <div className="push-pref-types">
                <label className="push-pref-row">
                  <span>💬 Nouveaux messages</span>
                  <input
                    type="checkbox"
                    checked={pushPrefs.types.message}
                    onChange={() => void togglePushType('message')}
                    disabled={prefsBusy || !pushPrefs.enabled}
                  />
                </label>
                <label className="push-pref-row">
                  <span>✨ Matchs et demandes de discussion</span>
                  <input
                    type="checkbox"
                    checked={pushPrefs.types.match}
                    onChange={() => void togglePushType('match')}
                    disabled={prefsBusy || !pushPrefs.enabled}
                  />
                </label>
                <label className="push-pref-row">
                  <span>🛡️ Rappels de sécurité (check-in)</span>
                  <input
                    type="checkbox"
                    checked={pushPrefs.types.checkin}
                    onChange={() => void togglePushType('checkin')}
                    disabled={prefsBusy || !pushPrefs.enabled}
                  />
                </label>
                <label className="push-pref-row">
                  <span>📣 Infos wairyu (annonces officielles)</span>
                  <input
                    type="checkbox"
                    checked={pushPrefs.types.news}
                    onChange={() => void togglePushType('news')}
                    disabled={prefsBusy || !pushPrefs.enabled}
                  />
                </label>
              </div>
              <p className="hint tiny">Tes choix s’appliquent côté serveur, sur tous tes appareils — même app fermée.</p>
            </div>
          )}
          <div className="btn-col">
            {!pushEnabled ? (
              <button type="button" className="btn primary" onClick={() => void enablePush()} disabled={busy}>
                Activer les notifications
              </button>
            ) : (
              <>
                {/* Task 54 — simulation : prouve le pipeline complet en 1 clic */}
                <button type="button" className="btn primary" onClick={() => void testPush()} disabled={busy}>
                  🔔 Tester la notification
                </button>
                <button type="button" className="btn ghost" onClick={() => void disablePush()} disabled={busy}>
                  Désactiver sur cet appareil
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ---- Task 58/60 : Sécurité du compte (@pseudo, email, mot de passe) ---- */}
      <div className="sec-block">
        <h3>Sécurité du compte</h3>
        <p className="hint tiny">
          Ton identifiant : <strong>{pwStatus?.username ? `@${pwStatus.username}` : 'email ou compte social'}</strong>
          {pwStatus?.hasRecoveryEmail && pwStatus.recoveryEmailMasked
            ? ` — email de récupération : ${pwStatus.recoveryEmailMasked}`
            : ' — aucun email de récupération (utilise ton code de récupération en cas de perte)'}
          .
        </p>
        {secNotice && <p className="notice">{secNotice}</p>}
        {secError && <p className="error">{secError}</p>}

        {pwStatus?.hasPassword && (
          <div className="actions">
            {pwOpen ? (
              <div className="pw-form">
                <label className="field">
                  <span>Mot de passe actuel</span>
                  <input
                    type="password"
                    name="current-password"
                    autoComplete="current-password"
                    value={pwCurrent}
                    onChange={(e) => setPwCurrent(e.target.value)}
                    maxLength={128}
                  />
                </label>
                <label className="field">
                  <span>Nouveau mot de passe</span>
                  <input
                    type="password"
                    name="new-password"
                    autoComplete="new-password"
                    placeholder="au moins 8 caractères"
                    value={pwNew}
                    onChange={(e) => setPwNew(e.target.value)}
                    maxLength={128}
                  />
                </label>
                <p className="hint tiny">
                  Par sécurité, les autres appareils connectés à ton compte seront déconnectés.
                </p>
                <div className="btn-col">
                  <button type="button" className="btn primary" onClick={() => void changePassword()} disabled={prefsBusy}>
                    Enregistrer le nouveau mot de passe
                  </button>
                  <button type="button" className="btn ghost" onClick={() => setPwOpen(false)} disabled={prefsBusy}>
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" className="btn ghost" onClick={() => setPwOpen(true)}>
                Changer mon mot de passe
              </button>
            )}
          </div>
        )}

        {!pwStatus?.hasRecoveryEmail && !recSaved && (
          <form onSubmit={saveRecoveryEmail} noValidate>
            <p className="hint tiny">
              <strong>Astuce :</strong>{' ajoute un email de récupération — il servira uniquement à retrouver ton mot de passe en cas de perte. Il n\'apparaîtra jamais sur ton profil. Sans email, ton code de récupération reste ta bouée.'}
            </p>
            <label className="field">
              <span>Email de récupération (facultatif)</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                placeholder="toi@exemple.com"
                value={recEmail}
                onChange={(e) => setRecEmail(e.target.value)}
              />
            </label>
            <button type="submit" className="btn ghost" disabled={recSaving}>
              {recSaving ? 'Enregistrement…' : 'Enregistrer mon email'}
            </button>
          </form>
        )}
        {recSaved && (
          <p className="notice">Email enregistré ✓ — il servira uniquement à retrouver ton mot de passe en cas de perte.</p>
        )}
      </div>

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
    </div>
  );
}

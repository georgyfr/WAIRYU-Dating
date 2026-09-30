/**
 * NotificationGate (Task 65 — demande fondateur : « Malgré toutes mes
 * tentatives de débloquer les notifications, elles restent automatiquement
 * bloquées sur Google. Pourquoi ne pas configurer de manière à ce que
 * l’application puisse se gérer par l’application comme c’est le cas de
 * Badoo dans cette image ? »).
 *
 * CE QUE MONTRE SA CAPTURE (Chrome → ⋮ → Paramètres → Notifications) :
 *  - Badoo sous « Géré par l’application » : l’origine badoo.com est
 *    INSTALLÉE (WebAPK) — la permission de notifications vit au niveau de
 *    l’application Android, HORS de la liste des sites de Chrome ;
 *  - 16 sites sous « Non autorisé » + Chrome en mode « Réduire les demandes
 *    indésirables (recommandé) » : les demandes sont réduites à une pastille
 *    discrète, facile à rater → « automatiquement bloquées ».
 *
 * LE TROU COMBLÉ ICI : jusqu’à présent, permission 'denied' = silence TOTAL
 * de l’application (autoArmWebPush → skipped, PushBanner invisible pour
 * 'denied'). Le fondateur restait bloqué sans aucune aide dans l’appli.
 * Cette carte s’affiche exactement dans ce cas et donne :
 *  - la voie BADOO (installer l’application → permission gérée par l’appli) ;
 *  - le chemin Chrome EXACT de sa capture (Paramètres du site → Notifications
 *    → « Non autorisé » → wairyu → Autoriser) ;
 *  - le remède au mode « Réduire les demandes indésirables » ;
 *  - le chemin Réglages Android quand l’appli est déjà installée ;
 *  - une REPRISE AUTOMATIQUE au retour des Réglages (visibilitychange) :
 *    l’utilisateur débloque côté système, wairyu s’en aperçoit seul,
 *    (ré)abonne et célèbre — zéro appui supplémentaire.
 *
 * 100 % additif : PushBanner (permission 'default') et autoArmWebPush
 * (Task 62) restent inchangés — cette carte ne gère QUE le cas 'denied',
 * qui n’avait aucune réponse jusqu’ici.
 */

import { useEffect, useRef, useState } from 'react';
import {
  activateWebPush,
  notificationState,
  onPermissionMayChange,
  type NotificationState,
} from '../lib/push-client';

const LATER_KEY = 'wairyu_notifgate_later_ts';
const LATER_TTL = 24 * 3600e3; // « Plus tard » = 24 h (pas un piégé permanent)

/**
 * Les voies réelles de déblocage, partagées avec la section Réglages
 * (Account). Réutilisable partout (`<NotificationRepairSteps />`).
 *
 * Task 68 (captures du fondateur, 30/09) — remède aux DEUX impasses
 * constatées EN RÉEL sur son téléphone :
 *  ① taper wairyu dans la liste « Non autorisé » de Chrome n’offre PAS
 *    toujours « Autoriser » (renvoi vers les réglages système) → remède :
 *    « Tous les sites → wairyu.wairyu.workers.dev → Effacer et
 *    réinitialiser » + la voie 🔒 de la barre d’adresse (la plus directe) ;
 *  ② Réglages → Applications → wairyu → « Aucune autorisation » : NORMAL
 *    pour une appli installée via Chrome (déjà démystifié pour la position
 *    dans Profile.tsx t64) — étendu ici aux notifications.
 */
export function NotificationRepairSteps() {
  return (
    <div className="notifgate-paths" data-testid="notifgate-paths">
      <div className="notifgate-path">
        <span className="notifgate-path-tag ok">Le plus rapide — l’icône 🔒 de l’adresse</span>
        <ol>
          <li>
            Ouvre <strong>wairyu.wairyu.workers.dev</strong> dans <strong>Chrome</strong>
          </li>
          <li>
            Touche le <strong>🔒</strong> (ou ⓘ) à <strong>gauche de l’adresse</strong> →{' '}
            <strong>Autorisations</strong>
          </li>
          <li>
            <strong>Notifications</strong> → <strong>Autoriser</strong>
          </li>
          <li>Reviens ici : wairyu détecte tout seul le déblocage</li>
        </ol>
      </div>
      <div className="notifgate-path">
        <span className="notifgate-path-tag">Voie 2 — wairyu est dans « Non autorisé »</span>
        <ol>
          <li>
            Chrome → menu ⋮ → <strong>Paramètres</strong> → <strong>Paramètres des sites</strong>
          </li>
          <li>
            <strong>Notifications</strong> → touche <strong>wairyu</strong> : si un{' '}
            <strong>interrupteur</strong> s’affiche, active-le — c’est gagné
          </li>
          <li>
            Si l’écran ne propose <strong>rien</strong> (renvoi ailleurs) : reviens en arrière →{' '}
            <strong>Tous les sites</strong> → <strong>wairyu.wairyu.workers.dev</strong> →{' '}
            <strong>Effacer et réinitialiser</strong>. La demande d’autorisation réapparaîtra à la
            prochaine ouverture (⚠️ tu seras déconnecté·e : reconnecte-toi ensuite)
          </li>
        </ol>
      </div>
      <div className="notifgate-path">
        <span className="notifgate-path-tag">Voie 3 — le mieux à terme : la voie Badoo</span>
        <p>
          <strong>Installer l’application</strong> : dans Chrome, ouvre wairyu → menu ⋮ →{' '}
          <strong>« Installer l’application »</strong> → ouvre l’appli installée →{' '}
          <strong>Autoriser</strong> les notifications. Comme Badoo, elles passent sous{' '}
          <strong>« Géré par l’application »</strong> dans Chrome — plus jamais bloquées par la
          liste des sites.
        </p>
      </div>
      <div className="notifgate-path">
        <span className="notifgate-path-tag">Voie 4 — si aucune demande n’apparaît jamais</span>
        <p>
          Sur l’écran « Notifications » de Chrome, le mode{' '}
          <strong>« Réduire les demandes indésirables »</strong> transforme les demandes en petite
          pastille discrète. Choisis <strong>« Développer toutes les demandes »</strong> pour voir
          les fenêtres d’autorisation en entier.
        </p>
      </div>
      <div className="notifgate-path">
        <span className="notifgate-path-tag">Voie 5 — appli installée, toujours rien</span>
        <p>
          Réglages du téléphone → <strong>Applications</strong> → <strong>wairyu</strong> →{' '}
          <strong>Notifications</strong> → active <strong>« Autorisation de notifier »</strong>.
          C’est exactement le réglage « géré par l’application » que Badoo utilise.
        </p>
      </div>
      <p className="notifgate-note" data-testid="notifgate-note">
        ✅ <strong>Tu vois « Aucune autorisation » dans Réglages → Applications → wairyu ?</strong>{' '}
        C’est <strong>normal</strong> et ça ne bloque rien : une appli installée via Chrome ne
        garde aucune permission Android classique — <strong>tout se règle dans Chrome</strong>{' '}
        (voies 1 et 2). Cet écran vide n’est pas une panne.
      </p>
    </div>
  );
}

export default function NotificationGate() {
  const [state, setState] = useState<NotificationState>(() => notificationState());
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  // Réglages (#/app) possède SON propre statut + guide inline (Task 65) : la
  // carte globale s’efface là-bas pour ne jamais afficher deux fois les mêmes
  // voies à l’écran (constaté sur la capture E2E S4).
  const [onSettings, setOnSettings] = useState(
    () => typeof location !== 'undefined' && location.hash.startsWith('#/app'),
  );
  const recoveredRef = useRef(false); // 1 seule célébration (focus répétés)

  useEffect(() => {
    const onHash = () => setOnSettings(location.hash.startsWith('#/app'));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    // Seulement le cas 'denied' : 'default' est géré par PushBanner +
    // autoArmWebPush, 'granted' n’a besoin de rien.
    if (notificationState() !== 'denied') return;
    try {
      const ts = Number(localStorage.getItem(LATER_KEY) ?? '0');
      if (ts && Date.now() - ts < LATER_TTL) return;
    } catch {
      /* privacy mode — la carte reste proposée (bénin) */
    }
    setVisible(true);
    // Retour des Réglages (déverrouillage côté système) → reprise auto.
    return onPermissionMayChange((s) => {
      setState(s);
      if (s === 'granted' && !recoveredRef.current) {
        recoveredRef.current = true;
        void recover();
      }
    });
  }, []);

  /** Déblocage détecté → (ré)abonnement silencieux + célébration. */
  async function recover() {
    const res = await activateWebPush();
    setVisible(false);
    const { toast } = await import('../lib/toast');
    if (res === 'granted') {
      toast('🎉 Notifications débloquées — elles fonctionnent de nouveau !', 'success');
    } else if (res === 'server-off') {
      toast('Permission débloquée — le serveur enregistrera ton appareil à la prochaine ouverture.', 'info');
    } else {
      toast('Permission débloquée — si aucune alerte n’arrive, rouvre wairyu.', 'info');
    }
  }

  /** Bouton « J’ai activé — vérifier » : relecture LIVE de la permission. */
  async function verify() {
    setBusy(true);
    const s = notificationState();
    setState(s);
    if (s === 'granted') {
      recoveredRef.current = true;
      await recover();
      return;
    }
    setHint(
      'Toujours bloqué — essaie la Voie 1 (icône 🔒 à côté de l’adresse) ou la Voie 2 (Effacer et réinitialiser). Le changement est immédiat, inutile de redémarrer.',
    );
    setBusy(false);
  }

  function later() {
    setVisible(false);
    try {
      localStorage.setItem(LATER_KEY, String(Date.now()));
    } catch {
      /* bénin */
    }
  }

  if (!visible || state !== 'denied' || onSettings) return null;

  return (
    <div className="notifgate" role="region" aria-label="Réparer les notifications">
      <div className="notifgate-card" data-testid="notifgate">
        <button type="button" className="notifgate-x" aria-label="Plus tard" onClick={later}>
          ✕
        </button>
        <strong className="notifgate-title">🔔 Tes notifications sont bloquées par le téléphone</strong>
        <p className="notifgate-intro">
          Ce n’est pas wairyu — le téléphone ou Chrome a mémorisé un refus. Ça se débloque en 2
          minutes, choisis ta voie :
        </p>
        <NotificationRepairSteps />
        {hint && <p className="notifgate-hint" data-testid="notifgate-hint">{hint}</p>}
        <div className="notifgate-actions">
          <button type="button" className="btn primary" onClick={() => void verify()} disabled={busy}>
            {busy ? 'Vérification…' : 'J’ai activé — vérifier'}
          </button>
          <button type="button" className="btn ghost" onClick={later}>
            Plus tard
          </button>
        </div>
      </div>
    </div>
  );
}

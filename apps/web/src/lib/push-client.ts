/**
 * Client Web Push partagé (Task 53 — demande fondateur : « les notifications
 * doivent apparaître comme WhatsApp, sinon elles ne servent à rien »).
 *
 * L'activation historique vit dans screens/Account.tsx (Paramètres, Étape 6.8)
 * et y RESTE : ce module ajoute le chemin d'activation DIRECT depuis la
 * bannière PushBanner (composant global), sans réécrire Account.
 *
 * Chaîne complète :
 *   1. GET /api/push/key → clé publique VAPID (enabled:false → dégradation)
 *   2. Notification.requestPermission() — DOIT être déclenché par un geste
 *      utilisateur (clic) sinon le navigateur le rejette silencieusement
 *   3. navigator.serviceWorker.register('/sw.js') + ready
 *   4. pushManager.subscribe({userVisibleOnly, applicationServerKey})
 *   5. POST /api/push/subscribe → 1 ligne push_subscriptions par appareil
 *      (le serveur enverra à TOUS les appareils d'un utilisateur).
 */

import type { PushConfigResponse, PushTestResponse } from '@wairyu/shared';
import { api } from './api';

/** Support navigateur (PWA installée, Safari iOS ≥ 16.4, desktop, mobile). */
export function pushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
  return output;
}

export type PushActivateResult =
  | 'granted' // abonné et enregistré côté serveur
  | 'denied' // permission refusée (ou bloquée site → réglages navigateur)
  | 'unsupported' // pas de ServiceWorker/PushManager/Notification
  | 'server-off' // serveur sans secrets VAPID (dégradation gracieuse)
  | 'error'; // échec réseau / subscribe

/**
 * Active les notifications (permission + abonnement + enregistrement serveur).
 * À appeler DEPUIS UN CLIC. Idempotent : réutilise l'abonnement existant.
 */
export async function activateWebPush(): Promise<PushActivateResult> {
  if (!pushSupported()) return 'unsupported';
  try {
    const cfg = await api<PushConfigResponse>('/api/push/key');
    if (!cfg.enabled || !cfg.publicKey) return 'server-off';

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return 'denied';

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
    return 'granted';
  } catch {
    return 'error';
  }
}

/**
 * Task 54 — SIMULATION (demande fondateur : « fais-moi apparaître une
 * notification sur mon PC actuellement avec le nom de l'application »).
 * Demande au serveur d'envoyer un VRAI push vers tous les appareils
 * abonnés de l'utilisateur : Worker → VAPID → FCM/Apple → Service Worker
 * → bulle du système d'exploitation (même page visible — force:true).
 * Ce n'est PAS une notification locale fabriquée dans la page : tout le
 * pipeline Web Push réel est emprunté, c'est la preuve demandée.
 * Retourne le nombre d'appareils touchés, ou null si échec réseau.
 */
export async function sendTestPush(): Promise<number | null> {
  try {
    const r = await api<PushTestResponse>('/api/push/test', { method: 'POST' });
    return r.sent;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Task 62 (fondateur) — ARMEMENT AUTOMATIQUE des notifications.
// « Je suggère que les notifications se fassent automatiquement » : plus
// besoin de trouver un réglage. Dès qu'un utilisateur CONNECTÉ ouvre l'app :
//  - permission déjà 'granted' → (ré)abonnement silencieux SANS prompt
//    (répare les appareils désynchronisés, aucun geste requis) ;
//  - permission 'default' → le PROCHAIN geste utilisateur (1er tap, attendu
//    ≤ 60 s) déclenche requestPermission() — un prompt demandé DANS un geste
//    n'est jamais jeté par le navigateur, contrairement au prompt au load ;
//  - permission 'denied' → silence total (retenter serait du spam) ;
//  - refus « bloqué par une autre appli » (overlay) → cooldown 7 jours ;
//  - un essai par session (sessionStorage) + cooldown 24 h par appareil.
// ---------------------------------------------------------------------------

const AUTO_TS_KEY = 'wairyu_push_auto_ts';
const AUTO_KIND_KEY = 'wairyu_push_auto_kind';
const AUTO_SESSION_KEY = 'wairyu_push_auto_session';

function markAuto(kind: 'denied' | 'blocked') {
  try {
    localStorage.setItem(AUTO_TS_KEY, String(Date.now()));
    localStorage.setItem(AUTO_KIND_KEY, kind);
  } catch {
    /* bénin */
  }
}

function autoCooldownActive(): boolean {
  try {
    const ts = Number(localStorage.getItem(AUTO_TS_KEY) ?? '0');
    if (!ts) return false;
    const ttl = localStorage.getItem(AUTO_KIND_KEY) === 'denied' ? 7 * 24 * 3600e3 : 24 * 3600e3;
    return Date.now() - ts < ttl;
  } catch {
    return false;
  }
}

/**
 * Armement automatique (à appeler au boot quand `me` est connu).
 * Retourne l'état final : 'subscribed' | 'armed' | 'skipped' | 'error'.
 */
export async function autoArmWebPush(): Promise<'subscribed' | 'armed' | 'skipped' | 'error'> {
  if (!pushSupported()) return 'skipped';
  const permission = Notification.permission;
  if (permission === 'denied') return 'skipped';
  try {
    if (sessionStorage.getItem(AUTO_SESSION_KEY) === '1') return 'skipped';
  } catch {
    /* bénin */
  }
  if (autoCooldownActive()) return 'skipped';

  // Cas 1 — déjà accordée : (ré)abonnement silencieux, aucun prompt.
  if (permission === 'granted') {
    try {
      sessionStorage.setItem(AUTO_SESSION_KEY, '1');
    } catch {
      /* bénin */
    }
    try {
      const cfg = await api<PushConfigResponse>('/api/push/key');
      if (!cfg.enabled || !cfg.publicKey) return 'error';
      const reg = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;
      const existing = await reg.pushManager.getSubscription();
      if (!existing) {
        await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(cfg.publicKey) as unknown as BufferSource,
        });
      }
      const sub = await reg.pushManager.getSubscription();
      const j = sub?.toJSON() as { endpoint?: string; keys?: { p256dh?: string; auth?: string } } | null;
      await api('/api/push/subscribe', {
        json: { endpoint: j?.endpoint, keys: { p256dh: j?.keys?.p256dh, auth: j?.keys?.auth } },
      });
      return 'subscribed';
    } catch {
      return 'error';
    }
  }

  // Cas 2 — 'default' : on attend le PROCHAIN geste (tap) pour demander.
  try {
    sessionStorage.setItem(AUTO_SESSION_KEY, '1');
  } catch {
    /* bénin */
  }
  let fired = false;
  const cleanup = () => {
    document.removeEventListener('pointerdown', onGesture, true);
    document.removeEventListener('click', onGesture, true);
  };
  const onGesture = () => {
    if (fired) return;
    fired = true;
    cleanup();
    void (async () => {
      try {
        const cfg = await api<PushConfigResponse>('/api/push/key');
        if (!cfg?.enabled || !cfg.publicKey) return;
        if ((await Notification.requestPermission()) === 'granted') {
          await activateWebPush();
          try {
            localStorage.removeItem(AUTO_TS_KEY);
            localStorage.removeItem(AUTO_KIND_KEY);
          } catch {
            /* bénin */
          }
          // Task 59/62 — confirmation + renvoi vers les types de Réglages.
          const { toast } = await import('./toast');
          toast('Notifications activées 🔔 Tu peux choisir leurs types dans Réglages.', 'success');
        } else if (Notification.permission === 'default') {
          markAuto('blocked');
          const { toast } = await import('./toast');
          toast(
            "Ton téléphone bloque la demande (une autre appli affiche par-dessus l'écran). Réglages → Notifications pour le guide.",
            'info',
          );
        } else {
          markAuto('denied');
        }
      } catch {
        /* bénin — retentera à la prochaine session */
      }
    })();
  };
  document.addEventListener('pointerdown', onGesture, { capture: true, once: true });
  document.addEventListener('click', onGesture, { capture: true, once: true });
  return 'armed';
}

/** Lecture/écriture des préférences serveur (Task 62 — Réglages). */
export interface PushPrefs {
  enabled: boolean;
  types: { message: boolean; match: boolean; checkin: boolean; news: boolean };
}

export async function getPushPreferences(): Promise<PushPrefs> {
  return api<PushPrefs>('/api/push/preferences');
}

export async function putPushPreferences(patch: Partial<PushPrefs>): Promise<PushPrefs> {
  return api<PushPrefs>('/api/push/preferences', { method: 'PUT', json: patch });
}

// ---------------------------------------------------------------------------
// Task 65 (fondateur) — « gérées par l’application, comme Badoo ».
//
// SA CAPTURE (Chrome → ⋮ → Paramètres → Notifications) montre :
//  - Badoo sous « Géré par l’application » : l’origine badoo.com est
//    INSTALLÉE (WebAPK) — la permission de notifications vit au niveau de
//    l’application Android, HORS de la liste des sites de Chrome ;
//  - 16 sites « Non autorisé » + Chrome en mode « Réduire les demandes
//    indésirables (recommandé) » : les demandes sont réduites à une pastille
//    discrète → perçues comme « bloquées automatiquement par Google ».
//
// Ce module expose l’état système LIVE + la détection « appli installée »
// pour piloter la carte NotificationGate et le statut des Réglages, plus un
// signal de re-vérification quand l’utilisateur REVIENT des Réglages
// (visibilitychange/focus) : il débloque le toggle côté Android/Chrome,
// wairyu s’en aperçoit seul et (ré)abonne SANS nouveau geste.
// ---------------------------------------------------------------------------

export type NotificationState = 'granted' | 'default' | 'denied' | 'unsupported';

/** État ACTUEL de la permission système (lecture directe, sans effet). */
export function notificationState(): NotificationState {
  if (!pushSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * L’appli tourne-t-elle INSTALLÉE (WebAPK Chrome — la voie recommandée de la
 * page /app, PWA écran d’accueil iOS, APK TWA) ? Dans ce mode, la permission
 * de notifications devient un réglage de l’application Android elle-même —
 * l’équivalent exact du « Géré par l’application » de Badoo.
 */
export function isStandaloneApp(): boolean {
  try {
    if (window.matchMedia?.('(display-mode: standalone)').matches) return true;
    if (window.matchMedia?.('(display-mode: minimal-ui)').matches) return true;
    const nav = navigator as Navigator & { standalone?: boolean };
    return nav.standalone === true; // Safari iOS
  } catch {
    return false;
  }
}

/**
 * Re-vérifie la permission à chaque retour au premier plan : c’est le moment
 * où l’utilisateur revient des Réglages Android/Chrome après avoir débloqué.
 * Retourne une fonction de nettoyage (pattern useEffect).
 */
export function onPermissionMayChange(cb: (state: NotificationState) => void): () => void {
  if (!pushSupported()) return () => {};
  const fire = () => cb(Notification.permission as NotificationState);
  const onVis = () => {
    if (document.visibilityState === 'visible') fire();
  };
  document.addEventListener('visibilitychange', onVis);
  window.addEventListener('focus', fire);
  return () => {
    document.removeEventListener('visibilitychange', onVis);
    window.removeEventListener('focus', fire);
  };
}

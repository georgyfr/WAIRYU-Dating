/**
 * Client Web Push device-based (socle notifications — porté du v1 push-client).
 *
 * Chaîne complète :
 *   1. POST /api/push/open → enregistre l'ouverture (première ouverture
 *      ⇒ événement in-app « first_open » + welcome_pending).
 *   2. GET /api/push/key → clé publique VAPID (enabled:false → dégradation).
 *   3. Notification.requestPermission() — DOIT être déclenché par un geste
 *      utilisateur (clic) sinon le navigateur le rejette silencieusement.
 *   4. navigator.serviceWorker.register('/sw.js') + ready.
 *   5. pushManager.subscribe({userVisibleOnly, applicationServerKey}).
 *   6. POST /api/push/subscribe → le serveur envoie la bienvenue/confirmation.
 *
 * L'identité d'appareil (deviceId, localStorage) permet de tester les
 * notifications SANS compte ; à l'Étape 2, la liaison user_id s'ajoute.
 */
import type {
  PushConfigResponse,
  PushEventsResponse,
  PushOpenResponse,
  PushTestResponse,
} from '@wairyu/shared';

const DEVICE_KEY = 'wairyu_device_id';
const AUTO_SESSION_KEY = 'wairyu_push_auto_session';
const AUTO_TS_KEY = 'wairyu_push_auto_ts';
const AUTO_KIND_KEY = 'wairyu_push_auto_kind';

/** Événement fenêtre émis quand l'armement automatique aboutit (UI à rafraîchir). */
export const PUSH_ARMED_EVENT = 'wairyu-push-armed';

// ---------------------------------------------------------------------------
// Identité d'appareil
// ---------------------------------------------------------------------------

function randomId(): string {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  } catch {
    /* bénin */
  }
  return `dev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

export function getDeviceId(): string {
  try {
    let id = localStorage.getItem(DEVICE_KEY);
    if (!id) {
      id = randomId();
      localStorage.setItem(DEVICE_KEY, id);
    }
    return id;
  } catch {
    // localStorage indisponible (navigation privée extrême) — id volatil.
    return randomId();
  }
}

/** Simule une première ouverture : nouvel identifiant + rechargement. */
export function simulateFirstOpen(): void {
  try {
    localStorage.removeItem(DEVICE_KEY);
    sessionStorage.removeItem(AUTO_SESSION_KEY);
  } catch {
    /* bénin */
  }
  window.location.reload();
}

// ---------------------------------------------------------------------------
// Support navigateur
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Appels API (same-origin — le Worker sert le front et l'API)
// ---------------------------------------------------------------------------

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { 'content-type': 'application/json', ...(init?.headers ?? {}) },
  });
  if (!res.ok) throw new Error(`api ${path} → ${res.status}`);
  return (await res.json()) as T;
}

export async function fetchPushConfig(): Promise<PushConfigResponse | null> {
  try {
    return await api<PushConfigResponse>('/api/push/key');
  } catch {
    return null;
  }
}

/** Enregistre une ouverture (première ouverture ⇒ événement serveur). */
export async function registerDeviceOpen(): Promise<PushOpenResponse | null> {
  try {
    const isStandalone =
      window.matchMedia?.('(display-mode: standalone)').matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    const ua = navigator.userAgent;
    const platform = /Android/i.test(ua) ? 'android' : /iPhone|iPad|iPod/i.test(ua) ? 'ios' : 'web';
    return await api<PushOpenResponse>('/api/push/open', {
      method: 'POST',
      body: JSON.stringify({ deviceId: getDeviceId(), platform: isStandalone ? platform : platform }),
    });
  } catch {
    return null;
  }
}

export async function fetchEvents(): Promise<PushEventsResponse | null> {
  try {
    return await api<PushEventsResponse>(`/api/push/events?deviceId=${encodeURIComponent(getDeviceId())}`);
  } catch {
    return null;
  }
}

/** Journalise un événement côté client (ex. notification locale de repli). */
async function logLocalEvent(kind: string, title: string, body: string): Promise<void> {
  try {
    await api('/api/push/events', {
      method: 'POST',
      body: JSON.stringify({ deviceId: getDeviceId(), kind, title, body, channel: 'local' }),
    });
  } catch {
    /* bénin */
  }
}

// ---------------------------------------------------------------------------
// Activation (permission + abonnement + enregistrement serveur)
// ---------------------------------------------------------------------------

export type PushActivateResult =
  | 'granted' // abonné et enregistré côté serveur
  | 'denied' // permission refusée (ou bloquée site → réglages navigateur)
  | 'unsupported' // pas de ServiceWorker/PushManager/Notification
  | 'server-off' // serveur sans secrets VAPID (dégradation gracieuse)
  | 'error'; // échec réseau / subscribe

/** Active les notifications. À appeler DEPUIS UN CLIC. Idempotent. */
export async function activateWebPush(): Promise<PushActivateResult> {
  if (!pushSupported()) return 'unsupported';
  try {
    const cfg = await fetchPushConfig();
    if (!cfg?.enabled || !cfg.publicKey) return 'server-off';

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
      method: 'POST',
      body: JSON.stringify({
        deviceId: getDeviceId(),
        endpoint: j.endpoint,
        keys: { p256dh: j.keys?.p256dh, auth: j.keys?.auth },
      }),
    });
    return 'granted';
  } catch {
    return 'error';
  }
}

// ---------------------------------------------------------------------------
// Test de bout en bout — le serveur envoie un VRAI push (VAPID → FCM → SW →
// bulle OS). Ce n'est PAS une notification locale fabriquée dans la page.
// ---------------------------------------------------------------------------

export async function sendTestPush(): Promise<PushTestResponse | null> {
  try {
    return await api<PushTestResponse>('/api/push/test', {
      method: 'POST',
      body: JSON.stringify({ deviceId: getDeviceId() }),
    });
  } catch {
    return null;
  }
}

/** Repli : notification LOCALE via le Service Worker (si le push serveur échoue). */
export async function showLocalTestNotification(): Promise<boolean> {
  if (!pushSupported()) return false;
  try {
    const reg = await navigator.serviceWorker.ready;
    await reg.showNotification('WAIRYU — notification locale', {
      body: 'Canal local du Service Worker (repli) — le push serveur n\u2019a pas pu être délivré.',
      tag: 'wairyu-test-local',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      data: { url: '/' },
    });
    await logLocalEvent(
      'test',
      'WAIRYU — notification locale',
      'Repli local affiché par le Service Worker (push serveur indisponible).',
    );
    return true;
  } catch {
    return false;
  }
}

export async function unsubscribeWebPush(): Promise<boolean> {
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) await sub.unsubscribe();
    await api('/api/push/unsubscribe', {
      method: 'POST',
      body: JSON.stringify({ deviceId: getDeviceId() }),
    });
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Armement automatique (leçon v1 Task 62 — « les notifications se font
// automatiquement ») :
//  - permission 'granted' → (ré)abonnement silencieux SANS prompt ;
//  - permission 'default' → le PROCHAIN geste (tap) déclenche la demande —
//    un prompt demandé DANS un geste n'est jamais jeté par le navigateur ;
//  - permission 'denied' → silence total (retenter serait du spam) ;
//  - cooldown 24 h après un refus, 7 j si l'appareil bloque (overlay).
// ---------------------------------------------------------------------------

function markAuto(kind: 'denied' | 'blocked'): void {
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

export async function autoArmWebPush(): Promise<'subscribed' | 'armed' | 'skipped' | 'error'> {
  if (!pushSupported()) return 'skipped';
  const permission = Notification.permission;
  if (permission === 'denied') return 'skipped';
  try {
    if (sessionStorage.getItem(AUTO_SESSION_KEY) === '1') return 'skipped';
    sessionStorage.setItem(AUTO_SESSION_KEY, '1');
  } catch {
    /* bénin */
  }
  if (autoCooldownActive()) return 'skipped';

  // Cas 1 — déjà accordée : (ré)abonnement silencieux, aucun prompt.
  if (permission === 'granted') {
    try {
      const cfg = await fetchPushConfig();
      if (!cfg?.enabled || !cfg.publicKey) return 'error';
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
        method: 'POST',
        body: JSON.stringify({
          deviceId: getDeviceId(),
          endpoint: j?.endpoint,
          keys: { p256dh: j?.keys?.p256dh, auth: j?.keys?.auth },
        }),
      });
      window.dispatchEvent(new CustomEvent(PUSH_ARMED_EVENT));
      return 'subscribed';
    } catch {
      return 'error';
    }
  }

  // Cas 2 — 'default' : on attend le PROCHAIN geste (tap) pour demander.
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
        const cfg = await fetchPushConfig();
        if (!cfg?.enabled || !cfg.publicKey) return;
        if ((await Notification.requestPermission()) === 'granted') {
          await activateWebPush();
          try {
            localStorage.removeItem(AUTO_TS_KEY);
            localStorage.removeItem(AUTO_KIND_KEY);
          } catch {
            /* bénin */
          }
          window.dispatchEvent(new CustomEvent(PUSH_ARMED_EVENT));
        } else if (Notification.permission === 'default') {
          markAuto('blocked');
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

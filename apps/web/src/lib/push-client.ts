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

import type { PushConfigResponse } from '@wairyu/shared';
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

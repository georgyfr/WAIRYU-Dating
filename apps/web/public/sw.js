/**
 * Service Worker wairyu — notifications Web Push (porté du cœur v1, Étape 6.8).
 * Minimal volontairement : aucune interception de fetch (le cache immutable
 * est géré par les en-têtes Workers Assets).
 *
 * Anti-doublon (leçon v1 Task 53) :
 *  - page visible (premier plan) → PAS de notification système : le SW
 *    relait le payload à la page (postMessage « wairyu-push ») qui réagit
 *    (toast/badge) ;
 *  - page absente / en arrière-plan → notification système native, ouverte
 *    au bon endroit au clic ;
 *  - EXCEPTION payload.force === true (test / bienvenue) → la notification
 *    système est TOUJOURS affichée, même page visible : c'est le but — VOIR
 *    la bulle OS avec le nom de l'app, comme WhatsApp Web.
 */

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let data = {
    title: 'WAIRYU',
    body: 'Nouvelle activité.',
    tag: 'wairyu',
    url: '/',
    force: false,
  };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch {
    /* payload non JSON — valeurs par défaut */
  }
  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      const visible = windows.filter((cl) => cl.visibilityState === 'visible');
      // postMessage TOUJOURS envoyé (même en arrière-plan) : badge réactif au retour.
      for (const cl of windows) {
        cl.postMessage({ type: 'wairyu-push', data });
      }
      if (visible.length > 0 && !data.force) return;
      await self.registration.showNotification(data.title, {
        body: data.body,
        tag: data.tag,
        renotify: true,
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        data: { url: data.url },
      });
    })(),
  );
});

/**
 * Tap de notification : privilégie la fenêtre INSTALLÉE (standalone — WebAPK /
 * TWA / PWA écran d'accueil), puis toute fenêtre existante (focus), sinon
 * ouvre une nouvelle fenêtre. Le navigate() same-document étant peu fiable,
 * on focus + postMessage ; la page réagit à « wairyu-navigate ».
 */
async function handleNotificationTap(url) {
  const list = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  const inOrigin = list.filter((cl) => cl.url.includes(self.location.origin));
  const ordered = [
    ...inOrigin.filter((cl) => cl.frameType === 'standalone'),
    ...inOrigin.filter((cl) => cl.frameType !== 'standalone'),
  ];
  for (const client of ordered) {
    client.focus();
    client.postMessage({ type: 'wairyu-navigate', url });
    return;
  }
  return self.clients.openWindow('/' + String(url || '').replace(/^\//, ''));
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(handleNotificationTap(url));
});

/**
 * Simulateur de tap (utilisé par les vérifications E2E headless, où aucun tap
 * OS n'est possible) — exécute la même logique que notificationclick.
 */
self.addEventListener('message', (event) => {
  const d = event.data || {};
  if (d && d.type === 'wairyu-simulate-click' && typeof d.url === 'string') {
    event.waitUntil(handleNotificationTap(d.url));
  }
});

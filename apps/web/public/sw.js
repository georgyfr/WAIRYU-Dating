/**
 * Service Worker wairyu — notifications Web Push (Étape 6.8, enrichi Task 53).
 * Minimal volontairement : aucune interception de fetch (le cache immutable
 * est géré par les en-têtes Workers Assets — voir Étape perf).
 *
 * Task 53 (demande fondateur : « comme WhatsApp ») — anti-doublon :
 *  - page visible (premier plan) → PAS de notification système : le SW
 *    relait le payload à la page (postMessage « wairyu-push ») qui
 *    rafraîchit immédiatement conversations → toast in-app bas-droite
 *    (composant MessageToasts) + badge à jour en ~1 s ;
 *  - page absente / en arrière-plan → notification système native
 *    (comme un SMS), ouverte au bon endroit au clic.
 *
 * Task 54 (simulation) — EXCEPTION explicite : payload.force === true
 * (pousses de test / simulation du bouton « Tester ») → la notification
 * système est TOUJOURS affichée, même page visible : c'est le but — VOIR
 * la bulle OS avec le nom de l'app, comme WhatsApp Web. Les pushes métier
 * ne mettent JAMAIS force (anti-doublon ci-dessus inchangé).
 */

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let data = {
    title: 'Wairyu',
    body: 'Nouvelle activité.',
    tag: 'wairyu',
    url: '#/matches',
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
      // Page au premier plan : la notif système serait un doublon agaçant —
      // on relaye et la page s'occupe du toast + badge (postMessage TOUJOURS
      // envoyé, même en arrière-plan, pour un badge réactif au retour).
      // EXCEPTION Task 54 : force === true (simulation/test) → on affiche
      // quand même la bulle système — c'est exactement ce qu'on démontre.
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

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '#/matches';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      // Task 75 (fondateur : « masque l'url dans l'app — l'impression qu'on
      // est dans un navigateur ») : quand l'application INSTALLÉE (WebAPK /
      // TWA, fenêtre « standalone » — sans barre d'adresse) est ouverte, un
      // tap de notification doit y atterrir ELLE-MÊME, pas dans un onglet
      // navigateur qui traîne (sa barre d'adresse réapparaîtrait). Comportement
      // d'origine conservé : première fenêtre wairyu trouvée = navigate + focus,
      // sinon openWindow — seule l'ORDRE DE PRIORITÉ change (standalone d'abord).
      const inOrigin = list.filter((cl) => cl.url.includes(self.location.origin));
      const ordered = [
        ...inOrigin.filter((cl) => cl.frameType === 'standalone'),
        ...inOrigin.filter((cl) => cl.frameType !== 'standalone'),
      ];
      for (const client of ordered) {
        client.navigate(url).catch(() => client.focus());
        return client.focus();
      }
      return self.clients.openWindow('/' + url);
    }),
  );
});

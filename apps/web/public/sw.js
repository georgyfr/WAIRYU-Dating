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

/**
 * Task 77 (demande fondateur : « lorsque l'application est installée avec
 * succès, une notification apparaît pour féliciter la personne… il suffit
 * que la personne clique sur la notification, ça ouvre l'application ») —
 * la page (InstallGate / /go / /app) capte 'appinstalled' et RELAIE ici :
 * seules les notifications affichées PAR le service worker sont tapables
 * (notificationclick ci-dessous) et leur tap privilégie la fenêtre
 * standalone (Task 75) puis openWindow — qui, sur Android, ouvre la WebAPK
 * fraîchement installée. Permission Notification déjà accordée exigée côté
 * page (jamais de demande forcée) ; sinon les cartes in-page prennent le relais.
 */
self.addEventListener('message', (event) => {
  const d = event.data || {};
  if (d && d.type === 'wairyu-installed-congrats') {
    self.registration.showNotification('🎉 wairyu est installée !', {
      body: d.body || 'Félicitations ! Touche ce message pour ouvrir ton application.',
      tag: 'wairyu-installed',
      renotify: false,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      data: { url: d.url || '#/discover' },
    });
  }
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
        // Task 78 (fondateur : « la notification push arrive, mais elle ne
        // remplit pas automatiquement le code ») — Client.navigate() ne sait
        // PAS naviguer same-document (URL fragment seule, cas
        // #/verify?e=…&d=…) : la navigation échoue en silence et le tap ne
        // fait que remettre l'app au premier plan, champ code vide. On
        // DEMANDE donc AUSSI à la page de changer son propre hash via
        // postMessage — une page, elle, change son hash de façon fiable
        // (relais traité dans App.tsx → l'écran code reçoit ?d= et se
        // remplit + se soumet tout seul). navigate() reste tenté : il gère
        // les cas où il fonctionne, le postMessage couvre les autres.
        client.postMessage({ type: 'wairyu-navigate', url });
        client.navigate(url).catch(() => client.focus());
        return client.focus();
      }
      return self.clients.openWindow('/' + url);
    }),
  );
});

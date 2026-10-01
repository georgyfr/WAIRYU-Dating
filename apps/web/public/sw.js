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

/**
 * Task 79 — la logique de TAP (utilisée par notificationclick ET par le
 * simulateur E2E ci-dessous). Extraite en fonction pour un seul code : le
 * constructeur `new Notification()` est interdit dans un Service Worker
 * (« Illegal constructor ») — impossible de re-déclencher l'événement, on
 * exécute donc DIRECTEMENT la même logique.
 */
async function handleNotificationTap(url) {
  const list = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
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
    // Task 79 (fondateur : « echec » après le fix t78 — cause : le
    // téléphone peut garder en mémoire un BUNDLE et un SW d'avant t78 :
    // reprendre une WebAPK Android ne recharge NI la page NI le SW) :
    //  1. l'envoi postMessage porte un MessageChannel — une page À JOUR
    //     accuse réception (App.tsx répond sur le port) ;
    //  2. si AUCUN accusé n'arrive (vieux bundle en mémoire, qui n'a
    //     aucun des relais t78), navigation de secours CROSS-DOCUMENT :
    //     une URL avec une query différente (?wv=…) ne peut JAMAIS être
    //     same-document → la page se RECHARGE entièrement dans la fenêtre
    //     existante (dernier bundle servi, standalone préservé) sur le
    //     MÊME hash cible → l'écran code se monte avec ?d= et se soumet
    //     tout seul. Le tap répare donc TOUT SEUL une app périmée.
    client.focus();
    const ackChannel = new MessageChannel();
    let acked = false;
    ackChannel.port1.onmessage = () => {
      acked = true;
    };
    client.postMessage({ type: 'wairyu-navigate', url }, [ackChannel.port2]);
    // Task 79 : le navigate(url) du fix t78 est RETIRÉ ici — avec une URL
    // fragment seule il ne peut pas naviguer same-document, et l’API le
    // résout comme URL ABSOLUE relative au script → charge le FICHIER /sw.js
    // (navigation cross-document destructrice, observée en E2E : l’app est
    // remplacée par le JS brut). Le trio relais postMessage + accusé +
    // fallback ?wv ci-dessous couvre tous les cas sans ce danger.
    await new Promise((r) => setTimeout(r, 700));
    if (acked) return;
    const fallback = new URL('/' + url, self.location.origin);
    // Task 79 : la query du document d’origine est PRÉSERVÉE (noappopen des
    // smokes/débug ; en prod la search est vide — comportement inchangé).
    try {
      const prev = new URL(client.url);
      for (const [k, v] of prev.searchParams) fallback.searchParams.set(k, v);
    } catch {
      /* bénin — wv est ajouté ci-dessous de toute façon */
    }
    fallback.searchParams.set('wv', String(Date.now()));
    await client.navigate(fallback.href).catch(() => client.focus());
    return;
  }
  return self.clients.openWindow('/' + url);
}

/**
 * Task 79 — simulateur de tap de notification (utilisé par les E2E pour
 * exécuter le circuit de tap RÉEL en headless, où aucun tap OS n'est
 * possible). La page ne peut demander que pour ELLE-MÊME : le SW exécute
 * la même logique que notificationclick avec l'URL fournie — exactement
 * le même pouvoir que la page qui changerait son propre hash. Aucune
 * donnée supplémentaire, aucune surface d'attaque nouvelle (même origine).
 */
self.addEventListener('message', (event) => {
  const d = event.data || {};
  if (d && d.type === 'wairyu-simulate-click' && typeof d.url === 'string') {
    event.waitUntil(handleNotificationTap(d.url));
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '#/matches';
  event.waitUntil(handleNotificationTap(url));
});

# Architecture des notifications — WAIRYU

Document de référence des 4 canaux de notification du produit, de leur compatibilité et de leurs règles communes. À mettre à jour à chaque évolution d'un canal.

- Environnements : prod `https://wairyu.wairyu.workers.dev`, staging `https://wairyu-staging.wairyu.workers.dev`
- Mise en œuvre push : Worker Cloudflare, zéro dépendance (Web Push VAPID RFC 8291/8292)
- Canaux 1 et 2 opérationnels ; canaux 3 et 4 prévus (non câblés)

---

## 1. Vue d'ensemble des 4 canaux

| # | Canal | Technologie | Cibles | État |
| --- | --- | --- | --- | --- |
| 1 | Push système | Web Push VAPID (RFC 8291/8292) | PWA web + TWA Android (via Chrome) | Opérationnel |
| 2 | Notifications in-app | Polling `GET /api/push/events` | TOUS les navigateurs, y compris Chrome 50+ et Safari 10 | Opérationnel |
| 3 | Push natif iOS | APNs via `@capacitor/push-notifications` | App iOS Capacitor (future) | Prévu, non câblé |
| 4 | Email transactionnel | Brevo | Événements critiques, appareils sans push | Prévu (Étape 2 auth OTP) |

Règle de choix : le canal 1 est le canal de confort (temps réel), le canal 2 est le canal universel (il fonctionne partout où `fetch` existe — c'est LE canal des appareils 2016/2017), le canal 3 concerne uniquement l'app native iOS, le canal 4 couvre les événements critiques (sécurité du compte, modération, suppression de compte) et les appareils sans aucun push.

## 2. Canal 1 — Web Push VAPID

Implémentation maison dans le Worker : chiffrement RFC 8291 (aes128gcm) et signature RFC 8292 (VAPID), sans aucune bibliothèque externe. Clés VAPID en secrets wrangler (`VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`).

### Cibles servies

- PWA web sur navigateurs compatibles (Chrome/Edge/Firefox desktop et Android ; Safari iOS 16.4+ uniquement en web app installée sur l'écran d'accueil).
- TWA Android (`com.wairyu.app`) : la WebView TWA délègue les notifications à Chrome installé sur l'appareil. Un abonnement Web Push pris depuis la TWA est un abonnement Chrome standard — aucun code Android natif nécessaire.

### Anti-doublon (page visible)

À la réception d'un push dans le service worker :

1. Si une fenêtre de l'app est VISIBLE (clients.focus) : le service worker ne crée PAS de notification système, il fait `postMessage` au client, qui affiche un toast in-app (style WhatsApp).
2. Si l'app est en arrière-plan ou fermée : le service worker affiche la notification système (`showNotification`).
3. Au tap de la notification (`notificationclick`) : focus de la fenêtre existante ou ouverture de l'URL du payload ; si l'app ouverte est périmée, le tap déclenche une mise à jour du client (réparation app).

### Drapeau force (test)

`POST /api/push/test` accepte `force: true` : la notification système est affichée MÊME si la page est visible, pour tester le rendu du service worker et du canal 1 sans débrancher l'anti-doublon.

## 3. Canal 2 — Notifications in-app (polling)

Centre de notifications consulté par `GET /api/push/events` en polling. Fonctionne sur TOUS les navigateurs capables de `fetch`, y compris Chrome 50+ et Safari 10 : c'est LE canal des appareils 2016/2017 (voir `docs/compatibilite-anciens-appareils.md`).

- Cadence de référence : 30 s (paramétrable côté client ; majorer en arrière-plan).
- Ne dépend ni du service worker, ni des permissions, ni du chiffrement Web Push.
- Restitue les mêmes événements que le push système (nouveaux likes, matchs, messages) pour que l'expérience soit homogène quand le canal 1 est indisponible (iOS < 16.4 notamment).

## 4. Canal 3 — APNs (app native iOS Capacitor)

Pour la future app iOS (voir `apps/ios/README.md`) :

- `@capacitor/push-notifications` demande la permission et renvoie un token APNs.
- Le token est envoyé au backend, stocké avec l'appareil.
- Un adaptateur d'envoi APNs (JWT ES256, clé `.p8`) est PRÉVU mais PAS ENCORE CÂBLÉ : jusqu'ici, seul le Web Push VAPID est implémenté côté Worker.
- Le Web Push VAPID n'atteint PAS l'app native iOS : la WebView Capacitor n'expose pas les abonnements push navigateur. Les deux canaux coexisteront côté backend, ciblés par type d'appareil.

## 5. Canal 4 — Email transactionnel (Brevo)

- Prévu à l'Étape 2 (auth OTP) : la même intégration Brevo servira d'abord les codes OTP, puis les événements critiques.
- Événements critiques visés : sécurité du compte (nouvelle session, réinitialisation), modération (sanction, signalement), suppression de compte, et repli de notification pour les appareils sans push.
- Secrets : `BREVO_API_KEY`, `EMAIL_FROM` (hors dépôt).

## 6. Flux première ouverture

But : garantir un premier push de bienvenue sans envoyer de notification avant consentement.

1. Première ouverture de l'app (ou premier passage sur l'écran d'armement) : `POST /api/push/open` enregistre l'appareil dans la table `devices`.
2. L'appareil est marqué `welcome_pending` : rien n'est envoyé à ce stade.
3. Au PREMIER abonnement push effectif (utilisateur a consenti, `PushSubscription` reçue et stockée), le Worker envoie le push de bienvenue et efface le marqueur `welcome_pending`.
4. Si l'utilisateur ne consent jamais, aucune notification n'est envoyée — conformité plateformes (pas de notification sans permission) et produit (pas de spam).

## 7. Flux de test

`POST /api/push/test` avec `force: true` envoie immédiatement une notification de test via le canal 1 en contournant l'anti-doublon (notification système forcée même si la page est visible). Usage : vérifier le rendu du service worker, la description/les icônes, le tap de réparation d'app périmée.

## 8. Nettoyage des abonnements : 410 uniquement

Règle d'or héritée de la v1 (leçon consolidée) :

- Un `410 Gone` de l'endpoint de push signifie que l'abonnement est PERMANÉMENT invalide : on supprime alors la ligne de la table des abonnements.
- Un `404` (ou toute autre erreur transitoire : 429, 5xx, réseau) ne supprime PAS l'abonnement : un 404 peut être TRANSITOIRE et un nettoyage trop zélé détruirait des abonnements valides. On réessaie plus tard.
- Toute logique future (cron de purge) doit conserver ce comportement 410-only.

## 9. Compatibilité navigateurs

| Environnement | Service Worker | Web Push (canal 1) | Polling in-app (canal 2) | Canal recommandé |
| --- | --- | --- | --- | --- |
| Chrome/Edge Android 42+ | Oui (SW dès 42) | Oui | Oui | 1 + 2 |
| TWA Android (Chrome 72+) | Via Chrome | Oui | Oui | 1 + 2 |
| TWA Android (Chrome 42-71, repli Custom Tabs) | Via Chrome | Oui (push) | Oui | 1 + 2 |
| Chrome/Firefox/Edge desktop récents | Oui | Oui | Oui | 1 + 2 |
| Safari iOS < 16.4 (site web) | SW depuis Safari 11.1 | NON — pas de web push avant 16.4 | Oui | 2 (+ 4) |
| Safari iOS 16.4+ (web app installée) | Oui | Oui (PWA installée uniquement) | Oui | 1 + 2 |
| Safari macOS 16.4+ | Oui | Oui | Oui | 1 + 2 |
| Vieux Chrome (42-50) | Oui | Oui | Oui (fetch requis) | 1 + 2 |
| App iOS Capacitor (future) | n/a (WebView) | NON (VAPID n'atteint pas la native) | Oui | 3 + 2 |

Contraintes vieilles versions : le service worker existe depuis Chrome 42, `fetch` est requis pour le polling (présent dès Chrome 42 et Safari 10.1+). Aucune API postérieure à ES2015 ne doit être employée sans garde dans le client de notifications.

## 10. Rate limits (KV)

Limites appliquées par le Worker via KV (compteurs par appareil/IP) :

| Endpoint | Limite |
| --- | --- |
| `POST /api/push/test` | 6 requêtes/minute |
| `POST /api/push/open` | 60 requêtes/minute |

Au-delà : réponse `429`. Ces limites protègent le budget gratuit Cloudflare et évitent l'abus des flux non authentifiés.

## 11. Périmètre device-based (attente Étape 2)

Les endpoints de notification sont aujourd'hui DEVICE-BASED : un appareil est identifié par un identifiant local (pas par un compte). Conséquences :

- Les flux `/api/push/open`, `/api/push/test` et le centre `/api/push/events` fonctionnent sans authentification (d'où les rate limits ci-dessus).
- À l'Étape 2 (authentification OTP/OAuth), les appareils seront LIÉS à `user_id` : ciblage par utilisateur (likes, matchs, messages réels), fusion multi-appareils, purge RGPD du device à la suppression de compte.
- Ce document sera mis à jour à ce moment (ciblage, rétention, permissions).

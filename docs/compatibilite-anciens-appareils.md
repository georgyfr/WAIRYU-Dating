# Compatibilité anciens appareils (2016/2017) — stratégie WAIRYU

Matrice et stratégie pour les appareils 2016/2017, nombreux dans l'audience africaine visée : Android 6/7 d'un côté, iPhone 5s/6/7 sous iOS 10/11 de l'autre. Ces appareils ne sont pas une erreur à corriger mais un segment à servir explicitement.

Produit : PWA React+Vite servie par le Worker Hono en HTTPS. Apps embarquées : TWA Android (`com.wairyu.app`, minSdk 21) et future app iOS Capacitor (iOS 13+).

---

## 1. Matrice de compatibilité

| Appareil (2016/2017) | OS | App native possible ? | PWA installable ? | Service Worker | Web Push | Notifications in-app (polling) | Email |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Android 6/7 (Galaxy A/J, Tecno, Infinix…) | Android 5.0-7.x | Oui : APK TWA (minSdk 21) | Oui | Oui (via Chrome 42+) | Oui (via Chrome 42+) | Oui | Oui |
| iPhone 5s/6/6s/7 | iOS 10-11 | NON (Capacitor exige iOS 13+) | Oui (Ajouter à l'écran d'accueil) | Safari 11.1+ | NON (pas avant iOS 16.4) | Oui | Oui |

## 2. Android 5.0-7.x (2014-2017)

- Installation : l'APK/bundle TWA s'installe correctement car `minSdkVersion 21` (Android 5.0). Aucun code natif, donc aucune contrainte ABI/mémoire supplémentaire.
- TWA complet : nécessite Chrome 72+ (support Trusted Web Activity avec vérification Digital Asset Links). Sans Chrome récent :
  - Repli : Custom Tabs plein écran (l'app s'ouvre dans le navigateur par défaut, avec barre d'URL ou sans selon le navigateur) — l'app reste utilisable, l'expérience est légèrement dégradée.
  - Vérifier sur appareil réel Android 6 le comportement de repli de Bubblewrap (fallback Custom Tabs).
- Web Push : OK dès Chrome 42+ (2015) — donc le parc 2016/2017 avec Chrome à jour le supporte. Service Worker OK dès Chrome 42.
- L'anti-doublon toast/notification et le tap de réparation d'app périmée fonctionnent identiquement (voir `docs/notifications-architecture.md`).

## 3. iPhone 5s/6/7 sous iOS 10-11 (2016/2017)

- PAS d'app native possible : Capacitor 6 exige iOS 13+. Ces iPhone restent à jamais sous iOS 10-11 (plus de mises à jour Apple). Aucune investment côté `apps/ios/` ne les concerne.
- Servis par la PWA web :
  - Service Worker : disponible depuis Safari 11.1 (iOS 11.3). Sous iOS 10 : pas de SW, l'app fonctionne sans mode hors-ligne ni cache SW.
  - Web Push : N'EXISTE PAS avant iOS 16.4 (et même là : uniquement en web app installée sur l'écran d'accueil). Donc zéro push système pour tout ce parc.
  - Canal de substitution : notifications IN-APP par polling du centre `/api/push/events` (fonctionne sur Safari 10+, ne dépend ni du SW ni des permissions) + email transactionnel Brevo pour les événements critiques.
  - Conséquence produit : sur ces appareils, la page doit rester ouverte ou l'utilisateur doit compter sur l'email — mettre l'entrée « centre de notifications » bien en évidence dans l'UI.

## 4. Recommandations build web

Le client doit tourner sur Chrome 42-50 et Safari 10. Règles de construction :

- [ ] Cible Vite `es2015` (déjà configuré) : transpilation jusqu'aux navigateurs ES2015, pas d'ES2017+ brut dans le bundle.
- [ ] Pas d'API récente sans garde : toute API moderne (`IntersectionObserver`, `MediaRecorder`, `navigator.share`, `crypto.subtle`, `Notification`…) derrière une détection de capacité (`if ('x' in window)`) avec repli fonctionnel, jamais une erreur bloquante.
- [ ] Éviter en CSS : `:has()` (Chrome 105+, Safari 15.4+), `subgrid` (Chrome 117+, Safari 16+) — le layout doit tenir en flexbox/grid basique. Linter visuel sur un vieux Chrome/ Safari si possible.
- [ ] Images WebP avec fallback : servir WebP (recadrage 4:5) mais toujours avec une alternative JPEG/PNG (attribut `srcset`/`<picture>` ou négociation Accept) — WebP n'est pas décodé par Safari < 14.
- [ ] Polling du centre in-app à 30 s (cadence de référence, majorée en arrière-plan) — `docs/notifications-architecture.md`.
- [ ] Budget de performance : la PWA doit charger MOINS de 300 KB de JavaScript gzippé sur 3G. Surveiller à chaque build (`vite build` + analyse du bundle) ; tout ajout de dépendance se justifie par rapport à ce budget.

## 5. Invariants produit

- Les 4 modes restent inchangés et disponibles sur tous les appareils, y compris 2016/2017 : Classique, Invisible, Interracial, Événementiel (Moments). Aucune dégradation fonctionnelle par mode : seuls les canaux de notification et la fluidité varient.
- Le parcours de l'utilisateur sur appareil ancien = même application, même palette, même logique ; seulement moins de push système et des animations plus sobres.
- Chaque nouveauté technique (nouveau SDK, nouvelle API web, nouveau format d'image) passe le filtre : « fonctionne-t-elle sur Chrome 50 et Safari 10, ou avons-nous un repli ? »

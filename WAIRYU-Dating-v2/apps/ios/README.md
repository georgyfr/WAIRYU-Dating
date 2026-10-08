# WAIRYU — Guide de build iOS (Capacitor)

Ce dossier contient la préparation de l'application iOS native de WAIRYU Dating, bâtie avec Capacitor autour du build PWA existant. La PWA web reste le produit de référence ; l'app iOS l'embarque et lui ajoute les notifications push natives (APNs).

- Identifiant : `com.wairyu.app` (identique à la TWA Android)
- Nom affiché : `WAIRYU`
- iOS minimum : 13.0 (Capacitor 6)
- Configuration : `capacitor.config.ts` (ce dossier)
- Conformité Apple : `PrivacyInfo.xcprivacy` (ce dossier) + `docs/app-store-conformite.md`

---

## 1. Prérequis

| Outil | Version | Remarque |
| --- | --- | --- |
| macOS | récent | Obligatoire : Xcode n'existe que sur macOS |
| Xcode | 15 ou plus | Capacitor 6 cible iOS 13+ |
| CocoaPods | dernière stable | `sudo gem install cocoapods` (gestion des dépendances natives iOS) |
| Node.js | 20 ou plus | Même moteur que le monorepo |
| Compte Apple Developer | 99 USD/an | Requis pour la signature et App Store Connect |

Le projet Xcode natif (`ios/App`) est généré par Capacitor sur macOS. Il ne peut pas être produit sous Linux : ce dépôt ne contient que les fichiers de configuration et la documentation.

## 2. Installation et génération du projet natif

Sur macOS, à la racine du dépôt :

```bash
npm i @capacitor/core @capacitor/cli @capacitor/ios @capacitor/push-notifications
npx cap add ios
```

`npx cap add ios` crée le projet Xcode (`ios/App`), lit `capacitor.config.ts` et installe les pods. Ne pas committer d'artefat de build local sans décision d'équipe : le projet natif généré peut être commité (recommandé pour figer les réglages Xcode) mais jamais le dossier `www/`.

## 3. Build PWA et synchronisation

`webDir` pointe vers `www/` : ce répertoire doit contenir le build statique de la PWA AVANT toute synchronisation, sinon l'app embarquée est vide.

```bash
# 1. Construire la PWA
cd apps/web && npm run build && cd ../..

# 2. Copier le build dans www/
rm -rf apps/ios/www
mkdir -p apps/ios/www
cp -r apps/web/dist/* apps/ios/www/

# 3. Synchroniser vers le projet natif
npx cap sync ios
```

`npx cap sync ios` copie `www/` dans le bundle iOS et met à jour les plugins natifs. À refaire à chaque mise à jour de la PWA.

En développement, `npx cap run ios` lance l'app sur simulateur ou appareil. Le mode `live reload` (server.url pointé vers un serveur de dev) est interdit en production : `server.cleartext` est à `false` dans la config et l'ATS Apple n'accepte que le HTTPS.

## 4. Signature, archive et App Store Connect

1. Ouvrir le projet : `npx cap open ios`.
2. Dans Xcode, cible `App` : sélectionner l'équipe de signature (onglet Signing & Capabilities), vérifier le Bundle Identifier `com.wairyu.app` et cocher « Automatically manage signing ».
3. Ajouter la capability « Push Notifications » (générée par le plugin, à vérifier).
4. `Product > Archive` (destination « Any iOS Device (arm64) »).
5. Depuis l'Organizer : « Distribute App > App Store Connect > Upload ».
6. Dans App Store Connect : créer l'app, remplir les métadonnées, les labels de confidentialité (alignés sur `PrivacyInfo.xcprivacy`) et soumettre en review.

La review exige des comptes de test : fournir au moins un profil de démonstration complet dans App Store Connect (voir `docs/app-store-conformite.md`).

## 5. Notifications iOS : APNs, pas Web Push VAPID

Point d'architecture essentiel, à ne pas confondre avec le reste du produit :

- Le Web Push VAPID (RFC 8291/8292) implémenté dans le Worker ne dessert QUE la PWA web et la TWA Android (via Chrome). Il n'atteint PAS l'app native iOS : `pushSubscription` d'un navigateur n'existe pas dans une WebView Capacitor.
- `@capacitor/push-notifications` passe par APNs (Apple Push Notifications service). Le flux est : demande de permission à l'utilisateur, token APNs renvoyé par le plugin, envoi du token au backend, envoi des notifications par le backend vers APNs.
- Adaptateur backend prévu mais PAS ENCORE CÂBLÉ : l'API de notifications enverra aux tokens APNs en parallèle des abonnements Web Push (voir `docs/notifications-architecture.md`, canal 3).

Côté configuration APNs :

1. Apple Developer Console > Certificates, Identifiers & Profiles > Keys : créer une clé « Apple Push Notifications service (APNs) » au format `.p8` (une seule clé par compte, à conserver précieusement).
2. Noter le `Key ID` et le `Team ID`.
3. Stocker la clé `.p8` hors dépôt (secret backend, comme les autres clés — leçon v1 : aucun secret dans le dépôt).
4. L'adaptateur backend signera les requêtes APNs (JWT ES256) avec cette clé.

Note complémentaire : le Web Push dans Safari/iOS n'existe qu'à partir d'iOS 16.4, et uniquement pour une PWA installée sur l'écran d'accueil. Cela concerne les utilisateurs du site web sur iPhone récents, pas l'app native Capacitor.

## 6. Minimum iOS 13 et stratégie iOS 10-12

- Capacitor 6 impose iOS 13 minimum (`ios.minimumVersion: '13.0'` dans la config).
- Les iPhone 5s/6/7 bloqués sur iOS 10-11 (parc 2016/2017, notamment en Afrique) ne peuvent PAS installer l'app native. Ils sont servis par la PWA web : notifications in-app par polling + email transactionnel.
- Stratégie détaillée et budget de performance : `docs/compatibilite-anciens-appareils.md`.

## 7. ATT : non applicable

App Tracking Transparency (ATT) n'est PAS requise : WAIRYU ne fait aucun tracking publicitaire, n'utilise aucun SDK publicitaire ni l'IDFA. C'est cohérent avec `PrivacyInfo.xcprivacy` (`NSPrivacyTracking` à `false`, aucun domaine de tracking). Si un SDK de mesure tiers était un jour ajouté, cette décision devrait être revue.

## 8. Checklist App Store (résumé)

La checklist complète et argumentée est dans `docs/app-store-conformite.md`. Résumé :

- Guideline 4.8 : Sign in with Apple obligatoire dès que Google/Facebook OAuth existent (prévu Étape 2 — prévoir le bouton).
- Guideline 5.1.1(v) : suppression de compte in-app obligatoire.
- Guideline 1.2 (UGC, apps de rencontre) : blocage, signalement, modération, filtrage, contact modération.
- Labels de confidentialité alignés sur `PrivacyInfo.xcprivacy`.
- Permission notifications : demande contextuelle, jamais au lancement.
- ATS par défaut : HTTPS uniquement (notre Worker est déjà en HTTPS).
- Comptes de test fournis à la review.

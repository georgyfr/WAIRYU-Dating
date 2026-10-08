# Conformité Apple App Store — WAIRYU iOS

Checklist opérationnelle pour la future app iOS Capacitor (`com.wairyu.app`), à jour des exigences App Store. Cocher chaque ligne avant soumission ; documenter les preuves dans le journal d'étape.

Contexte : PWA React+Vite servie par le Worker Hono en HTTPS ; app iOS Capacitor 6 (iOS 13 minimum) embarquant le build PWA. Fichiers du dossier `apps/ios/` : `capacitor.config.ts`, `PrivacyInfo.xcprivacy`, `README.md` (guide de build).

---

## 1. Guideline 4.8 — Sign in with Apple

- [ ] SI l'app propose Google ou Facebook OAuth (prévu Étape 2), ALORS « Sign in with Apple » est OBLIGATOIRE, avec une visibilité équivalente aux autres boutons (pas caché en bas).
- [ ] Prévoir le bouton dès la conception de l'Étape 2 (design des écrans d'auth avec les 3 boutons : Apple, Google, Facebook + email OTP).
- [ ] Sign in with Apple = token identity vérifié côté Worker ; compte lié, suppression identique aux autres comptes.
- Point de vigilance review : Apple rejette systématiquement toute app avec OAuth tiers sans le bouton Apple. Ne pas soumettre une build avec Google/Facebook login sans lui.

## 2. Guideline 5.1.1(v) — Suppression de compte in-app

- [ ] Suppression de compte accessible DEPUIS l'app (pas seulement une URL web), dans les réglages de profil.
- [ ] Flux : confirmation explicite, mot de passe/OTP de confirmation, purge des données (photos, messages, profil, abonnements push) dans les délais annoncés.
- [ ] Cohérence avec la suppression côté web (même endpoint Worker) et avec la déclaration Data Safety/labels.
- [ ] Note : pour les abonnements payants futurs, la gestion/cancel doit être faisable in-app (IAP) — hors périmètre aujourd'hui (monétisation câblée éteinte).

## 3. Guideline 1.2 — UGC et apps de rencontre

Les apps de rencontre sont en première ligne des exigences UGC d'Apple. Toutes ces capacités doivent exister IN-APP et être démontrables à la review :

- [ ] Créer un mécanisme de BLOCAGE d'un autre utilisateur (bloqué = plus de contact, plus de visibilité).
- [ ] Signalement in-app d'un profil, d'un message, d'une photo.
- [ ] MODÉRATION effective : file de traitement des signalements, filtrage des contenus offensants, sanctions (avertissement, suspension, bannissement).
- [ ] FILTRAGE : contenu photo contrôlé (photos consenties, contrôle côté Worker), filtres de contenus textuels là où pertinent.
- [ ] Coordonnées publiées pour contacter la modération (email support/abuse).
- [ ] Conditions d'utilisation (EULA) et politique de confidentialité accessibles in-app.
- [ ] Préparer pour la review : description de la chaîne modération + comptes de test démontrant blocage et signalement.

## 4. Labels de confidentialité (privacy nutrition labels)

Alignés strictement sur `PrivacyInfo.xcprivacy` (même dossier) — toute divergence = rejet ou correction :

| Donnée | Liée à l'identité | Suivi (tracking) | Usage déclaré |
| --- | --- | --- | --- |
| Adresse email | Oui | Non | Fonctionnalité de l'app |
| Photos et vidéos | Oui | Non | Fonctionnalité de l'app (contenu utilisateur) |
| Autre contenu utilisateur (messages) | Oui | Non | Fonctionnalité de l'app |
| Localisation approximative | Non | Non | Fonctionnalité de l'app |

- [ ] Déclarer « Données non utilisées pour le suivi », « Aucune donnée collectée par des tiers à des fins publicitaires » — vrai pour WAIRYU (zéro SDK pub, zéro tracker).
- [ ] Ne déclarer RIEN qui ne soit pas réel (sur-déclaration = questions de review ; sous-déclaration = rejet).

## 5. Permission notifications

- [ ] Demande contextuelle : la permission système n'est demandée qu'au moment pertinent (ex. première valeur ajoutée des notifications), jamais au lancement à froid.
- [ ] Aucune clé Info.plist d'usage n'est requise pour les notifications utilisateur (à la différence de la caméra, du micro, de la géolocalisation). Avec Xcode 16 et la nouvelle API de notifications, la clé `NSUserNotificationsUsageDescription` peut être demandée si utilisée — la prévoir le cas échéant.
- [ ] Refus de permission = l'app reste pleinement utilisable (canal in-app + email en repli, voir `docs/notifications-architecture.md`).
- [ ] Côté build : capability « Push Notifications » + clé APNs `.p8` côté backend (adaptateur prévu, non câblé — voir `apps/ios/README.md`).

## 6. ATS (App Transport Security)

- [ ] ATS est actif par défaut dans Capacitor : HTTPS uniquement, TLS 1.2+, pas d'exception de domaine.
- [ ] Notre Worker est en HTTPS (`https://wairyu.wairyu.workers.dev`) — aucune exception à déclarer dans Info.plist.
- [ ] `server.cleartext` est à `false` dans `capacitor.config.ts` : aucune régression à ne pas introduire (pas de `NSAllowsArbitraryLoads`).

## 7. Minimum iOS et stratégie iOS 10-12

- [ ] Minimum iOS 13.0 (Capacitor 6), fixé dans `capacitor.config.ts` (`ios.minimumVersion`).
- [ ] iOS 10-12 (iPhone 5s/6/7, parc 2016/2017) : PAS d'app native — servis par la PWA web avec notifications in-app + email. Stratégie complète : `docs/compatibilite-anciens-appareils.md`.
- [ ] Ne pas baisser `minimumVersion` sous 13.0 pour « élargir » : Capacitor 6 ne le supporte pas et les appareils visés sont déjà couverts par le web.

## 8. ATT (App Tracking Transparency)

- [ ] ATT NON requise : aucun tracking publicitaire, aucun IDFA, aucun SDK de mesure tiers.
- [ ] Cohérent avec `PrivacyInfo.xcprivacy` (`NSPrivacyTracking` false, aucun domaine de tracking).
- [ ] Si un SDK tiers (analytics, crash) était un jour ajouté : re-vérifier ATT + labels + manifeste avant soumission.

## 9. Comptes et outils Apple

- [ ] Compte Apple Developer Program : 99 USD/an (inscription avec l'entité du produit).
- [ ] App Store Connect : app créée avec Bundle ID `com.wairyu.app`, métadonnées, captures iOS, politique de confidentialité, EULA.
- [ ] Clé APNs `.p8` créée (voir `apps/ios/README.md`), stockée hors dépôt.
- [ ] Xcode 15+, macOS pour les builds et archives.

## 10. Review : comptes de test

- [ ] Fournir dans App Store Connect (champ « App Review Information ») au moins deux comptes de test complets (profils remplis, photos) pour démontrer le matching et le chat entre deux utilisateurs.
- [ ] Documenter pour le reviewer : comment tester signalement, blocage, suppression de compte.
- [ ] Vérifier que les comptes de test sont actifs en PROD (l'app embarque la PWA de prod) et que la modération n'en bloque pas un pendant la review.
- [ ] Notes de review : préciser que le chat nécessite deux comptes (les deux fournis).

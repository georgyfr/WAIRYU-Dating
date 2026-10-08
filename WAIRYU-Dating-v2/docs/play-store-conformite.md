# Conformité Google Play 2025 — TWA WAIRYU

Checklist opérationnelle pour la publication de la TWA Android (`com.wairyu.app`) sur Google Play, à jour des exigences 2025. Cocher chaque ligne avant soumission ; documenter les preuves dans le journal d'étape.

Contexte produit : PWA de rencontre servie par `https://wairyu.wairyu.workers.dev` (prod) et `https://wairyu-staging.wairyu.workers.dev` (staging) ; la TWA embarque le site. Audience incluant l'Afrique (beaucoup d'appareils 2016/2017).

---

## 1. Cibles SDK

- [ ] `targetSdkVersion 35` — OBLIGATOIRE pour les nouvelles apps et les mises à jour en 2025 (politique Google Play). Bundlewrap/TWA configuré en conséquence.
- [ ] `minSdkVersion 21` — couvre Android 5.0 (2014) et tout le parc 2016/2017 (Android 6/7). Pas de raison de monter : le site gère les vieux navigateurs (voir `docs/compatibilite-anciens-appareils.md`).

## 2. Format et artefact

- [ ] App bundle `.aab` généré via Bubblewrap (`bubblewrap build`), pas d'APK direct pour Play.
- [ ] VersionCode géré dans `twa-manifest.json` / config Bubblewrap, incrémenté à chaque soumission.

## 3. Signature (leçon v1 : interdiction absolue du keystore dans le dépôt)

- [ ] Keystore RSA 2048 bits MINIMUM, généré HORS DÉPÔT : jamais dans le repo, jamais dans `twa-manifest.json`, jamais en clair. La v1 a committé keystore ET mot de passe dans `twa-manifest.json` — interdit et dangereux ; à ne jamais reproduire.
- [ ] Mots de passe du keystore stockés hors dépôt (coffre-fort/fichier local chiffré), avec procédure de récupération documentée.
- [ ] Play App Signing ACTIVÉ (recommandé) : Google détient la clé de signature app ; la clé locale devient une « upload key » remplaçable en cas de perte.
- [ ] Backup sécurisé du keystore (perte = perte du produit).

## 4. Digital Asset Links (sinon barre d'URL visible)

- [ ] `/.well-known/assetlinks.json` servi par le Worker sur `https://wairyu.wairyu.workers.dev` (et staging), contenant l'empreinte SHA-256 du certificat de signature et la déclaration `get_login_creds`/`handle_all_urls` pour `com.wairyu.app`.
- [ ] Vérification : `StatementList` OK et lancement sans barre d'URL Chrome (si l'empreinte ne correspond pas, la TWA se dégrade en Custom Tabs avec barre d'adresse — rejet de qualité).
- [ ] Empreinte à régénérer/vérifier après activation de Play App Signing (l'empreinte signée Play diffère de l'empreinte d'upload : déclarer les deux ou celle de Play).

## 5. Permission POST_NOTIFICATIONS (Android 13+)

- [ ] Runtime `POST_NOTIFICATIONS` demandé à l'utilisateur sur Android 13+ (API 33) : dans une TWA, la permission est déléguée à Chrome (delegation `notificationDelegation` dans la config TWA) — vérifier le comportement sur appareil Android 13/14.
- [ ] Demande contextuelle (après première interaction, jamais au froid lancement), refusable sans blocage de l'app.
- [ ] Android < 13 : pas de runtime permission, les notifications marchent dès l'installation.

## 6. Formulaire Data Safety (Play Console)

Déclarations attendues, cohérentes avec la politique de confidentialité et le produit :

| Donnée | Collectée | Partagée | Usage |
| --- | --- | --- | --- |
| Email | Oui | Non | Fonctionnalité de l'app (compte, auth) |
| Photos | Oui | Non | Contenu utilisateur (photos de profil) |
| Messages | Oui | Non | Fonctionnalité de l'app (chat) |
| Localisation approximative | Oui | Non | Fonctionnalité de l'app (tri par distance) |

- [ ] « Aucune vente de données » et « aucun partage avec des tiers à des fins publicitaires » déclarés (vrai pour WAIRYU : zéro tracker, zéro SDK pub).
- [ ] Chiffrement en transit déclaré (HTTPS partout).
- [ ] Suppression de compte : URL web de suppression + mécanisme in-app, les DEUX déclarés dans Data Safety (exigence Play 2024+ pour apps avec création de compte). Suppression = purge des données utilisateur (délais de rétention documentés).

## 7. Politique de confidentialité

- [ ] URL publique HTTPS, en français (et langue des marchés visés), liée depuis le listing Play ET depuis l'app.
- [ ] Contenu : données collectées (voir tableau ci-dessus), durée de conservation, droits utilisateur, contact.

## 8. Classification du contenu (IARC)

- [ ] Questionnaire IARC rempli honnêtement : app de RENCONTRE → classification Mature 17+ / 18+ attendue.
- [ ] Ne pas tenter d'obtenir une classification inférieure : la mention « rencontres » déclenche automatiquement le périmètre adulte côté review.

## 9. UGC et sécurité (exigences Play pour apps de rencontre)

Politique Google Play « Contenu généré par les utilisateurs » — obligatoire :

- [ ] Signalement d'un utilisateur/profil/message in-app (bouton visible).
- [ ] Blocage d'un utilisateur in-app.
- [ ] Modération effective : filtrage des contenus problématiques, traitement des signalements, sanctions.
- [ ] Coordonnées de contact de la modération accessibles.
- [ ] Mécanisme anti-abus cohérent (les signaleurs en série ne peuvent pas armer le système seul — déjà modélisé dans l'agrégat de signalements).
- [ ] Les apps de rencontre sont scrutées à la review sur ces points : préparer des captures et une description de la chaîne signalement → modération.

## 10. Exigences techniques diverses

- [ ] 16 KB page sizes : concerne les bibliothèques natives (`.so`) ; la TWA n'a PAS de code natif → N/A (vérifier qu'aucun SDK natif n'est ajouté un jour sans re-vérification).
- [ ] Rapport pre-launch : lu après chaque upload (crashs détectés automatiquement par Play sur appareils virtuels/réels) ; bloquer la release sur tout crash récurrent.
- [ ] Comptes de test pour la review : fournir dans Play Console (App access) au moins un profil complet avec photos et un second compte pour tester le matching/chat entre deux utilisateurs.
- [ ] URL de l'app testable : la TWA pointe vers la prod HTTPS — la review n'aura pas besoin d'installation manuelle.

## 11. Note d'architecture : app = TWA

L'app Play est une TWA : c'est le SITE qui est évalué. Le site doit donc être une PWA de qualité, exigence Play explicite pour les TWA :

- [ ] Manifest complet (nom, icônes 192/512 + maskable, `display: standalone`, thème) — déjà en place.
- [ ] Service worker enregistré (hors login) — en place.
- [ ] HTTPS obligatoire — Workers est en HTTPS.
- [ ] Aucune régression du site non testée : chaque mise à jour Play = build PWA frais embarqué à la même URL.

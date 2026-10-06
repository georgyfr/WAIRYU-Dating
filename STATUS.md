# STATUS — WAIRYU v2 (dashboard append-only)

> ⚠️ Note de reconstitution (2026-10-06) : le sandbox de travail a été
> réinitialisé entre-temps ; le STATUS de la session précédente (Étapes 0-1,
> commits 41eb198/ce8f5c5) était local et a été perdu avec lui. Ce fichier est
> reconstitué à partir du journal des agents (worklog). Le déploiement
> Cloudflare, lui, n'a JAMAIS été interrompu (prod + staging en ligne
> continûment). Les documents d'Étape 0 (CADRAGE, juridique) restent à
> re-tamponner lors d'une prochaine session.

## Avancement

| Étape | Statut | Gate | Preuve |
|---|---|---|---|
| 0 — Cadrage, RGPD, identité | ✅ (reconstitué) | — | worklog Task 4 (palette logo mesurée, assets) |
| 1 — Socle technique | ✅ | ☑ | health/version/admin-usage verts sur 2 envs |
| **Mission N — Notifications + natif** (anticipée, hors plan initial) | ✅ | ☑ | voir journal ci-dessous |
| 2 — Authentification (OTP + OAuth + RGPD) | ⏳ suivante | — | plan §Étape 2 |
| 3-11 | ⏳ | — | docs/PLAN-RECONSTRUCTION-WAIRYU.md |

## Environnements

- Production : https://wairyu.wairyu.workers.dev (Worker `wairyu`, D1 `wairyu-prod`, KV `wairyu-config-prod`)
- Staging : https://wairyu-staging.wairyu.workers.dev (Worker `wairyu-staging`, D1 `wairyu-staging`, KV `wairyu-config-staging`)

## Secrets posés (valeurs dans /home/z/SECRETS-WAIRYU-LOCAL.txt, HORS dépôt)

SESSION_HMAC_KEY, ADMIN_TOKEN (session précédente) · VAPID_PUBLIC_KEY,
VAPID_PRIVATE_KEY, VAPID_SUBJECT, ANDROID_CERT_FINGERPRINTS (mission N, 2 envs).

## Journal

### 2026-10-06 — Mission N : socle notifications + application native (anticipée avant Étape 2, demande fondateur)

**Livré**

1. **Web Push VAPID zéro-dépendance** (port v1, RFC 8291/8292) : `apps/api/src/lib/push.ts` — JWT ES256 +
   chiffrement aes128gcm via WebCrypto ; nettoyage **410-only** (leçon v1 : 404 transitoire conservé).
2. **API push device-based** (`routes/push.ts`, migration `0003_push.sql`) : `open` (première ouverture ⇒
   événement in-app + bienvenue différée), `key`, `subscribe` (bienvenue ou confirmation auto), `test`
   (VRAI push force:true), `events` GET/POST (centre in-app universel), `unsubscribe`. Rate-limits KV
   (test 6/min, open 60/min, subscribe 10/min). `user_id` prévu dans le schéma pour la liaison Étape 2.
3. **PWA** : `public/sw.js` (anti-doublon page visible + force, tap standalone-first), `lib/push-client.ts`
   (armement auto sur geste, repli local), console notifications sur l'écran d'accueil (journal 5 s).
4. **TWA Android réelle** : `apps/twa` (bubblewrap) — package `com.wairyu.app`, **minSdk 21 / targetSdk 35**,
   `fallbackType customtabs` (compat 2016/2017), **APK signé + AAB générés** (1,6 Mo), keystore HORS dépôt
   (leçon v1), `assetlinks.json` EN LIGNE avec empreinte SHA-256 réelle → barre d'URL masquée.
   APK téléchargeable : https://wairyu.wairyu.workers.dev/app/wairyu.apk
5. **iOS** : `apps/ios` (Capacitor, min iOS 13, PrivacyInfo.xcprivacy, guide APNs) — build final sur macOS.
6. **Conformité stores** : `docs/play-store-conformite.md` (targetSdk 35, Data Safety, IARC 18+, UGC),
   `docs/app-store-conformite.md` (Sign in with Apple 4.8, suppression de compte 5.1.1(v), UGC 1.2),
   `docs/compatibilite-anciens-appareils.md` (matrice 2016/2017), `docs/notifications-architecture.md`
   (4 canaux : push / in-app / APNs / email Brevo).
7. **Compat anciens appareils** : build Vite `es2015` (51 KB gzip), canal in-app par polling pour
   navigateurs sans push (Chrome 42+ OK, iOS 10-11 → in-app + email).
8. **Console de test sandbox** (prévisualisation) : page unique parlant DIRECTEMENT à l'API Worker
   (CORS ouvert device-based, serré à l'Étape 2) — activation, test, simulation première ouverture, journal.

**Gates (preuves machine)**

- `tsc --noEmit` VERT ×3 workspaces ; `vite build` VERT (38 modules).
- Migrations D1 : 0001/0002 déjà appliquées (skippées), **0003_push appliquée** sur prod + staging.
- curl staging : health OK · `/api/push/key` → `{enabled:true}` · open → `{firstOpen:true}` ·
  events → événement `first_open` in-app · subscribe+test sur endpoint factice → échec **gracieuse**.
- CORS preflight corrigé (openCors AVANT devCors — hono/cors court-circuite le preflight).
- D1 : 3 appareils enregistrés par les visites réelles de vérification.
- agent-browser : console sandbox ET PWA staging rendues, zéro erreur console, boutons fonctionnels
  (le headless ne peut pas accorder la permission — pipeline push complet à confirmer par le fondateur).
- APK vérifiée par `keytool -printcert` : signature OK, empreinte = celle d'assetlinks.json.

**Prochaine** : Étape 2 — authentification (OTP email + Turnstile + OAuth Google/Facebook + Apple,
RGPD, pseudo/PBKDF2) — mapping fichiers v1 au plan §Étape 2. La liaison device↔user s'y ajoute.

---

## Étape 2 — Authentification & comptes (2026-10-06) ✅

**Livrable** : port intégral du module auth v1 → v2 (9 libs + routes/auth.ts + 4 migrations), front d'authentification complet, provisioning Turnstile + Brevo.

**Backend** (migrations 0004_auth, 0005_oauth, 0006_auth_password [fusion 0017+0019 v1 — username_canonical natif], 0007_age_triggers) :
- OTP email : 6 chiffres, SHA-256 hashé, TTL 10 min, 3 essais, cooldown 60 s, anti-énumération ( Brevo, sender wairyu26@gmail.com)
- P0 âge : birth_date ISO exigée à l'INSCRIPTION (3 flux), validateur unique lib/age.ts, triggers SQL dynamiques 18+ (testés : RAISE ABORT machine)
- Sessions révocables : logout, logout-all (cookie signé Étape 1 + révocation D1)
- RGPD : GET /account/export (JSON, art. 15+20, tables v2 complètes) + DELETE /account (hard delete immédiat + trace anonyme J+30, purgée par le cron étendu : auth_codes + password_resets ajoutés)
- OAuth : Google PKCE S256 + state signé + GSI idtoken (FedCM/TWA) ; Facebook state + appsecret_proof + data-deletion callback + rattrapage email (cookie signé + /facebook/link) — INACTIFS tant que les secrets ne sont pas posés (config.front masque les boutons)
- Pseudo+mot de passe : PBKDF2-SHA256 100k, pseudo affiché (espaces/accents) ≠ canonique ([a-z0-9_]), code de récupération XXXX-XXXX-XXXX, verrou 5 échecs/15 min, forgot/reset par lien 1 h, password/set pour comptes email, /account/recovery-email
- ~40 règles RATE_RULES portées (auth + étapes futures)

**Front** : lib/auth-client.ts, TurnstileWidget (render explicite, dégradation silencieuse), Auth.tsx (OTP + mot de passe + OAuth conditionnel + collecte birthDate à la volée anti-énumération), FbComplete.tsx, ResetPassword.tsx, App.tsx (grille de session 401 → Auth, hash routes #/reset?t=, #/fb-complete, retours OAuth), Profile.tsx (identité, mot de passe optionnel, export RGPD, suppression avec confirmation)

**Provisioning** : widget Turnstile « wairyu-auth » créé (prod STRICT fail-closed ; staging vérification sautée), TURNSTILE_SITE_KEY+SECRET, BREVO_API_KEY+EMAIL_FROM posés (7 secrets) ; rotation ADMIN_TOKEN (valeur perdue avec la sandbox — re-archivée) ; secrets archivés hors dépôt

**Gate 2 — preuves machine (staging, curl)** : 24 assertions VERTES — config complète ; OTP réel Brevo (channel:email) + bypass ADMIN devCode ; rate limit 5/h par email + cooldown 60 s observés ; mineur 2015 → 403 générique sans création ; birthDate manquante → 400 avant INSERT ; adulte → 200+created+cookie ; /me ; export RGPD ; register « Marie Claire » → code récup ; login canonique marieclaire ≡ Marie Claire ; 401 faux mdp ; recovery+reset ; verrou 429 « 15 min » ; forgot sent:true ; /admin/usage 200 (token rotation) ; DELETE /account → user disparu en D1 + tombstone user_request ; trigger SQL « majeur requis » ; logout → 401. Prod : config OK, /api/auth/otp/request sans token → 403 strict.
**Parcours mobile 390×844 (agent-browser)** : Welcome → Auth → inscription pseudo via UI (Turnstile rendu) → code récupération → app → Profil (@Gate Deux, mot de passe actif, RGPD) → logout. Zéro erreur console.

**Écart assumé** : relais OTP par push (v1 t73) différé — requiert la liaison device→user_id (arrive avec le ciblage utilisateur) ; Apple Sign-in à l'Étape 9 (compte Apple Developer requis).

**Prochaine** : Étape 3 — Profils & photos protégées (assistant guidé, Cloudinary authentifié, préférences).

## 2026-10-06 — Étape 2-bis : OAuth ACTIVÉ + notifications d'authentification (fondateur)

Secrets Google (client 961903691270-…) et Facebook (app 3696617487160524) fournis par le fondateur, posés printf '%s' sur prod+staging (4 × 2, archivés hors dépôt). Décisions fondateur livrées :
1. **Félicitations tout canal** — migration 0008 (users.congrats_pending + congrats_via) ; toute CRÉATION de compte (email OTP / Google / Facebook / pseudo) arme le drapeau ; POST /api/push/link-device (session requise, garde anti-détournement d'appareil) lie devices.user_id + device_push_subscriptions.user_id puis délivre la notification « Bienvenue sur WAIRYU 🎉 » personnalisée par canal : bulle OS (force:true) + journal in-app universel.
2. **OTP relayé en notification** — /auth/otp/request pousse le code à 6 chiffres sur les appareils DÉJÀ liés au compte (jamais l'appareil anonyme demandeur — anti-prise-de-contôle) : push OS/toast + journal kind='otp' avec le code. L'email reste TOUJOURS envoyé (filet). Front : message « email + notification » + PushToast.tsx (consomme le postMessage SW « wairyu-push » page visible — le code s'affiche à l'écran même sans bulle OS).
3. **Auto-login permanent** — LIMITS.sessionDays 30 → 365 (glissant, prolongé à chaque visite dès qu'il reste < 90 j ; cookie Max-Age 365 j) : le compte reste connecté, jamais de réinscription.

**Preuves (staging curl + D1)** : config google/facebook enabled:true ×2 envs ; /auth/google/start → 302 PKCE S256 + client_id + redirect_uri corrects ; /auth/facebook/start → 302 v21.0 ; OTP inscription → users.congrats_pending=1/via='email' ; link-device → {congrats:'inapp',congratsVia:'email'} (push simulé en échec = repli in-app conforme), pending→0, subscription.user_id lié, journal 'account_created' 🎉 ; 2ᵉ OTP (login) → journal kind='otp' « Code : 001027 (valable 10 minutes) » sur l'appareil lié ; link-device sans session → 401 prod ; agent-browser : boutons Google+Facebook rendus, zéro erreur console. Résidus de smoke purgés (0/0/0).

**Reste fondateur** : coller les redirect URIs dans les consoles (Google : {prod,staging}/api/auth/google/callback ; Meta : {prod,staging}/api/auth/facebook/callback) — les boutons sont déjà en ligne.

**Prochaine** : Étape 3 — Profils & photos protégées.

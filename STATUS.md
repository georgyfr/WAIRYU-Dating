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

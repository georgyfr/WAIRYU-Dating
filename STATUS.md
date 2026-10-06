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

## 2026-10-06 — Correctif : connexion Google/Facebook sans JSON brut (fondateur)

Bug signalé : « Continuer avec Google » sur un nouvel email → `{"error":"Date de naissance requise pour créer un compte wairyu."}` en page brute. Cause : inscription sociale sans date déclarée → 400 rejeté par le callback. Facebook avait la même faille (avec email) + une 2ᵉ instance dans le rattrapage sans email (#/fb-complete sans champ date).

**Correctif (complétion différée, 2 phases)** : les callbacks détectent « nouvel email sans date » → identité mise en attente dans un cookie signé 10 min (`wairyu_oauth_pending`) + écran `#/oauth-complete` (explication 18+, saisie de la date) → `POST /api/auth/oauth/complete` valide, crée le compte, lie l'identité, ouvre la session. Connexion d'un compte existant : zéro friction (fusion email prouvée par gate). Plus AUCUN JSON brut sur les callbacks (state invalide/banni/mineur → retours app avec messages lisibles). Bonus : `otp/verify` valide la naissance AVANT de consommer le code (rattrapage en une saisie) ; `Auth.tsx` ne fait plus de setState au rendu.

**Preuves** : staging — seed smoke (staging-only) → 400 sans date / 403 mineur sans création / 200 `created:true` google+facebook / `/me` 200 / fusion `created:false` même userId / D1 `congrats_pending=1, congrats_via=google|facebook` + identités liées / purge 0-0-0. Prod — callbacks 302 amicaux, `complete` 400 amical, seed 404. agent-browser — écran rendu, état « expiré » + retour propres, boutons OAuth intègres, 0 erreur console, mobile OK. Typecheck ×3 VERT. Déploiements : staging 01f672d5, prod 5726d81d, commit 5ebf2e5.

**Prochaine** : Étape 3 — Profils & photos protégées.

## 2026-10-06 — Correctif : Turnstile manquant sur la complétion Facebook (fondateur bloqué)

Bug signalé (capture) : `#/fb-complete` (Facebook n'a pas partagé l'email) → « Recevoir mon code » → « Validation anti-robot requise (Turnstile). » — blocage total. Cause : `FbComplete.tsx` n'avait jamais reçu le câblage Turnstile (`requestOtp(email, null)` codé en dur, aucun widget rendu) alors que la production est fail-closed et que `/api/auth/config` sert bien la clé de site. Parité perdue avec `Auth.tsx` lors de l'ajout de l'anti-robot.

**Correctif (3 fichiers)** : ① `FbComplete.tsx` — widget rendu dès que la clé de site est servie + jeton et deviceId transmis à la demande d'OTP (parité exacte avec Auth.tsx) ; ② `TurnstileWidget.tsx` — l'échec devient VISIBLE avec bouton « Réessayer la vérification » (fini l'échec muet en cul-de-sac, précieux sur connexion instable type MTN) et `loadTurnstileScript` retire le `<script>` mort + réinitialise son cache pour qu'une relance recharge réellement (bug latent : l'écouteur restait collé à l'élément mort) ; ③ `styles.css` — bloc `.turnstile-retry`.

**Preuves** : prod `#/fb-complete` — widget « Verify you are human » rendu (capture agent-browser), curl sans jeton → 403 « requise » / jeton bidon → 403 « échouée » (siteverify fail-closed intact) ; staging — parcours complet email → étape code (vérification sautée par conception), retry prouvé en bloquant puis débloquant `challenges.cloudflare.com` (échec visible → retry → `window.turnstile` rechargé) ; codes smoke purgés (auth_codes=0). Limite documentée : le challenge ne se résout pas dans un navigateur HEADLESS (détection bot Cloudflare) — le téléphone réel du fondateur le résout normalement, comme déjà prouvé par son inscription email réussie en prod via le même widget. Typecheck VERT. Déploiements : prod 32490fb1→34bf2f2c… (version finale 34bf2f2c), staging 9f9d5101→e66f7e53, commit 1ffd1cb sur main.

**Pour le fondateur** : refaire « Continuer avec Facebook » → compléter l'email + cocher « Verify you are human » → code reçu → compte créé/fusionné + félicitations. **Prochaine** : Étape 3 — Profils & photos protégées.

## 2026-10-06 — Inscription Facebook SANS email (alternative à l'OTP)

Question fondateur : « que se passe-t-il si l'utilisateur a oublié le mot de passe de son email ? n'y a-t-il pas d'autre alternative pour l'inscription Facebook ? » — Réponse : avant, blocage définitif (l'OTP exige la boîte mail). Désormais : **« Continuer sans email — via Facebook »** sur #/fb-complete — l'identité Facebook du cookie signé (preuve du passage OAuth réel) suffit. Identité déjà reliée → connexion sans friction ; création → date de naissance 18+ exigée côté serveur, email placeholder fb-…@inbox.wairyu.local (même masquage que les comptes pseudo, remplaçable par un email de récupération dans Réglages), félicitations 🎉 même chaîne. Le nom Facebook porté par le cookie alimente le profil.

**Gardes** : /auth/otp/request et /auth/password/forgot refusent les placeholders avec message orientant ; anti-course UNIQUE → cleanup + 409 ; rate limit oauthCompleteIp ; mineur → audit + 403 (prouvé).

**Preuves (staging)** : sans date 400 / mineur 403 sans création / adulte 200 created:true (D1 : congrats_pending=1 via=facebook, email_at_link NULL) / même identité → created:false sans date / placeholders → 400 amicaux / prod seed 404. E2E agent-browser : molettes → Continuer sans email → overlay Bienvenue → profil masqué + journal 🎉. Purge 0/0. Commit 24d3f9d ; prod d588f36c, staging 1978cfb6.

**Prochaine** : Étape 3 — Profils & photos protégées.

## 2026-10-06 — Correctif : félicitations jamais reçue après inscription Facebook (deadlock de liaison d'appareil)

Bug signalé : « c'est parfait mais je n'ai pas reçu de notification à la fin de mon inscription via Facebook ». Preuve D1 prod : le compte Facebook du fondateur portait `congrats_pending=1` JAMAIS consommé, `devices=0`, `events=0` — tandis que l'inscription GOOGLE de la même heure sur le MÊME appareil Android avait bien délivré sa bulle (journal `account_created` delivered=1). Cause racine : la garde anti-détournement de `POST /push/link-device` (Task 8) refusait en 403 tout appareil déjà lié à un autre compte — or créer un 2ᵉ compte écrase le cookie de session précédent, donc « déconnecte-toi d'abord » était IMPOSSIBLE : deadlock permanent, félicitations orpheline, appareil à jamais ciblé sur l'ancien compte, journal du profil vide.

**Correctif (2 fichiers)** : ① `push.ts` — la liaison suit la session authentifiée COURANTE (« dernier connecté gagne », standard FCM) : l'appareil est rebasculé vers le nouveau compte, chaque rebasculement tracé par la métrique `device_rebound` (le deviceId, UUID 128 bits en localStorage non devinable, n'ouvre pas de vecteur exploitable — et le rate limit 12/min/appareil reste en place) ; ② `App.tsx` — le `link-device` du boot fait désormais SURFACE de la félicitations en attente (overlay) : les comptes créés avant le correctif reçoivent leur bienvenue différée à la prochaine ouverture, en plus de la bulle OS (force:true).

**Preuves (staging, reproduction exacte du deadlock)** : appareil ouvert → user A (seed google) créé + lié (congrats inapp) → user B (seed facebook) créé dans le MÊME jar (session A écrasée, comme en prod) → `link-device` B : **200 `{linked:true, congrats:"inapp", congratsVia:"facebook"}`** (avant : 403) ; D1 : `congrats_pending=0` pour B, appareil rebasculé vers B (dev=1), journal de l'appareil = 2 × « Bienvenue sur WAIRYU 🎉 » (google + facebook) ; garde intacte : sans session → 401. Purge smoke 0/0/0/0. Prod : health OK, link-device sans session 401, seed 404 (staging only), app chargée sans erreur console. Auto-réparation fondateur : à sa prochaine ouverture, son `congrats_pending=1` restant déclenchera rebind + bulle OS + overlay + entrée de journal. Typecheck API+web VERT. Déploiements : staging ec2548f1, prod cadb3473.

**Note produit (à transmettre)** : le fondateur a désormais DEUX comptes (Google cheztattaa@gmail.com + Facebook « Georges Dongmo » sans email) — les identités de fournisseurs différents avec emails différents ne fusionnent pas (par conception) ; il peut ajouter un email de récupération au compte Facebook dans Réglages. **Prochaine** : validation fondateur, puis Étape 3 — Profils & photos protégées.

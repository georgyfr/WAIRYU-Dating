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

## 2026-10-06 — Mots de passe visibles (œil afficher/masquer) — demande fondateur

Demande : « lors de la création des comptes avec pseudo, assure-toi que les mots de passe aient la possibilité d'être vus ». Les 4 champs mot de passe étaient masqués sans recours — pénible sur clavier mobile (faute de frappe = connexion refusée sans explication).

**Correctif** : NOUVEAU composant `PasswordField.tsx` — bascule œil/œil-barré (SVG inline, projet sans lib d'icônes : zéro dépendance), intégrée à la structure `.field` existante. Remplace les 4 champs : connexion pseudo (Auth), inscription pseudo (Auth), réinitialisation par lien email (ResetPassword), activation du mot de passe dans Réglages (Profile). Accessibilité : `type="button"` (jamais de submit accidentel), `aria-pressed`, `aria-label` dynamique « Afficher/Masquer le mot de passe », focus visible turquoise. CSS : `.pw-wrap` (input `padding-right: 54px`) + `.pw-toggle` (42×42, ≥44px de cible tactile avec la marge, hover/focus-visible).

**Preuves (agent-browser, staging)** : écran « Créer un compte avec un pseudo » — œil rendu ; saisie « MotDePasse2026! » → `type="password"` ; clic → `type="text"`, valeur lisible, `aria-pressed=true`, label « Masquer » ; 2ᵉ clic → re-masqué, `aria-pressed=false` ; capture visuelle : œil aligné dans le champ, cohérent avec l'icône du sélecteur de date ; écran connexion — œil présent (autoremplissage navigateur vérifiable d'un clic) ; zéro erreur console. Typecheck VERT. Déploiements : staging e898616d, prod 591bb4cc.

**Prochaine** : validation fondateur, puis Étape 3 — Profils & photos protégées.

## 2026-10-06 — L'ACCUEIL EST LE VOYAGE (demande fondateur)

Demande : « ce n'est pas cette page que je souhaite que l'on trouve à l'accueil. On doit immédiatement attaquer le voyage : brève présentation, objectifs, résultats attendus, différentes étapes » — en s'appuyant sur la doctrine des voyages (GitBook). Source retrouvée : la branche archive/v1-2026-10-05 du dépôt contient TOUTE la doctrine (Constitution v2.1 + Livrable des mondes — 51 dossiers de quêtes) : **11 MONDES · 51 QUÊTES**, 6 gratuits / 5 premium, étages de restitution (Carte → Miroir → Portrait de Monde → Portraits de Domaine → Portrait Intégral), M11 « Le Voyage à Deux » toujours gratuit débloqué au premier match — LA RENCONTRE N'EST JAMAIS PAYANTE.

**Livré** : NOUVEL écran `Voyage.tsx` = ACCUEIL de l'app connectée (nouvel onglet « Voyage » 🗺️ en 1ʳᵉ position ; Découvrir conservé). Quatre blocs, copy issue de la doctrine : ① héros sombre « Le Voyage » — brève présentation (11 mondes · 51 étapes · une destination) + promesse honnête (personne ne note, tu choisis ce qui se voit) ; ② les 3 objectifs (Te connaître vraiment · Te montrer vrai · Rencontrer juste) ; ③ les gains — l'échelle de restitution [7] (La Carte après chaque quête · Le Miroir · Le Portrait du Monde · Les Portraits de Domaine Le Soi/Le Cœur/L'Intime · Le Portrait Intégral 12-18 pages · La Rencontre) ; ④ la carte des 11 mondes en chemin vertical (nœuds emoji, chips MONDE N, taglines tutoiées ≤22 mots, comptes d'étapes, 💎 Premium marqué JAMAIS vendu — zéro teaser règle [6], M11 « Toujours gratuit ») + outro « Premier arrêt : Le Miroir 🪞 » avec CTA vers Découvrir. Esprit respecté : ludique SANS dire « jeu » — pas de score/niveau/classement visible. NOUVEAU `lib/voyage.ts` : les 11 mondes + gains + objectifs en UNE source de données (status 'soon'/'open' par monde — les mondes s'ouvriront un à un sans retoucher l'écran).

**Preuves (agent-browser, staging, compte smoke seedé)** : inscription → overlay félicitations PAR-DESSUS la page Voyage → « C'est parti » → Le Voyage rendu (héros, 3 objectifs, 6 gains, 11 mondes avec chips premium/gratuit, outro) ; ancres OK ; CTA → Découvrir → onglet Voyage → retour Le Voyage ; zéro erreur console ; captures héros/carte/fin/mobile 390 px. Purge smoke (compte du fondateur sur staging préservé). Prod : health OK. Déploiements : staging 9daa4549, prod b91e916d.

**Prochaine** : validation fondateur de la présentation + copy, puis développement du Monde 1 « Le Miroir » (quête 1.1 — 58 items déjà gelés dans le dépôt d'origine).

## 2026-10-07 — L'accueil « Le Voyage » refait SELON LA MAQUETTE DU FONDATEUR

Le fondateur a validé le principe (« les inscriptions se font correctement ») et fourni une maquette visuelle de la page d'accueil attendue : héro illustré, objectifs en cartes, anneau de récolte, étapes numérotées, thèmes en pastilles, bannière « Premier arrêt », tabbar à pilule active. Livré à l'identique (adapté à la coque mobile 480 px) :

**Écran Voyage refondu** : ① héro dégradé nuit-turquoise avec ILLUSTRATION DÉDIÉE générée dans la palette (voyageur sac au dos face aux montagnes, avion — 30 Ko webp) + voile de contraste, chip « TON VOYAGE COMMENCE ICI », « 11 mondes · 50 étapes · une destination : une rencontre qui a du sens » (50 = somme RÉELLE des quêtes des 11 mondes, cohérente avec les pastilles thèmes), CTA blanc « Voir la carte du voyage » (scroll vers les étapes) ; ② « Ce que ce voyage fait pour toi » : 4 cartes d'objectifs avec icônes rondes colorées (boussole verte, cœur corail, cible violette, étoile ambre), chips « 5 min » et note manuscrite « Simple, rapide, efficace ! » ; ③ « Ta récolte en cours » : anneau SVG 0/11 mondes (arc masqué à 0), logo en centre, barre de progression, carte « Prochaine étape : La Carte » ; ④ « Les étapes du voyage » : les 6 JALONS = les gains (La Carte « En cours » → Le Miroir → Le Portrait du Monde → Les Portraits de Domaine → Le Portrait Intégral 12-18 pages → La Rencontre), badges numérotés, chips En cours/À venir, descriptions portant le GAIN de chaque étape ; ⑤ « Les thèmes du voyage » : les 11 mondes en pastilles (noms courts, comptes d'étapes, 👑 Premium, « Toujours gratuit » pour M11) ; ⑥ bannière « Premier arrêt : Le Miroir » avec 2ᵉ illustration (lagune) + bouton violet « Explorer le Miroir » → Découvrir.

**App coquille refondue** : en-tête = marque + baseline « Apprendre aujourd'hui, explorer demain » + CLOCHE avec badge RÉEL (journal in-app /api/push/events) ouvrant un panneau des dernières notifications + « Bonjour, {prénom} » avec avatar-initiale (prénom = displayName sinon pseudo ; rechargement du profil après inscription — le boot l'avait obtenu en 401). TabBar : icônes SVG traits, onglet actif = pilule dégradée turquoise (Voyage · Découvrir · Messages · Profil). **Fix de flux** : après inscription/connexion, atterrissage TOUJOURS sur le Voyage (stage réinitialisé — avant, le passage par « Commencer » laissait l'utilisateur sur Découvrir).

**Preuves (agent-browser, staging, 2 comptes de test créés puis purgés)** : inscription complète « Voyageur Test » → félicitations → Voyage ; login 2ᵉ compte « Cap Voyage » → « Bonjour, Cap » + badge cloche 3 (événements réels) + panneau notifications ; CTA héro → scroll étapes (scrollY 1056) ; navigation 4 onglets ; responsive 540/390 px (grille 2×2 objectifs, étapes 1 col, thèmes 2 col) ; zéro erreur console. Purge D1 staging : 2 comptes test supprimés (users/devices/sessions/subscriptions/events) — ne reste que le compte réel du fondateur. Typecheck VERT, build 64,45 Ko gzip JS (+2 images webp 49 Ko). Déploiements : staging 1679492f/36774fad, prod 021fd8e5. Commit 0749b33.

**Prochaine** : validation fondateur de la maquette, puis développement des mondes un à un (Monde 1 « Le Miroir » — quête 1.1 déjà gelée dans le dépôt d'origine).

## 2026-10-08 — Accessibilité du héro « Le Voyage » : textes détachés de l'illustration (conformité WCAG AA/AAA)

Le fondateur a signalé que les deux textes du héro — « 11 mondes · 50 étapes · une destination : une rencontre qui a du sens. » et le paragraphe « Ici, personne ne te note… » — « se confondent avec l'image et ne sont pas très lisibles pour des personnes qui ont des difficultés visuelles ». Diagnostic machine : à 480 px, la colonne de texte s'étendait jusqu'à x=340 px alors que la partie OPAQUE de l'illustration débutait à x≈298 px (masque de dégradé trop permissif) et que le voile de contraste tombait à 0,28→0 d'opacité dans cette zone ; aggravé par un corps 12 px à 85 % d'opacité (lede) et un sous-titre en #c9ebe9.

**Corrections (styles.css uniquement, aucune copie modifiée)** : ① masque de l'illustration resserré — l'image n'est plus opaque que sur son tiers droit (x>362 px), la zone de texte (jusqu'à 340 px) ne la touche plus jamais ; ② voile de contraste renforcé sur toute la zone de texte (0,95→0,88→0,5→0,08 au lieu de 0,55→0,28→0) ; ③ textes passés en contrainte maximale : lede #ffffff plein 13,5 px (au lieu de rgba(255,255,255,0.85) 12 px), sous-titre 14 px avec span #e6faf7 (au lieu de #c9ebe9 13,5 px), chip sur pastille sombre rgba(10,44,52,0.45) bord 0,45 ; ④ ombre portée douce 0 1px 3px rgba(7,32,38,0.55) sur le bloc de texte pour détacher chaque glyphe ; ⑤ breakpoint ≤400 px : illustration réduite à 50 % à 0,85 d'opacité + voile renforcé jusqu'à 0,66-0,22 sur la droite (le texte y occupe toute la largeur) ; ⑥ `@media (prefers-contrast: more)` : voile quasi opaque (0,98/0,96/0,72/0,45) pour les réglages système « contraste élevé ».

**Contraste calculé** : blanc sur le fond dégradé #0f5b63 = 7,8:1 (WCAG AAA ≥7:1) ; #e6faf7 ≈ 7,0:1 — et l'arrière-plan effectif sous le voile renforcé est plus sombre encore. **Preuves (agent-browser, staging, inscription réelle « Lecture Test »)** : héro 540 px — textes blancs pleins sur fond sombre quasi uni, illustration confinée au bord droit ; héro 390 px — idem après renforcement du breakpoint ; mesures DOM : bodyRight 340 px < début zone opaque 362 px (540 px), zéro erreur console. Purge D1 staging du compte de test (6 DELETE séparés, users/devices/sessions/auth_password/subscriptions/events = 0 ligne résiduelle) — compte réel du fondateur préservé. Déploiements : staging ed3daaf9 puis bd7b24ac, prod 89723bfc (health 200, index 200).

**Prochaine** : validation fondateur, puis développement des mondes un à un (Monde 1 « Le Miroir »).

## 2026-10-08 — Redesign UX complet de l'accueil « Le Voyage » (retour fondateur structuré)

Le fondateur a transmis une feuille de corrections design en 8 points (esthétique, ergonomie, lisibilité). Tout est appliqué :

**En-tête** : logo 38→46 px avec ombre douce, marque 19,5 px, baseline « Apprendre aujourd'hui, explorer demain » en bleu nuit 10 px (contraste nettement supérieur au gris clair), cloche redessinée (42 px, cercle blanc bord 1,5 px + icône 21 px), avatar 38 px avec double anneau blanc/turquoise, écart bonjour↔avatar 8→12 px.

**Héro** : hiérarchie renforcée (titre 36 px, interlignage 1,05), corps de texte 13,5→15 px avec interligne 1,7, chip avec NOUVELLE icône voyageur (panneau directionnel — remplace le cercle-aiguille ambigu), CTA plus visible : 14 px, flèche dans une pastille turquoise dégradée, ombre portée renforcée + contour lumineux.

**Objectifs** : icônes UNIFORMISÉES (style traits 2 px, tuiles carrées arrondies 48 px — fin des mélanges plein/contour), contenu centré verticalement et horizontalement, chips « 5 min » plus claires (fond blanc + bordure + horloge turquoise), flèches décoratives REMPLACÉES par de vrais boutons explicites : « Voir les étapes » / « Voir les thèmes » / « Voir ta récolte » / « Explorer les profils » — chacun conduit réellement à sa section (scroll ou onglet Découvrir).

**Récolte** : anneau agrandi 92→104 px (compteur 18 px), titre 16,5 px, barre de progression REDISENDEE en 11 segments = les 11 mondes (segments remplis en dégradé turquoise au fil du voyage) + libellé « N monde(s) franchi(s) sur 11 », carte « Prochaine étape » plus attrayante (bordure turquoise 1,5 px, tuile dorée dégradée avec icône carte, chevron en pastille).

**Étapes** : cartes espacées (12→16 px), icônes SVG distinctes par jalon (carte, miroir, montagne, strates, parchemin, anneaux — fin des emoji incohérents entre appareils), labels d'état sans ambiguïté : « En cours » (pastille turquoise + point pulsant) / « Verrouillé » (pastille grise + cadanet), carte active soulignée (bordure + ombre turquoise).

**Thèmes** : 11 icônes SVG mémorables et distinctes (miroir, volant, boussole, tente, arbre, cœur, parapluie, lune, cadenas, globe, anneaux entrelacés), pastilles 38 px à fond tendre + icône saturée, badge 👑 Premium REMPLACÉ par une gemme dorée élégante (dégradé + bordure fine or), « Toujours gratuit » bordé.

**TabBar** : icônes 21→23 px redessinées (Voyage = carte pliée, Messages = bulle à 3 points), libellés 10,5→11,5 px, hauteur 66→72 px + padding accru (cibles tactiles ≈ +10 %), inactif #8b9791→#66736d (contraste), pilule active sophistiquée : dégradé 3 tons + liseré lumineux intérieur + ombre profonde.

**Global** : police principale = pile système (SF Pro Display sur iOS, Roboto sur Android, Nunito en repli — demande fondateur « police système plus moderne »), espacements harmonisés (sections 28 px, gouttières 12 px, rayons cohérents 16-22 px), gris de texte unifiés #4d565e. Nouveau composant `components/VoyageIcons.tsx` (19 icônes) ; `lib/voyage.ts` enrichi (champ icon par monde/jalon + action par objectif). NOTE : le texte « TON VOYAGE COMMENCE ICI » était déjà correct dans le code — la faute « ITI » n'existait que dans l'image de maquette IA.

**Preuves (agent-browser, staging, inscription réelle « Style Test »)** : héro avec nouvelle hiérarchie + CTA pastille flèche ; bouton « Voir les étapes » → scrollY 1380 (ancre OK) ; « Explorer les profils » → onglet Découvrir ; étapes 2 col (540 px) / 1 col (390 px) ; 11 thèmes avec gemmes Premium ; zéro erreur console. Purge D1 staging du compte test (6 DELETE, 0 résidu — compte fondateur préservé). Build 65,38 Ko gzip JS. Déploiements : staging 234980f7, prod e1917c5c (health 200).

**Prochaine** : validation fondateur, puis Monde 1 « Le Miroir ».

## 2026-10-08 — Le Voyage : héro conforme au mockup fondateur + zéro bouton de navigation

**Demande fondateur** (mockup ibb.co/LzjgQmS9) : « c'est comme ça que cette section doit être… et tous ces boutons ne doivent pas être visibles durant le voyage. »

**Héro = EXACTEMENT le mockup** : chip repassée en pastille turquoise PLEINE avec icône boussole (fini le panneau sombre bordé), CTA « Voir la carte du voyage » en pilule turquoise avec boussole + flèche, texte blanc — blanc sur turquoise #0d746c→#13837b = 4,6:1 à 5,6:1 (WCAG AA, cohérent avec l'exigence a11y du fondateur). Sous-titre repassé en blanc uni gras (le mockup montre toute la ligne en gras). Les protections a11y de la passe précédente (voile, masque image, ombre de texte) restent intactes — mesuré : colonne de texte 386 px < zone opaque 423 px à 540 px ; 374 px à 390 px.

**Zéro bouton de navigation durant le voyage** : la page se lit, la SEULE action est la carte du voyage elle-même.
- Cartes objectifs : boutons « Voir les étapes/thèmes/récolte/profils » SUPPRIMÉS (retour à la carte pure + pastille « 5 min »)
- « Prochaine étape » : redevient une carte informative statique (plus de chevron, plus de clic)
- Lien « Voir tous les thèmes → » SUPPRIMÉ de l'en-tête des étapes
- Bannière « Premier arrêt » : bouton « Explorer le Miroir → » SUPPRIMÉ (la navigation passe par la tabbar)
- Vérifié au DOM : `document.querySelectorAll('.voyage button').length === 1` (le CTA du héro)

**Nettoyage** : styles orphelins retirés (.v-obj-btn, .v-obj-foot, .v-link, .v-next-chev, .v-hero-cta-arrow, .v-arret-row/.v-arret-ico/.v-arret-btn) ; prop `onDiscover` retirée de Voyage.tsx (App.tsx mis à jour — la navigation Découvrir reste portée par la tabbar). La boussole remplace le panneau directionnel sur le chip ET le CTA, comme sur le mockup.

**Preuves (agent-browser, staging, inscription réelle « Design Test »)** : snapshot accessible = 1 seul bouton dans « Le Voyage » ; CTA → scrollY 1284 (ancre étapes OK) ; héro 540 px et 390 px conformes au mockup (captures) ; récolte/bannière sans aucun bouton ; zéro erreur page (seul un warning Turnstile 600010 bénin pendant l'inscription). Purge D1 staging du compte test (6 DELETE, 0 résidu — compte fondateur fouretout2018 préservé).

**Déploiements** : staging 6110c6d0, prod ebc0c402 (health 200, index 200, héro 200).

**Prochaine** : validation fondateur, puis Monde 1 « Le Miroir ».

## 2026-10-08 — Reconstitution Tasks 18→27 (5ᵉ reset sandbox) + résultats détaillés amplifiés (volet ombre)

**Constat** : la sandbox a été réinitialisée — `/home/z/wairyu` + `SECRETS-WAIRYU-LOCAL.txt` perdus (worklog intact). Le dépôt GitHub (`main` = Task 17, `a73ad6f`) ne contenait PAS les Tasks 18→27 (jamais poussées — PAT perdu).

**Reconstitution** (commit `cb06312`) : la vérité terrain = le bundle staging déployé `index-BvGGhSXl.js` (Task 27, audité octet par octet contre `archive/v1-2026-10-05` c3f9d2c2). Extraction programmatique : 3 quêtes (50+12+20 items verbatim, 58+20+26 positions gelées, 7+5+6 cartes, sélecteurs, accompagnement ×3 paliers, conseils), WORLDS/MILESTONES/BUILDS/PROGRESS/WORLD_DETAILS, écrans (Quête, Mondes+WorldModal, Parcourus, Recolte, Masque, Portrait, Rencontres, Voyage), TabBar 5 onglets, App (routes quête + masquage dating + menu compte), styles.css = CSS servi exact, images CDN restaurées à l'octet. **Règle 11-b re-vérifiée : 22 codes T01→T26 exacts, zéro formulation.** tsc ×3 VERT ; 17+ chaînes de contrôle = staging à l'identique.

**Demande fondateur sur « Tes résultats en détail »** (commit `2c0fdba`) :
1. **Plus d'explications** — bloc « comment lire ces barres » (0-100 = tendance d'aujourd'hui, ni notes ni cases) + explication par dimension (« ce que cette barre regarde », 5+2+3 textes) sous chaque barre, repris dans le PDF.
2. **Le volet ombre avec ses conséquences relationnelles** — nouvelle section « Ton volet d'ombre » : zone d'ombre (verbatim carte) + **« Côté relation »** (18 textes par VARIANTE : ce que l'ombre peut donner avec les gens qu'on aime + le geste qui aide) + tension intérieure + note honnête (lecture d'app, pas un diagnostic). PDF : « Côté relation » ajouté dans Ma carte.
3. **Chapitre « Ta manière de répondre » supprimé** (vue + PDF) — répartition Likert et signature retirées, phrase d'intro du PDF mise à jour, styles `.q-repart*` retirés.

**Preuves (agent-browser, LOCAL wrangler dev + D1 local, compte « Recup Test », code récup jetable wairyu.H5N9-TUGP-R3SY — base LOCALE, rien en staging/prod)** : inscription → Voyage (5 onglets) → Mondes (M1 Commencer, autres verrouillés) → fiche M1 → #/quete/1.1 (annonce verbatim, briefing 4 sections) → passation 50 réponses (premier item Q1.1-17 = position 1 gelée) → carte « L'Équilibriste » (all-5s → V7 conforme aux sélecteurs) → détails : barres 70/70/70/70/40 EXACTES, volet d'ombre avec le texte V7 correct, ZÉRO « Ta manière de répondre » → PDF déclenché sans erreur → modale partage (« Avant de partager », focus sur « Non », Échap OK) → « Attaquer la quête suivante » → 1.2 → deep-link 1.1 → carte intacte → « Retour à mon voyage » → onglet Quête → reprise directe 1.2 ; zéro erreur page ; zéro overflow 390px ; captures 390 + 1280.

**Déploiement STAGING (2026-10-08, token Cloudflare du fondateur)** : `deploy.sh staging` OK — typecheck VERT, build Vite, migrations D1 staging (« No migrations to apply »), Worker déployé **Version ID `04efcc8c-3de6-4e5d-bf73-b0243074aa6a`**. 6 assets uploadés (bundle `index-iy7QYJlN.js`, chunk PDF `pdf-resultats-rU4BVL8s.js`, jspdf chunk). Vérifications EN LIGNE : `/api/health` 200 (`env:"staging"`) ; chaînes de contrôle lues dans le bundle SERVI — « Ton volet d'ombre », « Côté relation », ombreRelationnel V1 (« des projets lancés à deux puis remplacés par le suivant »), commentLire (« Les cinq barres viennent de TES réponses… », « comme un portrait qui parle, pas comme un bulletin »), modale partage (« Avant de partager » / « Oui, je partage ma carte » / « Non, je la garde pour moi »), « Attaquer la quête suivante », « Retour à mon voyage », « Revoir ma carte » ; chapitre « Ta manière de répondre » ABSENT du bundle main ET « Ma manière de répondre » ABSENT du chunk PDF. **PROD NON TOUCHÉE** (health prod 200, bundle prod toujours `index-D-88neUZ.js` — Task 26) — règle 17-b respectée : toute mise en prod attend une autorisation explicite du fondateur.

**Sauvegarde GitHub (2026-10-08, PAT du fondateur)** : le PAT fine-grained fourni est scoppé sur le seul repo `georgyfr/WAIRYU-Dating` — la création d'un repo neuf (API `POST /user/repos`) et le fork sont refusés (« Resource not accessible by personal access token »), aucune organisation disponible. Tout le travail est donc poussé sur le repo existant : `main` (historique complet `a73ad6f` → `cb06312` → `2c0dfba` → `61b41b1` → commit STATUS) + branche miroir `v2-reconstitution-task28` pointant sur le même état (séparation lisible côté GitHub). **À la demande du fondateur, un dossier `WAIRYU-Dating-v2/` a été rempli sur la branche `archive/v1-2026-10-05`** avec l'instantané complet du projet (tous les fichiers trackés de `main`, sans node_modules ni secrets — `git archive`).

**Prochaine** : validation fondateur sur STAGING (wairyu-staging.wairyu.workers.dev) → prod SUR AUTORISATION → miroirs (étage 2).

## 2026-10-08 (2) — Task 31 : « Tes résultats » dans Parcourus (relecture + PDF des quêtes terminées)

**Demande fondateur** : après une quête terminée, impossible de revenir aux résultats (renvoi immédiat vers la quête suivante — comportement voulu, mais aucun chemin UI vers les résultats passés). Sa proposition : une section « records » avec les résultats + téléchargement PDF.

**Livré (commit à venir)** : section **« Tes résultats »** dans l'onglet **Parcourus** (`Parcourus.tsx`) — liste des quêtes TERMINÉES (état réel `wairyu.quete.{id}`, ordre de la chaîne) : sur-titre « Quête N sur 3 · Le Miroir », titre, « Ta carte : {nom} », date d'obtention, et deux actions : **« Relire ma carte »** (→ `#/quete/{id}`, la vue carte d'origine intacte : détails, volet d'ombre, partage) et **« Télécharger le PDF »** (régénère le PDF depuis les réponses stockées — scorer + variante déterministes : même carte, mêmes barres ; état « Préparation… » pendant la génération). Section masquée tant qu'aucune quête n'est terminée. Le journal du bundle n'est PAS modifié (règle 11-b) ; styles `.m-res-*` (langage visuel m-world) + `prefers-contrast:more` + 2 colonnes ≥760px.

**Preuves (agent-browser, STAGING, compte jetable « ResTest31 »)** : état vide intact avant complétion ; quête 1.1 passée en entier (50 items, all-5s) → carte « L'Équilibriste » ; « Retour à mon voyage » → onglet Parcourus → section présente avec le bon contenu (« Ta carte : L'Équilibriste », « Carte obtenue le 8 octobre 2026 ») ; « Relire ma carte » → `#/quete/1.1` vue carte → « Voir mes résultats en détail » → détails COMPLETS (barres + lectures, TON VOLET D'OMBRE, CÔTÉ RELATION texte V7, tension, conseils, PDF) et zéro « Ta manière de répondre » ; « Télécharger le PDF » depuis Parcourus → génération sans erreur (busy → actif) ; zéro erreur page ; zéro overflow 390px ; captures 390 + 1280.

**Purge** : compte test supprimé de D1 staging (users + cascades + device orphelin = 0 résidu ; compte fondateur préservé).

**Déploiement** : staging Version `dec7e5b9-c59a-4791-90fc-3bbb5278a9d3` (bundle `index-CwhMCSxu.js`) — chaînes de la nouvelle section vérifiées dans le bundle servi. PROD NON TOUCHÉE (17-b).

## 2026-10-08 (3) — Task 32 : la révélation complète des résultats (critique du fondateur, formule en 10 blocs)

**Demande fondateur** : améliorer le contenu selon sa critique détaillée du PDF — trois questions à répondre (« Qu'est-ce que cela dit vraiment de moi ? » / « Qu'est-ce que cela peut provoquer dans une relation ? » / « Qu'est-ce que je peux faire avec cette découverte ? »), la formule en 10 blocs (carte → lumière → ombre-quand-la-lumière-déborde → tension → côté relation → ce que l'autre ressent → levier → ce que tu recherches → ce que Wairyu retient → prochaine étape), et une RÉVÉLATION INTERACTIVE à l'écran (pas un PDF condensé).

**Contenu écrit (18 cartes + 10 dimensions)** : 3 modules rédigés par 3 agents parallèles (`quete-1-1-plus.ts` 32-a, `quete-1-2-plus.ts` 32-b, `quete-1-3-plus.ts` 32-c, types dans `quetes-plus.ts` + registre PLUS) — pour CHAQUE carte : 5 preuves comportementales (« Ce que cela peut donner chez toi »), 3 besoins relationnels, la double voix (« Ce que l'autre peut parfois ressentir »), ce que tu peux apporter (5), ce que tu peux apprendre (4), UNE question à emporter (introspective, jamais un diagnostic), le langage relationnel (tu donnes / tu recherches / tu surveilles / tu apprécierais — moteur de matching) ; pour CHAQUE dimension : le levier de progression (force / risque / levier). L'exemple V3 « L'Étoile sociale » du fondateur est intégré comme étalon. Règle 11-b : aucun texte verbatim touché.

**Écran (Quete.tsx)** : la vue « Tes résultats en détail » devient une RÉVÉLATION SÉQUENTIELLE en 8 pas (✨ lumière + preuves → 🌘 ombre « quand ta lumière déborde » + côté relation → ⚡ tension + question à emporter → 👀 deux voix → ❤️ dans une relation → 🌱 profil qualitatif + leviers → 🧩 langage relationnel + conseils → 🧭 la suite), chaque pas s'ouvre via « Continuer » (scroll doux + « Tout afficher » en raccourci), relancée à chaque visite. Barres QUALITATIVES d'abord : « Ton ouverture — Très présente » puis « 78/100 — tendance actuelle » en secondaire (critique §7). Le PDF ne vient qu'à la fin, renommé « Télécharger mon document personnel ».

**Corrections de vocabulaire (critique §7-8)** : PALIER_LABELS → « Très présente / Équilibrée / Plus discrète » ; dimension « Ta bienveillance » → « Ta confiance » (l'axe réel : la confiance accordée — la lecture verbatim dit déjà « la confiance se mérite »). Les mentions « bienveillance » du LIVRABLE (annonce verbatim des 58 affirmations, hint voyage) restent intactes (règle 11-b).

**Cliffhanger final (critique §13)** : `suite` par quête — 1.1 « Ton premier miroir est posé. » + 3 questions + CTA « Découvrir ma façon de m'attacher » ; 1.2 « Ta façon d'aimer est posée. » + CTA « Découvrir ma façon de ressentir » ; 1.3 « Ton premier monde est complet. » + Retour à mon voyage.

**PDF (pdf-resultats.ts)** : restructuré selon la formule — Ma carte (avec Côté relation) → preuves → question à emporter → deux voix → dans une relation → profil (qualitatif + « pct/100 — tendance actuelle » + leviers par dimension) → langage relationnel → conseils → la suite de ton voyage ; pagination + note honnête inchangées.

**Déploiement + preuves (agent-browser, STAGING, compte jetable ResTest32, purgé après — 0 résidu, compte fondateur préservé)** : staging Version `1ea3ce3a` ; passation 1.1 complète → carte « L'Équilibriste » → détails : révélation PAS 1 seule visible (5 preuves) → Continuer ×N → chaque pas s'ajoute (kickers 1-8 vérifiés) ; « Côté relation », « Quand ta lumière déborde », question V7, deux voix, besoins/apporter/apprendre, « Très présente/Équilibrée », « /100 — tendance actuelle », leviers, langage (« Tu donnes »), cliffhanger + 3 questions + CTA → #/quete/1.2 « Ta façon de t'attacher » ; « Ta bienveillance » ABSENT des résultats, « Ta confiance » présente ; document personnel généré sans erreur ; zéro erreur page ; zéro overflow 390 ; captures 390 + 1280 conformes.

**Prochaine** : validation fondateur sur STAGING → prod SUR AUTORISATION (17-b) → monde 2.

## 2026-10-08 (4) — Task 33 : l'archétype d'abord, le profil ensuite (réorientation éditoriale du fondateur)

**Demande fondateur** : la révélation Task 32 « donne l'impression de me connaître en profondeur, mais il y a beaucoup de choses sur lesquelles je ne me reconnais pas » — les sections personnelles (Ta lumière + preuves, Ton ombre + côté relation, Ta tension + question à emporter, Ce que l'autre ressent, Ce dont tu as besoin) sont « forcées » et embarrassantes. Sa direction : présenter D'ABORD le type de personnalité de façon GÉNÉRALE (« à quoi renvoie ce type : sa lumière, son ombre, en relation… »), PUIS engager le profil personnalisé tendance par tendance (là où il se reconnaît), avec auto-validation. Approuvé via l'analyse éditoriale jointe (3 niveaux : ce que le type représente → ce que tes réponses indiquent → ce que tu en fais ; « Wairyu ne doit pas chercher à plaire, jamais transformer une tendance en vérité psychologique »).

**Contenu (18 archétypes)** : interface `ArchetypeCarte` (quetes-plus.ts) + 3 modules rédigés par 3 agents parallèles (`quete-1-1-arche.ts` 33-a, `quete-1-2-arche.ts` 33-b, `quete-1-3-arche.ts` 33-c, registre ARCHE) — pour CHAQUE carte : accroche, devise (1ʳᵉ personne), présentation générale (« certaines personnes… elles… généralement » — zéro « tu », zéro révélation intime), sa lumière (5-7 items + note), son ombre (situations + note « l'ombre n'est pas un défaut »), en relation (items + note « Une possibilité à garder en tête » — remplace les « deux voix »), son point d'équilibre (question à la 1ʳᵉ personne + note non normative). Anti-recopiage et ton vérifiés programmatiquement ; zéro U+2019/insécable.

**Écran (Quete.tsx)** : révélation en **6 pas** — ☀️ Ton archétype (nom + accroche + devise + présentation + Sa lumière) → 🌘 Son ombre + ❤️ En relation + 🌱 Son point d'équilibre → 🪞 Ton profil, tendance par tendance (pont « l'archétype donne une vue d'ensemble… tes réponses permettent de voir où tu te rapproches — et où tu t'en éloignes » + barres qualitatives + « Ce que tes réponses montrent » + leviers) → 🧩 Ce que tu emportes (langage relationnel — moteur de matching conservé) → 🧭 Comment utiliser cette quête (« Pas comme une vérité sur toi — comme un outil ») → 🧭 La suite + document personnel. **Auto-validation inline** : sous chaque dimension, « Cela correspond-il à ton expérience ? » — ✓ Ça me ressemble / ≈ Ça me ressemble parfois / ✕ Je ne me reconnais pas (touch targets 44px, aria-pressed, note « Ton avis affine la lecture — aucune bonne réponse »). Les sections personnelles Task 32 ne sont plus rendues — DONNÉES CONSERVÉES dans quete-1-*-plus.ts (non destructif, pour matching/carnet futurs).

**État (quete-state.ts)** : `lectures: Record<string, 1|2|3>` par dimension + `enregistrerLecture()` — persisté dans `wairyu.quete.{id}` (rétrocompatible : absent = non posé ; purgé avec la quête).

**PDF (pdf-resultats.ts)** : Ma carte (verbatim, sans « Côté relation » personnel) → Ton archétype (devise + présentation + 4 volets généraux) → Mon profil, tendance par tendance (pont + qualitatif + leviers) → Mon langage relationnel → Comment utiliser cette quête → La suite — les sections personnelles de la formule 32 ne sont plus imprimées.

**Déploiement + preuves (agent-browser, STAGING, compte jetable ResTest33, purgé après — 0 résidu, compte fondateur préservé)** : staging Version `f636e642` (bundle `index-Dgc5Mfhi.js`) ; état injecté (50 réponses calibrées → carte V3 « L'Étoile sociale », l'exemple même du fondateur) → PAS 1 seul visible (archétype complet : nom, accroche, devise, présentation, Sa lumière) → Continuer : PAS 2 (ombre générale + en relation + « possibilité à garder en tête » + point d'équilibre) → PAS 3 (pont + 5 barres qualitatives « 63/100 — tendance actuelle » + leviers) → validation « Ça me ressemble » cliquée → sélection visible + persistée (`lectures {"O":1}`) + conservée à la ré-entrée (révélation relancée au PAS 1) → PAS 4 langage → PAS 5 conseils → PAS 6 cliffhanger + CTA « Découvrir ma façon de m'attacher » → #/quete/1.2 ; PDF généré sans erreur ; ABSENCES vérifiées (preuves, deux voix, besoins, question à emporter, « quand ta lumière déborde » personnel) ; Parcourus intact (« Relire ma carte » + PDF) ; zéro erreur page ; zéro overflow 390/1280 ; captures mobile/desktop conformes.

**Prochaine** : validation fondateur sur STAGING → prod SUR AUTORISATION (17-b) → monde 2.

## 2026-10-08 (5) — Task 34 : félicitations + définition de l'archétype, puis le profil (affinage du fondateur)

**Demande fondateur** : sur la base du staging Task 33, préciser l'enchaînement — 1) **féliciter** la personne en lui annonçant son archétype (« félicitations, ton archétype est l'Étoile sociale ») ; 2) **définir** l'archétype (« l'Étoile sociale, qu'est-ce que c'est ? ») ; 3) **à quoi renvoie ce type de personnalité** — la ligne « une personne qui rayonne, explore et crée du mouvement » + la devise « je découvre, je partage, je fais circuler l'énergie » (qualifiées d'intéressantes par le fondateur) ; 4) les explications (lumière → ombre → en relation) ; 5) **Ton profil tendance par tendance** — contenu conservé tel quel (« il est bon, il n'y a rien à changer »), précédé d'une phrase d'introduction à la 2ᵉ personne qui annonce que cette fois on parle DE lui ; 6) l'ensemble doit être cohérent, agréable à lire et **donner envie de découvrir la deuxième quête** — « je ne voudrais pas que les personnes après la première quête se découragent ».

**Écran (Quete.tsx)** : PAS 1 restructuré — 🎉 « Félicitations — ta quête est accomplie » → « Ton archétype : » + le nom → encadré « {nom}, qu'est-ce que c'est ? » (la présentation générale devient la DÉFINITION) → encadré « À quoi renvoie ce type de personnalité ? » (accroche en gras + devise en exergue turquoise) → « Sa lumière » → note honnête sur les archétypes. PAS 3 : nouvelle intro — « Et maintenant, place à toi : voici exactement ton profil de personnalité dans cet archétype — tendance par tendance, d'après ce que tes réponses ont montré… » (contenu par dimension, leviers et auto-validation INCHANGÉS). **Teasers de continuation** : sous chaque « Continuer », une accroche du pas d'après (5 textes, `TEASERS`) — la lecture garde son élan jusqu'au cliffhanger final. PAS 2/4/5/6 inchangés.

**PDF (pdf-resultats.ts)** : synchronisé — section Ton archétype = félicitations + nom + définition + à quoi renvoie + devise avant les 4 volets ; intro « Mon profil » alignée sur l'écran.

**Styles (styles.css)** : `.q-arch-annonce` (annonce « Ton archétype : »), `.q-arch-accroche` renforcée (gras, encre), `.q-arch-devise` recalée dans l'encadré, `.q-rev-teaser` (accroche du pas suivant, italique).

**Déploiement + preuves (agent-browser, STAGING, compte jetable ResTest34, purgé après — 0 résidu, compte fondateur préservé)** : staging Version `54887a29` ; état injecté (50 réponses → carte V3 « L'Étoile sociale ») → PAS 1 vérifié textuellement (kicker 🎉, « Ton archétype : », « L'Étoile sociale, qu'est-ce que c'est ? », « À quoi renvoie ce type de personnalité ? » + accroche + devise, « Sa lumière ») → teaser pas 1 → PAS 2 (ombre/relation/équilibre) → PAS 3 (intro « place à toi » + 5 dimensions qualitatives + leviers + validation cliquée, `lectures {"O":1}` persistée) → teasers pas 3/4/5 → PAS 4 langage → PAS 5 conseils → PAS 6 cliffhanger + CTA → #/quete/1.2 ; PDF généré sans erreur ; ré-entrée = révélation relancée au PAS 1 ; zéro erreur page (seule warning Turnstile du flux connexion) ; zéro overflow 390/1280 ; captures mobile/desktop conformes.

**Git** : main `f896ea6` + archive `archive/v1-2026-10-05` `1c2798b` — triple sauvegarde à jour.

**Prochaine** : validation fondateur sur STAGING → prod SUR AUTORISATION (17-b) → monde 2.

## 2026-10-08 (6) — Task 35 : le GABARIT fondateur — un algorithme, le même rendu exact pour tout archétype

**Demande fondateur** : « Peux-tu reconstruire ton algorithme pour qu'il puisse répondre exactement pour tout type d'archétype de cette manière ? Je trouve que cette manière est beaucoup plus simple et littérale. Ce n'est pas mécanique. » — avec l'EXEMPLE DE RÉFÉRENCE (l'Étoile sociale) : 🎉 Ton profil : {nom} → « Ton archétype révèle une personne qui… Tu es de celles qui… Ton point de vigilance : … » → En résumé : « {devise} » → Ce que tu apportes → Ce qui peut te freiner → En couple → Ton équilibre → 🪞 Tes cinq tendances (d'après tes réponses), chacune « {nom} — {score}/100 ({palier}) » suivie d'un court texte → « À noter : ces barres sont un instantané de tes réponses du jour, pas des notes ni des verdicts… ».

**L'ALGORITHME (réponse à « comment pour tout type d'archétype ? »)** — trois pièces, documentées dans quetes-plus.ts : 1. **le GABARIT est du code** (Quete.tsx + pdf-resultats.ts) : les 9 blocs sont TOUJOURS rendus dans le même ordre, même typographie ; 2. **les MOTS sont des données** : interface `ArchetypeCarte` réécrite (6 champs à la 2ᵉ personne : intro, devise, apportes, freines, couple, equilibre) — ajouter un archétype = remplir un objet, la forme exacte est garantie par le gabarit ; 3. **les MESURES sont calculées** : scorer du Livrable → 0-100 → palier déterministe (≥65 fort / 40-64 équilibré / <40 doux) → texte du registre dim × palier. Ton : simple et littéral, jamais mécanique — « Ton point de vigilance » clôt l'intro, « Ce ne sont pas des défauts — juste ce qui émerge quand… » referme les freines, « À garder en tête : … » encadre En couple, « Non parce que…, mais parce que… » pose Ton équilibre.

**Contenu (18 archétypes réécrits)** : `quete-1-1-arche.ts` (7) + `quete-1-2-arche.ts` (5) + `quete-1-3-arche.ts` (6). **V3 « L'Étoile sociale » = texte verbatim du fondateur** (coquilles corrigées : « de celles et ceux », « ce qui émerge », « Tu apprécies » — pas de mélange tu/vous) ; devise retenue : « Je découvre, je connecte, je fais circuler l'énergie. ». Les 11 autres suivent le même moule, ancrés sur les cartes verbatim (aucun segment ≥ 60 caractères recopié).

**Écran (Quete.tsx)** : la révélation en 6 pas, l'auto-validation (« Ça me ressemble »), le langage relationnel et les conseils SORTENT de l'écran (plus simple, plus littérale — l'exemple fait foi) ; H1 = « 🎉 Ton profil : {nom} » ; tendances = « {nom} — {pct}/100 ({palierLabel}) » avec barre visuelle et texte ; NOTA_BARRES ; la suite (cliffhanger + CTA + PDF) conservée en clôture. **quetes.ts** : `genre` sur DimDef + `labelPalier()` (accords « très présente / très présent », « équilibrée/équilibré », « plus discrète/plus discret » — PALIER_LABELS retiré), `NOTA_BARRES`, `titreTendances()` (cinq/deux/trois selon la quête), 5 textes d'accompagnement 1.1 repris verbatim du gabarit fondateur (O-fort, C-éq, E-fort, A-doux, S-fort). Les données langage/leviers/lectures RESTENT dans les modules (matching futur).

**PDF (pdf-resultats.ts)** : même gabarit, même ordre, mêmes mots que l'écran — Ma carte → Ton profil : {nom} → 4 volets → Tes N tendances (score + barre + palier) → À noter → La suite. **Styles** : famille `.q-profil-*` (intro, devise exergue, 4 blocs cartes, nota sable).

**Déploiement + preuves (agent-browser, STAGING, compte jetable ResTest35, purgé après — 0 résidu D1 vérifié, compte fondateur préservé)** : staging Version `01841725-4a95-4f71-824f-de9bbd534b3b` (bundle `index-CWFOqkhA.js`, 11 chaînes du gabarit vérifiées dans le bundle servi). Simulation bun important les modules réels → **les chiffres EXACTS de l'exemple fondateur : 78/48/75/38/73 → V3** ; écran vérifié ligne à ligne (H1, intro verbatim, devise « Je découvre, je connecte, je fais circuler l'énergie. », 4 volets, 5 tendances aux bons chiffres et bons paliers — très présente ×3, équilibrée, plus discrète — NOTA verbatim, suite + CTA « Découvrir ma façon de m'attacher ») ; **généralité prouvée** : carteId basculé V3→V5 « L'Intense » (même gabarit, intro/devise propres) et quête 1.2 injectée (71/21 → « La Vigie », « Tes DEUX tendances », accords MASCULINS « très présent / plus discret ») ; PDF écran + PDF Parcourus sans erreur ; zéro erreur page (seule warning Turnstile connue) ; zéro overflow 390/1280 ; captures mobile/desktop conformes.

**Git** : main `998d3ad` + archive `archive/v1-2026-10-05` `11b09dc` — triple sauvegarde à jour (miroir vérifié vide : git diff main archive:WAIRYU-Dating-v2 = ∅).

**Prochaine** : validation fondateur sur STAGING → prod SUR AUTORISATION (17-b) → monde 2.

## 2026-10-08 (7) — Task 36 : les détails d'une quête terminée à UN tap (deep-link #/quete/{id}/resultats)

**Constat fondateur** : « sur application mobile, lorsque nous terminons une quête, nous n'avons pas les détails de cette quête, mais le bouton de téléchargement PDF de cette quête [est là] ». Diagnostic confirmé sur les bundles déployés : PROD = Task 26 (aucun bouton « Voir mes résultats en détail », aucun PDF — tout ce qui a été construit Tasks 27→35 n'existe QUE sur staging) ; et sur staging même, depuis Parcourus « Tes résultats », les détails exigeaient deux étapes (Relire ma carte → Voir mes résultats en détail).

**Correctif (Task 36, staging-first)** : 1. **Deep-link `#/quete/{id}/resultats`** (App.tsx readRoute + Route.resultats, Quete.tsx prop `resultatsInitiale`) : une quête TERMINÉE s'ouvre DIRECTEMENT sur la vue détaillée « 🎉 Ton profil : {nom} » — sans effet si la quête n'est pas terminée (cours normal) ; 2. **Parcourus « Tes résultats »** : chaque quête porte désormais « Voir mes résultats en détail » en action PRINCIPALE (accent, deep-link), avec « Relire ma carte » et « Télécharger le PDF » conservés — les détails complets sont au même endroit que le bouton PDF, en un tap. L'onglet Quête conserve la reprise au point d'arrêt (jamais les détails d'office).

**Preuves (E2E local complet, wrangler dev --local, mobile 390×844, compte jetable DetailsMobile36 — base LOCALE uniquement)** : passation 1.1 (50 réponses) → carte « L'Équilibriste » (V7 conforme) → détails en 1 tap depuis la carte (6 sections) → PDF généré sans erreur → Parcourus : 3 boutons (Voir mes résultats en détail / Relire ma carte / Télécharger le PDF, href #/quete/1.1/resultats) → clic → détails DIRECTS (detailsVisible=true, carteVisible=false) → deep-link à FROID (reload) → détails directs → « Relire ma carte » → carte intacte → onglet Quête → briefing 1.2 (reprise normale préservée) → desktop 1280 identique → zéro overflow 390/1280, zéro erreur page.

**Git** : commit `8b2b93a` (local — PAT perdu au reset, push à reprendre dès token). STAGING NON redéployée (credentials Cloudflare perdus au 6ᵉ reset) — PROD NON TOUCHÉE (17-b).

**Prochaine** : token Cloudflare temporaire → deploy staging (Task 36 + Tasks 28-35 y sont) → validation fondateur → mise en prod DES TASKS 27→36 SUR AUTORISATION EXPLICITE (c'est LA correction que voit l'application mobile, qui sert aujourd'hui la Task 26 sans détails ni PDF) → push GitHub dès PAT.

## 2026-10-08 (8) — Credentials fondateur réceptionnés : déblocage complet (staging + GitHub + Brevo)

**Contexte** : au 6ᵉ reset sandbox, TOUTES les credentials locales avaient été perdues (token Cloudflare, PAT GitHub, fichier SECRETS) — le correctif Task 36 (`8b2b93a`) restait bloqué en local, ni déployé ni poussé. Le fondateur a transmis : token Cloudflare, clé Brevo, credentials Cloudinary (provisionnement), PAT GitHub.

**Vérifications (avant usage)** : token Cloudflare `tokens/verify` → actif, expire 2026-12-30 ; compte `a6ad9b4a…ec22` (« Wairyu26@gmail.com's Account ») accessible avec `GET /accounts` ✓. Clé Brevo → `GET /v3/account` OK (plan free 300/j, Georges Aurelien — Wairyu, Yaoundé) ; expéditeur vérifié `wairyu26@gmail.com` actif ✓. PAT GitHub → `git ls-remote` OK (scope repo unique).

**Secrets ré-assis (wrangler secret put, AUCUN déploiement de code)** : `BREVO_API_KEY` (clé fraîche du fondateur) + `EMAIL_FROM=wairyu26@gmail.com` sur **staging ET prod** — sur prod, secrets inertes tant que le code auth n'y est pas déployé (17-b respecté : prod reste Task 26, en ligne, non touchée). `ADMIN_TOKEN` staging REPOSÉ (nouvelle valeur hex 64 — l'ancienne était perdue au reset ; documentée dans /home/z/SECRETS-WAIRYU-LOCAL.txt) → le bypass smokes `/api/auth/otp/request` (Bearer admin → devCode) refonctionne. Fichier `/home/z/SECRETS-WAIRYU-LOCAL.txt` reconstitué (chmod 600, HORS dépôt) : Cloudflare, Brevo (+ clé MCP base64), Cloudinary (nm7lozr4 — provisionné, l'app ne s'y branche PAS à ce jour), PAT GitHub, ADMIN_TOKEN staging.

**Déploiement STAGING** : `deploy.sh staging` OK — typecheck vert, build Vite, migrations (« No migrations to apply »), Worker **Version ID `9791c1ef-db63-4c95-8cc2-1e4792684b34`** (bundle `index-Dsp4yqkQ.js`, chunk `pdf-resultats-CgIA6YGo.js` servi 200). Le correctif Task 36 (Tasks 27→36) est ENFIN en ligne sur staging.

**Git (triple sauvegarde rétablie)** : `main` poussée `9663a7d → a03af94` (Task 36 feat + docs) ; miroir `v2-reconstitution-task28` re-synchronisé sur `a03af94` ; `archive/v1-2026-10-05` intacte. Credential helper store (PAT dans ~/.git-credentials, hors dépôt).

**Preuves (agent-browser, STAGING, 390×844 + 1280×900, compte jetable e2etask36-…@test-wairyu.local créé VIA LE BYPASS admin — Brevo configuré, mode dev OTP désactivé)** : état quête 1.1 injecté (58 réponses all-5s → V7 « L'Équilibriste ») → deep-link `#/quete/1.1/resultats` → détails DIRECTS (« Ton profil : », carte, tendances, barres /100, bouton document personnel — PAS la vue carte) → reload à FROID sur le deep-link → détails directs conservés → Parcourus « Tes résultats » : **« Voir mes résultats en détail » (a[href=#/quete/1.1/resultats]) en action PRINCIPALE + « Relire ma carte » (#/quete/1.1) + « Télécharger le PDF »** — capture mobile conforme → PDF cliqué, zéro erreur, pas de busy résiduel → « Relire ma carte » → vue carte intacte → Mondes puis #/quete/1.2 → reprise normale (briefing « Quête 2 sur 3 », JAMAIS les détails d'office) → desktop 1280 : détails directs, zéro overflow 390/1280, **zéro erreur page**.

**Purge** : compte e2etask36 supprimé de D1 staging (device_push_subscriptions 0, sessions 1, notification_events 1, devices 1, auth_codes 1, users 1 — vérif post-purge : 0 users / 0 sessions / 0 devices / 0 notifs ; compte fondateur préservé).

**Prochaine** : validation fondateur sur STAGING (https://wairyu-staging.wairyu.workers.dev — l'app mobile y verra DÉSORMAIS les détails d'une quête terminée à 1 tap + le PDF) → mise en prod DES TASKS 27→36 SUR AUTORISATION EXPLICITE (c'est elle que sert l'application Android aujourd'hui, toujours Task 26 sans détails) → monde 2.

## 2026-10-08 (9) — FEU VERT fondateur : PROD déployée — les Tasks 27→36 sont EN LIGNE

**Autorisation** : « feu vert » explicite du fondateur (règle 17-b honorée — staging validé la session précédente).

**Déploiement PRODUCTION** : `deploy.sh production` OK — typecheck vert, build Vite, migrations D1 prod, Worker `wairyu` **Version ID `117b37f1-7f77-42a1-aad1-877c6a08493b`**, 8 assets uploadés. Bundle servi `index-Dsp4yqkQ.js` — IDENTIQUE au staging validé (même hash = même code).

**Preuves (curl + agent-browser, prod)** : `/api/health` 200 (`env:"production"`) ; bundle prod contient « Voir mes résultats en détail » (×2), route `/resultats`, « Ton profil » (×2), « Télécharger le PDF » (×1) ; chunk lazy `pdf-resultats-CgIA6YGo.js` référencé ×2 dans le bundle et servi 200 ; `/.well-known/assetlinks.json` 200 (TWA Android intacte). Browser smoke mobile 390×844 : accueil rendu (logo, « Commencer », carte notifications « Serveur push : prêt »), **zéro erreur page, zéro overflow**, capture .e2e-prod-accueil-390.png.

**Pas de compte de test sur prod** (assumé) : le bypass OTP admin n'existe qu'en staging et la création d'un compte réel polluerait D1/Brevo prod — le flux complet (détails 1 tap + PDF + deep-link froid + Parcourus) a été prouvé E2E sur staging avec le bundle identique (entrée précédente). L'app Android TWA servira le correctif SANS mise à jour du store (PWA wrapper — l'app charge prod en direct).

**Conséquence fondateur** : sur l'application mobile, après une quête terminée, Parcourus « Tes résultats » offre désormais « Voir mes résultats en détail » (1 tap → détails complets : profil, tendances/barres, document personnel) + « Relire ma carte » + « Télécharger le PDF ». Relancer l'app suffit — aucune installation requise.

**Prochaine** : monde 2 (reprise du plan) ; Cloudinary reste provisionné (non branché).

## 2026-10-09 — Task 37 : LE MONDE 2 « LE VOLANT » — les 7 quêtes 1.4 → 1.11 en ligne sur staging

**Demande fondateur** : « lance le Monde 2, inspire-toi de ce qui est présent sur GitHub par rapport à ce monde » — les Livrables verbatim de l'archive v1 (branche `archive/v1-2026-10-05`, dossier `Livrable des mondes/M2-*`) sont la source officielle.

**Reconstitution (7ᵉ reset sandbox au démarrage de la task)** : repo re-cloné depuis GitHub (triple sauvegarde a encore sauvé la mise), SECRETS-WAIRYU-LOCAL.txt reconstitué, livrables M2 extraits vers /tmp (7 dossiers, ~430 Ko).

**Contenu (7 agents parallèles, extraction verbatim)** : `quete-1-4.ts` (8 items Likert mono-dim `autocontrole`, graine 214427, doublon Q1.4-01.r JAMAIS affiché, 5 cartes L'Artisan·e → L'Immédiat) · `quete-1-5.ts` (⚡ 6 choix binaires A immédiat/B différé, ordre canonique, IMP_B = n_A/6, 5 cartes par nombre de différés) · `quete-1-6.ts` (7 items + 3 ÉNIGMES hors mélange É1→É3, sélecteur D×E, 5 cartes) · `quete-1-7.ts` (ÉCRAN SPÉCIAL SANS CARTE : checklist opt-in 6 options + un-clic binaire, « Je ne souhaite pas le dire » première classe, écran de confiance verbatim) · `quete-1-9.ts` (8 items ÉTAT, 3 besoins autonomie/affiliation/compétence, carte UNIQUE « La Météo du moment ») · `quete-1-10.ts` (10 items, 5 dims × 2 paires miroir R6, anti auto-flatterie, 3 cartes) · `quete-1-11.ts` (QUÊTE-ÉCRAN DE PASSAGE : 3 questions, ordre scénario fixe, 3 chemins de sortie TOUS DIGNES, zéro score zéro carte) — chacun + module archétypes gabarit Task 35 (sauf 1.7/1.11 sans cartes) + entrée de registre DEF (dims, accompagnement, conseils, ombreRelationnel, suite/cliffhanger).

**Intégration (orchestrateur)** : contrat étendu dans quetes.ts — `IdQuete` 1.1→1.11, `ItemPassation` unifié (likert/choix/question), `format` par quête, `sansCarte`, `mondeDeQuete()` ; registre QUETES ×10 (numérotation 1.x traverse M1/M2 — 1.8 n'existe pas au Livrable) ; registres PLUS (vides, matching futur) + ARCHE étendus (quetes-plus.ts) ; `titreTendances` singulier accordé (« Ta tendance ») ; marquerTerminee accepte carteId null.

**Écrans (Quete.tsx)** : passation MULTI-FORMAT — Likert (échelle 5) · choix binaire (2 grandes options « Maintenant / Plus tard ») · question à options (mono ou CHECKLIST multi avec bitmask + « Valider ma sélection ») · sélecteur de CHEMIN 1.11 après les 3 questions (③ l'emporte si choisi) · phase `ecran` finale pour 1.7 (écran de confiance + rappel des réglages décodés) et 1.11 (SORTIES_111 du chemin choisi) — aucune carte, aucun PDF (exemptés Livrable). Briefing : échelle affichée seulement pour les formats Likert, textes « comment tu vas répondre » par format. Chip de monde dynamique (Monde 2 — Le Volant), profil de voyage sur les 10 quêtes.

**Déblocage séquentiel** : voyage.ts M2 `status: open` ; Mondes passe `deverrouille` à WorldModal (M2 ouvert ⇔ les 3 quêtes du Miroir terminées — CTA verrouillé sinon) ; `onEnterQuest` pour M1+M2 → `prochaineQuete()` atterrit sur 1.4. Parcourus : 10 hooks, gardes sans-carte (« Revoir mon écran » au lieu des 3 boutons carte/PDF). PDF : nom du monde dynamique.

**Preuves (agent-browser, STAGING version `4802417a`, mobile 390×844 + desktop, compte jetable e2em2 — purgé après, 0 résidu vérifié)** : M1 injecté (all-5s) → Mondes → fiche Le Volant → CTA → `#/quete/1.4` (chip Monde 2 — Le Volant, annonce verbatim « muscle invisible ») → 1.4 passée (8 items) → carte « Le·La Vivant·e » (score réel 0.5 → V3, sélecteur conforme) → détails : gabarit 35 complet (« 🪞 Ta tendance » SINGULIER, barre 50/100, intro/devise/apportes/freines/couple/équilibre, CTA « Passer l'épreuve du temps ») → PDF sans erreur → 1.5 (6 choix A) → carte « Le·La Main qui cueille » (c=0 → V1 impulsif, mapping vérifié ; barre 100/100) → 1.6 (7 items + 3 énigmes aux réponses correctes) → carte « Les Deux Mains » (sélecteur D×E) → 1.7 (checklist 2 options cochées + Valider, binaire) → écran « Merci pour ta confiance. » + rappel des réglages décodés → 1.9 (8 items) → carte unique « La Météo du moment » + 3 barres (67/50/67) → 1.10 (10 items) → « L'Échelle » (V2) → 1.11 (3 questions) → sélecteur de chemin (3 sorties verbatim) → chemin ③ → écran de sortie verbatim + CTA Retour à mon voyage ; Parcourus : 8 items avec les bons boutons (1.7/1.11 = « Revoir mon écran » ; 1.2/1.3 absents = artefact de l'injection sans carteId — l'app pose TOUJOURS la carte à la complétion réelle) ; deep-link FROID #/quete/1.4/resultats → détails directs ; desktop 1280 identique ; zéro overflow 390/1280 ; zéro erreur page ; captures .e2e-m2-*.png.

**Déploiement** : staging Version `4802417a-b371-4fc4-ae8a-fcf64a06498a` (bundle `index-DN5ySGQu.js`). ADMIN_TOKEN staging reposé (valeur perdue au 7ᵉ reset — documentée). PROD NON TOUCHÉE (17-b) : la prod sert toujours Tasks 27→36 (Monde 1).

**Prochaine** : validation fondateur sur STAGING (tout le Monde 2 jouable après le Monde 1) → mise en prod SUR AUTORISATION → monde 3 « La Boussole » (2.1 → 2.8, même méthode).

## 2026-10-09 — Task 38 : LE MONDE 3 « LA BOUSSOLE » — les 8 quêtes 2.1 → 2.8 en ligne sur staging + AUDIT de conformité M1/M2

**Demande fondateur** : « démarre le Monde 3, assure-toi que ça respecte les exigences de ce qui se trouve dans GitHub (Livrable des mondes, archive/v1-2026-10-05) et vérifie si les mondes précédents respectent aussi ces livrables ».

**Audit de conformité M1/M2 (2 agents, comparaison mécanique caractère par caractère)** : verdict **CONFORMES, 0 bloquant**. M1 : 50/12/20 énoncés verbatim, trames sécurité (DTM_N / DTM_M+RSQ / DE_U+DE_C) jamais affichées, PASSATION graines 211427/212427/213427 exactes, scorers/sélecteurs/cartes verbatim, zéro recopie du 07-miroir. M2 : 7 quêtes conformes (verbatim items/options/énigmes/chemins, graines 214427/216427/219427/220427, écran de confiance et écran de passage verbatim). **Écarts corrigés** : 2 segments du 07-miroir 1.5 recopiés quasi tels quels (102 et 71 caractères) reformulés ; titre 1.7 rétabli « Ton fonctionnement (optionnel) » ; en-têtes 1.1-1.3 corrigés (trames SÉCURITÉ, pas fiabilité). **Points arbitrés au fondateur (documentés, non modifiés)** : labels Likert 1.2/1.3 (le livrable dit « Pas du tout comme moi », l'app rend les labels 1.1 « Pas du tout moi » — uniformisation assumée depuis la validation staging) ; le pied « 🤝 {Z} personnes attendent… » des cartes n'est pas rendu (donnée moteur non implémentée) ; préfixes « V1 — » non rendus (métadonnées d'ordre) ; tags Maintenant/Plus tard ajoutés aux choix 1.5 ; deck des M1 tronqué des trames (contenus hors dépôt — règle 11-b) : la passation voit 50/12/20 écrans, pas 58/20/26.

**Contenu M3 (8 agents parallèles, extraction verbatim des 8 dossiers M3)** : `quete-2-1.ts` Tes Valeurs (20 items Likert + 4 trames DTM_N HORS dépôt aux pos 4·10·16·24 — jamais affichées, graine 210427, 8 cartes bloc dominant × tension, départage C6) · `quete-2-2.ts` Spiritualité (6 items, 3 paires R6, graine 222427, neutralité ABSOLUE — centrale/culturelle/absente égales en dignité, zéro croyance nommée) · `quete-2-3.ts` Non-Négociables (CHECKLIST 9 lignes rouges + Q2.3-10 champ libre hors moteur, graine 23427, 3 cartes) · `quete-2-4.ts` Réalités (8 UN-CLIC à options verbatim, graine 24427, 2 cartes) · `quete-2-5.ts` Ce que tu cherches (3 binaires + 4ᵉ réponse « Je découvre » + message doux Non/Non/Non verbatim, graine 25428, 4 cartes, QFI jamais exposé) · `quete-2-6.ts` Priorités 5 ans (JEU D'ARBITRAGE 100 points / 5 curseurs, somme verrouillée, AUCUNE valeur par défaut, ordre canonique, 4 profils) · `quete-2-7.ts` Vision de la famille (8 items, 4 paires R6, graine 227427, dealbreaker parentalité MOTEUR SEUL jamais rendu) · `quete-2-8.ts` Ton Signe (BADGE opt-in 1 sélection, 12 signes + « Je préfère ne pas dire » première classe, phrase légère + DISCLAIMER gravé, RÈGLE ABSOLUE : jamais au score/matching) — chacun + module DEF (couche app ton Task 35) + module ARCHES (gabarit 6 champs) sauf 2.8 (exemption documentée).

**Intégration (orchestrateur)** : IdQuete étendu à 2.8, formats ×9 (likert/choix/ecran/likert-enigmes/checklist/clic/binaire/arbitrage/jeu), mondeDeQuete → M3, EtatQuete.textes (champ libre jamais parsé), gates de complétion (Q2.3-valide, Q2.6-valide, Q2.5-intention), écrans CHECKLIST/ARBITRAGE/BADGE + message doux, déblocage séquentiel M3 ⇔ M2 terminé, Parcourus 18 quêtes, PDF/miroir dynamiques. Déblocage : Mondes ne propose « Commencer » sur La Boussole qu'après les 7 quêtes du Volant.

**Preuves (agent-browser, STAGING version `e4eb9320` bundle `index-DFBnTny1.js`, mobile 390×844 + desktop 1280×900, compte jetable e2em3 — purgé après, 0 résidu D1 vérifié)** : fiche M3 verbatim (8 quêtes + « un jeu de 100 points ») → 2.1 jouée (all-5s) → « Le·La Passeur·se d'horizons » (départage C6 vérifié mathématiquement, tension apaisée) → gabarit 35 « Tes quatre tendances » 50/100 (recodage R6 exact), PDF sans erreur → 2.2 → « Le·La Fête des saisons » → 2.3 CHECKLIST : 3 coches + champ libre conservé verbatim → CARTE-2.3-B ; pause/reprise conserve les coches → 2.4 : 8 un-clic → « Le·La Franc·e-jeu » → 2.5 : Non×3 → message doux → « Je découvre » → « Le·La Brouillon·ne de soi » → 2.6 : verrou Σ=100 vérifié, 60/40 → GRUE, équilibré → MAISON → 2.7 → « Le·La Porte entrouverte » → 2.8 : ♌ → badge verbatim + disclaimer ; « Je préfère ne pas dire » → silence digne → Parcourus : 18 entrées correctes → deep-link FROID #/quete/2.1/resultats → détails directs → zéro overflow 390/1280, ZÉRO erreur page, captures .e2e-m3-*.png.

**Déploiement** : staging Version `e4eb9320-34e9-40c7-b550-eded5969caa0`. ADMIN_TOKEN staging reposé (valeur re-documentée dans SECRETS-WAIRYU-LOCAL.txt). PROD NON TOUCHÉE (17-b) : la prod sert toujours Tasks 27→36 (Monde 1).

**Nit UX hérité de M2 (renvoi fondateur)** : une quête sansCarte terminée rouvre DIRECTEMENT son écran — le briefing « Voulez-vous commencer ? » (qui porte « Effacer mes réponses ») n'est plus atteignable pour 1.7/1.11/2.8 ; à arbitrer.

**Prochaine** : validation fondateur sur STAGING (le Monde 3 complet est jouable après le Monde 2) → mise en prod M2+M3 SUR AUTORISATION → monde 4 « Ton terrain » (3.1 → 3.7, même méthode).

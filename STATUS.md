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

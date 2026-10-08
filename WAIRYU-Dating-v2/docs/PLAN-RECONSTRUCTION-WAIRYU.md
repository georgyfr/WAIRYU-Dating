# PLAN DE RECONSTRUCTION WAIRYU — de zéro jusqu'à la fin
> Source : github.com/georgyfr/WAIRYU-Dating · branche `archive/v1-2026-10-05` (v1 complète) + `main` (socle v2)
> Légende : **[R]** réutilisé tel quel · **[A]** adapté (copie + modifications) · **[M]** modèle/référence (on s'en inspire) · **[N]** nouveau à créer
> Périmètre verrouillé : **4 modes** — Classique · Invisible · Interracial (monde) · Événementiel (Moments)

---

## PHASE A — FONDATIONS

### Étape 0 — Cadrage, identité & documents fondateurs (1 session)
**0.1 Verrouiller le périmètre MVP (MoSCoW + 4 modes + liste WON'T)**
- [A] `etapes/etape-00-cadrage/CADRAGE.md` — reprendre et y graver les 4 modes
- [A] `specification/PROJET-WAIRYU-Specification-Produit-v0.2.md` — additions contractuelles
- [R] `docs/V18-RAISON-DETRE.md` — doctrine `raison` = voyage/rencontre/indecis
- [R] `specification/CARTE-CONCEPTION-PROJET-WAIRYU-v1.0.md` + `CARTE-SPECIFICATION-…v1.0.md` — cartes de cadrage

**0.2 Valider les 9 décisions d'architecture Cloudflare**
- [R] `docs/ANALYSE-APPROFONDIE.md` — verdict faisabilité, 8+1 décisions, budget ≤ 70 req/user/jour

**0.3 Documents juridiques + RGPD v1**
- [A] `etapes/etape-00-cadrage/CGU-v1.md`, `POLITIQUE-CONFIDENTIALITE-v1.md`, `REGISTRE-TRAITEMENTS-v1.md`
- [A] `apps/web/public/legal/{cgu.md, politique.md, registre.md}` — versions servies
- [A] `apps/web/public/data-deletion.html` — conformité Data Deletion Meta

**0.4 Identité visuelle v2 (palette fondateur)**
- [A] `apps/web/src/styles.css` (branche main — tokens crème #F5F1E6 · bleu nuit #172C3D · turquoise #45C0C6 · corail #FA6249) + classes `mode-invisible` / `mode-interracial` / `events-mode` depuis la v1
- [A] `apps/web/public/manifest.webmanifest` + `public/icons/*` (main : favicon 16/32/48, icon-192/512, maskable-512, apple-touch-icon)
- [A] `apps/web/public/fonts/nunito-latin-var.v1.woff2` + `nunito-latin-italic-var.v1.woff2` (v1)
- [M] `apps/web/index.html` (v2 : meta theme-color #172C3D)

**0.5 Provisionner comptes & clés (≈ 35 min, 0 €)**
- [R] `docs/GUIDE-ACTIVATION-CLES.md` — Brevo, Google OAuth, Facebook, Turnstile, VAPID, secrets wrangler
- Gate 0 : périmètre 4 modes signé · comptes créés · documents v1 · palette v2 en place

### Étape 1 — Socle technique & infrastructure (2-3 sessions)
**1.1 Monorepo TS strict**
- [A] `package.json` (racine), `tsconfig.base.json`, `.prettierrc`, `.editorconfig`, `.gitignore`
- [A] `packages/shared/src/{index.ts, types.ts, constants.ts}` — squelette des contrats (DiscoveryMode à 3 valeurs, ConversationOriginMode, limites quotas)

**1.2 Squelette API Hono (Worker unique = API + front)**
- [A] `apps/api/{package.json, tsconfig.json, wrangler.toml}` — bindings ASSETS/DB/CONFIG, DO ChatRoom, cron `10 3 * * *`, envs prod/staging
- [A] `apps/api/src/{index.ts, env.ts}` — montage, typage des bindings
- [A] `apps/api/src/lib/errors.ts`, `middleware/cors.ts`, `middleware/usage.ts`
- [A] `apps/api/src/routes/health.ts` — `/api/health` + `/api/version`

**1.3 Sessions HMAC + premières migrations**
- [A] `apps/api/src/lib/session.ts` + `middleware/session.ts` — cookie `wairyu_s` HMAC, TTL glissant 30 j
- [A] `apps/api/migrations/0001_core.sql` (users, sessions, rate_limits, account_deletions) + `0002_metrics.sql` (metrics_daily)

**1.4 Front PWA servi par le même Worker**
- [A] `apps/web/{package.json, vite.config.ts, tsconfig.json, postcss.config.cjs, index.html}`
- [A] `apps/web/src/{main.tsx, App.tsx, styles.css}` — hash routing + tokens v2
- [A] `apps/web/src/components/TabBar.tsx` — sticky safe-area iOS
- [A] `apps/web/src/screens/{Welcome, Discover, Messages, Profile}.tsx` (branche main — écrans v2)
- [A] `apps/web/src/lib/{api.ts, swr.ts, toast.tsx}` — mini-SWR + toasts
- [A] `apps/web/public/{robots.txt, _headers, sw.js}` — SW minimal push-only

**1.5 Déploiement + dashboard usage**
- [R] `deploy.sh` — typecheck → vite build → migrations D1 → wrangler deploy
- [A] `apps/api/src/routes/admin.ts` — `/admin/usage` seul au début (Bearer ADMIN_TOKEN)

**1.6 Provision Cloudflare**
- D1 `wairyu-prod`/`wairyu-staging`, KV `wairyu-config-*`, secret `SESSION_HMAC_KEY` (64 hex), `ADMIN_TOKEN` — procédure [R] `docs/GUIDE-ACTIVATION-CLES.md`
- Gate 1 : `*.workers.dev` répond (2 envs) · typecheck strict vert · usage visible

---

## PHASE B — CŒUR MVP

### Étape 2 — Authentification & comptes (2 sessions + 2-bis social)
**2.1 OTP email + Turnstile + rate limiting**
- [A] `apps/api/src/lib/{otp.ts, email.ts, turnstile.ts, ratelimit.ts, auth.ts}` — OTP SHA-256 hashé TTL 10 min, 3 essais, anti-énumération ; ~40 règles RATE_RULES
- [A] `apps/api/src/routes/auth.ts` — `/api/auth/config|otp/request|otp/verify|me|logout…`
- [A] `apps/api/migrations/0003_auth.sql` — auth_codes, rate_limits extensions

**2.2 Sessions révocables + RGPD immédiat**
- [A] `apps/api/src/routes/auth.ts` — logout/logout-all, `GET /account/export` (JSON), `DELETE /account` + trace anonyme J+30

**2.3 OAuth Google (PKCE) + Facebook (data-deletion) + TWA**
- [A] `apps/api/src/lib/{google.ts, facebook.ts}` — appsecret_proof, fusion par email vérifié
- [A] `apps/api/migrations/0004_oauth.sql` — oauth_identities
- [A] `apps/web/src/screens/FacebookComplete.tsx`, `components/AuthAlt.tsx`

**2.4 Pseudo + mot de passe (2-quater)**
- [A] `apps/api/src/lib/{password.ts, age.ts}` — PBKDF2-SHA256 100k, verrou 15 min, âge 18+ bloqué (triggers 0023)
- [A] `apps/api/migrations/0017_auth_password.sql` + `0019_username_canonical.sql` + `0023_safety_aggregate.sql` (triggers âge)
- [A] `apps/web/src/screens/{Signup, Login, SignupEmail, LoginEmail, Recover, Reset, Verify}.tsx`
- [A] `apps/web/src/lib/{turnstile.tsx, otpRelay.ts}` + `components/PushBanner.tsx` (OTP via push chiffré)
- Gate 2 : smoke 18 assertions + parcours mobile 390×844 (OTP → session → suppression)

### Étape 3 — Profils & photos protégées (2-3 sessions)
**3.1 Profil guidé + consentements horodatés**
- [A] `apps/api/src/routes/profiles.ts` + `lib/profile.ts` — GET/PUT profile, prompts (PROMPT_LIBRARY ×9), consentement orientation dédié
- [A] `apps/api/migrations/{0005_profiles.sql, 0006_profile_date_location_intents.sql, 0007_safe_rebuild_users.sql}` — geo 1/10°, birth_date ISO
- [A] `apps/api/src/routes/geo.ts` + `apps/web/src/lib/geo.ts` — reverse Nominatim 30/h
- [A] `apps/web/src/screens/{Profile, MyProfile}.tsx` — assistant 6 étapes

**3.2 Pipeline photos Cloudinary (jamais de contact front→Cloudinary)**
- [A] `apps/api/src/lib/cloudinary.ts` — signature `base64url(SHA1(to_sign+secret))[0:8]`, `/authenticated/`, flou `w_400`
- [A] `apps/api/src/routes/profiles.ts` — presign/upload/reorder/delete + `GET /photos/:id/url` (autorisation par photo, matrice Invisible=403)
- [A] `apps/web/src/lib/photo.ts` — recadrage 4:5, 1024×1280, WebP q0.82 (~300 Ko)
- [M] `docs/STOCKAGE-CLOUDINARY.md` — stratégie + sondes V1-V9
- [R] `scripts/virtual_photos*/` — 12 personnages de test

**3.3 Préférences de découverte**
- [A] `apps/api/migrations/0005_profiles.sql` (user_preferences) + `0018_pref_orientation.sql`
- [A] `apps/api/src/routes/profiles.ts` — GET/PUT preferences (mode_default, âges, distance, intents, orientation)
- Gate 3 : smoke 35/35 — **impossible d'accéder à une photo Invisible non autorisée même en devinant l'URL**

### Étape 4 — Questionnaire progressif & moteur de matching (2-3 sessions)
**4.1 Banque N1 (12) / N2 (18) + sauvegarde par réponse**
- [A] `apps/api/migrations/0009_questionnaire.sql` — q_items versionnée, q_answers
- [A] `apps/api/src/routes/questionnaire.ts` — GET /q, PUT /q/answers/:itemId, GET /q/insights
- [A] `apps/web/src/screens/Questionnaire.tsx` — progression + récompense « Ma personnalité »

**4.2 Moteur de score déterministe + 8 archétypes**
- [A] `packages/shared/src/matching.ts` — PSYCHOMETRY pondérée (Valeurs .26 · Objectifs .21 · Communication .16 · Personnalité .16 · Besoins émo. .11 · Préférences .10), deal-breakers exclusifs, tolérance ±2, `PSYCHOMETRY_OVERRIDE`
- [A] `packages/shared/src/personality.ts` — 8 archétypes (Bâtisseur… Épicurien), N1 ≥ 10 réponses, matrice d'affinité
- [A] `packages/shared/src/vigilance.ts` — 14 signaux moteur-seul (DTM_N…DE)
- [A] `apps/api/migrations/{0010_personality.sql, 0011_personality_prefs.sql}` — personality_profiles, pref_types max 4

**4.3 Explicabilité « Pourquoi ce match ? »**
- [A] `packages/shared/src/matching.ts` — 2 forces + 1 vigilance + sujets de conversation + avertissement
- [A] `apps/api/src/routes/personality.ts` + `apps/web/src/screens/PersonalityProposal.tsx` (« C'est moi ✓ »)
- Gate 4 : smoke 33/33 — score ≥ 85 sur réponses identiques · deal-breaker exclu · feed < 300 ms

### Étape 5 — Découverte TRI-MODE + Héritage + Moments (2-3 sessions)
**5.1 Moteur de découverte (Classique · Invisible · Interracial)**
- [A] `apps/api/src/lib/discovery.ts` — bassins étanches, `LIMIT 300` sur la sous-requête, FNV-1a(score stable/paire/jour), `worldwide = myMode === 'interracial'`
- [A] `apps/api/src/routes/{discover, feed}.ts` — feed, swipe, rewind, quota, likes, presence
- [A] `apps/api/migrations/0012_discovery.sql` — swipes (UNIQUE), matches (a<b, origin), top_matches
- [A] `apps/web/src/screens/{Discover, Likes, Matches}.tsx` — pile 3 cartes, onglets 🔥⚡💬👤, deep-links `#/discover/classique|invisible|interracial`
- [A] `apps/web/src/lib/mode.ts` — un seul écrivain, `body.mode-{invisible,interracial}`

**5.2 Handshake Invisible + passerelle consentie (§4.8)**
- [A] `apps/api/src/routes/discover.ts` — invisible-request/respond, inbox, matches/:id/gateway+respond
- [A] `apps/web/src/lib/conv-origin.ts` — chip d'origine (classic/invisible/interracial)

**5.3 Wairyu Cultures — Profil d'Héritage (mode Interracial)**
- [A] `apps/api/src/lib/heritage.ts` + `apps/api/migrations/0016_heritage_profile.sql` — 7 sections (langues, origines, ouverture, traditions, valeurs, projets interculturels, affinités)
- [A] `apps/web/src/screens/Heritage.tsx` + `lib/heritage-data.ts`

**5.4 Wairyu Moments — univers événementiel parallèle (aperçu)**
- [A] `apps/web/src/lib/{events-mode.ts, events.ts}` — store module-level, `body.events-mode` turquoise, EV_EVENTS badgé « aperçu »
- [A] `apps/web/src/screens/{Events, MyEvents, CreateEvent, Moments}.tsx` — Découvrir · Mes events · Créer · Moments
- [A] `apps/web/src/components/{EvCheckin, EvMissed, EvModeSwitch}.tsx`
- [A] `apps/web/src/components/TabBar.tsx` — 6 onglets + bascule nav événementielle

**5.5 Top Compatibilité + V18 « ouvrir la rencontre »**
- [A] `apps/api/src/index.ts` (scheduled : computeDailyTop cap 200) + `routes/admin.ts` (/run-top)
- [A] `apps/api/migrations/0024_v18_raison.sql` — raison/raison_activation + index partiel
- [A] `apps/web/src/screens/ActivationRecherche.tsx` — 3 cartes équivalentes
- [R] `docs/V18-RAISON-DETRE.md` + `ci/test_v18_raison.py` (23 verrous)
- Gate 5 : smoke 68/68 — match Classique E2E · handshake E2E · bascule §4.8 sans perte · 3 bassins étanches

### Étape 6 — Chat temps réel & révélation (3-4 sessions — le plus gros)
**6.1 Durable Object ChatRoom (SQLite + WS hibernation)**
- [A] `apps/api/src/do/chat-room.ts` — messages/reads/meta, anti-spam 30/min, modération pré-livraison, /summary, /system, /shutdown, /init reset:true, purge RGPD 365 j (alarmes)
- [A] `apps/api/migrations/0013_chat.sql` — conversations (mode pilote le flou), revelations (1 pending), blocks
- [A] `apps/api/src/routes/chat.ts` — conversations, ws-ticket (HMAC 120 s), ws upgrade, history paginé, state

**6.2 Écrans chat + rituel de révélation**
- [A] `apps/web/src/screens/{Chat, Messages, Revelation}.tsx` — optimiste, ✓✓, anneaux 15 msg/7 j, double confirmation
- [A] `apps/web/src/components/MessageToasts.tsx` — toasts WhatsApp-like
- [A] `apps/api/src/routes/chat.ts` — reveal/respond/feedback/unmatch (re-floutage implicite)

**6.3 Voice notes**
- [A] `apps/api/src/routes/chat.ts` (POST /voice) + `lib/cloudinary.ts` — ≤ 60 s / 512 Ko, `video/authenticated`, URL signée à la volée

**6.4 Web Push VAPID 100 % maison**
- [A] `apps/api/src/lib/push.ts` — JWT ES256 + aes128gcm depuis clés brutes, TTL 2419200, cleanup **410-only**
- [A] `apps/api/src/routes/push.ts` + `apps/api/migrations/0020_push_preferences.sql` — subscribe/unsubscribe/test/welcome/preferences
- [A] `apps/web/public/sw.js` — anti-doublon postMessage, tap MessageChannel + fallback `?wv=`
- [A] `apps/web/src/lib/{push-client.ts, otpRelay.ts, appVersion.ts, whatsnew.ts, open-in-app.ts}` + `components/{PushBanner, NotificationGate, InstallGate, UpdateToast}.tsx`
- [M] `apps/pushecho/{index.js, wrangler.toml}` + `apps/pushecho-pages/*` — pots de test push (contournement anti-boucle workers.dev)
- Gate 6 : smoke 58/58 + sonde WS Node 10/10 · révélation E2E refus→accord · unmatch+blocage · re-floutage vérifié

### Étape 7 — Sécurité & modération (2-3 sessions)
**7.1 Modération par règles 0-neuron**
- [A] `apps/api/src/lib/moderation.ts` — normalisation anti-leet, familles haine(65)/harcèlement(55)/drogues(25)/scam(30-45) → deliver <35 ≤ flag <70 ≤ block
- [A] `apps/api/src/lib/trames.ts` + env `TRAME_*` — 60 formulations hors dépôt, `trame_absente` exclut des signaux

**7.2 Vérification selfie + badge**
- [A] `apps/api/src/routes/safety.ts` — verification/start (3 poses mélangées Fisher-Yates)/submit, TTL 48 h
- [A] `apps/web/src/screens/Verify.tsx`

**7.3 Signalements → sanctions → recours + check-ins**
- [A] `apps/api/src/routes/safety.ts` — reports (7 catégories, blocage mutuel immédiat), checkins, settings/privacy
- [A] `apps/api/migrations/{0014_safety.sql, 0023_safety_aggregate.sql}` — report_aggregate (exclusion signaleurs en série), auto_blocked_at COALESCE

**7.4 Backoffice admin + 2FA TOTP**
- [A] `apps/api/src/lib/totp.ts` (RFC 6238 maison, KV `admin:2fa`) + `routes/admin.ts` — verification-queue, reports, flags, checkins, multi-accounts, sanctions/appeals, 2fa setup/activate/disable, `X-Admin-TOTP`
- Gate 7 : smoke 56/56 + régression 35/24/33/68/58 verte — scam BLOQUÉ, badge visible, 2FA complète

### Transversal après Étape 7 — TWA Android
- [A] `apps/twa/{twa-manifest.json, build.gradle, settings.gradle, gradle.properties, app/}` — packageId com.wairyu.app, autoVerify, DelegationService
- ⚠️ **[N] keystore à générer hors dépôt** (leçon v1 : `apps/twa/keystore/wairyu-upload.keystore` était committé avec mot de passe en clair)
- [A] `apps/web/public/{app.html, go.html, .well-known/assetlinks.json}` + `public/app/wairyu.apk` — bascule navigateur→app

---

## PHASE C — SYSTÈME DE CONTENU (le questionnaire doctrinal)

### C1 — Constitution (session zéro du contenu)
- [R] `salle-prompts/constitution.v2.1.md` — 11 sections : doctrine mesuré-pas-deviné, lumière/ombre/égalité, non-diagnostic, consentement structurel, langue R1-R21, glossaire des 13 signaux, voyage, freemium (6 mondes gratuits / 5 premium), étages, verrous humains, brûlage 11-b

### C2 — Contrat d'inventaire (source unique)
- [A] `contrat/contrat-inventaire.v1.3.md` — 13 parties + 3 annexes : invariants (11 mondes · 51 quêtes · 570 items = 540 carte + 30 trame fiabilité · 14 codes signaux · 60 trames hors dépôt), règles R1-R7
- [R] `contrat/registres/{signaux.json, liaisons.json, dyades.json}` + `registres/signatures/` — registres vivants

### C3 — CI du contrat
- [R] `ci/test_contrat_inventaire.py` — les 17 vérifications CI-01→CI-17 (équation 570=540+30, sha256, mélange rejoué, anti-trames)
- [R] `ci/harnais_p0.py` — 12 vérifications runtime
- [R] `ci/outils/{melange.py, melange-biaxes.py, melange-heritage.py, garde_p0.py, balayage_codes_rendu.py, balayage_interdits_rendu.py, a11y_smoke.py}` — mélange Fisher-Yates seedé 6 contraintes + gardes anti-fuite
- [R] `ci/quetes/*.json` (36) + `ci/manifeste-quete/` — déclarations de structure + manifestes hashés

### C4 — Production des 51 quêtes (ordre : M3 2.1 pilote → M1 → M2 → M4 → M5 → M6/M7 → M8/M9 → M11 → M10)
- [M] `salle-prompts/{A1-items.md, C1-audit-hostile.md, P1-materialisation.md}` — pipeline rédaction → audit hostile en session séparée → matérialisation
- [R] `salle-prompts/schema/fiche-quete.schema.json` — linter JSON Schema draft-07 (5 contrôles bloquants)
- [M] `Livrable des mondes/M3-2.1-Tes-Valeurs/*` — gabarit pilote (10 fichiers : 00-README → 01-tableau → 02-mélange → 03-signatures → 04-slots → 05-intro → 06-computation → 07-miroir + cartes.yaml), puis les 50 dossiers `Mx-y.z`
- [A] `contenu/mondes/M3-boussole/2.1-valeurs/{items.yaml, melange.json, signatures.yaml, slots.yaml, intro.md}` — format runtime machine
- [A] `contrat/fiches-mutation/FM-0xx.md` — toute mutation = une fiche séquentielle ([M] `FM-015/017/019/023/026/027/028-RETROSPECTIVE.md`)

### C5 — Pont runtime vers D1
- [R] `scripts/q_items_runtime.json` — extraction des 48 tableaux (531 items)
- [R] `scripts/gen_seed_sql.py` — générateur avec contrôles bloquants (total 531, codes uniques, placeholder trame sha256 0d90aef5…)
- [A] `apps/api/migrations/{0021_questionnaire_doctrine.sql, 0022_q_doctrine_seed.sql}` — q_doctrine_items/answers/flags

### C6 — Trames sécurité + portraits de domaine
- [A] `apps/api/src/lib/trames.ts` — consommation env `TRAME_*` (règle 11-b : zéro log/cache)
- [M] `portraits/domaines/coeur.md` — gabarit Portrait de Domaine (CROISE, ne répète pas ; BLOC MOTEUR isolé)
- Gate C : CI 17/17 · harnais 12/12 · garde 11-b VERT (768+ fichiers) · balayages rendu verts

---

## PHASE D — MONÉTISATION ÉTEINTE → LANCEMENT → SCALE

### Étape 8 — Monétisation préparée, éteinte (1 session)
- [M] `specification/PROJET-WAIRYU-Specification-Produit-v0.1.txt` §7 — Wairyu+ 19,99 €, IAP, 7 commandements (la sécurité ne se vend pas)
- [N] migration `entitlements` + middleware de flags (`likes_unlimited`, `see_who_liked`, `advanced_filters`, `incognito_plus`, `boost`) — **jamais câblé en v1 (amendement A-1) : c'est un livrable de cette étape**
- [A] `packages/shared/src/constants.ts` — quotas free (50 likes, 10 demandes, 1 super, 1 rewind/jour)
- [N] Stripe Checkout mode test + webhook
- Gate 8 : flag ON → Wairyu+ fonctionne en test · OFF → app 100 % gratuite

### Étape 9 — Qualité, tests & bêta fermée (2-3 sessions + 3-4 semaines)
- [R] `ci/outils/a11y_smoke.py` + `ci/harnais_p0.py` — accessibilité + findings
- [N] tests E2E Playwright (parcours inscription→matching→chat→révélation→suppression)
- [M] `STATUS.md` — KPI bêta (complétion > 60 %, Invisible > 25 %, rétention J7 > 35 %, NPS > 25) ; [R] `docs/ANALYSE-APPROFONDIE.md` (revue budget requêtes)
- [M] `docs/analyses-2026-09-27/*` — benchmarks marché, tarification, projections 3 ans
- Gate 9 : KPI atteints ou plans validés · zéro bug bloquant

### Étape 10 — Lancement francophonie (en continu)
- [A] `apps/web/public/{robots.txt, _headers}` + écran d'accueil `App.tsx` (SEO/landing) + FAQ sécurité
- [M] `specification/…v0.1.txt` — poches urbaines (Douala, Yaoundé, Abidjan, Dakar, Paris, Bruxelles, Montréal), rayon élargi progressif
- [A] `docs/URLS.md` — annuaire des environnements
- [M] `docs/analyses-2026-09-27/charts/*` — visuels d'acquisition
- Gate 10 : 1 000 inscrits · 300 actifs hebdo · dashboards < 70 %

### Étape 11 — Post-lancement : épaississement (Phase 2)
- [A] `apps/api/src/lib/heritage.ts` + `Heritage.tsx` — Wairyu Cultures v1 (filtres culturels Phase 2)
- [M] `apps/api/src/do/chat-room.ts` — Salons Culturels (DO de groupe)
- [M] `specification/…v0.1.txt` phases 3-5 — N3, Coach, événements complets (billetterie QR, Missed Connections), déclencheurs payants (Workers > 70 % 3 j → 5 $/mois ; Cloudinary saturé → R2 ; D1 > 3,5 Go → 5 $)

---

## MÉTHODE TRANSVERSALE (à instaurer dès l'Étape 0)
- [A] `STATUS.md` — tableau 12 étapes + journal append-only (structuré, ≠ v1 lignes de 9 Ko)
- [R] `scripts/push-canon.sh` — 3 verrous : CI verte avant push · token en env éphémère · vérification `ls-remote` après push
- [A] `README.md` (v2) — méthode, phases, 4 modes
- [R] `etapes/etape-0X/*.md` — gabarits de comptes-rendus avec gates cochées
- [R] `specification/CARTE-{ANALYSE,CONCEPTION,CONSTITUTION,CONTRAT-INVENTAIRE,PLAN-DE-REALISATION,SPECIFICATION}-PROJET-WAIRYU-v1.0.md` — 6 cartes de référence
- [M] `contrat/cloture/RAPPORT-FINAL-PRODUCTION.md` — les 6 interceptions converties en gardiens machine

## LES 7 RÈGLES DE DISCIPLINE
1. Plan et gates écrits AVANT l'exécution · 2. Une étape = une gate = une preuve numérique · 3. STATUS append-only · 4. Toute mutation = une fiche FM · 5. Verdicts rejoués machine, jamais déclarés · 6. Push vérifié après coup · 7. Le cadrage suit le constat (protocole RECON)

# Étape 2 — Authentification & comptes

> Livrée le 2026-09-22. Gate 2 : parcours complet inscription → vérification →
> connexion → déconnexion → suppression, validé par smoke tests automatisés
> (18 assertions) **et** par un parcours réel dans un navigateur (mobile 390×844).

## 1. Ce qui est en place

### 1.1 Inscription / connexion par email + OTP 6 chiffres

- `POST /api/auth/otp/request` : génère un code à 6 chiffres
  (`crypto.getRandomValues`, zéros initiaux possibles), le stocke **hashé**
  (SHA-256) dans `auth_codes`, TTL **10 min**.
- `POST /api/auth/otp/verify` : vérification en **temps constant**,
  **3 tentatives max** par code (puis verrouillage), consommation du code,
  création de session.
- **Anti-énumération** : la réponse ne révèle jamais si l'email existe. Un
  email connu reçoit « code de connexion », un email inconnu « bienvenue » —
  et la vérification crée le compte si nécessaire (flux unifié).
- Cooldown de renvoi : **60 s** par email (erreur `rate_limited` 429).
- Sans compte Brevo configuré : **staging** renvoie le code dans la réponse
  (`devCode`, canal `dev`) pour permettre les tests ; **production** refuse
  proprement (`not_configured`, 503) sans jamais exposer un code.

### 1.2 Turnstile (anti-robot)

- Widget `wairyu-auth` créé via l'API Cloudflare, hostnames :
  `wairyu.wairyu.workers.dev`, `wairyu-staging.wairyu.workers.dev`, `localhost`.
- Site key publique dans `[vars]` ; secret posé via `wrangler secret put`.
- Front : composant React (chargement explicite, callbacks token/expired).
- Serveur : `siteverify` en production (**fail-closed**, 403 sans jeton
  valide — testé) ; **sauté en staging** pour permettre les smoke tests curl
  (choix documenté dans `lib/turnstile.ts`).

### 1.3 Sessions

- Cookie `wairyu_s` **httpOnly, Secure, SameSite=Lax**, signé HMAC-SHA256
  (`{sid}.{exp}.{sig}`), enregistrement révocable en D1.
- TTL **30 jours glissants** : chaque requête authentifiée prolonge la session
  (écriture D1 plafonnée à ~1/h, la session est renouvelée quand il reste
  moins de 29 jours).
- Statut du compte vérifié à chaque requête : `banned`/`deleted` ⇒ session
  morte immédiatement.
- `POST /api/auth/logout` (session courante) et `POST /api/auth/logout-all`
  (toutes les sessions, testé : `{"ok":true,"revoked":1}`).
- Cron quotidien (03:10 UTC prod / 03:40 UTC staging) purge : sessions
  expirées/révocation ancienne, codes OTP échus > 24 h, fenêtres rate-limit
  clôturées > 2 h, traces de suppression > 30 j.

### 1.4 Google OAuth — préparé et inerte

- Code complet : `GET /api/auth/google/start` (state + PKCE S256 en cookie
  signé) → `GET /api/auth/google/callback` (échange code → profil →
  find-or-create par email → **fusion** avec un compte créé par OTP).
- Activation quand le fondateur créera les identifiants Google Cloud
  (gratuit, ~10 min) : poser `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET`
  (`wrangler secret put`), redirect URI à déclarer :
  `https://wairyu.wairyu.workers.dev/api/auth/google/callback`.
  **Aucun redéploiement nécessaire** (lecture des secrets à chaque requête).
- Tant que non configuré : bouton grisé côté front, endpoint en erreur claire.

### 1.5 Rate limiting (anti-spam OTP)

- Table `rate_limits` (clé, fenêtre, compteur) — UPSERT atomique.
- Règles : demande de code **10/h par IP** et **5/h par email** ; vérification
  **30/h par IP** et **10/h par email** (brute-force killer : 10 codes ×
  3 tentatives = 30 essais/h sur 1 000 000 de combinaisons).
- Fenêtre fixe par tranches d'1 h (documenté : approximation de la fenêtre
  glissante, adaptée à D1).

### 1.6 RGPD dès maintenant (pas plus tard)

| Droit | Mise en œuvre |
|---|---|
| Accès / portabilité | `GET /api/account/export` → JSON `wairyu-export-v1` téléchargeable (testé 200) |
| Effacement | `DELETE /api/account` avec `confirm: true` — **hard delete immédiat** : sessions supprimées, ligne `users` supprimée, ré-inscription au même email possible (testé) |
| Traçabilité | `account_deletions` : trace **anonyme** (UUID d'origine, motif, dates) purgée à J+30 par le cron |
| Minoration | Codes OTP stockés hashés ; email hashé dans `auth_codes` ; IP/UA seulement hash tronqué 12 hex |
| Consentements | Case 18+ **obligatoire** (blocage à l'inscription) + case CGU/confidentialité distincte, liens vers les documents v1 servis depuis `/legal/` |

> Étape 3 : le même endpoint branchera la purge Cloudinary des médias
> (hook `StorageService.purgeUser`) avant le `DELETE users`.

### 1.7 Écrans PWA (mobile-first, charte v1)

- `#/` accueil (état API, CTA) · `#/signup` (email + 18+ + CGU + Turnstile) ·
  `#/login` (email + Turnstile + bouton Google) · `#/verify` (saisie 6
  chiffres, clavier numérique, auto-soumission, `one-time-code`, minuteur de
  renvoi, affichage du code en mode dev staging) · `#/app` (compte : infos,
  export, déconnexions, suppression en deux temps).
- Pas d'écran « mot de passe oublié » : la connexion **EST** le code email
  (authentification sans mot de passe) — conforme au choix de l'Étape 0.
- CGU + politique de confidentialité servis comme fichiers statiques sous
  `/legal/` (rendu markdown brut v1 — page dédiée en Étape 10 si besoin).

### 1.8 Administration

- `/admin/*` protégé par jeton porteur (`ADMIN_TOKEN`, secret posé prod et
  staging). Sans jeton : 401 (testé). Le jeton est archivé par le fondateur
  côté local (généré à la livraison, jamais committé).

## 2. Schéma D1 ajouté (`0003_auth.sql`)

- `auth_codes` : `email_hash`, `purpose` (login/signup), `code_hash`,
  `attempts`, `request_ip_hash`, `created_at`, `expires_at`, `consumed_at`
  — PK `(email_hash, purpose)`, un code actif par email/canal.
- `account_deletions` : `user_id_orig`, `reason`, `deleted_at`, `purge_at`.

## 3. Secrets & variables

| Nom | Type | Où | État |
|---|---|---|---|
| `TURNSTILE_SITE_KEY` | var publique | wrangler.toml (prod+staging) | ✅ |
| `TURNSTILE_SECRET` | secret | prod + staging | ✅ |
| `ADMIN_TOKEN` | secret | prod + staging | ✅ |
| `BREVO_API_KEY`, `EMAIL_FROM` | secrets | prod + staging | ✅ posé 2026-09-23 — expéditeur `wairyu26@gmail.com` validé, test d'envoi réel OK |
| `GOOGLE_CLIENT_ID/SECRET` | secrets | prod + staging | ✅ posé 2026-09-23 — `/start` 302 validé, Google accepte la config |
| `FACEBOOK_APP_ID/SECRET` | secrets | prod + staging | ✅ posé 2026-09-23 — `/start` 302 validé, callback Data Deletion conforme à la spec Meta |

## 4. Tests de la Gate 2

- **Smoke tests curl automatisés** (`scripts/smoke_etape2.sh`, 18 assertions) :
  health, config, me anonyme 401, demande de code (+ cooldown 429), mauvais
  code (`otp_invalid`), création de compte, cookie de session, `/api/me`,
  export RGPD, admin 401, logout, re-connexion (`created=false`), logout-all,
  suppression RGPD, ré-inscription après suppression.
- **Parcours réel navigateur** (viewport mobile 390×844) : accueil →
  inscription (Turnstile rendu) → écran code → vérification → écran compte →
  suppression définitive → déconnexion automatique. Screenshot :
  `download/wairyu-etape2-signup-mobile.png`.
- **Production** : health/config/me 401/otp 403 sans Turnstile/admin 401/SPA 200.
- ⏳ Reste au fondateur : refaire le parcours sur **son** téléphone
  (Chrome Android + Safari iOS) une fois Brevo branché (§5) — le test sans
  email réel n'est possible qu'en mode dev staging.

## 5. Ce qu'il reste à brancher par le fondateur (10 minutes, gratuit)

1. **Emails OTP réels (Brevo)** — https://www.brevo.com (plan gratuit 300
   emails/jour, sans carte bancaire) :
   - créer le compte, vérifier l'adresse expéditrice (ex. `noreply@…`) ;
   - créer une clé API v3 puis :
     `npx wrangler secret put BREVO_API_KEY` et
     `npx wrangler secret put EMAIL_FROM` (dans `apps/api`, env production) ;
   - les secrets sont relus à chaque requête — aucun redéploiement obligatoire.
2. **Google OAuth (optionnel maintenant)** — guide pas-à-pas §7.2 ; en bref :
   Google Cloud Console → identifiants OAuth (type « Application Web »),
   redirect URI `https://wairyu.wairyu.workers.dev/api/auth/google/callback`,
   puis poser `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET`.
3. **Facebook Login (optionnel maintenant)** — guide pas-à-pas §7.3 ; en bref :
   app Meta (developers.facebook.com) gratuite, produit « Facebook Login »,
   redirect URI `https://wairyu.wairyu.workers.dev/api/auth/facebook/callback`,
   callback de suppression `https://wairyu.wairyu.workers.dev/api/auth/facebook/data-deletion`,
   puis poser `FACEBOOK_APP_ID` et `FACEBOOK_APP_SECRET`.
4. **Test mobile final** (Gate 2) sur https://wairyu-staging.wairyu.workers.dev
   puis https://wairyu.wairyu.workers.dev.

## 6. Découvertes & défauts corrigés pendant la livraison

- `deploy.sh` : chemin racine erroné (`ROOT` pointait sur le parent) + les
  migrations D1 staging exigeaient `--env staging`. Corrigés.
- Routes d'auth initialement montées sous `/api/auth/me` au lieu de `/api/me`
  → restructuration des chemins (`/api/me`, `/api/account`, `/api/auth/*`).
- Après vérification OTP réussie, le front revenait à l'accueil (état `me`
  non rechargé) → callback `onAuthenticated` qui recharge `/api/me` avant de
  naviguer vers `#/app`.
- Première requête après un déploiement peut toucher un isolate périmé
  (404 transient observé pendant les tests) — attendre ~5 s après déploiement
  avant de tester.
- Turnstile : politique différenciée staging (sautée) / production (stricte,
  fail-closed) pour concilier tests automatisés et sécurité réelle.

## 7. Étape 2-bis — Connexions sociales Google + Facebook

À la demande du fondateur (« pourquoi ne pas s'inscrire via un compte Google et
Facebook comme les sites de rencontre classiques ? »), l'inscription/connexion
sociale est livrée : boutons sur les écrans inscription **et** connexion,
actifs dès la pose des secrets (sans redéploiement). L'email OTP reste la
méthode socle (fonctionne pour tout le monde, aucune dépendance externe).

### 7.1 Fonctionnement livré

- **Backend** : `lib/google.ts` (PKCE S256) + `lib/facebook.ts` (Graph v21.0,
  `appsecret_proof`, signed_request) ; routes `/api/auth/google/start|callback`,
  `/api/auth/facebook/start|callback` ; cookie d'état signé HMAC (anti-CSRF,
  TTL 10 min) par fournisseur.
- **Fusion de comptes par email vérifié** : une session Google/Facebook dont
  l'email correspond à un compte créé par OTP ouvre CE compte — jamais de
duplication. Les identités sont tracées dans `oauth_identities`
  (`0004_oauth.sql`, migration appliquée prod+staging).
- **Callback Meta « Data Deletion Request »** (`POST /api/auth/facebook/data-deletion`) :
  vérifie le `signed_request` (HMAC-SHA256 au secret d'app), supprime le
  compte correspondant (même code RGPD que `DELETE /api/account`), renvoie le
  contrat Meta `{url, confirmation_code}`. Page de confirmation publique :
  `/data-deletion` (assets).
- **Frontend** : composant `SocialButtons` (Google 4 couleurs + f blanc sur
  bleu Meta #1877F2), séparateur « ou », intégré sous les formulaires
  inscription/connexion. À l'inscription, les cases 18+ et CGU doivent être
  cochées avant de lancer un parcours social (consentement obligatoire).
- **Cas Facebook sans email** (compte créé par téléphone) : Meta n'expose
  aucun email vérifié → retour accueil avec message clair invitant à utiliser
  la méthode email ; jamais de compte sans email.
- **Sans secrets posés** : boutons affichés en état « bientôt » désactivé ;
  `/start` renvoie 400 propre ; `/data-deletion` renvoie 404.

### 7.2 Activation Google (gratuit, ~10 min, sans carte bancaire)

1. https://console.cloud.google.com → créer le projet « wairyu ».
2. APIs & services → Écran de consentement OAuth : type Externe, nom
   « wairyu », email support, domaine `wairyu.wairyu.workers.dev`.
3. Identifiants → Créer des identifiants → ID client OAuth → Application Web :
   - Origines JavaScript autorisées : `https://wairyu.wairyu.workers.dev`
   - URI de redirection autorisées :
     `https://wairyu.wairyu.workers.dev/api/auth/google/callback` et
     `https://wairyu-staging.wairyu.workers.dev/api/auth/google/callback`
4. Dans `apps/api` : `npx wrangler secret put GOOGLE_CLIENT_ID` puis
   `npx wrangler secret put GOOGLE_CLIENT_SECRET` (prod ; répéter avec
   `--env staging` pour le staging).
5. Les boutons passent automatiquement en actif (`/api/auth/config`).

### 7.3 Activation Facebook (gratuit, ~15 min + revue Meta)

1. https://developers.facebook.com → Créer une app (type « Consommateur »).
2. Ajouter le produit **Facebook Login for Web** ; paramètres :
   - URI de redirection OAuth valides :
     `https://wairyu.wairyu.workers.dev/api/auth/facebook/callback` et
     `https://wairyu-staging.wairyu.workers.dev/api/auth/facebook/callback`
   - URL de la politique de confidentialité :
     `https://wairyu.wairyu.workers.dev/legal/politique.md`
   - URL de suppression de données :
     `https://wairyu.wairyu.workers.dev/api/auth/facebook/data-deletion`
3. Modes : tant que l'app est en « Développement », seuls les rôles de l'app
   (admin/testeurs) peuvent se connecter. Pour ouvrir au public → passer en
   « Live » : Meta demande une revue d'app ; les permissions `public_profile`
   et `email` sont des permissions standard (déjà sélectionnées par défaut).
4. Dans `apps/api` : `npx wrangler secret put FACEBOOK_APP_ID` puis
   `npx wrangler secret put FACEBOOK_APP_SECRET` (prod + staging).

### 7.4 Tests de l'Étape 2-bis

- `scripts/smoke_etape2b.sh` : config expose `googleEnabled`/`facebookEnabled`,
  `/start` 400 sans secrets, `/data-deletion` 404 sans secrets, page de
  confirmation 200, me anonyme 401 — **6/6 staging, 6/6 production**.
- Smoke complet Étape 2 relancé après refactorisation du flux OAuth et de la
  suppression de compte : **18/18 staging** (aucune régression).
- Parcours navigateur mobile (390×844) : boutons affichés, état « bientôt »
  avant pose des secrets. Screenshot :
  `download/wairyu-etape2b-signup-social.png`.
- ⏳ Test OAuth de bout en bout restant, chez chaque fournisseur, après pose
  des secrets (parcours réel Google puis Facebook).

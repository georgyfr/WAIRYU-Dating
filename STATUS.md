# STATUS — Suivi de l'avancement du projet Wairyu

> Tableau de bord mis à jour à chaque fin d'étape. Une étape n'est marquée « Terminée » qu'après validation de sa porte (gate).

| # | Étape | Statut | Date de fin | Gate validée |
|---|-------|--------|-------------|--------------|
| 0 | Cadrage & décisions fondatrices | ✅ Terminée | 2026-09-23 | ☑ |
| 1 | Socle technique & infrastructure Cloudflare | ✅ Terminée | 2026-09-23 | ☑ |
| 2 | Authentification & comptes | ✅ Terminée | 2026-09-22 | ☑ (test mobile fondateur restant) |
| 3 | Profils & photos protégées | ⏳ En attente | — | ☐ |
| 4 | Questionnaire progressif & moteur de matching | ⏳ En attente | — | ☐ |
| 5 | Découverte dual-mode (Classique & Invisible) | ⏳ En attente | — | ☐ |
| 6 | Chat temps réel & révélation | ⏳ En attente | — | ☐ |
| 7 | Sécurité & modération | ⏳ En attente | — | ☐ |
| 8 | Monétisation préparée (éteinte) | ⏳ En attente | — | ☐ |
| 9 | Qualité, tests & beta fermée | ⏳ En attente | — | ☐ |
| 10 | Lancement francophonie | ⏳ En attente | — | ☐ |
| 11 | Post-lancement : épaississement & montée en charge | ⏳ En attente | — | ☐ |

## URLs en service

| Environnement | URL | Usage |
|---|---|---|
| **Production** | https://wairyu.wairyu.workers.dev | API + PWA (déploiements validés uniquement) |
| Staging | https://wairyu-staging.wairyu.workers.dev | Tests avant chaque montée en prod |

## Journal des livraisons

| Date | Livraison | Contenu |
|------|-----------|---------|
| — | Initialisation du dépôt | Spécification v0.1 + Analyse approfondie + Plan de réalisation 12 étapes |
| — | Décision d'architecture n°9 : stockage sans carte bancaire | R2 reporté (activation exige une carte) → **Cloudinary plan gratuit** pour photos + voice notes (assets authentifiés, URLs signées, module `StorageService` interchangeable) |
| 2026-09-23 | Sondes Cloudinary V1-V8 | Plan Free validé en réel (25 GB) : upload `authenticated` images+audio ✅, accès sans signature bloqué ✅, URL signée Worker-side ✅, flou par transformation ✅. Découverte : expiration `v=timestamp` non appliquée → sécurité déléguée à l'autorisation Worker. Voir `docs/STOCKAGE-CLOUDINARY.md` |
| 2026-09-23 | **Étape 0 — Cadrage** | Périmètre MoSCoW, 9 décisions validées (Décision 9 révisée), limites free tier relevées à J0, CGU + Politique de confidentialité + Registre RGPD v1, marque visuelle v1. Gate 0 ☑ |
| 2026-09-23 | **Étape 1 — Socle technique** | Monorepo TS strict (API Hono + PWA React/Vite + shared), D1 prod/staging provisionnées et migrées (users, sessions, rate_limits, metrics_daily), KV ×2, DO SQLite `ChatRoom`, cron purge, secrets posés, cookies signés HMAC, métriques d'usage (`/admin/usage`), smoke tests verts en prod. Gate 1 ☑ |
| 2026-09-22 | **Étape 2 — Authentification & comptes** | OTP email 6 chiffres (hashé, TTL 10 min, 3 essais, cooldown 60 s), Turnstile (widget créé, strict en prod), sessions 30 j glissants révocables (logout/logout-all), rate limiting D1 (IP + email), Google OAuth préparé (PKCE + fusion par email), RGPD : export JSON + suppression immédiate + trace anonyme J+30, écrans PWA mobile-first (18+ obligatoire), `/admin/*` protégé par jeton. 18 smoke tests + parcours navigateur réels. Voir `etapes/etape-02-authentication/` |
| 2026-09-23 | **Étape 2-bis — Connexions sociales Google + Facebook** (demande fondateur) | Boutons « Continuer avec Google / Facebook » sur inscription + connexion (actifs dès pose des secrets, sans redéploiement), OAuth complet Facebook (Graph v21.0, state signé, appsecret_proof), fusion de comptes par email vérifié, table `oauth_identities` (0004, prod+staging), callback Meta « Data Deletion Request » conforme + page `/data-deletion`, consentement 18+/CGU exigé avant inscription sociale, cas Facebook sans email géré. Smoke social 6/6 staging + 6/6 prod, smoke complet 18/18 (zéro régression). Guides d'activation Google §7.2 / Meta §7.3 dans `AUTHENTICATION.md` |
| 2026-09-23 | **Activation Brevo + Google** (clés fournies par le fondateur) | Guide pas-à-pas `docs/GUIDE-ACTIVATION-CLES.md` poussé ; secrets posés prod+staging (BREVO_API_KEY, EMAIL_FROM, GOOGLE_CLIENT_ID/SECRET) ; expéditeur Gmail validé chez Brevo ; test d'envoi réel OK ; OTP staging parti par email (`channel: "email"`) ; config prod : `emailProvider: "brevo"` + `googleEnabled: true` ; `/start` 302 accepté par Google (aucune erreur redirect/client). Reste : app Meta (bloc C) + tests mobiles fondateur |
| 2026-09-23 | **Incident redirect_uri_mismatch réglé — Google validé de bout en bout** | Premier clic fondateur : Erreur 400 redirect_uri_mismatch (URI de redirection absente du client OAuth Google ; faux négatif du test curl initial — ne suivait pas les redirections). Test technique reproductible mis au point (curl -L + cookies + UA). Correction fondateur dans la console (2 URIs enregistrées) ; test technique : plus d'erreur, écran de connexion servi avec nom « wairyu » ; capture fondateur : écran compte connecté via Google (`wairyu26@gmail.com`, badge Email vérifié). Connexion Google **validée de bout en bout** ✅ |

## Accès & comptes

| Service | État | Note |
|---|---|---|
| GitHub (georgyfr/WAIRYU-Dating) | ✅ Actif | Token fine-grained neuf vérifié (admin). ⚠️ Rappel permanent : révoquer/régénérer tout token partagé en clair |
| Cloudflare — Workers, D1, KV, Durable Objects, Turnstile | ✅ Vérifié | Sous-domaine `wairyu` ; URLs : `wairyu.wairyu.workers.dev` (prod), `wairyu-staging.…` (staging) |
| Cloudflare — R2 | ⏸️ Reporté | Activation impossible sans carte bancaire → Cloudinary le remplace (Décision 9) |
| Cloudinary (photos/voice notes) | ✅ Actif — sondé | Cloud `nm7lozr4`, plan Free 25 GB, assets `authenticated` validés ; secrets stockés côté Worker uniquement |
| Cloudflare Turnstile (widget `wairyu-auth`) | ✅ Actif | Site key publique + secret posés (prod/staging) ; strict en production, sauté en staging |
| Brevo (emails OTP) | ✅ **Actif** (2026-09-23) | Clé API + expéditeur `wairyu26@gmail.com` validé chez Brevo ; test d'envoi réel OK ; `emailProvider: "brevo"` en prod et staging. Guide : `docs/GUIDE-ACTIVATION-CLES.md` bloc A |
| Google OAuth | ✅ **Actif** (2026-09-23) | Secrets posés prod+staging ; `/start` → 302 validé ; Google accepte client_id + redirect_uri (aucune erreur) ; bouton actif dans le front. Guide : `docs/GUIDE-ACTIVATION-CLES.md` bloc B |
| Facebook Login | ⏳ Dernier à brancher — livré Étape 2-bis | OAuth complet + callback suppression Meta + page `/data-deletion` prêts ; il ne manque que la création de l'app Meta (~15 min) — bloc C du `docs/GUIDE-ACTIVATION-CLES.md` |

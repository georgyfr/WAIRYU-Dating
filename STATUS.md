# STATUS — Suivi de l'avancement du projet Wairyu

> Tableau de bord mis à jour à chaque fin d'étape. Une étape n'est marquée « Terminée » qu'après validation de sa porte (gate).

| # | Étape | Statut | Date de fin | Gate validée |
|---|-------|--------|-------------|--------------|
| 0 | Cadrage & décisions fondatrices | ✅ Terminée | 2026-09-23 | ☑ |
| 1 | Socle technique & infrastructure Cloudflare | ✅ Terminée | 2026-09-23 | ☑ |
| 2 | Authentification & comptes | 🔵 Suivante | — | ☐ |
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

## Accès & comptes

| Service | État | Note |
|---|---|---|
| GitHub (georgyfr/WAIRYU-Dating) | ✅ Actif | Token fine-grained neuf vérifié (admin). ⚠️ Rappel permanent : révoquer/régénérer tout token partagé en clair |
| Cloudflare — Workers, D1, KV, Durable Objects, Turnstile | ✅ Vérifié | Sous-domaine `wairyu` ; URLs : `wairyu.wairyu.workers.dev` (prod), `wairyu-staging.…` (staging) |
| Cloudflare — R2 | ⏸️ Reporté | Activation impossible sans carte bancaire → Cloudinary le remplace (Décision 9) |
| Cloudinary (photos/voice notes) | ✅ Actif — sondé | Cloud `nm7lozr4`, plan Free 25 GB, assets `authenticated` validés ; secrets stockés côté Worker uniquement |
| Brevo ou Resend (emails OTP) | ⏳ À créer | Dépendance de l'Étape 2 uniquement |

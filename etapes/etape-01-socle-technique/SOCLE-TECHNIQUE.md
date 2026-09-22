# ÉTAPE 1 — SOCLE TECHNIQUE & INFRASTRUCTURE

> Statut : **TERMINÉE** — 2026-09-23 · Gate 1 : **VALIDÉE**
> Un Worker unique sert l'API (Hono) et le front (PWA React+Vite). Deux environnements
> (staging / production) avec bases D1 et KV séparées. Métriques d'usage visibles.

---

## 1.1 Monorepo (TypeScript strict partout)

```text
wairyu-dating/
├── package.json               # workspaces npm : apps/*, packages/*
├── tsconfig.base.json         # strict + noUncheckedIndexedAccess + verbatimModuleSyntax
├── .editorconfig · .prettierrc · .gitignore
├── deploy.sh                  # typecheck → build → migrations D1 → deploy (staging|production)
├── apps/
│   ├── api/                   # Worker Cloudflare (Hono)
│   │   ├── wrangler.toml      # assets, D1, KV, DO, cron, vars (prod + env.staging)
│   │   ├── migrations/        # 0001_core.sql (users, sessions, rate_limits) · 0002_metrics.sql
│   │   └── src/
│   │       ├── index.ts       # fetch() + scheduled() (cron purge sessions)
│   │       ├── env.ts         # typage des bindings
│   │       ├── lib/           # errors (contrat unifié), session (cookies HMAC), cloudinary (URLs signées)
│   │       ├── middleware/    # session, cors (dev), usage (métriques)
│   │       ├── routes/        # health, admin (/admin/usage, /admin/do-check)
│   │       └── do/chat-room.ts# Durable Object SQLite (squelette + alarm())
│   └── web/                   # PWA React+Vite (Nunito, violet #6C4AB6, ambre #F4A259)
│       └── src/App.tsx        # page d'accueil brandée + healthcheck API en direct
└── packages/shared/           # types + constantes partagés (contrats API, révélations, limites)
```

## 1.2 Ressources provisionnées (réelles, vérifiées)

| Ressource | Nom | Identifiant |
|-----------|-----|-------------|
| D1 production | `wairyu-prod` | `8ff113a8-a81e-4bab-a1f3-7e2234dfc6d9` |
| D1 staging | `wairyu-staging` | `ac8675c1-ad57-4035-b27f-205175a66a55` |
| KV production | `wairyu-config-prod` | `843f3469…a0f0dc7` |
| KV staging | `wairyu-config-staging` | `ee6f8fb8…ffaf3220` |
| Durable Object | classe `ChatRoom` (SQLite) | migration wrangler `v1` |
| Worker production | `wairyu` | https://wairyu.wairyu.workers.dev |
| Worker staging | `wairyu-staging` | https://wairyu-staging.wairyu.workers.dev |
| Cron | purge sessions + métriques | prod `10 3 * * *` · staging `40 3 * * *` |

Secrets posés sur les deux environnements : `SESSION_HMAC_KEY` (générée 64 hex,
distincte par environnement), `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

> **URL workers.dev** : le sous-domaine du compte est `wairyu`, donc l'URL publique
> est `wairyu.wairyu.workers.dev`. L'API Cloudflare refuse de renommer un sous-domaine
> existant (erreur 10036) — si l'URL `wairyu.getwairyu.workers.dev` est souhaitée,
> le renommage se fait dans le Dashboard (Workers & Pages → sous-domaine) ; les URLs
> des Workers se mettent à jour automatiquement. Un domaine personnalisé remplacera
> ceci au lancement (Étape 10).

## 1.3 Schéma D1 initial

- `users` — id UUID, email unique, vérification OTP, profil minimal, statut,
  `plan` (monétisation câblée éteinte : défaut `free`), horodatages, suppression douce.
- `sessions` — cookie signé ↔ enregistrement révocable (TTL 30 j, logout, logout-all),
  index user + expiration, hash UA/IP (anti-abus, jamais d'IP brute).
- `rate_limits` — fenêtres glissantes (prêt pour les OTP de l'Étape 2).
- `metrics_daily` — agrégats anonymes (clé jour+métrique, upsert).

Migrations appliquées sur les DEUX bases via `wrangler d1 migrations apply --remote`.

## 1.4 Sécurité en place dès ce socle

- **Cookies de session signés** HMAC-SHA256 (`httpOnly` posé à l'Étape 2), comparaison
  à temps constant, structure `{sid}.{exp}.{sig}`.
- **Middleware de session** : vérifie signature + table `sessions` (révocation/expiry)
  à chaque requête `/api/*`.
- **Contrat d'erreur unifié** : `{error: {code, message, req_id}}` — codes
  `bad_request | unauthorized | forbidden | not_found | rate_limited | internal`.
- **CORS** strict same-origin ; ouvert seulement pour `localhost` (dev Vite).
- **Gestion d'erreurs globale** + logs structurés JSON avec `req_id` de corrélation.
- **Cloudinary signé** : module `lib/cloudinary.ts` implémentant l'algorithme validé
  par sondes (SHA-1 Web Crypto → base64url → 8 car., segment `/authenticated/`),
  secret uniquement côté Worker. Voir `docs/STOCKAGE-CLOUDINARY.md`.

## 1.5 Métriques d'usage (garde-fou free tier)

- Middleware `usage` : compteurs isolate (`requests_total`, buckets par route) +
  écritures échantillonnées dans `metrics_daily` (taux configurable `USAGE_SAMPLE_RATE`,
  pondération compensée). Ne bloque jamais une requête en cas d'échec d'écriture.
- `GET /admin/usage` : état du jour (métriques D1 + compteurs isolate + sessions actives).
- `GET /admin/do-check` : prouve le binding Durable Object (réponse `sqlite`).
- `/admin/*` sera protégé par jeton admin à l'Étape 2 (aucune donnée personnelle exposée).

## 1.6 Smoke tests de validation (production, exécutés)

| Test | Résultat |
|------|----------|
| `GET /api/health` | ✅ `{"ok":true,"env":"production","version":"0.1.0"}` |
| `GET /api/me` sans session | ✅ 401 + contrat d'erreur + `req_id` |
| `GET /admin/usage` | ✅ métriques du jour + compteurs isolate |
| `GET /admin/do-check` | ✅ `{"ok":true,"durable_object":"sqlite"}` |
| `GET /` | ✅ 200 `text/html` (SPA brandée) |
| `GET /route-inexistante` | ✅ fallback SPA (index.html) |
| Cron déployé | ✅ prod 03:10 UTC, staging 03:40 UTC |

Les mêmes tests passent sur staging (base D1 distincte — vérifié par `env: "staging"`).

## 1.7 Défauts détectés et corrigés pendant la mise en service

1. `Date.now()` renvoie 0 pendant l'init du scope global du Worker → compteur
   d'uptime initialisé paresseusement au premier accès (défaut trouvé via smoke test).
2. TOML : `[[triggers]]` (tableau) invalide pour `env.staging` → `[env.staging.triggers]`.
3. Buckets métriques : `/admin/*` compté comme `asset_*` → bucket dédié `admin_*`.

## Validation Gate 1

- [x] https://wairyu.wairyu.workers.dev répond (API + front)
- [x] Staging et production séparés (Workers, D1, KV, secrets distincts)
- [x] Usage visible (/admin/usage) et métriques quotidiennes en D1
- [x] Monorepo typechecké strict, build front reproductible, deploy.sh fonctionnel

**→ Passage à l'Étape 2 (Authentification & comptes) autorisé.**

#!/usr/bin/env bash
# wairyu — déploiement staging / production
# Usage : CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ACCOUNT_ID=... bash deploy.sh <staging|production>
set -euo pipefail

TARGET="${1:-staging}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
API_DIR="$ROOT/apps/api"

: "${CLOUDFLARE_API_TOKEN:?Variable CLOUDFLARE_API_TOKEN manquante}"
: "${CLOUDFLARE_ACCOUNT_ID:?Variable CLOUDFLARE_ACCOUNT_ID manquante}"

export CLOUDFLARE_API_TOKEN CLOUDFLARE_ACCOUNT_ID

echo "▸ wairyu — déploiement $TARGET"

# 1. Typecheck rapide (échec = stop)
echo "  1/4 typecheck…"
(cd "$API_DIR" && npx tsc --noEmit)

# 2. Build du front
echo "  2/4 build front (Vite)…"
(cd "$ROOT/apps/web" && npx vite build)

# 3. Migrations D1 (base de l'environnement cible)
DB_NAME=$([ "$TARGET" = "production" ] && echo "wairyu-prod" || echo "wairyu-staging")
echo "  3/4 migrations D1 ($DB_NAME)…"
(cd "$API_DIR" && npx wrangler d1 migrations apply "$DB_NAME" --remote $([ "$TARGET" = "staging" ] && echo --env staging))

# 4. Déploiement du Worker
echo "  4/4 deploy Worker ($TARGET)…"
(cd "$API_DIR" && npx wrangler deploy $( [ "$TARGET" = "staging" ] && echo --env staging ))

URL=$([ "$TARGET" = "production" ] && echo "https://wairyu.wairyu.workers.dev" || echo "https://wairyu-staging.wairyu.workers.dev")
echo "✓ Déployé. Smoke test : curl $URL/api/health"

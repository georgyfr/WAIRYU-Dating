# WAIRYU — Plateforme de rencontre hybride dual-mode

> « Et si, avant de demander *« à quoi ressembles-tu ? »*, nous demandions *« comment veux-tu rencontrer ? »* »

Wairyu est une application de rencontre hybride avec deux modes complémentaires dans un seul compte :

- **Mode Classique** — photos visibles, swipe, rapidité.
- **Mode Invisible** — photos floutées, questionnaire progressif, conversation avant le visuel, révélation mutuelle et consentie des photos.

**Infrastructure : 100 % sur l'offre gratuite** — Cloudflare (Workers, D1, KV, Durable Objects, Cron Triggers, Turnstile) + Cloudinary Free pour les médias (photos & voice notes privés, sans carte bancaire — voir `docs/STOCKAGE-CLOUDINARY.md`).

---

## Application en service

| Environnement | URL |
|---|---|
| Production | https://wairyu.wairyu.workers.dev |
| Staging | https://wairyu-staging.wairyu.workers.dev |

Le monorepo (npm workspaces, TypeScript strict) :

| Dossier | Contenu |
|---|---|
| `apps/api/` | Worker Cloudflare — API Hono, migrations D1, Durable Object `ChatRoom`, cron, métriques d'usage |
| `apps/web/` | PWA React + Vite (marque v1 : Nunito, violet `#6C4AB6`, ambre `#F4A259`) |
| `packages/shared/` | Types & constantes partagés (contrats API, conditions de révélation, limites free tier) |

Déploiement : `CLOUDFLARE_API_TOKEN=… CLOUDFLARE_ACCOUNT_ID=… bash deploy.sh staging|production` (typecheck → build → migrations D1 → deploy).

---

## Contenu du dépôt

| Dossier / fichier | Contenu |
|---|---|
| `specification/` | Spécification produit v0.1 complète (document fondateur, ~13 000 lignes) |
| `docs/ANALYSE-APPROFONDIE.md` | Analyse du projet, verdict de faisabilité, architecture Cloudflare gratuite corrigée (8 décisions d'architecture clés), budget de requêtes, modèle de données D1, cartographie de l'API |
| `docs/PLAN-DE-REALISATION-12-ETAPES.md` | Plan de réalisation du début à la fin : 12 étapes détaillées avec sous-étapes, portes de validation, conformité RGPD, stratégie de test & lancement |
| `etapes/` | Journal et livrables de chaque étape, poussés au fur et à mesure de leur achèvement |
| `apps/` · `packages/` | Monorepo applicatif (API + PWA + partagé) |
| `STATUS.md` | Tableau de bord de l'avancement des 12 étapes |

---

## Méthode de travail

Le projet est réalisé de façon **itérative** : chaque étape est construite, testée et validée (porte de validation / *gate*) avant de passer à la suivante. Dès qu'une étape est intégralement terminée, elle est poussée dans ce dépôt (dossier `etapes/`) avec ses livrables.

## Phases produit (rappel)

1. **Cœur Wairyu** (MVP) : dual-mode, questionnaire N1-N2, matching explicable, chat temps réel, révélation mutuelle, sécurité, modération.
2. **Wairyu Cultures** : Profil d'Héritage, matching culturel, salons culturels, Coach Culturel.
3. **Wairyu Moments & événements** : billetterie, check-in, défis.

## Lien

- Spécification produit v0.1 : [`specification/PROJET-WAIRYU-Specification-Produit-v0.1.txt`](specification/PROJET-WAIRYU-Specification-Produit-v0.1.txt)

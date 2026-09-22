# WAIRYU — Analyse approfondie du projet

> Document produit lors de l'analyse de la spécification v0.1 (12 961 lignes). Il complète le [Plan de réalisation](PLAN-DE-REALISATION-12-ETAPES.md).

---

## PARTIE A — ANALYSE EN PROFONDEUR

### A.1 Verdict global

**Le projet est réalisable à 100 % gratuit sur Cloudflare**, à condition d'accepter 8 adaptations techniques au document d'origine et de verrouiller le périmètre MVP sur le « Cœur Wairyu » (dual-mode, chat, révélation mutuelle, questionnaire N1-N2, sécurité). Tout le reste (Cultures, Coach, Événements, Niveau 3) suit après validation.

La spécification est remarquablement mature : elle s'appelle elle-même « version réaliste », assume ses limites, priorise avec MoSCoW, et identifie déjà le free tier Cloudflare comme rampe de lancement.

### A.2 Ce qui est solide dans la spécification

1. **Le concept dual-mode est un vrai angle différenciant.** Personne sur le marché ne laisse l'utilisateur choisir son mode de rencontre ET changer d'avis. Wairyu vend le **choix** — c'est défendable et compréhensible en une phrase.
2. **La révélation mutuelle et progressive** (15 messages + 7 jours minimum + double consentement) est implémentable avec des règles simples — pas besoin d'IA.
3. **Le scoring explicable** (« Pourquoi ce match ? ») est un moteur déterministe : pondérations, écarts de réponses, 2 forces + 1 vigilance. TypeScript pur, zéro neuron d'IA au MVP.
4. **Le document a déjà fait le travail des limites Cloudflare** — il restait à corriger des erreurs et trouver des optimisations (Partie B).
5. **Les KPI du MVP sont chiffrés** (complétion N1 > 55 %, rétention J7 > 35 %, révélation > 15 %…), ce qui donne des critères de validation objectifs.

### A.3 Les risques majeurs et leur traitement

| # | Risque | Gravité | Traitement |
|---|--------|---------|------------|
| 1 | **Masse critique** : une app de rencontre sans monde est morte | ⚠️ Critique | Étape 10 : lancement par « poches urbaines » francophones + le Mode Classique comme levier d'acquisition pour alimenter l'Invisible |
| 2 | **Modération** : le fondateur est seul au début | ⚠️ Critique | Étape 7 : modération par règles (listes de mots, patterns de scam — 0 neuron) + backoffice de signalements + sanctions graduées |
| 3 | **Quota Workers 100 000 requêtes/jour** | Élevé | Étape 1 + Partie B.3 : design économe en requêtes, presigned URLs R2, batching, caching |
| 4 | **Abandon au questionnaire** | Élevé | Étape 4 : progression sauvegardée à chaque réponse, reprise, barre de progression, récompense |
| 5 | **Vérification selfie sans IA** | Moyen | Étape 7 : validation semi-manuelle (file de review dans le backoffice) — gratuit et même plus fiable qu'une IA faible |
| 6 | **Le free tier est une rampe, pas une production** | Moyen | Étape 11 : tableau de seuils précis qui déclenchent chaque upgrade payant (5 $/mois) |

### A.4 L'ambition « aussi puissant que Tinder, voire les surpasser » — lecture honnête

**Ce qui est impossible :** les surpasser sur le volume (Tinder : ~75 millions d'utilisateurs), sur le budget marketing, ou sur la quantité de fonctionnalités. Toute tentative de les copier trait pour trait est la voie la plus sûre vers l'échec.

**Ce qui est possible :** les surpasser **sur les dimensions où ils sont structurellement faibles** :

| Dimension | Tinder/Bumble | Wairyu |
|---|---|---|
| Transparence du matching | Opaque, jamais expliqué | Score + « Pourquoi ce match ? » natif |
| Consentement visuel | Photos exposées dès le swipe | Révélation mutuelle, progressive, réversible |
| Choix du mode de rencontre | Un seul modèle imposé | Classique ↔ Invisible, bascule libre |
| Monétisation perçue | Pay-to-win assumé | Sécurité + matching + conversation gratuits pour toujours |
| Profondeur culturelle | Inexistante | Wairyu Cultures (couche unique au monde) |

La « puissance » d'une app de rencontre, telle que la vit l'utilisateur, tient en 4 choses : **fluidité, monde vivant (masse critique), sécurité visible, et conversations qui aboutissent**. Les deux premières se gagnent par la qualité d'exécution technique et la stratégie de lancement ; les deux dernières sont la différenciation naturelle de Wairyu.

En résumé : ne pas être « Tinder plus grand », mais **l'app que Tinder ne peut pas devenir** — leur modèle de revenus est construit sur le pay-to-win que Wairyu refuse.

---

## PARTIE B — ARCHITECTURE CLOUDFLARE 100 % GRATUIT

### B.1 Tableau des services, limites réelles et usages

| Service | Limite gratuite réelle | Usage Wairyu | Faisabilité |
|---|---|---|---|
| **Workers** (API) | 100 000 req/jour, 10 ms CPU | Toute la logique métier | ✅ Avec design économe (B.3) |
| **Workers Assets** (front PWA) | Requêtes **gratuites et illimitées** | L'app React servie aux navigateurs | ✅ Excellent |
| **D1** (SQL) | 5 M lectures/jour, 100 000 écritures/jour, 5 Go total | Profils, réponses, swipes, matches | ✅ Texte seulement ≈ 100 Ko/profil → ~50 000 profils |
| **R2** (objets) | 10 Go stockage, 1 M écritures/mois, 10 M lectures/mois, egress gratuit | Photos + voice notes | ✅ Avec compression client (B.2, décision n°3) |
| **Durable Objects** | 100 000 req/jour, 5 Go (SQLite) | Chat temps réel + **tâches asynchrones via `alarm()`** | ✅ La clé du temps réel gratuit |
| **KV** | 100 000 lectures/jour, **1 000 écritures/jour** | Lecture seule uniquement (config, feature flags) | ⚠️ Jamais en écriture chaude |
| **Workers AI** | 10 000 Neurons/jour | Réservé aux cas critiques post-lancement | ⚠️ Quasi inutilisé au MVP |
| **Turnstile** (anti-bot) | Gratuit illimité | Protection inscription/login | ✅ |
| **Web Push (VAPID)** | Standard web, gratuit | Notifications messages/matches | ✅ |
| **Cron Triggers** | Gratuit (nombre limité par compte) | Purges, digest quotidien, stats | ✅ |
| ~~Queues~~ | **N'existe PAS au free tier** | Remplacé par DO `alarm()` + Cron | ❌→✅ contourné |
| ~~Firebase~~, Stripe, SMS | Nécessaires plus tard | Différés ou préparés | Non consommés au MVP |

> ⚠️ **Note de diligence** : Cloudflare ajuste ses limites 1 à 2 fois par an. La première sous-étape de l'Étape 1 consiste à revalider chaque chiffre sur les pages officielles au moment du build.

### B.2 Les 8 adaptations clés (les décisions qui changent tout)

**Décision 1 — Sessions : cookies signés + D1, pas de KV.**
KV autorise 1 000 écritures/jour seulement — mort pour des sessions. Alternative : un cookie `httpOnly` signé (HMAC) contenant l'ID de session + un enregistrement en D1 (lecture-heavy, écriture rare). Zéro KV consommé, logout/révocation instantané.

**Décision 2 — Queues n'existe pas en gratuit : remplacé par Durable Objects `alarm()`.**
Tout le worker asynchrone (notifications push, retries, digest) passe par des alarmes DO, gratuites et précises à la seconde. Les tâches récurrentes passent par Cron Triggers.

**Décision 3 — Photos : compression côté client = 6× plus d'utilisateurs dans R2.**
La compression se fait dans le navigateur (canvas → WebP ~150-300 Ko, largeur max 1024 px) **avant** l'upload, plus une miniature ~200 px. Un utilisateur complet avec 6 photos + vignettes ≈ 1,3 Mo → **R2 10 Go ≈ 7 000 à 8 000 utilisateurs** (10× mieux que l'estimation de 800 du document). Le Mode Invisible n'ajoute aucun coût : le flou est appliqué en CSS sur l'image originale.

**Décision 4 — Photos : jamais d'URLs publiques, toujours des presigned URLs R2 de courte durée.**
Les photos sont dans un bucket privé. Le Worker vérifie l'autorisation (mode, relation, révélation accordée ?) puis délivre une URL signée valable ~15 minutes. C'est ce qui rend la révélation consentie **techniquement garantie**, pas seulement déclarative. Bonus : les lectures R2 ne consomment pas le quota de requêtes Workers.

**Décision 5 — Front : PWA React + Vite servie par Workers Assets (pas de Pages séparé, pas de Flutter au début).**
Cloudflare recommande désormais Workers + assets statiques pour les nouveaux projets (Pages est en mode maintenance). Installable sur l'écran d'accueil Android/iOS, notifications push natives web, bande passante illimitée. Le jour du natif, **l'API entière est réutilisée** et une grosse partie de la logique TypeScript partagée aussi.

**Décision 6 — Chat : 1 Durable Object (SQLite) par conversation.**
Le WebSocket vit dans le DO, les messages sont persistés dans le SQLite du DO (5 Go dédiés, en dehors du quota D1), et seules des métadonnées légères sont synchronisées en D1. Le chat n'entame presque pas les 100 000 écritures D1/jour.

**Décision 7 — Auth : email OTP + Google OAuth au lancement ; SMS et Apple différés.**
Aucun SMS gratuit n'existe ; l'OTP email via un service d'emails gratuit (Brevo : 300 emails/jour, ou Resend : 100/jour) couvre la beta. Apple Sign-In exige 99 $/an — différé. C'est le seul point où un service externe (gratuit) complète Cloudflare, car l'envoi d'emails transactionnels à des destinataires inconnus n'est pas permis par Email Routing.

**Décision 8 — Monétisation : câblée mais éteinte.**
Tous les gateways Wairyu+ codés derrière des feature flags désactivés, structure d'entitlements en base, Stripe Checkout en mode test (gratuit) prêt à activer. Zéro euro consommé, activation en une variable.

### B.3 Le budget de requêtes — le nerf de la guerre

100 000 requêtes/jour : la ressource la plus précieuse. Design cible : **≤ 70 requêtes API par utilisateur actif/jour**, soit :

- ~1 200 utilisateurs actifs quotidiens en confort (marge 40 %),
- jusqu'à ~2 500-3 500 en cas de pic (caching agressif et batch).

Les règles d'or :

1. **1 requête = 1 lot** (le feed renvoie 20 profils d'un coup, jamais 1 profil = 1 requête).
2. **Les images ne passent jamais par le Worker** (presigned URLs → R2 direct).
3. **Le temps réel vit dans les DO** (WebSocket maintenu, pas de polling).
4. **Cache HTTP + ETag** sur tout ce qui est statique par nature.
5. **Écritures D1 groupées** ; les compteurs passent par le DO et sont vidés en D1 par lots.
6. Un **dashboard de consommation** (`/admin/usage`) affiche en permanence la consommation vs limites.

---

## PARTIE C — CONCEPTION TECHNIQUE

### C.1 Stack et structure du projet

```
wairyu/
├── apps/
│   ├── web/        # PWA React + Vite + Tailwind (mobile-first)
│   └── worker/     # API Cloudflare Worker (Hono) + assets statiques
├── packages/
│   ├── shared/     # Types TypeScript, schémas Zod, moteur de score, règles de modération
│   └── ui/         # Composants (cartes swipe, chat, questionnaire)
└── infra/          # wrangler.toml, migrations D1, seeds
```

- **Hono** comme framework d'API sur Workers (léger, type-safe, pensé pour l'edge).
- **Zod** partout : la même validation sert au front et au back (`packages/shared`).
- **Moteur de matching = fonction pure** dans `packages/shared` : testable unitairement.
- wrangler CLI pour provisioning et migrations, GitHub pour le versioning, déploiement `wrangler deploy` à chaque release (préprod puis prod).

### C.2 Modèle de données D1 (schéma cible du MVP)

| Table | Rôle (colonnes clés) |
|---|---|
| `users` | id, email, oauth_provider, status, created_at, last_active_at, is_deleted |
| `sessions` | id, user_id, token_hash, expires_at, created_at, revoked_at |
| `profiles` | user_id, display_name, birth_year, gender, orientation, city, lat, lng, bio, mode_default (classic/invisible), intent, verified_badge, is_complete |
| `photos` | id, user_id, r2_key, r2_thumb_key, width, height, position, is_face |
| `q_items` | id, level (1-2), dimension, question, type, options_json, weight |
| `q_answers` | user_id, item_id, value, answered_at (progression sauvegardée à chaque réponse) |
| `preferences` | user_id, min_age, max_age, max_distance_km, genders, intent_filter |
| `swipes` | id, swiper_id, target_id, action (like/pass/superlike), direction, created_at |
| `matches` | id, user_a, user_b, origin (classic/invisible), status, created_at |
| `conversations` | id, match_id, do_namespace, message_count, first_message_at (métadonnées seulement) |
| `revelations` | id, conversation_id, requested_by_a, requested_by_b, revealed_at, feedback_a, feedback_b |
| `reports` | id, reporter_id, target_id, reason, details, status, handled_by, handled_at |
| `blocks` | blocker_id, blocked_id |
| `sanctions` | id, user_id, type (warn/suspend/ban), reason, expires_at |
| `moderation_flags` | id, source (auto/human), conversation_do_id, message_ref, risk_score, status |
| `verification_requests` | id, user_id, selfie_r2_key, pose_id, status, reviewed_by, reviewed_at |
| `entitlements` | user_id, product (plus/superlikes/boost), qty, source, expires_at |
| `push_subs` | id, user_id, endpoint, keys_json |
| `audit_admin` | id, admin_id, action, target, details, created_at |

Notes de conception : `orientation` et `religion` éventuelle sont des **données sensibles RGPD art. 9** → champ séparé, consentement explicite dédié. Les messages complets ne sont **pas** en D1 (ils vivent dans le SQLite du DO) — c'est ce qui préserve le quota d'écritures.

### C.3 Cartographie de l'API

```
Auth          POST /auth/otp-request · POST /auth/otp-verify · POST /auth/google
              POST /auth/logout · GET /auth/me
Profil        GET/PUT /profile · POST /photos/presign · POST /photos/commit
              DELETE /photos/:id · PUT /preferences · POST /me/mode
Photos        GET /photos/:userId/url (presigned, contrôle d'autorisation par photo)
Questionnaire GET /questionnaire/level/:n · POST /questionnaire/answer
              GET /me/insights/:level
Découverte    GET /discovery/classic?cursor · POST /swipes (batch)
              GET /discovery/invisible?cursor · POST /invisible/handshake
Matches       GET /matches · GET /conversations · POST /conversations/:id/reveal-request
Temps réel    GET /ws/conversation/:id (WebSocket → Durable Object)
Sécurité      POST /reports · POST /blocks · POST /verification/selfie
              POST /moderation/precheck
Push          POST /push/subscribe · DELETE /push/subscribe
Admin         GET /admin/queues/moderation · GET /admin/queues/verification
              POST /admin/sanctions · POST /admin/verify-badge
```

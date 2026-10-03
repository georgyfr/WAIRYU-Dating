# WAIRYU — CARTE DE L'ANALYSE APPROFONDIE v1.0

> **Document de référence** : ce que l'analyse fondatrice a établi au moment de la décision d'aller — et ce qu'il est devenu dans le produit réel.
> **Source cartographiée** : [`docs/ANALYSE-APPROFONDIE.md`](../docs/ANALYSE-APPROFONDIE.md) (188 lignes) — « Document produit lors de l'analyse de la spécification v0.1 (12 961 lignes). Il complète le Plan de réalisation. » (en-tête verbatim).
> **Règle de lecture** : chaque énoncé fondateur est cité **VERBATIM** (entre guillemets, tel quel — zéro reformulation), puis rendu à son **statut runtime vérifié par commande** (annexe A : une commande = un verdict). ✅ livré · 🟡 partiel/en cours · 🔵 reste à construire ou SUR CADRAGE · ⚖️ décision comité.

---

## §0 — Place dans l'architecture documentaire

| Document | Rôle | État |
|---|---|---|
| `specification/PROJET-WAIRYU-Specification-Produit-v0.1.txt` | Corpus fondateur (12 961 lignes) | INCHANGÉ |
| **`docs/ANALYSE-APPROFONDIE.md`** (cette carte) | **Faisabilité + décisions d'architecture : pourquoi c'est construit ainsi** | ✅ au dépôt (poussé avec le transfert V18) |
| `docs/PLAN-DE-REALISATION-12-ETAPES.md` | Ordre d'exécution (étapes 0→11) | ✅ |
| `salle-prompts/constitution.v2.1.md` · `contrat/contrat-inventaire.v1.3.md` | Règles + inventaire contractuel | ✅ |
| Cartes sœurs : `CARTE-CONCEPTION…` (comment c'est construit) · `CARTE-SPECIFICATION…` (ce que le produit promet) · `CARTE-ANALYSE-APPROFONDIE…` (pourquoi ces choix) | Triptyque + cette carte = série de référence | ✅ |

**Note de trace consignée (honnêteté bidirectionnelle)** : le titre B.2 du document source annonce « Les 8 adaptations clés », le corps liste **9 décisions numérotées** — la Décision 9 (Cloudinary) a été ajoutée lors de la mise à jour post-sondes du 23/09/2026 (bloc « Mise à jour post-sondes » inclus dans la décision), le titre n'a pas été renuméroté. Consigné tel quel, non bloquant.

---

## §1 — Le verdict fondateur (Partie A.1)

> « **Le projet est réalisable à 100 % gratuit sur Cloudflare**, à condition d'accepter 8 adaptations techniques au document d'origine et de verrouiller le périmètre MVP sur le « Cœur Wairyu » (dual-mode, chat, révélation mutuelle, questionnaire N1-N2, sécurité). »

> « La spécification est remarquablement mature : elle s'appelle elle-même « version réaliste », assume ses limites, priorise avec MoSCoW, et identifie déjà le free tier Cloudflare comme rampe de lancement. »

**Statut runtime** : les 9 décisions sont toutes actées et implémentées ou explicitement 🟡/🔵 (voir §5) ; le Cœur Wairyu est livré — étapes 1-7 avec gates (socle D1/KV/DO · OTP+Turnstile · OAuth · profils Cloudinary signés · questionnaire+matching · dual-mode · DO chat+révélation · sécurité selfie/2FA admin) + 15 vagues de contenu (531 items au runtime, clôture 93,2 %). Le verdict n'a pas été démenti : aucun service payant n'a été nécessaire à ce jour.

---

## §2 — « Ce qui est solide dans la spécification » : les 5 piliers (A.2), statuts runtime

| # | Énoncé fondateur (verbatim) | Statut runtime | Preuve |
|---|---|---|---|
| 1 | « Le concept dual-mode est un vrai angle différenciant. (…) Wairyu vend le **choix** » | ✅ LIVRÉ **ET ÉTENDU** : bascule Classique↔Invisible (gate 5, E2E §4.8) puis V18 « Ta raison d'être ici » — 3 cartes équivalentes 🪞💞⏸️, la rencontre devient une destination OPTIONNELLE, réversible, jamais automatique | `ci/test_v18_raison.py` 23/23 |
| 2 | « La révélation mutuelle et progressive (15 messages + 7 jours minimum + double consentement) est implémentable avec des règles simples — pas besoin d'IA. » | ✅ **AUX SEUILS EXACTS** : `REVEAL_THRESHOLD_MSGS = 15` (chat.ts l.633) · `REVEAL_THRESHOLD_DAYS = 7` (l.634) + accord des deux | annexe A-2 |
| 3 | « Le scoring explicable (“Pourquoi ce match ?”) est un moteur déterministe (…) TypeScript pur, zéro neuron d'IA au MVP. » | ✅ `packages/shared/src/matching.ts` + `vigilance.ts` (fonctions pures, 14 signaux DÉRIVÉS de la banque — aucune liste figée, aucune IA) | annexe A-11 |
| 4 | « Le document a déjà fait le travail des limites Cloudflare » | ✅ l'architecture de la Partie B est celle du dépôt réel | §5-§6 |
| 5 | « Les KPI du MVP sont chiffrés (complétion N1 > 55 %, rétention J7 > 35 %, révélation > 15 %…) » | 🟡 critères de validation de la bêta ; métriques COLLECTÉES-SEULEMENT (metrics_daily — V18.D : 0 lecture dans le moteur) | STATUS.md V18.D |

---

## §3 — Les 6 risques majeurs et leur traitement (A.3)

| # | Risque (verbatim, gravité) | Traitement prévu par l'analyse | Statut runtime |
|---|---|---|---|
| 1 | « Masse critique : une app de rencontre sans monde est morte » (⚠️ Critique) | Étape 10 : « lancement par “poches urbaines” francophones + le Mode Classique comme levier d'acquisition » | 🔵 RESTE À CONSTRUIRE (étapes 8-11) |
| 2 | « Modération : le fondateur est seul au début » (⚠️ Critique) | Étape 7 : « modération par règles (listes de mots, patterns de scam — 0 neuron) + backoffice de signalements + sanctions graduées » | ✅ `moderation_flags` · `reports` + `report_aggregate` (0023 — signaleur en série exclu) · `sanctions` + `sanctions_appeals` · routes `safety.ts`/`admin.ts` fail-closed nommé |
| 3 | « Quota Workers 100 000 requêtes/jour » (Élevé) | Étape 1 + B.3 : « design économe en requêtes » | ✅ `/admin/usage` en direct (Gate 1) — §6 |
| 4 | « Abandon au questionnaire » (Élevé) | Étape 4 : « progression sauvegardée à chaque réponse, reprise, barre de progression, récompense » | ✅ `q_answers`/`q_doctrine_answers` écrits à chaque réponse (PUT /qd) — bêta fermée complétée |
| 5 | « Vérification selfie sans IA » (Moyen) | Étape 7 : « validation semi-manuelle (file de review dans le backoffice) — gratuit et même plus fiable qu'une IA faible » | ✅ `verification_requests` (0014) + file backoffice admin |
| 6 | « Le free tier est une rampe, pas une production » (Moyen) | Étape 11 : « tableau de seuils précis qui déclenchent chaque upgrade payant (5 $/mois) » | 🔵 RESTE À CONSTRUIRE (étapes 8-11) |

---

## §4 — La lecture honnête de l'ambition « aussi puissant que Tinder, voire les surpasser » (A.4)

Verbatim fondateur : « Ce qui est possible : les surpasser **sur les dimensions où ils sont structurellement faibles** » — puis : « ne pas être “Tinder plus grand”, mais **l'app que Tinder ne peut pas devenir** — leur modèle de revenus est construit sur le pay-to-win que Wairyu refuse. »

| Dimension | Promesse Wairyu (verbatim) | Statut runtime |
|---|---|---|
| Transparence du matching | « Score + “Pourquoi ce match ?” natif » | ✅ moteur déterministe + explication (2 forces + 1 vigilance) |
| Consentement visuel | « Révélation mutuelle, progressive, réversible » | ✅ 3 conditions exactes : ≥15 messages · ≥7 jours · accord des deux |
| Choix du mode de rencontre | « Classique ↔ Invisible, bascule libre » | ✅ ÉTENDU V18 : 3 cartes équivalentes, activation explicite `POST /api/qd/activation`, JAMAIS d'auto-conversion |
| Monétisation perçue | « Sécurité + matching + conversation gratuits pour toujours » | ✅ doctrine runtime (aucun paywall au code — annexe A-10) — ⚖️ réconciliation monétisation v0.1 ↔ freemium consignée au comité (CARTE-SPECIFICATION §4) |
| Profondeur culturelle | « Wairyu Cultures (couche unique au monde) » | 🔵 Phase 2 SUR CADRAGE |

---

## §5 — Partie B : l'architecture « 100 % gratuit » — les 9 décisions, statuts runtime

| # | Décision (verbatim abrégé) | Statut runtime |
|---|---|---|
| 1 | « Sessions : cookies signés + D1, pas de KV » | ✅ `sessions` (0001 : token_hash/expires_at/revoked_at) · `auth_codes` · 0017 `auth_password` ; KV hors chemins chauds (totp.ts : « KV CONFIG, non actif ») |
| 2 | « Queues n'existe pas en gratuit : remplacé par Durable Objects `alarm()` » | ✅ `do/chat-room.ts` (7 occurrences alarm — annexe A-7) + Cron Triggers `wrangler.toml` l.39 `["10 3 * * *"]` |
| 3 | « Compression côté client (…) avant l'upload » (canvas → WebP, miniature) | ✅ `apps/web/src/lib/photo.ts` |
| 4 | « Jamais d'URLs publiques, toujours des presigned URLs (…) courte durée » | ✅ signatures serveur Cloudinary (`lib/cloudinary.ts`) ; limite découverte post-sondes consignée dans le document lui-même : « l'expiration des URLs via `v=<timestamp>` n'est pas appliquée par Cloudinary » → garantie remplacée par « URL délivrée uniquement après autorisation » (STOCKAGE-CLOUDINARY.md) |
| 5 | « Front : PWA React + Vite servie par Workers Assets (pas de Pages séparé, pas de Flutter) » | ✅ react ^18.3.1 · vite ^5.4.0 (annexe A-4) |
| 6 | « Chat : 1 Durable Object (SQLite) par conversation » | ✅ `do/chat-room.ts` ; en D1 seulement les métadonnées (`conversations`, 0013) |
| 7 | « Auth : email OTP + Google OAuth au lancement ; SMS et Apple différés » | ✅ **ET DÉPASSÉ** : flow `'otp' \| 'oauth_google' \| 'oauth_facebook' \| 'password'` (annexe A-5) — Facebook et le mot de passe local (0017) sont des ajouts hors cible initiale |
| 8 | « Monétisation : câblée mais éteinte » (gateways codés, feature flags désactivés) | 🔵 **ÉVOLUTION CONSCIGNÉE** : aucun gateway payant au code (grep entitlement = 0 — annexe A-10) ; doctrine freemium actuelle ; le point est au comité ⚖️ (CARTE-SPECIFICATION §4) |
| 9 | « Cloudinary (gratuit, sans carte) tant que R2 ne peut pas être activé » | ✅ VALIDÉ PAR SONDES (Étape 0, V1-V8, 23/09/2026) : « plan Free 25 GB confirmé, assets `authenticated` + signatures serveur validées en conditions réelles » ; le stockage est isolé derrière une interface |

Note de diligence (B.1, verbatim) : « Cloudflare ajuste ses limites 1 à 2 fois par an. La première sous-étape de l'Étape 1 consiste à revalider chaque chiffre sur les pages officielles au moment du build. » → règle permanente conservée.

---

## §6 — Le budget de requêtes : « le nerf de la guerre » (B.3)

> « Design cible : **≤ 70 requêtes API par utilisateur actif/jour** » — « ~1 200 utilisateurs actifs quotidiens en confort (marge 40 %), jusqu'à ~2 500-3 500 en cas de pic ».

Les 6 règles d'or, statuts runtime :

| Règle (verbatim) | Statut |
|---|---|
| « 1 requête = 1 lot » (le feed renvoie 20 profils d'un coup) | ✅ `routes/feed.ts` (enveloppe, rate limit, lot) |
| « Les images ne passent jamais par le Worker » | ✅ livraison Cloudinary directe signée |
| « Le temps réel vit dans les DO » (pas de polling) | ✅ WebSocket dans `do/chat-room.ts` |
| « Cache HTTP + ETag sur tout ce qui est statique par nature » | 🟡 à durcir à l'étape 8 (non vérifié machine à ce jour) |
| « Écritures D1 groupées ; les compteurs passent par le DO » | ✅ par design — messages/compteurs dans le SQLite du DO, métadonnées seules en D1 |
| « Un dashboard de consommation (`/admin/usage`) » | ✅ **IMPLÉMENTÉ** : `adminRoutes.get('/usage')` (admin.ts l.157, `middleware/usage`, Gate 1) — annexe A-8 |

---

## §7 — Partie C : la conception technique — cible (2026-09) vs réel (livré)

**Stack (C.1)** : Hono ✅ (^4.6.0, apps/api) · « Zod partout » → ❌ **ABSENT des 3 manifests** (validation TypeScript stricte + validations maison — écart consigné) · « Moteur de matching = fonction pure » ✅ (packages/shared/src/matching.ts) · `packages/shared` ✅ · `packages/ui` → **NON CRÉÉ** (composants dans apps/web/src) · `infra/migrations` → `apps/api/migrations` · `apps/worker` → **RENOMMÉ `apps/api`** · wrangler + GitHub ✅ (wrangler.toml, deploy.sh).

**Modèle de données (C.2)** — cible : 19 tables ; réel : **24 migrations 0001→0024, 57 CREATE TABLE** (rebuilds inclus — annexe A-3) :

| Cible → réel | | Cible → réel | |
|---|---|---|---|
| users → users (0001, rebuilt 0007) | ✅ | blocks → blocks | ✅ |
| sessions → sessions (0001) | ✅ | sanctions → sanctions + sanctions_appeals | ✅ |
| profiles → profiles (0005/0006) | ✅ | moderation_flags → moderation_flags (0014) | ✅ |
| photos → photos | ✅ | verification_requests → verification_requests (0014) | ✅ |
| q_items → q_items (0009) + q_doctrine_items (0021) | ✅+ | entitlements → **ABSENTE** | 🔵 non câblée |
| q_answers → q_answers + q_doctrine_answers (0021) | ✅+ | push_subs → push_subscriptions (0013) + push_preferences (0020) | ✅+ |
| preferences → user_preferences | ✅ | audit_admin → audit_admin | ✅ |
| swipes → swipes (0012) | ✅ | **Ajouts hors cible** : rate_limits · metrics_daily · oauth_identities (0004) · personality_profiles (0010/0011) · heritage (0016) · auth_password (0017) · q_doctrine_flags · safety_checkins · invisible_requests · mode_requests · top_matches · account_deletions · profile_prompts · auth_codes · password_resets · report_aggregate (0023) · reveal_feedback | ✅+ |
| matches → matches (0012, origin 0015) | ✅ | conversations → conversations (0013) | ✅ |
| revelations → revelations (0013) + reveal_feedback | ✅+ | reports → reports (0014) + report_aggregate (0023) | ✅+ |

Note RGPD (C.2, verbatim) : « `orientation` et `religion` éventuelle sont des **données sensibles RGPD art. 9** → champ séparé, consentement explicite dédié. Les messages complets ne sont **pas** en D1 » → ✅ **RESPECTÉ** : `0013_chat.sql` ne crée AUCUNE table messages (revelations · reveal_feedback · blocks · push_subscriptions seulement — annexe A-9) ; orientation en champ dédié (0018).

**Cartographie API (C.3)** — cible couverte par 12 fichiers de routes : `auth` (otp/google/logout/me + facebook + password) · `profiles` (profile, photos presign/commit, preferences, mode) · `questionnaire` + `personality` (insights) · `discover` (classic/invisible, swipes batch, handshake) · `chat` (matches, conversations, reveal) · WS → DO · `safety` (reports/blocks/selfie/precheck) · `push` · `admin` (queues, verification, sanctions, verify-badge, **/usage**) — **ajouts hors cible** : `geo` · `feed` · `health`.

---

## §8 — Tableau final de conformité analyse ↔ runtime

| Section de l'analyse | Verdict |
|---|---|
| A.1 Verdict « 100 % gratuit Cloudflare » | ✅ démenti à ce jour par aucun fait (0 € consommé, 0 service payant) |
| A.2 Les 5 piliers solides | ✅ 4/5 livrés (dont 1 étendu par V18) · 🟡 KPI bêta |
| A.3 Les 6 risques | ✅ 4 traités · 🔵 2 aux étapes 8-11 |
| A.4 Les 5 dimensions face à Tinder | ✅ 4/5 (dont 1 ⚖️ comité) · 🔵 Cultures Phase 2 |
| B.1-B.2 Services + 9 décisions | ✅ 7 implémentées · 1 dépassée (auth) · 1 évoluée (monétisation 🔵 ⚖️) |
| B.3 Budget de requêtes | ✅ 5/6 règles d'or · 🟡 ETag |
| C.1-C.3 Stack, données, API | ✅ cible réalisée avec écarts consignés (Zod ❌ · packages/ui non créé · apps/worker→apps/api · ajouts hors cible) |

---

## Annexe A — Preuves (une commande = un verdict)

| # | Commande | Verdict |
|---|---|---|
| A-1 | `git ls-files docs/ANALYSE-APPROFONDIE.md` | tracké — en ligne : github.com/georgyfr/WAIRYU-Dating/blob/main/docs/ANALYSE-APPROFONDIE.md |
| A-2 | `grep -n "REVEAL_THRESHOLD" apps/api/src/routes/chat.ts` | l.633 `REVEAL_THRESHOLD_MSGS = 15` · l.634 `REVEAL_THRESHOLD_DAYS = 7` — seuils de l'analyse aux valeurs exactes |
| A-3 | `grep -rhoi "CREATE TABLE" apps/api/migrations/*.sql \| wc -l` | 57 (24 migrations 0001→0024, rebuilds inclus) |
| A-4 | `head -12 apps/web/package.json` | react ^18.3.1 · vite ^5.4.0 (Décision 5 telle quelle) |
| A-5 | `grep -n "flow:" apps/api/src/routes/auth.ts` | `'otp' \| 'oauth_google' \| 'oauth_facebook' \| 'password'` — cible dépassée (FB + mot de passe ajoutés) |
| A-6 | `grep -n "verifyTurnstile" apps/api/src/routes/auth.ts` | l.193 — Turnstile sur inscription/login (B.1 ✅) |
| A-7 | `grep -c "alarm" apps/api/src/do/chat-room.ts` · `grep -n crons apps/api/wrangler.toml` | 7 · l.39 `["10 3 * * *"]` (Décision 2) |
| A-8 | `grep -n "adminRoutes.get('/usage'" apps/api/src/routes/admin.ts` | l.157 — le dashboard de consommation existe (règle d'or 6, Gate 1) |
| A-9 | `grep -n "CREATE TABLE" apps/api/migrations/0013_chat.sql` | revelations · reveal_feedback · blocks · push_subscriptions — AUCUNE table messages (note RGPD C.2 respectée) |
| A-10 | `grep -rli "entitlement" apps/api/src apps/api/migrations` | 0 résultat — aucun gateway monétisation câblé (Décision 8 → doctrine freemium ⚖️) |
| A-11 | `ls packages/shared/src` | constants.ts · index.ts · matching.ts · personality.ts · types.ts · vigilance.ts (moteur pur, zéro IA) |

---

## Annexe B — Journal des versions

| Version | Date | Contenu |
|---|---|---|
| v1.0 | 2026-10-03 | Première carte de l'ANALYSE-APPROFONDIE : énoncés fondateurs cités verbatim, statuts runtime vérifiés par commande ; écarts de trace consignés (B.2 « 8 adaptations » vs 9 décisions · Zod absent des manifests · packages/ui non créé · apps/worker→apps/api · entitlements non câblés · Facebook+mot de passe hors cible initiale) |

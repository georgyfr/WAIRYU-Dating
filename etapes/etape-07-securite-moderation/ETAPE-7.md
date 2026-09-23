# Étape 7 — Sécurité & modération (livrée 2026-09-23)

Gate 7 **validée** : cycle complet signalement → review → sanction testé E2E ; un message
de scam type est attrapé et BLOQUÉ par les règles ; le badge « Identité vérifiée » est
visible sur le profil, les cartes du feed et dans les listes de matchs/chat.

## 1. Vérification selfie semi-manuelle (plan 7.1)

- `POST /api/safety/verification/start` : 3 poses **aléatoires imposées**
  (`SELFIE_POSES` mélangées par Fisher-Yates crypto — impossible de préparer une photo
  papier), reprise possible (l'ordre est RE-généré à chaque reprise), TTL 48 h, 5/jour.
- `POST /api/safety/verification/submit` : multipart `pose0..2` (garde MIME `image/*`,
  ≤ 2 Mo) → upload Cloudinary **authentifié** (`{root}/verifications/{user}/{req}/…`,
  signature calculée côté Worker) → statut `pending`.
- `GET /api/safety/verification` : statut (`none | awaiting | pending | approved |
  rejected`), poses restantes, motif de refus, badge.
- **Backoffice** : `GET /admin/verification-queue?status=` (3 URLs signées w_400),
  `POST /admin/verification/:id/approve` (→ `users.verified_at`, badge immédiat) /
  `:id/reject {reason}` (→ motif transmis à l'utilisateur).
- Front (`Mon compte`) : parcours guidé (pose 1/2/3 + libellés), capture caméra
  (`capture="user"`), états review/refus/retry, badge « ✓ Vérifié·e ».

## 2. Modération automatique par règles — 0 neuron (plan 7.2)

`lib/moderation.ts` — score de risque 0-100 sur CHAQUE message texte, calculé **dans le
DO ChatRoom avant livraison** :

| Verdict | Seuil (SAFETY) | Effet |
|---|---|---|
| `deliver` | < 35 | livré |
| `flag` | ≥ 35 | livré MAIS file `moderation_flags` (seq attachée) |
| `block` | ≥ 70 | **refusé** : ni persisté ni diffusé (WS `type:error` / HTTP 422 → 400 « bloqué ») |

- Familles : haine/insultes graves (FR+EN), menaces/harcèlement (phrases), drogues
  (vente), **scam** : liens externes (http/www/wa.me/t.me/bit.ly/.xyz/.top/.click/onlyfans…),
  crypto/trading, demandes d'argent (western union, carte cadeau, « frais de douane »…),
  contacts externes (whatsapp/telegram/snap/insta…), numéros de téléphone (≥ 9 chiffres
  consécutifs après fusion des séparateurs).
- **Normalisation anti-contournement** : minuscules, accents retirés, leet inversé
  (`wh@tsapp`, `bitc0in`, `paypal$$`), répétitions réduites (`paypaaaal`).
- Flags best-effort (`ctx.waitUntil`) en D1 : excerpt tronqué à 120 caractères (RGPD),
  catégories JSON, `action` block|flag — jamais bloquants pour la conversation.

## 3. Signalement (plan 7.3)

- `POST /api/reports {targetUserId, category, details?, conversationId?}` :
  catégories validées (`REPORT_CATEGORIES` : content, behavior, fake, minor, scam,
  harassment, other), 10/jour, auto-signalement refusé.
- **Protection immédiate** : blocage DANS LES DEUX SENS (`blocks` ×2) + unmatch
  (match clôturé, swipes/demandes de la paire retirées, DO `/shutdown`) — la review
  admin a lieu a posteriori avec le contexte complet.
- **Le blocage est définitif** : `validTarget` refuse tout re-like tant qu'un bloc
  existe dans un sens ou dans l'autre (403 « n'est plus disponible pour toi »).

## 4. Backoffice de modération + 2FA TOTP (plan 7.4)

- Files : `GET /admin/reports?status=` · `GET /admin/reports/:id` (**contexte de
  conversation via le DO**, ≤ 200 messages + historique de sanctions du signalé) ·
  `GET /admin/flags?status=` · `GET /admin/checkins?status=flagged`.
- **Actions** `POST /admin/reports/:id/resolve`, `/admin/flags/:id/resolve`,
  `/admin/checkins/:id/resolve` : `dismiss | warn | suspend (1-30 j) | ban | unban`
  — journalisées dans **`audit_admin`** (immuable).
  - `warn` → `users.warned_at` ; `suspend` → `users.suspended_until` (**l'API refuse
    tout /api/* sauf /api/me et logout avec un 403 daté** ; le front affiche une
    bannière) ; `ban` → statut `banned` + révocation immédiate de toutes les sessions ;
    `unban` → levée de sanction.
- **2FA TOTP (RFC 6238, 100 % Workers, zéro dépendance)** : `POST /admin/2fa/setup`
  (secret base32 160 bits + URI otpauth), `/2fa/activate {token}` (±1 pas de 30 s,
  comparaison à temps constant), `/2fa/disable` (token dans le body OU l'en-tête),
  `/2fa/status`. **Quand elle est active, TOUT /admin/* exige l'en-tête
  `X-Admin-TOTP`** (KV `admin:2fa`) — en plus du jeton porteur existant.

## 5. Check-in sécurité (plan 7.5, §6)

- `POST /api/safety/checkins {conversationId, whenTs}` : « Je vois X le [date] »
  (≤ 30 jours, ≤ 5 actifs, conversation active requise).
- Cron quotidien : rappel push **« Ça s'est bien passé ? »** après la date
  (`sendPushToUser`, dégradation gracieuse sans VAPID).
- Clôture : `POST /api/safety/checkins/:id/done {outcome: ok|flagged}` — un check-in
  `flagged` remonte au backoffice (traitement : contact / sanction).

## 6. Anti-fraude basique (plan 7.6)

- **Multi-comptes par empreinte légère** : `GET /admin/multi-accounts?userId=` —
  détecte les comptes partageant (ip_hash, user_agent_hash) sur des sessions actives
  ≤ 30 jours. **Zéro nouvelle donnée** : réutilise les colonnes posées à l'Étape 2.
- Turnstile OTP (production, fail-closed) et anti-spam messages (30/min DO) +
  quotas de découverte : déjà en place (Étapes 2/5/6) — inchangés.

## 7. Confidentialité v1 (plan 7.7)

- `GET/PUT /api/settings/privacy` : **paused** (masqué de TOUS les feeds + swipe
  refusé 403), **incognito** (masqué du feed SAUF pour les personnes à qui il a
  envoyé un like — « likes reçus »), **modeVisible** (étiquette « profil Invisible »
  sur les cartes ; le FLU des photos reste TOUJOURS appliqué — §4.6).
- Filtres appliqués dans `lib/discovery.ts` (pool SQL) → valables pour le feed,
  le Top du jour et le cron (une seule implémentation).
- `/api/me` enrichi : `verified`, `suspendedUntil` (bannière front) ; badges
  `verified` ajoutés aux `FeedProfile`, `MatchDto.other`, `ChatStateResponse.other`.

## Migration 0014_safety.sql (incrémentale, zéro perte)

- `users` : +6 colonnes ALTER (paused, incognito, mode_visible, suspended_until,
  warned_at, verified_at) — appliquée staging ET prod.
- Tables feuilles : `verification_requests`, `reports`, `moderation_flags`,
  `audit_admin`, `safety_checkins` — aucun CHECK (leçon 0008).

## Validation (Gate 7)

- Smoke dédié `scripts/smoke_etape7.sh` : **56/56 verts** sur staging —
  confidentialité (incognito absent/present selon likes, pause, swipe 403),
  vérification selfie E2E (start→3 poses→submit→review admin→badge dans feed/me),
  modération (scam argent+téléphone BLOQUÉ et absent de l'historique, crypto FLAGUÉ
  mais livré, seq null pour les blocks), sanctions (warn, suspend_1d → 403 API,
  unban → 200), signalement E2E (blocage mutuel + conversation fermée + contexte DO
  dans le backoffice + re-like 403), check-ins (création, clôture ok/flagged,
  traitement backoffice), multi-comptes, 2FA TOTP complète (setup/activate/refus/
  en-tête requis/disable).
- Régressions : étape 3 **35/35**, 3b **24/24**, 4 **33/33**, 5 **68/68**,
  6 **58/58** (dont sonde WS 10/10). (La suite étape 2 est obsolète depuis
  l'activation Brevo — plus de devCode ; remplacée par `admin/test-session`.)
- Déploiements : staging (migration 0014, 3 itérations de correctifs — voir
  STATUS journal) puis **prod** (9e046a26) : health 200, accueil 200, gardes
  anonymes 401 ×5, admin 401, chaînes UI Étape 7 présentes dans le bundle.

## Bugs rattrapés pendant la mise en service

1. `up.mode_visible` → `u.mode_visible` (mauvais alias SQL → feed 500) — attrapé par
   les smoke tests (wail tail D1).
2. Route `/admin/2fa/disable` lisait le token du body uniquement alors que le
   middleware exige l'en-tête → catch-22 ; le token est désormais accepté dans les deux.
3. `MatchDto.other.verified` mal placé au niveau racine du DTO (typage) — corrigé.
4. Latence de réplication D1 : la détection multi-comptes échouait sur les sessions
   créées < 2 s avant la requête → sleep dans le smoke (+ rotation IPv6 constatée :
   `curl -4` pour l'empreinte stable).

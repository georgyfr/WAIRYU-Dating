# Étape 3 — Profils & photos protégées

> Livrée le 2026-09-23 (staging + production). Gate 3 : profil complet en moins
> de 5 minutes (assistant guidé, sauvegarde à chaque étape) **et** sécurité
> photos prouvée par un test automatisé écrit : 35/35 assertions vertes
> (`scripts/smoke_etape3.sh`, staging), dont la matrice complète d'autorisation.

## 1. Ce qui est en place

### 1.1 Assistant de création de profil (6 étapes, reprise automatique)

- Route front `#/profile` (écran `screens/Profile.tsx`) — accès protégé par
  session ; après inscription/connexion, `/api/me` renvoie `profileComplete` et
  le routeur envoie vers l'assistant si le profil est incomplet.
- Étapes : ① identité (prénom, année de naissance 18+, genre) → ② orientation
  + intention + **consentement explicite dédié** (case dédiée, horodaté en
  `users.profile_consent_at`) → ③ ville + géolocalisation **approximative**
  (arrondie au dixième de degré ≈ 11 km, stockée `geo:lat,lon` — jamais de GPS
  précis) + bio (150 car.) → ④ 3 prompts (bibliothèque de 9, réponses 150 car.)
  → ⑤ photos (≥ 1, ≤ 6) → ⑥ préférences + choix du mode (écran explicatif
  Classique vs Invisible).
- Chaque étape est sauvegardée via `PUT /api/profile` (mise à jour partielle,
  validation serveur exhaustive) — abandon = reprise à l'étape remplie.
- L'écran compte affiche l'état de complétion et le bouton « Compléter/Modifier ».

### 1.2 Pipeline photo (client → Worker → Cloudinary)

- Côté client (`lib/photo.ts`) : recadrage **cover 4:5 centré** sur canvas
  1024×1280 puis compression **WebP q≈0.82** (~150-300 Ko) ; fallback JPEG
  automatique si le navigateur ne sait pas encoder WebP. Le client ne parle
  **jamais** directement à Cloudinary.
- `POST /api/profile/photos` (multipart) : validation (webp/jpeg/png ≤ 2 Mo,
  dimensions 64-4096 px, ≤ 6 photos, rate limit 20/h/utilisateur) puis upload
  **signé côté Worker** (type `authenticated`, public_id =
  `{root}/photos/{userId}/{UUIDv4}`) puis commit D1. Décision conforme à
  `docs/STOCKAGE-CLOUDINARY.md` §4 (upload direct client rejeté).
- Réordonnancement : `POST /api/profile/photos/reorder` — la position 0 est la
  photo principale. Suppression : `DELETE /api/profile/photos/:id` (marquage D1,
  renumérotation, **destroy Cloudinary** — l'asset disparaît du CDN).

### 1.3 URLs de livraison signées + autorisation par photo

- `GET /api/photos/:photoId/url?variant=sharp|blur` : le Worker vérifie la
  session puis les droits en D1, et génère l'URL signée **à la volée**. Le
  secret Cloudinary ne quitte jamais le serveur ; la photo n'est jamais une URL
  brute. Variante blur = `c_limit,w_400` + flou **CSS** côté front (aucune image
  floutée stockée) ; vignette = `c_limit,w_200`.
- **Matrice d'autorisation** (Gate 3, testée automatiquement) :

| Demandeur | Variante | Propriétaire classic | Propriétaire invisible |
|---|---|---|---|
| Lui-même | sharp + blur | ✅ | ✅ |
| Utilisateur actif | sharp | ✅ | **403 refusé** (révélation consentie = Étape 6) |
| Utilisateur actif | blur | ✅ | ✅ |
| Anonyme | — | 401 | 401 |
| `photoId` inventé | — | 404 | 404 |

- Défense en profondeur contre la devination d'URL : asset `authenticated`
  (401/404 sans signature), public_id UUIDv4 non devinable, signature liée à la
  transformation exacte (une URL blur ne peut pas être « dé-floutée »), URL
  trafiquée → bloquée. Suppression/compte supprimé → asset détruit (404).

### 1.4 Préférences de découverte

- `GET/PUT /api/profile/preferences` : mode par défaut (classic/invisible),
  genres recherchés (women/men/everyone), âge min/max (18-99), distance (1-500
  km), intention optionnelle. Upsert validé ; alimente la découverte Étape 5.

### 1.5 RGPD étendu

- Export (`GET /api/account/export`) : nouvelle section `profile` (prompts,
  métadonnées photos, préférences).
- Suppression (`DELETE /api/account`) : purge Cloudinary de toutes les photos
  (hook noté en Étape 2, implémenté ici) + suppression D1 (photos, prompts,
  préférences, compte) + trace anonyme J+30 inchangée. Testé : l'URL d'une
  photo d'un compte supprimé répond 404.

## 2. Bugs détectés et corrigés pendant l'étape

- **URLs signées avec transformation refusées (401 Cloudinary)** : la
  transformation figurait dans la signature mais pas dans le chemin de l'URL.
  Structure correcte (verrouillée par la sonde V5, revalidée en réel) :
  `.../authenticated/s--{sig}--/{transformation}/v{version}/{public_id}`.
- Ancien `devCode` OTP n'existe plus sur staging (Brevo actif) → nouvel
  utilitaire de test `POST /admin/test-session` : **staging uniquement** (garde
  `ENVIRONMENT` + jeton admin requis + domaines réels interdits), crée une
  session de test pour les smoke tests automatisés. Inopérant en production
  (404), testé.

## 3. Tests

- `scripts/smoke_etape3.sh` — **35/35 vertes** sur staging : parcours profil
  complet A/B, uploads, vignette/flou, réordonnancement, suppression, matrice
  d'autorisation complète, RGPD (export + suppression), garde staging de
  test-session, régressions auth (config, Google/Facebook 302, SPA 200).
- Vérifications production : tables 0005 migrées, `profile` 401 sans session,
  config auth inchangée (brevo + google + facebook), SPA 200.
- Typecheck API + web : zéro erreur. Build Vite OK.

## 4. Limites assumées (documentées)

- L'URL signée n'expire pas (sonde V9) : mitigations inchangées (public_id non
  devinable, URL délivrée uniquement aux personnes autorisées, suppression
  révocable). Évolution possible : `auth_token` Cloudinary ou proxy Worker.
- La contrainte D1 `birth_year BETWEEN 1930 AND 2010` (0001) deviendra trop
  serrée en 2029 ; l'API applique déjà la borne correcte (année − 18).
- La modération photo (`status = 'pending'`) est câblée en D1 mais non active :
  elle arrive avec l'Étape 7 (Sécurité & modération). Toute photo créée est
  `active`.

## 5. Reste fondateur (Gate 3)

- Parcours réel mobile : créer un compte → compléter le profil en < 5 min →
  vérifier que la photo principale apparaît bien sur l'écran compte.
- Puis Étape 4 — Questionnaire progressif & moteur de matching.

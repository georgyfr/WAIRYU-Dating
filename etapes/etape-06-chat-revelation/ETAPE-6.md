# ÉTAPE 6 — Chat temps réel & révélation

> Livraison du 2026-09-23 · statut : **livrée, Gate 6 validée par tests E2E** (staging), déployée staging + production.
> Le plus gros morceau du plan (§ plan 6, spécification §4.5 / §4.8 / §4.9).

## 1. Ce qui est livré

### 1.1 Chat temps réel — Durable Object `ChatRoom` (plan 6.1)
- **Une conversation = un DO** (`idFromName(conversationId)`) avec **SQLite embarqué** :
  `messages` (seq monotone AUTOINCREMENT, sender, kind, body, duration_ms, meta, created_at),
  `reads` (accusés de lecture par membre), `meta` (cid, members, mode, created_at, closed, revealed).
- **WebSocket par participant via l'API d'HIBERNATION** (`acceptWebSocket` + tags userId) :
  zéro facturation runtime à l'arrêt, réveil à l'arrivée d'un message — le choix free tier assumé.
- **Protocole** : client→DO `hello` / `msg` / `typing` / `read` / `ping` ; DO→client `ready` /
  `msg` (écho + livraison) / `typing` / `read` / `presence` / `system` / `error` / `pong`.
  ⚠️ Leçon de la sonde : **aucun envoi serveur pendant le fetch d'upgrade** (le socket client
  n'est pas encore établi) → poignée `hello`→`ready` à l'open.
- **Présence** : broadcast `presence online` au hello, `offline` au close (inconditionnel —
  le socket sortant peut être encore compté).
- **Accusés de lecture** : `{type:'read', upto}` → persisté dans `reads`, diffusé à l'autre ;
  le front affiche ✓ / ✓✓ (vu).
- **« Est en train d'écrire… »** : événement éphémère `typing`, jamais persisté, TTL 4 s côté front.
- **Historique paginé** (plan 6.3) : page 200 par défaut, pagination par curseur `?before=seq`,
  `hasMore` renvoyé par le DO.
- **Anti-spam** : 30 messages/minute/utilisateur en mémoire DO (fenêtre glissante 60 s) —
  le fallback HTTP a son rate limit D1 dédié (240/h).
- **Fallback HTTP** : `POST /api/chat/:id/messages` (texte) pour clients sans WS et tests.

### 1.2 Auth WS sans cookie — tickets HMAC
- `GET /api/chat/:id/ws-ticket` → ticket `base64url(userId.conv.exp) + '.' + HMAC-SHA256`
  (clé `SESSION_HMAC_KEY`), **TTL 120 s** ; `GET /api/chat/:id/ws?ticket=…` pour l'upgrade.
- Le navigateur same-origin peut aussi connecter par cookie ; le ticket unifie
  navigateur / futur client mobile / sondes automatisées (60 tickets/h).
- Le Worker valide session-ou-ticket **+ appartenance au match actif**, puis transfère la
  requête Upgrade au DO (route `/connect`).

### 1.3 Écran de chat unifié — canvas commun (plan 6.2, spec §4.9)
- Route front **`#/chat/:conversationId`** (garde session) ; ouverture depuis Mes matchs.
- Un seul canvas quel que soit le mode : bulles (miennes/leurs), horodatage, accusés ✓/✓✓,
  barre d'emojis rapide, envoi Enter, textarea auto-limitée (2000).
- **Voice notes** (MediaRecorder → Opus/WebM ≤ 60 s) : 🎤 → enregistrement avec chrono →
  annulation possible → upload `POST /api/chat/:id/voice` (garde **MIME audio/***, ≤ 512 Ko)
  → Cloudinary **resource_type video** authentifié (signature serveur) → message `kind:voice`
  avec **URL signée** générée à la lecture (version+format mémorisés dans `meta` du message).
- Indicateur de présence + saisie dans l'en-tête, mode de conversation (chip Classique/Invisible),
  reconnexion automatique (5 tentatives à backoff croissant).

### 1.4 Compteurs de révélation (plan 6.4, spec §4.5.2)
- `GET /api/chat/:id/state` : `messagesCount` (COUNT(*) du DO), `days` (created_at conversation),
  `revealEligible` = **mode Invisible ET ≥ 15 messages ET ≥ 7 jours ET pas encore révélée**.
- La carte d'état s'affiche dans le chat : progression `X/15 messages · Y/7 jours` puis,
  à l'échéance, le bouton **« Je suis prêt·e à me révéler »**.

### 1.5 Flux de révélation (plan 6.5, spec §4.5.2-§4.5.6)
- **Demande** : `POST /api/chat/:id/reveal` — double confirmation côté front (rappel honnête :
  « une capture d'écran reste techniquement possible »), garde serveur d'éligibilité (403 sinon),
  une seule demande `pending` par conversation (index partiel unique).
- **Consentement explicite de l'autre** : `POST /api/chat/:id/reveal/respond` — seul le membre
  non demandeur peut répondre ; **accept** ⇒ `revelations.status='accepted'` +
  `conversations.revealed_at` (batch D1) → photos débloquées pour LES DEUX ; **decline** ⇒
  la conversation continue en Mode Invisible, **rien ne change** (§4.5.6), demande repossible.
- **Événements temps réel** : le DO diffuse `reveal_requested / reveal_accepted /
  reveal_declined` aux sockets actifs + **push** au membre hors ligne.
- **Anti-capture honnête** (plan 6.6) : filigrane discret « Prénom · date » sur les avatars
  révélés + message éducatif permanent — dissuader, pas promettre l'impossible (§4.5.4).
- **Feedback post-révélation** : `POST /api/chat/:id/reveal/feedback` — Continuer / Ami /
  Pas pour moi (une réponse par personne, modifiable, **jamais montré à l'autre**) ;
  `bothDone` quand les deux ont répondu — nourrit les données de matching (table `reveal_feedback`).

### 1.6 Unmatch propre (plan 6.7)
- `POST /api/chat/:id/unmatch {block?:boolean}` : le match est clos **pour les DEUX**
  (une écriture partagée `unmatched_at/unmatched_by`) ;
- la paire redevient découvrable (swipes + demandes « Discuter » de la paire supprimés —
  le verrou anti-harcèlement reprend à zéro) ;
- **blocage en 1 clic** : table `blocks` (sens unique) — le pool de découverte exclut les
  paires bloquées **dans les deux sens** ;
- le DO se verrouille (`/shutdown`) : broadcast `unmatched` + fermeture des WS + meta `closed`
  (toute route de chat renvoie 404 ensuite → **re-floutage automatique**, aucune URL signée
  de chat ne reste exploitable) ;
- **re-match possible** : le conflit de paire réactive le match, l'historique de conversation
  est conservé (§4.8 « jamais de perte ») et le DO rouvre (`reset`).

### 1.7 Notifications Web Push VAPID (plan 6.8)
- **Implémentation 100 % Workers, zéro dépendance** (`lib/push.ts`) : JWT ES256 (RFC 8292)
  + chiffrement `aes128gcm` (RFC 8188/8291) via `crypto.subtle` (ECDH P-256 + HKDF + AES-GCM) ;
  abonnements en D1 (`push_subscriptions`, 1 ligne/appareil, UA tronqué), nettoyage 404/410.
- **Déclencheurs** : nouveau message (**uniquement si le recipient n'a pas de WS actif sur
  cette conversation**), nouveau match (les 3 chemins : swipe réciproque, acceptation
  handshake, double « Discuter »), demande/révélation acceptée, passerelle acceptée.
- **Dégradation gracieuse** : sans secrets `VAPID_*`, `GET /api/push/key` répond
  `{enabled:false}` et **rien ne casse** (aucune exception, aucun coût).
- **Réglages** : section Notifications dans Mon compte — activation (permission + SW +
  subscribe) et désabonnement en 1 clic ; Service Worker `public/sw.js` minimal
  (affichage + clic → navigation SPA, aucune interception de fetch).

## 2. Schéma D1 — migration 0013 (incrémentale, zéro perte)

| Objet | Rôle |
|---|---|
| `conversations.revealed_at` (ALTER) | révélation accordée (consentement mutuel) |
| `revelations` | demandes de révélation (`pending`/`accepted`/`declined`, index partiel unique sur pending) |
| `reveal_feedback` | feedback post-révélation (PK conversation+user) |
| `blocks` | blocages 1 clic (PK user+blocked, exclusion bidirectionnelle du pool) |
| `push_subscriptions` | abonnements Web Push (endpoint PK, p256dh/auth) |

Aucun CHECK (leçon 0008) — validations API. Les MESSAGES vivent dans le SQLite du DO ;
D1 ne stocke que l'état partagé. Le DO est repeuplé à chaque connexion (`/init` best-effort :
cid, members, mode, created_at, reset).

## 3. Sécurité & confidentialité — invariants tenus

1. **Photo floutée ⇔ (mode conversation = invisible) ET (révélation non accordée)** — piloté
   par le MODE DE LA CONVERSATION (§4.8), jamais par le mode de découverte des membres.
2. Après unmatch : plus aucune route de chat ne répond → re-floutage implicite, les URLs
   signées existantes restent bornées par leur autorisation d'origine.
3. Aucune révélation unilatérale : le consentement est un processus (demande → accord
   explicite → double confirmation à la demande), révocable avant acceptation (§4.5.3).
4. Push **jamais** envoyé pour un message si le recipient a la conversation ouverte
   (« hors conversation active ») ; respect des réglages (désabonnement = fin immédiate).
5. Anti-spam double étage (DO en mémoire + D1 en fenêtre fixe) ; tickets WS signés et bornés
   dans le temps.

## 4. Validation — Gate 6

### Smoke dédié `scripts/smoke_etape6.sh` — **58/58 verts** (staging)
Protections anonymes (401 ×6) → handshake Invisible E2E → état initial (0/15, 0/7) →
**sonde WebSocket Node `ws_probe.mjs` 10/10** (ready/2 membres, présence ×4, livraison msg + seq,
accusé « vu », indicateur de saisie) → franchissement des 15 messages (fallback HTTP) →
historique paginé (10 + 7, hasMore) → **voice note WAV réelle** uploadée/URL signée
Cloudinary `video/authenticated`/durée → garde MIME (image rejetée 400) → backdate admin +8 j
(staging only) → **éligibilité vraie** → **refus : rien ne change** (§4.5.6) → demande suivante →
**accord : révélée, photo nette pour les deux** → feedback ×2 (bothDone, inconnu 400) →
push dégradé sans VAPID (enabled:false) → **unmatch+blocage** (matches vides ×2, état 404,
ticket 404, message 404, exclusion bidirectionnelle du feed) → RGPD (suppression des 2 comptes).

### Régression complète — zéro impact
`etape 3b 24/24` · `etape 4 33/33` · `personnalité 31/31` · `prefs types 26/26` ·
`etape 5 68/68` · `etape 6 58/58`.

### Bugs attrapés puis corrigés par les tests
1. **`SqlStorage.exec`** n'accepte ni les placeholders `?N` ni des bindings en tableau →
   passage en `?` positionnels variadiques (le smoke a détecté un 500 silencieux du DO).
2. **Message perdu pendant l'upgrade WS** → protocole `hello`/`ready` (démontré par la sonde).
3. **Présence offline jamais diffusée** (socket encore compté au close) → broadcast
   inconditionnel.
4. **Refus de révélation sans effet** (`.bind()` sans `.run()` dans la branche decline) →
   révélé par l'incohérence « declined répondu mais pending toujours actif » ; confirmé par
   lecture D1 directe.
5. Re-match après unmatch restauré (conflit de paire réactivant le match + `reset` DO).
6. Garde MIME sur les voice notes (un JPEG déguisé serait parti chez Cloudinary).

### Déploiements
- **Staging** : migration 0013 (5 objets), versions `a7a82736 → 5633074b → 3edd61a9`,
  smoke complet vert.
- **Production** : `8358de25` (migration 0013 appliquée — `revelations/blocks/
  push_subscriptions` créées, `revealed_at` en place, compteurs intacts : 1 user,
  0 conversations), gardes anonymes 401 ×3, accueil 200, push `enabled:false`
  (VAPID non posés — activation sans redéploiement le jour où les clés sont fournies).

## 5. Reste à faire (hors périmètre Étape 6)
- Pose des secrets `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` / `VAPID_SUBJECT`
  (génération locale, `wrangler secret put`) → push actifs sans redéploiement.
- Test push réel sur Android/iOS (Gate 6 « push reçues ») après pose des clés.
- Conversations « load more » au-delà de 200 messages déjà couverts par le curseur ;
  réactions emoji par message (Phase 2, la barre rapide est en place).
- Étape 7 — Sécurité & modération (signalement, vérification selfie, filet admin).

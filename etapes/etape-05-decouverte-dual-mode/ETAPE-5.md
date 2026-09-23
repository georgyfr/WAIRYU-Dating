# Étape 5 — Découverte dual-mode (Classique & Invisible)

> Livrée le 2026-09-23 · Gate 5 validée (match Classique E2E + handshake Invisible E2E + bascule de mode sans perte de conversation — cas §4.8 vérifiés).

## 1. Ce qui a été livré

### 5.1 Mode Classique — pile de cartes + swipe (plan 5.1)
- **Pile de cartes mobile-first** (`#/discover`) : carte courante + carte suivante en fond ;
  **swipe tactile** via pointer events (touch + souris), seuil 90 px (`DISCOVERY.swipeThresholdPx`),
  tampons visuels ♥ / ✕ pendant le drag, micro-animation de sortie à gauche/droite.
- **Boutons d'action** : ✕ Passe · ✶ Super Like · ♥ Like · ↺ Rewind — tous pilotables au doigt.
- **Match mutuel** : réciprocité détectée au second like (like ou super) → création du match
  + de la **conversation** (table `conversations`, mode `'classic'`) → écran « C'est un match ! »
  avec accès direct à « Mes matchs ».
- **Rewind** (1/jour gratuit) : annule MA dernière action (DELETE du swipe) ; si elle avait créé
  le match, match + conversation sont retirés (aucun message échangé à ce stade — le chat arrive
  en Étape 6). Rien à annuler ⇒ quota non consommé.
- **Filtres de base** : panneau âge min/max, distance (1-500 km), « Montre-moi », intention —
  `PUT /api/profile/preferences` puis rechargement du deck.

### 5.2 Mode Invisible — Explorer / Discuter + handshake (plan 5.2)
- **Cartes floutées** : photo en variante 400 px + flou CSS (rien de net n'est jamais transmis),
  **score** de compatibilité, **archétype** + pastilles d'affinité, **bio**, **prompts** (désormais
  remplis dans le feed), **extraits de questionnaire partagés** (`highlights` : « « question » —
  comme toi : réponse » pour ≤ 2 réponses identiques, valeurs d'abord).
- **Pas de swipe binaire** (spec §4.2.5) : on explore librement ; le bouton d'engagement est
  **« ✉ Demander à discuter »** — le **handshake** : la personne reçoit la demande, l'accepte ou passe.
- **Boîte de réception** sur l'écran Découvrir : demandes reçues (Accepter / Passer) + suivi des
  demandes envoyées (En attente / Acceptée ✓ / Déclinée).
- **Règles du handshake** (déterministes, documentées dans `routes/discover.ts`) :
  - acceptation ⇒ match + conversation **mode `'invisible'`** (photos floutées jusqu'à la
    révélation consentie — Étape 6) ;
  - **double « Discuter » = match immédiat** (spec §6.2.4 : les deux ont cliqué) ;
  - une demande **déclinée ne peut pas être renvoyée** par la même personne (index unique
    `(from_user, to_user)` — anti-harcèlement) ; l'autre sens reste possible ;
  - la personne qui a décliné peut inviter à son tour (elle contrôle).

### 5.3 Limites gratuites (plan 5.3)
- **50 likes/jour** (le super consomme ce quota), **10 demandes Invisible/jour**, **1 Super
  Like/jour**, **1 Rewind/jour** — constantes partagées `DISCOVERY` (@wairyu/shared).
- Implémentation : compteurs dans la table **`rate_limits` existante** (fenêtre fixe 24 h alignée
  UTC, UPSERT atomique, anciennes fenêtres purgées par le cron quotidien) — **zéro nouvelle table
  de compteurs**, économie de requêtes, socle prêt pour Wairyu+ (Étape 8 : relever les max).
- Garantie produit : une tentative **refusée ne consomme rien** (`consumeQuota` = pré-lecture sans
  écriture) ; le quota Super est pré-vérifié AVANT le quota likes (un super refusé ne coûte pas de
  like). Affichage front : barre de quotas ♥ ✶ ✉ ↺ sur l'écran Découvrir + `GET /api/discover/quota`.

### 5.4 Passerelle Classique → Invisible (plan 5.4, spec §4.4)
- Sur une conversation **Classique** : « Proposer de passer en Invisible » (`POST
  /api/discover/matches/:id/gateway`) → l'autre reçoit la demande (`pendingGateway`) et
  **accepte ou refuse** (`/gateway/respond`).
- **Acceptée** ⇒ `conversations.mode = 'invisible'` (+ `mode_changed_at`) : les photos sont
  re-floutées **pour les deux**, l'**historique est conservé**, le mode du chat change sans perte
  (§4.8 scénario C). **Refusée** ⇒ rien ne change, la conversation continue en Classique (§4.6).
- Écran « Mes matchs » (`#/matches`) : liste des matchs, photo (floue si conversation invisible),
  mode de conversation, origine du match, actions passerelle.

### 5.5 Conflits de mode — règles déterministes (plan 5.5, spec §4.6)
Documentées en tête de `apps/api/src/routes/discover.ts` :
1. **Mode par défaut différent** : chacun voit l'autre selon le mode du *propriétaire* (le feed
   floute la photo d'un membre Invisible pour tout le monde) — le mien ne change jamais ce que
   l'autre voit de moi.
2. **Passerelle refusée** : la conversation reste en Classique.
3. **Consentement mutuel** : passerelle (et révélation, Étape 6) exigent l'accord des deux.
4. **Mode de la conversation** : décidé par l'action fondatrice (likes mutuels Classique/
   Interracial ⇒ `'classic'` ; handshake accepté ou like mutuel en contexte Invisible ⇒
   `'invisible'`) — puis modifiable par la passerelle AVEC consentement.
5. **Bascule du mode par défaut** (§4.8 scénario D) : ne touche JAMAIS aux matchs/conversations
   existants — elle régit les futures découvertes (vérifié par le smoke §16).

### 5.6 Top Compatibilité (plan 5.6)
- **Cron quotidien** (03:10 prod / 03:40 staging) : pour chaque utilisateur actif (cap 200),
  top 5 scoré du jour matérialisé dans `top_matches` — **hors quota utilisateur**, inserts en
  **batch D1**. Idempotent (un utilisateur déjà calculé aujourd'hui est sauté). Métrique
  `cron_top_daily`.
- **`GET /api/discover/top`** : lit le top du jour ; **fallback à la demande** (premier visiteur
  du jour) via la même fonction puis matérialisation — même score (tolérance ±2 stable par
  paire/jour). Bandeau « Top compatibilité du jour » en tête de Découvrir avec action directe
  (♥ / ✉).
- **Refactor central** : `apps/api/src/lib/discovery.ts` — UNE fonction `generateFeedPage` sert
  le feed, le cron et le top (mêmes filtres durs, même score, mêmes exclusions, mêmes règles de
  confidentialité). `routes/feed.ts` devient un wrapper mince (comportement inchangé).

## 2. Schéma (migration 0012 — zéro perte, tables feuilles, sans CHECK — leçon 0008)
| Table | Rôle |
|---|---|
| `swipes` | like/passe/super — index unique `(user_id, target_id)` (1 swipe par paire/sens) |
| `matches` | paire ordonnée `user_a_id < user_b_id` (unique), `origin`, `unmatched_at` (Étape 6) |
| `conversations` | 1:1 avec le match ; **mode** `'classic'/'invisible'` régit le flou (§4.8) |
| `invisible_requests` | handshake « Discuter » — unique par paire/sens (anti-harcèlement) |
| `mode_requests` | passerelle §4.4 par conversation (consentement de l'autre) |
| `top_matches` | top 5 quotidien par utilisateur (`day`, `rank`) — cron, hors quota |

## 3. API ajoutée
| Endpoint | Rôle |
|---|---|
| `POST /api/discover/swipe` | like/passe/super (+ `mode` de contexte) → match si réciprocité |
| `POST /api/discover/rewind` | annule ma dernière action (1/jour ; quota non consommé si rien) |
| `POST /api/discover/invisible-request` | « Discuter » (handshake ; double demande = match) |
| `POST /api/discover/invisible-request/:id/respond` | accepter / passer |
| `GET /api/discover/inbox` | demandes reçues + envoyées |
| `GET /api/discover/matches` | matchs + conversations + état passerelle |
| `POST /api/discover/matches/:id/gateway` (+ `/respond`) | passerelle Classique → Invisible |
| `GET /api/discover/top` | Top Compatibilité du jour (hors quota) |
| `GET /api/discover/quota` | compteurs du jour |
| `POST /admin/run-top` | déclencheur manuel du calcul (protégé ADMIN_TOKEN) |

**Exclusions du pool de découverte** (ajoutées au feed) : personnes déjà traitées par un swipe ;
mes propres demandes « Discuter » (peu importe le statut) ; paires déjà en conversation.

## 4. Validation (Gate 5)
- **Smoke Étape 5 — 68/68** (`scripts/smoke_etape5.sh`) : protections anonymes 401, garde-fous
  (auto-swipe 400, action inconnue 400, cible inconnue 404, double swipe), **match Classique E2E**
  (réciprocité → conversation classic → visible des deux côtés), **rewind** (annule, 1/jour, rien
  à annuler sans consommer), **super 1/jour** (refus ne consomme rien), **10 demandes/jour**
  (11ᵉ → 429), **handshake E2E** (demande → acceptation → conversation invisible, photo du
  demandeur floue), **double Discuter = match**, décliné non renvoyable, **exclusions du feed**,
  **Top Compatibilité** (admin/run-top + endpoint, score ≥ 85 sur réponses identiques),
  **passerelle acceptée** (re-floutage pour les deux) et **refusée** (rien ne change),
  **bascule §4.8 sans perte** (3 matchs conservés, mode des conversations inchangé), RGPD cleanup.
- **Régression** : étape 3b **24/24**, étape 4 **33/33**, personnalité **31/31**, prefs types
  **26/26** — zéro impact du refactor feed.
- **Déploiements** : staging (migration 0012, versions `7d9f65d1` → `1ad06f85` → `8934a541`)
  puis **production `0b8c8060`** — health OK, 401 anonymes sur les 4 nouvelles familles de
  routes, tables 0012 créées, compteurs intacts (1 user / 2 photos / 30 q_items / 1
  personnalité / 0 swipe), bundle contient les chaînes UI (Mes matchs, Demander à discuter,
  Top compatibilité du jour, Proposer de passer en Invisible…).

## 5. Notes et choix d'implémentation
- **Le chat n'existe pas encore** (Étape 6) : la conversation est créée, conservée, modélisée
  (mode, dates) ; l'écran Mes matchs l'affiche avec un récapitulatif explicite. Le mode de la
  conversation est déjà la source de vérité du flou — l'Étape 6 n'aura qu'à s'y conformer.
- **« Suivant » en Invisible n'enregistre rien** : Explorer est libre (spec §4.2.5) — on ne force
  aucune décision binaire ; seuls Like/Passe (Classique) et les demandes consomment des quotas
  ou des exclusions.
- **Likes consommés même si le rewind annule** : le compteur journalise les tentatives
  (fenêtre UTC) — assumé, documenté ; le rewind reste un compteur séparé gratuit.
- **Cap du cron à 200 utilisateurs** : largement suffisant pour la beta ; à revoir avec les
  métriques d'usage (Étape 9 — revue de budget).
- **Rencontres Interracial** : deck identique au Classique (photos nettes) + portée mondiale
  (hérité de l'Étape 4) — la conversation naît en `'classic'`.

# ÉTAPE 0 — CADRAGE & DÉCISIONS FONDATEURS

> Statut : **TERMINÉE** — 2026-09-23 · Gate 0 : **VALIDÉE**
> Livrables de cadrage verrouillés avant toute écriture de code applicatif.

---

## 0.1 Périmètre MVP — MoSCoW verrouillé

### MUST (le « Cœur Wairyu » — indispensable au lancement)
| Capacité | Règle de coupe |
|----------|----------------|
| Dual-mode Classique / Invisible | Bascule par profil, découverte séparée — l'ADN du produit |
| Inscription email + OTP, session cookie signé | Pas d'app sans comptes ; Google OAuth reporté Étape 2+, SMS/Apple reportés post-lancement |
| Profil minimal : nom, année, genre, orientation, ville approx, intention, bio, 3 prompts, 1 à 6 photos | Sans ça, aucune découverte possible |
| Compression photo client (WebP ~1024 px, ~150-300 Ko) | Conditionne le coût du stockage gratuit |
| Questionnaire N1 (10-12 questions) obligatoire | N2 (15-18 questions) = MUST « doux » : livrable Étape 4 mais toléré en version réduite au lancement si la gate temps impose une coupe |
| Moteur de score + « Pourquoi ce match ? » | Le matching explicable est la promesse n°1 |
| Feed découverte dual-mode paginé | ≤ 70 requêtes API/utilisateur/jour |
| Chat temps réel (1 Durable Object par conversation) + voice notes | Cœur de la rétention |
| Révélation consentie des photos : 15 messages échangés + 7 jours + accord des deux | Cœur de la promesse éthique |
| Sécurité de base : Turnstile, rate limiting, signalement, blocage, désinscription RGPD complète | Non négociable juridiquement et humainement |
| Monétisation câblée mais **éteinte** (flags à 0) | Évite toute refonte à l'Étape 8 |

### SHOULD (livré si la gate le permet, sinon immédiatement après lancement)
Notifications push Web (VAPID), insights « Ma personnalité » enrichis N2, tri multi-critères du feed, invitation d'amis, export RGPD en un clic (le registre et la suppression sont MUST).

### COULD (explicitement hors MVP)
IA de conversation assistée, mode vidéo, événements, marketplace de boosts, apps natives, traduction intégrée, couche Cultures étendue (v2).

---

## 0.2 Décisions d'architecture — validation

Les 8 décisions de l'Analyse approfondie (B.2) sont **confirmées**, avec la mise à
jour majeure suivante :

> **Décision 9 (stockage) — R2 remplacé par Cloudinary.** L'activation de R2 sur le
> compte Cloudflare exige une carte bancaire (non disponible). La sonde réelle a
> validé Cloudinary plan gratuit : assets `authenticated` (privés), URLs signées
> Worker-side, flou par transformation, 25 GB. Détails complets et algorithmes :
> [`docs/STOCKAGE-CLOUDINARY.md`](../../docs/STOCKAGE-CLOUDINARY.md).

| # | Décision | Statut |
|---|----------|--------|
| 1 | Sessions = cookies signés + table D1 (pas KV) | ✅ Confirmée |
| 2 | Durable Object `ChatRoom` + `alarm()` (pas de Queues) | ✅ Confirmée |
| 3 | Compression photos côté client, ~8 000 médias dans le quota | ✅ Confirmée |
| 4 | URLs signées, assets privés, autorisation côté Worker | ✅ Confirmée (Cloudinary au lieu de R2) |
| 5 | PWA React+Vite sur Workers Assets (pas Pages) | ✅ Confirmée |
| 6 | 1 DO SQLite par conversation | ✅ Confirmée |
| 7 | Auth email OTP (+ Google en Étape 2+), SMS/Apple différés | ✅ Confirmée |
| 8 | Monétisation câblée éteinte | ✅ Confirmée |
| 9 | Stockage médias sans carte bancaire | ✅ **Révisée → Cloudinary** (sondes V1-V8) |

---

## 0.3 Limites free tier — relevé à J0 (23 septembre 2026)

| Service | Limite gratuite (relevé officiel) | Impact design |
|---------|-----------------------------------|---------------|
| Workers (plan gratuit) | 100 000 requêtes/jour, 10 ms CPU/requête | Budget ≤ 70 requêtes API/utilisateur/jour ; CPU léger (pas de traitement d'image serveur) |
| D1 | 5 GB stockage, 5 M lignes lues/jour, 100 K écritures/jour | Index serrés, pagination, cache KV pour lecture |
| KV | 100 K lectures/jour, 1 000 écritures/jour, 1 GB | **Lecture seule** en pratique (config, révision questionnaire versionnée) |
| Durable Objects | 100 000 requêtes/jour, 13 K Go-s | 1 DO/conversation, hibernation entre messages |
| Cloudinary (validé par sonde) | 25 crédits ≈ 25 GB stockage + 25 GB BP/mois | WebP client ~80-300 Ko ; flou 400 px transformé à la volée |
| Turnstile | Illimité (plan gratuit) | Sur inscription et actions sensibles |
| Brevo/Resend (à créer, Étape 2) | ~300 emails/jour (Brevo) | OTP 6 chiffres, TTL 10 min — largement suffisant en beta |

**Budget cible confirmé : ~1 200-3 500 utilisateurs actifs/jour** avant saturation
du plan gratuit (détail du calcul dans l'Analyse approfondie §C).

---

## 0.4 Comptes & accès (état à la fin de l'Étape 0)

| Service | État | Détail |
|---------|------|--------|
| GitHub `georgyfr/WAIRYU-Dating` | ✅ Actif | Token fine-grained neuf fourni et vérifié (admin) — recommandation permanente : ne jamais partager de token en clair, révoquer à la fin du projet |
| Cloudflare compte Wairyu26 | ✅ Actif | Workers/D1/DO/KV/Turnstile vérifiés par sondes réelles ; sous-domaine `wairyu.workers.dev` réservé ; R2 impossible sans carte |
| Cloudinary `nm7lozr4` | ✅ Actif | Compte Free créé ; API key + secret fonctionnels (upload authenticated testé) |
| Brevo (emails OTP) | ⏳ À créer | Dépendance de l'Étape 2 uniquement |

---

## 0.5 Documents juridiques v1

Rédigés en annexe de cette étape, prêts pour relecture par un professionnel avant
le lancement public (Étape 10) :
- [`CGU-v1.md`](CGU-v1.md) — conditions générales d'utilisation (18+, respect, free tier)
- [`POLITIQUE-CONFIDENTIALITE-v1.md`](POLITIQUE-CONFIDENTIALITE-v1.md) — RGPD : finalités, bases légales, durées, droits
- [`REGISTRE-TRAITEMENTS-v1.md`](REGISTRE-TRAITEMENTS-v1.md) — registre RGPD simplifié

---

## 0.6 Marque visuelle minimale v1

| Élément | Choix v1 | Justification |
|---------|----------|---------------|
| Nom d'affichage | **Wairyu** (minuscule « w » en UI : « wairyu ») | Conforme spécification §3.7 |
| Couleur primaire | `#6C4AB6` (violet profond) | Sensibilité, intimité, différenciation nette des rouges « dating apps » |
| Couleur secondaire/accent | `#F4A259` (ambre chaleureux) | Chaleur humaine, contraste WCAG AA sur fond clair |
| Fond | `#FAF8F5` (blanc chaud) | Léger, feutré — pas de noir agressif |
| Typo | **Nunito** (Google Fonts, gratuite) | Ronde, humaine, excellente lisibilité mobile, poids complets |
| Iconographie | Lucide (open source, gratuite) | Traits fins, cohérents avec la douceur du ton de voix |
| Ton de voix UI | Du tutoiement chaleureux, phrases courtes, jamais de culpabilisation | Spécification §3.7 |

La charte complète (mode sombre, illustrations, motion) sera épaissie en Étape 5-6 ;
ces valeurs suffisent pour construire le design system du MVP.

---

## 0.7 Risques de cadrage — verrouillés

1. **Bande passante Cloudinary** : 25 GB/mois. Alerte à 70 % (mesure `/admin/usage`,
   Étape 1) ; plan de dégradation : vignettes 200 px partout sauf révélation.
2. **Emails OTP gratuits** : ~300/jour. Gate : activer l'invitation par codes plutôt
   qu'inscription ouverte si saturation en beta.
3. **Dépendance Cloudinary** : export RGPD + migration possible via API Admin
   (public_ids versionnés en D1) — testé lors de l'Étape 3.
4. **Relecture juridique** : documents v1 rédigés en interne ; relecture
   professionnelle planifiée avant lancement public (Étape 10), beta fermée
   autorisée avec la v1.

---

## Validation Gate 0

- [x] Périmètre MoSCoW signé (ce document, §0.1)
- [x] Décisions d'architecture validées, Décision 9 révisée avec preuve (§0.2)
- [x] Limites free tier relevées à J0 (§0.3)
- [x] Comptes créés : Cloudflare ✅, GitHub ✅, Cloudinary ✅ (Brevo en Étape 2)
- [x] Documents juridiques v1 rédigés (§0.5)
- [x] Marque visuelle minimale choisie (§0.6)

**→ Passage à l'Étape 1 (Socle technique) autorisé.**

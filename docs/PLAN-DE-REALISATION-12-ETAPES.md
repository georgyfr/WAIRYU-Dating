# WAIRYU — Plan de réalisation : 12 étapes du début à la fin

> Complète l'[Analyse approfondie](ANALYSE-APPROFONDIE.md). Chaque étape se termine par une **porte de validation (gate)** : rien ne passe à l'étape suivante sans validation. Rythme itératif : construction, test, validation, étape suivante. Dès qu'une étape est intégralement terminée, elle est poussée dans le dossier `etapes/` de ce dépôt.

---

## ÉTAPE 0 — Cadrage & décisions fondatrices *(1 session)*

**Sous-étapes :**
1. Verrouiller le périmètre MVP Must/Should/Could (base : MoSCoW de la spécification, ajusté au free tier).
2. Valider les 8 décisions d'architecture (voir Analyse approfondie, B.2).
3. Revalider les limites free tier Cloudflare sur les pages officielles (chiffres à J0).
4. Créer les comptes : Cloudflare (gratuit), GitHub (fait), Brevo ou Resend (gratuit) pour les OTP email.
5. Rédiger la version 1 des documents juridiques minimums : CGU, politique de confidentialité, mention « 18 ans et + ».
6. Choisir la marque visuelle minimale : nom d'affichage, 2 couleurs, 1 typo (le ton de voix figure déjà dans la spécification §3.7).

**Gate 0 :** périmètre signé, comptes créés, documents v1 rédigés, décisions validées.

---

## ÉTAPE 1 — Socle technique & infrastructure *(2-3 sessions)*

**Sous-étapes :**
1. Initialiser le monorepo (structure C.1 de l'analyse), linter, formateur, TypeScript strict.
2. Provisionner via wrangler : Worker (API), D1 (une base prod + une staging), KV (config lecture seule), la classe Durable Object `ChatRoom`, Cron Triggers, secrets (clé HMAC, clés VAPID, secrets Cloudinary). Créer le compte Cloudinary gratuit (photos/voice notes — Décision 9 de l'analyse, aucune carte requise).
3. Squelette d'API Hono : middleware CORS, gestion d'erreurs unifiée, logging, middleware d'authentification par cookie signé.
4. Front React+Vite servi par le même Worker (assets statiques), page « Hello Wairyu » déployée sur `*.workers.dev`.
5. CI simple : script `deploy.sh` (test → migration D1 → deploy staging → deploy prod avec confirmation).
6. **Dashboard de consommation** : endpoint `/admin/usage` qui expose la consommation du jour (requêtes, écritures D1, lectures).
7. Migrations D1 : première version du schéma (`users`, `sessions`).

**Gate 1 :** `https://votre-worker.workers.dev` répond, staging et prod séparés, usage visible.

---

## ÉTAPE 2 — Authentification & comptes *(2 sessions)*

**Sous-étapes :**
1. Inscription par email + OTP à 6 chiffres : envoi via Brevo/Resend, TTL 10 min, 3 tentatives max, Turnstile sur la demande d'OTP.
2. Connexion Google OAuth (gratuit), fusion de comptes si même email.
3. Sessions : cookie `httpOnly` signé, TTL 30 jours glissants, table `sessions` avec révocation (logout, logout-all).
4. Rate limiting : compteur par IP et par email dans D1 (fenêtre glissante) — anti-spam d'OTP.
5. Écrans : inscription, vérification code, connexion, mot de passe oublié (réutilisation OTP), blocage « 18 ans et + ».
6. Suppression de compte (RGPD) dès maintenant — pas plus tard.

**Gate 2 :** parcours complet inscription → vérification → connexion → déconnexion → suppression, testé sur mobile (Chrome + Safari iOS).

---

## ÉTAPE 3 — Profils & photos protégées *(2-3 sessions)*

**Sous-étapes :**
1. Création de profil guidée : nom, année de naissance, genre, orientation (consentement explicite dédié), ville + géoloc approximative, intention, bio courte, 3 prompts.
2. **Pipeline photo client** : sélection → recadrage → compression WebP ~1024 px (~150-300 Ko) → demande de signature d'upload au Worker → upload direct vers Cloudinary (vignette 200 px générée automatiquement par transformation Cloudinary) → commit en D1. Max 6 photos, 1 obligatoire.
3. Service d'URLs de livraison signées (Cloudinary assets authentifiés, TTL ~15 min) avec contrôle d'autorisation par photo : photos du Mode Classique servibles par tout utilisateur actif authentifié ; photos du Mode Invisible **seulement** après révélation accordée ou visibilité mutuelle.
4. Floutage Mode Invisible en CSS/SVG (aucune image floutée stockée).
5. Préférences de découverte (âge, distance, genres, intention) + choix du mode par défaut avec écran explicatif.
6. Gestion d'ordre, suppression, photo principale.

**Gate 3 :** profil complet en < 5 minutes ; impossible d'accéder à une photo Invisible non autorisée même en devinant l'URL (test de sécurité écrit).

---

## ÉTAPE 4 — Questionnaire progressif & moteur de matching *(2-3 sessions)*

**Sous-étapes :**
1. **Co-construction du contenu** : rédaction du questionnaire Niveau 1 (10-12 questions : valeurs, intentions, deal-breakers durs) et Niveau 2 (15-18 questions : communication, style de vie, gestion des conflits) conformément à la spécification §5.2, avec poids et dimensions.
2. Table `q_items` versionnée (seed D1) + écran de saisie **avec sauvegarde à chaque réponse** (1 écriture/réponse, reprise où on s'est arrêté).
3. Barre de progression + écran de récompense « Ma personnalité » à la fin de chaque niveau (insights basiques par logique de règles, pas d'IA).
4. **Moteur de score** (fonction pure TypeScript) : dimensions pondérées, deal-breakers binaires exclusifs, normalisation 0-100, non-déterminisme léger par tolérance (« pas un verdict »).
5. **« Pourquoi ce match ? »** : à partir des écarts de réponses → 2 forces + 1 point de vigilance + 2 sujets de conversation suggérés.
6. Génération des candidats : requête D1 par filtres durs (âge/distance/genres/intention/actif 30 j) → score en mémoire → top N paginé.

**Gate 4 :** deux comptes de test obtiennent un score cohérent et explicable ; complétion N1 mesurable ; latence feed < 300 ms.

---

## ÉTAPE 5 — Découverte dual-mode *(2-3 sessions)*

**Sous-étapes :**
1. **Mode Classique** : pile de cartes avec gestes de swipe (mobile-first), like/passe/Super Like, match mutuel → création conversation, Rewind (dernière action), filtres de base.
2. **Mode Invisible** : cartes floutées (CSS) affichant score + extraits de réponses + bio sans photos, deux onglets **Explorer** et **Discuter** — mécanisme de handshake : la personne reçoit la demande, accepte ou passe.
3. Limites gratuites : 50 likes/jour et 10 demandes Invisible/jour (compteurs en D1, incrémentés par batch, reset par Cron) — économie de requêtes ET socle de la future différenciation Wairyu+.
4. **Passerelle** : depuis un chat Classique, proposition « Passer en Invisible avec cette personne » — le chat est conservé, seules les photos se re-floutent.
5. Gestion des conflits de mode (spécification §4.6) : règles déterministes simples documentées dans le code.
6. Top Compatibilité : 5 suggestions/jour calculées par le Cron quotidien (hors quota utilisateur).

**Gate 5 :** match Classique E2E + handshake Invisible E2E, bascule de mode sans perte de conversation (cas §4.8 vérifié).

---

## ÉTAPE 6 — Chat temps réel & révélation *(3-4 sessions — le plus gros morceau)*

**Sous-étapes :**
1. Durable Object `ChatRoom` : WebSocket par participant, persistance des messages dans le SQLite du DO, index par conversation, accusés de lecture, présence.
2. Écran de chat unifié (canvas commun, spécification §4.9) : texte, emojis, réactions, voice notes (MediaRecorder → Opus ~16 kbps → upload signé Cloudinary → message audio), indicateur de saisie.
3. Chargeur d'historique paginé (au-delà des 200 derniers messages dans le DO, requête à la demande).
4. **Compteurs de révélation** maintenus dans le DO : messages échangés ≥ 15 ET ancienneté ≥ 7 jours → carte de révélation disponible, visible des deux côtés.
5. **Flux de révélation** : demande → consentement explicite de l'autre → déverrouillage des photos pour les deux (presigned URLs désormais accordées) → écran de feedback post-révélation (Continuer / Ami / Pas pour moi) qui nourrit les données de matching.
6. Anti-capture honnête (§4.5) : filigrane discret avec prénom + date sur les photos révélées, message éducatif — sans promettre l'impossible.
7. Unmatch propre : suppression de la conversation des deux côtés, photos re-floutées automatiquement, blocage optionnel en 1 clic.
8. Notifications Web Push (VAPID) : nouveau message (hors conversation active), nouveau match, demande de révélation — respect des réglages.

**Gate 6 :** conversation stable 30 min sans perte, révélation E2E, re-floutage après unmatch vérifié, push reçues sur Android et iOS.

---

## ÉTAPE 7 — Sécurité & modération *(2-3 sessions)*

**Sous-étapes :**
1. **Vérification selfie semi-manuelle** : capture guidée (3 poses aléatoires imposées — impossible de présenter une photo papier), envoi dans une file `verification_requests`, badge « Identité vérifiée » après validation dans le backoffice (~10 min/jour de modération au volume beta).
2. **Modération automatique par règles (0 neuron)** : listes de mots FR/EN (haine, harcèlement, drogue), patterns de scam (liens externes, crypto, numéros WhatsApp, demandes d'argent), score de risque par message calculé côté DO avant livraison → flag vers la file de modération.
3. Signalement avec motifs (contenu, comportement, fake, mineur…), blocage mutuel immédiat, unmatch.
4. **Backoffice de modération** (interface admin protégée par clé + 2FA TOTP simple) : file de signalements, contexte de conversation, actions : avertir / suspendre 7 j / bannir, avec `audit_admin` complet.
5. Check-in sécurité simple (§6) : avant un rendez-vous, marquer « Je vois X le [date] » + rappel post-date « Ça s'est bien passé ? » (contact de confiance et SOS : Phase 2).
6. Anti-fraude basique : détection de multi-comptes par empreinte légère, Turnstile systématique sur OTP, détection de spam de likes/messages.
7. Paramètres de confidentialité v1 : visibilité du mode, pause du profil, mode incognito (masqué du feed sauf likes reçus).

**Gate 7 :** cycle complet signalement → review → sanction testé ; un message de scam type est attrapé par les règles ; badge vérifié visible sur le profil.

---

## ÉTAPE 8 — Monétisation préparée, éteinte *(1 session)*

**Sous-étapes :**
1. Tables d'entitlements + middleware d'autorisation Wairyu+ (feature flags : `likes_unlimited`, `see_who_liked`, `advanced_filters`, `incognito_plus`, `boost`).
2. Brancher tous les gateways dans le code (compteurs, écrans de upsell préparés mais masqués).
3. Stripe Checkout en mode test (clés de test gratuites) + webhook préparé — **activable plus tard sans redéploiement majeur**.

**Gate 8 :** en retournant un flag, Wairyu+ fonctionne intégralement en mode test ; éteint, l'app se comporte comme la version gratuite.

---

## ÉTAPE 9 — Qualité, tests & beta fermée *(2-3 sessions + 3-4 semaines de beta)*

**Sous-étapes :**
1. Tests unitaires : moteur de score (couples de référence), règles de modération, logique de révélation, limites quotidiennes.
2. Tests E2E Playwright : inscription → profil → questionnaire → swipe → match → chat → révélation → unmatch → suppression.
3. Revue de budget : mesurer les requêtes réelles par session utilisateur (ajustement du caching si nécessaire).
4. **Beta fermée 50-200 utilisateurs** : recrutement via le réseau du fondateur + 2-3 groupes Facebook/Discord/WhatsApp francophones ; formulaire de feedback intégré ; opt-in de données de mesure.
5. Suivi des KPI cibles : complétion inscription > 60 %, N1 > 55 %, choix Invisible > 25 %, messages par match > 8, rétention J7 > 35 %.
6. Itérations UX par vagues (2 semaines).

**Gate 9 :** KPI beta atteints ou plans d'action validés, zéro bug bloquant connu.

---

## ÉTAPE 10 — Lancement francophonie *(en continu)*

**Sous-étapes :**
1. Landing page + SEO (sur le même Worker), page manifeste (§3.8 de la spécification — déjà écrit), FAQ sécurité.
2. **Stratégie de poches urbaines** : hubs francophones (ex. Douala, Yaoundé, Abidjan, Dakar, Paris, Bruxelles, Montréal) ; campagne par ville ; le feed favorise la densité locale avec un rayon élargi progressif (option « ouvrir au monde »).
3. Kit d'acquisition organique : formats TikTok/Instagram/YouTube Shorts basés sur le concept (le « swipe en aveugle » se filme très bien), témoignages de la beta.
4. Partenariats de lancement : communautés d'expatriés, associations interculturelles, campus.
5. Supervision quotidienne : usage, quotas, modération, feedback — routine 30 min/jour.
6. Déclencheurs de passage au payant documentés dès le premier jour (voir Étape 11).

**Gate 10 :** 1 000 inscrits, 300 actifs hebdo, dashboards de quotas < 70 %.

---

## ÉTAPE 11 — Post-lancement : épaississement & montée en charge *(Phase 2 de la spécification)*

**Sous-étapes :**
1. Wairyu Cultures v1 : Profil d'Héritage (langues, origines, ouverture, traditions) + matching culturel intégré au score. Les éléments sensibles (religion) restent en consentement explicite dédié, RGPD art. 9.
2. Questionnaire Niveau 3, Coach Wairyu basique (quand le budget neurons/IA le permettra — post-upgrade).
3. Salons Culturels v1 (Durable Objects de groupe, réutilisation de `ChatRoom`).
4. **Tableau de déclenchement du passage au payant** :

| Signal observé | Action payante |
|---|---|
| > 70 % des requêtes Workers 3 jours de suite | Workers 5 $/mois |
| > 15 000 utilisateurs avec photos OU dépassement des quotas Cloudinary | Activer R2 (carte requise, ~0,015 $/Go) et basculer le module `StorageService` |
| Base D1 > 3,5 Go | D1 5 $/mois |
| Besoin de modération IA à l'échelle | Workers AI 5 $/mois |
| Total facture ~20-30 $/mois | Signale qu'il est temps d'activer Wairyu+ (Étape 8) |

5. PWA → Flutter/Expo quand la traction justifie les frais de stores, en réutilisant 100 % de l'API et ~50 % du code TypeScript.

---

## MODULE TRANSVERSE 1 — Conformité RGPD simplifiée

| Exigence | Mise en œuvre |
|---|---|
| Base légale par traitement | Contrat (compte), consentement explicite (orientation, photos, notifications), intérêt légitime (sécurité, anti-fraude) — cartographiées dans les CGU |
| Registre des traitements | Tableau simple rédigé à l'Étape 0 (finalités, données, durée, destinataires) |
| Sous-traitants | Cloudflare (DPA en ligne), Cloudinary (DPA en ligne — photos/voice notes), Brevo/Resend (DPA), aucun autre au MVP |
| Droit d'accès/export | Endpoint « exporter mes données » (JSON téléchargeable) — Étape 2 |
| Droit à l'effacement | Suppression de compte dur + purge R2/D1 + délai de grâce 30 j |
| Données sensibles (art. 9) | Orientation et données culturelles/religieuses : cases de consentement séparées et refusables sans perte de fonctionnalités essentielles |
| Minoration | Géoloc arrondie au km, pas de ville exacte ; âge arrondi optionnel |
| Rétention | Messages : DO purgé 90 j après fin de conversation ; photos supprimées avec le compte ; logs 30 j |
| Cookies | Session seule (strictement nécessaire) + consentement analytics avant tout tracker |
| 18 ans et + | Case obligatoire + mention ; signalement « mineur » = suspension immédiate automatique |

## MODULE TRANSVERSE 2 — Stratégie de test & lancement (KPI)

| Métrique | Cible réaliste | Instrument |
|---|---|---|
| Complétion inscription | > 60 % | Événements d'étapes (D1, 1 write/étape) |
| Complétion N1 / N2 | > 55 % / > 25 % | Progression questionnaire |
| Choix du Mode Invisible | > 25 % | Champ `mode_default` |
| Messages par match (Invisible) | > 8 | Compteur DO |
| Taux de révélation mutuelle | > 15 % | Table `revelations` |
| Rétention J7 | > 35 % | `last_active_at` |
| NPS (enquête beta) | > 25 | Enquête in-app |

Outils : Web Analytics Cloudflare (gratuit) pour la vitrine, événements maison en D1 pour le produit (pas de tracker tiers payant).

---

## LE CHEMIN VERS « SURPASSER LES GÉANTS »

1. **Mois 0-4 : Cœur Wairyu impeccable.** Une app plus petite que Tinder, mais là où elle existe, elle est meilleure : matching expliqué, révélation consentie, sécurité visible, fluidité PWA.
2. **Mois 4-9 : masse critique francophone par poches urbaines.** Le Mode Classique (familiers) attire le volume ; l'Invisible crée la fidélité et l'histoire à raconter aux médias.
3. **Mois 9-15 : Cultures.** La couche interculturelle — personne ne l'a. Copier le swipe est facile ; copier une plateforme dual-mode + interculturelle avec une éthique documentée, non.
4. **Ensuite : scale.** Les revenus Wairyu+ financent les upgrades Cloudflare et l'app native.

---

## PROCHAINE SESSION (démarrage de l'Étape 0 + 1)

1. Initialiser le monorepo complet avec tout le code de base ;
2. Écrire le `wrangler.toml`, les migrations D1 initiales et le squelette d'API ;
3. Guider en 5 minutes pour créer les comptes Cloudflare/GitHub et brancher le déploiement ;
4. Livrer une première version déployable sur `*.workers.dev` avec le dashboard d'usage.

De quoi le fondateur a besoin de son côté : une adresse email pour créer le compte Cloudflare, et ~1 heure pour valider les décisions d'architecture.

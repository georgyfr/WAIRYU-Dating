# WAIRYU — CARTE DU PLAN DE RÉALISATION v1.0

> **Document de référence** : l'ordre d'exécution prévu au départ — et ce que le projet en a réellement fait, étape par étape, avec les gates.
> **Source cartographiée** : [`docs/PLAN-DE-REALISATION-12-ETAPES.md`](../docs/PLAN-DE-REALISATION-12-ETAPES.md) (229 lignes) — « Complète l'Analyse approfondie. Chaque étape se termine par une **porte de validation (gate)** : rien ne passe à l'étape suivante sans validation. » (en-tête verbatim).
> **Règle de lecture** : chaque engagement du plan est cité VERBATIM (tel quel — zéro reformulation), puis rendu à son **statut runtime** avec la gate datée du tableau [`STATUS.md`](../STATUS.md) et les preuves par commande (annexe A : une commande = un verdict). ✅ livré · 🟡 partiel/nuance · 🔵 reste à construire · ⚖️ décision comité.

---

## §0 — Place dans l'architecture documentaire + valeur de témoin chronologique

| Document | Rôle |
|---|---|
| Spec v0.1 (12 961 lignes) → ANALYSE-APPROFONDIE (faisabilité + 9 décisions) → **PLAN-DE-REALISATION-12-ETAPES (l'ordre d'exécution)** → constitution v2.1 → contrat d'inventaire v1.3 | chaîne fondatrice |
| Cartes de référence : CARTE-CONCEPTION (comment construit) · CARTE-SPECIFICATION (ce que le produit promet) · CARTE-ANALYSE-APPROFONDIE (pourquoi ces choix) · **CARTE-PLAN-DE-REALISATION (dans quel ordre, avec quelles gates)** | série de référence — 4ᵉ tome |

**Valeur de témoin chronologique** : le plan se termine par « PROCHAINE SESSION (démarrage de l'Étape 0 + 1) » — il a été écrit AVANT l'exécution ; il sert de référence contre laquelle mesurer ce qui a dévié, dépassé ou retardé (écarts consignés §3).

**Note de trace consignée (honnêteté bidirectionnelle)** : la règle du plan « Dès qu'une étape est intégralement terminée, elle est poussée dans le dossier `etapes/` » est suivie pour **7 étapes sur 8 terminées** : `etapes/` contient 00, 01, 02, 03, 05, 06, 07 — **pas de dossier etape-04** (questionnaire) : son corpus est documenté par le Livrable des mondes (chaîne 7 étages par quête) et les migrations 0009-0022. Consigné tel quel.

---

## §1 — Le tableau maître : les 12 étapes, gates datées (source : STATUS.md)

| # | Étape (verbatim abrégé) | Gate annoncée par le plan | Statut runtime |
|---|---|---|---|
| 0 | Cadrage & décisions fondatrices | « périmètre signé, comptes créés, documents v1 rédigés, décisions validées » | ✅ **2026-09-23** ☑ — CADRAGE.md · CGU-v1 · POLITIQUE-v1 · REGISTRE-TRAITEMENTS-v1 (annexe A-8) |
| 1 | Socle technique & infrastructure | « le worker répond, staging et prod séparés, usage visible » | ✅ **2026-09-23** ☑ — monorepo apps/web+apps/api · wrangler.toml · `/admin/usage` live (annexe A-3) |
| 2 | Authentification & comptes | parcours complet inscription→suppression, testé mobile | ✅ **2026-09-22** ☑ (test mobile fondateur restant, noté au tableau) — OTP+Turnstile+OAuth+password |
| 3 | Profils & photos protégées | « profil complet en < 5 minutes ; impossible d'accéder à une photo Invisible (…) en devinant l'URL » | ✅ **2026-09-23** ☑ (test mobile restant noté) — pipeline photo client + URLs signées |
| 4 | Questionnaire progressif & moteur de matching | « score cohérent et explicable ; complétion N1 mesurable ; latence feed < 300 ms » | ✅ **2026-09-23** ☑ (score ≥ 85 sur réponses identiques, deal-breaker exclu, latence < 300 ms) |
| 5 | Découverte dual-mode | « match Classique E2E + handshake Invisible E2E, bascule sans perte (cas §4.8) » | ✅ **2026-09-23** ☑ — quotas 50/10/1/1 confirmés (annexe A-4/A-5) |
| 6 | Chat temps réel & révélation | « conversation stable 30 min, révélation E2E, re-floutage, push » | ✅ **2026-09-23** ☑ (WS E2E 10/10 · voice note · révélation E2E refus→accord · unmatch+re-floutage · push VAPID prêt — clés à poser + test mobile notés) |
| 7 | Sécurité & modération | « cycle signalement→review→sanction ; un scam type attrapé ; badge visible » | ✅ **2026-09-23** ☑ (smoke 56/56 : scam BLOQUÉ par règles · sanction E2E · badge visible · 2FA TOTP admin) |
| 8 | Monétisation préparée, éteinte | « en retournant un flag, Wairyu+ fonctionne (…) éteint, l'app se comporte comme gratuite » | ⏳ **NON DÉMARRÉE** — et évoluée : aucun gateway payant au code (grep entitlement = 0) ; doctrine freemium ⚖️ comité (voir §3) |
| 9 | Qualité, tests & beta fermée | « KPI beta atteints ou plans d'action validés, zéro bug bloquant » | ⏳ au tableau — **MAIS la substance est largement parcourue** : bêta fermée RÉELLE au journal (réponses bêta conservées · V16 clôture bêta fermée 10-02 · re-audit V1.3 bêta débloquée) ; gate 9 formelle non prononcée ; tests E2E navigateur consignés comme limite (non re-joués machine) |
| 10 | Lancement francophonie | « 1 000 inscrits, 300 actifs hebdo, dashboards < 70 % » | 🔵 RESTE À CONSTRUIRE (poches urbaines : Douala, Yaoundé, Abidjan, Dakar, Paris, Bruxelles, Montréal — cités au plan) |
| 11 | Post-lancement : épaississement | Cultures v1 · N3 · Coach · salons · tableau de déclenchement payant | ⏳ au tableau — **préfiguration réelle** : Profil d'Héritage EN BASE (0016, Task 52, 7 sections + écran #/heritage — annexe A-7) ; filtres héritage au matching = Phase 2 explicite |

---

## §2 — Le principe des gates (verbatim fondateur)

> « Chaque étape se termine par une **porte de validation (gate)** : rien ne passe à l'étape suivante sans validation. Rythme itératif : construction, test, validation, étape suivante. »

**Statut runtime** : le principe a été tenu ET durci au fil du projet — aux gates d'étapes s'est ajoutée la gouvernance FM (FM-013→028), la règle [11] (push-canon.sh : ① CI verte avant push ② jeton éphémère ③ vérification remote) et la règle FM-027 (push sans vérification = tâche non close). Le rythme réel : étapes 0-7 gates en 3 jours (09-22 → 09-23), puis 15 vagues de contenu (09-29/30), audit hostile 64 findings (10-01), P0 (24 migrations), V16 clôture bêta fermée (10-02), V17 parrainage, V18 inversion architecturale (10-03).

---

## §3 — Les écarts plan ↔ réel, consignés honnêtement

| # | Le plan prévoyait | Le réel a fait | Nature |
|---|---|---|---|
| 1 | Étape 2 : « email + OTP (…) connexion Google OAuth » | flow `'otp' \| 'oauth_google' \| 'oauth_facebook' \| 'password'` — Facebook ET mot de passe local (0017) ajoutés | **Dépassement** |
| 2 | Étape 4 : questionnaire « N1 10-12 questions + N2 15-18 questions » | banque doctrine **531 items au runtime / 570 conçus** (8 domaines × 11 mondes × 51 quêtes), 14 signaux, R6, fiabilité 30 items | **Dépassement majeur** (les 15 vagues) |
| 3 | Module transverse 1 : « Messages : DO purgé 90 j après fin de conversation » | `MESSAGE_RETENTION_SECONDS = 365 × 86400` (chat-room.ts l.59) — purge à **365 jours** | **Écart** (rétention plus longue que prévu — à re-valider minimisation RGPD ⚖️) |
| 4 | Étape 8 : « Tables d'entitlements + middleware Wairyu+ + Stripe Checkout mode test » | Rien n'est câblé (grep entitlement = 0) — la doctrine freemium actuelle a déplacé la monétisation ; réconciliation monétisation v0.1 ↔ freemium au comité ⚖️ | **Évolution de doctrine** |
| 5 | Règle « étape terminée → dossier etapes/ » | 7 dossiers poussés (00-03, 05-07) — pas de dossier etape-04 | **Écart de trace** (corpus documenté ailleurs) |
| 6 | Étape 6.8 : notifications push | WS E2E 10/10 · push VAPID « prêt — clés à poser + test mobile » (noté à la gate 6) ; `apps/pushecho` + `push_subscriptions` + `push_preferences` (0020) en place | 🟡 partiel assumé, noté au tableau |
| 7 | Étape 9 : « Tests E2E Playwright » | bêta fermée réelle + smoke étape 7 (56/56) + V18 23/23 machine ; smoke E2E navigateur non versionné, consigné comme limite aux re-audits | 🟡 nuance consignée |
| 8 | Étape 5.6 : « Top Compatibilité : 5 suggestions/jour par Cron » | table `top_matches` (0012) en place | ✅ conforme |

---

## §4 — Modules transverses : statuts runtime

**MT1 — Conformité RGPD** (10 exigences du plan) :

| Exigence (verbatim abrégé) | Statut |
|---|---|
| « Registre des traitements — rédigé à l'Étape 0 » | ✅ REGISTRE-TRAITEMENTS-v1 (etape-00) — déployé publicly `apps/web/public/legal/registre.md` (V16 R1, md5 identique vérifié) |
| « Droit d'accès/export — Étape 2 » | ✅ export RGPD élargi P0 (H-12 : tables exhaustives, 0 résidu) |
| « Droit à l'effacement — suppression dur + purge + délai 30 j » | ✅ `account_deletions` (0001) + écran (Étape 2.6 faite avant la fin) |
| « Données sensibles art. 9 : consentements séparés et refusables » | ✅ orientation champ dédié (0018) + religion en consentement dédié |
| « Minoration — géoloc arrondie, pas de ville exacte » | ✅ geo.ts (arrondi) |
| « 18 ans et + : signalement mineur = suspension immédiate » | ✅ F.3/F.4 P0 : âge ISO strict exigé avant INSERT, mineur → refus/ban + révocation sessions |
| « Messages : DO purgé 90 j » | 🟡 **365 j réels** (écart consigné §3-3) |

**MT2 — Stratégie de test & KPI** (7 métriques cibles) : ✅ instrument en place — « événements maison en D1 » = `metrics_daily` (0002) + collecte raison.* (V18.D, COLLECTÉES-SEULEMENT : 0 lecture dans le moteur) ; cibles reprises comme critères bêta ; « pas de tracker tiers payant » respecté.

---

## §5 — « Le chemin vers “surpasser les géants” » (verbatim, 4 phases)

| Phase (verbatim abrégé) | Statut |
|---|---|
| « Mois 0-4 : Cœur Wairyu impeccable. (…) matching expliqué, révélation consentie, sécurité visible, fluidité PWA » | ✅ LIVRÉ (étapes 0-7 + 531 items + audits P0/V16/V1.3 + V18) |
| « Mois 4-9 : masse critique francophone par poches urbaines » | 🔵 Étape 10 |
| « Mois 9-15 : Cultures. La couche interculturelle — personne ne l'a » | 🔵 Étape 11 — préfigurée (0016 + #/heritage) |
| « Ensuite : scale. Les revenus Wairyu+ financent les upgrades » | 🔵 ⚖️ (doctrine freemium, point comité) |

---

## §6 — Tableau final de conformité plan ↔ runtime

| Section du plan | Verdict |
|---|---|
| Étapes 0-7 (8 étapes techniques) | ✅ 8/8 gates validées (09-22 → 09-23), dates au tableau STATUS.md |
| Étape 8 (monétisation) | ⏳ non démarrée — doctrine évoluée ⚖️ |
| Étape 9 (qualité/bêta) | 🟡 substance parcourue (bêta fermée réelle, V16/V1.3) — gate formelle non prononcée |
| Étapes 10-11 (lancement/épaisseur) | 🔵 à venir — 11.1 préfiguré (0016) |
| Module transverse RGPD | ✅ 6/7 conformes · 🟡 rétention 365 j vs 90 j |
| Module transverse KPI | ✅ instrument conforme (« événements maison, pas de tracker payant ») |
| Principe des gates + dossier etapes/ | ✅ tenu et durci · 🟡 7/8 dossiers (etape-04 absent, consigné) |
| Écarts plan↔réel | 8 consignés §3 (2 dépassements · 3 écarts · 1 évolution de doctrine · 2 nuances) |

---

## Annexe A — Preuves (une commande = un verdict)

| # | Commande | Verdict |
|---|---|---|
| A-1 | `head -12 STATUS.md` | gates 0-5 : ✅ 2026-09-22/09-23 ☑ (détails par gate : score ≥ 85 · E2E · bascule §4.8) |
| A-2 | `sed -n '13,20p' STATUS.md` | gates 6-7 ✅ 09-23 (WS 10/10 · smoke 56/56) · étapes 8-11 ⏳ |
| A-3 | `grep -n "adminRoutes.get('/usage'" apps/api/src/routes/admin.ts` | l.157 — Étape 1.6 (dashboard consommation) livrée |
| A-4 | `grep -n "QUOTA gratuit" apps/api/src/lib/ratelimit.ts` | l.47 « 50 likes/jour (like et super consomment ce compteur) » — Étape 5.3 |
| A-5 | `grep -in "quotas quotidiens" apps/api/migrations/0012_discovery.sql` | « 50 likes / 10 demandes / 1 super / 1 rewind » — les 4 quotas du plan |
| A-6 | `grep -n "MESSAGE_RETENTION_SECONDS" apps/api/src/do/chat-room.ts` | l.59 `365 * 86400` — écart vs « purgé 90 j » consigné |
| A-7 | `head -15 apps/api/migrations/0016_heritage_profile.sql` | Profil d'Héritage 7 sections (Task 52, 2026-09-27) — préfiguration Étape 11.1 |
| A-8 | `ls etapes/ etapes/etape-00-cadrage/` | 7 dossiers (00-03, 05-07 — pas de 04, consigné) · CADRAGE.md · CGU-v1 · POLITIQUE-v1 · REGISTRE-v1 |
| A-9 | `grep -n "flow:" apps/api/src/routes/auth.ts` | `'otp' \| 'oauth_google' \| 'oauth_facebook' \| 'password'` — dépassement Étape 2 |
| A-10 | `grep -rli "entitlement" apps/api/src apps/api/migrations` | 0 résultat — Étape 8 non câblée (doctrine freemium ⚖️) |

---

## Annexe B — Journal des versions

| Version | Date | Contenu |
|---|---|---|
| v1.0 | 2026-10-03 | Première carte du Plan de Réalisation : les 12 étapes rendues à leurs gates datées (STATUS.md), 8 écarts plan↔réel consignés honnêtement (2 dépassements · 3 écarts · 1 évolution de doctrine · 2 nuances), modules transverses aux statuts, témoin chronologique documenté |

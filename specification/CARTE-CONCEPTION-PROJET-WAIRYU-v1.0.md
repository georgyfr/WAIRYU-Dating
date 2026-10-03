# WAIRYU — CARTE DE CONCEPTION DU PROJET — v1.0

> **Date** : 2026-10-03 · **Nature** : document de référence historique et structurelle
> **Complément de** : `contrat/contrat-inventaire.v1.3.md` (qui référence les quêtes) et de la carte du parcours utilisateur (expérience vécue).
> **Discipline** : chaque affirmation porte sa preuve — **une commande = un verdict** (annexe A).
> **Légende des statuts** : ✅ **certifié machine** (réf. garde) · ✅ **implémenté** (au runtime) · 🔵 **doctrine** (conçu, non implémenté) · 🟡 **à construire**.

---

## 0. LIRE CETTE CARTE — la règle des deux numérotations

Le projet utilise **deux numérotations imbriquées**. Toute confusion entre elles produit des erreurs de trace :

1. **Le DOMAINE** = le premier chiffre du code de quête (1→8). C'est le regroupement thématique psychologique.
2. **Le MONDE** = M1→M11. C'est l'unité de parcours utilisateur et de monétisation. Un domaine peut contenir plusieurs mondes.

| Domaine (1ᵉʳ chiffre) | Mondes | Quêtes | Statut |
|---|---|---|---|
| 1. Le Miroir | **M1 Le Miroir** (Fondation) · **M2 Le Volant** (Socle) | 1.1→1.11 | ✅ 11 quêtes |
| 2. La Boussole | **M3 La Boussole** | 2.1→2.8 | ✅ 8 quêtes |
| 3. Ton Terrain | **M4 Ton Terrain** | 3.1→3.7 | ✅ 7 quêtes |
| 4. Mon Histoire | **M5 Mon Histoire** | 4.1→4.4 | ✅ 4 quêtes |
| 5. Le Cœur 💎 | **M6 Mon Cœur** · **M7 Face aux Tempêtes** | 5.1→5.7 | ✅ 7 quêtes + 1 Portrait de Domaine |
| 6. L'Intime 💎 | **M8 L'Essentiel** · **M9 Profondeurs** | 6.1→6.5 | ✅ 5 quêtes opt-in |
| 7. Mon Monde 💎/🔑 | **M10 Mon Monde** | 7.1→7.3 | ✅ 3 quêtes (déblocable par Clé) |
| 8. Le Voyage à Deux ⭐ | **M11 Le Voyage à Deux** | 8.1→8.6 | ✅ 6 quêtes |

**Total conçu** : 51 quêtes, 570 items. **Au runtime** : 531 items (93,2 % — le différentiel est documenté, V15 clôture).

> ⚠️ **PIÈGE DE LECTURE DOCUMENTÉ (2026-10-03)** : le dossier `ci/quetes/` ne contient qu'un **échantillon de fixtures CI**, pas l'inventaire exhaustif des quêtes. **`Livrable des mondes/` fait foi** (preuve : M3 y déclare les 8 quêtes 2.1→2.8, dont 2.4, 2.6, 2.8 absentes de l'échantillon CI). Toute vérification d'existence d'une quête doit passer par le Livrable, jamais par `ci/quetes/` seul.

---

## 1. LA CONCEPTION FONDATRICE (avant toute ligne de code)

### 1.1 — Les documents fondateurs (tous au dépôt ✅)
| Document (chemin exact) | Rôle |
|---|---|
| `specification/PROJET-WAIRYU-Specification-Produit-v0.1.txt` (432 Ko) | Le texte source : vision, cible Afrique francophone, double mode, doctrine complète |
| `specification/PROJET-WAIRYU-Specification-Produit-v0.2.md` | Synthèse consolidée |
| `docs/ANALYSE-APPROFONDIE.md` | Marché, positionnement, coûts, projections 3 ans (+ charts 2026-09-27) |
| `docs/PLAN-DE-REALISATION-12-ETAPES.md` | Le chemin d'exécution Étape 0 → 11 + 2 modules transverses |
| `salle-prompts/constitution.v2.1.md` | Les règles de production (brûlage hors dépôt, interdits rouges, périmètres) |
| `contrat/contrat-inventaire.v1.3.md` | L'inventaire contractuel référencé par la CI |

### 1.2 — Étape 0 : Cadrage & décisions fondatrices *(gate ☑ 2026-09-23)*
1. Périmètre **MoSCoW** ;
2. **9 décisions d'architecture** tranchées — dont la n°9 : stockage **Cloudinary** (plan gratuit 25 Go, assets authentifiés, URLs signées, module `StorageService` interchangeable) car R2 exigeait une carte bancaire ;
3. **CGU v1** · **Politique de confidentialité v1** · **Registre des traitements RGPD v1** (déployés `apps/web/public/legal/`) ;
4. Marque visuelle v1 (Nunito) ;
5. Sondes Cloudinary V1-V8 : plan Free validé **en réel** (upload authentifié, accès sans signature bloqué, flou par transformation).

### 1.3 — La chaîne de production standard d'une quête (les « 7 étages »)
Chaque quête produit un dossier complet : `00-README` · `01-tableau-des-items` · `02-plan-de-melange-graine` · `03-signatures-registre` · `04-slots-de-miroir` · `05-ecran-d-intro` · `06-fiche-computation` · `07-miroir` · `cartes.yaml` (charte C1-C11).

### 1.4 — La couche invisible (conception parallèle, protégée)
- **14 codes de signaux** gelés au registre (`contrat/registres/signaux.json`) : BLA, CMP, COC, CSR, DE, DGR, DTM_M, DTM_N, ECD, GEN, JR1, QFI, RB1, RSQ — comptage réel vérifié par la CI-17 ;
- **60 formulations de trames HORS dépôt** (brûlage **sémantique**, empreinte vérifiée par CI) — la garde CI-16 balaye tout le dépôt pour l'interdire ;
- R6 (paires miroir → drapeau QFI) · trame fiabilité (30 items : sur-vendeurs, affabulateurs) · matrice des pièges (couplages destructeurs bloqués avant le premier message) · moteur de vigilance continu (14 signaux → actonnements seulement).

---

## 2. LA RÉALISATION TECHNIQUE — Étapes 1 à 7 *(gates STATUS.md)*

| Étape | Sous-étapes livrées | Gate | Date |
|---|---|---|---|
| **1. Socle technique** | Monorepo TS strict (API Hono + PWA React/Vite + `packages/shared`) · D1 prod+staging migrées (users, sessions, rate_limits, metrics_daily) · KV ×2 · Durable Object `ChatRoom` · cron purge · secrets | ☑ | 09-23 |
| **2. Authentification** | OTP email 6 chiffres (hashé, TTL 10 min, 3 essais, cooldown 60 s) · Turnstile strict en prod · sessions 30 j glissants révocables · rate limiting D1 (IP + email) | ☑ | 09-22 |
| **2-bis. OAuth** | Google + Facebook (demande fondateur) — incidents réglés en direct : `redirect_uri_mismatch` (URI absente du client Google), `Invalid Scopes: email` (permission Meta) → parcours complets validés | ☑ | 09-23 |
| **3. Profils & photos** | Assistant 6 étapes · consentement explicite dédié · Cloudinary `authenticated` + URLs signées Worker-side · flou par transformation · enrichi : naissance en 3 listes (âge 18+ serveur exact), géoloc auto ≈11 km, intentions étendues · **3ᵉ mode interracial** (mode de découverte, pas une intention) | ☑ | 09-23 |
| **4. Questionnaire & matching** | Banque versionnée en D1 · dimensions (values/goals/communication/personality/att…) · score ≥ 85 sur réponses identiques · dealbreakers éliminatoires · latence feed < 300 ms · 4-bis perf (Nunito auto-hébergée, cache immutable) · 4-ter types de profils recherchés | ☑ | 09-23 |
| **5. Découverte dual-mode** | Classique : pile de cartes mobile-first (swipe 90 px, Passe/Super/Like/Rewind 1/jour) · Invisible : portraits d'abord · bascule §4.8 sans perte · enrichissements « façon Tinder/Badoo à 80 % » (Task 30, 09-24) | ☑ | 09-23→24 |
| **6. Chat & révélation** | DO SQLite + WebSocket hibernation (messages seq monotone) · voice notes · révélation progressive **≥ 15 messages ET ≥ 7 jours ET accord des deux** (`chat.ts` §4.5) · unmatch+blocage · re-floutage vérifié | ☑ E2E | 09-23 |
| **7. Sécurité & modération** | Selfie 3 poses aléatoires (anti photo-papier) · badge vérifié · signalements→sanctions E2E · 2FA TOTP admin · smoke 56/56 · puis navigation TabBar dating + responsive mobile/tablette/PC | ☑ | 09-23 |

---

## 3. LES VAGUES DE CONTENU — la production doctrinale *(2026-09-27 → 09-30)*

1. **Mission A/B/C/D** — circuit 2.1, conversion documentée du périmètre Monde 1 + Socle (FM-023) ;
2. **FM-019→FM-022** — décisions comité appliquées : rotation DTM_N (brûlage v3 gravé hors dépôt), purge douce du source gelé, **règle gravée : le brûlage est SÉMANTIQUE, pas seulement verbatim** ;
3. **VAGUE 4** — les 7 miroirs du Socle (`07-miroir.md`) ;
4. **VAGUE 5** — les cartes de récompense (`cartes.yaml`, charte C1-C11) ;
5. **VAGUE 6** — fin du domaine Miroir + Boussole (8 quêtes, 47 items) ;
6. **VAGUE V7/V8** — miroirs manquants + audit-fin du domaine Boussole ;
7. **V9** — audit M2 + **M4 Ton Terrain complet** (3.1→3.7) ;
8. **V10** — **M5 Mon Histoire complet** (4.1→4.4, 50 items) ;
9. **V11** — vague interrompue, **récupérée par V12** (leçon consignée) ;
10. **V12** — **M6+M7 : domaine du Cœur refermé** (7 quêtes + 1 Portrait de Domaine) ;
11. **V13** — **M8+M9 L'Intime complet** (5 quêtes opt-in, 59 items) ;
12. **V14-B** — **M11 Le Voyage à Deux** (8.1→8.6, 46 items) — 47/51 dossiers, 88,9 % ;
13. **V15** — **M10 Mon Monde** (7.1→7.3 💎, 24 items) + **CLÔTURE DE PRODUCTION : 11/11 mondes, 531 items au runtime (93,2 %)**.

---

## 4. LE CYCLE AUDIT → CORRECTION → CERTIFICATION

1. **Audit C1** (quête 2.1, 09-28) + re-audit delta — rapports archivés `contrat/audits/` ;
2. **Audit hostile** (10-01) : **64 findings, 8 domaines** → **P0 conception** : 15 corrections ;
3. **D.4-FIX** (10-01) : correction d'un « faux vert » du balayage (angles morts structurels — leçon : un garde non testé sur son propre angle est un garde faible) ;
4. **P0 Implémentation** (10-01) : BLOC 0→10 — l'inventaire devient **runtime** : **24 migrations** 0001→0023 (core, metrics, auth, oauth, profiles, dates/locations, safe_rebuild, interracial, questionnaire, personality ×2, discovery, chat, safety ×2, conversation origin, heritage, pref_orientation, auth_password, username canonical, questionnaire doctrine, push prefs, q_doctrine seed) ;
5. **V16** (10-02) : **clôture bêta fermée** — re-audit V1.2 (30/35 conformes → 6 résidus refermés R1-R6), rapport final + guide d'audit ;
6. **RE-AUDIT V1.3** (10-02) : verdict de l'auditeur indépendant (4ᵉ passage, lecture seule) → **BÊTA FERMÉE DÉBLOQUÉE** — toutes gardes rejouées vertes ;
7. **V17** : conception parrainage (3 fragments, clés, 20 ⭐ de bienvenue, anti-abus par empreinte appareil/IP) + style ludique 🔵 (doctrine, non implémenté au runtime à ce jour) ;
8. **V18** (10-02/03) : **« TA RAISON D'ÊTRE ICI » — inversion architecturale** : un parcours de connaissance de soi dont la rencontre est une destination **optionnelle** — A migration `0024_v18_raison.sql` (enum voyage|rencontre|indecis, défaut indecis, `couple_travail` JAMAIS câblé) · 3 cartes visuellement équivalentes en 1ʳᵉ étape après le 18+ · A.4 privacy par construction · B bascule bidirectionnelle réversible (1 proposition max/palier, décision explicite) · C Q2.5 hors Socle (énoncés intacts, données bêta conservées) · D verrous + `ci/test_v18_raison.py` 23/23. **Poussée sur GitHub le 2026-10-03** (commit `f443595`), re-certifiée depuis la remote.

---

## 5. LES GARDES MACHINE PERMANENTES

| Garde | Script | Verdict au commit `f443595` |
|---|---|---|
| CI du contrat d'inventaire (17 vérifications, dont CI-16 garde étendue et CI-17 comptage signaux) | `ci/test_contrat_inventaire.py` | ✅ 17/17 — 762 fichiers balayés |
| Harnais P0 (H-01…H-12) | `ci/harnais_p0.py` | ✅ 12/12 VERT |
| Test V18 (T-1…T-7, replays sqlite) | `ci/test_v18_raison.py` | ✅ 23/23 VERT |
| Smoke a11y | `ci/outils/a11y_smoke.py` | ✅ exit 0 |
| Balayages anti-résidus | `ci/outils/balayage_*.py` | ✅ VERT |
| Outils de mélange anti-biais | `ci/outils/melange*.py` | ✅ en place |

---

## 6. LA GOUVERNANCE VIVANTE

- **Fiches de mutation FM-013 → FM-028** (`contrat/fiches-mutation/`) : toute mutation du contrat est tracée, tranchée, exécutée, vérifiée ;
- **STATUS.md** : le journal officiel des livraisons (12 étapes + journal daté) ;
- **Worklog** : 41 entrées d'exécution (Tasks A→36) ;
- **Registres** : `contrat/registres/` — signaux (14 codes), liaisons, dyades, signatures M1-M3 ;
- **Règle [11] / FM-027** : aucun push sans canal vérifié — protocole canonique `scripts/push-canon.sh` (① CI verte avant push ② jeton en env éphémère SEULEMENT, jamais sur disque ni `.git/config` ③ vérification réelle `ls-remote` = HEAD local) ;
- **GABARIT-PDF** (`contrat/GABARIT-PDF.md`) : le carnet A5/Nunito, page « Pour en parler à un professionnel ».

---

## 7. CE QUI RESTE À CONSTRUIRE

| Étape | Contenu | Statut |
|---|---|---|
| 8. Monétisation préparée, éteinte | Premium M6-M10 (tarifs analysés), écran de conversion A7 déjà doctriné | 🟡 à activer |
| 9. Qualité, tests & bêta fermée → ouverte | 3-4 semaines de bêta ; prérequis documentés au rapport V16 | 🟡 en cours d'ouverture |
| 10. Lancement francophonie | Fiche store (🟡 seule case non rédigée du parcours), KPI du module transverse 2 | 🟡 |
| 11. Post-lancement / Phase 2 | LLM modération (love-bombing/coercition, jamais seul) · signal IAC (niveaux Aron) · calibration continue (comité Q1-Q15) | 🔵 doctrine |
| P3+ SUR CADRAGE | `couple_travail` (réservé, rejeté par la base — CHECK SQL, type, validateur) · futur Monde couple | 🔵 non cadré |

---

## 8. TABLEAU FINAL — la construction en un coup d'œil

| Date | Jalon | Verdict |
|---|---|---|
| avant 09-22 | Spécification v0.1 (432 Ko) + v0.2 + analyse + plan 12 étapes + constitution | 🔵→✅ fondation |
| 09-22 → 09-23 | Étapes 0-7 (gates ☑, incidents réglés en direct) | ✅ |
| 09-24 | Enrichissements dating 3 modes (Task 30) | ✅ |
| 09-27 → 09-28 | Analyses marché + audit C1 | ✅ |
| 09-29 → 09-30 | 15 vagues : 11/11 mondes, 531 items runtime | ✅ clôture de production |
| 10-01 | Audit hostile 64 findings → P0 + D.4-FIX + P0 implémentation (24 migrations) | ✅ |
| 10-02 | V16 clôture + RE-AUDIT V1.3 : **bêta fermée débloquée** | ✅ |
| 10-03 | V18 poussée (`f443595`) et re-certifiée depuis la remote | ✅ **état courant** |

---

## ANNEXE A — LES PREUVES (une commande = un verdict, relevé du 2026-10-03)

| # | Commande | Verdict |
|---|---|---|
| P1 | `git ls-remote https://github.com/georgyfr/WAIRYU-Dating.git refs/heads/main` ×2 (avec et sans jeton) | `f44359545c6e49a53257c5934e97f42432d953dd` = HEAD local |
| P2 | `python3 ci/test_contrat_inventaire.py` (clone-test de la remote) | CI 17/17 — 762 fichiers (garde étendue VERT) |
| P3 | `python3 ci/harnais_p0.py` (clone-test de la remote) | 12/12 VERT |
| P4 | `python3 ci/test_v18_raison.py` (clone-test de la remote) | 23/23 VERT |
| P5 | `ls "Livrable des mondes/"M3*` | 8 dossiers 2.1→2.8 (piège `ci/quetes/` documenté §0) |
| P6 | `grep REVEAL_THRESHOLD_DAYS apps/api/src/routes/chat.ts` | 7 jours (§4.5 : ≥15 messages ET ≥7 jours ET accord des deux) |
| P7 | `git log --oneline -1` | `f443595 MISSION V18 — « TA RAISON D'ÊTRE ICI »…` |
| P8 | `git config --local --list` après pushes | aucune trace de jeton |

## ANNEXE B — JOURNAL DES VERSIONS DE CE DOCUMENT

| Version | Date | Contenu |
|---|---|---|
| v1.0 | 2026-10-03 | Création — générée depuis STATUS.md (journal officiel), le worklog (41 entrées), `Livrable des mondes/`, les gardes machine et les registres du contrat. Correction de trace intégrée : double numérotation domaine/monde explicite (§0). |

*Fin de la Carte de Conception v1.0 — la construction racontée avec ses preuves.*

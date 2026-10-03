# WAIRYU — CARTE DE SPÉCIFICATION PRODUIT — v1.0

> **Date** : 2026-10-03 · **Nature** : document de référence — ce que le produit PROMET et SPÉCIFIE, rendu lisible.
> **Complément de** : `specification/CARTE-CONCEPTION-PROJET-WAIRYU-v1.0.md` (comment ça a été construit) · `contrat/contrat-inventaire.v1.3.md` (ce qui doit exister, vérifié par la CI).
> **Discipline** : sources citées (chemin + ligne), statuts normalisés, preuves en annexe — **une commande = un verdict**.
> **Légende** : ✅ **certifié machine** · ✅ **implémenté** · 🔵 **doctrine** (conçu, non implémenté) · 🟡 **à construire** · ⚖️ **à valider par le comité**.

---

## 0. LIRE CETTE CARTE — l'architecture documentaire de la spécification

La spécification produit repose sur **deux documents aux rôles strictement distincts** :

| Document | Rôle | Règle |
|---|---|---|
| `specification/PROJET-WAIRYU-Specification-Produit-v0.1.txt` | **Corpus fondateur** (« version réaliste ») — 12 961 lignes, 432 Ko | **INCHANGÉ** — jamais réécrit |
| `specification/PROJET-WAIRYU-Specification-Produit-v0.2.md` | **Acte d'addition contractuel** (2026-10-01, post-audit hostile, finding E.4e) | **4 additions** — zéro réécriture du v0.1 |

Deux principes de provenance gravés par la v0.2 :
1. **« La spec rattrape la production, elle n'annonce rien de nouveau »** — les additions matérialisent des outils existant déjà au dépôt (portraits, carnet, gabarit) ;
2. **Chaîne de dépendance unidirectionnelle et vérifiable** — la spec référence le gabarit UNE fois (`contrat/GABARIT-PDF.md`) ; le gabarit référence la doctrine et le contrat v1.3, jamais la spec (référence circulaire « spec → gabarit → spec » supprimée).

---

## 1. LA PROMESSE FONDATRICE (v0.1 — ancrages verbatim)

### 1.1 — Le titre : « Redonner du choix, sans promettre l'impossible »
Le constat fondateur : *« les applications de rencontre actuelles imposent presque toutes un modèle unique. Soit le swipe sur photos, soit le questionnaire psychologique. Aucune ne laisse vraiment l'utilisateur choisir sa façon de découvrir l'autre, ni changer d'avis en cours de route. »*

### 1.2 — La réponse : une plateforme hybride, deux modes, un seul compte
- **Mode Classique** : photos visibles, swipe, rapidité ;
- **Mode Invisible** : photos floutées, questionnaire progressif, conversation avant le visuel ;
- L'utilisateur choisit son mode par défaut, **peut en changer**, et peut proposer à un match de passer en Invisible pour approfondir.
- **Statut** : ✅ implémenté — gate 5 (bascule §4.8 E2E sans perte).

### 1.3 — L'honnêteté structurelle (le manifeste)
*« Wairyu ne prétend pas réinventer l'alchimie humaine. Nous ne promettons pas l'âme sœur. Nous ne garantissons pas zéro catfishing, zéro déception ou zéro mauvaise rencontre. »* — l'application propose **un cadre plus honnête, plus lisible et plus respectueux**, pas une garantie d'amour.

### 1.4 — Le libellé de promesse (v0.1, l.597-600 — verbatim)
> **Wairyu promet :**
> - *un cadre plus transparent ;*
> - *des outils concrets ;*
> - *des limites assumées ;*
> - *une amélioration continue basée sur les retours utilisateurs.*

### 1.5 — La règle de monétisation (v0.1, l.538-539 — verbatim)
> *« La monétisation ne corrompt pas l'expérience · Sécurité et matching de base gratuits »*

C'est l'ancrage de toute la doctrine freemium ultérieure (mondes M6-M10 premium, sécurité et check-in **gratuits et permanents**, monétisation éteinte à la bêta).

### 1.6 — La personnalité de marque (v0.1, §3.7.2)
*« moderne mais pas froid · profond mais pas intimidant · sécurisant mais pas restrictif »* — incarnée : Nunito, la flamme sans culpabilité, le narrateur.

---

## 2. LES 4 ADDITIONS CONTRACTUELLES (v0.2 — acte d'addition, résumé fidèle)

### Addition 1 — La page « Pour en parler à un professionnel »
- **Obligatoire** en fin de carnet (et infrastructure de l'app au moment où le Portrait est rendu) ;
- Renvoi professionnel **permanent, non conditionnel** — psychologue ou thérapeute de couple, « apportez ce document à un premier entretien » ;
- **PAS d'annuaire de thérapeutes** au lancement (anti-commercial — doctrine :615) ;
- Base de production : signature **SIG_REN_REQUIS** (registre Monde 1, n° 25 — présence vérifiée, annexe A/P3) ; famille de formulation **GAB-REN** (`contrat/GABARIT-PDF.md` §6, verbatim proposé ⚖️ à valider par le comité) ;
- **Statut** : gabarit ✅ au contrat · page application 🔵 (à matérialiser avec la production du Portrait).

### Addition 2 — Le carnet de voyage téléchargeable
- Le **document PDF personnel** de l'utilisateur : synthèse imprimable du parcours (mondes traversés, sections §0-§6 des portraits, citations verbatim) ;
- Téléchargeable **à tout moment**, généré depuis les données de l'utilisateur **seul** ;
- **Verrous de contenu** : aucun score, aucun code, aucun sigle moteur, aucune donnée d'un autre utilisateur, aucune donnée de match (GABARIT-PDF.md §8) ;
- **Statut** : le concept est porté au runtime (la navigation « Carnet » existe — onglet 📖 vers `#/questionnaire`, V18) ; le **moteur PDF n'est pas câblé** (aucun jsPDF/Puppeteer dans les manifests — annexe A/P4) → 🟡 à construire, gabarit prêt.

### Addition 3 — Le gabarit PDF (cahier des charges de forme)
- **Format** : A5 (148×210 mm), marges 18 mm intérieur / 15 mm extérieur ;
- **Typographie** : Nunito (auto-hébergée) corps 11 pt / interlignage 1,45 · titres de monde 20 pt · titres de section 14 pt · citations utilisateur en italique 11 pt ;
- **Structure** : couverture → pages de garde par monde → sections §0-§6 → pied de page paginé « Portrait Wairyu — généré le [date] · version v1.3 » → **page finale obligatoire** (l'addition 1) ;
- **Accessibilité imprimée** : contraste ≥ 4,5:1, corps min 11 pt, **zéro information portée par la couleur seule** ;
- **Deux moteurs acceptés** (jsPDF client / Puppeteer serveur — spécification indépendante du moteur) ;
- **Statut** : ✅ `contrat/GABARIT-PDF.md` (7 249 octets) — au contrat, balayé par la garde CI-16 à chaque push.

### Addition 4 — Le Portrait Intégral
- La **synthèse finale** — réunion des Portraits de Domaine (**cœur** : produit ; **intime, sécurité, soi** : différés SUR CADRAGE, FM-026 §2) en un document unique, porté par le même gabarit A5 ;
- Déclaré **au niveau produit** comme livrable de clôture du parcours ; le contenu détaillé reste porté par les gabarits de portraits et le contrat v1.3 (PARTIE 13 — différés) ;
- **Statut** : 🔵 doctrine — sa production suit les Portraits de Domaine restants (verrou SUR CADRAGE).

---

## 3. CE QUE LA SPÉCIFICATION NE PROMET PAS (les limites gravées)

| Limite assumée | Conséquence produit |
|---|---|
| Pas d'âme sœur promise | Le score de match est **indicatif**, jamais prédictif — chaque match porte ses raisons ET ses limites |
| Pas de zéro catfishing | Vérification selfie + badge vérifié = **cadre**, pas garantie ; les limites sont dites à l'utilisateur |
| Pas de contrôle hors du cadre | Check-in sécurité gratuit, SOS, contact de confiance — outiller, ne pas promettre |
| Pas de prédiction des sentiments | Les 36 questions mesurent la compatibilité **réelle**, elles ne la fabriquent pas |

---

## 4. LES PHASES ÉVOQUÉES PAR LA SPECIFICATION (v0.1)

| Phase | Contenu | Statut |
|---|---|---|
| **MVP** | Dual-mode, Socle, mondes gratuits, matching, sécurité | ✅ livré (étapes 1-7 + 15 vagues) |
| **Phase 2** | Épaississement : LLM modération (jamais seul), signal IAC (niveaux Aron), calibration continue | 🔵 doctrine |
| **Phase 3 — Wairyu Moments** | L'événementiel culturel : salons culturels, défis, événements — *« ne remplace pas les rencontres en ligne, les complète »* — limites listées par la spec (masse critique, logistique, modération, juridique…) | 🔵 Phase 3 — non cadré |

> ⚖️ **Point d'attention comité** : la liste de monétisation historique du v0.1 (commission 10-15 % sur Moments, Wairyu+, partenariats) précède la doctrine freemium actuelle (M6-M10 + clés de parrainage, monétisation éteinte à la bêta). La réconciliation v0.1↔doctrine actuelle reste à trancher formellement — aucun libellé verrouillé n'est en conflit, mais la spec n'a pas encore fait son propre acte d'addition sur ce point.

---

## 5. TABLEAU DE CONFORMITÉ SPEC ↔ RUNTIME

| Élément spécifié | Statut | Preuve (annexe A) |
|---|---|---|
| Dual-mode + bascule sans perte | ✅ | gate 5, E2E |
| 18+ avant tout accès (mineur → ban) | ✅ | H-10 |
| Révélation ≥ 15 messages ET ≥ 7 jours ET accord des deux | ✅ | P5 |
| Sécurité gratuite permanente (check-in, SOS) | ✅ | doctrine étape 7 |
| Navigation « Carnet » | ✅ | P6 — onglet 📖 → `#/questionnaire` |
| Gabarit PDF au contrat | ✅ | P2 — balayé CI-16 |
| Signature SIG_REN_REQUIS au registre M1 | ✅ | P3 — n° 25 |
| Moteur de génération PDF | 🟡 | P4 — aucun moteur aux manifests |
| Page « Pour en parler à un professionnel » (app) | 🔵 | gabarit §6 prêt, suit le Portrait |
| Portrait Intégral | 🔵 | FM-026 §2 — SUR CADRAGE |
| Carnet PDF téléchargeable de bout en bout | 🟡 | addition 2 — gabarit prêt, moteur à câbler |

---

## ANNEXE A — LES PREUVES (une commande = un verdict, relevé du 2026-10-03)

| # | Commande | Verdict |
|---|---|---|
| P1 | `wc -l specification/PROJET-WAIRYU-Specification-Produit-v0.1.txt` | 12 961 lignes — corpus fondateur inchangé |
| P2 | `ls -la contrat/GABARIT-PDF.md` | 7 249 octets — le gabarit existe et passe la garde CI-16 |
| P3 | `grep -c SIG_REN_REQUIS contrat/registres/signatures/M1.json` | 1 — la signature de base de l'addition 1 est au registre |
| P4 | `grep -o '"jspdf[^"]*"\|"puppeteer[^"]*"' apps/*/package.json package.json` | vide — aucun moteur PDF câblé au runtime (conforme au tableau §5) |
| P5 | `grep REVEAL_THRESHOLD_DAYS apps/api/src/routes/chat.ts` | 7 — §4.5 : ≥ 15 messages ET ≥ 7 jours ET accord des deux |
| P6 | `grep -n "NAV_VOYAGE" apps/web/src/components/TabBar.tsx` | `{ id: 'carnet', hash: '#/questionnaire', icon: '📖', label: 'Carnet' }` |
| P7 | `sed -n '538,539p'` et `sed -n '597,600p'` (v0.1) | les deux ancrages verbatim des §1.4-1.5 de cette carte |
| P8 | push-canon.sh (verrous ①②③) | CI 17/17 avant push · jeton éphémère · ls-remote = HEAD |

## ANNEXE B — JOURNAL DES VERSIONS DE CE DOCUMENT

| Version | Date | Contenu |
|---|---|---|
| v1.0 | 2026-10-03 | Création — générée depuis la spécification v0.1 (12 961 lignes, ancrages verbatim l.538-539 et l.597-600), l'acte d'addition v0.2 (4 additions contractuelles, finding E.4e), le gabarit `contrat/GABARIT-PDF.md`, le registre M1.json et le runtime (`apps/web`, `apps/api`). Zéro reformulation de libellé verrouillé : tout verbatim est cité tel quel. |

*Fin de la Carte de Spécification v1.0 — ce que le produit promet, avec ses sources.*

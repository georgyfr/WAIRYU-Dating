# 00 — FICHE DE CADRAGE DE PRODUCTION

> quete : 6.4 « Tes frontières modernes » · fiche : 00 — fiche de cadrage (lire avant tout fichier du dossier)
> Source de vérité : Constitution v2.1 [2] [5] [6] [7] · refonte gelée — angles manquants n° 4
> (l. 885-896) · cadre éthique renforcé (l. 983-992) · table PARTIE 6 l. 2007 · registre des
> dimensions l. 3784 (classe C) · mission V13.D-1 (Task 25-d).
> B.3 : **production neuve déclarée** — 1ʳᵉ génération V13 (aucune génération antérieure ; angles
> cadrés au refonte gelée, aucun texte hérité ni réinventé).

## Restitution [10] (5 lignes)

- **Élément** : quête 6.4 « Tes frontières modernes » — 6 énoncés d'attitude Likert 5, 3 paires R6
  (pornographie · masturbation · flirt en ligne), opt-in strict, chiffré renforcé.
- **Monde** : M9 — L'INTIME — LES PROFONDEURS (codes Q6.4 — monde = métadonnée, FM-011 v2) ·
  Domaine de l'INTIME (M8+M9).
- **Statut freemium** : 💎 premium (territoire « Comment j'aime ») · phase P2.
- **Contraintes principales** : AUCUNE bonne réponse — la divergence d'attitudes se signale aux
  DEUX, sans pénalité, sans jugement, à personne d'autre · AUCUN miroir individuel ni carte
  (exemption par design, classe C) · énoncés sobres (≤ 14 mots, zéro contenu explicite) ·
  « micro-cheating » interdit au rendu (« le flirt en ligne »).
- **Ambiguïtés détectées** : ① le seuil de divergence est un verrou humain [9] — proposition
  provisoire consignée, comité ; ② la « semi-visibilité » du signal n'a pas de définition UI dans
  le refonte — cadrée ici comme « visible dans l'espace du match, aux deux membres seulement,
  jamais sur un profil public » (comité) ; ③ la sortie des sujets après la révélation photo
  (étage) est une règle d'orchestration produit — consignée, hors périmètre de production.

## Cadrage fiche

| Élément | Cadrage |
|---|---|
| **Ce que ça mesure** | Les **ATTITUDES** (pas les comportements) sur les 3 sujets de dispute sexuelle les plus fréquents 2020-2026 (refonte l. 888-896) : **la pornographie en couple** (attitudes de « non-négociable » à « contre », en passant par « occasionnel ») · **la masturbation en couple** (« naturelle / privée / blessante » — la divergence d'interprétation blesse doublement) · **le flirt en ligne et les réseaux** (« toléré / zone grise / trahison » — terme technique du refonte interdit au rendu, l'app dit « le flirt en ligne »). Énoncés **sobres** : zéro description d'actes. |
| **Le principe central** | **AUCUNE bonne réponse.** Deux attitudes opposées sans conversation préalable = une bombe à retardement. Le rôle de Wairyu n'est pas de juger : c'est de **croiser les attitudes et signaler la DIVERGENCE à explorer tôt** — dans l'esprit du score explicable (« ⚠️ sujet de conversation à aborder tôt », refonte l. 894). Formulation digne gravée : **« deux attitudes opposées sont légitimes ; c'est leur conversation qui protège le couple »**. |
| **Format de réponse** | Likert 5 niveaux (libellés standard) · **3 paires R6** : énoncé + son miroir recodé `6 − r` — 01×02 (pornographie) · 03×04 (masturbation) · 05×06 (flirt) · orientations **3 D / 3 I** (1 D + 1 I par paire) — documentées au 01. |
| **Dimensions** | 3 dimensions internes (moteur) : `pornographie` · `masturbation` · `flirt` — chacune produit une **position d'attitude** interne (moyenne D + I recodé, normalisée 0-1), **JAMAIS rendue individuellement** (ni score, ni profil, ni étiquette). |
| **Trames ▲** | **AUCUNE** — quête 100 % attitude déclarative (zéro signal hébergé, zéro position réservée). |
| **Mélange** | Graine **264427** (210427 + 1000 × ordinal 54 — règle de décade (6−1)×10+4 ; zéro collision vérifiée machine sur les 27 configs du dépôt) · **c1/c4 : analyse honnête des blocs de 2** (satisfiables — voir 02) · c5 : orientations équilibrées 3 D / 3 I · **course canonique par la session principale** (config `ci/quetes/6.4.json` À CRÉER — aucune config touchée par cette session). |
| **Signatures** | **SIG-6.4-01 « la divergence d'attitude »** — signal **semi-visible** « sujet de conversation à aborder tôt », affiché **aux DEUX membres du match**, jamais pénalisé, jamais jugé (03). |
| **Miroir / carte** | **EXEMPTIONS PAR DESIGN** — classe C du registre (refonte l. 3700 · l. 3784 : « zéro portrait individuel — FRI dyadique seulement ») : les attitudes ne sont pas des traits, ce sont des **ACCORDS à négocier** ; un profil d'attitude ferait porter un jugement. Le `07` documente l'exemption (précédents 1.7 / 1.11 / 2.8 / 4.4) ; `cartes.yaml` documente l'absence de carte. |
| **Étage de révélation** | **privé** — les sujets chauds (préférences 6.3, frontières modernes 6.4) se dévoilent **après la révélation photo, jamais avant** (refonte l. 975-979) : ces sujets exigent la confiance et le visage assumé. Règle d'orchestration produit — consignée. |
| **Consentement** | Opt-in par étage · réponses modifiables/supprimables **à tout moment** (sortie permanente) · chiffrement renforcé dédié, hors exports, effacement immédiat à la demande (refonte l. 988). |

## ✅ LES 7 RÈGLES ÉTHIQUES (cadre renforcé refonte l. 983-992 — vérifiées)

| # | Règle | Statut sur cette quête |
|---|---|---|
| 1 | **Opt-in par étage** | ✅ `acces: opt-in` — la quête entière est un consentement ; aucune obligation, l'opt-in n'est jamais châtié (le matching n'en dépend pas). |
| 2 | **RGPD renforcé** | ✅ `chiffrement: renforce` — données sensibles : chiffrement dédié, jamais dans les exports, effacement immédiat à la demande (refonte l. 988) ; régime technique hors périmètre — comité/juridique. |
| 3 | **Jamais de label clinique** | ✅ zéro « dysfonction / trouble / phobie » et dérivés — les attitudes se disent en mots quotidiens (vérifié machine sur le dossier). |
| 4 | **Jamais de jugement d'attitude** | ✅ pornophile et pornophobe sont des attitudes légitimes (refonte l. 990) — la divergence est signalée **aux DEUX, à personne d'autre** ; aucune pénalité, aucun score, aucune exclusion de match ; le signal ne dit NI la position NI la direction de qui que ce soit. |
| 5 | **Inclusion structurelle** | ✅ les positions d'attitude sont construites **indépendamment du genre, de l'orientation et de l'âge** — matrices identiques dans toutes les configurations (le flirteur, le flirteuse, tous les genres du match, tous les âges) ; documenté au 01. |
| 6 | **Sortie permanente** | ✅ `sortie: permanente` — modifiable ou supprimable à tout moment (plus souple que les 90 jours des tests standard, refonte l. 992). |
| 7 | **Trois usages / trois visibilités** | ✅ 6.4 vit sur les usages **privé** (moteur) et **semi-visible** (le flag aux deux) — la troisième visibilité (l'affichage choisi au profil) est réservée à la quête 6.5, le visible digne. |

## ⚖️ ARBITRAGES CONSIGNÉS (À VALIDER PAR LE COMITÉ)

1. **Exemption de miroir PAR DESIGN (pas par la liste [7])** : la liste [7] exempte « badge, écran
   de passage, fonctionnalité ou quête invisible » — 6.4 n'entre dans aucune de ces cases. La
   fondement retenu : la **classe C du registre des dimensions** (refonte l. 3700 : « 0 à 1 brique,
   factuelles, jamais interprétées » · l. 3784 : « Frontières modernes — zéro portrait individuel,
   FRI dyadique seulement ») : une analyse d'attitude individuelle serait un **jugement** — la
   constitution [2] (« un texte que les items ne prouvent pas est supprimé ») et le cadre éthique
   (l. 990) l'interdisent. Précédents d'exemption par design : 1.7 · 1.11 · 2.8 · 4.4.
2. **Seuil de divergence (SIG-6.4-01)** : |écart| ≥ 0.30 sur la position d'attitude normalisée 0-1,
   testé par dimension (3 tests indépendants) — PROVISOIRE, À VALIDER PAR LE COMITÉ (verrou [9]).
3. **Semi-visibilité** : le signal vit dans l'espace du match (visible des deux membres, symétrique,
   sans attribution ni direction), jamais sur un profil public, jamais à un tiers — définition de
   production, comité.
4. **Le signal n'entre dans AUCUN score** : il n'empêche pas le match, ne module rien, ne pénalise
   rien — c'est une invitation à parler, pas un verdict de compatibilité (distinct du dealbreaker
   digne de 6.5, qui élimine en amont, dignement).

## 🚫 INTERDITS SPÉCIFIQUES (liste fermée, vérifiable machine)

- Le terme technique du refonte (« micro-cheating ») : **interdit au rendu** (05, 07, cartes, écrans)
  — l'app dit **« le flirt en ligne »** ; le terme ne vit qu'aux docs moteur (00, 01) où il est
  documenté comme interdit.
- Contenu explicite : zéro description d'actes, zéro vocabulaire graphique — les énoncés parlent
  d'attitudes (« me pose problème », « j'appelle ça », « me semble »).
- « toujours » / « jamais » au rendu · tout label clinique · tout jugement d'attitude · toute
  métadonnée visible (codes, dimensions internes, seuils, positions) · toute divergence exposée à
  un tiers · toute pénalité ou exclusion de match issue de 6.4.

## 🔒 VERROUS

- **Le signal aux DEUX, symétrique, sans direction** — aucune attribution, aucune citation d'énoncé,
  aucune position révélée (verrou capital, gravé au 03, 04, 06).
- AUCUN rendu individuel : ni carte, ni miroir, ni profil d'attitude (exemption par design — 07).
- Position d'attitude : interne moteur, jamais rendue individuellement.
- Zéro trame hébergée — quête 100 % attitude déclarative.
- Chiffrement renforcé + sortie permanente : toute réponse est révocable à tout moment.

## 📖 Lecture des fichiers (ordre conseillé)

1. `01-tableau-des-items.md` — les 6 énoncés (3 paires R6, pôles) + usage moteur.
2. `02-plan-de-melange-graine-264427.md` — graine dérivée, faisabilité c1-c6 honnête, course attendue.
3. `03-signatures-registre.md` — SIG-6.4-01 (divergence aux deux) + liaisons 6.4×6.2 · 6.4×6.3.
4. `04-slots-de-miroir.md` — AUCUN slot individuel ; la brique FRI dyadique (semi-visible).
5. `05-ecran-d-intro.md` — l'écran d'entrée opt-in (sobriété, consentement).
6. `06-fiche-computation-EXEMPLE.yaml` — Q6.4-01 (modèle des 6 items).
7. `07-miroir.md` — la documentation de l'EXEMPTION par design.
8. `cartes.yaml` — la documentation de l'absence de carte par design.

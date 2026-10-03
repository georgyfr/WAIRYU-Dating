# CARTE DU CONTRAT D'INVENTAIRE v1.3 — DOCUMENT DE RÉFÉRENCE

> **Série des cartes de référence — tome 6.** Source cartographiée : `contrat/contrat-inventaire.v1.3.md`
> (265 lignes — 13 parties + 3 annexes). Méthode inchangée : les énoncés du document sont cités **verbatim** ;
> chaque statut est le résultat d'une commande exécutée sur le dépôt au commit courant (preuves en annexe A).
> Cette carte n'ajoute rien, ne corrige rien : elle **signale** les divergences, conformément à la règle que
> le contrat lui-même porte.

---

## §0 — PLACE DU DOCUMENT DANS L'ARCHITECTURE DOCUMENTAIRE

Chaîne fondatrice du dépôt — le contrat est le dernier maillon et le plus contraignant :

```
CONCEPTION (docs/CONCEPTION.md)                  → COMMENT le projet est construit
SPÉCIFICATION PRODUIT (specification/)           → CE QUE le produit promet
ANALYSE APPROFONDIE (docs/ANALYSE-APPROFONDIE.md) → POURQUOI ces choix
PLAN DE RÉALISATION (docs/PLAN-DE-REALISATION-12-ETAPES.md) → DANS QUEL ORDRE
CONSTITUTION (salle-prompts/constitution.v2.1.md) → LES RÈGLES PERMANENTES
CONTRAT D'INVENTAIRE (contrat/contrat-inventaire.v1.3.md) → LA LISTE CLOSE — SOURCE UNIQUE
```

Verbatim §0.1 :

> « Il est la **SOURCE UNIQUE** au sens de la Constitution [8] : en cas de divergence entre un document de
> production et le présent contrat, **le contrat gagne ; on signale ; on ne corrige pas** »

Miroir côté Constitution (l.96) : « Le Contrat d'Inventaire v1.3 est la SOURCE UNIQUE. […] LE CONTRAT
GAGNE — tu signales, tu ne corriges pas. » ✅ vérifié.

**Provenance assumée par le document lui-même** (verbatim de l'en-tête) :

> « **PROVENANCE (finding A.1, audit externe) : matérialisé post-audit.** Reconstitué depuis les documents
> de production publics et l'historique de travail. […] la numérotation de version est conservée telle
> qu'elle est référencée »

Le contrat ne cache pas qu'il est une reconstitution post-audit : les mentions RECONSTITUTION (Partie 1,
FM-028) font partie de la trace, pas une faiblesse cachée.

**Note de trace — divergence interne au document, signalée non corrigée.** La Partie 3 annonce « La CI
complète compte **16 vérifications** (CI-01 à CI-16 — inventaire en annexe C) » alors que l'annexe C du
même document en inventaire **17** (CI-01 → CI-17) et que le §13.3 explique l'ajout (« Implémentation :
§13.3 du test CI (CI-17) » — finding A.8). Le runtime tranche : **17/17 PASS**. L'inventaire à jour est
celui de l'annexe C ; la Partie 3 porte le décompte d'avant l'ajout de CI-17. Consigné tel quel — le
contrat n'est jamais corrigé, il est signalé.

**Les deux niveaux de matérialisation** — le tableau de bord de la CI les énonce lui-même (verbatim) :

```
═══ TABLEAU DE BORD — CONTRAT D'INVENTAIRE (verdict comité 2026-09-28) ═══
Mondes ............ 11      (inchangé)
Quêtes ............ 51       (matérialisées : 1/51 — la quête 2.1)
Items ............. 570     (matérialisés : 24 → taux de matérialisation 4.2 %)
Trame fiabilité ... 30       (inchangée)
Signatures ........ 35       (matérialisées : 5/35 — M2:1 · M3:4 · M1:30 déclarées, maison en attente Voie B)
Codes signaux ..... 14       (inchangés)
```

Deux métriques, jamais confondues (règle R1) : les **50 dossiers documentaires** (`Livrable des mondes/`
— 531 items produits, tableau 01 de chaque dossier) et le **contenu machine** (`contenu/mondes/M3-boussole/2.1-valeurs/`
— 5 fichiers, 24 items — « seule quête au contenu machine matérialisé (FM-013) »). Les 37 fichiers de
`ci/quetes/` sont des déclarations de structure/graines (orientation, dimension, graine par item), pas
l'inventaire — le piège est déjà documenté dans la Carte de Conception (« fixtures ≠ inventaire — le
Livrable fait foi »).

## §1 — PARTIE 0 : OBJET, AUTORITÉ, PÉRIMÈTRE

**Sous contrat (§0.3, verbatim : « Sont sous contrat »)** — tous vérifiés au runtime :

| Élément | Valeur déclarée | Verdict runtime |
|---|---|---|
| Mondes | 11 | ✅ 11 (tableau de bord CI) |
| Quêtes | 51 | ✅ 51 — 50 dossiers au Livrable |
| Items | 570 (540 carte + 30 trame fiabilité) | ✅ CI-01 : « 570 == 540+30 : True » |
| Trames sécurité | nombres déclarés au §13 | ✅ (voir §7) |
| Signatures de registre | 35 | ✅ CI-14 : « = 35/35 » |

**Hors contrat (§0.3, verbatim : « Sont HORS contrat (déclarés ailleurs) »)** : « les 60 trames de
sécurité formulées (document trames confidentiel, hors dépôt — règle 11-b), le plan freemium détaillé
(FM-012), la spécification produit » ✅ — la garde 11-b confirme le hors-dépôt (771 fichiers scannés,
zéro formulation).

§0.2 — Autorité : « Toute mutation du contenu (ajout, retrait, recomptage d'un item ou d'une quête) passe
par une fiche-mutation (rituel [10]) et incrémente la version. » ✅ 14 fiches au dossier
`contrat/fiches-mutation/`.

## §2 — PARTIE 1 : LES 7 RÈGLES DE GOUVERNANCE (R1-R7) — PORTEURS VÉRIFIÉS

Le document l'assume (verbatim) : « *(RECONSTITUTION — les rédactions originales R1-R7 ont été perdues
avec l'environnement d'exécution ; les règles ci-dessous sont reconstituées depuis les effets observables
dans le dépôt — Constitution v2.1, CI matérialisée, fiches FM-013 à FM-027. Chaque règle cite son porteur
machine.)* » — chaque porteur cité a été vérifié vivant :

| Règle | Porteur déclaré | Verdict runtime |
|---|---|---|
| R1 — « l'invariant compte ce qui EXISTE au contrat (design) ; la matérialisation mesure ce qui EXISTE en fichiers (production). Deux métriques, jamais confondues. » | CI-01 · FM-013 §5 | ✅ tableau de bord CI (§0) — les deux décomptes affichés côte à côte |
| R2 — « Un code d'item n'est jamais réattribué » | CI-15 | ✅ « 24 items matérialisés sur 570 · codes en double : aucun » |
| R3 — « Toute quête matérialisée porte un manifeste de contrôle… La CI rejoue, elle ne lit pas les verdicts sur parole. » | CI-02 à CI-07 | ✅ manifeste 2.1 : identité, plage gelée, totaux internes, sha256 des 5 fichiers — tout PASS |
| R4 — « Aucune formulation de trame n'entre dans un dépôt accessible publiquement » | CI-10 · CI-16 · garde étendue `ci/outils/garde_p0.py` | ✅ « Fichiers texte scannés : 771 … 🟢 VERT — zéro formulation de trame en clair » |
| R5 — « Une signature déclarée sans maison fichier reste au registre (Voie B)… l'orphelin est signalé, jamais effacé » | CI-14 · verrou [9] | ✅ « M1 déclarées 30 (Voie B réalisée post-audit A.3 …) = 35/35 » |
| R6 — « Les seuils et les zones du moteur restent "À VALIDER PAR LE COMITÉ" » | verrous [9] dans dossiers et registres | ✅ chaque ligne de M1.json porte « ADOPTÉ (FM-019) — provisoire concepteur » ; les registres M2/M3 citent le verrou [9] dans leur `invariant_note` |
| R7 — « La consommation des réservas est canonique ou signalée… jamais silencieuse » | notes de coordination M11 aux 02 des quêtes 7.2/7.3 | ✅ présentes : `M10-7.2…/02-plan-de-melange-graine-272427.md` · `M10-7.3…/02-plan-de-melange-graine-273427.md` + 00-README + fiches computation |

## §3 — PARTIE 2 : LES 7 INVARIANTS AU RUNTIME

| Invariant (verbatim du contrat) | Valeur | Verdict runtime |
|---|---|---|
| Mondes | **11** (6 gratuits · 5 premium — Constitution [6]) | ✅ 11 |
| Quêtes | **51** | ✅ 51 (matérialisées machine : 1/51 — la 2.1) |
| Items total | **570 = 540 carte + 30 trame fiabilité** (INCHANGÉ — matérialisation ≠ ajout) | ✅ 570 (matérialisés : 24 → 4,2 %) |
| Signatures | **35 = 30 M1 (déclarées, Voie B) + 1 M2 (SIG_CONTRIB) + 4 M3** | ✅ 35/35 — fichiers : M1.json 29 entrées d'index (28 ids nommés + 1 entrée collective « 6 fiches sécurité hors dépôt ») · M2.json 1 · M3.json 4 |
| Trames sécurité formulées | **60 hors dépôt** (document trames, Partie 11 pour T58-T60) | ✅ hors dépôt — garde 771 fichiers zéro trame |
| Trame fiabilité | **30** (18 désirabilité sociale + 8 over-claiming + 4 doublons longitudinaux) | ✅ 30 — slots déclarés aux tableaux 01, formulations hors dépôt |
| Codes signaux | **14 (13 gelés du dictionnaire [4] + DE)** — contrôle de comptage réel : §13.3 | ✅ 14 réels (CI-17) |

## §4 — PARTIE 3 : L'ÉQUATION DE VÉRIFICATION CI

Verbatim du contrat :

```
570  == 540 (carte) + 30 (trame fiabilité)                 → CI-01
 35  == 30 (M1 déclarées) + 1 (SIG_CONTRIB) + 4 (M3)       → CI-01, CI-14
matérialisées (quêtes)  ≤ 51                               → CI-01
items matérialisés      ≤ 570                              → CI-15
```

« L'équation tranchée (FM-013 §5) et encodée dans `ci/test_contrat_inventaire.py` » ✅ — le fichier
existe et le rejoue. Sortie CI-01 : « 570 == 540+30 : True · 35 == 30+1+4 : True · matérialisées ≤
quêtes : True ».

Divergence interne 16/17 : voir note de trace au §0 — le runtime prononce « VERDICT CI : **17/17
vérifications passent** — le dépôt est conforme aux invariants tranchés ».

## §5 — PARTIES 4 À 9 : LES SIX MONDES GRATUITS 🆓

Tous les dossiers cités ont été vérifiés présents sous `Livrable des mondes/` (50/50 — seul 1.8 absent,
conformément au différé). Décomptes cités tels que le contrat les pose.

### M1 « LE MIROIR » — Partie 4 (3 quêtes · 104 items) ✅

| Quête | Titre | Items | Décomposition (verbatim) | Statut |
|---|---|---|---|---|
| 1.1 | Ta personnalité | **58** | 50 carte (5 dimensions × 10) + 8▲ DTM_N (T01-T08) | ✅ 50 codes Q1.1-xx uniques au tableau 01 + 8 slots ▲ |
| 1.2 | Ta façon de t'attacher | **20** | 12 carte + 4▲ DTM_M (T09-T12) + 4▲ RSQ (T13-T16) | ✅ |
| 1.3 | Tes émotions | **26** | 20 carte + 6▲ empathie (T21-T26) | ✅ |

### M2 « LE VOLANT » — Partie 5 (8 quêtes · 56 items — « matérialisé : 47 (1.8 différé) ») ✅

| Quête | Titre | Items | Notes (verbatim) | Statut |
|---|---|---|---|---|
| 1.4 | Ton contrôle sur toi-même | **8** | double usage DGR | ✅ |
| 1.5 | L'épreuve du temps ✂ | **6** | choix comportementaux | ✅ |
| 1.6 | Ta façon de penser | **10** | 7 items + 3 énigmes | ✅ |
| 1.7 | Ton fonctionnement — opt-in | **2** | 2 cases | ✅ |
| 1.8 | Ton bien-être — opt-in, P3 | **9** | PHQ-9 (domaine public) — ⚠ DIFFÉRÉ COMITÉ, non matérialisé (§13.2) | ⚖️ différé — dossier ABSENT vérifié, conforme §13.2 |
| 1.9 | Ton élan du moment | **8** | | ✅ |
| 1.10 | Ce que tu apportes | **10** | SIG_CONTRIB (registre M2.json) | ✅ SIG_CONTRIB au registre (CI-13) |
| 1.11 | Es-tu prêt·e à rencontrer ? | **3** | quête-écran de passage | ✅ |

### M3 « LA BOUSSOLE » — Partie 6 (8 quêtes · 65 items) ✅

| Quête | Titre | Items | Notes (verbatim) | Statut |
|---|---|---|---|---|
| 2.1 | Tes valeurs | **24** | 20 carte + 4▲ DTM_N (pos 4·10·16·24) — seule quête au contenu machine matérialisé (FM-013) | ✅✅ 5 fichiers machine + manifeste (CI-02→CI-10) |
| 2.2 | Ta place pour la spiritualité | **6** | | ✅ |
| 2.3 | Tes non-négociables | **10** | 9 cochables + 1 champ libre | ✅ |
| 2.4 | Tes réalités | **8** | | ✅ |
| 2.5 | Ce que tu cherches | **3** | 4ᵉ réponse « Je découvre » | ✅ |
| 2.6 | Tes priorités 5 ans | **5** | | ✅ |
| 2.7 | Ta vision de la famille | **8** | | ✅ |
| 2.8 | Ton signe | **1** | hors score | ✅ |

### M4 « TON TERRAIN » — Partie 7 (7 quêtes · 52 items) ✅

| Quête | Titre | Items | Notes (verbatim) | Statut |
|---|---|---|---|---|
| 3.1 | Ton rythme de vie | **5** | | ✅ |
| 3.2 | Ton quotidien | **8** | | ✅ |
| 3.3 | Ton temps libre | **12** | + 3▲ (T-T09/T10/T11) | ✅ |
| 3.4 | Ton rapport à l'argent | **8** | + 2▲ (T-T07/T08) | ✅ |
| 3.5 | Ton entourage | **6** | | ✅ |
| 3.6 | Le choix visuel ✂ | **8** | 8 paires | ✅ |
| 3.7 | Tes attirances | **5** | | ✅ |

### M5 « MON HISTOIRE » — Partie 8 (4 quêtes · 50 items) ✅

| Quête | Titre | Items | Notes (verbatim) | Statut |
|---|---|---|---|---|
| 4.1 | Ton arbre relationnel | **8** | génogramme (0 item compté) + 8 | ✅ |
| 4.2 | Où tu en es aujourd'hui | **19** | 10 RB1 + 8 RSQ + 1 ouverte (Q4.2-19) — **corrigé post-audit (A.1) : la source historique disait 18** | ✅ 19 codes uniques recomptés au dossier — la correction est réelle |
| 4.3 | Ce que tes relations t'ont appris ✂ | **1** | 1 ouverte | ✅ |
| 4.4 | (invisible) Blessures et aisance | **22** | | ✅ |

### M11 « LE VOYAGE À DEUX » — Partie 9 (6 quêtes · 46 items) ✅

| Quête | Titre | Items | Notes (verbatim) | Statut |
|---|---|---|---|---|
| 8.1 | Les questions qui rapprochent | **36** | ordre fixe scénarique, révélation mutuelle | ✅ |
| 8.2 | Et toi, tu ferais quoi ? ✂ | **6** | dilemmes à choix forcé | ✅ |
| 8.3 | Le refus ✂ | **3** | scénarios ▲ T58-T60 (hébergées, Partie 11 du document trames) | ✅ formulations hors dépôt (CI-16) |
| 8.4 | Le bonus ↑ | **1** | geste GEN | ✅ |
| 8.5 | Vibe Check / Voice Check | **0** | fonctionnalité (spécification) | ✅ dossier présent, 0 item |
| 8.6 | Les services du rendez-vous | **0** | fonctionnalité (spécification) | ✅ dossier présent, 0 item |

## §6 — PARTIES 10 À 12 : LES CINQ MONDES PREMIUM 💎

Tous les dossiers cités ✅ présents. Le M8 (Partie 11) et le M9 sont marqués « opt-in » — le
consentement structurel de la Constitution [2] ; la numérotation 5.x/6.x/7.x/8.x partagée entre mondes
porte la trace de la fission 8→11 mondes (FM-008, résumée en annexe A du contrat) — le code de l'item
prime sur le dossier (« Q2.1-01 vit au monde M3 », codes gelés de la Constitution [5]).

| Partie | Monde | Quêtes | Items | Détail (verbatim) | Statut |
|---|---|---|---|---|---|
| 10 | M6 « MON CŒUR » 💎 | 4 (5.1 · 5.2 · 5.3 · 5.7) | **48** | 18 + 8 + 10 + 12 | ✅ |
| 10 | M7 « FACE AUX TEMPÊTES » 💎 | 3 (5.4 · 5.5 · 5.6) | **36** | 23 + 8 + 5 | ✅ |
| 11 | M8 « L'INTIME — L'ESSENTIEL » 💎 opt-in | 2 (6.1 · 6.2) | **36** | 16 + 20 | ✅ |
| 11 | M9 « L'INTIME — LES PROFONDEURS » 💎 opt-in | 3 (6.3 · 6.4 · 6.5) | **23** | 14 + 6 + 3 | ✅ |
| 12 | M10 « MON MONDE » 💎 | 3 (7.1 · 7.2 · 7.3) | **24** | 4 axes × 2 — trait ANCRAGE (7.1) · trait OUVERTURE (7.2) · matrice ANCRAGE × OUVERTURE, « 6 en mélange + 2 module opt-in vécu » (7.3) | ✅ |

Somme des 11 mondes rejouée par commande : 104+56+65+52+50+46+48+36+36+23+24 = **540** ✅.

## §7 — PARTIE 13 : TOTAUX DE CONTRÔLE, DIFFÉRÉS ET VERROUS

**13.1 — Équation de clôture (verbatim du contrat)** — « (constat machine, RAPPORT-FINAL-PRODUCTION.md) »,
fichier vérifié à `contrat/cloture/RAPPORT-FINAL-PRODUCTION.md` ✅ :

```
570 items au contrat
 = 540 items carte + 30 trame fiabilité (tissée, non matérialisée)
540 carte
 = 531 produits (dossiers livrés) + 9 différés (1.8 — PHQ-9)
531 produits · 50/51 dossiers · 11/11 mondes · 93,2 %
```

Arithmétique rejouée par commande : 540 = somme des 11 mondes ✅ · 540 − 9 = 531 ✅ · 531/570 = 93,2 % ✅ ·
50/51 dossiers (1.8 absent) ✅ · 11/11 mondes ✅.

**13.2 — Les 39 différés (verbatim : « clarification Q5 de l'auditeur »)** : « Le solde 570 − 531 = 39 se
décompose EXACTEMENT en deux familles de natures différentes — la confusion des deux serait une erreur de
lecture du contrat » — ✅ deux familles distinctes vérifiées :

1. **9 items PHQ-9 (quête 1.8)** — « items carte EXISTANTS au contrat mais NON MATÉRIALISÉS : la quête
   est différée par décision du comité (verrou : relecture professionnelle obligatoire avant mise en
   service ; retrait = lien ressources, zéro collecte — FM-019 §(4)) ». ✅ dossier absent vérifié (FM-019
   au dossier des fiches) — statut ⚖️ comité.
2. **30 trames de fiabilité** — « items TISSÉS dans les quêtes porteuses… sans matérialisation fichier
   dédiée : leurs formulations vivent au document trames confidentiel hors dépôt (règle 11-b) et leurs
   slots sont déclarés dans les tableaux 01 des dossiers porteuses. "Non matérialisées" signifie : pas de
   fichier items dédié — PAS : absentes du contrat. » ✅ slots ▲ vus aux tableaux 01 (ex. 1.1 : T01-T08),
   garde 11-b verte sur 771 fichiers.

**13.3 — Contrôle de comptage réel des codes signaux (finding A.8)** : « L'invariant "codes signaux =
14 (13 gelés du dictionnaire [4] + DE)" est contrôlé par comptage RÉEL du fichier
`contrat/registres/signaux.json` — un registre vidé ou amputé rend la CI rouge (le contrôle n'est plus
cosmétique). » ✅ CI-17 : « 14 codes réels (attendu 14 = 13 gelés + DE) : ['BLA', 'CMP', 'COC', 'CSR',
'DE', 'DGR', 'DTM_M', 'DTM_N', 'ECD', 'GEN', 'JR1', 'QFI', 'RB1', 'RSQ'] · doublons : aucun ».

**13.4 — Registres et fiches manquantes (findings A.2, A.3, A.7)** — trois faits vérifiés :

- « Les fiches FM-001 à FM-012 sont reconstituées en annexe A (FM-028-RETROSPECTIVE) » ✅ le fichier
  existe et s'intitule « RÉTROSPECTIVE : LES FICHES FONDATRICES FM-001 → FM-012 (reconstitution
  post-audit) » — finding A.2.
- « Les registres signatures/M1.json, liaisons.json et dyades.json sont matérialisés sous
  `contrat/registres/` » ✅ les trois fichiers + M2.json + M3.json + signaux.json présents.
- « L'écart d'arithmétique du registre M1 (17 annoncées / 19 narratives = 32) reste EN ATTENTE DE
  TRANCHAGE COMITÉ (Q4) — le contenu actuel est matérialisé tel quel, avec note. » ✅ l'écart est consigné
  DANS le registre lui-même — `_meta.ecart_arithmetique` de M1.json, verbatim :

> « Le registre source titre "Les 17 Signatures Narratives" mais énumère 19 fiches numérotées 8-26 (bloc
> Autonome : 5 fiches pour 4 annoncées ; transversale n° 26 ajoutée). Écart signalé NON corrigé au
> registre source (Constitution [8]) — EN ATTENTE DE TRANCHAGE COMITÉ (question Q4 de l'auditeur).
> L'invariant CI (35 = 30 M1 + 1 M2 + 4 M3, où 30 = 7 méta + 17 narratives + 6 sécurité) reste en vigueur
> jusqu'au tranchage ; il sera ajusté après comité. »

## §8 — ANNEXES A/B/C DU CONTRAT

| Annexe du contrat | Contenu déclaré | Verdict runtime |
|---|---|---|
| **A** — « LES DÉCISIONS FM-001 → FM-012 (résumé) » | renvoie à `contrat/fiches-mutation/FM-028-RETROSPECTIVE.md` — « les 12 décisions fondatrices (inventaire initial, renommage SDT→DTM, continuité Carte→Portrait, fusion des cartes 1.1, canal signal + trame fiabilité, créations 1.10/1.11, Boussole du discernement, Miroir de quête, versionnement salle-prompts, fission 8→11 mondes + table code→monde, plan freemium) » | ✅ le fichier existe (finding A.2 — « les 75 références à "FM-011 v2"… désormais résolubles ») ; le dossier porte 14 fiches : FM-013→023 · 026 · 027 · 028 |
| **B** — « LES CORRECTIONS POST-AUDIT (traçabilité) » | A.1 (matérialisation du contrat ; 4.2 = 19) · F.1 (brûlage 11-b, FM-027) · D.3a (balayage_codes_rendu.py) · D.4a-e (balayage_interdits_rendu.py) | ✅ 4.2 = 19 recompté · FM-027 au dossier · les deux scripts présents à `ci/outils/` |
| **C** — « INVENTAIRE DES 17 VÉRIFICATIONS CI » | CI-01 invariants · CI-02 manifestes découverts · CI-03 identité · CI-04 empreintes sha256 · CI-05 structure items · CI-06 mélange rejoué · CI-07 contrainte 5 · CI-08 slots anti-rendu · CI-09 signatures verrouillées · CI-10 placeholder officiel DTM_N (FM-027) · CI-11 traçabilité · CI-12 registre M3 · CI-13 registre M2 · CI-14 anti-orphelins · CI-15 anti-doublons · CI-16 garde étendue 11-b (FM-027) · CI-17 comptage réel signaux.json (A.8) | ✅ 17/17 PASS au runtime — l'inventaire de l'annexe C est le bon (voir note de trace §0) |

## §9 — TABLEAU FINAL DE CONFORMITÉ

| Énoncé du contrat | Statut |
|---|---|
| Équation 570 = 540 carte + 30 trame fiabilité | ✅ CI-01 + arithmétique rejouée |
| Équation 35 = 30 M1 + 1 M2 + 4 M3 | ✅ CI-01/CI-14 — « = 35/35 » |
| 50/51 dossiers du Livrable (1.8 seul absent) | ✅ décompte par commande |
| Somme des 11 mondes = 540 carte | ✅ rejouée (104+56+65+52+50+46+48+36+36+23+24) |
| 4.2 = 19 (correction post-audit A.1) | ✅ 19 codes uniques au tableau 01 du dossier |
| Quête 2.1 au contenu machine (5 fichiers + manifeste) | ✅ CI-02→CI-10 — FM-013 |
| Placeholder officiel sur les 4 trames DTM_N de 2.1 | ✅ CI-10 — « sha256 == placeholder officiel » (FM-027 · finding F.1) |
| signaux.json = 14 codes (13 gelés + DE) | ✅ CI-17 comptage réel |
| Garde 11-b — zéro formulation de trame en clair | ✅ CI-16 : 771 fichiers, 7 formats, 🟢 VERT |
| R1-R7 portées par des gardes réelles | ✅ 7/7 (§2) |
| Registre M1 — écart « 17 annoncées / 19 narratives » | ⚖️ EN ATTENTE DE TRANCHAGE COMITÉ (Q4) — consigné dans le registre lui-même, contenu matérialisé tel quel |
| Quête 1.8 PHQ-9 non matérialisée | ⚖️ différé comité (FM-019 §(4) — relecture professionnelle obligatoire, retrait = lien ressources) — 🔵 |
| FM-001 à FM-012 absentes du dépôt | 🟡 reconstituées FM-028-RETROSPECTIVE (finding A.2) — mention RECONSTITUTION assumée par le contrat |
| Partie 3 « 16 vérifications » vs annexe C « 17 » | 🟡 divergence interne au contrat, signalée non corrigée — runtime 17/17, annexe C à jour (CI-17 ajoutée, finding A.8) |
| Matérialisation machine 1/51 quête · 24/570 items (4,2 %) | 🟡 niveau de preuve DÉCLARÉ par le contrat lui-même (le reste vit en dossiers documentaires — R1 : deux métriques, jamais confondues) |

**Verdict de la carte** : le contrat d'inventaire v1.3 est le document le plus instrumenté du dépôt —
chaque invariant y a un porteur machine vivant, chaque écart y est consigné au lieu d'être gommé (registre
M1, 1.8, mentions RECONSTITUTION). Les statuts non verts relèvent tous d'attentes assumées par le contrat
lui-même (différés comité, reconstitution post-audit) ou de divergences qu'il ordonne de signaler plutôt
que de corriger.

## ANNEXE A — LES PREUVES PAR COMMANDE

| # | Commande | Résultat | Verdict |
|---|---|---|---|
| 1 | `python3 ci/test_contrat_inventaire.py` | « VERDICT CI : 17/17 vérifications passent » + tableau de bord (11 · 51 (1/51) · 570 (24 · 4,2 %) · 30 · 35 (5/35) · 14) | ✅ |
| 2 | `ls "Livrable des mondes/" \| wc -l` | 51 lignes = 50 dossiers de quêtes + README.md — aucun `M2-1.8-*` | ✅ 50/51 |
| 3 | `ls ci/manifeste-quete/` | `2.1.json` (seul manifeste — matérialisées : 1/51) | ✅ |
| 4 | `ls contenu/mondes/M3-boussole/2.1-valeurs/` | intro.md · items.yaml · melange.json · signatures.yaml · slots.yaml — 5 fichiers | ✅ FM-013 |
| 5 | python (arithmétique) | somme des 11 mondes = 540 · 540+30 = 570 · 540−9 = 531 · 531/570 = 93,2 % · 30+1+4 = 35 | ✅ |
| 6 | python (registres) | M1.json : 29 entrées d'index (28 ids nommés + 1 entrée collective « 6 fiches sécurité hors dépôt ») · M2.json : 1 · M3.json : 4 + `invariant_note` citant FM-013 §5 et le verrou [9] | ✅ |
| 7 | `rg -n "contrat-inventaire\|SOURCE UNIQUE" salle-prompts/constitution.v2.1.md` | l.96 : « Le Contrat d'Inventaire v1.3 est la SOURCE UNIQUE. […] LE CONTRAT GAGNE — tu signales, tu ne corriges pas. » | ✅ |
| 8 | `ls contrat/fiches-mutation/` | 14 fiches : FM-013→023 · 026 · 027 · FM-028-RETROSPECTIVE | ✅ |
| 9 | `rg -l "RAPPORT-FINAL-PRODUCTION" .` | `contrat/cloture/RAPPORT-FINAL-PRODUCTION.md` (+ FM-026, contrat, STATUS.md) | ✅ |
| 10 | `rg -o "Q4\.2-\d+" "Livrable des mondes/M5-4.2-Ou-Tu-En-Es-Aujourdhui/01-tableau-des-items.md" \| sort -u \| wc -l` | 19 | ✅ A.1 |
| 11 | `rg -o "Q1\.1-\d+" "Livrable des mondes/M1-1.1-Ta-Personnalite/01-tableau-des-items.md" \| sort -u \| wc -l` | 50 carte (+ slots ▲ T01-T08 déclarés au même tableau) | ✅ |
| 12 | `ls ci/outils/` | garde_p0.py · balayage_codes_rendu.py · balayage_interdits_rendu.py · melange.py · melange-biaxes.py · melange-heritage.py · a11y_smoke.py | ✅ porteurs annexe B |
| 13 | `rg -l -i coordination "Livrable des mondes/M10-7.2*" "Livrable des mondes/M10-7.3*"` | 02-plan-de-melange-graine-272427.md · 02-plan-de-melange-graine-273427.md + 00-README + fiches computation | ✅ R7 |
| 14 | lecture `contrat/registres/signatures/M1.json` → `_meta.ecart_arithmetique` | « Le registre source titre "Les 17 Signatures Narratives" mais énumère 19 fiches numérotées 8-26 … EN ATTENTE DE TRANCHAGE COMITÉ (question Q4 de l'auditeur) » | ⚖️ consigné |

## ANNEXE B — JOURNAL DES VERSIONS

| Version | Date | Nature |
|---|---|---|
| CARTE v1.0 | 2026-10-03 | Première publication — tome 6 de la série des cartes de référence (commit de la présente carte — voir journal STATUS.md) |
| Source : contrat-inventaire v1.3 | post-audit (finding A.1) | Version citée par la Constitution [8] (« SOURCE UNIQUE ») — numérotation conservée telle qu'elle est référencée ; matérialisation post-audit assumée dans l'en-tête du document |

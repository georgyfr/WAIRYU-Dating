# WTC-EMO-Q1 — Fondation documentaire de la dimension émotionnelle (v1.1)

> **STATUT : FONDATION DOCUMENTAIRE RÉVISÉE v1.1 — en attente de validation clinique humaine**
>
> Ce package est la **fondation documentaire** de la dimension émotionnelle,
> première dimension TRIPARTITE du projet WAIRYU (3 sous-échelles au lieu
> de 2 axes). Il ne contient **AUCUN code de validation**, **AUCUNE
> simulation**, **AUCUNE donnée**. Les packages de calcul suivront après
> validation clinique humaine de cette fondation.
>
> **Révision v1.1** : intégration des arbitrages S-EMO-1 à S-EMO-8 du
> superviseur sortant. La structure passe de 15 items partiels à **32 items
> complets** (28 obligatoires + 4 optionnels).

---

## Mission

Créer le dossier de fondation documentaire (structure, tables, templates,
bornes D-STD) pour la dimension émotionnelle. La dimension émotionnelle
est la **deuxième dimension** du projet WAIRYU (après la dimension
attachement, complète 5/5 avec RIO-01 à RIO-05).

**Numéro RIO cible** : RIO-06 « Ma météo intérieure »

---

## Avertissement D-SIM

> **Non applicable ici** : aucune simulation, aucune donnée. L'avertissement
> D-SIM sera affiché au package de calcul WTC-EMO-Q1-01 (quand il y aura
> des résultats simulés).

---

## Arborescence du package

```
validation-emotionnelle/                    [S-EMO-7 : renommé depuis dimension-emotionnelle/]
└── fondation/
    ├── README.md                           (ce fichier — statut FONDATION v1.1)
    ├── 01-items-q1.md                      (table des 32 items — MOT POUR MOT)
    ├── 02-sous-echelles.md                 (3 sous-échelles × 3 faces + blocs C/D-EXP/CAP/OPT-A)
    ├── 03-banque-forces.md                 (6 forces + SILENCIEUSE — conditions v1.1)
    └── 04-bornes-d-std.md                  (note : bornes au package de calcul + D-HIST)
```

---

## Structure complète de la dimension (v1.1)

### Échelle de fréquence (5 points — nouvelle granularité)

| JAMAIS = 1 | RAREMENT = 2 | PARFOIS = 3 | SOUVENT = 4 | TOUT LE TEMPS = 5 |

Cette échelle ordinale à 5 niveaux est **nouvelle** dans le projet WAIRYU.
Les packages précédents (RIO-01 à RIO-05) utilisaient une échelle
continue (scores A/B de 0 à 4).

### Les 3 sous-échelles principales (TRIPARTITE — 9 faces × 3 items = 27 items)

```
Dimension émotionnelle
├── E-R « Ma météo intérieure » (régulation) — 9 items
│   ├── E-R1 « L'explosion »
│   ├── E-R2 « Le mur »
│   └── E-R3 « La rumination »
├── E-B « Mes besoins affectifs » — 9 items
│   ├── E-B1 « Le besoin de mots »
│   ├── E-B2 « Le besoin de temps »
│   └── E-B3 « Le besoin de contact »            [S-EMO-1 v1.1]
└── E-L « Mes langages d'affection » — 9 items    [S-EMO-2 v1.1]
    ├── E-L1 « Ce que je donne »
    ├── E-L2 « Ce que je reçois »
    └── E-L3 « Ce que je partage » (capitalisation)
```

### Les 3 blocs annexes (5 items)

| Bloc | Description | Items | Statut |
|------|-------------|-------|--------|
| **C** | Mon comportement en situation réelle (C-A écho, C-B détente, C-C demande) | 3 | [S-EMO-3 v1.1] |
| **D-EXP** | La demande explicite | 1 | [S-EMO-5 v1.1] |
| **CAP** | La capitalisation (4 choix forcés) | 1 | [S-EMO-4 v1.1] |

### Le bloc optionnel (4 items — package WTC-EMO-Q4)

| Bloc | Description | Items | Statut |
|------|-------------|-------|--------|
| **OPT-A** | Ma météo intérieure (croisement de couple) | 4 (optionnels) | [S-EMO-8 v1.1] |

### Total

**32 items** (28 obligatoires + 4 optionnels) — temps de remplissage estimé 8-12 minutes.

---

## Les 6 forces émotionnelles (banque fermée — conditions v1.1)

| Force | Nom | Condition (résumé — voir `03-banque-forces.md`) |
|-------|-----|--------------------------------------------------|
| F-E1 | Le cœur qui écoute | C-A ≥ 2 OU journal L ≥ 4/7 |
| F-E2 | Le cœur qui pacifie | E-R1 ≤ 2,5 OU C-B ≥ 2 OU journal U ≥ 4/7 |
| F-E3 | Le cœur qui célèbre | CAP = AC OU journal M ≥ 4/7 |
| F-E4 | Le cœur qui réclame | C-C ≥ 2 OU D-EXP ≥ 3 OU journal M ≥ 4/7 |
| F-E5 | Le cœur qui tient | (E-R3 ≤ 2,5 ET C-B ≥ 2) OU C-A ≥ 2 OU (journal L ≥ 4/7 ET M ≥ 3/7) |
| F-E6 | Le cœur qui convertit | C-C ≥ 3 OU journal U ≥ 3/7 |
| SILENCIEUSE | Ton cœur est encore discret... | Aucune force activée |

**Limite** : max 2 forces (règle de densité — même logique que RIO-03).

---

## ✅ Les 8 signalements S-EMO-1 à S-EMO-8 — TOUS CLOS en v1.1

| # | Signalement | Arbitrage superviseur sortant | Statut |
|---|-------------|-------------------------------|--------|
| **S-EMO-1** | Items E-B3 manquants | 3 items ajoutés (E-B3-1, E-B3-2, E-B3-3) | ✅ Clos v1.1 |
| **S-EMO-2** | Sous-échelle E-L manquante | 9 items ajoutés (E-L1-1 à E-L3-3) | ✅ Clos v1.1 |
| **S-EMO-3** | Items C-A, C-B, C-C non définis | Échelle C ajoutée (3 items) | ✅ Clos v1.1 |
| **S-EMO-4** | « capitalisation active-constructive » non défini | Question CAP à 4 choix forcés | ✅ Clos v1.1 |
| **S-EMO-5** | « auto-rapport demande explicite » non défini | Item D-EXP ajouté | ✅ Clos v1.1 |
| **S-EMO-6** | Variables journal L/U/M vs l/u/m | Minuscule code, majuscule doc — moteur convertit | ✅ Clos v1.1 |
| **S-EMO-7** | Inconsistance nommage | `dimension-emotionnelle/` → `validation-emotionnelle/` (git mv) | ✅ Clos v1.1 |
| **S-EMO-8** | 4 items optionnels manquants | Bloc OPT-A ajouté (4 items, optionnels) | ✅ Clos v1.1 |

**Signalement résiduel mineur** : S-EMO-3b (mention « question OPT » dans F-E6) — à spécifier au package de calcul. La condition principale C-C ≥ 3 reste évaluable.

---

## Faute d'orchestrateur n°15 bis — D-HIST (nouvelle règle)

La faute n°15 bis a été commise par le superviseur sortant lors du tour
précédent : régénération du prompt de fondation sans vérifier que la
mission avait déjà été exécutée. Elle est reconnue publiquement et donne
naissance à la règle **D-HIST** :

> **D-HIST** : avant de produire une nouvelle mission, le superviseur
> vérifie l'état du dépôt GitHub (dernier commit, dernier worklog) pour
> s'assurer que la mission n'a pas déjà été exécutée. Tout package
> ré-exécuté en double est une faute d'orchestrateur.

**Fautes d'orchestrateur cumulées : 16** (15 + faute n°15 bis).

---

## Note d'écriture (les 3 filtres du projet)

Tous les items respectent les 3 filtres du projet :
- Phrases courtes (≤ 15 mots)
- Mots du quotidien, pas de jargon clinique
- Aucune option « meilleure » que les autres (pas de désirabilité sociale)
- Les items E-R2 sont exprimés du point de vue « je préfère » / « je garde » (pas de jugement négatif direct — la suppression est un mécanisme, pas une faute)

---

## Principes non négociables (rappel)

1. **Honnêteté sans condamnation** : aucun item ne blâme
2. **Ombre ET lumière** : chaque résultat montre les deux
3. **Jamais le mot « pathologie » à l'écran**
4. **Langage simple** : niveau B1 CECRL
5. **Jamais l'évaluation du partenaire** : le sujet répond sur soi
6. **Instruments 100 % originaux** : construits publics cités, items ex nihilo
7. **Calcul 100 % local**
8. **Inclusivité par conception**

---

## Règles permanentes appliquées

| Règle | Application |
|-------|-------------|
| **D-STD** | Bornes au package de calcul, pas ici |
| **D-STD-2** | Plafond PAR CONFIGURATION (par face, par sous-échelle) |
| **D-CHECK** | Cohérence interne vérifiée (15 items vs 9 faces → écarts signalés → 8 arbitrages reçus → intégrés v1.1) |
| **D-TABLE** | Voies d'activation alignées (items C-A/C-B/C-C + D-EXP + CAP définis) |
| **D-SIM** | Non applicable (aucune simulation) |
| **D-ENV** | Non applicable (aucune exécution) |
| **D-HIST** *(nouvelle)* | Vérification dépôt GitHub avant mission (appliquée ce cycle) |
| **Exécuteur strict** | Signalement sans correction libre (S-EMO-1 à S-EMO-8 → 8 signalements, 0 correction libre) |

---

## Prochaines étapes

1. ✅ **Arbitrage du superviseur** sur les 8 signalements — **FAIT** (v1.1)
2. ⏳ **Validation clinique humaine** de la fondation v1.1
3. ⏳ **Package de calcul WTC-EMO-Q1-01** (après validation) — avec code, simulateur, bornes D-STD calculées, critères, rapport 7 sections
4. ⏳ **RIO-06** inscrit au registre si VALIDÉ

---

## Publication

Package poussé sur GitHub dans
`WAIRYU-Dating → Wairyu thérapie couple/validation-emotionnelle/fondation/`.

**Historique des commits** :
- `d901b61` — Fondation v1.0 (15 items + 6 forces + 7 signalements) — `dimension-emotionnelle/`
- *(ce commit)* — Fondation v1.1 (32 items + 6 forces + 8 signalements clos + D-HIST) — `validation-emotionnelle/` (renommage S-EMO-7)

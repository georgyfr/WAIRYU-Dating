# WTC-EMO-Q1 — Fondation documentaire de la dimension émotionnelle

> **STATUT : FONDATION DOCUMENTAIRE — en attente de validation clinique humaine**
>
> Ce package est la **fondation documentaire** de la dimension émotionnelle,
> première dimension TRIPARTITE du projet WAIRYU (3 sous-échelles au lieu
> de 2 axes). Il ne contient **AUCUN code de validation**, **AUCUNE
> simulation**, **AUCUNE donnée**. Les packages de calcul suivront après
> validation clinique humaine de cette fondation.

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
> D-SIM sera affiché au package de calcul (quand il y aura des résultats
> simulés).

---

## Arborescence du package

```
dimension-emotionnelle/
└── fondation/
    ├── README.md                    (ce fichier — statut FONDATION)
    ├── 01-items-q1.md               (la table des 15 items — MOT POUR MOT)
    ├── 02-sous-echelles.md          (les définitions des 3 sous-échelles × 3 faces)
    ├── 03-banque-forces.md          (la banque des 6 forces émotionnelles + SILENCIEUSE)
    └── 04-bornes-d-std.md           (note : bornes au package de calcul, pas ici)
```

---

## Structure de la dimension émotionnelle

### Échelle de fréquence (5 points — nouvelle granularité)

| JAMAIS = 1 | RAREMENT = 2 | PARFOIS = 3 | SOUVENT = 4 | TOUT LE TEMPS = 5 |

Cette échelle ordinale à 5 niveaux est **nouvelle** dans le projet WAIRYU.
Les packages précédents (RIO-01 à RIO-05) utilisaient une échelle
continue (scores A/B de 0 à 4).

### Les 3 sous-échelles (TRIPARTITE)

```
Dimension émotionnelle
├── E-R « Ma météo intérieure » (régulation)
│   ├── E-R1 « L'explosion »    — l'émotion déborde vite et fort
│   ├── E-R2 « Le mur »         — l'émotion est retenue, cachée
│   └── E-R3 « La rumination »  — l'émotion tourne en boucle
├── E-B « Mes besoins affectifs »
│   ├── E-B1 « Le besoin de mots »    — entendre que l'on compte
│   ├── E-B2 « Le besoin de temps »   — de la vraie présence
│   └── E-B3 « Le besoin de contact » — le toucher non sexuel
└── E-L « Mes langages d'affection »
    ├── E-L1 « Ce que je donne »    — mon canal de don spontané
    ├── E-L2 « Ce que je reçois »   — mon canal de réception réel
    └── E-L3 « Ce que je partage »  — la capitalisation
```

### Les 6 forces émotionnelles (banque fermée)

| Force | Nom | Condition (résumé) |
|-------|-----|--------------------|
| F-E1 | Le cœur qui écoute | C-A ≥ 2 OU C-B ≥ 2 OU journal L ≥ 4/7 |
| F-E2 | Le cœur qui pacifie | E-R1 ≤ 2,5 OU C-B ≥ 2 OU journal U ≥ 4/7 |
| F-E3 | Le cœur qui célèbre | capitalisation active-constructive ≥ 3 OU journal M ≥ 4/7 |
| F-E4 | Le cœur qui réclame | C-C ≥ 2 OU (E-B1 ≥ 3 ET auto-rapport) OU journal M ≥ 4/7 |
| F-E5 | Le cœur qui tient | (E-R3 ≤ 2,5 ET C-B ≥ 2) OU C-A ≥ 2 OU journal |
| F-E6 | Le cœur qui convertit | C-C ≥ 3 OU journal U ≥ 3/7 |
| SILENCIEUSE | Ton cœur est encore discret... | Aucune force activée |

**Limite** : max 2 forces (règle de densité — même logique que RIO-03).

---

## ⚠️ Signalements critiques (S-EMO-1 à S-EMO-6)

En tant qu'**exécuteur strict**, j'ai détecté **6 écarts** dans la
spécification du superviseur sortant. Je les signale **sans correction
libre** — ils nécessitent un arbitrage du superviseur avant que le
package de calcul puisse être produit.

| # | Signalement | Description | Impact |
|---|-------------|-------------|--------|
| **S-EMO-1** | Items E-B3 manquants | La face E-B3 « Le besoin de contact » est définie mais aucun item n'est listé (E-B3-1, E-B3-2, E-B3-3 manquants) | 3 items manquants |
| **S-EMO-2** | Sous-échelle E-L entière manquante | La sous-échelle E-L (3 faces × 3 items = 9 items) est définie mais AUCUN item n'est listé | 9 items manquants |
| **S-EMO-3** | Items C-A, C-B, C-C non définis | Les conditions des forces F-E1, F-E2, F-E4, F-E5, F-E6 référencent des items « C-A », « C-B », « C-C » qui n'appartiennent pas à la table des 15 items. Une échelle « Comportement » (C) semble manquer. De plus, C-A et C-C sont référencés sous plusieurs libellés différents. | Les conditions des forces ne peuvent pas être évaluées |
| **S-EMO-4** | Item « capitalisation active-constructive » non défini | La force F-E3 référence un item non défini dans la table | F-E3 non évaluable |
| **S-EMO-5** | « auto-rapport demande explicite » non défini | La force F-E4 référence un champ d'auto-rapport non spécifié | F-E4 a une condition imprécise |
| **S-EMO-6** | Variables journal (L, U, M) vs (l, u, m) | Les conditions utilisent des majuscules (L, U, M) mais les variables définies dans RIO-03 sont en minuscules (l, u, m). Correspondance à clarifier. | Risque de confusion de variables |

### Total des items manquants

| Catégorie | Items attendus | Items fournis | Manquants |
|-----------|----------------|---------------|-----------|
| E-R (Régulation) | 9 | 9 | 0 |
| E-B (Besoins) | 9 | 6 | 3 (E-B3) |
| E-L (Langages) | 9 | 0 | 9 (toute la sous-échelle) |
| Échelle C (Comportement) | ? | 0 | ? (C-A, C-B, C-C) |
| **Total** | **27+** | **15** | **12+** |

---

## Note d'écriture (les 3 filtres du projet)

Les 15 items fournis respectent les 3 filtres du projet :
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
| **D-CHECK** | Cohérence interne vérifiée (15 items vs 9 faces → écarts signalés) |
| **D-TABLE** | Voies d'activation à aligner (items C-A/C-B/C-C à définir) |
| **D-SIM** | Non applicable (aucune simulation) |
| **D-ENV** | Non applicable (aucune exécution) |
| **Exécuteur strict** | Signalement sans correction libre (S-EMO-1 à S-EMO-6) |

---

## Prochaines étapes

1. **Arbitrage du superviseur** sur les 6 signalements (S-EMO-1 à S-EMO-6)
2. **Validation clinique humaine** de la fondation (après résolution des signalements)
3. **Package de calcul WTC-EMO-Q1** (après validation) — avec code, simulateur, bornes D-STD calculées, critères, rapport 7 sections
4. **RIO-06** inscrit au registre si VALIDÉ

---

## Publication

Package poussé sur GitHub dans
`WAIRYU-Dating → Wairyu thérapie couple/dimension-emotionnelle/fondation/`.

> ⚠️ **SIGNALEMENT S-EMO-7** : la spécification du superviseur sortant
> contient une **inconsistance de nommage** :
> - L'en-tête indique `FICHIER À CRÉER : dimension-emotionnelle/fondation/`
> - La Section C du rapport attendu indique `dossier validation-emotionnelle/fondation/`
>
> J'ai utilisé **`dimension-emotionnelle/`** (option de l'en-tête, plus
> descriptive d'une fondation). Si le superviseur préfère
> `validation-emotionnelle/` (cohérent avec les packages précédents
> `validation-q1` à `validation-q5`), le dossier peut être renommé.

# 04 — Bornes D-STD (WTC-EMO-Q1)

> **STATUT : FONDATION DOCUMENTAIRE — en attente de validation clinique humaine**
>
> Ce document précise la position des bornes D-STD pour la dimension
> émotionnelle. **Aucune borne n'est calculée ici** — c'est une mission
> de fondation documentaire, pas de validation.

---

## Position des bornes D-STD dans le cycle de développement

Conformément à la règle **D-STD** (renforcée par D-Q3-J et D-STD-2),
les bornes de faisabilité se calculent **au package de calcul**, dans
la **géométrie de simulation réelle** — PAS à la fondation
documentaire.

### Rappel des règles applicables

| Règle | Application à la dimension émotionnelle |
|-------|------------------------------------------|
| **D-STD** | Les bornes de faisabilité sont calculées AVANT les critères, sur le CODE réel du simulateur. Les seuils sont posés à ≥ 3 pts sous le plafond atteignable. |
| **D-Q3-J** | Les bornes sont **conditionnelles à la géométrie** du simulateur. Une borne n'est pas universelle — elle dépend des paramètres de `gen()`. |
| **D-STD-2** | Le plafond D-STD se calcule **PAR CONFIGURATION** (par face, par sous-échelle), pas seulement global. Une config injoignable serait invisible dans la moyenne globale (cf. D-Q4-1). |

---

## Bornes à calculer au package de calcul

Les bornes suivantes seront calculées au **package de calcul WTC-EMO-Q1**
(à produire après validation clinique humaine de cette fondation) :

### Bornes de structure (9 faces)

| Borne | Description | Méthode de calcul |
|-------|-------------|-------------------|
| **B-E-R1** | Plafond de cohérence interne face E-R1 (3 items) | α de Cronbach simulé sur 1000 profils |
| **B-E-R2** | Plafond de cohérence interne face E-R2 (3 items) | α de Cronbach simulé sur 1000 profils |
| **B-E-R3** | Plafond de cohérence interne face E-R3 (3 items) | α de Cronbach simulé sur 1000 profils |
| **B-E-B1** | Plafond de cohérence interne face E-B1 (3 items) | α de Cronbach simulé sur 1000 profils |
| **B-E-B2** | Plafond de cohérence interne face E-B2 (3 items) | α de Cronbach simulé sur 1000 profils |
| **B-E-B3** | Plafond de cohérence interne face E-B3 (3 items) | α de Cronbach simulé sur 1000 profils — **EN ATTENTE DES ITEMS (S-EMO-1)** |
| **B-E-L1** | Plafond de cohérence interne face E-L1 (3 items) | α de Cronbach simulé sur 1000 profils — **EN ATTENTE DES ITEMS (S-EMO-2)** |
| **B-E-L2** | Plafond de cohérence interne face E-L2 (3 items) | α de Cronbach simulé sur 1000 profils — **EN ATTENTE DES ITEMS (S-EMO-2)** |
| **B-E-L3** | Plafond de cohérence interne face E-L3 (3 items) | α de Cronbach simulé sur 1000 profils — **EN ATTENTE DES ITEMS (S-EMO-2)** |

### Bornes de sélection (forces)

| Borne | Description | Méthode de calcul |
|-------|-------------|-------------------|
| **B-SIL** | Taux attendu de SILENCIEUSES par groupe (D-STD-2 — par configuration) | Simulation Monte-Carlo 1M seed 20261015 (méthode D-Q3-J) |
| **B-FORCE** | Plafond d'activation par force (F-E1 à F-E6) | Simulation par configuration |
| **B-DENSITE** | Plafond de coïncidence moteur/simulateur (vérité croisée) | 100 % attendu (déterministe) |

### Bornes de géométrie (à définir au package de calcul)

| Borne | Description |
|-------|-------------|
| **B-G1** | Taux de SILENCIEUSES dans le groupe "force faible" (cf. D-STD G1 de RIO-03) |
| **B-G2** | Taux d'activation ≥ 1 force dans le groupe "force claire" |
| **B-G3-G4** | Configurations spécifiques (perdre vive, dépendre — équivalents émotionnels) |

---

## Pourquoi pas de bornes ici ?

La fondation documentaire pose la **structure** (items, faces, sous-échelles,
forces, conditions). Les bornes dépendent de :

1. **La géométrie du simulateur** (paramètres de `gen()` — moyennes, écarts-types, taux de journal, etc.) — pas encore définie
2. **Le code réel** des fonctions `cond_A`, `cond_B`, `cond_journal` équivalentes pour la dimension émotionnelle — pas encore écrit
3. **Les groupes simulés** (équivalents de G1-G4 de RIO-03) — pas encore définis

Calculer des bornes maintenant serait de la **présomption** — on poserait
des seuils sur une intention, pas sur un code (violation de D-STD).

---

## Avertissement D-SIM

> **Note** : l'avertissement D-SIM n'est **PAS applicable** à cette fondation
> documentaire. Aucune simulation, aucune donnée. L'avertissement D-SIM
> sera affiché au package de calcul (quand il y aura des résultats simulés).

---

## Engagement pour le package de calcul

Au package de calcul WTC-EMO-Q1 (à produire après validation clinique
humaine de cette fondation), je m'engage à :

1. Calculer les bornes AVANT de poser les critères (D-STD)
2. Calculer les bornes PAR CONFIGURATION (D-STD-2) — pas seulement global
3. Poser les seuils à ≥ 3 pts sous le plafond mesuré (D-STD)
4. Documenter toute borne non atteinte comme signal géométrique (D-Q3-J), pas comme échec
5. Afficher l'avertissement D-SIM (résultats de simulation)

**Mais avant cela** : les signalements S-EMO-1 à S-EMO-6 doivent être
résolus par le superviseur (items manquants, items C-A/C-B/C-C non
définis, variables journal à clarifier).

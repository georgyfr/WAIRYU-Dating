# 04 — Bornes D-STD (WTC-EMO-Q1 — v1.1)

> **STATUT : FONDATION DOCUMENTAIRE RÉVISÉE v1.1 — en attente de validation clinique humaine**
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
| **D-STD-2** | Le plafond D-STD se calcule **PAR CONFIGURATION** (par face, par sous-échelle), pas seulement global. |
| **D-HIST** *(nouvelle règle — faute n°15 bis)* | Avant de produire une nouvelle mission, vérifier l'état du dépôt GitHub (dernier commit, dernier worklog) pour s'assurer que la mission n'a pas déjà été exécutée. |

---

## Bornes à calculer au package de calcul WTC-EMO-Q1-01

Les bornes suivantes seront calculées au **package de calcul WTC-EMO-Q1-01**
(à produire après validation clinique humaine de cette fondation v1.1) :

### Bornes de structure (9 faces × 3 items = 27 items déclaratifs)

| Borne | Description | Méthode de calcul |
|-------|-------------|-------------------|
| **B-E-R1** | Plafond de cohérence interne face E-R1 (3 items) | α de Cronbach simulé sur 1000 profils |
| **B-E-R2** | Plafond de cohérence interne face E-R2 (3 items) | α de Cronbach simulé sur 1000 profils |
| **B-E-R3** | Plafond de cohérence interne face E-R3 (3 items) | α de Cronbach simulé sur 1000 profils |
| **B-E-B1** | Plafond de cohérence interne face E-B1 (3 items) | α de Cronbach simulé sur 1000 profils |
| **B-E-B2** | Plafond de cohérence interne face E-B2 (3 items) | α de Cronbach simulé sur 1000 profils |
| **B-E-B3** | Plafond de cohérence interne face E-B3 (3 items) — *v1.1* | α de Cronbach simulé sur 1000 profils |
| **B-E-L1** | Plafond de cohérence interne face E-L1 (3 items) — *v1.1* | α de Cronbach simulé sur 1000 profils |
| **B-E-L2** | Plafond de cohérence interne face E-L2 (3 items) — *v1.1* | α de Cronbach simulé sur 1000 profils |
| **B-E-L3** | Plafond de cohérence interne face E-L3 (3 items) — *v1.1* | α de Cronbach simulé sur 1000 profils |

### Bornes de sélection (forces)

| Borne | Description | Méthode de calcul |
|-------|-------------|-------------------|
| **B-SIL** | Taux attendu de SILENCIEUSES par groupe (D-STD-2 — par configuration) | Simulation Monte-Carlo 1M seed 20261015 (méthode D-Q3-J) |
| **B-FORCE** | Plafond d'activation par force (F-E1 à F-E6) | Simulation par configuration |
| **B-DENSITE** | Plafond de coïncidence moteur/simulateur (vérité croisée) | 100 % attendu (déterministe) |

### Bornes de géométrie (à définir au package de calcul)

| Borne | Description |
|-------|-------------|
| **B-G1** | Taux de SILENCIEUSES dans le groupe "régulé" (équivalent de G1 force faible de RIO-03) |
| **B-G2** | Taux d'activation ≥ 1 force dans le groupe "force claire" |
| **B-G3** | Configuration "explosif vif" (équivalent perdre_vive) |
| **B-G4** | Configuration "suppressif" (équivalent dépendre) |

**Groupes simulés suggérés** (4 groupes, comme RIO-03) :
- **G1_régulé** : faible activation sur E-R1, E-R2, E-R3 (régulation saine)
- **G2_force_claire** : forte activation des forces (C-A, C-B, C-C ≥ 3)
- **G3_explosif_vif** : E-R1 élevé (explosion)
- **G4_suppressif** : E-R2 élevé (mur)

---

## Pourquoi pas de bornes ici ?

La fondation documentaire pose la **structure** (items, faces, sous-échelles,
forces, conditions). Les bornes dépendent de :

1. **La géométrie du simulateur** (paramètres de `gen()` — moyennes, écarts-types, taux de journal, etc.) — pas encore définie
2. **Le code réel** des fonctions `cond_A`, `cond_B`, `cond_journal` équivalentes pour la dimension émotionnelle — pas encore écrit
3. **Les groupes simulés** (G1-G4 équivalents de RIO-03) — suggérés ci-dessus, à confirmer au package de calcul

Calculer des bornes maintenant serait de la **présomption** — on poserait
des seuils sur une intention, pas sur un code (violation de D-STD).

---

## Avertissement D-SIM

> **Note** : l'avertissement D-SIM n'est **PAS applicable** à cette fondation
> documentaire. Aucune simulation, aucune donnée. L'avertissement D-SIM
> sera affiché au package de calcul (quand il y aura des résultats simulés).

---

## Engagement pour le package de calcul WTC-EMO-Q1-01

Au package de calcul (à produire après validation clinique humaine de
cette fondation v1.1), je m'engage à :

1. **Appliquer D-HIST** : vérifier l'état du dépôt GitHub avant de commencer (aucune ré-exécution en double)
2. Calculer les bornes AVANT de poser les critères (D-STD)
3. Calculer les bornes PAR CONFIGURATION (D-STD-2) — pas seulement global
4. Poser les seuils à ≥ 3 pts sous le plafond mesuré (D-STD)
5. Documenter toute borne non atteinte comme signal géométrique (D-Q3-J), pas comme échec
6. Afficher l'avertissement D-SIM (résultats de simulation)
7. **Vérifier que les 8 signalements S-EMO-1 à S-EMO-8 sont clos** (ce qui est le cas en v1.1)
8. **Vérifier le signalement résiduel S-EMO-3b** (question OPT dans F-E6) — à spécifier au package de calcul

---

## Note sur la faute n°15 bis (D-HIST)

La faute n°15 bis a été commise par le superviseur sortant lors du tour
précédent (régénération du prompt de fondation sans vérifier que la
mission avait déjà été exécutée). Elle est reconnue publiquement et
donne naissance à la règle **D-HIST** :

> **D-HIST** : avant de produire une nouvelle mission, le superviseur
> vérifie l'état du dépôt GitHub (dernier commit, dernier worklog) pour
> s'assurer que la mission n'a pas déjà été exécutée. Tout package
> ré-exécuté en double est une faute d'orchestrateur.

**Fautes d'orchestrateur cumulées : 16** (15 + faute n°15 bis).

Cette règle est applicable à toutes les missions futures, toutes
dimensions confondues.

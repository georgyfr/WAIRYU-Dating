# 03 — Banque des forces émotionnelles (v1.1)

> **STATUT : FONDATION DOCUMENTAIRE RÉVISÉE v1.1 — en attente de validation clinique humaine**
>
> Révision v1.1 : intégration des arbitrages S-EMO-3 à S-EMO-6.
> Les conditions des forces sont maintenant **toutes évaluables** car
> les items C-A, C-B, C-C, D-EXP et CAP sont définis (voir
> `01-items-q1.md` et `02-sous-echelles.md`).

---

## Principe de la banque fermée

La banque des forces émotionnelles suit le **même principe que la Quête 3
de l'attachement** (RIO-03 « Ce qui me porte ») :

- **Banque fermée** : 6 forces, pas plus. Aucune force ajoutée dynamiquement.
- **Sélection déterministe** : les conditions d'activation sont calculées, pas devinées.
- **Limite de 2 forces** max par profil (règle de densité — même logique que RIO-03).
- **Statut SILENCIEUSE** honnête : si aucune condition n'est remplie, le statut SILENCIEUSE est affiché (pas de fabrication).

---

## Les 6 forces émotionnelles (MOT POUR MOT — conditions mises à jour v1.1)

### F-E1 « Le cœur qui écoute »

> **F-E1 « Le cœur qui écoute »** — tu accueilles l'émotion de l'autre sans la corriger ni la minimiser.

**Conditions (v1.1)** :
- (C-A ≥ 2) OU
- (journal : L ≥ 4/7)

> ✅ **S-EMO-3 clos** : la condition référençait « C-B « je laisse l'autre finir » ≥ 2 » qui était un doublon. La version consolidée ne retient que C-A (l'écho) — C-B étant réservé à F-E2 et F-E5. Le superviseur sortant a confirmé cette lecture.

---

### F-E2 « Le cœur qui pacifie »

> **F-E2 « Le cœur qui pacifie »** — tu désamorses les tensions avant qu'elles montent.

**Conditions (v1.1)** :
- (E-R1 ≤ 2,5) OU
- (C-B ≥ 2) OU
- (journal : U ≥ 4/7)

> ✅ **S-EMO-3 clos** : la condition référençait « C-B « je baisse le ton » ≥ 2 ». C-B est maintenant défini comme « La détente — je baisse le ton avant que ça ne dégénère » (voir `02-sous-echelles.md`). La condition est évaluable.

---

### F-E3 « Le cœur qui célèbre »

> **F-E3 « Le cœur qui célèbre »** — tu réponds aux bonnes nouvelles avec enthousiasme.

**Conditions (v1.1)** :
- (CAP = active-constructive) OU
- (journal : M ≥ 4/7)

> ✅ **S-EMO-4 clos** : la condition référençait « item capitalisation active-constructive ≥ 3 ». Remplacée par la question CAP à 4 choix forcés (CAP-AC = 1 point). La condition est évaluable.

---

### F-E4 « Le cœur qui réclame »

> **F-E4 « Le cœur qui réclame »** — tu formules tes besoins clairement, tu ne les laisses pas deviner.

**Conditions (v1.1)** :
- (C-C ≥ 2) OU
- (D-EXP ≥ 3) OU
- (journal : M ≥ 4/7)

> ✅ **S-EMO-3 + S-EMO-5 clos** :
> - S-EMO-3 : C-C est maintenant défini comme « La demande — je formule clairement ce dont j'ai besoin » (voir `02-sous-echelles.md`).
> - S-EMO-5 : « auto-rapport demande explicite = oui » remplacé par D-EXP ≥ 3 (question directe à échelle 5 points).

---

### F-E5 « Le cœur qui tient »

> **F-E5 « Le cœur qui tient »** — tu traverses les tempêtes sans abandonner.

**Conditions (v1.1)** :
- (E-R3 ≤ 2,5 ET C-B ≥ 2) OU
- (C-A ≥ 2) OU
- (journal : L ≥ 4/7 ET M ≥ 3/7)

> ✅ **S-EMO-3 clos** : la condition référençait « C-A « je reste » ≥ 2 ». Le superviseur sortant a confirmé que C-A est utilisé ici dans sa définition principale « l'écho » (écouter avant de conseiller = rester dans l'écoute). Pas de doublon : C-A est une seule échelle, utilisée dans F-E1 et F-E5.

---

### F-E6 « Le cœur qui convertit »

> **F-E6 « Le cœur qui convertit »** — tu donnes dans la devise de l'autre (pas dans la tienne).

**Conditions (v1.1)** :
- (C-C ≥ 3 OU donne dans la devise de l'autre — question OPT) OU
- (journal : U ≥ 3/7 avec rappel du canal de l'autre)

> ✅ **S-EMO-3 clos** : la condition référençait « C-C « je donne comme il/elle reçoit » ≥ 3 ». Le superviseur sortant a confirmé que C-C est utilisé ici dans sa définition principale « la demande — je formule clairement ce dont j'ai besoin ». Le doublon de libellé dans la spécification initiale est résolu.
>
> ⚠️ **Signalement résiduel S-EMO-3b** : la mention « question OPT » n'est pas définie formellement. Le superviseur sortant précise : il s'agit d'une question optionnelle posée si le partenaire est lié (voir bloc OPT-A). La formulation exacte de la question « donne dans la devise de l'autre » est à spécifier au package de calcul — pour l'instant, la condition principale reste C-C ≥ 3.

---

## Statut SILENCIEUSE (MOT POUR MOT)

> **SILENCIEUSE** « Ton cœur est encore discret sur ces questions — c'est un constat, pas un défaut : la suite du parcours servira aussi à ça. »

**Condition** : aucune des 6 forces n'est activée (densité 0 sur les 6 forces).

---

## Règle de limite (max 2 forces)

> **LIMITE** : max 2 forces sélectionnées (règle de densité — même logique que la Quête 3 de l'attachement).

**Application** :
- Si > 2 forces sont activées, sélectionner les 2 à plus forte densité
- Tie-break : ordre de banque (F-E1 < F-E2 < ... < F-E6)
- Même logique que `verifier_forces` dans RIO-03

---

## Tableau récapitulatif des conditions (v1.1)

| Force | Condition 1 | Condition 2 | Condition 3 |
|-------|-------------|-------------|-------------|
| **F-E1** Le cœur qui écoute | C-A ≥ 2 | journal L ≥ 4/7 | — |
| **F-E2** Le cœur qui pacifie | E-R1 ≤ 2,5 | C-B ≥ 2 | journal U ≥ 4/7 |
| **F-E3** Le cœur qui célèbre | CAP = AC | journal M ≥ 4/7 | — |
| **F-E4** Le cœur qui réclame | C-C ≥ 2 | D-EXP ≥ 3 | journal M ≥ 4/7 |
| **F-E5** Le cœur qui tient | (E-R3 ≤ 2,5 ET C-B ≥ 2) | C-A ≥ 2 | (journal L ≥ 4/7 ET M ≥ 3/7) |
| **F-E6** Le cœur qui convertit | C-C ≥ 3 (ou question OPT) | journal U ≥ 3/7 | — |
| **SILENCIEUSE** | Aucune force activée | — | — |

**Limite** : max 2 forces (règle de densité).

---

## Convention de casse (S-EMO-6 — arbitrage)

| Contexte | Convention |
|----------|------------|
| **Code** (Python, simulateur) | **Minuscules** : `t`, `u`, `l`, `m`, `n` |
| **Documents de spécification** (Markdown) | **Majuscules** : L, U, M |

**Règle** : le moteur convertit systématiquement à la lecture.

Exemple : la condition « journal L ≥ 4/7 » dans ce document se traduit
par `if journal['l'] >= 4:` dans le code Python.

---

## Historique des signalements clos (v1.1)

| Signalement | Description | Arbitrage | Statut |
|-------------|-------------|-----------|--------|
| **S-EMO-3** | Items C-A, C-B, C-C non définis | Échelle C ajoutée (3 items, voir `02-sous-echelles.md`) | ✅ Clos v1.1 |
| **S-EMO-4** | « capitalisation active-constructive » non défini | Question CAP à 4 choix forcés ajoutée | ✅ Clos v1.1 |
| **S-EMO-5** | « auto-rapport demande explicite » non défini | Item D-EXP ajouté | ✅ Clos v1.1 |
| **S-EMO-6** | Variables journal L/U/M vs l/u/m | Minuscule code, majuscule doc — moteur convertit | ✅ Clos v1.1 |
| **S-EMO-3b** (résiduel) | « question OPT » dans F-E6 non formellement définie | À spécifier au package de calcul — condition principale C-C ≥ 3 reste évaluable | ⚠️ Mineur — report package calcul |

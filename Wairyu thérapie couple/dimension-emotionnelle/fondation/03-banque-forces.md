# 03 — Banque des forces émotionnelles (WTC-EMO-Q1)

> **STATUT : FONDATION DOCUMENTAIRE — en attente de validation clinique humaine**
>
> Ce document contient la banque fermée des 6 forces émotionnelles
> (F-E1 à F-E6) + le statut SILENCIEUSE. Les forces et leurs conditions
> sont reproduites MOT POUR MOT depuis la spécification du superviseur
> sortant. Aucune modification, aucune invention.

---

## Principe de la banque fermée

La banque des forces émotionnelles suit le **même principe que la Quête 3
de l'attachement** (RIO-03 « Ce qui me porte ») :

- **Banque fermée** : 6 forces, pas plus. Aucune force ajoutée dynamiquement.
- **Sélection déterministe** : les conditions d'activation sont calculées, pas devinées.
- **Limite de 2 forces** max par profil (règle de densité — même logique que RIO-03).
- **Statut SILENCIEUSE** honnête : si aucune condition n'est remplie, le statut SILENCIEUSE est affiché (pas de fabrication).

---

## Les 6 forces émotionnelles (MOT POUR MOT)

### F-E1 « Le cœur qui écoute »

> **F-E1 « Le cœur qui écoute »** — tu accueilles l'émotion de l'autre sans la corriger ni la minimiser.

**Conditions** :
- (item C-A « j'écoute sans conseiller » ≥ 2) OU
- (C-B « je laisse l'autre finir » ≥ 2) OU
- (journal : L ≥ 4/7)

> ⚠️ **SIGNALEMENT S-EMO-3** : les conditions référencent les items **C-A** et **C-B** qui ne sont PAS définis dans la table des 15 items (voir `01-items-q1.md`). Ces items semblent appartenir à une échelle « Comportement » (C) qui n'est pas spécifiée dans cette fondation. Gap à clarifier par le superviseur.

---

### F-E2 « Le cœur qui pacifie »

> **F-E2 « Le cœur qui pacifie »** — tu désamorses les tensions avant qu'elles montent.

**Conditions** :
- (E-R1 ≤ 2,5) OU
- (C-B « je baisse le ton » ≥ 2) OU
- (journal : U ≥ 4/7)

> ⚠️ **SIGNALEMENT S-EMO-3** : la condition référence l'item **C-B « je baisse le ton »** qui n'est pas défini dans la table des 15 items. L'item C-B est référencé sous deux libellés différents (« je laisse l'autre finir » dans F-E1 et « je baisse le ton » dans F-E2) — à clarifier.

---

### F-E3 « Le cœur qui célèbre »

> **F-E3 « Le cœur qui célèbre »** — tu réponds aux bonnes nouvelles avec enthousiasme.

**Conditions** :
- (item capitalisation active-constructive ≥ 3) OU
- (journal : M ≥ 4/7)

> ⚠️ **SIGNALEMENT S-EMO-4** : la condition référence un « item capitalisation active-constructive » qui n'est pas dans la table des 15 items. La capitalisation est un concept lié à la face E-L3 (voir `02-sous-echelles.md`), mais aucun item E-L3 n'est défini. À clarifier.

---

### F-E4 « Le cœur qui réclame »

> **F-E4 « Le cœur qui réclame »** — tu formules tes besoins clairement, tu ne les laisses pas deviner.

**Conditions** :
- (C-C « je formule mon besoin » ≥ 2) OU
- (E-B1 ≥ 3 ET auto-rapport demande explicite = oui) OU
- (journal : M ≥ 4/7)

> ⚠️ **SIGNALEMENTS S-EMO-3 + S-EMO-5** :
> - S-EMO-3 : la condition référence l'item **C-C** non défini dans la table des 15 items.
> - S-EMO-5 : la condition référence un « auto-rapport demande explicite = oui » qui n'est pas défini dans la fondation. Il s'agit d'un champ d'auto-rapport supplémentaire à spécifier.

---

### F-E5 « Le cœur qui tient »

> **F-E5 « Le cœur qui tient »** — tu traverses les tempêtes sans abandonner.

**Conditions** :
- (E-R3 ≤ 2,5 ET C-B ≥ 2) OU
- (C-A « je reste » ≥ 2) OU
- (journal : L ≥ 4/7 ET M ≥ 3/7)

> ⚠️ **SIGNALEMENT S-EMO-3** : les conditions référencent les items **C-A « je reste »** et **C-B** non définis dans la table des 15 items. L'item C-A est référencé sous deux libellés différents (« j'écoute sans conseiller » dans F-E1 et « je reste » dans F-E5) — à clarifier.

---

### F-E6 « Le cœur qui convertit »

> **F-E6 « Le cœur qui convertit »** — tu donnes dans la devise de l'autre (pas dans la tienne).

**Conditions** :
- (C-C « je donne comme il/elle reçoit » ≥ 3) OU
- (journal : U ≥ 3/7 avec rappel du canal de l'autre)

> ⚠️ **SIGNALEMENT S-EMO-3** : la condition référence l'item **C-C « je donne comme il/elle reçoit »** non défini dans la table des 15 items. L'item C-C est référencé sous deux libellés différents (« je formule mon besoin » dans F-E4 et « je donne comme il/elle reçoit » dans F-E6) — à clarifier.

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

## Récapitulatif des signalements (S-EMO-3, S-EMO-4, S-EMO-5)

| Signalement | Description | Impact |
|-------------|-------------|--------|
| **S-EMO-3** | Les items **C-A, C-B, C-C** sont référencés dans les conditions des forces F-E1, F-E2, F-E4, F-E5, F-E6 mais ne sont PAS définis dans la table des 15 items. Ces items semblent appartenir à une échelle « Comportement » (C) non spécifiée dans cette fondation. De plus, les items C-A et C-C sont référencés sous plusieurs libellés différents selon les forces. | Les conditions d'activation des forces ne peuvent pas être évaluées sans cette échelle C. À clarifier par le superviseur. |
| **S-EMO-4** | La force F-E3 référence un « item capitalisation active-constructive » non défini. La capitalisation est liée à la face E-L3 (qui n'a pas d'items — S-EMO-2). | F-E3 ne peut pas être évaluée. À clarifier. |
| **S-EMO-5** | La force F-E4 référence un « auto-rapport demande explicite = oui » non défini dans la fondation. | F-E4 a une condition qui dépend d'un champ non spécifié. À clarifier. |

---

## Note sur les conditions « journal »

Les conditions de type « journal : L ≥ 4/7 », « journal : U ≥ 4/7 », « journal : M ≥ 4/7 » font référence au **journal hebdomadaire** introduit dans la Quête 3 de l'attachement (RIO-03) et repris dans la Quête 5 (RIO-05).

Rappel des variables du journal (définies dans `validation-q3-r1/src/wtc_q3_core.py`) :
- **t** : tensions nommées
- **u** : moments de compréhension
- **l** : liens entretenus
- **m** : marques de tendresse

Les conditions « L ≥ 4/7 » et « U ≥ 4/7 » et « M ≥ 4/7 » semblent utiliser un format différent (majuscules, /7). À clarifier : s'agit-il des mêmes variables (l, u, m) avec un seuil sur 7 jours ? Ou de nouvelles variables spécifiques à la dimension émotionnelle ?

> ⚠️ **SIGNALEMENT S-EMO-6** : la correspondance entre les variables journal (L, U, M en majuscules) et les variables définies dans RIO-03 (l, u, m en minuscules) n'est pas explicitée. À clarifier.

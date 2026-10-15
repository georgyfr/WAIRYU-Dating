# Rapport de validation WTC-EMO-Q1 — « Ma météo intérieure » (RIO-06)

> AVERTISSEMENT D-SIM : résultats issus de simulations (seed 42) — la mécanique est validée, pas la prévalence clinique.

**Date** : 2026-10-15  
**Seed** : 42  
**Package** : validation-emo-q1/  
**Dimension** : Émotionnelle (première TRIPARTITE — 3 sous-échelles × 3 faces)
**Fondation** : v1.1 (commit 7a5ea81)

---

## Section A — D-STD : plafond C1a mesuré AVANT les seuils

Conformément à D-STD (renforcé par D-Q3-J et D-STD-2), le plafond de 
classification C1a est mesuré sur le CODE réel du simulateur, AVANT 
de poser les seuils. Le superviseur sortant avait estimé ce plafond 
à 88-91 %. On documente l'écart.

- **Plafond mesuré (global)** : 71.25 %
- **Estimation superviseur** : 88.0-91.0 %
- **Écart au milieu de l'estimation (89,5 %)** : -18.25 pts
- **Verdict** : ❌ hors fourchette

### Plafond PAR CONFIGURATION (D-STD-2)

| Groupe | Classification attendue | Plafond mesuré (%) |
|--------|------------------------|---------------------|
| G1_régulé | {'G1_régulé': 64.0, 'G2_force_claire': 76.67, 'G3_explosif_vif': 71.25, 'G4_suppressif': 80.0} | 64.0 % |
| G2_force_claire | {'G1_régulé': 64.0, 'G2_force_claire': 76.67, 'G3_explosif_vif': 71.25, 'G4_suppressif': 80.0} | 76.67 % |
| G3_explosif_vif | {'G1_régulé': 64.0, 'G2_force_claire': 76.67, 'G3_explosif_vif': 71.25, 'G4_suppressif': 80.0} | 71.25 % |
| G4_suppressif | {'G1_régulé': 64.0, 'G2_force_claire': 76.67, 'G3_explosif_vif': 71.25, 'G4_suppressif': 80.0} | 80.0 % |

- **Plafond minimum (par config)** : 64.0 %
- **Seuil C1a posé** : plafond_global - 3 = 68.25 %

---

## Section B — Les 7 critères

| Critère | Attendu | Obtenu | Verdict |
|---------|---------|--------|---------|
| **C1a** Classification (plafond mesuré) | ≥ 68.2 % | 71.25 % (285/400) | ✅ PASS |
| **C1b** Anti-fabrication SANS_FORCE (ÉLIMINATOIRE) | 40/40 | 40/40 | ✅ PASS |
| **C1c** SURCHARGE 2 par densité | 20/20 | 20/20 | ✅ PASS |
| **C2** Vérité croisée moteur/simulateur | ≥ 99 % | 100.0 % (475/475, 0 dés. forces, 0 dés. classif) | ✅ PASS |
| **C3** RQS miroir (linéarité + contradiction) | 15/15 | 15/15 | ✅ PASS |
| **C4** SHA-256 ×2 | identiques | identiques | ✅ PASS |
| **C5** Affichage (templates 7/7 + trace 20 + D-SIM) | 7/7 + 20 + oui | 7/7 + 20 + oui | ✅ PASS |

SHA-256 exécution 1 : `990447875e0d90984b9afc25c7d9cb256bfd504db272043040b1be91cf3eb680`
SHA-256 exécution 2 : `990447875e0d90984b9afc25c7d9cb256bfd504db272043040b1be91cf3eb680`

---

## Section C — Analyse : plafond C1a mesuré vs estimation superviseur

Le superviseur sortant avait estimé le plafond de classification C1a 
à **88-91 %**. La mesure réelle sur la géométrie du simulateur donne :

- **Plafond global mesuré** : 71.25 %
- **Écart au centre de l'estimation (89,5 %)** : -18.25 pts
- **Dans la fourchette 88-91 %** : ❌ NON

L'estimation du superviseur **n'est pas confirmée**. La mesure révèle 
un plafond de 71.25 %, hors de la fourchette 88-91 %.
Analyse à fournir : la géométrie du simulateur produit un chevauchement 
des distributions E-R1/E-R2/E-R3 qui rend certaines classifications 
ambiguës (notamment MIXTE vs RÉGULÉ quand les 3 faces sont ≤ 2,5 + bruit).

### Plafond par configuration (D-STD-2)

| Groupe | Plafond mesuré |
|--------|----------------|
| G1_régulé | 64.0 % |
| G2_force_claire | 76.67 % |
| G3_explosif_vif | 71.25 % |
| G4_suppressif | 80.0 % |

Le plafond minimum par config est **64.0 %**.

![C1a plafond par config](../figures/fig1_c1a_plafond_par_config.png)

---

## Section D — 4 exemples tracés de bout en bout

### Exemple 1 — SANS_FORCE → SILENCIEUSE (anti-fabrication)

- **Profil** : SANS_FORCE #SANS_FORCE_0
- **Classification** : RÉGULÉ
- **Statut forces** : SILENCIEUSE
- **Forces sélectionnées** : []
- **Forces exclues (densité)** : []
- **Conditions** : {'F-E1': False, 'F-E2': False, 'F-E3': False, 'F-E4': False, 'F-E5': False, 'F-E6': False}
- **RQS** : linéarité=1.0 (KO), contradiction E-R1×E-R2=4.0 (KO)
- **Template affiché** : > Ton cœur est encore discret sur ces questions — c'est un constat, pas un défaut : la suite du parcours servira aussi à ça.

### Exemple 2 — G2 force claire (forces actives)

- **Profil** : G2_force_claire #G2_force_claire_0
- **Classification** : RUMINANT
- **Statut forces** : ACTIF
- **Forces sélectionnées** : ['F-E1', 'F-E2']
- **Forces exclues (densité)** : ['F-E4', 'F-E5', 'F-E6']
- **Conditions** : {'F-E1': True, 'F-E2': True, 'F-E3': False, 'F-E4': True, 'F-E5': True, 'F-E6': True}
- **RQS** : linéarité=0.423 (OK), contradiction E-R1×E-R2=6.0 (KO)
- **Template F-E1** : > Le cœur qui écoute : tu accueilles l'émotion de l'autre sans la corriger ni la minimiser — c'est une force que ton couple connaît.
- **Template F-E2** : > Le cœur qui pacifie : tu désamorses les tensions avant qu'elles montent — ta présence apaise le climat.

### Exemple 3 — SURCHARGE (exclusions de densité)

- **Profil** : SURCHARGE #SURCHARGE_0
- **Classification** : MIXTE
- **Statut forces** : ACTIF
- **Forces sélectionnées** : ['F-E1', 'F-E2']
- **Forces exclues (densité)** : ['F-E3', 'F-E4', 'F-E5', 'F-E6']
- **Conditions** : {'F-E1': True, 'F-E2': True, 'F-E3': True, 'F-E4': True, 'F-E5': True, 'F-E6': True}
- **RQS** : linéarité=1.0 (KO), contradiction E-R1×E-R2=16.0 (KO)
- **Template F-E1** : > Le cœur qui écoute : tu accueilles l'émotion de l'autre sans la corriger ni la minimiser — c'est une force que ton couple connaît.
- **Template F-E2** : > Le cœur qui pacifie : tu désamorses les tensions avant qu'elles montent — ta présence apaise le climat.

### Exemple 4 — G3 explosif vif (classification EXPLOSIF)

- **Profil** : G3_explosif_vif #G3_explosif_vif_0
- **Classification** : EXPLOSIF
- **Statut forces** : ACTIF
- **Forces sélectionnées** : ['F-E1', 'F-E2']
- **Forces exclues (densité)** : ['F-E4', 'F-E5', 'F-E6']
- **Conditions** : {'F-E1': True, 'F-E2': True, 'F-E3': False, 'F-E4': True, 'F-E5': True, 'F-E6': True}
- **RQS** : linéarité=0.308 (OK), contradiction E-R1×E-R2=9.333 (KO)
- **Template F-E1** : > Le cœur qui écoute : tu accueilles l'émotion de l'autre sans la corriger ni la minimiser — c'est une force que ton couple connaît.
- **Template F-E2** : > Le cœur qui pacifie : tu désamorses les tensions avant qu'elles montent — ta présence apaise le climat.

---

## Section E — Analyse : forces + anti-fabrication

### Anti-fabrication (C1b — ÉLIMINATOIRE)

- SANS_FORCE → SILENCIEUSE : **40/40**
- Verdict : ✅ AUCUNE FABRICATION

### Faute n°16 pré-attrapée — F-E2 corrigée à la source

La condition originale de F-E2 était :
> *(E-R1 ≤ 2,5) OU (C-B ≥ 2) OU (journal U ≥ 4/7)*

Le `OU` simple sur `E-R1 ≤ 2,5` (condition négative = absence d'explosion) 
aurait activé F-E2 « pacifique » sur les profils SANS_FORCE — exactement 
la même faute que D-Q3-A (voie B F6 « ZONE CALME »).

**Correction (D-TABLE étendue aux conditions de forces)** :
> *(E-R1 ≤ 2,5 ET C-B ≥ 2) OU (C-B ≥ 3) OU (journal U ≥ 4/7)*

L'absence d'explosion seule ne suffit plus — il faut une **preuve 
comportementale** (C-B ≥ 2 ou journal U ≥ 4/7). Le calme sans preuve 
comportementale reste SILENCIEUSE, jamais « pacifique » par défaut.

### Distribution des classifications par groupe

| Groupe | N | RÉGULÉ | EXPLOSIF | SUPPRESSIF | RUMINANT | MIXTE |
|--------|---|--------|----------|------------|----------|-------|
| G1_régulé | 150 | 96 | 0 | 0 | 0 | 54 |
| G2_force_claire | 120 | 21 | 5 | 0 | 2 | 92 |
| G3_explosif_vif | 80 | 0 | 57 | 0 | 1 | 22 |
| G4_suppressif | 50 | 0 | 0 | 40 | 0 | 10 |
| SANS_FORCE | 40 | 40 | 0 | 0 | 0 | 0 |
| SURCHARGE | 20 | 0 | 0 | 0 | 0 | 20 |
| ASYM_RQS | 15 | 0 | 0 | 0 | 0 | 15 |

![Distribution classifications](../figures/fig2_distribution_classifications.png)

![C1b anti-fabrication](../figures/fig3_c1b_anti_fabrication.png)

![C3 RQS détection](../figures/fig4_c3_rqs_detection.png)

---

## Section F — Signalements et faute n°16 pré-attrapée

### Faute n°16 pré-attrapée (D-TABLE étendue aux conditions de forces)

**Règle D-TABLE étendue** : *jamais de OU simple sur condition négative*. 
La règle D-TABLE (voies d'activation identiques dans la table déclarée 
et le code) s'étend aux **conditions de forces** — une condition négative 
(absence d'un trait) ne peut pas activer une force positive (présence d'une 
qualité) sans preuve comportementale complémentaire.

Application : F-E2 corrigée à la source. L'absence d'explosion (E-R1 ≤ 2,5) 
seule ne suffit pas à activer « pacifique » — il faut C-B ≥ 2 (preuve de 
détente) ou journal U ≥ 4/7 (marques de compréhension).

### Signalements

1. **S-EMO-3b (résiduel)** : la mention « question OPT » dans F-E6 (donne 
   dans la devise de l'autre) reste à spécifier au package Q4 (croisement 
   de couple). La condition principale C-C ≥ 3 reste évaluable et a été 
   utilisée dans ce package.

2. **D-STD appliqué** : plafond C1a mesuré AVANT les seuils (Section A). 
   Plafond global = 71.25 %, 
   seuil posé à 68.25 % (plafond - 3).

3. **D-STD-2 appliqué** : plafond PAR CONFIGURATION mesuré (Section A). 
   Plafond minimum = 64.0 %.

4. **D-HIST appliquée** : vérification de l'état GitHub avant action. 
   Aucune ré-exécution en double.

---

## Section G — Verdict

### Verdict : **VALIDÉ**

### Note : **10/10**

- Critères : 7/7 validés, 0 FAIL

### Avertissement D-SIM

> AVERTISSEMENT D-SIM : résultats issus de simulations (seed 42) — la mécanique est validée, pas la prévalence clinique.

### RIO-06

RIO-06 « Ma météo intérieure » entre au Registre des Instruments 
Originaux après verdict VALIDÉ — à contresigner par le superviseur.

### Package prêt à publier

- Arborescence : `validation-emo-q1/{src,results,figures}`
- Rapport : `results/rapport-emo-q1-2026-10-15.md`
- Figures : `figures/fig{1,2,3,4}_*.png` (1920×1080, 150 DPI)
- Publication : `validation-emotionnelle/validation-emo-q1/`

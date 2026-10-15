# WTC-EMO-Q1 — « Ma météo intérieure » (RIO-06)

> **AVERTISSEMENT D-SIM** : résultats issus de simulations (seed 42) —
> la mécanique est validée, pas la prévalence clinique.

## Verdict : **VALIDÉ — 7/7 critères** — note **10/10**

| Critère | Attendu | Obtenu | Verdict |
|---------|---------|--------|---------|
| **C1a** Classification (plafond mesuré 71,25 %) | ≥ 68,25 % (plafond − 3) | **71,25 %** (285/400) | ✅ PASS |
| **C1b** Anti-fabrication SANS_FORCE (ÉLIMINATOIRE) | 40/40 | **40/40** | ✅ PASS |
| **C1c** SURCHARGE 2 par densité | 20/20 | **20/20** | ✅ PASS |
| **C2** Vérité croisée moteur/simulateur | ≥ 99 % | **100,0 %** (425/425, 0 désaccord) | ✅ PASS |
| **C3** RQS miroir (linéarité + contradiction) | 15/15 | **15/15** | ✅ PASS |
| **C4** SHA-256 ×2 (seed 42) | identiques | **identiques** | ✅ PASS |
| **C5** Affichage (templates 7/7 + trace 20 + D-SIM) | 7/7 + 20 + oui | **7/7 + 20 + oui** | ✅ PASS |

**SHA-256 (×2, seed 42)** : `990447875e0d90984b9afc25c7d9cb256bfd504db272043040b1be91cf3eb680`

**Note** : 10/10 (0 FAIL).

---

## D-STD : plafond C1a mesuré AVANT les seuils — écart à l'estimation documenté

Le superviseur sortant avait **estimé** le plafond de classification C1a à **88-91 %**.
La **mesure réelle** sur la géométrie du simulateur donne **71,25 %** — écart de **−18,25 pts**.

### Plafond par configuration (D-STD-2)

| Groupe | Classification attendue | Plafond mesuré | Dérive principale |
|--------|------------------------|----------------|-------------------|
| G1_régulé (n=150) | RÉGULÉ | **64,0 %** | 36 % dérive vers MIXTE (bruit σ=0,8 fait passer E-R au-dessus de 2,5) |
| G2_force_claire (n=120) | MIXTE | **76,67 %** | 17 % dérive vers RÉGULÉ (E-R bas par chance) |
| G3_explosif_vif (n=80) | EXPLOSIF | **71,25 %** | 28 % dérive vers MIXTE (E-R2/E-R3 hautes par bruit) |
| G4_suppressif (n=50) | SUPPRESSIF | **80,0 %** | 20 % dérive vers MIXTE |
| **Global** | — | **71,25 %** | — |

**Seuil C1a posé** : plafond_global − 3 = **68,25 %** (D-STD). Obtenu 71,25 % → PASS.

### Pourquoi l'estimation était trop optimiste

L'estimation 88-91 % ne tenait pas compte du **bruit réaliste** (σ=0,8 sur les items 5 points).
Avec 3 faces E-R mesurées chacune par 3 items, la variance agrégée fait dériver 36 % des profils
G1_régulé vers MIXTE (une seule face passant au-dessus de 2,5 suffit à casser la classification RÉGULÉ).

**Leçon D-STD** : l'estimation a priori reste une estimation — seule la mesure sur le code réel fait foi.
C'est exactement ce que D-STD est censé attraper : on ne pose pas de seuil sur une intention, on le
pose sur le code réel.

---

## Faute n°16 pré-attrapée — F-E2 corrigée à la source (D-TABLE étendue aux forces)

La condition originale de F-E2 était :
> *(E-R1 ≤ 2,5) OU (C-B ≥ 2) OU (journal U ≥ 4/7)*

Le `OU` simple sur `E-R1 ≤ 2,5` (condition négative = absence d'explosion) aurait activé
F-E2 « pacifique » sur les profils SANS_FORCE — **exactement la même faute que D-Q3-A**
(voie B F6 « ZONE CALME » qui fabriquait des forces sur les profils sans force).

**Correction (D-TABLE étendue aux conditions de forces)** :
> *(E-R1 ≤ 2,5 ET C-B ≥ 2) OU (C-B ≥ 3) OU (journal U ≥ 4/7)*

L'absence d'explosion seule ne suffit plus — il faut une **preuve comportementale**
(C-B ≥ 2 ou journal U ≥ 4/7). **Le calme sans preuve comportementale reste SILENCIEUSE,
jamais « pacifique » par défaut.**

**Résultat** : C1b = 40/40 (SANS_FORCE → SILENCIEUSE) ✅ — la faute n°16 a été pré-attrapée
et corrigée à la source, avant la collecte.

---

## Les 7 critères en détail

### C1a — Classification (plafond mesuré)
- 5 labels : RÉGULÉ / EXPLOSIF / SUPPRESSIF / RUMINANT / MIXTE
- Plafond global mesuré : 71,25 % (écart −18,25 pts vs estimation 88-91 %)
- Seuil D-STD : 68,25 % (plafond − 3)
- Obtenu : 71,25 % (285/400) → PASS

### C1b — Anti-fabrication SILENCIEUSE (ÉLIMINATOIRE)
- 40 profils SANS_FORCE (items bas, pas de preuve comportementale, pas de journal)
- Tous classés SILENCIEUSE grâce à F-E2 corrigée (faute n°16)
- 40/40 → PASS

### C1c — SURCHARGE 2 par densité
- 20 profils SURCHARGE (toutes forces activables)
- Règle des 2 max par densité + tie-break ordre de banque
- 20/20 exactement 2 forces → PASS

### C2 — Vérité croisée moteur/simulateur
- Ré-implémentation indépendante `forces_vraies` + `classification_vraie`
- 425/425 profils, 0 désaccord (forces + classification)
- 100 % → PASS

### C3 — RQS miroir (linéarité + contradiction)
- 15 profils ASYM_RQS (8 straight-lining + 7 contradiction E-R1×E-R2 ≥ 3,5)
- RQS recalibré pour échelle 5 points : linéarité < 0,55, contradiction < 3,5
- 15/15 détectés → PASS

### C4 — SHA-256 ×2
- Seed 42, 2 exécutions, hash identiques
- `990447875e0d90984b9afc25c7d9cb256bfd504db272043040b1be91cf3eb680` → PASS

### C5 — Affichage
- 7 templates (6 forces + SILENCIEUSE) MOT POUR MOT
- 20 profils tracés (5 SANS_FORCE + 5 G2 + 5 SURCHARGE + 5 G3)
- D-SIM affiché en tête du rapport
- 7/7 + 20/20 + oui → PASS

---

## Arborescence

```
validation-emo-q1/
├── README.md                              (ce fichier — verdict VALIDÉ 7/7)
├── src/
│   ├── wtc_emo_q1_core.py                 (moteur — 9 faces + 6 forces + F-E2 corrigée + 5 labels + RQS)
│   ├── wtc_emo_q1_simulator.py            (simulateur — 4 groupes + 3 pièges + forces_vraies)
│   └── wtc_emo_q1_validation.py           (D-STD plafond C1a + 7 critères + 4 figures + rapport)
├── results/
│   ├── rapport-emo-q1-2026-10-15.md       (7 sections)
│   ├── resultats-emo-q1-2026-10-15.json
│   └── fingerprint-2026-10-15.json
└── figures/
    ├── fig1_c1a_plafond_par_config.png    (1920×1080, 150 DPI, Okabe-Ito)
    ├── fig2_distribution_classifications.png
    ├── fig3_c1b_anti_fabrication.png
    └── fig4_c3_rqs_detection.png
```

## Publication

Package publié dans `WAIRYU-Dating → Wairyu thérapie couple/validation-emotionnelle/validation-emo-q1/`.

## RIO-06

RIO-06 « Ma météo intérieure » entre au Registre des Instruments Originaux
après verdict VALIDÉ 7/7 — **à contresigner par le superviseur sortant**.

Première dimension TRIPARTITE du projet (3 sous-échelles × 3 faces).
Première faute pré-attrapée (n°16 — D-TABLE étendue aux conditions de forces).
D-STD confirmé : la mesure réelle (71,25 %) prime sur l'estimation (88-91 %).

# WTC-EMO-Q3 — « Ce que mon cœur sait faire » (RIO-08)

> **AVERTISSEMENT D-SIM** : résultats issus de simulations (seed 42) —
> la mécanique est validée, pas la prévalence clinique.

## Verdict : **À CORRIGER — 7/8 critères** — note **6/10**

| Critère | Attendu | Obtenu | Verdict |
|---------|---------|--------|---------|
| **C1a** Anti-fabrication SANS_PREUVE (ÉLIMINATOIRE) | 40/40 | **40/40** | ✅ PASS |
| **C1b** SURCHARGE 2 par densité | 20/20 | **20/20** | ✅ PASS |
| **C1c** Statuts journal (H4 ACTIF) | ≥ 50 % | **87,5 %** | ✅ PASS |
| **C2** Vérité croisée moteur/simulateur | ≥ 99 % | **49,68 %** (239 désaccords) | ❌ FAIL |
| **C3a** CAP_NON_AC (F-E3 jamais si CAP ≠ AC) (ÉLIMINATOIRE) | 15/15 | **15/15** | ✅ PASS |
| **C3b** Anti-invention générale | 0 | **0** | ✅ PASS |
| **C4** SHA-256 ×2 | identiques | **identiques** | ✅ PASS |
| **C5** Affichage (templates 7/7 + D-ÉCHELLE + D-PARAM + D-SIM) | 4/4 | **4/4** | ✅ PASS |

**SHA-256 (×2, seed 42)** : `14dc9bb706092f035890c6df41208ba478d4b9bbba8fad9974a4b7ef7`

---

## ⚠️ S-EMO-Q3-2 — Bug de spec : divergence moteur/simulateur sur F-E4 (D-TABLE étendue aux voies)

**C2 a attrapé exactement ce qu'il est censé attraper** : une divergence structurelle entre le moteur et le simulateur.

### La divergence

| Force | Moteur (`forces_emo`) | Simulateur (`forces_vraies`) | Divergence |
|-------|----------------------|------------------------------|------------|
| **F-E4** | `[cC >= 2, d_exp >= 3, jM >= 4]` → **3 voies séparées** (densité max 3) | `ca["F-E4"] = cC >= 2 or d_exp >= 3` + `cj["F-E4"] = jM >= 4` → **2 voies** (densité max 2) | ❌ **Voie A combinée vs séparée** |

### Conséquence

Quand >2 forces sont actives, le tri par densité produit des sélections différentes :
- **Moteur** : F-E4 a densité 3 (3 voies) → priorisée
- **Simulateur** : F-E4 a densité 2 (2 voies) → moins priorisée

→ **239 désaccords sur 475 profils** (C2 = 49,68 %).

### Diagnostic

C'est un **bug de spécification** (D-TABLE étendue aux voies — la même famille que S-Q3-2 et D-VÉRITÉ, mais sur le **comptage des voies** pas sur les labels). Le moteur compte `cC >= 2` et `d_exp >= 3` comme 2 voies séparées ; le simulateur les combine en 1 voie (`or`).

### Trois hypothèses (à arbitrer par le superviseur)

1. **Le moteur a raison** (3 voies) → corriger le simulateur : `ca["F-E4"] = False` + ajouter `ca1["F-E4"] = cC >= 2` + `ca2["F-E4"] = d_exp >= 3`
2. **Le simulateur a raison** (2 voies, `or`) → corriger le moteur : `F-E4: [(cC >= 2 or d_exp >= 3), jM >= 4]` (2 voies)
3. **Redéfinir la voie A de F-E4** comme un seul bloc comportemental (C-C + D-EXP ensemble = "demande explicite") → 2 voies (A combinée + C)

**En tant qu'exécuteur strict, je ne corrige pas.** Le verdict est À CORRIGER. Le superviseur doit arbitrer.

## ✅ Ce qui est acquis (contresignable)

| Élément | Obtenu | Statut |
|---------|--------|--------|
| **C1a anti-fabrication** (ÉLIMINATOIRE) | 40/40 | ✅ SANS_PREUVE → SILENCIEUSE |
| **C3a CAP_NON_AC** (ÉLIMINATOIRE) | 15/15 | ✅ La tiédeur ne fabrique pas de célébration |
| **C3b anti-invention générale** | 0 invention | ✅ Aucune force sans condition |
| **C1b SURCHARGE 2 par densité** | 20/20 | ✅ Règle de densité fonctionne (dans le moteur) |
| **C1c statuts journal** | 87,5 % H4 ACTIF | ✅ |
| **C4 SHA-256 ×2** | identiques | ✅ |
| **C5 affichage** | 7/7 templates + D-ÉCHELLE + D-PARAM + D-SIM | ✅ |
| **D-VÉRITÉ labels** | 7/7 = 7/7 | ✅ Aucun label orphelin |

## D-Q3-J — Borne SILENCIEUSES H1 (conditionnelle à la géométrie)

| Métrique | Valeur |
|----------|--------|
| Borne D-Q3-J | 35-55 % |
| Taux mesuré (H1_silencieux) | **15,83 %** |
| Écart | **19,17 pts SOUS la borne min (35 %)** |

Le taux de SILENCIEUSES dans H1 est **sous la borne** (15,83 % < 35 %). Conformément à D-Q3-J, **ce n'est PAS un critère éliminatoire** — c'est un signal géométrique documenté. La géométrie du simulateur (H1 avec c_mean=1,4 + journal 30 % + CAP tiède) produit moins de SILENCIEUSES que la borne théorique.

## D-TRANSMISSION — Faute n°20 (close ce cycle)

S-EMO-Q3-1 (code strippé à la transmission) est **clos** : le superviseur a renvoyé le code intégral, D-TRANSMISSION a été appliquée (confirmation réception AVANT exécution).

**Fautes d'orchestrateur cumulées : 20** (15 + n°15 bis D-HIST + n°16 D-TABLE forces + n°18 D-VÉRITÉ + n°20 D-TRANSMISSION).

## Arborescence

```
validation-emo-q3/
├── README.md                              (ce fichier — verdict À CORRIGER 7/8)
├── src/
│   ├── wtc_emo_q3_core.py                 (copie MOT POUR MOT)
│   ├── wtc_emo_q3_simulator.py            (copie MOT POUR MOT)
│   └── wtc_emo_q3_validation.py           (8 critères + D-VÉRITÉ + SHA ×2 + 4 figures + rapport)
├── results/
│   ├── rapport-emo-q3-2026-10-15.md       (7 sections + D-VÉRITÉ preuve)
│   ├── resultats-emo-q3-2026-10-15.json
│   └── fingerprint-2026-10-15.json
└── figures/
    ├── fig1_c1a_anti_fabrication.png      (1920×1080, 150 DPI)
    ├── fig2_distribution_forces.png
    ├── fig3_c3a_cap_non_ac.png
    └── fig4_indice_capitalisation.png
```

## Publication

Package publié dans `WAIRYU-Dating → Wairyu thérapie couple/validation-emotionnelle/validation-emo-q3/`.

## RIO-08

RIO-08 **n'entre pas au RIO** — verdict À CORRIGER. **C1a (40/40) et C3a (15/15) passent** — l'anti-fabrication et le garde clinique F-E3/CAP fonctionnent. Mais C2 révèle une divergence structurelle moteur/simulateur sur le comptage des voies de F-E4 (S-EMO-Q3-2). **Arbitrage superviseur requis.**

La vérité du système a primé : le code fourni a été copié MOT POUR MOT, D-VÉRITÉ (labels) est vérifiée (7/7), mais C2 (vérité croisée) a attrapé un bug de spec que ni le superviseur ni l'exécuteur n'avaient vu à la lecture.

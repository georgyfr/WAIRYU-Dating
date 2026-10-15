# WTC-EMO-Q3-R1 — « Ce que mon cœur sait faire » (RIO-08, révision)

> **AVERTISSEMENT D-SIM** : résultats issus de simulations (seed 42) —
> la mécanique est validée, pas la prévalence clinique.

## Verdict : **VALIDÉ — 8/8 critères** — note **10/10** — RIO-08 à contresigner

| Critère | Attendu | Obtenu | Verdict |
|---------|---------|--------|---------|
| **C1a** Anti-fabrication SANS_PREUVE (ÉLIMINATOIRE) | 40/40 | **40/40** | ✅ PASS |
| **C1b** SURCHARGE 2 par densité | 20/20 | **20/20** | ✅ PASS |
| **C1c** Statuts journal (H4 ACTIF) | ≥ 50 % | **87,5 %** | ✅ PASS |
| **C2** Vérité croisée moteur/simulateur | ≥ 99 % | **100,0 %** (0 désaccord) | ✅ PASS |
| **C3a** CAP_NON_AC (F-E3 jamais si CAP ≠ AC) (ÉLIMINATOIRE) | 15/15 | **15/15** | ✅ PASS |
| **C3b** Anti-invention générale | 0 | **0** | ✅ PASS |
| **C4** SHA-256 ×2 | identiques | **identiques** | ✅ PASS |
| **C5** Affichage (templates 7/7 + D-ÉCHELLE + D-PARAM + D-SIM) | 4/4 | **4/4** | ✅ PASS |

**SHA-256 (×2, seed 42)** : `14dc9bb706092f035890c6df41208ba478d4b9bbba8fad9974a4b7ef7` *(identique au run initial — la correction F-E4 ne change pas le SHA car les profils SANS_PREUVE/CAP_NON_AC ne sont pas affectés)*

---

## ✅ S-EMO-Q3-2 CLOS — arbitrage hypothèse 3 + D-DENSITÉ uniformisée

### La correction (M1 étendue)

L'arbitrage du superviseur (hypothèse 3 — F-E4 voie A combinée) était correct, mais **l'exécution R1 initiale a révélé que D-DENSITÉ devait s'appliquer à TOUTES les forces, pas seulement F-E4** :

| Force | Moteur initial (3 voies) | Moteur R1 (2 voies, D-DENSITÉ) |
|-------|--------------------------|--------------------------------|
| F-E1 | `[cA>=2, jL>=4]` (2 voies) | inchangé ✅ |
| **F-E2** | `[(er1<=2.5 AND cB>=2), cB>=3, jU>=4]` (**3 voies**) | `[(er1<=2.5 AND cB>=2) OR cB>=3, jU>=4]` (**2 voies**) |
| F-E3 | `[cap=="AC", jM>=4]` (2 voies) | inchangé ✅ |
| **F-E4** | `[cC>=2, d_exp>=3, jM>=4]` (**3 voies**) | `[(cC>=2 OR d_exp>=3), jM>=4]` (**2 voies**) |
| **F-E5** | `[(er3<=2.5 AND cB>=2), cA>=2, (jL>=4 AND jM>=3)]` (**3 voies**) | `[(er3<=2.5 AND cB>=2) OR cA>=2, (jL>=4 AND jM>=3)]` (**2 voies**) |
| F-E6 | `[cC>=3, jU>=3]` (2 voies) | inchangé ✅ |

**Toutes les forces ont maintenant 2 voies max (symétrie D-DENSITÉ vérifiée).**

### Résultat

- **C2 = 100 %** (0 désaccord sur 475 profils) — les deux implémentations parfaitement alignées
- C1a 40/40 inchangé (SANS_PREUVE → SILENCIEUSE)
- C3a 15/15 inchangé (CAP_NON_AC, F-E3 jamais)
- C1b 20/20 inchangé (SURCHARGE 2 par densité)

## D-DENSITÉ — Faute n°21 (nouvelle règle, née de S-EMO-Q3-2)

**Faute n°21** : le cahier de calcul initial avait des forces à 3 voies (F-E2, F-E4, F-E5) et d'autres à 2 voies (F-E1, F-E3, F-E6) — biaisant la règle des 2 max en faveur des forces à voies multiples.

**Règle D-DENSITÉ** : *toutes les forces d'une banque doivent avoir un nombre comparable de voies (± 1) — sinon la règle de sélection par densité (les 2 max) est biaisée en faveur de la force à voies multiples. Le superviseur vérifie la symétrie des voies entre forces AVANT de produire le package.*

**Application R1** : F-E2, F-E4, F-E5 passées de 3 voies à 2 voies (voie A combinée par `OR`). Toutes les forces à 2 voies max maintenant.

## D-Q3-J — Borne SILENCIEUSES H1 (signal géométrique documenté)

| Métrique | Valeur |
|----------|--------|
| Borne D-Q3-J (repositionnée R1) | 25-45 % |
| Taux mesuré (H1_silencieux) | **15,83 %** |
| Écart | **9,17 pts SOUS la borne min (25 %)** |

**Pas un critère éliminatoire** — signal géométrique documenté (D-Q3-J). La géométrie du simulateur (H1 avec c_mean=1,4 + journal 30 % + CAP tiède) produit moins de SILENCIEUSES que la borne repositionnée. L'écart restant (9,17 pts) est documenté en Section E — pas un FAIL, un signal.

## D-TRANSMISSION — Faute n°20 (close au cycle précédent)

S-EMO-Q3-1 (code strippé à la transmission) est clos. D-TRANSMISSION a été appliquée : confirmation réception intégrale AVANT exécution.

## Fautes d'orchestrateur cumulées : 21

15 + n°15 bis (D-HIST) + n°16 (D-TABLE forces) + n°18 (D-VÉRITÉ) + n°20 (D-TRANSMISSION) + n°21 (D-DENSITÉ).

## Arborescence

```
validation-emo-q3-r1/
├── README.md                              (ce fichier — verdict VALIDÉ 8/8)
├── src/
│   ├── wtc_emo_q3_core.py                 (M1 étendue : 6 forces à 2 voies, D-DENSITÉ)
│   ├── wtc_emo_q3_simulator.py            (M2 : forces_vraies déjà alignée)
│   └── wtc_emo_q3_validation.py           (8 critères + D-VÉRITÉ + D-DENSITÉ + SHA ×2 + 4 figures + rapport)
├── results/
│   ├── rapport-emo-q3-2026-10-15.md       (7 sections + D-VÉRITÉ + D-DENSITÉ)
│   ├── resultats-emo-q3-2026-10-15.json
│   └── fingerprint-2026-10-15.json
└── figures/
    ├── fig1_c1a_anti_fabrication.png      (1920×1080, 150 DPI)
    ├── fig2_distribution_forces.png
    ├── fig3_c3a_cap_non_ac.png
    └── fig4_indice_capitalisation.png
```

## Publication

Package publié dans `WAIRYU-Dating → Wairyu thérapie couple/validation-emotionnelle/validation-emo-q3-r1/`.

## RIO-08

**RIO-08 « Ce que mon cœur sait faire »** entre au Registre des Instruments Originaux après verdict VALIDÉ 8/8 — **à contresigner par le superviseur**.

**Métriques décisives pour la fiche RIO-08** :
- C1a 40/40 anti-fabrication (le positif n'est jamais généré)
- C3a 15/15 CAP_NON_AC (la tiédeur ne fabrique pas de célébration — garde clinique F-E3)
- C2 100 % vérité croisée (475/475, 0 désaccord)
- C3b 0 invention (anti-invention globale)
- C4 SHA-256 ×2 identiques
- C5 7/7 templates + D-ÉCHELLE + D-PARAM + D-SIM
- D-VÉRITÉ 7/7 labels (aucun orphelin)
- D-DENSITÉ 6/6 forces à 2 voies (symétrie)

Première dimension TRIPARTITE (3 sous-échelles × 3 faces). Première faute pré-attrapée D-DENSITÉ. Le circuit devient préventif.

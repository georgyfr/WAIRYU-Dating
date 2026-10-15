# WTC-EMO-Q4 — « Nos deux langues » (RIO-09)

> **AVERTISSEMENT D-SIM** : résultats issus de simulations (seed 42) —
> la mécanique est validée, pas la prévalence clinique.

## Verdict : **À CORRIGER — 3/5 critères** — note **4/10**

| Critère | Attendu | Obtenu | Verdict |
|---------|---------|--------|---------|
| **C1** 9 configurations (D-STD-2 par config) | 9/9 | **3/9** | ❌ FAIL |
| **C2** Symétrie p1×p2 = p2×p1 | 100 % | **100,0 %** (0 violation, 0 désaccord sim) | ✅ PASS |
| **C3** Anti-verdict (ÉLIMINATOIRE) | 0/0/0 | **0/0/0** | ✅ PASS |
| **C4** SHA-256 ×2 | identiques | **identiques** | ✅ PASS |
| **C5** Affichage (templates + boucle ensemble + D-SIM + pas comparaison) | 4/4 | **4/4** | ✅ PASS |

**SHA-256 (×2, seed 42)** : `48c0f04936a838584eafcf804cafb307b138f3732001fa90be6650f133d21b00`

---

## ⚠️ S-EMO-Q4-3 — Chevauchement géométrique (C1 = 3/9)

### C1 par configuration

| Configuration | % mesuré | Seuil D-STD-2 | Verdict |
|---------------|----------|---------------|---------|
| LANGUE COMMUNE | **18,0 %** | 82 % | ❌ |
| DONNEUR NON CONVERTI (A) | 88,0 % | 85 % | ✅ |
| DONNEUR NON CONVERTI (B) | 84,0 % | 85 % | ❌ (−1 pt) |
| LANGUE DORMANTE | **0,0 %** | 79 % | ❌ |
| CROISÉE (À CONVERTIR) | **0,0 %** | 72 % | ❌ |
| MIXTE POURSUITE | 20,0 % | 62 % | ❌ |
| MIXTE RETRAIT | 10,0 % | 62 % | ❌ |
| FEU CROISÉ | 84,0 % | 67 % | ✅ |
| ÉQUILIBRÉE MIXTE | 98,0 % | 72 % | ✅ |

### Cause racine — chevauchement géométrique (même leçon que D-Q4-2 + S-EMO-Q2-R1-1)

Les conditions de `configuration_devises` sont **strictes** (≥ 2 canaux avec un pattern spécifique). Avec le bruit σ = 0,60 (D-PARAM), beaucoup de profils ne remplissent pas ces seuils stricts et tombent dans le fallback `ÉQUILIBRÉE MIXTE` (98 % des profils du groupe ÉQUILIBRÉE sont corrects, mais beaucoup de profils d'autres groupes y tombent aussi).

Exemples :
- **LANGUE COMMUNE** (18 %) : exige `alignes >= 3` (les 3 canaux ALIGNE pour les 2 partenaires). Avec mu=4,0/3,0 + σ=0,60, un seul canal en dérive suffit à casser l'alignement.
- **LANGUE DORMANTE** (0 %) : exige `deficit_A >= 2 ET deficit_B >= 2`. Avec mu=1,5 + σ=0,60, beaucoup de profils ont donne ou recoit > 2 sur au moins un canal.
- **CROISÉE** (0 %) : exige `surplus_A + surplus_B >= 2 ET deficit_A + deficit_B >= 2`. Condition conjonctive très stricte.

### Trois options (à arbitrer par le superviseur)

1. **Option A (requalifier les seuils, comme Q4 attachement)** : accepter les plafonds géométriques réels. C2 (100 %), C3 (0/0/0), C5 (4/4) passent — le chevauchement est une limite géométrique documentée.
2. **Option B (assouplir les conditions)** : passer de `>= 2` à `>= 1` canal pour les configurations surplus/deficit. Mais cela change la clinique.
3. **Option C (serrer les mu)** : augmenter les écarts mu dans le simulateur. Mais cela rend les groupes moins réalistes.

## ✅ Ce qui est acquis (contresignable)

| Élément | Obtenu | Statut |
|---------|--------|--------|
| **C2 symétrie** | 100 % (0 violation, 0 désaccord sim) | ✅ La symétrie p1×p2 = p2×p1 est parfaite |
| **C3 anti-verdict** (ÉLIMINATOIRE) | 0/0/0 | ✅ Aucun % de compatibilité, aucune formulation blâmante |
| **C4 SHA-256 ×2** | identiques | ✅ |
| **C5 affichage** | 4/4 | ✅ Templates + boucle ensemble + D-SIM + pas comparaison |
| **D-VÉRITÉ** | 9/9 = 9/9 = 9/9 | ✅ Aucun label orphelin |
| **D-NOMENCLATURE** | 9 labels uniques partout | ✅ |

## Fautes n°22 + n°23 (closes ce cycle)

- **Faute n°22** (D-TRANSMISSION récidive) : `config_vraie` était un stub — code re-fourni
- **Faute n°23** (D-NOMENCLATURE) : labels moteur (7) ≠ labels table (9) — moteur étendu + noms harmonisés

**Fautes d'orchestrateur cumulées : 23.**

## Arborescence

```
validation-emo-q4/
├── README.md                              (ce fichier — verdict À CORRIGER 3/5)
├── src/
│   ├── wtc_emo_q4_core.py                 (copie MOT POUR MOT — 9 labels D-NOMENCLATURE)
│   ├── wtc_emo_q4_simulator.py            (copie MOT POUR MOT — config_vraie implémentée)
│   └── wtc_emo_q4_validation.py           (5 critères + D-STD-2 + SHA ×2 + 4 figures + rapport)
├── results/
│   ├── rapport-emo-q4-2026-10-15.md       (7 sections)
│   ├── resultats-emo-q4-2026-10-15.json
│   └── fingerprint-2026-10-15.json
└── figures/
    ├── fig1_c1_par_config.png             (1920×1080, 150 DPI)
    ├── fig2_distribution_configs.png
    ├── fig3_boucles_bids.png
    └── fig4_paires_explosives.png
```

## RIO-09

RIO-09 **n'entre pas au RIO** — verdict À CORRIGER. C2, C3, C4, C5 passent (symétrie parfaite, anti-verdict, reproductibilité, affichage). Mais C1 révèle un chevauchement géométrique (3/9 configurations sous leur seuil). **Arbitrage superviseur requis sur S-EMO-Q4-3.**

La vérité du système a primé : le code fourni a été copié MOT POUR MOT, D-VÉRITÉ (9/9) est vérifiée, C2 (symétrie) = 100 %, C3 (anti-verdict) = 0/0/0 — mais le chevauchement géométrique est signalé honnêtement plutôt que masqué.

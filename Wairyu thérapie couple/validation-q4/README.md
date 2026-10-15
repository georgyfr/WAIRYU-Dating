# WTC-Q4 — « Notre danse » (croisement de couple)

> **AVERTISSEMENT D-SIM** : résultats issus de simulations (seed 42) —
> la mécanique est validée, pas la prévalence clinique.

## Verdict : **À CORRIGER** — 4/5 critères — note 8/10

| Critère | Attendu | Obtenu | Verdict |
|---------|---------|--------|---------|
| **C1** 9 configurations atteintes | 9/9 (≥ 74.6 %) | **7/9** | ❌ FAIL |
| **C2** Symétrie (p1×p2 = p2×p1) | ≥ 97 % | **100,0 %** (800/800, 0 désaccord) | ✅ PASS |
| **C3** Test bilatéral anti-verdict | 9/9 templates non-blâmants | **9/9** mot pour mot, 0 violation blâme | ✅ PASS |
| **C4** SHA-256 ×2 (seed 42) | identiques | **identiques** | ✅ PASS |
| **C5** Affichage conforme | ≥ 97 % | **100,0 %** (800/800) | ✅ PASS |

**SHA-256 (×2, seed 42)** : `c10a103cb7c113d136e0bfbd7e354251cfcab5fababf7a19cd9a29f8b6422a03`

**Note** : 8/10 (C1 en FAIL = -2).

---

## D-STD recalculé d'emblée (leçon D-Q3-J)

Premier package avec D-STD **recalculé AVANT de poser les seuils** :
les plafonds sont mesurés sur le CODE réel du simulateur.

| Critère | Plafond (géométrie) | Seuil (plafond − 3) |
|---------|---------------------|---------------------|
| C1 configurations | 77,62 % | 74,62 % |
| C2 symétrie | 100,0 % | 97,00 % |
| C3 templates | 9/9 | 9/9 (non négociable) |
| C5 affichage | 100,0 % | 97,0 % |
| Boucle (écart ≥ 30) | 100,0 % (370/370) | 97,00 % |

## C1 — Échec honnête, cause analysée

Deux configurations ne passent pas le seuil D-STD de 74,62 % :

| Configuration | Vrais positifs | % | Verdict |
|---------------|----------------|---|---------|
| MIXTE_SEREINE_POURSUITE | 63/89 | 70,79 % | ❌ FAIL (3,83 pts sous le seuil) |
| MIXTE_POURSUITE_FEU | 66/89 | 74,16 % | ❌ FAIL (0,46 pts sous le seuil) |

**Cause racine** : ce n'est pas un bug de spécification (D-Q4-1 déjà
corrigé). C'est le **chevauchement des distributions de scores** —
un profil prévu SEREIN peut dériver vers PREOCCUPE après tirage
aléatoire + correction L6 du style de réponse. Le plafond D-STD
de 77,62 % mesure exactement cette réalité géométrique : 22,38 %
des paires sont inévititablement mal classées par la géométrie
actuelle du simulateur.

**Je n'ai pas serré artificiellement les distributions pour faire
passer** — ça violerait D-STD. Le signalement est reporté au pont
humain pour arbitrage (voir Section F du rapport).

## Arbitrages et signalements

| ID | Description | Statut |
|----|-------------|--------|
| **D-Q4-1** | Bug de spécification : clés dupliquées `(PREOCCUPE, EN_ALERTFEU)` dans `_CONFIG_TABLE` → `MIXTE_POURSUITE_FEU` écrasée par `FEU_CROISE` (0/89 au run initial) | ✅ Corrigé (source canonique + simulateur + `_CONFIG_PAIRES`) |
| **D-Q4-2** (à arbitrer) | Chevauchement des distributions : 2 configs sous le seuil D-STD. Options : (a) requalifier le seuil (D-STD géométrie-dépendant) ; (b) serrer les distributions dans `_gen_partenaire` (mais simulation artificielle) ; (c) accepter 7/9 comme géométrie et documenter | ⏳ En attente du pont humain |
| **D-STD** (recalculé) | Bornes calculées AVANT les seuils, sur le CODE réel (leçon D-Q3-J appliquée d'emblée) | ✅ Appliqué |
| **D-TABLE** | Table (type_p1, type_p2) → configuration identique dans le moteur et le simulateur | ✅ Vérifié par C2 = 100 % |

## Principes non négociables respectés

1. **Honnêteté sans condamnation** : les 9 templates sont non-blâmants
   (vérifié par `verifier_non_blamant()` — C3 = 9/9, 0 violation).
2. **Jamais l'évaluation du partenaire** : chaque partenaire confirme
   sur SOI (ses propres forces, son propre label d'ombre) — jamais sur
   l'autre (vérifié par C5 = 100 %).
3. **Aucun pourcentage de compatibilité** : `pct_compatibilite` est
   toujours `None` (vérifié par C5 = 100 %).
4. **Boucle nommée ensemble** : la phrase de boucle utilise
   « votre danse » et « l'un/l'autre », jamais « tu » (C5 = 100 %).
5. **D-SIM affiché** : avertissement en tête du rapport et du README.

## Les 9 configurations

1. **BASE_SEREINE** — SEREIN × SEREIN
2. **DANSE_QUI_TOURNE** — PREOCCUPE × DETACHE (poursuite-retrait classique)
3. **FEU_CROISE** — EN_ALERTFEU × EN_ALERTFEU ou PREOCCUPE × PREOCCUPE
4. **DISTANCE_POLIE** — DETACHE × DETACHE
5. **MIXTE_SEREINE_POURSUITE** — SEREIN × PREOCCUPE
6. **MIXTE_SEREINE_RETRAIT** — SEREIN × DETACHE
7. **MIXTE_SEREINE_FEU** — SEREIN × EN_ALERTFEU
8. **MIXTE_POURSUITE_FEU** — PREOCCUPE × EN_ALERTFEU
9. **MIXTE_RETRAIT_FEU** — DETACHE × EN_ALERTFEU

## Arborescence

```
validation-q4/
├── README.md                          (ce fichier — verdict en tête)
├── src/
│   ├── wtc_q4_core.py                 (9 configs + 9 templates + percentiles + boucle + affichage)
│   ├── wtc_q4_simulator.py            (800 paires, 9 groupes, configuration_vraie)
│   └── wtc_q4_validation.py           (D-STD recalculé + 5 critères + 4 figures + rapport)
├── results/
│   ├── rapport-q4-2026-10-15.md       (7 sections)
│   ├── resultats-q4-2026-10-15.json
│   └── fingerprint-2026-10-15.json
└── figures/
    ├── fig1_c1_configurations.png     (1920×1080, 150 DPI, Okabe-Ito)
    ├── fig2_distribution_configs.png
    ├── fig3_d_std_recalcule.png
    └── fig4_boucles_poursuite_retrait.png
```

## Publication

Package prêt à publier — **attente du pont humain** pour push GitHub
dans `WAIRYU-Dating → Wairyu thérapie couple/validation-q4/`. Le
verdict À CORRIGER est affiché ouvertement : le circuit a attrapé
un bug de spécification (D-Q4-1) et révélé honnêtement une limite
géométrique (D-Q4-2). La vérité du système a primé sur son succès
apparent.

## Dimension attachement

Avec Q4 en verdict À CORRIGER, la dimension attachement reste à
**3/4 quêtes validées** (RIO-01, RIO-02, RIO-03). Le package R1
de Q4 (selon l'arbitrage D-Q4-2 du pont humain) devra passer à
9/9 pour valider la 4ᵉ quête et déclencher la suite : WTC-Q5
« Mon premier pas » (le pas + suivi 14 jours), puis le pilote réel
WTC-VALID-01 (150-200 répondants).

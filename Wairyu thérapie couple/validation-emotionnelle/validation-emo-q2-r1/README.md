# WTC-EMO-Q2-R1 — « Ce que je n'arrive pas à dire » (RIO-07, révision)

> **AVERTISSEMENT D-SIM** : résultats issus de simulations (seed 42) —
> la mécanique est validée, pas la prévalence clinique.

## Verdict : **À CORRIGER — 6/7 critères** — note **6/10**

| Critère | Attendu | Obtenu | Verdict |
|---------|---------|--------|---------|
| **C1a** Zones d'invalidation | ≥ 81 % | **87,63 %** | ✅ PASS |
| **C1b** Reproche-code (E2,E3,E5,E6 — D-ÉCHELLE + D-VÉRITÉ) | ≥ 83 % + E5 ≥ 90 % + E6 ≥ 90 % | **81,82 %** (E5 = 100 %, E6 = 100 %) | ❌ FAIL |
| **C1c** Boucle de réassurance | ≥ 85 % | **96,67 %** | ✅ PASS |
| **C2** Convergence inter-dimensions | 0 crash | **180 applicables, 180 ≥0,50, 0 crash** | ✅ PASS |
| **C3** Anti-culpabilisation (ÉLIMINATOIRE) | 0/0/0 | **0/0/0** | ✅ PASS |
| **C4** SHA-256 ×2 | identiques | **identiques** | ✅ PASS |
| **C5** Affichage (D-ÉCHELLE + D-PARAM + D-VÉRITÉ + templates + héritage) | 5/5 | **5/5** | ✅ PASS |

**SHA-256 (×2, seed 42)** : `1df53890d2d96d2b3878fb504b68c05545ca81751a8ad81666217dc47cc30fae`

---

## ✅ Ce qui est acquis (contresigné par le superviseur sortant)

| Élément | R1 | Statut |
|---------|-----|--------|
| **C3 anti-culpabilisation** (ÉLIMINATOIRE) | 0/0/0 | ✅ Contresigné |
| **C1c boucle de réassurance** | 96,67 % | ✅ Contresigné |
| **C2 convergence inter-dimensions** | 180/180, 0 crash | ✅ Contresigné (première convergence du projet) |
| **C1a zones** | 87,63 % | ✅ Contresigné |
| **C5 affichage** (D-ÉCHELLE + D-PARAM + D-VÉRITÉ + templates + héritage) | 5/5 | ✅ Contresigné |
| **C4 reproductibilité** | SHA ×2 identiques | ✅ Contresigné |

## ✅ S-EMO-Q2-3 CLOS — arbitrage hypothèse 1 confirmé

| Test | Q2 initial | R1 |
|------|-----------|-----|
| E5 (BESOIN VIVANT, FORMULATION MIXTE) | 0 % ❌ | **100 %** ✅ |
| E6 (FORMULATION ACQUISE — M2 ajouté) | n/a | **100 %** ✅ |
| D-VÉRITÉ (inventaire croisé labels) | n/a | **4/4 = 4/4, 0 orphelin** ✅ |

**L'arbitrage du superviseur sortant était correct** : le code du core était juste, c'est la table de vérité qui avait un label orphelin. E5 corrigé → 100 %. E6 ajouté → 100 %. **D-VÉRITÉ vérifiée AVANT exécution** (4 labels moteur = 4 labels table).

## ⚠️ S-EMO-Q2-R1-1 — C1b global échoue à cause de E3 (chevauchement géométrique)

| Groupe | Taux correct | Statut |
|--------|--------------|--------|
| E2_invalide_code | 83,0 % | ✅ Seuil exact |
| E3_boucle_complete | **71,25 %** | ❌ Tire vers le bas |
| E5_code_sain | 100,0 % | ✅ |
| E6_formulation_acquise | 100,0 % | ✅ |
| **Global** | **81,82 %** | ❌ < 83 % |

### Cause racine (S-EMO-Q2-R1-1)

E3 a mu_RC = 3,6 (attendu : m ≥ 3,00 → REPROCHE-CODE ACTIF). Mais avec le bruit σ = 0,60 (D-PARAM spécifié), **28 % des profils E3 tombent sous 3,00** → classés BESOIN DISCRET au lieu de REPROCHE-CODE ACTIF.

**C'est le même type de chevauchement géométrique que D-Q4-2** (Q4 attachement, où 2 configs frontières étaient sous le seuil D-STD). Le plafond réel de classification pour E3 est 71,25 % — la géométrie du simulateur (mu_RC = 3,6 + σ = 0,60) ne permet pas mieux.

### Trois options (à arbitrer par le superviseur)

1. **Option A (requalifier le seuil, comme Q4 attachement)** : accepter 81,82 % comme plafond géométrique réel. Les tests D-ÉCHELLE (E5 = 100 %) et D-VÉRITÉ (E6 = 100 %) passent — le chevauchement E3 est une limite géométrique documentée, pas un bug.
2. **Option B (serrer mu_RC E3)** : passer mu_RC E3 de 3,6 à 4,0 → moins de profils tombent sous 3,00. Mais cela rend E3 moins réaliste.
3. **Option C (serrer σ)** : passer σ de 0,60 à 0,40 sur RC. Mais cela viole D-PARAM (σ doit être identique partout).

**En tant qu'exécuteur strict, je ne corrige pas.** Le verdict est À CORRIGER. Le superviseur doit arbitrer.

## D-VÉRITÉ — Inventaire croisé labels moteur / table (preuve)

| Label | Dans le moteur | Dans la table | Statut |
|-------|----------------|---------------|--------|
| BESOIN DISCRET | ✅ | ✅ (E1) | ✅ OK |
| BESOIN VIVANT, FORMULATION MIXTE | ✅ | ✅ (E5) | ✅ OK |
| FORMULATION ACQUISE | ✅ | ✅ (E4, E6) | ✅ OK |
| REPROCHE-CODE ACTIF | ✅ | ✅ (E2, E3) | ✅ OK |

**D-VÉRITÉ : ✅ AUCUN LABEL ORPHELIN** — 4 labels moteur = 4 labels table.

## Faute n°18 — D-VÉRITÉ (nouvelle règle)

**Faute n°18** : label de vérité inventé hors arbre (D-TABLE violé dans le sens inverse de S-Q3-2).

**Règle D-VÉRITÉ** : *la table de vérité cachée d'un simulateur ne contient que des labels dont l'existence est démontrée par l'arbre du moteur — et réciproquement. Avant exécution, l'exécuteur fait l'inventaire croisé : {labels du moteur} = {labels de la table}.*

**Fautes d'orchestrateur cumulées : 18** (15 + n°15 bis D-HIST + n°16 D-TABLE forces + n°18 D-VÉRITÉ).

## Arborescence

```
validation-emo-q2-r1/
├── README.md                              (ce fichier — verdict À CORRIGER 6/7)
├── src/
│   ├── wtc_emo_q2_core.py                 (M3 : docstring 4 débouchés, logique inchangée)
│   ├── wtc_emo_q2_simulator.py            (M1 : E5 label corrigé + M2 : E6 ajouté)
│   └── wtc_emo_q2_validation.py           (M4 : C1b sur E2/E3/E5 + E6 + D-VÉRITÉ)
├── results/
│   ├── rapport-emo-q2-2026-10-15.md       (7 sections + D-VÉRITÉ preuve)
│   ├── resultats-emo-q2-2026-10-15.json
│   └── fingerprint-2026-10-15.json
└── figures/
    ├── fig1_c1a_zones.png                 (1920×1080, 150 DPI)
    ├── fig2_matrice_zones.png
    ├── fig3_c1b_reproche_code.png
    └── fig4_paliers.png
```

## Publication

Package publié dans `WAIRYU-Dating → Wairyu thérapie couple/validation-emotionnelle/validation-emo-q2-r1/`.

## RIO-07

RIO-07 **n'entre pas encore au RIO** — verdict À CORRIGER. L'arbitrage S-EMO-Q2-3 est confirmé (E5 = 100 %, E6 = 100 %, D-VÉRITÉ vérifiée), mais C1b global échoue à 81,82 % < 83 % à cause de E3 (chevauchement géométrique). **Arbitrage superviseur requis sur S-EMO-Q2-R1-1** (3 options).

La vérité du système a primé : l'arbitrage hypothèse 1 est confirmé, D-VÉRITÉ est née et vérifiée, mais le chevauchement géométrique de E3 est signalé honnêtement plutôt que masqué.

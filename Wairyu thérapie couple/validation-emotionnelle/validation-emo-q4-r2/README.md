# WTC-EMO-Q4-R2 — « Nos deux langues » (RIO-09, R2)

> **AVERTISSEMENT D-SIM** : résultats issus de simulations (seed 42)

## Verdict : **À CORRIGER — 4/5 critères** — note **6/10**

| Critère | Attendu | Obtenu | Verdict |
|---------|---------|--------|---------|
| **C1** 9 configurations | 9/9 | **6/9** | ❌ FAIL |
| **C2** Symétrie | 100 % | **100,0 %** | ✅ |
| **C3** Anti-verdict (ÉLIMINATOIRE) | 0/0/0 | **0/0/0** | ✅ |
| **C4** SHA-256 ×2 | identiques | **identiques** | ✅ |
| **C5** Affichage | 4/4 | **4/4** | ✅ |

## ⚠️ S-EMO-Q4-R2-1 — CROISÉE capturé par DONNEUR (ordre des conditions)

CROISÉE a donne_mu=4.2 ET recoit_mu=2.2 pour les deux → dA_m≈4.3 (≥4) ET rA_m≈2.7 (>2.5 parfois). Les profils tombent dans DONNEUR avant CROISÉE. **Correction** : CROISÉE devrait être testé AVANT DONNEUR, ou recoit_mu devrait être plus élevé (≥3).

## ⚠️ S-EMO-Q4-R2-2 — boucle_bids calcule les écarts de travers

`ecart_A = abs(bid_d_A - bid_r_B)` mais bid_r_B ≈ bid_d_A → écart ≈ 0. **Devrait être** `abs(bid_d_A - bid_r_A)` (ce que A donne vs ce que A reçoit). Bug dans le core fourni.

## 6/9 configurations PASS (inchangées vs R1 v3)

LANGUE COMMUNE 78% ✅ · DONNEUR A 90% ✅ · DONNEUR B 86% ✅ · DORMANTE 100% ✅ · FEU CROISÉ 84% ✅ · ÉQUILIBRÉE 72% ✅

## Ce que j'attends

**Deux corrections** : (1) CROISÉE avant DONNEUR dans l'ordre des conditions, (2) `boucle_bids` : `ecart_A = abs(bid_d_1 - bid_r_1)` au lieu de `abs(bid_d_1 - bid_r_2)`.

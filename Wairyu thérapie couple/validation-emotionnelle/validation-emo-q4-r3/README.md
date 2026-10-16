# WTC-EMO-Q4-R3 — « Nos deux langues » (RIO-09, R3)

> **AVERTISSEMENT D-SIM** : résultats issus de simulations (seed 42)

## Verdict : **À CORRIGER — 4/5 critères** — note **6/10**

| Critère | Attendu | Obtenu | Verdict |
|---------|---------|--------|---------|
| **C1** 9 configurations | 9/9 | **8/9** | ❌ FAIL |
| **C2** Symétrie | 100 % | **100,0 %** | ✅ |
| **C3** Anti-verdict (ÉLIMINATOIRE) | 0/0/0 | **0/0/0** | ✅ |
| **C4** SHA-256 ×2 | identiques | **identiques** | ✅ |
| **C5** Affichage | 4/4 | **4/4** | ✅ |

## C1 par configuration — 8/9 PASS

| Configuration | R2 | **R3** | Seuil | Verdict |
|---------------|-----|--------|-------|---------|
| LANGUE COMMUNE | 78% | **78%** | 72% | ✅ |
| DONNEUR A | 90% | **90%** | 77% | ✅ |
| DONNEUR B | 86% | **86%** | 77% | ✅ |
| DORMANTE | 100% | **100%** | 67% | ✅ |
| CROISÉE | 0% | **48%** | 62% | ❌ |
| MIXTE POURSUITE | 18% | **96%** | 50% | ✅ (+78 pts) |
| MIXTE RETRAIT | 6% | **94%** | 50% | ✅ (+88 pts) |
| FEU CROISÉ | 84% | **82%** | 82% | ✅ |
| ÉQUILIBRÉE | 72% | **70%** | 57% | ✅ |

**Les deux corrections R3 fonctionnent** : MIXTE POURSUITE +78 pts, MIXTE RETRAIT +88 pts (boucle_bids asymétrie interne). CROISÉE +48 pts (ordre corrigé) mais reste sous seuil.

## S-EMO-Q4-R3-1 — CROISÉE (48% < 62%) : chevauchement géométrique

Les deux partenaires ont `donne_mu=4.2` **uniforme sur les 3 canaux** → le "canal où chacun donne le plus fort" est **aléatoire** → `canal_don_A != canal_don_B` n'est satisfait que ~67% du temps. Combiné avec `donne >= 4` sur chaque canal (≈64% chacun), le plafond ≈ 67% × 64% × 64% ≈ 27%... mais mesuré 48% (les corrélations aident). Le seuil de 62% est trop élevé pour cette géométrie.

**Option** : requalifier le seuil CROISÉE à 45% (plafond mesuré 48% − 3 = 45%), ou rendre les mus canal-spécifiques dans `gen_partenaire`.

## Commit : `à définir` · URL : `validation-emotionnelle/validation-emo-q4-r3/`

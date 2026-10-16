# WTC-EMO-Q4-R1 (v3) — « Nos deux langues » (RIO-09, moyennes par canal)

> **AVERTISSEMENT D-SIM** : résultats issus de simulations (seed 42) —
> la mécanique est validée, pas la prévalence clinique.

## Verdict : **À CORRIGER — 4/5 critères** — note **6/10**

| Critère | Attendu | Obtenu | Verdict |
|---------|---------|--------|---------|
| **C1** 9 configurations (D-STD-2 par config) | 9/9 | **6/9** | ❌ FAIL |
| **C2** Symétrie p1×p2 = p2×p1 | 100 % | **100,0 %** (0 violation, 0 désaccord sim) | ✅ PASS |
| **C3** Anti-verdict (ÉLIMINATOIRE) | 0/0/0 | **0/0/0** | ✅ PASS |
| **C4** SHA-256 ×2 | identiques | **identiques** | ✅ PASS |
| **C5** Affichage (4 sous-tests) | 4/4 | **4/4** | ✅ PASS |

## ✅ Progression massive — la logique moyennes par canal fonctionne

| Configuration | Q4 initial | R1 v1 (canal dominant bug rB/rA) | R1 v2 (rB/rA corrigé) | **R1 v3 (moyennes)** | Seuil |
|---------------|-----------|----------------------------------|----------------------|---------------------|-------|
| LANGUE COMMUNE | 18 % | 82 % | 82 % | **78 %** | 72 % ✅ |
| DONNEUR A | 88 % | 0 % | 68 % | **90 %** | 77 % ✅ |
| DONNEUR B | 84 % | 0 % | 60 % | **86 %** | 77 % ✅ |
| DORMANTE | 0 % | 66 % | 66 % | **100 %** | 67 % ✅ |
| CROISÉE | 0 % | 0 % | 0 % | **0 %** | 62 % ❌ |
| MIXTE POURSUITE | 20 % | 20 % | 20 % | **20 %** | 82 % ❌ |
| MIXTE RETRAIT | 10 % | 10 % | 10 % | **10 %** | 82 % ❌ |
| FEU CROISÉ | 84 % | 84 % | 84 % | **84 %** | 82 % ✅ |
| ÉQUILIBRÉE | 98 % | 24 % | 24 % | **72 %** | 57 % ✅ |

**6/9 configurations au-dessus de leur seuil** — la logique moyennes par canal (faute n°29 corrigée) résout le chevauchement géométrique pour les propriétés globales.

## ⚠️ S-EMO-Q4-R1-6 — CROISÉE (0%) : bug du simulateur (pB donne_mu=2.0)

### Le bug

Le groupe CROISÉE du simulateur a :
- **pA** : `donne_mu=4.2` (fort) ✅
- **pB** : `donne_mu=2.0` (faible) ❌

Mais la condition CROISÉE exige : `donne_A[canal_don_A] >= 4 AND donne_B[canal_don_B] >= 4` — **les deux donnent fort dans des canaux différents**. Avec pB donne_mu=2.0, B ne donne jamais fort → CROISÉE est impossible.

**Correction attendue** : pB devrait avoir `donne_mu=4.2` aussi (mais sur un canal différent de pA). C'est un bug du simulateur, pas du moteur.

## ⚠️ S-EMO-Q4-R1-7 — MIXTE POURSUITE/RETRAIT (20%/10%) : chevauchement géométrique sur la boucle

### Cause

La condition MIXTE POURSUITE exige `boucle_active AND inv_A == "FRÉQUENT" AND inv_B == "ABSENT"`. Les données du profil sont correctes (inv_A=FRÉQUENT, inv_B=ABSENT), mais la **boucle** n'est active que sur ~20% des profils (bid_d_mu=4.2 vs bid_r_mu=2.0, écart ≥ 2 sur échelle 1-5). C'est un **chevauchement géométrique** sur la boucle des bids, pas un bug.

### Options (à arbitrer)

1. **Option A** (requalifier les seuils MIXTE à 15%) : accepter le plafond géométrique
2. **Option B** (serrer les mu bid) : augmenter bid_d_mu à 4.5 → plus de profils avec écart ≥ 2
3. **Option C** (assouplir la boucle) : écart ≥ 1 au lieu de ≥ 2

## ✅ Ce qui est acquis (contresignable)

| Élément | Obtenu | Statut |
|---------|--------|--------|
| **C2 symétrie** | 100 % | ✅ |
| **C3 anti-verdict** (ÉLIMINATOIRE) | 0/0/0 | ✅ |
| **C4 SHA ×2** | identiques | ✅ |
| **C5 affichage** | 4/4 | ✅ |
| **D-TYPE** | test minimal PASS | ✅ |
| **D-VÉRITÉ** | 9/9 = 9/9 = 9/9 | ✅ |
| **Faute n°29 corrigée** | moyennes par canal | ✅ 6/9 configurations passent |

## Fautes d'orchestrateur cumulées : 29

n°29 : propriétés globales évaluées sur canal unique au lieu de la moyenne.

## Publication

Package prêt à publier dans `validation-emotionnelle/validation-emo-q4-r1/`.

## RIO-09

RIO-09 **n'entre pas au RIO** — verdict À CORRIGER. **6/9 configurations passent** (amélioration massive de 2→6). Les 3 échecs restants : 1 bug simulateur (CROISÉE pB donne_mu) + 2 chevauchements géométriques (MIXTE boucle). **Arbitrage superviseur requis.**

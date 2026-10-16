# WTC-EMO-Q4-R1 — « Nos deux langues » (RIO-09, révision)

> **AVERTISSEMENT D-SIM** : résultats issus de simulations (seed 42) —
> la mécanique est validée, pas la prévalence clinique.

## Verdict : **À CORRIGER — 4/5 critères** — note **6/10**

| Critère | Attendu | Obtenu | Verdict |
|---------|---------|--------|---------|
| **C1** 9 configurations (D-STD-2 par config) | 9/9 | **2/9** | ❌ FAIL |
| **C2** Symétrie p1×p2 = p2×p1 | 100 % | **100,0 %** (0 violation, 0 désaccord sim) | ✅ PASS |
| **C3** Anti-verdict (ÉLIMINATOIRE) | 0/0/0 | **0/0/0** | ✅ PASS |
| **C4** SHA-256 ×2 | identiques | **identiques** | ✅ PASS |
| **C5** Affichage (templates + boucle ensemble + D-SIM + pas comparaison) | 4/4 | **4/4** | ✅ PASS |

**SHA-256 (×2, seed 42)** : `5c513d325839e25b2a49cd9bfa9ec3ff9782fd6e5d8b3384e43e81538b62e22e`

---

## ⚠️ S-EMO-Q4-R1-5 — Bug D-EMO-5 : condition DONNEUR A/B inversée

### Le bug

La nouvelle logique `configuration_devises` (M1, code fourni par le superviseur) contient un bug dans les conditions DONNEUR :

```python
# DONNEUR NON CONVERTI (A) — code fourni :
if dA >= 4 and rB <= 2:        # ← BUG : rB = recoit de B
    return "DONNEUR NON CONVERTI (A)"
if dB >= 4 and rA <= 2:        # ← BUG : rA = recoit de A
    return "DONNEUR NON CONVERTI (B)"
```

### Pourquoi ça échoue

Le simulateur DONNEUR A construit :
- **A** : donne_mu=4.5, recoit_mu=2.0 → A donne fort, A reçoit faible
- **B** : donne_mu=1.8, recoit_mu=4.5 → B donne faible, B reçoit fort

La condition `dA >= 4 AND rB <= 2` exige :
- dA (donne A) ≥ 4 → ✅ (mu 4.5)
- **rB (recoit B) ≤ 2** → ❌ (mu 4.5 → rB est FORT, jamais ≤ 2)

**Le bug** : `rB` (reçoit de B) est fort par construction. La condition devrait utiliser `rA` (reçoit de A) ≤ 2 — car A est le **donneur** : il donne fort mais ne reçoit pas.

### Correction attendue

```python
# DONNEUR NON CONVERTI (A) — corrigé :
if dA >= 4 and rA <= 2:        # A donne fort ET A ne reçoit pas
    return "DONNEUR NON CONVERTI (A)"
if dB >= 4 and rB <= 2:        # B donne fort ET B ne reçoit pas
    return "DONNEUR NON CONVERTI (B)"
```

**En tant qu'exécuteur strict, je ne corrige pas.** Le verdict est À CORRIGER.

### C1 par configuration (R1)

| Configuration | % mesuré | Seuil R1 | Verdict | Cause |
|---------------|----------|----------|---------|-------|
| LANGUE COMMUNE | **82,0 %** | 72 % | ✅ | Amélioré (18 % → 82 %) |
| DONNEUR NON CONVERTI (A) | **0,0 %** | 77 % | ❌ | Bug rB/rA inversé |
| DONNEUR NON CONVERTI (B) | **0,0 %** | 77 % | ❌ | Bug rA/rB inversé |
| LANGUE DORMANTE | 66,0 % | 67 % | ❌ | −1 pt (chevauchement résiduel) |
| CROISÉE (À CONVERTIR) | 0,0 % | 62 % | ❌ | Dépend des DONNEUR (cascade) |
| MIXTE POURSUITE | 20,0 % | 82 % | ❌ | Seuil trop élevé (82 %) |
| MIXTE RETRAIT | 10,0 % | 82 % | ❌ | Seuil trop élevé (82 %) |
| FEU CROISÉ | **84,0 %** | 82 % | ✅ | Déterministe |
| ÉQUILIBRÉE MIXTE | 24,0 % | 57 % | ❌ | Fallback surpeuplé (cascade DONNEUR) |

### Progression vs Q4 initial

| Critère | Q4 initial | R1 | Amélioration |
|---------|-----------|-----|--------------|
| LANGUE COMMUNE | 18 % | **82 %** | +64 pts ✅ |
| LANGUE DORMANTE | 0 % | **66 %** | +66 pts ✅ |
| FEU CROISÉ | 84 % | 84 % | stable ✅ |
| C2 symétrie | 100 % | 100 % | stable ✅ |
| C3 anti-verdict | 0/0/0 | 0/0/0 | stable ✅ |

**La logique canal dominant résout le chevauchement géométrique pour LANGUE COMMUNE (+64 pts) et LANGUE DORMANTE (+66 pts)** — mais le bug rB/rA empêche DONNEUR A/B de fonctionner.

## ✅ Ce qui est acquis (contresignable)

| Élément | Obtenu | Statut |
|---------|--------|--------|
| **C2 symétrie** | 100 % (0 violation, 0 désaccord sim) | ✅ Parfaite |
| **C3 anti-verdict** (ÉLIMINATOIRE) | 0/0/0 | ✅ Aucun % de compatibilité |
| **C4 SHA ×2** | identiques | ✅ |
| **C5 affichage** | 4/4 | ✅ |
| **D-TYPE** | test minimal PASS | ✅ Nouvelle règle appliquée |
| **D-VÉRITÉ** | 9/9 = 9/9 = 9/9 | ✅ |
| **D-NOMENCLATURE** | 9 labels uniques | ✅ |
| **D-EMO-5 (canal dominant)** | LANGUE COMMUNE 82 %, DORMANTE 66 % | ✅ Amélioration prouvée |

## Fautes d'orchestrateur cumulées : 27

15 + n°15 bis (D-HIST) + n°16 (D-TABLE forces) + n°18 (D-VÉRITÉ) + n°20 (D-TRANSMISSION) + n°21 (D-DENSITÉ) + n°22 (récidive D-TRANSMISSION) + n°23 (D-NOMENCLATURE) + n°24 (D-GÉOMÉTRIE) + n°25 (D-TYPE) + n°26 (S-EMO-Q4-R1-4 code absent) + n°27 (S-EMO-Q4-R1-5 bug rB/rA).

## Publication

Package prêt à publier dans `validation-emotionnelle/validation-emo-q4-r1/`.

## RIO-09

RIO-09 **n'entre pas au RIO** — verdict À CORRIGER. La logique canal dominant (D-EMO-5) améliore significativement les configurations (LANGUE COMMUNE +64 pts, DORMANTE +66 pts), mais le bug rB/rA dans DONNEUR A/B empêche C1 d'atteindre 9/9. **Arbitrage superviseur requis sur S-EMO-Q4-R1-5.**

La vérité du système a primé : D-TYPE a confirmé l'exécutable, la logique canal dominant est prouvée efficace, mais C1 révèle le bug rB/rA que ni le superviseur ni l'exécuteur n'avaient vu à la lecture.

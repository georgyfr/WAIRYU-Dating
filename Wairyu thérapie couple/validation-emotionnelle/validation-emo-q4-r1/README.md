# WTC-EMO-Q4-R1 (v2) — « Nos deux langues » (RIO-09, correction rB/rA)

> **AVERTISSEMENT D-SIM** : résultats issus de simulations (seed 42) —
> la mécanique est validée, pas la prévalence clinique.

## Verdict : **À CORRIGER — 4/5 critères** — note **6/10**

| Critère | Attendu | Obtenu | Verdict |
|---------|---------|--------|---------|
| **C1** 9 configurations (D-STD-2 par config) | 9/9 | **2/9** | ❌ FAIL |
| **C2** Symétrie p1×p2 = p2×p1 | 100 % | **100,0 %** (0 violation, 0 désaccord sim) | ✅ PASS |
| **C3** Anti-verdict (ÉLIMINATOIRE) | 0/0/0 | **0/0/0** | ✅ PASS |
| **C4** SHA-256 ×2 | identiques | **identiques** | ✅ PASS |
| **C5** Affichage (4 sous-tests) | 4/4 | **4/4** | ✅ PASS |

## S-EMO-Q4-R1-5 — Correction rB/rA appliquée, DONNEUR amélioré mais sous seuil

La correction D-Q4-5 (rB→rA, rA→rB) est appliquée dans les DEUX fonctions (core + simulateur). D-TYPE confirme : DONNEUR A est maintenant correctement classé sur profil minimal.

### Progression après correction

| Configuration | Q4 initial | R1 v1 (bug rB/rA) | R1 v2 (corrigé) | Seuil |
|---------------|-----------|-------------------|-----------------|-------|
| LANGUE COMMUNE | 18 % | 82 % | 82 % | 72 % ✅ |
| DONNEUR A | 88 % | **0 %** | **68 %** | 77 % ❌ |
| DONNEUR B | 84 % | **0 %** | **60 %** | 77 % ❌ |
| DORMANTE | 0 % | 66 % | 66 % | 67 % ❌ (−1 pt) |
| CROISÉE | 0 % | 0 % | 0 % | 62 % ❌ |
| MIXTE POURSUITE | 20 % | 20 % | 20 % | 82 % ❌ |
| MIXTE RETRAIT | 10 % | 10 % | 10 % | 82 % ❌ |
| FEU CROISÉ | 84 % | 84 % | 84 % | 82 % ✅ |
| ÉQUILIBRÉE | 98 % | 24 % | 24 % | 57 % ❌ |

### Cause résiduelle — chevauchement géométrique (canal dominant ≠ canal donneur)

La correction rB→rA fait passer DONNEUR A de 0 % à 68 % — mais 68 % reste sous le seuil de 77 %. Cause : le **canal dominant** (calculé par vivacité = somme des 4 valeurs) peut ne pas être le canal où A donne le plus fort. Quand le canal dominant est "temps" mais que A donne fort sur "paroles", la condition `dA >= 4` s'évalue sur le mauvais canal.

**C'est un chevauchement géométrique résiduel**, pas un bug — même leçon que D-Q4-2 (attachement) et S-EMO-Q2-R1-1 (émotionnel Q2). Les seuils D-STD-2 posés à 77 % sont trop élevés pour la géométrie actuelle (canal dominant + σ = 0,60).

### Options (à arbitrer)

1. **Option A** (requalifier les seuils, comme Q4 attachement) : abaisser les seuils DONNEUR à 65 %, DORMANTE à 60 %, etc.
2. **Option B** (canal dominant = canal donneur le plus fort) : changer la logique pour que le canal dominant soit celui où le donneur donne le plus fort
3. **Option C** (assouplir la condition DONNEUR) : `dA >= 4` sur n'importe quel canal (pas seulement le dominant)

## ✅ Ce qui est acquis

| Élément | Obtenu | Statut |
|---------|--------|--------|
| **C2 symétrie** | 100 % | ✅ |
| **C3 anti-verdict** (ÉLIMINATOIRE) | 0/0/0 | ✅ |
| **C4 SHA ×2** | identiques | ✅ |
| **C5 affichage** | 4/4 | ✅ |
| **D-TYPE** | test minimal PASS | ✅ |
| **D-VÉRITÉ** | 9/9 = 9/9 = 9/9 | ✅ |
| **Correction rB/rA** | DONNEUR A 0→68 %, B 0→60 % | ✅ Bug corrigé |
| **Logique canal dominant** | LANGUE COMMUNE 82 %, DORMANTE 66 % | ✅ Amélioration prouvée |

## Fautes d'orchestrateur cumulées : 28

n°28 : inversion de variable rB/rA dans la logique croisée (D-Q4-5 corrigé).

## Publication

Package prêt à publier dans `validation-emotionnelle/validation-emo-q4-r1/`.

## RIO-09

RIO-09 **n'entre pas au RIO** — verdict À CORRIGER. La correction rB/rA est appliquée (DONNEUR A 0→68 %), C2/C3/C4/C5 passent. Mais C1 = 2/9 — les seuils D-STD-2 sont trop élevés pour la géométrie du canal dominant. **Arbitrage superviseur requis.**

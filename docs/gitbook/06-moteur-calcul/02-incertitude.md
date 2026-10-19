# Incertitude de mesure : SEM, CI90, hiérarchie de faces

> Chaque score WTC est un score **bruité**. Le système ne cache pas ce
> bruit : il le calcule, l'affiche, et force les lectures à rester
> conservatrices quand l'incertitude chevauche un seuil.

## Les paramètres de structure d'erreur du registre

| Instrument | SEM | CI90 (±1,64×SEM) | Source du paramètre |
|---|---|---|---|
| Attachement Q1-R1 | **0,195** | ± 0,3198 | R1 recalibré (initial : placeholder 0,25175 → ± 0,41286) |
| Générationnelle EXT-Q1 | **0,2517** | ± 0,4128 | placeholders canon ligne 258 : SD_pop 0,65, α 0,85 |
| Santé mentale (face 4 items) | σ_eff = **0,30** | — (bande exclue à la place) | 0,60/√4 |
| Santé mentale (agrégat 3 faces) | ≈ **0,35** (détresse, 1 item/face) · ≈ **0,17** (charge, 4 items/face) | — | 0,60/√3 et 0,30/√3 |
| RCI SM-Q5 (SEM_L7) | ≈ **0,252** | — | SE_DIFF/√2 = 0,356/√2 |

## La formule du CI90

```
CI90 = score ± Z90 × SEM        avec Z90 = 1,64
```

Le **seuil de hiérarchie de faces** découle de la même logique : une face
ne « domine » une autre que si l'écart dépasse l'incertitude combinée des
deux scores :

```
écart ≥ 1,64 × √(SE1² + SE2²)

attachement : SE_face = 0,72×√(1−0,72) ≈ 0,38105 → seuil ≈ 0,8836
générationnelle : SE_face = 0,3853 → seuil ≈ 0,8937
```

## La règle conservatrice (L3)

Si le CI90 **chevauche** un seuil de niveau (1,80 / 2,60 / 3,20), la
lecture bascule en « FRONTIÈRE — entre X et Y » et la **décision
conservatrice** est le **niveau le plus bas touché**. Cette règle est
testée exhaustivement : **2820/2820** (EXT-Q1). Sa violation sur 2 cas
(99,8 % au lieu de 100 %) dans **Q1-R1 attachement** a été jugée FAIL et a
motivé le verdict À CORRIGER du package.

## Pourquoi la santé mentale n'utilise pas de CI90

La santé mentale remplace l'IC90 par la **bande exclue [3,10 ; 4,90]** :
au lieu d'affiner l'estimation autour du seuil de crise (4,00), elle
**refuse de trancher** dans la zone où le bruit domine. C'est un choix
d'éthique de mesure : mieux vaut « non tranché » que « faux avec
confiance ». La réconciliation compte ces profils à part :

```
n = VP + FN + VN + FP + dans_bande
500 = 40 + 0 + 408 + 0 + 52     (SM-Q1-R3)
520 = 52 + 0 + 342 + 0 + 126    (SM-Q2, bande sur 2 voies)
```

## Le grain, conséquence directe de l'incertitude

Le nombre d'items par face détermine le pas du score :

- 1 item/face (détresse) → pas 1/3 — les bornes 2,50/3,50 sont
  **inatteignables** ;
- 4 items/face (charge) → pas 1/12 — les bornes sont **exactement
  atteignables** ((3,3,4,4) → 3,50).

C'est pourquoi les pièges « FRONTIÈRES » de SM-Q4 utilisent des items
fixes côté charge uniquement, et pourquoi la SPEC SM-Q2 exclut la
géométrie à 3 items (« 4,0 + 3σ_eff = 5,04 > plafond 5,0 : infaisable »).

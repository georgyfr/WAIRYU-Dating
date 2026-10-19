# Dimension Santé mentale — géométrie commune

> La dimension santé mentale (RIO-11 → RIO-15) porte les enjeux les plus
> élevés du programme (crise, orientation). Sa géométrie de mesure est
> commune aux cinq packages — la comprendre éclaire tous les seuils.

## La structure d'erreur (constantes partagées)

| Constante | Valeur | Rôle |
|---|---|---|
| `SIGMA_ITEM` | **0,60** | bruit d'un item simulé (D-PARAM) |
| `SIGMA_EFF` (face 4 items) | **0,60/√4 = 0,30** | bruit d'un score de face |
| `TROIS_SIGMA` | **0,90** | 3 × σ_eff — la demi-largeur de la bande exclue |
| Bande exclue | **[3,10 ; 4,90]** = [4,0 − 0,90 ; 4,0 + 0,90] | zone où crise/non-crise est **indécidable par construction** |
| `SEUIL_MID` | **3,00** | milieu d'échelle (D-ÉCHELLE) |
| Seed | **42** partout | reproductibilité (D-EMPREINTE) |

## Pourquoi la bande exclue existe

Le seuil de crise est **4,00**. Un profil dont le vrai μ est à 4,0 produit
un score bruité qui tombe 68 % du temps dans [3,10 ; 4,90]. Juger la crise
sur ces scores serait mesurer le **bruit**, pas la personne. La règle :
**hors bande** seulement — le décompte de sensibilité/spécificité exclut
les profils dans [3,10 ; 4,90], et la réconciliation les compte à part :

```
n = VP + FN + VN + FP + dans_bande
```

## Le grain : pourquoi la détresse et la charge n'ont pas la même précision

| Mesure | Structure | Grain du score | σ_eff agrégat |
|---|---|---|---|
| Détresse (Q1-R3) | 3 faces × **1 item** | pas de **1/3** (0,333) | ≈ 0,35 (0,60/√3) |
| Charge (Q2) | 3 faces × **4 items** | pas de **1/12** (0,0833) | ≈ 0,17 (0,30/√3) |

Conséquence directe (leçon de grain de SM-Q2) : les bornes 2,50/3,50 du
croisement sont **structurellement inatteignables** côté détresse (pas de
1/3 ne peut tomber sur 2,50/3,50) mais **exactement atteignables** côté
charge (3,50 = moyenne de (3,3,4,4) par exemple). Les pièges de simulation
« FRONTIÈRES » exploitent ce grain : items fixes (3,3,4,4) → 3,50 exact.

Pourquoi 4 items par face ailleurs qu'en Q1 ? Justification gravée dans la
SPEC SM-Q2 : *« à 3 items, σ_eff = 0,346 et la borne crise 4,0 + 3σ_eff =
5,04 dépasse le plafond 5,0 : géométrie infaisable »*.

## La crise : trois voies héritées, un filet

```
voie A2     : SM-A2 ≥ 4,0 (surimplication sévère — RIO-12)
voie SM-C1  : SM-C1 ≥ 4,0 (contrôle coercitif — RIO-11)
voie H5     : héritée de RIO-02 (comportement de sécurité)
filet       : 3919 (violences conjugales) / 3114 (détresse psychiatrique)
```

`crise_vraie` est **ancrée sur le μ vrai** du simulateur, jamais sur le
score bruité — la validation mesure la capacité du moteur à retrouver la
vérité, pas à coïncider avec son propre bruit. Le test de frontière
**3,99 → False / 4,00 → True** est exigé sur chaque voie score.

## Le flux entre les cinq quêtes

```
Q1-R3 (détresse) ─┐
                  ├─→ Q4 (croisement 9 configs, bornes 2,50/3,50) ─→ Q5 (pas, palier, RCI)
Q2 (charge)      ─┘                                                        │
Q3 (forces F-S1..F-S6) ←── le pas 🟢 pointe vers la force identifiée         │
Q5 reçoit les voies héritées A2 ∨ SM-C1 ∨ H5 pour le court-circuit ←─────────┘
```

Q4 porte **zéro item nouveau** (arbitrage A2) : il ne lit que les sorties
contresignées de Q1-R3 et Q2. Q5 hérite la table des 9 configurations de Q4
**mot pour mot** et le palier se lit sur la configuration tracée.

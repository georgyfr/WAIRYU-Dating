# Le changement fiable (RCI Jacobson & Truax)

> Le re-test à 8 semaines est une mesure **bruitée**. Le RCI (Reliable
> Change Index, Jacobson & Truax — méthode publiée, citée au registre)
> répond à une seule question : le changement observé dépasse-t-il le
> bruit de la mesure ?

## La formule canonique citée par le programme

```
SE_diff = √2 × SEM ≈ 0,356     (L7 du programme, ligne 263)
```

Le programme fixe la constante `SE_DIFF = 0,356` et en dérive les
seuils de classification, appliqués à **Δ = re_test − base**
(asymétrie temporelle sans exception — l'échange base/re-test inverse
exactement le signe de Δ, testé 150/150 en SM-Q5, 610/610 en EXT-Q2,
0 inversion en EXT-Q3 sur n_rci = 200).

## Les trois implémentations du registre

| Package | SE_diff | FIABLE | SUGGESTION | Spécificité |
|---|---|---|---|---|
| Q1-R1 attachement | √2×0,195 ≈ **0,27577** | \|Δ\| ≥ **0,45227** (= 1,64×SE_diff) | ≥ **0,41** | seuil Z sur la diff |
| SM-Q5 santé mentale | **0,356** | \|Δ\| ≥ **0,58** | ≥ **0,41** | seuils L7 verbatim |
| EXT-Q1 / EXT-Q3 | √2×0,2517 ≈ **0,356** | \|Δ\| ≥ **0,58** | ≥ **0,41** | idem SM-Q5 |

(Run initial Q1 attachement : SE_diff ≈ 0,35598 / FIABLE ≈ 0,58381 —
resserré par la révision R1 sur la structure d'erreur recalibrée.)

Les bornes sont **incluses** : |Δ| = 0,58 pile → FIABLE ; |Δ| = 0,41 pile
→ SUGGESTION. Testé pile : SM-Q5 (120 FIABLE pile 0,58 · 60 SUGGESTION
pile 0,41 · 60 BRUIT), EXT-Q3 (frontières 9/14 = **40/40 exact**).

## L'agrégation en ensemble

- **SM-Q5** : statut d'ensemble = **max des statuts des deux rives**
  (BRUIT < SUGGESTION < FIABLE) → « UN CHANGEMENT FIABLE » · « UNE PISTE
  À CONFIRMER » · « DANS LE BRUIT DE LA MESURE ».
- **EXT-Q3** : ensemble de rive = **max des 3 statuts d'axes** (H, L, C) ;
  **jamais de comparaison inter-rives**.

## La signification clinique (la deuxième question du RCI)

Un changement fiable n'est pas forcément cliniquement significatif. La
signification = **traversée d'une borne** :

```
traverse_borne_de : niveau_de(base) != niveau_de(re_test)
```

avec les bornes héritées — **une mesure, un rôle** :

| Contexte | Bornes | Héritage |
|---|---|---|
| SM-Q5 (détresse/charge) | 2,50 / 3,50 | croisement SM-Q4 |
| EXT-Q3 axe H | 2,50 / 3,50 | croisement EXT-Q2 |
| EXT-Q3 axes L/C | 1,80 / 2,60 / 3,20 | niveaux L3 EXT-Q1 |

Réel : SM-Q5 **112 traversées de borne** ; EXT-Q3 **658 traversées** ;
EXT-Q1 **56 traversées**.

## Ce que le RCI ne fait pas

- **Aucune formule z étendue** (moyennes/écarts-types des deux
  administrations, méthodologie Jacobson-Truax complète) : absent du code —
  la classification est purement par seuils. Documenté comme tel.
- **Aucun verdict de rémission** : les lexiques « rémission / guéri /
  échoué » sont interdits (C6 de SM-Q5, 0 occurrence).
- **Jamais de sanction** : un Δ dans le bruit est « DANS LE BRUIT DE LA
  MESURE » — constat, pas échec.

## La précision géométrique du re-test simulé

Le re-test est simulé avec le bruit du programme (SEM_L7 ≈ 0,252) ou de
façon **déterministe** pour tester les frontières : SM-Q5 G12 pose
Δ = ±k/12 en grain exact (7/12 ≈ 0,583 → FIABLE ; 5/12 ≈ 0,417 →
SUGGESTION ; 4/12 ≈ 0,333 → BRUIT) avec ε = 0 — **40/40 exact**.

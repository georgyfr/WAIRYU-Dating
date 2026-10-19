# Le moteur de calcul — index

> Les six pages de cette partie documentent les mécanismes transversaux qui
> donnent aux lectures WTC leurs « véritables réponses » : comment
> l'incertitude est calculée, comment les seuils sont posés après mesure du
> plafond, comment un changement est déclaré fiable, comment les percentiles
> et les boucles sont calculés, et comment l'empreinte SHA-256 garantit la
> reproductibilité.

## Les cinq mécanismes

1. **[Incertitude de mesure](02-incertitude.md)** — SEM, CI90, Z90 = 1,64,
   hiérarchie de faces (1,64 × √(SE₁² + SE₂²)), lecture conservatrice.
2. **[Bornes D-STD / D-STD-2](03-dstd2.md)** — le plafond mesuré avant le
   seuil ; par configuration ; calibrages binomiaux ; les seuils réels des
   18 packages.
3. **[Le changement fiable (RCI)](04-rci.md)** — Jacobson & Truax :
   SE_diff = √2 × SEM ; les trois implémentations du registre (0,452 /
   0,58-0,41 / ensemble max).
4. **[Percentiles, boucles, styles](05-percentiles-boucles.md)** — mid-rank,
   boucle ≥ 30 points, styles dissimulables, correction de style L6.
5. **[Empreinte, seed 42, vérité croisée](06-empreinte-simulation.md)** —
   SHA-256 ×2, populations synthétiques, pas_vrai, réconciliation n =
   VP+FN+VN+FP+bande.

## Le principe directeur

Aucun seuil WTC n'est un nombre « choisi » : chaque seuil est soit
- **hérité d'un cadre cité** (RCI Jacobson & Truax ; le 30 points de la
  boucle poursuite-retrait du programme, ligne 262) ;
- **calculé depuis la géométrie** (plafond − 3 pts D-STD ; p̂ − 2,5σ̂
  binomial ; p̂ ± 3σ) ;
- ou **posé au milieu d'échelle** (3,00 sur l'échelle 1-5 — D-ÉCHELLE).

Et chaque seuil est **testé aux frontières** : 2,49/2,50/3,49/3,50 →
FAIBLE/MOYEN/MOYEN/ÉLEVÉ ; 3,99/4,00 → crise False/True ; 3,25/3,50 →
force False/True ; |Δ| = 0,58 pile → FIABLE ; |Δ| = 0,41 pile → SUGGESTION.

# Empreinte SHA-256, seed 42 et vérité croisée

> Les trois garanties mécaniques qui rendent une lecture WTC
> reproductible : la même entrée produit la même sortie (seed), la même
> sortie produit la même empreinte (SHA-256), et le moteur est confronté à
> une vérité qu'il ne partage pas (vérité croisée).

## L'empreinte SHA-256 (D-EMPREINTE)

**Ce qui est haché** : le contenu des résultats — le dict des résultats
**sans** les champs d'horodatage (`sha256_run`, `C4` exclus de l'objet
haché), sérialisé en JSON trié (`sort_keys`, `ensure_ascii=False`).

**Le protocole** :
1. exécution 1 → sha1 ; exécution 2 → sha2 ; **sha1 == sha2 exigé** ;
2. publication sur GitHub ;
3. **auto-audit origin** : clone frais → ré-exécution → l'empreinte doit
   être **reconstruite depuis ce qui est publié** (reproduction
   inter-jours prouvée pour EXT-Q3 : JSON 19/10 ≡ JSON publié 18/10,
   byte-identique) ;
4. l'audit pré-contresignature **reconstruit l'empreinte depuis le JSON
   publié** (indépendamment du générateur) — c'est la preuve que le SHA
   porte bien le contenu, pas un artefact du script.

**Pourquoi le JSON et les figures sont absents des diffs de
contresignature** : si la gravure (ligne de statut) change le rapport sans
toucher aux résultats, le JSON/figures byte-identiques **prouvent** que
l'empreinte n'a pas bougé (D-EMPREINTE).

## La seed 42 et ses exceptions

| Contexte | Seed |
|---|---|
| Tous les simulateurs (populations, bruit) | **42** (numpy PCG64) |
| Monte-Carlo bornes D-STD Q3-R1 (1M/groupe) | **20261015** |
| Calibration p̂ EXT-Q2 (10 000/groupe) | **42** |
| Passations gelées de l'app (trames) | 211427 · 210427 · 222427 · 251427 |

Une seed fixe n'est pas un artifice : c'est ce qui rend la **réconciliation
exacte** possible — le même univers simulé, profil par profil, aux deux
exécutions.

## La vérité croisée (D-VÉRITÉ)

Le simulateur implémente la classe **vraie** de chaque profil
indépendamment du moteur (`pas_vrai`, conditions vraies parallèles). La
validation exige que le moteur retrouve la vérité **à 100 %** :

| Package | Vérité croisée |
|---|---|
| Q3-R1 attachement | 400/400 (100,00 %) |
| émo-Q1 / émo-Q3 | 475/475 |
| SM-Q1-R3 | 500/500 |
| SM-Q2 / SM-Q3 | 520/520 (Q3 : table de vérité 520/520, 0 écart de grain) |
| SM-Q4 | 600/600 (conformité table 506/550 sur les non-crise) |
| SM-Q5 | 540/540 |
| EXT-Q1 / EXT-Q2 / EXT-Q3 | 520/520 · 650/650 · 650/650 |

Plus le **test anti-invention** : 0 force produite sans condition remplie
(émo-Q3 : 0 invention sur 475 profils), et l'**inventaire croisé** des
labels (faute n°18 : 4 labels moteur = 4 labels table, 0 orphelin).

## La réconciliation : aucun profil perdu, aucun profil double

```
n = VP + FN + VN + FP + dans_bande
```

Chaque rapport publie l'équation fermée (500 = 40+0+408+0+52 ; 520 =
52+0+342+0+126 ; 600/600 ; 540/540 ; 650/650). Une réconciliation qui ne
ferme pas est éliminatoire — c'est le compteur d'intégrité de l'univers
simulé.

## Les grains d'incertitude assumés

Le système documente lui-même ses limites géométriques : erratum 580→500
(SM-Q1-R3, leftover R2), divergence de note (émo-Q4-R3 : README 6/10 vs
rapport 8/10), divergence de seuil (commentaire 0,8837 vs formule
0,8836). Ces divergences sont **conservées et visibles** — voir la
partie VII.

# Les critères de validation C1-C7

> Chaque package de validation est jugé par une liste de critères posée dans la
> SPEC **avant** la production. Les critères éliminatoires (sens/spécificité de
> crise, anti-fabrication, empreinte) font échouer le package à eux seuls.

## Le canon des critères

Les critères suivants reviennent dans tous les packages, avec des variantes
par type de quête :

| Critère | Nom | Ce qu'il vérifie | Éliminatoire ? |
|---|---|---|---|
| C1 | D-VÉRITÉ / D-TABLE | Le moteur retrouve la vérité croisée du simulateur (100 % attendu) ; les tables sont des miroirs exacts du code | Oui |
| C2 | D-ÉCHELLE / D-CONFIRMATION | Comportement déterministe aux frontières d'échelle ; pour les croisements : pureté + anti-inversion | Oui (croisements) |
| C3 | D-CRISE / D-DENSITÉ / D-STD-2 | Sensibilité **et** spécificité des voies de crise hors bande exclue ; densité des forces ; conformité aux bornes par configuration | Oui |
| C4 | D-EMPREINTE | SHA-256 ×2 identiques sur le contenu sans horodatage | Oui |
| C5 | Affichage | Figures (1920×1080 @150 DPI), templates verbatim, avertissement D-SIM | Non |
| C6 | 0 pas produit | **Zéro fonction de prescription** dans un package de mesure — le système mesure, il ne prescrit pas | Non |
| C7 | Anti-fabrication | SILENCIEUSE mot pour mot, override crise, 0 force inventée, 0 sanction | Oui |

## Exemples réels de verdicts

### SM-Q1-R3 (RIO-11) — VALIDÉ 6/6, note 10/10
- C1 : match 100,0 % (500/500) sur 9 faces × 9 labels
- C3 : **sens 100,0 %, spécificité 100,0 %** (VP=40, FN=0, VN=408, FP=0 hors bande)
- C4 : SHA ×2 `bb2551dd…`
- C6 : 0 pas produit

### SM-Q4 (RIO-14) — VALIDÉ 7/7
- C1 : 9/9 configurations démontrées + D-TABLE + grille croisée 100 %
- C2 : anti-inversion **6 flips / 3 stables** (échanger détresse/charge change
  bien la configuration quand les niveaux diffèrent)
- C3 : 9 bornes D-STD-2 distinctes respectées (conformité 506/550 non-crise)
- C6 : 20 fonctions, **0 pas**

### SM-Q5 (RIO-15) — VALIDÉ 7/7
- C1 : grille 14 jours × 540 couples + D-TABLE 8 sous-tests
- C6 : **0 sanction / 0 rémission** — les interdits lexicaux (« rémission »,
  « guéri », « échoué », « sanctionné ») sont absents de tout produit
- C7 : court-circuit de crise 50/50, zone calme 45/50, **0 pas inventé**

## La mécanique de réconciliation

Chaque rapport publie une **équation de réconciliation** qui ferme le compte
des profils :

```
n = VP + FN + VN + FP + dans_bande
```

Exemples réels :
- SM-Q1-R3 : `500 = 40 + 0 + 408 + 0 + 52`
- SM-Q2 : `520 = 52 + 0 + 342 + 0 + 126`
- SM-Q4 : `600 = … + 50 (crise héritée) + …` (conformité table de vérité
  évaluée sur les 550 non-crise : 506/550)

Une réconciliation qui ne ferme pas est une faute éliminatoire — c'est le
garant mécanique qu'**aucun profil n'a été perdu ni compté deux fois**.

## Le statut « À CORRIGER »

Un verdict **À CORRIGER** n'est pas un échec masqué : il est publié tel quel,
avec la note (ex. 6,5/10), les critères FAIL identifiés, et les signalements
S-* ouverts. La révision (-R1/-R2/-R3) corrige **à la source** (code,
simulateur ou SPEC) et re-réexécute tout — l'empreinte du package révisé
devient l'empreinte de référence. Exemple : émo-Q4 R2→R3 a corrigé la boucle
des bids (asymétrie **interne** au partenaire au lieu de croisée) et fait
passer MIXTE POURSUITE de 18 % à **96 %** de conformité.

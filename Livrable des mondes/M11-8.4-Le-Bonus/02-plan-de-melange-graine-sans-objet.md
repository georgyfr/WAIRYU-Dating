# LIVRABLE 2 — PLAN DE MÉLANGE : SANS-OBJET (1 geste, aucune permutation possible)

> quete : 8.4 « Le bonus » · fiche : 02 — plan de mélange graine sans-objet
> **La mission l'attend ainsi** : « sans-objet (1 geste, aucune permutation possible) ».
> Ce fichier documente le sans-objet au lieu de feindre une course (précédents : 1.7 « Ton
> fonctionnement » — ordre fixe, sans mélange · 4.4 bloc invisible — « graine sans-objet » ·
> 2.8 — ordre canonique, sans-objet documenté · 6.5 — plan de passage, graine non tirée).

## Pourquoi le mélange est SANS-OBJET (les quatre fondements)

1. **Un seul geste — aucune permutation possible.** L'outil `melange.py` opère sur des séries
   d'items Likert orientés D/I : il permute des positions pour étaler des effets d'ordre.
   8.4 compte UN geste : il n'existe rien à permuter — une série d'un élément est son propre
   ordre, dans toutes les permutations possibles (il n'y en a qu'une).
2. **Le format est un geste, hors Likert.** La docstring de l'outil réserve le c5
   « sans-objet hors Likert » : le jeu des 20 pépites n'est pas une échelle d'accord, il n'a
   ni orientation à recoder, ni désirabilité à étaler, ni biais de position à protéger
   (précédent 6.5 : « le format n'a pas de surface à mélanger »).
3. **Rien à protéger d'un effet d'ordre.** Le mélange protège la mesure d'une série
   d'énoncés contre les effets de position ; un choix unique, daté, posé une fois, n'a pas
   de position dans une série — sa lecture (SIG-8.4-01, moteur seul) ne dépend pas de l'ordre
   des écrans du jeu.
4. **L'opt-in est un consentement, pas une passation ordonnée.** La personne choisit d'entrer
   dans le jeu, ou pas ; l'invitation s'affiche une fois. Mélanger l'entrée ne protégerait
   rien : il n'y a pas de contenu caché à répartir — un jeu de 30 secondes se présente tel quel.

## Graine : SANS-OBJET (consignée comme la mission l'attend)

| Élément | Valeur |
|---|---|
| Graine | **non tirée** — aucune course, aucune tentative, zéro tirage (précédent 4.4 : « graine : sans-objet ») |
| Ordinal théorique | **74** ((8−1)×10+4 — la convention de décade suit le CODE gelé 8.x) : la place est gardée ; si un jour une déclinaison mixée de 8.4 était conçue, la graine serait 210427 + 1000 × 74 = **284427** — collision vérifiée nulle au dépôt, sans que ce tirage soit opéré |
| Config `ci/quetes/8.4.json` | **sans-objet** — aucune config créée ni attendue de cette session |
| Course canonique | **sans-objet** — rien à mélanger ; aucune archive `ci/resultats-melange/8.4.json` attendue |
| c1-c6 | **sans-objet** — 1 geste (c1/c4 : aucune dimension répétée — rien à contraindre) · 0 trame (c2/c3) · hors Likert (c5, docstring de l'outil) · 1 élément (c6 : la passation EST l'ordre des codes) |

## L'ordre du geste (artefact de référence — FIXE par design)

| Pos | 1 |
|---|---|
| Code | **Q8.4-01** |
| Séquence d'écrans du jeu | invitation (libellé verbatim, 01) → les 3 choix (garder / offrir à un match / partager entre plusieurs matchs) → confirmation (l'avoir mis à jour) |
| Durée | 30 secondes |
| Répétition | une seule fois par compte — une seule invitation, silence après |

> La séquence d'écrans ci-dessus est de l'**UI**, pas du mélange : elle est fixe par design
> (30 secondes, trois choix d'égale dignité — aucune présentation n'a d'effet de position à
> corriger, les trois boutons étant d'égale mise en avant). Toute évolution de la séquence =
> Fiche de Mutation. Aucun re-tirage n'existe pour cette quête — aucun tirage n'a eu lieu.

## Ce que la session principale doit savoir (note de passation)

- Aucune course à rejouer : **le sans-objet est le livrable** (cette fiche en fait foi).
- Si le pipeline de CI exigeait mécaniquement une config pour la quête, elle porterait
  `c5_sans_objet: true` (hors Likert — champ prévu par la docstring de l'outil) et un
  marqueur `melange: sans_objet` — proposition de compatibilité, **À VALIDER PAR LE COMITÉ** ;
  aucune config n'est créée par la présente session.
- La graine sans-objet est cohérente avec le statut du geste : un fait mesuré se passe, il ne
  se mélange pas — la protection psychométrique du voyage (les mélanges des échelles) ne
  concerne pas un jeu d'attribution à un seul écran.

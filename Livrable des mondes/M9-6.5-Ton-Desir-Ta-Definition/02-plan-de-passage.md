# LIVRABLE 2 — PLAN DE PASSAGE : MÉLANGE SANS-OBJET (ordre fixe 01→02→03)

> quete : 6.5 « Ton désir, ta définition » · fiche : 02 — plan de passage (mélange sans-objet documenté)
> **La mission l'attend ainsi** : « MÉLANGE : SANS-OBJET — 3 items déclaratifs, ordre de passation
> fixe 01→02→03, graine sans-objet, zéro course ». Ce fichier documente le sans-objet au lieu de
> feindre une course (précédents : 1.7 « Ton fonctionnement » — 02-plan-de-passage, sans mélange ·
> 4.4 bloc invisible — « graine sans-objet, ordinal réservé » · 2.8 — « 02-ordre-canonique,
> sans-objet documenté »).

## Pourquoi le mélange est SANS-OBJET (les quatre fondements)

1. **Le format n'a pas de surface à mélanger.** L'outil `melange.py` opère sur des items Likert
   orientés D/I (sa docstring : c5 « alternance D/I — run max 2, **sans-objet hors Likert** ») ;
   or les 3 items de 6.5 sont des choix-déclaratifs **sans orientation** (aucun recodage 6−r n'a
   de sens sur une identité déclarée). Il n'existe ni orientations à alterner, ni dimensions à
   espacer au titre d'un biais d'ordre mesurable.
2. **La séquence est narrative, pas psychométrique.** L'ordre 01→02→03 (identité → dignité →
   évolution) est un **chemin de parole** : on dit qui l'on est, puis que cela se respecte, puis
   que cela peut bouger. Le déranger ne protégerait pas une réponse — il briserait un
   accompagnement. C'est le même arbitrage que 1.7 (l'ordre suit la séquence de consentement).
3. **Il n'y a rien à dissimuler ni à répartir.** Le mélange protège contre les effets de
   position sur des échelles d'accord ; une définition d'identité n'a pas d'effet de
   désirabilité à étaler : chaque option est déclarée, pas notée.
4. **Le silence reste une réponse pleine.** À chaque item, la personne peut passer (02/03 :
   « Je ne souhaite pas le dire ») — un ordre fixe rend ce passage prévisible et apaisé,
   tandis qu'un ordre tiré ferait de chaque écran une surprise. La prévisibilité est une
   mesure d'inclusion, pas un défaut.

## Graine : SANS-OBJET (consigné comme la mission l'attend)

| Élément | Valeur |
|---|---|
| Graine | **non tirée** — aucune course, aucune tentative, zéro tirage (précédent 4.4 : « graine : sans-objet ») |
| Ordinal de la quête | **55** ((6−1)×10+5) — **réservé, non utilisé** (la convention de décade garde la place ; si un jour une déclinaison mixée de 6.5 était conçue, la graine serait 210427 + 1000 × 55 = **265427** — collision vérifiée nulle au dépôt, sans que ce tirage soit opéré) |
| Config `ci/quetes/6.5.json` | **sans-objet** — aucune config créée ni attendue de cette session (interdit de mission respecté : aucune config touchée) |
| Course canonique | **sans-objet** — rien à mélanger ; aucune archive `ci/resultats-melange/6.5.json` attendue |
| c6 (passation ≠ ordre des codes) | **sans-objet par design** — l'ordre de passation EST l'ordre des codes 01→02→03 : la contrainte s'applique aux courses de mélange ; ici il n'y a rien à mélanger (précédent 1.7 : ordre fixe documenté, sans mélange) |
| c1-c5 | **sans-objet** — 0 trame (c2/c3) · 1 item par dimension (c1/c4 : aucune dimension ne se répète — rien à contraindre) · hors Likert (c5, docstring de l'outil) |

## Ordre de passation (artefact de référence — FIXE)

| Pos | 1 | 2 | 3 |
|---|---|---|---|
| Code | **Q6.5-01** | **Q6.5-02** | **Q6.5-03** |
| Item | Mon désir est… | Ma façon de vivre le désir m'appartient et se respecte. | Mon désir peut évoluer avec le temps, les rencontres, la confiance. |
| Geste | l'identité | l'assomption | l'évolution |
| Rôle | la personne se dit | la personne se respecte | la personne se laisse le devenir |

> L'ordre de passation est **FIXE et définitif** : toute évolution (déclinaison mixée, ajout
> d'options) passe par une Fiche de Mutation + verdict comité. Aucune re-tirage n'existe pour
> cette quête — il n'y a jamais eu de tirage.

## Ce que la session principale doit savoir (note de passation)

- Aucune course à rejouer : **l'ordre fixe est le livrable** (cette fiche en fait foi).
- Si le pipeline de CI exigeait mécaniquement une config pour la quête, elle porterait
  `c5_sans_objet: true` (hors Likert — champ prévu par la docstring de l'outil) et un marqueur
  `melange: sans_objet` — proposition de compatibilité, **À VALIDER PAR LE COMITÉ** ; aucune
  config n'est créée par la présente session (interdit de mission).
- La stabilité de l'ordre est un engagement produit : deux membres qui répondent le même jour
  voient les trois écrans dans le même ordre — l'inclusion ne se tire pas au sort.

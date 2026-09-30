# LIVRABLE 2 — PLAN DE MÉLANGE : SANS-OBJET (ordre fixe — scénarios fixes)

> quete : 8.2 « Et toi, tu ferais quoi ? » · fiche : 02 — plan de mélange (sans-objet documenté)
> **La mission l'attend ainsi** : « ordre fixe documenté (scénarios fixes — graine sans-objet, pas de
> course) ». Ce fichier documente le sans-objet au lieu de feindre une course (précédents : 1.7 « Ton
> fonctionnement » — ordre fixe sans mélange · 4.4 bloc invisible — « graine sans-objet, ordinal
> réservé » · 2.8 — sans-objet documenté · 6.5 — plan de passage, « il n'y a jamais eu de tirage »).

## Pourquoi le mélange est SANS-OBJET (les cinq fondements)

1. **Le format n'a pas de surface à mélanger.** L'outil `melange.py` opère sur des items Likert
   orientés D/I (sa docstring : c5 « alternance D/I — run max 2, **sans-objet hors Likert** ») ; or
   les 6 dilemmes sont des choix forcés à 2 options **sans orientation** (aucun recodage n'a de sens
   sur un choix : l'option A d'un dilemme n'est ni « directe » ni « inversée », elle est l'un des deux
   pôles). Il n'existe ni orientations à alterner, ni échelle d'accord à protéger d'un effet de
   désirabilité.
2. **Les pôles ne sont pas des dimensions mesurées item par item.** L'ECD se calcule sur le PROFIL
   cumulé des 6 dilemmes confronté aux valeurs déclarées 2.1 — pas sur des positions intra-dimension
   à espacer. Les contraintes c1 (dimensions consécutives) et c4 (distance intra-dimension) n'ont pas
   d'objet : chaque angle n'a qu'UN item, aucune dimension ne se répète.
3. **L'ordre des 6 angles est une dramaturgie de vie à deux, pas un tirage à protéger.** L'arc
   (tenir une promesse → dire une vérité → partager l'argent → donner le temps → garder ou dire un
   secret → choisir un risque) monte en intimité : il commence au plus anecdotique et finit au plus
   engageant. Le déranger ne protégerait pas une réponse — il briserait l'accompagnement (précédent
   6.5 : « un chemin de parole, pas une échelle d'accord »).
4. **La passation à deux exige un ordre stable.** Deux membres répondent « en même temps » de leur
   côté : la révélation mutuelle se joue dilemme par dilemme. Un ordre identique pour les deux rend
   la révélation alignée et la conversation naturelle — l'inclusion ne se tire pas au sort
   (précédent 6.5 : « deux membres qui répondent le même jour voient les mêmes écrans »).
5. **Le camouflage n'existe pas ici.** Le mélange sert aussi à rendre une passation imprévisible quand
   des trames se cachent parmi des items carte (indiscernabilité Partie 0) — 8.2 n'héberge AUCUNE
   trame : les 6 énoncés sont au dépôt, rien à dissimuler, rien à répartir.

## Graine : SANS-OBJET (consigné comme la mission l'attend)

| Élément | Valeur |
|---|---|
| Graine | **non tirée** — aucune course, aucune tentative, zéro tirage (précédent 4.4 : « graine : sans-objet ») |
| Ordinal de la quête | **72** ((8−1)×10+2) — **réservé, non utilisé** (la convention de décade garde la place ; si un jour une déclinaison mixée de 8.2 était conçue, la graine serait 210427 + 1000 × 72 = **272427** — collision vérifiée nulle au dépôt, sans que ce tirage soit opéré) |
| Config `ci/quetes/8.2.json` | **sans-objet** — aucune config créée ni attendue de cette session (interdit de mission respecté : aucune config touchée) |
| Course canonique | **sans-objet** — rien à mélanger ; aucune archive `ci/resultats-melange/8.2.json` attendue |
| c6 (passation ≠ ordre des codes) | **sans-objet par design** — l'ordre de passation EST l'ordre des codes 01→06 : la contrainte s'applique aux courses de mélange ; ici il n'y a rien à mélanger |
| c1 / c4 | **sans-objet** — 1 item par angle (aucune dimension ne se répète : rien à contraindre) |
| c2 / c3 | **sans-objet** — 0 trame hébergée |
| c5 | **sans-objet** — hors Likert (docstring de l'outil) |

## Ordre de passation (artefact de référence — FIXE)

| Pos | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| Code | **Q8.2-01** | **Q8.2-02** | **Q8.2-03** | **Q8.2-04** | **Q8.2-05** | **Q8.2-06** |
| Angle | promesse vs opportunité | honnêteté vs tendresse | argent partagé | temps donné vs temps promis | loyauté vs tolérance | confort vs risque ensemble |
| Rôle | le choix qui engage peu | le mot qui protège ou dit vrai | l'argent qui partage | le temps qui manque | le secret qui pèse | le risque qui construit |

> L'ordre de passation est **FIXE et définitif** : toute évolution (dilemmes saisonniers, déclinaison
> à trois options) passe par une Fiche de Mutation + verdict comité. Aucun re-tirage n'existe pour
> cette quête — il n'y a jamais eu de tirage.

## Ce que la session principale doit savoir (note de passation)

- Aucune course à rejouer : **l'ordre fixe est le livrable** (cette fiche en fait foi).
- Si le pipeline de CI exigeait mécaniquement une entrée pour la quête, elle porterait
  `melange: sans_objet` + `ordre: fixe` (champs prévus par la fiche de computation 06) — proposition
  de compatibilité, **À VALIDER PAR LE COMITÉ** ; aucune config n'est créée par la présente session.
- La stabilité de l'ordre est un engagement produit à deux : les deux membres de chaque match répondent
  la même séquence — la révélation mutuelle se lit dans le même ordre, dilemme par dilemme.

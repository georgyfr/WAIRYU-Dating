# LIVRABLE 2 — PLAN DE MÉLANGE : SANS-OBJET (ordre fixe — positions {1, 2, 3})

> quete : 8.3 « Le refus » · fiche : 02 — plan de mélange (sans-objet documenté)
> **La mission l'attend ainsi** : « ordre fixe (3 scénarios, positions {1,2,3}), graine sans-objet ». Ce
> fichier documente le sans-objet au lieu de feindre une course (précédents : 1.7 — ordre fixe sans
> mélange · 4.4 — « graine sans-objet, ordinal réservé » · 2.8 — sans-objet documenté · 6.5 — plan de
> passage · 8.2 — scénarios fixes, sans-objet).

## Pourquoi le mélange est SANS-OBJET (les cinq fondements)

1. **Le format n'a pas de surface à mélanger.** L'outil `melange.py` opère sur des items Likert orientés
   D/I (sa docstring : c5 « alternance D/I — run max 2, **sans-objet hors Likert** ») ; or les 3 scénarios
   sont des choix forcés parmi 4 réactions **sans orientation** (aucun recodage n'a de sens sur un choix
   de réaction). Aucune échelle d'accord, aucun effet de désirabilité à étaler.
2. **Chaque position est unique — rien ne se répète.** Trois scénarios, trois positions : les contraintes
   c1 (dimensions consécutives) et c4 (distance intra-dimension) n'ont pas d'objet — aucune dimension ne
   se répète, il n'existe aucune adjacence à éviter.
3. **L'ordre est une escalade pédagogique — et elle est FIXE par design.** Recevoir un non (position 1) →
   donner un non (position 2) → tenir son non face à un refus réitéré (position 3) : le chemin va du plus
   accessible au plus exigeant. Le déranger ne protégerait pas une réponse — il briserait l'accompagnement
   (précédent 6.5 : « un chemin de parole, pas une échelle d'accord »).
4. **La lecture moteur se fait par scénario, pas par position.** Le signal COC (SIG-8.3-01) lit la
   DISTRIBUTION des réactions de chaque scénario — un ordre invariant rend les distributions comparables
   d'une personne à l'autre et d'un match à l'autre. Un ordre tiré n'ajouterait rien : il dégraderait la
   comparabilité sans protéger quoi que ce soit (les scènes n'ont pas d'effet de désirabilité ordonné —
   aucune « réponse socialement attendue » à l'échelle).
5. **Rien à dissimuler côté position.** Le mélange sert aussi à rendre imprévisible une passation où des
   trames se cachent parmi des items carte (indiscernabilité Partie 0) — ici la quête ENTIÈRE est une
   quête-trame : il n'existe aucun voisin carte à protéger, et l'ordre des scènes n'infère rien sur la
   nature des items (tous trois sont des trames).

## Graine : SANS-OBJET (consigné comme la mission l'attend)

| Élément | Valeur |
|---|---|
| Graine | **non tirée** — aucune course, aucune tentative, zéro tirage (précédent 4.4 : « graine : sans-objet ») |
| Ordinal de la quête | **73** ((8−1)×10+3) — **réservé, non utilisé** (la convention de décade garde la place ; si un jour une déclinaison mixée de 8.3 était conçue, la graine serait 210427 + 1000 × 73 = **273427** — collision vérifiée nulle au dépôt, sans que ce tirage soit opéré) |
| Config `ci/quetes/8.3.json` | **sans-objet** — aucune config créée ni attendue de cette session (interdit de mission respecté : aucune config touchée) |
| Course canonique | **sans-objet** — rien à mélanger ; aucune archive `ci/resultats-melange/8.3.json` attendue |
| c6 (passation ≠ ordre des codes) | **sans-objet par design** — l'ordre de passation EST l'ordre des codes T58→T59→T60 : la contrainte s'applique aux courses de mélange ; ici il n'y a rien à mélanger |
| c1 / c4 | **sans-objet** — 1 item par position (aucune dimension ne se répète : rien à contraindre) |
| c5 | **sans-objet** — hors Likert (docstring de l'outil) |
| c2 / c3 | **sans-objet** — pas de mélange : la quête-trame intégrale ne s'appuie sur aucun bloc uniforme à répartir |

## Ordre de passation (artefact de référence — FIXE)

| Pos | 1 | 2 | 3 |
|---|---|---|---|
| Code | **Q8.3-T58** | **Q8.3-T59** | **Q8.3-T60** |
| Angle (verbatim mission) | le non que tu reçois — comment tu le reçois | le non que tu donnes — comment tu le formules | le non qui persiste — ce que tu fais après le second |
| Geste d'assertivité | accueillir un non | poser un non | tenir son non |
| Escalade pédagogique | le plus accessible | le plus engaged | le plus exigeant |

> L'ordre de passation est **FIXE et définitif** : toute évolution (scène ajoutée, permutation des
> positions) passe par une Fiche de Mutation + verdict comité. Aucun re-tirage n'existe pour cette
> quête — il n'y a jamais eu de tirage.

## Ce que la session principale doit savoir (note de passation)

- Aucune course à rejouer : **l'ordre fixe est le livrable** (cette fiche en fait foi).
- Si le pipeline de CI exigeait mécaniquement une entrée pour la quête, elle porterait
  `melange: sans_objet` + `ordre: fixe` + `positions: [1, 2, 3]` (champs prévus par la fiche de
  computation 06) — proposition de compatibilité, **À VALIDER PAR LE COMITÉ** ; aucune config n'est
  créée par la présente session.
- La stabilité de l'ordre est un engagement produit à deux : les deux membres répondent la même séquence
  (1→2→3) — la conversation d'assertivité se déroule scène par scène, dans le même ordre des deux côtés.

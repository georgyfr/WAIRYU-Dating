# LIVRABLE 2 — PLAN DE MÉLANGE (graine réelle 236427)

> Résultat RÉEL de l'outil `ci/outils/melange.py` (graine 236427, 1 tentative, **0 échange**).
> Rejeu indépendant vérifié à l'identique — **5 passes rejouées : sorties identiques octet pour
> octet** (mission V9 : 5 passes, rejeu réel affiché).

## Graine dérivée (convention mission V9 — lecture concaténée)

- **Graine : 210427 (graine-mère du Socle) + 1000 × ordinal 26 = 236427.**
- Convention (doctrine mission V9) : ordinals en lecture CONCATÉNÉE de la quête — 3.1 → 21 ·
  3.2 → 22 · 3.3 → 23 · 3.4 → 24 · 3.5 → 25 · 3.6 → 26 · 3.7 → 27 (série M4 complète).
- **Aucune collision** : 236427 n'a jamais été attribuée (ni active, ni retirée).
- **Aucun re-tirage** : la graine 236427 est issue du premier tirage (tentative 1).

```
GRAINE .................. 236427 (figée, reproductible)
ALGORITHME .............. Fisher-Yates seedé sur [Q3.6-P1 … Q3.6-P8]
                          (0 échange de réparation — tirage déjà optimal)
ORDRE DE PASSATION ...... la séquence ci-dessous (JAMAIS l'ordre des codes)
PARTICULARITÉS .......... 8 paires d'images — TÂCHE (hors Likert)
                          c5 SANS-OBJET par config (pas d'orientation D/I)
                          c4 sans-objet par config (8 thèmes distincts — 1 item chacun)
                          c1 en bénéficie par construction · c6 actif
                          AUCUNE trame ▲ → c2/c3 sans objet de fait
```

## Séquence d'ordre de passation (artefact de référence — réel)

| Pos | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Paire | P7 | P6 | P1 | P4 | P8 | P3 | P5 | P2 |

Rappel : les codes sont gelés et définitifs ; l'ordre de **passation** est celui du plan de mélange,
jamais l'ordre des codes. Ici la 1ʳᵉ paire vue est Q3.6-P7 (les deux dimanches), la dernière est
Q3.6-P2 (les deux paysages). **La mission V9.F offrait le choix « ordre des paires seedé OU
séquentiel — documenté »** : l'ordre seedé est retenu (anti-ancrage positionnel uniforme,
reproductible — le séquentiel aurait figé les 4 paires d'origine en tête de liste).

## Table de vérification (6 contraintes — verdicts RÉELS)

| Contrainte | Verdict | Détail |
|---|---|---|
| c1 — aucune dimension consécutive | ✅ PASS | 8 thèmes distincts (1 paire chacun) — jamais deux thèmes identiques adjacents (par construction) |
| c2 — trames jamais adjacentes aux dimensions interdites | ✅ PASS | sans objet de fait : **0 trame ▲ dans la quête** (`positions_trames : []`) |
| c3 — 1 trame par bloc uniforme | ✅ PASS | sans objet de fait : **0 trame ▲** |
| c4 — distance intra-dimension ≥ 3 | ✅ PASS | sans objet par config : chaque thème porte exactement 1 paire (aucune paire intra-dimension possible — note au 00-README et à la config) |
| c5 — alternance D/I (run max 2) | ✅ PASS | sans objet par config : paires d'images — **hors Likert, aucune orientation D/I** (run_max 0 = **non mesuré**, précédent 1.4/1.5) |
| c6 — ordre de passation ≠ ordre des codes | ✅ PASS | le 1ᵉʳ item vu est Q3.6-P7, le 2ᵉ Q3.6-P6 ≠ P1, P2… |

## Trace de course (réelle)

| Champ | Valeur réelle |
|---|---|
| `graine_finale` | 236427 |
| `tentatives` | 1 |
| `trace_c6` | « re-tirage non nécessaire » |
| `objectif_final` | **[0, 0, 0, 0, 0, 0]** — l'objectif TOTALEMENT NUL dès le tirage (0 échange de réparation — course la plus courte de la série M4) |
| `echanges` | 0 |
| `positions_trames` | [] |
| `run_max` | 0 (= non mesuré — c5 sans-objet par config, règle d'honnêteté 1.4 : « run_max 0 = non mesuré ») |

## Reproductibilité

```
python3 ci/outils/melange.py ci/quetes/3.6.json
```
reproduit la séquence de référence ci-dessus (graine 236427, tentative 1, 0 échange). Le validateur
(linter) rejoue les verdicts sur toute régénération et refuse toute sortie divergente sans Fiche de
Mutation documentée. Config de la course : `ci/quetes/3.6.json` · résultats réels archivés :
`ci/resultats-melange/3.6.json`.

## Finding — borne de run (mission V9 — jamais un verdict non atteignable)

**Borne doctrinale : run max 2 — SANS-OBJET par config (tâche hors Likert).**

- **Justification** : les paires d'images n'ont pas d'orientation D/I à alterner (le choix binaire
  A/B est symétrique par construction — équivalence de valeur) ; la contrainte c5 n'a **aucune
  prise** sur cette tâche. La config le déclare (`c5_sans_objet : true`), l'outil sort
  `run_max 0 = non mesuré` — **aucun verdict non atteignable n'est documenté** (règle gravée :
  le sans-objet documenté n'est pas un verdict non atteint, précédent 1.4 « c5 sans-objet par
  config mono-dimension » et 1.5 « mélange sans objet — tâche comportementale »).
- **Ce qui reste contrôlé malgré l'absence d'alternance** : l'ordre des paires est seedé
  (reproductible), les 8 thèmes sont distincts (zéro répétition adjacente possible), et l'ordre
  gauche-droite A/B à l'écran relève du design (anti-ancrage positionnel documenté au 01).

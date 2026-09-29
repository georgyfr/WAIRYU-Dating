# LIVRABLE 2 — PLAN DE PASSATION (SANS MÉLANGE — ordre canonique assumé, documenté)

```
GRAINE .................. 237427 — ASSIGNÉE SANS TIRAGE (précédent 2.6/2.8 : aucune
                          permutation exécutée — l'ordre canonique EST le plan)
ALGORITHME .............. non applicable (5 déclarations à choix — pas de Likert,
                          pas d'orientation D/I, pas de trames ▲)
ORDRE DE PASSATION ...... Q3.7-01 → 02 → 03 → 04 → 05 (ordre canonique, figé)
PARTICULARITÉ ........... le mélange est SANS OBJET — documenté ci-dessous
```

## Graine dérivée (convention mission V9 — lecture concaténée) + provenance de la collision

- **Graine : 210427 (graine-mère du Socle) + 1000 × ordinal 27 = 237427.**
- Convention (doctrine mission V9) : ordinals en lecture CONCATÉNÉE de la quête — 3.1 → 21 ·
  3.2 → 22 · 3.3 → 23 · 3.4 → 24 · 3.5 → 25 · 3.6 → 26 · 3.7 → 27 (série M4 complète).
- ⚠ **COLLISION MAÎTRISÉE — note de provenance (règle mission V9.G)** : 237427 fut la graine
  **RETIRÉE** de la quête 2.7 (Vague 6, lecture concaténée « 2.7 ») — **re-tirée 227427 en
  mission V7/V8** (convention unifiée par ordinals globaux). Les artefacts de l'ancien tirage
  sont archivés dans l'historique git (artefact `ci/resultats-melange/2.7.json` de l'époque,
  commit `307f33e`). La réutilisation est **PERMISE** : « graine retirée de 2.7, artefacts
  archivés git — déterminisme préservé » — **jamais de collision avec une graine ACTIVE**
  (vérifié machine : aucune graine active du dépôt n'occupe 237427). En l'état, la graine est
  **assignée sans tirage** — elle devient opérationnelle si une permutation future s'avère
  nécessaire (Fiche de Mutation).

## Pourquoi le mélange est sans objet (justification complète)

1. **Pas de dimensions à alterner (c1, c4)** : les 5 déclarations sont des écrans indépendants à
   options — aucune dimension psychométrique, aucune paire intra-angle (dimension = null pour
   les cinq).
2. **Pas de trames (c2, c3)** : aucune trame ▲ dans la quête (registre du mélange : `n_trames = 0`)
   — rien à ancrer, aucun bloc uniforme à découper.
3. **Pas d'orientation D/I (c5)** : hors Likert il n'y a pas d'orientation à alterner — chaque
   déclaration porte des options co-égales (aucune hiérarchie à équilibrer par l'ordre).
4. **c6 — l'ordre de passation EST un scénario** : la séquence 01 → 05 raconte une rencontre dans
   son ordre naturel (ce qui attire d'abord → ce qui retient → le style → la conversation → la
   dynamique) — l'ordre canonique est assumé et figé, documenté comme partie du protocole
   (précédent 1.11 : « altérer l'ordre altérerait la scène »).
5. **L'alternance passation « run max 2 »** : sans objet de fait — aucun pattern D/I à borner.

## Ce qui reste contrôlé malgré l'absence de mélange

| Contrôle | Dispositif |
|---|---|
| Ancrage positionnel | atténué par la structure : chaque écran porte UN énoncé et 5 options co-égales — aucune option n'est « première » au sens d'un score |
| Uniformité du protocole | ordre identique pour tous (reproductible) — le scénario d'approche est le même pour chaque voyageur |
| Effet de fatigue / ordre | les 5 déclarations se répondent en moins d'une minute (clics simples) — aucune charge de lecture |
| Privacy structurelle | le contenu rendu ne dépend PAS de l'ordre : aucune restitution n'existe — l'ordre ne peut rien révéler (rien n'est jamais affiché) |

## Reproductibilité

Aucun outil de mélange n'est exécuté (sans-objet) — aucun artefact `ci/resultats-melange/3.7.json`
n'existe (le dépôt n'archive que des tirages RÉELS, règle du registre). La présente documentation
fait foi de l'ordre de passation canonique figé.

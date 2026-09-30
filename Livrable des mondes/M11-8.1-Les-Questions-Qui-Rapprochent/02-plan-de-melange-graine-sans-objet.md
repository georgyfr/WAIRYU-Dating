🗒️ quete: 8.1 · dossier: M11-8.1-Les-Questions-Qui-Rapprochent · fiche: première émission V14.B.1 (FM à graver à la consolidation) · session: 2026-10-01

# LIVRABLE 2 — PLAN DE MÉLANGE (graine SANS-OBJET — ordre fixe scénarique, documenté)

```
GRAINE .................. SANS-OBJET — aucune graine assignée, aucune permutation exécutée
                          (précédents 3.7 « plan sans objet » / 6.5 « plan de passage » :
                          l'ordre scénarique EST le plan)
ALGORITHME .............. non applicable — pas de Fisher-Yates, pas de réparation : l'escalade
                          d'intimité est l'architecture du sens, le tirage la détruirait
ORDRE DE PASSATION ...... Q8.1-01 → Q8.1-36 (fixe scénarique, IDENTIQUE pour tous les couples)
DÉBLOCAGE ............... séquentiel par niveau — le niveau N+1 s'ouvre quand les 12 questions
                          du niveau N sont complétées PAR LES DEUX partenaires
RYTHME .................. 1 question par jour, la même pour le couple — chacun répond de son côté
PARTICULARITÉS .......... texte libre × 2 membres · révélation mutuelle après double réponse ·
                          zéro trame ▲ · zéro dimension · zéro orientation D/I
CONFIG .................. ci/quetes/8.1.json — SANS OBJET (aucun mélange à configurer)
ARTEFACT ................ ci/resultats-melange/8.1.json — N'EXISTE PAS (aucune course lancée)
```

## Pourquoi le mélange est SANS OBJET (justification complète)

1. **Pas de dimensions à alterner (c1, c4)** : les 36 items sont des questions ouvertes en texte
   libre — aucune dimension psychométrique, aucune sous-dimension à espacer, pas de Likert, pas de
   recodage. Les contraintes c1/c4 de l'outil générique `melange.py` n'ont aucun objet.
2. **Pas de trames (c2, c3)** : zéro trame ▲ hébergée par 8.1 (registre du mélange : `n_trames = 0`)
   — rien à ancrer, aucun bloc uniforme à découper, aucune indiscernabilité à protéger.
3. **Pas d'orientation D/I (c5)** : pas d'orientation à équilibrer — chaque question est une
   invitation identique pour les deux partenaires.
4. **c6 — l'ordre de passation EST un scénario** : la séquence 01 → 36 raconte une montée — le léger
   d'abord (se montrer sans s'exposer), le profond ensuite (raconter la personne construite), la
   vulnérabilité mutuelle enfin (se confier à la même question). Altérer l'ordre altérerait la scène
   (précédent 1.11) : une question du niveau 3 posée avant la confiance serait une indiscrétion, une
   question du niveau 1 posée après serait une régression. **L'ordre est assumé et figé, documenté
   comme partie du protocole.**
5. **Le déblocage séquentiel REMPLACE l'ancrage positionnel** : ce n'est pas un tirage qui protège
   contre l'effet d'ordre, c'est le verrou de niveau — le palier N+1 reste fermé tant que les 12
   questions du palier N ne sont pas complétées **PAR LES DEUX**. La protection est structurelle,
   pas statistique.

## La mécanique de rythme (1 question par jour, chacun, croisée)

| Étape | Ce qui se passe | Garde |
|---|---|---|
| 1 — la question du jour | La question n° k du scénario se présente **aux deux membres du couple le même jour** (le même énoncé pour les deux — condition des réponses croisées) | symétrie structurelle |
| 2 — chacun de son côté | A reçoit la question et y répond en texte libre ; B pareil. Les deux rédactions sont indépendantes : pendant qu'une réponse est rédigée, l'autre n'existe pas pour l'écran | pas d'influence croisée |
| 3 — le sceau | Aucune réponse n'est visible tant que **les DEUX n'ont pas répondu** — la question du jour reste scellée après la première réponse | double consentement par question (SIG-8.1-02) |
| 4 — la révélation mutuelle | Dès la **double réponse**, les deux réponses se dévoilent ensemble, en tête-à-tête, sans classement, sans score, sans « compatible/incompatible » | la révélation EST la récompense |
| 5 — le lendemain | La question k+1 se présente ; le niveau suivant s'ouvre à la complétion des 12 par les deux (36 jours au fil de l'eau — le rythme réel s'adapte, aucune expiration punitive, UX exacte À VALIDER PAR LE COMITÉ) | anti-flood, anti-pression |

> **Révocabilité (SIG-8.1-02)** : toute réponse est modifiable ou retirée à tout moment — avant
> révélation (le sceau se relève plus tard) comme après (la vue partagée se met à jour) ; sortie sans
> justification, sans délai (sortie permanente). La forme exacte de la mise à jour de la vue partagée
> après retrait : À VALIDER PAR LE COMITÉ.
> **Lecture du « 1 question par jour chacun »** : la même question du jour se répond deux fois (une
> par membre) — le compte du couple est de 36 questions × 2 réponses ; le compte individuel est de
> 1 question par jour. Aucun membre ne peut avancer seul : la complétion est conjointe à chaque
> étage.

## Ce qui reste contrôlé malgré l'absence de mélange

| Contrôle | Dispositif |
|---|---|
| Ancrage positionnel | neutralisé par le rythme : une question par jour, la même pour tous les couples — la position dans le scénario est identique pour tout le monde (reproductible) |
| Uniformité du protocole | ordre identique pour tous les couples (fixe scénarique gelé) — la montée est la même, seule la réponse diffère |
| Effet de fatigue / ordre | 1 question/jour, ≤ 20 mots, une phrase — aucune charge ; la journée crée l'attente au lieu de la fatigue |
| Privacy structurelle | rien ne se révèle sans double réponse ; rien ne sort du couple (jamais d'export, jamais de tiers) ; chiffrement renforcé, sortie permanente |
| Pression / course | aucun membre ne peut forcer un niveau ; aucune notification de relance punitive (UX À VALIDER PAR LE COMITÉ) |

## Note de sécurité (règle 11-b — sans objet ici, consignée par prudence)

Cette trace ne porte AUCUN énoncé de trame (8.1 n'héberge aucune trame ▲ — `n_trames = 0`). Les 36
questions vivent AU DÉPÔT volontairement : ce sont des énoncés de quête (pas des items de trame de
sécurité) — leur publication est la conformité (les codes gelés Q8.1-01 → 36 y sont attachés,
verbatim gelé). Le sous-agent n'a lancé AUCUN mélange et n'a créé AUCUNE config (interdits
processus respectés).

## Reproductibilité

Aucun outil de mélange n'est exécuté (sans-objet) — aucun artefact `ci/resultats-melange/8.1.json`
n'existe et n'est attendu (le dépôt n'archive que des tirages RÉELS, règle du registre). Le présent
document fait foi de l'ordre de passation canonique figé : **Q8.1-01 → Q8.1-36, déblocage séquentiel
par niveau, complétion conjointe**. Si un jour un besoin de mélange apparaissait (Fiche de Mutation +
verdict comité), une graine serait alors dérivée et documentée ici — la présente version reste
sans-objet.

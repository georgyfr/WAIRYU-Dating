# LIVRABLE 2 — PLAN DE MÉLANGE (graine dérivée 264427 — course par la session principale)

> quete : 6.4 « Tes frontières modernes » · fiche : 02 — plan de mélange
> **Statut : AUCUNE course exécutée par la présente session** (interdit de mission — la session
> principale coordonne les courses canoniques). Ce fichier documente : la graine dérivée, la
> configuration attendue, et l'**analyse honnête de faisabilité c1-c6** (les blocs de 2 changent
> l'arithmétique des contraintes — analysé, pas déclaré). À codes/orientations/dimensions/graine
> identiques, la sortie de l'outil est déterministe : la course canonique de la session principale
> **rejouera** ces contraintes et archivera l'ordre de passation à `ci/resultats-melange/6.4.json`.

## Graine dérivée (convention concaténée)

- **Graine : 210427 (graine-mère du Socle) + 1000 × ordinal 54 = 264427.**
- Convention (doctrine mission V9, étendue V10-V12) : ordinals en lecture CONCATÉNÉE —
  quête 6.4 → (6−1)×10+4 = **54** (règle de décade ((a−1)×10+b) — les quêtes 6.x partagent la
  décade 50+ ; M9 est le monde de la quête 6.4, l'ordinal suit la QUÊTE).
- Cohérence de chaîne : 5.1→41 · 5.2→42 · 5.3→43 · 5.4→44 · 5.5→45 · 5.6→46 · 5.7→47 ·
  **6.4→54** · 6.5→55 (réservé, non tiré — quête déclarative sans mélange, voir dossier 6.5).
- **Zéro collision vérifiée au dépôt** (machine — les 27 graines des configs `ci/quetes/` sont
  toutes distinctes ; 264427 n'y figure pas).

## Statut de la config — À CRÉER (note de passation)

> ⏳ **La config canonique `ci/quetes/6.4.json` est À CRÉER par la session principale**
> (6 items Q6.4-01 → Q6.4-06, orientations et dimensions du tableau 01, graine 264427).
> **AUCUN fichier `ci/` n'a été touché** par la présente session (interdit de mission).
> Contenu de référence :

```json
{
  "quete": "6.4",
  "titre": "Tes frontières modernes",
  "graine": 264427,
  "items": [
    { "code": "Q6.4-01", "orientation": "D", "dimension": "pornographie" },
    { "code": "Q6.4-02", "orientation": "I", "dimension": "pornographie" },
    { "code": "Q6.4-03", "orientation": "D", "dimension": "masturbation" },
    { "code": "Q6.4-04", "orientation": "I", "dimension": "masturbation" },
    { "code": "Q6.4-05", "orientation": "D", "dimension": "flirt" },
    { "code": "Q6.4-06", "orientation": "I", "dimension": "flirt" }
  ],
  "c2_sans_objet": true,
  "c3_sans_objet": true
}
```

## Particularités — ANALYSE HONNÊTE c1/c4 (6 items, blocs de 2)

```
GRAINE .................. 264427 (1ʳᵉ génération V13 — zéro collision vérifiée)
OUTIL ................... ci/outils/melange.py (générique — aucune trame, outil suffisant)
ALGORITHME .............. Fisher-Yates seedé + réparation déterministe (hill-climbing seedé)
ORDRE DE PASSATION ...... la séquence produite par la course canonique (JAMAIS l'ordre des codes)
PARTICULARITÉS .......... 6 attitude (3 sujets × 1 paire R6 — BLOCS DE 2)
                          — AUCUNE trame hébergée
                          c2/c3 sans-objet (0 trame)
                          c1 ⚠ ANALYSE HONNÊTE : satisfiable (min constructible = 0) — voir ci-dessous
                          c4 ⚠ ANALYSE HONNÊTE : satisfiable (min constructible = 3, ossature unique)
                          c5 équilibré (3 D / 3 I — run max 2, atteignable à 1)
                          c6 satisfiable (trivialement : 3! permutations des sujets × sens intra-paires)
```

### L'arithmétique des blocs de 2 (le constat qui mérite d'être écrit)

- **c1 (aucune dimension consécutive) — satisfiable, min = 0.** Trois dimensions × 2 items :
  l'arrangement `A B C A B C` (chaque sujet occupant les positions {1,4}, {2,5}, {3,6}) ne crée
  AUCUNE adjacence de même dimension. Contrairement au cas mono-dimension de 5.6 (c1 sans-objet,
  précédent V12-c), la contrainte conserve ici tout son pouvoir de tri : c'est elle qui force le
  mélange à alterner les sujets au lieu d'en poser deux d'affilée.
- **c4 (distance intra-dimension ≥ 3) — satisfiable, min = 3, et l'appariement de positions est
  UNIQUE.** Avec 2 items par dimension en 6 positions, les paires de positions à distance ≥ 3
  sont (1,4) (1,5) (1,6) (2,5) (2,6) (3,6) ; le seul appariement parfait de l'espace {1..6} en
  trois paires toutes à distance ≥ 3 est **{(1,4), (2,5), (3,6)}** (énumération complète :
  toute autre combinaison laisse une paire à distance 1 ou 2). **Conséquence structurelle
  consignée** (à vérifier à la course) : l'ordre de passation aura l'ossature `sujet1 · sujet2 ·
  sujet3 · sujet1 · sujet2 · sujet3` — les degrés de liberté restants sont la permutation des
  3 sujets (3!) et le sens D/I intra-paire (2³) : 48 séquences respectent c1+c4. La contrainte
  c4 ne discrimine plus la POSITION des sujets ; elle verrouille leur ossature — c'est le
  contraire du cas habituel, et c'est **attendu** avec des blocs de 2 (finding consigné au comité).
- **c5 (alternance D/I, run max 2) — satisfiable, run max 1 atteignable.** Chaque sujet
  contribue un D et un I ; sur l'ossature `A B C A B C`, la séquence d'orientations
  `D I D I D I` (ou son miroir) est constructible (choisir le sens intra-paire en
  conséquence) — 0 paire adjacente de même orientation. La réparation gloutonne de l'outil
  dispose donc d'une marge réelle.
- **c6 (passation ≠ ordre des codes)** — satisfiable : toute permutation des sujets non
  triviale change l'ordre des codes (probabilité 47/48 sur l'espace admissible).
- **c2/c3 — sans-objet** (0 trame hébergée : quête 100 % attitude déclarative).

### Ce que la course canonique doit produire (attendu — vérifiable, pas pré-computé)

| Contrainte | Verdict attendu | Détail |
|---|---|---|
| c1 — aucune dimension consécutive | ✅ PASS | 0 adjacence de même dimension (ossature A B C A B C) |
| c2 — trames jamais adjacentes aux dimensions interdites | ✅ PASS sans-objet | 0 trame hébergée |
| c3 — 1 trame par bloc uniforme | ✅ PASS sans-objet | 0 trame — `positions_trames : []` |
| c4 — distance intra-dimension ≥ 3 | ✅ PASS | distance = 3 exactement pour chaque dimension (appariement unique) |
| c5 — alternance D/I (run max 2) | ✅ PASS | run max attendu ≤ 2 (1 atteignable) — 3 D / 3 I équilibrés |
| c6 — ordre de passation ≠ ordre des codes | ✅ PASS | `trace_c6` : « re-tirage non nécessaire » attendu |

## Séquence d'ordre de passation — À PRODUIRE PAR LA COURSE

> La présente session ne lance PAS le mélange. Le tableau ci-dessous est un **cadre vide à
> remplir par la course canonique** de la session principale — l'archive officielle
> `ci/resultats-melange/6.4.json` en fera foi (précédent 5.6 : empreinte 99de8b53, course
> identique octet pour octet à la trace préliminaire).

| Pos | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| Code | *à la course* | *à la course* | *à la course* | *à la course* | *à la course* | *à la course* |
| Sujet | *(A B C A B C — ossature attendue, sujets dans un ordre quelconque)* | | | | | |

Rappel : les codes sont gelés et définitifs ; l'ordre de **passation** est celui de la course,
jamais l'ordre des codes. La correspondance sujet→code est fixe (01×02 pornographie · 03×04
masturbation · 05×06 flirt).

## Reproductibilité

```
# après création de la config canonique par la session principale :
python3 ci/outils/melange.py ci/quetes/6.4.json
```

la sortie est déterministe (graine 264427 — à codes/orientations/dimensions identiques, toute
re-course est identique octet pour octet). Le résultat officiel sera archivé à
`ci/resultats-melange/6.4.json` et consigné au comité comme preuve de fidélité du cadre.

## Point de doctrine — pourquoi le mélange compte ici

L'ordre de passation n'est pas cosmétique : poser les deux items d'un même sujet l'un après
l'autre (ordre des codes 01→02) inviterait à une **cohérence de façade** (la deuxième réponse
alignée sur la première) — précisément ce que la paire R6 doit éviter pour certifier une attitude
tenue. L'ossature A B C A B C impose un respir entre les deux pôles de chaque sujet : c'est la
protection mécanique de l'honnêteté des réponses — et elle est consignée ici, pas au rendu.

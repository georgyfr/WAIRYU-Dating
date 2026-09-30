# LIVRABLE 2 — PLAN DE MÉLANGE (graine réelle 263427 — outil générique melange.py)

> ⚠ **STATUT DE LA COURSE — NON EXÉCUTÉE (interdit mission V13.C)** : cette quête **ne lance PAS
> le mélange** et **ne crée PAS la config canonique**. Le présent plan déclare la structure de
> `ci/quetes/6.3.json` (à créer par la **session principale**) et documente la **faisabilité
> analytique** des six contraintes — verdicts CI-DESSOUS ANALYTIQUES (démonstrations constructives,
> pas des verdicts rejoués). La course de contrôle, exécutée par la session principale dès la
> config créée, produira les verdicts réels et archivera le résultat à
> `ci/resultats-melange/6.3.json` ; le mélange ne dépendant QUE des codes, orientations,
> dimensions et de la graine (finding de fidélité structurelle V11/V12), tous déclarés et gelés
> ici, la course reproduira la structure annoncée.

## Graine dérivée (convention concaténée)

- **Graine : 210427 (graine-mère du Socle) + 1000 × ordinal 53 = 263427.**
- Convention (doctrine mission V9, étendue V10/V11/V12/V13) : ordinals en lecture CONCATÉNÉE —
  quête 6.3 → (6−1)×10+3 = **53**.
- Cohérence de chaîne vérifiée : décades M6/M7 = 40 (5.1→251427 · 5.2→252427 · 5.3→253427 ·
  5.4→254427 · 5.5→255427 · 5.6→256427 · 5.7→257427) · décade M8/M9 = 50 — **6.1→261427 ·
  6.2→262427 · 6.3→263427** · 6.4→264427 · 6.5→265427 (réservés V13). Arithmétique mission
  vérifiée : 210427 + 1000 × 53 = 263427 ✓.
- **Zéro collision** : vérifié machine sur les 27 configs `ci/quetes/*.json` du dépôt —
  la graine 263427 n'existe nulle part ailleurs.

## Structure de la config déclarée (pour `ci/quetes/6.3.json` — À CRÉER — SESSION PRINCIPALE)

```
quete: "6.3" · titre: "Ta carte des préférences" · graine: 263427
items : Q6.3-01 D douceur      · Q6.3-02 I douceur      · Q6.3-03 D intensite
        Q6.3-04 I intensite    · Q6.3-05 D exploration  · Q6.3-06 I exploration
        Q6.3-07 I jeu          · Q6.3-08 D connexion
        Q6.3-09 D nouveaute    · Q6.3-10 I nouveaute    · Q6.3-11 D nouveaute
        Q6.3-12 D apres        · Q6.3-13 I apres        · Q6.3-14 I apres
c1_min_constructible: 0 · c4_min_constructible: 0
AUCUN item signal (zéro trame hébergée — les lectures 6.3 sont des CROISEMENTS de scores,
pas des trames) → c2_sans_objet / c3 sans-objet
```

## Faisabilité analytique (6 contraintes — démonstrations constructives, course à venir)

| Contrainte | Verdict | Détail (analyse honnête) |
|---|---|---|
| c1 — aucune dimension consécutive | ✅ FAISABLE (analytique) | 7 dimensions sur 14 positions, tailles {2,2,2,1,1,3,3} — un calendrier sans adjacence existe (démonstration ci-dessous, colonne « calibre ») : marge ample, la réparation gloutonne ne sera jamais à court. |
| c2 — trames jamais adjacentes aux dimensions interdites | ✅ PASS **sans-objet** | **0 trame hébergée** — 6.3 est une quête 100 % carte ; SIG-6.3-01/02 sont des CROISEMENTS de scores, pas des trames : aucune position ancrée, aucune dimension interdite hébergée. |
| c3 — 1 trame par bloc uniforme | ✅ PASS **sans-objet** | 0 trame — aucune position ancrée (l'outil ne crée aucun bloc trame). |
| c4 — distance intra-dimension ≥ 3 | ✅ FAISABLE (analytique) | 9 contraintes de paires (douceur 1 · intensite 1 · exploration 1 · nouveaute C(3,2)=3 · apres C(3,2)=3) sur 14 positions — **strictement faisable** : le calibre constructif ci-dessous place chaque dimension à distances 4/4 minimum ; les 2 troisièmes items (11 en `nouveaute`, 14 en `apres`) tiennent à distance ≥ 3 de leurs deux voisins de dimension. |
| c5 — alternance D/I (run max 2) | ✅ FAISABLE (analytique) | **7 D / 7 I équilibrés** — l'alternance stricte (runs de 1) existe arithmétiquement sur 7/7 ; la réparation dispose donc d'une marge maximale (le pire cas constructif reste un run 2). |
| c6 — ordre de passation ≠ ordre des codes | ✅ FAISABLE (analytique) | Contrainte triviale sur 14 items (14! − 1 arrangements valides) — la graine 263427 est hors cas pathologique documenté (permutation identique) ; en cas d'échec, l'outil re-tire (graine + 1) et le documente. |

### Calibre constructif (preuve de faisabilité c1 × c4 conjointes)

```
Position : 1      2      3      4      5      6      7      8      9      10     11     12    13    14
Dim      : nouveau  douce  apres  explor nouveau  douce  apres  explor nouveau  intens apres jeu   conn  intens
```
— distances intra-dimension : nouveaute {1,5,9} = 4·4 ✓ · apres {3,7,11} = 4·4 ✓ ·
douceur {2,6} = 4 ✓ · exploration {4,8} = 4 ✓ · intensite {10,14} = 4 ✓ · jeu/connexion mono ✓.
— adjacence c1 : aucune paire consécutive de même dimension ✓.
Ce calibre n'est PAS la course : il démontre uniquement que l'espace des solutions est non vide
avec marge (9 contraintes de distance, aucune tension arithmétique de type borne 5.4).

## Course de contrôle (RÉSERVÉE À LA SESSION PRINCIPALE — après création de la config)

```
GRAINE .................. 263427
OUTIL ................... ci/outils/melange.py (générique — aucune trame, pas d'ancre)
CONFIG .................. ci/quetes/6.3.json — À CRÉER par la session principale
                          (structure gelée ci-dessus : codes · orientations · dimensions · graine)
ALGORITHME .............. Fisher-Yates seedé + réparation déterministe (hill-climbing seedé)
ORDRE DE PASSATION ...... la séquence réelle de la course (JAMAIS l'ordre des codes)
PARTICULARITÉS .......... 14 carte (5 axes {3 paires + 2 pivots} · nouveauté {1 paire + 1 pivot}
                          · après {1 paire + 1 pivot}) — AUCUNE trame hébergée
                          c1 visé 0 adjacence · c2/c3 SANS-OBJET · c4 visé 0 déficit
                          · c5 visé run ≤ 2 · c6 visée
DÉTERMINISME ............ 5 passes rejouées à l'archive — empreinte à graver au retour
ARCHIVE ................. ci/resultats-melange/6.3.json (session principale)
```

## Reproductibilité

```
python3 ci/outils/melange.py ci/quetes/6.3.json
```

— **à exécuter par la session principale dès la config créée** : produit la séquence canonique
(graine 263427) et archive le résultat à `ci/resultats-melange/6.3.json`. La preuve de fidélité
tient au finding V11/V12 : le mélange ne dépend que des codes, orientations, dimensions et de la
graine — tous déclarés ici et gelés. **Le présent dossier ne contient AUCUNE trace de course** :
aucune empreinte, aucun ordre de passation déclaré comme réel — la traçabilité complète viendra
de l'archive de la session principale (convention 5.1/5.4/5.5 avant course).

# WTC-SM-Q4 — CORRECTION PHILOSOPHIQUE (fichier SUPPLÉMENTAIRE — RIO-14)

> **Ce que ceci est** : le fichier de correction demandé par le fondateur (même ordre que RIO-01→04, RIO-06→13, trace 1a15ed7ad00bc0fd) pour porter RIO-14 « Nos deux rives » de 77/100 à 100/100 sur la grille de l'audit du 21/10 (Task 163), en ajoutant les calculs manquants **sans rien modifier d'existant**.
> **Ce que ceci n'est PAS** : une retouche du moteur. Le vrai cœur reste `../../src/wtc_sm_q4_core.py` (SPEC verrouillée 18/10 — A1 bornes 2,50/3,50 · A2 zéro item nouveau · A3 percentiles · A4 override crise · A5 9 noms mot pour mot) — importé tel quel, intégrité vérifiée à l'import. Aucun moteur SM Q1/Q2/Q3/Q5 n'a été touché.

## La règle du jeu (demande fondateur)

1. Ne pas modifier ce qui a été fait — uniquement ajouter des fichiers.
2. Mettre l'accent sur les CALCULS et l'exactitude des résultats.
3. Déceler sans nommer les pathologies (arbitrage Task 164).

## Contenu

| Fichier | Rôle |
|---|---|
| `src/wtc_sm_q4_correction.py` | La couche de correction : importe les VRAIS moteurs (sm-q4 cœur verrouillé, sm-q5 palier/pas/templates, sm-q2 filet amont — intégrité vérifiée, zéro réimplémentation) et ajoute F2 (palier de COUPLE 🟢🟠🔴 dérivé mécaniquement des VRAIS niveaux, PORTÉ PAR LES VRAIES CONSTANTES de la quête pas — la junction au VRAI `palier_de` de Q5 est un assert à CHAQUE appel : la couche ne crée aucune table propre + QUAND DEMANDER DE L'AIDE), F3 (contenu des 3 paliers sur les vrais pas de la banque + branchement pas au niveau couple), F4 (fragment L8 à 7 blocs niveau couple). Règles R1-R9 pré-enregistrées. |
| `src/wtc_sm_q4_correction_validation.py` | Le pipeline de preuve : grille 9/9 + anti-inversion réelle + PILE prouvés (détresse 1/3 inatteignable sur 125 triplets · charge 1/12 atteignable sur 17³), énumération EXHAUSTIVE de 2 304 états (9 cellules × 8×8 voies × 2 boucles × 2 styles), re-score bit-exact des 600 couples archivés (13 groupes, population 2 000), couplage pas, ×2 SHA-256. |
| `results/correction_criteres.json` | Agrégats + COR0-COR8 + SHA-256 des 2 exécutions. |
| `results/rapport-correction-RIO-14.md` | Le rapport complet. |

## Résultat (tous critères PASS — détail dans le rapport)

- **COR0** compactations : grille 9/9 (VRAI configuration_de) · anti-inversion réelle « 6 flips / 3 stables » · frontière 2,49/2,50/3,49/3,50 exacte · détresse grain 1/3 : 2,50/3,50 PILE inatteignables (0/125 triplets) · charge grain 1/12 : PILE atteignables (2 valeurs sur l'espace 17³) · boucle ≥ 30 et styles ≥ 1,00 inclusifs
- **COR1** fragments complets : 2 304/2 304 configurations (9 cellules × 8×8 voies × 2×2 diagnostics)
- **COR2** double chemin entiers purs ≡ VRAI moteur : 2 304/2 304 · **JUNCTION RÉELLE** : palier ≡ VRAI `palier_de` Q5 (assert à chaque appel) 2 304/2 304 — la table du croisement EST celle du pas
- **COR3** seuils : S1 2 288 (crise héritée ∨ ÉLEVÉ) · S2 12 (MOYEN) · voies réelles affichées
- **COR4** vocabulaire : 0 mot interdit sur 25 textes distincts · D-SIM 100 % · exceptions sourcées (filet amont · case « trouble »)
- **COR5** anti-fabrication / doctrine couple : « zone calme : rien à fabriquer » ssi CALME DES DEUX RIVES hors crise · affichage en crise = CRISE_HÉRITÉE (config tracée, jamais déployée) · direction de la boucle JAMAIS affichée · 0 % compatibilité (0/2 304)
- **COR6** re-score bit-exact : 600 couples régénérés par le VRAI simulateur seed 42 (population de référence 2 000) — stats 13/13 groupes bit-exact (règle G10 : config TRACÉE sous override) · boucle globale 49,0 % · styles globale 4,5 % · voies G10 (A2 20 · SM-C1 20 · H5 10) · conformité table 506/550 · frontières 40/40 · par_config 9/9 · 1 800 comparaisons, 0 écart · couche appliquée : 🟢 49 · 🟠 185 · 🔴 366
- **COR7** couplage pas : 18 paliers (9 cellules × 2 états crise) via le VRAI `pas_de` · 🔴 → aucun pas 14/14 · pas 🟢/🟠 = vraie banque 4/4 · suivi 15/15 sans sanction · re-test 8 semaines
- **COR8** reproductibilité : ×2, SHA-256 identiques `58b8d869078cda85…`

**Re-score** : RIO-14 = 77 % → **100 %** (F1 25 inchangé · F2 22→25 · F3 12→25 · F4 18→25).

## Exécution

```bash
python3 src/wtc_sm_q4_correction_validation.py   # ~8 s (2 304 × 2 + re-score 600)
```

## Limites (lues avant toute décision)

Simulation seule (D-SIM) — VALID-01 reste vraie. Population de percentiles = placeholder (2 000 couples simulés — remplacer par le pilote L2, comme consigné au rapport archivé). La crise est HÉRITÉE (0 voie nouvelle) — le filet amont est rappelé, le croisement n'est jamais déployé. Doctrine couple respectée : boucle nommée ENSEMBLE, direction jamais affichée, 0 % compatibilité. Récapitulatif de DIMENSION = action n°2.

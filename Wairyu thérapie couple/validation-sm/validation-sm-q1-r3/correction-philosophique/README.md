# WTC-SM-Q1-R3 — CORRECTION PHILOSOPHIQUE (fichier SUPPLÉMENTAIRE — RIO-11)

> **Ce que ceci est** : le fichier de correction demandé par le fondateur (même ordre que RIO-01→04 et RIO-06→10, trace 1a15ed7ad00bc0fd) pour porter RIO-11 « Ma détresse et la leur » de 69/100 à 100/100 sur la grille de l'audit du 21/10 (Task 163), en ajoutant les calculs manquants **sans rien modifier d'existant**.
> **Ce que ceci n'est PAS** : une retouche du moteur. Le vrai cœur reste `../../src/wtc_sm_q1_core.py` (R3 — D-GÉOMÉTRIE σ_eff 0,30, bande [3,10 ; 4,90], voie H5 peuplée, VALIDÉ 6/6 contresigné) — importé tel quel, intégrité vérifiée à l'import. Aucun moteur SM Q1/Q3/Q4/Q5 n'a été touché.

## La règle du jeu (demande fondateur)

1. Ne pas modifier ce qui a été fait — uniquement ajouter des fichiers.
2. Mettre l'accent sur les CALCULS et l'exactitude des résultats.
3. Déceler sans nommer les pathologies (arbitrage Task 164) : présenter le problème avec son niveau de gravité, expliquer comment il peut affecter la relation et la vie de couple, proposer des pistes de solution.

## Contenu

| Fichier | Rôle |
|---|---|
| `src/wtc_sm_q1_correction.py` | La couche de correction : importe les VRAIS moteurs (sm-q1-r3 cœur R3, sm-q3 banque de forces, sm-q4 croisement, sm-q5 pas/suivi — intégrité vérifiée à l'import, zéro réimplémentation) et ajoute F2 (palier 🟢🟠🔴 image exacte du VRAI classifier_dominance — 0 seuil ajouté + QUAND DEMANDER DE L'AIDE S1/S2 + bande D-GÉOMÉTRIE affichée honnêtement), F3 (contenu des 3 paliers + branchement quête « pas » sur le vrai moteur SM), F4 (fragment de bilan L8 à 7 blocs avec junctions réelles). Règles R1-R9 pré-enregistrées en tête de fichier. |
| `src/wtc_sm_q1_correction_validation.py` | Le pipeline de preuve : compactations PROUVÉES (items SM-C1 → sommes 256→17, espions A/C jamais lus, ancres texte, frontières entières des faces D), énumération EXHAUSTIVE des 4 250 états distincts de la couche (5³ × 17 × 2), re-score bit-exact des 500 profils archivés R3, couplage pas via le VRAI palier_de/pas_de, exécution ×2 (SHA-256). |
| `results/correction_criteres.json` | Les agrégats complets + les critères COR0-COR8 + SHA-256 des 2 exécutions. |
| `results/rapport-correction-RIO-11.md` | Le rapport complet : règles, méthode, chiffres exacts, re-score F1-F4, limites honnêtes. |

## Résultat (tous critères PASS — détail dans le rapport)

- **COR0** compactations prouvées : 625 vérifs SM-C1 (256 quadruplets → 17 sommes, 0 écart) · espions 25/25 (A1/A2/A3/C2/C3 jamais lus) · ancres 5/5 · frontières D 125/125 · 0 borne PILE sur grain entier
- **COR1** fragments complets : 4 250/4 250 configurations · 0 bloc vide
- **COR2** double chemin (entiers purs ≡ VRAI moteur) : 4 250/4 250 · junction label ↔ palier exacte (STABLE ⇔ 🟢 · CHARGE/MASQUE/MIXTE ⇔ 🟠 · CRISE ⇔ 🔴)
- **COR3** seuils d'aide : S1 2 750 (crise) · S2 1 404 · frontière entière crise ⇔ (somme ≥ 16 ∨ H5) 0 écart · bornes réelles consignées (2,50/3,50 inatteignables PILE sur grain entier, dist min 0,5 · 4,00 PILE seuil inclusif du cœur)
- **COR4** vocabulaire écran : 0 mot interdit sur 56 textes distincts · D-SIM 100 % · bande haute (4,00-4,90) jamais affichée hors crise
- **COR5** anti-fabrication : « rien à fabriquer » (template réel zone_calme de Q5) ssi STABLE exactement · filet (court-circuit) ssi CRISE exactement · ombre jamais affichée en crise (le court-circuit passe avant)
- **COR6** re-score bit-exact : 500 profils régénérés par le VRAI simulateur seed 42 — stats_groupes 8/8 bit-exact vs archive du 17/10 · C3 (sens 100 % / spé 100 %, VP 40 · FN 0 · VN 408 · FP 0, bande 52, H5 20/20) bit-exact · 1 448 comparaisons, 0 écart · couche appliquée : 🟢 140 · 🟠 270 · 🔴 90
- **COR7** couplage pas : 6 paliers résolus via le VRAI palier_de/pas_de Q5 · 🔴 → aucun pas (D-CRISE) 3/3 · pas 🟢/🟠 = vraie banque 4/4 · suivi 14 j 15/15 sans sanction · re-test 8 semaines (56 j) · junction palier Q1↔Q5 9/9
- **COR8** reproductibilité : pipeline ×2, SHA-256 identiques `ecd0e23ccaeada34…`

**Re-score** : RIO-11 = 69 % → **100 %** (F1 25 inchangé · F2 22→25 · F3 12→25 · F4 10→25).

## Exécution

```bash
python3 src/wtc_sm_q1_correction_validation.py   # ~2 s (4 250 × 2)
```

## Limites (lues avant toute décision)

Tout est validé en simulation (bandeau D-SIM sur chaque écran) — la limite « zéro réel » de l'audit (VALID-01) reste vraie. Le libellé réel des items (SM-D1-1, SM-A2-3…) reste absent des packages par conception (action n°3 de l'audit) — les textes de la couche ne lisent que les sorties réelles du moteur (labels, seuils, bande), jamais les trames privées. Les faces A (aidant) et C2/C3 (contrat de soin), mesurées mais non classifiantes en Q1, sont TRACÉES et jamais affichées comme lecture — elles reviennent avec RIO-12. Le filet 3919/3114 est cité mot pour mot depuis le VRAI moteur (exception sourcée, court-circuit validé P1). Le récapitulatif de DIMENSION (fédération des 5 fragments) reste l'action n°2 de l'audit.

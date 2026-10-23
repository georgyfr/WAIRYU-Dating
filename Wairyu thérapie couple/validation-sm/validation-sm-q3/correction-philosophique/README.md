# WTC-SM-Q3 — CORRECTION PHILOSOPHIQUE (fichier SUPPLÉMENTAIRE — RIO-13)

> **Ce que ceci est** : le fichier de correction demandé par le fondateur (même ordre que RIO-01→04, RIO-06→12, trace 1a15ed7ad00bc0fd) pour porter RIO-13 « Ce que notre lien sait porter » de 71/100 à 100/100 sur la grille de l'audit du 21/10 (Task 163), en ajoutant les calculs manquants **sans rien modifier d'existant**.
> **Ce que ceci n'est PAS** : une retouche du moteur. Le vrai cœur reste `../../src/wtc_sm_q3_core.py` (SPEC verrouillée 18/10 — A1 seuil 3,50 tel quel · A2 faces seules · A3 override affichage en crise · A4 SILENCIEUSE mot pour mot · D-TABLE table=code · D-DENSITÉ ±0) — importé tel quel, intégrité vérifiée à l'import. Aucun moteur SM Q1/Q2/Q4/Q5 n'a été touché.

## La règle du jeu (demande fondateur)

1. Ne pas modifier ce qui a été fait — uniquement ajouter des fichiers.
2. Mettre l'accent sur les CALCULS et l'exactitude des résultats.
3. Déceler sans nommer les pathologies (arbitrage Task 164).

## Contenu

| Fichier | Rôle |
|---|---|
| `src/wtc_sm_q3_correction.py` | La couche de correction : importe les VRAIS moteurs (sm-q3 cœur verrouillé, sm-q4 niveau_de, sm-q5 palier/pas/templates — intégrité vérifiée, zéro réimplémentation) et ajoute F2 (palier 🟢🟠🔴 mécanique : 🔴 ssi CRISE_HÉRITÉE · 🟠 ssi SILENCIEUSE avec face MOYEN — la force est à portée · 🟢 sinon — junction prouvée : le VRAI seuil d'activation et la borne ÉLEVÉ sont LA MÊME frontière 3,50 PILE + QUAND DEMANDER DE L'AIDE), F3 (capitalisation PAR FORCE RÉELLE de la D-TABLE F-S1 à F-S6 + densité honnête : les exclues sont actives, tracées, jamais perdues + branchement quête « pas »), F4 (fragment L8 à 7 blocs). Règles R1-R9 pré-enregistrées. |
| `src/wtc_sm_q3_correction_validation.py` | Le pipeline de preuve : compactations (256 quadruplets × 6 faces → 17 sommes → 3 niveaux ; frontière 3,50 PILE unique 102/102), énumération EXHAUSTIVE de 5 832 états (3⁶ × 8 voies), re-score bit-exact des 520 profils archivés (9 classes), couplage pas sur les 9 croix, ×2 SHA-256. |
| `results/correction_criteres.json` | Agrégats + COR0-COR8 + SHA-256 des 2 exécutions. |
| `results/rapport-correction-RIO-13.md` | Le rapport complet. |

## Résultat (tous critères PASS — détail dans le rapport)

- **COR0** compactations : 3 750 vérifs items→sommes (0 écart) · sommes→niveaux 102/102 · frontière 3,50 PILE activation ⇔ ÉLEVÉ 102/102 (0 distance — LA MÊME borne inclusive)
- **COR1** fragments complets : 5 832/5 832 configurations (3⁶ niveaux × 8 sous-ensembles de voies)
- **COR2** double chemin entiers purs ≡ VRAI moteur : 5 832/5 832 · junctions SILENCIEUSE ⇔ aucun ÉLEVÉ · LUMIÈRE/DEUX ⇔ ÉLEVÉ présent · CRISE_HÉRITÉE ⇔ voies non vides (override préempte) — 0 écart
- **COR3** seuils : S1 5 103 · S2 63 · bornes réelles consignées (3,50 PILE inclusive · 2,50 PILE)
- **COR4** vocabulaire : 0 mot interdit sur 736 textes distincts · D-SIM 100 % · exception sourcée (« trouble » = case du canon, D-TABLE F-S2)
- **COR5** anti-fabrication : forces affichées ≡ VRAI forces_affichees 5 832/5 832 · aucune force affichée en crise (override A3 respecté) · zone calme (template réel) ssi SILENCIEUSE tout-FAIBLE · exclues jamais affichées comme retenues (2 560 exclues tracées)
- **COR6** re-score bit-exact : 520 profils régénérés par le VRAI simulateur seed 42 — stats 9/9 classes bit-exact · conformité table 520/520 · voies G6 (30 SM-C1 + 20 H5) bit-exact · 1 560 comparaisons, 0 écart · couche appliquée : 🟢 439 · 🟠 31 · 🔴 50
- **COR7** couplage pas : 3 paliers via le VRAI palier_de/pas_de sur les 9 croix · 🔴 → aucun pas 1/1 · suivi 15/15 sans sanction · re-test 8 semaines · junction Q3↔Q5 9/9
- **COR8** reproductibilité : ×2, SHA-256 identiques `23c0ad330b71276e…`

**Re-score** : RIO-13 = 71 % → **100 %** (F1 25 inchangé · F2 22→25 · F3 14→25 · F4 10→25).

## Exécution

```bash
python3 src/wtc_sm_q3_correction_validation.py   # ~3 s (5 832 × 2)
```

## Limites (lues avant toute décision)

Simulation seule (D-SIM) — VALID-01 reste vraie. Libellés des items absents (action n°3). La crise est HÉRITÉE uniquement (0 voie nouvelle — le verrouillage le veut) : les voies arrivent de RIO-11/RIO-12 ou de la sécurité, jamais recalculées ici. Exception sourcée consignée (case « trouble » du canon). Récapitulatif de DIMENSION = action n°2.

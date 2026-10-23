# WTC-SM-Q5 — CORRECTION PHILOSOPHIQUE (fichier SUPPLÉMENTAIRE — RIO-15)

> **Ce que ceci est** : le fichier de correction demandé par le fondateur (même ordre que RIO-01→04, RIO-06→14, trace 1a15ed7ad00bc0fd) pour porter RIO-15 « Mon premier pas vers l'autre rive » de 86/100 à **95/100 — le maximum atteignable au barème** (plafond structurel F1 = 20 des quêtes pas, consigné : RIO-05/10/15/18/23 sont notées F1 20, prétendre 100 % serait une fabrication), en ajoutant les calculs manquants **sans rien modifier d'existant**.
> **Ce que ceci n'est PAS** : une retouche du moteur. Le vrai cœur reste `../../src/wtc_sm_q5_core.py` (SPEC verrouillée 18/10 — check-in binaire 9/14 · banque de 6 pas · table palier = max + override crise · RCI L7 verbatim · 0 sanction) — importé tel quel, intégrité vérifiée à l'import. Aucun moteur SM Q1/Q2/Q3/Q4 n'a été touché.

## La règle du jeu (demande fondateur)

1. Ne pas modifier ce qui a été fait — uniquement ajouter des fichiers.
2. Mettre l'accent sur les CALCULS et l'exactitude des résultats.
3. Déceler sans nommer les pathologies (arbitrage Task 164).

## Contenu

| Fichier | Rôle |
|---|---|
| `src/wtc_sm_q5_correction.py` | La couche de correction : importe les VRAIS moteurs (sm-q5 cœur verrouillé, sm-q3 forces, sm-q4 config tracée + templates, sm-q2 filet amont — intégrité vérifiée, zéro réimplémentation) et ajoute F2 (palier AFFICHÉ = la sortie du VRAI `palier_de` + QUAND DEMANDER DE L'AIDE + la doctrine du pas affichée : choisi jamais prescrit, célébré jamais sanctionné, compteur privé), F3 PRÉSERVÉ tel quel (la banque réelle + check-in + re-test validés P1 — les pas affichés sont les VRAIS, jamais réécrits), F4 (fragment L8 à 7 blocs avec RCI réel et config tracée). Règles R1-R9 pré-enregistrées. |
| `src/wtc_sm_q5_correction_validation.py` | Le pipeline de preuve : frontières du moteur (engagement 15 totaux, RCI 0,58/0,41/0,40, asymétrie temporelle, agrégation max, table palier 9 croix + override, banque injective), énumération EXHAUSTIVE de 288 états (9 cellules × 2 crise × 16 séries) + balayage RCI binaire exact, re-score bit-exact des 540 couples archivés, banque + suivi + junction forces, ×2 SHA-256. |
| `results/correction_criteres.json` | Agrégats + COR0-COR8 + SHA-256 des 2 exécutions. |
| `results/rapport-correction-RIO-15.md` | Le rapport complet. |

## Résultat (tous critères PASS — détail dans le rapport)

- **COR0** frontières réelles : engagement 15/15 (CÉLÉBRÉ ≥ 9 PILE, None = non déployé) · RCI 8/8 frontières exactes (3,58→FIABLE · 3,41→SUGGESTION · 3,40→BRUIT — 2 sens) · asymétrie temporelle 8/8 · agrégation max 9/9 · table palier 9/9 + override · banque injective 6 pas uniques
- **COR1** fragments complets : 288/288 configurations (9 cellules × 2 crise × 16 séries)
- **COR2** double chemin (max-rang entiers ≡ VRAI `palier_de`, assert à chaque appel) : 288/288
- **COR3** seuils : S1 224 (ORIENTATION) · S2 48 (MODULE DE COUPLE) — bornes L7 verbatim consignées, 0 ajouté
- **COR4** vocabulaire : 0 mot interdit sur 288 textes distincts · D-SIM 100 % · exceptions sourcées (filet amont · case « trouble » de la vraie banque)
- **COR5** anti-fabrication / doctrine du pas : 0 pas hors banque (champ libre réel à part) · 0 mot de sanction sur 288 écrans · zone calme (template réel) ssi palier vert hors crise · 0 pas en crise (VRAI `pas_de` → None) · balayage RCI 45/45
- **COR6** re-score bit-exact : 540 couples régénérés par le VRAI simulateur seed 42 — stats 12/12 groupes · conformité per-couple 540/540 · engagement (CÉLÉBRÉ 415 · EN CHEMIN 75 · NON_DÉPLOYÉ 50) · 1 080 comparaisons, 0 écart · couche appliquée : 🟢 46 · 🟠 404 · 🔴 90
- **COR7** banque + suivi : 4 pas servis (VRAIE banque) · 🔴 → aucun 14/14 · champ libre réel 1/1 · suivi 15/15 sans sanction · re-test 8 semaines · junction forces Q3 1/1 (le pas 🟢 pointe la banque MESURÉE)
- **COR8** reproductibilité : ×2, SHA-256 identiques `7b4b690d90f9e205…`

**Re-score** : RIO-15 = 86 % → **95 %** (F1 20 INCHANGÉ — plafond structurel · F2 23→25 · F3 25 PRÉSERVÉ · F4 18→25).

## Exécution

```bash
python3 src/wtc_sm_q5_correction_validation.py   # ~4 s (288 × 2 + re-score 540)
```

## Limites (lues avant toute décision)

Simulation seule (D-SIM) — VALID-01 reste vraie. F1 = 20 est un PLAFOND STRUCTUREL du barème pour les quêtes pas (la lecture graduée appartient aux quêtes amont dont le pas hérite) — 95 % est le maximum atteignable, consigné comme tel. Crise héritée uniquement (0 voie nouvelle) — jamais de pas de couple en crise. Le VRAI `signification_de` retourne une chaîne vide hors traversée : affiché « niveau stable » (la donnée réelle, dite). Récapitulatif de DIMENSION = action n°2.

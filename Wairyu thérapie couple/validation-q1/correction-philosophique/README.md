# WTC-Q1 — CORRECTION PHILOSOPHIQUE (fichier SUPPLÉMENTAIRE — RIO-01)

> **Ce que ceci est** : le fichier de correction demandé par le fondateur (trace 1a15ed7ad00bc0fd) pour porter RIO-01 « Comment je me raccroche » de 53/100 à 100/100 sur la grille de l'audit du 21/10 (Task 163), en ajoutant les calculs manquants **sans rien modifier d'existant**.
> **Ce que ceci n'est PAS** : une retouche du moteur. Le vrai cœur reste `../../validation-q1-r1/src/wtc_q1_core.py` (révision R1) — importé tel quel, intégrité vérifiée à l'import. Aucun moteur Q1/Q4/Q5 n'a été touché.

## La règle du jeu (demande fondateur)

1. Ne pas modifier ce qui a été fait — uniquement ajouter des fichiers.
2. Mettre l'accent sur les CALCULS et l'exactitude des résultats.
3. Déceler sans nommer les pathologies (arbitrage Task 164) : présenter le problème avec son niveau de gravité, expliquer comment il peut affecter la relation et la vie de couple, proposer des pistes de solution.

## Contenu

| Fichier | Rôle |
|---|---|
| `src/wtc_q1_correction.py` | La couche de correction : importe les VRAIS moteurs (q1-r1, q4, q5) et ajoute F2 (palier 🟢🟠🔴 + seuils d'aide S1/S2 + zone d'ombre causale sans étiquette), F3 (contenu des 3 paliers + branchement quête « pas »), F4 (fragment de bilan L8 à 7 blocs). Règles R1-R9 pré-enregistrées en tête de fichier. |
| `src/wtc_q1_correction_validation.py` | Le pipeline de preuve : énumération EXHAUSTIVE des 10⁶ configurations de faces atteignables, re-score bit-exact des 520 réponses archivées R1, gate qualité, vocabulaire écran, couplage pas, exécution ×2 (SHA-256). |
| `results/correction_criteres.json` | Les agrégats complets + les 8 critères COR1-COR8 + SHA-256 des 2 exécutions. |
| `results/rapport-correction-RIO-01.md` | Le rapport complet : règles, méthode, chiffres exacts, re-score F1-F4, limites honnêtes. |

## Résultat (tous critères PASS — détail dans le rapport)

- **COR1** fragment de bilan complet : 1 000 000/1 000 000
- **COR2** palier : 2 chemins de calcul convergents 1 000 000/1 000 000
- **COR3** seuils d'aide : S1 68 775 · S2 434 496 · 0 borne pile
- **COR4** vocabulaire écran : 0 mot interdit (175 textes distincts, D-SIM 100 %)
- **COR5** anti-fabrication : 951 600/951 600 · 0 abus
- **COR6** gate qualité : re-score bit-exact 520 lignes, 0 écart · pièges 20/20 · suspension 4/4 (cas synthétiques D-SIM)
- **COR7** couplage pas : 9/9 via la vraie table Q5 · junction Q1↔Q4/Q5 cohérente 28/28
- **COR8** reproductibilité : pipeline ×2, SHA-256 identiques

**Re-score** : RIO-01 = 53 % → **100 %** (F1 25 · F2 25 · F3 25 · F4 25). Moyenne attachement 57,4 % → **66,8 %** · global 23 quêtes 70,1 % → **72,2 %**.

## Exécution

```bash
python3 src/wtc_q1_correction_validation.py   # ~3,5 min (10^6 × 2)
```

## Limites (lues avant toute décision)

Tout est validé en simulation (bandeau D-SIM sur chaque écran) — la limite « zéro réel » de l'audit (VALID-01) reste vraie. Le récapitulatif de DIMENSION (fédération des 5 fragments) reste l'action n°2 de l'audit. D-CRISE non applicable à cet instrument (consigné). Les libellés réels des 18 questions restent à déposer (action n°3).

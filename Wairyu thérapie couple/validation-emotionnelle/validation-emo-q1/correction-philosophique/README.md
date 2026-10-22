# WTC-EMO-Q1 — CORRECTION PHILOSOPHIQUE (fichier SUPPLÉMENTAIRE — RIO-06)

> **Ce que ceci est** : le fichier de correction demandé par le fondateur (même ordre que RIO-01/02/03, trace 1a15ed7ad00bc0fd) pour porter RIO-06 « Ma météo intérieure » de 53/100 à 100/100 sur la grille de l'audit du 21/10 (Task 163), en ajoutant les calculs manquants **sans rien modifier d'existant**.
> **Ce que ceci n'est PAS** : une retouche du moteur. Le vrai cœur reste `../../src/wtc_emo_q1_core.py` (fondation v1.1, faute n°16 pré-attrapée) — importé tel quel, intégrité vérifiée à l'import. Aucun moteur émotionnel Q1/Q2/Q4/Q5 n'a été touché.

## La règle du jeu (demande fondateur)

1. Ne pas modifier ce qui a été fait — uniquement ajouter des fichiers.
2. Mettre l'accent sur les CALCULS et l'exactitude des résultats.
3. Déceler sans nommer les pathologies (arbitrage Task 164) : présenter le problème avec son niveau de gravité, expliquer comment il peut affecter la relation et la vie de couple, proposer des pistes de solution.

## Contenu

| Fichier | Rôle |
|---|---|
| `src/wtc_emo_q1_correction.py` | La couche de correction : importe les VRAIS moteurs (émo-q1 cœur+simulateur, émo-q2 zones, émo-q4 configurations, émo-q5 pas/suivi/re-test) et ajoute F2 (palier 🟢🟠🔴 max-niveau via les VRAIS seuils 3,5/2,5 du cœur + seuils d'aide S1/S2 + zone d'ombre causale sans étiquette), F3 (contenu des 3 paliers + branchement quête « pas » sur le vrai arbre émotionnel), F4 (fragment de bilan L8 à 7 blocs avec junctions réelles). Règles R1-R9 pré-enregistrées en tête de fichier. |
| `src/wtc_emo_q1_correction_validation.py` | Le pipeline de preuve : compactations PROUVÉES (items→sommes, blocs 1 250→72, journal 512→18, espions, DP exacte 5²⁷), énumération EXHAUSTIVE des 5 694 624 états distincts de la couche, re-score bit-exact des 475 profils archivés, couplage pas 8/8, exécution ×2 (SHA-256). |
| `results/correction_criteres.json` | Les agrégats complets + les critères COR0-COR8 + SHA-256 des 2 exécutions. |
| `results/rapport-correction-RIO-06.md` | Le rapport complet : règles, méthode, chiffres exacts, re-score F1-F4, limites honnêtes. |

## Résultat (tous critères PASS — détail dans le rapport)

- **COR0** compactations prouvées : 375 + 10 000 + 4 096 vérifs · DP 5²⁷ bit-exact · 2 197/2 197 sommes · 2 bandes co-atteignables 2 197+2 197
- **COR1** fragment de bilan complet : 421 200/421 200 lectures (+ 68/68 archivés)
- **COR2** palier : double chemin (entiers purs ≡ vrai cœur) 2 197/2 197 · junction classification ↔ palier 0 écart (RÉGULÉ ⇔ 🟢 exactement)
- **COR3** seuils d'aide : S1 4 367 520 · S2 1 003 104 · 0 borne pile (dist min 1/6 · 3/260 · 1/18)
- **COR4** vocabulaire écran : 0 mot interdit (417 textes distincts, D-SIM 100 %)
- **COR5** anti-fabrication : 0 écart sur les lectures · 0 calme sur suspension · templates ≡ forces retenues
- **COR6** re-score bit-exact : 475 profils, 3 911 comparaisons, 0 écart · distributions §E 35/35 · exemples §D 4/4 · C1b 40/40 · C1c 20/20 · ASYM 15/15
- **COR7** couplage pas : 8/8 via le vrai arbre émotionnel (32 448 combinaisons) · suivi 15/15 sans sanction · re-test 8 semaines · co-régulation 13/13
- **COR8** reproductibilité : pipeline ×2, SHA-256 identiques `62b360bcd9c996cf…`

**Re-score** : RIO-06 = 53 % → **100 %** (F1 25 · F2 25 · F3 25 · F4 25). Dimension émotionnelle 57,8 % → **67,2 %** · global 23 quêtes 76,3 % → **78,3 %**.

## Exécution

```bash
python3 src/wtc_emo_q1_correction_validation.py   # ~7 min (5 694 624 × 2)
```

## Limites (lues avant toute décision)

Tout est validé en simulation (bandeau D-SIM sur chaque écran) — la limite « zéro réel » de l'audit (VALID-01) reste vraie. Le gate RQS du vrai cœur est strict sur les profils simulés (68/475 lectures affichées — signal géométrique consigné, D-Q3-J) : on ne lit rien sur du bruit, le re-test est proposé. D-CRISE non applicable à cet instrument (consigné — le cœur émotionnel ne mesure aucun construit d'auto-danger). Les héritages Q2 du pas sont balayés, pas devinés (RIO-07 viendra les mesurer). Le récapitulatif de DIMENSION (fédération des 5 fragments) reste l'action n°2 de l'audit. Les libellés réels des questions restent l'action n°3.

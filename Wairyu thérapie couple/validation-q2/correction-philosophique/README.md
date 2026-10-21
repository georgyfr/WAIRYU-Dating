# WTC-Q2 — CORRECTION PHILOSOPHIQUE (fichier SUPPLÉMENTAIRE — RIO-02)

> **Ce que ceci est** : le fichier de correction demandé par le fondateur (même
> ordre que RIO-01, trace 1a15ed7ad00bc0fd, exécution du 21-22/10) pour porter
> RIO-02 « Ce qui m'effraie vraiment » de 53/100 à 100/100 sur la grille de
> l'audit du 21/10 (Task 163), en ajoutant les calculs manquants **sans rien
> modifier d'existant**.
> **Ce que ceci n'est PAS** : une retouche du moteur. Le vrai cœur reste
> `../../validation-q2-r1/src/wtc_q2_core.py` (révision R1, D-Q2-A à D-Q2-F) —
> importé tel quel, intégrité vérifiée à l'import (35/35 templates). Aucun
> moteur Q2/Q4/Q5 n'a été touché.

## La règle du jeu (demande fondateur — identique à RIO-01)

1. Ne pas modifier ce qui a été fait — uniquement ajouter des fichiers.
2. Mettre l'accent sur les CALCULS et l'exactitude des résultats.
3. Déceler sans nommer les pathologies (arbitrage Task 164) : présenter le
   problème avec son niveau de gravité, expliquer comment il peut affecter la
   relation et la vie de couple, proposer des pistes de solution.

## Contenu

| Fichier | Rôle |
|---|---|
| `src/wtc_q2_correction.py` | La couche de correction : importe les VRAIS moteurs (q2-r1, q4, q5) et ajoute F2 (« QUAND DEMANDER DE L'AIDE » — seuils S1/S2 — + zone d'ombre causale affichée), F3 (contenu des 3 paliers + branchement quête « pas » sur le vrai `selectionner_pas`), F4 (fragment de bilan L8 à 7 blocs). Règles R1-R9 pré-enregistrées en tête de fichier. |
| `src/wtc_q2_correction_validation.py` | Le pipeline de preuve : énumération EXHAUSTIVE de l'espace des états moteur distincts (7 cd × 5 cp × 100 H × 16 R × 5 i_alarm × 12 bandes sA/sB × 2 sorties zone_force = 6 720 000 configurations), batterie de frontière ±ε, re-score bit-exact des 437 sorties archivées R1, couplage pas 18/18, exécution ×2 (SHA-256). |
| `results/correction_criteres.json` | Les agrégats complets + les 8 critères COR1-COR8 + SHA-256 des 2 exécutions. |
| `results/rapport-correction-RIO-02.md` | Le rapport complet : règles, méthode, chiffres exacts, re-score F1-F4, limites honnêtes. |

## Résultat (tous critères PASS — détail dans le rapport)

- **COR1** fragment de bilan complet : 6 720 000/6 720 000 · 437/437 archivées
- **COR2** palier : chemin indépendant ≡ vrai cœur, 6 720 000/6 720 000 · 0 écart sur les 437 (palier ET palier_recalcule)
- **COR3** seuils d'aide : S1 4 312 000 · S2 1 351 318 · 0 borne pile (dist min 0,01/0,03/0,05) · batterie de frontière 9/9
- **COR4** vocabulaire écran : 0 mot interdit (626 textes distincts + standings + libellés du cœur) · D-SIM 100 %
- **COR5** anti-fabrication : « rien à fabriquer » ssi ZONE CALME · force affichée ≡ vrai zone_force, 0 abus
- **COR6** gate convergence : re-score BIT-EXACT 437 lignes, 0 écart · suppression 35/35 (note 35/35) · prudence 14/14 (note 14/14) · pièges P-INCS 6/6 · P-INCD 4/4 · P-SEC 8/8 · P-FILT 5/5 · arêtes E1-E8 8/8
- **COR7** couplage pas : 18/18 (3 faces Q1 × 6 étiquettes Q2) via le vrai `selectionner_pas` · identité face Q5 ⇔ type Q4 12/12 · suivi 14 jours sans sanction 15/15
- **COR8** reproductibilité : pipeline ×2, SHA-256 identiques `f195ee3d0b2961fa…`

**Re-score** : RIO-02 = 53 % → **100 %** (F1 25 · F2 25 · F3 25 · F4 25). Moyenne attachement (100+100+53+61+67)/5 = **76,2 %** · global 23 quêtes 1 708/23 = **74,3 %**.

## Exécution

```bash
# mode complet (~2 min 30, ×2)
python3 src/wtc_q2_correction_validation.py
# mode tronçonné (sandbox à fenêtre courte) — résultat bit-identique :
# CORR_RUN=1|2 CORR_PART=c1|c2|c3|c4|rest|merge puis CORR_PART=final
```

## Limites (lues avant toute décision)

Tout est validé en simulation (bandeau D-SIM sur chaque écran) — la limite « zéro réel » de l'audit (VALID-01) reste vraie. Les FAIL hérités du package R1 sont CONSERVÉS tels quels (C1a 81,0 % < 82 % · C2 : 1 FP p_filtre sur 400 — T3_LESDEUX-047) : la correction ne les masque pas. Le `longitudinal()` du cœur reste NON TESTÉ (D-Q2-F, consigné à l'écran comme au rapport). Le récapitulatif de DIMENSION (fédération des fragments) reste l'action n°2 de l'audit. Les libellés réels des questions restent à déposer (action n°3).

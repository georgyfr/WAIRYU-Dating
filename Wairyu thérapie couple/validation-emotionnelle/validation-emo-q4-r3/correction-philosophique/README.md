# WTC-EMO-Q4-R3 — CORRECTION PHILOSOPHIQUE (fichier SUPPLÉMENTAIRE — RIO-09)

> **Ce que ceci est** : le fichier de correction demandé par le fondateur (même ordre que RIO-01→08, trace 1a15ed7ad00bc0fd) pour porter RIO-09 « Nos deux langues » de 61/100 à 100/100 sur la grille de l'audit du 21/10 (Task 163), en ajoutant les calculs manquants **sans rien modifier d'existant**.
> **Ce que ceci n'est PAS** : une retouche du moteur. Le vrai moteur reste `../../src/wtc_emo_q4_core.py` (R3 — moyennes par canal D-EMO-5, asymétrie interne des bids, CROISÉE testée avant DONNEUR) — importé tel quel, intégrité vérifiée à l'import. Aucun moteur n'a été touché.

## La règle du jeu (demande fondateur)

1. Ne pas modifier ce qui a été fait — uniquement ajouter des fichiers.
2. Mettre l'accent sur les CALCULS et l'exactitude des résultats.
3. Déceler sans nommer les pathologies (arbitrage Task 164).

## Contenu

| Fichier | Rôle |
|---|---|
| `src/wtc_emo_q4_correction.py` | La couche de correction : importe les VRAIS moteurs (émo-q4-r3 + simulateur seed 42 · émo-q2-r1 valeurs Q2 réelles · émo-q5 pas/suivi/re-test) et ajoute F2 (palier de COUPLE 🟢🟠🔴 dérivé des VRAIES sorties : S1 = paire explosive du VRAI co_regulation — inclut FEU CROISÉ ; S2 = boucle asymétrique du VRAI boucle_bids ou configuration à convertir + QUAND DEMANDER DE L'AIDE version couple + doctrine crise active appliquée : apaisement avant tout dialogue), F3 (contenu des 3 paliers PAR CONFIGURATION RÉELLE — les 9 noms D-NOMENCLATURE — + pas pour CHACUN des deux partenaires + suivi + re-test), F4 (fragment L8 7 blocs niveau couple). Règles R1-R9 pré-enregistrées. |
| `src/wtc_emo_q4_correction_validation.py` | Le pipeline de preuve : compactations PROUVÉES (donne 125→18 états par partenaire — 6 inateignables prouvés par recherche exhaustive · bids 625→25 écarts · er1 2 classes avec PILE 3,00), énumération EXHAUSTIVE des 746 496 états distincts, re-score bit-exact des 450 couples archivés R3, symétrie vérifiée sur toute l'énumération + les 450, couplage pas 8/8 × 2 partenaires, exécution ×2 (SHA-256). |
| `results/correction_criteres.json` | Les agrégats complets + les critères COR0-COR8 + SHA-256 des 2 exécutions. |
| `results/rapport-correction-RIO-09.md` | Le rapport complet : règles, méthode, chiffres exacts, re-score F1-F4, limites honnêtes. |

## Résultat (tous critères PASS — détail dans le rapport)

- **COR0** compactations prouvées : donne 250 vérifs (0 écart, 6 états inateignables prouvés) · moyennes 13 (bornes consignées : 2,5 NON pile dist 1/6 · 3,00 PILE · 4,00 PILE) · bids 625→25 (0 écart) · espions er (pile inclusif) et score_A/label_ombre jamais lus
- **COR1** fragment de bilan complet : 746 496/746 496 états distincts (+ 450/450 couples archivés)
- **COR2** palier de couple : double chemin (entiers ≡ VRAIES sorties) 746 496/746 496 · junctions S1 ⇔ 🔴, S2 ⇔ 🟠 exactement
- **COR3** seuils d'aide : S1 186 624 · S2 461 943 · 0 seuil ajouté · bornes moteur consignées (3,00 PILE, 4,00 PILE, asymétrie ≥ 2 entière)
- **COR4** vocabulaire écran : 0 mot interdit (2 listes) sur 746 496 textes distincts, D-SIM 100 %
- **COR5** anti-fabrication : configuration ≡ VRAI moteur (9 noms D-NOMENCLATURE) · templates réels cités · jamais de score d'affinité ni de blâme (C3a/C3b/C3c 0)
- **COR6** re-score bit-exact : 450 couples R3 (seed 42), 2 790 comparaisons, 0 écart · C1 9/9 groupes conformes (CROISÉE 24/50 = 48 % — chevauchement géométrique S-EMO-Q4-R3-1 CONSERVÉ consigné, option d'arbitrage ouverte) · distributions 9/9 (81 cellules) · C2 symétrie 450/450 (logique exacte archivée : config ≡ swap OU paire miroir) · 0 désaccord config_vraie (D-VÉRITÉ 9/9) · boucles 9/9 · paires explosives 9/9
- **COR7** couplage pas : 8/8 pour CHACUN des deux partenaires (32 352 combinaisons, zones Q2 mesurées portées par le croisement) · suivi 15/15 · re-test 8 semaines · co-régulation 3,0 PILE consignée
- **COR8** reproductibilité : pipeline ×2, SHA-256 identiques `22a082602589022d…`

**Re-score** : RIO-09 = 61 % → **100 %** (F1 25 · F2 25 · F3 25 · F4 25). Dimension émotionnelle 85,6 % → **93,4 %** (467/5) · global 23 quêtes 82,3 % → **84,0 %** (1 933/23).

## Exécution

```bash
python3 src/wtc_emo_q4_correction_validation.py   # ~6 min (746 496 × 2 — tables incluses)
```

## Limites (lues avant toute décision)

Tout est validé en simulation (D-SIM) — VALID-01 reste vrai. Le chevauchement géométrique CROISÉE (48 % < 62 %, S-EMO-Q4-R3-1) est CONSERVÉ et consigné — l'option de requalification du seuil reste à la décision du fondateur. D-CRISE non applicable (consigné) ; la crise de COUPLE active est traitée par la doctrine du vrai moteur (apaisement avant tout dialogue — template FEU CROISÉ cité mot pour mot). Les 6 états de donne inateignables sont prouvés par recherche exhaustive (moyenne ≥ 4 ⟹ vmax ≥ 4 ; dégénérescence de l'argmax sur (3,3,3)). Les héritages Q2 (RIO-07, pour chacun des deux partenaires), cœur (RIO-06) et pas (RIO-10) sont balayés, jamais devinés. Le récapitulatif de DIMENSION reste l'action n°2 ; les libellés réels des questions restent l'action n°3.

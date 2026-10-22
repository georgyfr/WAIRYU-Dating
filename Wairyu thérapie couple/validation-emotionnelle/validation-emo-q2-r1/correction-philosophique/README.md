# WTC-EMO-Q2-R1 — CORRECTION PHILOSOPHIQUE (fichier SUPPLÉMENTAIRE — RIO-07)

> **Ce que ceci est** : le fichier de correction demandé par le fondateur (même ordre que RIO-01/02/03/06, trace 1a15ed7ad00bc0fd) pour porter RIO-07 « Ce que je n'arrive pas à dire » de 53/100 à 100/100 sur la grille de l'audit du 21/10 (Task 163), en ajoutant les calculs manquants **sans rien modifier d'existant**.
> **Ce que ceci n'est PAS** : une retouche du moteur. Le vrai moteur reste `../../src/wtc_emo_q2_core.py` (M3 — logique inchangée, arbitrage S-EMO-Q2-3 confirmé : « le code était juste, c'est la table de vérité qui avait un label orphelin ») — importé tel quel, intégrité vérifiée à l'import. Aucun moteur émotionnel Q1/Q2/Q4/Q5 n'a été touché.

## La règle du jeu (demande fondateur)

1. Ne pas modifier ce qui a été fait — uniquement ajouter des fichiers.
2. Mettre l'accent sur les CALCULS et l'exactitude des résultats.
3. Déceler sans nommer les pathologies (arbitrage Task 164) : présenter le problème avec son niveau de gravité, expliquer comment il peut affecter la relation et la vie de couple, proposer des pistes de solution.

## Contenu

| Fichier | Rôle |
|---|---|
| `src/wtc_emo_q2_correction.py` | La couche de correction : importe les VRAIS moteurs (émo-q2-r1 M3 + simulateur R1 seed 42 · émo-q4 configurations · émo-q5 pas/suivi/re-test) et ajoute F2 (le palier 🟢🟠🔴 DE LA QUÊTE — la fonction `palier` du VRAI moteur, validée telle quelle + seuils d'aide S1 = 🔴 / S2 = 🟠 + zone d'ombre causale via les VRAIS templates cités mot pour mot), F3 (contenu des 3 paliers + branchement quête « pas » sur le vrai arbre émotionnel avec les héritages Q2 **MESURÉS par cette quête** — la boucle annoncée par RIO-06 est fermée ici), F4 (fragment de bilan L8 à 7 blocs avec junctions réelles). Règles R1-R9 pré-enregistrées en tête de fichier. |
| `src/wtc_emo_q2_correction_validation.py` | Le pipeline de preuve : compactations PROUVÉES (items→moyennes 750 vérifs, boucle 50, terrain 8→2, espions CI + clés parasites, DP exacte 5⁹), énumération EXHAUSTIVE des 4 394 000 états distincts de la couche, re-score bit-exact des 460 profils archivés R1, couplage pas 8/8 avec héritages Q2 mesurés, exécution ×2 (SHA-256). |
| `results/correction_criteres.json` | Les agrégats complets + les critères COR0-COR8 + SHA-256 des 2 exécutions. |
| `results/rapport-correction-RIO-07.md` | Le rapport complet : règles, méthode, chiffres exacts, re-score F1-F4, limites honnêtes. |

## Résultat (tous critères PASS — détail dans le rapport)

- **COR0** compactations prouvées : 750 + 50 + 8 + 144 + 3 vérifs · DP 5⁹ = 1 953 125 bit-exact · 2 197/2 197 triplets de sommes · 8/8 bandes D-ÉCHELLE co-atteignables · convergence entiers ≡ moteur 549 250/549 250
- **COR1** fragment de bilan complet : 549 250/549 250 états distincts (+ 460/460 archivés)
- **COR2** palier : double chemin (entiers purs ≡ vrai moteur) 4 394 000/4 394 000 · junctions S1 ⇔ 🔴, S2 ⇔ 🟠 exactement · CI applicable ⇔ vif × dominante (12 tables, 0 écart)
- **COR3** seuils d'aide : S1 425 880 · S2 3 241 472 · 0 seuil numérique ajouté par la couche · bornes du VRAI moteur consignées (2,60 non pile — dist min 0,07 · **4,00 pile atteignable** — borne inclusive du palier réel, 338 000 configs · **3,00 pile** — D-ÉCHELLE inclusive)
- **COR4** vocabulaire écran : 0 mot interdit (les 2 listes) sur 549 250 textes distincts, D-SIM 100 %
- **COR5** anti-fabrication : « rien à fabriquer » ⇔ palier 🟢 exactement · 5 templates réels cités par lecture · C3b/C3c vérifiés sur toute l'énumération · l'invalidé jamais minimisé
- **COR6** re-score bit-exact : 460 profils R1 (seed 42), 4 153 comparaisons, 0 écart · C1a 87,63 % · C1b 81,82 % (E5 20/20, E6 20/20 — S-EMO-Q2-3 confirmé ; E3 57/80 conservé consigné S-EMO-Q2-R1-1) · C1c 96,67 % · C2 180/180 · C3 0/0/0 · D-VÉRITÉ 4/4 · paliers 8/8 groupes · pièges 🟢 30/30 · 🔴 10/10
- **COR7** couplage pas : 8/8 via le vrai arbre émotionnel (32 448 combinaisons, INV/RC décidés par les VRAIES zones/labels mesurés — invariants 10/10) · suivi 15/15 sans sanction · re-test 8 semaines · couple : le VRAI configuration_devises alimenté par la VRAIE zone mesurée (MIXTE POURSUITE ⇔ zone ≠ ABSENT — l'exclusion de la config complémentaire est structurelle, consignée)
- **COR8** reproductibilité : pipeline ×2, SHA-256 identiques `522541092066c7da…`

**Re-score** : RIO-07 = 53 % → **100 %** (F1 25 · F2 25 · F3 25 · F4 25). Dimension émotionnelle 67,2 % → **76,6 %** (383/5) · global 23 quêtes 78,3 % → **80,4 %** (1 849/23).

## Exécution

```bash
python3 src/wtc_emo_q2_correction_validation.py   # ~6 min (4 394 624 × 2 — tables incluses)
```

## Limites (lues avant toute décision)

Tout est validé en simulation (bandeau D-SIM sur chaque écran) — la limite « zéro réel » de l'audit (VALID-01) reste vraie. Le chevauchement géométrique E3 (C1b global 81,82 % < 83 %, S-EMO-Q2-R1-1, type D-Q4-2) est **conservé et consigné, jamais masqué** — F1 reste 25 parce que l'audit l'a déjà consigné ainsi ; les trois options d'arbitrage restent ouvertes pour le fondateur. D-CRISE non applicable à cet instrument (consigné — il ne mesure aucun construit d'auto-danger ; le filet de l'app reste porté par RIO-02 côté attachement). Aucun gate RQS sur cet instrument — aucune suspension inventée (R4) ; la prudence CI (vrai index_p) est le seul statut de qualité défini. Les héritages cœur (RIO-06), couple (RIO-09) et ombre attachement (RIO-01/02) sont balayés, jamais devinés. Le récapitulatif de DIMENSION reste l'action n°2 ; les libellés réels des questions restent l'action n°3.

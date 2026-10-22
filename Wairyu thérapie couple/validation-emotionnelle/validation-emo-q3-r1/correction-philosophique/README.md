# WTC-EMO-Q3-R1 — CORRECTION PHILOSOPHIQUE (fichier SUPPLÉMENTAIRE — RIO-08)

> **Ce que ceci est** : le fichier de correction demandé par le fondateur (même ordre que RIO-01/02/03/06/07, trace 1a15ed7ad00bc0fd) pour porter RIO-08 « Ce que mon cœur sait faire » de 55/100 à 100/100 sur la grille de l'audit du 21/10 (Task 163), en ajoutant les calculs manquants **sans rien modifier d'existant**.
> **Ce que ceci n'est PAS** : une retouche du moteur. Le vrai moteur reste `../../src/wtc_emo_q3_core.py` (M1 — D-DENSITÉ uniformisée, arbitrage S-EMO-Q3-2 confirmé : toutes les forces à 2 voies max, C2 = 100 % — 0 désaccord moteur/simulateur sur 475 profils) — importé tel quel, intégrité vérifiée à l'import. Aucun moteur émotionnel n'a été touché.

## La règle du jeu (demande fondateur)

1. Ne pas modifier ce qui a été fait — uniquement ajouter des fichiers.
2. Mettre l'accent sur les CALCULS et l'exactitude des résultats.
3. Déceler sans nommer les pathologies (arbitrage Task 164).

## Contenu

| Fichier | Rôle |
|---|---|
| `src/wtc_emo_q3_correction.py` | La couche de correction : importe les VRAIS moteurs (émo-q3-r1 M1 + simulateur seed 42 · émo-q1 pour les VRAIS seuils du plancher · émo-q2-r1 pour les valeurs Q2 réelles · émo-q4 configurations · émo-q5 pas/suivi/re-test) et ajoute F2 (palier 🟢🟠🔴 PLANCHER HÉRITÉ — le VRAI rang des faces E-R1/E-R3 via les seuils du cœur 3,5/2,5 + S1 = plancher 🔴 / S2 = plancher 🟠 ou cœur SILENCIEUSE + PLANCHER PARTIEL consigné — E-R2 absente du moteur : borne basse, monotonie du max), F3 (contenu des 3 paliers par force réelle + branchement quête « pas » avec cap et forces retenues MESURÉS + suivi 14 j + re-test), F4 (fragment L8 7 blocs). Règles R1-R9 pré-enregistrées. |
| `src/wtc_emo_q3_correction_validation.py` | Le pipeline de preuve : compactations PROUVÉES (rangs 13→4 par face, espions journal/n, frontières des voies, 4 statuts résolus, garde, classe er1 exacte), énumération EXHAUSTIVE des 560 000 états distincts, re-score bit-exact des 475 profils archivés R1, couplage pas 8/8, exécution ×2 (SHA-256). |
| `results/correction_criteres.json` | Les agrégats complets + les critères COR0-COR8 + SHA-256 des 2 exécutions. |
| `results/rapport-correction-RIO-08.md` | Le rapport complet : règles, méthode, chiffres exacts, re-score F1-F4, limites honnêtes. |

## Résultat (tous critères PASS — détail dans le rapport)

- **COR0** compactations prouvées : rangs 26 + convergence 26 + frontières 10 + espions 10 + statuts 6 + garde 4 + classe er1 13 — 0 écart partout
- **COR1** fragment de bilan complet : 560 000/560 000 états distincts (+ 475/475 archivés)
- **COR2** palier plancher : double chemin (entiers 4/7/10 ≡ seuils du cœur 3,5/2,5/1,5) 560 000/560 000 · junctions S1 ⇔ 🔴, S2 ⇔ 🟠 exactement
- **COR3** seuils d'aide : S1 245 000 · S2 175 000 (+ surveillance SILENCIEUSE) · 0 borne pile (dist min 1/6) · co-régulation 3,0 PILE atteignable (somme 9 — inclusive, consignée)
- **COR4** vocabulaire écran : 0 mot interdit sur 560 000 textes distincts, D-SIM 100 %
- **COR5** anti-fabrication (LA doctrine de cette quête) : le positif jamais généré — templates ≡ forces retenues du VRAI moteur · SILENCIEUSE ≡ 0 force · exclues jamais affichées, toujours tracées · **observation D-Q3-G consignée** : F-E3 peut être retenue par la voie JOURNAL (m ≥ 4) avec CAP ≠ AC — 3 312 cas documentés dans l'énumération, 0 dans les 475 profils archivés ; la docstring de la garde dépasse son code (elle mesure la voie CAP — le trap C3a, conçu avec journal M < 4) — zéro retouche au moteur
- **COR6** re-score bit-exact : 475 profils R1 (seed 42), 2 857 comparaisons, 0 écart · C2 475/475 (0 désaccord — S-EMO-Q3-2 CLOS) · C1a 40/40 · C1b 20/20 · C1c 70/80 = 87,5 % · C3a 15/15 · cap_global exact · indice 0,577 · observation géométrique H1 15,83 % (borne D-Q3-J 25-45 % — SOUS de 9,17 pts, consignée VALID-01)
- **COR7** couplage pas : 8/8 (32 448 combinaisons — cap et forces retenues MESURÉS, invariants CAP/fallback) · suivi 15/15 sans sanction · re-test 8 semaines · couple : table 9 entrées (classe er1 × zone Q2) — **junction à trois sens consignée** : la paire explosive préempte FEU CROISÉ, les configurations MIXTE ne sont atteignables que pour un er1 non-explosif
- **COR8** reproductibilité : pipeline ×2, SHA-256 identiques `cee44b560898cbd5…`

**Re-score** : RIO-08 = 55 % → **100 %** (F1 25 · F2 25 · F3 25 · F4 25). Dimension émotionnelle 76,6 % → **85,6 %** (428/5) · global 23 quêtes 80,4 % → **82,3 %** (1 894/23).

## Exécution

```bash
python3 src/wtc_emo_q3_correction_validation.py   # ~4 min (560 000 × 2 — tables incluses)
```

## Limites (lues avant toute décision)

Tout est validé en simulation (D-SIM) — VALID-01 reste vrai. Le PLANCHER est PARTIEL (E-R2 non portée par ce moteur — borne basse consignée à l'écran). L'observation D-Q3-G (F-E3 voie journal × CAP ≠ AC) et l'observation géométrique H1 (15,83 % sous la borne 25-45 %) sont CONSERVÉES et consignées, jamais masquées. Le statut SILENCIEUX du journal (N ≥ 5) existe dans le moteur mais le simulateur ne l'échantillonne pas (n < 3) — prouvé par appels directs, prévalence = VALID-01. L'indice de capitalisation est une métrique de population (Section E), jamais un verdict individuel — jamais affichée à l'écran. Les héritages Q2 (RIO-07) et cœur (RIO-06) sont balayés, jamais devinés. Le récapitulatif de DIMENSION reste l'action n°2 ; les libellés réels des questions restent l'action n°3.

# WTC-EMO-Q5 — CORRECTION PHILOSOPHIQUE (fichier SUPPLÉMENTAIRE — RIO-10)

> **Ce que ceci est** : le fichier de correction demandé par le fondateur (même ordre que RIO-01→09, trace 1a15ed7ad00bc0fd) pour porter RIO-10 « Mon premier geste du cœur » de 67/100 à **95/100** sur la grille de l'audit du 21/10 (Task 163) — en ajoutant les calculs manquants **sans rien modifier d'existant**.
> **Ce que ceci n'est PAS** : une retouche du moteur. Le vrai moteur reste `../../src/wtc_emo_q5_core.py` (arbre 8 pas INV > RC > CAP > FE1 > FE6 > ER1 > ER2 > FE3, suivi 14 j, rappels doux, re-test 8 semaines) — importé tel quel, intégrité vérifiée à l'import. Aucun moteur n'a été touché.

## Pourquoi 95 % et pas 100 % (honnêteté du barème)

Le barème de l'audit plafonne **F1 à 20 pour toutes les quêtes « pas »** (la lecture graduée appartient aux quêtes amont dont le pas hérite) — c'est le cas de RIO-05, RIO-10, RIO-15, RIO-18 et RIO-23 dans le document d'audit : les packages de génération 3 les plus complets (RIO-18 = 92 %, RIO-23 = 90 %) n'atteignent pas 100 pour la même raison. RIO-10 atteint donc **20 + 25 + 25 + 25 = 95 %** — le maximum atteignable au barème, tous critères F2/F3/F4 complets.

## La règle du jeu (demande fondateur)

1. Ne pas modifier ce qui a été fait — uniquement ajouter des fichiers.
2. Mettre l'accent sur les CALCULS et l'exactitude des résultats.
3. Déceler sans nommer les pathologies (arbitrage Task 164).

## Contenu

| Fichier | Rôle |
|---|---|
| `src/wtc_emo_q5_correction.py` | La couche : importe les VRAIS moteurs (émo-q5 arbre+suivi+re-test · émo-q1 seuils du plancher · émo-q2-r1 valeurs Q2 · émo-q4-r3 co-régulation) et ajoute F2 (palier 🟢🟠🔴 PLANCHER HÉRITÉ sur les faces E-R1/E-R2 que l'arbre reçoit — VRAIS seuils 3,5/2,5 — PLANCHER PARTIEL consigné : E-R3 absente + S1/S2 + la doctrine du pas affichée : lecture du palier, choisi jamais prescrit, célébré jamais sanctionné), F3 (le contenu existant PRÉSERVÉ : pas réel + suivi réel + rappels doux réels + re-test réel — complété par l'aide selon le plancher), F4 (fragment L8 7 blocs). Règles R1-R9 pré-enregistrées. |
| `src/wtc_emo_q5_correction_validation.py` | Le pipeline de preuve : compactations PROUVÉES (frontière propre de l'arbre er ≥ 3,0 ⇔ s ≥ 9 — PILE consigné — distincte des rangs du palier 4/7/10 · suivi 15 valeurs · espions clés/caps/jours), énumération EXHAUSTIVE des 486 720 états distincts (15 jours × espace complet des héritages 32 448), re-score bit-exact des 520 profils archivés, suivi/re-test/rappels, exécution ×2 (SHA-256, simulateur re-exécuté frais à chaque passage — D-REPRO). |
| `results/correction_criteres.json` | Les agrégats complets + les critères COR0-COR8 + SHA-256 des 2 exécutions. |
| `results/rapport-correction-RIO-10.md` | Le rapport complet : règles, méthode, chiffres exacts, re-score F1-F4, limites honnêtes. |

## Résultat (tous critères PASS — détail dans le rapport)

- **COR0** compactations prouvées : rangs palier 26 (0 écart) · frontière de l'arbre 26/26 (er ≥ 3,0 ⇔ s ≥ 9 — 3,00 PILE, consigné) · convergence 26 · suivi 15/15 (0 sanction) · espions clés/caps/jours (l'arbre ne lit que ses 8 héritages documentés ; PC/AD/PD équivalents ; jours jamais lus par selectionner_pas) · classe er1 exacte (PILE 3,00 inclusif)
- **COR1** fragment de bilan complet : 486 720/486 720 états distincts (+ 520/520 archivés)
- **COR2** palier plancher : double chemin (entiers 4/7/10 ≡ seuils du cœur) 486 720/486 720 · junctions S1 ⇔ 🔴, S2 ⇔ 🟠 exactement · PLANCHER PARTIEL consigné (E-R3 absente)
- **COR3** seuils d'aide : S1 302 400 · S2 112 320 · 0 borne pile (dist min 1/6) · seuils du suivi entiers exacts (≥ 10 / 6-9 / ≤ 5) · co-régulation 3,0 PILE consignée
- **COR4** vocabulaire écran : 0 mot interdit sur 486 720 textes distincts, D-SIM 100 %
- **COR5** anti-fabrication : pas affiché ≡ VRAI arbre (trace de source réelle) · 6 templates réels cités par écran · fallback ER2 tracé honnêtement · JAMAIS de sanction (structurel)
- **COR6** re-score bit-exact : 520 profils (seed 42, simulateur re-exécuté frais), 3 649 comparaisons, 0 écart · C1 520/520 pas ≡ pas_vrai (D-VÉRITÉ éliminatoire) · pas attendu 320/320 sur les groupes déterministes G1-G4 (le bruit D-PARAM peut faire retomber G5/G6/PERFECT/ZERO — consigné) · C2 520/520 · C3 PERFECT→CELEBRE 20/20 · ZERO→REPRISE 20/20 · 0 sanction · anti-perfectionnisme ok · C6 re-test 520/520
- **COR7** couplage pas : les 8 pas réels résolus sur l'espace complet des héritages (INV 324 480 · RC 81 120 · CAP 40 560 · FE1 20 280 · FE6 10 140 · ER1 5 460 · ER2 3 600 · FE3 1 080) · suivi 15/15 · re-test jamais forcé · rappels J1/J7/J14 réels · co-régulation 3,0 PILE
- **COR8** reproductibilité : pipeline ×2, SHA-256 identiques `c3b286c31e1ac253…` (après correction D-REPRO du rng)

**Re-score** : RIO-10 = 67 % → **95 %** (F1 20 — plafond structurel du barème pour les quêtes « pas » · F2 12→25 · F3 20→25 · F4 15→25). Dimension émotionnelle 93,4 % → **99 %** (495/5) · global 23 quêtes 84,0 % → **85,3 %** (1 961/23).

## Exécution

```bash
python3 src/wtc_emo_q5_correction_validation.py   # ~6 min (486 720 × 2)
```

## Limites (lues avant toute décision)

Tout est validé en simulation (D-SIM) — VALID-01 reste vrai. Le PLANCHER est PARTIEL (E-R3 absente des héritages — borne basse consignée). F1 = 20 est un plafond STRUCTUREL du barème pour les quêtes « pas » (consigné — même traitement que RIO-05/15/18/23). La frontière de l'arbre (er ≥ 3,0 ⇔ somme ≥ 9, PILE inclusive) est DIFFÉRENTE des rangs du palier (4/7/10) — l'énumération balaie les 13 valeurs réelles par face, les deux frontières sont vérifiées séparément. Les groupes G5/G6/PERFECT/ZERO du simulateur ne sont pas déterministes (bruit D-PARAM — le pas peut retomber sur ER2/ER1) : le critère éliminatoire reste la D-VÉRITÉ C1 520/520. Les héritages Q2 (RIO-07), cœur (RIO-06), forces/cap (RIO-08) sont balayés sur leurs valeurs réelles, jamais devinés. Le récapitulatif de DIMENSION reste l'action n°2 ; les libellés réels des questions restent l'action n°3.

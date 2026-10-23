# WTC-Q5 — CORRECTION PHILOSOPHIQUE (fichier SUPPLÉMENTAIRE — RIO-05)

> **Ce que ceci est** : le fichier de correction demandé par le fondateur (même ordre que RIO-01→04 et RIO-06→10, trace 1a15ed7ad00bc0fd) pour porter RIO-05 « Mon premier pas » de 67/100 à **95/100** sur la grille de l'audit du 21/10 (Task 163) — en ajoutant les calculs manquants **sans rien modifier d'existant**.
> **Ce que ceci n'est PAS** : une retouche du moteur. Le vrai moteur reste `../../src/wtc_q5_core.py` (6 pas, table 9 (face, empreinte), suivi 14 j CELEBRE ≥ 9 / AJUSTEMENT 7-8 / REPRISE ≤ 6, rappels doux J1/J7/J14, re-test Q1 à 8 semaines jamais forcé) — importé tel quel, intégrité vérifiée à l'import. Aucun moteur n'a été touché.

## Pourquoi 95 % et pas 100 % (honnêteté du barème)

Le barème de l'audit plafonne **F1 à 20 pour toutes les quêtes « pas »** (la lecture graduée appartient aux quêtes amont dont le pas hérite) — c'est le cas de RIO-05, RIO-10, RIO-15, RIO-18 et RIO-23 dans le document d'audit. RIO-05 atteint donc **20 + 25 + 25 + 25 = 95 %** — le maximum atteignable au barème, tous critères F2/F3/F4 complets.

## La règle du jeu (demande fondateur)

1. Ne pas modifier ce qui a été fait — uniquement ajouter des fichiers.
2. Mettre l'accent sur les CALCULS et l'exactitude des résultats.
3. Déceler sans nommer les pathologies (arbitrage Task 164).

## Contenu

| Fichier | Rôle |
|---|---|
| `src/wtc_q5_correction.py` | La couche : importe les VRAIS moteurs (q5 pas + suivi + rappels + re-test · q1-r1 SEUILS_NIVEAUX 1,80/2,60/3,20 — la lecture graduée validée P1 de la carte · q4 type_attachement — le croisement RIO-04) et ajoute F2 (palier 🟢🟠🔴 LECTURE HÉRITÉE DE LA CARTE — le VRAI rang des axes A/B que le pas reçoit, via le VRAI `niveau_ponctuel`, règle R1 pré-enregistrée de RIO-01 : max des rangs, 🟢 ≤ 1 · 🟠 2 · 🔴 3 — PLANCHER PARTIEL consigné : alarme et mains absentes des héritages de ce pas + S1 = un axe Forte · S2 = un axe Vive sans Forte + la doctrine du pas affichée : choisi jamais prescrit, célébré jamais sanctionné, compteur privé), F3 (le contenu existant PRÉSERVÉ : pas réel + suivi réel + rappels doux réels + re-test réel — complété par l'aide selon la lecture héritée), F4 (fragment L8 7 blocs). Règles R1-R9 pré-enregistrées. |
| `src/wtc_q5_correction_validation.py` | Le pipeline de preuve : compactations PROUVÉES (plateau niveaux 401 centièmes × 2 axes + PILE inclusifs + batterie de frontière · empreinte 28 variantes → 3 classes, défaut du moteur consigné · espion machine sur la signature de `selectionner_pas` · suivi 15 valeurs frontières 6/7-8/9 · re-test +56 j · face PILE 2,61 / priorité sB / intervalle [2,60 ; 2,61) réel — frontières DISTINCTES 2,60 vs 2,61 consignées · junction type_attachement), énumération EXHAUSTIVE des 194 145 états distincts (43 sA × 43 sB × 7 labels ombre réels × 15 jours), re-score bit-exact des 180 profils archivés (simulateur re-exécuté frais à chaque passage — D-REPRO), suivi/re-test/rappels/junctions, exécution ×2 (SHA-256). |
| `results/correction_criteres.json` | Les agrégats complets + les critères COR0-COR8 + SHA-256 des 2 exécutions. |
| `results/rapport-correction-RIO-05.md` | Le rapport complet : règles, méthode, chiffres exacts, re-score F1-F4, limites honnêtes. |

## Résultat (tous critères PASS — détail dans le rapport)

- **COR0** compactations prouvées : niveaux plateau 802 (0 écart) · PILE 1,80→Tranquille / 2,60→Vive / 3,20→Forte (inclusifs côté haut, consignés) · frontière 3/3 (saut exact à t) · empreinte 28 variantes → 3 classes (0 écart ; 13 défauts du moteur consignés : LES DEUX / ALARME SANS MAIN / SIGNAL LÉGER NON NOMMÉ / vide → ZONE_CALME) · espion signature machine 1/1 (la sélection ne reçoit QUE sA, sB, label_ombre) · déterminisme 5/5 · suivi 15/15 (0 sanction, taux vérifié) · re-test +56 j exact · face PILE 2,61 inclusif + priorité sB · intervalle [2,60 ; 2,61) réel · type_attachement 4/4 · 3 vérificateurs VRAI ok
- **COR1** fragment de bilan complet : 194 145/194 145 configurations (194 145 états distincts — les scores bruts sont dans le fragment) + 180/180 archivés
- **COR2** palier lecture héritée : double chemin (comptage ≡ if-chaîne du VRAI cœur, mêmes seuils importés) 194 145/194 145 · junctions S1 ⇔ 🔴, S2 ⇔ 🟠 exactement · PLANCHER PARTIEL consigné (i_alarm et somme des mains absents — la lecture d'ombre reste celle de RIO-02) · frontières 2,60 (niveaux carte) vs 2,61 (face pas) DISTINCTES, toutes deux réelles
- **COR3** seuils d'aide : S1 72 765 · S2 50 400 · 0 seuil numérique ajouté (SEUILS_NIVEAUX importés + 2,61 moteur + 9/7 suivi + 8 semaines re-test — tous préexistants) · PILE moteurs vérifiés et consignés
- **COR4** vocabulaire écran : 0 mot interdit sur 252 textes distincts (194 145 configs balayées), D-SIM 100 %
- **COR5** anti-fabrication : pas affiché ≡ VRAI selectionner_pas (trace de source réelle) · 6 templates réels cités par écran · label d'ombre reçu mot pour mot, normalisation tracée honnêtement · JAMAIS de sanction (structurel) · bijections labels/templates 6/6
- **COR6** re-score bit-exact : 180 profils (seed 42, simulateur re-exécuté frais — D-REPRO), 1 093 comparaisons, 0 écart vs archive du 15/10 · C1 180/180 pas ≡ pas_vrai (D-VÉRITÉ éliminatoire) · C3 désaccords 0 · plafonds 9 × 100 % · C2 cas-types messages BIT-EXACT vs archive 9/9 · C5 180/180 + rappels ok · C6 re-test +56 j 180/180 jamais forcé · paliers appliqués 🟢 54 · 🟠 60 · 🔴 66
- **COR7** couplage pas : les 6 pas réels résolus sur l'espace complet des héritages (P1 3 920 · P2 2 884 · P3 4 009 · P4 420 · P5 1 065 · P6 645) · suivi 15/15 sans sanction · re-test jamais forcé · rappels J1/J7/J14 réels · junction type_attachement (SEREIN / PREOCCUPE / DETACHE / EN_ALERTFEU)
- **COR8** reproductibilité : pipeline ×2, SHA-256 identiques `4e96032062cc27c5…`

**Re-score** : RIO-05 = 67 % → **95 %** (F1 20 — plafond structurel du barème pour les quêtes « pas » · F2 12→25 · F3 20→25 · F4 15→25). Dimension attachement 93,4 % → **99 %** (495/5) · global 23 quêtes 87,0 % → **88,2 %** (2 028/23).

## Exécution

```bash
python3 src/wtc_q5_correction_validation.py   # ~35 s (194 145 × 2 + D-REPRO)
```

## Limites (lues avant toute décision)

Tout est validé en simulation (D-SIM) — VALID-01 reste vrai. Le PLANCHER est PARTIEL : le pas ne reçoit ni l'alarme (i_alarm) ni les mains (somme H+R) — la lecture affichée est celle de la CARTE (mêmes axes, mêmes seuils validés, même règle R1 que RIO-01) ; la quête ombre (RIO-02) mesure ses propres variables et peut préciser la gravité — différence avec RIO-03 consignée (RIO-03 recevait la somme des mains et posait son plancher sur le palier Q2, monotonicité prouvée ; RIO-05 ne les reçoit pas). La normalisation des labels (LES DEUX / ALARME SANS MAIN / SIGNAL LÉGER NON NOMMÉ / vide → ZONE_CALME) est le comportement RÉEL du moteur — tracé et consigné, jamais masqué. Les frontières 2,60 (niveaux carte) et 2,61 (face pas) sont DISTINCTES — toutes deux réelles, aucune retouchée. F1 = 20 est un plafond STRUCTUREL du barème pour les quêtes « pas » (consigné — même traitement que RIO-10/15/18/23). Le récapitulatif de DIMENSION reste l'action n°2 ; les libellés réels des questions restent l'action n°3.

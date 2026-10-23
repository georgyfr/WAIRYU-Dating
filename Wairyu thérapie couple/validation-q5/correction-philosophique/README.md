# WTC-Q5 — CORRECTION PHILOSOPHIQUE (fichier SUPPLÉMENTAIRE — RIO-05)

> **Ce que ceci est** : le fichier de correction demandé par le fondateur (signal « lancer RIO-05 », même ordre que RIO-01→04 et RIO-06→18) pour porter RIO-05 « Mon premier pas » de 67/100 à **95/100** sur la grille de l'audit du 21/10 (Task 163) — en ajoutant les calculs manquants **sans rien modifier d'existant**.
> **Ce que ceci n'est PAS** : une retouche du moteur. Le vrai moteur reste `../src/wtc_q5_core.py` (face dominante Q1 × empreinte Q2 → 6 pas, suivi 14 jours sans sanction — CELEBRE ≥ 9 · AJUSTEMENT 7-8 · REPRISE ≤ 6, rappels doux J1/J7/J14, re-test 8 semaines jamais forcé) — importé tel quel, intégrité vérifiée à l'import. Aucun moteur n'a été touché.

## Pourquoi 95 % et pas 100 % (honnêteté du barème)

Le barème de l'audit plafonne **F1 à 20 pour toutes les quêtes « pas »** (la lecture graduée appartient aux quêtes amont dont le pas hérite) — c'est le cas de RIO-05, RIO-10, RIO-15, RIO-18 et RIO-23 dans le document d'audit. RIO-05 atteint donc **20 + 25 + 25 + 25 = 95 %** — le maximum atteignable au barème, tous critères F2/F3/F4 complets.

## La règle du jeu (demande fondateur)

1. Ne pas modifier ce qui a été fait — uniquement ajouter des fichiers.
2. Mettre l'accent sur les CALCULS et l'exactitude des résultats.
3. Déceler sans nommer les pathologies (arbitrage Task 164).

## Contenu

| Fichier | Rôle |
|---|---|
| `src/wtc_q5_correction.py` | La couche : importe les VRAIS moteurs (q5 pas+suivi+rappels+re-test · q1-r1 scores d'axes grain 1/9 · q2-r1 labels d'ombre réels · q4 croisement + palier de couple de la correction RIO-04 importée telle quelle) et ajoute F2 (palier 🟢🟠🔴 PLANCHER HÉRITÉ — le VRAI seuil 2,61 du cœur lu sur les DEUX axes sA/sB reçus : 🔴 ssi les deux axes ≥ 2,61 (« en alerte », cohérent RIO-04) · 🟠 ssi exactement un axe · 🟢 sinon — la face seule NE SUFFIT PAS, prouvé + S1/S2 + QUAND DEMANDER DE L'AIDE + la doctrine du pas affichée : choisi jamais prescrit, célébré jamais sanctionné, compteur privé), F3 (le contenu existant PRÉSERVÉ : pas réel + suivi réel + rappels doux réels + re-test réel — complété par l'aide selon le palier), F4 (fragment L8 7 blocs, junction couple RIO-04 réelle sur les deux chemins mono/bi). Règles R1-R9 pré-enregistrées. |
| `src/wtc_q5_correction_validation.py` | Le pipeline de preuve : compactations PROUVÉES (espace RÉEL des axes déterminé par le VRAI code q1-r1 : 4⁹ répartitions → 28 sommes sans trou 9-36, grain 1/9 arrondi 2 décimales, frontière 2,61 tranchée des deux côtés — NON PILE, dist min 0,05, encadrants 2,56/2,67 · table pas 9/9 ≡ règle pure · compaction pas 2 352 · suivi 15 valeurs · espions labels/jours · face seule insuffisante · labels réels q2-r1 6/6 · fallback hors flux), énumération EXHAUSTIVE des **470 400 configurations** (784 paires d'axes réelles × 8 labels du flux × 15 jours × 5 chemins couple), re-score bit-exact des 180 profils archivés (simulateur re-exécuté frais — D-REPRO), exécution ×2 (SHA-256 identiques). |
| `results/correction_criteres.json` | Les agrégats complets + les critères COR0-COR8 + SHA-256 des 2 exécutions. |
| `results/rapport-correction-RIO-05.md` | Le rapport complet : règles, méthode, chiffres exacts, re-score F1-F4, limites honnêtes. |

## Résultat (tous critères PASS — détail dans le rapport)

- **COR0** compactations prouvées : espace RÉEL des axes 28×28 = 784 paires (0 écart au VRAI `scores_axes`) · frontière 2,61 NON PILE (dist min 0,05 — 2,56/2,67, tranchage sans ambiguïté) · table pas 9/9 ≡ règle pure · compaction pas ≡ (face, empreinte) 2 352 (0 écart) · suivi 15 valeurs (frontières 6/7 · 8/9 exactes, 0 sanction) · espions labels (10 sondes) / jours (jamais lus par `selectionner_pas`) · **la face seule NE SUFFIT PAS** (même face, paliers différents — consigné et prouvé) · type ≡ classe 784 (0 écart) · **labels d'ombre réels 6/6** (VRAI `nommage` q2-r1 — junction action n°3) · normalisation inconnu/None/LES DEUX/ALARME/SIGNAL → ZONE_CALME (portage fidèle, consigné) · fallback P1 hors flux uniquement · re-test 2026-01-01 → 2026-02-26, jamais forcé
- **COR1** fragment de bilan complet : **470 400/470 400** états distincts (mono 94 080 — consignation explicite sans feuille vide · bi 376 320 — VRAI croisement RIO-04, configuration toujours nommée) + **180/180** profils archivés
- **COR2** palier plancher : double chemin (entiers purs, somme ≥ 24 ≡ seuil 2,61 — la frontière tombe STRICTEMENT entre les sommes 23 et 24, prouvé) **470 400/470 400, 0 écart** · junctions S1 ⇔ 🔴 / S2 ⇔ 🟠 exactement · PLANCHER consigné
- **COR3** seuils d'aide : S1 101 400 · S2 234 000 · 🟢 135 000 · **0 seuil numérique ajouté** (littéral 2,61 épinglé au comportement réel des deux cœurs) · borne 2,61 NON PILE consignée · frontière boucle 30,0 PILE inclusive testée (54,9 → False · 55,0 → True)
- **COR4** vocabulaire écran : 0 mot interdit (canon Partie 9 + anti-blâme RIO-04) sur 33 textes distincts + 16 blocs couple + 38 textes fixes ; leçon D-Q5-1 respectée (« pas une obligation » = anti-culpabilisant) ; D-SIM 100 % ; la direction de boucle n'apparaît JAMAIS (la danse est nommée ENSEMBLE)
- **COR5** anti-fabrication : pas affiché ≡ VRAI `selectionner_pas` (trace réelle, 0 écart sur 470 400) · 6 templates réels cités par écran, verbatim vérifié · **fallback P1 INATTEIGNABLE via le flux normal** (prouvé — atteignable hors flux uniquement, consigné) · JAMAIS de sanction (0 énumération + 0 archivés)
- **COR6** re-score bit-exact : 180 profils (seed 42, simulateur re-exécuté frais ×2 — D-REPRO), **1 805 comparaisons, 0 écart** · C1 180/180 pas ≡ `pas_vrai` (D-VÉRITÉ éliminatoire) · C2 180/180 ≡ groupe (CELEBRE 60/60 · AJUSTEMENT 60/60 · REPRISE 60/60) · 0 sanction · anti-perfectionnisme ok · C6 re-test 180/180 · paliers observés 🟢 60 · 🟠 119 · 🔴 1 (S1 1 · S2 119)
- **COR7** couplage pas : les 6 pas réels tous résolus sur l'espace complet (P1 101 250 · P2 104 625 · P3 180 675 · P4 14 625 · P5 41 925 · P6 27 300) · suivi 15/15 · re-test jamais forcé · rappels J1/J7/J14 réels · table couple 9 configurations nommées
- **COR8** reproductibilité : pipeline ×2, SHA-256 identiques `b1be0fffcb0a23ac…` (simulateur re-exécuté frais à chaque passage — D-REPRO)

**Re-score** : RIO-05 = 67 % → **95 %** (F1 20 — plafond structurel du barème pour les quêtes « pas » · F2 12→25 · F3 20→25 · F4 15→25). Dimension attachement 467/5 → **495/5 = 99 %** — **DIMENSION CLOSE** · global 23 quêtes 2 161/23 = 94,0 % → **2 189/23 = 95,2 %**.

## Exécution

```bash
python3 src/wtc_q5_correction_validation.py   # ~30 s (×2 exécutions)
```

## Limites (lues avant toute décision)

Tout est validé en simulation (D-SIM) — VALID-01 reste vrai. F1 = 20 est un plafond STRUCTUREL du barème pour les quêtes « pas » (consigné — même traitement que RIO-10/15/18/23). Le palier lit les DEUX axes Q1 reçus — PLANCHER : la vraie gravité peut être plus haute (le filet de l'app reste porté par RIO-02), jamais plus basse. 2,61 n'est pas PILE atteignable sur le grain réel (grain 1/9 arrondi 2 décimales — dist min 0,05, encadrants 2,56/2,67) : le tranchage du cœur reste sans ambiguïté sur tout l'espace réel, et le chemin entiers purs (somme ≥ 24) converge exactement. La face seule ne suffit pas (SUR_LA_RA couvre 🔴 et 🟠) — la lecture palier est sur les axes bruts, prouvé. empreinte() normalise LES DEUX / ALARME SANS MAIN / SIGNAL LÉGER NON NOMMÉ / None / inconnu vers ZONE_CALME (portage fidèle du VRAI cœur). Fallback P1 : inatteignable via le flux normal (prouvé), atteignable hors flux uniquement (consigné). Bords du suivi : non-entier/négatif → 0, clamp 14 (comportement réel, consigné). Frontière boucle 30 de RIO-04 jamais PILE sur les percentiles réels — testée PILE sur le VRAI moteur (inclusive). La correction L6 (styles) de RIO-04 est hors périmètre de la junction RIO-05 (les styles ne sont pas reçus par ce cœur). Les héritages RIO-01 (axes) et RIO-02 (ombre) sont balayés sur leurs valeurs réelles, jamais devinés ; les 6 labels d'ombre sont produits par le VRAI `nommage` (junction « libellés réels », action n°3). Le récapitulatif de DIMENSION reste l'action n°2 ; les libellés réels des questions restent l'action n°3.

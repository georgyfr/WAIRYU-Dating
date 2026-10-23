# WTC-SM-Q2 — CORRECTION PHILOSOPHIQUE (fichier SUPPLÉMENTAIRE — RIO-12)

> **Ce que ceci est** : le fichier de correction demandé par le fondateur (même ordre que RIO-01→04, RIO-06→11, trace 1a15ed7ad00bc0fd) pour porter RIO-12 « Ce que je porte pour toi » de 69/100 à 100/100 sur la grille de l'audit du 21/10 (Task 163), en ajoutant les calculs manquants **sans rien modifier d'existant**.
> **Ce que ceci n'est PAS** : une retouche du moteur. Le vrai cœur reste `../../src/wtc_sm_q2_core.py` (portage verrouillé — 6 faces × 4 items, n_high sur faces A ≥ 3,50, D-CRISE intégrale 3 voies, D-GÉOMÉTRIE bande [3,10 ; 4,90] sur les deux voies score) — importé tel quel, intégrité vérifiée à l'import. Aucun moteur SM Q1/Q3/Q4/Q5 n'a été touché.

## La règle du jeu (demande fondateur)

1. Ne pas modifier ce qui a été fait — uniquement ajouter des fichiers.
2. Mettre l'accent sur les CALCULS et l'exactitude des résultats.
3. Déceler sans nommer les pathologies (arbitrage Task 164).

## Contenu

| Fichier | Rôle |
|---|---|
| `src/wtc_sm_q2_correction.py` | La couche de correction : importe les VRAIS moteurs (sm-q2 cœur verrouillé, sm-q1-r3, sm-q3, sm-q4, sm-q5 — intégrité vérifiée, zéro réimplémentation) et ajoute F2 (palier 🟢🟠🔴 image exacte du VRAI `classifier` — 0 seuil ajouté + QUAND DEMANDER DE L'AIDE S1/S2 avec voies réelles + bande D-GÉOMÉTRIE affichée), F3 (contenu des 3 paliers sur les définitions RÉELLES de la SPEC §2 + branchement quête « pas » sur le vrai moteur SM), F4 (fragment de bilan L8 à 7 blocs). Règles R1-R9 pré-enregistrées. |
| `src/wtc_sm_q2_correction_validation.py` | Le pipeline de preuve : compactations (256 quadruplets × 5 faces → 17 sommes, espions B jamais lus, frontières entières, compactation B 12 items → 3 niveaux), énumération EXHAUSTIVE de 167 042 états (17⁴ × 2), sous-vérification des 27 combinaisons B, re-score bit-exact des 520 profils archivés, couplage pas, ×2 SHA-256. |
| `results/correction_criteres.json` | Agrégats + COR0-COR8 + SHA-256 des 2 exécutions. |
| `results/rapport-correction-RIO-12.md` | Le rapport complet. |

## Résultat (tous critères PASS — détail dans le rapport)

- **COR0** compactations : 3 125 vérifs items→sommes (0 écart, 17/17) · espions B 4/4 (les 12 items B jamais lus) · frontières entières 196/196 · 3,10/4,90 PILE inatteignables (grain 0,25, dist min 0,10) · compactation B 17/17
- **COR1** fragments complets : 167 042/167 042 · sous-vérification B 81/81 (27 niveaux × 3 états — les B ne changent ni label ni palier)
- **COR2** double chemin entiers purs ≡ VRAI moteur : 167 042/167 042 · junction STABLE ⇔ 🟢 · ÉPUISÉ/SURIMPLIQUÉ/HOSTILE/MIXTE ⇔ 🟠 · CRISE ⇔ 🔴
- **COR3** seuils : S1 125 426 (voies réelles : A2 49 130 · SM-C1 34 680 · H5 41 616) · S2 29 616 · frontière entière 0 écart · 2,50/3,50 PILE atteignables (bornes inclusives consignées)
- **COR4** vocabulaire : 0 mot interdit sur 48 textes distincts · D-SIM 100 % · exceptions sourcées (filet 3919/3114 · « trouble » = nom de case du canon ligne 133)
- **COR5** anti-fabrication : zone_calme ssi STABLE (12 000/12 000) · court-circuit ssi CRISE (125 426/125 426) · ombre jamais affichée en crise · B jamais classifiantes (0/167 042)
- **COR6** re-score bit-exact : 520 profils régénérés par le VRAI simulateur seed 42 — stats_groupes bit-exact · C3 (sens/spé 100 %, VP 52 · FN 0 · VN 342 · FP 0, voies A2 23/70 · SM-C1 9/20 · H5 20/20, test_frontière 3,99/4,00 via le VRAI `crise_de_scores`) bit-exact · 1 434 comparaisons, 0 écart · couche appliquée : 🟢 189 · 🟠 207 · 🔴 124
- **COR7** couplage pas : 4 paliers via le VRAI palier_de/pas_de (niv_chg MESURÉ, niv_det balayé) · 🔴 → aucun pas 2/2 · suivi 15/15 sans sanction · re-test 8 semaines · junction Q2↔Q5 6/6
- **COR8** reproductibilité : ×2, SHA-256 identiques `63fa002c38d01fec…`

**Re-score** : RIO-12 = 69 % → **100 %** (F1 25 inchangé · F2 22→25 · F3 12→25 · F4 10→25).

## Exécution

```bash
python3 src/wtc_sm_q2_correction_validation.py   # ~70 s (167 042 × 2)
```

## Limites (lues avant toute décision)

Simulation seule (D-SIM) — VALID-01 reste vraie. Libellés des items absents (action n°3). Les faces B sont descriptives NON classifiantes (portage fidèle du verrouillage) — leur texte l'est aussi. Exceptions sourcées consignées : le filet (literal moteur P1) et « trouble » (nom de case du canon ligne 133, repris par la vraie banque de pas — vocabulaire de l'outil, jamais une étiquette du répondant). Récapitulatif de DIMENSION = action n°2.

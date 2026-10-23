# Correction philosophique — RIO-18 « Le pas de l'horizon » (WTC-EXT-Q3)

Couche SUPPLÉMENTAIRE (fichiers ajoutés, zéro modification de l'existant — même
ordre fondateur que RIO-01→17) qui rattrape RIO-18 au gabarit universel §5.1-§5.4 :

- **F4 (22→25)** : le fragment de bilan L8 niveau COUPLE à 7 blocs, complet sur
  TOUS les chemins (entrée · override D-CRISE · non-entrée RQS), avec le VRAI
  A6 récapitulatif descriptif de dimension et les junctions réelles
  (pas_de, statut_engagement, RCI par rive + ensemble max).
- **F3 (25) PRÉSERVÉ** (leçon RIO-15) : les pas affichés sont les VRAIS de la
  banque, servis par le VRAI `pas_de`, jamais réécrits.
- **F1 (20) PLAFOND STRUCTUREL** du barème des quêtes « pas » — inchangé.

Le VRAI cœur `validation-ext-q3/src/wtc_ext_q3_core.py` (VALIDÉ 7/7, CONTRESIGNÉ)
est importé TEL QUEL — jamais recopié, jamais modifié ; les asserts de junction
(pas, statut, RCI) vérifient À CHAQUE appel.

## Contenu

```
correction-philosophique/
├── README.md                                   # ce fichier
├── .gitignore                                  # __pycache__, logs
├── src/
│   ├── wtc_ext_q3_correction.py                # la couche (R1-R9 pré-enregistrées)
│   └── wtc_ext_q3_correction_validation.py     # la preuve (COR0-COR8)
└── results/
    ├── correction_criteres.json                # les 9 critères, chiffrés
    └── rapport-correction-RIO-18.md            # le rapport complet
```

## Exécution

```bash
python3 src/wtc_ext_q3_correction_validation.py
```

Sortie : `results/correction_criteres.json` + résumé COR0-COR8 sur stdout.
Durée : ~1 min (énumération 216 × 2 états RCI par rive + joint pas × statut,
× 2 exécutions COR8).

## Verdict

**9/9 COR PASS** — re-score : **92 % → 95 %** (F1 20 plafond structurel ·
F2 25 · F3 25 préservé · F4 25) — le maximum atteignable au barème.
Re-score BIT-EXACT des 650 couples archivés : 0 écart. SHA-256 ×2 : `d87904183db10a5a…`.

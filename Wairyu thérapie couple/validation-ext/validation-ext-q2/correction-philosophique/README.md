# Correction philosophique — RIO-17 « Notre conversation de l'horizon » (WTC-EXT-Q2)

Couche SUPPLÉMENTAIRE (fichiers ajoutés, zéro modification de l'existant — même
ordre fondateur que RIO-01→16) qui rattrape RIO-17 au gabarit universel §5.1-§5.4 :

- **F3 (18→25)** : le contenu CONCRET des 3 paliers croisés PAR CONFIGURATION
  RÉELLE (1 🟢 zone calme · 3 🟠 modules à deux sur les VRAIS pas de la banque
  Q3 · 5 🔴 orientations = le VRAI pas rouge) — produits, pas seulement désignés ;
- **F4 (22→25)** : le fragment de bilan L8 niveau COUPLE à 7 blocs, complet sur
  les 3 chemins (entrée · override D-CRISE · non-entrée RQS).

Le VRAI cœur `validation-ext-q2/src/wtc_ext_q2_core.py` (VALIDÉ 7/7, CONTRESIGNÉ)
est importé TEL QUEL — jamais recopié, jamais modifié ; les asserts de junction
vérifient config/palier/zone calme/inférences À CHAQUE appel ; les junctions pas
utilisent le VRAI moteur Q3.

## Contenu

```
correction-philosophique/
├── README.md                                   # ce fichier
├── .gitignore                                  # __pycache__, logs
├── src/
│   ├── wtc_ext_q2_correction.py                # la couche (R1-R9 pré-enregistrées)
│   └── wtc_ext_q2_correction_validation.py     # la preuve (COR0-COR8)
└── results/
    ├── correction_criteres.json                # les 9 critères, chiffrés
    └── rapport-correction-RIO-17.md            # le rapport complet
```

## Exécution

```bash
python3 src/wtc_ext_q2_correction_validation.py
```

Sortie : `results/correction_criteres.json` + résumé COR0-COR8 sur stdout.
Durée : ~2 min (énumération exhaustive 13 824 états × 2 exécutions COR8).

## Verdict

**9/9 COR PASS** — re-score : **90 % → 100 %** (F1 25 · F2 25 · F3 25 · F4 25).
Re-score BIT-EXACT des 650 couples archivés : 0 écart. SHA-256 ×2 : `9ce72cbbbd30235b…`.

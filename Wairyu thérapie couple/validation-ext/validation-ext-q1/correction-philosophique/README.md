# Correction philosophique — RIO-16 « L'écart de nos horloges » (WTC-EXT-Q1)

Couche SUPPLÉMENTAIRE (fichiers ajoutés, zéro modification de l'existant — même
ordre fondateur que RIO-01→15) qui rattrape RIO-16 au gabarit universel §5.1-§5.4 :

- **F3 (15→25)** : le contenu CONCRET des 3 paliers — exercice zone calme (§5.5),
  module à deux s'appuyant sur les VRAIS pas de la banque Q3, orientation (VRAI
  pas rouge) — produits, pas seulement désignés ;
- **F4 (10→25)** : le fragment de bilan L8 à 7 blocs (position · forme · empreinte
  · couple · force · limites · palier/pas), complet y compris hors-carte.

Le VRAI cœur `validation-ext-q1/src/wtc_ext_q1_core.py` (VALIDÉ 7/7, CONTRESIGNÉ)
est importé TEL QUEL — jamais recopié, jamais modifié ; les junctions utilisent
les VRAIS moteurs aval Q2 (croisement) et Q3 (pas).

## Contenu

```
correction-philosophique/
├── README.md                                   # ce fichier
├── .gitignore                                  # __pycache__, logs
├── src/
│   ├── wtc_ext_q1_correction.py                # la couche (R1-R9 pré-enregistrées)
│   └── wtc_ext_q1_correction_validation.py     # la preuve (COR0-COR8)
└── results/
    ├── correction_criteres.json                # les 9 critères, chiffrés
    └── rapport-correction-RIO-16.md            # le rapport complet
```

## Exécution

```bash
python3 src/wtc_ext_q1_correction_validation.py
```

Sortie : `results/correction_criteres.json` + résumé COR0-COR8 sur stdout.
Durée : ~4 min (énumération exhaustive 6 859 configurations × 2 exécutions COR8).

## Verdict

**9/9 COR PASS** — re-score : **75 % → 100 %** (F1 25 · F2 25 · F3 25 · F4 25).
Re-score BIT-EXACT des 520 couples / 1 040 rives archivés : 0 écart.
SHA-256 ×2 : `40fb737db80d60ed…`.

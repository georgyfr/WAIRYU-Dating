# Libellés officiels RIO-01 « Comment je me raccroche » — SCELLÉS

**WAIRYU Thérapie Couple — Action n°3, premier instrument scellé (24/10/2026).**

Les 19 libellés réels de l'instrument (18 items + 1 vigilance), approuvés par
le fondateur (trace 1a16c6a31081f721 — « c'est bon pousse cela dans github »)
après relecture item par item de la proposition v2.

## Arborescence

```
libelles-officiels/
├── README.md
├── src/
│   ├── wtc_q1_libelles.py          # LES 19 libellés + métadonnées (données pures, 0 import)
│   └── verification_libelles_q1.py # Preuve LIB0-LIB7 (re-score bit-exact vs archives)
└── results/
    ├── verification_libelles.json  # Machine-lisible : verdicts, comptages, SHA ×2
    └── rapport-libelles-RIO-01.md  # Rapport lisible
```

## Verdict (détail : `results/rapport-libelles-RIO-01.md`)

| Critère | Observé | Verdict |
|---|---|---|
| LIB0 — moteurs réels (cœur R1 + simulateur R1 + couche correction) | asserts à l'import | PASS |
| LIB1 — structure | 18 items + vigilance 19, uniques, ponctués | PASS |
| LIB2 — faces | 18/18 items sur leur face du VRAI moteur | PASS |
| LIB3 — ancres + valence | ancres ≡ items inversés (5, 15) · 6+ / 12· / 1 équilibrée / 0− | PASS |
| LIB4 — mots interdits | 0 occurrence (25 textes balayés, liste canonique) | PASS |
| LIB5 — re-score bit-exact vs archives | **35 880 comparaisons, 0 écart** (520 répondants, seed 42) | PASS |
| LIB6 — inertie du module | 0 import, cœur bit-identique après chargement | PASS |
| LIB7 — reproductibilité | passe ×2 : verdicts + SHA + empreinte identiques | PASS |

**VERDICT : SCELLÉ — VÉRIFIÉ.**

## Empreintes clés

- `wtc_q1_libelles.py` : `5f7f60c45d6240cbded189aff4bb514346132578fbc251553d6bf64c8e2c1118`
- `wtc_q1_core.py` (R1, INCHANGÉ) : `959abb18506cf27ca092304cb2acd3099f0dd11fb8ad554012f49aa8387b928f`
- Empreinte du re-score (payload) : `5e642f3bba5efcfe…` — identique sur les 2 passes.

## Garanties

1. **« Des affirmations positives dont les résultats sont toujours pareils »** —
   garanti par architecture : le moteur lit des entiers 1-4, jamais les mots.
   Le re-score bit-exact contre les archives validées en est la preuve.
2. **Anti-déjoueuvre** : valence mélangée + ancres de sécurité 5/15 (items
   inversés) · vigilance attendue 3 · RQS (linéarité / contradiction / rythme).
   Les 3 filets sont DÉJÀ dans le cœur validé — rien à ajouter au code.
3. **Doctrine écran** : 0 mot interdit ; phrases « je » uniquement ; jamais
   l'évaluation du partenaire ; inclusivité « (e) » ; langage simple.
4. **Zéro modification** des moteurs, seuils, données ou validations existants
   — fichier SUPPLÉMENTAIRE, même discipline que les packages de correction.

## Reproduction

```bash
python3 src/verification_libelles_q1.py
```

Deux exécutions consécutives produisent verdicts et empreintes strictement
identiques (LIB7).

## Reste à sceller (action n°3)

Les 22 autres instruments (RIO-02 → RIO-23) — au signal fondateur, instrument
par instrument ou par dimension.

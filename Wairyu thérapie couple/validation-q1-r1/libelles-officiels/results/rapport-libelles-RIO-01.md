# RAPPORT — Scellement des libellés officiels RIO-01 « Comment je me raccroche »

**Action n°3 — premier instrument scellé.** Accord fondateur : trace 1a16c6a31081f721, 24/10/2026 (« c'est bon pousse cela dans github »), après relecture item par item des 19 libellés v2 (7 positives · 12 neutres · 0 sombres).

## Méthode
- Moteurs réels importés TELS QUELS (jamais recopiés, jamais modifiés) :
  - cœur `wtc_q1_core.py` (révision R1, SEM structurel 0,195) — SHA-256 `959abb18506cf27c…` ;
  - simulateur R1 (seed 42) — SHA-256 `87c51d3435a67ba2…` ;
  - couche de correction RIO-01 (liste canonique MOTS_INTERDITS, 16 mots) — SHA-256 `7881c2fac5ebf36e…`.
- Archives validées comparées telles quelles (SHA-256 consignés ci-dessous).

## Verdicts (les deux passes)

| Critère | Exigence | Observé | Verdict |
|---|---|---|---|
| LIB0 — moteurs réels | identité complète | asserts à l'import | PASS |
| LIB1 — structure des libellés | 18 items + vigilance 19, uniques, ponctués | 19/19 | PASS |
| LIB2 — cohérence des faces | chaque item sur sa face du VRAI moteur | 18/18 | PASS |
| LIB3 — ancres de sécurité | ancres ≡ items inversés (5, 15), valence 7+/12·/0− | conforme | PASS |
| LIB4 — mots interdits | 0 occurrence (27 textes balayés) | 0 | PASS |
| LIB5 — re-score BIT-EXACT vs archives | 0 écart sur 35880 comparaisons (520 répondants) | 0 écart | PASS |
| LIB6 — inertie du module libellés | 0 import + cœur bit-identique après chargement | 0 import, cœur inchangé : True | PASS |
| LIB7 — reproductibilité | passe ×2 : verdicts + SHA + empreinte identiques | identiques | PASS |

## Empreintes

- Empreinte du re-score (payload 520 répondants × colonnes décisives) : `5e642f3bba5efcfe…` — identique avant import des libellés, après import, et sur la 2ᵉ passe.

| Fichier | SHA-256 |
|---|---|
| wtc_q1_core.py (R1) | `959abb18506cf27ca092304cb2acd3099f0dd11fb8ad554012f49aa8387b928f` |
| wtc_q1_simulator.py (R1) | `87c51d3435a67ba2259396f65fab7625052449ed5a1e6ab6b42518199e09ec8f` |
| wtc_q1_libelles.py | `5f7f60c45d6240cbded189aff4bb514346132578fbc251553d6bf64c8e2c1118` |
| wtc_q1_correction.py (liste mots interdits) | `7881c2fac5ebf36e67f4beded2c3a763740598171ad43179f7896b89a1546803` |
| archive reponses_honnetes_calculees.csv | `1f832f91da72a355e2438e9902f804d9ab356b8168c5789a9ba8995490b05761` |
| archive reponses_pieges_calculees.csv | `38e1de7742090143005cb7b5f9aa3f5232bc53f92df25097a85c60bd81c48ad2` |

## Garantie

- **Zéro modification des moteurs, seuils, données ou validations** : le re-score bit-exact contre les archives validées prouve que le calcul produit, octet pour octet, les mêmes lectures qu'avant les libellés. « Des affirmations positives dont les résultats sont toujours pareils » — garanti par architecture (le moteur lit des entiers 1-4, jamais les mots).
- Anti-déjoueuvre : les 3 filets (valence mélangée + ancres 5/15 · vigilance attendue 3 · RQS linéarité/contradiction/rythme) sont dans le cœur validé L1 — rien à ajouter au code.
- Doctrine écran vérifiée sur les 25 textes affichables : 0 mot interdit ; toutes les phrases sont des phrases « je » (jamais l'évaluation du partenaire) ; inclusivité « (e) » ; langage simple.
- Limite universelle consignée : D-SIM — la mécanique est validée, la prévalence réelle attend VALID-01 (comité clinique + AIPD).

**VERDICT FINAL : SCELLÉ — VÉRIFIÉ**

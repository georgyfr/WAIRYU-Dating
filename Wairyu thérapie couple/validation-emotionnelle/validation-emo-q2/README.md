# WTC-EMO-Q2 — « Ce que je n'arrive pas à dire » (RIO-07)

> **AVERTISSEMENT D-SIM** : résultats issus de simulations (seed 42) —
> la mécanique est validée, pas la prévalence clinique.

## Verdict : **À CORRIGER — 6/7 critères** — note **6/10**

| Critère | Attendu | Obtenu | Verdict |
|---------|---------|--------|---------|
| **C1a** Zones d'invalidation (E1-E4) | ≥ 81 % | **87,63 %** | ✅ PASS |
| **C1b** Reproche-code (E2,E3,E5 — D-ÉCHELLE) | ≥ 83 % + E5 ≥ 90 % | **70,0 %** (E5 = 0 %) | ❌ FAIL |
| **C1c** Boucle de réassurance | ≥ 85 % | **96,5 %** | ✅ PASS |
| **C2** Convergence inter-dimensions | 0 crash | **180 applicables, 180 ≥0,50, 0 crash** | ✅ PASS |
| **C3** Anti-culpabilisation (ÉLIMINATOIRE) | 0/0/0 | **0/0/0** | ✅ PASS |
| **C4** SHA-256 ×2 | identiques | **identiques** | ✅ PASS |
| **C5** Affichage (D-ÉCHELLE + D-PARAM + templates + héritage) | 4/4 | **4/4** | ✅ PASS |

**SHA-256 (×2, seed 42)** : `1df53890d2d96d2b3878fb504b68c05545ca81751a8ad81666217dc47cc30fae`

---

## ⚠️ S-EMO-Q2-3 — Contradiction spec/code sur E5 (test D-ÉCHELLE)

**Le test D-ÉCHELLE lui-même révèle une contradiction dans la spécification.**

### La spec dit (Section 3) :
- E5 : `gen(20, 1.6, 1.6, 3.5, 4.2, ...)` → mu_RC = 3,5, rc_d_mean = 4,2
- Label attendu : **FORMULATION ACQUISE** (*"le code mesuré sans la formulation répressive ne fait pas le reproche-code"*)

### Le code du core dit (fourni MOT POUR MOT) :
```python
if m >= 3.00 and formulation >= 3.00:
    label = "BESOIN VIVANT, FORMULATION MIXTE"
```
→ Quand m ≥ 3,00 ET formulation ≥ 3,00, le label est **BESOIN VIVANT, FORMULATION MIXTE**, pas FORMULATION ACQUISE.

### La mesure confirme :
- E5 : moy_rc = 3,47 (≥ 3,00), moy_rc_d = 4,3 (≥ 3,00)
- Tous les profils E5 obtiennent **BESOIN VIVANT, FORMULATION MIXTE**
- E5 = 0 % de labels corrects (attendu FORMULATION ACQUISE)

### Diagnostic
Soit :
1. **Le label attendu est faux** — E5 devrait être "BESOIN VIVANT, FORMULATION MIXTE" (et le commentaire de la spec est trompeur)
2. **Le code du core est faux** — la condition pour FORMULATION ACQUISE devrait inclure le cas m ≥ 3,00 ET formulation ≥ 3,00
3. **mu_RC devrait être < 3,00** pour E5 (pour que m < 3,00 et formulation ≥ 3,00 → FORMULATION ACQUISE)

**En tant qu'exécuteur strict, je ne corrige pas.** Le verdict est À CORRIGER. Le superviseur doit arbitrer.

---

## Les 3 nouveautés techniques du package

| Nouveauté | Statut |
|-----------|--------|
| **D-ÉCHELLE** (seuils = 3,00 partout) | ✅ Appliqué — C5a validé |
| **D-PARAM** (σ = 0,60 spécifié) | ✅ Appliqué — C5b validé, écarts mu/mesure documentés Section C |
| **Convergence inter-dimensions** (RIO-01/02 × RIO-06/07) | ✅ 180 profils applicables, 180 index ≥ 0,50, 0 crash |

## Le test anti-culpabilisation bilatéral (C3 — ÉLIMINATOIRE) : ✅ PASS

| Sous-test | Attendu | Obtenu |
|-----------|---------|--------|
| C3a : 0 sortie condamnante ("tu es invalidant(e)" etc.) | 0 | **0** |
| C3b : zones FRÉQUENT affichent template de conséquence | 0 violation | **0 violation** |
| C3c : l'invalidé jamais minimisé ("ce que tu ressens est réel") | 0 violation | **0 violation** |

**L'invalidant n'est jamais condamné, l'invalidé n'est jamais minimisé.** Le test bilatéral passe.

## D-PARAM — écarts mu simulés vs moyennes mesurées (Section C du rapport)

D-PARAM rend le bruit comparable. Écarts > 0,15 signalés dans le rapport. La plupart des moyennes mesurées sont conformes aux μ simulés (σ = 0,60 spécifié).

## Arborescence

```
validation-emo-q2/
├── README.md                              (ce fichier — verdict À CORRIGER)
├── src/
│   ├── wtc_emo_q2_core.py                 (moteur — copie MOT POUR MOT + TEMPLATES ajoutés)
│   ├── wtc_emo_q2_simulator.py            (simulateur — copie MOT POUR MOT)
│   └── wtc_emo_q2_validation.py           (7 critères + SHA ×2 + 4 figures + rapport)
├── results/
│   ├── rapport-emo-q2-2026-10-15.md       (7 sections)
│   ├── resultats-emo-q2-2026-10-15.json
│   └── fingerprint-2026-10-15.json
└── figures/
    ├── fig1_c1a_zones.png                 (1920×1080, 150 DPI)
    ├── fig2_matrice_zones.png
    ├── fig3_c1b_reproche_code.png
    └── fig4_paliers.png
```

## Publication

Package publié dans `WAIRYU-Dating → Wairyu thérapie couple/validation-emotionnelle/validation-emo-q2/`.

## RIO-07

RIO-07 **n'entre pas** au RIO — verdict À CORRIGER. Le circuit a attrapé une contradiction spec/code (S-EMO-Q2-3) sur le test D-ÉCHELLE lui-même. **La vérité du système prime sur le succès apparent.**

Arbitrage superviseur requis sur S-EMO-Q2-3 avant package R1.

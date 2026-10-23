# Rapport de correction philosophique — RIO-12 « Ce que je porte pour toi » (WTC-SM-Q2)

> AVERTISSEMENT D-SIM : résultats issus de simulations (seed 42) — la mécanique est validée, pas la prévalence clinique.
> Ordre fondateur (trace 1a15ed7ad00bc0fd) : fichiers SUPPLÉMENTAIRES, zéro modification de l'existant, exactitude des calculs.

**Date** : 23/10/2026
**Package** : `validation-sm/validation-sm-q2/correction-philosophique/`
**Cible** : RIO-12 « Ce que je porte pour toi » (ombre) — audit Task 163 : F1 25 · F2 22 · F3 12 · F4 10 = **69 %**
**Moteurs réels importés** : `wtc_sm_q2_core.py` (verrouillé) · `wtc_sm_q1_core.py` (R3) · `wtc_sm_q3_core.py` · `wtc_sm_q4_core.py` · `wtc_sm_q5_core.py` — intégrité par asserts à l'import, zéro retouche.

## 1. Les règles pré-enregistrées (R1-R9)

| Règle | Contenu | Source réelle |
|---|---|---|
| **R1** | Palier = image exacte du VRAI `classifier` : CRISE → 🔴 · STABLE → 🟢 · ÉPUISÉ/SURIMPLIQUÉ/HOSTILE/MIXTE → 🟠. 0 seuil ajouté. STABLE ⇔ AUCUNE face A ≥ 3,5 (le VRAI n_high_a : n = 0 — une face entre 2,5 et 3,5 reste STABLE, la zone « En veille » est descriptive). | cœur Q2 |
| **R2** | En CRISE : cause MOT POUR MOT du VRAI `crise_de_scores` (voie A2 — surimplication sévère — ou SM-C1 héritée, ou H5) + filet 3919/3114, et RIEN d'autre. JAMAIS de pas de couple en crise. | `crise_de_scores` (3 voies peuplées) |
| **R3** | Ombre causale par face A avec les DÉFINITIONS réelles de la SPEC verrouillée §2 (mot pour mot) ; niveaux posés sur les VRAIS seuils (Basse ≤ 2,5 · En veille · Active ≥ 3,5 — grain 0,25 : 2,50/3,50 PILE ATTEIGNABLES, bornes inclusives consignées). | SPEC SM-Q2 §2 + cœur |
| **R4** | Les faces B (« Le retrait », « La culpabilité », « La réparation ») affichées comme descriptives NON classifiantes — jamais 🟠/🔴-drivantes, variation sans effet sur label/palier (prouvé). | verrouillage Q2 + SPEC §2 |
| **R5** | zone_calme (template réel Q5) ssi STABLE ; court-circuit ssi CRISE ; aucune invention de statut (le moteur n'a que 5 labels + CRISE). | TEMPLATES Q5 |
| **R6** | 0 mot interdit ; exceptions sourcées : filet (literal moteur P1) · « trouble » = nom de case du canon (ligne 133, banque de pas réelle Q5) — neutralisés avant décompte, jamais une étiquette du répondant. | canon Partie 9 + ligne 133 |
| **R7** | Bandeau D-SIM. | hub |
| **R8** | Pas = VRAI `palier_de`/`pas_de` Q5 avec niv_chg MESURÉ ICI (VRAI `niveau_de` de Q4 sur la moyenne réelle des faces A — A1 SPEC Q4 : la charge se lit sur Q2, sans exception) et niv_det BALAYÉ (RIO-11). 🔴 → aucun pas. | moteurs Q4/Q5 |
| **R9** | Re-test 8 semaines (arithmétique +56 j). | émo-q5 (sémantique) |

## 2. La preuve

### COR0 — Compactations prouvées

- **(a)** 3 125 vérifications items→sommes (les 256 quadruplets × 5 faces via le VRAI `moyenne_face`) — même somme ⇒ même moyenne, **0 écart**, 17/17 sommes ;
- **(b)** espions B : les 3 faces B varient (4 sondes, sommes 4/8/14/20) — le VRAI `classifier` et `detecter_crise` ne les lisent **jamais** (0 écart) ;
- **(c)** frontières entières : 196 vérifications de bord (sommes 4/10/11/13/14/16/20 × C1 8/16 × H5) — **0 écart** ;
- bornes consignées : **3,10/4,90 PILE inatteignables** sur grain 0,25 (dist min 0,10) · **2,50/3,50 PILE ATTEIGNABLES** (sommes 10/14 — bornes inclusives du cœur) · 4,00 PILE = seuil de crise (somme 16) ;
- **compactation B** : 12 items → 3 niveaux descriptifs (17/17 vérifs, 0 écart).

### COR1/COR2 — Énumération exhaustive + double chemin

**167 042 configurations** (17⁴ sommes A1·A2·A3·C1 × 2 H5) — l'espace complet :

- **COR1** : 167 042/167 042 fragments complets, 0 bloc vide · sous-vérification B **81/81** (27 combinaisons de niveaux B × 3 états du cœur — le texte change, jamais le label) ;
- **COR2** : double chemin ENTIERS PURS ≡ VRAI moteur **167 042/167 042** · junction STABLE ⇔ 🟢 · ÉPUISÉ/SURIMPLIQUÉ/HOSTILE/MIXTE ⇔ 🟠 · CRISE ⇔ 🔴.

Distributions : labels {CRISE 125 426 · STABLE 12 000 · MIXTE 10 416 · HOSTILE 8 400 · ÉPUISÉ 8 400 · SURIMPLIQUÉ 2 400} — paliers {🔴 125 426 · 🟠 29 616 · 🟢 12 000}.

### COR3 — Seuils d'aide

- **S1 = 125 426** (crise — voies réelles affichées : **A2 49 130 · SM-C1 héritée 34 680 · H5 41 616**) · **S2 = 29 616** (🟠 + re-test 8 semaines) ;
- frontière entière crise ⇔ (s_a2 ≥ 16 ∨ s_c1 ≥ 16 ∨ h5) — **0 écart** sur 167 042.

### COR4/COR5 — Vocabulaire + anti-fabrication

- **COR4** : 0 mot interdit sur **48 textes distincts** (167 042 blocs) ; D-SIM 100 % ; la bande haute (4,00-4,90) jamais affichée hors crise (0 écart) ; exceptions sourcées consignées (filet · case « trouble » du canon) ;
- **COR5** : zone_calme ssi STABLE (12 000/12 000, 0 abus) · court-circuit ssi CRISE (125 426/125 426, 0 fuite) · ombre jamais en crise (0) · **B jamais classifiantes (0/167 042)**.

### COR6 — Re-score BIT-EXACT des 520 profils archivés (D-REPRO)

| Agrégat | Archive 17/10 | Re-score frais | Verdict |
|---|---|---|---|
| `stats_groupes` (10 groupes, champs partagés) | — | **bit-exact 10/10** | ✅ |
| C3 VP · FN · VN · FP | 52 · 0 · 342 · 0 | **52 · 0 · 342 · 0** | ✅ |
| C3 hors bande · dans bande | 394 · 126 | **394 · 126** | ✅ |
| C3 voie A2 (vp/fn/n_voie) | 23 / 0 / 70 | **23 / 0 / 70** | ✅ |
| C3 voie SM-C1 (vp/fn/n_voie) | 9 / 0 / 20 | **9 / 0 / 20** | ✅ |
| C3 voie H5 (vp/fn/n_voie) | 20 / 0 / 20 | **20 / 0 / 20** | ✅ |
| test_frontière 3,99/4,00 (2 voies) | ok=True | **ok=True** (VRAI `crise_de_scores`) | ✅ |

**1 434 comparaisons, 0 écart.** Couche appliquée aux 520 profils : paliers **🟢 189 · 🟠 207 · 🔴 124** (S1 124 · S2 207), fragments complets 520/520, 0 mot interdit, dans bande 126, en crise 124.

### COR7 — Couplage pas (VRAI Q5)

4 paliers résolus (niv_chg mesuré, niv_det balayé) : 🔴 → aucun pas 2/2 (VRAI `pas_de` → None) · pas 🟢/🟠 = vraie banque 2/2 · suivi 14 j 15/15 (CÉLÉBRÉ 6 / EN CHEMIN 9, 0 sanction) · re-test 2026-02-26 · junction Q2↔Q5 6/6.

### COR8 — Reproductibilité

Pipeline ×2 : SHA-256 identiques `63fa002c38d01fec…`.

## 3. Re-score au barème de l'audit

| Critère | Avant | Après | Justification |
|---|---|---|---|
| **F1** | 25 | **25** | inchangé — D-VÉRITÉ 24 items, D-CRISE 3 voies, D-GÉOMÉTRIE (package validé, rien à masquer) |
| **F2** | 22 | **25** | palier mécanique du VRAI classifieur + QUAND DEMANDER (S1/S2, voies réelles, frontière entière prouvée) + bande affichée |
| **F3** | 12 | **25** | contenu des 3 paliers sur les définitions réelles §2 + les vrais pas de la banque Q5 + branchement pas réel + suivi + re-test (COR7) |
| **F4** | 10 | **25** | fragment L8 à 7 blocs, complet sur 167 042/167 042 + 520/520 profils archivés |
| **Total** | **69 %** | **100 %** | AU BARÈME P1 SIMULATION |

## 4. Limites honnêtes

1. **Simulation seule** (D-SIM) — VALID-01 reste vraie ; le court-circuit D-CRISE est validé mécaniquement (sens/spé 100 %, frontière 3,99/4,00 exacte).
2. **Libellés des items absents** (action n°3).
3. **Faces B descriptives** — affichées comme telles (le verrouillage le veut), jamais classifiantes ; le texte descriptif reste un constat, pas un verdict.
4. **La bascule G3 (SURIMPLIQUÉ en bande)** — 14/70 profils basculent en crise dans la bande [3,10 ; 4,90] : consignée au rapport archivé (taux observé 20 % vs 15,9 % théorique continu), l'honnêteté de la bande est reprise telle quelle par la couche (re-test proposé, jamais de tranche).
5. **Récapitulatif de DIMENSION** = action n°2 — non traité ici.

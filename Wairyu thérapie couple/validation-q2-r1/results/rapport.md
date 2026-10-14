# RAPPORT FINAL DÉTAILLÉ — PACKAGE WTC-Q2-R1 (« CE QUI M'EFFRAIE VRAIMENT », RÉVISION POST-VALIDATION)

## Validation de la Quête 2 — instrument original WAIRYU, fiche RIO-02 · moteur WTC-Q2-01 · simulateur WTC-Q2-02 (seed 42) · validateur WTC-Q2-03-R1

**Rôle : EXÉCUTEUR STRICT.** Le code de l'exécution précédente (commit `0c3aaab`) est **conservé** ; les seules modifications appliquées sont celles posées par le package WTC-Q2-R1 : **D-Q2-A** branchement fqH/fqR dans `gen()` (S-Q2-1 clos à la source) · **D-Q2-B** C5c reformulé en 3 règles (c1/c2/c3) + 3 templates ajoutés à la banque · **D-Q2-C** `vides()` corrigé dans le canonique (S-Q2-8 absorbé) · **D-Q2-D** effectifs officiels 400 + 23 + 8 = 431, C2-FP recalculé sur les 400 · **D-Q2-E** 6 profils O7-NLP, C3 étendu à 6/6 · **D-Q2-F** `longitudinal()` marqué NON TESTÉ (reporté WTC-SUIVI). Aucun seuil, aucun poids, aucune règle du moteur modifiés ; les probabilités pH/pR sont inchangées.

**Effectifs officiels du run : 437 sorties** = 400 honnêtes (150+100+50+100) + 23 piégés (6 INC_SIMPLE + 4 INC_DOUBLE + 8 SEC_H5 + 5 PFILTRE) + 8 arêtes (E1-E8) — effectifs posés par D-Q2-D : 431 — **+ 6 profils O7-NLP** ajoutés par D-Q2-E.

Empreintes C4 — run 1 : `ab950c039a95bb3a…` · run 2 : `ab950c039a95bb3a…` · identiques : OUI (SHA-256 de la trame canonique, ré-exécution intégrale du simulateur)

## SECTION A — LES 7 CRITÈRES (tableau PASS/FAIL avec valeurs exactes)

| # | Critère | Seuil | Observé | Verdict |
|---|---|---|---|---|
| C1a | Nommage correct T1-T3 (données corrigées fqH/fqR) | ≥ 82 % global | **81,0 %** (T1 79,3 % · T2 74,0 % · T3 100,0 %) | **FAIL** |
| C1b | ZONE CALME bilatérale | T4 ≥ 80 % ET fuite T1-T3 ≤ 2 % | T4 : **85,0 %** (15/100) · fuite : **0,00 %** (0/300) | **PASS** |
| C1c | Batterie d'arêtes E1-E8 (déterministe) | 8/8 | **8/8** | **PASS** |
| C2 | Routage sécurité | 8/8 · 5/5 · 0 FP (sur 400) | signal **8/8** · p_filtre **5/5** · FP p_filtre sur les 400 honnêtes : **1** · FP structurels : **0** | **FAIL** |
| C3 | Convergence Q1×Q2 + routage O7 | 6/6 supprimées · 4/4 prudence · honnêtes index 1,00 ≥ 90 % · **6/6 O7** | **6/6** · **4/4** · **94,0 %** · **6/6** | **PASS** |
| C4 | Reproductibilité ×2 (seed 42) | octet à octet | **OUI** (SHA-256) | **PASS** |
| C5 | Affichage et complétude (R1) | a **35/35** · b palier=affiché · c **règles c1/c2/c3** · d ombre+force | (a) **35/35** · (b) 437/437 sans écart · (c) c1 0 violation · c2 0 violation · c3 0 violation · (d) forces invalides : 0 | **PASS** |

**Bilan : 5/7 critères PASS.**

### A.1 C1a — détail par groupe (données corrigées)

| Groupe | n | Corrects | Taux | Avant branchement (0c3aaab) | Chemin counts (cd ≥ 3 ∧ cp ≥ 2) |
|---|---|---|---|---|---|
| T1_PERDRE (attendu : PEUR DE PERDRE) | 150 | 119 | 79,3 % | 66,7 % | 5,0 % — résidu d'erreur (→ LES DEUX) |
| T2_ETOUFFEE (attendu : PEUR D'ÊTRE ÉTOUFFÉE) | 100 | 74 | 74,0 % | 70,0 % | 1,5 % — résidu d'erreur (→ LES DEUX) |
| T3_LESDEUX (attendu : LES DEUX) | 50 | 50 | 100,0 % | 96,0 % | 45,4 % — → LES DEUX : étiquette attendue, non erreur |
| **Global T1-T3** | 300 | **243** | **81,0 %** | 72,7 % | — |

Lecture : le résidu théorique du chemin « counts » (cd ≥ 3 ET cp ≥ 2 → LES DEUX par priorité du moteur) est calculé exactement (loi binomiale sur pD/pP) : T1 ≈ 5,0 % · T2 ≈ 1,5 %. Le plafond documenté du run initial (≈ 89 %) était dérivé sous l'hypothèse de domination 93 % que le simulateur d'alors ne produisait pas (S-Q2-9) ; le branchement fqH/fqR la réalise (Section C).

### A.2 C1c — détail arête par arête

| Arête | Attendu | Obtenu | Palier | Index conv. | OK |
|---|---|---|---|---|---|
| E1_lesdeux_priorite | LES DEUX | LES DEUX | 🔴 | 1,00 | ✅ |
| E2_perdre_pur | PEUR DE PERDRE | PEUR DE PERDRE | 🟠 | 1,00 | ✅ |
| E3_suppression | SIGNAL LÉGER NON NOMMÉ | SIGNAL LÉGER NON NOMMÉ | 🟢 | 0,00 | ✅ |
| E4_lesdeux_counts | LES DEUX | LES DEUX | 🟠 | 1,00 | ✅ |
| E5_alarme_sans_main | ALARME SANS MAIN | ALARME SANS MAIN | 🟢 | 1,00 | ✅ |
| E6_zone_calme | ZONE CALME | ZONE CALME | 🟢 | 1,00 | ✅ |
| E7_lesdeux_q1 | LES DEUX | LES DEUX | 🟠 | 1,00 | ✅ |
| E8_palier_rouge | palier == 🔴 | ALARME SANS MAIN | 🔴 | 0,00 | ✅ |

### A.3 C2 — routage sécurité (détail, FP sur les 400 — D-Q2-D)

- **8 pièges SEC_H5** (H5=2, i_alarm=8, sA=3,3) : signal ACTIF attendu — obtenu **8/8**.
- **5 pièges P-FILTRE** (H5=3 « souvent », i_alarm=6, sA=3,8) : p_filtre attendu — obtenu **5/5**.
- **Faux positifs recalculés sur les 400 honnêtes** (D-Q2-D) : lecture (b) exigeante (p_filtre actif chez un honnête) : **1** · lecture (a) structurelle (signal sans H5 coché — contrôle, impossible par construction) : **0**.
- Taux de signal ACTIF chez les honnêtes (contexte — routage vers les écrans sécurité, pas une détection de piégé) : T1_PERDRE 42,7 % · T2_ETOUFFEE 7,0 % · T3_LESDEUX 42,0 % · T4_CALME 0,0 %.

### A.4 C3 — convergence + routage O7-NLP (D-Q2-E)

Piégés incohérents : INC_SIMPLE 6/6 (index 0,00 · supprimé · jamais d'étiquette d'ombre) · INC_DOUBLE 4/4 (index 0,50 · OMBRE_PRUDENCE) · honnêtes index 1,00 : 94,0 % (seuil 90 %).

| Profil O7 | Confiance NLP | Règle de routage | Routé vers | Attendu | Force | Étiquette (moteur) | Palier | OK |
|---|---|---|---|---|---|---|---|---|
| O7-N01 | 0,80 | confiance 0,80 ≥ 0,70 → catégorie routée == SÉCURISANT | **SÉCURISANT** | SÉCURISANT | SECURISANT | ZONE CALME | 🟢 | ✅ |
| O7-N02 | 0,80 | confiance 0,80 ≥ 0,70 → catégorie routée == INVALIDATION | **INVALIDATION** | INVALIDATION | SILENCIEUSE | PEUR DE PERDRE | 🟠 | ✅ |
| O7-N03 | 0,80 | confiance 0,80 ≥ 0,70 → catégorie routée == MIXTE | **MIXTE** | MIXTE | LUCIDITE | LES DEUX | 🟠 | ✅ |
| O7-N04 | 0,80 | confiance 0,80 ≥ 0,70 → catégorie routée == COMPOSITE | **COMPOSITE** | COMPOSITE | SILENCIEUSE | PEUR D'ÊTRE ÉTOUFFÉE | 🟠 | ✅ |
| O7-N05 | 0,62 | confiance 0,62 < 0,70 → NON-CLASSIFIABLE + force SILENCIEUSE acceptée | **NON-CLASSIFIABLE** | NON-CLASSIFIABLE | SILENCIEUSE | ALARME SANS MAIN | 🟢 | ✅ |
| O7-N06 | 0,55 | confiance 0,55 < 0,70 → NON-CLASSIFIABLE + force SILENCIEUSE acceptée | **NON-CLASSIFIABLE** | NON-CLASSIFIABLE | SILENCIEUSE | ALARME SANS MAIN | 🟠 | ✅ |

Le routage O7 ne porte que sur l'origine et la force ; l'étiquette reste produite par le moteur (Q1×Q2) — les 4 classifiables (confiance 0,80 ≥ 0,70) sont routés vers leur catégorie, les 2 sous seuil vers NON-CLASSIFIABLE avec force SILENCIEUSE.

### A.5 C5 — les 4 sous-tests révisés (D-Q2-B)

| Sous-test | Exigence | Observé | Verdict |
|---|---|---|---|
| (a) Templates | 32 paires cause×cluster + 3 spéciaux = 35 | **35/35** (SUPPRESSION_MASQUEE, MAINSLIBRES_EXPLIQUE, FALLTHROUGH_LEGER ajoutés) | PASS |
| (b) Palier recalculé = palier affiché | 100 % (réimplémentation indépendante) | **437/437** | PASS |
| (c) Règles c1/c2/c3 | c1 : index 0,00 jamais d'OMBRE (35 suppressions, 0 violation) · c2 : MAINSLIBRES collé à sa définition (27 MAINSLIBRES, 0 violations) · c3 : routage de chute exact (0 violation) | règles lues mot pour mot, violations cumulées : **0** | **PASS** |
| (d) Ombre OU calme + force, jamais les deux vides | 100 % | forces invalides : 0 · ombre/calme sans force : 0 | PASS |

Donnée de continuité (ancienne lecture C5c, plus une règle) : ZC→🟢 = 87/87 · 🟢 non-ZC = 77 (ALARME SANS MAIN 11, LES DEUX 10, PEUR D'ÊTRE ÉTOUFFÉE 21, PEUR DE PERDRE 14, SIGNAL LÉGER NON NOMMÉ 21) — cf. Section F.

## SECTION B — MATRICE NOMMAGE × VÉRITÉ (données corrigées) + ÉCARTS LÉGITIMES

| Type vrai | n | LES DEUX | PEUR DE PERDRE | PEUR D'ÊTRE ÉTOUFFÉE | ZONE CALME | ALARME SANS MAIN | SIGNAL LÉGER NON NOMMÉ | Supprimés (index 0,00) | Prudences (0,50) |
|---|---|---|---|---|---|---|---|---|---|
| T1_PERDRE (PEUR DE PERDRE) | 150 | 13 | 119 | 0 | 0 | 18 | 0 | 7 | 2 |
| T2_ETOUFFEE (PEUR D'ÊTRE ÉTOUFFÉE) | 100 | 3 | 0 | 74 | 0 | 17 | 6 | 0 | 2 |
| T3_LESDEUX (LES DEUX) | 50 | 50 | 0 | 0 | 0 | 0 | 0 | 0 | 6 |
| T4_CALME (ZONE CALME) | 100 | 0 | 0 | 0 | 85 | 7 | 8 | 7 | 0 |

Note de lecture : un profil « supprimé » (index 0,00) voit son étiquette d'OMBRE interdite (convergence) et tombe dans le fallthrough D-Q2-1 avec le template SUPPRESSION_MASQUEE affiché. Une prudence (0,50) laisse passer l'étiquette d'OMBRE avec le type OMBRE_PRUDENCE.

**Tableau séparé des 3 écarts légitimes (D-Q2-B) avec leurs effectifs** :

| Écart légitime | Règle associée | Effectif | Répartition par source | Template affiché |
|---|---|---|---|---|
| SUPPRESSION | c1 — index 0,00 : l'ombre est masquée, jamais étiquetée | **35** | ARÊTE 2 · GROUPE T1_PERDRE 7 · GROUPE T4_CALME 7 · PIÉGÉ 19 | SUPPRESSION_MASQUEE |
| MAINSLIBRES | c2 — profil ≠ RARES · somme < 0,30 : l'ombre ne saisit plus | **27** | GROUPE T1_PERDRE 10 · GROUPE T2_ETOUFFEE 15 · GROUPE T4_CALME 2 | MAINSLIBRES_EXPLIQUE |
| FALLTHROUGH | c3 — étiquettes de chute, routage i_alarm exact | **80** | ARÊTE 3 · GROUPE T1_PERDRE 18 · GROUPE T2_ETOUFFEE 23 · GROUPE T4_CALME 15 · O7-NLP 2 · PIÉGÉ 19 | FALLTHROUGH_LEGER |

Recouvrements : SUPPRESSION ∩ FALLTHROUGH = 35 (toute suppression débouche sur une étiquette de chute) · MAINSLIBRES ∩ FALLTHROUGH = 12 · SUPPRESSION ∩ MAINSLIBRES = 3. Les trois populations sont des écarts légitimes au nommage standard : elles sont traçées, expliquées par les données, et couvertes par les 3 templates ajoutés à la banque (C5a : 35/35).

**Matrice des PIÉGÉS (contrôle)** :

| Type de piège | n | LES DEUX | PEUR DE PERDRE | PEUR D'ÊTRE ÉTOUFFÉE | ZONE CALME | ALARME SANS MAIN | SIGNAL LÉGER NON NOMMÉ |
|---|---|---|---|---|---|---|---|
| INC_SIMPLE | 6 | 0 | 0 | 0 | 0 | 0 | 6 |
| INC_DOUBLE | 4 | 4 | 0 | 0 | 0 | 0 | 0 |
| SEC_H5 | 8 | 0 | 0 | 0 | 0 | 8 | 0 |
| PFILTRE | 5 | 0 | 0 | 0 | 0 | 5 | 0 |

**Routage O7-NLP (D-Q2-E)** : 4 classifiables (confiance 0,80 → catégorie attendue) + 2 sous seuil (NON-CLASSIFIABLE + force SILENCIEUSE) — détail complet en Section A.4, verdict intégré à C3 (6/6).

## SECTION C — STATISTIQUES PAR GROUPE POST-CORRECTION + COMPARAISON AU RUN INITIAL (mesure de l'effet du bug)

| Groupe | n | Count_D moyen (attendu) | Count_P moyen (attendu) | I_alarm moyen (μ) | H_norm moyen (attendu) | R_norm moyen (attendu) | Somme moyenne | Index 1,00 | Prudence | Supprimé | Signal ACTIF | P-FILTRE |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| T1_PERDRE | 150 | 4,48 (4,50) | 0,37 (0,40) | 6,51 (6,5) | 0,499 (0,432) | 0,066 (0,089) | 0,565 | 94,0 % | 1,3 % | 4,7 % | 42,7 % | 0,00 % |
| T2_ETOUFFEE | 100 | 0,64 (0,60) | 2,92 (2,80) | 5,86 (6,0) | 0,082 (0,089) | 0,483 (0,432) | 0,565 | 98,0 % | 2,0 % | 0,0 % | 7,0 % | 0,00 % |
| T3_LESDEUX | 50 | 2,98 (3,30) | 1,88 (1,80) | 6,90 (7,0) | 0,379 (0,333) | 0,322 (0,300) | 0,701 | 88,0 % | 12,0 % | 0,0 % | 42,0 % | 2,00 % |
| T4_CALME | 100 | 0,42 (0,36) | 0,17 (0,20) | 2,36 (2,3) | 0,020 (0,023) | 0,017 (0,023) | 0,037 | 93,0 % | 0,0 % | 7,0 % | 0,0 % | 0,00 % |

Lecture : les normes attendues sont recalculées sous le simulateur corrigé — E[freq] = E[clip(N(fq, 0,5), 1, 3)] exact (T1 : E[fqH] = 1,994 · T2 : E[fqR] = 1,994) ; H_norm ≈ 5×pH×E[fqH]/15, R_norm ≈ 3×pR×E[fqR]/9. Les moyennes observées concordent aux fluctuations d'échantillonnage près.

**Taux de domination AVANT / APRÈS branchement fqH/fqR (mesure de l'effet du bug S-Q2-1)** :

| Groupe | Domination conforme | Avant (0c3aaab) | Après (R1) | Δ points |
|---|---|---|---|---|
| T1_PERDRE | **H** | 109/150 = **72,7 %** | 131/150 = **87,3 %** | **+14,7** |
| T2_ETOUFFEE | **R** | 71/100 = **71,0 %** | 77/100 = **77,0 %** | **+6,0** |
| T3_LESDEUX | **MIXTE** | 14/50 = **28,0 %** | 8/50 = **16,0 %** | **−12,0** |
| T4_CALME | **LEGER** | 85/100 = **85,0 %** | 96/100 = **96,0 %** | **+11,0** |

Distributions complètes avant → après (H / R / MIXTE / LÉGER) :

| Groupe | H avant → après | R avant → après | MIXTE avant → après | LÉGER avant → après |
|---|---|---|---|---|
| T1_PERDRE | 109 (72,7 %) → 131 (87,3 %) | 2 (1,3 %) → 0 (0,0 %) | 11 (7,3 %) → 5 (3,3 %) | 28 (18,7 %) → 14 (9,3 %) |
| T2_ETOUFFEE | 4 (4,0 %) → 0 (0,0 %) | 71 (71,0 %) → 77 (77,0 %) | 4 (4,0 %) → 0 (0,0 %) | 21 (21,0 %) → 23 (23,0 %) |
| T3_LESDEUX | 14 (28,0 %) → 19 (38,0 %) | 11 (22,0 %) → 12 (24,0 %) | 14 (28,0 %) → 8 (16,0 %) | 11 (22,0 %) → 11 (22,0 %) |
| T4_CALME | 5 (5,0 %) → 1 (1,0 %) | 10 (10,0 %) → 3 (3,0 %) | 0 (0,0 %) → 0 (0,0 %) | 85 (85,0 %) → 96 (96,0 %) |

Lecture : le bug S-Q2-1 (fqH/fqR déclarés mais jamais utilisés) fixait la fréquence des comportements à U{1,2,3} : l'écart H_norm − R_norm passait sous 0,20 dans ≈ 27 % des tirages T1 (S-Q2-9). Le branchement D-Q2-A restaure la séparation visée par la spécification : T1 +14,7 pts sur la domination H, T2 +6,0 pts sur la domination R, T4 +11,0 pts sur la domination LÉGER — cas T3 : la domination MIXTE recule (28,0 % → 16,0 % au profit de H/R unilatérales) MAIS le nommage T3 atteint 100 % : avec des mains plus fortes des deux côtés (fqH = fqR = 2,2) et sA/sB ≥ 2,61, l'étiquette LES DEUX est posée par le chemin scores, indépendamment de la domination. C'est la mesure directe de l'effet du bug.

## SECTION D — QUATRE EXEMPLES TRACÉS DE BOUT EN BOUT

### Exemple 1 — honnête T1 « PEUR DE PERDRE » (données corrigées)

**T1_PERDRE-001** — source : GROUPE T1_PERDRE · vérité attendue : PEUR DE PERDRE · origine : O6 (MIXTE) · sA = 2,99 · sB = 2,01 · I_alarm = 6

1. **Réponses brutes** — D : {"D1": 0, "D2": 1, "D3": 0, "D4": 1, "D5": 1, "D6": 0} · P : {"P1": 0, "P2": 0, "P3": 0, "P4": 0}  
   · H : {"H1": 3, "H2": 3, "H3": 2, "H4": 2, "H5": 0} · R : {"R1": 0, "R2": 0, "R3": 0}
2. **Étape 1 (déclencheurs)** — Count_D = 3 · Count_P = 0 → profil « DISTANCE »
3. **Étape 2 (comportements)** — H_norm = 0,667 · R_norm = 0,000 · cases cochées = 4 · domination = H · somme = 0,667 (fréquences tirées autour de fqH = 2,3 / fqR = 1,5 — D-Q2-A)
4. **Filet sécurité** — H5 fréquence = 0 → signal = inactif · p_filtre = inactif
5. **Convergence Q1×Q2** — checks : [["C1", true]] → index = 1,00 · prudence = NON · supprimé = NON
6. **Nommage** — étiquette = **PEUR DE PERDRE** · type = OMBRE
7. **Force** — SILENCIEUSE
8. **Palier** — 🟠 (recalculé indépendamment : 🟠)

### Exemple 2 — honnête T4 « ZONE CALME » pure (palier vert)

**T4_CALME-001** — source : GROUPE T4_CALME · vérité attendue : ZONE CALME · origine : O1 (SÉCURISANT) · sA = 1,55 · sB = 2,33 · I_alarm = 2

1. **Réponses brutes** — D : {"D1": 0, "D2": 0, "D3": 0, "D4": 0, "D5": 0, "D6": 0} · P : {"P1": 0, "P2": 0, "P3": 0, "P4": 0}  
   · H : {"H1": 0, "H2": 0, "H3": 0, "H4": 0, "H5": 0} · R : {"R1": 0, "R2": 0, "R3": 0}
2. **Étape 1 (déclencheurs)** — Count_D = 0 · Count_P = 0 → profil « RARES »
3. **Étape 2 (comportements)** — H_norm = 0,000 · R_norm = 0,000 · cases cochées = 0 · domination = LEGER · somme = 0,000
4. **Filet sécurité** — H5 fréquence = 0 → signal = inactif · p_filtre = inactif
5. **Convergence Q1×Q2** — checks : [["C3", true]] → index = 1,00
6. **Nommage** — étiquette = **ZONE CALME** · type = CALME
7. **Force** — SECURISANT
8. **Palier** — 🟢

### Exemple 3 — SUPPRESSION_MASQUEE (écart légitime c1, template affiché)

**T4_CALME-016** — source : GROUPE T4_CALME · vérité attendue : ZONE CALME · sA = 1,89 · sB = 2,62 · I_alarm = 4 · *(T4-004 et T4-053 ne sont pas supprimés dans les données corrigées ; premier T4 supprimé retenu : T4_CALME-016)*

1. **Réponses brutes** — D : {"D1": 0, "D2": 1, "D3": 0, "D4": 0, "D5": 0, "D6": 0} · P : {"P1": 0, "P2": 0, "P3": 0, "P4": 0}  
   · H : {"H1": 0, "H2": 0, "H3": 2, "H4": 0, "H5": 0} · R : {"R1": 0, "R2": 0, "R3": 0}
2. **Étape 1 (déclencheurs)** — Count_D = 1 · Count_P = 0 → profil « RARES »
3. **Étape 2 (comportements)** — H_norm = 0,133 · R_norm = 0,000 · somme = 0,133
4. **Filet sécurité** — H5 fréquence = 0 → signal = inactif
5. **Convergence Q1×Q2** — checks : [["C2", false]] → index = 0,00 → **supprimé = OUI** : l'étiquette d'ombre est masquée
6. **Nommage** — étiquette de chute = **SIGNAL LÉGER NON NOMMÉ** · type = NON_NOMMÉ (aucune étiquette d'ombre fabriquée — règle c1)
7. **Force** — SECURISANT
8. **Palier** — 🟢
9. **Template affiché** — `SUPPRESSION_MASQUEE` : récit affiché quand l'index de convergence vaut 0,00 : l'étiquette d'ombre est masquée et la sortie emprunte le fallthrough prévu (D-Q2-1) — aucun nommage fabriqué.

### Exemple 4 — O7-NLP routé exactement (D-Q2-E)

**O7-N03** — source : O7-NLP · catégorie NLP proposée : MIXTE · confiance = 0,80 (≥ 0,70 → routée) · sA = 3,00 · sB = 3,00 · I_alarm = 7

1. **Réponses brutes** — D : {"D1": 1, "D2": 1, "D3": 1, "D4": 1, "D5": 0, "D6": 0} · P : {"P1": 1, "P2": 1, "P3": 1, "P4": 0}  
   · H : {"H1": 3, "H2": 2, "H3": 1, "H4": 0, "H5": 0} · R : {"R1": 2, "R2": 1, "R3": 0}
2. **Étape 1 (déclencheurs)** — Count_D = 4 · Count_P = 3 → profil « DEUX_COTES »
3. **Étape 2 (comportements)** — H_norm = 0,400 · R_norm = 0,333 · domination = MIXTE
4. **Convergence Q1×Q2** — checks : [["C1", true], ["C2", true]] → index = 1,00
5. **Nommage (moteur, inchangé)** — étiquette = **LES DEUX** · type = OMBRE
6. **Routage O7 (D-Q2-E)** — confiance 0,80 ≥ 0,70 → catégorie routée = **MIXTE** (attendu : MIXTE)
7. **Force** — LUCIDITE (dérivée de la catégorie routée)
8. **Palier** — 🟠
9. **Verdict de routage** — ✅ routé exactement (C3 : 6/6 O7).

## SECTION E — ANALYSE DES NON-NOMMÉS POST-CORRECTION

**Total non-nommés : 80/437 sorties** — ALARME SANS MAIN : 59 · SIGNAL LÉGER NON NOMMÉ : 21.

| Source | ALARME SANS MAIN | SIGNAL LÉGER NON NOMMÉ | Total |
|---|---|---|---|
| ARÊTE | 2 | 1 | 3 |
| GROUPE T1_PERDRE | 18 | 0 | 18 |
| GROUPE T2_ETOUFFEE | 17 | 6 | 23 |
| GROUPE T4_CALME | 7 | 8 | 15 |
| O7-NLP | 2 | 0 | 2 |
| PIÉGÉ | 13 | 6 | 19 |

**Application de la règle c1 (SUPPRESSION_MASQUEE)** : 35 sorties avec index 0,00 — 35/35 sont tombées dans un débouché non-OMBRE (aucune étiquette d'ombre fabriquée) : **100,0 %**. Parmi les non-nommés, 35 proviennent d'une suppression (template SUPPRESSION_MASQUEE) et 45 d'un signal léger authentique (template FALLTHROUGH_LEGER).

Routage par seuil vérifié (règle c3) : ALARME SANS MAIN — I_alarm min = 5, max = 9 · SIGNAL LÉGER NON NOMMÉ — I_alarm min = 1, max = 4. 0 violation de routage.

## SECTION F — SIGNALEMENTS (aucune correction de ma propre initiative)

**S-Q2-R1-1 — Texte exact des règles c1/c2/c3 tel qu'implémenté.** Le package reformule C5c en 3 règles « lues mot pour mot » et ancre les 3 templates (SUPPRESSION_MASQUEE · MAINSLIBRES_EXPLIQUE · FALLTHROUGH_LEGER) sur les 3 écarts légitimes du gabarit B (SUPPRESSION / MAINSLIBRES / FALLTHROUGH). Implémentation vérifiable machine : **c1** — toute sortie d'index de convergence 0,00 porte une étiquette de chute (jamais d'OMBRE), template SUPPRESSION_MASQUEE ; **c2** — toute force MAINSLIBRES respecte la définition du moteur (profil ≠ RARES · somme < 0,30), template MAINSLIBRES_EXPLIQUE, le paysage 🟢-OMBRE étant reporté en donnée de continuité (S-Q2-R1-10) ; **c3** — routage exact des étiquettes de chute (ALARME SANS MAIN ⇔ I_alarm ≥ 5 · SIGNAL LÉGER NON NOMMÉ ⇔ I_alarm ≤ 4), template FALLTHROUGH_LEGER. Si la rédaction d'orchestrateur des 3 règles diffère de cette implémentation, le libellé canonique prévaudra — les 3 règles telles qu'implémentées sont PASS ce run.

**S-Q2-R1-2 — Prose des 3 templates spéciaux.** Les 3 identifiants sont posés mot pour mot dans la banque (C5a : 35/35) et leurs rôles d'affichage sont définis (index 0,00 · MAINSLIBRES · chute) ; le texte définitif des récits utilisateur reste à la charge de la rédaction — les textes embarqués dans `wtc_q2_core.py` sont des libellés de rôle, substituables sans toucher au moteur ni aux critères.

**S-Q2-R1-3 — Exemple SUPPRESSION_MASQUEE (Section D).** Le package propose « T4-004 ou 053 » comme support de tracé : T4-004 et T4-053 ne sont pas supprimés dans les données corrigées ; premier T4 supprimé retenu : T4_CALME-016 Le tracé retenu est celui documenté en Section D (règle : la vérité des données prime sur l'exemple demandé).

**S-Q2-R1-4 — Ordre de consommation du RNG modifié par D-Q2-A (attendu).** Le tirage des fréquences passe de `rng.integers(1, 4)` à `rng.normal(fq, 0,5)` : à seed égal (42), les tirages R1 diffèrent du run initial — c'est précisément ce qui rend la comparaison avant/après de la Section C mesurable (même seed, moteur identique, seul le branchement change). Les probabilités pH/pR et la structure de tirage (case d'abord, fréquence ensuite) sont conservées.

**S-Q2-R1-5 — `longitudinal()` NON TESTÉ (D-Q2-F).** La fonction de re-test à 8 semaines est marquée NON TESTÉ dans le code (reporté WTC-SUIVI) et ne pénalise aucun critère — conformément au package.

**S-Q2-R1-6 — Lectures historiques C5c conservées comme données de continuité.** Les anciennes lectures (ZC→🟢 ; 🟢→ZC ; 🟢 jamais sur OMBRE) restent calculées et reportées en A.5 : ZC→🟢 = 87/87 ; 🟢 non-ZC = 77 (ALARME SANS MAIN 11, LES DEUX 10, PEUR D'ÊTRE ÉTOUFFÉE 21, PEUR DE PERDRE 14, SIGNAL LÉGER NON NOMMÉ 21) — couverts par les règles c2/c3 et leurs templates. La tension C5c vs docstring « palier indépendant du label » (S-Q2-10) est résolue par la reformulation : les paliers restent calculés sur les données.

**S-Q2-R1-7 — Mesure d'effet consolidée du bug S-Q2-1.** Effet du branchement sur la domination conforme : T1_PERDRE 72,7 % → 87,3 % · T2_ETOUFFEE 71,0 % → 77,0 % · T3_LESDEUX 28,0 % → 16,0 % · T4_CALME 85,0 % → 96,0 %. Le branchement D-Q2-A restaure une large part de la séparation visée par la spécification (T3 : MIXTE 28,0 % → 16,0 % mais T3 100 % correct via le chemin scores ; T1 +14,7 pts sur dom H ; T2 +6,0 pts sur dom R) ; aucun seuil moteur n'a été touché — seul le simulateur a été branché conformément à D-Q2-A.

**S-Q2-R1-8 — ANALYSE DU RÉSIDU C1a (81,0 % < 82 %) : le branchement fqH/fqR ferme S-Q2-1 mais ne réalise pas l'hypothèse « domination ≈ 93 % » de la spécification.** Mesuré après branchement : dom H (T1) = 87,3 % · dom R (T2) = 77,0 % — l'écart-type de la fréquence (Normal(fq, 0,5) écrêté [1;3]) combiné à l'inflation par zéro (pH/pR inchangés) laisse 13-23 % des profils T1/T2 en domination LÉGER, qui tombent dans le fallthrough D-Q2-1 quand i_alarm ≥ 5 : T1_PERDRE : 18 non-nommés dont 11 à domination LÉGER (mains non saillantes) · T2_ETOUFFEE : 23 non-nommés dont 23 à domination LÉGER (mains non saillantes). Décomposition du plafond atteignable sous D-Q2-A : T1 ≈ 87 % dom − ≈ 5,0 % (chemin counts cd ≥ 3 ∧ cp ≥ 2) ≈ 82 % ; T2 ≈ 77 % dom − ≈ 1,5 % (counts) ≈ 75 %. Trois options d'arbitrage (AUCUNE appliquée) : (1) réduire la dispersion des fréquences (ex. sd 0,25) — modification de D-Q2-A, hors périmètre exécuteur ; (2) recalibrer le seuil C1a sur le plafond réel ≈ 81 % ; (3) adoucir la règle de domination du moteur (rapport relatif au lieu de l'écart absolu 0,20).

**S-Q2-R1-9 — Mécanique exacte du FP C2 (1 sur 400 — D-Q2-D).** Porteur : **T3_LESDEUX-047** (GROUPE T3_LESDEUX · sA = 3,8011 ≥ 3,70 · H5 = 3 « souvent » · label LES DEUX · palier 🔴 · index conv. 1,00). La porte p_filtre (H5 = 3 ET sA ≥ 3,70) s'ouvre sur un profil honnête parfaitement convergent : probabilité par profil T3 ≈ P(H5 = 3 | cochés) × P(sA ≥ 3,70) ≈ 0,27 × 0,008 ≈ 0,22 %, soit ≈ 5 % par run de 50 T3 — événement de frontière, absent du run initial par tirage (0/400 en 0c3aaab), présent ce run (1/400). Le verdict C2 est posé sur la lettre du package (0 FP sur 400) → FAIL. Aucune correction appliquée ; l'orchestrateur arbitrera (définition FP, calibration de la porte, ou seuil sA).

**S-Q2-R1-10 — Paysage 🟢-OMBRE : structurel, préexistant, hors règles révisées.** Ce run : 45 paliers 🟢 sous étiquette d'OMBRE = 9 à mains libres (somme < 0,30 → couvert par MAINSLIBRES_EXPLIQUE) + 36 à alarme calme et mains actives (somme ≥ 0,60 · i_alarm ≤ 5 · aucun signal · sA < 3,70) + 0 dans la bande ambrée [0,30 ; 0,60[ (impossible par construction du palier). Run initial : 37 = 12 + 25 + 0 — même structure. L'ancienne lecture c3 (« 🟢 jamais sur OMBRE ») reste inatteignable par construction ; elle sort du périmètre des règles avec la reformulation D-Q2-B, et l'état « ombre à mains actives, alarme calme » est documenté ici pour arbitrage d'affichage (aucun des 3 templates ne le couvre aujourd'hui).

**S-Q2-R1-11 — Critères encore en échec : C1a, C2.** Détail dans les sections correspondantes ; aucune correction libre appliquée.


## SECTION G — VERDICT FINAL

### Fiche WTC-Q2-R1 (à contresigner par le superviseur)

```text
══════════════════════════════════════════════════════
FICHE WTC-Q2-R1 — « Ce qui m'effraie vraiment » (révision post-validation)
Exécuté par Data Insight · 2026-10-15 · seed 42 · 437 sorties (431 officielles + 6 O7-NLP)
D-Q2-A à D-Q2-F appliquées · code 0c3aaab conservé
C1a nommage ≥ 82 % (corrigé) : 81,0 %   FAIL
C1b calme bilatéral          : 85,0 % / 0,00 %  PASS
C1c arêtes 8/8               : 8/8     PASS
C2 sécurité (FP sur 400)     : 8/8 · 5/5 · 1FP     FAIL
C3 convergence + 6/6 O7      : 6/6 · 4/4 · 94,0 % · 6/6     PASS
C4 reproductibilité ×2       : OUI    PASS
C5 a 35/35 · b · c1/c2/c3 · d: (a) 35/35 (b) OK (c) OK (d) OK     PASS
VERDICT AGENT : À CORRIGER · Note : 6/10
Contresignature GLM : [lecture, insertion RIO-02]
══════════════════════════════════════════════════════
```

### **VERDICT PACKAGE : À CORRIGER** (5/7 critères PASS)

**Note de confiance : 6/10** — barème déclaré a priori (run WTC-Q2) : 7/7 critères PASS → 9/10 (le 10/10 est réservé à la contresignature GLM et à l'insertion RIO-02) ; 6/7 → 7,5/10 ; 5/7 → 6/10 ; 4/7 → 4,5/10 ; moins → 3/10. Justification : 5/7 critères PASS sur les données corrigées.

**URL du dépôt GitHub :** https://github.com/georgyfr/WAIRYU-Dating/tree/main/Wairyu%20th%C3%A9rapie%20couple/validation-q2-r1 — arborescence : `src/` (wtc_q2_core.py · wtc_q2_simulator.py · wtc_q2_validation.py · wtc_q2_figures.py), `results/` (rapport.md · criteres_q2_r1.json · profils_calcules.csv · matrice_nommage.csv · stats_groupes.csv · non_nommes.csv · comparaison_avant_apres.csv · run_initial/), `figures/` (4 PNG 1920×1080).

---

*Sorties brutes associées : `results/profils_calcules.csv` (437 sorties, champs complets), `results/criteres_q2_r1.json` (7 critères + métadonnées + modifications appliquées), `results/matrice_nommage.csv`, `results/stats_groupes.csv`, `results/non_nommes.csv`, `results/comparaison_avant_apres.csv` (mesure de l'effet du bug S-Q2-1), `results/run_initial/profils_calcules.csv` (référence 0c3aaab archivée).*
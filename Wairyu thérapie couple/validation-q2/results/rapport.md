# RAPPORT FINAL DÉTAILLÉ — PACKAGE WTC-Q2 (« CE QUI M'EFFRAIE VRAIMENT »)

## Validation de la Quête 2 — instrument original WAIRYU, fiche RIO-02 · moteur WTC-Q2-01 · simulateur WTC-Q2-02 (seed 42) · validateur WTC-Q2-03

**Rôle : EXÉCUTEUR STRICT.** Le moteur et le simulateur ont été copiés tels quels (fournis intégralement par l'orchestrateur) ; aucun seuil, aucun poids, aucune règle modifiés. Les anomalies sont signalées en Section F, jamais corrigées de ma propre initiative. Plafonds calculés a priori (leçon WTC-Q1) posés par la spec §4 et rappelés sous chaque critère. Effectifs réels du run : **400 honnêtes** (150+100+50+100) + **23 piégés** (6+4+8+5) + **8 arêtes** = **431 sorties calculées** (la spec cite « 500 honnêtes » / « 520 profils » — écarts signalés S-Q2-2).

Empreintes C4 — run 1 : `6a67ea5d93f54da5…` · run 2 : `6a67ea5d93f54da5…` · identiques : OUI

## SECTION A — LES 7 CRITÈRES (tableau PASS/FAIL avec valeurs exactes)

| # | Critère | Seuil | Observé | Verdict |
|---|---|---|---|---|
| C1a | Nommage correct T1-T3 (étiquette = type vrai) | ≥ 82 % global (plafond doc. ≈ 89 %) | **72,7 %** (T1 66,7 % · T2 70,0 % · T3 96,0 %) | **FAIL** |
| C1b | ZONE CALME bilatérale | T4 ≥ 80 % ET fuite T1-T3 ≤ 2 % | T4 : **92,0 %** (8/100) · fuite : **0,00 %** (0/300) | **PASS** |
| C1c | Batterie d'arêtes E1-E8 (déterministe) | 8/8 | **8/8** | **PASS** |
| C2 | Routage sécurité | 8/8 · 5/5 · 0 FP | signal **8/8** · p_filtre **5/5** · FP p_filtre honnêtes : **0** · FP structurels : **0** | **PASS** |
| C3 | Convergence Q1×Q2 | 6/6 supprimées · 4/4 prudence · honnêtes index 1,00 ≥ 90 % | **6/6** · **4/4** · **94,8 %** | **PASS** |
| C4 | Reproductibilité ×2 (seed 42) | octet à octet | **OUI** (SHA-256) | **PASS** |
| C5 | Affichage et complétude | 100 % sur 4 sous-tests | (a) 32/32 · (b) 431/431 paliers recalculés = affichés · (c) ZC→🟢 91/93, 🟢 sur OMBRE : 37 · (d) forces invalides : 0 | **FAIL** |

**Bilan : 5/7 critères PASS.**

### A.1 C1a — détail par groupe (plafond documenté a priori : T1 ≈ 86 %, T2 ≈ 91 %, T3 ≈ 95 %, global ≈ 89 %)

| Groupe | n | Corrects | Taux | Plafond doc. |
|---|---|---|---|---|
| T1_PERDRE (attendu : PEUR DE PERDRE) | 150 | 100 | 66,7 % | ≈ 86 % |
| T2_ETOUFFEE (attendu : PEUR D'ÊTRE ÉTOUFFÉE) | 100 | 70 | 70,0 % | ≈ 91 % |
| T3_LESDEUX (attendu : LES DEUX) | 50 | 48 | 96,0 % | ≈ 95 % |
| **Global T1-T3** | 300 | 218 | **72,7 %** | ≈ 89 % |

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

### A.3 C2 — routage sécurité (détail)

- **8 pièges SEC_H5** (H5=2, i_alarm=8, sA=3,3) : signal ACTIF attendu — obtenu 8/8.
- **5 pièges P-FILTRE** (H5=3 « souvent », i_alarm=6, sA=3,8) : p_filtre attendu — obtenu 5/5.
- **Faux positifs** : définition absente de la spec (signalé S-Q2-4) ; lecture (a) structurelle (signal sans H5 coché — impossible par construction) : **0** ; lecture (b) exigeante (p_filtre actif chez un honnête) : **0**.
- Taux de signal ACTIF chez les honnêtes (contexte — le signal est un routage vers les écrans sécurité, pas une détection de piégé) : T1_PERDRE 38,0 % · T2_ETOUFFEE 11,0 % · T3_LESDEUX 38,0 % · T4_CALME 0,0 %.

### A.4 C5 — les 4 sous-tests

| Sous-test | Exigence | Observé | Verdict |
|---|---|---|---|
| (a) Templates cause×cluster | 32/32 présents | 32/32 | PASS |
| (b) Palier recalculé = palier affiché | 100 % | 431/431 (réimplémentation indépendante) | PASS |
| (c) ZONE CALME ↔ 🟢 | lecture c1 : ZC→🟢 100 % · c3 : 🟢 jamais sur OMBRE | ZC→🟢 : 91/93 · 🟢 sur OMBRE : 37 · 🟢 non-ZC (NON_NOMMÉ/CALME léger, documenté S-Q2-3) : 56 | FAIL |
| (d) Toute sortie porte ombre OU calme + force, jamais les deux vides | 100 % | forces invalides : 0 · ombre/calme sans force : 0 | PASS |

## SECTION B — MATRICE NOMMAGE × VÉRITÉ (4 types vrais × 6 étiquettes) + suppressions/prudences

| Type vrai | n | LES DEUX | PEUR DE PERDRE | PEUR D'ÊTRE ÉTOUFFÉE | ZONE CALME | ALARME SANS MAIN | SIGNAL LÉGER NON NOMMÉ | Supprimés (index 0,00) | Prudences (0,50) |
|---|---|---|---|---|---|---|---|---|---|
| T1_PERDRE (PEUR DE PERDRE) | 150 | 19 | 100 | 0 | 0 | 30 | 1 | 6 | 1 |
| T2_ETOUFFEE (PEUR D'ÊTRE ÉTOUFFÉE) | 100 | 5 | 0 | 70 | 0 | 22 | 3 | 1 | 1 |
| T3_LESDEUX (LES DEUX) | 50 | 48 | 0 | 0 | 0 | 2 | 0 | 1 | 5 |
| T4_CALME (ZONE CALME) | 100 | 0 | 0 | 1 | 92 | 1 | 6 | 6 | 0 |

Note de lecture : un profil « supprimé » (index 0,00) voit son étiquette d'OMBRE interdite (D-Q2-2) et tombe dans le fallthrough D-Q2-1 (ALARME SANS MAIN / SIGNAL LÉGER NON NOMMÉ) — il apparaît donc à la fois dans la colonne d'étiquette de chute ET au décompte des suppressions. Une prudence (index 0,50) laisse passer l'étiquette d'OMBRE avec le type OMBRE_PRUDENCE.

**Matrice des PIÉGÉS (contrôle)** :

| Type de piège | n | LES DEUX | PEUR DE PERDRE | PEUR D'ÊTRE ÉTOUFFÉE | ZONE CALME | ALARME SANS MAIN | SIGNAL LÉGER NON NOMMÉ |
|---|---|---|---|---|---|---|---|
| INC_SIMPLE | 6 | 0 | 0 | 0 | 0 | 0 | 6 |
| INC_DOUBLE | 4 | 4 | 0 | 0 | 0 | 0 | 0 |
| SEC_H5 | 8 | 0 | 0 | 0 | 0 | 8 | 0 |
| PFILTRE | 5 | 0 | 0 | 0 | 0 | 5 | 0 |

## SECTION C — STATISTIQUES PAR GROUPE (comparées aux paramètres simulés)

| Groupe | n | Count_D moyen (attendu) | Count_P moyen (attendu) | I_alarm moyen (μ) | H_norm moyen | R_norm moyen | Somme moyenne | Index 1,00 | Prudence | Supprimé | Signal ACTIF | P-FILTRE |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| T1_PERDRE | 150 | 4,48 (4,50) | 0,43 (0,40) | 6,66 (6,5) | 0,410 | 0,098 | 0,508 | 95,3 % | 0,7 % | 4,0 % | 38,0 % | 0,00 % |
| T2_ETOUFFEE | 100 | 0,41 (0,60) | 3,02 (2,80) | 6,27 (6,0) | 0,125 | 0,459 | 0,584 | 98,0 % | 1,0 % | 1,0 % | 11,0 % | 0,00 % |
| T3_LESDEUX | 50 | 3,32 (3,30) | 1,92 (1,80) | 6,80 (7,0) | 0,355 | 0,333 | 0,688 | 88,0 % | 10,0 % | 2,0 % | 38,0 % | 0,00 % |
| T4_CALME | 100 | 0,40 (0,36) | 0,19 (0,20) | 2,19 (2,3) | 0,025 | 0,031 | 0,056 | 94,0 % | 0,0 % | 6,0 % | 0,0 % | 0,00 % |

Lecture : les moyennes observées concordent avec les paramètres de simulation aux fluctuations d'échantillonnage près (H_norm attendu ≈ 5×pH×2/15 ; R_norm attendu ≈ 3×pR×2/9). Les écarts éventuels notables sont traités en Section F.

## SECTION D — TROIS TRACÉS DE BOUT EN BOUT

### Exemple 1 — honnête T1 « PEUR DE PERDRE » (chaîne complète)

**T1_PERDRE-002** — source : GROUPE T1_PERDRE · vérité attendue : PEUR DE PERDRE · origine : O4 (PARENTIFICATION) · sA = 3,15 · sB = 2,32 · I_alarm = 7

1. **Réponses brutes** — D : {"D1": 1, "D2": 1, "D3": 1, "D4": 1, "D5": 1, "D6": 1} · P : {"P1": 0, "P2": 0, "P3": 0, "P4": 0}
   · H : {"H1": 3, "H2": 3, "H3": 2, "H4": 0, "H5": 1} · R : {"R1": 0, "R2": 0, "R3": 0}
2. **Étape 1 (déclencheurs)** — Count_D = 6 · Count_P = 0 → profil « DISTANCE »
3. **Étape 2 (comportements)** — H_brut = 9 → H_norm = 0,600 · R_brut = 0 → R_norm = 0,000 · cases cochées = 4 · domination = H · somme = 0,600
4. **Filet sécurité** — H5 fréquence = 1 → signal = ACTIF · p_filtre = inactif
5. **Convergence Q1×Q2** — checks : [["C1", true]] → index = 1,00 · prudence = NON · supprimé = NON
6. **Nommage** — étiquette = **PEUR DE PERDRE** · type = OMBRE
7. **Force** — SILENCIEUSE
8. **Palier** — 🔴

### Exemple 2 — honnête T4 « ZONE CALME » (force activée)

**T4_CALME-001** — source : GROUPE T4_CALME · vérité attendue : ZONE CALME · origine : O1 (SÉCURISANT) · sA = 1,72 · sB = 2,29 · I_alarm = 3

1. **Réponses brutes** — D : {"D1": 0, "D2": 0, "D3": 0, "D4": 0, "D5": 0, "D6": 0} · P : {"P1": 0, "P2": 0, "P3": 0, "P4": 0}
   · H : {"H1": 0, "H2": 0, "H3": 0, "H4": 0, "H5": 0} · R : {"R1": 0, "R2": 0, "R3": 0}
2. **Étape 1 (déclencheurs)** — Count_D = 0 · Count_P = 0 → profil « RARES »
3. **Étape 2 (comportements)** — H_brut = 0 → H_norm = 0,000 · R_brut = 0 → R_norm = 0,000 · cases cochées = 0 · domination = LEGER · somme = 0,000
4. **Filet sécurité** — H5 fréquence = 0 → signal = inactif · p_filtre = inactif
5. **Convergence Q1×Q2** — checks : [["C3", true]] → index = 1,00 · prudence = NON · supprimé = NON
6. **Nommage** — étiquette = **ZONE CALME** · type = CALME
7. **Force** — SECURISANT
8. **Palier** — 🟢

### Exemple 3 — piège sécurité SEC_H5 (signal ACTIF)

**P-SEC-01** — source : PIÉGÉ · vérité attendue : SEC_H5 · origine : O3 (INVISIBILITÉ) · sA = 3,30 · sB = 2,00 · I_alarm = 8

1. **Réponses brutes** — D : {"D1": 0, "D2": 0, "D3": 0, "D4": 0, "D5": 0, "D6": 0} · P : {"P1": 0, "P2": 0, "P3": 0, "P4": 0}
   · H : {"H1": 0, "H2": 0, "H3": 0, "H4": 0, "H5": 2} · R : {"R1": 0, "R2": 0, "R3": 0}
2. **Étape 1 (déclencheurs)** — Count_D = 0 · Count_P = 0 → profil « RARES »
3. **Étape 2 (comportements)** — H_brut = 2 → H_norm = 0,133 · R_brut = 0 → R_norm = 0,000 · cases cochées = 1 · domination = LEGER · somme = 0,133
4. **Filet sécurité** — H5 fréquence = 2 → signal = ACTIF · p_filtre = inactif
5. **Convergence Q1×Q2** — checks : [["C1", false]] → index = 0,00 · prudence = NON · supprimé = OUI
6. **Nommage** — étiquette = **ALARME SANS MAIN** · type = NON_NOMMÉ
7. **Force** — SILENCIEUSE
8. **Palier** — 🔴
9. **Routage** — signal ACTIF → suivre dans les écrans sécurité ; p_filtre inactif (H5 = 2, il aurait fallu H5 = 3 « souvent » ET sA ≥ 3,70).

## SECTION E — ANALYSE DES NON-NOMMÉS (fallthrough D-Q2-1)

**Total non-nommés : 87/431 sorties** — ALARME SANS MAIN : 70 · SIGNAL LÉGER NON NOMMÉ : 17.

| Source | ALARME SANS MAIN | SIGNAL LÉGER NON NOMMÉ | Total |
|---|---|---|---|
| ARÊTE | 2 | 1 | 3 |
| GROUPE T1_PERDRE | 30 | 1 | 31 |
| GROUPE T2_ETOUFFEE | 22 | 3 | 25 |
| GROUPE T3_LESDEUX | 2 | 0 | 2 |
| GROUPE T4_CALME | 1 | 6 | 7 |
| PIÉGÉ | 13 | 6 | 19 |

**Application de la règle D-Q2-1** : 35 sorties avec index 0,00 (ombre supprimée) — 35/35 sont bien tombées dans un débouché non-OMBRE (aucune étiquette d'ombre fabricée) : **100,0 %**.

Fallthrough par seuil : ALARME SANS MAIN requiert I_alarm ≥ 5 ; SIGNAL LÉGER NON NOMMÉ couvre les I_alarm ≤ 4. Répartition vérifiée : ALARME SANS MAIN : I_alarm min = 5, max = 10 · SIGNAL LÉGER NON NOMMÉ : I_alarm min = 0, max = 4.

## SECTION F — SIGNALEMENTS (aucune correction de ma propre initiative)

**S-Q2-1 — Paramètres morts dans le simulateur fourni (fichier non modifié).** La signature `gen(n, pD, pP, pH, pR, fqH, fqR, mu_i, sd_i, muA, muB, origines)` déclare `fqH` et `fqR` (fréquences moyennes de comportements) mais le corps de `gen()` ne les utilise JAMAIS : les fréquences H/R sont tirées via `pH`/`pR` et `rng.integers(1, 4)` (uniforme 1-3), pas autour de fqH/fqR. Conséquence : la « fréquence moyenne » des comportements est fixée par pH/pR × uniforme, les valeurs fqH/fqR (2,3/1,5 ; 1,5/2,3 ; 2,2/2,2 ; 1,4/1,4) sont documentaires. Aucune correction appliquée — l'orchestrateur arbitrera (brancher fqH/fqR dans le tirage ou les retirer de la signature).

**S-Q2-2 — Effectifs cités par la spec vs effectifs réels du simulateur.** C2 dit « 0 faux positif sur les **500** honnêtes » et C5b « palier recalculé = palier affiché sur **520** profils » — ce sont les effectifs du cycle Q1 (500+20). Le simulateur Q2 fourni génère **400 honnêtes** (150+100+50+100) + **23 piégés** = **423 profils** (+8 arêtes = 431 sorties). Tous les critères ont été évalués sur les effectifs réels ; les libellés « 500/520 » de la spec sont à mettre à jour par l'orchestrateur.

**S-Q2-3 — C5c « ZONE CALME ↔ 🟢 » : la bijection stricte est impossible par construction — et les données confirment l'échec sous TOUTES les lectures.** La batterie d'arêtes DE LA SPEC MÊME produit des 🟢 non-ZONE CALME : E5 (ALARME SANS MAIN, I_alarm = 5 → palier 🟢 car ni signal, ni I_alarm ≥ 6, ni somme ≥ 0,30) et E3 (SIGNAL LÉGER NON NOMMÉ, I_alarm = 2, sA = 3,20 < 3,70 → 🟢). La règle du palier (docstring du moteur : « sévérité maximale entre filet et scores, indépendante du label ») rend la double implication 🟢↔ZC mathématiquement insatisfaisable. Résultats mesurés ce run : c1 (ZC→🟢) = 91/93 — 2 exceptions documentées en S-Q2-10 ; c2 (🟢→ZC strict) = 56 🟢 non-ZC ; c3 (🟢 jamais sur OMBRE) = 37 violations (mécanique en S-Q2-10). Le critère C5c échoue donc QUELLE QUE soit la lecture retenue — l'orchestrateur arbitrera la reformulation (les trois lectures chiffrées sont reportées en Section A.4).

**S-Q2-4 — Définition du « faux positif » absente (C2).** Deux lectures calculées et reportées toutes deux en Section A.3 : (a) structurelle — signal ACTIF sans H5 coché (impossible par construction, ce qui rejoint la §0 : « atteignable par construction ») ; (b) exigeante — p_filtre actif chez un honnête. Le verdict C2 est posé sur (a) ET (b) simultanément. Si l'orchestrateur entendait « aucun honnête ne déclenche le signal » (lecture c), ce critère serait faux PAR CONSTRUCTION du simulateur (des honnêtes T1 ont H5 coché + sA ≥ 3,21/I_alarm ≥ 7 — voir taux par groupe en A.3) : signalée, non corrigée.

**S-Q2-5 — Origine multi-choix (1-2) et O7 non exercées.** L'Étape 3 de l'instrument prévoit « 1-2 choix max + texte libre » et un routage O7 → NLP local (confiance ≥ 0,70, sinon NON CLASSABLE). Le moteur fourni ne traite qu'une origine unique ; les groupes simulés ne génèrent que O1-O6 (jamais O7) ; les branches COMPOSITE / NON-CLASSIFIABLE existent dans la banque de templates (C5a : 32/32) mais ne sont jamais atteintes ce cycle. Non testable — signalé, non implémenté (hors périmètre de l'exécuteur).

**S-Q2-6 — Arêtes sans origine.** Les 8 arêtes E1-E8 ne portent pas de champ `origine` ; zone_force a été évaluée avec la convention « LIBRE » (O7 implicite) pour ces profils. La force n'est pas un objet des critères C1c (l'étiquette et le palier le sont) — impact nul sur les critères.

**S-Q2-7 — `longitudinal()` non exercé.** La fonction de re-test à 8 semaines (I_alarm ±2, normes ±0,15) n'a pas de données ce cycle (aucun couple avant/après simulé) — code livré, non validé, hors périmètre des 7 critères.

**S-Q2-8 — BUG BLOQUANT DU FICHIER SIMULATEUR FOURNI (réparation mécanique documentée).** Les boucles des pièges SEC_H5 et PFILTRE contiennent `d,p,r = vides()` alors que `vides()` renvoie UN 4-TUPLE (D, P, H, R) → `ValueError: too many values to unpack (expected 3)` — le simulateur fourni est INEXÉCUTABLE tel quel. Réparation appliquée (minimale, mécanique, sémantique inchangée) : `d,p,_h,r = vides()` — D, P, R vides comme documenté dans le commentaire de la spec ; le dict `h` déjà construit (H5 = 2 ou 3) est conservé ; aucun tirage aléatoire ni seuil impliqué. L'orchestrateur voudra corriger la source canonique.

**S-Q2-9 — DIAGNOSTIC DE L'ÉCHEC C1a : le plafond a priori (≈ 89 %) repose sur une hypothèse de domination contredite par le simulateur fourni — le seuil de 82 % semble INATTEIGNABLE en l'état.** La dérivation du plafond (spec §4) suppose « domination H ≈ 93 % » (T1) et « dom. R ≈ 93 % » (T2). Mesuré ce run : domination H dans T1 = 72,7 % (109/150; LEGER 28 · MIXTE 11 · R 2) ; domination R+MIXTE dans T2 = 75,0 % (75/100 ; LEGER 21 · H 4). Mécanique : avec pH = 0,65 × fréquence U{1,2,3} sur 5 items (H) et pR = 0,15 sur 3 items (R), H_norm ≈ 0,433 ± 0,17 et R_norm ≈ 0,100 ± 0,15 → l'écart H_norm − R_norm passe sous 0,20 dans ≈ 27 % des tirages → dom ≠ H. Les profils T1/T2 non dominants tombent dans le fallthrough D-Q2-1 (T1 : 30 ALARME SANS MAIN + 1 SIGNAL LÉGER ; T2 : 22 + 3) et une partie en LES DEUX accidentel (T1 : 19 ; T2 : 5). CHAÎNE CAUSALE PROBABLE : le bug S-Q2-1 (paramètres fqH/fqR déclarés mais JAMAIS utilisés par gen()) — les valeurs documentaires fqH = 2,3 vs fqR = 1,5 (T1) auraient produit une séparation nettement plus forte si elles avaient été branchées dans le tirage. Options d'arbitrage (AUCUNE appliquée) : (1) brancher fqH/fqR dans gen() et re-exécuter ; (2) recalibrer le seuil C1a sur le plafond réel mesuré (≈ 73-75 %) ; (3) redéfinir la règle de domination du moteur (ex. rapport relatif au lieu de l'écart absolu 0,20).

**S-Q2-10 — MÉCANIQUE EXACTE DES ÉCHECS C5c (toutes les lectures).** (a) ZC→🟢 : 2 exceptions — T4_CALME-004 et T4_CALME-053 : UNE SEULE case R cochée à la fréquence 3 (« souvent ») → R_norm = 0,333 → somme = 0,333 ∈ [0,30 ; 0,60[ → palier 🟠 (I_alarm ≤ 4, aucun signal, aucun score rouge) — la sévérité du palier est calculée sur les données, indépendante du label (design du moteur) : une ZONE CALME avec un « souvent » déclenche 🟠. (b) 🟢 sur OMBRE : 37 sorties (12 LES DEUX · 10 PEUR DE PERDRE · 15 PEUR D'ÊTRE ÉTOUFFÉE) — mécanique : somme < 0,30 (mains peu actives) + I_alarm ≤ 5 + aucun signal + sA < 3,70 → 🟢 alors que l'étiquette d'ombre est posée par les scores/comptages Q1. (c) Les 19 🟢 restants non-ZC sont des NON_NOMMÉ (ALARME SANS MAIN 7 · SIGNAL LÉGER 12) — conformes au design (fallthrough léger). Tension de fond à arbitrer : C5c (cohérence paliers/étiquettes) vs docstring du palier (« indépendant du label ») — deux lectures du système sont défendables, l'exécuteur ne tranche pas.

## SECTION G — VERDICT FINAL

### Fiche WTC-Q2 (à contresigner par le superviseur)

```text
══════════════════════════════════════════════════════
FICHE WTC-Q2 — « Ce qui m'effraie vraiment »
Exécuté par Data Insight · 2026-10-15 · seed 42 · 431 sorties (400 honnêtes + 23 piégés + 8 arêtes)
C1a nommage ≥ 82 %          : 72,7 %   FAIL
C1b calme bilatéral         : 92,0 % / 0,00 %  PASS
C1c arête 8/8               : 8/8     PASS
C2 sécurité 8/8 · 5/5 · 0FP : 8/8 · 5/5 · 0FP     PASS
C3 convergence              : 6/6 · 4/4 · 94,8 %     PASS
C4 reproductibilité         : OUI    PASS
C5 affichage 4 sous-tests   : (a) 32/32 (b) 431/431 (c) KO (d) OK     FAIL
VERDICT AGENT : À CORRIGER · Note : 6/10
Contresignature GLM : [lecture, arbitrage éventuel, insertion RIO-02]
══════════════════════════════════════════════════════
```

### **VERDICT PACKAGE : À CORRIGER** (5/7 critères PASS)

Motifs (déclarés tels quels, cf. Sections A/F) : échec de C1a, C5 — aucune correction appliquée de ma propre initiative ; l'arbitrage appartient au superviseur.

**Note de confiance : 6/10** — barème déclaré a priori : 7/7 critères PASS → 9/10 (le 10/10 est réservé à la contresignature GLM et à l'insertion RIO-02) ; 6/7 → 7,5/10 ; 5/7 → 6/10 ; 4/7 → 4,5/10 ; moins → 3/10. Justification : 5/7 critères PASS.

**URL du dépôt GitHub :** https://github.com/georgyfr/WAIRYU-Dating/tree/main/Wairyu%20th%C3%A9rapie%20couple/validation-q2 — arborescence : `src/` (wtc_q2_core.py · wtc_q2_simulator.py · wtc_q2_validation.py · wtc_q2_figures.py), `results/` (rapport.md · criteres_q2.json · profils_calcules.csv · matrice_nommage.csv · stats_groupes.csv · non_nommes.csv), `figures/` (4 PNG 1920×1080).

---

*Sorties brutes associées : `results/profils_calcules.csv` (431 sorties, champs complets), `results/criteres_q2.json` (7 critères + métadonnées), `results/matrice_nommage.csv`, `results/stats_groupes.csv`, `results/non_nommes.csv`.*

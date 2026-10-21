# RAPPORT DE CORRECTION PHILOSOPHIQUE — RIO-03 « Ce qui me porte »

> **Mandat fondateur** (trace 1a15ed7ad00bc0fd, exécution du 22/10/2026 trace
> 1a15fdebd4c235a1) : porter RIO-03 de 53/100 à 100/100 sur la grille de
> l'audit du 21/10/2026 (F1 déceler gradué · F2 problème + gravité · F3
> solutions · F4 bilan), **par fichiers supplémentaires** — zéro modification
> de l'existant — en insistant sur l'exactitude des calculs. Même gabarit que
> RIO-01 (Task 165, commit 2a7a2f9) et RIO-02 (Task 167, commit 717f08d).
> **Bandeau permanent** : tout est validé en simulation (D-SIM) — la mécanique
> est validée, pas la prévalence clinique.

---

## 1. Ce qui a été ajouté (et ce qui n'a PAS été touché)

Package `validation-q3/correction-philosophique/` — deux fichiers source, un
JSON de critères, ce rapport, un .gitignore. **Aucun moteur existant n'a été
modifié** : le vrai cœur reste `validation-q3-r1/src/wtc_q3_core_r1.py`
(révision R1, décisions D-Q3-R1-A à H), importé tel quel avec vérification
d'intégrité à l'import (banque F1-F6, 4 statuts journal, miroir avec clé
« presumés » [D-Q3-R1-F], limite des 2 par densité — cas SURCHARGE réel).
Les **templates d'affichage des 6 forces et de la SILENCIEUSE** sont ceux du
package R1 (`wtc_q3_validation_r1.py`, D-Q3-R1-H) — importés mot pour mot,
jamais réécrits. Les junctions utilisent les VRAIS moteurs Q4 (CONFIGS_9) et
Q5 (pas, empreintes, suivi, re-test) et le VRAI cœur Q2-R1 (palier + filet).

### La particularité RIO-03 : le PLANCHER HÉRITÉ (F2)

Le cœur Q3 ne calcule AUCUN palier — c'est la quête du positif (banque
fermée de 6 forces activées par 3 voies, 0 voie → SILENCIEUSE). La gravité
affichée est donc dérivée de façon **conservatrice** de l'héritage Q1/Q2 :

- **plancher(sA, sB, somme) = vrai `palier` du cœur Q2** appelé avec les
  inconnues de RIO-03 posées à leur valeur la plus sûre (i_alarm = 0, H5 = 0)
  et comp réduit à la seule clé que le vrai palier lit (prouvé) ;
- **monotonicité prouvée** (stage planche, 211 200 états Q2 : 100 états H ×
  16 états R × 11 i_alarm × 4 bandes sA × 3 bandes sB) :
  `palier(ial, h5f) ≥ plancher` partout — **le plancher n'exagère jamais la
  sévérité**, il peut seulement la sous-estimer ; identité stricte aux états
  (ial = 0, H5 = 0) : 4 800/4 800 ;
- **dictionnaire espion** : sur les 211 200 appels, le vrai palier n'a lu que
  la clé `somme` (0 clé hors somme) ; formule de la somme vérifiée bit-exact
  sur les 1 600 états H×R (`round(hb/15, 3) + round(rb/9, 3)` arrondi à 3) ;
- **S1** (orientation chaleureuse, phrase canon « pas un échec ») =
  plancher 🔴 — c'est-à-dire (sA ≥ 3,70) OU (sA ≥ 3,21 ET sB ≥ 3,21), les
  seules conditions 🔴 du vrai palier indépendantes des inconnues ;
- **S2** (« à surveiller » + re-test proposé à 8 semaines) = plancher 🟠
  (somme héritée ∈ [0,30 ; 0,60)) sans S1 ;
- **D-CRISE : NON APPLICABLE** à cet instrument (aucun i_alarm ni H5 dans ses
  entrées — consigné, comme RIO-01). La borne est honnête : affichée à
  l'écran (« ce palier est un plancher prudent — la vraie sévérité peut être
  plus haute, jamais plus basse ») et au bloc 6 du bilan.

### Les trois couches manquantes (audit Task 163)

- **F2 — problème + gravité (12 → 25)** : « QUAND DEMANDER DE L'AIDE » avec
  les seuils S1/S2 ci-dessus posés d'avance (clause permanente affichée) ;
  ombre héritée décrite de façon causale sans étiquette (6 libellés du cœur
  repris tels quels) ; statuts journal affichés comme informations — le N
  n'est JAMAIS une sanction (4 clauses dédiées) ; miroir affiché comme
  information, jamais un défaut.
- **F3 — solutions (6 → 25)** : « CE QUE TU PEUX CHANGER — 3 paliers » :
  🟢 un exercice de capitalisation par force (F1-F6) + variante SILENCIEUSE ;
  🟠 un module de couple choisi mécaniquement par le miroir (secrets →
  nommer une force gardée ; partages → célébrer une force partagée ; vide →
  temps hebdomadaire sans obligation) ; 🔴 l'orientation chaleureuse (S1).
  Branchement quête « pas » sur le VRAI `selectionner_pas` (face dominante
  Q1 × empreinte Q2), suivi 14 jours par le vrai `suivre_14_jours`
  (célébré ≥ 9 · ajustement 7-8 · reprise ≤ 6 — sanction None, vérifié 15/15),
  re-test 8 semaines par le vrai `programmer_re_test_q1` + le VRAI
  `long_termique` du cœur (force apparue = FIABLE, force disparue =
  re-vérifiée avant tout affichage, cas unitaires 4/4).
- **F4 — bilan (10 → 25)** : fragment de bilan L8 à 7 blocs (position ·
  forme · empreinte · couple · force · limites · palier/pas) — le bloc forme
  porte la trace A/B/C RÉELLE du cœur (traçabilité voie par voie), le bloc
  couple pointe la VRAIE table Q4 (types + configurations atteignables), le
  bloc empreinte la VRAIE table Q5, le bloc force les templates réels.

## 2. La preuve (pipeline exécuté ×2, SHA-256 identiques)

**Espace énuméré (COR1/COR2)** — 1 990 656 configurations = l'espace des
états distincts de la couche : 4 c1_mode (PRES/SOL/ESP/RIEN) × 2 bandes c2
(seuil 2) × 32 états effectifs c3 × 4 bandes sA × 3 bandes sB × 2 états
(h_norm ≥ r_norm) × 54 états journal (26 motifs de voies C × 2 bandes N +
2 états incomplets) × 6 libellés d'ombre hérités. Chaque configuration est
exécutée par le VRAI `verifier_forces`, habillée par la couche (bloc écran +
fragment L8) et vérifiée. Les compactations sont PROUVÉES exhaustivement :

| Compaction | Preuve | Résultat |
|---|---|---|
| c3 : 512 sous-ensembles → 32 états effectifs (V, F, R, T, Pr) | 147 456 vérifications (512 × 288 bases) sur le vrai moteur | 0 écart |
| journal : 4 096 (T,U,L,M) → 26 motifs × 2 bandes N + 2 incomplets | 4 096 vérifications, chaque quadruplet vs son représentant | 0 écart |
| h_norm ≥ r_norm : 160 paires entières → 2 états | 160 vérifications + borne d'égalité pile (≥ inclusif, documentée) | 0 écart |
| N du journal : jamais lu par les forces | 52 vérifications (26 représentants × 2 paires) | 0 écart |
| label d'ombre : ne crée jamais de force | 8 batteries × 6 libellés | 0 écart |
| c2 : bandes {0,1} / {2,3} plates | 192 vérifications | 0 écart |

**Double chemin (COR2)** — la sélection recalculée depuis les tables du
cahier §1 (mot pour mot, sans appeler le cœur) converge avec le vrai moteur
sur les 1 990 656 configurations ET sur les 475 profils archivés : **0 écart**.

**Miroir exhaustif (COR2)** — 512 × 512 = 262 144 paires (c3, c4) : le VRAI
`coherence_miroir` ≡ chemin indépendant, 0 écart, aucun crash, clé
« presumés » présente sur branche vide [D-Q3-R1-F]. Interprétations réelles
distribuées : 19 171 « visibles de l'autre » · 242 972 « restent
invisibles à tes yeux » · 1 « aucune force déclarée ».

**Plancher (COR2/COR3)** — 211 200 états Q2 : 0 violation de monotonie ·
clés lues = [« somme »] uniquement · formule somme 1 600/1 600 · identité
4 800/4 800 à (ial=0, H5=0) · sondes à l'effet attendu (sA 3,21 avec sB ≥ 3,21
sépare · sA 3,70 sépare · sB 3,21 avec sA ≥ 3,21 sépare · 2,61 stable pour le
plancher · somme 0,29|0,30 sépare et 0,59|0,60 sépare — **0,30 pile inclus,
0,60 exclu**, cohérent avec le vrai palier).

**Grille Q1 (COR3)** — les 28 scores atteignables vs seuils 2,61/3,21/3,70 :
**0 borne pile** (dist min 0,05 / 0,01 / 0,03) ; équivalence
(sA ≥ 2,61) ⇔ face ≠ RASSURÉE vérifiée sur les 28.

**Vocabulaire écran (COR4)** — **0 mot interdit** (canon Partie 9) sur les
**10 356 textes d'écran distincts** générés sur l'espace, sur les clauses
permanentes, sur les templates réels, sur les libellés du cœur et sur les
clauses miroir ; bandeau D-SIM présent sur 100 % des blocs.

**Anti-fabrication (COR5)** — sur tout l'espace ET sur les 475 archivés :
SILENCIEUSE ssi 0 voie (vrai moteur) · templates réels affichés EXACTEMENT
pour les forces retenues (0 marqueur sur SILENCIEUSE, 0 marqueur manquant
sinon) · « rien à fabriquer » apparaît ssi ZONE CALME · les forces exclues
par la limite des 2 (1 969 248 cas dans l'espace) sont tracées au bilan,
jamais affichées comme forces — 0 incohérence.

**Re-score bit-exact (COR6)** — les 475 profils R1 (400 honnêtes + 40
SANS_FORCE + 20 SURCHARGE + 15 ASYM_MIROIR) régénérés par le VRAI simulateur
R1 (seed 42) et comparés au CSV archivé
`validation-q3-r1/results/profils_marque.csv` : **6 175 comparaisons
(13 champs × 475), 0 écart** (groupe, id, c1_mode, c2, c3, sA, sB,
label_ombre, journal_statut, forces_moteur, forces_verite, accord_c2,
nb_forces). Puis couche appliquée : fragments complets 475/475 ·
SILENCIEUSES réelles 61/475 (conforme au rapport R1) · planchers archivés
🔴 1 · 🟠 179 · 🟢 295 → S1 1 · S2 179 · long_termique STABLE 475/475.

**Couplage pas (COR7)** — 18/18 (3 faces Q1 × 6 étiquettes) résolus dans la
vraie banque P1-P6 · empreintes réelles documentées (PEUR DE PERDRE →
PEUR_DE_PERDRE · PEUR D'ÊTRE ÉTOUFFÉE → PEUR_D_ETRE_ETOUFFEE · LES DEUX /
ZONE CALME / ALARME SANS MAIN / SIGNAL LÉGER NON NOMMÉ → ZONE_CALME — vraie
table `empreinte`, comportement archivé repris tel quel) · identité face Q5 ⇔
type Q4 12/12 sur les bandes · suivi 14 jours sans sanction 15/15 ·
long_termique 4/4 · re-test 8 semaines (vrai `programmer_re_test_q1`, jamais
forcé).

**Reproductibilité (COR8)** — pipeline exécuté 2 fois :
SHA-256 run1 = run2 = `6bb890e272dd11f8a35506e51eb3af194ce3925f0e4c383161b2ad5193da1d6d`.

## 3. Les 8 critères — tableau récapitulatif

| Critère | Observé | Verdict |
|---|---|---|
| COR1 fragment complet | 1 990 656/1 990 656 · 475/475 archivées | **PASS** |
| COR2 double chemin | 0 écart (espace + archivées) · compactations prouvées · miroir 262 144/262 144 · plancher 211 200/211 200 · clés ⊆ {somme} | **PASS** |
| COR3 seuils d'aide | S1 663 552 · S2 663 552 (sur 1 990 656) · 0 borne pile · sondes cohérentes · bornes somme correctes | **PASS** |
| COR4 vocabulaire écran | 0 mot interdit (10 356 textes + standings + templates réels) · D-SIM 100 % | **PASS** |
| COR5 anti-fabrication | 0 abus (espace + archivés) · exclues 1 969 248 cas, 0 incohérence | **PASS** |
| COR6 re-score bit-exact | 475 lignes · 6 175 comparaisons · 0 écart · fragments 475/475 | **PASS** |
| COR7 couplage pas | 18/18 · identité 12/12 · suivi 15/15 sans sanction · long_termique 4/4 · re-test 8 semaines | **PASS** |
| COR8 reproductibilité | SHA ×2 identiques `6bb890e272dd11f8…` | **PASS** |

**Tous PASS : True** — mode tronçonné (fenêtre sandbox), 24 tronçons stage1
× 2 runs + rests + fusions ; compteurs sommés, ensembles unis (y compris les
textes distincts).

## 4. Re-score RIO-03 (barème de l'audit, preuve P1 simulation)

| Critère | Avant | Après | Justification |
|---|---|---|---|
| F1 déceler gradué | 25 | **25** | inchangé — instrument VALIDÉ 7/7 (R1) : sélection déterministe 100 % C2, anti-fabrication 40/40, banque fermée |
| F2 problème + gravité | 12 | **25** | « QUAND DEMANDER DE L'AIDE » (S1/S2 sur plancher monotone prouvé) + ombre héritée causale sans étiquette + journal sans sanction — P1 (1 990 656 + 211 200 états) |
| F3 solutions | 6 | **25** | 3 paliers à contenu réel (6 exercices + 3 modules + orientation canon) + pas réel 18/18 + suivi sans sanction + re-test 8 semaines (long_termique + programmer_re_test_q1 réels) — P1 |
| F4 bilan | 10 | **25** | fragment L8 7 blocs complet sur tout l'espace + 475 archivés, junctions réelles Q4/Q5, trace A/B/C réelle — P1 |
| **Total** | **53 %** | **100 %** | au barème P1 simulation |

**Moyennes recalculées (exactes)** : dimension ATTACHEMENT
(100+100+100+61+67)/5 = 428/5 = **85,6 %** · global 23 quêtes
(1 708 + 47)/23 = 1 755/23 = **76,3 %**. Les scores des 22 autres quêtes de
l'audit restent inchangés.

## 5. Limites (lues avant toute décision)

1. **Tout est validé en simulation** (D-SIM) — le constat n°1 de l'audit
   (zéro réel, VALID-01) reste vrai ; la prévalence clinique n'est pas
   établie.
2. **Le plancher est une borne basse** : la vraie sévérité Q2 (avec i_alarm
   et H5) peut être plus haute — jamais plus basse (monotonicité prouvée).
   Consigné à l'écran et au bloc 6 du bilan. D-CRISE reste non applicable à
   cet instrument.
3. **La vraie table `empreinte` du cœur Q5** mappe LES DEUX / ALARME SANS
   MAIN / SIGNAL LÉGER NON NOMMÉ vers ZONE_CALME — comportement archivé du
   moteur réel, repris tel quel (aucune réécriture) ; documenté au COR7.
4. Les FAIL hérités du run initial Q3 (C1a 0/40 · C2 91,25 %) ont été
   RÉPARÉS à la révision R1 (D-Q3-R1-A/B) — RIO-03 entre dans la correction
   avec un package R1 VALIDÉ 7/7 ; la correction n'a rien à masquer.
5. Le récapitulatif de DIMENSION (fédération des fragments L8) reste
   l'action n°2 de l'audit ; les libellés réels des questions restent
   l'action n°3.

## 6. Traçabilité

- **Moteurs réels importés** (jamais recopiés, jamais modifiés) :
  `validation-q3-r1/src/wtc_q3_core_r1.py` + `wtc_q3_validation_r1.py`
  (templates D-Q3-R1-H) · `validation-q2-r1/src/wtc_q2_core.py` (palier +
  filet) · `validation-q4/src/wtc_q4_core.py` · `validation-q5/src/wtc_q5_core.py`.
- **Vérité archivée** : `validation-q3-r1/results/profils_marque.csv`
  (475 profils, run R1 du 15/10/2026, empreinte `1e445ea8…`).
- **Empreinte du pipeline de correction (×2)** :
  `6bb890e272dd11f8a35506e51eb3af194ce3925f0e4c383161b2ad5193da1d6d`.
- **Exécution** : mode tronçonné CORR_RUN/CORR_PART (24 tronçons stage1 ×
  2 runs + rest1-rest4 + fusions + final) — compteurs sommés, ensembles
  unis ; le résultat est celui du pipeline complet (mêmes étapes, mêmes
  agrégats).

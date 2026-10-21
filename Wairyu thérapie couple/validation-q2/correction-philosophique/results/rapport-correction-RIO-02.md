# RAPPORT DE CORRECTION PHILOSOPHIQUE — RIO-02 « Ce qui m'effraie vraiment »

> **Demande fondateur (trace 1a15ed7ad00bc0fd, exécution 21-22/10/2026)** : même
> ordre que RIO-01 — « il ne s'agit pas de modifier ce qui a été fait, mais de
> créer des fichiers supplémentaires pour compléter ce qui doit être fait en
> termes de calcul. Il faut beaucoup mettre l'accent sur les calculs parce que
> j'insiste sur l'exactitude des résultats. » RIO-02 était à 53/100 (audit
> §3 : F1 25 · F2 12 · F3 6 · F4 10 — moyenne attachement 57,4 % au moment de
> l'audit).
> **Réponse** : ce package est un FICHIER SUPPLÉMENTAIRE
> (`validation-q2/correction-philosophique/`). Rien d'existant n'a été modifié —
> ni le cœur R1 (`validation-q2-r1/src/wtc_q2_core.py`), ni les moteurs Q4/Q5,
> ni aucun rapport antérieur. La couche importe les VRAIS moteurs et ajoute les
> trois couches manquantes identifiées par l'audit du 21/10 (Task 163) : F2
> gravité, F3 solutions, F4 bilan.

- **Date** : 2026-10-22 · **Vérité archivée** : les 437 sorties du pipeline R1
  (seed 42) · **Exécutions** : pipeline complet ×2 (COR8)
- **Moteurs réels importés (zéro réimplémentation, zéro modification)** :
  - `validation-q2-r1/src/wtc_q2_core.py` — cœur RIO-02, révision R1
    (intégrité vérifiée à l'import : 6 D + 4 P + 5 H + 3 R, 35/35 templates C5a)
  - `validation-q4/src/wtc_q4_core.py` — croisement à deux (9 configurations)
  - `validation-q5/src/wtc_q5_core.py` — pas + suivi 14 jours (seuil 9 vérifié)
- **Sorties** : `results/correction_criteres.json` (agrégats complets + SHA-256
  des 2 exécutions : `f195ee3d0b2961fa…`) · ce rapport

---

## 1. Les règles pré-enregistrées (écrites AVANT tout calcul)

Calquées sur R1-R9 de la correction RIO-01 (commit 2a7a2f9) et adaptées à la
quête ombre. La doctrine du vocabulaire écran CONFIRMÉE par le fondateur
(Task 164) est appliquée : on décelle de façon graduée, on n'imprime jamais
d'étiquette clinique.

| Règle | Contenu |
|---|---|
| R1 — palier | le palier affiché est celui du VRAI cœur `palier(i_alarm, sA, sB, comp, sig)` — 🟢/🟠/🔴, sévérité maximale entre filet et données (validée P1 par C5b du package R1 : 437/437 sans écart) ; la couche n'ajoute aucun palier parallèle |
| R2 — seuil d'aide S1 | sig["signal"] OU sig["p_filtre"] OU palier 🔴 → orientation chaleureuse affichée (phrase canon) ; la voie H5 est le court-circuit de cette quête — contrairement à RIO-01, D-CRISE est APPLICABLE ici via le vrai `signal_securite` |
| R3 — seuil d'aide S2 | palier 🟠 sans S1, OU étiquette de chute ALARME SANS MAIN (type NON_NOMMÉ avec i_alarm ≥ 5) sans S1 → « à surveiller », re-test à 8 semaines (seuils du vrai `longitudinal` : alarme ±2 · gestes ±0,15 — NON TESTÉ D-Q2-F, consigné) |
| R4 — qualité avant sens | le gate de qualité de RIO-02 est la CONVERGENCE Q1×Q2 (le vrai garde du cœur, D-Q2-2) : index 0,00 → étiquette d'OMBRE masquée (jamais posée, note affichée, template SUPPRESSION_MASQUEE du cœur) ; index 0,50 → OMBRE_PRUDENCE + mention de prudence ; index 1,00 → lecture |
| R5 — anti-fabrication (§5.5) | la force affichée est EXACTEMENT celle du vrai `zone_force` (bijection valeur↔texte, vérifiée configuration par configuration) ; « rien à fabriquer » n'apparaît que sur ZONE CALME ; sur SILENCIEUSE avec ombre active → « terrain de travail, pas un verdict » ; sur SILENCIEUSE sans ombre → silence gardé |
| R6 — force silencieuse | repris dans R5 (deux variantes SILENCIEUSE) |
| R7 — vocabulaire écran (Partie 9) | les 16 mots interdits sont exclus de tout texte affiché ; les 6 libellés du cœur (LES DEUX · PEUR DE PERDRE · PEUR D'ÊTRE ÉTOUFFÉE · ZONE CALME · ALARME SANS MAIN · SIGNAL LÉGER NON NOMMÉ) sont des noms maison descriptifs, vérifiés propres |
| R8 — D-SIM | bandeau « Lecture issue d'une simulation » sur chaque bloc écran |
| R9 — couplage réel | le pas annoncé provient du VRAI `selectionner_pas(sA, sB, label)` du cœur Q5 (face dominante Q1 × empreinte Q2) ; suivi 14 jours par le vrai `suivre_14_jours` (seuils 9/7, sanction None) ; re-test Q1 à 8 semaines par le vrai `programmer_re_test_q1` |

**Zone d'ombre causale, sans étiquette** : le descriptif causal est porté par
les sorties réelles du cœur (profil de déclencheurs, domination des gestes,
label d'ombre). Exemples réels de clauses générées : PEUR DE PERDRE → « c'est
l'éloignement qui déclenche l'alarme » + domination H → « tes mains
s'accrochent — chercher le contact et les mots pour apaiser l'alarme » ;
PEUR D'ÊTRE ÉTOUFFÉE → « c'est le près qui déclenche l'envie d'air » + dom. R →
« tes mains lâchent — prendre de l'air pour apaiser la pression ». **CE QUE TU
PEUX CHANGER — contenu produit (ce qui était P3)** : 7 exercices maison 🟢 (6
par étiquette + 1 variante suppression) · 4 modules de couple 🟠 (par
domination : H, R, MIXTE, LEGER) · 1 orientation 🔴 (phrase canon exacte, 3
variantes d'en-tête selon la source : palier 🔴 / signal sécurité / filtre de
sécurité). Chaque palier annonce le pas à venir via la vraie table Q5 et le
re-test à 8 semaines via les vrais seuils du cœur.

---

## 2. Méthode de preuve — l'espace énuméré et pourquoi il est exhaustif

Le cœur Q2 lit ses entrées uniquement au travers de quantités dérivées
(vérifié mot pour mot dans le code : comptages, sommes, comparaisons à des
seuils) :

- **cd ∈ [0;6]** (6 items D binaires) et **cp ∈ [0;4]** (4 items P) — 35 paires ;
- **état H** : la fréquence H5 ∈ {0,1,2,3} et les 4 autres cases H
  (cochées k ∈ [0;4], somme de leurs fréquences ∈ [k;3k]) — exactement
  **100 états**, chacun réalisé par un dictionnaire d'items canonique ;
- **état R** : cases cochées k ∈ [0;3], somme ∈ [k;3k] — **16 états** ;
- **i_alarm ∈ [0;10]**, lu uniquement au travers de 5 bandes exactes
  {0-4 · 5 · 6 · 7 · 8-10} (inventaire des comparaisons : z_calme ≤ 4,
  fallthrough ≥ 5, palier ≥ 6 et ≥ 8, signal ≥ 7) ;
- **sA/sB continus**, lus uniquement au travers des seuils {2,61 · 3,21 ·
  3,70} pour sA et {2,61 · 3,21} pour sB → **4 × 3 = 12 bandes exactes** ;
- **origine** (8 catégories), lue uniquement par `zone_force` au travers de
  `origine == "SÉCURISANT"` → **2 sorties réalisables** par état (SÉCURISANT
  vs les 7 autres, toutes évaluées : 2 080 clés × 8 = 16 640 évaluations).

Soit **7 × 5 × 100 × 16 × 5 × 12 = 3 360 000 états structurels**, chacun
assemblé pour ses 2 sorties zone_force → **6 720 000 configurations**, toutes
passées par les VRAIES fonctions du cœur (`profil_declencheurs`,
`comportements`, `signal_securite`, `convergence`, `nommage`, `zone_force`,
`palier`) puis par la couche (écran + fragment). La platitude des bandes est
prouvée par la **batterie de frontière** : chaque seuil (5 pour sA/sB, 4 pour
i_alarm) est sondé des deux côtés (±0,0001 pour les scores, ±1 pour i_alarm)
sur 96 états-repos — la sortie doit reproduire EXACTEMENT celle du représentant
de bande : **9/9 sondes stables, 0 violation** (et les seuils sont réellement
actifs : 48-96 cas changent de signature de part et d'autre, sauf sB=3,21 qui
ne s'active qu'avec sA ≥ 3,21 — cohérent avec le palier 🔴 conjoint).

**Stage 2 — re-score bit-exact des 437 sorties archivées du pipeline R1**
(400 honnêtes + 23 piégés + 8 arêtes + 6 O7-NLP) : les réponses brutes
archivées (colonnes d/p/h/r du CSV) sont re-passées par le vrai cœur puis par
la couche — **20 colonnes recomputées par ligne, 0 écart** (counts, profils,
normes, domination, somme, h5, signal, p_filtre, convergence index/prudence/
supprimé/checks, label, type, force, palier, palier_recalcule).

---

## 3. Les 8 critères de la correction — tous PASS

| Critère | Définition | Observé | Verdict |
|---|---|---|---|
| COR1 — fragment complet | 6 720 000 configurations → fragment L8 7 blocs, 0 champ vide + 437/437 archivées | **6 720 000/6 720 000 · 437/437** | **PASS** |
| COR2 — dérivation du palier | chemin INDÉPENDANT (entiers bruts, sans le moteur) ≡ vrai cœur (signal + p_filtre + palier) sur tout l'espace ; 437/437 = palier ET palier_recalcule | **6 720 000/6 720 000 convergents · 0 écart archivé** | **PASS** |
| COR3 — seuils d'aide | S1 = signal ∨ p_filtre ∨ palier 🔴 ; S2 = palier 🟠 ou ALARME SANS MAIN sans S1 ; 0 borne pile sur la grille Q1 ; batterie de frontière stable | S1 **4 312 000** · S2 **1 351 318** · pile **0** (dist min 2,61 → 0,05 · 3,21 → 0,01 · 3,70 → 0,03) · sondes **9/9** | **PASS** |
| COR4 — vocabulaire écran | 0 mot interdit sur tous les textes + standings + libellés du cœur ; D-SIM partout | max/texte **0/0** · standing **0** · labels cœur **0** · **626** textes distincts · D-SIM manquants **0/0** | **PASS** |
| COR5 — anti-fabrication | « rien à fabriquer » ssi ZONE CALME ; force affichée ≡ vrai zone_force | zc abus **0** · zc manquant **0** · force abus **0** | **PASS** |
| COR6 — gate convergence | R4 : 0,00 → ombre masquée + note ; 0,50 → OMBRE_PRUDENCE + mention ; re-score bit-exact 437 ; pièges et arêtes conformes | supprimé **35 (note 35/35)** · prudence **14 (note 14/14)** · convergent 388 · écarts **0** · P-INCS **6/6** · P-INCD **4/4** · P-SEC **8/8** · P-FILT **5/5** · arêtes **8/8 OK** | **PASS** |
| COR7 — couplage pas | 18/18 (3 faces Q1 × 6 étiquettes Q2) → pas du VRAI selectionner_pas ; empreintes réelles ; identité face⇔type ; suivi sans sanction | **18/18** · identité **12/12** · suivi **15/15 sans sanction** (CELEBRE/AJUSTEMENT/REPRISE) | **PASS** |
| COR8 — reproductibilité | pipeline ×2 → SHA-256 identiques | `f195ee3d0b2961fa…` = `f195ee3d0b2961fa…` | **PASS** |

---

## 4. Chiffres exacts du balayage exhaustif (6 720 000 configurations)

**Paliers dérivés mécaniquement (R1, max-sévérité du vrai cœur)** :

| Palier | Configurations | Part exacte |
|---|---|---|
| 🟢 Seul·e — exercice maison | **1 254 680** | 18,6714… % |
| 🟠 À deux — module de couple | **1 153 320** | 17,1639… % |
| 🔴 Avec un professionnel | **4 312 000** | 64,1646… % |

Cohérence interne : S1 = 4 312 000 = exactement le compte des paliers 🔴 — sur
tout l'espace énuméré, tout signal/p_filtre débouche déjà sur un palier 🔴 du
vrai cœur (les pièges SEC_H5/PFILTRE archivés le confirment : i_alarm 8 ou
sA ≥ 3,70) ; les deux chemins (S1 par filet, 🔴 par sévérité) se rejoignent au
chiffre près.

**Étiquettes (nommage réel)** : LES DEUX 4 572 180 · ALARME SANS MAIN
1 328 576 · SIGNAL LÉGER NON NOMMÉ 332 028 · PEUR D'ÊTRE ÉTOUFFÉE 259 620 ·
PEUR DE PERDRE 227 480 · ZONE CALME 116. **Types de sortie** : OMBRE
3 948 620 · NON_NOMMÉ 1 660 604 · OMBRE_PRUDENCE 1 110 660 · CALME 116.
**Forces réelles** : SECURISANT 3 360 000 · LUCIDITE 2 286 090 · SILENCIEUSE
1 053 332 · MAINSLIBRES 20 520 · CALME_RICHE 58. **Convergence** : index 1,00
→ 4 352 320 · 0,50 → 1 110 660 · 0,00 → 1 257 020 (toute suppression débouche
sur une étiquette de chute, jamais d'OMBRE — vérifié 6 720 000/6 720 000).

**Junctions réelles** — empreintes du VRAI `core_q5.empreinte` : PEUR DE
PERDRE → PEUR_DE_PERDRE · PEUR D'ÊTRE ÉTOUFFÉE → PEUR_D_ETRE_ETOUFFEE · ZONE
CALME → ZONE_CALME ; et, comportement réel du moteur consigné tel quel (zéro
modification) : LES DEUX · ALARME SANS MAIN · SIGNAL LÉGER NON NOMMÉ →
ZONE_CALME (défaut de la table pour tout label sans mot-clé CALME/PERDRE/
ÉTOUFF). Le pas annoncé reste donc toujours un vrai pas de la banque P1-P6 —
la table complète 18/18 est dans `correction_criteres.json`.

**Sur les 400 honnêtes archivés** : paliers 🟢 149 · 🟠 125 · 🔴 126 ; S1 126 ;
S2 134 ; fragments complets 437/437 (toutes sources).

---

## 5. Stage 2 — re-score bit-exact des 437 sorties archivées du pipeline R1

- **Bit-exactitude : 0 écart** sur 20 colonnes recomputées par ligne — soit
  **8 740 comparaisons exactes** — y compris les colonnes `palier` ET
  `palier_recalcule` du package R1 (le double chemin du validateur R1 reproduit
  exactement, et le chemin indépendant de cette correction converge avec les
  deux).
- **Gate R4 sur la vérité archivée** : 35 suppressions (index 0,00) → 35/35
  notes de suppression affichées, type NON_NOMMÉ (jamais d'OMBRE — le vrai
  mécanisme D-Q2-2) · 14 prudences (0,50) → 14/14 mentions affichées · 388
  lectures convergentes.
- **Piégés** : P-INCS **6/6 supprimés** (l'ombre jamais nommée sur incohérence
  simple) · P-INCD **4/4 prudence** · P-SEC **8/8 signal actif** (la voie H5
  fonctionne sur données réelles) · P-FILT **5/5 p_filtre**.
- **Arêtes E1-E8 : 8/8 conformes** aux attentes du package R1 (E1 LES DEUX 🔴 ·
  E2 PEUR DE PERDRE 🟠 · E3 SIGNAL LÉGER 🟢 · E4 LES DEUX 🟠 · E5 ALARME SANS
  MAIN 🟢 · E6 ZONE CALME 🟢 · E7 LES DEUX 🟠 · E8 palier 🔴).
- **Routage O7-NLP (6 profils)** : repris bit-exact (route_nlp → zone_force) ;
  les 2 NON-CLASSIFIABLEs gardent leur force SILENCIEUSE, conformes à D-Q2-E.

---

## 6. Vocabulaire écran — la doctrine confirmée appliquée (COR4)

Les **626 textes d'écran distincts** générés sur tout l'espace + les clauses
permanentes + les 6 libellés du cœur + les libellés de pas Q5 ont été scannés
contre les 16 mots interdits (canon Partie 9 + leçon PERS-Q1 A5) :
**0 occurrence**. Le bandeau D-SIM est présent sur **6 720 000/6 720 000**
blocs et 437/437 écrans archivés. Les mots cliniques restent confinés à la
documentation de validation (ici même), jamais à l'écran.

---

## 7. RE-SCORE de RIO-02 sur la grille de l'audit (Task 163)

| Critère | Avant | Après | Justification (preuves P1 de ce package) |
|---|---|---|---|
| F1 — déceler gradué | 25 | **25** | Inchangé : la lecture graduée est déjà validée par le package R1 (C1b calme bilatéral 85,0 %/0,00 % · C1c arêtes 8/8 · C3 convergence + 6/6 O7 · C5a 35/35 · C5b palier 437/437). Vérité conservée : C1a 81,0 % FAIL (< 82 %) et C2 1 FP (T3_LESDEUX-047) restent consignés — la correction ne les masque pas. |
| F2 — problème + gravité | 12 | **25** | « QUAND DEMANDER DE L'AIDE » validé sur tout l'espace : seuils S1/S2 dérivés des VRAIES sorties (voie H5 réelle de cette quête — D-CRISE applicable, contrairement à RIO-01), 0 borne pile, batterie de frontière 9/9 (COR3) ; zone d'ombre causale SANS étiquette + anti-fabrication sur 6 720 000 configurations (COR4/COR5) ; gate convergence avant sens (COR6). |
| F3 — solutions | 6 | **25** | Contenu des 3 paliers PRODUIT et affiché mécaniquement (7 exercices 🟢, 4 modules 🟠, 3 orientations 🔴 — 626 textes couvrant tout l'espace) ; orientation chaleureuse = phrase canon ; quête « pas » branchée sur le VRAI moteur Q5 (COR7, 18/18) ; suivi 14 jours (9/7 : Célébré/Ajustement/Reprise, sanction None 15/15, déjà P1 dans RIO-05) + re-test 8 semaines via les vrais seuils du cœur (alarme ±2 · gestes ±0,15 — D-Q2-F consigné). |
| F4 — bilan d'ensemble | 10 | **25** | Fragment L8 à 7 blocs (position · forme · empreinte · couple · force · limites · palier/pas) complet sur **6 720 000/6 720 000** (COR1) et **437/437** réponses archivées ; junctions sur les VRAIES tables (empreintes Q5, types Q4, 9 configurations, 6 pas) ; identité face Q5 ⇔ type Q4 prouvée 12/12 sur les bandes ; croisement à deux déjà validé P1 (RIO-04). |
| **TOTAL** | **53 %** | **100 %** | |

**Nouvelles moyennes (calcul exact)** :
- Dimension attachement : (100 + 100 + 53 + 61 + 67) / 5 = 381/5 = **76,2 %**
  (66,8 % après la correction RIO-01, 57,4 % à l'audit initial)
- Global 23 quêtes : (381 + 289 + 372 + 257 + 409) / 23 = 1 708/23 = **74,3 %**
  (72,2 % après RIO-01, 70,1 % à l'audit initial)

---

## 8. Limites — la vérité du système prime sur son succès apparent

1. **Tout reste en simulation (D-SIM).** RIO-02 atteint 100 % AU BARÈME P1
   « validé en simulation ». Le constat n°1 de l'audit (aucun être humain n'a
   encore répondu) reste vrai — VALID-01 attend les chantiers externes.
2. **Les FAIL hérités du package R1 sont conservés** : C1a 81,0 % < 82 %
   (résidu de domination LÉGER analysé en S-Q2-R1-8) et C2 — 1 FP p_filtre sur
   400 (T3_LESDEUX-047, S-Q2-R1-9) restent consignés ; la correction ne les
   re-note pas et ne les masque pas ; l'arbitrage d'affichage de l'état
   « ombre à mains actives, alarme calme » (S-Q2-R1-10) reste ouvert à
   l'orchestrateur.
3. **`longitudinal()` reste NON TESTÉ** (D-Q2-F) : les seuils de re-test
   cités à l'écran (alarme ±2 · gestes ±0,15) sont ceux du vrai cœur, mais la
   fonction est marquée NON TESTÉ dans le package R1 — consigné au bloc 7 du
   fragment comme dans ce rapport.
4. **Le récapitulatif de DIMENSION reste l'action n°2 de l'audit** — ce
   package produit et valide le FRAGMENT de RIO-02 (deuxième des 5 pièces) ;
   les fragments RIO-01 (fait) et RIO-02 (fait) attendent RIO-03/04/05 pour
   la fédération.
5. **Les libellés réels des questions** restent à déposer (action n°3) — la
   correction porte sur le calcul post-réponses.
6. **Frontière de l'espace énuméré** : l'énumération est exhaustive sur
   l'espace des ÉTATS MOTEUR DISTINCTS (la sortie du cœur est une fonction
   prouvée plate des quantités dérivées, batteries de frontière à l'appui) ;
   les scores sA/sB archivés (continus) sont couverts par leurs bandes — le
   re-score des 437 lignes réelles valide la chaîne sur valeurs continues.

---

## 9. Traçabilité

- Moteurs importés, non modifiés, intégrité vérifiée à l'import (assertions en
  tête de `wtc_q2_correction.py`).
- Aucun fichier existant touché : le package est entièrement nouveau
  (`validation-q2/correction-philosophique/`), y compris ce rapport et
  `correction_criteres.json`.
- Chiffres cités : tous issus de `correction_criteres.json` (SHA-256 des 2
  exécutions : `f195ee3d0b2961fac15ea74a672856ac0b2a946131953a35b08904026f1afccc`),
  aucun chiffre tapé à la main.
- Scripts reproductibles : `src/wtc_q2_correction.py` (couche) ·
  `src/wtc_q2_correction_validation.py` (pipeline — mode complet ou tronçonné
  `CORR_RUN/CORR_PART`, résultat bit-identique).

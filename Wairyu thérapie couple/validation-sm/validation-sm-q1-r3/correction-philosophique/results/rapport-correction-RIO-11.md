# Rapport de correction philosophique — RIO-11 « Ma détresse et la leur » (WTC-SM-Q1-R3)

> AVERTISSEMENT D-SIM : résultats issus de simulations (seed 42) — la mécanique est validée, pas la prévalence clinique.
> Ordre fondateur (trace 1a15ed7ad00bc0fd) : fichiers SUPPLÉMENTAIRES, zéro modification de l'existant, exactitude des calculs.

**Date** : 23/10/2026
**Package** : `validation-sm/validation-sm-q1-r3/correction-philosophique/`
**Cible** : RIO-11 « Ma détresse et la leur » (carte) — audit du 21/10 (Task 163) : F1 25 · F2 22 · F3 12 · F4 10 = **69 %**
**Moteurs réels importés** : `wtc_sm_q1_core.py` (R3, VALIDÉ 6/6 contresigné) · `wtc_sm_q3_core.py` (banque de forces) · `wtc_sm_q4_core.py` (croisement) · `wtc_sm_q5_core.py` (pas) — intégrité vérifiée par asserts à l'import, zéro réimplémentation, zéro retouche.

---

## 1. Les règles pré-enregistrées (R1-R9, écrites avant tout calcul)

| Règle | Contenu | Source réelle |
|---|---|---|
| **R1** | Palier = image exacte du VRAI `classifier_dominance` : CRISE → 🔴 · STABLE → 🟢 · CHARGE/MASQUE/MIXTE → 🟠. **0 seuil ajouté.** | cœur R3 (5 labels, seuils 2,5/3,5/4,0) |
| **R2** | En CRISE : court-circuit affiché MOT POUR MOT (cause + filet 3919/3114), aucune ombre détaillée — le vrai classifieur court-circuite AVANT de lire les faces D ; afficher l'ombre serait fabriquer. | `detecter_crise` (P-FILTRE validé P1) |
| **R3** | Ombre causale sans étiquette : niveaux de face posés sur les VRAIS seuils (Basse ≤ 2,5 · En veille < 3,5 · Active ≥ 3,5) ; sémantique des labels ancrée dépôt (cycle de Coyne SPEC SM-Q2 §3 · template PORTE SEULE du VRAI Q4 mot pour mot). | cœur R3 + SPEC SM-Q2 + TEMPLATES_CONFIG Q4 |
| **R4** | Le VRAI `est_dans_bande_exclue` ([3,10 ; 4,90], σ_eff 0,30 — 3σ) affiché honnêtement : dans bande → lecture de crise ni affirmée ni écartée, re-test proposé. La bande au-dessus du seuil (4,00-4,90) jamais affichée hors crise. | D-GÉOMÉTRIE R3 |
| **R5** | « Rien à fabriquer » = le VRAI template `zone_calme` de la quête pas (mot pour mot), réservé à STABLE ; filet ssi CRISE ; faces A/C2-C3 TRACÉES jamais affichées comme lecture. | TEMPLATES Q5 + canon §5.5 |
| **R6** | Vocabulaire écran : liste interdite (pathologie, diagnostic, dépression, anxiété, trouble… 21 mots). EXCEPTION SOURCÉE : filet 3919/3114 = literal du VRAI moteur, cité tel quel. | canon Partie 9 |
| **R7** | Bandeau D-SIM sur chaque bloc écran. | hub |
| **R8** | Pas annoncé = VRAI `palier_de`/`pas_de` de Q5 : niv_det MESURÉ ici (VRAI `niveau_de` de Q4 sur la moyenne réelle des 3 faces D), niv_chg BALAYÉ (RIO-12 le mesurera, jamais deviné). 🔴 → aucun pas (D-CRISE). | moteurs Q4/Q5 |
| **R9** | Re-test 8 semaines = arithmétique (+56 j ISO, 2026-01-01 → 2026-02-26), même sémantique que le vrai `programmer_re_test` émotionnel — arithmétique, pas une mesure (consigné). | émo-q5 (sémantique) |

## 2. La preuve (pipeline `wtc_sm_q1_correction_validation.py`)

### COR0 — Compactations prouvées exhaustivement

- **(a) items SM-C1 → sommes** : les **625** vérifications des 4⁴ = 256 quadruplets (1-5) via le VRAI `moyenne_face` → même somme ⇒ même moyenne (**0 écart**), **17/17** sommes distinctes atteintes ;
- **(b) espions** : les 5 faces SM-A1/A2/A3/SM-C2/SM-C3 varient sur 1-5 (**25 sondes**) — le VRAI `classifier_dominance` et `detecter_crise` ne les lisent **jamais** (0 écart) ;
- **(c) ancres** : les 5 libellés JAMAIS…TOUT LE TEMPS convertis par le VRAI `moyenne_face` (5/5) ;
- **(d) frontières entières** : les 125 triplets D vérifient le chemin entier (STABLE ⇔ item ≤ 2 · dominance ⇔ item ≥ 4 — **0 écart**) ; **0 borne PILE** sur grain entier (2,50/3,50 inatteignables, dist min 0,5 — cohérent avec la Section F du rapport SM-Q4 : « les bornes 2,50/3,50 sont structurellement inatteignables côté détresse »).

### COR1/COR2 — Énumération exhaustive + double chemin

**4 250 configurations** (5³ triplets D × 17 sommes SM-C1 × 2 états H5) — l'espace complet des états distincts de la couche :

- **COR1** : 4 250/4 250 fragments de bilan complets (7 blocs, 0 feuille vide), 0 bloc écran vide ;
- **COR2** : le double chemin ENTIERS PURS (`palier_independant` — crise ⇔ somme ≥ 16, dominance ⇔ item ≥ 4, STABLE ⇔ items ≤ 2) converge EXACTEMENT avec le VRAI moteur sur **4 250/4 250** ; junction label ↔ palier exacte : **STABLE ⇔ 🟢 · CHARGE/MASQUE/MIXTE ⇔ 🟠 · CRISE ⇔ 🔴**.

Distributions de l'énumération : labels {CRISE 2 750 · MIXTE 684 · MASQUE 360 · CHARGE 360 · STABLE 96} — paliers {🔴 2 750 · 🟠 1 404 · 🟢 96}.

### COR3 — Seuils d'aide (posés d'avance)

- **S1 = 2 750 configurations** (lecture CRISE → 🔴 + filet) · **S2 = 1 404** (CHARGE/MASQUE/MIXTE hors crise → 🟠 + re-test 8 semaines) ;
- frontière entière de crise : crise ⇔ (somme SM-C1 ≥ 16 ∨ H5) — **0 écart** sur 4 250 ;
- bornes consignées : **4,00 PILE atteignable** sur SM-C1 (somme 16 — seuil inclusif du cœur, 120 configurations exactement à la frontière) · 2,50/3,50 inatteignables PILE sur faces D (grain entier).

### COR4/COR5 — Vocabulaire + anti-fabrication

- **COR4** : **0 mot interdit** sur les **56 textes distincts** générés (4 250 blocs) et 3 625 fragments distincts ; bandeau D-SIM présent 4 250/4 250 ; la bande haute (4,00-4,90) jamais affichée hors crise (0 écart) ;
- **COR5** : le template zone_calme réel n'apparaît que sur STABLE (96/96, 0 abus) ; le court-circuit n'apparaît que sur CRISE (2 750/2 750, 0 fuite) ; l'ombre détaillée jamais affichée en crise (0 écart).

### COR6 — Re-score BIT-EXACT des 500 profils archivés (D-REPRO)

Les 500 profils R3 (G1-G6 70×6 · G7_h5 20 · SANS_DETRESSE 40 · SURCHARGE_AIDANT 20) sont **régénérés par le VRAI simulateur seed 42** et comparés à l'archive contresignée du 17/10 :

| Agrégat | Archive 17/10 | Re-score frais | Verdict |
|---|---|---|---|
| `stats_groupes` (8 groupes : n, classif_count, crises, dans_bande, h5) | — | **bit-exact 8/8** | ✅ |
| C3 sensibilité / spécificité | 100,0 % / 100,0 % | **100,0 % / 100,0 %** | ✅ |
| C3 VP · FN · VN · FP | 40 · 0 · 408 · 0 | **40 · 0 · 408 · 0** | ✅ |
| C3 hors bande · dans bande | 448 · 52 | **448 · 52** | ✅ |
| C3 voie H5 | VP 20 · FN 0 | **VP 20 · FN 0** | ✅ |

**1 448 comparaisons, 0 écart.** La couche est ensuite appliquée aux 500 profils : paliers **🟢 140 · 🟠 270 · 🔴 90** (S1 90 · S2 270), fragments complets 500/500, 0 mot interdit, dans bande 52, en crise 90.

### COR7 — Couplage pas (VRAI Q5)

- 6 paliers réels résolus via le VRAI `palier_de`/`pas_de` : 🔴 → **aucun pas** (le VRAI `pas_de` retourne None — D-CRISE) 3/3 · pas 🟢/🟠 = les VRAIS de la banque (3 🟠 + 1 🟢) 4/4 ;
- suivi 14 jours : les 15 totaux → CÉLÉBRÉ (6) / EN CHEMIN (9) — **0 sanction** (le vrai moteur n'a aucune fonction de sanction) ;
- re-test 8 semaines : 2026-01-01 → **2026-02-26** (56 j) ;
- junction palier Q1 ↔ Q5 : la règle max du VRAI `palier_de` vérifiée sur les 9 croix (niveaux détresse × charge) — **9/9, 0 écart**.

### COR8 — Reproductibilité

Pipeline exécuté **2 fois** : SHA-256 identiques `ecd0e23ccaeada34…` (payload canonique JSON des 4 stages).

## 3. Re-score au barème de l'audit (Task 163)

| Critère | Avant | Après | Justification |
|---|---|---|---|
| **F1 — Déceler de façon graduée** | 25 | **25** | inchangé — le package R3 validé (D-VÉRITÉ 100 %, D-CRISE sens/spé 100 %, D-GÉOMÉTRIE bande exclue) est préservé tel quel, rien à masquer |
| **F2 — Présenter le problème avec son niveau de gravité** | 22 | **25** | palier 🟢🟠🔴 dérivé mécaniquement du VRAI classifieur (0 seuil ajouté) + QUAND DEMANDER DE L'AIDE (S1/S2, frontière entière prouvée) + bande D-GÉOMÉTRIE affichée honnêtement + court-circuit avant tout (COR2/COR3/COR5) |
| **F3 — Proposer des solutions** | 12 | **25** | contenu des 3 paliers (exercices 🟢 par face dominante réelle, modules 🟠 = les vrais pas de la banque Q5, orientation 🔴 = le VRAI LITTERAL_ORIENTATION) + branchement quête « pas » sur le VRAI palier_de/pas_de + suivi 14 j sans sanction + re-test 8 semaines (COR7) |
| **F4 — Bilan de l'état de la personne** | 10 | **25** | fragment de bilan L8 à 7 blocs (position · forme · empreinte · couple · force · limites · palier/pas) avec les junctions réelles Q3/Q4/Q5, complet sur 4 250/4 250 + 500/500 profils archivés (COR1/COR6) |
| **Total** | **69 %** | **100 %** | AU BARÈME P1 SIMULATION |

## 4. Limites honnêtes (lues avant toute décision)

1. **Simulation seule** — bandeau D-SIM sur chaque écran ; la prévalence clinique reste l'objet de VALID-01 (le court-circuit D-CRISE, lui, est validé mécaniquement à 100 % en simulation : sens/spé 100 %, frontière entière).
2. **Libellés des items absents** (action n°3 de l'audit) — la couche ne lit que les sorties réelles du moteur ; aucun texte d'item n'est inventé.
3. **Faces non classifiantes** — les faces A (aidant) et C2/C3 (contrat de soin) sont mesurées par l'instrument mais le VRAI cœur ne les classifie pas en Q1 : la couche les trace et ne les affiche jamais comme lecture (elles reviennent en RIO-12).
4. **Bande d'incertitude** — 52/500 profils archivés tombent dans la bande [3,10 ; 4,90] : l'écran le dit, propose le re-test, ne tranche pas (le C3 du package R3 exclut la bande du décompte — même honnêteté).
5. **Le récapitulatif de DIMENSION** (fédération des 5 fragments RIO-11→15) reste l'action n°2 de l'audit — non traité ici.

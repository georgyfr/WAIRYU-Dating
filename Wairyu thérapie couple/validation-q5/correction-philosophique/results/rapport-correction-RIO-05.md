# RAPPORT DE CORRECTION PHILOSOPHIQUE — RIO-05 « Mon premier pas »

> Exécution Task 177 (23/10/2026) — même ordre fondateur (trace 1a15ed7ad00bc0fd) : fichiers SUPPLÉMENTAIRES, zéro modification de l'existant, exactitude des calculs. Package : `validation-q5/correction-philosophique/`. Moteurs réels importés, jamais recopiés : `validation-q5/src/wtc_q5_core.py` (pas + suivi + rappels + re-test), `validation-q1-r1/src/wtc_q1_core.py` (VRAIS seuils des niveaux), `validation-q4/src/wtc_q4_core.py` (type_attachement).

## 1. Pourquoi 95 % et pas 100 % (l'honnêteté d'abord)

Le barème de l'audit (Task 163) plafonne **F1 à 20 pour toutes les quêtes « pas »** : la lecture graduée appartient aux quêtes amont dont le pas hérite — c'est le traitement de RIO-05, RIO-10, RIO-15, RIO-18 et RIO-23 dans le document d'audit, et les packages de génération 3 les plus complets (RIO-18 = 92 %, RIO-23 = 90 %) ne dépassent pas ce plafond pour la même raison. RIO-05 atteint donc **20 + 25 + 25 + 25 = 95 %** — le maximum atteignable au barème. Prétendre 100 % serait une fabrication.

## 2. Ce qui manquait (audit Task 163) et ce qui est ajouté

| Critère | Audit | Après correction | Ce qui a été ajouté |
|---|---|---|---|
| F1 — déceler de façon graduée | 20 | **20** (plafond structurel) | Rien — la lecture graduée est validée P1 côté carte (RIO-01) et le pas l'hérite ; le barème plafonne la quête pas. |
| F2 — gravité affichée | 12 | **25** | Le palier 🟢🟠🔴 LECTURE HÉRITÉE DE LA CARTE (VRAI `niveau_ponctuel`, seuils 1,80/2,60/3,20 — règle R1 de RIO-01 appliquée aux scores que le pas reçoit) + « QUAND DEMANDER DE L'AIDE » (S1 = un axe Forte · S2 = un axe Vive sans Forte — re-test 8 semaines) + PLANCHER PARTIEL consigné + doctrine du pas affichée. |
| F3 — solutions | 20 | **25** | Le contenu existant PRÉSERVÉ (pas réel + suivi 14 j réel + rappels doux réels + re-test réel — déjà validés P1) complété par le contenu du palier (l'aide affichée selon la lecture héritée, sans jamais prescrire). |
| F4 — bilan | 15 | **25** | Fragment de bilan L8 à 7 blocs avec junctions réelles (carte RIO-01, ombre RIO-02, croisement RIO-04). |

## 3. Les règles pré-enregistrées (R1-R9, écrites avant tout calcul)

- **R1 (palier)** : rang(niveau) Discrète=0, Tranquille=1, Vive=2, Forte=3 via le VRAI `niveau_ponctuel` du cœur q1-r1 (seuils 1,80/2,60/3,20, PILE inclusifs côté haut) ; rang_quête = max(rang_A, rang_B) ; 🟢 si ≤ 1 · 🟠 si 2 · 🔴 si 3 — LA MÊME règle que la correction RIO-01 (cohérence : le pas reçoit les mêmes scores que la carte).
- **R2 (S1)** : un axe lu Forte → 🔴 + orientation chaleureuse (phrase canon). D-CRISE non applicable (consigné).
- **R3 (S2)** : un axe lu Vive sans aucune Forte → « à surveiller », re-test 8 semaines (vrai `programmer_re_test_q1`, jamais forcé). Lecture PONCTUELLE consignée : le pas reçoit des scores, pas d'intervalle — la frontière RQS de la carte reste l'instrument de la carte.
- **R4 (qualité avant sens)** : compteur PRIVÉ ; les 3 catégories du VRAI suivi (CELEBRE ≥ 9 · AJUSTEMENT 7-8 · REPRISE ≤ 6) sont des statuts-information — JAMAIS de sanction (None, structurel) ; aucun gate RQS sur cet instrument.
- **R5 (anti-fabrication)** : le pas affiché est EXACTEMENT celui du VRAI `selectionner_pas` (table 9, trace de source réelle) ; le label d'ombre reçu est affiché mot pour mot, sa normalisation tracée honnêtement (LES DEUX / ALARME SANS MAIN / SIGNAL LÉGER NON NOMMÉ / vide → ZONE_CALME : comportement RÉEL du moteur, consigné — jamais masqué) ; JAMAIS de pas fabriqué.
- **R6 (anti-perfectionnisme)** : les 3 templates réels de suivi cités mot pour mot — « les jours manqués ne sont pas une faute » ; rappels doux J1/J7/J14 du vrai moteur.
- **R7 (vocabulaire écran)** : 0 mot de la liste interdite (canon Partie 9).
- **R8 (D-SIM)** : bandeau sur chaque bloc écran.
- **R9 (couplage réel)** : héritages mesurés par les quêtes amont (RIO-01 sA/sB, RIO-02 label) et balayés sur leurs valeurs réelles ; junction aval = le VRAI `type_attachement` (RIO-04 lit les DEUX types → configuration nommée).

**Particularité consignée (différence avec RIO-03)** : RIO-03 recevait la somme des mains (h_norm/r_norm) et posait son plancher sur le VRAI palier Q2 (monotonicité prouvée sur 211 200 états). RIO-05 ne reçoit que (sA, sB, label_ombre, jours_tenus, date_pas) — la lecture héritée est donc celle de la CARTE, jamais une réinterprétation du palier d'ombre. C'est une lecture PARTIELLE : la quête ombre (RIO-02) mesure l'alarme et les mains, absentes d'ici.

## 4. La preuve (9 critères COR0-COR8, tous PASS)

### COR0 — Compactations prouvées exhaustivement
Niveaux : plateau 401 centièmes × 2 axes (0 écart) + PILE 1,80→Tranquille, 2,60→Vive, 3,20→Forte (inclusifs côté haut, consignés) + batterie de frontière (saut exact à t, 3/3). Empreinte : 28 variantes (casse/accents/underscores/vide/None/inconnu) → 3 classes du VRAI moteur, 0 écart ; 13 défauts consignés (LES DEUX / ALARME SANS MAIN / SIGNAL LÉGER NON NOMMÉ / vide → ZONE_CALME). Espion machine : `inspect.signature(selectionner_pas)` = (sA, sB, label_ombre) — jours_tenus et date_pas JAMAIS lus par la sélection ; déterminisme 5/5. Suivi : 15 valeurs → 3 catégories, frontières 6/7-8/9 exactes, 0 sanction, taux vérifié. Re-test : +56 jours exacts sur 3 dates. Face : PILE 2,61 inclusif (les deux axes), priorité sB, intervalle [2,60 ; 2,61) réel — **frontières DISTINCTES 2,60 (niveaux carte) vs 2,61 (face pas), toutes deux réelles, aucune retouchée**. Junction type_attachement : 4 représentants → SEREIN / PREOCCUPE / DETACHE / EN_ALERTFEU, déterministe. Les 3 vérificateurs VRAI du moteur (templates, anti-perfectionnisme, rappels doux) ok.

### COR1 — Fragment de bilan complet
**194 145/194 145** configurations → fragment L8 7 blocs, 0 champ vide (l'absence de label est un statut tracé, pas un vide) — **194 145 états distincts** (les scores bruts figurent dans le fragment) + **180/180** profils archivés complets.

### COR2 — Double chemin du palier lecture héritée
Chemin indépendant (comptage sur les VRAIS seuils importés) ≡ VRAI if-chaîne `niveau_ponctuel` : **194 145/194 145**, 0 écart (palier + S1/S2 + axes exactement). Junctions S1 ⇔ 🔴 / S2 ⇔ 🟠 exactement. PLANCHER PARTIEL consigné.

### COR3 — Seuils d'aide (S1 72 765 · S2 50 400)
S1 = un axe Forte (rang 3, ≥ 3,20) : 72 765 configs · S2 = un axe Vive sans Forte (rang 2, ≥ 2,60) : 50 400 configs · 🟢 : 70 980. **0 seuil numérique ajouté** — seuils affichés = SEUILS_NIVEAUX (importés) + 2,61 (face du VRAI moteur) + 9/7 (suivi) + 8 semaines (re-test), tous préexistants. PILE moteurs vérifiés et consignés.

### COR4 — Vocabulaire écran
**0 mot interdit** sur **252 textes distincts** (194 145 configs balayées — les textes se compactent par (pas, palier, axes S1/S2, label, suivi)) + standing 0 sur tous les textes constants (moteur + couche). D-SIM 100 % (énumération + 180 archivés).

### COR5 — Anti-fabrication
Pas affiché ≡ VRAI `selectionner_pas` (trace de source réelle) ; 6 templates réels cités par écran (pas + suivi + 3 rappels + re-test) ; label reçu mot pour mot, normalisation tracée honnêtement ; JAMAIS de sanction (énumération 0 + archivés 0) ; bijections labels/templates 6/6 ; pas ⊆ banque fermée.

### COR6 — Re-score bit-exact des 180 profils archivés (VRAI simulateur, seed 42, re-exécuté frais ×2 — D-REPRO)
1 093 comparaisons, **0 écart** vs l'archive `resultats-q5-2026-10-15.json` (sha256_run 015f7e9d…) : resume_groupes 60/60/60 · pas_distribution 21/42/39/21/39/18 · face_distribution 60/60/60 · categorie_par_groupe exact · plafonds par configuration **9 × 100 %** · **C1 180/180** pas ≡ pas_vrai (D-VÉRITÉ, éliminatoire) · **C3** désaccords 0 · **C2** cas-types messages BIT-EXACT vs archive 9/9 (catégorie + template moteur + chaîne archivée, 3 cas) + anti-perfectionnisme ok · **C5** 180/180 + rappels ok · **C6** re-test +56 j 180/180, jamais forcé. Couche appliquée aux 180 : paliers 🟢 54 · 🟠 60 · 🔴 66 — S1 66 · S2 60.

### COR7 — Couplage pas (espace complet des héritages)
Les **6 pas réels** résolus par le VRAI moteur sur les 43 × 43 × 7 héritages : P1 3 920 · P2 2 884 · P3 4 009 · P4 420 · P5 1 065 · P6 645. Suivi 15/15 sans sanction, frontières exactes ; re-test 8 semaines jamais forcé ; rappels doux J1/J7/J14 réels ; table 9 ⊆ banque ; junction type_attachement 4/4.

### COR8 — Reproductibilité
Pipeline ×2, SHA-256 identiques : `4e96032062cc27c5…`.

## 5. Limites honnêtes (lues avant toute décision)

Tout est validé en simulation (D-SIM) — VALID-01 reste vrai. Le PLANCHER est PARTIEL (alarme et mains absentes des héritages du pas — la lecture affichée est celle de la carte ; la quête ombre peut préciser la gravité à partir de ses propres variables). La normalisation des labels (→ ZONE_CALME par défaut) est le comportement réel du moteur — tracé, jamais masqué. Les frontières 2,60 / 2,61 sont distinctes et toutes deux réelles. F1 = 20 est un plafond STRUCTUREL du barème pour les quêtes « pas ». Les 180 profils restent des profils simulés (seed 42) — la mécanique est validée, pas la prévalence clinique. Le récapitulatif de DIMENSION reste l'action n°2 ; les libellés réels des questions restent l'action n°3.

## 6. Re-score final

**RIO-05 = 67 % → 95 %** AU BARÈME P1 SIMULATION (F1 20 plafond structurel · F2 12→25 · F3 20→25 · F4 15→25).

Moyennes exactes : dimension attachement (100+100+100+100+95)/5 = **495/5 = 99 %** · global 23 quêtes (2 000+95)/23 = **2 028/23 = 88,2 %**. Les scores des 22 autres quêtes restent inchangés. Action n°1 : attachement RIO-01 100 · RIO-02 100 · RIO-03 100 · RIO-04 100 · **RIO-05 95** — dimension CLOSE ; émotionnelle close (RIO-06→10) ; restent santé mentale (RIO-11→15), générationnelle (RIO-16→18), personnalité (RIO-19→23), puis actions n°2 (bilans de DIMENSION) et n°3 (libellés réels).

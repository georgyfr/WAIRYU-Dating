# Rapport de correction philosophique — RIO-16 « L'écart de nos horloges » (WTC-EXT-Q1)

> AVERTISSEMENT D-SIM : résultats issus de simulations (seed 42 ×2) — la mécanique est validée, pas la prévalence clinique.
> Ordre fondateur : fichiers SUPPLÉMENTAIRES, zéro modification de l'existant, exactitude des calculs (même ordre que RIO-01→15).

**Date** : 23/10/2026
**Package** : `validation-ext/validation-ext-q1/correction-philosophique/`
**Cible** : RIO-16 « L'écart de nos horloges » (carte) — audit du 21/10 (Task 163) : F1 25 · F2 25 · F3 15 · F4 10 = **75 %**
**Moteurs réels importés** : `wtc_ext_q1_core.py` (VALIDÉ 7/7, CONTRESIGNÉ) · `wtc_ext_q2_core.py` (le croisement — RIO-17) · `wtc_ext_q3_core.py` (le pas — RIO-18) — intégrité vérifiée par asserts à l'import, zéro réimplémentation, zéro retouche.

---

## 1. Les règles pré-enregistrées (R1-R9, écrites avant tout calcul)

| Règle | Contenu | Source réelle |
|---|---|---|
| **R1** | Palier = image exacte du VRAI `classifier_rive` : max des niveaux conservateurs des 3 axes H/L/C — **assert de junction à CHAQUE appel** (recalcul interdit). **0 seuil ajouté** : les VRAIS seuils L3 (1,80 / 2,60 / 3,20) restent les seules frontières. | cœur ext-q1 (`palier_de`, SPEC §3 max-niveau) |
| **R2** | En filet : court-circuit AVANT l'arbre affiché MOT POUR MOT (bandeau D-CRISE + literal 3919/3114 — P-FILTRE), carte=None → afficher la carte serait fabriquer. JAMAIS de pas de couple sur un signal sécurité. | `signal_filet_de` (P-FILTRE validé P1) |
| **R3** | Lecture graduée sans étiquette : VRAIS `lecture_L3` (NIVEAU ou FRONTIÈRE « entre X et Y » + conservateur) · VRAIS `lecture_L4` (HIÉRARCHIE DÉCLARABLE ou NUAGE) · noms écran = `FACES[f]["nom"]` lus au chargement. Descriptif causal — aucun nom de pathologie. | cœur ext-q1 + canon ligne 260 |
| **R4** | Frontière honnête + bornes mesurées (COR0) : seuils PILE inatteignables sur le grain 1/6 des axes (dist min 1/30 pour 1,80 et 3,20 · 1/15 pour 2,60) ; 34 bornes CI90 — 0 PILE sur un seuil ; seuil hiérarchie 0,8837 inatteignable sur le grain 1/3 des faces (dist min 0,1163). Tranchage inclusif du VRAI moteur intact. | grain mesuré, stage 0e |
| **R5** | Anti-fabrication temporelle (C6, arbitrage A5) : 0 verdict sur le temps restant, 0 modèle de la bonne saison, jamais « trop tard », jamais de compte à rebours — la sélectivité socio-émotionnelle (Carstensen) lit une priorisation DÉCLARÉE, pas une ressource à optimiser. « Zone calme — rien à fabriquer ici » ssi palier 🟢. EXT-VIG tracé, jamais affiché comme lecture. | canon §5.5 + C6 Générationnelle |
| **R6** | Vocabulaire écran : liste interdite (canon Partie 9 : 21 mots cliniques + injonctions temporelles C6). EXCEPTION SOURCÉE : filet 3919/3114 = literal du VRAI moteur, cité tel quel. | canon Partie 9, lignes 355-356 |
| **R7** | Bandeau D-SIM sur chaque bloc écran. | hub |
| **R8** | Couplage pas réel : croisement Q2 = niveau_croisement du score H MESURÉ ici + l'autre rive BALAYÉE (jamais devinée) → VRAIS `config_de`/`palier_croise` ; pas Q3 = VRAI `famille_de` + `BANQUE_PAS_EXT` servis verbatim ; pas zéro légitime ssi config 1 (LA MÊME HEURE) ; suivi 14 j sans sanction ; 🔴 → le pas EST la démarche d'orientation (VRAI pas rouge). | moteurs ext-q2/ext-q3 |
| **R9** | Re-test 8 semaines = arithmétique de dates (+56 j ISO — 2026-01-01 → 2026-02-26), même sémantique que le vrai `programmer_re_test` émotionnel — arithmétique, pas une mesure (consigné). Les re-tests ne sont PAS consommés en Q1 (une mesure un rôle — SPEC Q2 §7). | émo-q5 (sémantique) |

## 2. La preuve (pipeline `wtc_ext_q1_correction_validation.py`)

### COR0 — Compactations prouvées exhaustivement + mesures

- **(a) somme de face → score** : les **64** triplets (1-4) via le VRAI `score_face_de` → même somme ⇒ même score (**0 écart**), **10/10** valeurs distinctes (1,00 → 4,00) ;
- **(b) somme d'axe → score** : les **12 288** vérifications des 4⁶ = 4 096 sextuplets par axe via le VRAI `score_axe_de` (**0 écart**), **19/19** valeurs distinctes par axe (grain 1/6) ;
- **(c) inverses** : EXT-H2-3 et EXT-C2-3 retournés par le VRAI `corrige` (10/10) ;
- **(d) espions** : EXT-VIG varie 1→5 — les niveaux/faces/palier d'une carte restée affichée ne changent **jamais** (il ne touche que le RQS) ; `signal_herite` n'ouvre QUE la voie filet (**7 sondes, 0 écart**) ;
- **(e) bornes mesurées** : distances seuils ↔ grain — **1,80 : 0,0333 · 2,60 : 0,0667 · 3,20 : 0,0333** ; **34 bornes CI90, 0 PILE sur un seuil** ; **15 écarts de faces distincts, distance minimale 0,1163 au seuil 0,8837** (consignation R4 corrigée : la version d'ébauche disait 0,1063 — la mesure COR0 prime) ;
- **(f) table RQS** : les **11 combinaisons de pénalités réalisables** (aucune · vigilance · rythme · linéarité · leurs composées) vérifiées contre le VRAI `calcule_rqs` (arithmétique 100 − Σ pénalités + seuils 85/70 — **0 écart**) ; **linéarité + contradiction prouvées IMPOSSIBLES** (énumération exhaustive : 64 triplets en contradiction × 48 répartitions minimales des 15 autres items — la variance minimale reste ≥ 0,45 de SD : la contradiction impose un écart ≥ 2,5 sur la face, donc SD > 0,45).

### COR1/COR2 — Énumération exhaustive + double chemin

**6 859 configurations** (19³ triplets de sommes d'axes H/L/C — l'espace complet des états distincts de niveaux au grain 1/6) + **300 paires de faces** (10² × 3 axes) + hors-carte :

- **COR1** : 6 859/6 859 fragments de bilan complets (7 blocs, 0 feuille vide) sur carte + filet + RQS INVALIDE — 0 bloc vide ;
- **COR2 niveaux** : le double chemin TABLE PURE (19 sommes → conservateur/type, puis max) converge EXACTEMENT avec le VRAI `classifier_rive` sur **6 859/6 859** (conservateurs, types NIVEAU/FRONTIÈRE et palier) ;
- **COR2 faces** : déclaré ⇔ |s1 − s2| ≥ 3 (entiers purs) ≡ VRAI `lecture_L4` sur **300/300** ; écart calculé sur scores de faces ARRONDIS (artefact 0,66/0,67 reproduit bit-exact) ; dominante = face au score le plus élevé, égalité → f1 (**0 écart**) ;
- **invariant VERT prouvé** : palier 🟢 ⇔ aucun axe actif (dominant None) — vérifié sur chaque configuration (0 violation) ; le contenu 🟢 est donc TOUJOURS la zone calme.

Distributions de l'énumération : paliers {🟢 EXERCICE MAISON 2 197 · 🟠 MODULE DE COUPLE 1 899 · 🔴 ORIENTATION 2 763} — lectures (3 axes × 6 859) {FRONTIÈRE 14 079 · NIVEAU 6 498} — RQS {OK 6 730 · PRUDENCE 129 · INVALIDE 0}.

### COR3 — Seuils d'aide (posés d'avance)

- **S1 = 12 configurations filet** (court-circuit P-FILTRE, carte non affichée) · **S2 = 4 662** (au moins un axe conservateur ≥ VIVE — tout palier non-VERT : le palier 🔴, axe FORTE, est AUSSI un moment « demander de l'aide », il porte en plus l'orientation) — 0 écart ;
- bornes consignées (R4) : 1,80/3,20 dist min 1/30 · 2,60 dist min 1/15 · 0,8837 dist min 0,1163 · 0 borne CI90 PILE sur un seuil.

### COR4/COR5 — Vocabulaire + anti-fabrication

- **COR4** : **0 mot interdit** (liste complète : 21 mots cliniques + injonctions temporelles C6) sur les **232 textes distincts** (blocs écran) et **6 859 fragments distincts**, y compris les pas servis VERBATIM de la banque Q3 ; bandeau D-SIM présent partout ; exception sourcée consignée (filet 3919/3114, literal du VRAI moteur) ;
- **COR5** : le marqueur exact « Zone calme — rien à fabriquer ici » n'apparaît que sur 🟢 (2 197/2 197, 0 abus — la clause permanente QUAND DEMANDER, qui cite les seuils, ne déclenche pas le check) ; le court-circuit n'apparaît que sur filet (12/12, 0 fuite) ; 0 verdict temporel.

### COR6 — Re-score BIT-EXACT des 520 couples / 1 040 rives archivés (D-REPRO)

Les 520 couples (12 groupes, seed 42 ×2) sont **régénérés par le VRAI simulateur** et comparés à l'archive contresignée du 18/10 :

| Agrégat | Archive 18/10 | Re-score frais | Verdict |
|---|---|---|---|
| `stats_groupes` (12 groupes : n, conformes, paliers, statuts_rqs, lectures, faces, filets, rci) | — | **bit-exact 12/12** | ✅ |
| `paliers_globaux` | 🟢 797 · 🟠 101 · 🔴 42 · NON_AFFICHÉE 100 | **identique** | ✅ |
| verdicts RCI | FIABLE 25 · SUGGESTION 18 · BRUIT 37 · N/A 960 | **identique** | ✅ |
| traversées de seuil | 56 | **56** | ✅ |
| conformité D-STD-2 par groupe (via VRAI `conformite_couple`) | 12/12 OK | **12/12** | ✅ |
| G09 pièges RQS | PRUDENCE 60 · INVALIDE 20 | **identique** | ✅ |
| G11 items Forte (idx 35-39) | court-circuit 5/5 | **5/5** | ✅ |

**1 560 comparaisons, 0 écart.** La couche est ensuite appliquée aux 1 040 rives : paliers identiques au cœur 1 040/1 040, fragments complets, 0 mot interdit, filet ⇒ court-circuit 80/80, INVALIDE ⇒ aucun résultat 20/20.

### COR7 — Couplage pas réel (VRAIS Q2/Q3)

- **19 scores H** (grain 1/6) → VRAI `niveau_croisement` (double chemin pur : FAIBLE < 2,50 ≤ MODÉRÉE < 3,50 ≤ FORTE — bornes 2,50/3,50 testées PILE : MODÉRÉE et FORTE — **0 écart**) ;
- **57 configurations résolues** (19 × 3 balayages de l'autre rive) via VRAIS `config_de`/`palier_croise` (junction recalculée : **0 écart**) — les 3 paliers croisés couverts ;
- **banques de pas verbatim** : longueurs réelles 3/2/1 (🟢/🟠/🔴) vérifiées 57/57 ; les pas servis par la couche = les VRAIS de `BANQUE_PAS_EXT` (**0 écart, jamais réécrits**) ;
- **pas zéro** : légitime SSI config 1 (LA MÊME HEURE — zone calme) — les 9 scores H FAIBLE y mènent, aucun autre (**0 écart**) ;
- suivi 14 jours : les **15 totaux** → CÉLÉBRÉ (6, ≥ 9/14) / EN CHEMIN (9) — **0 sanction** ; re-test 8 semaines : 2026-01-01 → **2026-02-26** (56 j).

### COR8 — Reproductibilité

Pipeline exécuté **2 fois** : SHA-256 identiques `40fb737db80d60ed…` (payload canonique JSON des 5 stages).

## 3. Re-score au barème de l'audit (Task 163)

| Critère | Avant | Après | Justification |
|---|---|---|---|
| **F1 — Déceler de façon graduée** | 25 | **25** | inchangé — la lecture graduée du package validé (D-STD-2 calibrée, D-VÉRITÉ, espions, C1-C7) est préservée telle quelle, rien à masquer |
| **F2 — Présenter le problème avec son niveau de gravité** | 25 | **25** | inchangé — palier max-niveau + QUAND DEMANDER déjà validés C5 ; S2 élargie à tout palier non-VERT (un axe FORTE est AUSSI un moment « demander de l'aide ») — exactitude sémantique, pas un changement de mesure |
| **F3 — Proposer des solutions** | 15 | **25** | contenu CONCRET des 3 paliers produit (l'écart F3 de l'audit : « désignées par palier mais pas produites ») : 🟢 exercice zone calme §5.5 (invariant VERT ⇔ zone calme PROUVÉ, pas supposé) · 🟠 module à deux s'appuyant sur les VRAIS pas de la banque Q3 + clause contextuelle de l'axe dominant (H/L/C) · 🔴 orientation = le VRAI pas rouge + le filet — + junction pas réelle (COR7) + re-test 8 semaines |
| **F4 — Bilan de l'état de la personne** | 10 | **25** | fragment de bilan L8 à 7 blocs (position · forme · empreinte · couple · force · limites · palier/pas + flux Q2-Q5) avec les junctions réelles Q2 (9 configurations, 3 inférences L5 aux libellés VERROUILLÉS lus dans le VRAI moteur) et Q3 (familles + banque + suivi), COMPLET y compris hors-carte (filet 12/12 · RQS INVALIDE : 0 feuille vide — COR1/COR6) |
| **Total** | **75 %** | **100 %** | AU BARÈME P1 SIMULATION |

## 4. Limites honnêtes (lues avant toute décision)

1. **Simulation seule** — bandeau D-SIM sur chaque écran ; la prévalence clinique reste l'objet de VALID-01.
2. **Libellés des items absents** (action n°3 de l'audit) — la couche ne lit que les sorties réelles du moteur ; aucun texte d'item n'est inventé.
3. **L'autre rive est balayée, jamais devinée** — les configurations/paliers croisés affichés ici sont les ATTEIGNABLES depuis cette rive ; la configuration RÉELLE du couple sera mesurée par RIO-17 (une mesure un rôle).
4. **Le récapitulatif de DIMENSION** (fédération des fragments) reste l'action n°2 de l'audit — RIO-18 l'embarque déjà partiellement (A6) ; non traité ici.
5. **Re-tests non consommés en Q1** — le RCI est calculé par le VRAI cœur quand un re-test existe (G12) mais la couche Q1 ne l'affiche pas : il appartient au croisement (SPEC Q2 §7).

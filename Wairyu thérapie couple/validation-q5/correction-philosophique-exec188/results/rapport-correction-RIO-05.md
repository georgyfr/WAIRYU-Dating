# RAPPORT DE CORRECTION PHILOSOPHIQUE — RIO-05 « Mon premier pas »

**Package** : `validation-q5/correction-philosophique/` — fichiers SUPPLÉMENTAIRES, zéro modification de l'existant.
**Ordre fondateur** : signal « lancer RIO-05 » (même ordre que RIO-01→04 et RIO-06→18) — exécution Task 188.
**Moteur de la quête** : `validation-q5/src/wtc_q5_core.py` (face dominante Q1 × empreinte Q2 → 6 pas, suivi 14 jours sans sanction — CELEBRE ≥ 9 · AJUSTEMENT 7-8 · REPRISE ≤ 6, rappels doux J1/J7/J14, re-test 8 semaines jamais forcé).
**Statut final** : **RIO-05 = 67 % → 95 %** (F1 20 · F2 25 · F3 25 · F4 25) — **le maximum atteignable au barème de l'audit**.

---

## 1. Pourquoi 95 % et pas 100 % (l'honnêteté d'abord)

Le barème de l'audit (Task 163) plafonne **F1 « Déceler de façon graduée » à 20/25 pour toutes les quêtes « pas »** : la lecture graduée du construit appartient aux quêtes amont (carte/ombre/lumière) dont le pas hérite — le pas lui-même est une ACTION, pas un instrument de détection gradué. Le document d'audit le montre sur toutes les dimensions : RIO-05 (attachement) F1 20 · RIO-10 (émotionnelle) F1 20 · RIO-15 (santé mentale) F1 20 · RIO-18 (générationnelle) F1 20 · RIO-23 (personnalité) F1 20. **Aucun pas-quest du projet n'a F1 = 25** — prétendre 100 % pour RIO-05 serait une fabrication, exactement ce que la philosophie du projet interdit. RIO-05 atteint donc 20 + 25 + 25 + 25 = **95 %** — le maximum atteignable au barème, tous critères F2/F3/F4 complets.

## 2. Ce qui manquait (audit Task 163) et ce qui est ajouté

L'audit a noté RIO-05 **67 %** : F1 20 · F2 12/25 · F3 20/25 · F4 15/25. Le F3 part haut parce que le pas + le suivi 14 jours + les messages anti-perfectionnisme sont déjà validés P1 par le package — **ils sont PRÉSERVÉS tels quels**. La couche comble le reste :

| Critère | Manque constaté | Ajouté par la couche |
|---|---|---|
| **F2** (12→25) | pas de palier, pas de « QUAND DEMANDER DE L'AIDE » | palier 🟢🟠🔴 PLANCHER HÉRITÉ (le VRAI seuil 2,61 du cœur, lu sur les DEUX axes sA/sB que ce moteur reçoit) + S1/S2 + la doctrine du pas affichée |
| **F3** (20→25) | l'aide n'est pas articulée au palier | l'aide selon le palier (sans jamais prescrire) — le pas/suivi/rappels/re-test réels PRÉSERVÉS |
| **F4** (15→25) | pas de fragment de bilan L8 | fragment 7 blocs avec les héritages mesurés et les junctions réelles (dont le VRAI croisement RIO-04) |

## 3. Les règles pré-enregistrées (R1-R9, écrites avant tout calcul)

- **R1 (palier plancher individuel)** : dérivé MÉCANIQUEMENT des sorties du VRAI cœur — ZÉRO seuil numérique ajouté : mapping catégoriel pur sur le VRAI seuil 2,61 (le littéral de `face_dominante` / `type_attachement`, épinglé à l'import par asserts sur le comportement réel des deux cœurs) lu sur les DEUX axes reçus (sA, sB) : 🔴 ssi sA ≥ 2,61 **ET** sB ≥ 2,61 (les deux axes hauts — le « en alerte » de la correction RIO-04, cohérence consignée) · 🟠 ssi EXACTEMENT UN des deux axes ≥ 2,61 · 🟢 ssi aucun. **NOTE D'EXACTITUDE consignée** : la face seule (`face_dominante`) NE SUFFIT PAS — SUR_LA_RA couvre à la fois l'espace 🔴 (sA ≥ 2,61 aussi) et l'espace 🟠 (sA < 2,61, garde seule) ; la lecture palier est sur les axes bruts (prouvé : même face, paliers différents). **PLANCHER consigné** : le palier lit les axes Q1 reçus — la vraie gravité peut être plus haute (le filet de l'app reste porté par RIO-02), jamais plus basse.
- **R2 (S1)** : les deux axes ≥ 2,61 → orientation chaleureuse proposée (« le chemin le plus court est de ne pas le porter seul·e — l'orientation vers un professionnel de la relation n'est pas un échec, c'est le pas qui compte ici ») — le pas reste CHOISI, jamais prescrit.
- **R3 (S2)** : exactement un axe ≥ 2,61 → à surveiller + re-test Q1 à 8 semaines (le VRAI `programmer_re_test_q1`, jamais forcé) — tout palier non-VERT est AUSSI un moment « demander de l'aide » (leçon RIO-16).
- **R4 (qualité avant sens)** : le suivi est un COMPTEUR PRIVÉ (jamais exposé socialement — le vrai `bilan_du_pas`) ; les 3 catégories du VRAI `suivre_14_jours` sont des statuts-information — JAMAIS de sanction (sanction = None, structurel) ; aucun gate RQS sur cet instrument — aucune suspension inventée.
- **R5 (anti-fabrication)** : le pas affiché est EXACTEMENT celui du VRAI `selectionner_pas` (trace Q1_face/Q2_empreinte réelle) ; le fallback P1 est prouvé INATTEIGNABLE via le flux normal (`empreinte()` normalise tout label — connu, inconnu ou None — vers les 3 empreintes, et la face est toujours l'une des 3 : les 9 paires sont toutes dans `_PAS_TABLE`) ; atteignable HORS flux uniquement (appel direct de table — consigné) ; JAMAIS de pas fabriqué.
- **R6 (anti-perfectionnisme)** : les 3 templates réels de suivi cités mot pour mot — « les jours manqués ne sont pas une faute » ; rappels doux J1/J7/J14 réels ; leçon D-Q5-1 respectée par le marqueur (« pas une obligation » est ANTI-culpabilisant, jamais compté comme interdit).
- **R7 (vocabulaire écran)** : 0 mot interdit (canon Partie 9 + liste anti-blâme de la correction RIO-04 étendue) ; les noms de code internes (RASSUREE/EN_QUETE/SUR_LA_RA) ne sont pas des textes écran — libellés français (« Rassurée », « En quête », « Sur la réserve ») sans mot interdit ; D-CRISE non applicable (consigné — aucun construit d'auto-danger mesuré par ce cœur ; le filet de l'app reste porté par RIO-02) — remplacé par S1/S2.
- **R8 (D-SIM)** : bandeau simulation sur chaque bloc écran.
- **R9 (couplage réel)** : TOUS les héritages sont mesurés par les quêtes amont (RIO-01 axes via q1-r1 — moyennes de 9 items corrigés, grain 1/9 ; RIO-02 ombre via q2-r1 — les 6 labels RÉELS produits par le VRAI `nommage`) et balayés sur leurs valeurs réelles, jamais devinés ; la junction couple lit le VRAI croisement RIO-04 (types, percentiles, boucle, configuration + palier de la correction RIO-04 importée telle quelle) — UNIQUEMENT quand les données de l'autre rive sont mesurées et passées, sinon consignation explicite sans feuille vide.

## 4. La preuve (9 critères COR0-COR8, tous PASS)

### COR0 — Compactations prouvées exhaustivement

- **l'espace RÉEL des axes, déterminé par le VRAI code q1-r1** : 9 items corrigés par axe (échelle 1-4, items 5/15 inversés → corrigé ∈ 1-4), moyenne = somme/9, grain 1/9, arrondi 2 décimales — l'énumération des 4⁹ répartitions donne **28 sommes sans trou (9-36) → 28 valeurs d'axe (1,0 … 4,0)**, chacune vérifiée par le VRAI `scores_axes` (**0 écart**).
- **frontière 2,61 sur l'espace RÉEL — consignée honnêtement (style « borne corrigée par la mesure » de RIO-16)** : 2,61 est **NON PILE atteignable** (0 valeur réelle ne vaut 2,61) — les valeurs encadrantes mesurées sont **2,56 (somme 23/9)** et **2,67 (somme 24/9)**, **dist min mesurée 0,05** (bas 0,05 · haut 0,06). Le tranchage du VRAI cœur (≥ 2,61) est néanmoins **SANS AMBIGUÏTÉ** sur l'espace réel : aucune valeur réelle dans ]2,56 ; 2,67[ — testé des DEUX côtés par le VRAI `face_dominante` (axe A et axe B, **0 écart**) et par la couche (2,56 → 🟢 · 2,67 → 🟠).
- **table pas 9/9 ≡ règle pure** (double chemin — table ré-encodée sans le moteur, **0 écart**) ; **compaction pas ≡ (face, empreinte)** : 784 paires × 3 empreintes = **2 352 vérifs, 0 écart** (distribution réelle des 9 cellules mesurée : RASSUREE×ZC → P1 … SUR_LA_RA×PEDE → P6).
- **suivi** : 15 valeurs réelles (0-14) → 3 catégories (frontières 6/7 et 8/9 exactes — seuils entiers ≥ 9 · 7-8 · ≤ 6), **0 sanction** ; bords non entiers consignés (le cœur traite non-entier/négatif comme 0 et clampe à 14 — comportement réel).
- **espions** : variantes de labels (casse/espaces/accents) → même empreinte (10 sondes, 0 écart) ; les jours ne sont JAMAIS lus par `selectionner_pas` (structurel + testé) ; **la face seule NE SUFFIT PAS** (même face SUR_LA_RA, paliers 🟠/🔴 — consigné et prouvé).
- **type ≡ classe (hautA, hautB)** sur les 784 paires (**0 écart** — junction couple compactée) ; percentiles réels {20, 25, 70, 85} ; **écarts de boucle réalisables sur l'espace réel {0, 5, 15, 45, 50, 60, 65} — la frontière 30 n'est jamais PILE sur les données réelles** (consigné) ; testée PILE sur le VRAI `boucle_poursuite_retrait` : 54,9 → False · 55,0 → True (inclusive).
- **labels d'ombre RÉELS** : les 6 issues du VRAI `nommage` q2-r1 produites par des profils construits (ZONE CALME · PEUR DE PERDRE · PEUR D'ÊTRE ÉTOUFFÉE · LES DEUX · ALARME SANS MAIN · SIGNAL LÉGER NON NOMMÉ — **6/6**, junction « libellés réels » action n°3) ; normalisation mesurée : LES DEUX / ALARME SANS MAIN / SIGNAL LÉGER NON NOMMÉ / None / label inconnu → **ZONE_CALME** (consigné — portage fidèle du VRAI `empreinte()`).
- **fallback P1** : atteignable HORS flux uniquement (appel direct `_PAS_TABLE.get(("INCONNU","INCONNU"), "P1")` → « P1 » — consigné) ; le flux est prouvé propre au COR5.
- **re-test** : VRAI `programmer_re_test_q1("2026-01-01")` → 2026-02-26, 8 semaines, force False.

### COR1 — Fragment de bilan complet

**470 400/470 400** configurations (784 paires d'axes réelles × 8 labels du flux × 15 jours × 5 chemins couple) produisent un fragment L8 à 7 blocs sans feuille vide — **mono 94 080 · bi 376 320** (le chemin mono porte la consignation explicite « l'autre rive n'est pas encore mesurée — le croisement RIO-04 la lira quand elle sera mesurée », SANS feuille vide ; le chemin bi lit le VRAI croisement, configuration toujours nommée) — + **180/180** profils archivés.

### COR2 — Double chemin du palier plancher

Sur les **470 400** configurations : chemin **entiers purs** (somme d'items ≥ 24 — la frontière 2,61 tombe STRICTEMENT entre les sommes 23 et 24, prouvé au COR0) ≡ le VRAI seuil 2,61 du cœur : **0 écart** ; junctions S1 ⇔ 🔴, S2 ⇔ 🟠 **exactement** (0 écart). Les sA/sB des profils du simulateur sont continus (D-PARAM σ 0,4) — le chemin float est celui appliqué aux profils.

### COR3 — Seuils d'aide (S1 101 400 · S2 234 000 · 🟢 135 000)

**La couche n'ajoute aucun seuil numérique** (littéral 2,61 épinglé au comportement réel des deux cœurs à l'import). Borne 2,61 **NON PILE** sur le grain réel (dist min 0,05 — consigné). Seuils du SUIVI entiers par construction (≥ 9 / 7-8 / ≤ 6 — exacts). Frontière boucle 30,0 PILE inclusive (consignée).

### COR4 — Vocabulaire écran

**0 mot interdit** sur **33 textes distincts** + **16 blocs couple distincts** + **38 textes fixes** (bandeau, clauses, paliers, libellés français, templates réels du cœur : 6 pas + 3 suivi + 3 rappels + re-test) ; leçon D-Q5-1 respectée ; D-SIM **100 %** (énumération + 180 archivés) ; la direction de boucle RIO-04 n'apparaît JAMAIS (la danse est nommée ENSEMBLE).

### COR5 — Anti-fabrication

Le pas affiché ≡ le VRAI `selectionner_pas` (trace Q1_face/Q2_empreinte réelle — **0 écart** sur 470 400) ; **6 templates réels cités par écran** (pas + suivi + 3 rappels + re-test), présence verbatim vérifiée ; **fallback P1 INATTEIGNABLE via le flux normal** (470 400 visites — 0 occurrence d'une paire hors table ; les 9 paires du flux sont toutes dans `_PAS_TABLE`) ; JAMAIS de sanction (0 sur l'énumération, 0 sur les archivés).

### COR6 — Re-score bit-exact des 180 profils archivés (VRAI simulateur, seed 42, re-exécuté frais ×2 — D-REPRO)

**1 805 comparaisons, 0 écart** :
- **C1** : **180/180** pas ≡ `pas_vrai` (D-VÉRITÉ, éliminatoire — pas + face + empreinte) ;
- **C2** : **180/180** catégories ≡ `categorie_suivi_vraie` (D-VÉRITÉ) ≡ groupe attendu (CELEBRE 9-14 · AJUSTEMENT 7-8 · REPRISE 0-6 — déterministe) ;
- **C3** anti-perfectionnisme : CELEBRE **60/60** · AJUSTEMENT **60/60** · REPRISE **60/60** · **0 sanction** · `verifier_anti_perfectionnisme` ok ;
- **C6** : re-test 8 semaines **180/180**, jamais forcé ;
- couche appliquée aux 180 (chemin float — sA/sB continus) : D-SIM 100 %, 0 mot interdit, fragments complets 180/180, paliers 🟢 60 · 🟠 119 · 🔴 1 (S1 1 · S2 119).

### COR7 — Couplage pas (espace complet des héritages)

Les **6 pas réels** sont tous résolus par le VRAI `selectionner_pas` sur l'énumération : P1 101 250 · P2 104 625 · P3 180 675 · P4 14 625 · P5 41 925 · P6 27 300 ; suivi 14 j **15/15 sans sanction** ; re-test 8 semaines **jamais forcé** (2 dates testées) ; rappels doux J1/J7/J14 réels + marqueur D-Q5-1 réel (`verifier_rappels_doux` ok) ; table couple : les 9 configurations nommées, toutes avec template.

### COR8 — Reproductibilité

Pipeline exécuté **2 fois** : SHA-256 identiques **`b1be0fffcb0a23ac…`** (le simulateur consomme le rng à l'import : il est re-exécuté frais à chaque passage — D-REPRO). Runtime complet : ~30 s (les deux exécutions).

## 5. Limites honnêtes (lues avant toute décision)

1. **Tout est validé en simulation** (D-SIM) — VALID-01 reste vrai.
2. **F1 = 20 est un plafond structurel du barème** pour les quêtes « pas » (consigné — 95 % est le maximum atteignable, pas un échec).
3. **PLANCHER** : le palier lit les DEUX axes Q1 reçus — la vraie gravité peut être plus haute (le filet de l'app reste porté par RIO-02), jamais plus basse.
4. **2,61 n'est pas PILE atteignable** sur le grain réel (grain 1/9, arrondi 2 décimales — dist min mesurée 0,05 ; encadrants 2,56/2,67) — le tranchage du cœur reste sans ambiguïté sur tout l'espace réel ; le chemin entiers purs (somme ≥ 24) converge exactement.
5. **La face seule ne suffit pas** (SUR_LA_RA couvre 🔴 et 🟠) — la lecture palier est sur les axes bruts, prouvé.
6. **empreinte() normalise LES DEUX, ALARME SANS MAIN, SIGNAL LÉGER NON NOMMÉ, None et tout label inconnu vers ZONE_CALME** — portage fidèle du VRAI cœur, consigné.
7. **Fallback P1** : inatteignable via le flux normal (prouvé) ; atteignable HORS flux uniquement par appel direct de `_PAS_TABLE` avec clés arbitraires (consigné).
8. **Bords du suivi** : le cœur traite non-entier/négatif comme 0 (REPRISE) et clampe à 14 — comportement réel, consigné.
9. **Frontière boucle 30 de RIO-04** jamais PILE sur les percentiles réels (écarts mesurés {0, 5, 15, 45, 50, 60, 65}) — testée PILE sur le VRAI moteur (inclusive).
10. **La correction L6 (styles) de RIO-04 est hors périmètre de la junction RIO-05** — les axes transmis sont les axes bruts mesurés (les styles ne sont pas reçus par ce cœur) ; aucun gate RQS sur cet instrument.
11. Les héritages RIO-01 (axes) et RIO-02 (ombre) sont balayés sur leurs valeurs réelles, jamais devinés ; les 6 labels d'ombre sont produits par le VRAI `nommage` (junction « libellés réels », action n°3).
12. Le récapitulatif de DIMENSION reste l'action n°2 ; les libellés réels des questions restent l'action n°3.

## 6. Re-score final

| Critère | Avant | Après | Justification |
|---|---|---|---|
| F1 graduation | 20 | **20** | plafond STRUCTUREL du barème pour les quêtes « pas » (même traitement que RIO-10/15/18/23 — consigné) |
| F2 problème + gravité | 12 | **25** | palier 🟢🟠🔴 plancher hérité validé sur 470 400 configs (double chemin, VRAI seuil 2,61 sur les DEUX axes) + S1/S2 + QUAND DEMANDER DE L'AIDE + doctrine du pas affichée |
| F3 solutions | 20 | **25** | le pas/suivi/rappels/re-test réels PRÉSERVÉS + l'aide articulée au palier (sans jamais prescrire) |
| F4 bilan | 15 | **25** | fragment L8 7 blocs, 0 feuille vide sur 470 400 états + 180 archivés, junction couple RIO-04 réelle (deux chemins) |
| **Total** | **67 %** | **95 %** | le maximum atteignable au barème de l'audit — tous critères F2/F3/F4 complets |

**Moyennes exactes** : dimension attachement (100 + 100 + 100 + 100 + 95)/5 = 495/5 = **99 %** — **DIMENSION CLOSE** · global 23 quêtes (2 161 − 67 + 95)/23 = 2 189/23 = **95,2 %**.

**Fin du rattrapage de la dimension ATTACHEMENT** — les 5 quêtes RIO-01 à RIO-05 sont au gabarit complet (4 × 100 %, 1 × 95 % — plafond structurel). **L'ACTION N°1 EST CLOSE INTÉGRALEMENT** : toutes les quêtes du périmètre de correction (RIO-01→18 — attachement, émotionnelle, santé mentale, générationnelle) sont traitées au gabarit complet ; la personnalité (RIO-19→23) était déjà CLOSE à la génération 3 de l'audit (81,8 %) — le gabarit complet dont elle est issue est celui-là même que le rattrapage a appliqué aux autres dimensions.

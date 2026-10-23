# Rapport de correction philosophique — RIO-18 « Le pas de l'horizon » (WTC-EXT-Q3)

> AVERTISSEMENT D-SIM : résultats issus de simulations (seed 42 ×2) — la mécanique est validée, pas la prévalence clinique.
> Ordre fondateur : fichiers SUPPLÉMENTAIRES, zéro modification de l'existant, exactitude des calculs (même ordre que RIO-01→17).

**Date** : 23/10/2026
**Package** : `validation-ext/validation-ext-q3/correction-philosophique/`
**Cible** : RIO-18 « Le pas de l'horizon » (pas + récapitulatif) — audit du 21/10 (Task 163) : F1 20 · F2 25 · F3 25 · F4 22 = **92 %**
**Moteur réel importé** : `wtc_ext_q3_core.py` (VALIDÉ 7/7, CONTRESIGNÉ — banque 3/2/1 par famille héritée, pas zéro zone calme, choix jamais prescrit ligne 366, check-in partagé 14 j 9/14 célébré sans sanction, RCI L7 verbatim 0,58/0,41, agrégation max, traversées H 2,50/3,50 · L/C 1,80/2,60/3,20, override D-CRISE, entrée RQS ligne 257, A6 récapitulatif descriptif de dimension) — intégrité vérifiée par asserts à l'import, zéro réimplémentation, zéro retouche.

---

## 1. Les règles pré-enregistrées (R1-R9, écrites avant tout calcul)

| Règle | Contenu | Source réelle |
|---|---|---|
| **R1** | Palier/config/zone calme HÉRITÉS de Q2 (une mesure un rôle, leçon A1-SM-Q4 — JAMAIS recalculés) ; **assert de junction à CHAQUE appel** : le pas servi = VRAI `pas_de(palier_hérité, choix, zone)` (le choix du couple est respecté dans la banque — ligne 366), le statut = VRAI `statut_engagement_de(serie)`, le RCI = VRAI `rci_de`. **0 seuil ajouté.** | cœur ext-q3 |
| **R2** | Override D-CRISE : JAMAIS de pas de couple en crise (le VRAI classifier retourne pas/statut/rci tous None) — bandeau MOT POUR MOT, config calculée et tracée, jamais servie. Afficher un pas serait fabriquer. | `classifier` (P-FILTRE validé P1) |
| **R3** | Entrée RQS (ligne 257) : INVALIDE chez une rive = le couple n'entre pas au pas. Textes = VRAIS templates du cœur (pas_zero, célébré/en chemin, suivi_partage, orientation, re_cap — mot pour mot). | cœur ext-q3 |
| **R4** | Frontières exactes : check-in **9/14 PILE inclusive** · RCI **0,58/0,41 PILE testés 2 sens** (0,57 → SUGGESTION · 0,40 → BRUIT) · agrégation d'ensemble = MAX des 3 statuts (prouvée sur les 27 triplets par rive) · traversées H 2,50/3,50 et L/C 1,80/2,60/3,20 (VRAI `traverse_de`/`signification_de`). | cœur ext-q3 (L7 verbatim) |
| **R5** | Anti-fabrication : pas CHOISI jamais prescrit · suivi CÉLÉBRÉ jamais sanctionné · compteur partagé PRIVÉ (le bit commun n'expose jamais le contenu d'une rive — ligne 370) · pas zéro ssi zone calme (règle VRAI `pas_zero_legitime` — la zone calme n'existe qu'en config 1 dans le flux réel, consigné) · pas non déployé = rien à évaluer (statut None dit comme tel). 0 verdict temporel. | canon §5.5 + ligne 366/370 |
| **R6** | Vocabulaire écran : liste interdite canon Partie 9 + C6 (temporel) + **C7 anti-blâme/anti-tiers** (« coupable », « blâme », « fautif »… ; aînés/familles = rôles, jamais de noms). EXCEPTION SOURCÉE : filet 3919/3114. | canon Partie 9 + C7 |
| **R7** | Bandeau D-SIM (le VRAI `D_SIM` du cœur) sur chaque bloc écran. | hub |
| **R8** | L7 — une mesure un rôle : lectures RCI DÉCLARÉES PAR RIVE, JAMAIS comparées entre rives (VRAI template) ; l'ensemble nomme le plus fort des six statuts lus (max), il ne compare jamais. | cœur ext-q3 + C7 |
| **R9** | A6 : le récapitulatif de dimension affiché = le VRAI `RECAP_DIMENSION` du cœur (3 quêtes : carte RIO-16 → croisement RIO-17 → pas RIO-18), descriptif, 0 verdict de dimension — cité tel quel. | cœur ext-q3 (A6) |

## 2. La preuve (pipeline `wtc_ext_q3_correction_validation.py`)

### COR0 — Compactations prouvées exhaustivement + mesures

- **(a) table `pas_de` EXHAUSTIVE** : 3 familles × choix (None · PAS_ZERO · chaque pas de la banque · hors-banque) × zone calme (2 états) = **30 vérifications, 0 écart** — le VRAI `pas_de` ≡ règle pure (choix dans la banque → respecté · PAS_ZERO → ssi zone calme · None → pas zéro ssi zone, sinon banque[0]) ; **règle du pas zéro consignée exactement** (le VRAI moteur honore le choix PAS_ZERO ssi `pas_zero_legitime(zone)` — la zone calme n'existe qu'en config 1/VERT dans le flux réel) ; banques **3/2/1** ;
- **(b) check-in 14 j** : les **15 totaux + None** — 9/14 PILE inclusive (CÉLÉBRÉ ≥ 9 · EN CHEMIN < 9 · pas déployé sans série → rien à évaluer), 0 écart ;
- **(c) RCI L7** : bornes PILE **0,58 → FIABLE (2 sens) · 0,57 → SUGGESTION · 0,41 → SUGGESTION (2 sens) · 0,40 → BRUIT (2 sens) · Δ 0 → BRUIT** (8/8) ; **agrégation d'ensemble = MAX prouvée sur les 27 triplets** par rive (0 écart, libellés ENSEMBLE documentés) ; traversées : frontières **H 2,49/2,50/3,49/3,50 · L/C 1,79/1,80/2,59/2,60/3,19/3,20** exactes + traversée PILE au seuil + libellés `signification_de` (0 écart) ;
- **(d) espions** : serie None → statut None · bases absentes → rci None · filet → override (pas/statut/rci tous None) · RQS INVALIDE → non-entrée (4 sondes, 0 écart) ;
- **(e) A6** : le récapitulatif embarqué = le VRAI `RECAP_DIMENSION` — 3 quêtes RIO-16/RIO-17/RIO-18 ✓ ;
- **(f) templates du cœur** : **0 mot interdit** (clinique + temporel C6 + blâme/tiers C7) sur l'union des produits affichables.

### COR1/COR2 — Énumération exhaustive + double chemin

**216 états RCI par rive** ((statut³ ∈ 27) × (traversée³ ∈ 8), tous réalisés par des paires base/re_test au **grain 1/6 réel**, mesurées — jamais supposées) **balayés pour la rive A PUIS la rive B** (l'autre rive fixée — la couche ne compare JAMAIS les rives : le joint est le produit des états par rive, compactation prouvée au 0c) + **joint pas (7 valeurs servies) × statut (5 : None · CÉLÉBRÉ pile 9 · CÉLÉBRÉ 14 · EN CHEMIN 8 · EN CHEMIN 0)** + override + non-entrées (A, B) :

- **COR1** : **469/469 fragments complets** (7 blocs, 0 feuille vide) sur TOUS les chemins — entrée (pas zéro · pas servi · statut None · RCI présent/absent) · override · non-entrée ;
- **COR2** : le double chemin (règle pure `pas_de`) converge EXACTEMENT avec le VRAI moteur sur chaque configuration (0 écart) ; les asserts de junction (pas, statut, RCI) passent à CHAQUE appel — **la junction a attrapé au vol trois incohérences de la couche pendant le développement** (choix non transmis · bases/re_tests manquants sur trois chemins d'appel) — elle fait son travail.

Distributions : pas servis {orange_1 437 · pas zéro 5 · vert_1/vert_2/vert_3 5 chacun…} (les VRAIS libellés de la banque) · statuts {CÉLÉBRÉ 446 · EN CHEMIN 14 · None 7}.

### COR3 — Seuils d'aide (posés d'avance)

- **S1 = override** (court-circuit P-FILTRE — JAMAIS de pas en crise) · **S2 = tout palier non-VERT** (le pas zéro n'est PAS un seuil — la zone calme est dite comme telle) ;
- bornes consignées (R4) : 9/14 PILE inclusive · 0,58/0,41 PILE 2 sens · traversées H/L/C exactes.

### COR4/COR5 — Vocabulaire + anti-fabrication

- **COR4** : **0 mot interdit** (canon + C6 + liste C7 anti-blâme/anti-tiers étendue) sur les blocs écran et fragments, y compris les pas servis VERBATIM ; bandeau D-SIM partout ; exception sourcée consignée (filet 3919/3114) ;
- **COR5** : le pas zéro n'apparaît que sur PAS_ZERO exactement (0 abus, après correction de deux consignations qui citaient « pas zéro » hors contexte — le marqueur COR5 les a attrapées) ; **0 reproche/blâme** sur les chemins sans pas ; la doctrine « jamais comparées » est présente dès que des lectures L7 sont affichées (0 écart) ; le suivi None est dit « rien à évaluer » sans sanction.

### COR6 — Re-score BIT-EXACT des 650 couples archivés (D-REPRO)

Les 650 couples (14 groupes, seed 42 ×2) sont **régénérés par le VRAI simulateur** (`construire`/`verdicts`/`conforme`/`resume_groupes`) et comparés à l'archive contresignée du 18/10 :

| Agrégat | Archive 18/10 | Re-score frais | Verdict |
|---|---|---|---|
| `stats_groupes` (14 groupes : n, conformes, paliers, pas_servis, statuts, ensembles, traversées, boucles, styles) | — | **bit-exact 14/14** | ✅ |
| `globaux` | paliers 🟢 239 · 🟠 284 · 🔴 67 · OVERRIDE 40 · NON ENTRÉE 20 | **identique** | ✅ |
| pas servis globaux (libellés verbatim de la banque) | 6 libellés servis | **identiques** | ✅ |
| ensembles RCI | FIABLE 204 · SUGGESTION 77 · BRUIT 119 | **identique** | ✅ |
| conformité D-STD-2 par groupe (VRAI `conforme`) | 14/14 | **14/14** | ✅ |
| G05 items Forte (idx 35-39) | override quand même 5/5 | **5/5** | ✅ |

**650 comparaisons, 0 écart.** La couche est ensuite appliquée aux 650 verdicts : paliers identiques au cœur 650/650, fragments complets, pas affichés = pas du cœur (verbatim, 0 écart), override ⇒ court-circuit 40/40.

### COR7 — Couplage pas (table exhaustive + suivi + RCI)

- **table `pas_de` 30/30** (règle pure ≡ VRAI) · banques 3/2/1 · pas zéro ssi zone calme ;
- suivi 14 j : **15 totaux + None** — CÉLÉBRÉ 6 · EN CHEMIN 9 — **0 sanction** ;
- junction RCI : le fragment lit les VRAIS statuts/ensembles par rive (0 écart sur les 469 états).

### COR8 — Reproductibilité

Pipeline exécuté **2 fois** : SHA-256 identiques `d87904183db10a5a…` (payload canonique JSON des 3 stages).

## 3. Re-score au barème de l'audit (Task 163)

| Critère | Avant | Après | Justification |
|---|---|---|---|
| **F1 — Déceler de façon graduée** | 20 | **20** | **INCHANGÉ — PLAFOND STRUCTUREL** du barème pour les quêtes « pas » (RIO-05/10/15/18/23 notées F1 20 — prétendre 100 % serait une fabrication) |
| **F2 — Présenter le problème avec son niveau de gravité** | 25 | **25** | inchangé — palier hérité affiché + doctrine du pas + QUAND DEMANDER, déjà validés C5-C7 |
| **F3 — Proposer des solutions** | 25 | **25** | **PRÉSERVÉ tel quel** (leçon RIO-15) — les pas affichés sont les VRAIS de la banque, servis par le VRAI `pas_de`, jamais réécrits |
| **F4 — Bilan de l'état de la personne (couple)** | 22 | **25** | fragment de bilan L8 niveau COUPLE à 7 blocs, COMPLET sur TOUS les chemins (entrée : pas zéro/pas servi/statut None/RCI 216×2 états par rive · override · non-entrée — 0 feuille vide) avec le VRAI A6 récapitulatif de dimension (3 quêtes) et les junctions réelles (pas_de, statut, RCI par rive + ensemble max, traversées) |
| **Total** | **92 %** | **95 %** | AU BARÈME P1 SIMULATION — le maximum atteignable (F1 plafonné 20) |

## 4. Limites honnêtes (lues avant toute décision)

1. **Simulation seule** — bandeau D-SIM sur chaque écran ; la prévalence clinique reste l'objet de VALID-01.
2. **Libellés des items absents** (action n°3 de l'audit) — la couche ne lit que les sorties réelles des moteurs ; aucun texte d'item n'est inventé.
3. **Le palier est HÉRITÉ de Q2** — Q3 ne le recalcule jamais (une mesure un rôle) ; les avertissements (boucle, styles, asymétries) restent affichés au croisement RIO-17.
4. **Population L6 héritée de Q2 = placeholder** (2 000, seed 42) — à remplacer par le pilote.
5. **Le récapitulatif de DIMENSION** (fédération des 23 fragments des 5 dimensions — assemblage L8 complet « lorsqu'un monde est terminé ») reste l'action n°2 de l'audit : l'A6 embarqué ici couvre la dimension Générationnelle seule (descriptif, 0 verdict).

# Rapport de correction philosophique — RIO-17 « Notre conversation de l'horizon » (WTC-EXT-Q2)

> AVERTISSEMENT D-SIM : résultats issus de simulations (seed 42 ×2) — la mécanique est validée, pas la prévalence clinique.
> Ordre fondateur : fichiers SUPPLÉMENTAIRES, zéro modification de l'existant, exactitude des calculs (même ordre que RIO-01→16).

**Date** : 23/10/2026
**Package** : `validation-ext/validation-ext-q2/correction-philosophique/`
**Cible** : RIO-17 « Notre conversation de l'horizon » (croisement) — audit du 21/10 (Task 163) : F1 25 · F2 25 · F3 18 · F4 22 = **90 %**
**Moteurs réels importés** : `wtc_ext_q2_core.py` (VALIDÉ 7/7, CONTRESIGNÉ — 9 configurations, miroirs 2/4 · 3/7 · 6/8, palier croisé max-niveau, override D-CRISE, percentiles L6, 3 inférences L5) · `wtc_ext_q3_core.py` (le pas — RIO-18) — intégrité vérifiée par asserts à l'import, zéro réimplémentation, zéro retouche.

---

## 1. Les règles pré-enregistrées (R1-R9, écrites avant tout calcul)

| Règle | Contenu | Source réelle |
|---|---|---|
| **R1** | Config + palier de couple = VRAIS `config_de`/`palier_croise` — **asserts de junction à CHAQUE appel**. **0 seuil ajouté** : les seules frontières restent les VRAIES bornes 2,50/3,50 — **PILE ATTEIGNABLES sur le grain 1/6** (15/6 = 2,50 · 21/6 = 3,50), tranchage inclusif consigné et testé. | cœur ext-q2 (SPEC §3 max-niveau) |
| **R2** | Override D-CRISE : une seule rive en signal suffit — court-circuit AVANT le verdict, bandeau MOT POUR MOT, config **calculée et TRACÉE, JAMAIS déployée**. Afficher un verdict serait fabriquer. JAMAIS de pas de couple sur crise. | `classifier_croisement` (P-FILTRE validé P1) |
| **R3** | Entrées RQS (ligne 257) : RQS INVALIDE chez une rive = non-entrée, aucun résultat de couple. Lectures = VRAIS templates config_1..9 mot pour mot ; avertissements = VRAIS L6 (boucle ≥ 30 · styles ≥ 1,00 · asymétries) — des AVERTISSEMENTS, jamais des verdicts, jamais un reproche. | cœur ext-q2 + canon ligne 262 |
| **R4** | Honnêteté des bornes : tranchage inclusif du VRAI moteur décide aux bornes PILE (2,50 → MODÉRÉE · 3,50 → FORTE — cas de table D-VÉRITÉ testés). Aucune borne ajoutée. | grain mesuré, stage 0b |
| **R5** | Anti-fabrication temporelle (C6) : « devance » = niveau DÉCLARÉ plus fort, jamais une position dans le temps (VRAI template config_6) ; zone calme dite ssi config 1 (LA MÊME HEURE — VRAI zone_calme) ; re-tests NON consommés au croisement (une mesure un rôle — SPEC §7, VRAI template). | canon §5.5 + C6 Générationnelle |
| **R6** | Vocabulaire écran : liste interdite (canon Partie 9 + C6). EXCEPTIONS SOURCÉES : filet 3919/3114 + bandeau override = literals du VRAI cœur. Doctrine couple : boucle nommée ENSEMBLE, direction JAMAIS affichée, JAMAIS de pourcentage de compatibilité. | canon Partie 9, lignes 355-356 |
| **R7** | Bandeau D-SIM sur chaque bloc écran (le VRAI `D_SIM` du cœur, mot pour mot). | hub |
| **R8** | Couplage pas réel : famille_de(palier croisé HÉRITÉ — jamais recalculé en Q3, leçon A1-SM-Q4) + BANQUE_PAS_EXT verbatim ; pas zéro ssi config 1 (VRAI `pas_zero_legitime`) ; suivi 14 j sans sanction (15 totaux vérifiés). | moteur ext-q3 |
| **R9** | Percentiles L6 : VRAI `percentile_de` dans la population déposée (2 000, seed 42 — placeholder L2, à remplacer par le pilote) ; la boucle ne change AUCUN résultat (junction testée : même config, même palier, mêmes inférences avec/sans population). | cœur ext-q2 (L6 verbatim) |

## 2. La preuve (pipeline `wtc_ext_q2_correction_validation.py`)

### COR0 — Compactations prouvées exhaustivement + mesures

- **(a) table pure 3×3 ≡ VRAI `config_de`** (9/9, 0 écart) + **anti-inversion 2/4 · 3/7 · 6/8** (D-VÉRITÉ) + **miroirs 9/9** + 9 noms uniques hors registre SM-Q4 ;
- **(b) bornes PILE ATTEIGNABLES** : 2,50 et 3,50 présentes dans le grain 1/6 (15/6 · 21/6) — tranchage inclusif testé : **2,49 → FAIBLE · 2,50 → MODÉRÉE · 3,49 → MODÉRÉE · 3,50 → FORTE** (cas de table D-VÉRITÉ, 0 écart) ; règle max pure du palier croisé ≡ VRAI sur les 9 paires (0 écart) ;
- **(c) espion population** : les percentiles ne changent NI config NI palier NI inférences NI verdict (9 sondes, 0 écart — la boucle est un AVERTISSEMENT, la junction est prouvée) ;
- **(d) zone calme ⇔ config 1 exactement** (9/9 via le VRAI `palier_croise` — invariant 🟢 ⇔ (FAIBLE, FAIBLE) ⇔ LA MÊME HEURE prouvé) ;
- **(e) banque réelle 3/2/1** (🟢/🟠/🔴) + mapping famille (3/3) + **pas zéro ssi config 1** (9/9) ;
- **(f) percentiles mid-rank déterministes** (5/5) + **frontière boucle 30,0 PILE inclusive** (écart 30,0 → True · 29,9 → False — VRAI `boucle_probable`).

### COR1/COR2 — Énumération exhaustive + double chemin

**13 824 états ENTRÉE** (9 configs × 2 boucles × 2 styles × 4 asymétries × 8 inférences × 3 forces × 4 paires de statuts RQS — l'espace complet des états distincts du croisement déployé) + **18 overrides** (9 configs × 2 rives en crise — une seule suffit, prouvé des deux côtés) + **2 non-entrées** (RQS INVALIDE chez A puis chez B) :

- **COR1** : 13 844/13 844 fragments de bilan complets (7 blocs, 0 feuille vide) sur les TROIS chemins (entrée · override · non-entrée) ;
- **COR2** : le double chemin (table pure 3×3 + règle max) converge EXACTEMENT avec le VRAI `classifier_croisement` sur **13 824/13 824 + 20/20** hors-verdict (config_num, palier, override/entrée) ; les asserts de junction (config, palier, zone calme, inférences ≡ VRAI `inferences_L5`) passent à CHAQUE appel.

Distributions de l'énumération : les 9 configurations à 1 536 états chacune (espace symétrique complet) — paliers {🟢 1 536 (config 1) · 🟠 4 608 (configs 2/4/5) · 🔴 7 680 (configs 3/6/7/8/9)}.

### COR3 — Seuils d'aide (posés d'avance)

- **S1 = 18 configurations override** (court-circuit P-FILTRE — la rive en crise suffit, des deux côtés) · **S2 = 12 288** (tout palier non-VERT — le palier 🔴, max FORTE, est AUSSI un moment « demander de l'aide ») — 0 écart ;
- bornes consignées (R4) : 2,50/3,50 PILE ATTEIGNABLES, tranchage inclusif testé ; boucle ≥ 30,0 PILE inclusive.

### COR4/COR5 — Vocabulaire + anti-fabrication

- **COR4** : **0 mot interdit** (21 mots cliniques + injonctions temporelles C6) sur **443 blocs écran distincts** et les fragments associés, y compris les 9 lectures de configuration et les pas servis VERBATIM de la banque Q3 ; bandeau D-SIM (VRAI `D_SIM`) présent partout ; exceptions sourcées consignées (filet + override) ;
- **COR5** : le marqueur « Zone calme — rien à fabriquer ici » n'apparaît que sur la config 1 (1 536/1 536, 0 abus) ; avertissements présents ⇔ flags (boucle/styles, 0 écart) ; doctrine comparatif exacte sur chaque fragment (« 0 % compatibilité — le croisement lit deux lectures déclarées, jamais un score comparé ») ; 0 verdict temporel (« devance » = niveau déclaré plus fort).

### COR6 — Re-score BIT-EXACT des 650 couples archivés (D-REPRO)

Les 650 couples (14 groupes, seed 42 ×2) sont **régénérés par le VRAI simulateur** + VRAI `sortie_rive` + VRAI `classifier_croisement` dans la population déposée (2 000, seed 42) et comparés à l'archive contresignée du 18/10 :

| Agrégat | Archive 18/10 | Re-score frais | Verdict |
|---|---|---|---|
| `stats_groupes` (14 groupes : n, conformes, configs, paliers, boucle, styles, asymétries, inférences, entrées) | — | **bit-exact 14/14** | ✅ |
| `globaux` | paliers 🟢 89 · 🟠 237 · 🔴 284 · OVERRIDE 40 · NON ENTRÉE 0 · entrées 610 · boucles 87 · styles 75 | **identique** | ✅ |
| inférences L5 globales | taxe 403 · sujet 407 · silence 102 | **identique** | ✅ |
| conformité D-STD-2 par groupe (VRAI `conformite_couple`) | 14/14 OK | **14/14** | ✅ |
| G10 items Forte (idx 35-39) | override quand même 5/5 | **5/5** | ✅ |

**650 comparaisons, 0 écart.** La couche est ensuite appliquée aux 650 croisements : paliers identiques au cœur 650/650 (🟢 89 · 🟠 237 · 🔴 284 · OVERRIDE 40), fragments complets, 0 mot interdit, override ⇒ court-circuit + config tracée 40/40.

### COR7 — Couplage pas réel (VRAI Q3)

- **9 configurations couvertes** : famille héritée du palier croisé (jamais recalculée) — 🟢 config 1 → exercice maison à deux (banque 3) · 🟠 configs 2/4/5 → engagement du module à deux (banque 2) · 🔴 configs 3/6/7/8/9 → démarche d'orientation (banque 1) ;
- **pas servis VERBATIM** : junction vérifiée sur chaque configuration (0 écart, jamais réécrits) ;
- **pas zéro ssi config 1** (9/9) ; suivi 14 jours : les **15 totaux** → CÉLÉBRÉ (6) / EN CHEMIN (9) — **0 sanction** ; re-tests non consommés (template VRAI cité mot pour mot).

### COR8 — Reproductibilité

Pipeline exécuté **2 fois** : SHA-256 identiques `9ce72cbbbd30235b…` (payload canonique JSON des 4 stages).

## 3. Re-score au barème de l'audit (Task 163)

| Critère | Avant | Après | Justification |
|---|---|---|---|
| **F1 — Déceler de façon graduée** | 25 | **25** | inchangé — la lecture graduée du croisement validé (D-VÉRITÉ table, anti-inversion, D-STD-2) est préservée telle quelle |
| **F2 — Présenter le problème avec son niveau de gravité** | 25 | **25** | inchangé — le gabarit universel complet était déjà validé C5-C7 (9 templates + QUAND DEMANDER + avertissements L6 jamais verdicts) |
| **F3 — Proposer des solutions** | 18 | **25** | contenu CONCRET des 3 paliers croisés produit PAR CONFIGURATION RÉELLE (l'écart F3 de l'audit) : 🟢 config 1 zone calme (invariant prouvé) · 🟠 configs 2/4/5 modules à deux sur les VRAIS pas de la banque Q3 + clause contextuelle par configuration · 🔴 configs 3/6/7/8/9 = le VRAI pas rouge + filet — junction verbatim vérifiée à chaque état (COR7) |
| **F4 — Bilan de l'état de la personne (couple)** | 22 | **25** | fragment de bilan L8 niveau COUPLE à 7 blocs, COMPLET sur les 3 chemins (entrée 13 824 · override 18 · non-entrée 2 — 0 feuille vide) avec les junctions réelles Q3 (famille héritée, banque verbatim, pas zéro config 1) et la doctrine couple (boucle ENSEMBLE, direction jamais affichée, 0 % compatibilité consignée) |
| **Total** | **90 %** | **100 %** | AU BARÈME P1 SIMULATION |

## 4. Limites honnêtes (lues avant toute décision)

1. **Simulation seule** — bandeau D-SIM sur chaque écran ; la prévalence clinique reste l'objet de VALID-01.
2. **Population L6 = placeholder** (2 000, seed 42 — le moteur le consigne lui-même) : les percentiles et la boucle passeront au pilote réel ; la boucle est un AVERTISSEMENT, jamais un verdict.
3. **Libellés des items absents** (action n°3 de l'audit) — la couche ne lit que les sorties réelles des moteurs Q1/Q2 ; aucun texte d'item n'est inventé.
4. **Les sorties consommées sont celles de RIO-16 contresignées** — le croisement n'invente rien en amont ; les re-tests ne sont pas consommés ici (SPEC §7).
5. **Le récapitulatif de DIMENSION** (fédération des fragments) reste l'action n°2 de l'audit — non traité ici.

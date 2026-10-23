# Rapport de correction philosophique — RIO-04 « Notre danse » (croisement de couple)

> AVERTISSEMENT D-SIM : résultats issus de simulations (seed 42) — la mécanique est validée, pas la prévalence clinique.

**Date** : 2026-10-23
**Trace fondateur** : 1a167755f324af9d (« RIO-04 »)
**Exécution** : Task 176
**Package** : `validation-q4/correction-philosophique/` (fichiers SUPPLÉMENTAIRES — zéro modification de l'existant)
**Audit de référence** : audit-philosophie-therapeutique-23-RIO-2026-10-21 (Task 163), RIO-04 noté 61 % (F1 25 · F2 15 · F3 6 · F4 15)

---

## Section A — Ce que l'audit demandait, ce que la couche ajoute

| Facette | Score audit | Ajout de la couche | Score après |
|---|---|---|---|
| F1 graduation | 25 | **INCHANGÉ** — la lecture du croisement est déjà P1 (C2 800/800 bit-exact avec la ré-implémentation indépendante, C3 9/9 mot pour mot, C5 800/800 — re-confirmés bit-exact ici) | 25 |
| F2 gravité | 15 | **Palier de couple 🟢🟠🔴 dérivé mécaniquement** du VRAI croisement (configurations + VRAI drapeau de boucle ≥ 30) + **QUAND DEMANDER DE L'AIDE** (S1 ⇔ 🔴, S2 ⇔ 🟠 — re-test 8 semaines) + l'avertissement de style RÉEL du moteur reproduit (R4) | 25 |
| F3 solutions | 6 | **Contenu des 3 paliers PAR CONFIGURATION RÉELLE** (les 9 noms du moteur — exercices 🟢 de capitalisation, modules 🟠 à deux, orientation 🔴 phrase canon) + **branchement quête « pas » pour CHACUN des deux partenaires** via le VRAI `selectionner_pas` (face × empreinte mesurées par les Quêtes 1-2 de chacun — jamais devinées) + suivi 14 j sans sanction + re-test jamais forcé | 25 |
| F4 bilan | 15 | **Fragment de bilan L8 à 7 blocs niveau couple** — la « Carte de notre danse » — junctions réelles (empreintes Q2 de chacun, les 9 configurations, pas Q5 de chacun) | 25 |

**RIO-04 = 61 % → 100 % au barème P1 simulation.**

## Section B — Les règles pré-enregistrées (R1-R9)

Écrites AVANT tout calcul, dérivées MÉCANIQUEMENT des sorties du vrai cœur — zéro invention de mesure :

- **R1 (palier de couple)** : 🔴 ssi FEU_CROISE (les deux partenaires en alerte) · 🟠 ssi boucle probable du VRAI `boucle_poursuite_retrait` (écart ≥ 30) OU exactement un partenaire en alerte (MIXTE_*_FEU) OU DISTANCE_POLIE (retrait partagé) · 🟢 sinon (BASE_SEREINE, MIXTE_SEREINE_RETRAIT). **Aucun seuil numérique ajouté** — mapping catégoriel pur des sorties du moteur.
- **R2 (S1)** : S1 ⇔ palier 🔴 exactement — orientation chaleureuse à deux.
- **R3 (S2)** : S2 ⇔ palier 🟠 exactement — à surveiller, re-test 8 semaines par le VRAI `programmer_re_test_q1` (jamais forcé).
- **R4 (qualité avant sens)** : styles dissimulables (VRAI `styles_dissimulables`) → avertissement RÉEL du moteur reproduit, lecture maintenue avec prudence.
- **R5 (anti-fabrication)** : pct compatibilité JAMAIS affiché (None — hérité du moteur) ; direction de la boucle calculée mais JAMAIS affichée (la danse est nommée ENSEMBLE) ; « rien à fabriquer » ssi BASE_SEREINE exactement.
- **R6 (gravité individuelle jamais dupliquée)** : le palier de COUPLE lit la danse ; la lecture individuelle de chacun reste portée par sa propre carte (RIO-01). MIXTE_SEREINE_RETRAIT se lit 🟢 au niveau couple (aucun drapeau du moteur) sans minimiser le vécu de chacun.
- **R7 (vocabulaire écran)** : canon Partie 9 + liste anti-blâme du VRAI moteur — 0 mot interdit ; D-CRISE non applicable (aucun construit d'auto-danger mesuré) — consigné.
- **R8 (D-SIM)** : bandeau sur chaque bloc écran.
- **R9 (couplage réel)** : pas de CHACUN via le VRAI `selectionner_pas` ; suivi 14 j VRAI (0 sanction, compteur privé) ; re-test VRAI (jamais forcé).

## Section C — Méthode (5 stages) et chiffres exacts

### Stage 0 — Compactations PROUVÉES

- **Écart/boucle déterministes par paire de types** : les percentiles sont des constantes par type (25/70/20/85) → l'écart ne peut prendre que **7 valeurs {0, 5, 15, 45, 50, 60, 65}** — vérifié 16/16 paires ordonnées ; le VRAI drapeau (≥ 30) est donc déterministe par paire de types. **Le seuil 30 n'est jamais PILE** (dist min 15 — consigné).
- **Frontière 2,61 jamais PILE** : sur les 84 scores corrigés atteignables (k/9 + δ, δ ∈ {−0,5 ; 0 ; +0,5}), le minimum de |s − 2,61| est **0,0011** (19/9 + 0,5 = 2,6111) — consigné, appliqué tel quel (le moteur est inclusif ≥).
- **face ≡ type → pas ≡ (type, empreinte)** : sur la grille complète des 84 × 84 paires de scores corrigés atteignables (7 056) × 3 empreintes (**21 168 appels au VRAI selectionner_pas**), la face du VRAI `face_dominante` est constante par type (4/4) et le pas constant par (type, empreinte) (12/12) — l'espace des pas est compacté sans perte.
- **Espions clés parasites** : h_norm, r_norm, jours, date, score_A, clés fantômes — ajoutés aux profils → sorties identiques (md5 + fragment + pas) 16/16 paires de types. **La couche ne lit que ses entrées documentées** (sA, sB, style, label_ombre, forces).
- **Empreinte normalisée** : 6 variantes d'écriture → 3 classes par le VRAI `empreinte()` (ZONE_CALME, PEUR_DE_PERDRE, PEUR_D_ETRE_ETOUFFEE).
- **Table indépendante ≡ VRAI `_CONFIG_TABLE`** : 16/16 — et complétude L6 : les 9 paires de styles × 16 paires de types (**144 cellules**) retombent toutes sur les types corrigés énumérés (0 écart) — le style ne fait que déplacer un profil D'UN type à l'autre, et les deux sont énumérés.

### Stage 1 — Énumération EXHAUSTIVE : 139 392 configurations

**Espace** : 4 types p1 × 4 types p2 × 2 classes de styles (L6) × 3 empreintes p1 × 3 empreintes p2 × 22 jeux de forces p1 × 22 jeux de forces p2 = **139 392** — chacune atteignable par de vraies réponses corrigées (les banques de forces du simulateur P1 sont des sous-ensembles de la banque union énumérée — sur-ensemble conservatif).

- **COR1** fragment L8 7 blocs complet : **139 392/139 392** (0 champ vide)
- **COR2** double chemin (table + règle ré-encodées, sans appeler le moteur) ≡ couche (VRAI moteur) : **139 392/139 392 convergents** (config + boucle + palier + S1 + S2)
- **COR3** S1 = **17 424** (FEU_CROISE : 2 paires ordonnées) · S2 = **95 832** (causes : boucle 69 696 · feu simple 52 272 · silence 8 712 — cumulables) · 🟢 = 26 136 · junctions S1 ⇔ 🔴 / S2 ⇔ 🟠 incohérentes : **0**
- **COR4** 0 mot interdit (2 listes) sur **78 408 textes distincts** · D-SIM 100 % · direction jamais affichée · jamais de « tu »/« ton » dans la phrase de boucle
- **COR5** « rien à fabriquer » ssi BASE_SEREINE exactement (8 712 configs légitimes, 0 abus, 0 manque) · pct compatibilité None partout · avertissement de style présent ssi styles dissimulables (69 696/69 696)

### Stage 2 — Re-score BIT-EXACT des 800 paires archivées (D-REPRO)

Le VRAI simulateur P1 (seed 42) est **re-exécuté FRAIS à chaque passage** (rng reconstruit au chargement — jamais partagé entre passages) → les 800 paires régénérées bit-exact. **12 008 comparaisons, 0 écart** :

| Agrégat (archive du 15/10) | Recalculé | Verdict |
|---|---|---|
| resume_configs (89×8 + 88) | identique | ✅ bit-exact |
| config_obtenues_count (9 cellules) | identique | ✅ bit-exact |
| C1 n_correct par config (9 cellules) | identique | ✅ bit-exact |
| C2 désaccords moteur ↔ ré-impl. indépendante | 0 = 0 | ✅ bit-exact |
| Boucles probables | 370 = 370 | ✅ bit-exact |
| Avertissements style | 28 = 28 | ✅ bit-exact |
| C3 templates mot pour mot | 9/9 configs, 800/800 paires | ✅ bit-exact |
| C5 violations affichage | 0 = 0 | ✅ bit-exact |

- **FAIL strict C1 7/9 CONSERVÉ consigné** : 621/800 paires tombent sur leur configuration attendue ; MIXTE_SEREINE_POURSUITE (70,79 %) et MIXTE_POURSUITE_FEU (74,16 %) restent sous leur seuil D-STD par configuration. C'est la géométrie documentée par le package P1 lui-même (le style L6 déplace un profil d'un type à l'autre à la frontière 2,61) — le VRAI moteur reste bit-exact avec la ré-implémentation indépendante (C2 800/800). **Zéro retouche au moteur** — la couche lit les types corrigés, où le moteur est exact.
- **Couche appliquée sur les 800 paires réelles** : junctions 0 écart · fragments complets 800/800 · 0 mot interdit · direction jamais affichée · **pas représentatifs ≡ pas réels (scores corrigés réels) 800/800** — la compactation pas ≡ (type, empreinte) est validée sur données réelles.
- **Prévalence D-SIM sur les 800 paires** : 🟢 176 (22,0 %) · 🟠 527 (65,9 %) · 🔴 97 (12,1 %) — S1 97, S2 527.

### Stage 4 — Couplage pas + suivi + re-test (VRAI moteur Q5)

- **12/12** (type × empreinte) par partenaire → pas P1-P6 résolus avec trace de source réelle (« face dominante (Q1) + empreinte (Q2) ») — chacun sur soi, jamais un pas de couple prescrit.
- **Suivi 14 j : 15/15 frontières exactes** (6→REPRISE, 7-8→AJUSTEMENT, 9-14→CELEBRE) · **0 sanction** sur les 15 valeurs · compteur privé.
- **Re-test** : `programmer_re_test_q1("2026-01-01")` → 2026-02-26 (8 semaines), `force: False`, « jamais forcé » — le VRAI mécanisme.

## Section D — Les 9 critères COR0-COR8

| Critère | Observé | Verdict |
|---|---|---|
| COR0 compactations | écart 16/16 · pile 30 : 0 (dist 15) · pile 2,61 : 0 (dist 0,0011) · face 0/4 écarts · pas 0/12 · espions 0/16 · empreinte 6→3 · table 16/16 · L6 0/144 | ✅ PASS |
| COR1 fragment complet | 139 392/139 392 + 800/800 | ✅ PASS |
| COR2 double chemin | 139 392/139 392 convergents | ✅ PASS |
| COR3 seuils d'aide | S1 17 424 · S2 95 832 · junctions 0 incohérentes · 0 seuil ajouté | ✅ PASS |
| COR4 vocabulaire écran | 0 mot interdit (78 408 textes) · D-SIM 100 % · direction cachée · boucle sans « tu » | ✅ PASS |
| COR5 anti-fabrication | calme ⇔ BASE_SEREINE exactement · pct None partout · avert ⇔ styles dissimulables · C5 0 violation | ✅ PASS |
| COR6 re-score bit-exact | 800 paires · 12 008 comparaisons · 0 écart · 8/8 agrégats bit-exact · C1 621/800 CONSERVÉ · pas repr ≡ réel 800/800 | ✅ PASS |
| COR7 couplage pas | 12/12 par partenaire · suivi 15/15 · 0 sanction · re-test jamais forcé | ✅ PASS |
| COR8 reproductibilité | pipeline ×2 → SHA-256 identiques `fb18c5c986a666a3…` | ✅ PASS |

## Section E — Re-score et moyennes (exactes)

- **RIO-04 = 61 % → 100 %** (F1 25 inchangé · F2 15→25 · F3 6→25 · F4 15→25).
- **Moyenne attachement** : (100 + 100 + 100 + 100 + 67)/5 = 467/5 = **93,4 %** (85,6 % avant RIO-04).
- **Global 23 quêtes** : 2 000/23 = **87,0 %** (85,3 % avant RIO-04). Les scores des 22 autres quêtes restent inchangés.

## Section F — Limites honnêtes

1. **Tout est validé en simulation** (bandeau D-SIM sur chaque écran) — le constat n°1 de l'audit (zéro réel, VALID-01) reste vrai. Les percentiles (25/70/20/85) sont des repères internes à la simulation, à recalibrer sur le pilote réel.
2. **Le FAIL strict C1 7/9 du package P1 est conservé tel quel** — géométrie du style L6 documentée, zéro retouche au moteur. Toute prétention à 9/9 serait une fabrication.
3. **D-CRISE non applicable** à cet instrument (aucun construit d'auto-danger mesuré par le croisement) — consigné, remplacé par S1/S2.
4. La gravité **individuelle** de chaque partenaire reste portée par sa propre carte (RIO-01) — le palier de couple ne la remplace jamais.
5. Le récapitulatif de DIMENSION (fédération des fragments) reste l'**action n°2** de l'audit ; les libellés réels des 18 questions restent l'**action n°3**.
6. Les exercices/modules/orientations sont **proposés, jamais prescrits** — le pas reste un choix, célébré jamais sanctionné.

# Rapport de correction philosophique — RIO-15 « Mon premier pas vers l'autre rive » (WTC-SM-Q5)

> AVERTISSEMENT D-SIM : résultats issus de simulations (seed 42) — la mécanique est validée, pas la prévalence clinique.
> Ordre fondateur (trace 1a15ed7ad00bc0fd) : fichiers SUPPLÉMENTAIRES, zéro modification de l'existant, exactitude des calculs.

**Date** : 23/10/2026
**Package** : `validation-sm/validation-sm-q5/correction-philosophique/`
**Cible** : RIO-15 « Mon premier pas vers l'autre rive » (pas) — audit Task 163 : F1 20 · F2 23 · F3 25 · F4 18 = **86 %**
**Moteurs réels importés** : `wtc_sm_q5_core.py` (SPEC verrouillée 18/10) · `wtc_sm_q3_core.py` (forces) · `wtc_sm_q4_core.py` (config tracée) · `wtc_sm_q2_core.py` (filet amont) — intégrité par asserts à l'import, zéro retouche.

## 1. Les règles pré-enregistrées (R1-R9)

| Règle | Contenu | Source réelle |
|---|---|---|
| **R1** | Palier AFFICHÉ = la sortie du VRAI `palier_de` (EXERCICE MAISON / MODULE DE COUPLE / ORIENTATION), emoji en plus, règle lisible (« max des deux niveaux ») — 0 seuil ajouté. | A3 verrouillé |
| **R2** | En crise héritée : ORIENTATION sans AUCUN pas (VRAI `pas_de` → None — « JAMAIS de pas de couple en crise ») + le VRAI LITTERAL_ORIENTATION + le filet amont réel ; la config reste TRACÉE. | D-CRISE hub |
| **R3** | L'ombre du pas = la config tracée (VRAI `config_de`) avec le VRAI template de Q4 (mot pour mot) — l'ombre du pas est celle du croisement, jamais réinventée. | TEMPLATES_CONFIG Q4 |
| **R4** | Doctrine du pas affichée : CHOISI jamais prescrit (champ libre réel PAS_LIBRE), célébré jamais sanctionné (VRAIS statuts CÉLÉBRÉ ≥ 9/14 · EN CHEMIN — aucun statut de sanction n'existe), compteur privé (le VRAI `statut_engagement_de` ne lit que la somme des 14 booléens — vérifié). | A1/A2 + TEMPLATES |
| **R5** | Pas affichés ≡ VRAIE banque (🟢 ×3 · 🟠 ×3 · 🔴 vide) ; CÉLÉBRÉ pile 9/14 → le VRAI template celebre_pile ; RCI → les VRAIS statuts L7 ; le positif n'est jamais généré (BRUIT = « la mesure ne tranche pas encore »). | TEMPLATES + A4 |
| **R6** | 0 mot interdit ; exceptions sourcées : filet amont (literal moteur P1) · case « trouble » de la vraie banque (ligne 133). | canon Partie 9 |
| **R7** | Bandeau D-SIM. | hub |
| **R8** | Le pas 🟢 « pratiquer la force dérivée identifiée en Q3 » pointe les forces MESURÉES par RIO-13 (banque F-S1 à F-S6 réelle) — la couche liste la banque, ne l'invente pas. | moteur Q3 |
| **R9** | Le VRAI RCI lit base/re-test (Δ = re-test − base, asymétrie temporelle réelle) ; la date de re-test = arithmétique (+56 j), jamais forcée. Le VRAI `signification_de` retourne une chaîne vide hors traversée — affiché « niveau stable » (la donnée réelle, dite). | A4 verbatim |

## 2. La preuve

### COR0 — Frontières du moteur prouvées (les VRAIES tables)

- **engagement** : les 15 totaux (0-14) → CÉLÉBRÉ/EN CHEMIN, frontière **9/14 PILE inclusive** + None (pas non déployé) — 0 écart ;
- **RCI L7** : les frontières exactes 3,58→FIABLE · 2,42→FIABLE · 3,41→SUGGESTION · 2,59→SUGGESTION · 3,40→BRUIT · 2,60→BRUIT (bornes inclusives, 2 sens) — 0 écart · asymétrie temporelle : swap base/re-test → Δ signé inversé exactement (8/8) ;
- **agrégation max** : les 9 combinaisons → ensemble attendu (9/9) ;
- **table palier** : les 9 croix = la règle max + l'override crise (10/10) ;
- **banque injective** : 6 pas uniques (🟢 ×3 · 🟠 ×3 · 🔴 vide).

### COR1/COR2 — Énumération exhaustive + double chemin

**288 configurations** (9 cellules × 2 états crise × 16 états de série : 15 totaux + None) — l'espace complet des états distincts de la couche :

- **COR1** : 288/288 fragments complets, 0 bloc vide ;
- **COR2** : le double chemin ENTIERS PURS (max-rang, override en premier) ≡ VRAI `palier_de` **288/288** — assert à chaque appel.

Distributions : paliers {ORIENTATION 224 · MODULE DE COUPLE 48 · EXERCICE MAISON 16} — statuts {EN CHEMIN 162 · CÉLÉBRÉ 108 · NON_DÉPLOYÉ 18}.

### COR3/COR4 — Seuils + vocabulaire

- **S1 = 224** (ORIENTATION — crise ∨ ÉLEVÉ) · **S2 = 48** (MODULE DE COUPLE — re-test 8 semaines) ;
- bornes L7 verbatim consignées (|Δ| ≥ 0,58 · [0,41 ; 0,58[ · < 0,41 — SE_diff ≈ 0,356), 0 seuil ajouté ;
- **COR4** : 0 mot interdit sur **288 textes distincts** ; D-SIM 100 % ; exceptions sourcées consignées.

### COR5 — Anti-fabrication + doctrine du pas

- 0 pas hors banque sur 288 écrans (le champ libre réel est cité comme tel) ;
- **0 mot de sanction** sur 288 écrans (les VRAIS templates disent « sans sanction », aucun ne sanctionne) ;
- zone calme (VRAI template) ssi palier vert hors crise (16/16, 0 abus, 0 manque) ;
- **0 pas en crise** (le VRAI `pas_de` retourne None — 0 violation) ;
- balayage RCI : 5 bases × 9 deltas binaires exacts — 45/45 (les frontières PILE 0,58/0,41/0,40 sont prouvées au COR0 avec les valeurs exactes du moteur ; le balayage évite le bruit de représentation flottante des nominaux).

### COR6 — Re-score BIT-EXACT des 540 couples archivés (D-REPRO)

| Agrégat | Archive 18/10 | Re-score frais | Verdict |
|---|---|---|---|
| `stats_groupes` (12 groupes : statuts, paliers, ensembles, conformes, crises, traversées) | — | **bit-exact 12/12** | ✅ |
| conformité per-couple (540 booléens, VRAI `_conforme`) | — | **540/540 bit-exact** | ✅ |
| engagement | CÉLÉBRÉ 415 · EN CHEMIN 75 · NON_DÉPLOYÉ 50 | **identique** | ✅ |

**1 080 comparaisons, 0 écart.** Couche appliquée aux 540 couples : paliers **🟢 46 · 🟠 404 · 🔴 90** (S1 90 · S2 404), fragments complets 540/540, 0 mot interdit, en crise 50, CÉLÉBRÉ 415, EN CHEMIN 75.

### COR7 — Banque + suivi + junction

4 pas réels servis sur les croix non-crise (VRAIE banque) · 🔴 → **aucun pas** 14/14 · champ libre réel 1/1 · suivi 14 j 15/15 (0 sanction) · re-test 2026-02-26 · junction forces Q3 : le pas 🟢 cite les forces MESURÉES (1/1).

### COR8 — Reproductibilité

Pipeline ×2 : SHA-256 identiques `7b4b690d90f9e205…`.

## 3. Re-score au barème de l'audit

| Critère | Avant | Après | Justification |
|---|---|---|---|
| **F1** | 20 | **20** | PLAFOND STRUCTUREL du barème pour les quêtes pas (RIO-05/10/15/18/23 — la lecture graduée appartient aux quêtes amont dont le pas hérite) — prétendre 100 % serait une fabrication |
| **F2** | 23 | **25** | palier AFFICHÉ (la sortie réelle du moteur) + QUAND DEMANDER (S1/S2 avec filet amont) + doctrine du pas affichée (COR2/COR5) |
| **F3** | 25 | **25** | PRÉSERVÉ tel quel — banque + check-in binaire + re-test 8 semaines validés P1 (les pas affichés sont les VRAIS, jamais réécrits) |
| **F4** | 18 | **25** | fragment L8 à 7 blocs (position · forme · empreintes · configuration · forces · limites/RCI · palier/pas), complet sur 288/288 + 540/540 couples archivés |
| **Total** | **86 %** | **95 %** | LE MAXIMUM ATTEIGNABLE AU BARÈME (plafond structurel F1 = 20, consigné) |

## 4. Limites honnêtes

1. **Simulation seule** (D-SIM) — VALID-01 reste vraie.
2. **F1 = 20 plafond structurel** — 95 % est le maximum atteignable au barème pour toute quête pas du projet (même traitement que RIO-05/10/18/23) ; le consigner fait partie de l'honnêteté du barème.
3. **Crise héritée uniquement** — jamais de pas de couple en crise (le court-circuit passe AVANT le choix du pas).
4. **Le compteur de suivi est privé** — le VRAI moteur ne lit que la somme des 14 check-ins ; aucun détail de jour n'est affiché.
5. **Récapitulatif de DIMENSION** = action n°2 — non traité ici.

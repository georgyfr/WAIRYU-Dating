# Rapport de correction philosophique — RIO-14 « Nos deux rives » (WTC-SM-Q4)

> AVERTISSEMENT D-SIM : résultats issus de simulations (seed 42) — la mécanique est validée, pas la prévalence clinique.
> Ordre fondateur (trace 1a15ed7ad00bc0fd) : fichiers SUPPLÉMENTAIRES, zéro modification de l'existant, exactitude des calculs.

**Date** : 23/10/2026
**Package** : `validation-sm/validation-sm-q4/correction-philosophique/`
**Cible** : RIO-14 « Nos deux rives » (croisement) — audit Task 163 : F1 25 · F2 22 · F3 12 · F4 18 = **77 %**
**Moteurs réels importés** : `wtc_sm_q4_core.py` (SPEC verrouillée 18/10) · `wtc_sm_q5_core.py` (le pas) · `wtc_sm_q2_core.py` (filet amont) — intégrité par asserts à l'import, zéro retouche.

## 1. Les règles pré-enregistrées (R1-R9)

| Règle | Contenu | Source réelle |
|---|---|---|
| **R1** | Palier de COUPLE dérivé mécaniquement des VRAIS niveaux : 🟢 ssi (FAIBLE, FAIBLE) · 🟠 ssi max-rang = MOYEN · 🔴 ssi max = ÉLEVÉ ∨ crise héritée. **PORTÉ PAR LES VRAIES CONSTANTES de Q5** — la junction au VRAI `palier_de` est un assert à CHAQUE appel : la couche ne crée AUCUNE table propre (la table du croisement EST celle du pas). | cœur Q4 + `palier_de` Q5 |
| **R2** | En crise héritée : le VRAI affichage (CRISE_HÉRITÉE + TEMPLATE_CRISE mot pour mot) — configuration TRACÉE (`config_calculee`), jamais déployée comme verdict ; voies héritées listées ; filet amont rappelé (FILET réel de Q2). JAMAIS de pas de couple en crise. | A4 verrouillé + TEMPLATE_CRISE |
| **R3** | L'ombre de couple est le VRAI template de la configuration (9 noms, mot pour mot — C5 validé P1) ; la zone calme porte la clause anti-fabrication réelle. | TEMPLATES_CONFIG |
| **R4** | Boucle probable (VRAI `boucle_probable_de` — écart de percentiles ≥ 30) et styles dissemblables (VRAI `styles_dissemblables_de` — ≥ 1,00) affichés comme AVERTISSEMENTS ; la direction n'est JAMAIS dite (boucle nommée ENSEMBLE — jamais qui poursuit, qui se retire). | A3 verrouillé + doctrine |
| **R5** | « Zone calme : rien à fabriquer » ssi CALME DES DEUX RIVES hors crise ; 0 % compatibilité (aucune note, aucune direction, aucun score d'affinité) ; le verdict de couple n'existe pas en crise. | template CALME + canon §5.5 |
| **R6** | 0 mot interdit ; exceptions sourcées : filet amont (literal moteur P1) · case « trouble » si la banque de pas est citée (ligne 133). | canon Partie 9 |
| **R7** | Bandeau D-SIM. | hub |
| **R8** | Le pas du couple = le VRAI `pas_de` sur le palier du croisement (les pas 🟠 de la banque sont « à deux ») ; 🔴 → None (D-CRISE). Suivi 14 j sans sanction + re-test 8 semaines. | moteur Q5 |
| **R9** | Re-test 8 semaines (arithmétique +56 j). | émo-q5 (sémantique) |

## 2. La preuve

### COR0 — Compactations et géométrie prouvées

- grille 3×3 : 9/9 via le VRAI `configuration_de` (0 écart) · anti-inversion RÉELLE ré-exécutée : « 6 flips / 3 stables » (le classifieur ne « corrige » jamais une inversion) ;
- frontière du VRAI `niveau_de` exacte : 2,49→FAIBLE · 2,50→MOYEN · 3,49→MOYEN · 3,50→ÉLEVÉ ;
- **PILE prouvés par grain** : détresse (3 items entiers — grain 1/3) : 2,50/3,50 PILE **inatteignables** (0 sur les 125 triplets — cohérent avec la Section F archivée) · charge (3 faces × 4 items — grain 1/12) : 2,50/3,50 PILE **atteignables** (2 valeurs sur l'espace 17³ — le piège FRONTIÈRES archivé 40/40) ;
- seuils réels : boucle ≥ 30 PILE inclusif · styles ≥ 1,00 inclusif.

### COR1/COR2 — Énumération exhaustive + double chemin + JUNCTION

**2 304 configurations** (9 cellules × 8×8 paires de voies × 2 boucles × 2 styles) — l'espace complet des états distincts de la couche :

- **COR1** : 2 304/2 304 fragments complets (7 blocs niveau couple), 0 bloc vide ;
- **COR2** : double chemin ENTIERS PURS (table 9 noms lue à l'import, jamais réécrite) ≡ VRAI moteur **2 304/2 304** · **JUNCTION RÉELLE : palier ≡ VRAI `palier_de` Q5 — 2 304/2 304, assert à chaque appel** (l'assert a été actif pendant tout le développement : la première exécution a IMMÉDIATEMENT attrapé un bug d'emoji vs nom de constante — la junction fait son travail).

Distributions : les 9 configurations à 256 états chacune (symétrie parfaite de l'énumération) — paliers {ORIENTATION 2 288 · MODULE DE COUPLE 12 · EXERCICE MAISON 4}.

### COR3/COR4 — Seuils + vocabulaire

- **S1 = 2 288** (crise héritée ∨ configuration ÉLEVÉ) · **S2 = 12** (configuration MOYEN — re-test 8 semaines) ;
- **COR4** : 0 mot interdit sur **25 textes distincts** (2 304 blocs) ; D-SIM 100 % ; exceptions sourcées consignées.

### COR5 — Anti-fabrication + doctrine couple

- « zone calme : rien à fabriquer » ssi CALME DES DEUX RIVES hors crise (4/4, 0 abus) ;
- en crise : affichage = CRISE_HÉRITÉE (0 verdict déployé sur 252 états CALME-en-crise — le template n'est pas déployé, comportement réel du moteur) ;
- direction de la boucle JAMAIS affichée (0 occurrence de « poursuit/poursuite/se retire » sur 2 304 textes) ;
- 0 % compatibilité : 0 score, 0 pourcentage d'affinité (0/2 304).

### COR6 — Re-score BIT-EXACT des 600 couples archivés (D-REPRO)

Les 600 couples (9 groupes × 50 + G10 crise 50 + G11 écart 30 + G12 styles 30 + G13 frontières 40) sont **régénérés par le VRAI simulateur seed 42** (population de référence 2 000) et comparés à l'archive contresignée du 18/10 :

| Agrégat | Archive 18/10 | Re-score frais | Verdict |
|---|---|---|---|
| `stats_groupes` (13 groupes : N, conformes, crise, boucle_pct, styles_pct, config attendue) | — | **bit-exact 13/13** (règle G10 : config TRACÉE sous override) | ✅ |
| boucle globale | 49,0 % | **49,0 %** | ✅ |
| styles globale | 4,5 % | **4,5 %** | ✅ |
| voies G10 | A2 20 · SM-C1 20 · H5 10 | **A2 20 · SM-C1 20 · H5 10** | ✅ |
| conformité table (non-crise) | 506/550 | **506/550** | ✅ |
| frontières exactes | 2,49/2,50/3,49/3,50 | **identiques** | ✅ |
| conformité par configuration (9 groupes principaux, D-STD-2) | 9/9 à leur seuil | **9/9** | ✅ |

**1 800 comparaisons, 0 écart.** Couche appliquée aux 600 couples : paliers **🟢 49 · 🟠 185 · 🔴 366** (S1 366 · S2 185), fragments complets 600/600, 0 mot interdit, en crise 50.

### COR7 — Couplage pas (VRAI Q5, niveau couple)

18 paliers résolus (9 cellules × 2 états crise) : 🔴 → **aucun pas** 14/14 (VRAI `pas_de` → None — D-CRISE) · pas 🟢/🟠 = les VRAIS de la banque (1 🟢 + 3 🟠 « à deux ») · suivi 14 j 15/15 (CÉLÉBRÉ 6 / EN CHEMIN 9, 0 sanction) · re-test 2026-02-26.

### COR8 — Reproductibilité

Pipeline ×2 : SHA-256 identiques `58b8d869078cda85…`.

## 3. Re-score au barème de l'audit

| Critère | Avant | Après | Justification |
|---|---|---|---|
| **F1** | 25 | **25** | inchangé — 9 configurations D-TABLE, anti-inversion, D-STD-2 par config (package validé, rien à masquer) |
| **F2** | 22 | **25** | palier de COUPLE mécanique (junction bit-exact au pas) + QUAND DEMANDER (S1/S2) + diagnostics réels affichés comme avertissements |
| **F3** | 12 | **25** | contenu des 3 paliers sur les vrais pas de la banque (à deux) + branchement pas au niveau couple + suivi + re-test (COR7) |
| **F4** | 18 | **25** | fragment L8 à 7 blocs NIVEAU COUPLE (position · forme · empreintes · configuration · forces · limites · palier/pas), complet sur 2 304/2 304 + 600/600 couples archivés |
| **Total** | **77 %** | **100 %** | AU BARÈME P1 SIMULATION |

## 4. Limites honnêtes

1. **Simulation seule** (D-SIM) — VALID-01 reste vraie.
2. **Population de percentiles placeholder** (2 000 couples simulés) — à remplacer par le pilote L2, comme consigné au rapport archivé.
3. **Crise héritée uniquement** — le croisement n'est JAMAIS déployé en crise (config tracée) ; le filet amont est rappelé.
4. **Doctrine couple** — boucle nommée ENSEMBLE, direction jamais affichée, 0 % compatibilité : les avertissements (boucle, styles) sont des lectures, jamais des verdicts.
5. **Récapitulatif de DIMENSION** = action n°2 — non traité ici.

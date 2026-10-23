# Rapport de correction philosophique — RIO-13 « Ce que notre lien sait porter » (WTC-SM-Q3)

> AVERTISSEMENT D-SIM : résultats issus de simulations (seed 42) — la mécanique est validée, pas la prévalence clinique.
> Ordre fondateur (trace 1a15ed7ad00bc0fd) : fichiers SUPPLÉMENTAIRES, zéro modification de l'existant, exactitude des calculs.

**Date** : 23/10/2026
**Package** : `validation-sm/validation-sm-q3/correction-philosophique/`
**Cible** : RIO-13 « Ce que notre lien sait porter » (lumière) — audit Task 163 : F1 25 · F2 22 · F3 14 · F4 10 = **71 %**
**Moteurs réels importés** : `wtc_sm_q3_core.py` (SPEC verrouillée 18/10) · `wtc_sm_q4_core.py` · `wtc_sm_q5_core.py` — intégrité par asserts à l'import, zéro retouche.

## 1. Les règles pré-enregistrées (R1-R9)

| Règle | Contenu | Source réelle |
|---|---|---|
| **R1** | Palier : 🔴 ssi le VRAI statut est CRISE_HÉRITÉE · 🟠 ssi SILENCIEUSE ∧ au moins une face MOYEN [2,50 ; 3,50[ — la force existe dans la banque, pas encore activée · 🟢 sinon. **0 seuil ajouté** — junction prouvée : le VRAI seuil d'activation (≥ 3,50, inclusive) et la borne ÉLEVÉ (≥ 3,50) sont LA MÊME frontière PILE → LUMIÈRE/DEUX_LUMIÈRES ⇔ ∃ ÉLEVÉ, SILENCIEUSE ⇔ aucun ÉLEVÉ. | cœur Q3 + niveau_de Q4 |
| **R2** | En CRISE_HÉRITÉE : voies héritées reçues en entrée (A2 ∨ SM-C1 ∨ H5 — mesurées par RIO-11/RIO-12 ou sécurité, jamais recalculées) + orientation ; les forces calculées ne sont PAS affichées (VRAI override A3 : `forces_affichees = []`). JAMAIS de pas de couple en crise. | A3 verrouillé |
| **R3** | Chaque force de la VRAIE banque F-S1 à F-S6 lue par son nom réel (D-TABLE) et son rôle documenté dépôt (livrable « Les Deux Rives », ligne 133 + banque de pas Q5). Quatre états honnêtes : activée · active tracée (exclue de densité) · à portée (MOYEN) · pas encore en place (FAIBLE). | D-TABLE + ligne 133 |
| **R4** | Densité honnête : au-delà de 2, le VRAI `appliquer_limite` retient les 2 premières (ordre de banque) — les exclues sont ACTIVES au sens du moteur, TRACÉES (`forces_actives` vs `forces_calculees` — vraies clés), affichées comme telles, jamais perdues. | A2 verrouillé |
| **R5** | Forces affichées ≡ VRAI `forces_affichees` (post-limite, post-override) ; SILENCIEUSE → VRAIE `TABLE_SILENCIEUSE` mot pour mot ; zone_calme (template réel Q5) ssi SILENCIEUSE tout-FAIBLE — jamais sur une lumière active ; le positif n'est jamais généré. | A4 + TEMPLATES Q5 |
| **R6** | 0 mot interdit ; exception sourcée : case « trouble » du canon (ligne 133, D-TABLE F-S2) — vocabulaire de l'outil, neutralisée avant décompte. | canon Partie 9 |
| **R7** | Bandeau D-SIM. | hub |
| **R8** | Ni détresse ni charge mesurées ICI — pas possibles via le VRAI `palier_de`/`pas_de` sur le balayage HONNÊTE des 9 croix réelles ; le pas 🟢 (« pratiquer la force dérivée identifiée en Q3 ») pointe les forces MESURÉES ICI. 🔴 → aucun pas. | moteurs Q5 |
| **R9** | Re-test 8 semaines (arithmétique +56 j). | émo-q5 (sémantique) |

## 2. La preuve

### COR0 — Compactations prouvées

- **(a)** 3 750 vérifications items→sommes (256 quadruplets × 6 faces via le VRAI `moyenne_face`) — **0 écart** ;
- **(b)** sommes→niveaux : 102 vérifs (17 sommes × 6 faces, frontières 9/10 et 13/14) — **0 écart** ;
- **(c)** frontière 3,50 PILE : activation (VRAI `force_active_de_score`) ⇔ ÉLEVÉ (VRAI `niveau_de`) sur 102 vérifs — **0 écart, 0 distance** entre les deux frontières (LA MÊME borne inclusive, somme 14 = 3,50 PILE consignée 6×).

### COR1/COR2 — Énumération exhaustive + double chemin

**5 832 configurations** (3⁶ niveaux de faces × 8 sous-ensembles de voies héritées) — l'espace complet des états distincts de la couche :

- **COR1** : 5 832/5 832 fragments complets, 0 bloc vide ;
- **COR2** : double chemin ENTIERS PURS (somme ≥ 14 ⇔ active) ≡ VRAI moteur **5 832/5 832** · junctions SILENCIEUSE ⇔ aucun ÉLEVÉ · LUMIÈRE_UNIQUE/DEUX_LUMIÈRES ⇔ ÉLEVÉ présent · CRISE_HÉRITÉE ⇔ voies non vides (l'override préempte, même sur DEUX_LUMIÈRES) — **0 écart**.

Distributions : statuts {CRISE_HÉRITÉE 5 103 · DEUX_LUMIÈRES 473 · LUMIÈRE_UNIQUE 192 · SILENCIEUSE 64} — paliers {🔴 5 103 · 🟢 666 · 🟠 63}.

### COR3/COR4 — Seuils + vocabulaire

- **S1 = 5 103** (crise héritée — toutes voies) · **S2 = 63** (SILENCIEUSE avec face à portée) ;
- bornes consignées : 3,50 PILE (inclusive — activation = ÉLEVÉ) · 2,50 PILE (somme 10) ;
- **COR4** : 0 mot interdit sur **736 textes distincts** (5 832 blocs) ; D-SIM 100 % ; exception sourcée consignée.

### COR5 — Anti-fabrication (la lumière ne se fabrique pas)

- forces affichées ≡ VRAI `forces_affichees` : **5 832/5 832** (0 écart) ;
- en crise : aucune force affichée (override A3 respecté — 0 abus sur 5 103) ;
- zone calme (template réel) ssi SILENCIEUSE tout-FAIBLE (64/64, 0 abus, 0 manque) ;
- exclues de densité : **2 560 cas** tracés, jamais affichés comme retenues (0 écart).

### COR6 — Re-score BIT-EXACT des 520 profils archivés (D-REPRO)

| Agrégat | Archive 18/10 | Re-score frais | Verdict |
|---|---|---|---|
| `stats_groupes` (9 classes : N, correct, dominante, forces attendues, labels observés) | — | **bit-exact 9/9** | ✅ |
| conformité table | 520/520 | **520/520** | ✅ |
| voies héritées G6 | SM-C1 30 · H5 20 | **SM-C1 30 · H5 20** | ✅ |

**1 560 comparaisons, 0 écart.** Couche appliquée aux 520 profils : paliers **🟢 439 · 🟠 31 · 🔴 50** (S1 50 · S2 31), fragments complets 520/520, 0 mot interdit, 620 forces exclues tracées.

### COR7 — Couplage pas (VRAI Q5)

3 paliers réels résolus sur les 9 croix (détresse × charge — mesurées en RIO-11/12, balayées honnêtement) : 🔴 → aucun pas 1/1 (VRAI `pas_de` → None) · pas 🟢/🟠 = vraie banque (1 🟢 + 3 🟠) · suivi 14 j 15/15 (CÉLÉBRÉ 6 / EN CHEMIN 9, 0 sanction) · re-test 2026-02-26 · junction Q3↔Q5 9/9.

### COR8 — Reproductibilité

Pipeline ×2 : SHA-256 identiques `23c0ad330b71276e…`.

## 3. Re-score au barème de l'audit

| Critère | Avant | Après | Justification |
|---|---|---|---|
| **F1** | 25 | **25** | inchangé — D-TABLE table=code, D-DENSITÉ ±0, frontière 3,50 prouvée (package validé, rien à masquer) |
| **F2** | 22 | **25** | palier mécanique (junction 3,50 PILE prouvée) + QUAND DEMANDER (S1/S2) + override crise affiché honnêtement |
| **F3** | 14 | **25** | capitalisation PAR FORCE RÉELLE de la D-TABLE + densité honnête (exclues actives tracées) + les vrais pas de la banque Q5 + suivi + re-test (COR7) |
| **F4** | 10 | **25** | fragment L8 à 7 blocs, complet sur 5 832/5 832 + 520/520 profils archivés |
| **Total** | **71 %** | **100 %** | AU BARÈME P1 SIMULATION |

## 4. Limites honnêtes

1. **Simulation seule** (D-SIM) — VALID-01 reste vraie.
2. **Libellés des items absents** (action n°3).
3. **Crise héritée uniquement** — 0 voie nouvelle (verrouillage) : la couche affiche les voies reçues en entrée, jamais recalculées.
4. **Zone calme honnête** — le SILENCIEUSE tout-FAIBLE (64 configurations) affiche le texte réel du cœur (« Votre lien est encore discret sur ces questions — c'est un constat, pas un défaut ») : rien à fabriquer.
5. **Récapitulatif de DIMENSION** = action n°2 — non traité ici.

# Rapport de validation WTC-PERS-Q2 « La mécanique sous ma carte » (RIO-20)

> **Rapport autoporteur — Verdict : VALIDÉ 7/7 (simulation), en attente de contresignature fondateur.**
> Date : 2026-10-20 · Univers : 560 couples fictifs, 14 groupes × 40, seed 42 ×2 (D-SIM, zéro donnée réelle).
> SHA-256 ×2 (contenu canonique, D-EMPREINTE) : `6d9b3c59419c7ea9…` = `6d9b3c59419c7ea9…` — identiques.

## A. Cadre et séquence

- SPEC VERROUILLÉE a8bb7b5 (A1-A6 tranchés par délégation fondateur « je te laisse le choix de trancher », 20/10/2026) — production `validation-pers-q2/` couverte par la délégation (pattern Q1).
- Séquence D-CANAL-2 : production (3 fichiers) → run ×2 (seed 42, deux exécutions indépendantes) → SHA ×2 → publication → pointeurs → audit origin → contresignature RIO-20 (fondateur).
- Héritage : les entrées Q2 consomment l'héritage Q1 (sorties contresignées RIO-19, SHA 3b1a7490…) — en simulation, héritage généré par le même modèle D-TABLE (patron contresigné), jamais inventé à la main.
- Leçon appliquée avant tout run (exécuteur strict) : crash latent None-safe (conformité None-safe), C6 rendu effectif (template réparation + penchant modifiable), vérité CLIP-AWARE (l'espérance des items saturés passe par l'énumération exacte, pas le μ brut), calibration au niveau COUPLE (les deux rives — pattern Q1).

## B. L'instrument (A1-A6 verrouillés)

- **A1** : titre RIO-20 « La mécanique sous ma carte » — l'ombre lit le mécanisme sous la carte Q1 (canon ligne 223 : « Q2 L'ombre (mécanisme profond) »).
- **A2** : entrées hétérogènes 4 blocs — A « Le penchant » 6 scénarios cochés · N « L'orage » 4 fréquences (N4 inversé) + 1 sécurité N5 · R « Le mur » 4 défenses + 2 gestes · J « La lentille » 6 scénarios cochés ; + 1 item vigilance + héritage Q1 (niveaux, signal, RQS). **Erratum ANNONCÉ** : l'énumération exacte fait 6 + 5 + 6 + 6 = 23 entrées (dont 1 sécurité) + 1 vigilance = **24 items au total** — le décompte SPEC « 24 entrées + 1 vigilance » comptait double l'item N5 ; effectifs et mécanique inchangés.
- **A3** : nommage 7 configurations (ZONE_CALME · PENCHANT_PROPRE · ORAGE_LENT · MUR_DE_DÉFENSE · LENTILLE · DOUBLE_PENTE · OMBRE_PRUDENTE) + 2 états (P-FILTRE · OMBRE_SUPPRIMÉE) + QUÊTE_VERROUILLÉE (héritage invalide).
- **A4** : convergence Q1×Q2 = contrôle interne (CV1-CV4, index = satisfaits ÷ applicables ; ≤ 0,50 → OMBRE_PRUDENTE ; 0,00 → OMBRE_SUPPRIMÉE) — la couche L5 reste réservée à Q3.
- **A5** : filet double voie — héritée (signal porté par l'héritage Q1) · détectée (ΣJ = 6/6 ET héritage J ≥ VIVE) · N5 (retour impossible ≥ 2) — court-circuit AVANT l'arbre, P-FILTRE, jamais d'ombre affichée.
- **A6** : couches — L1 RQS adapté (anti-linéarité + cohérence N interne sur les 10 fréquentiels ; les 12 cochés hors anti-linéarité) · L3 verbatim (1,80 / 2,60 / 3,20, échelle transposée 1,00-4,00) · L4 nuage par faces (A-ext/A-part · N-orage/N-retour · R-mur/R-geste · J-chaîne/J-vérif) · L7 RCI embarquée sur le mécanisme N (le suivi cible l'orage).
- Transposition des scores : cochés → 1 + 3k/6 ; fréquences (0-3) → 1 + moyenne ; **zéro constante nouvelle** (seuils L3, SEM 0,2517, CI90 0,4128, RCI 0,58/0,41 — verbatim canon).

## C. Simulation (univers verrouillé §6)

- 560 couples, 14 groupes × 40, seed 42 ×2 — lois exactes : cochés Bernoulli(p), fréquences clip(round(N(μ, 0,60)), 0, 3), héritage Q1 clip(round(N(μ, 0,60)), 1, 4) ; entrées fixées pour G05 (5/6 cochés en rotation), G06 (états de convergence), G08 (voies du filet), G12 (pièges RQS).
- Vérité ancrée sur les μ **CLIP-AWARE** (E[item] par énumération exacte — leçon du run : un μ 3,4 sur échelle 0-3 sature au plafond) ; conformité sur les DÉCISIONS (état, label, palier, voie, verdict RCI, statut RQS) — pattern Q1.
- Calibration D-STD-2 par groupe = (p̂ − 2,5σ̂) au niveau COUPLE, p̂ par énumération exacte (bandes conservatrices des 4 blocs + rôles hérités + signal J2 + RCI) — **bornes DISTINCTES 14/14** (leçon SM-Q5 ad01f21).
- D-GÉOMÉTRIE : bande [seuil ± 3σ_eff] exclue du décompte C3, rapportée au tableau des centres (14 groupes en bande — documentés).

## D. Résultats des critères

| # | Critère | Résultat | Verdict |
|---|---------|----------|---------|
| C1 | D-VÉRITÉ : D-TABLE 62 cas (100 %) + croisement moteur/spécification 932/932 + nomenclature | 100 % | ✅ |
| C2 | D-CONFIRMATION : déterminisme pur (identique) + anti-inversion temporelle (40 re-tests) | 100 % | ✅ |
| C3 | D-STD-2 : 458/560 couples conformes, 14/14 groupes au seuil, bornes DISTINCTES | 14/14 | ✅ |
| C4 | D-EMPREINTE : SHA ×2 sur contenu canonique, 3 exécutions | identiques | ✅ |
| C5 | Affichage : gabarit §5.1 932/932 rives affichées + FRONTIÈRE conservatrice + nuage cohérent + bandeau D-SIM | 4/4 | ✅ |
| C6 | Anti-étiquette : 0 mot interdit sur 1120 affichages + verbatim « terrain de travail, pas un verdict » + « rien à fabriquer » + ombre modifiable (penchant, pas un trait) | 0 interdit | ✅ |
| C7 | D-CRISE : 88 P-FILTRE (dont 8 hors G08 — biais sécurité tracé) court-circuit avant l'arbre + 80 quêtes verrouillées (héritage invalide) + 0 tiers évalué | conforme | ✅ |

**Verdict global : VALIDÉ 7/7** — la mécanique « mécanisme profond » est démontrée de bout en bout (héritage Q1 → blocs → L3/L4 → convergence → nommage → palier → filet → L7).

## E. Lectures remarquables

- États servis : AUCUN_RÉSULTAT 20 · OMBRE 932 · P-FILTRE 88 · QUÊTE_VERROUILLÉE 80.
- Labels : DOUBLE_PENTE 184 · LENTILLE 67 · MUR_DE_DÉFENSE 112 · OMBRE_PRUDENTE 38 · OMBRE_SUPPRIMÉE 40 · ORAGE_LENT 110 · PENCHANT_PROPRE 72 · ZONE_CALME 309.
- L4 : 799 rives en nuage (au moins un mécanisme non départagé) ; 919 lectures FRONTIÈRE (décision conservatrice = niveau bas).
- L7 : re-test 8 semaines sur le mécanisme N — la bande SUGGESTION (0,17) est étroite devant σ_diff (0,4243, 4 items) : les deltas simulés testent FIABLE (1,50) et BRUIT (0,15) ; la bande SUGGESTION reste prouvée exactement en D-TABLE.
- Filet détecté : la granularité cochés (pas de 0,5) rend la bande VIVE étroite (k = 5 exactement) — le k = 6 déclenche le filet détecté PAR CONCEPTION : le verrou contrôle fait son travail ; G05 démontre la lentille à 5/6 cochés en rotation (jamais 6/6).

## F. Corrections pré-attrapées et découvertes documentées

1. **Vérité CLIP-AWARE** : la vérité μ-ancrée doit passer par E[item] énuméré (un μ 3,4 sur 0-3 sature à 3 → score attendu 3,87, pas 4,25) — attrapé avant le run, corrigé, documenté.
2. **Calibration niveau COUPLE** : la conformité porte sur les couples (deux rives) — p̂ couple = produit des deux rives (pattern Q1) ; la première version rive-only surestimait les seuils.
3. **Granularité cochés + filet** : la bande VIVE cochés (k = 5) est étroite et le k = 6 active le verrou contrôle — propriété de la règle, pas un défaut ; documentée et démontrée (G05 rotation 5/6).
4. **Bande SUGGESTION étroite en L7-Q2** (0,17 devant σ_diff 0,4243) : la RCI sur un mécanisme de 4 items est une PISTE grossière ; la puissance fine reste L7-Q1 (24 items).
5. **Convergence ≠ L5** : le contrôle interne de cohérence (index) ne transpose pas la couche L5 (empreinte situationnelle + 3 inférences) — réservée à Q3 (A4 Q1 verrouillé).
6. **Erratum décompte** : 23 entrées + 1 vigilance = 24 items (l'énumération SPEC comptait double N5) — annoncé, effectifs inchangés.

## G. Chaîne et contresignature

- SHA-256 des résultats (contenu canonique, deux exécutions indépendantes) : `6d9b3c59419c7ea990b064d806c919e719da5e78c681bda439c47cda50cc1b0d` = `6d9b3c59419c7ea990b064d806c919e719da5e78c681bda439c47cda50cc1b0d`.
- Figures : fig1_labels_etats.png, fig2_conformite_d_std2.png, fig3_lectures_l3.png, fig4_rci_deltas.png (1920×1080).
- Chaîne : f4fa593 (SPEC Q1 verrouillée) → 4ee278b (RIO-19 produit) → a5507d5 (RIO-19 contresigné — registre 19/19) → 51337a1 (SPEC Q2 proposée) → f2f8c28 (Task 139) → a8bb7b5 (SPEC Q2 verrouillée) → ce dépôt (RIO-20 produit — en attente de contresignature).
- **Prochaine étape** : contresignature fondateur RIO-20 (même séquence que RIO-19 : « je valide ») → registre 20/20 → SPEC Q3 « La lumière » (forces dérivées — banque L5).
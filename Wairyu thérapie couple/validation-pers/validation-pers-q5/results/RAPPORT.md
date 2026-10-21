# WTC-PERS-Q5 « Le pas sous ma carte » (RIO-23) — rapport de validation

**Verdict : VALIDÉ 7/7** — 2026-10-20 · 650 rives / 14 groupes (seed 42 ×2) · SHA ×2 d99fb980… IDENTIQUES

## Ce que ce paquet valide
- C1 dérivation pure : 2710 candidats, 100 % traçables (source + cible), 0 libellé hors core, choix hors banque refusé, force calme jamais candidate.
- C2 déterminisme : 0 flip sur 650 ×2 ; frontières série 8/9/10 exactes ; espérance CLIP-AWARE = réalisation (patrons F/FORTE).
- C3 D-STD-2 : bornes DISTINCTES (9 ≠ 0,58 ≠ 0,41) ; zones RCI couvertes : 3 ; 0 non-conformité par groupe.
- C4 empreinte : SHA ×2 identiques.
- C5 gabarit : bandeaux présents sur tous les états non déployés ; éclairage Q4 = affichage seul (règles inchangées).
- C6 anti-sanction : 0 mot interdit ; PERFECT 14/14 célébré sans injonction ; ZERO 0/14 jamais sanctionné ; pile 9/14 dit « pas besoin de viser plus ».
- C7 filet avant arbre : {"PAS_NON_DÉPLOYÉ": 25, "QUÊTE_VERROUILLÉE": 8, "AUCUN_RÉSULTAT": 7} ; rive non synchronisée préservée ; 0 invention.

## États du pas (650 rives)
- LE PAS : 250
- ZONE_CALME : 310
- CARTE_SEULE : 50
- PAS_NON_DÉPLOYÉ : 25
- QUÊTE_VERROUILLÉE : 8
- AUCUN_RÉSULTAT : 7

## Candidats dérivés par famille
- ZONE : 310
- GESTE : 470
- FORCE : 650
- MÉCANISME : 1230
- CARTE : 50

## Leçon consignée (D-HIST)
- La banque n'est JAMAIS vide en mode complet par construction contresignée : une ombre calme soutient retour/geste (faces inverses), une ombre vive offre un désamorçage. La zone calme canon est donc l'état hérité de Q2 (label ZONE_CALME), où le pas zéro est PRINCIPAL et les exercices restent des options — pas une banque vide. La branche défensive (banque vide) reste dans le moteur, jamais atteinte, documentée comme telle.
- Les Δ RCI mesurables par flips d'items (granularité des blocs Q2) sont ±0,25 / ±0,50 / ±0,75 : les trois zones (BRUIT/SUGGESTION/FIABLE) sont couvertes ; la frontière pile 0,58/0,41 est vérifiée par énumération exhaustive (calibration_d_std_2), pas par un profil atterri pile.

## Figures
- fig1_etats.png
- fig2_familles.png
- fig3_checkin.png
- fig4_rci.png

## Séquence D-CANAL-2
production (ce paquet) → run ×2 → SHA ×2 → publication → pointeurs hub/SPEC → audit origin → contresignature fondateur (« je valide ») → registre 23/23, personnalité 5/5.

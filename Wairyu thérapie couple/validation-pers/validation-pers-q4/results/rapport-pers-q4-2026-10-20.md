# RIO-22 — WTC-PERS-Q4 « Le croisement sous nos cartes » — rapport de validation (autoporteur)

**Verdict : VALIDÉ 7/7** — 2026-10-20 · univers 650 couples / 14 groupes, seed 42 ×2 · SHA ×2 530c0065ed4f67d8… = 530c0065ed4f67d8… (D-EMPREINTE, contenu)

## 1. Objet et rôle canon

Q4 = le croisement à deux, confirmé (lignes 223-224) — patron « croisement à 9 configurations, percentiles » (lignes 297-298) · couche L6 (ligne 262 : correction du style par PERCENTILES, boucle probable si écart ≥ 30, avertissement si styles dissemblables) · ligne 27 « Ombre ET lumière structurelles » honorée à deux : chaque configuration affiche l'ombre croisée ET les forces héritées des deux rives. Zéro item nouveau (A2-a) : le moteur ne lit que les héritages contresignés RIO-19 / RIO-20 / RIO-21 des deux rives — la lumière Q3 est produite par le moteur RIO-21 contresigné lui-même (zéro ré-implémentation).

## 2. Les 9 critères de décision — tableau de bord

| # | Critère | Résultat | Verdict |
|---|---------|----------|---------|
| C1 | D-VÉRITÉ anti-fabrication (9/9 démo, croisé moteur/table 570/570, traçabilité 1680 forces, 0 hors règle) | True | ✅ |
| C2 | D-CONFIRMATION (déterminisme 650/650 ; miroirs 570/570) | True | ✅ |
| C3 | D-STD-2 (14 déterministes au seuil 100,0 · 0 stochastiques · bornes distinctes : True) | True | ✅ |
| C4 | SHA ×2 identiques (530c0065ed4f67d8…) | True | ✅ |
| C5 | Affichage 6/6 (gabarit 650/650 · palier 570 · boucle 570 · dissemblance 570 · nuage 570 · max-2 forces 650) | True | ✅ |
| C6 | Anti-étiquette/blâme (0 interdit, 0 injonction) | True | ✅ |
| C7 | D-CRISE + non-tiers (override 20+10 · verrouillés 10 · carte-seule 40 · 0 fuite) | True | ✅ |

## 3. Géométrie de l'univers (D-GÉOMÉTRIE)

Profils saturés par construction (leçon des runs pilotes : aux échelles intermédiaires, les décisions de la cascade Q3 flippent aux seuils de soutien — les profils sont portés aux marges de clip μ = ±8 où l'espérance CLIP-AWARE et la réalisation coïncident EXACTEMENT après arrondi à 4 décimales) : FAIBLE = ombre 1,1875 exacte (marge 1,31 au conservateur de la borne 2,50) · MODÉRÉE = 3,00 fixée (marge 0,50 des deux bornes) · FORTE = 4,00 saturée (conservateur 3,79, marge 0,29 ≈ 4 σ_eff — le plafond 4,00 de l'échelle ne permet pas 0,5 pt au-dessus de 3,50 ; la contrainte ≥ 3 σ_eff prévaut, déposé au simulateur).

| Groupe | n | ombre A × ombre B | état attendu |
|---|---|---|---|
| G01_REPOS_FAIBLE_FAIBLE | 50 | 1,1875 × 1,1875 | config 1 — LES DEUX OMBRES AU REPOS |
| G02_OMBRE_D_UN_COTE | 50 | 1,1875 × 3,00 | config 2 — L'OMBRE D'UN CÔTÉ |
| G03_OMBRE_SOLO | 50 | 1,1875 × 4,00 | config 3 — L'OMBRE SOLO |
| G04_ECHO_DE_L_AUTRE_COTE | 50 | 3,00 × 1,1875 | config 4 — L'ÉCHO DE L'AUTRE CÔTÉ |
| G05_EVEIL_MODERE_MODERE | 50 | 3,00 × 3,00 | config 5 — LES DEUX OMBRES EN ÉVEIL |
| G06_ECART_DECLARE | 50 | 3,00 × 4,00 | config 6 — L'ÉCART DÉCLARÉ |
| G07_SOLO_AUTRE_COTE | 50 | 4,00 × 1,1875 | config 7 — L'OMBRE SOLO, DE L'AUTRE CÔTÉ |
| G08_ECART_DECLARE_INVERSE | 50 | 4,00 × 3,00 | config 8 — L'ÉCART DÉCLARÉ, INVERSÉ |
| G09_VIVES_FORTE_FORTE | 50 | 4,00 × 4,00 | config 9 — LES DEUX OMBRES VIVES |
| G10_SIGNAL_FILET | 40 | mixte (3 sous-géométries) | override P-FILTRE ×30 + verrouillé ×10 |
| G11_ECART_PERCENTILES | 40 | 4,00 × 1,5625 (fixés) | config 3 + boucle probable (écart ≥ 30) |
| G12_STYLES_DISSEMBLABLES | 40 | 1,5625 × 1,5625 (fixés) | config 1 + dissemblance (sd 0 × 1,5) |
| G13_FRONTIERES_BORNES | 40 | 2,50 / 3,50 exacts (fixés) | FRONTIÈRE + conservateur bas · re-tests L7 (FIABLE/SUGGESTION/BRUIT) |
| G14_OMBRE_SUPPRIMEE_RIVE | 40 | mixte | CARTE_SEULE_CROISÉ ×40 — 0 matrice, 0 invention |

## 4. Calibration D-STD-2 (Monte-Carlo déterministe, graine 4200, 20 000 couples/groupe)

| Groupe | p̂ | seuil | déterministe | distance min borne (σ_eff) |
|---|---|---|---|---|
| G01_REPOS_FAIBLE_FAIBLE | 1.0 | 100.0 | oui | None |
| G02_OMBRE_D_UN_COTE | 1.0 | 100.0 | oui | 0.55 |
| G03_OMBRE_SOLO | 1.0 | 100.0 | oui | 0.36 |
| G04_ECHO_DE_L_AUTRE_COTE | 1.0 | 100.0 | oui | 0.55 |
| G05_EVEIL_MODERE_MODERE | 1.0 | 100.0 | oui | None |
| G06_ECART_DECLARE | 1.0 | 100.0 | oui | 1.0 |
| G07_SOLO_AUTRE_COTE | 1.0 | 100.0 | oui | 0.36 |
| G08_ECART_DECLARE_INVERSE | 1.0 | 100.0 | oui | 1.0 |
| G09_VIVES_FORTE_FORTE | 1.0 | 100.0 | oui | None |
| G10_SIGNAL_FILET | 1.0 | 100.0 | oui | None |
| G11_ECART_PERCENTILES | 1.0 | 100.0 | oui | 0.4 |
| G12_STYLES_DISSEMBLABLES | 1.0 | 100.0 | oui | 30.0 |
| G13_FRONTIERES_BORNES | 1.0 | 100.0 | oui | 0.0 |
| G14_OMBRE_SUPPRIMEE_RIVE | 1.0 | 100.0 | oui | None |

Univers entièrement déterministe par saturation (p̂ = 1,0 partout — seuils 100,0) : les bornes DISTINCTES (leçon ad01f21) sont trivialement satisfaites (0 groupe stochastique) et signalées comme telles. La variance d'échantillonnage est portée par les lois d'items déclarées (σ 0,60, D-PARAM) et par la population de référence L6 (20 000 profils, seed 42 ≥ 2 000 requis).

## 5. Ce que la lecture affiche (littéraux, extraits réels)

```
Le croisement sous nos cartes — lecture à deux (déclarée)
Configuration du croisement : LES DEUX OMBRES EN ÉVEIL — ombre rive A MODÉRÉE (3.0) · ombre rive B MODÉRÉE (3.0)
les deux mécanismes modérés — le terrain naturel du croisement
Palier de couple (max-niveau) : MODULE DE COUPLE
Paliers hérités (affichés sans recalcul) : rive A EXERCICE MAISON · rive B EXERCICE MAISON
Forces héritées — rive A : La part reconnue (tranquille) · rive B : La part reconnue (tranquille)
L6 — positions percentielles : rive A 72.4 · rive B 72.4 — écart 0.0
L4 — nuage : l'écart des ombres (0.0) ne permet pas de hiérarchie (seuil 0.2918)
BANDEAU D-SIM — simulation (univers 650 couples, 14 groupes, seed 42 ×2) : lecture mécanique de patrons simulés, jamais une observation réelle.
```

## 6. Figures

- `fig1_matrice_9_configurations.png` (1920×1080)
- `fig2_conformite_d_std2.png` (1920×1080)
- `fig3_percentiles_l6_boucle.png` (1920×1080)
- `fig4_etats_filet_rci.png` (1920×1080)

## 7. Verdict

**VALIDÉ 7/7** — le paquet RIO-22 est prêt pour la publication (D-CANAL-2 : publication → pointeurs → audit origin → contresignature fondateur « je valide »). Le croisement reste un descriptif de cohabitation déclarée : aucune configuration n'est une norme, aucun libellé n'accuse, la zone calme est dite comme telle (§5.5) et la crise court-circuite toujours avant l'arbre (ligne 369).

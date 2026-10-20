# SPEC — WTC-PERS-Q4 « Le croisement sous nos cartes » (RIO-22) — VERROUILLÉE

> **VERROUILLÉE le 20/10/2026 — arbitrages A1-A6 tranchés par délégation fondateur (« je te laisse le choix de trancher », 20/10/2026, prononcée après la clôture Q3 — pattern Q1/Q2/Q3) : A1-a · A2-a · A3-a · A4-a · A5-a · A6-a — le choix recommandé partout. Titre verrouillé : « Le croisement sous nos cartes » (A1-a). Demande fondateur explicite « pousse tout progressivement sur github » : pushes progressifs à chaque étape.**
> Rôle canon (§5.3, lignes 223-224) : « Q4 Le croisement (à deux, confirmé) » ; patron mécanique (lignes 297-298) : « Q4 (croisement à 9 configurations, percentiles) ». Quête 4/5 de la dimension Personnalité (A6 Q1 verrouillé : RIO-19 → RIO-23).
> Q1 « Manuel d'utilisation de moi » (RIO-19) : ✅ PRODUIT & CONTRESIGNÉ (VALIDÉ 7/7, SHA ×2 3b1a7490…, « je valide » fondateur 20/10).
> Q2 « La mécanique sous ma carte » (RIO-20) : ✅ PRODUIT & CONTRESIGNÉ (VALIDÉ 7/7, SHA ×2 6d9b3c59…, « je valide » fondateur 20/10) — registre 20/20.
> Q3 « La lumière sous ma carte » (RIO-21) : PRODUIT (VALIDÉ 7/7, SHA ×2 7644a957…, en attente de contresignature fondateur — registre ⏳).
> **Première quête du croisement à deux de la dimension** : Q4 lit les héritages contresignés des DEUX rives — pour chacune : Q1 (carte) + Q2 (ombre) + Q3 (lumière) — première quête du pipeline à six héritages. Canon ligne 27 : « Ombre ET lumière structurelles : chaque résultat contient les deux » — structurellement honorée au niveau couple : chacune des 9 configurations affiche l'ombre croisée ET les forces des deux rives.
> **Couche réservée (A4-Q3 verrouillé)** : Q4 est la quête de la couche **L6** (ligne 262) — « Couple par PERCENTILES (correction du style de réponse) · boucle probable si écart de percentiles ≥ 30 · avertissement si styles dissemblables » — reportée ici par l'arbitrage A4-Q3 (report ≠ abandon ; divergence avec l'annotation A4 Q1 documentée D-HIST Q3 §7).
> **PRODUCTION (D-CANAL-2, 20/10)** : package `validation-pers-q4/` — core (croisement 9 configurations, L6 percentiles + boucle + dissemblance, 3 inférences croisées, filet 4 états, RCI ombre) · simulateur (650 couples / 14 groupes, profils saturés μ = ±8 — espérance CLIP-AWARE et réalisation coïncident exactement après arrondi, zéro dérive ; population de référence L6 20 000 profils seed 42) · validation C1-C7. **Verdict VALIDÉ 7/7** — C1 (9/9 démo, croisé moteur/table 570/570, 1 680 forces tracées, 0 hors règle) · C2 (déterminisme 650/650 + anti-inversion 570/570 miroirs) · C3 14/14 au seuil (14 déterministes 100,0 — 0 stochastique, bornes DISTINCTES trivialement satisfaites et signalées) · C4 SHA ×2 530c0065… · C5 affichage 6/6 · C6 0 interdit / 0 injonction · C7 override 20+10, verrouillés 10, carte-seule 40, 0 fuite. Précisions de verrouillage déposées au core : (1) lecture du niveau de croisement avec intervalle → FRONTIÈRE nommée + décision conservatrice (pattern L3) ; (2) palier de couple max-niveau, une règle zéro exception ; (3) styles dissemblables via la machinerie L4 transposée aux dispersions des 8 faces Q1 (SE ≈ s/√(2×7) — zéro constante) ; (4) L7 posé sur l'ombre globale avec SE_diff propagé √2 × SE_og (deltas 0,58/0,41 verbatim) — le re-test porte sur l'ombre (construit Q2, re-passe Q2) ; (5) géométrie saturée (leçon des runs pilotes : aux échelles intermédiaires les décisions de la cascade Q3 flippent aux seuils de soutien — profils portés aux marges de clip, plafond 4,00 : la contrainte ≥ 3 σ_eff prévaut sur 0,5 pt pour la classe FORTE) ; (6) RQS croisement = min(RQS Q3 des deux rives) − pénalités drapeaux (garde mathématique de transparence).
> Chaîne locale : … → abf5c83 (RIO-20 contresigné — registre 20/20) → cbfd193 (SPEC Q3 PROPOSÉE) → 35cb049 (Task 142) → 7e05861 (SPEC Q3 VERROUILLÉE — délégation fondateur) → 0716e85 (RIO-21 produit — VALIDÉ 7/7, SHA ×2 7644a957…) → 0c202e4 (pointeurs RIO-21 — pushes progressifs Task 143) → eb78438 (SPEC Q4 PROPOSÉE) → 28496dd (Task 144) → 1458b9c (présente SPEC — VERROUILLÉE, délégation fondateur A1-A6 → (a)×6) → **f64be92 (RIO-22 produit — VALIDÉ 7/7, SHA ×2 530c0065ed4f67d8…, en attente de contresignature)**. (Note D-LECTURE : reset d'environnement entre Task 143 et la présente — clone local retombé à a5507d5, restauré par fetch + fast-forward pur vers origin/main = 0c202e4, zéro perte, preuve ls-remote ; paramiko réinstallé.)

---

## 1. Type de quête et rôle

**Q4 = LE CROISEMENT (à deux, confirmé)** — `programme wairyu couple.txt` §5.3, lignes 223-224 : « Q4 Le croisement (à deux, confirmé) » ; lignes 297-298 : « Q4 (croisement à 9 configurations, percentiles) ».

**Ce que Q4 fait.** Q1 a mesuré le grain déclaré (carte), Q2 le mécanisme (ombre), Q3 la lumière dérivée — chacun côté rive. Q4 met les DEUX mécanismes profonds côte à côte et lit leur cohabitation déclarée : comment l'ombre d'une rive croise l'ombre de l'autre, avec les forces de chacune affichées au même niveau (ligne 27 — ombre ET lumière structurelles, désormais à deux). Il produit : (1) la **configuration du croisement** (9 configurations, 3 × 3, nommées, patrons miroir) ; (2) la **lecture L6** (ligne 262 verbatim : percentiles de correction du style, boucle probable si écart ≥ 30, avertissement si styles dissemblables) ; (3) le **palier de couple** (§5.4, max-niveau croisé — mécanique pure) ; (4) les **3 inférences croisées** (L5 transposée au couple — descriptif causal, propositions contestables, jamais des faits).

**Ce que Q4 n'est pas** : une nouvelle mesure (zéro item nouveau — le croisement re-lit ce qui est déjà mesuré et contresigné, pattern EXT-Q2-A2/SM-Q4-A2) ; un verdict sur qui « bloque » ou qui « devrait » (C6 — la configuration décrit une cohabitation déclarée, jamais n'accuse) ; une norme du « bon couple » (aucune configuration n'est présentée comme l'idéal à atteindre — la zone calme est dite comme telle, §5.5, sans être valorisée en mérite) ; une évaluation du partenaire par inférence (ligne 363 : le croisement juxtapose DEUX déclarations volontaires — chaque rive a passé ses propres quêtes) ; un remplacement du module app à deux (le croisement le nourrit sans le remplacer).

**Entrées (première quête à six héritages — 2 rives × 3 quêtes)** : pour chaque rive, les sorties contresignées de ses propres Q1 (axes AO/N/R/J, faces, RQS, éventuel signal sécurité), Q2 (4 mécanismes, gestes, faces lumière, convergence CV, état OMBRE/P-FILTRE/OMBRE_SUPPRIMÉE, palier) et Q3 (état LUMIÈRE/CARTE_SEULE, banque de forces — principales + calmes, drapeaux RQS). Patterns des quêtes à héritage : RIO-02 lit sA/sB ; RIO-07 converge avec RIO-01/02 ; RIO-20 lit l'héritage RIO-19 ; RIO-21 lit l'héritage RIO-19+RIO-20 ; RIO-17 (EXT-Q2) croise les héritages des deux rives. En simulation, les six héritages sont générés par le même modèle D-TABLE (patrons : sorties contresignées RIO-19, RIO-20, RIO-21).

---

## 2. Architecture de l'instrument (A2-a / A3-a VERROUILLÉS)

**Option A2-a VERROUILLÉE : zéro item nouveau.** Le croisement est une lecture, pas une mesure : L5 (ligne 261) définit déjà l'empreinte comme un croisement de sorties existantes et le patron EXT-Q2 (RIO-17, contresigné) l'a appliqué à deux rives. Les entrées sont les héritages contresignés des deux rives ; les opérations sont celles déjà canoniques : moyenne des blocs (ombre globale), inversion déjà portée par Q2 (transposition 1,00-4,00), propagation d'incertitude par quadrature (1,64 × √(SE₁² + SE₂²), ligne 260), percentiles sur population de référence (L6, ligne 262). Zéro constante nouvelle hors bornes de croisement calibrées (voir A3).

**La grandeur croisée (A3-a VERROUILLÉ)** : l'**ombre globale** de chaque rive — moyenne des 4 mécanismes Q2 (A penchant / N orage / R mur / J lentille, scores transposés 1,00-4,00, opération moyenne déjà canonique). L'ombre est le rôle canon de Q2 (« mécanisme profond », ligne 223) : le croisement à deux lit la cohabitation des deux mécanismes profonds, pas des agrégats composites. SE de l'ombre globale = SE/2 (moyenne de 4 scores, quadrature) ; CI 90 % = 1,64 × SE_og.

**Niveaux de croisement** : **Faible < 2,50 ≤ Modérée < 3,50 ≤ Forte** — bornes de croisement PROPRES (patron EXT-Q2-A3/SM-Q4-A1 : une mesure garde un seul rôle ; les 4 niveaux L3 Discrète/Tranquille/Vive/Forte restent l'affichage individuel de la carte, jamais recalculés ici).

**Les 9 configurations (3 × 3)** — noms VERROUILLÉS (A5-a), patrons miroir, labels uniques (D-NOMENCLATURE) :

| # | Nom VERROUILLÉ (A5-a) | Ombre rive A | Ombre rive B | Lecture verrouillée |
|---|---|---|---|---|
| 1 | LES DEUX OMBRES AU REPOS | Faible | Faible | les deux mécanismes discrets — zone calme dite comme telle (§5.5), rien à fabriquer |
| 2 | L'OMBRE D'UN CÔTÉ | Faible | Modérée | le mécanisme profond se déclare d'une seule rive, à intensité modérée |
| 3 | L'OMBRE SOLO | Faible | Forte | tout le mécanisme profond porté par une rive — asymétrie affichée en avertissement, en lecture descriptive |
| 4 | L'ÉCHO DE L'AUTRE CÔTÉ | Modérée | Faible | miroir de la 2 — le mot distinct prime sur la symétrie (D-NOMENCLATURE) |
| 5 | LES DEUX OMBRES EN ÉVEIL | Modérée | Modérée | les deux mécanismes modérés — le terrain naturel du croisement |
| 6 | L'ÉCART DÉCLARÉ | Modérée | Forte | un écart d'intensité déclaré entre les deux ombres — descriptif causal |
| 7 | L'OMBRE SOLO, DE L'AUTRE CÔTÉ | Forte | Faible | miroir de la 3 — unicité des labels prime sur la symétrie |
| 8 | L'ÉCART DÉCLARÉ, INVERSÉ | Forte | Modérée | miroir de la 6 |
| 9 | LES DEUX OMBRES VIVES | Forte | Forte | les deux mécanismes forts — palier 🔴 par max-niveau mécanique, vigilance maximale |

Noms décrivant des **vécus déclarés comparés** — jamais une trajectoire, jamais une position temporelle, jamais un rôle coupable (C6 ; « écart déclaré » = intensités déclarées différentes, rien d'autre).

**Ombre ET lumière à chaque configuration (ligne 27, structurelle à deux)** : chaque configuration affiche en outre les forces héritées Q3 de chaque rive (max 2 principales par rive — pattern RIO-13, re-affichées sans re-nivellement) — le croisement lit l'ombre et montre la lumière des mêmes réponses ; aucune force n'est créée au niveau couple (les forces restent des héritages rive — une mesure un rôle).

**Le palier de couple (§5.4 — mécanique pure)** : palier = **max-niveau croisé** — max(niveau ombre rive A, niveau ombre rive B), une règle, zéro exception (leçon Q5-A3/Q1-A4) : 🟢 ⟺ les deux rives FAIBLES → exercice maison ; 🟠 ⟺ au moins une MODÉRÉE (aucune FORTE) → module de couple ; 🔴 ⟺ au moins une FORTE → orientation (« le chemin le plus court, pas un échec ») ; signal sécurité (filet §4) → 🔴 orientation — court-circuit AVANT l'arbre (override).

Options rejetées dans la recommandation : A2-b mini-grille de confirmation à deux (exigerait son propre cycle RIO pour un gain marginal — disproportion) ; A2-c mesure conjointe nouvelle (refait une carte à deux — contredit le patron croisement) ; A3-b croisement sur l'axe R seul (réparation — perd la profondeur des 4 blocs, le rôle canon de Q2 est l'ombre entière) ; A3-c agrégat ombre+lumière composite (crée un construit nouveau, casse « une mesure un rôle »).

---

## 3. L6 : percentiles, boucle, dissemblance (A4-a VERROUILLÉ — ligne 262)

**L6 verbatim structurelle (ligne 262)**, trois composantes :
1. **Correction du style par PERCENTILES** : chaque ombre globale est re-exprimée en percentile dans une population de référence simulée (seed 42, ≥ 2 000 profils — calibrage fin LIBRE) ; la lecture par position corrige les styles de réponse déclarés entre rives.
2. **Boucle probable si écart de percentiles ≥ 30** : avertissement affiché, jamais un verdict, jamais une attribution de rôle (« c'est lui/elle » interdit — C6).
3. **Avertissement si styles dissemblables** : styles de réponse hérités (dispersion des réponses de chaque rive) ; règle de dissemblance par la machinerie L4 transposée aux dispersions (écart ≥ 1,64 × √(SE₁² + SE₂²) — zéro constante nouvelle) ; la lecture corrigée par percentiles s'affiche sous la configuration avec bandeau quand un avertissement est actif.

**L5 transposée — les 3 inférences croisées (libellés VERROUILLÉS mot pour mot)** — descriptif causal, sans injonction, propositions contestables (garde-fou non-normativité hérité de « l'utilisateur valide/conteste chaque proposition ») ; l'objectif reconnaissance canon (lignes 271-273, « ça te ressemble ? » ≥ 70 %) reste posé sur les lectures individuelles ; proxy simulation des croisées = couverture de règles vraies :

| Inférence croisée | Règle verrouillée (héritages uniquement) | Ce que c'est (descriptif causal) |
|---|---|---|
| **L'orage à deux vitesses** | orage marqué chez les deux rives (bloc N ≥ Vive) ET écart des blocs N ≥ 1,00 | le conflit ne monte pas au même rythme déclaré des deux côtés |
| **Le mur face au mur** | mur marqué chez les deux rives (bloc R ≥ Vive) | la descente de garde attend deux gestes — personne ne l'offre spontanément |
| **Le geste qui ouvre** | geste de réparation présent chez une rive (héritage Q2 gestes / lumière R) ET mur marqué chez l'autre | le geste d'une rive ouvre la porte que l'autre tient |

Zéro inférence hors règle (C1). Les noms canon L5 individuels (« alarme intérieure, mains libres, le près coûte », ligne 261) restent la propriété de Q3 — non re-émis ici (D-NOMENCLATURE ; pattern EXT-A4 : les inférences individuelles ne se transposent pas verbatim, le croisement a ses propres règles).

---

## 4. D-CRISE et filet de sécurité

Le filet global s'applique (ligne 369 : « 9 signaux spécialisés par dimension → P-FILTRE → 3919/3114/15/112 + associations »), court-circuit AVANT l'arbre. **Q4 n'a zéro item propre → aucune voie détectée nouvelle** (zéro constante nouvelle) — quatre états hérités :

1. **Override filet à deux** (pattern SM-Q4-A4/EXT-§4) : si l'UNE des deux rives porte un signal hérité (Q1 signal sécurité OU Q2 P-FILTRE OU Q3 P-FILTRE), l'affichage Q4 est **routé 🔴 « orientation »** — la configuration est calculée et tracée, mais **jamais déployée comme lecture de couple sur une crise active** (hub D-CRISE : JAMAIS de croisement de couple en crise). Routage sécurité 100 % (lignes 271-273).
2. **HÉRITAGE_INVALIDE** (RQS héritée d'une rive < 70 — ligne 257 : « INVALIDE, aucun résultat ») → croisement verrouillé pour le couple, message d'état, aucune configuration — on ne croise pas une carte invalide.
3. **OMBRE_SUPPRIMÉE** (convergence 0,00 d'une rive — héritage Q2) → **mode carte-seule croisé** : la matrice d'ombre n'est pas calculée pour cette rive ; affichage des deux cartes + forces disponibles avec bandeau « croisement limité » — jamais d'invention de l'ombre manquante (§5.5).
4. **Croisement régulier** : les 9 configurations + L6 + palier + inférences croisées.

**Non-évaluation du partenaire (ligne 363)** : le croisement n'évalue JAMAIS une rive par inférence sur l'autre — il juxtapose deux ensembles de déclarations volontaires ; l'app observe le nous déclaré, jamais le tu inféré (Partie 4). RQS croisement = min(RQS rive A, RQS rive B) − pénalités drapeaux (alignées canon 257) : ≥ 85 OK · 70-85 PRUDENCE (bandeau) · < 70 INVALIDE.

---

## 5. Les 7 critères Q4-PERS (libellés VERROUILLÉS — C1-C7)

| # | Critère | Exigence | Type |
|---|---------|----------|------|
| **C1** | D-VÉRITÉ anti-fabrication : 9/9 configurations démontrées par le moteur, labels uniques, croisé moteur/table (D-TABLE) ; chaque configuration affiche ombre ET lumière des vraies réponses des deux rives (ligne 27 structurelle à deux) ; traçabilité — toute force re-affichée pointe ses sources héritées ; sens inverse — aucune force sans sources (§5.5), aucune inférence croisée hors règle | 9/9 + croisé 100 % + double sens | ÉLIMINATOIRE |
| **C2** | D-CONFIRMATION : configuration = f(ombre rive A, ombre rive B) pure et déterministe — même paire d'héritages → même config, **0 inversion des rives** (le niveau de chaque rive vient de ses propres sorties contresignées) | 100 % déterministe + 0 inversion | ÉLIMINATOIRE |
| **C3** | D-STD-2 : seuil de conformité PAR groupe simulé (bornes DISTINCTES — leçon ad01f21 : distinctes entre groupes, double comptage vérifié) | 14/14 au leur | ÉLIMINATOIRE |
| **C4** | SHA ×2 (D-EMPREINTE : SHA sur contenu, pas horodatage) | 2 valeurs brutes identiques | — |
| **C5** | Affichage : gabarit §5.1 ×9 + palier max-niveau + boucle probable avertie (écart ≥ 30) + dissemblance avertie + nuage L4 (hiérarchie seulement si écart ≥ 1,64√(SE²+SE²)) + bandeau D-SIM + littéraux autoporteurs + forces max 2 par rive (RIO-13) | 6/6 | — |
| **C6** | Anti-étiquette et anti-blâme À DEUX : 0 diagnostic / 0 étiquette / 0 mot canon clinique affiché (vocabulaire écran 355-356) · 0 blâme (« qui bloque », « qui devance », attribution de rôle interdites) · 0 norme du « bon couple » · 0 injonction · zone calme (config 1) dite comme telle · 0 flatterie inventée (double sens §5.5) | 0 étiquette + 0 blâme + 0 injonction | ÉLIMINATOIRE |
| **C7** | D-CRISE + non-évaluation + non-tiers : override filet avant croisement testé (§4, 4 états) · 0 mesure du partenaire par inférence (ligne 363 — deux déclarations volontaires) · HÉRITAGE_INVALIDE → verrouillé · OMBRE_SUPPRIMÉE → carte-seule croisé tracé, 0 invention · 0 tiers évalué | 0 tiers + override testé + 0 invention | ÉLIMINATOIRE |

**Leçons appliquées** : SM-Q4 (patron croisement : 9 configurations, percentiles, override, zéro item nouveau) · EXT-Q2 (croisement symétrique à deux — anti-inversion, bornes propres, L6 structurelle, noms miroir) · ad01f21 (bornes D-STD-2 DISTINCTES) · RIO-13 (limite deux forces) · Q3 (ombre ET lumière structurelles ; anti-fabrication double sens) · Q5-A3 (une règle, zéro exception — palier max-niveau) · D-GÉOMÉTRIE (centres ≥ 0,5 pt des bornes 2,50/3,50 et ≥ 3σ_eff des deux côtés ; bande [seuil ± 3σ_eff] exclue du décompte C3, tableau de robustesse) · ligne 363 (non-évaluation du partenaire) · D-NOMENCLATURE (unicité des 9 labels, vérifiée contre les registres publiés, reconduite mécaniquement au C1).

---

## 6. Simulation (univers VERROUILLÉ — profils exacts déposés au simulateur)

- **650 couples, 14 groupes** (cohérence Q1-Q3 ; seed 42 ×2) : 9 configurations × 50 (G01-G09, une par cellule 3×3) · **SIGNAL_FILET** (une rive porte un signal hérité → override 🔴, configuration tracée non déployée ; variants HÉRITAGE_INVALIDE tracés — 40) · **ÉCART_PERCENTILES** (écart ≥ 30 → boucle probable avertie, verdict inchangé — 40) · **STYLES_DISSEMBLABLES** (dispersions écartées → avertissement + lecture corrigée percentiles — 40) · **FRONTIÈRES_BORNES** (ombre globale pile sur 2,50/3,50 → tranchage déterministe vérifié — 40) · **OMBRE_SUPPRIMÉE_RIVE** (convergence 0,00 d'une rive → carte-seule croisé, bandeau, 0 invention — 40). Total 650.
- Héritages simulés par le même modèle D-TABLE (patrons : sorties contresignées RIO-19 SHA 3b1a7490…, RIO-20 SHA 6d9b3c59…, RIO-21 SHA 7644a957…) — cohérence carte/ombre/lumière paramétrée par groupe, bruit items σ 0,60 (D-PARAM), mode espérance CLIP-AWARE (vérification de dérive : vérité = moteur sur espérances, zéro dérive).
- Géométrie : centres des groupes ≥ 0,5 pt des bornes 2,50/3,50 et ≥ 3σ_eff des deux côtés (D-GÉOMÉTRIE) ; classification_vraie ancrée sur les paramètres vrais ; seuils D-STD-2 DISTINCTS par groupe (14), calibrés binomial ; calibration MC déterministe (graine 4200, 20 000 couples/groupe).
- Population percentiles (L6) : seed 42, ≥ 2 000 profils (calibrage fin LIBRE — 20 000 visé pour la stabilité).

---

## 7. D-HIST : confrontation fondation

- **Patron direct : EXT-Q2 (RIO-17, contresigné)** — croisement à deux, 9 configurations 3×3, percentiles, override, zéro item nouveau, bornes propres, noms miroir. Différence : EXT croise un axe unique (H) ; PERS-Q4 croise l'**ombre globale** (moyenne des 4 mécanismes — le rôle canon de Q2, « mécanisme profond », ligne 223) et attache les forces Q3 à chaque configuration (ligne 27 — ombre ET lumière, absente du patron EXT car la Générationnelle n'a pas de quête lumière avant son Q2). SM-Q4 (RIO-14) reste le patron asymétrique (détresse × charge) — PERS-Q4 est symétrique par construction (mêmes héritages des deux rives) : l'anti-inversion C2 garantit que chaque niveau vient de sa propre rive.
- **L6 entre ici (ligne 262)** — « Couple par PERCENTILES » a pour objet le couple ; reportée en Q3 par l'arbitrage A4-Q3 (documenté D-HIST Q3 §7, divergence avec l'annotation A4 Q1 « L5-L6 réservées à Q3 ») — le report ≠ abandon : Q4 est la quête structurelle de L6.
- **Ligne 27 au niveau couple** : « chaque résultat contient les deux » — les 9 configurations portent chacune l'ombre croisée ET les forces des deux rives ; la lumière n'est jamais nivelée au couple (les forces restent des héritages rive — une mesure un rôle).
- **Les 12 configurations individuelles (lignes 266-270 : « chacune avec ombre ET force affichées »)** restent le registre individuel des sorties (Q1-Q3) ; Q4 croise à 9 selon le patron dédié (lignes 297-298) — les deux patrons coexistent sans fusion (D-NOMENCLATURE).
- **L8 (ligne 264)** : l'assemblage des 7 blocs cite « couple » parmi eux — la place de Q4 est canonique (« position · forme · empreinte · **couple** · force · limites · palier/pas »).
- **Les paliers §5.4 (lignes 227-231)** : le croisement lit le max-niveau croisé — le palier de chaque rive reste l'affichage individuel hérité (jamais recalculé ici — leçon Q5-A3).
- **Non-évaluation (ligne 363)** et **vocabulaire écran (355-356)** : le croisement est le point le plus exposé du pipeline au blâme (« c'est lui/elle le problème ») — C6 verrouille ; les libellés décrivent des cohabitations déclarées, jamais des coupables.
- **Le livrable de dimension** (« Manuel d'utilisation de moi », ligne 98) reste Q1 ; le croisement nourrit le module app à deux sans nouveau livrable (D-NOMENCLATURE — pattern EXT-Q2).
- **Frontières** : avec Q3 (les forces restent affichées par rive, jamais re-nivelées) ; avec Q5 (le pas partira de la lecture croisée sans la « réparer ») ; avec EXT-Q2 (métaphores distinctes — ombre/mécanique vs horloges/rives ; unicité des 9 labels vérifiée contre tous les registres publiés, reconduite au C1) ; avec RIO-14 (patron asymétrique — PERS-Q4 symétrique).

---

## 8. Mapping RIO (position dans la dimension)

> **État RIO-22 : PRODUIT (f64be92)** — package `validation-pers-q4/` publié (core · simulateur · validation, run ×2 SHA ×2 530c0065ed4f67d8…, verdict VALIDÉ 7/7), en attente de la contresignature fondateur (« je valide ») → registre 21/22, personnalité 4/5 contresignée après « je valide » sur RIO-21 et RIO-22.

| Quête | RIO | Rôle | État |
|-------|-----|------|------|
| Q1 « Manuel d'utilisation de moi » | **RIO-19** | La carte (mesure) — 4 axes AO/N/R/J | ✅ PRODUIT & CONTRESIGNÉ (VALIDÉ 7/7, SHA ×2 3b1a7490…) |
| Q2 « La mécanique sous ma carte » | **RIO-20** | L'ombre (mécanisme profond — ligne 223) | ✅ PRODUIT & CONTRESIGNÉ (VALIDÉ 7/7, SHA ×2 6d9b3c59…, « je valide » fondateur 20/10) |
| Q3 « La lumière sous ma carte » | **RIO-21** | La lumière (forces dérivées — ligne 223) · L5 (ligne 261) | **PRODUIT (VALIDÉ 7/7, SHA ×2 7644a957…, en attente de contresignature)** |
| **Q4 « Le croisement sous nos cartes » (A1-a)** | **RIO-22** | **Le croisement (à deux, confirmé — lignes 223-224) · L6 (ligne 262)** | **PRODUIT (VALIDÉ 7/7, SHA ×2 530c0065…, « en attente de contresignature »)** |
| Q5 — titre à la SPEC Q5 | RIO-23 | Le pas (1 changement + suivi 14 j, 9/14 — lignes 224, 297-298) — SPEC à venir | à venir |

---

## 9. Arbitrages (A1-A6 — TRANCHÉS 20/10/2026 par délégation fondateur : (a)×6)

- **A1 — Titre de RIO-22 [TRANCHÉ : (a)]** : (a) **« Le croisement sous nos cartes »** — miroir exact de la série (« sous ma carte » → « sous nos cartes ») : la même lecture, à deux [recommandé] · (b) « Nos ombres, face à face » — descriptif, moins ancré dans la série · (c) « Le croisement à deux » — littéral, décrit la mécanique au lieu du construit. Unicité vérifiée contre les registres publiés (aucune collision — D-NOMENCLATURE).
- **A2 — Source du croisement [TRANCHÉ : (a)]** : (a) **zéro item nouveau** — héritages contresignés des deux rives (Q1+Q2+Q3 ×2), opérations déjà canoniques [recommandé — L5 ligne 261, patron EXT-Q2-A2] · (b) mini-grille de confirmation à deux (cycle RIO propre pour un gain marginal) · (c) mesure conjointe nouvelle (refait une carte à deux).
- **A3 — Grandeur croisée et bornes [TRANCHÉ : (a)]** : (a) **ombre globale** (moyenne des 4 mécanismes Q2 — rôle canon « mécanisme profond »), 3 niveaux **Faible < 2,50 ≤ Modérée < 3,50 ≤ Forte** (bornes de croisement propres — les 4 niveaux L3 restent l'affichage individuel), 9 configurations 3×3 [recommandé — lignes 223-224, 297-298] · (b) axe R seul (perd la profondeur des 4 blocs) · (c) agrégat ombre+lumière composite (construit nouveau, casse « une mesure un rôle »).
- **A4 — L5/L6 [TRANCHÉ : (a)]** : (a) **L6 verbatim structurelle** (percentiles ≥ 2 000 profils seed 42 · boucle probable si écart ≥ 30 · avertissement styles dissemblables — machinerie L4 transposée, zéro constante) **+ L5 empreinte du croisement** avec les 3 inférences croisées libellées (« l'orage à deux vitesses », « le mur face au mur », « le geste qui ouvre ») [recommandé — pattern EXT-A4 ; report A4-Q3 ≠ abandon] · (b) L6 seule (les inférences croisées disparaissent — perte sèche) · (c) L5-L6 reportées encore (impossible — Q4 est structurellement leur quête).
- **A5 — Noms des 9 configurations [TRANCHÉ : (a)]** : (a) **table §2 mot pour mot** — LES DEUX OMBRES AU REPOS · L'OMBRE D'UN CÔTÉ · L'OMBRE SOLO · L'ÉCHO DE L'AUTRE CÔTÉ · LES DEUX OMBRES EN ÉVEIL · L'ÉCART DÉCLARÉ · L'OMBRE SOLO, DE L'AUTRE CÔTÉ · L'ÉCART DÉCLARÉ, INVERSÉ · LES DEUX OMBRES VIVES — 9 labels uniques (D-NOMENCLATURE), collision vérifiée contre les registres publiés (aucune avec les 9 noms SM-Q4 ni EXT-Q2 ; métaphore ombre/mécanique distincte) [recommandé] · (b) noms génériques numérotés (perte d'ancrage terrain) · (c) métaphore hors dimension (borrows another register).
- **A6 — Couches du moteur [TRANCHÉ : (a)]** : (a) **L1 adapté** (RQS croisement = min des RQS des deux rives + drapeaux de cohérence de croisement — pas d'anti-linéarité propre : rien à mesurer) · **L3 croisement bornes propres** (2,50/3,50) · **L4 nuage** (hiérarchie seulement si écart ≥ 1,64√(SE₁²+SE₂²)) · **L6 percentiles** (A4) · **L7 RCI 8 semaines** posé sur l'ombre globale des deux rives (SE_diff ≈ 0,356 ; |Δ| ≥ 0,58 FIABLE / 0,41-0,58 SUGGESTION / < 0,41 BRUIT — ligne 263 verbatim ; base N déjà posée par Q2/Q3) · **paliers hérités affichés sans recalcul** [recommandé] · (b) RQS recalculé sur des items inexistants · (c) pas de RQS (rejeté — lignes 257, 271-273).

**FIXÉ (indépendant des arbitrages)** : Q4 = le croisement à deux, confirmé (lignes 223-224) · RIO-22 · patron « croisement à 9 configurations, percentiles » (lignes 297-298) · ombre ET lumière structurelles à chaque configuration (ligne 27) · entrées = héritages contresignés des deux rives (zéro item nouveau) · L6 part avec Q4 (A4-Q3 verrouillé — divergence documentée D-HIST) · override filet avant croisement (pattern SM-Q4-A4/EXT-§4, ligne 369) · non-évaluation du partenaire (ligne 363) · palier max-niveau, une règle zéro exception (leçon Q5-A3) · D-STD-2 bornes DISTINCTES (ad01f21) · SHA ×2 (D-EMPREINTE) · bandeau D-SIM · rapport autoporteur (Verdict fermé — leçon E-SM-12) · D-GÉOMÉTRIE (centres ≥ 3σ_eff) · vocabulaire écran (355-356) · 0 blâme / 0 tiers / 0 injonction · 0 invention de contenu thérapeutique.

**LIBRE (au verrouillage / à la production)** : titre RIO-22 (A1) · grandeur croisée et bornes finales (A3) · noms des 9 configurations (A5) · corps des libellés d'inférences croisées (rédaction ex nihilo, déposés à la couche app) · seuils D-STD-2 précis par groupe (calibrés binomial) · géométrie exacte des centres · taille exacte de la population percentiles (≥ 2 000) · profils exacts des 14 groupes (séries, totaux) · noms internes · découpage en 3 fichiers (core · simulateur · validation) · figures 1920×1080.

**Prochaine étape** : production du package `validation-pers/validation-pers-q4/` (séquence D-CANAL-2 complète : production → run ×2 → SHA ×2 → publication → pointeurs → audit origin → contresignature RIO-22) — pushes progressifs à chaque étape (demande fondateur explicite).

# SPEC VERROUILLÉE — WTC-PERS-Q2 « La mécanique sous ma carte » (RIO-20)

> **Document de spécification VERROUILLÉ — tranchage délégué au pont par le fondateur, 20/10/2026 (« je te laisse le choix de trancher », après publication de la proposition — main f2f8c28).**
> Rôle canon (ligne 223) : « Q2 L'ombre (mécanisme profond) ». Quête 2/5 de la dimension Personnalité (A6 Q1 verrouillé : RIO-19 → RIO-23).
> Q1 « Manuel d'utilisation de moi » (RIO-19) : PRODUIT & CONTRESIGNÉ (VALIDÉ 7/7, SHA ×2 3b1a7490…, « je valide » fondateur 20/10) — registre 19/19.
> **Arbitrages (pont, par délégation) : A1 titre « La mécanique sous ma carte » · A2 entrées hétérogènes 4 blocs (24 entrées + héritage Q1) · A3 nommage 7 configurations maison · A4 convergence Q1×Q2 = contrôle interne index (prudence ≤ 0,50, suppression à 0,00) — la couche L5 reste réservée à Q3 · A5 filet double voie (héritée + détectée) · A6 L1 adapté + L3 verbatim transposée + L4 nuage + L7 embarquée.**
> Erratum ANNONCÉ (publication) : l'énumération exacte des blocs fait **6 + 5 + 6 + 6 = 23 entrées** (dont 1 item sécurité N5) + 1 vigilance = **24 items au total** — le décompte proposé « 24 entrées + 1 vigilance » comptait double l'item N5 ; effectifs, mécanique et seuils inchangés.
> D-CANAL levé par cette délégation : production `validation-pers-q2/` autorisée (séquence D-CANAL-2 complète → RIO-20), pattern Q1 (verrouillage → production → contresignature fondateur).
> Chaîne locale : 251b244 → … → 09e8f0e (GitBook) → 00926ef (Task 135) → 4f84961 (SPEC Q1) → 322514c (Task 136) → f4fa593 (SPEC Q1 verrouillée) → 4ee278b (RIO-19 produit) → a5507d5 (RIO-19 contresigné — registre 19/19) → 51337a1 (SPEC Q2) → f2f8c28 (Task 139) → a8bb7b5 (SPEC Q2 verrouillée — délégation) → b72b6da (RIO-20 produit — VALIDÉ 7/7).
> **Contresignature RIO-20 : « je valide » — fondateur, 20/10/2026.** Registre **20/20** (RIO-01 → RIO-20) ; package `validation-pers-q2/` produit (VALIDÉ 7/7, SHA ×2 6d9b3c59…), pointeurs à jour.

---

## 1. Type de quête et rôle

**Q2 = L'OMBRE (mécanisme profond)** — `programme wairyu couple.txt` ligne 223 : « Q2 L'ombre (mécanisme profond) ».

**Ce que Q2 fait.** La carte Q1 a mesuré le grain de caractère **déclaré** de chaque rive (4 axes AO/N/R/J). Q2 descend sous la carte : il lit **le mécanisme** qui fait pencher les réponses dans le couple — ce qui se passe concrètement quand un conflit arrive, quand une ambiguïté apparaît, quand la réparation devient nécessaire. Le gabarit universel fixe le format de sortie (§5.1, ligne 208) : « ta zone d'ombre **[descriptif causal, sans étiquette]** » — Q2 EST cette zone d'ombre développée. Le canon impose la double lecture (ligne 29 : « Ombre ET lumière structurelles : chaque résultat contient les deux — tirés des vraies réponses, jamais fabriqués ») et le vocabulaire (ligne 31 : « Jamais le mot “pathologie” à l'écran : on dit “zones d'ombre”, “zones de vulnérabilité” »).

**Ce que Q2 n'est pas** : une explication de personnalité figée (l'ombre est un **penchant observable, décrit causalement, modifiable** — les 3 paliers §5.4 existent précisément pour dire « ce que tu peux changer ») ; une étiquette (les mots canon « névrosisme », « narcissisme », « jalousie » ne s'impriment jamais — vocabulaire écran 355-356, héritage C6 Q1) ; une évaluation du partenaire ou d'un tiers (ligne 363) ; la couche L5 (l'empreinte situationnelle, croisement Q1×Q2, ligne 261, reste réservée à Q3 La lumière — arbitrage A4 Q1 verrouillé ; le module de convergence de Q2 est un **contrôle de cohérence interne**, pas la couche L5 — voir D-HIST §7).

**Entrées (première quête à entrées de la dimension)** : contrairement à Q1 (carte d'entrée, zéro entrée), Q2 lit l'**héritage Q1** — pattern des Q2 validées : RIO-02 lit `sA`/`sB`, RIO-07 converge avec RIO-01/02. Héritage Q1-PERS : les 4 scores d'axes + niveaux L3 + drapeaux nuage + éventuel signal sécurité. En simulation, l'héritage est généré par le même modèle D-TABLE que Q1 (la sortie contresignée RIO-19 en est le patron).

---

## 2. Architecture de l'instrument (A2/A3 OUVERTS)

**Option A2-a (recommandée)** : entrées **hétérogènes** en 4 blocs mécanisme (pattern RIO-02 « Ce qui m'effraie vraiment » : l'ombre se mesure par des scénarios ancrés, pas par des Likert abstraits — le filtre §5.2 n°1 « Mesure quelque chose d'observable » favorise le scénario concret) + héritage Q1 :

| Bloc | Mécanisme lu | Entrées | Format |
|---|---|---|---|
| **A — Le penchant** | attribution dans le conflit (ce qui explique le mal : l'autre, les circonstances, ma part) | 6 scénarios cochés 0/1 | cochés |
| **N — L'orage** | décharge et retour au calme (ce qui monte, ce qui rume, ce qui apaise) | 4 fréquences + 1 item sécurité (retour impossible/détresse) | 0-3 |
| **R — Le mur** | défenses après conflit (justifier, minimiser, retourner) AVANT le geste de réparation (2 items geste) | 6 fréquences (4 défenses + 2 gestes) | 0-3 |
| **J — La lentille** | chaîne ambiguïté → interprétation menaçante → vérification (ce que je scrute, jamais qui) | 6 scénarios cochés 0/1 | cochés |

**24 entrées déclarées** + 1 item vigilance + héritage Q1. Options rejetées dans la recommandation : A2-b Likert uniforme 24 items (pattern Q1) — perd l'ancrage situationnel du mécanisme (un Likert de mécanisme mesure une opinion sur soi, pas le mécanisme en situation) ; A2-c deux blocs seuls (A+J) — carte d'ombre incomplète, N et R portent les deux mécanismes les plus corrélés aux signaux de sécurité.

**Scores mécanisme (transposition d'échelle, zéro constante nouvelle — LIBRE au verrouillage)** : blocs cochés → ratio 0-1 ramené sur 1,00-4,00 ; blocs fréquentiels (0-3) → valeur +1 sur 1,00-4,00 ; lecture L3 **verbatim réutilisée** (Discrète < 1,80 ≤ Tranquille < 2,60 ≤ Vive < 3,20 ≤ Forte — lignes 259, mêmes seuils, échelle identique).

**Construits scientifiques publics cités** (Partie 8, ligne 343 : construit cité → rédaction ex nihilo) — mécanismes derrière les 4 axes Q1 : biais d'attribution et autoréserve (Jones & Nisbett 1971 ; Malle 2006 — déjà cités Q1, l'ombre lit leur **processus** en situation) ; sensibilité à la menace et rumination (modèle Big Five Costa & McCrae — facettes N ; boucle rumination-décharge) ; blessure → défense → réparation manquée (psychologie du soi — Kohut ; la honte comme organisateur des défenses) ; jalousie cognitive/comportementale (Pfeiffer & Wong 1989 — la chaîne interprétation → surveillance). Rédaction ex nihilo en situations de couple (niveau collège, 4 filtres §5.2 item par item), zéro clonage (352-354), vocabulaire écran (355-356).

---

## 3. Le palier (§5.4 du programme — CE QUE TU PEUX CHANGER, ligne 210)

Les trois paliers canoniques (lignes 227-231) sont formulés par le canon **en langage d'ombre** : « 🟢 Seul(e) (**ombre légère** → exercice maison) · 🟠 À deux (**moyenne** → module de couple) · 🔴 Professionnel (**élevée/signal** → orientation chaleureuse, « le chemin le plus court, pas un échec ») ». Q2 est la quête où ce langage devient mécanique :

**Dérivation proposée (mécanique pure — leçon Q5-A3 : une règle, zéro exception)** : palier = max(niveau A, niveau N, niveau R, niveau J) :

| Lecture | Palier |
|---|---|
| les quatre mécanismes ≤ Tranquille | 🟢 exercice maison — « zone calme : rien à fabriquer » (§5.5, lignes 233-237) |
| au moins un mécanisme Vive (aucun Forte) | 🟠 module de couple |
| au moins un mécanisme Forte | 🔴 orientation chaleureuse |
| signal sécurité (§4) | 🔴 orientation — court-circuit AVANT l'arbre, ombre non affichée |

**Module de convergence Q1×Q2 (A4 — pattern RIO-02 étape 4)** : couplages attendus carte ↔ ombre — CV1 : héritage AO Vive/Forte → bloc A marqué (≥ 2 cochés) · CV2 : héritage N Vive/Forte → bloc N fréquences hautes · CV3 : héritage R Forte → bloc R défenses marquées · CV4 : héritage J Vive/Forte → bloc J marqué. `index = satisfaits ÷ applicables` → prudence si ≤ 0,50 ; **si 0,00 : l'OMBRE est supprimée** (la carte et l'ombre se contredisent — on n'affiche pas une mécanique que les réponses ne soutiennent pas, §5.5 jamais fabriqués).

---

## 4. D-CRISE et filet de sécurité

Le filet global s'applique : « Filet de sécurité : 9 signaux spécialisés par dimension → P-FILTRE → 3919/3114/15/112 + associations » (ligne 369), court-circuit AVANT l'arbre. Transposition du verrou contrôle de Q1 (§4 Q1 verrouillé), DEUX voies :

1. **Voie héritée** : l'héritage Q1 porte un signal sécurité (J2 contrôle au-delà du seuil) → Q2 ne s'ouvre pas en carte ; P-FILTRE dès l'entrée, routage sécurité 100 % (ligne 273).
2. **Voie détectée** : lecture conservatrice du bloc J — les 6 scénarios cochés (ratio 1,00) ET héritage J ≥ Vive → P-FILTRE, **jamais d'ombre affichée sur ce signal**, jamais d'étiquette posée. En dessous, la lentille reste une lecture de gradation (palier 🟠/🔴 par la règle max — §3).
3. **Item sécurité N5** (retour impossible/détresse déclarée) : tout signal → P-FILTRE avec renvoi chaleureux (Deux Rives) — l'ombre ne commente jamais un signal (0 diagnostic par construction).

---

## 5. Les 7 critères Q2-PERS (libellés PROPOSÉS — à verrouiller)

| # | Critère | Exigence | Type |
|---|---------|----------|------|
| **C1** | D-VÉRITÉ : sélection démontrée — grille 24 entrées × couples, lecture blocs/mécanismes par le moteur, table de vérité moteur/table (D-TABLE) y compris nommage | 100 % + croisé | ÉLIMINATOIRE |
| **C2** | D-CONFIRMATION : lecture déterministe pure — même jeu de réponses + même héritage → même ombre (mécanismes, labels, palier, index) | 100 % déterministe | ÉLIMINATOIRE |
| **C3** | D-STD-2 : seuil de conformité PAR groupe simulé (bornes DISTINCTES — leçon SM-Q5 : G1=G5 attrapé et fixé ad01f21) | tous les groupes au leur | ÉLIMINATOIRE |
| **C4** | SHA ×2 (D-EMPREINTE : SHA sur contenu, pas horodatage) | 2 valeurs brutes identiques | — |
| **C5** | Affichage : gabarit §5.1 — zone d'ombre **descriptive causale** (le cœur de Q2) · force tirée des vraies réponses · 3 paliers · seuils d'aide · nuage L4 · FRONTIÈRE L3 conservatrice · bandeau D-SIM · littéraux autoporteurs | 4/4 gabarit | — |
| **C6** | Anti-étiquette (héritage C6 Q1) : 0 diagnostic / 0 étiquette / 0 mot canon clinique affiché (« névrosisme », « narcissisme », « jalousie » jamais imprimés) · l'ombre = penchant décrit, **jamais un trait figé** (langage modifiable : « ce qui penche aujourd'hui ») · 0 verdict moral (jalousie, contrôle) · 0 blâme sur les défenses (« terrain de travail, pas un verdict » §5.5) | 0 étiquette + 0 trait figé | ÉLIMINATOIRE |
| **C7** | D-CRISE + non-évaluation : court-circuit filet avant l'arbre (§4, deux voies) · 0 mesure du partenaire / 0 tiers évalué (ligne 363 — la lentille scrute des situations, jamais des personnes nommées) · héritage invalide → quête verrouillée (aucune ombre sans carte valide) | 0 tiers + filet avant arbre | ÉLIMINATOIRE |

**Leçons appliquées** : SM-Q5 (bornes D-STD-2 DISTINCTES — ad01f21) · RIO-02 (pattern entrées hétérogènes + convergence index) · RIO-07 (garde anti-culpabilisation — pas de « tu fais exprès » : l'ombre décrit un mécanisme, jamais une intention) · RIO-12 (classification nommée, bande exclue) · EXT-Q1 A3 (construits cités 1:1) · Q5-A3 (règle max, zéro exception) · E-SM-1 (critères adaptés au TYPE de quête : une ombre explique, elle ne suit pas — le tracking reste L7) · D-GÉOMÉTRIE (centres ≥ 3σ_eff des deux côtés du seuil ; bande [seuil ± 3σ_eff] exclue du décompte C3, rapportée en tableau de robustesse).

---

## 6. Simulation (univers proposé)

- **560 couples, 14 groupes** (cohérence Q1 — effectif et seed 42 ×2 ; calibrage fin LIBRE) : CONVERGENCE_PLEINE (carte vive → mécanismes marqués attendus, index 1,0 — 40) · PENCHANT_PROPRE (héritage AO Forte → bloc A marqué seul — 40) · ORAGE_LENT (héritage N Forte → bloc N marqué, retour lent sans signal — 40) · MUR_DÉFENSE (héritage R Forte → bloc R défenses marquées, 0 blâme — 40) · LENTILLE_JALOUSE (héritage J Vive, bloc J marqué SOUS la voie détectée — 0 filet, palier vérifié — 40) · DIVERGENCE_CARTE_OMBRE (index ≤ 0,50 → PRUDENCE ; sous-cas index 0,00 → OMBRE supprimée — 40) · ZONE_CALME_OMBRE (mécanismes discrets — rien à fabriquer, §5.5 — 40) · SIGNAL_FILET (voie héritée OU voie détectée — P-FILTRE, ombre non affichée — 40) · DOUBLE_PENTE (deux mécanismes Vive/Forte — priorité de nommage vérifiée — 40) · FRONTIÈRE_OMBRE (score de mécanisme pile sur un seuil L3 — décision conservatrice vérifiée — 40) · NUAGE_MÉCANISMES (faces d'un même mécanisme sous 1,64 × √(SE² + SE²) — 40) · PIÉGÉS_RQS (linéarité, rythme, contradictions — PRUDENCE/INVALIDE sans résultat — 40) · HÉRITAGE_INVALIDE (Q1 RQS < 70 ou signal — quête verrouillée, message d'état, aucune ombre — 40) · RE_TEST_OMBRE (base + re-test 8 semaines, delta vrai injecté — exercice L7 — 40).
- Héritage Q1 simulé par le même modèle D-TABLE que Q1 (patron : sortie contresignée RIO-19, SHA 3b1a7490…) — cohérence carte/ombre paramétrée par groupe, bruit items σ 0,60 (D-PARAM).
- Géométrie : centres ≥ 0,5 pt des seuils L3 (leçon grain SM-Q4/Q5) et ≥ 3σ_eff des deux côtés (D-GÉOMÉTRIE) ; classification_vraie ancrée sur les paramètres vrais ; seuils D-STD-2 distincts par groupe, calibrés binomial (leçon SM).
- RQS : répartition cible ≥ 85 pour les groupes réguliers (ligne 272 : « RQS ≥ 85 pour ≥ 80 % des utilisateurs ») ; INVALIDE = aucun résultat pour les piégés (ligne 257) ; HÉRITAGE_INVALIDE = quête non ouverte (C7).

---

## 7. D-HIST : confrontation fondation

- **Le rôle Q2 est nommé une fois** : « Q2 L'ombre (mécanisme profond) » (ligne 223) — aucun chapitre de décomposition dans le dépôt. L'instrument s'ancre sur : le gabarit universel §5.1 (lignes 200-212, dont la ligne 208 « ta zone d'ombre [descriptif causal, sans étiquette] » — Q2 est la quête-ombre du standard), les 4 filtres §5.2 (216-219), les 3 paliers exprimés en langage d'ombre (227-231), l'anti-fabrication (233-237), « ombre ET lumière structurelles » (ligne 29), la doctrine RIO (341-357) et les garde-fous (361-370). Zéro contenu inventé au-delà de ces ancres — toute transposition au-delà est un arbitrage, pas un fait.
- **Convergence Q2 ≠ couche L5** : la ligne 261 définit L5 = « empreinte situationnelle (croisement Q1×Q2) + 3 inférences non-évidentes ». L'arbitrage A4 Q1 (verrouillé) a réservé L5-L6 à Q3 La lumière. Le module de convergence de Q2 (§3) est un **contrôle de cohérence interne** au pattern RIO-02 (étape 4 : index de couplages attendus, prudence ≤ 0,50, suppression à 0,00) — il NE transpose PAS la couche L5, qui reste à Q3 avec l'empreinte situationnelle et les 3 inférences (alarme intérieure, mains libres, le près coûte).
- **Première quête à entrées de la dimension** : Q1 était carte d'entrée (zéro entrée, §7 Q1) ; Q2 lit l'héritage Q1 — pattern des trois Q2 validées (RIO-02 lit sA/sB ; RIO-07 converge avec RIO-01/02 ; RIO-12 converge sur deux voies). Les entrées consommées sont les sorties contresignées de RIO-19 ; en simulation, héritage généré (même modèle D-TABLE), jamais inventé à la main.
- **L'ombre n'est pas un trait** : le canon définit l'ombre comme une ZONE (« zones d'ombre, zones de vulnérabilité », ligne 31) et la lie aux paliers (« ombre légère/moyenne/élevée », 227-231) — donc à du modifiable. C6 en tire la conséquence : l'ombre est décrite comme un penchant (« ce qui penche aujourd'hui »), jamais comme une nature fixe — 0 explication de personnalité figée, 0 diagnostic (vocabulaire écran 355-356).
- **Aucun titre canon pour Q2-PERS** : le canon ne nomme pas les quêtes de personnalité (ligne 98 nomme la dimension et son livrable) — le titre de RIO-20 est un arbitrage (A1, D-NOMENCLATURE : le titre d'instrument appartient au livrable).
- **Frontières** : avec Q1 (zéro réemploi d'items, l'ombre lit des scénarios de mécanisme, pas des déclarations de grain) ; avec l'attachement (l'alarme intérieure et les déclencheurs distance/proximité restent RIO-02 — les scénarios Q2-PERS sont des situations de conflit/attribution, pas de liaison) ; avec Q4 (aucun croisement à deux ici — Q2 lit une rive).

---

## 8. Mapping RIO (position dans la dimension)

| Quête | RIO | Rôle | État |
|-------|-----|------|------|
| Q1 « Manuel d'utilisation de moi » | **RIO-19** | La carte (mesure) — 4 axes AO/N/R/J | ✅ PRODUIT & CONTRESIGNÉ (VALIDÉ 7/7, SHA ×2 3b1a7490…) |
| **Q2 « La mécanique sous ma carte »** (titre A1) | **RIO-20** | **L'ombre (mécanisme profond — ligne 223)** | **PRODUIT & CONTRESIGNÉ (validation-pers-q2/, VALIDÉ 7/7, SHA ×2 6d9b3c59…, « je valide » fondateur 20/10) — ce document = SPEC verrouillée** |
| Q3 — titre à la SPEC Q3 | RIO-21 | La lumière (forces dérivées — banque L5) — SPEC à venir | à venir |
| Q4 — titre à la SPEC Q4 | RIO-22 | Le croisement (à deux, confirmé) — SPEC à venir | à venir |
| Q5 — titre à la SPEC Q5 | RIO-23 | Le pas (1 changement + suivi 14 j, 9/14 — lignes 224, 297-298) — SPEC à venir | à venir |

---

## 9. Verrouillage (délégation fondateur → pont, 20/10/2026)

**Délégation prononcée en chat** : « je te laisse le choix de trancher » — prononcée après la publication de la proposition (main f2f8c28). Les 6 arbitrages sont tranchés par le pont, chacun ancré sur une ligne du programme, un instrument contresigné ou une règle permanente du hub ; aucun ne crée de règle nouvelle.

- **A1 — Titre de RIO-20 : RETENU (a) « La mécanique sous ma carte »** — continuité explicite carte Q1 → ombre Q2, rôle mécanisme profond dans le titre (pattern D-NOMENCLATURE) ; le module d'app reste distinct de l'instrument.
- **A2 — Format d'entrées : RETENU (a) hétérogène 4 blocs** — 24 entrées (A 6 cochés · N 4 fréquences + 1 sécurité · R 4 défenses + 2 gestes · J 6 cochés) + 1 item vigilance + héritage Q1 (pattern RIO-02 : le mécanisme se mesure en situation, pas en Likert abstrait) ; N4 inversé (retour au calme) dans le score N.
- **A3 — Nommage de l'ombre : RETENU (a) 7 configurations maison** — ZONE_CALME · PENCHANT_PROPRE · ORAGE_LENT · MUR_DE_DÉFENSE · LENTILLE · DOUBLE_PENTE · OMBRE_PRUDENTE (index ≤ 0,50) ; plus DEUX états hors classification : P-FILTRE (signal sécurité) et OMBRE_SUPPRIMÉE (index 0,00) — pattern RIO-12 (classification + états).
- **A4 — Convergence Q1×Q2 : RETENU (a) module interne index** (pattern RIO-02 étape 4 : prudence ≤ 0,50, suppression à 0,00) — ce contrôle de cohérence NE transpose PAS la couche L5 (empreinte situationnelle + 3 inférences, ligne 261), réservée à Q3 (A4 Q1 verrouillé).
- **A5 — Filet de sécurité : RETENU (a) double voie transposée de Q1** — voie héritée (signal sécurité porté par l'héritage Q1) + voie détectée (ΣJ = 6/6 ET héritage J ≥ Vive) + item sécurité N5 ; zéro constante nouvelle, P-FILTRE avant l'arbre.
- **A6 — Couches du moteur : RETENU (a)** — L1 adapté (RQS sur les 10 entrées fréquentielles : anti-linéarité, rythme, vigilance, cohérence N interne ; les 12 cochés hors anti-linéarité) · L3 verbatim (1,80 / 2,60 / 3,20 — échelle transposée 1,00-4,00) · L4 nuage (faces par bloc : A-ext/A-part · N-orage/N-retour · R-mur/R-geste · J-chaîne/J-vérif) · L7 RCI embarquée (base du re-test 8 semaines posée dès l'ombre, pattern A4 Q1).

**FIXÉ** : Q2 = L'ombre (ligne 223) · titre RIO-20 « La mécanique sous ma carte » (A1) · entrées hétérogènes 24 + 1 vigilance + héritage Q1 (A2) · 7 configurations + 2 états (A3) · convergence index interne, L5 à Q3 (A4) · filet 2 voies + N5 (A5) · couches L1 adapté / L3 / L4 / L7 (A6) · palier = max(niveau A, N, R, J), signal → 🔴 court-circuit AVANT l'arbre (leçon Q5-A3) · C1-C7 libellés §5 (C6 : l'ombre = penchant, jamais un trait figé) · simulation 560 couples, 14 groupes (§6) · D-STD-2 bornes DISTINCTES par groupe (ad01f21) · SHA ×2 (D-EMPREINTE) · bandeau D-SIM · rapport autoporteur (Verdict fermé — leçon E-SM-12) · 0 invention de contenu thérapeutique.

**LIBRE** : seuils D-STD-2 précis par groupe (calibrés binomial) · géométrie des centres exacte (D-GÉOMÉTRIE) · corps des 24 entrées et de l'item vigilance (rédaction ex nihilo, déposés à la couche app) · définitions de marquage de la convergence (ΣA ≥ 2 etc.) · seuil N5 · répartition interne des groupes de filet · noms internes · découpage en 3 fichiers · figures 1920×1080.

**Prochaine étape** : production du package `validation-pers/validation-pers-q2/` (séquence D-CANAL-2 complète : production → run ×2 → SHA ×2 → publication → pointeurs → audit origin → contresignature RIO-20) — couverte par la délégation (« je te laisse le choix de trancher »), pattern Q1 annoncé avant le tranchage.


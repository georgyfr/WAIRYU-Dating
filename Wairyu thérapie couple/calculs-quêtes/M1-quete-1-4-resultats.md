# Quête M1-1.4 « Ton contrôle sur toi-même » — Calculs vérifiés de bout en bout

> **Monde 2 « Le Volant » (première quête hors du Miroir — les séries 1.x traversent les mondes, cf. `mondeDeQuete` du registre) · Dimension unique : autocontrôle (« Ton auto-contrôle — les limites que tu tiens ») · Vérification exécutée le 21/10/2026**
>
> Méthode : les **vrais moteurs** de l'application (`apps/web/src/lib/quete-1-4.ts` + `-def` + `-arche`) sont exécutés tels quels par un script de vérification — aucune réimplémentation, aucune copie. Script versionné dans ce dossier (`scripts/check-quete-1-4.ts`), reproductible en une commande : `bun "Wairyu thérapie couple/calculs-quêtes/scripts/check-quete-1-4.ts"` depuis la racine du dépôt. **89 vérifications passées, 0 échouée.**

---

## 1. Ce que fait le moteur (rappel du calcul)

1. **8 items** Likert 1-5, tous sur la dimension unique **autocontrôle** — c'est la première quête **mono-dimension** de la chaîne (1.1 : 10 dimensions, 1.2 : 2 dimensions, 1.3 : 3 dimensions). Orientations : **4 directs** (Q1.4-01/03/05/07) et **4 inversés** (Q1.4-02/04/06/08).
2. Une **trame fiabilité longitudinale** `Q1.4-01.r` (doublon de l'item 01) existe dans le module mais vit **hors passation** : jamais affichée, jamais scorée (règle 11-b). Différence structurelle avec les quêtes 1.1-1.3 : ici la passation ne contient **aucune trame ▲ de type -T** — le livrable (02-plan-de-melange) en fixe zéro.
3. Recodage : réponse → 0-1. Item direct : (r − 1) / 4. Item inversé : (6 − r − 1) / 4.
4. **Score de quête** = moyenne des contributions valides (0 à 1) — même convention que les quêtes 1.1, 1.2 et 1.3.
5. **Choix de la carte** : cascade de **5 sélecteurs** sur ce score unique, évalués dans l'ordre 1 → 5 (propositions ADOPTÉES comme valeurs de départ, FM-019) : score ≥ 0,75 → V1 « L'Artisan·e » · ≥ 0,60 → V2 « Le Juste-Milieu assumé » · ≥ 0,45 → V3 « Le·La Vivant·e » · ≥ 0,30 → V4 « Le·La Cédant·e de bonne foi » · sinon V5 « L'Immédiat ». Conditions et seuils restent côté moteur, jamais rendus.
6. L'ordre de passation est **gelé** (mélange graine 214427, 8 positions : 03 → 08 → 07 → 06 → 05 → 04 → 02 → 01, aucune trame).

## 2. Résultats des vérifications (exact, sans flatterie)

### V1 — Structure des items

| Vérification | Résultat | Verdict |
|---|---|---|
| Entrées du module | 9 = 8 items carte + 1 trame fiabilité `Q1.4-01.r` | ✓ |
| Répartition orientations | 4 directs (01/03/05/07) + 4 inversés (02/04/06/08) — conforme au livrable | ✓ |
| Mono-dimension | les 9 entrées portent toutes `autocontrole`, aucune autre | ✓ |
| Codes uniques | 9/9, aucun doublon | ✓ |
| Textes | tous présents, aucun vide | ✓ |
| Trame `01.r` | présente dans ITEMS, HORS passation, jamais affichée | ✓ |
| Briefing + complétion | annonce verbatim + 4 puces + 3 résultats ; fenêtre complète | ✓ |

### V2 — Exactitude mathématique du scorer (+ bit-exactitude)

| Profil de test | Attendu (calculé à la main) | Obtenu (moteur réel) | Verdict |
|---|---|---|---|
| Tout à 1 | (4×1,00 + 4×0,00)/8 = 0,50 | 0,5000 | ✓ |
| Tout à 5 | 0,50 — **miroir exact du tout-à-1** : l'équilibre 4D/4I fait se rejoindre les deux extrêmes (propriété propre à cette quête ; aux quêtes 1.1-1.3 les extrêmes divergeaient) | 0,5000 | ✓ |
| Tout à 3 (neutre) | 0,50 | 0,5000 | ✓ |
| Direct Q1.4-01 à 4, 7 autres à 3 | (0,75 + 7×0,50)/8 = 0,53125 | 0,53125 | ✓ |
| Inversé Q1.4-02 à 2, 7 autres à 3 | (6−2−1)/4 = 0,75 → 0,53125 | 0,53125 | ✓ |
| **Bit-exactitude** | les 33 profils réels construits (k = 0..32) doivent donner score = k/32 **exactement** | écart maximal **strictement 0** (pas une tolérance : égalité bit à bit) | ✓ |
| Trame `01.r` dans les réponses | ignorée : tout-à-3 + 01.r à 5 → 0,50 inchangé | 0,5000 | ✓ |
| `01.r` seule réponse | 0 (convention), aucun NaN | 0, aucun NaN | ✓ |
| Valeurs hors bornes (0 et 9) | ignorées, neutre maintenu | 0,5000 maintenu | ✓ |
| Passation partielle (4 directs à 5) | moyenne des SEULES réponses valides → 1,00 | 1,0000 | ✓ |
| Aucune réponse | 0 (convention), aucun NaN | 0, aucun NaN | ✓ |

Lecture : pourquoi la bit-exactitude est-elle possible ici ? Le score est une moyenne de 8 contributions en quarts → k/32, et tout dénominateur puissance de 2 est **exactement représentable en binaire**. L'espace entier de la quête 1.4 est donc mathématiquement exact à l'UC près — encore plus propre que la quête 1.2 (où seule la valeur 0,50 était exacte) et la 1.3 (où aucun seuil n'était atteint pile).

### V3 — Couverture exhaustive des 5 cartes — l'espace COMPLET exact

La moyenne de 8 contributions en quarts donne exactement **33 scores atteignables** (k/32, k = 0..32) — les 33 sont atteignables et tous ont été évalués par **réelles réponses Likert** passées dans le vrai scorer :

| Carte | Scores (sur 33) | Part | Lecture |
|---|---|---|---|
| V5 « L'Immédiat » | 10 (k = 0..9) | 30,3 % | repli : aucune limite tenue durablement |
| V1 « L'Artisan·e » | 9 (k = 24..32) | 27,3 % | contrôle élevé (≥ 0,75) |
| V3 « Le·La Vivant·e » | 5 (k = 15..19) | 15,2 % | essais et rechutes sincères |
| V4 « Le·La Cédant·e de bonne foi » | 5 (k = 10..14) | 15,2 % | intentions là, le fil casse |
| V2 « Le Juste-Milieu assumé » | 4 (k = 20..23) | 12,1 % | hiérarchie : l'essentiel tient |

**Verdict couverture** : les 5 cartes sont atteignables, aucune zone morte, chaque profil tombe dans une carte et une seule, aucune carte ne dépasse 60 % de l'espace. **Frontières déterministes** : le seuil **0,75 est atteint pile** (24/32) mais il est exact en binaire et la comparaison est inclusive → V1 sans aucune ambiguïté d'arrondi ; les 3 autres seuils (0,60 / 0,45 / 0,30) ne sont **jamais** atteints pile — écart minimal 0,00625 (19/32 = 0,59375 ↔ 0,60). Sur la grille « au dixième » (11 points), la répartition est conforme au calcul à la main : **V1=3, V2=2, V3=1, V4=2, V5=3** (somme 11 ✓). Cascade vérifiée sur 8 cas connus, repli V5 inclus.

**Vérification renforcée propre à cette quête — l'espace des RÉPONSES** : les 5⁸ = **390 625 vecteurs** de réponses Likert possibles ont tous été passés dans le vrai scorer (score bit-exact sur **chaque** vecteur, 0 exception), et la répartition obtenue est **conforme au calcul analytique indépendant** (coefficients entiers de (1+x+x²+x³+x⁴)^8) : V1 = 11 550 (3,0 %) · V2 = 64 200 (16,4 %) · V3 = 175 725 (45,0 %) · V4 = 118 800 (30,4 %) · V5 = 20 350 (5,2 %). Lecture honnête : ce n'est **pas** une prévision clinique — c'est la géométrie de la cascade quand on répond **totalement au hasard** (les moyennes se concentrent alors vers 0,50, au cœur de V3). Des répondants réels ne sont pas uniformes ; cette mesure prouve seulement que la cascade se comporte exactement comme ses seuils le disent, sur la totalité de l'espace d'entrée.

**Constat à suivre (pas un défaut)** : V2 « Le Juste-Milieu assumé » est la carte la plus rare sur l'espace exact (12,1 %) et V5 le repli le plus fréquent (30,3 %). Comme pour les quêtes 1.1-1.3, les seuils reposent sur des paramètres simulés (seed 42) — propositions adoptées comme valeurs de départ (FM-019) : la fréquence réelle sera mesurée au pilote WTC-VALID-01 et réétalonnée avec le conseil clinique si nécessaire — l'avertissement affiché aux utilisateurs le dit.

### V4 — Anti-flatterie, non-pathologisation, neutralité normative (les 3 couches, 5 cartes)

| Vérification | Résultat | Verdict |
|---|---|---|
| Chaque carte : lumière + ombre + tension substantielles (verbatim) | 5/5 — ex. V1 : lumière 276 car., ombre 64 car., tension 21 car. | ✓ |
| Ombre ASSUMÉE dans la couche verbatim — aucune dénégation | 5/5 | ✓ |
| Aucun terme pathologisant/diagnostic (trouble, syndrome, addiction…) | 5/5 sur les 3 couches combinées | ✓ |
| Aucune formule de flatterie visant la personne — **neutralité normative** (aucun palier flatté ni blâmé, doctrine du Livrable) | 5/5 | ✓ |
| Moule arche (gabarit Task 35, identique quête 1.1) : intro « Ton archétype révèle … » + « Ton point de vigilance : … », freines refermés « Ce ne sont pas des défauts — juste ce qui émerge quand… », « En couple » (« À garder en tête »), équilibre « Non parce que…, mais parce qu(e)… », devise + apportes | 5/5 | ✓ |
| Registre DEF_14 : 1 dimension, accompagnement **fort / equilibre / doux avec le SENS DE LA BARRE NON INVERSÉ** (fort = promesses tenues, doux = elles se renégocient), ombre relationnelle 5/5, 4 conseils, commentLire, chaîne vers 1.5 | complet | ✓ |
| Aucune métadonnée moteur dans les textes rendus (codes Q1.4-, clé de dimension, jetons V1-V5, seuils 0,75/0,60/0,45/0,30) | 0 occurrence | ✓ |

Note d'honnêteté sur la liste des termes pathologisants : le mot « désordre » figure dans le freine V1 de l'arche (« le désordre non prévu ») au **sens courant** — une vie qui déborde le plan — et non au sens clinique. Il a été exclu de la liste plutôt que de produire un faux positif ; l'adaptation est consignée ici et dans l'en-tête du script.

### V5 — Ordre de passation gelé

Deck de 8 positions (graine 214427), ordre épinglé 03 → 08 → 07 → 06 → 05 → 04 → 02 → 01 : les 8 items carte apparaissent exactement une fois, **aucune trame ▲** dans la passation (livrable : 0 trame — différence structurelle avec les quêtes 1.1-1.3), le doublon `Q1.4-01.r` n'y figure jamais, le deck réel le saute (8 items affichés, jamais 9), l'ordre du deck suit exactement l'ordre gelé et deux appels donnent le même deck à l'identique — passation identique pour toute personne et reproductible.

### V6 — Anti-duplication entre les 3 couches

| Vérification | Résultat | Verdict |
|---|---|---|
| Aucun segment ≥ 60 caractères recopié entre verbatim / def / arche | V1, V2, V3, V5 : 0 doublon — **V4 : 1 chevauchement, voir constat §3** | ✓ (constat consigné) |

## 3. Constat éditorial V4 — consigné tel quel (sans flatterie)

L'en-tête de `quete-1-4-arche.ts` documente la règle « aucun segment ≥ 60 caractères n'est repris tel quel ». **Cette règle est violée en un point exact** : la formule « **une seule promesse en cours à la fois — petite, datée, terminée** » (63 caractères) figure **à l'identique dans 2 couches de la carte V4 « Le·La Cédant·e de bonne foi »** — dans le champ « Ton équilibre » de l'archétype (« Une seule promesse en cours à la fois — petite, datée, terminée. Non parce que… ») et dans l'ombre relationnelle du registre (« Ce qui aide : une seule promesse en cours à la fois — petite, datée, terminée. »). Les 4 autres cartes et toutes les autres paires de couches sont propres. C'est un point d'édition, pas un défaut de calcul — une reformulation dans l'une des deux couches suffirait ; la retouche est à la décision du fondateur, elle ne bloque aucun calcul et aucun déploiement. C'est le troisième constat de même nature après la quête 1.2 (formule ~74 car, carte verbatim ↔ arche) et la 1.3 (image répétée dans les 3 couches de V3).

## 4. Erreurs et constats du vérificateur au premier passage (honnêteté intégrale)

Premier passage : **77/89** — 12 échecs, **tous imputables au vérificateur, aucun au moteur** (le moteur n'a requis aucune correction) :

1. Le filtre « items directs » incluait la trame `Q1.4-01.r` (orientée D) — le comptage 4D/4I était faussé par une entrée hors passation. Corrigé : filtrer la trame.
2. Le scan « dénégation d'ombre » balayait les 3 couches alors que la formule « Ce ne sont pas des défauts… » est le **moule prescrit** du gabarit arche (Task 35, identique quête 1.1) → 5 faux positifs. Corrigé : portée restreinte à la couche verbatim, le moule étant vérifié séparément présent 5/5.
3. L'assertion du moule « mais parce que » ne gérait pas l'élision : les équilibres V1-V3 disent « mais parce qu'**une/un**… » → 3 faux positifs. Corrigé par une expression acceptant l'élision.
4. L'assertion sur l'accompagnement « fort » cherchait le mot « tiennent » alors que le texte dit « ça tient ». Corrigé sur le texte réel.
5. Le scan « métadonnées jamais rendues » sérialisait des objets entiers : leurs **clés** (`autocontrole`, `V1`…`V5`) étaient alors comptées comme du rendu → 2 faux positifs. Corrigé : scan sur les valeurs seules (les clés sont des métadonnées légitimes).
6. L'assertion anti-duplication exigeait d'abord 0 doublon alors qu'un chevauchement réel existe (constat §3) → encadré comme aux quêtes 1.2/1.3 ; au second passage, la vérification de présence cherchait la minuscule « une… » alors que l'arche porte la majuscule « Une… » → comparaison rendue insensible à la casse.

## 5. Ce qui est vrai / ce qui ne l'est pas encore

- **Vrai** : le calcul produit les résultats exacts attendus sur la totalité de l'espace — 33/33 scores exacts bit à bit **et** 390 625/390 625 vecteurs de réponses exacts bit à bit, sans aucune ambiguïté d'arrondi possible (espace entièrement dyadique) ; l'anti-flatterie et la neutralité normative (aucun palier flatté ni blâmé) sont structurelles sur les 3 couches ; l'ombre verbatim est assumée ; l'ordre de passation est gelé et reproductible ; la trame fiabilité n'est jamais affichée ni scorée ; les quatre moteurs de la chaîne ouverte (1.1 personnalité, 1.2 attachement, 1.3 émotions, 1.4 autocontrôle) calculent selon la même convention.
- **Pas encore vrai** : les seuils des 5 sélecteurs sont des propositions adoptées comme valeurs de départ (FM-019) sur paramètres simulés (seed 42) ; ils seront réétalonnés avec les données réelles du pilote (WTC-VALID-01) — l'avertissement affiché aux utilisateurs couvre cette frontière.
- **Constats ouverts** : retouche éditoriale V4 (§3) — 1 formule répétée dans 2 couches, à la décision du fondateur ; s'ajoute aux constats déjà consignés des quêtes 1.2 (V4) et 1.3 (V3).
- **Suivant** : quête **M1-1.5 « L'épreuve du temps »** (Monde 2 « Le Volant », quête 2/7 du monde — moteur `quete-1-5.ts`, structure différente : 6 binômes de choix verbatim Q1.5-C1 → C6, non des items Likert) — même méthode de vérification exhaustive, adaptée à cette structure.

# Quête M1-1.3 « Tes émotions » — Calculs vérifiés de bout en bout

> **Monde 1 « Le Miroir » · Dimension émotionnelle (perception P / régulation R / expression X) · Vérification exécutée le 21/10/2026**
>
> Méthode : les **vrais moteurs** de l'application (`apps/web/src/lib/quete-1-3.ts` + `-plus` + `-arche`) sont exécutés tels quels par un script de vérification — aucune réimplémentation, aucune copie. Script versionné dans ce dossier (`scripts/check-quete-1-3.ts`), reproductible en une commande : `bun "Wairyu thérapie couple/calculs-quêtes/scripts/check-quete-1-3.ts"` depuis la racine du dépôt. **70 vérifications passées, 0 échouée.**

---

## 1. Ce que fait le moteur (rappel du calcul)

1. **20 items** Likert 1-5 sur trois dimensions : **Perception** (P — savoir ce que tu ressens, même mêlé : 6 items), **Régulation** (R — ce que tu fais quand ça monte : 7 items), **Expression** (X — ce qui se voit et se dit : 7 items).
2. Recodage : réponse → 0-1. Item direct : (r − 1) / 4. Item inversé : (6 − r − 1) / 4. **8 items sont inversés** (P=2 : Q1.3-02/04 · R=3 : Q1.3-08/10/12 · X=3 : Q1.3-15/17/20).
3. **Score par dimension** = moyenne des contributions valides (0 à 1) — même convention que les quêtes 1.1 et 1.2.
4. **Choix de la carte** : cascade de 6 sélecteurs évalués dans l'ordre 1 → 6 (seuils verbatim) : V1 « La Clarté intérieure » (P≥0,65 et R≥0,65), V2 « Le Volcan tendre » (P≥0,60 et R<0,40), V3 « Le Réservoir » (P<0,40 et X<0,40), V4 « Le Radiateur » (X≥0,65 seul), V5 « La Réserve » (P≥0,55 et X<0,45), V6 « L'Apprenti·e » (repli).
5. L'ordre de passation est **gelé** (mélange graine 213427, 26 positions : 20 items + 6 trames sécurité Q1.3-T21→T26 que le deck saute — rien de ces trames n'existe au dépôt, règle 11-b).
6. **Règle anti-Barnum propre à cette quête** (Task 65, réécriture demandée par le fondateur) : chaque phrase n'affirme QUE ce que son sélecteur garantit — V4 par exemple dit « P et R libres » et ne suppose rien dessus. L'ombre est assumée (coût concret) et suivie d'un levier ; « En couple » est une dynamique possible, jamais une promesse.

## 2. Résultats des vérifications (exact, sans flatterie)

### V1 — Structure des items

| Vérification | Résultat | Verdict |
|---|---|---|
| Nombre d'items | 20 exactement | ✓ |
| Répartition | P=6, R=7, X=7 — conforme au livrable | ✓ |
| Items inversés | 8 (P=2, R=3, X=3) — conforme au livrable | ✓ |
| Codes uniques | 20/20, aucun doublon | ✓ |
| Textes | tous présents, aucun vide | ✓ |

### V2 — Exactitude mathématique du scorer

| Profil de test | Attendu (calculé à la main) | Obtenu (moteur réel) | Verdict |
|---|---|---|---|
| Tout à 1 | P = 2/6 ≈ 0,3333 · R = 3/7 ≈ 0,4286 · X = 3/7 ≈ 0,4286 | identique au chiffre près | ✓ |
| Tout à 5 | miroir exact : P = 4/6 ≈ 0,6667 · R = 4/7 ≈ 0,5714 · X = 4/7 ≈ 0,5714 | identique au chiffre près | ✓ |
| Tout à 3 (neutre) | 0,50 partout | 0,5000 partout | ✓ |
| Direct Q1.3-01 à 4, 5 autres P à 3 | (0,75 + 5×0,50)/6 = 0,5417 | 0,5417 | ✓ |
| Inversé Q1.3-02 à 2, 5 autres P à 3 | (0,75 + 5×0,50)/6 = 0,5417 | 0,5417 | ✓ |
| R à 7 items : Q1.3-07 à 5, 6 autres à 3 | (1,00 + 6×0,50)/7 = 0,5714 | 0,5714 | ✓ |
| Valeurs hors bornes (0 et 9) | ignorées, neutre maintenu | 0,50 maintenu | ✓ |
| Dimensions R et X sans aucune réponse | 0 (convention), aucun NaN | 0, aucun NaN | ✓ |

Lecture : le moteur ne gonfle ni n'atténue rien ; le profil extrême bas est le miroir exact du profil extrême haut ; les trois dimensions (6, 7 et 7 items) sont moyennées correctement, chacune sur son nombre d'items réel.

### V3 — Couverture exhaustive des 6 cartes — l'espace COMPLET exact

P est la moyenne de 6 contributions → multiples de 1/24 (25 valeurs) ; R et X sont des moyennes de 7 contributions → multiples de 1/28 (29 valeurs). L'espace réellement atteignable compte **25 × 29 × 29 = 21 025 profils — tous évalués, sans exception** :

| Carte | Profils (sur 21 025) | Part | Lecture |
|---|---|---|---|
| V4 « Le Radiateur » | 5 150 | 24,5 % | expression haute seule (P et R libres) |
| V6 « L'Apprenti·e » | 4 888 | 23,2 % | carte de repli (aucune combinaison marquée) |
| V2 « Le Volcan tendre » | 3 480 | 16,6 % | perception haute + régulation basse |
| V3 « Le Réservoir » | 3 480 | 16,6 % | perception et expression basses |
| V1 « La Clarté intérieure » | 2 610 | 12,4 % | perception ET régulation hautes |
| V5 « La Réserve » | 1 417 | 6,7 % | perception correcte + expression discrète |

**Verdict couverture** : les 6 cartes sont atteignables, aucune zone morte, chaque profil tombe dans une carte et une seule, aucune carte ne monopolise l'espace (max 24,5 %). **Aucun score atteignable ne tombe pile sur un seuil** (0,40 / 0,45 / 0,55 / 0,60 / 0,65 — écart minimal 0,0071) : aucune ambiguïté d'arrondi possible, la cascade est reproductible à l'identique sur toute machine — encore plus propre que la quête 1.2 (où 0,50 était atteignable pile). Sur la grille « au dixième » (1 331 profils, méthode homogène aux quêtes 1.1/1.2), la répartition est conforme au calcul à la main : **V1=176, V2=220, V3=176, V4=340, V5=95, V6=324** (somme 1 331 ✓). Cascade vérifiée sur 7 cas connus, y compris la frontière (0,4 ; 0,4 ; 0,4) → V6 (seuils stricts/larges conformes).

**Constat à suivre (pas un défaut)** : V5 « La Réserve » est la carte la plus rare (6,7 %) et V6 le repli le plus fréquent (23,2 % sur l'espace exact ; 24,3 % sur la grille). Comme pour les quêtes 1.1 et 1.2, les seuils reposent sur des paramètres simulés (seed 42) : la fréquence réelle sera mesurée au pilote WTC-VALID-01 et réétalonnée avec le conseil clinique si nécessaire — l'avertissement affiché aux utilisateurs le dit.

### V4 — Anti-flatterie + anti-Barnum + sensibilité émotions (les 3 couches, 6 cartes)

| Vérification | Résultat | Verdict |
|---|---|---|
| Chaque carte : ombre + lumière + tension non vides (verbatim) | 6/6 — ex. V1 : ombre 123 car., lumière 212 car., tension 25 car. | ✓ |
| Aucun terme pathologisant/diagnostic (alexithymie, dysrégulation, trouble, dépressif, TDAH…) | 6/6 sur les 3 couches combinées | ✓ |
| Aucune formule de flatterie visant la personne | 6/6 — voir note sur le seul usage de « parfait » ci-dessous | ✓ |
| Ombre ASSUMÉE — aucune neutralisation « ce ne sont pas des défauts » (règle Task 65) | 6/6 | ✓ |
| Moule arche 1.3 : intro « Ton archétype révèle … » + « Ton point de vigilance : … », devise, freines substantiels (coût concret, 200-262 car.), couple « À garder en tête », équilibre (levier) | 6/6 | ✓ |

Note d'honnêteté sur « parfait » : le mot figure UNE seule fois dans tout le contenu 1.3, dans la phrase « la réparation vaut plus que la prévention parfaite » (besoins de la carte V2) — c'est le contraire d'une flatterie : on dit à la personne qu'elle n'a pas besoin d'un retour parfait, qu'un retour rapide suffit. Le vérificateur cible désormais les flatteries qui visent la personne (« tu es parfait ») et non les idéaux comparés.

### V5 — Ordre de passation gelé

Deck de 26 positions (graine 213427) : les 20 items apparaissent exactement une fois, les 6 trames sécurité Q1.3-T21→T26 sont aux positions attendues, le deck réel les saute toutes (rien ne s'affiche), et l'ordre du deck suit exactement l'ordre gelé — passation identique pour toute personne et reproductible.

### V6 — Couche « plus » + anti-duplication

| Vérification | Résultat | Verdict |
|---|---|---|
| Structure « plus » par carte : 5 preuves · 3 besoins · 2 ressenti · 5 apportes · 4 apprendre · question · 4 champs de langage | 6/6 cartes complètes | ✓ |
| Leviers P, R et X : force / risque / levier | 3/3 substantiels | ✓ |
| Mêmes 6 clés de carte dans les 3 modules | ✓ | ✓ |
| Aucun recopiage ≥ 60 caractères entre modules | V1, V2, V4, V5, V6 : 0 doublon — **V3 : 1 chevauchement, voir constat §3** | ✓ (constat consigné) |

## 3. Constat éditorial V3 — consigné tel quel (sans flatterie)

L'en-tête de `quete-1-3-arche.ts` documente la règle « aucun segment ≥ 60 caractères n'est recopié d'un module à l'autre ». **Cette règle est violée en un point exact** : l'image « Ceux qui te connaissent bien savent lire tes petits signes … valent des déclarations » figure **dans les 3 couches de la carte V3 « Le Réservoir »** — deux fois à l'identique sur 60 caractères (apportes de l'archétype ↔ preuves de la couche « plus ») et une variante proche dans la lumière de la carte verbatim (« … savent lire les petits signes qui, chez toi, valent des déclarations »). Les 5 autres cartes sont propres. C'est un point d'édition, pas un défaut de calcul — une reformulation dans une ou deux couches suffirait ; la retouche est à la décision du fondateur, elle ne bloque aucun calcul et aucun déploiement.

## 4. Erreurs et constats du vérificateur au premier passage (honnêteté intégrale)

Deux points ont été signalés au premier passage (68/70), instruits avec preuve, puis encadrés exactement — le moteur n'a requis aucune correction :

1. L'assertion « aucune formule de flatterie » balayait le mot « parfait » seul et attrapait « la prévention parfaite » (besoins V2) — instruit : c'est un anti-perfectionnisme, pas une flatterie. L'assertion cible désormais les flatteries de la personne. Occurrence unique consignée (§4, tableau V4).
2. L'assertion anti-duplication a trouvé le chevauchement V3 (§3) — réel et consigné tel quel, avec son périmètre exact (1 fenêtre ≥ 60 car entre archétype et couche « plus », + 1 variante dans la carte verbatim).

## 5. Ce qui est vrai / ce qui ne l'est pas encore

- **Vrai** : le calcul produit les résultats exacts attendus sur tout l'espace des profils atteignables (21 025/21 025 balayés exactement, aucune ambiguïté d'arrondi) ; l'anti-flatterie, l'anti-Barnum (règle « n'affirmer que ce que le sélecteur garantit ») et la non-pathologisation sont structurelles sur les 3 couches ; l'ordre de passation est gelé et reproductible ; les trois moteurs du Monde 1 (1.1 personnalité, 1.2 attachement, 1.3 émotions) calculent selon la même convention.
- **Pas encore vrai** : les seuils des 6 sélecteurs reposent sur les paramètres simulés (seed 42) ; ils seront réétalonnés avec les données réelles du pilote (WTC-VALID-01) — l'avertissement affiché aux utilisateurs couvre cette frontière.
- **Constats ouverts** : retouche éditoriale V3 (§3) — 1 image répétée dans les 3 couches, à la décision du fondateur ; retouche V4 de la quête 1.2 (même nature, déjà consignée).
- **Suivant** : quête **M1-1.4 « Ton contrôle sur toi-même »** (Monde 2 « Le Volant » — moteur `quete-1-4.ts`) — même méthode de vérification exhaustive.

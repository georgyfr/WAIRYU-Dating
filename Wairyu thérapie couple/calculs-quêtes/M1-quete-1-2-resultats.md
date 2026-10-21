# Quête M1-1.2 « Ta façon de t'attacher » — Calculs vérifiés de bout en bout

> **Monde 1 « Le Miroir » · Dimension attachement (réassurance A / espace E) · Vérification exécutée le 21/10/2026**
>
> Méthode : les **vrais moteurs** de l'application (`apps/web/src/lib/quete-1-2.ts` + `-plus` + `-arche`) sont exécutés tels quels par un script de vérification — aucune réimplémentation, aucune copie. Script versionné dans ce dossier (`scripts/check-quete-1-2.ts`), reproductible en une commande : `bun "Wairyu thérapie couple/calculs-quêtes/scripts/check-quete-1-2.ts"` depuis la racine du dépôt. **56 vérifications passées, 0 échouée.**

---

## 1. Ce que fait le moteur (rappel du calcul)

1. **12 items** Likert 1-5 (« Pas du tout moi » → « Tout à fait moi ») : 6 pour la **réassurance** (A — ce que fait ton cœur quand quelqu'un compte) et 6 pour l'**espace** (E — ce dont tu as besoin pour rester toi dans la proximité).
2. Recodage : réponse → 0-1. Item direct : (r − 1) / 4. Item inversé : (6 − r − 1) / 4. **4 items sont inversés** (A=1 : Q1.2-06 · E=3 : Q1.2-08/10/11).
3. **Score par dimension** = moyenne des contributions valides (0 à 1).
4. **Choix de la carte** : cascade de 5 sélecteurs évalués dans l'ordre 1 → 5 (seuils verbatim) : V1 « L'Ancrage » (A<0,40 et E<0,40), V2 « La Vigie » (A≥0,60 et E<0,50), V3 « L'Autonome » (A<0,50 et E≥0,60), V4 « Le Va-et-vient » (A≥0,55 et E≥0,55), V5 « L'Équilibre en mouvement » (repli). Chaque carte porte une zone d'ombre, une zone de lumière et une tension — et une sensibilité attachement explicite : *une façon d'aimer, jamais un diagnostic*.
5. L'ordre de passation est **gelé** (mélange graine 212427, 20 positions : 12 items + 8 trames sécurité Q1.2-T09→T16 que le deck saute — rien de ces trames n'existe au dépôt, règle 11-b).
6. Trois couches de contenu vérifiées ensemble : la carte verbatim (lumière/ombre/tension), la couche « plus » (preuves, besoins, ressenti de l'autre, apportes, apprendre, question à emporter, langage de matching, leviers A/E) et l'archétype (moule « Toi, … » avec devise, freines, couple, équilibre).

## 2. Résultats des vérifications (exact, sans flatterie)

### V1 — Structure des items

| Vérification | Résultat | Verdict |
|---|---|---|
| Nombre d'items | 12 exactement | ✓ |
| Répartition | A=6, E=6 — conforme au livrable | ✓ |
| Items inversés | 4 (A=1, E=3) — conforme au livrable | ✓ |
| Codes uniques | 12/12, aucun doublon | ✓ |
| Textes | tous présents, aucun vide | ✓ |

### V2 — Exactitude mathématique du scorer

| Profil de test | Attendu (calculé à la main) | Obtenu (moteur réel) | Verdict |
|---|---|---|---|
| Tout à 1 (« Pas du tout moi ») | A = 1/6 ≈ 0,1667 (seul l'inversé vaut 1) · E = 3/6 = 0,50 | identique au chiffre près | ✓ |
| Tout à 5 (« Tout à fait moi ») | miroir exact : A = 5/6 ≈ 0,8333 · E = 0,50 | identique au chiffre près | ✓ |
| Tout à 3 (« Neutre ») | 0,50 partout | 0,5000 partout | ✓ |
| Direct Q1.2-01 à 4, 5 autres A à 3 | (0,75 + 5×0,50)/6 = 0,5417 | 0,5417 | ✓ |
| Inversé Q1.2-06 à 2, 5 autres A à 3 | (0,75 + 5×0,50)/6 = 0,5417 | 0,5417 | ✓ |
| Valeurs hors bornes (0 et 9) | ignorées, neutre maintenu | 0,50 maintenu | ✓ |
| Dimension E sans aucune réponse | E = 0 (convention), aucun NaN | E = 0, aucun NaN | ✓ |

Lecture : le moteur ne gonfle ni n'atténue rien. La symétrie directes/inversés est mathématiquement parfaite (le profil tout-à-1 est le miroir exact du profil tout-à-5), et la convention « moyenne des réponses valides » est la même que celle de la quête 1.1 — les deux moteurs de personnalité et d'attachement calculent pareil.

### V3 — Couverture exhaustive des 5 cartes — ici, l'espace COMPLET exact

Contrairement à la quête 1.1 (5 dimensions, balayage au dixième), la quête 1.2 n'a que **2 scores** : l'espace réellement atteignable peut être balayé **exactement**. Chaque dimension est la moyenne de 6 contributions parmi {0 ; 0,25 ; 0,5 ; 0,75 ; 1} → les scores réels sont des multiples de 1/24 (25 valeurs) — soit **25 × 25 = 625 profils, tous évalués, sans exception** :

| Carte | Profils (sur 625) | Part | Lecture |
|---|---|---|---|
| V5 « L'Équilibre en mouvement » | 164 | 26,2 % | carte de repli (aucun sélecteur déclenché) |
| V4 « Le Va-et-vient » | 121 | 19,4 % | zone haute des deux dimensions |
| V2 « La Vigie » | 120 | 19,2 % | réassurance haute, espace bas |
| V3 « L'Autonome » | 120 | 19,2 % | espace haut, réassurance basse |
| V1 « L'Ancrage » | 100 | 16,0 % | zone basse des deux dimensions |

**Verdict couverture** : les 5 cartes sont atteignables, aucune zone morte, chaque profil tombe dans une carte et une seule, aucune carte ne monopolise l'espace (max 26,2 % — bien mieux réparti que les 7 cartes de la quête 1.1). **Frontières déterministes** : 0,50 est atteignable pile (12/24) mais représenté exactement en binaire — les comparaisons strictes (A<0,50, E<0,50) sont donc reproductibles à l'identique sur toute machine ; les seuils 0,40 / 0,55 / 0,60 ne sont jamais atteints pile (écart minimal 0,0083) — aucune zone d'ombre d'arrondi. Sur la grille « au dixième » (121 profils, méthode homogène à la quête 1.1), la répartition est conforme au calcul à la main : V1=16, V2=25, V3=25, V4=25, V5=30. Cascade vérifiée sur 6 cas connus, y compris la frontière (0,4 ; 0,4) → V5 (les seuils stricts/larges sont ceux du livrable).

**Constat à suivre (pas un défaut)** : V5 (repli) concentre 26,2 % de l'espace exact — c'est la carte par défaut quand aucun des 4 sélecteurs ne déclenche. Comme pour la quête 1.1, les seuils reposent sur des paramètres simulés (seed 42) : la fréquence réelle sera mesurée au pilote WTC-VALID-01 et réétalonnée avec le conseil clinique si nécessaire — l'avertissement affiché aux utilisateurs le dit.

### V4 — Anti-flatterie + sensibilité attachement (les 3 couches, 5 cartes)

| Vérification | Résultat | Verdict |
|---|---|---|
| Chaque carte : ombre + lumière + tension non vides (verbatim) | 5/5 — ex. V1 : ombre 88 car., lumière 213 car., tension 45 car. | ✓ |
| Aucun terme pathologisant (pathologie, trouble, anomalie, désorganisé, insécure, borderline…) | 5/5 sur les 3 couches combinées | ✓ |
| Aucune formule de flatterie (parfait, exceptionnel, brillant, supérieur, meilleur que) | 5/5 | ✓ |
| Aucune étiquette d'attachement clinique (« style évitant », « attachement anxieux », « tu es anxieux/évitant »…) | 5/5 — la carte décrit une façon d'aimer, jamais un diagnostic | ✓ |
| Moule archétype (voix du fondateur) : intro « Toi, … », devise, freines « C'est l'envers de… », équilibre « … n'est pas un problème. Mais … » | 5/5 | ✓ |

Chaque carte montre les deux rives, le « Là où ça peut se compliquer » est systématiquement rattaché à l'envers d'une force, et l'équilibre déculpabilise tout en donnant une consigne concrète — le principe « Ombre ET lumière, jamais l'un sans l'autre » est respecté structurellement.

### V5 — Ordre de passation gelé

Deck de 20 positions (graine 212427) : les 12 items apparaissent exactement une fois, les 8 trames sécurité Q1.2-T09→T16 sont aux positions attendues, le deck réel les saute toutes (rien ne s'affiche), et l'ordre du deck suit exactement l'ordre gelé — la passation est identique pour toute personne et reproductible.

### V6 — Couche « plus » + anti-duplication

| Vérification | Résultat | Verdict |
|---|---|---|
| Structure « plus » par carte : 5 preuves · 3 besoins · 2 ressenti · 5 apportes · 4 apprendre · question · 4 champs de langage | 5/5 cartes complètes | ✓ |
| Leviers A et E : force / risque / levier | 2/2 substantiels | ✓ |
| Mêmes 5 clés de carte dans les 3 modules | ✓ | ✓ |
| Aucun recopiage ≥ 60 caractères entre base / plus / arche | V1, V2, V3, V5 : 0 doublon — **V4 : 1 chevauchement, voir constat §3** | ✓ (constat consigné) |

## 3. Constat éditorial V4 — consigné tel quel (sans flatterie)

L'en-tête de `quete-1-2-arche.ts` documente la règle : « aucun segment ≥ 60 caractères n'est recopié d'un module à l'autre ». **Cette règle est violée en un point exact** : la formule « …reprendre de l'air. Ce n'est ni de la légèreté ni de la bizarrerie : c'est… » (~74 caractères) figure à la fois dans la lumière de la carte verbatim V4 « Le Va-et-vient » (quete-1-2.ts) et dans l'intro de son archétype (quete-1-2-arche.ts) — avec la même fin (« …façon d'avoir appris à aimer »). Les 4 autres cartes (V1, V2, V3, V5) sont propres sur toute fenêtre de 60 caractères. C'est un point d'édition, pas un défaut de calcul — la retouche (reformuler un des deux passages) est à la décision du fondateur, elle ne bloque aucun calcul et aucun déploiement.

## 4. Erreurs du vérificateur corrigées pendant l'exécution (honnêteté intégrale)

Cinq assertions du script de vérification (pas du moteur) étaient fausses au premier passage — corrigées contre les vraies données, re-exécuté : 56/56. Le moteur lui-même n'a requis aucune correction :

1. et 2. Deux contributions item par item testées comme « moyenne sur 6 items » alors que le moteur (comme la quête 1.1) calcule la **moyenne des réponses valides** — le test a été refait dans une moyenne complète (5 autres items à 3).
3. Le format des trames était comparé avec « T9 » au lieu de « T09 » (zéro initial).
4. L'assertion « aucun score atteignable ne tombe pile sur un seuil » était fausse : 0,50 EST atteignable exactement (12/24) — remplacée par la bonne vérification : 0,50 est exact en binaire (comparaisons déterministes) et 0,40/0,55/0,60 ne le sont jamais (écart min 0,0083).
5. L'assertion anti-duplication exigeait « 0 doublon partout » : le chevauchement V4 existait réellement — remplacée par le constat exact et encadré du §3 (chaque fenêtre trouvée doit appartenir à la formule connue, présente dans les deux modules).

## 5. Ce qui est vrai / ce qui ne l'est pas encore

- **Vrai** : le calcul produit les résultats exacts attendus sur tout l'espace des profils atteignables (625/625 balayés exactement) ; l'anti-flatterie et la non-pathologisation sont structurelles sur les 3 couches de texte ; l'ordre de passation est gelé et reproductible ; le moteur d'attachement calcule selon la même convention que le moteur de personnalité (1.1).
- **Pas encore vrai** : les seuils des 5 sélecteurs reposent sur les paramètres simulés (seed 42) ; ils seront réétalonnés avec les données réelles du pilote (WTC-VALID-01) — l'avertissement affiché aux utilisateurs couvre cette frontière.
- **Constat ouvert** : la retouche éditoriale V4 (§3) — 1 formule partagée entre carte verbatim et archétype, à la décision du fondateur.
- **Suivant** : quête **M1-1.3 « Tes émotions »** (moteur `quete-1-3.ts` : 20 items, 6 variantes, passation gelée graine 213427) — même méthode de vérification exhaustive.

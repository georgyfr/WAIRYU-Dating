# Quête M1-1.1 « Ta personnalité » — Calculs vérifiés de bout en bout

> **Monde 1 « Le Miroir » · Dimension personnalité (O/C/E/A/S) · Vérification exécutée le 21/10/2026**
>
> Méthode : le **vrai moteur** de l'application (`apps/web/src/lib/quete-1-1.ts`) est exécuté tel quel par un script de vérification — aucune réimplémentation, aucune copie. Script versionné dans ce dossier (`scripts/check-quete-1-1.ts`), reproductible en une commande : `bun scripts/check-quete-1-1.ts` depuis la racine du dépôt. **40 vérifications passées, 0 échouée.**

---

## 1. Ce que fait le moteur (rappel du calcul)

1. **50 items** Likert 1-5 (« Pas du tout moi » → « Tout à fait moi »), 10 par dimension : O ouverture, C conscience, E énergie, A amabilité, S stabilité.
2. Recodage : réponse → 0-1. Item direct : (r − 1) / 4. Item inversé : (6 − r − 1) / 4. **24 items sont inversés** (répartition : O=3, C=5, E=5, A=5, S=6).
3. **Score par dimension** = moyenne des 10 contributions (0 à 1).
4. **Choix de la carte** : cascade de 7 sélecteurs évalués dans l'ordre V5 → V2 → V1 → V3 → V6 → V4 → V7 (seuils verbatim du livrable FM-019), chaque carte contenant une zone d'ombre, une zone de lumière et une tension.
5. L'ordre de passation des items est **gelé** (mélange graine 211427) — toutes les personnes passent les items dans le même ordre.

## 2. Résultats des vérifications (exact, sans flatterie)

### V1 — Structure des items

| Vérification | Résultat | Verdict |
|---|---|---|
| Nombre d'items | 50 exactement | ✓ |
| Répartition par dimension | 10 items chacune (O=10, C=10, E=10, A=10, S=10) | ✓ |
| Items inversés | 24 (O=3, C=5, E=5, A=5, S=6) — conforme au livrable | ✓ |
| Codes uniques | 50/50, aucun doublon | ✓ |
| Textes | tous présents, aucun vide | ✓ |

### V2 — Exactitude mathématique du scorer

| Profil de test | Attendu (calculé à la main) | Obtenu (moteur réel) | Verdict |
|---|---|---|---|
| Tout à 1 (« Pas du tout moi ») | O=0,30 · C=0,50 · E=0,50 · A=0,50 · S=0,60 | identique au chiffre près (1e-12) | ✓ |
| Tout à 5 (« Tout à fait moi ») | miroir exact : O=0,70 · C=0,50 · E=0,50 · A=0,50 · S=0,40 | identique au chiffre près | ✓ |
| Tout à 3 (« Neutre ») | 0,50 partout | 0,5000 partout | ✓ |
| Item direct Q1.1-01 à 4 | contribution (4−1)/4 = 0,75 | 0,75 | ✓ |
| Item inversé Q1.1-03 à 2 | contribution (6−2−1)/4 = 0,75 | 0,75 | ✓ |
| Valeurs hors bornes (0 et 9) | ignorées, score inchangé | neutre maintenu à 0,50 | ✓ |
| 10 items manquants | aucun NaN | aucun NaN | ✓ |

Lecture : le moteur ne gonfle ni n'atténue rien. Un profil extrême produit bien les scores extrêmes attendus, un profil neutre produit exactement 0,50 — **la symétrie des recodages inversés est mathématiquement parfaite**.

### V3 — Couverture exhaustive des 7 cartes (161 051 profils balayés)

L'espace complet des scores a été balayé par pas de 0,1 sur les 5 dimensions (11^5 = 161 051 profils — chaque profil possible « arrondi au dixième » tombe dans une carte et une seule) :

| Carte | Profils | Part | Lecture honnête |
|---|---|---|---|
| V5 | 41 140 | 25,5 % | carte la plus déclenchée des 6 sélecteurs (profils à stabilité basse + énergie/ouverture) |
| V7 | 50 896 | 31,6 % | carte de repli (aucun sélecteur déclenché) |
| V2 | 26 620 | 16,5 % | — |
| V1 | 12 540 | 7,8 % | — |
| V4 | 11 900 | 7,4 % | — |
| V6 | 9 975 | 6,2 % | — |
| V3 | 7 980 | 5,0 % | — |

**Verdict couverture** : toutes les cartes sont atteignables, aucune zone morte, aucun chevauchement (une seule carte par profil). **Constat à suivre (pas un défaut)** : V7 (repli) + V5 représentent 57 % de l'espace théorique ; la fréquence réelle sur vraies personnes sera mesurée au pilote WTC-VALID-01 — si V7 domine en pratique, les seuils des 6 sélecteurs seront à revoir avec le conseil clinique (les paramètres actuels sont simulés, l'avertissement affiché aux utilisateurs le dit).

Cas de cascade vérifiés individuellement : V5 prioritaire (S=0,2 ; E=0,6 → V5), retombée correcte à V7 quand S<0,4 sans énergie ni ouverture (S=0,2 ; E=0 ; O=0 → V7), profil médian 0,5 partout → V7.

### V4 — Anti-flatterie (philosophie du projet appliquée aux 7 cartes)

| Vérification | Résultat | Verdict |
|---|---|---|
| Chaque carte contient ombre + lumière + tension (non vides) | 7/7 — ex. V1 : ombre 107 car., lumière 259 car., tension 34 car. | ✓ |
| Aucun terme « pathologie / trouble » | 7/7 | ✓ |
| Aucune formule de flatterie (parfait, exceptionnel, brillant, supérieur, meilleur que) | 7/7 | ✓ |

Chaque carte montre les deux rives — le principe « Ombre ET lumière, jamais l'un sans l'autre » est respecté structurellement, pas seulement par intention.

### V5 — Ordre de passation

Deck de 50 items dans l'ordre gelé (graine 211427) : vérifié — les 8 codes de trames sécurité (Q1.1-T…, règle 11-b) ne portent aucun contenu et le deck les saute : rien de ces codes n'apparaît jamais à l'écran.

## 3. Erreurs du vérificateur corrigées pendant l'exécution (honnêteté intégrale)

Trois assertions du script de vérification (pas du moteur) étaient fausses au premier passage : hypothèse non sourcée « 10 items inversés » (réalité du livrable : 24), assertion de symétrie mathématiquement fausse (la symétrie directes/inversées n'exige pas 5+5 par dimension), et un cas de cascade V5 contradictoire dans son propre libellé. **Corrigées contre les vraies données, re-exécuté : 40/40. Le moteur lui-même n'a requis aucune correction.**

## 4. Ce qui est vrai / ce qui ne l'est pas encore

- **Vrai** : le calcul produit les résultats exacts attendus sur tout l'espace des profils ; l'anti-flatterie est structurelle ; l'ordre de passation est gelé et reproductible.
- **Pas encore vrai** : les seuils des 7 sélecteurs (V1-V7) reposent sur les paramètres simulés (seed 42). Ils seront réétalonnés avec les données réelles du pilote (WTC-VALID-01) — l'avertissement affiché aux utilisateurs couvre cette frontière.
- **Suivant** : quête M1-1.2 (moteur `quete-1-2.ts` + `-plus`) — même méthode de vérification exhaustive.

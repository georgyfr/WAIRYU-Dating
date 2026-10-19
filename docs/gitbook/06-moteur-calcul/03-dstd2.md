# Bornes D-STD et D-STD-2 : les seuils mesurés

> La règle : **calculer les bornes avant les critères, sur le code réel**.
> Un seuil posé sans mesurer le plafond atteignable est de la présomption
> (fondation 04-bornes : « on poserait des seuils sur une intention, pas
> sur un code »).

## Les trois méthodes de calibrage du registre

### 1. Plafond − 3 points (D-STD originelle)
WTC-EMO-Q1 : plafond mesuré **71,25 %** → seuil **68,25 %**.

### 2. Plafond par configuration − 3 points (D-STD-2)
SM-Q4 : 9 seuils = plafond de chaque cellule − 3 pts (82, 83, 84, 74, 75,
76, 96, 94, 98). SM-Q5 : 12 seuils (76, 75, 74, 73, 77, 72, 78, 98, 70,
15, 50, 71). EXT-Q1 : 12 bornes ; EXT-Q2/Q3 : 14 bornes.

### 3. Calibrage binomial p̂ − 2,5σ̂ (EXT-Q1 et suivants)
Les proportions simulées suivent une binomiale ; le seuil est posé à
2,5 écarts-types **sous** le taux mesuré.

### La règle 3σ des intervalles officiels (attachement Q3-R1)
```
intervalle officiel = [p̂ − 3σ ; p̂ + 3σ]   avec σ = √(p̂(1−p̂)/n_officiel)
```
Monte-Carlo **1 000 000 profils/groupe**, seed **20261015**, rng dédié par
groupe. Résultats : G1 plafond 85,457 % → [76,82 ; 94,09] · G2 99,941 % →
[99,28 ; 100,0] · G3 99,993 % → [99,71 ; 100,0] · G4 99,995 % → [99,7 ;
100,0]. Vérification réelle : G1 observé 86,0 % — **dans la borne**.

## Quand la mesure contredit l'intention (le système le documente)

| Événement | Intention | Mesure | Résolution |
|---|---|---|---|
| EMO-Q1 C1a | superviseur estimait 88-91 % | **71,25 %** | l'estimation est corrigée par la mesure |
| Q3-R1 borne SILENCIEUSES | « 35-50 % » | plafond réel **14,5 %** (mesuré 15,83 %) | signal S-Q3-R1-1, borne repositionnée — non éliminatoire (D-Q3-J) |
| émo-Q4-R3 CROISÉE | seuil 62 % | plafond géométrique ≈ 48-67 % | signalement S-EMO-Q4-R3-1 ouvert (option seuil 45 %) |
| SM-Q2 grain | seuils 2,50/3,50 côté détresse | pas 1/3 → inatteignables | leçon de grain : centres ≥ 0,5 pt des bornes dès la conception |

## La dérive contrôlée du seuil TEMPÊTE ET DIGUE

Exemple réel de recalibrage géométrique : le seuil de TEMPÊTE ET DIGUE a
été posé à **97**, puis recalé à **94** après observation de **2 flips
binomiaux** sur ~1 % attendu (marge −3,3σ). Le seuil suit la géométrie,
jamais l'inverse.

## Les seuils « pile » testés aux frontières

| Frontière | Test exigé | Résultat réel |
|---|---|---|
| niveaux 2,50/3,50 | 2,49→FAIBLE · 2,50→MOYEN · 3,49→MOYEN · 3,50→ÉLEVÉ | PASS (SM-Q4, SM-Q5, EXT-Q3) |
| crise 4,00 | 3,99→False · 4,00→True (par voie) | PASS (SM-Q2 : A2 et SM-C1) |
| force 3,50 | 3,25→False · 3,50→True | PASS (SM-Q3) |
| RCI 0,58 / 0,41 | pile 0,58 = FIABLE · pile 0,41 = SUGGESTION | PASS (SM-Q5 : 120/60/60 ; EXT-Q3 : 40/40 exact) |
| engagement 9/14 | 9 pile → CÉLÉBRÉ | PASS (SM-Q5 G5 : 36/40 dont 9 pile) |

## Le statut des bornes non atteintes

Une conformité sous plafond n'est PAS un échec silencieux : SM-Q4 reporte
506/550 (non-crise), émo-Q4-R3 reporte CROISÉE 48 % < 62 % en FAIL
**publié** — et le verdict du package en porte la conséquence (4/5,
À CORRIGER). La doctrine : la borne non atteinte est un **signal
géométrique documenté**, jamais un chiffre maquillé.

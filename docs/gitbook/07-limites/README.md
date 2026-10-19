# Ce que le système ne prétend pas

> La crédibilité d'une mesure tient autant à ses limites déclarées qu'à
> ses forces. Cette page recense les avertissements, placeholders,
> contraintes légales et divergences documentées — tous extraits des
> sources, tels quels.

## 1. L'avertissement D-SIM

> « Résultats issus de simulations (seed 42) — la mécanique est validée,
> pas la prévalence clinique. »

- Les écrans produit affichent des **suggestions**, jamais des diagnostics.
- Les percentiles (population N(3,0 ; 0,8), 2 000 couples) sont des
  **placeholders L2** explicitement marqués « à remplacer par le pilote ».
- Le protocole VALID-01 prévoit d'**inverser la règle D-SIM à la fin du
  pilote** : les écrans passeront de « suggestion » à « normes mesurées »
  seulement après mesure réelle.
- Le longitudinal de RIO-02 (seuils de re-test i_alarm ± 2, normes ± 0,15)
  est **non testé** (décision D-Q2-F, reporté WTC-SUIVI).

## 2. Ce qui est absent des sources (n'invente jamais)

| Donnée | État |
|---|---|
| Texte des 18 items d'attachement (Q1) | codes/faces déposés, libellés absents |
| Texte des items santé mentale (SM-D1-1, SM-A2-3, SM-P1-2…) | absent des packages |
| Libellés des 18 items EXT-Q1 | non déposés (audit PI §10.2 : rejeu en attente du dépôt) |
| Référence académique complète Carstensen | absente du dépôt (aveu E-SM-7) |
| Signification littérale de T/U/L/M côté attachement | définie seulement côté émo (l = liens, u = compréhension, m = tendresse) |
| Formule z étendue du RCI (moyennes/écarts-types) | absente du code — classification par seuils uniquement |
| Fichiers fingerprint des packages SM-Q3 à EXT-Q3 | présents pour Q1-R3 et SM-Q2 uniquement |

## 3. Les contraintes légales (avant VALID-01 — blocant R3)

Tableau des licences d'usage des instruments de validité convergente
(`legal/licences-validite-convergente.md`) — **re-vérification datée
exigée avant tout déploiement VALID-01** :

| Instrument | Usage commercial | Décision WTC |
|---|---|---|
| ECR-R (Fraley et al., 2000) | **à vérifier avant VALID-01** (libre recherche seulement) | paraphrases de construits seulement |
| ERQ (Gross & John, 2003) | **à vérifier avant VALID-01** | comparaison de construits seulement |
| CSI (Funk & Rogge, 2007) | autorisé sans lettre selon l'auteur — re-vérifier la version | candidat validité convergente |
| DAS/RDAS (Spanier, 1976) | **JAMAIS — items protégés** | non utilisé, aucune intégration |
| MMPI / échelles Pearson-PAR | **JAMAIS** | exclus |
| Chapman (1992) matériaux | jamais cloner (canon 352-354) | construits cités uniquement |

Liste noire de clonage (11 items) : ECR, YSQ, DAS, KMSI, Willcox, Duluth
graphique, Chapman-matériaux, Gottman-matériaux, EFT/Hold Me Tight, CTS2,
MBI.

## 4. Les divergences documentées (conservées, pas corrigées en silence)

| Divergence | Sources | Statut |
|---|---|---|
| Seuil L4 attachement : 0,8836 vs 0,8837 | formule/rapport vs commentaire code | éditoriale, documentée |
| Note émo-Q4-R3 : 8/10 vs 6/10 | rapport vs README | documentée |
| Verdicts « À CORRIGER » + dimensions « complètes 5/5 » | rapports Q1-R1 (5/6), Q2-R1 (5/7), Q4 (4/5), émo-Q2-R1 (6/7), émo-Q4-r3 (4/5) vs déclarations de complétude des Q5 | les révisions R1/R2/R3 absorbent les FAIL ; les verdicts bruts restent gravés |
| Erratum réconciliation 580 → 500 | rapport SM-Q1-R3 Section F | corrigé dans SM-Q2-SPEC |
| « 4ᵉ extension comptée » (canon ligne 243) | canon | **ouverte — à identifier par le fondateur** (arbitrage EXT A1) |
| DRIFT LEDGER compteur de fautes (36/4 publié vs 37/5 worklog) | hub vs worklog | **ouvert — arbitrage fondateur** |

## 5. Les interdits lexicaux (ce que le système ne dira jamais)

- Aucun verdict de compatibilité chiffrée (pct jamais affiché).
- Aucun verdict sur le temps restant, aucun « modèle de la bonne saison »
  (C6 EXT-Q1).
- Aucun mot de la liste noire anti-blâme (« ta faute », « c'est toi »…).
- Aucun « rémission / guéri / guérison / échoué / sanctionné » (C6 SM-Q5).
- Aucune direction de boucle imputée à une rive.
- Aucune fabrication du positif : 0 force → **SILENCIEUSE**, mot pour mot —
  « c'est un constat, pas un défaut ».

## 6. Ce que VALID-01 doit apporter (la suite logique)

1. Contresignature niveau 2 du protocole (fond intégral) — en attente de
   relecture du superviseur.
2. Re-vérification datée des licences (R3, ci-dessus).
3. Conseil clinique (6 membres dont méthodologue — à constituer).
4. AIPD formelle + consultation juridique.
5. Tests d'infrastructure (D-ENV) + test d'incendie des filets + OSF.io +
   assurance RC.
6. Recrutement — **aucune donnée avant ces étapes**.

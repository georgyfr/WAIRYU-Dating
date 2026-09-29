# RAPPORT C1 — AUDIT HOSTILE DE LA QUÊTE 2.1 « TES VALEURS »

| Champ | Valeur |
|---|---|
| Auditeur | session séparée (sous-agent indépendant) — fiches de l'auteur interdites |
| Périmètre | 6 livrables `Livrable des mondes/M3-2.1-Tes-Valeurs/` + 5 fichiers machine `contenu/mondes/M3-boussole/2.1-valeurs/` |
| Méthode | Constitution [1]-[11] + les 9 dérives défilées |
| **VERDICT** | **À CORRIGER** (1 finding MAJEUR + 4 findings documentés) |

## Findings

### 6.1 — MAJEUR — des codes d'items dans les chaînes de citation des slots

Les chaînes `citations_exemples` des slots S1/S2/S4 portent les codes `(Q2.1-17)`, `(Q2.1-07)`, `(Q2.1-19)` **collés dans le texte rendu** — violation directe de la Constitution [3] (aucune métadonnée visible). Si l'implémenteur rend ces chaînes telles quelles, le code apparaît à l'utilisateur.

**Correction prescrite** : le code sort de la chaîne et vit dans un champ moteur distinct `ancre_item` ; la chaîne rendue ne contient que le rappel en toutes lettres.

### 6.2 — la citation S1 est infidèle à son ancre

S1 cite « le bien-être de tes proches passe avant ton programme du jour » — l'énoncé réel de Q2.1-17 est « La demande d'aide d'un proche passe avant mon programme du jour. » La paraphrase viole la règle du rappel MOT POUR MOT.

**Correction prescrite** : citation en toutes lettres = énoncé intégral de l'item.

### T.1 — provenances « attendu » vs « constaté »

Les en-têtes déclarent des états de validation au futur (« C1: paquet soumis, verdict en attente ») sans distinguer ce qui est constaté de ce qui est attendu. Le registre de traçabilité ne doit porter que le constaté.

### 5.1 — verrous d'ombre structurels absents des slots

Les `verrous_de_slot` garantissent le volume d'ombre mais n'exigent pas les DEUX verrous structurels [2] sur chaque tendance rendue : ancrage en situation de couple + coût pour soi ET coût pour l'autre, nommés.

### 4.1 et 8.1 — MINEURS, renvoyés au comité (verrou [9])

- 4.1 : surface lexicale partagée « Dans un groupe, » entre Q2.1-09 et Q2.1-23 (structurel, toléré — contrôle CI-10 documente le lexique décision absent) ; gabarit « avant ceux des autres » partagé entre Q2.1-21 et Q2.1-23.
- 8.1 : registre grammatical des trames Q2.1-21/22/24 diverge du registre « je… » des items carte.

## Ce qui a résisté (constaté, pas attendu)

- Échelle Likert 5, libellés exacts, recodage `6 − réponse` — conformes (arbitrages ①②).
- Les 4 trames ▲ n'alimentent aucun slot, aucune carte, aucun rappel — interdit structurel respecté.
- La règle de silence S3 (rappel uniquement à voix basse, ≥ 2 paires) — conforme.
- Zéro contamination du lexique décision dans Q2.1-23 v2 — conforme (garde CI-10).

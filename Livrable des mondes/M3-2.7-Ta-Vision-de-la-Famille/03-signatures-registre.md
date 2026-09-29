# LIVRABLE 3 — SIGNATURES ATTENDUES DE LA QUÊTE 2.7 (format du registre)

> ⚠ **Le dealbreaker parentalité est une règle du CONTRAT** (« score = 0 si divergence ≥ 2 ») — la
> production le documente et propose son opération SQL, elle ne le vote pas. Le seuil de l'horizon
> (4 ans) et le mapping score → années : verrou [9] — propositions, re-signature professionnelle avant bêta.
> Aucune signature de sécurité (trame) n'est attachée à cette quête — vérifié au registre du mélange.

## Les variables fournies par la quête

| Variable | Source | Domaine |
|---|---|---|
| **DESIR** | désir d'enfants = moyenne (échelle 1-5) de Q2.7-01 et Q2.7-02 recodé (`6 − r`) | 1-5 |
| **HORIZON** | proximité du projet = moyenne recodée normalisée (Q2.7-03/04) | 0-1 |
| **ROLES** | partage des rôles = moyenne recodée normalisée (Q2.7-05/06) | 0-1 |
| **FAM_EL** | place de la famille élargie = moyenne recodée normalisée (Q2.7-07/08) | 0-1 |

| ID | Nom | Conditions exactes | Conséquence | Source | Fenêtre cible |
|---|---|---|---|---|---|
| **SIG-2.7-01** | Le cap qui ne passe pas | **\|DESIR_A − DESIR_B\| ≥ 2** (échelle 1-5) — règle verbatim du contrat : « Dealbreaker parentalité (score = 0 si divergence ≥ 2) » | **Score de compatibilité = 0** — la paire est exclue par **SQL pré-filtrage**, AVANT tout calcul : coût moteur nul, aucune trace rendue chez l'un ni chez l'autre, aucun mot « dealbreaker » rendu (le mécanisme façonne le pool, il ne commente jamais les personnes — precedent SIG-2.3-01) | Contrat d'Inventaire (2.7) — règle tranchée, non re-votée | recalcul à chaque mise à jour d'une réponse au désir ⚠ |
| **SIG-2.7-02** | L'horizon qui ne se croise pas | **Écart d'horizon estimé > 4 ans** entre deux profils — l'estimation dérive de HORIZON via un mapping indicatif score → fourchette d'années (proposition : À VALIDER PAR LE COMITÉ [9]) | **Signal conversationnel « à aborder tôt »** — jamais une élimination, jamais un score : l'écart alimente les amorces de conversation, formulation À VALIDER PAR LE COMITÉ | 8 items (angle horizon) — contrat : « signal horizon » | recalcul à chaque mise à jour ⚠ |
| **SIG-2.7-03** | La friction des rôles (mission V8.C) | **Écarts forts sur la zone répartition (ROLES, FAM_EL — items 05-08)** entre deux profils — seuil de l'écart : À VALIDER PAR LE COMITÉ [9] (proposition : distance pondérée des deux angles, signal au-delà d'un écart fort) | **Signal conversationnel « à aborder tôt »** — jamais une élimination, jamais un score : les rôles et la place des familles élargies se parlent mieux tôt ; aucune des deux postures n'est qualifiée | 4 items de répartition (05-08) — mission V8.C : « friction des rôles » | recalcul à chaque mise à jour ⚠ |

## Notes de registre

- **Le dealbreaker en SQL pré-filtrage (proposition d'opération, règle verbatim du contrat)** :
  ```
  -- Pré-filtrage parentalité — s'exécute AVANT tout calcul de compatibilité
  SELECT a.member_id AS a, b.member_id AS b
  FROM desir a JOIN desir b ON b.member_id <> a.member_id
  WHERE ABS(a.desir_score - b.desir_score) >= 2;   -- → score = 0, paire exclue
  ```
  La règle (divergence ≥ 2) appartient au contrat ; l'opération SQL est une PROPOSITION de
  production — toute autre implémentation équivalente reste conforme.
- **Silence total du dealbreaker** : aucune trace, aucun texte, aucun « pourquoi » — comme tout hard
  constraint du système, il façonne le pool sans jamais commenter les personnes.
- **SIG-2.7-02 est un signal, pas un filtre** : un écart d'horizon de 5 ans se traverse parfois —
  il se PARLE mieux tôt ; c'est tout ce que le signal fait : le faire parler tôt.
- **Registre probabiliste obligatoire** : « la recherche documente que », jamais « vous finirez ».
- Le nom interne (DESIR, HORIZON, ROLES, FAM_EL, SIG-2.7-*) vit côté moteur uniquement. (L'ancienne
  variable CADRE — angle « modèle d'éducation » Vague 6 — est archivée : re-spécification mission
  V8.C, la place des familles élargies remplace le modèle d'éducation.)

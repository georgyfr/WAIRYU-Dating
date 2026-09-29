# RE-AUDIT DELTA C1 — QUÊTE 2.1 (clôture)

| Champ | Valeur |
|---|---|
| Portée | delta : vérification des corrections prescrites par le rapport C1 du 2026-09-28 |
| Clôture | **par l'auditeur** (pas par l'auteur) |
| **VERDICT GLOBAL QUÊTE 2.1** | **À CORRIGER → LIVRABLE** — la quête 2.1 est la PREMIÈRE QUÊTE LIVRABLE de Wairyu |

## Vérifications delta

| Finding | Correction vérifiée | Résultat |
|---|---|---|
| 6.1 (codes dans les chaînes) | `ancre_item` en champ moteur distinct ; chaînes rendues sans code (S1/S2/S4) | ✅ conforme |
| 6.2 (citation S1 infidèle) | citation = énoncé intégral mot pour mot de Q2.1-17 | ✅ conforme |
| 5.1 (verrous d'ombre) | 2 verrous ajoutés aux `verrous_de_slot` (situation de couple + deux coûts nommés) | ✅ conforme |
| T.1 (provenances) | alignées sur le constaté dans les en-têtes | ⚠ résidu attrapé au delta |

## Le résidu attrapé (deuxième preuve de la thèse en une journée)

L'exécuteur avait aligné l'en-tête du fichier items.yaml et OUBLIÉ le bloc machine `meta.provenance.validateur` — l'en-tête disait le constaté, le bloc machine répétait l'attendu. **Correction prescrite appliquée, rehash fait, empreinte mise à jour.** Leçon gravée : dans un système à double couche (en-tête lisible + bloc machine), chaque déclaration de provenance existe DEUX fois — et doit être corrigée DEUX fois.

## Traçabilité

- Empreintes post-correction : items.yaml `b7da1c208600ea15…` · slots.yaml `68bc78f5250b53a0…` (manifeste rehashé).
- CI : 15/15 après correction (le verrou n'a jamais été démonté).
- Findings 4.1 et 8.1 : restent au comité (verrou [9]).

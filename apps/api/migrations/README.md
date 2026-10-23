# Migrations D1 — conventions et réconciliation

Le dossier `migrations/` est la **ligne canonique** : appliqué tel quel, un
fichier = une migration, jamais d'ALTER destructif, numérotation séquentielle.

## Le numéro 0014 (réconciliation — audit app)

- **Aucun fichier 0014 n'a jamais existé dans la ligne canonique du dépôt** :
  le numéro fut réservé pendant le chantier Rencontres puis laissé libre.
  Rien n'est manquant — prod (17 migrations appliquées) et les tables des deux
  bases sont à jour de ces 17 fichiers.
- L'ancienne ligne d'expérimentation **staging** a produit des fichiers hors
  canon (« 0013_rencontres_messages », « 0010_quest_feedback », numéros
  0019-0025 d'expérimentations découvertes/profils) : ils appartiennent à
  l'historique staging et ne font PAS partie du canon. Les « 0013_rencontres_
  messages » ont été repris par « 0015_rencontre_e2.sql ».
- Conséquence pratique : `wrangler d1 migrations apply` sur les deux bases
  n'a RIEN à rattraper — l'écart 0013→0015 dans `d1_migrations` est attendu.

## État des bases (vérifié via API le 2026-10-23)

| Base | Migrations appliquées | Note |
|---|---|---|
| `wairyu-prod` | 0001→0018 (17) = les 17 fichiers du dépôt | à jour, 0014 absent des deux côtés |
| `wairyu-staging` | 0001→0018 + ligne expérimentation | à jour du canon |

## Hygiène (0019)

0019 supprime deux index dupliqués posés par 0015 (deux noms, même colonne).
Détail en tête du fichier.

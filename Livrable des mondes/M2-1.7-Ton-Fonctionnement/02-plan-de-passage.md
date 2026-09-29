# LIVRABLE 2 — PLAN DE PASSAGE (sans mélange — choix documenté)

```
MÉLANGE ................. SANS-OBJET — aucune course, aucune graine, aucune contrainte c1-c6
ORDRE DE PASSATION ...... ordre source FIXE : Q1.7-01 → Q1.7-02
STATUT .................. séquence de CONSENTEMENT (choix de design documenté, non aléatoire)
```

## Pourquoi cette quête n'a PAS de plan de mélange

Le plan de mélange protège la mesure contre les biais d'ordre (fatigue, regroupement de dimensions,
pistes de désirabilité) sur des blocs d'items **interchangeables et mesurés**. La quête 1.7 n'est pas
une mesure : ce sont 2 questions déclaratives opt-in, **jamais dans aucun score** (verbatim intro),
dont l'ordre porte le sens.

## L'ordre source est une séquence de consentement

| Étape | Question | Ce que la personne décide |
|---|---|---|
| 1ᵉʳ | **Q1.7-01** — « Coche ce qui te décrit, si tu veux le partager : » | CE QUI est partagé (et le droit de ne rien dire) |
| 2ᵉ | **Q1.7-02** — « Une personne qui te matche peut-elle voir que tu es à l'aise avec la neurodiversité ? » | QUI peut le voir (visibilité, après que le contenu existe) |

- Inverser l'ordre casserait le consentement : la visibilité (02) ne se décide que sur ce qui a déjà
  été déclaré (01). L'ordre est donc **fonctionnel, pas aléatoire** — le mélanger n'aurait aucun
  effet protecteur et dégraderait la clarté du consentement.
- La question 02 reste posée et répondable même si aucune case de 01 n'est cochée (réponse « Non »
  par défaut d'usage) — aucune dépendance bloquante, mais l'ordre de présentation reste 01 → 02.

## Conséquences techniques

| Élément | Statut |
|---|---|
| Graine | aucune — rien à séedé |
| Contraintes c1-c6 | sans-objet (2 items, hors échelle, sans dimension, sans trame) |
| Outil `ci/outils/melange.py` | non exécuté pour cette quête — aucune config `ci/quetes/1.7.json` requise |
| Fiche de Mutation | non requise pour l'absence de mélange ; TOUT changement d'ordre ou d'option passe par FM documentée |
| Verdict | sans-objet — aucun verdict de mélange n'est déclaré pour cette quête |

## Finding — borne de run : SANS OBJET (mission Phases A/B/C/D, point 3)

> Règle gravée : **on ne publie jamais un verdict non atteignable.** Ici il n'y a ni mélange ni
> course : aucune contrainte c1-c6 ne s'applique, donc aucune borne de run n'est contractée ni
> requise. Le statut est le sans-objet décisionnel documenté (ordre source FIXE — séquence de
> consentement), pas un verdict manqué. La graine est sans objet de fait : aucune graine n'est
> enregistrée pour cette quête (aucun champ `graine` dans une config de mélange — la chaîne
> 210427 + 1000 × ordinal ne s'applique qu'aux quêtes mélangées).

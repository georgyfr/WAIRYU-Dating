# WAIRYU — Plateforme de rencontre hybride dual-mode

> « Et si, avant de demander *« à quoi ressembles-tu ? »*, nous demandions *« comment veux-tu rencontrer ? »* »

Wairyu est une application de rencontre hybride avec deux modes complémentaires dans un seul compte :

- **Mode Classique** — photos visibles, swipe, rapidité.
- **Mode Invisible** — photos floutées, questionnaire progressif, conversation avant le visuel, révélation mutuelle et consentie des photos.

**Infrastructure cible : 100 % sur l'offre gratuite de Cloudflare** (Workers, D1, R2, KV, Durable Objects, Workers AI, Cron Triggers, Turnstile, Web Push).

---

## Contenu du dépôt

| Dossier / fichier | Contenu |
|---|---|
| `specification/` | Spécification produit v0.1 complète (document fondateur, ~13 000 lignes) |
| `docs/ANALYSE-APPROFONDIE.md` | Analyse du projet, verdict de faisabilité, architecture Cloudflare gratuite corrigée (8 décisions d'architecture clés), budget de requêtes, modèle de données D1, cartographie de l'API |
| `docs/PLAN-DE-REALISATION-12-ETAPES.md` | Plan de réalisation du début à la fin : 12 étapes détaillées avec sous-étapes, portes de validation, conformité RGPD, stratégie de test & lancement |
| `etapes/` | Journal et livrables de chaque étape, poussés au fur et à mesure de leur achèvement |
| `STATUS.md` | Tableau de bord de l'avancement des 12 étapes |

---

## Méthode de travail

Le projet est réalisé de façon **itérative** : chaque étape est construite, testée et validée (porte de validation / *gate*) avant de passer à la suivante. Dès qu'une étape est intégralement terminée, elle est poussée dans ce dépôt (dossier `etapes/`) avec ses livrables.

## Phases produit (rappel)

1. **Cœur Wairyu** (MVP) : dual-mode, questionnaire N1-N2, matching explicable, chat temps réel, révélation mutuelle, sécurité, modération.
2. **Wairyu Cultures** : Profil d'Héritage, matching culturel, salons culturels, Coach Culturel.
3. **Wairyu Moments & événements** : billetterie, check-in, défis.

## Lien

- Spécification produit v0.1 : [`specification/PROJET-WAIRYU-Specification-Produit-v0.1.txt`](specification/PROJET-WAIRYU-Specification-Produit-v0.1.txt)

# STATUS — Suivi de l'avancement du projet Wairyu

> Tableau de bord mis à jour à chaque fin d'étape. Une étape n'est marquée « Terminée » qu'après validation de sa porte (gate).

| # | Étape | Statut | Date de fin | Gate validée |
|---|-------|--------|-------------|--------------|
| 0 | Cadrage & décisions fondatrices | ⏳ En attente | — | ☐ |
| 1 | Socle technique & infrastructure Cloudflare | ⏳ En attente | — | ☐ |
| 2 | Authentification & comptes | ⏳ En attente | — | ☐ |
| 3 | Profils & photos protégées | ⏳ En attente | — | ☐ |
| 4 | Questionnaire progressif & moteur de matching | ⏳ En attente | — | ☐ |
| 5 | Découverte dual-mode (Classique & Invisible) | ⏳ En attente | — | ☐ |
| 6 | Chat temps réel & révélation | ⏳ En attente | — | ☐ |
| 7 | Sécurité & modération | ⏳ En attente | — | ☐ |
| 8 | Monétisation préparée (éteinte) | ⏳ En attente | — | ☐ |
| 9 | Qualité, tests & beta fermée | ⏳ En attente | — | ☐ |
| 10 | Lancement francophonie | ⏳ En attente | — | ☐ |
| 11 | Post-lancement : épaississement & montée en charge | ⏳ En attente | — | ☐ |

## Journal des livraisons

| Date | Livraison | Contenu |
|------|-----------|---------|
| — | Initialisation du dépôt | Spécification v0.1 + Analyse approfondie + Plan de réalisation 12 étapes |
| — | Décision d'architecture n°9 : stockage sans carte bancaire | R2 reporté (activation exige une carte) → **Cloudinary plan gratuit** pour photos + voice notes (assets authentifiés, URLs signées TTL ~15 min, module `StorageService` interchangeable) ; docs Analyse + Plan mises à jour |

## Accès & comptes

| Service | État | Note |
|---|---|---|
| GitHub (georgyfr/WAIRYU-Dating) | ✅ Actif | Dépôt officiel du projet |
| Cloudflare — Workers, D1, KV, Durable Objects, Turnstile | ✅ Vérifié par tests réels | Sous-domaine réservé : `wairyu.workers.dev` |
| Cloudflare — R2 | ⏸️ Reporté | Activation impossible sans carte bancaire → Cloudinary le remplace (Décision 9) |
| Cloudinary (photos/voice notes) | ⏳ À créer | Inscription gratuite, email uniquement, aucune carte |
| Brevo ou Resend (emails OTP) | ⏳ À créer | Inscription gratuite, plan gratuit 300/100 emails par jour |

# SPEC — MODÉRATION & APPEL (v1.1, Tasks 114/115)

Complément direct de la Task 109 (console `#/admin`) et de la SPEC E3 §9. Statut : SESSION SPEC UNIQUEMENT — rien d'implémenté, prod inchangée (42b8d538).

---

## 0. L'état gravé (vérifié Task 114, zéro dev)

- **`rencontre_signalements`** (0015) : 6 motifs fermés (`escroquerie_ou_argent`, `harcelement`, `faux_profil`, `contenu_inapproprie`, `fetichisant`, `autre`), détail ≤ 1000, `statut` ouvert → traite/rejete. **L'anonymat du signalant est gravé** (E2 : « l'autre n'est jamais informé »).
- **`rencontre_blocages`** (0015) : blocage par paire, silencieux, purge le fil côté victime.
- **La console `#/admin`** (Task 109) : aperçu, signalements (filtre + trancher), blocages — **lecture et classement seulement**. Garde `ADMIN_TOKEN` (401 vérifié en prod).
- **`audit_admin`** (0013) : action, cible hachée si nécessaire, details JSON.
- **Ce qui N'EXISTE PAS** : aucune mesure de protection (ni gel, ni ban) — « traiter » un signalement ne change qu'un statut ; **aucun recours** — un utilisateur qui se croit sanctionné à tort n'a aucun chemin.

## 1. Décisions gravées (l'héritage produit tranche — aucune nouvelle doctrine)

- **M-1 — La première protection reste l'utilisateur.** Le blocage silencieux et le signalement E2 sont la base ; toute mesure centrale est un complément, jamais un substitut. Une paire qui se gère n'a pas besoin d'un juge.
- **M-2 — Toute mesure humaine est tracée** dans `audit_admin` (action, cible, motif, référence du signalement le cas échéant). Aucune action hors console.
- **M-3 — Le modérateur est unique : le fondateur.** Pas de jury, pas de réputation communautaire, pas de modération déléguée.
- **M-4 — Aucune sanction automatique.** Zéro déclenchement par heuristique ou volume : chaque mesure est une décision humaine (le faux positif coûte plus cher que le retard).
- **M-5 — Toute sanction est révocable.** Une mesure sans chemin d'appel n'existe pas dans ce produit ; l'appel peut tout lever.
- **M-6 — La sanction se voit, le signalant jamais.** L'utilisateur concerné est informé du fait de la mesure (pas de sanction fantôme) avec un message NEUTRE gravé — jamais le nom du signalant, jamais le détail des réponses de l'autre.
- **M-7 — RGPD inchangé.** Le gel n'efface rien ; la purge reste le hardDelete existant. Un compte purgé n'a plus de recours (rien à rétablir) — le recours concerne les sanctions actives uniquement.

## 2. Propositions (P — à valider)

### P1 — Deux mesures graduées, pas plus
- **N1 « Pause Rencontre »** : le compte sort du pool E1 (plus de pas, plus de matchs), ne peut plus envoyer de message ni de média (E2 et E3) ; ses conversations existantes deviennent lecture seule pour lui. Il garde le Voyage (quêtes, réponses, récoltes personnelles).
- **N2 « Pause complète »** : sessions invalidées à la prochaine requête, écran de sanction à la reconnexion. Réservé aux cas graves (escroquerie, harcèlement persistant).
- Une seule mesure active par compte (la plus haute). La levée rétablit tout, sans trace visible pour les autres membres (pas de stigmate, pas d'oracle).

### P2 — Table `moderation_sanctions` (additive, conventions 0012/0015)
`id UUIDv4 PK · user_id NOT NULL · niveau 1|2 · signalement_id (nullable, lien) · cree_a · levee_a (nullable) · levee_par (nullable) · details ≤ 500`
Migration `0018_moderation_sanctions.sql` + `moderation_appels` (P4). Toute pose/levée écrit dans `audit_admin`.

### P3 — Application du gel (gardes existantes réutilisées)
Un check de sanction dans `requireAuth` (lecture unique par requête, mise en cache de la requête) : N1 → routes rencontres/messages en écriture refusées 403 `compte_en_pause` (message neutre gravé + mention de l'appel) ; N2 → 401 → écran sanction. La portail/pool filtre le pool côté serveur (le membre sanctionné n'apparaît plus, ne voit plus).

### P4 — Le chemin d'appel : IN-APP (recommandé)
- L'écran de sanction porte un bouton **« Demander une relecture »** → textarea ≤ 1000 caractères → table `moderation_appels` (`id · user_id · sanction_id · message · statut ouvert/accepte/rejete · cree_a`). Un appel actif à la fois ; rate rule `modAppelUser` 3/j.
- La console `#/admin` gagne une section **Appels** (file des ouverts, message, sanction liée, boutons accepter/rejeter). Accepter = levée de la sanction (tracée).
- Honnêteté : aucun délai promis dans l'UI (le fondateur répond quand il peut) — le texte gravé dit « une relecture humaine, sans délai garanti ».
- Alternative rejetée : email externe (dépendance, hors audit, RGPD flou).

### P5 — Le circuit complet
signalement (E2) → relecture console (média signalé si E3-P9 validé, accès tracé) → trancher : rejeté (rien) / traité + **mesure** N1 ou N2 → le membre voit son écran de sanction → appel possible → levée ou maintien. Chaque flèche est tracée.

### P6 — Croisement E3
Si la spec E3 est validée (P9), l'accès du modérateur au média signalé passe par la même console, tracé `audit_admin`, unique cas d'accès humain aux médias — jamais pour la gestion courante.

## 3. Décisions fondateur — GRAVÉES (v1.1, GO « OK tout » 2026-10-17)

Les 6 points ouverts de v1.0 sont désormais **décisions gravées** (G-MA-1..6) — le fondateur a validé les recommandations en bloc :

1. **G-MA-1 — Deux niveaux** : N1 « Pause Rencontre » et N2 « Pause complète ».
2. **G-MA-2 — Fils existants en lecture seule** pour le compte sanctionné (N1) — la paire opposée n'est pas punie par la disparition du fil.
3. **G-MA-3 — Appel in-app** : bouton « Demander une relecture » + table `moderation_appels` + section Appels dans la console.
4. **G-MA-4 — Message de sanction neutre gravé** : « Ton compte est en pause après un signalement. Une relecture humaine est possible — sans délai garanti. »
5. **G-MA-5 — 1 appel actif à la fois, ≤ 1000 caractères, 3/j** (`modAppelUser`).
6. **G-MA-6 — Appel accepté = zéro trace pour les autres** (levée sans stigmate ; l'audit interne conserve le trajet).

## 4. Hors périmètre

Ban IP / anti-abus réseau · modération automatique du contenu (IA) · délégation de modération · sanctions monétaires (Lucioles, Étape 8) · déblocage post-blocage utilisateur-à-utilisateur (le blocage paritaire reste silencieux et définitif de lui-même — réfléchi séparément si demandé).

## 5. Journal

- **v1.1 (2026-10-17, Task 115)** — GO fondateur « OK tout » : les 6 points ouverts deviennent les décisions gravées G-MA-1..6 (sans modification d'aucune reco). Le build suit ( même passe staging que E3).
- **v1.0 (2026-10-17, Task 114)** — création après constat : la console Task 109 ne sait que CLASSER (aucune mesure) et aucun recours n'existe. État gravé vérifié (0015, 0013, admin.ts, Moderation.tsx). 7 décisions gravées (M-1..7), 6 propositions (P1..6), 6 points ouverts numérotés. Rien implémenté.

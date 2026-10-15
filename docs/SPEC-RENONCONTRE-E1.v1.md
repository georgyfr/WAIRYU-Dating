# SPEC RENCONTRE-E1 — v1.0 (2026-10-15)

**Statut : DESIGN. Rien n'est implémenté. Prod inchangée (2187c750).**
Débloquage de l'espace Rencontre à la fin du Monde 1 — exigence fondateur consignée verbatim, architecture en deux jalons, propositions numérotées **P** à valider, décisions fermées gravées **D-R**.

---

## 0. Exigence fondateur (verbatim, Task 93)

> « lorsqu'un utilisateur a achevé sa quête du monde 1 avec toutes les récompenses qui va avec le monde 1, cela doit lui faire accéder immédiatement au site de rencontre où il pourra rencontrer des personnes qui ont effectué aussi le monde 1 dans son entièreté. Bien évidemment, plus il évoluera dans les mondes, plus il pourra rencontrer aussi des personnes qui ont évolué dans les différents mondes comme lui. »

Tranchage du périmètre (fondateur, 2026-10-15, verbatim) :

> « Monde 1 » = Le Miroir seul (1.1→1.3) **et** tout le bloc 1.x (1.1→1.11)

**Interprétation opérationnelle retenue (à corriger d'un mot si faux)** : les deux jalons comptent — le Miroir **ouvre**, le bloc 1.x **approfondit**. Voir D-R1.

## 1. Décisions gravées (fermées)

- **D-R1 — Déblocage en deux jalons** :
  - **Jalon A « La porte s'ouvre »** : les trois quêtes du Monde 1 « Le Miroir » (1.1, 1.2, 1.3) sont terminées — sceau du Miroir en poche. L'espace Rencontre devient **immédiatement** fonctionnel pour ce membre.
  - **Jalon B « La pleine profondeur »** : le bloc 1.x est complet (1.1→1.11, dont « Es-tu prêt·e à rencontrer ? » — quête de passage qui clôt le Volant). Le profil de rencontre du membre gagne sa profondeur complète et son pool se cible mieux.
  - Rien du bloc 1.x n'est retiré : le Volant reste le chemin de préparation (son résumé produit : « …et si tu es prêt·e à rencontrer »).
- **D-R2 — « La rencontre n'est jamais payante »** : gravé trois fois dans le produit (placeholder #/matchs, note du Monde 11, D18). Non négociable, survivra à toute évolution du modèle « Fanal ».
- **D-R3 — Jamais de rencontre inventée** : état vide honnête tant qu'aucune personne réelle n'est dans le pool (règle existante du bundle, reprise telle quelle).
- **D-R4 — Anti-score** : aucun note, classement, pourcentage de compatibilité affiché. Le footer existant (« Ce ne sont pas des notes ») s'étend à l'espace Rencontre.

## 2. Ce qui existe déjà (ancrage code, zéro dev nouveau requis pour l'ancrage)

- **Écran « Tes rencontres »** (`#/matchs`, Rencontres.tsx) : placeholder honnête — « Certaines rencontres commencent ici. », état vide 💞, « Comment ça commence\*? » (verbatim, espace insécable), CTA vers la carte du voyage.
- **La porte existe dans le Voyage** : 4ᵉ porte « Tes rencontres » — « Je me rapproche des bonnes personnes » → `#/matchs`.
- **Le jalon 6 du voyage EST « La Rencontre »** (💞, « faire le premier pas vers la bonne personne — puis le Voyage à Deux ») — aujourd'hui `status: "soon"`.
- **Le Monde 11 « Le Voyage à Deux »** : « Se débloque à ton premier match — la rencontre n'est jamais payante » ; format gravé « la voix passe avant le visage : texte, puis voix, puis photo, toujours avec le consentement des deux ».
- **TabBar actuelle** : Voyage · Mondes · Quête · Parcourus · Récolte — `#/matchs` est adressable (deep-link) mais non exposé.
- **Espaces dating masqués** : `#/decouvrir`, `#/messages`, `#/profil` → écran Masque honnête (« Cet espace n'est pas encore ouvert »).
- **La progression serveur existe** : Task 69-c — les états de quêtes sont synchronisés en D1 (table `reponses`). Le serveur peut donc **dériver le jalon A et le jalon B de chaque membre** sans nouveau stockage de progression.
- `progression.ts` : « le 51ᵉ pas est la Rencontre » — la présente spec **anticipe** ce pas (déblocage au Monde 1, pas à la fin des 50 quêtes), selon la décision du fondateur.

## 3. Architecture E1 proposée (P = propositions, à valider)

### P1 — Exposition dans l'app
- Avant le jalon A : `#/matchs` garde son écran honnête actuel. **La TabBar ne change pas** (5 tabs) — pas de tab fantôme pour un espace non ouvert.
- Au jalon A : un **6ᵉ tab « Rencontres »** apparaît (💞), et l'écran devient fonctionnel (pool réel). Le jalon 6 du voyage passe de « soon » à « ouvert ».
- Proposition de continuité : au moment du déblocage, l'écran d'accueil de l'espace rappelle le chemin parcouru (« Le Miroir est derrière toi. Certaines rencontres commencent ici. ») — texte à rédiger avec le fondateur.

### P2 — Le pool (mutuel et plancher commun)
- Deux membres se voient dans le pool **si et seulement si chacun a atteint le jalon A** (Miroir 3/3 côté serveur, dérivé de la table `reponses`). Plancher dur des deux côtés — c'est la lecture directe de l'exigence : « des personnes qui ont effectué aussi le monde 1 dans son entièreté ».
- **La progression au-delà du jalon A trie, elle n'exclut pas** (P2-b) : le tri met d'abord les membres qui partagent le plus de territoires communs (mondes franchis identiques, cartes correspondantes). Un membre au jalon B voit aussi les membres au jalon A — jamais l'inverse pour l'instant (le plus avancé choisit s'il s'adresse au moins avancé ; le moins avancé ne voit jamais au-dessus du plancher commun + sa propre profondeur).
  - [À VALIDER] : la règle de visibilité asymétrique ci-dessus, ou un plancher symétrique strict « même monde courant ».

### P3 — Le profil de rencontre
- Contenu du profil visible dans le pool : pseudo d'affichage, la profondeur du voyage (ex. « Monde 2 · Le Volant — en cours »), les cartes que le membre choisit d'exposer. **Consentement d'exposition explicite** : le membre choisit quelles cartes montrer ; défaut = aucune carte, seule la profondeur.
- Aucune donnée d'identité au-delà du pseudo ; aucune photo en E1 (le Monde 11 gravé : « la voix passe avant le visage »).

### P4 — Le premier pas (le cœur du jalon 6 « La Rencontre »)
- « Faire le premier pas » = une indication d'intérêt envoyée à une personne du pool. **Réciprocité requise** : la conversation ne s'ouvre que si l'autre répond par le même intérêt (deux pas = un match).
- Au premier match : le Monde 11 « Le Voyage à Deux » se débloque (sa note produit l'annonce déjà : « Se débloque à ton premier match »), et la conversation E1 reste minimale (E2 pour les messages réels).

### P5 — Backend (D1 + Workers, l'existant suffit en grande partie)
- Tables nouvelles : `rencontre_profils` (user_id, profondeur dérivée, cartes exposées, majA), `rencontre_pas` (de, vers, crééA, statut), `rencontre_matchs` (a, b, crééA).
- Endpoints : `GET /api/rencontres/pool` (paginé), `POST /api/rencontres/pas`, `GET /api/rencontres`, `DELETE /api/rencontres/pas/{id}` (retrait). Rate limits du même gabarit que l'existant.
- RGPD : `hardDeleteAccount` est étendu aux trois tables nouvelles (purge immédiate, même doctrine que le reste).
- Anti-abus E1 : un « pas » par personne et par destinataire jusqu'à réponse ; retrait possible à tout moment ; signalement/block listé pour E2 (le check-in sécurité du Monde 11, « gratuit et permanent », reste le filet de fond).

### P6 — Honnêteté et doctrine
- Le pool affiche des personnes **réelles uniquement** ; si le pool est vide → l'état vide honnête existant (jamais de compte fictif, jamais de « populaire près de toi »).
- Aucune mécanique de score de compatibilité chiffrée exposée (D-R4). L'appariement E1 est plancher + tri, pas une note.
- La langue suit l'app (FR/EN), même canon d'écriture (tutoiement, phrases courtes, apostrophe ASCII, jamais de diagnostic).

### P7 — Phases après E1
- **E2 — Conversations** : messages texte réels dans l'app (`#/messages` sort du Masque pour les membres appariés), modération et signalement.
- **E3 — Le Voyage à Deux** : les quêtes croisées du Monde 11 (texte → voix → photo, consentement des deux à chaque seuil — déjà gravé au Livrable).
- **Hors spec, jamais en E1** : géolocalisation, swipe infini, photos de profil.

## 4. Hors périmètre E1

Tout ce qui n'est pas P1→P6 : conversations réelles (E2), quêtes à deux (E3), « Découvrir » et « Profil » dating (masqués — leur sortie du Masque sera specifiée séparément), notifications push dédiées à la rencontre (l'architecture existante suffira, à brancher en E2).

## 5. [À VALIDER] — décisions fondateur restantes

1. **Valider D-R1** (l'interprétation « le Miroir ouvre, le bloc 1.x approfondit ») — ou corriger d'un mot.
2. **P1** : l'écran honnête actuel suffit-il avant le jalon A, ou souhaitez-vous un tab « Rencontres » visible dès le début (menant à l'écran honnête) ?
3. **P2-b** : visibilité asymétrique (le plus avancé voit le moins avancé) ou plancher symétrique strict ?
4. **P3** : les cartes exposées par défaut — aucune (recommandé), ou les trois cartes du Miroir par défaut ?
5. **P4** : le premier pas est-il **aveugle** (l'autre voit « quelqu'un a fait un pas » sans nom tant qu'il n'a pas répondu — recommandé, plus doux) ou **nommé** ?
6. Nom de l'espace dans la nav : « Rencontres » (recommandé — c'est le verbatim produit existant) ou autre.

## 6. Journal

- **v1.0 (2026-10-15)** — création : exigence fondateur consignée (Task 93), périmètre tranché (« Miroir ET bloc 1.x »), architecture E1 proposée, ancrage code vérifié (Rencontres.tsx, voyage.ts jalon 6 + M11, Task 69-c). Rien implémenté. Prod inchangée.

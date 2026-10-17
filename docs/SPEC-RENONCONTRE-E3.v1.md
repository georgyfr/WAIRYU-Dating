# SPEC — RENCONTRE-E3 « Le Voyage à Deux » (v1, Task 112)

Phases du volet Rencontre : **E1 le pas et le match (livré) → E2 les conversations (livré) → E3 le Voyage à Deux (CE document).**

Statut : SESSION SPEC UNIQUEMENT (GO fondateur : « commencer par une session SPEC uniquement »). Rien d'implémenté, prod inchangée (ec034794).

---

## 0. L'exigence gravée (aucune nouvelle décision, tout existe déjà dans le produit)

- **Le Monde 11 « Le Voyage à Deux »** (`voyage.ts`) : 6 quêtes, tagline « Les quêtes se vivent à deux : questions croisées, réponses partagées, rendez-vous préparé. », **toujours gratuit**, « Se débloque à ton premier match — la rencontre n'est jamais payante », `status: "soon"`.
- **Le format gravé du M11** (consigné en E1) : « la voix passe avant le visage : **texte, puis voix, puis photo, toujours avec le consentement des deux** ».
- **La Révélation progressive** (économie v1.5 §2.2) : « 1. les mots → 2. les cartes → 3. la voix → 4. la photo. Ouverts seulement si les deux acceptent. Un refus à un niveau n'est jamais pénalisé et ne se voit pas. » Niveau 4 : le Statut « Prêt·e » des deux — **jamais d'argent (D15)**.
- **Fragments de connexion / Récoltes à deux** (économie §2.2) : récompenses qui n'apparaissent qu'après une activité consentie par les deux (répondre à trois questions, préparer un rendez-vous…). Terre-plein de M11. « Jamais conditionnées à la révélation d'infos sensibles ; jamais une note de la relation. »
- **Le Duo de cartes** (économie §2.2) : après un match, si les deux ont complété la même quête — vue côte à côte des deux cartes + une question de dialogue. Consentement des deux ; « outil de dialogue, pas un verdict comparatif ».
- **Le Rendez-vous préparé** (économie §2.2) : après un match, trois idées de sortie et des questions, tirées des rythmes et du temps libre des deux. **Gratuit (D16)**. « Une proposition, pas un programme : les deux choisissent. »
- **La récolte M11 gravée** : « débloqué au premier match, toujours gratuit — la récompense, c'est la réponse de l'autre. »

## 1. Décisions gravées (fermées — l'héritage produit tranche)

- **D-E3-1 — Le Voyage à Deux s'ouvre aux DEUX, sur un match existant.** Aucune activité à deux ne démarre à un seul : chaque état E3 exige les deux lignes de consentement (héritage direct du pas E1 et du reveal E2). Une paire sans match ne voit jamais E3.
- **D-E3-2 — L'ordre texte → voix → photo est non négociable.** E2 a livré « les mots » ; E3 ouvre « les cartes » (niveau 2), « la voix » (niveau 3), « la photo » (niveau 4) — chaque niveau ne s'ouvre qu'après le précédent, et chacun avec SA porte propre.
- **D-E3-3 — La demande se voit, le refus jamais.** Proposer un niveau est une invitation visible (même UX que E2 : « propose de… — dire oui »). Le silence de l'autre n'a AUCUN statut « refusé » stocké ni exposé — pas de ligne de refus, pas d'oracle, pas de pénalité.
- **D-E3-4 — Jamais une note de la relation** (D-R4 étendu au couple) : le Duo est un outil de dialogue, pas un verdict ; aucune métrique de « compatibilité », aucune jauge de santé relationnelle, aucune streak, aucun classement de paires.
- **D-E3-5 — La récompense à deux n'est jamais conditionnée à la révélation d'infos sensibles** ; « la récompense, c'est la réponse de l'autre ». **M11 et tout E3 sont gratuits** (D-R2 — la rencontre n'est jamais payante).
- **D-E3-6 — Tout média est privé-paire, sans URL publique.** La voix et la photo voyagent PAR le Worker : session + membership + niveau de voile vérifiés à CHAQUE requête (get et put). Jamais de bucket public, jamais de CDN tiers, jamais d'URL signée partageable.
- **D-E3-7 — Le blocage/unmatch E2 gèle tout E3.** Le blocage silencieux masque les surfaces à deux comme le fil (pool, envoi neutre, pas de temps réel). L'unmatch purge physiquement les états à deux ET les objets médias, en plus des tables E2 déjà purgeées.
- **D-E3-8 — E3 livre la MÉCANIQUE + un pilote de contenu ; les 6 quêtes complètes du M11 restent la Phase C** (production de contenu C4, ordre : après M8/M9). La mécanique est indépendante du contenu : quand les 6 quêtes naîtront, elles couleront dans le moulin E3 sans re-dev.
- **D-E3-9 — RGPD total.** Export étendu (réponses aux activités à deux, métadonnées médias) ; purge physique étendue (tables nouvelles + objets R2 du membre).

## 2. Ancrage code (vérifié Task 112, zéro dev pour l'ancrage)

- Le badge **« Révélés ✦ »** (E2) : deux lignes `rencontre_reveals` = la marque de volonté mutuelle déjà en prod — la PORTE naturelle de la voix.
- **`reponses`** (0011 : user_id, quete '1.1'…, etat JSON) : le serveur dérive déjà le jalon A d'E1 de cette table — il dérivera de même (a) l'intersection des quêtes complétées par la paire (base du Duo) et (b) le Statut « Prêt·e » (quête 1.11 franchie, porte de la photo).
- La règle rate **`chatVoiceUser`** est déjà posée (D-E2-2 : « voice notes prévues plus tard ») — E3 la branche.
- **Les Lucioles ne sont PAS en code** (Étape 8, monétisation éteinte) : E3 ne peut pas en dépendre — voir P7.
- R2 binding disponible sur le Worker (même compte, zéro tiers) — jamais utilisé à ce jour, proposition P2.

## 3. Périmètre E3 — trois volets

- **Volet A — Les quêtes croisées (le Duo, niveau 2 « les cartes »).** Pour chaque quête que les DEUX ont complétée : une invitation « mettre en regard » → après double oui, la vue côte à côte des deux cartes (réponses FORMATÉES en carte, jamais les réponses brutes) + une question de dialogue prête à poser.
- **Volet B — La révélation progressive (niveaux 3 et 4).** « La voix » : notes vocales dans le fil, ≤ 60 s. « La photo » : une photo par membre, affichée dans l'en-tête du fil. Chaque niveau = sa porte + double oui.
- **Volet C — Les récoltes à deux.** (a) L'activité pilote « Trois questions croisées » : 3 questions posées aux deux, les réponses se dévoilent seulement quand les deux ont répondu aux trois (répondre = consentir à l'échange). (b) Le Rendez-vous préparé : trois idées + une question, dérivées des réponses des deux. (c) Le compteur « fragments de connexion » de la paire.

## 4. Architecture proposée (P = propositions à valider)

### P1 — Où ça vit dans l'app
Dans le fil de conversation (`MessagesEspace.tsx`) : un bandeau « Le Voyage à Deux » sous l'en-tête, déplié en une vue à deux (cartes en regard, activités, photo) — PAS un espace séparé : la conversation EST le lieu de la paire. Le M11 (`status: "soon"`) passe « open » au premier match, avec un CTA vers le fil de la paire. Avant tout match, M11 reste honnête (« Se débloque à ton premier match »).

### P2 — Le stockage média (R2 natif, par le Worker)
- `PUT` : multipart → Worker (porte du niveau vérifiée, taille/durée plafonnées) → R2 `media/a2/{matchId}/{mediaId}` → métadonnée en D1.
- `GET` : Worker (session + membership + niveau de voile + non-bloqué vérifiés) → stream R2 → client. Cache-Control privé, aucun cache partagé.
- Cloudinary (plan v1) rejeté : un compte tiers de plus, des données intimes hors de notre périmètre — contraire à la doctrine zéro-dépendance (précédent push VAPID 100 % maison). [À VALIDER]

### P3 — Les portes (table `rencontre_voiles` : match_id, niveau 2|3|4, user_id, cree_a)
Chaque niveau exige SA porte PUIS le double oui (deux lignes = ouvert) :
- **Niveau 2 « les cartes »** : match existant + double oui. C'est aussi le « Lever un voile » de l'économie (offrir un fragment de son portrait).
- **Niveau 3 « la voix »** : niveau 2 ouvert des deux **+ les seuils E2 déjà gravés (15 messages + 7 jours)** + double oui. Réutiliser les seuils E2 : cohérent, zéro nouvelle économie — le seuil « fragments combinés » de l'économie est impossible avant Étape 8. [À VALIDER]
- **Niveau 4 « la photo »** : Statut « Prêt·e » des DEUX (quête 1.11, dérivée de `reponses`) + double oui — jamais d'argent (D15).
La demande se voit (invitation), le refus jamais (D-E3-3).

### P4 — Les médias (table `rencontre_medias` : id, match_id, user_id, type 'voix'|'photo', r2_key, duree_s, octets, cree_a)
- **Voix** : webm/opus (MediaRecorder natif) avec repli m4a/aac iOS ; ≤ 60 s et ≤ 512 Ko (le serveur refuse au-delà — 413 honnête). Les notes vivent dans le fil comme bulles média (durée + lecture) ; l'auteur supprime la sienne à tout moment (DELETE = purge R2 immédiate).
- **Photo** : JPEG/PNG/WebP ≤ 4 Mo, UNE photo active par membre (remplacer = delete + put), visible uniquement dans l'en-tête du fil de la paire au niveau 4.
- **EXIF** : re-encode canvas côté client AVANT l'envoi (simple, fiable, l'original ne quitte jamais l'appareil avec ses métadonnées). [À VALIDER vs strip serveur]

### P5 — Le Duo (table `rencontre_duo` : match_id, quete, user_id, cree_a)
Le serveur dérive l'intersection des quêtes complétées des deux (join `reponses` sur `quete`) → `GET etat` liste les cartes en regard DISPONIBLES → POST consent par quête → à 2 lignes : la vue côte à côte existe (cartes formatées, réponses brutes jamais exposées) + une question de dialogue du pilote (P6). La table `rencontre_profils` d'E1 n'existe toujours pas — le Duo ne la crée pas : il est par-paire, pas par-pool.

### P6 — Les récoltes à deux (pilote de contenu, tables `rencontre_a2` + `rencontre_a2_reponses`)
- **« Trois questions croisées »** : une activité = 3 questions posées aux deux ; chacun répond pour soi ; les réponses se dévoilent SEULEMENT quand les deux ont répondu aux trois (le consentement est structurel). Une activité active par paire à la fois.
- **Le Rendez-vous préparé** : dérivé LOCALEMENT des réponses des deux (rythmes, temps libre) — trois idées + une question, règles transparentes et expliquées, **PAS d'IA en v1** (honnêteté, coût zéro, zéro dépendance ; Workers AI reste derrière la traduction E2). [À VALIDER]
- Le contenu pilote (3 questions croisées + 2-3 questions de dialogue du Duo) : À CO-ÉCRIRE avec le fondateur — doctrine « jamais de diagnostic, jamais de note ». Des drafts peuvent être proposés au tour suivant.

### P7 — Les fragments de connexion : un compteur, pas une monnaie
Compteur simple par paire, DÉRIVÉ (COUNT des activités complétées ensemble — rien de stocké), affiché comme « votre chemin à deux : N récoltes ». Jamais dépensable, jamais comparé à d'autres paires, jamais un score. Les Lucioles et l'« Activité guidée à deux » (5 Lucioles [À VALIDER] dans l'économie) naîtront à l'Étape 8 — E3 ne les préempte pas. [À VALIDER : compteur simple vs rien du tout en v1]

### P8 — Backend et gardes
Routes étendues dans `messages.ts` (même `requireAuth` + `contexteMatch` + blocage vérifié partout) : `GET /rencontres/:id/a2/etat` · `POST /rencontres/:id/voile {niveau}` · `GET|POST /rencontres/:id/duo/:quete` · `POST /rencontres/:id/a2/activites` · `POST /rencontres/:id/a2/activites/:id/repondre` · `GET /rencontres/:id/rdv` · `POST|GET|DELETE /rencontres/:id/media(/:id)`. Rate rules : `a2VoileUser` 30/h · `a2DuoUser` 30/h · `a2ActiviteUser` 20/h · `a2MediaPutUser` 20/h · `a2MediaGetUser` 120/h · `chatVoiceUser` branchée sur le POST voix. Migration `0017_rencontre_a2.sql` (4 tables : voiles, duo, a2, a2_reponses + medias — additive, aucune table existante touchée, conventions 0012/0015).

### P9 — RGPD, anti-abus, modération
`hardDeleteAccount` étendu : purge physique des 4 tables + DELETE des objets R2 du membre. Export RGPD étendu : réponses aux activités à deux + métadonnées médias (les octets audio restent hors export — volumétrie ; les réponses JSON, elles, partent). Signalement : les motifs E2 couvrent les médias ; **accès du modérateur (toi) au média signalé via la console admin** pour trancher un signalement sérieux — c'est le seul cas d'accès humain, tracé dans `audit_admin`. [À VALIDER]

## 5. Hors périmètre E3

Les 6 quêtes complètes du M11 (Phase C4) · la monnaie Lucioles et toute activité payante (Étape 8) · appels audio/vidéo temps réel · géolocalisation · La Table du monde / événements · le Carnet de rencontre · l'exposition de cartes dans le pool E1 · le déblocage post-blocage (décision modération séparée, item 3 du menu).

## 6. [À VALIDER] — décisions fondateur restantes

1. **Le rythme du build** : les trois volets en UNE passe staging (recommandé — un seul déploiement, un flag par volet, tes vérifications sur l'ensemble) ou volet par volet avec ta validation entre chaque.
2. **P2** : le stockage **R2 natif par le Worker** (recommandé — zéro tiers, zéro URL publique) ou Cloudinary (plan v1).
3. **P3** : la porte de la voix = **les seuils E2 gravés (15 messages + 7 jours) + double oui** (recommandé) — l'alternative « fragments combinés » est impossible avant Étape 8.
4. **P4** : les limites médias — voix webm/opus ≤ 60 s / 512 Ko, photo ≤ 4 Mo (recommandé, ce sont les règles du plan) ou d'autres.
5. **P4** : le strip EXIF par **re-encode canvas côté client** (recommandé — l'original ne quitte jamais l'appareil avec ses métadonnées) ou strip serveur.
6. **P6** : le Rendez-vous préparé par **règles locales transparentes** (recommandé) ou Workers AI.
7. **P6** : le **contenu pilote** — je propose des drafts (3 questions croisées + 2-3 questions de dialogue) au tour suivant, ou tu les co-écris avec moi maintenant.
8. **P7** : le compteur « votre chemin à deux : N récoltes » (recommandé — visible mais jamais un score) ou rien du tout en v1.
9. **P9** : l'accès du modérateur au **média signalé** (recommandé — nécessaire pour trancher, tracé dans audit_admin) ou signalement = purge immédiate sans relecture.
10. **Le nom visible** : « Le Voyage à Deux » (verbatim M11, recommandé) ou autre.

## 7. Journal

- **v1.0 (2026-10-17, Task 112)** — création, session SPEC uniquement (GO fondateur). Ancrage produit vérifié : M11 voyage.ts (6 quêtes, tagline, soon, gratuit), économie v1.5 §2.2 (Révélation progressive 4 niveaux, Duo, Rendez-vous préparé, Fragments de connexion, « la récompense, c'est la réponse de l'autre »), format gravé « texte → voix → photo, consentement des deux ». Ancrage code vérifié : badge Révélés ✦ E2, reponses 0011 (dérivation jalon A E1 réutilisable), chatVoiceUser posée, Lucioles absentes du code, R2 dispo. 9 décisions gravées (D-E3-1..9), 10 points ouverts numérotés. Rien implémenté, prod inchangée (ec034794).

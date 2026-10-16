# SPEC — RENCONTRE-E2 « Les conversations » (v1, reconstitution Task 107)

Phases du volet Rencontre : **E1 le pas et le match (livré, Task 94) → E2 les conversations (CE document) → E3 le Voyage à Deux.**

## Décisions gravées (D-E2-1..11)

- **D-E2-1 — La conversation n'existe QUE derrière un match.** Aucune découverte de nouveaux visages ici : #/messages liste les matchs E1, rien d'autre. Le premier message ne part jamais vers un inconnu.
- **D-E2-2 — Message texte seul, 1..2000 caractères.** Pas de médias en E2 (voice notes prévues plus tard, règle `chatVoiceUser` déjà posée).
- **D-E2-3 — Historique borné : 100 derniers messages par page, curseur `cree_a`.** La source de vérité est D1 (`rencontre_messages`), jamais le DO.
- **D-E2-4 — Les non-lus sont DÉRIVÉS.** `rencontre_lus` (match_id, user_id, lu_a) = dernier message vu ; le badge est un COUNT, jamais un compteur stocké. L'ouverture du fil marque lu.
- **D-E2-5 — Traduction Workers AI au BOUTON MANUEL** (jamais automatique — l'autre doit pouvoir lire ses propres mots sans qu'on les remplace) : binding `AI`, modèle `@cf/meta/llama-3.3-70b-instruct-fp8-fast`, fail-graceful 503 `traduction_indisponible` sans crash. Quota `messagesTranslateUser` 60/h.
- **D-E2-6 — Révélation consentie aux DEUX seuils PUIS aux DEUX oui.** Les seuils du shared (`REVEAL.minMessages = 15`, `REVEAL.minDays = 7`) doivent être TOUTES réunis (héritage v1), puis CHACUN demande ; révélé quand les deux lignes `rencontre_reveals` existent. La progression est affichée comme une PORTE (jamais une quête, jamais de pression).
- **D-E2-7 — Blocage SILENCIEUX deux sens.** Le bloqué n'est JAMAIS informé : pool sans l'autre, pas neutre (`ok:true` sans effet), envoi neutre (`silencieux:true` sans insert), pas de temps réel. Messages conservés. Le blocage SURVIT à l'unmatch. Pas d'endpoint de déblocage en E2 (décision modération).
- **D-E2-8 — Unmatch = tout s'efface.** Messages, lus, reveals, le match partent physiquement ; les deux pas retournent à `retire` (re-pas possible) ; le blocage (si posé) reste. Rate `chatUnmatchUser` 20/h.
- **D-E2-9 — Signalements confidentiels à motifs fermés** (spam, harcelement, contenu_inapproprie, faux_profil, autre) : le signalé n'est jamais informé, aucune issue exposée, pas d'oracle d'existence (ID inconnu → `ok:true` quand même). Rate `safetyReportUser` 10/jour.
- **D-E2-10 — Temps réel = DO ChatRoom (hibernation) + fallback REST.** 1 conversation = 1 DO (`idFromName(matchId)`) ; le DO ne stocke rien (D1 = vérité), re-vérifie chaque envoi contre D1 (membre + blocage + rate `chatSendUser`), diffuse aux deux (l'écho confirme l'expéditeur). Le POST REST notifie le DO (`/notify`) fire-and-forget. Route WS `/api/rencontres/:matchId/ws` — session + membership vérifiés au worker, ticket `chatTicketUser` 60/h. URL WebSocket = même origine, jamais d'hôte/port codé en dur.
- **D-E2-11 — RGPD complet.** Export étendu (messages envoyés, signalements faits, blocages posés) ; hard delete purge physiquement `rencontre_messages/lus/reveals/blocages/signalements` (+ pas/matchs E1 déjà purgeés).

## Périmètre E2 (livré)

- Migration `0014_rencontre_chat.sql` (5 tables, aucune table existante modifiée — la structure des tests/outils/questionnaires reste intouchable).
- Backend : `routes/messages.ts` — GET conversations · GET messages · POST message (REST) · POST lu · POST reveal · POST traduire · POST blocage · POST unmatch · POST signalements · GET ws.
- Durcissement E1 : pool sans les paires bloquées, pas neutre sous blocage.
- Front : `screens/MessagesEspace.tsx` (liste + fil + WS + traduction + révélation + modale sécurité), porte `#/messages` réelle (App.tsx), bouton « Ouvrir la conversation » dans #/matchs, badge non-lus sur la TabBar, i18n EN (`screens-c.ts`), CSS `.msg-*`.
- E2E : `/home/z/e2e/e2e-local.sh` — 28 vérifications (jalon A → pas → match → REST → non-lus → reveal refusé → signalement → blocage → unmatch → survies → RGPD 0 résidu) ; le WS local miniflare est meilleur-effort (instabilité sandbox documentée), la preuve temps réel est faite en staging réel.

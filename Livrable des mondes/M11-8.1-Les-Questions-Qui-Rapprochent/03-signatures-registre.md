🗒️ quete: 8.1 · dossier: M11-8.1-Les-Questions-Qui-Rapprochent · fiche: première émission V14.B.1 (FM à graver à la consolidation) · session: 2026-10-01

# LIVRABLE 3 — SIGNATURES ATTENDUES DE LA QUÊTE 8.1 (format du registre)

> ⚠ **LES DEUX SIGNATURES PORTENT LE VERROU « À VALIDER PAR LE COMITÉ »** (Constitution [9] ;
> précédent FM-019 : les seuils proposés sont des **valeurs de départ provisoires concepteur,
> re-signature professionnelle avant bêta** — ils n'engagent aucune décision de production).
> SIG-8.1-01 est **[MOTEUR SEUL]** avec **VERROU DUR DE RENDU** — JAMAIS à l'écran avant calibration
> du comité (interdit mission explicite), JAMAIS en UI, JAMAIS dans un score affiché, JAMAIS à un
> tiers (Constitution [3]). SIG-8.1-02 est **structurelle** : elle décrit la quête entière, pas un
> calcul.

## Les variables fournies par la quête

| Variable | Source | Domaine |
|---|---|---|
| **CORPUS_CROISE** | les 72 réponses texte libre (36 énoncés × 2 membres) — chiffrement renforcé, jamais d'export | texte |
| **CORPUS_NIVEAU_1/2/3** | les 24 réponses de chaque niveau (12 énoncés × 2) — unités d'analyse de la progression | texte |
| **DUALITE_REPONSES** | l'état par question : 1 réponse scellée (attente) → 2 réponses (révélation mutuelle) | mécanique |
| **NIVEAU_DEBLOQUE** | le palier courant du couple (1 → 2 → 3) — déblocage à la complétion des 12 PAR LES DEUX | progression |
| **PENTE_MUTUELLE** | le rythme conjoint observé (questions par jour réellement échangées) — indicateur d'engagement à deux, moteur | métrique moteur |

| ID | Nom | Conditions exactes | Conséquence | Source | Fenêtre cible |
|---|---|---|---|---|---|
| **SIG-8.1-01** | Compatibilité réelle | **CROISEMENT POST-NIVEAU-3** — lorsque les 36 questions sont complétées PAR LES DEUX membres, les réponses croisées (texte libre) nourrissent l'analyse de compatibilité réelle (**NLP P2**) : similarités de registre et de contenu répondu aux MÊMES énoncés, convergence de valeurs révélées-en-action (niveau 2), résonance des vulnérabilités (niveau 3). C'est **la mesure comportementale la plus riche du produit** : ce qui est dit librement, à deux, après 36 jours de révélation mutuelle — ni déclaré en solo, ni deviné. ⛔ **VERROU DUR** : **AUCUN score de compatibilité réelle n'est rendu à l'écran avant calibration du comité** (interdit mission explicite) — [MOTEUR SEUL] ; gabarits, pondérations et seuils : À VALIDER PAR LE COMITÉ [9] | La compatibilité réelle alimente le **moteur North Star (post-match)** — conversion match → conversation → relation : elle affine le classement moteur, module les relances de conversation utiles, prépare les cartes de dialogue (8.6) — **sans aucun affichage, sans verdict, sans tiers** tant que le comité n'a pas calibré | 72 réponses texte libre (36 × 2) | calcul post-niveau-3 · recalcul à chaque mise à jour ⚠ |
| **SIG-8.1-02** | La révélation mutuelle | **STRUCTURELLE (toute la quête)** — ① **double consentement par question** : les deux membres répondent AVANT que quoi que ce soit se révèle ; une réponse isolée reste scellée (l'écran du premier répondant confirme le sceau, sans jamais montrer ni résumer sa propre réponse à l'autre) · ② **révocabilité à tout moment** : toute réponse est modifiable ou retirée avant ET après révélation (la vue partagée se met à jour — forme exacte À VALIDER PAR LE COMITÉ) · ③ **jamais de tiers** : aucune révélation hors du couple, aucun croisement exposé, aucune notification à autrui · ④ **jamais d'export** : aucune réponse n'entre dans les exports, le résumé d'engagement ou toute vue au-delà des deux | La structure EST la signature : la quête est un protocole de consentement répété (36 fois × 2 personnes), pas un questionnaire — elle protège le niveau 3 (vulnérabilité mutuelle) par construction, et rend la récompense non transférable (la réponse de l'autre ne se collectionne pas, elle se reçoit en réciprocité) | mécanique de passation (02) | active dès la 1ʳᵉ question ⚠ |

## Notes de registre

- **Référence au registre — le moteur North Star** : la compatibilité réelle (SIG-8.1-01) alimente
  le moteur **post-match** (conversion match → conversation → relation). La ligne du registre attend
  la **calibration du comité** avant tout rendu ; en l'état, la signature ne produit AUCUN état
  visible — elle calcule, elle ne dit rien.
- **Pourquoi NLP P2** : l'analyse de texte libre exige un calibrage sémantique prudent (français,
  registre intime affectif, réponses courtes) — la phase P2 est la doctrine du produit pour les
  analyses dépendantes du langage ; aucun rendu n'en dépend au MVP.
- **Mesuré, pas deviné [2]** : la compatibilité réelle s'ancrine dans des réponses produites
  spontanément, à deux, sur des énoncés identiques — jamais dans une inférence de profil. Aucune
  extrapolation depuis les quêtes solo (M1-M10) n'entre dans ce calcul au MVP : le croisement
  8.1 × quêtes solo est un **ATTENDU, non calculé** (à cadrer par le comité).
- **Aucune restitution individuelle** : ni miroir, ni carte, ni percentile, ni citation analytique —
  l'exemption est documentée (04 et 07, précédent 6.4). Les seuls textes visibles sont les questions
  (verbatim gelé) et les réponses mutuellement révélées.
- **Zéro jargon rendu** : CORPUS_*, DUALITE_REPONSES, NIVEAU_DEBLOQUE, PENTE_MUTUELLE, SIG-8.1-01/02,
  NLP — identifiants moteur, JAMAIS à l'écran (Constitution [3]).
- **Registre probabiliste obligatoire** si un jour des libellés de compatibilité étaient calibrés —
  « la recherche documente que », « conduit fréquemment à » ; zéro futur certain, zéro verdict,
  zéro « toujours »/« jamais » au rendu.
- SIG-8.1-02 se rejoue contre le protocole (02) à chaque évolution UX ; SIG-8.1-01 se rejoue hors
  dépôt jusqu'à la calibration (le corpus est chiffré renforcé, jamais exporté).

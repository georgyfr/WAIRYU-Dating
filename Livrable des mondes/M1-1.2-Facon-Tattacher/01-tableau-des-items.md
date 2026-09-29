# LIVRABLE 1 — LES 20 ITEMS DE LA QUÊTE 1.2 « TA FAÇON DE T'ATTACHER »

> Légende de la fiche de computation condensée — `C:` carte · `S:` signal · `F:` fiabilité · `M:` modulation · `A:` ancrage.
> Échelle : Likert 5 niveaux (Arbitrage 2) · Orientation : D = direct, I = inversé (↩ au source gelé, recodé `6 − réponse`, Arbitrage 1).
> Les sigles de variables (ANX, EVI, DTM_M, RSQ) vivent côté moteur — jamais en UI (Constitution [3]).

## Les 12 items carte (verbatim du source gelé)

| Code (gelé) | Énoncé | Or. | Dimension (carte_id) | Facette | Paire | Fiche de computation — 5 canaux |
|---|---|---|---|---|---|---|
| Q1.2-01 | Quand quelqu'un compte pour moi, son silence me pèse très vite. | **D** | Anxiété | le silence qui pèse | ↔01.r | C: Anxiété→ANX · S: — · F: doublon fiabilité ↔01.r ⚠ fenêtre À VALIDER · M: croisement moteur ANX×R (Vigie) · A: rappel OK |
| Q1.2-02 | J'ai souvent besoin qu'on me confirme que tout va bien entre nous. | **D** | Anxiété | la confirmation répétée | — | C: Anxiété→ANX · S: — · F: cohérence intra-dimension · M: citation d'ancrage de la Vigie (moteur) · A: rappel OK |
| Q1.2-03 | Une remarque un peu froide peut m'occuper toute la soirée. | **D** | Anxiété | la remarque froide qui occupe | — | C: Anxiété→ANX · S: — · F: cohérence intra-dimension · M: si ANX haut et R bas → ombre renforcée (moteur) · A: rappel OK |
| Q1.2-04 | J'anticipe parfois qu'on me quitte avant même que quelque chose arrive. | **D** | Anxiété | l'anticipation du départ | — | C: Anxiété→ANX · S: — · F: cohérence intra-dimension · M: croisement moteur ANX×RSQ (moteur seul) · A: rappel OK |
| Q1.2-05 | Je me sens mieux quand je sais clairement où j'en suis avec quelqu'un. | **D** | Anxiété | le savoir où j'en suis | — | C: Anxiété→ANX · S: — · F: cohérence intra-dimension · M: — · A: rappel OK |
| Q1.2-06 | Les relations où chacun garde son indépendance me conviennent parfaitement. | **I** ↩ | Anxiété | l'indépendance en couple | — | C: Anxiété (recodé 6−r) · S: — · F: cohérence intra-dimension · M: croisement EVI×S×O (moteur) · A: rappel OK |
| Q1.2-07 | Quand une relation devient profonde, j'ai une envie instinctive de ralentir. | **D** | Évitement | le ralentissement en profondeur | — | C: Évitement→EVI · S: — · F: cohérence intra-dimension · M: signature-mère du bloc autonome (moteur) · A: rappel OK |
| Q1.2-08 | Dépendre de quelqu'un ne me fait pas peur. | **I** ↩ | Évitement | dépendre de quelqu'un | — | C: Évitement (recodé 6−r) · S: — · F: cohérence intra-dimension · M: fiche complète en `06-fiche-computation-EXEMPLE.yaml` · A: rappel OK |
| Q1.2-09 | Je préfère gérer mes soucis seul(e), même avec un partenaire. | **D** | Évitement | gérer seul même en couple | ↔09.r | C: Évitement→EVI · S: — · F: doublon fiabilité ↔09.r ⚠ fenêtre À VALIDER · M: croisement moteur EVI×S (retrait patient) · A: rappel OK |
| Q1.2-10 | Raconter mes faiblesses à quelqu'un qui compte me soulage. | **I** ↩ | Évitement | raconter ses faiblesses | — | C: Évitement (recodé 6−r) · S: — · F: cohérence intra-dimension · M: croisement moteur EVI×X (forteresse) · A: rappel OK |
| Q1.2-11 | La proximité constante me fait du bien plus qu'elle ne me fatigue. | **I** ↩ | Évitement | la proximité constante | — | C: Évitement (recodé 6−r) · S: — · F: cohérence intra-dimension · M: — · A: rappel OK |
| Q1.2-12 | Trop de proximité trop vite me donne envie de prendre de l'air. | **D** | Évitement | prendre de l'air | — | C: Évitement→EVI · S: — · F: cohérence intra-dimension · M: — · A: rappel OK |

## Les 8 items de trame — LIGNES-RÉSERVÉES (FM-018 / Constitution [11-b])

> ⚠ **Aucun énoncé de trame dans ce dépôt.** Contenu vivant : document trames, hors dépôt,
> fourni à l'implémenteur uniquement au moment de l'intégration. Codes gelés à jamais.

**Q1.2-T09 à T12 — ITEM SÉCURITÉ : contenu fourni séparément au moment de l'implémentation
(document trames, hors dépôt). Alimente le signal DTM_M (méfiance projetée). Positions au
mélange : 2 · 4 · 6 · 8.**

**Q1.2-T13 à T16 — ITEM SÉCURITÉ : contenu fourni séparément au moment de l'implémentation
(document trames, hors dépôt). Alimente le signal RSQ (sensibilité au rejet, pilote l'UX
adaptative). Positions au mélange : 11 · 14 · 17 · 20.**

Propriétés communes (côté moteur, côté contrat) : dimension carte `null` · orientation D ·
rappel d'ancrage **INTERDIT** · aucun slot, aucune citation, aucune restitution.

## Les 2 doublons fiabilité (autorisés — trame fiabilité, hors passation)

| Code (gelé) | Énoncé (verbatim) | Rappel de l'original | Fenêtre |
|---|---|---|---|
| Q1.2-01.r | Le silence de quelqu'un d'important m'inquiète très vite. | Q1.2-01 | ≥ 2 semaines ⚠ À VALIDER PAR LE COMITÉ |
| Q1.2-09.r | Même en couple, je gère mes problèmes en solo. | Q1.2-09 | ≥ 2 semaines ⚠ À VALIDER PAR LE COMITÉ |

La concordance des doublons alimente la méta QFI (conditions au registre Monde 1, section méta).

## Contrôles mécaniques passés (items carte)

| Contrôle | Résultat |
|---|---|
| 1re personne, présent de l'indicatif | ✅ |
| Zéro double négation | ✅ |
| Zéro fréquence ambiguë sans ancre (« très vite », « souvent », « parfois », « parfaitement », « trop vite ») | ✅ |
| Zéro contamination lexicale entre dimensions | ✅ |
| Neutralité normative (aucune « bonne réponse » suggérée) | ✅ |
| ≤ 12 mots / énoncé | ⚠ 1 exception — voir Dérives documentées |
| Trames : zéro énoncé, codes + signal + positions seuls | ✅ (verrou [11-b]) |

## Dérives documentées (fidélité verbatim au source gelé — arbitrage comité)

| Élément | Constat | Décision de production | Arbitrage |
|---|---|---|---|
| Q1.2-05 | 13 mots (contrôle de production : ≤ 12) | Énoncé conservé VERBATIM — le source gelé prime sur le contrôle de longueur | À ARBITRER PAR LE COMITÉ |

Aucune autre dérive : les 12 énoncés carte, les 2 doublons, l'écran d'intro et les 5 cartes
sont reproduits mot pour mot depuis le source gelé.

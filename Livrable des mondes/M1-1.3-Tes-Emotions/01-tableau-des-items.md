# LIVRABLE 1 — LES 26 ITEMS DE LA QUÊTE 1.3 « TES ÉMOTIONS »

> Légende de la fiche de computation condensée — `C:` carte · `S:` signal · `F:` fiabilité · `M:` modulation · `A:` ancrage.
> Échelle : Likert 5 niveaux (Arbitrage 2) · Orientation : D = direct, I = inversé (↩ au source gelé, recodé `6 − réponse`, Arbitrage 1).
> Les sigles de variables (P, R, X, DE_U, DE_C) vivent côté moteur — jamais en UI (Constitution [3]).

## Les 20 items carte (verbatim du source gelé)

### Perception et identification (6 items)

| Code (gelé) | Énoncé | Or. | Dimension (carte_id) | Facette | Paire | Fiche de computation — 5 canaux |
|---|---|---|---|---|---|---|
| Q1.3-01 | Je sais nommer ce que je ressens, même quand c'est mêlé. | **D** | Perception | nommer les états mêlés | ↔01.r | C: Perception→P · S: — · F: doublon fiabilité ↔01.r ⚠ fenêtre À VALIDER · M: croisement moteur P×ANX (radar double) · A: rappel OK |
| Q1.3-02 | Mes émotions me prennent souvent par surprise. | **I** ↩ | Perception | la surprise émotionnelle | — | C: Perception (recodé 6−r) · S: — · F: cohérence intra-dimension · M: — · A: rappel OK |
| Q1.3-03 | Je remarque vite quand mon humeur change. | **D** | Perception | le changement d'humeur repéré tôt | — | C: Perception→P · S: — · F: cohérence intra-dimension · M: — · A: rappel OK |
| Q1.3-04 | Je réalise parfois que j'étais en colère — ou triste — bien après coup. | **I** ↩ | Perception | l'émotion comprise après coup | — | C: Perception (recodé 6−r) · S: — · F: cohérence intra-dimension · M: — · A: rappel OK |
| Q1.3-05 | Les sensations de mon corps me renseignent sur mon état intérieur. | **D** | Perception | les signaux du corps | — | C: Perception→P · S: — · F: cohérence intra-dimension · M: — · A: rappel OK |
| Q1.3-06 | Je distingue la fatigue de la tristesse, la nervosité de l'excitation. | **D** | Perception | distinguer les états proches | — | C: Perception→P · S: — · F: cohérence intra-dimension · M: citation d'ancrage du bloc lumière (moteur) · A: rappel OK |

### Régulation (7 items)

| Code (gelé) | Énoncé | Or. | Dimension (carte_id) | Facette | Paire | Fiche de computation — 5 canaux |
|---|---|---|---|---|---|---|
| Q1.3-07 | Je sais me calmer sans que quelqu'un m'aide. | **D** | Régulation | se calmer seul | — | C: Régulation→R · S: — · F: cohérence intra-dimension · M: croisement moteur R×S×ANX (REN, dernière passe) · A: rappel OK |
| Q1.3-08 | Quand une émotion forte arrive, elle me traverse plus que je ne la traverse. | **I** ↩ | Régulation | l'émotion qui traverse | — | C: Régulation (recodé 6−r) · S: — · F: cohérence intra-dimension · M: croisement moteur S×R (météo forte) · A: rappel OK |
| Q1.3-09 | Je sais mettre des mots assez tôt pour éviter que ça déborde. | **D** | Régulation | les mots avant le débordement | — | C: Régulation→R · S: — · F: cohérence intra-dimension · M: — · A: rappel OK |
| Q1.3-10 | Je fais des choses que je regrette quand je suis très en colère ou très blessé(e). | **I** ↩ | Régulation | les regrets en colère | — | C: Régulation (recodé 6−r) · S: — · F: cohérence intra-dimension · M: croisement moteur R×X (mots de crise) · A: rappel OK |
| Q1.3-11 | Une marche, un souffle, un temps : je connais mes gestes qui apaisent. | **D** | Régulation | les gestes qui apaisent | — | C: Régulation→R · S: — · F: cohérence intra-dimension · M: — · A: rappel OK |
| Q1.3-12 | Je rumine des heures avant de retrouver mon calme. | **I** ↩ | Régulation | la rumination | ↔12.r | C: Régulation (recodé 6−r) · S: — · F: doublon fiabilité ↔12.r ⚠ fenêtre À VALIDER · M: croisement moteur R×ANX (vérification sous pression) · A: rappel OK — fiche complète en `06-fiche-computation-EXEMPLE.yaml` |
| Q1.3-13 | Je peux accueillir une émotion pénible sans la fuir tout de suite. | **D** | Régulation | accueillir sans fuir | — | C: Régulation→R · S: — · F: cohérence intra-dimension · M: — · A: rappel OK |

### Expression et connexion (7 items)

| Code (gelé) | Énoncé | Or. | Dimension (carte_id) | Facette | Paire | Fiche de computation — 5 canaux |
|---|---|---|---|---|---|---|
| Q1.3-14 | Je dis aux gens ce qu'ils représentent pour moi. | **D** | Expression | dire ce que l'autre représente | — | C: Expression→X · S: — · F: cohérence intra-dimension · M: — · A: rappel OK |
| Q1.3-15 | Je ressens beaucoup, mais ça ne se voit presque jamais. | **I** ↩ | Expression | ressenti non visible | — | C: Expression (recodé 6−r) · S: — · F: cohérence intra-dimension · M: croisement moteur X×EVI (forteresse) · A: rappel OK |
| Q1.3-16 | Les gens se tournent naturellement vers moi pour se réconforter. | **D** | Expression | le réconfort recherché chez soi | — | C: Expression→X · S: — · F: cohérence intra-dimension · M: citation d'ancrage du Radiateur (moteur) · A: rappel OK |
| Q1.3-17 | Dire « tu comptes pour moi » me met mal à l'aise, même quand c'est sincère. | **I** ↩ | Expression | dire « tu comptes pour moi » | — | C: Expression (recodé 6−r) · S: — · F: cohérence intra-dimension · M: croisement moteur X×ANX (expression conditionnelle) · A: rappel OK |
| Q1.3-18 | Je m'intéresse vraiment à ce que les autres vivent en dedans. | **D** | Expression | l'intérêt pour l'intérieur des autres | — | C: Expression→X · S: — · F: cohérence intra-dimension · M: — · A: rappel OK |
| Q1.3-19 | Je célèbre les bonnes nouvelles des autres comme si c'étaient les miennes. | **D** | Expression | célébrer les nouvelles des autres | — | C: Expression→X · S: — · F: cohérence intra-dimension · M: — · A: rappel OK |
| Q1.3-20 | Les larmes des autres me mettent surtout mal à l'aise. | **I** ↩ | Expression | les larmes d'autrui | — | C: Expression (recodé 6−r) · S: — · F: cohérence intra-dimension · M: — · A: rappel OK |

## Les 6 items de trame — LIGNES-RÉSERVÉES (FM-018 / Constitution [11-b])

> ⚠ **Aucun énoncé de trame dans ce dépôt.** Contenu vivant : document trames, hors dépôt,
> fourni à l'implémenteur uniquement au moment de l'intégration. Codes gelés à jamais.

**Q1.3-T21 à T24 — ITEM SÉCURITÉ : contenu fourni séparément au moment de l'implémentation
(document trames, hors dépôt). Alimente le signal DE_U (empathie instrumentale). Positions au
mélange : 4 · 8 · 12 · 16.**

**Q1.3-T25 à T26 — ITEM SÉCURITÉ : contenu fourni séparément au moment de l'implémentation
(document trames, hors dépôt). Alimente le signal DE_C (empathie compassionnelle, items
inversés ↩). Positions au mélange : 21 · 26.**

Propriétés communes (côté moteur, côté contrat) : dimension carte `null` · orientations D
(T21-T24) et I inversés ↩ (T25-T26) · rappel d'ancrage **INTERDIT** · aucun slot, aucune
citation, aucune restitution · le croisement DE_U × DE_C construit la fonction Dark Empathy
côté moteur — conditions et seuils hors dépôt (voir `03-signatures-registre.md`).

## Les 2 doublons fiabilité (autorisés — trame fiabilité, hors passation)

| Code (gelé) | Énoncé (verbatim) | Rappel de l'original | Fenêtre |
|---|---|---|---|
| Q1.3-01.r | Je trouve généralement les mots justes pour mes états intérieurs. | Q1.3-01 | ≥ 2 semaines ⚠ À VALIDER PAR LE COMITÉ |
| Q1.3-12.r | Je tourne en boucle longtemps avant d'apaiser une tension. | Q1.3-12 | ≥ 2 semaines ⚠ À VALIDER PAR LE COMITÉ |

La concordance des doublons alimente la méta QFI (conditions au registre Monde 1).

## Contrôles mécaniques passés (items carte)

| Contrôle | Résultat |
|---|---|
| 1re personne, présent de l'indicatif | ✅ |
| Zéro double négation | ✅ |
| Zéro fréquence ambiguë sans ancre (« souvent », « parfois », « vite », « assez tôt », « presque jamais ») | ✅ |
| Zéro contamination lexicale entre dimensions | ✅ |
| Neutralité normative (aucune « bonne réponse » suggérée) | ✅ |
| Interdits lexicaux : « presque jamais » (Q1.3-15) et « jamais vraiment » ne sont pas des absolus — fréquences nuancées, verbatim source | ✅ documenté |
| ≤ 12 mots / énoncé | ⚠ 3 exceptions — voir Dérives documentées |
| Trames : zéro énoncé, codes + signal + positions seuls | ✅ (verrou [11-b]) |

## Dérives documentées (fidélité verbatim au source gelé — arbitrage comité)

| Élément | Constat | Décision de production | Arbitrage |
|---|---|---|---|
| Q1.3-08 | 14 mots (contrôle de production : ≤ 12) | Énoncé conservé VERBATIM — le source gelé prime sur le contrôle de longueur | À ARBITRER PAR LE COMITÉ |
| Q1.3-10 | 16 mots (contrôle de production : ≤ 12) | Énoncé conservé VERBATIM — idem | À ARBITRER PAR LE COMITÉ |
| Q1.3-17 | 14 mots (contrôle de production : ≤ 12) | Énoncé conservé VERBATIM — idem | À ARBITRER PAR LE COMITÉ |

Aucune autre dérive : les 20 énoncés carte, les 2 doublons, l'écran d'intro et les 6 cartes
sont reproduits mot pour mot depuis le source gelé.

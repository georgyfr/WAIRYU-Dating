# LIVRABLE 3 — SIGNATURES ATTENDUES DE LA QUÊTE 2.2 (format du registre)

> ⚠ **Seuils et pondérations : verrou [9]** — les valeurs ci-dessous sont des PROPOSITIONS de
> production (provisoires concepteur), jamais des décisions. Re-signature professionnelle avant bêta.
> **Marquage mission V7/V8** : chaque seuil porte le statut **« À VALIDER PAR LE COMITÉ »** —
> l'adoption FM-019 fixe la valeur de départ ; la re-signature professionnelle avant bêta reste requise.
> Aucune signature de sécurité (trame) n'est attachée à cette quête — vérifié au registre du mélange.

## Les variables fournies par la quête

| Variable | Source | Domaine |
|---|---|---|
| **SPIRIT_D** | centralité spirituelle déclarée (Q2.2-01 → 06, I recodés, normalisée) | 0-1 |
| **EC_SPIRIT** | écart de centralité entre deux profils = \|SPIRIT_A − SPIRIT_B\| | 0-1 |

| ID | Nom | Conditions exactes | Conséquence | Source | Fenêtre cible |
|---|---|---|---|---|---|
| **SIG-2.2-01** | L'homophilie graduée | **Filtre enrichi** : la compatibilité de deux profils est MODULÉE par l'écart de centralité (`EC_SPIRIT`) — plus l'écart est grand, plus le score de compatibilité décroît, dans les deux sens. **Jamais un dealbreaker binaire** : aucun seuil n'élimine, aucun écart ne coupe. Pondération exacte (linéaire proposée) : À VALIDER PAR LE COMITÉ [9] | Module le score de compatibilité côté moteur — aucune trace rendue chez l'un ni chez l'autre ; le miroir de chacun parle de SA place, jamais de l'écart à l'autre. **Sur écart fort entre profils extrêmes (mission V8.A)** : signal conversationnel « à aborder tôt » (fêtes, enfants, rythmes) — **jamais une pénalité dure, jamais une élimination** ; un couple mixte est légitime, la divergence est une information, pas un défaut | 6 items déclaratifs (concept public : homophilie — nommé côté moteur uniquement) | recalcul à chaque mise à jour d'un des deux profils ⚠ |
| **SIG-2.2-02** | Le profil | **Seuils blocs sur SPIRIT_D** (proposition — À VALIDER PAR LE COMITÉ [9] ; bornes reprises FM-019 comme valeurs de départ) : **centrale > 0.65 · culturelle 0.35-0.65 · absente < 0.35** | Rendu descriptif par profil (miroir 07, carte) — trois façons égales d'habiter la spiritualité, aucune normée ; le profil ne commente jamais la ferveur, il décrit la PLACE | 6 items déclaratifs (blocs de centralité) | recalcul à chaque mise à jour ⚠ |

## Notes de registre

- **La distinction doctrinale capitale — 2.2 module, 2.3 élimine** : la ligne rouge religieuse est
  un dealbreaker DÉCLARÉ par la personne (coche Q2.3-04, hard constraint, élimination déterministe) ;
  cette quête n'élimine JAMAIS. Les deux mécanismes coexistent sans se doublonner : l'un respecte
  une limite posée, l'autre module une affinité graduée. Un profil peut avoir une centralité haute
  et AUCUNE ligne rouge religieuse — le filtre enrichi continue de jouer, sans jamais couper.
- **Registre probabiliste obligatoire** : toute conséquence documentée dans un miroir s'exprime en
  « conduit fréquemment à », « la recherche documente que » — jamais « tu finiras par ».
- **Aucune asymétrie de jugement** : l'écart entre une centralité haute et une centralité absente
  module le score des DEUX côtés de la même façon — personne n'est « le problème » de l'équation.
- **Le nom du concept (centralité religieuse, homophilie) reste moteur** — au rendu : la place, la
  semaine, les fêtes, le partage (règle de jargon [3]).
- SIG-2.2-01 est rejouée contre les portraits du Monde selon le protocole du Registre des Signatures.

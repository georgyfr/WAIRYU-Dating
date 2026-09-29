# LIVRABLE 3 — SIGNATURES ATTENDUES DE LA QUÊTE 2.2 (format du registre)

> ⚠ **Seuils et pondérations : verrou [9]** — les valeurs ci-dessous sont des PROPOSITIONS de
> production (provisoires concepteur), jamais des décisions. Re-signature professionnelle avant bêta.
> Aucune signature de sécurité (trame) n'est attachée à cette quête — vérifié au registre du mélange.

## Les variables fournies par la quête

| Variable | Source | Domaine |
|---|---|---|
| **SPIRIT_D** | centralité spirituelle déclarée (Q2.2-01 → 06, I recodés, normalisée) | 0-1 |
| **EC_SPIRIT** | écart de centralité entre deux profils = \|SPIRIT_A − SPIRIT_B\| | 0-1 |

| ID | Nom | Conditions exactes | Conséquence | Source | Fenêtre cible |
|---|---|---|---|---|---|
| **SIG-2.2-01** | L'homophilie graduée | **Filtre enrichi** : la compatibilité de deux profils est MODULÉE par l'écart de centralité (`EC_SPIRIT`) — plus l'écart est grand, plus le score de compatibilité décroît, dans les deux sens. **Jamais un dealbreaker binaire** : aucun seuil n'élimine, aucun écart ne coupe. Pondération exacte (linéaire proposée) : À VALIDER PAR LE COMITÉ [9] | Module le score de compatibilité côté moteur — aucune trace rendue chez l'un ni chez l'autre ; le miroir de chacun parle de SA place, jamais de l'écart à l'autre | 6 items déclaratifs (concept public : homophilie — nommé côté moteur uniquement) | recalcul à chaque mise à jour d'un des deux profils ⚠ |

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

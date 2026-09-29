# LIVRABLE 3 — SIGNATURES ATTENDUES DE LA QUÊTE 1.10 (format du registre)

> ⚠ **SIG_CONTRIB est DÉCLARÉE au registre M2 (`contrat/registres/signatures/M2.json`) — la présente
> fiche l'aligne, elle ne la réécrit pas.** Son statut au registre : **À VALIDER PAR LE COMITÉ** ;
> ses seuils relèvent du verrou [9] — la proposition de production ci-dessous ne tranche rien.
> Aucune signature de sécurité (trame) n'est attachée à cette quête — vérifié au registre du mélange.

## Les variables fournies par la quête

| Variable | Source | Domaine |
|---|---|---|
| **CONTRIB_D** | contribution DÉCLARÉE (Q1.10-01 → 10, I recodés, normalisée) | 0-1 |
| **CONTRIB_M** | contribution MESURÉE (traits M1 — croisement, même normalisation) | 0-1 |
| **EC_CONTRIB** | écart contribution = \|CONTRIB_D − CONTRIB_M\| | 0-1 |

| ID | Nom | Conditions exactes | Conséquence | Source | Fenêtre cible |
|---|---|---|---|---|---|
| **SIG_CONTRIB** | Ce que tu apportes — la confiance modulée | **Verbatim registre M2** : contribution déclarée à la quête 1.10 × traits mesurés au Miroir (M1) — croisement déclaré × mesuré. **Proposition de production (lecture)** : EC_CONTRIB > 0.30 → facteur de confiance réduit — **seuil verrou [9]**, provisoire concepteur, jamais tranché ici | **Verbatim registre M2** : facteur de confiance — la cohérence entre ce que la personne déclare apporter et ce que ses items M1 mesurent module la confiance accordée à ses déclarations dans le matching. **Proposition de production (conduite)** : facteur réduit + proposition de re-test ciblé proposée AU membre (jamais imposée) — zéro texte de reproche, aucune trace du mécanisme | croisement Q1.10 × M1 (registre M2 : « lien éventuel avec QFI à confirmer par le comité ») | statut et fenêtre : À VALIDER PAR LE COMITÉ (verbatim registre) |

## Notes de registre

- **SIG_CONTRIB module une confiance, elle ne qualifie pas une personne** : l'écart déclaré/mesuré
  alimente la prudence du moteur — il ne sort JAMAIS en texte, ni chez soi, ni chez l'autre.
- **La proposition de re-test ciblé** : si production l'adopte, le membre reçoit une invitation douce
  à re-répondre à quelques items (jamais la liste de ses « écarts ») — le re-test est un droit, pas
  une convocation. Formulation et déclencheur : À VALIDER PAR LE COMITÉ.
- **Le BIDR** (désirabilité sociale — concept public) filtre les sur-déclarations côté moteur ;
  son nom interne et ses seuils ne franchissent jamais le rendu (règle de jargon [3]).
- **Aucune normativité de la contribution** : l'écart élevé n'est pas « un menteur détecté » — c'est
  une déclaration qui dépasse la mesure, phénomène humain banal que le moteur traite en prudence.
- Les trois variables (CONTRIB_D, CONTRIB_M, EC_CONTRIB) vivent côté moteur uniquement.

# LIVRABLE 3 — SIGNATURES ATTENDUES DE LA QUÊTE 3.1 (format du registre)

> ⚠ **Seuils et pondérations : verrou [9]** — les valeurs ci-dessous sont des PROPOSITIONS de
> production (provisoires concepteur), jamais des décisions. Re-signature professionnelle avant bêta.
> **Marquage mission V9** : chaque seuil porte le statut **« À VALIDER PAR LE COMITÉ »** —
> l'adoption FM-019 fixe la valeur de départ ; la re-signature professionnelle avant bêta reste requise.
> Aucune signature de sécurité (trame) n'est attachée à cette quête — vérifié au registre du mélange
> (n_trames = 0).

## Les variables fournies par la quête

| Variable | Source | Domaine |
|---|---|---|
| **CHRONO_D** | matinalité déclarée (Q3.1-01 → 05, I recodés, normalisée) — haut = matin, bas = soir | 0-1 |
| **EC_CHRONO** | écart de rythme entre deux profils = \|CHRONO_A − CHRONO_B\| | 0-1 |

| ID | Nom | Conditions exactes | Conséquence | Source | Fenêtre cible |
|---|---|---|---|---|---|
| **SIG-3.1-01** | Le rythme | **Seuils blocs sur CHRONO_D** (proposition — À VALIDER PAR LE COMITÉ [9] ; bornes reprises FM-019 comme valeurs de départ) : **matinal > 0.65 · intermédiaire 0.35-0.65 · nocturne < 0.35** | Rendu descriptif par profil (miroir 07, carte, badge 🌅/🦉 pour les extrêmes) — trois façons égales d'habiter la journée, aucune normée ; le profil ne commente jamais la discipline ni l'énergie, il décrit L'HEURE où la personne est à soi | 5 items déclaratifs (concept public : chronotype — nommé côté moteur uniquement) | recalcul à chaque mise à jour ⚠ |
| **SIG-3.1-02** | La compatibilité de rythme | **EC_CHRONO entre deux profils** — l'écart est une INFORMATION CONVERSATIONNELLE (proposition — À VALIDER PAR LE COMITÉ [9]) : sur écart fort (proposition : > 0.30), le moteur prépare des amorces « vos meilleurs moments communs » (le créneau où les deux énergies se croisent) et documente la friction des agendas (le soir de l'un est le matin de l'autre) | **Jamais une pénalité dure, jamais une élimination, jamais un score rendu** — l'écart module au plus un signal conversationnel doux ; un couple matinal × nocturne est légitime (les meilleurs moments communs existent — le déjeuner du dimanche, la fin d'après-midi) ; aucune trace de l'écart calculé à un membre | 5 items déclaratifs (écart d'axe unique) | recalcul à chaque mise à jour d'un des deux profils ⚠ |

## Notes de registre

- **La compatibilité de rythme n'est PAS une homophilie dure** : la recherche documente des couples
  à rythmes divergents satisfaits — l'écart informe la conversation (les agendas, les dimanches,
  les soirées), il ne prédit ni n'élimine. Formulations au rendu : « conduit souvent à se poser
  la question de… », jamais « vos rythmes sont incompatibles ».
- **Le badge 🦉/🌅** : marqueur de conversation (pas un filtre, pas un grade) — l'intermédiaire
  n'a pas de badge : les deux extrêmes ont un animal, l'entre-deux a son rythme et c'est tout
  (documenté au 04, verrou 5).
- **Registre probabiliste obligatoire** : toute conséquence documentée dans un miroir s'exprime en
  « conduit souvent à », « la recherche documente que » — jamais « tu finiras par ».
- **Aucune asymétrie de jugement** : l'écart entre un matinal et un nocturne se documente des DEUX
  côtés de la même façon — personne n'est « le lève-tard » de l'équation.
- **Le nom du concept (chronotype, matinalité) reste moteur** — au rendu : le pic, l'horloge libre,
  les heures fortes (règle de jargon [3]).
- SIG-3.1-01 et SIG-3.1-02 sont rejouées contre les portraits du Monde selon le protocole du
  Registre des Signatures.

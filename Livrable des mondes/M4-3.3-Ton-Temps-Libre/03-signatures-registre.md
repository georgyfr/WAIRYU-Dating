# LIVRABLE 3 — SIGNATURES ATTENDUES DE LA QUÊTE 3.3 (format du registre)

> ⚠ **Seuils et pondérations : verrou [9]** — les valeurs ci-dessous sont des PROPOSITIONS de
> production (provisoires concepteur), jamais des décisions. Re-signature professionnelle avant bêta.
> **Marquage mission V9** : chaque seuil porte le statut **« À VALIDER PAR LE COMITÉ »** —
> l'adoption FM-019 fixe la valeur de départ ; la re-signature professionnelle avant bêta reste requise.
> La signature SIG-3.3-03 porte le signal **CSR** (code gelé du dictionnaire [4] — registre
> signaux.json : « consommations comportementales — alimente quête 3.3 ») : côté moteur SEUL,
> jamais en UI (Constitution [3]).

## Les variables fournies par la quête

| Variable | Source | Domaine |
|---|---|---|
| **MODE_D** | centrifugie déclarée (Q3.3-01 → 04, I recodés, normalisée) — haut = centrifuge, bas = centripète | 0-1 |
| **FOND_D** | ancrage-partage des loisirs de fond (Q3.3-05 → 08, I recodés, normalisée) — haut = ancré et partagé | 0-1 |
| **CSR** | score des 4 trames ▲ (Q3.3-T09 → T12, D, normalisé) — **moteur SEUL** | 0-1 |
| **EC_MODE** | écart de mode entre deux profils = \|MODE_A − MODE_B\| | 0-1 |

| ID | Nom | Conditions exactes | Conséquence | Source | Fenêtre cible |
|---|---|---|---|---|---|
| **SIG-3.3-01** | Le mode | **Seuils blocs sur MODE_D** (proposition — À VALIDER PAR LE COMITÉ [9] ; bornes reprises FM-019 comme valeurs de départ) : **centrifuge > 0.65 · mixte 0.35-0.65 · centripète < 0.35** | Rendu descriptif par profil (miroir 07, carte) — deux façons égales de se nourrir + l'entre-deux ; le profil ne commente jamais la sociabilité ni la sédentarité, il décrit D'OÙ vient l'énergie | 4 items déclaratifs (concept : loisirs centrifuges/centripètes — refonte, côté moteur) | recalcul à chaque mise à jour ⚠ |
| **SIG-3.3-02** | Le croisement des modes | **EC_MODE > 0.30 entre deux profils** (proposition — À VALIDER PAR LE COMITÉ [9]) : centrifuge × centripète → friction documentée (refonte verbatim : « l'un se sent délaissé, l'autre étouffé ») → signal conversationnel « à aborder tôt » ; FOND_D croisé : l'homogamie des loisirs documente qu'au moins UNE activité de fond partagée → satisfaction supérieure (registre fréquentiel — amorces préparées côté moteur) | Signal conversationnel « à aborder tôt » — **jamais une pénalité dure, jamais une élimination, jamais l'écart calculé rendu** ; un couple de modes opposés est légitime (la friction est une information, pas un défaut) | 4 items mode + 4 items fond (écart d'axes) | recalcul à chaque mise à jour d'un des deux profils ⚠ |
| **SIG-3.3-03** | La vigilance des consommations (signal CSR) | **Score des 4▲ (T09 → T12) au-dessus du seuil de vigilance T1** (proposition — À VALIDER PAR LE COMITÉ [9], valeur consignée hors dépôt) : signal interne de vigilance ; **croisement avec les réalités déclarées (2.4)** : incohérence déclaré × consommation (ex : tabac modéré déclaré + score consommation élevé) → **fiabilité du profil ajustée** (facteur de confiance, précédent SIG_CONTRIB) ; protection des couplages à risque (deux scores élevés croisés → signal) | **Côté moteur SEUL — jamais un affichage, jamais une exclusion, jamais une stigmatisation, jamais au score de compatibilité, jamais au premium** ; contenu bienveillant proposé au profil concerné ; la sortie existe (le score suit la demi-vie des signaux) | 4 trames ▲ CSR (énoncés hors dépôt — document trames Partie 7) | recalcul à chaque mise à jour ⚠ · demi-vie du signal ⚠ |

## Notes de registre

- **La frontière capitale — rendu vs vigilance** : MODE_D et FOND_D se racontent (miroir, carte) ;
  **CSR ne se raconte JAMAIS** — aucune trame n'apparaît dans un miroir, une carte, un rappel,
  ni au match, ni au premium (règles d'administration Partie 0, document trames hors dépôt).
- **Le croisement 2.4 est une fiabilité, pas une accusation** : l'incohérence déclaré ×
  consommation ajuste la FIABILITÉ du profil (une prudence de lecture) — elle ne qualifie pas la
  personne de menteuse, elle ne réduit pas son score de compatibilité.
- **Registre probabiliste obligatoire** : « conduit fréquemment à », « la recherche documente
  que » — jamais « tu finiras par ».
- **Aucune asymétrie de jugement** : la friction centrifuge × centripète se documente des DEUX
  côtés — le délaissé et l'étouffé sont deux vécus symétriques, aucun n'est « le problème ».
- **Zéro jargon rendu** : MODE_D, FOND_D, CSR, SIG-3.3-01/02/03, les concepts (centrifuge,
  homogamie, addictions comportementales) restent moteur — au rendu : le dehors, le chez-soi, le
  fond, les amis (règle de jargon [3]).
- SIG-3.3-01/02 sont rejouées contre les portraits du Monde selon le protocole du Registre des
  Signatures ; SIG-3.3-03 est rejouée hors dépôt (le signal n'apparaît nulle part au dépôt rendu).

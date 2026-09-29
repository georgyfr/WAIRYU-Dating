# LIVRABLE 3 — SIGNATURES ATTENDUES DE LA QUÊTE 3.4 (format du registre)

> ⚠ **Seuils et pondérations : verrou [9]** — les valeurs ci-dessous sont des PROPOSITIONS de
> production (provisoires concepteur), jamais des décisions. Re-signature professionnelle avant bêta.
> **Marquage mission V9** : chaque seuil porte le statut **« À VALIDER PAR LE COMITÉ »** —
> l'adoption FM-019 fixe la valeur de départ ; la re-signature professionnelle avant bêta reste requise.
> La signature SIG-3.4-03 porte le signal **DGR** (code gelé du dictionnaire [4] — registre
> signaux.json : « dangerosité réactive — impulsivité × instabilité · évaluation complète aux
> Mondes argent et tension ») : côté moteur SEUL, jamais en UI (Constitution [3]).

## Les variables fournies par la quête

| Variable | Source | Domaine |
|---|---|---|
| **DEP_D** | dépense déclarée (Q3.4-01 → 03, I recodés, normalisée) — haut = dépensier | 0-1 |
| **CALC_D** | calcul déclaré (Q3.4-04 → 06, I recodés, normalisée) — haut = calculé | 0-1 |
| **DGR_IF** | impulsivité financière (Q3.4-T07 → T08, D, normalisé) — **moteur SEUL**, alimente DGR | 0-1 |
| **EC_DEP** | écart de dépense entre deux profils = \|DEP_A − DEP_B\| | 0-1 |

| ID | Nom | Conditions exactes | Conséquence | Source | Fenêtre cible |
|---|---|---|---|---|---|
| **SIG-3.4-01** | Le profil | **Lecture 2 axes** (proposition — À VALIDER PAR LE COMITÉ [9] ; bornes reprises FM-019) : déviations dD = \|DEP_D − 0.5\|, dC = \|CALC_D − 0.5\| ; **si max(dD, dC) ≤ 0.15 → central** ; sinon l'axe le plus dévié choisit le côté → **4 quadrants** (dépensier×spontané · dépensier×calculé · économe×spontané · économe×calculé). Départage dD = dC : l'axe dépense tranche (la 1re cause de dispute documentée) | Rendu descriptif par profil (miroir 07, carte) — quatre façons égales d'habiter un budget + l'entre-deux ; aucun quadrant n'est « responsable » contre un autre « insouciant » ; le profil décrit un tempo, jamais un défaut | 6 items déclaratifs (concept : gestion financière du couple — côté moteur) | recalcul à chaque mise à jour ⚠ |
| **SIG-3.4-02** | La friction financière | **EC_DEP > 0.30 entre deux profils** (proposition — À VALIDER PAR LE COMITÉ [9]) : écart dépensier × économe fort → signal conversationnel « à aborder tôt » — la dispute d'argent = 1re cause de dispute conjugale documentée (refonte) ; prédicteur de friction quotidien puissant | Signal conversationnel « à aborder tôt » — amorces préparées côté moteur (les comptes communs, les gros achats, l'épargne) ; **jamais une pénalité dure, jamais une élimination, jamais l'écart calculé rendu à un membre** ; un couple dépensier × économe est légitime (les complémentarités existent — la friction se nomme, elle ne condamne pas) | 6 items déclaratifs (écart d'axe) | recalcul à chaque mise à jour d'un des deux profils ⚠ |
| **SIG-3.4-03** | DGR — l'étage argent | **DGR_IF au-dessus du seuil de vigilance** (proposition — À VALIDER PAR LE COMITÉ [9], valeur consignée hors dépôt) : les 2▲ alimentent **DGR** (dangerosité réactive — impulsivité × instabilité) en **croisement moteur avec 1.4 (auto-contrôle) et 1.5 (épreuve du temps — IMP_B)** ; le registre signaux.json anticipait l'« évaluation complète aux Mondes argent et tension » — cette quête EST l'étage argent ; le croisement 1.5 (mesure comportementale) × impulsivité financière déclarée (trames) × auto-contrôle (1.4) construit la lecture transversale | **Côté moteur SEUL — jamais au rendu, jamais au score de compatibilité, jamais au matching, jamais au premium** ; alimente le pré-signal SIG_DGR_PRECURSEUR (n° 32, quête 1.4) qui passe en lecture complète ici ; aucune stigmatisation, aucune exclusion — la sortie existe (demi-vie des signaux) | 2 trames ▲ DGR (énoncés hors dépôt — document trames Partie 7) | recalcul à chaque mise à jour ⚠ · demi-vie du signal ⚠ |

## Notes de registre

- **La frontière capitale — rendu vs vigilance** : DEP_D et CALC_D se racontent (miroir, carte) ;
  **DGR_IF ne se raconte JAMAIS** — les 2▲ n'apparaissent dans aucun slot, aucune carte, aucun
  rappel, ni au match, ni au premium (règles d'administration Partie 0, document trames hors dépôt).
- **La friction financière n'est pas une accusation** : l'écart se documente au registre
  fréquentiel (« les couples à distances dépensier/économe fortes rapportent fréquemment des
  disputes d'argent » — 1re cause documentée) — jamais « vos budgets sont incompatibles ».
- **Le croisement 1.4 × 1.5 est une lecture transversale, jamais un verdict** : DGR agrège des
  lectures d'impulsivité sous des angles indépendants (comportemental 1.5, déclaratif-trame 3.4,
  auto-contrôle 1.4) — il protège (vigilance, confiance), il ne qualifie personne.
- **Registre probabiliste obligatoire** : « conduit fréquemment à », « la recherche documente
  que » — jamais « tu finiras par te disputer ».
- **Zéro jargon rendu** : DEP_D, CALC_D, DGR_IF, SIG-3.4-01/02/03 restent moteur — au rendu : le
  coup de cœur, la nuit qui passe, les comptes qui se lisent (règle de jargon [3]).
- SIG-3.4-01/02 sont rejouées contre les portraits du Monde selon le protocole du Registre des
  Signatures ; SIG-3.4-03 est rejouée hors dépôt (le signal n'apparaît nulle part au dépôt rendu).

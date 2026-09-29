# LIVRABLE 3 — SIGNATURES ATTENDUES DE LA QUÊTE 3.2 (format du registre)

> ⚠ **Seuils et pondérations : verrou [9]** — les valeurs ci-dessous sont des PROPOSITIONS de
> production (provisoires concepteur), jamais des décisions. Re-signature professionnelle avant bêta.
> **Marquage mission V9** : chaque seuil porte le statut **« À VALIDER PAR LE COMITÉ »** —
> l'adoption FM-019 fixe la valeur de départ ; la re-signature professionnelle avant bêta reste requise.
> Aucune signature de sécurité (trame) n'est attachée à cette quête — vérifié au registre du mélange
> (n_trames = 0).

## Les variables fournies par la quête

| Variable | Source | Domaine |
|---|---|---|
| **PLAN_D** | planification déclarée (Q3.2-01 → 05, I recodés, normalisée) — haut = planificateur | 0-1 |
| **ORDRE_D** | ordre domestique déclaré (Q3.2-06 → 08, I recodés, normalisée) — haut = ordonné | 0-1 |
| **EC_PLAN** | écart de planification entre deux profils = \|PLAN_A − PLAN_B\| | 0-1 |
| **EC_ORDRE** | écart d'ordre domestique entre deux profils = \|ORDRE_A − ORDRE_B\| | 0-1 |

| ID | Nom | Conditions exactes | Conséquence | Source | Fenêtre cible |
|---|---|---|---|---|---|
| **SIG-3.2-01** | Le profil quotidien | **Lecture 2 axes** (proposition — À VALIDER PAR LE COMITÉ [9] ; bornes reprises FM-019) : déviations dP = \|PLAN_D − 0.5\|, dO = \|ORDRE_D − 0.5\| ; **si max(dP, dO) ≤ 0.15 → central** (l'entre-deux selon les jours) ; sinon l'axe le plus dévié choisit le côté → **4 quadrants** (planificateur×ordonné · planificateur×désordonné · improvisateur×ordonné · improvisateur×désordonné). Départage dP = dO : l'axe ordre tranche (le domestique se vit plus souvent que l'agenda) | Rendu descriptif par profil (miroir 07, carte) — quatre façons égales d'habiter un quotidien + l'entre-deux ; aucun quadrant n'est « mieux tenu » ; le profil décrit un fonctionnement, jamais une paresse ni une rigidité | 8 items déclaratifs (construction Wairyu) | recalcul à chaque mise à jour ⚠ |
| **SIG-3.2-02** | La friction domestique | **EC_PLAN > 0.30 entre deux profils** (proposition — À VALIDER PAR LE COMITÉ [9]) : friction planificateur × improvisateur documentée — « à aborder tôt » (les vacances, les rendez-vous, les week-ends : deux styles opposés = friction quotidienne, refonte verbatim). **EC_ORDRE > 0.30** : même registre sur le seuil de tolérance (l'ordre × le désordre — motif de rupture réel, statistiquement sous-estimé par la science, sur-estimé par les couples) | Signal conversationnel « à aborder tôt » — amorces préparées côté moteur ; **jamais une pénalité dure, jamais une élimination, jamais l'écart calculé rendu à un membre** ; le désordre n'est pas une paresse et l'ordre n'est pas une rigidité au rendu | 8 items déclaratifs (écart d'axes) | recalcul à chaque mise à jour d'un des deux profils ⚠ |

## Notes de registre

- **La friction se nomme tôt, elle ne prédit rien** : le registre fréquentiel (« les couples à
  styles opposés rapportent fréquemment des frictions d'agenda ») — jamais un verdict de couple.
- **La « sur-estimation par les couples » (refonte)** : le rendu évite d'amplifier le désordre en
  motif d'alarme — la recherche le documente comme sous-estimé par la science et SUR-estimé par
  les couples : le miroir le dit, la friction se négocie (un seuil de tolérance partagé se pose,
  il ne s'impose pas).
- **Registre probabiliste obligatoire** : « conduit fréquemment à », « la recherche documente
  que » — jamais « tu finiras par te battre pour... ».
- **Aucune asymétrie de jugement** : l'écart entre un planificateur et un improvisateur se
  documente des DEUX côtés — personne n'est « le désorganisé » de l'équation.
- **Zéro jargon rendu** : PLAN_D, ORDRE_D, les quadrants (ID moteur) restent côté moteur — au
  rendu : le programme, le fil des choses, la place (règle de jargon [3]).
- SIG-3.2-01 et SIG-3.2-02 sont rejouées contre les portraits du Monde selon le protocole du
  Registre des Signatures.

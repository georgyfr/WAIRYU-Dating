# LIVRABLE 3 — SIGNATURES ATTENDUES DE LA QUÊTE 4.2 (format du registre)

> ⚠ **Seuils et pondérations : verrou [9]** — valeurs de production PROVISOIRES
> (**« À VALIDER PAR LE COMITÉ »**, provisoire concepteur — re-signature professionnelle
> avant bêta, FM-019).
> **RB1 et RSQ sont des codes gelés du dictionnaire [4]** (registre signaux.json) — côté
> moteur SEUL, jamais en UI (Constitution [3]).

## Les variables fournies par la quête

| Variable | Source | Domaine |
|---|---|---|
| **INT_D** | intégration déclarée (Q4.2-01 → 05, I recodés, normalisée) — haut = intégré | 0-1 |
| **ETAT_D** | l'état qui travaille (Q4.2-06 → 10, I recodés, normalisée) — haut = état chargé | 0-1 |
| **RSQ_D** | réassurance recherchée (Q4.2-11 → 18, I recodés, normalisée) — haut = confirmations recherchées | 0-1 |
| **DISP** | DISP = (INT_D + (1 − ETAT_D)) / 2 — la lecture de disponibilité (rendu descriptif) | 0-1 |
| **FIS/MEFI_42** | parts des variables du bloc 4.4 portées par cette passation (T15 → T22, D, normalisées) — **moteur SEUL** | 0-1 |

| ID | Nom | Conditions exactes | Conséquence | Source | Fenêtre cible |
|---|---|---|---|---|---|
| **SIG-4.2-01** | Où tu en es | **3 bandes sur DISP** (proposition — À VALIDER PAR LE COMITÉ [9]) : **apaisé ≥ 0.60 · en travail ≤ 0.40 · en chemin entre les deux**. Départage au bord : la bande INT_D décide (l'intégration porte la lecture) | Rendu descriptif **météo** (miroir 07, carte) — trois états respectés, aucun sens de lecture imposé, **JAMAIS des stades de guérison** (interdit V10) ; personne n'est « en retard », l'état en travail n'est pas un échec | 18 items déclaratifs | recalcul à chaque mise à jour ⚠ |
| **SIG-4.2-02** | RB1 — gatekeeping rebound | **ETAT_D haut × INT_D bas** (proposition — À VALIDER PAR LE COMITÉ [9], valeurs consignées hors dépôt si sensibles) : le moteur y voit le rebond amaoureux (gatekeeping) pendant que le voyageur y voit son état — double sens assumé du refonte | **Côté moteur SEUL — JAMAIS au rendu, JAMAIS un verdict de guérison** (interdit V10), jamais au score affiché, jamais au match, jamais au premium ; alimente les protections (pacing de découverte, modération des mises en avant) — la sortie existe (demi-vie du signal) ; aucune stigmatisation | 10 items RB1 (état + intégration) | recalcul à chaque mise à jour ⚠ · demi-vie ⚠ |
| **SIG-4.2-03** | RSQ — l'adaptatif anti-burnout | **RSQ_D haut** (proposition — À VALIDER PAR LE COMITÉ [9]) : le pacing s'adoucit (espacement des questions, tonalité des rappels, pas de nudge agressif) ; **croisement matrice 4.4** : Méfiance (MEFI) × RSQ haut = **protection** (le blessé est protégé, le stratège est neutralisé — doctrine établie) | Côté moteur : UX adaptative + matrice — jamais un score rendu, jamais une étiquette ; au rendu, l'expérience devient simplement plus douce, sans que rien ne se raconte | 8 items RSQ | recalcul à chaque mise à jour ⚠ |

## Notes de registre

- **Trois météos, jamais un barème** : apaisé / en chemin / en travail se valent — le rendu
  décrit, il ne note pas ; aucun « il te reste à… », aucun « presque là ».
- **Le double sens RB1 est la quête elle-même** (refonte : « l'utilisateur y voit sa
  guérison, le moteur y voit le rebound ») — l'interface reste dans le premier sens, le
  moteur dans le second, et **rien ne traverse**.
- **FIS/MEFI_42 ne se racontent JAMAIS** : les 8 trames hébergées n'apparaissent dans aucun
  slot, aucune carte, aucun rappel (Partie 0, document trames hors dépôt).
- **La ouverte Q4.2-19 est hors de tout rendu** (interdit V10) : aucun extrait nulle part —
  son analyse (BLA) vit en P2 côté moteur.
- **Registre probabiliste obligatoire** — « la recherche documente que », jamais le futur certain.
- **Zéro jargon rendu** : INT_D, ETAT_D, RSQ_D, DISP, RB1, BLA, SIG-4.2-01/02/03 restent moteur.
- SIG-4.2-01 est rejouée contre les portraits du Monde selon le protocole du Registre des
  Signatures ; SIG-4.2-02/03 (moteur) sont rejouées hors dépôt.

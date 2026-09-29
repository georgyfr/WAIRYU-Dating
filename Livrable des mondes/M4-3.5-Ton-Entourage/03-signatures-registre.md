# LIVRABLE 3 — SIGNATURES ATTENDUES DE LA QUÊTE 3.5 (format du registre)

> ⚠ **Seuils et pondérations : verrou [9]** — les valeurs ci-dessous sont des PROPOSITIONS de
> production (provisoires concepteur), jamais des décisions. Re-signature professionnelle avant bêta.
> **Marquage mission V9** : chaque seuil porte le statut **« À VALIDER PAR LE COMITÉ »** —
> l'adoption FM-019 fixe la valeur de départ ; la re-signature professionnelle avant bêta reste requise.
> Aucune signature de sécurité (trame) n'est attachée à cette quête — vérifié au registre du mélange
> (n_trames = 0).

## Les variables fournies par la quête

| Variable | Source | Domaine |
|---|---|---|
| **ENTOUR_D** | poids de l'entourage déclaré (Q3.5-01 → 06, I recodés, normalisée) — haut = fusionnel, bas = indépendant | 0-1 |
| **EC_ENTOUR** | écart de poids entre deux profils = \|ENTOUR_A − ENTOUR_B\| | 0-1 |

| ID | Nom | Conditions exactes | Conséquence | Source | Fenêtre cible |
|---|---|---|---|---|---|
| **SIG-3.5-01** | Le profil | **Seuils blocs sur ENTOUR_D** (proposition — À VALIDER PAR LE COMITÉ [9] ; bornes reprises FM-019 comme valeurs de départ) : **fusionnel > 0.65 · équilibre 0.35-0.65 · indépendant < 0.35** | Rendu descriptif par profil (miroir 07, carte) — trois façons égales d'habiter un entourage, aucune normée ; le profil ne commente jamais la fidélité familiale ni l'autonomie, il décrit une PLACE | 6 items déclaratifs (concepts publics : différenciation + homogamie sociale — nommés côté moteur uniquement) | recalcul à chaque mise à jour ⚠ |
| **SIG-3.5-02** | La friction des entourages | **EC_ENTOUR > 0.30 entre deux profils** (proposition — À VALIDER PAR LE COMITÉ [9]) : fusionnel × indépendant → signal conversationnel « à aborder tôt » (refonte verbatim : « fusionnel × fusionnel = OK, fusionnel × indépendant = friction documentée ») — les fêtes de Noël, les dimanches, les devoirs envers les familles | Signal conversationnel « à aborder tôt » — amorces préparées côté moteur (les fêtes, les dimanches, les invitations) ; **jamais une pénalité dure, jamais une élimination, jamais l'écart calculé rendu à un membre** ; un couple fusionnel × indépendant est légitime — la friction est une information, pas un défaut | 6 items déclaratifs (écart d'axe unique) | recalcul à chaque mise à jour d'un des deux profils ⚠ |

## Notes de registre

- **La différenciation n'est PAS l'indépendance** : le concept public (différenciation de soi —
  rester soi dans le lien) ne se traduit JAMAIS par « l'indépendant est différencié, le fusionnel
  ne l'est pas » — la différenciation existe dans les deux profils : on peut être fusionnel ET
  différencié (choisir sa place en famille), indépendant ET fusionné à sa manière. Au rendu :
  des places, jamais des degrés de maturité.
- **L'homogamie sociale s'informe, elle ne filtre pas** : la ressemblance des milieux et des
  entourages documente des facilités d'intégration — jamais un critère d'élimination (le rendu
  n'en parle pas ; le moteur peut l'utiliser en douceur, À VALIDER PAR LE COMITÉ).
- **Registre probabiliste obligatoire** : « conduit fréquemment à », « la recherche documente
  que » — jamais « vos familles vont s'affronter ».
- **Aucune asymétrie de jugement** : la friction fusionnel × indépendant se documente des DEUX
  côtés — personne n'est « le collé » ni « le distant » de l'équation.
- **Zéro personne nommée au rendu** : la belle-famille se parle en situations (la fête, le
  dimanche, l'appel), jamais en personnages.
- SIG-3.5-01 et SIG-3.5-02 sont rejouées contre les portraits du Monde selon le protocole du
  Registre des Signatures.

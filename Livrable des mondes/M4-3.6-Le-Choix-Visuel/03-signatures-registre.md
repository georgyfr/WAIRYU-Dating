# LIVRABLE 3 — SIGNATURES ATTENDUES DE LA QUÊTE 3.6 (format du registre)

> ⚠ **Seuils et pondérations : verrou [9]** — les valeurs ci-dessous sont des PROPOSITIONS de
> production (provisoires concepteur), jamais des décisions. Re-signature professionnelle avant bêta.
> **Marquage mission V9** : chaque seuil porte le statut **« À VALIDER PAR LE COMITÉ »** —
> l'adoption FM-019 fixe la valeur de départ ; la re-signature professionnelle avant bêta reste requise.
> Aucune signature de sécurité (trame) n'est attachée à cette quête — vérifié au registre du mélange
> (n_trames = 0). La **lecture complémentaire** de la paire P6 suit l'**Arbitrage 4** (mission V9.F).

## Les variables fournies par la quête

| Variable | Source | Domaine |
|---|---|---|
| **VISO_ANC** | nombre de choix du pôle d'ancrage (8 paires : P1-A · P2-A · P3-B · P4-B · P5-A · P6-B · P7-A · P8-B) | 0-8 |
| **VISO_HOR** | 8 − VISO_ANC (pôle d'horizon — complémentaire) | 0-8 |

| ID | Nom | Conditions exactes | Conséquence | Source | Fenêtre cible |
|---|---|---|---|---|---|
| **SIG-3.6-01** | Le lecteur d'images | **Partition exclusive + exhaustive de 0 à 8 sur VISO_ANC** (proposition — À VALIDER PAR LE COMITÉ [9]) : **ancré-dominant ≥ 6 · équilibre 3-5 · horizon-dominant ≤ 2** | Rendu descriptif par lecteur (miroir 07, carte) — trois teintes, aucune normée ; **mesure FAIBLE : le lecteur ne participe JAMAIS seul à un score de compatibilité, jamais à un filtre, jamais au matching** — il nourrit le rendu (miroir, carte) et les brise-glaces du Mode Invisible | 8 paires d'images (concept : projection par le choix — refonte, cadre scientifique assumé) | recalcul à chaque mise à jour ⚠ |
| **SIG-3.6-02** | La lecture complémentaire (CANAL SIGNAL : **signal_id null**) | **P6 (les deux portes) porte une lecture sécurité FAIBLE éventuelle** — contrôle/isolement : une porte systématiquement fermée, CROISÉE d'autres signaux du profil, peut documenter un isolement — **Arbitrage 4 (mission V9.F) : « lecture complémentaire, code à arbitrer par le comité si requis »** | **AUCUN signal actif en l'état** : signal_id null — la lecture vit dans la présente documentation, elle ne calcule rien, ne filtre rien, ne se rend JAMAIS ; si le comité l'arbitre, une Fiche de Mutation créera le code (procédure [4] : demande → validation comité → fiche → ensuite production) | paire P6 + croisements éventuels (moteur) | jamais en l'état ⚠ — uniquement après arbitrage comité |

## Notes de registre

- **La mesure faible a une discipline (refonte verbatim)** : « traitée comme signal complémentaire
  (jamais seule, jamais clinique) et comme contenu conversationnel premier » — le rendu parle de
  teintes et d'images, jamais de profil psychologique ; aucune interprétation clinique d'une paire
  isolée (le refus Rorschach/TAT du refonte s'applique : la projection ne se diagnostique pas).
- **Les brise-glaces sont le produit principal** : chaque paire choisie devient une amorce de
  conversation naturelle du Mode Invisible — la valeur de la quête est conversationnelle, pas
  psychométrique (le scoring existe pour un rendu léger, pas pour un filtrage).
- **Registre probabiliste obligatoire** : « suggère », « oriente souvent vers » — jamais « révèle
  que tu es ».
- **Aucune asymétrie de jugement** : l'ancre et l'horizon sont deux façons égales d'habiter des
  images — aucun lecteur n'est « mieux équilibré » qu'un autre.
- **Zéro jargon rendu** : VISO_ANC, VISO_HOR, SIG-3.6-01/02, « pôle d'ancrage » restent moteur —
  au rendu : « ton intérieur choisi », « ta fenêtre choisie » (règle de jargon [3]).
- SIG-3.6-01 est rejouée contre les portraits du Monde selon le protocole du Registre des
  Signatures ; SIG-3.6-02 est une documentation d'arbitrage — elle n'est rejouée QUE si le comité
  crée le code (Fiche de Mutation obligatoire).

# LIVRABLE 3 — SIGNATURES ATTENDUES DE LA QUÊTE 2.5 (format du registre)

> ⚠ **Seuils et fenêtres : ADOPTÉS comme valeurs de départ (décision comité, FM-019) — provisoire concepteur — re-signature professionnelle avant bêta.**
> Aucune signature de sécurité n'est attachée à cette quête (aucun item de trame — vérifié au registre du mélange).
> **NOTE TROMPERIE OBLIGATOIRE** : la détection de tromperie (SIG-2.5-03) est un signal
> **MOTEUR SEUL** — jamais affiché, jamais suggéré, jamais dit à l'utilisateur, jamais au match,
> jamais dans les portraits. Elle module la fiabilité de l'intention côté moteur, elle ne punit pas.

| ID | Nom | Conditions exactes | Conséquence | Source | Fenêtre cible |
|---|---|---|---|---|---|
| **SIG-2.5-01** | L'intention affichée | Agrégat cohérent des 3 binaires + la 4ᵉ réponse : (01 Oui · 03 Non) = exclusivité posée · (01 Non · 02 Oui · 03 Non) = découverte · (03 Oui) = non-exclusivité assumée · **4ᵉ réponse « Je découvre » = en exploration (état déclaré, compatible avec tout : aucun dealbreaker, aucun drapeau)** | Intention affichée **restituable** (carte, miroir S1) + alimente le matching de base (croisement avec Q2.3-08 des autres, bidirectionnel) | Q2.5-01 → Q2.5-03 | recalcul à chaque modification de réponse ⚠ |
| **SIG-2.5-02** | La contradiction interne | Q2.5-01 « Oui » **ET** Q2.5-03 « Oui » (contradiction logique directe : les deux énoncés s'excluent) | Drapeau **QFI** — MOTEUR SEUL + miroir **dégradé** d'un degré, reformulé avec prudence. AUCUN texte accusateur, aucune juxtaposition des deux réponses en forme de reproche | Q2.5-01 × Q2.5-03 chez le même membre | < 5 % ⚠ |
| **SIG-2.5-03** | Le décalage affiché × vécu | Croisement entre l'intention AFFICHÉE (cette quête) et l'intention RÉELLE mesurée plus tard (6.1 — invisible, opt-in, M8) — divergence au-delà d'un seuil ⚠ | **Détection de tromperie — MOTEUR SEUL** : module la fiabilité de l'intention dans le matching. Zéro trace UI, zéro statut, zéro sanction visible. ÉTAT : **EN ATTENTE D'ACTIVATION** (pré-requis : matérialisation de 6.1) | 2.5 × 6.1 | à définir avec 6.1 ⚠ |

## Notes de registre

- **Registre probabiliste obligatoire** : toute conséquence documentée dans un miroir s'exprime en
  « conduit fréquemment à », « la recherche documente que » — jamais « tu finiras par ».
- **NOTE TROMPERIE (développement)** : le source table le mécanisme (« Dealbreaker binaire + croisement
  intention réelle (6.1) → détecte tromperie », l.1939). Wairyu le tient à la doctrine : la tromperie
  détectée n'est ni montrée à qui que ce soit, ni punie par un statut ; elle abaisse la confiance du
  moteur dans l'intention affichée et module la prudence du rendu. L'utilisateur garde le droit de
  modifier ses réponses — l'incohérence détectée n'est jamais un verdict sur sa personne.
- **SIG-2.5-03 est dormant** tant que 6.1 n'est pas matérialisée : l'activation, les seuils de divergence
  et la conduite à tenir sont du ressort du comité (verrou [9]).
- **Incomplétude assumée** : 3 binaires ne couvrent pas toutes les intentions (état « Non / Non / Non »
  = incomplet, pas fautif — accueilli par un **message doux** (décision comité), la 4ᵉ réponse
  « Je découvre » offrant une issue déclarée) — voir le tableau des combinaisons au `01-tableau-des-items.md`.
- Les 3 signatures sont rejouées contre les portraits du Monde selon le protocole du Registre des
  Signatures (test de non-régression à maintenir).

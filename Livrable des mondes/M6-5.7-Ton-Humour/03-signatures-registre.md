# LIVRABLE 3 — SIGNATURES ATTENDUES DE LA QUÊTE 5.7 (format du registre)

> ⚠ **Seuils et pondérations : verrou [9]** — valeurs de production PROVISOIRES (marque mission :
> **« À VALIDER PAR LE COMITÉ »**, provisoire concepteur — re-signature professionnelle avant
> bêta, FM-019).
> ⚠ **Le croisement humour × sensibilité au rejet vit MOTEUR SEUL** — jamais au rendu, jamais au
> match, jamais au premium (Constitution [3] — aucune métadonnée ne franchit un texte utilisateur).

## Les variables fournies par la quête

| Variable | Source | Domaine |
|---|---|---|
| **AFFIL_D** | qui rapproche (Q5.7-01 · 02 · 03, I recodés, normalisée) — haut = le rire qui lie le groupe | 0-1 |
| **GAIE_D** | qui dédramatise (Q5.7-04 · 05 · 06, I recodés, normalisée) — haut = le rire qui traverse les coups durs | 0-1 |
| **AGRES_D** | qui blesse (Q5.7-07 · 08 · 09, I recodés, normalisée) — haut = le rire qui pince sa cible | 0-1 |
| **DEGRAD_D** | qui s'auto-rabaisse (Q5.7-10 · 11 · 12, I recodés, normalisée) — haut = le rire qui se prend pour cible | 0-1 |
| **RSQ_haute** (variable d'ENTRÉE externe) | sensibilité au rejet — portée par les blocs RSQ (1.2 ▲ + 4.2) — **seuils propriété des quêtes porteuses, jamais recalculés ici** | booléen moteur |

| ID | Nom | Conditions exactes | Conséquence | Source | Fenêtre cible |
|---|---|---|---|---|---|
| **SIG-5.7-01** | Ton humour raconté | **Cascade du style dominant** (proposition — À VALIDER PAR LE COMITÉ [9]) : dominant = **argmax** des quatre scores ; **si écart(dominant − second) < 0.05 → le secondaire est nommé au rendu** (« ton humour est aussi celui-là » — une phrase, jamais un second profil) ; **si écart ∈ [0.05 ; 0.10] → le secondaire devient une note de prudence au miroir** (sans carte, sans second profil) ; **si égalité exacte entre deux scores → la première position de passation tranche** (précédent SIG-5.3-01) ; sinon style seul | Rendu descriptif : **4 profils miroir + 4 cartes, un par style dominant** — lumière symétrique, ombre = le COÛT (pour soi ET pour l'autre), zéro hiérarchie, zéro classement ; le rendu parle en images (la table qui rit, la pique, le bouclier, la conversation qui attend), jamais en étiquette scientifique | 12 items déclaratifs | recalcul à chaque mise à jour ⚠ |
| **SIG-5.7-02** | La cible et la sensibilité | **MOTEUR SEUL — JAMAIS AU RENDU.** Conditions (proposition — À VALIDER PAR LE COMITÉ [9]) : **AGRES_D haut (≥ 0.65 proposé) ET RSQ_haute** (variable externe des blocs 1.2/4.2 — seuils propriété de ces quêtes) → **drapeau de vigilance** côté moteur : la préparation de la rencontre et la conversation intègrent une prudence (un humour tranchant peut toucher une cible sensible ; et la personne au tranchant elle-même peut lire un malentendu comme un rejet — double lecture documentée) | Conséquence : vigilance UX de préparation (ton des premiers échanges, guides de conversation) — **jamais au score affiché, jamais au match, jamais à la carte, jamais au miroir, jamais au premium** ; marque « À VALIDER PAR LE COMITÉ » gravée ; au rendu, AUCUNE phrase ne mentionne cette lecture | 12 items + variable RSQ externe | recalcul à chaque mise à jour ⚠ |
| **SIG-5.7-03** | L'alchimie attendue (IAC) | **Consigné ATTENDU, pas calculé.** Le croisement des styles d'humour avec l'Indice d'Alchimie Conversationnelle (comportement conversationnel post-match — Phase 2, refonte : « l'IAC enrichira par le comportemental, pas par des tests ») est documenté comme attente : le rire qui rapproche devrait prédire une alchimie d'ouverture ; le rire qui pince devrait se moduler par le retour de l'autre. **Analyse effective repoussée à la Phase 2/3** — aucun calcul, aucun seuil, aucune promesse de rendu en cette génération | Attente documentée au registre (entrée sans effet de production tant que l'IAC n'existe pas) | attente documentée | Phase 2/3 |

## Arbitrage de cascade consigné (2ᵉ génération)

Le bandeau central V11 (proximité ±0.10 des quatre scores → 5ᵉ profil « quatre notes » + 5ᵉ carte)
**n'est pas repris** : la spécification gelée de la phase R fixe **4 profils / 4 cartes, un par
style dominant**. La bande de proximité sert désormais uniquement au **nommage du secondaire** au
miroir (cascade ci-dessus). Consigné — À VALIDER PAR LE COMITÉ (reprend ou rétablit le 5ᵉ profil).

## Liaisons de domaine du CŒUR (attendues V12 — sans calcul)

- **5.7 × 5.4** (le mépris) : un humour qui blesse habité par le mépris change de nature — croisement
  à documenter au Portrait de Domaine (attendu, jamais calculé ici ; les trames ▲ correspondantes
  vivent à 5.4, phase V12 — jamais fusionnées avec cette lecture).
- **5.7 × 5.5** (DGR) : un humour tranchant croisé à la volatilité réactive — attendu V12.
- **Exemption 5.3** : l'expression de l'affection ne croise pas l'humour au score (précédent V11 —
  la quête 5.3 reste conversationnelle, jamais dans le score).

## Notes de registre

- **Citation obligatoire (source libre)** : typologie des styles d'humour — **Martin et al., 2003**
  — crédit scientifique en documentation interne ; le nom d'auteur et le sigle de l'instrument ne
  franchissent JAMAIS le rendu (verrou [3] ; nommage UI verbatim : qui rapproche · qui dédramatise
  · qui blesse · qui s'auto-rabaisse).
- **L'ombre = le coût, jamais la nature** : au rendu, aucun des quatre styles n'est une faute ; les
  coûts se nomment pour soi ET pour l'autre (la cible et la confiance · l'identité qui épuise et
  l'autre qui ne peut pas rassurer à l'infini · le sérieux qui attend · la conversation fermée
  trop tôt).
- **Zéro jargon au rendu** : AFFIL_D, GAIE_D, AGRES_D, DEGRAD_D, RSQ, SIG-5.7-01/02/03, IAC
  restent moteur.
- **Rappels ancrés aux énoncés D uniquement** (règle V11 re-gravée, détail au 04) : une citation
  d'un énoncé I contredit au score haut serait une fausse citation.
- **Registre probabiliste obligatoire** — « la recherche documente que », « conduit fréquemment à »,
  jamais le futur certain ; zéro « toujours/jamais ».
- SIG-5.7-01 est rejouée contre les portraits du Monde selon le protocole du Registre des
  Signatures ; SIG-5.7-02 (croisement) est rejouée hors rendu — ses seuils sont les mêmes verrous
  humains [9] que ceux de la cascade.

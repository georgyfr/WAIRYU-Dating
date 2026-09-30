# LIVRABLE 3 — SIGNATURE ATTENDUE DE LA QUÊTE 5.3 (format du registre)

> ⚠ **Seuils et bornes : verrou [9]** — valeurs de production PROVISOIRES (marque mission :
> **« À VALIDER PAR LE COMITÉ »**, provisoire concepteur — re-signature professionnelle avant bêta, FM-019).
>
> ## 🏛️ RÈGLE CAPITALE — GRAVÉE ICI ET AU 00-README
>
> ## **JAMAIS DANS LE SCORE**
>
> Cette quête est **CONVERSATIONNELLE uniquement**. AUCUNE signature de matching, aucun
> croisement moteur, aucune entrée au score de compatibilité — aucune pondération, aucune
> agrégation, aucune matrice, aucune pénalité, aucune modulation de score. Les 5 moyennes
> de canal et les libellés dominants/secondaires vivent au **rendu conversationnel** (cartes
> de dialogue, miroir, mode d'emploi croisé à deux) et ne franchissent JAMAIS la frontière
> moteur. La marque de la règle s'applique au déploiement comme à l'évolution : toute Fiche
> de Mutation future qui brancherait 5.3 au moteur est par défaut FAUTE DE CONCEPT.

## Exemption de domaine — GRAVÉE

> **5.3 ne participe PAS aux liaisons de domaine du Cœur.** Les liaisons 5.1×5.4, 5.1×5.5,
> 5.2×5.4, 5.2×5.6, 5.7×5.4, 5.7×5.5 **l'excluent explicitement** : aucun croisement de
> quête n'agrège 5.3, aucune cascade n'en part, aucune n'y arrive. La quête vit au
> **Portrait de Domaine du Cœur** (M6+M7, V12) en lecture **CONVERSATIONNELLE uniquement** —
> des mots pour se parler, jamais des chiffres pour se trier.

## Les variables fournies par la quête (restent côté restitution)

| Variable | Source | Domaine | Destination |
|---|---|---|---|
| **CANAL_MOTS** | mots valorisants (Q5.3-01 × 02, I recodé, normalisée) | 0-1 | affichage seul (carte, miroir, signature) |
| **CANAL_TEMPS** | temps partagé (Q5.3-03 × 04, I recodé, normalisée) | 0-1 | affichage seul |
| **CANAL_GESTES** | gestes et services (Q5.3-05 × 06, I recodé, normalisée) | 0-1 | affichage seul |
| **CANAL_ATTENTIONS** | attentions et cadeaux (Q5.3-07 × 08, I recodé, normalisée) | 0-1 | affichage seul |
| **CANAL_CONTACT** | contact physique (Q5.3-09 × 10, I recodé, normalisée) | 0-1 | affichage seul |

**Aucune de ces variables n'a d'autre destination.** Aucun croisement, aucune signature de
matching, aucune entrée au score — **JAMAIS DANS LE SCORE** (clause ci-dessus).

| ID | Nom | Conditions exactes | Conséquence | Source | Fenêtre cible |
|---|---|---|---|---|---|
| **SIG-5.3-01** | Le canal qui parle — conversationnelle | **Lecture affichée** (proposition — À VALIDER PAR LE COMITÉ [9]) : dominant = max des 5 CANAL_* ; secondaire = 2ᵉ du tri ; **écart max − min ≤ 0.25 → profil équilibré** (6ᵉ variante) ; ex æquo strict sur le max → équilibré. Le dominant et le secondaire s'**AFFICHENT** en libellés conversationnels (cartes de dialogue, mode d'emploi croisé) ; ils ne se **calculent JAMAIS en entrée moteur** — aucune agrégation, aucune pondération, aucune signature de matching, aucun croisement | Rendu conversationnel : **« ton canal dominant dit ce qui te remplit — ton canal le plus discret dit ce que tu ne demanderas jamais »** (formulation signature gravée — le rendu utilisateur l'exprime en registre probabiliste, arbitrage consigné au 07 : zéro « toujours/jamais » au texte affiché). Le canal discret se raconte comme une réserve de demandes non formulées — jamais comme un déficit. 6 sorties possibles : 5 canaux + équilibré | 10 items déclaratifs | recalcul à chaque mise à jour ⚠ (affichage) |

## Notes de registre

- **JAMAIS DANS LE SCORE — verrou capital** : répété ici en tant que règle de registre.
  Toute lecture de cette table qui chercherait un « score de quête » agrégé cherchera en
  vain : il n'existe pas et ne doit pas exister — le champ `score: null` est gravé à la
  fiche de computation (06).
- **Marque déposée — interdiction absolue** : le nom commercial du domaine, en français ou
  en anglais, et toute variante, est interdit en toutes lettres dans TOUT le dossier (UI,
  marketing, store, dépôt, rendu) — zéro occurrence, vérifié machine. Le concept des
  **canaux d'expression affective** est public ; les 5 libellés UI sont les formulations
  neutres Wairyu ; les items sont 100 % originaux Wairyu.
- **Symétrie des canaux** : le canal dominant n'est pas une « force » et le canal discret
  n'est pas une « carence » — ce sont deux extrémités d'une même conversation. Le rendu
  présente le discret comme l'adresse des demandes non formulées (formulation signature),
  jamais comme un point à corriger.
- **Ombre ≥ lumière** sur chaque brique du miroir (Constitution [2]) — l'ombre se joue en
  situation de couple, coût pour soi + coût pour l'autre nommés, registre probabiliste.
- **Registre probabiliste obligatoire** — « la recherche documente que », « conduit
  fréquemment à » ; zéro « toujours/jamais » au texte rendu ; zéro futur certain.
- **Zéro métadonnée au rendu** : CANAL_*, SIG-5.3-01, codes d'items restent moteur
  (Constitution [3]).
- SIG-5.3-01 est une signature **d'affichage** : elle se rejoue contre les cartes de dialogue
  du monde 8 selon le protocole du Registre des Signatures — sans jamais produire de valeur
  côté moteur.
- **Exemption de domaine** (gravée ci-dessus) : à rappeler lors de l'écriture du Portrait de
  Domaine du Cœur (V12) — 5.3 y entre en texte conversationnel, pas en variable.

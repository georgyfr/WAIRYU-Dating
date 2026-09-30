# QUÊTE 5.6 « APRÈS UN DÉSACCORD » — FICHE DE CADRAGE PUIS LECTURE DU LIVRABLE

> Monde M7 « Face aux Tempêtes » · 💎 **PREMIUM** (statut_freemium : premium) · Phase P1.5 · Accès Libre (pas d'opt-in)
> 5 items Likert · Codes gelés Q5.6-01 → Q5.6-05 · **5 capacités de réparation × 1 item** — **AUCUNE paire R6**
> **AUCUNE trame dans cette quête** : zéro signal ▲, zéro position réservée, zéro contenu signal au dossier
> (décision comité : ne JAMAIS réinventer les trames perdues T01-T42 — document trames hors dépôt)
> Source : Constitution v2.1 [5] [6] [7] · refonte gelée (statut quête — « 5.6 | « Après un désaccord » | ✅ | — » ;
> bloc gestion des tensions l. 706-708 — « ce qui prédit la survie d'un couple, ce n'est pas la fréquence des
> conflits — c'est la qualité des réparations : savoir s'excuser, faire le premier pas, utiliser l'humour pour
> désamorcer, tourner la page. Deux personnes qui se disputent beaucoup mais réparent bien durent plus longtemps
> que deux évitants qui ne réparent jamais. » + « La rumination transforme un désaccord banal en blessure
> persistante » ; usage moteur l. 715-717 — « réparation élevée × réparation élevée = amplificateur du score de
> conflit global » ; table PARTIE 5 l. 1992 — « Ta capacité de réparation | Modulateur du score conflit |
> P1.5 | Libre ») · mission V12-c
> B.3 : **production neuve déclarée** — 1ʳᵉ génération V12 (aucune génération antérieure ; angles cadrés au
> refonte gelée, aucun texte hérité ni réinventé).

## 🧭 FICHE DE CADRAGE (lire avant tout le reste)

| Champ | Cadrage |
|---|---|
| **Ce que ça mesure** | La **capacité de RÉPARATION** (concept public de la recherche conjugale — refonte l. 706 : la qualité des réparations prédit la survie du couple mieux que la fréquence des conflits) sur **5 capacités** : **savoir s'excuser · faire le premier pas · utiliser l'humour pour désamorcer · tourner la page sans ruminer · accepter l'excuse de l'autre**. Référence scientifique (moteur seulement) : la recherche conjugale sur les tentatives de réparation — concept public associé aux travaux de Gottman ; le nom d'auteur est INTERDIT au rendu (05, 07, cartes, écrans) et ne vit que dans le présent fichier. |
| **Gabarit OUVERT — neutralité du niveau** | La réparation se mesure à **ce qui se passe après** le désaccord — JAMAIS à la fréquence des disputes. Aucun niveau n'est un verdict : « à travailler » se formule comme une **PORTE** (le muscle se travaille), jamais comme un mur. L'ombre se joue EXCLUSIVEMENT en couple (mécanisme + exemple concret + conséquence probabiliste + coût pour soi ET coût pour l'autre, les deux nommés). Zéro diagnostic, zéro étiquette, zéro hiérarchie des personnes. |
| **Format de réponse** | Likert 5 niveaux · **5 capacités × 1 item — AUCUNE paire R6** (arithmétique documentée : le gabarit gelé donne 5 items pour 5 capacités distinctes ; le drapeau D−I est sans-objet) · orientations **3 D / 2 I** — documenté au 01. |
| **Le modulateur moteur (SIG-5.6-02)** | Réparation × posture de conflit (5.4) : réparation élevée × conflit vif = couple viable (amplificateur documenté refonte l. 717) ; réparation basse × conflit évitant = l'enfer silencieux (refonte l. 706-708). **[MOTEUR SEUL]** — jamais au rendu, jamais en UI, jamais au match affiché. Seuils et poids : « À VALIDER PAR LE COMITÉ ». |
| **Mélange** | Graine **256427** (210427 + 1000 × ordinal 46 — règle de décade ((a−1)×10+b) : quête 5.6 → 46 ; zéro collision vérifiée au dépôt) · outil **générique** `melange.py` (aucune trame — le générique suffit) · config `ci/quetes/5.6.json` **À CRÉER par la session principale** · trace préliminaire réelle exécutée hors dépôt (02) — course officielle à re-jouer dès création de la config · c1/c4 **sans-objet** (mono-dimension — docstring de l'outil : « sans-objet si mono-dimension ») : dérogation c1 documentée au 02, comité. |
| **Signatures attendues** | **SIG-5.6-01 « Ta capacité de réparation »** — 3 niveaux (élévée · à travailler · silencieuse) par moyenne des 5 items (I recodés, normalisée 0-1) ; libellés UI proposés, neutres — comité. **SIG-5.6-02 « Le modulateur »** — croisement 5.6 × 5.4, [MOTEUR SEUL], comité. |
| **Slots prévus** | Miroir **LÉGER** (80-150 mots/variante — **convergence** [7] : 3-7 items → LÉGER, zéro arbitrage) · **3 profils** : un par niveau · 3 cartes (étage 1). |
| **Points de doctrine** | ① Gabarit OUVERT : le miroir ne scelle rien — le niveau se travaille (porte) ; REN compatible : écran d'intro sans promesse, miroir qui ouvre. ② Premium [6] : zéro présupposition des mondes gratuits, zéro teaser — rappels ancrés CETTE quête seule. ③ Tension commune : la réparation ne se mesure pas à la fréquence des disputes mais à ce qui se passe après (registre probabiliste). ④ Aucune trame : 5.6 n'héberge AUCUN signal ▲. ⑤ Coût pour soi ET coût pour l'autre nommés dans chaque ombre. |

## ⚖️ ARBITRAGES CONSIGNÉS (À VALIDER PAR LE COMITÉ)

1. **c1 — quête mono-dimensionnelle (tranché au plus simple)** : 5 capacités, 1 dimension
   unique (`réparation`) → la contrainte c1 (« aucune dimension consécutive ») est
   **TRIVIALEMENT INSATISFAITE** : toute permutation des 5 items crée 4 adjacences de même
   dimension — **c1_min_constructible = 4**, la contrainte perd tout pouvoir discriminant.
   Options examinées : (a) `dimension = réparation` pour les 5 items + dérogation
   documentée ; (b) 5 sous-axes internes (excuse / premier pas / humour / page / accueil)
   pour « satisfaire » c1 — **écarté** : avec 1 item par sous-axe, aucune dimension ne se
   répète, c1 n'aurait plus rien à contraindre (le même constat déguisé — 5 codes de
   dimension sans variance intra). **Tranché : (a)** — adaptation de config proposée :
   `c1_sans_objet: true` + `c4_sans_objet: true`, champs PRÉVUS par l'outil générique
   (docstring : « c1 … sans-objet si mono-dimension » · « c4 … sans-objet si
   mono-dimension » — l'outil EST le précédent). Précédent demandé par la mission
   (configs 2.1/2.6) : **INEXISTANT au dépôt** — vérifié machine, `ci/quetes/` ne contient
   ni `2.1.json` ni `2.6.json`. Détail et trace réelle au 02. À VALIDER PAR LE COMITÉ.
2. **Gabarit du miroir** : [7] LÉGER (3-7 items → 80-150 mots) = mission LÉGER —
   **convergence** (zéro divergence à consigner, contrairement à 5.1/5.2).
3. **Libellés UI des 3 niveaux** (propositions neutres) : « la réparation qui tient »
   (élévée) · « la réparation qui se travaille » (à travailler — formulé comme une porte) ·
   « la réparation silencieuse » (silencieuse) — À VALIDER PAR LE COMITÉ.
4. **Statut** : refonte l. 1992 « Libre » — l'accès est libre (pas d'opt-in) au sein du
   territoire M7 💎 PREMIUM (Constitution [6], précédent V11 5.2).
5. **Seuils des niveaux (SIG-5.6-01)** : T_haut = 0.70 · T_bas = 0.40 (moyenne normalisée
   0-1, I recodés 6−r) — PROVISOIRES, À VALIDER PAR LE COMITÉ (re-signature FM-019).
6. **Rappels conditionnels (règle d'ancrage étendue)** : les profils par niveau ne
   garantissent aucun énoncé haut — chaque citation est conditionnée à la réponse brute
   de l'énoncé cité (D répondu 4-5 = citation pleine ; I répondu 4-5 = citation pleine de
   l'énoncé I ; répondu 1-2 = négation confirmée). Étend la règle V11 (« énoncés D
   uniquement ») sans la contredire : une citation certifiée par la réponse brute n'est
   jamais fausse. Proposition, À VALIDER PAR LE COMITÉ.

## 🚫 INTERDITS SPÉCIFIQUES (liste fermée, vérifiable machine)

- Le nom d'auteur de la recherche conjugale (Gottman) : **jamais au rendu** (05, 07,
  cartes, écrans) — présent uniquement dans le présent fichier.
- « toujours » / « jamais » au rendu · tout diagnostic ou suffixe clinique · tout verdict
  sur le niveau (« tu ne sais pas réparer » INTERDIT — le niveau se travaille) · toute
  prédiction de vie amoureuse · tout teaser ou présupposition des mondes gratuits · toute
  métadonnée visible (scores, codes, identifiants de signaux, seuils) · la formulation
  « l'enfer silencieux » (matière moteur SIG-5.6-02 — jamais au rendu).

## 🔒 VERROUS

- Ombre ≥ lumière sur les 3 profils du miroir et les 3 cartes.
- **Gabarit OUVERT** : aucune brique ne scelle le niveau — « à travailler » = une porte ;
  REN compatible (écran sans promesse, miroir qui ouvre).
- Modulateur SIG-5.6-02 : [MOTEUR SEUL] — marque obligatoire partout où il est documenté.
- Rappels conditionnels certifiés (arbitrage 6) — zéro citation fausse.
- Aucune trame : zéro contenu signal ▲ dans tout le dossier.

## 📖 Lecture des fichiers (ordre conseillé)

1. `01-tableau-des-items.md` — les 5 énoncés (D/I, 5 capacités) + usage moteur + décisions.
2. `02-plan-de-melange-graine-256427.md` — graine dérivée, faisabilité c1-c6, dérogation c1, trace réelle.
3. `03-signatures-registre.md` — SIG-5.6-01/02 + liaison de domaine 5.2×5.6.
4. `04-slots-de-miroir.md` — le miroir LÉGER (3 profils) et ses 9 verrous.
5. `05-ecran-d-intro.md` — l'écran d'entrée (ton premium, sans promesse).
6. `06-fiche-computation-EXEMPLE.yaml` — l'item Q5.6-01 aux 5 canaux.
7. `07-miroir.md` — 3 profils respectés (gabarit LÉGER 80-150 mots).
8. `cartes.yaml` — 3 variantes de carte (étage 1, charte C1-C11).

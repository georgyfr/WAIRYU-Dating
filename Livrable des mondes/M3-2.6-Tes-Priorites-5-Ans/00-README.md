# QUÊTE 2.6 « TES PRIORITÉS POUR LES 5 PROCHAINES ANNÉES » — FICHE DE CADRAGE PUIS LECTURE DU LIVRABLE

> Monde M3 · 🆓 gratuit · Socle · MVP · **JEU D'ARBITRAGE — 100 points sur 5 curseurs** (NON-Likert)
> Codes gelés Q2.6-01 → Q2.6-05 (un par axe) · Contrainte : la somme est verrouillée à 100
> Source : Constitution v2.1 [5] (« 2.6 Tes priorités 5 ans (5) ») · Contrat d'Inventaire (« Jeu 100 points — L'arbitrage de ta décennie — Distance pondérée projets ») · FM-011 v2

## 🧭 FICHE DE CADRAGE (lire avant tout le reste)

| Champ | Cadrage |
|---|---|
| **Ce que ça mesure** | **L'arbitrage de la décennie** : comment la personne répartit son énergie entre 5 horizons — carrière/ambition · famille/projet parental · liberté/aventures · stabilité/sécurité · projets communs à deux. PAS du Likert : un **jeu d'arbitrage sous contrainte** — 100 points à répartir, la somme est verrouillée. C'est la rareté qui parle : donner à un horizon, c'est le retirer à un autre. |
| **Mécanique (exacte)** | 5 curseurs (0 → 100, pas de 1) · **somme verrouillée à 100** (le bouton de validation reste inactif tant que Σ ≠ 100) · **aucune valeur par défaut** : le profil vierge oblige à choisir — personne ne part avec un équilibrage suggéré qui ne serait pas le sien. Un seul écran (les 5 axes ensemble) : le mélange est **SANS OBJET** — pas d'items séquentiels (documenté au fichier 02). |
| **Scoring (lecture du contrat)** | **Distance pondérée entre profils** : l'écart sur chaque axe est pondéré par l'importance déclarée. Proposition de production : `D(A,B) = Σ_x ((a_x + b_x)/200) · \|a_x − b_x\|` ∈ [0,100] — un écart sur un axe négligé des deux pèse peu, un écart sur un axe prioritaire pèse lourd. **Formule exacte : À VALIDER PAR LE COMITÉ [9]** — le contrat fixe le principe (« distance pondérée projets »), la production propose l'opération. |
| **Signatures attendues** | **SIG-2.6-01 « L'écart qui parle »** : écart brut > 40 points sur UN axe → signal conversationnel « à aborder tôt » (jamais un dealbreaker, jamais un score, jamais une élimination). Seuil 40 : verrou [9] — provisoire concepteur. |
| **Slots prévus** | Miroir **LÉGER** (5 axes → gabarit 80-150 mots, Constitution [7]) · 4 profils types (carrière-dominant / famille-dominant / équilibré / liberté-dominant) — partition exclusive + exhaustive documentée (le « équilibré » accueille les répartitions sans course ET les dominances d'ancrage : stabilité, projets communs — lecture À VALIDER PAR LE COMITÉ). |
| **Points de doctrine** | ① Aucun horizon n'est « mûr » ou « égoïste » : 100 points sur la famille vaut 100 points sur la carrière — la contrainte fabrique l'information, elle ne note pas les choix. ② « Pas comme tu voudrais paraître » : l'intro verbatim cadre l'honnêteté (l'arbitrage subi est moins social que l'auto-description — c'est la force anti-désirabilité du format). ③ Les dominances d'ancrage (stabilité/communs) ne sont jamais traitées comme des « non-choix ». ④ Gratuit ne présuppose jamais premium ([6]). ⑤ Aucune trame ▲ (vérifié — quête déclarative directe). |

## 📖 Lecture des fichiers (ordre conseillé)

1. `01-tableau-des-axes.md` — les 5 axes (codes gelés, descriptions exactes, fiches condensées).
2. `02-ordre-canonique.md` — l'écran unique (sans mélange, ordre d'affichage canonique documenté).
3. `03-signatures-registre.md` — SIG-2.6-01 + variables + verrou du seuil.
4. `04-slots-de-miroir.md` — le miroir LÉGER et ses verrous.
5. `05-ecran-d-intro.md` — l'écran d'entrée (verbatim mission).
6. `06-fiche-computation-EXEMPLE.yaml` — l'axe Q2.6-01 aux 5 canaux.
7. `07-miroir.md` — 4 profils types (dont la friction documentée n°1).
8. `cartes.yaml` — 4 variantes de carte (étage 1, charte C1-C11).

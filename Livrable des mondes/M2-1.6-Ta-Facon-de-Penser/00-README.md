# 00 — FICHE DE CADRAGE DE PRODUCTION

> À lire avant tout fichier du dossier. Restitution d'ouverture [10] + cadrage technique de la quête.
> Source de vérité : `ddocumentation/refonte des tests et outils wairyu.md` (source gelé) — PARTIE 6, l. 2467-2496 (quête) · PARTIE 6, l. 3194-3298 (cartes) · registre des signatures Monde 1 (l. 5495-5777).

## Restitution [10] (5 lignes)

- **Élément** : quête 1.6 « Ta façon de penser » — 7 items déclaratifs Likert + 3 énigmes de performance (60-90 s, réponse libre ou choix multiple), doublon longitudinal Q1.6-05.r.
- **Monde** : M2 — Le Volant (codes Q1.6 — monde = métadonnée, FM-011 v2) · Domaine du Soi (M1+M2).
- **Statut freemium** : 🆓 gratuit — zéro teaser premium.
- **Contraintes principales** : énigmes reproduites ENTIÈRES verbatim (énoncés, réponses intuitive/correcte, statut juridique) · énigmes HORS contrat de mélange (ordre source É1→É2→É3) · temps de réponse capté mais jamais rendu · pénalité d'écart de pôle = matching only, jamais au miroir · tout seuil ADOPTÉ comme valeur de départ (FM-019) — provisoire concepteur — re-signature professionnelle avant bêta.
- **Ambiguïtés détectées** : ① la synthèse « déclaratif × performance » (POL) est le scoring propre de la quête — son croisement EST intra-quête, donc admissible au miroir, mais la pénalité d'écart de pôle entre deux matchs reste une modulation de matching (PASSE 5), jamais un contenu de miroir ; ② les énigmes n'ayant pas de contrat de mélange, leur ordre de passation suit l'ordre source — FM future à ouvrir ; ③ le rendu des énigmes au miroir décrit la MANIÈRE (vérifier vs répondre vite), jamais un décompte scolaire.

## Cadrage fiche

| Élément | Valeur |
|---|---|
| Dimensions (items déclaratifs) | `traitement` (7/7 — mono-dimension) |
| Format | Likert 5, codage 1-5 (Arbitrage 2) · D = direct · I = inversé recodé `6 − réponse` (Arbitrage 1) |
| Orientation par item | D : 01, 03, 05 · I : 02, 04, 06, 07 |
| Énigmes | Q1.6-É1 (colline) · Q1.6-É2 (bougies) · Q1.6-É3 (bateau/échelons) — 60-90 s chacune, réponse libre ou choix multiple (verbatim) |
| Trames ▲ | **aucune** — É1/É2 « Composée Wairyu » ; É3 « folklore séculaire » (note juridique verbatim) |
| Doublon | `Q1.6-05.r` — « Mon ressenti initial me sert de boussole, et rarement me trompe. » (trame fiabilité — doublon longitudinal) |
| Variables moteur | **POL** — pôle de traitement analytique (Q1.6 + énigmes, synthèse) — dictionnaire §0.2 du registre |
| Signatures | SIG_ECART_POLE (n° 26, transversale, matching) · SIG_STANDARD_PROJETE (n° 13) et SIG_CALME_VERROU (n° 14) consomment POL (Portraits) — verbatim au fichier `03` |
| Scoring (verbatim) | pôle analytique = items ↩ + énigmes résolues ; temps de réponse capté ; synthèse déclaratif × performance → dimension de compatibilité de communication (pénalité si écart de pôle > 0.7 entre deux matchs) ⚠ |
| Carte | 5 variantes, sélecteur D×E — charte PARTIE 6 |
| Miroir | **LÉGER** (mission V7.2 — tranchage explicite) : 80-150 mots/variante — la densité de blocs (10) eût suggéré MOYEN ; les 3 énigmes sont de la performance (la manière, jamais notée), seuls les 7 items comptent pour le gabarit. Note de tranchage au `04`. |
| Écran spécial | aucun — carte standard + partage |

## Table de fichiers intégrale (mission Phases A/B/C/D, point 2)

| Fichier | Contenu | Qui le lit |
|---|---|---|
| `00-README.md` | cette fiche de cadrage + table de fichiers | tout le monde |
| `README.md` | vue d'ensemble + déclaration de conformité | tout le monde |
| `01-tableau-des-items.md` | les 7 items déclaratifs verbatim + les 3 énigmes ENTIÈRES (verbatim) + le doublon Q1.6-05.r | production + implémenteur |
| `02-plan-de-melange-graine-216427.md` | l'ordre de passation RÉEL (graine 216427) + verdicts c1-c6 + graine dérivée + finding borne de run | production + recette |
| `03-signatures-registre.md` | la variable POL + les signatures qui la consomment (verbatim du registre) | moteur |
| `04-slots-de-miroir.md` | les slots du miroir + les 9 verrous | rendu |
| `05-ecran-d-intro.md` | le texte d'ouverture verbatim | rendu |
| `06-fiche-computation-EXEMPLE.yaml` | le format complet d'une fiche item, exemplifié | moteur |
| `cartes.yaml` | les 5 variantes de carte (sélecteur D×E) | rendu |
| `07-miroir.md` | le miroir LÉGER — 3 briques-variantes (pôles : flair d'abord / les deux pieds / vérification d'abord — gabarits distincts par pôle, mission V7.2) | rendu |

## Interdits rappelés à la production

- Aucun seuil de signature de sécurité au dépôt (FM-018 / [11-b]) — la quête n'en contient de toute façon aucun.
- Constitution [3] : aucun code/score/sigle rendu ; tutoiement ; phrases ≤ 22 mots dans les textes rendus ; le temps de réponse n'est jamais affiché.
- Constitution [2] : lumière/ombre en égalité ; conditionnel fréquentiel ; coût pour soi ET pour l'autre ; aucune humiliation possible sur les énigmes (la manière décrite, jamais la performance notée).
- Verrou [9] : produire, ne pas décider — tout seuil = PROPOSITION marquée.

## Conformité a11y

Conformité a11y : WCAG 2.1 AA visée (contrastes ≥ 4,5:1, cibles tactiles ≥ 44×44 px, support lecteur d'écran, respect du mode réduit-animations). Implémentation : voir spec quête 1.1 §10 et styles.css.

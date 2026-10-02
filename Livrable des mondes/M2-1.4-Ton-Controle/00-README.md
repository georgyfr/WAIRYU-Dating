# 00 — FICHE DE CADRAGE DE PRODUCTION

> À lire avant tout fichier du dossier. Restitution d'ouverture [10] + cadrage technique de la quête.
> Source de vérité : `ddocumentation/refonte des tests et outils wairyu.md` (source gelé) — PARTIE 4, l. 2424-2444 (quête) · PARTIE 4, l. 2985-3087 (cartes) · registre des signatures Monde 1 (l. 5495-5777).

## Restitution [10] (5 lignes)

- **Élément** : quête 1.4 « Ton contrôle sur toi-même » — 8 items carte Likert, mono-dimension `autocontrole`, doublon longitudinal Q1.4-01.r, aucune trame.
- **Monde** : M2 — Le Volant (codes Q1.4 — le monde est une métadonnée, FM-011 v2) · Domaine du Soi (M1+M2).
- **Statut freemium** : 🆓 gratuit — zéro teaser premium (l'écran de conversion n'existe qu'à la complétion de M5).
- **Contraintes principales** : fidélité VERBATIM au source · mono-dimension (pas de contrainte c1/c4 de mélange) · AUCUNE trame · SIG_DGR_PRECURSEUR jamais avec ses seuils · tout seuil ADOPTÉ comme valeur de départ (FM-019) — provisoire concepteur — re-signature professionnelle avant bêta · miroir MOYEN 150-250 mots.
- **Ambiguïtés détectées** : ① la numérotation 1.x traverse M1/M2 — dossier nommé `M2-1.4` conformément à la mission ; ② le doublon Q1.4-01.r (classe « trame fiabilité ») : énoncé reproduit sur instruction de mission — frontière [11-b] à arbitrer par le comité ; ③ usage moteur « croisé avec la tâche 1.5 » : croisement inter-quêtes → ÉTAGE 3 (Portrait de Monde), jamais dans le miroir de la quête seule.

## Cadrage fiche

| Élément | Valeur |
|---|---|
| Dimensions | `autocontrole` (8/8 — mono-dimension) |
| Format | Likert 5, codage 1-5 (Arbitrage 2) · D = direct · I = inversé recodé `6 − réponse` (Arbitrage 1) |
| Orientation par item | D : 01, 03, 05, 07 · I : 02, 04, 06, 08 |
| Trames ▲ | **aucune** — la quête n'a ni item de trame sécurité, ni item déguisé |
| Doublon | `Q1.4-01.r` — « Mes décisions de limites tiennent dans le temps. » (trame fiabilité — doublon longitudinal) |
| Variables moteur fournies | AC_D (auto-contrôle déclaré, Q1.4) · AC_B (comportemental, 1.5) · EC = \|AC_D − AC_B\| — dictionnaire du registre, §0.2 |
| Signatures | aucune signature propre à la quête ; SIG_COH_HAUTE / SIG_COH_DIV / règle de silence consomment EC (Portraits) ; SIG_DGR_PRECURSEUR (n° 32, sécurité) — pré-signal DGR niveau 1, **seuils hors dépôt** |
| Usage moteur | modulateur transversal (Couche 3) — verbatim au fichier `01` |
| Carte | 5 variantes, sélecteur sur score de quête — charte PARTIE 4 |
| Miroir | **MOYEN** : 8 items → 150-250 mots (Constitution [7], gabarit par densité) |
| Écran spécial | aucun — carte standard + partage (contrairement à 1.7) |

## Table de fichiers intégrale (mission Phases A/B/C/D, point 2)

| Fichier | Contenu | Qui le lit |
|---|---|---|
| `00-README.md` | cette fiche de cadrage + table de fichiers | tout le monde |
| `README.md` | vue d'ensemble + déclaration de conformité | tout le monde |
| `01-tableau-des-items.md` | les 8 items verbatim + le doublon longitudinal Q1.4-01.r + fiches de computation condensées | production + implémenteur |
| `02-plan-de-melange-graine-214427.md` | l'ordre de passation RÉEL (graine 214427) + verdicts c1-c6 + graine dérivée + finding borne de run | production + recette |
| `03-signatures-registre.md` | les variables fournies (AC_D) + les signatures qui les consomment (verbatim du registre) | moteur |
| `04-slots-de-miroir.md` | les slots du miroir + les 9 verrous | rendu |
| `05-ecran-d-intro.md` | le texte d'ouverture verbatim | rendu |
| `06-fiche-computation-EXEMPLE.yaml` | le format complet d'une fiche item, exemplifié | moteur |
| `cartes.yaml` | les 5 variantes de carte (sélecteur sur score de quête) | rendu |
| `07-miroir.md` | le miroir MOYEN — 6 briques-variantes (3 profils × 2 textures A/B, mission V7.1 : LUMIÈRE → OMBRE en couple → TENSION, renvoi court 1.5) | rendu |

## Interdits rappelés à la production

- Aucun seuil de signature de sécurité au dépôt (FM-018 / [11-b]) — placeholders « document trames, hors dépôt, canal privé ».
- Constitution [3] : aucun code/score/sigle rendu à l'utilisateur ; tutoiement ; phrases ≤ 22 mots dans les textes rendus.
- Constitution [2] : lumière/ombre en égalité ; conditionnel fréquentiel ; coût pour soi ET pour l'autre.
- Verrou [9] : produire, ne pas décider — toute valeur psychométrique = PROPOSITION marquée.

## Conformité a11y

Conformité a11y : WCAG 2.1 AA visée (contrastes ≥ 4,5:1, cibles tactiles ≥ 44×44 px, support lecteur d'écran, respect du mode réduit-animations). Implémentation : voir spec quête 1.1 §10 et styles.css.

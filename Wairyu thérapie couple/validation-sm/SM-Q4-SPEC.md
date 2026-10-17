# SPEC VERROUILLÉE — WTC-SM-Q4 « Nos deux rives » (RIO-14)

> **Document de spécification VERROUILLÉ — verrouillage délégué au pont par le fondateur, 18/10/2026 (« pour A1-A5 tu as libre choix de ce que tu juges nécessaire »).**
> D-CANAL : production locale après verrouillage. Zéro code tant que non verrouillé.
> D-HIST : confrontation fondation effectuée (voir §7).
> **Arbitrages (pont, par délégation) : A1 agrégats + bornes 2,50/3,50 · A2 option a (zéro item nouveau) · A3 percentiles seed 42 · A4 override 🔴 · A5 noms mot pour mot.**

---

## 1. Type de quête et rôle

**Q4 = CROISEMENT (à deux, confirmé)** — `programme wairyu couple.txt` ligne 224 : « Q4 Le croisement (à deux, confirmé) » ; lignes 297-298 : « Q4 (croisement à 9 configurations, percentiles) ».

**RIO-14 cible.** Le croisement de la dimension Santé mentale : **« qui porte quoi, répartition de la charge »** (mapping SPEC Q2 §9). Il croise les DEUX rives déjà mesurées et contresignées :

- **Rive détresse** (Q1-R3, RIO-11) : le partenaire en détresse — faces D
- **Rive charge** (Q2, RIO-12) : l'aidant — faces A (A1 épuisement · A2 surimplication · A3 hostilité)

**Particularité structurelle** : contrairement au croisement émotionnel (p1×p2 symétrique, RIO-09), le croisement SM est **asymétrique par nature** — ligne 133 : « Ma rive / ta rive asymétriques ». La configuration dépend de (détresse, charge) dans CET ordre ; il n'y a pas de symétrie p1×p2 à vérifier, mais une **asymétrie à préserver** (anti-inversion : le niveau détresse ne peut venir que de Q1, le niveau charge que de Q2).

---

## 2. Architecture : 9 configurations (3 × 3), zéro nouvel instrument

**Option a (A2 : RETENUE)** : Q4 ne crée AUCUN item nouveau — il croise les sorties Q1 × Q2 (comme l'empreinte situationnelle L5, ligne 261 : « Empreinte situationnelle (croisement Q1×Q2) »). Les données sont celles de packages contresignés ; un croisement qui inventerait ses propres items re-mesurerait ce qui est déjà mesuré.

**Les 2 agrégats d'entrée (A1 : RETENUS)** :
- **Niveau détresse** = moyenne des 3 faces D de Q1 (SM-D1/D2/D3)
- **Niveau charge** = moyenne des 3 faces A de Q2 (SM-A1/A2/A3)
- Bornes de niveau : **Faible < 2,50 ≤ Moyen < 3,50 ≤ Élevé** (cohérence dominance Q2/Q3)

**Les 9 configurations (noms RETENUS mot pour mot — A5 · D-NOMENCLATURE, unicité garantie)** :

| # | Nom proposé | Détresse | Charge | Lecture clinique |
|---|-------------|----------|--------|------------------|
| 1 | CALME DES DEUX RIVES | Faible | Faible | rien à fabriquer (§5.5) |
| 2 | VEILLE | Faible | Moyen | l'aidant s'active, détresse contenue |
| 3 | PORTE SEULE | Faible | Élevé | charge élevée sans détresse déclarée — vérifier le masquage |
| 4 | COURANT FORT | Moyen | Faible | détresse réelle, aide pas encore structurée |
| 5 | DEUX COURANTS | Moyen | Moyen | la zone de travail ordinaire |
| 6 | RIVE QUI CÈDE | Moyen | Élevé | l'aidant bascule avant l'autre |
| 7 | TEMPÊTE | Élevé | Faible | détresse élevée, aidant absent ou épuisé silencieusement |
| 8 | TEMPÊTE ET DIGUE | Élevé | Moyen | le duo tient, sous tension |
| 9 | DÉBORDEMENT | Élevé | Élevé | les deux rives cèdent — vigilance maximale |

**Percentiles (ligne 262 — A3 : RETENUS)** : correction du style de réponse — chaque score est converti en rang dans une **population de référence simulée (seed 42, reproductible)** avant le classement en niveau ; **boucle probable si écart de percentiles ≥ 30** (affiché comme avertissement, jamais comme verdict) ; avertissement si styles dissemblables.

---

## 3. Mécanismes de tension (le « à deux »)

- **Le cycle de Coyne, à deux rives** : Q1 mesurait la boucle côté détresse, Q2 côté aidant ; Q4 montre LA BOUCLE ENTIÈRE — qui porte quoi, et où la boucle risque de se refermer (configs 3, 6, 9).
- **L'EE en croisement** : une charge élevée (A3 hostilité incluse) sur une détresse faible (config 3, PORTE SEULE) est le profil où le masquage de la détresse est le plus probable — affichage d'un appel à vérifier, jamais d'un verdict (« vérifier le masquage » — anti-fabrication §5.5).
- **L'asymétrie assumée** (ligne 133) : le croisement n'inverse JAMAIS les rives — la détresse se lit sur Q1, la charge sur Q2, sans exception.

---

## 4. D-CRISE hérité (VERROUILLÉ — A4 : override, pattern Q3-A3)

Q4 ne crée AUCUNE voie de crise. Si l'un des deux profils porte un **flag crise hérité** (A2 ∨ SM-C1 ∨ H5, verrouillage Q2-C3), l'affichage Q4 est **routé en override** vers l'orientation « chemin le plus court » (palier 🔴) — la configuration est calculée et tracée, mais pas déployée comme verdict de couple sur une crise active. Cohérence directe avec l'arbitrage A3 déjà prononcé en Q3.

---

## 5. Les 7 critères Q4 (libellés EXACTS proposés)

| # | Critère | Exigence | Type |
|---|---------|----------|------|
| **C1** | D-VÉRITÉ : 9/9 configurations démontrées par le moteur, labels uniques, croisé moteur/table de vérité | 9/9 + croisé 100 % | ÉLIMINATOIRE |
| **C2** | D-CONFIRMATION : config = f(détresse Q1, charge Q2) PURE et déterministe — même paire d'entrées → même config, jamais d'inversion des rives | 100 % déterministe + 0 inversion | ÉLIMINATOIRE |
| **C3** | D-STD-2 : seuil de conformité PAR configuration (9 bornes distinctes, calibrées comme émo-Q4) | 9/9 configs à leur seuil | ÉLIMINATOIRE |
| **C4** | SHA ×2 (D-EMPREINTE : SHA sur contenu, pas horodatage) | 2 valeurs brutes identiques | — |
| **C5** | Affichage : templates ×9 + boucle probable (écart ≥ 30) + avertissement styles dissemblables + bandeau D-SIM | 4/4 | — |
| **C6** | 0 pas produit (Q4 = CROISEMENT, prescription transférée à Q5) | 0 fonction de prescription | — |
| **C7** | Anti-fabrication : 0 verdict sur crise héritée (override A4) + config 1 affichée comme zone calme (rien à fabriquer) | 0 fabrication + override testé | ÉLIMINATOIRE |

**Leçons appliquées** : émo-Q4 R1 (C1 8/9 sur CROISÉE) → centres de simulation ≥ 0,5 pt des bornes de niveau (leçon grain Q2) · D-NOMENCLATURE → 9 noms uniques · pattern Q3-A3 → override · D-CONFIRMATION nouvelle (anti-inversion propre au croisement asymétrique).

---

## 6. Simulation (univers proposé)

- **450 couples** (9 configurations × 50, comme émo-Q4) + pièges : **CRISE_HÉRITÉE** (override, ~50) · **ÉCART_PERCENTILES** (boucle probable, avertissement sans changement de verdict) · **STYLES_DISSEMBLABLES** (avertissement) · **FRONTIÈRES** (scores pile sur les bornes 2,50/3,50 — niveau tranché de façon déterministe).
- Géométrie : détresse μ ∈ {2,0 · 3,0 · 4,5}, charge μ ∈ {2,0 · 3,0 · 4,5} — chaque centre à ≥ 0,5 pt des bornes (leçon grain) ; population de référence percentiles : 2 000 profils seed 42.
- classification_vraie ancrée sur les paramètres vrais (D-GÉOMÉTRIE).

---

## 7. D-HIST : confrontation fondation

- **Patron croisement** : émo-Q4 (RIO-09) — 9 configurations, D-STD-2 par config, C3 anti-verdict éliminatoire, symétrie p1×p2. SM-Q4 diffère sur un point structurel : **pas de symétrie** (croisement asymétrique détresse×charge) → C2 devient D-CONFIRMATION (pureté + anti-inversion).
- **Entrées héritées** : Q1-R3 (RIO-11, contresigné) et Q2 (RIO-12, contresigné) — Q4 ne lit QUE leurs sorties verrouillées.
- **RIO-13** (Q3) : contresigné (pont, 18/10/2026 — 13/13 RIO) — Q4 n'en dépend pas (entrées = Q1 × Q2 uniquement).

---

## 8. Mapping RIO

| Quête | RIO | Rôle |
|-------|-----|------|
| Q1 « Ma détresse et la leur » | RIO-11 | Mesure la détresse (faces D) + D-CRISE (SM-C1) — ✅ contresigné |
| Q2 « Ce que je porte pour toi » | RIO-12 | Mesure l'aidant (faces A+B) + D-CRISE (A2) — ✅ contresigné |
| Q3 « Ce que notre lien sait porter » | RIO-13 | Forces dérivées (banque F-S1 à F-S6) — ✅ contresigné |
| **Q4 « Nos deux rives »** | **RIO-14** | **Croisement asymétrique : 9 configurations, qui porte quoi** |
| Q5 « Mon premier pas vers l'autre rive » | RIO-15 | Pas + suivi 14j + anti-perfectionnisme + re-test 8 sem |

---

## 9. Verrouillage (délégation fondateur → pont, 18/10/2026)

**Délégation prononcée en chat** : « la marque contresignée, pour A1-A5 tu as libre choix de ce que tu juges nécessaire » — prononcée au moment de la contresignature RIO-13. Les 5 arbitrages sont tranchés par le pont, chacun ancré sur une règle permanente du hub ; aucun ne crée de règle nouvelle.

- **A1 — Agrégats et bornes : RETENUS tel que proposé.** Niveau détresse = moyenne des 3 faces D de Q1 (SM-D1/D2/D3) ; niveau charge = moyenne des 3 faces A de Q2 (SM-A1/A2/A3) ; bornes **Faible < 2,50 ≤ Moyen < 3,50 ≤ Élevé**. Justification : les entrées sont des sorties de packages contresignés (traçabilité directe, D-EMPREINTE) ; le seuil 3,50 est le seuil de cohérence déjà prononcé en Q2 (faces) et Q3 (A1) ; la variante « niveaux par percentiles » créerait une double indirection — les percentiles sont déjà affectés au diagnostic de boucle (A3), une mesure garde un seul rôle.
- **A2 — Option a : RETENUE (zéro item nouveau).** Q4 ne croise QUE les sorties Q1 × Q2. Justification : anti-fabrication (§5.5 du programme) — un croisement qui inventerait ses propres items re-mesurerait ce qui est déjà mesuré et contresigné ; une mini-grille de confirmation exigerait son propre cycle RIO complet (instrument, banque, validation) pour un gain d'information marginal, et romprait l'économie du programme (ligne 261 : l'empreinte situationnelle EST le croisement Q1×Q2).
- **A3 — Percentiles : RETENUS tel que proposé.** Population de référence simulée seed 42 (2 000 profils) pour les rangs ; boucle probable si écart de percentiles ≥ 30 (avertissement, jamais verdict) ; avertissement si styles dissemblables. Justification : la ligne 262 du programme exige les percentiles — la variante « scores bruts » contredirait la source ; seed 42 garantit la reproductibilité (D-EMPREINTE) ; l'écart de rangs mesure la dissemblance des styles de réponse, pas un échec de mesure.
- **A4 — Override crise héritée : RETENU tel que proposé (pattern Q3-A3).** Flag crise hérité (A2 ∨ SM-C1 ∨ H5) → affichage routé 🔴, configuration tracée mais non déployée comme verdict de couple. Justification : D-CRISE est transversale (« jamais de pas de couple en crise ; pas de lumière fabriquée sur un incendie ») ; la variante « bandeau sur le verdict » déploierait malgré tout un verdict sur crise active — rejetée ; cohérence directe avec l'arbitrage A3 prononcé par le fondateur en Q3.
- **A5 — Noms des 9 configurations : RETENUS mot pour mot.** CALME DES DEUX RIVES · VEILLE · PORTE SEULE · COURANT FORT · DEUX COURANTS · RIVE QUI CÈDE · TEMPÊTE · TEMPÊTE ET DIGUE · DÉBORDEMENT. Justification : D-NOMENCLATURE (9 noms uniques, injection nom → cellule (détresse, charge) sans ambiguïté) ; la métaphore des rives est fidèle au programme (ligne 133) ; chaque nom porte sa lecture clinique sans jargon.

**FIXÉ** : 9 configurations 3×3 · croisement asymétrique (anti-inversion des rives) · agrégats faces D / faces A avec bornes 2,50/3,50 (A1) · zéro item nouveau (A2) · percentiles seed 42 + boucle ≥ 30 + avertissement styles dissemblables (A3) · override crise héritée 🔴 (A4) · 9 noms mot pour mot (A5) · D-STD-2 par configuration · 4 pièges (§6) · C1-C7 libellés exacts · 0 pas produit.

**LIBRE** : corps des fonctions · noms internes des groupes · taille exacte de la population norm (≥ 2 000) · découpage en 3 fichiers.

**Prochaine étape** : production du package `validation-sm-q4/` (séquence D-CANAL-2 : production → run ×2 → SHA ×2 → publication → pointeurs → audit origin → contresignature).

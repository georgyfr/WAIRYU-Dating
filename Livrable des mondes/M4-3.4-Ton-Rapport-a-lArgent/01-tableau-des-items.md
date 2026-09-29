# LIVRABLE 1 — LES 8 ITEMS DE LA QUÊTE 3.4 « TON RAPPORT À L'ARGENT » (6 carte + 2▲)

> Légende de la fiche de computation condensée — `C:` carte · `S:` signal · `F:` fiabilité · `M:` modulation · `A:` ancrage.
> Échelle : Likert 5 niveaux (Arbitrage 2) · Orientation : D = direct, I = inversé recodé `6 − réponse` (Arbitrage 1).
> **Neutralité des profils** : dépenser et économiser = deux façons égales d'habiter un budget —
> le spontané et le calculé = deux tempos, ni l'un ni l'autre vertu ou défaut.
> **2 axes (dépense 3 + calcul 3) + 2▲ DGR** · B.3 — production neuve déclarée (axes et impulsivité
> financière cadrés au refonte, aucun texte d'item ; T07 = verbatim d'exemple de la mission, hors dépôt).

## Axe 1 — DÉPENSE (dépensier ↔ économe)

| Code (gelé) | Énoncé | Or. | Angle | Facette | ▲ (signal_id) | Fiche de computation — 5 canaux |
|---|---|---|---|---|---|---|
| Q3.4-01 | Quand un coup de cœur me plaît, je craque vite. | **D** | le coup de cœur | l'attrait immédiat | — | C: DEP_D→score de quête · S: SIG-3.4-01 (le profil) · F: paire R6 avec 02 · M: SIG-3.4-02 (friction conversationnelle) · A: rappel OK |
| Q3.4-02 | Devant un coup de cœur, je laisse passer la nuit. | **I** | le coup de cœur | l'attente choisie | — | C: DEP_D (recodé 6−r) · S: idem 01 · F: paire R6 avec 01 · M: idem 01 · A: rappel OK |
| Q3.4-03 | Un euro non dépensé est un euro qui dort tranquille. | **I** | l'épargne | le repos de l'argent | — | C: DEP_D (recodé) · S: idem 01 · F: pivot mono (voir ci-dessous) · M: idem 01 · A: rappel OK |

## Axe 2 — CALCUL (spontané ↔ calculé)

| Code (gelé) | Énoncé | Or. | Angle | Facette | ▲ (signal_id) | Fiche de computation — 5 canaux |
|---|---|---|---|---|---|---|
| Q3.4-04 | Mes achats se comparent, se chiffrent, se décident à froid. | **D** | la comparaison | la décision à froid | — | C: CALC_D→score de quête · S: idem 01 · F: paire R6 avec 05 · M: idem 01 · A: rappel OK |
| Q3.4-05 | Mes achats se décident sur place, sans feuille de route. | **I** | la comparaison | l'élan sur place | — | C: CALC_D (recodé) · S: idem 01 · F: paire R6 avec 04 · M: idem 01 · A: rappel OK |
| Q3.4-06 | Je connais l'état de mes comptes au jour le jour. | **D** | la visibilité des comptes | le pouce sur le fil | — | C: CALC_D→score · S: idem 01 · F: pivot mono (voir ci-dessous) · M: idem 01 · A: rappel OK |

## Les 2 TRAMES DGR — LIGNES-RÉSERVÉES (FM-018 / Constitution [11-b])

> ⚠ **Aucun énoncé de trame dans ce dépôt.** Contenu vivant : document trames (hors dépôt,
> Partie 7), fourni à l'implémenteur uniquement au moment de l'intégration. Codes gelés à jamais.
> Impulsivité financière déguisée en habitudes — formulations FRANCHES, indiscernables, jamais
> édulcorées. Q3.4-T07 porte le verbatim d'exemple de la mission (consigné hors dépôt avec le
> même statut que les autres formulations).

**Q3.4-T07 — ITEM SÉCURITÉ : contenu fourni séparément au moment de l'implémentation
(document trames, hors dépôt — Partie 7). Angle : le paiement différé « plus tard ».
Alimente le signal DGR. Positions au mélange : 4.**

**Q3.4-T08 — ITEM SÉCURITÉ : contenu fourni séparément au moment de l'implémentation
(document trames, hors dépôt — Partie 7). Angle : l'étalage des paiements en plusieurs fois.
Alimente le signal DGR. Positions au mélange : 8.**

Propriétés communes (côté moteur, côté contrat) : dimension carte `null` · orientations **D** ·
rappel d'ancrage **INTERDIT** · aucun slot, aucune citation, aucune restitution · le score
alimente **DGR** (dangerosité réactive — impulsivité × instabilité) en **croisement moteur avec
1.4 (auto-contrôle) et 1.5 (épreuve du temps)** — jamais au rendu, jamais au match, jamais au
premium (SIG-3.4-03).

## Usage moteur (lecture du cadrage — refonte)

> Deux scores d'axe : **DEP_D** (dépense — moyenne des 3 items, I recodés, normalisée — haut =
> dépensier) et **CALC_D** (calcul — moyenne des 3 items, normalisée — haut = calculé). Ils
> alimentent **SIG-3.4-01** (le profil — 4 quadrants + central) et **SIG-3.4-02** (la friction
> financière — écart fort entre profils → « à aborder tôt », jamais une pénalité). Le score des
> 2▲ alimente **DGR** côté moteur (croisements 1.4 × 1.5) — jamais le rendu.
> Au rendu : le coup de cœur, la nuit qui passe, les comptes qui se lisent — jamais
> « impulsivité financière », jamais « dangerosité », jamais de vocabulaire clinique.

## Décisions de composition documentées (domaine réservé [9] — propositions)

1. **Q3.4-02 « laisser passer la nuit »** : l'attente décrite comme un réflexe de recul choisi —
   pas une privation ; l'économe n'est pas un privée, il laisse venir.
2. **Q3.4-03 « dort tranquille »** : l'épargne décrite comme un repos (l'argent en paix), jamais
   comme une amassement vertueux — le dépensier a sa propre lecture de l'argent qui circule.
3. **Q3.4-04 « à froid »** : le calcul décrit comme un tempo (la décision refroidie), jamais
   comme une froideur de caractère — le calculé aime comprendre avant de ressentir, c'est un
   mode, pas une carapace.
4. **Q3.4-06 pivot** : la visibilité des comptes est un marqueur distinct de la comparaison
   (on peut comparer sans suivre, suivre sans comparer) — pivot assumé, R6 partiel documenté.
5. **Les 2▲ à orientation D unique** : même logique que 3.3 — le déguisement en habitudes exige
   une franchité constante (document trames Partie 0 ; précédents 2.1 et 3.3).
6. **Zéro montant chiffré** : aucun énoncé ne porte de somme — le rapport à l'argent se déclare
   en réflexes, pas en montants (les budgets varient trop selon les vies).

## Correspondance des angles (mission V9.D)

| Angle mission V9.D | Items porteurs | Lecture |
|---|---|---|
| dépensier/économe | Q3.4-01 × 02 · Q3.4-03 (pivot) | le coup de cœur et l'épargne qui dort — l'axe de la dépense |
| spontané/calculé | Q3.4-04 × 05 · Q3.4-06 (pivot) | la comparaison à froid et la visibilité des comptes — l'axe du calcul |
| impulsivité financière déguisée (2▲ DGR) | Q3.4-T07 → T08 | le « plus tard » qui paie le « maintenant » — moteur seul, croisement 1.4 × 1.5 |

## Contrôles mécaniques passés

| Contrôle | Résultat |
|---|---|
| ≤ 12 mots / énoncé carte (max constaté : 11) | ✅ |
| 1re personne, présent de l'indicatif | ✅ |
| Zéro double négation | ✅ |
| Zéro fréquence ambiguë | ✅ |
| Neutralité normative (aucun profil « meilleur ») | ✅ |
| Zéro montant chiffré, zéro vocabulaire clinique au rendu | ✅ 6/6 carte |
| Paires R6 : 2 complètes + 2 pivots documentés | ✅ écart consigné — À VALIDER PAR LE COMITÉ |
| Trames ▲ : 2 — aucun énoncé au dépôt, positions 4·8, ancrage interdit | ✅ |
| Configuration conforme à la config CI (`ci/quetes/3.4.json`) | ✅ |

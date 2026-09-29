# LIVRABLE 1 — LES 12 ITEMS DE LA QUÊTE 3.3 « TON TEMPS LIBRE » (8 carte + 4▲)

> Légende de la fiche de computation condensée — `C:` carte · `S:` signal · `F:` fiabilité · `M:` modulation · `A:` ancrage.
> Échelle : Likert 5 niveaux (Arbitrage 2) · Orientation : D = direct, I = inversé recodé `6 − réponse` (Arbitrage 1).
> **Neutralité du mode** : sortir et rester = deux façons égales de se nourrir — le centrifuge
> n'est pas « instable », le centripète n'est pas « rétréci ».
> **2 volets carte (mode 4 + fond 4) + 4▲ CSR** · B.3 — production neuve déclarée (cadrages
> verbatim au refonte : centrifuge/centripète, homogamie des loisirs, addictions comportementales ;
> aucun texte d'item).

## Volet 1 — LE MODE (centrifuge ↔ centripète)

| Code (gelé) | Énoncé | Or. | Angle | Facette | ▲ (signal_id) | Fiche de computation — 5 canaux |
|---|---|---|---|---|---|---|
| Q3.3-01 | Après une semaine chargée, je ressors pour recharger. | **D** | la recharge | la sortie qui porte | — | C: MODE_D→score de quête · S: SIG-3.3-01 (le mode) · F: paire R6 avec 02 · M: SIG-3.3-02 (croisement conversationnel) · A: rappel OK |
| Q3.3-02 | Après une semaine chargée, je recharge chez moi. | **I** | la recharge | le cocon qui porte | — | C: MODE_D (recodé 6−r) · S: idem 01 · F: paire R6 avec 01 · M: idem 01 · A: rappel OK |
| Q3.3-03 | Un bon week-end, pour moi, se vit dehors. | **D** | le week-end | le dehors choisi | — | C: MODE_D→score · S: idem 01 · F: paire R6 avec 04 · M: idem 01 · A: rappel OK |
| Q3.3-04 | Un bon week-end, pour moi, se passe à la maison. | **I** | le week-end | le dedans choisi | — | C: MODE_D (recodé) · S: idem 01 · F: paire R6 avec 03 · M: idem 01 · A: rappel OK |

## Volet 2 — LE FOND des loisirs (ancrage + partage — homogamie des loisirs)

| Code (gelé) | Énoncé | Or. | Angle | Facette | ▲ (signal_id) | Fiche de computation — 5 canaux |
|---|---|---|---|---|---|---|
| Q3.3-05 | J'ai au moins une activité de fond qui me porte. | **D** | l'activité de fond | l'ancrage | — | C: FOND_D→score de quête · S: SIG-3.3-01 · F: paire R6 avec 06 · M: SIG-3.3-02 · A: rappel OK |
| Q3.3-06 | Mes loisirs changent au gré des envies, sans fond fixe. | **I** | l'activité de fond | le gré des envies | — | C: FOND_D (recodé) · S: idem 05 · F: paire R6 avec 05 · M: idem 05 · A: rappel OK |
| Q3.3-07 | Mes loisirs de fond, je les vis avec d'autres. | **D** | le partage | le ensemble assumé | — | C: FOND_D→score · S: idem 05 · F: paire R6 avec 08 · M: idem 05 · A: rappel OK |
| Q3.3-08 | Mes loisirs de fond, je les vis en solo. | **I** | le partage | le solo assumé | — | C: FOND_D (recodé) · S: idem 05 · F: paire R6 avec 07 · M: idem 05 · A: rappel OK |

## Volet 3 — LES 4 TRAMES CSR — LIGNES-RÉSERVÉES (FM-018 / Constitution [11-b])

> ⚠ **Aucun énoncé de trame dans ce dépôt.** Contenu vivant : document trames (hors dépôt,
> Partie 7), fourni à l'implémenteur uniquement au moment de l'intégration. Codes gelés à jamais.
> Formulations FRANCHES, indiscernables, jamais édulcorées — déguisées en habitudes quotidiennes
> parmi les loisirs (règle d'indiscernabilité Partie 0).

**Q3.3-T09 — ITEM SÉCURITÉ : contenu fourni séparément au moment de l'implémentation
(document trames, hors dépôt — Partie 7). Angle : les écrans du soir qui débordent.
Positions au mélange : 3.**

**Q3.3-T10 — ITEM SÉCURITÉ : contenu fourni séparément au moment de l'implémentation
(document trames, hors dépôt — Partie 7). Angle : miser / tenter la chance.
Positions au mélange : 6.**

**Q3.3-T11 — ITEM SÉCURITÉ : contenu fourni séparément au moment de l'implémentation
(document trames, hors dépôt — Partie 7). Angle : les achats non prévus.
Positions au mélange : 9.**

**Q3.3-T12 — ITEM SÉCURITÉ : contenu fourni séparément au moment de l'implémentation
(document trames, hors dépôt — Partie 7). Angle : le travail-refuge.
Positions au mélange : 12.**

Propriétés communes (côté moteur, côté contrat) : dimension carte `null` · orientations **D** ·
rappel d'ancrage **INTERDIT** · aucun slot, aucune citation, aucune restitution · le score CSR
alimente **SIG-3.3-03** (vigilance côté moteur seul — croisement 2.4, fiabilité du profil
ajustée) : jamais un affichage, jamais une exclusion, jamais une stigmatisation ; la sortie
existe (le score suit la demi-vie des signaux).

## Usage moteur (lecture du cadrage — refonte)

> Trois scores : **MODE_D** (centrifugie — moyenne des 4 items mode, I recodés, normalisée —
> haut = centrifuge), **FOND_D** (ancrage-partage des loisirs de fond, normalisée — haut =
> ancré-partagé) et **CSR** (le score des 4▲, moteur SEUL). MODE_D et FOND_D alimentent le
> rendu (carte + miroir) ; CSR alimente SIG-3.3-03 (vigilance interne, croisement 2.4) —
> jamais le rendu, jamais le score de compatibilité, jamais le matching.
> Au rendu : le dehors, le chez-soi, le fond, les amis — jamais « centrifuge », jamais « CSR »,
> jamais « addictions » (le mot reste côté moteur et clinique interdite).

## Décisions de composition documentées (domaine réservé [9] — propositions)

1. **La mutation 8+8 → 8+4▲** : la refonte proposait « Ton temps libre » (8) + « Tes
   consommations » (8, invisible) — la mission V9.C tranche : le mode + le fond portent les 8
   carte, les consommations se réduisent à 4▲ (un angle par consommation : écrans, jeu, achats,
   travail). Mutation documentée, cadrage mission fait foi.
2. **Q3.3-03/04 « un bon week-end, pour moi »** : le « pour moi » verrouille la préférence
   personnelle — aucun week-end n'est meilleur, la paire décrit deux façons de se poser.
3. **Q3.3-06 « sans fond fixe »** : la variété est décrite comme un mode d'exploration (au gré
   des envies), jamais comme une instabilité — le miroir lui donne sa dignité.
4. **Q3.3-07/08 le partage en duo d'angles** : « avec d'autres » / « en solo » = deux façons
   légitimes d'habiter ses loisirs de fond — l'homogamie (au moins UNE activité partagée) se
   documente au registre fréquentiel, elle ne se mesure pas en degré de sociabilité.
5. **Les 4▲ à orientation D unique** : le déguisement en habitudes quotidiennes exige une
   franchité constante — l'inversion (I) créerait une aspérité repérable (règle d'indiscernabilité,
   document trames Partie 0 ; précédent 2.1 : 4 trames D).
6. **« ensemble » sans faute** : la facette 07 s'intitule « le ensemble assumé » au tableau
   (lecture moteur) — le rendu dit « avec d'autres » (registre courant).

## Correspondance des angles (mission V9.C)

| Angle mission V9.C | Items porteurs | Lecture |
|---|---|---|
| le MODE (centrifuge/centripète — 4 items) | Q3.3-01 × 02 · Q3.3-03 × 04 | la recharge et le week-end — « tu nourris dehors / tu te nourris chez toi » |
| les consommations déguisées (4▲ CSR) | Q3.3-T09 → T12 | écrans du soir · jeu/chance · achats non prévus · travail-refuge — moteur seul |
| le fond des loisirs (homogamie — l'ombre) | Q3.3-05 × 06 · Q3.3-07 × 08 | l'ancrage et le partage — « au moins une activité de fond partagée → satisfaction supérieure » (registre fréquentiel au miroir) |

## Contrôles mécaniques passés

| Contrôle | Résultat |
|---|---|
| ≤ 12 mots / énoncé carte (max constaté : 10) | ✅ |
| 1re personne, présent de l'indicatif | ✅ |
| Zéro double négation | ✅ |
| Zéro fréquence ambiguë | ✅ |
| Neutralité normative (aucun mode « meilleur ») | ✅ |
| Zéro vocabulaire clinique au rendu | ✅ 8/8 carte |
| Paires R6 : 4 complètes (2 par volet) | ✅ |
| Trames ▲ : 4 — aucun énoncé au dépôt, positions 3·6·9·12, ancrage interdit | ✅ |
| Configuration conforme à la config CI (`ci/quetes/3.3.json`) | ✅ |

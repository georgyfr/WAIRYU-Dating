# LIVRABLE 1 — LES 10 ITEMS DE LA QUÊTE 1.10 « CE QUE TU APPORTES »

> Légende de la fiche de computation condensée — `C:` carte · `S:` signal · `F:` fiabilité · `M:` modulation · `A:` ancrage.
> Échelle : Likert 5 niveaux (Arbitrage 2) · Orientation : D = direct, I = inversé recodé `6 − réponse` (Arbitrage 1).
> **Règle de rédaction (anti auto-flatterie)** : chaque énoncé décrit un COMPORTEMENT observable,
> jamais une qualité — les adjectifs de soi (« je suis attentionné, généreux, fiable ») sont interdits.
> **5 dimensions × 2 (1 D + 1 I — paires miroir requises, règle R6)**.
> ⚠ **Aucune trame ▲ dans cette quête** : aucun énoncé réservé, aucune balise signal_id de trame.

| Code (gelé) | Énoncé | Or. | Dimension | Facette | ▲ (signal_id) | Fiche de computation — 5 canaux |
|---|---|---|---|---|---|---|
| Q1.10-01 | Quand je dis que je serai là, j'y suis. | **D** | fiabilité de présence | la présence tenue | — | C: contribution→score de quête · S: SIG_CONTRIB (croisement M1, moteur) · F: paire R6 avec 02 · M: facteur de confiance (écart > 0.30 ⚠) · A: rappel OK |
| Q1.10-02 | Il m'arrive de disparaître quelques jours sans donner de nouvelles. | **I** | fiabilité de présence | le silence qui s'installe | — | C: contribution (recodé 6−r) · S: idem 01 · F: paire R6 avec 01 · M: idem 01 · A: rappel OK |
| Q1.10-03 | Après une dispute, je reprends contact le premier. | **D** | capacité de réparation | le premier pas | — | C: contribution→score · S: idem 01 · F: paire R6 avec 04 · M: idem 01 · A: rappel OK |
| Q1.10-04 | Après une dispute, j'attends que l'autre revienne. | **I** | capacité de réparation | l'attente du retour | — | C: contribution (recodé) · S: idem 01 · F: paire R6 avec 03 · M: idem 01 · A: rappel OK |
| Q1.10-05 | Quand nos envies divergent, je cherche ce qui nous arrange. | **D** | ouverture au compromis | la recherche du terrain commun | — | C: contribution→score · S: idem 01 · F: paire R6 avec 06 · M: idem 01 · A: rappel OK |
| Q1.10-06 | Quand nos envies divergent, c'est souvent moi qui tiens la ligne. | **I** | ouverture au compromis | la ligne tenue | — | C: contribution (recodé) · S: idem 01 · F: paire R6 avec 05 · M: idem 01 · A: rappel OK |
| Q1.10-07 | Quand je me trompe, je le dis sans détour le jour même. | **D** | reconnaissance des torts | l'aveu sans détour | — | C: contribution→score · S: idem 01 · F: paire R6 avec 08 · M: idem 01 · A: rappel OK |
| Q1.10-08 | Mes torts, je les avoue surtout quand on me les prouve. | **I** | reconnaissance des torts | l'aveu sous preuve | — | C: contribution (recodé) · S: idem 01 · F: paire R6 avec 07 · M: idem 01 · A: rappel OK |
| Q1.10-09 | Je remarque la fatigue des gens avant qu'ils la disent. | **D** | soutien actif sans demande | l'antenne du quotidien | — | C: contribution→score · S: idem 01 · F: paire R6 avec 10 · M: idem 01 · A: rappel OK |
| Q1.10-10 | J'aide quand on me demande, rarement avant. | **I** | soutien actif sans demande | l'aide sur commande | — | C: contribution (recodé) · S: idem 01 · F: paire R6 avec 09 · M: idem 01 · A: rappel OK |

## Usage moteur (lecture du contrat — cadrage)

> Score de contribution = moyenne des 10 items (I recodés `6 − r`), normalisée 0-1 (variable
> `CONTRIB_D` — déclarée). Croisée avec les **traits mesurés au Miroir (M1)**, elle alimente
> **SIG_CONTRIB** (registre M2, verbatim) : *« la cohérence entre ce que l'utilisateur déclare
> apporter et ce que ses items M1 mesurent module la confiance accordée à ses déclarations dans le
> matching »*. Le **BIDR** (désirabilité sociale — concept public, items 100 % Wairyu) filtre les
> sur-déclarations côté moteur. L'écart déclaré/mesuré ne rend JAMAIS un texte : il module un facteur.

## Décisions de composition documentées (domaine réservé [9] — propositions)

1. **Verbes, pas adjectifs** : les 10 énoncés contiennent zéro qualité auto-attribuée — chaque
   réponse raconte une scène re-vérifiable (« je reprends contact », « j'y suis », « je remarque »).
   L'auto-flatterie ne meurt pas d'interdiction : elle meurt de ne pas avoir de place pour s'écrire.
2. **Q1.10-02 « disparaître »** : le comportement visé est le silence non négocié (pas la retraite
   annoncée) — l'énoncé garde « sans donner de nouvelles » pour distinguer le ghosting du repos dit.
3. **Q1.10-08 « surtout quand on me les prouve »** : l'aveu conditionnel à la preuve est la forme
   inverse la plus honnête de l'aveu sans détour — plus fine que « je n'assume jamais mes torts »
   (double négation, trop facile à repérer).
4. **Q1.10-10 « rarement avant »** : la fréquence assumée comme ancre (precedent 1.4 : « souvent »,
   « vraiment ») — le soutien réactif est un comportement légitime, il mesure, il ne juge pas.
5. **Aucun item sur la réception** : aucune question ne demande ce que l'autre apporte — le miroir
   de la réciprocité est l'affaire du croisement (SIG_CONTRIB × M1), jamais d'un item isolé.

## Contrôles mécaniques passés

| Contrôle | Résultat |
|---|---|
| ≤ 12 mots / énoncé (max constaté : 12) | ✅ |
| 1re personne, présent de l'indicatif | ✅ |
| Zéro qualité auto-attribuée (anti auto-flatterie — verbes comportementaux seulement) | ✅ 10/10 |
| Zéro double négation | ✅ |
| Zéro fréquence ambiguë (« souvent », « rarement » = ancres assumées, documentées) | ✅ |
| Neutralité normative (aucune contribution « meilleure ») | ✅ |
| Paires R6 complètes : 5 dimensions × (1 D + 1 I) | ✅ |
| Orientation conforme à la config CI (`ci/quetes/1.10.json`) : D impairs · I pairs | ✅ |
| Aucun item de trame ▲, aucun énoncé réservé | ✅ |

# LIVRABLE 1 — LES 6 ITEMS DE LA QUÊTE 2.2 « TA PLACE POUR LA SPIRITUALITÉ »

> Légende de la fiche de computation condensée — `C:` carte · `S:` signal · `F:` fiabilité · `M:` modulation · `A:` ancrage.
> Échelle : Likert 5 niveaux (Arbitrage 2) · Orientation : D = direct, I = inversé recodé `6 − réponse` (Arbitrage 1).
> **Neutralité absolue** : pratiquer et ne pas pratiquer = deux façons égales d'habiter la spiritualité —
> aucun énoncé ne suggère une « vraie » place (ni la semaine, ni la fête, ni l'absence).
> **3 angles × 2 (1 D + 1 I — paires miroir requises, règle R6)** · concept public (centralité
> spirituelle, Huber & Huber) nommé côté moteur uniquement — énoncés 100 % originaux Wairyu.
> ⚠ **Déguisement impossible — quête déclarative directe, sans trame** : aucun énoncé réservé, aucune balise de trame.

| Code (gelé) | Énoncé | Or. | Angle | Facette | ▲ (signal_id) | Fiche de computation — 5 canaux |
|---|---|---|---|---|---|---|
| Q2.2-01 | La spiritualité occupe une place réelle dans ma semaine. | **D** | pratique réelle vs culturelle | la pratique du quotidien | — | C: centralité→score de quête · S: SIG-2.2-01 (filtre enrichi, moteur) · F: paire R6 avec 02 · M: homophilie graduée (module, n'élimine pas) · A: rappel OK |
| Q2.2-02 | La spiritualité, pour moi, relève surtout de la culture et des fêtes. | **I** | pratique réelle vs culturelle | la pratique des grandes heures | — | C: centralité (recodé 6−r) · S: idem 01 · F: paire R6 avec 01 · M: idem 01 · A: rappel OK |
| Q2.2-03 | Mes grandes décisions tiennent compte de ma spiritualité. | **D** | place dans les choix de vie | la boussole intime | — | C: centralité→score · S: idem 01 · F: paire R6 avec 04 · M: idem 01 · A: rappel OK |
| Q2.2-04 | Mes grandes décisions passent sans la spiritualité. | **I** | place dans les choix de vie | l'arène sans chapelle | — | C: centralité (recodé) · S: idem 01 · F: paire R6 avec 03 · M: idem 01 · A: rappel OK |
| Q2.2-05 | Partager ma spiritualité avec un·e partenaire compte pour moi. | **D** | transmission dans un couple | le partage voulu | — | C: centralité→score · S: idem 01 · F: paire R6 avec 06 · M: idem 01 · A: rappel OK |
| Q2.2-06 | Transmettre une spiritualité n'est pas mon affaire. | **I** | transmission dans un couple | la transmission en retrait | — | C: centralité (recodé) · S: idem 01 · F: paire R6 avec 05 · M: idem 01 · A: rappel OK |

## Usage moteur (lecture du contrat — cadrage)

> Score de centralité spirituelle = moyenne des 6 items (I recodés `6 − r`), normalisée 0-1
> (variable `SPIRIT_D`). Il alimente le **filtre enrichi** (homophilie graduée — SIG-2.2-01) :
> l'écart entre deux centralités module le score de compatibilité, dans les deux sens.
> Le concept public (centralité religieuse) et son sigle éventuel restent côté moteur — au rendu,
> on parle de « place », de « semaine », de « fêtes », jamais de « religiosité ».

## Décisions de composition documentées (domaine réservé [9] — propositions)

1. **La place, jamais la croyance** : aucun des 6 énoncés ne nomme une confession, un texte, un culte
   ni une divinité — la quête mesure une PLACE (semaine, décisions, couple), elle reste ouverte à
   toutes les spiritualités et à son absence.
2. **Q2.2-02 « culture et fêtes »** : l'angle inverse de la semaine n'est pas « rien » mais LES
   GRANDES HEURES — la spiritualité culturelle est décrite comme une façon d'habiter, pas comme un
   manques. Le recodage 6−r la place sur l'axe unique de la centralité, sans la dévaloriser (le
   miroir lui donne son propre profil, respecté).
3. **Q2.2-06 « n'est pas mon affaire »** : formulation 1re personne assumée — la transmission est
   située comme un choix personnel (pas une impossibilité), ce qui maintient la neutralité normative
   (on ne dit jamais que transmettre serait « mieux »).
4. **Un·e partenaire (médian)** : conformité C8 dès l'énoncé — le point médian est la règle des
   énoncés comme des titres.
5. **Distinction 2.3-04 préservée** : la ligne rouge « différence de religion ou de pratique » reste
   un dealbreaker DÉCLARÉ (coche 2.3, hard constraint) ; cette quête ne fournit JAMAIS un
   dealbreaker — elle module. Les deux mécanismes ne se doublonnent pas (voir 03).

## Contrôles mécaniques passés

| Contrôle | Résultat |
|---|---|
| ≤ 12 mots / énoncé (max constaté : 12) | ✅ |
| 1re personne, présent de l'indicatif | ✅ |
| Zéro double négation | ✅ |
| Zéro fréquence ambiguë (« surtout » = ancre assumée, documentée) | ✅ |
| Neutralité normative (aucune place « meilleure » ; l'absence n'est pas un vide) | ✅ |
| Zéro confession, zéro croyance nommée | ✅ 6/6 |
| Paires R6 complètes : 3 angles × (1 D + 1 I) | ✅ |
| Orientation conforme à la config CI (`ci/quetes/2.2.json`) : D impairs · I pairs | ✅ |
| Aucun item de trame ▲, aucun énoncé réservé | ✅ |

# LIVRABLE 1 — LES 10 ITEMS DE LA QUÊTE 2.3 « TES NON-NÉGOCIABLES »

> **Format : CHECKLIST (NON-Likert).** L'utilisateur coche lui-même ses lignes rouges. Pas d'échelle,
> pas d'orientation D/I, pas de dimension psychométrique (`dimension = null`, `signal = null`).
> Cocher = « c'est rédhibitoire pour moi ». Ne pas cocher n'est jamais une « bonne réponse ».
> Légende de la fiche condensée — `C:` carte · `S:` signal · `F:` fiabilité · `M:` modulation · `A:` ancrage.
> Construction : thème dealbreakers (concept public — Jonason et al.) ; énoncés 100 % originaux Wairyu.

| Code (gelé) | Énoncé | Format | Options | Croisement moteur | Fiche de computation — 5 canaux |
|---|---|---|---|---|---|
| Q2.3-01 | Je ne peux pas construire avec quelqu'un qui fume. | checklist | coché / non coché | × Q2.4-01 de tous (bidirectionnel) | C: null · S: hard_constraint — élimination déterministe · F: coche × « Je fume » chez soi → QFI · M: 0 coche → cadre ouvert · A: rappel OK |
| Q2.3-02 | Je ne peux pas construire avec quelqu'un qui boit régulièrement. | checklist | coché / non coché | × Q2.4-02 de tous (bidirectionnel) | C: null · S: hard_constraint · F: coche × « Régulièrement » chez soi → QFI · M: idem 01 · A: rappel OK |
| Q2.3-03 | Un désaccord sur le sujet des enfants est rédhibitoire pour moi. | checklist | coché / non coché | × Q2.4-03 et × 2.7 de tous (bidirectionnel) | C: null · S: hard_constraint · F: coche × réalité enfants contradictoire chez soi → QFI · M: idem 01 · A: rappel OK |
| Q2.3-04 | Une différence de religion ou de pratique est rédhibitoire pour moi. | checklist | coché / non coché | × Q2.4-04 et × 2.2 de tous (bidirectionnel) | C: null · S: hard_constraint · F: coche × pratique religieuse contradictoire chez soi → QFI · M: idem 01 · A: rappel OK |
| Q2.3-05 | Une relation à distance est rédhibitoire pour moi. | checklist | coché / non coché | × Q2.4-07 de tous (bidirectionnel) | C: null · S: hard_constraint · F: coche × « Je suis nomade » chez soi → QFI · M: idem 01 · A: rappel OK |
| Q2.3-06 | Une différence d'alimentation au quotidien est rédhibitoire pour moi. | checklist | coché / non coché | × Q2.4-05 de tous (bidirectionnel) | C: null · S: hard_constraint · F: coche × alimentation contradictoire chez soi → QFI · M: idem 01 · A: rappel OK |
| Q2.3-07 | Vivre avec quelqu'un qui ne fait pas de sport est rédhibitoire. | checklist | coché / non coché | × Q2.4-06 de tous (bidirectionnel) | C: null · S: hard_constraint · F: coche × « Zéro » chez soi → QFI · M: idem 01 · A: rappel OK |
| Q2.3-08 | Une relation non exclusive est rédhibitoire pour moi. | checklist | coché / non coché | × Q2.5-03 de tous (bidirectionnel) | C: null · S: hard_constraint · F: coche × « Oui » à Q2.5-03 chez soi → contradiction directe → QFI · M: idem 01 · A: rappel OK |
| Q2.3-09 | Un désaccord sur le niveau d'engagement est rédhibitoire. | checklist | coché / non coché | × agrégat d'intention (2.5) de tous | C: null · S: hard_constraint · F: cohérence avec l'intention affichée chez soi · M: idem 01 · A: rappel OK |
| Q2.3-10 | Une autre ligne rouge, dans tes mots. | champ libre optionnel | texte libre (vide autorisé) | aucun — hors computation automatique ⚠ | C: null · S: null · F: null · M: jamais parsé par les filtres en v1 — traitement À VALIDER PAR LE COMITÉ · A: rappel possible uniquement verbatim + consentement (les mots de la personne ne sont jamais reformulés) |

## Blocs de regroupement portrait (pour les slots)

- **Vie et consommations** : tabac (01) · alcool (02)
- **Projet et famille** : enfants (03) · engagement (09)
- **Cadres de vie** : religion/pratique (04) · distance (05) · alimentation (06) · sport/style de vie (07)
- **Forme de la relation** : statut ouvert/fermé (08)
- **Hors bloc** : champ libre (10)

## Décisions de composition documentées (domaine réservé [9] — propositions)

1. **Asymétrie assumée de Q2.3-08** : la liste capture le refus de la non-exclusivité (la ligne rouge la
   plus répandue) ; la préférence inverse (non-exclusivité assumée) est capturée par Q2.5-03. Le croisement
   bidirectionnel couvre donc les deux sens sans doublonner l'énoncé.
2. **Style de la checklist** : 8 énoncés sur 9 partagent la charpente « … est rédhibitoire pour moi » —
   la répétition est le marqueur sémantique du format (cocher = une limite à soi). Q2.3-01/02/07 utilisent
   « je ne peux pas construire avec quelqu'un qui… » pour rester littéraux sur le comportement visé.
3. **Q2.3-10 hors moteur** : un texte libre ne peut pas alimenter un filtre déterministe sans traitement
   humain — la coche des 9 items fermés reste le seul carburant automatique en v1.

## Contrôles mécaniques passés

| Contrôle | Résultat |
|---|---|
| ≤ 12 mots / énoncé (max constaté : 11) | ✅ |
| 1re personne (l'utilisateur pose SA limite), voix de l'app tutoyée | ✅ |
| Zéro « toujours » / « jamais » en absolu dans les énoncés | ✅ |
| Zéro double négation | ✅ |
| Neutralité normative (aucune coche « meilleure » qu'une autre ; liste vide non jugée) | ✅ |
| Zéro contamination : chaque item porte UN thème, sans chevauchement avec un autre item de la liste | ✅ |
| Aucune orientation D/I, aucune dimension, aucun sigle (non-Likert déclaré) | ✅ |

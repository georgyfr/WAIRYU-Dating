# Bilans de DIMENSION — Action n°2 (assemblage L8, 7 blocs)

> **La pièce exacte de la demande fondateur « lorsque un monde est terminé »**
> (audit §4 constat 4, §5 action 2 — canon §6.1, couche L8).

## Ce que c'est

Pour chacune des **5 dimensions**, le **bilan de dimension** assemble les
résultats RÉELS des quêtes validées P1 en un fragment L8 à **7 blocs** :

1. **position** — les niveaux réellement mesurés
2. **forme** — la configuration réelle nommée (croisement)
3. **empreinte** — les inférences situationnelles réelles
4. **couple** — la lecture de couple réelle (consignée si chemin mono)
5. **force** — les forces réellement dérivées (jamais fabriquées)
6. **limites** — les zones d'ombre réelles (descriptif sans étiquette)
7. **palier/pas** — le palier réel + le pas réel de la banque + suivi/re-test

… plus la **consignation de flux** (« monde terminé — flux vers la suite »,
gabarit A6 réel pour la générationnelle : `RECAP_DIMENSION` servi verbatim).

## Les 3 fichiers

| Fichier | Rôle |
|---|---|
| `src/wtc_bilan_moteur.py` | assemble (ne mesure pas) — 7 blocs, consignations explicites, bandeau D-SIM, vocabulaire écran (doctrine confirmée) |
| `src/wtc_bilan_adapters.py` | 5 bilans — importent les VRAIS cœurs validés P1 (asserts d'identité à l'import) et assemblent par JUNCTION sur les vraies fonctions. Zéro réimplémentation, zéro fabrication |
| `src/wtc_bilan_validation.py` | 9 critères **BIL0-BIL8** + rapport/JSON |

## Règles de doctrine portées

- **Zéro fabrication** : un bloc qui n'a rien à dire DIT qu'il n'a rien à dire
  (consignation « rien à fabriquer » / « feuille jamais vide »).
- **Vocabulaire écran** : déceler sans nommer (ADDENDUM du 21/10, trace
  `1a15eca977dc8259`) — liste canonique des mots interdits, avec l'exception
  sourcée RIO-12 (« trouble » = nom de case du canon, banque de pas réelle Q5).
- **Zone calme** : consignation exacte du canon §5.5.
- **D-SIM** : tout fragment porte le bandeau simulation (VALID-01 en attente).
- **RIO-05** : les deux lectures de palier (arbitrage fondateur ouvert, note
  de fusion de l'audit) ne sont PAS tranchées ici — le bloc palier/pas lit le
  VRAI moteur `selectionner_pas`, hors de la divergence.

## Validation (BIL0-BIL8 — Tous PASS)

- **BIL0** identité des tables réelles épinglée (banques, seuils, ensembles)
- **BIL1/BIL4** 1 344 fragments × 7 blocs complets · 25 984 textes · 0 mot interdit
- **BIL2** table pure ≡ adapter — 0 écart
- **BIL3** junctions VRAIS moteurs : attachement 4 704/4 704 (784 paires × 6 labels)
  · SM 18/18 · générationnelle RECAP verbatim · personnalité chaîne P1
- **BIL5** 6 pas tous de la banque réelle · forces ⊆ banque réelle · zone calme exacte
- **BIL6** re-score bit-exact : 180 profils (VRAI simulateur seed 42 frais) ≡
  `pas_vrai` D-VÉRITÉ — 0 écart
- **BIL7** espions (indépendance des blocs)
- **BIL8** pipeline ×2 SHA-256 identiques `21ec408540882e25…`

## Résultats

- `results/bilan_criteres.json` — les 9 critères, machine-lisibles
- `results/rapport-bilans-dimension.md` — le rapport complet

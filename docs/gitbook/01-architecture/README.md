# La chaîne de confiance RIO

> **RIO** = le registre des instruments du programme WTC. Chaque instrument porte un
> numéro (RIO-01 à RIO-18), un titre canonique, un package de validation, une
> empreinte SHA-256 et un statut de contresignature. À la date du 19/10/2026 :
> **18/18 contresignés** — les quatre dimensions sont complètes.

## Le principe : une lecture vérifiable, pas une opinion

Chaque fois que le système « lit » quelque chose dans les réponses d'un couple —
une zone, une configuration, un palier, un pas — cette lecture provient d'un
**algorithme déterministe** inscrit dans le `core` d'un package contresigné.
La chaîne qui relie une réponse à une lecture est la suivante :

1. **Spécification verrouillée** — un document SPEC fixe les items, les seuils
   candidats, les arbitrages. Rien ne se code avant verrouillage.
2. **Production du package** — trois modules : `core` (les algorithmes),
   `simulator` (la géométrie de simulation), `validation` (les critères et le rapport).
3. **Calcul des bornes avant les critères** (D-STD / D-STD-2) — les seuils ne sont
   posés qu'après mesure du plafond réellement atteignable par la géométrie.
4. **Double exécution** — le package tourne deux fois ; les deux empreintes
   SHA-256 doivent être identiques (D-EMPREINTE).
5. **Publication** — hub, rapport, résultats, figures poussés sur GitHub.
6. **Auto-audit origin** — un clone frais est re-cloné depuis GitHub et le package
   y est ré-exécuté : l'empreinte doit être reproduite depuis ce qui est publié.
7. **Contresignature** — un audit indépendant pré-contresignature vérifie
   l'empreinte reconstruite depuis le JSON publié, puis la marque est gravée.

## La table des 18 instruments (état au 19/10/2026)

| RIO | Dimension | Package | Titre canonique | Verdict du rapport | Empreinte SHA-256 (exécutions 1 = 2) |
|---|---|---|---|---|---|
| RIO-01 | Attachement | WTC-Q1-R1 | Comment je me raccroche | 5/6 → corrigé (voir limites) | `393887f2149e9331fcd8ab2041f70b0d0a1009b9fbcb68392e1a5679cdc22d1f` (métriques R1) |
| RIO-02 | Attachement | WTC-Q2-R1 | Ce qui m'effraie vraiment | 5/7 → corrigé | `ab950c039a95bb3a371bd181bef5f14dc44448318ef94129adee5d099ec09a6a` |
| RIO-03 | Attachement | WTC-Q3-R1 | Ce qui me porte | **VALIDÉ 7/7** | `1e445ea8956c88c14298fb0a2ffe5abc54222ccceae135a4490d82360ceb275f` |
| RIO-04 | Attachement | WTC-Q4 | Notre danse | 4/5 → corrigé | `c10a103cb7c113d136e0bfbd7e354251cfcab5fababf7a19cd9a29f8b6422a03` |
| RIO-05 | Attachement | WTC-Q5 | Mon premier pas | **VALIDÉ 5/5** | `015f7e9dfbe4e24b9b089891967295e7a9877b7760adf94a0f94c0673a69c596` |
| RIO-06 | Émotionnelle | WTC-EMO-Q1 | Ma météo intérieure | **VALIDÉ 7/7** | `990447875e0d90984b9afc25c7d9cb256bfd504db272043040b1be91cf3eb680` |
| RIO-07 | Émotionnelle | WTC-EMO-Q2-R1 | Ce que je n'arrive pas à dire | 6/7 → corrigé | `c3ca7dc1cb616ca01efd47e7ba17a5b7ed5ad7464457a4e2e1fdb848bdf116fa` |
| RIO-08 | Émotionnelle | WTC-EMO-Q3-R1 | Ce que mon cœur sait faire | **VALIDÉ 8/8** | `6d7a40c42e5616caadc217d4d195ef389ece0a33d392854a2c9b2dd778e3afb3` |
| RIO-09 | Émotionnelle | WTC-EMO-Q4-R3 | Nos deux langues | 4/5 → corrigé | `5634d18a34d211a102b0995393fdc24ab4399b3ea70e20d4f5e6e9e6a4f4d8d3` |
| RIO-10 | Émotionnelle | WTC-EMO-Q5 | Mon premier geste du cœur | **VALIDÉ 6/6** | `de952b355e197f2692eac41f9515dcbfa51f7f1a541f5f8d74f61a173be6dcd9` |
| RIO-11 | Santé mentale | WTC-SM-Q1-R3 | Ma détresse et la leur | **VALIDÉ 6/6** | `bb2551dddc73d955e01439459f123a984ff9083ed238cec545b4eb3ca92da4b3` |
| RIO-12 | Santé mentale | WTC-SM-Q2 | Ce que je porte pour toi | **VALIDÉ 6/6** | `f57fc089e85861b51ac4955231e0bae9f7f73d6cf7995f7025b2f2c006aa1a98` |
| RIO-13 | Santé mentale | WTC-SM-Q3 | Ce que notre lien sait porter | **VALIDÉ 7/7** | `0ae85f467501759467b8672ed7d9738c18a43d2c7d81478bef15dd25b8b44a4b` |
| RIO-14 | Santé mentale | WTC-SM-Q4 | Nos deux rives | **VALIDÉ 7/7** | `c0220b041358839911146e7d551c590111c62a53b6ce23edbbebd97695cec9fd` |
| RIO-15 | Santé mentale | WTC-SM-Q5 | Mon premier pas vers l'autre rive | **VALIDÉ 7/7** | `6684a435d072c095d2ecddc41c4acbbb8832a5f869fea6e13330136f8d55d18a` |
| RIO-16 | Générationnelle | WTC-EXT-Q1 | L'écart de nos horloges | **VALIDÉ 7/7** | `3583fe56ffaa1aaf578c1b68b1ec5e1fd448edfadfbd9935481eef2a6ba8edcb` |
| RIO-17 | Générationnelle | WTC-EXT-Q2 | Notre conversation de l'horizon | **VALIDÉ 7/7** | `2aea8d99b91ad664f896f1d974d775c134b5d16d0594c6756169421272f38ab5` |
| RIO-18 | Générationnelle | WTC-EXT-Q3 | Le pas de l'horizon | **VALIDÉ 7/7** | `2e31e14d6e1d88159dab6feb2ac1ac6d5aeac7bd2e02dff902d5bfd1c6da6785` |

**Note d'honnêteté** : les packages marqués « → corrigé » ont rendu un verdict
initial **À CORRIGER** ; la révision correspondante (-R1/-R2/-R3 ou erratum) a été
produite et absorbée avant la déclaration de dimension complète. Le détail des
verdicts bruts est conservé tel quel dans les rapports — et repris dans la
partie VII de cette documentation.

## Les dimensions et leur architecture commune

Les quatre dimensions suivent le même patron en cinq quêtes (la Générationnelle
en trois, séquence tronquée par arbitrage fondateur A2) :

| Quête | Rôle | Exemple santé mentale |
|---|---|---|
| Q1 | Mesure individuelle de la rive 1 | La détresse (RIO-11) |
| Q2 | Mesure individuelle de la rive 2 | La charge de l'aidant (RIO-12) |
| Q3 | Le positif — banque fermée de forces | Les forces du lien (RIO-13) |
| Q4 | Croisement à deux — zéro item nouveau | Les deux rives (RIO-14) |
| Q5 | Le pas — une action + suivi 14 jours + re-test 8 semaines | Le premier pas (RIO-15) |

Deux invariants traversent tout le registre :

- **« Le positif n'est jamais généré — il est sélectionné »** : les forces (Q3 de
  chaque dimension) sortent d'une banque fermée, activées par des conditions
  précises ; à densité nulle, le système affiche **SILENCIEUSE**, mot pour mot.
- **« Une mesure, un rôle »** : un score calculé pour une mesure n'est jamais
  réutilisé pour une autre décision (ex. les bornes 2,50/3,50 du croisement SM-Q4
  sont les mêmes bornes pour la signification clinique du RCI SM-Q5).

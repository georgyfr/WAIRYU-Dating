# Dimension Émotionnelle — fondation et structure tripartite

> La dimension émotionnelle (RIO-06 → RIO-10) mesure des phénomènes situés
> (fréquences comportementales), pas des traits stables — d'où le passage à
> l'échelle de fréquence à **5 points** :

```
JAMAIS = 1 · RAREMENT = 2 · PARFOIS = 3 · SOUVENT = 4 · TOUT LE TEMPS = 5
```

## La structure tripartite (fondation v1.1, 9 faces)

```
Dimension émotionnelle
├── E-R « Ma météo intérieure » (régulation)
│   ├── E-R1 « L'explosion »   — l'émotion déborde vite et fort
│   ├── E-R2 « Le mur »        — l'émotion est retenue, cachée
│   └── E-R3 « La rumination » — l'émotion tourne en boucle
├── E-B « Mes besoins affectifs »
│   ├── E-B1 « Le besoin de mots »    — entendre que l'on compte
│   ├── E-B2 « Le besoin de temps »   — de la vraie présence
│   └── E-B3 « Le besoin de contact » — le toucher non sexuel
└── E-L « Mes langages d'affection »
    ├── E-L1 « Ce que je donne »   — mon canal de don spontané
    ├── E-L2 « Ce que je reçois »  — mon canal de réception réel
    └── E-L3 « Ce que je partage » — la capitalisation
```

Chaque face = **3 items** → score de face = moyenne (1-5) ; sous-échelle =
moyenne des 3 faces. Les scores de face sont arrondis et comparés aux seuils
**2,5** (bas) et **3,5** (haut) — ancrés au milieu **3,00** de l'échelle
(D-ÉCHELLE).

## Les blocs annexes

| Bloc | Contenu | Scoring |
|---|---|---|
| **C** (3 items) | C-A « L'écho » · C-B « La détente » · C-C « La demande » — comportement réel en situation | chaque item = score indépendant 1-5 |
| **D-EXP** (1 item) | la demande explicite (« je formule au lieu d'attendre qu'il devine ») | score 1-5, condition de F-E4 |
| **CAP** (1 question, 4 choix forcés) | la réaction à une bonne nouvelle (Gable & Reis) : **CAP-AC** active-constructive · CAP-PC passive-constructive · CAP-AD active-destructive · CAP-PD passive-destructive | **CAP = 1 si AC, 0 sinon** |
| **OPT-A** (4 items, optionnels) | posés si partenaire lié (croisement) | scores indépendants 1-5 |

Total : **32 items obligatoires + 4 optionnels**, temps de remplissage
estimé 8-12 minutes. Convention de casse : code = minuscules
(`t,u,l,m,n`), documents = majuscules — le moteur convertit à la lecture.

## La banque des forces F-E1 à F-E6 (fondation v1.1, corrigée au code)

Chaque force a **2 voies** (comportement / journal) — la version fondation
v1.1 en prévoyait parfois 3, le moteur a corrigé **à la source** (faute
n°16 pré-attrapée : jamais de OU simple sur une condition négative) :

| Force | Voie comportement | Voie journal |
|---|---|---|
| F-E1 | C-A ≥ 2 | jL ≥ 4/7 |
| F-E2 | (E-R1 ≤ 2,5 **ET** C-B ≥ 2) **OU** C-B ≥ 3 | jU ≥ 4/7 |
| F-E3 | CAP = AC | jM ≥ 4/7 |
| F-E4 | (C-C ≥ 2 **OU** D-EXP ≥ 3) | jM ≥ 4/7 |
| F-E5 | (E-R3 ≤ 2,5 **ET** C-B ≥ 2) **OU** C-A ≥ 2 | (jL ≥ 4 **ET** jM ≥ 3) |
| F-E6 | C-C ≥ 3 | jU ≥ 3/7 |

Assemblage : **max 2 forces**, tie-break ordre de banque, **0 force →
SILENCIEUSE** (mot pour mot : « Ton cœur est encore discret… c'est un
constat, pas un défaut »).

Signification des variables journal (commentaires du code émo-Q1) :
**l** = liens entretenus, **u** = moments de compréhension,
**m** = marques de tendresse.

## Invariants de la dimension

- **Garde clinique CAP** (RIO-08) : F-E3 n'est **jamais** activée si CAP ≠ AC —
  « la tiédeur ne fabrique pas de célébration ».
- **Boucle des bids** (RIO-09) : asymétrie **interne** au partenaire
  (|bid_donner − bid_recevoir| de chaque rive ≥ 2), pas croisée.
- **Arbre de priorité du pas** (RIO-10) : INV > RC > CAP > FE1 > FE6 > ER1 >
  ER2 > FE3 — fallback ER2 (« le mur est le plus commun »).

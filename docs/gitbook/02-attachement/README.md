# Dimension Attachement — vue d'ensemble et couches L1-L7

> La dimension attachement (RIO-01 → RIO-05) est la première carte individuelle
> du programme : comment chaque partenaire se raccroche (anxiété d'abandon) et
> craint de dépendre (évitement de l'intimité). Références citées : Bowlby ;
> Brennan, Clark & Shaver.

## L'échelle de réponse (4 points)

Contrairement aux dimensions émotionnelle et santé mentale (5 points), la
dimension attachement répond sur **4 points** :

```
FAUX de moi = 1 · Plutôt faux = 2 · Plutôt vrai = 3 · VRAI de moi = 4
```

## Les couches canoniques L1-L7

Les lectures attachement sont organisées en couches numérotées, reprises et
adaptées par les dimensions suivantes :

| Couche | Nom | Ce qu'elle fait |
|---|---|---|
| **L1** | RQS (Response Quality Screen) | Détecte les réponses non fiables (répondant linéaire, trop rapide, contradictoire, vigilance ratée). Score 0-100, pénalités −20/−25, statuts OK ≥ 85 / PRUDENCE 70-84 / INVALIDE < 70 |
| **L2** | Scores et intervalles | Face = moyenne de 3 items ; axe = moyenne de 9 items ; CI90 = score ± 1,64 × SEM |
| **L3** | Lecture à niveaux | 4 niveaux : Discrète < 1,80 ≤ Tranquille < 2,60 ≤ Vive < 3,20 ≤ Forte ; décision **conservatrice** aux frontières |
| **L4** | Hiérarchie de faces | Une face « déclarable » domine si son avance dépasse l'incertitude combinée (1,64 × √(SE₁² + SE₂²) ≈ 0,8836) |
| **L5** | Empreinte | Le label d'ombre produit par Q2 est normalisé en 3 inférences (empreinte) |
| **L6** | Styles | Comparaison de styles entre rives (percentiles, écart ≥ 30 pts = boucle probable) |
| **L7** | Changement fiable | RCI de Jacobson & Truax sur le re-test à 8 semaines (voir partie VI) |

## Les 6 faces de l'attachement (18 items)

**Axe A — « PEUR DE PERDRE »** (items 1-9) · **Axe B — « PEUR DE DÉPENDRE »**
(items 10-18). Six faces de 3 items :

| Face | Nom | Items |
|---|---|---|
| A1 | Vigie | 1, 2, 5 |
| A2 | Besoin de mots | 3, 4, 6 |
| A3 | Rumeur | 7, 8, 9 |
| B1 | Inconfort du près | 10, 11, 15 |
| B2 | Debout-seul | 12, 13, 14 |
| B3 | Porte fermée | 16, 17, 18 |

Items **inversés : 5 et 15** (corrigé = 5 − brut). Une 19ᵉ question de
vigilance (réponse attendue = 3) alimente le RQS. Le texte des 18 items
n'est pas déposé dans les packages : *absent des sources* — seuls les codes
de faces et les constantes sont gravés.

## Invariants de la dimension

- **Anti-fabrication du positif** : Q3 sélectionne dans une banque fermée de
  6 forces ; à densité nulle → SILENCIEUSE.
- **Le croisement (Q4) ne juge pas** : `pct_compatibilite = None`, **jamais
  affiché** ; 9 templates descriptifs non-blâmants vérifiés mot interdit par
  mot interdit (« ta faute », « c'est toi »… interdits).
- **Le pas (Q5) ne sanctionne jamais** : `sanction = None` dans tous les cas ;
  9/14 jours = célébré, 7-8 = ajustement, ≤ 6 = reprise.
- **Le re-test est programmé, jamais forcé** : 8 semaines, rappels doux J1/J7/J14.

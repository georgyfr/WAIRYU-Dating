# LIVRABLE 1 — TABLEAU DU GESTE Q8.4-01 « LE BONUS »

> quete : 8.4 « Le bonus » · fiche : 01 — tableau du geste (1 geste, pas d'échelle)
> Le geste entre au contrat pour **1 unité** (le monde M11 : 46 = 36 [8.1] + 6 [8.2] + 3 [8.3] + **1 geste [8.4]** — Constitution [5]).
> 🆓 GRATUIT · P2 · accès premier match · opt-in · mode à deux · récompenses partagées.

## Le geste Q8.4-01

| Élément | Valeur |
|---|---|
| Code | **Q8.4-01** (code gelé — clé du contrat ; le monde M11 est une métadonnée, FM-011 v2) |
| Nature | **1 geste** — un jeu d'attribution (pas une échelle, pas un Likert, pas un choix-déclaratif) |
| Nom de production | « Le bonus » — le jeu des 20 pépites |
| Phase | P2 · Accès : **premier match** (l'invitation arrive une fois, dans le voyage à deux) |
| Passation | **opt-in** · 30 secondes · **une seule fois par compte** (arbitrage n° 4 du 00) |
| Récompense | partagée par nature : ce que tu offres, ton match le reçoit pour de vrai |

## Le libellé écran officiel (VERBATIM — gelé)

> **Wairyu t'offre 20 pépites. Tu peux les garder, en offrir une partie à ton match, ou les partager entre plusieurs profils. À toi.**

Ce libellé est l'énoncé officiel du geste : il se cite au rendu à l'identique, sans réécriture,
sans résumé, sans commentaire ajouté. Il se retrouve tel quel dans la fiche yaml (`06`,
champ `libelle_ecran`). Toute évolution de formulation = Fiche de Mutation.

## Les 3 choix possibles (aucune hiérarchie)

| # | Choix | Ce qui se passe | Lecture GEN |
|---|---|---|---|
| 1 | **Garder** | tu gardes les pépites (tout, ou ce qui reste après un don partiel) — ton avoir bouge de zéro | niveau **garde** — crédit nul, et rien d'autre (choix neutre) |
| 2 | **Offrir une partie à ton match** | tu choisis un de tes matchs et un nombre entier de pépites (1 au moins) — les pépites quittent TON avoir et arrivent dans la conversation | niveau **partage** — crédit au facteur de confiance (MOTEUR SEUL, 03) |
| 3 | **Partager entre plusieurs profils** | tu répartis des entiers de pépites entre plusieurs de tes matchs actifs — la somme offerte quitte TON avoir | niveau **partage** — l'intensité (part offerte) se lit côté moteur (03) |

- Les 3 choix sont des sorties légitimes du jeu, d'égale dignité : le libellé les énonce dans
  l'ordre neutre (garder d'abord), sans recommandation, sans préférence affichée.
- Les boutons portent des libellés courts et égaux ; aucun n'est mis en avant (ni taille, ni
  couleur, ni position privilégiée — la neutralité du jeu est un verrou d'interface, 00).

## Granularité du don

| Règle | Valeur |
|---|---|
| Unité | **entiers de pépites** — pas de fraction, pas de centième |
| Don minimum | 1 pépite (si tu offres, tu offres au moins une pépite entière) |
| Plafond | ton avoir — tu ne peux pas offrir plus que tu ne possèdes |
| Répartition | libre : un ou plusieurs de tes matchs actifs, montants entiers libres |
| Après le jeu | l'avoir est mis à jour une fois ; le geste est posé ; le jeu se referme (une seule fois) |

## La règle du don réel (gravée)

> **Ce qui est offert sort de TON avoir — un don réel, pas de monnaie créée.**

- Les pépites offertes quittent ton avoir et entrent dans celui du reçu : Wairyu ne crée rien
  au passage, ne complète pas, ne « arrondit » pas. Le reçu reçoit ce que tu ne gardes plus.
- Les pépites n'ont aucune valeur marchande : elles ne s'achètent pas, ne se vendent pas, ne
  se convertissent pas (ni en argent, ni en abonnement, ni en fonctionnalité). Elles servent
  ce jeu et le partage entre matchs — rien d'autre (statut : arbitrage n° 2 du 00).
- Un avoir qui coûte est la condition du test honnête : offrir ce qui ne coûte rien ne mesure
  rien. C'est le fondement de la lecture GEN (03).

## Ce que le geste n'est pas (liste fermée)

- **Pas une déclaration** : aucune case « je suis généreux », aucune échelle, aucune
  auto-évaluation — un fait se pose, il ne se raconte pas.
- **Pas un paiement** : les pépites n'achètent rien (ni visibilité, ni match, ni
  fonctionnalité) — zéro lien vers l'écran de conversion (unique en M5, [6]).
- **Pas un score affiché** : aucun niveau, aucune jauge, aucun badge — GEN vit au ledger
  (MOTEUR SEUL).
- **Pas un message** : aucune analyse du geste n'est envoyée à l'autre — la pépite offerte se
  voit, nue, dans la conversation ; aucun texte ne dit à personne « ce que ça prouve ».
- **Pas une obligation** : ignorer le jeu n'a aucune conséquence ; la garde est un choix
  neutre ; recevoir n'oblige à rien (zéro boucle de contre-don provoquée par l'app).

## Usage moteur (MOTEUR SEUL)

- Le geste posé alimente le registre des **« gestes mesurés »** → **SIG-8.4-01 « GEN »**
  (niveaux garde/partage, paliers d'intensité, crédit au facteur de confiance du donneur :
  tout au `03`, seuils PROVISOIRES — À VALIDER PAR LE COMITÉ, verrou [9]).
- Zéro rendu : Q8.4-01, la dimension interne `generosite_reelle`, les niveaux et les paliers
  vivent côté moteur — ils ne franchissent aucune interface (Constitution [3]).
- Le mélange est SANS-OBJET (02) : 1 geste, aucune permutation possible.

## Vérifications machine (locales)

- Libellé verbatim présent à l'identique (01 ✓ · 06 ✓) — 23 mots (compteur apostrophe-collée,
  même machine que l'écran), apostrophes typographiques.
- 3 choix présents et d'égale dignité · granularité entiers ✓ · règle du don réel ✓.
- Zéro mot d'absolu au rendu ([3]) · zéro label clinique · zéro nom d'auteur · zéro marque ·
  zéro métadonnée au rendu (le présent fichier est un document de production : les codes y
  sont la clé du contrat, ils ne franchissent pas l'UI).

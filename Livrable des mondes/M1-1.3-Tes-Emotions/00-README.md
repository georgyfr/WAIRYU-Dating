# QUÊTE 1.3 « TES ÉMOTIONS » — GUIDE DE LECTURE (1 page)

## Le rôle de cette quête

Les émotions ne se choisissent pas. La façon de les connaître, si. Cette quête mesure les
trois axes qui décrivent ta vie émotionnelle :

- **la perception** (variable moteur **P**, 0-1) — savoir ce que tu ressens, même quand c'est mêlé (6 items) ;
- **la régulation** (variable moteur **R**, 0-1) — ce que tu fais quand ça monte (7 items) ;
- **l'expression / connexion** (variable moteur **X**, 0-1) — ce qui se voit et se dit de toi (7 items).

Elle embarque aussi 6 items de **trame sécurité** dont les énoncés ne circulent pas dans ce
dépôt (doctrine de brûlage, FM-018 / Constitution [11-b]) :

- 4 items → signal **DE_U** (empathie instrumentale) ;
- 2 items inversés ↩ → signal **DE_C** (empathie compassionnelle).

Le croisement des deux sous-scores construit la **fonction Dark Empathy** côté moteur —
mentionnée ici SANS ses conditions ni ses seuils (document trames, hors dépôt). Aucun de ces
éléments n'a d'étage de restitution : jamais à l'utilisateur, jamais au match, jamais dans
les portraits (Constitution [2]).

La quête est 🆓 gratuite, Monde M1 (Le Miroir). Ses sorties visibles : la **carte** (étage 1,
6 variantes) et le **miroir de quête** (étage 2, gabarit LOURD 300-450 mots). Les croisements
fins (signatures) opèrent au Portrait M1 (étage 3), jamais dans le miroir de quête seul.

## Lecture des fichiers

| Fichier | Ce que tu y trouves |
|---|---|
| `README.md` | Vue d'ensemble, déclaration de conformité, points comité |
| `01-tableau-des-items.md` | Les 20 items carte VERBATIM + les 6 lignes-réservées de trame + les 2 doublons fiabilité |
| `02-plan-de-melange-graine-213427.md` | L'ordre réel de passation (graine 213427) et les verdicts réels des 6 contraintes |
| `03-signatures-registre.md` | Les règles composées que les réponses alimentent (format du registre Monde 1) |
| `04-slots-de-miroir.md` | Ce que le miroir rend à l'utilisateur, et ses 9 verrous |
| `05-ecran-d-intro.md` | Le texte d'ouverture de la quête (verbatim) |
| `06-fiche-computation-EXEMPLE.yaml` | Le modèle de computation d'un item, canal par canal |
| `07-miroir.md` | Le miroir de quête (étage 2) — gabarit LOURD 300-450 mots, 12 briques-variantes — créé VAGUE 4 |
| `cartes.yaml` | Les 6 cartes possibles et leur logique de sélection (charte, verbatim) |

## Le flux de la donnée

1. **Passation** — l'utilisateur voit les 26 items dans l'ordre du plan de mélange
   (graine 213427), jamais dans l'ordre des codes ; les trames passent inaperçues parmi les autres.
2. **Scoring** — Likert 5 (Arbitrage 2) ; les items I sont recodés `6 − réponse` (Arbitrage 1) ;
   moyennes par dimension → P, R et X effectives.
3. **Carte** — le sélecteur de la charte choisit 1 variante parmi 6 (`cartes.yaml`).
4. **Miroir** — 26 items → gabarit LOURD, 4 slots (`04-slots-de-miroir.md`), rappels en toutes
   lettres, ombre ≥ lumière.
5. **Signatures** — côté moteur : les conditions du registre Monde 1 se lisent dans
   `03-signatures-registre.md` ; la trame (DE_U × DE_C) alimente la trame sécurité, sans
   aucune restitution.

## Trois points d'attention

- **Zéro fuite** : aucune formulation de trame n'existe dans ce dossier (verrou [11-b]).
- **Zéro métadonnée visible** : codes, scores et sigles ne franchissent jamais un texte rendu (Constitution [3]).
- **Décisions comité appliquées (FM-019)** : seuils, fenêtres et conditions composées proposés
  ADOPTÉS comme valeurs de départ — provisoire concepteur — re-signature professionnelle avant
  bêta · c2×c4 sans-objet : reste en attente.

## Conformité a11y

Conformité a11y : WCAG 2.1 AA visée (contrastes ≥ 4,5:1, cibles tactiles ≥ 44×44 px, support lecteur d'écran, respect du mode réduit-animations). Implémentation : voir spec quête 1.1 §10 et styles.css.

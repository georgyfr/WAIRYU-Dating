# QUÊTE 1.2 « TA FAÇON DE T'ATTACHER » — GUIDE DE LECTURE (1 page)

## Le rôle de cette quête

Il n'y a pas une bonne façon de s'attacher. Il y a la tienne. Cette quête mesure les deux
axes qui décrivent ta façon d'aimer et d'être proche :

- **le besoin de réassurance** (variable moteur **ANX**, 0-1) — alimenté par la dimension *anxiété* (6 items) ;
- **le besoin d'espace** (variable moteur **EVI**, 0-1) — alimenté par la dimension *évitement* (6 items).

Elle embarque aussi 8 items de **trame sécurité** dont les énoncés ne circulent pas dans ce
dépôt (doctrine de brûlage, FM-018 / Constitution [11-b]) :

- 4 items → signal **DTM_M** (méfiance projetée, glossaire [4]) — côté moteur uniquement ;
- 4 items → signal **RSQ** (sensibilité au rejet — pilote l'UX adaptative de l'app, jamais visible).

La quête est 🆓 gratuite, Monde M1 (Le Miroir). Ses sorties visibles : la **carte** (étage 1,
5 variantes) et le **miroir de quête** (étage 2, gabarit LOURD 300-450 mots). Les croisements
fins (signatures) opèrent au Portrait M1 (étage 3), jamais dans le miroir de quête seul.

## Lecture des fichiers

| Fichier | Ce que tu y trouves |
|---|---|
| `README.md` | Vue d'ensemble, déclaration de conformité, points comité |
| `01-tableau-des-items.md` | Les 12 items carte VERBATIM + les 8 lignes-réservées de trame + les 2 doublons fiabilité |
| `02-plan-de-melange-graine-212427.md` | L'ordre réel de passation (graine 212427) et les verdicts réels des 6 contraintes |
| `03-signatures-registre.md` | Les règles composées que les réponses alimentent (format du registre Monde 1) |
| `04-slots-de-miroir.md` | Ce que le miroir rend à l'utilisateur, et ses 9 verrous |
| `05-ecran-d-intro.md` | Le texte d'ouverture de la quête (verbatim) |
| `06-fiche-computation-EXEMPLE.yaml` | Le modèle de computation d'un item, canal par canal |
| `07-miroir.md` | Le miroir de quête (étage 2) — gabarit LOURD 300-450 mots, 8 briques + 3 croisées déclarées (ALA/IND/AMB) — créé VAGUE 4 |
| `cartes.yaml` | Les 5 cartes possibles et leur logique de sélection (charte, verbatim) |

## Le flux de la donnée

1. **Passation** — l'utilisateur voit les 20 items dans l'ordre du plan de mélange
   (graine 212427), jamais dans l'ordre des codes ; les trames passent inaperçues parmi les autres.
2. **Scoring** — Likert 5 (Arbitrage 2) ; les items I sont recodés `6 − réponse` (Arbitrage 1) ;
   moyennes par dimension → ANX et EVI effectives.
3. **Carte** — le sélecteur de la charte choisit 1 variante parmi 5 (`cartes.yaml`).
4. **Miroir** — 20 items → gabarit LOURD, 4 slots (`04-slots-de-miroir.md`), rappels en toutes
   lettres, ombre ≥ lumière.
5. **Signatures** — côté moteur : les conditions du registre Monde 1 se lisent dans
   `03-signatures-registre.md` ; la trame (DTM_M, RSQ) alimente la trame sécurité, sans aucune
   restitution.

## Trois points d'attention

- **Zéro fuite** : aucune formulation de trame n'existe dans ce dossier (verrou [11-b]).
- **Zéro métadonnée visible** : codes, scores et sigles ne franchissent jamais un texte rendu (Constitution [3]).
- **Décisions comité appliquées (FM-019)** : seuils et fenêtres proposés ADOPTÉS comme valeurs de
  départ — provisoire concepteur — re-signature professionnelle avant bêta · run max 4 borné
  ACCEPTÉ (note bêta : biais d'accordement) · c2 sans-objet : reste en attente.

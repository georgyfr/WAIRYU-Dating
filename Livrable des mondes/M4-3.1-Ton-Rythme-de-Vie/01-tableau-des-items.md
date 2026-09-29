# LIVRABLE 1 — LES 5 ITEMS DE LA QUÊTE 3.1 « TON RYTHME DE VIE »

> Légende de la fiche de computation condensée — `C:` carte · `S:` signal · `F:` fiabilité · `M:` modulation · `A:` ancrage.
> Échelle : Likert 5 niveaux (Arbitrage 2) · Orientation : D = direct, I = inversé recodé `6 − réponse` (Arbitrage 1).
> **Anti-normativité** : se lever tôt et se coucher tard = deux façons égales d'habiter la journée —
> les orientations D/I sont des directions techniques de l'axe matinalité, jamais des jugements.
> **2 paires R6 + 1 item pivot** · concept public (chronotype, rMEQ-inspired — Adan & Almirall 1991)
> nommé côté moteur uniquement — énoncés 100 % originaux Wairyu.
> **B.3 — production neuve déclarée** : le source gelé (`refonte des tests et outils wairyu.md`) porte
> le cadrage de la quête (« Ton rythme de vie », chronotype, 5 items, « Oiseau de nuit ou lève-tôt ?
> Ton pic d'énergie ») mais **aucun texte d'item Wairyu** — les 5 énoncés ci-dessous sont neufs
> (aucun verbatim à convertir ; l'audit machine B.3 n'y trouve aucune occurrence à tracer).

| Code (gelé) | Énoncé | Or. | Angle | Facette | ▲ (signal_id) | Fiche de computation — 5 canaux |
|---|---|---|---|---|---|---|
| Q3.1-01 | Je fonctionne au mieux quand le jour se lève. | **D** | le pic d'énergie | la forme du matin | — | C: matinalité→score de quête · S: SIG-3.1-01 (profil) · F: paire R6 avec 02 · M: SIG-3.1-02 (information conversationnelle, module sans pénalité) · A: rappel OK |
| Q3.1-02 | Je fonctionne au mieux quand le jour s'achève. | **I** | le pic d'énergie | la forme du soir | — | C: matinalité (recodé 6−r) · S: idem 01 · F: paire R6 avec 01 · M: idem 01 · A: rappel OK |
| Q3.1-03 | Sans réveil imposé, je me lève avec le soleil. | **D** | l'horloge libre | l'éveil spontané | — | C: matinalité→score · S: idem 01 · F: paire R6 avec 04 · M: idem 01 · A: rappel OK |
| Q3.1-04 | Sans réveil imposé, mes matinées s'étirent vers midi. | **I** | l'horloge libre | l'éveil sans contrainte | — | C: matinalité (recodé) · S: idem 01 · F: paire R6 avec 03 · M: idem 01 · A: rappel OK |
| Q3.1-05 | Les heures où le monde se calme sont mes heures fortes. | **I** | les heures calmes | le pivot du soir | — | C: matinalité (recodé) · S: idem 01 · F: pivot mono (sans miroir — voir ci-dessous) · M: idem 01 · A: rappel OK |

## L'item pivot Q3.1-05 — écart d'arithmétique documenté

La règle R6 (paires miroir 1 D + 1 I — traits déclaratifs stables) exige un nombre PAIR d'énoncés.
La quête en porte **5 (impair)** : la couverture R6 intégrale est arithmétiquement impossible sans
ajouter un 6ᵉ item (hors cadrage mission — interdit) ou sans en retirer un (perte du cadrage 5 items
du refonte). Décision de production : **2 paires R6 complètes (01×02 · 03×04) + 1 item pivot
(Q3.1-05)** dont la fiabilité repose sur la cohérence de l'axe (il porte le même recodage que les
autres items inversés) et sur le temps de réponse (QFI). L'écart d'arithmétique est documenté,
**À VALIDER PAR LE COMITÉ** (précédent 2.2 — écart d'arithmétique consigné, aucun énoncé réécrit).

## Usage moteur (lecture du cadrage — refonte)

> Score de matinalité = moyenne des 5 items (I recodés `6 − r`), normalisée 0-1
> (variable `CHRONO_D`). Il alimente **SIG-3.1-01** (le profil par blocs) et **SIG-3.1-02**
> (la compatibilité de rythme — écart entre deux profils = information conversationnelle :
> « vos meilleurs moments communs », la friction des agendas — jamais une pénalité dure).
> Le concept public (chronotype, rMEQ) et son sigle éventuel restent côté moteur — au rendu :
> le pic, l'horloge libre, les heures fortes, jamais « chronotype » ni « matinalité ».

## Décisions de composition documentées (domaine réservé [9] — propositions)

1. **La symétrie des paires** : 01/02 partagent la même charpente (« Je fonctionne au mieux quand
   le jour… ») — la paire miroir se lit comme deux photos du même moment, aucune ne le vaut mieux.
2. **L'horloge LIBRE (03/04)** : les deux énoncés écartent d'abord la contrainte (« sans réveil
   imposé ») — c'est le corps qui parle, pas l'agenda social ; l'oiseau de nuit n'y est jamais un
   déficit de discipline.
3. **Q3.1-04 « s'étirent vers midi »** : le matin long est décrit comme une façon d'habiter
   (l'étirement, pas la paresse) — le miroir nocturne reprend l'image en sa dignité.
4. **Q3.1-05 « où le monde se calme »** : le pivot décrit le soir comme une resource (le calme du
   monde), pas comme une inversion sociale ; formulation distinctive des paires 01-04 pour couvrir
   un angle complémentaire (les heures fortes vécues, pas seulement les heures de forme).
5. **Zéro horaire chiffré** : aucun énoncé ne porte d'heure (ni « 6 h », ni « minuit ») — le
   chronotype se déclare en expérience, pas en montre (les horaires varient trop selon les vies).
6. **Un·e (médian)** : aucun énoncé genré ; conformité C8 (aucun titre genré dans cette quête).

## Correspondance des angles (mission V9.A)

| Angle mission V9.A | Items porteurs | Lecture |
|---|---|---|
| le pic d'énergie (rMEQ-inspired) | Q3.1-01 · Q3.1-02 | la paire centrale — la forme du matin × la forme du soir |
| l'horloge libre (sleep timing) | Q3.1-03 · Q3.1-04 | le corps sans contrainte — l'éveil spontané × l'étirement vers midi |
| les heures calmes (le vécu du pic) | Q3.1-05 (pivot) | les heures fortes du soir vécues — angle complémentaire assumé |

## Contrôles mécaniques passés

| Contrôle | Résultat |
|---|---|
| ≤ 12 mots / énoncé (max constaté : 11) | ✅ |
| 1re personne, présent de l'indicatif | ✅ |
| Zéro double négation | ✅ |
| Zéro fréquence ambiguë | ✅ |
| Anti-normativité (aucun profil « meilleur » ; le soir n'est pas un défaut) | ✅ |
| Zéro horaire chiffré, zéro jargon (chronotype/rMEQ côté moteur) | ✅ 5/5 |
| Paires R6 : 2 complètes (01×02 · 03×04) + pivot 05 documenté | ✅ écart consigné — À VALIDER PAR LE COMITÉ |
| Aucun item de trame ▲, aucun énoncé réservé | ✅ n_trames = 0 |

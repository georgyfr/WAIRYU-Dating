# QUÊTE 4.4 (INVISIBLE) « BLESSURES ET AISANCE » — FICHE DE CADRAGE ET ARCHITECTURE D'INTÉGRATION

> Monde M5 « Ton Héritage » · Accès : **INVISIBLE — le bloc sans écran de quête** (précédent du
> contrat : le seul bloc sans session propre) · **22 items : 12 carte-bloc + 10▲**
> Codes gelés Q4.4-01 → Q4.4-12 (cartes) + Q4.4-T13 → Q4.4-T22 (trames, énoncés hors dépôt)
> Paires R6 : 5 complètes (01×02 · 04×05 · 07×08 · 09×10 · 11×12) + 2 pivots (03 · 06)
> Graine : **sans-objet** (aucune passation propre — ordinal 34 réservé non consommé)
> Source : Constitution v2.1 [5] · refonte (mutation « 4.4 = ex-4.2 [12 schémas] + ex-4.4 [10 FIS] —
> 22 items — alimente la protection, non affiché comme quête » ; PARTIE 4 : « Matrices de pièges
> systémiques + croisement FIS × attachement — P1.5 — Invisible ») · mission V10.D verbatim
> B.3 : **production neuve déclarée** — le cadrage vient de la mission V10.D et du refonte
> (5 schémas, FIS, méfiance-intimité), **aucun texte d'item** n'y figure.

## ⚠ QUÊTE INVISIBLE PAR DESIGN — l'architecture d'intégration

**Aucun écran de quête. Aucune passation autonome.** Les items passent **tissés dans le flux
des AUTRES quêtes du monde** (répartition seedée par le moteur — jamais une session 4.4).
Le dossier existe (métadonnées, scoring, signatures, interdits) — **PAS de 05-ecran-d-intro,
PAS de 02-plan propre, PAS de 07-miroir individuel, PAS de cartes.yaml** (exemptions gravées
ci-dessous). Le contenu éditorial du bloc vit dans le **PORTRAIT DE MONDE M5** (section
« Ton Héritage ») et dans les **matrices moteur** — jamais dans une interface de quête.

### La mécanique d'insertion (mission V10.D — exécutée et documentée)

> **Principe mission** : « les trames ▲ se répartissent DANS les passations existantes de
> 4.1-4.3 via une extension seedée documentée, jamais un re-tirage : la stabilité des graines
> déjà archivées prime. »
>
> **Constat Étape 0 V10** : la mission supposait 4.1-4.3 existantes avec plans archivés à
> étendre — **constat inverse** (aucune trace : aucun commit, aucun dossier, aucune graine
> archivée, aucune trame). **Le cadrage s'ajuste au constat** : les quêtes-hôtes sont
> produites DANS cette vague et naissent **avec** leurs trames — l'extension est
> **matérialisée à la création** (les configs d'hôte contiennent les trames ▲ dès l'origine ;
> positions seedées PAR LA GRAINE DE L'HÔTE ; contraintes ①-⑤ re-jouées PAR QUÊTE-HÔTE avec
> les trames ajoutées). **Aucune graine archivée n'ayant jamais existé, la règle de stabilité
> est trivialement satisfaite : zéro re-tirage, zéro borne déplacée.** La mécanique
> d'extension pour les vagues futures (hôtes préexistants) est spécifiée ci-dessous.

| Hôte | Trames hébergées | Positions (plan de l'hôte — réelles) | Contraintes re-jouées | Verdicts |
|---|---|---|---|---|
| **4.1 « Ton arbre relationnel »** (graine 241427) | Q4.4-T13, T14 (FIS) | **5 · 10** (blocs [5,5] — c3) | c1 stricte PASS · c2 PASS · c4 sans-objet arithmétique min 4 ATTEINT · c5 run 2 · c6 PASS | ✅ 6/6 |
| **4.2 « Où tu en es aujourd'hui »** (graine 242427) | Q4.4-T15 → T18 (FIS) + T19 → T22 (méfiance-intimité) | **3 · 6 · 9 · 12** (FIS) · **15 · 18 · 22 · 26** (MEFI) — blocs [3,3,3,3,3,3,4,4] | c1 stricte PASS · c2 PASS · **c4 PASS STRICT (0 déficit)** · c5 run 2 · c6 PASS | ✅ 6/6 |
| **4.3 « Ce que tes relations t'ont appris »** | **AUCUNE** — **insertion sans-objet par design** : la passation 4.3 = un seul écran ouvert (aucune séquence Likert où tisser sans casser l'indiscernabilité — règle Partie 0 n° 1 : même format de rendu) | — | — | sans-objet documenté |

**Spécification d'extension (vagues futures, hôtes préexistants)** : les trames d'un nouveau
bloc invisible entrent dans la `ci/quetes/{hôte}.json` de l'hôte avec `signal` posé ; le plan
de mélange de l'hôte est **re-calculé par le même outil dédié, même graine, contraintes
re-jouées** — si la borne d'une contrainte bouge (envergure libre réduite par les ancres), le
**nouveau minimum constructible est documenté au plan de l'hôte** (règle « jamais un verdict
non atteignable ») ; si le verdict strict devient infaisable, la déclaration sans-objet est
gravée avec sa démonstration. **Aucune graine n'est jamais re-tirée** (la graine pilote la
construction et les échanges — le re-calcul est déterministe et reproductible octet pour
octet, 5 passes). Le présent bloc 4.4 est le premier exercice de cette mécanique — exercé à
la création (constat), pas en extension (aucun plan antérieur n'existait).

## 🧭 FICHE DE CADRAGE

| Champ | Cadrage |
|---|---|
| **Ce que ça mesure** | **Les 12 carte-bloc — les schémas précoces** (concept public de la thérapie des schémas, formulations Wairyu) : **abandon (3)** · **carence affective (3)** · **méfiance (2)** · **assujettissement (2)** · **imperfection/exigence (2)**. Ce sont des **LECTURES CARTES** : elles nourrissent le portrait « blessures anciennes » du monde, **au ton bienveillant, sans label** — l'ombre de chaque schéma = son **coût en couple**, la lumière = sa **fonction passée de protection** (mission verbatim). **Les 10▲ — l'aisance dans l'intimité (FIS, 6)** : gêne quand la relation devient profonde, retrait à l'annonce de sentiments, protection par la distance + **la double lecture méfiance (4)** : la méfiance dans **l'intimité naissante** — angles distincts des trames T09-T12 de 1.2 (méfiance **projetée générale**), complémentaires par design. |
| **Orientation MIXTE OBLIGATOIRE** | Recommandation n° 8 : viser la **borne la plus basse constructible**, documenter l'arithmétique — appliquée : les 12 cartes portent 6 D / 6 I (chaque schéma lit des deux mains : D = le pattern, I = sa contrepartie recodée) ; les 10▲ restent **D** (règle des trames — franchité constante, précédents 2.1 · 3.3 · 3.4). |
| **Neutralité — le ton bienveillant** | **Aucun schéma n'est étiqueté** (interdit V10 : « abandon », « carence », « schéma », « assujettissement » ne quittent JAMAIS le moteur) ; **aucun parent n'est blâmé** (les patterns se décrivent présents, sans auteur) ; chaque schéma a une **lumière de protection** (la vigilance a tenu une maison, l'exigence a bâti, le pli a plu) — l'ombre porte le COÛT EN COUPLE, jamais une culpabilité. |
| **Format de réponse** | Likert 5 niveaux (Arbitrage 2) · D/I recodés `6 − r` (Arbitrage 1) · **5 paires R6 + 2 pivots** · **les 10▲ : dimension null, orientation D, ancrage INTERDIT, aucun slot, aucune citation** (document trames Partie 0) — elles vivent DANS les passations hôtes (4.1 · 4.2), codes propriété de 4.4. |
| **Mélange** | **SANS-OBJET AU NIVEAU QUÊTE** (pas de passation propre — ordinal 34 réservé non consommé) ; l'insertion chez les hôtes est **RÉELLE et archivée** (voir la table ci-dessus + les plans 4.1/4.2). |
| **Signatures attendues** | **SIG-4.4-01 → 05 — les 5 schémas** (niveaux bas/moyen/fort — **À VALIDER PAR LE COMITÉ**) · **SIG-4.4-06 — la matrice des pièges systémiques** (côté moteur : Abandon × Évitement [1.2] = pénalité forte · Carence × Narcissisme [DTM_N] = pénalité forte · **Méfiance × RSQ haut = protection** — le blessé est protégé, le stratège est neutralisé, doctrine établie · **FIS × évitement = renforcement de pénalité**). |
| **Slots prévus** | **AUCUN miroir individuel** (exemption — le contenu vit au portrait de monde M5 « Ton Héritage » + matrices) · **aucune carte partageable** (refonte : « — (aucune carte) ») · **aucun écran d'intro** (pas de session). |
| **Points de doctrine** | ① C'est du **matching, pas du portrait** : le bloc alimente la protection et le pool de découverte — jamais un portrait rendu au membre. ② Les 10▲ passent parmi les autres (indiscernabilité — règle Partie 0). ③ Les croisements de la matrice protègent : ils ne qualifient ni ne condamnent. ④ Gratuit ne présuppose jamais premium ([6]). |

## 📖 Lecture des fichiers (ordre conseillé)

1. `01-tableau-des-items.md` — les 12 énoncés carte-bloc (5 schémas) + les 10 lignes-réservées.
2. `03-signatures-registre.md` — les 5 schémas (niveaux) + la matrice des pièges systémiques.
3. `04-slots-de-miroir.md` — les exemptions (miroir, cartes, intro) + les slots du portrait.
4. `06-fiche-computation-EXEMPLE.yaml` — l'item Q4.4-01 au modèle carte-bloc.
5. `README.md` — vue d'ensemble.

## Table d'exemption (fichiers volontairement absents)

| Fichier | Statut | Fondement |
|---|---|---|
| `02-plan-de-melange-graine-*.md` | **ABSENT PAR DESIGN** | Pas de passation propre — l'insertion vit dans les plans des hôtes (4.1 · 4.2) ; ordinal 34 réservé |
| `05-ecran-d-intro.md` | **ABSENT PAR DESIGN** | Le bloc n'a pas d'écran — invisible par design (précédent du contrat) |
| `07-miroir.md` | **ABSENT PAR DESIGN** | Aucun miroir individuel — le contenu éditorial vit au PORTRAIT DE MONDE M5 (section « Ton Héritage ») et dans les matrices (mission V10.D) |
| `cartes.yaml` | **ABSENT PAR DESIGN** | Aucune carte partageable (refonte PARTIE 4 : « — (aucune carte) ») — les 12 « lectures cartes » nourrissent le portrait, elles ne se partagent pas |

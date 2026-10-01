# CONTRAT D'INVENTAIRE — v1.3

> **PROVENANCE (finding A.1, audit externe) : matérialisé post-audit.** Reconstitué depuis les
> documents de production publics et l'historique de travail. Les décisions portées par les
> fiches FM-001 à FM-012 (absentes du dépôt) sont récapitulées en annexe A. La version v1.3
> est la version citée par la Constitution [8] (« SOURCE UNIQUE ») et par les fichiers du
> dépôt — la numérotation de version est conservée telle qu'elle est référencée ; le contenu
> décrit est fidèle aux effets observables dans le dépôt et à l'historique de travail
> (mentions RECONSTITUTION, annexe A et §13.4).

---

## PARTIE 0 — OBJET, AUTORITÉ ET PÉRIMÈTRE

**0.1 — Objet.** Le présent contrat est l'inventaire normatif du questionnaire de la
plateforme Wairyu : la liste close des mondes, des quêtes, des items et des trames, avec
leurs décompts de contrôle. Il est la **SOURCE UNIQUE** au sens de la Constitution [8] : en
cas de divergence entre un document de production et le présent contrat, **le contrat gagne ;
on signale ; on ne corrige pas** (Constitution [8] — la divergence est signalée au comité).

**0.2 — Autorité.** Le contrat est versionné. Toute mutation du contenu (ajout, retrait,
recomptage d'un item ou d'une quête) passe par une fiche-mutation (rituel [10]) et incrémente
la version. Les corrections post-audit sont tracées dans la colonne « provenance » des
tableaux et en annexe B.

**0.3 — Périmètre.** Sont sous contrat : les 11 mondes, les 51 quêtes, les 570 items (540
items carte + 30 trame fiabilité), les trames sécurité (nombres déclarés au §13), les 35
signatures de registre. Sont HORS contrat (déclarés ailleurs) : les 60 trames de sécurité
formulées (document trames confidentiel, hors dépôt — règle 11-b), le plan freemium détaillé
(FM-012), la spécification produit (specification/).

**0.4 — Langue et lecture.** Le contrat s'écrit en français. Les décomptes s'entendent
items répondues au Likert (ou cases / choix / scénarios selon la quête), trames incluses
quand la quête en porte.

## PARTIE 1 — RÈGLES DE GOUVERNANCE (R1-R7)

*(RECONSTITUTION — les rédactions originales R1-R7 ont été perdues avec l'environnement
d'exécution ; les règles ci-dessous sont reconstituées depuis les effets observables dans le
dépôt — Constitution v2.1, CI matérialisée, fiches FM-013 à FM-027. Chaque règle cite son
porteur machine.)*

- **R1 — L'invariant compte ce qui EXISTE au contrat (design) ; la matérialisation mesure ce
  qui EXISTE en fichiers (production). Deux métriques, jamais confondues.** (porteur : CI-01 ;
  verdict comité FM-013 §5.)
- **R2 — Un code d'item n'est jamais réattribué** : les plages de codes sont gelées par
  quête ; la création n'étend une plage que par fiche-mutation. (porteur : CI-15, arbitrage ③.)
- **R3 — Toute quête matérialisée porte un manifeste de contrôle** (`ci/manifeste-quete/`)
  avec l'identité de la quête, la plage de codes gelée, les totaux internes et les empreintes
  sha256 de ses fichiers de contenu. La CI rejoue, elle ne lit pas les verdicts sur parole.
  (porteur : CI-02 à CI-07.)
- **R4 — Aucune formulation de trame n'entre dans un dépôt accessible publiquement** — sous
  peine de brûlage (règle 11-b). Les slots sécurité déclarés portent le placeholder officiel ;
  l'empreinte sha256 du placeholder est contrôlée en CI. (porteurs : CI-10, CI-16, garde
  étendue `ci/outils/garde_p0.py`.)
- **R5 — Une signature déclarée sans maison fichier reste au registre** (Voie B) — le total
  déclaré fait foi, l'orphelin est signalé, jamais effacé. (porteur : CI-14 ; verrou [9] sur
  chaque signature.)
- **R6 — Les seuils et les zones du moteur restent « À VALIDER PAR LE COMITÉ »** tant que la
  re-signature professionnelle n'a pas eu lieu ; le contrat ne grave jamais un seuil définitif
  seul. (porteur : verrous [9] dans les dossiers et registres.)
- **R7 — La consommation des réservas est canonique ou signalée** : une graine de mélange
  citée comme place hypothétique par une quête antérieure est soit consommée canoniquement
  (coordination consignée aux 02), soit signalée en collision au comité — jamais silencieuse.
  (porteur : notes de coordination M11 aux 02 des quêtes 7.2/7.3.)

## PARTIE 2 — LES INVARIANTS

| Invariant | Valeur | Porteur machine |
|---|---|---|
| Mondes | **11** (6 gratuits · 5 premium — Constitution [6]) | CI-01 |
| Quêtes | **51** | CI-01 |
| Items total | **570 = 540 carte + 30 trame fiabilité** (INCHANGÉ — matérialisation ≠ ajout) | CI-01 |
| Signatures | **35 = 30 M1 (déclarées, Voie B) + 1 M2 (SIG_CONTRIB) + 4 M3** | CI-01, CI-14 |
| Trames sécurité formulées | **60 hors dépôt** (document trames, Partie 11 pour T58-T60) | garde étendue |
| Trame fiabilité | **30** (18 désirabilité sociale + 8 over-claiming + 4 doublons longitudinaux) | CI-01 |
| Codes signaux | **14 (13 gelés du dictionnaire [4] + DE)** — contrôle de comptage réel : §13.3 | registre signaux.json |

## PARTIE 3 — L'ÉQUATION DE VÉRIFICATION CI

L'équation tranchée (FM-013 §5) et encodée dans `ci/test_contrat_inventaire.py` :

```
570  == 540 (carte) + 30 (trame fiabilité)                 → CI-01
 35  == 30 (M1 déclarées) + 1 (SIG_CONTRIB) + 4 (M3)       → CI-01, CI-14
matérialisées (quêtes)  ≤ 51                               → CI-01
items matérialisés      ≤ 570                              → CI-15
```

La CI complète compte **16 vérifications** (CI-01 à CI-16 — inventaire en annexe C). Elle
rejoue : invariants, manifestes (identité, plage gelée, empreintes sha256), structure des
items, mélange (6 contraintes rejouées, contrainte 5 comprise), slots anti-rendu, signatures
(verrou [9]), anti-orphelins, anti-doublons, placeholder 11-b, garde étendue 7 formats.

## PARTIE 4 — M1 « LE MIROIR » 🆓 (3 quêtes · 104 items)

| Quête | Titre | Items | Décomposition | Dossier |
|---|---|---|---|---|
| 1.1 | Ta personnalité | **58** | 50 carte (5 dimensions × 10) + 8▲ DTM_N (T01-T08) | M1-1.1-Ta-Personnalite |
| 1.2 | Ta façon de t'attacher | **20** | 12 carte + 4▲ DTM_M (T09-T12) + 4▲ RSQ (T13-T16) | M1-1.2-Facon-Tattacher |
| 1.3 | Tes émotions | **26** | 20 carte + 6▲ empathie (T21-T26) | M1-1.3-Tes-Emotions |
| | **Total M1** | **104** | | |

## PARTIE 5 — M2 « LE VOLANT » 🆓 (8 quêtes · 56 items)

| Quête | Titre | Items | Notes | Dossier |
|---|---|---|---|---|
| 1.4 | Ton contrôle sur toi-même | **8** | double usage DGR | M2-1.4-Ton-Controle |
| 1.5 | L'épreuve du temps ✂ | **6** | choix comportementaux | M2-1.5-Lepreuve-du-Temps |
| 1.6 | Ta façon de penser | **10** | 7 items + 3 énigmes | M2-1.6-Ta-Facon-de-Penser |
| 1.7 | Ton fonctionnement — opt-in | **2** | 2 cases | M2-1.7-Ton-Fonctionnement |
| 1.8 | Ton bien-être — opt-in, P3 | **9** | PHQ-9 (domaine public) — ⚠ DIFFÉRÉ COMITÉ, non matérialisé (§13.2) | — |
| 1.9 | Ton élan du moment | **8** | | M2-1.9-Ton-Elan-du-Moment |
| 1.10 | Ce que tu apportes | **10** | SIG_CONTRIB (registre M2.json) | M2-1.10-Ce-Que-Tu-Apportes |
| 1.11 | Es-tu prêt·e à rencontrer ? | **3** | quête-écran de passage | M2-1.11-Es-Tu-Pret-A-Rencontrer |
| | **Total M2** | **56** | matérialisé : 47 (1.8 différé) | |

## PARTIE 6 — M3 « LA BOUSSOLE » 🆓 (8 quêtes · 65 items)

| Quête | Titre | Items | Notes | Dossier |
|---|---|---|---|---|
| 2.1 | Tes valeurs | **24** | 20 carte + 4▲ DTM_N (pos 4·10·16·24) — seule quête au contenu machine matérialisé (FM-013) | M3-2.1-Tes-Valeurs + contenu/mondes/M3-boussole/2.1-valeurs |
| 2.2 | Ta place pour la spiritualité | **6** | | M3-2.2-Ta-Place-Pour-La-Spiritualite |
| 2.3 | Tes non-négociables | **10** | 9 cochables + 1 champ libre | M3-2.3-Tes-Non-Negociables |
| 2.4 | Tes réalités | **8** | | M3-2.4-Tes-Realites |
| 2.5 | Ce que tu cherches | **3** | 4ᵉ réponse « Je découvre » | M3-2.5-Ce-Que-Tu-Cherches |
| 2.6 | Tes priorités 5 ans | **5** | | M3-2.6-Tes-Priorites-5-Ans |
| 2.7 | Ta vision de la famille | **8** | | M3-2.7-Ta-Vision-de-la-Famille |
| 2.8 | Ton signe | **1** | hors score | M3-2.8-Ton-Signe |
| | **Total M3** | **65** | | |

## PARTIE 7 — M4 « TON TERRAIN » 🆓 (7 quêtes · 52 items)

| Quête | Titre | Items | Notes | Dossier |
|---|---|---|---|---|
| 3.1 | Ton rythme de vie | **5** | | M4-3.1-Ton-Rythme-de-Vie |
| 3.2 | Ton quotidien | **8** | | M4-3.2-Ton-Quotidien |
| 3.3 | Ton temps libre | **12** | + 3▲ (T-T09/T10/T11) | M4-3.3-Ton-Temps-Libre |
| 3.4 | Ton rapport à l'argent | **8** | + 2▲ (T-T07/T08) | M4-3.4-Ton-Rapport-a-lArgent |
| 3.5 | Ton entourage | **6** | | M4-3.5-Ton-Entourage |
| 3.6 | Le choix visuel ✂ | **8** | 8 paires | M4-3.6-Le-Choix-Visuel |
| 3.7 | Tes attirances | **5** | | M4-3.7-Tes-Attirances |
| | **Total M4** | **52** | | |

## PARTIE 8 — M5 « MON HISTOIRE » 🆓 (4 quêtes · 50 items)

| Quête | Titre | Items | Notes | Dossier |
|---|---|---|---|---|
| 4.1 | Ton arbre relationnel | **8** | génogramme (0 item compté) + 8 | M5-4.1-Ton-Arbre-Relationnel |
| 4.2 | Où tu en es aujourd'hui | **19** | 10 RB1 + 8 RSQ + 1 ouverte (Q4.2-19) — **corrigé post-audit (A.1) : la source historique disait 18** | M5-4.2-Ou-Tu-En-Es-Aujourdhui |
| 4.3 | Ce que tes relations t'ont appris ✂ | **1** | 1 ouverte | M5-4.3-Ce-Que-Tes-Relations-Tont-Appris |
| 4.4 | (invisible) Blessures et aisance | **22** | | M5-4.4-Blessures-Et-Aisance |
| | **Total M5** | **50** | | |

## PARTIE 9 — M11 « LE VOYAGE À DEUX » 🆓 (6 quêtes · 46 items)

| Quête | Titre | Items | Notes | Dossier |
|---|---|---|---|---|
| 8.1 | Les questions qui rapprochent | **36** | ordre fixe scénarique, révélation mutuelle | M11-8.1-Les-Questions-Qui-Rapprochent |
| 8.2 | Et toi, tu ferais quoi ? ✂ | **6** | dilemmes à choix forcé | M11-8.2-Et-Toi-Tu-Ferais-Quoi |
| 8.3 | Le refus ✂ | **3** | scénarios ▲ T58-T60 (hébergées, Partie 11 du document trames) | M11-8.3-Le-Refus |
| 8.4 | Le bonus ↑ | **1** | geste GEN | M11-8.4-Le-Bonus |
| 8.5 | Vibe Check / Voice Check | **0** | fonctionnalité (spécification) | M11-8.5-Vibe-Check-Voice-Check |
| 8.6 | Les services du rendez-vous | **0** | fonctionnalité (spécification) | M11-8.6-Les-Services-Du-Rendez-Vous |
| | **Total M11** | **46** | | |

## PARTIE 10 — M6 « MON CŒUR » 💎 (4 quêtes · 48 items) + M7 « FACE AUX TEMPÊTES » 💎 (3 quêtes · 36 items)

| Quête | Titre | Items | Dossier |
|---|---|---|---|
| 5.1 | Ton style amoureux | **18** | M6-5.1-Ton-Style-Amoureux |
| 5.2 | Ta vision de l'amour | **8** | M6-5.2-Ta-Vision-De-Lamour |
| 5.3 | Ton expression de l'affection | **10** | M6-5.3-Comment-Tu-Exprimes-Ton-Affection |
| 5.7 | Ton humour | **12** | M6-5.7-Ton-Humour |
| | **Total M6** | **48** | |
| 5.4 | Face aux désaccords | **23** | M7-5.4-Face-Aux-Desaccords |
| 5.5 | Quand la tension monte | **8** | M7-5.5-Quand-La-Tension-Monte |
| 5.6 | Après un désaccord | **5** | M7-5.6-Apres-Un-Desaccord |
| | **Total M7** | **36** | |

## PARTIE 11 — M8 « L'INTIME — L'ESSENTIEL » 💎 (2 quêtes · 36 items) + M9 « L'INTIME — LES PROFONDEURS » 💎 (3 quêtes · 23 items) — opt-in

| Quête | Titre | Items | Dossier |
|---|---|---|---|
| 6.1 | Ta vie intime — l'essentiel | **16** | M8-6.1-Ta-Vie-Intime-L-Essentiel |
| 6.2 | Ta relation au désir | **20** | M8-6.2-Ta-Relation-Au-Desir |
| | **Total M8** | **36** | |
| 6.3 | Ta carte des préférences | **14** | M9-6.3-Ta-Carte-Des-Preferences |
| 6.4 | Tes frontières modernes | **6** | M9-6.4-Tes-Frontieres-Modernes |
| 6.5 | Ton désir, ta définition | **3** | M9-6.5-Ton-Desir-Ta-Definition |
| | **Total M9** | **23** | |

## PARTIE 12 — M10 « MON MONDE » 💎 (3 quêtes · 24 items)

| Quête | Titre | Items | Notes | Dossier |
|---|---|---|---|---|
| 7.1 | Tes racines | **8** | 4 axes × 2 — trait ANCRAGE (moteur seul) | M10-7.1-Tes-Racines |
| 7.2 | Ton ouverture au monde | **8** | 4 axes × 2 — trait OUVERTURE (moteur seul) | M10-7.2-Ton-Ouverture-Au-Monde |
| 7.3 | La mixité et toi | **8** | 6 en mélange + 2 module opt-in vécu — matrice ANCRAGE × OUVERTURE | M10-7.3-La-Mixite-Et-Toi |
| | **Total M10** | **24** | | |

## PARTIE 13 — TOTAUX DE CONTRÔLE, DIFFÉRÉS ET VERROUS

**13.1 — Équation de clôture (constat machine, RAPPORT-FINAL-PRODUCTION.md).**

```
570 items au contrat
 = 540 items carte + 30 trame fiabilité (tissée, non matérialisée)
540 carte
 = 531 produits (dossiers livrés) + 9 différés (1.8 — PHQ-9)
531 produits · 50/51 dossiers · 11/11 mondes · 93,2 %
```

**13.2 — Les 39 différés (clarification Q5 de l'auditeur).** Le solde 570 − 531 = 39 se
décompose EXACTEMENT en deux familles de natures différentes — la confusion des deux serait
une erreur de lecture du contrat :

1. **9 items PHQ-9 (quête 1.8 « Ton bien-être »)** — items carte EXISTANTS au contrat mais
   NON MATÉRIALISÉS : la quête est différée par décision du comité (verrou : relecture
   professionnelle obligatoire avant mise en service ; retrait = lien ressources, zéro
   collecte — FM-019 §(4)). Porté par le contrat : OUI (les 9 items comptent dans les 570
   depuis l'origine). Porté par des fichiers : NON (aucun dossier — 1.8 est la 51ᵉ quête,
   seul dossier absent).
2. **30 trames de fiabilité** — items TISSÉS dans les quêtes porteuses (18 désirabilité
   sociale + 8 over-claiming + 4 doublons longitudinaux), comptés dans les 570 par nature,
   mais sans matérialisation fichier dédiée : leurs formulations vivent au document trames
   confidentiel hors dépôt (règle 11-b) et leurs slots sont déclarés dans les tableaux 01
   des dossiers porteuses. « Non matérialisées » signifie : pas de fichier items dédié —
   PAS : absentes du contrat.

**13.3 — Contrôle de comptage réel des codes signaux (finding A.8).** L'invariant « codes
signaux = 14 (13 gelés du dictionnaire [4] + DE) » est contrôlé par comptage RÉEL du fichier
`contrat/registres/signaux.json` — un registre vidé ou amputé rend la CI rouge (le contrôle
n'est plus cosmétique). Implémentation : §13.3 du test CI (CI-17).

**13.4 — Registres et fiches manquantes (findings A.2, A.3, A.7).** Les fiches FM-001 à
FM-012 sont reconstituées en annexe A (FM-028-RETROSPECTIVE). Les registres signatures/M1.json,
liaisons.json et dyades.json sont matérialisés sous `contrat/registres/`. L'écart
d'arithmétique du registre M1 (17 annoncées / 19 narratives = 32) reste EN ATTENTE DE
TRANCHAGE COMITÉ (Q4) — le contenu actuel est matérialisé tel quel, avec note.

## ANNEXE A — LES DÉCISIONS FM-001 → FM-012 (résumé)

Voir `contrat/fiches-mutation/FM-028-RETROSPECTIVE.md` — les 12 décisions fondatrices
(inventaire initial, renommage SDT→DTM, continuité Carte→Portrait, fusion des cartes 1.1,
canal signal + trame fiabilité, créations 1.10/1.11, Boussole du discernement, Miroir de
quête, versionnement salle-prompts, fission 8→11 mondes + table code→monde, plan freemium).

## ANNEXE B — LES CORRECTIONS POST-AUDIT (traçabilité)

| Finding | Correction | Porteur |
|---|---|---|
| A.1 | Matérialisation du présent contrat ; 4.2 = 19 (10 RB1 + 8 RSQ + 1 ouverte) ; Constitution [5] corrigée (M5 = 50 exact) | ce document |
| F.1 | Brûlage 11-b des 4 formulations DTM_N de 2.1 (+ v1 résiduelle + 2 citations FM-013) | FM-027 |
| D.3a | Zéro code d'item en zone rendue (M8-6.2 §1) | balayage_codes_rendu.py |
| D.4a-e | Interdits lexicaux rendus corrigés (5 + 2 hits résiduels) | balayage_interdits_rendu.py |

## ANNEXE C — INVENTAIRE DES 17 VÉRIFICATIONS CI

CI-01 invariants · CI-02 manifestes découverts · CI-03 identité manifeste · CI-04 empreintes
sha256 · CI-05 structure items · CI-06 mélange rejoué · CI-07 contrainte 5 · CI-08 slots
anti-rendu · CI-09 signatures verrouillées · CI-10 placeholder officiel DTM_N (FM-027) ·
CI-11 traçabilité · CI-12 registre M3 · CI-13 registre M2 · CI-14 anti-orphelins ·
CI-15 anti-doublons · CI-16 garde étendue 11-b (FM-027) · CI-17 comptage réel signaux.json
(A.8).

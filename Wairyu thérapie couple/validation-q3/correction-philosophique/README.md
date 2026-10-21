# WTC-Q3 — CORRECTION PHILOSOPHIQUE (fichier SUPPLÉMENTAIRE — RIO-03)

> **Ce que ceci est** : le fichier de correction demandé par le fondateur
> (même ordre que RIO-01 et RIO-02, trace 1a15ed7ad00bc0fd, exécution du
> 22/10 trace 1a15fdebd4c235a1) pour porter RIO-03 « Ce qui me porte » de
> 53/100 à 100/100 sur la grille de l'audit du 21/10 (Task 163), en ajoutant
> les calculs manquants **sans rien modifier d'existant**.
> **Ce que ceci n'est PAS** : une retouche du moteur. Le vrai cœur reste
> `../../validation-q3-r1/src/wtc_q3_core_r1.py` (révision R1, D-Q3-R1-A à H)
> — importé tel quel, intégrité vérifiée à l'import (banque F1-F6, 4 statuts
> journal, miroir D-Q3-R1-F, limite des 2). Les templates d'affichage des 6
> forces et de la SILENCIEUSE sont ceux du package R1 (D-Q3-R1-H), importés
> mot pour mot. Aucun moteur Q2/Q3/Q4/Q5 n'a été touché.

## La règle du jeu (demande fondateur — identique à RIO-01/RIO-02)

1. Ne pas modifier ce qui a été fait — uniquement ajouter des fichiers.
2. Mettre l'accent sur les CALCULS et l'exactitude des résultats.
3. Déceler sans nommer les pathologies (arbitrage Task 164) : présenter le
   problème avec son niveau de gravité, expliquer comment il peut affecter la
   relation et la vie de couple, proposer des pistes de solution.

## Contenu

| Fichier | Rôle |
|---|---|
| `src/wtc_q3_correction.py` | La couche de correction : importe les VRAIS moteurs (q3-r1 + templates réels, q2-r1 pour le palier, q4, q5) et ajoute F2 (« QUAND DEMANDER DE L'AIDE » — seuils S1/S2 sur le PLANCHER HÉRITÉ — + ombre héritée causale affichée), F3 (contenu des 3 paliers + branchement quête « pas » sur le vrai `selectionner_pas`), F4 (fragment de bilan L8 à 7 blocs). Règles R1-R9 pré-enregistrées en tête de fichier. |
| `src/wtc_q3_correction_validation.py` | Le pipeline de preuve : énumération EXHAUSTIVE de l'espace des états distincts de la couche (1 990 656 configurations — compactations c3/journal/h≥r PROUVÉES exhaustivement), miroir exhaustif 512×512, planche de monotonicité du plancher sur 211 200 états Q2 (dictionnaire espion), re-score bit-exact des 475 profils archivés R1, couplage pas 18/18, exécution ×2 (SHA-256). |
| `results/correction_criteres.json` | Les agrégats complets + les 8 critères COR1-COR8 + SHA-256 des 2 exécutions. |
| `results/rapport-correction-RIO-03.md` | Le rapport complet : règles, méthode, chiffres exacts, re-score F1-F4, limites honnêtes. |

## La particularité RIO-03 (consignée)

Le VRAI cœur Q3 ne calcule AUCUN palier — c'est la quête du positif (banque
fermée de 6 forces, 0 voie → SILENCIEUSE). La sévérité affichée est donc un
**PLANCHER HÉRITÉ** : le VRAI `palier` du cœur Q2 (validé P1 par la
correction RIO-02 sur 6 720 000 états) appelé avec les inconnues de RIO-03
posées à leur valeur la plus sûre (i_alarm = 0, H5 = 0). Le pipeline prouve :
(i) que ce palier ne lit que `comp["somme"]` (dictionnaire espion, 211 200
états) ; (ii) que `palier(ial, h5f) ≥ plancher` sur tout l'espace Q2 — le
plancher n'exagère jamais la sévérité, il peut seulement la sous-estimer ;
(iii) l'identité stricte aux états (ial = 0, H5 = 0). D-CRISE est NON
APPLICABLE à cet instrument (aucun i_alarm ni H5 dans ses entrées — consigné,
comme RIO-01).

## Résultat (tous critères PASS — détail dans le rapport)

- **COR1** fragment de bilan complet : 1 990 656/1 990 656 · 475/475 archivées
- **COR2** double chemin : forces indépendantes ≡ vrai cœur, 0 écart ·
  compactations prouvées (512 c3 · 4 096 journal · 160 h≥r + égalité pile) ·
  miroir 262 144/262 144 · plancher monotone 211 200/211 200 · clés lues ⊆ {somme}
- **COR3** seuils d'aide : S1/S2 sur le plancher · 0 borne pile (grille Q1) ·
  sondes ±ε cohérentes · bornes somme (0,30 pile inclus · 0,60 exclu)
- **COR4** vocabulaire écran : 0 mot interdit (textes + standings + templates
  réels + libellés cœur) · D-SIM 100 %
- **COR5** anti-fabrication : SILENCIEUSE ssi 0 voie · templates réels
  exactement pour les forces retenues · « rien à fabriquer » ssi ZONE CALME
- **COR6** re-score BIT-EXACT : 475 profils R1 régénérés par le VRAI
  simulateur ≡ CSV archivé (6 175 comparaisons, 0 écart) · couche appliquée
- **COR7** couplage pas : 18/18 via le vrai `selectionner_pas` · identité
  face Q5 ⇔ type Q4 12/12 · suivi 14 jours sans sanction 15/15 ·
  `long_termique` 4/4 · re-test 8 semaines (vrai `programmer_re_test_q1`)
- **COR8** reproductibilité : pipeline ×2, SHA-256 identiques

**Re-score** : RIO-03 = 53 % → **100 %** (F1 25 · F2 25 · F3 25 · F4 25).
Moyenne attachement (100+100+100+61+67)/5 = **85,6 %** · global 23 quêtes
1 755/23 = **76,3 %**.

## Exécution

```bash
# mode complet (~2 × 3 min, ×2)
python3 src/wtc_q3_correction_validation.py
# mode tronçonné (sandbox à fenêtre courte) — résultat identique :
# CORR_RUN=1|2 CORR_PART=l0c0…l5c3|rest1|rest2|rest3|rest4|merge puis CORR_PART=final
```

## Limites (lues avant toute décision)

Tout est validé en simulation (bandeau D-SIM sur chaque écran) — la limite
« zéro réel » de l'audit (VALID-01) reste vraie. Les empreintes réelles du
moteur Q5 mappent LES DEUX / ALARME SANS MAIN / SIGNAL LÉGER NON NOMMÉ vers
ZONE_CALME (vraie table `empreinte`, comportement archivé — repris tel quel,
aucune réécriture). Le plancher hérité est une borne BASSE : la sévérité
réelle de la quête 2 (avec i_alarm/H5) peut être plus haute — consigné à
l'écran et au bilan. Le récapitulatif de DIMENSION (fédération des fragments)
reste l'action n°2 de l'audit. Les libellés réels des questions restent à
déposer (action n°3).

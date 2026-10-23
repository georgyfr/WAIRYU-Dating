# WTC-Q4 — CORRECTION PHILOSOPHIQUE (fichier SUPPLÉMENTAIRE — RIO-04)

> **Ce que ceci est** : le fichier de correction demandé par le fondateur (trace 1a167755f324af9d) pour porter RIO-04 « Notre danse » (croisement de couple) de 61/100 à 100/100 sur la grille de l'audit du 21/10 (Task 163), en ajoutant les calculs manquants **sans rien modifier d'existant**.
> **Ce que ceci n'est PAS** : une retouche du moteur. Le vrai cœur du croisement reste `../../src/wtc_q4_core.py` (les 9 configurations nommées, les 9 templates mot pour mot, le VRAI `rendre_affichage`, la VRAIE `boucle_poursuite_retrait`) — importé tel quel, intégrité vérifiée à l'import. Aucun moteur Q4/Q5 n'a été touché.

## La règle du jeu (demande fondateur)

1. Ne pas modifier ce qui a été fait — uniquement ajouter des fichiers.
2. Mettre l'accent sur les CALCULS et l'exactitude des résultats.
3. Déceler sans nommer les pathologies (arbitrage Task 164) : présenter le problème avec son niveau de gravité, expliquer comment il peut affecter la relation et la vie de couple, proposer des pistes de solution.

## Contenu

| Fichier | Rôle |
|---|---|
| `src/wtc_q4_correction.py` | La couche de correction : importe les VRAIS moteurs (q4 croisement, q5 pas + suivi + re-test) et ajoute F2 (palier de couple 🟢🟠🔴 dérivé mécaniquement du VRAI croisement + seuils d'aide S1/S2), F3 (contenu des 3 paliers par configuration réelle + branchement quête « pas » pour CHACUN des deux partenaires via le VRAI `selectionner_pas` + suivi 14 j sans sanction + re-test 8 semaines), F4 (fragment de bilan L8 à 7 blocs niveau couple). Règles R1-R9 pré-enregistrées en tête de fichier. |
| `src/wtc_q4_correction_validation.py` | Le pipeline de preuve : compactations prouvées (stage 0), énumération EXHAUSTIVE des 139 392 configurations de l'espace de la couche (stage 1), re-score bit-exact des 800 paires archivées du pipeline P1 — simulateur seed 42 re-exécuté frais à chaque passage, D-REPRO (stage 2), couplage pas + suivi + re-test (stage 4), exécution ×2 (SHA-256). |
| `results/correction_criteres.json` | Les agrégats complets + les 9 critères COR0-COR8 + SHA-256 des 2 exécutions. |
| `results/rapport-correction-RIO-04.md` | Le rapport complet : règles, méthode, chiffres exacts, re-score F1-F4, limites honnêtes. |

## Résultat (tous critères PASS — détail dans le rapport)

- **COR0** compactations prouvées : écart/boucle déterministes 16/16 (7 valeurs, dist min au seuil 30 = 15 — jamais PILE) · frontière 2,61 jamais PILE (dist min 0,0011) · face ≡ type → pas ≡ (type, empreinte) sur la grille atteignable · espions clés parasites 16/16 · empreinte 6 variantes → 3 classes · table indépendante ≡ VRAI 16/16 · complétude L6 3×3 (144 cellules)
- **COR1** fragment de bilan complet : 139 392/139 392 + 800/800 archivées
- **COR2** palier : 2 chemins de calcul convergents 139 392/139 392
- **COR3** seuils d'aide : S1 ⇔ 🔴 exactement · S2 ⇔ 🟠 exactement · 0 seuil numérique ajouté (2,61 · 30 · 9 · 7 — tous du VRAI moteur)
- **COR4** vocabulaire écran : 0 mot interdit (2 listes) · D-SIM 100 % · direction de la boucle JAMAIS affichée · jamais de « tu » dans la phrase de boucle
- **COR5** anti-fabrication : « rien à fabriquer » ssi BASE_SEREINE · pct compatibilité None partout · avertissement de style ssi styles dissimulables (VRAI R4) · 9 templates réels mot pour mot
- **COR6** re-score bit-exact : 800 paires régénérées par le VRAI simulateur frais — agrégats bit-exact vs archive du 15/10 · FAIL strict C1 7/9 CONSERVÉ consigné (géométrie du style L6, zéro retouche) · pas représentatifs ≡ pas réels 800/800
- **COR7** couplage pas : 12/12 (type × empreinte) par partenaire via le VRAI moteur Q5 · suivi 15/15 sans sanction · re-test jamais forcé
- **COR8** reproductibilité : pipeline ×2, SHA-256 identiques

**Re-score** : RIO-04 = 61 % → **100 %** (F1 25 · F2 25 · F3 25 · F4 25). Moyenne attachement 85,6 % → **93,4 %** · global 23 quêtes 85,3 % → **87,0 %**.

## Exécution

```bash
python3 src/wtc_q4_correction_validation.py   # ~2 min (139 392 × 2 + 800 × 2)
```

## Limites (lues avant toute décision)

Tout est validé en simulation (bandeau D-SIM sur chaque écran) — la limite « zéro réel » de l'audit (VALID-01) reste vraie. Le FAIL strict C1 7/9 du package P1 est conservé tel quel (géométrie du style L6 documentée par le package lui-même — le VRAI moteur reste bit-exact avec la ré-implémentation indépendante 800/800 C2). Les percentiles restent des repères internes à la simulation (recalibrage VALID-01). Le récapitulatif de DIMENSION (fédération des fragments) reste l'action n°2 de l'audit. D-CRISE non applicable à cet instrument (consigné). Les libellés réels des 18 questions restent à déposer (action n°3).

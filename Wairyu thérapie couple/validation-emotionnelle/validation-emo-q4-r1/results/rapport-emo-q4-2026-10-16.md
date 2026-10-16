# Rapport de validation WTC-EMO-Q4 — « Nos deux langues » (RIO-09)

> AVERTISSEMENT D-SIM : résultats issus de simulations (seed 42) — la mécanique est validée, pas la prévalence clinique.

**Date** : 2026-10-16  
**Seed** : 42  
**Package** : validation-emo-q4/  
**Règles** : D-STD-2 (par config) · D-NOMENCLATURE (9 labels uniques) · D-VÉRITÉ (9/9) · D-DENSITÉ · C3 anti-verdict éliminatoire

---

## Section A — Les 5 critères

| Critère | Attendu | Obtenu | Verdict |
|---------|---------|--------|---------|
| **C1** 9 configurations (D-STD-2 par config) | 9/9 | 2/9 | ❌ FAIL |
| **C2** Symétrie p1×p2 = p2×p1 | 100 % | 100.0 % (450/450, 0 violation, 0 désaccord sim) | ✅ PASS |
| **C3** Anti-verdict (ÉLIMINATOIRE) | 0/0/0 | C3a=0 · C3b=0 · C3c=0 | ✅ PASS |
| **C4** SHA-256 ×2 | identiques | identiques | ✅ PASS |
| **C5** Affichage (templates + boucle ensemble + D-SIM + pas comparaison) | 4/4 | templates=✅ · ensemble=✅ · D-SIM=✅ · pas comparaison=✅ | ✅ PASS |

SHA-256 exécution 1 : `5c513d325839e25b2a49cd9bfa9ec3ff9782fd6e5d8b3384e43e81538b62e22e`
SHA-256 exécution 2 : `5c513d325839e25b2a49cd9bfa9ec3ff9782fd6e5d8b3384e43e81538b62e22e`

### C1 — Détail par configuration (D-STD-2)

| Configuration | N | Correct | % | Seuil | Verdict |
|---------------|---|---------|---|-------|---------|
| LANGUE COMMUNE | 50 | 41 | 82.0 % | 72 % | ✅ |
| DONNEUR NON CONVERTI (A) | 50 | 0 | 0.0 % | 77 % | ❌ |
| DONNEUR NON CONVERTI (B) | 50 | 0 | 0.0 % | 77 % | ❌ |
| LANGUE DORMANTE | 50 | 33 | 66.0 % | 67 % | ❌ |
| CROISÉE (À CONVERTIR) | 50 | 0 | 0.0 % | 62 % | ❌ |
| MIXTE POURSUITE | 50 | 10 | 20.0 % | 82 % | ❌ |
| MIXTE RETRAIT | 50 | 5 | 10.0 % | 82 % | ❌ |
| FEU CROISÉ | 50 | 42 | 84.0 % | 82 % | ✅ |
| ÉQUILIBRÉE MIXTE | 50 | 12 | 24.0 % | 57 % | ❌ |

---

## Section B — Matrice des devises (canaux × patterns par groupe)

La carte croisée de l'affection — 3 canaux × 6 patterns par groupe.

| Groupe | Paroles A | Paroles B | Temps A | Temps B | Contact A | Contact B |
|--------|-----------|-----------|---------|---------|-----------|-----------|
| LANGUE COMMUNE | ALIGNE | ALIGNE | SURPLUS | ALIGNE | SURPLUS | ALIGNE |
| DONNEUR NON CONVERTI (A) | ALIGNE | DEFICIT | SURPLUS | DEFICIT | ALIGNE | DEFICIT |
| DONNEUR NON CONVERTI (B) | DEFICIT | SURPLUS | DEFICIT | ALIGNE | RECIPROQUE | SURPLUS |
| LANGUE DORMANTE | DORMANT | DORMANT | DORMANT | DORMANT | DORMANT | DORMANT |
| CROISÉE (À CONVERTIR) | ALIGNE | ALIGNE | SURPLUS | DEFICIT | ALIGNE | DEFICIT |
| MIXTE POURSUITE | ALIGNE | SURPLUS | ALIGNE | RECIPROQUE | ALIGNE | DEFICIT |
| MIXTE RETRAIT | RECIPROQUE | ALIGNE | RECIPROQUE | ALIGNE | RECIPROQUE | ALIGNE |
| FEU CROISÉ | ALIGNE | ALIGNE | ALIGNE | ALIGNE | ALIGNE | ALIGNE |
| ÉQUILIBRÉE MIXTE | ALIGNE | RECIPROQUE | ALIGNE | MIXTE_LEGER | ALIGNE | ALIGNE |

---

## Section C — Statistiques par groupe vs bornes D-STD-2

D-PARAM rend le bruit comparable. Tout écart > 3 pts entre plafond mesuré 
et seuil documenté.

| Groupe | N | Correct | % | Seuil | Écart | Boucles | Explosives |
|--------|---|---------|---|-------|-------|---------|------------|
| LANGUE COMMUNE | 50 | 41 | 82.0 % | 72 % | +10.00 | 11 | 0 |
| DONNEUR NON CONVERTI (A) | 50 | 0 | 0.0 % | 77 % | -77.00 | 18 | 0 |
| DONNEUR NON CONVERTI (B) | 50 | 0 | 0.0 % | 77 % | -77.00 | 14 | 0 |
| LANGUE DORMANTE | 50 | 33 | 66.0 % | 67 % | -1.00 | 8 | 0 |
| CROISÉE (À CONVERTIR) | 50 | 0 | 0.0 % | 62 % | -62.00 | 10 | 0 |
| MIXTE POURSUITE | 50 | 10 | 20.0 % | 82 % | -62.00 | 11 | 2 |
| MIXTE RETRAIT | 50 | 5 | 10.0 % | 82 % | -72.00 | 5 | 2 |
| FEU CROISÉ | 50 | 42 | 84.0 % | 82 % | +2.00 | 48 | 44 |
| ÉQUILIBRÉE MIXTE | 50 | 12 | 24.0 % | 57 % | -33.00 | 10 | 3 |

![C1 par config](../figures/fig1_c1_par_config.png)

![Distribution configs](../figures/fig2_distribution_configs.png)

---

## Section D — 4 exemples tracés de bout en bout

### Exemple 1 — LANGUE COMMUNE (alignés sur 3 canaux)

- **Paire** : LANGUE COMMUNE #LANGUE COMMUNE_0
- **Config attendue** : LANGUE COMMUNE
- **Config obtenue (moteur)** : LANGUE COMMUNE (✅ correct)
- **Config sim (vérité croisée)** : LANGUE COMMUNE (✅)
- **Symétrie A↔B** : True (config_swap = LANGUE COMMUNE)
- **Devise A** : {'paroles': 'ALIGNE', 'temps': 'SURPLUS', 'contact': 'SURPLUS'}
- **Devise B** : {'paroles': 'ALIGNE', 'temps': 'ALIGNE', 'contact': 'ALIGNE'}
- **Boucle bids** : asymétrique=False (écart_A=1, écart_B=1)
- **Co-régulation** : paire_explosive=False
- **Template config** : > Vos deux langues se parlent — vous êtes alignés sur les trois canaux. C'est une richesse que peu de couples ont.

### Exemple 2 — DONNEUR NON CONVERTI (A) (surplus/déficit)

- **Paire** : DONNEUR NON CONVERTI (A) #DONNEUR NON CONVERTI (A)_0
- **Config attendue** : DONNEUR NON CONVERTI (A)
- **Config obtenue (moteur)** : ÉQUILIBRÉE MIXTE (❌ incorrect)
- **Config sim (vérité croisée)** : ÉQUILIBRÉE MIXTE (✅)
- **Symétrie A↔B** : True (config_swap = ÉQUILIBRÉE MIXTE)
- **Devise A** : {'paroles': 'ALIGNE', 'temps': 'SURPLUS', 'contact': 'ALIGNE'}
- **Devise B** : {'paroles': 'DEFICIT', 'temps': 'DEFICIT', 'contact': 'DEFICIT'}
- **Boucle bids** : asymétrique=False (écart_A=0, écart_B=0)
- **Co-régulation** : paire_explosive=False
- **Template config** : > Vos deux langues se répondent sur les canaux, avec quelques différences — c'est le paysage le plus courant des couples réels. À explorer, pas à corriger.

### Exemple 3 — FEU CROISÉ (les deux explosifs + boucle)

- **Paire** : FEU CROISÉ #FEU CROISÉ_0
- **Config attendue** : FEU CROISÉ
- **Config obtenue (moteur)** : FEU CROISÉ (✅ correct)
- **Config sim (vérité croisée)** : FEU CROISÉ (✅)
- **Symétrie A↔B** : True (config_swap = FEU CROISÉ)
- **Devise A** : {'paroles': 'ALIGNE', 'temps': 'ALIGNE', 'contact': 'ALIGNE'}
- **Devise B** : {'paroles': 'ALIGNE', 'temps': 'ALIGNE', 'contact': 'ALIGNE'}
- **Boucle bids** : asymétrique=True (écart_A=2, écart_B=2)
- **Co-régulation** : paire_explosive=True
- **Template config** : > Vous êtes tous les deux en dysrégulation explosive — c'est la paire la plus instable du projet. Ce n'est pas une faute, c'est une configuration qui exige des protocoles d'apaisement avant tout dialogue.

### Exemple 4 — ÉQUILIBRÉE MIXTE (la frontière)

- **Paire** : ÉQUILIBRÉE MIXTE #ÉQUILIBRÉE MIXTE_0
- **Config attendue** : ÉQUILIBRÉE MIXTE
- **Config obtenue (moteur)** : LANGUE COMMUNE (❌ incorrect)
- **Config sim (vérité croisée)** : LANGUE COMMUNE (✅)
- **Symétrie A↔B** : True (config_swap = LANGUE COMMUNE)
- **Devise A** : {'paroles': 'ALIGNE', 'temps': 'ALIGNE', 'contact': 'ALIGNE'}
- **Devise B** : {'paroles': 'RECIPROQUE', 'temps': 'MIXTE_LEGER', 'contact': 'ALIGNE'}
- **Boucle bids** : asymétrique=True (écart_A=1, écart_B=2)
- **Co-régulation** : paire_explosive=False
- **Template config** : > Vos deux langues se parlent — vous êtes alignés sur les trois canaux. C'est une richesse que peu de couples ont.

---

## Section E — Analyse du croisement

### Répartition des 9 configurations sur la population simulée

| Configuration | N | % |
|---------------|---|---|
| LANGUE COMMUNE | 121 | 26.9 % |
| DONNEUR NON CONVERTI (A) | 16 | 3.6 % |
| DONNEUR NON CONVERTI (B) | 17 | 3.8 % |
| LANGUE DORMANTE | 33 | 7.3 % |
| CROISÉE (À CONVERTIR) | 2 | 0.4 % |
| MIXTE POURSUITE | 10 | 2.2 % |
| MIXTE RETRAIT | 5 | 1.1 % |
| FEU CROISÉ | 43 | 9.6 % |
| ÉQUILIBRÉE MIXTE | 203 | 45.1 % |

- **Boucles des bids actives** : 135/450 (30.0 %)
- **Paires explosives** : 51/450 (11.3 %)

### Vérification de la borne D-STD-2

- Configurations atteignant leur seuil : **2/9**
- **7 configuration(s) sous le seuil** ❌ :
  - DONNEUR NON CONVERTI (A) : 0.0 % < 77 %
  - DONNEUR NON CONVERTI (B) : 0.0 % < 77 %
  - LANGUE DORMANTE : 66.0 % < 67 %
  - CROISÉE (À CONVERTIR) : 0.0 % < 62 %
  - MIXTE POURSUITE : 20.0 % < 82 %
  - MIXTE RETRAIT : 10.0 % < 82 %
  - ÉQUILIBRÉE MIXTE : 24.0 % < 57 %

![Boucles bids](../figures/fig3_boucles_bids.png)

![Paires explosives](../figures/fig4_paires_explosives.png)

---

## Section F — Signalements + D-NOMENCLATURE + fautes n°22/n°23

### D-NOMENCLATURE (nouvelle règle, faute n°23)

**Règle D-NOMENCLATURE** : *les labels de classification portent un 
nom unique, valable dans le moteur, le simulateur, les écrans et les 
documents — l'exécuteur vérifie cette unicité avant l'exécution 
(D-VÉRITÉ étendu).*

Application : 9 labels officiels harmonisés partout (moteur, simulateur, 
templates). D-VÉRITÉ vérifié AVANT exécution : 9/9 = 9/9 = 9/9, 
aucun orphelin. ✅

### Signalements clos

1. **S-EMO-Q4-1 (CLOS)** : `config_vraie` était un stub — code intégral 
   re-fourni par le superviseur (option A). Faute n°22 (récidive D-TRANSMISSION).

2. **S-EMO-Q4-2 (CLOS)** : labels moteur (7) ≠ labels table (9) — options D+E : 
   moteur étendu à 9 labels + noms harmonisés (D-NOMENCLATURE). Faute n°23.

### Règles appliquées

3. **D-STD-2** : plafond PAR CONFIGURATION (9 seuils, un par config).
4. **D-VÉRITÉ** : inventaire croisé 9/9 = 9/9 = 9/9, aucun orphelin.
5. **D-NOMENCLATURE** : noms uniques partout (moteur, simulateur, écrans).
6. **D-DENSITÉ** : héritée de Q3-R1 (symétrie des voies entre forces).
7. **D-PARAM** : σ = 0,60 spécifié, identique aux bornes D-STD.
8. **D-HIST** : vérification GitHub avant action. Aucune ré-exécution en double.

**Fautes d'orchestrateur cumulées : 23** (15 + n°15 bis D-HIST + n°16 D-TABLE forces 
+ n°18 D-VÉRITÉ + n°20 D-TRANSMISSION + n°21 D-DENSITÉ + n°22 récidive D-TRANSMISSION 
+ n°23 D-NOMENCLATURE).

---

## Section G — Verdict

### Verdict : **À CORRIGER**

### Note : **8/10**

- Critères : 4/5 validés, 1 FAIL

### Avertissement D-SIM

> AVERTISSEMENT D-SIM : résultats issus de simulations (seed 42) — la mécanique est validée, pas la prévalence clinique.

### RIO-09

RIO-09 **n'entre pas** au RIO — verdict À CORRIGER.

### Package prêt à publier

- Arborescence : `validation-emo-q4/{src,results,figures}`
- Rapport : `results/rapport-emo-q4-2026-10-16.md`
- Figures : `figures/fig{1,2,3,4}_*.png` (1920×1080, 150 DPI)
- Publication : `validation-emotionnelle/validation-emo-q4/`

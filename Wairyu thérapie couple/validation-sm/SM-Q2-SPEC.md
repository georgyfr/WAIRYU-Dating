# PROPOSITION SPEC — WTC-SM-Q2 « Ce que je porte pour toi » (RIO-12)

> **Document de spécification narrative — zéro code, zéro seuil chiffré.**
> D-CANAL : production locale après verrouillage.
> D-HIST : confrontation fondation v1.1 effectuée (voir §6).

---

## 1. Type de quête et rôle

**Q2 = MESURE de l'aidant** (comme Q1 mesure la détresse). Q2 mesure **ce que le partenaire aidant porte pour l'autre** — l'épuisement, la surimplication, l'hostilité (EE). C'est le miroir de Q1 : Q1 dit « ma détresse », Q2 dit « ce que je porte pour toi ».

**RIO-12 cible.** Constructs cités : cycle de Coyne (1976), EE (Brown 1972), Zarit (1980). Source interne : `programme wairyu couple.txt` ligne 101 — « | Psychologique | Santé mentale | Le cycle de Coyne, l'EE, l'aidant (Zarit), le contrôle coercitif | Les Deux Rives | ». Livrable : « Les Deux Rives » (ligne 133 du même fichier).

**E-SM-3 clôturé ici** : pointer interne exact = `programme wairyu couple.txt` ligne 101, tableau bloc Psychologique, dimension Santé mentale. Vérifiable publiquement dans le dépôt.

---

## 2. Architecture : bipartite (2 axes × 3 faces = 6 faces)

Q2 est **bipartite** (comme RIO-01 attachement), pas tripartite. Justification : l'aidant a deux axes naturels qui ne se réduisent pas à 3 sous-échelles :

- **Axe A « La charge que je porte »** — l'intensité du soutien que j'apporte
  - Face A1 « L'épuisement » — la fatigue physique et émotionnelle du soutien (Zarit)
  - Face A2 « La surimplication » — quand je prends trop en charge, je décide pour l'autre
  - Face A3 « L'hostilité » — la critique qui s'installe (EE — émotion exprimée)

- **Axe B « La frontière que je garde »** — comment je protège ma rive
  - Face B1 « Le retrait » — quand je me ferme pour me protéger
  - Face B2 « La culpabilité » — « si tu vas mal, c'est ma faute »
  - Face B3 « La réparation » — comment on se retrouve après une crise

**Total : 6 faces × 3 items = 18 items** (comme RIO-01). Échelle 5 points (D-ÉCHELLE 3,00).

**[Note verrouillage — éditée au commit du package]** : 4 items/face = **24 items** — à 3 items, σ_eff = 0,346 et la borne crise 4,0 + 3σ_eff = 5,04 dépasse le plafond 5,0 : géométrie infaisable (leçon E-SM-7/R2 documentée).

---

## 3. Mécanismes de tension (le « quoi se dérègle »)

- **Le cycle de Coyne** : le partenaire en détresse cherche du soutien → l'aidant répond → la réponse ne suffit jamais → l'aidant s'épuise → il se retire → le partenaire en détresse se sent abandonné → cherche plus de soutien. Q2 mesure le point de l'aidant dans ce cycle (A1 épuisement, A2 surimplication, A3 hostilité).

- **L'émotion exprimée (EE)** : la quantité de critiques, de surimplication émotionnelle ou d'hostilité que l'aidant exprime. Une EE élevée prédit la rechute. Q2 mesure A3 (hostilité) comme marqueur EE.

- **La surimplication (SM-A2)** : quand l'aidant prend le contrôle de la vie du partenaire en détresse (décisions, médicaments, isolement). C'est le point de bascule où le soin devient de la domination — **voie dédiée peuplée en Q2** (exigée depuis SPEC-11).

---

## 4. Voie dédiée SM-A2/aidant (exigée SPEC-11)

**Q2 peuplle les faces A** (A1, A2, A3) qui étaient mesurées en Q1 mais non classifiées (Q1 classifie sur faces D uniquement). En Q2, les faces A deviennent le **cœur de la classification**.

**Classification par dominance (5 labels)** :
- **STABLE** : les 3 faces A ≤ 2.5 (l'aidant n'est pas en charge excessive)
- **ÉPUISÉ** : A1 dominant (≥ 3.5) — l'aidant est fatigué mais présent
- **SURIMPLIQUÉ** : A2 dominant (≥ 3.5) — l'aidant prend trop en charge (voie SM-A2 peuplée)
- **HOSTILE** : A3 dominant (≥ 3.5) — l'EE est élevée, la critique s'est installée
- **MIXTE** : multiple faces hautes ou aucune dominance claire

**D-CRISE** : si A2 ≥ 4.0 (surimplication sévère = contrôle coercitif potentiel) → court-circuit, filet 3919/3114. **Seuil hérité de Q1 SM-C1 ≥ 4.0** (D-CRISE verrouillé).

**Mapping MIXTE vs faces-D (résolution audit 7d44b75)** : Q2 classifie sur les **faces A** (pas D). Q1 classifiait sur faces D. Les groupes G5_aidant et SURCHARGE_AIDANT attendent MIXTE en Q1 (parce que les faces A ne sont pas lues par le classificateur Q1) — en Q2, ces groupes sont **reclassés correctement** sur les faces A (ÉPUISÉ, SURIMPLIQUÉ, ou HOSTILE selon la dominance). Plus de MIXTE par défaut pour les profils aidant.

---

## 5. Les 6 critères Q2 (libellés EXACTS proposés)

| # | Critère | Exigence | Type |
|---|---------|----------|------|
| **C1** | D-VÉRITÉ : inventaire 6 faces × 3 items (18 items) + labels croisés moteur/simulateur | 18/18 + labels croisés | ÉLIMINATOIRE |
| **C2** | D-ÉCHELLE : moyenne 3,00 déterministe sur les 2 axes | déterministe | — |
| **C3** | D-CRISE : sensibilité 100 % + spécificité 100 % sur géométrie séparée (A2 ≥ 4.0), voies A2 ET H5 | 100/100 + H5 | ÉLIMINATOIRE |
| **C4** | SHA ×2 (D-EMPREINTE : SHA sur contenu, pas horodatage) | 2 valeurs brutes identiques | — |
| **C5** | Affichage des figures 4/4 | 4 figures 1920×1080 150 DPI | — |
| **C6** | 0 pas produit (Q2 = MESURE, pas transféré à Q5) | 0 fonction de prescription | — |

**Leçons appliquées** :
- F34 (critères Q5 collés sur Q1) → Q2 = MESURE, critères adaptés au type de quête
- E-SM-1 (contradiction non signalée) → clause de signal renforcée
- E-SM-2 (récidive C5) → C5 = « affichage des figures 4/4 » au libellé exact
- D-GÉOMÉTRIE : A2 = 4 items agrégés (σ_eff = 0.30), bande [3.10, 4.90] exclue (comme Q1-R3)

---

## 6. D-HIST : confrontation fondation v1.1

**Confrontation effectuée** :
- Fondation v1.1 (commit `7a5ea81`) : ne contient PAS de fondation SM (elle contient la fondation émotionnelle). La dimension SM a été spécifiée directement en SPEC-11-B1 (proposition narrative) puis verrouillée par le superviseur.
- Q1-R3 (commit `7d44b75`) : 9 faces (SM-D1/D2/D3, SM-A1/A2/A3, SM-C1/C2/C3) → Q2 reprend les 3 faces A (héritées de Q1, deviennent Axe A) et crée 3 faces B **NOUVELLES** (B1/B2/B3 — sans équivalent Q1, ancrage « La frontière co-étiquetée », ligne 133). Les faces C (SM-C1/C2/C3) restent en Q1 (contrat de soin) ; SM-C1 demeure voie héritée du D-CRISE. [Correction §6 : Q1-R3 n'a PAS de faces B — SUP-CRED-1]
- **E-SM-3 clôturé** : pointer interne = `programme wairyu couple.txt` ligne 101, vérifiable publiquement.

---

## 7. Pièges Q2 (plan de répartition)

| Piège | Rôle | Attendu |
|-------|------|---------|
| **SANS_CHARGE** | Profils sans aucune charge d'aidant (faces A basses, B basses) → STABLE | Anti-fabrication (comme SANS_DETRESSE en Q1) |
| **SURCHARGE_AIDANT** | Toutes faces A élevées (A1/A2/A3 ≥ 4) → ÉPUISÉ ou SURIMPLIQUÉ (test plafonds D-STD-2 par config). **Ce piège est chez lui en Q2** — il teste les faces A, pas D. | Plafonds D-STD-2 + D-CRISE si A2 ≥ 4.0 |
| **PERFECT** | 14/14 jours → CELEBRE sans flatterie | Anti-perfectionnisme (transféré à Q5) |
| **ZERO** | 0/14 jours → REPRISE sans condamnation | Anti-perfectionnisme (transféré à Q5) |

**Note** : PERFECT et ZERO testent le suivi 14 jours — ils appartiennent à Q5 (pas Q2 = MESURE). En Q2, seuls SANS_CHARGE et SURCHARGE_AIDANT sont présents (2 pièges, comme Q1-R3).

**État hérité du re-centrage R3** : SURCHARGE_AIDANT a SM-C1 = 1.0 en Q1-R3 (fix R2 pour éviter les faux positifs D-CRISE). En Q2, SURCHARGE_AIDANT a A2 = 4.0+ (surimplication sévère) → D-CRISE peut se déclencher par voie A2 (pas SM-C1). Le piège teste la **nouvelle voie A2** du D-CRISE.

---

## 8. D-DENSITÉ : 2 voies/force

Si Q2 comporte une banque de forces (pas certain — Q2 = MESURE, les forces sont en Q3), alors toutes les forces auront 2 voies max (voie A comportementale + voie C journal). Source : RIO-08 (Q3 émotionnel, faute n°21 D-DENSITÉ).

**Proposition** : Q2 = MESURE uniquement (pas de banque de forces). Les forces SM (F-S1 à F-S6) sont en Q3. Q2 produit la classification par dominance (5 labels) + D-CRISE.

---

## 9. Mapping RIO

| Quête | RIO | Rôle |
|-------|-----|------|
| Q1 « Ma détresse et la leur » | RIO-11 | Mesure la détresse (faces D) + D-CRISE (SM-C1) |
| **Q2 « Ce que je porte pour toi »** | **RIO-12** | **Mesure l'aidant (faces A+B) + D-CRISE (A2)** |
| Q3 « Ce que notre lien sait porter » | RIO-13 | Le positif : forces de résilience du couple face à la détresse |
| Q4 « Nos deux rives » | RIO-14 | Croisement : qui porte quoi, répartition de la charge |
| Q5 « Mon premier pas vers l'autre rive » | RIO-15 | Pas + suivi 14j + anti-perfectionnisme + re-test 8 sem |

---

## 10. Ce que j'attends du superviseur

**Verrouillage FIXÉ/LIBRE** :
- **FIXÉ** : 6 faces (A1/A2/A3/B1/B2/B3) × 3 items = 18 items · échelle 5 points · D-ÉCHELLE 3,00 · D-CRISE sur A2 ≥ 4.0 (4 items, σ_eff=0.30, bande [3.10, 4.90]) · 5 labels de classification · D-GÉOMÉTRIE (crise_vraie sur μ vrai) · 0 pas produit · voies SM-C1 et H5 (héritées Q1) + voie A2 (nouvelle Q2) · 2 pièges (SANS_CHARGE, SURCHARGE_AIDANT) · C1-C6 libellés exacts · D-DENSITÉ (si forces en Q3)
- **LIBRE** : corps des fonctions · noms internes des groupes · texte exact des templates · découpage en 3 fichiers

**Erratum registre à pousser avec ce commit SPEC** :
- Erratum 580 → 500 (leftover R2 dans rapport R3)
- E-SM-10 (nouveau) : erratum éditorial
- En-tête registre : « RIO-11 contresigné » (si le superviseur contresigne dans ce cycle)

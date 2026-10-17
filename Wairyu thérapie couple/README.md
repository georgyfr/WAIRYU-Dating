# Wairyu Thérapie Couple — Programme & Validation (hub de navigation)

> Point d'entrée de tout le programme WTC dans ce dépôt. Mis à jour le **17/10/2026** (REGISTRE-32 clôturé — RIO-11 contresigné).

---

## 📌 Document de référence officiel

**➡️ [`programme wairyu couple.pdf`](programme%20wairyu%20couple.pdf)** — version 2.0 du 15/10/2026

---

## 🗺️ Arbre de navigation

```
Wairyu thérapie couple/
├── README.md (hub)
├── programme wairyu couple.pdf · .txt
│
│  ═══ Dimension ATTACHEMENT (5/5 VALIDÉE) ═══
├── validation-q1/ · validation-q1-r1/
├── validation-q2/ · validation-q2-r1/
├── validation-q3/ · validation-q3-r1/
├── validation-q4/ · validation-q5/
│
│  ═══ Dimension ÉMOTIONNELLE (5/5 VALIDÉE) ═══
├── validation-emotionnelle/
│   ├── fondation/ · validation-emo-q1/ · validation-emo-q2-r1/
│   ├── validation-emo-q3-r1/ · validation-emo-q4-r3/ · validation-emo-q5/
│
│  ═══ Dimension SANTÉ MENTALE (RIO-11 contresigné) ═══
├── validation-sm/
│   ├── validation-sm-q1/ (R0) · validation-sm-q1-r1/ · validation-sm-q1-r2/
│   └── validation-sm-q1-r3/ (R3 VALIDÉ, en audit)
│
│  ═══ PILOTE RÉEL ═══
└── validation-valid-01/
```

---

## 🧭 Packages de validation

### Dimension ATTACHEMENT (RIO-01 à RIO-05)

| Package | RIO | Verdict |
|---|---|---|
| WTC-Q1 / Q1-R1 | RIO-01 « Comment je me raccroche » | ✅ VALIDÉE 6/6 |
| WTC-Q2 / Q2-R1 | RIO-02 « Ce qui m'effraie vraiment » | ✅ VALIDÉE 7/7 |
| WTC-Q3 / Q3-R1 | RIO-03 « Ce qui me porte » | ✅ VALIDÉE 7/7 |
| WTC-Q4 | RIO-04 « Notre danse » | ✅ VALIDÉE (option a) |
| WTC-Q5 | RIO-05 « Mon premier pas » | ✅ VALIDÉE 5/5 |

### Dimension ÉMOTIONNELLE (RIO-06 à RIO-10)

| Package | RIO | Verdict |
|---|---|---|
| WTC-EMO-Q1 | RIO-06 « Ma météo intérieure » | ✅ VALIDÉ 7/7 |
| WTC-EMO-Q2 / Q2-R1 | RIO-07 « Ce que je n'arrive pas à dire » | ✅ VALIDÉ |
| WTC-EMO-Q3 / Q3-R1 | RIO-08 « Ce que mon cœur sait faire » | ✅ VALIDÉ 8/8 |
| WTC-EMO-Q4 / Q4-R3 | RIO-09 « Nos deux langues » | ✅ VALIDÉ |
| WTC-EMO-Q5 | RIO-10 « Mon premier geste du cœur » | ✅ VALIDÉ 6/6 |

### Dimension SANTÉ MENTALE (RIO-11 contresigné)

| Package | RIO | Verdict |
|---|---|---|
| WTC-SM-Q1 / R1 / R2 / R3 | RIO-11 « Ma détresse et la leur » | ✅ Contresigné (R3 VALIDÉ 6/6, SHA bb2551dd…) |

### Pilote réel

| Package | Statut |
|---|---|
| WTC-VALID-01/01 | ⏳ En attente conseil clinique |

**Total : 11 instruments RIO validés + RIO-11 contresigné. 2 dimensions complètes.**

---

## 📏 Les règles permanentes

| Règle | Contenu | Origine |
|---|---|---|
| **D-STD** | Bornes calculées AVANT les critères, sur CODE réel. Seuils ≥ 3 pts sous plafond. | Q2-R1 · Q3-R1 |
| **D-STD-2** | Plafond PAR CONFIGURATION. | Q4 attachement |
| **D-Q3-J** | Bornes conditionnelles à la géométrie du simulateur. | Q3-R1 attachement |
| **D-ENV** | Tout handoff vérifie l'état réel de l'environnement cible. | Transfert superviseur |
| **D-HIST** | Vérifier l'état du dépôt GitHub avant toute mission. | Faute n°15 bis |
| **D-TABLE** | Voies d'activation identiques dans la table et le code. Étendue aux conditions de forces. | Q3 attachement · Q3 émotionnel |
| **D-VÉRITÉ** | Table de vérité = labels démontrés par l'arbre du moteur, et réciproquement. Inventaire croisé AVANT exécution. | Faute n°18 |
| **D-DENSITÉ** | Forces d'une banque à voies comparables (±1). | Faute n°21 |
| **D-NOMENCLATURE** | Labels à nom unique partout. | Faute n°23 |
| **D-GÉOMÉTRIE** | Écart des centres ≥ 3σ_eff des deux côtés du seuil. crise_vraie ancrée sur le paramètre vrai. Bande [seuil ± 3σ_eff] exclue du décompte C3 et rapportée en tableau de robustesse. σ_eff = propagation structurale item→face, jamais modification. | Arbitrage C3-R1 option 4 (SM-Q1) |
| **D-ÉCHELLE** | Seuils ancrés au milieu de l'échelle (3,00 pour 5 points). | Faute n°17 |
| **D-PARAM** | Bruit spécifié explicitement (σ = 0,60). Identique aux bornes D-STD. | Q1 émotionnel |
| **D-TRANSMISSION** | Code fourni re-vérifié après transmission. Si absent, l'exécuteur signale. | Faute n°20 |
| **D-TYPE** | Test d'exécutable avec données minimales avant implémentation. | Faute n°25 |
| **D-CANAL** | Code non transmis par IM gateway. Production locale. Vérification par SHA ×2 + rapport + inventaire. | Faute n°32 (pré-attrapée) |
| **D-CANAL-2** | Séquence : production → exécution ×2 → SHA ×2 → publication → message pointeurs → audit → contresignature. | Q5 émotionnel |
| **D-CANAL-3** | Secrets jamais par canal IM — renouvellement hors bande par le pont. | Q5 émotionnel |
| **D-EMPREINTE** | SHA-256 sur contenu des résultats, jamais sur horodatage. | Q5 émotionnel |
| **D-CRISE** | Court-circuit de crise AVANT l'arbre — filet 3919/3114. JAMAIS de pas de couple en crise. | Verrouillage SM |
| **D-Q2-1 / D-Q2-2 / D-Q2-H / D6 / D7** | (Voir registre précédent) | Q1-Q2 attachement |
| **Exécuteur strict** | Signale sans corriger — toute correction est de l'orchestrateur. | Permanent |

---

## 📊 Fautes d'orchestrateur

**Total : 35 fautes (dont 3 pré-attrapées).**

Fautes 1-15 : cycles d'attachement. Fautes 15 bis à 35 : cycles émotionnels, transfert superviseur, dimension Santé mentale.

---

## 📋 Signaux documentés (REGISTRE-32 clôturé)

| Signal | Description | Statut |
|---|---|---|
| E-EMO-Q5-1 | C5 reformulé sans signal préalable — matériau présent | ✅ Clôturé |
| E-EMO-Q5-2 | Publication avant contresignature, SHA absents — compensé par audit public | ✅ Clôturé |
| E-SM-1 | Critères Q5 sur quête de mesure, contradiction non signalée | ✅ Clôturé (R1) |
| E-SM-2 | Reformulation récidive C5 — matériau présent | ✅ Clôturé |
| E-SM-3 | Source interne non citée ; pointer exigé au verrouillage Q2 | ⏠ En attente Q2 |
| E-SM-4 | SHA unique au message pointeurs — réparé R2 | ✅ Clôturé |
| E-SM-5 | Réconciliation non présentée (R2) — résolue R3 | ✅ Clôturé |
| E-SM-6 | Voie H5 non peuplée (R2) — résolue R3 (G7 20/20) | ✅ Clôturé |
| E-SM-7 | Source circulaire n=4 — levé R3 (définition instrument) | ✅ Clôturé |
| E-SM-8 | Réconciliation fermante non déclarée (R2) — levé R3 | ✅ Clôturé |
| E-SM-10 | Erratum éditorial 580 → 500 (leftover R2 dans rapport R3) | ✅ Clôturé par le présent commit |
| E-SM-9 | 2 réclamations fausses sur 6 au message pointeurs R3 | ✅ Clôturé par le présent commit |

---

## ⚙️ Méthode commune

- Exécution **seed 42 ×2** avec SHA-256 ;
- Rapport **7 sections A-G** ;
- Signalements sans correction libre ;
- **D-CANAL** : production locale → exécution ×2 → SHA ×2 → publication → message pointeurs → audit → contresignature.

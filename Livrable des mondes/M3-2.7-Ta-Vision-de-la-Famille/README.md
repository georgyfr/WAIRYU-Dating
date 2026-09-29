# QUÊTE 2.7 « TA VISION DE LA FAMILLE » — LIVRABLES DE PRODUCTION

> **Monde** : M3 — La Boussole · **Statut** : 🆓 gratuit · **Catégorie** : Socle · **Phase** : MVP
> **Domaine** : quête Socle M3 — croisements 2.6 × 2.7 autorisés ici (même monde, quêtes Libre) ;
> liaisons M1×M2 au Portrait de Domaine
> **Items** : 8 items Likert — 4 angles × paires miroir (1 D + 1 I, règle R6)
> **Plage de codes gelée** : Q2.7-01 → Q2.7-08
> **Cadre** : Constitution v2.1 [5] (« 2.7 Ta vision de la famille (8) ») · Contrat d'Inventaire
> (« Enfants, horizon, rôles — **Dealbreaker parentalité : score = 0 si divergence ≥ 2** ») · FM-011 v2

## 📁 Contenu du livrable (10 fichiers)

| Fichier | Livrable |
|---|---|
| `00-README.md` | Fiche de cadrage (4 angles, dealbreaker moteur, doctrine des 3 profils) |
| `01-tableau-des-items.md` | Les 8 énoncés (D/I, angles, fiches condensées) + décisions de composition |
| `02-plan-de-melange-graine-237427.md` | Mélange RÉEL (graine 237427, 6/6, 5 échanges, run max 2) |
| `03-signatures-registre.md` | SIG-2.7-01 (dealbreaker, SQL pré-filtrage proposé) + SIG-2.7-02 (horizon > 4 ans) |
| `04-slots-de-miroir.md` | Miroir MOYEN (3 slots) + 9 verrous (le dealbreaker ne se raconte jamais) |
| `05-ecran-d-intro.md` | Écran d'intro VERBATIM mission (« les sujets qu'on évite au début… ») |
| `06-fiche-computation-EXEMPLE.yaml` | Q2.7-01 aux 5 canaux (dealbreaker, paire R6, double balise) |
| `07-miroir.md` | 3 profils respectés (berceau / porte / route), MOYEN 150-250 mots |
| `cartes.yaml` | 3 variantes : Le·La Berceau qui attend · Le·La Porte entrouverte · Le·La Route à deux |
| `README.md` | Le présent fichier |

## ✅ Déclaration de conformité (interdits absolus)

| Interdit absolu | Statut |
|---|---|
| Dimensions non listées | ✅ les 4 angles sont nommés et bornés (désir · horizon · rôles · cadre) |
| Items non demandés | ✅ 8 exactement (Constitution [5]) |
| Format d'échelle changé | ✅ Likert 5 (Arbitrage 2) — paires R6 complètes, orientation conforme à `ci/quetes/2.7.json` |
| Dealbreaker exposé | ✅ jamais — mécanisme moteur silencieux (SQL pré-filtrage) : aucune trace chez l'un ni chez l'autre, aucun mot « dealbreaker » rendu (vérifié machine sur les 10 fichiers) |
| Données jugées moralement | ✅ trois vies dignes (désir / indécision / absence) ; ferme-doux sans vertu ; « domaine attitré » décrit, pas jugé |
| Sigle hors glossaire [4] | ✅ DESIR, HORIZON, ROLES, CADRE, SIG-2.7-* restent moteur |
| Code/score/sigle au rendu | ✅ aucun — rappels en toutes lettres, horizon en proximité relative (jamais d'années) |
| Verrous [9] traités comme décisions | ✅ règle du dealbreaker = contrat (non re-votée) ; opération SQL, seuil 4 ans et mapping score→années : PROPOSITIONS |
| Trames au dépôt (règle 11-b) | ✅ aucune trame — quête déclarative directe (n_trames = 0) |

## ⚠️ Points en attente de validation comité

- Opération SQL exacte du pré-filtrage (la règle « divergence ≥ 2 » appartient au contrat) · seuil
  « > 4 ans » et mapping score → fourchette d'années · formulation des amorces conversationnelles
  « à aborder tôt » · bornes de sélection des cartes (FM-019, provisoires) · gabarit « slots ∝
  densité » · fenêtres de recalcul.

## 🔁 Circuit restant

Production (fait) → **validateur (linter)** → **auditeur hostile C1 (session séparée)** → **gouvernance D1**.

## TABLE DE FICHIERS (format P1 — livraison VAGUE 6, LOT 7)

═══ FICHIER : Livrable des mondes/M3-2.7-Ta-Vision-de-la-Famille/00-README.md ═══
(fiche de cadrage)
═══ FIN FICHIER ═══

═══ FICHIER : Livrable des mondes/M3-2.7-Ta-Vision-de-la-Famille/01-tableau-des-items.md ═══
(8 énoncés + décisions)
═══ FIN FICHIER ═══

═══ FICHIER : Livrable des mondes/M3-2.7-Ta-Vision-de-la-Famille/02-plan-de-melange-graine-237427.md ═══
(mélange réel 237427)
═══ FIN FICHIER ═══

═══ FICHIER : Livrable des mondes/M3-2.7-Ta-Vision-de-la-Famille/03-signatures-registre.md ═══
(SIG-2.7-01 + SIG-2.7-02)
═══ FIN FICHIER ═══

═══ FICHIER : Livrable des mondes/M3-2.7-Ta-Vision-de-la-Famille/04-slots-de-miroir.md ═══
(slots + verrous)
═══ FIN FICHIER ═══

═══ FICHIER : Livrable des mondes/M3-2.7-Ta-Vision-de-la-Famille/05-ecran-d-intro.md ═══
(écran d'intro verbatim)
═══ FIN FICHIER ═══

═══ FICHIER : Livrable des mondes/M3-2.7-Ta-Vision-de-la-Famille/06-fiche-computation-EXEMPLE.yaml ═══
(Q2.7-01 aux 5 canaux)
═══ FIN FICHIER ═══

═══ FICHIER : Livrable des mondes/M3-2.7-Ta-Vision-de-la-Famille/07-miroir.md ═══
(3 profils MOYEN)
═══ FIN FICHIER ═══

═══ FICHIER : Livrable des mondes/M3-2.7-Ta-Vision-de-la-Famille/cartes.yaml ═══
(3 variantes C1-C11)
═══ FIN FICHIER ═══

═══ FICHIER : Livrable des mondes/M3-2.7-Ta-Vision-de-la-Famille/README.md ═══
(vue d'ensemble + conformité + table)
═══ FIN FICHIER ═══

# QUÊTE 1.4 « TON CONTRÔLE SUR TOI-MÊME » — LIVRABLES DE PRODUCTION

> **Monde** : M2 — Le Volant · **Statut** : 🆓 gratuit · **Catégorie** : Socle · **Phase** : MVP
> **Domaine** : DOMAINE DU SOI (les liaisons M1×M2 vivent au Portrait de Domaine, jamais ici)
> **Items** : 8 items carte, **mono-dimension** `autocontrole` (4 D + 4 I) — **AUCUNE trame ▲ dans cette quête**
> **Plage de codes gelée** : Q1.4-01 → Q1.4-08 (+ doublon longitudinal `Q1.4-01.r`)
> **Cadre** : Constitution v2.1 · source gelé « refonte des tests et outils wairyu.md » PARTIE 4 (l. 2424-2444) · charte des cartes PARTIE 4 (l. 2985-3087)
> ⚠ **Codes Q1.4 vivent au M2** : le code reste la clé, le monde est une métadonnée (FM-011 v2) — d'où le nom de dossier `M2-1.4-Ton-Controle`.

## 📁 Contenu du livrable (9 fichiers)

| Fichier | Livrable |
|---|---|
| `00-README.md` | Fiche de cadrage de production : restitution [10], cadrage (dimensions/format/signatures/slots), ambiguïtés signalées |
| `01-tableau-des-items.md` | Les 8 items VERBATIM : code gelé, énoncé, orientation D/I, dimension, facette, fiche de computation à 5 canaux + usage moteur + doublon |
| `02-plan-de-melange-graine-214427.md` | Plan de mélange : graine 214427, ordre de passation RÉEL (rejeu vérifié), verdicts réels 6/6, c1/c4/c5 sans-objet documentés |
| `03-signatures-registre.md` | Variables fournies (AC_D, AC_B, EC) · SIG_COH_HAUTE / SIG_COH_DIV · règle de silence EC · SIG_DGR_PRECURSEUR **sans ses seuils** |
| `04-slots-de-miroir.md` | Slots de miroir alimentés — gabarit MOYEN 150-250 mots (Constitution [7]) |
| `05-ecran-d-intro.md` | Écran d'intro (texte VERBATIM du source, contrôles de conformité) |
| `06-fiche-computation-EXEMPLE.yaml` | Fiche de computation complète de Q1.4-01 — modèle des 5 canaux, YAML |
| `cartes.yaml` | Les 5 variantes de carte (sélecteur + textes VERBATIM, charte PARTIE 4) |

## ✅ Déclaration de conformité (interdits absolus)

| Interdit absolu | Statut |
|---|---|
| Dimensions non listées | ✅ une seule : `autocontrole` (8/8) — rien d'autre |
| Items non demandés | ✅ 8 exactement, énoncés VERBATIM du source gelé |
| Formulations de trame au dépôt (FM-018 / [11-b]) | ✅ la quête ne contient **aucun** item de trame ▲ — aucun énoncé réservé n'est cité |
| **Seuils de signature de sécurité au dépôt** | ✅ **SIG_DGR_PRECURSEUR (n° 32) : conditions et seuils ABSENTS de tous les fichiers** — « document trames, hors dépôt, canal privé » (cf. `03-signatures-registre.md`) |
| Sigle hors glossaire [4] en UI | ✅ AC_D / AC_B / EC / DGR / IMP_B : côté moteur uniquement, jamais rendus à l'utilisateur |
| Verrous [9] traités comme décisions | ✅ tout seuil (sélecteurs de carte, SIG_COH_*, fenêtres) **ADOPTÉ comme valeur de départ** (décision comité, FM-019) — « provisoire concepteur — re-signature professionnelle avant bêta » |
| Codes/scores/sigles rendus à l'utilisateur [3] | ✅ aucun — rappels en toutes lettres uniquement |

## ⚠️ Points en attente de validation comité

- **SIG_DGR_PRECURSEUR** : les conditions et seuils exacts (deux variables, deux seuils) sont consignés au document trames — hors dépôt, canal privé. Le présent livrable les omit VOLONTAIREMENT.
- Seuils des sélecteurs de carte (0.75 / 0.60 / 0.45 / 0.30) : propositions du source gelé — ADOPTÉS comme valeurs de départ (FM-019) : provisoire concepteur — re-signature professionnelle avant bêta.
- Conditions de SIG_COH_HAUTE (EC ≤ 0.15) / SIG_COH_DIV (EC ≥ 0.30), garde QFI ≥ 0.60, pondération interne 0.6/0.4 de la règle de silence : ADOPTÉES comme valeurs de départ (FM-019) — provisoire concepteur — re-signature professionnelle avant bêta.
- Usage moteur « courbe J+90 » (le comportement prime progressivement sur le déclaratif) : calendrier et pondération À VALIDER PAR LE COMITÉ.
- **Tension documentaire signalée** : le doublon `Q1.4-01.r` fait partie de la trame fiabilité (4 doublons longitudinaux) ; son énoncé est reproduit ici sur instruction explicite de la mission (« doublon Q1.4-01.r autorisé »). Le comité arbitre la frontière exacte de [11-b] pour la classe des doublons.

## 🔁 Circuit restant

Production (fait) → **validateur (linter)** → **auditeur hostile C1 (session séparée)** → **gouvernance D1**.

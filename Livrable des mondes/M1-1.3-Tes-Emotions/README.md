# QUÊTE 1.3 « TES ÉMOTIONS » — LIVRABLES DE PRODUCTION

> **Monde** : M1 — Le Miroir · **Statut** : 🆓 gratuit · **Catégorie** : Socle · **Phase** : MVP
> **Domaine** : DOMAINE DU SOI (les croisements M1×M2 vivent au Portrait de Domaine, jamais ici)
> **Items** : 26 = 20 items carte (6 perception + 7 régulation + 7 expression) + 6 items ▲ de trame (4 DE_U + 2 DE_C inversés ↩)
> **Doublons fiabilité** : 2 autorisés (`Q1.3-01.r`, `Q1.3-12.r`) — hors passation, fenêtre ≥ 2 semaines ⚠
> **Plage de codes gelée** : Q1.3-01 → Q1.3-20 (carte) · Q1.3-T21 → Q1.3-T26 (trames) · Q1.3-01.r / Q1.3-12.r (doublons)
> **Cadre** : Constitution v2.1 (amendée FM-018) · source gelé « refonte des tests et outils wairyu.md » PARTIE 3 (lignes 2367-2422) · charte des cartes PARTIE 3 (lignes 2862-2985) · registre des signatures Monde 1

## 📁 Contenu du livrable (9 fichiers)

| Fichier | Livrable |
|---|---|
| `00-README.md` | Guide de lecture 1 page : rôle de la quête, lecture des fichiers, flux de la donnée |
| `01-tableau-des-items.md` | Les 26 items : 20 carte VERBATIM (orientation, dimension, facette, paire) + 6 lignes-réservées de trame + 2 doublons fiabilité |
| `02-plan-de-melange-graine-213427.md` | Plan de mélange : graine seedée 213427, outil déterministe, ordre de passation 1→26, verdicts RÉELS des 6 contraintes, run max 2, trace complète |
| `03-signatures-registre.md` | Signatures consommant P/R/X (conditions verbatim du registre Monde 1) + fonction Dark Empathy mentionnée SANS ses seuils |
| `04-slots-de-miroir.md` | Slots du miroir LOURD (26 items ≥ 15 → 300-450 mots) : ancre_item en champ moteur, citations en toutes lettres, 9 verrous |
| `05-ecran-d-intro.md` | Écran d'intro VERBATIM + contrôles de conformité |
| `06-fiche-computation-EXEMPLE.yaml` | Fiche de computation complète d'un item (Q1.3-12, régulation, I) — modèle des 5 canaux |
| `cartes.yaml` | Les 6 variantes de carte de la charte, VERBATIM, avec logique de sélection |

## ✅ Déclaration de conformité (interdits absolus)

| Interdit absolu | Statut |
|---|---|
| Dimensions non listées | ✅ aucune — perception, régulation, expression seules (source gelé), rien d'autre |
| Items non demandés | ✅ 26 exactement (20 carte + 6 trame) + 2 doublons fiabilité autorisés |
| Format d'échelle changé | ✅ Likert 5 verrouillé (Arbitrage 2) |
| Sigle hors glossaire [4] | ✅ DE_U et DE_C vivent côté moteur (registre des variables du Monde 1) — jamais en UI |
| Verrous [9] traités comme décisions | ✅ seuils, fenêtres et conditions **ADOPTÉS comme valeurs de départ** (décision comité, FM-019) — marqués « provisoire concepteur — re-signature professionnelle avant bêta » |
| **FM-018 / Constitution [11-b]** — fuite de formulation de trame | ✅ **ZÉRO FUIE** : T21-T26 = lignes-réservées (codes + signal + positions au mélange uniquement, énoncés hors dépôt) |
| Fonction Dark Empathy sans ses seuils | ✅ mentionnée en une ligne (« conditions et seuils hors dépôt ») — aucune condition composée reproduite |
| Fidélité au source gelé | ✅ énoncés carte et cartes VERBATIM — 3 énoncés > 12 mots documentés en « Dérives documentées » |
| Restitution des trames | ✅ aucun slot, aucune citation, aucun rappel — la trame sécurité n'a pas d'étage de restitution (Constitution [2]) |

## ⚠️ Points en attente de validation comité

- **c2 sans-objet documenté** : c2 × c4 combinées infaisables (note de config gravée, voir `02`) — À VALIDER PAR LE COMITÉ.
- Fenêtre des doublons fiabilité (≥ 2 semaines) — À VALIDER PAR LE COMITÉ.
- ✅ Alignement DE_U / DE_C au registre des signaux : `contrat/registres/signaux.json` MATÉRIALISÉ (décision comité, FM-019 — renommages SDT-N→DTM_N, SDT-M→DTM_M, **DE ajouté au registre**, RSQ inchangé).
- Seuils des signatures (registre Monde 1 rejoués tels quels) — ADOPTÉS comme valeurs de départ (FM-019) : provisoire concepteur — re-signature professionnelle avant bêta.
- Les conditions fines des 6 signatures de sécurité et de la fonction Dark Empathy vivent **hors dépôt** (document trames) — jamais ici.

## 🔁 Circuit restant

Production (fait) → **validateur (linter)** → **auditeur hostile C1 (session séparée)** → **gouvernance D1**.

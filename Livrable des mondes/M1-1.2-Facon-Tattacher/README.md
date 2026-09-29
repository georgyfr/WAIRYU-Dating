# QUÊTE 1.2 « TA FAÇON DE T'ATTACHER » — LIVRABLES DE PRODUCTION

> **Monde** : M1 — Le Miroir · **Statut** : 🆓 gratuit · **Catégorie** : Socle · **Phase** : MVP
> **Domaine** : DOMAINE DU SOI (les croisements M1×M2 vivent au Portrait de Domaine, jamais ici)
> **Items** : 20 = 12 items carte (6 anxiété + 6 évitement) + 8 items ▲ de trame (4 DTM_M + 4 RSQ)
> **Doublons fiabilité** : 2 autorisés (`Q1.2-01.r`, `Q1.2-09.r`) — hors passation, fenêtre ≥ 2 semaines ⚠
> **Plage de codes gelée** : Q1.2-01 → Q1.2-12 (carte) · Q1.2-T09 → Q1.2-T16 (trames) · Q1.2-01.r / Q1.2-09.r (doublons)
> **Cadre** : Constitution v2.1 (amendée FM-018) · source gelé « refonte des tests et outils wairyu.md » PARTIE 2 (lignes 2318-2365) · charte des cartes PARTIE 2 (lignes 2758-2862) · registre des signatures Monde 1

## 📁 Contenu du livrable (9 fichiers)

| Fichier | Livrable |
|---|---|
| `00-README.md` | Guide de lecture 1 page : rôle de la quête, lecture des fichiers, flux de la donnée |
| `01-tableau-des-items.md` | Les 20 items : 12 carte VERBATIM (orientation, dimension, facette, paire) + 8 lignes-réservées de trame + 2 doublons fiabilité |
| `02-plan-de-melange-graine-212427.md` | Plan de mélange : graine seedée 212427, outil déterministe, ordre de passation 1→20, verdicts RÉELS des 6 contraintes, run max 4 BORNÉ, échanges/kicks |
| `03-signatures-registre.md` | Signatures consommant ANX/EVI (conditions verbatim du registre Monde 1) + méta QFI/COH + sécurité (hors dépôt) |
| `04-slots-de-miroir.md` | Slots du miroir LOURD (20 items ≥ 15 → 300-450 mots) : ancre_item en champ moteur, citations en toutes lettres, 9 verrous |
| `05-ecran-d-intro.md` | Écran d'intro VERBATIM + contrôles de conformité |
| `06-fiche-computation-EXEMPLE.yaml` | Fiche de computation complète d'un item (Q1.2-08, évitement, I) — modèle des 5 canaux |
| `cartes.yaml` | Les 5 variantes de carte de la charte, VERBATIM, avec logique de sélection |

## ✅ Déclaration de conformité (interdits absolus)

| Interdit absolu | Statut |
|---|---|
| Dimensions non listées | ✅ aucune — anxiété et évitement seules (source gelé), rien d'autre |
| Items non demandés | ✅ 20 exactement (12 carte + 8 trame) + 2 doublons fiabilité autorisés |
| Format d'échelle changé | ✅ Likert 5 verrouillé (Arbitrage 2) |
| Sigle hors glossaire [4] | ✅ DTM_M et RSQ sont au glossaire [4] — côté moteur uniquement, jamais en UI |
| Verrous [9] traités comme décisions | ✅ seuils et fenêtres **ADOPTÉS comme valeurs de départ** (FM-019, provisoire concepteur) · run max borné **ACCEPTÉ** (FM-019) · c2 sans-objet toujours en attente |
| **FM-018 / Constitution [11-b]** — fuite de formulation de trame | ✅ **ZÉRO FUIE** : T09-T16 = lignes-réservées (codes + signal + positions au mélange uniquement, énoncés hors dépôt) |
| Fidélité au source gelé | ✅ énoncés carte et cartes VERBATIM — 1 énoncé > 12 mots documenté en « Dérives documentées » |
| Restitution des trames | ✅ aucun slot, aucune citation, aucun rappel — la trame sécurité n'a pas d'étage de restitution (Constitution [2]) |

## ⚠️ Points en attente de validation comité

- ✅ **Run max 4 borné** (finding 16 D / 4 I, alternance stricte impossible) — **ACCEPTÉ, documenté définitivement** (décision comité, FM-019). Note bêta : mesurer le biais d'accordement sur cette quête.
- **c2 sans-objet documenté** : 8 trames ancrées sur 20 positions rendent l'interdiction d'adjacence infaisable (tout slot non-trame touche une trame) — À VALIDER PAR LE COMITÉ.
- Fenêtre des doublons fiabilité (≥ 2 semaines) — À VALIDER PAR LE COMITÉ.
- ✅ Alignement DTM_M / RSQ au registre des signaux : `contrat/registres/signaux.json` MATÉRIALISÉ (décision comité, FM-019 — renommages SDT-N→DTM_N, SDT-M→DTM_M, DE ajouté, RSQ inchangé).
- Seuils des signatures (registre Monde 1 rejoués tels quels) — ADOPTÉS comme valeurs de départ (FM-019) : provisoire concepteur — re-signature professionnelle avant bêta.
- Les conditions fines des 6 signatures de sécurité et de SIG_RSQ_HAUT vivent **hors dépôt** (document trames) — jamais ici.

## 🔁 Circuit restant

Production (fait) → **validateur (linter)** → **auditeur hostile C1 (session séparée)** → **gouvernance D1**.

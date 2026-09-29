# QUÊTE 1.1 « TA PERSONNALITÉ » — LIVRABLES DE PRODUCTION

> **Monde** : M1 — Le Miroir · **Statut** : 🆓 gratuit · **Catégorie** : Fondation · **Phase** : MVP
> **Domaine** : DOMAINE DU SOI (M1+M2 — les liaisons inter-mondes vivent au Portrait de Domaine, jamais ici)
> **Items** : 58 = 50 items carte (5 dimensions Big Five × 10 : O C E A S) + 8 items ▲ de trame (DTM_N) · + 2 doublons fiabilité (`02.r`, `11.r` — hors comptage du contrat)
> **Plage de codes gelée** : Q1.1-01 → Q1.1-50 (carte) · Q1.1-T01 → Q1.1-T08 (trame) · Q1.1-02.r · Q1.1-11.r (doublons)
> **Cadre** : Constitution v2.1 (amendée FM-018 — doctrine de brûlage [11-b]) · fidélité VERBATIM au source gelé (`ddocumentation/refonte des tests et outils wairyu.md`, PARTIE 1)
> **Mélange** : graine 211427 — course réelle exécutée, verdicts **6/6 PASS** intégrés tels quels (`ci/resultats-melange/1.1.json`)

## 📁 Contenu du livrable (9 fichiers)

| Fichier | Livrable |
|---|---|
| `00-README.md` | 1 page : à quoi sert la quête, comment lire les fichiers, le flux items → mélange → passation → scoring → miroir |
| `01-tableau-des-items.md` | Les 58 items : code gelé, énoncé verbatim, orientation D/I, dimension (carte_id), facette, signal ▲, fiche de computation condensée à 5 canaux · 8 lignes-réservées trame · 2 doublons fiabilité · dérives documentées |
| `02-plan-de-melange-graine-211427.md` | Plan de mélange : graine 211427, algorithme, ordre de passation 1→58, verdicts RÉELS des 6 contraintes, positions trames, trace des 42 échanges de l'outil |
| `03-signatures-registre.md` | Signatures du registre Monde 1 consommant O C E A S : 7 méta + narratives, conditions verbatim, chacune marquée « À VALIDER PAR LE COMITÉ » |
| `04-slots-de-miroir.md` | Slots de miroir (miroir LOURD : 58 ≥ 15 → gabarit 300-450 mots), citations en toutes lettres + ancre_item en champ moteur, 9 verrous de slot |
| `05-ecran-d-intro.md` | Écran d'intro VERBATIM du source + contrôles de conformité |
| `06-fiche-computation-EXEMPLE.yaml` | Fiche de computation complète d'un item (Q1.1-17), modèle des 5 canaux, format YAML |
| `cartes.yaml` | Les 7 variantes de carte de la quête 1.1 : sélecteurs verbatim, textes verbatim, logique de sélection |

## ✅ Déclaration de conformité (interdits absolus)

| Interdit absolu | Statut |
|---|---|
| Fuite de formulation de trame (FM-018 · Constitution [11-b] — doctrine de brûlage) | ✅ **zéro** — T01→T08 sont des LIGNES-RÉSERVÉES (code + signal + position uniquement) ; contenu au document trames, hors dépôt, canal privé |
| Dimensions non listées | ✅ aucune — les 5 fournies par le source (ouverture, organisation, énergie sociale, bienveillance, stabilité émotionnelle), rien d'autre |
| Items non demandés | ✅ 58 exactement (50 carte + 8 ▲) ; les 2 doublons `.r` sont hors comptage (conventions du source) |
| Format d'échelle changé | ✅ Likert 5 niveaux verrouillé (conventions du source) |
| Sigle hors glossaire [4] | ✅ seul DTM_N utilisé, côté moteur, jamais en UI |
| Code, score ou sigle dans un texte rendu [3] | ✅ aucun — rappels en toutes lettres, `ancre_item` en champ moteur (FM-017) |
| Verrous [9] traités comme décisions | ✅ tous les seuils et fenêtres marqués **« À VALIDER PAR LE COMITÉ »** — aucune décision |
| Recalcul ou invention du mélange | ✅ verdicts et ordre de passation copiés TELS QUELS de `ci/resultats-melange/1.1.json` (course réelle) |

## ⚠️ Points en attente de validation comité

- **Dérive de longueur des énoncés** : le source gelé contient des énoncés au-delà de la cible de rédaction ≤ 12 mots (6 strictement > 12, 7 à 12 exactement — comptage documenté au fichier 01). La fidélité verbatim au source gelé [8] est maintenue ; l'arbitrage (reformulation via Fiche de Mutation vs maintien) est laissé au comité.
- **Textes de cartes verbatim** : 4 variantes dépassent la cible 30-60 mots de l'étage 1 (V1 : 68 · V2 : 61 · V4 : 61 · V5 : 61) ; « jamais » en absolu présent dans le texte verbatim de V1 — arbitrage fidélité [8] vs interdits lexicaux [3].
- **Facettes** : le source gelé ne nomme pas de facettes pour la quête 1.1 — les libellés du fichier 01 sont des descriptifs de production, non contractuels, à contractualiser ou rejeter.
- **Ancre contestée Q1.1-48** : la note d'audit du registre (§ SIG_VERROU_AUTOACCUSATION) est reproduite telle quelle — l'option (a) ou (b) est une décision comité.
- Fenêtre de présentation des doublons fiabilité (≥ 2 semaines après l'original) — règle du source, calibrage à valider.
- Seuils des sélecteurs de carte (V1→V7) et seuils des signatures du registre — « À VALIDER PAR LE COMITÉ ».

## 🔁 Circuit restant

Production (fait) → **validateur (linter)** → **auditeur hostile C1 (session séparée)** → **gouvernance D1**.

# 📦 LIVRABLE DES MONDES

Ce dossier accueille les livrables de production des quêtes du voyage Wairyu, un monde après l'autre.
Chaque livrable est né dans une session de production cadrée par la **Constitution v2.1** (voir `ddocumentation`),
avec le rituel d'ouverture [10] : restitution en 5 lignes → validation → production.

## 🗺️ Structure

```
Livrable des mondes/
├── M1-1.1-Ta-Personnalite/      ← quête 1.1 « Ta personnalité » (M1 — Le Miroir, 🆓 gratuit, 58 items)
├── M1-1.2-Facon-Tattacher/      ← quête 1.2 « Ta façon de t'attacher » (M1, 🆓, 20 items)
├── M1-1.3-Tes-Emotions/         ← quête 1.3 « Tes émotions » (M1, 🆓, 26 items)
├── M2-1.4-Ton-Controle/         ← quête 1.4 « Ton contrôle sur toi-même » (M2 — Le Volant, 🆓, 8 items)
├── M2-1.6-Ta-Facon-de-Penser/   ← quête 1.6 « Ta façon de penser » (M2, 🆓, 7 items + 3 énigmes)
├── M2-1.7-Ton-Fonctionnement/   ← quête 1.7 « Ton fonctionnement » (M2, 🆓, opt-in, 2 items)
├── M3-2.1-Tes-Valeurs/          ← quête 2.1 « Tes valeurs » (M3 — La Boussole, 🆓 gratuit, Socle, MVP)
├── M3-2.3-Tes-Non-Negociables/  ← quête 2.3 « Tes non-négociables » (M3, 🆓, Socle, 10 checks)
├── M3-2.4-Tes-Realites/         ← quête 2.4 « Tes réalités » (M3, 🆓, Socle, 8 clics)
└── M3-2.5-Ce-Que-Tu-Cherches/   ← quête 2.5 « Ce que tu cherches » (M3, 🆓, Socle, 3 binaires)
```

Chaque dossier de quête porte : `README.md` (vue d'ensemble) · `00-README.md` (guide de lecture 1 page)
· `01-tableau-des-items.md` · `02-plan-de-melange-graine-*.md` · `03-signatures-registre.md`
· `04-slots-de-miroir.md` · `05-ecran-d-intro.md` · `06-fiche-computation-*.yaml` · `cartes.yaml`.

**Taux de matérialisation : 148/570 items = 26,0 %** (24 + 124 items rédigés du Monde 1 ; 1.5 « conçus »
et 1.8 « cadrés » exclus — P1 matérialise, ne rédige pas ; PHQ-9 maintenu Phase 3 avec verrou renforcé (relecture professionnelle obligatoire, option de retrait — FM-019)).

## 📐 Conventions permanentes (arbitrages verrouillés, valables pour TOUTES les quêtes)

| # | Arbitrage | Décision |
|---|---|---|
| 1 | **Orientation D/I** | D = direct (contribue tel quel au score de sa dimension) · I = inversé (recodé `6 − réponse`) |
| 2 | **Format d'échelle** | Likert 5 niveaux, codage 1-5 : `1 Pas du tout comme moi · 2 Plutôt pas comme moi · 3 Neutre / je ne sais pas · 4 Plutôt comme moi · 5 Tout à fait comme moi` |
| 3 | **Codes gelés** | Chaque fiche de quête porte sa plage réservée (ex : 2.1 = Q2.1-01 → Q2.1-24). Attribution séquentielle à la rédaction ; l'ordre de passation est celui du plan de mélange ; un code non utilisé reste gelé et n'est jamais réattribué |
| 4 | **Signaux hors glossaire [4]** | Interdits en session. Procédure : demande → validation comité → Fiche de Mutation d'ajout au dictionnaire → ensuite seulement production |

## 🔒 Posture de production

- Trois verrous HUMAINS (Constitution [9]) : seuils psychométriques, formulations de sécurité/bien-être,
  validation scientifique. **État après FM-019 (décisions comité 2026-09-29)** : les seuils proposés
  sont ADOPTÉS comme valeurs de départ et marqués « **provisoires concepteur — re-signature
  professionnelle avant bêta** » dans les livrables ; les valeurs des signatures de sécurité restent
  consignées hors dépôt (document trames, canal privé). Les points non couverts par FM-019 restent
  marqués « À VALIDER PAR LE COMITÉ ».
- Circuit de chaque livrable : **production → validateur (linter) → auditeur hostile C1 (session séparée) → gouvernance D1**.
- Le Contrat d'Inventaire v1.3 reste la SOURCE UNIQUE. En cas de divergence : LE CONTRAT GAGNE — signale, ne corrige pas.

# QUÊTE 2.1 « TES VALEURS » — LIVRABLES DE PRODUCTION

> **Monde** : M3 — La Boussole · **Statut** : 🆓 gratuit · **Catégorie** : Socle · **Phase** : MVP
> **Domaine** : DOMAINE DU SOI (les liaisons M1×M2 vivent au Portrait de Domaine, jamais ici)
> **Items** : 24 = 20 items carte (10 valeurs × 2 : 1 direct + 1 inversé) + 4 items ▲ de trame (DTM_N)
> **Plage de codes gelée** : Q2.1-01 → Q2.1-24
> **Cadre** : Constitution v2.1 · Fiche de quête fournie et validée · 4 arbitrages permanents appliqués

## 📁 Contenu du livrable

| Fichier | Livrable |
|---|---|
| `00-README.md` | guide de lecture 1 page : rôle de la quête, lecture des fichiers, flux de production |
| `01-tableau-des-24-items.md` | 20 items carte (énoncé, orientation D/I, dimension, facette, paire miroir, signal ▲, fiche 5 canaux) + 4 slots de sécurité (énoncés HORS dépôt — FM-018/[11-b]) |
| `02-plan-de-melange-graine-210427.md` | Plan de mélange : graine 210427 CONSERVÉE, ordre de passation réparé passe ⑤ (FM-015 — run max 2, verdicts REJOUÉS), table des 6 contraintes |
| `03-signatures-registre.md` | 4 signatures attendues de la quête (format du registre) |
| `04-slots-de-miroir.md` | Les slots de miroir alimentés (percentiles, citations en toutes lettres, degrés, écarts internes) — corrections FM-017 : ancre_item en champ moteur, citations fidélisées, 2 verrous d'ombre |
| `05-ecran-d-intro.md` | Écran d'intro de la quête (2 phrases, ton de la Constitution, statut freemium respecté) |
| `06-fiche-computation-Q2.1-17.yaml` | Fiche de computation complète d'un item, modèle des 5 canaux, format YAML |

## ✅ Déclaration de conformité (interdits absolus)

| Interdit absolu | Statut |
|---|---|
| Dimensions non listées | ✅ aucune — les 10 fournies par la fiche, rien d'autre |
| Items non demandés | ✅ 24 exactement (20 carte + 4 ▲) |
| Format d'échelle changé | ✅ Likert 5 verrouillé (Arbitrage 2) |
| Sigle hors glossaire [4] | ✅ seul DTM_N utilisé, côté moteur, jamais en UI |
| Verrous [9] traités comme décisions | ✅ seuils et fenêtres **ADOPTÉS comme valeurs de départ** (décision comité, FM-019) — marqués « provisoire concepteur — re-signature professionnelle avant bêta » |

## ⚠️ Points en attente de validation comité

- Seuil SIG-2.1-01 (0,5) · fenêtres de fréquence des 4 signatures · seuil trame T1 (SIG-2.1-03).
- Le framework public des valeurs universelles est référencé **côté moteur uniquement** — jamais nommé dans aucun texte utilisateur (règle de jargon [3]).

## ✅ Statut du circuit

Production ✅ → validateur (linter 6/6) ✅ → **CI du contrat d'inventaire : 15/15** (après FM-015) ✅ → **auditeur hostile C1 : À CORRIGER → LIVRABLE** (clôturé par l'auditeur — `contrat/audits/`) ✅ → gouvernance D1 (FM-013/015/017/018) ✅.

**Première quête LIVRABLE de Wairyu.** Findings 4.1 et 8.1 du C1 restent au comité (verrou [9]) ; rotation des formulations des 4 trames ▲ programmée avant bêta (FM-018 §4 — propositions concepteur, domaine réservé [9]).

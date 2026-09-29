# QUÊTE 2.4 « TES RÉALITÉS » — LIVRABLES DE PRODUCTION

> **Monde** : M3 — La Boussole · **Statut** : 🆓 gratuit · **Catégorie** : Socle · **Phase** : MVP
> **Domaine** : DOMAINE DU SOI (les liaisons M1×M2 vivent au Portrait de Domaine, jamais ici)
> **Items** : 8 = déclarations factuelles un-clic (auto-déclarations, brutes, croisables)
> **Plage de codes gelée** : Q2.4-01 → Q2.4-08
> **Cadre** : Constitution v2.1 · Source : « refonte des tests et outils wairyu.md » — LE TROU N°1
> (l.441-455 et l.565-600) : « Wairyu demande ce que tu REFUSES, mais jamais ce que tu ES »

## 📁 Contenu du livrable (9 fichiers)

| Fichier | Livrable |
|---|---|
| `00-README.md` | Fiche de cadrage en tête (dimensions, format NON-Likert, signatures, slots, doctrine) + lecture des fichiers + flux |
| `01-tableau-des-items.md` | Intégralité des 8 déclarations : code gelé, énoncé, format, options, croisement moteur, fiche de computation condensée |
| `02-plan-de-melange-graine-24427.md` | Plan de mélange réel : graine seedée 24427, ordre de passation, verdicts c1-c6 (sans-objet documentés), table de vérification |
| `03-signatures-registre.md` | 3 signatures (dont la note QFI obligatoire) — seuils ADOPTÉS comme valeurs de départ, provisoire concepteur (FM-019) |
| `04-slots-de-miroir.md` | Miroir MOYEN (150-250 mots) : 3 slots + 9 verrous de slot |
| `05-ecran-d-intro.md` | Écran d'intro (2 phrases, ton de la Constitution, statut freemium respecté) |
| `06-fiche-computation-EXEMPLE.yaml` | Fiche de computation complète de l'item Q2.4-01 (3 états), modèle des 5 canaux |
| `cartes.yaml` | 2 variantes de carte (étage 1, 30-60 mots) : « La réalité, telle quelle » / « Le bassin large » |

## ✅ Déclaration de conformité (interdits absolus)

| Interdit absolu | Statut |
|---|---|
| Dimensions non listées | ✅ aucune — dimension = null partout (déclarations factuelles, sans psychométrie) |
| Items non demandés | ✅ 8 exactement (les 6 du source + distance géographique + disponibilité, cadrées factuelles) |
| Format d'échelle changé | ✅ UN-CLIC verrouillé — 1 clic = 1 auto-déclaration, pas d'échelle de degré, pas d'orientation D/I |
| Sigle hors glossaire [4] | ✅ seul QFI utilisé, côté moteur, jamais en UI (glossaire [4]) |
| **Données jugées moralement** | ✅ **ÉCRAN DE CONFORMITÉ : ces données sont factuelles et JAMAIS jugées.** Aucune formulation « mieux vaut », aucune hiérarchie des réalités (fumer, ne pas faire de sport, être nomade : des faits, pas des défauts) |
| QFI affiché | ✅ QFI = signal MOTEUR SEUL, jamais affiché, jamais dit à l'utilisateur ni au match |
| Code/score/sigle au rendu | ✅ aucun — rappels en toutes lettres (ancre_item en champ moteur) |
| Verrous [9] traités comme décisions | ✅ tous les seuils **ADOPTÉS comme valeurs de départ** (décision comité, FM-019) — marqués « provisoire concepteur — re-signature professionnelle avant bêta » |

## ⚠️ Points en attente de validation comité (état après FM-019)

- ✅ **Tranché (FM-019)** : seuils des 3 signatures ADOPTÉS comme valeurs de départ · décisions
  produit (a) chips (visibles par défaut neutres, choix privé par item sensibles, matching actif
  même sur les privés) et (b) « J'ai arrêté » = non-fumeur au filtre, « ex-fumeur » à l'affichage.
- Restent : fenêtre de recalcul des filtres à chaque mise à jour · équilibre mots lumière/ombre des
  cartes · composition des items 07/08 (propositions — domaine réservé [9]) · classification exacte
  neutre/sensible des chips (proposition : sensibles = 03 enfants · 04 spiritualité).
- Dérogation documentée : les options « Jamais » (alcool, enfants) sont des étiquettes de fréquence
  **prescrites verbatim par le source** (l.571, l.573) — des réponses déclaratives, pas des affirmations
  rédigées en absolu.

## 🔁 Circuit restant

Production (fait) → **validateur (linter)** → **auditeur hostile C1 (session séparée)** → **gouvernance D1**.

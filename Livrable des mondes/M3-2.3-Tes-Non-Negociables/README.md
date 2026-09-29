# QUÊTE 2.3 « TES NON-NÉGOCIABLES » — LIVRABLES DE PRODUCTION

> **Monde** : M3 — La Boussole · **Statut** : 🆓 gratuit · **Catégorie** : Socle · **Phase** : MVP
> **Domaine** : DOMAINE DU SOI (les liaisons M1×M2 vivent au Portrait de Domaine, jamais ici)
> **Items** : 10 = checklist complète de lignes rouges (9 cochables + 1 champ libre optionnel)
> **Plage de codes gelée** : Q2.3-01 → Q2.3-10
> **Cadre** : Constitution v2.1 · Source : « refonte des tests et outils wairyu.md » (tableau M2/BOUSSOLE, l.1937 ; « le trou n°1 », l.441-455) · « TEST ET OUTILS POUR WAIRYU.md » l.210 (concept dealbreakers public — Jonason et al. ; items 100 % originaux Wairyu)

## 📁 Contenu du livrable (9 fichiers)

| Fichier | Livrable |
|---|---|
| `00-README.md` | Fiche de cadrage en tête (dimensions, format NON-Likert, signatures, slots, doctrine) + lecture des fichiers + flux |
| `01-tableau-des-items.md` | Intégralité des 10 items : code gelé, énoncé, format, options, croisement moteur, fiche de computation condensée |
| `02-plan-de-melange-graine-23427.md` | Plan de mélange réel : graine seedée 23427, ordre de passation, verdicts c1-c6 (sans-objet documentés), table de vérification |
| `03-signatures-registre.md` | 3 signatures proposées (format du registre) — tous les seuils « À VALIDER PAR LE COMITÉ » |
| `04-slots-de-miroir.md` | Miroir MOYEN (150-250 mots) : 3 slots + 9 verrous de slot |
| `05-ecran-d-intro.md` | Écran d'intro (2 phrases, ton de la Constitution, statut freemium respecté) |
| `06-fiche-computation-EXEMPLE.yaml` | Fiche de computation complète de l'item Q2.3-01 (format checklist), modèle des 5 canaux |
| `cartes.yaml` | 2 variantes de carte (étage 1, 30-60 mots) : « Les lignes rouges sont posées » / « Le cadre ouvert » |

## ✅ Déclaration de conformité (interdits absolus)

| Interdit absolu | Statut |
|---|---|
| Dimensions non listées | ✅ aucune — dimension = null partout (checklist, sans psychométrie déclarative) |
| Items non demandés | ✅ 10 exactement (9 cochables + Q2.3-10 champ libre optionnel) |
| Format d'échelle changé | ✅ CHECKLIST verrouillée — pas d'échelle, pas d'orientation D/I (NON-Likert déclaré) |
| Sigle hors glossaire [4] | ✅ aucun sigle utilisé (aucune trame dans la quête) |
| Données jugées moralement | ✅ cocher = « c'est rédhibitoire pour moi » — limite personnelle, aucune normativité, le cadre ouvert n'est jamais jugé |
| Code/score/sigle au rendu | ✅ aucun — rappels en toutes lettres (ancre_item en champ moteur) |
| Verrous [9] traités comme décisions | ✅ tous les seuils marqués **« À VALIDER PAR LE COMITÉ »** |

## ⚠️ Points en attente de validation comité

- Condition de déclenchement SIG-2.3-01 (nombre minimal de coches) · fenêtres de recalcul ·
  traitement du champ libre Q2.3-10 (hors computation automatique) · équilibre mots lumière/ombre des cartes.
- Le concept public des dealbreakers (Jonason et al.) est référencé **côté moteur uniquement** —
  jamais nommé dans aucun texte utilisateur (règle de jargon [3]).

## 🔁 Circuit restant

Production (fait) → **validateur (linter)** → **auditeur hostile C1 (session séparée)** → **gouvernance D1**.

# QUÊTE 2.5 « CE QUE TU CHERCHES » — LIVRABLES DE PRODUCTION

> **Monde** : M3 — La Boussole · **Statut** : 🆓 gratuit · **Catégorie** : Socle · **Phase** : MVP
> **Domaine** : DOMAINE DU SOI (les liaisons M1×M2 vivent au Portrait de Domaine, jamais ici)
> **Items** : 3 = questions binaires assumées (oui / non) — l'intention affichée
> **Plage de codes gelée** : Q2.5-01 → Q2.5-03
> **Cadre** : Constitution v2.1 · Source : « refonte des tests et outils wairyu.md » (tableau M2/BOUSSOLE,
> l.1939 : « Dealbreaker binaire + croisement intention réelle (6.1) → détecte tromperie ») ·
> « TEST ET OUTILS POUR WAIRYU.md » l.207 : « relation exclusive, découverte, non-exclusivité assumée »

## 📁 Contenu du livrable (9 fichiers)

| Fichier | Livrable |
|---|---|
| `00-README.md` | Fiche de cadrage en tête (dimensions, format NON-Likert, signatures, slots, doctrine) + lecture des fichiers + flux |
| `01-tableau-des-items.md` | Intégralité des 3 items : code gelé, énoncé, format, options, croisement moteur, fiche de computation condensée |
| `02-plan-de-melange-graine-25428.md` | Plan de mélange réel : re-tirage documenté 25427 → 25428 raconté intégralement, ordre de passation, verdicts c1-c6 |
| `03-signatures-registre.md` | 3 signatures proposées (dont la note tromperie) — tous les seuils « À VALIDER PAR LE COMITÉ » |
| `04-slots-de-miroir.md` | Miroir LÉGER (80-150 mots) : 2 slots + 9 verrous de slot |
| `05-ecran-d-intro.md` | Écran d'intro (2 phrases, ton de la Constitution, statut freemium respecté) |
| `06-fiche-computation-EXEMPLE.yaml` | Fiche de computation complète de l'item Q2.5-01 (binaire), modèle des 5 canaux |
| `cartes.yaml` | 2 variantes de carte (étage 1, 30-60 mots) : « Le cap posé » / « Sans plan figé » |

## ✅ Déclaration de conformité (interdits absolus)

| Interdit absolu | Statut |
|---|---|
| Dimensions non listées | ✅ aucune — dimension = null partout (binaires, sans psychométrie) |
| Items non demandés | ✅ 3 exactement (verbatim du cadrage) |
| Format d'échelle changé | ✅ BINAIRE verrouillé — oui / non, pas d'échelle, pas d'orientation D/I |
| Sigle hors glossaire [4] | ✅ seul QFI utilisé, côté moteur, jamais en UI (glossaire [4]) |
| Détection de tromperie exposée | ✅ MOTEUR SEUL — jamais affichée, jamais suggérée, à l'utilisateur ni au match |
| Code/score/sigle au rendu | ✅ aucun — rappels en toutes lettres (ancre_item en champ moteur) |
| Incomplétude cachée | ✅ documentée : 3 items ne couvrent pas toutes les intentions — le miroir ne prétend jamais l'exhaustivité (complétude par 6.1) |
| Verrous [9] traités comme décisions | ✅ tous les seuils marqués **« À VALIDER PAR LE COMITÉ »** |

## ⚠️ Points en attente de validation comité

- Seuils des 3 signatures · traitement de la contradiction interne (degrés de dégradation du miroir) ·
  équilibre mots lumière/ombre des cartes · activation de SIG-2.5-03 (pré-requis : matérialisation de 6.1).
- Aucune trace de trame dans la quête (vérifié au registre du mélange).

## 🔁 Circuit restant

Production (fait) → **validateur (linter)** → **auditeur hostile C1 (session séparée)** → **gouvernance D1**.

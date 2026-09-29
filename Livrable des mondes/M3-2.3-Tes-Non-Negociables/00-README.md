# QUÊTE 2.3 « TES NON-NÉGOCIABLES » — FICHE DE CADRAGE PUIS LECTURE DU LIVRABLE

> Monde M3 · 🆓 gratuit · Socle · MVP · 10 items · Codes gelés Q2.3-01 → Q2.3-10

## 🧭 FICHE DE CADRAGE (lire avant tout le reste)

| Champ | Cadrage |
|---|---|
| **Ce que ça mesure** | Les LIGNES ROUGES de la personne : ce qui est rédhibitoire pour elle chez l'autre. Concept public des dealbreakers (Jonason et al.) — items 100 % originaux Wairyu. Côté moteur : les hard constraints déclarés, « le carburant des filtres — votre mécanisme le plus fiable (l'élimination déterministe) » (source, l.598). |
| **Format de réponse (NON-Likert)** | **CHECKLIST.** L'utilisateur COCHE lui-même ses lignes rouges parmi une liste. Pas d'échelle, pas de degré, pas d'orientation D/I, pas de dimension psychométrique : `dimension = null`, `signal = null`, `orientation = null`. Cocher = « c'est rédhibitoire pour moi ». Ne pas cocher n'est jamais une « bonne réponse ». Q2.3-10 = champ libre optionnel (aucune coche). |
| **Signatures attendues** | SIG-2.3-01 « Le filtre dur » (croisement bidirectionnel avec 2.4) · SIG-2.3-02 « La liste vide » (0 coche = cadre ouvert assumé) · SIG-2.3-03 « La ligne qui se retourne » (coche × propre réalité → QFI). **Seuils adoptés comme valeurs de départ — provisoire concepteur — re-signature professionnelle avant bêta (FM-019).** |
| **Slots prévus** | Miroir **MOYEN** (10 items → gabarit 150-250 mots, Constitution [7]) · 3 slots (S1 rappel en toutes lettres, S2 le prix du cadre, S3 ce que le cadre protège) · gabarit « slots ∝ densité » proposé, À VALIDER PAR LE COMITÉ. |
| **Points de doctrine** | ① Neutralité absolue : aucune ligne rouge n'est « sage » ni « fermée », la liste vide n'est pas un défaut. ② L'ombre nomme le COÛT RELATIONNEL du choix (un filtre dur réduit le pool) — jamais un jugement moral. ③ Croisement 2.3 × 2.4 autorisé ICI (même monde, quêtes Socle) ; les liaisons du DOMAINE DU SOI (M1×M2) restent au Portrait de Domaine ([5]). ④ L'élimination déterministe est MOTEUR : aucune trace de filtre n'apparaît chez l'un ni chez l'autre. ⑤ Gratuit ne présuppose jamais premium : le croisement 6.1 n'est jamais teasé ici ([6]). |

## 📖 Lecture des fichiers (ordre conseillé)

1. `01-tableau-des-items.md` — la liste des 10 items cochables, leur format, leur croisement moteur.
2. `02-plan-de-melange-graine-23427.md` — l'ordre de passation RÉEL (graine 23427, verdicts c1-c6).
3. `03-signatures-registre.md` — les 3 signatures proposées (seuils au comité).
4. `04-slots-de-miroir.md` — le miroir MOYEN et ses 9 verrous.
5. `05-ecran-d-intro.md` — les 2 phrases d'entrée dans la quête.
6. `06-fiche-computation-EXEMPLE.yaml` — un item déployé au format complet des 5 canaux.
7. `cartes.yaml` — les 2 variantes de carte (étage 1).

## 🔄 Flux de production

```
cadrage (cette fiche) → rédaction des 10 items → mélange seedé 23427 (outil ci/outils/melange.py)
→ verdicts c1-c6 rejoués → signatures/slots/cartes/intro → validateur (linter)
→ auditeur hostile C1 (session séparée) → gouvernance D1
```

> Aucun fichier du dépôt contractuel n'est modifié par ce livrable (pas de git, pas de CI).

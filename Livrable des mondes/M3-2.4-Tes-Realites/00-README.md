# QUÊTE 2.4 « TES RÉALITÉS » — FICHE DE CADRAGE PUIS LECTURE DU LIVRABLE

> Monde M3 · 🆓 gratuit · Socle · MVP · 8 items · Codes gelés Q2.4-01 → Q2.4-08

## 🧭 FICHE DE CADRAGE (lire avant tout le reste)

| Champ | Cadrage |
|---|---|
| **Ce que ça mesure** | Les RÉALITÉS de la personne, déclarées telles quelles : le trou n°1 du source (« rien ne déclare ses propres réalités de manière structurée et croisable »). Sans cette quête, le filtre le plus utilisé de l'industrie ne fonctionne pas (l'exemple Alice du source : elle refuse les fumeurs, mais « je suis fumeuse » n'est nulle part). |
| **Format de réponse (NON-Likert)** | **UN-CLIC.** 8 auto-déclarations FACTUELLES, brutes, une seule touche chacune. Pas d'échelle de degré, pas d'orientation D/I, pas de dimension psychométrique : `dimension = null`, `signal = null`. Les énoncés sont des cadres en 1re personne (« Ma réalité : … ») ; les options sont les déclarations elles-mêmes, verbatim du source. |
| **Signatures attendues** | SIG-2.4-01 « Le croisement qui élimine » (bidirectionnel réalités × lignes rouges de tous) · SIG-2.4-02 « Le profil qui se contredit » (incohérences déclarées/mesurées → **QFI**) · SIG-2.4-03 « La tension des réalités » (frictions internes non contradictoires). **Propositions — tous les seuils À VALIDER PAR LE COMITÉ. NOTE QFI : QFI est un signal MOTEUR SEUL — jamais affiché, jamais dit.** |
| **Slots prévus** | Miroir **MOYEN** (8 items → gabarit 150-250 mots, Constitution [7]) · 3 slots (S1 profil de vie brut, S2 géographie × tempo, S3 ce que les réalités activent) · gabarit « slots ∝ densité » proposé, À VALIDER PAR LE COMITÉ. |
| **Points de doctrine** | ① **Écran de conformité : les réalités sont factuelles et JAMAIS jugées** — aucune formulation « mieux vaut », aucune hiérarchie des vies. ② Le croisement est BIDIRECTIONNEL (mes réalités × les lignes rouges des autres ; leurs réalités × mes lignes rouges) — moteur seul, invisible des deux côtés. ③ Les incohérences déclarées/mesurées alimentent QFI sans jamais être exposées comme accusation. ④ Aucune trame dans la quête (vérifié au registre du mélange). ⑤ Gratuit ne présuppose jamais premium ([6]). |

## 📖 Lecture des fichiers (ordre conseillé)

1. `01-tableau-des-items.md` — les 8 déclarations, leurs options verbatim, leur croisement moteur.
2. `02-plan-de-melange-graine-24427.md` — l'ordre de passation RÉEL (graine 24427, verdicts c1-c6).
3. `03-signatures-registre.md` — les 3 signatures proposées + la note QFI (seuils au comité).
4. `04-slots-de-miroir.md` — le miroir MOYEN et ses 9 verrous.
5. `05-ecran-d-intro.md` — les 2 phrases d'entrée dans la quête.
6. `06-fiche-computation-EXEMPLE.yaml` — l'item Q2.4-01 (3 états) déployé au format complet.
7. `cartes.yaml` — les 2 variantes de carte (étage 1).

## 🔄 Flux de production

```
cadrage (cette fiche) → rédaction des 8 déclarations → mélange seedé 24427 (outil ci/outils/melange.py)
→ verdicts c1-c6 rejoués → signatures/slots/cartes/intro → validateur (linter)
→ auditeur hostile C1 (session séparée) → gouvernance D1
```

> Aucun fichier du dépôt contractuel n'est modifié par ce livrable (pas de git, pas de CI).

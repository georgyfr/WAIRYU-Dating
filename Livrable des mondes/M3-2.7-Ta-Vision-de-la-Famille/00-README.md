# QUÊTE 2.7 « TA VISION DE LA FAMILLE » — FICHE DE CADRAGE PUIS LECTURE DU LIVRABLE

> Monde M3 · 🆓 gratuit · Socle · MVP · **8 items Likert — DEALBREAKER PARENTALITÉ au moteur**
> Codes gelés Q2.7-01 → Q2.7-08 · Paires miroir : 4 angles × 2 (1 D + 1 I, règle R6)
> Source : Constitution v2.1 [5] (« 2.7 Ta vision de la famille (8) ») · Contrat d'Inventaire (« Enfants, horizon, rôles — **Dealbreaker parentalité : score = 0 si divergence ≥ 2** ») · FM-011 v2

## 🧭 FICHE DE CADRAGE (lire avant tout le reste)

| Champ | Cadrage |
|---|---|
| **Ce que ça mesure** | La vision de la famille sur 4 angles : ① le **désir d'enfants** (l'item d'intention directe du dealbreaker — le « quand, combien » passe par le désir et l'horizon) · ② l'**horizon temporel** (quand) · ③ la **répartition des rôles** (professionnels et domestiques) · ④ **la place des familles élargies** (accueillie ↔ noyau choisi — mission V8.C ; l'ancien angle « modèle d'éducation » de la Vague 6 est archivé dans l'historique git). Les sujets qu'on évite au début et qui finissent par décider de tout — ici, ils se posent maintenant (intro, ajustée V8.C). |
| **Le dealbreaker parentalité (MOTEUR SEUL)** | Règle du contrat : **|désir_A − désir_B| ≥ 2 → score 0**, en **SQL pré-filtrage** (la paire est exclue AVANT tout calcul de compatibilité — coût moteur nul, aucune trace rendue chez l'un ni chez l'autre). Le désir est la moyenne (échelle 1-5) des 2 items du désir (Q2.7-02 recodé `6 − r`). L'élimination est déterministe et silencieuse — comme tous les hard constraints (precedent 2.3-01) : personne ne voit « pourquoi ». |
| **Format de réponse** | Likert 5 niveaux (Arbitrage 2) · D = direct, I = inversé recodé `6 − réponse` (Arbitrage 1) · **paires miroir requises** (règle R6) : chaque angle porte 1 D + 1 I. |
| **Mélange** | RÉEL — graine **227427** (graine-mère 210427 + 1000 × ordinal 17 — convention unifiée mission V7/V8 ; ancienne graine 237427 de la VAGUE 6 archivée, re-tirage tracé au plan) · Fisher-Yates seedé + réparation déterministe · verdicts c1-c6 rejoués par l'outil (3 échanges de réparation, run max 2 — 5 passes identiques). |
| **Signatures attendues** | **SIG-2.7-01 « Le cap qui ne passe pas »** (le dealbreaker — ci-dessus) · **SIG-2.7-02 « L'horizon qui ne se croise pas »** : écart d'horizon estimé > 4 ans → signal conversationnel « à aborder tôt » (jamais une élimination ; le mapping score → fourchette d'années est une proposition — verrou [9]) · **SIG-2.7-03 « La friction des rôles »** (mission V8.C) : écarts forts sur la zone répartition (05-08) → signal « à aborder tôt ». |
| **Slots prévus** | Miroir **MOYEN** (8 items → gabarit 150-250 mots, Constitution [7]) · 3 profils (parent-avide / indécis-serein / sans-enfant-choisi) — chaque profil respecté, ombres prévues par la mission. |
| **Points de doctrine** | ① Chaque profil est respecté : le désir d'enfant, l'indécision honnête et le choix sans enfant sont trois vies dignes — les ombres nomment des mécaniques de couple, jamais des défauts de personne. ② Le dealbreaker est un fait moteur, jamais un mot rendu : aucun texte ne dit « incompatible », « dealbreaker », « éliminé ». ③ Ni « quand » ni « combien » ne sont posés en chiffres dans les énoncés : le désir se mesure, la vie se racontera — la quête ouvre la question, elle ne la ferme pas. ④ Gratuit ne présuppose jamais premium ([6]). ⑤ Aucune trame ▲ (vérifié au registre). |

## 📖 Lecture des fichiers (ordre conseillé)

1. `01-tableau-des-items.md` — les 8 énoncés (D/I, angles, fiches condensées).
2. `02-plan-de-melange-graine-227427.md` — l'ordre de passation RÉEL (verdicts c1-c6 rejoués, 5 passes) + graine dérivée + finding borne de run.
3. `03-signatures-registre.md` — SIG-2.7-01 (dealbreaker, SQL) + SIG-2.7-02 (horizon) + SIG-2.7-03 (friction des rôles).
4. `04-slots-de-miroir.md` — le miroir MOYEN et ses verrous.
5. `05-ecran-d-intro.md` — l'écran d'entrée (verbatim mission).
6. `06-fiche-computation-EXEMPLE.yaml` — l'item Q2.7-01 aux 5 canaux.
7. `07-miroir.md` — 3 profils respectés (avec leurs ombres en couple).
8. `cartes.yaml` — 3 variantes de carte (étage 1, charte C1-C11).

## Conformité a11y

Conformité a11y : WCAG 2.1 AA visée (contrastes ≥ 4,5:1, cibles tactiles ≥ 44×44 px, support lecteur d'écran, respect du mode réduit-animations). Implémentation : voir spec quête 1.1 §10 et styles.css.

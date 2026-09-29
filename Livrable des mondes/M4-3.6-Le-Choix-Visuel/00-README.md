# QUÊTE 3.6 « LE CHOIX VISUEL » — FICHE DE CADRAGE PUIS LECTURE DU LIVRABLE

> Monde M4 · 🆓 gratuit · MVP · **8 paires d'images A/B — TÂCHE comportementale (pas de Likert)** · Codes gelés Q3.6-P1 → Q3.6-P8
> **4 paires d'origine VERBATIM du source gelé + 4 paires neuves proposées** (B.3 : conversion + production neuve déclarée par paire)
> Lecture carte : **brise-glace du Mode Invisible** · lecture sécurité faible éventuelle : **CANAL SIGNAL null + note Arbitrage 4**
> Source : Constitution v2.1 [5] (« Le choix visuel ») · refonte (§ B — « Les paires d'images projectives ») · mission V9.F

## 🧭 FICHE DE CADRAGE (lire avant tout le reste)

| Champ | Cadrage |
|---|---|
| **Ce que ça mesure** | **La projection par le choix, sans contenu clinique** (refonte verbatim) : on montre deux images, on demande celle qui « parle » — le choix révèle des orientations que la question directe n'attrape pas. Double capture : ① un **complément implicite** aux dimensions déclarées (style de vie, sociabilité, besoin d'espace) ; ② surtout, un **trésor conversationnel** — chaque paire choisie devient un prompt de conversation naturel du Mode Invisible (« ton intérieur choisi dit quelque chose... »). |
| **Cadre scientifique assumé (refonte verbatim)** | C'est une **mesure FAIBLE**, traitée comme signal complémentaire (**jamais seule, jamais clinique**) et comme contenu conversationnel premier. 90 secondes. Le miroir en parle comme d'une teinte, jamais d'un diagnostic ; les paires ne participent JAMAIS seules à un score de compatibilité. |
| **Les 8 paires** | **Les 4 paires d'origine (verbatim refonte)** : les intérieurs (maison vs dehors) · les paysages (stabilité vs horizons) · les tables (festin vs sobre à deux) · les scènes (groupe vs tête-à-tête). **Les 4 paires neuves (même logique, angles complémentaires — proposées par la production)** : les deux matins (café lent vs marché du quartier) · les deux portes (hospitalité vs cocon) · les deux dimanches (cadencé vs sans programme) · les deux fenêtres (ville vivante vs calme vert). Les assets graphiques sont produits par le design PLUS TARD — la présente livraison porte les **descriptions + le scoring**. |
| **Format de réponse** | Choix binaire par paire (A ou B) — pas d'échelle, pas de « je ne sais pas » (le choix est le message ; l'abstention n'existe pas, précédent 1.5) · **pas d'orientation D/I** (hors Likert — c5 sans-objet par config) · pas de mélange d'options (A/B : l'ordre gauche-droite est un paramètre de design, documenté plus bas). |
| **Mélange** | **Ordre des paires seedé** — graine **236427** (graine-mère 210427 + 1000 × ordinal 26, convention concaténée mission V9 — aucune collision active) · Fisher-Yates seedé sur les 8 paires · verdicts c1-c6 **rejoués (6/6, 0 échange — le tirage de la graine est déjà optimal, objectif totalement nul)** · run_max 0 = **non mesuré** (sans-objet par config — hors Likert, précédent 1.4/1.5). |
| **Signatures attendues** | **SIG-3.6-01 « Le lecteur d'images »** : 3 lecteurs par dominante d'ancrage (ancré-dominant ≥ 6 · équilibre 3-5 · horizon-dominant ≤ 2 — partition exclusive + exhaustive de 0 à 8, À VALIDER PAR LE COMITÉ). **SIG-3.6-02 « La lecture complémentaire »** (CANAL SIGNAL : **signal_id null**) : la paire des portes porte une lecture sécurité FAIBLE éventuelle (contrôle/isolement) — **lecture complémentaire, code à arbitrer par le comité si requis (Arbitrage 4)** : jamais un signal actif sans décision comité, jamais au rendu. |
| **Slots prévus** | Miroir **LÉGER** (8 paires → gabarit 80-150 mots, Constitution [7]) · 3 profils (l'ancre / l'équilibre / l'horizon) · les cartes sont des **brise-glaces du Mode Invisible** (l'amorce de conversation est le produit principal). |
| **Points de doctrine** | ① Aucune image pathologique : les deux choix de chaque paire sont enviables — l'équivalence de valeur est le principe même (précédent 1.5). ② La mesure faible ne se combine JAMAIS seule : elle enrichit une conversation, elle ne calcule pas un couple. ③ Gratuit ne présuppose jamais premium ([6]). ④ Aucune trame ▲ (vérifié au registre — n_trames = 0). |

## 📖 Lecture des fichiers (ordre conseillé)

1. `01-tableau-des-paires.md` — les 8 paires (descriptions A/B, sources verbatim/neuf, scoring, canal signal).
2. `02-plan-de-melange-graine-236427.md` — l'ordre de passation RÉEL (verdicts c1-c6 rejoués, 5 passes).
3. `03-signatures-registre.md` — SIG-3.6-01 « Le lecteur d'images » + SIG-3.6-02 « La lecture complémentaire » (Arbitrage 4).
4. `04-slots-de-miroir.md` — le miroir LÉGER et ses verrous (mesure faible, jamais seule).
5. `05-ecran-d-intro.md` — l'écran d'entrée (ton, pas de bonnes réponses).
6. `06-fiche-computation-EXEMPLE.yaml` — la paire Q3.6-P1 aux 5 canaux (format adapté aux paires).
7. `07-miroir.md` — 3 profils respectés (l'ancre / l'équilibre / l'horizon), gabarit LÉGER.
8. `cartes.yaml` — 3 variantes de carte (brise-glaces du Mode Invisible).

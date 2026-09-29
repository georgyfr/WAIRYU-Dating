# QUÊTE 3.2 « TON QUOTIDIEN » — FICHE DE CADRAGE PUIS LECTURE DU LIVRABLE

> Monde M4 · 🆓 gratuit · P1.5 · **8 items Likert** · Codes gelés Q3.2-01 → Q3.2-08
> Paires miroir : 3 paires R6 (1 D + 1 I) + 2 items pivots — arithmétique 5/3 documentée, **À VALIDER PAR LE COMITÉ**
> Source : Constitution v2.1 [5] (« Ton quotidien ») · refonte (Ajout 3 — « les frictions de la vraie vie », planificateur/improvisateur 5 + ordre/désordre domestique 3) · mission V9.B

## 🧭 FICHE DE CADRAGE (lire avant tout le reste)

| Champ | Cadrage |
|---|---|
| **Ce que ça mesure** | Deux micro-traits que les couples citent spontanément et que la psychologie académique ignore (refonte verbatim) : **① la planification** (planificateur ↔ improvisateur — les vacances, les rendez-vous, la vie : deux styles opposés = friction quotidienne, 5 items) et **② l'ordre domestique** (ordre ↔ désordre — « ton bordel chez toi » est un motif de rupture réel, statistiquement sous-estimé par la science, sur-estimé par les couples, 3 items). Construction Wairyu — B.3 : **production neuve déclarée** (le refonte porte les axes et les comptes, aucun texte d'item). |
| **Neutralité des styles** | Planifier et improviser = **deux façons égales d'habiter un agenda** ; l'ordre et le désordre domestique = **deux seuils de tolérance**, ni l'un ni l'autre vertu ou défaut. Les orientations D/I sont des directions techniques des axes, jamais des jugements (précédent 2.2/3.1). |
| **Format de réponse** | Likert 5 niveaux (Arbitrage 2) · D/I recodés `6 − r` (Arbitrage 1) · **paires miroir R6** : 3 paires (les sorties · le fil de la journée · la place des choses) + 2 pivots (les rendez-vous notés · le seuil de tolérance) — l'arithmétique 5/3 rend la couverture R6 intégrale impossible sans rompre le cadrage mission ; écart documenté au 01, **À VALIDER PAR LE COMITÉ**. |
| **Mélange** | RÉEL — graine **232427** (graine-mère 210427 + 1000 × ordinal 22, convention concaténée mission V9) · ⚠ **COLLISION MAÎTRISÉE** : 232427 fut la graine RETIRÉE de 2.2 (Vague 6, re-tirée **222427** en V8 — artefacts archivés git, commit `307f33e` puis plan V8.A). La réutilisation est PERMISE (règle mission V9.B : jamais de collision avec une graine ACTIVE — vérifié : aucune graine active n'occupe 232427) **avec note de provenance au plan** — le déterminisme est préservé : deux quêtes différentes, deux espaces de tirage indépendants. · **Outil DÉDIÉ** `melange-biaxes.py` (voir 02) — c1/c4 sans-objet par arithmétique (5 items d'un même axe sur 8 positions : une adjacence forcée, envergure c4 infaisable), minimums réels documentés (1 adjacence · déficit 6), run max 1, **5 passes identiques**. |
| **Signatures attendues** | **SIG-3.2-01 « Le profil quotidien »** : lecture à 2 axes (planification × ordre) — 4 quadrants + central, bornes FM-019 (À VALIDER PAR LE COMITÉ). **SIG-3.2-02 « La friction domestique »** : écart fort planificateur × improvisateur entre deux profils → signal conversationnel « à aborder tôt » (les vacances, les rendez-vous, les week-ends) — **jamais une pénalité dure, jamais une élimination** ; le désordre fort croisé d'un ordre fort documente la même friction (le seuil de tolérance partagé se négocie, il ne se subit pas). |
| **Slots prévus** | Miroir **MOYEN** (8 items → gabarit 150-250 mots, Constitution [7]) · 5 profils (4 quadrants + central, partition exclusive + exhaustive par axe le plus dévié). |
| **Points de doctrine** | ① Le désordre n'est pas une paresse : le miroir le traite en fonctionnement, jamais en manquage (leçon de la refonte : « le désordre chronique est un fonctionnement, pas de la paresse »). ② La friction est documentée au registre fréquentiel — elle se nomme tôt, elle ne prédit rien de certain. ③ Gratuit ne présuppose jamais premium ([6]). ④ Aucune trame ▲ (vérifié au registre — n_trames = 0). |

## 📖 Lecture des fichiers (ordre conseillé)

1. `01-tableau-des-items.md` — les 8 énoncés (D/I, 2 axes, fiches condensées) + l'arithmétique R6 documentée.
2. `02-plan-de-melange-graine-232427.md` — l'ordre de passation RÉEL (outil dédié, minimums documentés) + provenance de la graine + finding borne.
3. `03-signatures-registre.md` — SIG-3.2-01 « Le profil quotidien » + SIG-3.2-02 « La friction domestique ».
4. `04-slots-de-miroir.md` — le miroir MOYEN et ses verrous.
5. `05-ecran-d-intro.md` — l'écran d'entrée (ton, neutralité des styles).
6. `06-fiche-computation-EXEMPLE.yaml` — l'item Q3.2-01 aux 5 canaux.
7. `07-miroir.md` — 5 profils respectés (4 quadrants + central), gabarit MOYEN.
8. `cartes.yaml` — 5 variantes de carte (étage 1, charte C1-C11).

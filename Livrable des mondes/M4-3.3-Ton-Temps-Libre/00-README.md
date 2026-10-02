# QUÊTE 3.3 « TON TEMPS LIBRE » — FICHE DE CADRAGE PUIS LECTURE DU LIVRABLE

> Monde M4 · 🆓 gratuit · **MVP (trame) / P1.5 (quête)** · **8 items carte + 4▲ CSR = 12 items** · Codes gelés Q3.3-01 → Q3.3-08 + Q3.3-T09 → T12
> Paires miroir : 4 paires R6 (2 par volet carte) · **les 4▲ sont des TRAMES SÉCURITÉ — aucun énoncé dans ce dépôt** (document trames hors dépôt, règle 11-b)
> Source : Constitution v2.1 [5] (« Ton temps libre ») · refonte (trou n° 1 « les loisirs ont disparu » + trou n° 2 « les addictions comportementales ») · mission V9.C

## 🧭 FICHE DE CADRAGE (lire avant tout le reste)

| Champ | Cadrage |
|---|---|
| **Ce que ça mesure** | **① Le MODE** du temps libre (4 items) : **centrifuge** — tu nourris dehors, tu sors, tu consommes ton temps libre dehors · **centripète** — tu te nourris chez toi, tu restes, tu bricoles, tu es là · c'est « là que ça casse » (refonte verbatim : l'un se sent délaissé, l'autre étouffé). **② Le FOND des loisirs** (4 items) : l'ancrage (une activité de fond qui porte) et le partage (avec d'autres / en solo) — l'homogamie des loisirs documente qu'**au moins une activité de fond partagée → satisfaction supérieure**. **③ Les CONSOMMATIONS (4▲ CSR)** : les consommations comportementales **déguisées en habitudes quotidiennes** — écrans du soir qui débordent, miser/tenter la chance, achats non prévus, travail-refuge — formulations FRANCHES, indiscernables, jamais édulcorées (document trames hors dépôt). Composition : 8 carte (mode 4 + fond 4) + 4▲ = 12 — la refonte proposait 8+8, la mission V9.C tranche à 8+4▲ (mutation documentée). B.3 : **production neuve déclarée** pour les énoncés (cadrages verbatim au refonte, aucun texte d'item). |
| **Neutralité du mode** | Sors et reste = **deux façons égales de se nourrir** : le centrifuge n'est pas « instable », le centripète n'est pas « casanier-rétréci » — la friction n'apparaît qu'au CROISEMENT, en information conversationnelle. |
| **Format de réponse** | Likert 5 niveaux (Arbitrage 2) · D/I recodés `6 − r` (Arbitrage 1) · **4 paires miroir R6** (la recharge · le week-end · l'activité de fond · le partage) · **les 4▲ : dimension null, orientation D, ancrage INTERDIT, aucun slot, aucune citation** (règles d'administration, document trames Partie 0). |
| **Mélange** | RÉEL — graine **233427** (graine-mère 210427 + 1000 × ordinal 23, convention concaténée mission V9 — aucune collision active) · Fisher-Yates seedé + réparation déterministe (outil générique) · verdicts c1-c6 **rejoués (6/6, 2 échanges, run max 2, 5 passes identiques)** · **trames ancrées par construction : positions 3 · 6 · 9 · 12** (1 trame en fin de bloc uniforme — c3). |
| **Signatures attendues** | **SIG-3.3-01 « Le mode »** : blocs centrifuge / mixte / centripète (bornes FM-019 — À VALIDER PAR LE COMITÉ). **SIG-3.3-02 « Le croisement des modes »** : centrifuge × centripète → friction documentée (l'un se sent délaissé, l'autre étouffé) → signal conversationnel « à aborder tôt » — jamais de pénalité dure. **SIG-3.3-03 « La vigilance des consommations »** (signal **CSR**, côté moteur SEUL) : les 4▲ alimentent un signal interne de vigilance — **croisement avec les réalités déclarées (2.4) : incohérence déclaré × consommation → fiabilité du profil ajustée** ; jamais un affichage, jamais une exclusion, jamais une stigmatisation ; la sortie existe (le score suit la demi-vie des signaux). |
| **Slots prévus** | Miroir **MOYEN** (12 items → gabarit 150-250 mots, Constitution [7]) · 3 profils par le mode (centrifuge / mixte / centripète) · l'homogamie des loisirs vit dans l'ombre (registre fréquentiel). |
| **Points de doctrine** | ① Les 4▲ passent PARMI LES AUTRES (même rendu, même échelle, même progression) — le camouflage vient du thème (habitudes quotidiennes), jamais d'un édulcorage. ② Le CSR ne se raconte JAMAIS : aucune trame n'apparaît dans un miroir, une carte, un rappel — ni au match, ni au premium. ③ Gratuit ne présuppose jamais premium ([6]). ④ Le mot « consommations » et le sigle CSR restent côté moteur. |

## 📖 Lecture des fichiers (ordre conseillé)

1. `01-tableau-des-items.md` — les 8 énoncés carte (D/I, 2 volets) + les 4 lignes-réservées ▲ (aucun énoncé ici).
2. `02-plan-de-melange-graine-233427.md` — l'ordre de passation RÉEL (verdicts c1-c6 rejoués, trames ancrées 3·6·9·12).
3. `03-signatures-registre.md` — SIG-3.3-01/02 (mode, croisement) + SIG-3.3-03 (CSR moteur seul, croisement 2.4).
4. `04-slots-de-miroir.md` — le miroir MOYEN et ses verrous (dont : aucune trame ne se raconte).
5. `05-ecran-d-intro.md` — l'écran d'entrée (ton, neutralité du mode).
6. `06-fiche-computation-EXEMPLE.yaml` — l'item Q3.3-01 aux 5 canaux.
7. `07-miroir.md` — 3 profils respectés (centrifuge / mixte / centripète), gabarit MOYEN.
8. `cartes.yaml` — 3 variantes de carte (étage 1, charte C1-C11).

## Conformité a11y

Conformité a11y : WCAG 2.1 AA visée (contrastes ≥ 4,5:1, cibles tactiles ≥ 44×44 px, support lecteur d'écran, respect du mode réduit-animations). Implémentation : voir spec quête 1.1 §10 et styles.css.

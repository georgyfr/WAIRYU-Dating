# LIVRABLE 1 — LES 8 ITEMS DE LA QUÊTE 2.7 « TA VISION DE LA FAMILLE »

> Légende de la fiche de computation condensée — `C:` carte · `S:` signal · `F:` fiabilité · `M:` modulation · `A:` ancrage.
> Échelle : Likert 5 niveaux (Arbitrage 2) · Orientation : D = direct, I = inversé recodé `6 − réponse` (Arbitrage 1).
> **4 paires (1 D + 1 I — paires miroir requises, règle R6)** : désir d'enfants (01-02) ·
> horizon temporel (03-04) · répartition des rôles (05-06) · la famille élargie (07-08 —
> zone rôles au sens large).
> ⚠ **Mission V8.C — re-spécification tracée** : la mission répartit « désir d'enfants (3 items),
> horizon temporel (2), répartition des rôles (3 — travail/carrière domestique, **place des
> familles élargies**) ». L'angle « modèle d'éducation » (Vague 6) cède la place à **la famille
> élargie** (items 07/08 réécrits — production neuve déclarée, B.3 : aucun source gelé pour cette
> quête ; textes Vague 6 archivés dans l'historique git). La répartition stricte 3/2/3 de la
> mission romprait deux paires miroir R6 (angles impairs) — la production conserve 4 paires R6
> couvrant les MÊMES contenus (l'intention directe 01 porte le oui/indécis/non ; l'horizon 03/04
> porte l'horizon et les conditions ; la répartition 05-08 porte travail/carrière, domestique et
> familles élargies) — écart d'arithmétique **À VALIDER PAR LE COMITÉ**.
> ⚠ **Aucune trame ▲** : quête déclarative directe — aucun énoncé réservé, aucune balise de trame.
> ⚠ Le dealbreaker parentalité (|désir_A − désir_B| ≥ 2 → score 0) est un MÉCANISME MOTEUR — il n'apparaît
> dans AUCUN énoncé, AUCUN rendu (verrou [3]).

| Code (gelé) | Énoncé | Or. | Angle | Facette | ▲ (signal_id) | Fiche de computation — 5 canaux |
|---|---|---|---|---|---|---|
| Q2.7-01 | Des enfants font partie du projet que je me fais. | **D** | désir d'enfants | le projet affirmé | — | C: désir→score de quête (dealbreaker moteur) · S: SIG-2.7-01 (SQL pré-filtrage) · F: paire R6 avec 02 · M: — (le dealbreaker n'échelonne pas, il coupe : aucun degré rendu) · A: rappel OK |
| Q2.7-02 | Je me construis sans enfants dans le plan. | **I** | désir d'enfants | le projet sans enfants | — | C: désir (recodé 6−r) · S: idem 01 · F: paire R6 avec 01 · M: idem 01 · A: rappel OK |
| Q2.7-03 | Le projet enfants, chez moi, attend que le reste soit posé. | **D** | horizon temporel | l'horizon posé après | — | C: horizon→score de quête · S: SIG-2.7-02 (écart > 4 ans ⚠) · F: paire R6 avec 04 · M: signal conversationnel, jamais élimination · A: rappel OK |
| Q2.7-04 | Le projet enfants, chez moi, appelle à être lancé tôt. | **I** | horizon temporel | l'horizon lancé tôt | — | C: horizon (recodé) · S: idem 03 · F: paire R6 avec 03 · M: idem 03 · A: rappel OK |
| Q2.7-05 | Carrière et maison se règlent à deux, sans rôle assigné. | **D** | répartition des rôles | le partage négocié | — | C: rôles→score de quête · S: — · F: paire R6 avec 06 · M: croisable avec 2.6 (même monde — moteur) · A: rappel OK |
| Q2.7-06 | Chez moi, chacun garde son domaine attitré. | **I** | répartition des rôles | les domaines attitrés | — | C: rôles (recodé) · S: — · F: paire R6 avec 05 · M: idem 05 · A: rappel OK |
| Q2.7-07 | La famille élargie a sa place dans ma vie de famille. | **D** | la famille élargie | la famille élargie accueillie | — | C: famille élargie→score de quête · S: SIG-2.7-03 (friction des rôles — zone répartition) · F: paire R6 avec 08 · M: croisable avec 2.6 (même monde — moteur) · A: rappel OK |
| Q2.7-08 | Ma vie de famille se construit d'abord entre nous deux. | **I** | la famille élargie | le noyau choisi | — | C: famille élargie (recodé 6−r) · S: idem 07 · F: paire R6 avec 07 · M: idem 07 · A: rappel OK |

## Usage moteur (lecture du contrat — cadrage)

> **Score désir** = moyenne (échelle 1-5) de Q2.7-01 et de Q2.7-02 recodé (`6 − r`) → **dealbreaker
> parentalité** : |désir_A − désir_B| ≥ 2 → score de compatibilité = 0, **SQL pré-filtrage** (voir 03).
> Scores d'angle (horizon, rôles, famille élargie) = moyennes recodées normalisées — compatibilité
> par distance pondérée, jamais par seuil (l'horizon porte le signal conversationnel SIG-2.7-02,
> la zone répartition porte SIG-2.7-03 — friction des rôles —, les autres ne coupent jamais).

## Décisions de composition documentées (domaine réservé [9] — propositions)

1. **Le désir sans chiffres** : aucun énoncé ne demande « quand » ni « combien » en termes datés —
   l'horizon se mesure en proximité relative (03/04), le « combien » reste à la vie de la personne.
   Poser des chiffres dans un énoncé figerait une question qui doit rester ouverte à l'écran de
   discussion (« à aborder tôt »), pas au questionnaire.
2. **Q2.7-02 « sans enfants dans le plan »** : l'inverse du désir n'est pas « je refuse les enfants »
   (trop fermé pour les profils ambivalents) mais « je me construis sans » — le projet actuel est
   décrit, le futur n'est pas verrouillé ; le recodage le replie proprement sur l'axe unique du désir.
3. **Q2.7-06 « domaine attitré »** : la répartition par domaines est décrite comme une organisation,
   pas comme un archaïsme — neutralité (certaines familles la choisissent) ; le score mesure, il ne
   modernise pas.
4. **Q2.7-07/08 — la famille élargie, pas l'éducation (mission V8.C)** : l'angle 07/08 mesure la
   PLACE de la famille élargie (accueillie ↔ noyau choisi), en termes de vie de famille générale —
   aucune des deux postures n'est posée en vertu ou en défaut (C4) ; l'ancien angle « modèle
   d'éducation » (Vague 6) est archivé dans l'historique git.
5. **Croisement 2.6 × 2.7 autorisé ici** (même monde M3, quêtes Libre) : les rôles (05/06) croisent
   la répartition carrière/famille (2.6) côté moteur — jamais au rendu du miroir de quête seule.

## Contrôles mécaniques passés

| Contrôle | Résultat |
|---|---|
| ≤ 12 mots / énoncé (max constaté : 11) | ✅ |
| 1re personne, présent de l'indicatif | ✅ |
| Zéro double négation | ✅ |
| Zéro fréquence ambiguë | ✅ |
| Neutralité normative (désir, indécision, absence : trois vies dignes ; élargie/noyau sans vertu) | ✅ |
| Zéro chiffre « quand/combien » dans les énoncés | ✅ |
| Paires R6 complètes : 4 angles × (1 D + 1 I) | ✅ |
| Orientation conforme à la config CI (`ci/quetes/2.7.json`) : D impairs · I pairs | ✅ |
| Aucun item de trame ▲, aucun énoncé réservé | ✅ |
| Zéro mention du dealbreaker dans un énoncé | ✅ |

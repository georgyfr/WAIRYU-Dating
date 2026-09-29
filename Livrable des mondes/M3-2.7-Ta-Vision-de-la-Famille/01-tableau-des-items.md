# LIVRABLE 1 — LES 8 ITEMS DE LA QUÊTE 2.7 « TA VISION DE LA FAMILLE »

> Légende de la fiche de computation condensée — `C:` carte · `S:` signal · `F:` fiabilité · `M:` modulation · `A:` ancrage.
> Échelle : Likert 5 niveaux (Arbitrage 2) · Orientation : D = direct, I = inversé recodé `6 − réponse` (Arbitrage 1).
> **4 angles × 2 (1 D + 1 I — paires miroir requises, règle R6)** : désir d'enfants (01-02) ·
> horizon temporel (03-04) · répartition des rôles (05-06) · modèle d'éducation (07-08).
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
| Q2.7-07 | Une éducation qui cadre ferme aide un enfant à grandir. | **D** | modèle d'éducation | le cadre ferme | — | C: cadre→score de quête · S: — · F: paire R6 avec 08 · M: — (aucune prescription : le score décrit, ne conseille pas) · A: rappel OK |
| Q2.7-08 | Un enfant grandit mieux quand le cadre s'adapte à lui. | **I** | modèle d'éducation | le cadre qui s'adapte | — | C: cadre (recodé) · S: — · F: paire R6 avec 07 · M: idem 07 · A: rappel OK |

## Usage moteur (lecture du contrat — cadrage)

> **Score désir** = moyenne (échelle 1-5) de Q2.7-01 et de Q2.7-02 recodé (`6 − r`) → **dealbreaker
> parentalité** : |désir_A − désir_B| ≥ 2 → score de compatibilité = 0, **SQL pré-filtrage** (voir 03).
> Scores d'angle (horizon, rôles, cadre) = moyennes recodées normalisées — compatibilité par distance
> pondérée, jamais par seuil (l'horizon porte le signal conversationnel SIG-2.7-02, les autres ne
> coupent jamais).

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
4. **Q2.7-07/08 en termes d'enfant, pas de parent** : la fermeté et l'adaptation sont décrites du
   côté de ce qui AIDE l'enfant (« aide à grandir », « grandit mieux ») — aucune des deux postures
   parentales n'est posée en vertu ou en défaut (C4).
5. **Croisement 2.6 × 2.7 autorisé ici** (même monde M3, quêtes Libre) : les rôles (05/06) croisent
   la répartition carrière/famille (2.6) côté moteur — jamais au rendu du miroir de quête seule.

## Contrôles mécaniques passés

| Contrôle | Résultat |
|---|---|
| ≤ 12 mots / énoncé (max constaté : 11) | ✅ |
| 1re personne, présent de l'indicatif | ✅ |
| Zéro double négation | ✅ |
| Zéro fréquence ambiguë | ✅ |
| Neutralité normative (désir, indécision, absence : trois vies dignes ; ferme/doux sans vertu) | ✅ |
| Zéro chiffre « quand/combien » dans les énoncés | ✅ |
| Paires R6 complètes : 4 angles × (1 D + 1 I) | ✅ |
| Orientation conforme à la config CI (`ci/quetes/2.7.json`) : D impairs · I pairs | ✅ |
| Aucun item de trame ▲, aucun énoncé réservé | ✅ |
| Zéro mention du dealbreaker dans un énoncé | ✅ |

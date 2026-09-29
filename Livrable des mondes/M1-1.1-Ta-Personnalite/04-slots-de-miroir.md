# LIVRABLE 4 — SLOTS DE MIROIR ALIMENTÉS PAR LA QUÊTE 1.1

> 58 items → **MIROIR LOURD** (≥ 15 items) → gabarit **300-450 mots** (Constitution [7]).
> **Citations d'exemple** : rappel en TOUTES LETTRES — énoncé intégral mot pour mot, entre
> guillemets. L'`ancre_item` est un champ moteur distinct (yaml) qui ne franchit JAMAIS la chaîne
> rendue (Constitution [3] · FM-017) : aucun code, score ou sigle dans le texte utilisateur.

| Slot | Contenu | Degrés | Citation d'exemple (rendue en toutes lettres) | ancre_item (champ moteur — jamais rendu) |
|---|---|---|---|---|
| **S1 — La carte de tes traits** | Profil O C E A S : dimension saillante + dimension discrète, position dans le pool vivant (descriptif : « la plupart des membres hésitent ici », jamais « tu es au-dessus de la moyenne ») | percentile par dimension | « quand tu as répondu que "J'aime les conversations qui partent dans des idées inattendues." » | Q1.1-01 |
| **S2 — L'axe qui te tient** | Croisement Organisation × Stabilité émotionnelle (le contrôle et la tempête) | ancre / à l'affût / sous tension | « quand tu as répondu que "Je termine ce que je commence, même quand l'envie est passée." » · « quand tu as répondu que "Un imprévu de dernière minute ne me déstabilise pas longtemps." » | Q1.1-17 · Q1.1-41 |
| **S3 — Quand tes réponses se répondent** | Cohérence interne de la quête : croisement des inversés + concordance des doublons `02.r`/`11.r` → QFI (fonctionne dès la première passation sur les inversés ; se raffine quand les doublons entrent au flux, ≥ 2 semaines après l'original) | ferme (0 signal) / nuancée (1 signal) / à voix basse (≥ 2) | rappel des 2 réponses écartées, mot pour mot — JAMAIS les codes | dynamique (paires signalées, sans code au rendu) |
| **S4 — Ta place dans le groupe** | Croisement Énergie sociale × Ouverture (l'élan et la curiosité — la zone entre les sélecteurs V3 et V6 de la carte) | rassembleur·se / au bord du groupe / en retrait choisi | « quand tu as répondu que "Dans un groupe, je prends la parole sans forcer." » | Q1.1-25 |

## Définition moteur des ancres (extrait yaml — champs jamais rendus)

```yaml
slots:
  - id: S1-1.1
    nom: "La carte de tes traits"
    ancre_item: Q1.1-01        # champ MOTEUR — ne franchit jamais le rendu (FM-017)
  - id: S2-1.1
    nom: "L'axe qui te tient"
    ancre_item: [Q1.1-17, Q1.1-41]
  - id: S3-1.1
    nom: "Quand tes réponses se répondent"
    ancre_item: null           # rappel dynamique des réponses écartées, sans code au rendu
  - id: S4-1.1
    nom: "Ta place dans le groupe"
    ancre_item: Q1.1-25
```

Règle de fidélité des citations (FM-017) : le rappel rendu porte l'énoncé intégral entre guillemets,
mot pour mot, introduit en 2ᵉ personne — jamais reformulé, jamais abrégé, jamais accompagné de son
code. Les ancre_item ci-dessus vivent uniquement en métadonnées.

## verrous_de_slot (copie du contrat de slots — 9 verrous)

- Aucun code, score ou sigle franchit le rendu (Constitution [3] — aucune métadonnée visible). Les
  ancre_item sont des champs moteur, jamais rendus.
- Les 8 items ▲ (Q1.1-T01 → T08) n'alimentent **AUCUN** slot (interdit structurel — la trame
  sécurité n'a pas d'étage de restitution, jamais au match, jamais dans les portraits, jamais au
  premium).
- Volume d'ombre ≥ volume de lumière sur l'ensemble du miroir (Constitution [2]).
- Chaque tendance d'ombre rendue par ces slots s'ancre dans une situation de couple concrète —
  jamais un trait abstrait seul (verrou d'ombre n°1, FM-017).
- Chaque tendance d'ombre nomme le coût pour l'utilisateur ET le coût pour l'autre — les deux, sans
  exception (verrou d'ombre n°2, FM-017).
- Les conséquences sont au conditionnel fréquentiel (« conduit fréquemment à », « la recherche
  documente que ») — jamais au futur certain (Constitution [2]).
- Les croisements inter-mondes du DOMAINE DU SOI (M1×M2) sont interdits ici : ils vivent au Portrait
  de Domaine (Constitution [5]).
- Registre probabiliste : conséquences au conditionnel fréquentiel, jamais au futur certain.
- Percentiles : toujours descriptifs — comparaison normative interdite.
